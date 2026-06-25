import apiClient from "./apiClient.js";

export const fetchTopAuthors = async () => {
  // API CALL: Connects to backend endpoint (GET /api/authors?featured=true)
  const response = await apiClient.get("/api/authors", {
    params: { featured: true },
  });
  return response.data;
};

export const fetchAuthors = async (search = "") => {
  // API CALL: Connects to backend endpoint (GET /api/authors)
  const params = {};
  if (search?.trim()) {
    params.search = search.trim();
  }

  const response = await apiClient.get("/api/authors", {
    params,
  });

  return response.data;
};

export const fetchAuthorById = async (id) => {
  // API CALL: Connects to backend endpoint (GET /api/authors/:id)
  const response = await apiClient.get(`/api/authors/${id}`);
  return response.data;
};

export const followAuthor = async (id) => {
  const response = await apiClient.post(`/api/authors/${id}/follow`);
  return response.data;
};

export const unfollowAuthor = async (id) => {
  const response = await apiClient.post(`/api/authors/${id}/unfollow`);
  return response.data;
};

export const checkFollowStatus = async (id) => {
  const response = await apiClient.get(`/api/authors/${id}/is-following`);
  return response.data;
};

export const fetchMyFollowers = async () => {
  const response = await apiClient.get("/api/authors/dashboard/followers");
  return response.data;
};

export const fetchMyFollowing = async () => {
  const response = await apiClient.get("/api/authors/dashboard/following");
  return response.data;
};