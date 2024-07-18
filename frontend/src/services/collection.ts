import axiosInstance from "../libs/axiosInstance";

interface addCollection {
    name: string;
    description: string;
}

interface updateCollection {
    name?: string;
    description?: string;
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const addCollection = async (data: addCollection, token: any) => {
    try {
        // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
        const response = await axiosInstance.post(`/collection`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { status: 'SUCCESS', message: 'Collection added successfully.', data: response.data}
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to add collection. Please try again.' };
    }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const eidtCollection = async (id: string, data: updateCollection, token: any) => {
    try {
        const response = await axiosInstance.put(`/collection/${id}`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { status: 'SUCCESS', message: 'Collection updated successfully.', data: response.data}
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to update collection. Please try again.' };
    }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const deleteCollection = async (id: string, token: any) => {
    try {
        const response = await axiosInstance.delete(`/collection/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return { status: 'SUCCESS', message: 'Collection deleted successfully.', data: response.data }
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to delete collection. Please try again.' };
    }
}

export const indexCollection = async () => {
    try {
        // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
        const response = await axiosInstance.get(`/collection`);
        return { status: 'SUCCESS', message: 'Get all collection successfully.', data: response.data }
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to fetch collections.' };
    }
}

export const showCollection = async (id: string) => {
    try {
        const response = await axiosInstance.get(`/collection/${id}`);
        return { status: 'SUCCESS', message: 'Get collection successfully.', data: response.data }
    } catch (error) {   
        return { status: 'ERROR', message: 'Failed to fetch collection.' };
    }
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const getCollectionByUser = async (token: any) => {
    try {
        // biome-ignore lint/style/noUnusedTemplateLiteral: <explanation>
        const response = await axiosInstance.get(`/collection/get-by-owner`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        return { status: 'SUCCESS', message: 'Get collection by owner successfullt.', data: response.data}
    } catch (error) {
        return { status: 'ERROR', message: 'Failed to fetch collection.' };
    }
}