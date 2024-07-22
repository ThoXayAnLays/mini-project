import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../providers/AuthProvider";
import {
  getAuctionByNft,
  sendOtp as sendAuctionOtp,
  createAuction,
} from "../services/auction";
import {
  getBidByAuction,
  sendOtp as sendBidOtp,
  createBid,
} from "../services/bid";

const Auction = () => {
  const { nftId = "" } = useParams<{ nftId: string }>(); // assuming the NFT id is in the route params
  const { token } = useAuth();
  const navigate = useNavigate();

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [auction, setAuction] = useState<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [bids, setBids] = useState<any[]>([]);
  const [otp, setOtp] = useState("");
  const [bidAmount, setBidAmount] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);

  useEffect(() => {
    const fetchAuctionAndBids = async () => {
      try {
        const auctionData = await getAuctionByNft(nftId);
        console.log("Auction response: ", auctionData.data.data);

        if (auctionData.data.data) {
          setAuction(auctionData.data.data);
          const bidData = await getBidByAuction(auctionData[0].data.data.id);
          if (bidData.data.data) {
            setBids(bidData.data.data);
          } else {
            toast.error(bidData.data.message);
          }
        } else {
          toast.error(auctionData.data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch auction or bids.");
      }
    };

    fetchAuctionAndBids();
  }, [nftId]);

  const handleSendOtp = async () => {
    try {
      const response = await sendBidOtp(token);
      if (response.status !== "ERROR") {
        toast.success("OTP sent successfully.");
        setIsOtpSent(true);
        setOtpTimer(60); // reset timer
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to send OTP.");
    }
  };

  useEffect(() => {
    if (isOtpSent && otpTimer > 0) {
      const timerId = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerId);
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else if (otpTimer === 0) {
      setIsOtpSent(false);
    }
  }, [isOtpSent, otpTimer]);

  const handleCreateBid = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const bidData = {
        action: 1, // assuming 1 is the action code for creating a bid
        otp,
        data: {
          auction_id: auction[0].id,
          bid_amount: bidAmount,
        },
      };
      const response = await createBid(bidData, token);
      if (response.status !== "ERROR") {
        toast.success("Bid created successfully.");
        setBids([...bids, response.data]);
        setOtp("");
        setBidAmount(0);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to create bid.");
    }
  };

  if (!auction) {
    return <p>Loading auction...</p>;
  }

  return (
    <div>
      <h1>Auction for NFT: {auction[0].nft.title}</h1>
      <p>Start Price: {auction[0].startPrice}</p>
      <p>Auction Ends: {auction[0].auctionEnd}</p>
      {auction[0].isEnded === false ? (
        <p className="text-red-500">Auction has ended</p>
      ) : (
        <p className="text-green-500">Auction is live</p>
      )}
      <h2>Bids</h2>
      {bids.length > 0 ? (
        <ul>
          {bids.map((bid) => (
            <li key={bid.id}>
              Bid Amount: {bid.bid_amount} by User {bid.user_id}
            </li>
          ))}
        </ul>
      ) : (
        <p>No bids yet.</p>
      )}

      {auction[0].isEnded === true ? (
        <p>Auction has ended. Can not place bid.</p>
      ) : (
        <form onSubmit={handleCreateBid}>
        <h2>Place a Bid</h2>
        <input
          type="number"
          value={bidAmount}
          onChange={(e) => setBidAmount(Number(e.target.value))}
          placeholder="Bid Amount"
          required
        />
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
        />
        <button type="button" onClick={handleSendOtp} disabled={isOtpSent}>
          {isOtpSent ? `Resend OTP in ${otpTimer}s` : "Send OTP"}
        </button>
        <button type="submit">Place Bid</button>
      </form>
      )}
    </div>
  );
};

export default Auction;
