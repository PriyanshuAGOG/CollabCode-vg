import { Octokit } from "@octokit/rest"

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string
  html_url: string
  clone_url: string
  default_branch: string
  language: string
  stargazers_count: number
  forks_count: number
}

export interface GitHubCommit {
  sha: string
  message: string
  author: {
    name: string
    email: string
    date: string
  }
  url: string
}

export const githubIntegration = {
  async getUserRepos(username: string): Promise<GitHubRepo[]> {
    try {
      const { data } = await octokit.repos.listForUser({
        username,
        sort: "updated",
        per_page: 50,
      })
      return data
    } catch (error) {
      console.error("GitHub API Error:", error)
      return []
    }
  },

  async getRepoCommits(owner: string, repo: string): Promise<GitHubCommit[]> {
    try {
      const { data } = await octokit.repos.listCommits({
        owner,
        repo,
        per_page: 20,
      })
      return data.map((commit) => ({
        sha: commit.sha,
        message: commit.commit.message,
        author: {
          name: commit.commit.author?.name || "Unknown",
          email: commit.commit.author?.email || "",
          date: commit.commit.author?.date || "",
        },
        url: commit.html_url,
      }))
    } catch (error) {
      console.error("GitHub API Error:", error)
      return []
    }
  },

  async createRepo(name: string, description: string, isPrivate = false) {
    try {
      const { data } = await octokit.repos.createForAuthenticatedUser({
        name,
        description,
        private: isPrivate,
        auto_init: true,
      })
      return data
    } catch (error) {
      console.error("GitHub API Error:", error)
      throw error
    }
  },

  async createWebhook(owner: string, repo: string, webhookUrl: string) {
    try {
      const { data } = await octokit.repos.createWebhook({
        owner,
        repo,
        config: {
          url: webhookUrl,
          content_type: "json",
        },
        events: ["push", "pull_request", "issues"],
      })
      return data
    } catch (error) {
      console.error("GitHub Webhook Error:", error)
      throw error
    }
  },
}
