import { CreateReceipt } from "@/types/receipt";
import apiClient from "./apiClient";

export const getMyReceipts = async () => {
    try {
        const response = await apiClient.get('/api/receipts/getAll');
        return response.data
    } catch (error) {
        throw new Error("Error loading receipts.");
    }
}

export const getReceiptById = async (receiptId: string) => {
    try {
      const response = await apiClient.get(`/api/receipts/${receiptId}`);
      return response.data;
    } catch (error) {
      throw new Error("Error loading receipt.");
    }
};

export const getCategoryItems= async (category: string) => {
    try {
        const response = await apiClient.get('/api/receipts/getCategoryItems', {
            params: {
                category: category,
            },
        });
        return response.data
    } catch (error) {
        throw new Error("Error loading receipts.");
    }
}

export const createReceipt = async (data: CreateReceipt) => {
    try {
        const response = await apiClient.post('/api/receipts/new', 
            {
                ...data,
            },
        );

        return response.data;
    } catch (error) {
        throw new Error("Error creating receipt.");
    }
}

export const updateReceipt = async (receiptId: string, data: CreateReceipt) => {
    try {
        const response = await apiClient.put(`/api/receipts/update/${receiptId}`, 
            {
                ...data,
            }
        );
        return response.data;
    } catch (error) {
        throw new Error("Error updating receipt.");
    }
}


export const createCategory = async (name:  string) => {
    try {
        const response = await apiClient.post('/api/users/newCategory', 
            {
                name,
            }
        );
        return response.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || "Error creating category.";
        throw new Error(message);
    }
}


//DODAJ U WORD
export const deleteReceipt = async (selectedId: string) => {
    try {
        const response = await apiClient.delete('/api/receipts/deleteReceipt', {
            params: { selectedId }
        });
        return response.data
    } catch (error) {
        throw new Error("Error deleting receipt.");
    }
}