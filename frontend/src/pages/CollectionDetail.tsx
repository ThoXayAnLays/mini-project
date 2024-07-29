import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showCollection } from "../services/collection";
import { addNft, updateNft, deleteNft } from "../services/nft";
import { useAuth } from "../providers/AuthProvider";
import NftModalComponent from "../components/NftModal";
import { toast } from "react-toastify";

const CollectionDetail = () => {
  const defaultAvatar = "src/assets/default_avatar.png";
  const { collectionId = "" } = useParams<{ collectionId: string }>();
  const { token } = useAuth();
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [collection, setCollection] = useState<any>(null);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [nfts, setNfts] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [isNftModalOpen, setIsNftModalOpen] = useState(false);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [currentNft, setCurrentNft] = useState<any>(null);
  const navigate = useNavigate();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchCollectionDetail = async () => {
      try {
        const response = await showCollection(collectionId);
        setCollection(response.data.data.collection);
        setNfts(response.data.data.nfts);
      } catch (error) {
        setError("Failed to fetch collection details.");
      }
    };

    fetchCollectionDetail();
  }, [collectionId, setNfts]);

  const handleAddNft = () => {
    setCurrentNft(null);
    setIsNftModalOpen(true);
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleUpdateNft = (nft: any) => {
    if (nft) {
      setCurrentNft(nft);
      setIsNftModalOpen(true);
    } else {
      setError("NFT data is undefined");
    }
  };

  const handleDeleteNft = async (nftId: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this NFT?");
    if (confirmDelete) {
      try {
        await deleteNft(nftId, token);
        setNfts(nfts.filter((nft) => nft.id !== nftId));
      } catch (error) {
        setError("Failed to delete NFT.");
      }
    }
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleNftSubmit = async (data: any) => {
    if (currentNft) {
      try {
        await updateNft(currentNft.id, data, token);
        setNfts(
          nfts.map((nft) =>
            nft.id === currentNft.id ? { ...nft, ...data } : nft
          )
        );
      } catch (error) {
        setError("Failed to update NFT.");
      }
    } else {
      try {
        const response = await addNft(data, token);
        console.log("nftrespone:::", response.data.data);
        
        setNfts([...nfts, response.data.data]);
      } catch (error) {
        setError("Failed to add NFT.");
      }
    }
    setIsNftModalOpen(false);
  };

  const handleShowOffer = (nftId: string) => {
    navigate(`/offer-by-nft/${nftId}`);
  };

  const handleShowAuction = (nftId: string) => {
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
          {nfts.map(
            (nft) =>
              nft && (
                <div key={nft.id} className="border p-4 rounded bg-gray-500 text-white">
                  <img
                    src={nft?.imageUrl || defaultAvatar}
                    alt={nft.title}
                    className="w-full h-200 object-cover mb-2"
                  />
                  <h3 className="text-lg font-semibold">{nft.title}</h3>
                  <p>{nft.description}</p>
                  <p>Price: ${nft.price}</p>
                  <p>Owner: {nft.owner.username}</p>
                  <p>Sale type: {nft.saleType}</p>
                  <div className="flex justify-between">
                    {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                    <button
                      onClick={() => handleUpdateNft(nft)}
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
                  {nft.saleType === "offer" ? (
                    // biome-ignore lint/a11y/useButtonType: <explanation>
                    <button
                      onClick={() => handleShowOffer(nft.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Show Offer
                    </button>
                  ) : (
                    // biome-ignore lint/a11y/useButtonType: <explanation>
                    <button
                      onClick={() => handleShowAuction(nft.id)}
                      className="bg-indigo-500 text-white px-2 py-1 rounded"
                    >
                      Show Auction
                    </button>
                  )}
                </div>
              )
          )}
        </div>
      ) : (
        <p>No NFTs found in this collection.</p>
      )}
      {isNftModalOpen && (
        <NftModalComponent
          isOpen={isNftModalOpen}
          onClose={() => setIsNftModalOpen(false)}
          onSubmit={handleNftSubmit}
          nftData={currentNft}
          // biome-ignore lint/style/noNonNullAssertion: <explanation>
          collectionId={collectionId!}
        />
      )}
    </div>
  );
};

export default CollectionDetail;
