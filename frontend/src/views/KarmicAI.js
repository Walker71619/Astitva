import React, { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { firestore, auth } from "../firebase";
import "./KarmicAI.css"; // make sure to update with the carousel CSS

const KarmicAI = () => {
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const myUid = auth.currentUser?.uid;

  useEffect(() => {
    const usersColRef = collection(firestore, "users");

    const unsubscribe = onSnapshot(
      usersColRef,
      (snapshot) => {
        setLoading(false);
        const profiles = [];
        let me = null;

        snapshot.forEach((doc) => {
          const data = doc.data();
          if (data.public) {
            const profile = { uid: doc.id, ...data.public };
            if (doc.id === myUid) {
              me = profile;
            } else {
              profiles.push(profile);
            }
          }
        });

        setMyProfile(me);
        setPublicProfiles(profiles);
      },
      (error) => {
        setLoading(false);
        console.error("Error fetching public profiles:", error);
      }
    );

    return () => unsubscribe();
  }, [myUid]);

  if (loading) return <p>Loading public profiles...</p>;

  return (
    <div className="karmic-container">
      <h2>🌌 Karmic AI Insights</h2>

      {/* My Profile */}
      {myProfile && (
        <div className="profile-card highlight">
          <h3>🌟 My Profile</h3>
          {myProfile.avatar && (
            <img src={myProfile.avatar} alt="Avatar" />
          )}
          <p><strong>Fears:</strong> {myProfile.fears || "—"}</p>
          <p><strong>Goals:</strong> {myProfile.goals || "—"}</p>
          <p><strong>Thoughts:</strong> {myProfile.thoughts || "—"}</p>
          <p><strong>Issues:</strong> {myProfile.issues || "—"}</p>
        </div>
      )}

      {/* Other Users Carousel */}
      <div className="carousel">
        {publicProfiles.length > 0 ? (
          publicProfiles.map((profile) => (
            <div className="profile-card" key={profile.uid}>
              <h3>User: {profile.uid}</h3>
              {profile.avatar && (
                <img src={profile.avatar} alt="Avatar" />
              )}
              <p><strong>Fears:</strong> {profile.fears || "—"}</p>
              <p><strong>Goals:</strong> {profile.goals || "—"}</p>
              <p><strong>Thoughts:</strong> {profile.thoughts || "—"}</p>
              <p><strong>Issues:</strong> {profile.issues || "—"}</p>
            </div>
          ))
        ) : (
          <p>No other public profiles yet.</p>
        )}
      </div>
    </div>
  );
};

export default KarmicAI;
