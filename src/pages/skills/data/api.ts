export interface SkillSummary {
  id: string;
  slug: string;
  name: string;
  callableName: string;
  description: string;
  author: string | null;
  category: "project" | "user";
  /** 能力技能 vs 框架运维技能 */
  tier: "capability" | "ops";
  source: string;
  registered: boolean;
  callableConflict: boolean;
  fileCount: number;
  entryPath: string;
  skillPath: string;
}

export interface SkillDetail extends SkillSummary {
  markdown: string;
  contentMarkdown: string;
}

interface SkillsPayload {
  skills: SkillSummary[];
}

interface SkillDetailPayload {
  skill: SkillDetail;
}

interface SkillImportPayload {
  skill: SkillSummary;
}

const API_ORIGIN_QUERY_KEY = "zhangtuApiOrigin";

export async function listSkills() {
  const payload = await requestApi<SkillsPayload>("/api/skills");
  return payload.skills || [];
}

export async function readSkillDetail(id: string) {
  const payload = await requestApi<SkillDetailPayload>(`/api/skills/${encodeURIComponent(id)}`);
  return payload.skill;
}

export async function deleteSkillEntry(id: string) {
  await requestApi<{ deleted: string }>(`/api/skills/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function importSkillEntry(file: File) {
  const payload = await requestApi<SkillImportPayload>("/api/skills/import", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      filename: file.name,
      dataBase64: await readFileAsDataUrl(file),
    }),
  });
  return payload.skill;
}

async function requestApi<T>(path: string, init?: RequestInit) {
  const origins = resolveApiOrigins();
  let lastError = new Error("技能接口暂时不可用。");

  for (const origin of origins) {
    try {
      const response = await fetch(new URL(path, origin), init);
      const raw = await response.text();
      const payload = tryParseJson(raw);
      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json") || payload !== null;

      if (!response.ok) {
        if (response.status === 404 && origin !== origins[origins.length - 1]) {
          lastError = new Error(raw || `接口不存在：${path}`);
          continue;
        }
        throw new Error(extractErrorMessage(payload, raw, response.status));
      }

      if (!isJson) {
        lastError = new Error("技能接口返回了非 JSON 响应。");
        continue;
      }

      return payload as T;
    } catch (error) {
      lastError = normalizeError(error);
    }
  }

  throw lastError;
}

function resolveApiOrigins() {
  const origins: string[] = [];
  const query = new URLSearchParams(window.location.search);
  const queryOrigin = query.get(API_ORIGIN_QUERY_KEY);
  const referrerOrigin = parseOrigin(document.referrer);
  const currentOrigin = window.location.origin;
  const defaultPreviewOrigin = `${window.location.protocol}//${window.location.hostname}:6320`;

  pushOrigin(origins, queryOrigin);
  pushOrigin(origins, referrerOrigin);
  pushOrigin(origins, currentOrigin);
  pushOrigin(origins, defaultPreviewOrigin);

  return origins;
}

function pushOrigin(origins: string[], value: string | null) {
  if (!value || origins.includes(value)) {
    return;
  }
  origins.push(value);
}

function parseOrigin(value: string) {
  if (!value) {
    return null;
  }
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function tryParseJson(raw: string) {
  if (!raw) {
    return {};
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function extractErrorMessage(payload: unknown, raw: string, status: number) {
  if (payload && typeof payload === "object" && "error" in payload && typeof payload.error === "string") {
    return payload.error;
  }
  return raw || `请求失败（${status}）`;
}

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return error;
  }
  return new Error(String(error));
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error(`读取文件失败：${file.name}`));
    reader.readAsDataURL(file);
  });
}
