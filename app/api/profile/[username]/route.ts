import { NextRequest, NextResponse } from "next/server"
import { getCachedPublicProfile } from "@/app/lib/cache"

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params

    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    // Use cached public profile
    const profile = await getCachedPublicProfile(username.trim())

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json({ profile })

  } catch (error) {
    console.error('Error in profile API:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

