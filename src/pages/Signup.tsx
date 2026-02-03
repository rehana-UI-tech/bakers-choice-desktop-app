import '../pages/Signup.scss';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface User {
  username: string;
  password: string;
  name: string;
  age: string;
}

const Signup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!username || !password || !name || !age) {
      setError('All fields are required');
      return;
    }

    if (isNaN(Number(age)) || Number(age) < 18) {
      setError('Age must be a valid number and at least 18');
      return;
    }

    // Get existing users from localStorage
    const existingUsers: User[] = JSON.parse(
      localStorage.getItem('registeredUsers') || '[]'
    );

    // Check if username already exists
    if (existingUsers.some((user) => user.username === username)) {
      setError('Username already exists');
      return;
    }

    // Store new user
    const newUser: User = {
      username,
      password,
      name,
      age,
    };

    existingUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

    setSuccess('Registration successful! Redirecting to login...');
    setTimeout(() => {
      setSuccess(''); 
      navigate('/login');
    }, 800);
  };

  return (
    <div className="signup">
      <div className="signup__container">
        <h1 className="signup__title">Create Account</h1>

        {error && <div className="signup__error">{error}</div>}
        {success && (
  <div className="signup__success" style={{ position: 'static' }}>
    {success}
  </div>
)}

        <form className="signup__form" onSubmit={handleSubmit}>
          <div className="signup__form-group">
            <label htmlFor="name" className="signup__label">Full Name</label>
            <input
              type="text"
              id="name"
              className="signup__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="signup__form-group">
            <label htmlFor="username" className="signup__label">Username</label>
            <input
              type="text"
              id="username"
              className="signup__input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div className="signup__form-group">
            <label htmlFor="age" className="signup__label">Age</label>
            <input
              type="number"
              id="age"
              className="signup__input"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="Enter your age"
              required
            />
          </div>

          <div className="signup__form-group">
            <label htmlFor="password" className="signup__label">Password</label>
            <input
              type="password"
              id="password"
              className="signup__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="signup__button">Sign Up</button>
        </form>

        <p className="signup__footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
