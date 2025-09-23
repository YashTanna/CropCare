// src/App.jsx
import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Predict from "./pages/Predict"
import "./index.css"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/predict" element={<Predict />} />
    </Routes>
  )
}
