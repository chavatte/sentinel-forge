<pre style="font-size: 0.5rem;">

                              \\\\\\
                           \\\\\\\\\\\\
                          \\\\\\\\\\\\\\\
-------------,-|           |C>   // )\\\\|    .o88b. db   db  .d8b.  db    db  .d8b.  d888888b d888888b d88888b
           ,','|          /    || ,'/////|   d8P  Y8 88   88 d8' '8b 88    88 d8' '8b '~~88~~' '~~88~~' 88'  
---------,','  |         (,    ||   /////    8P      88ooo88 88ooo88 Y8    8P 88ooo88    88       88    88ooooo 
         ||    |          \\  ||||//''''|    8b      88~~~88 88~~~88 '8b  d8' 88~~~88    88       88    88~~~~~ 
         ||    |           |||||||     _|    Y8b  d8 88   88 88   88  '8bd8'  88   88    88       88    88.   
         ||    |______      ''''\____/ \      'Y88P' YP   YP YP   YP    YP    YP   YP    YP       YP    Y88888P
         ||    |     ,|         _/_____/ \
         ||  ,'    ,' |        /          |                 ___________________________________________
         ||,'    ,'   |       |         \  |              / \                                           \ 
_________|/    ,'     |      /           | |             |  |                                            | 
_____________,'      ,',_____|      |    | |              \ |      chavatte@duck.com                     | 
             |     ,','      |      |    | |                |                       chavatte.vercel.app  | 
             |   ,','    ____|_____/    /  |                |    ________________________________________|___
             | ,','  __/ |             /   |                |  /                                            /
_____________|','   ///_/-------------/   |                 \_/____________________________________________/ 
              |===========,'                                                                                  
			  

</pre>

<div align="center">

<img src="./docs/assets/logo.png" alt="Sentinel Forge Logo" />

# Sentinel Forge

### 面向开发者安全的战术事件检测与响应

[![Version](https://img.shields.io/badge/version-1.0.7-0f172a.svg)](https://github.com/chavatte/sentinel-forge/releases)
[![Electron](https://img.shields.io/badge/Electron-43-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Yarn](https://img.shields.io/badge/Yarn-4%20Berry-2C8EBB?logo=yarn&logoColor=white)](https://yarnpkg.com/)
[![许可证](https://img.shields.io/badge/license-MIT-22c55e.svg)](./LICENSE)

**语言:** 🇺🇸 [English](README.md) · 🇧🇷 [Português](README.pt-BR.md) · 🇪🇸 [Español](README.es.md) · 🇩🇪 [Deutsch](README.de.md) · 🇷🇺 [Русский](README.ru.md) · 🇨🇳 **简体中文**

**检测。调查。修复。**

Sentinel Forge 是一款面向安全的桌面应用，将软件供应链审计、秘密检测、仓库取证、风险评分、SBOM 生成以及基于 Git 的修复整合到一个本地 SOC 风格界面中。

[功能](#-功能) • [架构](#-架构) • [安全](#-安全模型) • [安装](#-开始使用) • [构建](#-构建与分发) • [文档](#-集成文档)


<img src="./docs/assets/main-dashboard.png" alt="Sentinel Forge Dashboard" />

</div>

---

## 概述

现代应用会从源代码、依赖项、凭据、CI/CD 流水线和开发工具中继承庞大的攻击面。Sentinel Forge 旨在让开发者能够直接在工作站上看见并采取行动来处理这些风险。

该应用将安全分析与运营工作流结合，而不是把扫描仅仅当作一份简单报告：

```
┌──────────────────────────────────────────────────────────────┐
│                      SENTINEL FORGE                          │
├──────────────────────────────────────────────────────────────┤
│  Repository                                                  │
│     │                                                        │
│     ├── Dependency Audit ─────────► CVEs / GHSAs / Outdated  │
│     ├── SAST / Secrets ───────────► Credential Findings      │
│     ├── Git Forensics ─────────────► Commit / Author / Blame │
│     ├── Risk Engine ───────────────► 0–100 / A–F             │
│     └── SBOM Generator ────────────► CycloneDX               │
│                                                              │
│  Optional Git-OPS Remediation ─────► Patch → Commit → Push   │
└──────────────────────────────────────────────────────────────┘
```

Sentinel Forge 基于 Electron、React、TypeScript 和 Vite 构建，由面向安全的 Electron 主进程协调本地分析引擎与 renderer 界面。

---

## ✨ 功能

### 供应链安全

Sentinel Forge 可针对 **npm、Yarn、PNPM 和 Bun** 工作流审计 JavaScript 包生态。依赖项发现结果可与 OSV.dev 漏洞情报进行关联，而过时的软件包则被视为技术债务信号。

- 直接依赖与传递依赖分析
    
- 面向 CVE / GHSA 的漏洞可视性
    
- 过时依赖检测
    
- 兼容 Yarn Berry 的解析
    
- JSON 审计解析与回退机制
    
- 依赖发现结果与仓库历史的关联
    

### 🔐 SAST 与秘密检测

本地 SAST 引擎会在仓库中查找可能暴露的凭据及其他高风险模式。

- AWS 与云服务凭据模式
    
- GitHub Token
    
- 私有 SSH 密钥
    
- Stripe 格式的秘密
    
- 自定义正则表达式规则
    
- 无需外部分析服务的本地扫描
    

> 自定义规则可让扫描器适配内部 API Token、专有凭据格式以及组织特定的指标。

### 🕵️ 仓库取证

当能够识别安全发现的来源时，它们的价值会更高。

Sentinel Forge 集成 Git 历史分析，将易受攻击的依赖发现与仓库上下文关联起来，包括引入该依赖的提交和作者。

<div align="center"> <img src="./docs/assets/threat-radar.png" alt="Sentinel Forge Threat Radar" /> </div>

### ⚙️ Git-OPS 与修复

Git-OPS 工作流用于对依赖发现执行受控的自动化修复。

典型流程：

```
发现
  ↓
分析受影响的依赖
  ↓
应用安全更新
  ↓
解析 / 更新 lockfile
  ↓
准备预期的 manifest
  ↓
创建由应用标识 / 签名的 commit
  ↓
将修复推送到 origin
```

目标是缩短从**发现供应链问题**到**生成可追踪的修复变更**之间的距离。

### 📊 风险评分与报告

技术发现结果会汇总到应用级风险视图中。

- **0–100** 的数字风险评分
    
- **A–F** 字母等级分类
    
- 将漏洞与秘密纳入安全态势
    
- 交互式 HTML 报告
    
- PDF 报告生成
    
- 原始 JSON 导出用于外部处理
    
- CycloneDX SBOM 生成
    

<div align="center"> <img src="./docs/assets/compliance-report.png" alt="Sentinel Forge Compliance Report" /> </div>

### 👁️ EDR Watcher

Watcher 会在后台监控已映射的工作区，并可在正常开发活动中检测到相关安全条件时生成原生桌面通知。

该功能定位为开发者侧的轻量级检测层，并非企业级终端遥测平台的替代品。

### 🖥️ 集成终端

Sentinel Forge 提供基于 **xterm.js** 的集成终端/日志界面，可直接在应用内观察安全与维护操作。

ANSI 颜色渲染已针对开发环境和打包后的 Electron 环境进行显式配置。

---

## 🏗️ 架构

Sentinel Forge 采用分离式 Electron 架构，将特权操作置于 renderer 之外。

```
                    ┌──────────────────────────┐
                    │        React UI          │
                    │     Renderer Process     │
                    └────────────┬─────────────┘
                                 │
                           Secure IPC / Preload
                                 │
                    ┌────────────▼─────────────┐
                    │      Electron Main       │
                    │   Privileged Kernel      │
                    └────────────┬─────────────┘
                                 │
           ┌──────────────────────┼──────────────────────┐
           │                      │                      │
           ▼                      ▼                      ▼
    Dependency Audit        SAST / Secrets        Git Operations
           │                      │                      │
           ▼                      ▼                      ▼
        OSV.dev              Local Source         Git Repository
           │
           └──────────────────────┬──────────────────────┘
                                  ▼
                         Risk / Reports / SBOM
```

### 主要层

|层|职责|
|---|---|
|**React Renderer**|仪表板、工作区管理、设置、发现结果和报告界面|
|**Preload / IPC**|renderer 与特权 Electron API 之间的受限桥接|
|**Electron Main**|生命周期、窗口、tray、安全策略与编排|
|**Security Engines**|审计、OSV 查询、SAST、Git blame、SBOM 与 watcher|
|**Reporting**|HTML、PDF 和 JSON 导出|
|**Updater**|通过 `electron-updater` 执行生产环境更新检查|

renderer 不会获得不受限制的 Node.js 访问权限。特权操作保留在 Electron 主进程中，并通过受控的 preload API 暴露。

---

## 🔒 安全模型

在 Sentinel Forge 中，安全是一项架构约束，而不仅仅是界面上的一个功能。

### Electron 加固

应用采用了包括以下内容在内的 Electron 安全控制：

- `contextIsolation: true`
    
- `nodeIntegration: false`
    
- `sandbox: true`
    
- 权限请求限制
    
- `BrowserWindow` 导航控制
    
- 生产环境 Content Security Policy
    
- 通过 preload 脚本建立本地 IPC 边界
    

### 命令执行

仓库工具在 Electron 主进程中运行。应用采用显式的命令构造与校验，而不是向 renderer 暴露通用 Shell API。

### 生产环境 CSP

打包后的应用使用生产环境 Content Security Policy。由于 xterm.js 会在运行时创建 renderer 样式，策略会显式允许受信任的内联样式，同时继续限制远程脚本执行。

### 本地优先分析

本地 SAST 和仓库分析可以在不向外部扫描服务发送源代码的情况下运行。仅在需要外部情报或远程 Git 操作时使用网络，例如向 OSV.dev 查询漏洞或执行远程 Git 工作流。

---

## 📖 集成文档

Sentinel Forge 内置 **Help Center**，无需用户完全依赖外部网站。

文档涵盖以下领域：

- 应用使用流程
    
- 工作区管理
    
- 安全分析
    
- 维护操作
    
- 风险评分方法
    
- Git-OPS 工作流
    
- 运营命令
    

Help Center 与应用一起打包，并采用与主界面相同的本地化策略。

---

## 🌍 本地化

应用目前包含以下语言的本地化资源：

- 🇺🇸 英语
    
- 🇧🇷 巴西葡萄牙语
    
- 🇪🇸 西班牙语
    
- 🇩🇪 德语
    
- 🇷🇺 俄语
    
- 🇨🇳 简体中文
    

语言切换会同步应用及 tray 界面，无需完整重启。

---

## 🧰 技术栈

|技术|作用|
|---|---|
|**Electron 43**|跨平台桌面运行时|
|**React 19**|renderer UI|
|**TypeScript 7**|应用开发语言|
|**Vite 8**|前端构建与 Electron 集成|
|**Yarn 4 (Berry)**|包管理器|
|**xterm.js**|集成终端/日志渲染|
|**Chokidar**|文件系统监控|
|**i18next / react-i18next**|本地化|
|**electron-builder**|桌面应用打包|
|**electron-updater**|生产环境更新机制|

---

## 🚀 开始使用

### 要求

- **Node.js 22+**
    
- 通过 Corepack 使用 **Yarn 4**
    
- Git
    
- 用于审计目标仓库的受支持包管理器：npm、Yarn、PNPM 或 Bun
    

### 克隆

```
git clone https://github.com/chavatte/sentinel-forge.git
cd sentinel-forge
```

### 启用 Corepack

```
corepack enable
```

### 安装依赖

```
yarn install --immutable
```

### 启动开发模式

```
yarn dev
```

Vite 开发服务器负责启动 renderer，而 Electron 通过项目中配置的 Vite/Electron 集成启动。

---

## 📦 构建与分发

使用以下命令创建生产构建：

```
yarn build
```

流水线会执行 TypeScript 编译、Vite 打包以及 Electron 应用打包。

### 平台目标

The current Electron Builder configuration targets:

|平台|构建产物|
|---|---|
|**Windows**|NSIS 安装程序 (`.exe`)|
|**Linux**|AppImage 和 `.deb`|
|**macOS**|适用于 Intel / Apple Silicon 的 `.dmg` 和 `.zip`|

项目通过 `electron-builder` 和 `electron-updater` 使用 GitHub Releases 作为发布后端。

### 发布流程

匹配 `v*` 的版本标签会触发仓库的发布工作流。GitHub Actions 使用 Node.js 22 和 Yarn 4 在 Windows、Ubuntu 和 macOS 上构建应用。

示例：

```
git tag v1.0.8
git push origin v1.0.8
```

> Release 签名取决于构建环境中可用的签名配置。仓库工作流目前会禁用 CI 构建中的自动证书发现。

---

## 📁 项目结构

```
sentinel-forge/
├── electron/
│   ├── ipc/                 # 安全与系统 IPC 处理器
│   ├── preload/             # 暴露给 renderer 的 IPC 桥接
│   ├── main.ts              # Electron 入口
│   ├── preload.ts           # Preload 入口
│   ├── tray.ts              # 系统托盘与文档窗口
│   ├── updater.ts            # 应用更新器
│   └── logger.ts             # 应用日志
│
├── src/
│   ├── components/          # React 组件
│   ├── hooks/               # 应用 Hooks
│   ├── locales/             # 翻译资源
│   ├── utils/                # 风险、报告与辅助工具
│   ├── App.tsx              # 应用 Shell
│   └── main.tsx             # React 入口
│
├── public/
│   ├── help.html             # 离线文档入口
│   └── help/                 # 文档资源与脚本
│
├── docs/assets/              # README / 项目图片
├── .github/workflows/        # 发布自动化
├── electron-builder.json5    # 打包配置
├── vite.config.ts            # Vite + Electron 配置
└── package.json
```

---

## 🧪 开发说明

Sentinel Forge 是一个持续开发中的安全工程项目。随着分析引擎、修复工作流和桌面安全模型不断成熟，功能可能会继续演进。

扩展项目时，请保持以下安全边界：

1. 将特权操作保留在 Electron 主进程中。
    
2. 仅通过 preload IPC 暴露范围严格受限的操作。
    
3. 在执行文件系统、Git 或进程操作之前校验输入。
    
4. 保留生产环境 CSP 和 Electron 加固配置。
    
5. 安全工具优先使用确定性解析器和结构化输出。
    
6. 确保用户可见的发现结果具有可解释性，并可追溯到来源。
    

---

## ⚠️ 安全与运营注意事项

Sentinel Forge 是一款防御性安全工具。运行自动化修复或仓库命令可能会修改工作树和远程仓库。

测试 Git-OPS 功能时，请使用 Git 分支、备份以及适当的仓库权限。

要获取实时外部漏洞情报，需要连接 OSV.dev。对于不需要外部服务的分析，本地仓库扫描仍然可用。

---

## 📚 文档与资源

- **集成 Help Center：** 内置于桌面应用中
    
- **GitHub Repository:** [https://github.com/chavatte/sentinel-forge](https://github.com/chavatte/sentinel-forge)
    
- **OSV.dev:** [https://osv.dev/](https://osv.dev/)
    
- **CycloneDX:** [https://cyclonedx.org/](https://cyclonedx.org/)
    
- **Electron:** [https://www.electronjs.org/](https://www.electronjs.org/)
    

---

## 🗺️ Roadmap 方向

项目正向更广泛的开发者安全平台演进，重点包括：

- 更丰富的供应链情报
    
- 更先进的仓库取证
    
- 更广泛的 SAST 覆盖
    
- 更安全的自动化修复
    
- 更深入的 EDR 风格工作区遥测
    
- 更完善的合规报告与工作流
    
- 更多面向开发者的安全集成
    

---

## 🤝 贡献

欢迎贡献代码、提交 Bug 报告以及提供安全相关反馈。

对于影响安全敏感行为的变更，请包含：

- 所处理的威胁或使用场景
    
- 受影响的安全边界
    
- 可复现的步骤或测试证据
    
- 对打包后 Electron 构建产物的任何影响
    

---

## 📜 许可证

Sentinel Forge 采用 **MIT License** 发布。

Copyright © 2026 **DevChavatte**.

完整许可证文本请参见 [LICENSE](./LICENSE)。

---

<div align="center">

**Sentinel Forge — 开发者安全、供应链情报与战术 EDR。**

由 [**DevChavatte**](https://github.com/chavatte) 构建并维护。

</div>