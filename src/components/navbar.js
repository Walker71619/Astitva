import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";
import astitvaLogo from "../images/astitvaLogo.png";
import { auth } from "../firebase";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    // Listen for auth state
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/auth");
  };

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

        {/* Auth / Dashboard Section */}
        {user ? (
          <>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <li><Link to="/auth">Sign In / Sign Up</Link></li>
        )}
      </ul>

      {/* Hamburger */}
      <div className={`hamburger ${menuOpen ? "open" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}
