"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Code, 
  MessageSquare, 
  Video, 
  Settings, 
  Users, 
  FileText, 
  Terminal,
  Play,
  Save,
  Share,
  Eye,
  Download,
  Upload,
  GitBranch,
  Zap
} from "lucide-react"
import { CollaborativeCodeEditor } from "@/components/workspace/CollaborativeCodeEditor"
import { ModernChatInterface } from "@/components/chat/ModernChatInterface"
import { FuturisticMeetingPane } from "@/components/workspace/FuturisticMeetingPane"
import { AIAssistant } from "@/components/AIAssistant"
import { FileExplorer } from "@/components/FileExplorer"
import { PremiumTerminal } from "@/components/workspace/PremiumTerminal"
import { getProject, getProjectFiles, getCurrentUser } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

export default function ProjectWorkspace() {
  const params = useParams()
  const projectId = params.id as string
  const { toast } = useToast()

  const [project, setProject] = useState<any>(null)
  const [files, setFiles] = useState<any[]>([])
  const [activeFile, setActiveFile] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeCollaborators, setActiveCollaborators] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeView, setActiveView] = useState("code")

  useEffect(() => {
    initializeWorkspace()
  }, [projectId])

  const initializeWorkspace = async () => {
    try {
      setIsLoading(true)

      // Get current user
      const user = await getCurrentUser()
      setCurrentUser(user)

      // Get project details
      const { data: projectData, error: projectError } = await getProject(projectId)
      if (projectError) throw projectError
      setProject(projectData)

      // Get project files
      const { data: filesData, error: filesError } = await getProjectFiles(projectId)
      if (filesError) throw filesError
      setFiles(filesData || [])

      // Set default file if available
      if (filesData && filesData.length > 0) {
        setActiveFile(filesData[0])
      }

      // Mock active collaborators (you would get this from real-time subscriptions)
      setActiveCollaborators([
        { id: "1", name: "Alice Johnson", avatar: "/placeholder-user.jpg", status: "online" },
        { id: "2", name: "Bob Smith", avatar: "/placeholder-user.jpg", status: "coding" },
        { id: "3", name: "Carol Davis", avatar: "/placeholder-user.jpg", status: "away" }
      ])

    } catch (error) {
      console.error("Failed to initialize workspace:", error)
      toast({
        title: "Error",
        description: "Failed to load workspace. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (file: any) => {
    setActiveFile(file)
  }

  const handleFileSave = async (fileId: string, content: string) => {
    // Implementation for saving file
    toast({
      title: "File Saved",
      description: "Your changes have been saved successfully."
    })
  }

  const handleRunCode = () => {
    toast({
      title: "Running Code",
      description: "Your code is being executed..."
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading workspace...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <div className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-white">{project?.name || "Untitled Project"}</h1>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400">
              {project?.framework || "JavaScript"}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            {/* Active Collaborators */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-400">Active:</span>
              <div className="flex -space-x-2">
                {activeCollaborators.map((collaborator) => (
                  <Avatar key={collaborator.id} className="w-8 h-8 border-2 border-gray-800">
                    <AvatarImage src={collaborator.avatar} />
                    <AvatarFallback>{collaborator.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
              </div>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Action Buttons */}
            <Button onClick={handleRunCode} className="bg-green-600 hover:bg-green-700">
              <Play className="w-4 h-4 mr-2" />
              Run
            </Button>
            <Button variant="outline" className="border-gray-600">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button variant="outline" className="border-gray-600">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Sidebar - File Explorer */}
        <div className="w-64 border-r border-gray-800 bg-black/30 backdrop-blur-sm">
          <FileExplorer 
            files={files} 
            onFileSelect={handleFileSelect}
            activeFile={activeFile}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          <Tabs value={activeView} onValueChange={setActiveView} className="h-full">
            {/* Tab Navigation */}
            <div className="border-b border-gray-800 bg-black/30 backdrop-blur-sm">
              <TabsList className="grid w-full grid-cols-5 bg-transparent">
                <TabsTrigger value="code" className="flex items-center space-x-2">
                  <Code className="w-4 h-4" />
                  <span>Code</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center space-x-2">
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </TabsTrigger>
                <TabsTrigger value="terminal" className="flex items-center space-x-2">
                  <Terminal className="w-4 h-4" />
                  <span>Terminal</span>
                </TabsTrigger>
                <TabsTrigger value="chat" className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat</span>
                </TabsTrigger>
                <TabsTrigger value="meeting" className="flex items-center space-x-2">
                  <Video className="w-4 h-4" />
                  <span>Meet</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-hidden">
              <TabsContent value="code" className="h-full">
                <div className="flex h-full">
                  <div className="flex-1">
                    <CollaborativeCodeEditor
                      file={activeFile}
                      onSave={handleFileSave}
                      collaborators={activeCollaborators}
                    />
                  </div>
                  <div className="w-80 border-l border-gray-800">
                    <AIAssistant />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="h-full">
                <div className="h-full bg-white rounded-lg m-4">
                  <iframe
                    src="/api/preview"
                    className="w-full h-full rounded-lg"
                    title="Preview"
                  />
                </div>
              </TabsContent>

              <TabsContent value="terminal" className="h-full">
                <PremiumTerminal />
              </TabsContent>

              <TabsContent value="chat" className="h-full">
                <ModernChatInterface roomId={projectId} />
              </TabsContent>

              <TabsContent value="meeting" className="h-full">
                <FuturisticMeetingPane roomId={projectId} />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-t border-gray-800 bg-black/50 backdrop-blur-sm p-2">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Line 1, Column 1</span>
            <span>UTF-8</span>
            <span>{activeFile?.language || "JavaScript"}</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Zap className="w-3 h-3" />
              <span>AI Assistant Ready</span>
            </span>
            <span className="text-green-400">● Connected</span>
          </div>
        </div>
      </div>
    </div>
  )
}