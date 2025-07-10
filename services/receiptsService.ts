import { CreateReceipt } from "@/types/receipt";
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

export const getReceiptById = async (token: string, receiptId: string) => {
    try {
      const response = await apiClient.get(`/api/receipts/${receiptId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error("Error loading receipt.");
    }
};

export const getCategoryItems= async (token: string, category: string) => {
    try {
        const response = await apiClient.get('/api/receipts/getCategoryItems', {
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

export const createReceipt = async (token: string, data: CreateReceipt) => {
    try {
        const response = await apiClient.post('/api/receipts/new', 
            {
                ...data,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        throw new Error("Error creating receipt.");
    }
}

export const updateReceipt = async (token: string, receiptId: string, data: CreateReceipt) => {
    try {
        const response = await apiClient.put(`/api/receipts/update/${receiptId}`, 
            {
                ...data,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        throw new Error("Error updating receipt.");
    }
}


export const createCategory = async (token: string, name:  string) => {
    try {
        const response = await apiClient.post('/api/users/newCategory', 
            {
                name,
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error: any) {
        const message = error?.response?.data?.message || "Error creating category.";
        throw new Error(message);
    }
}