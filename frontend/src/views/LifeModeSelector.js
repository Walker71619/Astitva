import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";
import { doc, getDoc, setDoc, arrayUnion } from "firebase/firestore";
import "./LifeModeSelector.css";

import Gate1 from "../images/gate1.png";
import Gate2 from "../images/gate2.png";
import Gate3 from "../images/gate3.png";
import CosmicBG from "../images/moon-bg.jpg";

import HealImg from "../images/heal.png";
import DisciImg from "../images/disci.png";
import DiscoImg from "../images/disco.png";

import i from "../images/i.png";
import i2 from "../images/i2.png";
import i3 from "../images/i1.png";

const gates = [
  {
    id: "heal",
    gateImg: Gate1,
    thumb: i,
    modalImg: HealImg,
    title: "Phoenix Path",
    arc: "Emotional healing arc",
    desc: "Step into the Phoenix Path and embrace the power of transformation. This journey nurtures your inner self and helps you release past wounds. Each challenge becomes an opportunity to grow and find balance."
  },
  {
    id: "disci",
    gateImg: Gate2,
    thumb: i2,
    modalImg: DisciImg,
    title: "Titan’s March",
    arc: "Warrior/discipline arc",
    desc: "The Titan’s March is a path forged in strength and discipline. It challenges you to confront obstacles with unwavering courage. Each step sharpens your focus and tests your determination. You will cultivate patience, perseverance, and inner power."
  },
  {
    id: "disco",
    gateImg: Gate3,
    thumb: i3,
    modalImg: DiscoImg,
    title: "Astral Voyage",
    arc: "Discovery/expansion arc",
    desc: "Embark on the Astral Voyage and explore the mysteries beyond. This path encourages curiosity and broadens your perspective. You will encounter new ideas and experiences that expand your mind."
  },
];

function LifeModeSelector() {
  const [offsetY, setOffsetY] = useState(0);
  const [hoveredGate, setHoveredGate] = useState(null);
  const [selectedGate, setSelectedGate] = useState(null);
  const [exploreClicked, setExploreClicked] = useState(false);
  const [goals, setGoals] = useState([]);
  const [currentGoal, setCurrentGoal] = useState("");
  const [loadingGoals, setLoadingGoals] = useState(false);

  const navigate = useNavigate();
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch saved goals from Firestore
  const loadGoals = async (gateId) => {
    if (!uid) return;
    setLoadingGoals(true);
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const gateGoals = data.lifeModes?.[gateId]?.goals || [];
        setGoals(gateGoals);
      } else {
        setGoals([]);
      }
    } catch (err) {
      console.error("Error fetching goals:", err);
      setGoals([]);
    }
    setLoadingGoals(false);
  };

  const handleAddGoal = async () => {
    if (!currentGoal.trim() || !selectedGate || !uid) return;
    const goal = currentGoal.trim();
    setGoals((prev) => [...prev, goal]);
    setCurrentGoal("");

    try {
      const docRef = doc(firestore, "users", uid);
      await setDoc(
        docRef,
        { lifeModes: { [selectedGate.id]: { goals: arrayUnion(goal) } } },
        { merge: true }
      );
    } catch (err) {
      console.error("Error saving goal:", err);
    }
  };

  const handleSaveAllGoals = async () => {
    if (!uid || !selectedGate) return;
    try {
      const docRef = doc(firestore, "users", uid);
      await setDoc(
        docRef,
        { lifeModes: { [selectedGate.id]: { goals } } },
        { merge: true }
      );
      alert("Goals saved successfully!");
    } catch (err) {
      console.error("Error saving goals:", err);
      alert("Failed to save goals.");
    }
  };

  // in LifeModeSelector.js
  const handleViewGoals = () => {
    navigate("/goals", {
      state: {
        lifeModeId: selectedGate.id,
        lifeModeTitle: selectedGate.title
      }
    });
  };


  return (
    <div className="life-page" style={{ backgroundImage: `url(${CosmicBG})` }}>
      <header className="life-header">
        <h1>Life Mode Selector</h1>
        <p>Choose your path and discover your journey</p>
      </header>

      <section className="gate-container">
        {gates.map((gate, i) => (
          <div
            key={gate.id}
            className={`gate-box ${hoveredGate === gate.id ? "active" : ""}`}
            onMouseEnter={() => setHoveredGate(gate.id)}
            onMouseLeave={() => setHoveredGate(null)}
            onClick={() => {
              setSelectedGate(gate);
              setExploreClicked(false);
              loadGoals(gate.id); // fetch saved goals from Firestore
            }}
            style={{
              transform: `translateY(${offsetY * (0.15 + i * 0.05)}px) ${hoveredGate === gate.id
                  ? "rotateX(10deg) translateZ(50px) scale(1.15)"
                  : ""
                }`,
            }}
          >
            <img src={gate.gateImg} alt={gate.title} className="gate-img" />
            <img src={gate.thumb} alt="thumb" className="thumb-inside" />
            <div className="gate-text">
              <h2>{gate.title}</h2>
              <p className="gate-arc">{gate.arc}</p>
            </div>
          </div>
        ))}
      </section>

      {selectedGate && (
        <div className="modal-overlay" onClick={() => setSelectedGate(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {!exploreClicked ? (
              <>
                <h2>{selectedGate.title}</h2>
                <p>{selectedGate.desc}</p>
                <img
                  src={selectedGate.modalImg}
                  alt={selectedGate.title}
                  className="modal-img"
                />
                <button onClick={() => setExploreClicked(true)}>Explore</button>
              </>
            ) : (
              <>
                <h2>{selectedGate.title} - Goals</h2>
                <p>{selectedGate.desc}</p>
                <div className="add-goals-section">
                  <input
                    type="text"
                    placeholder="Enter your goal"
                    value={currentGoal}
                    onChange={(e) => setCurrentGoal(e.target.value)}
                  />
                  <button onClick={handleAddGoal}>+</button>
                  {loadingGoals ? (
                    <p>Loading goals...</p>
                  ) : (
                    <ul>
                      {goals.length > 0 ? (
                        goals.map((goal, idx) => <li key={idx}>{goal}</li>)
                      ) : (
                        <li>No goals added yet.</li>
                      )}
                    </ul>
                  )}
                  <div className="goal-buttons">
                    <button onClick={handleSaveAllGoals}>Save Goals</button>
                    <button onClick={handleViewGoals}>View Your Goals</button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LifeModeSelector;
