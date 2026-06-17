import apiClient from "./apiClient.js";

export const loginUser = async (credentials) => {
  // API CALL: Connects to backend endpoint (POST /api/login)
  const response = await apiClient.post("/api/login", credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  // API CALL: Connects to backend endpoint (POST /api/signup)
  const response = await apiClient.post("/api/signup", userData);
  return response.data;
};

export const fetchCurrentUser = async () => {
  // API CALL: Connects to backend endpoint (GET /api/me)
  const response = await apiClient.get("/api/me");
  return response.data;
};
