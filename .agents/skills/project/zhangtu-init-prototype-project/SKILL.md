---
name: zhangtu-init-prototype-project
description: 使用掌图默认技术栈与 zhangwan-design 设计系统初始化或规范化原型项目，生成可被页面发现和本地预览识别的多页面原型结构。新建业务页时默认只做内容区，不复制整站侧栏/顶栏壳。
author: Ryan
metadata:
  category: project
  maintainer: Ryan
---

Create prototype projects with this default stack unless the user explicitly asks otherwise:

- Vite + React + TypeScript.
- Visual design system: **zhangwan-design** — read `.agents/skills/project/zhangwan-design/` (`SKILL.md`, `readme.md`, `tokens/*.css`). Do **not** use the retired `zhangwanUI` path or call a global skill named `zhangwan-ui` by name.
- Ant Design only where zhangwan-design does not cover the control; align tokens and density.
- lucide-react for icons.
- Plain CSS tokens in `src/styles/tokens.css`; avoid forcing a heavy app framework.
- Multi-page / multi-entry page directories under `src/pages/<module>/<page-slug>/` (or flat `src/pages/<page-slug>/`).
- New projects use `src/pages` as the only default page root.

Do not initialize Next.js, Nuxt, SSR, backend templates, micro-frontends, auth systems, real API clients, or production app routing for PM prototype projects unless the user explicitly asks for those constraints.

## Page creation: content canvas, not app chrome

Zhangtu preview Shell (`shell.html`) already owns:

- Left page list / folders
- Device frame, requirement drawer, version tools

Each page under `src/pages/<slug>/` is an **iframe content document**. When generating a **brand-new page**:

### Do

1. Create `index.html` + `index.tsx` (`createRoot`) + `spec.md`; optional `styles/page.css`, `data/mock.ts`.
2. Read **tokens first**, then content components (Panel, SectionTitle, Button, DataTable, form controls, Dialog/Drawer).
3. Default layout:

```text
.page
  .page-header    # title + primary actions
  .page-toolbar   # optional: FilterBar, Tabs, page-local Breadcrumb
  .page-body      # table / cards / form / charts
```

4. In-page navigation only when the **page’s own IA** needs it (tabs, breadcrumb list→detail, wizard steps).

### Do not (unless the user explicitly asks for a full standalone admin shell)

- Global left `SidebarNav` or a second site menu inside the page
- Full-width app `Navbar` (logo, system switcher, notification chrome)
- Copying the design-system UI Kit **full console layout** as every page template
- Embedding a multi-module menu + client-side “whole product” router inside one page

If the user insists on a full shell for offline demo outside Zhangtu Shell, note that in `spec.md`.

### Generation order

```text
spec.md → tokens → content skeleton → optional filters/tabs → check:pages → preview in Shell
```

Never start by pasting SidebarNav/Navbar examples from the design system.

## Normalize / init checklist

- `zhangtu.config.json` present; pages under configured include dirs.
- Every page has both `index.html` and `index.tsx` entry contract.
- Prefer Chinese copy and mock data.
- After scaffolding: `npm run check:pages` and `npm run zhangtu -- doctor` (or `inspect-pages --json`).
