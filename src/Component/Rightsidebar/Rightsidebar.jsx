import React, { useEffect, useState } from "react";
import "./Rightsidebar.css";
import assets from "../../assets/assets/assets";
import { useUser } from "../../Context/UserContext";
import { IoArrowBack } from "react-icons/io5";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../Config/firebaseConfig";

function Rightsidebar({ chatUser, chatId, goBack }) {
  const { logout } = useUser();
  const [media, setMedia] = useState([]);

  // 🔥 FETCH SHARED IMAGES
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, snapshot => {
      const images = snapshot.docs
        .map(doc => doc.data())
        .filter(msg => msg.imageUrl)     // ✅ MUST be imageUrl
        .map(msg => msg.imageUrl);

      setMedia(images);
    });

    return () => unsub();
  }, [chatId]);
  console.log("Chat ID:", chatId);


  if (!chatUser) {
    return (
      <div className="rs empty">
        <p>Select a chat to see details</p>
      </div>
    );
  }

  return (
    <div className="rs">
      {/* BACK BUTTON (MOBILE) */}
      {goBack && (
        <div className="rs-header">
          <button className="back-btn" onClick={goBack}>
            <IoArrowBack />
          </button>
        </div>
      )}

      {/* PROFILE */}
      <div className="rs-profile">
        <img src={chatUser.avatar || assets.profile_img} alt="" />
        <h3>
          {chatUser.name || chatUser.username}
          <img src={assets.green_dot} className="dot" alt="" />
        </h3>
        <p>{chatUser.bio || "Available"}</p>
      </div>

      <hr />

      {/* MEDIA SECTION */}
      <div className="rs-media">
        <h4>Media</h4>

        <div className="media-grid">
          {media.length === 0 && <p className="no-media">No media shared</p>}

          {media.map((img, index) => (
            <img key={index} src={img} alt="shared media" />
          ))}
        </div>
      </div>

      {/* LOGOUT */}
      <button onClick={logout}>Log Out</button>
    </div>
  );
}

export default Rightsidebar;
