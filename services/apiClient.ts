import axios from "axios";

const apiClient = axios.create({
  baseURL: `http://${process.env.EXPO_PUBLIC_IP}:5001/`,  
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
