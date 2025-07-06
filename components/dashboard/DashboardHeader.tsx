"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  Bell,
  Settings,
  User,
  LogOut,
  Sparkles,
  Plus,
  Home,
  MessageSquare,
  Users,
  Compass,
  HelpCircle,
} from "lucide-react"
import Link from "next/link"

export function DashboardHeader() {
  const [notifications] = useState(3)

  return (
    <header className="sticky top-0 z-50 bg-[#1A1A1A]/95 backdrop-blur-sm border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Navigation */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-[#00D1FF] to-[#C084FC] rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white">CollabCode</h1>
                <Badge variant="outline" className="border-[#00D1FF] text-[#00D1FF] text-xs">
                  Beta
                </Badge>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-[#00D1FF] hover:text-white transition-colors"
              >
                <Home className="w-4 h-4" />
                Dashboard
              </Link>
              <Link href="/chat" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4" />
                Chat
              </Link>
              <Link href="/teams" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Users className="w-4 h-4" />
                Teams
              </Link>
              <Link
                href="/explore"
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <Compass className="w-4 h-4" />
                Explore
              </Link>
            </nav>
          </div>

          {/* Search & Actions */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search projects, templates..."
                className="pl-10 w-64 bg-gray-800 border-gray-600 text-white placeholder:text-gray-400"
              />
            </div>

            <Button size="sm" className="bg-[#00D1FF] hover:bg-[#00B8E6] text-black font-semibold">
              <Plus className="w-4 h-4 mr-1" />
              New Project
            </Button>

            <Button variant="ghost" size="sm" className="relative text-gray-400 hover:text-white">
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-red-500 text-white text-xs min-w-5 h-5 flex items-center justify-center">
                  {notifications}
                </Badge>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8 border-2 border-[#00D1FF]">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback className="bg-[#00D1FF] text-black">JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-gray-800 border-gray-600" align="end">
                <DropdownMenuItem className="text-white hover:bg-gray-700">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Help
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white hover:bg-gray-700">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
