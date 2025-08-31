import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "../components/navbar";
import { Link } from "react-router-dom";
import Footer from "../components/footer";


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
    const [released, setReleased] = useState(false);
    const sectionRef = useRef(null);
    // Hero scroll tracking
    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end end"]
    });


    // Parallax aura movement
    const auraY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
    const auraOpacity = useTransform(scrollYProgress, [0, 0.5], [0.2, 0.5]);

    /** Stage 0: Moon */
    const moonScale = useTransform(scrollYProgress, [0, 0.5], [2, 1.2]);
    const moonY = useTransform(scrollYProgress, [0, 0.85], ["0%", "120%"]);
    const moonX = "-50%";

    /** Stage 1: BG zoom */
    const bgScale = useTransform(scrollYProgress, [0, 1], [1, 2.2]);

    /** Stage 2: Tree zoom + shift */
    const treeScale = useTransform(scrollYProgress, [0.25, 0.8], [1, 1.6]);
    const treeY = useTransform(scrollYProgress, [0.25, 0.8], [20, -80]);

    /** Stage 3: Base zoom + descend */
    const baseScale = useTransform(scrollYProgress, [0.5, 0.85], [1, 1.8]);
    const baseY = useTransform(scrollYProgress, [0.5, 0.85], [30, 80]);

    /** Stage 4: Text fade */
    const textScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.3]);
    const textOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    useEffect(() => {
        return scrollYProgress.on("change", v => {
            if (v > 0.85) setReleased(true);
            else setReleased(false);
        });
    }, [scrollYProgress]);

    // cards data (now with imported images)
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

            <section className="categories">
                <h2 className="categories-title">Explore</h2>

                {/* Desktop Grid (only desktop) */}
                <div className="category-grid desktop-only">
                    {cards.map((card, i) => (
                        <FantasyCard
                            key={i}
                            index={i}
                            href={card.href}
                            title={card.title}
                            desc={card.desc}
                            img={card.img}
                            badge={card.badge}
                            theme={card.theme}
                        />
                    ))}
                </div>
            </section>

            <ExpandingFeatures />
            
            <section className="about-astitva" ref={sectionRef}>
                {/* Floating aura background */}
                <motion.div
                    className="about-aura"
                    style={{ y: auraY, opacity: auraOpacity }}
                />

                {/* Content container */}
                <motion.div
                    className="about-content"
                    initial={{ opacity: 0, y: 60 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    viewport={{ once: true }}
                >
                    <motion.h2
                        className="about-title"
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    >
                        ✧ About Astitva ✧
                    </motion.h2>

                    <motion.p
                        className="about-text"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                    >
                        Astitva is a living cosmos ~ a realm woven from myth and code.
                        Every scroll is a step into destiny, every click a spark that shapes
                        the path only you were meant to walk.
                    </motion.p>

                    <motion.p
                        className="about-text1"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    >
                        Each click, each scroll is a step deeper into your own story ~
                        unlocking insights, shaping choices, and revealing the legend
                        you’re meant to become.
                    </motion.p>
                </motion.div>
            </section>
            {/* Footer */}
            <Footer />

        </div>
    );
}
