import React, { useState } from "react";
import "./planet.css";

import r1 from "../images/r1.png";
import r2 from "../images/r2.png";
import r3 from "../images/r3.png";
import r4 from "../images/r4.png";
import r5 from "../images/r5.png";
import r6 from "../images/r6.png";

const planetsData = [
  { img: r1, quote: "Believe in yourself!" },
  { img: r2, quote: "Every step counts!" },
  { img: r3, quote: "Keep moving forward!" },
  { img: r4, quote: "Dream big!" },
  { img: r5, quote: "Stay positive!" },
  { img: r6, quote: "You are unstoppable!" },
];

export default function PlanetOrbit({ onClose }) {
  const [selected, setSelected] = useState(null);

  return (
    <div className="planet-modal-overlay" onClick={onClose}>
      <div className="planet-modal-content" onClick={(e) => e.stopPropagation()}>

        <h2>You are doing great daily!!!!!</h2>

        {/* Orbit Container with optional blur */}
        <div className={`orbit-container ${selected !== null ? "blur-background" : ""}`}>
          <div className="sun"></div>
          {planetsData.map((planet, i) => (
            <div
              key={i}
              className={`planet orbit-${i}`}
              onClick={() => setSelected(i)}
            ></div>
          ))}
        </div>

        {/* Planet Card */}
        {selected !== null && (
          <div className="planet-card">
            <p>{planetsData[selected].quote}</p>
            <img src={planetsData[selected].img} alt={`planet-${selected}`} />
            <input type="text" placeholder="Add a word for yourself daily" />
            <button>Save</button>
            <button className="close-btn" onClick={() => setSelected(null)}>Close</button>
          </div>
        )}

        <button className="close-btn" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
