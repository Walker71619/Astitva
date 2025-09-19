import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "./achievementmemories.css";
import AchievementBg from "../images/achievementbg.jpg";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";
import { database, auth } from "../firebase"; 

function AchievementMemories() {
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);

  // 🔹 Track logged-in user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => setUser(u));
    return () => unsubscribe();
  }, []);

  // 🔹 Load achievements for current user
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(database, "achievementMemories"),
      where("uid", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      const loadedMemories = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMemories(loadedMemories);
    });

    return () => unsubscribe();
  }, [user]);

  // 🔹 Add new achievement
  const addMemory = async () => {
    if (!input.trim() || !user) return;

    await addDoc(collection(database, "achievementMemories"), {
      uid: user.uid,
      text: input.trim(),
      createdAt: new Date(),
    });

    setInput("");
    setShowForm(false);
  };

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Main Achievement Page */}
      <div
        className="achievement-page"
        style={{
          backgroundImage: `url(${AchievementBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="achievement-title">Achievements</h1>

        {/* Button to open form */}
        <button className="open-form-btn" onClick={() => setShowForm(true)}>
          + Add Achievement
        </button>

        {/* Achievement Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div
              className="modal-form achievement-form"
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Celebrate Your Achievement</h2>
              <textarea
                placeholder="Today I achieved..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <button className="add-btn" onClick={addMemory}>
                Add Achievement
              </button>
            </div>
          </div>
        )}

        {/* Floating Memory Cards */}
        <div className="memory-container">
          {memories.map((mem) => (
            <div key={mem.id} className="floating-card achievement-card">
              <p>{mem.text}</p>
            </div>
          ))}
          {memories.length === 0 && <p className="no-memories">No achievements yet...</p>}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default AchievementMemories;
