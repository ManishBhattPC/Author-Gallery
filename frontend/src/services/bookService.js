import apiClient from "./apiClient.js";

export const searchBooks = async (query) => {
  // API CALL: Connects to backend endpoint (GET /api/books?search=...)
  const response = await apiClient.get("/api/books", {
    params: { search: query },
  });
  return response.data;
};

export const fetchBookById = async (id) => {
  // API CALL: Connects to backend endpoint (GET /api/books/:id)
  const response = await apiClient.get(`/api/books/${id}`);
  return response.data;
};

export const createBook = async (bookPayload) => {
  // API CALL: Connects to backend endpoint (POST /api/books)
  const response = await apiClient.post("/api/books", bookPayload);
  return response.data;
};

export const updateBook = async (id, bookPayload) => {
  // API CALL: Connects to backend endpoint (PUT /api/books/:id)
  const response = await apiClient.put(`/api/books/${id}`, bookPayload);
  return response.data;
};

export const deleteBook = async (id) => {
  // API CALL: Connects to backend endpoint (DELETE /api/books/:id)
  const response = await apiClient.delete(`/api/books/${id}`);
  return response.data;
};
