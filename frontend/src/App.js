import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./views/HomePage";
import KarmicAI from "./views/KarmicAI";
import DharmaScheduler from "./views/DharmaScheduler";
import LifeModeSelector from "./views/LifeModeSelector";
import LifeBlueprint from "./views/lifeblueprint";
import SadMemories from "./views/sadmemories";
import HappyMemories from "./views/happymemories";
import AchievementMemories from "./views/achievementmemories";
import GoalsPage from "./views/GoalsPage"; 
import MirrorAi from "./views/MirrorAi";
import Dashboard from "./components/Dashboard";
import Auth from "./components/Auth";

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

        {/* Life Blueprint & Memories */}
        <Route path="/life-blueprint" element={<LifeBlueprint />} />
        <Route path="/sad-memories" element={<SadMemories />} />
        <Route path="/happy-memories" element={<HappyMemories />} />
        <Route path="/achievement-memories" element={<AchievementMemories />} />

        {/* Mirror AI */}
        <Route path="/mirror-ai" element={<MirrorAi />} />

        {/* Goals Page */}
        <Route path="/goals" element={<GoalsPage />} />

        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/auth" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;
