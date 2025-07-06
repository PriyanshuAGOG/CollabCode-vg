"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Pen,
  Eraser,
  Square,
  Circle,
  Type,
  PresentationIcon,
  Download,
  Upload,
  Trash2,
  ZoomIn,
  ZoomOut,
  Move,
  Palette,
  Users,
  FileText,
  Play,
  SkipBack,
  SkipForward,
  Maximize2,
} from "lucide-react"

interface WhiteboardElement {
  id: string
  type: "pen" | "rectangle" | "circle" | "text" | "image"
  x: number
  y: number
  width?: number
  height?: number
  points?: { x: number; y: number }[]
  text?: string
  color: string
  strokeWidth: number
  userId: string
  timestamp: number
}

interface WhiteboardPresentation {
  id: string
  name: string
  slides: PresentationSlide[]
  currentSlide: number
  isPlaying: boolean
}

interface PresentationSlide {
  id: string
  title: string
  content: string
  elements: WhiteboardElement[]
  notes: string
}

interface CollaborativeWhiteboardProps {
  projectId: string
  userId: string
}

export function CollaborativeWhiteboard({ projectId, userId }: CollaborativeWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [elements, setElements] = useState<WhiteboardElement[]>([])
  const [selectedTool, setSelectedTool] = useState<"pen" | "eraser" | "rectangle" | "circle" | "text" | "select">("pen")
  const [selectedColor, setSelectedColor] = useState("#00D1FF")
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [isDrawing, setIsDrawing] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [selectedElement, setSelectedElement] = useState<string | null>(null)
  const [textInput, setTextInput] = useState("")
  const [showTextInput, setShowTextInput] = useState(false)
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 })

  // Presentation state
  const [presentations, setPresentations] = useState<WhiteboardPresentation[]>([
    {
      id: "1",
      name: "Project Architecture",
      slides: [
        {
          id: "slide-1",
          title: "System Overview",
          content: "High-level architecture diagram",
          elements: [],
          notes: "Explain the main components and their interactions",
        },
        {
          id: "slide-2",
          title: "Database Design",
          content: "Entity relationship diagram",
          elements: [],
          notes: "Focus on key relationships and constraints",
        },
        {
          id: "slide-3",
          title: "API Structure",
          content: "REST endpoints and data flow",
          elements: [],
          notes: "Demonstrate request/response patterns",
        },
      ],
      currentSlide: 0,
      isPlaying: false,
    },
  ])
  const [activePresentation, setActivePresentation] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Collaborative cursors
  const [collaborators, setCollaborators] = useState([
    { id: "user-1", name: "Sarah Wilson", color: "#FF6B6B", x: 100, y: 100 },
    { id: "user-2", name: "Mike Johnson", color: "#4ECDC4", x: 200, y: 150 },
  ])

  const colors = [
    "#00D1FF", // Cyan
    "#FF6B6B", // Red
    "#4ECDC4", // Teal
    "#45B7D1", // Blue
    "#96CEB4", // Green
    "#FFEAA7", // Yellow
    "#DDA0DD", // Plum
    "#98D8C8", // Mint
    "#F7DC6F", // Gold
    "#BB8FCE", // Purple
  ]

  useEffect(() => {
    drawCanvas()
  }, [elements, zoom, panOffset, selectedElement])

  const drawCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply zoom and pan
    ctx.save()
    ctx.scale(zoom / 100, zoom / 100)
    ctx.translate(panOffset.x, panOffset.y)

    // Draw grid
    ctx.strokeStyle = "#374151"
    ctx.lineWidth = 1
    const gridSize = 20
    for (let x = -panOffset.x; x < canvas.width / (zoom / 100) - panOffset.x; x += gridSize) {
      ctx.beginPath()
      ctx.moveTo(x, -panOffset.y)
      ctx.lineTo(x, canvas.height / (zoom / 100) - panOffset.y)
      ctx.stroke()
    }
    for (let y = -panOffset.y; y < canvas.height / (zoom / 100) - panOffset.y; y += gridSize) {
      ctx.beginPath()
      ctx.moveTo(-panOffset.x, y)
      ctx.lineTo(canvas.width / (zoom / 100) - panOffset.x, y)
      ctx.stroke()
    }

    // Draw elements
    elements.forEach((element) => {
      ctx.strokeStyle = element.color
      ctx.fillStyle = element.color
      ctx.lineWidth = element.strokeWidth

      if (element.type === "pen" && element.points) {
        ctx.beginPath()
        element.points.forEach((point, index) => {
          if (index === 0) {
            ctx.moveTo(point.x, point.y)
          } else {
            ctx.lineTo(point.x, point.y)
          }
        })
        ctx.stroke()
      } else if (element.type === "rectangle") {
        ctx.strokeRect(element.x, element.y, element.width || 100, element.height || 60)
      } else if (element.type === "circle") {
        ctx.beginPath()
        ctx.arc(
          element.x + (element.width || 100) / 2,
          element.y + (element.height || 100) / 2,
          (element.width || 100) / 2,
          0,
          2 * Math.PI,
        )
        ctx.stroke()
      } else if (element.type === "text") {
        ctx.font = `${element.strokeWidth * 6}px Inter`
        ctx.fillText(element.text || "", element.x, element.y)
      }

      // Draw selection border
      if (selectedElement === element.id) {
        ctx.strokeStyle = "#00D1FF"
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.strokeRect(element.x - 5, element.y - 5, (element.width || 100) + 10, (element.height || 60) + 10)
        ctx.setLineDash([])
      }
    })

    // Draw collaborative cursors
    collaborators.forEach((collaborator) => {
      if (collaborator.id !== userId) {
        ctx.fillStyle = collaborator.color
        ctx.beginPath()
        ctx.arc(collaborator.x, collaborator.y, 8, 0, 2 * Math.PI)
        ctx.fill()
        ctx.fillStyle = "#FFFFFF"
        ctx.font = "12px Inter"
        ctx.fillText(collaborator.name, collaborator.x + 15, collaborator.y - 10)
      }
    })

    ctx.restore()
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - panOffset.x) / (zoom / 100)
    const y = (e.clientY - rect.top - panOffset.y) / (zoom / 100)

    if (selectedTool === "text") {
      setTextPosition({ x, y })
      setShowTextInput(true)
      return
    }

    setIsDrawing(true)

    const newElement: WhiteboardElement = {
      id: Date.now().toString(),
      type: selectedTool as any,
      x,
      y,
      color: selectedColor,
      strokeWidth,
      userId,
      timestamp: Date.now(),
      points: selectedTool === "pen" ? [{ x, y }] : undefined,
      width: selectedTool === "rectangle" || selectedTool === "circle" ? 0 : undefined,
      height: selectedTool === "rectangle" || selectedTool === "circle" ? 0 : undefined,
    }

    if (selectedTool !== "select" && selectedTool !== "eraser") {
      setElements([...elements, newElement])
      setSelectedElement(newElement.id)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas || !isDrawing) return

    const rect = canvas.getBoundingClientRect()
    const x = (e.clientX - rect.left - panOffset.x) / (zoom / 100)
    const y = (e.clientY - rect.top - panOffset.y) / (zoom / 100)

    if (selectedTool === "pen" && selectedElement) {
      setElements((prev) =>
        prev.map((el) => (el.id === selectedElement ? { ...el, points: [...(el.points || []), { x, y }] } : el)),
      )
    } else if ((selectedTool === "rectangle" || selectedTool === "circle") && selectedElement) {
      setElements((prev) =>
        prev.map((el) => (el.id === selectedElement ? { ...el, width: x - el.x, height: y - el.y } : el)),
      )
    }
  }

  const handleCanvasMouseUp = () => {
    setIsDrawing(false)
  }

  const addTextElement = () => {
    if (!textInput.trim()) return

    const newElement: WhiteboardElement = {
      id: Date.now().toString(),
      type: "text",
      x: textPosition.x,
      y: textPosition.y,
      text: textInput,
      color: selectedColor,
      strokeWidth,
      userId,
      timestamp: Date.now(),
    }

    setElements([...elements, newElement])
    setTextInput("")
    setShowTextInput(false)
  }

  const clearCanvas = () => {
    setElements([])
    setSelectedElement(null)
  }

  const deleteSelected = () => {
    if (selectedElement) {
      setElements(elements.filter((el) => el.id !== selectedElement))
      setSelectedElement(null)
    }
  }

  const exportCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = "whiteboard.png"
    link.href = canvas.toDataURL()
    link.click()
  }

  const startPresentation = (presentationId: string) => {
    setActivePresentation(presentationId)
    setCurrentSlide(0)
    setPresentations((prev) =>
      prev.map((p) => (p.id === presentationId ? { ...p, isPlaying: true, currentSlide: 0 } : p)),
    )
  }

  const nextSlide = () => {
    if (!activePresentation) return
    const presentation = presentations.find((p) => p.id === activePresentation)
    if (!presentation || currentSlide >= presentation.slides.length - 1) return

    const newSlide = currentSlide + 1
    setCurrentSlide(newSlide)
    setPresentations((prev) => prev.map((p) => (p.id === activePresentation ? { ...p, currentSlide: newSlide } : p)))
  }

  const prevSlide = () => {
    if (!activePresentation || currentSlide <= 0) return

    const newSlide = currentSlide - 1
    setCurrentSlide(newSlide)
    setPresentations((prev) => prev.map((p) => (p.id === activePresentation ? { ...p, currentSlide: newSlide } : p)))
  }

  const stopPresentation = () => {
    setActivePresentation(null)
    setPresentations((prev) => prev.map((p) => ({ ...p, isPlaying: false })))
  }

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden">
      {/* Clean Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#16213E]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-500/5 via-transparent to-cyan-500/5" />

      {/* Header */}
      <div className="relative p-3 border-b border-green-500/10 bg-black/20 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                Collaborative Whiteboard
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-300/80 font-medium">
                  {collaborators.length} collaborators online
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="bg-gradient-to-r from-green-500/15 to-cyan-500/15 border-green-500/20 text-green-300 text-xs px-2 py-0.5">
              <Users className="w-2.5 h-2.5 mr-1" />
              Live
            </Badge>
            <Button
              size="sm"
              onClick={exportCanvas}
              className="h-7 w-7 rounded-md bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md transition-all duration-200"
            >
              <Download className="w-3.5 h-3.5" />
            </Button>
            <Button
              size="sm"
              onClick={clearCanvas}
              className="h-7 w-7 rounded-md bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-md transition-all duration-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Toolbar */}
        <div className="w-16 bg-black/20 backdrop-blur-xl border-r border-green-500/10 flex flex-col items-center py-4 gap-2 relative z-10">
          {/* Drawing Tools */}
          <div className="flex flex-col gap-2">
            {[
              { tool: "select", icon: Move, label: "Select" },
              { tool: "pen", icon: Pen, label: "Pen" },
              { tool: "eraser", icon: Eraser, label: "Eraser" },
              { tool: "rectangle", icon: Square, label: "Rectangle" },
              { tool: "circle", icon: Circle, label: "Circle" },
              { tool: "text", icon: Type, label: "Text" },
            ].map(({ tool, icon: Icon, label }) => (
              <Button
                key={tool}
                size="sm"
                onClick={() => setSelectedTool(tool as any)}
                className={`h-10 w-10 rounded-lg transition-all duration-300 ${
                  selectedTool === tool
                    ? "bg-gradient-to-r from-green-500/30 to-cyan-500/30 text-white border border-green-400/50 shadow-lg shadow-green-500/25"
                    : "bg-black/20 border-green-500/20 text-green-300 hover:text-white hover:bg-green-500/20 hover:border-green-400/40 backdrop-blur-xl"
                }`}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </Button>
            ))}
          </div>

          <div className="w-8 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent my-2" />

          {/* Color Palette */}
          <div className="flex flex-col gap-1">
            {colors.slice(0, 6).map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-6 h-6 rounded-md border-2 transition-all duration-200 ${
                  selectedColor === color ? "border-white scale-110" : "border-transparent hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>

          <div className="w-8 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent my-2" />

          {/* Zoom Controls */}
          <div className="flex flex-col gap-2">
            <Button
              size="sm"
              onClick={() => setZoom(Math.min(200, zoom + 25))}
              className="h-8 w-8 rounded-lg bg-black/20 border-green-500/20 text-green-300 hover:text-white hover:bg-green-500/20"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </Button>
            <span className="text-xs text-green-300 text-center font-medium">{zoom}%</span>
            <Button
              size="sm"
              onClick={() => setZoom(Math.max(25, zoom - 25))}
              className="h-8 w-8 rounded-lg bg-black/20 border-green-500/20 text-green-300 hover:text-white hover:bg-green-500/20"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Tabs defaultValue="whiteboard" className="flex-1 flex flex-col">
            <div className="bg-black/10 backdrop-blur-xl border-b border-green-500/10 px-4 flex-shrink-0">
              <TabsList className="bg-transparent border-none h-10 gap-1">
                <TabsTrigger
                  value="whiteboard"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500/15 data-[state=active]:to-cyan-500/15 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-green-500/20 transition-all duration-300 hover:bg-white/3 rounded-lg px-3 py-1.5 text-gray-300 hover:text-white backdrop-blur-sm text-sm"
                >
                  <Palette className="w-3.5 h-3.5 mr-2" />
                  Whiteboard
                </TabsTrigger>
                <TabsTrigger
                  value="presentations"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/15 data-[state=active]:to-pink-500/15 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:border data-[state=active]:border-purple-500/20 transition-all duration-300 hover:bg-white/3 rounded-lg px-3 py-1.5 text-gray-300 hover:text-white backdrop-blur-sm text-sm"
                >
                  <PresentationIcon className="w-3.5 h-3.5 mr-2" />
                  Presentations
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="whiteboard" className="flex-1 m-0 p-0 overflow-hidden">
              <div className="relative flex-1 overflow-hidden">
                <canvas
                  ref={canvasRef}
                  width={1200}
                  height={800}
                  className="w-full h-full cursor-crosshair bg-black/5 backdrop-blur-sm"
                  onMouseDown={handleCanvasMouseDown}
                  onMouseMove={handleCanvasMouseMove}
                  onMouseUp={handleCanvasMouseUp}
                />

                {/* Text Input Modal */}
                {showTextInput && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-black/80 backdrop-blur-xl border border-green-500/20 rounded-xl p-6 max-w-md w-full mx-4">
                      <h3 className="text-white font-semibold mb-4">Add Text</h3>
                      <Input
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Enter your text..."
                        className="bg-black/40 border-green-500/30 text-white mb-4"
                        onKeyPress={(e) => e.key === "Enter" && addTextElement()}
                        autoFocus
                      />
                      <div className="flex gap-3">
                        <Button
                          onClick={addTextElement}
                          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                        >
                          Add Text
                        </Button>
                        <Button
                          onClick={() => setShowTextInput(false)}
                          variant="ghost"
                          className="text-gray-300 hover:text-white"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stroke Width Control */}
                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xl border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-green-300 font-medium">Stroke:</span>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={strokeWidth}
                      onChange={(e) => setStrokeWidth(Number(e.target.value))}
                      className="w-20 h-1 bg-green-500/20 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-sm text-green-300 w-6">{strokeWidth}</span>
                  </div>
                </div>

                {/* Collaborator Avatars */}
                <div className="absolute top-4 right-4 flex gap-2">
                  {collaborators.map((collaborator) => (
                    <div
                      key={collaborator.id}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shadow-lg border-2 border-white/20"
                      style={{ backgroundColor: collaborator.color }}
                      title={collaborator.name}
                    >
                      {collaborator.name.charAt(0)}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="presentations" className="flex-1 m-0 p-0 overflow-hidden">
              <div className="flex-1 flex">
                {/* Presentation List */}
                <div className="w-80 bg-black/10 backdrop-blur-xl border-r border-purple-500/10 flex flex-col">
                  <div className="p-4 border-b border-purple-500/10">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold">Presentations</h3>
                      <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload PPT
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    <div className="space-y-3">
                      {presentations.map((presentation) => (
                        <div
                          key={presentation.id}
                          className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-lg p-4 hover:border-purple-400/40 transition-all duration-200"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-white font-medium">{presentation.name}</h4>
                            <Badge className="bg-purple-500/20 text-purple-300 text-xs">
                              {presentation.slides.length} slides
                            </Badge>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => startPresentation(presentation.id)}
                              disabled={currentSlide === 0}
                              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Present
                            </Button>
                            <Button size="sm" variant="ghost" className="text-purple-300 hover:text-white">
                              <FileText className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Presentation Viewer */}
                <div className="flex-1 flex flex-col">
                  {activePresentation ? (
                    <>
                      {/* Presentation Controls */}
                      <div className="bg-black/20 backdrop-blur-xl border-b border-purple-500/10 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button
                            size="sm"
                            onClick={prevSlide}
                            disabled={currentSlide === 0}
                            className="bg-black/20 border-purple-500/20 text-purple-300 hover:text-white disabled:opacity-50"
                          >
                            <SkipBack className="w-4 h-4" />
                          </Button>
                          <span className="text-white font-medium">
                            {currentSlide + 1} / {presentations.find((p) => p.id === activePresentation)?.slides.length}
                          </span>
                          <Button
                            size="sm"
                            onClick={nextSlide}
                            disabled={
                              currentSlide >=
                              (presentations.find((p) => p.id === activePresentation)?.slides.length || 0) - 1
                            }
                            className="bg-black/20 border-purple-500/20 text-purple-300 hover:text-white disabled:opacity-50"
                          >
                            <SkipForward className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button size="sm" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                            <Maximize2 className="w-4 h-4 mr-2" />
                            Fullscreen
                          </Button>
                          <Button
                            size="sm"
                            onClick={stopPresentation}
                            variant="ghost"
                            className="text-red-300 hover:text-white"
                          >
                            Stop
                          </Button>
                        </div>
                      </div>

                      {/* Slide Content */}
                      <div className="flex-1 bg-white m-4 rounded-lg shadow-xl overflow-hidden">
                        <div className="h-full flex items-center justify-center p-8">
                          <div className="text-center">
                            <h1 className="text-4xl font-bold text-gray-800 mb-4">
                              {presentations.find((p) => p.id === activePresentation)?.slides[currentSlide]?.title}
                            </h1>
                            <p className="text-xl text-gray-600">
                              {presentations.find((p) => p.id === activePresentation)?.slides[currentSlide]?.content}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Speaker Notes */}
                      <div className="bg-black/20 backdrop-blur-xl border-t border-purple-500/10 p-4">
                        <h4 className="text-white font-medium mb-2">Speaker Notes:</h4>
                        <p className="text-gray-300 text-sm">
                          {presentations.find((p) => p.id === activePresentation)?.slides[currentSlide]?.notes}
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <PresentationIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                        <h3 className="text-white font-semibold mb-2">No Active Presentation</h3>
                        <p className="text-gray-400">Select a presentation to start presenting</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
