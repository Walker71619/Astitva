// SadMemories.js
import React, { useState, useEffect } from "react";
import "./sadmemories.css";
import SadBg from "../images/sadbg.jpg";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { database } from "../firebase"; 

function SadMemories() {
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");

  // 🔹 Load memories from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(database, "sadMemories"), (snapshot) => {
      const loadedMemories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMemories(loadedMemories);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Save Memory
  const addMemory = async () => {
    if (!title.trim() || !text.trim()) return;

    await addDoc(collection(database, "sadMemories"), {
      title: title.trim(),
      text: text.trim(),
      createdAt: new Date(),
    });

    setTitle("");
    setText("");
    setShowForm(false);
  };

  // 🔹 Cancel Memory
  const cancelMemory = () => {
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
          <div className="modal-form" onClick={(e) => e.stopPropagation()}>
            <h2>Healing Journal</h2>
            <p>Write down your thoughts and feelings.</p>

            <input
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="form-input"
            />

            <textarea
              placeholder="Dear Diary, today I felt..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="form-textarea"
            />

            <div className="button-group">
              <button type="button" onClick={addMemory} className="save">
                Save Memory
              </button>
              <button type="button" onClick={cancelMemory} className="cancel">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Memory Cards */}
      <div className="memory-container">
        {memories.map((mem) => (
          <div key={mem.id} className="floating-card">
            <h3>{mem.title}</h3>
            <p>{mem.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SadMemories;
