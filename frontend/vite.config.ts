import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copy } from "esbuild";
import fs from "fs";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "copy-redirects",
      apply: "build",
      generateBundle() {
        const redirectsPath = path.join(__dirname, "public", "_redirects");
        if (fs.existsSync(redirectsPath)) {
          const content = fs.readFileSync(redirectsPath, "utf-8");
          this.emitFile({
            type: "asset",
            fileName: "_redirects",
            source: content,
          });
        }
      },
    },
  ],
  publicDir: "public",
});
