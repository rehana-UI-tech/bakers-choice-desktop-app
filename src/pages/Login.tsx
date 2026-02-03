import './Login.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { setEmail: setUserEmail } = useUser();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Get registered users from localStorage
    const registeredUsers = JSON.parse(
      localStorage.getItem('registeredUsers') || '[]'
    );

    // Check for admin login first
    if (email === 'abc@gmail.com' && password === 'Abcabc@1') {
      setSuccess('Login successful!');
      setUserEmail(email);
      console.log('Login successful');
      // Redirect to Home after 1 second
      setTimeout(() => {
        navigate('/home');
      }, 1000);
      return;
    }

    // Check registered users
    const user = registeredUsers.find(
      (u: any) => u.username === email && u.password === password
    );

    if (user) {
      setSuccess('Login successful!');
      setUserEmail(user.username);
      console.log('Login successful');
      // Redirect to Home after 1 second
      setTimeout(() => {
        navigate('/home');
      }, 1000);
    } else {
      setError('Invalid credentials');
      console.log('Invalid credentials');
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <h1 className="login__title">Login</h1>
        
        {error && <div className="login__error">{error}</div>}
        {success && <div className="login__success">{success}</div>}

        <form className="login__form" onSubmit={handleSubmit}>
          <div className="login__form-group">
            <label htmlFor="email" className="login__label">Email</label>
            <input
              type="email"
              id="email"
              className="login__input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="login__form-group">
            <label htmlFor="password" className="login__label">Password</label>
            <input
              type="password"
              id="password"
              className="login__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login__button">Login</button>
        </form>

        <p className="login__footer">
          Don't have an account? <a href="/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;
