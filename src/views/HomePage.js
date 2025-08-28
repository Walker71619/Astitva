import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/navbar";
import moon from "../images/moon2.png";
import tree from "../images/tree2.png";
import BG from "../images/gradient.jpg";
import base from "../images/parallaxBase.png";
import "./HomePage.css";

export default function HomePage() {
    const heroRef = useRef(null);
    const [released, setReleased] = useState(false);

    // Hero scroll tracking
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end end"]
    });

    /** Stage 0: Moon (majestic presence) */
    const moonScale = useTransform(scrollYProgress, [0, 0.5], [2, 1.2]);
    const moonY = useTransform(scrollYProgress, [0, 0.85], ["0%", "120%"]);
    // ab tree+base ke descend ke sath hi niche jayega
    const moonX = "-50%";

    /** Stage 1: BG zoom (deep depth) */
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 2.2]);

    /** Stage 2: Tree zoom + shift */
    const treeScale = useTransform(scrollYProgress, [0.25, 0.8], [1, 1.6]);
    const treeY = useTransform(scrollYProgress, [0.25, 0.8], [0, -80]);

    /** Stage 3: Base zoom + descend */
    const baseScale = useTransform(scrollYProgress, [0.5, 0.85], [1, 1.8]);
    const baseY = useTransform(scrollYProgress, [0.5, 0.85], [0, 180]);

    /** Stage 4: Text fade */
    const textScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.3]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);


    useEffect(() => {
        return scrollYProgress.on("change", v => {
            if (v > 0.85) setReleased(true);
            else setReleased(false);
        });
    }, [scrollYProgress]);

    return (
        <div className="homepage">
            <Navbar />

            {/* Hero cinematic scroll */}
            <section className="hero-wrapper" ref={heroRef}>
                <div
                    className="hero-sticky"
                    style={{
                        position: released ? "relative" : "fixed"
                    }}
                >
                    {/* Background */}
                    <motion.img
                        src={BG}
                        alt="background"
                        className="bg-layer"
                        style={{ scale: bgScale }}
                    />

                    {/* Moon */}
                    <motion.img
                        src={moon}
                        alt="moon"
                        className="moon"
                        style={{ scale: moonScale, y: moonY, x: moonX }}
                    />

                    {/* Ground Group */}
                    <motion.div className="ground-group" style={{ scale: baseScale, y: baseY }}>
                        <motion.img
                            src={tree}
                            alt="tree"
                            className="tree"
                            style={{ scale: treeScale, y: treeY }}
                        />
                        <img src={base} alt="base" className="base" />
                    </motion.div>

                    {/* Masked Fullscreen Text */}
                    <motion.div
                        className="hero-mask"
                        style={{
                            opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]),
                            pointerEvents: "none"
                        }}
                    >
                        <motion.h1 style={{ scale: textScale, opacity: textOpacity }}>
                            ASTITVA
                        </motion.h1>
                    </motion.div>

                </div>
            </section>

            {/* Categories Section */}
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
                        <p>Switch between Warrior, Healing, and Dreamer modes.</p>
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
