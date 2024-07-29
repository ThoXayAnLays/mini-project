// src/components/Navbar.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {

    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:3333/api/v1/auth/me');
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <nav>
      <Link to="/">Home</Link>
      {isLoggedIn && <Link to="/auction">Auction</Link>}
    </nav>
  );
};

export default Navbar;
