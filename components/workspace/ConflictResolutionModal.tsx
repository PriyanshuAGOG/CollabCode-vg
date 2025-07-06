"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, User, Clock } from "lucide-react"

interface ConflictData {
  fileId: string
  fileName: string
  conflicts: Array<{
    id: string
    line: number
    localContent: string
    remoteContent: string
    remoteUser: string
    timestamp: number
  }>
}

interface ConflictResolutionModalProps {
  isOpen: boolean
  onClose: () => void
  conflictData: ConflictData | null
  onResolve: (
    resolutions: Record<string, "local" | "remote" | "manual">,
    manualContent?: Record<string, string>,
  ) => void
}

export function ConflictResolutionModal({ isOpen, onClose, conflictData, onResolve }: ConflictResolutionModalProps) {
  const [resolutions, setResolutions] = useState<Record<string, "local" | "remote" | "manual">>({})
  const [manualContent, setManualContent] = useState<Record<string, string>>({})

  if (!conflictData) return null

  const handleResolutionChange = (conflictId: string, resolution: "local" | "remote" | "manual") => {
    setResolutions((prev) => ({ ...prev, [conflictId]: resolution }))

    if (resolution === "manual") {
      const conflict = conflictData.conflicts.find((c) => c.id === conflictId)
      if (conflict && !manualContent[conflictId]) {
        setManualContent((prev) => ({
          ...prev,
          [conflictId]: conflict.localContent,
        }))
      }
    }
  }

  const handleManualContentChange = (conflictId: string, content: string) => {
    setManualContent((prev) => ({ ...prev, [conflictId]: content }))
  }

  const handleResolve = () => {
    onResolve(resolutions, manualContent)
    onClose()
  }

  const allConflictsResolved = conflictData.conflicts.every((conflict) => resolutions[conflict.id])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-gray-900 text-white border-gray-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            Merge Conflicts in {conflictData.fileName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-sm text-yellow-200">
              {conflictData.conflicts.length} conflict{conflictData.conflicts.length > 1 ? "s" : ""} found. Choose how
              to resolve each conflict below.
            </p>
          </div>

          {conflictData.conflicts.map((conflict, index) => (
            <div key={conflict.id} className="border border-gray-700 rounded-lg overflow-hidden">
              <div className="bg-gray-800 px-4 py-2 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">
                    Conflict #{index + 1} - Line {conflict.line}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <User className="w-4 h-4" />
                    {conflict.remoteUser}
                    <Clock className="w-4 h-4" />
                    {new Date(conflict.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* Resolution Options */}
                <div className="flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={resolutions[conflict.id] === "local" ? "default" : "outline"}
                    onClick={() => handleResolutionChange(conflict.id, "local")}
                    className="flex items-center gap-2"
                  >
                    <Badge variant="secondary">Your Version</Badge>
                  </Button>
                  <Button
                    size="sm"
                    variant={resolutions[conflict.id] === "remote" ? "default" : "outline"}
                    onClick={() => handleResolutionChange(conflict.id, "remote")}
                    className="flex items-center gap-2"
                  >
                    <Badge variant="secondary">{conflict.remoteUser}'s Version</Badge>
                  </Button>
                  <Button
                    size="sm"
                    variant={resolutions[conflict.id] === "manual" ? "default" : "outline"}
                    onClick={() => handleResolutionChange(conflict.id, "manual")}
                    className="flex items-center gap-2"
                  >
                    <Badge variant="secondary">Manual Edit</Badge>
                  </Button>
                </div>

                {/* Content Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-green-400">Your Version</h4>
                    <pre className="bg-green-500/10 border border-green-500/20 rounded p-3 text-sm font-mono overflow-x-auto">
                      {conflict.localContent}
                    </pre>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-blue-400">{conflict.remoteUser}'s Version</h4>
                    <pre className="bg-blue-500/10 border border-blue-500/20 rounded p-3 text-sm font-mono overflow-x-auto">
                      {conflict.remoteContent}
                    </pre>
                  </div>
                </div>

                {/* Manual Edit */}
                {resolutions[conflict.id] === "manual" && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-yellow-400">Manual Resolution</h4>
                    <textarea
                      value={manualContent[conflict.id] || ""}
                      onChange={(e) => handleManualContentChange(conflict.id, e.target.value)}
                      className="w-full h-24 bg-gray-800 border border-gray-600 rounded p-3 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your manual resolution..."
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleResolve} disabled={!allConflictsResolved} className="bg-blue-600 hover:bg-blue-700">
            Resolve All Conflicts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
