# 掌玩 (Zhangwan) 设计系统

## 这是什么

**掌玩 (Zhangwan)** 是一款内部数据分析 / BI 控制台，由项目所有者描述为
**"zhangwan"** 的一家中国移动内容与游戏公司开发。它是一个单体 Vue 2 + Element UI
后台应用——`vue-element-admin` 脚手架的一个分支——供内部市场、增长、运营团队使用，
用于分析公司多条产品线的用户获取、留存、付费与内容表现。

这是一个**内部企业工具**，不是面向消费者的产品——密集的数据表格、筛选工具栏和
KPI 卡片是主体；这里没有营销站点或营销内容。

## 本设计系统包含的产品

鉴于该工具单一代码库、单一受众的特性，本系统只提供一个 UI kit：
**`ui_kits/zhangwan-console/`** ——分析控制台外壳（侧边栏/顶栏 → 仪表盘 →
筛选+表格分析页）。

## 组件清单

- `components/core/Button`
- `components/core/Tag`
- `components/core/Tabs`
- `components/core/Panel`
- `components/core/SectionTitle`
- `components/core/LoadingBtn`
- `components/forms/Input`
- `components/forms/Select`
- `components/forms/RadioButtonGroup`
- `components/forms/Checkbox`
- `components/forms/DatePicker`
- `components/forms/InputNumberRange`
- `components/forms/InputMultTag`
- `components/forms/SelectTimezone`
- `components/data/StatCard`
- `components/data/LineChart`
- `components/data/ColumnChart`
- `components/data/PieChart`
- `components/data/DataTable`
- `components/data/RetentionTable`
- `components/data/ColumnSettingsDialog`
- `components/data/DownloadCenter`
- `components/navigation/FilterBar` (+ `FilterField`)
- `components/navigation/SidebarNav`
- `components/navigation/Navbar`
- `components/navigation/Breadcrumb`
- `components/navigation/Hamburger`
- `components/navigation/ViewSet`
- `components/navigation/SystemLink`
- `components/feedback/Dialog`
- `components/feedback/Drawer`
- `components/feedback/Tooltip`
- `components/data/UpdateTime`
- `components/data/PopoverTableCell`

## 索引

- `styles.css` — 根样式表，导入 `tokens/colors.css`、`tokens/typography.css`、
  `tokens/spacing.css`。
- `tokens/` — 颜色、字体、间距/圆角/阴影/动效自定义属性。
- `assets/` — logo 文件、背景插画、404 素材、DIN-Medium 网页字体。
- `components/` — 可复用原子组件，分组为 `core/`、`forms/`、`data/`、
  `navigation/`、`feedback/`（见上）。
- `guidelines/` — 基础规范展示卡片（颜色、字体、间距、品牌/logo、圆角与阴影、
  侧边栏状态），显示在设计系统标签页中。
- `ui_kits/zhangwan-console/` — 分析控制台的点击式还原。

## 内容基本原则

这是一个**面向内部中文用户的内部工具**，而非面向客户的品牌化产品——文案几乎
全是功能性的，看板内容大多是数字，"语气"主要体现在标签、空状态/错误状态，以及
唯一带一点个性的地方：仪表盘问候语。

- **语言与语域**：界面全程使用简体中文（`搜索`、`重置`、`导出`、`新增任务`、
  `自定义列`）。英文只残留在遗留的 `vue-element-admin` 脚手架里（`Login Form`、
  校验提示、`username: admin` 提示）——产品本身从未做过英文本地化，因此掌玩的
  设计产出应默认使用中文标签，英文仅用于脚手架式的占位文字。
- **语气**：中性、事务性，隐含第二人称（祈使动词，不用人称代词）——`请输入关键词`、
  `请选择`、`确定要删除关联客服么?`。绝不使用第一人称，绝不使用营销口吻。
- **确认文案直白而流程化**，不刻意卖萌：破坏性操作总是有一个原生风格的确认弹窗——
  `this.$confirm('确定要删除关联客服么?', '确认提示', {...})`——取消时配一个朴素的
  信息提示（`已取消`）。这个确认弹窗模式是任何删除/解绑操作的常态。
- **唯一带温度的地方**：仪表盘首页按时段问候用户——深夜好/早上好/上午好/中午好/
  下午好/晚上好，根据当前小时数计算——外加一句从固定池子里抽取的单字激励标签。
  这是唯一出现随性温暖感的地方；其余各处都密集而务实。
- **表情符号**：界面中任何地方都不使用。
- **数字优先于文字**：KPI 卡片和表格承载主要内容——标签是简短名词
  （新增用户、次日留存、定价），不是完整句子。

## 视觉基础

- **颜色**：唯一的真品牌色 **`#00bf8a`**（一种青绿色），用于主按钮填充、
  导航激活态、激活 tab 下划线、以及"成功/分类"标签。一个遗留的 Element UI 蓝色
  (`#409eff`) 仍残留在顶级激活菜单文字上——这是渐进式换肤留下的小瑕疵，不是第二个
  品牌色；新工作应统一收敛到绿色。还有两个语义化的分类色：青色 (`#02b8de`，
  "男性/nanpin" 分组) 与粉色 (`#f2595c`，"女性/nvpin" 分组)——这两个读作数据分类色，
  不是情绪化的成功/错误色。
- **字体**：系统 UI 字体栈 (`Helvetica Neue, PingFang SC, Microsoft YaHei,
  Arial`) 用于所有界面文字——没有展示级/编辑类网页字体。另有一个仅用于数字的
  字体 **DIN-Medium**，用于统计卡片上的 KPI 数字，让大号数字比界面字体更紧凑、
  更"数据感"。中文和拉丁字符不会在数字字体中混排——DIN 只用于数字/百分号。
- **间距**：一套基于 4px 的朴素比例尺。到处可见的固定规则：`.app-container`
  （页面的主卡片）总是 **20px** 内边距，坐落在 **#e5e5e5** 画布上——灰色"桌面"
  作为白色内容卡片周围的~留白可见，从不做到边缘出血。表格单元格使用 **7px/10px**
  内边距（逐字取自 `customtable.scss`），分页footer居中，上边距 **20px**。
- **背景**：扁平而功能化——没有摄影图片，没有全出血的英雄图，没有重复纹理/图案，
  任何交互面上都没有渐变。唯一的插画作品是少量库存风格的扁平矢量插图
  （`welcome.png` 的"WELCOME"场景、一只吉祥物猫、等距 404 场景），仅用于空状态/
  登录页周边装饰——从不用在真实数据画面背后。
- **动效**：极简且纯功能性——侧边栏折叠/展开与顶栏滑动用 0.28s ease-in-out，
  首屏 logo 用 1.5s 不透明度渐显。没有弹跳，没有弹簧缓动，没有装饰性动效。
  表格/数据视图零过渡——内容直接刷新。
- **悬停态**：背景色调变化，而非颜色/透明度偏移——菜单项和按钮悬停时得到浅绿色
  背景 (`#e1fff0`)；描边按钮悬停时获得绿色边框。文字颜色悬停时不做加深/变浅。
- **按压/激活态**：侧边栏/菜单激活项获得持久的浅绿色填充 (`#e1fff0`) 加右边缘
  3px 实心绿色条——这个右边缘强调条（不是左边框，不是填充胶囊）是本系统标志性的
  "你在这里"导航语汇。
- **边框**：浅灰色 1px 细线 (`#e0e0e0` / `#ebeef5`) 界定表格与卡片边缘；边框是
  结构性的，从不作装饰/上色，除了激活态/选中态统计卡片上的绿色描边环。
- **阴影**：非常微弱——悬停态数据卡片用 `0 0 5px #e8e8e8`，固定顶栏/侧边栏用
  `0 1px 4px rgba(0,21,41,.08)`。没有大而柔和的"层级"阴影，没有彩色阴影。
- **圆角**：紧凑而功能化——主内容卡片 2px，统计卡片/输入框/按钮 4px，登录表单
  字段井 5px。胶囊（标签）用 11px。任何地方都不超过约 11px——这不是一个圆润/
  气泡感的品牌。
- **卡片**：扁平填充（页面上 `#fff`，嵌套统计卡片 `#f7f8fa`），细边框或无边框，
  圆角 2–4px，仅在悬停/激活时有阴影——静止状态从不用重阴影。
- **表格**：表头行背景是 **`#f2f3f5`**（`.el-table__header`，逐字取自
  `customtable.scss`）——比嵌套统计卡片/面板标题用的 `#f7f8fa` 深一档；数据行
  保持白色，行间 1px `#ebeef5` 细线。
- **Tabs**：下划线模式，不是胶囊也不是背景切换——激活 tab 用粗体黑字加底部
  2px 实心绿线贯穿整个宽度 (`.tabs-box-resetSty`)，选项高 50px，标签 16px。
- **透明度与模糊**：基本不使用。唯一的透明度是登录页的磨砂输入框
  (`rgba(0,0,0,.1)` 填充在无照片暗背景上)——应用内任何地方都没有背景模糊。
- **图片色调**：现有的少量插画是扁平矢量、饱和、多彩（橙/绿/蓝/黄）的"企业库存
  插画"风格——温暖亲和，仅用于空状态/登录页周边，从不作为滤镜或情绪应用在真实
  数据画面上。
- **布局规则**：固定 190px 侧边栏（折叠态 56px）+ 固定高度 50–58px 顶栏，向下
  滚动时滑走，向上滚动时重新出现；主内容区随侧边栏宽度重排。页面是单列布局：
  筛选栏 → 按钮/工具栏行 → 表格，自上而下，除了首页 KPI 卡片外没有仪表盘式的
  自由网格布局。
- **筛选控件尺寸**：真实的 `filterItemNew.vue` 中，筛选行内的 el-input、
  el-select（多选）、日期区间编辑器统一使用 `style="width:240px"`——本系统中
  Input、Select、DatePicker、InputNumberRange 的默认宽度均已统一为 **240px**，
  保证同一筛选行内各控件尺寸一致。`SelectTimezone` 是一个独立的小尺寸控件
  (150px)，因为它在真实代码中是固定定位在角落的组件，不是筛选行里的字段。

## 图标

- **本仓库中没有内置的图标字体或 SVG 体系。** 应用依赖两个来源，二者在此
  代码库中均未完整vendored：(1) **Element UI 内置图标字体**
  （`el-icon-*` 类——下载、搜索、列、caret 等），以及 (2) 私有的
  **`bi-eleme`/`bi-element-ui`** 包自带的图标集，未在已挂载代码库中出现。
- 本地存在两个自定义 SVG (`dawangge.svg`、`todaynum1.svg`)，通过一个 webpack
  `require.context` 加载进一个 `<svg-icon>` 包装组件
  (`components/SvgIcon`)，渲染 `<svg><use xlink:href="#name"></svg>`——即一种
  SVG 雪碧图模式，不是内联 SVG 也不是给自定义图标用的图标字体。
- **本设计系统采用的替代方案**：由于真实图标集无法获取，本系统衍生的任何新图标
  需求都应使用 **Lucide** 图标（CDN：`unpkg.com/lucide@latest`），描边粗细与
  Element UI 图标字体接近（常规描边，无填充）——此处标注为替代方案，非验证过的
  品牌选择。对于应用本身就这样做的极小号 UI 装饰，优先使用纯 Unicode 字符
  （▾、✕、‹ ›，见 `Select`/`DataTable` 组件）。
- **表情符号**：从不作为图标或界面其他任何用途使用。
- **Unicode 作图标**：是，少量使用——例如分页与下拉可交互提示中的省略号/箭头字符。

## 注意事项

- 最初挂载的代码库中，`bi-eleme` / `bi-element-ui` 专有组件库**不可访问**，只能
  读取其调用位置与 CSS 产出。**后续重新挂载的文件夹提供了 `src/components/` 下的
  真实源码**（`BiDrawer`、`PreserveAnalysis/Color.vue`、`showTableColumn`、
  `customSelect.vue`、`InputNumberRange`、`SelectTimezone` 等），本系统已据此逐一
  校正、精确还原上述组件；仍有少数更深层的实现（如 `SchemaTable`/`BiTable` 内部的
  虚拟滚动、拖拽排序列）依赖运行时数据与更复杂逻辑，未逐行移植。
- 本地仓库中只有两个本地 SVG 图标 (`dawangge.svg`、`todaynum1.svg`)；应用其余的
  图标来自 Element UI 内置图标字体与私有组件库。替代方案见上方"图标"一节。
- `'PingFang SC'` 已通过 `fonts/` 下的本地字体文件（6 个字重）接入，各平台渲染
  一致。
