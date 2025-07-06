"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Menu, X, Github, Sparkles } from "lucide-react"

interface HeaderProps {
  onGetStarted: () => void
}

export function Header({ onGetStarted }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[#00D1FF] to-[#C084FC] rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">CollabCode</h1>
              <Badge variant="outline" className="border-[#00D1FF] text-[#00D1FF] text-xs">
                Beta
              </Badge>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
              Features
            </a>
            <a href="#demo" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
              Try Demo
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
              Pricing
            </a>
            <a href="#docs" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
              Docs
            </a>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-gray-300 hover:text-white">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button onClick={onGetStarted} className="bg-[#00D1FF] hover:bg-[#00B8E6] text-black font-semibold">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800">
            <nav className="flex flex-col gap-4 mt-4">
              <a href="#features" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                Features
              </a>
              <a href="#demo" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                Try Demo
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                Pricing
              </a>
              <a href="#docs" className="text-gray-300 hover:text-[#00D1FF] transition-colors">
                Docs
              </a>
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline" className="border-gray-600 text-white">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button onClick={onGetStarted} className="bg-[#00D1FF] hover:bg-[#00B8E6] text-black font-semibold">
                  Get Started
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
