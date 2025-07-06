"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Search,
  MessageCircle,
  Book,
  Video,
  FileText,
  Mail,
  Clock,
  HelpCircle,
  Send,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  Play,
  Plus,
} from "lucide-react"

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketMessage, setTicketMessage] = useState("")
  const [chatMessage, setChatMessage] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const faqCategories = [
    { id: "all", name: "All Topics", count: 24 },
    { id: "getting-started", name: "Getting Started", count: 8 },
    { id: "projects", name: "Projects", count: 6 },
    { id: "collaboration", name: "Collaboration", count: 5 },
    { id: "billing", name: "Billing", count: 3 },
    { id: "technical", name: "Technical", count: 2 },
  ]

  const faqs = [
    {
      id: "1",
      category: "getting-started",
      question: "How do I create my first project?",
      answer:
        "To create your first project, click the 'New Project' button on your dashboard. Choose a framework, give your project a name, and you'll be taken to the workspace where you can start coding immediately.",
      helpful: 45,
      notHelpful: 2,
    },
    {
      id: "2",
      category: "collaboration",
      question: "How do I invite team members to my project?",
      answer:
        "In your project workspace, click the 'Share' button in the top toolbar. You can invite team members by email or share a collaboration link. Team members will receive real-time updates and can edit code simultaneously.",
      helpful: 38,
      notHelpful: 1,
    },
    {
      id: "3",
      category: "projects",
      question: "Can I import existing code from GitHub?",
      answer:
        "Yes! Use the 'Import' feature on your dashboard. You can connect your GitHub account and import repositories directly. All files and folder structure will be preserved.",
      helpful: 52,
      notHelpful: 3,
    },
    {
      id: "4",
      category: "technical",
      question: "What programming languages are supported?",
      answer:
        "CollabCode supports JavaScript, TypeScript, Python, HTML, CSS, and many more. Our Monaco editor provides syntax highlighting and IntelliSense for all major languages.",
      helpful: 67,
      notHelpful: 0,
    },
    {
      id: "5",
      category: "billing",
      question: "How does the pricing work?",
      answer:
        "We offer three tiers: Free (up to 3 projects), Professional ($9/month for unlimited projects), and Team ($19/month with advanced collaboration features). You can upgrade or downgrade anytime.",
      helpful: 29,
      notHelpful: 4,
    },
    {
      id: "6",
      category: "collaboration",
      question: "How does real-time collaboration work?",
      answer:
        "Our real-time collaboration uses WebSocket technology. You'll see live cursors of other users, instant code updates, and can communicate through integrated chat. Changes are synchronized in milliseconds.",
      helpful: 41,
      notHelpful: 2,
    },
  ]

  const tutorials = [
    {
      id: "1",
      title: "Getting Started with CollabCode",
      description: "Learn the basics of creating projects and navigating the interface",
      duration: "5 min",
      type: "video",
      difficulty: "Beginner",
      views: 1250,
    },
    {
      id: "2",
      title: "Real-time Collaboration Guide",
      description: "Master collaborative coding with your team",
      duration: "8 min",
      type: "video",
      difficulty: "Intermediate",
      views: 890,
    },
    {
      id: "3",
      title: "GitHub Integration Setup",
      description: "Connect your GitHub repositories and sync your code",
      duration: "6 min",
      type: "article",
      difficulty: "Beginner",
      views: 2100,
    },
    {
      id: "4",
      title: "Advanced Workspace Features",
      description: "Explore the design canvas, console, and AI assistant",
      duration: "12 min",
      type: "video",
      difficulty: "Advanced",
      views: 567,
    },
  ]

  const supportTickets = [
    {
      id: "TICK-001",
      subject: "Unable to save project changes",
      status: "Open",
      priority: "High",
      created: "2 hours ago",
      lastUpdate: "1 hour ago",
    },
    {
      id: "TICK-002",
      subject: "GitHub sync not working",
      status: "In Progress",
      priority: "Medium",
      created: "1 day ago",
      lastUpdate: "3 hours ago",
    },
    {
      id: "TICK-003",
      subject: "Billing question about team plan",
      status: "Resolved",
      priority: "Low",
      created: "3 days ago",
      lastUpdate: "2 days ago",
    },
  ]

  const filteredFaqs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-warning/10 text-warning border-warning/20"
      case "In Progress":
        return "bg-info/10 text-info border-info/20"
      case "Resolved":
        return "bg-success/10 text-success border-success/20"
      default:
        return "bg-slate-gray/10 text-text-muted border-slate-gray/20"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-400"
      case "Medium":
        return "text-yellow-400"
      case "Low":
        return "text-green-400"
      default:
        return "text-text-muted"
    }
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="cyber-grid min-h-screen">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="text-center mb-12 animate-slide-in-up">
            <h1 className="text-4xl font-bold gradient-text mb-4">Help & Support</h1>
            <p className="text-text-secondary text-lg max-w-2xl mx-auto">
              Get help with CollabCode, find answers to common questions, or contact our support team
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="glass-card hover:border-bright-cyan/40 transition-all duration-300 hover:scale-105 animate-slide-in-up">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-bright-cyan/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-bright-cyan" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Live Chat</h3>
                <p className="text-text-secondary text-sm mb-4">Get instant help from our support team</p>
                <Button className="w-full bg-bright-cyan/20 hover:bg-bright-cyan/30 text-bright-cyan border border-bright-cyan/20">
                  Start Chat
                </Button>
              </CardContent>
            </Card>

            <Card
              className="glass-card hover:border-bright-purple/40 transition-all duration-300 hover:scale-105 animate-slide-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-bright-purple/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-bright-purple" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Email Support</h3>
                <p className="text-text-secondary text-sm mb-4">Send us a detailed message about your issue</p>
                <Button className="w-full bg-bright-purple/20 hover:bg-bright-purple/30 text-bright-purple border border-bright-purple/20">
                  Create Ticket
                </Button>
              </CardContent>
            </Card>

            <Card
              className="glass-card hover:border-success/40 transition-all duration-300 hover:scale-105 animate-slide-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-success/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Book className="w-8 h-8 text-success" />
                </div>
                <h3 className="text-lg font-bold text-text-primary mb-2">Documentation</h3>
                <p className="text-text-secondary text-sm mb-4">Browse our comprehensive guides and tutorials</p>
                <Button className="w-full bg-success/20 hover:bg-success/30 text-success border border-success/20">
                  View Docs
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="faq" className="animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
            <TabsList className="grid w-full grid-cols-4 bg-dark-slate/50 border border-slate-gray/30">
              <TabsTrigger
                value="faq"
                className="data-[state=active]:bg-bright-purple/20 data-[state=active]:text-bright-purple"
              >
                FAQ
              </TabsTrigger>
              <TabsTrigger
                value="tutorials"
                className="data-[state=active]:bg-bright-purple/20 data-[state=active]:text-bright-purple"
              >
                Tutorials
              </TabsTrigger>
              <TabsTrigger
                value="tickets"
                className="data-[state=active]:bg-bright-purple/20 data-[state=active]:text-bright-purple"
              >
                My Tickets
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="data-[state=active]:bg-bright-purple/20 data-[state=active]:text-bright-purple"
              >
                Contact
              </TabsTrigger>
            </TabsList>

            {/* FAQ Tab */}
            <TabsContent value="faq" className="space-y-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Search and Filters */}
                <div className="lg:w-1/4">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-text-primary text-lg">Search & Filter</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted w-4 h-4" />
                        <Input
                          placeholder="Search FAQs..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 premium-input text-text-primary"
                        />
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-text-primary">Categories</h4>
                        {faqCategories.map((category) => (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                              selectedCategory === category.id
                                ? "bg-bright-purple/20 text-bright-purple"
                                : "text-text-secondary hover:text-bright-cyan hover:bg-dark-slate/50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span>{category.name}</span>
                              <Badge
                                variant="outline"
                                className="border-slate-gray/30 text-text-muted bg-dark-slate/30 text-xs"
                              >
                                {category.count}
                              </Badge>
                            </div>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* FAQ List */}
                <div className="lg:w-3/4">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-text-primary">Frequently Asked Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Accordion type="single" collapsible className="space-y-4">
                        {filteredFaqs.map((faq) => (
                          <AccordionItem
                            key={faq.id}
                            value={faq.id}
                            className="border border-slate-gray/20 rounded-lg px-4"
                          >
                            <AccordionTrigger className="text-text-primary hover:text-bright-cyan">
                              {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-text-secondary">
                              <p className="mb-4">{faq.answer}</p>
                              <div className="flex items-center justify-between pt-4 border-t border-slate-gray/20">
                                <div className="flex items-center gap-4 text-sm text-text-muted">
                                  <span>Was this helpful?</span>
                                  <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="text-success hover:text-success">
                                      <ThumbsUp className="w-3 h-3 mr-1" />
                                      {faq.helpful}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                                      <ThumbsDown className="w-3 h-3 mr-1" />
                                      {faq.notHelpful}
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>

                      {filteredFaqs.length === 0 && (
                        <div className="text-center py-8">
                          <HelpCircle className="w-12 h-12 text-text-muted mx-auto mb-4" />
                          <h3 className="text-lg font-bold text-text-primary mb-2">No FAQs found</h3>
                          <p className="text-text-secondary">
                            Try adjusting your search terms or browse different categories
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Tutorials Tab */}
            <TabsContent value="tutorials" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tutorials.map((tutorial, index) => (
                  <Card
                    key={tutorial.id}
                    className="glass-card hover:border-slate-gray/40 transition-all duration-300 hover:scale-[1.02] group animate-slide-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-bright-purple/20 to-bright-cyan/20 rounded-xl flex items-center justify-center">
                            {tutorial.type === "video" ? (
                              <Video className="w-6 h-6 text-bright-cyan" />
                            ) : (
                              <FileText className="w-6 h-6 text-bright-purple" />
                            )}
                          </div>
                          <div>
                            <Badge
                              variant="outline"
                              className={`text-xs mb-2 ${
                                tutorial.difficulty === "Beginner"
                                  ? "border-success/30 text-success bg-success/10"
                                  : tutorial.difficulty === "Intermediate"
                                    ? "border-warning/30 text-warning bg-warning/10"
                                    : "border-red-500/30 text-red-400 bg-red-500/10"
                              }`}
                            >
                              {tutorial.difficulty}
                            </Badge>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="text-text-muted hover:text-bright-cyan">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>

                      <h3 className="text-lg font-bold text-text-primary group-hover:text-bright-cyan transition-colors mb-2">
                        {tutorial.title}
                      </h3>
                      <p className="text-text-secondary text-sm mb-4">{tutorial.description}</p>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-gray/20">
                        <div className="flex items-center gap-4 text-xs text-text-muted">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {tutorial.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <Play className="w-3 h-3" />
                            {tutorial.views} views
                          </div>
                        </div>

                        <Button size="sm" className="cyber-button text-white">
                          {tutorial.type === "video" ? "Watch" : "Read"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Support Tickets Tab */}
            <TabsContent value="tickets" className="space-y-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-text-primary">My Support Tickets</h3>
                <Button className="cyber-button text-white font-semibold">
                  <Plus className="w-4 h-4 mr-2" />
                  New Ticket
                </Button>
              </div>

              <div className="space-y-4">
                {supportTickets.map((ticket, index) => (
                  <Card
                    key={ticket.id}
                    className="glass-card hover:border-slate-gray/40 transition-all duration-300 animate-slide-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-text-primary">{ticket.subject}</h4>
                            <Badge variant="outline" className={`text-xs ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`text-xs border-slate-gray/30 ${getPriorityColor(ticket.priority)}`}
                            >
                              {ticket.priority}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-text-muted">
                            <span>#{ticket.id}</span>
                            <span>Created {ticket.created}</span>
                            <span>Last update {ticket.lastUpdate}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {supportTickets.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gradient-to-r from-bright-purple/20 to-bright-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MessageCircle className="w-12 h-12 text-text-muted" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-2">No support tickets</h3>
                  <p className="text-text-secondary mb-6">You haven't created any support tickets yet</p>
                  <Button className="cyber-button text-white font-semibold">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Ticket
                  </Button>
                </div>
              )}
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Contact Form */}
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-text-primary">Send us a message</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Subject</label>
                      <Input
                        placeholder="What can we help you with?"
                        value={ticketSubject}
                        onChange={(e) => setTicketSubject(e.target.value)}
                        className="premium-input text-text-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">Message</label>
                      <textarea
                        placeholder="Describe your issue or question in detail..."
                        value={ticketMessage}
                        onChange={(e) => setTicketMessage(e.target.value)}
                        className="w-full premium-input text-text-primary h-32 resize-none"
                      />
                    </div>
                    <Button className="w-full cyber-button text-white font-semibold">
                      <Send className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>
                  </CardContent>
                </Card>

                {/* Contact Information */}
                <div className="space-y-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-text-primary">Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-bright-cyan/20 rounded-lg flex items-center justify-center">
                          <Mail className="w-5 h-5 text-bright-cyan" />
                        </div>
                        <div>
                          <p className="text-text-primary font-medium">Email Support</p>
                          <p className="text-text-secondary text-sm">support@collabcode.dev</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-bright-purple/20 rounded-lg flex items-center justify-center">
                          <MessageCircle className="w-5 h-5 text-bright-purple" />
                        </div>
                        <div>
                          <p className="text-text-primary font-medium">Live Chat</p>
                          <p className="text-text-secondary text-sm">Available 24/7</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-success/20 rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-success" />
                        </div>
                        <div>
                          <p className="text-text-primary font-medium">Response Time</p>
                          <p className="text-text-secondary text-sm">Usually within 2 hours</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="text-text-primary">Live Chat</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-dark-slate/50 rounded-lg p-4 h-48 mb-4 overflow-y-auto">
                        <div className="space-y-3">
                          <div className="flex items-start gap-2">
                            <div className="w-6 h-6 bg-bright-purple/20 rounded-full flex items-center justify-center">
                              <span className="text-xs text-bright-purple">S</span>
                            </div>
                            <div className="bg-bright-purple/10 rounded-lg p-2 max-w-xs">
                              <p className="text-text-primary text-sm">Hi! How can I help you today?</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Type your message..."
                          value={chatMessage}
                          onChange={(e) => setChatMessage(e.target.value)}
                          className="premium-input text-text-primary"
                        />
                        <Button className="cyber-button text-white">
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
