"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Play, Users, Code, Palette, Zap } from "lucide-react"

interface HeroSectionProps {
  onGetStarted: () => void
  isLoading: boolean
}

export function HeroSection({ onGetStarted, isLoading }: HeroSectionProps) {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#00D1FF]/10 via-transparent to-[#C084FC]/10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-[#00D1FF]/20 to-[#C084FC]/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        <div className="text-center max-w-4xl mx-auto">
          {/* Announcement Badge */}
          <Badge className="mb-6 bg-[#00D1FF]/10 text-[#00D1FF] border-[#00D1FF]/20 hover:bg-[#00D1FF]/20 transition-colors">
            🚀 Now in Beta - Join the Future of Collaborative Coding
          </Badge>

          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-tight">
            Build Together,
            <br />
            <span className="bg-gradient-to-r from-[#00D1FF] to-[#C084FC] bg-clip-text text-transparent">
              Code Smarter
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            The ultimate collaborative development platform. Code, design, and ship together with AI-powered tools,
            real-time collaboration, and seamless integrations.
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
              <Code className="w-4 h-4 text-[#00D1FF]" />
              <span className="text-sm text-gray-300">VS Code-like Editor</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
              <Palette className="w-4 h-4 text-[#C084FC]" />
              <span className="text-sm text-gray-300">Design Canvas</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
              <Users className="w-4 h-4 text-[#00D1FF]" />
              <span className="text-sm text-gray-300">Real-time Collaboration</span>
            </div>
            <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-full">
              <Zap className="w-4 h-4 text-[#C084FC]" />
              <span className="text-sm text-gray-300">AI-Powered</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={onGetStarted}
              disabled={isLoading}
              className="bg-[#00D1FF] hover:bg-[#00B8E6] text-black font-semibold px-8 py-3 text-lg group"
            >
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 text-lg group"
              onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Try Demo
            </Button>
          </div>

          {/* Social Proof */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm mb-4">Trusted by developers worldwide</p>
            <div className="flex justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-gray-600">|</div>
              <div className="text-2xl font-bold">500+</div>
              <div className="text-gray-600">|</div>
              <div className="text-2xl font-bold">50+</div>
            </div>
            <div className="flex justify-center items-center gap-8 text-xs text-gray-500 mt-2">
              <div>Active Users</div>
              <div>Projects</div>
              <div>Teams</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
