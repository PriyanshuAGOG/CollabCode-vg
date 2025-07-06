"use client"
import { useCollaboration } from "@/contexts/CollaborationContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Circle, Clock } from "lucide-react"

export function CollaboratorsList() {
  const { collaborators, isConnected } = useCollaboration()

  const formatLastSeen = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return "Yesterday"
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <Users className="w-4 h-4" />
          Collaborators
          <Badge variant="secondary" className="ml-auto">
            {collaborators.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {!isConnected && (
          <div className="text-center py-4 text-gray-400">
            <Circle className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Connecting...</p>
          </div>
        )}

        {isConnected && collaborators.length === 0 && (
          <div className="text-center py-4 text-gray-400">
            <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No other collaborators online</p>
          </div>
        )}

        {collaborators.map((collaborator) => (
          <div
            key={collaborator.userId}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="relative">
              <Avatar className="w-8 h-8">
                <AvatarImage src={collaborator.avatar || "/placeholder.svg"} />
                <AvatarFallback
                  className="text-white text-sm font-medium"
                  style={{ backgroundColor: collaborator.color }}
                >
                  {collaborator.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-gray-800 ${
                  collaborator.isActive ? "bg-green-500" : "bg-gray-500"
                }`}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white truncate">{collaborator.username}</p>
                {collaborator.isActive && (
                  <Badge variant="outline" className="text-xs border-green-500 text-green-500">
                    Active
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                {formatLastSeen(collaborator.lastSeen)}
                {collaborator.currentFile && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="truncate">{collaborator.currentFile}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
