export interface FigmaFile {
  key: string
  name: string
  thumbnail_url: string
  last_modified: string
}

export interface FigmaFrame {
  id: string
  name: string
  type: string
  children?: FigmaFrame[]
}

export const figmaIntegration = {
  async getTeamFiles(teamId: string): Promise<FigmaFile[]> {
    try {
      const response = await fetch(`https://api.figma.com/v1/teams/${teamId}/projects`, {
        headers: {
          "X-Figma-Token": process.env.FIGMA_TOKEN || "",
        },
      })
      const data = await response.json()
      return data.projects?.flatMap((project: any) => project.files) || []
    } catch (error) {
      console.error("Figma API Error:", error)
      return []
    }
  },

  async getFileFrames(fileKey: string): Promise<FigmaFrame[]> {
    try {
      const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
        headers: {
          "X-Figma-Token": process.env.FIGMA_TOKEN || "",
        },
      })
      const data = await response.json()
      return data.document?.children || []
    } catch (error) {
      console.error("Figma API Error:", error)
      return []
    }
  },

  async exportFrames(fileKey: string, frameIds: string[], format: "png" | "svg" = "png") {
    try {
      const response = await fetch(
        `https://api.figma.com/v1/images/${fileKey}?ids=${frameIds.join(",")}&format=${format}`,
        {
          headers: {
            "X-Figma-Token": process.env.FIGMA_TOKEN || "",
          },
        },
      )
      const data = await response.json()
      return data.images || {}
    } catch (error) {
      console.error("Figma Export Error:", error)
      return {}
    }
  },
}
