
import './App.css'

import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useUser } from './context/UserContext';
import MainLayout from './layout/MainLayout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import Products from './pages/Products';
import Contact from './pages/Contact';
import About from './pages/About';
import { UserProvider } from './context/UserContext';


// ProtectedRoute component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { email } = useUser();
  const location = useLocation();
  if (!email) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected main layout routes */}
          <Route element={<ProtectedRoute><MainLayout><Outlet /></MainLayout></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;