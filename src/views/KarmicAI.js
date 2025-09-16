// src/views/KarmicAI.js
import React, { useState, useEffect } from "react";
import { ref, set, get, child } from "firebase/database";
import { database } from "../firebase";
import "./karmic.css";

// Dummy logged-in user (replace later with auth)
const currentUserId = "user123";

const Tribes = () => {
  const [profiles, setProfiles] = useState([]);
  const [formData, setFormData] = useState({
    name: { value: "", visibility: "public" },
    tribe: { value: "", visibility: "public" },
    tagline: { value: "", visibility: "public" },
    interests: { value: "", visibility: "public" },
    skills: { value: "", visibility: "public" },
    goals: { value: "", visibility: "private" },
    notes: { value: "", visibility: "private" },
    image: { value: "", visibility: "public" },
  });
  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load profiles from Firebase
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, "users"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const allProfiles = Object.keys(data).map((key) => ({
            id: key,
            ...data[key].profile,
            image: data[key].image,
          }));
          setProfiles(allProfiles);

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
  const handleChange = (e, fieldName) => {
    const { value, type, files } = e.target;
    if (type === "file" && files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({
          ...formData,
          [fieldName]: { ...formData[fieldName], value: reader.result },
        });
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({
        ...formData,
        [fieldName]: { ...formData[fieldName], value },
      });
    }
  };

  // Handle visibility toggle
  const toggleVisibility = (fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: {
        ...formData[fieldName],
        visibility:
          formData[fieldName].visibility === "public" ? "private" : "public",
      },
    });
  };

  // Save profile
  const handleSaveProfile = async () => {
    if (!formData.name.value || !formData.tribe.value) {
      alert("Please fill in Name and Tribe at minimum");
      return;
    }
    try {
      await set(ref(database, "users/" + currentUserId), formData);
      setHasProfile(true);
      alert("Profile saved!");
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  if (loading) return <p>Loading profiles...</p>;

  return (
    <div className="karmic-page">
      {!hasProfile ? (
        <div className="form-container">
          <h2>Create Your Tribe Profile</h2>

          {Object.keys(formData).map((field) => (
            <div key={field} className="form-field">
              {field !== "image" ? (
                <>
                  <label>
                    {field.charAt(0).toUpperCase() + field.slice(1)} -{" "}
                    {formData[field].visibility === "public"
                      ? "Public"
                      : "Private"}
                  </label>
                  {field === "notes" || field === "goals" ? (
                    <textarea
                      placeholder={`Enter your ${field} here`}
                      value={formData[field].value}
                      onChange={(e) => handleChange(e, field)}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={`Enter your ${field} here`}
                      value={formData[field].value}
                      onChange={(e) => handleChange(e, field)}
                    />
                  )}
                  <button
                    type="button"
                    className="visibility-btn"
                    onClick={() => toggleVisibility(field)}
                  >
                    Toggle {formData[field].visibility}
                  </button>
                </>
              ) : (
                <>
                  <label>Profile Image - {formData.image.visibility}</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleChange(e, "image")}
                  />
                  {formData.image.value && (
                    <img
                      src={formData.image.value}
                      alt="preview"
                      className="preview-img"
                    />
                  )}
                  <button
                    type="button"
                    className="visibility-btn"
                    onClick={() => toggleVisibility("image")}
                  >
                    Toggle {formData.image.visibility}
                  </button>
                </>
              )}
            </div>
          ))}

          <button className="save-btn" onClick={handleSaveProfile}>
            Save Profile
          </button>
        </div>
      ) : (
        <div className="tribe-container">
          {profiles.map((profile, index) => (
            <div
              className="tribe-card"
              key={index}
              style={{ backgroundImage: `url(${profile.image?.value || ""})` }}
            >
              <div className="tribe-content">
                {Object.keys(profile).map((key) => {
                  if (key === "image") return null; // skip image
                  if (profile[key].visibility === "public" || profile.id === currentUserId)
                    return (
                      <p key={key}>
                        <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                        {profile[key].value}
                      </p>
                    );
                  return null;
                })}
              </div>
            </div>
          ))}
          <button className="edit-btn" onClick={() => setHasProfile(false)}>
            Edit My Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Tribes;
