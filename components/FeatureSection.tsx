"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Code,
  Users,
  Palette,
  Zap,
  Github,
  Video,
  MessageSquare,
  Sparkles,
  FileCode,
  GitBranch,
  Layers,
  Bot,
} from "lucide-react"

const features = [
  {
    icon: Code,
    title: "VS Code-like Editor",
    description: "Full-featured code editor with syntax highlighting, auto-completion, and real-time collaboration.",
    badge: "Core",
    color: "text-[#00D1FF]",
  },
  {
    icon: Users,
    title: "Real-time Collaboration",
    description: "Work together seamlessly with live cursors, shared editing, and instant synchronization.",
    badge: "Core",
    color: "text-[#C084FC]",
  },
  {
    icon: Palette,
    title: "Design Canvas",
    description: "Figma-like design tools integrated directly into your development workflow.",
    badge: "Core",
    color: "text-[#00D1FF]",
  },
  {
    icon: Bot,
    title: "AI-Powered Coding",
    description: "Get intelligent code suggestions, bug fixes, and optimization recommendations.",
    badge: "AI",
    color: "text-[#C084FC]",
  },
  {
    icon: Github,
    title: "GitHub Integration",
    description: "Seamless Git workflow with commit, push, pull, and branch management.",
    badge: "Core",
    color: "text-[#00D1FF]",
  },
  {
    icon: Video,
    title: "Video Calls",
    description: "Built-in video conferencing for pair programming and team meetings.",
    badge: "New",
    color: "text-[#C084FC]",
  },
  {
    icon: MessageSquare,
    title: "Discord-like Channels",
    description: "Organized team communication with text and voice channels.",
    badge: "New",
    color: "text-[#00D1FF]",
  },
  {
    icon: Sparkles,
    title: "AI Chat Assistant",
    description: "Get help with coding, debugging, and project planning from our AI assistant.",
    badge: "AI",
    color: "text-[#C084FC]",
  },
  {
    icon: FileCode,
    title: "Template Marketplace",
    description: "Browse and install project templates to kickstart your development.",
    badge: "New",
    color: "text-[#00D1FF]",
  },
  {
    icon: GitBranch,
    title: "Project Management",
    description: "Kanban boards, task tracking, and team coordination tools.",
    badge: "Core",
    color: "text-[#C084FC]",
  },
  {
    icon: Layers,
    title: "Live Previews",
    description: "See your changes instantly with real-time app previews and hot reloading.",
    badge: "Core",
    color: "text-[#00D1FF]",
  },
  {
    icon: Zap,
    title: "Performance Optimized",
    description: "Lightning-fast performance with smart caching and optimized rendering.",
    badge: "Core",
    color: "text-[#C084FC]",
  },
]

export function FeatureSection() {
  return (
    <section id="features" className="py-20 lg:py-32 bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#C084FC]/10 text-[#C084FC] border-[#C084FC]/20">Features</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Everything you need to
            <br />
            <span className="bg-gradient-to-r from-[#00D1FF] to-[#C084FC] bg-clip-text text-transparent">
              build amazing apps
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            From coding to deployment, CollabCode provides all the tools you need for modern collaborative development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`p-3 rounded-lg bg-gray-700/50 ${feature.color} group-hover:scale-110 transition-transform`}
                  >
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      feature.badge === "AI"
                        ? "border-[#C084FC] text-[#C084FC]"
                        : feature.badge === "New"
                          ? "border-[#00D1FF] text-[#00D1FF]"
                          : "border-gray-600 text-gray-400"
                    }`}
                  >
                    {feature.badge}
                  </Badge>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
