"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { GitCommit, MessageSquare, Users, Star, GitBranch, FileText, Palette, Code } from "lucide-react"

const activities = [
  {
    id: "1",
    type: "commit",
    user: {
      name: "John Doe",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "committed to",
    target: "E-commerce Dashboard",
    description: "Added user authentication flow",
    time: "2 minutes ago",
    icon: GitCommit,
    color: "text-green-400",
  },
  {
    id: "2",
    type: "comment",
    user: {
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "commented on",
    target: "Mobile Banking App",
    description: "Great work on the biometric integration!",
    time: "15 minutes ago",
    icon: MessageSquare,
    color: "text-blue-400",
  },
  {
    id: "3",
    type: "collaboration",
    user: {
      name: "Mike Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "joined",
    target: "Portfolio Website",
    description: "Added as a collaborator",
    time: "1 hour ago",
    icon: Users,
    color: "text-purple-400",
  },
  {
    id: "4",
    type: "star",
    user: {
      name: "Sarah Wilson",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "starred",
    target: "Design System",
    description: "Added to favorites",
    time: "2 hours ago",
    icon: Star,
    color: "text-yellow-400",
  },
  {
    id: "5",
    type: "branch",
    user: {
      name: "Alex Chen",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "created branch",
    target: "feature/payment-gateway",
    description: "in E-commerce Dashboard",
    time: "3 hours ago",
    icon: GitBranch,
    color: "text-orange-400",
  },
  {
    id: "6",
    type: "design",
    user: {
      name: "Emma Davis",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "updated design",
    target: "Login Component",
    description: "Modified color scheme and spacing",
    time: "4 hours ago",
    icon: Palette,
    color: "text-pink-400",
  },
  {
    id: "7",
    type: "code",
    user: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "reviewed code",
    target: "API Authentication",
    description: "Approved pull request #23",
    time: "5 hours ago",
    icon: Code,
    color: "text-cyan-400",
  },
  {
    id: "8",
    type: "documentation",
    user: {
      name: "Lisa Wang",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    action: "updated docs",
    target: "API Documentation",
    description: "Added new endpoint examples",
    time: "6 hours ago",
    icon: FileText,
    color: "text-indigo-400",
  },
]

export function RecentActivity() {
  return (
    <Card className="bg-gray-800/50 border-gray-700 h-fit">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <div className="w-2 h-2 bg-[#00D1FF] rounded-full animate-pulse" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start gap-3 group">
            <div
              className={`p-2 rounded-lg bg-gray-700/50 ${activity.color} group-hover:scale-110 transition-transform`}
            >
              <activity.icon className="w-4 h-4" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                  <AvatarFallback className="bg-[#00D1FF] text-black text-xs">
                    {activity.user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-white text-sm font-medium truncate">{activity.user.name}</span>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed">
                <span className="text-gray-400">{activity.action}</span>{" "}
                <span className="text-[#00D1FF] font-medium">{activity.target}</span>
              </p>

              {activity.description && <p className="text-gray-400 text-xs mt-1 truncate">{activity.description}</p>}

              <div className="flex items-center justify-between mt-2">
                <span className="text-gray-500 text-xs">{activity.time}</span>
                <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
                  {activity.type}
                </Badge>
              </div>
            </div>
          </div>
        ))}

        <div className="text-center pt-4 border-t border-gray-700">
          <button className="text-[#00D1FF] text-sm hover:text-white transition-colors">View all activity →</button>
        </div>
      </CardContent>
    </Card>
  )
}
