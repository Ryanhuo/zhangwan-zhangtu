import { createRoot } from "react-dom/client";
import { AnnotationLayerPortal, hasActiveAnnotationLayer } from "./zhangtu-requirement";
import { getPageDirectoryFromLocation } from "./zhangtu-quick-edit-api";

// 「编辑页面」与「页面备注」是两个独立能力，但它们的实现都在 <AnnotationLayerPortal> 里。
// 过去只有被标注技能处理过、写入了 zhangtu.requirements.ts 的页面才会在自己的 JSX 里挂这个组件，
// 导致「没生成页面备注 ⇒ 编辑页面不可用」的耦合。这个自动挂载器让**每个**预览页面都无条件挂上该图层，
// 从而让编辑页面独立于备注可用；备注为空时图层同样正常工作（备注可后续通过 shell 的 hydrate 桥接注入）。
//
// 判重：若页面已在自己的 JSX 里显式挂了 <AnnotationLayerPortal>（通常因为有页面备注），
// hasActiveAnnotationLayer() 为真，这里跳过，避免同一页出现两套图层。

const AUTOLOAD_CONTAINER_ID = "zhangtu-annotation-autoload-root";

function derivePageKey(): string {
  const directory = getPageDirectoryFromLocation();
  if (directory) {
    const key = directory.replace(/^src\/pages\//, "").replace(/\/+$/, "");
    if (key) return key;
  }
  // 兜底：从 pathname 里取一个稳定的段（去掉 index.html 与首尾斜杠）。
  const fallback = window.location.pathname
    .replace(/index\.html$/, "")
    .replace(/^\/+|\/+$/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return fallback || "page";
}

function readInitialAnnotations() {
  const injected = (window as unknown as { __zhangtuRequirements?: unknown }).__zhangtuRequirements;
  return Array.isArray(injected) ? injected : [];
}

function mountAnnotationLayer() {
  if (hasActiveAnnotationLayer()) return;
  if (document.getElementById(AUTOLOAD_CONTAINER_ID)) return;

  const container = document.createElement("div");
  container.id = AUTOLOAD_CONTAINER_ID;
  document.body.appendChild(container);

  createRoot(container).render(
    <AnnotationLayerPortal annotations={readInitialAnnotations()} pageKey={derivePageKey()} />,
  );
}

// 延后到页面自身的 React 提交之后再判重挂载：双 rAF 约等于「首帧绘制后」，
// 此时页面若自带图层，其 layout effect 已把计数登记好。
function scheduleMount() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      mountAnnotationLayer();
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scheduleMount, { once: true });
} else {
  scheduleMount();
}
