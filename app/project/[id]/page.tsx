"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { CollaborationProvider } from "@/contexts/CollaborationContext"
import { CollaborativeCodeEditor } from "@/components/workspace/CollaborativeCodeEditor"
import { CollaboratorsList } from "@/components/workspace/CollaboratorsList"
import { ConflictResolutionModal } from "@/components/workspace/ConflictResolutionModal"
import { FuturisticChatPane } from "@/components/workspace/FuturisticChatPane"
import { FuturisticMeetingPane } from "@/components/workspace/FuturisticMeetingPane"
import { AdvancedWhiteboard } from "@/components/workspace/AdvancedWhiteboard"
import { CodePreview } from "@/components/workspace/CodePreview"
import { PremiumTerminal } from "@/components/workspace/PremiumTerminal"
import { FileExplorer } from "@/components/FileExplorer"
import { WorkspaceSettings } from "@/components/workspace/WorkspaceSettings"
import { WorkspaceNotifications } from "@/components/workspace/WorkspaceNotifications"
import { ResizablePanel } from "@/components/workspace/ResizablePanel"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Eye, Palette, Save, Play, Github, Figma, Rocket, Search, ArrowLeft, Menu, X } from "lucide-react"

// Mock user data - in real app, get from auth context
const MOCK_USER = {
  id: "user-123",
  username: "john_doe",
  avatar: "/placeholder.svg?height=32&width=32",
}

export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }
  }, [router])

  const [activeFile, setActiveFile] = useState("app.js")
  const [isMeetingActive, setIsMeetingActive] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false)

  // Resizable panel states
  const [leftPanelWidth, setLeftPanelWidth] = useState(288) // 18rem = 288px
  const [rightPanelWidth, setRightPanelWidth] = useState(320) // 20rem = 320px
  const [terminalHeight, setTerminalHeight] = useState(320) // 20rem = 320px
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState(false)

  const [code, setCode] = useState(`// Welcome to CollabCode Project!
import React, { useState } from 'react';

function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: input, 
        completed: false 
      }]);
      setInput('');
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id 
        ? { ...todo, completed: !todo.completed }
        : todo
    ));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        Todo List
      </h1>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new todo..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map(todo => (
          <li 
            key={todo.id} 
            className="flex items-center gap-2 p-2 bg-gray-50 rounded-md"
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
              className="w-4 h-4 text-blue-600"
            />
            <span 
              className={\`flex-1 \${todo.completed ? "line-through text-gray-500" : "text-gray-800"}\`}
            >
              {todo.text}
            </span>
            <button
              onClick={() => deleteTodo(todo.id)}
              className="px-2 py-1 text-red-600 hover:bg-red-100 rounded"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {todos.length === 0 && (
        <p className="text-gray-500 text-center mt-4">
          No todos yet. Add one above!
        </p>
      )}
    </div>
  );
}

export default TodoApp;`)

  const [language, setLanguage] = useState("javascript")
  const [projectData, setProjectData] = useState({
    name: "Todo App Project",
    description: "A simple todo application built with React",
    framework: "React",
    lastSaved: new Date(),
  })

  const [conflictModal, setConflictModal] = useState<{
    isOpen: boolean
    data: any
  }>({
    isOpen: false,
    data: null,
  })

  const handleFileCreate = (fileName: string) => {
    console.log("Creating file:", fileName)
    // Implement file creation logic
  }

  const handleFileDelete = (fileName: string) => {
    console.log("Deleting file:", fileName)
    // Implement file deletion logic
  }

  const handleSave = () => {
    setProjectData((prev) => ({ ...prev, lastSaved: new Date() }))
    console.log("Project saved!")
  }

  const handleRun = () => {
    console.log("Running project...")
  }

  const handleConflictResolve = (resolutions: any, manualContent?: any) => {
    console.log("Resolving conflicts:", resolutions, manualContent)
    setConflictModal({ isOpen: false, data: null })
  }

  // Resize handlers
  const handleLeftPanelResize = useCallback((width: number) => {
    setLeftPanelWidth(Math.max(200, Math.min(600, width)))
  }, [])

  const handleRightPanelResize = useCallback((width: number) => {
    setRightPanelWidth(Math.max(280, Math.min(600, width)))
  }, [])

  const handleTerminalResize = useCallback((height: number) => {
    setTerminalHeight(Math.max(100, Math.min(800, height)))
  }, [])

  return (
    <CollaborationProvider projectId={projectId} userId={MOCK_USER.id} username={MOCK_USER.username}>
      <div className="h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#16213E] text-white flex flex-col overflow-hidden">
        {/* Subtle Animated Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/5 via-purple-500/3 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.05)_50%,transparent_75%,transparent_100%)] bg-[length:60px_60px] animate-pulse opacity-30" />

        {/* Clean Navigation Bar */}
        <div className="relative h-16 bg-gradient-to-r from-deep-navy/95 via-dark-slate/95 to-deep-navy/95 backdrop-blur-xl border-b border-gradient-to-r from-bright-purple/20 via-bright-cyan/20 to-bright-purple/20 px-6 flex items-center justify-between z-50 shadow-lg">
          {/* Premium Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-bright-purple/5 via-bright-cyan/5 to-bright-purple/5" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(124,58,237,0.02)_50%,transparent_75%)]" />

          {/* Left Section */}
          <div className="flex items-center gap-6 z-10">
            <Button
              onClick={() => router.push("/dashboard")}
              variant="ghost"
              size="sm"
              className="text-bright-cyan hover:text-white hover:bg-bright-cyan/10 transition-all duration-300 rounded-xl px-4 py-2 font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>

            <div className="w-px h-8 bg-gradient-to-b from-transparent via-bright-cyan/40 to-transparent hidden md:block" />

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-r from-bright-cyan via-electric-blue to-bright-purple rounded-xl flex items-center justify-center shadow-lg shadow-purple-glow">
                <Code className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <input
                  type="text"
                  value={projectData.name}
                  onChange={(e) => setProjectData((prev) => ({ ...prev, name: e.target.value }))}
                  className="bg-transparent text-white font-bold text-lg border-none outline-none max-w-[250px] truncate placeholder-text-muted"
                />
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <span className="text-bright-cyan font-medium">{projectData.framework}</span>
                  <span>•</span>
                  <span>Saved {Math.floor((Date.now() - projectData.lastSaved.getTime()) / 1000)}s ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              size="sm"
              variant="ghost"
              className="text-text-primary hover:bg-white/5 transition-all duration-200 px-4 py-2 rounded-xl font-medium"
            >
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-text-primary hover:bg-white/5 transition-all duration-200 px-4 py-2 rounded-xl font-medium"
            >
              <Figma className="w-4 h-4 mr-2" />
              Figma
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-text-primary hover:bg-white/5 transition-all duration-200 px-4 py-2 rounded-xl font-medium"
            >
              <Rocket className="w-4 h-4 mr-2" />
              Deploy
            </Button>

            <div className="w-px h-6 bg-slate-gray/40 mx-4" />

            <Button
              size="sm"
              onClick={handleSave}
              className="bg-gradient-to-r from-electric-blue to-bright-purple hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-purple-glow/25 transition-all duration-300 px-6 py-2 rounded-xl font-medium"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              size="sm"
              onClick={handleRun}
              className="bg-gradient-to-r from-success to-bright-cyan hover:from-green-600 hover:to-cyan-600 text-white shadow-lg shadow-cyan-glow/25 transition-all duration-300 px-6 py-2 rounded-xl font-medium"
            >
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 z-10">
            {/* Search - Hidden on small screens */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-bright-cyan/70" />
              <input
                type="text"
                placeholder="Search..."
                className="bg-dark-slate/60 backdrop-blur-sm text-white text-sm rounded-xl pl-10 pr-4 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-bright-cyan/40 border border-bright-cyan/20 focus:border-bright-cyan/40 transition-all duration-200"
              />
            </div>

            <WorkspaceNotifications
              isOpen={showNotifications}
              onToggle={() => setShowNotifications(!showNotifications)}
            />

            <WorkspaceSettings isOpen={showSettings} onToggle={() => setShowSettings(!showSettings)} />

            <div className="w-10 h-10 bg-gradient-to-r from-bright-cyan to-bright-purple rounded-xl flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-glow/25">
              {MOCK_USER.username.charAt(0).toUpperCase()}
            </div>

            {/* Mobile Menu Button */}
            <Button
              size="sm"
              variant="ghost"
              className="lg:hidden text-white hover:bg-white/5"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-black/80 backdrop-blur-xl border-b border-cyan-500/10 p-4 z-40">
            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
                <Button
                  size="sm"
                  onClick={handleRun}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Run
                </Button>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="flex-1 text-white hover:bg-white/5">
                  <Github className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
                <Button size="sm" variant="ghost" className="flex-1 text-white hover:bg-white/5">
                  <Figma className="w-4 h-4 mr-2" />
                  Figma
                </Button>
                <Button size="sm" variant="ghost" className="flex-1 text-white hover:bg-white/5">
                  <Rocket className="w-4 h-4 mr-2" />
                  Deploy
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace - Resizable Layout */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Premium Background Effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-deep-navy via-dark-slate to-deep-navy" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-bright-purple/5 via-transparent to-bright-cyan/5" />
          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(124,58,237,0.02)_50%,transparent_75%)] animate-pulse" />

          {/* Left Panel - File Explorer */}
          <ResizablePanel
            direction="horizontal"
            initialSize={leftPanelWidth}
            minSize={200}
            maxSize={600}
            onResize={handleLeftPanelResize}
            isCollapsed={isLeftSidebarCollapsed}
            onToggleCollapse={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
            className="bg-gradient-to-br from-dark-slate/80 via-slate-gray/40 to-dark-slate/80 backdrop-blur-2xl border-r border-gradient-to-b from-bright-purple/20 via-bright-cyan/20 to-bright-purple/20 shadow-2xl"
          >
            <div className="h-full flex flex-col">
              <div className="flex-1 overflow-hidden">
                <FileExplorer
                  activeFile={activeFile}
                  setActiveFile={setActiveFile}
                  onFileCreate={handleFileCreate}
                  onFileDelete={handleFileDelete}
                />
              </div>
              <div className="border-t border-gradient-to-r from-bright-purple/30 via-bright-cyan/30 to-bright-purple/30 p-4 bg-black/20 backdrop-blur-xl">
                <CollaboratorsList />
              </div>
            </div>
          </ResizablePanel>

          {/* Center Panel - Code Editor */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-dark-slate/30 via-slate-gray/20 to-dark-slate/30 backdrop-blur-xl" />

            <Tabs defaultValue="code" className="flex-1 flex flex-col relative z-10 h-full">
              <div className="bg-gradient-to-r from-dark-slate/60 via-slate-gray/40 to-dark-slate/60 backdrop-blur-2xl border-b border-gradient-to-r from-bright-purple/30 via-bright-cyan/30 to-bright-purple/30 px-6 shadow-lg flex-shrink-0">
                <TabsList className="bg-transparent border-none h-14 gap-2">
                  <TabsTrigger
                    value="code"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-bright-purple/20 data-[state=active]:via-electric-blue/20 data-[state=active]:to-bright-cyan/20 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-bright-cyan/30 transition-all duration-300 hover:bg-white/5 rounded-xl px-6 py-3 text-text-secondary hover:text-white backdrop-blur-sm font-medium"
                  >
                    <Code className="w-5 h-5 mr-3" />
                    <span className="text-base">Code</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="whiteboard"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-success/20 data-[state=active]:via-bright-cyan/20 data-[state=active]:to-success/20 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-success/30 transition-all duration-300 hover:bg-white/5 rounded-xl px-6 py-3 text-text-secondary hover:text-white backdrop-blur-sm font-medium"
                  >
                    <Palette className="w-5 h-5 mr-3" />
                    <span className="text-base">Whiteboard</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-soft-purple/20 data-[state=active]:via-bright-purple/20 data-[state=active]:to-bright-cyan/20 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-soft-purple/30 transition-all duration-300 hover:bg-white/5 rounded-xl px-6 py-3 text-text-secondary hover:text-white backdrop-blur-sm font-medium"
                  >
                    <Eye className="w-5 h-5 mr-3" />
                    <span className="text-base">Preview</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content with Resizable Terminal */}
              <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                <TabsContent
                  value="code"
                  className="flex-1 m-0 p-0 data-[state=active]:flex data-[state=active]:flex-col data-[state=active]:flex-1 min-h-0"
                >
                  <div className="flex-1 min-h-0 overflow-hidden">
                    <CollaborativeCodeEditor
                      code={code}
                      setCode={setCode}
                      language={language}
                      activeFile={activeFile}
                      className="h-full"
                    />
                  </div>

                  {/* Resizable Terminal */}
                  <ResizablePanel
                    direction="vertical"
                    initialSize={terminalHeight}
                    minSize={100}
                    maxSize={800}
                    onResize={handleTerminalResize}
                    isCollapsed={isTerminalCollapsed}
                    onToggleCollapse={() => setIsTerminalCollapsed(!isTerminalCollapsed)}
                    className="border-t border-gradient-to-r from-bright-purple/30 via-bright-cyan/30 to-bright-purple/30"
                    position="bottom"
                  >
                    <PremiumTerminal />
                  </ResizablePanel>
                </TabsContent>

                <TabsContent
                  value="whiteboard"
                  className="flex-1 m-0 p-0 data-[state=active]:block data-[state=active]:flex-1 min-h-0"
                >
                  <AdvancedWhiteboard projectId={projectId} userId={MOCK_USER.id} />
                </TabsContent>

                <TabsContent
                  value="preview"
                  className="flex-1 m-0 p-0 data-[state=active]:block data-[state=active]:flex-1 min-h-0"
                >
                  <CodePreview code={code} language={language} />
                </TabsContent>
              </div>
            </Tabs>
          </div>

          {/* Right Panel - Chat & Meeting */}
          <ResizablePanel
            direction="horizontal"
            initialSize={rightPanelWidth}
            minSize={280}
            maxSize={600}
            onResize={handleRightPanelResize}
            className="bg-gradient-to-br from-dark-slate/80 via-slate-gray/40 to-dark-slate/80 backdrop-blur-2xl border-l border-gradient-to-b from-bright-purple/20 via-bright-cyan/20 to-bright-purple/20 shadow-2xl"
            position="right"
          >
            <div className="h-full flex flex-col">
              {!isMeetingActive ? (
                <FuturisticChatPane
                  isMeetingActive={isMeetingActive}
                  onStartMeeting={() => setIsMeetingActive(true)}
                  onEndMeeting={() => setIsMeetingActive(false)}
                />
              ) : (
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 overflow-hidden">
                    <FuturisticChatPane
                      isMeetingActive={isMeetingActive}
                      onStartMeeting={() => setIsMeetingActive(true)}
                      onEndMeeting={() => setIsMeetingActive(false)}
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <FuturisticMeetingPane isActive={isMeetingActive} onEnd={() => setIsMeetingActive(false)} />
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>
        </div>

        {/* Conflict Resolution Modal */}
        <ConflictResolutionModal
          isOpen={conflictModal.isOpen}
          onClose={() => setConflictModal({ isOpen: false, data: null })}
          conflictData={conflictModal.data}
          onResolve={handleConflictResolve}
        />
      </div>
    </CollaborationProvider>
  )
}
