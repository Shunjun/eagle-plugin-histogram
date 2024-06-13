import { defineConfig } from "vite";
import createExternal from "vite-plugin-external";

export default defineConfig({
  plugins: [
    createExternal({
      nodeBuiltins: true,
    }),
  ],
  build: {
    minify: false,
    lib: {
      entry: "src/main.ts",
      formats: ["cjs"],
    },
    outDir: "dist",
    rollupOptions: {
      output: {
        chunkFileNames: `js/[name].js`,
        entryFileNames: `js/index.js`,
        assetFileNames: `[ext]/[name].[ext]`,
      },
    },
  },
});
