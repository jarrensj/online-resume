import { NextRequest, NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server"
import { createClerkSupabaseClient } from "@/app/lib/db"
import { sanitizeSocialFields, SOCIAL_FIELD_KEYS, emptySocialFields } from "@/app/lib/socials"

const SOCIAL_SELECT = SOCIAL_FIELD_KEYS.join(", ")

export async function GET(request: NextRequest) {
  try {
    const { userId } = getAuth(request)

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createClerkSupabaseClient()

    const { data, error } = await supabase
      .from("user_profiles")
      .select(SOCIAL_SELECT)
      .eq("clerk_user_id", userId)
      .single()

    if (error) {
      if (error.code === "PGRST116") {
        return NextResponse.json({ socials: emptySocialFields() }, { status: 200 })
      }

      console.error("Error fetching social links:", error)
      return NextResponse.json({ error: "Failed to fetch social links" }, { status: 500 })
    }

    return NextResponse.json({ socials: data })
  } catch (error) {
    console.error("Error in socials GET API:", error)
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
    const socialFields = sanitizeSocialFields(body)

    if (Object.keys(socialFields).length === 0) {
      return NextResponse.json({ error: "No social fields provided" }, { status: 400 })
    }

    const supabase = createClerkSupabaseClient()

    const { data: existingProfile, error: fetchError } = await supabase
      .from("user_profiles")
      .select("id")
      .eq("clerk_user_id", userId)
      .single()

    if (fetchError || !existingProfile) {
      if (fetchError && fetchError.code !== "PGRST116") {
        console.error("Error checking user profile for social update:", fetchError)
      }
      return NextResponse.json({ error: "User profile not found. Please create a username first." }, { status: 404 })
    }

    const timestamp = new Date().toISOString()

    const { data, error } = await supabase
      .from("user_profiles")
      .update({
        ...socialFields,
        updated_at: timestamp,
      })
      .eq("clerk_user_id", userId)
      .select(SOCIAL_SELECT)
      .single()

    if (error) {
      console.error("Error updating social links:", error)
      return NextResponse.json({ error: "Failed to update social links" }, { status: 500 })
    }

    return NextResponse.json({ success: true, socials: data })
  } catch (error) {
    console.error("Error in socials PUT API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

