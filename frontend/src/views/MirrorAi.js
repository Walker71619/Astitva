// src/pages/MirrorAI.jsx
import React, { useState, useEffect } from "react";
import "./MirrorAi.css";
import Mirror from "../images/Mirror2.png";
import Bg2 from "../images/Castle2.jpeg";

import { database } from "../firebase";
import { collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Import Navbar and Footer
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const MirrorAI = () => {
  const [eventName, setEventName] = useState("");
  const [emotion, setEmotion] = useState(50);
  const [notes, setNotes] = useState("");
  const [aiReflection, setAiReflection] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [memories, setMemories] = useState([]);

  const auth = getAuth();
  const user = auth.currentUser;

  // ==================== Emotion reflections with contextual situations ====================
  const emotionReflections = {
    happy: {
      celebration: [
        "🌟 Your joy is a beacon; celebrate your achievements, big or small! 🌟",
        "🎉 Happiness shared grows stronger; spread this good energy around. 🎉",
        "💫 Cherish this moment; your excitement shows your passion for life. 💫"
      ],
      love: [
        "❤️ Your happiness in love radiates warmth. Nurture the bonds that matter. ❤️",
        "💌 Share your feelings openly; joy multiplies when expressed sincerely. 💌",
        "💞 Happiness in relationships is a reflection of understanding and trust. 💞"
      ],
      general: [
        "🌈 Every smile is a seed of hope. Keep shining brightly. 🌈",
        "✨ Moments of joy are gifts; savor them fully. ✨",
        "💫 Let your positivity guide your day and inspire those around you. 💫"
      ]
    },
    sad: {
      relationship: [
        "💔 You hurt someone or felt betrayed? Reflect, apologize, and grow emotionally. 💔",
        "😢 Heartache is painful, but understanding it deepens your empathy. 😢",
        "🕊️ Sadness in love teaches patience and self-awareness. 🕊️"
      ],
      mistake: [
        "🕯️ Mistakes are lessons in disguise; learn and forgive yourself. 🕯️",
        "🌱 Every error is an opportunity to grow wiser. 🌱",
        "⚡ Reflect on your actions, take responsibility, and improve. ⚡"
      ],
      loss: [
        "🌧️ Grieving is natural; allow yourself to process and heal. 🌧️",
        "🕊️ Loss creates space for reflection and future resilience. 🕊️",
        "💫 Memories of what you lost can guide your growth positively. 💫"
      ],
      general: [
        "🌧️ Feeling down is okay; let it guide you toward self-awareness. 🌧️",
        "🕊️ Even in sadness, you are evolving quietly. 🕊️",
        "🌱 Every emotional low carries the seed of future strength. 🌱"
      ]
    },
    angry: {
      conflict: [
        "🔥 Channel your anger into constructive actions; avoid hurting others. 🔥",
        "⚡ Pause, breathe, and assess the situation before reacting. ⚡",
        "🛤️ Anger is a signal; listen, reflect, and respond calmly. 🛤️"
      ],
      frustration: [
        "💫 Frustration highlights what matters; take small steps forward. 💫",
        "🕊️ Clear your mind and tackle the issue logically. 🕊️",
        "🌱 Every challenge is an opportunity for growth. 🌱"
      ],
      general: [
        "🔥 Anger is natural; redirect it toward personal improvement. 🔥",
        "⚡ Let calmness guide your next step instead of frustration. ⚡"
      ]
    },
    jealous: {
      envy: [
        "🌿 Comparison steals joy; focus on your own journey. 🌿",
        "💎 Admire others without envy; learn from their success. 💎",
        "🌌 Growth comes when you channel envy into self-improvement. 🌌"
      ],
      relationship: [
        "❤️ Trust and communication reduce jealousy; reflect on your insecurities. ❤️",
        "🕊️ Possessiveness harms connection; nurture freedom and understanding. 🕊️"
      ],
      general: [
        "🌿 Reflect on your achievements; appreciate your own progress. 🌿",
        "💫 Growth comes from learning, not comparing. 💫"
      ]
    },
    fearful: {
      unknown: [
        "🌞 Face your fears gradually; courage grows with practice. 🌞",
        "🛤️ Every small step you take diminishes fear. 🛤️",
        "💫 Trust yourself; the unknown is where growth happens. 💫"
      ],
      loss: [
        "🌱 Fear of loss teaches attachment awareness; cherish but don’t cling. 🌱",
        "🕊️ Accept impermanence and grow emotionally stronger. 🕊️"
      ],
      general: [
        "🌞 Fear is a guide; it shows where you can improve. 🌞",
        "💫 Trust your abilities and face challenges with calm. 💫"
      ]
    },
    anxious: {
      workload: [
        "🌿 Take things one step at a time; clarity comes with focus. 🌿",
        "🕊️ Prioritize what you can control; let go of the rest. 🕊️"
      ],
      social: [
        "🌈 Social anxiety is natural; be kind to yourself and engage gradually. 🌈",
        "💫 Observe your surroundings calmly; you are more capable than you think. 💫"
      ],
      general: [
        "🌿 Breathe deeply; presence reduces anxiety. 🌿",
        "🕊️ Patience turns anxiety into learning opportunities. 🕊️"
      ]
    },
    neutral: {
      general: [
        "✨ Observe yourself and your environment; growth happens quietly. ✨",
        "💫 Calm moments are fertile for reflection and creativity. 💫",
        "🌌 Balance and perspective guide your next steps. 🌌"
      ]
    }
  };

  // ==================== Emotion detection ====================
  const detectEmotion = (title) => {
    const t = title.toLowerCase();
    if (t.includes("happy") || t.includes("joy") || t.includes("excited")) return "happy";
    if (t.includes("sad") || t.includes("lonely") || t.includes("down")) return "sad";
    if (t.includes("angry") || t.includes("frustrated") || t.includes("mad")) return "angry";
    if (t.includes("jealous") || t.includes("envy") || t.includes("envious")) return "jealous";
    if (t.includes("possessive") || t.includes("control") || t.includes("clingy")) return "jealous";
    if (t.includes("fear") || t.includes("scared") || t.includes("afraid")) return "fearful";
    if (t.includes("anxious") || t.includes("worried") || t.includes("nervous")) return "anxious";
    return "neutral";
  };

  // ==================== Context detection ====================
  const detectContext = (text, emotion) => {
    const t = text.toLowerCase();
    if (emotion === "sad") {
      if (t.includes("cheat") || t.includes("betray") || t.includes("relationship")) return "relationship";
      if (t.includes("mistake") || t.includes("regret")) return "mistake";
      if (t.includes("lost") || t.includes("death") || t.includes("fail")) return "loss";
    }
    if (emotion === "angry") {
      if (t.includes("fight") || t.includes("argue") || t.includes("conflict")) return "conflict";
      if (t.includes("frustrated") || t.includes("stuck") || t.includes("blocked")) return "frustration";
    }
    if (emotion === "jealous") {
      if (t.includes("envy") || t.includes("comparison") || t.includes("insecure")) return "envy";
      if (t.includes("relationship")) return "relationship";
    }
    if (emotion === "fearful") {
      if (t.includes("lost") || t.includes("fail") || t.includes("unknown")) return "loss";
      return "unknown";
    }
    if (emotion === "anxious") {
      if (t.includes("work") || t.includes("deadline") || t.includes("exam")) return "workload";
      if (t.includes("social") || t.includes("people") || t.includes("talk")) return "social";
    }
    return "general";
  };

  // ==================== Get reflection ====================
  const getEmotionReflection = (title, notes) => {
    const emotion = detectEmotion(title);
    const context = detectContext(`${title} ${notes}`, emotion);
    const reflections = emotionReflections[emotion]?.[context] || emotionReflections[emotion]?.general;
    const index = Math.floor(Math.random() * reflections.length);
    return reflections[index];
  };

  // ==================== Fetch memories for current user ====================
  useEffect(() => {
    if (!user) return;

    const memoriesCollection = collection(database, "memories");
    const q = query(memoriesCollection, orderBy("timestamp", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const formatted = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((m) => m.uid === user.uid);
      setMemories(formatted);
    });

    return () => unsubscribe();
  }, [user]);

  // ==================== Handle reflection ====================
  const handleReflect = async () => {
    if (!eventName || !notes) {
      alert("Please fill all fields!");
      return;
    }

    if (!user) {
      alert("You must be logged in to use the mirror.");
      return;
    }

    const newMemory = {
      event: eventName,
      emotion: `⚡ ${emotion}`,
      notes,
      timestamp: Date.now(),
      uid: user.uid
    };

    // Optimistic update
    setMemories((prev) => [...prev, { ...newMemory, id: Date.now() }]);

    try {
      await addDoc(collection(database, "memories"), newMemory);
    } catch (err) {
      console.error("Error adding memory:", err);
    }

    // Show loading and reflection
    setExpanded(true);
    setLoading(true);
    setAiReflection("");

    setTimeout(() => {
      const reflection = getEmotionReflection(eventName, notes);
      setAiReflection(reflection);
      setLoading(false);
    }, 500);

    setEventName("");
    setNotes("");
    setEmotion(50);
  };

  return (
    <>
      <Navbar />
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
      <Footer />
    </>
  );
};

export default MirrorAI;
