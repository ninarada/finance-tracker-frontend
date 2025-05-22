import apiClient from "./apiClient";

interface User {
  _id: string;
  username: string;
  email: string;
  token: string;
}

interface UpdatedProfileData {
  name?: string;
  surname?: string;
  location?: string;
  bio?: string;
}

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

        console.log(response.data);

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