# 主题创建与验收指南

本文档约束本项目中的主题资源使用、更新与验收。主题只面向当前标准结构。

## 项目限制

- 本项目的主题只能使用“掌玩UI”。
- 不允许引入其他主题作为项目设计基底，也不允许在项目内派生第二套并行视觉系统。
- 掌玩UI 对应 skill 文件为 `.agents/skills/project/zhangwanUI/SKILL.md`。
- 掌玩UI 对应设计事实源为 `.agents/skills/project/zhangwanUI/DESIGN.md`。
- 如需新增或调整主题规则，先更新掌玩UI 的 `DESIGN.md`，再同步到项目实现与相关派生配置。

## 核心原则

- `DESIGN.md` 是主题事实源：品牌定位、设计原则、色彩、字体、圆角、间距、边框、阴影、组件规则和禁用做法，均优先按它判断。
- 用户当前消息或附件的优先级高于已有文件；若用户要求与 `DESIGN.md` 冲突，先更新 `DESIGN.md`，再同步派生文件。
- 不根据截图、元数据或自动推断结果覆盖明确写在 `DESIGN.md` 中的规则；只能在 `DESIGN.md` 缺失信息时补充合理假设，并在文档或交付说明中写清楚。
- 主题代码、CSS 和配置中的本地资源引用必须使用主题内相对路径，禁止根路径、本机绝对路径或 `..` 逃逸到其他目录。
- 主题演示页不得引入与掌玩UI无关的 UI 库，避免污染视觉表达。

## 标准来源

- 默认且唯一的主题来源是掌玩UI。
- 新建页面、重做页面、提取主题、设计对齐、视觉验收时，统一以 `.agents/skills/project/zhangwanUI/` 为基底。
- `src/design-system/zhangwan-ui/SKILL.md` 可作为项目内设计系统消费说明参考，但事实源仍以 `.agents/skills/project/zhangwanUI/DESIGN.md` 为准。

## 使用顺序

进入视觉、主题或明显 UI 改版前，按以下顺序读取：

1. 用户当前明确要求、附件、截图和链接。
2. `.agents/skills/project/zhangwanUI/DESIGN.md`
3. `.agents/skills/project/zhangwanUI/SKILL.md`
4. `src/design-system/zhangwan-ui/SKILL.md`
5. 当前页面或原型目录内已存在的样式、组件和事实源文档。

## 开发与更新规则

- 不再整理 3-4 个主题候选供选择；项目主题固定为掌玩UI。
- 用户若提出颜色、字体、布局、动效、组件形态等视觉要求，视为对掌玩UI基底的增量调整，而不是切换主题。
- 若调整会改变设计基底，应先更新掌玩UI的 `DESIGN.md` 或得到明确确认后再实施。
- 使用主题 CSS Variables、tokens、组件习惯时，优先复用掌玩UI现有约定，不复制另一套 token。
- 不将外部网站、截图或参考图直接视为新主题；它们只能作为补充证据，用于校准掌玩UI下的具体表达。

## 验收原则

- 视觉验收时，优先核对是否符合掌玩UI的 `DESIGN.md`。
- 若用户当前要求与 `DESIGN.md` 有差异，先确认该差异是否已被纳入新的事实源。
- 验收顺序为：用户明确要求 -> 掌玩UI `DESIGN.md` -> 项目现有实现约定。
- 不以自动生成结果或外部参考站视觉，替代掌玩UI的明确规范。

## 与其他规则衔接

- 需求与设计对齐流程见 [docs/requirement-design-alignment.md](/Users/ryan/Desktop/zhangwan-zhangtu/docs/requirement-design-alignment.md)。
- 原型实现与验收流程见 [docs/prototype-development-guide.md](/Users/ryan/Desktop/zhangwan-zhangtu/docs/prototype-development-guide.md)。
- 资源目录边界见 [docs/resource-guide.md](/Users/ryan/Desktop/zhangwan-zhangtu/docs/resource-guide.md)。
