import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // The key '/api' is the path prefix that Vite will watch.
      // e.g., A request from the frontend to http://localhost:5173/api/history
      "/api": {
        // The URL where the request will be forwarded.
        target: "http://localhost:3000",

        // This is important! It changes the 'Host' header of the forwarded request
        // to match the target URL, which is often required by the backend server.
        changeOrigin: true,
      },
    },
  },
});
