export interface VercelDeployment {
  uid: string
  name: string
  url: string
  state: "BUILDING" | "READY" | "ERROR" | "CANCELED"
  created: number
  source: string
}

export interface VercelProject {
  id: string
  name: string
  accountId: string
  framework: string
  gitRepository?: {
    type: string
    repo: string
  }
}

export const vercelIntegration = {
  async getProjects(): Promise<VercelProject[]> {
    try {
      const response = await fetch("https://api.vercel.com/v9/projects", {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        },
      })
      const data = await response.json()
      return data.projects || []
    } catch (error) {
      console.error("Vercel API Error:", error)
      return []
    }
  },

  async getDeployments(projectId: string): Promise<VercelDeployment[]> {
    try {
      const response = await fetch(`https://api.vercel.com/v6/deployments?projectId=${projectId}`, {
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
        },
      })
      const data = await response.json()
      return data.deployments || []
    } catch (error) {
      console.error("Vercel API Error:", error)
      return []
    }
  },

  async createDeployment(projectName: string, files: Record<string, string>): Promise<VercelDeployment> {
    try {
      const response = await fetch("https://api.vercel.com/v13/deployments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.VERCEL_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          files: Object.entries(files).map(([file, data]) => ({
            file,
            data,
          })),
          projectSettings: {
            framework: "nextjs",
          },
        }),
      })
      return await response.json()
    } catch (error) {
      console.error("Vercel Deploy Error:", error)
      throw error
    }
  },
}
