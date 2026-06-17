import apiClient from "./apiClient.js";

export const fetchTopAuthors = async () => {
  // API CALL: Connects to backend endpoint (GET /api/authors?featured=true)
  const response = await apiClient.get("/api/authors", {
    params: { featured: true },
  });
  return response.data;
};

export const fetchAuthors = async () => {
  // API CALL: Connects to backend endpoint (GET /api/authors)
  const response = await apiClient.get("/api/authors");
  return response.data;
};

export const fetchAuthorById = async (id) => {
  // API CALL: Connects to backend endpoint (GET /api/authors/:id)
  const response = await apiClient.get(`/api/authors/${id}`);
  return response.data;
};
