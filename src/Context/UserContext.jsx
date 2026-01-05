import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../Config/firebaseConfig";
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (!data.username || !data.friends) {
            await updateDoc(docRef, {
              username: data.username || data.name?.toLowerCase() || currentUser.email.split("@")[0],
              friends: data.friends || [],
            });
          }
          setProfile({ uid: currentUser.uid, ...data, friends: data.friends || [] });
        } else {
          const newUser = {
            name: currentUser.displayName || "Guest",
            bio: "",
            avatar: currentUser.photoURL || "",
            username: currentUser.email.split("@")[0],
            friends: [],
          };
          await setDoc(docRef, newUser);
          setProfile({ uid: currentUser.uid, ...newUser });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Update profile
  const updateProfile = async (name, bio, avatar) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await setDoc(docRef, { name, bio, avatar }, { merge: true });
    setProfile((prev) => ({ ...prev, name, bio, avatar }));
  };

  // 🔹 Add friend
  const addFriend = async (friendUid) => {
    if (!user || !friendUid) return;
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, { friends: arrayUnion(friendUid) });
    setProfile((prev) => ({ ...prev, friends: [...(prev.friends || []), friendUid] }));
  };

  // 🔹 Remove friend
  const removeFriend = async (friendUid) => {
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    await updateDoc(docRef, { friends: arrayRemove(friendUid) });
    setProfile((prev) => ({
      ...prev,
      friends: prev.friends.filter((id) => id !== friendUid),
    }));
  };

  // 🔹 Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  };

  return (
    <UserContext.Provider
      value={{ user, profile, updateProfile, logout, addFriend, removeFriend, loading }}
    >
      {!loading && children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
