// src/pages/AuctionByNft.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAuctionByNft } from '../services/auction';

const AuctionByNft = () => {
  const { nftId } = useParams();
  const [auctions, setAuctions] = useState([]);
  const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchAuctions = async () => {
//       try {
//         const response = await getAuctionByNft(nftId);
//         if (response.status === 'SUCCESS') {
//           setAuctions(response.data);
//         } else {
//           setError(response.message);
//         }
//       } catch (error) {
//         setError('Failed to fetch auctions.');
//       }
//     };
//     fetchAuctions();
//   }, [nftId]);

  return (
    <div className="container mx-auto p-4">
      {/* <h1 className="text-2xl font-bold mb-4">Auctions for NFT {nftId}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {auctions.map((auction) => (
          <li key={auction.id} className="mb-2">
            {auction.details}
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default AuctionByNft;
