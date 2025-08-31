import { motion } from "framer-motion";
import React, { useRef } from "react";
import "./FantasyCard.css";
import YellowFire from "../images/yellow-fire[1].png";
import RedFire from "../images/red-fire[1].png";
import BlueFire from "../images/blue-fire[1].png";
import GreenFire from "../images/green-fire[1].png";

// fire border array in fixed order
const fireBorders = [BlueFire, GreenFire, YellowFire, RedFire];

export default function FantasyCard({
  href = "#",
  title,
  desc,
  img,
  badge = "✦",
  theme = "gold",
  index = 0,
}) {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty("--mx", (x / rect.width).toString());
    el.style.setProperty("--my", (y / rect.height).toString());
  };

  // assign border in sequence Blue → Green → Yellow → Red → Blue...
  const borderImg = fireBorders[index % 4];

  return (
    <motion.a
      href={href}
      className="fantasy-card"
      data-theme={theme}
      ref={ref}
      onMouseMove={handleMouseMove}
      onTouchStart={() => { }}
      whileHover={{ scale: 1.07, rotateX: 6, rotateY: -6 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      {/* Moving glare */}
      <span aria-hidden className="fc-glare" />

      {/* Badge with glow */}
      <div className="fc-badge">{badge}</div>

      {/* Illustration with fire border */}
      <div className="fc-ill-wrap">
        {index % 4 === 0 && index !== 4 && (
          <img src={BlueFire} alt="blue fire" className="blue-border" />
        )}
        {index % 4 === 1 && (
          <img src={GreenFire} alt="green fire" className="green-border" />
        )}
        {index % 4 === 2 && (
          <img src={YellowFire} alt="yellow fire" className="yellow-border" />
        )}
        {index % 4 === 3 && (
          <img src={RedFire} alt="red fire" className="red-border" />
        )}
        {/* Special case for 5th card (index === 4) */}
        {index === 4 && (
          <img src={BlueFire} alt="special blue fire" className="blue-border-special" />
        )}
        <img src={img} alt={title} loading="lazy" className="fc-ill-img" />
      </div>


      {/* Content wrapped in frame */}
      <div className="fc-text-frame" data-theme={theme}>
        <h3 className="fc-title">{title}</h3>
        <p className="fc-desc" data-theme={theme}>{desc}</p>
      </div>
    </motion.a>
  );
}
