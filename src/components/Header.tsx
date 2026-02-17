import './Header.scss';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const { email, setEmail } = useUser();

  // Extract username from email (part before @)
  const username = email ? email.split('@')[0] : 'User';

  const handleLogout = () => {
    setShowDropdown(false);
    setEmail(null);
    // Clear any stored auth data if needed
    navigate('/login', { replace: true });
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <header className="header">
      <div className="header__logo">
        <img src="/assets/image/logo.jpg" alt="Bakers Choice Logo" className="header__logo-image" />
      </div>

      <h1 className="textLogo">Bakers Choice</h1>

      <div className="header__user-container">
        <div className="header__user" onClick={toggleDropdown}>
          <span className="header__avatar">{username.charAt(0).toUpperCase()}</span>
          <span className="header__name">{username}</span>
        </div>

        {showDropdown && (
          <div className="header__dropdown">
            <button className="header__dropdown-item" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
