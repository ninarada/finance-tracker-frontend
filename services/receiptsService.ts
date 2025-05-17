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
