import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  build: {
    outDir: "dist",
    rollupOptions: {
      output: {
        chunkFileNames: `js/[name].js`,
        entryFileNames: `js/[name].js`,
        assetFileNames: `[ext]/[name].[ext]`,
      },
    },
  },
});
