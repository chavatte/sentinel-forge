const helpDict = {
  en: {
    nav_1: "1. Introduction",
    nav_2: "2. Workspace Management",
    nav_3: "3. Security Audit Engine",
    nav_4: "4. Maintenance Commands",
    nav_5: "5. Risk Score Methodology",
    nav_6: "6. Compliance & Reporting",
    nav_7: "7. SOC Monitor",
    title: "Sentinel Forge Documentation",
    intro_1:
      "Welcome to <strong>Sentinel Forge</strong>. This is a comprehensive Tactical Endpoint Detection and Response (EDR) tool and Dependency Hub designed specifically for Node.js ecosystems (NPM, Yarn, PNPM).",
    term_1: "[OK] Audit Engine Initialized.",
    term_2: "[OK] IPC Shield Operational.",
    sec2_title: "2. Workspace Management",
    sec2_desc:
      "Sentinel Forge allows you to map and monitor multiple repositories simultaneously.",
    sec2_c1_title: "📂 Local & Remote Git",
    sec2_c1_desc:
      "Map local folders or clone remote repositories securely using Git Sparse-Checkout (SSH Authentication supported).",
    sec3_title: "3. Security Audit Engine",
    sec3_desc:
      "The core relies on Triple-Scan Technology (Local + Global + SAST).",
    sec3_sast_custom:
      "* Supports Custom Regex Rules configured via System Settings.",
    sec3_osv: "🌐 OSV.dev Global Database",
    sec3_osv_desc:
      "Cross-references your direct and transitive dependencies against Google's Open Source Vulnerabilities database for maximum coverage.",
    sec3_cve: "Local Scanner (CVE & Tech Debt)",
    sec3_cve_desc:
      "Queries local package managers and compares current packages to identify vulnerabilities and outdated versions.",
    sec3_sast: "SAST (Secrets Scan)",
    sec3_sast_desc:
      "Deep file sweep to detect hardcoded secrets (AWS, GitHub, SSH Keys, Stripe, etc.) in the source code.",
    sec4_title: "4. Maintenance Commands",
    sec4_desc: "Execute secure package manager commands via the IPC Shield.",
    sec4_l1: "<strong>Deduplicate:</strong> Cleans up lockfile conflicts.",
    sec4_l2: "<strong>Force Sync:</strong> Clean install of dependencies.",
    sec4_l3:
      "<strong>Auto-Remediation:</strong> Attempts to auto-patch vulnerabilities.",
    sec4_l4:
      "<strong>Sentinel Git-OPS:</strong> Automatically commits and pushes security patches for remote repositories.",
    sec5_title: "5. Risk Score Methodology",
    sec5_desc:
      "A logarithmic index (0-100) evaluating structural security health.",
    sec5_sast: "SAST Penalty",
    sec5_sast_desc:
      "Any exposed secret immediately grants an automatic Grade F.",
    sec5_l1: "<strong>A (0 pts):</strong> Clean System.",
    sec5_l2: "<strong>B to C:</strong> Light to Moderate Debt.",
    sec5_l3:
      "<strong>D to F:</strong> High to Severe Risk (Intervention required).",
    sec6_title: "6. Compliance & Reporting",
    sec6_desc:
      "Export C-Level PDF/HTML reports or generate CycloneDX SBOMs for enterprise supply-chain security.",
    sec7_title: "7. Background SOC Monitor",
    sec7_desc:
      "Continuously monitors mapped repositories. Triggers native OS notifications if critical threats are introduced.",
    footer: "&copy; 2026 Sentinel Forge EDR. Built for modern DevSecOps.",
  },
  pt: {
    nav_1: "1. Introdução",
    nav_2: "2. Gestão de Workspaces",
    nav_3: "3. Motor de Auditoria",
    nav_4: "4. Comandos de Manutenção",
    nav_5: "5. Metodologia de Risco",
    nav_6: "6. Compliance e Relatórios",
    nav_7: "7. Monitor SOC",
    title: "Documentação Sentinel Forge",
    intro_1:
      "Bem-vindo ao <strong>Sentinel Forge</strong>. Uma ferramenta Táctica de EDR e Central de Dependências criada para ecossistemas Node.js (NPM, Yarn, PNPM).",
    term_1: "[OK] Motor de Auditoria Inicializado.",
    term_2: "[OK] Escudo IPC Operacional.",
    sec2_title: "2. Gestão de Workspaces",
    sec2_desc:
      "O Sentinel Forge permite mapear e monitorar múltiplos repositórios simultaneamente.",
    sec2_c1_title: "📂 Git Local & Remoto",
    sec2_c1_desc:
      "Mapeie pastas locais ou clone repositórios remotos de forma segura (suporta Autenticação SSH).",
    sec3_title: "3. Motor de Auditoria de Segurança",
    sec3_desc:
      "O núcleo baseia-se na tecnologia Triple-Scan (Local + Global + SAST).",
    sec3_sast_custom:
      "* Suporta Regras Regex Customizadas configuradas via Configurações do Sistema.",
    sec3_osv: "🌐 Banco Global OSV.dev",
    sec3_osv_desc:
      "Cruza suas dependências diretas e transitivas com o banco de dados Open Source Vulnerabilities do Google para máxima cobertura.",
    sec3_cve: "Scanner Local (CVE e Dívida Técnica)",
    sec3_cve_desc:
      "Consulta gestores de pacotes locais para identificar versões obsoletas e falhas técnicas.",
    sec3_sast: "SAST (Scan de Segredos)",
    sec3_sast_desc:
      "Varredura profunda para detetar segredos hardcoded (AWS, GitHub, Chaves SSH) no código-fonte.",
    sec4_title: "4. Comandos de Manutenção",
    sec4_desc: "Execute comandos de gestores de pacotes via Escudo IPC.",
    sec4_l1: "<strong>Deduplicar:</strong> Limpa conflitos no lockfile.",
    sec4_l2: "<strong>Forçar Sync:</strong> Instalação limpa de dependências.",
    sec4_l3:
      "<strong>Auto-Remediação:</strong> Tenta corrigir vulnerabilidades automaticamente.",
    sec4_l4:
      "<strong>Sentinel Git-OPS:</strong> Realiza commit e push automático de patches de segurança para repositórios remotos.",
    sec5_title: "5. Metodologia Risk Score",
    sec5_desc:
      "Um índice logarítmico (0-100) que avalia a saúde estrutural e de segurança.",
    sec5_sast: "Penalização SAST",
    sec5_sast_desc:
      "Qualquer segredo exposto resulta imediatamente numa Nota F automática.",
    sec5_l1: "<strong>A (0 pts):</strong> Sistema Limpo.",
    sec5_l2: "<strong>B a C:</strong> Dívida Leve a Moderada.",
    sec5_l3:
      "<strong>D a F:</strong> Risco Alto a Severo (Intervenção necessária).",
    sec6_title: "6. Compliance e Relatórios",
    sec6_desc:
      "Exporte relatórios PDF/HTML para executivos ou gere SBOMs CycloneDX para segurança corporativa.",
    sec7_title: "7. Monitor SOC em Background",
    sec7_desc:
      "Monitora continuamente os repositórios mapeados. Dispara notificações nativas do SO caso ameaças críticas sejam introduzidas.",
    footer:
      "&copy; 2026 Sentinel Forge EDR. Construído para o DevSecOps moderno.",
  },
  es: {
    nav_1: "1. Introducción",
    nav_2: "2. Gestión de Workspaces",
    nav_3: "3. Motor de Auditoría",
    nav_4: "4. Comandos de Mantenimiento",
    nav_5: "5. Metodología de Riesgo",
    nav_6: "6. Cumplimiento y Reportes",
    nav_7: "7. Monitor SOC",
    title: "Documentación Sentinel Forge",
    intro_1:
      "Bienvenido a <strong>Sentinel Forge</strong>. Una herramienta Táctica EDR y Centro de Dependencias diseñada para ecosistemas Node.js.",
    term_1: "[OK] Motor de Auditoría Inicializado.",
    term_2: "[OK] Escudo IPC Operativo.",
    sec2_title: "2. Gestión de Workspaces",
    sec2_desc: "Monitorea múltiples repositorios simultáneamente.",
    sec2_c1_title: "📂 Git Local y Remoto",
    sec2_c1_desc:
      "Mapea carpetas locales o clona repositorios remotos de forma segura (Soporta Auth SSH).",
    sec3_title: "3. Motor de Auditoría de Seguridad",
    sec3_desc:
      "El núcleo utiliza la tecnología Triple-Scan (Local + Global + SAST).",
    sec3_sast_custom:
      "* Admite Reglas Regex Personalizadas configuradas a través de la Configuración del Sistema.",
    sec3_osv: "🌐 Base de Datos Global OSV.dev",
    sec3_osv_desc:
      "Cruza sus dependencias directas y transitivas con la base de datos Open Source Vulnerabilities de Google para máxima cobertura.",
    sec3_cve: "Escáner Local (CVE y Deuda Técnica)",
    sec3_cve_desc:
      "Consulta gestores de paquetes para identificar vulnerabilidades y versiones obsoletas.",
    sec3_sast: "SAST (Escaneo de Secretos)",
    sec3_sast_desc:
      "Barrido profundo para detectar secretos hardcoded (AWS, GitHub, Claves SSH).",
    sec4_title: "4. Comandos de Mantenimiento",
    sec4_desc: "Ejecuta comandos seguros a través del Escudo IPC.",
    sec4_l1: "<strong>Deduplicar:</strong> Limpia conflictos en el lockfile.",
    sec4_l2:
      "<strong>Forzar Sync:</strong> Instalación limpia de dependencias.",
    sec4_l3:
      "<strong>Auto-Remediación:</strong> Intenta corregir vulnerabilidades automáticamente.",
    sec4_l4:
      "<strong>Sentinel Git-OPS:</strong> Confirma y empuja automáticamente parches de seguridad para repositorios remotos.",
    sec5_title: "5. Metodología Risk Score",
    sec5_desc:
      "Un índice logarítmico (0-100) que evalúa la salud de seguridad.",
    sec5_sast: "Penalización SAST",
    sec5_sast_desc:
      "Cualquier secreto expuesto otorga automáticamente una Calificación F.",
    sec5_l1: "<strong>A (0 pts):</strong> Sistema Limpio.",
    sec5_l2: "<strong>B a C:</strong> Deuda Leve a Moderada.",
    sec5_l3: "<strong>D a F:</strong> Riesgo Alto a Severo.",
    sec6_title: "6. Cumplimiento y Reportes",
    sec6_desc: "Exporta reportes C-Level en PDF/HTML o genera SBOMs CycloneDX.",
    sec7_title: "7. Monitor SOC en Background",
    sec7_desc:
      "Monitorea repositorios en segundo plano y dispara notificaciones nativas del SO ante amenazas críticas.",
    footer:
      "&copy; 2026 Sentinel Forge EDR. Construido para el DevSecOps moderno.",
  },
  ru: {
    nav_1: "1. Введение",
    nav_2: "2. Управление Рабочими Областями",
    nav_3: "3. Движок Аудита",
    nav_4: "4. Команды Обслуживания",
    nav_5: "5. Оценка Рисков",
    nav_6: "6. Комплаенс и Отчеты",
    nav_7: "7. SOC Монитор",
    title: "Документация Sentinel Forge",
    intro_1:
      "Добро пожаловать в <strong>Sentinel Forge</strong>. Инструмент тактического EDR и центр зависимостей для экосистем Node.js.",
    term_1: "[OK] Движок Аудита Инициализирован.",
    term_2: "[OK] IPC Щит Работает.",
    sec2_title: "2. Управление Рабочими Областями",
    sec2_desc: "Управляйте множеством репозиториев одновременно.",
    sec2_c1_title: "📂 Локальный и Удаленный Git",
    sec2_c1_desc:
      "Подключайте локальные папки или клонируйте удаленные репозитории (поддержка SSH).",
    sec3_title: "3. Движок Аудита Безопасности",
    sec3_desc:
      "Основан на технологии Triple-Scan (Локальная + Глобальная + SAST).",
    sec3_sast_custom:
      "* Поддерживает пользовательские правила Regex, настроенные через системные настройки.",
    sec3_osv: "🌐 Глобальная база данных OSV.dev",
    sec3_osv_desc:
      "Перекрестная проверка прямых и транзитивных зависимостей с базой данных Open Source Vulnerabilities от Google для максимального охвата.",
    sec3_cve: "Локальный сканер (CVE и Тех. Долг)",
    sec3_cve_desc:
      "Запрашивает локальные менеджеры пакетов для выявления уязвимостей и устаревших версий.",
    sec3_sast: "SAST (Поиск Секретов)",
    sec3_sast_desc:
      "Глубокое сканирование кода на наличие скрытых ключей (AWS, GitHub, SSH).",
    sec4_title: "4. Команды Обслуживания",
    sec4_desc: "Выполнение команд пакетного менеджера через IPC Щит.",
    sec4_l1: "<strong>Дедупликация:</strong> Очистка конфликтов в lockfile.",
    sec4_l2: "<strong>Принудительная Синхр.:</strong> Чистая установка.",
    sec4_l3:
      "<strong>Авто-исправление:</strong> Попытка автоматического патчинга.",
    sec4_l4:
      "<strong>Sentinel Git-OPS:</strong> Автоматически фиксирует и отправляет исправления безопасности для удаленных репозиториев.",
    sec5_title: "5. Методология Оценки Рисков",
    sec5_desc: "Логарифмический индекс (0-100) для оценки безопасности.",
    sec5_sast: "Штраф SAST",
    sec5_sast_desc: "Любой раскрытый секрет немедленно дает оценку F.",
    sec5_l1: "<strong>A (0 б.):</strong> Чистая Система.",
    sec5_l2: "<strong>B - C:</strong> Легкий / Средний долг.",
    sec5_l3: "<strong>D - F:</strong> Высокий / Критический риск.",
    sec6_title: "6. Комплаенс и Отчеты",
    sec6_desc: "Экспорт C-Level PDF/HTML отчетов и создание CycloneDX SBOM.",
    sec7_title: "7. Фоновый SOC Монитор",
    sec7_desc:
      "Непрерывный мониторинг репозиториев и OS уведомления при угрозах.",
    footer:
      "&copy; 2026 Sentinel Forge EDR. Создано для современного DevSecOps.",
  },
  zh: {
    nav_1: "1. 简介",
    nav_2: "2. 工作区管理",
    nav_3: "3. 安全审计引擎",
    nav_4: "4. 维护命令",
    nav_5: "5. 风险评分方法",
    nav_6: "6. 合规与报告",
    nav_7: "7. SOC 监控器",
    title: "Sentinel Forge 官方文档",
    intro_1:
      "欢迎使用 <strong>Sentinel Forge</strong>。这是一款专为 Node.js 生态系统设计的战术 EDR 和依赖管理中心。",
    term_1: "[OK] 审计引擎已初始化。",
    term_2: "[OK] IPC 护盾运行中。",
    sec2_title: "2. 工作区管理",
    sec2_desc: "允许您同时映射和监控多个存储库。",
    sec2_c1_title: "📂 本地与远程 Git",
    sec2_c1_desc: "安全地映射本地文件夹或克隆远程存储库 (支持 SSH 认证)。",
    sec3_title: "3. 安全审计引擎",
    sec3_desc: "核心技术依赖于三重扫描 (本地 + 全局 + SAST)。",
    sec3_sast_custom: "* 支持通过系统设置配置的自定义正则表达式规则。",
    sec3_osv: "🌐 OSV.dev 全球数据库",
    sec3_osv_desc:
      "将您的直接和传递依赖项与 Google 的开源漏洞数据库进行交叉对比，以实现最大覆盖率。",
    sec3_cve: "本地扫描器 (CVE 与 技术债务)",
    sec3_cve_desc: "查询本地包管理器以识别漏洞和过期版本。",
    sec3_sast: "SAST (机密扫描)",
    sec3_sast_desc:
      "深度扫描源代码中硬编码的机密信息 (AWS, GitHub, SSH 密钥等)。",
    sec4_title: "4. 维护命令",
    sec4_desc: "通过 IPC 护盾安全执行包管理器命令。",
    sec4_l1: "<strong>去重处理:</strong> 清理 lockfile 冲突。",
    sec4_l2: "<strong>强制同步:</strong> 全新安装依赖项。",
    sec4_l3: "<strong>自动修复:</strong> 尝试自动修补漏洞。",
    sec4_l4:
      "<strong>Sentinel Git-OPS:</strong> 自动提交并推送远程存储库的安全补丁。",
    sec5_title: "5. 风险评分方法论",
    sec5_desc: "一个评估结构安全健康状况的对数指数 (0-100)。",
    sec5_sast: "SAST 惩罚",
    sec5_sast_desc: "任何暴露的机密将直接导致自动判定为 F 级。",
    sec5_l1: "<strong>A (0 分):</strong> 系统安全。",
    sec5_l2: "<strong>B 到 C:</strong> 轻度至中度债务。",
    sec5_l3: "<strong>D 到 F:</strong> 高危至严重风险 (需要干预)。",
    sec6_title: "6. 合规与报告",
    sec6_desc:
      "导出高管级 PDF/HTML 报告或生成 CycloneDX SBOM 以保障供应链安全。",
    sec7_title: "7. 后台 SOC 监控器",
    sec7_desc:
      "持续监控已映射的存储库。如果引入严重威胁，将触发原生操作系统警报。",
    footer: "&copy; 2026 Sentinel Forge EDR。为现代 DevSecOps 而生。",
  },
  de: {
    nav_1: "1. Einführung",
    nav_2: "2. Workspace-Verwaltung",
    nav_3: "3. Audit-Engine",
    nav_4: "4. Wartungsbefehle",
    nav_5: "5. Risk Score Methodik",
    nav_6: "6. Compliance & Berichte",
    nav_7: "7. SOC-Monitor",
    title: "Sentinel Forge Dokumentation",
    intro_1:
      "Willkommen bei <strong>Sentinel Forge</strong>. Ein taktisches EDR-Tool und Dependency-Hub für Node.js-Ökosysteme.",
    term_1: "[OK] Audit-Engine Initialisiert.",
    term_2: "[OK] IPC-Schild Einsatzbereit.",
    sec2_title: "2. Workspace-Verwaltung",
    sec2_desc: "Überwachen Sie mehrere Repositories gleichzeitig.",
    sec2_c1_title: "📂 Lokales & Remote Git",
    sec2_c1_desc:
      "Lokale Ordner zuordnen oder Remote-Repos sicher klonen (SSH-Auth unterstützt).",
    sec3_title: "3. Sicherheitsaudit-Engine",
    sec3_desc:
      "Der Kern nutzt Triple-Scan-Technologie (Lokal + Global + SAST).",
    sec3_sast_custom:
      "* Unterstützt benutzerdefinierte Regex-Regeln, die über die Systemeinstellungen konfiguriert werden.",
    sec3_osv: "🌐 OSV.dev Globale Datenbank",
    sec3_osv_desc:
      "Gleicht Ihre direkten und transitiven Abhängigkeiten mit der Open Source Vulnerabilities-Datenbank von Google ab, um maximale Abdeckung zu erzielen.",
    sec3_cve: "Lokaler Scanner (CVE & Tech Debt)",
    sec3_cve_desc:
      "Fragt lokale Paketmanager ab und identifiziert Schwachstellen sowie veraltete Versionen.",
    sec3_sast: "SAST (Geheimnis-Scan)",
    sec3_sast_desc:
      "Tiefer Dateiscan auf hardcodierte Geheimnisse (AWS, GitHub, SSH-Schlüssel).",
    sec4_title: "4. Wartungsbefehle",
    sec4_desc: "Führen Sie Paketmanager-Befehle über das IPC-Schild aus.",
    sec4_l1: "<strong>Deduplizieren:</strong> Bereinigt Lockfile-Konflikte.",
    sec4_l2:
      "<strong>Sync Erzwingen:</strong> Saubere Installation der Abhängigkeiten.",
    sec4_l3:
      "<strong>Auto-Remediation:</strong> Versucht Schwachstellen automatisch zu patchen.",
    sec4_l4:
      "<strong>Sentinel Git-OPS:</strong> Übernimmt und pusht Sicherheitspatches für Remote-Repositorys automatisch.",
    sec5_title: "5. Risk Score Methodik",
    sec5_desc:
      "Ein logarithmischer Index (0-100) zur Bewertung der strukturellen Sicherheit.",
    sec5_sast: "SAST-Strafe",
    sec5_sast_desc:
      "Jedes exponierte Geheimnis führt sofort zu einer automatischen Note F.",
    sec5_l1: "<strong>A (0 Pkt):</strong> Sauberes System.",
    sec5_l2: "<strong>B bis C:</strong> Leichte bis mittlere Schulden.",
    sec5_l3: "<strong>D bis F:</strong> Hohes bis schweres Risiko.",
    sec6_title: "6. Compliance & Berichte",
    sec6_desc:
      "Exportieren Sie C-Level PDF/HTML-Berichte oder generieren Sie CycloneDX SBOMs.",
    sec7_title: "7. Hintergrund SOC-Monitor",
    sec7_desc:
      "Überwacht Repositories kontinuierlich und löst OS-Benachrichtigungen bei Bedrohungen aus.",
    footer:
      "&copy; 2026 Sentinel Forge EDR. Entwickelt für modernes DevSecOps.",
  },
};
