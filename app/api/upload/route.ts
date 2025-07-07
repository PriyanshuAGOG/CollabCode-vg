import { type NextRequest, NextResponse } from "next/server"
import { storageService, handleFileUpload } from "@/lib/integrations/storage"
import { verifyAuth } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const { user, error } = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: error || "Authentication required" }, { status: 401 })
    }

    // Get form data
    const formData = await request.formData()
    const projectId = formData.get("projectId") as string

    // Handle file upload
    const results = await handleFileUpload(formData, user.id, projectId)

    // Check if any uploads failed
    const failures = results.filter((r) => !r.success)
    const successes = results.filter((r) => r.success)

    if (failures.length > 0 && successes.length === 0) {
      return NextResponse.json(
        {
          error: "All uploads failed",
          details: failures.map((f) => f.error),
        },
        { status: 400 },
      )
    }

    return NextResponse.json({
      success: true,
      results,
      uploaded: successes.length,
      failed: failures.length,
    })
  } catch (error) {
    console.error("Upload API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const { user, error } = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: error || "Authentication required" }, { status: 401 })
    }

    // Get query parameters
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get("projectId")

    // List files
    const files = await storageService.listFiles(projectId || undefined)

    return NextResponse.json({
      success: true,
      files,
      count: files.length,
    })
  } catch (error) {
    console.error("File list API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const { user, error } = await verifyAuth(request)
    if (!user) {
      return NextResponse.json({ error: error || "Authentication required" }, { status: 401 })
    }

    // Get file identifier from request body
    const { fileId } = await request.json()

    if (!fileId) {
      return NextResponse.json({ error: "File ID is required" }, { status: 400 })
    }

    // Delete file
    const success = await storageService.deleteFile(fileId)

    if (!success) {
      return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    })
  } catch (error) {
    console.error("File delete API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
