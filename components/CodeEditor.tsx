"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Save, Play, Lightbulb, MessageSquare, Users, Sparkles } from "lucide-react"

interface CodeEditorProps {
  code: string
  setCode: (code: string) => void
  language: string
  activeFile: string
  collaborators: number
}

interface Collaborator {
  id: string
  name: string
  color: string
  cursor: { line: number; column: number }
}

export function CodeEditor({ code, setCode, language, activeFile, collaborators }: CodeEditorProps) {
  const editorRef = useRef<HTMLTextAreaElement>(null)
  const [showAISuggestion, setShowAISuggestion] = useState(false)
  const [aiSuggestion] = useState({
    text: "const handleToggleTodo = (id) => {\n  setTodos(todos.map(todo => \n    todo.id === id ? { ...todo, completed: !todo.completed } : todo\n  ));\n};",
    description: "Add toggle functionality for todos",
  })
  const [collaboratorList] = useState<Collaborator[]>([
    { id: "1", name: "Jane Smith", color: "#00D1FF", cursor: { line: 5, column: 12 } },
    { id: "2", name: "Mike Johnson", color: "#C084FC", cursor: { line: 15, column: 8 } },
    { id: "3", name: "Sarah Wilson", color: "#10B981", cursor: { line: 25, column: 20 } },
  ])
  const [annotations] = useState([
    { line: 8, message: "Consider adding error handling here", type: "warning" },
    { line: 15, message: "This could be optimized with useCallback", type: "suggestion" },
  ])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "s":
          e.preventDefault()
          handleSave()
          break
        case " ":
          e.preventDefault()
          setShowAISuggestion(true)
          break
      }
    }
  }

  const handleSave = () => {
    console.log("Saving file:", activeFile)
    // Implement save functionality
  }

  const acceptAISuggestion = () => {
    const textarea = editorRef.current
    if (textarea) {
      const cursorPos = textarea.selectionStart
      const newCode = code.slice(0, cursorPos) + "\n\n" + aiSuggestion.text + "\n" + code.slice(cursorPos)
      setCode(newCode)
      setShowAISuggestion(false)
    }
  }

  const getLanguageColor = (lang: string) => {
    switch (lang) {
      case "javascript":
        return "bg-yellow-500"
      case "python":
        return "bg-blue-500"
      case "html":
        return "bg-orange-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="h-full bg-black flex flex-col relative">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getLanguageColor(language)}`} />
            <span className="text-white font-medium">{activeFile}</span>
            <Badge variant="outline" className="border-gray-600 text-gray-400 text-xs">
              {language}
            </Badge>
          </div>

          <div className="flex items-center gap-1">
            {collaboratorList.map((collab) => (
              <div
                key={collab.id}
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
                style={{ backgroundColor: collab.color }}
                title={collab.name}
              >
                {collab.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            ))}
            <Badge variant="outline" className="border-gray-600 text-gray-400 ml-2">
              <Users className="w-3 h-3 mr-1" />
              {collaborators}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => setShowAISuggestion(true)}
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Sparkles className="w-4 h-4 mr-1" />
            AI
          </Button>
          <Button size="sm" onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-green-500">
            <Play className="w-4 h-4 mr-1" />
            Run
          </Button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 relative">
        <div className="absolute inset-0 flex">
          {/* Line Numbers */}
          <div className="w-12 bg-gray-900 border-r border-gray-700 p-2 text-right">
            {code.split("\n").map((_, index) => (
              <div key={index} className="text-gray-500 text-sm leading-6 font-mono">
                {index + 1}
              </div>
            ))}
          </div>

          {/* Code Area */}
          <div className="flex-1 relative">
            <textarea
              ref={editorRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full h-full bg-black text-white font-mono text-sm p-4 resize-none outline-none leading-6"
              style={{ fontFamily: '"SF Mono", "Monaco", "Inconsolata", "Roboto Mono", "Source Code Pro", monospace' }}
              spellCheck={false}
            />

            {/* Collaborator Cursors */}
            {collaboratorList.map((collab) => (
              <div
                key={collab.id}
                className="absolute w-0.5 h-6 pointer-events-none"
                style={{
                  backgroundColor: collab.color,
                  top: `${collab.cursor.line * 24 + 16}px`,
                  left: `${collab.cursor.column * 8 + 16}px`,
                }}
              >
                <div
                  className="absolute -top-6 left-0 px-1 py-0.5 text-xs text-white rounded text-nowrap"
                  style={{ backgroundColor: collab.color }}
                >
                  {collab.name}
                </div>
              </div>
            ))}

            {/* Code Annotations */}
            {annotations.map((annotation, index) => (
              <div
                key={index}
                className="absolute left-0 w-full h-6 bg-yellow-400 bg-opacity-20 border-l-2 border-yellow-400 cursor-pointer"
                style={{ top: `${annotation.line * 24}px` }}
                title={annotation.message}
              >
                <MessageSquare className="w-4 h-4 text-yellow-400 ml-2 mt-1" />
              </div>
            ))}
          </div>
        </div>

        {/* AI Suggestion Popup */}
        {showAISuggestion && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-white text-black p-4 rounded-lg shadow-lg max-w-md z-10">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              <span className="font-medium">AI Suggestion</span>
            </div>
            <p className="text-sm text-gray-600 mb-3">{aiSuggestion.description}</p>
            <pre className="bg-gray-100 p-2 rounded text-xs mb-3 overflow-x-auto">{aiSuggestion.text}</pre>
            <div className="flex gap-2">
              <Button size="sm" onClick={acceptAISuggestion} className="bg-blue-500 hover:bg-blue-600 text-white">
                Accept
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowAISuggestion(false)}>
                Dismiss
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between p-2 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex items-center gap-4">
          <span>Line 1, Column 1</span>
          <span>UTF-8</span>
          <span>LF</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-green-400">● Saved</span>
          <span>Last sync: now</span>
        </div>
      </div>
    </div>
  )
}
