// src/views/KarmicAI.js
import React, { useEffect, useState } from "react";
import { database, auth } from "../firebase";
import { ref, onValue } from "firebase/database";
import "../views/karmic.css";

const KarmicAI = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    if (!auth.currentUser) return;

    const uid = auth.currentUser.uid;
    setCurrentUserId(uid);

    const profileRef = ref(database, "publicProfiles");

    onValue(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();

        // Convert object to array with UID
        const profileArray = Object.keys(data).map((key) => ({
          uid: key,
          ...data[key],
        }));

        // Separate current user's profile
        const currentUserProfile = profileArray.find((p) => p.uid === uid);
        const otherProfiles = profileArray.filter((p) => p.uid !== uid);

        // Merge: current user first
        const mergedProfiles = currentUserProfile
          ? [currentUserProfile, ...otherProfiles]
          : otherProfiles;

        setProfiles(mergedProfiles);
      } else {
        setProfiles([]);
      }
    });
  }, []);

  return (
    <div className="karmic-page">
      <h1 className="karmic-title">Karmic AI Profiles</h1>

      {profiles.length === 0 ? (
        <p className="karmic-empty">No public profiles yet...</p>
      ) : (
        <div className="profile-carousel">
          {profiles.map((profile) => (
            <div key={profile.uid} className="profile-card">
              <img
                src={profile.avatar || "https://via.placeholder.com/150"}
                alt={profile.displayName || "User"}
                className="profile-avatar"
              />
              <h2 className="profile-name">{profile.displayName || "Anonymous"}</h2>
              <p className="profile-bio">{profile.bio || "No bio available"}</p>
              <p className="profile-karma">Karma: {profile.karma || "🌟 Pending"}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KarmicAI;
