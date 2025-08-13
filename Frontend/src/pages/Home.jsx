"use client"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const navigate = useNavigate()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-8xl mb-6">🌿</div>
          <h1 className="text-5xl font-bold text-green-800 mb-6">Plant Disease Prediction</h1>
          <p className="text-xl text-green-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Upload an image of your plant and get instant AI-powered disease detection. Our advanced machine learning
            model can identify various plant diseases and provide treatment recommendations to help keep your plants
            healthy.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
            <div className="text-4xl mb-4">📸</div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Upload Image</h3>
            <p className="text-green-600">Simply drag and drop or select an image of your plant</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">AI Analysis</h3>
            <p className="text-green-600">Our AI model analyzes the image for disease detection</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-semibold text-green-800 mb-2">Get Solutions</h3>
            <p className="text-green-600">Receive treatment recommendations and care tips</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/predict")}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}

export default Home
