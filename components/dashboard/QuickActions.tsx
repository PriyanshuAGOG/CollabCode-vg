"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Plus, Upload, Github, Figma, Zap, Users, MessageSquare, Compass } from "lucide-react"

interface QuickActionsProps {
  onCreateProject: () => void
  onImportProject?: () => void
  onCloneFromGitHub?: () => void
  onImportFromFigma?: () => void
  onUseTemplate?: () => void
  onJoinTeam?: () => void
}

export function QuickActions({
  onCreateProject,
  onImportProject = () => alert("Import project feature coming soon!"),
  onCloneFromGitHub = () => alert("GitHub clone feature coming soon!"),
  onImportFromFigma = () => alert("Figma import feature coming soon!"),
  onUseTemplate = () => (window.location.href = "/explore"),
  onJoinTeam = () => (window.location.href = "/teams"),
}: QuickActionsProps) {
  const actions = [
    {
      icon: Plus,
      label: "New Project",
      description: "Start from scratch",
      color: "bg-[#00D1FF] hover:bg-[#00B8E6] text-black",
      onClick: onCreateProject,
    },
    {
      icon: Upload,
      label: "Import Project",
      description: "From existing code",
      color: "bg-gray-700 hover:bg-gray-600 text-white",
      onClick: onImportProject,
    },
    {
      icon: Github,
      label: "Clone from GitHub",
      description: "Import repository",
      color: "bg-gray-700 hover:bg-gray-600 text-white",
      onClick: onCloneFromGitHub,
    },
    {
      icon: Figma,
      label: "Import Design",
      description: "From Figma file",
      color: "bg-gray-700 hover:bg-gray-600 text-white",
      onClick: onImportFromFigma,
    },
    {
      icon: Zap,
      label: "Use Template",
      description: "Quick start",
      color: "bg-[#C084FC] hover:bg-[#B070F0] text-black",
      onClick: onUseTemplate,
    },
    {
      icon: Users,
      label: "Join Team",
      description: "Collaborate",
      color: "bg-gray-700 hover:bg-gray-600 text-white",
      onClick: onJoinTeam,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Quick Actions</h2>
        <p className="text-gray-400">Get started with your next project</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action, index) => (
          <Card
            key={index}
            className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 cursor-pointer group"
            onClick={action.onClick}
          >
            <CardContent className="p-4 text-center">
              <div
                className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}
              >
                <action.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-white text-sm mb-1">{action.label}</h3>
              <p className="text-gray-400 text-xs">{action.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-[#00D1FF]/10 to-[#C084FC]/10 border-[#00D1FF]/20 hover:border-[#00D1FF]/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#00D1FF]/20 rounded-lg">
                <MessageSquare className="w-6 h-6 text-[#00D1FF]" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">AI Assistant</h3>
                <p className="text-gray-300 text-sm">Get help with coding and project planning</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-[#C084FC]/10 to-[#00D1FF]/10 border-[#C084FC]/20 hover:border-[#C084FC]/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[#C084FC]/20 rounded-lg">
                <Users className="w-6 h-6 text-[#C084FC]" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Team Collaboration</h3>
                <p className="text-gray-300 text-sm">Real-time coding with your team</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border-green-500/20 hover:border-green-500/40 transition-all duration-300 cursor-pointer group">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Compass className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Explore Templates</h3>
                <p className="text-gray-300 text-sm">Browse community templates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
