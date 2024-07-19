import axiosInstance from "../libs/axiosInstance";

interface ICreateBid {
  action: number;
  otp: string;
  data: {
    auction_id: string;
    bid_amount: number;
  };
}

export const getBidByAuction = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/bid/${id}`);
    return {
      status: "SUCCESS",
      message: "Get bid of auction successfully.",
      data: response.data,
    };
  } catch (error) {
    return { status: "ERROR", message: "Failed to fetch bid of auction." };
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const getBidByUser = async (token: any) => {
  try {
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    const response = await axiosInstance.get(`/bid`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      status: "SUCCESS",
      message: "Get bid of user successfully.",
      data: response.data,
    };
  } catch (error) {
    return { status: "ERROR", message: "Failed to fetch bid of user." };
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const sendOtp = async (token: any) => {
  try {
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    const response = await axiosInstance.post(`/bid/send-otp`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      status: "SUCCESS",
      message: "Send OTP successfully.",
      data: response.data,
    };
  } catch (error) {
    return { status: "ERROR", message: "Failed to send OTP." };
  }
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const createBid = async (data: ICreateBid, token: any) => {
  try {
    // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
    const response = await axiosInstance.post(`/bid`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      status: "SUCCESS",
      message: "Create bid successfully.",
      data: response.data,
    };
  } catch (error) {
    return { status: "ERROR", message: "Failed to create bid." };
  }
};
