import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-spa-files",
      apply: "build",
      writeBundle() {
        const distDir = path.join(__dirname, "dist");
        const indexPath = path.join(distDir, "index.html");
        const notFoundPath = path.join(distDir, "404.html");
        
        if (fs.existsSync(indexPath)) {
          const content = fs.readFileSync(indexPath, "utf-8");
          fs.writeFileSync(notFoundPath, content);
          console.log("✓ Created 404.html for SPA fallback");
        }
      },
    },
  ],
  publicDir: "public",
});
