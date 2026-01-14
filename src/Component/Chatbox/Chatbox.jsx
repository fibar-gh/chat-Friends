import React, { useEffect, useState, useRef } from "react";
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
import { IoArrowBack } from "react-icons/io5";

function Chatbox({ chatId, chatUser, goBack, openInfo }) {
  const { profile } = useUser();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => setMessages([]), [chatId]);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });

    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if ((!newMessage.trim() && !imageFile) || !profile?.uid) return;

    let imageUrl = "";
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
      setImageFile(null);
    }

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text: newMessage,
      imageUrl,
      senderId: profile.uid,
      timestamp: serverTimestamp(),
    });

    setNewMessage("");
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) setImageFile(e.target.files[0]);
  };

  return (
    <div className="chat-box">

      {/* HEADER */}
      <div className="chat-user">
        <IoArrowBack className="back-arrow" onClick={goBack} />
        <img src={chatUser?.avatar || assets.profile_img} className="avatar" alt="profile" />
        <p>
          {chatUser?.name || chatUser?.username || "Chat"}
          <img src={assets.green_dot} className="dot" alt="" />
        </p>
        <img src={assets.help_icon} alt="help" className="help" onClick={openInfo} />
      </div>

      {/* MESSAGES */}
      <div className="chat-msg">
        {messages.map((msg, i) => {
          const isSender = msg.senderId === profile.uid;
          const time = msg.timestamp?.seconds
            ? new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
            : "";

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
                  src={isSender ? profile.avatar || assets.profile_img : chatUser?.avatar || assets.profile_img}
                  alt=""
                />
                <p>{time}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* IMAGE PREVIEW */}
      {/* IMAGE PREVIEW */}
{imageFile && (
  <div className="image-preview">
    <p>Preview:</p>
    <img src={URL.createObjectURL(imageFile)} alt="preview" className="preview-img" />
    <button className="remove-preview" onClick={() => setImageFile(null)}>×</button>
  </div>
)}


      {/* INPUT */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Send a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(e)}
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
        <img src={assets.send_button} alt="send" className="send-btn" onClick={handleSend} />
      </div>
    </div>
  );
}

export default Chatbox;
