import React from "react";
import "./Rightsidebar.css";
import assets from "../../assets/assets/assets";
import { useUser } from "../../Context/UserContext";
import { IoArrowBack } from "react-icons/io5";


function Rightsidebar({ chatUser, goBack }) {
  const { logout } = useUser();

  if (!chatUser) {
    return (
      <div className="rs empty">
        <p>Select a chat to see details</p>
      </div>
    );
  }

  return (
    <div className="rs">
      {/* ===== BACK ARROW FOR MOBILE ONLY ===== */}
      {goBack && (
  <div className="rs-header">
    <button className="back-btn" onClick={goBack}>
      <IoArrowBack />
    </button>
  </div>
)}


      {/* ===== CHAT USER PROFILE ===== */}
      <div className="rs-profile">
        <img src={chatUser.avatar || assets.profile_img} alt={chatUser.name} />
        <h3>
          {chatUser.name || chatUser.username}
          <img src={assets.green_dot} className="dot" alt="" />
        </h3>
        <p>{chatUser.bio || "Available"}</p>
      </div>

      <hr />

      {/* ===== MEDIA ===== */}
      <div className="rs-media">
        <h4>Media</h4>
        <div>
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
        </div>
      </div>

      {/* ===== LOGOUT ===== */}
      <button onClick={logout}>Log Out</button>
    </div>
  );
}

export default Rightsidebar;
