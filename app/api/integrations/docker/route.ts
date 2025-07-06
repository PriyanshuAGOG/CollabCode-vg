import { type NextRequest, NextResponse } from "next/server"
import { dockerIntegration } from "@/lib/integrations/docker"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")

  try {
    switch (action) {
      case "containers":
        const containers = await dockerIntegration.listContainers()
        return NextResponse.json({ containers })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Docker API Error:", error)
    return NextResponse.json({ error: "Docker API request failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, dockerfile, tag, image, name, ports } = body

    switch (action) {
      case "build":
        const buildResult = await dockerIntegration.buildImage(dockerfile, tag)
        return NextResponse.json({ result: buildResult })

      case "deploy":
        const deployResult = await dockerIntegration.deployContainer(image, name, ports)
        return NextResponse.json({ result: deployResult })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Docker API Error:", error)
    return NextResponse.json({ error: "Docker API request failed" }, { status: 500 })
  }
}
