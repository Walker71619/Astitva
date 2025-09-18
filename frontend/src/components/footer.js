import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaTwitter, FaLinkedin, FaEnvelope } from "react-icons/fa";
import "./footer.css";

export default function Footer() {
  return (
    <motion.footer
      className="footer"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
    >
      <div className="footer-content">

        {/* Left: Logo & tagline */}
        <div className="footer-section">
          <h2 className="footer-logo">Astitva</h2>
          <p className="footer-tagline">
            "A digital cosmos crafted for your becoming."
          </p>
        </div>

        {/* Middle: Quick Links */}
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><a href="/">Home</a></li>
            <li><a href="/dharma-scheduler">Dharma Scheduler</a></li>
            <li><a href="/mirror-ai">Mirror AI</a></li>
            <li><a href="/blueprint">Life Blueprint</a></li>
            <li><a href="/life-mode">Life Mode Selector</a></li>
          </ul>
        </div>

        {/* Right: Contact */}
        <div className="footer-section">
          <h3 className="footer-heading">Contact</h3>
          <p><FaEnvelope /> contact@astitva.com</p>
          <div className="footer-socials">
            <a href="https://github.com/AnshulAlgoS" target="_blank" rel="noreferrer">
              <FaGithub />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <FaTwitter />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer">
              <FaLinkedin />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Astitva • Crafted under the moonlight 🌙</p>
      </div>
    </motion.footer>
  );
}
