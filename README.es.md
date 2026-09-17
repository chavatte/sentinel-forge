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

<img src="./docs/assets/logo.png" alt="Logotipo de Sentinel Forge" />

# Sentinel Forge

### Detección y Respuesta Táctica a Incidentes para la Seguridad de Desarrolladores

[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.22819933.svg)](https://doi.org/10.5281/zenodo.22819933)
[![Version](https://img.shields.io/badge/version-1.0.8-0f172a.svg)](https://github.com/chavatte/sentinel-forge/releases)
[![Electron](https://img.shields.io/badge/Electron-43-47848F?logo=electron\&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react\&logoColor=111827)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite\&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript\&logoColor=white)](https://www.typescriptlang.org/)
[![Yarn](https://img.shields.io/badge/Yarn-4%20Berry-2C8EBB?logo=yarn\&logoColor=white)](https://yarnpkg.com/)
[![License](https://img.shields.io/badge/license-MIT-22c55e.svg)](./LICENSE)

**Idiomas:** 🇺🇸 [English](README.md) · 🇧🇷 [Português](README.pt-BR.md) · 🇪🇸 **Español** · 🇩🇪 [Deutsch](README.de.md) · 🇷🇺 [Русский](README.ru.md) · 🇨🇳 [简体中文](README.zh-CN.md)

**Detecte. Investigue. Remedie.**

Sentinel Forge es una aplicación de escritorio orientada a la seguridad que reúne auditoría de supply chain de software, detección de secretos, análisis forense de repositorios, puntuación de riesgo, generación de SBOM y remediación basada en Git en una única interfaz local con estilo SOC.

[Capacidades](#-capacidades) • [Arquitectura](#-arquitectura) • [Seguridad](#-modelo-de-seguridad) • [Instalación](#-primeros-pasos) • [Build](#-build-y-distribución) • [Documentación](#-documentación-integrada)

<img src="./docs/assets/main-dashboard.png" alt="Panel de Sentinel Forge" />

</div>

---

## Descripción general

Las aplicaciones modernas heredan una gran superficie de ataque de su código fuente, dependencias, credenciales, pipelines de CI/CD y herramientas de desarrollo. Sentinel Forge está diseñado para hacer que esta superficie sea visible y accionable directamente desde la estación de trabajo del desarrollador.

La aplicación combina análisis de seguridad con flujos operativos, en lugar de tratar el scanning como un simple informe:

```text
┌────────────────────────────────────────────────────────────────┐
│                      SENTINEL FORGE                            │
├────────────────────────────────────────────────────────────────┤
│  Repositorio                                                   │
│     │                                                          │
│     ├── Auditoría de Dependencias ─► CVEs / GHSAs / Outdated   │
│     ├── SAST / Secretos ───────────► Hallazgos de Credenciales │
│     ├── Forense Git ───────────────► Commit / Autor / Blame    │
│     ├── Motor de Riesgo ───────────► 0–100 / A–F               │
│     └── Generador SBOM ─────────────► CycloneDX                │
│                                                                │
│  Remediación Git-OPS opcional ─────► Patch → Commit → Push     │
└────────────────────────────────────────────────────────────────┘
```

Sentinel Forge está construido con Electron, React, TypeScript y Vite, con un proceso principal de Electron orientado a la seguridad que coordina los mecanismos locales de análisis y la interfaz renderer.

---

## ✨ Capacidades

### Seguridad de Supply Chain

Sentinel Forge audita ecosistemas de paquetes JavaScript mediante flujos de **npm, Yarn, PNPM y Bun**. Los hallazgos de dependencias pueden correlacionarse con la inteligencia de vulnerabilidades de OSV.dev, mientras que los paquetes desactualizados se presentan como indicadores de deuda técnica.

* Análisis de dependencias directas y transitivas
* Visibilidad de vulnerabilidades orientada a CVE / GHSA
* Detección de dependencias desactualizadas
* Parsing compatible con Yarn Berry
* Parsing de auditorías en JSON y mecanismos de fallback
* Correlación entre hallazgos de dependencias e historial del repositorio

### 🔐 SAST y Detección de Secretos

El motor SAST local busca credenciales potencialmente expuestas y otros patrones de alto riesgo dentro de los repositorios.

* Patrones de credenciales AWS y cloud
* Tokens de GitHub
* Claves SSH privadas
* Secretos en formato Stripe
* Reglas personalizadas mediante expresiones regulares
* Scanning local sin necesidad de un servicio externo de análisis

> Las reglas personalizadas permiten adaptar el scanner a tokens internos de API, formatos propietarios de credenciales e indicadores específicos de la organización.

### 🕵️ Análisis Forense de Repositorios

Los hallazgos de seguridad son más útiles cuando es posible identificar su origen.

Sentinel Forge integra análisis del historial Git para conectar los hallazgos de dependencias vulnerables con el contexto del repositorio, incluyendo el commit y el autor asociados con la introducción de una dependencia.

<div align="center">
  <img src="./docs/assets/threat-radar.png" alt="Threat Radar de Sentinel Forge" />
</div>

### ⚙️ Git-OPS y Remediación

El flujo Git-OPS está diseñado para la remediación automatizada y controlada de hallazgos relacionados con dependencias.

Flujo típico:

```text
Hallazgo
  ↓
Analizar dependencia afectada
  ↓
Aplicar actualización de seguridad
  ↓
Resolver / actualizar lockfile
  ↓
Preparar manifests esperados
  ↓
Crear commit firmado/atribuido a la aplicación
  ↓
Enviar remediación al origin
```

El objetivo es reducir la distancia entre **encontrar un problema de supply chain** y **producir un cambio de remediación rastreable**.

### 📊 Puntuación de Riesgo e Informes

Los hallazgos técnicos se consolidan en una visión de riesgo a nivel de aplicación.

* Puntuación numérica de riesgo de **0–100**
* Clasificación por letras de **A a F**
* Vulnerabilidades y secretos incorporados a la postura de seguridad
* Informes HTML interactivos
* Generación de informes en PDF
* Exportación de JSON sin procesar para procesamiento externo
* Generación de SBOM en CycloneDX

<div align="center">
  <img src="./docs/assets/compliance-report.png" alt="Informe de Compliance de Sentinel Forge" />
</div>

### 👁️ EDR Watcher

El watcher proporciona monitorización en segundo plano para los workspaces asignados y puede generar notificaciones nativas de escritorio cuando se detectan condiciones de seguridad relevantes durante la actividad normal de desarrollo.

Esta función está concebida como una capa ligera de detección del lado del desarrollador y no como sustituto de plataformas empresariales de telemetría de endpoints.

### 🖥️ Terminal Integrado

Sentinel Forge incluye una superficie integrada de terminal/log basada en **xterm.js**, que permite observar operaciones de seguridad y mantenimiento directamente desde la aplicación.

La renderización de colores ANSI está configurada explícitamente tanto para el entorno de desarrollo como para los entornos Electron empaquetados.

---

## 🏗️ Arquitectura

Sentinel Forge sigue una arquitectura Electron separada, diseñada para mantener las operaciones privilegiadas fuera del renderer.

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

### Capas principales

| Capa                 | Responsabilidad                                                                     |
| -------------------- | ----------------------------------------------------------------------------------- |
| **React Renderer**   | Dashboard, gestión de workspaces, configuraciones, hallazgos e interfaz de informes |
| **Preload / IPC**    | Puente restringido entre el renderer y las APIs privilegiadas de Electron           |
| **Electron Main**    | Ciclo de vida, ventanas, tray, políticas de seguridad y orquestación                |
| **Security Engines** | Auditoría, consultas OSV, SAST, Git blame, SBOM y watcher                           |
| **Reporting**        | Exportaciones HTML, PDF y JSON                                                      |
| **Updater**          | Comprobaciones de actualización en producción mediante `electron-updater`           |

El renderer no recibe acceso irrestricto a Node.js. Las operaciones privilegiadas permanecen en el proceso principal de Electron y se exponen mediante APIs de preload controladas.

---

## 🔒 Modelo de Seguridad

La seguridad es una restricción arquitectónica en Sentinel Forge, no simplemente una funcionalidad expuesta por la interfaz.

### Hardening de Electron

La aplicación utiliza controles de seguridad de Electron, incluyendo:

* `contextIsolation: true`
* `nodeIntegration: false`
* `sandbox: true`
* Restricciones de solicitudes de permisos
* Control de navegación de `BrowserWindow`
* Content Security Policy de producción
* Fronteras de IPC locales mediante scripts preload

### Ejecución de comandos

Las herramientas de repositorio se ejecutan en el proceso principal de Electron. La aplicación utiliza construcción y validación explícitas de comandos, en lugar de exponer una API de shell genérica al renderer.

### CSP de producción

La aplicación empaquetada utiliza una Content Security Policy de producción. Como xterm.js crea estilos del renderer durante la ejecución, se permiten explícitamente estilos inline de confianza mediante la política, mientras que la ejecución de scripts remotos permanece restringida.

### Análisis local-first

El SAST local y el análisis de repositorios pueden ejecutarse sin enviar código fuente a un servicio externo de scanning. El acceso a la red se utiliza cuando se necesita inteligencia externa u operaciones Git remotas, como consultas de vulnerabilidades a OSV.dev o workflows Git remotos.

---

## 📖 Documentación Integrada

Sentinel Forge incluye un **Help Center** integrado, en lugar de exigir que los usuarios dependan exclusivamente de un sitio web externo.

La documentación cubre áreas como:

* Flujo de uso de la aplicación
* Gestión de workspaces
* Análisis de seguridad
* Operaciones de mantenimiento
* Metodología de puntuación de riesgo
* Workflows Git-OPS
* Comandos operativos

El Help Center se empaqueta con la aplicación y sigue la misma estrategia de localización de la interfaz principal.

---

## 🌍 Localización

La aplicación actualmente incluye recursos de localización para:

* 🇺🇸 Inglés
* 🇧🇷 Portugués (Brasil)
* 🇪🇸 Español
* 🇩🇪 Alemán
* 🇷🇺 Ruso
* 🇨🇳 Chino Simplificado

El cambio de idioma se propaga a la aplicación y a la interfaz del tray sin requerir un reinicio completo.

---

## 🧰 Stack Tecnológico

| Tecnología                  | Rol                                           |
| --------------------------- | --------------------------------------------- |
| **Electron 43**             | Runtime de escritorio multiplataforma         |
| **React 19**                | UI del renderer                               |
| **TypeScript 7**            | Lenguaje de la aplicación                     |
| **Vite 8**                  | Build del frontend e integración con Electron |
| **Yarn 4 (Berry)**          | Gestor de paquetes                            |
| **xterm.js**                | Renderización del terminal/log integrado      |
| **Chokidar**                | Monitorización del sistema de archivos        |
| **i18next / react-i18next** | Localización                                  |
| **electron-builder**        | Empaquetado de escritorio                     |
| **electron-updater**        | Mecanismo de actualización en producción      |

---

## 🚀 Primeros Pasos

### Requisitos

* **Node.js 22+**
* **Yarn 4** mediante Corepack
* Git
* Un gestor de paquetes compatible para auditar los repositorios objetivo: npm, Yarn, PNPM o Bun

### Clonar

```bash
git clone https://github.com/chavatte/sentinel-forge.git
cd sentinel-forge
```

### Habilitar Corepack

```bash
corepack enable
```

### Instalar dependencias

```bash
yarn install --immutable
```

### Iniciar el modo de desarrollo

```bash
yarn dev
```

El servidor de desarrollo Vite inicia el renderer mientras Electron se ejecuta mediante la integración Vite/Electron configurada en el proyecto.

---

## 📦 Build y Distribución

Crea un build de producción con:

```bash
yarn build
```

El pipeline ejecuta la compilación de TypeScript, el bundling mediante Vite y el empaquetado de Electron.

### Targets de plataforma

La configuración actual de Electron Builder tiene como objetivo:

| Plataforma  | Artefactos                                 |
| ----------- | ------------------------------------------ |
| **Windows** | Instalador NSIS (`.exe`)                   |
| **Linux**   | AppImage y `.deb`                          |
| **macOS**   | `.dmg` y `.zip` para Intel / Apple Silicon |

El proyecto utiliza GitHub Releases como backend de publicación mediante `electron-builder` y `electron-updater`.

### Flujo de release

Una etiqueta de versión con el formato `v*` activa el workflow de release del repositorio. GitHub Actions compila la aplicación en Windows, Ubuntu y macOS utilizando Node.js 22 y Yarn 4.

Ejemplo:

```bash
git tag v1.0.8
git push origin v1.0.8
```

> La firma de releases depende de la configuración de firma disponible en el entorno de build. El workflow del repositorio deshabilita actualmente el descubrimiento automático de certificados para builds de CI.

---

## 📁 Estructura del Proyecto

```text
sentinel-forge/
├── electron/
│   ├── ipc/                 # Handlers IPC de seguridad y sistema
│   ├── preload/             # Puentes IPC expuestos al renderer
│   ├── main.ts              # Punto de entrada de Electron
│   ├── preload.ts           # Entry point del preload
│   ├── tray.ts              # System tray y ventana de documentación
│   ├── updater.ts           # Actualización de la aplicación
│   └── logger.ts             # Logs de la aplicación
│
├── src/
│   ├── components/          # Componentes React
│   ├── hooks/               # Hooks de la aplicación
│   ├── locales/             # Recursos de traducción
│   ├── utils/               # Risk, reporting y helpers
│   ├── App.tsx              # Shell de la aplicación
│   └── main.tsx             # Entry point de React
│
├── public/
│   ├── help.html             # Entrada de la documentación offline
│   └── help/                 # Assets y scripts de la documentación
│
├── docs/assets/              # Imágenes del README / proyecto
├── .github/workflows/        # Automatización de release
├── electron-builder.json5    # Configuración de packaging
├── vite.config.ts            # Configuración Vite + Electron
└── package.json
```

---

## 🧪 Notas de Desarrollo

Sentinel Forge es un proyecto de ingeniería de seguridad en desarrollo activo. Las funcionalidades pueden evolucionar a medida que maduren los mecanismos de análisis, los workflows de remediación y el modelo de seguridad del escritorio.

Al ampliar el proyecto, mantén las siguientes fronteras:

1. Mantén las operaciones privilegiadas en el proceso principal de Electron.
2. Expón únicamente operaciones de alcance restringido mediante IPC de preload.
3. Valida las entradas antes de realizar operaciones de filesystem, Git o ejecución de procesos.
4. Conserva la CSP de producción y las configuraciones de hardening de Electron.
5. Prefiere parsers deterministas y salidas estructuradas en las herramientas de seguridad.
6. Mantén los hallazgos visibles para el usuario explicables y rastreables hasta su origen.

---

## ⚠️ Seguridad y Consideraciones Operativas

Sentinel Forge es una herramienta defensiva de seguridad. La ejecución de remediaciones automatizadas o comandos de repositorio puede modificar working trees y repositorios remotos.

Utiliza ramas Git, backups y permisos adecuados de repositorio al probar las funcionalidades Git-OPS.

La conectividad con OSV.dev es necesaria para obtener inteligencia externa de vulnerabilidades en tiempo real. El scanning de repositorios local continúa disponible para análisis que no requieren servicios externos.

---

## 📚 Documentación y Recursos

* **Help Center integrado:** incluido en la aplicación de escritorio
* **GitHub Repository:** https://github.com/chavatte/sentinel-forge
* **OSV.dev:** https://osv.dev/
* **CycloneDX:** https://cyclonedx.org/
* **Electron:** https://www.electronjs.org/

---

## 🗺️ Dirección del Roadmap

El proyecto está evolucionando hacia una plataforma más amplia de seguridad para desarrolladores, con énfasis en:

* inteligencia más completa de supply chain
* análisis forense de repositorios más avanzado
* cobertura SAST ampliada
* remediación automatizada más segura
* telemetría más profunda del workspace al estilo EDR
* informes y workflows de compliance mejorados
* integraciones adicionales de seguridad centradas en el desarrollador

---

## 🤝 Contribuir

Las contribuciones, los informes de bugs y el feedback centrado en la seguridad son bienvenidos.

Para cambios que afecten comportamientos sensibles a la seguridad, incluye:

* la amenaza o caso de uso abordado
* la frontera de seguridad afectada
* pasos reproducibles o evidencias de prueba
* cualquier impacto en los builds empaquetados de Electron

---

## 📜 Licencia

Sentinel Forge se distribuye bajo la **MIT License**.

Copyright © 2026 **DevChavatte**.

Consulta [LICENSE](./LICENSE) para obtener el texto completo de la licencia.

---

<div align="center">

**Sentinel Forge — Seguridad para Desarrolladores, Inteligencia de Supply Chain y EDR Táctico.**

Construido y mantenido por **[DevChavatte](https://github.com/chavatte)**.

</div>


---

<div align="center">
