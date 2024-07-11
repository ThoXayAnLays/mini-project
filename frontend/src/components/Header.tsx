import type React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC<{ isLoggedIn: boolean }> = ({ isLoggedIn }) => {
  return (
    <header>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/collections">Collections</Link>
        {isLoggedIn && <Link to="/auction">Auction</Link>}
      </nav>
    </header>
  );
};

export default Header;
