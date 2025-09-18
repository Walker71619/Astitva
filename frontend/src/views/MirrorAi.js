import React, { useState, useEffect } from "react";
import "./MirrorAi.css";
import Mirror from "../images/Mirror2.png";
import Bg2 from "../images/Castle2.jpeg";
import { database } from "../firebase";
import { ref, push, onValue } from "firebase/database";

const MirrorAI = () => {
  const [eventName, setEventName] = useState("");
  const [emotion, setEmotion] = useState(50);
  const [notes, setNotes] = useState("");
  const [aiReflection, setAiReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [memories, setMemories] = useState([]);

  // Fetch memories from Firebase
  useEffect(() => {
    const memoriesRef = ref(database, "memories");
    onValue(memoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMemories(formatted);
      } else {
        setMemories([]);
      }
    });
  }, []);

  // Call backend AI
  const getAIReflection = async (userMemory) => {
    try {
      const response = await fetch("https://astitva-backend.onrender.com/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Here is the user's memory: ${JSON.stringify(
            userMemory
          )}. Give a motivational, reflective response.`,
        }),
      });
      const data = await response.json();
      return data.reply;
    } catch (err) {
      console.error(err);
      return "The mirror is silent… try again later.";
    }
  };

  // Handle reflection + save
  const handleReflect = async () => {
    if (!eventName || !notes) {
      alert("Please fill all fields!");
      return;
    }

    const newMemory = {
      event: eventName,
      emotion: `⚡ ${emotion}`,
      notes: notes,
    };

    // Optimistic update
    setMemories((prev) => [...prev, { ...newMemory, id: Date.now() }]);
    const memoriesRef = ref(database, "memories");
    push(memoriesRef, newMemory);

    // Show loading while AI responds
    setExpanded(true);
    setLoading(true);
    setAiReflection("");

    const reflection = await getAIReflection(newMemory);
    setAiReflection(reflection);
    setLoading(false);

    // Reset form
    setEventName("");
    setNotes("");
    setEmotion(50);
  };

  return (
    <div className="mirror-page" style={{ backgroundImage: `url(${Bg2})` }}>
      {/* Fireflies */}
      <div className="fireflies">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="firefly"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 12}s`,
              animationDuration: `${10 + Math.random() * 15}s`,
            }}
          ></div>
        ))}
      </div>

      {/* Enchanted Mirror */}
      <div className="mirror-container">
        <img
          src={Mirror}
          alt="Enchanted Mirror"
          className="mirror-image"
          onClick={() => setExpanded(!expanded)}
        />

        {expanded && (
          <div className="mirror-form">
            <h2 className="title-glow">✨ Enchanted Mirror of Memories ✨</h2>
            <input
              type="text"
              placeholder="Name your quest..."
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
            <label>Energy: {emotion}⚡</label>
            <input
              type="range"
              min="0"
              max="100"
              value={emotion}
              onChange={(e) => setEmotion(e.target.value)}
            />
            <textarea
              placeholder="Whisper your thoughts into the mirror..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button onClick={handleReflect} disabled={loading}>
              {loading ? "Summoning… 🌙" : "Summon Reflection 🌙"}
            </button>
          </div>
        )}
      </div>

      {/* Floating Reflection */}
      {expanded && (loading || aiReflection) && (
        <div className="floating-reflection" onClick={() => setAiReflection("")}>
          <h3>🌌 Astral Prophecy</h3>
          <p>{loading ? "✨ Summoning your reflection… ✨" : aiReflection}</p>
        </div>
      )}

      {/* Memory Orbs */}
      <div className="memories-section">
        <h2>🪄 Archived Orbs of Memory</h2>
        <ul>
          {memories.map((m) => (
            <li key={m.id} className="memory-orb">
              <strong>{m.event}</strong> {m.emotion}
              <p>{m.notes}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MirrorAI;

