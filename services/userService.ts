import mime from "mime";
import { UpdatedProfileData, User } from "../types/user";
import apiClient from "./apiClient";

export const registerUser = async (username: string, email: string, password: string, name: string, surname: string): Promise<User> => {
  try {
    const response = await apiClient.post('/api/users/register', {
      username,
      email,
      password,
      name,
      surname,
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
    const formData = new FormData();

    if (updatedData.name) formData.append("name", updatedData.name);
    if (updatedData.surname) formData.append("surname", updatedData.surname);
    if (updatedData.location) formData.append("location", updatedData.location);
    if (updatedData.bio) formData.append("bio", updatedData.bio);

    if (updatedData.photo?.uri) {
      const fileUri = updatedData.photo.uri;
      const fileType = mime.getType(fileUri) || "image/jpeg";
      const fileName = fileUri.split("/").pop();

      formData.append("photo", {
        uri: fileUri,
        name: fileName,
        type: fileType,
      } as any); 
    }

    const response = await apiClient.put('/api/users/updateProfile', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
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

export const addCategoryToFavourites = async (token: string, categoryName: string, add: boolean) => {
  try {
    const response = await apiClient.post('/api/users/addCategoryToFavourites',
      { categoryName, add },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Error adding favourite category.";
    throw new Error(message);
  }
};

// DODAJ U WORD

export const deleteUser = async (token: string, password: string): Promise<User> => {
  try {
    const response = await apiClient.delete('/api/users/deleteUser', {
      params: { password },
        headers: {
          Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Error deleting account.";
    throw new Error(message);
  }
};

//PUT /api/users/changePassword
export const changePassword = async (token: string, currentPassword: string, newPassword: string): Promise<User> => {
  try {
    const response = await apiClient.put('/api/users/changePassword', {
      currentPassword,
      newPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    const message = error?.response?.data?.message || "Error changing password.";
    throw new Error(message);
  }
};