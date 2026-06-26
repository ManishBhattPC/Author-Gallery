import apiClient from "./apiClient.js";
import { apiCache } from "./cacheManager.js";

export const fetchTopAuthors = async () => {
  const cacheKey = "authors:top";
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await apiClient.get("/api/authors", {
    params: { featured: true },
  });

  apiCache.set(cacheKey, response.data, 30);
  return response.data;
};

export const fetchAuthors = async (search = "") => {
  const cacheKey = `authors:list:${search.trim()}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) return cachedData;

  const params = {};
  if (search?.trim()) {
    params.search = search.trim();
  }

  const response = await apiClient.get("/api/authors", {
    params,
  });

  apiCache.set(cacheKey, response.data, 30);
  return response.data;
};

export const fetchAuthorById = async (id) => {
  const cacheKey = `authors:id:${id}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await apiClient.get(`/api/authors/${id}`);

  apiCache.set(cacheKey, response.data, 30);
  return response.data;
};

export const followAuthor = async (id) => {
  const response = await apiClient.post(`/api/authors/${id}/follow`);
  apiCache.invalidate("authors:"); // Invalidate cached authors lists/details
  return response.data;
};

export const unfollowAuthor = async (id) => {
  const response = await apiClient.post(`/api/authors/${id}/unfollow`);
  apiCache.invalidate("authors:"); // Invalidate cached authors lists/details
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