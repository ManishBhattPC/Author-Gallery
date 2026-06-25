import apiClient from "./apiClient";

const CONTACT_ENDPOINT = "/api/contact";

export const sendContactMessage = async (contactData) => {
  const response = await apiClient.post(CONTACT_ENDPOINT, contactData);
  return response.data;
};

export default {
  sendContactMessage,
};
