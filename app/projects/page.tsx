"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Search,
  Grid3X3,
  List,
  Star,
  GitBranch,
  Users,
  Clock,
  Play,
  MoreHorizontal,
  FolderOpen,
  Code,
  Palette,
  Globe,
  Archive,
  Trash2,
  Settings,
  Share,
  Download,
} from "lucide-react"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showCreateProject, setShowCreateProject] = useState(false)

  const projects = [
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Modern e-commerce solution with AI recommendations and real-time analytics",
      type: "Web App",
      framework: "Next.js",
      lastModified: "2 hours ago",
      collaborators: 4,
      status: "Active",
      progress: 75,
      starred: true,
      commits: 24,
      branches: 3,
      thumbnail: "🛒",
      tags: ["React", "TypeScript", "Tailwind"],
      createdAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Mobile Banking App",
      description: "Secure banking app with biometric authentication and transaction history",
      type: "Mobile App",
      framework: "React Native",
      lastModified: "1 day ago",
      collaborators: 3,
      status: "In Review",
      progress: 90,
      starred: false,
      commits: 18,
      branches: 2,
      thumbnail: "🏦",
      tags: ["React Native", "Firebase", "Security"],
      createdAt: "2024-01-10",
    },
    {
      id: "3",
      name: "AI Dashboard",
      description: "Analytics dashboard with machine learning insights and data visualization",
      type: "Web App",
      framework: "React",
      lastModified: "3 days ago",
      collaborators: 2,
      status: "Active",
      progress: 60,
      starred: true,
      commits: 31,
      branches: 4,
      thumbnail: "🤖",
      tags: ["React", "D3.js", "Python"],
      createdAt: "2024-01-05",
    },
    {
      id: "4",
      name: "Portfolio Website",
      description: "Personal portfolio with blog and project showcase",
      type: "Website",
      framework: "Astro",
      lastModified: "1 week ago",
      collaborators: 1,
      status: "Completed",
      progress: 100,
      starred: false,
      commits: 12,
      branches: 1,
      thumbnail: "🎨",
      tags: ["Astro", "MDX", "CSS"],
      createdAt: "2023-12-20",
    },
    {
      id: "5",
      name: "Task Management Tool",
      description: "Collaborative task management with real-time updates",
      type: "Web App",
      framework: "Vue.js",
      lastModified: "2 weeks ago",
      collaborators: 5,
      status: "Paused",
      progress: 45,
      starred: true,
      commits: 67,
      branches: 6,
      thumbnail: "📋",
      tags: ["Vue.js", "Node.js", "MongoDB"],
      createdAt: "2023-12-01",
    },
    {
      id: "6",
      name: "Weather App",
      description: "Beautiful weather app with location-based forecasts",
      type: "Mobile App",
      framework: "Flutter",
      lastModified: "1 month ago",
      collaborators: 2,
      status: "Archived",
      progress: 85,
      starred: false,
      commits: 23,
      branches: 2,
      thumbnail: "🌤️",
      tags: ["Flutter", "Dart", "API"],
      createdAt: "2023-11-15",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success border-success/20"
      case "In Review":
        return "bg-warning/10 text-warning border-warning/20"
      case "Completed":
        return "bg-info/10 text-info border-info/20"
      case "Paused":
        return "bg-slate-gray/10 text-text-muted border-slate-gray/20"
      case "Archived":
        return "bg-red-500/10 text-red-400 border-red-500/20"
      default:
        return "bg-slate-gray/10 text-text-muted border-slate-gray/20"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Web App":
        return Globe
      case "Mobile App":
        return Code
      case "Website":
        return Palette
      default:
        return FolderOpen
    }
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesFilter = filterStatus === "all" || project.status.toLowerCase() === filterStatus.toLowerCase()

    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="cyber-grid min-h-screen">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 animate-slide-in-up">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">My Projects</h1>
              <p className="text-text-secondary text-lg">Manage and collaborate on your development projects</p>
            </div>
            <Button onClick={() => setShowCreateProject(true)} className="cyber-button text-white font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8 animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
              <Input
                placeholder="Search projects, tags, or descriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 premium-input text-text-primary"
              />
            </div>

            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="premium-input text-text-primary min-w-[120px]"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="in review">In Review</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
                <option value="archived">Archived</option>
              </select>

              <div className="flex border border-slate-gray/30 rounded-lg overflow-hidden">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-bright-purple/20 text-bright-purple" : "text-text-muted"}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-bright-purple/20 text-bright-purple" : "text-text-muted"}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Projects Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => {
                const TypeIcon = getTypeIcon(project.type)
                return (
                  <Card
                    key={project.id}
                    className="glass-card hover:border-slate-gray/40 transition-all duration-300 hover:scale-[1.02] group animate-slide-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-bright-purple/20 to-bright-cyan/20 rounded-xl flex items-center justify-center text-2xl border border-slate-gray/20">
                            {project.thumbnail}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-text-primary group-hover:text-bright-cyan transition-colors line-clamp-1">
                              {project.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <TypeIcon className="w-3 h-3 text-text-muted" />
                              <span className="text-xs text-text-muted">{project.framework}</span>
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-text-muted hover:text-text-primary">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-dark-slate border-slate-gray/30" align="end">
                            <DropdownMenuItem className="text-text-secondary hover:text-bright-cyan">
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-text-secondary hover:text-bright-cyan">
                              <Share className="mr-2 h-4 w-4" />
                              Share
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-text-secondary hover:text-bright-cyan">
                              <Download className="mr-2 h-4 w-4" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-slate-gray/30" />
                            <DropdownMenuItem className="text-text-secondary hover:text-bright-cyan">
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:text-red-300">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <p className="text-text-secondary text-sm mb-4 line-clamp-2">{project.description}</p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="border-slate-gray/30 text-text-muted bg-dark-slate/30 text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                        {project.tags.length > 3 && (
                          <Badge
                            variant="outline"
                            className="border-slate-gray/30 text-text-muted bg-dark-slate/30 text-xs"
                          >
                            +{project.tags.length - 3}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)}`}>
                            {project.status}
                          </Badge>
                          <span className="text-text-primary font-medium text-sm">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-dark-slate/50 rounded-full h-2">
                          <div
                            className="bg-button-gradient h-2 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-gray/20">
                        <div className="flex items-center gap-3 text-xs text-text-muted">
                          <div className="flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            {project.commits}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {project.collaborators}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {project.lastModified}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-text-muted hover:text-yellow-400">
                            <Star className={`w-4 h-4 ${project.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                          </Button>
                          <Link href={`/project/${project.id}`}>
                            <Button size="sm" className="cyber-button text-white">
                              <Play className="w-3 h-3 mr-1" />
                              Open
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            // List View
            <div className="space-y-4">
              {filteredProjects.map((project, index) => {
                const TypeIcon = getTypeIcon(project.type)
                return (
                  <Card
                    key={project.id}
                    className="glass-card hover:border-slate-gray/40 transition-all duration-300 group animate-slide-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-12 h-12 bg-gradient-to-r from-bright-purple/20 to-bright-cyan/20 rounded-xl flex items-center justify-center text-2xl border border-slate-gray/20">
                            {project.thumbnail}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="text-lg font-bold text-text-primary group-hover:text-bright-cyan transition-colors">
                                {project.name}
                              </h3>
                              <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)}`}>
                                {project.status}
                              </Badge>
                            </div>
                            <p className="text-text-secondary text-sm mb-2">{project.description}</p>
                            <div className="flex items-center gap-4 text-xs text-text-muted">
                              <div className="flex items-center gap-1">
                                <TypeIcon className="w-3 h-3" />
                                {project.framework}
                              </div>
                              <div className="flex items-center gap-1">
                                <GitBranch className="w-3 h-3" />
                                {project.commits} commits
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {project.collaborators} collaborators
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {project.lastModified}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="text-sm font-medium text-text-primary mb-1">{project.progress}%</div>
                            <div className="w-24 bg-dark-slate/50 rounded-full h-2">
                              <div
                                className="bg-button-gradient h-2 rounded-full transition-all duration-500"
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="text-text-muted hover:text-yellow-400">
                              <Star className={`w-4 h-4 ${project.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                            </Button>
                            <Link href={`/project/${project.id}`}>
                              <Button size="sm" className="cyber-button text-white">
                                <Play className="w-3 h-3 mr-1" />
                                Open
                              </Button>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-text-muted hover:text-text-primary">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-dark-slate border-slate-gray/30" align="end">
                                <DropdownMenuItem className="text-text-secondary hover:text-bright-cyan">
                                  <Settings className="mr-2 h-4 w-4" />
                                  Settings
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-text-secondary hover:text-bright-cyan">
                                  <Share className="mr-2 h-4 w-4" />
                                  Share
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-text-secondary hover:text-bright-cyan">
                                  <Download className="mr-2 h-4 w-4" />
                                  Export
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="bg-slate-gray/30" />
                                <DropdownMenuItem className="text-text-secondary hover:text-bright-cyan">
                                  <Archive className="mr-2 h-4 w-4" />
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 hover:text-red-300">
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <div className="text-center py-16 animate-slide-in-up">
              <div className="w-24 h-24 bg-gradient-to-r from-bright-purple/20 to-bright-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <FolderOpen className="w-12 h-12 text-text-muted" />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">No projects found</h3>
              <p className="text-text-secondary mb-6">
                {searchQuery ? "Try adjusting your search terms" : "Create your first project to get started"}
              </p>
              <Button onClick={() => setShowCreateProject(true)} className="cyber-button text-white font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Create Project
              </Button>
            </div>
          )}

          {/* Create Project Modal */}
          {showCreateProject && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md glass-card border-slate-gray/30 animate-slide-in-up">
                <CardHeader>
                  <CardTitle className="text-text-primary">Create New Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Project Name</label>
                    <Input placeholder="Enter project name" className="premium-input text-text-primary" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Framework</label>
                    <select className="w-full premium-input text-text-primary">
                      <option value="react">React</option>
                      <option value="nextjs">Next.js</option>
                      <option value="vue">Vue.js</option>
                      <option value="angular">Angular</option>
                      <option value="svelte">Svelte</option>
                      <option value="flutter">Flutter</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                    <textarea
                      placeholder="Describe your project..."
                      className="w-full premium-input text-text-primary h-20 resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowCreateProject(false)}
                      className="flex-1 cyber-button text-white font-semibold"
                    >
                      Create Project
                    </Button>
                    <Button
                      onClick={() => setShowCreateProject(false)}
                      variant="outline"
                      className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
