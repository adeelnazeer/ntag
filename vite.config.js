import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: "192.168.100.5",
    // port: 3000,
    proxy: {
      "/customer/generateotp": "https://78b9-59-103-109-25.ngrok-free.app",
      "/customer/corptaglist": "https://78b9-59-103-109-25.ngrok-free.app",
      "/customer/auth/register": "https://78b9-59-103-109-25.ngrok-free.app",
      "/customer/auth/login": "https://78b9-59-103-109-25.ngrok-free.app",
      "/customer/updatecustomer": "https://78b9-59-103-109-25.ngrok-free.app",


    },
    // https: true,
  },
});
