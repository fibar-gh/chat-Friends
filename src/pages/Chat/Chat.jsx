import Chatbox from '../../Component/Chatbox/Chatbox'
import Leftsidebar from '../../Component/Leftsidebar/Leftsidebar'
import Rightsidebar from '../../Component/Rightsidebar/Rightsidebar'
import { useLocation } from "react-router-dom";

import './chat.css'

const Chat = () => {
    const location = useLocation();
  const chatUser = location.state?.chatUser;

  return (
    <div className='chat'>
        <div className='chat-container'>
          <Leftsidebar/>
          <Chatbox/>
      <Rightsidebar chatUser={chatUser} />

        </div>
    </div>
  )
}

export default Chat
