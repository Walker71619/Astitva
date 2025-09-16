// HappyMemories.js
import React, { useState, useEffect } from "react";
import "./happymemories.css";
import HappyBg from "../images/happybg.jpg";

// 🔹 Firebase imports
import { getDatabase, ref, push, onValue } from "firebase/database";

function HappyMemories() {
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [input, setInput] = useState("");

  const db = getDatabase();

  // 🔹 Load memories from Firebase
  useEffect(() => {
    const memoriesRef = ref(db, "happyMemories");
    onValue(memoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setMemories(Object.values(data));
      } else {
        setMemories([]);
      }
    });
  }, [db]);

  // 🔹 Add new memory to Firebase
  const addMemory = () => {
    if (input.trim() === "") return;
    const memoriesRef = ref(db, "happyMemories");
    push(memoriesRef, input.trim());
    setInput("");
    setShowForm(false);
  };

  return (
    <div
      className="happy-page"
      style={{
        backgroundImage: `url(${HappyBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="happy-title">Happy Memories</h1>

      {/* Button to open form */}
      <button className="open-form-btn" onClick={() => setShowForm(true)}>
        + Add Memory
      </button>

      {/* Memory Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div
            className="modal-form"
            onClick={(e) => e.stopPropagation()} // stop closing on inner click
          >
            <h2>Write Your Happy Moment</h2>
            <textarea
              placeholder="Dear Diary, today I felt so happy because..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="add-btn" onClick={addMemory}>
              Add Memory
            </button>
          </div>
        </div>
      )}

      {/* Floating Cards */}
      <div className="memory-container">
        {memories.map((mem, i) => (
          <div key={i} className="floating-card happy-card">
            <p>{mem}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HappyMemories;
