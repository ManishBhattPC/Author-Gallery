import apiClient from "./apiClient.js";

// Add a new review
export const addReview = async (reviewData) => {
  const response = await apiClient.post("/api/reviews", reviewData);
  return response.data;
};

// Fetch reviews for a specific book
export const getBookReviews = async (bookId) => {
  const response = await apiClient.get(`/api/reviews/book/${bookId}`);
  return response.data;
};

// Fetch reviews for a specific author
export const getAuthorReviews = async (authorId) => {
  const response = await apiClient.get(`/api/reviews/author/${authorId}`);
  return response.data;
};
