import { Routes, Route, Navigate } from "react-router-dom";
import { useUser } from "./Context/UserContext";
import Login from "./pages/Login/Login";
import Signup from "./pages/SignUp/signup";
import Profile from "./pages/Profile/Profile";
import Chat from "./pages/Chat/Chat";

function App() {
  const { user } = useUser();

  return (
    <Routes>
      {!user ? (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      ) : (
        <>
          {/* ✅ Chat routes */}
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:chatId" element={<Chat />} />

          <Route path="/profile" element={<Profile />} />

          {/* ✅ Default page */}
          <Route path="*" element={<Navigate to="/chat" />} />
        </>
      )}
    </Routes>
  );
}

export default App;
