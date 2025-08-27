import React, { useState } from "react";
import "./DharmaScheduler.css";
import S1 from "../images/S1.png";
import S2 from "../images/S2.png";
import S3 from "../images/S3.png";
import KarmicBG from "../images/b1.jpg";

function DharmaScheduler() {
  const [mode, setMode] = useState("");

  return (
    <div
      className="dharma-page"
      style={{ backgroundImage: `url(${KarmicBG})` }}
    >
      <header className="dharma-header">
        <h1>Dharma Scheduler </h1>
        <p>Select your Life Mode — let your sword guide the way.</p>
      </header>

      <section className="sword-container">
        <div
          className={`sword-box ${mode === "warrior" ? "active" : ""}`}
          onClick={() => setMode("warrior")}
        >
          <img src={S1} alt="Warrior Sword" className="sword-img" />
          <h2>Warrior Mode</h2>
          <p>For goals & hustle</p>
        </div>

        <div
          className={`sword-box ${mode === "healing" ? "active" : ""}`}
          onClick={() => setMode("healing")}
        >
          <img src={S2} alt="Healing Sword" className="sword-img" />
          <h2>Healing Mode</h2>
          <p>For reflection</p>
        </div>

        <div
          className={`sword-box ${mode === "dreamer" ? "active" : ""}`}
          onClick={() => setMode("dreamer")}
        >
          <img src={S3} alt="Dreamer Sword" className="sword-img" />
          <h2>Dreamer Mode</h2>
          <p>Vision board, future you</p>
        </div>
      </section>

      <section className="mode-content">
        {mode === "warrior" && (
          <div className="mode-card">
            <h3> Warrior Mode</h3>
            <p>Set your daily goals, push boundaries, and hustle hard.</p>
          </div>
        )}

        {mode === "healing" && (
          <div className="mode-card">
            <h3> Healing Mode</h3>
            <p>Reflect, meditate, and journal your healing journey.</p>
          </div>
        )}

        {mode === "dreamer" && (
          <div className="mode-card">
            <h3> Dreamer Mode</h3>
            <p>Design your vision board & imagine your future self.</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default DharmaScheduler;
