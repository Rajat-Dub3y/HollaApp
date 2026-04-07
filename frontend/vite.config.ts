import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"),
        "@assets": path.resolve(__dirname, "attached_assets")
      }
    },
    server: {
      proxy: {
        "/api": {
          target: env.BACKEND_URL,
          secure: false,
        },
      }
    },
    build: {
      outDir: "dist",
      emptyOutDir: true
    }
  };
});