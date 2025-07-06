"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Bell, Check, X, Settings, Trash2, Users, MessageSquare, Star, AlertCircle, CheckCircle } from "lucide-react"

interface Notification {
  id: string
  type: "info" | "success" | "warning" | "error"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  icon?: React.ReactNode
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Project deployed successfully",
      message: "Your E-commerce Platform has been deployed to production",
      timestamp: "2 minutes ago",
      read: false,
      actionUrl: "/project/1",
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      id: "2",
      type: "info",
      title: "New team member joined",
      message: "Sarah Johnson joined your Mobile Banking App project",
      timestamp: "1 hour ago",
      read: false,
      actionUrl: "/teams",
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "3",
      type: "warning",
      title: "Build failed",
      message: "Your AI Dashboard build failed due to TypeScript errors",
      timestamp: "3 hours ago",
      read: true,
      actionUrl: "/project/3",
      icon: <AlertCircle className="w-4 h-4" />,
    },
    {
      id: "4",
      type: "info",
      title: "New comment on your project",
      message: "Alex commented on your Portfolio Website",
      timestamp: "1 day ago",
      read: true,
      actionUrl: "/project/4",
      icon: <MessageSquare className="w-4 h-4" />,
    },
    {
      id: "5",
      type: "success",
      title: "Achievement unlocked",
      message: "You've earned the 'Collaboration Master' badge!",
      timestamp: "2 days ago",
      read: true,
      actionUrl: "/profile",
      icon: <Star className="w-4 h-4" />,
    },
  ])

  const [isOpen, setIsOpen] = useState(false)
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
        return "text-success"
      case "warning":
        return "text-warning"
      case "error":
        return "text-red-400"
      case "info":
      default:
        return "text-bright-cyan"
    }
  }

  const getTypeBg = (type: string) => {
    switch (type) {
      case "success":
        return "bg-success/20"
      case "warning":
        return "bg-warning/20"
      case "error":
        return "bg-red-500/20"
      case "info":
      default:
        return "bg-bright-cyan/20"
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-text-secondary hover:text-bright-cyan relative">
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-bright-purple rounded-full flex items-center justify-center text-xs text-white font-medium">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 bg-dark-slate border-slate-gray/30 p-0" align="end">
        <div className="p-4 border-b border-slate-gray/30">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-text-primary">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-bright-cyan hover:text-bright-cyan/80 text-xs"
                >
                  Mark all read
                </Button>
              )}
              <Button variant="ghost" size="sm" className="text-text-muted hover:text-text-primary">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {unreadCount > 0 && (
            <p className="text-text-secondary text-sm mt-1">
              You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-slate-gray/20 hover:bg-dark-slate/30 transition-colors ${
                  !notification.read ? "bg-bright-purple/5" : ""
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
                        <h4
                          className={`text-sm font-medium ${!notification.read ? "text-text-primary" : "text-text-secondary"}`}
                        >
                          {notification.title}
                        </h4>
                        <p className="text-text-muted text-xs mt-1 line-clamp-2">{notification.message}</p>
                        <p className="text-text-muted text-xs mt-2">{notification.timestamp}</p>
                      </div>

                      <div className="flex items-center gap-1 ml-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="text-bright-cyan hover:text-bright-cyan/80 p-1"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="text-text-muted hover:text-red-400 p-1"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>

                    {notification.actionUrl && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-bright-cyan hover:text-bright-cyan/80 text-xs mt-2 p-0 h-auto"
                      >
                        View details →
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-bright-purple/20 to-bright-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-text-muted" />
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">No notifications</h3>
              <p className="text-text-secondary text-sm">
                You're all caught up! We'll notify you when something new happens.
              </p>
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-4 border-t border-slate-gray/30">
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
