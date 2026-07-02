---
name: zhangtu-installer
description: 在当前文件夹安装掌图（zhangtu）原型工作区。触发短语：我要在这里安装掌图、帮我安装掌图、初始化掌图工作区、在这里装掌图、安装掌图、帮我装掌图
user-invocable: true
---

# 掌图安装助手

当用户说"我要在这里安装掌图"、"帮我安装掌图"、"初始化掌图工作区"、"在这里装掌图"或类似短语时，按照以下步骤帮用户完成安装。全程输出中文，不询问无关问题。

---

## 执行流程

### 第一步：检查环境

同时运行以下两条命令：

```bash
node -v
git --version
```

- 如果 `node` 未安装或版本低于 18，告知用户前往 https://nodejs.org 下载 LTS 版本并安装后重试。
- 如果 `git` 未安装，告知：Mac 运行 `xcode-select --install`，Windows 前往 https://git-scm.com 下载安装，完成后重试。

---

### 第二步：确定项目名称

按以下优先级确定项目名称（只用英文字母、数字和连字符，不含空格）：

1. 用户在触发语句中直接说出的名称（如"帮我安装掌图，项目名叫 my-project"）
2. 询问用户："想叫什么名字？比如 `supply-chain`、`hr-portal`（只用英文和连字符）"

收到名称后，确认一次："好的，即将在当前目录下创建 `<名称>/` 文件夹，继续吗？"如果用户确认，进入第三步。

---

### 第三步：初始化工作区

在**当前工作目录**下运行（不要 cd 进任何子目录）：

```bash
npx -y github:Ryanhuo/zhangwan-zhangtu init <项目名称>
```

这条命令会：
- 从 GitHub 下载掌图系统最新版本（约 10–30 秒）
- 在当前目录下创建 `<项目名称>/` 子文件夹
- 将工作区模板（配置文件、类型定义、示例页面）复制进去

**Windows 注意：** 如果出现类似 `Cannot find package 'github:...'` 的错误，检查 Git 是否已安装并在命令行中可用（运行 `git --version`）。

---

### 第四步：安装 npm 依赖

```bash
cd <项目名称> && npm install
```

首次安装约需 1–2 分钟，视网络情况而定。等待完成再进入下一步。

---

### 第五步：启动预览

```bash
npm start
```

掌图预览 Shell 将在端口 6320 启动，浏览器会自动打开。如果未自动打开，提示用户手动访问：

```
http://127.0.0.1:6320
```

---

### 完成后告知用户

安装成功后，简短说明：
- 原型页面放在 `src/pages/` 下，Shell 会自动发现
- 每个页面需要 `index.html` + `index.tsx` 两个文件
- 遇到页面不显示，运行 `npm run check:pages` 查看诊断
- 版本管理在 Shell 右上角"版本管理"入口

---

## 常见问题处理

| 问题 | 解决方法 |
|------|----------|
| `npm error could not determine executable to run` | 本地 npx 缓存了旧版本，运行 `npx clear-npx-cache`（或删除 `~/.npm/_npx`）后重试第三步命令 |
| `npx` 不认识 `github:` 协议 | 确认 Git 已安装：`git --version` |
| 端口 6320 被占用 | `npm start -- --port 6321` |
| `npm install` 卡住 | 检查网络，或切换 npm 镜像：`npm config set registry https://registry.npmmirror.com` |
| Windows PowerShell 执行策略报错 | 用管理员权限打开 PowerShell，运行 `Set-ExecutionPolicy RemoteSigned` |
