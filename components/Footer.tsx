"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Twitter, Linkedin, Mail, Sparkles, ArrowRight, Heart } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      {/* CTA Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-6 bg-[#00D1FF]/10 text-[#00D1FF] border-[#00D1FF]/20">Ready to get started?</Badge>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Join the future of
              <br />
              <span className="bg-gradient-to-r from-[#00D1FF] to-[#C084FC] bg-clip-text text-transparent">
                collaborative coding
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Start building amazing projects with your team today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#00D1FF] hover:bg-[#00B8E6] text-black font-semibold px-8 py-3 text-lg group"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800 px-8 py-3 text-lg"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[#00D1FF] to-[#C084FC] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-white">CollabCode</h3>
                <Badge variant="outline" className="border-[#00D1FF] text-[#00D1FF] text-xs">
                  Beta
                </Badge>
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md">
              The ultimate collaborative development platform for modern teams. Build, design, and ship together with
              AI-powered tools.
            </p>
            <div className="flex gap-4">
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
                <Github className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
                <Linkedin className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:text-white">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                  Templates
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                  Integrations
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                  API
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                  Tutorials
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                  Community
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                  Press
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© 2025 CollabCode. All rights reserved.</p>
          <p className="text-gray-400 text-sm flex items-center gap-1 mt-4 md:mt-0">
            Made with <Heart className="w-4 h-4 text-red-500 fill-current" /> for developers
          </p>
        </div>
      </div>
    </footer>
  )
}
