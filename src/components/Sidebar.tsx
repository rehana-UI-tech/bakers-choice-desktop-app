import './Sidebar.scss';
import { useLocation, Link } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();
  return (
    <nav className="sidebar">
      <ul>
        <li className={location.pathname === '/home' ? 'active' : ''}>
          <Link to="/home">Home</Link>
        </li>
        <li className={location.pathname === '/products' ? 'active' : ''}>
          <Link to="/products">Products</Link>
        </li>
        <li className={location.pathname === '/contact' ? 'active' : ''}>
          <Link to="/contact">Contact Us</Link>
        </li>
        <li className={location.pathname === '/about' ? 'active' : ''}>
          <Link to="/about">About Us</Link>
        </li>
      </ul>
    </nav>
  );
}
