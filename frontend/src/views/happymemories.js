import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import "./happymemories.css";
import HappyBg from "../images/happybg.jpg";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";
import { database, auth } from "../firebase"; 

function HappyMemories() {
  const [memories, setMemories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [input, setInput] = useState("");
  const [user, setUser] = useState(null);

  // 🔹 Track logged-in user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => setUser(u));
    return () => unsubscribe();
  }, []);

  // 🔹 Load memories from Firestore (only current user's)
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(database, "happyMemories"),
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

  // 🔹 Add new memory
  const addMemory = async () => {
    if (!input.trim() || !user) return;

    await addDoc(collection(database, "happyMemories"), {
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

      {/* Main Happy Memories Page */}
      <div
        className="happy-page"
        style={{
          backgroundImage: `url(${HappyBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h1 className="happy-title">Happy Memories</h1>

        {/* Button to open form */}
        <button className="open-form-btn" onClick={() => setShowForm(true)}>
          + Add Memory
        </button>

        {/* Memory Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-form" onClick={(e) => e.stopPropagation()}>
              <h2>Write Your Happy Moment</h2>
              <textarea
                placeholder="Dear Diary, today I felt so happy because..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="form-textarea"
              />
              <button className="add-btn" onClick={addMemory}>
                Add Memory
              </button>
            </div>
          </div>
        )}

        {/* Floating Memory Cards */}
        <div className="memory-container">
          {memories.map((mem) => (
            <div key={mem.id} className="floating-card happy-card">
              <p>{mem.text}</p>
            </div>
          ))}
          {memories.length === 0 && <p className="no-memories">No happy memories yet...</p>}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default HappyMemories;
