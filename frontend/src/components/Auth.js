import React, { useState } from "react";
import { auth, firestore } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const toggleForm = () => setIsSignUp(!isSignUp);

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Save default profile in Firestore
      await setDoc(doc(firestore, "users", user.uid), {
        personal: { name, email: user.email, bio: "", avatar: "" },
        public: { displayName: name, bio: "", avatar: "" }
      });

      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>

      <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
        {isSignUp && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
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

        <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>

      <div className="toggle-auth">
        {isSignUp ? (
          <>
            Already have an account? <span onClick={toggleForm}>Sign In</span>
          </>
        ) : (
          <>
            Don't have an account? <span onClick={toggleForm}>Sign Up</span>
          </>
        )}
      </div>
    </div>
  );
}