"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Github, Twitter, Linkedin, Mail, ArrowRight, Heart } from "lucide-react"

export function PremiumFooter() {
  return (
    <footer className="bg-charcoal-gray/50 border-t border-white/10">
      {/* CTA Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center animate-slide-in-up">
            <Badge variant="premium" className="mb-6">
              Ready to get started?
            </Badge>
            <h2 className="heading-section text-platinum-white mb-6">
              Join the future of
              <br />
              <span className="text-elegant text-vibrant-teal">collaborative development</span>
            </h2>
            <p className="text-xl text-platinum-white/70 mb-8 max-w-2xl mx-auto">
              Start building amazing projects with your team today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group animate-pulse-glow">
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
              <Button variant="secondary" size="lg">
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-button-gradient rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-midnight-blue" />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-platinum-white">CollabCode</span>
                <Badge variant="premium">Premium</Badge>
              </div>
            </Link>
            <p className="text-platinum-white/70 mb-6 max-w-md leading-relaxed">
              The ultimate collaborative development platform for modern teams. Build, design, and ship together with
              AI-powered tools and premium features.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="hover:text-vibrant-teal">
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-vibrant-teal">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-vibrant-teal">
                <Linkedin className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-vibrant-teal">
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-platinum-white mb-4">Product</h4>
            <ul className="space-y-3">
              {[
                { href: "/pricing", label: "Pricing" },
                { href: "/templates", label: "Templates" },
                { href: "/integrations", label: "Integrations" },
                { href: "/api", label: "API" },
                { href: "/docs", label: "Documentation" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-platinum-white/70 hover:text-vibrant-teal transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold text-platinum-white mb-4">Resources</h4>
            <ul className="space-y-3">
              {[
                { href: "/docs", label: "Documentation" },
                { href: "/tutorials", label: "Tutorials" },
                { href: "/blog", label: "Blog" },
                { href: "/community", label: "Community" },
                { href: "/support", label: "Support" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-platinum-white/70 hover:text-vibrant-teal transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-platinum-white mb-4">Company</h4>
            <ul className="space-y-3">
              {[
                { href: "/about", label: "About" },
                { href: "/careers", label: "Careers" },
                { href: "/press", label: "Press" },
                { href: "/privacy", label: "Privacy" },
                { href: "/terms", label: "Terms" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-platinum-white/70 hover:text-vibrant-teal transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-platinum-white/60 text-sm">© 2025 CollabCode. All rights reserved.</p>
          <p className="text-platinum-white/60 text-sm flex items-center space-x-1 mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for developers</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
