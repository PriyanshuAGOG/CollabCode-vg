"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Search, File, Users, MessageSquare, Code, Palette, Clock, Star, Folder, Hash, ArrowRight } from "lucide-react"
import Link from "next/link"

interface SearchResult {
  id: string
  type: "project" | "file" | "team" | "chat" | "user" | "template"
  title: string
  description: string
  url: string
  metadata?: {
    framework?: string
    lastModified?: string
    members?: number
    starred?: boolean
    language?: string
  }
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Mock search data
  const searchData: SearchResult[] = [
    {
      id: "1",
      type: "project",
      title: "E-commerce Platform",
      description: "Modern e-commerce solution with AI recommendations",
      url: "/project/1",
      metadata: {
        framework: "Next.js",
        lastModified: "2 hours ago",
        starred: true,
      },
    },
    {
      id: "2",
      type: "project",
      title: "Mobile Banking App",
      description: "Secure banking app with biometric authentication",
      url: "/project/2",
      metadata: {
        framework: "React Native",
        lastModified: "1 day ago",
        starred: false,
      },
    },
    {
      id: "3",
      type: "file",
      title: "components/Header.tsx",
      description: "Main navigation header component",
      url: "/project/1/file/components/Header.tsx",
      metadata: {
        language: "TypeScript",
        lastModified: "3 hours ago",
      },
    },
    {
      id: "4",
      type: "team",
      title: "Frontend Developers",
      description: "Team focused on React and Vue.js development",
      url: "/teams/frontend",
      metadata: {
        members: 12,
      },
    },
    {
      id: "5",
      type: "chat",
      title: "#general",
      description: "General discussion channel",
      url: "/chat/general",
      metadata: {
        members: 25,
      },
    },
    {
      id: "6",
      type: "user",
      title: "Sarah Johnson",
      description: "Full-stack developer specializing in React and Node.js",
      url: "/profile/sarah-johnson",
    },
    {
      id: "7",
      type: "template",
      title: "React Dashboard Template",
      description: "Modern dashboard template with charts and analytics",
      url: "/explore/template/react-dashboard",
      metadata: {
        framework: "React",
        starred: true,
      },
    },
  ]

  useEffect(() => {
    if (query.length > 0) {
      setIsLoading(true)
      // Simulate API call delay
      const timer = setTimeout(() => {
        const filtered = searchData.filter(
          (item) =>
            item.title.toLowerCase().includes(query.toLowerCase()) ||
            item.description.toLowerCase().includes(query.toLowerCase()) ||
            item.metadata?.framework?.toLowerCase().includes(query.toLowerCase()),
        )
        setResults(filtered)
        setSelectedIndex(0)
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timer)
    } else {
      setResults([])
      setSelectedIndex(0)
    }
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen(true)
      }

      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
        } else if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
        } else if (e.key === "Enter" && results[selectedIndex]) {
          e.preventDefault()
          window.location.href = results[selectedIndex].url
          setIsOpen(false)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, results, selectedIndex])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "project":
        return <Folder className="w-4 h-4" />
      case "file":
        return <File className="w-4 h-4" />
      case "team":
        return <Users className="w-4 h-4" />
      case "chat":
        return <MessageSquare className="w-4 h-4" />
      case "user":
        return <Users className="w-4 h-4" />
      case "template":
        return <Palette className="w-4 h-4" />
      default:
        return <Search className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "project":
        return "text-bright-cyan"
      case "file":
        return "text-bright-purple"
      case "team":
        return "text-success"
      case "chat":
        return "text-warning"
      case "user":
        return "text-info"
      case "template":
        return "text-bright-cyan"
      default:
        return "text-text-muted"
    }
  }

  const getTypeBg = (type: string) => {
    switch (type) {
      case "project":
        return "bg-bright-cyan/20"
      case "file":
        return "bg-bright-purple/20"
      case "team":
        return "bg-success/20"
      case "chat":
        return "bg-warning/20"
      case "user":
        return "bg-info/20"
      case "template":
        return "bg-bright-cyan/20"
      default:
        return "bg-slate-gray/20"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-text-secondary hover:text-bright-cyan">
          <Search className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-dark-slate border-slate-gray/30 p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-text-primary">Search CollabCode</DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
            <Input
              placeholder="Search projects, files, teams, and more..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 premium-input text-text-primary"
              autoFocus
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Badge variant="outline" className="border-slate-gray/30 text-text-muted bg-dark-slate/30 text-xs">
                ⌘K
              </Badge>
            </div>
          </div>

          {query.length > 0 && (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-bright-cyan border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : results.length > 0 ? (
                results.map((result, index) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    onClick={() => setIsOpen(false)}
                    className={`block p-3 rounded-lg transition-all duration-200 ${
                      index === selectedIndex
                        ? "bg-bright-purple/20 border border-bright-purple/30"
                        : "hover:bg-dark-slate/50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeBg(result.type)}`}>
                        <span className={getTypeColor(result.type)}>{getTypeIcon(result.type)}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-text-primary font-medium text-sm truncate">{result.title}</h4>
                          {result.metadata?.starred && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                          <Badge
                            variant="outline"
                            className="border-slate-gray/30 text-text-muted bg-dark-slate/30 text-xs capitalize"
                          >
                            {result.type}
                          </Badge>
                        </div>
                        <p className="text-text-secondary text-xs truncate">{result.description}</p>
                        {result.metadata && (
                          <div className="flex items-center gap-3 mt-1 text-xs text-text-muted">
                            {result.metadata.framework && (
                              <div className="flex items-center gap-1">
                                <Code className="w-3 h-3" />
                                {result.metadata.framework}
                              </div>
                            )}
                            {result.metadata.language && (
                              <div className="flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                {result.metadata.language}
                              </div>
                            )}
                            {result.metadata.members && (
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {result.metadata.members} members
                              </div>
                            )}
                            {result.metadata.lastModified && (
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {result.metadata.lastModified}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <ArrowRight className="w-4 h-4 text-text-muted" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-bright-purple/20 to-bright-cyan/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-8 h-8 text-text-muted" />
                  </div>
                  <h3 className="text-lg font-bold text-text-primary mb-2">No results found</h3>
                  <p className="text-text-secondary text-sm">Try searching for projects, files, teams, or users</p>
                </div>
              )}
            </div>
          )}

          {query.length === 0 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-text-primary font-medium text-sm mb-2">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-dark-slate/50 transition-colors"
                  >
                    <div className="w-6 h-6 bg-bright-cyan/20 rounded flex items-center justify-center">
                      <Folder className="w-3 h-3 text-bright-cyan" />
                    </div>
                    <span className="text-text-secondary text-sm">My Projects</span>
                  </Link>
                  <Link
                    href="/teams"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-dark-slate/50 transition-colors"
                  >
                    <div className="w-6 h-6 bg-success/20 rounded flex items-center justify-center">
                      <Users className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-text-secondary text-sm">Teams</span>
                  </Link>
                  <Link
                    href="/chat"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-dark-slate/50 transition-colors"
                  >
                    <div className="w-6 h-6 bg-warning/20 rounded flex items-center justify-center">
                      <MessageSquare className="w-3 h-3 text-warning" />
                    </div>
                    <span className="text-text-secondary text-sm">Chat</span>
                  </Link>
                  <Link
                    href="/explore"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-dark-slate/50 transition-colors"
                  >
                    <div className="w-6 h-6 bg-bright-purple/20 rounded flex items-center justify-center">
                      <Palette className="w-3 h-3 text-bright-purple" />
                    </div>
                    <span className="text-text-secondary text-sm">Templates</span>
                  </Link>
                </div>
              </div>

              <div className="text-center pt-4 border-t border-slate-gray/20">
                <p className="text-text-muted text-xs">
                  Press{" "}
                  <Badge
                    variant="outline"
                    className="border-slate-gray/30 text-text-muted bg-dark-slate/30 text-xs mx-1"
                  >
                    ⌘K
                  </Badge>
                  to open search • Use{" "}
                  <Badge
                    variant="outline"
                    className="border-slate-gray/30 text-text-muted bg-dark-slate/30 text-xs mx-1"
                  >
                    ↑↓
                  </Badge>
                  to navigate •{" "}
                  <Badge
                    variant="outline"
                    className="border-slate-gray/30 text-text-muted bg-dark-slate/30 text-xs mx-1"
                  >
                    Enter
                  </Badge>{" "}
                  to select
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
