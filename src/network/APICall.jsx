import axios from "axios";
import i18n from "../i18n";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const tempConfig = config;
    const token = localStorage.getItem("token");
    const guestToken = localStorage.getItem("cToken");
    
    // Initialize headers if not present
    if (!tempConfig.headers) {
      tempConfig.headers = {};
    }
    
    // For guest endpoints, use guest_token as a custom header
    // For regular endpoints, use Authorization Bearer token
    const isGuestEndpoint = config.url && (config.url.includes("/guest/") || config.url.includes("/customer/guest/"));
    
    if (isGuestEndpoint) {
      // Guest endpoint: use guest_token as custom header
      if (guestToken) {
        tempConfig.headers["guest-token"] = guestToken;
        // Remove Authorization header for guest endpoints to avoid conflicts
        if (tempConfig.headers.Authorization) {
          delete tempConfig.headers.Authorization;
        }
        console.log("Guest endpoint detected, setting guest_token header");
      } else {
        console.warn("Guest endpoint called but no guest_token found in localStorage");
      }
    } else {
      // Regular endpoint: use Authorization Bearer token
      if (token) {
        tempConfig.headers.Authorization = `Bearer ${token}`;
      }
      // Remove guest_token for regular endpoints
      if (tempConfig.headers["guest-token"]) {
        delete tempConfig.headers["guest-token"];
      }
    }
    
    // Add current language to all API requests
    const currentLanguage = i18n.language || i18n.resolvedLanguage || "en";
    tempConfig.headers["x-language"] = currentLanguage;
    
    // Debug: Log headers for guest endpoints
    if (isGuestEndpoint) {
      console.log("Request headers for guest endpoint:", {
        url: config.url,
        guest_token: tempConfig.headers["guest_token"] ? "present" : "missing",
        hasAuthorization: !!tempConfig.headers.Authorization
      });
    }
    
    return tempConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const getFormData = (object) => {
  // If object is already FormData, return it as is
  if (object instanceof FormData) {
    return object;
  }
  
  // Otherwise create new FormData from object
  const formData = new FormData();
  Object.keys(object).forEach((key) => {
    return formData.append(key, object[key]);
  });
  return formData;
};

const APICall = async (
  method,
  body,
  url = null,
  headers = null,
  formData = false
) => {
  const config = {
    method,
    headers: headers || {}, // Initialize headers object
  };
  
  if (url) {
    config.url = url;
  }

  if (body && method === "get") {
    config.params = body;
  } else if (body && formData) {
    config.data = getFormData(body);
    config.headers = { 
      ...config.headers,
      "Content-Type": "multipart/form-data" 
    };
  } else if (body) {
    config.data = body;
  }

  if (headers) {
    config.headers = {
      ...config.headers,
      ...headers
    };
  }

  return new Promise((resolve, reject) => {
    axiosInstance(config)
      .then((res) => {
        resolve(res.data);
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            // Don't redirect guest users to login, just reject with error
            const isGuestEndpoint = error.config?.url?.includes("/guest/") || error.config?.url?.includes("guest");
            if (!isGuestEndpoint) {
              reject(new Error("Session expired. Please log in again."));
              window.location.href = "/login";
              localStorage.clear();
              return;
            } else {
              // For guest endpoints, just reject with the error message
              reject(error.response.data?.message || "Unauthorized. Please verify your guest token.");
              return;
            }
          }
          if (error.response.data && error.response.data?.message) {
            reject(error.response.data.message);
            return;
          }
        }
        if (error.code === "ECONNABORTED") {
          reject("Request timeout. Please check your internet connection");
          return;
        }
        reject("Something went wrong, Please try again later.");
      });
  });
};

export default APICall;