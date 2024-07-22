import axiosInstance from "../libs/axiosInstance";

interface ICreateAuction {
  action: number;
  otp: string;
  data: {
    nft_id: string;
    start_price: number;
    auction_end: string;
  };
}

export const getAllAuction = async () => {
  try {
    const response = await axiosInstance.get("/auction/all-auction");
    return response.data
  } catch (error) {
    return { status: "ERROR", message: "Failed to fetch auction." };
  }
};

export const getAuctionByNft = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/auction/auction-by-nft/${id}`);
    return response.data
  } catch (error) {
    return { status: "ERROR", message: "Failed to fetch auction of nft." };
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const getAuctionByUser = async (token: any) => {
  try {
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    const response = await axiosInstance.get(`/auction/auction-by-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data
  } catch (error) {
    return { status: "ERROR", message: "Failed to fetch auction of user." };
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const sendOtp = async (token: any) => {
  try {
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    const response = await axiosInstance.post(`/auction/send-otp`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data
  } catch (error) {
    return { status: "ERROR", message: "Failed to send OTP." };
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const createAuction = async (data: ICreateAuction, token: any) => {
  try {
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    const response = await axiosInstance.post(`/auction`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data
  } catch (error) {
    return { status: "ERROR", message: "Failed to create auction." };
  }
};
