import axiosInstance from "../libs/axiosInstance";

interface ICreateOffer {
  action: number;
  otp: string;
  data: {
    nft_id: string;
    offer_amount: number;
  };
}

interface IAcceptOffer {
  action: number;
  otp: string;
  data: {
    offer_id: string;
  };
}

interface IRejectOffer {
  action: number;
  otp: string;
  data: {
    offer_id: string;
  };
}

export const offerByNft = async (nftId: string) => {
  try {
    const response = await axiosInstance.get(`/offer/offer-by-nft/${nftId}`);
    return response.data;
  } catch (error) {
    return { status: "ERROR", message: "Failed to fetch offer of nft." };
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const offerByUser = async (token: any) => {
  try {
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    const response = await axiosInstance.get(`/offer/offer-by-user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return { status: "ERROR", message: "Failed to fetch offer of user." };
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const sendOtp = async (token: any) => {
  try {
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    const response = await axiosInstance.post(`/offer/send-otp`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return { status: "ERROR", message: "Failed to send OTP." };
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const createOffer = async (data: ICreateOffer, token: any) => {
  try {
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    const response = await axiosInstance.post(`/offer`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return {
      status: "ERROR",
      message: "Failed to perform create offer action.",
    };
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const acceptOffer = async (data: IAcceptOffer, token: any) => {
  try {
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    const response = await axiosInstance.post(`/offer`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return {
      status: "ERROR",
      message: "Failed to perform accept offer action.",
    };
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const rejectOffer = async (data: IRejectOffer, token: any) => {
  try {
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    const response = await axiosInstance.post(`/offer`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    return {
      status: "ERROR",
      message: "Failed to perform reject offer action.",
    };
  }
};
