// src/views/KarmicAI.js
import React, { useState, useEffect } from "react";
import { ref, set, get, child } from "firebase/database";
import { database } from "../firebase";
import "./karmic.css";

// Dummy logged-in user (replace later with auth user ID/email)
const currentUserId = "user123";

const Tribes = () => {
  const [profiles, setProfiles] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    tribe: "",
    tags: "",
    bio: "",
    interests: "",
    goals: "",
    image: "",
  });
  const [hasProfile, setHasProfile] = useState(false); // toggle for form vs profiles
  const [loading, setLoading] = useState(true);

  // Load all profiles from Firebase
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, "tribes"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const allProfiles = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setProfiles(allProfiles);

          // Check if current user already has profile
          if (data[currentUserId]) {
            setFormData(data[currentUserId]);
            setHasProfile(true);
          }
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  // Handle input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image" && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Save profile
  const handleSaveProfile = async () => {
    if (!formData.name || !formData.tribe) {
      alert("Please fill in Name and Tribe at minimum");
      return;
    }
    try {
      await set(ref(database, "tribes/" + currentUserId), {
        ...formData,
        tags: formData.tags.split(",").map((t) => t.trim()),
      });
      setHasProfile(true); // hide form after save
      alert("Profile saved!");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (loading) return <p>Loading profiles...</p>;

  return (
    <div className="karmic-page">
      {!hasProfile ? (
        /* ---------- PROFILE CREATION FORM ---------- */
        <div className="form-container">
          <h2>Create Your Tribe Profile</h2>
          <input
            type="text"
            name="name"
            placeholder="Name (eg: Mahira)"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="tribe"
            placeholder="Tribe (eg: Inner Peace)"
            value={formData.tribe}
            onChange={handleChange}
          />
          <input
            type="text"
            name="tags"
            placeholder="Tags (eg: Anxiety, Focus, Calm)"
            value={formData.tags}
            onChange={handleChange}
          />
          <textarea
            name="bio"
            placeholder="Short Bio (eg: I love meditation...)"
            value={formData.bio}
            onChange={handleChange}
          />
          <textarea
            name="interests"
            placeholder="Interests (eg: Art, Music, Yoga)"
            value={formData.interests}
            onChange={handleChange}
          />
          <textarea
            name="goals"
            placeholder="Goals (eg: Build focus, reduce stress)"
            value={formData.goals}
            onChange={handleChange}
          />
          <label className="file-upload">
            Upload Profile Picture:
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
          </label>
          {formData.image && (
            <img src={formData.image} alt="preview" className="preview-img" />
          )}
          <button className="save-btn" onClick={handleSaveProfile}>
            Save Profile
          </button>
        </div>
      ) : (
        /* ---------- PROFILES VIEW ---------- */
        <div className="tribe-container">
          {profiles.map((profile, index) => (
            <div
              className="tribe-card"
              key={index}
              style={{
                backgroundImage: `url(${profile.image || ""})`,
              }}
            >
              <div className="tribe-content">
                <h3>{profile.name}</h3>
                <p>
                  <strong>Tribe:</strong> {profile.tribe}
                </p>
                {profile.bio && <p>{profile.bio}</p>}
                <p>
                  <strong>Interests:</strong> {profile.interests}
                </p>
                <p>
                  <strong>Goals:</strong> {profile.goals}
                </p>
                <div className="tags">
                  {profile.tags?.map((tag, idx) => (
                    <span className="tag" key={idx}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {/* Edit button for current user */}
          <button
            className="edit-btn"
            onClick={() => setHasProfile(false)}
          >
            Edit My Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Tribes;
