import { BrowserRouter, Route, Routes } from "react-router-dom";
// import "./global.css";
import "./index.css";
import About from "./pages/About";
import Home from "./pages/Home";
import Predict from "./pages/Predict";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/predict" element={<Predict />} />
      </Routes>
    </BrowserRouter>
  );
}
