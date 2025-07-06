import { NextResponse } from "next/server"

export async function GET() {
  /* 
    The App Router runs in a serverless environment on Vercel,
    which cannot upgrade HTTP → WebSocket inside a route-handler.
    We respond with 426 so the client knows to fall back to the
    dedicated WS host configured via NEXT_PUBLIC_WS_ORIGIN.
  */
  return NextResponse.json({ message: "Upgrade Required: please connect directly to the WS server." }, { status: 426 })
}
