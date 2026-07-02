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

export const fetchAuthors = async (params = {}) => {
  const queryParams = typeof params === "string" ? { search: params } : params;
  const cacheKey = `authors:list:${JSON.stringify(queryParams)}`;
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) return cachedData;

  const response = await apiClient.get("/api/authors", {
    params: queryParams,
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

export const fetchMyFollowers = async (params = {}) => {
  const response = await apiClient.get("/api/authors/dashboard/followers", { params });
  return response.data;
};

export const fetchMyFollowing = async (params = {}) => {
  const response = await apiClient.get("/api/authors/dashboard/following", { params });
  return response.data;
};