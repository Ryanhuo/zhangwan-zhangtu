import { cpSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const projectRoot = dirname(fileURLToPath(import.meta.url));

function collectPageInputs(dir: string, relativeDir = "") {
  const inputs: Record<string, string> = {};
  if (!existsSync(dir)) return inputs;

  const children = readdirSync(dir, { withFileTypes: true });
  const hasIndexTsx = children.some((entry) => entry.isFile() && entry.name === "index.tsx");
  const hasIndexHtml = children.some((entry) => entry.isFile() && entry.name === "index.html");

  if (hasIndexTsx && hasIndexHtml) {
    inputs[relativeDir || "index"] = resolve(dir, "index.html");
  }

  for (const entry of children) {
    const relativePath = relativeDir ? `${relativeDir}/${entry.name}` : entry.name;
    const absolutePath = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      if (["assets", "data", "styles", "node_modules", "dist"].includes(entry.name)) {
        continue;
      }
      Object.assign(inputs, collectPageInputs(absolutePath, relativePath));
    }
  }
  return inputs;
}

// 给每个页面的 index.html 注入标注/编辑图层的自动挂载脚本，让「编辑页面」独立于「页面备注」可用
// （不再依赖页面是否在自己的 JSX 里挂了 <AnnotationLayerPortal>）。dev 预览与生产构建共用同一份配置。
function annotationAutoloadPlugin() {
  return {
    name: "zhangtu-annotation-autoload",
    // order:'pre' 让注入发生在 Vite 扫描 HTML 收集入口之前，这样生产构建会把这段脚本
    // 当作真实模块入口打包（否则会残留一个指向 .tsx 源文件、构建后 404 的 <script>）。
    transformIndexHtml: {
      order: "pre" as const,
      handler() {
        return [
          {
            tag: "script",
            attrs: { type: "module", src: "/src/common/zhangtu-annotation-autoload.tsx" },
            injectTo: "body" as const,
          },
        ];
      },
    },
  };
}

// 设计系统展示页(src/pages/design-system/)通过 <iframe src="./assets/zhangwan-design/...">
// 直接引用 zhangwan-design skill 镜像里的静态 html/css(guidelines 卡片、组件 *.card.html、
// ui_kits 等)，这些文件不经过任何 import，Vite 的构建产物收集看不到它们，生产构建默认不会
// 复制进 dist。这个插件在 build 结束后把该目录原样拷贝到 dist 里对应位置，保证发布后 iframe
// 不会 404。
function copyDesignSystemAssetsPlugin() {
  const src = resolve(projectRoot, "src/pages/design-system/assets/zhangwan-design");
  const dest = resolve(projectRoot, "dist/src/pages/design-system/assets/zhangwan-design");
  return {
    name: "zhangtu-copy-design-system-assets",
    apply: "build" as const,
    closeBundle() {
      if (existsSync(src)) {
        cpSync(src, dest, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), annotationAutoloadPlugin(), copyDesignSystemAssetsPlugin()],
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
