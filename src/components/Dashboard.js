import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { auth, database, storage } from "../firebase";
import { ref as dbRef, onValue, update, get, set } from "firebase/database";
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import "./Dashboard.css";

export default function Dashboard() {
  const [personal, setPersonal] = useState({ name: "", email: "", bio: "", avatar: "" });
  const [publicProfile, setPublicProfile] = useState({ displayName: "", bio: "", avatar: "" });
  const [activeTab, setActiveTab] = useState("personal");
  const navigate = useNavigate();

  // Load profile data
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) return navigate("/signin");

      const userId = user.uid;
      const userRef = dbRef(database, `users/${userId}`);

      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        // Create default profile if missing
        await set(userRef, {
          personal: {
            name: user.displayName || "",
            email: user.email,
            bio: "",
            avatar: ""
          },
          public: {
            displayName: user.displayName || "",
            bio: "",
            avatar: ""
          }
        });
      }

      // Listen for realtime updates
      onValue(userRef, (snap) => {
        const data = snap.val();
        setPersonal(data.personal || { name: "", email: "", bio: "", avatar: "" });
        setPublicProfile(data.public || { displayName: data.personal?.name || "", bio: "", avatar: data.personal?.avatar || "" });
      });
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Update profile handlers
  const handleUpdatePersonal = () => {
    update(dbRef(database, `users/${auth.currentUser.uid}/personal`), personal)
      .then(() => alert("Personal profile updated!"))
      .catch((err) => alert(err.message));
  };

  const handleUpdatePublic = () => {
    update(dbRef(database, `users/${auth.currentUser.uid}/public`), publicProfile)
      .then(() => alert("Public profile updated!"))
      .catch((err) => alert(err.message));
  };

  // Avatar upload
  const handleAvatarUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const storageReference = storageRef(storage, `avatars/${auth.currentUser.uid}/${type}-${file.name}`);
    try {
      await uploadBytes(storageReference, file);
      const url = await getDownloadURL(storageReference);

      if (type === "personal") setPersonal({ ...personal, avatar: url });
      else setPublicProfile({ ...publicProfile, avatar: url });
    } catch (err) {
      alert("Error uploading avatar: " + err.message);
    }
  };

  return (
    <div className="dashboard">
      <Navbar />

      <section className="dashboard-hero">
        <div className="tabs">
          <button className={activeTab === "personal" ? "active" : ""} onClick={() => setActiveTab("personal")}>
            Personal Profile
          </button>
          <button className={activeTab === "public" ? "active" : ""} onClick={() => setActiveTab("public")}>
            Public Profile
          </button>
        </div>

        {activeTab === "personal" && (
          <div className="profile-card">
            <img src={personal.avatar || "https://via.placeholder.com/150"} alt="Avatar" className="avatar" />
            <input type="file" accept="image/*" onChange={(e) => handleAvatarUpload(e, "personal")} />
            <h2>{personal.name}</h2>
            <p>{personal.email}</p>
            <textarea
              placeholder="Your bio..."
              value={personal.bio}
              onChange={(e) => setPersonal({ ...personal, bio: e.target.value })}
            />
            <button onClick={handleUpdatePersonal}>Update Personal Profile</button>
          </div>
        )}

        {activeTab === "public" && (
          <div className="profile-card">
            <img src={publicProfile.avatar || "https://via.placeholder.com/150"} alt="Avatar" className="avatar" />
            <input type="file" accept="image/*" onChange={(e) => handleAvatarUpload(e, "public")} />
            <h2>{publicProfile.displayName}</h2>
            <textarea
              placeholder="Public bio..."
              value={publicProfile.bio}
              onChange={(e) => setPublicProfile({ ...publicProfile, bio: e.target.value })}
            />
            <button onClick={handleUpdatePublic}>Update Public Profile</button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
