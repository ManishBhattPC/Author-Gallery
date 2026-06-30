import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies automatically
  timeout: 75000, // 75s timeout to patiently handle Render cold starts
});

apiClient.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem("author_gallery_user");
      if (stored) {
        const user = JSON.parse(stored);
        if (user && user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (err) {
      console.error("Error setting auth header:", err);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatic retry for network or timeout errors (excellent for Render spin-ups)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config } = error;
    if (!config) {
      return Promise.reject(error);
    }

    config.retryCount = config.retryCount || 0;
    const MAX_RETRIES = 2;

    // Detect network failures or Axios timeouts
    const isNetworkOrTimeout = !error.response || error.code === "ECONNABORTED" || error.message?.includes("timeout");

    if (isNetworkOrTimeout && config.retryCount < MAX_RETRIES) {
      config.retryCount += 1;
      console.warn(`Render spin-up/timeout encountered. Retrying ${config.url} (${config.retryCount}/${MAX_RETRIES})...`);
      
      // Short backoff delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return apiClient(config);
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      "Request failed";

    return Promise.reject(new Error(message));
  }
);

export default apiClient;