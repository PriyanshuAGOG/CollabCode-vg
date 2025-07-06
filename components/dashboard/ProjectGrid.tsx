"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Star,
  GitBranch,
  Users,
  Calendar,
  Code,
  Palette,
  Globe,
  Smartphone,
  Database,
  Play,
  Edit,
  Trash2,
  Share,
} from "lucide-react"
import Link from "next/link"

const projects = [
  {
    id: "1",
    name: "E-commerce Dashboard",
    description: "Modern admin dashboard for online store management with real-time analytics",
    type: "Web App",
    framework: "React",
    lastModified: "2 hours ago",
    collaborators: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Jane Smith", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Mike Johnson", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    status: "Active",
    progress: 75,
    starred: true,
    commits: 24,
    branches: 3,
  },
  {
    id: "2",
    name: "Mobile Banking App",
    description: "Secure mobile banking application with biometric authentication",
    type: "Mobile App",
    framework: "React Native",
    lastModified: "1 day ago",
    collaborators: [
      { name: "Sarah Wilson", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Alex Chen", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    status: "In Review",
    progress: 90,
    starred: false,
    commits: 18,
    branches: 2,
  },
  {
    id: "3",
    name: "Portfolio Website",
    description: "Personal portfolio website with interactive animations and dark mode",
    type: "Website",
    framework: "Next.js",
    lastModified: "3 days ago",
    collaborators: [{ name: "Emma Davis", avatar: "/placeholder.svg?height=32&width=32" }],
    status: "Completed",
    progress: 100,
    starred: true,
    commits: 12,
    branches: 1,
  },
  {
    id: "4",
    name: "Task Management API",
    description: "RESTful API for task management with authentication and real-time updates",
    type: "Backend",
    framework: "Node.js",
    lastModified: "5 days ago",
    collaborators: [
      { name: "David Kim", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Lisa Wang", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    status: "Active",
    progress: 60,
    starred: false,
    commits: 31,
    branches: 4,
  },
  {
    id: "5",
    name: "Design System",
    description: "Comprehensive design system with components, tokens, and documentation",
    type: "Design",
    framework: "Figma",
    lastModified: "1 week ago",
    collaborators: [
      { name: "Maria Garcia", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Tom Brown", avatar: "/placeholder.svg?height=32&width=32" },
      { name: "Anna Lee", avatar: "/placeholder.svg?height=32&width=32" },
    ],
    status: "Active",
    progress: 45,
    starred: true,
    commits: 8,
    branches: 2,
  },
  {
    id: "6",
    name: "AI Chat Bot",
    description: "Intelligent chatbot with natural language processing and machine learning",
    type: "AI/ML",
    framework: "Python",
    lastModified: "2 weeks ago",
    collaborators: [{ name: "Chris Taylor", avatar: "/placeholder.svg?height=32&width=32" }],
    status: "Paused",
    progress: 30,
    starred: false,
    commits: 15,
    branches: 1,
  },
]

const getTypeIcon = (type: string) => {
  switch (type) {
    case "Web App":
      return <Globe className="w-4 h-4" />
    case "Mobile App":
      return <Smartphone className="w-4 h-4" />
    case "Website":
      return <Code className="w-4 h-4" />
    case "Backend":
      return <Database className="w-4 h-4" />
    case "Design":
      return <Palette className="w-4 h-4" />
    default:
      return <Code className="w-4 h-4" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-500/10 text-green-400 border-green-500/20"
    case "In Review":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
    case "Completed":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20"
    case "Paused":
      return "bg-gray-500/10 text-gray-400 border-gray-500/20"
    default:
      return "bg-gray-500/10 text-gray-400 border-gray-500/20"
  }
}

export function ProjectGrid() {
  const [filter, setFilter] = useState("all")

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true
    if (filter === "starred") return project.starred
    if (filter === "active") return project.status === "Active"
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Your Projects</h2>
          <p className="text-gray-400">Manage and collaborate on your development projects</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-[#00D1FF] text-black" : "border-gray-600 text-white hover:bg-gray-800"}
          >
            All
          </Button>
          <Button
            variant={filter === "starred" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("starred")}
            className={
              filter === "starred" ? "bg-[#00D1FF] text-black" : "border-gray-600 text-white hover:bg-gray-800"
            }
          >
            <Star className="w-4 h-4 mr-1" />
            Starred
          </Button>
          <Button
            variant={filter === "active" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("active")}
            className={filter === "active" ? "bg-[#00D1FF] text-black" : "border-gray-600 text-white hover:bg-gray-800"}
          >
            Active
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card
            key={project.id}
            className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 group"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-700/50 rounded-lg text-[#00D1FF]">{getTypeIcon(project.type)}</div>
                  <div>
                    <CardTitle className="text-lg text-white group-hover:text-[#00D1FF] transition-colors">
                      {project.name}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                        {project.framework}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)}`}>
                        {project.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="text-gray-400 hover:text-yellow-400">
                    <Star className={`w-4 h-4 ${project.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-gray-800 border-gray-600" align="end">
                      <DropdownMenuItem className="text-white hover:bg-gray-700">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-white hover:bg-gray-700">
                        <Share className="mr-2 h-4 w-4" />
                        Share
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm leading-relaxed">{project.description}</p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white font-medium">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-[#00D1FF] to-[#C084FC] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <GitBranch className="w-3 h-3" />
                    {project.commits}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {project.collaborators.length}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {project.lastModified}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  {project.collaborators.slice(0, 3).map((collaborator, index) => (
                    <Avatar key={index} className="w-6 h-6 border-2 border-gray-800">
                      <AvatarImage src={collaborator.avatar || "/placeholder.svg"} alt={collaborator.name} />
                      <AvatarFallback className="bg-[#00D1FF] text-black text-xs">
                        {collaborator.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {project.collaborators.length > 3 && (
                    <div className="w-6 h-6 bg-gray-700 border-2 border-gray-800 rounded-full flex items-center justify-center">
                      <span className="text-xs text-gray-300">+{project.collaborators.length - 3}</span>
                    </div>
                  )}
                </div>

                <Link href={`/project/${project.id}`}>
                  <Button size="sm" className="bg-[#00D1FF] hover:bg-[#00B8E6] text-black">
                    <Play className="w-3 h-3 mr-1" />
                    Open
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
