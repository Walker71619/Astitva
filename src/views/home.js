import React from "react";
import "./home.css";
import Bg1 from "../images/Bg1.jpg";

function Home() {
  return (
    <div
      className="home-container"
      style={{ backgroundImage: `url(${Bg1})` }}
    >
      <div className="text-section">
        <h1 className="title">ASTITVA</h1>
        <p className="subtitle">Your Life Blueprint</p>
      </div>
    </div>
  );
}

export default Home;
