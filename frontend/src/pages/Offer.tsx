// src/pages/Offers.tsx
import type React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { offerByNft, createOffer, sendOtp } from "../services/offer";
import { showNft } from "../services/nft";
import { useAuth } from "../providers/AuthProvider";

const Offers: React.FC = () => {
  const { token } = useAuth();
  const { nftId = "" } = useParams<{ nftId: string }>();
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [nft, setNft] = useState<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [offers, setOffers] = useState<any[]>([]);
  const [newOffer, setNewOffer] = useState<number>(0);
  const [otp, setOtp] = useState<string>("");
  const [highlightedOffer, setHighlightedOffer] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const nftResponse = await showNft(nftId);
        console.log("nft:::", nftResponse.data);

        setNft(nftResponse.data);

        const offersResponse = await offerByNft(nftId);
        console.log("offers:::", offersResponse.data.data);

        setOffers(offersResponse.data.data);
      } catch (error) {
        console.log("Fetch offers error: ", error);
      }
    };

    fetchOffers();
  }, [nftId, setOffers]);

  const handleCreateOffer = async () => {
    try {
      const response = await createOffer(
        { action: 1, otp, data: { nft_id: nftId, offer_amount: newOffer } },
        token
      );
      setHighlightedOffer(response.data);
    } catch (error) {
      console.log("Create offer error: ", error);
    }
  };

  const handleSendOtp = async () => {
    try {
      await sendOtp(token);
      setOtpSent(true);
      setCountdown(60);

      const intervalId = setInterval(() => {
        setCountdown((prevCountdown) => {
          if (prevCountdown <= 1) {
            clearInterval(intervalId);
            setOtpSent(false);
            return 0;
          }
          return prevCountdown - 1;
        });
      }, 1000);
    } catch (error) {
      console.log("Send OTP error: ", error);
    }
  };

  return (
    <div className="p-4">
      {nft && (
        <div className="mb-6 p-4 border rounded shadow-lg">
          <h1 className="text-2xl font-bold mb-2">{nft.title}</h1>
          <img
            src={nft.imageUrl}
            alt={nft.title}
            className="w-full h-48 object-cover mb-2"
          />
          <p className="mb-2">Description: {nft.description}</p>
          <p className="mb-2">Price: ${nft.price}</p>
          <p className="mb-2">Creator: {nft.creator.username}</p>
          <p className="mb-2">Owner: {nft.owner.username}</p>
          <p className="mb-2">Sale type: {nft.saleType}</p>
        </div>
      )}
      <h2 className="text-xl font-bold mb-4">Offers</h2>
      {offers.length > 0 ? (
        <ul className="mb-6">
          {offers.map((offer) => (
            <li
              key={offer.id}
              className={`p-2 border rounded mb-2 ${
                highlightedOffer === offer.id ? "bg-yellow-300" : ""
              }`}
            >
              <p>
                ${offer.offerAmount} by {offer.offeror.username}
              </p>
              <p>Status: {offer.status}</p>
              <p>Date: {offer.updatedAt}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No offers yet</p>
      )}

      {token ? (
        <div className="mt-4">
          <input
            type="number"
            value={newOffer}
            onChange={(e) => setNewOffer(Number(e.target.value))}
            className="border p-2 mb-2 w-full"
            placeholder="Offer Amount"
          />
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border p-2 mb-2 w-full"
            placeholder="OTP"
          />
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button
            onClick={handleCreateOffer}
            className="w-full bg-blue-500 text-white p-2 mb-2"
          >
            Create Offer
          </button>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
          <button
            onClick={handleSendOtp}
            className={`w-full p-2 text-white mb-2 ${
              otpSent ? "bg-gray-300" : "bg-gray-500"
            }`}
            disabled={otpSent}
          >
            {otpSent ? `Wait ${countdown}s` : "Send OTP"}
          </button>
        </div>
      ) : (
        <p>Please login to make an offer</p>
      )}
    </div>
  );
};

export default Offers;
