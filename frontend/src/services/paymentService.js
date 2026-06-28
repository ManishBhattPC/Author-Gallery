import apiClient from "./apiClient.js";

/**
 * Creates a Razorpay order in the backend
 * @param {string} bookId 
 * @returns {Promise<object>} Order details
 */
export const createPaymentOrder = async (bookId) => {
  const response = await apiClient.post("/api/payments/order", { bookId });
  return response.data;
};

/**
 * Verifies Razorpay payment signature in the backend
 * @param {object} paymentData { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 * @returns {Promise<object>} Verification response
 */
export const verifyPaymentSignature = async (paymentData) => {
  const response = await apiClient.post("/api/payments/verify", paymentData);
  return response.data;
};
