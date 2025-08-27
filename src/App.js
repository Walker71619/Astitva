import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/home";
import KarmicAI from "./views/KarmicAI"; 
import DharmaScheduler from "./views/DharmaScheduler";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/karmic-ai" element={<KarmicAI />} />
        <Route path="/dharma-scheduler" element={<DharmaScheduler />} />
      </Routes>
    </Router>
  );
}
