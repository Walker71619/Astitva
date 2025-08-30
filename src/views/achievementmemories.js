import React, { useState, useEffect } from "react";
import "./achievementmemories.css";
import AchievementBg from "../images/achievementbg.jpg";

function AchievementMemories() {
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [input, setInput] = useState("");

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("achievementMemories");
    if (saved) setMemories(JSON.parse(saved));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("achievementMemories", JSON.stringify(memories));
  }, [memories]);

  const addMemory = () => {
    if (input.trim() === "") return;
    setMemories([...memories, input]);
    setInput("");
    setShowForm(false);
  };

  return (
    <div className="achievement-page"
    style={{
       backgroundImage: `url(${AchievementBg})`,
       backgroundSize: "cover",
       backgroundPosition: "center"
     }}>
      <h1 className="achievement-title"> Achievements</h1>

      {/* Button to open form */}
      <button className="open-form-btn" onClick={() => setShowForm(true)}>
        + Add Achievement
      </button>

      {/* Fantasy Diary Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div
            className="modal-form achievement-form"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Celebrate Your Achievement </h2>
            <textarea
              placeholder="Today I achieved..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="add-btn" onClick={addMemory}>
              Add Achievement
            </button>
          </div>
        </div>
      )}

      {/* Floating Cards */}
      <div className="memory-container">
        {memories.map((mem, i) => (
          <div key={i} className="floating-card achievement-card">
            <p>{mem}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AchievementMemories;
