// src/components/Popup.js
import React, { useEffect } from "react";
import "./Popup.css";

export default function Popup({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500); // auto close after 2.5s
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="popup">
      <p>{message}</p>
    </div>
  );
}
