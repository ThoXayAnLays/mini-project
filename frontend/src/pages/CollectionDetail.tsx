import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { offerByNft } from "../services/offer";
import { getAuctionByNft } from "../services/auction";
import { showCollection } from "../services/collection";
import { addNft, updateNft, deleteNft } from "../services/nft";
import { useAuth } from "../providers/AuthProvider";

const CollectionDetail = () => {
    const collectionId = useParams();
    console.log("collectionId::: ", collectionId.collectionId);
    

  const token = useAuth();
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [collection, setCollection] = useState<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [nfts, setNfts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCollectionDetail = async () => {
      try {
        const response = await showCollection(collectionId?.collectionId);
        console.log("response::: ", response.data);

        setCollection(response.data);
        setNfts(response.data.data.nfts);
      } catch (error) {
        setError("Failed to fetch collection details.");
      }
    };

    fetchCollectionDetail();
  }, [collectionId]);

  const handleAddNft = async () => {
    // Implement add NFT logic here
  };

  const handleUpdateNft = async (nftId: string) => {
    // Implement update NFT logic here
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleDeleteNft = async (nftId: string) => {
    try {
      await deleteNft(nftId, token.token);
      setNfts(nfts.filter((nft) => nft.id !== nftId));
    } catch (error) {
      setError("Failed to delete NFT.");
    }
  };

  const handleShowOffer = async (nftId: string) => {
    navigate(`/offer-by-nft/${nftId}`);
  };

  const handleShowAuction = async (nftId: string) => {
    navigate(`/auction-by-nft/${nftId}`);
  };

  if (!collection) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{collection.name}</h1>
      <p className="mb-4">{collection.description}</p>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        onClick={handleAddNft}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
      >
        Add New NFT
      </button>
      {nfts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nfts.map((nft) => (
            <div key={nft.id} className="border p-4 rounded">
              <img
                  src={nft.imageUrl}
                  alt={nft.title}
                  className="w-full h-48 object-cover mb-2"
                />
                <h3 className="text-lg font-semibold">{nft.title}</h3>
                <p>{nft.description}</p>
                <p>Price: ${nft.price}</p>
                <p>Owner: {nft.owner.username}</p>
                <p>Sale type: {nft.saleType}</p>
              <div className="flex justify-between">
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                  onClick={() => handleUpdateNft(nft.id)}
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                  Update
                </button>
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                  onClick={() => handleDeleteNft(nft.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </div>
              <div className="flex justify-between mt-2">
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                  onClick={() => handleShowOffer(nft.id)}
                  className="bg-green-500 text-white px-2 py-1 rounded"
                >
                  Show Offer
                </button>
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                  onClick={() => handleShowAuction(nft.id)}
                  className="bg-indigo-500 text-white px-2 py-1 rounded"
                >
                  Show Auction
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No NFTs available in this collection.</p>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default CollectionDetail;
