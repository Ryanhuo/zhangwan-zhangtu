# 标注系统完整代码（可编辑版）

本文件提供「可编辑标注系统」的完整可复制代码。生成原型时按 SKILL.md「集成步骤」依次植入。

系统由 **三段脚本** 构成，对应剥离边界：

| 脚本 | id | 只读交付版 | 作用 |
|------|----|-----------|------|
| 标注数据 | `#annotData` | 保留（保存时整体替换） | 单一 `annotations` 对象，所有标注内容的唯一数据源 |
| 查看器 | `#viewerScript` | 保留 | 动态渲染侧栏条目、角标着色、弹窗、拖动/缩放、折叠 |
| 编辑器 | `#editorScript` | **被剥离** | 进入编辑、新增标注、富文本编辑器、保存到文件、本地草稿、导出只读版 |

「导出只读版」会移除 `#editorToolbar` / `#editOverlay` / `#editorScript`，得到一个无任何编辑入口的纯展示 HTML，用于对开发交付。

---

## 一、CSS

复制到 `<style>` 中。标注层主题色由 `--annot-theme`（默认 `#1677FF`）统一驱动，独立于业务 UI 配色；编辑器内可改主题色、单条亦可覆盖 `color`。整体扁平无阴影。下方 base 规则后紧跟一段「精修皮肤」（`:root` 主题变量 + 扁平/直角/可拖宽/自适应前景色等），可整体移除回退原皮肤。

```css
/* ===== 标注系统 ===== */
.annot-marker { position: fixed; background: var(--annot-theme, #1677FF); color: #fff; box-sizing: border-box; min-width: 22px; height: 22px; padding: 0 6px; border-radius: 11px; display: inline-flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600; letter-spacing: .2px; cursor: pointer; z-index: 90; border: none; white-space: nowrap; pointer-events: auto; }
.annot-marker.in-modal { z-index: 2050; }
.annot-marker.hidden-by-host { display: none !important; }
.annot-marker.active { animation: pulse .6s ease 3; }
@keyframes pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.4); } }

.annot-sidebar { position: fixed; right: 0; top: 0; bottom: 0; width: 340px; background: #fff; border-left: 1px solid #e8ebe9; box-shadow: -2px 0 8px rgba(0,0,0,.04); z-index: 3000; transition: width .2s; display: flex; flex-direction: column; }
.annot-sidebar.collapsed { width: 40px; background: transparent; border-left: none; box-shadow: none; }
.annot-sidebar.collapsed .annot-content, .annot-sidebar.collapsed .annot-header-title, .annot-sidebar.collapsed .annot-edit-bar { display: none; }
.annot-sidebar.collapsed .annot-header { border-bottom: none; background: transparent; padding: 8px; justify-content: center; }
.annot-sidebar.collapsed #annotToggleBtn { background: var(--annot-theme, #1677FF); color: #fff; border-color: var(--annot-theme, #1677FF); }
.annot-header { padding: 12px 14px; border-bottom: 2px solid #1677FF; display: flex; align-items: center; gap: 8px; flex-shrink: 0; justify-content: space-between; }
.annot-header-title { flex: 1; font-size: 14px; font-weight: 600; }
.annot-toggle-btn { width: 24px; height: 24px; border-radius: 4px; background: #FFF0F6; color: #1677FF; display: inline-flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; border: 1px solid #1677FF; flex-shrink: 0; }
.annot-toggle-btn:hover { background: #1677FF; color: #fff; }
/* 角标显隐文字开关 */
.annot-toggle-text { width: auto; padding: 0 8px; font-size: 11px; white-space: nowrap; }
body.annot-hide-markers .annot-marker { display: none !important; }
.annot-sidebar.collapsed #annotMarkerToggle { display: none; }

/* 编辑工具条 */
.annot-edit-bar { padding: 8px 14px; border-bottom: 1px solid #f0f0f0; display: flex; gap: 6px; flex-wrap: wrap; background: #fffafc; flex-shrink: 0; }
.annot-edit-bar button { font-size: 11px; padding: 4px 8px; border-radius: 4px; cursor: pointer; border: 1px solid #1677FF; background: #fff; color: #1677FF; }
.annot-edit-bar button:hover { background: #1677FF; color: #fff; }
.annot-edit-bar button.primary { background: #1677FF; color: #fff; }
.annot-edit-bar button:disabled,
.annot-edit-bar button:disabled:hover { cursor: wait; opacity: .6; background: #1677FF; color: #fff; }
.annot-edit-bar .mode-tag { font-size: 11px; color: #94a3b8; margin-left: auto; align-self: center; }
body:not(.annot-editing) .annot-edit-bar .edit-only { display: none; }

.annot-content { flex: 1; overflow-y: auto; padding: 14px 16px; }
.annot-meta { font-size: 11px; color: #94a3b8; margin-bottom: 14px; }
.annot-item { border-left: 3px solid #1677FF; padding: 10px 14px; margin-bottom: 14px; background: #FFF0F6; border-radius: 0 4px 4px 0; cursor: pointer; transition: background .15s; }
.annot-item:hover { filter: brightness(.98); }
.annot-item-title { display: flex; align-items: center; gap: 6px; margin-bottom: 6px; flex-wrap: wrap; }
.annot-num { color: #fff; min-width: 18px; height: 18px; padding: 0 4px; border-radius: 9px; display: inline-flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; flex-shrink: 0; background: #1677FF; }
.annot-item-name { font-weight: 600; font-size: 13px; flex: 1; }
.annot-cat-tag { font-size: 10px; padding: 0 5px; border-radius: 3px; line-height: 16px; background: #fff; border: 1px solid currentColor; box-sizing: border-box; }
.annot-ref-tag { font-size: 10px; padding: 0 5px; border-radius: 3px; line-height: 16px; background: #eef1f0; color: #6b7770; font-family: ui-monospace, Menlo, monospace; }
.annot-item-edit-btn { font-size: 11px; color: #1677FF; border: 1px solid #FFB3D4; background: #fff; border-radius: 3px; padding: 0 6px; cursor: pointer; display: none; }
body.annot-editing .annot-item-edit-btn { display: inline-block; }
.annot-item-del-btn { font-size: 11px; color: #e23; border: 1px solid #f3b6b6; background: #fff; border-radius: 3px; padding: 0 6px; cursor: pointer; display: none; }
body.annot-editing .annot-item-del-btn { display: inline-block; }
body.annot-editing .annot-marker { cursor: move; }
.annot-item-detail { font-size: 12px; color: #4a5450; line-height: 1.7; }

/* 标注富文本内容的通用渲染（侧栏/弹窗/编辑器共用） */
.rt h4 { font-size: 12px; margin: 8px 0 4px; font-weight: 600; }
.rt h4:first-child { margin-top: 0; }
.rt ul, .rt ol { padding-left: 18px; margin: 4px 0; }
.rt code { background: #f5f7f6; padding: 1px 5px; border-radius: 3px; font-family: ui-monospace, Menlo, monospace; }
.rt img { max-width: 100%; border-radius: 4px; }
.rt table { border-collapse: collapse; width: 100%; margin: 6px 0; font-size: 11px; }
.rt th, .rt td { border: 1px solid #d6dbd8; padding: 4px 6px; }
.rt th { background: #fafbfb; }

/* 弹窗（可拖动 + 右下角可缩放，尺寸按条记忆） */
.annot-popup { position: fixed; background: #fff; border: 2px solid #1677FF; border-radius: 6px; box-shadow: 0 8px 24px rgba(0,0,0,.18); z-index: 3010; width: 380px; height: 320px; min-width: 260px; min-height: 160px; display: none; flex-direction: column; overflow: hidden; resize: both; }
.annot-popup.show { display: flex; }
.annot-popup-header { background: #1677FF; color: #fff; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center; cursor: move; flex-shrink: 0; }
.annot-popup-header strong { font-size: 13px; }
.annot-popup-close { cursor: pointer; padding: 0 4px; font-size: 16px; line-height: 1; }
.annot-popup-body { padding: 14px; font-size: 12px; color: #4a5450; line-height: 1.7; flex: 1; overflow: auto; }
.annot-popup-resize-hint { position: absolute; right: 2px; bottom: 1px; font-size: 12px; color: #1677FF; pointer-events: none; }

body.annot-add-mode { cursor: crosshair; }

.annot-toast { position: fixed; left: 50%; bottom: 40px; transform: translateX(-50%); background: #2c3e3a; color: #fff; padding: 10px 18px; border-radius: 6px; font-size: 13px; z-index: 4000; opacity: 0; transition: opacity .2s; pointer-events: none; }
.annot-toast.show { opacity: 1; }

/* ===== 编辑弹窗 ===== */
.annot-edit-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 5000; display: none; align-items: flex-start; justify-content: center; padding: 48px 16px; overflow: auto; }
.annot-edit-overlay.show { display: flex; }
.annot-edit-modal { background: #fff; width: 720px; max-width: 100%; border-radius: 8px; box-shadow: 0 12px 40px rgba(0,0,0,.2); display: flex; flex-direction: column; }
.annot-edit-modal .em-head { display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid #eee; }
.annot-edit-modal .em-head strong { font-size: 16px; }
.annot-edit-modal .em-close { cursor: pointer; font-size: 18px; color: #999; }
.annot-edit-modal .em-body { padding: 16px 20px; }
.annot-edit-modal .em-row { display: flex; gap: 16px; margin-bottom: 14px; }
.annot-edit-modal .em-field { flex: 1; }
.annot-edit-modal label.em-label { display: block; font-size: 13px; color: #555; margin-bottom: 6px; }
.annot-edit-modal label.em-label .hint { color: #aaa; font-weight: normal; font-size: 11px; margin-left: 6px; }
.annot-edit-modal input.em-input, .annot-edit-modal select.em-input { width: 100%; border: 1px solid #d9dee2; border-radius: 6px; padding: 8px 10px; font-size: 14px; }
.annot-edit-modal .em-color { display: flex; align-items: center; gap: 8px; border: 1px solid #d9dee2; border-radius: 6px; padding: 5px 10px; }
.annot-edit-modal .em-color input[type=color] { width: 28px; height: 24px; border: none; background: none; padding: 0; cursor: pointer; }
.annot-edit-modal .em-color input[type=text] { border: none; flex: 1; font-size: 13px; font-family: ui-monospace, Menlo, monospace; outline: none; }
.annot-edit-modal .em-foot { display: flex; justify-content: flex-end; gap: 10px; padding: 14px 20px; border-top: 1px solid #eee; }
.annot-edit-modal .em-foot button { border-radius: 6px; padding: 7px 18px; font-size: 14px; cursor: pointer; }
.annot-edit-modal .em-cancel { background: #fff; border: 1px solid #d9dee2; color: #555; }
.annot-edit-modal .em-ok { background: #1677ff; border: none; color: #fff; }
.annot-edit-modal .em-delete { margin-right: auto; background: #fff; border: 1px solid #f3b6b6; color: #e23; }
.annot-edit-modal .em-delete:hover { background: #fff0f0; }

/* 富文本编辑器 */
.rt-editor-wrap { border: 1px solid #d9dee2; border-radius: 6px; overflow: visible; }
.rt-toolbar { display: flex; flex-wrap: wrap; gap: 2px; padding: 6px; border-bottom: 1px solid #eee; background: #fafbfc; position: relative; }
.rt-toolbar button, .rt-toolbar select { font-size: 13px; min-width: 28px; height: 28px; border: 1px solid transparent; background: none; border-radius: 4px; cursor: pointer; color: #444; padding: 0 6px; }
.rt-toolbar button:hover, .rt-toolbar select:hover { background: #eef1f0; }
.rt-toolbar .sep { width: 1px; background: #e2e6e4; margin: 2px 3px; }
.rt-editor { min-height: 200px; max-height: 360px; overflow-y: auto; padding: 12px 14px; font-size: 13px; line-height: 1.7; outline: none; }
.rt-table-pop { position: absolute; top: 38px; left: 8px; background: #fff; border: 1px solid #d9dee2; border-radius: 6px; box-shadow: 0 6px 18px rgba(0,0,0,.12); padding: 10px; z-index: 10; display: none; }
.rt-table-pop.show { display: block; }
.rt-table-pop input { width: 54px; border: 1px solid #d9dee2; border-radius: 4px; padding: 4px 6px; font-size: 13px; }
.rt-table-pop button { margin-left: 6px; background: #1677ff; color: #fff; border: none; border-radius: 4px; padding: 5px 12px; cursor: pointer; }

/* ====== ANNOT REFINED SKIN START（扁平精修层，可整体移除回退原皮肤） ====== */
/* 扁平·无阴影·无渐变；主题色由 --annot-theme 统一驱动（chrome + 每条默认色），单条 color 仍可覆盖 */
:root{
  --annot-theme:#1677FF;
  --annot-theme-deep: color-mix(in srgb, var(--annot-theme) 82%, #000);
  --annot-theme-bd: color-mix(in srgb, var(--annot-theme) 34%, #fff);
  --annot-theme-bg: color-mix(in srgb, var(--annot-theme) 10%, #fff);
  --annot-sidebar-w:340px;
  --annot-theme-fg:#fff;
}

.annot-sidebar{ width:var(--annot-sidebar-w,340px); background:#fff; border-left:1px solid #E6E8EB; box-shadow:none; -webkit-font-smoothing:antialiased; }
body:not(.annot-collapsed){ padding-right: calc(var(--annot-sidebar-w,340px) + 20px); }
/* 业务居中浮层让位：展开标注面板时把常见框架的弹窗/抽屉容器整体左移，避免被侧栏遮住；折叠时仅留 60px。
   覆盖：Element-UI（el-*）、Ant Design Vue（ant-modal-wrap / ant-drawer）、Naive UI（n-modal-mask / n-drawer）、原生 <dialog>。
   其它框架按需在此列表追加。 */
body:not(.annot-collapsed) .el-dialog__wrapper,
body:not(.annot-collapsed) .el-drawer__wrapper,
body:not(.annot-collapsed) .ant-modal-wrap,
body:not(.annot-collapsed) .ant-drawer,
body:not(.annot-collapsed) .n-modal-mask,
body:not(.annot-collapsed) .n-drawer-mask,
body:not(.annot-collapsed) dialog[open] { right: calc(var(--annot-sidebar-w,340px) + 20px) !important; left:0 !important; }
body.annot-collapsed .el-dialog__wrapper,
body.annot-collapsed .el-drawer__wrapper,
body.annot-collapsed .ant-modal-wrap,
body.annot-collapsed .ant-drawer,
body.annot-collapsed .n-modal-mask,
body.annot-collapsed .n-drawer-mask,
body.annot-collapsed dialog[open] { right:60px !important; left:0 !important; }
.annot-resizer{ position:absolute; left:0; top:0; bottom:0; width:6px; cursor:ew-resize; z-index:5; }
.annot-resizer:hover, .annot-resizing .annot-resizer{ background:var(--annot-theme-bd); }
.annot-sidebar.collapsed .annot-resizer{ display:none; }
.annot-resizing, .annot-resizing *{ transition:none !important; }
.annot-item{ border-radius:0 !important; }
.annot-sidebar.collapsed{ box-shadow:none; }

.annot-header{ padding:14px 16px; background:#fff; border-bottom:1px solid #E6E8EB; }
.annot-header-title{ font-size:14px; font-weight:600; letter-spacing:.2px; color:#1F2329; display:flex; align-items:center; gap:7px; }
.annot-header-title::before{ content:''; width:7px; height:7px; border-radius:50%; background:var(--annot-theme); flex-shrink:0; }

.annot-toggle-btn{ border-radius:6px; border:1px solid var(--annot-theme-bd); background:#fff; color:var(--annot-theme); box-shadow:none; transition:background .15s, color .15s; }
.annot-toggle-btn:hover{ background:var(--annot-theme); color:#fff; }

.annot-edit-bar{ padding:9px 14px; gap:6px; background:#fff; border-bottom:1px solid #EEF0F2; align-items:center; }
.annot-edit-bar button{ border-radius:6px; border:1px solid var(--annot-theme-bd); padding:5px 10px; font-weight:500; box-shadow:none; transition:background .15s, color .15s; }
.annot-edit-bar button:hover{ background:var(--annot-theme-bg); }
.annot-edit-bar button.primary{ background:var(--annot-theme); border-color:var(--annot-theme); color:#fff; box-shadow:none; }
.annot-edit-bar button.primary:hover{ background:var(--annot-theme-deep); }
.annot-theme-ctrl{ display:inline-flex; align-items:center; gap:5px; font-size:11px; color:#5A626C; border:1px solid var(--annot-theme-bd); border-radius:6px; padding:2px 8px; }
.annot-theme-ctrl input[type=color]{ width:20px; height:18px; border:none; background:none; padding:0; cursor:pointer; }

.annot-content{ padding:14px 14px 18px; background:#fff; }
.annot-content::-webkit-scrollbar{ width:8px; }
.annot-content::-webkit-scrollbar-thumb{ background:#E2E5E9; border-radius:4px; border:2px solid transparent; background-clip:content-box; }
.annot-meta{ color:#9AA1AC; }

.annot-item{
  border:1px solid #E6E8EB; border-left-width:3px; border-left-style:solid;
  border-radius:8px; padding:11px 13px; margin-bottom:10px;
  box-shadow:none; transition:border-color .15s;
}
.annot-item:hover{ filter:none; border-color:#D6DAE0; }
.annot-num{ min-width:20px; height:20px; border-radius:5px; font-size:10px; font-weight:600; letter-spacing:.3px; box-shadow:none; }
.annot-item-name{ font-size:13px; font-weight:600; color:#1F2329; }
.annot-item-title{ align-items:flex-start; flex-wrap:nowrap; gap:8px; margin-bottom:5px; }
.annot-item-name{ flex:1; line-height:1.45; word-break:break-word; }
.annot-item-meta{ display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:7px; }
.annot-item-meta .annot-item-edit-btn{ margin-left:auto; }
.annot-cat-tag{ border-radius:3px; padding:1px 6px; font-weight:500; line-height:16px; background:#fff; border:1px solid currentColor; box-sizing:border-box; }
.annot-ref-tag{ border-radius:3px; padding:1px 6px; background:#F0F2F4; color:#6A7280; line-height:16px; }
.annot-item-edit-btn{ border-radius:4px; border:1px solid var(--annot-theme-bd); color:var(--annot-theme); padding:1px 7px; font-weight:500; }
.annot-item-edit-btn:hover{ background:var(--annot-theme-bg); }
.annot-item-del-btn{ border-radius:4px; border:1px solid #F2C2C2; padding:1px 7px; font-weight:500; }
.annot-item-del-btn:hover{ background:#FDF0F0; }
.annot-item-detail{ color:#444B53; line-height:1.7; }

/* === marker + popup 精修(elevation + ring + 渐变顶栏) === */
:root{
  --annot-elev-pop: 0 24px 48px rgba(15,23,42,.18), 0 8px 16px rgba(15,23,42,.08);
  --annot-elev-mk:  0 4px 12px rgba(15,23,42,.10), 0 2px 4px rgba(15,23,42,.06);
  --annot-elev-mk-hover: 0 12px 24px rgba(15,23,42,.14), 0 4px 8px rgba(15,23,42,.08);
  --annot-focus-ring: color-mix(in srgb, var(--annot-theme) 22%, transparent);
}
.annot-marker{
  box-shadow: 0 0 0 2px #fff, var(--annot-elev-mk);
  transition: transform .18s cubic-bezier(.2,0,0,1), box-shadow .18s cubic-bezier(.2,0,0,1);
}
.annot-marker:hover{
  transform:scale(1.08);
  box-shadow: 0 0 0 2px #fff, var(--annot-elev-mk-hover);
}
.annot-marker.active{
  outline:2px solid var(--annot-focus-ring);
  outline-offset:2px;
}

.annot-popup{
  border:1px solid #E2E8F0;
  border-radius:10px;
  box-shadow: var(--annot-elev-pop);
  overflow:hidden;
}
.annot-popup-header{
  padding:10px 14px;
  background: linear-gradient(135deg, var(--annot-theme), color-mix(in srgb, var(--annot-theme) 86%, black));
}
.annot-popup-header strong{ font-size:13px; font-weight:600; letter-spacing:.2px; }
.annot-popup-close{
  width:22px; height:22px; padding:0;
  display:inline-flex; align-items:center; justify-content:center;
  border-radius:4px; font-size:14px; line-height:1;
  color:rgba(255,255,255,.86);
  transition: background .18s, color .18s;
}
.annot-popup-close:hover{ background:rgba(255,255,255,.18); color:#fff; }
.annot-popup-body{ padding:14px 16px; font-size:13px; color:#334155; line-height:1.65; }
.annot-popup-body::-webkit-scrollbar{ width:8px; }
.annot-popup-body::-webkit-scrollbar-thumb{ background:#E2E5E9; border-radius:4px; border:2px solid transparent; background-clip:content-box; }
.annot-popup-resize-hint{
  color:#94A3B8; opacity:.35;
  transition: opacity .18s;
}
.annot-popup:hover .annot-popup-resize-hint{ opacity:.7; }
@media (prefers-reduced-motion: reduce){
  .annot-marker, .annot-popup, .annot-popup-close, .annot-popup-resize-hint{ transition:none !important; }
}

.annot-toast{ background:#1F2329; box-shadow:none; border-radius:6px; padding:10px 18px; font-weight:500; backdrop-filter:none; -webkit-backdrop-filter:none; }

.annot-edit-overlay{ background:rgba(20,22,28,.4); backdrop-filter:none; -webkit-backdrop-filter:none; }
.annot-edit-modal{ border-radius:10px; box-shadow:none; border:1px solid #E0E3E7; overflow:hidden; }
.annot-edit-modal .em-head{ padding:15px 20px; border-bottom:1px solid #EEF0F2; }
.annot-edit-modal .em-head strong{ font-size:15px; font-weight:600; color:#1F2329; }
.annot-edit-modal .em-body{ padding:16px 20px; }
.annot-edit-modal label.em-label{ font-size:12px; font-weight:500; color:#5A626C; }
.annot-edit-modal input.em-input, .annot-edit-modal select.em-input{ border:1px solid #DCE0E4; border-radius:6px; padding:8px 10px; transition:border-color .15s; }
.annot-edit-modal input.em-input:focus, .annot-edit-modal select.em-input:focus{ outline:none; border-color:var(--annot-theme); box-shadow:none; }
.annot-edit-modal .em-color{ border:1px solid #DCE0E4; border-radius:6px; }
.annot-edit-modal .em-color:focus-within{ border-color:var(--annot-theme); }
.annot-edit-modal .em-foot{ padding:13px 20px; border-top:1px solid #EEF0F2; background:#fff; }
.annot-edit-modal .em-foot button{ border-radius:6px; padding:7px 18px; font-weight:500; box-shadow:none; }
.annot-edit-modal .em-cancel:hover{ background:#F4F5F7; }
.annot-edit-modal .em-delete:hover{ background:#FDF0F0; }
.annot-edit-modal .em-ok{ background:var(--annot-theme); border:none; color:#fff; box-shadow:none; }
.annot-edit-modal .em-ok:hover{ background:var(--annot-theme-deep); }

.rt-editor-wrap{ border:1px solid #DCE0E4; border-radius:6px; }
.rt-toolbar{ background:#FAFBFC; border-bottom:1px solid #EEF0F2; padding:6px; gap:2px; }
.rt-toolbar button:hover, .rt-toolbar select:hover{ background:#EEF0F2; }
.rt-editor::-webkit-scrollbar{ width:8px; }
.rt-editor::-webkit-scrollbar-thumb{ background:#E2E5E9; border-radius:4px; border:2px solid transparent; background-clip:content-box; }
.rt-table-pop{ box-shadow:none; border:1px solid #DCE0E4; }
.rt-table-pop button{ background:var(--annot-theme); border-radius:5px; }
/* 按钮悬浮：浅色主题底 + 主题色文字/描边（参考主按钮悬浮态） */
.annot-toggle-btn:hover{ background:var(--annot-theme-bg); color:var(--annot-theme); }
.annot-edit-bar button:hover{ background:var(--annot-theme-bg); color:var(--annot-theme); border-color:var(--annot-theme); }
.annot-edit-bar button.primary{ color:var(--annot-theme-fg); }
.annot-edit-bar button.primary:hover{ background:var(--annot-theme-bg); color:var(--annot-theme); border-color:var(--annot-theme); }
/* 标注详情表格表头：默认灰色（不跟随主题） */
.rt table thead tr{ background:#F4F5F7 !important; }
.rt thead th{ border-bottom-color:#D9DCE1 !important; }
/* ====== ANNOT REFINED SKIN END ====== */
```

内容区适配（业务页面 body 或 `.content` 容器）：

```css
body { padding-right: 360px; transition: padding-right .2s; }
body.annot-collapsed { padding-right: 60px; }
```

---

## 二、HTML 模板

### 2.1 角标（放在被标注区域内）

父容器需 `position: relative`，角标绝对定位到右上角：

```html
<div class="card" style="position:relative;">
  <span class="annot-marker" data-annot="1" style="top:-8px;right:10px;">1</span>
  <!-- 被标注的业务 UI -->
</div>
```

**角标绝不能挤占原型布局**：它必须是绝对定位的覆盖层，绝不占据行内/flex 布局空间把相邻控件挤走。当被标注的是行内/flex 行里的单个元素（如某个按钮）、自身又不是定位容器时，**包一层 relative 容器**再绝对定位，而不是让角标行内排布：

```html
<span style="position:relative; display:inline-flex;">
  <button>新增书籍</button>
  <span class="annot-marker" data-annot="6" style="top:-8px; right:-8px;">6</span>
</span>
```

`data-annot` 的值即标注编号，与 `annotations` 对象的 key 一一对应——为从上到下的顺序整数（`1, 2, 3 …`），角标直接显示它；PRD 编号见 `ref` 字段，不进角标。

### 2.2 标注侧栏

`#annotList` 是**空容器**，条目由 `#viewerScript` 的 `renderAllItems()` 动态渲染——不要手写 `annot-item`。

```html
<aside class="annot-sidebar" id="annotSidebar">
  <div class="annot-header">
    <span class="annot-header-title">原型说明</span>
    <span class="annot-toggle-btn annot-toggle-text" id="annotMarkerToggle" title="显示/隐藏页面角标">隐藏角标</span>
    <span class="annot-toggle-btn" id="annotToggleBtn" title="折叠/展开">›</span>
  </div>
  <div class="annot-edit-bar" id="editorToolbar">
    <button id="btnEnterEdit">✎ 编辑</button>
    <button class="edit-only" id="btnAdd">＋ 新增标注</button>
    <button class="edit-only primary" id="btnSave">◉ 保存到文件</button>
    <button class="edit-only" id="btnResavePath" title="切换/重选保存位置（Cmd/Ctrl+S 仍走当前位置）">▤ 保存位置</button>
    <button class="edit-only" id="btnExport">↗ 导出只读版</button>
    <label class="edit-only annot-theme-ctrl" title="标注层主题色（含每条默认色）">主题色 <input type="color" id="annotThemeColor"></label>
    <button class="edit-only" id="btnExitEdit">退出</button>
    <span class="mode-tag" id="modeTag">查看模式</span>
  </div>
  <div class="annot-content" id="annotContent">
    <div class="annot-meta">v1.0 · 模块名</div>
    <div id="annotList"></div>
    <div style="margin-top:20px;padding-top:14px;border-top:1px dashed #e2e8f0;font-size:11px;color:#94a3b8;line-height:1.65;">
      点击编号 → 弹出说明卡片（可拖动、右下角可缩放）<br>
      点击「✎ 编辑」进入编辑模式，可改/增标注、改主题色；改完点「保存到文件」落盘（编辑态 Cmd/Ctrl+S 亦可）<br>
      拖面板左缘可调宽，点击右上角 ›/‹ 折叠/展开本栏<br>
      对外交付请用「导出只读版」，剥离编辑功能
    </div>
  </div>
</aside>
```

### 2.3 标注弹窗（全局一个）

```html
<div class="annot-popup" id="popup">
  <div class="annot-popup-header"><strong id="popup-title">标题</strong><span class="annot-popup-close" onclick="closeAnnotPopup()">✕</span></div>
  <div class="annot-popup-body rt" id="popup-body"></div>
  <span class="annot-popup-resize-hint">⤡</span>
</div>
```

### 2.4 编辑弹窗 + 富文本工具栏（只读版会被剥离）

```html
<div class="annot-edit-overlay" id="editOverlay">
  <div class="annot-edit-modal">
    <div class="em-head"><strong id="emTitle">编辑标注</strong><span class="em-close" id="emClose">✕</span></div>
    <div class="em-body">
      <div class="em-row">
        <div class="em-field">
          <label class="em-label">标题</label>
          <input class="em-input" id="emTitleInput" placeholder="如：人员列表 — 字段说明">
        </div>
      </div>
      <div class="em-row">
        <div class="em-field">
          <label class="em-label">分类</label>
          <select class="em-input" id="emCategory"></select>
        </div>
        <div class="em-field">
          <label class="em-label">标注颜色 <span class="hint">不填则用默认色</span></label>
          <div class="em-color">
            <input type="color" id="emColorPicker">
            <input type="text" id="emColorText" placeholder="#1677FF（默认）">
          </div>
        </div>
      </div>
      <div class="em-row">
        <div class="em-field">
          <label class="em-label">PRD / SRS 编号 <span class="hint">与 PRD 条目对应</span></label>
          <input class="em-input" id="emRef" placeholder="如：PRD 3.5.1.1">
        </div>
        <div class="em-field"></div>
      </div>
      <div class="em-row">
        <div class="em-field">
          <label class="em-label">内容</label>
          <div class="rt-editor-wrap">
            <div class="rt-toolbar" id="rtToolbar">
              <select id="rtFontSize" title="字号"><option value="">字号</option><option value="2">小</option><option value="3">正常</option><option value="5">大</option><option value="6">特大</option></select>
              <span class="sep"></span>
              <button data-cmd="bold" title="加粗"><b>B</b></button>
              <button data-cmd="italic" title="斜体"><i>I</i></button>
              <button data-cmd="code" title="行内代码">&lt;&gt;</button>
              <span class="sep"></span>
              <button data-cmd="fore" title="字体颜色"><span style="color:#1677FF;font-weight:bold;">A</span></button>
              <button data-cmd="hilite" title="高亮"><span style="background:#ffe58f;padding:0 2px;">A</span></button>
              <button data-cmd="removeFormat" title="清除格式">🧹</button>
              <span class="sep"></span>
              <button data-cmd="ul" title="无序列表">•≡</button>
              <button data-cmd="ol" title="有序列表">1.≡</button>
              <span class="sep"></span>
              <button data-cmd="table" title="插入表格">▦</button>
              <button data-cmd="rowAdd" title="下方插入行">＋行</button>
              <button data-cmd="colAdd" title="右侧插入列">＋列</button>
              <button data-cmd="rowDel" title="删除行">－行</button>
              <button data-cmd="colDel" title="删除列">－列</button>
              <span class="sep"></span>
              <button data-cmd="image" title="插入图片">🖼</button>
              <div class="rt-table-pop" id="rtTablePop">
                行 <input type="number" id="rtRows" value="3" min="1"> 列 <input type="number" id="rtCols" value="3" min="1">
                <button id="rtTableInsert">插入</button>
              </div>
            </div>
            <div class="rt-editor rt" id="rtEditor" contenteditable="true"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="em-foot">
      <button class="em-delete" id="emDelete" style="display:none;">删除标注</button>
      <button class="em-cancel" id="emCancel">取消</button>
      <button class="em-ok" id="emOk">确定</button>
    </div>
  </div>
</div>

<div class="annot-toast" id="toast"></div>
```

### 2.5 SPA bootstrap（Vue / React 等框架原型必加,v1.3.0 简化）

当原型用 Vue/React 等框架挂载到 `#app` 时,必须在框架脚本**之前**插入下面这段 bootstrap。它做三件事:

1. 把 `#app` 源模板抓到 `window.__ANNOT_APP_TEMPLATE__`(保存时 `buildHtml` 用它覆盖渲染后的 DOM,避免烤死 `@click` / `:visible.sync` / `v-if` / `<el-*>` 指令)
2. 提供**默认** ctx 钩子,按以下顺序自动推断:
   - vm 上常见字段名(`currentView` / `activeView` / `currentTab` / `activeTab` / `activeStep` / `currentStep` / `currentSection`)
   - `#app` 元素的 `data-view` / `data-tab` 属性
   - 找不到就返回 `''`(等同没 ctx)
3. 项目侧若默认推断不准,可在框架脚本前再覆写 `window.__ANNOT_VIEW_CTX__` / `window.__ANNOT_TAB_CTX__` —— 钩子已经存在,直接重新赋值即可

**绝大多数项目复制这一段就够,无需改任何字段名。**

```html
<!-- 必须位于业务框架脚本（new Vue / ReactDOM.render 等）之前 -->
<script>
(function () {
  var ROOT_ID = 'app';   // ← 唯一可能需要改的:业务根 ID 不是 #app 时同步改这里 + buildHtml 里的 #app 选择器
  var a = document.getElementById(ROOT_ID);
  window.__ANNOT_APP_TEMPLATE__ = a ? a.innerHTML : null;

  var VIEW_KEYS = ['currentView', 'activeView', 'currentSection', 'section'];
  var TAB_KEYS  = ['activeTab', 'currentTab', 'tab', 'activeStep', 'currentStep', 'step'];
  function readCtx(keys, attr) {
    var el = document.getElementById(ROOT_ID); if (!el) return '';
    var vm = el.__vue__;
    if (vm) { for (var i = 0; i < keys.length; i++) { var v = vm[keys[i]]; if (typeof v === 'string' && v) return v; } }
    var attrVal = el.getAttribute('data-' + attr);
    return attrVal || '';
  }
  /* v1.3.0:默认实现,按常见字段名 + data-attr 自动推断;项目侧可在本脚本之后覆写 */
  window.__ANNOT_VIEW_CTX__ = function () { return readCtx(VIEW_KEYS, 'view'); };
  window.__ANNOT_TAB_CTX__  = function () { return readCtx(TAB_KEYS,  'tab');  };
})();
</script>
```

- **纯静态 HTML 原型可省略整段**;`buildHtml` 检测到 `window.__ANNOT_APP_TEMPLATE__` 不是字符串时自动跳过。
- 业务框架根容器不是 `#app` 时,改 `ROOT_ID` 常量即可;同时把 `#editorScript.buildHtml` 里的 `clone.querySelector('#app')` 同步改成对应 ID。
- **v1.3.0 起角标不再写进 `#app` 源模板**,所有位置由 `annotations[id].pos` 派生;`buildHtml` 会先剥掉模板里残留的硬编码角标(向后兼容)、再按 pos 单遍重建。
- 项目 vm 上视图/tab 字段名不在 `VIEW_KEYS` / `TAB_KEYS` 默认列表里时,在 bootstrap 脚本**之后**直接覆写:
  ```js
  window.__ANNOT_VIEW_CTX__ = function () {
    var vm = document.getElementById('app').__vue__;
    return vm ? (vm.myViewField || '') : '';
  };
  ```

---

## 三、JS — 三段脚本

按顺序放在 `</body>` 前。

### 3.1 标注数据 `#annotData`

用 `var`（不可用 `const`——草稿恢复/保存需重新赋值）。`/*ANNOT_DATA_START/END*/` 标记用于保存时整体替换，**勿删**。

数据字段：`{ title, category, color, ref, detail }`；运行期弹窗缩放会附加 `w` / `h`。

- `title` — 条目标题
- `category` — 分类，取值 `列表 / 弹窗 / 页签 / 筛选 / 表单 / 操作 / 其他` 之一或空（非必填）
- `color` — 该条标注色，空则用默认色 `#1677FF`
- `ref` — 对应 PRD/SRS 编号，如 `PRD 3.1.1`
- `detail` — 富文本 HTML（用 `.rt` 渲染）

```html
<script id="annotData">
/*ANNOT_DATA_START*/
var annotations = {
  "1": {
    "title": "筛选区",
    "category": "筛选",
    "color": "",
    "ref": "PRD 3.1.1",
    "detail": "<h4>筛选项</h4><ul><li>名称：输入框，模糊搜索</li><li>状态：下拉，枚举 全部/启用/禁用，默认全部</li></ul><h4>交互</h4><ul><li>点击查询后筛选；重置恢复默认</li></ul>"
  },
  "2": {
    "title": "列表",
    "category": "列表",
    "color": "",
    "ref": "PRD 3.1.2",
    "detail": "<table><thead><tr><th>列名</th><th>类型</th><th>说明</th></tr></thead><tbody><tr><td>名称</td><td>文本</td><td>-</td></tr><tr><td>状态</td><td>状态标签</td><td>启用/禁用</td></tr></tbody></table><p>每页 20 条，按创建时间倒序；为空时展示空状态。</p>"
  }
};
/*ANNOT_DATA_END*/
</script>
```

> 初始数据可用可读的 JS 对象书写；一旦在页面内编辑并保存，数据块会被替换为 `JSON.stringify` 的格式（带转义）。这是预期取舍。

### 3.2 查看器 `#viewerScript`（只读版保留）

```html
<script id="viewerScript">
var DEFAULT_COLOR = (getComputedStyle(document.documentElement).getPropertyValue('--annot-theme') || '').trim() || '#1677FF';
var CATEGORIES = ['列表', '弹窗', '页签', '筛选', '表单', '操作', '其他'];
function annotColor(a) { return a.color || DEFAULT_COLOR; }
var nextId = 1;

// v1.2.0 起 modalAnnotIds 降级为兼容/兜底字段:默认空数组,bindItem 优先按 pos.container + containerOpeners 自动联动。
// 仅当某标注既无 pos 又找不到 opener 时,才回退到 modalAnnotIds + openModalFor 这套老路径。
var modalAnnotIds = [];
// 兜底实现:某标注没 pos.container 也没专门的 opener 时,viewer 会调它。Vue/SPA 原型可调一个公共起点(如回主视图)。
function openModalFor(id) {
  /* e.g. var vm = document.getElementById('app').__vue__; if (vm) vm.goHome(); */
}

// 与 data-annot-container 配套:键 = 承接容器名(或复合 key `container@viewCtx` / `container@tabCtx`),值 = 让该容器可见的函数。
// 编辑器 add-mode 命中容器时,把容器名写进 annotations[id].pos.container,把 view/tab 上下文写进 pos.viewCtx/tabCtx。
// 点侧栏条目时 viewer 按 pos 自动查 opener,无需用户手选。
//
// 复合 key 查找顺序(由 bindItem 自动判断):
//   1. container@viewCtx  → 同 dialog 出现在多视图入口时区分(如 'dialog-log@view-execution-record')
//   2. container@tabCtx   → 同 container 出现在多 tab 时区分(如 'dialog-start@drama')
//   3. container          → 单视图兜底
//
// 注册示例:
//   containerOpeners['dialog-log']                       = function () { var vm=document.getElementById('app').__vue__; vm.openLog(vm.rows[0]); };
//   containerOpeners['dialog-log@view-execution-record'] = function () {
//     var vm = document.getElementById('app').__vue__;
//     vm.goExecutionRecord(vm.rows[0]);
//     setTimeout(function () { vm.openLog(vm.er.rows[0], 'record'); }, 80);
//   };
//
// 行匹配规范(opener 内部务必遵守):弹窗按 row 字段做 v-if 切换字段时,opener 不能用 vm.rows[0],
// 必须挑能让 v-if 渲染出全部字段的 row。否则用户点条目打开的弹窗,字段会与他打标当时看到的对不上。
//   例:vm.openStartSettle(vm.rows.find(r => r.sett_supply_type_text === '合作方' && r.run_type === '2') || vm.rows[0]);
var containerOpeners = { /* 'dialog-log': function () { var vm=document.getElementById('app').__vue__; vm.openLog(vm.rows[0]); } */ };

// 切条目前关业务遮罩:第一行调它,关 popup + 项目所有 dialog/drawer。否则切到另一条标注后旧弹窗仍盖在新位置上。
// v1.3.0 起改为「约定式发现」:遍历 vm 上所有以 Dialog/Drawer/Modal/Popup 结尾、且值是含 visible 字段的对象,
// 一律将 visible 置 false。这样项目侧无需再手改字段名列表,新增 dialog 自动覆盖。
// 若项目命名不遵循约定(如直接叫 vm.popoverA),可挂 window.__ANNOT_CLOSE_OVERLAYS__ = function(vm){...} 自定义。
function _closeAllBusinessOverlays() {
  try { closeAnnotPopup(); } catch (e) {}
  try {
    var vm = document.getElementById('app') && document.getElementById('app').__vue__;
    if (!vm) return;
    if (typeof window.__ANNOT_CLOSE_OVERLAYS__ === 'function') { window.__ANNOT_CLOSE_OVERLAYS__(vm); return; }
    Object.keys(vm).forEach(function (k) {
      if (!/(Dialog|Drawer|Modal|Popup)$/.test(k)) return;
      var v = vm[k];
      if (v && typeof v === 'object' && 'visible' in v && v.visible) v.visible = false;
    });
  } catch (e) {}
}

function renderItem(id) {
  var a = annotations[id];
  var c = annotColor(a);
  var item = document.createElement('div');
  item.className = 'annot-item';
  item.dataset.annotTarget = id;
  item.style.borderLeftColor = c;
  item.style.background = c + '14';
  item.innerHTML =
    '<div class="annot-item-title">' +
      '<span class="annot-num" style="background:' + c + ';color:' + fgOn(c) + '">' + id + '</span>' +
      '<span class="annot-item-name">' + (a.title || '') + '</span>' +
    '</div>' +
    '<div class="annot-item-meta">' +
      (a.category ? '<span class="annot-cat-tag" style="color:' + c + ';border-color:' + c + '">' + a.category + '</span>' : '') +
      (a.ref ? '<span class="annot-ref-tag">' + a.ref + '</span>' : '') +
      '<span class="annot-item-edit-btn">编辑</span>' +
      '<span class="annot-item-del-btn">删除</span>' +
    '</div>' +
    '<div class="annot-item-detail rt" id="detail-' + id + '">' + a.detail + '</div>';
  bindItem(item);
  return item;
}
function highlightMarker(id) {
  var m = document.querySelector('.annot-marker[data-annot="' + id + '"]');
  if (!m) return;
  m.scrollIntoView({ behavior: 'smooth', block: 'center' });
  m.classList.remove('active');
  setTimeout(function () { m.classList.add('active'); }, 50);
  setTimeout(function () { m.classList.remove('active'); }, 2000);
}
function bindItem(item) {
  item.addEventListener('click', function (e) {
    if (e.target.closest('.annot-item-edit-btn') || e.target.closest('.annot-item-del-btn')) return;
    var id = item.dataset.annotTarget;
    // 切条目前关掉旧 popup + 业务弹窗/抽屉,否则盖在新位置上看起来"没关"
    _closeAllBusinessOverlays();
    /* 联动优先级:
       ① annotations[id].opener (兼容字段,旧版本由用户手选)
       ② annotations[id].pos.container + '@' + viewCtx (多视图入口共用同一弹窗时区分)
       ③ annotations[id].pos.container + '@' + tabCtx  (多 tab 共用同一容器时区分)
       ④ annotations[id].pos.container (单视图兜底)
       ⑤ 退到 modalAnnotIds + openModalFor (老字段) 或普通 highlight */
    var a = annotations[id];
    var pos = a && a.pos;
    var explicit = a && a.opener;
    var openerKey = '';
    if (explicit) openerKey = explicit;
    else if (pos && pos.container) {
      var cands = [];
      if (pos.viewCtx) cands.push(pos.container + '@' + pos.viewCtx);
      if (pos.tabCtx)  cands.push(pos.container + '@' + pos.tabCtx);
      cands.push(pos.container);
      for (var ci = 0; ci < cands.length; ci++) {
        if (typeof containerOpeners !== 'undefined' && containerOpeners[cands[ci]]) { openerKey = cands[ci]; break; }
      }
    }
    var opener = (openerKey && typeof containerOpeners !== 'undefined' && containerOpeners[openerKey]) ? containerOpeners[openerKey] : null;
    /* 即便没专门的 tab@opener,只要标注记录了 tabCtx,也先把 tab 切回去 */
    if (opener && pos && pos.tabCtx) {
      try {
        var vmTab = document.getElementById('app').__vue__;
        if (vmTab && 'activeTab' in vmTab) vmTab.activeTab = pos.tabCtx;
      } catch (er) {}
    }
    if (opener || modalAnnotIds.indexOf(id) !== -1) {
      // 优先 container opener;否则退到老 modalAnnotIds 路径
      if (opener) opener();
      else openModalFor(id);
      /* opener 改了 currentView / activeTab → Vue 异步 patch,host 这时还没出现/未可见。
         两阶段 reconcile + 延后 highlight:rAF 一拍跑一次(catch 同步 patch),320ms 再跑一次
         (catch el-tabs 切换动画后的稳定布局),最后再 highlight。 */
      requestAnimationFrame(function () { scheduleReconcile(); });
      setTimeout(function () {
        scheduleReconcile();
        var t = document.querySelector('.annot-marker[data-annot="' + id + '"]');
        if (t) { var d = t.closest('details'); if (d && !d.open) d.open = true; }
        highlightMarker(id);
      }, 320);
    } else {
      highlightMarker(id);
    }
  });
  var eb = item.querySelector('.annot-item-edit-btn');
  if (eb) eb.addEventListener('click', function (e) { e.stopPropagation(); if (window.openEditor) window.openEditor(item.dataset.annotTarget); });
  var db = item.querySelector('.annot-item-del-btn');
  if (db) db.addEventListener('click', function (e) { e.stopPropagation(); if (window.deleteAnnot) window.deleteAnnot(item.dataset.annotTarget); });
}
/* document 级 click delegation 兜底:即便个别 marker 因 reconcile 时序未 bindMarker 上 listener,
   这里也能保证点击弹 popup。用 _justDragged + _popupOpenedAt 与 bindMarker 去重。 */
document.addEventListener('click', function (e) {
  var m = e.target.closest && e.target.closest('.annot-marker');
  if (!m) return;
  if (m._justDragged) { m._justDragged = false; return; }
  if (document.body.classList.contains('annot-add-mode')) return;
  if (document.body.classList.contains('annot-editing')) return;   // 编辑态由 bindMarker 控制(drag 区分)
  if (m._popupOpenedAt && (Date.now() - m._popupOpenedAt) < 80) return;   // 跟 bindMarker 的 click 去重
  showAnnotPopup(m.dataset.annot, e);
});
function bindMarker(m) {
  var drag = null;
  m.addEventListener('mousedown', function (e) {
    if (e.button !== 0) return;
    if (!document.body.classList.contains('annot-editing')) return;   // 仅编辑模式可拖动
    if (document.body.classList.contains('annot-add-mode')) return;
    e.preventDefault(); e.stopPropagation();
    /* marker 是 fixed 挂 body：用 viewport 坐标做拖动起点 */
    var r = m.getBoundingClientRect();
    drag = { x: e.clientX, y: e.clientY, left: r.left, top: r.top, moved: false };
    m._dragging = true;   /* 关键：阻止 reconcileMarkers 在 MO 抖动时把正在拖的角标瞬间投影回原坐标 */
  });
  document.addEventListener('mousemove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 4) return;       // 阈值：区分点击与拖动
    drag.moved = true;
    m.style.position = 'fixed';
    m.style.left = (drag.left + dx) + 'px';
    m.style.top  = (drag.top  + dy) + 'px';
    m.style.right = 'auto'; m.style.bottom = 'auto';
  });
  document.addEventListener('mouseup', function () {
    if (!drag) return;
    if (drag.moved) {
      m._justDragged = true;
      /* 兜底清理：若鼠标 mouseup 后没在该 marker 上 click（移走了），_justDragged 会卡 true 致下次点击不弹窗。
         给 click 事件 0ms 微任务时间消费完后强制清掉。 */
      setTimeout(function () { m._justDragged = false; }, 0);
      if (window.recordMarkerMove) {
        /* viewport 坐标换回 host 局部坐标存进 annotations.pos */
        var host = m._host;
        if (host) {
          var hr = host.getBoundingClientRect();
          var r = m.getBoundingClientRect();
          window.recordMarkerMove(m.dataset.annot, Math.round(r.left - hr.left), Math.round(r.top - hr.top));
        }
      }
    }
    drag = null;
    m._dragging = false;
  });
  m.addEventListener('click', function (e) {
    e.stopPropagation();
    if (m._justDragged) { m._justDragged = false; return; }           // 拖动结束的 click 不弹窗
    if (document.body.classList.contains('annot-add-mode')) return;
    m._popupOpenedAt = Date.now();   /* 标记本次已弹，document 级兜底 delegation 在 80ms 内跳过，避免双触发 */
    showAnnotPopup(m.dataset.annot, e);
  });
}
function fgOn(hex) {
  hex = (hex || '').trim().replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(function (x) { return x + x; }).join('');
  var r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return '#fff';
  var L = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return L > 0.62 ? '#1F2329' : '#fff';
}
function applyMarkerColors() {
  document.querySelectorAll('.annot-marker').forEach(function (m) {
    var a = annotations[m.dataset.annot] || annotations[m.dataset.annot.replace(/b$/, '')];
    if (a) { m.style.background = annotColor(a); m.style.color = fgOn(annotColor(a)); }
  });
}
function renderAllItems() {
  var list = document.getElementById('annotList');
  list.innerHTML = '';
  Object.keys(annotations).forEach(function (id) {
    list.appendChild(renderItem(id));
    var n = parseInt(id, 10);
    if (!isNaN(n) && n >= nextId) nextId = n + 1;
  });
}
function showAnnotPopup(id, e) {
  // 别名兼容：角标 "2.5b" 复用 "2.5" 的内容
  var realId = annotations[id] ? id : id.replace(/b$/, '');
  var a = annotations[realId]; if (!a) return;
  var popup = document.getElementById('popup');
  popup.dataset.annot = realId;
  popup._applyingSize = true;
  popup.style.width = (a.w || 380) + 'px';
  popup.style.height = (a.h || 320) + 'px';
  /* popup 边框 / 顶栏样式由 CSS 控制(--annot-theme 驱动渐变),不再 inline 覆盖 */
  document.getElementById('popup-title').textContent = realId + '. ' + a.title + (a.ref ? '  (' + a.ref + ')' : '');
  document.getElementById('popup-body').innerHTML = a.detail;
  popup.classList.add('show');
  var sidebarW = document.getElementById('annotSidebar').offsetWidth || 340;
  var left = Math.min((e.clientX || 300) + 16, window.innerWidth - 400 - sidebarW);
  var top = Math.min((e.clientY || 200), window.innerHeight - 360);
  popup.style.left = Math.max(20, left) + 'px';
  popup.style.top = Math.max(20, top) + 'px';
}
function closeAnnotPopup() { document.getElementById('popup').classList.remove('show'); }

var sidebar = document.getElementById('annotSidebar');
var toggleBtn = document.getElementById('annotToggleBtn');
toggleBtn.addEventListener('click', function (e) {
  e.stopPropagation();
  sidebar.classList.toggle('collapsed');
  document.body.classList.toggle('annot-collapsed');
  toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '‹' : '›';
});

/* 角标显隐切换：隐藏/显示页面上的所有编号角标（视图态亦可用，偏好存 localStorage） */
var markerToggle = document.getElementById('annotMarkerToggle');
if (markerToggle) {
  var MK_KEY = 'annotHideMarkers:' + location.pathname;
  function syncMarkerToggle() {
    var hidden = document.body.classList.contains('annot-hide-markers');
    markerToggle.textContent = hidden ? '显示角标' : '隐藏角标';
    markerToggle.title = hidden ? '显示页面角标' : '隐藏页面角标';
  }
  try { if (localStorage.getItem(MK_KEY) === '1') document.body.classList.add('annot-hide-markers'); } catch (e) {}
  syncMarkerToggle();
  markerToggle.addEventListener('click', function (e) {
    e.stopPropagation();
    var hidden = document.body.classList.toggle('annot-hide-markers');
    try { localStorage.setItem(MK_KEY, hidden ? '1' : '0'); } catch (x) {}
    syncMarkerToggle();
  });
}

var popup = document.getElementById('popup');
var popupHeader = popup.querySelector('.annot-popup-header');
var dragging = false, offX = 0, offY = 0;
popupHeader.addEventListener('mousedown', function (e) { dragging = true; var r = popup.getBoundingClientRect(); offX = e.clientX - r.left; offY = e.clientY - r.top; e.preventDefault(); });
document.addEventListener('mousemove', function (e) { if (!dragging) return; popup.style.left = (e.clientX - offX) + 'px'; popup.style.top = (e.clientY - offY) + 'px'; });
document.addEventListener('mouseup', function () { dragging = false; });
document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAnnotPopup(); });

// 弹窗缩放：尺寸写回当前条目，互不影响
if (window.ResizeObserver) {
  new ResizeObserver(function () {
    if (popup._applyingSize) { popup._applyingSize = false; return; }
    if (!popup.classList.contains('show')) return;
    var a = annotations[popup.dataset.annot];
    if (a) { a.w = popup.offsetWidth; a.h = popup.offsetHeight; }
  }).observe(popup);
}

function toast(msg) { var t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('show'); }, 1800); }

/* ===== 单一数据源：annotations[id].pos = { container, left|right, top|bottom, viewCtx?, tabCtx? } =====
   所有 marker DOM 由 renderMarker 从 annotations.pos 派生。

   关键架构（v1.2.0）：marker **挂在 body 顶层、position:fixed**，按 host(data-annot-container) 的
   getBoundingClientRect() 动态投影到屏幕坐标。marker 不进业务子树（#app 内的 Vue/React 管辖范围）。
   动机：Vue v-if 切换时跑 vnode patch → parent.insertBefore(newNode, refChild)；如果 marker 待在
   Vue 管理的 DOM 里，Vue 会把它当成陌生 anchor → 抛 "Failed to execute 'insertBefore'... not a child of this node"。
   marker 撤出业务子树后 Vue 永远见不到它 → 这类错根除。
   代价：要监听 resize / scroll(capture) / MO 重投影；坐标语义改为 viewport（非 host 相对）。

   渲染管线整段必须先定义、再走 bootstrap —— renderMarker 是表达式赋值(window.renderMarker = function…)
   无函数 hoisting，bootstrap 里的 migrateBakedMarker 会调它。先 bootstrap 后定义会 ReferenceError。 */

function _deepFindLastContainer(name) {
  /* 同 container 名可能出现在多个视图分支里（弹窗内 + 列表上）——取「最后一个可见」对应当前激活视图。
     viewCtx/tabCtx 的去歧义在 renderMarker 头部 + bindItem 复合 key 解决，这里只负责"挑一个仍挂载且可见的 host"。
     找不到 visible 的就返回 null：marker 不该投到 display:none 的 host 上（bbox=(0,0,0,0) 会让 marker 漂到屏幕左上角）。 */
  var hosts = document.querySelectorAll('[data-annot-container="' + name + '"]');
  for (var i = hosts.length - 1; i >= 0; i--) {
    var h = hosts[i];
    if (h.offsetParent !== null || getComputedStyle(h).position === 'fixed') return h;
  }
  return null;
}

/* pos 偏移字段优先级：right > left（互斥）、bottom > top（互斥）。
   right/bottom 锚 = "贴 host 某条边"语义，host 宽高变化时自动跟随（烤入页 right:10px;top:8px 这种贴右上角的角标 resize 不飘）。
   left/top = "距 host 左上角 X px"语义，用户拖出来的角标默认走这套（明确指定的坐标）。 */
function _localXY(pos, host) {
  var hostRect = host.getBoundingClientRect();
  var mw = 28, mh = 22; /* marker 近似尺寸 —— right/bottom 时不必精确测量 */
  var lx = (pos.right  != null) ? (hostRect.width  - pos.right  - mw) : (pos.left || 0);
  var ly = (pos.bottom != null) ? (hostRect.height - pos.bottom - mh) : (pos.top  || 0);
  return { left: hostRect.left + lx, top: hostRect.top + ly, hostRect: hostRect };
}

function _hostInModal(host) {
  /* 判断 host 是否在业务弹窗/抽屉栈里 —— marker 要提高 z-index 才能浮在 modal 之上。
     根据所用 UI 库扩充选择器；下方覆盖 Element-UI / Ant / Naive / 原生 dialog。 */
  return !!host.closest('.el-dialog__wrapper, .el-drawer__wrapper, .v-modal-mask, .ant-modal-wrap, .ant-drawer, .n-modal-mask, .n-drawer-mask, dialog[open]');
}

window.renderMarker = function (id) {
  var a = annotations[id];
  var existing = document.querySelector('.annot-marker[data-annot="' + id + '"]');
  if (!a || !a.pos) { if (existing && !existing._dragging) existing.remove(); return null; }
  /* viewCtx / tabCtx 去歧义：同 container 名出现在多个视图/Tab 时，当前视图与 pos 记的不一致就根本不投。
     不加这层，_deepFindLastContainer 只按 name 找会把 list 视图的 marker 投到 detail 的同名 container 上。 */
  if (a.pos.viewCtx && typeof window.__ANNOT_VIEW_CTX__ === 'function') {
    var curView = String(window.__ANNOT_VIEW_CTX__() || '');
    if (curView && curView !== a.pos.viewCtx) { if (existing && !existing._dragging) existing.remove(); return null; }
  }
  if (a.pos.tabCtx && typeof window.__ANNOT_TAB_CTX__ === 'function') {
    var curTab = String(window.__ANNOT_TAB_CTX__() || '');
    if (curTab && curTab !== a.pos.tabCtx) { if (existing && !existing._dragging) existing.remove(); return null; }
  }
  var host = _deepFindLastContainer(a.pos.container);
  if (!host) { if (existing && !existing._dragging) existing.remove(); return null; /* 视图未挂载 → 等下次 reconcile */ }
  var m = existing;
  if (!m) {
    m = document.createElement('span');
    m.className = 'annot-marker'; m.dataset.annot = id; m.textContent = id;
    m.style.position = 'fixed';
    document.body.appendChild(m);
    m._annotBound = true; bindMarker(m);
  } else if (m.parentElement !== document.body) {
    /* 升级路径：v1.1.x 老页面 marker 还挂在 host 里，拎回 body 顶层 */
    document.body.appendChild(m);
  }
  m._host = host;
  if (!m._dragging) {
    var xy = _localXY(a.pos, host);
    m.style.left = Math.round(xy.left) + 'px';
    m.style.top  = Math.round(xy.top)  + 'px';
  }
  m.classList.toggle('in-modal', _hostInModal(host));
  m.classList.remove('hidden-by-host');
  paintMarker(m, a);
  return m;
};

function paintMarker(m, a) {
  var bg = annotColor(a); m.style.background = bg; m.style.color = fgOn(bg);
}

/* 把页面内硬编码 <span class="annot-marker" data-annot="N" style="..."> 迁移进 annotations[N].pos
   （首次进入：模板里残留的硬编码 marker 当种子录入，随即 renderMarker 在 body 顶层重建覆盖层版本） */
function migrateBakedMarker(m) {
  var id = m.dataset.annot; var a = annotations[id];
  if (!a) { m.remove(); return; }
  if (a.pos) { m.remove(); return; /* pos 已存在，老 baked DOM 直接撤 —— body 顶层 renderMarker 会建覆盖层版本 */ }
  var host = m.closest('[data-annot-container]');
  if (!host) return; /* 无承接容器，留给 reconcile 清理 */
  /* 锚优先：取内联 style 上的 right/bottom/left/top（烤入页常见 right:10px;top:-8px 贴右上角）。
     有锚就保留锚；没锚才退到 px 截屏。 */
  var s = m.style;
  function pxOf(v) { var n = parseFloat(v); return isNaN(n) ? null : Math.round(n); }
  var right = pxOf(s.right), bottom = pxOf(s.bottom), left = pxOf(s.left), top = pxOf(s.top);
  var pos = { container: host.dataset.annotContainer };
  if (right != null || bottom != null || left != null || top != null) {
    if (right  != null) pos.right  = right;
    if (bottom != null) pos.bottom = bottom;
    if (right  == null) pos.left   = left  != null ? left  : 0;
    if (bottom == null) pos.top    = top   != null ? top   : 0;
  } else {
    var hostRect = host.getBoundingClientRect();
    var mRect = m.getBoundingClientRect();
    pos.left = Math.round(mRect.left - hostRect.left);
    pos.top  = Math.round(mRect.top  - hostRect.top);
  }
  a.pos = pos;
  m.remove();
  renderMarker(id);
  /* 关键：首帧迁移不调 persistLocal —— pos 可从模板硬编码再次派生，
     若此处写草稿会让 beforeunload 误以为有未保存改动、刷新弹原生确认框 */
}

var _moRef = null;
window.reconcileMarkers = function () {
  /* 暂停 MO：reconcile 自身改 DOM 否则会递归触发（自递归 → 雪崩） */
  if (_moRef) _moRef.disconnect();
  try {
    /* 1) 业务子树里的 marker（v1.1.x 老页面 / 框架重渲时把模板里的烤入 marker 又插了一次）→ 迁移 or 撤 */
    document.querySelectorAll('.annot-marker').forEach(function (m) {
      if (m.parentElement === document.body) return;
      var id = m.dataset.annot;
      if (annotations[id] && !annotations[id].pos) migrateBakedMarker(m);
      else m.remove();
    });
    /* 2) body 上的孤儿 + 重复 marker（annotations 删了对应 id / 同一 id 出现多份）→ 撤
          重复来源：导出只读版若把运行期 appendChild 的 marker 烤进了 body，下次打开 reconcile 又会 renderMarker 一次 → 同 id 两份。
          也防 MO 抖动期间偶发的双重 append。_dragging 标志位的 marker 一律保留（拖动中不能被回收）。*/
    var _seen = {};
    document.querySelectorAll('body > .annot-marker').forEach(function (m) {
      var id = m.dataset.annot;
      if (!annotations[id]) { m.remove(); return; }
      if (_seen[id]) { if (!m._dragging) m.remove(); return; }
      _seen[id] = m;
    });
    /* 3) 按 annotations 单遍渲染 / 重投影：host 在 → 投影到 viewport；host 不在 → renderMarker 内部撤 */
    Object.keys(annotations).forEach(function (id) { renderMarker(id); });
  } finally {
    if (_moRef) _moRef.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
  }
};

var _reconcileScheduled = false;
function scheduleReconcile() {
  if (_reconcileScheduled) return;
  _reconcileScheduled = true;
  /* 双层延迟：microtask 让框架当前同步 patch 跑完，rAF 让浏览器完成下一帧渲染再投影。
     单层 rAF 会在 Vue nextTick 队列还没消化完时触发；marker 现在不进业务子树，理论上不会再撞 patch，
     但保留双层延迟做防御 + 也避免 resize/scroll 风暴。 */
  Promise.resolve().then(function () {
    requestAnimationFrame(function () {
      _reconcileScheduled = false;
      reconcileMarkers();
    });
  });
}

(function initReconcileMO() {
  if (!window.MutationObserver) return;
  _moRef = new MutationObserver(scheduleReconcile);
  /* 监听整个 body 子树：Vue v-if 切换、弹窗开关、tab 切换都会改变 host 是否挂载/位置 → rAF debounce 后重投影。
     attributes + attributeFilter ['style','class']：捕获 el-tab-pane / v-show 这类不改 DOM 只翻 display 的切换 ——
     不加这条,切 tab 时 host 的可见性变了但 childList 没动,reconcile 不触发 → tabCtx 标注永远不出现。
     scheduleReconcile 是 rAF 去重的,attribute 风暴不会真的跑多遍。 */
  _moRef.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['style', 'class'] });
})();

/* 窗口尺寸 / 任意滚动 → 重投影。scroll 用 capture 才能拿到所有内层滚动容器（非冒泡事件）。 */
var _projT = null;
function _scheduleReproject() { clearTimeout(_projT); _projT = setTimeout(scheduleReconcile, 30); }
window.addEventListener('resize', _scheduleReproject);
window.addEventListener('scroll', _scheduleReproject, true);

/* === bootstrap：渲染管线已就绪，现在跑 === */
renderAllItems();
reconcileMarkers(); /* 单遍：把模板里残留的烤入 marker 迁进 annotations.pos + 在 body 顶层 fixed 投影所有 marker */
applyMarkerColors();

/* 拖动侧栏左缘调整宽度：写入 --annot-sidebar-w（随保存落盘），并存 localStorage 供刷新恢复 */
(function initSidebarResize() {
  var sb = document.getElementById('annotSidebar') || document.querySelector('.annot-sidebar');
  if (!sb) return;
  var KEY = 'annotSidebarW:' + location.pathname;
  function setW(w) { w = Math.max(280, Math.min(720, w)); document.documentElement.style.setProperty('--annot-sidebar-w', w + 'px'); return w; }
  try { var sv = parseInt(localStorage.getItem(KEY), 10); if (sv) setW(sv); } catch (e) {}
  var rz = sb.querySelector('.annot-resizer');
  if (!rz) { rz = document.createElement('div'); rz.className = 'annot-resizer'; rz.title = '拖动调整宽度'; sb.appendChild(rz); }
  var on = false;
  rz.addEventListener('mousedown', function (e) { on = true; e.preventDefault(); document.body.classList.add('annot-resizing'); });
  document.addEventListener('mousemove', function (e) { if (on) setW(window.innerWidth - e.clientX); });
  document.addEventListener('mouseup', function () {
    if (!on) return; on = false; document.body.classList.remove('annot-resizing');
    var w = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--annot-sidebar-w'), 10);
    try { localStorage.setItem(KEY, w); } catch (e) {}
  });
})();
</script>
```

> **侧栏联动（v1.2.0）**：默认路径是 `containerOpeners` + `annotations[id].pos.container`（含 `viewCtx` / `tabCtx` 复合 key）——只要落点写在带 `data-annot-container` 的容器里，opener 由 `bindItem` 自动按复合 key 顺序查找并调用，无需用户手选 `opener` 字段。`modalAnnotIds` + `openModalFor(id)` 降级为兜底（默认 `[]`）：仅当标注既无 `pos` 又找不到任何 opener 时才走老路径，可调一个公共起点（如回主视图 / `openDetail()` / `switchTab('x')`）。点条目时 `bindItem` 会先调 `_closeAllBusinessOverlays()` 关闭旧 popup 与项目业务 dialog/drawer，再按优先级开容器、（如有 `tabCtx`）切 tab、最后展开 `<details>`（若有）→ 滚动高亮。

### 3.3 编辑器 `#editorScript`（只读版被剥离）

```html
<script id="editorScript">
/* SKILL_VERSION：与 SKILL.md frontmatter 的 version 同步。
   保存时由 buildHtml 写入 <meta name="annot-skill-version">，便于后续批量识别原型用哪版 skill、做迁移。
   每次升级 SKILL.md 版本时必须同步改这里。 */
var SKILL_VERSION = '1.3.0';
var fileHandle = null;

/* ---------- 记住原文件句柄：首次选择后写入 IndexedDB，之后保存直接覆盖、不再弹框找路径 ---------- */
var HANDLE_DB = 'annotHandleDB', HANDLE_KEY = location.pathname;
function defaultName() {
  var n = decodeURIComponent(location.pathname.split('/').pop() || '');
  return /\.html?$/i.test(n) ? n : ((document.title || 'prototype').replace(/[\\/:*?"<>|·\s]+/g, '-')) + '.html';
}
function idbHandle(mode, val) {
  return new Promise(function (resolve) {
    if (!window.indexedDB) return resolve(null);
    var open = indexedDB.open(HANDLE_DB, 1);
    open.onupgradeneeded = function () { open.result.createObjectStore('h'); };
    open.onsuccess = function () {
      var st = open.result.transaction('h', mode).objectStore('h');
      var req = mode === 'readwrite' ? st.put(val, HANDLE_KEY) : st.get(HANDLE_KEY);
      req.onsuccess = function () { resolve(mode === 'readwrite' ? true : (req.result || null)); };
      req.onerror = function () { resolve(null); };
    };
    open.onerror = function () { resolve(null); };
  });
}
async function ensurePerm(h) {
  try {
    var o = { mode: 'readwrite' };
    if ((await h.queryPermission(o)) === 'granted') return true;
    return (await h.requestPermission(o)) === 'granted';
  } catch (e) { return false; }
}

/* ---------- 本地草稿：自动保存到 localStorage，防刷新丢失 ----------
   v1.2.0：单一数据源 — annotations[id].pos 取代 addedMarkers/movedMarkers，草稿只存 { annotations, theme } */
var STORAGE_KEY = 'annotDraft:' + location.pathname;
function persistLocal() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ annotations: annotations, theme: currentThemeColor() })); } catch (e) {}
}
function clearLocal() { try { localStorage.removeItem(STORAGE_KEY); } catch (e) {} }

/* ---------- 主题色：CSS 变量统一驱动 chrome + 每条默认色；改色写入 <html> 行内样式，随保存落盘 ---------- */
var DEFAULT_THEME = '#1677FF';
function currentThemeColor() {
  var inl = (document.documentElement.style.getPropertyValue('--annot-theme') || '').trim();
  if (inl) return inl;
  var c = (getComputedStyle(document.documentElement).getPropertyValue('--annot-theme') || '').trim();
  return c || DEFAULT_THEME;
}
function applyTheme(color, persist) {
  color = (color || DEFAULT_THEME).trim();
  if (color.toUpperCase() === DEFAULT_THEME.toUpperCase()) document.documentElement.style.removeProperty('--annot-theme');
  else document.documentElement.style.setProperty('--annot-theme', color);
  DEFAULT_COLOR = color;
  document.documentElement.style.setProperty('--annot-theme-fg', fgOn(color));
  var tp = document.getElementById('annotThemeColor'); if (tp) tp.value = color;
  if (typeof renderAllItems === 'function') renderAllItems();
  if (typeof applyMarkerColors === 'function') applyMarkerColors();
  if (persist) persistLocal();
}
(function initThemePicker() {
  var tp = document.getElementById('annotThemeColor'); if (!tp) return;
  tp.value = currentThemeColor();
  document.documentElement.style.setProperty('--annot-theme-fg', fgOn(currentThemeColor()));
  tp.addEventListener('input', function () { applyTheme(this.value, true); });
})();

/* ---------- 防贴边夹紧：当角标在 [data-annot-container] 内时，给上下左右各保留 4px，避免被外层
   header / 分隔线遮挡（典型 bug：日志弹窗顶部的角标被 dialog header 压住）。挂在 body 的 page
   坐标不动（视口很大，没必要 clamp）。 */
function clampMarkerPos(host, left, top, mw, mh) {
  var pad = 4; mw = mw || 28; mh = mh || 22;
  var w = host.clientWidth, h = host.clientHeight;
  if (w > mw + pad * 2) left = Math.max(pad, Math.min(left, w - mw - pad));
  if (h > mh + pad * 2) top  = Math.max(pad, Math.min(top,  h - mh - pad));
  return { left: left, top: top };
}
/* ---------- 拖动角标改位置：直接写回 annotations[id].pos（v1.2.0 单一数据源） ----------
   入参 left/top 是相对 host 的局部坐标（bindMarker mouseup 已把 viewport 坐标换算好）。
   marker 在 body 顶层 fixed，不再通过 parentElement.closest 找 host —— 直接用 m._host。 */
window.recordMarkerMove = function (id, left, top) {
  var a = annotations[id]; if (!a) return;
  var m = document.querySelector('.annot-marker[data-annot="' + id + '"]');
  var host = (m && m._host) || (a.pos && _deepFindLastContainer(a.pos.container));
  if (host) {
    var c = clampMarkerPos(host, left, top, 28, 22);
    left = c.left; top = c.top;
    if (!a.pos) a.pos = { container: host.dataset.annotContainer, left: left, top: top };
    else {
      a.pos.container = host.dataset.annotContainer;
      a.pos.left = left; a.pos.top = top;
      /* 拖动后用 left/top 显式表达：清掉锚字段，否则 right/bottom 优先级高、left/top 不生效 */
      delete a.pos.right; delete a.pos.bottom;
    }
  } else if (a.pos) {
    a.pos.left = left; a.pos.top = top;
    delete a.pos.right; delete a.pos.bottom;
  }
  persistLocal();
  scheduleReconcile(); /* 投影到新 viewport 位置 */
};

/* ---------- 删除标注：二次确认 → 删 annotations 项 → reconcile 拉走 DOM → 自动重排（1..N） ---------- */
window.deleteAnnot = function (id) {
  if (!annotations[id]) return false;
  if (!confirm('确定删除标注 ' + id + '「' + (annotations[id].title || '') + '」？\n删除后其余标注会自动重新编号。')) return false;
  delete annotations[id];
  var mi = modalAnnotIds.indexOf(id); if (mi !== -1) modalAnnotIds.splice(mi, 1);
  renumberAnnotations();
  if (typeof reconcileMarkers === 'function') reconcileMarkers();  /* DOM 由 reconcile 兜底，不再手动 marker.remove */
  renderAllItems();
  applyMarkerColors();
  closeAnnotPopup();
  if (editingId === id) { overlay.classList.remove('show'); editingId = null; editingIsNew = false; }
  persistLocal();
  toast('已删除标注');
  return true;
};

// 把整数编号的标注重排为连续 1..N，同步 annotations key / DOM data-annot / modalAnnotIds / nextId
// （v1.2.0：addedMarkers / movedMarkers 已不存在，无需再同步）
function renumberAnnotations() {
  var keys = Object.keys(annotations).filter(function (k) { return /^\d+$/.test(k); });
  keys.sort(function (a, b) { return parseInt(a, 10) - parseInt(b, 10); });
  var map = {};
  keys.forEach(function (k, i) { map[k] = String(i + 1); });
  if (keys.every(function (k) { return map[k] === k; })) { nextId = keys.length + 1; return; }
  var rebuilt = {};
  keys.forEach(function (k) { rebuilt[map[k]] = annotations[k]; });
  Object.keys(annotations).forEach(function (k) { if (!/^\d+$/.test(k)) rebuilt[k] = annotations[k]; });
  annotations = rebuilt;
  /* DOM 上把 data-annot 同步改名，让本帧 reconcile 能识别 */
  document.querySelectorAll('.annot-marker').forEach(function (m) {
    var raw = m.dataset.annot, base = raw.replace(/b$/, ''), suffix = raw.slice(base.length);
    if (map[base]) {
      var nv = map[base] + suffix, showedId = (m.textContent || '').trim() === raw;
      m.dataset.annot = nv;
      if (showedId) m.textContent = nv;
    }
  });
  for (var i = 0; i < modalAnnotIds.length; i++) { if (map[modalAnnotIds[i]]) modalAnnotIds[i] = map[modalAnnotIds[i]]; }
  nextId = keys.length + 1;
}

function setEditing(on) {
  document.body.classList.toggle('annot-editing', on);
  document.getElementById('modeTag').textContent = on ? '编辑模式' : '查看模式';
  document.getElementById('btnEnterEdit').textContent = on ? '✎ 编辑中' : '✎ 编辑';
  if (!on) exitAddMode();
}
document.getElementById('btnEnterEdit').addEventListener('click', function () {
  if (document.body.classList.contains('annot-editing')) return;
  setEditing(true); toast('已进入编辑模式');
});
document.getElementById('btnExitEdit').addEventListener('click', function () { setEditing(false); toast('已退出编辑'); });

/* ---------- 富文本编辑器 ---------- */
var rtEditor = document.getElementById('rtEditor');
var savedRange = null;
function saveRange() { var s = window.getSelection(); if (s.rangeCount && rtEditor.contains(s.anchorNode)) savedRange = s.getRangeAt(0); }
function restoreRange() { if (savedRange) { var s = window.getSelection(); s.removeAllRanges(); s.addRange(savedRange); } }
rtEditor.addEventListener('keyup', saveRange);
rtEditor.addEventListener('mouseup', saveRange);
function exec(cmd, val) { rtEditor.focus(); restoreRange(); document.execCommand(cmd, false, val); saveRange(); }
function currentCell() { var s = window.getSelection(); if (!s.rangeCount) return null; var n = s.anchorNode; n = n.nodeType === 3 ? n.parentNode : n; return n.closest ? n.closest('td,th') : null; }

document.getElementById('rtToolbar').addEventListener('mousedown', function (e) { if (e.target.closest('button')) e.preventDefault(); });
document.getElementById('rtToolbar').addEventListener('click', function (e) {
  var btn = e.target.closest('button'); if (!btn || !btn.dataset.cmd) return;
  var cmd = btn.dataset.cmd;
  if (cmd === 'bold') exec('bold');
  else if (cmd === 'italic') exec('italic');
  else if (cmd === 'code') { var t = (window.getSelection().toString()) || 'code'; exec('insertHTML', '<code>' + t + '</code>'); }
  else if (cmd === 'fore') { var c = prompt('字体颜色（如 #1677ff）', '#1677ff'); if (c) exec('foreColor', c); }
  else if (cmd === 'hilite') { var h = prompt('高亮色（如 #ffe58f）', '#ffe58f'); if (h) exec('hiliteColor', h); }
  else if (cmd === 'removeFormat') exec('removeFormat');
  else if (cmd === 'ul') exec('insertUnorderedList');
  else if (cmd === 'ol') exec('insertOrderedList');
  else if (cmd === 'table') document.getElementById('rtTablePop').classList.toggle('show');
  else if (cmd === 'rowAdd') { var td = currentCell(); if (!td) return toast('光标先放进表格'); var tr = td.parentNode, nr = document.createElement('tr'); for (var i = 0; i < tr.children.length; i++) { var c2 = document.createElement('td'); c2.innerHTML = '<br>'; nr.appendChild(c2); } tr.parentNode.insertBefore(nr, tr.nextSibling); }
  else if (cmd === 'colAdd') { var td2 = currentCell(); if (!td2) return toast('光标先放进表格'); var idx = Array.prototype.indexOf.call(td2.parentNode.children, td2); var rows = td2.closest('table').rows; for (var r = 0; r < rows.length; r++) { var nc = rows[r].insertCell(Math.min(idx + 1, rows[r].cells.length)); nc.innerHTML = '<br>'; } }
  else if (cmd === 'rowDel') { var td3 = currentCell(); if (!td3) return toast('光标先放进表格'); var tr3 = td3.parentNode; if (tr3.parentNode.children.length > 1) tr3.remove(); else td3.closest('table').remove(); }
  else if (cmd === 'colDel') { var td4 = currentCell(); if (!td4) return toast('光标先放进表格'); var ci = Array.prototype.indexOf.call(td4.parentNode.children, td4); var rs = td4.closest('table').rows; if (rs[0].cells.length <= 1) { td4.closest('table').remove(); return; } for (var k = 0; k < rs.length; k++) { if (rs[k].cells[ci]) rs[k].deleteCell(ci); } }
  else if (cmd === 'image') { var inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.onchange = function () { var f = inp.files[0]; if (!f) return; var rd = new FileReader(); rd.onload = function () { exec('insertHTML', '<img src="' + rd.result + '">'); }; rd.readAsDataURL(f); }; inp.click(); }
});
document.getElementById('rtFontSize').addEventListener('change', function () { if (this.value) exec('fontSize', this.value); this.value = ''; });
document.getElementById('rtTableInsert').addEventListener('click', function () {
  var rows = parseInt(document.getElementById('rtRows').value, 10) || 0;
  var cols = parseInt(document.getElementById('rtCols').value, 10) || 0;
  if (!rows || !cols) return;
  var html = '<table><tbody>';
  for (var r = 0; r < rows; r++) { html += '<tr>'; for (var c = 0; c < cols; c++) html += '<td><br></td>'; html += '</tr>'; }
  html += '</tbody></table><p><br></p>';
  exec('insertHTML', html);
  document.getElementById('rtTablePop').classList.remove('show');
});

/* ---------- 编辑弹窗 ---------- */
var overlay = document.getElementById('editOverlay');
var emCategory = document.getElementById('emCategory');
emCategory.innerHTML = '<option value="">（无）</option>';
CATEGORIES.forEach(function (k) { var o = document.createElement('option'); o.value = k; o.textContent = k; emCategory.appendChild(o); });
var emColorPicker = document.getElementById('emColorPicker');
var emColorText = document.getElementById('emColorText');
emColorPicker.addEventListener('input', function () { emColorText.value = this.value; });
/* v1.2.0：移除编辑弹窗里的「关联打开方式」下拉。
   理由：opener 完全由 containerOpeners[container[@viewCtx|@tabCtx]] 自动识别，
   无需也不应让用户手选——手选既冗余又会与自动识别冲突。 */

var editingId = null, editingIsNew = false;
window.openEditor = function (id, isNew) {
  editingId = id; editingIsNew = !!isNew;
  var a = annotations[id] || { title: '', category: '', color: '', ref: '', detail: '' };
  document.getElementById('emTitle').textContent = isNew ? '新增标注' : '编辑标注 ' + id;
  document.getElementById('emTitleInput').value = a.title || '';
  emCategory.value = a.category || '';
  emColorPicker.value = a.color || DEFAULT_COLOR;
  emColorText.value = a.color || '';
  emColorText.placeholder = DEFAULT_COLOR + '（默认）';
  document.getElementById('emRef').value = a.ref || (isNew ? 'PRD ' : '');
  rtEditor.innerHTML = a.detail || '<p><br></p>';
  document.getElementById('emDelete').style.display = isNew ? 'none' : 'inline-block';
  overlay.classList.add('show');
  document.getElementById('emTitleInput').focus();
};
function closeEditor(cancelled) {
  overlay.classList.remove('show');
  document.getElementById('rtTablePop').classList.remove('show');
  if (cancelled && editingIsNew && editingId != null) {
    delete annotations[editingId];
    if (typeof reconcileMarkers === 'function') reconcileMarkers();  /* 撤销新增 → 让 reconcile 拉走 DOM */
    persistLocal();
  }
  editingId = null; editingIsNew = false;
}
document.getElementById('emClose').addEventListener('click', function () { closeEditor(true); });
document.getElementById('emCancel').addEventListener('click', function () { closeEditor(true); });
document.getElementById('emDelete').addEventListener('click', function () { if (editingId != null) window.deleteAnnot(editingId); });
document.getElementById('emOk').addEventListener('click', function () {
  var title = document.getElementById('emTitleInput').value.trim();
  if (!title) { toast('请填写标题'); return; }
  var color = emColorText.value.trim();
  var prev = annotations[editingId] || {};
  annotations[editingId] = {
    title: title,
    category: emCategory.value,
    color: color,
    ref: document.getElementById('emRef').value.trim(),
    detail: rtEditor.innerHTML
  };
  /* 保留运行期由别处写入的非编辑字段：pos（落点） / opener（老字段，containerOpeners 已不再要求） / w,h（弹窗尺寸） */
  if (prev.opener) annotations[editingId].opener = prev.opener;
  if (prev.pos) annotations[editingId].pos = prev.pos;
  if (prev.w) annotations[editingId].w = prev.w;
  if (prev.h) annotations[editingId].h = prev.h;
  var list = document.getElementById('annotList');
  var old = list.querySelector('.annot-item[data-annot-target="' + editingId + '"]');
  var fresh = renderItem(editingId);
  if (old) list.replaceChild(fresh, old); else list.appendChild(fresh);
  applyMarkerColors();
  /* 若该标注的弹窗当前正打开，同步刷新标题/内容,
     popup chrome(边框/顶栏渐变)由 CSS + --annot-theme 控制,不再 inline 覆盖 */
  (function refreshOpenPopup() {
    var popup = document.getElementById('popup');
    if (!popup || !popup.classList.contains('show')) return;
    if (popup.dataset.annot !== editingId) return;
    var a = annotations[editingId];
    var tt = document.getElementById('popup-title');
    if (tt) tt.textContent = editingId + '. ' + (a.title || '') + (a.ref ? '  (' + a.ref + ')' : '');
    var bd = document.getElementById('popup-body');
    if (bd) bd.innerHTML = a.detail || '';
  })();
  persistLocal();
  toast('已保存标注 ' + editingId);
  editingIsNew = false;
  closeEditor(false);
});

/* ---------- 新增标注：点页面落点 ---------- */
var addMode = false;
function exitAddMode() { addMode = false; document.body.classList.remove('annot-add-mode'); }
document.getElementById('btnAdd').addEventListener('click', function () { addMode = true; document.body.classList.add('annot-add-mode'); toast('点击页面任意位置放置新标注'); });
document.addEventListener('click', function (e) {
  if (!addMode) return;
  if (e.target.closest('.annot-sidebar') || e.target.closest('.annot-popup') || e.target.closest('.annot-edit-overlay')) return;
  e.preventDefault(); e.stopPropagation();
  exitAddMode();
  /* v1.2.0 严格策略：只有命中 [data-annot-container] 才能落点。
     不再回退到 body+page 坐标 —— 那会让弹窗关闭后角标漂到基础页（典型旧 bug）。 */
  var host = e.target.closest('[data-annot-container]');
  if (!host) {
    /* 在业务弹窗/抽屉内点击但没命中（点到了 wrapper / padding 区 / 直接子元素未声明容器）：
       回退到该弹窗内的首个 [data-annot-container] */
    var wrap = e.target.closest('.el-dialog__wrapper, .el-drawer__wrapper, .ant-modal-wrap, .ant-drawer, .n-modal-mask, .n-drawer-mask, dialog');
    if (wrap) {
      var inner = wrap.querySelector('[data-annot-container]');
      if (inner) host = inner;
    }
  }
  if (!host) {
    toast('此区域未声明 data-annot-container，无法承接新角标');
    return;
  }
  var id = String(nextId++);
  while (annotations[id]) id = String(nextId++); // 跳过已占用 ID（兜底，正常顺序续号即可）
  /* marker 是 body 顶层 fixed，无需把 host 设为定位元素 */
  var r = host.getBoundingClientRect();
  var lx = e.clientX - r.left, ly = e.clientY - r.top;
  /* 防贴边夹紧：避免点在 container 顶/边时角标半截露在 container 外（被外层 header / 分隔线压住） */
  var c = clampMarkerPos(host, lx, ly, 28, 22); lx = c.left; ly = c.top;
  var posObj = { container: host.dataset.annotContainer, left: lx, top: ly };
  /* 项目侧钩子：写入当前 view/tab 上下文，给 bindItem 用复合 key 去歧义；钩子未挂时无 viewCtx/tabCtx 字段 */
  try {
    var v = (typeof window.__ANNOT_VIEW_CTX__ === 'function') ? String(window.__ANNOT_VIEW_CTX__() || '') : '';
    if (v) posObj.viewCtx = v;
    var t = (typeof window.__ANNOT_TAB_CTX__ === 'function') ? String(window.__ANNOT_TAB_CTX__() || '') : '';
    if (t) posObj.tabCtx = t;
  } catch (err) {}
  annotations[id] = { title: '', category: '', color: '', ref: '', detail: '<p><br></p>', pos: posObj };
  renderMarker(id);   /* annotations 是唯一真相 → renderMarker 派生 DOM，无需自己 appendChild */
  persistLocal();
  window.openEditor(id, true);
}, true);

/* ---------- 保存 / 导出 ---------- */
function serializeAnnotations() { return 'var annotations = ' + JSON.stringify(annotations, null, 2) + ';'; }
function buildHtml(readonly) {
  exitAddMode(); closeAnnotPopup(); overlay.classList.remove('show');
  var clone = document.documentElement.cloneNode(true);
  /* 剥除框架运行期遗留的全局遮罩：Element-UI 在 dialog/drawer 打开时会往 body 顶层 append <div class="v-modal">，
     且给 body 加 .el-popup-parent--hidden 锁滚。保存瞬间若弹窗仍开着，这层遮罩会被克隆进文件，下次打开就一直罩着。
     源模板里没有它，所以直接剥掉即可；其它框架（Ant Design Vue 的 .ant-modal-mask 等）按需再加。 */
  (function stripFrameworkOverlays() {
    var b = clone.querySelector('body'); if (!b) return;
    b.querySelectorAll(':scope > .v-modal, :scope > .el-popup-parent--hidden').forEach(function (n) { n.remove(); });
    b.classList.remove('el-popup-parent--hidden');
  })();
  /* SPA 还原：若页面在 Vue/React 等框架挂载前用捕获脚本写入了 window.__ANNOT_APP_TEMPLATE__，
     这里用源模板覆盖 #app 的渲染后 DOM，避免烤死框架指令。
     v1.2.0 单一数据源：先 stripAll 模板里所有 .annot-marker，然后按 annotations[id].pos 单遍重建。
     无捕获脚本时此 IIFE 自动跳过。 */
  (function restoreAppTemplate() {
    var appEl = clone.querySelector('#app');
    if (!appEl || typeof window.__ANNOT_APP_TEMPLATE__ !== 'string') return;
    appEl.innerHTML = window.__ANNOT_APP_TEMPLATE__;
    /* 源模板写回 #app.innerHTML 后，<template v-if=...> 解析成普通 <template> DOM 元素，其子节点
       住在 .content DocumentFragment 里——普通 querySelector 进不去。下面的 deepQS/deepQSA 会下钻所有
       <template>.content，确保能找到 step-* / view-* 等放在 v-if 容器内的 [data-annot-container]。 */
    function deepQS(root, sel) {
      var hit = root.querySelector(sel); if (hit) return hit;
      var tps = root.querySelectorAll('template');
      for (var i = 0; i < tps.length; i++) {
        var c = tps[i].content;
        hit = c.querySelector(sel); if (hit) return hit;
        var inner = deepQS(c, sel); if (inner) return inner;
      }
      return null;
    }
    function deepQSA(root, sel, out) {
      out = out || [];
      out.push.apply(out, root.querySelectorAll(sel));
      root.querySelectorAll('template').forEach(function (t) { deepQSA(t.content, sel, out); });
      return out;
    }
    /* v1.2.0 overlay 模式：marker 在 body 顶层 fixed 投影，不再回写进业务模板里。
       打开重渲后 viewerScript 会按 annotations[id].pos 在 body 顶层重建 marker（fixed 投影到 host bbox）。
       仍清掉模板内残留的烤入 marker（防 v1.1.x 老页面写下的死 DOM 碰头）。 */
    deepQSA(appEl, '.annot-marker').forEach(function (m) { m.remove(); });
  })();
  /* v1.2.0 marker 在 body 顶层 fixed 投影 —— 这些是运行期 appendChild 的产物，必须从导出快照里剥掉，
     否则下次打开会触发：源 marker 在 body / viewerScript 又按 pos renderMarker 一次 → 同 id 两份 →
     折叠侧栏触发 reflow 时 querySelector 只更新第一份，第二份留在旧坐标 → 视觉上"重复角标"。 */
  (function stripRuntimeMarkers() {
    var b2 = clone.querySelector('body'); if (!b2) return;
    b2.querySelectorAll(':scope > .annot-marker').forEach(function (m) { m.remove(); });
  })();
  var b = clone.querySelector('body'); b.classList.remove('annot-editing', 'annot-add-mode', 'annot-hide-markers');
  /* 注入/更新 <meta name="annot-skill-version">，供未来批量识别原型 skill 版本 */
  (function stampVersion() {
    var head = clone.querySelector('head'); if (!head) return;
    var meta = head.querySelector('meta[name="annot-skill-version"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'annot-skill-version'); head.appendChild(meta); }
    meta.setAttribute('content', SKILL_VERSION);
  })();
  var mt = clone.querySelector('#modeTag'); if (mt) mt.textContent = '查看模式';
  var eb = clone.querySelector('#btnEnterEdit'); if (eb) eb.textContent = '✎ 编辑';
  /* btnSave reset：buildHtml 在「保存中…」期间被调用,克隆出的 DOM 里 btnSave 是 disabled + 「⟳ 保存中…」。
     不复位会把这个瞬态烤进文件,下次打开按钮永远卡在保存中、且不可点(也接不到 click handler 的 finally)。 */
  var bs = clone.querySelector('#btnSave'); if (bs) { bs.removeAttribute('disabled'); bs.textContent = '◉ 保存到文件'; }
  var ov = clone.querySelector('#editOverlay'); if (ov) ov.classList.remove('show');
  if (readonly) { ['#editorToolbar', '#editorScript', '#editOverlay'].forEach(function (s) { var el = clone.querySelector(s); if (el) el.remove(); }); }
  var html = '<!DOCTYPE html>\n' + clone.outerHTML;
  html = html.replace(/\/\*ANNOT_DATA_START\*\/[\s\S]*?\/\*ANNOT_DATA_END\*\//, '/*ANNOT_DATA_START*/\n' + serializeAnnotations() + '\n/*ANNOT_DATA_END*/');
  return html;
}
function download(name, content) { var blob = new Blob([content], { type: 'text/html' }); var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000); }
document.getElementById('btnSave').addEventListener('click', async function () {
  var btn = this;
  if (btn.disabled) return;                                                   // 重入保护：保存中再点直接忽略
  var origText = btn.textContent;
  btn.disabled = true; btn.textContent = '↻ 保存中…';
  try {
    var content = buildHtml(false);
    if (!window.showSaveFilePicker) { download(defaultName(), content); toast('浏览器不支持直接写文件，已下载'); return; }
    try {
      if (!fileHandle) fileHandle = await idbHandle('readonly');               // 复用上次保存的原文件
      if (fileHandle && !(await ensurePerm(fileHandle))) fileHandle = null;     // 权限失效则重选
      if (!fileHandle) {
        fileHandle = await window.showSaveFilePicker({ id: 'annotPrototype', suggestedName: defaultName(), types: [{ description: 'HTML', accept: { 'text/html': ['.html'] } }] });
        await idbHandle('readwrite', fileHandle);                               // 记住，下次免找路径
      }
      var w = await fileHandle.createWritable(); await w.write(content); await w.close();
      clearLocal();
      toast('已保存到文件');
      refreshResavePathTip();                                                  // 刷新「保存位置」按钮 tooltip
    } catch (err) { if (err.name !== 'AbortError') { download(defaultName(), content); toast('改为下载'); } }
  } finally {
    btn.disabled = false; btn.textContent = origText;
  }
});
document.addEventListener('keydown', function (e) {
  if ((e.metaKey || e.ctrlKey) && (e.key === 's' || e.key === 'S')) {
    if (!document.body.classList.contains('annot-editing')) return;   // 仅编辑态拦截，视图态放行浏览器默认
    e.preventDefault();
    document.getElementById('btnSave').click();
  }
}, true);
function idbDeleteHandle() {
  return new Promise(function (resolve) {
    if (!window.indexedDB) return resolve(false);
    var open = indexedDB.open(HANDLE_DB, 1);
    open.onupgradeneeded = function () { open.result.createObjectStore('h'); };
    open.onsuccess = function () {
      try {
        var st = open.result.transaction('h', 'readwrite').objectStore('h');
        var req = st.delete(HANDLE_KEY);
        req.onsuccess = function () { resolve(true); };
        req.onerror = function () { resolve(false); };
      } catch (e) { resolve(false); }
    };
    open.onerror = function () { resolve(false); };
  });
}
async function refreshResavePathTip() {
  var btn = document.getElementById('btnResavePath'); if (!btn) return;
  var h = fileHandle || await idbHandle('readonly');
  if (h && h.name) btn.title = '当前文件:' + h.name + '\n点击可切换 / 在弹出窗口里能看到完整路径';
  else btn.title = '尚未绑定文件\n点击可预先指定保存位置';
}
document.getElementById('btnResavePath').addEventListener('click', async function () {
  if (!window.showSaveFilePicker) { toast('浏览器不支持选择文件,只能下载'); return; }
  toast('在弹出的窗口里可看到完整路径,挑好后点保存');
  var prev = fileHandle;
  fileHandle = null;                                                          // 必须提前置空 + 清 idb，否则 picker 不弹出
  await idbDeleteHandle();
  try {
    fileHandle = await window.showSaveFilePicker({ id: 'annotPrototype', suggestedName: defaultName(), types: [{ description: 'HTML', accept: { 'text/html': ['.html'] } }] });
    await idbHandle('readwrite', fileHandle);
    refreshResavePathTip();
    toast('保存位置已更新:' + (fileHandle.name || ''));
  } catch (err) {
    if (err.name === 'AbortError') {                                           // 用户取消 → 还原到上次的句柄，不丢绑定
      fileHandle = prev;
      if (prev) await idbHandle('readwrite', prev);
      refreshResavePathTip();
    } else { toast('未能更新保存位置'); }
  }
});
document.getElementById('btnExport').addEventListener('click', function () { download('prototype-readonly.html', buildHtml(true)); toast('已导出只读交付版'); });

/* ---------- 刷新后从本地草稿恢复未保存内容（v1.2.0：单一数据源 + 老草稿迁移） ---------- */
(function restoreDraft() {
  var raw; try { raw = localStorage.getItem(STORAGE_KEY); } catch (e) { return; }
  if (!raw) return;
  var d; try { d = JSON.parse(raw); } catch (e) { return; }
  if (!d || !d.annotations) return;
  annotations = d.annotations;
  /* 老草稿兼容（v1.1.x → v1.2.0）：把 addedMarkers / movedMarkers 翻译进 annotations[id].pos，然后丢弃 */
  if (d.addedMarkers && d.addedMarkers.length) {
    d.addedMarkers.forEach(function (mk) {
      var a = annotations[mk.id]; if (!a) return;
      if (!a.pos) a.pos = { container: mk.container || '', left: mk.left || 0, top: mk.top || 0 };
      if (mk.viewCtx && !a.pos.viewCtx) a.pos.viewCtx = mk.viewCtx;
    });
  }
  if (d.movedMarkers) {
    Object.keys(d.movedMarkers).forEach(function (id) {
      var a = annotations[id]; if (!a) return;
      if (!a.pos) return; /* 没 container 没法挂，跳过 */
      a.pos.left = d.movedMarkers[id].left;
      a.pos.top  = d.movedMarkers[id].top;
    });
  }
  if (d.theme && d.theme.toUpperCase() !== DEFAULT_THEME.toUpperCase()) { document.documentElement.style.setProperty('--annot-theme', d.theme); document.documentElement.style.setProperty('--annot-theme-fg', fgOn(d.theme)); DEFAULT_COLOR = d.theme; }
  var __tp = document.getElementById('annotThemeColor'); if (__tp) __tp.value = currentThemeColor();
  /* annotations 被草稿覆盖了 → nextId 必须按新 annotations 重算
     （否则首次 renderAllItems 抬高的 nextId 会延续过来：删光后新增依然从老最大值续号，出现「从 7 开始」） */
  nextId = 1;
  Object.keys(annotations).forEach(function (k) {
    var n = parseInt(k, 10);
    if (!isNaN(n) && n >= nextId) nextId = n + 1;
  });
  renderAllItems();
  if (typeof reconcileMarkers === 'function') reconcileMarkers();   /* annotations 是真相 → DOM 由 reconcile 派生 */
  applyMarkerColors();
  persistLocal();   /* 把迁移后的新格式立刻写回，丢弃 addedMarkers/movedMarkers 老字段 */
  toast('已恢复未保存的本地草稿（点「保存到文件」写入文件）');
})();

refreshResavePathTip();   /* 启动时按 idb 中已有的句柄回写「保存位置」按钮的 tooltip */

/* ---------- 刷新/关闭前拦截：有未写入文件的改动时弹原生确认框 ---------- */
window.addEventListener('beforeunload', function (e) {
  var hasDraft; try { hasDraft = !!localStorage.getItem(STORAGE_KEY); } catch (x) { hasDraft = false; }
  if (hasDraft || overlay.classList.contains('show')) { e.preventDefault(); e.returnValue = ''; }
});
</script>
```

---

## 四、补充约定

### 内容区适配

业务页面顶层容器（`body` 或 `.content`）右侧留出面板宽度：展开态 `padding-right: 360px`，折叠态 `60px`（折叠时 `body.annot-collapsed`）。

### overflow 容器内的角标（防裁切）

当角标父容器有 `overflow-x:auto` / `overflow:hidden` / `position:sticky`（如表头 `<th>`、横向 tab 栏），绝对定位角标会被裁切，改用行内定位：

```css
th .annot-marker, .tabs .annot-marker, .overflow-container .annot-marker {
  position: relative; top: -2px; right: auto; margin-left: 4px; vertical-align: middle;
}
```

HTML 上去掉内联 `top/right`，角标直接跟在文字后：`<th>列名<span class="annot-marker" data-annot="2">2</span></th>`。

> ⚠️ 行内定位（`position:relative` + `margin-left`）会挤占布局空间。**它只用于真正会裁切角标的 overflow/clip/sticky 容器**（表头、横滚 tab），是已知会改动原型布局的取舍——**绝非默认方案**。默认一律用绝对定位覆盖（见 2.1：必要时包一层 `position:relative;display:inline-flex` 容器），保证不挪动原型里任何控件的位置。

### NEW 标识（业务 HTML 中手写，与编辑器无关）

标注点藏在弹窗/抽屉内时，在四处加 NEW 标识引导。这些标签由 Claude 在业务 HTML 中手写，不受编辑器管理。

```css
.annot-change-dot { display: inline-flex; align-items: center; margin-left: 4px; font-size: 10px; font-weight: 700; color: #fff; background: #1677FF; padding: 0 4px; border-radius: 2px; line-height: 16px; letter-spacing: .5px; vertical-align: middle; flex-shrink: 0; }
.annot-modal-badge { display: inline-flex; align-items: center; background: #1677FF; color: #fff; font-size: 10px; font-weight: 700; padding: 0 6px; border-radius: 2px; margin-left: 8px; vertical-align: middle; line-height: 18px; letter-spacing: .5px; }
.nav-new-tag { font-size: 10px; font-weight: 700; color: #fff; background: #1677FF; padding: 0 4px; border-radius: 2px; line-height: 16px; letter-spacing: .5px; margin-left: auto; flex-shrink: 0; }
```

- 左侧菜单项：`付款管理<span class="nav-new-tag">NEW</span>`
- 表格操作列「详情」旁：`<a>详情</a><span class="annot-change-dot">NEW</span>`
- 弹窗标题栏：`<h3>付款单详情 #18021 <span class="annot-modal-badge">NEW</span></h3>`

弹窗内角标的 ID 填入 `modalAnnotIds`、在 `openModalFor` 内打开对应弹窗，点侧栏条目即可自动开弹窗并定位（见 3.2）。

> 「分类」已取代旧的「位置标签」。弹窗内的标注用 `category: "弹窗"` 体现归属，无需单独的 `annot-modal-tag`。

### z-index 分层契约（必须遵守）

| 层级 | 元素 | z-index | 说明 |
|------|------|---------|------|
| 底 | 基础页角标 `annot-marker` | `90` | 低于业务遮罩层。弹窗/抽屉打开时基础页角标必须被自动覆盖 |
| 中 | 业务遮罩/弹窗/抽屉 | `1000~1100` | 项目自定，须 > 90 且 < 3000 |
| 顶 | 标注侧栏 / 弹窗 | `3000` / `3010` | 始终最上层；编辑弹窗 `5000`、toast `4000` |

不要给单个角标硬写高 z-index 让它"显示"——判断角标该不该露出，看它在 DOM 中属于基础页还是属于业务弹窗。
