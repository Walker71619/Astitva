import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import { firestore, auth } from "../firebase";
import "./KarmicAI.css";

const KarmicAI = () => {
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState("public"); // "public" or "private"
  const [friends, setFriends] = useState([]);
  const [privateMessages, setPrivateMessages] = useState({});
  const [publicMessages, setPublicMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const myUid = auth.currentUser?.uid;

  // Fetch public profiles
  useEffect(() => {
    const usersColRef = collection(firestore, "users");

    const unsubscribe = onSnapshot(
      usersColRef,
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
      (error) => {
        setLoading(false);
        console.error("Error fetching public profiles:", error);
      }
    );

    return () => unsubscribe();
  }, [myUid]);

  // Fetch public chat messages
  useEffect(() => {
    const publicChatRef = collection(firestore, "publicChat");
    const unsubscribe = onSnapshot(publicChatRef, (snapshot) => {
      const messages = [];
      snapshot.forEach((docSnap) => messages.push(docSnap.data()));
      setPublicMessages(messages);
    });
    return () => unsubscribe();
  }, []);

  // Fetch private messages
  useEffect(() => {
    if (!myUid) return;
    const privateRef = collection(firestore, `privateChats/${myUid}/chats`);
    const unsubscribe = onSnapshot(privateRef, (snapshot) => {
      const messagesObj = {};
      snapshot.forEach((docSnap) => {
        messagesObj[docSnap.id] = docSnap.data().messages || [];
      });
      setPrivateMessages(messagesObj);
    });
    return () => unsubscribe();
  }, [myUid]);

  // Send message
  const sendMessage = async (toUid = null) => {
    if (!newMessage.trim()) return;

    if (chatMode === "public") {
      await setDoc(
        doc(firestore, "publicChat", Date.now().toString()),
        { sender: myUid, text: newMessage, timestamp: Date.now() }
      );
    } else if (chatMode === "private" && toUid) {
      const chatRef = doc(firestore, `privateChats/${myUid}/chats/${toUid}`);
      const chatSnap = await getDoc(chatRef); // modular SDK
      const messages = chatSnap.exists() ? chatSnap.data().messages : [];
      await setDoc(chatRef, {
        messages: [...messages, { sender: myUid, text: newMessage, timestamp: Date.now() }]
      });
    }

    setNewMessage("");
  };

  // Add friend
  const addFriend = async (friendUid) => {
    if (!friends.includes(friendUid)) {
      const newFriends = [...friends, friendUid];
      await setDoc(doc(firestore, "users", myUid), { friends: newFriends }, { merge: true });
      setFriends(newFriends);
    }
  };

  if (loading) return <p>Loading public profiles...</p>;

  return (
    <div className="karmic-container">
      <h2>🌌 Karmic AI Insights</h2>

      {/* Chat toggle arrow */}
      <div className={`chat-toggle ${chatOpen ? "open" : ""}`} onClick={() => setChatOpen(!chatOpen)}>
        {chatOpen ? "⮜" : "⮞"}
      </div>

      {/* Chat panel */}
      {chatOpen && (
        <div className="chat-panel">
          <div className="chat-tabs">
            <button onClick={() => setChatMode("public")} className={chatMode === "public" ? "active" : ""}>Public</button>
            <button onClick={() => setChatMode("private")} className={chatMode === "private" ? "active" : ""}>Private</button>
          </div>

          <div className="chat-messages">
            {chatMode === "public" &&
              publicMessages.map((msg, idx) => (
                <p key={idx}><strong>{msg.sender === myUid ? "Me" : msg.sender}:</strong> {msg.text}</p>
              ))
            }

            {chatMode === "private" &&
              friends.map((fUid) => (
                <div key={fUid} className="private-chat-block">
                  <h4>Chat with {fUid}</h4>
                  {(privateMessages[fUid] || []).map((msg, idx) => (
                    <p key={idx}><strong>{msg.sender === myUid ? "Me" : msg.sender}:</strong> {msg.text}</p>
                  ))}
                  <input
                    placeholder="Type message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage(fUid)}
                  />
                </div>
              ))
            }
          </div>

          {chatMode === "public" && (
            <input
              placeholder="Type message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
          )}
        </div>
      )}

      {/* My Profile */}
      {myProfile && (
        <div className="profile-card highlight">
          <h3>🌟 My Profile</h3>
          {myProfile.avatar && <img src={myProfile.avatar} alt="Avatar" />}
          <p><strong>Fears:</strong> {myProfile.fears || "—"}</p>
          <p><strong>Goals:</strong> {myProfile.goals || "—"}</p>
          <p><strong>Thoughts:</strong> {myProfile.thoughts || "—"}</p>
          <p><strong>Issues:</strong> {myProfile.issues || "—"}</p>
        </div>
      )}

      {/* Other Users Carousel */}
      <div className="carousel">
        {publicProfiles.length > 0 ? (
          publicProfiles.map((profile) => (
            <div className="profile-card" key={profile.uid}>
              <h3>User: {profile.uid}</h3>
              {profile.avatar && <img src={profile.avatar} alt="Avatar" />}
              <p><strong>Fears:</strong> {profile.fears || "—"}</p>
              <p><strong>Goals:</strong> {profile.goals || "—"}</p>
              <p><strong>Thoughts:</strong> {profile.thoughts || "—"}</p>
              <p><strong>Issues:</strong> {profile.issues || "—"}</p>
              <button onClick={() => addFriend(profile.uid)}>
                {friends.includes(profile.uid) ? "Friend ✅" : "Add Friend"}
              </button>
            </div>
          ))
        ) : (
          <p>No other public profiles yet.</p>
        )}
      </div>
    </div>
  );
};

export default KarmicAI;
