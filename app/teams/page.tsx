"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Users,
  Plus,
  Search,
  Crown,
  UserPlus,
  MessageSquare,
  Video,
  Calendar,
  Star,
  Globe,
  Lock,
  User,
  MoreHorizontal,
  Mail,
  Shield,
  Trash2,
  Edit,
  UserMinus,
} from "lucide-react"
import Link from "next/link"

interface Team {
  id: string
  name: string
  description: string
  members: number
  isPublic: boolean
  role: "owner" | "admin" | "member"
  avatar: string
  projects: number
  lastActive: string
}

interface TeamMember {
  id: string
  name: string
  email: string
  role: "owner" | "admin" | "member"
  avatar: string
  status: "online" | "away" | "offline"
  joinedAt: string
}

export default function TeamsPage() {
  const [user, setUser] = useState<any>(null)
  const [teams, setTeams] = useState<Team[]>([
    {
      id: "1",
      name: "Frontend Masters",
      description: "Building amazing user interfaces with React and TypeScript",
      members: 12,
      isPublic: true,
      role: "owner",
      avatar: "FM",
      projects: 8,
      lastActive: "2 hours ago",
    },
    {
      id: "2",
      name: "Backend Builders",
      description: "API development and database design specialists",
      members: 8,
      isPublic: false,
      role: "admin",
      avatar: "BB",
      projects: 5,
      lastActive: "1 day ago",
    },
    {
      id: "3",
      name: "Design System Team",
      description: "Creating consistent and beautiful design systems",
      members: 15,
      isPublic: true,
      role: "member",
      avatar: "DS",
      projects: 12,
      lastActive: "30 minutes ago",
    },
  ])

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "Sarah Chen",
      email: "sarah@example.com",
      role: "owner",
      avatar: "SC",
      status: "online",
      joinedAt: "Jan 2024",
    },
    {
      id: "2",
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "admin",
      avatar: "MJ",
      status: "online",
      joinedAt: "Feb 2024",
    },
    {
      id: "3",
      name: "Emma Davis",
      email: "emma@example.com",
      role: "member",
      avatar: "ED",
      status: "away",
      joinedAt: "Mar 2024",
    },
    {
      id: "4",
      name: "Alex Chen",
      email: "alex@example.com",
      role: "member",
      avatar: "AC",
      status: "offline",
      joinedAt: "Mar 2024",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [showInviteMember, setShowInviteMember] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamDescription, setNewTeamDescription] = useState("")
  const [inviteEmail, setInviteEmail] = useState("")
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [activeTab, setActiveTab] = useState("my-teams")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const filteredTeams = teams.filter(
    (team) =>
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) return

    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName,
      description: newTeamDescription,
      members: 1,
      isPublic: true,
      role: "owner",
      avatar: newTeamName.substring(0, 2).toUpperCase(),
      projects: 0,
      lastActive: "Just now",
    }

    setTeams([...teams, newTeam])
    setNewTeamName("")
    setNewTeamDescription("")
    setShowCreateTeam(false)
  }

  const handleInviteMember = () => {
    if (!inviteEmail.trim()) return

    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split("@")[0],
      email: inviteEmail,
      role: "member",
      avatar: inviteEmail.substring(0, 2).toUpperCase(),
      status: "offline",
      joinedAt: "Just now",
    }

    setTeamMembers([...teamMembers, newMember])
    setInviteEmail("")
    setShowInviteMember(false)

    // Show success message
    alert(`Invitation sent to ${inviteEmail}!`)
  }

  const handleJoinTeam = (teamId: string) => {
    setTeams(
      teams.map((team) =>
        team.id === teamId ? { ...team, members: team.members + 1, role: "member" as const } : team,
      ),
    )
  }

  const handleRemoveMember = (memberId: string) => {
    setTeamMembers(teamMembers.filter((member) => member.id !== memberId))
  }

  const handleChangeRole = (memberId: string, newRole: "admin" | "member") => {
    setTeamMembers(teamMembers.map((member) => (member.id === memberId ? { ...member, role: newRole } : member)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "owner":
        return <Crown className="w-4 h-4 text-yellow-500" />
      case "admin":
        return <Shield className="w-4 h-4 text-blue-500" />
      default:
        return <User className="w-4 h-4 text-gray-400" />
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "border-yellow-500 text-yellow-400"
      case "admin":
        return "border-blue-500 text-blue-400"
      default:
        return "border-gray-500 text-gray-400"
    }
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="cyber-grid min-h-screen">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-button-gradient rounded-xl flex items-center justify-center shadow-purple-glow">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">Teams & Collaboration</h1>
                <p className="text-text-secondary mt-1">Join teams, collaborate on projects, and build together</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search teams..."
                  className="pl-10 premium-input text-text-primary"
                />
              </div>
              <Button onClick={() => setShowCreateTeam(true)} className="ml-4 cyber-button text-white font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Create Team
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-dark-slate/50 border border-slate-gray/20 p-1 rounded-xl">
              <TabsTrigger
                value="my-teams"
                className="data-[state=active]:bg-bright-purple data-[state=active]:text-white data-[state=active]:shadow-purple-glow rounded-lg"
              >
                My Teams
              </TabsTrigger>
              <TabsTrigger
                value="discover"
                className="data-[state=active]:bg-bright-cyan data-[state=active]:text-deep-navy data-[state=active]:shadow-cyan-glow rounded-lg"
              >
                Discover
              </TabsTrigger>
              <TabsTrigger
                value="members"
                className="data-[state=active]:bg-bright-purple data-[state=active]:text-white data-[state=active]:shadow-purple-glow rounded-lg"
              >
                Members
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-teams" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTeams.map((team) => (
                  <Card
                    key={team.id}
                    className="glass-card hover:border-slate-gray/40 transition-all duration-300 hover:scale-105 group"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src="/placeholder.svg" alt={team.name} />
                            <AvatarFallback className="bg-button-gradient text-white font-bold">
                              {team.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-lg text-text-primary group-hover:text-bright-cyan transition-colors">
                              {team.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              {getRoleIcon(team.role)}
                              <Badge variant="outline" className={`text-xs ${getRoleBadgeColor(team.role)}`}>
                                {team.role}
                              </Badge>
                              {team.isPublic ? (
                                <Globe className="w-3 h-3 text-green-400" />
                              ) : (
                                <Lock className="w-3 h-3 text-yellow-400" />
                              )}
                            </div>
                          </div>
                        </div>
                        <Star className="w-5 h-5 text-text-muted hover:text-yellow-400 cursor-pointer transition-colors" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-text-secondary text-sm mb-4 leading-relaxed">{team.description}</p>
                      <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {team.members}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {team.projects}
                          </div>
                        </div>
                        <span>{team.lastActive}</span>
                      </div>
                      <div className="flex gap-2">
                        <Link href="/chat" className="flex-1">
                          <Button size="sm" className="w-full cyber-button text-white">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Chat
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                        >
                          <Video className="w-3 h-3" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                            >
                              <MoreHorizontal className="w-3 h-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-dark-slate border-slate-gray/30">
                            <DropdownMenuItem className="text-text-secondary hover:text-bright-cyan">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Team
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setShowInviteMember(true)}
                              className="text-text-secondary hover:text-bright-cyan"
                            >
                              <UserPlus className="mr-2 h-4 w-4" />
                              Invite Members
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:text-red-300">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="discover" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  {
                    name: "Open Source Contributors",
                    description: "Contributing to open source projects and learning together",
                    members: 45,
                    isPublic: true,
                    projects: 23,
                    avatar: "OS",
                  },
                  {
                    name: "AI/ML Enthusiasts",
                    description: "Exploring artificial intelligence and machine learning",
                    members: 32,
                    isPublic: true,
                    projects: 15,
                    avatar: "AI",
                  },
                  {
                    name: "Startup Builders",
                    description: "Building the next generation of startups",
                    members: 28,
                    isPublic: true,
                    projects: 18,
                    avatar: "SB",
                  },
                ].map((team, index) => (
                  <Card
                    key={index}
                    className="glass-card hover:border-slate-gray/40 transition-all duration-300 hover:scale-105"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="bg-gradient-to-r from-bright-cyan to-bright-purple text-white font-bold">
                            {team.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg text-text-primary">{team.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Globe className="w-3 h-3 text-green-400" />
                            <Badge variant="outline" className="text-xs border-green-500 text-green-400">
                              Public
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-text-secondary text-sm mb-4 leading-relaxed">{team.description}</p>
                      <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            {team.members}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {team.projects}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleJoinTeam(index.toString())}
                        className="w-full bg-bright-cyan hover:bg-bright-cyan/80 text-deep-navy font-semibold shadow-cyan-glow"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Join Team
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="members" className="mt-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-text-primary">Team Members</h2>
                  <p className="text-text-secondary">Manage your team members and their roles</p>
                </div>
                <Button onClick={() => setShowInviteMember(true)} className="cyber-button text-white font-semibold">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Invite Member
                </Button>
              </div>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="text-text-primary flex items-center gap-2">
                    <Users className="w-5 h-5 text-bright-cyan" />
                    Frontend Masters Team
                    <Badge variant="outline" className="border-bright-cyan text-bright-cyan">
                      {teamMembers.length} members
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-4">
                      {teamMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-4 glass-card rounded-lg hover:border-slate-gray/40 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <Avatar className="w-12 h-12">
                                <AvatarImage src="/placeholder.svg" alt={member.name} />
                                <AvatarFallback className="bg-button-gradient text-white font-bold">
                                  {member.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <div
                                className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-deep-navy ${getStatusColor(
                                  member.status,
                                )}`}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-text-primary">{member.name}</span>
                                {getRoleIcon(member.role)}
                                <Badge variant="outline" className={`text-xs ${getRoleBadgeColor(member.role)}`}>
                                  {member.role}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-text-muted">
                                <span>{member.email}</span>
                                <span>•</span>
                                <span className="capitalize">{member.status}</span>
                                <span>•</span>
                                <span>Joined {member.joinedAt}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                            >
                              <Video className="w-3 h-3" />
                            </Button>
                            {member.role !== "owner" && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                                  >
                                    <MoreHorizontal className="w-3 h-3" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="bg-dark-slate border-slate-gray/30">
                                  {member.role === "member" && (
                                    <DropdownMenuItem
                                      onClick={() => handleChangeRole(member.id, "admin")}
                                      className="text-text-secondary hover:text-bright-cyan"
                                    >
                                      <Shield className="mr-2 h-4 w-4" />
                                      Make Admin
                                    </DropdownMenuItem>
                                  )}
                                  {member.role === "admin" && (
                                    <DropdownMenuItem
                                      onClick={() => handleChangeRole(member.id, "member")}
                                      className="text-text-secondary hover:text-bright-cyan"
                                    >
                                      <User className="mr-2 h-4 w-4" />
                                      Remove Admin
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem
                                    onClick={() => handleRemoveMember(member.id)}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <UserMinus className="mr-2 h-4 w-4" />
                                    Remove Member
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Create Team Modal */}
          {showCreateTeam && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md glass-card border-slate-gray/30">
                <CardHeader>
                  <CardTitle className="text-text-primary">Create New Team</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Team Name</label>
                    <Input
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                      placeholder="Enter team name"
                      className="premium-input text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Description</label>
                    <textarea
                      value={newTeamDescription}
                      onChange={(e) => setNewTeamDescription(e.target.value)}
                      placeholder="Describe your team..."
                      rows={3}
                      className="w-full premium-input text-text-primary resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleCreateTeam}
                      disabled={!newTeamName.trim()}
                      className="flex-1 cyber-button text-white font-semibold"
                    >
                      Create Team
                    </Button>
                    <Button
                      onClick={() => setShowCreateTeam(false)}
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

          {/* Invite Member Modal */}
          {showInviteMember && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-md glass-card border-slate-gray/30">
                <CardHeader>
                  <CardTitle className="text-text-primary flex items-center gap-2">
                    <UserPlus className="w-5 h-5" />
                    Invite Team Member
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
                    <Input
                      type="email"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      placeholder="Enter email address"
                      className="premium-input text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">Role</label>
                    <select className="w-full premium-input text-text-primary">
                      <option value="member">Member</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="glass-card border-bright-cyan/20 p-3 rounded-lg">
                    <p className="text-text-secondary text-sm">
                      An invitation will be sent to this email address with instructions to join the team.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleInviteMember}
                      disabled={!inviteEmail.trim()}
                      className="flex-1 cyber-button text-white font-semibold"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send Invitation
                    </Button>
                    <Button
                      onClick={() => setShowInviteMember(false)}
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
