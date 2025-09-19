import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "./lifeblueprint.css";

import Sad from "../images/sad.jpg";
import Happy from "../images/happy.jpg";
import Achievement from "../images/achievement.jpg";
import BgMain from "../images/bluebg.jpg";

// ✅ LivingTree import
import LivingTree from "../components/livingTree";

function LifeBlueprint() {
  const navigate = useNavigate();

  const cards = [
    { id: "sad", title: "SAD MEMORY", img: Sad, path: "/sad-memories" },
    { id: "happy", title: "HAPPY MEMORY", img: Happy, path: "/happy-memories" },
    { id: "achievement", title: "ACHIEVEMENT MEMORY", img: Achievement, path: "/achievement-memories" },
  ];

  const memories = [
    { type: "achievement", id: "f2BYbdkb7BUua6kilZvK" },
    { type: "happy", id: "iXfZuf9UVneMUgsTuovw" },
    { type: "sad", id: "XQ0AwFUEbvg6MJp0kxQU" },
  ];

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Blueprint Scene */}
      <div
        className="blueprint-scene"
        style={{ backgroundImage: `url(${BgMain})` }}
      >
        <h1 className="blueprint-title">LIFE BLUEPRINT</h1>

        {/* Right-aligned vertical cards */}
        <div className="blueprint-cards-vertical">
          {cards.map((card) => (
            <div
              key={card.id}
              className="memory-card"
              onClick={() => navigate(card.path)}
            >
              <div className="glow-back"></div>
              <img src={card.img} alt={card.title} />
              <h2>{card.title}</h2>
            </div>
          ))}
        </div>

        {/* ✅ Left animated living tree */}
        <LivingTree memories={memories} />
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default LifeBlueprint;
