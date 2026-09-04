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

### Taktische Endpoint Detection & Response für Developer Security

[![Version](https://img.shields.io/badge/version-1.0.7-0f172a.svg)](https://github.com/chavatte/sentinel-forge/releases)
[![Electron](https://img.shields.io/badge/Electron-43-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Yarn](https://img.shields.io/badge/Yarn-4%20Berry-2C8EBB?logo=yarn&logoColor=white)](https://yarnpkg.com/)
[![Lizenz](https://img.shields.io/badge/license-MIT-22c55e.svg)](./LICENSE)

**Sprachen:** 🇺🇸 [English](README.md) · 🇧🇷 [Português](README.pt-BR.md) · 🇪🇸 [Español](README.es.md) · 🇩🇪 **Deutsch** · 🇷🇺 [Русский](README.ru.md) · 🇨🇳 [简体中文](README.zh-CN.md)

**Erkennen. Untersuchen. Beheben.**

Sentinel Forge ist eine sicherheitsorientierte Desktop-Anwendung, die Software-Supply-Chain-Audits, Secret Detection, Repository-Forensik, Risiko-Scoring, SBOM-Erstellung und Git-basierte Remediation in einer lokalen SOC-ähnlichen Oberfläche vereint.

[Funktionen](#-funktionen) • [Architektur](#-architektur) • [Sicherheit](#-sicherheitsmodell) • [Installation](#-erste-schritte) • [Build](#-build--verteilung) • [Dokumentation](#-integrierte-dokumentation)


<img src="./docs/assets/main-dashboard.png" alt="Sentinel Forge Dashboard" />

</div>

---

## Überblick

Moderne Anwendungen erben eine große Angriffsfläche aus Quellcode, Abhängigkeiten, Zugangsdaten, CI/CD-Pipelines und Developer-Tools. Sentinel Forge macht diese Angriffsfläche direkt am Entwicklerarbeitsplatz sichtbar und bearbeitbar.

Die Anwendung verbindet Sicherheitsanalyse mit operativen Workflows, statt Scans nur als isolierten Bericht zu behandeln:

```text
┌──────────────────────────────────────────────────────────────┐
│                      SENTINEL FORGE                          │
├──────────────────────────────────────────────────────────────┤
│  Repository                                                  │
│     │                                                        │
│     ├── Dependency Audit ──────► CVEs / GHSAs / veraltet     │
│     ├── SAST / Secrets ────────► Credential Findings         │
│     ├── Git-Forensik ──────────► Commit / Autor / Blame      │
│     ├── Risk Engine ───────────► 0–100 / A–F                 │
│     └── SBOM Generator ────────► CycloneDX                   │
│                                                              │
│  Optionale Git-OPS-Remediation ─► Patch → Commit → Push      │
└──────────────────────────────────────────────────────────────┘
```

Sentinel Forge basiert auf Electron, React, TypeScript und Vite. Der sicherheitsorientierte Electron-Main-Prozess koordiniert lokale Analyse-Engines und die Renderer-Oberfläche.

---

## ✨ Funktionen

### Supply-Chain-Sicherheit

Sentinel Forge prüft JavaScript-Paketökosysteme für **npm, Yarn, PNPM und Bun**. Dependency-Findings können mit der Vulnerability Intelligence von OSV.dev korreliert werden; veraltete Pakete werden zusätzlich als technische Schuld sichtbar.

- Analyse direkter und transitiver Abhängigkeiten
- CVE-/GHSA-orientierte Schwachstellenübersicht
- Erkennung veralteter Abhängigkeiten
- Yarn-Berry-kompatibles Parsing
- JSON-basiertes Audit-Parsing mit Fallbacks
- Verknüpfung von Dependency-Findings mit der Repository-Historie

### 🔐 SAST & Secret Detection

Die lokale SAST-Engine sucht in Repositories nach potenziell offengelegten Zugangsdaten und anderen Hochrisikomustern.

- AWS- und Cloud-Credential-Muster
- GitHub-Tokens
- Private SSH-Schlüssel
- Secrets im Stripe-Stil
- Eigene Regeln per regulärem Ausdruck
- Lokales Scanning ohne externen Scan-Service

> Eigene Regeln ermöglichen die Anpassung an interne API-Tokens, proprietäre Credential-Formate und organisationsspezifische Indikatoren.

### 🕵️ Repository-Forensik

Sicherheitsbefunde werden wertvoller, wenn ihre Herkunft nachvollziehbar ist. Sentinel Forge verbindet Dependency-Findings mit Git-Historie, Commit und Autor, die mit der Einführung einer Abhängigkeit verbunden sind.

<div align="center">
  <img src="./docs/assets/threat-radar.png" alt="Sentinel Forge Threat Radar" />
</div>

### ⚙️ Git-OPS & Remediation

Der Git-OPS-Workflow ist für kontrollierte, automatisierte Behebung von Dependency-Findings ausgelegt.

```text
Finding
  ↓
Betroffene Dependency analysieren
  ↓
Security-Update anwenden
  ↓
Lockfile aktualisieren / auflösen
  ↓
Erwartete Manifeste stagen
  ↓
Signierten / anwendungsbezogenen Commit erzeugen
  ↓
Remediation zu origin pushen
```

Ziel ist es, die Zeit zwischen **dem Finden eines Supply-Chain-Problems** und **einer nachvollziehbaren Remediation-Änderung** zu verkürzen.

### 📊 Risiko-Scoring & Reporting

Technische Findings werden zu einer anwendungsweiten Risikosicht zusammengeführt.

- Numerischer Risk Score **0–100**
- Buchstabenklassifizierung **A–F**
- Vulnerabilities und Secrets als Teil der Security Posture
- Interaktive HTML-Berichte
- PDF-Berichte
- Rohes JSON für externe Verarbeitung
- CycloneDX-SBOM-Generierung

<div align="center">
  <img src="./docs/assets/compliance-report.png" alt="Sentinel Forge Compliance Report" />
</div>

### 👁️ EDR Watcher

Der Watcher überwacht zugeordnete Workspaces im Hintergrund und kann bei relevanten Sicherheitsbedingungen während der normalen Entwicklung native Desktop-Benachrichtigungen auslösen.

Er ist als leichte Detection-Schicht am Entwicklerarbeitsplatz gedacht und nicht als Ersatz für Enterprise-Endpoint-Telemetrie.

### 🖥️ Integriertes Terminal

Sentinel Forge enthält eine Terminal-/Log-Oberfläche auf Basis von **xterm.js**, über die Sicherheits- und Wartungsvorgänge direkt in der Anwendung beobachtet werden können.

Die ANSI-Farbdarstellung wird sowohl für den Entwicklungsbetrieb als auch für gepackte Electron-Builds explizit konfiguriert.

---

## 🏗️ Architektur

Sentinel Forge trennt die Electron-Prozesse so, dass privilegierte Operationen außerhalb des Renderers bleiben.

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

### Zentrale Ebenen

| Ebene | Verantwortung |
| --- | --- |
| **React Renderer** | Dashboard, Workspaces, Einstellungen, Findings und Reporting |
| **Preload / IPC** | Begrenzte Brücke zwischen Renderer und privilegierten Electron-APIs |
| **Electron Main** | Lebenszyklus, Fenster, Tray, Security Policies und Orchestrierung |
| **Security Engines** | Audit, OSV-Abfragen, SAST, Git Blame, SBOM und Watcher |
| **Reporting** | HTML-, PDF- und JSON-Exporte |
| **Updater** | Produktionsupdates über `electron-updater` |

Der Renderer erhält keinen uneingeschränkten Node.js-Zugriff. Privilegierte Vorgänge verbleiben im Electron-Main-Prozess und werden über kontrollierte Preload-APIs bereitgestellt.

---

## 🔒 Sicherheitsmodell

Sicherheit ist eine Architekturvorgabe von Sentinel Forge und nicht nur ein UI-Feature.

### Electron-Hardening

Die Anwendung nutzt unter anderem:

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- Eingeschränkte Permission Requests
- Kontrollierte `BrowserWindow`-Navigation
- Production Content Security Policy
- Lokale IPC-Grenzen über Preload-Skripte

### Befehlsausführung

Repository-Tools werden im Electron-Main-Prozess ausgeführt. Befehle werden explizit aufgebaut und validiert, statt dem Renderer eine allgemeine Shell-API zu geben.

### Production CSP

Die gepackte Anwendung verwendet eine Production Content Security Policy. Da xterm.js Renderer-Styles zur Laufzeit erzeugt, sind vertrauenswürdige Inline-Styles explizit erlaubt, während die Ausführung entfernter Skripte eingeschränkt bleibt.

### Local-First-Analyse

Lokales SAST und Repository-Analyse können ohne Übertragung des Quellcodes an einen externen Scan-Service erfolgen. Netzwerkzugriff wird dort genutzt, wo externe Intelligence oder Remote-Git-Aktionen erforderlich sind, beispielsweise OSV.dev-Abfragen oder Git-Workflows.

---

## 📖 Integrierte Dokumentation

Sentinel Forge wird mit einem eingebetteten **Help Center** ausgeliefert, sodass keine externe Website erforderlich ist.

Die Dokumentation behandelt unter anderem:

- Anwendungsworkflow
- Workspace-Verwaltung
- Sicherheitsanalyse
- Wartungsvorgänge
- Risk-Score-Methodik
- Git-OPS-Workflows
- Operative Befehle

Das Help Center wird mit der Anwendung gebündelt und folgt derselben Lokalisierungsstrategie wie die Hauptoberfläche.

---

## 🌍 Lokalisierung

Aktuell werden folgende Sprachen unterstützt:

- 🇺🇸 Englisch
- 🇧🇷 Portugiesisch (Brasilien)
- 🇪🇸 Spanisch
- 🇩🇪 Deutsch
- 🇷🇺 Russisch
- 🇨🇳 Vereinfachtes Chinesisch

Sprachwechsel werden an Anwendung und Tray-Oberfläche weitergegeben, ohne dass ein vollständiger Neustart nötig ist.

---

## 🧰 Technologie-Stack

| Technologie | Aufgabe |
| --- | --- |
| **Electron 43** | Plattformübergreifende Desktop-Laufzeit |
| **React 19** | Renderer-UI |
| **TypeScript 7** | Programmiersprache |
| **Vite 8** | Frontend- und Electron-Building |
| **Yarn 4 (Berry)** | Paketverwaltung |
| **xterm.js** | Integrierter Terminal-/Log-Renderer |
| **Chokidar** | Dateisystemüberwachung |
| **i18next / react-i18next** | Lokalisierung |
| **electron-builder** | Desktop-Paketierung |
| **electron-updater** | Produktions-Update-Mechanismus |

---

## 🚀 Erste Schritte

### Voraussetzungen

- **Node.js 22+**
- **Yarn 4** über Corepack
- Git
- Ein unterstützter Paketmanager für Ziel-Repositories: npm, Yarn, PNPM oder Bun

### Klonen

```bash
git clone https://github.com/chavatte/sentinel-forge.git
cd sentinel-forge
```

### Corepack aktivieren

```bash
corepack enable
```

### Abhängigkeiten installieren

```bash
yarn install --immutable
```

### Entwicklungsmodus starten

```bash
yarn dev
```

Vite startet den Renderer, während Electron über die konfigurierte Vite/Electron-Integration ausgeführt wird.

---

## 📦 Build & Verteilung

Erzeuge einen Production-Build mit:

```bash
yarn build
```

Die Pipeline führt TypeScript-Kompilierung, Vite-Bundling und Electron-Paketierung aus.

### Plattformziele

| Plattform | Artefakte |
| --- | --- |
| **Windows** | NSIS-Installer (`.exe`) |
| **Linux** | AppImage und `.deb` |
| **macOS** | `.dmg` und `.zip` für Intel / Apple Silicon |

GitHub Releases wird als Publishing-Backend über `electron-builder` und `electron-updater` verwendet.

### Release-Workflow

Ein Versionstag im Format `v*` startet den Release-Workflow. GitHub Actions baut die Anwendung für Windows, Ubuntu und macOS mit Node.js 22 und Yarn 4.

```bash
git tag v1.0.8
git push origin v1.0.8
```

> Release-Signierung hängt von der im Build-Umfeld verfügbaren Signaturkonfiguration ab. Der aktuelle CI-Workflow deaktiviert die automatische Zertifikatserkennung.

---

## 📁 Projektstruktur

```text
sentinel-forge/
├── electron/
│   ├── ipc/                 # Security- und System-IPC-Handler
│   ├── preload/             # IPC-Brücken zum Renderer
│   ├── main.ts              # Electron Entry Point
│   ├── preload.ts           # Preload Entry Point
│   ├── tray.ts              # System Tray und Dokumentationsfenster
│   ├── updater.ts            # Application Updates
│   └── logger.ts             # Application Logging
│
├── src/
│   ├── components/          # React-Komponenten
│   ├── hooks/               # Application Hooks
│   ├── locales/             # Übersetzungsressourcen
│   ├── utils/               # Risk, Reporting und Helper
│   ├── App.tsx              # Application Shell
│   └── main.tsx             # React Entry Point
│
├── public/
│   ├── help.html             # Einstieg in die Offline-Dokumentation
│   └── help/                 # Dokumentations-Assets und Skripte
│
├── docs/assets/              # README- / Projektscreenshots
├── .github/workflows/        # Release-Automatisierung
├── electron-builder.json5    # Packaging-Konfiguration
├── vite.config.ts            # Vite + Electron-Konfiguration
└── package.json
```

---

## 🧪 Entwicklungshinweise

Sentinel Forge ist ein aktiv entwickeltes Security-Engineering-Projekt. Analyse-Engines, Remediation-Workflows und das Desktop-Sicherheitsmodell werden fortlaufend erweitert.

Bei Erweiterungen des Projekts:

1. Privilegierte Operationen im Electron-Main-Prozess halten.
2. Nur eng begrenzte Operationen über Preload-IPC bereitstellen.
3. Eingaben vor Datei-, Git- oder Prozessoperationen validieren.
4. Production CSP und Electron-Hardening beibehalten.
5. Für Security-Tools deterministische Parser und strukturierte Ausgaben bevorzugen.
6. Findings nachvollziehbar und bis zu ihrer Quelle erklärbar halten.

---

## ⚠️ Sicherheit & Betrieb

Sentinel Forge ist ein defensives Security-Tool. Automatisierte Remediation und Repository-Befehle können Working Trees und Remote-Repositories verändern.

Verwende beim Testen von Git-OPS Branches, Backups und geeignete Repository-Berechtigungen.

Für aktuelle externe Vulnerability Intelligence ist eine Verbindung zu OSV.dev erforderlich. Lokale Repository-Analyse bleibt für alle Prüfungen verfügbar, die keine externen Dienste benötigen.

---

## 📚 Dokumentation & Ressourcen

- **Integriertes Help Center:** Bestandteil der Desktop-Anwendung
- **GitHub Repository:** https://github.com/chavatte/sentinel-forge
- **OSV.dev:** https://osv.dev/
- **CycloneDX:** https://cyclonedx.org/
- **Electron:** https://www.electronjs.org/

---

## 🗺️ Roadmap

Das Projekt entwickelt sich zu einer umfassenderen Developer-Security-Plattform mit Schwerpunkt auf:

- tieferer Supply-Chain-Intelligence
- stärkerer Repository-Forensik
- erweiterter SAST-Abdeckung
- sichererer automatisierter Remediation
- tieferer EDR-artiger Workspace-Telemetrie
- verbessertem Reporting und Compliance-Workflows
- zusätzlichen Developer-Security-Integrationen

---

## 🤝 Mitwirken

Beiträge, Bug-Reports und sicherheitsorientiertes Feedback sind willkommen.

Bei Änderungen an sicherheitsrelevantem Verhalten bitte angeben:

- die adressierte Bedrohung oder den Use Case
- die betroffene Sicherheitsgrenze
- reproduzierbare Schritte oder Testnachweise
- mögliche Auswirkungen auf gepackte Electron-Builds

---

## 📜 Lizenz

Sentinel Forge wird unter der **MIT License** veröffentlicht.

Copyright © 2026 **DevChavatte**.

Siehe [LICENSE](./LICENSE) für den vollständigen Lizenztext.

---

<div align="center">

**Sentinel Forge — Developer Security, Supply-Chain-Intelligence und taktisches EDR.**

Entwickelt und gepflegt von **[DevChavatte](https://github.com/chavatte)**.

</div>
