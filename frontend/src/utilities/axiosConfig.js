import axios from "axios";

// Note: Multiple interceptors resolve different requests checked reverse-sequentially (second listed executed first)

// Set up base configuration
// axios.defaults.baseURL = process.env.REACT_APP_BACKEND_API_URL; // Your API base URL
// const apiBaseURL = `http://${window.location.hostname}/api`;
// const apiBaseURL = `http://localhost/api`;

// Dynamically set the base URL based on the current location
const { protocol, hostname } = window.location;
let apiBaseURL;

if (hostname === 'localhost' || hostname === '127.0.0.1') {
  apiBaseURL = `${protocol}//localhost/api`;
} else {
  apiBaseURL = `${protocol}//${hostname}/api`;
}

axios.defaults.baseURL = apiBaseURL;

// axios.defaults.baseURL = `http://localhost/api`;
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.withCredentials = true;

// Add a request interceptor
axios.interceptors.request.use(
  (config) => {
    const securePaths = ["/api/images", "/api/corrections", "/api/logout", "/api/start-metrics-task"]; // Define paths that require auth
    if (securePaths.some((path) => config.url.includes(path))) {
      const token = localStorage.getItem("access"); // Assuming you store the access token with this key
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
axios.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      // Check if we should handle token refresh (401 status and not already retried)
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true; // Marking that we've already retried
        try {
          const refreshToken = localStorage.getItem("refresh"); // Get the refresh token from storage
          const tokenResponse = await axios.post('/api/token/refresh/', { refresh: refreshToken });
          const { access } = tokenResponse.data;
          localStorage.setItem("access", access); // Update the access token in local storage
          axios.defaults.headers.common["Authorization"] = `Bearer ${access}`; // Update the default Authorization header
          originalRequest.headers["Authorization"] = `Bearer ${access}`; // Update the Authorization header for the current request
          return axios(originalRequest); // Retry the original request with the new token
        } catch (refreshError) {
          // Handle failed refresh here (e.g., redirect to login or logout the user)
          console.error('Failed to refresh token:', refreshError);
          // Optionally clear the existing tokens from storage to force a re-login
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

export default axios;
