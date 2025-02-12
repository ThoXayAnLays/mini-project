// src/pages/Home.tsx
import type React from "react";
import { useEffect, useState } from "react";
import { showCollection, indexCollection } from "../services/collection";
import { indexNft } from "../services/nft";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [collections, setCollections] = useState<any[]>([]);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [nfts, setNfts] = useState<any[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Fetch collections
    const fetchCollection = async () => {
      try {
        const response = await indexCollection();
        console.log(response.data); // Check the structure of the response
        setCollections(response.data.data);
      } catch (error) {
        console.log("Fetch collection error: ", error);
      }
    };
    fetchCollection();
    // Fetch all NFTs by default
    fetchNfts();
  }, []);

  const fetchNfts = async (collectionId: string | null = null) => {
    try {
      if (!collectionId) {
        const response = await indexNft();
        console.log("Nft: ", response.data.data);

        setNfts(response.data.data);
      } else {
        const response = await showCollection(collectionId);
        console.log("Nft: ", response.data.data.nfts);
        setNfts(response.data.data.nfts);
      }
    } catch (error) {
      console.log("Fetch NFT error: ", error);
    }
  };

  const handleCollectionClick = (collectionId: string) => {
    const newCollectionId =
      selectedCollection === collectionId ? null : collectionId;
    setSelectedCollection(newCollectionId);
    fetchNfts(newCollectionId);
  };

  const viewOffers = (nftId: string) => {
    navigate(`/offers/${nftId}`);
  };

  const viewAuctions = (nftId: string) => {
    navigate(`/auctions/${nftId}`);
  };

  return (
    <div>
      <div className="flex h-screen">
        {/* Left Panel */}
        <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Collections</h2>
          <ul>
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {collections.map((collection: any) => (
              // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
              <li
                key={collection.id}
                className={`p-2 cursor-pointer  ${
                  selectedCollection === collection.id
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
                onClick={() => handleCollectionClick(collection.id)}
              >
                {collection.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Right Panel */}
        <div className="w-3/4 p-4 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">NFTs</h2>
          <div className="grid grid-cols-3 gap-4">
            {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
            {nfts.map((nft: any) => (
              <div key={nft.id} className="border p-4 bg-gray-500 text-white">
                <img
                  src={nft.imageUrl}
                  alt={nft.title}
                  className="w-full h-48 object-cover mb-2"
                  loading="lazy"
                />
                <h3 className="text-lg font-semibold">{nft.title}</h3>
                <p>{nft.description}</p>
                <p>Price: ${nft.price}</p>
                <p>Creator: {nft.creator.username}</p>
                <p>Owner: {nft.owner.username}</p>
                <p>Sale type: {nft.saleType}</p>
                {nft.saleType === "offer" ? (
                  // biome-ignore lint/a11y/useButtonType: <explanation>
                  <button className="bg-green-500 text-white px-4 py-2 rounded mb-4" onClick={() => viewOffers(nft.id)}>
                    View Offers
                  </button>
                ) : (
                  // biome-ignore lint/a11y/useButtonType: <explanation>
                  <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4" onClick={() => viewAuctions(nft.id)}>
                    View Auction
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
