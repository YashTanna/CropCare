"use client"

import { useState, useEffect } from "react"

const Chatbot = ({ disease }) => {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (disease) {
      fetchDiseaseInfo(disease)
    }
  }, [disease])

  const fetchDiseaseInfo = async (diseaseName) => {
    setIsLoading(true)

    // Add user message
    const userMessage = {
      type: "user",
      content: `What is the solution for ${diseaseName}?`,
      timestamp: new Date().toLocaleTimeString(),
    }

    setMessages([userMessage])

    try {
      const response = await fetch(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(diseaseName)}`,
      )

      if (response.ok) {
        const data = await response.json()
        const botMessage = {
          type: "bot",
          content: formatDiseaseResponse(data.extract, diseaseName),
          timestamp: new Date().toLocaleTimeString(),
        }
        setMessages([userMessage, botMessage])
      } else {
        throw new Error("Wikipedia API failed")
      }
    } catch (error) {
      console.error("Error fetching disease info:", error)
      const fallbackMessage = {
        type: "bot",
        content: getFallbackTreatment(diseaseName),
        timestamp: new Date().toLocaleTimeString(),
      }
      setMessages([userMessage, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const formatDiseaseResponse = (extract, diseaseName) => {
    const treatments = {
      "Tomato Late Blight":
        "Apply copper-based fungicides, improve air circulation, avoid overhead watering, and remove infected plants.",
      "Apple Scab":
        "Use fungicide sprays during spring, rake and dispose of fallen leaves, prune for better air circulation.",
      "Corn Leaf Spot":
        "Rotate crops, use resistant varieties, apply fungicides if severe, and maintain proper plant spacing.",
      "Potato Early Blight":
        "Use certified disease-free seeds, apply fungicides preventively, and ensure proper crop rotation.",
      "Grape Black Rot":
        "Prune for air circulation, apply fungicides during growing season, and remove infected berries.",
    }

    const treatment =
      treatments[diseaseName] || "Consult with a local agricultural expert for specific treatment recommendations."

    return `${extract || `${diseaseName} is a plant disease that affects crop health and yield.`}\n\n**Treatment Recommendations:**\n${treatment}\n\n**General Prevention Tips:**\n• Maintain proper plant spacing for air circulation\n• Water at soil level to avoid wetting leaves\n• Remove and dispose of infected plant material\n• Use disease-resistant plant varieties when available`
  }

  const getFallbackTreatment = (diseaseName) => {
    return `I found information about ${diseaseName}. Here are general treatment recommendations:\n\n**Immediate Actions:**\n• Remove and destroy infected plant parts\n• Improve air circulation around plants\n• Avoid overhead watering\n• Apply appropriate fungicides if available\n\n**Prevention:**\n• Use disease-resistant varieties\n• Practice crop rotation\n• Maintain proper plant spacing\n• Keep garden area clean of debris\n\nFor specific treatment plans, please consult with your local agricultural extension office or plant pathologist.`
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-green-100 p-6">
      <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
        <span className="text-2xl mr-2">🤖</span>
        Plant Care Assistant
      </h3>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === "user" ? "bg-green-600 text-white" : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="whitespace-pre-line">{message.content}</p>
              <p className={`text-xs mt-1 ${message.type === "user" ? "text-green-100" : "text-gray-500"}`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                Searching for treatment information...
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Chatbot
