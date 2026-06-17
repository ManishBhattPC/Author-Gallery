import apiClient from "./apiClient.js";

export const loginUser = async (credentials) => {
  const response = await apiClient.post(
    "/api/auth/login",
    credentials
  );
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await apiClient.post(
    "/api/auth/register",
    userData
  );
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await apiClient.get(
    "/api/auth/profile"
  );
  return response.data;
};