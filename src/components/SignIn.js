import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, database } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { ref, get, set } from "firebase/database";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Sign in user with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2️⃣ Check if database node exists
      const userRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(userRef);

      if (!snapshot.exists()) {
        // 3️⃣ Create default personal + public profile if not exist
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

      navigate("/dashboard");
    } catch (err) {
      alert("Error signing in: " + err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSignIn}>
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
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
}
