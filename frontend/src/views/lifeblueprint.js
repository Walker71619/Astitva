import React from "react";
import { useNavigate } from "react-router-dom";   // 👈 navigate import
import "./lifeblueprint.css";

import Sad from "../images/sad.jpg";
import Happy from "../images/happy.jpg";
import Achievement from "../images/achievement.jpg";
import BgMain from "../images/bluebg.jpg";

function LifeBlueprint() {
  const navigate = useNavigate();

  const cards = [
    { id: "sad", title: "SAD MEMORY", img: Sad, path: "/sad-memories" },
    { id: "happy", title: "HAPPY MEMORY", img: Happy, path: "/happy-memories" },
    { id: "achievement", title: "ACHIEVEMENT MEMORY", img: Achievement, path: "/achievement-memories" },
  ];

  return (
    <div
      className="blueprint-scene"
      style={{ backgroundImage: `url(${BgMain})` }}
    >
      <h1 className="blueprint-title">LIFE BLUEPRINT</h1>

      <div className="blueprint-cards">
        {cards.map((card) => (
          <div
            key={card.id}
            className="memory-card"
            onClick={() => navigate(card.path)}   // 👈 navigate on click
          >
            <div className="glow-back"></div>
            <img src={card.img} alt={card.title} />
            <h2>{card.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LifeBlueprint;
