import React, { useState } from "react";
import { Link } from "react-router-dom"; 
import "./navbar.css";
import astitvaLogo from "../images/astitvaLogo.png";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <nav className="navbar">
      <div className="logo">
        <img src={astitvaLogo} alt="Astitva Logo" className="logo-img" />
      </div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
        <li><a href="#life-tree">Life Tree</a></li>
        <li><a href="#mirror-ai">Mirror AI</a></li>
        <li><a href="#healing-hustle">Healing & Hustle</a></li>
        <li><a href="#tribes">Tribes</a></li>
        <li><a href="#future-you">Future You</a></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/signup">Sign Up</Link></li>
        <li><Link to="/signin">Sign In</Link></li>
      </ul>

      <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}
