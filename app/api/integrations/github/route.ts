import { type NextRequest, NextResponse } from "next/server"
import { githubIntegration } from "@/lib/integrations/github"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get("action")
  const username = searchParams.get("username")
  const owner = searchParams.get("owner")
  const repo = searchParams.get("repo")

  try {
    switch (action) {
      case "repos":
        if (!username) {
          return NextResponse.json({ error: "Username required" }, { status: 400 })
        }
        const repos = await githubIntegration.getUserRepos(username)
        return NextResponse.json({ repos })

      case "commits":
        if (!owner || !repo) {
          return NextResponse.json({ error: "Owner and repo required" }, { status: 400 })
        }
        const commits = await githubIntegration.getRepoCommits(owner, repo)
        return NextResponse.json({ commits })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("GitHub API Error:", error)
    return NextResponse.json({ error: "GitHub API request failed" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, name, description, isPrivate, owner, repo, webhookUrl } = body

    switch (action) {
      case "create-repo":
        const newRepo = await githubIntegration.createRepo(name, description, isPrivate)
        return NextResponse.json({ repo: newRepo })

      case "create-webhook":
        const webhook = await githubIntegration.createWebhook(owner, repo, webhookUrl)
        return NextResponse.json({ webhook })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("GitHub API Error:", error)
    return NextResponse.json({ error: "GitHub API request failed" }, { status: 500 })
  }
}
