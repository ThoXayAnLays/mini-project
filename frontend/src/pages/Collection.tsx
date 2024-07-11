// src/pages/Collection.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const Collection = () => {
  const { id } = useParams();
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchNfts = async () => {
      try {
        const response = await axios.get(`http://localhost:3333/api/v1/collection/${id}`);
        setNfts(response.data);
      } catch (error) {
        console.error('Failed to fetch NFTs:', error);
      }
    };
    fetchNfts();
  }, [id]);

  return (
    <div>
      
    </div>
  );
};

export default Collection;
