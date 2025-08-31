import React, { useRef, useState, useEffect } from "react";
import { motion, useTransform, useMotionValue } from "framer-motion";
import { Link } from "react-router-dom";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

// hero images
import moon from "../images/moon2.png";
import tree from "../images/tree2.png";
import BG from "../images/gradient.jpg";
import base from "../images/parallaxBase.png";

// fantasy card images
import dharmaImg from "../images/hourglass.jpg";
import karmicImg from "../images/oracle.jpg";
import blueprintImg from "../images/blueprint.jpg";
import modesImg from "../images/modes.jpeg";
import mirrorImg from "../images/mirror.jpeg";
import oneIcon from "../images/number-1-svgrepo-com.svg";
import twoIcon from "../images/number-2-svgrepo-com.svg";
import threeIcon from "../images/number-3-svgrepo-com.svg";
import fourIcon from "../images/number-4-svgrepo-com.svg";
import fiveIcon from "../images/number-5-svgrepo-com.svg";
import FantasyCard from "../components/FantasyCard";
import ExpandingFeatures from "../components/feature";
import "./HomePage.css";

export default function HomePage() {
    const heroRef = useRef(null);
    const [locked, setLocked] = useState(true);
    const progress = useMotionValue(0);
    useEffect(() => {
        let rafId = null;
        const handleWheel = (e) => {
            const heroTop = heroRef.current?.getBoundingClientRect().top || 0;
            const heroBottom = heroRef.current?.getBoundingClientRect().bottom || 0;
            const inHeroView = heroTop < window.innerHeight && heroBottom > 0;

            let current = progress.get();

            // ✅ Clamp delta to avoid huge jumps (glitch fix)
            let delta = Math.max(-100, Math.min(100, e.deltaY));

            // ✅ Different speed for smooth scroll + frame sync
            const factor = delta > 0 ? 0.0012 : 0.0009;
            let next = current + delta * factor;
            next = Math.min(Math.max(next, 0), 1);

            if ((inHeroView || locked) && (current > 0 && current < 1)) {
                e.preventDefault();
                cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => progress.set(next));
            }
            else if ((inHeroView || locked) && locked && delta > 0) {
                e.preventDefault();
                cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => progress.set(next));
            }
            else if ((inHeroView || locked) && !locked && delta < 0 && next < 1) {
                e.preventDefault();
                cancelAnimationFrame(rafId);
                rafId = requestAnimationFrame(() => progress.set(next));
            }

            if (next >= 1 && locked) setLocked(false);

            if (next <= 0 && !locked) {
                setLocked(true);
                requestAnimationFrame(() => {
                    window.scrollTo({ top: 0, behavior: "instant" });
                });
            }
        };

        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            window.removeEventListener("wheel", handleWheel);
            cancelAnimationFrame(rafId);
        };
    }, [locked, progress]);

    // Motion transforms
    const bgScale = useTransform(progress, [0, 1], [1, 2.2]);
    const moonScale = useTransform(progress, [0, 0.5], [2, 1.2]);
    const moonY = useTransform(progress, [0, 1], ["0%", "120%"]);
    const moonX = "-50%";
    const treeScale = useTransform(progress, [0.25, 0.8], [1, 1.6]);
    const treeY = useTransform(progress, [0.25, 0.8], [20, -80]);
    const baseScale = useTransform(progress, [0.5, 0.85], [1, 1.8]);
    const baseY = useTransform(progress, [0.5, 0.85], [30, 80]);
    const textScale = useTransform(progress, [0, 0.2], [1, 1.3]);
    const textOpacity = useTransform(progress, [0, 0.2], [1, 0]);
    const auraY = useTransform(progress, [0, 1], ["-10%", "10%"]);
    const auraOpacity = useTransform(progress, [0, 0.5], [0.2, 0.5]);

    const cards = [
        { href: "/dharma-scheduler", title: "Dharma Scheduler", desc: "Plan and align your daily actions with your true path.", img: dharmaImg, badge: <img src={oneIcon} alt="1" className="badge-icon" />, theme: "blue" },
        { href: "/karmic-ai", title: "Karmic AI", desc: "Discover your karmic path through AI insights.", img: karmicImg, badge: <img src={twoIcon} alt="2" className="badge-icon" />, theme: "green" },
        { href: "/life-blueprint", title: "Life Blueprint", desc: "Design the roadmap of your life with guidance.", img: blueprintImg, badge: <img src={threeIcon} alt="3" className="badge-icon" />, theme: "gold" },
        { href: "/life-mode", title: "Life Mode Selector", desc: "Switch between Warrior, Healing, and Dreamer modes.", img: modesImg, badge: <img src={fourIcon} alt="4" className="badge-icon" />, theme: "crimson" },
        { href: "/mirror-ai", title: "Mirror AI", desc: "Reflect your true self with AI-driven clarity.", img: mirrorImg, badge: <img src={fiveIcon} alt="5" className="badge-icon" />, theme: "violet" }
    ];

    return (
        <div className="homepage">
            <Navbar />

            {/* Hero cinematic scroll */}
            <section className="hero-wrapper" ref={heroRef} style={{ height: "100vh" }}>
                <div
                    className="hero-sticky"
                    style={{
                        position: locked ? "fixed" : "relative",
                        inset: locked ? 0 : "auto",
                        width: "100%"
                    }}
                >
                    <motion.img src={BG} alt="background" className="bg-layer" style={{ scale: bgScale }} />
                    <motion.img src={moon} alt="moon" className="moon" style={{ scale: moonScale, y: moonY, x: moonX }} />
                    <motion.div className="tree-wrapper" style={{ scale: treeScale, y: treeY }}>
                        <motion.img src={tree} alt="tree" className="tree" />
                    </motion.div>
                    <motion.div className="base-wrapper" style={{ scale: baseScale, y: baseY }}>
                        <motion.img src={base} alt="base" className="base" />
                    </motion.div>
                    <motion.div className="hero-mask" style={{ opacity: textOpacity, pointerEvents: "none" }}>
                        <motion.h1 style={{ scale: textScale, opacity: textOpacity }}>ASTITVA</motion.h1>
                    </motion.div>
                </div>
            </section>

            {/* Spacer so that content doesn't overlap when hero is fixed */}
            {locked && <div style={{ height: "100vh" }} />}

            {/* Main Content */}
            <section className="categories">
                <h2 className="categories-title">Explore</h2>
                <div className="category-grid desktop-only">
                    {cards.map((card, i) => (
                        <FantasyCard key={i} index={i} {...card} />
                    ))}
                </div>
            </section>

            <ExpandingFeatures />

            <section className="about-astitva">
                <motion.div className="about-aura" style={{ y: auraY, opacity: auraOpacity }} />
                <motion.div
                    className="about-content"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    {/* About text same as before */}
                </motion.div>
            </section>

            <Footer />
        </div>
    );
}
