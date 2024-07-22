import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuctionByNft, createAuction, sendOtp } from "../services/auction";
import { getBidByAuction } from "../services/bid";
import { useAuth } from "../providers/AuthProvider";

const AuctionByNft = () => {
  const { nftId = "" } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [auction, setAuction] = useState(null);
  const [bids, setBids] = useState([]);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [formData, setFormData] = useState({
    start_price: "",
    auction_end: "",
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchAuction = async () => {
      const response = await getAuctionByNft(nftId);
      console.log("Auction response: ", response.data.data);

      if (response.data.data) {
        setAuction(response.data.data);
      } else {
        setAuction(null);
      }
    };

    fetchAuction();
  }, [nftId, setAuction]);

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

  const handleCreateAuction = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const response = await createAuction(
      { action: 3, otp, data: { nft_id: nftId, ...formData } },
      token
    );
    console.log("Create Auction response: ", response.data);

    if (response.status === "SUCCESS") {
      setAuction(response.data);
      setOtpSent(false);
      setOtp("");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Auction for NFT</h1>
      {auction ? (
        <div>
          <h2 className="text-xl font-semibold">Auction Details</h2>
          <p>Start Price: ${auction[0].startPrice}</p>
          <p>Auction End: {auction[0].auctionEnd}</p>
          {auction[0].isEnded === true ? (
            <p className="text-red-500">Auction has ended</p>
          ) : (
            <p className="text-green-500">Auction is live</p>
          )}

          {auction[0].nft && (
            <div className="mb-6 p-4 border rounded shadow-lg">
              <h1 className="text-2xl font-bold mb-2">
                {auction[0].nft.title}
              </h1>
              <img
                src={auction[0].nft.imageUrl}
                alt={auction[0].nft.title}
                className="w-full h-48 object-cover mb-2"
              />
              <p className="mb-2">Description: {auction[0].nft.description}</p>
              <p className="mb-2">Price: ${auction[0].nft.price}</p>
              <p className="mb-2">Sale type: {auction[0].nft.saleType}</p>
            </div>
          )}
          <h2 className="text-xl font-semibold mt-4">Bids</h2>
          {bids.length > 0 ? (
            <ul>
              {bids
                .sort((a, b) => b.bid_amount - a.bid_amount)
                .map((bid) => (
                  <li key={bid.id}>
                    <p>Bid Amount: ${bid.bid_amount}</p>
                    <p>Bidder: {bid.bidder.username}</p>
                  </li>
                ))}
            </ul>
          ) : (
            <p>No bids yet.</p>
          )}
        </div>
      ) : (
        <form onSubmit={handleCreateAuction}>
          <h2 className="text-xl font-semibold">Create Auction</h2>
          <label>
            Start Price:
            <input
              type="number"
              value={formData.start_price}
              onChange={(e) =>
                setFormData({ ...formData, start_price: e.target.value })
              }
              required
              className="block mb-2 p-1"
            />
          </label>
          <label>
            Auction End (YYYY-MM-DD):
            <input
              type="date"
              value={formData.auction_end}
              onChange={(e) =>
                setFormData({ ...formData, auction_end: e.target.value })
              }
              required
              className="block mb-2 p-1"
            />
          </label>
          <label>
            OTP:
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="block mb-2 p-1"
            />
          </label>
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
          <button
            type="submit"
            className="block mb-2 p-2 bg-green-500 text-white rounded"
          >
            Create Auction
          </button>
        </form>
      )}
    </div>
  );
};

export default AuctionByNft;
