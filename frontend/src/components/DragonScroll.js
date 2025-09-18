import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dragon from "../images/dragon.gif";

const DragonCursor = () => {
  const [cursor, setCursor] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Track mouse
  useEffect(() => {
    const move = (e) => setCursor({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  // Hide default cursor globally
  useEffect(() => {
    document.body.style.cursor = "none";
    return () => {
      document.body.style.cursor = "default";
    };
  }, []);

  return (
    <motion.img
      src={dragon}
      alt="dragon-cursor"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100px",      
        height: "auto",
        zIndex: 9999,        
        pointerEvents: "none" 
      }}
      animate={{
        x: cursor.x - 25,    
        y: cursor.y - 25
      }}
      transition={{
        type: "spring",
        stiffness: 400,    
        damping: 20
      }}
    />
  );
};

export default DragonCursor;
