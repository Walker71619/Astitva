import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import "./livingTree.css";

import treeImg from "../images/livingTree.png";
import leaf2 from "../images/leaf2.png";
import leaf3 from "../images/leaf3.png";
import flower from "../images/Flower.png";
import lantern from "../images/Lantern.png";
import pawIcon from "../images/pow.png";

import { database } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const branchPositions = {
  sad: [
    { x: 250, y: 250 }, { x: 680, y: 150 }, { x: 450, y: 50 },
    { x: 380, y: 100 }, { x: 350, y: 180 }, { x: 650, y: 250 },
    { x: 320, y: 200 }, { x: 650, y: 180 }, { x: 640, y: 300 },
    { x: 750, y: 250 },
  ],
  happy: [
    { x: 450, y: 70 }, { x: 550, y: 90 }, { x: 250, y: 80 },
  ],
  achievement: [
    { x: 300, y: 350 }, { x: 240, y: 70 },
  ],
};

const LivingTree = () => {
  const { scrollY } = useScroll();
  const [memories, setMemories] = useState([]);
  const [popup, setPopup] = useState(null);
  const [popupData, setPopupData] = useState(null);

  const treeY = useTransform(scrollY, [0, 500], [0, -20]);

  // Fetch all memories from collections
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const types = ["sad", "happy", "achievement"];
        let allMemories = [];

        for (let type of types) {
          const collectionName =
            type === "happy"
              ? "happyMemories"
              : type === "sad"
                ? "sadMemories"
                : "achievementMemories";

          const snapshot = await getDocs(collection(database, collectionName));
          snapshot.forEach((docSnap) => {
            allMemories.push({ id: docSnap.id, type, ...docSnap.data() });
          });
        }

        setMemories(allMemories);
      } catch (err) {
        console.error("Error fetching memories:", err);
      }
    };

    fetchMemories();
  }, []);

  const handlePawClick = (mem) => {
    setPopup(mem.id);
    setPopupData(mem);
  };

  return (
    <div className="tree-container">
      {/* Tree */}
      <motion.img
        src={treeImg}
        alt="tree"
        style={{ y: treeY, zIndex: 1, width: "100%", height: "auto" }}
      />

      {/* Floating items */}
      {memories.map((mem, i) => {
        let src, cls, size;
        if (mem.type === "sad") {
          const leaves = [ leaf2, leaf3];
          src = leaves[i % leaves.length];
          cls = "floating-leaf";
          size = 68;
        } else if (mem.type === "happy") {
          src = flower;
          cls = "floating-flower";
          size = 100;
        } else if (mem.type === "achievement") {
          src = lantern;
          cls = "floating-lantern";
          size = 550;
        }

        const posArray = branchPositions[mem.type];
        const pos = posArray[i % posArray.length];

        return (
          <motion.div
            key={mem.id}
            style={{
              position: "absolute",
              left: pos.x,
              top: pos.y, // static top; will animate inside motion.img below
              rotate: 0,
              zIndex: 2 + i,
            }}
            animate={{
              top: scrollY.get() <= 500 ? [pos.y, pos.y - 10] : pos.y - 10,
              rotate: [0, 5 * (i + 1)],
            }}
            transition={{ ease: "linear", duration: 0.5 }}
          >
            <div style={{ position: "relative", display: "inline-block" }}>
              {popup === mem.id && (
                <div
                  className={
                    mem.type === "achievement"
                      ? "glow-lantern"
                      : mem.type === "happy"
                        ? "glow-flower"
                        : "glow-leaf"
                  }
                />
              )}

              <motion.img
                src={src}
                alt={mem.type}
                className={cls}
                style={{ width: size, height: size }}
              />
            </div>

            <img
              src={pawIcon}
              alt="paw"
              onClick={() => handlePawClick(mem)}
              style={{
                position: "absolute",
                width: 25,
                height: 25,
                cursor: "pointer",
                pointerEvents: "auto",
                ...(mem.type === "achievement"
                  ? { bottom: 350, left: 280 }
                  : { top: 0, right: 0 }),
              }}
            />
          </motion.div>
        );
      })}

      {popup && popupData && (
        <div className="memory-popup">
          <div
            className={`popup-card ${
              popupData.type === "achievement"
                ? "popup-lantern"
                : popupData.type === "happy"
                  ? "popup-flower"
                  : "popup-leaf"
              }`}
          >
            <h2>{popupData.title}</h2>
            <p>{popupData.description}</p>
            <button onClick={() => setPopup(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivingTree;
