"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, ExternalLink, Smartphone, Tablet, Monitor, RefreshCw, Code, Globe, Zap } from "lucide-react"

interface CodePreviewProps {
  code: string
  language: string
}

export function CodePreview({ code, language }: CodePreviewProps) {
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState("")
  const [error, setError] = useState("")

  // Generate preview content based on code
  const generatePreview = () => {
    if (language === "javascript" || language === "typescript") {
      // For React/JS code, create a live preview
      return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Code Preview</title>
          <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .error {
              background: #fee;
              border: 1px solid #fcc;
              padding: 10px;
              border-radius: 4px;
              color: #c33;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            try {
              ${code}
              
              // Try to render the component
              const root = ReactDOM.createRoot(document.getElementById('root'));
              if (typeof TodoApp !== 'undefined') {
                root.render(React.createElement(TodoApp));
              } else if (typeof App !== 'undefined') {
                root.render(React.createElement(App));
              } else {
                // Fallback: render the code as text
                root.render(React.createElement('div', {
                  style: {
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }
                }, 'Preview will appear here when you define a React component (App or TodoApp)'));
              }
            } catch (error) {
              document.getElementById('root').innerHTML = 
                '<div class="error">Error: ' + error.message + '</div>';
            }
          </script>
        </body>
        </html>
      `
    } else if (language === "html") {
      return code
    } else if (language === "css") {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            ${code}
          </style>
        </head>
        <body>
          <div class="demo-content">
            <h1>CSS Preview</h1>
            <p>Your CSS styles are applied to this page.</p>
            <div class="sample-box">Sample Box</div>
            <button class="sample-button">Sample Button</button>
          </div>
        </body>
        </html>
      `
    } else {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { 
              margin: 0; 
              padding: 20px; 
              font-family: 'Monaco', 'Menlo', monospace;
              background: #1a1a1a;
              color: #fff;
            }
            pre {
              background: #2d2d2d;
              padding: 20px;
              border-radius: 8px;
              overflow: auto;
              border-left: 4px solid #00d1ff;
            }
          </style>
        </head>
        <body>
          <h2>Code Preview - ${language.toUpperCase()}</h2>
          <pre><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>
        </body>
        </html>
      `
    }
  }

  useEffect(() => {
    const previewContent = generatePreview()
    const blob = new Blob([previewContent], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    setPreviewUrl(url)

    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [code, language])

  const refreshPreview = () => {
    setIsLoading(true)
    setTimeout(() => {
      const previewContent = generatePreview()
      const blob = new Blob([previewContent], { type: "text/html" })
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      setIsLoading(false)
    }, 500)
  }

  const openInNewTab = () => {
    if (previewUrl) {
      window.open(previewUrl, "_blank")
    }
  }

  const getDeviceClass = () => {
    switch (previewMode) {
      case "mobile":
        return "w-[375px] h-[667px]"
      case "tablet":
        return "w-[768px] h-[1024px]"
      default:
        return "w-full h-full"
    }
  }

  return (
    <div className="h-full w-full flex flex-col relative overflow-hidden bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#16213E]">
      {/* Header */}
      <div className="relative p-3 border-b border-purple-500/10 bg-black/20 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg">
              <Eye className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Live Preview</h3>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse" />
                <span className="text-xs text-purple-300/80 font-medium">
                  {language.toUpperCase()} • {previewMode}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Device Toggle */}
            <div className="flex items-center gap-1 bg-black/30 rounded-lg p-1">
              <Button
                size="sm"
                onClick={() => setPreviewMode("desktop")}
                className={`h-7 w-7 p-0 ${
                  previewMode === "desktop"
                    ? "bg-purple-500/30 text-white"
                    : "text-purple-300 hover:text-white hover:bg-purple-500/20"
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                onClick={() => setPreviewMode("tablet")}
                className={`h-7 w-7 p-0 ${
                  previewMode === "tablet"
                    ? "bg-purple-500/30 text-white"
                    : "text-purple-300 hover:text-white hover:bg-purple-500/20"
                }`}
                title="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
              </Button>
              <Button
                size="sm"
                onClick={() => setPreviewMode("mobile")}
                className={`h-7 w-7 p-0 ${
                  previewMode === "mobile"
                    ? "bg-purple-500/30 text-white"
                    : "text-purple-300 hover:text-white hover:bg-purple-500/20"
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </Button>
            </div>

            <div className="w-px h-4 bg-purple-500/30" />

            <Button
              size="sm"
              onClick={refreshPreview}
              disabled={isLoading}
              className="h-7 w-7 p-0 text-purple-300 hover:text-white hover:bg-purple-500/20"
              title="Refresh Preview"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            </Button>
            <Button
              size="sm"
              onClick={openInNewTab}
              className="h-7 w-7 p-0 text-purple-300 hover:text-white hover:bg-purple-500/20"
              title="Open in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Preview Area - FULL HEIGHT */}
      <div className="flex-1 flex items-center justify-center p-4 overflow-hidden min-h-0">
        {previewUrl ? (
          <div className={`${getDeviceClass()} max-w-full max-h-full relative`}>
            {/* Device Frame for Mobile/Tablet */}
            {previewMode !== "desktop" && (
              <div className="absolute -inset-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-[2rem] shadow-2xl">
                <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full" />
                {previewMode === "mobile" && (
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gray-700 rounded-full" />
                )}
              </div>
            )}

            <iframe
              src={previewUrl}
              className={`w-full h-full border-0 rounded-lg ${
                previewMode !== "desktop" ? "rounded-[1.5rem]" : ""
              } bg-white shadow-xl`}
              title="Code Preview"
              sandbox="allow-scripts allow-same-origin"
            />

            {/* Loading Overlay */}
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-lg">
                <div className="bg-black/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-4 flex items-center gap-3">
                  <RefreshCw className="w-5 h-5 text-purple-400 animate-spin" />
                  <span className="text-white font-medium">Refreshing Preview...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Code className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No Preview Available</h3>
            <p className="text-gray-400 text-sm mb-4">
              Start coding to see a live preview of your work. Supports HTML, CSS, JavaScript, and React components.
            </p>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                <Globe className="w-3 h-3 mr-1" />
                HTML/CSS
              </Badge>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                <Zap className="w-3 h-3 mr-1" />
                React/JS
              </Badge>
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="relative p-2 border-t border-purple-500/10 bg-black/10 backdrop-blur-xl flex-shrink-0">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4 text-purple-300/70">
            <span>Language: {language.toUpperCase()}</span>
            <span>•</span>
            <span>Mode: {previewMode}</span>
            {previewMode !== "desktop" && (
              <>
                <span>•</span>
                <span>{previewMode === "mobile" ? "375×667" : "768×1024"}</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300/80">Live</span>
          </div>
        </div>
      </div>
    </div>
  )
}
