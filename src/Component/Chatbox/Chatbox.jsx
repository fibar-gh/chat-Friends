import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import "./Chatbox.css";
import assets from "../../assets/assets/assets";
import { useUser } from "../../Context/UserContext";
import { db } from "../../Config/firebaseConfig";
import { uploadImage } from "../../uploadImage";

function Chatbox() {
  const { profile } = useUser();
  const { chatId } = useParams();
  const location = useLocation();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [chatUser, setChatUser] = useState(location.state?.chatUser || null);

  const messagesEndRef = useRef(null);

  // 🔹 Reset messages and chatUser when chatId changes
  useEffect(() => {
    setMessages([]);
    setChatUser(location.state?.chatUser || null);
  }, [chatId, location.state?.chatUser]);

  // 🔹 Fetch messages in real-time
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data());
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [chatId]);

  // 🔹 Fetch chat user from Firestore to always have latest info
  useEffect(() => {
    if (!chatId || !profile?.uid) return;

    const fetchChatUser = async () => {
      try {
        const chatRef = doc(db, "chats", chatId);
        const chatSnap = await getDoc(chatRef);
        if (!chatSnap.exists()) return;

        const chatData = chatSnap.data();
        const otherUserId = chatData.participants.find((id) => id !== profile.uid);
        if (!otherUserId) return;

        const userRef = doc(db, "users", otherUserId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setChatUser({
            uid: otherUserId,
            ...userSnap.data(),
          });
        }
      } catch (err) {
        console.error("Error fetching chat user:", err);
      }
    };

    fetchChatUser();
  }, [chatId, profile?.uid]);

  // 🔹 Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // 🔹 Send message (text or image)
  const handleSend = async (e) => {
    if (e) e.preventDefault(); // prevent default Enter behavior
    if ((!newMessage || !newMessage.trim()) && !imageFile) return;
    if (!profile?.uid || !chatId) return;

    let imageUrl = "";
    try {
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
        setImageFile(null);
      }

      await addDoc(collection(db, "chats", chatId, "messages"), {
        text: newMessage || "",
        imageUrl,
        senderId: profile.uid,
        timestamp: serverTimestamp(),
      });

      setNewMessage("");
    } catch (error) {
      console.error("Message Send Error:", error);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
  };

  return (
    <div className="chat-box">
      {/* === Top Section === */}
      <div className="chat-user">
        <img src={chatUser?.avatar || assets.profile_img} alt="profile" />
        <p>
          {chatUser?.name || chatUser?.username || "Chat"}
          <img src={assets.green_dot} className="dot" alt="" />
        </p>
        <img src={assets.help_icon} alt="help-icon" className="help" />
      </div>

      {/* === Chat Messages === */}
      <div className="chat-msg">
        {messages.map((msg, i) => {
          const time = msg.timestamp?.seconds
            ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          const isSender = msg.senderId === profile.uid;

          return (
            <div className={isSender ? "s-msg" : "r-msg"} key={i}>
              <div className="bubble">
                {msg.imageUrl && (
                  <div className="image-bubble">
                    <img src={msg.imageUrl} alt="" className="msg-image" />
                    {msg.text && <p className="msg-caption">{msg.text}</p>}
                  </div>
                )}
                {!msg.imageUrl && msg.text && <p className="msg">{msg.text}</p>}
              </div>
              <div className="meta">
                <img
                  src={
                    isSender
                      ? profile.avatar || assets.profile_img
                      : chatUser?.avatar || assets.profile_img
                  }
                  alt=""
                />
                <p>{time}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 🖼️ Image Preview */}
      {imageFile && (
        <div className="image-preview">
          <p>Preview:</p>
          <img
            src={URL.createObjectURL(imageFile)}
            alt="preview"
            className="preview-img"
          />
        </div>
      )}

      {/* === Chat Input === */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Send a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend(e);
          }}
        />
        <input
          type="file"
          id="image"
          accept="image/png, image/jpeg"
          hidden
          onChange={handleImageChange}
        />
        <label htmlFor="image">
          <img src={assets.gallery_icon} alt="gallery" />
        </label>
        <img
          src={assets.send_button}
          alt="send"
          onClick={handleSend}
          className="send-btn"
        />
      </div>
    </div>
  );
}

export default Chatbox;
