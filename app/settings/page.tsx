"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Settings, User, Palette, Wifi, Bell, Shield, CreditCard, Eye, EyeOff } from "lucide-react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account")
  const [showPassword, setShowPassword] = useState(false)
  const [offlineMode, setOfflineMode] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    marketing: false,
  })
  const [theme, setTheme] = useState({
    primaryColor: "#00C4B4",
    secondaryColor: "#E8B923",
    font: "Inter",
    editorTheme: "vs-dark",
  })

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "billing", label: "Billing", icon: CreditCard },
    { id: "offline", label: "Offline Mode", icon: Wifi },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Full Name</label>
              <Input defaultValue="Alex Johnson" className="premium-input text-text-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
              <Input defaultValue="alex@example.com" type="email" className="premium-input text-text-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Username</label>
              <Input defaultValue="alexdev" className="premium-input text-text-primary" />
            </div>
            <div>
              <Button className="cyber-button text-white">Update Password</Button>
            </div>
          </div>
        )

      case "appearance":
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Primary Color</label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-12 h-12 rounded-lg border-2 border-slate-gray/30 cursor-pointer"
                />
                <Input
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="flex-1 premium-input text-text-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Secondary Color</label>
              <div className="flex items-center space-x-4">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="w-12 h-12 rounded-lg border-2 border-slate-gray/30 cursor-pointer"
                />
                <Input
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="flex-1 premium-input text-text-primary"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Font Family</label>
              <select
                value={theme.font}
                onChange={(e) => setTheme({ ...theme, font: e.target.value })}
                className="w-full premium-input text-text-primary"
              >
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Poppins">Poppins</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Editor Theme</label>
              <select
                value={theme.editorTheme}
                onChange={(e) => setTheme({ ...theme, editorTheme: e.target.value })}
                className="w-full premium-input text-text-primary"
              >
                <option value="vs-dark">Dark</option>
                <option value="vs-light">Light</option>
                <option value="hc-black">High Contrast</option>
              </select>
            </div>
            <div className="flex space-x-4">
              <Button className="cyber-button text-white">Save Theme</Button>
              <Button
                variant="outline"
                className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
              >
                Reset to Default
              </Button>
            </div>
          </div>
        )

      case "notifications":
        return (
          <div className="space-y-6">
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <h3 className="text-text-primary font-medium capitalize">
                    {key === "marketing" ? "Marketing Emails" : `${key} Notifications`}
                  </h3>
                  <p className="text-text-secondary text-sm">
                    {key === "email" && "Receive notifications via email"}
                    {key === "push" && "Receive push notifications in browser"}
                    {key === "marketing" && "Receive product updates and offers"}
                  </p>
                </div>
                <button
                  onClick={() => setNotifications({ ...notifications, [key]: !value })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    value ? "bg-bright-cyan" : "bg-slate-gray"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      value ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Change Password</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Current Password</label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      className="premium-input text-text-primary pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-text-primary"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">New Password</label>
                  <Input type="password" placeholder="Enter new password" className="premium-input text-text-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">Confirm New Password</label>
                  <Input
                    type="password"
                    placeholder="Confirm new password"
                    className="premium-input text-text-primary"
                  />
                </div>
                <Button className="cyber-button text-white">Update Password</Button>
              </div>
            </div>
            <div className="border-t border-slate-gray/20 pt-6">
              <h3 className="text-lg font-semibold text-text-primary mb-4">Two-Factor Authentication</h3>
              <p className="text-text-secondary mb-4">Add an extra layer of security to your account</p>
              <Button
                variant="outline"
                className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
              >
                Enable 2FA
              </Button>
            </div>
          </div>
        )

      case "billing":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-4">Current Plan</h3>
              <Card className="glass-card border-bright-purple/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xl font-bold text-text-primary">Professional</h4>
                      <p className="text-text-secondary">$29/month</p>
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <p className="text-text-muted mt-2">Next billing date: January 15, 2024</p>
                </CardContent>
              </Card>
            </div>
            <div className="flex space-x-4">
              <Button className="cyber-button text-white">Upgrade Plan</Button>
              <Button
                variant="outline"
                className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
              >
                Manage Billing
              </Button>
            </div>
          </div>
        )

      case "offline":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-text-primary">Offline Mode</h3>
                <p className="text-text-secondary">Enable offline editing and sync when you're back online</p>
              </div>
              <button
                onClick={() => setOfflineMode(!offlineMode)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  offlineMode ? "bg-bright-cyan" : "bg-slate-gray"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    offlineMode ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {offlineMode && (
              <Card className="glass-card border-yellow-500/30 bg-yellow-500/10">
                <CardContent className="p-4">
                  <p className="text-yellow-400 text-sm">
                    ⚠️ Offline mode is enabled. Your changes will sync when you're back online.
                  </p>
                </CardContent>
              </Card>
            )}
            <div>
              <h4 className="text-text-primary font-medium mb-2">Storage Usage</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Cached Projects</span>
                  <span className="text-text-primary">2.4 GB</span>
                </div>
                <div className="w-full bg-slate-gray/50 rounded-full h-2">
                  <div className="bg-bright-cyan h-2 rounded-full w-1/3" />
                </div>
                <p className="text-xs text-text-muted">2.4 GB of 10 GB used</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="border-slate-gray/30 text-text-secondary hover:text-bright-cyan hover:border-bright-cyan"
            >
              Clear Cache
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-deep-navy">
      <div className="cyber-grid min-h-screen">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8 animate-slide-in-up">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-button-gradient rounded-xl flex items-center justify-center shadow-purple-glow">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold gradient-text">Settings</h1>
                <p className="text-text-secondary mt-1">Manage your account preferences and application settings</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="glass-card animate-slide-in-up">
                <CardContent className="p-4">
                  <nav className="space-y-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                            activeTab === tab.id
                              ? "bg-bright-cyan/20 text-bright-cyan border border-bright-cyan/30"
                              : "text-text-secondary hover:text-text-primary hover:bg-dark-slate/50"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{tab.label}</span>
                        </button>
                      )
                    })}
                  </nav>
                </CardContent>
              </Card>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <Card className="glass-card animate-slide-in-up" style={{ animationDelay: "0.1s" }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {(() => {
                      const activeTabData = tabs.find((tab) => tab.id === activeTab)
                      const Icon = activeTabData?.icon || Settings
                      return <Icon className="w-5 h-5 text-bright-cyan" />
                    })()}
                    <span>{tabs.find((tab) => tab.id === activeTab)?.label}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>{renderTabContent()}</CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
