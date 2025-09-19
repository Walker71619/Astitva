// AchievementMemories.js
import React, { useState, useEffect } from "react";
import "./achievementmemories.css";
import AchievementBg from "../images/achievementbg.jpg";

// 🔹 Firestore imports
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { database } from "../firebase"; // ✅ use database instead of db

function AchievementMemories() {
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [input, setInput] = useState("");

  // 🔹 Load achievements from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(database, "achievementMemories"), (snapshot) => {
      setMemories(snapshot.docs.map((doc) => doc.data().text));
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Add new achievement to Firestore
  const addMemory = async () => {
    if (input.trim() === "") return;
    await addDoc(collection(database, "achievementMemories"), { text: input.trim() });
    setInput("");
    setShowForm(false);
  };

  return (
    <div
      className="achievement-page"
      style={{
        backgroundImage: `url(${AchievementBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="achievement-title">Achievements</h1>

      {/* Button to open form */}
      <button className="open-form-btn" onClick={() => setShowForm(true)}>
        + Add Achievement
      </button>

      {/* Achievement Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div
            className="modal-form achievement-form"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Celebrate Your Achievement</h2>
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
