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
    // Axios may provide headers as an AxiosHeaders instance; normalize to plain object
    // so reads/writes like tempConfig.headers.Authorization work reliably.
    if (typeof tempConfig.headers?.toJSON === "function") {
      tempConfig.headers = { ...tempConfig.headers.toJSON() };
    } else {
      tempConfig.headers = { ...(tempConfig.headers || {}) };
    }

    const getAuthorizationHeader = () =>
      tempConfig.headers.Authorization ?? tempConfig.headers.authorization;
    const setAuthorizationHeader = (value) => {
      tempConfig.headers.Authorization = value;
      // avoid two different casings being sent
      if (tempConfig.headers.authorization) delete tempConfig.headers.authorization;
    };
    const deleteAuthorizationHeader = () => {
      if (tempConfig.headers.Authorization) delete tempConfig.headers.Authorization;
      if (tempConfig.headers.authorization) delete tempConfig.headers.authorization;
    };
    
    // For guest endpoints, use guest_token as a custom header
    // For regular endpoints, use Authorization Bearer token
    const isGuestEndpoint = config.url && (config.url.includes("/guest/") || config.url.includes("/customer/guest/"));
    
    if (isGuestEndpoint) {
      // Guest endpoint: use guest_token as custom header
      if (guestToken) {
        tempConfig.headers["guest-token"] = guestToken;
        // For guest endpoints, avoid sending the normal user-session token as Authorization,
        // but preserve any explicitly provided Authorization value (e.g. deleteToken).
        if (
          token &&
          typeof getAuthorizationHeader() === "string" &&
          getAuthorizationHeader().trim() === `Bearer ${token}`
        ) {
          deleteAuthorizationHeader();
        }
        console.log("Guest endpoint detected, setting guest_token header");
      } else {
        console.warn("Guest endpoint called but no guest_token found in localStorage");
      }
    } else {
      // Regular endpoint: use Authorization Bearer token
      if (token && !getAuthorizationHeader()) {
        setAuthorizationHeader(`Bearer ${token}`);
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
        guest_token: tempConfig.headers["guest-token"] ? "present" : "missing",
        hasAuthorization: !!getAuthorizationHeader()
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
            const isGuestEndpoint =
              error.config?.url?.includes("/guest/") ||
              error.config?.url?.includes("/customer/guest/") ||
              error.config?.url?.includes("guest");
            const noAuthRedirect =
              error.config?.headers?.["x-no-auth-redirect"] ||
              error.config?.headers?.["X-No-Auth-Redirect"];

            if (!isGuestEndpoint && !noAuthRedirect) {
              reject(new Error("Session expired. Please log in again."));
              window.location.href = "/login";
              localStorage.clear();
              return;
            }

            reject(
              error.response.data?.message ||
                (isGuestEndpoint
                  ? "Unauthorized. Please verify your guest token."
                  : "Unauthorized.")
            );
            return;
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