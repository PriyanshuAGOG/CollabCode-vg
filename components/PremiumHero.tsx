"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Sparkles, Zap, Users, Code } from "lucide-react"

export function PremiumHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const floatingElements = [
    { icon: Code, delay: "0s", position: "top-20 left-20" },
    { icon: Users, delay: "0.5s", position: "top-40 right-32" },
    { icon: Zap, delay: "1s", position: "bottom-40 left-32" },
    { icon: Sparkles, delay: "1.5s", position: "bottom-20 right-20" },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-hero-gradient">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(0, 196, 180, 0.3) 0%, transparent 50%)`,
          }}
        />

        {/* Floating Elements */}
        {floatingElements.map((element, index) => {
          const Icon = element.icon
          return (
            <div
              key={index}
              className={`absolute ${element.position} animate-float opacity-20`}
              style={{ animationDelay: element.delay }}
            >
              <Icon className="w-8 h-8 text-vibrant-teal" />
            </div>
          )
        })}

        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `
              linear-gradient(rgba(245, 246, 245, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245, 246, 245, 0.1) 1px, transparent 1px)
            `,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-slide-in-up">
          <Badge variant="premium" className="mb-6 animate-pulse-glow">
            ✨ Introducing CollabCode Premium
          </Badge>

          <h1 className="heading-hero text-platinum-white mb-6 animate-gradient bg-gradient-to-r from-platinum-white via-vibrant-teal to-soft-gold bg-clip-text text-transparent">
            Transform Ideas into Reality with
            <br />
            <span className="text-elegant">Collaborative Intelligence</span>
          </h1>

          <p className="text-xl text-platinum-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
            Experience the future of development with AI-powered collaboration, real-time editing, and premium tools
            designed for modern teams who demand excellence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="xl" className="group animate-pulse-glow">
              Start Building Now
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
            <Button variant="secondary" size="xl">
              Explore Features
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { number: "10K+", label: "Active Developers" },
              { number: "500+", label: "Projects Created" },
              { number: "99.9%", label: "Uptime" },
              { number: "24/7", label: "Premium Support" },
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-3xl font-bold text-vibrant-teal mb-2">{stat.number}</div>
                <div className="text-platinum-white/60 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-platinum-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-vibrant-teal rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
