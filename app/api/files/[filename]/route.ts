import { type NextRequest, NextResponse } from "next/server"
import { storageService } from "@/lib/integrations/storage"
import path from "path"

export async function GET(request: NextRequest, { params }: { params: { filename: string } }) {
  try {
    const filename = params.filename

    // Security check - prevent directory traversal
    if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 })
    }

    // Get file from storage
    const fileBuffer = await storageService.getFile(filename)

    if (!fileBuffer) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    // Determine content type
    const ext = path.extname(filename).toLowerCase()
    const contentTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".txt": "text/plain",
      ".js": "text/javascript",
      ".ts": "text/typescript",
      ".json": "application/json",
      ".css": "text/css",
      ".html": "text/html",
      ".md": "text/markdown",
    }

    const contentType = contentTypes[ext] || "application/octet-stream"

    // Return file with appropriate headers
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000", // Cache for 1 year
        "Content-Disposition": `inline; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("File serve error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
