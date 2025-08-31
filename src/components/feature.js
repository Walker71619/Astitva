import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./features.css";

import mythicImg from "../images/mythicExp.jpg";
import destinyImg from "../images/personalDestiny.jpg";
import cosmicImg from "../images/cosmicDesign.jpg";
import ritualImg from "../images/ritualizedFlow.jpg";
import evolvingImg from "../images/everEvolving.jpg";

const features = [
    {
        title: "Mythic Experience",
        desc: "Every interaction feels like stepping into a living myth — a digital cosmos shaped by your presence.",
        img: mythicImg
    },
    {
        title: "Personal Destiny",
        desc: "Not generic advice — Astitva bends to reveal the path meant uniquely for you, no one else.",
        img: destinyImg
    },
    {
        title: "Cosmic Design",
        desc: "From typography to transitions, every pixel hums with intention and timeless elegance.",
        img: cosmicImg
    },
    {
        title: "Ritualized Flow",
        desc: "Tasks and goals aren’t chores here — they are sacred rituals guiding your becoming.",
        img: ritualImg
    },
    {
        title: "Ever-Evolving",
        desc: "Astitva grows with you — new paths unlock as you explore, ensuring the story never ends.",
        img: evolvingImg
    }
];

export default function ExpandingFeatures() {
    const [active, setActive] = useState(0);

    return (
        <div class="feature-wrapper">
            {features.map((feature, i) => (
                <motion.div
                    key={i}
                    className={`feature-card ${i === active ? "active" : ""}`}
                    onMouseEnter={() => setActive(i)}
                    animate={{
                        flex: i === active ? 4 : 1,
                    }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    {/* Feature Image (only for active) */}
                    <AnimatePresence>
                        {i === active && (
                            <motion.div
                                className="feature-image"
                                style={{ backgroundImage: `url(${feature.img})` }}
                                initial={{ opacity: 0, scale: 1.05 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.5, ease: "easeInOut" }}
                            />
                        )}
                    </AnimatePresence>

                    <div className="feature-content">
                        <h3 className="feature-title">{feature.title}</h3>

                        <AnimatePresence>
                            {i === active && (
                                <motion.p
                                    className="feature-desc"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {feature.desc}
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            ))
            }
        </div >
    );
}
