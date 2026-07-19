import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { checkPages } from "../check-pages.mjs";
import { discoverPages } from "./discovery.mjs";
import { listIterations } from "./iterations.mjs";

const DOCUMENTED_PAGE_REFERENCE_FILES = ["README.md", "docs/zhangtu.md"];

export async function runDoctor(rootDir) {
  const discovery = discoverPages(rootDir);
  const pageCheck = await checkPages(rootDir);
  const iterations = listIterations(rootDir);
  const pageIdSet = new Set(discovery.pages.map((page) => page.id));

  const iterationIssues = iterations.flatMap((iteration) =>
    (Array.isArray(iteration.pageIds) ? iteration.pageIds : [])
      .filter((pageId) => !pageIdSet.has(pageId))
      .map((pageId) => ({
        iterationId: iteration.id,
        iterationName: iteration.name,
        pageId,
      }))
  );

  const docReferenceIssues = DOCUMENTED_PAGE_REFERENCE_FILES.flatMap((relativePath) =>
    collectMissingDocumentedPageDirs(rootDir, relativePath)
  );

  // 需求反转（第 2 期）：全局需求源 src/requirements/ 与页面 ref 引用的健康度。
  const REQUIREMENT_DIAGNOSTIC_CODES = new Set([
    "requirement-missing-id",
    "requirement-duplicate-id",
    "requirement-ref-missing",
  ]);
  const requirementIssues = discovery.diagnostics.filter((item) => REQUIREMENT_DIAGNOSTIC_CODES.has(item.code));
  const globalRequirementCount = Array.isArray(discovery.requirements) ? discovery.requirements.length : 0;

  const checks = [
    {
      id: "page-discovery",
      label: "页面发现",
      status: discovery.diagnostics.length ? "warning" : "ok",
      summary: discovery.diagnostics.length
        ? `发现 ${discovery.diagnostics.length} 条诊断，当前识别到 ${discovery.pages.length} 个页面。`
        : `页面发现正常，当前识别到 ${discovery.pages.length} 个页面。`,
      details: discovery.diagnostics.map((item) => ({
        severity: item.severity,
        code: item.code || "",
        message: item.message,
        sourcePath: item.sourcePath || "",
      })),
    },
    {
      id: "page-contract",
      label: "页面入口契约",
      status: pageCheck.ok ? "ok" : "error",
      summary: pageCheck.ok
        ? `已校验 ${pageCheck.checked} 个页面入口，未发现契约问题。`
        : `已校验 ${pageCheck.checked} 个页面入口，发现 ${pageCheck.failures.length} 个契约问题。`,
      details: pageCheck.failures.map((item) => ({
        severity: "error",
        code: item.reason,
        message: item.message,
        sourcePath: item.file,
      })),
    },
    {
      id: "iterations",
      label: "迭代引用",
      status: iterationIssues.length ? "error" : "ok",
      summary: iterationIssues.length
        ? `发现 ${iterationIssues.length} 个失效页面引用。`
        : `已检查 ${iterations.length} 个迭代，页面引用正常。`,
      details: iterationIssues.map((item) => ({
        severity: "error",
        code: "missing-page-reference",
        message: `迭代「${item.iterationName}」引用了不存在的页面 ID: ${item.pageId}`,
        sourcePath: `.zhangtu/iterations/${item.iterationId}.json`,
      })),
    },
    {
      id: "requirements",
      label: "需求源",
      status: requirementIssues.length ? "warning" : "ok",
      summary: requirementIssues.length
        ? `全局需求 ${globalRequirementCount} 条，发现 ${requirementIssues.length} 条需求源 / 引用问题。`
        : `全局需求源正常，共 ${globalRequirementCount} 条需求。`,
      details: requirementIssues.map((item) => ({
        severity: item.severity,
        code: item.code || "",
        message: item.message,
        sourcePath: item.sourcePath || "",
      })),
    },
    {
      id: "docs",
      label: "文档页面引用",
      status: docReferenceIssues.length ? "warning" : "ok",
      summary: docReferenceIssues.length
        ? `发现 ${docReferenceIssues.length} 条文档里的过期页面目录引用。`
        : "README 与工具文档里的页面目录引用正常。",
      details: docReferenceIssues.map((item) => ({
        severity: "warning",
        code: "documented-page-dir-missing",
        message: `文档引用了不存在的页面目录: ${item.pageDir}`,
        sourcePath: item.file,
      })),
    },
  ];

  const summary = checks.reduce((accumulator, check) => {
    accumulator.checkCount += 1;
    if (check.status === "error") {
      accumulator.errorCount += 1;
    }
    if (check.status === "warning") {
      accumulator.warningCount += 1;
    }
    return accumulator;
  }, {
    checkCount: 0,
    errorCount: 0,
    warningCount: 0,
  });

  return {
    version: 1,
    ok: summary.errorCount === 0,
    rootDir,
    summary,
    checks,
  };
}

function collectMissingDocumentedPageDirs(rootDir, relativePath) {
  const absolutePath = join(rootDir, relativePath);
  if (!existsSync(absolutePath)) {
    return [];
  }

  const source = readFileSync(absolutePath, "utf8");
  const matches = source.matchAll(/src\/pages\/([A-Za-z0-9._/-]+)\//g);
  const missing = [];
  const seen = new Set();

  for (const match of matches) {
    const pageDir = `src/pages/${match[1]}`;
    if (seen.has(pageDir)) {
      continue;
    }
    seen.add(pageDir);
    if (!existsSync(join(rootDir, pageDir))) {
      missing.push({
        file: relativePath,
        pageDir,
      });
    }
  }

  return missing;
}
