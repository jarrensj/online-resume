import { NextRequest, NextResponse } from "next/server"
import { getAuth } from "@clerk/nextjs/server"
import { createClerkSupabaseClient } from "@/app/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = getAuth(request)
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const { username } = await request.json()
    
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    // Create Supabase client
    const supabase = createClerkSupabaseClient()
    
    // Check if username already exists
    const { data: existingUser } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', username.trim())
      .single()
    
    if (existingUser) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 })
    }

    // Check if user already has a profile
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    if (userProfile) {
      // Update existing profile
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ 
          username: username.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('clerk_user_id', userId)
        .select()
        .single()

      if (error) {
        console.error('Error updating user profile:', error)
        return NextResponse.json({ error: "Failed to update username" }, { status: 500 })
      }

      return NextResponse.json({ success: true, profile: data })
    } else {
      // Create new profile
      const { data, error } = await supabase
        .from('user_profiles')
        .insert({
          clerk_user_id: userId,
          username: username.trim(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating user profile:', error)
        return NextResponse.json({ error: "Failed to create username" }, { status: 500 })
      }

      return NextResponse.json({ success: true, profile: data })
    }

  } catch (error) {
    console.error('Error in username API:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = getAuth(request)
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Parse the request body
    const { username } = await request.json()
    
    if (!username || typeof username !== 'string' || username.trim().length === 0) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    // Create Supabase client
    const supabase = createClerkSupabaseClient()
    
    // Check if the user has an existing profile
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('clerk_user_id', userId)
      .single()

    if (!existingProfile) {
      return NextResponse.json({ error: "User profile not found. Please create a username first." }, { status: 404 })
    }

    // Check if the new username is different from current username
    if (existingProfile.username === username.trim()) {
      return NextResponse.json({ error: "New username must be different from current username" }, { status: 400 })
    }
    
    // Check if new username already exists (but not for current user)
    const { data: usernameExists } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('username', username.trim())
      .neq('clerk_user_id', userId)
      .single()
    
    if (usernameExists) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 })
    }

    // Update the username
    const { data, error } = await supabase
      .from('user_profiles')
      .update({ 
        username: username.trim(),
        updated_at: new Date().toISOString()
      })
      .eq('clerk_user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating username:', error)
      return NextResponse.json({ error: "Failed to update username" }, { status: 500 })
    }

    return NextResponse.json({ success: true, profile: data, message: "Username updated successfully" })

  } catch (error) {
    console.error('Error in username PUT API:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get the authenticated user from Clerk
    const { userId } = getAuth(request)
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Create Supabase client
    const supabase = createClerkSupabaseClient()
    
    // Get user profile
    const { data: userProfile, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('clerk_user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching user profile:', error)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    return NextResponse.json({ profile: userProfile })

  } catch (error) {
    console.error('Error in username GET API:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
