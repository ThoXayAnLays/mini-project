import { useEffect, useState } from "react";
import { listAllAuction } from "../services/auction";

const AuctionsList = () => {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [auctions, setAuctions] = useState<any>([]);
  const [selectedAuction, setSelectedAuction] = useState<any>(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      const data = await listAllAuction();
      console.log("Auctions: ", data.data.data);

      if (data.status !== "ERROR") {
        setAuctions(data.data.data);
      }
    };
    fetchAuctions();
  }, []);

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleAuctionClick = (auction: any) => {
    setSelectedAuction(auction);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Auctions</h1>
      <div className="space-y-4">
        {auctions.map((auction: any) => (
          // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
          <div
            key={auction.id}
            className="p-4 border rounded shadow-sm cursor-pointer"
            onClick={() => handleAuctionClick(auction)}
          >
            <div className="flex flex-col md:flex-row items-center">
              <img
                src={auction.nft.imageUrl}
                alt={auction.nft.title}
                className="w-64 h-64 object-cover mb-4 md:mb-0"
              />
              <div className="ml-0 md:ml-4">
                <h2 className="text-xl font-semibold">{auction.nft.title}</h2>
                <p className="text-green-600 font-semibold">
                  Owner: {auction.nft.owner.username}
                </p>
                <p>Creator: {auction.creator.username}</p>
                <p>
                  Time: {formatDate(auction.createdAt)} to{" "}
                  {formatDate(auction.auctionEnd)}
                </p>
                <p>Start price: ${auction.startPrice}</p>
                <p>Highest Bid: ${auction.highestBid || "No bids yet"}</p>
                <p>
                  Highest Bidder:{" "}
                  {auction.highest_bidder?.username || "No bidder yet"}
                </p>
              </div>
            </div>

            {selectedAuction?.id === auction.id && (
              <div className="mt-4">
                <h2 className="text-lg font-bold">Bids</h2>
                {auction.bids.length > 0 ? (
                  <ul className="list-disc pl-5">
                    {auction.bids.map((bid:any) => (
                      <li key={bid.id} className="bg-gray-100 p-3 rounded-lg">
                        <p className="text-gray-700">
                          Bid Amount: ${bid.bidAmount}
                        </p>
                        <p className="text-gray-700">
                          Bidder: {bid.bidder.username}
                        </p>
                        {bid.status === "pending" && (
                          <p className="text-blue-500">Status: {bid.status}</p>
                        )}
                        {bid.status === "accepted" && (
                          <p className="text-green-500">Status: {bid.status}</p>
                        )}
                        {bid.status === "rejected" && (
                          <p className="text-red-500">Status: {bid.status}</p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500">No bids yet.</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
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

export default AuctionsList;
