"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Check, X, Trash2, Users, AlertCircle, CheckCircle, GitCommit, Zap, Settings } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "warning" | "info" | "error"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  icon?: React.ReactNode
}

interface WorkspaceNotificationsProps {
  isOpen: boolean
  onToggle: () => void
}

export function WorkspaceNotifications({ isOpen, onToggle }: WorkspaceNotificationsProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Code compiled successfully",
      message: "Your React application has been built without errors",
      timestamp: "2 minutes ago",
      read: false,
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      id: "2",
      type: "info",
      title: "New collaborator joined",
      message: "Sarah Johnson joined your project workspace",
      timestamp: "5 minutes ago",
      read: false,
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "3",
      type: "warning",
      title: "Unsaved changes detected",
      message: "You have unsaved changes in 3 files",
      timestamp: "10 minutes ago",
      read: true,
      icon: <AlertCircle className="w-4 h-4" />,
    },
    {
      id: "4",
      type: "info",
      title: "Git commit pushed",
      message: "Latest changes pushed to main branch",
      timestamp: "15 minutes ago",
      read: true,
      icon: <GitCommit className="w-4 h-4" />,
    },
    {
      id: "5",
      type: "success",
      title: "AI suggestion applied",
      message: "Code optimization suggestion was successfully applied",
      timestamp: "20 minutes ago",
      read: true,
      icon: <Zap className="w-4 h-4" />,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-green-400"
      case "warning":
        return "text-yellow-400"
      case "error":
        return "text-red-400"
      case "info":
      default:
        return "text-cyan-400"
    }
  }

  const getTypeBg = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-500/20"
      case "warning":
        return "bg-yellow-500/20"
      case "error":
        return "bg-red-500/20"
      case "info":
      default:
        return "bg-cyan-500/20"
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={onToggle}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 relative transition-all duration-200">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center text-xs text-white font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 bg-black/90 backdrop-blur-2xl border-cyan-500/30 p-0" align="end">
        <div className="p-4 border-b border-cyan-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Bell className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <p className="text-sm text-cyan-300">
                    {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-cyan-400 hover:text-cyan-300 text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <ScrollArea className="max-h-96">
          {notifications.length > 0 ? (
            <div className="p-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 mb-2 rounded-xl border transition-all duration-200 hover:bg-white/5 ${
                    !notification.read ? "bg-purple-500/10 border-purple-500/30" : "bg-black/20 border-gray-600/20"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeBg(notification.type)}`}
                    >
                      <span className={getTypeColor(notification.type)}>{notification.icon}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${!notification.read ? "text-white" : "text-gray-300"}`}>
                            {notification.title}
                          </h4>
                          <p className="text-gray-400 text-xs mt-1 line-clamp-2">{notification.message}</p>
                          <p className="text-gray-500 text-xs mt-2">{notification.timestamp}</p>
                        </div>

                        <div className="flex items-center gap-1 ml-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => markAsRead(notification.id)}
                              className="text-cyan-400 hover:text-cyan-300 p-1 h-6 w-6"
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-400 p-1 h-6 w-6"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">All caught up!</h3>
              <p className="text-gray-400 text-sm">You're all up to date. New notifications will appear here.</p>
            </div>
          )}
        </ScrollArea>

        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-600/30">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAll}
              className="w-full text-red-400 hover:text-red-300 hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
