"use client"

import type React from "react"
import { X } from "lucide-react" // Import the X component

import { useState, useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Pen,
  Eraser,
  Square,
  Circle,
  Type,
  ArrowRight,
  Minus,
  StickyNote,
  ImageIcon,
  Download,
  Trash2,
  ZoomIn,
  ZoomOut,
  Move,
  Palette,
  Undo,
  Redo,
  Copy,
  Layers,
  Grid,
  Presentation,
  Upload,
  ChevronLeft,
  ChevronRight,
  Play,
} from "lucide-react"

interface WhiteboardElement {
  id: string
  type: "pen" | "rectangle" | "circle" | "text" | "arrow" | "line" | "sticky" | "image"
  x: number
  y: number
  width?: number
  height?: number
  points?: { x: number; y: number }[]
  text?: string
  color: string
  fillColor?: string
  strokeWidth: number
  fontSize?: number
  fontFamily?: string
  fontWeight?: string
  fontStyle?: string
  textAlign?: string
  rotation?: number
  locked?: boolean
  layer?: number
  opacity?: number
  userId: string
  timestamp: number
}

interface Slide {
  id: string
  title: string
  content: string
  thumbnail: string
  elements: WhiteboardElement[]
}

interface AdvancedWhiteboardProps {
  projectId: string
  userId: string
}

export function AdvancedWhiteboard({ projectId, userId }: AdvancedWhiteboardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [elements, setElements] = useState<WhiteboardElement[]>([])
  const [history, setHistory] = useState<WhiteboardElement[][]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [selectedTool, setSelectedTool] = useState<string>("pen")
  const [selectedColor, setSelectedColor] = useState("#00D1FF")
  const [fillColor, setFillColor] = useState("#FFFFFF")
  const [strokeWidth, setStrokeWidth] = useState(3)
  const [fontSize, setFontSize] = useState(16)
  const [fontFamily, setFontFamily] = useState("Inter")
  const [isDrawing, setIsDrawing] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 })
  const [selectedElements, setSelectedElements] = useState<string[]>([])
  const [textInput, setTextInput] = useState("")
  const [showTextInput, setShowTextInput] = useState(false)
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(true)
  const [currentLayer, setCurrentLayer] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 })

  // PPT Presentation Features
  const [presentationMode, setPresentationMode] = useState(false)
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: "slide-1",
      title: "Project Overview",
      content: "Welcome to our collaborative project presentation",
      thumbnail: "/placeholder.svg?height=100&width=150",
      elements: [],
    },
    {
      id: "slide-2",
      title: "Architecture Design",
      content: "System architecture and component overview",
      thumbnail: "/placeholder.svg?height=100&width=150",
      elements: [],
    },
    {
      id: "slide-3",
      title: "Implementation Plan",
      content: "Development roadmap and milestones",
      thumbnail: "/placeholder.svg?height=100&width=150",
      elements: [],
    },
  ])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showSlidePanel, setShowSlidePanel] = useState(false)

  // Performance optimization
  const [isPerformanceMode, setIsPerformanceMode] = useState(false)
  const [renderQueue, setRenderQueue] = useState<(() => void)[]>([])

  // Collaborative cursors
  const [collaborators] = useState([
    { id: "user-1", name: "Sarah Wilson", color: "#FF6B6B", x: 100, y: 100 },
    { id: "user-2", name: "Mike Johnson", color: "#4ECDC4", x: 200, y: 150 },
  ])

  const colors = [
    "#00D1FF",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#FF9F43",
    "#6C5CE7",
    "#A29BFE",
    "#FD79A8",
    "#FDCB6E",
    "#E17055",
    "#74B9FF",
    "#00B894",
    "#E84393",
    "#2D3436",
    "#636E72",
    "#FFFFFF",
  ]

  const tools = [
    { id: "select", icon: Move, label: "Select", shortcut: "V" },
    { id: "pen", icon: Pen, label: "Pen", shortcut: "P" },
    { id: "eraser", icon: Eraser, label: "Eraser", shortcut: "E" },
    { id: "rectangle", icon: Square, label: "Rectangle", shortcut: "R" },
    { id: "circle", icon: Circle, label: "Circle", shortcut: "C" },
    { id: "arrow", icon: ArrowRight, label: "Arrow", shortcut: "A" },
    { id: "line", icon: Minus, label: "Line", shortcut: "L" },
    { id: "text", icon: Type, label: "Text", shortcut: "T" },
    { id: "sticky", icon: StickyNote, label: "Sticky Note", shortcut: "S" },
    { id: "image", icon: ImageIcon, label: "Image", shortcut: "I" },
  ]

  // Performance optimized drawing
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Use requestAnimationFrame for smooth rendering
    requestAnimationFrame(() => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Apply zoom and pan
      ctx.save()
      ctx.scale(zoom / 100, zoom / 100)
      ctx.translate(panOffset.x, panOffset.y)

      // Draw grid if enabled
      if (showGrid && !presentationMode) {
        ctx.strokeStyle = "#374151"
        ctx.lineWidth = 0.5
        ctx.globalAlpha = 0.3
        const gridSize = 20
        const startX = Math.floor(-panOffset.x / gridSize) * gridSize
        const startY = Math.floor(-panOffset.y / gridSize) * gridSize
        const endX = startX + canvas.width / (zoom / 100) + gridSize
        const endY = startY + canvas.height / (zoom / 100) + gridSize

        for (let x = startX; x < endX; x += gridSize) {
          ctx.beginPath()
          ctx.moveTo(x, startY)
          ctx.lineTo(x, endY)
          ctx.stroke()
        }
        for (let y = startY; y < endY; y += gridSize) {
          ctx.beginPath()
          ctx.moveTo(startX, y)
          ctx.lineTo(endX, y)
          ctx.stroke()
        }
        ctx.globalAlpha = 1
      }

      // Get current slide elements if in presentation mode
      const currentElements = presentationMode ? slides[currentSlide]?.elements || [] : elements

      // Sort elements by layer
      const sortedElements = [...currentElements].sort((a, b) => (a.layer || 1) - (b.layer || 1))

      // Draw elements with performance optimization
      sortedElements.forEach((element) => {
        ctx.save()
        ctx.globalAlpha = element.opacity || 1
        ctx.strokeStyle = element.color
        ctx.fillStyle = element.fillColor || element.color
        ctx.lineWidth = element.strokeWidth
        ctx.lineCap = "round"
        ctx.lineJoin = "round"

        // Apply rotation if exists
        if (element.rotation) {
          const centerX = element.x + (element.width || 0) / 2
          const centerY = element.y + (element.height || 0) / 2
          ctx.translate(centerX, centerY)
          ctx.rotate((element.rotation * Math.PI) / 180)
          ctx.translate(-centerX, -centerY)
        }

        switch (element.type) {
          case "pen":
            if (element.points && element.points.length > 1) {
              ctx.beginPath()
              ctx.moveTo(element.points[0].x, element.points[0].y)
              for (let i = 1; i < element.points.length; i++) {
                ctx.lineTo(element.points[i].x, element.points[i].y)
              }
              ctx.stroke()
            }
            break

          case "rectangle":
            ctx.strokeRect(element.x, element.y, element.width || 100, element.height || 60)
            if (element.fillColor && element.fillColor !== "transparent") {
              ctx.fillRect(element.x, element.y, element.width || 100, element.height || 60)
            }
            break

          case "circle":
            const radius = Math.min(element.width || 100, element.height || 100) / 2
            ctx.beginPath()
            ctx.arc(
              element.x + (element.width || 100) / 2,
              element.y + (element.height || 100) / 2,
              radius,
              0,
              2 * Math.PI,
            )
            ctx.stroke()
            if (element.fillColor && element.fillColor !== "transparent") {
              ctx.fill()
            }
            break

          case "arrow":
            const arrowLength = Math.sqrt(Math.pow(element.width || 100, 2) + Math.pow(element.height || 60, 2))
            const angle = Math.atan2(element.height || 60, element.width || 100)

            // Draw arrow line
            ctx.beginPath()
            ctx.moveTo(element.x, element.y)
            ctx.lineTo(element.x + (element.width || 100), element.y + (element.height || 60))
            ctx.stroke()

            // Draw arrowhead
            const headLength = 15
            ctx.beginPath()
            ctx.moveTo(element.x + (element.width || 100), element.y + (element.height || 60))
            ctx.lineTo(
              element.x + (element.width || 100) - headLength * Math.cos(angle - Math.PI / 6),
              element.y + (element.height || 60) - headLength * Math.sin(angle - Math.PI / 6),
            )
            ctx.moveTo(element.x + (element.width || 100), element.y + (element.height || 60))
            ctx.lineTo(
              element.x + (element.width || 100) - headLength * Math.cos(angle + Math.PI / 6),
              element.y + (element.height || 60) - headLength * Math.sin(angle + Math.PI / 6),
            )
            ctx.stroke()
            break

          case "line":
            ctx.beginPath()
            ctx.moveTo(element.x, element.y)
            ctx.lineTo(element.x + (element.width || 100), element.y + (element.height || 0))
            ctx.stroke()
            break

          case "text":
            ctx.font = `${element.fontWeight || "normal"} ${element.fontStyle || "normal"} ${
              element.fontSize || 16
            }px ${element.fontFamily || "Inter"}`
            ctx.textAlign = (element.textAlign as CanvasTextAlign) || "left"
            ctx.fillText(element.text || "", element.x, element.y)
            break

          case "sticky":
            // Draw sticky note background
            ctx.fillStyle = element.fillColor || "#FFEAA7"
            ctx.fillRect(element.x, element.y, element.width || 120, element.height || 120)
            ctx.strokeRect(element.x, element.y, element.width || 120, element.height || 120)

            // Draw text on sticky note
            ctx.fillStyle = "#2D3436"
            ctx.font = `14px ${element.fontFamily || "Inter"}`
            ctx.textAlign = "left"
            const words = (element.text || "").split(" ")
            let line = ""
            let y = element.y + 20

            for (let n = 0; n < words.length; n++) {
              const testLine = line + words[n] + " "
              const metrics = ctx.measureText(testLine)
              const testWidth = metrics.width
              if (testWidth > (element.width || 120) - 20 && n > 0) {
                ctx.fillText(line, element.x + 10, y)
                line = words[n] + " "
                y += 18
              } else {
                line = testLine
              }
            }
            ctx.fillText(line, element.x + 10, y)
            break
        }

        // Draw selection border (only in non-presentation mode)
        if (!presentationMode && selectedElements.includes(element.id)) {
          ctx.strokeStyle = "#00D1FF"
          ctx.lineWidth = 2
          ctx.setLineDash([5, 5])
          ctx.strokeRect(element.x - 5, element.y - 5, (element.width || 100) + 10, (element.height || 60) + 10)
          ctx.setLineDash([])

          // Draw resize handles
          const handles = [
            { x: element.x - 5, y: element.y - 5 },
            { x: element.x + (element.width || 100) + 5, y: element.y - 5 },
            { x: element.x - 5, y: element.y + (element.height || 60) + 5 },
            { x: element.x + (element.width || 100) + 5, y: element.y + (element.height || 60) + 5 },
          ]

          handles.forEach((handle) => {
            ctx.fillStyle = "#00D1FF"
            ctx.fillRect(handle.x - 3, handle.y - 3, 6, 6)
          })
        }

        // Draw lock icon if locked
        if (element.locked) {
          ctx.fillStyle = "#FF6B6B"
          ctx.font = "12px Inter"
          ctx.fillText("🔒", element.x + (element.width || 100) - 15, element.y - 5)
        }

        ctx.restore()
      })

      // Draw collaborative cursors (only in non-presentation mode)
      if (!presentationMode) {
        collaborators.forEach((collaborator) => {
          if (collaborator.id !== userId) {
            ctx.fillStyle = collaborator.color
            ctx.beginPath()
            ctx.arc(collaborator.x, collaborator.y, 6, 0, 2 * Math.PI)
            ctx.fill()
            ctx.fillStyle = "#FFFFFF"
            ctx.font = "11px Inter"
            ctx.fillText(collaborator.name, collaborator.x + 12, collaborator.y - 8)
          }
        })
      }

      ctx.restore()
    })
  }, [
    elements,
    zoom,
    panOffset,
    selectedElements,
    showGrid,
    collaborators,
    userId,
    presentationMode,
    slides,
    currentSlide,
  ])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (presentationMode) {
        // Presentation mode shortcuts
        if (e.key === "Escape") {
          setPresentationMode(false)
        } else if (e.key === "ArrowRight" || e.key === " ") {
          nextSlide()
        } else if (e.key === "ArrowLeft") {
          prevSlide()
        }
        return
      }

      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "z":
            e.preventDefault()
            if (e.shiftKey) {
              redo()
            } else {
              undo()
            }
            break
          case "c":
            e.preventDefault()
            copySelected()
            break
          case "v":
            e.preventDefault()
            pasteElements()
            break
          case "a":
            e.preventDefault()
            selectAll()
            break
          case "d":
            e.preventDefault()
            duplicateSelected()
            break
        }
      } else {
        // Tool shortcuts
        const toolShortcuts: { [key: string]: string } = {
          v: "select",
          p: "pen",
          e: "eraser",
          r: "rectangle",
          c: "circle",
          a: "arrow",
          l: "line",
          t: "text",
          s: "sticky",
          i: "image",
        }

        if (toolShortcuts[e.key.toLowerCase()]) {
          setSelectedTool(toolShortcuts[e.key.toLowerCase()])
        }
      }

      // Delete selected elements
      if (e.key === "Delete" || e.key === "Backspace") {
        deleteSelected()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedElements, presentationMode])

  const saveToHistory = () => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push([...elements])
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      setElements(history[historyIndex - 1])
    }
  }

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      setElements(history[historyIndex + 1])
    }
  }

  const getCanvasPoint = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }

    const rect = canvas.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left - panOffset.x) / (zoom / 100),
      y: (e.clientY - rect.top - panOffset.y) / (zoom / 100),
    }
  }

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (presentationMode) return

    const point = getCanvasPoint(e)

    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      // Middle mouse or Alt+click for panning
      setIsPanning(true)
      setLastPanPoint({ x: e.clientX, y: e.clientY })
      return
    }

    if (selectedTool === "text") {
      setTextPosition(point)
      setShowTextInput(true)
      return
    }

    if (selectedTool === "select") {
      // Check if clicking on an existing element
      const clickedElement = elements
        .slice()
        .reverse()
        .find((el) => {
          return (
            point.x >= el.x &&
            point.x <= el.x + (el.width || 100) &&
            point.y >= el.y &&
            point.y <= el.y + (el.height || 60)
          )
        })

      if (clickedElement) {
        if (!e.shiftKey) {
          setSelectedElements([clickedElement.id])
        } else {
          setSelectedElements((prev) =>
            prev.includes(clickedElement.id)
              ? prev.filter((id) => id !== clickedElement.id)
              : [...prev, clickedElement.id],
          )
        }
      } else {
        setSelectedElements([])
      }
      return
    }

    setIsDrawing(true)
    saveToHistory()

    const newElement: WhiteboardElement = {
      id: Date.now().toString() + Math.random(),
      type: selectedTool as any,
      x: point.x,
      y: point.y,
      color: selectedColor,
      fillColor: selectedTool === "sticky" ? fillColor : undefined,
      strokeWidth,
      fontSize,
      fontFamily,
      layer: currentLayer,
      opacity: 1,
      userId,
      timestamp: Date.now(),
      points: selectedTool === "pen" ? [point] : undefined,
      width: ["rectangle", "circle", "arrow", "line", "sticky"].includes(selectedTool) ? 0 : undefined,
      height: ["rectangle", "circle", "arrow", "line", "sticky"].includes(selectedTool) ? 0 : undefined,
    }

    if (selectedTool !== "eraser") {
      setElements([...elements, newElement])
      setSelectedElements([newElement.id])
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      const deltaX = e.clientX - lastPanPoint.x
      const deltaY = e.clientY - lastPanPoint.y
      setPanOffset((prev) => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
      setLastPanPoint({ x: e.clientX, y: e.clientY })
      return
    }

    if (!isDrawing || presentationMode) return

    const point = getCanvasPoint(e)

    if (selectedTool === "pen" && selectedElements.length > 0) {
      setElements((prev) =>
        prev.map((el) => (el.id === selectedElements[0] ? { ...el, points: [...(el.points || []), point] } : el)),
      )
    } else if (
      ["rectangle", "circle", "arrow", "line", "sticky"].includes(selectedTool) &&
      selectedElements.length > 0
    ) {
      setElements((prev) =>
        prev.map((el) =>
          el.id === selectedElements[0] ? { ...el, width: point.x - el.x, height: point.y - el.y } : el,
        ),
      )
    } else if (selectedTool === "eraser") {
      // Erase elements under cursor
      const elementsToErase = elements.filter((el) => {
        if (el.type === "pen" && el.points) {
          return el.points.some((p) => Math.abs(p.x - point.x) < 10 && Math.abs(p.y - point.y) < 10)
        }
        return (
          point.x >= el.x &&
          point.x <= el.x + (el.width || 100) &&
          point.y >= el.y &&
          point.y <= el.y + (el.height || 60)
        )
      })

      if (elementsToErase.length > 0) {
        setElements((prev) => prev.filter((el) => !elementsToErase.includes(el)))
      }
    }
  }

  const handleCanvasMouseUp = () => {
    setIsDrawing(false)
    setIsPanning(false)
  }

  const addTextElement = () => {
    if (!textInput.trim()) return

    saveToHistory()
    const newElement: WhiteboardElement = {
      id: Date.now().toString() + Math.random(),
      type: "text",
      x: textPosition.x,
      y: textPosition.y,
      text: textInput,
      color: selectedColor,
      strokeWidth,
      fontSize,
      fontFamily,
      layer: currentLayer,
      opacity: 1,
      userId,
      timestamp: Date.now(),
    }

    setElements([...elements, newElement])
    setTextInput("")
    setShowTextInput(false)
  }

  const clearCanvas = () => {
    saveToHistory()
    setElements([])
    setSelectedElements([])
  }

  const deleteSelected = () => {
    if (selectedElements.length > 0) {
      saveToHistory()
      setElements(elements.filter((el) => !selectedElements.includes(el.id)))
      setSelectedElements([])
    }
  }

  const copySelected = () => {
    // Implementation for copying selected elements
    console.log("Copy selected elements:", selectedElements)
  }

  const pasteElements = () => {
    // Implementation for pasting elements
    console.log("Paste elements")
  }

  const selectAll = () => {
    setSelectedElements(elements.map((el) => el.id))
  }

  const duplicateSelected = () => {
    if (selectedElements.length > 0) {
      saveToHistory()
      const selectedEls = elements.filter((el) => selectedElements.includes(el.id))
      const duplicated = selectedEls.map((el) => ({
        ...el,
        id: Date.now().toString() + Math.random(),
        x: el.x + 20,
        y: el.y + 20,
        timestamp: Date.now(),
      }))
      setElements([...elements, ...duplicated])
      setSelectedElements(duplicated.map((el) => el.id))
    }
  }

  const exportCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement("a")
    link.download = `whiteboard-${Date.now()}.png`
    link.href = canvas.toDataURL("image/png", 1.0)
    link.click()
  }

  const zoomIn = () => setZoom(Math.min(500, zoom + 25))
  const zoomOut = () => setZoom(Math.max(10, zoom - 25))
  const resetZoom = () => {
    setZoom(100)
    setPanOffset({ x: 0, y: 0 })
  }

  // Presentation functions
  const startPresentation = () => {
    setPresentationMode(true)
    setCurrentSlide(0)
    resetZoom()
  }

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.includes("presentation")) {
      // Handle PPT file upload
      console.log("Uploading presentation:", file.name)
      // Implementation for PPT parsing would go here
    }
  }

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#16213E]">
      {/* Header */}
      <div className="relative p-3 border-b border-green-500/10 bg-black/20 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 via-emerald-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <Palette className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Advanced Whiteboard</h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-300/80 font-medium">
                  {collaborators.length} online • Layer {currentLayer}
                  {presentationMode && ` • Slide ${currentSlide + 1}/${slides.length}`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!presentationMode && (
              <>
                <Button size="sm" onClick={undo} disabled={historyIndex <= 0} className="h-7 w-7 p-0">
                  <Undo className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" onClick={redo} disabled={historyIndex >= history.length - 1} className="h-7 w-7 p-0">
                  <Redo className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" onClick={() => setShowSlidePanel(!showSlidePanel)} className="h-7 w-7 p-0">
                  <Presentation className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" onClick={exportCanvas} className="h-7 w-7 p-0">
                  <Download className="w-3.5 h-3.5" />
                </Button>
                <Button size="sm" onClick={clearCanvas} className="h-7 w-7 p-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
            {presentationMode && (
              <Button size="sm" onClick={() => setPresentationMode(false)} className="h-7 px-3">
                Exit Presentation
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Advanced Toolbar - Hidden in presentation mode */}
        {!presentationMode && (
          <div className="w-20 bg-black/20 backdrop-blur-xl border-r border-green-500/10 flex flex-col py-4 gap-2 relative z-10">
            {/* Tools */}
            <div className="flex flex-col gap-1 px-2">
              {tools.map(({ id, icon: Icon, label, shortcut }) => (
                <Button
                  key={id}
                  size="sm"
                  onClick={() => setSelectedTool(id)}
                  className={`h-12 w-12 rounded-lg transition-all duration-300 flex flex-col items-center justify-center p-1 ${
                    selectedTool === id
                      ? "bg-gradient-to-r from-green-500/30 to-cyan-500/30 text-white border border-green-400/50 shadow-lg"
                      : "bg-black/20 border-green-500/20 text-green-300 hover:text-white hover:bg-green-500/20"
                  }`}
                  title={`${label} (${shortcut})`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs mt-0.5">{shortcut}</span>
                </Button>
              ))}
            </div>

            <div className="w-12 h-px bg-gradient-to-r from-transparent via-green-500/50 to-transparent mx-auto my-2" />

            {/* Presentation & Layer Controls */}
            <div className="px-2 space-y-2">
              <Button
                size="sm"
                onClick={startPresentation}
                className="h-8 w-12 rounded-lg bg-purple-500/20 border-purple-500/20 text-purple-300 hover:text-white text-xs"
                title="Start Presentation"
              >
                <Play className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 w-12 rounded-lg bg-blue-500/20 border-blue-500/20 text-blue-300 hover:text-white text-xs"
                title="Upload PPT"
              >
                <Upload className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                className="h-8 w-12 rounded-lg bg-black/20 border-green-500/20 text-green-300 hover:text-white text-xs"
                title="Layers"
              >
                <Layers className="w-3 h-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Canvas Controls - Hidden in presentation mode */}
          {!presentationMode && (
            <>
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <div className="bg-black/60 backdrop-blur-xl border border-green-500/20 rounded-lg p-2 flex items-center gap-2">
                  <Button size="sm" onClick={zoomOut} className="h-6 w-6 p-0">
                    <ZoomOut className="w-3 h-3" />
                  </Button>
                  <span className="text-xs text-green-300 min-w-[40px] text-center">{zoom}%</span>
                  <Button size="sm" onClick={zoomIn} className="h-6 w-6 p-0">
                    <ZoomIn className="w-3 h-3" />
                  </Button>
                  <Button size="sm" onClick={resetZoom} className="h-6 w-6 p-0" title="Reset View">
                    <Move className="w-3 h-3" />
                  </Button>
                </div>

                <div className="bg-black/60 backdrop-blur-xl border border-green-500/20 rounded-lg p-2">
                  <Button
                    size="sm"
                    onClick={() => setShowGrid(!showGrid)}
                    className={`h-6 w-6 p-0 ${showGrid ? "text-green-400" : "text-gray-400"}`}
                    title="Toggle Grid"
                  >
                    <Grid className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Properties Panel */}
              <div className="absolute top-4 right-4 z-20">
                <div className="bg-black/60 backdrop-blur-xl border border-green-500/20 rounded-lg p-3 min-w-[200px]">
                  <div className="space-y-3">
                    {/* Color Picker */}
                    <div>
                      <label className="text-xs text-green-300 mb-2 block">Stroke Color</label>
                      <div className="flex flex-wrap gap-1">
                        {colors.slice(0, 12).map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-6 h-6 rounded border-2 transition-all ${
                              selectedColor === color ? "border-white scale-110" : "border-transparent hover:scale-105"
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Fill Color */}
                    {["rectangle", "circle", "sticky"].includes(selectedTool) && (
                      <div>
                        <label className="text-xs text-green-300 mb-2 block">Fill Color</label>
                        <div className="flex flex-wrap gap-1">
                          <button
                            onClick={() => setFillColor("transparent")}
                            className={`w-6 h-6 rounded border-2 bg-transparent ${
                              fillColor === "transparent" ? "border-white" : "border-gray-500"
                            }`}
                            title="No Fill"
                          >
                            <div
                              className="w-full h-full bg-red-500 opacity-30 rounded"
                              style={{
                                background:
                                  "linear-gradient(45deg, transparent 40%, red 40%, red 60%, transparent 60%)",
                              }}
                            />
                          </button>
                          {colors.slice(0, 11).map((color) => (
                            <button
                              key={color}
                              onClick={() => setFillColor(color)}
                              className={`w-6 h-6 rounded border-2 transition-all ${
                                fillColor === color ? "border-white scale-110" : "border-transparent hover:scale-105"
                              }`}
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stroke Width */}
                    <div>
                      <label className="text-xs text-green-300 mb-2 block">Stroke Width: {strokeWidth}px</label>
                      <Slider
                        value={[strokeWidth]}
                        onValueChange={(value) => setStrokeWidth(value[0])}
                        max={20}
                        min={1}
                        step={1}
                        className="w-full"
                      />
                    </div>

                    {/* Font Size for Text */}
                    {selectedTool === "text" && (
                      <div>
                        <label className="text-xs text-green-300 mb-2 block">Font Size: {fontSize}px</label>
                        <Slider
                          value={[fontSize]}
                          onValueChange={(value) => setFontSize(value[0])}
                          max={72}
                          min={8}
                          step={2}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Presentation Mode Navigation */}
          {presentationMode && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-black/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-3 flex items-center gap-4">
                <Button
                  size="sm"
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="h-8 w-8 p-0 bg-purple-500/20 hover:bg-purple-500/30"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="text-white text-sm font-medium">
                  {currentSlide + 1} / {slides.length}
                </div>
                <Button
                  size="sm"
                  onClick={nextSlide}
                  disabled={currentSlide === slides.length - 1}
                  className="h-8 w-8 p-0 bg-purple-500/20 hover:bg-purple-500/30"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Canvas */}
          <canvas
            ref={canvasRef}
            width={1400}
            height={900}
            className={`w-full h-full ${presentationMode ? "cursor-default" : "cursor-crosshair"} bg-transparent`}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onContextMenu={(e) => e.preventDefault()}
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

          {/* Slide Panel */}
          {showSlidePanel && !presentationMode && (
            <div className="absolute right-4 top-16 bottom-4 w-64 bg-black/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-4 z-30">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Presentation Slides</h3>
                <Button size="sm" onClick={() => setShowSlidePanel(false)} className="h-6 w-6 p-0">
                  <X className="w-3 h-3" />
                </Button>
              </div>

              <div className="space-y-3 mb-4">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      currentSlide === index
                        ? "border-purple-500/50 bg-purple-500/10"
                        : "border-gray-600/30 bg-black/20 hover:bg-black/40"
                    }`}
                    onClick={() => setCurrentSlide(index)}
                  >
                    <div className="text-white text-sm font-medium mb-1">{slide.title}</div>
                    <div className="text-gray-400 text-xs">{slide.content}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Button
                  onClick={startPresentation}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Presentation
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="ghost"
                  className="w-full text-gray-300 hover:text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload PPT
                </Button>
              </div>
            </div>
          )}

          {/* Selection Info */}
          {!presentationMode && selectedElements.length > 0 && (
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-xl border border-green-500/20 rounded-lg p-3">
              <div className="text-xs text-green-300">
                {selectedElements.length} element{selectedElements.length > 1 ? "s" : ""} selected
              </div>
              <div className="flex gap-2 mt-2">
                <Button size="sm" onClick={duplicateSelected} className="h-6 text-xs">
                  <Copy className="w-3 h-3 mr-1" />
                  Duplicate
                </Button>
                <Button size="sm" onClick={deleteSelected} className="h-6 text-xs">
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          )}

          {/* Collaborator Avatars */}
          {!presentationMode && (
            <div className="absolute bottom-4 right-4 flex gap-2">
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
          )}
        </div>
      </div>

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" accept=".ppt,.pptx,.pdf" onChange={handleFileUpload} className="hidden" />
    </div>
  )
}
