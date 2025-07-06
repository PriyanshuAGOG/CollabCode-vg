"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, ChevronLeft, ChevronRight, Sparkles, Check } from "lucide-react"

interface ProjectConfig {
  name: string
  description: string
  framework: string
  features: string[]
  template: string
}

interface ProjectSetupWizardProps {
  onClose: () => void
  onCreate: (config: ProjectConfig) => void
}

export function ProjectSetupWizard({ onClose, onCreate }: ProjectSetupWizardProps) {
  const [step, setStep] = useState(1)
  const [config, setConfig] = useState<ProjectConfig>({
    name: "",
    description: "",
    framework: "",
    features: [],
    template: "",
  })
  const [aiSuggestion, setAiSuggestion] = useState("")

  const steps = [
    { number: 1, title: "Project Details", description: "Basic information" },
    { number: 2, title: "Framework", description: "Choose your tech stack" },
    { number: 3, title: "Features", description: "Select features" },
    { number: 4, title: "Template", description: "Pick a starter" },
    { number: 5, title: "Review", description: "Confirm settings" },
  ]

  const frameworks = [
    { name: "React", description: "Popular JavaScript library", icon: "⚛️" },
    { name: "Vue.js", description: "Progressive framework", icon: "💚" },
    { name: "Angular", description: "Full-featured framework", icon: "🅰️" },
    { name: "Next.js", description: "React with SSR", icon: "▲" },
    { name: "Svelte", description: "Compile-time framework", icon: "🧡" },
    { name: "Node.js", description: "Backend JavaScript", icon: "💚" },
  ]

  const features = [
    "Authentication",
    "Database Integration",
    "Real-time Updates",
    "File Upload",
    "Payment Processing",
    "Email Notifications",
    "Search Functionality",
    "Analytics",
    "Dark Mode",
    "Responsive Design",
  ]

  const templates = [
    { name: "Blank Project", description: "Start from scratch", type: "basic" },
    { name: "Dashboard", description: "Admin dashboard template", type: "web" },
    { name: "E-commerce", description: "Online store template", type: "web" },
    { name: "Blog", description: "Content management", type: "web" },
    { name: "Portfolio", description: "Personal website", type: "web" },
    { name: "API Server", description: "Backend API template", type: "backend" },
  ]

  const generateAISuggestion = () => {
    if (step === 2 && config.name) {
      setAiSuggestion(`For "${config.name}", I recommend React with Next.js for better SEO and performance.`)
    } else if (step === 3 && config.framework) {
      setAiSuggestion(
        `With ${config.framework}, consider adding Authentication and Database Integration for a complete app.`,
      )
    } else if (step === 4 && config.features.length > 0) {
      setAiSuggestion(`Based on your features, the Dashboard template would be a great starting point.`)
    }
  }

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
      generateAISuggestion()
    } else {
      onCreate(config)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const toggleFeature = (feature: string) => {
    setConfig((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }))
  }

  const isStepValid = () => {
    switch (step) {
      case 1:
        return config.name.trim() !== ""
      case 2:
        return config.framework !== ""
      case 3:
        return true // Features are optional
      case 4:
        return config.template !== ""
      case 5:
        return true
      default:
        return false
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl bg-gray-900 border-gray-700 max-h-[90vh] overflow-auto">
        <CardHeader className="border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-[#00D1FF]" />
                AI-Powered Project Setup
              </CardTitle>
              <p className="text-gray-400 mt-1">Let's create your next amazing project</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mt-6">
            {steps.map((s, index) => (
              <div key={s.number} className="flex items-center">
                <div className={`flex items-center gap-3 ${index < steps.length - 1 ? "flex-1" : ""}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step >= s.number ? "bg-[#00D1FF] text-black" : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {step > s.number ? <Check className="w-4 h-4" /> : s.number}
                  </div>
                  <div className="hidden md:block">
                    <p className={`text-sm font-medium ${step >= s.number ? "text-white" : "text-gray-400"}`}>
                      {s.title}
                    </p>
                    <p className="text-xs text-gray-500">{s.description}</p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden md:block w-12 h-px mx-4 ${step > s.number ? "bg-[#00D1FF]" : "bg-gray-700"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Step 1: Project Details */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Project Details</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Project Name *</label>
                    <Input
                      value={config.name}
                      onChange={(e) => setConfig((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="My Awesome Project"
                      className="bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Description</label>
                    <textarea
                      value={config.description}
                      onChange={(e) => setConfig((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your project..."
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Framework */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Choose Framework</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {frameworks.map((framework) => (
                    <Card
                      key={framework.name}
                      className={`cursor-pointer transition-all duration-200 ${
                        config.framework === framework.name
                          ? "bg-[#00D1FF]/10 border-[#00D1FF]"
                          : "bg-gray-800 border-gray-600 hover:border-gray-500"
                      }`}
                      onClick={() => setConfig((prev) => ({ ...prev, framework: framework.name }))}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{framework.icon}</span>
                          <div>
                            <h4 className="font-semibold text-white">{framework.name}</h4>
                            <p className="text-sm text-gray-400">{framework.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Features */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Select Features</h3>
                <p className="text-gray-400 mb-4">Choose the features you want to include in your project</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {features.map((feature) => (
                    <Badge
                      key={feature}
                      variant="outline"
                      className={`cursor-pointer p-3 text-center transition-all duration-200 ${
                        config.features.includes(feature)
                          ? "bg-[#00D1FF]/10 border-[#00D1FF] text-[#00D1FF]"
                          : "border-gray-600 text-gray-400 hover:border-gray-500"
                      }`}
                      onClick={() => toggleFeature(feature)}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Template */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Choose Template</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {templates.map((template) => (
                    <Card
                      key={template.name}
                      className={`cursor-pointer transition-all duration-200 ${
                        config.template === template.name
                          ? "bg-[#00D1FF]/10 border-[#00D1FF]"
                          : "bg-gray-800 border-gray-600 hover:border-gray-500"
                      }`}
                      onClick={() => setConfig((prev) => ({ ...prev, template: template.name }))}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-white mb-2">{template.name}</h4>
                        <p className="text-sm text-gray-400">{template.description}</p>
                        <Badge variant="outline" className="mt-2 border-gray-600 text-gray-400">
                          {template.type}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Review */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Review & Create</h3>
                <div className="space-y-4">
                  <div className="bg-gray-800 rounded-lg p-4">
                    <h4 className="font-semibold text-white mb-2">Project Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{config.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Framework:</span>
                        <span className="text-white">{config.framework}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Template:</span>
                        <span className="text-white">{config.template}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Features:</span>
                        <span className="text-white">{config.features.length} selected</span>
                      </div>
                    </div>
                  </div>
                  {config.description && (
                    <div className="bg-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold text-white mb-2">Description</h4>
                      <p className="text-gray-300 text-sm">{config.description}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* AI Suggestion */}
          {aiSuggestion && (
            <div className="mt-6 p-4 bg-[#00D1FF]/10 border border-[#00D1FF]/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#00D1FF] mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#00D1FF] mb-1">AI Suggestion</h4>
                  <p className="text-gray-300 text-sm">{aiSuggestion}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1}
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-400">
                Step {step} of {steps.length}
              </p>
            </div>

            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="bg-[#00D1FF] hover:bg-[#00B8E6] text-black"
            >
              {step === 5 ? "Create Project" : "Next"}
              {step < 5 && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
