import React, { useState, useEffect } from "react";
import "./LifeModeSelector.css";
import Gate1 from "../images/gate1.png";
import Gate2 from "../images/gate2.png";
import Gate3 from "../images/gate3.png";
import CosmicBG from "../images/moon-bg.jpg";

// Thumbnails / full images
import HealImg from "../images/heal.png";
import DisciImg from "../images/disci.png";
import DiscoImg from "../images/disco.png";

const gates = [
  {
    id: "heal",
    gateImg: Gate1,
    thumb: HealImg,
    title: "Phoenix Path",
    arc: "Emotional healing arc",
    desc: "The Phoenix has always been a timeless symbol of rebirth, rising gracefully from the ashes of its past. In the same way, the Phoenix Path represents a deep emotional healing arc—a journey of inner transformation..."
  },
  {
    id: "disci",
    gateImg: Gate2,
    thumb: DisciImg,
    title: "Titan’s March",
    arc: "Warrior/discipline arc",
    desc: "If the Phoenix teaches us to heal, the Titan teaches us to endure. The Titan’s March embodies the warrior’s discipline—an unyielding commitment to growth, perseverance, and strength..."
  },
  {
    id: "disco",
    gateImg: Gate3,
    thumb: DiscoImg,
    title: "Astral Voyage",
    arc: "Discovery/expansion arc",
    desc: "While the Phoenix rises and the Titan marches, the Astral Voyager drifts into the unknown. This arc symbolizes discovery, exploration, and expansion..."
  },
];

function LifeModeSelector() {
  const [offsetY, setOffsetY] = useState(0);
  const [hoveredGate, setHoveredGate] = useState(null);
  const [selectedGate, setSelectedGate] = useState(null);

  useEffect(() => {
    const handleScroll = () => setOffsetY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="life-page"
      style={{ backgroundImage: `url(${CosmicBG})` }}
    >
      <header className="life-header">
        <h1>Life Mode Selector</h1>
        <p>Unlock the doors to growth, healing, and dreams</p>
      </header>

      <section className="gate-container">
        {gates.map((gate, i) => (
          <div
            key={gate.id}
            className={`gate-box ${hoveredGate === gate.id ? "active" : ""}`}
            onMouseEnter={() => setHoveredGate(gate.id)}
            onMouseLeave={() => setHoveredGate(null)}
            onClick={() => setSelectedGate(gate)}
            style={{
              transform: `translateY(${offsetY * (0.15 + i * 0.05)}px) ${
                hoveredGate === gate.id
                  ? "rotateX(10deg) translateZ(50px) scale(1.15)"
                  : ""
              }`,
            }}
          >
            <img src={gate.gateImg} alt={gate.title} className="gate-img" />
            <img src={gate.thumb} alt="thumb" className="thumb-inside" />

            {/* Title + Arc Text Below Gate */}
            <div className="gate-text">
              <h2>{gate.title}</h2>
              <p className="gate-arc">{gate.arc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Modal */}
      {selectedGate && (
        <div className="modal-overlay" onClick={() => setSelectedGate(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedGate.title}</h2>
            <p>{selectedGate.desc}</p>
            <img
              src={selectedGate.thumb}
              alt={selectedGate.title}
              className="modal-img"
            />
            <button onClick={() => setSelectedGate(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default LifeModeSelector;


