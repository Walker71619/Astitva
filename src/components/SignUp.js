import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Update displayName in Auth profile
      await updateProfile(user, { displayName: name });

      // 3️⃣ Create default personal + public profile in Realtime Database
      await set(ref(database, `users/${user.uid}`), {
        personal: {
          name: name,
          email: email,
          bio: "",
          avatar: ""
        },
        public: {
          displayName: name,
          bio: "",
          avatar: ""
        }
      });

      alert("Sign up successful!");
      navigate("/dashboard");
    } catch (err) {
      alert("Error signing up: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
}
