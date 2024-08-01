import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { showNftByOwner } from "../services/nft";
import { useAuth } from "../providers/AuthProvider";
import { toast } from "react-toastify";

const NFTByOwner = () => {
  const defaultAvatar = "src/assets/default_avatar.png";
  const { token } = useAuth();
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [nfts, setNfts] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNftsByOwner = async () => {
      if (token) {
        try {
          const response = await showNftByOwner(token);
          console.log("NFTs by owner: ", response.data);
          if (response.status === "SUCCESS") {
            setNfts(response.data);
          } else {
            toast.error(response.message);
          }
        } catch (error) {
          toast.error("Failed to fetch NFTs by owner.");
        }
      }
    };

    fetchNftsByOwner();
  }, [token]);

  const handleShowOffer = (nftId: string) => {
    navigate(`/offer-by-nft/${nftId}`);
  };

  const handleShowAuction = (nftId: string) => {
    navigate(`/auction-by-nft/${nftId}`);
  };

  if (!nfts) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">NFTs by Owner</h1>
      {nfts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nfts.map(
            (nft) =>
              nft && (
                <div
                  key={nft.id}
                  className="border p-4 rounded bg-gray-500 text-white"
                >
                  <img
                    src={nft?.imageUrl || defaultAvatar}
                    alt={nft.title}
                    className="w-full h-48 object-cover mb-2"
                    loading="lazy"
                  />
                  <h3 className="text-lg font-semibold">{nft.title}</h3>
                  <p>{nft.description}</p>
                  <p>Price: ${nft.price}</p>
                  <p>Owner: {nft.owner.username}</p>
                  <p>Sale type: {nft.saleType}</p>
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
        <p>No NFTs found for this owner.</p>
      )}
    </div>
  );
};

export default NFTByOwner;
