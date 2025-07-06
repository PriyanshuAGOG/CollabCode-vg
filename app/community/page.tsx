"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Search, TrendingUp, Clock, Users, ThumbsUp, MessageCircle, Bookmark, Pin } from "lucide-react"

interface Thread {
  id: string
  title: string
  content: string
  author: string
  avatar: string
  category: string
  tags: string[]
  upvotes: number
  replies: number
  views: number
  createdAt: string
  isPinned: boolean
  isBookmarked: boolean
}

interface Reply {
  id: string
  content: string
  author: string
  avatar: string
  upvotes: number
  createdAt: string
}

export default function CommunityPage() {
  const [threads, setThreads] = useState<Thread[]>([
    {
      id: "1",
      title: "Best practices for React state management in 2024?",
      content:
        "I'm working on a large React application and wondering what the community thinks about the current state management solutions. Should I stick with Redux, try Zustand, or go with React's built-in state?",
      author: "Sarah Chen",
      avatar: "SC",
      category: "React",
      tags: ["react", "state-management", "redux", "zustand"],
      upvotes: 24,
      replies: 12,
      views: 156,
      createdAt: "2 hours ago",
      isPinned: true,
      isBookmarked: false,
    },
    {
      id: "2",
      title: "How to optimize bundle size in Next.js applications?",
      content:
        "My Next.js app bundle is getting quite large. What are the best strategies for code splitting and reducing bundle size? Any tools or techniques you'd recommend?",
      author: "Mike Johnson",
      avatar: "MJ",
      category: "Next.js",
      tags: ["nextjs", "performance", "optimization", "bundle"],
      upvotes: 18,
      replies: 8,
      views: 89,
      createdAt: "4 hours ago",
      isPinned: false,
      isBookmarked: true,
    },
    {
      id: "3",
      title: "TypeScript vs JavaScript for new projects in 2024",
      content:
        "Starting a new project and debating whether to use TypeScript or stick with JavaScript. What are your thoughts on the current state of TypeScript adoption?",
      author: "Emma Davis",
      avatar: "ED",
      category: "TypeScript",
      tags: ["typescript", "javascript", "development"],
      upvotes: 31,
      replies: 15,
      views: 203,
      createdAt: "6 hours ago",
      isPinned: false,
      isBookmarked: false,
    },
    {
      id: "4",
      title: "Building real-time features with WebSockets vs Server-Sent Events",
      content:
        "I need to implement real-time updates in my application. Should I use WebSockets or Server-Sent Events? What are the pros and cons of each approach?",
      author: "Alex Chen",
      avatar: "AC",
      category: "Backend",
      tags: ["websockets", "sse", "realtime", "backend"],
      upvotes: 15,
      replies: 6,
      views: 67,
      createdAt: "8 hours ago",
      isPinned: false,
      isBookmarked: false,
    },
  ])

  const [selectedThread, setSelectedThread] = useState<Thread | null>(null)
  const [replies] = useState<Reply[]>([
    {
      id: "1",
      content:
        "I've been using Zustand for the past year and it's been fantastic. Much simpler than Redux and perfect for most use cases. The learning curve is minimal and the bundle size is tiny.",
      author: "David Kim",
      avatar: "DK",
      upvotes: 8,
      createdAt: "1 hour ago",
    },
    {
      id: "2",
      content:
        "For large applications, I still prefer Redux Toolkit. The DevTools are incredible and the predictable state updates make debugging much easier. Zustand is great for smaller projects though.",
      author: "Lisa Wang",
      avatar: "LW",
      upvotes: 12,
      createdAt: "45 minutes ago",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [showNewThread, setShowNewThread] = useState(false)
  const [newThreadTitle, setNewThreadTitle] = useState("")
  const [newThreadContent, setNewThreadContent] = useState("")
  const [newThreadCategory, setNewThreadCategory] = useState("General")

  const categories = ["All", "React", "Next.js", "TypeScript", "Backend", "Design", "Career", "General"]

  const filteredThreads = threads.filter((thread) => {
    const matchesSearch =
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory = selectedCategory === "All" || thread.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleUpvote = (threadId: string) => {
    setThreads(threads.map((thread) => (thread.id === threadId ? { ...thread, upvotes: thread.upvotes + 1 } : thread)))
  }

  const handleBookmark = (threadId: string) => {
    setThreads(
      threads.map((thread) => (thread.id === threadId ? { ...thread, isBookmarked: !thread.isBookmarked } : thread)),
    )
  }

  const handleCreateThread = () => {
    if (!newThreadTitle.trim() || !newThreadContent.trim()) return

    const newThread: Thread = {
      id: Date.now().toString(),
      title: newThreadTitle,
      content: newThreadContent,
      author: "You",
      avatar: "YO",
      category: newThreadCategory,
      tags: [],
      upvotes: 0,
      replies: 0,
      views: 0,
      createdAt: "Just now",
      isPinned: false,
      isBookmarked: false,
    }

    setThreads([newThread, ...threads])
    setNewThreadTitle("")
    setNewThreadContent("")
    setNewThreadCategory("General")
    setShowNewThread(false)
  }

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-[#00D1FF] to-[#C084FC] bg-clip-text text-transparent">
              Community Forum
            </h1>
            <p className="text-gray-400">Connect, share knowledge, and learn from fellow developers</p>
          </div>
          <Button onClick={() => setShowNewThread(true)} className="bg-[#00D1FF] hover:bg-[#00B8E6] text-black">
            <Plus className="w-4 h-4 mr-2" />
            New Thread
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search discussions..."
                    className="pl-10 bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category)}
                      className={
                        selectedCategory === category
                          ? "bg-[#00D1FF] text-black"
                          : "border-gray-600 text-white hover:bg-gray-800"
                      }
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {filteredThreads.map((thread) => (
                <Card
                  key={thread.id}
                  className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedThread(thread)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" alt={thread.author} />
                        <AvatarFallback className="bg-[#00D1FF] text-black font-bold">{thread.avatar}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {thread.isPinned && <Pin className="w-4 h-4 text-yellow-400" />}
                            <h3 className="text-lg font-semibold text-white hover:text-[#00D1FF] transition-colors">
                              {thread.title}
                            </h3>
                          </div>
                          <Badge variant="outline" className="border-gray-600 text-gray-400">
                            {thread.category}
                          </Badge>
                        </div>

                        <p className="text-gray-300 mb-3 leading-relaxed line-clamp-2">{thread.content}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {thread.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-gray-600 text-gray-400">
                              #{tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span>by {thread.author}</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {thread.createdAt}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="w-3 h-3" />
                                {thread.upvotes}
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" />
                                {thread.replies}
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-3 h-3" />
                                {thread.views}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleUpvote(thread.id)
                                }}
                                className="text-gray-400 hover:text-[#00D1FF]"
                              >
                                <ThumbsUp className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleBookmark(thread.id)
                                }}
                                className={`${
                                  thread.isBookmarked ? "text-yellow-400" : "text-gray-400"
                                } hover:text-yellow-400`}
                              >
                                <Bookmark className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#00D1FF]" />
                  Trending Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {["React 18 Features", "TypeScript 5.0", "Next.js 14", "Tailwind CSS", "Node.js Performance"].map(
                    (topic, index) => (
                      <div key={topic} className="flex items-center justify-between">
                        <span className="text-gray-300">{topic}</span>
                        <Badge variant="outline" className="border-gray-600 text-gray-400">
                          {Math.floor(Math.random() * 50) + 10}
                        </Badge>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#C084FC]" />
                  Active Members
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Chen", avatar: "SC", posts: 45 },
                    { name: "Mike Johnson", avatar: "MJ", posts: 32 },
                    { name: "Emma Davis", avatar: "ED", posts: 28 },
                    { name: "Alex Chen", avatar: "AC", posts: 24 },
                  ].map((member) => (
                    <div key={member.name} className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-[#C084FC] text-black text-xs">{member.avatar}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="text-white text-sm">{member.name}</p>
                        <p className="text-gray-400 text-xs">{member.posts} posts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Thread Detail Modal */}
        {selectedThread && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl bg-gray-900 border-gray-700 max-h-[90vh] overflow-auto">
              <CardHeader className="border-b border-gray-700">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl text-white">{selectedThread.title}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Avatar className="w-6 h-6">
                        <AvatarFallback className="bg-[#00D1FF] text-black text-xs">
                          {selectedThread.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-400">{selectedThread.author}</span>
                      <span className="text-gray-500">•</span>
                      <span className="text-gray-400">{selectedThread.createdAt}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedThread(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-gray-300 leading-relaxed mb-6">{selectedThread.content}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedThread.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="border-gray-600 text-gray-400">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="border-t border-gray-700 pt-6">
                  <h4 className="font-semibold text-white mb-4">Replies ({replies.length})</h4>
                  <div className="space-y-4">
                    {replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3 p-4 bg-gray-800/50 rounded-lg">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-[#C084FC] text-black text-xs">{reply.avatar}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-white">{reply.author}</span>
                            <span className="text-gray-400 text-sm">{reply.createdAt}</span>
                          </div>
                          <p className="text-gray-300 leading-relaxed">{reply.content}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-[#00D1FF]">
                              <ThumbsUp className="w-3 h-3 mr-1" />
                              {reply.upvotes}
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                    <textarea
                      placeholder="Write your reply..."
                      rows={3}
                      className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder:text-gray-400 resize-none"
                    />
                    <div className="flex justify-end mt-2">
                      <Button className="bg-[#00D1FF] hover:bg-[#00B8E6] text-black">Post Reply</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* New Thread Modal */}
        {showNewThread && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Create New Thread</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Title</label>
                  <Input
                    value={newThreadTitle}
                    onChange={(e) => setNewThreadTitle(e.target.value)}
                    placeholder="Enter thread title"
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Category</label>
                  <select
                    value={newThreadCategory}
                    onChange={(e) => setNewThreadCategory(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white"
                  >
                    {categories.slice(1).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Content</label>
                  <textarea
                    value={newThreadContent}
                    onChange={(e) => setNewThreadContent(e.target.value)}
                    placeholder="Describe your question or topic..."
                    rows={6}
                    className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white placeholder:text-gray-400"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleCreateThread}
                    disabled={!newThreadTitle.trim() || !newThreadContent.trim()}
                    className="flex-1 bg-[#00D1FF] hover:bg-[#00B8E6] text-black"
                  >
                    Create Thread
                  </Button>
                  <Button
                    onClick={() => setShowNewThread(false)}
                    variant="outline"
                    className="border-gray-600 text-white hover:bg-gray-800"
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
  )
}
