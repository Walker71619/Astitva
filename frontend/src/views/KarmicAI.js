import React, { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore, auth } from "../firebase";

const KarmicAI = ({ userId }) => {
  const [publicProfile, setPublicProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no UID provided, fallback to currently logged-in user
    const uid = userId || (auth.currentUser && auth.currentUser.uid);
    if (!uid) {
      console.warn("No UID available for fetching public profile");
      setLoading(false);
      return;
    }

    const userDocRef = doc(firestore, "users", uid);

    // Real-time listener for public profile
    const unsubscribe = onSnapshot(
      userDocRef,
      (docSnap) => {
        setLoading(false);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Firestore doc data:", data); // debug
          if (data.public) {
            setPublicProfile(data.public);
          } else {
            setPublicProfile(null);
          }
        } else {
          console.log("No document found for UID:", uid);
          setPublicProfile(null);
        }
      },
      (error) => {
        setLoading(false);
        console.error("Error fetching public profile:", error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  if (loading) return <p>Loading public profile...</p>;

  return (
    <div className="karmic-ai">
      <h2>🌌 Karmic AI Insights</h2>

      {/* Public Data */}
      <div className="ai-section">
        <h3>Public Reflections</h3>
        {publicProfile ? (
          <>
            <p><strong>Fears:</strong> {publicProfile.fears || "—"}</p>
            <p><strong>Goals:</strong> {publicProfile.goals || "—"}</p>
            <p><strong>Thoughts:</strong> {publicProfile.thoughts || "—"}</p>
            <p><strong>Issues:</strong> {publicProfile.issues || "—"}</p>
          </>
        ) : (
          <p>No public data yet.</p>
        )}
      </div>
    </div>
  );
};

export default KarmicAI;
