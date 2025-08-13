import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import Predict from "./pages/Predict"
import About from "./pages/About"

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
        <nav className="bg-white shadow-sm border-b border-green-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-green-700">🌱 PlantCare AI</span>
              </div>
              <div className="flex space-x-8">
                <a href="/" className="text-green-600 hover:text-green-800 font-medium">
                  Home
                </a>
                <a href="/predict" className="text-green-600 hover:text-green-800 font-medium">
                  Predict
                </a>
                <a href="/about" className="text-green-600 hover:text-green-800 font-medium">
                  About
                </a>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predict />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
