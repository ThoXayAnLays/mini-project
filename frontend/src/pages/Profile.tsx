import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import UpdateProfileModal from "../components/UpdateProfileModal";
import AddCollectionModal from "../components/AddCollectionModal";
import UpdateCollectionComponent from "../components/UpdateCollectionModal"; // Ensure correct import
import {
  generateTwoFactorAuth,
  validateTwoFactorAuth,
  me,
  updateProfile,
} from "../services/auth";
import {
  addCollection,
  eidtCollection,
  deleteCollection,
  getCollectionByUser,
} from "../services/collection";
import { useAuth } from "../providers/AuthProvider";

const ProfilePage = () => {
  const token = useAuth();
  const [isDone, setIsDone] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [secret, setSecret] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const navigate = useNavigate();
  const defaultAvatar = "src/assets/default_avatar.png";
  const [user, setUser] = useState({
    username: "",
    email: "",
    walletAddress: "",
    profilePicture: "",
    bio: "",
  });
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [collections, setCollections] = useState<any[]>([]);
  const [isCollectionModalOpen, setIsCollectionModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUpdateCollectionModalOpen, setIsUpdateCollectionModalOpen] =
    useState(false);
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const [currentCollection, setCurrentCollection] = useState<any>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await me(token.token);
        console.log("user data:::", data.user);
        setUser(data.user);
        console.log("user:::", data.user);

        const collectionsData = await getCollectionByUser(token.token);
        console.log("collection data:::", collectionsData.data.data.data);
        setCollections(collectionsData.data.data.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchUserInfo();
  }, [token, isDone]);

  const generateSecret = async () => {
    try {
      const response = await generateTwoFactorAuth(token.token);
      setSecret(response.secret);
      setQrCodeUrl(response.qrCodeUrl);
      toast.success("2FA generated successfully");
    } catch (error) {
      toast.error("Failed to activate 2FA. Please try again.");
    }
  };

  const verifyToken = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await validateTwoFactorAuth(otpToken, token.token);
      if (response?.message === "2FA validated successfully") {
        setQrCodeUrl("");
        navigate("/profile");
      }
      toast.success("2FA token verified successfully");
      setIsDone(!isDone);
    } catch (error) {
      toast.error("Failed to verify 2FA token. Please try again.");
    }
  };

  const handleAddCollection = async (name: string, description: string) => {
    try {
      const newCollection = { name, description };
      const response = await addCollection(newCollection, token.token);
      setCollections([...collections, response.data]);
      toast.success("Collection added successfully");
      setIsDone(!isDone);
      setIsCollectionModalOpen(false);
    } catch (error) {
      toast.error("Failed to add collection. Please try again.");
    }
  };

  const handleUpdateCollection = async (updatedCollection: {
    id: string;
    name: string;
    description: string;
  }) => {
    try {
      const { id, name, description } = updatedCollection;
      const response = await eidtCollection(
        id,
        { name, description },
        token.token
      );
      if (response.data.code === 200) {
        const updatedCollections = collections.map((collection) =>
          collection.id === updatedCollection.id
            ? updatedCollection
            : collection
        );
        setCollections(updatedCollections);
        toast.success(response.message);
        setIsDone(!isDone);
      } else {
        toast.error(response.message);
      }
      setIsUpdateCollectionModalOpen(false);
    } catch (error) {
      toast.error("Failed to update collection. Please try again.");
    }
  };

  const handleDeleteCollection = async (id: string) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this collection?"
      );
      if (confirmDelete) {
        await deleteCollection(id, token.token);
        setCollections(collections.filter((col) => col.id !== id));
        toast.success("Collection deleted successfully");
        setIsDone(!isDone);
      }
    } catch (error) {
      toast.error("Failed to delete collection. Please try again.");
    }
  };

  const handleViewCollection = async (id: string) => {
    navigate(`/collection/${id}`);
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleOpenUpdateModal = (collection: any) => {
    setCurrentCollection(collection);
    setIsUpdateCollectionModalOpen(true);
  };

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const handleUpdateProfile = async (updatedUserInfo: any) => {
    try {
      const updatedUser = await updateProfile(updatedUserInfo, token.token);
      setUser(updatedUser);
    } catch (err) {
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Profile Page</h2>
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="profile-header flex items-center">
          <img
            src={user?.profilePicture || defaultAvatar}
            alt="Profile"
            className="w-20 h-20 rounded-full"
          />
          <div className="ml-4">
            <h1 className="text-2xl font-bold">{user?.username}</h1>
            <p>{user?.bio}</p>
            {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="mt-2 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Edit Profile
            </button>
          </div>
        </div>
        {/* Add other profile details and functionalities here */}
        <UpdateProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          userInfo={user}
          onUpdate={handleUpdateProfile}
        />

        {qrCodeUrl ? (
          <div className="mt-6">
            <img src={qrCodeUrl} alt="QR Code" className="mb-4" />
            <p>Scan this QR code with your 2FA app:</p>
            <p className="font-mono">{secret}</p>
            <h3 className="text-lg font-semibold mt-4">Verify OTP</h3>
            <form onSubmit={verifyToken} className="mt-2">
              <input
                type="text"
                value={otpToken}
                onChange={(e) => setOtpToken(e.target.value)}
                className="border p-2 rounded w-full mb-2"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-4"
              >
                Verify OTP
              </button>
              {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
              <button
                onClick={() => setQrCodeUrl("")}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              >
                Cancel
              </button>
            </form>
          </div>
        ) : (
          // biome-ignore lint/a11y/useButtonType: <explanation>
          <button
            onClick={generateSecret}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mt-4 mr-4"
          >
            Activate 2FA
          </button>
        )}
      </div>
      <h3 className="text-xl font-bold my-4">Collections</h3>
      {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
      <button
        onClick={() => setIsCollectionModalOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        Add Collection
      </button>
      <div className="bg-white shadow-md rounded-lg p-4">
        <table className="w-full ">
          <thead>
            <tr>
              <th className="text-left py-2 px-4">Name</th>
              <th className="text-left py-2 px-4">Description</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {collections.map((collection) => (
              <tr key={collection.id}>
                <td className="py-2 px-4">{collection.name}</td>
                <td className="py-2 px-4">{collection.description}</td>
                <td className="py-2 px-4">
                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                  <button
                    onClick={() => handleOpenUpdateModal(collection)}
                    className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                  >
                    Edit
                  </button>
                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                  <button
                    onClick={() => handleDeleteCollection(collection.id)}
                    className="bg-red-500 text-white py-1 px-2 rounded"
                  >
                    Delete
                  </button>
                  {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                  <button
                    onClick={() => handleViewCollection(collection.id)}
                    className="bg-green-500 text-white py-1 px-2 rounded ml-2"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AddCollectionModal
        isOpen={isCollectionModalOpen}
        onClose={() => setIsCollectionModalOpen(false)}
        onAdd={({ name, description }) =>
          handleAddCollection(name, description)
        }
      />
      <UpdateCollectionComponent
        isOpen={isUpdateCollectionModalOpen}
        onClose={() => setIsUpdateCollectionModalOpen(false)}
        collection={currentCollection}
        onUpdate={handleUpdateCollection}
      />
    </div>
  );
};

export default ProfilePage;
