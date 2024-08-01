import axiosInstance from "../libs/axiosInstance";

interface addNft {
    title: string;
    description: string;
    image_url: string;
    collection_id: string;
    metadata: string;
    sale_type: string;
    price: string;
}

interface updateNft {
    title?: string;
    description?: string;
    image_url?: string;
    metadata?: string;
    sale_type?: string;
    price?: string;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const addNft = async (data: addNft, token: any) => {
    try {
        const response = await axiosInstance.post("/nft", data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { status: 'SUCCESS', message: 'NFT added successfully.', data: response.data}
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to add NFT. Please try again.' };
    }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const updateNft = async (id: string, data: updateNft, token: any) => {
    try {
        const response = await axiosInstance.put(`/nft/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { status: 'SUCCESS', message: 'NFT updated successfully.', data: response.data}
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to update NFT. Please try again.' };
    }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const deleteNft = async (id: string, token: any) => {
    try {
        const response = await axiosInstance.delete(`/nft/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { status: 'SUCCESS', message: 'NFT deleted successfully.', data: response.data}
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to delete NFT. Please try again.' };
    }
}

export const indexNft = async () => {
    try {
        // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
        const response = await axiosInstance.get(`/nft`);
        return { status: 'SUCCESS', message: 'Get all NFT successfully.', data: response.data }
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to fetch NFTs.' };
    }
}

export const showNft = async (id: string) => {
    try{
        const response = await axiosInstance.get(`/nft/${id}`);
        return { status: 'SUCCESS', message: 'Get NFT successfully.', data: response.data }
    }catch{
        return { status: 'ERROR', message: 'Failed to fetch NFT.' };
    }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const showNftByOwner = async (token: any) => {
    try{
        // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
        const response = await axiosInstance.get(`/nft/getByOwner`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { status: 'SUCCESS', message: 'Get NFT by owner successfully.', data: response.data }
    }catch{
        return { status: 'ERROR', message: 'Failed to fetch NFT by owner.' };
    }
}