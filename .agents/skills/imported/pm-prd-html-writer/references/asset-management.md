# 资源管理和文件组织规范

## 概述

本文档定义了 HTML PRD 的资源文件组织、命名规范、路径引用规则以及自动化管理策略，确保 PRD 项目结构清晰、易于维护和交付。

> **Axhub Make 仓库约定**：HTML PRD **必须**输出到 `src/docs/PRD/[文档名称]/`，每个文件夹自包含主 HTML 与 `assets/`，与 `rules/documentation-guide.md`、`rules/resource-management-guide.md` 一致。

***

## 1. 标准目录结构

### 1.1 完整目录树（强制）

```
aipn/                                        # Axhub Make 仓库根目录
├── src/docs/
│   ├── PRD/                                 # ★ HTML PRD 唯一交付根目录
│   │   ├── README.md                        # PRD 索引
│   │   └── [文档名称]/                      # 如：管理模式、地图模式消息报送
│   │       ├── README.md                    # 该 PRD 打开说明
│   │       ├── [文档名称]_PRD_V[版本].html  # 主 HTML（必须）
│   │       ├── [文档名称]_PRD_V[版本].md    # Markdown 源稿（可选）
│   │       └── assets/                      # 本 PRD 专属资源（必须）
│   │           ├── screenshots/
│   │           ├── prototypes/
│   │           ├── scripts/mermaid.min.js
│   │           └── images/
│   ├── _deliverable/                        # 临时 zip 打包输出（可选）
│   └── templates/                           # MD 模板（非 PRD 交付物）
│
├── src/prototypes/                          # 可运行原型源码（输入源）
│   └── [name]/spec.md + index.tsx
│
└── skills/pm-prd-html-writer/scripts/       # Skill 自动化脚本
```

### 1.2 已废弃路径（勿再使用）

| 旧路径 | 说明 |
|--------|------|
| `src/docs/[名称]_PRD_V*.html` | 根目录散落 HTML，已废弃 |
| `src/docs/assets/` 共享资源 | 多 PRD 混放，已废弃；每个 PRD 使用自有 `assets/` |

### 1.3 目录说明

| 目录/文件                             | 是否必须 | 说明                  |
| --------------------------------- | ---- | ------------------- |
| `PRD/[名称]/[名称]_PRD_V*.html`   | ✅ 必须 | 主 HTML PRD，位于 PRD 子文件夹根级 |
| `PRD/[名称]/README.md`            | ✅ 必须 | 打开方式与内容清单 |
| `PRD/[名称]/assets/screenshots/`  | ✅ 必须 | 本 PRD 专属截图 |
| `PRD/[名称]/assets/prototypes/`   | ⚪ 推荐 | 离线 iframe 原型 |
| `PRD/[名称]/assets/scripts/mermaid.min.js` | ⚪ 推荐 | 离线 Mermaid |
| `PRD/[名称]/[名称]_PRD_V*.md`     | ⚪ 可选 | Markdown 源稿 |

***

## 2. 文件命名规范

### 2.1 HTML PRD 文件

**格式**: `[产品名]_PRD_V[主版本].[次版本].html`

**规则**：

- 产品名使用 PascalCase 或中文（无空格）
- 版本号遵循语义化版本控制（SemVer）
- 主版本号表示重大变更，次版本号表示小功能迭代

**正确示例**:

```
UserCenter_PRD_V1.0.html
OrderSystem_PRD_V2.1.html
PaymentModule_PRD_V3.2.html
智能客服_PRD_V1.0.html
```

**错误示例**:

```
user center prd.html          ❌ 包含空格
UserCenter_v1.html            ❌ 版本格式不规范
UserCenter_PRD_Final.html     ❌ 不使用 "Final" 等模糊标识
user-center-prd-2024.html     ❌ 不含日期
```

### 2.2 截图文件

**格式**: `{fullpage | section-id}.png/jpeg`

**命名规则**:

| 文件名                | 用途           | 示例                                                |
| ------------------ | ------------ | ------------------------------------------------- |
| `fullpage.png`     | 全页面截图（必须）    | `fullpage.png`                                    |
| `{section-id}.png` | 分节截图（按章节 ID） | `overview.png`, `user-flow.png`, `api-design.png` |

**说明**:

- section-id 应与 HTML 中的章节 ID 对应
- 优先使用 PNG 格式（支持透明背景），JPEG 用于照片类图片
- 分辨率建议：1920x1080 或更高

### 2.3 图片资源文件

**格式**: `{描述}-{用途}.{png|jpg|svg}`

**命名规则**:

- 使用 kebab-case（短横线分隔）
- 描述部分简明扼要（英文或拼音）
- 用途部分标明图片类型

**正确示例**:

```
login-page-mockup.png          # 登录页 UI 设计稿
order-flow-chart.svg           # 订单流程图
dashboard-preview.jpg          # 仪表盘预览图
error-state-screenshot.png     # 错误状态截图
icon-user-avatar.svg           # 用户头像图标
```

**分类存放**:

| 子目录           | 存放内容             | 示例文件                                   |
| ------------- | ---------------- | -------------------------------------- |
| `ui-mockups/` | UI 界面设计稿         | `login-page-mockup.png`                |
| `flowcharts/` | 业务流程图（非 Mermaid） | `order-process.svg`                    |
| `icons/`      | 图标资源             | `logo.png`, `status-icons/success.svg` |

### 2.4 原型目录

**格式**: `{kebab-case-feature-name}/`

**命名规则**:

- 使用 kebab-case（短横线连接单词）
- 名称应清晰表达原型功能
- 避免过于笼统的名称（如 `prototype1/`, `test/`）

**正确示例**:

```
user-management/               # 用户管理原型
order-list-filter/             # 订单列表筛选原型
payment-checkout-flow/         # 支付结账流程原型
notification-settings/         # 通知设置原型
```

**内部结构**:
每个原型目录应包含标准化的子目录结构：

```
feature-name/
├── index.html                 # 入口文件（必须）
├── css/                       # 样式文件
│   └── style.css
├── js/                        # 交互脚本
│   └── main.js
└── assets/                    # 原型专用资源
    └── images/
```

***

## 3. 路径引用规则

### 3.1 HTML 中的相对路径规范

**基本原则**:

- 优先使用相对路径，确保可移植性
- 避免使用绝对路径（除非用于部署后的线上环境）
- 禁止使用 `../` 访问上级目录（破坏封装性）
- 外部链接需标注依赖关系

**路径引用对照表**:

| 路径写法                                     | 状态    | 说明                    |
| ---------------------------------------- | ----- | --------------------- |
| `./assets/screenshots/fullpage.png`      | ✅ 推荐  | 显式相对路径，清晰明了           |
| `assets/images/ui/login.png`             | ✅ 可用  | 简写形式，等价于 `./`         |
| `/prototypes/user-management/index.html` | ⚠️ 注意 | 绝对路径，仅适用于部署后的 Web 服务器 |
| `../other-doc/image.png`                 | ❌ 禁止  | 访问上级目录，破坏项目结构         |
| `https://cdn.example.com/image.png`      | ⚠️ 谨慎 | 外链依赖，需在网络可用时标注        |

### 3.2 不同场景的路径示例

**HTML 内嵌图片**:

```html
<!-- UI 设计稿 -->
<img src="./assets/images/ui-mockups/dashboard.png" alt="仪表盘界面">

<!-- 流程图 -->
<img src="./assets/images/order-flow-chart.svg" alt="订单流程">
```

**CSS 背景图引用**:

```css
.hero-section {
  background-image: url('../assets/images/ui-mockups/hero-banner.png');
  background-size: cover;
}
```

**iframe 嵌入原型**（须用预览缩放 + 点击全屏，避免宽屏原型右侧被裁切）：

```html
<div class="prototype-iframe-preview" data-design-width="1280" data-design-height="800">
  <div class="prototype-iframe-hint">点击全屏交互</div>
  <div class="prototype-iframe-scale">
    <iframe class="interactive-prototype interactive-prototype--preview"
            src="./assets/prototypes/user-management/index.html"
            sandbox="allow-scripts allow-same-origin allow-forms"
            title="用户管理原型">
    </iframe>
  </div>
</div>
```

### 3.3 路径大小写注意事项

| 操作系统    | 区分大小写     | 建议             |
| ------- | --------- | -------------- |
| Windows | ❌ 不区分     | 开发时容易忽视问题      |
| macOS   | ❌ 不区分（默认） | 可能隐藏潜在问题       |
| Linux   | ✅ 区分      | 部署后可能出现 404 错误 |

**最佳实践**:

- 所有路径统一使用**小写字母**
- 文件夹和文件名保持一致的命名风格
- 在 Linux 环境测试后再交付

***

## 4. 自动化脚本命令

Skill 提供了一套命令行工具用于资源的自动化管理。

### 4.1 初始化资源目录

创建标准的资源目录结构：

```bash
node skills/pm-prd-html-writer/scripts/init-assets.mjs src/docs/PRD/[文档名称]
```

**执行效果**:

- 在指定路径下创建 `assets/` 目录及其子目录
- 创建 `.gitkeep` 文件以保留空目录结构
- 生成 `README.md` 说明各目录用途

**参数选项**:

```bash
# 使用完整路径
node skills/pm-prd-html-writer/scripts/init-assets.mjs "d:/aipn/src/docs"

# 仅创建特定子目录
node skills/pm-prd-html-writer/scripts/init-assets.mjs src/docs --only screenshots,images

# 强制覆盖已有目录
node skills/pm-prd-html-writer/scripts/init-assets.mjs src/docs --force
```

### 4.2 清理旧资源

清理过期资源文件，保留当前版本所需的内容：

```bash
node skills/pm-prd-html-writer/scripts/clean-assets.mjs src/docs --keep-version V1.0
```

**清理规则**:

- 删除 `_archive/` 目录中超过 3 个版本的旧归档
- 清理 `screenshots/` 中不属于当前版本的截图
- 移除 `images/` 中未被 HTML 引用的孤儿文件（需确认）
- 保留 `prototypes/` 目录（通常跨版本复用）

**安全模式**（默认开启）:

```bash
# 预览将要删除的文件（不实际删除）
node skills/pm-prd-html-writer/scripts/clean-assets.mjs src/docs --dry-run
```

### 4.3 验证资源完整性

检查项目中是否存在缺失或损坏的资源文件：

```bash
node skills/pm-prd-html-writer/scripts/validate-assets.mjs \
  src/docs/PRD/[文档名称]/[文档名称]_PRD_V[版本].html
```

**检查项**:

| 检查项         | 说明                      | 错误级别  |
| ----------- | ----------------------- | ----- |
| **必填文件存在性** | fullpage.png 是否存在       | 🔴 严重 |
| **路径引用有效性** | HTML 中引用的资源是否真实存在       | 🟡 警告 |
| **文件大小合理性** | 图片是否异常过大（>5MB）或过小（<1KB） | 🟡 警告 |
| **文件格式正确性** | 扩展名与实际内容是否匹配            | 🟡 警告 |
| **外链可达性**   | CDN 链接是否可访问             | 🔵 信息 |
| **重复文件检测**  | 是否存在内容相同的重复文件           | 🔵 信息 |

**输出示例**:

```
✅ 验证通过: src/docs/Product_PRD_V1.0.html

📊 统计信息:
  - 总引用数: 23
  - 有效引用: 22
  - 缺失引用: 1
  - 警告项: 2

❌ 错误详情:
  [严重] 缺少必需文件: assets/screenshots/fullpage.png
  
🟡 警告详情:
  [警告] 引用不存在: ./assets/images/old-design.png (第 45 行)
  [警告] 文件过大: assets/images/high-res-photo.png (8.2MB)
```

### 4.5 多状态原型截图

对含多种 UI 状态的原型模块批量截图：

```bash
node skills/pm-prd-html-writer/scripts/capture-prototype-states.mjs \
  --url http://127.0.0.1:51720/prototypes/management-mode/
```

输出：`src/docs/assets/screenshots/<prototype-name>/`，在 HTML 中以 `prototype-gallery` 引用。

### 4.6 导出离线 iframe 原型

```bash
node skills/pm-prd-html-writer/scripts/export-prototype-for-prd.mjs \
  --prototype [prototype-name] \
  --prd src/docs/PRD/[文档名称]/[文档名称]_PRD_V[版本].html
```

输出：`src/docs/assets/prototypes/<name>/index.html`，iframe `src` 使用 `./assets/prototypes/<name>/index.html`。

### 4.7 英文术语标注（可选）

```bash
node skills/pm-prd-html-writer/scripts/localize-prd-english.mjs \
  src/docs/管理模式_PRD_V1.0.html
```

正文英文转为 `英文（中文含义）`；跳过 `src`/`href`/`<code>` 内文本。

### 4.4 打包交付

将 PRD 及其必要资源打包为可分发的格式：

```bash
node skills/pm-prd-html-writer/scripts/package-prd.mjs src/docs/Product_PRD_V1.0.html --output src/docs/_deliverable/
```

**打包内容**:

- 主 HTML 文件（内联关键 CSS）
- `assets/screenshots/` 目录（全页面截图 + 分节截图）
- `assets/images/` 目录（仅包含被引用的图片）
- `README.md` 交付说明文档
- `CHANGELOG.md` 变更日志（产品级；Skill 自身修订见 `skills/pm-prd-html-writer/CHANGELOG.md`）

**打包选项**:

```bash
# 指定输出格式（zip 或 dir）
node skills/pm-prd-html-writer/scripts/package-prd.mjs src/docs/Product_PRD_V1.0.html --format zip

# 包含原型快照目录
node skills/pm-prd-html-writer/scripts/package-prd.mjs src/docs/Product_PRD_V1.0.html --include-prototypes

# 生成带日期戳的目录/压缩包名
node skills/pm-prd-html-writer/scripts/package-prd.mjs src/docs/Product_PRD_V1.0.html --timestamp
```

**输出示例**:

```
✅ 打包成功!

📦 交付包信息:
  - 文件名: Product_PRD_V1.0_20260610.zip
  - 大小: 4.8 MB
  - 文件数: 28
  - 包含内容: HTML (1), 截图 (3), 图片 (18), 文档 (6)
  
📁 输出路径: ./deliverable/Product_PRD_V1.0_20260610.zip
```

***

## 5. 版本管理策略

### 5.1 版本演进流程

每次 PRD 更新时应遵循以下流程：

```
V1.0 (初始版本)
  ↓ 更新内容
V1.1 (小版本迭代)
  ↓ 功能变更
V2.0 (主版本升级)
  ↓ ...
```

**具体操作**:

1. **创建新版本文件**
   ```bash
   # 复制并重命名
   cp src/docs/Product_PRD_V1.0.html src/docs/Product_PRD_V1.1.html

   # 更新 HTML 内部的版本号和修订日期
   ```
2. **归档旧版本资源**
   ```bash
   # 将旧版 assets 移至归档目录
   mv src/docs/assets/_archive/V1.0 src/docs/assets/_archive/V1.0_backup

   # 创建新的 assets 目录（使用 init-assets.mjs）
   ```
3. **更新修订记录**

   在 HTML 头部的修订表中记录变更：
   ```html
   <table class="revision-history">
     <thead>
       <tr><th>版本</th><th>日期</th><th>作者</th><th>变更说明</th></tr>
     </thead>
     <tbody>
       <tr><td>V1.1</td><td>2026-06-10</td><td>张三</td><td>新增支付模块</td></tr>
       <tr><td>V1.0</td><td>2026-05-15</td><td>李四</td><td>初始版本</td></tr>
     </tbody>
   </table>
   ```

### 5.2 归档目录结构

```
src/docs/
├── _archive/                          # 历史版本备份（可选）
│   ├── V1.0/
│   │   ├── UserCenter_PRD_V1.0.html
│   │   └── assets/screenshots/
│   └── V1.1/
│       └── UserCenter_PRD_V1.1.html
├── UserCenter_PRD_V2.0.html           # 当前工作版本
├── _deliverable/                      # 打包输出
└── assets/                            # 当前共享资源
```

### 5.3 Git LFS 配置（可选）

对于使用 Git 进行版本控制的项目，建议使用 Git LFS 管理大文件：

**安装和初始化**:

```bash
# 安装 Git LFS
git lfs install

# 追踪二进制文件类型
git lfs track "*.png"
git lfs track "*.jpg"
git lfs track "*.jpeg"
git lfs track "*.gif"

# 将配置保存到 .gitattributes
git add .gitattributes
git commit -m "配置 Git LFS 追踪图片文件"
```

**优势**:

- 避免 Git 仓库体积膨胀
- 加快克隆和拉取速度
- 保留完整的版本历史

**注意事项**:

- 需要 Git LFS 服务端支持（GitHub、GitLab 等均已支持）
- 初次克隆需要下载 LFS 文件，耗时较长

***

## 6. 最佳实践

### 6.1 图片优化

**压缩工具推荐**:

- **TinyPNG** (<https://tinypng.com/>) - 在线压缩，支持批量
- **ImageOptim** (Mac) / **FileOptimizer** (Windows) - 本地工具
- **sharp** (Node.js) - 可集成到构建脚本中

**优化目标**:

| 图片类型    | 最大文件大小  | 建议格式          |
| ------- | ------- | ------------- |
| UI 截图   | < 500KB | PNG（无损）       |
| 照片类     | < 300KB | JPEG (85% 质量) |
| 图标/Logo | < 50KB  | SVG（矢量）或 PNG  |
| 流程图     | < 200KB | SVG（优先）或 PNG  |

**批量压缩脚本示例**:

```bash
# 使用 sharp CLI 工具批量压缩
for file in assets/images/**/*.png; do
  sharp "$file" -o "$file" --quality 80 --progressive
done
```

### 6.2 原型轻量化

确保可交互原型文件体积合理：

**限制**:

- 单个原型 HTML + 关联资源 < **1MB**
- 单个 HTML 文件 < **200KB**
- CSS 文件 < **50KB**
- JS 文件 < **100KB**

**优化技巧**:

- 压缩 CSS 和 JS（移除空格、注释）
- 合并多个 CSS/JS 文件
- 使用 Base64 内联小图标（< 10KB）
- 延迟加载非关键资源
- 使用 CSS Sprites 合并图标

**检查命令**:

```bash
# 查看目录大小
du -sh assets/prototypes/*

# 查找超过 1MB 的文件
find assets/prototypes -size +1M -exec ls -lh {} \;
```

### 6.3 路径一致性

**原则**: 始终使用相对路径，确保项目可移植。

**测试方法**:

```bash
# 在不同位置打开 HTML，检查资源是否正常显示
# Windows: 双击 HTML 文件
# macOS: open Product_PRD_V1.0.html
# Linux: xdg-open Product_PRD_V1.0.html
```

**常见问题修复**:

| 问题             | 原因      | 解决方案            |
| -------------- | ------- | --------------- |
| 本地正常，服务器上图片不显示 | 大小写不一致  | 统一改为小写          |
| 移动位置后资源丢失      | 使用了绝对路径 | 改为相对路径          |
| iframe 内容无法加载  | 跨域限制    | 添加 `sandbox` 属性 |

### 6.4 备份策略

**三层备份机制**:

1. **本地备份**
   - 定期复制到外部硬盘或 NAS
   - 使用云同步工具（OneDrive、Dropbox）
2. **版本控制备份**
   - 提交到 Git 仓库（GitHub/GitLab）
   - 重要节点打 Tag 标记
3. **云端备份**
   - 上传到云存储服务（阿里云 OSS、AWS S3）
   - 设置自动备份计划任务

**重要提醒**:

- 每次大版本更新前务必备份
- 归档旧版本前确认完整性
- 保留至少最近 3 个版本的备份

### 6.5 清理机制

定期清理项目中的冗余文件，保持目录整洁：

**自动清理脚本**（可加入 CI/CD）:

```bash
#!/bin/bash
# cleanup-unused-assets.sh

PROJECT_DIR="$1"

echo "🔍 开始扫描未使用的资源文件..."

# 查找所有被 HTML 引用的文件
REFERENCED_FILES=$(grep -ohP '(?:src|href)="([^"]+)"' "$PROJECT_DIR"/*.html \
  | sed 's/src="//;s/href="//;s/"$//' \
  | sed 's/\?.*//' \
  | sort -u)

# 查找 assets 目录下的所有文件
ALL_ASSETS=$(find "$PROJECT_DIR/assets" -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.svg" \) )

# 找出未被引用的文件
UNUSED_FILES=()
for asset in $ALL_ASSETS; do
  REL_PATH=${asset#$PROJECT_DIR/}
  if ! echo "$REFERENCED_FILES" | grep -q "$REL_PATH"; then
    UNUSED_FILES+=("$asset")
  fi
done

# 输出结果
if [ ${#UNUSED_FILES[@]} -eq 0 ]; then
  echo "✅ 所有资源文件均已被引用"
else
  echo "⚠️ 发现 ${#UNUSED_FILES[@]} 个未引用的文件:"
  printf '%s\n' "${UNUSED_FILES[@]}"
  
  read -p "是否删除这些文件？(y/N) " confirm
  if [[ $confirm == [yY] ]]; then
    rm "${UNUSED_FILES[@]}"
    echo "🗑️ 已清理 ${#UNUSED_FILES[@]} 个文件"
  fi
fi
```

**使用频率建议**:

- 每次版本发布前运行一次
- 每月定期全面清理一次

***

## 7. 常见问题排查

### 7.1 图片不显示

**症状**: HTML 中插入的图片无法显示，显示破损图标。

**排查步骤**:

1. **检查路径拼写**
   ```bash
   # 确认文件实际位置
   ls -la assets/images/ui/login.png

   # 对比 HTML 中的路径
   grep "login.png" Product_PRD_V1.0.html
   ```
2. **检查大小写**（Linux 环境）
   ```bash
   # 查看实际文件名（精确大小写）
   ls assets/images/

   # 如果是 Login.PNG 但引用的是 login.png，则会导致 404
   ```
3. **检查文件权限**
   ```bash
   # 确保文件可读
   chmod 644 assets/images/*.png
   ```
4. **浏览器开发者工具检查**
   - 按 F12 打开开发者工具
   - 切换到 Network（网络）标签
   - 刷新页面，查看图片请求的状态码
   - 404 表示路径错误，403 表示权限不足

**解决方案**:

- 统一使用小写文件名和路径
- 使用相对路径而非绝对路径
- 在目标部署环境测试

### 7.2 iframe 跨域问题

**症状**: 嵌入的原型页面无法加载或功能受限。

**原因**: 浏览器的同源策略（Same-Origin Policy）阻止跨域访问。

**解决方案**:

**方案一：添加 sandbox 属性**（推荐）

```html
<iframe 
  src="./assets/prototypes/demo/index.html"
  sandbox="allow-scripts allow-same-origin allow-forms"
  width="100%"
  height="600">
</iframe>
```

**常用 sandbox 值**:

- `allow-scripts`: 允许执行 JavaScript
- `allow-same-origin`: 允许同源（否则 iframe 内容视为独特来源）
- `allow-forms`: 允许提交表单
- `allow-popups`: 允许弹出窗口

**方案二：使用代理服务器**（部署环境）

```nginx
# Nginx 配置示例
location /prototypes/ {
    proxy_pass http://localhost:8080/;
    add_header X-Frame-Options "SAMEORIGIN";
}
```

### 7.3 截图空白或异常

**症状**: 使用 Playwright 截图时，Mermaid 图表区域显示空白或只显示源码。

**可能原因及解决**:

| 原因                | 症状        | 解决方案                |
| ----------------- | --------- | ------------------- |
| **Mermaid 未加载**   | 整个图表区域空白  | 检查 CDN 连接或本地文件路径    |
| **渲染时间不足**        | 显示部分图表或闪烁 | 增加等待时间至 5-10 秒      |
| **JavaScript 报错** | 控制台有红色错误  | 检查 Mermaid 语法是否正确   |
| **CSS 未加载**       | 图表无样式     | 确保 `networkidle` 状态 |
| **视口尺寸问题**        | 图表被截断     | 设置合适的 viewport 尺寸   |

**调试代码**:

```javascript
// 增加详细的日志输出
await page.goto(url, { waitUntil: 'networkidle' });

console.log('页面加载完成');

// 检查 Mermaid 是否存在
const mermaidExists = await page.evaluate(() => typeof window.mermaid !== 'undefined');
console.log('Mermaid 是否加载:', mermaidExists);

// 检查是否有渲染错误
const errors = await page.evaluate(() => {
  return Array.from(document.querySelectorAll('.mermaid-error')).length;
});
console.log('渲染错误数量:', errors);

// 等待渲染完成
try {
  await page.waitForSelector('.mermaid svg', { timeout: 10000 });
  console.log('Mermaid 渲染成功');
} catch (e) {
  console.error('Mermaid 渲染超时:', e.message);
  
  // 截取调试截图
  await page.screenshot({ path: 'debug-screenshot.png' });
  console.log('已保存调试截图');
}
```

### 7.4 文件体积过大

**症状**: 项目文件夹或打包后的 ZIP 文件异常庞大（> 50MB）。

**排查步骤**:

1. **分析目录大小**
   ```bash
   # 查看 assets 各子目录的大小
   du -sh assets/*

   # 示例输出:
   # 4.5M    assets/images
   # 2.1M    assets/screenshots
   # 15M     assets/prototypes
   ```
2. **查找超大文件**
   ```bash
   # 找出大于 5MB 的文件
   find assets -type f -size +5M -exec ls -lh {} \; | awk '{print $5, $9}'

   # 按大小排序显示前 10 个最大文件
   find assets -type f -exec ls -lS {} \; | head -11
   ```
3. **检查是否包含意外文件**
   ```bash
   # 查找不应存在的文件类型
   find assets -name "*.psd" -o -name "*.ai" -o -name "*.sketch"

   # 查找隐藏文件
   find assets -name ".*"

   # 查找 node_modules（不应出现在 assets 中）
   find assets -name "node_modules" -type d
   ```

**解决方案**:

| 问题                 | 处理方式                     |
| ------------------ | ------------------------ |
| 高清原图未压缩            | 使用 TinyPNG 压缩，降低分辨率至 2x  |
| 包含 PSD/AI 源文件      | 移除或归档到其他位置               |
| 原型包含 node_modules | 删除 node_modules，改用 CDN  |
| 截图分辨率过高            | 降低至 1920x1080 或 1440x900 |
| 重复文件               | 使用清理脚本去重                 |

**预防措施**:

- 在 `.gitignore` 中排除不必要的文件类型
- 在提交前运行 `validate-assets.mjs` 检查
- 建立文件大小限制规范（如单文件 < 5MB）

***

## 8. 快速参考清单

### 8.1 新建 PRD 项目时的检查清单

- [ ] 创建标准目录结构（使用 `init-assets.mjs`）
- [ ] 按照命名规范创建主 HTML 文件
- [ ] 配置 Mermaid：复制 `mermaid.min.js` 到 `assets/scripts/`
- [ ] 多状态模块使用 `prototype-gallery` + `capture-prototype-states.mjs`
- [ ] iframe 默认 `./assets/prototypes/...`（非 `about:blank`）
- [ ] 设置正确的相对路径引用
- [ ] 添加修订历史表格
- [ ] 初始化 Git 仓库（如适用）
- [ ] 配置 `.gitignore` 排除规则

### 8.2 发布新版本时的检查清单

- [ ] 更新版本号（主版本或次版本）
- [ ] 归档旧版本到 `_archive/` 目录
- [ ] 更新修订历史记录
- [ ] 重新生成截图
- [ ] 运行 `validate-assets.mjs` 验证资源完整性
- [ ] 运行 `clean-assets.mjs` 清理冗余文件
- [ ] 执行 `package-prd.mjs` 打包交付物
- [ ] 提交到版本控制系统
- [ ] 创建 Git Tag 标记版本

### 8.3 交付前的最终检查

- [ ] 在不同浏览器中测试（Chrome、Firefox、Safari、Edge）
- [ ] 在离线环境下测试（断网后打开 HTML）
- [ ] 检查所有图片和链接正常显示
- [ ] 验证 Mermaid 图表渲染正确（本地 bundle，非 CDN）
- [ ] 测试 iframe 离线原型可正常加载
- [ ] 测试 TOC 章节号与折叠、Lightbox 放大截图
- [ ] 确认文件总大小在合理范围内（< 20MB）
- [ ] 检查无敏感信息泄露（密码、API Key 等）
- [ ] 确认 README 或交付说明文档完整

***

## 附录 A: .gitignore 模板

```gitignore
# 依赖目录
node_modules/

# 构建输出
dist/
build/
.deliverable/

# 编辑器配置
.vscode/
.idea/
*.swp
*.swo

# 操作系统文件
.DS_Store
Thumbs.db
desktop.ini

# 临时文件
*.tmp
*.temp
*.log

# 大文件（使用 Git LFS 管理）
*.psd
*.ai
*.sketch

# 敏感信息
.env
.env.local
*.key
*.pem

# 归档目录（可选，按需保留）
# _archive/
```

## 附录 B: 常用命令速查

```bash
# ===== 初始化 =====
node skills/pm-prd-html-writer/scripts/init-assets.mjs src/docs

# ===== 清理 =====
node skills/pm-prd-html-writer/scripts/clean-assets.mjs src/docs --keep-version V1.0
node skills/pm-prd-html-writer/scripts/clean-assets.mjs src/docs --dry-run

# ===== 验证 =====
node skills/pm-prd-html-writer/scripts/validate-assets.mjs src/docs/<PRD>.html

# ===== 打包 =====
node skills/pm-prd-html-writer/scripts/package-prd.mjs src/docs/<PRD>.html --output src/docs/_deliverable
node skills/pm-prd-html-writer/scripts/package-prd.mjs src/docs/<PRD>.html --include-prototypes

# ===== 多状态截图 =====
node skills/pm-prd-html-writer/scripts/capture-prototype-states.mjs --url http://127.0.0.1:51720/prototypes/<name>/

# ===== 离线原型 =====
node skills/pm-prd-html-writer/scripts/export-prototype-for-prd.mjs --prototype <name> --prd src/docs/<PRD>.html

# ===== 截图 =====
node skills/pm-prd-html-writer/scripts/screenshot.mjs src/docs/<PRD>.html -o src/docs/assets/screenshots
```

***

**文档版本**: v1.1\
**最后更新**: 2026-06-10\
**适用范围**: pm-prd-html-writer skill 生成的所有 HTML PRD 项目\
**维护者**: Skill 开发团队
