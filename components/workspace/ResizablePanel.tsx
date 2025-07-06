"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, GripVertical, GripHorizontal } from "lucide-react"

interface ResizablePanelProps {
  children: React.ReactNode
  direction: "horizontal" | "vertical"
  initialSize: number
  minSize: number
  maxSize: number
  onResize: (size: number) => void
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  className?: string
  position?: "left" | "right" | "top" | "bottom"
}

export function ResizablePanel({
  children,
  direction,
  initialSize,
  minSize,
  maxSize,
  onResize,
  isCollapsed = false,
  onToggleCollapse,
  className = "",
  position = "left",
}: ResizablePanelProps) {
  const [size, setSize] = useState(initialSize)
  const [isResizing, setIsResizing] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const startPosRef = useRef(0)
  const startSizeRef = useRef(0)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      setIsResizing(true)
      startPosRef.current = direction === "horizontal" ? e.clientX : e.clientY
      startSizeRef.current = size
    },
    [direction, size],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return

      const currentPos = direction === "horizontal" ? e.clientX : e.clientY
      const delta = currentPos - startPosRef.current

      let newSize = startSizeRef.current

      if (position === "right" || position === "bottom") {
        newSize = startSizeRef.current - delta
      } else {
        newSize = startSizeRef.current + delta
      }

      newSize = Math.max(minSize, Math.min(maxSize, newSize))
      setSize(newSize)
      onResize(newSize)
    },
    [isResizing, direction, position, minSize, maxSize, onResize],
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = direction === "horizontal" ? "col-resize" : "row-resize"
      document.body.style.userSelect = "none"

      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
        document.body.style.cursor = ""
        document.body.style.userSelect = ""
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp, direction])

  const getResizeHandlePosition = () => {
    switch (position) {
      case "right":
        return "left-0 top-0 h-full w-1 cursor-col-resize"
      case "bottom":
        return "top-0 left-0 w-full h-1 cursor-row-resize"
      case "top":
        return "bottom-0 left-0 w-full h-1 cursor-row-resize"
      default: // left
        return "right-0 top-0 h-full w-1 cursor-col-resize"
    }
  }

  const getCollapseButtonPosition = () => {
    switch (position) {
      case "right":
        return "left-0 top-1/2 transform -translate-y-1/2 -translate-x-full"
      case "bottom":
        return "top-0 left-1/2 transform -translate-x-1/2 -translate-y-full"
      case "top":
        return "bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full"
      default: // left
        return "right-0 top-1/2 transform -translate-y-1/2 translate-x-full"
    }
  }

  const getCollapseIcon = () => {
    if (isCollapsed) {
      switch (position) {
        case "right":
          return <ChevronLeft className="w-4 h-4" />
        case "bottom":
          return <ChevronUp className="w-4 h-4" />
        case "top":
          return <ChevronDown className="w-4 h-4" />
        default: // left
          return <ChevronRight className="w-4 h-4" />
      }
    } else {
      switch (position) {
        case "right":
          return <ChevronRight className="w-4 h-4" />
        case "bottom":
          return <ChevronDown className="w-4 h-4" />
        case "top":
          return <ChevronUp className="w-4 h-4" />
        default: // left
          return <ChevronLeft className="w-4 h-4" />
      }
    }
  }

  const panelStyle = {
    [direction === "horizontal" ? "width" : "height"]: isCollapsed ? 0 : `${size}px`,
    transition: isResizing ? "none" : "all 0.3s ease-in-out",
  }

  return (
    <div className="relative">
      <div
        ref={panelRef}
        style={panelStyle}
        className={`relative overflow-hidden ${className} ${isCollapsed ? "opacity-0" : "opacity-100"}`}
      >
        {!isCollapsed && children}

        {/* Resize Handle */}
        {!isCollapsed && (
          <div
            className={`absolute ${getResizeHandlePosition()} bg-transparent hover:bg-bright-cyan/20 transition-colors duration-200 group z-10`}
            onMouseDown={handleMouseDown}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-bright-cyan/30 group-hover:bg-bright-cyan/50 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {direction === "horizontal" ? (
                  <GripVertical className="w-3 h-3 text-white" />
                ) : (
                  <GripHorizontal className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Collapse/Expand Button */}
      {onToggleCollapse && (
        <Button
          onClick={onToggleCollapse}
          className={`absolute ${getCollapseButtonPosition()} z-50 w-6 h-12 p-0 bg-gradient-to-r from-dark-slate/90 to-slate-gray/90 backdrop-blur-xl border border-bright-cyan/30 hover:border-bright-cyan/50 text-bright-cyan hover:text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-glow ${
            direction === "vertical" ? "w-12 h-6" : ""
          }`}
        >
          {getCollapseIcon()}
        </Button>
      )}
    </div>
  )
}
