import apiClient from "./apiClient.js";

export const getBooks = async (params = {}) => {
  const response = await apiClient.get("/api/books", {
    params, // Search, genre, pagination filters
  });

  return response.data;
};

export const getMyBooks = async () => {
  const response = await apiClient.get("/api/books/my-books");

  return response.data;
};

export const searchBooks = async (query) => {
  const response = await apiClient.get("/api/books", {
    params: { search: query }, // Search by title
  });

  return response.data;
};

export const fetchBookById = async (id) => {
  const response = await apiClient.get(`/api/books/${id}`);

  return response.data;
};

export const createBook = async (formData) => {
  const response = await apiClient.post(
    "/api/books",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data", // Required for image + PDF upload
      },
    }
  );

  return response.data;
};

export const updateBook = async (id, bookPayload) => {
  const response = await apiClient.put(
    `/api/books/${id}`,
    bookPayload
  );

  return response.data;
};

export const deleteBook = async (id) => {
  const response = await apiClient.delete(`/api/books/${id}`);

  return response.data;
};

/*
Future Roadmap

1. Advanced Search
--------------------------------
- Search by author name
- Search by multiple genres
- Search by tags

2. Sorting
--------------------------------
- Newest books
- Oldest books
- Price low to high
- Price high to low

3. Analytics
--------------------------------
- Most viewed books
- Most downloaded books

4. Admin Features
--------------------------------
- Admin get all books
- Admin update any book
- Admin delete any book

5. API Improvements
--------------------------------
- Move query builders to separate utilities
- Add request caching
- Add optimistic UI updates
*/