/**
 * Macle Framework Configuration
 * This configuration file is used for converting the web portal to Mini App
 */

export default {
  // Mini App basic information
  appId: "ntag-portal-miniapp",
  appName: "NameTAG Service",
  appVersion: "1.0.0",
  
  // Build configuration
  build: {
    // Output directory for Mini App
    outputDir: "dist-miniapp",
    // Public path
    publicPath: "/",
    // Whether to enable source map
    sourceMap: false,
    // Whether to minify
    minify: true,
  },

  // Pages configuration
  pages: {
    // Entry page
    entry: "src/main.jsx",
    // Template file
    template: "index.html",
  },

  // Mini App specific configuration
  miniapp: {
    // Navigation bar configuration
    navigationBar: {
      titleText: "NameTAG Service",
      backgroundColor: "#f5f5f5",
      textStyle: "black",
    },
    
    // Tab bar configuration (if needed)
    tabBar: {
      color: "#7A7E83",
      selectedColor: "#3cc51f",
      backgroundColor: "#ffffff",
      list: [],
    },

    // Network timeout
    networkTimeout: {
      request: 10000,
      downloadFile: 10000,
    },

    // Permission configuration
    permission: {
      "scope.userLocation": {
        desc: "Your location will be used for service purposes",
      },
    },
  },

  // H5 to Mini App conversion rules
  conversion: {
    // Route conversion mapping
    routes: {
      "/": "pages/home/index",
      "/login": "pages/login/index",
      "/register": "pages/register/index",
      "/dashboard": "pages/dashboard/index",
    },

    // API conversion rules
    api: {
      // Base URL for API calls
      baseURL: process.env.VITE_API_BASE_URL || "",
      // Request timeout
      timeout: 10000,
    },

    // Component conversion rules
    components: {
      // Map web components to Mini App components
      // Example: "div" -> "view", "span" -> "text"
    },
  },
};

