import { type NextRequest, NextResponse } from "next/server"
import { handleFileUpload } from "@/lib/integrations/storage"
import { verifyAuth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.success || !authResult.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const projectId = formData.get("projectId") as string | undefined

    // Handle file upload
    const results = await handleFileUpload(formData, authResult.user.id, projectId)

    // Check if any uploads failed
    const hasErrors = results.some((result) => !result.success)
    const successCount = results.filter((result) => result.success).length

    return NextResponse.json({
      success: !hasErrors || successCount > 0,
      results,
      message: hasErrors
        ? `${successCount} of ${results.length} files uploaded successfully`
        : `All ${results.length} files uploaded successfully`,
    })
  } catch (error) {
    console.error("❌ Upload API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Handle file downloads for local storage
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filename = searchParams.get("filename")

    if (!filename) {
      return NextResponse.json({ error: "Filename required" }, { status: 400 })
    }

    // Verify authentication for file access
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { storageService } = await import("@/lib/integrations/storage")
    const fileBuffer = await storageService.getFile(filename)

    if (!fileBuffer) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Determine content type
    const contentType = getContentType(filename)

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("❌ File download error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function getContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase()
  const contentTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
    pdf: "application/pdf",
    txt: "text/plain",
    js: "text/javascript",
    ts: "text/typescript",
    json: "application/json",
    css: "text/css",
    html: "text/html",
    md: "text/markdown",
  }
  return contentTypes[ext || ""] || "application/octet-stream"
}
