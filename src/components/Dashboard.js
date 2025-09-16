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
  const [personal, setPersonal] = useState({
    name: "", email: "", bio: "", avatar: "", skills: "", hobbies: "", goals: "", socialLinks: ""
  });

  const [publicProfile, setPublicProfile] = useState({
    displayName: "", bio: "", avatar: "", interests: "", favoriteQuote: "", socialLinks: ""
  });

  const [activeTab, setActiveTab] = useState("personal");
  const navigate = useNavigate();

  // Load profile data
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (!user) return navigate("/auth");

      const userId = user.uid;
      const userRef = dbRef(database, `users/${userId}`);

      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        await set(userRef, {
          personal: { name: user.displayName || "", email: user.email, bio: "", avatar: "", skills: "", hobbies: "", goals: "", socialLinks: "" },
          public: { displayName: user.displayName || "", bio: "", avatar: "", interests: "", favoriteQuote: "", socialLinks: "" }
        });
      }

      onValue(userRef, (snap) => {
        const data = snap.val();
        setPersonal(data.personal || {});
        setPublicProfile(data.public || {});
      });
    });

    return () => unsubscribeAuth();
  }, [navigate]);

  // Update handlers
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
        {/* Tabs */}
        <div className="tabs">
          <button className={activeTab === "personal" ? "active" : ""} onClick={() => setActiveTab("personal")}>
            Personal Profile
          </button>
          <button className={activeTab === "public" ? "active" : ""} onClick={() => setActiveTab("public")}>
            Public Profile
          </button>
        </div>

        {/* Personal Profile */}
        {activeTab === "personal" && (
          <div className="profile-card">
            <img src={personal.avatar || "https://via.placeholder.com/150"} alt="Avatar" className="avatar" />
            <input type="file" accept="image/*" onChange={(e) => handleAvatarUpload(e, "personal")} />
            <input type="text" value={personal.name} placeholder="Name" onChange={(e) => setPersonal({ ...personal, name: e.target.value })} />
            <p>{personal.email}</p>
            <textarea placeholder="Bio" value={personal.bio} onChange={(e) => setPersonal({ ...personal, bio: e.target.value })} />
            <input type="text" placeholder="Skills" value={personal.skills} onChange={(e) => setPersonal({ ...personal, skills: e.target.value })} />
            <input type="text" placeholder="Hobbies" value={personal.hobbies} onChange={(e) => setPersonal({ ...personal, hobbies: e.target.value })} />
            <input type="text" placeholder="Goals" value={personal.goals} onChange={(e) => setPersonal({ ...personal, goals: e.target.value })} />
            <input type="text" placeholder="Social Links" value={personal.socialLinks} onChange={(e) => setPersonal({ ...personal, socialLinks: e.target.value })} />
            <button onClick={handleUpdatePersonal}>Update Personal Profile</button>
          </div>
        )}

        {/* Public Profile */}
        {activeTab === "public" && (
          <div className="profile-card">
            <img src={publicProfile.avatar || "https://via.placeholder.com/150"} alt="Avatar" className="avatar" />
            <input type="file" accept="image/*" onChange={(e) => handleAvatarUpload(e, "public")} />
            <input type="text" placeholder="Display Name" value={publicProfile.displayName} onChange={(e) => setPublicProfile({ ...publicProfile, displayName: e.target.value })} />
            <textarea placeholder="Public Bio" value={publicProfile.bio} onChange={(e) => setPublicProfile({ ...publicProfile, bio: e.target.value })} />
            <input type="text" placeholder="Interests" value={publicProfile.interests} onChange={(e) => setPublicProfile({ ...publicProfile, interests: e.target.value })} />
            <input type="text" placeholder="Favorite Quote" value={publicProfile.favoriteQuote} onChange={(e) => setPublicProfile({ ...publicProfile, favoriteQuote: e.target.value })} />
            <input type="text" placeholder="Social Links" value={publicProfile.socialLinks} onChange={(e) => setPublicProfile({ ...publicProfile, socialLinks: e.target.value })} />
            <button onClick={handleUpdatePublic}>Update Public Profile</button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}
