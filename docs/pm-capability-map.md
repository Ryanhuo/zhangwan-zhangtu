# 掌图产品经理能力地图与演进规划

> **本文是规划蓝本 + 分期进度。** 它定义掌图 seed 要交付给产品经理的开箱能力、这些能力的组织方式,以及从现状到目标的分期路线。**第 1-4 期已落地**:`zhangtu.capabilities.json`(能力清单)、`src/requirements/`(全局需求源)、Shell 工作流只读引导视图、技能 capability/ops 分层(运维技能默认折叠)均已实现(见第五节路线图状态列)。文中标注 🔴🟡🟢 的是各能力的当前成熟度。
>
> 与现有文档的关系:[docs/pm-workflow-harness.md](pm-workflow-harness.md) 是按阶段映射到**现有**权威文件的索引;本文是包含未来结构的**完整规划**。两者不冲突,本文落地后 harness 索引再据此更新。

## 一、定位:seed 要给 PM 开箱即用的能力

`zhangwan-zhangtu` 是产品经理原型工作台的**种子工程 + 可分发框架**。PM 通过 `zhangtu init` 得到一个工作区,`npm start` 打开预览 Shell,即应开箱具备一条完整的原型工作流。

**核心判断:能力的「实现」天然分散在两层,这是对的,不强行合并;真正要补的是「呈现层」——把分散的能力串成 PM 能看懂的流程。**

- **技能层**(`.agents/skills/`):AI 可读的 Markdown 指令。承载需求澄清、原型生成、原型修改、PRD 生成等"指令驱动"能力。
- **脚本层**(`scripts/zhangtu/`):Node CLI + 预览 Shell。承载页面发现、版本管理、发布等"工具驱动"能力。
- **呈现层**(规划新增):能力清单 + 工作流视图,把上面两层串成四大块流程。

## 二、四大块 + 贯穿层(全景)

PM 视角是四大块的一条主线,原型设计内含三个入口:

```
┌─────────────────────────────────────────────────────────────────────┐
│  贯穿层 · 需求锚点                                                       │
│  把「需求」钉在「原型」上,同时是 PRD 的数据来源                            │
└─────────────────────────────────────────────────────────────────────┘
        │作为约束下沉              │被消费              │被消费
        ▼                        ▼                    ▼
┌──────────┐   ┌──────────────────────────┐   ┌─────────┐   ┌─────────┐
│ ① 需求对齐 │──▶│ ② 原型设计               │──▶│ ③ PRD输出 │──▶│ ④ 版本管理│
│          │   │  ├ 2a 老系统迁移           │   │         │   │         │
│          │   │  ├ 2b 从零到一            │   │         │   │         │
│          │   │  └ 2c 原型修改            │   │         │   │         │
└──────────┘   └──────────────────────────┘   └─────────┘   └─────────┘
     ▲                                                            │
     └──────────────── 评审反馈 / 需求变更(回环) ────────────────────┘
```

**四大块不是瀑布,是有回环的**:版本评审出的反馈会回到需求对齐或原型修改。呈现层必须体现这一点,不能画成单向直线。

### 概念边界(避免交叠打架)

- **第一大块的「设计」= 方案/信息架构层面的设计决策**(看板还是列表、几步流程),靠 `explore-options`;**视觉设计基底**(zhangwan-design 的颜色/组件)是**第二大块的前置约束**,不算第一块产出。
- **「原型修改」≠「版本/迭代」**:原型修改(2c)是改页面代码/内容的动作;版本管理(④)里的 `iteration` 是给某个原型状态打的快照。两者是不同动作,术语上分别叫「原型修改」和「评审版本」,不要都叫"迭代"。

## 三、六条底层能力地图

呈现层按四大块给 PM 看;数据层把"原型设计"拆成三条独立能力(迁移/新建/修改的技能、输入、注意事项各不相同)。这六条就是 `zhangtu.capabilities.json` 的条目蓝本。

| # | 能力 | 归属大块 | 输入(artifact in) | 触发的技能 / 命令 | 交接产物(artifact out) | 当前支持度与缺口 |
|---|---|---|---|---|---|---|
| 1 | **需求对齐** | ① | 用户口述需求、参考资料 | `requirements-exploration`、`explore-options` | 确认的需求 + 设计决策快照 | 🟡 有技能,缺需求独立落脚点(见四·1) |
| 2 | **老系统迁移** | ②a | 旧系统页面 / 截图 / 导出原型 | `screenshot-to-prototype` + [legacy-prototype-import-guide.md](legacy-prototype-import-guide.md) / `preview` | 新页面(zhangwan-design 重做,内嵌锚点) | 🟡 有指南无 Shell 入口 |
| 3 | **从零到一** | ②b | 确认的需求 + 设计决策 | `zhangwan-design`、`zhangtu-init-prototype-project` + [prototype-development-guide.md](prototype-development-guide.md) / `preview` | 满足页面契约的新页面 | 🟢 支持完整 |
| 4 | **原型修改** | ②c | 已有页面 + 改动点 | `quick-edit.mjs`(改文案/注 CSS) + 直接改码 / `preview` | 修改后的页面 | 🟡 机制有,无编排入口 |
| 5 | **PRD 输出** | ③ | 页面实现 + `spec.md` + 需求锚点 | `prd-generator`(默认) / `publish-iteration` | Markdown PRD | 🟡 默认通道已定(见四·2) |
| 6 | **版本管理** | ④ | 页面集合 | `iterations.mjs` + Shell / `create-iteration`、`publish-iteration` | 版本快照 + 远程分享链接 | 🟢 支持完整(发布需配 proto-hub token) |

### 数据流与交接物

四大块靠中间产物传递,不是孤岛:

```
① 需求对齐 →产出→ 确认的需求 + 设计决策
② 原型设计 →产出→ 页面(内嵌需求锚点)
③ PRD 输出 ←消费← 页面实现 + spec.md + 需求锚点
④ 版本管理 ←消费← 页面集合快照 →发布→ 分享链接
```

**需求锚点(`data-zhangtu-requirement-anchor` + 需求模块)是贯穿层**:它连接第一块(需求)与第二块(原型),又是第三块(PRD)自动生成的数据来源。规划呈现时必须把它显式画出来。

## 四、关键设计决策

### 1. 需求先于原型(数据流反转)—— 中等重构,第 2 期单列子项

**现状是「需求依附原型」**:需求写在页面目录内的 `zhangtu.requirements.ts`,`discovery.mjs` 用 vm 沙箱从页面里读出,页面用锚点标记区域。即"先有页面,需求挂在页面上"。

**目标是「需求先于原型」**:需求作为独立数据源先存在,原型页面反过来引用它。

```
src/requirements/                 ← 规划新增:全局需求源(需求先于原型)
  └ <需求分组>/
      └ req-001.md (或 .ts)       ← 一条需求:id / 标题 / 正文 / 验收 / 归属大块

src/pages/<页面>/                  ← 原型侧
  └ zhangtu.requirements.ts        ← 职责退化:不再"定义"需求,
                                     只声明"本页引用了哪些全局需求 id + 锚点映射"
  └ index.tsx 里 data-...anchor    ← 锚点反向引用全局需求 id
```

**关键变化**:
- 需求事实源从**页面内**上移到**全局** `src/requirements/`。
- 一条需求可被**多个页面/区域**引用(一对多),这是现在做不到的。
- `zhangtu.requirements.ts` 从"需求定义"降级为"引用清单",甚至可不再需要。
- 受影响代码:`discovery.mjs`(扫全局需求源)、需求锚点机制、`prd-generator` 数据来源。

**为什么放 `src/requirements/` 而非 `.zhangtu/`**:需求是人写的产品资产,要能 diff、进 git;`.zhangtu/` 是运行时生成状态、约定不可手改。

**风险控制**:这是本轮唯一触及现有核心机制(discovery + 需求锚点)的改动。第 2 期单列为独立子项推进,**保留对旧 `zhangtu.requirements.ts` 的兼容读取**,不一次性推翻。

### 2. PRD 默认通道 = prd-generator

第三大块开箱默认走 `prd-generator`(研发测试向的结构化 Markdown PRD)。另两条转**可选**:

- `pm-prd-html-writer`(imported 技能,HTML 可评审版):PM 需要给业务方评审时手动选。
- `proto-hub` 发布兜底:发版时未提供 PRD 的自动兜底(合并 spec + 需求锚点)。

能力清单里 PRD 能力的 `defaultChannel` = `prd-generator`。

### 3. 能力清单归属 = 框架侧,工作区可覆盖

`zhangtu.capabilities.json` 由框架侧维护,`zhangtu init` 时复制进工作区,`sync-system-files` 随框架升级下发;工作区放同名文件则覆盖(自定义逃生舱)。保证所有 PM 工作区开箱统一。

### 4. 工作流入口 = 只读引导(第一版)—— ✅ 已实现(第 3 期)

Shell 侧边栏系统区新增「工作流」入口(与「技能」「设计系统」并列),主区渲染四大块 + 贯穿层 + 回环的流程卡,每张卡说明该阶段做什么(输入 → 产出、技能/命令、支持度),块级跳转到对应技能库 / 设计系统 / 版本管理。**只引导、不直接触发**;点击触发(Shell↔AI 调用链)留到更后期。实现落点:`scripts/zhangtu/shell.html` 的 `renderWorkflowView()` / `attachWorkflowEvents()` + `zhangtu-workflow` 路由接线,数据来自 `manifest.capabilities`。

## 五、分期路线图

每期独立可交付,确认后才动手。

| 期 | 状态 | 内容 | 价值 |
|---|---|---|---|
| **1 · 地基** | ✅ 已完成 | 清 `.zhangtu/` 残留(海外文件夹 / 失效迭代 / 旧 publish 产物);处理旧 `src/design-system/zhangwan-ui/` 目录;修主题键名 bug(config `accent*` → 代码认的 `primaryColor` 等,对齐 zhangwan-design 绿 `#00bf8a`);把「设计系统」像「技能」一样拎成系统页 | seed 干净、开箱视觉正确、设计系统归位 |
| **2 · 能力清单 + 需求反转** | ✅ 已完成 | 框架侧落地 `zhangtu.capabilities.json`(六条能力)+ 进 manifest + init/sync 下发;新增 `src/requirements/` 全局需求源(`.md` + frontmatter,兼容旧 `zhangtu.requirements.ts`);PRD 默认通道声明;`doctor` 加「需求源」检查 | 五大能力有单一事实源;需求先于原型 |
| **3 · 工作流视图** | ✅ 已完成 | Shell 加「工作流」只读引导入口,渲染四大块 + 贯穿层 + 回环,消费 `manifest.capabilities`,块级真跳转(设计系统 / 技能库 / 版本管理) | PM 开箱即见流程 |
| **4 · 技能收敛** | ✅ 已完成 | 能力技能 vs 框架运维技能分层(`tier: capability|ops`;`zhangtu-installer` 等运维技能在技能页默认折叠) | 技能库无噪音 |

## 六、地基期(第 1 期)已知待清理项

供第 1 期执行时逐项核对,均为只读调查已确认:

- `.zhangtu/page-library.json`:残留文件夹「海外」(id `folder-mr0glm1o-gr481m`),归类了已删除的 `supply-chain-management` 页。
- `.zhangtu/iterations/`:两个失效迭代(`itr_e9f4e3b41189.json`「V2.2 hr管理」、`itr_46620bac446f.json`「12」),引用已删页面,`doctor` 会报 error。
- `.zhangtu/publish/`:一批旧发布产物(hr-management、supply-chain 等已删页面的构建物)。
- `.zhangtu/preview/`:`12`、`v2-2-hr` 两个旧版本 manifest(保留 `project`)。
- `src/design-system/zhangwan-ui/`:疑似旧 skill `zhangwanUI`(已废弃,现为 `zhangwan-design`)的残留目录,需确认后处理。
- `zhangtu.config.json` theme:键名 `accent/accentStrong/accentSoft` 与代码期望的 `primaryColor/accentColor/backgroundColor/surfaceColor/textColor` 不匹配,当前静默失效、走默认蓝。

## 七、未决 / 后续

- 工作流视图的"点击触发能力"(Shell↔AI 调用链)——第 4 期之后再评估。当前第 3 期只做只读引导 + 块级跳转(设计系统 / 技能库 / 版本管理),不触发 AI。
- ~~`src/requirements/` 里单条需求用 `.md` 还是 `.ts`~~——**已定:用 `.md` + frontmatter**(第 2 期落地,discovery 新增极小 frontmatter 解析器,无新依赖)。
- 需求与版本快照的关系(版本是否应快照当时的需求状态)——**第 2 期未动 `requirementSnapshots` 逻辑**(需求反转采用纯加法、不推翻旧机制),此项顺延待后续单列。
