import React, { useState } from "react";
import "./home.css";

import BgMain from "../images/Bg_main.png";  
import Bg2    from "../images/Bg2.png";       
import Moon   from "../images/Moon.png";
import Tree   from "../images/Tree.png";
import Lantern from "../images/Lantern.png";

import Butterfly1 from "../images/Butterfly1.png";
import Butterfly2 from "../images/Butterfly2.png";
import Butterfly3 from "../images/Butterfly3.png";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-left">ASTITVA</div>
      <div className="nav-center">
        <a href="/">Home</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/journey">Your Journey</a>
      </div>
      <div className="nav-right">
        <a href="/login" className="login-btn">Login / Sign Up</a>
      </div>
    </nav>
  );
}

function Home() {
  const [active, setActive] = useState(false);
  const toggleScene = () => setActive(a => !a);

  // Lanterns
  const lanterns = Array.from({ length: 12 }).map((_, i) => {
    const left = Math.random() * 80 + 5;
    const top = Math.random() * 50 + 10;
    const size = Math.random() * 4 + 6;
    const delay = Math.random() * 12;
    const duration = Math.random() * 10 + 18;

    return (
      <img
        key={i}
        src={Lantern}
        alt="Lantern"
        className="lantern"
        style={{
          left: `${left}vw`,
          top: `${top}vh`,
          width: `${size}vw`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
      />
    );
  });


  const butterflyImgs = [Butterfly1, Butterfly2, Butterfly3];
  const butterflies = Array.from({ length: 10 }).map((_, i) => {
    const left = Math.random() * 80 + 10;
    const top = Math.random() * 60 + 20;
    const size = 32;
    const delay = Math.random() * 10;
    const duration = Math.random() * 15 + 12;
    const img = butterflyImgs[i % butterflyImgs.length];

    return (
      <div
        key={`butterfly-${i}`}
        className="butterfly-wrapper"
        style={{
          left: `${left}vw`,
          top: `${top}vh`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
      >
        <img src={img} alt="Butterfly" className="butterfly" style={{ width: `${size}px` }} />
      </div>
    );
  });

  // Glows
  const glowXs = [10, 24, 38, 52, 66, 80];
  const glows = glowXs.map((x, i) => (
    <div
      key={`glow-${i}`}
      className="glow"
      style={{ left: `${x}vw`, top: `${50 + (i % 2 === 0 ? 0 : -6)}vh` }}
    />
  ));

  return (
    <>
      <Navbar />
      <div className={`scene ${active ? "active" : ""}`} onClick={toggleScene}>
        <img src={BgMain} className="layer base" alt="" />
        <img src={Bg2} className="layer bg2 bg2-left" alt="" />
        <img src={Bg2} className="layer bg2 bg2-right" alt="" />
        <img src={Moon} className="layer moon" alt="Moon" />
        <img src={Tree} className="layer tree" alt="Tree" />

        {lanterns}
        <div className="butterflies">{butterflies}</div>
        <div className="glows">{glows}</div>

        <div className="text-section">
          <h1 className="title">ASTITVA</h1>
          <p className="subtitle">Your Life Blueprint</p>
        </div>

        <div className="edge-fade" />
      </div>

      {/* Categories Section (now 4 big cards, 2x2 layout) */}
      <section className="categories">
        <h2 className="categories-title">Explore</h2>
        <div className="category-grid">

          <a href="/dharma-scheduler" className="category-card">
            <h3>Dharma Scheduler</h3>
            <p>Plan and align your daily actions with your true path.</p>
          </a>

          <a href="/karmic-ai" className="category-card">
            <h3>Karmic AI</h3>
            <p>Discover your karmic path through AI insights.</p>
          </a>

          <a href="/life-blueprint" className="category-card">
            <h3>Life Blueprint</h3>
            <p>Design the roadmap of your life with guidance.</p>
          </a>

          <a href="/life-mode" className="category-card">
            <h3>Life Mode Selector</h3>
            <p>
              Switch between Warrior (goals), Healing (reflection), 
              and Dreamer  (vision board).
            </p>
          </a>

          <a href="/mirror-ai" className="category-card">
            <h3>Mirror AI</h3>
            <p>Reflect your true self with AI-driven clarity.</p>
          </a>
          
        </div>
      </section>
    </>
  );
}

export default Home;

