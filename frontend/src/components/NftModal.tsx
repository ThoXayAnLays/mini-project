import type React from "react";
import { useState, useEffect } from "react";

interface NftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  nftData?: {
    id?: string;
    title?: string;
    description?: string;
    imageUrl?: string;
    collectionId?: string;
    metadata?: string;
    saleType?: string;
    price?: string;
  };
  collectionId: string;
}

const NftModalComponent: React.FC<NftModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  nftData,
  collectionId,
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [metadata, setMetadata] = useState<string>("");
  const [saleType, setSaleType] = useState<string>("offer");
  const [price, setPrice] = useState<string>("");

  useEffect(() => {
    if (nftData) {
      setTitle(nftData.title || "");
      setDescription(nftData.description || "");
      setMetadata(nftData.metadata || "");
      setSaleType(nftData.saleType || "offer");
      setPrice(nftData.price || "");
      // Optionally set the image if needed
    }
  }, [nftData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (selectedFile) {
      formData.append("image_url", selectedFile);
    } else if (nftData?.imageUrl) {
      formData.append("image_url", nftData.imageUrl);
    }
    formData.append("collection_id", collectionId);
    formData.append("metadata", metadata);
    formData.append("sale_type", saleType);
    formData.append("price", price);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Failed to submit NFT:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">{nftData ? "Update NFT" : "Add NFT"}</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Image</label>
          {nftData?.imageUrl && (
            <img src={nftData?.imageUrl} alt="NFT" className="w-full h-48 object-cover mb-2" />
          )}
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Metadata</label>
          <input
            type="text"
            value={metadata}
            onChange={(e) => setMetadata(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Sale Type</label>
          <select
            value={saleType}
            onChange={(e) => setSaleType(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="offer">Offer</option>
            <option value="auction">Auction</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>
        <div className="flex justify-end">
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
            onClick={onClose}
            className="bg-gray-300 text-black py-2 px-4 rounded mr-2"
          >
            Cancel
          </button>
          {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
<button
            onClick={handleSubmit}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            {nftData ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NftModalComponent;
