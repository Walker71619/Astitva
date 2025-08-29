import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./views/HomePage";
import KarmicAI from "./views/KarmicAI";
import DharmaScheduler from "./views/DharmaScheduler";
import LifeModeSelector from "./views/LifeModeSelector";



function App() {
  return (
    <Router>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />

        {/* Karmic AI */}
        <Route path="/karmic-ai" element={<KarmicAI />} />

        {/* Dharma Scheduler */}
        <Route path="/dharma-scheduler" element={<DharmaScheduler />} />

        {/* Life Mode Selector */}
        <Route path="/life-mode" element={<LifeModeSelector />} />

      </Routes>
    </Router>
  );
}

export default App;