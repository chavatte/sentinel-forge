import dns from "node:dns/promises";
import { execSync } from "node:child_process";

export async function checkNetwork(): Promise<boolean> {
  try {
    await dns.lookup("registry.npmjs.org");
    return true;
  } catch {
    return false;
  }
}

export const c = {
  cyan: (t: string) => `\x1b[1;36m${t}\x1b[0m`,
  red: (t: string) => `\x1b[1;31m${t}\x1b[0m`,
  green: (t: string) => `\x1b[1;32m${t}\x1b[0m`,
  dim: (t: string) => `\x1b[2m${t}\x1b[0m`,
};

const dictionaries: Record<string, any> = {
  en: {
    dialogTitle: "Select the project root folder",
    sshKeyDialog: "Select SSH Private Key",
    saveReportDialog: "Save Tactical Report - Sentinel Forge",
    sbomMissingPackage: "package.json not found in this repository.",
    watcherAlertTitle: "🚨 Sentinel Forge EDR",
    watcherAlertBody: (proj: string, cNum: number, hNum: number) =>
      `Critical Threat introduced in project [${proj}]!\nDetected ${cNum} critical and ${hNum} high vulnerabilities.`,
    errPath: `\r\n${c.red("[ERROR]:")} Invalid projectPath.\r\n`,
    errDir: (cwd: string) =>
      `\r\n${c.red("[ERROR]:")} Invalid or nonexistent directory:\r\n📂 ${cwd}\r\n`,
    pipeline: (m: string, cmd: string, a: string, cwd: string) =>
      `\r\n${c.cyan("[SYSTEM]:")} Running ${m} audit...\r\n${c.dim(`$ ${cmd} ${a}`)}\r\n📂 ${c.dim(`cwd: ${cwd}`)}\r\n---\r\n`,
    spawnErr: (err: string) =>
      `\r\n${c.red("[ERROR]:")} Failed to start process:\r\n${err}\r\n`,
    timeoutErr: (ms: number) =>
      `\r\n${c.red("[TIMEOUT ERROR]:")} Process forcibly aborted. No response after ${ms / 1000} seconds.\r\n`,
    done: (code: number) =>
      `\r\n${c.green("✅ Operation completed")} (code ${code})\r\n`,
    before: (size: number) => c.dim(`BEFORE: ${size} bytes`),
    beforeNotFound: (f: string) => c.dim(`BEFORE: ${f} not found`),
    after: (size: number) => c.dim(`AFTER: ${size} bytes`),
    afterNotFound: (f: string) => c.dim(`AFTER: ${f} not found`),
    gitDiff: (add: number, rem: number, f: string) =>
      c.dim(`GIT: +${add} lines | -${rem} lines (${f})`),
    gitErr: c.dim("GIT: error reading diff."),
    gitNotRepo: c.dim("GIT: not a git repository."),
    resUpdate: (f: string) => c.cyan(`📌 Result: ${f} updated.`),
    resNoChange: (f: string) => c.dim(`📌 Result: no changes in ${f}.`),
    secAlert: (blocked: string) =>
      `\r\n\x1b[1;31m[SECURITY ALERT]:\x1b[0m Execution aborted. Disallowed characters: ${blocked}\r\n`,
    cloneInvalidUrl: `\r\n\x1b[1;31m[ERROR]: Invalid URL.\x1b[0m\r\n`,
    cloneSysInit: `\r\n\x1b[1;36m[SYSTEM]: Initializing Sparse Checkout operation...\x1b[0m\r\n`,
    cloneSshMsg: `> \x1b[33m[SSH Authentication Enabled]...\x1b[0m\r\n`,
    cloneMetaMsg: `> Downloading metadata...\r\n`,
    cloneExtractMsg: `> Extracting manifests...\r\n`,
    cloneSuccess: `\r\n\x1b[1;32m✅ Workspace isolated successfully.\x1b[0m\r\n`,
    cloneError: (err: string) =>
      `\r\n\x1b[1;31m[CLONING ERROR]:\x1b[0m ${err}\r\n`,
    cloneTimeoutErr: "Operation cancelled (Timeout Exceeded).",
    offlineWarn: `\r\n\x1b[33m[OFFLINE MODE]:\x1b[0m Network unreachable. Bypassing CVE and Tech Debt scans.\r\n`,
    offlineSast: `\x1b[35m[SYSTEM]: Executing local SAST (Secrets Scan) only...\x1b[0m\r\n`,
    trayOpenPanel: "Open Tactical Panel",
    trayCloseEngine: "Shutdown Engine (SOC)",
    trayTooltip: "Sentinel Forge - Active SOC Monitoring",
    trayDocs: "Documentation",
    trayCheckUpdates: "Check for Updates",
  },
  pt: {
    dialogTitle: "Selecione a pasta raiz do projeto",
    sshKeyDialog: "Selecione a Chave Privada SSH",
    saveReportDialog: "Guardar Relatório Tático - Sentinel Forge",
    sbomMissingPackage: "package.json não encontrado neste repositório.",
    watcherAlertTitle: "🚨 Sentinel Forge EDR",
    watcherAlertBody: (proj: string, cNum: number, hNum: number) =>
      `Ameaça Crítica introduzida no projeto [${proj}]!\nForam detetados ${cNum} críticos e ${hNum} altos.`,
    errPath: `\r\n${c.red("[ERRO]:")} projectPath inválido.\r\n`,
    errDir: (cwd: string) =>
      `\r\n${c.red("[ERRO]:")} Diretório inválido ou inexistente:\r\n📂 ${cwd}\r\n`,
    pipeline: (m: string, cmd: string, a: string, cwd: string) =>
      `\r\n${c.cyan("[SISTEMA]:")} Executando auditoria ${m}...\r\n${c.dim(`$ ${cmd} ${a}`)}\r\n📂 ${c.dim(`cwd: ${cwd}`)}\r\n---\r\n`,
    spawnErr: (err: string) =>
      `\r\n${c.red("[ERRO]:")} Falha ao iniciar processo:\r\n${err}\r\n`,
    timeoutErr: (ms: number) =>
      `\r\n${c.red("[ERRO DE TIMEOUT]:")} Processo abortado à força. Sem resposta após ${ms / 1000} segundos.\r\n`,
    done: (code: number) =>
      `\r\n${c.green("✅ Operação concluída")} (código ${code})\r\n`,
    before: (size: number) => c.dim(`ANTES: ${size} bytes`),
    beforeNotFound: (f: string) => c.dim(`ANTES: ${f} não encontrado`),
    after: (size: number) => c.dim(`DEPOIS: ${size} bytes`),
    afterNotFound: (f: string) => c.dim(`DEPOIS: ${f} não encontrado`),
    gitDiff: (add: number, rem: number, f: string) =>
      c.dim(`GIT: +${add} linhas | -${rem} linhas (${f})`),
    gitErr: c.dim("GIT: erro ao ler diff."),
    gitNotRepo: c.dim("GIT: não é um repositório git."),
    resUpdate: (f: string) => c.cyan(`📌 Resultado: ${f} atualizado.`),
    resNoChange: (f: string) =>
      c.dim(`📌 Resultado: nenhuma alteração em ${f}.`),
    secAlert: (blocked: string) =>
      `\r\n\x1b[1;31m[ALERTA DE SEGURANÇA]:\x1b[0m Execução abortada. Caracteres não permitidos: ${blocked}\r\n`,
    cloneInvalidUrl: `\r\n\x1b[1;31m[ERRO]: URL inválida.\x1b[0m\r\n`,
    cloneSysInit: `\r\n\x1b[1;36m[SISTEMA]: Inicializando operação Sparse Checkout...\x1b[0m\r\n`,
    cloneSshMsg: `> \x1b[33m[Autenticação SSH Ativada]...\x1b[0m\r\n`,
    cloneMetaMsg: `> Baixando metadados...\r\n`,
    cloneExtractMsg: `> Extraindo manifestos...\r\n`,
    cloneSuccess: `\r\n\x1b[1;32m✅ Workspace isolado com sucesso.\x1b[0m\r\n`,
    cloneError: (err: string) =>
      `\r\n\x1b[1;31m[ERRO DE CLONAGEM]:\x1b[0m ${err}\r\n`,
    cloneTimeoutErr: "Operação cancelada (Timeout Excedido).",
    offlineWarn: `\r\n\x1b[33m[MODO OFFLINE]:\x1b[0m Rede inacessível. Ignorando auditoria de CVEs e Dívida Técnica.\r\n`,
    offlineSast: `\x1b[35m[SISTEMA]: Executando apenas o scan SAST local (Segredos)...\x1b[0m\r\n`,
    trayOpenPanel: "Abrir Painel Tático",
    trayCloseEngine: "Encerrar Motor (SOC)",
    trayTooltip: "Sentinel Forge - Monitorização SOC Ativa",
    trayDocs: "Documentação",
    trayCheckUpdates: "Procurar Atualizações",
  },
  es: {
    dialogTitle: "Seleccione la carpeta raíz del proyecto",
    sshKeyDialog: "Seleccione la Clave Privada SSH",
    saveReportDialog: "Guardar Reporte Táctico - Sentinel Forge",
    sbomMissingPackage: "package.json no encontrado en este repositorio.",
    watcherAlertTitle: "🚨 Sentinel Forge EDR",
    watcherAlertBody: (proj: string, cNum: number, hNum: number) =>
      `¡Amenaza Crítica introducida en el proyecto [${proj}]!\nSe detectaron ${cNum} críticas y ${hNum} altas.`,
    errPath: `\r\n${c.red("[ERROR]:")} projectPath inválido.\r\n`,
    errDir: (cwd: string) =>
      `\r\n${c.red("[ERROR]:")} Directorio inválido o inexistente:\r\n📂 ${cwd}\r\n`,
    pipeline: (m: string, cmd: string, a: string, cwd: string) =>
      `\r\n${c.cyan("[SISTEMA]:")} Ejecutando auditoría ${m}...\r\n${c.dim(`$ ${cmd} ${a}`)}\r\n📂 ${c.dim(`cwd: ${cwd}`)}\r\n---\r\n`,
    spawnErr: (err: string) =>
      `\r\n${c.red("[ERROR]:")} Error al iniciar proceso:\r\n${err}\r\n`,
    timeoutErr: (ms: number) =>
      `\r\n${c.red("[ERROR DE TIMEOUT]:")} Proceso abortado forzosamente. Sin respuesta después de ${ms / 1000} segundos.\r\n`,
    done: (code: number) =>
      `\r\n${c.green("✅ Operación completada")} (código ${code})\r\n`,
    before: (size: number) => c.dim(`ANTES: ${size} bytes`),
    beforeNotFound: (f: string) => c.dim(`ANTES: ${f} no encontrado`),
    after: (size: number) => c.dim(`DESPUÉS: ${size} bytes`),
    afterNotFound: (f: string) => c.dim(`DESPUÉS: ${f} no encontrado`),
    gitDiff: (add: number, rem: number, f: string) =>
      c.dim(`GIT: +${add} líneas | -${rem} líneas (${f})`),
    gitErr: c.dim("GIT: error al leer diff."),
    gitNotRepo: c.dim("GIT: no es un repositorio git."),
    resUpdate: (f: string) => c.cyan(`📌 Resultado: ${f} actualizado.`),
    resNoChange: (f: string) => c.dim(`📌 Resultado: sin cambios en ${f}.`),
    secAlert: (blocked: string) =>
      `\r\n\x1b[1;31m[ALERTA DE SEGURIDAD]:\x1b[0m Ejecución abortada. Caracteres no permitidos: ${blocked}\r\n`,
    cloneInvalidUrl: `\r\n\x1b[1;31m[ERROR]: URL inválida.\x1b[0m\r\n`,
    cloneSysInit: `\r\n\x1b[1;36m[SISTEMA]: Inicializando operación Sparse Checkout...\x1b[0m\r\n`,
    cloneSshMsg: `> \x1b[33m[Autenticación SSH Activada]...\x1b[0m\r\n`,
    cloneMetaMsg: `> Descargando metadatos...\r\n`,
    cloneExtractMsg: `> Extrayendo manifiestos...\r\n`,
    cloneSuccess: `\r\n\x1b[1;32m✅ Workspace aislado con éxito.\x1b[0m\r\n`,
    cloneError: (err: string) =>
      `\r\n\x1b[1;31m[ERROR DE CLONACIÓN]:\x1b[0m ${err}\r\n`,
    cloneTimeoutErr: "Operación cancelada (Tiempo de espera excedido).",
    offlineWarn: `\r\n\x1b[33m[MODO OFFLINE]:\x1b[0m Red inaccesible. Omitiendo auditoría de CVEs y Deuda Técnica.\r\n`,
    offlineSast: `\x1b[35m[SISTEMA]: Ejecutando solo el escaneo SAST local (Secretos)...\x1b[0m\r\n`,
    trayOpenPanel: "Abrir Panel Táctico",
    trayCloseEngine: "Apagar Motor (SOC)",
    trayTooltip: "Sentinel Forge - Monitoreo SOC Activo",
    trayDocs: "Documentación",
    trayCheckUpdates: "Buscar Actualizaciones",
  },
  de: {
    dialogTitle: "Wählen Sie den Projektstammordner",
    sshKeyDialog: "Wählen Sie den privaten SSH-Schlüssel",
    saveReportDialog: "Taktischen Bericht speichern - Sentinel Forge",
    sbomMissingPackage: "package.json in diesem Repository nicht gefunden.",
    watcherAlertTitle: "🚨 Sentinel Forge EDR",
    watcherAlertBody: (proj: string, cNum: number, hNum: number) =>
      `Kritische Bedrohung in Projekt [${proj}] eingeführt!\n${cNum} kritische und ${hNum} hohe Schwachstellen erkannt.`,
    errPath: `\r\n${c.red("[FEHLER]:")} Ungültiger projectPath.\r\n`,
    errDir: (cwd: string) =>
      `\r\n${c.red("[FEHLER]:")} Ungültiges oder nicht existierendes Verzeichnis:\r\n📂 ${cwd}\r\n`,
    pipeline: (m: string, cmd: string, a: string, cwd: string) =>
      `\r\n${c.cyan("[SYSTEM]:")} Führe ${m} Audit aus...\r\n${c.dim(`$ ${cmd} ${a}`)}\r\n📂 ${c.dim(`cwd: ${cwd}`)}\r\n---\r\n`,
    spawnErr: (err: string) =>
      `\r\n${c.red("[FEHLER]:")} Prozess konnte nicht gestartet werden:\r\n${err}\r\n`,
    timeoutErr: (ms: number) =>
      `\r\n${c.red("[ZEITÜBERSCHREITUNG]:")} Prozess zwangsweise abgebrochen. Keine Antwort nach ${ms / 1000} Sekunden.\r\n`,
    done: (code: number) =>
      `\r\n${c.green("✅ Vorgang abgeschlossen")} (Code ${code})\r\n`,
    before: (size: number) => c.dim(`VORHER: ${size} Bytes`),
    beforeNotFound: (f: string) => c.dim(`VORHER: ${f} nicht gefunden`),
    after: (size: number) => c.dim(`NACHHER: ${size} Bytes`),
    afterNotFound: (f: string) => c.dim(`NACHHER: ${f} nicht gefunden`),
    gitDiff: (add: number, rem: number, f: string) =>
      c.dim(`GIT: +${add} Zeilen | -${rem} Zeilen (${f})`),
    gitErr: c.dim("GIT: Fehler beim Lesen des Diffs."),
    gitNotRepo: c.dim("GIT: Kein Git-Repository."),
    resUpdate: (f: string) => c.cyan(`📌 Ergebnis: ${f} aktualisiert.`),
    resNoChange: (f: string) => c.dim(`📌 Ergebnis: keine Änderungen in ${f}.`),
    secAlert: (blocked: string) =>
      `\r\n\x1b[1;31m[SICHERHEITSWARNUNG]:\x1b[0m Ausführung abgebrochen. Unzulässige Zeichen: ${blocked}\r\n`,
    cloneInvalidUrl: `\r\n\x1b[1;31m[FEHLER]: Ungültige URL.\x1b[0m\r\n`,
    cloneSysInit: `\r\n\x1b[1;36m[SYSTEM]: Initialisiere Sparse Checkout...\x1b[0m\r\n`,
    cloneSshMsg: `> \x1b[33m[SSH-Authentifizierung Aktiviert]...\x1b[0m\r\n`,
    cloneMetaMsg: `> Lade Metadaten herunter...\r\n`,
    cloneExtractMsg: `> Extrahiere Manifeste...\r\n`,
    cloneSuccess: `\r\n\x1b[1;32m✅ Workspace erfolgreich isoliert.\x1b[0m\r\n`,
    cloneError: (err: string) =>
      `\r\n\x1b[1;31m[KLONFEHLER]:\x1b[0m ${err}\r\n`,
    cloneTimeoutErr: "Vorgang abgebrochen (Zeitüberschreitung).",
    offlineWarn: `\r\n\x1b[33m[OFFLINE-MODUS]:\x1b[0m Netzwerk nicht erreichbar. CVE- und Tech-Debt-Scans übersprungen.\r\n`,
    offlineSast: `\x1b[35m[SYSTEM]: Führe nur lokalen SAST-Scan aus...\x1b[0m\r\n`,
    trayOpenPanel: "Taktisches Panel Öffnen",
    trayCloseEngine: "Engine Herunterfahren (SOC)",
    trayTooltip: "Sentinel Forge - Aktive SOC-Überwachung",
    trayDocs: "Dokumentation",
    trayCheckUpdates: "Nach Updates Suchen",
  },
  ru: {
    dialogTitle: "Выберите корневую папку проекта",
    sshKeyDialog: "Выберите приватный SSH-ключ",
    saveReportDialog: "Сохранить Тактический Отчет - Sentinel Forge",
    sbomMissingPackage: "package.json не найден в этом репозитории.",
    watcherAlertTitle: "🚨 Sentinel Forge EDR",
    watcherAlertBody: (proj: string, cNum: number, hNum: number) =>
      `Критическая Угроза внедрена в проект [${proj}]!\nОбнаружено ${cNum} критических и ${hNum} высоких уязвимостей.`,
    errPath: `\r\n${c.red("[ОШИБКА]:")} Неверный projectPath.\r\n`,
    errDir: (cwd: string) =>
      `\r\n${c.red("[ОШИБКА]:")} Неверная или несуществующая директория:\r\n📂 ${cwd}\r\n`,
    pipeline: (m: string, cmd: string, a: string, cwd: string) =>
      `\r\n${c.cyan("[СИСТЕМА]:")} Запуск аудита ${m}...\r\n${c.dim(`$ ${cmd} ${a}`)}\r\n📂 ${c.dim(`cwd: ${cwd}`)}\r\n---\r\n`,
    spawnErr: (err: string) =>
      `\r\n${c.red("[ОШИБКА]:")} Ошибка запуска процесса:\r\n${err}\r\n`,
    timeoutErr: (ms: number) =>
      `\r\n${c.red("[ОШИБКА ТАЙМ-АУТА]:")} Процесс принудительно прерван. Нет ответа через ${ms / 1000} секунд.\r\n`,
    done: (code: number) =>
      `\r\n${c.green("✅ Операция завершена")} (код ${code})\r\n`,
    before: (size: number) => c.dim(`ДО: ${size} байт`),
    beforeNotFound: (f: string) => c.dim(`ДО: ${f} не найден`),
    after: (size: number) => c.dim(`ПОСЛЕ: ${size} байт`),
    afterNotFound: (f: string) => c.dim(`ПОСЛЕ: ${f} не найден`),
    gitDiff: (add: number, rem: number, f: string) =>
      c.dim(`GIT: +${add} строк | -${rem} строк (${f})`),
    gitErr: c.dim("GIT: ошибка чтения diff."),
    gitNotRepo: c.dim("GIT: не является git репозиторием."),
    resUpdate: (f: string) => c.cyan(`📌 Результат: ${f} обновлено.`),
    resNoChange: (f: string) => c.dim(`📌 Результат: без изменений в ${f}.`),
    secAlert: (blocked: string) =>
      `\r\n\x1b[1;31m[ПРЕДУПРЕЖДЕНИЕ БЕЗОПАСНОСТИ]:\x1b[0m Выполнение прервано. Запрещенные символы: ${blocked}\r\n`,
    cloneInvalidUrl: `\r\n\x1b[1;31m[ОШИБКА]: Неверный URL.\x1b[0m\r\n`,
    cloneSysInit: `\r\n\x1b[1;36m[СИСТЕМА]: Инициализация Sparse Checkout...\x1b[0m\r\n`,
    cloneSshMsg: `> \x1b[33m[SSH Аутентификация Включена]...\x1b[0m\r\n`,
    cloneMetaMsg: `> Загрузка метаданных...\r\n`,
    cloneExtractMsg: `> Извлечение манифестов...\r\n`,
    cloneSuccess: `\r\n\x1b[1;32m✅ Рабочая область успешно изолирована.\x1b[0m\r\n`,
    cloneError: (err: string) =>
      `\r\n\x1b[1;31m[ОШИБКА КЛОНИРОВАНИЯ]:\x1b[0m ${err}\r\n`,
    cloneTimeoutErr: "Операция отменена (Превышено время ожидания).",
    offlineWarn: `\r\n\x1b[33m[ОФФЛАЙН РЕЖИМ]:\x1b[0m Сеть недоступна. Пропуск сканирования CVE и Тех. долга.\r\n`,
    offlineSast: `\x1b[35m[СИСТЕМА]: Выполнение только локального SAST сканирования...\x1b[0m\r\n`,
    trayOpenPanel: "Открыть Тактическую Панель",
    trayCloseEngine: "Выключить Движок (SOC)",
    trayTooltip: "Sentinel Forge - Активный мониторинг SOC",
    trayDocs: "Документация",
    trayCheckUpdates: "Проверить Обновления",
  },
  zh: {
    dialogTitle: "选择项目根文件夹",
    sshKeyDialog: "选择 SSH 私钥",
    saveReportDialog: "保存战术报告 - Sentinel Forge",
    sbomMissingPackage: "在此存储库中未找到 package.json。",
    watcherAlertTitle: "🚨 Sentinel Forge EDR",
    watcherAlertBody: (proj: string, cNum: number, hNum: number) =>
      `在项目 [${proj}] 中引入了严重威胁！\n检测到 ${cNum} 个严重和 ${hNum} 个高危漏洞。`,
    errPath: `\r\n${c.red("[错误]:")} 无效的 projectPath。\r\n`,
    errDir: (cwd: string) =>
      `\r\n${c.red("[错误]:")} 无效或不存在的目录:\r\n📂 ${cwd}\r\n`,
    pipeline: (m: string, cmd: string, a: string, cwd: string) =>
      `\r\n${c.cyan("[系统]:")} 正在运行 ${m} 审计...\r\n${c.dim(`$ ${cmd} ${a}`)}\r\n📂 ${c.dim(`cwd: ${cwd}`)}\r\n---\r\n`,
    spawnErr: (err: string) =>
      `\r\n${c.red("[错误]:")} 启动进程失败:\r\n${err}\r\n`,
    timeoutErr: (ms: number) =>
      `\r\n${c.red("[超时错误]:")} 进程被强制中止。${ms / 1000} 秒后无响应。\r\n`,
    done: (code: number) => `\r\n${c.green("✅ 操作完成")} (代码 ${code})\r\n`,
    before: (size: number) => c.dim(`之前: ${size} 字节`),
    beforeNotFound: (f: string) => c.dim(`之前: ${f} 未找到`),
    after: (size: number) => c.dim(`之后: ${size} 字节`),
    afterNotFound: (f: string) => c.dim(`之后: ${f} 未找到`),
    gitDiff: (add: number, rem: number, f: string) =>
      c.dim(`GIT: +${add} 行 | -${rem} 行 (${f})`),
    gitErr: c.dim("GIT: 读取 diff 错误。"),
    gitNotRepo: c.dim("GIT: 不是 git 存储库。"),
    resUpdate: (f: string) => c.cyan(`📌 结果: ${f} 已更新。`),
    resNoChange: (f: string) => c.dim(`📌 结果: ${f} 没有变化。`),
    secAlert: (blocked: string) =>
      `\r\n\x1b[1;31m[安全警报]:\x1b[0m 执行中止。不允许的字符: ${blocked}\r\n`,
    cloneInvalidUrl: `\r\n\x1b[1;31m[错误]: 无效的 URL。\x1b[0m\r\n`,
    cloneSysInit: `\r\n\x1b[1;36m[系统]: 正在初始化 Sparse Checkout 操作...\x1b[0m\r\n`,
    cloneSshMsg: `> \x1b[33m[已启用 SSH 认证]...\x1b[0m\r\n`,
    cloneMetaMsg: `> 正在下载元数据...\r\n`,
    cloneExtractMsg: `> 正在提取清单...\r\n`,
    cloneSuccess: `\r\n\x1b[1;32m✅ 工作区隔离成功。\x1b[0m\r\n`,
    cloneError: (err: string) => `\r\n\x1b[1;31m[克隆错误]:\x1b[0m ${err}\r\n`,
    cloneTimeoutErr: "操作已取消 (超时)。",
    offlineWarn: `\r\n\x1b[33m[离线模式]:\x1b[0m 网络不可达。跳过 CVE 和技术债务扫描。\r\n`,
    offlineSast: `\x1b[35m[系统]: 仅执行本地 SAST (机密) 扫描...\x1b[0m\r\n`,
    trayOpenPanel: "打开战术面板",
    trayCloseEngine: "关闭引擎 (SOC)",
    trayTooltip: "Sentinel Forge - 活跃的 SOC 监控",
    trayDocs: "官方文档",
    trayCheckUpdates: "检查更新",
  },
};

export const getMessages = (lang: string = "en") =>
  dictionaries[lang] || dictionaries["en"];

export const getTrayMessages = (lang: string = "en") => {
  const t = dictionaries[lang] || dictionaries["en"];
  return {
    openPanel: t.trayOpenPanel,
    closeEngine: t.trayCloseEngine,
    tooltip: t.trayTooltip,
    docs: t.trayDocs,
    checkUpdates: t.trayCheckUpdates,
  };
};

export function getYarnMajorVersion(cwd: string): number {
  try {
    const out = execSync("yarn --version", {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return parseInt(out.split(".")[0], 10);
  } catch {
    return 1;
  }
}
