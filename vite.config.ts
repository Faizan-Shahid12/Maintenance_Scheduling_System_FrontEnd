import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173,
    // Enable HTTPS only when explicitly requested and cert files are available
    https: (() => {
      const useHttps = process.env.VITE_HTTPS === "true";
      if (!useHttps) return undefined;
      try {
        return {
          key: fs.readFileSync("./127.0.0.1+1-key.pem"),
          cert: fs.readFileSync("./127.0.0.1+1.pem"),
        };
      } catch {
        return undefined;
      }
    })(),
  },
});