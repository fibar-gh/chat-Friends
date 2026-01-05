import './Leftsidebar.css';
import assets from '../../assets/assets/assets';
import { useState, useEffect } from 'react';
import { useUser } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import { addDoc, getDocs, collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../Config/firebaseConfig';

function Leftsidebar() {
  const { logout, profile, addFriend } = useUser();
  const [showMenu, setShowMenu] = useState(false);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  // Toggle dropdown
  const handleToggleMenu = () => setShowMenu(prev => !prev);

  // Load friends
  useEffect(() => {
    if (!profile?.friends || profile.friends.length === 0) {
      setFriends([]);
      return;
    }
    const q = query(collection(db, "users"), where("__name__", "in", profile.friends));
    const unsubscribe = onSnapshot(q, snapshot => {
      const friendList = snapshot.docs.map(doc => ({
        uid: doc.id,
        name: doc.data().name,
        username: doc.data().username,
        avatar: doc.data().avatar || assets.profile_img,
      }));
      setFriends(friendList);
    });
    return () => unsubscribe();
  }, [profile?.friends]);

  // Open chat
  const openChatWithFriend = async (friend) => {
    if (!profile?.uid) return;

    const q = query(collection(db, "chats"), where("participants", "array-contains", profile.uid));
    const snapshot = await getDocs(q);

    let existingChat = null;
    snapshot.forEach(doc => {
      if (doc.data().participants.includes(friend.uid)) existingChat = doc.id;
    });

    if (existingChat) {
      navigate(`/chat/${existingChat}`, { state: { chatUser: friend } });
      return;
    }

    const chatRef = await addDoc(collection(db, "chats"), {
      participants: [profile.uid, friend.uid],
      createdAt: new Date(),
      lastMessage: "",
      timestamp: new Date(),
    });

    navigate(`/chat/${chatRef.id}`, { state: { chatUser: friend } });
  };

  // Add friend by username
  const addFriendByUsername = async (username) => {
    if (!username.trim()) return;
    if (username === profile.username) return alert("You cannot add yourself");

    const q = query(collection(db, "users"), where("username", "==", username));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return alert("User not found");

    const friendUid = snapshot.docs[0].id;
    if (profile.friends?.includes(friendUid)) return alert("User already added");

    addFriend(friendUid);
    alert("Friend added successfully");
  };

  return (
    <div className="ls">
      <div className="ls-top">
        <div className="ls-nav">
          <img src={assets.logo} className="logo" alt="App Logo" />
          <div className="menu">
            <img src={assets.menu_icon} className="menu-icon" alt="Menu Icon" onClick={handleToggleMenu} />
            {showMenu && (
              <div className="sub-menu">
                <p onClick={() => navigate('/profile')}>Edit Profile</p>
                <hr />
                <p onClick={logout}>Logout</p>
              </div>
            )}
          </div>
        </div>

        <div className="ls-search">
          <img src={assets.search_icon} alt="Search Icon" />
          <input
            type="text"
            placeholder="Enter username"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addFriendByUsername(e.target.value);
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>

      <div className="ls-list">
        {friends.length === 0 && <p className="no-chat">No friends yet.</p>}
        {friends.map(friend => (
          <div key={friend.uid} className="friends" onClick={() => openChatWithFriend(friend)}>
            <img src={friend.avatar || assets.profile_img} alt="Friend" />
            <div>
              <p>{friend.name}</p>
              <span>Tap to chat</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Leftsidebar;
