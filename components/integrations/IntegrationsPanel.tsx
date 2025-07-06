"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Github,
  Figma,
  Slack,
  Chrome,
  Database,
  Cloud,
  Zap,
  Settings,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  status: "connected" | "disconnected" | "error"
  category: "development" | "design" | "communication" | "deployment" | "ai"
  features: string[]
  isRequired: boolean
  lastSync?: Date
}

export function IntegrationsPanel() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "github",
      name: "GitHub",
      description: "Version control and code collaboration",
      icon: Github,
      status: "connected",
      category: "development",
      features: ["Repository sync", "Webhooks", "Issue tracking", "Pull requests"],
      isRequired: true,
      lastSync: new Date(),
    },
    {
      id: "figma",
      name: "Figma",
      description: "Design collaboration and prototyping",
      icon: Figma,
      status: "connected",
      category: "design",
      features: ["Design sync", "Component library", "Prototypes", "Comments"],
      isRequired: false,
      lastSync: new Date(Date.now() - 3600000),
    },
    {
      id: "slack",
      name: "Slack",
      description: "Team communication and notifications",
      icon: Slack,
      status: "disconnected",
      category: "communication",
      features: ["Message sync", "Notifications", "Channel integration", "Bot commands"],
      isRequired: false,
    },
    {
      id: "vercel",
      name: "Vercel",
      description: "Deployment and hosting platform",
      icon: Cloud,
      status: "connected",
      category: "deployment",
      features: ["Auto deployment", "Preview URLs", "Analytics", "Edge functions"],
      isRequired: true,
      lastSync: new Date(Date.now() - 1800000),
    },
    {
      id: "docker",
      name: "Docker",
      description: "Containerization and deployment",
      icon: Chrome,
      status: "error",
      category: "deployment",
      features: ["Container management", "Image building", "Registry sync", "Compose files"],
      isRequired: false,
    },
    {
      id: "supabase",
      name: "Supabase",
      description: "Backend as a service with real-time features",
      icon: Database,
      status: "connected",
      category: "development",
      features: ["Database", "Authentication", "Real-time", "Storage"],
      isRequired: true,
      lastSync: new Date(Date.now() - 900000),
    },
    {
      id: "openai",
      name: "OpenAI",
      description: "AI-powered code assistance and generation",
      icon: Zap,
      status: "connected",
      category: "ai",
      features: ["Code generation", "Code review", "Documentation", "Debugging"],
      isRequired: false,
      lastSync: new Date(Date.now() - 300000),
    },
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = [
    { id: "all", name: "All", count: integrations.length },
    { id: "development", name: "Development", count: integrations.filter((i) => i.category === "development").length },
    { id: "design", name: "Design", count: integrations.filter((i) => i.category === "design").length },
    {
      id: "communication",
      name: "Communication",
      count: integrations.filter((i) => i.category === "communication").length,
    },
    { id: "deployment", name: "Deployment", count: integrations.filter((i) => i.category === "deployment").length },
    { id: "ai", name: "AI", count: integrations.filter((i) => i.category === "ai").length },
  ]

  const filteredIntegrations =
    selectedCategory === "all" ? integrations : integrations.filter((i) => i.category === selectedCategory)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Connected</Badge>
      case "error":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Error</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Disconnected</Badge>
    }
  }

  const handleConnect = async (integrationId: string) => {
    // Implementation for connecting integration
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? { ...integration, status: "connected" as const, lastSync: new Date() }
          : integration,
      ),
    )
  }

  const handleDisconnect = (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId
          ? { ...integration, status: "disconnected" as const, lastSync: undefined }
          : integration,
      ),
    )
  }

  const handleSync = async (integrationId: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === integrationId ? { ...integration, lastSync: new Date() } : integration,
      ),
    )
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-900">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Integrations</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Connect your favorite tools and services to enhance your workflow
        </p>
      </div>

      <div className="flex-1 flex">
        {/* Categories Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                className={`w-full justify-between ${
                  selectedCategory === category.id
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                    : "text-gray-600 dark:text-gray-300"
                }`}
              >
                <span>{category.name}</span>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="flex-1 p-6">
          <ScrollArea className="h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((integration) => {
                const IconComponent = integration.icon
                return (
                  <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <IconComponent className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            {integration.isRequired && (
                              <Badge variant="outline" className="text-xs mt-1">
                                Required
                              </Badge>
                            )}
                          </div>
                        </div>
                        {getStatusIcon(integration.status)}
                      </div>
                      <CardDescription className="mt-2">{integration.description}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        {getStatusBadge(integration.status)}
                        {integration.lastSync && (
                          <span className="text-xs text-gray-500">
                            Synced {Math.floor((Date.now() - integration.lastSync.getTime()) / 60000)}m ago
                          </span>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white">Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {integration.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {integration.status === "connected" ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSync(integration.id)}
                              className="flex-1"
                            >
                              <RefreshCw className="w-3 h-3 mr-1" />
                              Sync
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDisconnect(integration.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleConnect(integration.id)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Connect
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          <Settings className="w-3 h-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
