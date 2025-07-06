export interface SlackChannel {
  id: string
  name: string
  is_private: boolean
  num_members: number
}

export interface SlackMessage {
  ts: string
  user: string
  text: string
  channel: string
}

export const slackIntegration = {
  async getChannels(): Promise<SlackChannel[]> {
    try {
      const response = await fetch("https://slack.com/api/conversations.list", {
        headers: {
          Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        },
      })
      const data = await response.json()
      return data.channels || []
    } catch (error) {
      console.error("Slack API Error:", error)
      return []
    }
  },

  async sendMessage(channel: string, text: string): Promise<boolean> {
    try {
      const response = await fetch("https://slack.com/api/chat.postMessage", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          channel,
          text,
        }),
      })
      const data = await response.json()
      return data.ok
    } catch (error) {
      console.error("Slack Send Error:", error)
      return false
    }
  },

  async getChannelHistory(channel: string, limit = 50): Promise<SlackMessage[]> {
    try {
      const response = await fetch(`https://slack.com/api/conversations.history?channel=${channel}&limit=${limit}`, {
        headers: {
          Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        },
      })
      const data = await response.json()
      return data.messages || []
    } catch (error) {
      console.error("Slack History Error:", error)
      return []
    }
  },
}
