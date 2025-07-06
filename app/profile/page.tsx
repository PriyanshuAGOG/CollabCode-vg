"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Edit3, Save, X, Trophy, Star, Code, Calendar, MapPin, LinkIcon, Github, Twitter, Linkedin } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState({
    name: "Alex Johnson",
    username: "@alexdev",
    bio: "Full-stack developer passionate about creating beautiful, functional applications. Love working with React, Node.js, and exploring new technologies.",
    location: "San Francisco, CA",
    website: "alexjohnson.dev",
    joinDate: "March 2023",
  })

  const achievements = [
    { id: 1, name: "First Project", description: "Created your first project", unlocked: true, progress: 100 },
    { id: 2, name: "Collaborator", description: "Invited 5 team members", unlocked: true, progress: 100 },
    { id: 3, name: "Code Master", description: "Write 10,000 lines of code", unlocked: false, progress: 75 },
    { id: 4, name: "Team Player", description: "Complete 10 collaborative projects", unlocked: false, progress: 40 },
    { id: 5, name: "Innovation Leader", description: "Use 5 different AI features", unlocked: true, progress: 100 },
    { id: 6, name: "Speed Demon", description: "Deploy 50 projects", unlocked: false, progress: 20 },
  ]

  const projects = [
    {
      id: 1,
      name: "E-commerce Platform",
      description: "Modern React-based shopping platform with AI recommendations",
      tech: ["React", "Node.js", "MongoDB"],
      status: "Active",
      lastUpdated: "2 hours ago",
    },
    {
      id: 2,
      name: "Task Management App",
      description: "Collaborative task manager with real-time updates",
      tech: ["Next.js", "TypeScript", "Prisma"],
      status: "Completed",
      lastUpdated: "1 week ago",
    },
    {
      id: 3,
      name: "AI Chat Bot",
      description: "Intelligent customer service bot with natural language processing",
      tech: ["Python", "TensorFlow", "FastAPI"],
      status: "In Progress",
      lastUpdated: "1 day ago",
    },
  ]

  const handleSave = () => {
    setIsEditing(false)
    // Here you would save to your backend
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="cyber-grid min-h-screen">
        <div className="container mx-auto px-6 py-8">
          {/* Profile Header */}
          <Card className="glass-card mb-8 animate-slide-in-up">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
                {/* Avatar */}
                <div className="relative">
                  <div className="w-32 h-32 bg-button-gradient rounded-full flex items-center justify-center text-4xl font-bold text-white">
                    AJ
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-bright-purple rounded-full flex items-center justify-center">
                    <Star className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-4">
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="text-2xl font-bold premium-input text-text-primary"
                        placeholder="Your name"
                      />
                      <Input
                        value={profile.username}
                        onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                        placeholder="@username"
                        className="premium-input text-text-primary"
                      />
                      <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full h-24 premium-input text-text-primary resize-none"
                        placeholder="Tell us about yourself..."
                      />
                      <div className="flex space-x-2">
                        <Button onClick={handleSave} size="sm" className="cyber-button text-white">
                          <Save className="w-4 h-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setIsEditing(false)}
                          size="sm"
                          className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-4 mb-2">
                        <h1 className="text-3xl font-bold text-text-primary">{profile.name}</h1>
                        <Badge className="bg-bright-purple/20 text-bright-purple border-bright-purple/30">Pro</Badge>
                      </div>
                      <p className="text-bright-cyan text-lg mb-4">{profile.username}</p>
                      <p className="text-text-secondary mb-6 max-w-2xl">{profile.bio}</p>

                      <div className="flex flex-wrap items-center gap-6 text-sm text-text-muted">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4" />
                          <span>{profile.location}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <LinkIcon className="w-4 h-4" />
                          <span>{profile.website}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>Joined {profile.joinDate}</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 mt-6">
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outline"
                          size="sm"
                          className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" className="text-text-muted hover:text-bright-cyan">
                            <Github className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-text-muted hover:text-bright-cyan">
                            <Twitter className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-text-muted hover:text-bright-cyan">
                            <Linkedin className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Projects */}
            <div className="lg:col-span-2">
              <Card className="glass-card animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Code className="w-5 h-5 text-bright-cyan" />
                    <span>Projects</span>
                    <Badge variant="outline" className="border-slate-gray/30 text-text-muted">
                      {projects.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {projects.map((project) => (
                    <Card
                      key={project.id}
                      className="glass-card hover:border-slate-gray/40 transition-all duration-300 hover:scale-[1.02]"
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-semibold text-text-primary">{project.name}</h3>
                          <Badge
                            variant={
                              project.status === "Active"
                                ? "default"
                                : project.status === "Completed"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={
                              project.status === "Active"
                                ? "bg-green-500/20 text-green-400 border-green-500/30"
                                : project.status === "Completed"
                                  ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                                  : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            }
                          >
                            {project.status}
                          </Badge>
                        </div>
                        <p className="text-text-secondary mb-4">{project.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex space-x-2">
                            {project.tech.map((tech) => (
                              <Badge
                                key={tech}
                                variant="outline"
                                className="text-xs border-slate-gray/30 text-text-muted bg-dark-slate/30"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                          <span className="text-sm text-text-muted">{project.lastUpdated}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <div>
              <Card className="glass-card animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-bright-purple" />
                    <span>Achievements</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-xl border transition-all duration-300 ${
                        achievement.unlocked
                          ? "bg-bright-cyan/10 border-bright-cyan/30"
                          : "bg-slate-gray/20 border-slate-gray/30"
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-2">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            achievement.unlocked ? "bg-bright-cyan" : "bg-slate-gray"
                          }`}
                        >
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`font-semibold ${
                              achievement.unlocked ? "text-text-primary" : "text-text-muted"
                            }`}
                          >
                            {achievement.name}
                          </h4>
                          <p className={`text-sm ${achievement.unlocked ? "text-text-secondary" : "text-text-muted"}`}>
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                      {!achievement.unlocked && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs text-text-muted mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-gray/50 rounded-full h-2">
                            <div
                              className="bg-bright-cyan h-2 rounded-full transition-all duration-500"
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
