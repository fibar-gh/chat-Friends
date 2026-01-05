import React from "react";
import "./Rightsidebar.css";
import assets from "../../assets/assets/assets";
import { useUser } from "../../Context/UserContext";

function Rightsidebar({ chatUser }) {
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
      {/* === Chat User Profile === */}
      <div className="rs-profile">
        <img src={chatUser.avatar || assets.profile_img} alt={chatUser.name} />
        <h3>
          {chatUser.name || chatUser.username}
          <img src={assets.green_dot} className="dot" alt="" />
        </h3>
        <p>{chatUser.bio || "Available"}</p>
      </div>

      <hr />

      {/* === Media Section (later dynamic) === */}
      <div className="rs-media">
        <h4>Media</h4>
        <div>
          <img src={assets.pic1} alt="" />
          <img src={assets.pic2} alt="" />
          <img src={assets.pic3} alt="" />
        </div>
      </div>

      {/* === Logout === */}
      <button onClick={logout}>Log Out</button>
    </div>
  );
}

export default Rightsidebar;
