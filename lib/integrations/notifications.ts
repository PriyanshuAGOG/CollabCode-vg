import { supabase } from "@/lib/supabase-client"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  data?: any
  created_at: string
}

export class NotificationManager {
  static async createNotification(
    userId: string,
    title: string,
    message: string,
    type: "info" | "success" | "warning" | "error" = "info",
    data?: any,
  ) {
    const { data: notification, error } = await supabase
      .from("notifications")
      .insert({
        user_id: userId,
        title,
        message,
        type,
        data,
      })
      .select()
      .single()

    if (error) throw error
    return notification
  }

  static async getNotifications(userId: string, limit = 50) {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data as Notification[]
  }

  static async markAsRead(notificationId: string) {
    const { error } = await supabase.from("notifications").update({ read: true }).eq("id", notificationId)

    if (error) throw error
  }

  static async markAllAsRead(userId: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", userId)
      .eq("read", false)

    if (error) throw error
  }

  static async deleteNotification(notificationId: string) {
    const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

    if (error) throw error
  }

  static subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    return supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => callback(payload.new as Notification),
      )
      .subscribe()
  }
}
