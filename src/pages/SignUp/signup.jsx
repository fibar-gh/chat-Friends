import { useState } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../../Config/firebaseConfig';

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: username });
      alert("Account created successfully!");
      navigate("/profile");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup">
      <div className="signup-container">
        <h2>Create Account</h2>
        <form onSubmit={handleSignup}>
          <input onChange={(e) => setUsername(e.target.value)} type="text" placeholder="Username" required />
          <input onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" required />
          <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" required />
          <button type="submit" disabled={loading}>{loading ? "Creating..." : "Sign Up"}</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;
