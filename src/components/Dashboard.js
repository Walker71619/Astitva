import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import { auth, database } from "../firebase";
import { ref, onValue, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import "./Dashboard.css";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const profileRef = ref(database, `users/${userId}`);

        const unsubscribeDb = onValue(profileRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setProfile(data);
            setBio(data.bio || "");
            setAvatar(data.avatar || "");
          } else {
            setProfile(null);
          }
        });

        return () => unsubscribeDb();
      } else {
        navigate("/signin");
      }
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  const handleUpdateProfile = () => {
    if (!profile) return;
    const userId = auth.currentUser.uid;
    const userRef = ref(database, `users/${userId}`);

    update(userRef, {
      bio,
      avatar,
    })
      .then(() => alert("Profile updated successfully!"))
      .catch((err) => alert("Error updating profile: " + err.message));
  };

  if (!profile) {
    return (
      <div className="dashboard">
        <Navbar />
        <div style={{ textAlign: "center", marginTop: "10rem", color: "#e0e6ff" }}>
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar />

      <section className="dashboard-hero">
        <div className="profile-card">
          <img
            src={avatar || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="avatar"
          />
          <h2>{profile.name}</h2>
          <p>{profile.email}</p>

          <textarea
            placeholder="Your bio..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />

          <input
            type="text"
            placeholder="Avatar URL"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />

          <button onClick={handleUpdateProfile}>Update Profile</button>

          <div className="stats">
            <div>
              <h3>{profile.stats?.cardsCompleted || 0}</h3>
              <p>Cards Completed</p>
            </div>
            <div>
              <h3>{profile.stats?.streak || 0}</h3>
              <p>Daily Streak</p>
            </div>
            <div>
              <h3>{profile.stats?.achievements || 0}</h3>
              <p>Achievements</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
