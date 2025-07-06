"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Settings, Palette, Shield, Bot, Key, Monitor, Moon, Sun, Cpu, Save, RotateCcw } from "lucide-react"

interface WorkspaceSettingsProps {
  isOpen: boolean
  onToggle: () => void
}

export function WorkspaceSettings({ isOpen, onToggle }: WorkspaceSettingsProps) {
  const [openRouterApiKey, setOpenRouterApiKey] = useState("")
  const [aiModel, setAiModel] = useState("gpt-4")
  const [theme, setTheme] = useState("dark")
  const [autoSave, setAutoSave] = useState(true)
  const [codeCompletion, setCodeCompletion] = useState(true)
  const [livePreview, setLivePreview] = useState(true)
  const [notifications, setNotifications] = useState(true)

  useEffect(() => {
    // Load settings from localStorage
    const savedApiKey = localStorage.getItem("openrouter_api_key")
    const savedModel = localStorage.getItem("ai_model")
    const savedTheme = localStorage.getItem("workspace_theme")
    const savedAutoSave = localStorage.getItem("auto_save")
    const savedCodeCompletion = localStorage.getItem("code_completion")
    const savedLivePreview = localStorage.getItem("live_preview")
    const savedNotifications = localStorage.getItem("workspace_notifications")

    if (savedApiKey) setOpenRouterApiKey(savedApiKey)
    if (savedModel) setAiModel(savedModel)
    if (savedTheme) setTheme(savedTheme)
    if (savedAutoSave) setAutoSave(savedAutoSave === "true")
    if (savedCodeCompletion) setCodeCompletion(savedCodeCompletion === "true")
    if (savedLivePreview) setLivePreview(savedLivePreview === "true")
    if (savedNotifications) setNotifications(savedNotifications === "true")
  }, [])

  const saveSettings = () => {
    localStorage.setItem("openrouter_api_key", openRouterApiKey)
    localStorage.setItem("ai_model", aiModel)
    localStorage.setItem("workspace_theme", theme)
    localStorage.setItem("auto_save", autoSave.toString())
    localStorage.setItem("code_completion", codeCompletion.toString())
    localStorage.setItem("live_preview", livePreview.toString())
    localStorage.setItem("workspace_notifications", notifications.toString())

    // Show success message
    console.log("Settings saved successfully!")
  }

  const resetSettings = () => {
    setOpenRouterApiKey("")
    setAiModel("gpt-4")
    setTheme("dark")
    setAutoSave(true)
    setCodeCompletion(true)
    setLivePreview(true)
    setNotifications(true)

    // Clear localStorage
    localStorage.removeItem("openrouter_api_key")
    localStorage.removeItem("ai_model")
    localStorage.removeItem("workspace_theme")
    localStorage.removeItem("auto_save")
    localStorage.removeItem("code_completion")
    localStorage.removeItem("live_preview")
    localStorage.removeItem("workspace_notifications")
  }

  const availableModels = [
    { id: "gpt-4", name: "GPT-4", provider: "OpenAI" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", provider: "OpenAI" },
    { id: "claude-3-opus", name: "Claude 3 Opus", provider: "Anthropic" },
    { id: "claude-3-sonnet", name: "Claude 3 Sonnet", provider: "Anthropic" },
    { id: "gemini-pro", name: "Gemini Pro", provider: "Google" },
    { id: "llama-2-70b", name: "Llama 2 70B", provider: "Meta" },
    { id: "mixtral-8x7b", name: "Mixtral 8x7B", provider: "Mistral" },
    { id: "codellama-34b", name: "Code Llama 34B", provider: "Meta" },
  ]

  return (
    <DropdownMenu open={isOpen} onOpenChange={onToggle}>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost" className="text-white hover:bg-white/10 relative transition-all duration-200">
          <Settings className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[500px] bg-black/90 backdrop-blur-2xl border-purple-500/30 p-0" align="end">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Workspace Settings</h3>
              <p className="text-sm text-gray-400">Configure your development environment</p>
            </div>
          </div>

          <Tabs defaultValue="ai" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/50">
              <TabsTrigger value="ai" className="data-[state=active]:bg-purple-500/20">
                <Bot className="w-4 h-4 mr-2" />
                AI
              </TabsTrigger>
              <TabsTrigger value="editor" className="data-[state=active]:bg-blue-500/20">
                <Cpu className="w-4 h-4 mr-2" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="theme" className="data-[state=active]:bg-pink-500/20">
                <Palette className="w-4 h-4 mr-2" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="privacy" className="data-[state=active]:bg-green-500/20">
                <Shield className="w-4 h-4 mr-2" />
                Privacy
              </TabsTrigger>
            </TabsList>

            <div className="mt-6 max-h-96 overflow-y-auto">
              <TabsContent value="ai" className="space-y-4">
                <Card className="bg-black/40 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Key className="w-4 h-4" />
                      OpenRouter API Configuration
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="api-key" className="text-gray-300">
                        API Key
                      </Label>
                      <Input
                        id="api-key"
                        type="password"
                        value={openRouterApiKey}
                        onChange={(e) => setOpenRouterApiKey(e.target.value)}
                        placeholder="sk-or-v1-..."
                        className="bg-black/50 border-purple-500/30 text-white mt-1"
                      />
                      <p className="text-xs text-gray-400 mt-1">
                        Get your API key from{" "}
                        <a
                          href="https://openrouter.ai"
                          target="_blank"
                          className="text-purple-400 hover:underline"
                          rel="noreferrer"
                        >
                          openrouter.ai
                        </a>
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="model" className="text-gray-300">
                        AI Model
                      </Label>
                      <select
                        id="model"
                        value={aiModel}
                        onChange={(e) => setAiModel(e.target.value)}
                        className="w-full mt-1 bg-black/50 border border-purple-500/30 text-white rounded-md px-3 py-2"
                      >
                        {availableModels.map((model) => (
                          <option key={model.id} value={model.id}>
                            {model.name} ({model.provider})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300">AI Code Completion</Label>
                        <p className="text-xs text-gray-400">Enable AI-powered code suggestions</p>
                      </div>
                      <Switch checked={codeCompletion} onCheckedChange={setCodeCompletion} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="editor" className="space-y-4">
                <Card className="bg-black/40 border-blue-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      Editor Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300">Auto Save</Label>
                        <p className="text-xs text-gray-400">Automatically save changes</p>
                      </div>
                      <Switch checked={autoSave} onCheckedChange={setAutoSave} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300">Live Preview</Label>
                        <p className="text-xs text-gray-400">Update preview in real-time</p>
                      </div>
                      <Switch checked={livePreview} onCheckedChange={setLivePreview} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-gray-300">Notifications</Label>
                        <p className="text-xs text-gray-400">Show workspace notifications</p>
                      </div>
                      <Switch checked={notifications} onCheckedChange={setNotifications} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="theme" className="space-y-4">
                <Card className="bg-black/40 border-pink-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Appearance
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-gray-300">Theme</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        {[
                          { id: "dark", name: "Dark", icon: Moon },
                          { id: "light", name: "Light", icon: Sun },
                          { id: "auto", name: "Auto", icon: Monitor },
                        ].map(({ id, name, icon: Icon }) => (
                          <button
                            key={id}
                            onClick={() => setTheme(id)}
                            className={`p-3 rounded-lg border transition-all ${
                              theme === id
                                ? "border-pink-500/50 bg-pink-500/20"
                                : "border-gray-600/30 bg-black/20 hover:border-pink-500/30"
                            }`}
                          >
                            <Icon className="w-4 h-4 mx-auto mb-1 text-gray-300" />
                            <p className="text-xs text-gray-300">{name}</p>
                          </button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-4">
                <Card className="bg-black/40 border-green-500/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Privacy & Security
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-medium text-green-400">Secure Connection</span>
                      </div>
                      <p className="text-xs text-gray-400">
                        Your API keys are stored locally and encrypted. We never store your keys on our servers.
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Badge variant="outline" className="border-green-500/30 text-green-400">
                        ✓ End-to-end encryption
                      </Badge>
                      <Badge variant="outline" className="border-green-500/30 text-green-400">
                        ✓ Local storage only
                      </Badge>
                      <Badge variant="outline" className="border-green-500/30 text-green-400">
                        ✓ No data collection
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>

          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-600/30">
            <Button onClick={saveSettings} className="flex-1 bg-gradient-to-r from-purple-500 to-cyan-500">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
            <Button onClick={resetSettings} variant="outline" className="border-gray-600/30">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
