"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Full Stack Developer",
    company: "TechCorp",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "CollabCode has revolutionized how our team works together. The real-time collaboration features are incredible, and the AI assistance saves us hours every day.",
    highlight: "Saves hours every day",
  },
  {
    name: "Marcus Rodriguez",
    role: "Lead Designer",
    company: "DesignStudio",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "The design canvas integration is a game-changer. Being able to design and code in the same environment has streamlined our entire workflow.",
    highlight: "Game-changer for workflow",
  },
  {
    name: "Emily Johnson",
    role: "Engineering Manager",
    company: "StartupXYZ",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "We've tried many collaboration tools, but CollabCode is the first that truly feels built for modern development teams. The GitHub integration is seamless.",
    highlight: "Built for modern teams",
  },
  {
    name: "David Kim",
    role: "Frontend Developer",
    company: "WebAgency",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "The VS Code-like editor with real-time collaboration is exactly what we needed. No more merge conflicts or coordination issues!",
    highlight: "No more merge conflicts",
  },
  {
    name: "Lisa Wang",
    role: "Product Designer",
    company: "InnovateLab",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "CollabCode bridges the gap between design and development perfectly. The live preview feature helps us iterate faster than ever.",
    highlight: "Iterate faster than ever",
  },
  {
    name: "Alex Thompson",
    role: "CTO",
    company: "ScaleUp Inc",
    avatar: "/placeholder.svg?height=60&width=60",
    rating: 5,
    content:
      "The AI-powered features and template marketplace have accelerated our development process significantly. Highly recommended for any tech team.",
    highlight: "Accelerated development",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-20 lg:py-32 bg-gray-900/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#C084FC]/10 text-[#C084FC] border-[#C084FC]/20">Testimonials</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Loved by developers
            <br />
            <span className="bg-gradient-to-r from-[#00D1FF] to-[#C084FC] bg-clip-text text-transparent">
              around the world
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Join thousands of developers who have transformed their workflow with CollabCode.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="bg-gray-800/50 border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 group"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full border-2 border-gray-600"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                    <p className="text-xs text-gray-500">{testimonial.company}</p>
                  </div>
                  <div className="flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-[#00D1FF]/30" />
                  <p className="text-gray-300 leading-relaxed mb-4 pl-4">{testimonial.content}</p>
                </div>

                <Badge variant="outline" className="border-[#00D1FF]/30 text-[#00D1FF] bg-[#00D1FF]/5">
                  {testimonial.highlight}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex justify-center items-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00D1FF]">4.9/5</div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </div>
            <div className="w-px h-12 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#C084FC]">10K+</div>
              <div className="text-sm text-gray-400">Happy Users</div>
            </div>
            <div className="w-px h-12 bg-gray-600"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-[#00D1FF]">500+</div>
              <div className="text-sm text-gray-400">Teams</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
