"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, RotateCcw, Square, Circle, Type, Download } from "lucide-react"

export function InteractiveDemoSection() {
  const [code, setCode] = useState(`// Welcome to CollabCode!
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: input, 
        completed: false 
      }]);
      setInput('');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Todo List
      </h1>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
          className="flex-1 px-3 py-2 border rounded"
        />
        <button 
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center gap-2">
            <input type="checkbox" />
            <span>{todo.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}`)

  const [output, setOutput] = useState("")
  const [isRunning, setIsRunning] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [selectedTool, setSelectedTool] = useState<"select" | "rectangle" | "circle" | "text">("select")

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Clear canvas
      ctx.fillStyle = "#1f2937"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw grid
      ctx.strokeStyle = "#374151"
      ctx.lineWidth = 1
      for (let x = 0; x <= canvas.width; x += 20) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }
      for (let y = 0; y <= canvas.height; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw sample shapes
      ctx.fillStyle = "#00D1FF"
      ctx.fillRect(50, 50, 100, 60)

      ctx.fillStyle = "#C084FC"
      ctx.beginPath()
      ctx.arc(200, 80, 30, 0, 2 * Math.PI)
      ctx.fill()

      ctx.fillStyle = "#ffffff"
      ctx.font = "16px Inter"
      ctx.fillText("Sample Text", 50, 150)
    }
  }, [])

  const runCode = () => {
    setIsRunning(true)
    setTimeout(() => {
      setOutput(
        "✅ Todo app rendered successfully!\n📦 React components loaded\n🎨 Styles applied\n🚀 App ready for interaction",
      )
      setIsRunning(false)
    }, 1000)
  }

  const resetDemo = () => {
    setCode(`// Welcome to CollabCode!
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { 
        id: Date.now(), 
        text: input, 
        completed: false 
      }]);
      setInput('');
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Todo List
      </h1>
      <div className="flex gap-2 mb-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
          className="flex-1 px-3 py-2 border rounded"
        />
        <button 
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Add
        </button>
      </div>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center gap-2">
            <input type="checkbox" />
            <span>{todo.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}`)
    setOutput("")
  }

  const addShape = (shape: string) => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const x = Math.random() * (canvas.width - 100) + 50
    const y = Math.random() * (canvas.height - 100) + 50

    if (shape === "rectangle") {
      ctx.fillStyle = "#00D1FF"
      ctx.fillRect(x, y, 80, 50)
    } else if (shape === "circle") {
      ctx.fillStyle = "#C084FC"
      ctx.beginPath()
      ctx.arc(x, y, 25, 0, 2 * Math.PI)
      ctx.fill()
    } else if (shape === "text") {
      ctx.fillStyle = "#ffffff"
      ctx.font = "14px Inter"
      ctx.fillText("New Text", x, y)
    }
  }

  return (
    <section id="demo" className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-[#00D1FF]/10 text-[#00D1FF] border-[#00D1FF]/20">Interactive Demo</Badge>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Try CollabCode
            <br />
            <span className="bg-gradient-to-r from-[#00D1FF] to-[#C084FC] bg-clip-text text-transparent">
              right in your browser
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the power of collaborative development with our interactive demo. No signup required!
          </p>
        </div>

        <Card className="bg-gray-900/50 border-gray-700 max-w-6xl mx-auto">
          <CardContent className="p-6">
            <Tabs defaultValue="code" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                <TabsTrigger value="code" className="data-[state=active]:bg-[#00D1FF] data-[state=active]:text-black">
                  Code Editor
                </TabsTrigger>
                <TabsTrigger value="design" className="data-[state=active]:bg-[#C084FC] data-[state=active]:text-black">
                  Design Canvas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Code Editor */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Code Editor</h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={runCode}
                          disabled={isRunning}
                          className="bg-[#00D1FF] hover:bg-[#00B8E6] text-black"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          {isRunning ? "Running..." : "Run"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={resetDemo}
                          className="border-gray-600 text-white hover:bg-gray-800"
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 h-80 overflow-auto">
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-full bg-transparent text-white font-mono text-sm resize-none outline-none"
                        style={{ fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", monospace' }}
                      />
                    </div>
                  </div>

                  {/* Output */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Output</h3>
                    <div className="bg-gray-800 rounded-lg p-4 h-80 overflow-auto">
                      {output ? (
                        <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">{output}</pre>
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                          Click "Run" to see the output
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="design" className="mt-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Design Tools */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-white">Design Tools</h3>
                      <Button size="sm" variant="outline" className="border-gray-600 text-white hover:bg-gray-800">
                        <Download className="w-4 h-4 mr-1" />
                        Export
                      </Button>
                    </div>
                    <div className="flex gap-2 p-4 bg-gray-800 rounded-lg">
                      <Button
                        size="sm"
                        variant={selectedTool === "rectangle" ? "default" : "outline"}
                        onClick={() => {
                          setSelectedTool("rectangle")
                          addShape("rectangle")
                        }}
                        className={
                          selectedTool === "rectangle" ? "bg-[#00D1FF] text-black" : "border-gray-600 text-white"
                        }
                      >
                        <Square className="w-4 h-4 mr-1" />
                        Rectangle
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedTool === "circle" ? "default" : "outline"}
                        onClick={() => {
                          setSelectedTool("circle")
                          addShape("circle")
                        }}
                        className={selectedTool === "circle" ? "bg-[#C084FC] text-black" : "border-gray-600 text-white"}
                      >
                        <Circle className="w-4 h-4 mr-1" />
                        Circle
                      </Button>
                      <Button
                        size="sm"
                        variant={selectedTool === "text" ? "default" : "outline"}
                        onClick={() => {
                          setSelectedTool("text")
                          addShape("text")
                        }}
                        className={selectedTool === "text" ? "bg-[#00D1FF] text-black" : "border-gray-600 text-white"}
                      >
                        <Type className="w-4 h-4 mr-1" />
                        Text
                      </Button>
                    </div>
                    <div className="text-sm text-gray-400 p-4 bg-gray-800 rounded-lg">
                      <p className="mb-2">
                        🎨 <strong>Try the design tools:</strong>
                      </p>
                      <ul className="space-y-1 text-xs">
                        <li>• Click buttons to add shapes</li>
                        <li>• Shapes appear randomly on canvas</li>
                        <li>• Export your design when ready</li>
                        <li>• Full Figma-like tools in the app</li>
                      </ul>
                    </div>
                  </div>

                  {/* Canvas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white">Canvas</h3>
                    <div className="border-2 border-gray-700 rounded-lg overflow-hidden">
                      <canvas ref={canvasRef} width={400} height={300} className="w-full h-auto bg-gray-800" />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-6 p-4 bg-[#00D1FF]/10 border border-[#00D1FF]/20 rounded-lg">
              <p className="text-center text-[#00D1FF] font-semibold">
                🚀 Ready to build something amazing?
                <Button variant="link" className="text-[#00D1FF] p-0 ml-2 font-semibold">
                  Sign up for full access →
                </Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
