import axiosInstance from "../libs/axiosInstance";

export const listAllTransaction = async () => {
  try {
    const response = await axiosInstance.get("/transaction");
    return response.data;
  } catch (error) {
    return { status: "ERROR", message: "Failed to fetch all transactions." };
  }
};
