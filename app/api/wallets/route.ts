import { NextRequest, NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server"
import { createClerkSupabaseClient } from "@/app/lib/db"
import { sanitizeWalletFields, WALLET_FIELD_KEYS, emptyWalletFields } from "@/app/lib/wallets"

const WALLET_SELECT = WALLET_FIELD_KEYS.join(", ")

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClerkSupabaseClient()

    const { data, error } = await supabase
      .from("user_profiles")
      .select(WALLET_SELECT)
      .eq("clerk_user_id", userId)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ wallets: emptyWalletFields() }, { status: 200 })
      }

      console.error("Error fetching wallet addresses:", error)
      return NextResponse.json({ error: "Failed to fetch wallet addresses" }, { status: 500 })
    }

    return NextResponse.json({ wallets: data })
  } catch (error) {
    console.error("Error in wallets GET API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = getAuth(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = (await request.json()) as Record<string, unknown>
    const walletFields = sanitizeWalletFields(body)

    if (Object.keys(walletFields).length === 0) {
      return NextResponse.json({ error: "No wallet fields provided" }, { status: 400 })
    }

    const supabase = createClerkSupabaseClient()

    const { data: existingProfile, error: fetchError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("clerk_user_id", userId)
      .single()

    if (fetchError || !existingProfile) {
      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking user profile for wallet update:", fetchError)
      }
      return NextResponse.json({ error: "User profile not found. Please create a username first." }, { status: 404 })
    }

    const timestamp = new Date().toISOString()

    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        ...walletFields,
        updated_at: timestamp,
      })
      .eq("clerk_user_id", userId)
      .select(WALLET_SELECT)
      .single()

    if (error) {
      console.error("Error updating wallet addresses:", error)
      return NextResponse.json({ error: "Failed to update wallet addresses" }, { status: 500 })
    }

    return NextResponse.json({ success: true, wallets: data })
  } catch (error) {
    console.error("Error in wallets PUT API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
