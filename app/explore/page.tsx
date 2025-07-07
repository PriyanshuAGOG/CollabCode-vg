"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Star,
  GitFork,
  Download,
  Eye,
  TrendingUp,
  Calendar,
  Code,
  Palette,
  Smartphone,
  Globe,
  Database,
  Zap,
  Filter,
  SortDesc,
  Heart,
  Share2,
  ExternalLink,
  Compass,
  X,
} from "lucide-react"

interface Project {
  id: string
  name: string
  description: string
  author: string
  avatar: string
  stars: number
  forks: number
  downloads: number
  views: number
  category: string
  tags: string[]
  lastUpdated: string
  isTemplate: boolean
  thumbnail: string
  featured: boolean
}

interface Template {
  id: string
  name: string
  description: string
  category: string
  framework: string
  features: string[]
  downloads: number
  rating: number
  thumbnail: string
  author: string
  price: "free" | "premium"
  featured: boolean
}

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [sortBy, setSortBy] = useState("trending")

  const projects: Project[] = [
    {
      id: "1",
      name: "React Dashboard Pro",
      description:
        "Modern admin dashboard with real-time analytics, beautiful charts, and comprehensive user management system",
      author: "Sarah Chen",
      avatar: "SC",
      stars: 1247,
      forks: 234,
      downloads: 5678,
      views: 12340,
      category: "Web",
      tags: ["React", "TypeScript", "Dashboard", "Analytics"],
      lastUpdated: "2 days ago",
      isTemplate: true,
      thumbnail: "/placeholder.svg?height=200&width=300",
      featured: true,
    },
    {
      id: "2",
      name: "Mobile Banking App",
      description:
        "Secure mobile banking application with biometric authentication and real-time transaction monitoring",
      author: "Mike Johnson",
      avatar: "MJ",
      stars: 892,
      forks: 156,
      downloads: 3421,
      views: 8765,
      category: "Mobile",
      tags: ["React Native", "Security", "Banking", "Biometric"],
      lastUpdated: "1 week ago",
      isTemplate: false,
      thumbnail: "/placeholder.svg?height=200&width=300",
      featured: false,
    },
    {
      id: "3",
      name: "E-commerce Platform",
      description: "Full-stack e-commerce solution with payment integration, inventory management, and admin dashboard",
      author: "Emma Davis",
      avatar: "ED",
      stars: 2156,
      forks: 445,
      downloads: 8901,
      views: 18765,
      category: "Web",
      tags: ["Next.js", "E-commerce", "Stripe", "PostgreSQL"],
      lastUpdated: "3 days ago",
      isTemplate: true,
      thumbnail: "/placeholder.svg?height=200&width=300",
      featured: true,
    },
    {
      id: "4",
      name: "AI Chat Interface",
      description:
        "Beautiful chat interface with AI integration, real-time messaging, and advanced conversation features",
      author: "Alex Chen",
      avatar: "AC",
      stars: 1567,
      forks: 289,
      downloads: 4532,
      views: 11234,
      category: "AI/ML",
      tags: ["React", "AI", "Chat", "WebSocket"],
      lastUpdated: "5 days ago",
      isTemplate: true,
      thumbnail: "/placeholder.svg?height=200&width=300",
      featured: false,
    },
  ]

  const templates: Template[] = [
    {
      id: "1",
      name: "SaaS Landing Page",
      description:
        "Modern landing page template for SaaS products with pricing tables, testimonials, and conversion optimization",
      category: "Web",
      framework: "Next.js",
      features: ["Responsive Design", "Dark Mode", "SEO Optimized", "Analytics"],
      downloads: 12450,
      rating: 4.8,
      thumbnail: "/placeholder.svg?height=200&width=300",
      author: "Design Studio",
      price: "free",
      featured: true,
    },
    {
      id: "2",
      name: "Mobile App UI Kit",
      description: "Complete UI kit for mobile applications with 50+ screens, components, and design system",
      category: "Mobile",
      framework: "React Native",
      features: ["50+ Screens", "Dark/Light Theme", "Animations", "TypeScript"],
      downloads: 8765,
      rating: 4.9,
      thumbnail: "/placeholder.svg?height=200&width=300",
      author: "UI Masters",
      price: "premium",
      featured: true,
    },
    {
      id: "3",
      name: "Admin Dashboard",
      description:
        "Professional admin dashboard with charts, tables, user management, and real-time data visualization",
      category: "Web",
      framework: "React",
      features: ["Charts & Analytics", "User Management", "Real-time Data", "Responsive"],
      downloads: 15678,
      rating: 4.7,
      thumbnail: "/placeholder.svg?height=200&width=300",
      author: "Dashboard Pro",
      price: "free",
      featured: false,
    },
    {
      id: "4",
      name: "E-commerce Store",
      description: "Complete e-commerce solution with shopping cart, checkout, payment integration, and admin panel",
      category: "Web",
      framework: "Next.js",
      features: ["Shopping Cart", "Payment Gateway", "Inventory", "Admin Panel"],
      downloads: 9876,
      rating: 4.6,
      thumbnail: "/placeholder.svg?height=200&width=300",
      author: "Commerce Team",
      price: "premium",
      featured: false,
    },
  ]

  const categories = ["All", "Web", "Mobile", "AI/ML", "Backend", "Design"]

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || project.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "All" || template.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Web":
        return <Globe className="w-4 h-4" />
      case "Mobile":
        return <Smartphone className="w-4 h-4" />
      case "AI/ML":
        return <Zap className="w-4 h-4" />
      case "Backend":
        return <Database className="w-4 h-4" />
      case "Design":
        return <Palette className="w-4 h-4" />
      default:
        return <Code className="w-4 h-4" />
    }
  }

  const handleInstallTemplate = (templateId: string) => {
    console.log("Installing template:", templateId)
    alert("Template installed successfully!")
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="cyber-grid min-h-screen">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-button-gradient rounded-xl flex items-center justify-center shadow-purple-glow">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">Explore & Discover</h1>
                <p className="text-text-secondary mt-1">
                  Discover trending projects, templates, and inspiration from our community
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="glass-card p-6 rounded-2xl">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted w-5 h-5" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search projects, templates, or technologies..."
                    className="pl-12 h-12 premium-input text-lg"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                  >
                    <SortDesc className="w-4 h-4 mr-2" />
                    Sort
                  </Button>
                </div>
              </div>

              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className={
                      selectedCategory === category
                        ? "cyber-button text-white whitespace-nowrap"
                        : "border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan whitespace-nowrap"
                    }
                  >
                    {getCategoryIcon(category)}
                    <span className="ml-2">{category}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="projects" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-dark-slate/50 border border-slate-gray/20 p-1 rounded-xl">
              <TabsTrigger
                value="projects"
                className="data-[state=active]:bg-bright-purple data-[state=active]:text-white data-[state=active]:shadow-purple-glow rounded-lg"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Trending Projects
              </TabsTrigger>
              <TabsTrigger
                value="templates"
                className="data-[state=active]:bg-bright-cyan data-[state=active]:text-deep-navy data-[state=active]:shadow-cyan-glow rounded-lg"
              >
                <Download className="w-4 h-4 mr-2" />
                Template Marketplace
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="mt-8">
              {/* Featured Projects */}
              {filteredProjects.some((p) => p.featured) && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Star className="w-6 h-6 text-bright-purple" />
                    Featured Projects
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {filteredProjects
                      .filter((p) => p.featured)
                      .map((project) => (
                        <Card
                          key={project.id}
                          className="glass-card border-bright-purple/20 hover:border-bright-purple/40 transition-all duration-300 hover:scale-[1.02] group overflow-hidden"
                        >
                          <CardHeader className="pb-3">
                            <div className="aspect-video bg-slate-gray/30 rounded-xl mb-4 overflow-hidden relative">
                              <img
                                src={project.thumbnail || "/placeholder.svg"}
                                alt={project.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-bright-purple/90 text-white border-0">Featured</Badge>
                              </div>
                            </div>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-xl text-text-primary group-hover:text-bright-purple transition-colors">
                                  {project.name}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarFallback className="bg-button-gradient text-white text-xs">
                                      {project.avatar}
                                    </AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-text-muted">{project.author}</span>
                                </div>
                              </div>
                              {project.isTemplate && (
                                <Badge
                                  variant="outline"
                                  className="border-bright-cyan text-bright-cyan bg-bright-cyan/10"
                                >
                                  Template
                                </Badge>
                              )}
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-text-secondary text-sm mb-4 leading-relaxed">{project.description}</p>

                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.tags.slice(0, 4).map((tag) => (
                                <Badge
                                  key={tag}
                                  variant="outline"
                                  className="text-xs border-slate-gray/30 text-text-muted bg-dark-slate/30"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 text-bright-purple" />
                                  {project.stars.toLocaleString()}
                                </div>
                                <div className="flex items-center gap-1">
                                  <GitFork className="w-3 h-3" />
                                  {project.forks}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Eye className="w-3 h-3" />
                                  {project.views.toLocaleString()}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {project.lastUpdated}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1 cyber-button text-white">
                                <Eye className="w-3 h-3 mr-2" />
                                View Project
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                              >
                                <Heart className="w-3 h-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                              >
                                <Share2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {/* All Projects */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects
                  .filter((p) => !p.featured)
                  .map((project) => (
                    <Card
                      key={project.id}
                      className="glass-card hover:border-slate-gray/40 transition-all duration-300 hover:scale-105 group"
                    >
                      <CardHeader className="pb-3">
                        <div className="aspect-video bg-slate-gray/30 rounded-lg mb-3 overflow-hidden">
                          <img
                            src={project.thumbnail || "/placeholder.svg"}
                            alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-text-primary group-hover:text-bright-purple transition-colors">
                              {project.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="w-5 h-5">
                                <AvatarFallback className="bg-button-gradient text-white text-xs">
                                  {project.avatar}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-text-muted">{project.author}</span>
                            </div>
                          </div>
                          {project.isTemplate && (
                            <Badge variant="outline" className="border-bright-cyan text-bright-cyan bg-bright-cyan/10">
                              Template
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-text-secondary text-sm mb-4 leading-relaxed line-clamp-2">
                          {project.description}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.tags.slice(0, 3).map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="text-xs border-slate-gray/30 text-text-muted bg-dark-slate/30"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {project.tags.length > 3 && (
                            <Badge
                              variant="outline"
                              className="text-xs border-slate-gray/30 text-text-muted bg-dark-slate/30"
                            >
                              +{project.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-bright-purple" />
                              {project.stars}
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork className="w-3 h-3" />
                              {project.forks}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {project.lastUpdated}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 cyber-button text-white">
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                          >
                            <Star className="w-3 h-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="mt-8">
              {/* Featured Templates */}
              {filteredTemplates.some((t) => t.featured) && (
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-text-primary mb-4 flex items-center gap-2">
                    <Star className="w-6 h-6 text-bright-cyan" />
                    Featured Templates
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    {filteredTemplates
                      .filter((t) => t.featured)
                      .map((template) => (
                        <Card
                          key={template.id}
                          className="glass-card border-bright-cyan/20 hover:border-bright-cyan/40 transition-all duration-300 hover:scale-[1.02] group cursor-pointer overflow-hidden"
                          onClick={() => setSelectedTemplate(template)}
                        >
                          <CardHeader className="pb-3">
                            <div className="aspect-video bg-slate-gray/30 rounded-xl mb-4 overflow-hidden relative">
                              <img
                                src={template.thumbnail || "/placeholder.svg"}
                                alt={template.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute top-3 right-3">
                                <Badge className="bg-bright-cyan/90 text-deep-navy border-0 font-semibold">
                                  Featured
                                </Badge>
                              </div>
                              <div className="absolute top-3 left-3">
                                <Badge
                                  className={
                                    template.price === "free"
                                      ? "bg-green-500/90 text-white border-0"
                                      : "bg-yellow-500/90 text-deep-navy border-0 font-semibold"
                                  }
                                >
                                  {template.price}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-xl text-text-primary group-hover:text-bright-cyan transition-colors">
                                  {template.name}
                                </CardTitle>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-sm text-text-muted">{template.author}</span>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                    <span className="text-sm text-text-muted">{template.rating}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-text-secondary text-sm mb-4 leading-relaxed">{template.description}</p>

                            <div className="mb-4">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant="outline"
                                  className="text-xs border-slate-gray/30 text-text-muted bg-dark-slate/30"
                                >
                                  {template.framework}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className="text-xs border-slate-gray/30 text-text-muted bg-dark-slate/30"
                                >
                                  {template.category}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {template.features.slice(0, 3).map((feature) => (
                                  <Badge
                                    key={feature}
                                    variant="outline"
                                    className="text-xs border-slate-gray/30 text-text-muted bg-dark-slate/30"
                                  >
                                    {feature}
                                  </Badge>
                                ))}
                                {template.features.length > 3 && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs border-slate-gray/30 text-text-muted bg-dark-slate/30"
                                  >
                                    +{template.features.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                              <div className="flex items-center gap-1">
                                <Download className="w-3 h-3" />
                                {template.downloads.toLocaleString()}
                              </div>
                            </div>

                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleInstallTemplate(template.id)
                              }}
                              className="w-full bg-bright-cyan hover:bg-bright-cyan/80 text-deep-navy font-semibold shadow-cyan-glow"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              Install Template
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}

              {/* All Templates */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates
                  .filter((t) => !t.featured)
                  .map((template) => (
                    <Card
                      key={template.id}
                      className="glass-card hover:border-slate-gray/40 transition-all duration-300 hover:scale-105 group cursor-pointer"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardHeader className="pb-3">
                        <div className="aspect-video bg-slate-gray/30 rounded-lg mb-3 overflow-hidden relative">
                          <img
                            src={template.thumbnail || "/placeholder.svg"}
                            alt={template.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                          <div className="absolute top-2 left-2">
                            <Badge
                              className={
                                template.price === "free"
                                  ? "bg-green-500/90 text-white border-0 text-xs"
                                  : "bg-yellow-500/90 text-deep-navy border-0 text-xs font-semibold"
                              }
                            >
                              {template.price}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-text-primary group-hover:text-bright-cyan transition-colors">
                              {template.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-text-muted">{template.author}</span>
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                <span className="text-sm text-text-muted">{template.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-text-secondary text-sm mb-4 leading-relaxed line-clamp-2">
                          {template.description}
                        </p>

                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className="text-xs border-slate-gray/30 text-text-muted bg-dark-slate/30"
                            >
                              {template.framework}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {template.features.slice(0, 2).map((feature) => (
                              <Badge
                                key={feature}
                                variant="outline"
                                className="text-xs border-slate-gray/30 text-text-muted bg-dark-slate/30"
                              >
                                {feature}
                              </Badge>
                            ))}
                            {template.features.length > 2 && (
                              <Badge
                                variant="outline"
                                className="text-xs border-slate-gray/30 text-text-muted bg-dark-slate/30"
                              >
                                +{template.features.length - 2}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-text-muted mb-4">
                          <div className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {template.downloads.toLocaleString()}
                          </div>
                        </div>

                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleInstallTemplate(template.id)
                          }}
                          className="w-full bg-bright-cyan hover:bg-bright-cyan/80 text-deep-navy font-semibold"
                        >
                          <Download className="w-3 h-3 mr-2" />
                          Install
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Template Preview Modal */}
          {selectedTemplate && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <Card className="w-full max-w-4xl glass-card border-slate-gray/30 max-h-[90vh] overflow-auto">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-3xl text-text-primary mb-2">{selectedTemplate.name}</CardTitle>
                      <div className="flex items-center gap-4">
                        <span className="text-text-muted">by {selectedTemplate.author}</span>
                        <Badge
                          className={
                            selectedTemplate.price === "free"
                              ? "bg-green-500/20 border-green-500 text-green-400"
                              : "bg-yellow-500/20 border-yellow-500 text-yellow-400"
                          }
                        >
                          {selectedTemplate.price}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-text-muted">{selectedTemplate.rating}</span>
                        </div>
                        <div className="flex items-center gap-1 text-text-muted">
                          <Download className="w-4 h-4" />
                          {selectedTemplate.downloads.toLocaleString()} downloads
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedTemplate(null)}
                      className="text-text-muted hover:text-text-primary"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-slate-gray/30 rounded-xl mb-6 overflow-hidden">
                    <img
                      src={selectedTemplate.thumbnail || "/placeholder.svg"}
                      alt={selectedTemplate.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <p className="text-text-secondary leading-relaxed mb-6 text-lg">{selectedTemplate.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-text-primary mb-3">Framework & Category</h4>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="border-slate-gray/30 text-text-muted bg-dark-slate/30">
                          {selectedTemplate.framework}
                        </Badge>
                        <Badge variant="outline" className="border-slate-gray/30 text-text-muted bg-dark-slate/30">
                          {selectedTemplate.category}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-3">Statistics</h4>
                      <div className="flex items-center gap-4 text-text-muted">
                        <div className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          {selectedTemplate.downloads.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          {selectedTemplate.rating}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-text-primary mb-3">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTemplate.features.map((feature) => (
                        <Badge
                          key={feature}
                          variant="outline"
                          className="border-slate-gray/30 text-text-muted bg-dark-slate/30"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleInstallTemplate(selectedTemplate.id)}
                      className="flex-1 bg-bright-cyan hover:bg-bright-cyan/80 text-deep-navy font-semibold shadow-cyan-glow"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Install Template
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      variant="outline"
                      className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                    >
                      <Heart className="w-4 h-4" />
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
