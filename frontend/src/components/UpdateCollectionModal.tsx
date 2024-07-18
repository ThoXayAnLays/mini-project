import type React from "react";
import { useState, useEffect } from "react";

interface UpdateCollectionComponentProps {
  isOpen: boolean;
  onClose: () => void;
  collection: { id: string; name: string; description: string } | null;
  onUpdate: (updatedCollection: { id: string; name: string; description: string }) => void;
}

const UpdateCollectionComponent: React.FC<UpdateCollectionComponentProps> = ({
  isOpen,
  onClose,
  collection,
  onUpdate,
}) => {
  const [collectionId, setCollectionId] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (collection) {
      setCollectionId(collection.id);
      setCollectionName(collection.name);
      setDescription(collection.description);
    }
  }, [collection]);

  const handleSubmit = () => {
    onUpdate({
      id: collectionId,
      name: collectionName,
      description,
    });
    onClose();
  };

  if (!isOpen || !collection) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl mb-4">Update Collection</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Collection Name</label>
          <input
            type="text"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
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
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCollectionComponent;
