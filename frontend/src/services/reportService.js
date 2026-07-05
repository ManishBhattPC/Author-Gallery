import apiClient from "./apiClient.js";

// Submit a new content report (book or author profile)
export const submitReport = async (reportData) => {
  const response = await apiClient.post("/api/reports", reportData);
  return response.data;
};

// Fetch support reports submitted by the logged-in user
export const fetchMyReports = async () => {
  const response = await apiClient.get("/api/reports/my-reports");
  return response.data;
};
