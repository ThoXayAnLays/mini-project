import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  offerByNft,
  sendOtp,
  acceptOffer,
  rejectOffer,
} from "../services/offer";
import OtpModal from "../components/OTPModalComponent";
import { useAuth } from "../providers/AuthProvider";
import { showNft } from "../services/nft";

const OfferByNft = () => {
  const { nftId = "" } = useParams<{ nftId: string }>();
  const { token } = useAuth();
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [nft, setNft] = useState<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [offers, setOffers] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<
    "accept" | "reject" | null
  >(null);
  const [currentOfferId, setCurrentOfferId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await offerByNft(nftId);
        console.log("response: ", response.data.data);

        const nftResponse = await showNft(nftId);
        console.log("nftResponse: ", nftResponse.data);
        setNft(nftResponse.data);
        setOffers(response.data.data);
      } catch (error) {
        setError("Failed to fetch offers.");
      }
    };
    fetchOffers();
  }, [nftId]);

  const handleActionClick = (action: "accept" | "reject", offerId: string) => {
    setCurrentAction(action);
    setCurrentOfferId(offerId);
    setIsOtpModalOpen(true);
    sendOtp(token); // Send OTP when the modal opens
  };

  const handleOtpSubmit = async (otp: string) => {
    try {
      const action = currentAction === "accept" ? acceptOffer : rejectOffer;
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      await action(
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        { action: 1, otp, data: { offer_id: currentOfferId! } },
        token
      );
      setOffers(offers.filter((offer) => offer.id !== currentOfferId));
      setIsOtpModalOpen(false);
    } catch (error) {
      setError("Failed to perform action.");
    }
  };

  const handleOtpResend = () => {
    sendOtp(token);
  };

  if (!nft) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{nft.title}</h1>
      <img
        src={nft.imageUrl}
        alt={nft.title}
        className="w-full h-64 object-cover mb-4"
      />
      <p>{nft.description}</p>
      <p>Price: ${nft.price}</p>
      <p>Owner: {nft.owner.username}</p>
      <p>Sale type: {nft.saleType}</p>
      <h2 className="text-2xl mt-6 mb-4">Offers</h2>
      {offers.length > 0 ? (
        offers.map((offer) => (
          <div key={offer.id} className="border p-4 rounded mb-4">
            <p>Amount: ${offer.amount}</p>
            <p>From: {offer.user.username}</p>
            <div className="flex justify-end">
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                onClick={() => handleActionClick("accept", offer.id)}
                className="bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                Accept
              </button>
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                onClick={() => handleActionClick("reject", offer.id)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No offers available.</p>
      )}
      {isOtpModalOpen && (
        <OtpModal
          isOpen={isOtpModalOpen}
          onClose={() => setIsOtpModalOpen(false)}
          onSubmit={handleOtpSubmit}
          onResend={handleOtpResend}
        />
      )}
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default OfferByNft;
