import React, {useRef} from "react";
import {motion, useScroll, useTransform} from "framer-motion";
import Navbar from "../components/navbar";
import moon from "../images/moon2.png";
import tree from "../images/tree2.png";
import BG from "../images/gradient.jpg";
import base from "../images/parallaxBase.png";
import "./HomePage.css";

export default function HomePage() {
  const heroRef = useRef(null);

  // scroll progress track karega hero-wrapper (200vh)
  const {scrollYProgress} = useScroll({
    target: heroRef,
    offset: ["start start", "end end"]
  });

  /** Step 1: BG zoom (0 → 0.5 scroll) */
  const sceneScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.3]);

  /** Step 2: Tree + Base grow (0.5 → 1 scroll) */
  const treeScale = useTransform(scrollYProgress, [0.5, 1], [1, 1.6]);
  const treeY = useTransform(scrollYProgress, [0.5, 1], [0, -40]);

  const baseScale = useTransform(scrollYProgress, [0.5, 1], [1, 1.3]);
  const baseY = useTransform(scrollYProgress, [0.5, 1], [0, 60]);

  return (
    <div className="homepage">
      <Navbar />

      {/* Hero cinematic scroll with lock */}
      <section className="hero-wrapper" ref={heroRef}>
        <div className="hero-sticky">
          {/* BG zooms first */}
          <motion.img
            src={BG}
            alt="background"
            className="bg-layer"
            style={{scale: sceneScale}}
          />

          {/* Static moon for now */}
          <img src={moon} alt="moon" className="moon" />

          {/* Tree + Base grow second */}
          <motion.div className="ground-group" style={{scale: baseScale, y: baseY}}>
            <motion.img
              src={tree}
              alt="tree"
              className="tree"
              style={{scale: treeScale, y: treeY}}
            />
            <img src={base} alt="base" className="base" />
          </motion.div>
          <h1 className="astitva-text">ASTITVA</h1>
        </div>
      </section>
      {/* Categories Section (now 4 big cards, 2x2 layout) */}
      <section className="categories">
        <h2 className="categories-title">Explore</h2>
        <div className="category-grid">

          <a href="/dharma-scheduler" className="category-card">
            <h3>Dharma Scheduler</h3>
            <p>Plan and align your daily actions with your true path.</p>
          </a>

          <a href="/karmic-ai" className="category-card">
            <h3>Karmic AI</h3>
            <p>Discover your karmic path through AI insights.</p>
          </a>

          <a href="/life-blueprint" className="category-card">
            <h3>Life Blueprint</h3>
            <p>Design the roadmap of your life with guidance.</p>
          </a>

          <a href="/life-mode" className="category-card">
            <h3>Life Mode Selector</h3>
            <p>
              Switch between Warrior (goals), Healing (reflection), 
              and Dreamer  (vision board).
            </p>
          </a>

          <a href="/mirror-ai" className="category-card">
            <h3>Mirror AI</h3>
            <p>Reflect your true self with AI-driven clarity.</p>
          </a>
          
        </div>
      </section>
    </div>
  );
}
