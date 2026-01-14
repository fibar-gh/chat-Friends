import { useState } from "react";
import Chatbox from "../../Component/Chatbox/Chatbox";
import Leftsidebar from "../../Component/Leftsidebar/Leftsidebar";
import Rightsidebar from "../../Component/Rightsidebar/Rightsidebar";
import "./chat.css";

const Chat = () => {
  // Panel state: left, chat, right
  const [activePanel, setActivePanel] = useState("left");

  // Selected chat state
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChatUser, setCurrentChatUser] = useState(null);

  return (
    <div className="chat">
      <div className="chat-container">

        {/* LEFT PANEL */}
        <div className={`panel left ${activePanel === "left" ? "show" : ""}`}>
          <Leftsidebar
            onFriendClick={({ chatId, ...friend }) => {
              setCurrentChatId(chatId);
              setCurrentChatUser(friend);
              setActivePanel("chat"); // show chat panel
            }}
          />
        </div>

        {/* CHAT BOX */}
        <div className={`panel chatbox ${activePanel === "chat" ? "show" : ""}`}>
          {currentChatId && currentChatUser && (
            <Chatbox
              chatId={currentChatId}
              chatUser={currentChatUser}
              goBack={() => setActivePanel("left")}
              openInfo={() => setActivePanel("right")}
            />
          )}
        </div>

        {/* RIGHT PANEL */}
        <div className={`panel right ${activePanel === "right" ? "show" : ""}`}>
  {currentChatUser && (
    <Rightsidebar
      chatUser={currentChatUser}   // pass the current chat user
      chatId={currentChatId}       // pass the current chat ID
      goBack={() => setActivePanel("chat")} // back arrow toggles back to chat panel
    />
  )}
</div>

      </div>
    </div>
  );
};

export default Chat;
