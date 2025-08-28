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

    /** Stage 0: Moon */
    const moonScale = useTransform(scrollYProgress, [0, 0.5], [2, 1.2]);
    const moonY = useTransform(scrollYProgress, [0, 0.85], ["0%", "120%"]);
    const moonX = "-50%";

    /** Stage 1: BG zoom */
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 2.2]);

    /** Stage 2: Tree zoom + shift */
    const treeScale = useTransform(scrollYProgress, [0.25, 0.8], [1, 1.6]);
    const treeY = useTransform(scrollYProgress, [0.25, 0.8], [0, -80]);

    /** Stage 3: Base zoom + descend */
    const baseScale = useTransform(scrollYProgress, [0.5, 0.85], [1, 1.8]);
    const baseY = useTransform(scrollYProgress, [0.5, 0.85], [0, 50]);

    /** Stage 4: Text fade */
    const textScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.3]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    useEffect(() => {
        return scrollYProgress.on("change", v => {
            if (v > 0.85) setReleased(true);
            else setReleased(false);
        });
    }, [scrollYProgress]);

    const cards = [
        { href: "/dharma-scheduler", title: "Dharma Scheduler", desc: "Plan and align your daily actions with your true path." },
        { href: "/karmic-ai", title: "Karmic AI", desc: "Discover your karmic path through AI insights." },
        { href: "/life-blueprint", title: "Life Blueprint", desc: "Design the roadmap of your life with guidance." },
        { href: "/life-mode", title: "Life Mode Selector", desc: "Switch between Warrior, Healing, and Dreamer modes." },
        { href: "/mirror-ai", title: "Mirror AI", desc: "Reflect your true self with AI-driven clarity." }
    ];

    return (
        <div className="homepage">
            <Navbar />
            
            {/* Hero cinematic scroll */}
            <section className="hero-wrapper" ref={heroRef}>
                <div className="hero-sticky" style={{ position: released ? "relative" : "fixed" }}>
                    <motion.img src={BG} alt="background" className="bg-layer" style={{ scale: bgScale }} />
                    <motion.img src={moon} alt="moon" className="moon" style={{ scale: moonScale, y: moonY, x: moonX }} />
                    <motion.div className="tree-wrapper" style={{ scale: treeScale, y: treeY }}>
                        <motion.img src={tree} alt="tree" className="tree" />
                    </motion.div>
                    <motion.div className="base-wrapper" style={{ scale: baseScale, y: baseY }}>
                        <motion.img src={base} alt="base" className="base" />
                    </motion.div>
                    <motion.div className="hero-mask" style={{ opacity: useTransform(scrollYProgress, [0, 0.15], [1, 0]), pointerEvents: "none" }}>
                        <motion.h1 style={{ scale: textScale, opacity: textOpacity }}>ASTITVA</motion.h1>
                    </motion.div>
                </div>
            </section>

            {/* Fantasy Categories */}
            <section className="categories">
                <h2 className="categories-title">Explore</h2>

                {/* Floating magical particles */}
                {[...Array(6)].map((_, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="floating-particle"
                        animate={{
                            y: [0, -20, 0],
                            x: [0, 15, 0],
                            opacity: [0.3, 0.8, 0.3]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 8 + Math.random() * 4,
                            ease: "easeInOut",
                            delay: i
                        }}
                    />
                ))}
                <div className="category-grid">
                    {cards.map((card, i) => (
                        <motion.a
                            key={i}
                            href={card.href}
                            className="category-card"
                            animate={{ y: [0, -12, 0], x: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 6 + Math.random() * 2, ease: "easeInOut", delay: i * 0.2 }}
                            whileHover={{
                                scale: 1.07,
                                rotateX: 4,
                                rotateY: -4,
                                boxShadow: "0 25px 60px rgba(162, 240, 255, 0.6)"
                            }}
                        >
                            <h3>{card.title}</h3>
                            <p>{card.desc}</p>
                        </motion.a>
                    ))}
                </div>
            </section>
        </div>
    );
}
