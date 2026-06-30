import { existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const projectRoot = dirname(fileURLToPath(import.meta.url));

function collectPageInputs(dir: string, relativeDir = "") {
  const inputs: Record<string, string> = {};
  if (!existsSync(dir)) return inputs;

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
    const absolutePath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      Object.assign(inputs, collectPageInputs(absolutePath, relativePath));
      continue;
    }
    if (entry.isFile() && entry.name === "index.html") {
      inputs[relativeDir || "index"] = absolutePath;
    }
  }
  return inputs;
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(projectRoot, "src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 51730,
    strictPort: false,
    open: false,
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: collectPageInputs(resolve(projectRoot, "src/pages")),
    },
  },
});
