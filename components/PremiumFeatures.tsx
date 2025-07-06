"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, Users, Zap, Shield, Palette, Globe, Brain, Rocket, Heart } from "lucide-react"

export function PremiumFeatures() {
  const features = [
    {
      icon: Code,
      title: "AI-Powered Coding",
      description:
        "Intelligent code suggestions, auto-completion, and real-time error detection powered by advanced AI models.",
      badge: "Smart",
      gradient: "from-vibrant-teal to-deep-violet",
    },
    {
      icon: Users,
      title: "Real-Time Collaboration",
      description:
        "Work together seamlessly with live cursors, instant sync, and collaborative editing across all your projects.",
      badge: "Live",
      gradient: "from-soft-gold to-vibrant-teal",
    },
    {
      icon: Zap,
      title: "Lightning Performance",
      description:
        "Optimized for speed with sub-second load times, instant deployments, and edge-powered infrastructure.",
      badge: "Fast",
      gradient: "from-deep-violet to-soft-gold",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-grade encryption, SOC 2 compliance, and advanced access controls to keep your code secure.",
      badge: "Secure",
      gradient: "from-vibrant-teal to-midnight-blue",
    },
    {
      icon: Palette,
      title: "Custom Themes",
      description: "Personalize your workspace with unlimited themes, custom color schemes, and adaptive interfaces.",
      badge: "Beautiful",
      gradient: "from-soft-gold to-deep-violet",
    },
    {
      icon: Globe,
      title: "Global CDN",
      description:
        "Deploy instantly to 100+ edge locations worldwide with automatic scaling and zero-downtime updates.",
      badge: "Global",
      gradient: "from-deep-violet to-vibrant-teal",
    },
    {
      icon: Brain,
      title: "Smart Analytics",
      description:
        "Gain insights into your development patterns, team productivity, and project health with AI-driven analytics.",
      badge: "Insights",
      gradient: "from-vibrant-teal to-soft-gold",
    },
    {
      icon: Rocket,
      title: "One-Click Deploy",
      description:
        "Deploy to production with a single click. Automatic previews, rollbacks, and environment management.",
      badge: "Deploy",
      gradient: "from-soft-gold to-midnight-blue",
    },
    {
      icon: Heart,
      title: "Premium Support",
      description:
        "24/7 priority support from our expert team, dedicated success manager, and exclusive community access.",
      badge: "Premium",
      gradient: "from-deep-violet to-soft-gold",
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-midnight-blue relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-vibrant-teal rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-soft-gold rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-slide-in-up">
          <Badge variant="premium" className="mb-4">
            Premium Features
          </Badge>
          <h2 className="heading-section text-platinum-white mb-6">
            Everything you need to build
            <br />
            <span className="text-elegant text-vibrant-teal">extraordinary applications</span>
          </h2>
          <p className="text-xl text-platinum-white/70 max-w-3xl mx-auto">
            Discover the tools and features that make CollabCode the choice of elite developers and innovative teams
            worldwide.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card
                key={index}
                variant="glass"
                className="group hover:scale-105 transition-all duration-500 animate-slide-in-up border-white/10 hover:border-vibrant-teal/30"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-2xl bg-gradient-to-br ${feature.gradient} group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.badge}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl group-hover:text-vibrant-teal transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-platinum-white/70 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-slide-in-up">
          <p className="text-platinum-white/60 mb-4">Ready to experience the future of development?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">Start Free Trial</button>
            <button className="btn-secondary">Schedule Demo</button>
          </div>
        </div>
      </div>
    </section>
  )
}
