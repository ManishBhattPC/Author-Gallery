import apiClient from "./apiClient.js";

export const getMyAuthorProfile = async () => {
  const response = await apiClient.get("/api/author-profile/me");
  return response.data;
};

export const createAuthorProfile = async (profileData) => {
  const response = await apiClient.post(
    "/api/author-profile",
    profileData
  );

  return response.data;
};

export const updateAuthorProfile = async (profileData) => {
  const response = await apiClient.put(
    "/api/author-profile/me",
    profileData
  );

  return response.data;
};



                  //  Logged-in author's profile