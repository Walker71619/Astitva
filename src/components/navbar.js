import React, { useState } from "react";
import "./navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <nav className="navbar">
      <div className="logo">ASTITVA</div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><a href="#life-tree">Life Tree</a></li>
        <li><a href="#mirror-ai">Mirror AI</a></li>
        <li><a href="#healing-hustle">Healing & Hustle</a></li>
        <li><a href="#tribes">Tribes</a></li>
        <li><a href="#future-you">Future You</a></li>
      </ul>

      {/* Fantasy Hamburger */}
      <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}
