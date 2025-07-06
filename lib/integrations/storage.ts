// File Storage Integration - Multiple Free Options
// Supports local storage and Cloudinary (25GB free tier)

import { v2 as cloudinary } from "cloudinary"
import fs from "fs/promises"
import path from "path"

export interface FileUploadResult {
  success: boolean
  url?: string
  publicId?: string
  filename?: string
  size?: number
  error?: string
}

export interface FileMetadata {
  filename: string
  originalName: string
  size: number
  mimeType: string
  uploadedAt: Date
  uploadedBy: string
  projectId?: string
}

// Configure Cloudinary if credentials are provided
if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
}

export class StorageService {
  private storageType: "local" | "cloudinary"
  private uploadDir: string

  constructor() {
    this.storageType = (process.env.STORAGE_TYPE as "local" | "cloudinary") || "local"
    this.uploadDir = process.env.UPLOAD_DIR || "./uploads"

    // Ensure upload directory exists for local storage
    if (this.storageType === "local") {
      this.ensureUploadDir()
    }
  }

  private async ensureUploadDir(): Promise<void> {
    try {
      await fs.access(this.uploadDir)
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true })
      console.log(`📁 Created upload directory: ${this.uploadDir}`)
    }
  }

  async uploadFile(file: File | Buffer, metadata: Partial<FileMetadata>): Promise<FileUploadResult> {
    try {
      if (this.storageType === "cloudinary") {
        return await this.uploadToCloudinary(file, metadata)
      } else {
        return await this.uploadToLocal(file, metadata)
      }
    } catch (error) {
      console.error("❌ File upload error:", error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Upload failed",
      }
    }
  }

  private async uploadToCloudinary(file: File | Buffer, metadata: Partial<FileMetadata>): Promise<FileUploadResult> {
    if (!process.env.CLOUDINARY_API_KEY) {
      throw new Error("Cloudinary credentials not configured")
    }

    const buffer = file instanceof File ? await file.arrayBuffer() : file
    const base64 = Buffer.from(buffer).toString("base64")
    const dataUri = `data:${metadata.mimeType || "application/octet-stream"};base64,${base64}`

    const uploadOptions = {
      resource_type: "auto" as const,
      folder: `collabcode/${metadata.projectId || "general"}`,
      public_id: metadata.filename?.replace(/\.[^/.]+$/, ""), // Remove extension
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      tags: ["collabcode", metadata.projectId || "general"],
      context: {
        uploadedBy: metadata.uploadedBy || "unknown",
        originalName: metadata.originalName || metadata.filename || "unknown",
      },
    }

    const result = await cloudinary.uploader.upload(dataUri, uploadOptions)

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      filename: metadata.filename,
      size: result.bytes,
    }
  }

  private async uploadToLocal(file: File | Buffer, metadata: Partial<FileMetadata>): Promise<FileUploadResult> {
    await this.ensureUploadDir()

    const filename = metadata.filename || `file-${Date.now()}`
    const filepath = path.join(this.uploadDir, filename)

    if (file instanceof File) {
      // Handle File object (from FormData)
      const buffer = Buffer.from(await file.arrayBuffer())
      await fs.writeFile(filepath, buffer)
    } else {
      // Handle Buffer
      await fs.writeFile(filepath, file)
    }

    const stats = await fs.stat(filepath)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    const url = `${baseUrl}/api/files/${filename}`

    return {
      success: true,
      url,
      filename,
      size: stats.size,
    }
  }

  async deleteFile(identifier: string): Promise<boolean> {
    try {
      if (this.storageType === "cloudinary") {
        await cloudinary.uploader.destroy(identifier)
        return true
      } else {
        const filepath = path.join(this.uploadDir, identifier)
        await fs.unlink(filepath)
        return true
      }
    } catch (error) {
      console.error("❌ File deletion error:", error)
      return false
    }
  }

  async getFile(filename: string): Promise<Buffer | null> {
    if (this.storageType === "local") {
      try {
        const filepath = path.join(this.uploadDir, filename)
        return await fs.readFile(filepath)
      } catch (error) {
        console.error("❌ File read error:", error)
        return null
      }
    }

    // For Cloudinary, files are accessed via URL
    return null
  }

  async listFiles(projectId?: string): Promise<FileMetadata[]> {
    if (this.storageType === "cloudinary") {
      try {
        const result = await cloudinary.search
          .expression(`folder:collabcode/${projectId || "*"}`)
          .sort_by([["created_at", "desc"]])
          .max_results(100)
          .execute()

        return result.resources.map((resource: any) => ({
          filename: resource.public_id.split("/").pop() + "." + resource.format,
          originalName: resource.context?.originalName || resource.filename,
          size: resource.bytes,
          mimeType: `${resource.resource_type}/${resource.format}`,
          uploadedAt: new Date(resource.created_at),
          uploadedBy: resource.context?.uploadedBy || "unknown",
          projectId: projectId,
        }))
      } catch (error) {
        console.error("❌ Error listing Cloudinary files:", error)
        return []
      }
    } else {
      try {
        const files = await fs.readdir(this.uploadDir)
        const fileMetadata: FileMetadata[] = []

        for (const filename of files) {
          const filepath = path.join(this.uploadDir, filename)
          const stats = await fs.stat(filepath)

          fileMetadata.push({
            filename,
            originalName: filename,
            size: stats.size,
            mimeType: this.getMimeType(filename),
            uploadedAt: stats.birthtime,
            uploadedBy: "unknown", // Would need to be stored separately
            projectId,
          })
        }

        return fileMetadata.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
      } catch (error) {
        console.error("❌ Error listing local files:", error)
        return []
      }
    }
  }

  private getMimeType(filename: string): string {
    const ext = path.extname(filename).toLowerCase()
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".doc": "application/msword",
      ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ".txt": "text/plain",
      ".js": "text/javascript",
      ".ts": "text/typescript",
      ".json": "application/json",
      ".css": "text/css",
      ".html": "text/html",
      ".md": "text/markdown",
      ".zip": "application/zip",
      ".tar": "application/x-tar",
      ".gz": "application/gzip",
    }
    return mimeTypes[ext] || "application/octet-stream"
  }

  // Utility methods
  validateFile(
    file: File,
    options?: {
      maxSize?: number
      allowedTypes?: string[]
      allowedExtensions?: string[]
    },
  ): { valid: boolean; error?: string } {
    const maxSize = options?.maxSize || 10 * 1024 * 1024 // 10MB default
    const allowedTypes = options?.allowedTypes || []
    const allowedExtensions = options?.allowedExtensions || []

    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds ${Math.round(maxSize / 1024 / 1024)}MB limit`,
      }
    }

    if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `File type ${file.type} is not allowed`,
      }
    }

    if (allowedExtensions.length > 0) {
      const extension = "." + file.name.split(".").pop()?.toLowerCase()
      if (!allowedExtensions.includes(extension)) {
        return {
          valid: false,
          error: `File extension ${extension} is not allowed`,
        }
      }
    }

    return { valid: true }
  }

  generateUniqueFilename(originalName: string, userId: string): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    const extension = path.extname(originalName)
    const baseName = path.basename(originalName, extension)

    return `${baseName}-${userId}-${timestamp}-${random}${extension}`
  }

  getStorageInfo(): {
    type: string
    configured: boolean
    limits: {
      maxFileSize: string
      allowedTypes: string[]
      storageLimit: string
    }
  } {
    return {
      type: this.storageType,
      configured: this.storageType === "cloudinary" ? !!process.env.CLOUDINARY_API_KEY : true,
      limits: {
        maxFileSize: this.storageType === "cloudinary" ? "100MB" : "10MB",
        allowedTypes: ["image/*", "text/*", "application/pdf", "application/json"],
        storageLimit: this.storageType === "cloudinary" ? "25GB (free tier)" : "Unlimited (local)",
      },
    }
  }
}

// Export singleton instance
export const storageService = new StorageService()

// Helper functions for Next.js API routes
export async function handleFileUpload(
  formData: FormData,
  userId: string,
  projectId?: string,
): Promise<FileUploadResult[]> {
  const files = formData.getAll("files") as File[]
  const results: FileUploadResult[] = []

  for (const file of files) {
    // Validate file
    const validation = storageService.validateFile(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp",
        "text/plain",
        "text/javascript",
        "text/css",
        "text/html",
        "application/json",
        "application/pdf",
      ],
    })

    if (!validation.valid) {
      results.push({
        success: false,
        error: validation.error,
      })
      continue
    }

    // Generate unique filename
    const filename = storageService.generateUniqueFilename(file.name, userId)

    // Upload file
    const result = await storageService.uploadFile(file, {
      filename,
      originalName: file.name,
      size: file.size,
      mimeType: file.type,
      uploadedAt: new Date(),
      uploadedBy: userId,
      projectId,
    })

    results.push(result)
  }

  return results
}
