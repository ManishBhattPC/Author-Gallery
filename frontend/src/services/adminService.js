import apiClient from "./apiClient.js";

// Fetch all moderator dashboard data
export const getAdminDashboardData = async () => {
  const response = await apiClient.get("/api/admin/dashboard");
  return response.data;
};

// Delete a book by ID
export const deleteBookByAdmin = async (bookId) => {
  const response = await apiClient.delete(`/api/admin/books/${bookId}`);
  return response.data;
};

// Delete/block an author account and their listings
export const deleteAuthorByAdmin = async (authorId) => {
  const response = await apiClient.delete(`/api/admin/authors/${authorId}`);
  return response.data;
};

// Dismiss a content report
export const dismissReportByAdmin = async (reportId) => {
  const response = await apiClient.delete(`/api/admin/reports/${reportId}`);
  return response.data;
};

// Delete a review by ID
export const deleteReviewByAdmin = async (reviewId) => {
  const response = await apiClient.delete(`/api/admin/reviews/${reviewId}`);
  return response.data;
};

// Fetch all transactions/orders on platform
export const getAdminTransactions = async () => {
  const response = await apiClient.get("/api/admin/transactions");
  return response.data;
};

// Fetch all contact messages/inquiries
export const getAdminContacts = async () => {
  const response = await apiClient.get("/api/admin/contacts");
  return response.data;
};

// Delete a contact message
export const deleteContactByAdmin = async (contactId) => {
  const response = await apiClient.delete(`/api/admin/contacts/${contactId}`);
  return response.data;
};
