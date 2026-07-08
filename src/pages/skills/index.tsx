import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Button,
  Empty,
  Modal,
  Spin,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
  type UploadProps,
} from "antd";
import { FileArchive, FileText, FolderOpen, Trash2, Upload as UploadIcon } from "lucide-react";
import { getProjectName, subscribeProjectName } from "../../common/branding";
import {
  deleteSkillEntry,
  importSkillEntry,
  listSkills,
  readSkillDetail,
  type SkillDetail,
  type SkillSummary,
} from "./data/api";
import "../../styles/app.css";
import "./styles/page.css";

declare global {
  interface Window {
    openZhangtuSkillsUploadModal?: () => void;
  }
}

const OPEN_UPLOAD_MESSAGE = "zhangtu-skills-open-upload";

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "出现未知错误。";
}

function getCategoryLabel(category: SkillSummary["category"]) {
  return category === "project" ? "项目自带" : "用户导入";
}

function stripFrontmatter(markdown: string) {
  return String(markdown || "").replace(/^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n?/, "").trim();
}

function markdownToHtml(markdown: string) {
  if (!markdown) return "";

  const lines = markdown.split("\n");
  let html = "";
  let inList = false;
  let inCode = false;
  let inTable = false;
  let codeBlockContent: string[] = [];
  let tableRows: string[][] = [];

  const flushList = () => {
    if (inList) { html += "</ul>"; inList = false; }
  };

  const flushTable = () => {
    if (!inTable) return;
    html += '<div class="skills-markdown-table"><table>';
    if (tableRows.length > 0) {
      html += `<thead><tr>${tableRows[0].map((cell) => `<th>${cell}</th>`).join("")}</tr></thead>`;
      html += "<tbody>";
      for (let i = 1; i < tableRows.length; i++) {
        if (tableRows[i].every((cell) => /^\s*:-*-*:?\s*$/.test(cell) || /^-+$/.test(cell) || !cell.trim())) continue;
        html += `<tr>${tableRows[i].map((cell) => `<td>${cell}</td>`).join("")}</tr>`;
      }
      html += "</tbody>";
    }
    html += "</table></div>";
    inTable = false;
    tableRows = [];
  };

  const inlineFormat = (text: string) =>
    text
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, "<code>$1</code>")
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>');

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith("```")) {
      if (inCode) {
        html += `<pre><code>${codeBlockContent.join("\n")}</code></pre>`;
        codeBlockContent = [];
        inCode = false;
      } else {
        inCode = true;
      }
      continue;
    }
    if (inCode) {
      codeBlockContent.push(line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"));
      continue;
    }
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      flushList();
      inTable = true;
      tableRows.push(line.split("|").slice(1, -1).map((cell) => inlineFormat(cell.trim())));
      continue;
    }
    flushTable();
    if (trimmed.startsWith("#")) {
      flushList();
      const level = Math.min(trimmed.match(/^#+/)?.[0]?.length || 1, 6);
      html += `<h${level}>${inlineFormat(trimmed.replace(/^#+\s*/, ""))}</h${level}>`;
      continue;
    }
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      if (!inList) { inList = true; html += '<ul class="skills-markdown-list">'; }
      html += `<li>${inlineFormat(trimmed.replace(/^[-*]\s*/, ""))}</li>`;
      continue;
    }
    if (trimmed.startsWith(">")) {
      flushList();
      html += `<blockquote>${inlineFormat(trimmed.replace(/^>\s*/, ""))}</blockquote>`;
      continue;
    }
    if (trimmed === "---" || trimmed === "***") { flushList(); html += "<hr />"; continue; }
    if (!trimmed) { flushList(); continue; }
    flushList();
    html += `<p>${inlineFormat(line)}</p>`;
  }

  flushList();
  flushTable();
  return html;
}

function ColumnsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="9" y1="3" x2="9" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SkillFolder({
  title,
  icon,
  items,
  selectedId,
  onSelect,
  onDelete,
}: {
  title: string;
  icon: React.ReactNode;
  items: SkillSummary[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete?: (skill: SkillSummary) => void;
}) {
  return (
    <section className="skills-folder">
      <div className="skills-folder-header">
        {icon}
        <span>{title}</span>
        <span className="skills-folder-count">{items.length}</span>
      </div>
      <div className="skills-folder-body">
        {items.length ? items.map((skill) => (
          <div
            key={skill.id}
            className={`skills-item-row ${selectedId === skill.id ? "is-active" : ""}`}
          >
            <button
              type="button"
              className="skills-item"
              onClick={() => onSelect(skill.id)}
            >
              <FileText size={14} />
              <span className="skills-item-name">{skill.name}</span>
            </button>
            {onDelete && (
              <Tooltip title="删除技能" placement="right">
                <button
                  type="button"
                  className="skills-item-delete"
                  onClick={(e) => { e.stopPropagation(); onDelete(skill); }}
                >
                  <Trash2 size={13} />
                </button>
              </Tooltip>
            )}
          </div>
        )) : (
          <div className="skills-folder-empty">暂无技能</div>
        )}
      </div>
    </section>
  );
}

function SkillsPage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [skillsLoading, setSkillsLoading] = useState(true);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [skills, setSkills] = useState<SkillSummary[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState<string | null>(null);
  const [detailSkill, setDetailSkill] = useState<SkillDetail | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    () => window.sessionStorage.getItem("zhangtu:skillsSidebarCollapsed") === "true",
  );

  const projectSkills = useMemo(() => skills.filter((s) => s.category === "project"), [skills]);
  const userSkills = useMemo(() => skills.filter((s) => s.category === "user"), [skills]);

  useEffect(() => {
    window.sessionStorage.setItem("zhangtu:skillsSidebarCollapsed", String(isSidebarCollapsed));
  }, [isSidebarCollapsed]);

  const loadSkills = async (preferredId?: string) => {
    setSkillsLoading(true);
    setSkillsError(null);
    try {
      const nextSkills = await listSkills();
      setSkills(nextSkills);
      const nextId =
        preferredId
        || (selectedSkillId && nextSkills.some((s) => s.id === selectedSkillId) ? selectedSkillId : null)
        || nextSkills[0]?.id
        || null;
      setSelectedSkillId(nextId);
    } catch (error) {
      setSkillsError(getErrorMessage(error));
      setSkills([]);
      setSelectedSkillId(null);
    } finally {
      setSkillsLoading(false);
    }
  };

  useEffect(() => {
    const update = (name: string) => { document.title = `${name} - 技能管理`; };
    update(getProjectName());
    return subscribeProjectName(update);
  }, []);

  useEffect(() => { void loadSkills(); }, []);

  useEffect(() => {
    if (!selectedSkillId) {
      setDetailSkill(null);
      setDetailError(null);
      setDetailLoading(false);
      return;
    }
    let cancelled = false;
    const load = async () => {
      setDetailLoading(true);
      setDetailError(null);
      try {
        const detail = await readSkillDetail(selectedSkillId);
        if (!cancelled) setDetailSkill(detail);
      } catch (error) {
        if (!cancelled) { setDetailError(getErrorMessage(error)); setDetailSkill(null); }
      } finally {
        if (!cancelled) setDetailLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [selectedSkillId]);

  useEffect(() => {
    const open = () => setUploadOpen(true);
    const onMsg = (e: MessageEvent) => { if (e.data?.type === OPEN_UPLOAD_MESSAGE) open(); };
    window.openZhangtuSkillsUploadModal = open;
    window.addEventListener("message", onMsg);
    return () => { window.removeEventListener("message", onMsg); delete window.openZhangtuSkillsUploadModal; };
  }, []);

  const handleDelete = async (skill: SkillSummary) => {
    if (!window.confirm(`确定删除用户技能「${skill.name}」？此操作不可恢复。`)) return;
    setDeletingId(skill.id);
    try {
      await deleteSkillEntry(skill.id);
      message.success(`已删除技能：${skill.name}`);
      if (selectedSkillId === skill.id) setSelectedSkillId(null);
      await loadSkills();
    } catch (error) {
      message.error(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  const uploadProps: UploadProps = {
    name: "file",
    accept: ".md,.zip,.skill",
    showUploadList: false,
    multiple: false,
    disabled: uploading,
    beforeUpload: async (file) => {
      const isValid = file.name.endsWith(".md") || file.name.endsWith(".zip") || file.name.endsWith(".skill");
      if (!isValid) { message.error("仅支持 .md、.zip 或 .skill 文件"); return Upload.LIST_IGNORE; }
      if (file.name.endsWith(".zip") || file.name.endsWith(".skill")) {
        message.info(`收到 ${file.name}，请确保压缩包根级包含 SKILL.md 文件`);
      }
      try {
        setUploading(true);
        const imported = await importSkillEntry(file as File);
        message.success(`已导入技能：${imported.name}`);
        setUploadOpen(false);
        await loadSkills(imported.id);
      } catch (error) {
        message.error(getErrorMessage(error));
      } finally {
        setUploading(false);
      }
      return Upload.LIST_IGNORE;
    },
  };

  const renderedMarkdown = useMemo(
    () => markdownToHtml(stripFrontmatter(detailSkill?.contentMarkdown || detailSkill?.markdown || "")),
    [detailSkill],
  );

  const renderDetail = () => {
    if (skillsLoading || detailLoading) {
      return <div className="skills-placeholder"><Spin /></div>;
    }
    if (skillsError) {
      return (
        <div className="skills-placeholder skills-placeholder-col">
          <Typography.Text type="danger">{skillsError}</Typography.Text>
          <Button size="small" onClick={() => void loadSkills()}>重试</Button>
        </div>
      );
    }
    if (detailError) {
      return <div className="skills-placeholder"><Typography.Text type="danger">{detailError}</Typography.Text></div>;
    }
    if (!detailSkill) {
      return (
        <div className="skills-placeholder">
          <Empty description={skills.length ? "请在左侧选择一个技能" : "暂无可查看的技能"} />
        </div>
      );
    }
    return (
      <article className="skills-rendered">
        <div className="skills-rendered-meta">
          <Tag color={detailSkill.category === "project" ? "blue" : "green"}>
            {getCategoryLabel(detailSkill.category)}
          </Tag>
          <Tag color={detailSkill.callableConflict ? "red" : "cyan"}>
            {detailSkill.callableConflict ? "调用名冲突" : `调用名：${detailSkill.callableName}`}
          </Tag>
          <span className="skills-meta-path">{detailSkill.skillPath}</span>
        </div>
        {detailSkill.description && (
          <p className="skills-rendered-desc">{detailSkill.description}</p>
        )}
        {detailSkill.callableConflict && (
          <Typography.Paragraph type="warning">
            当前 skill 的调用名与其他 skill 重复，页面可以展示，但调用时会发生歧义。
            请修改对应 <Typography.Text code>SKILL.md</Typography.Text> 的 <Typography.Text code>name</Typography.Text> 字段后重试。
          </Typography.Paragraph>
        )}
        <div
          className="skills-rendered-markdown"
          dangerouslySetInnerHTML={{ __html: renderedMarkdown }}
        />
      </article>
    );
  };

  return (
    <main className="skills-page">
      <nav className="skills-nav">
        <div className="skills-nav-left">
          <button
            type="button"
            className="skills-sidebar-toggle"
            onClick={() => {
              setIsSidebarCollapsed((current) => !current);
              window.parent.postMessage({ type: "zhangtu:sidebar-toggle" }, "*");
            }}
            aria-label="展开/收起侧边栏"
            title="展开/收起侧边栏"
          >
            <ColumnsIcon />
          </button>
          <span className="skills-nav-title">技能库</span>
          <span className="skills-nav-counts">
            {projectSkills.length + userSkills.length} 项
          </span>
        </div>
        <Button
          className="skills-import-btn"
          icon={<UploadIcon size={14} />}
          onClick={() => setUploadOpen(true)}
          loading={uploading}
        >
          导入技能
        </Button>
      </nav>

      <div className={`skills-layout ${isSidebarCollapsed ? "is-sidebar-collapsed" : ""}`}>
        <aside className="skills-sidebar">
          <SkillFolder
            title="项目自带"
            icon={<FolderOpen size={15} />}
            items={projectSkills}
            selectedId={selectedSkillId}
            onSelect={setSelectedSkillId}
          />
          <SkillFolder
            title="用户导入"
            icon={<FolderOpen size={15} />}
            items={userSkills}
            selectedId={selectedSkillId}
            onSelect={setSelectedSkillId}
            onDelete={deletingId ? undefined : handleDelete}
          />
        </aside>

        <section className="skills-content">
          {renderDetail()}
        </section>
      </div>

      <Modal
        title="导入技能"
        open={uploadOpen}
        onCancel={() => setUploadOpen(false)}
        footer={<Button onClick={() => setUploadOpen(false)}>关闭</Button>}
        width={520}
        className="skills-upload-modal"
      >
        <div className="skills-upload-body">
          <Typography.Paragraph type="secondary">
            支持上传包含根级 <Typography.Text code>SKILL.md</Typography.Text>{" "}
            文件的 <Tag>.zip</Tag> 或 <Tag>.skill</Tag> 压缩包，也可直接上传{" "}
            <Tag>.md</Tag> 文件。
          </Typography.Paragraph>
          <Typography.Paragraph type="secondary">
            <Typography.Text code>SKILL.md</Typography.Text>{" "}
            必须包含 YAML frontmatter 的 <strong>name</strong> 与 <strong>description</strong> 字段，
            且 <strong>name</strong> 不能与现有技能重名；导入后即在项目技能库中生效，可被 Claude Code 调用。
          </Typography.Paragraph>
          <Upload.Dragger {...uploadProps} className="skills-dragger">
            <div className="skills-dragger-content">
              <FileArchive size={36} color="#94a3b8" />
              <Typography.Text strong className="skills-dragger-title">
                点击或拖拽文件到此区域上传
              </Typography.Text>
              <Typography.Text type="secondary">
                支持 .md、.zip、.skill 格式
              </Typography.Text>
            </div>
          </Upload.Dragger>
        </div>
      </Modal>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SkillsPage />
  </React.StrictMode>,
);
