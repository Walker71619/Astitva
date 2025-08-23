import React from "react";
import "./home.css";

import BgMain from "../images/Bg_main.png";  
import Bg2    from "../images/Bg2.png";       
import Moon   from "../images/Moon.png";
import Tree   from "../images/Tree.png";
import Flower from "../images/Flower.png";    
import Lantern from "../images/Lantern.png";

function Home() {
  // create 12 lanterns with random positions/sizes
  const lanterns = Array.from({ length: 12 }).map((_, i) => {
    const left = Math.random() * 80 + 5;   // between 5vw and 85vw
    const top = Math.random() * 50 + 10;   // between 10vh and 60vh
    const size = Math.random() * 15 + 20;    // between 4vw and 10vw
    const delay = Math.random() * 12;      // random animation delay
    const duration = Math.random() * 10 + 18; // 18–28s float cycle

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

  return (
    <div className="scene">
      {/* Base background fills screen */}
      <img src={BgMain} className="layer base" alt="" />

      {/* Distant ridge/bush (slight drift) */}
      <img src={Bg2} className="layer bg2" alt="" />

      {/* Big moon on the left, behind text */}
      <img src={Moon} className="layer moon" alt="Moon" />

      {/* Title block */}
      <div className="text-section">
        <h1 className="title">ASTITVA</h1>
        <p className="subtitle">Your Life Blueprint</p>
      </div>

      {/* Foreground tree */}
      <img src={Tree} className="layer tree" alt="Tree" />

      {/* Decorative flower */}
      <img src={Flower} className="layer flower" alt="Flower" />

      {/* Floating lanterns */}
      {lanterns}

      {/* Edge fade */}
      <div className="edge-fade" />
    </div>
  );
}

export default Home;
