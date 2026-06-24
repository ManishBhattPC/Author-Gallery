import apiClient from "./apiClient.js";

// Submit a new content report (book or author profile)
export const submitReport = async (reportData) => {
  const response = await apiClient.post("/api/reports", reportData);
  return response.data;
};
