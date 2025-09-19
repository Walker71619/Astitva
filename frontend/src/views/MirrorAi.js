import React, { useState, useEffect } from "react";
import "./MirrorAi.css";
import Mirror from "../images/Mirror2.png";
import Bg2 from "../images/Castle2.jpeg";
import { database } from "../firebase"; // Firestore instance
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

const MirrorAI = () => {
  const [eventName, setEventName] = useState("");
  const [emotion, setEmotion] = useState(50);
  const [notes, setNotes] = useState("");
  const [aiReflection, setAiReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [memories, setMemories] = useState([]);

  // 🔹 Emotion-based reflections mapping (more personal, longer)
  const emotionReflections = {
    happy: [
      "🌟 Your happiness is contagious; the joy you radiate brightens everyone’s day around you. Keep shining! 🌟",
      "🌈 Cherish this moment of happiness—it is a reflection of all your effort and love for life. 🌈",
      "💫 Smiles like yours are rare and powerful. Let it guide you to even greater joy. 💫"
    ],
    sad: [
      "🌧️ It’s okay to feel sadness; each tear waters the seeds of your future growth. 🌧️",
      "🕊️ Let your heart feel what it needs, for embracing sadness leads to deeper strength. 🕊️",
      "🌱 Even in sorrow, you are learning and evolving. Every storm clears the path ahead. 🌱"
    ],
    angry: [
      "🔥 Channel your anger into something creative—it can become your fuel, not your cage. 🔥",
      "⚡ Pause, breathe, and release what you cannot change. Anger need not control you. ⚡",
      "🛤️ Your clarity is stronger than your frustration. Let calm guide your next step. 🛤️"
    ],
    jealous: [
      "🌿 Comparison steals joy. Focus on your growth; your journey is uniquely yours. 🌿",
      "💎 Admire, don’t envy. The world’s beauty doesn’t diminish your own. 💎",
      "🌌 Celebrate others’ achievements—they can inspire rather than overshadow you. 🌌"
    ],
    possessive: [
      "⚓ Trust deepens bonds. Let go of control and allow love to flow naturally. ⚓",
      "🌊 Possessiveness blocks connection. Freedom strengthens both hearts. 🌊",
      "🕊️ Release fear of losing and embrace the present moment with love. 🕊️"
    ],
    fearful: [
      "🌞 Courage grows when you face fear, even in small steps. 🌞",
      "🛤️ Each brave act, however small, diminishes fear and builds strength. 🛤️",
      "💫 You are stronger than your fears. Trust yourself to navigate the unknown. 💫"
    ],
    anxious: [
      "🌿 Breathe deeply; clarity comes when the mind is calm. 🌿",
      "🕊️ Focus on what you can control; let the rest flow naturally. 🕊️",
      "🌈 Patience and presence turn anxiety into wisdom. 🌈"
    ],
    neutral: [
      "✨ Observe your surroundings and yourself—reflection reveals your next step. ✨",
      "💫 Even in calm moments, growth is quietly happening. 💫",
      "🌌 Balance is a journey, not a destination. Take your time to feel it. 🌌"
    ]
  };

  // 🔹 Detect emotion from event title
  const detectEmotion = (title) => {
    const t = title.toLowerCase();
    if (t.includes("happy") || t.includes("joy") || t.includes("excited")) return "happy";
    if (t.includes("sad") || t.includes("lonely") || t.includes("down")) return "sad";
    if (t.includes("angry") || t.includes("frustrated") || t.includes("mad")) return "angry";
    if (t.includes("jealous") || t.includes("envy") || t.includes("envious")) return "jealous";
    if (t.includes("possessive") || t.includes("control") || t.includes("clingy")) return "possessive";
    if (t.includes("fear") || t.includes("scared") || t.includes("afraid")) return "fearful";
    if (t.includes("anxious") || t.includes("worried") || t.includes("nervous")) return "anxious";
    return "neutral";
  };

  // 🔹 Get context-aware reflection
  const getEmotionReflection = (title) => {
    const emotionCategory = detectEmotion(title);
    const reflections = emotionReflections[emotionCategory];
    const index = Math.floor(Math.random() * reflections.length);
    return reflections[index];
  };

  // Fetch memories from Firestore in real-time
  useEffect(() => {
    const memoriesCollection = collection(database, "memories");
    const q = query(memoriesCollection, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const formatted = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMemories(formatted);
    });

    return () => unsubscribe(); // cleanup listener
  }, []);

  // Handle reflection + save to Firestore
  const handleReflect = async () => {
    if (!eventName || !notes) {
      alert("Please fill all fields!");
      return;
    }

    const newMemory = {
      event: eventName,
      emotion: `⚡ ${emotion}`,
      notes,
      timestamp: Date.now(),
    };

    // Optimistic update
    setMemories((prev) => [...prev, { ...newMemory, id: Date.now() }]);

    try {
      await addDoc(collection(database, "memories"), newMemory);
    } catch (err) {
      console.error("Error adding memory:", err);
    }

    // Show loading while reflection "summons"
    setExpanded(true);
    setLoading(true);
    setAiReflection("");

    setTimeout(() => {
      const reflection = getEmotionReflection(eventName);
      setAiReflection(reflection);
      setLoading(false);
    }, 1000); // slightly longer delay for realism

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
