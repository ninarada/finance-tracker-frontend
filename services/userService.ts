import { UpdatedProfileData, User } from "../types/user";
import apiClient from "./apiClient";

export const registerUser = async (username: string, email: string, password: string): Promise<User> => {
  try {
    const response = await apiClient.post('/api/users/register', {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Error registering. Please try again.");
    }
  }
};

export const loginUser = async (username: string, password: string): Promise<User> => {
  try {
    const response = await apiClient.post('/api/users/login', {
      username,
      password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error("Error logging in. Please try again.");
    }
  }
}

export const getMyProfile = async (token: string) => {
    try {
        const response = await apiClient.get('/api/users/profile', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data
    } catch (error) {
        throw new Error("Error loading user profile.");
    }
}

export const getUserStats = async (token: string) => {
  try {
    const response = await apiClient.get('/api/users/stats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error){
    throw new Error('Error loading user stats.');
  }
}

export const updateProfile = async (token: string, updatedData: UpdatedProfileData) => {
  try {
    const response = await apiClient.put('/api/users/updateProfile', updatedData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error updating profile.');
  }
}

export const deleteCategory = async (token: string, name:  string) => {
  try {
      const response = await apiClient.delete('/api/users/deleteCategory', {
        params: { name },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
  } catch (error: any) {
      const message = error?.response?.data?.message || "Error deleting category.";
      throw new Error(message);
  }
}