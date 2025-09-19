// HappyMemories.js
import React, { useState, useEffect } from "react";
import "./happymemories.css";
import HappyBg from "../images/happybg.jpg";

// 🔹 Firestore imports
import { collection, addDoc, onSnapshot } from "firebase/firestore";
import { database } from "../firebase"; 

function HappyMemories() {
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [input, setInput] = useState("");

  // 🔹 Load memories from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(database, "happyMemories"), (snapshot) => {
      const loadedMemories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMemories(loadedMemories);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Add new memory to Firestore
  const addMemory = async () => {
    if (input.trim() === "") return;

    await addDoc(collection(database, "happyMemories"), {
      text: input.trim(),
      createdAt: new Date(),
    });

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
            onClick={(e) => e.stopPropagation()} 
          >
            <h2>Write Your Happy Moment</h2>
            <textarea
              placeholder="Dear Diary, today I felt so happy because..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-textarea"
            />
            <button className="add-btn" onClick={addMemory}>
              Add Memory
            </button>
          </div>
        </div>
      )}

      {/* Floating Cards */}
      <div className="memory-container">
        {memories.map((mem) => (
          <div key={mem.id} className="floating-card happy-card">
            <p>{mem.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HappyMemories;
