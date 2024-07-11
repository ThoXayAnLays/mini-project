// src/components/Navbar.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [collections, setCollections] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await axios.get('http://localhost:3333/api/v1/collection');
        setCollections(response.data);
      } catch (error) {
        console.error('Failed to fetch collections:', error);
      }
    };

    const checkAuth = async () => {
      try {
        await axios.get('http://localhost:3333/api/v1/auth/me');
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(false);
      }
    };

    fetchCollections();
    checkAuth();
  }, []);

  return (
    <nav>
      <Link to="/">Home</Link>
      {/* {collections.map((collection) => (
        <Link key={collection.id} to={`http://localhost:3333/api/v1/collection/${collection.id}`}>
          {collection.name}
        </Link>
      ))} */}
      {isLoggedIn && <Link to="/auction">Auction</Link>}
    </nav>
  );
};

export default Navbar;
