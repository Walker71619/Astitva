import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./views/home";
import KarmicAI from "./views/KarmicAI";
import DharmaScheduler from "./views/DharmaScheduler";

function App() {
  return (
    <Router>
      <div>
        {/* Navigation Menu */}
        <nav style={styles.nav}>
          <Link style={styles.link} to="/">Home</Link>
          <Link style={styles.link} to="/karmic-ai">Karmic AI</Link>
          <Link style={styles.link} to="/dharma-scheduler">Dharma Scheduler</Link>
        </nav>

        {/* Routes */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/karmic-ai" element={<KarmicAI />} />
          <Route path="/dharma-scheduler" element={<DharmaScheduler />} />
        </Routes>
      </div>
    </Router>
  );
}

const styles = {
  nav: {
    display: "flex",
    gap: "20px",
    padding: "10px 20px",
    backgroundColor: "#222",
  },
  link: {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default App;
