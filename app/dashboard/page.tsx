"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Code,
  Globe,
  Star,
  GitBranch,
  Users,
  Play,
  MoreHorizontal,
  TrendingUp,
  Activity,
  Clock,
  Zap,
  MessageSquare,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateProject, setShowCreateProject] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem("collabcode_auth")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const projects = [
    {
      id: "1",
      name: "E-commerce Platform",
      description: "Modern e-commerce solution with AI recommendations",
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
    },
    {
      id: "2",
      name: "Mobile Banking App",
      description: "Secure banking app with biometric authentication",
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
    },
    {
      id: "3",
      name: "AI Dashboard",
      description: "Analytics dashboard with machine learning insights",
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
    },
  ]

  const stats = [
    { label: "Total Projects", value: "12", change: "+3", icon: Code, color: "text-bright-cyan" },
    { label: "Active Collaborations", value: "8", change: "+2", icon: Users, color: "text-bright-purple" },
    { label: "Lines of Code", value: "45.2K", change: "+12%", icon: Activity, color: "text-bright-cyan" },
    { label: "Deployments", value: "28", change: "+5", icon: Zap, color: "text-bright-purple" },
  ]

  const recentActivity = [
    { action: "Deployed", project: "E-commerce Platform", time: "2 hours ago", icon: Zap, color: "text-success" },
    { action: "Committed to", project: "Mobile Banking App", time: "4 hours ago", icon: GitBranch, color: "text-info" },
    { action: "Joined team", project: "AI Dashboard", time: "1 day ago", icon: Users, color: "text-bright-purple" },
    { action: "Created", project: "Portfolio Website", time: "2 days ago", icon: Plus, color: "text-bright-cyan" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-success/10 text-success border-success/20"
      case "In Review":
        return "bg-warning/10 text-warning border-warning/20"
      case "Completed":
        return "bg-info/10 text-info border-info/20"
      default:
        return "bg-slate-gray/10 text-text-muted border-slate-gray/20"
    }
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="cyber-grid min-h-screen">
        <div className="container mx-auto px-6 py-8">
          {/* Welcome Section */}
          <div className="mb-8 animate-slide-in-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-button-gradient rounded-xl flex items-center justify-center shadow-purple-glow">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-text-primary">Welcome back, {user?.name || "Developer"}! 👋</h1>
                <p className="text-text-secondary text-lg">
                  Ready to build something amazing today? Your premium workspace awaits.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="glass-card hover:border-slate-gray/40 transition-all duration-300 hover:scale-105 animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-text-muted text-sm font-medium">{stat.label}</p>
                      <p className="text-3xl font-bold text-text-primary">{stat.value}</p>
                      <p className={`text-sm ${stat.color} flex items-center gap-1 mt-1`}>
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </p>
                    </div>
                    <div className={`p-3 rounded-xl bg-dark-slate/50 ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Projects Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary">Recent Projects</h2>
                <div className="flex gap-3">
                  <Button onClick={() => setShowCreateProject(true)} className="cyber-button text-white font-semibold">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                  <Link href="/explore">
                    <Button
                      variant="outline"
                      className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                    >
                      View All
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="space-y-4">
                {projects.map((project, index) => (
                  <Card
                    key={project.id}
                    className="glass-card hover:border-slate-gray/40 transition-all duration-300 hover:scale-[1.02] group animate-slide-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-r from-bright-purple/20 to-bright-cyan/20 rounded-xl flex items-center justify-center text-3xl border border-slate-gray/20">
                            {project.thumbnail}
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-text-primary group-hover:text-bright-cyan transition-colors">
                              {project.name}
                            </h3>
                            <p className="text-text-secondary text-sm">{project.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge
                                variant="outline"
                                className="border-slate-gray/30 text-text-muted bg-dark-slate/30 text-xs"
                              >
                                {project.framework}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${getStatusColor(project.status)}`}>
                                {project.status}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="text-text-muted hover:text-yellow-400">
                            <Star className={`w-4 h-4 ${project.starred ? "fill-yellow-400 text-yellow-400" : ""}`} />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-text-muted hover:text-text-primary">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-text-muted">Progress</span>
                          <span className="text-text-primary font-medium">{project.progress}%</span>
                        </div>
                        <div className="w-full bg-dark-slate/50 rounded-full h-2">
                          <div
                            className="bg-button-gradient h-2 rounded-full transition-all duration-500"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-gray/20">
                        <div className="flex items-center gap-4 text-sm text-text-muted">
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

                        <Link href={`/project/${project.id}`}>
                          <Button size="sm" className="cyber-button text-white">
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

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <Card className="glass-card animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
                <CardHeader>
                  <CardTitle className="text-text-primary flex items-center gap-2">
                    <Activity className="w-5 h-5 text-bright-cyan" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-dark-slate/50 ${activity.color}`}>
                        <activity.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-text-primary text-sm">
                          <span className="text-text-muted">{activity.action}</span>{" "}
                          <span className="font-medium text-bright-cyan">{activity.project}</span>
                        </p>
                        <p className="text-text-muted text-xs">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="glass-card animate-slide-in-up" style={{ animationDelay: "0.4s" }}>
                <CardHeader>
                  <CardTitle className="text-text-primary">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => setShowCreateProject(true)}
                    className="w-full cyber-button text-white font-semibold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </Button>
                  <Link href="/teams" className="block">
                    <Button
                      variant="outline"
                      className="w-full border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Join Team
                    </Button>
                  </Link>
                  <Link href="/explore" className="block">
                    <Button
                      variant="outline"
                      className="w-full border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Browse Templates
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* AI Assistant */}
              <Card
                className="glass-card border-bright-purple/20 animate-slide-in-up"
                style={{ animationDelay: "0.5s" }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-button-gradient rounded-xl flex items-center justify-center shadow-purple-glow">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-text-primary text-lg">AI Assistant</h3>
                      <p className="text-text-muted text-sm">Ready to help</p>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                    Get instant help with coding, debugging, and project planning.
                  </p>
                  <Link href="/chat">
                    <Button className="w-full bg-bright-purple/20 hover:bg-bright-purple/30 text-bright-purple border border-bright-purple/20">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Start Chat
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

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
                    </select>
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
