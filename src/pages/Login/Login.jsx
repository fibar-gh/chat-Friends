import { useState } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../Config/firebaseConfig';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful!");
      navigate('/profile'); // ✅ lowercase route
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            type="email" 
            placeholder="Email" 
            required 
          />
          <input 
            onChange={(e) => setPassword(e.target.value)} 
            type="password" 
            placeholder="Password" 
            required 
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
