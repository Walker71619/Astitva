import React, { useState, useEffect } from "react";
import { auth, firestore, storage } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./Dashboard.css";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("private");
  const [userId, setUserId] = useState(null);

  // Private Journal state
  const [privateData, setPrivateData] = useState({
    memories: "",
    emotions: "",
    privateGoals: "",
    reflections: "",
  });

  // Public Profile state
  const [publicData, setPublicData] = useState({
    displayName: "",
    bio: "",
    interests: "",
    fears: "",
    issues: "",
    goals: "",
    thoughts: "",
    favoriteQuote: "",
    socialLinks: "",
    avatar: "",
  });

  // ✅ Track login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        loadUserData(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  // ✅ Load user profile from Firestore
  const loadUserData = async (uid) => {
    try {
      const userRef = doc(firestore, "users", uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.private) setPrivateData(data.private);
        if (data.public) setPublicData(data.public);
      }
    } catch (err) {
      console.error("Error loading user data:", err);
    }
  };

  // ✅ Save Private Journal
  const handleSavePrivate = async () => {
    if (!userId) return;
    try {
      await setDoc(
        doc(firestore, "users", userId),
        { private: privateData },
        { merge: true }
      );
      alert("✅ Private Journal saved!");
    } catch (err) {
      console.error("Error saving private journal:", err);
    }
  };

  // ✅ Save Public Profile
  const handleSavePublic = async () => {
    if (!userId) return;
    try {
      await setDoc(
        doc(firestore, "users", userId),
        { public: publicData },
        { merge: true }
      );
      alert("🌟 Public Profile saved!");
    } catch (err) {
      console.error("Error saving public profile:", err);
    }
  };

  // ✅ Upload Avatar
  const handleAvatarUpload = async (e) => {
    if (!userId) return;
    const file = e.target.files[0];
    if (!file) return;

    try {
      const storageRef = ref(storage, `avatars/${userId}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      setPublicData((prev) => ({ ...prev, avatar: url }));
    } catch (err) {
      console.error("Error uploading avatar:", err);
    }
  };

  return (
    <div className="dashboard-hero">
      <div className="tabs">
        <button
          className={activeTab === "private" ? "active" : ""}
          onClick={() => setActiveTab("private")}
        >
          Private Journal
        </button>
        <button
          className={activeTab === "public" ? "active" : ""}
          onClick={() => setActiveTab("public")}
        >
          Public Profile
        </button>
      </div>

      {/* PRIVATE JOURNAL */}
      {activeTab === "private" && (
        <div className="profile-card">
          <h2>My Private Journal</h2>
          <textarea
            placeholder="Memories"
            value={privateData.memories}
            onChange={(e) =>
              setPrivateData({ ...privateData, memories: e.target.value })
            }
          />
          <textarea
            placeholder="Emotions"
            value={privateData.emotions}
            onChange={(e) =>
              setPrivateData({ ...privateData, emotions: e.target.value })
            }
          />
          <textarea
            placeholder="Private Goals"
            value={privateData.privateGoals}
            onChange={(e) =>
              setPrivateData({ ...privateData, privateGoals: e.target.value })
            }
          />
          <textarea
            placeholder="Reflections"
            value={privateData.reflections}
            onChange={(e) =>
              setPrivateData({ ...privateData, reflections: e.target.value })
            }
          />
          <button onClick={handleSavePrivate}>Save Private Journal</button>
        </div>
      )}

      {/* PUBLIC PROFILE */}
      {activeTab === "public" && (
        <div className="profile-card">
          <h2>My Public Profile</h2>
          <input type="file" onChange={handleAvatarUpload} />
          {publicData.avatar && (
            <img src={publicData.avatar} alt="Avatar" className="avatar" />
          )}
          <input
            type="text"
            placeholder="Display Name"
            value={publicData.displayName}
            onChange={(e) =>
              setPublicData({ ...publicData, displayName: e.target.value })
            }
          />
          <textarea
            placeholder="Public Bio"
            value={publicData.bio}
            onChange={(e) =>
              setPublicData({ ...publicData, bio: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Interests"
            value={publicData.interests}
            onChange={(e) =>
              setPublicData({ ...publicData, interests: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Fears"
            value={publicData.fears}
            onChange={(e) =>
              setPublicData({ ...publicData, fears: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Issues"
            value={publicData.issues}
            onChange={(e) =>
              setPublicData({ ...publicData, issues: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Goals"
            value={publicData.goals}
            onChange={(e) =>
              setPublicData({ ...publicData, goals: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Thoughts"
            value={publicData.thoughts}
            onChange={(e) =>
              setPublicData({ ...publicData, thoughts: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Favorite Quote"
            value={publicData.favoriteQuote}
            onChange={(e) =>
              setPublicData({ ...publicData, favoriteQuote: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Social Links"
            value={publicData.socialLinks}
            onChange={(e) =>
              setPublicData({ ...publicData, socialLinks: e.target.value })
            }
          />
          <button onClick={handleSavePublic}>Save Public Profile</button>
        </div>
      )}
    </div>
  );
}
