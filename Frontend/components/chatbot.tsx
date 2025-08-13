"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Send, Bot, User, Loader2 } from "lucide-react"

interface Message {
  type: "user" | "bot"
  content: string
  timestamp: Date
}

interface ChatbotProps {
  diseaseName: string
}

export function Chatbot({ diseaseName }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Auto-fetch disease information when diseaseName changes
  useEffect(() => {
    if (diseaseName) {
      fetchDiseaseInfo(diseaseName)
    }
  }, [diseaseName])

  const fetchDiseaseInfo = async (query: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`)

      if (response.ok) {
        const data = await response.json()
        const botMessage: Message = {
          type: "bot",
          content: formatDiseaseResponse(data, query),
          timestamp: new Date(),
        }
        setMessages([botMessage])
      } else {
        throw new Error("Failed to fetch information")
      }
    } catch (error) {
      const fallbackMessage: Message = {
        type: "bot",
        content: `I found information about ${query}. This appears to be a plant disease that affects leaves. Common treatments include:\n\n• Remove affected leaves immediately\n• Apply fungicide spray\n• Improve air circulation around plants\n• Avoid overhead watering\n• Monitor plants regularly for early detection\n\nFor specific treatment recommendations, consult with a local agricultural extension office or plant pathologist.`,
        timestamp: new Date(),
      }
      setMessages([fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatDiseaseResponse = (data: any, diseaseName: string) => {
    let response = `**${diseaseName}**\n\n`

    if (data.extract) {
      response += `${data.extract}\n\n`
    }

    response += `**Treatment Recommendations:**\n`
    response += `• Remove and destroy infected plant material\n`
    response += `• Apply appropriate fungicide or bactericide\n`
    response += `• Improve plant spacing for better air circulation\n`
    response += `• Water at soil level to avoid wetting leaves\n`
    response += `• Monitor plants regularly for early detection\n\n`
    response += `**Prevention Tips:**\n`
    response += `• Choose disease-resistant plant varieties\n`
    response += `• Maintain proper plant nutrition\n`
    response += `• Practice crop rotation if applicable\n`
    response += `• Keep garden tools clean and sanitized\n\n`
    response += `For specific treatment in your area, consult with local agricultural experts.`

    return response
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Fetch information for user's question
    await fetchDiseaseInfo(inputValue)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-green-800 dark:text-green-200">Treatment Assistant</h3>

      {/* Messages */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <Card className={`max-w-[80%] ${message.type === "user" ? "bg-green-600 text-white" : "bg-muted"}`}>
              <CardContent className="p-3">
                <div className="flex items-start space-x-2">
                  {message.type === "bot" ? (
                    <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                  ) : (
                    <User className="h-4 w-4 mt-1 flex-shrink-0" />
                  )}
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <Card className="bg-muted">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2">
                  <Bot className="h-4 w-4" />
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Searching for information...</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex space-x-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about treatments, prevention, or other plant diseases..."
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
          size="icon"
          className="bg-green-600 hover:bg-green-700"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
