import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

// Vercel Cron: runs daily at 9am UTC
// Finds users who haven't been active in 24h and sends a check-in message
export const runtime = "edge"

export async function GET(request: Request) {
  // Verify cron secret (optional but recommended)
  const authHeader = request.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          }
        }
      }
    )

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    // Find profiles that haven't had a check-in in 24h
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, user_id, display_name, structured_memory")
      .eq("has_onboarded", true)
      .or(`last_check_in.is.null,last_check_in.lt.${yesterday}`)

    if (!profiles || profiles.length === 0) {
      return NextResponse.json({ message: "No users to check in on", sent: 0 })
    }

    // For each inactive user, we could create a system check-in message
    // The actual notification would be sent via a separate channel (email, push, etc.)
    // For now, mark them as "pinged" and log it
    const updates = profiles.map(profile => ({
      id: profile.id,
      last_check_in: new Date().toISOString(),
      // Could add a pending_check_in flag here to show a banner on next visit
    }))

    // Batch update last_check_in timestamps
    for (const update of updates) {
      await supabase
        .from("profiles")
        .update({ last_check_in: update.last_check_in })
        .eq("id", update.id)
    }

    return NextResponse.json({
      message: `Checked in on ${profiles.length} user(s)`,
      sent: profiles.length,
      userIds: profiles.map(p => p.user_id)
    })
  } catch (error) {
    console.error("Check-in cron error:", error)
    return new NextResponse(
      JSON.stringify({ message: "Internal server error" }),
      { status: 500 }
    )
  }
}
