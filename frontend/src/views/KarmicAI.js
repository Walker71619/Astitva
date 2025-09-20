import React, { useState, useEffect } from "react";
import { collection, onSnapshot, doc, setDoc, getDoc } from "firebase/firestore";
import { firestore, auth } from "../firebase";
import "./KarmicAI.css";

const KarmicAI = () => {
  const [mounted, setMounted] = useState(false);        // ensure client-side render
  const [user, setUser] = useState(null);               // auth user
  const [publicProfiles, setPublicProfiles] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMode, setChatMode] = useState("public");
  const [friends, setFriends] = useState([]);
  const [friendProfiles, setFriendProfiles] = useState({});
  const [privateMessages, setPrivateMessages] = useState({});
  const [publicMessages, setPublicMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [newPrivateMessages, setNewPrivateMessages] = useState({});

  // Client-side only
  useEffect(() => setMounted(true), []);

  // Listen for auth changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => setUser(u));
    return () => unsubscribe();
  }, []);

  const myUid = user?.uid;

  // Fetch profiles and friend info
  useEffect(() => {
    if (!myUid) return;
    const usersColRef = collection(firestore, "users");

    const unsubscribe = onSnapshot(usersColRef, snapshot => {
      setLoading(false);
      const profiles = [];
      let me = null;
      const friendsObj = {};

      snapshot.forEach(docSnap => {
        const data = docSnap.data();
        if (data.public) {
          const profile = { uid: docSnap.id, ...data.public };
          if (docSnap.id === myUid) {
            me = profile;
            (data.friends || []).forEach(fUid => friendsObj[fUid] = null); // placeholders
            setFriends(data.friends || []);
          } else {
            profiles.push(profile);
            if (friendsObj[docSnap.id] !== undefined) friendsObj[docSnap.id] = profile; // friend profile
          }
        }
      });

      setMyProfile(me);
      setPublicProfiles(profiles);
      setFriendProfiles(friendsObj);
    }, error => console.error(error));

    return () => unsubscribe();
  }, [myUid]);

  // Public chat
  useEffect(() => {
    const publicChatRef = collection(firestore, "publicChat");
    const unsubscribe = onSnapshot(publicChatRef, snapshot => {
      const messages = [];
      snapshot.forEach(docSnap => messages.push(docSnap.data()));
      setPublicMessages(messages);
    });
    return () => unsubscribe();
  }, []);

  // Private messages
  useEffect(() => {
    if (!myUid) return;
    const privateRef = collection(firestore, `privateChats/${myUid}/chats`);
    const unsubscribe = onSnapshot(privateRef, snapshot => {
      const messagesObj = {};
      snapshot.forEach(docSnap => {
        messagesObj[docSnap.id] = docSnap.data().messages || [];
      });
      setPrivateMessages(messagesObj);
    });
    return () => unsubscribe();
  }, [myUid]);

  // Send public message
  const sendMessage = async () => {
    if (!newMessage.trim() || !myUid) return;
    await setDoc(
      doc(firestore, "publicChat", Date.now().toString()),
      { sender: myUid, text: newMessage, timestamp: Date.now() }
    );
    setNewMessage("");
  };

  // Add friend
  const addFriend = async (friendUid) => {
    if (!friends.includes(friendUid) && myUid) {
      const newFriends = [...friends, friendUid];
      await setDoc(doc(firestore, "users", myUid), { friends: newFriends }, { merge: true });
      setFriends(newFriends);
      setFriendProfiles(prev => ({ ...prev, [friendUid]: publicProfiles.find(p => p.uid === friendUid) }));
    }
  };

  if (!mounted) return null;           // prevent SSR
  if (!user) return <p>Please log in to use chat</p>;
  if (loading) return <p>Loading public profiles...</p>;

  return (
    <div className="karmic-container">
      <h2>🌌 Karmic AI Insights</h2>

      {/* Chat toggle */}
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
            {/* Public chat */}
            {chatMode === "public" && <>
              {publicMessages.map((msg, idx) => (
                <p key={idx}><strong>{msg.sender === myUid ? "Me" : msg.sender}:</strong> {msg.text}</p>
              ))}
              <input
                placeholder="Type message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
            </>}

            {/* Private chat */}
            {chatMode === "private" && Object.keys(friendProfiles).map(fUid => {
              const friend = friendProfiles[fUid];
              if (!friend) return null;
              return (
                <div key={fUid} className="private-chat-block">
                  <div className="friend-header">
                    {friend.avatar && <img src={friend.avatar} alt="Avatar" className="friend-avatar"/>}
                    <h4>{friend.name || friend.uid}</h4>
                  </div>
                  {(privateMessages[fUid] || []).map((msg, idx) => (
                    <p key={idx}><strong>{msg.sender === myUid ? "Me" : msg.sender}:</strong> {msg.text}</p>
                  ))}
                  <input
                    placeholder="Type message..."
                    value={newPrivateMessages[fUid] || ""}
                    onChange={e => setNewPrivateMessages(prev => ({ ...prev, [fUid]: e.target.value }))}
                    onKeyDown={async e => {
                      if (e.key === "Enter" && newPrivateMessages[fUid]?.trim()) {
                        const chatRef = doc(firestore, `privateChats/${myUid}/chats/${fUid}`);
                        const chatSnap = await getDoc(chatRef);
                        const messages = chatSnap.exists() ? chatSnap.data().messages : [];
                        await setDoc(chatRef, {
                          messages: [...messages, { sender: myUid, text: newPrivateMessages[fUid], timestamp: Date.now() }]
                        });
                        setNewPrivateMessages(prev => ({ ...prev, [fUid]: "" }));
                      }
                    }}
                  />
                </div>
              );
            })}
          </div>
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
          publicProfiles.map(profile => (
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
