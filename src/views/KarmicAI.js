// src/views/KarmicAI.js
import React, { useState, useEffect } from "react";
import { ref, set, get, child, push, onValue } from "firebase/database";
import { database } from "../firebase";
import "./karmic.css";

const currentUserId = "user123"; // replace with auth later

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
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // 🔹 Load profiles
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, "users"));
        if (snapshot.exists()) {
          const data = snapshot.val();
          const allProfiles = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
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

  // 🔹 Handle input change
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

  // 🔹 Toggle visibility
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

  // 🔹 Save profile
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

  // 🔹 Join tribe
  const joinTribe = async (tribeName) => {
    try {
      await set(ref(database, `tribes/${tribeName}/members/${currentUserId}`), {
        name: formData.name.value,
      });
      // subscribe to chat messages
      onValue(ref(database, `tribes/${tribeName}/chat`), (snapshot) => {
        if (snapshot.exists()) {
          setChatMessages(Object.values(snapshot.val()));
        }
      });
      alert(`You joined the ${tribeName} tribe!`);
    } catch (error) {
      console.error("Error joining tribe:", error);
    }
  };

  // 🔹 Send chat message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    const tribeName = formData.tribe.value;
    try {
      await push(ref(database, `tribes/${tribeName}/chat`), {
        user: formData.name.value,
        message: newMessage,
        timestamp: Date.now(),
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // 🔹 AI-like matching (simple overlap)
  const suggestMatches = () => {
    if (!formData.interests.value) return [];
    const myInterests = formData.interests.value.toLowerCase().split(",");
    return profiles.filter(
      (p) =>
        p.id !== currentUserId &&
        p.interests &&
        myInterests.some((i) =>
          p.interests.value.toLowerCase().includes(i.trim())
        )
    );
  };

  if (loading) return <p>Loading profiles...</p>;

  return (
    <div className="karmic-page">
      {!hasProfile ? (
        // 🔹 Form
        <div className="form-container">
          <h2>Create Your Tribe Profile</h2>
          {Object.keys(formData).map((field) => (
            <div key={field} className="form-field">
              {field !== "image" ? (
                <>
                  <label>
                    {field.charAt(0).toUpperCase() + field.slice(1)} -{" "}
                    {formData[field].visibility}
                  </label>
                  {field === "notes" || field === "goals" ? (
                    <textarea
                      placeholder={`Enter your ${field}`}
                      value={formData[field].value}
                      onChange={(e) => handleChange(e, field)}
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={`Enter your ${field}`}
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
        // 🔹 Profiles + Chat
        <>
          <h2>Explore Tribes</h2>
          <div className="tribe-container">
            {profiles.map((profile, index) => (
              <div
                className="tribe-card"
                key={index}
                style={{
                  backgroundImage: `url(${profile.image?.value || ""})`,
                }}
              >
                <div className="tribe-content">
                  {Object.keys(profile).map((key) => {
                    if (key === "image") return null;
                    if (
                      profile[key].visibility === "public" ||
                      profile.id === currentUserId
                    )
                      return (
                        <p key={key}>
                          <strong>
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                          </strong>{" "}
                          {profile[key].value}
                        </p>
                      );
                    return null;
                  })}
                  {profile.id !== currentUserId && (
                    <button
                      className="join-btn"
                      onClick={() => joinTribe(profile.tribe.value)}
                    >
                      Join {profile.tribe.value} Tribe
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 🔹 Suggested Matches */}
          <h3>Suggested Matches</h3>
          <div className="match-container">
            {suggestMatches().map((match) => (
              <div key={match.id} className="match-card">
                <p>{match.name.value} (common interest)</p>
              </div>
            ))}
          </div>

          {/* 🔹 Tribe Chat */}
          <h3>Tribe Chat ({formData.tribe.value})</h3>
          <div className="chat-box">
            <div className="messages">
              {chatMessages.map((msg, i) => (
                <p key={i}>
                  <strong>{msg.user}:</strong> {msg.message}
                </p>
              ))}
            </div>
            <div className="chat-input">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={sendMessage}>Send</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Tribes;
