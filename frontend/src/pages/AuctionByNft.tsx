import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAuctionByNft, createAuction, sendOtp } from "../services/auction";
import { getBidByAuction } from "../services/bid";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-toastify";
import { toast } from "react-toastify";

const AuctionByNft = () => {
  const { nftId = "" } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isDone, setIsDone] = useState<boolean>(false);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [auction, setAuction] = useState<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [bids, setBids] = useState<any[]>([]);
  const [isDone, setIsDone] = useState<boolean>(false);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [auction, setAuction] = useState<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [bids, setBids] = useState<any[]>([]);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [formData, setFormData] = useState({
    start_price: 0,
    start_price: 0,
    auction_end: "",
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchAuction = async () => {
      const response = await getAuctionByNft(nftId);
      console.log("Auction response: ", response.data.data);

      if (response.data.data.length > 0) {
        setAuction(response.data.data[0]);
        const bidData = await getBidByAuction(response.data.data[0].id);
        if (bidData.data.data) {
          setBids(bidData.data.data);
        } else {
          toast.error(bidData.data.message);
        }
      if (response.data.data.length > 0) {
        setAuction(response.data.data[0]);
        const bidData = await getBidByAuction(response.data.data[0].id);
        if (bidData.data.data) {
          setBids(bidData.data.data);
        } else {
          toast.error(bidData.data.message);
        }
      } else {
        setAuction(null);
      }
    };

    fetchAuction();
  }, [nftId, isDone]);
  }, [nftId, isDone]);

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

  const handleCreateAuction = async (e: { preventDefault: () => void }) => {
  const handleCreateAuction = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const response = await createAuction(
      { action: 3, otp, data: { nft_id: nftId, ...formData } },
      token
    );
    if (response.code === 400) {
      toast.error(response.message);
      setIsDone(!isDone);
      setOtpSent(false);
      setOtp("");
    }
    if (response.code === 403) {
      toast.error(response.message);
      setIsDone(!isDone);
      setOtpSent(false);
      setOtp("");
    }
    if (response.code === 406) {
      toast.error(response.message);
      setIsDone(!isDone);
      setOtpSent(false);
      setOtp("");
    }
    if (response.code === 200) {
      toast.success("Auction updated successfully");
      setIsDone(!isDone);
      setAuction(response.data);
      setOtpSent(false);
      setOtp("");
    }
    if (response.code === 201) {
      toast.success("Auction created successfully");
      setIsDone(!isDone);
    if (response.code === 400) {
      toast.error(response.message);
      setIsDone(!isDone);
      setOtpSent(false);
      setOtp("");
    }
    if (response.code === 403) {
      toast.error(response.message);
      setIsDone(!isDone);
      setOtpSent(false);
      setOtp("");
    }
    if (response.code === 406) {
      toast.error(response.message);
      setIsDone(!isDone);
      setOtpSent(false);
      setOtp("");
    }
    if (response.code === 200) {
      toast.success("Auction updated successfully");
      setIsDone(!isDone);
      setAuction(response.data);
      setOtpSent(false);
      setOtp("");
    }
    if (response.code === 201) {
      toast.success("Auction created successfully");
      setIsDone(!isDone);
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
          <p>Start Price: ${auction.startPrice}</p>
          <p>Auction End: {formatDate(auction.auctionEnd)}</p>
          {auction.isEnded ? (
          <p>Start Price: ${auction.startPrice}</p>
          <p>Auction End: {formatDate(auction.auctionEnd)}</p>
          {auction.isEnded ? (
            <p className="text-red-500">Auction has ended</p>
          ) : (
            <p className="text-green-500">Auction is live</p>
          )}

          {auction.nft && (
          {auction.nft && (
            <div className="mb-6 p-4 border rounded shadow-lg">
              <h1 className="text-2xl font-bold mb-2">{auction.nft.title}</h1>
              <h1 className="text-2xl font-bold mb-2">{auction.nft.title}</h1>
              <img
                src={auction.nft.imageUrl}
                alt={auction.nft.title}
                src={auction.nft.imageUrl}
                alt={auction.nft.title}
                className="w-full h-48 object-cover mb-2"
              />
              <p className="mb-2">Description: {auction.nft.description}</p>
              <p className="mb-2">Price: ${auction.nft.price}</p>
              <p className="mb-2">Sale type: {auction.nft.saleType}</p>
              <p className="mb-2">Description: {auction.nft.description}</p>
              <p className="mb-2">Price: ${auction.nft.price}</p>
              <p className="mb-2">Sale type: {auction.nft.saleType}</p>
            </div>
          )}
          <h2 className="text-xl font-semibold mt-4">Bids</h2>
          {bids.length > 0 ? (
            <ul className="space-y-2">
              {bids.map((bid) => (
                <li key={bid.id} className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-700">Bid Amount: ${bid.bidAmount}</p>
                  <p className="text-gray-700">Bidder: {bid.bidder.username}</p>
                  <p
                    className={`text-${
                      bid.status === "pending"
                        ? "blue"
                        : bid.status === "accepted"
                        ? "green"
                        : "red"
                    }-500`}
                  >
                    Status: {bid.status}
                  </p>
                </li>
              ))}
            <ul className="space-y-2">
              {bids.map((bid) => (
                <li key={bid.id} className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-700">Bid Amount: ${bid.bidAmount}</p>
                  <p className="text-gray-700">Bidder: {bid.bidder.username}</p>
                  <p
                    className={`text-${
                      bid.status === "pending"
                        ? "blue"
                        : bid.status === "accepted"
                        ? "green"
                        : "red"
                    }-500`}
                  >
                    Status: {bid.status}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No bids yet.</p>
            <p className="text-gray-500">No bids yet.</p>
          )}
        </div>
      ) : (
        <form onSubmit={handleCreateAuction}>
          <h2 className="text-xl font-semibold">Create Auction</h2>
          <label className="block mb-4">
            <span className="text-gray-700">Start Price:</span>
          <label className="block mb-4">
            <span className="text-gray-700">Start Price:</span>
            <input
              type="number"
              value={formData.start_price}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  start_price: Number.parseInt(e.target.value, 10),
                })
                setFormData({
                  ...formData,
                  start_price: Number.parseInt(e.target.value, 10),
                })
              }
              required
              className="block w-full mt-1 p-2 border rounded"
              className="block w-full mt-1 p-2 border rounded"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">Auction End (YYYY-MM-DD):</span>
          <label className="block mb-4">
            <span className="text-gray-700">Auction End (YYYY-MM-DD):</span>
            <input
              type="date"
              value={formData.auction_end}
              onChange={(e) =>
                setFormData({ ...formData, auction_end: e.target.value })
              }
              required
              className="block w-full mt-1 p-2 border rounded"
              className="block w-full mt-1 p-2 border rounded"
            />
          </label>
          <label className="block mb-4">
            <span className="text-gray-700">OTP:</span>
          <label className="block mb-4">
            <span className="text-gray-700">OTP:</span>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="block w-full mt-1 p-2 border rounded"
              className="block w-full mt-1 p-2 border rounded"
            />
          </label>
          <button
            type="button"
            type="button"
            onClick={handleSendOtp}
            className={`w-full p-2 mb-4 rounded ${
              otpSent ? "bg-gray-300" : "bg-blue-500"
            } text-white`}
            className={`w-full p-2 mb-4 rounded ${
              otpSent ? "bg-gray-300" : "bg-blue-500"
            } text-white`}
            disabled={otpSent}
          >
            {otpSent ? `Wait ${countdown}s` : "Send OTP"}
          </button>
          <button
            type="submit"
            className="block w-full p-2 bg-green-500 text-white rounded"
            className="block w-full p-2 bg-green-500 text-white rounded"
          >
            Create Auction
          </button>
        </form>
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
    return `${year}/${month}/${day} : ${hours}:${minutes}:${seconds}`;
  }
};

export default AuctionByNft;