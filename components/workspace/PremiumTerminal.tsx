"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Terminal, Plus, X } from "lucide-react"

interface TerminalSession {
  id: string
  name: string
  history: Array<{
    id: string
    type: "command" | "output" | "error"
    content: string
    timestamp: Date
  }>
  currentDirectory: string
  isActive: boolean
}

export function PremiumTerminal() {
  const [terminals, setTerminals] = useState<TerminalSession[]>([
    {
      id: "1",
      name: "Terminal 1",
      history: [
        {
          id: "1",
          type: "output",
          content: "Welcome to CollabCode Terminal",
          timestamp: new Date(),
        },
        {
          id: "2",
          type: "command",
          content: "npm install",
          timestamp: new Date(),
        },
        {
          id: "3",
          type: "output",
          content: "✓ Dependencies installed successfully",
          timestamp: new Date(),
        },
      ],
      currentDirectory: "~/project",
      isActive: true,
    },
  ])

  const [activeTerminalId, setActiveTerminalId] = useState("1")
  const [currentCommand, setCurrentCommand] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeTerminal = terminals.find((t) => t.id === activeTerminalId)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activeTerminal?.history])

  const addTerminal = () => {
    const newId = (terminals.length + 1).toString()
    const newTerminal: TerminalSession = {
      id: newId,
      name: `Terminal ${newId}`,
      history: [
        {
          id: "1",
          type: "output",
          content: "Welcome to CollabCode Terminal",
          timestamp: new Date(),
        },
      ],
      currentDirectory: "~/project",
      isActive: true,
    }

    setTerminals((prev) => [...prev, newTerminal])
    setActiveTerminalId(newId)
  }

  const closeTerminal = (terminalId: string) => {
    if (terminals.length === 1) return // Keep at least one terminal

    setTerminals((prev) => prev.filter((t) => t.id !== terminalId))

    if (activeTerminalId === terminalId) {
      const remainingTerminals = terminals.filter((t) => t.id !== terminalId)
      setActiveTerminalId(remainingTerminals[0]?.id || "")
    }
  }

  const executeCommand = () => {
    if (!currentCommand.trim() || !activeTerminal) return

    const commandEntry = {
      id: Date.now().toString(),
      type: "command" as const,
      content: currentCommand,
      timestamp: new Date(),
    }

    const outputEntry = {
      id: (Date.now() + 1).toString(),
      type: "output" as const,
      content: simulateCommand(currentCommand),
      timestamp: new Date(),
    }

    setTerminals((prev) =>
      prev.map((terminal) =>
        terminal.id === activeTerminalId
          ? {
              ...terminal,
              history: [...terminal.history, commandEntry, outputEntry],
            }
          : terminal,
      ),
    )

    setCurrentCommand("")
  }

  const simulateCommand = (command: string): string => {
    const cmd = command.toLowerCase().trim()

    if (cmd.startsWith("npm")) {
      if (cmd.includes("install")) return "✓ Packages installed successfully"
      if (cmd.includes("start")) return "🚀 Development server started on http://localhost:3000"
      if (cmd.includes("build")) return "✓ Build completed successfully"
      return "npm command executed"
    }

    if (cmd === "ls" || cmd === "dir") {
      return `src/
components/
public/
package.json
README.md`
    }

    if (cmd.startsWith("cd")) {
      return `Changed directory to ${cmd.split(" ")[1] || "~"}`
    }

    if (cmd === "pwd") {
      return activeTerminal?.currentDirectory || "~/project"
    }

    if (cmd === "clear") {
      // Clear terminal history
      setTimeout(() => {
        setTerminals((prev) =>
          prev.map((terminal) => (terminal.id === activeTerminalId ? { ...terminal, history: [] } : terminal)),
        )
      }, 100)
      return ""
    }

    return `Command '${command}' executed`
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand()
    }
  }

  return (
    <div className="h-full bg-gradient-to-br from-black/95 via-dark-slate/90 to-black/95 backdrop-blur-xl flex flex-col">
      {/* Terminal Header */}
      <div className="h-12 bg-gradient-to-r from-dark-slate/80 via-slate-gray/60 to-dark-slate/80 backdrop-blur-xl border-b border-bright-cyan/20 flex items-center justify-between px-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-bright-cyan to-bright-purple rounded-lg flex items-center justify-center shadow-lg">
            <Terminal className="w-4 h-4 text-white" />
          </div>
          <div className="flex items-center gap-1">
            {terminals.map((terminal) => (
              <div
                key={terminal.id}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all duration-200 ${
                  terminal.id === activeTerminalId
                    ? "bg-gradient-to-r from-bright-cyan/20 to-bright-purple/20 text-white border border-bright-cyan/30"
                    : "text-text-secondary hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setActiveTerminalId(terminal.id)}
              >
                <span className="font-medium">{terminal.name}</span>
                {terminals.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      closeTerminal(terminal.id)
                    }}
                    className="ml-1 hover:text-red-400 transition-colors duration-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={addTerminal}
            className="text-bright-cyan hover:text-white hover:bg-bright-cyan/10 p-2 rounded-lg transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="font-mono text-sm space-y-2">
            {activeTerminal?.history.map((entry) => (
              <div key={entry.id} className="flex">
                {entry.type === "command" ? (
                  <div className="flex w-full">
                    <span className="text-bright-cyan mr-3 font-bold">$</span>
                    <span className="text-white">{entry.content}</span>
                  </div>
                ) : (
                  <div className={`ml-6 ${entry.type === "error" ? "text-red-400" : "text-text-secondary"}`}>
                    {entry.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Command Input */}
        <div className="border-t border-bright-cyan/20 p-4 bg-gradient-to-r from-dark-slate/40 via-slate-gray/20 to-dark-slate/40 backdrop-blur-xl">
          <div className="flex items-center gap-3 font-mono text-sm">
            <span className="text-bright-cyan font-bold">$</span>
            <input
              ref={inputRef}
              type="text"
              value={currentCommand}
              onChange={(e) => setCurrentCommand(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter command..."
              className="flex-1 bg-transparent text-white outline-none placeholder-text-muted"
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  )
}
