"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu"
import { Folder, FolderOpen, Plus, GitCommit, Download, GitBranch, History, Trash2 } from "lucide-react"

interface FileExplorerProps {
  activeFile: string
  setActiveFile: (file: string) => void
  onFileCreate: (name: string) => void
  onFileDelete: (name: string) => void
  isLeftSidebarCollapsed: boolean
  setIsLeftSidebarCollapsed: (collapsed: boolean) => void
}

interface FileNode {
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  extension?: string
}

export function FileExplorer({
  activeFile,
  setActiveFile,
  onFileCreate,
  onFileDelete,
  isLeftSidebarCollapsed,
  setIsLeftSidebarCollapsed,
}: FileExplorerProps) {
  const [files] = useState<FileNode[]>([
    {
      name: "src",
      type: "folder",
      children: [
        { name: "app.js", type: "file", extension: "js" },
        {
          name: "components",
          type: "folder",
          children: [
            { name: "TodoList.jsx", type: "file", extension: "jsx" },
            { name: "Button.jsx", type: "file", extension: "jsx" },
          ],
        },
        { name: "styles.css", type: "file", extension: "css" },
      ],
    },
    { name: "package.json", type: "file", extension: "json" },
    { name: "README.md", type: "file", extension: "md" },
  ])

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["src"]))
  const [newFileName, setNewFileName] = useState("")
  const [showNewFileInput, setShowNewFileInput] = useState(false)
  const [commitHistory] = useState([
    { id: "1", message: "Initial commit", time: "2 min ago", author: "John Doe" },
    { id: "2", message: "Add todo functionality", time: "5 min ago", author: "Jane Smith" },
    { id: "3", message: "Update styling", time: "10 min ago", author: "John Doe" },
  ])

  const toggleFolder = (folderName: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderName)) {
      newExpanded.delete(folderName)
    } else {
      newExpanded.add(folderName)
    }
    setExpandedFolders(newExpanded)
  }

  const getFileIcon = (extension?: string) => {
    switch (extension) {
      case "js":
      case "jsx":
        return "🟨"
      case "css":
        return "🎨"
      case "json":
        return "⚙️"
      case "md":
        return "📝"
      default:
        return "📄"
    }
  }

  const renderFileTree = (nodes: FileNode[], depth = 0) => {
    return nodes.map((node) => (
      <div key={node.name} style={{ marginLeft: `${depth * 16}px` }}>
        {node.type === "folder" ? (
          <div>
            <div
              className="flex items-center gap-2 py-1 px-2 hover:bg-gray-700 cursor-pointer rounded"
              onClick={() => toggleFolder(node.name)}
            >
              {expandedFolders.has(node.name) ? (
                <FolderOpen className="w-4 h-4 text-blue-400" />
              ) : (
                <Folder className="w-4 h-4 text-blue-400" />
              )}
              <span className="text-sm text-white">{node.name}</span>
            </div>
            {expandedFolders.has(node.name) && node.children && <div>{renderFileTree(node.children, depth + 1)}</div>}
          </div>
        ) : (
          <ContextMenu>
            <ContextMenuTrigger>
              <div
                className={`flex items-center gap-2 py-1 px-2 hover:bg-gray-700 cursor-pointer rounded ${
                  activeFile === node.name ? "bg-blue-500 border-l-2 border-blue-400" : ""
                }`}
                onClick={() => setActiveFile(node.name)}
              >
                <span className="text-sm">{getFileIcon(node.extension)}</span>
                <span className="text-sm text-white">{node.name}</span>
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent className="bg-gray-800 border-gray-600">
              <ContextMenuItem className="text-white hover:bg-red-500">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        )}
      </div>
    ))
  }

  const handleCreateFile = () => {
    if (newFileName.trim()) {
      onFileCreate(newFileName)
      setNewFileName("")
      setShowNewFileInput(false)
    }
  }

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-slate/40 via-slate-gray/20 to-dark-slate/40 backdrop-blur-2xl" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-bright-cyan/5 via-transparent to-bright-purple/5" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.02)_50%,transparent_75%)] animate-pulse" />

      {/* File Operations Header */}
      <div className="p-4 border-b border-gradient-to-r from-bright-cyan/20 via-bright-purple/20 to-bright-cyan/20 bg-black/10 backdrop-blur-xl relative z-10">
        <div className="flex gap-2 mb-4">
          <Button
            size="sm"
            onClick={() => setShowNewFileInput(true)}
            className="bg-gradient-to-r from-bright-cyan/20 to-electric-blue/20 hover:from-bright-cyan/30 hover:to-electric-blue/30 text-bright-cyan hover:text-white border border-bright-cyan/30 hover:border-bright-cyan/50 backdrop-blur-xl transition-all duration-300 shadow-lg shadow-cyan-glow/10 flex-1 rounded-xl font-medium"
          >
            <Plus className="w-4 h-4 mr-2" />
            New File
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-bright-purple/20 to-soft-purple/20 hover:from-bright-purple/30 hover:to-soft-purple/30 text-bright-purple hover:text-white border border-bright-purple/30 hover:border-bright-purple/50 backdrop-blur-xl transition-all duration-300 shadow-lg shadow-purple-glow/10 rounded-xl"
          >
            <GitCommit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            className="bg-gradient-to-r from-success/20 to-bright-cyan/20 hover:from-success/30 hover:to-bright-cyan/30 text-success hover:text-white border border-success/30 hover:border-success/50 backdrop-blur-xl transition-all duration-300 shadow-lg shadow-green-500/10 rounded-xl"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>

        {showNewFileInput && (
          <div className="flex gap-2 mb-4">
            <Input
              value={newFileName}
              onChange={(e) => setNewFileName(e.target.value)}
              placeholder="component.tsx"
              className="bg-dark-slate/60 border-bright-cyan/30 text-bright-cyan placeholder-bright-cyan/60 text-sm backdrop-blur-xl focus:border-bright-cyan/60 focus:ring-2 focus:ring-bright-cyan/20 rounded-xl"
              onKeyPress={(e) => e.key === "Enter" && handleCreateFile()}
            />
            <Button
              size="sm"
              onClick={handleCreateFile}
              className="bg-gradient-to-r from-success to-bright-cyan hover:from-green-600 hover:to-cyan-600 text-white shadow-lg shadow-green-500/25 rounded-xl"
            >
              ✓
            </Button>
          </div>
        )}

        <div className="flex items-center gap-3">
          <GitBranch className="w-4 h-4 text-bright-purple" />
          <select className="bg-dark-slate/60 border-bright-purple/30 text-bright-purple text-sm rounded-xl px-3 py-2 flex-1 backdrop-blur-xl focus:border-bright-purple/60 focus:ring-2 focus:ring-bright-purple/20">
            <option>main</option>
            <option>develop</option>
            <option>feature/new-ui</option>
          </select>
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1 p-3 relative z-10">
        <div className="space-y-1">{renderFileTree(files)}</div>
      </ScrollArea>

      {/* Commit History */}
      <div className="border-t border-gradient-to-r from-bright-cyan/20 to-bright-purple/20 p-4 bg-black/10 backdrop-blur-xl relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-bright-cyan" />
          <span className="text-sm text-bright-cyan font-medium">Recent History</span>
        </div>
        <ScrollArea className="max-h-32">
          <div className="space-y-2">
            {commitHistory.map((commit) => (
              <div
                key={commit.id}
                className="text-xs text-text-secondary p-3 hover:bg-gradient-to-r hover:from-bright-cyan/10 hover:to-bright-purple/10 rounded-xl transition-all duration-300 backdrop-blur-sm border border-transparent hover:border-bright-cyan/20"
              >
                <div className="font-medium truncate text-text-primary">{commit.message}</div>
                <div className="text-text-muted mt-1">
                  {commit.time} • {commit.author}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
