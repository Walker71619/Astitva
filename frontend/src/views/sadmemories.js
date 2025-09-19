// SadMemories.js
import React, { useState, useEffect } from "react";
import "./sadmemories.css";
import SadBg from "../images/sadbg.jpg";
import { getDatabase, ref, push, onValue } from "firebase/database";

function SadMemories() {
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

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

  // 🔹 Save Memory
  const addMemory = () => {
    console.log("Save clicked ✅"); // debug
    if (!title.trim() || !text.trim()) return;

    const memoriesRef = ref(db, "sadMemories");
    push(memoriesRef, { title: title.trim(), text: text.trim() });

    // Reset state
    setTitle("");
    setText("");
    setShowForm(false);
  };

  // 🔹 Cancel Memory
  const cancelMemory = () => {
    console.log("Cancel clicked ❌"); // debug
    setTitle("");
    setText("");
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

      {/* Open Form Button */}
      <button className="open-form-btn" onClick={() => setShowForm(true)}>
        + Add Memory
      </button>

      {/* Healing Style Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={cancelMemory}>
          <div
            className="modal-form"
            onClick={(e) => e.stopPropagation()} // Stop overlay click
          >
            <div className="form-card">
              <h2 className="form-header">Healing Journal</h2>
              <p className="form-subtext">
                Write down your thoughts and feelings.
              </p>

              {/* Title Input */}
              <input
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />

              {/* Text Area */}
              <textarea
                placeholder="Dear Diary, today I felt..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="form-textarea"
              />

              {/* Buttons */}
              <div className="button-group">
                <button
                  type="button"
                  onClick={addMemory}
                  className="save-btn"
                >
                  Save Memory
                </button>
                <button
                  type="button"
                  onClick={cancelMemory}
                  className="cancel-btn"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Memory Cards */}
      <div className="memory-container">
        {memories.map((mem, i) => (
          <div key={i} className="floating-card">
            <h3>{mem.title}</h3>
            <p>{mem.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SadMemories;
