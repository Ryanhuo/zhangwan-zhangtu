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

运行：

```bash
node -v
```

如果 `node` 未安装或版本低于 18，告知用户前往 https://nodejs.org 下载 LTS 版本并安装后重试。（Git 不是安装本身的必需项，只有用户之后想给自己的原型项目做版本控制时才需要。）

---

### 第二步：确认初始化方式

先判断用户是不是已经站在自己想用的那个文件夹里（比如已经手动建好、已经 `cd` 进去了）：

- **是**（当前目录就是目标文件夹，且是空的或只有 `.git`/`README.md` 这类文件）：就地初始化，项目名自动取当前文件夹名，跳过"新建子文件夹"这一步。直接进入第三步。
- **否**（用户还在上一级目录，想要新建一个子文件夹）：按以下优先级确定项目名称（只用英文字母、数字和连字符，不含空格）：
  1. 用户在触发语句中直接说出的名称（如"帮我安装掌图，项目名叫 my-project"）
  2. 询问用户："想叫什么名字？比如 `supply-chain`、`hr-portal`（只用英文和连字符）"

  收到名称后，确认一次："好的，即将在当前目录下创建 `<名称>/` 文件夹，继续吗？"确认后进入第三步。

---

### 第三步：初始化工作区

在**当前工作目录**下运行（不要额外 `cd` 进子目录）：

```bash
# 就地初始化（当前目录就是目标文件夹）
npx -y @leihuohuo/zhangwan-zhangtu@latest init

# 新建子文件夹
npx -y @leihuohuo/zhangwan-zhangtu@latest init <项目名称>
```

这条命令会：
- 从 npm 注册表下载掌图系统最新版本（几秒钟，比早期的 GitHub 直装方式快很多）
- 就地初始化时：直接在当前目录写入模板文件；新建子文件夹时：先建 `<项目名称>/` 再写入
- 复制工作区模板（配置文件、类型定义、示例页面）

如果当前目录不是空的（除了 `.git`/`.gitignore`/`README.md`/`LICENSE` 这几个文件之外还有别的），就地初始化会报错并提示改用"新建子文件夹"的写法——这时改问用户要不要用一个新名字建子文件夹。

> 如果用户表示以后会经常建新原型项目，嫌每次 `npx` 都要重新解析包，可以建议其执行一次 `npm install -g @leihuohuo/zhangwan-zhangtu@latest`，之后就能直接用 `zhangtu init` 代替 `npx -y @leihuohuo/zhangwan-zhangtu@latest init`（两者行为完全一致，只是不用每次都走 npx）。

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
| 端口 6320 被占用 | `npm start -- --port 6321` |
| `npm install` 卡住 | 检查网络，或切换 npm 镜像：`npm config set registry https://registry.npmmirror.com` |
| Windows PowerShell 执行策略报错 | 用管理员权限打开 PowerShell，运行 `Set-ExecutionPolicy RemoteSigned` |
