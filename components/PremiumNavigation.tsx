"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Menu,
  X,
  Sparkles,
  Crown,
  User,
  Settings,
  LogOut,
  Home,
  MessageSquare,
  Users,
  Compass,
  FolderOpen,
  HelpCircle,
} from "lucide-react"
import { NotificationCenter } from "./NotificationCenter"
import { GlobalSearch } from "./GlobalSearch"

export function PremiumNavigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkAuthStatus = () => {
      const authStatus = localStorage.getItem("isAuthenticated")
      const userData = localStorage.getItem("user")

      if (authStatus === "true" && userData) {
        setIsAuthenticated(true)
        setUser(JSON.parse(userData))
      } else {
        setIsAuthenticated(false)
        setUser(null)
      }
    }

    // Check initial auth status
    checkAuthStatus()

    // Listen for storage changes (when auth state changes)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "isAuthenticated" || e.key === "user") {
        checkAuthStatus()
      }
    }

    // Listen for custom auth events
    const handleAuthChange = () => {
      checkAuthStatus()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("authStateChanged", handleAuthChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("authStateChanged", handleAuthChange)
    }
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    setIsAuthenticated(false)
    setUser(null)

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("authStateChanged"))

    router.push("/")
  }

  const handleGetStarted = () => {
    router.push("/auth")
  }

  // Navigation items for authenticated users
  const dashboardNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Teams", href: "/teams", icon: Users },
    { name: "Explore", href: "/explore", icon: Compass },
    { name: "Projects", href: "/projects", icon: FolderOpen },
  ]

  // Public navigation items (shown on landing page)
  const publicNavItems = [
    { name: "Explore", href: "/explore" },
    { name: "Pricing", href: "/pricing" },
  ]

  const isLandingPage = pathname === "/"

  return (
    <nav className="sticky top-0 z-50 bg-deep-navy/95 backdrop-blur-xl border-b border-slate-gray/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-button-gradient rounded-xl flex items-center justify-center shadow-purple-glow group-hover:shadow-glow-intense transition-all duration-300">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold gradient-text">CollabCode</h1>
              <Badge variant="outline" className="border-bright-purple text-bright-purple text-xs bg-bright-purple/10">
                Beta
              </Badge>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated ? (
            // Dashboard Navigation - show on all authenticated pages
            <div className="hidden lg:flex items-center gap-6">
              {dashboardNavItems.map((item) => {
                const Icon = item.icon
                const isActive =
                  pathname === item.href || (item.href === "/projects" && pathname.startsWith("/project"))
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-bright-purple/20 text-bright-purple"
                        : "text-text-secondary hover:text-bright-cyan hover:bg-dark-slate/50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          ) : (
            // Public Navigation (Landing Page)
            <div className="hidden md:flex items-center gap-8">
              {publicNavItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-text-secondary hover:text-bright-cyan transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          )}

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              // Authenticated User Actions
              <div className="flex items-center gap-3">
                <GlobalSearch />
                <NotificationCenter />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border-2 border-bright-purple/20">
                        <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                        <AvatarFallback className="bg-button-gradient text-white">
                          {user?.avatar || user?.name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-dark-slate border-slate-gray/30" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium text-text-primary">{user?.name || "User"}</p>
                        <p className="text-xs text-text-muted">{user?.email || "user@example.com"}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-slate-gray/30" />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="text-text-secondary hover:text-bright-cyan">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="text-text-secondary hover:text-bright-cyan">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/help" className="text-text-secondary hover:text-bright-cyan">
                        <HelpCircle className="mr-2 h-4 w-4" />
                        Help & Support
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-slate-gray/30" />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-400 hover:text-red-300">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              // Public Actions (Landing Page)
              <div className="flex items-center gap-4">
                <Button variant="outline" className="border-bright-purple text-bright-purple hover:bg-bright-purple/10">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade
                </Button>
                <Button onClick={handleGetStarted} className="cyber-button text-white font-semibold">
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden text-text-secondary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-slate-gray/20">
            <div className="flex flex-col gap-4 mt-4">
              {isAuthenticated ? (
                // Mobile Dashboard Navigation
                <>
                  {dashboardNavItems.map((item) => {
                    const Icon = item.icon
                    const isActive =
                      pathname === item.href || (item.href === "/projects" && pathname.startsWith("/project"))
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                          isActive
                            ? "bg-bright-purple/20 text-bright-purple"
                            : "text-text-secondary hover:text-bright-cyan"
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    )
                  })}
                  <div className="border-t border-slate-gray/20 pt-4 mt-4">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-bright-cyan"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-bright-cyan"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <Link
                      href="/help"
                      className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-bright-cyan"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <HelpCircle className="w-4 h-4" />
                      Help & Support
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-3 py-2 text-red-400 hover:text-red-300 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </>
              ) : (
                // Mobile Public Navigation
                <>
                  {publicNavItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-text-secondary hover:text-bright-cyan transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <div className="flex flex-col gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="border-bright-purple text-bright-purple hover:bg-bright-purple/10"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade
                    </Button>
                    <Button onClick={handleGetStarted} className="cyber-button text-white font-semibold">
                      Get Started
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
