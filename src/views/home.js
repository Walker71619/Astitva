import React from "react";
import "./home.css";

import BgMain from "../images/Bg_main.png";  
import Bg2    from "../images/Bg2.png";       
import Moon   from "../images/Moon.png";
import Tree   from "../images/Tree.png";
import Flower from "../images/Flower.png";    

function Home() {
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

      {/* Foreground tree on the right (brought forward) */}
      <img src={Tree} className="layer tree" alt="Tree" />

      {/* Optional decorative flower (example placement) */}
      <img src={Flower} className="layer flower" alt="Flower" />

      {/* Subtle edge fade to blend bottom/edges */}
      <div className="edge-fade" />
    </div>
  );
}

export default Home;
