# zhangwan-zhangtu

`zhangwan-zhangtu` 是内部原型系统种子项目。它提供完整的本地闭环能力：页面发现、项目预览、需求模块读取、迭代管理、迭代预览，以及通过 `proto-hub` 上传原型并拿分享链接。

权限、SSO、审计和远程存储仍不在本仓库默认范围内。

## 快速开始

```bash
npm install
npm run zhangtu -- doctor
npm run zhangtu -- inspect-pages --json
npm run zhangtu -- create-iteration "内部评审 V1" "原型工作台首轮评审"
npm run zhangtu -- preview-iteration "内部评审 V1"
npm run zhangtu -- publish-status
```

## 项目结构

```text
zhangtu.config.json             掌图系统配置
scripts/zhangtu/                页面发现、迭代管理、本地预览 CLI
src/pages/skills/               技能管理工作台
src/common/                     可复用品牌与需求锚点组件
src/resources/                  长期项目资料与模板
docs/zhangtu.md                 工具说明
```

## 当前页面与依赖说明

- 当前仓库可被 `zhangtu` 发现的页面以 `npm run zhangtu -- inspect-pages --json` 输出为准；目前实际页面是 `skills`。
- `src/common/branding.ts`、`src/common/site-brand.tsx`、`src/styles/app.css` 已存在，可直接复用，不需要重复补。
- 如果后续新增新的原型页目录，至少需要同时提供 `index.html`、`index.tsx`，并补齐页面里实际 import 的本地文件，例如 `styles/page.css`、`data/mock.ts`、`spec.md`，以及按需补充 `zhangtu.requirements.ts`。
- 当前仓库已安装 `react`、`react-dom`、`lucide-react`、`antd`、`@ant-design/icons`。如果新页面使用其他组件库，需要一并补充准确的 npm 包名、版本和对应 import 路径。

## 当前已迁移能力

- Vite 多页面独立入口
- 页面入口完整性检查
- `zhangtu doctor` 总检（页面契约 / 迭代引用 / 文档引用）
- 页面发现 JSON 输出
- `spec.md` 事实源约定
- `zhangtu.requirements.ts` 需求模块读取
- 页面内 `data-zhangtu-requirement-anchor` 锚点定位
- 本地项目预览 shell
- 本地迭代创建、更新、列表、预览
- `proto-hub` 发布状态检查、系统/版本查询、分享链接获取
- 上传本地原型目录到远端系统新版本，或给已有版本追加新快照
- 发布时附带本地 PRD Markdown 文件或在线 PRD 链接
- 内部主题 token 配置入口

## 协作规则

- 新建或明显更新原型、主题、项目文档等资源时，需先完成需求与设计对齐，再进入规格、计划和实现。
- 对齐流程、提问方式、设计基底确认和决策归档规则见 [docs/requirement-design-alignment.md](/Users/ryan/Desktop/zhangwan-zhangtu/docs/requirement-design-alignment.md)。
- 项目主题固定为 zhangwan-design（掌玩风格设计系统），主题事实源与验收规则见 [docs/theme-guide.md](/Users/ryan/Desktop/zhangwan-zhangtu/docs/theme-guide.md)。
- 新建项目文档默认保存到 [src/resources](/Users/ryan/Desktop/zhangwan-zhangtu/src/resources)，资源目录边界与只读/编辑链接规则见 [docs/resource-guide.md](/Users/ryan/Desktop/zhangwan-zhangtu/docs/resource-guide.md)。
- 若后续启用 `src/prototypes/`，原型目录结构、多页面组织和预览验收规则见 [docs/prototype-development-guide.md](/Users/ryan/Desktop/zhangwan-zhangtu/docs/prototype-development-guide.md)。

## 发布命令

```bash
# 检查 token / base URL / proto-hub 运行时是否就绪
npm run zhangtu -- publish-status

# 保存默认系统名 / token / base URL 到 .zhangtu/publish-config.json
npm run zhangtu -- configure-publish "信鸽" --token pth_xxx --base-url https://chanyan.wozhangwan.com

# 直接把 build 后目录上传为远端版本；若版本名已存在，则自动追加新快照
npm run zhangtu -- upload-prototype ./dist "信鸽" "V8.10 账单优化" --changelog "按评审反馈调了账单页"

# 给已有远端版本补传原型或更新 PRD
npm run zhangtu -- update-remote-version "信鸽" "V8.10 账单优化" --folder ./dist --prd-file ./prd.md

# 发布本地迭代，并将分享链接写回本地版本元数据
npm run zhangtu -- publish-iteration "内部评审 V1" --prd-url https://bytedance.larkoffice.com/docx/xxx

# 未传 --prd-file / --prd-url 时，会自动合并版本页面的 spec.md 与需求标注作为 PRD 上传
```

## 后续公司化接入点

- 替换预览 shell 为公司 UI 组件库
- 将 `.zhangtu/iterations` 替换为内部服务存储
- 增加 SSO、权限、审计和访问控制
