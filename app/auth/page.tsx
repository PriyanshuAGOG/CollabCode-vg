"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Github, Mail, Eye, EyeOff, ArrowRight, Check, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    setTimeout(() => {
      const userData = {
        name: formData.name || "John Doe",
        email: formData.email,
        avatar: (formData.name || "John Doe")
          .split(" ")
          .map((n) => n[0])
          .join(""),
      }

      // Set both keys for consistency
      localStorage.setItem("isAuthenticated", "true")
      localStorage.setItem("user", JSON.stringify(userData))

      // Dispatch custom event to notify navigation component
      window.dispatchEvent(new CustomEvent("authStateChanged"))

      setIsLoading(false)
      router.push("/dashboard")
    }, 2000)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-deep-navy flex items-center justify-center p-4 relative overflow-hidden">
      <div className="cyber-grid min-h-screen absolute inset-0" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-bright-purple/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-bright-cyan/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-soft-purple/20 rounded-full blur-2xl animate-float"></div>
      </div>

      {/* Back to Home */}
      <Link
        href="/"
        className="absolute top-6 left-6 text-text-secondary hover:text-bright-cyan transition-colors z-10 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* Auth Card */}
      <Card className="w-full max-w-md glass-card border-slate-gray/30 relative z-10 animate-slide-in-up">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-14 h-14 bg-button-gradient rounded-xl flex items-center justify-center shadow-purple-glow">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">CollabCode</h1>
              <Badge
                variant="outline"
                className="border-bright-purple text-bright-purple bg-bright-purple/10 text-xs mt-1"
              >
                Premium
              </Badge>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-text-primary mb-3">
            {isLogin ? "Welcome Back" : "Join CollabCode"}
          </CardTitle>
          <p className="text-text-secondary text-lg">
            {isLogin ? "Sign in to your premium workspace" : "Create your premium development workspace"}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Full Name</label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="premium-input h-12 text-text-primary"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="Enter your email"
                className="premium-input h-12 text-text-primary"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Enter your password"
                  className="premium-input h-12 text-text-primary pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-primary">Confirm Password</label>
                <Input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  className="premium-input h-12 text-text-primary"
                  required
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full cyber-button text-white font-semibold py-4 text-lg transition-all duration-300 hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  {isLogin ? "Signing In..." : "Creating Account..."}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-gray/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-deep-navy text-text-muted">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan h-12"
            >
              <Github className="w-5 h-5 mr-2" />
              GitHub
            </Button>
            <Button
              variant="outline"
              className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan h-12"
            >
              <Mail className="w-5 h-5 mr-2" />
              Google
            </Button>
          </div>

          <div className="text-center">
            <p className="text-text-secondary">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button
                variant="link"
                className="text-bright-cyan hover:text-bright-purple font-semibold ml-2 p-0"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Sign up" : "Sign in"}
              </Button>
            </p>
          </div>

          {!isLogin && (
            <div className="glass-card border-bright-cyan/20 p-6 rounded-xl">
              <h4 className="text-text-primary font-semibold mb-3 flex items-center gap-2">
                <Check className="w-5 h-5 text-bright-cyan" />
                Premium Features Included
              </h4>
              <ul className="text-sm text-text-secondary space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-bright-cyan rounded-full"></div>
                  Real-time collaboration
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-bright-cyan rounded-full"></div>
                  AI-powered coding assistant
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-bright-cyan rounded-full"></div>
                  Unlimited projects & teams
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-bright-cyan rounded-full"></div>
                  Advanced analytics
                </li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
