import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { type, roomId, userId, data } = await request.json()

    // Broadcast WebRTC signaling data to room participants
    await supabase.channel(`webrtc:${roomId}`).send({
      type: "broadcast",
      event: "webrtc_signal",
      payload: {
        type,
        userId,
        data,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("WebRTC signaling error:", error)
    return NextResponse.json({ error: "Signaling failed" }, { status: 500 })
  }
}
