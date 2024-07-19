// src/pages/OfferByNft.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { offerByNft } from "../services/offer";

interface IOffer {
  id: string;
  nft_id: string;
  offeror_id: string;
  offer_amount: number;
  status: string;
}

const OfferByNft = () => {
  const { nftId = "" } = useParams();
  const [offers, setOffers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await offerByNft(nftId);
        if (response.status === "SUCCESS") {
          console.log(response.data);

          setOffers(response.data);
        } else {
          setError(response.message);
        }
      } catch (error) {
        setError("Failed to fetch offers.");
      }
    };
    fetchOffers();
  }, [nftId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Offers for NFT {nftId}</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul>
        {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
        {offers.map((offer: any) => (
          <li key={offer.id} className="mb-2">
            <h2>{offer.nft.title}</h2>
            <p>{offer.offeror.username} offered {offer.offer_amount}</p>
            <p>{offer.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OfferByNft;
