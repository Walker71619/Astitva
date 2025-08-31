import React, { useState } from "react";
import "./MirrorAi.css";
import Mirror from "../images/Mirror2.png";
import Bg2 from "../images/Castle2.jpeg";

const MirrorAI = () => {
  const [eventName, setEventName] = useState("");
  const [emotion, setEmotion] = useState(50);
  const [notes, setNotes] = useState("");
  const [aiReflection, setAiReflection] = useState("");
  const [expanded, setExpanded] = useState(false); // controls form + reflection

  const handleReflect = () => {
    const prophecy =
      "🌌 The mirror whispers: Even stardust carries memory. Your essence shines brighter with every storm you endure — you are a constellation in the making.";
    setAiReflection(prophecy);
    setExpanded(true);
  };

  const staticMemories = [
    { id: 1, event: "Defeated the shadow of doubt", emotion: "🌑", notes: "The mirror hummed with courage." },
    { id: 2, event: "Shared wisdom with a companion", emotion: "🌟", notes: "The runes glowed brighter." },
  ];

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

        {/* Mirror Form appears only when clicked */}
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
            <button onClick={handleReflect}>Summon Reflection 🌙</button>
          </div>
        )}
      </div>

      {/* Floating Prophecy */}
      {expanded && aiReflection && (
        <div className="floating-reflection" onClick={() => setAiReflection("")}>
          <h3>🌌 Astral Prophecy</h3>
          <p>{aiReflection}</p>
        </div>
      )}

      {/* Memory Orbs */}
      <div className="memories-section">
        <h2>🪄 Archived Orbs of Memory</h2>
        <ul>
          {staticMemories.map((m) => (
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