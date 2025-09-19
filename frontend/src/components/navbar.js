import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./navbar.css";
import astitvaLogo from "../images/astitvaLogo.png";
import { auth } from "../firebase";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/auth");
  };

  // 🌐 Route detection → themeClass apply
  const path = location.pathname;
  let themeClass = "navbar";

  if (path === "/") themeClass += " navbar-home";
  else if (path.startsWith("/ds")) themeClass += " navbar-ds";
  else if (path.startsWith("/karmic")) themeClass += " navbar-karmic";
  else if (path.startsWith("/blueprint")) themeClass += " navbar-blueprint";
  else if (path.startsWith("/life-mode")) themeClass += " navbar-life";
  else if (path.startsWith("/mirror-ai")) themeClass += " navbar-mirror";

  return (
    <nav className={themeClass}>
      {/* Logo */}
      <div className="logo">
        <img src={astitvaLogo} alt="Astitva Logo" className="logo-img" />
      </div>

      <ul className={`nav-links ${menuOpen ? "open" : ""}`}>
  <li><Link to="/dharma-scheduler">DS</Link></li>
  <li><Link to="/karmic-ai">Karmic</Link></li>
  <li><Link to="/life-blueprint">Blueprint</Link></li>
  <li><Link to="/life-mode">Life Mode</Link></li>
  <li><Link to="/mirror-ai">Mirror AI</Link></li>

  {user ? (
    <>
      <li><Link to="/dashboard">Dashboard</Link></li>
      <li>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </li>
    </>
  ) : (
    <li><Link to="/auth">Sign In / Sign Up</Link></li>
  )}
</ul>


      {/* Hamburger */}
      <div
        className={`hamburger ${menuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}
