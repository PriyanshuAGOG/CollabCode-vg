import { databases, collections, dbId, client } from "@/lib/appwrite"
import { ID, Query } from "appwrite"

export interface Notification {
  $id: string
  user_id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  data?: any
  $createdAt: string
}

export class NotificationManager {
  static async createNotification(
    userId: string,
    title: string,
    message: string,
    type: "info" | "success" | "warning" | "error" = "info",
    data?: any,
  ) {
    const notification = await databases.createDocument(
      dbId,
      collections.notifications,
      ID.unique(),
      {
        user_id: userId,
        title,
        message,
        type,
        data: data ? JSON.stringify(data) : undefined,
      }
    )
    return notification
  }

  static async getNotifications(userId: string, limit = 50) {
    const { documents } = await databases.listDocuments(
      dbId,
      collections.notifications,
      [
        Query.equal("user_id", userId),
        Query.orderDesc("$createdAt"),
        Query.limit(limit),
      ]
    )
    return documents as Notification[]
  }

  static async markAsRead(notificationId: string) {
    await databases.updateDocument(
      dbId,
      collections.notifications,
      notificationId,
      { read: true }
    )
  }

  static async markAllAsRead(userId: string) {
    const { documents } = await databases.listDocuments(
      dbId,
      collections.notifications,
      [Query.equal("user_id", userId), Query.equal("read", false)]
    )

    await Promise.all(
      documents.map((doc) =>
        databases.updateDocument(
          dbId,
          collections.notifications,
          doc.$id,
          { read: true }
        )
      )
    )
  }

  static async deleteNotification(notificationId: string) {
    await databases.deleteDocument(
      dbId,
      collections.notifications,
      notificationId
    )
  }

  static subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    const channel = `databases.${dbId}.collections.${collections.notifications}.documents`
    return client.subscribe(channel, (response) => {
      // The server will broadcast all notification creations on this channel.
      // We need to filter for the notifications for the current user.
      // This is not ideal, but it's the only way without functions.
      // A better approach is to use a function to broadcast to a user-specific channel.
      if (response.events.includes(`databases.${dbId}.collections.${collections.notifications}.documents.*.create`)) {
        const notification = response.payload as Notification;
        if (notification.user_id === userId) {
          callback(notification);
        }
      }
    });
  }
}
