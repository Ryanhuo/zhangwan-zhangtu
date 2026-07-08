/**
 * "快速编辑"落盘接口的前端封装，对应 scripts/zhangtu/preview-server.mjs 里的
 * /api/quick-edit/* 路由。所有请求都走当前 origin（页面本身就是经 preview-server 代理加载的）。
 */

export type TextReplacement = { searchText: string; replaceText?: string };

async function requestJson<T>(input: string, init?: RequestInit): Promise<{ ok: boolean; data: T }> {
  const response = await fetch(input, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = (await response.json().catch(() => ({}))) as T;
  return { ok: response.ok, data };
}

export function getPageDirectoryFromLocation(): string | null {
  const pathname = window.location.pathname.replace(/^\/+/, "");
  if (!pathname.endsWith("/index.html")) {
    return null;
  }
  const pageDirectory = pathname.slice(0, -"/index.html".length);
  return pageDirectory || null;
}

export async function fetchHackCss(pageDirectory: string) {
  return requestJson<{ success?: boolean; content?: string; error?: string }>(
    `/api/quick-edit/hack-css?path=${encodeURIComponent(pageDirectory)}`,
  );
}

export async function saveHackCss(pageDirectory: string, content: string) {
  return requestJson<{ success?: boolean; merged?: string; error?: string }>("/api/quick-edit/hack-css/save", {
    method: "POST",
    body: JSON.stringify({ path: pageDirectory, content }),
  });
}

export async function clearHackCss(pageDirectory: string) {
  return requestJson<{ success?: boolean; error?: string }>("/api/quick-edit/hack-css/clear", {
    method: "POST",
    body: JSON.stringify({ path: pageDirectory }),
  });
}

export async function countTextReplacements(pageDirectory: string, replacements: TextReplacement[]) {
  return requestJson<{ success?: boolean; totalCount?: number; error?: string }>("/api/quick-edit/text-replace/count", {
    method: "POST",
    body: JSON.stringify({ path: pageDirectory, replacements }),
  });
}

export async function applyTextReplacements(pageDirectory: string, replacements: TextReplacement[]) {
  return requestJson<{ success?: boolean; changedFiles?: number; error?: string }>("/api/quick-edit/text-replace/replace", {
    method: "POST",
    body: JSON.stringify({ path: pageDirectory, replacements }),
  });
}
