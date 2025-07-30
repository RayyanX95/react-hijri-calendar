import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  root: __dirname,
  plugins: [react()],
  resolve: {
    alias: {
      "@calendar": path.resolve(__dirname, "../src/Calendar"),
    },
  },
  server: {
    port: 5173,
  },
});
