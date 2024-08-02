import type React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../providers/AuthProvider";
import { getAuctionByNft } from "../services/auction";
import { getBidByAuction, sendOtp as sendBidOtp, createBid } from "../services/bid";

const Auction = () => {
  const { nftId = "" } = useParams<{ nftId: string }>(); // assuming the NFT id is in the route params
  const { token } = useAuth();
  
  const [isDone, setIsDone] = useState(false);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [auction, setAuction] = useState<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [bids, setBids] = useState<any[]>([]);
  const [otp, setOtp] = useState("");
  const [bidAmount, setBidAmount] = useState(0);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(60);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchAuctionAndBids = async () => {
      try {
        const auctionData = await getAuctionByNft(nftId);
        if (auctionData.data.data.length > 0) {
          setAuction(auctionData.data.data[0]);
          const bidData = await getBidByAuction(auctionData.data.data[0].id);
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
  }, [nftId, isDone]);

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
        action: 2, // assuming 1 is the action code for creating a bid
        otp,
        data: {
          auction_id: auction.id,
          bid_amount: bidAmount,
        },
      };
      const response = await createBid(bidData, token);
      if (response.code === 201) {
        toast.success("Bid placed successfully.");
        setBids([...bids, response.data]);
        setOtp("");
        setBidAmount(0);
        setIsDone(!isDone);
      }
      else if(response.code === 200){
        toast.success("Bid updated successfully.");
        setBids([...bids, response.data]);
        setOtp("");
        setBidAmount(0);
        setIsDone(!isDone);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      toast.error("Failed to create bid.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Auction for NFT</h1>
      {auction ? (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">{auction.nft.title}</h2>
          <img
            src={auction.nft.imageUrl}
            alt={auction.nft.title}
            className="w-auto h-auto object-cover mb-2"
            loading="lazy"
            style={{ maxHeight: "300px", maxWidth: "300px" }}
          />
          <p className="text-gray-600 mb-2">Owner: {auction.nft.owner.username}</p>
          <p className="text-gray-600 mb-2">Start Price: {auction.startPrice}</p>
          <p className="text-gray-600 mb-2">Auction Ends: {formatDate(auction.auctionEnd)}</p>
          {auction.isEnded ? (
            <p className="text-red-500 font-semibold mb-4">Auction has ended</p>
          ) : (
            <p className="text-green-500 font-semibold mb-4">Auction is live</p>
          )}
          <h2 className="text-lg font-bold mb-2">Bids</h2>
          {bids.length > 0 ? (
            <ul className="space-y-2">
              {bids?.map((bid) => (
                <li key={bid?.id} className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-700">Bid Amount: ${bid?.bidAmount}</p>
                  <p className="text-gray-700">Bidder: {bid.bidder?.username}</p>
                  {bid.status === 'pending' && (<p className="text-blue-500">Status: {bid?.status}</p>)}
                  {bid.status === 'accepted' && (<p className="text-green-500">Status: {bid?.status}</p>)}
                  {bid.status === 'rejected' && (<p className="text-red-500">Status: {bid?.status}</p>)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No bids yet.</p>
          )}

          {!auction.isEnded && (
            <form onSubmit={handleCreateBid} className="mt-4 space-y-4">
              <h2 className="text-lg font-bold mb-2">Place a Bid</h2>
              <div>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  placeholder="Bid Amount"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  required
                  className="w-full border border-gray-300 rounded-lg p-2"
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isOtpSent}
                  className={`px-4 py-2 rounded-lg ${isOtpSent ? "bg-gray-400" : "bg-blue-500"} text-white`}
                >
                  {isOtpSent ? `Resend OTP in ${otpTimer}s` : "Send OTP"}
                </button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded-lg">
                  Place Bid
                </button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <p className="text-red-500">Auction is not available yet.</p>
      )}
    </div>
  );

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  }
};

export default Auction;