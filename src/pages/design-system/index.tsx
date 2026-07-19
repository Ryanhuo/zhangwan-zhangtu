import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import manifestRaw from "./assets/zhangwan-design/_ds_manifest.json";
import "../../styles/app.css";
import "./assets/zhangwan-design/tokens/colors.css";
import "./assets/zhangwan-design/tokens/typography.css";
import "./assets/zhangwan-design/tokens/spacing.css";
import "./styles/page.css";

interface ManifestCard {
  path: string;
  group: string;
  viewport: string;
  subtitle: string;
  name: string;
}

interface ManifestToken {
  name: string;
  value: string;
  kind: string;
  definedIn: string;
}

interface ManifestComponent {
  name: string;
  sourcePath: string;
}

interface Manifest {
  cards: ManifestCard[];
  tokens: ManifestToken[];
  components: ManifestComponent[];
}

const manifest = manifestRaw as unknown as Manifest;

const ASSET_BASE = "./assets/zhangwan-design/";

const GROUP_ORDER = ["Brand", "Colors", "Type", "Spacing", "Components", "Zhangwan Console"] as const;

const GROUP_LABEL: Record<string, string> = {
  Brand: "品牌细节",
  Colors: "色彩",
  Type: "字体",
  Spacing: "间距 / 圆角 / 阴影",
  Components: "组件",
  "Zhangwan Console": "完整 UI Kit",
};

const GROUP_ANCHOR: Record<string, string> = {
  Brand: "brand",
  Colors: "colors",
  Type: "type",
  Spacing: "spacing",
  Components: "components",
  "Zhangwan Console": "console",
};

function parseViewport(viewport: string) {
  const [w, h] = viewport.split("x").map((n) => parseInt(n, 10));
  return { width: w || 700, height: h || 200 };
}

function CardFrame({ card }: { card: ManifestCard }) {
  const { width, height } = parseViewport(card.viewport);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => {
      const available = el.clientWidth;
      setScale(available > 0 ? Math.min(1, available / width) : 1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div className="ds-card">
      <div className="ds-card-head">
        <h3>{card.name}</h3>
        <p>{card.subtitle}</p>
      </div>
      <div className="ds-frame-outer" ref={wrapperRef}>
      <div
        className="ds-frame-shell"
        style={{ width: width * scale, height: height * scale }}
      >
        <iframe
          title={card.name}
          src={ASSET_BASE + card.path}
          width={width}
          height={height}
          style={{ transform: `scale(${scale})` }}
          loading="lazy"
        />
      </div>
      </div>
    </div>
  );
}

function TokenSwatchTable({ tokens }: { tokens: ManifestToken[] }) {
  const colorTokens = tokens.filter((t) => t.kind === "color");
  const otherTokens = tokens.filter((t) => t.kind !== "color");

  return (
    <div className="ds-token-appendix">
      <div className="ds-token-grid">
        {colorTokens.map((token) => (
          <div className="ds-token-swatch" key={token.name}>
            <div className="ds-token-swatch-color" style={{ background: token.value }} />
            <div className="ds-token-swatch-meta">
              <code>{token.name}</code>
              <span>{token.value}</span>
            </div>
          </div>
        ))}
      </div>
      <table className="ds-token-table">
        <thead>
          <tr>
            <th>token</th>
            <th>值</th>
            <th>类型</th>
            <th>定义于</th>
          </tr>
        </thead>
        <tbody>
          {otherTokens.map((token) => (
            <tr key={token.name}>
              <td>
                <code>{token.name}</code>
              </td>
              <td>{token.value}</td>
              <td>{token.kind}</td>
              <td>{token.definedIn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComponentIndex({ components }: { components: ManifestComponent[] }) {
  const grouped = useMemo(() => {
    const map = new Map<string, ManifestComponent[]>();
    for (const component of components) {
      const match = component.sourcePath.match(/^components\/([^/]+)\//);
      const category = match ? match[1] : "other";
      if (!map.has(category)) map.set(category, []);
      map.get(category)!.push(component);
    }
    return Array.from(map.entries());
  }, [components]);

  const CATEGORY_LABEL: Record<string, string> = {
    core: "核心",
    data: "数据",
    feedback: "反馈",
    forms: "表单",
    navigation: "导航",
  };

  return (
    <div className="ds-component-index">
      {grouped.map(([category, items]) => (
        <div className="ds-component-group" key={category}>
          <h4>{CATEGORY_LABEL[category] || category}</h4>
          <div className="ds-chip-row">
            {items.map((item) => (
              <span className="ds-chip" key={item.name}>
                {item.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// 预览态下 API（技能发现 / 导出）与页面同源，独立预览时回退到掌图 shell 默认端口。
const API_FALLBACK_PORT = 6320;

function apiOrigins() {
  const origins: string[] = [];
  const push = (value: string | null) => {
    if (value && !origins.includes(value)) origins.push(value);
  };
  try {
    push(new URL(document.referrer).origin);
  } catch {
    /* 独立预览没有 referrer，忽略 */
  }
  push(window.location.origin);
  push(`${window.location.protocol}//${window.location.hostname}:${API_FALLBACK_PORT}`);
  return origins;
}

function filenameFromDisposition(disposition: string | null) {
  if (!disposition) return null;
  const star = disposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (star) {
    try {
      return decodeURIComponent(star[1]);
    } catch {
      return star[1];
    }
  }
  const plain = disposition.match(/filename="?([^";]+)"?/i);
  return plain ? plain[1] : null;
}

const TABS: Array<{ id: string; label: string }> = [
  { id: "overview", label: "概览" },
  ...GROUP_ORDER.map((group) => ({ id: GROUP_ANCHOR[group], label: GROUP_LABEL[group] })),
  { id: "tokens", label: "完整 Token 列表" },
];

function App() {
  const [active, setActive] = useState("overview");
  const [exportSkillId, setExportSkillId] = useState<string | null>(null);
  const [exportOrigin, setExportOrigin] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const cardsByGroup = useMemo(() => {
    const map = new Map<string, ManifestCard[]>();
    for (const card of manifest.cards) {
      if (!map.has(card.group)) map.set(card.group, []);
      map.get(card.group)!.push(card);
    }
    return map;
  }, []);

  // 解析 zhangwan-design 技能条目：它就是「整个设计文件」，复用技能导出端点即可下载完整 zip。
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const origin of apiOrigins()) {
        try {
          const res = await fetch(new URL("/api/skills", origin));
          if (!res.ok) continue;
          const data = await res.json();
          const skills = (Array.isArray(data?.skills) ? data.skills : []) as Array<{
            id?: string;
            slug?: string;
          }>;
          const match = skills.find(
            (skill) => skill.slug === "zhangwan-design" || String(skill.id || "").endsWith(":zhangwan-design"),
          );
          if (match?.id && !cancelled) {
            setExportSkillId(String(match.id));
            setExportOrigin(origin);
            return;
          }
        } catch {
          /* 该 origin 不可用，尝试下一个 */
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleExport = async () => {
    if (!exportSkillId || !exportOrigin || exporting) return;
    setExporting(true);
    try {
      const res = await fetch(
        new URL(`/api/skills/${encodeURIComponent(exportSkillId)}/export`, exportOrigin),
      );
      if (!res.ok) throw new Error(`导出失败（${res.status}）`);
      const blob = await res.blob();
      const filename = filenameFromDisposition(res.headers.get("content-disposition")) || "zhangwan-design.zip";
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "导出设计文件失败。");
    } finally {
      setExporting(false);
    }
  };

  const renderActiveSection = () => {
    if (active === "overview") {
      return (
        <section className="ds-section ds-overview">
          <p className="ds-eyebrow">Design System</p>
          <h1>掌玩 (Zhangwan) 设计系统</h1>
          <p className="ds-lede">
            掌玩是一款内部数据分析 / BI 控制台——供市场、增长、运营团队分析多条产品线的
            用户获取、留存、付费与内容表现的企业内部工具，不是面向消费者的产品。密集的
            数据表格、筛选工具栏与 KPI 卡片是界面主体。
          </p>
          <div className="ds-overview-grid">
            <div>
              <h3>内容基调</h3>
              <p>
                界面全程简体中文，语气中性、事务性、隐含第二人称，绝不使用第一人称或
                营销口吻。破坏性操作总是配一个原生风格确认弹窗。唯一带温度的地方是
                仪表盘首页按时段变化的问候语——其余各处密集而务实，不使用表情符号。
              </p>
            </div>
            <div>
              <h3>视觉基调</h3>
              <p>
                唯一真品牌色是青绿色 <code>#00bf8a</code>，圆角紧凑（2–4px 为主，
                胶囊标签 11px），阴影微弱，画布是浅灰 <code>#e5e5e5</code>
                衬托白色内容卡片，数字统一使用 DIN-Medium 字体。
              </p>
            </div>
          </div>
          <p className="ds-overview-note">
            上方每个 tab 都是 <code>.agents/skills/project/zhangwan-design/</code>{" "}
            原始文件的直接镜像（通过 iframe 嵌入真实的 guidelines / 组件 / UI Kit
            演示页），不是重新手绘的截图——skill 更新后重新同步一次
            <code> assets/zhangwan-design/ </code>
            目录即可保持一致。右上角「导出设计文件」可下载整套 zhangwan-design 资产。
          </p>
        </section>
      );
    }

    if (active === "tokens") {
      return (
        <section className="ds-section">
          <h2>完整 Token 列表</h2>
          <p className="ds-section-sub">
            共 {manifest.tokens.length} 条，来自 tokens/colors.css、typography.css、spacing.css。
          </p>
          <TokenSwatchTable tokens={manifest.tokens} />
        </section>
      );
    }

    const group = GROUP_ORDER.find((item) => GROUP_ANCHOR[item] === active);
    if (!group) return null;
    const cards = cardsByGroup.get(group) || [];
    return (
      <section className="ds-section">
        <h2>{GROUP_LABEL[group]}</h2>
        {group === "Components" && <ComponentIndex components={manifest.components} />}
        <div className="ds-card-grid">
          {cards.map((card) => (
            <CardFrame card={card} key={card.path} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="ds-page">
      <header className="ds-topbar">
        <div className="ds-topbar-left">
          <span className="ds-topbar-mark" />
          <div className="ds-topbar-titles">
            <span className="ds-topbar-title">设计系统</span>
            <span className="ds-topbar-sub">掌玩 · zhangwan-design</span>
          </div>
        </div>
        <nav className="ds-tabs">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`ds-tab ${active === tab.id ? "is-active" : ""}`}
              onClick={() => setActive(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="ds-topbar-right">
          <button
            type="button"
            className="ds-export-btn"
            onClick={handleExport}
            disabled={!exportSkillId || exporting}
            title={exportSkillId ? "导出整个 zhangwan-design 设计文件（.zip）" : "正在准备导出…"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {exporting ? "导出中…" : "导出设计文件"}
          </button>
        </div>
      </header>

      <main className="ds-body">{renderActiveSection()}</main>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
