import apiClient from "./apiClient";

export const getMyReceipts = async (token: string) => {
    try {
        const response = await apiClient.get('/api/receipts/getAll', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data
    } catch (error) {
        throw new Error("Error loading receipts.");
    }
}

export const getCategoryItems= async (token: string, category: string) => {
    try {
        const response = await apiClient.get('/api/receipts/getAll', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                category: category,
            },
        });

        return response.data
    } catch (error) {
        throw new Error("Error loading receipts.");
    }
}