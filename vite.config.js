import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: "192.168.100.5",
    // port: 3000,
    proxy: {
      "/customer/generateotp": "https://5525-58-65-186-88.ngrok-free.app",
      "/customer/auth/register": "https://5525-58-65-186-88.ngrok-free.app",

    },
    // https: true,
  },
});
