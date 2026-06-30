---
name: zhangtu-init-prototype-project
description: 使用掌图默认技术栈与 zhangwanUI 设计系统初始化或规范化原型项目，生成可被页面发现和本地预览识别的多页面原型结构。
author: Ryan
metadata:
  category: project
  maintainer: Ryan
---

Create prototype projects with this default stack unless the user explicitly asks otherwise:

- Vite + React + TypeScript.
- Visual design system: follow the project's design system. zhangtu prototype projects use **zhangwanUI** — design every new page's frontend with its tokens and component contracts (call the `zhangwan-ui` skill, or read `.agents/skills/project/zhangwanUI/`). See the page-creation step below.
- Ant Design for common business UI controls (only where zhangwanUI does not cover the control; align it to zhangwanUI tokens and density).
- lucide-react for icons.
- Plain CSS tokens in `src/styles/tokens.css`; avoid forcing a heavy app framework.
- Multi-page / multi-entry page directories under `src/pages/<module>/<page-slug>/`.
- New projects use `src/pages` as the only default page root. Existing projects may keep Zhangtu-compatible roots such as `src/prototype`, `src/prototypes`, `src/mockup`, `src/mockups`, `app`, `src/app`, `routes`, `pages`, and `prototypes`.

Do not initialize Next.js, Nuxt, SSR, backend templates, micro-frontends, auth systems, real API clients, or production app routing for PM prototype projects unless the user explicitly asks for those constraints.
