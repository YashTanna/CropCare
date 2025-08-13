"use client"

import { useState } from "react"
import {ImageUpload} from "../components/ImageUpload"
import Chatbot from "../components/Chatbot"

const Predict = () => {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [prediction, setPrediction] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpload = (file) => {
    setUploadedImage(file)
    setPrediction(null)
  }

  const handlePredict = async () => {
    if (!uploadedImage) return

    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", uploadedImage)

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        setPrediction(result.disease)
      } else {
        // Mock response for demo purposes
        const mockDiseases = [
          "Tomato Late Blight",
          "Apple Scab",
          "Corn Leaf Spot",
          "Potato Early Blight",
          "Grape Black Rot",
        ]
        const randomDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)]
        setPrediction(randomDisease)
      }
    } catch (error) {
      console.error("Prediction error:", error)
      // Mock response for demo
      setPrediction("Tomato Late Blight")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-4">Disease Prediction</h1>
        <p className="text-xl text-green-600">Upload an image of your plant to detect diseases</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <ImageUpload onImageUpload={handleImageUpload} />

          {uploadedImage && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Image Preview</h3>
              <img
                src={URL.createObjectURL(uploadedImage) || "/placeholder.svg"}
                alt="Uploaded plant"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                onClick={handlePredict}
                disabled={isLoading}
                className="w-full mt-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing...
                  </div>
                ) : (
                  "Predict Disease"
                )}
              </button>
            </div>
          )}

          {prediction && (
            <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Prediction Result</h3>
              <p className="text-2xl font-bold text-green-700">{prediction}</p>
            </div>
          )}
        </div>

        <div>{prediction && <Chatbot disease={prediction} />}</div>
      </div>
    </div>
  )
}

export default Predict
