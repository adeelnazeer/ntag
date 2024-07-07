import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // host: "192.168.100.5",
    // port: 3000,
    // proxy: {
    //   "/customer/generateotp": "https://4173-115-186-141-70.ngrok-free.app",
    //   "/customer/corptaglist": "https://4173-115-186-141-70.ngrok-free.app",
    //   "/customer/auth/register": "https://4173-115-186-141-70.ngrok-free.app",
    //   "/customer/auth/login": "https://4173-115-186-141-70.ngrok-free.app",
    //   "/customer/updatecustomer": "https://4173-115-186-141-70.ngrok-free.app",
    // },
    // https: true,
  },
});
