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
			  

/pre>

<div align="center">

---

## Descripción general

Las aplicaciones modernas heredan una gran superficie de ataque de su código fuente, dependencias, credenciales, pipelines de CI/CD y herramientas de desarrollo. Sentinel Forge fue diseñado para hacer visible y accionable esta superficie directamente desde la estación de trabajo del desarrollador.

La aplicación combina el análisis de seguridad con flujos operativos, en lugar de tratar el scanning como un simple informe:

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

Sentinel Forge está construido con Electron, React, TypeScript y Vite, con un proceso principal de Electron orientado a la seguridad que coordina los motores de análisis locales y la interfaz renderer.

---

## ✨ Capacidades

### Seguridad de la cadena de suministro

Sentinel Forge audita ecosistemas de paquetes JavaScript en flujos de **npm, Yarn, PNPM y Bun**. Los hallazgos de dependencias pueden correlacionarse con la inteligencia de vulnerabilidades de OSV.dev, mientras que los paquetes desactualizados se presentan como señales de deuda técnica.

- Análisis de dependencias directas y transitivas
- Visibilidad de vulnerabilidades orientada a CVE / GHSA
- Detección de dependencias desactualizadas
- Parsing compatible con Yarn Berry
- Parsing de auditorías JSON y mecanismos de fallback
- Correlación entre hallazgos de dependencias e historial del repositorio

### 🔐 SAST y detección de secretos

El motor SAST local busca credenciales potencialmente expuestas y otros patrones de alto riesgo en los repositorios.

- Patrones de credenciales de AWS y cloud
- Tokens de GitHub
- Claves SSH privadas
- Secretos con formato Stripe
- Reglas personalizadas mediante expresiones regulares
- Scanning local sin requerir un servicio de análisis externo

> Las reglas personalizadas permiten adaptar el scanner a tokens de API internos, formatos propietarios de credenciales e indicadores específicos de la organización.

### 🕵️ Forense de repositorios

Los hallazgos de seguridad son más útiles cuando se puede identificar su origen.

Sentinel Forge integra el análisis del historial de Git para conectar los hallazgos de dependencias vulnerables con el contexto del repositorio, incluido el commit y el autor asociados con la introducción de una dependencia.

<div align="center"> <img src="./docs/assets/threat-radar.png" alt="Sentinel Forge Threat Radar" /> </div>

### ⚙️ Git-OPS y remediación

El flujo Git-OPS está diseñado para la remediación automatizada y controlada de hallazgos de dependencias.

Flujo típico:

```
Hallazgo
  ↓
Analizar la dependencia afectada
  ↓
Aplicar la actualización de seguridad
  ↓
Resolver / actualizar el lockfile
  ↓
Preparar los manifests esperados
  ↓
Crear commit firmado / atribuido a la aplicación
  ↓
Enviar la remediación al origin
```

El objetivo es reducir la distancia entre **encontrar un problema en la cadena de suministro** y **producir un cambio de remediación trazable**.

### 📊 Puntuación de riesgo e informes

Los hallazgos técnicos se consolidan en una visión de riesgo a nivel de aplicación.

- Puntuación numérica de riesgo de **0–100**
- Clasificación por letras de **A a F**
- Vulnerabilidades y secretos incorporados a la postura de seguridad
- Informes HTML interactivos
- Generación de informes PDF
- Exportación de JSON sin procesar para procesamiento externo
- Generación de SBOM en CycloneDX

<div align="center"> <img src="./docs/assets/compliance-report.png" alt="Sentinel Forge Compliance Report" /> </div>

### 👁️ EDR Watcher

El watcher proporciona monitorización en segundo plano para los workspaces mapeados y puede generar notificaciones nativas de escritorio cuando se detectan condiciones de seguridad relevantes durante la actividad normal de desarrollo.

Esta funcionalidad está concebida como una capa ligera de detección del lado del desarrollador, no como sustituto de las plataformas empresariales de telemetría de endpoints.

### 🖥️ Terminal integrado

Sentinel Forge incluye una superficie integrada de terminal/log basada en **xterm.js**, que permite observar las operaciones de seguridad y mantenimiento directamente dentro de la aplicación.

La renderización de colores ANSI está configurada explícitamente tanto para el entorno de desarrollo como para los entornos Electron empaquetados.

---

## 🏗️ Arquitectura

Sentinel Forge sigue una arquitectura Electron separada, diseñada para mantener las operaciones privilegiadas fuera del renderer.

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

### Capas principales

| Capa                       | Responsabilidad                                                                     |
| -------------------------- | ----------------------------------------------------------------------------------- |
| **React Renderer**   | Dashboard, gestión de workspaces, configuración, hallazgos e interfaz de informes |
| **Preload / IPC**    | Puente restringido entre el renderer y las APIs privilegiadas de Electron           |
| **Electron Main**    | Ciclo de vida, ventanas, tray, políticas de seguridad y orquestación              |
| **Security Engines** | Auditoría, consultas a OSV, SAST, Git blame, SBOM y watcher                        |
| **Reporting**        | Exportaciones HTML, PDF y JSON                                                      |
| **Updater**          | Comprobaciones de actualización en producción mediante`electron-updater`        |

El renderer no recibe acceso irrestricto a Node.js. Las operaciones privilegiadas permanecen en el proceso principal de Electron y se exponen mediante APIs de preload controladas.

---

## 🔒 Modelo de seguridad

La seguridad es una restricción arquitectónica en Sentinel Forge, no simplemente una funcionalidad expuesta por la interfaz.

### Hardening de Electron

La aplicación utiliza controles de seguridad de Electron, entre ellos:

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- Restricciones de solicitudes de permisos
- Control de navegación de `BrowserWindow`
- Content Security Policy de producción
- Fronteras IPC locales mediante scripts de preload

### Ejecución de comandos

Las herramientas del repositorio se ejecutan en el proceso principal de Electron. La aplicación utiliza construcción y validación explícitas de comandos en lugar de exponer una API de shell genérica al renderer.

### CSP de producción

La aplicación empaquetada utiliza una Content Security Policy de producción. Como xterm.js crea estilos del renderer en tiempo de ejecución, la política permite explícitamente estilos inline de confianza, mientras que la ejecución remota de scripts permanece restringida.

### Análisis local-first

El SAST local y el análisis de repositorios pueden ejecutarse sin enviar el código fuente a un servicio externo de scanning. El acceso a la red se utiliza cuando se requiere inteligencia externa u operaciones Git remotas, como consultas de vulnerabilidades a OSV.dev o workflows Git remotos.

---

## 📖 Documentación integrada

Sentinel Forge incluye un **Help Center** integrado, en lugar de exigir que los usuarios dependan exclusivamente de un sitio web externo.

La documentación cubre áreas como:

- Flujo de uso de la aplicación
- Gestión de workspaces
- Análisis de seguridad
- Operaciones de mantenimiento
- Metodología de puntuación de riesgo
- Workflows Git-OPS
- Comandos operativos

El Help Center se empaqueta con la aplicación y sigue la misma estrategia de localización que la interfaz principal.

---

## 🌍 Localización

La aplicación actualmente incluye recursos de localización para:

- 🇺🇸 Inglés
- 🇧🇷 Portugués de Brasil
- 🇪🇸 Español
- 🇩🇪 Alemán
- 🇷🇺 Ruso
- 🇨🇳 Chino simplificado

El cambio de idioma se propaga por toda la aplicación y la interfaz del tray sin requerir un reinicio completo.

---

## 🧰 Stack tecnológico

| Tecnología                       | Función                                       |
| --------------------------------- | ---------------------------------------------- |
| **Electron 43**             | Runtime de escritorio multiplataforma          |
| **React 19**                | UI del renderer                                |
| **TypeScript 7**            | Lenguaje de la aplicación                     |
| **Vite 8**                  | Build del frontend e integración con Electron |
| **Yarn 4 (Berry)**          | Gestor de paquetes                             |
| **xterm.js**                | Renderizado del terminal/log integrado         |
| **Chokidar**                | Monitorización del sistema de archivos        |
| **i18next / react-i18next** | Localización                                  |
| **electron-builder**        | Empaquetado de escritorio                      |
| **electron-updater**        | Mecanismo de actualización en producción     |

---

## 🚀 Primeros pasos

### Requisitos

- **Node.js 22+**
- **Yarn 4** mediante Corepack
- Git
- Un gestor de paquetes compatible para auditar los repositorios objetivo: npm, Yarn, PNPM o Bun

### Clonar

```
git clone https://github.com/chavatte/sentinel-forge.git
cd sentinel-forge
```

### Habilitar Corepack

```
corepack enable
```

### Instalar dependencias

```
yarn install --immutable
```

### Iniciar modo de desarrollo

```
yarn dev
```

El servidor de desarrollo de Vite inicia el renderer mientras Electron se lanza mediante la integración Vite/Electron configurada en el proyecto.

---

## 📦 Build y distribución

Crea un build de producción con:

```
yarn build
```

El pipeline ejecuta la compilación de TypeScript, el bundling con Vite y el empaquetado de Electron.

### Targets de plataforma

The current Electron Builder configuration targets:

| Plataforma        | Artefactos                                     |
| ----------------- | ---------------------------------------------- |
| **Windows** | Instalador NSIS (`.exe`)                     |
| **Linux**   | AppImage y`.deb`                             |
| **macOS**   | `.dmg` y `.zip` para Intel / Apple Silicon |

El proyecto utiliza GitHub Releases como backend de publicación mediante `electron-builder` y `electron-updater`.

### Flujo de release

Una etiqueta de versión que coincida con `v*` activa el workflow de release del repositorio. GitHub Actions compila la aplicación en Windows, Ubuntu y macOS usando Node.js 22 y Yarn 4.

Ejemplo:

```
git tag v1.0.8
git push origin v1.0.8
```

> La firma de releases depende de la configuración de firma disponible en el entorno de build. El workflow del repositorio deshabilita actualmente la detección automática de certificados para builds de CI.

---

## 📁 Estructura del proyecto

```
sentinel-forge/
├── electron/
│   ├── ipc/                 # Handlers IPC de seguridad y sistema
│   ├── preload/             # Puentes IPC expuestos al renderer
│   ├── main.ts              # Punto de entrada de Electron
│   ├── preload.ts           # Punto de entrada del preload
│   ├── tray.ts              # System tray y ventana de documentación
│   ├── updater.ts            # Actualizador de la aplicación
│   └── logger.ts             # Logs de la aplicación
│
├── src/
│   ├── components/          # Componentes React
│   ├── hooks/               # Hooks de la aplicación
│   ├── locales/             # Recursos de traducción
│   ├── utils/                # Riesgo, informes y helpers
│   ├── App.tsx              # Shell de la aplicación
│   └── main.tsx             # Punto de entrada de React
│
├── public/
│   ├── help.html             # Punto de entrada de documentación offline
│   └── help/                 # Assets y scripts de documentación
│
├── docs/assets/              # Imágenes del README / proyecto
├── .github/workflows/        # Automatización de releases
├── electron-builder.json5    # Configuración de empaquetado
├── vite.config.ts            # Configuración Vite + Electron
└── package.json
```

---

## 🧪 Notas de desarrollo

Sentinel Forge es un proyecto de ingeniería de seguridad en desarrollo activo. Las funcionalidades pueden evolucionar a medida que maduren los motores de análisis, los workflows de remediación y el modelo de seguridad del escritorio.

Al ampliar el proyecto, mantén las siguientes fronteras:

1. Mantén las operaciones privilegiadas en el proceso principal de Electron.
2. Expón únicamente operaciones de alcance restringido mediante IPC de preload.
3. Valida las entradas antes de operaciones de filesystem, Git o ejecución de procesos.
4. Preserva la CSP de producción y la configuración de hardening de Electron.
5. Prefiere parsers deterministas y salida estructurada en las herramientas de seguridad.
6. Mantén los hallazgos visibles para el usuario explicables y trazables hasta su origen.

---

## ⚠️ Consideraciones de seguridad y operación

Sentinel Forge es una herramienta de seguridad defensiva. Ejecutar remediaciones automatizadas o comandos de repositorio puede modificar working trees y repositorios remotos.

Utiliza ramas Git, copias de seguridad y permisos adecuados del repositorio al probar funcionalidades Git-OPS.

La conectividad con OSV.dev es necesaria para obtener inteligencia externa de vulnerabilidades en tiempo real. El scanning local de repositorios sigue disponible para análisis que no requieren servicios externos.

---

## 📚 Documentación y recursos

- **Help Center integrado:** incluido en la aplicación de escritorio
- **GitHub Repository:** [https://github.com/chavatte/sentinel-forge](https://github.com/chavatte/sentinel-forge)
- **OSV.dev:** [https://osv.dev/](https://osv.dev/)
- **CycloneDX:** [https://cyclonedx.org/](https://cyclonedx.org/)
- **Electron:** [https://www.electronjs.org/](https://www.electronjs.org/)

---

## 🗺️ Dirección del roadmap

El proyecto evoluciona hacia una plataforma más amplia de seguridad para desarrolladores, con énfasis en:

- inteligencia de supply chain más rica
- forense de repositorios más avanzada
- cobertura SAST ampliada
- remediación automatizada más segura
- telemetría de workspaces más profunda al estilo EDR
- mejores informes y workflows de compliance
- integraciones adicionales de seguridad centradas en desarrolladores

---

## 🤝 Contribuir

Las contribuciones, los informes de bugs y el feedback centrado en seguridad son bienvenidos.

Para cambios que afecten comportamientos sensibles a la seguridad, incluye:

- la amenaza o caso de uso tratado
- la frontera de seguridad afectada
- pasos reproducibles o evidencias de prueba
- cualquier impacto en builds empaquetados de Electron

---

## 📜 Licencia

Sentinel Forge se distribuye bajo la **Licencia MIT**.

Copyright © 2026 **DevChavatte**.

Consulta [LICENSE](./LICENSE) para ver el texto completo de la licencia.

---

<div align="center">
