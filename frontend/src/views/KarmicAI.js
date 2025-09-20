import React, { useState, useEffect, useRef } from "react";
import { collection, doc, onSnapshot, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { firestore, auth } from "../firebase";
import Navbar from "../components/navbar";
import Footer from "../components/footer"; // make sure Footer exists
import "./KarmicAI.css";

const storage = getStorage();

const KarmicAI = () => {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState(null);
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState("public");
  const [friends, setFriends] = useState([]);
  const [privateMessages, setPrivateMessages] = useState({});
  const [publicMessages, setPublicMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newPrivateMessages, setNewPrivateMessages] = useState({});

  const publicChatEndRef = useRef(null);
  const privateChatEndRefs = useRef({});
  const myUid = auth.currentUser?.uid;

  // --- Mount client ---
  useEffect(() => setMounted(true), []);

  // --- Track auth user ---
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsubscribe();
  }, []);

  // --- Fetch public profiles ---
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "users"),
      (snapshot) => {
        setLoading(false);
        const profiles = [];
        let me = null;

        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          if (data.public) {
            const profile = { uid: docSnap.id, ...data.public };
            if (docSnap.id === myUid) {
              me = profile;
              setFriends(data.friends || []);
            } else {
              profiles.push(profile);
            }
          }
        });

        setMyProfile(me);
        setPublicProfiles(profiles);
      },
      (err) => {
        setLoading(false);
        console.error("Error fetching public profiles:", err);
      }
    );

    return () => unsubscribe();
  }, [myUid]);

  // --- Fetch public chat ---
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(firestore, "publicChat"),
      (snapshot) => {
        const msgs = [];
        snapshot.forEach((docSnap) => msgs.push(docSnap.data()));
        msgs.sort((a, b) => a.timestamp - b.timestamp);
        setPublicMessages(msgs);

        setTimeout(
          () =>
            publicChatEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          50
        );
      }
    );
    return () => unsubscribe();
  }, []);

  // --- Fetch private chats ---
  useEffect(() => {
    if (!myUid) return;
    const unsubscribe = onSnapshot(
      collection(firestore, `privateChats/${myUid}/chats`),
      (snapshot) => {
        const msgsObj = {};
        snapshot.forEach(
          (docSnap) => (msgsObj[docSnap.id] = docSnap.data().messages || [])
        );
        setPrivateMessages(msgsObj);

        Object.keys(msgsObj).forEach((uid) => {
          setTimeout(
            () =>
              privateChatEndRefs.current[uid]?.scrollIntoView({
                behavior: "smooth",
              }),
            50
          );
        });
      }
    );
    return () => unsubscribe();
  }, [myUid]);

  // --- Send public message ---
  const sendPublicMessage = async () => {
    if (!newMessage.trim()) return;
    await setDoc(doc(firestore, "publicChat", Date.now().toString()), {
      sender: myUid,
      text: newMessage,
      timestamp: Date.now(),
    });
    setNewMessage("");
  };

  // --- Send private message ---
  const sendPrivateMessage = async (friendUid) => {
    const text = newPrivateMessages[friendUid]?.trim();
    if (!text) return;

    const chatRef1 = doc(firestore, `privateChats/${myUid}/chats/${friendUid}`);
    const chatRef2 = doc(
      firestore,
      `privateChats/${friendUid}/chats/${myUid}`
    );

    const chatSnap1 = await getDoc(chatRef1);
    const chatSnap2 = await getDoc(chatRef2);

    const messages1 = chatSnap1.exists() ? chatSnap1.data().messages : [];
    const messages2 = chatSnap2.exists() ? chatSnap2.data().messages : [];

    const newMsg = { sender: myUid, text, timestamp: Date.now() };

    await setDoc(chatRef1, { messages: [...messages1, newMsg] });
    await setDoc(chatRef2, { messages: [...messages2, newMsg] });

    setNewPrivateMessages((prev) => ({ ...prev, [friendUid]: "" }));
  };

  // --- Add friend ---
  const addFriend = async (friendUid) => {
    if (!friends.includes(friendUid) && myUid) {
      const newFriends = [...friends, friendUid];
      await setDoc(
        doc(firestore, "users", myUid),
        { friends: newFriends },
        { merge: true }
      );
      setFriends(newFriends);
    }
  };

  // --- Upload avatar ---
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !myUid) return;

    try {
      const storageRef = ref(storage, `avatars/${myUid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await setDoc(
        doc(firestore, "users", myUid),
        { public: { ...myProfile, avatar: url } },
        { merge: true }
      );
    } catch (err) {
      console.error("Avatar upload failed:", err);
    }
  };

  const getFriendName = (uid) => {
    const friend = publicProfiles.find((p) => p.uid === uid);
    return friend ? friend.displayName || "Unknown" : uid;
  };

  if (!mounted) return null;
  if (!user) return <p>Please log in to use Karmic AI</p>;
  if (loading) return <p>Loading profiles...</p>;

  return (
    <>
      <Navbar />
      <div className="karmic-container">
        <h2>🌌 Karmic AI Insights</h2>

        <div
          className={`chat-toggle ${chatOpen ? "open" : ""}`}
          onClick={() => setChatOpen(!chatOpen)}
        >
          {chatOpen ? "⮜" : "⮞"}
        </div>

        {chatOpen && (
          <div className="chat-panel">
            <div className="chat-tabs">
              <button
                onClick={() => setChatMode("public")}
                className={chatMode === "public" ? "active" : ""}
              >
                Public
              </button>
              <button
                onClick={() => setChatMode("private")}
                className={chatMode === "private" ? "active" : ""}
              >
                Private
              </button>
            </div>

            <div className="chat-messages">
              {chatMode === "public" && (
                <>
                  {publicMessages.map((msg, idx) => (
                    <p key={idx}>
                      <strong>
                        {msg.sender === myUid
                          ? "Me"
                          : getFriendName(msg.sender)}
                        :
                      </strong>{" "}
                      {msg.text}
                    </p>
                  ))}
                  <div ref={publicChatEndRef} />
                  <input
                    placeholder="Type message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendPublicMessage()}
                  />
                </>
              )}

              {chatMode === "private" &&
                friends.map((uid) => (
                  <div key={uid} className="private-chat-block">
                    <h4>Chat with {getFriendName(uid)}</h4>
                    {(privateMessages[uid] || []).map((msg, idx) => (
                      <p key={idx}>
                        <strong>
                          {msg.sender === myUid ? "Me" : getFriendName(msg.sender)}:
                        </strong>{" "}
                        {msg.text}
                      </p>
                    ))}
                    <div ref={(el) => (privateChatEndRefs.current[uid] = el)} />
                    <input
                      placeholder="Type message..."
                      value={newPrivateMessages[uid] || ""}
                      onChange={(e) =>
                        setNewPrivateMessages((prev) => ({
                          ...prev,
                          [uid]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && sendPrivateMessage(uid)
                      }
                    />
                  </div>
                ))}
            </div>
          </div>
        )}

        {myProfile && (
          <div className="profile-card highlight">
            <h3>🌟 My Profile — {myProfile.displayName}</h3>
            <div className="image-container">
              <img
                src={myProfile.avatar || "https://via.placeholder.com/120"}
                alt="Avatar"
              />
              <label htmlFor="avatar-upload" className="upload-label">
                +
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: "none" }}
              />
            </div>
            <p><strong>Fears:</strong> {myProfile.fears || "—"}</p>
            <p><strong>Goals:</strong> {myProfile.goals || "—"}</p>
            <p><strong>Thoughts:</strong> {myProfile.thoughts || "—"}</p>
            <p><strong>Issues:</strong> {myProfile.issues || "—"}</p>
          </div>
        )}

        <div className="carousel">
          {publicProfiles.map((profile) => (
            <div className="profile-card" key={profile.uid}>
              <h3>{profile.displayName}</h3>
              {profile.avatar && (
                <img src={profile.avatar} alt="Avatar" />
              )}
              <p><strong>Fears:</strong> {profile.fears || "—"}</p>
              <p><strong>Goals:</strong> {profile.goals || "—"}</p>
              <p><strong>Thoughts:</strong> {profile.thoughts || "—"}</p>
              <p><strong>Issues:</strong> {profile.issues || "—"}</p>
              <button onClick={() => addFriend(profile.uid)}>
                {friends.includes(profile.uid) ? "Friend ✅" : "Add Friend"}
              </button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default KarmicAI;
