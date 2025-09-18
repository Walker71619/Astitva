// SadMemories.js
import React, { useState, useEffect } from "react";
import "./sadmemories.css";
import SadBg from "../images/sadbg.jpg";

// 🔹 Firebase imports
import { getDatabase, ref, push, onValue } from "firebase/database";

function SadMemories() {
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [input, setInput] = useState("");

  const db = getDatabase();

  // 🔹 Load memories from Firebase
  useEffect(() => {
    const memoriesRef = ref(db, "sadMemories");
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
    const memoriesRef = ref(db, "sadMemories");
    push(memoriesRef, input.trim());
    setInput("");
    setShowForm(false);
  };

  return (
    <div
      className="sad-page"
      style={{
        backgroundImage: `url(${SadBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1 className="sad-title">Sad Memories</h1>

      {/* Button to open form */}
      <button className="open-form-btn" onClick={() => setShowForm(true)}>
        + Add Memory
      </button>

      {/* Memory Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div
            className="modal-form"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Write Your Memory</h2>
            <textarea
              placeholder="Dear Diary, today I felt..."
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
          <div key={i} className="floating-card">
            <p>{mem}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SadMemories;
