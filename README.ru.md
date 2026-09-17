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

### Тактическое обнаружение и реагирование на угрозы конечных точек для безопасности разработчиков

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22819933.svg)](https://doi.org/10.5281/zenodo.22819933)
[![Version](https://img.shields.io/badge/version-1.0.8-0f172a.svg)](https://github.com/chavatte/sentinel-forge/releases)
[![Electron](https://img.shields.io/badge/Electron-43-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Yarn](https://img.shields.io/badge/Yarn-4%20Berry-2C8EBB?logo=yarn&logoColor=white)](https://yarnpkg.com/)
[![Лицензия](https://img.shields.io/badge/license-MIT-22c55e.svg)](./LICENSE)

**Языки:** 🇺🇸 [English](README.md) · 🇧🇷 [Português](README.pt-BR.md) · 🇪🇸 [Español](README.es.md) · 🇩🇪 [Deutsch](README.de.md) · 🇷🇺 **Русский** · 🇨🇳 [简体中文](README.zh-CN.md)

**Обнаружить. Исследовать. Устранить.**

Sentinel Forge — настольное приложение, ориентированное на безопасность, которое объединяет аудит software supply chain, обнаружение секретов, форензику репозиториев, оценку риска, генерацию SBOM и Git-ориентированное устранение проблем в едином локальном интерфейсе в стиле SOC.

[Возможности](#-возможности) • [Архитектура](#-архитектура) • [Безопасность](#-модель-безопасности) • [Быстрый старт](#-быстрый-старт) • [Сборка](#-сборка-и-распространение) • [Документация](#-встроенная-документация)


<img src="./docs/assets/main-dashboard.png" alt="Панель Sentinel Forge"  />

</div>

---

## Обзор

Современные приложения наследуют большую поверхность атаки от исходного кода, зависимостей, учётных данных, CI/CD pipeline и инструментов разработчика. Sentinel Forge создан, чтобы сделать эту поверхность видимой и управляемой непосредственно на рабочем месте разработчика.

Приложение объединяет анализ безопасности с операционными workflow, а не превращает сканирование в изолированный отчёт:

```text
┌──────────────────────────────────────────────────────────────┐
│                      SENTINEL FORGE                          │
├──────────────────────────────────────────────────────────────┤
│  Репозиторий                                                 │
│     │                                                        │
│     ├── Аудит зависимостей ─────► CVE / GHSA / устаревшие    │
│     ├── SAST / Secrets ──────────► Найденные учётные данные  │
│     ├── Git-форензика ──────────► Commit / Автор / Blame     │
│     ├── Risk Engine ────────────► 0–100 / A–F                │
│     └── Генератор SBOM ─────────► CycloneDX                  │
│                                                              │
│  Опциональная Git-OPS remediation ─► Patch → Commit → Push   │
└──────────────────────────────────────────────────────────────┘
```

Sentinel Forge построен на Electron, React, TypeScript и Vite. Защищённый main-процесс Electron координирует локальные движки анализа и renderer UI.

---

## ✨ Возможности

### Безопасность цепочки поставок

Sentinel Forge выполняет аудит экосистем JavaScript-пакетов в workflow **npm, Yarn, PNPM и Bun**. Результаты анализа зависимостей можно сопоставлять с данными о уязвимостях OSV.dev, а устаревшие пакеты использовать как показатель технического долга.

- Анализ прямых и транзитивных зависимостей
- Видимость уязвимостей по CVE / GHSA
- Обнаружение устаревших зависимостей
- Parsing, совместимый с Yarn Berry
- JSON-аудит с механизмами fallback
- Связь dependency findings с историей репозитория

### 🔐 SAST и обнаружение секретов

Локальный SAST-движок ищет в репозиториях потенциально раскрытые учётные данные и другие высокорисковые шаблоны.

- Шаблоны AWS и cloud credentials
- GitHub tokens
- Приватные SSH-ключи
- Секреты в формате Stripe
- Пользовательские правила на основе регулярных выражений
- Локальное сканирование без внешнего scanning service

> Пользовательские правила позволяют адаптировать scanner под внутренние API tokens, собственные форматы credentials и индикаторы конкретной организации.

### 🕵️ Форензика репозитория

Результаты безопасности ценнее, когда можно определить их источник. Sentinel Forge анализирует Git history и связывает проблемные зависимости с контекстом репозитория, включая commit и автора, связанные с добавлением зависимости.

<div align="center">
  <img src="./docs/assets/threat-radar.png" alt="Threat Radar Sentinel Forge"  />
</div>

### ⚙️ Git-OPS и remediation

Git-OPS workflow предназначен для контролируемого автоматизированного устранения проблем в зависимостях.

```text
Найденная проблема
  ↓
Проанализировать уязвимую зависимость
  ↓
Применить обновление безопасности
  ↓
Обновить / разрешить lockfile
  ↓
Подготовить ожидаемые manifests
  ↓
Создать подписанный / application-attributed commit
  ↓
Отправить remediation в origin
```

Цель — сократить путь между **обнаружением проблемы supply chain** и **созданием отслеживаемого remediation-изменения**.

### 📊 Оценка риска и отчёты

Технические результаты объединяются в единое представление риска на уровне приложения.

- Числовая оценка риска **0–100**
- Буквенная классификация **A–F**
- Уязвимости и секреты входят в общую security posture
- Интерактивные HTML-отчёты
- Генерация PDF
- Экспорт исходного JSON для внешней обработки
- Генерация SBOM в формате CycloneDX

<div align="center">
  <img src="./docs/assets/compliance-report.png" alt="Compliance Report Sentinel Forge"  />
</div>

### 👁️ EDR Watcher

Watcher выполняет фоновый мониторинг настроенных workspace и может показывать нативные desktop-уведомления при обнаружении релевантных условий безопасности во время обычной разработки.

Это лёгкий уровень detection на стороне разработчика, а не замена корпоративным платформам endpoint telemetry.

### 🖥️ Встроенный терминал

Sentinel Forge содержит встроенную terminal/log-поверхность на базе **xterm.js**, позволяющую наблюдать операции безопасности и обслуживания прямо в приложении.

Отрисовка ANSI-цветов явно настроена и для режима разработки, и для упакованных Electron-сборок.

---

## 🏗️ Архитектура

Sentinel Forge использует разделённую архитектуру Electron, чтобы привилегированные операции оставались вне renderer.

```text
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

### Основные уровни

| Уровень | Назначение |
| --- | --- |
| **React Renderer** | Dashboard, workspace, настройки, findings и reporting |
| **Preload / IPC** | Ограниченный мост между renderer и привилегированными Electron API |
| **Electron Main** | Жизненный цикл, окна, tray, security policies и orchestration |
| **Security Engines** | Audit, OSV-запросы, SAST, Git blame, SBOM и watcher |
| **Reporting** | HTML-, PDF- и JSON-экспорт |
| **Updater** | Production-обновления через `electron-updater` |

Renderer не получает неограниченный доступ к Node.js. Привилегированные операции остаются в main-процессе Electron и предоставляются через контролируемые preload API.

---

## 🔒 Модель безопасности

Безопасность — архитектурное ограничение Sentinel Forge, а не просто функция интерфейса.

### Усиление Electron

Приложение использует, в частности:

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- Ограниченные permission requests
- Контролируемую навигацию `BrowserWindow`
- Production Content Security Policy
- Локальные IPC-границы через preload scripts

### Выполнение команд

Инструменты репозитория запускаются в main-процессе Electron. Команды формируются и валидируются явно, вместо предоставления renderer универсального shell API.

### Production CSP

Упакованное приложение использует Content Security Policy. Поскольку xterm.js создаёт renderer styles во время работы, доверенные inline styles явно разрешены, а выполнение удалённых scripts остаётся ограниченным.

### Local-first анализ

Локальный SAST и анализ репозитория могут выполняться без отправки исходного кода во внешний scanning service. Сеть используется там, где нужны внешняя intelligence или удалённые Git-операции, например запросы к OSV.dev.

---

## 📖 Встроенная документация

Sentinel Forge поставляется со встроенным **Help Center**, поэтому пользователю не требуется полагаться только на внешний сайт.

Документация охватывает:

- workflow приложения
- управление workspace
- анализ безопасности
- операции обслуживания
- методику Risk Score
- Git-OPS workflow
- операционные команды

Help Center входит в desktop application и использует ту же стратегию локализации, что и основной интерфейс.

---

## 🌍 Локализация

Приложение включает ресурсы локализации для:

- 🇺🇸 английского
- 🇧🇷 португальского (Бразилия)
- 🇪🇸 испанского
- 🇩🇪 немецкого
- 🇷🇺 русского
- 🇨🇳 упрощённого китайского

Смена языка распространяется на приложение и tray-интерфейс без полного перезапуска.

---

## 🧰 Технологический стек

| Технология | Роль |
| --- | --- |
| **Electron 43** | Кроссплатформенный desktop runtime |
| **React 19** | Renderer UI |
| **TypeScript 7** | Язык приложения |
| **Vite 8** | Frontend build и Electron integration |
| **Yarn 4 (Berry)** | Управление пакетами |
| **xterm.js** | Встроенный terminal/log renderer |
| **Chokidar** | Мониторинг файловой системы |
| **i18next / react-i18next** | Локализация |
| **electron-builder** | Desktop packaging |
| **electron-updater** | Механизм production updates |

---

## 🚀 Быстрый старт

### Требования

- **Node.js 22+**
- **Yarn 4** через Corepack
- Git
- Поддерживаемый package manager для целевых репозиториев: npm, Yarn, PNPM или Bun

### Клонирование

```bash
git clone https://github.com/chavatte/sentinel-forge.git
cd sentinel-forge
```

### Включение Corepack

```bash
corepack enable
```

### Установка зависимостей

```bash
yarn install --immutable
```

### Запуск режима разработки

```bash
yarn dev
```

Vite запускает renderer, а Electron стартует через настроенную интеграцию Vite/Electron.

---

## 📦 Сборка и распространение

Создайте production build:

```bash
yarn build
```

Pipeline выполняет компиляцию TypeScript, bundling Vite и упаковку Electron.

### Целевые платформы

| Платформа | Артефакты |
| --- | --- |
| **Windows** | NSIS installer (`.exe`) |
| **Linux** | AppImage и `.deb` |
| **macOS** | `.dmg` и `.zip` для Intel / Apple Silicon |

Для публикации используются GitHub Releases через `electron-builder` и `electron-updater`.

### Release workflow

Тег версии формата `v*` запускает release workflow. GitHub Actions собирает приложение для Windows, Ubuntu и macOS с Node.js 22 и Yarn 4.

```bash
git tag v1.0.8
git push origin v1.0.8
```

> Подпись release зависит от signing configuration среды сборки. Текущий CI workflow отключает автоматическое обнаружение сертификатов.

---

## 📁 Структура проекта

```text
sentinel-forge/
├── electron/
│   ├── ipc/                 # IPC handlers безопасности и системы
│   ├── preload/             # IPC bridges для renderer
│   ├── main.ts              # Electron entry point
│   ├── preload.ts           # Preload entry point
│   ├── tray.ts              # System tray и окно документации
│   ├── updater.ts            # Обновление приложения
│   └── logger.ts             # Логирование приложения
│
├── src/
│   ├── components/          # React components
│   ├── hooks/               # Application hooks
│   ├── locales/             # Ресурсы переводов
│   ├── utils/               # Risk, reporting и helpers
│   ├── App.tsx              # Application shell
│   └── main.tsx             # React entry point
│
├── public/
│   ├── help.html             # Точка входа offline documentation
│   └── help/                 # Assets и scripts документации
│
├── docs/assets/              # README / project screenshots
├── .github/workflows/        # Release automation
├── electron-builder.json5    # Packaging configuration
├── vite.config.ts            # Vite + Electron configuration
└── package.json
```

---

## 🧪 Заметки для разработчиков

Sentinel Forge — активно развиваемый проект по security engineering. По мере развития анализаторов, remediation workflow и desktop security model функциональность будет расширяться.

При внесении изменений:

1. Оставляйте привилегированные операции в main-процессе Electron.
2. Предоставляйте renderer только узко ограниченные операции через preload IPC.
3. Валидируйте входные данные перед filesystem, Git и process operations.
4. Сохраняйте Production CSP и Electron hardening.
5. Для security tooling предпочитайте детерминированные parser и структурированный вывод.
6. Делайте findings объяснимыми и трассируемыми до источника.

---

## ⚠️ Безопасность и эксплуатация

Sentinel Forge — защитный security tool. Автоматизированная remediation и команды репозитория могут изменять working tree и удалённые репозитории.

Используйте Git branches, backups и подходящие repository permissions при тестировании Git-OPS.

Подключение к OSV.dev требуется для актуальной внешней информации об уязвимостях. Локальный анализ доступен для задач, не требующих внешних сервисов.

---

## 📚 Документация и ресурсы

- **Встроенный Help Center:** входит в desktop application
- **GitHub Repository:** https://github.com/chavatte/sentinel-forge
- **OSV.dev:** https://osv.dev/
- **CycloneDX:** https://cyclonedx.org/
- **Electron:** https://www.electronjs.org/

---

## 🗺️ Roadmap

Проект развивается в сторону более широкой developer-security платформы с акцентом на:

- более глубокую supply-chain intelligence
- расширенную repository forensics
- более широкое SAST-покрытие
- более безопасную automated remediation
- более глубокую EDR-подобную workspace telemetry
- улучшенный reporting и compliance workflows
- дополнительные developer-security integrations

---

## 🤝 Участие в проекте

Мы приветствуем вклад, сообщения об ошибках и обратную связь по безопасности.

Для изменений, затрагивающих security-sensitive поведение, укажите:

- какую угрозу или use case вы решаете
- какую security boundary затрагивает изменение
- воспроизводимые шаги или тестовые доказательства
- влияние на упакованные Electron builds

---

## 📜 Лицензия

Sentinel Forge распространяется по **MIT License**.

Copyright © 2026 **DevChavatte**.

Полный текст лицензии: [LICENSE](./LICENSE).

---

<div align="center">

**Sentinel Forge — безопасность разработчиков, intelligence цепочки поставок и тактический EDR.**

Разработано и поддерживается **[DevChavatte](https://github.com/chavatte)**.

</div>
