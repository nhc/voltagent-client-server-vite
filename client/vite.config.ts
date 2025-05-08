import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    sourcemap: true,
  },
  server: {
    sourcemapIgnoreList: (sourcePath) => {
      return (
        sourcePath.includes("node_modules") ||
        sourcePath.includes("react_devtools_backend")
      );
    },
  },
});
