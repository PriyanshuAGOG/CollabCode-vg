import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    const { type, table, record, old_record } = payload

    // Handle different webhook events
    switch (table) {
      case "messages":
        if (type === "INSERT") {
          // Broadcast new message to room subscribers
          await supabase.channel(`room:${record.room_id}`).send({
            type: "broadcast",
            event: "new_message",
            payload: record,
          })
        }
        break

      case "call_sessions":
        if (type === "INSERT") {
          // Notify room members about new call
          await supabase.channel(`room:${record.room_id}`).send({
            type: "broadcast",
            event: "call_started",
            payload: record,
          })
        } else if (type === "UPDATE" && record.ended_at) {
          // Notify about call ended
          await supabase.channel(`room:${record.room_id}`).send({
            type: "broadcast",
            event: "call_ended",
            payload: record,
          })
        }
        break

      case "profiles":
        if (type === "UPDATE" && old_record.status !== record.status) {
          // Broadcast user status change
          await supabase.channel("user_presence").send({
            type: "broadcast",
            event: "status_change",
            payload: {
              user_id: record.id,
              status: record.status,
            },
          })
        }
        break
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
