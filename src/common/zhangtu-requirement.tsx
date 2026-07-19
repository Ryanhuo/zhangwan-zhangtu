import React from "react";
import { createPortal } from "react-dom";
import { ImagePlus, Paintbrush2, Trash2, X } from "lucide-react";
import "./zhangtu-requirement.css";
import {
  applyTextReplacements as applyTextReplacementsApi,
  clearHackCss as clearHackCssApi,
  countTextReplacements as countTextReplacementsApi,
  fetchHackCss,
  getPageDirectoryFromLocation,
  saveHackCss as saveHackCssApi,
} from "./zhangtu-quick-edit-api";
const BRIDGE_READY = "zhangtu:requirements-ready";
const BRIDGE_HYDRATE = "zhangtu:requirements-hydrate";
const BRIDGE_FOCUS = "zhangtu:requirements-focus";
const BRIDGE_PANEL = "zhangtu:requirements-panel";
const BRIDGE_EDITOR_PANEL = "zhangtu:page-editor-panel";
const BRIDGE_UPDATED = "zhangtu:requirements-updated";
const BRIDGE_SELECT = "zhangtu:requirements-select";
const BRIDGE_REQUEST_OPEN = "zhangtu:requirements-request-open";
const BRIDGE_REQUEST_EDIT = "zhangtu:requirements-request-edit";
const BRIDGE_EDIT = "zhangtu:requirements-edit";
const BRIDGE_THEME = "zhangtu:requirements-theme";
const BRIDGE_VISIBILITY = "zhangtu:requirements-visibility";
const LOCAL_EVENT_OPEN = "zhangtu-requirement-open";
const EDITOR_TABS = ["layout", "color", "text", "border"] as const;
const DEFAULT_THEME_COLOR = "#1677ff";
const EDITOR_TAB_LABELS: Record<ElementEditorTab, string> = {
  layout: "布局",
  color: "颜色",
  text: "文字",
  border: "边框",
};
const NON_EDITABLE_TAGS = new Set(["html", "body", "head", "script", "style", "meta", "link", "title"]);
const INLINE_TEXT_EDITABLE_TAGS = new Set(["p", "span", "div", "label", "strong", "em", "b", "i", "a", "button", "th", "td", "h1", "h2", "h3", "h4", "h5", "h6", "li"]);
const ELEMENT_STYLE_FIELDS = [
  "width",
  "height",
  "padding",
  "margin",
  "backgroundColor",
  "color",
  "opacity",
  "fontFamily",
  "fontSize",
  "fontWeight",
  "lineHeight",
  "textAlign",
  "borderWidth",
  "borderStyle",
  "borderColor",
  "borderRadius",
] as const;
const STYLE_FIELD_TO_CSS_PROPERTY: Record<(typeof ELEMENT_STYLE_FIELDS)[number], string> = {
  width: "width",
  height: "height",
  padding: "padding",
  margin: "margin",
  backgroundColor: "background-color",
  color: "color",
  opacity: "opacity",
  fontFamily: "font-family",
  fontSize: "font-size",
  fontWeight: "font-weight",
  lineHeight: "line-height",
  textAlign: "text-align",
  borderWidth: "border-width",
  borderStyle: "border-style",
  borderColor: "border-color",
  borderRadius: "border-radius",
};

type RequirementBadgeProps = {
  id: string;
  title: string;
  anchorId: string;
};

type RequirementShellWindow = Window & typeof globalThis & {
  openRequirementByAnchor?: (anchorId: string) => void;
};

type PopupState = {
  annotationId: string;
  top: number;
  left: number;
  width: number;
  height: number;
};

type EditDraft = {
  title: string;
  body: string;
};

type RequirementBridgeMessage = {
  type: string;
  pageKey?: string;
  anchorId?: string;
  open?: boolean;
  presentation?: "popup" | "panel";
  annotations?: RequirementAnnotation[];
  color?: string;
  visible?: boolean;
};

type ElementEditorTab = (typeof EDITOR_TABS)[number];

type ElementStyleField = (typeof ELEMENT_STYLE_FIELDS)[number];

type ElementStyleValues = Partial<Record<ElementStyleField, string>>;

type ElementSelectionSnapshot = {
  tagName: string;
  selectorPath: string;
  rootSelectorPath: string;
  pageScope: string;
  originalText: string;
  originalHtml: string;
  originalInlineStyle: string;
  originalStyles: ElementStyleValues;
};

type ElementEditDraft = {
  note: string;
  images: string[];
  textContent: string;
  styles: ElementStyleValues;
  activeTab: ElementEditorTab;
};

type ElementEditRecord = {
  id: string;
  tagName: string;
  selectorPath: string;
  rootSelectorPath: string;
  pageScope: string;
  originalText: string;
  currentText: string;
  originalHtml: string;
  note: string;
  images: string[];
  originalInlineStyle: string;
  originalStyles: ElementStyleValues;
  styles: ElementStyleValues;
  updatedAt: string;
};

type ElementRect = {
  top: number;
  left: number;
  width: number;
  height: number;
};

type FloatingPosition = {
  top: number;
  left: number;
};

export type RequirementAnnotation = {
  id: string;
  order?: number;
  title: string;
  anchorId: string;
  activatePath?: string[];
  bodyMarkdown?: string;
  category?: string;
  color?: string;
  ref?: string;
};

type AnnotationLayerProps = {
  annotations: RequirementAnnotation[];
  pageKey: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isRichTextHtml(value: string) {
  return /<([a-z][^/\s>]*)[\s>]/i.test(String(value || ""));
}

function inlineMarkdown(value: string) {
  return escapeHtml(value)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>");
}

function markdownToHtml(markdown: string) {
  if (isRichTextHtml(markdown)) {
    return String(markdown || "");
  }

  const lines = String(markdown || "").replace(/\r\n/g, "\n").split("\n");
  let html = "";
  let inList = false;

  const flushList = () => {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      flushList();
      html += "<hr />";
      continue;
    }

    if (/^#{1,6}\s+/.test(trimmed)) {
      flushList();
      const level = Math.min((trimmed.match(/^#+/)?.[0].length ?? 1) + 1, 6);
      html += `<h${level}>${inlineMarkdown(trimmed.replace(/^#{1,6}\s+/, ""))}</h${level}>`;
      continue;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${inlineMarkdown(trimmed.replace(/^[-*]\s+/, ""))}</li>`;
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      flushList();
      html += `<blockquote>${inlineMarkdown(trimmed.replace(/^>\s?/, ""))}</blockquote>`;
      continue;
    }

    flushList();
    html += `<p>${inlineMarkdown(trimmed)}</p>`;
  }

  flushList();
  return html;
}

function toPlainText(markdown: string) {
  if (isRichTextHtml(markdown)) {
    const container = document.createElement("div");
    container.innerHTML = String(markdown || "");
    return (container.textContent || container.innerText || "").replace(/\s+/g, " ").trim();
  }

  return String(markdown || "")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^[-*]\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\n+/g, " ")
    .trim();
}

function normalizeRichTextHtml(value: string) {
  const content = String(value || "").trim();
  if (!content) {
    return "";
  }
  return content
    .replace(/<div><br><\/div>/gi, "")
    .replace(/<p><br><\/p>/gi, "")
    .trim();
}

function toEditorRichText(value: string) {
  return isRichTextHtml(value) ? String(value || "") : markdownToHtml(value);
}

function normalizeAnnotations(annotations: RequirementAnnotation[]) {
  return [...(annotations || [])]
    .map((item, index) => ({
      id: String(item?.id || index + 1),
      order: Number.isFinite(Number(item?.order)) ? Number(item.order) : index + 1,
      title: String(item?.title || `需求 ${index + 1}`).trim(),
      anchorId: String(item?.anchorId || item?.id || `req-${index + 1}`),
      activatePath: Array.isArray(item?.activatePath) ? item.activatePath : undefined,
      bodyMarkdown: String(item?.bodyMarkdown || ""),
      category: typeof item?.category === "string" ? item.category.trim() : "",
      color: typeof item?.color === "string" ? item.color.trim() : "",
      ref: typeof item?.ref === "string" ? item.ref.trim() : "",
    }))
    .sort((a, b) => a.order - b.order);
}

function getDraftStorageKey(pageKey: string) {
  return `zhangtu:annotation-draft:${pageKey}`;
}

function getElementEditStorageKey(pageKey: string) {
  return `zhangtu:annotation-element-edits:${pageKey}`;
}

function getThemeStorageKey(pageKey: string) {
  return `zhangtu:annotation-theme:${pageKey}`;
}

function getMarkerVisibilityStorageKey(pageKey: string) {
  return `zhangtu:annotation-markers-visible:${pageKey}`;
}

function normalizeCssValue(value: string | undefined) {
  return String(value || "").trim();
}

function splitCssUnit(value: string | undefined) {
  const normalized = normalizeCssValue(value);
  if (!normalized) {
    return { amount: "", unit: "px" };
  }
  if (normalized === "auto") {
    return { amount: "", unit: "auto" };
  }
  const matched = normalized.match(/^(-?\d*\.?\d+)(px|%|rem|em)?$/i);
  if (!matched) {
    return { amount: normalized, unit: "px" };
  }
  return {
    amount: matched[1] || "",
    unit: (matched[2] || "px").toLowerCase(),
  };
}

function composeCssUnit(amount: string, unit: string) {
  const normalizedAmount = String(amount || "").trim();
  if (unit === "auto") {
    return "auto";
  }
  if (!normalizedAmount) {
    return "";
  }
  return `${normalizedAmount}${unit || "px"}`;
}

function splitSpacingValue(value: string | undefined) {
  const normalized = normalizeCssValue(value);
  if (!normalized) {
    return { horizontal: "", vertical: "", unit: "px" };
  }
  const parts = normalized.split(/\s+/);
  const first = splitCssUnit(parts[0]);
  const second = splitCssUnit(parts[1] || parts[0]);
  return {
    horizontal: second.amount,
    vertical: first.amount,
    unit: second.unit || first.unit || "px",
  };
}

function composeSpacingValue(horizontal: string, vertical: string, unit: string) {
  const horizontalValue = composeCssUnit(horizontal, unit);
  const verticalValue = composeCssUnit(vertical, unit);
  if (!horizontalValue && !verticalValue) {
    return "";
  }
  if (!horizontalValue) {
    return verticalValue;
  }
  if (!verticalValue) {
    return horizontalValue;
  }
  return horizontalValue === verticalValue ? horizontalValue : `${verticalValue} ${horizontalValue}`;
}

function createStyleValues(overrides?: Partial<ElementStyleValues>): ElementStyleValues {
  return {
    width: "",
    height: "",
    padding: "",
    margin: "",
    backgroundColor: "",
    color: "",
    opacity: "",
    fontFamily: "",
    fontSize: "",
    fontWeight: "",
    lineHeight: "",
    textAlign: "",
    borderWidth: "",
    borderStyle: "",
    borderColor: "",
    borderRadius: "",
    ...overrides,
  };
}

function readElementStyles(target: HTMLElement): ElementStyleValues {
  const computed = window.getComputedStyle(target);
  return createStyleValues({
    width: computed.width,
    height: computed.height,
    padding: computed.padding,
    margin: computed.margin,
    backgroundColor: computed.backgroundColor,
    color: computed.color,
    opacity: computed.opacity,
    fontFamily: computed.fontFamily,
    fontSize: computed.fontSize,
    fontWeight: computed.fontWeight,
    lineHeight: computed.lineHeight,
    textAlign: computed.textAlign,
    borderWidth: computed.borderWidth,
    borderStyle: computed.borderStyle,
    borderColor: computed.borderColor,
    borderRadius: computed.borderRadius,
  });
}

function getPopupPosition(anchorId: string) {
  const anchor = document.querySelector<HTMLElement>(`[data-zhangtu-requirement-anchor="${CSS.escape(anchorId)}"]`);
  const marker = document.querySelector<HTMLElement>(
    `[data-zhangtu-requirement-marker="true"][data-zhangtu-requirement-anchor="${CSS.escape(anchorId)}"]`,
  );
  const target = anchor || marker;

  if (!target) {
    return { top: 120, left: Math.max(24, window.innerWidth - 388), width: 320, height: 240 };
  }

  const rect = target.getBoundingClientRect();
  const popupWidth = 320;
  const popupHeight = 240;
  const maxLeft = Math.max(24, window.innerWidth - popupWidth - 24);
  const maxTop = Math.max(24, window.innerHeight - popupHeight - 24);
  const preferredLeft = rect.left + Math.min(32, Math.max(12, rect.width * 0.18));
  const preferredTop = rect.top + Math.min(32, Math.max(12, rect.height * 0.18));

  return {
    top: Math.min(maxTop, Math.max(24, preferredTop)),
    left: Math.min(maxLeft, Math.max(24, preferredLeft)),
    width: 320,
    height: 240,
  };
}

function getThemeForeground(color: string) {
  const normalized = color.trim().replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) {
    return "#ffffff";
  }

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const luminance = (red * 299 + green * 587 + blue * 114) / 1000;
  return luminance >= 164 ? "#0f172a" : "#ffffff";
}

function getElementEditorPosition(rect: ElementRect | null) {
  if (!rect) {
    return { top: 88, left: 24 };
  }

  const editorWidth = Math.min(320, Math.max(292, window.innerWidth * 0.24));
  const preferredLeft = rect.left - editorWidth - 24;
  const fallbackLeft = rect.left + rect.width + 18;
  const maxLeft = Math.max(24, window.innerWidth - editorWidth - 24);

  return {
    top: Math.min(Math.max(24, rect.top - 22), Math.max(24, window.innerHeight - 680)),
    left: preferredLeft >= 24 ? preferredLeft : Math.min(maxLeft, fallbackLeft),
  };
}

function clampFloatingPosition(position: FloatingPosition, width: number, height: number) {
  const maxLeft = Math.max(12, window.innerWidth - width - 12);
  const maxTop = Math.max(12, window.innerHeight - height - 12);

  return {
    top: Math.min(Math.max(12, position.top), maxTop),
    left: Math.min(Math.max(12, position.left), maxLeft),
  };
}

function getElementText(target: HTMLElement) {
  return String(target.innerText || target.textContent || "")
    .replace(/\s+/g, " ")
    .trim();
}

function getElementRect(target: HTMLElement): ElementRect | null {
  const rect = target.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) {
    return null;
  }
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

function getSelectorSegment(target: Element) {
  const tagName = target.tagName.toLowerCase();
  if ((target as HTMLElement).id) {
    return `#${CSS.escape((target as HTMLElement).id)}`;
  }

  let index = 1;
  let sibling = target.previousElementSibling;
  while (sibling) {
    if (sibling.tagName.toLowerCase() === tagName) {
      index += 1;
    }
    sibling = sibling.previousElementSibling;
  }
  return `${tagName}:nth-of-type(${index})`;
}

function buildSelectorPath(target: HTMLElement, stopAt?: HTMLElement | null) {
  const parts: string[] = [];
  let current: HTMLElement | null = target;

  while (current) {
    parts.unshift(getSelectorSegment(current));
    if (current === stopAt || current.tagName.toLowerCase() === "body") {
      break;
    }
    current = current.parentElement;
  }

  return parts.join(" > ");
}

function getPageScope(pageKey: string) {
  const path = window.location.pathname.replace(/^\/+/, "") || "index";
  const hashPage = window.location.hash.match(/page=([^&]+)/)?.[1];
  return hashPage ? `${path}::page::${decodeURIComponent(hashPage)}` : `${path}::page::${pageKey}`;
}

function captureElementSnapshot(target: HTMLElement, pageKey: string): ElementSelectionSnapshot {
  const root = document.getElementById("root");
  return {
    tagName: target.tagName.toLowerCase(),
    selectorPath: buildSelectorPath(target, document.body),
    rootSelectorPath: root && root.contains(target) ? buildSelectorPath(target, root) : "",
    pageScope: getPageScope(pageKey),
    originalText: getElementText(target),
    originalHtml: target.innerHTML,
    originalInlineStyle: target.getAttribute("style") || "",
    originalStyles: readElementStyles(target),
  };
}

function resolveElementFromSelectors(record: Pick<ElementEditRecord, "selectorPath" | "rootSelectorPath">) {
  const candidates = [record.rootSelectorPath, record.selectorPath].filter(Boolean);
  for (const selector of candidates) {
    const target = document.querySelector<HTMLElement>(selector);
    if (target) {
      return target;
    }
  }
  return null;
}

function resetElementToSnapshot(target: HTMLElement, snapshot: ElementSelectionSnapshot) {
  if (snapshot.originalInlineStyle) {
    target.setAttribute("style", snapshot.originalInlineStyle);
  } else {
    target.removeAttribute("style");
  }
  target.innerHTML = snapshot.originalHtml;
}

function canInlineEditText(target: HTMLElement, snapshot: ElementSelectionSnapshot) {
  if (!snapshot.originalText.trim()) {
    return false;
  }
  if (!INLINE_TEXT_EDITABLE_TAGS.has(target.tagName.toLowerCase())) {
    return false;
  }
  if (target.children.length > 0) {
    return false;
  }
  return true;
}

function focusEditableTarget(target: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) {
    return;
  }
  const range = document.createRange();
  range.selectNodeContents(target);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
  target.focus();
}

function enableInlineTextEditing(target: HTMLElement) {
  target.setAttribute("contenteditable", "plaintext-only");
  target.setAttribute("spellcheck", "false");
  target.classList.add("zt-element-inline-editable");
  requestAnimationFrame(() => focusEditableTarget(target));
}

function disableInlineTextEditing(target: HTMLElement) {
  target.removeAttribute("contenteditable");
  target.removeAttribute("spellcheck");
  target.classList.remove("zt-element-inline-editable");
}

function applyStylesLive(target: HTMLElement, originalStyles: ElementStyleValues, nextStyles: ElementStyleValues) {
  for (const field of ELEMENT_STYLE_FIELDS) {
    const cssProperty = STYLE_FIELD_TO_CSS_PROPERTY[field];
    const nextValue = normalizeCssValue(nextStyles[field]);
    const originalValue = normalizeCssValue(originalStyles[field]);
    if (!nextValue || nextValue === originalValue) {
      target.style.removeProperty(cssProperty);
    } else {
      target.style.setProperty(cssProperty, nextValue);
    }
  }
}

function applySavedEdit(target: HTMLElement, record: ElementEditRecord) {
  if (record.currentText !== record.originalText) {
    target.textContent = record.currentText;
  }
  applyStylesLive(target, record.originalStyles, record.styles);
}

function createElementDraft(snapshot: ElementSelectionSnapshot): ElementEditDraft {
  return {
    note: "",
    images: [],
    textContent: snapshot.originalText,
    styles: createStyleValues(snapshot.originalStyles),
    activeTab: "layout",
  };
}

function normalizeElementEditRecord(input: Partial<ElementEditRecord>, index: number): ElementEditRecord {
  return {
    id: String(input.id || `element-edit-${index + 1}`),
    tagName: String(input.tagName || "div").toLowerCase(),
    selectorPath: String(input.selectorPath || ""),
    rootSelectorPath: String(input.rootSelectorPath || ""),
    pageScope: String(input.pageScope || ""),
    originalText: String(input.originalText || ""),
    currentText: String(input.currentText || input.originalText || ""),
    originalHtml: String(input.originalHtml || escapeHtml(String(input.originalText || ""))),
    note: String(input.note || ""),
    images: Array.isArray(input.images) ? input.images.filter(Boolean).map(String) : [],
    originalInlineStyle: String(input.originalInlineStyle || ""),
    originalStyles: createStyleValues(input.originalStyles),
    styles: createStyleValues(input.styles),
    updatedAt: String(input.updatedAt || new Date().toISOString()),
  };
}

function loadElementEdits(pageKey: string) {
  const stored = window.localStorage.getItem(getElementEditStorageKey(pageKey));
  if (!stored) {
    return [] as ElementEditRecord[];
  }

  try {
    const parsed = JSON.parse(stored) as Partial<ElementEditRecord>[];
    return Array.isArray(parsed) ? parsed.map(normalizeElementEditRecord) : [];
  } catch {
    return [];
  }
}

function diffStyleFields(originalStyles: ElementStyleValues, nextStyles: ElementStyleValues) {
  return ELEMENT_STYLE_FIELDS.filter((field) => {
    const next = normalizeCssValue(nextStyles[field] ?? "");
    if (!next) return false;
    return normalizeCssValue(originalStyles[field] ?? "") !== next;
  });
}

function groupTextReplacements(records: ElementEditRecord[]) {
  const afterByBefore = new Map<string, Set<string>>();
  for (const record of records) {
    if (!afterByBefore.has(record.originalText)) {
      afterByBefore.set(record.originalText, new Set());
    }
    afterByBefore.get(record.originalText)!.add(record.currentText);
  }

  const groups: { before: string; after: string }[] = [];
  const conflicts: { before: string; afterValues: string[] }[] = [];
  for (const [before, afterSet] of afterByBefore) {
    if (afterSet.size > 1) {
      conflicts.push({ before, afterValues: Array.from(afterSet) });
    } else {
      groups.push({ before, after: Array.from(afterSet)[0] });
    }
  }
  return { groups, conflicts };
}

function buildHackCssRule(record: ElementEditRecord) {
  const selector = record.rootSelectorPath || record.selectorPath;
  const fields = diffStyleFields(record.originalStyles, record.styles);
  if (!selector || !fields.length) {
    return "";
  }
  const declarations = fields
    .map((field) => `  ${STYLE_FIELD_TO_CSS_PROPERTY[field]}: ${record.styles[field]};`)
    .join("\n");
  return `${selector} {\n${declarations}\n}`;
}

function hasMeaningfulEdit(snapshot: ElementSelectionSnapshot, draft: ElementEditDraft) {
  if (draft.note.trim()) return true;
  if (draft.images.length) return true;
  if (draft.textContent !== snapshot.originalText) return true;
  return diffStyleFields(snapshot.originalStyles, draft.styles).some((field) => normalizeCssValue(draft.styles[field]) !== normalizeCssValue(snapshot.originalStyles[field]));
}

function findEditableTarget(target: EventTarget | null) {
  let current = target instanceof HTMLElement ? target : null;
  while (current) {
    if (current.closest(".zt-annotation-layer")) {
      return null;
    }

    const tagName = current.tagName.toLowerCase();
    const rect = current.getBoundingClientRect();
    const style = window.getComputedStyle(current);
    if (
      !NON_EDITABLE_TAGS.has(tagName)
      && rect.width >= 12
      && rect.height >= 12
      && style.display !== "contents"
      && style.visibility !== "hidden"
    ) {
      return current;
    }

    current = current.parentElement;
  }
  return null;
}

function matchesSnapshot(record: ElementEditRecord, snapshot: ElementSelectionSnapshot) {
  return record.selectorPath === snapshot.selectorPath || (record.rootSelectorPath && record.rootSelectorPath === snapshot.rootSelectorPath);
}

function buildElementEditRecord(id: string, snapshot: ElementSelectionSnapshot, draft: ElementEditDraft): ElementEditRecord {
  return {
    id,
    tagName: snapshot.tagName,
    selectorPath: snapshot.selectorPath,
    rootSelectorPath: snapshot.rootSelectorPath,
    pageScope: snapshot.pageScope,
    originalText: snapshot.originalText,
    currentText: draft.textContent,
    originalHtml: snapshot.originalHtml,
    note: draft.note.trim(),
    images: [...draft.images],
    originalInlineStyle: snapshot.originalInlineStyle,
    originalStyles: createStyleValues(snapshot.originalStyles),
    styles: createStyleValues(draft.styles),
    updatedAt: new Date().toISOString(),
  };
}

function formatPromptText(value: string | undefined) {
  const normalized = String(value || "").replace(/\s+/g, " ").trim();
  return normalized || "(空)";
}

function buildPrompt(recordPageUrl: string, edits: ElementEditRecord[]) {
  const lines = [
    "请根据以下页面编辑说明，在代码中实现对应改动。",
    "",
    "任务上下文:",
    `- 页面地址: ${recordPageUrl}`,
    "",
    "约束: 元素描述仅用于定位，只改动明确指出的内容，其余保持不动。",
    "",
    "修改列表:",
  ];

  edits.forEach((record, index) => {
    lines.push(`- 修改项 ${index + 1}`);
    lines.push(`  - 当前元素标签: ${record.tagName}`);
    lines.push(`  - 当前元素文本: ${formatPromptText(record.currentText)}`);
    lines.push(
      `  - 元素定位: ${record.selectorPath}${record.rootSelectorPath ? ` | ${record.rootSelectorPath}` : ""}`,
    );
    lines.push(`  - 页面范围: ${record.pageScope}`);

    if (record.currentText !== record.originalText) {
      lines.push(`  → 文本内容 "${formatPromptText(record.originalText)}" -> "${formatPromptText(record.currentText)}"`);
    }

    for (const field of diffStyleFields(record.originalStyles, record.styles)) {
      lines.push(
        `  → 样式 ${field}: "${formatPromptText(record.originalStyles[field] ?? "")}" -> "${formatPromptText(record.styles[field] ?? "")}"`,
      );
    }

    if (record.note.trim()) {
      lines.push(`  → 需求说明: ${record.note.replace(/\s+/g, " ").trim()}`);
    }

    if (record.images.length) {
      lines.push(`  → 附图参考: 已粘贴 ${record.images.length} 张图片，请结合页面标注中的图片理解改动`);
    }
  });

  lines.push("");
  lines.push("输出要求:");
  lines.push("- 用简单易懂的话说明修改了什么。");
  lines.push("- 如果无法定位文件，请说明缺失了哪些关键信息。");
  return lines.join("\n");
}

async function readFileAsDataUrl(file: File) {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const input = document.createElement("textarea");
  input.value = value;
  input.setAttribute("readonly", "true");
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
}

export function RequirementBadge({ id, title, anchorId }: RequirementBadgeProps) {
  const handleClick = () => {
    const target = document.querySelector<HTMLElement>(`[data-zhangtu-requirement-anchor="${anchorId}"]`);
    target?.scrollIntoView({ block: "center", behavior: "smooth" });
    window.dispatchEvent(new CustomEvent(LOCAL_EVENT_OPEN, { detail: { anchorId, presentation: "popup" } }));
  };

  return (
    <div className="requirement-anchor" data-zhangtu-requirement-anchor={anchorId}>
      <button
        type="button"
        className="requirement-badge"
        aria-label={`需求 ${id}：${title}`}
        title={`需求 ${id}：${title}`}
        onClick={handleClick}
        data-zhangtu-requirement-marker="true"
        data-zhangtu-requirement-id={id}
        data-zhangtu-requirement-anchor={anchorId}
        data-zhangtu-requirement-title={title}
      >
        {id}
      </button>
    </div>
  );
}

// 标注/编辑图层的活跃实例计数。自动挂载器（zhangtu-annotation-autoload）据此判重：
// 页面若在自己的 JSX 里显式挂了 <AnnotationLayerPortal>（通常因为有页面备注），计数 > 0，
// 自动挂载器就跳过，避免同一页出现两套图层。
let activeAnnotationLayerCount = 0;

function markAnnotationLayerMounted() {
  activeAnnotationLayerCount += 1;
}

function releaseAnnotationLayerMounted() {
  activeAnnotationLayerCount = Math.max(0, activeAnnotationLayerCount - 1);
}

export function hasActiveAnnotationLayer() {
  return activeAnnotationLayerCount > 0;
}

export function AnnotationLayerPortal({ annotations, pageKey }: AnnotationLayerProps) {
  const isEmbedded = React.useMemo(() => window.parent !== window, []);
  const pageDirectory = React.useMemo(() => getPageDirectoryFromLocation(), []);
  // 用 layout effect 在首帧绘制前登记本实例，保证自动挂载器在其 rAF 判重时能看到。
  React.useLayoutEffect(() => {
    markAnnotationLayerMounted();
    return () => releaseAnnotationLayerMounted();
  }, []);
  const [hackCssContent, setHackCssContent] = React.useState("");
  const [items, setItems] = React.useState<RequirementAnnotation[]>(() => {
    const storage = window.localStorage.getItem(getDraftStorageKey(pageKey));
    if (!storage) {
      return normalizeAnnotations(annotations);
    }

    try {
      const parsed = JSON.parse(storage) as RequirementAnnotation[];
      return normalizeAnnotations(parsed);
    } catch {
      return normalizeAnnotations(annotations);
    }
  });
  const [panelOpen, setPanelOpen] = React.useState(false);
  const [editorPanelOpen, setEditorPanelOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [popup, setPopup] = React.useState<PopupState | null>(null);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [draft, setDraft] = React.useState<EditDraft>({
    title: "",
    body: "",
  });
  const [themeColor, setThemeColor] = React.useState(() => window.localStorage.getItem(getThemeStorageKey(pageKey)) || DEFAULT_THEME_COLOR);
  const [markersVisible, setMarkersVisible] = React.useState(() => {
    const stored = window.localStorage.getItem(getMarkerVisibilityStorageKey(pageKey));
    return stored == null ? true : stored !== "false";
  });
  const [elementEdits, setElementEdits] = React.useState<ElementEditRecord[]>(() => loadElementEdits(pageKey));
  const [elementEditMode, setElementEditMode] = React.useState(false);
  const [elementEditorOpen, setElementEditorOpen] = React.useState(false);
  const [elementDraft, setElementDraft] = React.useState<ElementEditDraft>(() =>
    createElementDraft(captureElementSnapshot(document.body, pageKey)),
  );
  const [elementEditingId, setElementEditingId] = React.useState<string | null>(null);
  const [activeElementEditId, setActiveElementEditId] = React.useState<string | null>(null);
  const [hoverRect, setHoverRect] = React.useState<ElementRect | null>(null);
  const [selectedRect, setSelectedRect] = React.useState<ElementRect | null>(null);
  const [selectionSummary, setSelectionSummary] = React.useState<ElementSelectionSnapshot | null>(null);
  const [notice, setNotice] = React.useState("");
  const [editorPosition, setEditorPosition] = React.useState<{ top: number; left: number }>({ top: 88, left: 24 });
  const [editorFrame, setEditorFrame] = React.useState({ width: 460, height: 0 });
  const [editorPositionPinned, setEditorPositionPinned] = React.useState(false);
  const [editorDragging, setEditorDragging] = React.useState(false);
  const [dockExpanded, setDockExpanded] = React.useState(false);
  const [styleEditorOpen, setStyleEditorOpen] = React.useState(false);
  const [inlineTextEditing, setInlineTextEditing] = React.useState(false);
  const selectionTargetRef = React.useRef<HTMLElement | null>(null);
  const selectionSnapshotRef = React.useRef<ElementSelectionSnapshot | null>(null);
  const editorBodyRef = React.useRef<HTMLDivElement | null>(null);
  const elementEditorRef = React.useRef<HTMLElement | null>(null);
  const popupDragOffsetRef = React.useRef<{ x: number; y: number } | null>(null);
  const popupResizeRef = React.useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const saveCurrentElementRef = React.useRef<((options?: { silentNoop?: boolean }) => boolean) | null>(null);

  const applyAnnotations = React.useCallback((nextAnnotations: RequirementAnnotation[], shouldBroadcast: boolean) => {
    const normalized = normalizeAnnotations(nextAnnotations);
    setItems(normalized);
    window.localStorage.setItem(getDraftStorageKey(pageKey), JSON.stringify(normalized));

    if (shouldBroadcast && window.parent !== window) {
      window.parent.postMessage(
        {
          type: BRIDGE_UPDATED,
          pageKey,
          annotations: normalized,
        } satisfies RequirementBridgeMessage,
        "*",
      );
    }
  }, [pageKey]);

  const syncSelectionRect = React.useCallback(() => {
    const target = selectionTargetRef.current;
    if (!target) {
      setSelectedRect(null);
      return;
    }
    setSelectedRect(getElementRect(target));
  }, []);

  const openElementEditorForTarget = React.useCallback((target: HTMLElement, positionOverride?: FloatingPosition) => {
    const snapshot = captureElementSnapshot(target, pageKey);
    const existing = elementEdits.find((record) => matchesSnapshot(record, snapshot));

    selectionTargetRef.current = target;
    selectionSnapshotRef.current = existing
      ? {
          tagName: existing.tagName,
          selectorPath: existing.selectorPath,
          rootSelectorPath: existing.rootSelectorPath,
          pageScope: existing.pageScope,
          originalText: existing.originalText,
          originalHtml: existing.originalHtml,
          originalInlineStyle: existing.originalInlineStyle,
          originalStyles: createStyleValues(existing.originalStyles),
        }
      : snapshot;

    setSelectionSummary(selectionSnapshotRef.current);
    const rect = getElementRect(target);
    setSelectedRect(rect);
    setEditorPosition(positionOverride ?? getElementEditorPosition(rect));
    setEditorPositionPinned(positionOverride != null);
    setPanelOpen(false);
    setEditorPanelOpen(true);
    setElementEditMode(true);
    setElementEditorOpen(true);
    const nextInlineTextEditing = canInlineEditText(target, selectionSnapshotRef.current);
    setInlineTextEditing(nextInlineTextEditing);

    if (existing) {
      const hasStyleEdits = diffStyleFields(existing.originalStyles, existing.styles).length > 0;
      setStyleEditorOpen(hasStyleEdits);
      setElementEditingId(existing.id);
      setActiveElementEditId(existing.id);
      setElementDraft({
        note: existing.note,
        images: [...existing.images],
        textContent: existing.currentText,
        // Keep only the saved style overrides; unset fields stay blank.
        styles: createStyleValues(existing.styles),
        activeTab: hasStyleEdits ? "layout" : "layout",
      });
      applySavedEdit(target, existing);
      if (nextInlineTextEditing) {
        target.textContent = existing.currentText;
        enableInlineTextEditing(target);
      }
      return;
    }

    setStyleEditorOpen(false);
    setElementEditingId(null);
    setActiveElementEditId(null);
    setElementDraft(createElementDraft(snapshot));
    if (nextInlineTextEditing) {
      enableInlineTextEditing(target);
    }
  }, [elementEdits, pageKey]);

  const updateElementDraft = React.useCallback((updater: (current: ElementEditDraft) => ElementEditDraft) => {
    setElementDraft((current) => {
      const next = updater(current);
      const target = selectionTargetRef.current;
      const snapshot = selectionSnapshotRef.current;
      if (target && snapshot) {
        applyStylesLive(target, snapshot.originalStyles, next.styles);
      }
      if (target && inlineTextEditing) {
        const liveText = getElementText(target);
        requestAnimationFrame(() => {
          const rect = getElementRect(target);
          setSelectedRect(rect);
          if (!editorPositionPinned) {
            setEditorPosition(getElementEditorPosition(rect));
          }
        });
        return { ...next, textContent: liveText };
      }
      return next;
    });
  }, [editorPositionPinned, inlineTextEditing]);

  React.useEffect(() => {
    if (!items.length) {
      setActiveId(null);
      return;
    }
    setActiveId((current) => {
      if (current && items.some((item) => item.id === current)) {
        return current;
      }
      return items[0]?.id ?? null;
    });
  }, [items]);

  React.useEffect(() => {
    window.localStorage.setItem(getElementEditStorageKey(pageKey), JSON.stringify(elementEdits));
    elementEdits.forEach((record) => {
      const target = resolveElementFromSelectors(record);
      if (target) {
        applySavedEdit(target, record);
      }
    });
  }, [elementEdits, pageKey]);

  React.useEffect(() => {
    if (!notice) {
      return undefined;
    }
    const timer = window.setTimeout(() => setNotice(""), 2600);
    return () => window.clearTimeout(timer);
  }, [notice]);

  React.useEffect(() => {
    if (!pageDirectory) {
      return undefined;
    }
    let cancelled = false;
    fetchHackCss(pageDirectory).then(({ ok, data }) => {
      if (!cancelled && ok && data.success) {
        setHackCssContent(data.content || "");
      }
    });
    return () => {
      cancelled = true;
    };
  }, [pageDirectory]);

  React.useEffect(() => {
    const existing = document.getElementById("zt-hack-css") as HTMLStyleElement | null;
    if (!hackCssContent) {
      existing?.remove();
      return;
    }
    const styleEl = existing || document.createElement("style");
    styleEl.id = "zt-hack-css";
    styleEl.textContent = hackCssContent;
    if (!styleEl.parentNode) {
      document.head.appendChild(styleEl);
    }
  }, [hackCssContent]);

  React.useEffect(() => {
    window.localStorage.setItem(getThemeStorageKey(pageKey), themeColor);
    document.documentElement.style.setProperty("--zt-annotation-theme", themeColor);
    document.documentElement.style.setProperty("--zt-annotation-theme-fg", getThemeForeground(themeColor));
    return () => {
      document.documentElement.style.removeProperty("--zt-annotation-theme");
      document.documentElement.style.removeProperty("--zt-annotation-theme-fg");
    };
  }, [pageKey, themeColor]);

  React.useEffect(() => {
    window.localStorage.setItem(getMarkerVisibilityStorageKey(pageKey), String(markersVisible));
    document.body.classList.toggle("zt-annotation-hide-markers", !markersVisible);
    return () => {
      document.body.classList.remove("zt-annotation-hide-markers");
    };
  }, [markersVisible, pageKey]);

  const openRequirementEditor = React.useCallback((item: RequirementAnnotation) => {
    setEditingId(item.id);
    setDraft({
      title: item.title,
      body: item.bodyMarkdown || "",
    });
  }, []);

  React.useEffect(() => {
    if (!editingId || !editorBodyRef.current) {
      return;
    }
    editorBodyRef.current.innerHTML = draft.body || "";
  }, [draft.body, editingId]);

  const execRichTextCommand = React.useCallback((command: string, value?: string) => {
    editorBodyRef.current?.focus();
    document.execCommand(command, false, value);
    const html = normalizeRichTextHtml(editorBodyRef.current?.innerHTML || "");
    setDraft((current) => ({
      ...current,
      body: html,
    }));
  }, []);

  const openByAnchor = React.useCallback((anchorId: string, options?: { openPanel?: boolean; openPopup?: boolean }) => {
    const matched = items.find((item) => item.anchorId === anchorId || item.id === anchorId);
    if (!matched) {
      return;
    }

    const target = document.querySelector<HTMLElement>(`[data-zhangtu-requirement-anchor="${matched.anchorId}"]`);
    target?.scrollIntoView({ behavior: "smooth", block: "center" });

    setActiveId(matched.id);
    if (window.parent !== window) {
      window.parent.postMessage(
        {
          type: BRIDGE_SELECT,
          pageKey,
          anchorId: matched.anchorId,
        } satisfies RequirementBridgeMessage,
        "*",
      );
    }
    if (typeof options?.openPanel === "boolean") {
      setPanelOpen(options.openPanel);
    }
    setEditorPanelOpen(false);
    if (options?.openPopup) {
      const position = getPopupPosition(matched.anchorId);
      setPopup({
        annotationId: matched.id,
        top: position.top,
        left: position.left,
        width: position.width,
        height: position.height,
      });
      return;
    }
    setPopup(null);
  }, [items]);

  const openByAnchorRef = React.useRef(openByAnchor);
  React.useEffect(() => { openByAnchorRef.current = openByAnchor; }, [openByAnchor]);

  const openRequirementEditorRef = React.useRef(openRequirementEditor);
  React.useEffect(() => { openRequirementEditorRef.current = openRequirementEditor; }, [openRequirementEditor]);

  const itemsRef = React.useRef(items);
  React.useEffect(() => { itemsRef.current = items; }, [items]);

  const bridgeReadySentRef = React.useRef(false);

  React.useEffect(() => {
    const onMessage = (event: MessageEvent<RequirementBridgeMessage>) => {
      if (!event.data) return;
      if (event.data.pageKey && event.data.pageKey !== pageKey) return;

      if (event.data.type === BRIDGE_HYDRATE && Array.isArray(event.data.annotations)) {
        applyAnnotations(event.data.annotations, false);
        return;
      }

      if (event.data.type === BRIDGE_PANEL) {
        setPanelOpen(Boolean(event.data.open));
        if (!event.data.open) setPopup(null);
        return;
      }

      if (event.data.type === BRIDGE_EDITOR_PANEL) {
        const nextOpen = Boolean(event.data.open);
        setEditorPanelOpen(nextOpen);
        setElementEditMode(nextOpen);
        if (!nextOpen) {
          setElementEditorOpen(false);
          setDockExpanded(false);
          setHoverRect(null);
        }
        return;
      }

      if (event.data.type === BRIDGE_THEME && typeof event.data.color === "string") {
        setThemeColor(event.data.color);
        return;
      }

      if (event.data.type === BRIDGE_VISIBILITY && typeof event.data.visible === "boolean") {
        setMarkersVisible(event.data.visible);
        return;
      }

      if (event.data.type === BRIDGE_EDIT && event.data.anchorId) {
        const matched = itemsRef.current.find((item) => item.anchorId === event.data.anchorId || item.id === event.data.anchorId);
        if (matched) {
          setActiveId(matched.id);
          setPopup(null);
          openRequirementEditorRef.current(matched);
        }
        return;
      }

      if (event.data.type === BRIDGE_FOCUS && event.data.anchorId) {
        openByAnchorRef.current(event.data.anchorId, {
          openPanel: event.data.presentation === "panel",
          openPopup: event.data.presentation === "popup",
        });
      }
    };

    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ anchorId?: string; presentation?: "popup" | "panel" }>).detail;
      const anchorId = detail?.anchorId;
      if (anchorId) {
        openByAnchorRef.current(anchorId, {
          openPopup: detail?.presentation === "popup",
          openPanel: detail?.presentation === "panel" ? true : undefined,
        });
      }
    };

    window.addEventListener("message", onMessage);
    window.addEventListener(LOCAL_EVENT_OPEN, onOpen);

    if (!bridgeReadySentRef.current && window.parent !== window) {
      bridgeReadySentRef.current = true;
      window.parent.postMessage({ type: BRIDGE_READY, pageKey } satisfies RequirementBridgeMessage, "*");
    }

    return () => {
      window.removeEventListener("message", onMessage);
      window.removeEventListener(LOCAL_EVENT_OPEN, onOpen);
    };
  }, [applyAnnotations, pageKey]);

  React.useEffect(() => {
    if (elementEditMode) {
      return undefined;
    }

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (!target || target.closest(".zt-annotation-layer")) {
        return;
      }
      const anchorHost = target.closest<HTMLElement>("[data-zhangtu-requirement-anchor]");
      if (!anchorHost) {
        return;
      }
      const anchorId = anchorHost.getAttribute("data-zhangtu-requirement-anchor");
      if (!anchorId) {
        return;
      }
      openByAnchorRef.current(anchorId, { openPopup: true, openPanel: false });
    };

    document.addEventListener("click", handleAnchorClick, true);
    return () => {
      document.removeEventListener("click", handleAnchorClick, true);
    };
  }, [elementEditMode]);

  React.useEffect(() => {
    const win = window as RequirementShellWindow;
    win.openRequirementByAnchor = (anchorId: string) => {
      openByAnchor(anchorId);
    };

    return () => {
      if (win.openRequirementByAnchor) {
        delete win.openRequirementByAnchor;
      }
    };
  }, [openByAnchor]);

  React.useEffect(() => {
    const active = items.find((item) => item.id === activeId);
    const activeAnchor = active?.anchorId ?? "";

    document.querySelectorAll<HTMLElement>("[data-zhangtu-requirement-marker='true']").forEach((node) => {
      const nodeAnchor = node.getAttribute("data-zhangtu-requirement-anchor");
      node.classList.toggle("is-active", Boolean(activeAnchor && nodeAnchor === activeAnchor));
    });

    document.querySelectorAll<HTMLElement>("[data-zhangtu-requirement-anchor]").forEach((node) => {
      const nodeAnchor = node.getAttribute("data-zhangtu-requirement-anchor");
      node.classList.toggle("is-active", Boolean(activeAnchor && nodeAnchor === activeAnchor));
    });
  }, [activeId, items]);

  React.useEffect(() => {
    if (!elementEditMode) {
      setHoverRect(null);
      return undefined;
    }

    const handleMove = (event: MouseEvent) => {
      const target = findEditableTarget(event.target);
      setHoverRect(target ? getElementRect(target) : null);
    };

    const handleClick = (event: MouseEvent) => {
      const target = findEditableTarget(event.target);
      if (!target) {
        return;
      }
      const currentTarget = selectionTargetRef.current;
      if (elementEditorOpen && currentTarget && (target === currentTarget || currentTarget.contains(target))) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      saveCurrentElementRef.current?.({ silentNoop: true });
      openElementEditorForTarget(target);
    };

    const handleViewportChange = () => {
      syncSelectionRect();
      if (activeElementEditId) {
        const record = elementEdits.find((item) => item.id === activeElementEditId);
        if (record) {
          const target = resolveElementFromSelectors(record);
          setHoverRect(target ? getElementRect(target) : null);
        }
      }
    };

    document.addEventListener("mousemove", handleMove, true);
    document.addEventListener("click", handleClick, true);
    window.addEventListener("scroll", handleViewportChange, true);
    window.addEventListener("resize", handleViewportChange);

    return () => {
      document.removeEventListener("mousemove", handleMove, true);
      document.removeEventListener("click", handleClick, true);
      window.removeEventListener("scroll", handleViewportChange, true);
      window.removeEventListener("resize", handleViewportChange);
    };
  }, [activeElementEditId, elementEditMode, elementEditorOpen, elementEdits, openElementEditorForTarget, syncSelectionRect]);

  const active = React.useMemo(
    () => items.find((item) => item.id === activeId) ?? items[0] ?? null,
    [activeId, items],
  );

  const remarkHintText = React.useMemo(() => {
    if (!active) {
      return "当前页面还没有备注。";
    }
    const preview = toPlainText(active.bodyMarkdown || "");
    return preview || "打开详情卡可以查看完整备注内容。";
  }, [active]);

  const popupItem = popup ? items.find((item) => item.id === popup.annotationId) ?? null : null;

  const elementPrompt = React.useMemo(() => buildPrompt(window.location.href, elementEdits), [elementEdits]);
  const layoutWidth = splitCssUnit(elementDraft.styles.width);
  const layoutHeight = splitCssUnit(elementDraft.styles.height);
  const spacingPadding = splitSpacingValue(elementDraft.styles.padding);
  const spacingMargin = splitSpacingValue(elementDraft.styles.margin);
  const fontSize = splitCssUnit(elementDraft.styles.fontSize);
  const lineHeight = splitCssUnit(elementDraft.styles.lineHeight);
  const borderWidth = splitCssUnit(elementDraft.styles.borderWidth);
  const borderRadius = splitCssUnit(elementDraft.styles.borderRadius);

  const markerPositions = React.useMemo(() => {
    return elementEdits
      .map((record, index) => {
        const target = resolveElementFromSelectors(record);
        const rect = target ? getElementRect(target) : null;
        if (!rect) {
          return null;
        }
        return {
          id: record.id,
          label: index + 1,
          top: Math.max(12, rect.top - 12),
          left: Math.max(12, rect.left - 12),
          title: formatPromptText(record.currentText),
        };
      })
      .filter(Boolean) as Array<{ id: string; label: number; top: number; left: number; title: string }>;
  }, [elementEdits, selectedRect]);

  const handleRequirementSave = React.useCallback(() => {
    if (!editingId) {
      return;
    }

    const nextItems = items.map((item) => {
      if (item.id !== editingId) {
        return item;
      }
      return {
        ...item,
        title: draft.title.trim() || item.title,
        bodyMarkdown: draft.body.trim(),
      };
    });

    applyAnnotations(nextItems, true);
    const updated = nextItems.find((item) => item.id === editingId);
    if (updated) {
      setActiveId(updated.id);
      setPopup((current) => current ? { ...current, annotationId: updated.id } : current);
    }
    setEditingId(null);
  }, [applyAnnotations, draft, editingId, items]);

  const handleElementEditorClose = React.useCallback(() => {
    const target = selectionTargetRef.current;
    const snapshot = selectionSnapshotRef.current;
    if (target && snapshot) {
      disableInlineTextEditing(target);
      const saved = elementEditingId ? elementEdits.find((item) => item.id === elementEditingId) : null;
      if (saved) {
        applySavedEdit(target, saved);
      } else {
        resetElementToSnapshot(target, snapshot);
      }
    }
    syncSelectionRect();
    setElementEditorOpen(false);
    setInlineTextEditing(false);
  }, [elementEditingId, elementEdits, syncSelectionRect]);

  const handleClosePageEditor = React.useCallback(() => {
    saveCurrentElementRef.current?.({ silentNoop: true });
    setEditorPanelOpen(false);
    setElementEditMode(false);
    setHoverRect(null);
    setSelectedRect(null);
    setDockExpanded(false);
    setInlineTextEditing(false);
  }, []);

  const handleElementSave = React.useCallback((options?: { silentNoop?: boolean }) => {
    const target = selectionTargetRef.current;
    const snapshot = selectionSnapshotRef.current;
    if (!target || !snapshot) {
      return false;
    }

    const nextDraft = inlineTextEditing
      ? { ...elementDraft, textContent: getElementText(target) }
      : elementDraft;

    if (!hasMeaningfulEdit(snapshot, nextDraft)) {
      disableInlineTextEditing(target);
      resetElementToSnapshot(target, snapshot);
      if (elementEditingId) {
        setElementEdits((current) => current.filter((item) => item.id !== elementEditingId));
        setActiveElementEditId(null);
        if (!options?.silentNoop) {
          setNotice("当前元素没有留下有效修改，标记点已移除。");
        }
      } else if (!options?.silentNoop) {
        setNotice("当前元素没有留下有效修改，所以不会生成标记点。");
      }
      setElementEditorOpen(false);
      setInlineTextEditing(false);
      syncSelectionRect();
      return false;
    }

    const nextId = elementEditingId || `element-edit-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const nextRecord = buildElementEditRecord(nextId, snapshot, nextDraft);
    disableInlineTextEditing(target);
    applySavedEdit(target, nextRecord);
    setElementEdits((current) => {
      const existingIndex = current.findIndex((item) => item.id === nextId);
      if (existingIndex === -1) {
        return [...current, nextRecord];
      }
      const next = [...current];
      next[existingIndex] = nextRecord;
      return next;
    });
    setElementEditingId(nextId);
    setActiveElementEditId(nextId);
    setElementEditorOpen(false);
    setInlineTextEditing(false);
    setDockExpanded(true);
    if (!options?.silentNoop) {
      setNotice("已生成修改标记，可继续批量复制提示词。");
    }
    syncSelectionRect();
    return true;
  }, [elementDraft, elementEditingId, inlineTextEditing, syncSelectionRect]);

  React.useEffect(() => {
    saveCurrentElementRef.current = handleElementSave;
    return () => {
      saveCurrentElementRef.current = null;
    };
  }, [handleElementSave]);

  const handleElementDelete = React.useCallback((id: string) => {
    const record = elementEdits.find((item) => item.id === id);
    if (!record) {
      return;
    }

    const target = resolveElementFromSelectors(record);
    if (target) {
      resetElementToSnapshot(target, {
        tagName: record.tagName,
        selectorPath: record.selectorPath,
        rootSelectorPath: record.rootSelectorPath,
        pageScope: record.pageScope,
        originalText: record.originalText,
        originalHtml: record.originalHtml,
        originalInlineStyle: record.originalInlineStyle,
        originalStyles: createStyleValues(record.originalStyles),
      });
    }

    setElementEdits((current) => current.filter((item) => item.id !== id));
    if (elementEditingId === id) {
      setElementEditorOpen(false);
      setElementEditingId(null);
    }
    if (activeElementEditId === id) {
      setActiveElementEditId(null);
    }
    setNotice("单个修改标记已删除。");
    syncSelectionRect();
  }, [activeElementEditId, elementEditingId, elementEdits, syncSelectionRect]);

  const handleClearAllElementEdits = React.useCallback(() => {
    elementEdits.forEach((record) => {
      const target = resolveElementFromSelectors(record);
      if (target) {
        resetElementToSnapshot(target, {
          tagName: record.tagName,
          selectorPath: record.selectorPath,
          rootSelectorPath: record.rootSelectorPath,
          pageScope: record.pageScope,
          originalText: record.originalText,
          originalHtml: record.originalHtml,
          originalInlineStyle: record.originalInlineStyle,
          originalStyles: createStyleValues(record.originalStyles),
        });
      }
    });
    setElementEdits([]);
    setActiveElementEditId(null);
    setElementEditingId(null);
    setElementEditorOpen(false);
    setNotice("所有修改标记已清空。");
    syncSelectionRect();
  }, [elementEdits, syncSelectionRect]);

  const handleCopyPrompt = React.useCallback(async () => {
    if (!elementEdits.length) {
      setNotice("还没有可复制的修改标记。");
      return;
    }

    try {
      await copyText(elementPrompt);
      handleClearAllElementEdits();
      setNotice("提示词已复制，标记已清空。");
    } catch {
      setNotice("提示词复制失败，请稍后重试。");
    }
  }, [elementEdits.length, elementPrompt, handleClearAllElementEdits]);

  const pendingTextEdits = React.useMemo(
    () => elementEdits.filter((record) => record.currentText !== record.originalText),
    [elementEdits],
  );
  const pendingStyleEdits = React.useMemo(
    () => elementEdits.filter((record) => diffStyleFields(record.originalStyles, record.styles).length > 0),
    [elementEdits],
  );

  const saveTextChangesToSource = React.useCallback(async () => {
    if (!pageDirectory) {
      setNotice("当前页面路径无法识别，暂时不能保存文本。请刷新页面后再试。");
      return;
    }
    if (!pendingTextEdits.length) {
      setNotice("当前没有可保存的文本修改。");
      return;
    }

    const { groups, conflicts } = groupTextReplacements(pendingTextEdits);
    if (conflicts.length) {
      const preview = conflicts
        .slice(0, 3)
        .map((item) => `"${item.before}" 被改成了 ${item.afterValues.length} 个不同结果`)
        .join("\n");
      const rest = conflicts.length > 3 ? `\n另有 ${conflicts.length - 3} 组冲突。` : "";
      setNotice(`检测到相同原文被修改成不同内容，暂时无法批量保存：\n${preview}${rest}`);
      return;
    }
    if (!groups.length) {
      setNotice("当前没有可保存的文本修改。");
      return;
    }

    const replacements = groups.map(({ before, after }) => ({ searchText: before, replaceText: after }));
    let totalCount = 0;
    try {
      const { ok, data } = await countTextReplacementsApi(pageDirectory, replacements);
      totalCount = ok && data.success ? data.totalCount ?? 0 : 0;
    } catch {
      totalCount = 0;
    }

    const confirmMessage = totalCount > 0
      ? `检测到 ${groups.length} 组文本修改，预计会替换 ${totalCount} 处文本。\n\n确定继续保存吗？`
      : `检测到 ${groups.length} 组文本修改。\n\n当前无法预估替换数量，确定继续保存吗？`;
    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const { ok, data } = await applyTextReplacementsApi(pageDirectory, replacements);
      if (!ok || data.success !== true) {
        throw new Error(data.error || "保存文本失败");
      }
      const savedIds = new Set(pendingTextEdits.map((record) => record.id));
      setElementEdits((current) => current.map((record) => (
        savedIds.has(record.id)
          ? { ...record, originalText: record.currentText, originalHtml: escapeHtml(record.currentText) }
          : record
      )));
      setNotice(`文本已保存，共更新 ${data.changedFiles ?? 0} 个文件。`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "保存文本失败");
    }
  }, [pageDirectory, pendingTextEdits]);

  const saveStyleChangesToSource = React.useCallback(async () => {
    if (!pageDirectory) {
      setNotice("当前页面路径无法识别，暂时不能保存样式。请刷新页面后再试。");
      return;
    }
    if (!pendingStyleEdits.length) {
      setNotice("当前没有可保存的样式调整。");
      return;
    }

    const cssText = pendingStyleEdits.map(buildHackCssRule).filter(Boolean).join("\n\n");
    if (!cssText) {
      setNotice("当前没有可保存的样式调整。");
      return;
    }
    if (!window.confirm("确定保存当前的样式调整吗？保存后会写入 hack.css 并立即生效。")) {
      return;
    }

    try {
      const { ok, data } = await saveHackCssApi(pageDirectory, cssText);
      if (!ok || data.success !== true) {
        throw new Error(data.error || "保存强制样式失败");
      }
      setHackCssContent(data.merged || "");
      const savedIds = new Set(pendingStyleEdits.map((record) => record.id));
      setElementEdits((current) => current.map((record) => (
        savedIds.has(record.id) ? { ...record, originalStyles: createStyleValues(record.styles) } : record
      )));
      setNotice("样式已保存到 hack.css。");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "保存强制样式失败");
    }
  }, [pageDirectory, pendingStyleEdits]);

  const clearStyleChangesFromSource = React.useCallback(async () => {
    if (!pageDirectory) {
      setNotice("当前页面路径无法识别，暂时不能清空强制样式。请刷新页面后再试。");
      return;
    }
    if (!window.confirm("确定清空自定义样式吗？清空后页面会自动恢复原样。")) {
      return;
    }

    try {
      const { ok, data } = await clearHackCssApi(pageDirectory);
      if (!ok || data.success !== true) {
        throw new Error(data.error || "清空强制样式失败");
      }
      setHackCssContent("");
      setNotice("已清空自定义样式。");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "清空强制样式失败");
    }
  }, [pageDirectory]);

  const handleEditorKeyDown = React.useCallback((event: React.KeyboardEvent<HTMLElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      handleElementSave();
    } else if (event.key === "Escape") {
      // Esc closes and keeps the edit — never silently discard the user's input.
      event.preventDefault();
      handleElementSave();
    }
  }, [handleElementSave]);

  const handleOpenSavedEdit = React.useCallback((id: string) => {
    const record = elementEdits.find((item) => item.id === id);
    if (!record) {
      return;
    }
    const target = resolveElementFromSelectors(record);
    if (!target) {
      setNotice("没有找到这个标记对应的页面元素。");
      return;
    }
    const rect = getElementRect(target);
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    const editorWidth = Math.min(380, Math.max(292, window.innerWidth * 0.24));
    const markerTop = rect ? Math.max(12, rect.top - 12) : 60;
    const markerLeft = rect ? Math.max(12, rect.left - 12) : 24;
    const positionAboveMarker: FloatingPosition = {
      top: Math.max(24, markerTop - 440),
      left: Math.min(Math.max(24, markerLeft), Math.max(24, window.innerWidth - editorWidth - 24)),
    };
    openElementEditorForTarget(target, positionAboveMarker);
  }, [elementEdits, openElementEditorForTarget]);

  const handleImagePaste = React.useCallback(async (event: React.ClipboardEvent<HTMLTextAreaElement | HTMLDivElement>) => {
    const imageFiles = Array.from(event.clipboardData.items)
      .filter((item) => item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter((file): file is File => Boolean(file));

    if (!imageFiles.length) {
      return;
    }

    event.preventDefault();
    const dataUrls = await Promise.all(imageFiles.map(readFileAsDataUrl));
    updateElementDraft((current) => ({
      ...current,
      images: [...current.images, ...dataUrls],
    }));
    setNotice(`已添加 ${dataUrls.length} 张图片，可随标记一起导出。`);
  }, [updateElementDraft]);

  const handleElementEditorDragStart = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement | null)?.closest("button")) {
      return;
    }

    const panel = elementEditorRef.current;
    if (!panel) {
      return;
    }

    event.preventDefault();
    const offsetX = event.clientX - editorPosition.left;
    const offsetY = event.clientY - editorPosition.top;
    const panelWidth = panel.offsetWidth || 380;
    const panelHeight = panel.offsetHeight || 680;
    setEditorDragging(true);

    const handleMove = (moveEvent: MouseEvent) => {
      setEditorPositionPinned(true);
      setEditorPosition(
        clampFloatingPosition(
          {
            left: moveEvent.clientX - offsetX,
            top: moveEvent.clientY - offsetY,
          },
          panelWidth,
          panelHeight,
        ),
      );
    };

    const handleUp = () => {
      setEditorDragging(false);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleUp);
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleUp);
  }, [editorPosition.left, editorPosition.top]);

  React.useEffect(() => {
    if (!elementEditorOpen) {
      setEditorDragging(false);
      return;
    }

    const panel = elementEditorRef.current;
    if (!panel) {
      return;
    }

    setEditorFrame({
      width: panel.offsetWidth || 460,
      height: panel.offsetHeight || 0,
    });
    setEditorPosition((current) => clampFloatingPosition(current, panel.offsetWidth || 380, panel.offsetHeight || 680));
  }, [elementEditorOpen, selectionSummary, styleEditorOpen]);

  React.useEffect(() => {
    if (!elementEditorOpen) {
      return undefined;
    }

    const handleResize = () => {
      const panel = elementEditorRef.current;
      if (!panel) {
        return;
      }
      setEditorPosition((current) => clampFloatingPosition(current, panel.offsetWidth || 380, panel.offsetHeight || 680));
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [elementEditorOpen]);

  React.useEffect(() => {
    if (!elementEditorOpen) {
      return undefined;
    }

    const panel = elementEditorRef.current;
    if (!panel || typeof ResizeObserver === "undefined") {
      return undefined;
    }

    const observer = new ResizeObserver((entries) => {
      const next = entries[0];
      if (!next) {
        return;
      }
      setEditorFrame({
        width: next.contentRect.width || panel.offsetWidth || 460,
        height: next.contentRect.height || panel.offsetHeight || 0,
      });
    });

    observer.observe(panel);
    return () => {
      observer.disconnect();
    };
  }, [elementEditorOpen]);

  return createPortal(
    <div className={`zt-annotation-layer${panelOpen || editorPanelOpen ? " is-open" : ""}`} data-page-key={pageKey}>
      {!isEmbedded ? (
        <button
          type="button"
          className="zt-annotation-toggle"
          onClick={() => {
            setPanelOpen((value) => {
              const next = !value;
              if (next) {
                setEditorPanelOpen(false);
              }
              return next;
            });
          }}
          aria-expanded={panelOpen}
        >
          <span className="zt-annotation-toggle__label">页面备注</span>
          <span className="zt-annotation-toggle__count">{items.length}</span>
        </button>
      ) : null}

      {!isEmbedded ? (
        <button
          type="button"
          className="zt-annotation-toggle zt-element-edit-toggle"
          onClick={() => {
            setEditorPanelOpen((value) => {
              const next = !value;
              if (next) {
                setPanelOpen(false);
                setElementEditMode(true);
              } else {
                setElementEditMode(false);
                setElementEditorOpen(false);
                setDockExpanded(false);
                setHoverRect(null);
              }
              return next;
            });
          }}
          aria-expanded={editorPanelOpen}
        >
          <span className="zt-annotation-toggle__label">编辑页面</span>
          <span className="zt-annotation-toggle__count">{elementEdits.length}</span>
        </button>
      ) : null}

      {hoverRect && elementEditMode ? (
        <div
          className="zt-element-hover-frame"
          style={{
            top: hoverRect.top,
            left: hoverRect.left,
            width: hoverRect.width,
            height: hoverRect.height,
          }}
        />
      ) : null}

      {selectedRect ? (
        <div
          className="zt-element-selected-frame"
          style={{
            top: selectedRect.top,
            left: selectedRect.left,
            width: selectedRect.width,
            height: selectedRect.height,
          }}
        />
      ) : null}

      {markerPositions.map((marker) => (
        <button
          key={marker.id}
          type="button"
          className={`zt-element-marker${marker.id === activeElementEditId ? " is-active" : ""}`}
          style={{ top: marker.top, left: marker.left }}
          title={marker.title}
          onClick={() => handleOpenSavedEdit(marker.id)}
        >
          {marker.label}
        </button>
      ))}

      {panelOpen && !isEmbedded ? (
        <aside className="zt-annotation-panel is-open" role="dialog" aria-label="页面备注">
        <header className="zt-annotation-panel__head">
          <div>
            <strong>页面备注</strong>
            <p>点击任意备注区域即可在页面上打开说明浮窗，这里只保留轻量索引。</p>
          </div>
          <button type="button" className="zt-annotation-panel__close" onClick={() => setPanelOpen(false)} aria-label="收起">
            ×
          </button>
        </header>

        <div className="zt-annotation-panel__toolbar">
          <button type="button" className="zt-annotation-action" onClick={() => setMarkersVisible((value) => !value)}>
            {markersVisible ? "隐藏角标" : "显示角标"}
          </button>
          <label className="zt-annotation-theme-control">
            <span>主题色</span>
            <input type="color" value={themeColor} onChange={(event) => setThemeColor(event.target.value)} aria-label="备注主题色" />
          </label>
        </div>

        <div className="zt-annotation-panel__body">
          <section className="zt-annotation-panel__section">
            <div className="zt-annotation-panel__section-head">
              <strong>页面备注清单</strong>
              <span>{items.length} 条</span>
            </div>
            <ol className="zt-annotation-list">
              {items.map((item) => (
                <li key={item.id} className={item.id === active?.id ? "is-active" : undefined}>
                  <button
                  type="button"
                  className="zt-annotation-list__item"
                  onClick={() => {
                    openByAnchor(item.anchorId, { openPanel: false, openPopup: true });
                  }}
                >
                    <span className="zt-annotation-list__content">
                      <span className="zt-annotation-list__title">{item.title}</span>
                      <span className="zt-annotation-list__excerpt">{toPlainText(item.bodyMarkdown || "")}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <footer className="zt-annotation-panel__foot">{remarkHintText}</footer>
        </aside>
      ) : null}

      {editorPanelOpen ? (
        <div className="zt-element-dock" role="dialog" aria-label="页面编辑">
          {dockExpanded ? (
            <section className="zt-element-dock__panel">
              <div className="zt-element-dock__panel-head">
                <strong>
                  页面编辑标记
                  <span className="zt-element-dock__head-count">{elementEdits.length}</span>
                </strong>
                <button
                  type="button"
                  className="zt-element-dock__head-close"
                  onClick={() => setDockExpanded(false)}
                  aria-label="收起标记列表"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="zt-element-dock__scroll">
                {elementEdits.length ? (
                  <ol className="zt-element-dock__list">
                    {elementEdits.map((record, index) => (
                      <li key={record.id} className={record.id === activeElementEditId ? "is-active" : undefined}>
                        <div className="zt-element-dock__card">
                          <button type="button" className="zt-element-dock__summary" onClick={() => handleOpenSavedEdit(record.id)}>
                            <span className="zt-element-edits__badge">{index + 1}</span>
                            <span className="zt-element-edits__content">
                              <span className="zt-element-edits__title">{formatPromptText(record.note || record.currentText)}</span>
                              <span className="zt-element-edits__meta">
                                <code>{record.tagName}</code>
                                {record.images.length ? <span>· {record.images.length} 图</span> : null}
                              </span>
                            </span>
                          </button>
                          <button
                            type="button"
                            className="zt-element-dock__delete"
                            onClick={() => handleElementDelete(record.id)}
                            aria-label="删除标记"
                            title="删除"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div className="zt-annotation-empty">点击页面元素即可开始标记。</div>
                )}
              </div>
            </section>
          ) : null}

          {notice ? <div className="zt-element-dock__toast">{notice}</div> : null}

          <div className="zt-element-dock__bar">
            <button
              type="button"
              className={`zt-element-dock__action zt-element-dock__count${dockExpanded ? " is-active" : ""}`}
              onClick={() => setDockExpanded((value) => !value)}
              title="查看已标记需求"
            >
              {elementEdits.length || "--"}
            </button>
            {pendingTextEdits.length ? (
              <button type="button" className="zt-element-dock__copy-btn" onClick={saveTextChangesToSource} title="把文本改动写回源码">
                保存文本
              </button>
            ) : null}
            {pendingStyleEdits.length ? (
              <button type="button" className="zt-element-dock__copy-btn" onClick={saveStyleChangesToSource} title="把样式改动写入 hack.css">
                保存样式
              </button>
            ) : null}
            {hackCssContent.trim() ? (
              <button
                type="button"
                className="zt-element-dock__action"
                onClick={clearStyleChangesFromSource}
                title="清空已保存的自定义样式"
                aria-label="清空自定义样式"
              >
                <Trash2 size={15} />
              </button>
            ) : null}
            {elementEdits.length ? (
              <button type="button" className="zt-element-dock__copy-btn" onClick={handleCopyPrompt} title="复制提示词">
                复制提示词
              </button>
            ) : null}
            <button type="button" className="zt-element-dock__action" onClick={handleClosePageEditor} title="关闭页面编辑">
              <X size={16} />
            </button>
          </div>
        </div>
      ) : null}

      {popup && popupItem ? (
        <div className="zt-annotation-popup" style={{ top: popup.top, left: popup.left, width: popup.width, height: popup.height }}>
          <div
            className="zt-annotation-popup__head"
            onMouseDown={(event) => {
              const target = event.target as HTMLElement | null;
              if (target?.closest("button")) {
                return;
              }

              popupDragOffsetRef.current = {
                x: event.clientX - popup.left,
                y: event.clientY - popup.top,
              };

              const handleMove = (moveEvent: MouseEvent) => {
                const offset = popupDragOffsetRef.current;
                if (!offset) {
                  return;
                }
                const maxLeft = Math.max(16, window.innerWidth - popup.width - 16);
                const maxTop = Math.max(16, window.innerHeight - popup.height - 16);
                setPopup((current) => current
                  ? {
                      ...current,
                      left: Math.min(maxLeft, Math.max(16, moveEvent.clientX - offset.x)),
                      top: Math.min(maxTop, Math.max(16, moveEvent.clientY - offset.y)),
                    }
                  : current);
              };

              const handleUp = () => {
                popupDragOffsetRef.current = null;
                window.removeEventListener("mousemove", handleMove);
                window.removeEventListener("mouseup", handleUp);
              };

              window.addEventListener("mousemove", handleMove);
              window.addEventListener("mouseup", handleUp);
            }}
          >
            <div className="zt-annotation-popup__title">
              <strong>{popupItem.title}</strong>
            </div>
            <div className="zt-annotation-popup__tools">
              <button type="button" className="zt-annotation-popup__edit" onClick={() => openRequirementEditor(popupItem)}>
                编辑
              </button>
              <button type="button" className="zt-annotation-popup__close" onClick={() => setPopup(null)} aria-label="关闭">
                ×
              </button>
            </div>
          </div>
          <div
            className="zt-annotation-popup__body rt"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(popupItem.bodyMarkdown || "") }}
          />
          <button
            type="button"
            className="zt-annotation-popup__resize"
            aria-label="调整备注浮窗大小"
            onMouseDown={(event) => {
              event.stopPropagation();
              popupResizeRef.current = {
                x: event.clientX,
                y: event.clientY,
                width: popup.width,
                height: popup.height,
              };

              const handleMove = (moveEvent: MouseEvent) => {
                const resize = popupResizeRef.current;
                if (!resize) {
                  return;
                }
                const nextWidth = Math.min(Math.max(280, resize.width + moveEvent.clientX - resize.x), window.innerWidth - popup.left - 16);
                const nextHeight = Math.min(Math.max(180, resize.height + moveEvent.clientY - resize.y), window.innerHeight - popup.top - 16);
                setPopup((current) => current
                  ? {
                      ...current,
                      width: nextWidth,
                      height: nextHeight,
                    }
                  : current);
              };

              const handleUp = () => {
                popupResizeRef.current = null;
                window.removeEventListener("mousemove", handleMove);
                window.removeEventListener("mouseup", handleUp);
              };

              window.addEventListener("mousemove", handleMove);
              window.addEventListener("mouseup", handleUp);
            }}
          >
            <span />
          </button>
        </div>
      ) : null}

      {editingId ? (
        <div className="zt-annotation-editor-backdrop" role="presentation" onClick={() => setEditingId(null)}>
          <section className="zt-annotation-editor" role="dialog" aria-label="编辑页面备注" onClick={(event) => event.stopPropagation()}>
            <header className="zt-annotation-editor__head">
              <div>
                <strong>编辑备注</strong>
                <p>这里只维护标题和内容，保存后会同步更新页面浮窗与右侧备注面板。</p>
              </div>
              <button type="button" className="zt-annotation-panel__close" onClick={() => setEditingId(null)} aria-label="关闭">
                ×
              </button>
            </header>

            <div className="zt-annotation-editor__grid">
              <label className="zt-annotation-field zt-annotation-field--full">
                <span>标题</span>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                />
              </label>
            </div>

            <label className="zt-annotation-field zt-annotation-field--textarea">
              <span>内容 <small style={{ fontWeight: 400, color: "var(--zt-muted, #94a3b8)" }}>（支持 Markdown）</small></span>
              <textarea
                className="zt-annotation-plain-editor"
                value={draft.body}
                placeholder="描述该备注的详细内容，支持 Markdown 格式…"
                rows={8}
                onChange={(event) => setDraft((current) => ({ ...current, body: event.target.value }))}
              />
            </label>

            <footer className="zt-annotation-editor__foot">
              <button type="button" className="zt-annotation-action" onClick={() => setEditingId(null)}>
                取消
              </button>
              <button type="button" className="zt-annotation-action zt-annotation-action--primary" onClick={handleRequirementSave}>
                保存并同步
              </button>
            </footer>
          </section>
        </div>
      ) : null}

      {elementEditorOpen && selectionSummary ? (
        <>
          <section
            className="zt-annotation-editor zt-element-editor"
            role="dialog"
            aria-label="编辑页面元素"
            ref={elementEditorRef}
            style={{ top: editorPosition.top, left: editorPosition.left }}
            onKeyDown={handleEditorKeyDown}
          >
            <header
              className={`zt-element-editor__toolbar${editorDragging ? " is-dragging" : ""}`}
              onMouseDown={handleElementEditorDragStart}
            >
              <div className="zt-element-editor__target">
                <strong>{selectionSummary.tagName}</strong>
                <span>{formatPromptText(elementDraft.textContent || selectionSummary.originalText)}</span>
              </div>
              <div className="zt-element-editor__actions">
                <button
                  type="button"
                  className={`zt-element-editor__icon-btn${styleEditorOpen ? " active" : ""}`}
                  onClick={() => setStyleEditorOpen((value) => !value)}
                  title={styleEditorOpen ? "收起样式编辑" : "编辑样式（布局/颜色/文字/边框）"}
                  aria-pressed={styleEditorOpen}
                >
                  <Paintbrush2 size={14} />
                </button>
                {elementEditingId ? (
                  <button
                    type="button"
                    className="zt-element-editor__icon-btn danger"
                    onClick={() => handleElementDelete(elementEditingId)}
                    title="删除此标记"
                    aria-label="删除"
                  >
                    <Trash2 size={14} />
                  </button>
                ) : null}
                <button
                  type="button"
                  className="zt-element-editor__icon-btn"
                  onClick={() => handleElementSave()}
                  title="保存并关闭"
                  aria-label="保存并关闭"
                >
                  <X size={14} />
                </button>
              </div>
            </header>

            <div className="zt-element-editor__body">
            {inlineTextEditing ? (
              <div className="zt-element-editor__inline-tip">
                可直接在页面上修改文字，这里补充需求说明、图片或样式调整。
              </div>
            ) : null}

            <div className="zt-element-editor__section">
              <div className="zt-element-editor__section-head">
                <span>内容参考</span>
                {elementDraft.images.length ? (
                  <div className="zt-element-editor__image-badge">
                    <ImagePlus size={12} />
                    {elementDraft.images.length} 张截图
                  </div>
                ) : null}
              </div>
              <textarea
                className="zt-element-editor__note"
                value={elementDraft.note}
                placeholder="描述需要改什么，或直接粘贴截图…"
                rows={2}
                onPaste={handleImagePaste}
                onChange={(event) => updateElementDraft((current) => ({ ...current, note: event.target.value }))}
              />
            </div>

            {elementDraft.images.length ? (
              <div className="zt-element-editor__images">
                {elementDraft.images.map((image, index) => (
                  <div key={`${image.slice(0, 24)}-${index}`} className="zt-element-editor__image-card">
                    <img src={image} alt={`编辑参考图 ${index + 1}`} />
                    <button
                      type="button"
                      className="zt-annotation-action"
                      onClick={() =>
                        updateElementDraft((current) => ({
                          ...current,
                          images: current.images.filter((_, imageIndex) => imageIndex !== index),
                        }))}
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            ) : null}

            {styleEditorOpen ? (
              <div className="zt-element-editor__panel">
                <div className="zt-element-editor__tabs" role="tablist" aria-label="元素编辑分类">
                  {EDITOR_TABS.map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      role="tab"
                      aria-selected={elementDraft.activeTab === tab}
                      className={`zt-element-editor__tab${elementDraft.activeTab === tab ? " is-active" : ""}`}
                      onClick={() => updateElementDraft((current) => ({ ...current, activeTab: tab }))}
                    >
                      {EDITOR_TAB_LABELS[tab]}
                    </button>
                  ))}
                </div>

                {elementDraft.activeTab === "layout" ? (
                  <div className="zt-element-editor__tab-panel">
                    <div className="zt-element-editor__group">
                      <div className="zt-element-editor__group-title">外边距</div>
                      <div className="zt-element-editor__grid zt-element-editor__grid--compact">
                        <label className="zt-annotation-field">
                          <span>水平</span>
                          <div className="zt-element-editor__value-with-unit">
                            <input
                              type="text"
                              value={spacingMargin.horizontal}
                              onChange={(event) => updateElementDraft((current) => ({
                                ...current,
                                styles: { ...current.styles, margin: composeSpacingValue(event.target.value, spacingMargin.vertical, spacingMargin.unit) },
                              }))}
                            />
                            <select
                              value={spacingMargin.unit}
                              onChange={(event) => updateElementDraft((current) => ({
                                ...current,
                                styles: { ...current.styles, margin: composeSpacingValue(spacingMargin.horizontal, spacingMargin.vertical, event.target.value) },
                              }))}
                            >
                              <option value="px">px</option>
                              <option value="%">%</option>
                              <option value="rem">rem</option>
                            </select>
                          </div>
                        </label>
                        <label className="zt-annotation-field">
                          <span>垂直</span>
                          <div className="zt-element-editor__value-with-unit">
                            <input
                              type="text"
                              value={spacingMargin.vertical}
                              onChange={(event) => updateElementDraft((current) => ({
                                ...current,
                                styles: { ...current.styles, margin: composeSpacingValue(spacingMargin.horizontal, event.target.value, spacingMargin.unit) },
                              }))}
                            />
                            <select
                              value={spacingMargin.unit}
                              onChange={(event) => updateElementDraft((current) => ({
                                ...current,
                                styles: { ...current.styles, margin: composeSpacingValue(spacingMargin.horizontal, spacingMargin.vertical, event.target.value) },
                              }))}
                            >
                              <option value="px">px</option>
                              <option value="%">%</option>
                              <option value="rem">rem</option>
                            </select>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="zt-element-editor__group">
                      <div className="zt-element-editor__group-title">内边距</div>
                      <div className="zt-element-editor__grid zt-element-editor__grid--compact">
                        <label className="zt-annotation-field">
                          <span>水平</span>
                          <div className="zt-element-editor__value-with-unit">
                            <input
                              type="text"
                              value={spacingPadding.horizontal}
                              onChange={(event) => updateElementDraft((current) => ({
                                ...current,
                                styles: { ...current.styles, padding: composeSpacingValue(event.target.value, spacingPadding.vertical, spacingPadding.unit) },
                              }))}
                            />
                            <select
                              value={spacingPadding.unit}
                              onChange={(event) => updateElementDraft((current) => ({
                                ...current,
                                styles: { ...current.styles, padding: composeSpacingValue(spacingPadding.horizontal, spacingPadding.vertical, event.target.value) },
                              }))}
                            >
                              <option value="px">px</option>
                              <option value="%">%</option>
                              <option value="rem">rem</option>
                            </select>
                          </div>
                        </label>
                        <label className="zt-annotation-field">
                          <span>垂直</span>
                          <div className="zt-element-editor__value-with-unit">
                            <input
                              type="text"
                              value={spacingPadding.vertical}
                              onChange={(event) => updateElementDraft((current) => ({
                                ...current,
                                styles: { ...current.styles, padding: composeSpacingValue(spacingPadding.horizontal, event.target.value, spacingPadding.unit) },
                              }))}
                            />
                            <select
                              value={spacingPadding.unit}
                              onChange={(event) => updateElementDraft((current) => ({
                                ...current,
                                styles: { ...current.styles, padding: composeSpacingValue(spacingPadding.horizontal, spacingPadding.vertical, event.target.value) },
                              }))}
                            >
                              <option value="px">px</option>
                              <option value="%">%</option>
                              <option value="rem">rem</option>
                            </select>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="zt-element-editor__grid zt-element-editor__grid--compact zt-element-editor__group zt-element-editor__group--divider">
                      <label className="zt-annotation-field">
                        <span>宽度 (px)</span>
                        <div className="zt-element-editor__value-with-unit">
                          <input
                            type="text"
                            placeholder="自动"
                            value={layoutWidth.amount}
                            onChange={(event) => updateElementDraft((current) => ({
                              ...current,
                              styles: { ...current.styles, width: composeCssUnit(event.target.value, layoutWidth.unit) },
                            }))}
                          />
                          <select
                            value={layoutWidth.unit}
                            onChange={(event) => updateElementDraft((current) => ({
                              ...current,
                              styles: { ...current.styles, width: composeCssUnit(layoutWidth.amount, event.target.value) },
                            }))}
                          >
                            <option value="auto">自动</option>
                            <option value="px">px</option>
                            <option value="%">%</option>
                            <option value="rem">rem</option>
                          </select>
                        </div>
                      </label>
                      <label className="zt-annotation-field">
                        <span>高度 (px)</span>
                        <div className="zt-element-editor__value-with-unit">
                          <input
                            type="text"
                            placeholder="自动"
                            value={layoutHeight.amount}
                            onChange={(event) => updateElementDraft((current) => ({
                              ...current,
                              styles: { ...current.styles, height: composeCssUnit(event.target.value, layoutHeight.unit) },
                            }))}
                          />
                          <select
                            value={layoutHeight.unit}
                            onChange={(event) => updateElementDraft((current) => ({
                              ...current,
                              styles: { ...current.styles, height: composeCssUnit(layoutHeight.amount, event.target.value) },
                            }))}
                          >
                            <option value="auto">自动</option>
                            <option value="px">px</option>
                            <option value="%">%</option>
                            <option value="rem">rem</option>
                          </select>
                        </div>
                      </label>
                    </div>
                  </div>
                ) : null}

                {elementDraft.activeTab === "color" ? (
                  <div className="zt-element-editor__tab-panel">
                    <label className="zt-annotation-field">
                      <span>背景颜色</span>
                      <div className="zt-element-editor__field-row">
                        <span className="zt-element-editor__color-preview" style={{ background: elementDraft.styles.backgroundColor || "transparent" }} />
                        <input type="text" value={elementDraft.styles.backgroundColor}
                          onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, backgroundColor: event.target.value } }))} />
                      </div>
                    </label>
                    <label className="zt-annotation-field">
                      <span>文字颜色</span>
                      <div className="zt-element-editor__field-row">
                        <span className="zt-element-editor__color-preview" style={{ background: elementDraft.styles.color || "#0a0a0a" }} />
                        <input type="text" value={elementDraft.styles.color}
                          onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, color: event.target.value } }))} />
                      </div>
                    </label>
                    <label className="zt-annotation-field">
                      <span>边框颜色</span>
                      <div className="zt-element-editor__field-row">
                        <span className="zt-element-editor__color-preview" style={{ background: elementDraft.styles.borderColor || "transparent" }} />
                        <input type="text" value={elementDraft.styles.borderColor}
                          onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, borderColor: event.target.value } }))} />
                      </div>
                    </label>
                    <label className="zt-annotation-field zt-annotation-field--full">
                      <span>透明度</span>
                      <div className="zt-element-editor__opacity">
                        <input type="range" min="0" max="100"
                          value={Number(elementDraft.styles.opacity || "1") * 100}
                          onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, opacity: String(Number(event.target.value) / 100) } }))} />
                        <div className="zt-element-editor__value-with-unit">
                          <input type="number" min="0" max="100"
                            value={Math.round(Number(elementDraft.styles.opacity || "1") * 100)}
                            onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, opacity: String(Number(event.target.value || 0) / 100) } }))} />
                          <span className="zt-element-editor__unit">%</span>
                        </div>
                      </div>
                    </label>
                  </div>
                ) : null}

                {elementDraft.activeTab === "text" ? (
                  <div className="zt-element-editor__tab-panel">
                    <label className="zt-annotation-field zt-annotation-field--full">
                      <span>字体家族</span>
                      <input type="text" value={elementDraft.styles.fontFamily}
                        onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, fontFamily: event.target.value } }))} />
                    </label>
                    <label className="zt-annotation-field">
                      <span>字重</span>
                      <select value={elementDraft.styles.fontWeight}
                        onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, fontWeight: event.target.value } }))}>
                        <option value="300">300</option>
                        <option value="400">400</option>
                        <option value="500">500</option>
                        <option value="600">600</option>
                        <option value="700">700</option>
                      </select>
                    </label>
                    <label className="zt-annotation-field">
                      <span>对齐</span>
                      <select value={elementDraft.styles.textAlign}
                        onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, textAlign: event.target.value } }))}>
                        <option value="start">start</option>
                        <option value="center">center</option>
                        <option value="end">end</option>
                        <option value="justify">justify</option>
                      </select>
                    </label>
                    <label className="zt-annotation-field">
                      <span>字号</span>
                      <div className="zt-element-editor__value-with-unit">
                        <input type="text" value={fontSize.amount}
                          onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, fontSize: composeCssUnit(event.target.value, fontSize.unit) } }))} />
                        <select
                          value={fontSize.unit}
                          onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, fontSize: composeCssUnit(fontSize.amount, event.target.value) } }))}
                        >
                          <option value="px">px</option>
                          <option value="rem">rem</option>
                          <option value="em">em</option>
                        </select>
                      </div>
                    </label>
                    <label className="zt-annotation-field">
                      <span>行高</span>
                      <div className="zt-element-editor__value-with-unit">
                        <input type="text" value={lineHeight.amount}
                          onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, lineHeight: composeCssUnit(event.target.value, lineHeight.unit) } }))} />
                        <select
                          value={lineHeight.unit}
                          onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, lineHeight: composeCssUnit(lineHeight.amount, event.target.value) } }))}
                        >
                          <option value="px">px</option>
                          <option value="rem">rem</option>
                          <option value="em">em</option>
                        </select>
                      </div>
                    </label>
                  </div>
                ) : null}

                {elementDraft.activeTab === "border" ? (
                  <div className="zt-element-editor__tab-panel">
                    <label className="zt-annotation-field">
                      <span>边框类型</span>
                      <select value={elementDraft.styles.borderStyle}
                        onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, borderStyle: event.target.value } }))}>
                        <option value="">无</option>
                        <option value="solid">实线</option>
                        <option value="dashed">虚线</option>
                        <option value="dotted">点线</option>
                        <option value="double">双线</option>
                      </select>
                    </label>
                    <div className="zt-element-editor__grid zt-element-editor__grid--compact">
                      <label className="zt-annotation-field">
                        <span>边框宽度</span>
                        <div className="zt-element-editor__value-with-unit">
                          <input type="text" value={borderWidth.amount}
                            onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, borderWidth: composeCssUnit(event.target.value, borderWidth.unit) } }))} />
                          <select
                            value={borderWidth.unit}
                            onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, borderWidth: composeCssUnit(borderWidth.amount, event.target.value) } }))}
                          >
                            <option value="px">px</option>
                            <option value="rem">rem</option>
                          </select>
                        </div>
                      </label>
                      <label className="zt-annotation-field">
                        <span>圆角</span>
                        <div className="zt-element-editor__value-with-unit">
                          <input type="text" value={borderRadius.amount}
                            onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, borderRadius: composeCssUnit(event.target.value, borderRadius.unit) } }))} />
                          <select
                            value={borderRadius.unit}
                            onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, borderRadius: composeCssUnit(borderRadius.amount, event.target.value) } }))}
                          >
                            <option value="px">px</option>
                            <option value="%">%</option>
                            <option value="rem">rem</option>
                          </select>
                        </div>
                      </label>
                    </div>
                    <label className="zt-annotation-field">
                      <span>边框颜色</span>
                      <div className="zt-element-editor__field-row">
                        <span className="zt-element-editor__color-preview" style={{ background: elementDraft.styles.borderColor || "transparent" }} />
                        <input type="text" value={elementDraft.styles.borderColor}
                          onChange={(event) => updateElementDraft((current) => ({ ...current, styles: { ...current.styles, borderColor: event.target.value } }))} />
                      </div>
                    </label>
                  </div>
                ) : null}
              </div>
            ) : null}
            </div>

            <footer className="zt-element-editor__footer">
              <button type="button" className="zt-element-editor__ghost-btn" onClick={handleElementEditorClose}>
                丢弃
              </button>
              <button type="button" className="zt-element-editor__primary-btn" onClick={() => handleElementSave()}>
                保存标记
              </button>
            </footer>
          </section>
        </>
      ) : null}
    </div>,
    document.body,
  );
}
