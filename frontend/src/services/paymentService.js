import apiClient from "./apiClient.js";

/**
 * Sends a direct offline payment request to the author of a book
 * @param {string} bookId 
 * @returns {Promise<object>} Request response
 */
export const requestOfflinePayment = async (bookId, whatsapp, address, note) => {
  const response = await apiClient.post("/api/payments/request", { bookId, whatsapp, address, note });
  return response.data;
};

/**
 * Fetches all pending offline purchase requests for the logged-in author
 * @returns {Promise<array>} Array of requests
 */
export const fetchAuthorRequests = async () => {
  const response = await apiClient.get("/api/payments/requests/author");
  return response.data;
};

/**
 * Approves a buyer's purchase request and grants access to the book
 * @param {string} requestId 
 * @returns {Promise<object>} Approve response
 */
export const approvePurchaseRequest = async (requestId) => {
  const response = await apiClient.post(`/api/payments/requests/${requestId}/approve`);
  return response.data;
};

/**
 * Declines a buyer's purchase request
 * @param {string} requestId 
 * @returns {Promise<object>} Decline response
 */
export const declinePurchaseRequest = async (requestId) => {
  const response = await apiClient.post(`/api/payments/requests/${requestId}/decline`);
  return response.data;
};

/**
 * Creates a Razorpay order in the backend (Kept for future modularity)
 * @param {string} bookId 
 * @returns {Promise<object>} Order details
 */
export const createPaymentOrder = async (bookId) => {
  const response = await apiClient.post("/api/payments/order", { bookId });
  return response.data;
};

/**
 * Verifies Razorpay payment signature in the backend (Kept for future modularity)
 * @param {object} paymentData { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * @returns {Promise<object>} Verification response
 */
export const verifyPaymentSignature = async (paymentData) => {
  const response = await apiClient.post("/api/payments/verify", paymentData);
  return response.data;
};
