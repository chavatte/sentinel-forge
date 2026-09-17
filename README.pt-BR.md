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

### Detecção e Resposta Tática a Incidentes para Segurança de Desenvolvedores

[![Version](https://img.shields.io/badge/version-1.0.8-0f172a.svg)](https://github.com/chavatte/sentinel-forge/releases)
[![Electron](https://img.shields.io/badge/Electron-43-47848F?logo=electron&logoColor=white)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=111827)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vite.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Yarn](https://img.shields.io/badge/Yarn-4%20Berry-2C8EBB?logo=yarn&logoColor=white)](https://yarnpkg.com/)
[![License](https://img.shields.io/badge/license-MIT-22c55e.svg)](./LICENSE)

**Idiomas:** 🇺🇸 [English](README.md) · 🇧🇷 **Português** · 🇪🇸 [Español](README.es.md) · 🇩🇪 [Deutsch](README.de.md) · 🇷🇺 [Русский](README.ru.md) · 🇨🇳 [简体中文](README.zh-CN.md)

**Detecte. Investigue. Remedie.**

O Sentinel Forge é uma aplicação desktop focada em segurança que reúne auditoria de supply chain de software, detecção de segredos, forense de repositórios, pontuação de risco, geração de SBOM e remediação baseada em Git em uma única interface local no estilo SOC.

[Recursos](#-capacidades) • [Arquitetura](#-arquitetura) • [Segurança](#-modelo-de-segurança) • [Instalação](#-primeiros-passos) • [Build](#-build-e-distribuição) • [Documentação](#-documentação-integrada)


<img src="./docs/assets/main-dashboard.png" alt="Painel do Sentinel Forge"  />

</div>

---

## Visão geral

Aplicações modernas herdam uma grande superfície de ataque de seu código-fonte, dependências, credenciais, pipelines de CI/CD e ferramentas de desenvolvimento. O Sentinel Forge foi projetado para tornar essa superfície visível e acionável diretamente na estação de trabalho do desenvolvedor.

A aplicação combina análise de segurança com fluxos operacionais, em vez de tratar o scanning como um simples relatório:

```text
┌──────────────────────────────────────────────────────────────┐
│                      SENTINEL FORGE                          │
├──────────────────────────────────────────────────────────────┤
│  Repositório                                                 │
│     │                                                        │
│     ├── Auditoria de Dependências ─► CVEs / GHSAs / Outdated │
│     ├── SAST / Segredos ───────────► Achados de Credenciais  │
│     ├── Forense Git ───────────────► Commit / Autor / Blame  │
│     ├── Motor de Risco ────────────► 0–100 / A–F             │
│     └── Gerador SBOM ──────────────► CycloneDX               │
│                                                              │
│  Remediação Git-OPS opcional ─────► Patch → Commit → Push    │
└──────────────────────────────────────────────────────────────┘
```

O Sentinel Forge é construído com Electron, React, TypeScript e Vite, com um processo principal Electron orientado à segurança coordenando os mecanismos locais de análise e a interface renderer.

---

## ✨ Capacidades

### Segurança de Supply Chain

O Sentinel Forge audita ecossistemas de pacotes JavaScript em fluxos **npm, Yarn, PNPM e Bun**. Achados de dependências podem ser correlacionados com a inteligência de vulnerabilidades do OSV.dev, enquanto pacotes desatualizados são apresentados como sinais de dívida técnica.

- Análise de dependências diretas e transitivas
- Visibilidade de vulnerabilidades orientada a CVE / GHSA
- Detecção de dependências desatualizadas
- Parsing compatível com Yarn Berry
- Parsing de auditorias em JSON e mecanismos de fallback
- Correlação entre achados de dependências e histórico do repositório

### 🔐 SAST e Detecção de Segredos

O mecanismo SAST local procura credenciais potencialmente expostas e outros padrões de alto risco nos repositórios.

- Padrões de credenciais AWS e cloud
- Tokens do GitHub
- Chaves SSH privadas
- Segredos no formato Stripe
- Regras personalizadas por expressão regular
- Scanning local sem exigir um serviço externo de análise

> As regras personalizadas permitem adaptar o scanner a tokens internos de API, formatos proprietários de credenciais e indicadores específicos da organização.

### 🕵️ Forense de Repositórios

Achados de segurança se tornam mais úteis quando é possível identificar sua origem.

O Sentinel Forge integra análise do histórico Git para conectar achados de dependências vulneráveis ao contexto do repositório, incluindo o commit e o autor associados à introdução de uma dependência.

<div align="center">
  <img src="./docs/assets/threat-radar.png" alt="Threat Radar do Sentinel Forge"  />
</div>

### ⚙️ Git-OPS e Remediação

O fluxo Git-OPS foi projetado para remediação automatizada e controlada de achados de dependências.

Fluxo típico:

```text
Achado
  ↓
Analisar dependência afetada
  ↓
Aplicar atualização de segurança
  ↓
Resolver / atualizar lockfile
  ↓
Preparar manifests esperados
  ↓
Criar commit assinado/atribuído à aplicação
  ↓
Enviar remediação para o origin
```

O objetivo é reduzir a distância entre **encontrar um problema de supply chain** e **produzir uma alteração de remediação rastreável**.

### 📊 Pontuação de Risco e Relatórios

Os achados técnicos são consolidados em uma visão de risco no nível da aplicação.

- Pontuação numérica de risco de **0–100**
- Classificação por letras de **A a F**
- Vulnerabilidades e segredos incorporados à postura de segurança
- Relatórios HTML interativos
- Geração de relatórios em PDF
- Exportação de JSON bruto para processamento externo
- Geração de SBOM em CycloneDX

<div align="center">
  <img src="./docs/assets/compliance-report.png" alt="Relatório de Compliance do Sentinel Forge"  />
</div>

### 👁️ EDR Watcher

O watcher fornece monitoramento em segundo plano para workspaces mapeados e pode gerar notificações nativas do desktop quando condições relevantes de segurança são detectadas durante a atividade normal de desenvolvimento.

Esse recurso foi concebido como uma camada leve de detecção no lado do desenvolvedor, e não como substituto de plataformas corporativas de telemetria de endpoint.

### 🖥️ Terminal Integrado

O Sentinel Forge inclui uma superfície integrada de terminal/log baseada em **xterm.js**, permitindo observar operações de segurança e manutenção diretamente na aplicação.

A renderização de cores ANSI é configurada explicitamente tanto para o ambiente de desenvolvimento quanto para os ambientes Electron empacotados.

---

## 🏗️ Arquitetura

O Sentinel Forge segue uma arquitetura Electron separada, projetada para manter operações privilegiadas fora do renderer.

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

### Camadas principais

| Camada | Responsabilidade |
| --- | --- |
| **React Renderer** | Dashboard, gerenciamento de workspaces, configurações, achados e UI de relatórios |
| **Preload / IPC** | Ponte restrita entre renderer e APIs privilegiadas do Electron |
| **Electron Main** | Ciclo de vida, janelas, tray, políticas de segurança e orquestração |
| **Security Engines** | Auditoria, consultas OSV, SAST, Git blame, SBOM e watcher |
| **Reporting** | Exportações HTML, PDF e JSON |
| **Updater** | Verificações de atualização em produção via `electron-updater` |

O renderer não recebe acesso irrestrito ao Node.js. Operações privilegiadas ficam no processo principal do Electron e são expostas por APIs de preload controladas.

---

## 🔒 Modelo de Segurança

Segurança é uma restrição arquitetural no Sentinel Forge, não apenas um recurso exposto pela interface.

### Hardening do Electron

A aplicação utiliza controles de segurança do Electron, incluindo:

- `contextIsolation: true`
- `nodeIntegration: false`
- `sandbox: true`
- Restrições de requisições de permissão
- Controle de navegação de `BrowserWindow`
- Content Security Policy de produção
- Fronteiras de IPC local por meio de scripts preload

### Execução de comandos

As ferramentas de repositório são executadas no processo principal do Electron. A aplicação usa construção e validação explícitas de comandos, em vez de expor uma API genérica de shell ao renderer.

### CSP de produção

A aplicação empacotada usa uma Content Security Policy de produção. Como o xterm.js cria estilos do renderer em tempo de execução, estilos inline confiáveis são permitidos explicitamente pela política, enquanto a execução remota de scripts permanece restrita.

### Análise local-first

SAST local e análise de repositórios podem ser executados sem enviar código-fonte para um serviço externo de scanning. O acesso à rede é utilizado quando inteligência externa ou operações remotas de Git são necessárias, como consultas de vulnerabilidades ao OSV.dev ou workflows remotos de Git.

---

## 📖 Documentação Integrada

O Sentinel Forge inclui um **Help Center** embarcado, em vez de exigir que os usuários dependam exclusivamente de um site externo.

A documentação cobre áreas como:

- Fluxo de uso da aplicação
- Gerenciamento de workspaces
- Análise de segurança
- Operações de manutenção
- Metodologia da pontuação de risco
- Workflows Git-OPS
- Comandos operacionais

O help center é empacotado com a aplicação e segue a mesma estratégia de localização da interface principal.

---

## 🌍 Localização

A aplicação atualmente inclui recursos de localização para:

- 🇺🇸 Inglês
- 🇧🇷 Português (Brasil)
- 🇪🇸 Espanhol
- 🇩🇪 Alemão
- 🇷🇺 Russo
- 🇨🇳 Chinês Simplificado

A troca de idioma é propagada para a aplicação e para a interface do tray sem exigir reinicialização completa.

---

## 🧰 Stack Tecnológica

| Tecnologia | Papel |
| --- | --- |
| **Electron 43** | Runtime desktop multiplataforma |
| **React 19** | UI do renderer |
| **TypeScript 7** | Linguagem da aplicação |
| **Vite 8** | Build do frontend e integração com Electron |
| **Yarn 4 (Berry)** | Gerenciador de pacotes |
| **xterm.js** | Renderização do terminal/log integrado |
| **Chokidar** | Monitoramento de sistema de arquivos |
| **i18next / react-i18next** | Localização |
| **electron-builder** | Empacotamento desktop |
| **electron-updater** | Mecanismo de atualização em produção |

---

## 🚀 Primeiros Passos

### Requisitos

- **Node.js 22+**
- **Yarn 4** via Corepack
- Git
- Um gerenciador de pacotes suportado para auditar os repositórios-alvo: npm, Yarn, PNPM ou Bun

### Clonar

```bash
git clone https://github.com/chavatte/sentinel-forge.git
cd sentinel-forge
```

### Habilitar Corepack

```bash
corepack enable
```

### Instalar dependências

```bash
yarn install --immutable
```

### Iniciar modo de desenvolvimento

```bash
yarn dev
```

O servidor de desenvolvimento Vite inicia o renderer enquanto o Electron é lançado pela integração Vite/Electron configurada no projeto.

---

## 📦 Build e Distribuição

Crie um build de produção com:

```bash
yarn build
```

O pipeline executa compilação TypeScript, bundling com Vite e empacotamento do Electron.

### Targets de plataforma

A configuração atual do Electron Builder tem como alvo:

| Plataforma | Artefatos |
| --- | --- |
| **Windows** | Instalador NSIS (`.exe`) |
| **Linux** | AppImage e `.deb` |
| **macOS** | `.dmg` e `.zip` para Intel / Apple Silicon |

O projeto usa GitHub Releases como backend de publicação por meio do `electron-builder` e do `electron-updater`.

### Fluxo de release

Uma tag de versão no formato `v*` dispara o workflow de release do repositório. O GitHub Actions compila a aplicação em Windows, Ubuntu e macOS usando Node.js 22 e Yarn 4.

Exemplo:

```bash
git tag v1.0.8
git push origin v1.0.8
```

> A assinatura de release depende da configuração de assinatura disponível no ambiente de build. O workflow do repositório desabilita atualmente a descoberta automática de certificados para builds de CI.

---

## 📁 Estrutura do Projeto

```text
sentinel-forge/
├── electron/
│   ├── ipc/                 # Handlers IPC de segurança e sistema
│   ├── preload/             # Pontes IPC expostas ao renderer
│   ├── main.ts              # Ponto de entrada Electron
│   ├── preload.ts           # Entry point do preload
│   ├── tray.ts              # System tray e janela de documentação
│   ├── updater.ts            # Atualização da aplicação
│   └── logger.ts             # Logs da aplicação
│
├── src/
│   ├── components/          # Componentes React
│   ├── hooks/               # Hooks da aplicação
│   ├── locales/              # Recursos de tradução
│   ├── utils/                # Risk, reporting e helpers
│   ├── App.tsx              # Shell da aplicação
│   └── main.tsx             # Entry point React
│
├── public/
│   ├── help.html             # Entrada da documentação offline
│   └── help/                 # Assets e scripts da documentação
│
├── docs/assets/              # Imagens do README / projeto
├── .github/workflows/        # Automação de release
├── electron-builder.json5    # Configuração de packaging
├── vite.config.ts            # Configuração Vite + Electron
└── package.json
```

---

## 🧪 Notas de Desenvolvimento

O Sentinel Forge é um projeto de engenharia de segurança em desenvolvimento ativo. Os recursos podem evoluir à medida que os mecanismos de análise, workflows de remediação e modelo de segurança do desktop amadurecem.

Ao estender o projeto, mantenha as seguintes fronteiras:

1. Mantenha operações privilegiadas no processo principal do Electron.
2. Exponha apenas operações de escopo restrito via IPC de preload.
3. Valide entradas antes de operações de filesystem, Git ou execução de processos.
4. Preserve o CSP de produção e as configurações de hardening do Electron.
5. Prefira parsers determinísticos e saída estruturada nas ferramentas de segurança.
6. Mantenha os achados visíveis ao usuário explicáveis e rastreáveis à origem.

---

## ⚠️ Segurança e Considerações Operacionais

O Sentinel Forge é uma ferramenta defensiva de segurança. Executar remediações automatizadas ou comandos de repositório pode modificar working trees e repositórios remotos.

Use branches Git, backups e permissões adequadas de repositório ao testar recursos Git-OPS.

A conectividade com o OSV.dev é necessária para inteligência externa de vulnerabilidades em tempo real. O scanning de repositórios local continua disponível para análises que não exigem serviços externos.

---

## 📚 Documentação e Recursos

- **Help Center integrado:** embarcado na aplicação desktop
- **GitHub Repository:** https://github.com/chavatte/sentinel-forge
- **OSV.dev:** https://osv.dev/
- **CycloneDX:** https://cyclonedx.org/
- **Electron:** https://www.electronjs.org/

---

## 🗺️ Direção do Roadmap

O projeto está evoluindo para uma plataforma mais ampla de segurança para desenvolvedores, com ênfase em:

- inteligência mais rica de supply chain
- forense de repositórios mais avançada
- cobertura SAST expandida
- remediação automatizada mais segura
- telemetria de workspace mais profunda no estilo EDR
- relatórios e workflows de compliance aprimorados
- integrações adicionais de segurança centradas no desenvolvedor

---

## 🤝 Contribuindo

Contribuições, relatos de bugs e feedback focado em segurança são bem-vindos.

Para alterações que afetem comportamentos sensíveis à segurança, inclua:

- a ameaça ou caso de uso tratado
- a fronteira de segurança afetada
- passos reproduzíveis ou evidências de teste
- qualquer impacto nos builds empacotados do Electron

---

## 📜 Licença

O Sentinel Forge é distribuído sob a **MIT License**.

Copyright © 2026 **DevChavatte**.

Consulte [LICENSE](./LICENSE) para o texto completo da licença.

---

<div align="center">

**Sentinel Forge — Segurança para Desenvolvedores, Inteligência de Supply Chain e EDR Tático.**

Construído e mantido por **[DevChavatte](https://github.com/chavatte)**.

</div>
