"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowRight,
  Play,
  Users,
  Code,
  Palette,
  Zap,
  Star,
  Sparkles,
  Shield,
  Rocket,
  Heart,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleGetStarted = () => {
    setIsLoading(true)
    setTimeout(() => {
      router.push("/auth")
    }, 1000)
  }

  const features = [
    {
      icon: Code,
      title: "VS Code-like Editor",
      description: "Full-featured code editor with syntax highlighting, auto-completion, and real-time collaboration.",
      color: "text-bright-cyan",
    },
    {
      icon: Users,
      title: "Real-time Collaboration",
      description: "Work together seamlessly with live cursors, shared editing, and instant synchronization.",
      color: "text-bright-purple",
    },
    {
      icon: Palette,
      title: "Design Canvas",
      description: "Figma-like design tools integrated directly into your development workflow.",
      color: "text-bright-cyan",
    },
    {
      icon: Zap,
      title: "AI-Powered Coding",
      description: "Get intelligent code suggestions, bug fixes, and optimization recommendations.",
      color: "text-bright-purple",
    },
    {
      icon: Github,
      title: "GitHub Integration",
      description: "Seamless Git workflow with commit, push, pull, and branch management.",
      color: "text-bright-cyan",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with end-to-end encryption and compliance standards.",
      color: "text-bright-purple",
    },
  ]

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Lead Developer",
      company: "TechCorp",
      content: "CollabCode has revolutionized how our team works together. The real-time collaboration is incredible.",
      avatar: "SC",
    },
    {
      name: "Marcus Rodriguez",
      role: "Design Director",
      company: "DesignStudio",
      content: "The design canvas integration is a game-changer. We can design and code in the same environment.",
      avatar: "MR",
    },
    {
      name: "Emily Johnson",
      role: "Engineering Manager",
      company: "StartupXYZ",
      content: "First tool that truly feels built for modern development teams. The GitHub integration is seamless.",
      avatar: "EJ",
    },
  ]

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="cyber-grid min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-bright-purple/10 via-transparent to-bright-cyan/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-bright-purple/20 to-bright-cyan/20 rounded-full blur-3xl" />

          <div className="container mx-auto px-4 relative">
            <div className="text-center max-w-5xl mx-auto animate-slide-in-up">
              {/* Announcement Badge */}
              <Badge className="mb-8 bg-bright-purple/10 text-bright-purple border-bright-purple/20 hover:bg-bright-purple/20 transition-colors text-lg px-6 py-2">
                🚀 Now in Beta - Join the Future of Collaborative Coding
              </Badge>

              {/* Main Headline */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                <span className="text-text-primary">Build Together,</span>
                <br />
                <span className="gradient-text">Code Smarter</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-text-secondary mb-10 max-w-4xl mx-auto leading-relaxed">
                The ultimate collaborative development platform. Code, design, and ship together with AI-powered tools,
                real-time collaboration, and seamless integrations.
              </p>

              {/* Feature Highlights */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {[
                  { icon: Code, text: "VS Code-like Editor" },
                  { icon: Palette, text: "Design Canvas" },
                  { icon: Users, text: "Real-time Collaboration" },
                  { icon: Zap, text: "AI-Powered" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 glass-card px-6 py-3 rounded-full">
                    <item.icon className="w-5 h-5 text-bright-cyan" />
                    <span className="text-text-secondary font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  disabled={isLoading}
                  className="cyber-button text-white font-semibold px-10 py-4 text-xl group animate-pulse-glow"
                >
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <>
                      Get Started Free
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-gray/30 text-text-primary hover:bg-dark-slate/50 hover:border-bright-cyan px-10 py-4 text-xl group"
                  onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <Play className="w-6 h-6 mr-3 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Button>
              </div>

              {/* Social Proof */}
              <div className="mt-16 text-center">
                <p className="text-text-muted text-lg mb-6">Trusted by developers worldwide</p>
                <div className="flex justify-center items-center gap-12 opacity-80">
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text">10K+</div>
                    <div className="text-text-muted text-sm mt-1">Active Users</div>
                  </div>
                  <div className="w-px h-16 bg-slate-gray/30"></div>
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text">500+</div>
                    <div className="text-text-muted text-sm mt-1">Projects</div>
                  </div>
                  <div className="w-px h-16 bg-slate-gray/30"></div>
                  <div className="text-center">
                    <div className="text-4xl font-bold gradient-text">50+</div>
                    <div className="text-text-muted text-sm mt-1">Teams</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 animate-slide-in-up">
              <Badge className="mb-6 bg-bright-cyan/10 text-bright-cyan border-bright-cyan/20">Features</Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                <span className="text-text-primary">Everything you need to</span>
                <br />
                <span className="gradient-text">build amazing apps</span>
              </h2>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
                From coding to deployment, CollabCode provides all the tools you need for modern collaborative
                development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="glass-card hover:border-slate-gray/40 transition-all duration-300 hover:scale-105 group animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={`p-4 rounded-xl bg-dark-slate/50 ${feature.color} group-hover:scale-110 transition-transform`}
                      >
                        <feature.icon className="w-8 h-8" />
                      </div>
                      <Badge
                        variant="outline"
                        className="border-bright-purple/30 text-bright-purple bg-bright-purple/10"
                      >
                        Premium
                      </Badge>
                    </div>
                    <h3 className="text-2xl font-semibold text-text-primary mb-4">{feature.title}</h3>
                    <p className="text-text-secondary leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section id="demo" className="py-20 lg:py-32 bg-dark-slate/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-in-up">
              <Badge className="mb-6 bg-bright-purple/10 text-bright-purple border-bright-purple/20">
                Interactive Demo
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                <span className="text-text-primary">Try CollabCode</span>
                <br />
                <span className="gradient-text">right in your browser</span>
              </h2>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                Experience the power of collaborative development with our interactive demo. No signup required!
              </p>
            </div>

            <Card className="glass-card max-w-6xl mx-auto animate-slide-in-up">
              <CardContent className="p-8">
                <div className="aspect-video bg-slate-gray/30 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-button-gradient rounded-full flex items-center justify-center mx-auto mb-6 shadow-purple-glow">
                      <Play className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-text-primary mb-4">Interactive Demo Coming Soon</h3>
                    <p className="text-text-secondary mb-6">
                      Experience real-time collaboration, AI-powered coding, and seamless design integration.
                    </p>
                    <Button className="cyber-button text-white font-semibold">
                      <Rocket className="w-5 h-5 mr-2" />
                      Get Early Access
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 animate-slide-in-up">
              <Badge className="mb-6 bg-bright-cyan/10 text-bright-cyan border-bright-cyan/20">Testimonials</Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                <span className="text-text-primary">Loved by developers</span>
                <br />
                <span className="gradient-text">around the world</span>
              </h2>
              <p className="text-xl text-text-secondary max-w-3xl mx-auto">
                Join thousands of developers who have transformed their workflow with CollabCode.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card
                  key={index}
                  className="glass-card hover:border-slate-gray/40 transition-all duration-300 hover:scale-105 animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 bg-button-gradient rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-semibold text-text-primary text-lg">{testimonial.name}</h4>
                        <p className="text-text-muted">{testimonial.role}</p>
                        <p className="text-text-muted text-sm">{testimonial.company}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-text-secondary leading-relaxed italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-16">
              <div className="flex justify-center items-center gap-12 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-bright-cyan">4.9/5</div>
                  <div className="text-text-muted">Average Rating</div>
                </div>
                <div className="w-px h-16 bg-slate-gray/30"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-bright-purple">10K+</div>
                  <div className="text-text-muted">Happy Users</div>
                </div>
                <div className="w-px h-16 bg-slate-gray/30"></div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-bright-cyan">500+</div>
                  <div className="text-text-muted">Teams</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-32 bg-dark-slate/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto animate-slide-in-up">
              <Badge className="mb-8 bg-bright-purple/10 text-bright-purple border-bright-purple/20">
                Ready to get started?
              </Badge>
              <h2 className="text-4xl md:text-6xl font-bold mb-8">
                <span className="text-text-primary">Join the future of</span>
                <br />
                <span className="gradient-text">collaborative coding</span>
              </h2>
              <p className="text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
                Start building amazing projects with your team today. No credit card required.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button
                  size="lg"
                  onClick={handleGetStarted}
                  className="cyber-button text-white font-semibold px-10 py-4 text-xl group animate-pulse-glow"
                >
                  Start Free Trial
                  <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-gray/30 text-text-primary hover:bg-dark-slate/50 hover:border-bright-cyan px-10 py-4 text-xl"
                >
                  Schedule Demo
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-dark-slate/50 border-t border-slate-gray/20">
          <div className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Brand */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-button-gradient rounded-xl flex items-center justify-center shadow-purple-glow">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-3xl font-bold gradient-text">CollabCode</h3>
                    <Badge variant="outline" className="border-bright-purple text-bright-purple bg-bright-purple/10">
                      Beta
                    </Badge>
                  </div>
                </div>
                <p className="text-text-secondary mb-8 max-w-md leading-relaxed">
                  The ultimate collaborative development platform for modern teams. Build, design, and ship together
                  with AI-powered tools and premium features.
                </p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                  >
                    <Github className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                  >
                    <Twitter className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
                  >
                    <Linkedin className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-semibold text-text-primary mb-6 text-lg">Product</h4>
                <ul className="space-y-4">
                  {[
                    { href: "/pricing", label: "Pricing" },
                    { href: "/explore", label: "Templates" },
                    { href: "#", label: "Integrations" },
                    { href: "#", label: "API" },
                    { href: "#", label: "Documentation" },
                  ].map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-text-secondary hover:text-bright-cyan transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h4 className="font-semibold text-text-primary mb-6 text-lg">Resources</h4>
                <ul className="space-y-4">
                  {[
                    { href: "#", label: "Documentation" },
                    { href: "#", label: "Tutorials" },
                    { href: "#", label: "Blog" },
                    { href: "/community", label: "Community" },
                    { href: "#", label: "Support" },
                  ].map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-text-secondary hover:text-bright-cyan transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <h4 className="font-semibold text-text-primary mb-6 text-lg">Company</h4>
                <ul className="space-y-4">
                  {[
                    { href: "#", label: "About" },
                    { href: "#", label: "Careers" },
                    { href: "#", label: "Press" },
                    { href: "#", label: "Privacy" },
                    { href: "#", label: "Terms" },
                  ].map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="text-text-secondary hover:text-bright-cyan transition-colors duration-300"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-gray/20 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-text-muted">© 2025 CollabCode. All rights reserved.</p>
              <p className="text-text-muted flex items-center gap-1 mt-4 md:mt-0">
                Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for developers
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
