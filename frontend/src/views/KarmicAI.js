import React, { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../firebase";

const KarmicAI = ({ userId }) => {
  const [publicProfile, setPublicProfile] = useState(null);
  const [privateProfile, setPrivateProfile] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const publicRef = ref(database, `users/${userId}/publicProfile`);
    const privateRef = ref(database, `users/${userId}/privateProfile`);

    // Fetch public profile
    onValue(publicRef, (snapshot) => {
      if (snapshot.exists()) {
        setPublicProfile(snapshot.val());
      }
    });

    // Fetch private profile
    onValue(privateRef, (snapshot) => {
      if (snapshot.exists()) {
        setPrivateProfile(snapshot.val());
      }
    });
  }, [userId]); // only depends on userId

  return (
    <div className="karmic-ai">
      <h2>🌌 Karmic AI Insights</h2>

      {/* Public Data */}
      <div className="ai-section">
        <h3>Public Reflections</h3>
        {publicProfile ? (
          <>
            <p><strong>Fears:</strong> {publicProfile.fears}</p>
            <p><strong>Goals:</strong> {publicProfile.goals}</p>
            <p><strong>Thoughts:</strong> {publicProfile.thoughts}</p>
            <p><strong>Issues:</strong> {publicProfile.issues}</p>
          </>
        ) : (
          <p>No public data yet.</p>
        )}
      </div>

      {/* Private Data */}
      <div className="ai-section private">
        <h3>Private Memories</h3>
        {privateProfile ? (
          <>
            <p><strong>Emotions:</strong> {privateProfile.emotions}</p>
            <p><strong>Memories:</strong> {privateProfile.memories}</p>
            <p><strong>Reflections:</strong> {privateProfile.reflections}</p>
          </>
        ) : (
          <p>No private data yet.</p>
        )}
      </div>
    </div>
  );
};

export default KarmicAI;
