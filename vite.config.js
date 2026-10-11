import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  // The procedural 3D scene needs no dead-code analysis; this keeps builds fast.
  build: { rollupOptions: { treeshake: false, output: { manualChunks: { three: ["three"] } } } },
});
