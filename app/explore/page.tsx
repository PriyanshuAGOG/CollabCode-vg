"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Filter, Star, GitFork, Eye, Calendar, Users, Code, Lock, Award, Globe } from "lucide-react"

// Mock data for projects
const mockProjects = [
  {
    id: "1",
    title: "React Todo App",
    description:
      "A beautiful todo application built with React and TypeScript. Features drag-and-drop, local storage, and dark mode.",
    author: "john_doe",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    stars: 245,
    forks: 67,
    views: 1200,
    language: "TypeScript",
    tags: ["React", "TypeScript", "CSS", "LocalStorage"],
    createdAt: "2024-01-15",
    updatedAt: "2024-01-20",
    isPublic: true,
    difficulty: "Beginner",
    category: "Web Development",
  },
  {
    id: "2",
    title: "Python Data Visualizer",
    description:
      "Interactive data visualization tool using Python, Pandas, and Plotly. Perfect for analyzing CSV files and creating beautiful charts.",
    author: "data_scientist",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    stars: 189,
    forks: 43,
    views: 890,
    language: "Python",
    tags: ["Python", "Pandas", "Plotly", "Data Science"],
    createdAt: "2024-01-10",
    updatedAt: "2024-01-18",
    isPublic: true,
    difficulty: "Intermediate",
    category: "Data Science",
  },
  {
    id: "3",
    title: "Node.js REST API",
    description:
      "Complete REST API with authentication, CRUD operations, and MongoDB integration. Includes comprehensive testing suite.",
    author: "backend_dev",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    stars: 156,
    forks: 89,
    views: 2100,
    language: "JavaScript",
    tags: ["Node.js", "Express", "MongoDB", "JWT"],
    createdAt: "2024-01-05",
    updatedAt: "2024-01-22",
    isPublic: true,
    difficulty: "Advanced",
    category: "Backend",
  },
  {
    id: "4",
    title: "CSS Animation Library",
    description:
      "Collection of smooth CSS animations and transitions. Easy to use, lightweight, and customizable for any project.",
    author: "css_wizard",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    stars: 312,
    forks: 78,
    views: 1800,
    language: "CSS",
    tags: ["CSS", "Animations", "SCSS", "Frontend"],
    createdAt: "2024-01-12",
    updatedAt: "2024-01-19",
    isPublic: true,
    difficulty: "Intermediate",
    category: "Frontend",
  },
  {
    id: "5",
    title: "Machine Learning Model",
    description: "Image classification model using TensorFlow and Keras. Trained on custom dataset with 95% accuracy.",
    author: "ml_engineer",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    stars: 423,
    forks: 156,
    views: 3200,
    language: "Python",
    tags: ["Python", "TensorFlow", "Keras", "ML"],
    createdAt: "2024-01-08",
    updatedAt: "2024-01-21",
    isPublic: true,
    difficulty: "Advanced",
    category: "Machine Learning",
  },
  {
    id: "6",
    title: "Vue.js Dashboard",
    description:
      "Modern admin dashboard with Vue 3, Composition API, and Chart.js. Responsive design with dark/light theme.",
    author: "vue_master",
    authorAvatar: "/placeholder.svg?height=32&width=32",
    stars: 198,
    forks: 45,
    views: 1100,
    language: "Vue",
    tags: ["Vue.js", "Chart.js", "Dashboard", "Responsive"],
    createdAt: "2024-01-14",
    updatedAt: "2024-01-20",
    isPublic: true,
    difficulty: "Intermediate",
    category: "Frontend",
  },
]

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [filteredProjects, setFilteredProjects] = useState(mockProjects)

  // Filter and search logic
  useEffect(() => {
    const filtered = mockProjects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory === "all" || project.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === "all" || project.difficulty === selectedDifficulty
      const matchesLanguage = selectedLanguage === "all" || project.language === selectedLanguage

      return matchesSearch && matchesCategory && matchesDifficulty && matchesLanguage
    })

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "popular":
          return b.stars - a.stars
        case "recent":
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        case "views":
          return b.views - a.views
        case "forks":
          return b.forks - a.forks
        default:
          return 0
      }
    })

    setFilteredProjects(filtered)
  }, [searchQuery, selectedCategory, selectedDifficulty, selectedLanguage, sortBy])

  const categories = [
    "all",
    "Web Development",
    "Data Science",
    "Backend",
    "Frontend",
    "Machine Learning",
    "Mobile",
    "DevOps",
  ]
  const difficulties = ["all", "Beginner", "Intermediate", "Advanced"]
  const languages = ["all", "JavaScript", "TypeScript", "Python", "CSS", "Vue", "React", "Node.js"]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "Intermediate":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "Advanced":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
      TypeScript: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      Python: "bg-green-500/20 text-green-300 border-green-500/30",
      CSS: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      Vue: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      React: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    }
    return colors[language] || "bg-gray-500/20 text-gray-300 border-gray-500/30"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#16213E] text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-purple-500/3 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_50%,transparent_75%,transparent_100%)] bg-[length:60px_60px] animate-pulse opacity-30" />

      {/* COMING SOON OVERLAY */}
      <div className="absolute inset-0 z-50 backdrop-blur-md bg-black/30 flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-6">
          {/* Lock Icon with Glow */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full flex items-center justify-center shadow-2xl">
              <Lock className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-full blur-xl opacity-50 animate-pulse" />
          </div>

          {/* Coming Soon Text */}
          <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
            Coming Soon
          </h1>

          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            We're building something amazing! The Explore page will feature thousands of open-source projects,
            templates, and collaborative coding examples from our community.
          </p>

          {/* Feature Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <Globe className="w-8 h-8 text-cyan-400 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Public Projects</h3>
              <p className="text-sm text-gray-400">Browse thousands of open-source projects</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <Award className="w-8 h-8 text-purple-400 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Featured Work</h3>
              <p className="text-sm text-gray-400">Discover trending and featured projects</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <Users className="w-8 h-8 text-pink-400 mb-3 mx-auto" />
              <h3 className="font-semibold mb-2">Community</h3>
              <p className="text-sm text-gray-400">Connect with developers worldwide</p>
            </div>
          </div>

          {/* Loading Animation */}
          <div className="flex items-center justify-center space-x-2 mb-8">
            <div className="w-3 h-3 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
            <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
            <div className="w-3 h-3 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>

          {/* Call to Action */}
          <div className="space-y-4">
            <p className="text-gray-400">Want to be notified when it launches?</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                placeholder="Enter your email"
                className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                disabled
              />
              <Button
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8"
                disabled
              >
                Notify Me
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* BLURRED ORIGINAL CONTENT BELOW */}
      <div className="blur-sm pointer-events-none select-none">
        {/* Header */}
        <div className="relative z-10 border-b border-white/10 bg-black/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                  Explore Projects
                </h1>
                <p className="text-gray-400 text-lg">Discover amazing projects from our community of developers</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    placeholder="Search projects, tags, or authors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="relative z-10 bg-black/10 backdrop-blur-sm border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Filters:</span>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category} className="bg-gray-800">
                    {category === "all" ? "All Categories" : category}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty} className="bg-gray-800">
                    {difficulty === "all" ? "All Levels" : difficulty}
                  </option>
                ))}
              </select>

              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white"
              >
                {languages.map((language) => (
                  <option key={language} value={language} className="bg-gray-800">
                    {language === "all" ? "All Languages" : language}
                  </option>
                ))}
              </select>

              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-gray-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm text-white"
                >
                  <option value="popular" className="bg-gray-800">
                    Most Popular
                  </option>
                  <option value="recent" className="bg-gray-800">
                    Recently Updated
                  </option>
                  <option value="views" className="bg-gray-800">
                    Most Viewed
                  </option>
                  <option value="forks" className="bg-gray-800">
                    Most Forked
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <Card
                key={project.id}
                className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors">
                        {project.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <img
                          src={project.authorAvatar || "/placeholder.svg"}
                          alt={project.author}
                          className="w-5 h-5 rounded-full"
                        />
                        <span className="text-sm text-gray-400">{project.author}</span>
                      </div>
                    </div>
                    <Badge className={getDifficultyColor(project.difficulty)}>{project.difficulty}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="text-gray-300 line-clamp-2">{project.description}</CardDescription>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs border-white/20 text-gray-300">
                        {tag}
                      </Badge>
                    ))}
                    {project.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs border-white/20 text-gray-400">
                        +{project.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4" />
                        <span>{project.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitFork className="w-4 h-4" />
                        <span>{project.forks}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{project.views}</span>
                      </div>
                    </div>
                    <Badge className={getLanguageColor(project.language)}>{project.language}</Badge>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      <span>Updated {new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                    >
                      <Code className="w-4 h-4 mr-1" />
                      View Code
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No projects found</h3>
              <p className="text-gray-400">Try adjusting your search criteria or filters</p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="relative z-10 bg-black/20 backdrop-blur-xl border-t border-white/10">
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">1,247</div>
                <div className="text-sm text-gray-400">Total Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400 mb-2">8,932</div>
                <div className="text-sm text-gray-400">Active Developers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400 mb-2">45,678</div>
                <div className="text-sm text-gray-400">Code Contributions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 mb-2">156</div>
                <div className="text-sm text-gray-400">Languages Supported</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
