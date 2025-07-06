"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { RefreshCw, Monitor, Smartphone, Tablet } from "lucide-react"

interface PreviewPaneProps {
  code: string
  language: string
}

export function PreviewPane({ code, language }: PreviewPaneProps) {
  const [device, setDevice] = useState<"desktop" | "mobile" | "tablet">("desktop")
  const [previewContent, setPreviewContent] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    generatePreview()
  }, [code, language])

  const generatePreview = async () => {
    setIsLoading(true)

    // Simulate preview generation
    setTimeout(() => {
      if (language === "javascript" || language === "html") {
        // Generate HTML preview from React/JS code
        const htmlContent = `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Preview</title>
            <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
            <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
            <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            <style>
              body { margin: 0; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
              * { box-sizing: border-box; }
            </style>
          </head>
          <body>
            <div id="root"></div>
            <script type="text/babel">
              ${code}
              
              const root = ReactDOM.createRoot(document.getElementById('root'));
              root.render(React.createElement(TodoApp));
            </script>
          </body>
          </html>
        `
        setPreviewContent(htmlContent)
      } else {
        setPreviewContent(
          '<div style="padding: 20px; text-align: center; color: #666;">Preview not available for this language</div>',
        )
      }
      setIsLoading(false)
    }, 500)
  }

  const getDeviceStyles = () => {
    switch (device) {
      case "mobile":
        return { width: "320px", height: "568px", margin: "0 auto" }
      case "tablet":
        return { width: "768px", height: "1024px", margin: "0 auto" }
      default:
        return { width: "100%", height: "100%" }
    }
  }

  const getDeviceIcon = () => {
    switch (device) {
      case "mobile":
        return <Smartphone className="w-4 h-4" />
      case "tablet":
        return <Tablet className="w-4 h-4" />
      default:
        return <Monitor className="w-4 h-4" />
    }
  }

  return (
    <div className="h-full bg-gray-800 flex flex-col">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <h3 className="text-white font-medium">Preview</h3>
          {isLoading && <RefreshCw className="w-4 h-4 text-blue-400 animate-spin" />}
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-blue-500">
                {getDeviceIcon()}
                <span className="ml-2 capitalize">{device}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-600">
              <DropdownMenuItem className="text-white hover:bg-blue-500" onClick={() => setDevice("desktop")}>
                <Monitor className="w-4 h-4 mr-2" />
                Desktop
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-blue-500" onClick={() => setDevice("tablet")}>
                <Tablet className="w-4 h-4 mr-2" />
                Tablet
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white hover:bg-blue-500" onClick={() => setDevice("mobile")}>
                <Smartphone className="w-4 h-4 mr-2" />
                Mobile
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button size="sm" onClick={generatePreview} className="bg-blue-500 hover:bg-blue-600 text-white">
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-4 overflow-auto">
        <div
          className={`${device !== "desktop" ? "border-4 border-gray-700 rounded-lg shadow-lg" : ""}`}
          style={getDeviceStyles()}
        >
          {previewContent ? (
            <iframe
              srcDoc={previewContent}
              className="w-full h-full border-0 bg-white rounded"
              title="App Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded text-gray-400">
              <div className="text-center">
                <Monitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No preview available</p>
                <p className="text-sm">Write some code to see the preview</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview Status */}
      <div className="p-2 border-t border-gray-700 text-xs text-gray-400">
        <div className="flex items-center justify-between">
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
          <span className="text-green-400">● Live</span>
        </div>
      </div>
    </div>
  )
}
