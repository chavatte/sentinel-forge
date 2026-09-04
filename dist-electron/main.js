import { createRequire as e } from "node:module";
import { BrowserWindow as t, Menu as n, Notification as r, Tray as i, app as a, dialog as o, ipcMain as s, nativeImage as c, session as l, shell as u } from "electron";
import { fileURLToPath as d } from "node:url";
import * as f from "node:path";
import p, { join as m, resolve as h, sep as g } from "node:path";
import _, { promises as v, stat as y, unwatchFile as b, watch as x, watchFile as S } from "node:fs";
import C, { type as w } from "node:os";
import T from "node:dns/promises";
import { execFile as E, execSync as D, spawn as O } from "node:child_process";
import k, { lstat as A, open as ee, readdir as j, realpath as M, stat as N } from "node:fs/promises";
import P, { promisify as F } from "node:util";
import I from "node:crypto";
import { EventEmitter as te } from "node:events";
import { Readable as ne } from "node:stream";
//#region \0rolldown/runtime.js
var L = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), R = /* @__PURE__ */ e(import.meta.url);
//#endregion
//#region electron/utils.ts
async function z() {
	try {
		return await T.lookup("registry.npmjs.org"), !0;
	} catch {
		return !1;
	}
}
var B = {
	cyan: (e) => `\x1b[1;36m${e}\x1b[0m`,
	red: (e) => `\x1b[1;31m${e}\x1b[0m`,
	green: (e) => `\x1b[1;32m${e}\x1b[0m`,
	dim: (e) => `\x1b[2m${e}\x1b[0m`
}, V = {
	en: {
		dialogTitle: "Select the project root folder",
		sshKeyDialog: "Select SSH Private Key",
		saveReportDialog: "Save Tactical Report - Sentinel Forge",
		sbomMissingPackage: "package.json not found in this repository.",
		watcherAlertTitle: "🚨 Sentinel Forge EDR",
		watcherAlertBody: (e, t, n) => `Critical Threat introduced in project [${e}]!\nDetected ${t} critical and ${n} high vulnerabilities.`,
		errPath: `\r\n${B.red("[ERROR]:")} Invalid projectPath.\r\n`,
		errDir: (e) => `\r\n${B.red("[ERROR]:")} Invalid or nonexistent directory:\r\n📂 ${e}\r\n`,
		pipeline: (e, t, n, r) => `\r\n${B.cyan("[SYSTEM]:")} Running ${e} audit...\r\n${B.dim(`$ ${t} ${n}`)}\r\n📂 ${B.dim(`cwd: ${r}`)}\r\n---\r\n`,
		spawnErr: (e) => `\r\n${B.red("[ERROR]:")} Failed to start process:\r\n${e}\r\n`,
		timeoutErr: (e) => `\r\n${B.red("[TIMEOUT ERROR]:")} Process forcibly aborted. No response after ${e / 1e3} seconds.\r\n`,
		done: (e) => `\r\n${B.green("✅ Operation completed")} (code ${e})\r\n`,
		before: (e) => B.dim(`BEFORE: ${e} bytes`),
		beforeNotFound: (e) => B.dim(`BEFORE: ${e} not found`),
		after: (e) => B.dim(`AFTER: ${e} bytes`),
		afterNotFound: (e) => B.dim(`AFTER: ${e} not found`),
		gitDiff: (e, t, n) => B.dim(`GIT: +${e} lines | -${t} lines (${n})`),
		gitErr: B.dim("GIT: error reading diff."),
		gitNotRepo: B.dim("GIT: not a git repository."),
		resUpdate: (e) => B.cyan(`📌 Result: ${e} updated.`),
		resNoChange: (e) => B.dim(`📌 Result: no changes in ${e}.`),
		secAlert: (e) => `\r\n\x1b[1;31m[SECURITY ALERT]:\x1b[0m Execution aborted. Disallowed characters: ${e}\r\n`,
		cloneInvalidUrl: "\r\n\x1B[1;31m[ERROR]: Invalid URL.\x1B[0m\r\n",
		cloneSysInit: "\r\n\x1B[1;36m[SYSTEM]: Initializing Sparse Checkout operation...\x1B[0m\r\n",
		cloneSshMsg: "> \x1B[33m[SSH Authentication Enabled]...\x1B[0m\r\n",
		cloneMetaMsg: "> Downloading metadata...\r\n",
		cloneExtractMsg: "> Extracting manifests...\r\n",
		cloneSuccess: "\r\n\x1B[1;32m✅ Workspace isolated successfully.\x1B[0m\r\n",
		cloneError: (e) => `\r\n\x1b[1;31m[CLONING ERROR]:\x1b[0m ${e}\r\n`,
		cloneTimeoutErr: "Operation cancelled (Timeout Exceeded).",
		offlineWarn: "\r\n\x1B[33m[OFFLINE MODE]:\x1B[0m Network unreachable. Bypassing CVE and Tech Debt scans.\r\n",
		offlineSast: "\x1B[35m[SYSTEM]: Executing local SAST (Secrets Scan) only...\x1B[0m\r\n",
		trayOpenPanel: "Open Tactical Panel",
		trayCloseEngine: "Shutdown Engine (SOC)",
		trayTooltip: "Sentinel Forge - Active SOC Monitoring",
		trayDocs: "Documentation",
		trayCheckUpdates: "Check for Updates"
	},
	pt: {
		dialogTitle: "Selecione a pasta raiz do projeto",
		sshKeyDialog: "Selecione a Chave Privada SSH",
		saveReportDialog: "Guardar Relatório Tático - Sentinel Forge",
		sbomMissingPackage: "package.json não encontrado neste repositório.",
		watcherAlertTitle: "🚨 Sentinel Forge EDR",
		watcherAlertBody: (e, t, n) => `Ameaça Crítica introduzida no projeto [${e}]!\nForam detetados ${t} críticos e ${n} altos.`,
		errPath: `\r\n${B.red("[ERRO]:")} projectPath inválido.\r\n`,
		errDir: (e) => `\r\n${B.red("[ERRO]:")} Diretório inválido ou inexistente:\r\n📂 ${e}\r\n`,
		pipeline: (e, t, n, r) => `\r\n${B.cyan("[SISTEMA]:")} Executando auditoria ${e}...\r\n${B.dim(`$ ${t} ${n}`)}\r\n📂 ${B.dim(`cwd: ${r}`)}\r\n---\r\n`,
		spawnErr: (e) => `\r\n${B.red("[ERRO]:")} Falha ao iniciar processo:\r\n${e}\r\n`,
		timeoutErr: (e) => `\r\n${B.red("[ERRO DE TIMEOUT]:")} Processo abortado à força. Sem resposta após ${e / 1e3} segundos.\r\n`,
		done: (e) => `\r\n${B.green("✅ Operação concluída")} (código ${e})\r\n`,
		before: (e) => B.dim(`ANTES: ${e} bytes`),
		beforeNotFound: (e) => B.dim(`ANTES: ${e} não encontrado`),
		after: (e) => B.dim(`DEPOIS: ${e} bytes`),
		afterNotFound: (e) => B.dim(`DEPOIS: ${e} não encontrado`),
		gitDiff: (e, t, n) => B.dim(`GIT: +${e} linhas | -${t} linhas (${n})`),
		gitErr: B.dim("GIT: erro ao ler diff."),
		gitNotRepo: B.dim("GIT: não é um repositório git."),
		resUpdate: (e) => B.cyan(`📌 Resultado: ${e} atualizado.`),
		resNoChange: (e) => B.dim(`📌 Resultado: nenhuma alteração em ${e}.`),
		secAlert: (e) => `\r\n\x1b[1;31m[ALERTA DE SEGURANÇA]:\x1b[0m Execução abortada. Caracteres não permitidos: ${e}\r\n`,
		cloneInvalidUrl: "\r\n\x1B[1;31m[ERRO]: URL inválida.\x1B[0m\r\n",
		cloneSysInit: "\r\n\x1B[1;36m[SISTEMA]: Inicializando operação Sparse Checkout...\x1B[0m\r\n",
		cloneSshMsg: "> \x1B[33m[Autenticação SSH Ativada]...\x1B[0m\r\n",
		cloneMetaMsg: "> Baixando metadados...\r\n",
		cloneExtractMsg: "> Extraindo manifestos...\r\n",
		cloneSuccess: "\r\n\x1B[1;32m✅ Workspace isolado com sucesso.\x1B[0m\r\n",
		cloneError: (e) => `\r\n\x1b[1;31m[ERRO DE CLONAGEM]:\x1b[0m ${e}\r\n`,
		cloneTimeoutErr: "Operação cancelada (Timeout Excedido).",
		offlineWarn: "\r\n\x1B[33m[MODO OFFLINE]:\x1B[0m Rede inacessível. Ignorando auditoria de CVEs e Dívida Técnica.\r\n",
		offlineSast: "\x1B[35m[SISTEMA]: Executando apenas o scan SAST local (Segredos)...\x1B[0m\r\n",
		trayOpenPanel: "Abrir Painel Tático",
		trayCloseEngine: "Encerrar Motor (SOC)",
		trayTooltip: "Sentinel Forge - Monitorização SOC Ativa",
		trayDocs: "Documentação",
		trayCheckUpdates: "Procurar Atualizações"
	},
	es: {
		dialogTitle: "Seleccione la carpeta raíz del proyecto",
		sshKeyDialog: "Seleccione la Clave Privada SSH",
		saveReportDialog: "Guardar Reporte Táctico - Sentinel Forge",
		sbomMissingPackage: "package.json no encontrado en este repositorio.",
		watcherAlertTitle: "🚨 Sentinel Forge EDR",
		watcherAlertBody: (e, t, n) => `¡Amenaza Crítica introducida en el proyecto [${e}]!\nSe detectaron ${t} críticas y ${n} altas.`,
		errPath: `\r\n${B.red("[ERROR]:")} projectPath inválido.\r\n`,
		errDir: (e) => `\r\n${B.red("[ERROR]:")} Directorio inválido o inexistente:\r\n📂 ${e}\r\n`,
		pipeline: (e, t, n, r) => `\r\n${B.cyan("[SISTEMA]:")} Ejecutando auditoría ${e}...\r\n${B.dim(`$ ${t} ${n}`)}\r\n📂 ${B.dim(`cwd: ${r}`)}\r\n---\r\n`,
		spawnErr: (e) => `\r\n${B.red("[ERROR]:")} Error al iniciar proceso:\r\n${e}\r\n`,
		timeoutErr: (e) => `\r\n${B.red("[ERROR DE TIMEOUT]:")} Proceso abortado forzosamente. Sin respuesta después de ${e / 1e3} segundos.\r\n`,
		done: (e) => `\r\n${B.green("✅ Operación completada")} (código ${e})\r\n`,
		before: (e) => B.dim(`ANTES: ${e} bytes`),
		beforeNotFound: (e) => B.dim(`ANTES: ${e} no encontrado`),
		after: (e) => B.dim(`DESPUÉS: ${e} bytes`),
		afterNotFound: (e) => B.dim(`DESPUÉS: ${e} no encontrado`),
		gitDiff: (e, t, n) => B.dim(`GIT: +${e} líneas | -${t} líneas (${n})`),
		gitErr: B.dim("GIT: error al leer diff."),
		gitNotRepo: B.dim("GIT: no es un repositorio git."),
		resUpdate: (e) => B.cyan(`📌 Resultado: ${e} actualizado.`),
		resNoChange: (e) => B.dim(`📌 Resultado: sin cambios en ${e}.`),
		secAlert: (e) => `\r\n\x1b[1;31m[ALERTA DE SEGURIDAD]:\x1b[0m Ejecución abortada. Caracteres no permitidos: ${e}\r\n`,
		cloneInvalidUrl: "\r\n\x1B[1;31m[ERROR]: URL inválida.\x1B[0m\r\n",
		cloneSysInit: "\r\n\x1B[1;36m[SISTEMA]: Inicializando operación Sparse Checkout...\x1B[0m\r\n",
		cloneSshMsg: "> \x1B[33m[Autenticación SSH Activada]...\x1B[0m\r\n",
		cloneMetaMsg: "> Descargando metadatos...\r\n",
		cloneExtractMsg: "> Extrayendo manifiestos...\r\n",
		cloneSuccess: "\r\n\x1B[1;32m✅ Workspace aislado con éxito.\x1B[0m\r\n",
		cloneError: (e) => `\r\n\x1b[1;31m[ERROR DE CLONACIÓN]:\x1b[0m ${e}\r\n`,
		cloneTimeoutErr: "Operación cancelada (Tiempo de espera excedido).",
		offlineWarn: "\r\n\x1B[33m[MODO OFFLINE]:\x1B[0m Red inaccesible. Omitiendo auditoría de CVEs y Deuda Técnica.\r\n",
		offlineSast: "\x1B[35m[SISTEMA]: Ejecutando solo el escaneo SAST local (Secretos)...\x1B[0m\r\n",
		trayOpenPanel: "Abrir Panel Táctico",
		trayCloseEngine: "Apagar Motor (SOC)",
		trayTooltip: "Sentinel Forge - Monitoreo SOC Activo",
		trayDocs: "Documentación",
		trayCheckUpdates: "Buscar Actualizaciones"
	},
	de: {
		dialogTitle: "Wählen Sie den Projektstammordner",
		sshKeyDialog: "Wählen Sie den privaten SSH-Schlüssel",
		saveReportDialog: "Taktischen Bericht speichern - Sentinel Forge",
		sbomMissingPackage: "package.json in diesem Repository nicht gefunden.",
		watcherAlertTitle: "🚨 Sentinel Forge EDR",
		watcherAlertBody: (e, t, n) => `Kritische Bedrohung in Projekt [${e}] eingeführt!\n${t} kritische und ${n} hohe Schwachstellen erkannt.`,
		errPath: `\r\n${B.red("[FEHLER]:")} Ungültiger projectPath.\r\n`,
		errDir: (e) => `\r\n${B.red("[FEHLER]:")} Ungültiges oder nicht existierendes Verzeichnis:\r\n📂 ${e}\r\n`,
		pipeline: (e, t, n, r) => `\r\n${B.cyan("[SYSTEM]:")} Führe ${e} Audit aus...\r\n${B.dim(`$ ${t} ${n}`)}\r\n📂 ${B.dim(`cwd: ${r}`)}\r\n---\r\n`,
		spawnErr: (e) => `\r\n${B.red("[FEHLER]:")} Prozess konnte nicht gestartet werden:\r\n${e}\r\n`,
		timeoutErr: (e) => `\r\n${B.red("[ZEITÜBERSCHREITUNG]:")} Prozess zwangsweise abgebrochen. Keine Antwort nach ${e / 1e3} Sekunden.\r\n`,
		done: (e) => `\r\n${B.green("✅ Vorgang abgeschlossen")} (Code ${e})\r\n`,
		before: (e) => B.dim(`VORHER: ${e} Bytes`),
		beforeNotFound: (e) => B.dim(`VORHER: ${e} nicht gefunden`),
		after: (e) => B.dim(`NACHHER: ${e} Bytes`),
		afterNotFound: (e) => B.dim(`NACHHER: ${e} nicht gefunden`),
		gitDiff: (e, t, n) => B.dim(`GIT: +${e} Zeilen | -${t} Zeilen (${n})`),
		gitErr: B.dim("GIT: Fehler beim Lesen des Diffs."),
		gitNotRepo: B.dim("GIT: Kein Git-Repository."),
		resUpdate: (e) => B.cyan(`📌 Ergebnis: ${e} aktualisiert.`),
		resNoChange: (e) => B.dim(`📌 Ergebnis: keine Änderungen in ${e}.`),
		secAlert: (e) => `\r\n\x1b[1;31m[SICHERHEITSWARNUNG]:\x1b[0m Ausführung abgebrochen. Unzulässige Zeichen: ${e}\r\n`,
		cloneInvalidUrl: "\r\n\x1B[1;31m[FEHLER]: Ungültige URL.\x1B[0m\r\n",
		cloneSysInit: "\r\n\x1B[1;36m[SYSTEM]: Initialisiere Sparse Checkout...\x1B[0m\r\n",
		cloneSshMsg: "> \x1B[33m[SSH-Authentifizierung Aktiviert]...\x1B[0m\r\n",
		cloneMetaMsg: "> Lade Metadaten herunter...\r\n",
		cloneExtractMsg: "> Extrahiere Manifeste...\r\n",
		cloneSuccess: "\r\n\x1B[1;32m✅ Workspace erfolgreich isoliert.\x1B[0m\r\n",
		cloneError: (e) => `\r\n\x1b[1;31m[KLONFEHLER]:\x1b[0m ${e}\r\n`,
		cloneTimeoutErr: "Vorgang abgebrochen (Zeitüberschreitung).",
		offlineWarn: "\r\n\x1B[33m[OFFLINE-MODUS]:\x1B[0m Netzwerk nicht erreichbar. CVE- und Tech-Debt-Scans übersprungen.\r\n",
		offlineSast: "\x1B[35m[SYSTEM]: Führe nur lokalen SAST-Scan aus...\x1B[0m\r\n",
		trayOpenPanel: "Taktisches Panel Öffnen",
		trayCloseEngine: "Engine Herunterfahren (SOC)",
		trayTooltip: "Sentinel Forge - Aktive SOC-Überwachung",
		trayDocs: "Dokumentation",
		trayCheckUpdates: "Nach Updates Suchen"
	},
	ru: {
		dialogTitle: "Выберите корневую папку проекта",
		sshKeyDialog: "Выберите приватный SSH-ключ",
		saveReportDialog: "Сохранить Тактический Отчет - Sentinel Forge",
		sbomMissingPackage: "package.json не найден в этом репозитории.",
		watcherAlertTitle: "🚨 Sentinel Forge EDR",
		watcherAlertBody: (e, t, n) => `Критическая Угроза внедрена в проект [${e}]!\nОбнаружено ${t} критических и ${n} высоких уязвимостей.`,
		errPath: `\r\n${B.red("[ОШИБКА]:")} Неверный projectPath.\r\n`,
		errDir: (e) => `\r\n${B.red("[ОШИБКА]:")} Неверная или несуществующая директория:\r\n📂 ${e}\r\n`,
		pipeline: (e, t, n, r) => `\r\n${B.cyan("[СИСТЕМА]:")} Запуск аудита ${e}...\r\n${B.dim(`$ ${t} ${n}`)}\r\n📂 ${B.dim(`cwd: ${r}`)}\r\n---\r\n`,
		spawnErr: (e) => `\r\n${B.red("[ОШИБКА]:")} Ошибка запуска процесса:\r\n${e}\r\n`,
		timeoutErr: (e) => `\r\n${B.red("[ОШИБКА ТАЙМ-АУТА]:")} Процесс принудительно прерван. Нет ответа через ${e / 1e3} секунд.\r\n`,
		done: (e) => `\r\n${B.green("✅ Операция завершена")} (код ${e})\r\n`,
		before: (e) => B.dim(`ДО: ${e} байт`),
		beforeNotFound: (e) => B.dim(`ДО: ${e} не найден`),
		after: (e) => B.dim(`ПОСЛЕ: ${e} байт`),
		afterNotFound: (e) => B.dim(`ПОСЛЕ: ${e} не найден`),
		gitDiff: (e, t, n) => B.dim(`GIT: +${e} строк | -${t} строк (${n})`),
		gitErr: B.dim("GIT: ошибка чтения diff."),
		gitNotRepo: B.dim("GIT: не является git репозиторием."),
		resUpdate: (e) => B.cyan(`📌 Результат: ${e} обновлено.`),
		resNoChange: (e) => B.dim(`📌 Результат: без изменений в ${e}.`),
		secAlert: (e) => `\r\n\x1b[1;31m[ПРЕДУПРЕЖДЕНИЕ БЕЗОПАСНОСТИ]:\x1b[0m Выполнение прервано. Запрещенные символы: ${e}\r\n`,
		cloneInvalidUrl: "\r\n\x1B[1;31m[ОШИБКА]: Неверный URL.\x1B[0m\r\n",
		cloneSysInit: "\r\n\x1B[1;36m[СИСТЕМА]: Инициализация Sparse Checkout...\x1B[0m\r\n",
		cloneSshMsg: "> \x1B[33m[SSH Аутентификация Включена]...\x1B[0m\r\n",
		cloneMetaMsg: "> Загрузка метаданных...\r\n",
		cloneExtractMsg: "> Извлечение манифестов...\r\n",
		cloneSuccess: "\r\n\x1B[1;32m✅ Рабочая область успешно изолирована.\x1B[0m\r\n",
		cloneError: (e) => `\r\n\x1b[1;31m[ОШИБКА КЛОНИРОВАНИЯ]:\x1b[0m ${e}\r\n`,
		cloneTimeoutErr: "Операция отменена (Превышено время ожидания).",
		offlineWarn: "\r\n\x1B[33m[ОФФЛАЙН РЕЖИМ]:\x1B[0m Сеть недоступна. Пропуск сканирования CVE и Тех. долга.\r\n",
		offlineSast: "\x1B[35m[СИСТЕМА]: Выполнение только локального SAST сканирования...\x1B[0m\r\n",
		trayOpenPanel: "Открыть Тактическую Панель",
		trayCloseEngine: "Выключить Движок (SOC)",
		trayTooltip: "Sentinel Forge - Активный мониторинг SOC",
		trayDocs: "Документация",
		trayCheckUpdates: "Проверить Обновления"
	},
	zh: {
		dialogTitle: "选择项目根文件夹",
		sshKeyDialog: "选择 SSH 私钥",
		saveReportDialog: "保存战术报告 - Sentinel Forge",
		sbomMissingPackage: "在此存储库中未找到 package.json。",
		watcherAlertTitle: "🚨 Sentinel Forge EDR",
		watcherAlertBody: (e, t, n) => `在项目 [${e}] 中引入了严重威胁！\n检测到 ${t} 个严重和 ${n} 个高危漏洞。`,
		errPath: `\r\n${B.red("[错误]:")} 无效的 projectPath。\r\n`,
		errDir: (e) => `\r\n${B.red("[错误]:")} 无效或不存在的目录:\r\n📂 ${e}\r\n`,
		pipeline: (e, t, n, r) => `\r\n${B.cyan("[系统]:")} 正在运行 ${e} 审计...\r\n${B.dim(`$ ${t} ${n}`)}\r\n📂 ${B.dim(`cwd: ${r}`)}\r\n---\r\n`,
		spawnErr: (e) => `\r\n${B.red("[错误]:")} 启动进程失败:\r\n${e}\r\n`,
		timeoutErr: (e) => `\r\n${B.red("[超时错误]:")} 进程被强制中止。${e / 1e3} 秒后无响应。\r\n`,
		done: (e) => `\r\n${B.green("✅ 操作完成")} (代码 ${e})\r\n`,
		before: (e) => B.dim(`之前: ${e} 字节`),
		beforeNotFound: (e) => B.dim(`之前: ${e} 未找到`),
		after: (e) => B.dim(`之后: ${e} 字节`),
		afterNotFound: (e) => B.dim(`之后: ${e} 未找到`),
		gitDiff: (e, t, n) => B.dim(`GIT: +${e} 行 | -${t} 行 (${n})`),
		gitErr: B.dim("GIT: 读取 diff 错误。"),
		gitNotRepo: B.dim("GIT: 不是 git 存储库。"),
		resUpdate: (e) => B.cyan(`📌 结果: ${e} 已更新。`),
		resNoChange: (e) => B.dim(`📌 结果: ${e} 没有变化。`),
		secAlert: (e) => `\r\n\x1b[1;31m[安全警报]:\x1b[0m 执行中止。不允许的字符: ${e}\r\n`,
		cloneInvalidUrl: "\r\n\x1B[1;31m[错误]: 无效的 URL。\x1B[0m\r\n",
		cloneSysInit: "\r\n\x1B[1;36m[系统]: 正在初始化 Sparse Checkout 操作...\x1B[0m\r\n",
		cloneSshMsg: "> \x1B[33m[已启用 SSH 认证]...\x1B[0m\r\n",
		cloneMetaMsg: "> 正在下载元数据...\r\n",
		cloneExtractMsg: "> 正在提取清单...\r\n",
		cloneSuccess: "\r\n\x1B[1;32m✅ 工作区隔离成功。\x1B[0m\r\n",
		cloneError: (e) => `\r\n\x1b[1;31m[克隆错误]:\x1b[0m ${e}\r\n`,
		cloneTimeoutErr: "操作已取消 (超时)。",
		offlineWarn: "\r\n\x1B[33m[离线模式]:\x1B[0m 网络不可达。跳过 CVE 和技术债务扫描。\r\n",
		offlineSast: "\x1B[35m[系统]: 仅执行本地 SAST (机密) 扫描...\x1B[0m\r\n",
		trayOpenPanel: "打开战术面板",
		trayCloseEngine: "关闭引擎 (SOC)",
		trayTooltip: "Sentinel Forge - 活跃的 SOC 监控",
		trayDocs: "官方文档",
		trayCheckUpdates: "检查更新"
	}
}, H = (e = "en") => V[e] || V.en, re = (e = "en") => {
	let t = V[e] || V.en;
	return {
		openPanel: t.trayOpenPanel,
		closeEngine: t.trayCloseEngine,
		tooltip: t.trayTooltip,
		docs: t.trayDocs,
		checkUpdates: t.trayCheckUpdates
	};
};
function U(e) {
	try {
		let t = D("yarn --version", {
			cwd: e,
			encoding: "utf8",
			stdio: [
				"ignore",
				"pipe",
				"ignore"
			]
		});
		return parseInt(t.split(".")[0], 10);
	} catch {
		return 1;
	}
}
var W = new class {
	logFilePath = "";
	init() {
		this.logFilePath = p.join(a.getPath("userData"), "sentinel.log"), this.info("=== Sentinel Forge Engine Initialized ===");
	}
	async write(e, t) {
		if (!this.logFilePath) return;
		let n = `[${(/* @__PURE__ */ new Date()).toISOString()}] [${e}] ${t}\n`;
		if (e === "ERROR" ? console.error(n.trim()) : e === "WARN" ? console.warn(n.trim()) : e === "DEBUG" ? console.debug(n.trim()) : console.log(n.trim()), !(e === "DEBUG" && a.isPackaged)) try {
			await v.appendFile(this.logFilePath, n, "utf8");
		} catch (e) {
			console.error("Critical failure writing to log file:", e);
		}
	}
	info(e) {
		this.write("INFO", e);
	}
	warn(e) {
		this.write("WARN", e);
	}
	error(e, t) {
		let n = t ? ` | Details: ${t.message || t}` : "";
		this.write("ERROR", e + n);
	}
	debug(e) {
		this.write("DEBUG", e);
	}
	getPath() {
		return this.logFilePath;
	}
}();
//#endregion
//#region electron/ipc/system.ts
function ie(e) {
	let t = e, n = 0;
	for (; n < 10;) {
		if (_.existsSync(p.join(t, "bun.lockb"))) return "bun";
		if (_.existsSync(p.join(t, "pnpm-lock.yaml"))) return "pnpm";
		if (_.existsSync(p.join(t, "yarn.lock"))) return "yarn";
		if (_.existsSync(p.join(t, "package-lock.json"))) return "npm";
		let e = p.dirname(t);
		if (e === t) break;
		t = e, n++;
	}
	return "npm";
}
function ae(e) {
	s.handle("select-folder", async (e, t = "en") => {
		let n = H(t), { canceled: r, filePaths: i } = await o.showOpenDialog({
			title: n.dialogTitle,
			properties: ["openDirectory"]
		});
		if (r || i.length === 0) return null;
		let a = i[0], s = ie(a);
		return W.info(`Project selected: ${a} | Package Manager detected: ${s}`), {
			path: a,
			defaultManager: s
		};
	}), s.handle("select-file", async (e, t = "en") => {
		let n = H(t), { canceled: r, filePaths: i } = await o.showOpenDialog({
			title: n.sshKeyDialog,
			properties: ["openFile"]
		});
		return r || i.length === 0 ? null : i[0];
	}), s.on("show-notification", (t, { title: n, body: i }) => {
		if (r.isSupported()) {
			let t = process.platform === "win32" ? "ico" : "png", o = a.isPackaged ? p.join(process.resourcesPath, "public", `sentinel.${t}`) : p.join(process.env.APP_ROOT || process.cwd(), "public", `sentinel.${t}`), s = new r({
				title: n,
				body: i,
				icon: c.createFromPath(o),
				urgency: "critical"
			});
			s.on("click", () => {
				e && (e.isVisible() || e.show(), e.isMinimized() && e.restore(), e.focus());
			}), s.show();
		}
	}), s.on("window-minimize", () => {
		e && e.minimize();
	}), s.on("window-maximize", () => {
		e && (e.isMaximized() ? e.unmaximize() : e.maximize());
	}), s.on("window-close", () => {
		e && e.close();
	}), s.handle("export-report", async (e, { content: n, format: r, defaultName: i, lang: a = "en" }) => {
		let s = H(a);
		try {
			let e = r === "pdf" ? [{
				name: "PDF Document",
				extensions: ["pdf"]
			}] : r === "html" ? [{
				name: "HTML Web Page",
				extensions: ["html"]
			}] : [{
				name: "JSON Data",
				extensions: ["json"]
			}], { canceled: a, filePath: c } = await o.showSaveDialog({
				title: s.saveReportDialog,
				defaultPath: i,
				filters: e
			});
			if (a || !c) return {
				success: !1,
				canceled: !0
			};
			if (r === "json" || r === "html") return await _.promises.writeFile(c, n, "utf8"), {
				success: !0,
				filePath: c
			};
			if (r === "pdf") {
				let e = new t({
					show: !1,
					webPreferences: {
						offscreen: !0,
						nodeIntegration: !1,
						contextIsolation: !0,
						sandbox: !0,
						javascript: !1
					}
				}), r = p.join(C.tmpdir(), `sentinel-report-${Date.now()}.html`);
				await _.promises.writeFile(r, n, "utf8"), await e.loadFile(r);
				let i = await e.webContents.printToPDF({
					printBackground: !0,
					pageSize: "A4",
					margins: {
						top: .4,
						bottom: .4,
						left: .4,
						right: .4
					}
				});
				return await _.promises.writeFile(c, i), e.close(), _.promises.unlink(r).catch((e) => {
					W.error(`Failed to clean up temporary PDF file: ${e.message}`);
				}), {
					success: !0,
					filePath: c
				};
			}
		} catch (e) {
			return W.error(`Error exporting report: ${e.message}`), {
				success: !1,
				error: e.message
			};
		}
	});
}
//#endregion
//#region electron/ipc/gitBlame.ts
var oe = P.promisify(E);
async function se(e, t) {
	let n = p.join(e, "package.json");
	try {
		await k.access(n);
	} catch {
		return t;
	}
	try {
		await oe("git", ["status"], {
			cwd: e,
			windowsHide: !0
		});
		let { stdout: n } = await oe("git", [
			"blame",
			"package.json",
			"--date=short"
		], {
			cwd: e,
			windowsHide: !0
		}), r = n.split("\n");
		for (let e of Object.keys(t)) {
			let n = t[e], i = n.isDirect ? e : n.effects?.[0] || e, a = RegExp(`"\\s*${i}\\s*"\\s*:`), o = r.find((e) => a.test(e));
			if (o) {
				let e = o.match(/\((.*?)\s+(\d{4}-\d{2}-\d{2})/);
				e && (n.introducedBy = `${e[1].trim()} (${e[2]})`);
			}
		}
	} catch {
		W.debug(`[Sentinel Forge] Git Blame skipped for ${p.basename(e)}: No repository history or read error.`);
	}
	return t;
}
//#endregion
//#region electron/ipc/sast.ts
var ce = /* @__PURE__ */ new Set([
	"node_modules",
	".git",
	"dist",
	"build",
	".next",
	"out",
	"coverage",
	".vscode",
	".idea"
]), le = /* @__PURE__ */ new Set([
	".svg",
	".png",
	".jpg",
	".jpeg",
	".ico",
	".pdf",
	".zip",
	".exe",
	".mp3",
	".mp4",
	".ttf",
	".woff",
	".woff2",
	".eot",
	".bin",
	".dll",
	".so",
	".dylib",
	".lock",
	".asar"
]), ue = [
	{
		name: "AWS Access Key",
		regex: /(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/
	},
	{
		name: "GitHub Token",
		regex: /(gh[pousr]_[A-Za-z0-9_]{36,255})/
	},
	{
		name: "Private Key (SSH/RSA/PGP)",
		regex: /-----BEGIN (RSA|OPENSSH|DSA|EC|PGP) PRIVATE KEY-----/
	},
	{
		name: "Google Cloud API Key",
		regex: /AIza[0-9A-Za-z\-_]{35}/
	},
	{
		name: "Stripe Secret Key",
		regex: /sk_live_[0-9a-zA-Z]{24}/
	}
];
async function de(e, t = []) {
	let n = [], r = t.reduce((e, t) => {
		try {
			e.push({
				name: `[CUSTOM] ${t.name}`,
				regex: new RegExp(t.regex)
			});
		} catch {
			W.warn(`[SAST] Invalid custom regex ignored: ${t.name}`);
		}
		return e;
	}, []), i = [...ue, ...r];
	async function a(t) {
		try {
			let r = await k.readdir(t, { withFileTypes: !0 });
			for (let o of r) {
				let r = p.join(t, o.name);
				if (o.isDirectory()) {
					if (ce.has(o.name)) continue;
					await a(r);
				} else if (o.isFile()) {
					let t = p.extname(o.name).toLowerCase();
					if (le.has(t) || (await k.stat(r)).size > 2097152) continue;
					(await k.readFile(r, "utf-8")).split("\n").forEach((t, a) => {
						for (let o of i) {
							let i = t.match(o.regex);
							i && n.push({
								file: p.relative(e, r),
								line: a + 1,
								type: o.name,
								match: i[0].substring(0, 4) + "********" + i[0].substring(i[0].length - 4)
							});
						}
					});
				}
			}
		} catch (e) {
			W.debug(`[SAST] Skipped unreadable path: ${t} - ${e.message}`);
		}
	}
	try {
		await a(e);
	} catch (e) {
		W.error("[SAST] Error during static scan:", e);
	}
	return n;
}
//#endregion
//#region electron/ipc/osv.ts
function G(e, t) {
	let n = [];
	for (let r = 0; r < e.length; r += t) n.push(e.slice(r, r + t));
	return n;
}
async function fe(e) {
	let t = /* @__PURE__ */ new Map(), n = (e, n) => {
		if (!e || !n) return;
		let r = n.replace(/^[^\d]+/, "");
		t.has(e) || t.set(e, /* @__PURE__ */ new Set()), t.get(e).add(r);
	};
	try {
		let t = await k.readFile(p.join(e, "package.json"), "utf-8"), r = JSON.parse(t), i = {
			...r.dependencies || {},
			...r.devDependencies || {}
		};
		for (let [e, t] of Object.entries(i)) n(e, t);
	} catch {
		W.debug(`[OSV] No package.json found at ${e}.`);
	}
	let r = () => {
		let e = [];
		for (let [n, r] of t.entries()) for (let t of r) e.push({
			name: n,
			version: t
		});
		return e;
	};
	try {
		let t = await k.readFile(p.join(e, "package-lock.json"), "utf-8"), i = JSON.parse(t);
		if (i.packages) for (let [e, t] of Object.entries(i.packages)) e === "" || !t.version || n(e.replace(/^.*node_modules\//, ""), t.version);
		else if (i.dependencies) for (let [e, t] of Object.entries(i.dependencies)) n(e, t.version);
		return r();
	} catch {}
	try {
		let t = (await k.readFile(p.join(e, "yarn.lock"), "utf-8")).split("\n"), i = "";
		for (let e of t) {
			let t = e.match(/^"?(@?[a-zA-Z0-9\-_\.\/]+)@/);
			if (t) i = t[1];
			else if (i) {
				let t = e.match(/^\s+version:?\s+"?([0-9\.]+[-a-zA-Z0-9\.]*)"?/);
				t ? (n(i, t[1]), i = "") : !e.startsWith(" ") && e.trim() !== "" && (i = "");
			}
		}
		return r();
	} catch {}
	try {
		let t = await k.readFile(p.join(e, "pnpm-lock.yaml"), "utf-8"), i = /^\s+\/?(@?[a-zA-Z0-9\-_\.\/]+)\/([0-9\.]+[-a-zA-Z0-9\.]*):/gm, a;
		for (; (a = i.exec(t)) !== null;) n(a[1], a[2]);
		return r();
	} catch {}
	return r();
}
async function pe(e) {
	try {
		let t = await fe(e);
		if (t.length === 0) return [];
		let n = t.map(({ name: e, version: t }) => ({
			package: {
				name: e,
				ecosystem: "npm"
			},
			version: t
		})), r = G(n, 1e3), i = [];
		W.info(`[OSV] Querying global database for ${n.length} unique packages/versions in ${r.length} batches...`);
		let a = r.map(async (e, t) => {
			let n = await fetch("https://api.osv.dev/v1/querybatch", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ queries: e })
			});
			if (!n.ok) throw Error(`OSV API Chunk ${t} returned status: ${n.status}`);
			let r = await n.json(), i = [];
			return r.results && r.results.forEach((t, n) => {
				t.vulns && t.vulns.length > 0 && i.push({
					name: e[n].package.name,
					version: e[n].version,
					vulnerabilities: t.vulns
				});
			}), i;
		});
		return (await Promise.all(a)).forEach((e) => i.push(...e)), i.length > 0 ? W.warn(`[OSV] Deep scan completed. Found ${i.length} compromised packages!`) : W.info("[OSV] Deep scan completed. No global threats found."), i;
	} catch (e) {
		return W.error(`[OSV] Critical failure during global scan: ${e.message}`), [];
	}
}
//#endregion
//#region electron/ipc/audit.ts
function me(e, t, n, r = 18e4, i) {
	return new Promise((a) => {
		let o = process.platform === "win32", s = O(e, t, {
			cwd: n,
			shell: o,
			windowsHide: !0,
			env: {
				...process.env,
				FORCE_COLOR: "3",
				COLORTERM: "truecolor",
				TERM: "xterm-256color"
			}
		}), c = "", l = "", u = !1, d = setTimeout(() => {
			u = !0, s.kill("SIGKILL");
		}, r), f = (e, t = !1) => {
			let n = e.toString();
			t ? l += n : c += n, i && i(n);
		};
		s.stdout?.on("data", (e) => f(e, !1)), s.stderr?.on("data", (e) => f(e, !0)), s.on("error", (e) => {
			clearTimeout(d), u || a({
				stdout: c,
				stderr: l || e.message,
				code: -1
			});
		}), s.on("close", (e) => {
			clearTimeout(d), a({
				stdout: c,
				stderr: l,
				code: u ? -1 : e,
				timedOut: u
			});
		});
	});
}
function he(e, t, n) {
	let r = Object.create(null), i = {};
	try {
		let e = p.join(n, "package.json");
		if (_.existsSync(e)) {
			let t = _.readFileSync(e, "utf-8"), n = JSON.parse(t);
			i = {
				...n.dependencies || {},
				...n.devDependencies || {}
			};
		}
	} catch {
		W.debug(`Could not read package.json for fallback parsing at ${n}`);
	}
	let a = (e) => e ? e.replace(/^[^\d]+/, "") : "?";
	if (!e || e.trim() === "") return r;
	let o = t === "yarn" && U(n) >= 2;
	try {
		if (o) {
			let t = e.indexOf("{"), n = e.lastIndexOf("}");
			if (t !== -1 && n !== -1) {
				let o = e.substring(t, n + 1), s = JSON.parse(o);
				for (let [e, t] of Object.entries(s)) {
					let n = a(t);
					r[e] = {
						current: a(i[e]),
						wanted: n,
						latest: n
					};
				}
			}
		} else if (t === "yarn") {
			let t = e.split("\n");
			for (let e of t) if (e.includes("\"type\":\"table\"")) {
				let t = JSON.parse(e);
				t?.data?.body && t.data.body.forEach((e) => {
					let t = e[0], n = e[1];
					(!n || n === "exotic" || n === "MISSING" || n.trim() === "") && (n = a(i[t])), r[t] = {
						current: n,
						wanted: e[2] || "?",
						latest: e[3] || "?"
					};
				});
			}
		} else {
			let t = e.indexOf("{"), n = e.lastIndexOf("}");
			if (t !== -1 && n !== -1) {
				let o = e.substring(t, n + 1), s = JSON.parse(o);
				for (let [e, t] of Object.entries(s)) {
					let n = t, o = n.current;
					(!o || o === "?" || o === "MISSING" || o.trim() === "") && (o = a(i[e])), r[e] = {
						current: o || "?",
						wanted: n.wanted || "?",
						latest: n.latest || "?"
					};
				}
			}
		}
	} catch (e) {
		W.warn(`Failed to extract outdated packages: ${e}`);
	}
	return r;
}
function ge(e, t) {
	let n = e.trim();
	if (t === "npm") {
		let e = n.indexOf("{"), t = n.lastIndexOf("}");
		return e !== -1 && t !== -1 && (n = n.substring(e, t + 1)), JSON.parse(n);
	}
	try {
		let e = JSON.parse(n);
		if (e.type === "error") return { error: {
			code: "PACKAGE_MANAGER_FAILURE",
			summary: e.data
		} };
		if (e.advisories && !e.vulnerabilities) {
			e.vulnerabilities = {}, e.metadata = e.metadata || {
				vulnerabilities: {
					info: 0,
					low: 0,
					moderate: 0,
					high: 0,
					critical: 0
				},
				dependencies: { total: 0 }
			};
			for (let t of Object.values(e.advisories)) {
				let n = t.module_name;
				if (!e.vulnerabilities[n]) {
					e.vulnerabilities[n] = {
						name: n,
						title: t.title || "Vulnerabilidade identificada",
						patchedIn: t.patched_versions || null,
						url: t.url || null,
						severity: t.severity || "moderate",
						isDirect: !0,
						fixAvailable: !!t.recommendation,
						via: [t.title || n],
						effects: [],
						sources: []
					};
					let r = (t.severity || "moderate").toLowerCase();
					e.metadata.vulnerabilities[r] !== void 0 && e.metadata.vulnerabilities[r]++;
				}
			}
		}
		return e;
	} catch {
		let e = n.split("\n").filter((e) => e.trim().startsWith("{")), t = {
			vulnerabilities: {},
			metadata: {
				vulnerabilities: {
					info: 0,
					low: 0,
					moderate: 0,
					high: 0,
					critical: 0
				},
				dependencies: { total: 0 }
			}
		}, r = !1, i = "";
		for (let n of e) try {
			let e = JSON.parse(n);
			if (e.type === "error") r = !0, i = e.data;
			else if (e.type === "auditSummary") Object.assign(t.metadata.vulnerabilities, e.data.vulnerabilities), t.metadata.dependencies.total = e.data.dependencies || 0;
			else if (e.type === "auditAdvisory") {
				let n = e.data.advisory, r = e.data.resolution, i = n.module_name, a = r?.path ? r.path.split(">")[0] : null, o = r?.path ? r.path.split(">").length === 1 : !1;
				t.vulnerabilities[i] || (t.vulnerabilities[i] = {
					name: i,
					title: n.title || "Unspecified vulnerability",
					patchedIn: n.patched_versions || null,
					url: n.url || null,
					severity: n.severity,
					isDirect: o,
					fixAvailable: n.recommendation || !1,
					via: [n.title || i],
					effects: [],
					sources: []
				}), a && !t.vulnerabilities[i].effects.includes(a) && t.vulnerabilities[i].effects.push(a);
			} else if (e.children && e.children.ID && e.children.Issue) {
				let n = e.value || "unknown", r = e.children, i = (r.Severity || "moderate").toLowerCase();
				t.vulnerabilities[n] || (t.vulnerabilities[n] = {
					name: n,
					title: r.Issue || "Vulnerabilidade não detalhada",
					patchedIn: r["Vulnerable Versions"] || null,
					url: r.URL || null,
					severity: i,
					isDirect: !0,
					fixAvailable: !1,
					via: [],
					effects: [],
					sources: []
				});
				let a = r.Issue || n;
				t.vulnerabilities[n].via.includes(a) || t.vulnerabilities[n].via.push(a), t.metadata.vulnerabilities[i] !== void 0 && t.metadata.vulnerabilities[i]++;
			}
		} catch {}
		return r ? { error: {
			code: "YARN_AUDIT_ERROR",
			summary: i
		} } : t;
	}
}
function _e(e, t, n) {
	e.vulnerabilities ||= {}, e.metadata ||= { vulnerabilities: {
		info: 0,
		low: 0,
		moderate: 0,
		high: 0,
		critical: 0
	} };
	for (let t of Object.keys(e.vulnerabilities)) e.vulnerabilities[t].sources = [n.toUpperCase()];
	if (t && t.length > 0) for (let n of t) {
		let t = n.name;
		if (e.vulnerabilities[t]) {
			e.vulnerabilities[t].sources.includes("OSV.dev") || e.vulnerabilities[t].sources.push("OSV.dev");
			let r = n.vulnerabilities.map((e) => e.id);
			e.vulnerabilities[t].via = [.../* @__PURE__ */ new Set([...e.vulnerabilities[t].via || [], ...r])], e.vulnerabilities[t].osvData = n.vulnerabilities;
		} else {
			let r = "moderate", i = JSON.stringify(n.vulnerabilities).toLowerCase();
			i.includes("critical") ? r = "critical" : i.includes("high") && (r = "high"), e.vulnerabilities[t] = {
				name: t,
				title: n.vulnerabilities[0].summary || "OSV Global Vulnerability Alert",
				patchedIn: "Check OSV.dev DB",
				severity: r,
				isDirect: !0,
				fixAvailable: !1,
				via: n.vulnerabilities.map((e) => e.id),
				effects: [],
				sources: ["OSV.dev"],
				osvData: n.vulnerabilities
			}, e.metadata.vulnerabilities[r] = (e.metadata.vulnerabilities[r] || 0) + 1;
		}
	}
	return e;
}
function ve() {
	s.on("run-security-audit", async (e, { projectPath: t, manager: n = "npm", lang: r = "en", customSastRules: i = [] }) => {
		let a = H(r);
		if (![
			"npm",
			"yarn",
			"pnpm",
			"bun"
		].includes(n)) return W.error(`[SECURITY ALERT] Execution attempt with invalid manager: ${n}`), e.sender.send("audit-error", "Invalid package manager detected.");
		if (!t || typeof t != "string") return W.error("Audit attempt with invalid path."), e.sender.send("audit-error", "Invalid project path.");
		let o = p.resolve(t);
		if (!_.existsSync(o) || !_.statSync(o).isDirectory()) return W.error(`Audit aborted. Directory not found: ${o}`), e.sender.send("audit-error", "Directory not found.");
		let s = await z(), c = {
			vulnerabilities: {},
			metadata: {
				vulnerabilities: {
					info: 0,
					low: 0,
					moderate: 0,
					high: 0,
					critical: 0
				},
				dependencies: { total: 0 }
			}
		}, l = {}, u = 0;
		if (!s) W.warn(`Network offline. Bypassing Triple-Scan for ${o}`), e.sender.send("terminal-log", a.offlineWarn), e.sender.send("terminal-log", a.offlineSast);
		else {
			W.info(`Starting Triple-Scan (Audit + Outdated + OSV) via ${n} at: ${o}`), e.sender.send("terminal-log", `\r\n\x1b[36m[SYSTEM]: Starting TRIPLE-SCAN (Security, OSV.dev & Tech Debt) via ${n.toUpperCase()}...\x1b[0m\r\n`);
			let t = n, r = n, i = ["audit", "--json"], s = ["outdated"];
			n === "yarn" ? U(o) >= 2 ? (t = "yarn", i = [
				"npm",
				"audit",
				"--json"
			], r = "yarn", s = [
				"dlx",
				"-q",
				"npm-check-updates",
				"--jsonUpgraded"
			]) : s.push("--json") : n === "pnpm" ? s.push("--format", "json") : s.push("--json");
			try {
				let d = 12e4, [f, p, m] = await Promise.all([
					me(t, i, o, d),
					me(r, s, o, d),
					pe(o)
				]);
				if (f.timedOut || p.timedOut) return W.warn(`Triple-Scan at ${o} aborted due to network timeout.`), e.sender.send("terminal-log", a.timeoutErr(d)), e.sender.send("audit-error", a.cloneTimeoutErr);
				u = f.code ?? 0, c = ge(f.stdout, n), l = he(p.stdout, n, o), c = _e(c, m, n), m.length > 0 ? e.sender.send("terminal-log", `\x1b[33m[SYSTEM]: OSV.dev Global Database detected threats in ${m.length} packages!\x1b[0m\r\n`) : e.sender.send("terminal-log", "\x1B[32m[SYSTEM]: OSV.dev Global Database scan clear.\x1B[0m\r\n"), e.sender.send("terminal-log", "\x1B[35m[SYSTEM]: Starting SAST (Static Application Security Testing) scan...\x1B[0m\r\n");
			} catch (t) {
				return W.error(`Fatal failure during Triple-Scan at ${o}`, t), e.sender.send("audit-error", `Catastrophic failure: ${t.message}`);
			}
		}
		try {
			let t = await de(o, i);
			t.length > 0 ? e.sender.send("terminal-log", `\x1b[31m[FATAL ALERT]: Detected ${t.length} hardcoded secrets (passwords/tokens) in the source code!\x1b[0m\r\n`) : e.sender.send("terminal-log", "\x1B[32m[SYSTEM]: Clean SAST scan. No exposed secrets.\x1B[0m\r\n"), c.error || (c.outdated = l, c.sast = t, c.vulnerabilities && Object.keys(c.vulnerabilities).length > 0 && (e.sender.send("terminal-log", "\x1B[33m[SYSTEM]: Tracking forensic culprits via Git Blame...\x1B[0m\r\n"), c.vulnerabilities = await se(o, c.vulnerabilities))), W.info(`Triple-Scan completed for: ${o}`), e.sender.send("audit-result", {
				success: !0,
				data: c,
				code: u
			});
		} catch (t) {
			W.error(`Error during SAST or finalizing audit at ${o}`, t), e.sender.send("audit-error", `Internal failure: ${t.message}`);
		}
	}), s.on("run-silent-audit", async (e, { projectPath: t, manager: n = "npm" }) => {
		if (!await z() || ![
			"npm",
			"yarn",
			"pnpm",
			"bun"
		].includes(n)) return;
		let r = p.resolve(t);
		if (!_.existsSync(r)) return;
		let i = n, a = ["audit", "--json"];
		n === "yarn" && U(r) >= 2 && (a = [
			"npm",
			"audit",
			"--json"
		]);
		try {
			let [{ stdout: o, timedOut: s }, c] = await Promise.all([me(i, a, r, 12e4), pe(r)]);
			if (s) return;
			let l = ge(o, n);
			l && !l.error && (l = _e(l, c, n), e.sender.send("silent-audit-result", {
				success: !0,
				projectPath: t,
				data: l
			}));
		} catch {}
	});
}
//#endregion
//#region electron/ipc/commands.ts
var ye = F(E);
function be() {
	s.on("run-package-command", async (e, { projectPath: t, commandType: n, manager: r = "yarn", lang: i = "en", args: a = "" }) => {
		let o = H(i);
		if (!t || typeof t != "string") {
			W.warn(`Command attempt (${n}) with invalid path.`), e.sender.send("terminal-log", o.errPath);
			return;
		}
		let s = p.resolve(t);
		if (!_.existsSync(s) || !_.statSync(s).isDirectory()) {
			W.error(`Command aborted. Directory not found: ${s}`), e.sender.send("terminal-log", o.errDir(s));
			return;
		}
		let c = process.platform === "win32", l = _.existsSync(p.join(s, ".git")), u = s.includes("sentinel-workspaces"), d = r === "pnpm" ? "pnpm-lock.yaml" : r === "yarn" ? "yarn.lock" : r === "bun" ? "bun.lockb" : "package-lock.json", f = p.join(s, d), m = () => {
			try {
				if (!_.existsSync(f)) return null;
				let e = _.statSync(f);
				return {
					size: e.size,
					mtimeMs: e.mtimeMs
				};
			} catch {
				return null;
			}
		}, h = a.split(" ").filter(Boolean), g = (e) => /^[a-zA-Z0-9\-_=.@/]+$/.test(e), v = h.filter(g), y = h.filter((e) => !g(e));
		if (y.length > 0) {
			W.warn(`[SECURITY ALERT] Execution blocked in repository ${s}. Dangerous characters detected: ${y.join(" ")}`), e.sender.send("terminal-log", o.secAlert(y.join(" "))), e.sender.send("command-finished", {
				code: -1,
				commandType: n,
				projectPath: s
			});
			return;
		}
		let b = r, x = [], S = (r === "yarn" ? U(s) : 1) >= 2, C = {
			yarn: {
				dedupe: () => {
					S ? x = ["dedupe"] : (b = "npx", x = ["yarn-deduplicate", d]);
				},
				"force-install": () => {
					x = S ? ["install", "--check-cache"] : [
						"install",
						"--force",
						...v
					];
				},
				"clean-cache": () => {
					x = S ? [
						"cache",
						"clean",
						"--all"
					] : [
						"cache",
						"clean",
						...v
					];
				},
				outdated: () => {
					S && (b = "npm"), x = ["outdated", ...v];
				},
				upgrade: () => {
					x = S ? ["up", ...v] : ["upgrade", ...v];
				},
				upgradeLatest: () => {
					x = S ? ["up", ...v.length > 0 ? v.map((e) => `${e}@latest`) : ["*@latest"]] : [
						"upgrade",
						"--latest",
						...v
					];
				},
				"upgrade-selection": () => {
					x = S ? ["up", ...v] : ["upgrade", ...v];
				},
				"audit-fix": () => {
					S ? (b = "yarn", x = ["npm", "audit"]) : (b = "npx", x = ["yarn-audit-fix"]);
				}
			},
			pnpm: {
				dedupe: () => {
					x = ["dedupe", ...v];
				},
				"force-install": () => {
					x = [
						"install",
						"--force",
						...v
					];
				},
				"clean-cache": () => {
					x = [
						"store",
						"prune",
						...v
					];
				},
				"clean-cache-global": () => {
					b = "pnpm", x = ["store", "prune"];
				},
				outdated: () => {
					x = ["outdated", ...v];
				},
				upgrade: () => {
					x = ["update", ...v];
				},
				upgradeLatest: () => {
					x = [
						"update",
						"--latest",
						...v
					];
				},
				"upgrade-selection": () => {
					b = "pnpm", x = ["add", ...v];
				},
				"audit-fix": () => {
					b = "pnpm", x = ["audit", "--fix"];
				}
			},
			npm: {
				dedupe: () => {
					x = ["dedupe", ...v];
				},
				"force-install": () => {
					x = [
						"install",
						"--force",
						...v
					];
				},
				"clean-cache": () => {
					x = [
						"cache",
						"clean",
						"--force",
						...v
					];
				},
				"clean-cache-global": () => {
					b = "npm", x = [
						"cache",
						"clean",
						"--force"
					];
				},
				outdated: () => {
					x = ["outdated", ...v];
				},
				upgrade: () => {
					x = ["update", ...v];
				},
				upgradeLatest: () => {
					b = "npx", x = [
						"npm-check-updates",
						"-u",
						...v
					];
				},
				"upgrade-selection": () => {
					b = "npm", x = ["install", ...v];
				},
				"audit-fix": () => {
					b = "npm", x = ["audit", "fix"];
				}
			},
			bun: {
				dedupe: () => {
					x = [
						"pm",
						"dedupe",
						...v
					];
				},
				"force-install": () => {
					x = [
						"install",
						"--force",
						...v
					];
				},
				"clean-cache": () => {
					x = [
						"pm",
						"cache",
						"rm"
					];
				},
				"clean-cache-global": () => {
					b = "bun", x = [
						"pm",
						"cache",
						"rm"
					];
				},
				outdated: () => {
					x = ["outdated", ...v];
				},
				upgrade: () => {
					x = ["update", ...v];
				},
				upgradeLatest: () => {
					x = [
						"update",
						"--latest",
						...v
					];
				},
				"upgrade-selection": () => {
					b = "bun", x = ["add", ...v];
				},
				"audit-fix": () => {
					b = "bun", x = ["update"];
				}
			}
		};
		C[r]?.[n] ? C[r][n]() : x = [n, ...v], W.info(`Executing command [${b} ${x.join(" ")}] in repository: ${s}`);
		let w = n === "dedupe" ? m() : null;
		e.sender.send("terminal-log", o.pipeline(r.toUpperCase(), b, x.join(" "), s));
		let T = O(b, x, {
			cwd: s,
			shell: c,
			windowsHide: !0,
			env: {
				...process.env,
				FORCE_COLOR: "1"
			}
		}), E = 18e4, D = !1, k = setTimeout(() => {
			D = !0, W.warn(`[TIMEOUT] Killing process [${n}] at ${s} after ${E}ms`), e.sender.send("terminal-log", o.timeoutErr(E)), T.kill("SIGKILL");
		}, E);
		T.stdout.on("data", (t) => e.sender.send("terminal-log", t.toString())), T.stderr.on("data", (t) => e.sender.send("terminal-log", t.toString())), T.on("error", (t) => {
			clearTimeout(k), W.error(`Fatal failure executing command [${n}] at ${s}`, t), e.sender.send("terminal-log", o.spawnErr(String(t?.message ?? t))), e.sender.send("command-finished", {
				code: -1,
				commandType: n,
				projectPath: s
			});
		}), T.on("close", async (t) => {
			if (clearTimeout(k), D) {
				e.sender.send("command-finished", {
					code: -1,
					commandType: n,
					projectPath: s
				});
				return;
			}
			if (W.info(`Command [${n}] at ${s} finished with code ${t}`), n === "audit-fix" && u) {
				e.sender.send("terminal-log", `${o.done(t ?? 0)}\r\n`), e.sender.send("terminal-log", "\x1B[36m[SYSTEM]: Initializing Sentinel Git-OPS (DevChavatte)...\x1B[0m\r\n"), e.sender.send("terminal-log", "\x1B[33m[GIT-OPS]: Synchronizing remediation with remote origin...\x1B[0m\r\n");
				try {
					let t = {
						...process.env,
						GIT_TERMINAL_PROMPT: "0"
					}, n = c ? "cmd.exe" : "git", r = async (e) => {
						let r = c ? [
							"/c",
							"git",
							...e
						] : e, { stdout: i, stderr: a } = await ye(n, r, {
							cwd: s,
							env: t,
							windowsHide: !0
						});
						return i + a;
					};
					await r([
						"config",
						"user.name",
						"Sentinel Forge EDR"
					]), await r([
						"config",
						"user.email",
						"secops@sentinelforge.local"
					]), await r([
						"add",
						"package.json",
						"package-lock.json",
						"yarn.lock",
						"pnpm-lock.yaml",
						"bun.lockb"
					]);
					try {
						await r([
							"commit",
							"-m",
							"fix(security): auto-remediation applied via Sentinel Forge SOC"
						]), await r(["push"]), e.sender.send("terminal-log", "\x1B[1;32m[GIT-OPS SUCCESS]: Threat neutralized and patch pushed to remote repository!\x1B[0m\r\n---\r\n");
					} catch (t) {
						let n = String(t.stdout || "") + String(t.stderr || "") + String(t.message || "");
						if (n.includes("nothing to commit") || n.includes("clean")) e.sender.send("terminal-log", "\x1B[1;32m[GIT-OPS]: No dependency changes detected (requires manual mitigation).\x1B[0m\r\n---\r\n");
						else throw t;
					}
				} catch (t) {
					e.sender.send("terminal-log", `\x1b[1;31m[GIT-OPS ERROR]: Push failed. Ensure SSH auth is active or repo is writable.\x1b[0m\r\n${t.message}\r\n---\r\n`);
				}
				e.sender.send("command-finished", {
					code: t,
					commandType: n,
					projectPath: s
				});
				return;
			}
			if (n === "dedupe") {
				let n = m(), r = w && n ? w.size !== n.size || w.mtimeMs !== n.mtimeMs : !!n && !w, i = o.gitNotRepo;
				l && (i = await new Promise((e) => {
					let t = O(c ? "cmd.exe" : "git", c ? [
						"/d",
						"/s",
						"/c",
						"git",
						"diff",
						"--numstat",
						"--",
						d
					] : [
						"diff",
						"--numstat",
						"--",
						d
					], {
						cwd: s,
						windowsHide: !0,
						shell: !1
					}), n = "";
					t.stdout.on("data", (e) => n += e.toString()), t.on("close", () => {
						let t = n.trim().split(/\s+/);
						if (!t[0]) return e(o.gitErr);
						e(o.gitDiff(Number(t[0]), Number(t[1]), d));
					});
				})), e.sender.send("terminal-log", `${o.done(t ?? 0)}\r\n${w ? o.before(w.size) : o.beforeNotFound(d)}\r\n${n ? o.after(n.size) : o.afterNotFound(d)}\r\n${i}\r\n${r ? o.resUpdate(d) : o.resNoChange(d)}\r\n---\r\n`);
			} else e.sender.send("terminal-log", `${o.done(t ?? 0)}\r\n---\r\n`);
			e.sender.send("command-finished", {
				code: t,
				commandType: n,
				projectPath: s
			});
		});
	}), s.on("add-remote-project", async (e, { url: t, sshKeyPath: n, lang: r = "en" }) => {
		let i = H(r);
		try {
			if (!t.startsWith("http") && !t.startsWith("git@")) {
				W.warn(`Cloning attempt rejected. Invalid URL: ${t}`), e.sender.send("terminal-log", i.cloneInvalidUrl), e.sender.send("command-finished", { code: 1 });
				return;
			}
			W.info(`Starting Sparse Checkout of remote repository: ${t}`), e.sender.send("terminal-log", i.cloneSysInit);
			let r = t.split("/").pop()?.replace(".git", "") || "repo-remoto", o = Math.random().toString(36).substring(2, 8), s = a.getPath("userData"), c = p.join(s, "sentinel-workspaces", `${r}-${o}`);
			_.mkdirSync(p.dirname(c), { recursive: !0 });
			let l = { ...process.env };
			n && (W.info(`Using SSH authentication with key located at: ${n}`), l.GIT_SSH_COMMAND = `ssh -i "${n.replace(/\\/g, "/")}" -o StrictHostKeyChecking=no`, e.sender.send("terminal-log", i.cloneSshMsg)), e.sender.send("terminal-log", i.cloneMetaMsg), await ye("git", [
				"clone",
				"--filter=blob:none",
				"--sparse",
				t,
				c
			], {
				env: l,
				timeout: 3e5,
				killSignal: "SIGKILL"
			}), e.sender.send("terminal-log", i.cloneExtractMsg), await ye("git", [
				"sparse-checkout",
				"set",
				"--no-cone",
				"package.json",
				"package-lock.json",
				"yarn.lock",
				"pnpm-lock.yaml",
				".yarnrc.yml",
				".yarn/releases/*",
				".yarn/plugins/*"
			], {
				cwd: c,
				env: l,
				timeout: 6e4,
				killSignal: "SIGKILL"
			});
			let u = "npm";
			_.existsSync(p.join(c, "pnpm-lock.yaml")) ? u = "pnpm" : _.existsSync(p.join(c, "yarn.lock")) ? u = "yarn" : _.existsSync(p.join(c, "bun.lockb")) && (u = "bun"), W.info(`Remote repository (${r}) isolated successfully. Detected manager: ${u}.`), e.sender.send("terminal-log", i.cloneSuccess), e.sender.send("command-finished", { code: 0 }), e.sender.send("remote-project-added", {
				id: `remote-${o}`,
				name: `☁️ ${r}`,
				path: c,
				defaultManager: u
			});
		} catch (n) {
			W.error(`Critical failure during cloning of remote repository: ${t}`, n);
			let r = n.killed && n.code === "SIGKILL" ? i.cloneTimeoutErr : n.message;
			e.sender.send("terminal-log", i.cloneError(r)), e.sender.send("command-finished", { code: 1 });
		}
	});
}
//#endregion
//#region electron/ipc/sbom.ts
function xe() {
	s.handle("generate-sbom", async (e, t, n = "en") => {
		let r = H(n);
		try {
			if (!t || typeof t != "string") throw Error("Invalid project path provided.");
			let e = p.resolve(t), n = p.join(e, "package.json");
			try {
				await k.access(n);
			} catch {
				return W.warn(`[SBOM] package.json not found at ${n}`), {
					success: !1,
					error: r.sbomMissingPackage
				};
			}
			let i = await k.readFile(n, "utf-8"), a = JSON.parse(i), o = [], s = (e, t) => {
				if (e) for (let [n, r] of Object.entries(e)) {
					let e = r.replace(/^[^\d]+/, "");
					(!e || e.trim() === "") && (e = r.replace(/[^a-zA-Z0-9.\-:*]+/g, "") || "unknown"), o.push({
						type: "library",
						"bom-ref": `pkg:npm/${n}@${e}`,
						name: n,
						version: e,
						scope: t,
						purl: `pkg:npm/${n}@${e}`
					});
				}
			};
			s(a.dependencies, "required"), s(a.devDependencies, "optional");
			let c = {
				bomFormat: "CycloneDX",
				specVersion: "1.4",
				serialNumber: `urn:uuid:${I.randomUUID()}`,
				version: 1,
				metadata: {
					timestamp: (/* @__PURE__ */ new Date()).toISOString(),
					tools: [{
						vendor: "DeVChavatte",
						name: "Sentinel Forge EDR",
						version: "2.0.0"
					}],
					component: {
						type: "application",
						name: a.name || p.basename(e),
						version: a.version || "0.0.0"
					}
				},
				components: o
			};
			return W.info(`[SBOM] Successfully generated CycloneDX SBOM for ${a.name || "project"}`), {
				success: !0,
				data: JSON.stringify(c, null, 2)
			};
		} catch (e) {
			return W.error(`[SBOM] Fatal error generating SBOM: ${e.message}`), {
				success: !1,
				error: e.message
			};
		}
	});
}
//#endregion
//#region node_modules/readdirp/index.js
var K = {
	FILE_TYPE: "files",
	DIR_TYPE: "directories",
	FILE_DIR_TYPE: "files_directories",
	EVERYTHING_TYPE: "all"
}, Se = {
	root: ".",
	fileFilter: (e) => !0,
	directoryFilter: (e) => !0,
	type: K.FILE_TYPE,
	lstat: !1,
	depth: 2147483648,
	alwaysStat: !1,
	highWaterMark: 256
};
Object.freeze(Se);
var Ce = "READDIRP_RECURSIVE_ERROR", we = /* @__PURE__ */ new Set([
	"ENOENT",
	"EPERM",
	"EACCES",
	"ELOOP",
	Ce
]), Te = [
	K.DIR_TYPE,
	K.EVERYTHING_TYPE,
	K.FILE_DIR_TYPE,
	K.FILE_TYPE
], Ee = /* @__PURE__ */ new Set([
	K.DIR_TYPE,
	K.EVERYTHING_TYPE,
	K.FILE_DIR_TYPE
]), De = /* @__PURE__ */ new Set([
	K.EVERYTHING_TYPE,
	K.FILE_DIR_TYPE,
	K.FILE_TYPE
]), Oe = (e) => we.has(e.code), ke = process.platform === "win32", Ae = (e) => !0, je = (e) => {
	if (e === void 0) return Ae;
	if (typeof e == "function") return e;
	if (typeof e == "string") {
		let t = e.trim();
		return (e) => e.basename === t;
	}
	if (Array.isArray(e)) {
		let t = e.map((e) => e.trim());
		return (e) => t.some((t) => e.basename === t);
	}
	return Ae;
}, Me = class extends ne {
	parents;
	reading;
	parent;
	_stat;
	_maxDepth;
	_wantsDir;
	_wantsFile;
	_wantsEverything;
	_root;
	_isDirent;
	_statsProp;
	_rdOptions;
	_fileFilter;
	_directoryFilter;
	_relStart;
	constructor(e = {}) {
		super({
			objectMode: !0,
			autoDestroy: !0,
			highWaterMark: e.highWaterMark ?? Se.highWaterMark
		});
		let t = {
			...Se,
			...e
		}, n = t.root ?? Se.root, r = t.type ?? Se.type;
		this._fileFilter = je(t.fileFilter), this._directoryFilter = je(t.directoryFilter);
		let i = t.lstat ? A : N;
		this._stat = ke ? (e) => i(e, { bigint: !0 }) : i, this._maxDepth = t.depth != null && Number.isSafeInteger(t.depth) ? t.depth : Se.depth, this._wantsDir = Ee.has(r), this._wantsFile = De.has(r), this._wantsEverything = r === K.EVERYTHING_TYPE, this._root = h(n), this._relStart = this._root.endsWith(g) ? this._root.length : this._root.length + 1, this._isDirent = !t.alwaysStat, this._statsProp = this._isDirent ? "dirent" : "stats", this._rdOptions = {
			encoding: "utf8",
			withFileTypes: this._isDirent
		};
		let a = {
			path: this._root,
			depth: 1
		};
		a.pending = this._exploreDir(this._root, 1), this.parents = [a], this.reading = !1, this.parent = void 0;
	}
	async _read(e) {
		if (!this.reading) {
			this.reading = !0;
			try {
				for (; !this.destroyed && e > 0;) {
					let t = this.parent, n = t && t.files;
					if (n && n.length > 0) {
						let { path: r, depth: i } = t, a = n.splice(0, e).map((e) => this._formatEntry(e, r)), o = this._isDirent ? a : await Promise.all(a);
						for (let t of o) {
							if (!t) continue;
							if (this.destroyed) return;
							let n = this._getEntryType(t);
							typeof n != "string" && (n = await n), n === "directory" && this._directoryFilter(t) ? (i <= this._maxDepth && this.parents.push({
								path: t.fullPath,
								depth: i + 1
							}), this._wantsDir && (this.push(t), e--)) : (n === "file" || this._includeAsFile(t)) && this._fileFilter(t) && this._wantsFile && (this.push(t), e--);
						}
					} else {
						let e = this.parents.pop();
						if (!e) {
							this.push(null);
							break;
						}
						let t = e.pending ?? this._exploreDir(e.path, e.depth), n = this.parents[this.parents.length - 1];
						if (n && !n.pending && (n.pending = this._exploreDir(n.path, n.depth)), this.parent = await t, this.destroyed) return;
					}
				}
			} catch (e) {
				this.destroy(e);
			} finally {
				this.reading = !1;
			}
		}
	}
	async _exploreDir(e, t) {
		let n;
		try {
			n = await j(e, this._rdOptions);
		} catch (e) {
			this._onError(e);
		}
		return {
			files: n,
			depth: t,
			path: e
		};
	}
	_formatEntry(e, t) {
		let n = this._isDirent ? e.name : e, r = m(t, n), i = {
			path: r.slice(this._relStart),
			fullPath: r,
			basename: n
		};
		return this._isDirent ? (i.dirent = e, i) : this._stat(r).then((e) => (i.stats = e, i), (e) => {
			this._onError(e);
		});
	}
	_onError(e) {
		Oe(e) && !this.destroyed ? this.emit("warn", e) : this.destroy(e);
	}
	_getEntryType(e) {
		if (!e || !(this._statsProp in e)) return "";
		let t = e[this._statsProp];
		return t.isFile() ? "file" : t.isDirectory() ? "directory" : t.isSymbolicLink() ? this._getSymlinkEntryType(e) : "";
	}
	async _getSymlinkEntryType(e) {
		let t = e.fullPath;
		try {
			let e = await M(t), n = await A(e);
			if (n.isFile()) return "file";
			if (n.isDirectory()) {
				let n = e.length;
				if (t.startsWith(e) && t[n] === g) {
					let n = /* @__PURE__ */ Error(`Circular symlink detected: "${t}" points to "${e}"`);
					return n.code = Ce, this._onError(n), "";
				}
				return "directory";
			}
		} catch (e) {
			this._onError(e);
		}
		return "";
	}
	_includeAsFile(e) {
		let t = e && e[this._statsProp];
		return t && this._wantsEverything && !t.isDirectory();
	}
};
function Ne(e, t = {}) {
	let n = t.entryType || t.type;
	if (n === "both" && (n = K.FILE_DIR_TYPE), !e) throw Error("readdirp: root argument is required. Usage: readdirp(root, options)");
	if (typeof e != "string") throw TypeError("readdirp: root argument must be a string. Usage: readdirp(root, options)");
	if (n && !Te.includes(n)) throw Error(`readdirp: Invalid type passed. Use one of ${Te.join(", ")}`);
	let r = {
		...t,
		root: e
	};
	return n && (r.type = n), new Me(r);
}
//#endregion
//#region node_modules/chokidar/handler.js
var Pe = "data", Fe = "close", Ie = () => {}, Le = process.platform, Re = Le === "win32", ze = Le === "darwin", Be = Le === "linux", Ve = Le === "freebsd", He = w() === "OS400", q = {
	ALL: "all",
	READY: "ready",
	ADD: "add",
	CHANGE: "change",
	ADD_DIR: "addDir",
	UNLINK: "unlink",
	UNLINK_DIR: "unlinkDir",
	RAW: "raw",
	ERROR: "error"
}, Ue = q, We = "watch", Ge = {
	lstat: A,
	stat: N
}, Ke = "listeners", qe = "errHandlers", Je = "rawEmitters", Ye = [
	Ke,
	qe,
	Je
], Xe = /* @__PURE__ */ new Set(/* @__PURE__ */ "3dm.3ds.3g2.3gp.7z.a.aac.adp.afdesign.afphoto.afpub.ai.aif.aiff.alz.ape.apk.appimage.ar.arj.asf.au.avi.bak.baml.bh.bin.bk.bmp.btif.bz2.bzip2.cab.caf.cgm.class.cmx.cpio.cr2.cur.dat.dcm.deb.dex.djvu.dll.dmg.dng.doc.docm.docx.dot.dotm.dra.DS_Store.dsk.dts.dtshd.dvb.dwg.dxf.ecelp4800.ecelp7470.ecelp9600.egg.eol.eot.epub.exe.f4v.fbs.fh.fla.flac.flatpak.fli.flv.fpx.fst.fvt.g3.gh.gif.graffle.gz.gzip.h261.h263.h264.icns.ico.ief.img.ipa.iso.jar.jpeg.jpg.jpgv.jpm.jxr.key.ktx.lha.lib.lvp.lz.lzh.lzma.lzo.m3u.m4a.m4v.mar.mdi.mht.mid.midi.mj2.mka.mkv.mmr.mng.mobi.mov.movie.mp3.mp4.mp4a.mpeg.mpg.mpga.mxu.nef.npx.numbers.nupkg.o.odp.ods.odt.oga.ogg.ogv.otf.ott.pages.pbm.pcx.pdb.pdf.pea.pgm.pic.png.pnm.pot.potm.potx.ppa.ppam.ppm.pps.ppsm.ppsx.ppt.pptm.pptx.psd.pya.pyc.pyo.pyv.qt.rar.ras.raw.resources.rgb.rip.rlc.rmf.rmvb.rpm.rtf.rz.s3m.s7z.scpt.sgi.shar.snap.sil.sketch.slk.smv.snk.so.stl.suo.sub.swf.tar.tbz.tbz2.tga.tgz.thmx.tif.tiff.tlz.ttc.ttf.txz.udf.uvh.uvi.uvm.uvp.uvs.uvu.viv.vob.war.wav.wax.wbmp.wdp.weba.webm.webp.whl.wim.wm.wma.wmv.wmx.woff.woff2.wrm.wvx.xbm.xif.xla.xlam.xls.xlsb.xlsm.xlsx.xlt.xltm.xltx.xm.xmind.xpi.xpm.xwd.xz.z.zip.zipx".split(".")), Ze = (e) => Xe.has(f.extname(e).slice(1).toLowerCase()), Qe = (e, t) => {
	e instanceof Set ? e.forEach(t) : t(e);
}, $e = (e, t, n) => {
	let r = e[t];
	r instanceof Set || (e[t] = r = /* @__PURE__ */ new Set([r])), r.add(n);
}, et = (e) => (t) => {
	let n = e[t];
	n instanceof Set ? n.clear() : delete e[t];
}, tt = (e, t, n) => {
	let r = e[t];
	r instanceof Set ? r.delete(n) : r === n && delete e[t];
}, nt = (e) => e instanceof Set ? e.size === 0 : !e, rt = /* @__PURE__ */ new Map();
function it(e, t, n, r, i) {
	let a = (t, r) => {
		n(e), i(t, r, { watchedPath: e }), r && e !== r && at(f.resolve(e, r), Ke, f.join(e, r));
	};
	try {
		return x(e, { persistent: t.persistent }, a);
	} catch (e) {
		r(e);
		return;
	}
}
var at = (e, t, n, r, i) => {
	let a = rt.get(e);
	a && Qe(a[t], (e) => {
		e(n, r, i);
	});
}, ot = (e, t, n, r) => {
	let { listener: i, errHandler: a, rawEmitter: o } = r, s = rt.get(t), c;
	if (!n.persistent) return c = it(e, n, i, a, o), c ? c.close.bind(c) : void 0;
	if (s) $e(s, Ke, i), $e(s, qe, a), $e(s, Je, o);
	else {
		if (c = it(e, n, at.bind(null, t, Ke), a, at.bind(null, t, Je)), !c) return;
		c.on(Ue.ERROR, async (n) => {
			let r = at.bind(null, t, qe);
			if (s && (s.watcherUnusable = !0), Re && n.code === "EPERM") try {
				await (await ee(e, "r")).close(), r(n);
			} catch {}
			else r(n);
		}), s = {
			listeners: i,
			errHandlers: a,
			rawEmitters: o,
			watcher: c
		}, rt.set(t, s);
	}
	return () => {
		tt(s, Ke, i), tt(s, qe, a), tt(s, Je, o), nt(s.listeners) && (s.watcher.close(), rt.delete(t), Ye.forEach(et(s)), s.watcher = void 0, Object.freeze(s));
	};
}, st = /* @__PURE__ */ new Map(), ct = (e, t, n, r) => {
	let { listener: i, rawEmitter: a } = r, o = st.get(t), s = o && o.options;
	return s && (s.persistent < n.persistent || s.interval > n.interval) && (b(t), o = void 0), o ? ($e(o, Ke, i), $e(o, Je, a)) : (o = {
		listeners: i,
		rawEmitters: a,
		options: n,
		watcher: S(t, n, (n, r) => {
			Qe(o.rawEmitters, (e) => {
				e(Ue.CHANGE, t, {
					curr: n,
					prev: r
				});
			});
			let i = n.mtimeMs;
			(n.size !== r.size || i > r.mtimeMs || i === 0) && Qe(o.listeners, (t) => t(e, n));
		})
	}, st.set(t, o)), () => {
		tt(o, Ke, i), tt(o, Je, a), nt(o.listeners) && (st.delete(t), b(t), o.options = o.watcher = void 0, Object.freeze(o));
	};
}, lt = class {
	fsw;
	_boundHandleError;
	constructor(e) {
		this.fsw = e, this._boundHandleError = (t) => e._handleError(t);
	}
	_watchWithNodeFs(e, t) {
		let n = this.fsw.options, r = f.dirname(e), i = f.basename(e);
		this.fsw._getWatchedDir(r).add(i);
		let a = f.resolve(e), o = { persistent: n.persistent };
		t ||= Ie;
		let s;
		return n.usePolling ? (o.interval = n.interval !== n.binaryInterval && Ze(i) ? n.binaryInterval : n.interval, s = ct(e, a, o, {
			listener: t,
			rawEmitter: this.fsw._emitRaw
		})) : s = ot(e, a, o, {
			listener: t,
			errHandler: this._boundHandleError,
			rawEmitter: this.fsw._emitRaw
		}), s;
	}
	_handleFile(e, t, n) {
		if (this.fsw.closed) return;
		let r = f.dirname(e), i = f.basename(e), a = this.fsw._getWatchedDir(r), o = t;
		if (a.has(i)) return;
		let s = async (t, n) => {
			if (this.fsw._throttle(We, e, 5)) {
				if (!n || n.mtimeMs === 0) try {
					let n = await N(e);
					if (this.fsw.closed) return;
					let r = n.atimeMs, i = n.mtimeMs;
					if ((!r || r <= i || i !== o.mtimeMs) && this.fsw._emit(Ue.CHANGE, e, n), (ze || Be || Ve) && o.ino !== n.ino) {
						this.fsw._closeFile(t), o = n;
						let r = this._watchWithNodeFs(e, s);
						r && this.fsw._addPathCloser(t, r);
					} else o = n;
				} catch {
					this.fsw._remove(r, i);
				}
				else if (a.has(i)) {
					let t = n.atimeMs, r = n.mtimeMs;
					(!t || t <= r || r !== o.mtimeMs) && this.fsw._emit(Ue.CHANGE, e, n), o = n;
				}
			}
		}, c = this._watchWithNodeFs(e, s);
		if (!(n && this.fsw.options.ignoreInitial) && this.fsw._isntIgnored(e)) {
			if (!this.fsw._throttle(Ue.ADD, e, 0)) return;
			this.fsw._emit(Ue.ADD, e, t);
		}
		return c;
	}
	async _handleSymlink(e, t, n, r) {
		if (this.fsw.closed) return;
		let i = e.fullPath, a = this.fsw._getWatchedDir(t);
		if (!this.fsw.options.followSymlinks) {
			this.fsw._incrReadyCount();
			let t;
			try {
				t = await M(n);
			} catch {
				return this.fsw._emitReady(), !0;
			}
			return this.fsw.closed ? void 0 : (a.has(r) ? this.fsw._symlinkPaths.get(i) !== t && (this.fsw._symlinkPaths.set(i, t), this.fsw._emit(Ue.CHANGE, n, e.stats)) : (a.add(r), this.fsw._symlinkPaths.set(i, t), this.fsw._emit(Ue.ADD, n, e.stats)), this.fsw._emitReady(), !0);
		}
		if (this.fsw._symlinkPaths.has(i)) return !0;
		this.fsw._symlinkPaths.set(i, !0);
	}
	_handleRead(e, t, n, r, i, a, o) {
		e = f.join(e, "");
		let s = r ? `${e}:${r}` : e;
		if (o = this.fsw._throttle("readdir", s, 1e3), !o) return;
		let c = this.fsw._getWatchedDir(n.path), l = /* @__PURE__ */ new Set(), u = this.fsw._readdirp(e, {
			fileFilter: (e) => n.filterPath(e),
			directoryFilter: (e) => n.filterDir(e)
		});
		if (u) return u.on(Pe, async (o) => {
			if (this.fsw.closed) {
				u = void 0;
				return;
			}
			let s = o.path, d = f.join(e, s);
			if (l.add(s), !(o.stats.isSymbolicLink() && await this._handleSymlink(o, e, d, s))) {
				if (this.fsw.closed) {
					u = void 0;
					return;
				}
				(s === r || !r && !c.has(s)) && (this.fsw._incrReadyCount(), d = f.join(i, f.relative(i, d)), this._addToNodeFs(d, t, n, a + 1));
			}
		}).on(Ue.ERROR, this._boundHandleError), new Promise((t, s) => {
			if (!u) return s();
			u.once("end", () => {
				if (this.fsw.closed) {
					u = void 0;
					return;
				}
				let s = o ? o.clear() : !1;
				t(void 0), c.getChildren().filter((t) => t !== e && !l.has(t)).forEach((t) => {
					this.fsw._remove(e, t);
				}), u = void 0, s && this._handleRead(e, !1, n, r, i, a, o);
			});
		});
	}
	async _handleDir(e, t, n, r, i, a, o) {
		let s = this.fsw._getWatchedDir(f.dirname(e)), c = s.has(f.basename(e));
		!(n && this.fsw.options.ignoreInitial) && !i && !c && this.fsw._emit(Ue.ADD_DIR, e, t), s.add(f.basename(e)), this.fsw._getWatchedDir(e);
		let l, u, d = this.fsw.options.depth;
		if ((d == null || r <= d) && !this.fsw._symlinkPaths.has(o)) {
			if (!i && (await this._handleRead(e, n, a, i, e, r, l), this.fsw.closed)) return;
			u = this._watchWithNodeFs(e, (t, n) => {
				n && n.mtimeMs === 0 || this._handleRead(t, !1, a, i, e, r, l);
			});
		}
		return u;
	}
	async _addToNodeFs(e, t, n, r, i) {
		let a = this.fsw._emitReady;
		if (this.fsw._isIgnored(e) || this.fsw.closed) return a(), !1;
		let o = this.fsw._getWatchHelpers(e);
		n && (o.filterPath = (e) => n.filterPath(e), o.filterDir = (e) => n.filterDir(e));
		try {
			let n = await Ge[o.statMethod](o.watchPath);
			if (this.fsw.closed) return;
			if (this.fsw._isIgnored(o.watchPath, n)) return a(), !1;
			let s = this.fsw.options.followSymlinks, c;
			if (n.isDirectory()) {
				let a = f.resolve(e), l = s ? await M(e) : e;
				if (this.fsw.closed || (c = await this._handleDir(o.watchPath, n, t, r, i, o, l), this.fsw.closed)) return;
				a !== l && l !== void 0 && this.fsw._symlinkPaths.set(a, l);
			} else if (n.isSymbolicLink()) {
				let i = s ? await M(e) : e;
				if (this.fsw.closed) return;
				let a = f.dirname(o.watchPath);
				if (this.fsw._getWatchedDir(a).add(o.watchPath), this.fsw._emit(Ue.ADD, o.watchPath, n), c = await this._handleDir(a, n, t, r, e, o, i), this.fsw.closed) return;
				i !== void 0 && this.fsw._symlinkPaths.set(f.resolve(e), i);
			} else c = this._handleFile(o.watchPath, n, t);
			return a(), c && this.fsw._addPathCloser(e, c), !1;
		} catch (t) {
			if (this.fsw._handleError(t)) return a(), e;
		}
	}
}, ut = "/", dt = "//", ft = ".", pt = "..", mt = "string", ht = /\\/g, gt = /\/\//g, _t = /\..*\.(sw[px])$|~$|\.subl.*\.tmp/, vt = /^\.[/\\]/;
function yt(e) {
	return Array.isArray(e) ? e : [e];
}
var bt = (e) => typeof e == "object" && !!e && !(e instanceof RegExp);
function xt(e) {
	return typeof e == "function" ? e : typeof e == "string" ? (t) => e === t : e instanceof RegExp ? (t) => e.test(t) : typeof e == "object" && e ? (t) => {
		if (e.path === t) return !0;
		if (e.recursive) {
			let n = f.relative(e.path, t);
			return n ? !n.startsWith("..") && !f.isAbsolute(n) : !1;
		}
		return !1;
	} : () => !1;
}
function St(e) {
	if (typeof e != "string") throw Error("string expected");
	e = f.normalize(e), e = e.replace(/\\/g, "/");
	let t = !1;
	return e.startsWith("//") && (t = !0), e = e.replace(gt, "/"), t && (e = "/" + e), e;
}
function Ct(e, t, n) {
	let r = St(t);
	for (let t = 0; t < e.length; t++) {
		let i = e[t];
		if (i(r, n)) return !0;
	}
	return !1;
}
function wt(e, t) {
	if (e == null) throw TypeError("anymatch: specify first argument");
	let n = yt(e).map((e) => xt(e));
	return t == null ? (e, t) => Ct(n, e, t) : Ct(n, t);
}
var Tt = (e) => {
	let t = yt(e).flat();
	if (!t.every((e) => typeof e === mt)) throw TypeError(`Non-string provided as watch path: ${t}`);
	return t.map(Dt);
}, Et = (e) => {
	let t = e.replace(ht, ut), n = !1;
	return t.startsWith(dt) && (n = !0), t = t.replace(gt, ut), n && (t = ut + t), t;
}, Dt = (e) => Et(f.normalize(Et(e))), Ot = (e = "") => (t) => typeof t == "string" ? Dt(f.isAbsolute(t) ? t : f.join(e, t)) : t, kt = (e, t) => f.isAbsolute(e) ? e : f.join(t, e), At = Object.freeze(/* @__PURE__ */ new Set()), jt = class {
	path;
	_removeWatcher;
	items;
	constructor(e, t) {
		this.path = e, this._removeWatcher = t, this.items = /* @__PURE__ */ new Set();
	}
	add(e) {
		let { items: t } = this;
		t && e !== ft && e !== pt && t.add(e);
	}
	async remove(e) {
		let { items: t } = this;
		if (!t || (t.delete(e), t.size > 0)) return;
		let n = this.path;
		try {
			await j(n);
		} catch {
			this._removeWatcher && this._removeWatcher(f.dirname(n), f.basename(n));
		}
	}
	has(e) {
		let { items: t } = this;
		if (t) return t.has(e);
	}
	getChildren() {
		let { items: e } = this;
		return e ? [...e.values()] : [];
	}
	dispose() {
		this.items.clear(), this.path = "", this._removeWatcher = Ie, this.items = At, Object.freeze(this);
	}
}, Mt = "stat", Nt = "lstat", Pt = class {
	fsw;
	path;
	watchPath;
	fullWatchPath;
	dirParts;
	followSymlinks;
	statMethod;
	constructor(e, t, n) {
		this.fsw = n;
		let r = e;
		this.path = e = e.replace(vt, ""), this.watchPath = r, this.fullWatchPath = f.resolve(r), this.dirParts = [], this.dirParts.forEach((e) => {
			e.length > 1 && e.pop();
		}), this.followSymlinks = t, this.statMethod = t ? Mt : Nt;
	}
	entryPath(e) {
		return f.join(this.watchPath, f.relative(this.watchPath, e.fullPath));
	}
	filterPath(e) {
		let { stats: t } = e;
		if (t && t.isSymbolicLink()) return this.filterDir(e);
		let n = this.entryPath(e);
		return this.fsw._isntIgnored(n, t) && this.fsw._hasReadPermissions(t);
	}
	filterDir(e) {
		return this.fsw._isntIgnored(this.entryPath(e), e.stats);
	}
}, Ft = class extends te {
	closed;
	options;
	_closers;
	_ignoredPaths;
	_throttled;
	_streams;
	_symlinkPaths;
	_watched;
	_pendingWrites;
	_pendingUnlinks;
	_readyCount;
	_emitReady;
	_closePromise;
	_userIgnored;
	_readyEmitted;
	_emitRaw;
	_boundRemove;
	_nodeFsHandler;
	constructor(e = {}) {
		super(), this.closed = !1, this._closers = /* @__PURE__ */ new Map(), this._ignoredPaths = /* @__PURE__ */ new Set(), this._throttled = /* @__PURE__ */ new Map(), this._streams = /* @__PURE__ */ new Set(), this._symlinkPaths = /* @__PURE__ */ new Map(), this._watched = /* @__PURE__ */ new Map(), this._pendingWrites = /* @__PURE__ */ new Map(), this._pendingUnlinks = /* @__PURE__ */ new Map(), this._readyCount = 0, this._readyEmitted = !1;
		let t = e.awaitWriteFinish, n = {
			stabilityThreshold: 2e3,
			pollInterval: 100
		}, r = {
			persistent: !0,
			ignoreInitial: !1,
			ignorePermissionErrors: !1,
			interval: 100,
			binaryInterval: 300,
			followSymlinks: !0,
			usePolling: !1,
			atomic: !0,
			...e,
			ignored: e.ignored ? yt(e.ignored) : yt([]),
			awaitWriteFinish: t === !0 ? n : typeof t == "object" && {
				...n,
				...t
			}
		};
		He && (r.usePolling = !0), r.atomic === void 0 && (r.atomic = !r.usePolling);
		let i = process.env.CHOKIDAR_USEPOLLING;
		if (i !== void 0) {
			let e = i.toLowerCase();
			r.usePolling = e === "false" || e === "0" ? !1 : e === "true" || e === "1" || !!e;
		}
		let a = process.env.CHOKIDAR_INTERVAL;
		a && (r.interval = Number.parseInt(a, 10));
		let o = 0;
		this._emitReady = () => {
			o++, o >= this._readyCount && (this._emitReady = Ie, this._readyEmitted = !0, process.nextTick(() => this.emit(q.READY)));
		}, this._emitRaw = (...e) => this.emit(q.RAW, ...e), this._boundRemove = this._remove.bind(this), this.options = r, this._nodeFsHandler = new lt(this), Object.freeze(r);
	}
	_addIgnoredPath(e) {
		if (bt(e)) {
			for (let t of this._ignoredPaths) if (bt(t) && t.path === e.path && t.recursive === e.recursive) return;
		}
		this._ignoredPaths.add(e);
	}
	_removeIgnoredPath(e) {
		if (this._ignoredPaths.delete(e), typeof e == "string") for (let t of this._ignoredPaths) bt(t) && t.path === e && this._ignoredPaths.delete(t);
	}
	add(e, t, n) {
		let { cwd: r } = this.options;
		this.closed = !1, this._closePromise = void 0;
		let i = Tt(e);
		return r && (i = i.map((e) => kt(e, r))), i.forEach((e) => {
			this._removeIgnoredPath(e);
		}), this._userIgnored = void 0, this._readyCount ||= 0, this._readyCount += i.length, Promise.all(i.map(async (e) => {
			let r = await this._nodeFsHandler._addToNodeFs(e, !n, void 0, 0, t);
			return r && this._emitReady(), r;
		})).then((e) => {
			this.closed || e.forEach((e) => {
				e && this.add(f.dirname(e), f.basename(t || e));
			});
		}), this;
	}
	unwatch(e) {
		if (this.closed) return this;
		let t = Tt(e), { cwd: n } = this.options;
		return t.forEach((e) => {
			!f.isAbsolute(e) && !this._closers.has(e) && (n && (e = f.join(n, e)), e = f.resolve(e)), this._closePath(e), this._addIgnoredPath(e), this._watched.has(e) && this._addIgnoredPath({
				path: e,
				recursive: !0
			}), this._userIgnored = void 0;
		}), this;
	}
	close() {
		if (this._closePromise) return this._closePromise;
		this.closed = !0, this.removeAllListeners();
		let e = [];
		return this._closers.forEach((t) => t.forEach((t) => {
			let n = t();
			n instanceof Promise && e.push(n);
		})), this._streams.forEach((e) => e.destroy()), this._userIgnored = void 0, this._readyCount = 0, this._readyEmitted = !1, this._watched.forEach((e) => e.dispose()), this._closers.clear(), this._watched.clear(), this._streams.clear(), this._symlinkPaths.clear(), this._throttled.clear(), this._closePromise = e.length ? Promise.all(e).then(() => void 0) : Promise.resolve(), this._closePromise;
	}
	getWatched() {
		let e = {};
		return this._watched.forEach((t, n) => {
			let r = (this.options.cwd ? f.relative(this.options.cwd, n) : n) || ft;
			e[r] = t.getChildren().sort();
		}), e;
	}
	emitWithAll(e, t) {
		this.emit(e, ...t), e !== q.ERROR && this.emit(q.ALL, e, ...t);
	}
	async _emit(e, t, n) {
		if (this.closed) return;
		let r = this.options;
		Re && (t = f.normalize(t)), r.cwd && (t = f.relative(r.cwd, t));
		let i = [t];
		n != null && i.push(n);
		let a = r.awaitWriteFinish, o;
		if (a && (o = this._pendingWrites.get(t))) return o.lastChange = /* @__PURE__ */ new Date(), this;
		if (r.atomic) {
			if (e === q.UNLINK) return this._pendingUnlinks.set(t, [e, ...i]), setTimeout(() => {
				this._pendingUnlinks.forEach((e, t) => {
					this.emit(...e), this.emit(q.ALL, ...e), this._pendingUnlinks.delete(t);
				});
			}, typeof r.atomic == "number" ? r.atomic : 100), this;
			e === q.ADD && this._pendingUnlinks.has(t) && (e = q.CHANGE, this._pendingUnlinks.delete(t));
		}
		if (a && (e === q.ADD || e === q.CHANGE) && this._readyEmitted) return this._awaitWriteFinish(t, a.stabilityThreshold, e, (t, n) => {
			t ? (e = q.ERROR, i[0] = t, this.emitWithAll(e, i)) : n && (i.length > 1 ? i[1] = n : i.push(n), this.emitWithAll(e, i));
		}), this;
		if (e === q.CHANGE && !this._throttle(q.CHANGE, t, 50)) return this;
		if (r.alwaysStat && n === void 0 && (e === q.ADD || e === q.ADD_DIR || e === q.CHANGE)) {
			let e = r.cwd ? f.join(r.cwd, t) : t, n;
			try {
				n = await N(e);
			} catch {}
			if (!n || this.closed) return;
			i.push(n);
		}
		return this.emitWithAll(e, i), this;
	}
	_handleError(e) {
		let t = e && e.code;
		return e && t !== "ENOENT" && t !== "ENOTDIR" && (!this.options.ignorePermissionErrors || t !== "EPERM" && t !== "EACCES") && this.emit(q.ERROR, e), e || this.closed;
	}
	_throttle(e, t, n) {
		this._throttled.has(e) || this._throttled.set(e, /* @__PURE__ */ new Map());
		let r = this._throttled.get(e);
		if (!r) throw Error("invalid throttle");
		let i = r.get(t);
		if (i) return i.count++, !1;
		let a, o = () => {
			let e = r.get(t), n = e ? e.count : 0;
			return r.delete(t), clearTimeout(a), e && clearTimeout(e.timeoutObject), n;
		};
		a = setTimeout(o, n);
		let s = {
			timeoutObject: a,
			clear: o,
			count: 0
		};
		return r.set(t, s), s;
	}
	_incrReadyCount() {
		return this._readyCount++;
	}
	_awaitWriteFinish(e, t, n, r) {
		let i = this.options.awaitWriteFinish;
		if (typeof i != "object") return;
		let a = i.pollInterval, o, s = e;
		this.options.cwd && !f.isAbsolute(e) && (s = f.join(this.options.cwd, e));
		let c = /* @__PURE__ */ new Date(), l = this._pendingWrites;
		function u(n) {
			y(s, (i, s) => {
				if (i || !l.has(e)) {
					i && i.code !== "ENOENT" && r(i);
					return;
				}
				let c = Number(/* @__PURE__ */ new Date());
				n && s.size !== n.size && (l.get(e).lastChange = c), c - l.get(e).lastChange >= t ? (l.delete(e), r(void 0, s)) : o = setTimeout(u, a, s);
			});
		}
		l.has(e) || (l.set(e, {
			lastChange: c,
			cancelWait: () => (l.delete(e), clearTimeout(o), n)
		}), o = setTimeout(u, a));
	}
	_isIgnored(e, t) {
		if (this.options.atomic && _t.test(e)) return !0;
		if (!this._userIgnored) {
			let { cwd: e } = this.options, t = (this.options.ignored || []).map(Ot(e)), n = [...[...this._ignoredPaths].map(Ot(e)), ...t];
			this._userIgnored = wt(n, void 0);
		}
		return this._userIgnored(e, t);
	}
	_isntIgnored(e, t) {
		return !this._isIgnored(e, t);
	}
	_getWatchHelpers(e) {
		return new Pt(e, this.options.followSymlinks, this);
	}
	_getWatchedDir(e) {
		let t = f.resolve(e);
		return this._watched.has(t) || this._watched.set(t, new jt(t, this._boundRemove)), this._watched.get(t);
	}
	_hasReadPermissions(e) {
		return this.options.ignorePermissionErrors ? !0 : !!(Number(e.mode) & 256);
	}
	_remove(e, t, n) {
		let r = f.join(e, t), i = f.resolve(r);
		if (n ??= this._watched.has(r) || this._watched.has(i), !this._throttle("remove", r, 100)) return;
		!n && this._watched.size === 1 && this.add(e, t, !0), this._getWatchedDir(r).getChildren().forEach((e) => this._remove(r, e));
		let a = this._getWatchedDir(e), o = a.has(t);
		a.remove(t), this._symlinkPaths.has(i) && this._symlinkPaths.delete(i);
		let s = r;
		if (this.options.cwd && (s = f.relative(this.options.cwd, r)), this.options.awaitWriteFinish && this._pendingWrites.has(s) && this._pendingWrites.get(s).cancelWait() === q.ADD) return;
		this._watched.delete(r), this._watched.delete(i);
		let c = n ? q.UNLINK_DIR : q.UNLINK;
		o && !this._isIgnored(r) && this._emit(c, r), this._closePath(r);
	}
	_closePath(e) {
		this._closeFile(e);
		let t = f.dirname(e);
		this._getWatchedDir(t).remove(f.basename(e));
	}
	_closeFile(e) {
		let t = this._closers.get(e);
		t && (t.forEach((e) => e()), this._closers.delete(e));
	}
	_addPathCloser(e, t) {
		if (!t) return;
		let n = this._closers.get(e);
		n || (n = [], this._closers.set(e, n)), n.push(t);
	}
	_readdirp(e, t) {
		if (this.closed) return;
		let n = Ne(e, {
			type: q.ALL,
			alwaysStat: !0,
			lstat: !0,
			...t,
			depth: 0
		});
		return this._streams.add(n), n.once(Fe, () => {
			n = void 0;
		}), n.once("end", () => {
			n &&= (this._streams.delete(n), void 0);
		}), n;
	}
};
function It(e, t = {}) {
	let n = new Ft(t);
	return n.add(e), n;
}
//#endregion
//#region electron/ipc/watcher.ts
var Lt = null, Rt = /* @__PURE__ */ new Map(), zt = "en", Bt = /* @__PURE__ */ new Map();
function Vt() {
	s.on("change-language", (e, t) => {
		zt = t;
	}), s.on("sync-watched-projects", (e, t) => {
		Lt && (Lt.close(), Bt.forEach(clearTimeout), Bt.clear()), Rt.clear();
		let n = t.map((e) => (Rt.set(e.path, e.manager), [
			p.join(e.path, "package.json"),
			p.join(e.path, "yarn.lock"),
			p.join(e.path, "package-lock.json"),
			p.join(e.path, "pnpm-lock.yaml")
		])).flat();
		n.length !== 0 && (Lt = It(n, {
			persistent: !0,
			ignoreInitial: !0,
			awaitWriteFinish: {
				stabilityThreshold: 2e3,
				pollInterval: 100
			}
		}), Lt.on("change", (t) => {
			let n = p.dirname(t), i = Rt.get(n) || "npm", o = p.basename(n);
			Bt.has(n) && clearTimeout(Bt.get(n));
			let s = setTimeout(async () => {
				Bt.delete(n), W.info(`[EDR Watcher] Modification stabilized in ${p.basename(t)}. Starting silent scan...`);
				let s = i, l = ["audit", "--json"];
				i === "yarn" && U(n) >= 2 && (l = [
					"npm",
					"audit",
					"--json"
				]);
				try {
					let { stdout: t } = await me(s, l, n), u = ge(t, i);
					if (u && u.metadata && u.metadata.vulnerabilities) {
						let t = u.metadata.vulnerabilities, i = Number(t.critical) || 0, s = Number(t.high) || 0;
						if (i > 0 || s > 0) {
							W.warn(`[EDR Watcher] Severe threat injected in ${o}! C:${i} H:${s}`);
							let t = process.platform === "win32" ? "ico" : "png", l = a.isPackaged ? p.join(process.resourcesPath, "public", `sentinel.${t}`) : p.join(process.env.APP_ROOT || process.cwd(), "public", `sentinel.${t}`), d = H(zt), f = new r({
								title: d.watcherAlertTitle,
								body: d.watcherAlertBody(o.toUpperCase(), i, s),
								icon: c.createFromPath(l),
								urgency: "critical"
							});
							f.on("click", () => {
								let e = R("electron").BrowserWindow.getAllWindows();
								e.length > 0 && (e[0].isMinimized() && e[0].restore(), e[0].show(), e[0].focus());
							}), f.show(), e.sender.send("silent-audit-result", {
								success: !0,
								projectPath: n,
								data: u
							});
						} else W.info(`[EDR Watcher] ${o} updated. No critical threats detected.`);
					}
				} catch (e) {
					W.error(`[EDR Watcher] Failed to silently audit ${n}`, e);
				}
			}, 1500);
			Bt.set(n, s);
		}));
	});
}
//#endregion
//#region electron/ipc/index.ts
function Ht(e) {
	ae(e), ve(), be(), xe(), Vt();
}
//#endregion
//#region node_modules/universalify/index.js
var J = /* @__PURE__ */ L(((e) => {
	e.fromCallback = function(e) {
		return Object.defineProperty(function(...t) {
			if (typeof t[t.length - 1] == "function") e.apply(this, t);
			else return new Promise((n, r) => {
				t.push((e, t) => e == null ? n(t) : r(e)), e.apply(this, t);
			});
		}, "name", { value: e.name });
	}, e.fromPromise = function(e) {
		return Object.defineProperty(function(...t) {
			let n = t[t.length - 1];
			if (typeof n != "function") return e.apply(this, t);
			t.pop(), e.apply(this, t).then((e) => n(null, e), n);
		}, "name", { value: e.name });
	};
})), Ut = /* @__PURE__ */ L(((e, t) => {
	var n = R("constants"), r = process.cwd, i = null, a = process.env.GRACEFUL_FS_PLATFORM || process.platform;
	process.cwd = function() {
		return i ||= r.call(process), i;
	};
	try {
		process.cwd();
	} catch {}
	if (typeof process.chdir == "function") {
		var o = process.chdir;
		process.chdir = function(e) {
			i = null, o.call(process, e);
		}, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, o);
	}
	t.exports = s;
	function s(e) {
		n.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || r(e), e.chown = s(e.chown), e.fchown = s(e.fchown), e.lchown = s(e.lchown), e.chmod = i(e.chmod), e.fchmod = i(e.fchmod), e.lchmod = i(e.lchmod), e.chownSync = c(e.chownSync), e.fchownSync = c(e.fchownSync), e.lchownSync = c(e.lchownSync), e.chmodSync = o(e.chmodSync), e.fchmodSync = o(e.fchmodSync), e.lchmodSync = o(e.lchmodSync), e.stat = l(e.stat), e.fstat = l(e.fstat), e.lstat = l(e.lstat), e.statSync = u(e.statSync), e.fstatSync = u(e.fstatSync), e.lstatSync = u(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(e, t, n) {
			n && process.nextTick(n);
		}, e.lchmodSync = function() {}), e.chown && !e.lchown && (e.lchown = function(e, t, n, r) {
			r && process.nextTick(r);
		}, e.lchownSync = function() {}), a === "win32" && (e.rename = typeof e.rename == "function" ? (function(t) {
			function n(n, r, i) {
				var a = Date.now(), o = 0;
				t(n, r, function s(c) {
					if (c && (c.code === "EACCES" || c.code === "EPERM" || c.code === "EBUSY") && Date.now() - a < 6e4) {
						setTimeout(function() {
							e.stat(r, function(e, a) {
								e && e.code === "ENOENT" ? t(n, r, s) : i(c);
							});
						}, o), o < 100 && (o += 10);
						return;
					}
					i && i(c);
				});
			}
			return Object.setPrototypeOf && Object.setPrototypeOf(n, t), n;
		})(e.rename) : e.rename), e.read = typeof e.read == "function" ? (function(t) {
			function n(n, r, i, a, o, s) {
				var c;
				if (s && typeof s == "function") {
					var l = 0;
					c = function(u, d, f) {
						if (u && u.code === "EAGAIN" && l < 10) return l++, t.call(e, n, r, i, a, o, c);
						s.apply(this, arguments);
					};
				}
				return t.call(e, n, r, i, a, o, c);
			}
			return Object.setPrototypeOf && Object.setPrototypeOf(n, t), n;
		})(e.read) : e.read, e.readSync = typeof e.readSync == "function" ? (function(t) {
			return function(n, r, i, a, o) {
				for (var s = 0;;) try {
					return t.call(e, n, r, i, a, o);
				} catch (e) {
					if (e.code === "EAGAIN" && s < 10) {
						s++;
						continue;
					}
					throw e;
				}
			};
		})(e.readSync) : e.readSync;
		function t(e) {
			e.lchmod = function(t, r, i) {
				e.open(t, n.O_WRONLY | n.O_SYMLINK, r, function(t, n) {
					if (t) {
						i && i(t);
						return;
					}
					e.fchmod(n, r, function(t) {
						e.close(n, function(e) {
							i && i(t || e);
						});
					});
				});
			}, e.lchmodSync = function(t, r) {
				var i = e.openSync(t, n.O_WRONLY | n.O_SYMLINK, r), a = !0, o;
				try {
					o = e.fchmodSync(i, r), a = !1;
				} finally {
					if (a) try {
						e.closeSync(i);
					} catch {}
					else e.closeSync(i);
				}
				return o;
			};
		}
		function r(e) {
			n.hasOwnProperty("O_SYMLINK") && e.futimes ? (e.lutimes = function(t, r, i, a) {
				e.open(t, n.O_SYMLINK, function(t, n) {
					if (t) {
						a && a(t);
						return;
					}
					e.futimes(n, r, i, function(t) {
						e.close(n, function(e) {
							a && a(t || e);
						});
					});
				});
			}, e.lutimesSync = function(t, r, i) {
				var a = e.openSync(t, n.O_SYMLINK), o, s = !0;
				try {
					o = e.futimesSync(a, r, i), s = !1;
				} finally {
					if (s) try {
						e.closeSync(a);
					} catch {}
					else e.closeSync(a);
				}
				return o;
			}) : e.futimes && (e.lutimes = function(e, t, n, r) {
				r && process.nextTick(r);
			}, e.lutimesSync = function() {});
		}
		function i(t) {
			return t && function(n, r, i) {
				return t.call(e, n, r, function(e) {
					d(e) && (e = null), i && i.apply(this, arguments);
				});
			};
		}
		function o(t) {
			return t && function(n, r) {
				try {
					return t.call(e, n, r);
				} catch (e) {
					if (!d(e)) throw e;
				}
			};
		}
		function s(t) {
			return t && function(n, r, i, a) {
				return t.call(e, n, r, i, function(e) {
					d(e) && (e = null), a && a.apply(this, arguments);
				});
			};
		}
		function c(t) {
			return t && function(n, r, i) {
				try {
					return t.call(e, n, r, i);
				} catch (e) {
					if (!d(e)) throw e;
				}
			};
		}
		function l(t) {
			return t && function(n, r, i) {
				typeof r == "function" && (i = r, r = null);
				function a(e, t) {
					t && (t.uid < 0 && (t.uid += 4294967296), t.gid < 0 && (t.gid += 4294967296)), i && i.apply(this, arguments);
				}
				return r ? t.call(e, n, r, a) : t.call(e, n, a);
			};
		}
		function u(t) {
			return t && function(n, r) {
				var i = r ? t.call(e, n, r) : t.call(e, n);
				return i && (i.uid < 0 && (i.uid += 4294967296), i.gid < 0 && (i.gid += 4294967296)), i;
			};
		}
		function d(e) {
			return !e || e.code === "ENOSYS" || (!process.getuid || process.getuid() !== 0) && (e.code === "EINVAL" || e.code === "EPERM");
		}
	}
})), Wt = /* @__PURE__ */ L(((e, t) => {
	var n = R("stream").Stream;
	t.exports = r;
	function r(e) {
		return {
			ReadStream: t,
			WriteStream: r
		};
		function t(r, i) {
			if (!(this instanceof t)) return new t(r, i);
			n.call(this);
			var a = this;
			this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 65536, i ||= {};
			for (var o = Object.keys(i), s = 0, c = o.length; s < c; s++) {
				var l = o[s];
				this[l] = i[l];
			}
			if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
				if (typeof this.start != "number") throw TypeError("start must be a Number");
				if (this.end === void 0) this.end = Infinity;
				else if (typeof this.end != "number") throw TypeError("end must be a Number");
				if (this.start > this.end) throw Error("start must be <= end");
				this.pos = this.start;
			}
			if (this.fd !== null) {
				process.nextTick(function() {
					a._read();
				});
				return;
			}
			e.open(this.path, this.flags, this.mode, function(e, t) {
				if (e) {
					a.emit("error", e), a.readable = !1;
					return;
				}
				a.fd = t, a.emit("open", t), a._read();
			});
		}
		function r(t, i) {
			if (!(this instanceof r)) return new r(t, i);
			n.call(this), this.path = t, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i ||= {};
			for (var a = Object.keys(i), o = 0, s = a.length; o < s; o++) {
				var c = a[o];
				this[c] = i[c];
			}
			if (this.start !== void 0) {
				if (typeof this.start != "number") throw TypeError("start must be a Number");
				if (this.start < 0) throw Error("start must be >= zero");
				this.pos = this.start;
			}
			this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([
				this._open,
				this.path,
				this.flags,
				this.mode,
				void 0
			]), this.flush());
		}
	}
})), Gt = /* @__PURE__ */ L(((e, t) => {
	t.exports = r;
	var n = Object.getPrototypeOf || function(e) {
		return e.__proto__;
	};
	function r(e) {
		if (typeof e != "object" || !e) return e;
		if (e instanceof Object) var t = { __proto__: n(e) };
		else var t = Object.create(null);
		return Object.getOwnPropertyNames(e).forEach(function(n) {
			Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
		}), t;
	}
})), Y = /* @__PURE__ */ L(((e, t) => {
	var n = R("fs"), r = Ut(), i = Wt(), a = Gt(), o = R("util"), s, c;
	/* istanbul ignore else - node 0.x polyfill */
	typeof Symbol == "function" && typeof Symbol.for == "function" ? (s = Symbol.for("graceful-fs.queue"), c = Symbol.for("graceful-fs.previous")) : (s = "___graceful-fs.queue", c = "___graceful-fs.previous");
	function l() {}
	function u(e, t) {
		Object.defineProperty(e, s, { get: function() {
			return t;
		} });
	}
	var d = l;
	o.debuglog ? d = o.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (d = function() {
		var e = o.format.apply(o, arguments);
		e = "GFS4: " + e.split(/\n/).join("\nGFS4: "), console.error(e);
	}), n[s] || (u(n, global[s] || []), n.close = (function(e) {
		function t(t, r) {
			return e.call(n, t, function(e) {
				e || h(), typeof r == "function" && r.apply(this, arguments);
			});
		}
		return Object.defineProperty(t, c, { value: e }), t;
	})(n.close), n.closeSync = (function(e) {
		function t(t) {
			e.apply(n, arguments), h();
		}
		return Object.defineProperty(t, c, { value: e }), t;
	})(n.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
		d(n[s]), R("assert").equal(n[s].length, 0);
	})), global[s] || u(global, n[s]), t.exports = f(a(n)), process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !n.__patched && (t.exports = f(n), n.__patched = !0);
	function f(e) {
		r(e), e.gracefulify = f, e.createReadStream = T, e.createWriteStream = E;
		var t = e.readFile;
		e.readFile = n;
		function n(e, n, r) {
			return typeof n == "function" && (r = n, n = null), i(e, n, r);
			function i(e, n, r, a) {
				return t(e, n, function(t) {
					t && (t.code === "EMFILE" || t.code === "ENFILE") ? p([
						i,
						[
							e,
							n,
							r
						],
						t,
						a || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		var a = e.writeFile;
		e.writeFile = o;
		function o(e, t, n, r) {
			return typeof n == "function" && (r = n, n = null), i(e, t, n, r);
			function i(e, t, n, r, o) {
				return a(e, t, n, function(a) {
					a && (a.code === "EMFILE" || a.code === "ENFILE") ? p([
						i,
						[
							e,
							t,
							n,
							r
						],
						a,
						o || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		var s = e.appendFile;
		s && (e.appendFile = c);
		function c(e, t, n, r) {
			return typeof n == "function" && (r = n, n = null), i(e, t, n, r);
			function i(e, t, n, r, a) {
				return s(e, t, n, function(o) {
					o && (o.code === "EMFILE" || o.code === "ENFILE") ? p([
						i,
						[
							e,
							t,
							n,
							r
						],
						o,
						a || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		var l = e.copyFile;
		l && (e.copyFile = u);
		function u(e, t, n, r) {
			return typeof n == "function" && (r = n, n = 0), i(e, t, n, r);
			function i(e, t, n, r, a) {
				return l(e, t, n, function(o) {
					o && (o.code === "EMFILE" || o.code === "ENFILE") ? p([
						i,
						[
							e,
							t,
							n,
							r
						],
						o,
						a || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		var d = e.readdir;
		e.readdir = h;
		var m = /^v[0-5]\./;
		function h(e, t, n) {
			typeof t == "function" && (n = t, t = null);
			var r = m.test(process.version) ? function(e, t, n, r) {
				return d(e, i(e, t, n, r));
			} : function(e, t, n, r) {
				return d(e, t, i(e, t, n, r));
			};
			return r(e, t, n);
			function i(e, t, n, i) {
				return function(a, o) {
					a && (a.code === "EMFILE" || a.code === "ENFILE") ? p([
						r,
						[
							e,
							t,
							n
						],
						a,
						i || Date.now(),
						Date.now()
					]) : (o && o.sort && o.sort(), typeof n == "function" && n.call(this, a, o));
				};
			}
		}
		if (process.version.substr(0, 4) === "v0.8") {
			var g = i(e);
			x = g.ReadStream, C = g.WriteStream;
		}
		var _ = e.ReadStream;
		_ && (x.prototype = Object.create(_.prototype), x.prototype.open = S);
		var v = e.WriteStream;
		v && (C.prototype = Object.create(v.prototype), C.prototype.open = w), Object.defineProperty(e, "ReadStream", {
			get: function() {
				return x;
			},
			set: function(e) {
				x = e;
			},
			enumerable: !0,
			configurable: !0
		}), Object.defineProperty(e, "WriteStream", {
			get: function() {
				return C;
			},
			set: function(e) {
				C = e;
			},
			enumerable: !0,
			configurable: !0
		});
		var y = x;
		Object.defineProperty(e, "FileReadStream", {
			get: function() {
				return y;
			},
			set: function(e) {
				y = e;
			},
			enumerable: !0,
			configurable: !0
		});
		var b = C;
		Object.defineProperty(e, "FileWriteStream", {
			get: function() {
				return b;
			},
			set: function(e) {
				b = e;
			},
			enumerable: !0,
			configurable: !0
		});
		function x(e, t) {
			return this instanceof x ? (_.apply(this, arguments), this) : x.apply(Object.create(x.prototype), arguments);
		}
		function S() {
			var e = this;
			O(e.path, e.flags, e.mode, function(t, n) {
				t ? (e.autoClose && e.destroy(), e.emit("error", t)) : (e.fd = n, e.emit("open", n), e.read());
			});
		}
		function C(e, t) {
			return this instanceof C ? (v.apply(this, arguments), this) : C.apply(Object.create(C.prototype), arguments);
		}
		function w() {
			var e = this;
			O(e.path, e.flags, e.mode, function(t, n) {
				t ? (e.destroy(), e.emit("error", t)) : (e.fd = n, e.emit("open", n));
			});
		}
		function T(t, n) {
			return new e.ReadStream(t, n);
		}
		function E(t, n) {
			return new e.WriteStream(t, n);
		}
		var D = e.open;
		e.open = O;
		function O(e, t, n, r) {
			return typeof n == "function" && (r = n, n = null), i(e, t, n, r);
			function i(e, t, n, r, a) {
				return D(e, t, n, function(o, s) {
					o && (o.code === "EMFILE" || o.code === "ENFILE") ? p([
						i,
						[
							e,
							t,
							n,
							r
						],
						o,
						a || Date.now(),
						Date.now()
					]) : typeof r == "function" && r.apply(this, arguments);
				});
			}
		}
		return e;
	}
	function p(e) {
		d("ENQUEUE", e[0].name, e[1]), n[s].push(e), g();
	}
	var m;
	function h() {
		for (var e = Date.now(), t = 0; t < n[s].length; ++t) n[s][t].length > 2 && (n[s][t][3] = e, n[s][t][4] = e);
		g();
	}
	function g() {
		if (clearTimeout(m), m = void 0, n[s].length !== 0) {
			var e = n[s].shift(), t = e[0], r = e[1], i = e[2], a = e[3], o = e[4];
			if (a === void 0) d("RETRY", t.name, r), t.apply(null, r);
			else if (Date.now() - a >= 6e4) {
				d("TIMEOUT", t.name, r);
				var c = r.pop();
				typeof c == "function" && c.call(null, i);
			} else {
				var l = Date.now() - o, u = Math.max(o - a, 1);
				l >= Math.min(u * 1.2, 100) ? (d("RETRY", t.name, r), t.apply(null, r.concat([a]))) : n[s].push(e);
			}
			m === void 0 && (m = setTimeout(g, 0));
		}
	}
})), Kt = /* @__PURE__ */ L(((e) => {
	var t = J().fromCallback, n = Y(), r = (/* @__PURE__ */ "access.appendFile.chmod.chown.close.copyFile.fchmod.fchown.fdatasync.fstat.fsync.ftruncate.futimes.lchmod.lchown.link.lstat.mkdir.mkdtemp.open.opendir.readdir.readFile.readlink.realpath.rename.rm.rmdir.stat.symlink.truncate.unlink.utimes.writeFile".split(".")).filter((e) => typeof n[e] == "function");
	Object.assign(e, n), r.forEach((r) => {
		e[r] = t(n[r]);
	}), e.exists = function(e, t) {
		return typeof t == "function" ? n.exists(e, t) : new Promise((t) => n.exists(e, t));
	}, e.read = function(e, t, r, i, a, o) {
		return typeof o == "function" ? n.read(e, t, r, i, a, o) : new Promise((o, s) => {
			n.read(e, t, r, i, a, (e, t, n) => {
				if (e) return s(e);
				o({
					bytesRead: t,
					buffer: n
				});
			});
		});
	}, e.write = function(e, t, ...r) {
		return typeof r[r.length - 1] == "function" ? n.write(e, t, ...r) : new Promise((i, a) => {
			n.write(e, t, ...r, (e, t, n) => {
				if (e) return a(e);
				i({
					bytesWritten: t,
					buffer: n
				});
			});
		});
	}, typeof n.writev == "function" && (e.writev = function(e, t, ...r) {
		return typeof r[r.length - 1] == "function" ? n.writev(e, t, ...r) : new Promise((i, a) => {
			n.writev(e, t, ...r, (e, t, n) => {
				if (e) return a(e);
				i({
					bytesWritten: t,
					buffers: n
				});
			});
		});
	}), typeof n.realpath.native == "function" ? e.realpath.native = t(n.realpath.native) : process.emitWarning("fs.realpath.native is not a function. Is fs being monkey-patched?", "Warning", "fs-extra-WARN0003");
})), qt = /* @__PURE__ */ L(((e, t) => {
	var n = R("path");
	t.exports.checkPath = function(e) {
		if (process.platform === "win32" && /[<>:"|?*]/.test(e.replace(n.parse(e).root, ""))) {
			let t = /* @__PURE__ */ Error(`Path contains invalid characters: ${e}`);
			throw t.code = "EINVAL", t;
		}
	};
})), Jt = /* @__PURE__ */ L(((e, t) => {
	var n = Kt(), { checkPath: r } = qt(), i = (e) => typeof e == "number" ? e : {
		mode: 511,
		...e
	}.mode;
	t.exports.makeDir = async (e, t) => (r(e), n.mkdir(e, {
		mode: i(t),
		recursive: !0
	})), t.exports.makeDirSync = (e, t) => (r(e), n.mkdirSync(e, {
		mode: i(t),
		recursive: !0
	}));
})), Yt = /* @__PURE__ */ L(((e, t) => {
	var n = J().fromPromise, { makeDir: r, makeDirSync: i } = Jt(), a = n(r);
	t.exports = {
		mkdirs: a,
		mkdirsSync: i,
		mkdirp: a,
		mkdirpSync: i,
		ensureDir: a,
		ensureDirSync: i
	};
})), Xt = /* @__PURE__ */ L(((e, t) => {
	var n = J().fromPromise, r = Kt();
	function i(e) {
		return r.access(e).then(() => !0).catch(() => !1);
	}
	t.exports = {
		pathExists: n(i),
		pathExistsSync: r.existsSync
	};
})), Zt = /* @__PURE__ */ L(((e, t) => {
	var n = Y();
	function r(e, t, r, i) {
		n.open(e, "r+", (e, a) => {
			if (e) return i(e);
			n.futimes(a, t, r, (e) => {
				n.close(a, (t) => {
					i && i(e || t);
				});
			});
		});
	}
	function i(e, t, r) {
		let i = n.openSync(e, "r+");
		return n.futimesSync(i, t, r), n.closeSync(i);
	}
	t.exports = {
		utimesMillis: r,
		utimesMillisSync: i
	};
})), Qt = /* @__PURE__ */ L(((e, t) => {
	var n = Kt(), r = R("path"), i = R("util");
	function a(e, t, r) {
		let i = r.dereference ? (e) => n.stat(e, { bigint: !0 }) : (e) => n.lstat(e, { bigint: !0 });
		return Promise.all([i(e), i(t).catch((e) => {
			if (e.code === "ENOENT") return null;
			throw e;
		})]).then(([e, t]) => ({
			srcStat: e,
			destStat: t
		}));
	}
	function o(e, t, r) {
		let i, a = r.dereference ? (e) => n.statSync(e, { bigint: !0 }) : (e) => n.lstatSync(e, { bigint: !0 }), o = a(e);
		try {
			i = a(t);
		} catch (e) {
			if (e.code === "ENOENT") return {
				srcStat: o,
				destStat: null
			};
			throw e;
		}
		return {
			srcStat: o,
			destStat: i
		};
	}
	function s(e, t, n, o, s) {
		i.callbackify(a)(e, t, o, (i, a) => {
			if (i) return s(i);
			let { srcStat: o, destStat: c } = a;
			if (c) {
				if (d(o, c)) {
					let i = r.basename(e), a = r.basename(t);
					return n === "move" && i !== a && i.toLowerCase() === a.toLowerCase() ? s(null, {
						srcStat: o,
						destStat: c,
						isChangingCase: !0
					}) : s(/* @__PURE__ */ Error("Source and destination must not be the same."));
				}
				if (o.isDirectory() && !c.isDirectory()) return s(/* @__PURE__ */ Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
				if (!o.isDirectory() && c.isDirectory()) return s(/* @__PURE__ */ Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
			}
			return o.isDirectory() && f(e, t) ? s(Error(p(e, t, n))) : s(null, {
				srcStat: o,
				destStat: c
			});
		});
	}
	function c(e, t, n, i) {
		let { srcStat: a, destStat: s } = o(e, t, i);
		if (s) {
			if (d(a, s)) {
				let i = r.basename(e), o = r.basename(t);
				if (n === "move" && i !== o && i.toLowerCase() === o.toLowerCase()) return {
					srcStat: a,
					destStat: s,
					isChangingCase: !0
				};
				throw Error("Source and destination must not be the same.");
			}
			if (a.isDirectory() && !s.isDirectory()) throw Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
			if (!a.isDirectory() && s.isDirectory()) throw Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
		}
		if (a.isDirectory() && f(e, t)) throw Error(p(e, t, n));
		return {
			srcStat: a,
			destStat: s
		};
	}
	function l(e, t, i, a, o) {
		let s = r.resolve(r.dirname(e)), c = r.resolve(r.dirname(i));
		if (c === s || c === r.parse(c).root) return o();
		n.stat(c, { bigint: !0 }, (n, r) => n ? n.code === "ENOENT" ? o() : o(n) : d(t, r) ? o(Error(p(e, i, a))) : l(e, t, c, a, o));
	}
	function u(e, t, i, a) {
		let o = r.resolve(r.dirname(e)), s = r.resolve(r.dirname(i));
		if (s === o || s === r.parse(s).root) return;
		let c;
		try {
			c = n.statSync(s, { bigint: !0 });
		} catch (e) {
			if (e.code === "ENOENT") return;
			throw e;
		}
		if (d(t, c)) throw Error(p(e, i, a));
		return u(e, t, s, a);
	}
	function d(e, t) {
		return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
	}
	function f(e, t) {
		let n = r.resolve(e).split(r.sep).filter((e) => e), i = r.resolve(t).split(r.sep).filter((e) => e);
		return n.reduce((e, t, n) => e && i[n] === t, !0);
	}
	function p(e, t, n) {
		return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
	}
	t.exports = {
		checkPaths: s,
		checkPathsSync: c,
		checkParentPaths: l,
		checkParentPathsSync: u,
		isSrcSubdir: f,
		areIdentical: d
	};
})), $t = /* @__PURE__ */ L(((e, t) => {
	var n = Y(), r = R("path"), i = Yt().mkdirs, a = Xt().pathExists, o = Zt().utimesMillis, s = Qt();
	function c(e, t, n, r) {
		typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r ||= function() {}, n ||= {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0001"), s.checkPaths(e, t, "copy", n, (i, a) => {
			if (i) return r(i);
			let { srcStat: o, destStat: c } = a;
			s.checkParentPaths(e, o, t, "copy", (i) => i ? r(i) : n.filter ? u(l, c, e, t, n, r) : l(c, e, t, n, r));
		});
	}
	function l(e, t, n, o, s) {
		let c = r.dirname(n);
		a(c, (r, a) => {
			if (r) return s(r);
			if (a) return f(e, t, n, o, s);
			i(c, (r) => r ? s(r) : f(e, t, n, o, s));
		});
	}
	function u(e, t, n, r, i, a) {
		Promise.resolve(i.filter(n, r)).then((o) => o ? e(t, n, r, i, a) : a(), (e) => a(e));
	}
	function d(e, t, n, r, i) {
		return r.filter ? u(f, e, t, n, r, i) : f(e, t, n, r, i);
	}
	function f(e, t, r, i, a) {
		(i.dereference ? n.stat : n.lstat)(t, (n, o) => n ? a(n) : o.isDirectory() ? S(o, e, t, r, i, a) : o.isFile() || o.isCharacterDevice() || o.isBlockDevice() ? p(o, e, t, r, i, a) : o.isSymbolicLink() ? D(e, t, r, i, a) : o.isSocket() ? a(/* @__PURE__ */ Error(`Cannot copy a socket file: ${t}`)) : o.isFIFO() ? a(/* @__PURE__ */ Error(`Cannot copy a FIFO pipe: ${t}`)) : a(/* @__PURE__ */ Error(`Unknown file: ${t}`)));
	}
	function p(e, t, n, r, i, a) {
		return t ? m(e, n, r, i, a) : h(e, n, r, i, a);
	}
	function m(e, t, r, i, a) {
		if (i.overwrite) n.unlink(r, (n) => n ? a(n) : h(e, t, r, i, a));
		else if (i.errorOnExist) return a(/* @__PURE__ */ Error(`'${r}' already exists`));
		else return a();
	}
	function h(e, t, r, i, a) {
		n.copyFile(t, r, (n) => n ? a(n) : i.preserveTimestamps ? g(e.mode, t, r, a) : b(r, e.mode, a));
	}
	function g(e, t, n, r) {
		return _(e) ? v(n, e, (i) => i ? r(i) : y(e, t, n, r)) : y(e, t, n, r);
	}
	function _(e) {
		return !(e & 128);
	}
	function v(e, t, n) {
		return b(e, t | 128, n);
	}
	function y(e, t, n, r) {
		x(t, n, (t) => t ? r(t) : b(n, e, r));
	}
	function b(e, t, r) {
		return n.chmod(e, t, r);
	}
	function x(e, t, r) {
		n.stat(e, (e, n) => e ? r(e) : o(t, n.atime, n.mtime, r));
	}
	function S(e, t, n, r, i, a) {
		return t ? w(n, r, i, a) : C(e.mode, n, r, i, a);
	}
	function C(e, t, r, i, a) {
		n.mkdir(r, (n) => {
			if (n) return a(n);
			w(t, r, i, (t) => t ? a(t) : b(r, e, a));
		});
	}
	function w(e, t, r, i) {
		n.readdir(e, (n, a) => n ? i(n) : T(a, e, t, r, i));
	}
	function T(e, t, n, r, i) {
		let a = e.pop();
		return a ? E(e, a, t, n, r, i) : i();
	}
	function E(e, t, n, i, a, o) {
		let c = r.join(n, t), l = r.join(i, t);
		s.checkPaths(c, l, "copy", a, (t, r) => {
			if (t) return o(t);
			let { destStat: s } = r;
			d(s, c, l, a, (t) => t ? o(t) : T(e, n, i, a, o));
		});
	}
	function D(e, t, i, a, o) {
		n.readlink(t, (t, c) => {
			if (t) return o(t);
			if (a.dereference && (c = r.resolve(process.cwd(), c)), e) n.readlink(i, (t, l) => t ? t.code === "EINVAL" || t.code === "UNKNOWN" ? n.symlink(c, i, o) : o(t) : (a.dereference && (l = r.resolve(process.cwd(), l)), s.isSrcSubdir(c, l) ? o(/* @__PURE__ */ Error(`Cannot copy '${c}' to a subdirectory of itself, '${l}'.`)) : e.isDirectory() && s.isSrcSubdir(l, c) ? o(/* @__PURE__ */ Error(`Cannot overwrite '${l}' with '${c}'.`)) : O(c, i, o)));
			else return n.symlink(c, i, o);
		});
	}
	function O(e, t, r) {
		n.unlink(t, (i) => i ? r(i) : n.symlink(e, t, r));
	}
	t.exports = c;
})), en = /* @__PURE__ */ L(((e, t) => {
	var n = Y(), r = R("path"), i = Yt().mkdirsSync, a = Zt().utimesMillisSync, o = Qt();
	function s(e, t, n) {
		typeof n == "function" && (n = { filter: n }), n ||= {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning("Using the preserveTimestamps option in 32-bit node is not recommended;\n\n	see https://github.com/jprichardson/node-fs-extra/issues/269", "Warning", "fs-extra-WARN0002");
		let { srcStat: r, destStat: i } = o.checkPathsSync(e, t, "copy", n);
		return o.checkParentPathsSync(e, r, t, "copy"), c(i, e, t, n);
	}
	function c(e, t, a, o) {
		if (o.filter && !o.filter(t, a)) return;
		let s = r.dirname(a);
		return n.existsSync(s) || i(s), u(e, t, a, o);
	}
	function l(e, t, n, r) {
		if (!(r.filter && !r.filter(t, n))) return u(e, t, n, r);
	}
	function u(e, t, r, i) {
		let a = (i.dereference ? n.statSync : n.lstatSync)(t);
		if (a.isDirectory()) return y(a, e, t, r, i);
		if (a.isFile() || a.isCharacterDevice() || a.isBlockDevice()) return d(a, e, t, r, i);
		if (a.isSymbolicLink()) return C(e, t, r, i);
		throw a.isSocket() ? Error(`Cannot copy a socket file: ${t}`) : a.isFIFO() ? Error(`Cannot copy a FIFO pipe: ${t}`) : Error(`Unknown file: ${t}`);
	}
	function d(e, t, n, r, i) {
		return t ? f(e, n, r, i) : p(e, n, r, i);
	}
	function f(e, t, r, i) {
		if (i.overwrite) return n.unlinkSync(r), p(e, t, r, i);
		if (i.errorOnExist) throw Error(`'${r}' already exists`);
	}
	function p(e, t, r, i) {
		return n.copyFileSync(t, r), i.preserveTimestamps && m(e.mode, t, r), _(r, e.mode);
	}
	function m(e, t, n) {
		return h(e) && g(n, e), v(t, n);
	}
	function h(e) {
		return !(e & 128);
	}
	function g(e, t) {
		return _(e, t | 128);
	}
	function _(e, t) {
		return n.chmodSync(e, t);
	}
	function v(e, t) {
		let r = n.statSync(e);
		return a(t, r.atime, r.mtime);
	}
	function y(e, t, n, r, i) {
		return t ? x(n, r, i) : b(e.mode, n, r, i);
	}
	function b(e, t, r, i) {
		return n.mkdirSync(r), x(t, r, i), _(r, e);
	}
	function x(e, t, r) {
		n.readdirSync(e).forEach((n) => S(n, e, t, r));
	}
	function S(e, t, n, i) {
		let a = r.join(t, e), s = r.join(n, e), { destStat: c } = o.checkPathsSync(a, s, "copy", i);
		return l(c, a, s, i);
	}
	function C(e, t, i, a) {
		let s = n.readlinkSync(t);
		if (a.dereference && (s = r.resolve(process.cwd(), s)), e) {
			let e;
			try {
				e = n.readlinkSync(i);
			} catch (e) {
				if (e.code === "EINVAL" || e.code === "UNKNOWN") return n.symlinkSync(s, i);
				throw e;
			}
			if (a.dereference && (e = r.resolve(process.cwd(), e)), o.isSrcSubdir(s, e)) throw Error(`Cannot copy '${s}' to a subdirectory of itself, '${e}'.`);
			if (n.statSync(i).isDirectory() && o.isSrcSubdir(e, s)) throw Error(`Cannot overwrite '${e}' with '${s}'.`);
			return w(s, i);
		}
		return n.symlinkSync(s, i);
	}
	function w(e, t) {
		return n.unlinkSync(t), n.symlinkSync(e, t);
	}
	t.exports = s;
})), tn = /* @__PURE__ */ L(((e, t) => {
	var n = J().fromCallback;
	t.exports = {
		copy: n($t()),
		copySync: en()
	};
})), nn = /* @__PURE__ */ L(((e, t) => {
	var n = Y(), r = R("path"), i = R("assert"), a = process.platform === "win32";
	function o(e) {
		[
			"unlink",
			"chmod",
			"stat",
			"lstat",
			"rmdir",
			"readdir"
		].forEach((t) => {
			e[t] = e[t] || n[t], t += "Sync", e[t] = e[t] || n[t];
		}), e.maxBusyTries = e.maxBusyTries || 3;
	}
	function s(e, t, n) {
		let r = 0;
		typeof t == "function" && (n = t, t = {}), i(e, "rimraf: missing path"), i.strictEqual(typeof e, "string", "rimraf: path should be a string"), i.strictEqual(typeof n, "function", "rimraf: callback function required"), i(t, "rimraf: invalid options argument provided"), i.strictEqual(typeof t, "object", "rimraf: options should be object"), o(t), c(e, t, function i(a) {
			if (a) {
				if ((a.code === "EBUSY" || a.code === "ENOTEMPTY" || a.code === "EPERM") && r < t.maxBusyTries) {
					r++;
					let n = r * 100;
					return setTimeout(() => c(e, t, i), n);
				}
				a.code === "ENOENT" && (a = null);
			}
			n(a);
		});
	}
	function c(e, t, n) {
		i(e), i(t), i(typeof n == "function"), t.lstat(e, (r, i) => {
			if (r && r.code === "ENOENT") return n(null);
			if (r && r.code === "EPERM" && a) return l(e, t, r, n);
			if (i && i.isDirectory()) return d(e, t, r, n);
			t.unlink(e, (r) => {
				if (r) {
					if (r.code === "ENOENT") return n(null);
					if (r.code === "EPERM") return a ? l(e, t, r, n) : d(e, t, r, n);
					if (r.code === "EISDIR") return d(e, t, r, n);
				}
				return n(r);
			});
		});
	}
	function l(e, t, n, r) {
		i(e), i(t), i(typeof r == "function"), t.chmod(e, 438, (i) => {
			i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (i, a) => {
				i ? r(i.code === "ENOENT" ? null : n) : a.isDirectory() ? d(e, t, n, r) : t.unlink(e, r);
			});
		});
	}
	function u(e, t, n) {
		let r;
		i(e), i(t);
		try {
			t.chmodSync(e, 438);
		} catch (e) {
			if (e.code === "ENOENT") return;
			throw n;
		}
		try {
			r = t.statSync(e);
		} catch (e) {
			if (e.code === "ENOENT") return;
			throw n;
		}
		r.isDirectory() ? m(e, t, n) : t.unlinkSync(e);
	}
	function d(e, t, n, r) {
		i(e), i(t), i(typeof r == "function"), t.rmdir(e, (i) => {
			i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? f(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
		});
	}
	function f(e, t, n) {
		i(e), i(t), i(typeof n == "function"), t.readdir(e, (i, a) => {
			if (i) return n(i);
			let o = a.length, c;
			if (o === 0) return t.rmdir(e, n);
			a.forEach((i) => {
				s(r.join(e, i), t, (r) => {
					if (!c) {
						if (r) return n(c = r);
						--o === 0 && t.rmdir(e, n);
					}
				});
			});
		});
	}
	function p(e, t) {
		let n;
		t ||= {}, o(t), i(e, "rimraf: missing path"), i.strictEqual(typeof e, "string", "rimraf: path should be a string"), i(t, "rimraf: missing options"), i.strictEqual(typeof t, "object", "rimraf: options should be object");
		try {
			n = t.lstatSync(e);
		} catch (n) {
			if (n.code === "ENOENT") return;
			n.code === "EPERM" && a && u(e, t, n);
		}
		try {
			n && n.isDirectory() ? m(e, t, null) : t.unlinkSync(e);
		} catch (n) {
			if (n.code === "ENOENT") return;
			if (n.code === "EPERM") return a ? u(e, t, n) : m(e, t, n);
			if (n.code !== "EISDIR") throw n;
			m(e, t, n);
		}
	}
	function m(e, t, n) {
		i(e), i(t);
		try {
			t.rmdirSync(e);
		} catch (r) {
			if (r.code === "ENOTDIR") throw n;
			if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM") h(e, t);
			else if (r.code !== "ENOENT") throw r;
		}
	}
	function h(e, t) {
		if (i(e), i(t), t.readdirSync(e).forEach((n) => p(r.join(e, n), t)), a) {
			let n = Date.now();
			do
				try {
					return t.rmdirSync(e, t);
				} catch {}
			while (Date.now() - n < 500);
		} else return t.rmdirSync(e, t);
	}
	t.exports = s, s.sync = p;
})), rn = /* @__PURE__ */ L(((e, t) => {
	var n = Y(), r = J().fromCallback, i = nn();
	function a(e, t) {
		if (n.rm) return n.rm(e, {
			recursive: !0,
			force: !0
		}, t);
		i(e, t);
	}
	function o(e) {
		if (n.rmSync) return n.rmSync(e, {
			recursive: !0,
			force: !0
		});
		i.sync(e);
	}
	t.exports = {
		remove: r(a),
		removeSync: o
	};
})), an = /* @__PURE__ */ L(((e, t) => {
	var n = J().fromPromise, r = Kt(), i = R("path"), a = Yt(), o = rn(), s = n(async function(e) {
		let t;
		try {
			t = await r.readdir(e);
		} catch {
			return a.mkdirs(e);
		}
		return Promise.all(t.map((t) => o.remove(i.join(e, t))));
	});
	function c(e) {
		let t;
		try {
			t = r.readdirSync(e);
		} catch {
			return a.mkdirsSync(e);
		}
		t.forEach((t) => {
			t = i.join(e, t), o.removeSync(t);
		});
	}
	t.exports = {
		emptyDirSync: c,
		emptydirSync: c,
		emptyDir: s,
		emptydir: s
	};
})), on = /* @__PURE__ */ L(((e, t) => {
	var n = J().fromCallback, r = R("path"), i = Y(), a = Yt();
	function o(e, t) {
		function n() {
			i.writeFile(e, "", (e) => {
				if (e) return t(e);
				t();
			});
		}
		i.stat(e, (o, s) => {
			if (!o && s.isFile()) return t();
			let c = r.dirname(e);
			i.stat(c, (e, r) => {
				if (e) return e.code === "ENOENT" ? a.mkdirs(c, (e) => {
					if (e) return t(e);
					n();
				}) : t(e);
				r.isDirectory() ? n() : i.readdir(c, (e) => {
					if (e) return t(e);
				});
			});
		});
	}
	function s(e) {
		let t;
		try {
			t = i.statSync(e);
		} catch {}
		if (t && t.isFile()) return;
		let n = r.dirname(e);
		try {
			i.statSync(n).isDirectory() || i.readdirSync(n);
		} catch (e) {
			if (e && e.code === "ENOENT") a.mkdirsSync(n);
			else throw e;
		}
		i.writeFileSync(e, "");
	}
	t.exports = {
		createFile: n(o),
		createFileSync: s
	};
})), sn = /* @__PURE__ */ L(((e, t) => {
	var n = J().fromCallback, r = R("path"), i = Y(), a = Yt(), o = Xt().pathExists, { areIdentical: s } = Qt();
	function c(e, t, n) {
		function c(e, t) {
			i.link(e, t, (e) => {
				if (e) return n(e);
				n(null);
			});
		}
		i.lstat(t, (l, u) => {
			i.lstat(e, (i, l) => {
				if (i) return i.message = i.message.replace("lstat", "ensureLink"), n(i);
				if (u && s(l, u)) return n(null);
				let d = r.dirname(t);
				o(d, (r, i) => {
					if (r) return n(r);
					if (i) return c(e, t);
					a.mkdirs(d, (r) => {
						if (r) return n(r);
						c(e, t);
					});
				});
			});
		});
	}
	function l(e, t) {
		let n;
		try {
			n = i.lstatSync(t);
		} catch {}
		try {
			let t = i.lstatSync(e);
			if (n && s(t, n)) return;
		} catch (e) {
			throw e.message = e.message.replace("lstat", "ensureLink"), e;
		}
		let o = r.dirname(t);
		return i.existsSync(o) || a.mkdirsSync(o), i.linkSync(e, t);
	}
	t.exports = {
		createLink: n(c),
		createLinkSync: l
	};
})), cn = /* @__PURE__ */ L(((e, t) => {
	var n = R("path"), r = Y(), i = Xt().pathExists;
	function a(e, t, a) {
		if (n.isAbsolute(e)) return r.lstat(e, (t) => t ? (t.message = t.message.replace("lstat", "ensureSymlink"), a(t)) : a(null, {
			toCwd: e,
			toDst: e
		}));
		{
			let o = n.dirname(t), s = n.join(o, e);
			return i(s, (t, i) => t ? a(t) : i ? a(null, {
				toCwd: s,
				toDst: e
			}) : r.lstat(e, (t) => t ? (t.message = t.message.replace("lstat", "ensureSymlink"), a(t)) : a(null, {
				toCwd: e,
				toDst: n.relative(o, e)
			})));
		}
	}
	function o(e, t) {
		let i;
		if (n.isAbsolute(e)) {
			if (i = r.existsSync(e), !i) throw Error("absolute srcpath does not exist");
			return {
				toCwd: e,
				toDst: e
			};
		}
		{
			let a = n.dirname(t), o = n.join(a, e);
			if (i = r.existsSync(o), i) return {
				toCwd: o,
				toDst: e
			};
			if (i = r.existsSync(e), !i) throw Error("relative srcpath does not exist");
			return {
				toCwd: e,
				toDst: n.relative(a, e)
			};
		}
	}
	t.exports = {
		symlinkPaths: a,
		symlinkPathsSync: o
	};
})), ln = /* @__PURE__ */ L(((e, t) => {
	var n = Y();
	function r(e, t, r) {
		if (r = typeof t == "function" ? t : r, t = typeof t != "function" && t, t) return r(null, t);
		n.lstat(e, (e, n) => {
			if (e) return r(null, "file");
			t = n && n.isDirectory() ? "dir" : "file", r(null, t);
		});
	}
	function i(e, t) {
		let r;
		if (t) return t;
		try {
			r = n.lstatSync(e);
		} catch {
			return "file";
		}
		return r && r.isDirectory() ? "dir" : "file";
	}
	t.exports = {
		symlinkType: r,
		symlinkTypeSync: i
	};
})), un = /* @__PURE__ */ L(((e, t) => {
	var n = J().fromCallback, r = R("path"), i = Kt(), a = Yt(), o = a.mkdirs, s = a.mkdirsSync, c = cn(), l = c.symlinkPaths, u = c.symlinkPathsSync, d = ln(), f = d.symlinkType, p = d.symlinkTypeSync, m = Xt().pathExists, { areIdentical: h } = Qt();
	function g(e, t, n, r) {
		r = typeof n == "function" ? n : r, n = typeof n != "function" && n, i.lstat(t, (a, o) => {
			!a && o.isSymbolicLink() ? Promise.all([i.stat(e), i.stat(t)]).then(([i, a]) => {
				if (h(i, a)) return r(null);
				_(e, t, n, r);
			}) : _(e, t, n, r);
		});
	}
	function _(e, t, n, a) {
		l(e, t, (s, c) => {
			if (s) return a(s);
			e = c.toDst, f(c.toCwd, n, (n, s) => {
				if (n) return a(n);
				let c = r.dirname(t);
				m(c, (n, r) => {
					if (n) return a(n);
					if (r) return i.symlink(e, t, s, a);
					o(c, (n) => {
						if (n) return a(n);
						i.symlink(e, t, s, a);
					});
				});
			});
		});
	}
	function v(e, t, n) {
		let a;
		try {
			a = i.lstatSync(t);
		} catch {}
		if (a && a.isSymbolicLink() && h(i.statSync(e), i.statSync(t))) return;
		let o = u(e, t);
		e = o.toDst, n = p(o.toCwd, n);
		let c = r.dirname(t);
		return i.existsSync(c) || s(c), i.symlinkSync(e, t, n);
	}
	t.exports = {
		createSymlink: n(g),
		createSymlinkSync: v
	};
})), dn = /* @__PURE__ */ L(((e, t) => {
	var { createFile: n, createFileSync: r } = on(), { createLink: i, createLinkSync: a } = sn(), { createSymlink: o, createSymlinkSync: s } = un();
	t.exports = {
		createFile: n,
		createFileSync: r,
		ensureFile: n,
		ensureFileSync: r,
		createLink: i,
		createLinkSync: a,
		ensureLink: i,
		ensureLinkSync: a,
		createSymlink: o,
		createSymlinkSync: s,
		ensureSymlink: o,
		ensureSymlinkSync: s
	};
})), fn = /* @__PURE__ */ L(((e, t) => {
	function n(e, { EOL: t = "\n", finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
		let a = n ? t : "", o = JSON.stringify(e, r, i);
		if (o === void 0) throw TypeError(`Converting ${typeof e} value to JSON is not supported`);
		return o.replace(/\n/g, t) + a;
	}
	function r(e) {
		return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
	}
	t.exports = {
		stringify: n,
		stripBom: r
	};
})), pn = /* @__PURE__ */ L(((e, t) => {
	var n;
	try {
		n = Y();
	} catch {
		n = R("fs");
	}
	var r = J(), { stringify: i, stripBom: a } = fn();
	async function o(e, t = {}) {
		typeof t == "string" && (t = { encoding: t });
		let i = t.fs || n, o = "throws" in t ? t.throws : !0, s = await r.fromCallback(i.readFile)(e, t);
		s = a(s);
		let c;
		try {
			c = JSON.parse(s, t ? t.reviver : null);
		} catch (t) {
			if (o) throw t.message = `${e}: ${t.message}`, t;
			return null;
		}
		return c;
	}
	var s = r.fromPromise(o);
	function c(e, t = {}) {
		typeof t == "string" && (t = { encoding: t });
		let r = t.fs || n, i = "throws" in t ? t.throws : !0;
		try {
			let n = r.readFileSync(e, t);
			return n = a(n), JSON.parse(n, t.reviver);
		} catch (t) {
			if (i) throw t.message = `${e}: ${t.message}`, t;
			return null;
		}
	}
	async function l(e, t, a = {}) {
		let o = a.fs || n, s = i(t, a);
		await r.fromCallback(o.writeFile)(e, s, a);
	}
	var u = r.fromPromise(l);
	function d(e, t, r = {}) {
		let a = r.fs || n, o = i(t, r);
		return a.writeFileSync(e, o, r);
	}
	t.exports = {
		readFile: s,
		readFileSync: c,
		writeFile: u,
		writeFileSync: d
	};
})), mn = /* @__PURE__ */ L(((e, t) => {
	var n = pn();
	t.exports = {
		readJson: n.readFile,
		readJsonSync: n.readFileSync,
		writeJson: n.writeFile,
		writeJsonSync: n.writeFileSync
	};
})), hn = /* @__PURE__ */ L(((e, t) => {
	var n = J().fromCallback, r = Y(), i = R("path"), a = Yt(), o = Xt().pathExists;
	function s(e, t, n, s) {
		typeof n == "function" && (s = n, n = "utf8");
		let c = i.dirname(e);
		o(c, (i, o) => {
			if (i) return s(i);
			if (o) return r.writeFile(e, t, n, s);
			a.mkdirs(c, (i) => {
				if (i) return s(i);
				r.writeFile(e, t, n, s);
			});
		});
	}
	function c(e, ...t) {
		let n = i.dirname(e);
		if (r.existsSync(n)) return r.writeFileSync(e, ...t);
		a.mkdirsSync(n), r.writeFileSync(e, ...t);
	}
	t.exports = {
		outputFile: n(s),
		outputFileSync: c
	};
})), gn = /* @__PURE__ */ L(((e, t) => {
	var { stringify: n } = fn(), { outputFile: r } = hn();
	async function i(e, t, i = {}) {
		await r(e, n(t, i), i);
	}
	t.exports = i;
})), _n = /* @__PURE__ */ L(((e, t) => {
	var { stringify: n } = fn(), { outputFileSync: r } = hn();
	function i(e, t, i) {
		r(e, n(t, i), i);
	}
	t.exports = i;
})), vn = /* @__PURE__ */ L(((e, t) => {
	var n = J().fromPromise, r = mn();
	r.outputJson = n(gn()), r.outputJsonSync = _n(), r.outputJSON = r.outputJson, r.outputJSONSync = r.outputJsonSync, r.writeJSON = r.writeJson, r.writeJSONSync = r.writeJsonSync, r.readJSON = r.readJson, r.readJSONSync = r.readJsonSync, t.exports = r;
})), yn = /* @__PURE__ */ L(((e, t) => {
	var n = Y(), r = R("path"), i = tn().copy, a = rn().remove, o = Yt().mkdirp, s = Xt().pathExists, c = Qt();
	function l(e, t, n, i) {
		typeof n == "function" && (i = n, n = {}), n ||= {};
		let a = n.overwrite || n.clobber || !1;
		c.checkPaths(e, t, "move", n, (n, s) => {
			if (n) return i(n);
			let { srcStat: l, isChangingCase: f = !1 } = s;
			c.checkParentPaths(e, l, t, "move", (n) => {
				if (n) return i(n);
				if (u(t)) return d(e, t, a, f, i);
				o(r.dirname(t), (n) => n ? i(n) : d(e, t, a, f, i));
			});
		});
	}
	function u(e) {
		let t = r.dirname(e);
		return r.parse(t).root === t;
	}
	function d(e, t, n, r, i) {
		if (r) return f(e, t, n, i);
		if (n) return a(t, (r) => r ? i(r) : f(e, t, n, i));
		s(t, (r, a) => r ? i(r) : a ? i(/* @__PURE__ */ Error("dest already exists.")) : f(e, t, n, i));
	}
	function f(e, t, r, i) {
		n.rename(e, t, (n) => n ? n.code === "EXDEV" ? p(e, t, r, i) : i(n) : i());
	}
	function p(e, t, n, r) {
		i(e, t, {
			overwrite: n,
			errorOnExist: !0
		}, (t) => t ? r(t) : a(e, r));
	}
	t.exports = l;
})), bn = /* @__PURE__ */ L(((e, t) => {
	var n = Y(), r = R("path"), i = tn().copySync, a = rn().removeSync, o = Yt().mkdirpSync, s = Qt();
	function c(e, t, n) {
		n ||= {};
		let i = n.overwrite || n.clobber || !1, { srcStat: a, isChangingCase: c = !1 } = s.checkPathsSync(e, t, "move", n);
		return s.checkParentPathsSync(e, a, t, "move"), l(t) || o(r.dirname(t)), u(e, t, i, c);
	}
	function l(e) {
		let t = r.dirname(e);
		return r.parse(t).root === t;
	}
	function u(e, t, r, i) {
		if (i) return d(e, t, r);
		if (r) return a(t), d(e, t, r);
		if (n.existsSync(t)) throw Error("dest already exists.");
		return d(e, t, r);
	}
	function d(e, t, r) {
		try {
			n.renameSync(e, t);
		} catch (n) {
			if (n.code !== "EXDEV") throw n;
			return f(e, t, r);
		}
	}
	function f(e, t, n) {
		return i(e, t, {
			overwrite: n,
			errorOnExist: !0
		}), a(e);
	}
	t.exports = c;
})), xn = /* @__PURE__ */ L(((e, t) => {
	var n = J().fromCallback;
	t.exports = {
		move: n(yn()),
		moveSync: bn()
	};
})), Sn = /* @__PURE__ */ L(((e, t) => {
	t.exports = {
		...Kt(),
		...tn(),
		...an(),
		...dn(),
		...vn(),
		...Yt(),
		...xn(),
		...hn(),
		...Xt(),
		...rn()
	};
})), Cn = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.CancellationError = e.CancellationToken = void 0;
	var t = R("events");
	e.CancellationToken = class extends t.EventEmitter {
		get cancelled() {
			return this._cancelled || this._parent != null && this._parent.cancelled;
		}
		set parent(e) {
			this.removeParentCancelHandler(), this._parent = e, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
		}
		constructor(e) {
			super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, e != null && (this.parent = e);
		}
		cancel() {
			this._cancelled = !0, this.emit("cancel");
		}
		onCancel(e) {
			this.cancelled ? e() : this.once("cancel", e);
		}
		createPromise(e) {
			if (this.cancelled) return Promise.reject(new n());
			let t = () => {
				if (r != null) try {
					this.removeListener("cancel", r), r = null;
				} catch {}
			}, r = null;
			return new Promise((t, i) => {
				let a = null;
				if (r = () => {
					try {
						a != null && (a(), a = null);
					} finally {
						i(new n());
					}
				}, this.cancelled) {
					r();
					return;
				}
				this.onCancel(r), e(t, i, (e) => {
					a = e;
				});
			}).then((e) => (t(), e)).catch((e) => {
				throw t(), e;
			});
		}
		removeParentCancelHandler() {
			let e = this._parent;
			e != null && this.parentCancelHandler != null && (e.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
		}
		dispose() {
			try {
				this.removeParentCancelHandler();
			} finally {
				this.removeAllListeners(), this._parent = null;
			}
		}
	};
	var n = class extends Error {
		constructor() {
			super("cancelled");
		}
	};
	e.CancellationError = n;
})), wn = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.newError = t;
	function t(e, t) {
		let n = Error(e);
		return n.code = t, n;
	}
})), Tn = /* @__PURE__ */ L(((e, t) => {
	var n = 1e3, r = n * 60, i = r * 60, a = i * 24, o = a * 7, s = a * 365.25;
	t.exports = function(e, t) {
		t ||= {};
		var n = typeof e;
		if (n === "string" && e.length > 0) return c(e);
		if (n === "number" && isFinite(e)) return t.long ? u(e) : l(e);
		throw Error("val is not a non-empty string or a valid number. val=" + JSON.stringify(e));
	};
	function c(e) {
		if (e = String(e), !(e.length > 100)) {
			var t = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(e);
			if (t) {
				var c = parseFloat(t[1]);
				switch ((t[2] || "ms").toLowerCase()) {
					case "years":
					case "year":
					case "yrs":
					case "yr":
					case "y": return c * s;
					case "weeks":
					case "week":
					case "w": return c * o;
					case "days":
					case "day":
					case "d": return c * a;
					case "hours":
					case "hour":
					case "hrs":
					case "hr":
					case "h": return c * i;
					case "minutes":
					case "minute":
					case "mins":
					case "min":
					case "m": return c * r;
					case "seconds":
					case "second":
					case "secs":
					case "sec":
					case "s": return c * n;
					case "milliseconds":
					case "millisecond":
					case "msecs":
					case "msec":
					case "ms": return c;
					default: return;
				}
			}
		}
	}
	function l(e) {
		var t = Math.abs(e);
		return t >= a ? Math.round(e / a) + "d" : t >= i ? Math.round(e / i) + "h" : t >= r ? Math.round(e / r) + "m" : t >= n ? Math.round(e / n) + "s" : e + "ms";
	}
	function u(e) {
		var t = Math.abs(e);
		return t >= a ? d(e, t, a, "day") : t >= i ? d(e, t, i, "hour") : t >= r ? d(e, t, r, "minute") : t >= n ? d(e, t, n, "second") : e + " ms";
	}
	function d(e, t, n, r) {
		var i = t >= n * 1.5;
		return Math.round(e / n) + " " + r + (i ? "s" : "");
	}
})), En = /* @__PURE__ */ L(((e, t) => {
	function n(e) {
		n.debug = n, n.default = n, n.coerce = c, n.disable = o, n.enable = i, n.enabled = s, n.humanize = Tn(), n.destroy = l, Object.keys(e).forEach((t) => {
			n[t] = e[t];
		}), n.names = [], n.skips = [], n.formatters = {};
		function t(e) {
			let t = 0;
			for (let n = 0; n < e.length; n++) t = (t << 5) - t + e.charCodeAt(n), t |= 0;
			return n.colors[Math.abs(t) % n.colors.length];
		}
		n.selectColor = t;
		function n(e) {
			let t, i = null, a, o;
			function s(...e) {
				if (!s.enabled) return;
				let r = s, i = Number(/* @__PURE__ */ new Date());
				r.diff = i - (t || i), r.prev = t, r.curr = i, t = i, e[0] = n.coerce(e[0]), typeof e[0] != "string" && e.unshift("%O");
				let a = 0;
				e[0] = e[0].replace(/%([a-zA-Z%])/g, (t, i) => {
					if (t === "%%") return "%";
					a++;
					let o = n.formatters[i];
					if (typeof o == "function") {
						let n = e[a];
						t = o.call(r, n), e.splice(a, 1), a--;
					}
					return t;
				}), n.formatArgs.call(r, e), (r.log || n.log).apply(r, e);
			}
			return s.namespace = e, s.useColors = n.useColors(), s.color = n.selectColor(e), s.extend = r, s.destroy = n.destroy, Object.defineProperty(s, "enabled", {
				enumerable: !0,
				configurable: !1,
				get: () => i === null ? (a !== n.namespaces && (a = n.namespaces, o = n.enabled(e)), o) : i,
				set: (e) => {
					i = e;
				}
			}), typeof n.init == "function" && n.init(s), s;
		}
		function r(e, t) {
			let r = n(this.namespace + (t === void 0 ? ":" : t) + e);
			return r.log = this.log, r;
		}
		function i(e) {
			n.save(e), n.namespaces = e, n.names = [], n.skips = [];
			let t = (typeof e == "string" ? e : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
			for (let e of t) e[0] === "-" ? n.skips.push(e.slice(1)) : n.names.push(e);
		}
		function a(e, t) {
			let n = 0, r = 0, i = -1, a = 0;
			for (; n < e.length;) if (r < t.length && (t[r] === e[n] || t[r] === "*")) t[r] === "*" ? (i = r, a = n, r++) : (n++, r++);
			else if (i !== -1) r = i + 1, a++, n = a;
			else return !1;
			for (; r < t.length && t[r] === "*";) r++;
			return r === t.length;
		}
		function o() {
			let e = [...n.names, ...n.skips.map((e) => "-" + e)].join(",");
			return n.enable(""), e;
		}
		function s(e) {
			for (let t of n.skips) if (a(e, t)) return !1;
			for (let t of n.names) if (a(e, t)) return !0;
			return !1;
		}
		function c(e) {
			return e instanceof Error ? e.stack || e.message : e;
		}
		function l() {
			console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
		}
		return n.enable(n.load()), n;
	}
	t.exports = n;
})), Dn = /* @__PURE__ */ L(((e, t) => {
	e.formatArgs = r, e.save = i, e.load = a, e.useColors = n, e.storage = o(), e.destroy = (() => {
		let e = !1;
		return () => {
			e || (e = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
		};
	})(), e.colors = /* @__PURE__ */ "#0000CC.#0000FF.#0033CC.#0033FF.#0066CC.#0066FF.#0099CC.#0099FF.#00CC00.#00CC33.#00CC66.#00CC99.#00CCCC.#00CCFF.#3300CC.#3300FF.#3333CC.#3333FF.#3366CC.#3366FF.#3399CC.#3399FF.#33CC00.#33CC33.#33CC66.#33CC99.#33CCCC.#33CCFF.#6600CC.#6600FF.#6633CC.#6633FF.#66CC00.#66CC33.#9900CC.#9900FF.#9933CC.#9933FF.#99CC00.#99CC33.#CC0000.#CC0033.#CC0066.#CC0099.#CC00CC.#CC00FF.#CC3300.#CC3333.#CC3366.#CC3399.#CC33CC.#CC33FF.#CC6600.#CC6633.#CC9900.#CC9933.#CCCC00.#CCCC33.#FF0000.#FF0033.#FF0066.#FF0099.#FF00CC.#FF00FF.#FF3300.#FF3333.#FF3366.#FF3399.#FF33CC.#FF33FF.#FF6600.#FF6633.#FF9900.#FF9933.#FFCC00.#FFCC33".split(".");
	function n() {
		if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) return !0;
		if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) return !1;
		let e;
		return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || typeof navigator < "u" && navigator.userAgent && (e = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(e[1], 10) >= 31 || typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
	}
	function r(e) {
		if (e[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + e[0] + (this.useColors ? "%c " : " ") + "+" + t.exports.humanize(this.diff), !this.useColors) return;
		let n = "color: " + this.color;
		e.splice(1, 0, n, "color: inherit");
		let r = 0, i = 0;
		e[0].replace(/%[a-zA-Z%]/g, (e) => {
			e !== "%%" && (r++, e === "%c" && (i = r));
		}), e.splice(i, 0, n);
	}
	e.log = console.debug || console.log || (() => {});
	function i(t) {
		try {
			t ? e.storage.setItem("debug", t) : e.storage.removeItem("debug");
		} catch {}
	}
	function a() {
		let t;
		try {
			t = e.storage.getItem("debug") || e.storage.getItem("DEBUG");
		} catch {}
		return !t && typeof process < "u" && "env" in process && (t = process.env.DEBUG), t;
	}
	function o() {
		try {
			return localStorage;
		} catch {}
	}
	t.exports = En()(e);
	var { formatters: s } = t.exports;
	s.j = function(e) {
		try {
			return JSON.stringify(e);
		} catch (e) {
			return "[UnexpectedJSONParseError]: " + e.message;
		}
	};
})), On = /* @__PURE__ */ L(((e, t) => {
	t.exports = (e, t = process.argv) => {
		let n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
		return r !== -1 && (i === -1 || r < i);
	};
})), kn = /* @__PURE__ */ L(((e, t) => {
	var n = R("os"), r = R("tty"), i = On(), { env: a } = process, o;
	i("no-color") || i("no-colors") || i("color=false") || i("color=never") ? o = 0 : (i("color") || i("colors") || i("color=true") || i("color=always")) && (o = 1), "FORCE_COLOR" in a && (o = a.FORCE_COLOR === "true" ? 1 : a.FORCE_COLOR === "false" ? 0 : a.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(a.FORCE_COLOR, 10), 3));
	function s(e) {
		return e !== 0 && {
			level: e,
			hasBasic: !0,
			has256: e >= 2,
			has16m: e >= 3
		};
	}
	function c(e, t) {
		if (o === 0) return 0;
		if (i("color=16m") || i("color=full") || i("color=truecolor")) return 3;
		if (i("color=256")) return 2;
		if (e && !t && o === void 0) return 0;
		let r = o || 0;
		if (a.TERM === "dumb") return r;
		if (process.platform === "win32") {
			let e = n.release().split(".");
			return Number(e[0]) >= 10 && Number(e[2]) >= 10586 ? Number(e[2]) >= 14931 ? 3 : 2 : 1;
		}
		if ("CI" in a) return [
			"TRAVIS",
			"CIRCLECI",
			"APPVEYOR",
			"GITLAB_CI",
			"GITHUB_ACTIONS",
			"BUILDKITE"
		].some((e) => e in a) || a.CI_NAME === "codeship" ? 1 : r;
		if ("TEAMCITY_VERSION" in a) return +!!/^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(a.TEAMCITY_VERSION);
		if (a.COLORTERM === "truecolor") return 3;
		if ("TERM_PROGRAM" in a) {
			let e = parseInt((a.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
			switch (a.TERM_PROGRAM) {
				case "iTerm.app": return e >= 3 ? 3 : 2;
				case "Apple_Terminal": return 2;
			}
		}
		return /-256(color)?$/i.test(a.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(a.TERM) || "COLORTERM" in a ? 1 : r;
	}
	function l(e) {
		return s(c(e, e && e.isTTY));
	}
	t.exports = {
		supportsColor: l,
		stdout: s(c(!0, r.isatty(1))),
		stderr: s(c(!0, r.isatty(2)))
	};
})), An = /* @__PURE__ */ L(((e, t) => {
	var n = R("tty"), r = R("util");
	e.init = u, e.log = s, e.formatArgs = a, e.save = c, e.load = l, e.useColors = i, e.destroy = r.deprecate(() => {}, "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."), e.colors = [
		6,
		2,
		3,
		4,
		5,
		1
	];
	try {
		let t = kn();
		t && (t.stderr || t).level >= 2 && (e.colors = [
			20,
			21,
			26,
			27,
			32,
			33,
			38,
			39,
			40,
			41,
			42,
			43,
			44,
			45,
			56,
			57,
			62,
			63,
			68,
			69,
			74,
			75,
			76,
			77,
			78,
			79,
			80,
			81,
			92,
			93,
			98,
			99,
			112,
			113,
			128,
			129,
			134,
			135,
			148,
			149,
			160,
			161,
			162,
			163,
			164,
			165,
			166,
			167,
			168,
			169,
			170,
			171,
			172,
			173,
			178,
			179,
			184,
			185,
			196,
			197,
			198,
			199,
			200,
			201,
			202,
			203,
			204,
			205,
			206,
			207,
			208,
			209,
			214,
			215,
			220,
			221
		]);
	} catch {}
	e.inspectOpts = Object.keys(process.env).filter((e) => /^debug_/i.test(e)).reduce((e, t) => {
		let n = t.substring(6).toLowerCase().replace(/_([a-z])/g, (e, t) => t.toUpperCase()), r = process.env[t];
		return r = /^(yes|on|true|enabled)$/i.test(r) ? !0 : /^(no|off|false|disabled)$/i.test(r) ? !1 : r === "null" ? null : Number(r), e[n] = r, e;
	}, {});
	function i() {
		return "colors" in e.inspectOpts ? !!e.inspectOpts.colors : n.isatty(process.stderr.fd);
	}
	function a(e) {
		let { namespace: n, useColors: r } = this;
		if (r) {
			let r = this.color, i = "\x1B[3" + (r < 8 ? r : "8;5;" + r), a = `  ${i};1m${n} \u001B[0m`;
			e[0] = a + e[0].split("\n").join("\n" + a), e.push(i + "m+" + t.exports.humanize(this.diff) + "\x1B[0m");
		} else e[0] = o() + n + " " + e[0];
	}
	function o() {
		return e.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
	}
	function s(...t) {
		return process.stderr.write(r.formatWithOptions(e.inspectOpts, ...t) + "\n");
	}
	function c(e) {
		e ? process.env.DEBUG = e : delete process.env.DEBUG;
	}
	function l() {
		return process.env.DEBUG;
	}
	function u(t) {
		t.inspectOpts = {};
		let n = Object.keys(e.inspectOpts);
		for (let r = 0; r < n.length; r++) t.inspectOpts[n[r]] = e.inspectOpts[n[r]];
	}
	t.exports = En()(e);
	var { formatters: d } = t.exports;
	d.o = function(e) {
		return this.inspectOpts.colors = this.useColors, r.inspect(e, this.inspectOpts).split("\n").map((e) => e.trim()).join(" ");
	}, d.O = function(e) {
		return this.inspectOpts.colors = this.useColors, r.inspect(e, this.inspectOpts);
	};
})), jn = /* @__PURE__ */ L(((e, t) => {
	t.exports = typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Dn() : An();
})), Mn = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ProgressCallbackTransform = void 0;
	var t = R("stream");
	e.ProgressCallbackTransform = class extends t.Transform {
		constructor(e, t, n) {
			super(), this.total = e, this.cancellationToken = t, this.onProgress = n, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
		}
		_transform(e, t, n) {
			if (this.cancellationToken.cancelled) {
				n(/* @__PURE__ */ Error("cancelled"), null);
				return;
			}
			this.transferred += e.length, this.delta += e.length;
			let r = Date.now();
			r >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = r + 1e3, this.onProgress({
				total: this.total,
				delta: this.delta,
				transferred: this.transferred,
				percent: this.transferred / this.total * 100,
				bytesPerSecond: Math.round(this.transferred / ((r - this.start) / 1e3))
			}), this.delta = 0), n(null, e);
		}
		_flush(e) {
			if (this.cancellationToken.cancelled) {
				e(/* @__PURE__ */ Error("cancelled"));
				return;
			}
			this.onProgress({
				total: this.total,
				delta: this.delta,
				transferred: this.total,
				percent: 100,
				bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
			}), this.delta = 0, e(null);
		}
	};
})), Nn = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.DigestTransform = e.HttpExecutor = e.HttpError = void 0, e.addSensitiveRedirectHeader = m, e.addSensitiveFieldPattern = h, e.createHttpError = g, e.parseJson = y, e.configureRequestOptionsFromUrl = x, e.configureRequestUrl = S, e.safeGetHeader = T, e.configureRequestOptions = D, e.isSensitiveFieldName = O, e.hashSensitiveValue = k, e.safeStringifyJson = A;
	var t = R("crypto"), n = jn(), r = R("fs"), i = R("stream"), a = R("url"), o = Cn(), s = wn(), c = Mn(), l = (0, n.default)("electron-builder"), u = (e) => e.toLowerCase().replace(/[-_]/g, ""), d = /* @__PURE__ */ new Set([
		"authorization",
		"proxyauthorization",
		"privatetoken",
		"xapikey",
		"xauthtoken",
		"xaccesstoken",
		"xgitlabtoken",
		"cookie",
		"xcsrftoken"
	]), f = [
		"token",
		"password",
		"secret",
		"authorization",
		"credential",
		"apikey",
		"passphrase",
		"auth"
	], p = ["key"];
	function m(e) {
		d.add(u(e));
	}
	function h(e) {
		f.push(e.toLowerCase().replace(/[-_]/g, ""));
	}
	function g(e, t = null) {
		return new v(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : "\n" + JSON.stringify(t, null, "  ")) + "\nHeaders: " + A(e.headers), t);
	}
	var _ = /* @__PURE__ */ new Map([
		[429, "Too many requests"],
		[400, "Bad request"],
		[403, "Forbidden"],
		[404, "Not found"],
		[405, "Method not allowed"],
		[406, "Not acceptable"],
		[408, "Request timeout"],
		[413, "Request entity too large"],
		[500, "Internal server error"],
		[502, "Bad gateway"],
		[503, "Service unavailable"],
		[504, "Gateway timeout"],
		[505, "HTTP version not supported"]
	]), v = class extends Error {
		constructor(e, t = `HTTP error: ${_.get(e) || e}`, n = null) {
			super(t), this.statusCode = e, this.description = n, this.name = "HttpError", this.code = `HTTP_ERROR_${e}`;
		}
		isServerError() {
			return this.statusCode >= 500 && this.statusCode <= 599;
		}
	};
	e.HttpError = v;
	function y(e) {
		return e.then((e) => e == null || e.length === 0 ? null : JSON.parse(e));
	}
	e.HttpExecutor = class e {
		constructor() {
			this.maxRedirects = 10;
		}
		request(e, t = new o.CancellationToken(), n) {
			D(e);
			let r = n == null ? void 0 : JSON.stringify(n), i = r ? Buffer.from(r) : void 0;
			if (i != null) {
				l.enabled && l(A(n));
				let { headers: t, ...r } = e;
				e = {
					method: "post",
					headers: {
						"Content-Type": "application/json",
						"Content-Length": i.length,
						...t
					},
					...r
				};
			}
			return this.doApiRequest(e, t, (e) => e.end(i));
		}
		doApiRequest(e, t, n, r = 0) {
			if (l.enabled) {
				let { headers: t, auth: n, ...r } = e;
				l(`Request: ${A(r)}`);
			}
			return t.createPromise((i, a, o) => {
				let s = this.createRequest(e, (o) => {
					try {
						this.handleResponse(o, e, t, i, a, r, n);
					} catch (e) {
						a(e);
					}
				});
				this.addErrorAndTimeoutHandlers(s, a, e.timeout), this.addRedirectHandlers(s, e, a, r, (e) => {
					this.doApiRequest(e, t, n, r).then(i).catch(a);
				}), n(s, a), o(() => s.abort());
			});
		}
		addRedirectHandlers(e, t, n, r, i) {}
		addErrorAndTimeoutHandlers(e, t, n = 6e4) {
			this.addTimeOutHandler(e, t, n), e.on("error", t), e.on("aborted", () => {
				t(/* @__PURE__ */ Error("Request has been aborted by the server"));
			});
		}
		handleResponse(t, n, r, i, a, o, s) {
			if (l.enabled) {
				let { headers: e, auth: r, ...i } = n;
				l(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${A(i)}`);
			}
			if (t.statusCode === 404) {
				a(g(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
				return;
			}
			if (t.statusCode === 204) {
				i();
				return;
			}
			let c = t.statusCode ?? 0, u = c >= 300 && c < 400, d = T(t, "location");
			if (u && d != null) {
				if (o > this.maxRedirects) {
					a(this.createMaxRedirectError());
					return;
				}
				this.doApiRequest(e.prepareRedirectUrlOptions(d, n), r, s, o).then(i).catch(a);
				return;
			}
			t.setEncoding("utf8");
			let f = "";
			t.on("error", a), t.on("data", (e) => f += e), t.on("end", () => {
				try {
					if (t.statusCode != null && t.statusCode >= 400) {
						let e = T(t, "content-type"), r = e != null && (Array.isArray(e) ? e.find((e) => e.includes("json")) != null : e.includes("json"));
						a(g(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

          Data:
          ${r ? A(JSON.parse(f)) : f}
          `));
					} else i(f.length === 0 ? null : f);
				} catch (e) {
					a(e);
				}
			});
		}
		async downloadToBuffer(e, t) {
			return await t.cancellationToken.createPromise((n, r, i) => {
				let a = [], o = {
					headers: t.headers || void 0,
					redirect: "manual"
				};
				S(e, o), D(o), this.doDownload(o, {
					destination: null,
					options: t,
					onCancel: i,
					callback: (e) => {
						e == null ? n(Buffer.concat(a)) : r(e);
					},
					responseHandler: (e, t) => {
						let n = 0;
						e.on("data", (e) => {
							if (n += e.length, n > 524288e3) {
								t(/* @__PURE__ */ Error("Maximum allowed size is 500 MB"));
								return;
							}
							a.push(e);
						}), e.on("end", () => {
							t(null);
						});
					}
				}, 0);
			});
		}
		doDownload(t, n, r) {
			let i = this.createRequest(t, (i) => {
				if (i.statusCode >= 400) {
					n.callback(/* @__PURE__ */ Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${i.statusCode}: ${i.statusMessage}`));
					return;
				}
				i.on("error", n.callback);
				let a = T(i, "location");
				if (a != null) {
					r < this.maxRedirects ? this.doDownload(e.prepareRedirectUrlOptions(a, t), n, r++) : n.callback(this.createMaxRedirectError());
					return;
				}
				n.responseHandler == null ? E(n, i) : n.responseHandler(i, n.callback);
			});
			this.addErrorAndTimeoutHandlers(i, n.callback, t.timeout), this.addRedirectHandlers(i, t, n.callback, r, (e) => {
				this.doDownload(e, n, r++);
			}), i.end();
		}
		createMaxRedirectError() {
			return /* @__PURE__ */ Error(`Too many redirects (> ${this.maxRedirects})`);
		}
		addTimeOutHandler(e, t, n) {
			e.on("socket", (r) => {
				r.setTimeout(n, () => {
					e.abort(), t(/* @__PURE__ */ Error("Request timed out"));
				});
			});
		}
		static prepareRedirectUrlOptions(t, n) {
			let r = x(t, { ...n }), i = r.headers;
			if (i == null) return r;
			let a = e.reconstructOriginalUrl(n), o = b(t, n);
			if (e.isCrossOriginRedirect(a, o)) {
				l.enabled && l(`Cross-origin redirect (${a.host} → ${o.host}): stripping sensitive headers`);
				for (let e of Object.keys(i)) d.has(u(e)) && delete i[e];
			}
			return r;
		}
		static reconstructOriginalUrl(e) {
			let t = e.protocol || "https:";
			if (!e.hostname) throw Error("Missing hostname in request options");
			let n = e.hostname, r = e.port ? `:${e.port}` : "", i = e.path || "/";
			return new a.URL(`${t}//${n}${r}${i}`);
		}
		static isCrossOriginRedirect(e, t) {
			return e.hostname.toLowerCase() === t.hostname.toLowerCase() ? e.protocol === "http:" && ["80", ""].includes(e.port) && t.protocol === "https:" && ["443", ""].includes(t.port) ? !1 : e.protocol !== t.protocol || e.port !== t.port : !0;
		}
		static async retryOnServerError(e, t = 3) {
			for (let n = 0;; n++) try {
				return await e();
			} catch (e) {
				if (n < t && (e instanceof v && e.isServerError() || e.code === "EPIPE")) {
					await new Promise((e) => setTimeout(e, 1e3 * (n + 1)));
					continue;
				}
				throw e;
			}
		}
	};
	function b(e, t) {
		try {
			return new a.URL(e);
		} catch {
			let n = t.hostname, r = `${t.protocol || "https:"}//${n}${t.port ? `:${t.port}` : ""}`;
			return new a.URL(e, r);
		}
	}
	function x(e, t) {
		let n = D(t);
		return S(b(e, t), n), n;
	}
	function S(e, t) {
		t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
	}
	var C = class extends i.Transform {
		get actual() {
			return this._actual;
		}
		constructor(e, n = "sha512", r = "base64") {
			super(), this.expected = e, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, t.createHash)(n);
		}
		_transform(e, t, n) {
			this.digester.update(e), n(null, e);
		}
		_flush(e) {
			if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd) try {
				this.validate();
			} catch (t) {
				e(t);
				return;
			}
			e(null);
		}
		validate() {
			if (this._actual == null) throw (0, s.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
			if (this._actual !== this.expected) throw (0, s.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
			return null;
		}
	};
	e.DigestTransform = C;
	function w(e, t, n) {
		return e != null && t != null && e !== t ? (n(/* @__PURE__ */ Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
	}
	function T(e, t) {
		let n = e.headers[t];
		return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
	}
	function E(e, t) {
		if (!w(T(t, "X-Checksum-Sha2"), e.options.sha2, e.callback)) return;
		let n = [];
		if (e.options.onProgress != null) {
			let r = T(t, "content-length");
			r != null && n.push(new c.ProgressCallbackTransform(parseInt(r, 10), e.options.cancellationToken, e.options.onProgress));
		}
		let i = e.options.sha512;
		i == null ? e.options.sha2 != null && n.push(new C(e.options.sha2, "sha256", "hex")) : n.push(new C(i, "sha512", i.length === 128 && !i.includes("+") && !i.includes("Z") && !i.includes("=") ? "hex" : "base64"));
		let a = (0, r.createWriteStream)(e.destination);
		n.push(a);
		let o = t;
		for (let t of n) t.on("error", (t) => {
			a.close(), e.options.cancellationToken.cancelled || e.callback(t);
		}), o = o.pipe(t);
		a.on("finish", () => {
			a.close(e.callback);
		});
	}
	function D(e, t, n) {
		n != null && (e.method = n), e.headers = { ...e.headers };
		let r = e.headers;
		return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] ??= "electron-builder", (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
	}
	function O(e) {
		let t = u(e);
		return f.some((e) => t.includes(e)) || p.some((e) => t.endsWith(e));
	}
	function k(e) {
		return `${(0, t.createHash)("sha256").update(e).digest("hex")} (sha256 hash)`;
	}
	function A(e, t) {
		return JSON.stringify(e, (e, n) => O(e) || t != null && t.has(e) ? typeof n == "string" ? k(n) : "<stripped sensitive data>" : n, 2);
	}
})), Pn = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MemoLazy = void 0, e.MemoLazy = class {
		constructor(e, t) {
			this.selector = e, this.creator = t, this.selected = void 0, this._value = void 0;
		}
		get hasValue() {
			return this._value !== void 0;
		}
		get value() {
			let e = this.selector();
			if (this._value !== void 0 && t(this.selected, e)) return this._value;
			this.selected = e;
			let n = this.creator(e);
			return this.value = n, n;
		}
		set value(e) {
			this._value = e;
		}
	};
	function t(e, n) {
		if (typeof e == "object" && e && typeof n == "object" && n) {
			let r = Object.keys(e), i = Object.keys(n);
			return r.length === i.length && r.every((r) => t(e[r], n[r]));
		}
		return e === n;
	}
})), Fn = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.githubUrl = t, e.githubTagPrefix = n, e.getS3LikeProviderBaseUrl = r;
	function t(e, t = "github.com") {
		return `${e.protocol || "https"}://${e.host || t}`;
	}
	function n(e) {
		return e.tagNamePrefix ? e.tagNamePrefix : e.vPrefixedTagName ?? !0 ? "v" : "";
	}
	function r(e) {
		let t = e.provider;
		if (t === "s3") return i(e);
		if (t === "spaces") return o(e);
		throw Error(`Not supported provider: ${t}`);
	}
	function i(e) {
		let t;
		if (e.accelerate == 1) t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
		else if (e.endpoint != null) t = `${e.endpoint}/${e.bucket}`;
		else if (e.bucket.includes(".")) {
			if (e.region == null) throw Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
			t = e.region === "us-east-1" ? `https://s3.amazonaws.com/${e.bucket}` : `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
		} else t = e.region === "cn-north-1" ? `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : `https://${e.bucket}.s3.amazonaws.com`;
		return a(t, e.path);
	}
	function a(e, t) {
		return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
	}
	function o(e) {
		if (e.name == null) throw Error("name is missing");
		if (e.region == null) throw Error("region is missing");
		return a(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
	}
})), In = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.retry = n;
	var t = Cn();
	async function n(e, r) {
		let { retries: i, interval: a, backoff: o = 0, attempt: s = 0, shouldRetry: c, cancellationToken: l = new t.CancellationToken() } = r;
		try {
			return await e();
		} catch (t) {
			if (await Promise.resolve(c?.(t) ?? !0) && i > 0 && !l.cancelled) return await new Promise((e) => setTimeout(e, a + o * s)), await n(e, {
				...r,
				retries: i - 1,
				attempt: s + 1
			});
			throw t;
		}
	}
})), Ln = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.parseDn = t;
	function t(e) {
		let t = !1, n = null, r = "", i = 0;
		e = e.trim();
		let a = /* @__PURE__ */ new Map();
		for (let o = 0; o <= e.length; o++) {
			if (o === e.length) {
				n !== null && a.set(n, r);
				break;
			}
			let s = e[o];
			if (t) {
				if (s === "\"") {
					t = !1;
					continue;
				}
			} else {
				if (s === "\"") {
					t = !0;
					continue;
				}
				if (s === "\\") {
					o++;
					let t = parseInt(e.slice(o, o + 2), 16);
					Number.isNaN(t) ? r += e[o] : (o++, r += String.fromCharCode(t));
					continue;
				}
				if (n === null && s === "=") {
					n = r, r = "";
					continue;
				}
				if (s === "," || s === ";" || s === "+") {
					n !== null && a.set(n, r), n = null, r = "";
					continue;
				}
			}
			if (s === " " && !t) {
				if (r.length === 0) continue;
				if (o > i) {
					let t = o;
					for (; e[t] === " ";) t++;
					i = t;
				}
				if (i >= e.length || e[i] === "," || e[i] === ";" || n === null && e[i] === "=" || n !== null && e[i] === "+") {
					o = i - 1;
					continue;
				}
			}
			r += s;
		}
		return a;
	}
})), Rn = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.nil = e.UUID = void 0;
	var t = R("crypto"), n = wn(), r = "options.name must be either a string or a Buffer", i = (0, t.randomBytes)(16);
	i[0] |= 1;
	var a = {}, o = [];
	for (let e = 0; e < 256; e++) {
		let t = (e + 256).toString(16).substr(1);
		a[t] = e, o[e] = t;
	}
	var s = class e {
		constructor(t) {
			this.ascii = null, this.binary = null;
			let n = e.check(t);
			if (!n) throw Error("not a UUID");
			this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
		}
		static v5(e, t) {
			return u(e, "sha1", 80, t);
		}
		toString() {
			return this.ascii ??= d(this.binary), this.ascii;
		}
		inspect() {
			return `UUID v${this.version} ${this.toString()}`;
		}
		static check(e, t = 0) {
			if (typeof e == "string") return e = e.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(e) ? e === "00000000-0000-0000-0000-000000000000" ? {
				version: void 0,
				variant: "nil",
				format: "ascii"
			} : {
				version: (a[e[14] + e[15]] & 240) >> 4,
				variant: c((a[e[19] + e[20]] & 224) >> 5),
				format: "ascii"
			} : !1;
			if (Buffer.isBuffer(e)) {
				if (e.length < t + 16) return !1;
				let n = 0;
				for (; n < 16 && e[t + n] === 0; n++);
				return n === 16 ? {
					version: void 0,
					variant: "nil",
					format: "binary"
				} : {
					version: (e[t + 6] & 240) >> 4,
					variant: c((e[t + 8] & 224) >> 5),
					format: "binary"
				};
			}
			throw (0, n.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
		}
		static parse(e) {
			let t = Buffer.allocUnsafe(16), n = 0;
			for (let r = 0; r < 16; r++) t[r] = a[e[n++] + e[n++]], (r === 3 || r === 5 || r === 7 || r === 9) && (n += 1);
			return t;
		}
	};
	e.UUID = s, s.OID = s.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
	function c(e) {
		switch (e) {
			case 0:
			case 1:
			case 3: return "ncs";
			case 4:
			case 5: return "rfc4122";
			case 6: return "microsoft";
			default: return "future";
		}
	}
	var l;
	(function(e) {
		e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
	})(l ||= {});
	function u(e, i, a, c, u = l.ASCII) {
		let d = (0, t.createHash)(i);
		if (typeof e != "string" && !Buffer.isBuffer(e)) throw (0, n.newError)(r, "ERR_INVALID_UUID_NAME");
		d.update(c), d.update(e);
		let f = d.digest(), p;
		switch (u) {
			case l.BINARY:
				f[6] = f[6] & 15 | a, f[8] = f[8] & 63 | 128, p = f;
				break;
			case l.OBJECT:
				f[6] = f[6] & 15 | a, f[8] = f[8] & 63 | 128, p = new s(f);
				break;
			default: p = o[f[0]] + o[f[1]] + o[f[2]] + o[f[3]] + "-" + o[f[4]] + o[f[5]] + "-" + o[f[6] & 15 | a] + o[f[7]] + "-" + o[f[8] & 63 | 128] + o[f[9]] + "-" + o[f[10]] + o[f[11]] + o[f[12]] + o[f[13]] + o[f[14]] + o[f[15]];
		}
		return p;
	}
	function d(e) {
		return o[e[0]] + o[e[1]] + o[e[2]] + o[e[3]] + "-" + o[e[4]] + o[e[5]] + "-" + o[e[6]] + o[e[7]] + "-" + o[e[8]] + o[e[9]] + "-" + o[e[10]] + o[e[11]] + o[e[12]] + o[e[13]] + o[e[14]] + o[e[15]];
	}
	e.nil = new s("00000000-0000-0000-0000-000000000000");
})), zn = /* @__PURE__ */ L(((e) => {
	(function(e) {
		e.parser = function(e, t) {
			return new n(e, t);
		}, e.SAXParser = n, e.SAXStream = u, e.createStream = c, e.MAX_BUFFER_LENGTH = 65536;
		var t = [
			"comment",
			"sgmlDecl",
			"textNode",
			"tagName",
			"doctype",
			"procInstName",
			"procInstBody",
			"entity",
			"attribName",
			"attribValue",
			"cdata",
			"script"
		];
		e.EVENTS = [
			"text",
			"processinginstruction",
			"sgmldeclaration",
			"doctype",
			"comment",
			"opentagstart",
			"attribute",
			"opentag",
			"closetag",
			"opencdata",
			"cdata",
			"closecdata",
			"error",
			"end",
			"ready",
			"script",
			"opennamespace",
			"closenamespace"
		];
		function n(t, r) {
			if (!(this instanceof n)) return new n(t, r);
			var a = this;
			i(a), a.q = a.c = "", a.bufferCheckPosition = e.MAX_BUFFER_LENGTH, a.encoding = null, a.opt = r || {}, a.opt.lowercase = a.opt.lowercase || a.opt.lowercasetags, a.looseCase = a.opt.lowercase ? "toLowerCase" : "toUpperCase", a.opt.maxEntityCount = a.opt.maxEntityCount || 512, a.opt.maxEntityDepth = a.opt.maxEntityDepth || 4, a.entityCount = a.entityDepth = 0, a.tags = [], a.closed = a.closedRoot = a.sawRoot = !1, a.tag = a.error = null, a.strict = !!t, a.noscript = !!(t || a.opt.noscript), a.state = T.BEGIN, a.strictEntities = a.opt.strictEntities, a.ENTITIES = a.strictEntities ? Object.create(e.XML_ENTITIES) : Object.create(e.ENTITIES), a.attribList = [], a.opt.xmlns && (a.ns = Object.create(h)), a.opt.unquotedAttributeValues === void 0 && (a.opt.unquotedAttributeValues = !t), a.trackPosition = a.opt.position !== !1, a.trackPosition && (a.position = a.line = a.column = 0), D(a, "onready");
		}
		Object.create || (Object.create = function(e) {
			function t() {}
			return t.prototype = e, new t();
		}), Object.keys || (Object.keys = function(e) {
			var t = [];
			for (var n in e) e.hasOwnProperty(n) && t.push(n);
			return t;
		});
		function r(n) {
			for (var r = Math.max(e.MAX_BUFFER_LENGTH, 10), i = 0, a = 0, o = t.length; a < o; a++) {
				var s = n[t[a]].length;
				if (s > r) switch (t[a]) {
					case "textNode":
						M(n);
						break;
					case "cdata":
						j(n, "oncdata", n.cdata), n.cdata = "";
						break;
					case "script":
						j(n, "onscript", n.script), n.script = "";
						break;
					default: P(n, "Max buffer length exceeded: " + t[a]);
				}
				i = Math.max(i, s);
			}
			n.bufferCheckPosition = e.MAX_BUFFER_LENGTH - i + n.position;
		}
		function i(e) {
			for (var n = 0, r = t.length; n < r; n++) e[t[n]] = "";
		}
		function a(e) {
			M(e), e.cdata !== "" && (j(e, "oncdata", e.cdata), e.cdata = ""), e.script !== "" && (j(e, "onscript", e.script), e.script = "");
		}
		n.prototype = {
			end: function() {
				F(this);
			},
			write: W,
			resume: function() {
				return this.error = null, this;
			},
			close: function() {
				return this.write(null);
			},
			flush: function() {
				a(this);
			}
		};
		var o;
		try {
			o = R("stream").Stream;
		} catch {
			o = function() {};
		}
		o ||= function() {};
		var s = e.EVENTS.filter(function(e) {
			return e !== "error" && e !== "end";
		});
		function c(e, t) {
			return new u(e, t);
		}
		function l(e, t) {
			if (e.length >= 2) {
				if (e[0] === 255 && e[1] === 254) return "utf-16le";
				if (e[0] === 254 && e[1] === 255) return "utf-16be";
			}
			return e.length >= 3 && e[0] === 239 && e[1] === 187 && e[2] === 191 ? "utf8" : e.length >= 4 ? e[0] === 60 && e[1] === 0 && e[2] === 63 && e[3] === 0 ? "utf-16le" : e[0] === 0 && e[1] === 60 && e[2] === 0 && e[3] === 63 ? "utf-16be" : "utf8" : t ? "utf8" : null;
		}
		function u(e, t) {
			if (!(this instanceof u)) return new u(e, t);
			o.apply(this), this._parser = new n(e, t), this.writable = !0, this.readable = !0;
			var r = this;
			this._parser.onend = function() {
				r.emit("end");
			}, this._parser.onerror = function(e) {
				r.emit("error", e), r._parser.error = null;
			}, this._decoder = null, this._decoderBuffer = null, s.forEach(function(e) {
				Object.defineProperty(r, "on" + e, {
					get: function() {
						return r._parser["on" + e];
					},
					set: function(t) {
						if (!t) return r.removeAllListeners(e), r._parser["on" + e] = t, t;
						r.on(e, t);
					},
					enumerable: !0,
					configurable: !1
				});
			});
		}
		u.prototype = Object.create(o.prototype, { constructor: { value: u } }), u.prototype._decodeBuffer = function(e, t) {
			if (this._decoderBuffer &&= (e = Buffer.concat([this._decoderBuffer, e]), null), !this._decoder) {
				var n = l(e, t);
				if (!n) return this._decoderBuffer = e, "";
				this._parser.encoding = n, this._decoder = new TextDecoder(n);
			}
			return this._decoder.decode(e, { stream: !t });
		}, u.prototype.write = function(e) {
			if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(e)) e = this._decodeBuffer(e, !1);
			else if (this._decoderBuffer) {
				var t = this._decodeBuffer(Buffer.alloc(0), !0);
				t && (this._parser.write(t), this.emit("data", t));
			}
			return this._parser.write(e.toString()), this.emit("data", e), !0;
		}, u.prototype.end = function(e) {
			if (e && e.length && this.write(e), this._decoderBuffer) {
				var t = this._decodeBuffer(Buffer.alloc(0), !0);
				t && (this._parser.write(t), this.emit("data", t));
			} else if (this._decoder) {
				var n = this._decoder.decode();
				n && (this._parser.write(n), this.emit("data", n));
			}
			return this._parser.end(), !0;
		}, u.prototype.on = function(e, t) {
			var n = this;
			return !n._parser["on" + e] && s.indexOf(e) !== -1 && (n._parser["on" + e] = function() {
				var t = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
				t.splice(0, 0, e), n.emit.apply(n, t);
			}), o.prototype.on.call(n, e, t);
		};
		var d = /^\[CDATA\[$/i, f = /^DOCTYPE$/i, p = "http://www.w3.org/XML/1998/namespace", m = "http://www.w3.org/2000/xmlns/", h = {
			xml: p,
			xmlns: m
		}, g = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, _ = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, v = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, y = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
		function b(e) {
			return e === " " || e === "\n" || e === "\r" || e === "	";
		}
		function x(e) {
			return e === "\"" || e === "'";
		}
		function S(e) {
			return e === ">" || b(e);
		}
		function C(e, t) {
			return e.test(t);
		}
		function w(e, t) {
			return !C(e, t);
		}
		var T = 0;
		for (var E in e.STATE = {
			BEGIN: T++,
			BEGIN_WHITESPACE: T++,
			TEXT: T++,
			TEXT_ENTITY: T++,
			OPEN_WAKA: T++,
			SGML_DECL: T++,
			SGML_DECL_QUOTED: T++,
			DOCTYPE: T++,
			DOCTYPE_QUOTED: T++,
			DOCTYPE_DTD: T++,
			DOCTYPE_DTD_QUOTED: T++,
			COMMENT_STARTING: T++,
			COMMENT: T++,
			COMMENT_ENDING: T++,
			COMMENT_ENDED: T++,
			CDATA: T++,
			CDATA_ENDING: T++,
			CDATA_ENDING_2: T++,
			PROC_INST: T++,
			PROC_INST_BODY: T++,
			PROC_INST_ENDING: T++,
			OPEN_TAG: T++,
			OPEN_TAG_SLASH: T++,
			ATTRIB: T++,
			ATTRIB_NAME: T++,
			ATTRIB_NAME_SAW_WHITE: T++,
			ATTRIB_VALUE: T++,
			ATTRIB_VALUE_QUOTED: T++,
			ATTRIB_VALUE_CLOSED: T++,
			ATTRIB_VALUE_UNQUOTED: T++,
			ATTRIB_VALUE_ENTITY_Q: T++,
			ATTRIB_VALUE_ENTITY_U: T++,
			CLOSE_TAG: T++,
			CLOSE_TAG_SAW_WHITE: T++,
			SCRIPT: T++,
			SCRIPT_ENDING: T++
		}, e.XML_ENTITIES = Object.assign(Object.create(null), {
			amp: "&",
			gt: ">",
			lt: "<",
			quot: "\"",
			apos: "'"
		}), e.ENTITIES = Object.assign(Object.create(null), {
			amp: "&",
			gt: ">",
			lt: "<",
			quot: "\"",
			apos: "'",
			AElig: 198,
			Aacute: 193,
			Acirc: 194,
			Agrave: 192,
			Aring: 197,
			Atilde: 195,
			Auml: 196,
			Ccedil: 199,
			ETH: 208,
			Eacute: 201,
			Ecirc: 202,
			Egrave: 200,
			Euml: 203,
			Iacute: 205,
			Icirc: 206,
			Igrave: 204,
			Iuml: 207,
			Ntilde: 209,
			Oacute: 211,
			Ocirc: 212,
			Ograve: 210,
			Oslash: 216,
			Otilde: 213,
			Ouml: 214,
			THORN: 222,
			Uacute: 218,
			Ucirc: 219,
			Ugrave: 217,
			Uuml: 220,
			Yacute: 221,
			aacute: 225,
			acirc: 226,
			aelig: 230,
			agrave: 224,
			aring: 229,
			atilde: 227,
			auml: 228,
			ccedil: 231,
			eacute: 233,
			ecirc: 234,
			egrave: 232,
			eth: 240,
			euml: 235,
			iacute: 237,
			icirc: 238,
			igrave: 236,
			iuml: 239,
			ntilde: 241,
			oacute: 243,
			ocirc: 244,
			ograve: 242,
			oslash: 248,
			otilde: 245,
			ouml: 246,
			szlig: 223,
			thorn: 254,
			uacute: 250,
			ucirc: 251,
			ugrave: 249,
			uuml: 252,
			yacute: 253,
			yuml: 255,
			copy: 169,
			reg: 174,
			nbsp: 160,
			iexcl: 161,
			cent: 162,
			pound: 163,
			curren: 164,
			yen: 165,
			brvbar: 166,
			sect: 167,
			uml: 168,
			ordf: 170,
			laquo: 171,
			not: 172,
			shy: 173,
			macr: 175,
			deg: 176,
			plusmn: 177,
			sup1: 185,
			sup2: 178,
			sup3: 179,
			acute: 180,
			micro: 181,
			para: 182,
			middot: 183,
			cedil: 184,
			ordm: 186,
			raquo: 187,
			frac14: 188,
			frac12: 189,
			frac34: 190,
			iquest: 191,
			times: 215,
			divide: 247,
			OElig: 338,
			oelig: 339,
			Scaron: 352,
			scaron: 353,
			Yuml: 376,
			fnof: 402,
			circ: 710,
			tilde: 732,
			Alpha: 913,
			Beta: 914,
			Gamma: 915,
			Delta: 916,
			Epsilon: 917,
			Zeta: 918,
			Eta: 919,
			Theta: 920,
			Iota: 921,
			Kappa: 922,
			Lambda: 923,
			Mu: 924,
			Nu: 925,
			Xi: 926,
			Omicron: 927,
			Pi: 928,
			Rho: 929,
			Sigma: 931,
			Tau: 932,
			Upsilon: 933,
			Phi: 934,
			Chi: 935,
			Psi: 936,
			Omega: 937,
			alpha: 945,
			beta: 946,
			gamma: 947,
			delta: 948,
			epsilon: 949,
			zeta: 950,
			eta: 951,
			theta: 952,
			iota: 953,
			kappa: 954,
			lambda: 955,
			mu: 956,
			nu: 957,
			xi: 958,
			omicron: 959,
			pi: 960,
			rho: 961,
			sigmaf: 962,
			sigma: 963,
			tau: 964,
			upsilon: 965,
			phi: 966,
			chi: 967,
			psi: 968,
			omega: 969,
			thetasym: 977,
			upsih: 978,
			piv: 982,
			ensp: 8194,
			emsp: 8195,
			thinsp: 8201,
			zwnj: 8204,
			zwj: 8205,
			lrm: 8206,
			rlm: 8207,
			ndash: 8211,
			mdash: 8212,
			lsquo: 8216,
			rsquo: 8217,
			sbquo: 8218,
			ldquo: 8220,
			rdquo: 8221,
			bdquo: 8222,
			dagger: 8224,
			Dagger: 8225,
			bull: 8226,
			hellip: 8230,
			permil: 8240,
			prime: 8242,
			Prime: 8243,
			lsaquo: 8249,
			rsaquo: 8250,
			oline: 8254,
			frasl: 8260,
			euro: 8364,
			image: 8465,
			weierp: 8472,
			real: 8476,
			trade: 8482,
			alefsym: 8501,
			larr: 8592,
			uarr: 8593,
			rarr: 8594,
			darr: 8595,
			harr: 8596,
			crarr: 8629,
			lArr: 8656,
			uArr: 8657,
			rArr: 8658,
			dArr: 8659,
			hArr: 8660,
			forall: 8704,
			part: 8706,
			exist: 8707,
			empty: 8709,
			nabla: 8711,
			isin: 8712,
			notin: 8713,
			ni: 8715,
			prod: 8719,
			sum: 8721,
			minus: 8722,
			lowast: 8727,
			radic: 8730,
			prop: 8733,
			infin: 8734,
			ang: 8736,
			and: 8743,
			or: 8744,
			cap: 8745,
			cup: 8746,
			int: 8747,
			there4: 8756,
			sim: 8764,
			cong: 8773,
			asymp: 8776,
			ne: 8800,
			equiv: 8801,
			le: 8804,
			ge: 8805,
			sub: 8834,
			sup: 8835,
			nsub: 8836,
			sube: 8838,
			supe: 8839,
			oplus: 8853,
			otimes: 8855,
			perp: 8869,
			sdot: 8901,
			lceil: 8968,
			rceil: 8969,
			lfloor: 8970,
			rfloor: 8971,
			lang: 9001,
			rang: 9002,
			loz: 9674,
			spades: 9824,
			clubs: 9827,
			hearts: 9829,
			diams: 9830
		}), Object.keys(e.ENTITIES).forEach(function(t) {
			var n = e.ENTITIES[t], r = typeof n == "number" ? String.fromCharCode(n) : n;
			e.ENTITIES[t] = r;
		}), e.STATE) e.STATE[e.STATE[E]] = E;
		T = e.STATE;
		function D(e, t, n) {
			e[t] && e[t](n);
		}
		function O(e) {
			var t = e && e.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
			return t ? t[2] : null;
		}
		function k(e) {
			return e ? e.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
		}
		function A(e, t) {
			let n = k(e), r = k(t);
			return !n || !r ? !0 : r === "utf16" ? n === "utf16le" || n === "utf16be" : n === r;
		}
		function ee(e, t) {
			if (!(!e.strict || !e.encoding || !t || t.name !== "xml")) {
				var n = O(t.body);
				n && !A(e.encoding, n) && I(e, "XML declaration encoding " + n + " does not match detected stream encoding " + e.encoding.toUpperCase());
			}
		}
		function j(e, t, n) {
			e.textNode && M(e), D(e, t, n);
		}
		function M(e) {
			e.textNode = N(e.opt, e.textNode), e.textNode && D(e, "ontext", e.textNode), e.textNode = "";
		}
		function N(e, t) {
			return e.trim && (t = t.trim()), e.normalize && (t = t.replace(/\s+/g, " ")), t;
		}
		function P(e, t) {
			return M(e), e.trackPosition && (t += "\nLine: " + e.line + "\nColumn: " + e.column + "\nChar: " + e.c), t = Error(t), e.error = t, D(e, "onerror", t), e;
		}
		function F(e) {
			return e.sawRoot && !e.closedRoot && I(e, "Unclosed root tag"), e.state !== T.BEGIN && e.state !== T.BEGIN_WHITESPACE && e.state !== T.TEXT && P(e, "Unexpected end"), M(e), e.c = "", e.closed = !0, D(e, "onend"), n.call(e, e.strict, e.opt), e;
		}
		function I(e, t) {
			if (typeof e != "object" || !(e instanceof n)) throw Error("bad call to strictFail");
			e.strict && P(e, t);
		}
		function te(e) {
			e.strict || (e.tagName = e.tagName[e.looseCase]());
			var t = e.tags[e.tags.length - 1] || e, n = e.tag = {
				name: e.tagName,
				attributes: {}
			};
			e.opt.xmlns && (n.ns = t.ns), e.attribList.length = 0, j(e, "onopentagstart", n);
		}
		function ne(e, t) {
			var n = e.indexOf(":") < 0 ? ["", e] : e.split(":"), r = n[0], i = n[1];
			return t && e === "xmlns" && (r = "xmlns", i = ""), {
				prefix: r,
				local: i
			};
		}
		function L(e) {
			if (e.strict || (e.attribName = e.attribName[e.looseCase]()), e.attribList.indexOf(e.attribName) !== -1 || e.tag.attributes.hasOwnProperty(e.attribName)) {
				e.attribName = e.attribValue = "";
				return;
			}
			if (e.opt.xmlns) {
				var t = ne(e.attribName, !0), n = t.prefix, r = t.local;
				if (n === "xmlns") {
					if (r === "xml" && e.attribValue !== p) I(e, "xml: prefix must be bound to " + p + "\nActual: " + e.attribValue);
					else if (r === "xmlns" && e.attribValue !== m) I(e, "xmlns: prefix must be bound to " + m + "\nActual: " + e.attribValue);
					else {
						var i = e.tag, a = e.tags[e.tags.length - 1] || e;
						i.ns === a.ns && (i.ns = Object.create(a.ns)), i.ns[r] = e.attribValue;
					}
				}
				e.attribList.push([e.attribName, e.attribValue]);
			} else e.tag.attributes[e.attribName] = e.attribValue, j(e, "onattribute", {
				name: e.attribName,
				value: e.attribValue
			});
			e.attribName = e.attribValue = "";
		}
		function z(e, t) {
			if (e.opt.xmlns) {
				var n = e.tag, r = ne(e.tagName);
				n.prefix = r.prefix, n.local = r.local, n.uri = n.ns[r.prefix] || "", n.prefix && !n.uri && (I(e, "Unbound namespace prefix: " + JSON.stringify(e.tagName)), n.uri = r.prefix);
				var i = e.tags[e.tags.length - 1] || e;
				n.ns && i.ns !== n.ns && Object.keys(n.ns).forEach(function(t) {
					j(e, "onopennamespace", {
						prefix: t,
						uri: n.ns[t]
					});
				});
				for (var a = 0, o = e.attribList.length; a < o; a++) {
					var s = e.attribList[a], c = s[0], l = s[1], u = ne(c, !0), d = u.prefix, f = u.local, p = d === "" ? "" : n.ns[d] || "", m = {
						name: c,
						value: l,
						prefix: d,
						local: f,
						uri: p
					};
					d && d !== "xmlns" && !p && (I(e, "Unbound namespace prefix: " + JSON.stringify(d)), m.uri = d), e.tag.attributes[c] = m, j(e, "onattribute", m);
				}
				e.attribList.length = 0;
			}
			e.tag.isSelfClosing = !!t, e.sawRoot = !0, e.tags.push(e.tag), j(e, "onopentag", e.tag), t || (e.state = !e.noscript && e.tagName.toLowerCase() === "script" ? T.SCRIPT : T.TEXT, e.tag = null, e.tagName = ""), e.attribName = e.attribValue = "", e.attribList.length = 0;
		}
		function B(e) {
			if (!e.tagName) {
				I(e, "Weird empty close tag."), e.textNode += "</>", e.state = T.TEXT;
				return;
			}
			if (e.script) {
				if (e.tagName !== "script") {
					e.script += "</" + e.tagName + ">", e.tagName = "", e.state = T.SCRIPT;
					return;
				}
				j(e, "onscript", e.script), e.script = "";
			}
			var t = e.tags.length, n = e.tagName;
			e.strict || (n = n[e.looseCase]());
			for (var r = n; t-- && e.tags[t].name !== r;) I(e, "Unexpected close tag");
			if (t < 0) {
				I(e, "Unmatched closing tag: " + e.tagName), e.textNode += "</" + e.tagName + ">", e.state = T.TEXT;
				return;
			}
			e.tagName = n;
			for (var i = e.tags.length; i-- > t;) {
				var a = e.tag = e.tags.pop();
				e.tagName = e.tag.name, j(e, "onclosetag", e.tagName);
				var o = {};
				for (var s in a.ns) o[s] = a.ns[s];
				var c = e.tags[e.tags.length - 1] || e;
				e.opt.xmlns && a.ns !== c.ns && Object.keys(a.ns).forEach(function(t) {
					var n = a.ns[t];
					j(e, "onclosenamespace", {
						prefix: t,
						uri: n
					});
				});
			}
			t === 0 && (e.closedRoot = !0), e.tagName = e.attribValue = e.attribName = "", e.attribList.length = 0, e.state = T.TEXT;
		}
		function V(e) {
			var t = e.entity, n = t.toLowerCase(), r, i = "";
			return e.ENTITIES[t] ? e.ENTITIES[t] : e.ENTITIES[n] ? e.ENTITIES[n] : (t = n, t.charAt(0) === "#" && (t.charAt(1) === "x" ? (t = t.slice(2), r = parseInt(t, 16), i = r.toString(16)) : (t = t.slice(1), r = parseInt(t, 10), i = r.toString(10))), t = t.replace(/^0+/, ""), isNaN(r) || i.toLowerCase() !== t || r < 0 || r > 1114111 || !H(r) ? (I(e, "Invalid character entity"), "&" + e.entity + ";") : String.fromCodePoint(r));
		}
		function H(e) {
			return e === 9 || e === 10 || e === 13 || e >= 32 && e <= 55295 || e >= 57344 && e <= 65533 || e >= 65536 && e <= 1114111;
		}
		function re(e, t) {
			t === "<" ? (e.state = T.OPEN_WAKA, e.startTagPosition = e.position) : b(t) || (I(e, "Non-whitespace before first tag."), e.textNode = t, e.state = T.TEXT);
		}
		function U(e, t) {
			var n = "";
			return t < e.length && (n = e.charAt(t)), n;
		}
		function W(t) {
			var n = this;
			if (this.error) throw this.error;
			if (n.closed) return P(n, "Cannot write after close. Assign an onready handler.");
			if (t === null) return F(n);
			typeof t == "object" && (t = t.toString());
			for (var i = 0, a = ""; a = U(t, i++), n.c = a, a;) switch (n.trackPosition && (n.position++, a === "\n" ? (n.line++, n.column = 0) : n.column++), n.state) {
				case T.BEGIN:
					if (n.state = T.BEGIN_WHITESPACE, a === "﻿") continue;
					re(n, a);
					continue;
				case T.BEGIN_WHITESPACE:
					re(n, a);
					continue;
				case T.TEXT:
					if (n.sawRoot && !n.closedRoot) {
						for (var o = i - 1; a && a !== "<" && a !== "&";) a = U(t, i++), a && n.trackPosition && (n.position++, a === "\n" ? (n.line++, n.column = 0) : n.column++);
						n.textNode += t.substring(o, i - 1);
					}
					a === "<" && !(n.sawRoot && n.closedRoot && !n.strict) ? (n.state = T.OPEN_WAKA, n.startTagPosition = n.position) : (!b(a) && (!n.sawRoot || n.closedRoot) && I(n, "Text data outside of root node."), a === "&" ? n.state = T.TEXT_ENTITY : n.textNode += a);
					continue;
				case T.SCRIPT:
					a === "<" ? n.state = T.SCRIPT_ENDING : n.script += a;
					continue;
				case T.SCRIPT_ENDING:
					a === "/" ? n.state = T.CLOSE_TAG : (n.script += "<" + a, n.state = T.SCRIPT);
					continue;
				case T.OPEN_WAKA:
					if (a === "!") n.state = T.SGML_DECL, n.sgmlDecl = "";
					else if (!b(a)) {
						if (C(g, a)) n.state = T.OPEN_TAG, n.tagName = a;
						else if (a === "/") n.state = T.CLOSE_TAG, n.tagName = "";
						else if (a === "?") n.state = T.PROC_INST, n.procInstName = n.procInstBody = "";
						else {
							if (I(n, "Unencoded <"), n.startTagPosition + 1 < n.position) {
								var s = n.position - n.startTagPosition;
								a = Array(s).join(" ") + a;
							}
							n.textNode += "<" + a, n.state = T.TEXT;
						}
					}
					continue;
				case T.SGML_DECL:
					if (n.sgmlDecl + a === "--") {
						n.state = T.COMMENT, n.comment = "", n.sgmlDecl = "";
						continue;
					}
					n.doctype && n.doctype !== !0 && n.sgmlDecl ? (n.state = T.DOCTYPE_DTD, n.doctype += "<!" + n.sgmlDecl + a, n.sgmlDecl = "") : d.test(n.sgmlDecl + a) ? (j(n, "onopencdata"), n.state = T.CDATA, n.sgmlDecl = "", n.cdata = "") : f.test(n.sgmlDecl + a) ? (n.state = T.DOCTYPE, (n.doctype || n.sawRoot) && I(n, "Inappropriately located doctype declaration"), n.doctype = "", n.sgmlDecl = "") : a === ">" ? (j(n, "onsgmldeclaration", n.sgmlDecl), n.sgmlDecl = "", n.state = T.TEXT) : (x(a) && (n.state = T.SGML_DECL_QUOTED), n.sgmlDecl += a);
					continue;
				case T.SGML_DECL_QUOTED:
					a === n.q && (n.state = T.SGML_DECL, n.q = ""), n.sgmlDecl += a;
					continue;
				case T.DOCTYPE:
					a === ">" ? (n.state = T.TEXT, j(n, "ondoctype", n.doctype), n.doctype = !0) : (n.doctype += a, a === "[" ? n.state = T.DOCTYPE_DTD : x(a) && (n.state = T.DOCTYPE_QUOTED, n.q = a));
					continue;
				case T.DOCTYPE_QUOTED:
					n.doctype += a, a === n.q && (n.q = "", n.state = T.DOCTYPE);
					continue;
				case T.DOCTYPE_DTD:
					a === "]" ? (n.doctype += a, n.state = T.DOCTYPE) : a === "<" ? (n.state = T.OPEN_WAKA, n.startTagPosition = n.position) : x(a) ? (n.doctype += a, n.state = T.DOCTYPE_DTD_QUOTED, n.q = a) : n.doctype += a;
					continue;
				case T.DOCTYPE_DTD_QUOTED:
					n.doctype += a, a === n.q && (n.state = T.DOCTYPE_DTD, n.q = "");
					continue;
				case T.COMMENT:
					a === "-" ? n.state = T.COMMENT_ENDING : n.comment += a;
					continue;
				case T.COMMENT_ENDING:
					a === "-" ? (n.state = T.COMMENT_ENDED, n.comment = N(n.opt, n.comment), n.comment && j(n, "oncomment", n.comment), n.comment = "") : (n.comment += "-" + a, n.state = T.COMMENT);
					continue;
				case T.COMMENT_ENDED:
					a === ">" ? n.state = n.doctype && n.doctype !== !0 ? T.DOCTYPE_DTD : T.TEXT : (I(n, "Malformed comment"), n.comment += "--" + a, n.state = T.COMMENT);
					continue;
				case T.CDATA:
					for (var o = i - 1; a && a !== "]";) a = U(t, i++), a && n.trackPosition && (n.position++, a === "\n" ? (n.line++, n.column = 0) : n.column++);
					n.cdata += t.substring(o, i - 1), a === "]" && (n.state = T.CDATA_ENDING);
					continue;
				case T.CDATA_ENDING:
					a === "]" ? n.state = T.CDATA_ENDING_2 : (n.cdata += "]" + a, n.state = T.CDATA);
					continue;
				case T.CDATA_ENDING_2:
					a === ">" ? (n.cdata && j(n, "oncdata", n.cdata), j(n, "onclosecdata"), n.cdata = "", n.state = T.TEXT) : a === "]" ? n.cdata += "]" : (n.cdata += "]]" + a, n.state = T.CDATA);
					continue;
				case T.PROC_INST:
					a === "?" ? n.state = T.PROC_INST_ENDING : b(a) ? n.state = T.PROC_INST_BODY : n.procInstName += a;
					continue;
				case T.PROC_INST_BODY:
					if (!n.procInstBody && b(a)) continue;
					a === "?" ? n.state = T.PROC_INST_ENDING : n.procInstBody += a;
					continue;
				case T.PROC_INST_ENDING:
					if (a === ">") {
						let e = {
							name: n.procInstName,
							body: n.procInstBody
						};
						ee(n, e), j(n, "onprocessinginstruction", e), n.procInstName = n.procInstBody = "", n.state = T.TEXT;
					} else n.procInstBody += "?" + a, n.state = T.PROC_INST_BODY;
					continue;
				case T.OPEN_TAG:
					C(_, a) ? n.tagName += a : (te(n), a === ">" ? z(n) : a === "/" ? n.state = T.OPEN_TAG_SLASH : (b(a) || I(n, "Invalid character in tag name"), n.state = T.ATTRIB));
					continue;
				case T.OPEN_TAG_SLASH:
					a === ">" ? (z(n, !0), B(n)) : (I(n, "Forward-slash in opening tag not followed by >"), n.state = T.ATTRIB);
					continue;
				case T.ATTRIB:
					if (b(a)) continue;
					a === ">" ? z(n) : a === "/" ? n.state = T.OPEN_TAG_SLASH : C(g, a) ? (n.attribName = a, n.attribValue = "", n.state = T.ATTRIB_NAME) : I(n, "Invalid attribute name");
					continue;
				case T.ATTRIB_NAME:
					a === "=" ? n.state = T.ATTRIB_VALUE : a === ">" ? (I(n, "Attribute without value"), n.attribValue = n.attribName, L(n), z(n)) : b(a) ? n.state = T.ATTRIB_NAME_SAW_WHITE : C(_, a) ? n.attribName += a : I(n, "Invalid attribute name");
					continue;
				case T.ATTRIB_NAME_SAW_WHITE:
					if (a === "=") n.state = T.ATTRIB_VALUE;
					else if (b(a)) continue;
					else I(n, "Attribute without value"), n.tag.attributes[n.attribName] = "", n.attribValue = "", j(n, "onattribute", {
						name: n.attribName,
						value: ""
					}), n.attribName = "", a === ">" ? z(n) : C(g, a) ? (n.attribName = a, n.state = T.ATTRIB_NAME) : (I(n, "Invalid attribute name"), n.state = T.ATTRIB);
					continue;
				case T.ATTRIB_VALUE:
					if (b(a)) continue;
					x(a) ? (n.q = a, n.state = T.ATTRIB_VALUE_QUOTED) : (n.opt.unquotedAttributeValues || P(n, "Unquoted attribute value"), n.state = T.ATTRIB_VALUE_UNQUOTED, n.attribValue = a);
					continue;
				case T.ATTRIB_VALUE_QUOTED:
					if (a !== n.q) {
						a === "&" ? n.state = T.ATTRIB_VALUE_ENTITY_Q : n.attribValue += a;
						continue;
					}
					L(n), n.q = "", n.state = T.ATTRIB_VALUE_CLOSED;
					continue;
				case T.ATTRIB_VALUE_CLOSED:
					b(a) ? n.state = T.ATTRIB : a === ">" ? z(n) : a === "/" ? n.state = T.OPEN_TAG_SLASH : C(g, a) ? (I(n, "No whitespace between attributes"), n.attribName = a, n.attribValue = "", n.state = T.ATTRIB_NAME) : I(n, "Invalid attribute name");
					continue;
				case T.ATTRIB_VALUE_UNQUOTED:
					if (!S(a)) {
						a === "&" ? n.state = T.ATTRIB_VALUE_ENTITY_U : n.attribValue += a;
						continue;
					}
					L(n), a === ">" ? z(n) : n.state = T.ATTRIB;
					continue;
				case T.CLOSE_TAG:
					if (n.tagName) a === ">" ? B(n) : C(_, a) ? n.tagName += a : n.script ? (n.script += "</" + n.tagName + a, n.tagName = "", n.state = T.SCRIPT) : (b(a) || I(n, "Invalid tagname in closing tag"), n.state = T.CLOSE_TAG_SAW_WHITE);
					else {
						if (b(a)) continue;
						w(g, a) ? n.script ? (n.script += "</" + a, n.state = T.SCRIPT) : I(n, "Invalid tagname in closing tag.") : n.tagName = a;
					}
					continue;
				case T.CLOSE_TAG_SAW_WHITE:
					if (b(a)) continue;
					a === ">" ? B(n) : I(n, "Invalid characters in closing tag");
					continue;
				case T.TEXT_ENTITY:
				case T.ATTRIB_VALUE_ENTITY_Q:
				case T.ATTRIB_VALUE_ENTITY_U:
					var c, l;
					switch (n.state) {
						case T.TEXT_ENTITY:
							c = T.TEXT, l = "textNode";
							break;
						case T.ATTRIB_VALUE_ENTITY_Q:
							c = T.ATTRIB_VALUE_QUOTED, l = "attribValue";
							break;
						case T.ATTRIB_VALUE_ENTITY_U: c = T.ATTRIB_VALUE_UNQUOTED, l = "attribValue";
					}
					if (a === ";") {
						var u = V(n);
						n.opt.unparsedEntities && !Object.values(e.XML_ENTITIES).includes(u) ? ((n.entityCount += 1) > n.opt.maxEntityCount && P(n, "Parsed entity count exceeds max entity count"), (n.entityDepth += 1) > n.opt.maxEntityDepth && P(n, "Parsed entity depth exceeds max entity depth"), n.entity = "", n.state = c, n.write(u), --n.entityDepth) : (n[l] += u, n.entity = "", n.state = c);
					} else C(n.entity.length ? y : v, a) ? n.entity += a : (I(n, "Invalid character in entity name"), n[l] += "&" + n.entity + a, n.entity = "", n.state = c);
					continue;
				default: throw Error(n, "Unknown state: " + n.state);
			}
			return n.position >= n.bufferCheckPosition && r(n), n;
		}
		/* istanbul ignore next */
		String.fromCodePoint || (function() {
			var e = String.fromCharCode, t = Math.floor, n = function() {
				var n = 16384, r = [], i, a, o = -1, s = arguments.length;
				if (!s) return "";
				for (var c = ""; ++o < s;) {
					var l = Number(arguments[o]);
					if (!isFinite(l) || l < 0 || l > 1114111 || t(l) !== l) throw RangeError("Invalid code point: " + l);
					l <= 65535 ? r.push(l) : (l -= 65536, i = (l >> 10) + 55296, a = l % 1024 + 56320, r.push(i, a)), (o + 1 === s || r.length > n) && (c += e.apply(null, r), r.length = 0);
				}
				return c;
			};
			/* istanbul ignore next */
			Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
				value: n,
				configurable: !0,
				writable: !0
			}) : String.fromCodePoint = n;
		})();
	})(e === void 0 ? e.sax = {} : e);
})), Bn = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.XElement = void 0, e.parseXml = s;
	var t = zn(), n = wn(), r = class {
		constructor(e) {
			if (this.name = e, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !e) throw (0, n.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
			if (!a(e)) throw (0, n.newError)(`Invalid element name: ${e}`, "ERR_XML_ELEMENT_INVALID_NAME");
		}
		attribute(e) {
			let t = this.attributes === null ? null : this.attributes[e];
			if (t == null) throw (0, n.newError)(`No attribute "${e}"`, "ERR_XML_MISSED_ATTRIBUTE");
			return t;
		}
		removeAttribute(e) {
			this.attributes !== null && delete this.attributes[e];
		}
		element(e, t = !1, r = null) {
			let i = this.elementOrNull(e, t);
			if (i === null) throw (0, n.newError)(r || `No element "${e}"`, "ERR_XML_MISSED_ELEMENT");
			return i;
		}
		elementOrNull(e, t = !1) {
			if (this.elements === null) return null;
			for (let n of this.elements) if (o(n, e, t)) return n;
			return null;
		}
		getElements(e, t = !1) {
			return this.elements === null ? [] : this.elements.filter((n) => o(n, e, t));
		}
		elementValueOrEmpty(e, t = !1) {
			let n = this.elementOrNull(e, t);
			return n === null ? "" : n.value;
		}
	};
	e.XElement = r;
	var i = /* @__PURE__ */ new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
	function a(e) {
		return i.test(e);
	}
	function o(e, t, n) {
		let r = e.name;
		return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
	}
	function s(e) {
		let n = null, i = t.parser(!0, {}), a = [];
		return i.onopentag = (e) => {
			let t = new r(e.name);
			if (t.attributes = e.attributes, n === null) n = t;
			else {
				let e = a[a.length - 1];
				e.elements ??= [], e.elements.push(t);
			}
			a.push(t);
		}, i.onclosetag = () => {
			a.pop();
		}, i.ontext = (e) => {
			a.length > 0 && (a[a.length - 1].value = e);
		}, i.oncdata = (e) => {
			let t = a[a.length - 1];
			t.value = e, t.isCData = !0;
		}, i.onerror = (e) => {
			throw e;
		}, i.write(e), n;
	}
})), Vn = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.mapToObject = t, e.isValidKey = n, e.asArray = r, e.deepAssign = s, e.objectToArgs = u;
	function t(e) {
		let r = {};
		for (let [i, a] of e) n(i) && (r[i] = a instanceof Map ? t(a) : a);
		return r;
	}
	function n(e) {
		return [
			"__proto__",
			"prototype",
			"constructor"
		].includes(e) ? !1 : [
			"string",
			"number",
			"symbol",
			"boolean"
		].includes(typeof e) || e === null;
	}
	function r(e) {
		return e == null ? [] : Array.isArray(e) ? e : [e];
	}
	function i(e) {
		if (Array.isArray(e)) return !1;
		let t = typeof e;
		return t === "object" || t === "function";
	}
	function a(e, t, n) {
		let r = t[n];
		if (r === void 0) return;
		let a = e[n];
		e[n] = a == null || r == null || !i(a) || !i(r) ? Array.isArray(a) && Array.isArray(r) ? Array.from(new Set(a.concat(r))) : r : o(a, r);
	}
	function o(e, t) {
		if (e !== t) for (let r of Object.getOwnPropertyNames(t)) n(r) && a(e, t, r);
		return e;
	}
	function s(e, ...t) {
		for (let n of t) n != null && o(e, n);
		return e;
	}
	var c = /^[a-zA-Z][a-zA-Z0-9-]*$/, l = /[\0\r\n]/;
	function u(e) {
		let t = Object.entries(e).reduce((e, [t, r]) => {
			if (!n(t) || r == null) return e;
			if (!c.test(t)) throw Error(`objectToArgs: unsafe flag name rejected: ${JSON.stringify(t)}`);
			if (l.test(r)) throw Error(`objectToArgs: value for --${t} contains a null byte or newline`);
			return e.concat([`--${t}`, r]);
		}, []);
		return Object.freeze(t);
	}
})), X = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.objectToArgs = e.deepAssign = e.asArray = e.mapToObject = e.isValidKey = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.isSensitiveFieldName = e.HttpExecutor = e.hashSensitiveValue = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0;
	var t = Cn();
	Object.defineProperty(e, "CancellationError", {
		enumerable: !0,
		get: function() {
			return t.CancellationError;
		}
	}), Object.defineProperty(e, "CancellationToken", {
		enumerable: !0,
		get: function() {
			return t.CancellationToken;
		}
	});
	var n = wn();
	Object.defineProperty(e, "newError", {
		enumerable: !0,
		get: function() {
			return n.newError;
		}
	});
	var r = Nn();
	Object.defineProperty(e, "configureRequestOptions", {
		enumerable: !0,
		get: function() {
			return r.configureRequestOptions;
		}
	}), Object.defineProperty(e, "configureRequestOptionsFromUrl", {
		enumerable: !0,
		get: function() {
			return r.configureRequestOptionsFromUrl;
		}
	}), Object.defineProperty(e, "configureRequestUrl", {
		enumerable: !0,
		get: function() {
			return r.configureRequestUrl;
		}
	}), Object.defineProperty(e, "createHttpError", {
		enumerable: !0,
		get: function() {
			return r.createHttpError;
		}
	}), Object.defineProperty(e, "DigestTransform", {
		enumerable: !0,
		get: function() {
			return r.DigestTransform;
		}
	}), Object.defineProperty(e, "HttpError", {
		enumerable: !0,
		get: function() {
			return r.HttpError;
		}
	}), Object.defineProperty(e, "hashSensitiveValue", {
		enumerable: !0,
		get: function() {
			return r.hashSensitiveValue;
		}
	}), Object.defineProperty(e, "HttpExecutor", {
		enumerable: !0,
		get: function() {
			return r.HttpExecutor;
		}
	}), Object.defineProperty(e, "isSensitiveFieldName", {
		enumerable: !0,
		get: function() {
			return r.isSensitiveFieldName;
		}
	}), Object.defineProperty(e, "parseJson", {
		enumerable: !0,
		get: function() {
			return r.parseJson;
		}
	}), Object.defineProperty(e, "safeGetHeader", {
		enumerable: !0,
		get: function() {
			return r.safeGetHeader;
		}
	}), Object.defineProperty(e, "safeStringifyJson", {
		enumerable: !0,
		get: function() {
			return r.safeStringifyJson;
		}
	});
	var i = Pn();
	Object.defineProperty(e, "MemoLazy", {
		enumerable: !0,
		get: function() {
			return i.MemoLazy;
		}
	});
	var a = Mn();
	Object.defineProperty(e, "ProgressCallbackTransform", {
		enumerable: !0,
		get: function() {
			return a.ProgressCallbackTransform;
		}
	});
	var o = Fn();
	Object.defineProperty(e, "getS3LikeProviderBaseUrl", {
		enumerable: !0,
		get: function() {
			return o.getS3LikeProviderBaseUrl;
		}
	}), Object.defineProperty(e, "githubUrl", {
		enumerable: !0,
		get: function() {
			return o.githubUrl;
		}
	}), Object.defineProperty(e, "githubTagPrefix", {
		enumerable: !0,
		get: function() {
			return o.githubTagPrefix;
		}
	});
	var s = In();
	Object.defineProperty(e, "retry", {
		enumerable: !0,
		get: function() {
			return s.retry;
		}
	});
	var c = Ln();
	Object.defineProperty(e, "parseDn", {
		enumerable: !0,
		get: function() {
			return c.parseDn;
		}
	});
	var l = Rn();
	Object.defineProperty(e, "UUID", {
		enumerable: !0,
		get: function() {
			return l.UUID;
		}
	});
	var u = Bn();
	Object.defineProperty(e, "parseXml", {
		enumerable: !0,
		get: function() {
			return u.parseXml;
		}
	}), Object.defineProperty(e, "XElement", {
		enumerable: !0,
		get: function() {
			return u.XElement;
		}
	});
	var d = Vn();
	Object.defineProperty(e, "isValidKey", {
		enumerable: !0,
		get: function() {
			return d.isValidKey;
		}
	}), Object.defineProperty(e, "mapToObject", {
		enumerable: !0,
		get: function() {
			return d.mapToObject;
		}
	}), Object.defineProperty(e, "asArray", {
		enumerable: !0,
		get: function() {
			return d.asArray;
		}
	}), Object.defineProperty(e, "deepAssign", {
		enumerable: !0,
		get: function() {
			return d.deepAssign;
		}
	}), Object.defineProperty(e, "objectToArgs", {
		enumerable: !0,
		get: function() {
			return d.objectToArgs;
		}
	}), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
})), Hn = /* @__PURE__ */ L(((e, t) => {
	function n(e) {
		return e == null;
	}
	function r(e) {
		return typeof e == "object" && !!e;
	}
	function i(e) {
		return Array.isArray(e) ? e : n(e) ? [] : [e];
	}
	function a(e, t) {
		if (t) {
			let n = Object.keys(t);
			for (let r = 0, i = n.length; r < i; r += 1) {
				let i = n[r];
				e[i] = t[i];
			}
		}
		return e;
	}
	function o(e, t) {
		let n = "";
		for (let r = 0; r < t; r += 1) n += e;
		return n;
	}
	function s(e) {
		return e === 0 && 1 / e == -Infinity;
	}
	t.exports.isNothing = n, t.exports.isObject = r, t.exports.toArray = i, t.exports.repeat = o, t.exports.isNegativeZero = s, t.exports.extend = a;
})), Un = /* @__PURE__ */ L(((e, t) => {
	function n(e, t) {
		let n = "", r = e.reason || "(unknown reason)";
		return e.mark ? (e.mark.name && (n += "in \"" + e.mark.name + "\" "), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += "\n\n" + e.mark.snippet), r + " " + n) : r;
	}
	function r(e, t) {
		Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = n(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = (/* @__PURE__ */ Error()).stack || "";
	}
	r.prototype = Object.create(Error.prototype), r.prototype.constructor = r, r.prototype.toString = function(e) {
		return this.name + ": " + n(this, e);
	}, t.exports = r;
})), Wn = /* @__PURE__ */ L(((e, t) => {
	var n = Hn();
	function r(e, t, n, r, i) {
		let a = "", o = "", s = Math.floor(i / 2) - 1;
		return r - t > s && (a = " ... ", t = r - s + a.length), n - r > s && (o = " ...", n = r + s - o.length), {
			str: a + e.slice(t, n).replace(/\t/g, "→") + o,
			pos: r - t + a.length
		};
	}
	function i(e, t) {
		return n.repeat(" ", t - e.length) + e;
	}
	function a(e, t) {
		if (t = Object.create(t || null), !e.buffer) return null;
		t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
		let a = /\r?\n|\r|\0/g, o = [0], s = [], c, l = -1;
		for (; c = a.exec(e.buffer);) s.push(c.index), o.push(c.index + c[0].length), e.position <= c.index && l < 0 && (l = o.length - 2);
		l < 0 && (l = o.length - 1);
		let u = "", d = Math.min(e.line + t.linesAfter, s.length).toString().length, f = t.maxLength - (t.indent + d + 3);
		for (let a = 1; a <= t.linesBefore && !(l - a < 0); a++) {
			let c = r(e.buffer, o[l - a], s[l - a], e.position - (o[l] - o[l - a]), f);
			u = n.repeat(" ", t.indent) + i((e.line - a + 1).toString(), d) + " | " + c.str + "\n" + u;
		}
		let p = r(e.buffer, o[l], s[l], e.position, f);
		u += n.repeat(" ", t.indent) + i((e.line + 1).toString(), d) + " | " + p.str + "\n", u += n.repeat("-", t.indent + d + 3 + p.pos) + "^\n";
		for (let a = 1; a <= t.linesAfter && !(l + a >= s.length); a++) {
			let c = r(e.buffer, o[l + a], s[l + a], e.position - (o[l] - o[l + a]), f);
			u += n.repeat(" ", t.indent) + i((e.line + a + 1).toString(), d) + " | " + c.str + "\n";
		}
		return u.replace(/\n$/, "");
	}
	t.exports = a;
})), Z = /* @__PURE__ */ L(((e, t) => {
	var n = Un(), r = [
		"kind",
		"multi",
		"resolve",
		"construct",
		"instanceOf",
		"predicate",
		"represent",
		"representName",
		"defaultStyle",
		"styleAliases"
	], i = [
		"scalar",
		"sequence",
		"mapping"
	];
	function a(e) {
		let t = {};
		return e !== null && Object.keys(e).forEach(function(n) {
			e[n].forEach(function(e) {
				t[String(e)] = n;
			});
		}), t;
	}
	function o(e, t) {
		if (t ||= {}, Object.keys(t).forEach(function(t) {
			if (r.indexOf(t) === -1) throw new n("Unknown option \"" + t + "\" is met in definition of \"" + e + "\" YAML type.");
		}), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
			return !0;
		}, this.construct = t.construct || function(e) {
			return e;
		}, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = a(t.styleAliases || null), i.indexOf(this.kind) === -1) throw new n("Unknown kind \"" + this.kind + "\" is specified for \"" + e + "\" YAML type.");
	}
	t.exports = o;
})), Gn = /* @__PURE__ */ L(((e, t) => {
	var n = Un(), r = Z();
	function i(e, t) {
		let n = [];
		return e[t].forEach(function(e) {
			let t = n.length;
			n.forEach(function(n, r) {
				n.tag === e.tag && n.kind === e.kind && n.multi === e.multi && (t = r);
			}), n[t] = e;
		}), n;
	}
	function a() {
		let e = {
			scalar: {},
			sequence: {},
			mapping: {},
			fallback: {},
			multi: {
				scalar: [],
				sequence: [],
				mapping: [],
				fallback: []
			}
		};
		function t(t) {
			t.multi ? (e.multi[t.kind].push(t), e.multi.fallback.push(t)) : e[t.kind][t.tag] = e.fallback[t.tag] = t;
		}
		for (let e = 0, n = arguments.length; e < n; e += 1) arguments[e].forEach(t);
		return e;
	}
	function o(e) {
		return this.extend(e);
	}
	o.prototype.extend = function(e) {
		let t = [], s = [];
		if (e instanceof r) s.push(e);
		else if (Array.isArray(e)) s = s.concat(e);
		else if (e && (Array.isArray(e.implicit) || Array.isArray(e.explicit))) e.implicit && (t = t.concat(e.implicit)), e.explicit && (s = s.concat(e.explicit));
		else throw new n("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
		t.forEach(function(e) {
			if (!(e instanceof r)) throw new n("Specified list of YAML types (or a single Type object) contains a non-Type object.");
			if (e.loadKind && e.loadKind !== "scalar") throw new n("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
			if (e.multi) throw new n("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
		}), s.forEach(function(e) {
			if (!(e instanceof r)) throw new n("Specified list of YAML types (or a single Type object) contains a non-Type object.");
		});
		let c = Object.create(o.prototype);
		return c.implicit = (this.implicit || []).concat(t), c.explicit = (this.explicit || []).concat(s), c.compiledImplicit = i(c, "implicit"), c.compiledExplicit = i(c, "explicit"), c.compiledTypeMap = a(c.compiledImplicit, c.compiledExplicit), c;
	}, t.exports = o;
})), Kn = /* @__PURE__ */ L(((e, t) => {
	t.exports = new (Z())("tag:yaml.org,2002:str", {
		kind: "scalar",
		construct: function(e) {
			return e === null ? "" : e;
		}
	});
})), qn = /* @__PURE__ */ L(((e, t) => {
	t.exports = new (Z())("tag:yaml.org,2002:seq", {
		kind: "sequence",
		construct: function(e) {
			return e === null ? [] : e;
		}
	});
})), Jn = /* @__PURE__ */ L(((e, t) => {
	t.exports = new (Z())("tag:yaml.org,2002:map", {
		kind: "mapping",
		construct: function(e) {
			return e === null ? {} : e;
		}
	});
})), Yn = /* @__PURE__ */ L(((e, t) => {
	t.exports = new (Gn())({ explicit: [
		Kn(),
		qn(),
		Jn()
	] });
})), Xn = /* @__PURE__ */ L(((e, t) => {
	var n = Z();
	function r(e) {
		if (e === null) return !0;
		let t = e.length;
		return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
	}
	function i() {
		return null;
	}
	function a(e) {
		return e === null;
	}
	t.exports = new n("tag:yaml.org,2002:null", {
		kind: "scalar",
		resolve: r,
		construct: i,
		predicate: a,
		represent: {
			canonical: function() {
				return "~";
			},
			lowercase: function() {
				return "null";
			},
			uppercase: function() {
				return "NULL";
			},
			camelcase: function() {
				return "Null";
			},
			empty: function() {
				return "";
			}
		},
		defaultStyle: "lowercase"
	});
})), Zn = /* @__PURE__ */ L(((e, t) => {
	var n = Z();
	function r(e) {
		if (e === null) return !1;
		let t = e.length;
		return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
	}
	function i(e) {
		return e === "true" || e === "True" || e === "TRUE";
	}
	function a(e) {
		return Object.prototype.toString.call(e) === "[object Boolean]";
	}
	t.exports = new n("tag:yaml.org,2002:bool", {
		kind: "scalar",
		resolve: r,
		construct: i,
		predicate: a,
		represent: {
			lowercase: function(e) {
				return e ? "true" : "false";
			},
			uppercase: function(e) {
				return e ? "TRUE" : "FALSE";
			},
			camelcase: function(e) {
				return e ? "True" : "False";
			}
		},
		defaultStyle: "lowercase"
	});
})), Qn = /* @__PURE__ */ L(((e, t) => {
	var n = Hn(), r = Z();
	function i(e) {
		return e >= 48 && e <= 57 || e >= 65 && e <= 70 || e >= 97 && e <= 102;
	}
	function a(e) {
		return e >= 48 && e <= 55;
	}
	function o(e) {
		return e >= 48 && e <= 57;
	}
	function s(e) {
		if (e === null) return !1;
		let t = e.length, n = 0, r = !1;
		if (!t) return !1;
		let s = e[n];
		if ((s === "-" || s === "+") && (s = e[++n]), s === "0") {
			if (n + 1 === t) return !0;
			if (s = e[++n], s === "b") {
				for (n++; n < t; n++) {
					if (s = e[n], s !== "0" && s !== "1") return !1;
					r = !0;
				}
				return r && isFinite(c(e));
			}
			if (s === "x") {
				for (n++; n < t; n++) {
					if (!i(e.charCodeAt(n))) return !1;
					r = !0;
				}
				return r && isFinite(c(e));
			}
			if (s === "o") {
				for (n++; n < t; n++) {
					if (!a(e.charCodeAt(n))) return !1;
					r = !0;
				}
				return r && isFinite(c(e));
			}
		}
		for (; n < t; n++) {
			if (!o(e.charCodeAt(n))) return !1;
			r = !0;
		}
		return r ? isFinite(c(e)) : !1;
	}
	function c(e) {
		let t = e, n = 1, r = t[0];
		if ((r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
		if (r === "0") {
			if (t[1] === "b") return n * parseInt(t.slice(2), 2);
			if (t[1] === "x") return n * parseInt(t.slice(2), 16);
			if (t[1] === "o") return n * parseInt(t.slice(2), 8);
		}
		return n * parseInt(t, 10);
	}
	function l(e) {
		return c(e);
	}
	function u(e) {
		return Object.prototype.toString.call(e) === "[object Number]" && e % 1 == 0 && !n.isNegativeZero(e);
	}
	t.exports = new r("tag:yaml.org,2002:int", {
		kind: "scalar",
		resolve: s,
		construct: l,
		predicate: u,
		represent: {
			binary: function(e) {
				return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
			},
			octal: function(e) {
				return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
			},
			decimal: function(e) {
				return e.toString(10);
			},
			hexadecimal: function(e) {
				return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
			}
		},
		defaultStyle: "decimal",
		styleAliases: {
			binary: [2, "bin"],
			octal: [8, "oct"],
			decimal: [10, "dec"],
			hexadecimal: [16, "hex"]
		}
	});
})), $n = /* @__PURE__ */ L(((e, t) => {
	var n = Hn(), r = Z(), i = /* @__PURE__ */ RegExp("^(?:[-+]?(?:[0-9]+)(?:\\.[0-9]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"), a = /* @__PURE__ */ RegExp("^(?:[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$");
	function o(e) {
		return e === null || !i.test(e) ? !1 : isFinite(parseFloat(e, 10)) ? !0 : a.test(e);
	}
	function s(e) {
		let t = e.toLowerCase(), n = t[0] === "-" ? -1 : 1;
		return "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Infinity : -Infinity : t === ".nan" ? NaN : n * parseFloat(t, 10);
	}
	var c = /^[-+]?[0-9]+e/;
	function l(e, t) {
		if (isNaN(e)) switch (t) {
			case "lowercase": return ".nan";
			case "uppercase": return ".NAN";
			case "camelcase": return ".NaN";
		}
		else if (e === Infinity) switch (t) {
			case "lowercase": return ".inf";
			case "uppercase": return ".INF";
			case "camelcase": return ".Inf";
		}
		else if (e === -Infinity) switch (t) {
			case "lowercase": return "-.inf";
			case "uppercase": return "-.INF";
			case "camelcase": return "-.Inf";
		}
		else if (n.isNegativeZero(e)) return "-0.0";
		let r = e.toString(10);
		return c.test(r) ? r.replace("e", ".e") : r;
	}
	function u(e) {
		return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 != 0 || n.isNegativeZero(e));
	}
	t.exports = new r("tag:yaml.org,2002:float", {
		kind: "scalar",
		resolve: o,
		construct: s,
		predicate: u,
		represent: l,
		defaultStyle: "lowercase"
	});
})), er = /* @__PURE__ */ L(((e, t) => {
	t.exports = Yn().extend({ implicit: [
		Xn(),
		Zn(),
		Qn(),
		$n()
	] });
})), tr = /* @__PURE__ */ L(((e, t) => {
	t.exports = er();
})), nr = /* @__PURE__ */ L(((e, t) => {
	var n = Z(), r = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"), i = /* @__PURE__ */ RegExp("^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$");
	function a(e) {
		return e === null ? !1 : r.exec(e) !== null || i.exec(e) !== null;
	}
	function o(e) {
		let t = 0, n = null, a = r.exec(e);
		if (a === null && (a = i.exec(e)), a === null) throw Error("Date resolve error");
		let o = +a[1], s = a[2] - 1, c = +a[3];
		if (!a[4]) return new Date(Date.UTC(o, s, c));
		let l = +a[4], u = +a[5], d = +a[6];
		if (a[7]) {
			for (t = a[7].slice(0, 3); t.length < 3;) t += "0";
			t = +t;
		}
		if (a[9]) {
			let e = +a[10], t = +(a[11] || 0);
			n = (e * 60 + t) * 6e4, a[9] === "-" && (n = -n);
		}
		let f = new Date(Date.UTC(o, s, c, l, u, d, t));
		return n && f.setTime(f.getTime() - n), f;
	}
	function s(e) {
		return e.toISOString();
	}
	t.exports = new n("tag:yaml.org,2002:timestamp", {
		kind: "scalar",
		resolve: a,
		construct: o,
		instanceOf: Date,
		represent: s
	});
})), rr = /* @__PURE__ */ L(((e, t) => {
	var n = Z();
	function r(e) {
		return e === "<<" || e === null;
	}
	t.exports = new n("tag:yaml.org,2002:merge", {
		kind: "scalar",
		resolve: r
	});
})), ir = /* @__PURE__ */ L(((e, t) => {
	var n = Z(), r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
	function i(e) {
		if (e === null) return !1;
		let t = 0, n = e.length, i = r;
		for (let r = 0; r < n; r++) {
			let n = i.indexOf(e.charAt(r));
			if (!(n > 64)) {
				if (n < 0) return !1;
				t += 6;
			}
		}
		return t % 8 == 0;
	}
	function a(e) {
		let t = e.replace(/[\r\n=]/g, ""), n = t.length, i = r, a = 0, o = [];
		for (let e = 0; e < n; e++) e % 4 == 0 && e && (o.push(a >> 16 & 255), o.push(a >> 8 & 255), o.push(a & 255)), a = a << 6 | i.indexOf(t.charAt(e));
		let s = n % 4 * 6;
		return s === 0 ? (o.push(a >> 16 & 255), o.push(a >> 8 & 255), o.push(a & 255)) : s === 18 ? (o.push(a >> 10 & 255), o.push(a >> 2 & 255)) : s === 12 && o.push(a >> 4 & 255), new Uint8Array(o);
	}
	function o(e) {
		let t = "", n = 0, i = e.length, a = r;
		for (let r = 0; r < i; r++) r % 3 == 0 && r && (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]), n = (n << 8) + e[r];
		let o = i % 3;
		return o === 0 ? (t += a[n >> 18 & 63], t += a[n >> 12 & 63], t += a[n >> 6 & 63], t += a[n & 63]) : o === 2 ? (t += a[n >> 10 & 63], t += a[n >> 4 & 63], t += a[n << 2 & 63], t += a[64]) : o === 1 && (t += a[n >> 2 & 63], t += a[n << 4 & 63], t += a[64], t += a[64]), t;
	}
	function s(e) {
		return Object.prototype.toString.call(e) === "[object Uint8Array]";
	}
	t.exports = new n("tag:yaml.org,2002:binary", {
		kind: "scalar",
		resolve: i,
		construct: a,
		predicate: s,
		represent: o
	});
})), ar = /* @__PURE__ */ L(((e, t) => {
	var n = Z(), r = Object.prototype.hasOwnProperty, i = Object.prototype.toString;
	function a(e) {
		if (e === null) return !0;
		let t = {}, n = e;
		for (let e = 0, a = n.length; e < a; e += 1) {
			let a = n[e], o = !1;
			if (i.call(a) !== "[object Object]") return !1;
			let s;
			for (s in a) if (r.call(a, s)) {
				if (!o) o = !0;
				else return !1;
			}
			if (!o || r.call(t, s)) return !1;
			Object.defineProperty(t, s, { value: !0 });
		}
		return !0;
	}
	function o(e) {
		return e === null ? [] : e;
	}
	t.exports = new n("tag:yaml.org,2002:omap", {
		kind: "sequence",
		resolve: a,
		construct: o
	});
})), or = /* @__PURE__ */ L(((e, t) => {
	var n = Z(), r = Object.prototype.toString;
	function i(e) {
		if (e === null) return !0;
		let t = e, n = Array(t.length);
		for (let e = 0, i = t.length; e < i; e += 1) {
			let i = t[e];
			if (r.call(i) !== "[object Object]") return !1;
			let a = Object.keys(i);
			if (a.length !== 1) return !1;
			n[e] = [a[0], i[a[0]]];
		}
		return !0;
	}
	function a(e) {
		if (e === null) return [];
		let t = e, n = Array(t.length);
		for (let e = 0, r = t.length; e < r; e += 1) {
			let r = t[e], i = Object.keys(r);
			n[e] = [i[0], r[i[0]]];
		}
		return n;
	}
	t.exports = new n("tag:yaml.org,2002:pairs", {
		kind: "sequence",
		resolve: i,
		construct: a
	});
})), sr = /* @__PURE__ */ L(((e, t) => {
	var n = Z(), r = Object.prototype.hasOwnProperty;
	function i(e) {
		if (e === null) return !0;
		let t = e;
		for (let e in t) if (r.call(t, e) && t[e] !== null) return !1;
		return !0;
	}
	function a(e) {
		return e === null ? {} : e;
	}
	t.exports = new n("tag:yaml.org,2002:set", {
		kind: "mapping",
		resolve: i,
		construct: a
	});
})), cr = /* @__PURE__ */ L(((e, t) => {
	t.exports = tr().extend({
		implicit: [nr(), rr()],
		explicit: [
			ir(),
			ar(),
			or(),
			sr()
		]
	});
})), lr = /* @__PURE__ */ L(((e, t) => {
	var n = Hn(), r = Un(), i = Wn(), a = cr(), o = Object.prototype.hasOwnProperty, s = 1, c = 2, l = 3, u = 4, d = 1, f = 2, p = 3, m = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, h = /[\x85\u2028\u2029]/, g = /[,\[\]{}]/, _ = /^(?:!|!!|![0-9A-Za-z-]+!)$/, v = /^(?:!|[^,\[\]{}])(?:%[0-9a-f]{2}|[0-9a-z\-#;/?:@&=+$,_.!~*'()\[\]])*$/i;
	function y(e) {
		return Object.prototype.toString.call(e);
	}
	function b(e) {
		return e === 10 || e === 13;
	}
	function x(e) {
		return e === 9 || e === 32;
	}
	function S(e) {
		return e === 9 || e === 32 || e === 10 || e === 13;
	}
	function C(e) {
		return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
	}
	function w(e) {
		if (e >= 48 && e <= 57) return e - 48;
		let t = e | 32;
		return t >= 97 && t <= 102 ? t - 97 + 10 : -1;
	}
	function T(e) {
		return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
	}
	function E(e) {
		return e >= 48 && e <= 57 ? e - 48 : -1;
	}
	function D(e) {
		switch (e) {
			case 48: return "\0";
			case 97: return "\x07";
			case 98: return "\b";
			case 116: return "	";
			case 9: return "	";
			case 110: return "\n";
			case 118: return "\v";
			case 102: return "\f";
			case 114: return "\r";
			case 101: return "\x1B";
			case 32: return " ";
			case 34: return "\"";
			case 47: return "/";
			case 92: return "\\";
			case 78: return "";
			case 95: return "\xA0";
			case 76: return "\u2028";
			case 80: return "\u2029";
			default: return "";
		}
	}
	function O(e) {
		return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode((e - 65536 >> 10) + 55296, (e - 65536 & 1023) + 56320);
	}
	function k(e, t, n) {
		t === "__proto__" ? Object.defineProperty(e, t, {
			configurable: !0,
			enumerable: !0,
			writable: !0,
			value: n
		}) : e[t] = n;
	}
	var A = Array(256), ee = Array(256);
	for (let e = 0; e < 256; e++) A[e] = +!!D(e), ee[e] = D(e);
	function j(e, t) {
		this.input = e, this.filename = t.filename || null, this.schema = t.schema || a, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.maxDepth = typeof t.maxDepth == "number" ? t.maxDepth : 100, this.maxTotalMergeKeys = typeof t.maxTotalMergeKeys == "number" ? t.maxTotalMergeKeys : 1e4, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.depth = 0, this.totalMergeKeys = 0, this.firstTabInLine = -1, this.documents = [], this.anchorMapTransactions = [];
	}
	function M(e, t) {
		let n = {
			name: e.filename,
			buffer: e.input.slice(0, -1),
			position: e.position,
			line: e.line,
			column: e.position - e.lineStart
		};
		return n.snippet = i(n), new r(t, n);
	}
	function N(e, t) {
		throw M(e, t);
	}
	function P(e, t) {
		e.onWarning && e.onWarning.call(null, M(e, t));
	}
	function F(e, t, n) {
		let r = e.anchorMapTransactions;
		if (r.length !== 0) {
			let n = r[r.length - 1];
			o.call(n, t) || (n[t] = {
				existed: o.call(e.anchorMap, t),
				value: e.anchorMap[t]
			});
		}
		e.anchorMap[t] = n;
	}
	function I(e) {
		e.anchorMapTransactions.push(Object.create(null));
	}
	function te(e) {
		let t = e.anchorMapTransactions.pop(), n = e.anchorMapTransactions;
		if (n.length === 0) return;
		let r = n[n.length - 1], i = Object.keys(t);
		for (let e = 0, n = i.length; e < n; e += 1) {
			let n = i[e];
			o.call(r, n) || (r[n] = t[n]);
		}
	}
	function ne(e) {
		let t = e.anchorMapTransactions.pop(), n = Object.keys(t);
		for (let r = n.length - 1; r >= 0; --r) {
			let i = t[n[r]];
			i.existed ? e.anchorMap[n[r]] = i.value : delete e.anchorMap[n[r]];
		}
	}
	function L(e) {
		return {
			position: e.position,
			line: e.line,
			lineStart: e.lineStart,
			lineIndent: e.lineIndent,
			firstTabInLine: e.firstTabInLine,
			tag: e.tag,
			anchor: e.anchor,
			kind: e.kind,
			result: e.result
		};
	}
	function R(e, t) {
		e.position = t.position, e.line = t.line, e.lineStart = t.lineStart, e.lineIndent = t.lineIndent, e.firstTabInLine = t.firstTabInLine, e.tag = t.tag, e.anchor = t.anchor, e.kind = t.kind, e.result = t.result;
	}
	var z = {
		YAML: function(e, t, n) {
			e.version !== null && N(e, "duplication of %YAML directive"), n.length !== 1 && N(e, "YAML directive accepts exactly one argument");
			let r = /^([0-9]+)\.([0-9]+)$/.exec(n[0]);
			r === null && N(e, "ill-formed argument of the YAML directive");
			let i = parseInt(r[1], 10), a = parseInt(r[2], 10);
			i !== 1 && N(e, "unacceptable YAML version of the document"), e.version = n[0], e.checkLineBreaks = a < 2, a !== 1 && a !== 2 && P(e, "unsupported YAML version of the document");
		},
		TAG: function(e, t, n) {
			let r;
			n.length !== 2 && N(e, "TAG directive accepts exactly two arguments");
			let i = n[0];
			r = n[1], _.test(i) || N(e, "ill-formed tag handle (first argument) of the TAG directive"), o.call(e.tagMap, i) && N(e, "there is a previously declared suffix for \"" + i + "\" tag handle"), v.test(r) || N(e, "ill-formed tag prefix (second argument) of the TAG directive");
			try {
				r = decodeURIComponent(r);
			} catch {
				N(e, "tag prefix is malformed: " + r);
			}
			e.tagMap[i] = r;
		}
	};
	function B(e, t, n, r) {
		if (t < n) {
			let i = e.input.slice(t, n);
			if (r) for (let t = 0, n = i.length; t < n; t += 1) {
				let n = i.charCodeAt(t);
				n === 9 || n >= 32 && n <= 1114111 || N(e, "expected valid JSON character");
			}
			else m.test(i) && N(e, "the stream contains non-printable characters");
			e.result += i;
		}
	}
	function V(e, t, r, i) {
		n.isObject(r) || N(e, "cannot merge mappings; the provided source object is unacceptable");
		let a = Object.keys(r);
		for (let n = 0, s = a.length; n < s; n += 1) {
			let s = a[n];
			e.maxTotalMergeKeys !== -1 && ++e.totalMergeKeys > e.maxTotalMergeKeys && N(e, "merge keys exceeded maxTotalMergeKeys (" + e.maxTotalMergeKeys + ")"), o.call(t, s) || (k(t, s, r[s]), i[s] = !0);
		}
	}
	function H(e, t, n, r, i, a, s, c, l) {
		if (Array.isArray(i)) {
			i = Array.prototype.slice.call(i);
			for (let t = 0, n = i.length; t < n; t += 1) Array.isArray(i[t]) && N(e, "nested arrays are not supported inside keys"), typeof i == "object" && y(i[t]) === "[object Object]" && (i[t] = "[object Object]");
		}
		if (typeof i == "object" && y(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge") {
			if (Array.isArray(a)) for (let r = 0, i = a.length; r < i; r += 1) V(e, t, a[r], n);
			else V(e, t, a, n);
		} else !e.json && !o.call(n, i) && o.call(t, i) && (e.line = s || e.line, e.lineStart = c || e.lineStart, e.position = l || e.position, N(e, "duplicated mapping key")), k(t, i, a), delete n[i];
		return t;
	}
	function re(e) {
		let t = e.input.charCodeAt(e.position);
		t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : N(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
	}
	function U(e, t, n) {
		let r = 0, i = e.input.charCodeAt(e.position);
		for (; i !== 0;) {
			for (; x(i);) i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
			if (t && i === 35) do
				i = e.input.charCodeAt(++e.position);
			while (i !== 10 && i !== 13 && i !== 0);
			if (b(i)) for (re(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32;) e.lineIndent++, i = e.input.charCodeAt(++e.position);
			else break;
		}
		return n !== -1 && r !== 0 && e.lineIndent < n && P(e, "deficient indentation"), r;
	}
	function W(e) {
		let t = e.position, n = e.input.charCodeAt(t);
		return !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || S(n)));
	}
	function ie(e, t) {
		t === 1 ? e.result += " " : t > 1 && (e.result += n.repeat("\n", t - 1));
	}
	function ae(e, t, n) {
		let r, i, a, o, s, c, l = e.kind, u = e.result, d = e.input.charCodeAt(e.position);
		if (S(d) || C(d) || d === 35 || d === 38 || d === 42 || d === 33 || d === 124 || d === 62 || d === 39 || d === 34 || d === 37 || d === 64 || d === 96) return !1;
		if (d === 63 || d === 45) {
			let t = e.input.charCodeAt(e.position + 1);
			if (S(t) || n && C(t)) return !1;
		}
		for (e.kind = "scalar", e.result = "", r = i = e.position, a = !1; d !== 0;) {
			if (d === 58) {
				let t = e.input.charCodeAt(e.position + 1);
				if (S(t) || n && C(t)) break;
			} else if (d === 35) {
				if (S(e.input.charCodeAt(e.position - 1))) break;
			} else if (e.position === e.lineStart && W(e) || n && C(d)) break;
			else if (b(d)) {
				if (o = e.line, s = e.lineStart, c = e.lineIndent, U(e, !1, -1), e.lineIndent >= t) {
					a = !0, d = e.input.charCodeAt(e.position);
					continue;
				}
				e.position = i, e.line = o, e.lineStart = s, e.lineIndent = c;
				break;
			}
			a &&= (B(e, r, i, !1), ie(e, e.line - o), r = i = e.position, !1), x(d) || (i = e.position + 1), d = e.input.charCodeAt(++e.position);
		}
		return B(e, r, i, !1), e.result ? !0 : (e.kind = l, e.result = u, !1);
	}
	function oe(e, t) {
		let n, r, i = e.input.charCodeAt(e.position);
		if (i !== 39) return !1;
		for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (i = e.input.charCodeAt(e.position)) !== 0;) if (i === 39) {
			if (B(e, n, e.position, !0), i = e.input.charCodeAt(++e.position), i === 39) n = e.position, e.position++, r = e.position;
			else return !0;
		} else b(i) ? (B(e, n, r, !0), ie(e, U(e, !1, t)), n = r = e.position) : e.position === e.lineStart && W(e) ? N(e, "unexpected end of the document within a single quoted scalar") : (e.position++, x(i) || (r = e.position));
		N(e, "unexpected end of the stream within a single quoted scalar");
	}
	function se(e, t) {
		let n, r, i, a = e.input.charCodeAt(e.position);
		if (a !== 34) return !1;
		for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (a = e.input.charCodeAt(e.position)) !== 0;) if (a === 34) return B(e, n, e.position, !0), e.position++, !0;
		else if (a === 92) {
			if (B(e, n, e.position, !0), a = e.input.charCodeAt(++e.position), b(a)) U(e, !1, t);
			else if (a < 256 && A[a]) e.result += ee[a], e.position++;
			else if ((i = T(a)) > 0) {
				let t = i, n = 0;
				for (; t > 0; t--) a = e.input.charCodeAt(++e.position), (i = w(a)) >= 0 ? n = (n << 4) + i : N(e, "expected hexadecimal character");
				e.result += O(n), e.position++;
			} else N(e, "unknown escape sequence");
			n = r = e.position;
		} else b(a) ? (B(e, n, r, !0), ie(e, U(e, !1, t)), n = r = e.position) : e.position === e.lineStart && W(e) ? N(e, "unexpected end of the document within a double quoted scalar") : (e.position++, x(a) || (r = e.position));
		N(e, "unexpected end of the stream within a double quoted scalar");
	}
	function ce(e, t) {
		let n = !0, r, i, a, o = e.tag, c, l = e.anchor, u, d, f, p, m = Object.create(null), h, g, _, v = e.input.charCodeAt(e.position);
		if (v === 91) u = 93, p = !1, c = [];
		else if (v === 123) u = 125, p = !0, c = {};
		else return !1;
		for (e.anchor !== null && F(e, e.anchor, c), v = e.input.charCodeAt(++e.position); v !== 0;) {
			if (U(e, !0, t), v = e.input.charCodeAt(e.position), v === u) return e.position++, e.tag = o, e.anchor = l, e.kind = p ? "mapping" : "sequence", e.result = c, !0;
			n ? v === 44 && N(e, "expected the node content, but found ','") : N(e, "missed comma between flow collection entries"), g = h = _ = null, d = f = !1, v === 63 && S(e.input.charCodeAt(e.position + 1)) && (d = f = !0, e.position++, U(e, !0, t)), r = e.line, i = e.lineStart, a = e.position, he(e, t, s, !1, !0), g = e.tag, h = e.result, U(e, !0, t), v = e.input.charCodeAt(e.position), (f || e.line === r) && v === 58 && (d = !0, v = e.input.charCodeAt(++e.position), U(e, !0, t), he(e, t, s, !1, !0), _ = e.result), p ? H(e, c, m, g, h, _, r, i, a) : d ? c.push(H(e, null, m, g, h, _, r, i, a)) : c.push(h), U(e, !0, t), v = e.input.charCodeAt(e.position), v === 44 ? (n = !0, v = e.input.charCodeAt(++e.position)) : n = !1;
		}
		N(e, "unexpected end of the stream within a flow collection");
	}
	function le(e, t) {
		let r, i = d, a = !1, o = !1, s = t, c = 0, l = !1, u, m = e.input.charCodeAt(e.position);
		if (m === 124) r = !1;
		else if (m === 62) r = !0;
		else return !1;
		for (e.kind = "scalar", e.result = ""; m !== 0;) if (m = e.input.charCodeAt(++e.position), m === 43 || m === 45) d === i ? i = m === 43 ? p : f : N(e, "repeat of a chomping mode identifier");
		else if ((u = E(m)) >= 0) u === 0 ? N(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : o ? N(e, "repeat of an indentation width identifier") : (s = t + u - 1, o = !0);
		else break;
		if (x(m)) {
			do
				m = e.input.charCodeAt(++e.position);
			while (x(m));
			if (m === 35) do
				m = e.input.charCodeAt(++e.position);
			while (!b(m) && m !== 0);
		}
		for (; m !== 0;) {
			for (re(e), e.lineIndent = 0, m = e.input.charCodeAt(e.position); (!o || e.lineIndent < s) && m === 32;) e.lineIndent++, m = e.input.charCodeAt(++e.position);
			if (!o && e.lineIndent > s && (s = e.lineIndent), b(m)) {
				c++;
				continue;
			}
			if (!o && s === 0 && N(e, "missing indentation for block scalar"), e.lineIndent < s) {
				i === p ? e.result += n.repeat("\n", a ? 1 + c : c) : i === d && a && (e.result += "\n");
				break;
			}
			r ? x(m) ? (l = !0, e.result += n.repeat("\n", a ? 1 + c : c)) : l ? (l = !1, e.result += n.repeat("\n", c + 1)) : c === 0 ? a && (e.result += " ") : e.result += n.repeat("\n", c) : e.result += n.repeat("\n", a ? 1 + c : c), a = !0, o = !0, c = 0;
			let t = e.position;
			for (; !b(m) && m !== 0;) m = e.input.charCodeAt(++e.position);
			B(e, t, e.position, !1);
		}
		return !0;
	}
	function ue(e, t) {
		let n = e.tag, r = e.anchor, i = [], a = !1;
		if (e.firstTabInLine !== -1) return !1;
		e.anchor !== null && F(e, e.anchor, i);
		let o = e.input.charCodeAt(e.position);
		for (; o !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, N(e, "tab characters must not be used in indentation")), !(o !== 45 || !S(e.input.charCodeAt(e.position + 1))));) {
			if (a = !0, e.position++, U(e, !0, -1) && e.lineIndent <= t) {
				i.push(null), o = e.input.charCodeAt(e.position);
				continue;
			}
			let n = e.line;
			if (he(e, t, l, !1, !0), i.push(e.result), U(e, !0, -1), o = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && o !== 0) N(e, "bad indentation of a sequence entry");
			else if (e.lineIndent < t) break;
		}
		return a ? (e.tag = n, e.anchor = r, e.kind = "sequence", e.result = i, !0) : !1;
	}
	function de(e, t, n) {
		let r, i, a, o, s = e.tag, l = e.anchor, d = {}, f = Object.create(null), p = null, m = null, h = null, g = !1, _ = !1;
		if (e.firstTabInLine !== -1) return !1;
		e.anchor !== null && F(e, e.anchor, d);
		let v = e.input.charCodeAt(e.position);
		for (; v !== 0;) {
			!g && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, N(e, "tab characters must not be used in indentation"));
			let y = e.input.charCodeAt(e.position + 1), b = e.line;
			if ((v === 63 || v === 58) && S(y)) v === 63 ? (g && (H(e, d, f, p, m, null, i, a, o), p = m = h = null), _ = !0, g = !0, r = !0) : g ? (g = !1, r = !0) : N(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, v = y;
			else {
				if (i = e.line, a = e.lineStart, o = e.position, !he(e, n, c, !1, !0)) break;
				if (e.line === b) {
					for (v = e.input.charCodeAt(e.position); x(v);) v = e.input.charCodeAt(++e.position);
					if (v === 58) v = e.input.charCodeAt(++e.position), S(v) || N(e, "a whitespace character is expected after the key-value separator within a block mapping"), g && (H(e, d, f, p, m, null, i, a, o), p = m = h = null), _ = !0, g = !1, r = !1, p = e.tag, m = e.result;
					else if (_) N(e, "can not read an implicit mapping pair; a colon is missed");
					else return e.tag = s, e.anchor = l, !0;
				} else if (_) N(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
				else return e.tag = s, e.anchor = l, !0;
			}
			if ((e.line === b || e.lineIndent > t) && (g && (i = e.line, a = e.lineStart, o = e.position), he(e, t, u, !0, r) && (g ? m = e.result : h = e.result), g || (H(e, d, f, p, m, h, i, a, o), p = m = h = null), U(e, !0, -1), v = e.input.charCodeAt(e.position)), (e.line === b || e.lineIndent > t) && v !== 0) N(e, "bad indentation of a mapping entry");
			else if (e.lineIndent < t) break;
		}
		return g && H(e, d, f, p, m, null, i, a, o), _ && (e.tag = s, e.anchor = l, e.kind = "mapping", e.result = d), _;
	}
	function G(e) {
		let t = !1, n = !1, r, i, a = e.input.charCodeAt(e.position);
		if (a !== 33) return !1;
		e.tag !== null && N(e, "duplication of a tag property"), a = e.input.charCodeAt(++e.position), a === 60 ? (t = !0, a = e.input.charCodeAt(++e.position)) : a === 33 ? (n = !0, r = "!!", a = e.input.charCodeAt(++e.position)) : r = "!";
		let s = e.position;
		if (t) {
			do
				a = e.input.charCodeAt(++e.position);
			while (a !== 0 && a !== 62);
			e.position < e.length ? (i = e.input.slice(s, e.position), a = e.input.charCodeAt(++e.position)) : N(e, "unexpected end of the stream within a verbatim tag");
		} else {
			for (; a !== 0 && !S(a);) a === 33 && (n ? N(e, "tag suffix cannot contain exclamation marks") : (r = e.input.slice(s - 1, e.position + 1), _.test(r) || N(e, "named tag handle cannot contain such characters"), n = !0, s = e.position + 1)), a = e.input.charCodeAt(++e.position);
			i = e.input.slice(s, e.position), g.test(i) && N(e, "tag suffix cannot contain flow indicator characters");
		}
		i && !v.test(i) && N(e, "tag name cannot contain such characters: " + i);
		try {
			i = decodeURIComponent(i);
		} catch {
			N(e, "tag name is malformed: " + i);
		}
		return t ? e.tag = i : o.call(e.tagMap, r) ? e.tag = e.tagMap[r] + i : r === "!" ? e.tag = "!" + i : r === "!!" ? e.tag = "tag:yaml.org,2002:" + i : N(e, "undeclared tag handle \"" + r + "\""), !0;
	}
	function fe(e) {
		let t = e.input.charCodeAt(e.position);
		if (t !== 38) return !1;
		e.anchor !== null && N(e, "duplication of an anchor property"), t = e.input.charCodeAt(++e.position);
		let n = e.position;
		for (; t !== 0 && !S(t) && !C(t);) t = e.input.charCodeAt(++e.position);
		return e.position === n && N(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(n, e.position), !0;
	}
	function pe(e) {
		let t = e.input.charCodeAt(e.position);
		if (t !== 42) return !1;
		t = e.input.charCodeAt(++e.position);
		let n = e.position;
		for (; t !== 0 && !S(t) && !C(t);) t = e.input.charCodeAt(++e.position);
		e.position === n && N(e, "name of an alias node must contain at least one character");
		let r = e.input.slice(n, e.position);
		return o.call(e.anchorMap, r) || N(e, "unidentified alias \"" + r + "\""), e.result = e.anchorMap[r], U(e, !0, -1), !0;
	}
	function me(e, t, n, r) {
		let i = L(e);
		return I(e), R(e, t), e.tag = null, e.anchor = null, e.kind = null, e.result = null, de(e, n, r) && e.kind === "mapping" ? (te(e), !0) : (ne(e), R(e, i), !1);
	}
	function he(e, t, n, r, i) {
		let a, d, f = 1, p = !1, m = !1, h = null, g, _, v;
		e.depth >= e.maxDepth && N(e, "nesting exceeded maxDepth (" + e.maxDepth + ")"), e.depth += 1, e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null;
		let y = a = d = u === n || l === n;
		if (r && U(e, !0, -1) && (p = !0, e.lineIndent > t ? f = 1 : e.lineIndent === t ? f = 0 : e.lineIndent < t && (f = -1)), f === 1) for (;;) {
			let n = e.input.charCodeAt(e.position), r = L(e);
			if (p && (n === 33 && e.tag !== null || n === 38 && e.anchor !== null) || !G(e) && !fe(e)) break;
			h === null && (h = r), U(e, !0, -1) ? (p = !0, d = y, e.lineIndent > t ? f = 1 : e.lineIndent === t ? f = 0 : e.lineIndent < t && (f = -1)) : d = !1;
		}
		if (d &&= p || i, f === 1 || u === n) {
			if (_ = s === n || c === n ? t : t + 1, v = e.position - e.lineStart, f === 1) {
				if (d && (ue(e, v) || de(e, v, _)) || ce(e, _)) m = !0;
				else {
					let t = e.input.charCodeAt(e.position);
					h !== null && y && !d && t !== 124 && t !== 62 && me(e, h, h.position - h.lineStart, _) || a && le(e, _) || oe(e, _) || se(e, _) ? m = !0 : pe(e) ? (m = !0, (e.tag !== null || e.anchor !== null) && N(e, "alias node should not have any properties")) : ae(e, _, s === n) && (m = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && F(e, e.anchor, e.result);
				}
			} else f === 0 && (m = d && ue(e, v));
		}
		if (e.tag === null) e.anchor !== null && F(e, e.anchor, e.result);
		else if (e.tag === "?") {
			e.result !== null && e.kind !== "scalar" && N(e, "unacceptable node kind for !<?> tag; it should be \"scalar\", not \"" + e.kind + "\"");
			for (let t = 0, n = e.implicitTypes.length; t < n; t += 1) if (g = e.implicitTypes[t], g.resolve(e.result)) {
				e.result = g.construct(e.result), e.tag = g.tag, e.anchor !== null && F(e, e.anchor, e.result);
				break;
			}
		} else if (e.tag !== "!") {
			if (o.call(e.typeMap[e.kind || "fallback"], e.tag)) g = e.typeMap[e.kind || "fallback"][e.tag];
			else {
				g = null;
				let t = e.typeMap.multi[e.kind || "fallback"];
				for (let n = 0, r = t.length; n < r; n += 1) if (e.tag.slice(0, t[n].tag.length) === t[n].tag) {
					g = t[n];
					break;
				}
			}
			g || N(e, "unknown tag !<" + e.tag + ">"), e.result !== null && g.kind !== e.kind && N(e, "unacceptable node kind for !<" + e.tag + "> tag; it should be \"" + g.kind + "\", not \"" + e.kind + "\""), g.resolve(e.result, e.tag) ? (e.result = g.construct(e.result, e.tag), e.anchor !== null && F(e, e.anchor, e.result)) : N(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
		}
		return e.listener !== null && e.listener("close", e), --e.depth, e.tag !== null || e.anchor !== null || m;
	}
	function ge(e) {
		let t = e.position, n = !1, r;
		for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = Object.create(null), e.anchorMap = Object.create(null); (r = e.input.charCodeAt(e.position)) !== 0 && (U(e, !0, -1), r = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || r !== 37));) {
			n = !0, r = e.input.charCodeAt(++e.position);
			let t = e.position;
			for (; r !== 0 && !S(r);) r = e.input.charCodeAt(++e.position);
			let i = e.input.slice(t, e.position), a = [];
			for (i.length < 1 && N(e, "directive name must not be less than one character in length"); r !== 0;) {
				for (; x(r);) r = e.input.charCodeAt(++e.position);
				if (r === 35) {
					do
						r = e.input.charCodeAt(++e.position);
					while (r !== 0 && !b(r));
					break;
				}
				if (b(r)) break;
				for (t = e.position; r !== 0 && !S(r);) r = e.input.charCodeAt(++e.position);
				a.push(e.input.slice(t, e.position));
			}
			r !== 0 && re(e), o.call(z, i) ? z[i](e, i, a) : P(e, "unknown document directive \"" + i + "\"");
		}
		if (U(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, U(e, !0, -1)) : n && N(e, "directives end mark is expected"), he(e, e.lineIndent - 1, u, !1, !0), U(e, !0, -1), e.checkLineBreaks && h.test(e.input.slice(t, e.position)) && P(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && W(e)) {
			e.input.charCodeAt(e.position) === 46 && (e.position += 3, U(e, !0, -1));
			return;
		}
		e.position < e.length - 1 && N(e, "end of the stream or a document separator is expected");
	}
	function _e(e, t) {
		e = String(e), t ||= {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += "\n"), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
		let n = new j(e, t), r = e.indexOf("\0");
		for (r !== -1 && (n.position = r, N(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32;) n.lineIndent += 1, n.position += 1;
		for (; n.position < n.length - 1;) ge(n);
		return n.documents;
	}
	function ve(e, t, n) {
		typeof t == "object" && t && n === void 0 && (n = t, t = null);
		let r = _e(e, n);
		if (typeof t != "function") return r;
		for (let e = 0, n = r.length; e < n; e += 1) t(r[e]);
	}
	function ye(e, t) {
		let n = _e(e, t);
		if (n.length !== 0) {
			if (n.length === 1) return n[0];
			throw new r("expected a single document in the stream, but found more");
		}
	}
	t.exports.loadAll = ve, t.exports.load = ye;
})), ur = /* @__PURE__ */ L(((e, t) => {
	var n = Hn(), r = Un(), i = cr(), a = Object.prototype.toString, o = Object.prototype.hasOwnProperty, s = 65279, c = 9, l = 10, u = 13, d = 32, f = 33, p = 34, m = 35, h = 37, g = 38, _ = 39, v = 42, y = 44, b = 45, x = 58, S = 61, C = 62, w = 63, T = 64, E = 91, D = 93, O = 96, k = 123, A = 124, ee = 125, j = {};
	j[0] = "\\0", j[7] = "\\a", j[8] = "\\b", j[9] = "\\t", j[10] = "\\n", j[11] = "\\v", j[12] = "\\f", j[13] = "\\r", j[27] = "\\e", j[34] = "\\\"", j[92] = "\\\\", j[133] = "\\N", j[160] = "\\_", j[8232] = "\\L", j[8233] = "\\P";
	var M = [
		"y",
		"Y",
		"yes",
		"Yes",
		"YES",
		"on",
		"On",
		"ON",
		"n",
		"N",
		"no",
		"No",
		"NO",
		"off",
		"Off",
		"OFF"
	], N = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
	function P(e, t) {
		if (t === null) return {};
		let n = {}, r = Object.keys(t);
		for (let i = 0, a = r.length; i < a; i += 1) {
			let a = r[i], s = String(t[a]);
			a.slice(0, 2) === "!!" && (a = "tag:yaml.org,2002:" + a.slice(2));
			let c = e.compiledTypeMap.fallback[a];
			c && o.call(c.styleAliases, s) && (s = c.styleAliases[s]), n[a] = s;
		}
		return n;
	}
	function F(e) {
		let t, i, a = e.toString(16).toUpperCase();
		if (e <= 255) t = "x", i = 2;
		else if (e <= 65535) t = "u", i = 4;
		else if (e <= 4294967295) t = "U", i = 8;
		else throw new r("code point within a string may not be greater than 0xFFFFFFFF");
		return "\\" + t + n.repeat("0", i - a.length) + a;
	}
	var I = 1, te = 2;
	function ne(e) {
		this.schema = e.schema || i, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = n.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = P(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === "\"" ? te : I, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
	}
	function L(e, t) {
		let r = n.repeat(" ", t), i = 0, a = "", o = e.length;
		for (; i < o;) {
			let t, n = e.indexOf("\n", i);
			n === -1 ? (t = e.slice(i), i = o) : (t = e.slice(i, n + 1), i = n + 1), t.length && t !== "\n" && (a += r), a += t;
		}
		return a;
	}
	function R(e, t) {
		return "\n" + n.repeat(" ", e.indent * t);
	}
	function z(e, t) {
		for (let n = 0, r = e.implicitTypes.length; n < r; n += 1) if (e.implicitTypes[n].resolve(t)) return !0;
		return !1;
	}
	function B(e) {
		return e === d || e === c;
	}
	function V(e) {
		return e >= 32 && e <= 126 || e >= 161 && e <= 55295 && e !== 8232 && e !== 8233 || e >= 57344 && e <= 65533 && e !== s || e >= 65536 && e <= 1114111;
	}
	function H(e) {
		return V(e) && e !== s && e !== u && e !== l;
	}
	function re(e, t, n) {
		let r = H(e), i = r && !B(e);
		return (n ? r : r && e !== y && e !== E && e !== D && e !== k && e !== ee) && e !== m && !(t === x && !i) || H(t) && !B(t) && e === m || t === x && i;
	}
	function U(e) {
		return V(e) && e !== s && !B(e) && e !== b && e !== w && e !== x && e !== y && e !== E && e !== D && e !== k && e !== ee && e !== m && e !== g && e !== v && e !== f && e !== A && e !== S && e !== C && e !== _ && e !== p && e !== h && e !== T && e !== O;
	}
	function W(e) {
		return !B(e) && e !== x;
	}
	function ie(e, t) {
		let n = e.charCodeAt(t), r;
		return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
	}
	function ae(e) {
		return /^\n* /.test(e);
	}
	var oe = 1, se = 2, ce = 3, le = 4, ue = 5;
	function de(e, t, n, r, i, a, o, s) {
		let c, u = 0, d = null, f = !1, p = !1, m = r !== -1, h = -1, g = U(ie(e, 0)) && W(ie(e, e.length - 1));
		if (t || o) for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
			if (u = ie(e, c), !V(u)) return ue;
			g &&= re(u, d, s), d = u;
		}
		else {
			for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
				if (u = ie(e, c), u === l) f = !0, m && (p ||= c - h - 1 > r && e[h + 1] !== " ", h = c);
				else if (!V(u)) return ue;
				g &&= re(u, d, s), d = u;
			}
			p ||= m && c - h - 1 > r && e[h + 1] !== " ";
		}
		return !f && !p ? g && !o && !i(e) ? oe : a === te ? ue : se : n > 9 && ae(e) ? ue : o ? a === te ? ue : se : p ? le : ce;
	}
	function G(e, t, n, i, a) {
		e.dump = function() {
			if (t.length === 0) return e.quotingType === te ? "\"\"" : "''";
			if (!e.noCompatMode && (M.indexOf(t) !== -1 || N.test(t))) return e.quotingType === te ? "\"" + t + "\"" : "'" + t + "'";
			let o = e.indent * Math.max(1, n), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), c = i || e.flowLevel > -1 && n >= e.flowLevel;
			function l(t) {
				return z(e, t);
			}
			switch (de(t, c, e.indent, s, l, e.quotingType, e.forceQuotes && !i, a)) {
				case oe: return t;
				case se: return "'" + t.replace(/'/g, "''") + "'";
				case ce: return "|" + fe(t, e.indent) + pe(L(t, o));
				case le: return ">" + fe(t, e.indent) + pe(L(me(t, s), o));
				case ue: return "\"" + ge(t, s) + "\"";
				default: throw new r("impossible error: invalid scalar style");
			}
		}();
	}
	function fe(e, t) {
		let n = ae(e) ? String(t) : "", r = e[e.length - 1] === "\n";
		return n + (r && (e[e.length - 2] === "\n" || e === "\n") ? "+" : r ? "" : "-") + "\n";
	}
	function pe(e) {
		return e[e.length - 1] === "\n" ? e.slice(0, -1) : e;
	}
	function me(e, t) {
		let n = /(\n+)([^\n]*)/g, r = function() {
			let r = e.indexOf("\n");
			return r = r === -1 ? e.length : r, n.lastIndex = r, he(e.slice(0, r), t);
		}(), i = e[0] === "\n" || e[0] === " ", a, o;
		for (; o = n.exec(e);) {
			let e = o[1], n = o[2];
			a = n[0] === " ", r += e + (!i && !a && n !== "" ? "\n" : "") + he(n, t), i = a;
		}
		return r;
	}
	function he(e, t) {
		if (e === "" || e[0] === " ") return e;
		let n = / [^ ]/g, r, i = 0, a, o = 0, s = 0, c = "";
		for (; r = n.exec(e);) s = r.index, s - i > t && (a = o > i ? o : s, c += "\n" + e.slice(i, a), i = a + 1), o = s;
		return c += "\n", e.length - i > t && o > i ? c += e.slice(i, o) + "\n" + e.slice(o + 1) : c += e.slice(i), c.slice(1);
	}
	function ge(e) {
		let t = "", n = 0;
		for (let r = 0; r < e.length; n >= 65536 ? r += 2 : r++) {
			n = ie(e, r);
			let i = j[n];
			!i && V(n) ? (t += e[r], n >= 65536 && (t += e[r + 1])) : t += i || F(n);
		}
		return t;
	}
	function _e(e, t, n) {
		let r = "", i = e.tag;
		for (let i = 0, a = n.length; i < a; i += 1) {
			let a = n[i];
			e.replacer && (a = e.replacer.call(n, String(i), a)), (K(e, t, a, !1, !1) || a === void 0 && K(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
		}
		e.tag = i, e.dump = "[" + r + "]";
	}
	function ve(e, t, n, r) {
		let i = "", a = e.tag;
		for (let a = 0, o = n.length; a < o; a += 1) {
			let o = n[a];
			e.replacer && (o = e.replacer.call(n, String(a), o)), (K(e, t + 1, o, !0, !0, !1, !0) || o === void 0 && K(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += R(e, t)), e.dump && l === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
		}
		e.tag = a, e.dump = i || "[]";
	}
	function ye(e, t, n) {
		let r = "", i = e.tag, a = Object.keys(n);
		for (let i = 0, o = a.length; i < o; i += 1) {
			let o = "";
			r !== "" && (o += ", "), e.condenseFlow && (o += "\"");
			let s = a[i], c = n[s];
			e.replacer && (c = e.replacer.call(n, s, c)), K(e, t, s, !1, !1) && (e.dump.length > 1024 && (o += "? "), o += e.dump + (e.condenseFlow ? "\"" : "") + ":" + (e.condenseFlow ? "" : " "), K(e, t, c, !1, !1) && (o += e.dump, r += o));
		}
		e.tag = i, e.dump = "{" + r + "}";
	}
	function be(e, t, n, i) {
		let a = "", o = e.tag, s = Object.keys(n);
		if (e.sortKeys === !0) s.sort();
		else if (typeof e.sortKeys == "function") s.sort(e.sortKeys);
		else if (e.sortKeys) throw new r("sortKeys must be a boolean or a function");
		for (let r = 0, o = s.length; r < o; r += 1) {
			let o = "";
			(!i || a !== "") && (o += R(e, t));
			let c = s[r], u = n[c];
			if (e.replacer && (u = e.replacer.call(n, c, u)), !K(e, t + 1, c, !0, !0, !0)) continue;
			let d = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024;
			d && (e.dump && l === e.dump.charCodeAt(0) ? o += "?" : o += "? "), o += e.dump, d && (o += R(e, t)), K(e, t + 1, u, !0, d) && (e.dump && l === e.dump.charCodeAt(0) ? o += ":" : o += ": ", o += e.dump, a += o);
		}
		e.tag = o, e.dump = a || "{}";
	}
	function xe(e, t, n) {
		let i = n ? e.explicitTypes : e.implicitTypes;
		for (let s = 0, c = i.length; s < c; s += 1) {
			let c = i[s];
			if ((c.instanceOf || c.predicate) && (!c.instanceOf || typeof t == "object" && t instanceof c.instanceOf) && (!c.predicate || c.predicate(t))) {
				if (e.tag = n ? c.multi && c.representName ? c.representName(t) : c.tag : "?", c.represent) {
					let n = e.styleMap[c.tag] || c.defaultStyle, i;
					if (a.call(c.represent) === "[object Function]") i = c.represent(t, n);
					else if (o.call(c.represent, n)) i = c.represent[n](t, n);
					else throw new r("!<" + c.tag + "> tag resolver accepts not \"" + n + "\" style");
					e.dump = i;
				}
				return !0;
			}
		}
		return !1;
	}
	function K(e, t, n, i, o, s, c) {
		e.tag = null, e.dump = n, xe(e, n, !1) || xe(e, n, !0);
		let l = a.call(e.dump), u = i;
		i &&= e.flowLevel < 0 || e.flowLevel > t;
		let d = l === "[object Object]" || l === "[object Array]", f, p;
		if (d && (f = e.duplicates.indexOf(n), p = f !== -1), (e.tag !== null && e.tag !== "?" || p || e.indent !== 2 && t > 0) && (o = !1), p && e.usedDuplicates[f]) e.dump = "*ref_" + f;
		else {
			if (d && p && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), l === "[object Object]") i && Object.keys(e.dump).length !== 0 ? (be(e, t, e.dump, o), p && (e.dump = "&ref_" + f + e.dump)) : (ye(e, t, e.dump), p && (e.dump = "&ref_" + f + " " + e.dump));
			else if (l === "[object Array]") i && e.dump.length !== 0 ? (e.noArrayIndent && !c && t > 0 ? ve(e, t - 1, e.dump, o) : ve(e, t, e.dump, o), p && (e.dump = "&ref_" + f + e.dump)) : (_e(e, t, e.dump), p && (e.dump = "&ref_" + f + " " + e.dump));
			else if (l === "[object String]") e.tag !== "?" && G(e, e.dump, t, s, u);
			else if (l === "[object Undefined]") return !1;
			else {
				if (e.skipInvalid) return !1;
				throw new r("unacceptable kind of an object to dump " + l);
			}
			if (e.tag !== null && e.tag !== "?") {
				let t = encodeURI(e.tag[0] === "!" ? e.tag.slice(1) : e.tag).replace(/!/g, "%21");
				t = e.tag[0] === "!" ? "!" + t : t.slice(0, 18) === "tag:yaml.org,2002:" ? "!!" + t.slice(18) : "!<" + t + ">", e.dump = t + " " + e.dump;
			}
		}
		return !0;
	}
	function Se(e, t) {
		let n = [], r = [];
		Ce(e, n, r);
		let i = r.length;
		for (let e = 0; e < i; e += 1) t.duplicates.push(n[r[e]]);
		t.usedDuplicates = Array(i);
	}
	function Ce(e, t, n) {
		if (typeof e == "object" && e) {
			let r = t.indexOf(e);
			if (r !== -1) n.indexOf(r) === -1 && n.push(r);
			else if (t.push(e), Array.isArray(e)) for (let r = 0, i = e.length; r < i; r += 1) Ce(e[r], t, n);
			else {
				let r = Object.keys(e);
				for (let i = 0, a = r.length; i < a; i += 1) Ce(e[r[i]], t, n);
			}
		}
	}
	function we(e, t) {
		t ||= {};
		let n = new ne(t);
		n.noRefs || Se(e, n);
		let r = e;
		return n.replacer && (r = n.replacer.call({ "": r }, "", r)), K(n, 0, r, !0, !0) ? n.dump + "\n" : "";
	}
	t.exports.dump = we;
})), dr = /* @__PURE__ */ L(((e, t) => {
	var n = lr(), r = ur();
	function i(e, t) {
		return function() {
			throw Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
		};
	}
	t.exports.Type = Z(), t.exports.Schema = Gn(), t.exports.FAILSAFE_SCHEMA = Yn(), t.exports.JSON_SCHEMA = er(), t.exports.CORE_SCHEMA = tr(), t.exports.DEFAULT_SCHEMA = cr(), t.exports.load = n.load, t.exports.loadAll = n.loadAll, t.exports.dump = r.dump, t.exports.YAMLException = Un(), t.exports.types = {
		binary: ir(),
		float: $n(),
		map: Jn(),
		null: Xn(),
		pairs: or(),
		set: sr(),
		timestamp: nr(),
		bool: Zn(),
		int: Qn(),
		merge: rr(),
		omap: ar(),
		seq: qn(),
		str: Kn()
	}, t.exports.safeLoad = i("safeLoad", "load"), t.exports.safeLoadAll = i("safeLoadAll", "loadAll"), t.exports.safeDump = i("safeDump", "dump");
})), fr = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.Lazy = void 0, e.Lazy = class {
		constructor(e) {
			this._value = null, this.creator = e;
		}
		get hasValue() {
			return this.creator == null;
		}
		get value() {
			if (this.creator == null) return this._value;
			let e = this.creator();
			return this.value = e, e;
		}
		set value(e) {
			this._value = e, this.creator = null;
		}
	};
})), pr = /* @__PURE__ */ L(((e, t) => {
	t.exports = {
		MAX_LENGTH: 256,
		MAX_SAFE_COMPONENT_LENGTH: 16,
		MAX_SAFE_BUILD_LENGTH: 250,
		MAX_SAFE_INTEGER: 2 ** 53 - 1 || 
		/* istanbul ignore next */ 9007199254740991,
		RELEASE_TYPES: [
			"major",
			"premajor",
			"minor",
			"preminor",
			"patch",
			"prepatch",
			"prerelease"
		],
		SEMVER_SPEC_VERSION: "2.0.0",
		FLAG_INCLUDE_PRERELEASE: 1,
		FLAG_LOOSE: 2
	};
})), mr = /* @__PURE__ */ L(((e, t) => {
	t.exports = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {};
})), hr = /* @__PURE__ */ L(((e, t) => {
	var { MAX_SAFE_COMPONENT_LENGTH: n, MAX_SAFE_BUILD_LENGTH: r, MAX_LENGTH: i } = pr(), a = mr();
	e = t.exports = {};
	var o = e.re = [], s = e.safeRe = [], c = e.src = [], l = e.safeSrc = [], u = e.t = {}, d = 0, f = "[a-zA-Z0-9-]", p = [
		["\\s", 1],
		["\\d", i],
		[f, r]
	], m = (e) => {
		for (let [t, n] of p) e = e.split(`${t}*`).join(`${t}{0,${n}}`).split(`${t}+`).join(`${t}{1,${n}}`);
		return e;
	}, h = (e, t, n) => {
		let r = m(t), i = d++;
		a(e, i, t), u[e] = i, c[i] = t, l[i] = r, o[i] = new RegExp(t, n ? "g" : void 0), s[i] = new RegExp(r, n ? "g" : void 0);
	};
	h("NUMERICIDENTIFIER", "0|[1-9]\\d*"), h("NUMERICIDENTIFIERLOOSE", "\\d+"), h("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${f}*`), h("MAINVERSION", `(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})\\.(${c[u.NUMERICIDENTIFIER]})`), h("MAINVERSIONLOOSE", `(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})\\.(${c[u.NUMERICIDENTIFIERLOOSE]})`), h("PRERELEASEIDENTIFIER", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIER]})`), h("PRERELEASEIDENTIFIERLOOSE", `(?:${c[u.NONNUMERICIDENTIFIER]}|${c[u.NUMERICIDENTIFIERLOOSE]})`), h("PRERELEASE", `(?:-(${c[u.PRERELEASEIDENTIFIER]}(?:\\.${c[u.PRERELEASEIDENTIFIER]})*))`), h("PRERELEASELOOSE", `(?:-?(${c[u.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[u.PRERELEASEIDENTIFIERLOOSE]})*))`), h("BUILDIDENTIFIER", `${f}+`), h("BUILD", `(?:\\+(${c[u.BUILDIDENTIFIER]}(?:\\.${c[u.BUILDIDENTIFIER]})*))`), h("FULLPLAIN", `v?${c[u.MAINVERSION]}${c[u.PRERELEASE]}?${c[u.BUILD]}?`), h("FULL", `^${c[u.FULLPLAIN]}$`), h("LOOSEPLAIN", `[v=\\s]*${c[u.MAINVERSIONLOOSE]}${c[u.PRERELEASELOOSE]}?${c[u.BUILD]}?`), h("LOOSE", `^${c[u.LOOSEPLAIN]}$`), h("GTLT", "((?:<|>)?=?)"), h("XRANGEIDENTIFIERLOOSE", `${c[u.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), h("XRANGEIDENTIFIER", `${c[u.NUMERICIDENTIFIER]}|x|X|\\*`), h("XRANGEPLAIN", `[v=\\s]*(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:\\.(${c[u.XRANGEIDENTIFIER]})(?:${c[u.PRERELEASE]})?${c[u.BUILD]}?)?)?`), h("XRANGEPLAINLOOSE", `[v=\\s]*(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[u.XRANGEIDENTIFIERLOOSE]})(?:${c[u.PRERELEASELOOSE]})?${c[u.BUILD]}?)?)?`), h("XRANGE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAIN]}$`), h("XRANGELOOSE", `^${c[u.GTLT]}\\s*${c[u.XRANGEPLAINLOOSE]}$`), h("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), h("COERCE", `${c[u.COERCEPLAIN]}(?:$|[^\\d])`), h("COERCEFULL", c[u.COERCEPLAIN] + `(?:${c[u.PRERELEASE]})?(?:${c[u.BUILD]})?(?:$|[^\\d])`), h("COERCERTL", c[u.COERCE], !0), h("COERCERTLFULL", c[u.COERCEFULL], !0), h("LONETILDE", "(?:~>?)"), h("TILDETRIM", `(\\s*)${c[u.LONETILDE]}\\s+`, !0), e.tildeTrimReplace = "$1~", h("TILDE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAIN]}$`), h("TILDELOOSE", `^${c[u.LONETILDE]}${c[u.XRANGEPLAINLOOSE]}$`), h("LONECARET", "(?:\\^)"), h("CARETTRIM", `(\\s*)${c[u.LONECARET]}\\s+`, !0), e.caretTrimReplace = "$1^", h("CARET", `^${c[u.LONECARET]}${c[u.XRANGEPLAIN]}$`), h("CARETLOOSE", `^${c[u.LONECARET]}${c[u.XRANGEPLAINLOOSE]}$`), h("COMPARATORLOOSE", `^${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]})$|^$`), h("COMPARATOR", `^${c[u.GTLT]}\\s*(${c[u.FULLPLAIN]})$|^$`), h("COMPARATORTRIM", `(\\s*)${c[u.GTLT]}\\s*(${c[u.LOOSEPLAIN]}|${c[u.XRANGEPLAIN]})`, !0), e.comparatorTrimReplace = "$1$2$3", h("HYPHENRANGE", `^\\s*(${c[u.XRANGEPLAIN]})\\s+-\\s+(${c[u.XRANGEPLAIN]})\\s*$`), h("HYPHENRANGELOOSE", `^\\s*(${c[u.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[u.XRANGEPLAINLOOSE]})\\s*$`), h("STAR", "(<|>)?=?\\s*\\*"), h("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), h("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})), gr = /* @__PURE__ */ L(((e, t) => {
	var n = Object.freeze({ loose: !0 }), r = Object.freeze({});
	t.exports = (e) => e ? typeof e == "object" ? e : n : r;
})), _r = /* @__PURE__ */ L(((e, t) => {
	var n = /^[0-9]+$/, r = (e, t) => {
		if (typeof e == "number" && typeof t == "number") return e === t ? 0 : e < t ? -1 : 1;
		let r = n.test(e), i = n.test(t);
		return r && i && (e = +e, t = +t), e === t ? 0 : r && !i ? -1 : i && !r ? 1 : e < t ? -1 : 1;
	};
	t.exports = {
		compareIdentifiers: r,
		rcompareIdentifiers: (e, t) => r(t, e)
	};
})), Q = /* @__PURE__ */ L(((e, t) => {
	var n = mr(), { MAX_LENGTH: r, MAX_SAFE_INTEGER: i } = pr(), { safeRe: a, t: o } = hr(), s = gr(), { compareIdentifiers: c } = _r();
	t.exports = class e {
		constructor(t, c) {
			if (c = s(c), t instanceof e) {
				if (t.loose === !!c.loose && t.includePrerelease === !!c.includePrerelease) return t;
				t = t.version;
			} else if (typeof t != "string") throw TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
			if (t.length > r) throw TypeError(`version is longer than ${r} characters`);
			n("SemVer", t, c), this.options = c, this.loose = !!c.loose, this.includePrerelease = !!c.includePrerelease;
			let l = t.trim().match(c.loose ? a[o.LOOSE] : a[o.FULL]);
			if (!l) throw TypeError(`Invalid Version: ${t}`);
			if (this.raw = t, this.major = +l[1], this.minor = +l[2], this.patch = +l[3], this.major > i || this.major < 0) throw TypeError("Invalid major version");
			if (this.minor > i || this.minor < 0) throw TypeError("Invalid minor version");
			if (this.patch > i || this.patch < 0) throw TypeError("Invalid patch version");
			this.prerelease = l[4] ? l[4].split(".").map((e) => {
				if (/^[0-9]+$/.test(e)) {
					let t = +e;
					if (t >= 0 && t < i) return t;
				}
				return e;
			}) : [], this.build = l[5] ? l[5].split(".") : [], this.format();
		}
		format() {
			return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
		}
		toString() {
			return this.version;
		}
		compare(t) {
			if (n("SemVer.compare", this.version, this.options, t), !(t instanceof e)) {
				if (typeof t == "string" && t === this.version) return 0;
				t = new e(t, this.options);
			}
			return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
		}
		compareMain(t) {
			return t instanceof e || (t = new e(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : +(this.patch > t.patch);
		}
		comparePre(t) {
			if (t instanceof e || (t = new e(t, this.options)), this.prerelease.length && !t.prerelease.length) return -1;
			if (!this.prerelease.length && t.prerelease.length) return 1;
			if (!this.prerelease.length && !t.prerelease.length) return 0;
			let r = 0;
			do {
				let e = this.prerelease[r], i = t.prerelease[r];
				if (n("prerelease compare", r, e, i), e === void 0 && i === void 0) return 0;
				if (i === void 0) return 1;
				if (e === void 0) return -1;
				if (e !== i) return c(e, i);
			} while (++r);
		}
		compareBuild(t) {
			t instanceof e || (t = new e(t, this.options));
			let r = 0;
			do {
				let e = this.build[r], i = t.build[r];
				if (n("build compare", r, e, i), e === void 0 && i === void 0) return 0;
				if (i === void 0) return 1;
				if (e === void 0) return -1;
				if (e !== i) return c(e, i);
			} while (++r);
		}
		inc(e, t, n) {
			if (e.startsWith("pre")) {
				if (!t && n === !1) throw Error("invalid increment argument: identifier is empty");
				if (t) {
					let e = `-${t}`.match(this.options.loose ? a[o.PRERELEASELOOSE] : a[o.PRERELEASE]);
					if (!e || e[1] !== t) throw Error(`invalid identifier: ${t}`);
				}
			}
			switch (e) {
				case "premajor":
					this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", t, n);
					break;
				case "preminor":
					this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", t, n);
					break;
				case "prepatch":
					this.prerelease.length = 0, this.inc("patch", t, n), this.inc("pre", t, n);
					break;
				case "prerelease":
					this.prerelease.length === 0 && this.inc("patch", t, n), this.inc("pre", t, n);
					break;
				case "release":
					if (this.prerelease.length === 0) throw Error(`version ${this.raw} is not a prerelease`);
					this.prerelease.length = 0;
					break;
				case "major":
					(this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
					break;
				case "minor":
					(this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
					break;
				case "patch":
					this.prerelease.length === 0 && this.patch++, this.prerelease = [];
					break;
				case "pre": {
					let e = +!!Number(n);
					if (this.prerelease.length === 0) this.prerelease = [e];
					else {
						let r = this.prerelease.length;
						for (; --r >= 0;) typeof this.prerelease[r] == "number" && (this.prerelease[r]++, r = -2);
						if (r === -1) {
							if (t === this.prerelease.join(".") && n === !1) throw Error("invalid increment argument: identifier already exists");
							this.prerelease.push(e);
						}
					}
					if (t) {
						let r = [t, e];
						n === !1 && (r = [t]), c(this.prerelease[0], t) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = r) : this.prerelease = r;
					}
					break;
				}
				default: throw Error(`invalid increment argument: ${e}`);
			}
			return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
		}
	};
})), vr = /* @__PURE__ */ L(((e, t) => {
	var n = Q();
	t.exports = (e, t, r = !1) => {
		if (e instanceof n) return e;
		try {
			return new n(e, t);
		} catch (e) {
			if (!r) return null;
			throw e;
		}
	};
})), yr = /* @__PURE__ */ L(((e, t) => {
	var n = vr();
	t.exports = (e, t) => {
		let r = n(e, t);
		return r ? r.version : null;
	};
})), br = /* @__PURE__ */ L(((e, t) => {
	var n = vr();
	t.exports = (e, t) => {
		let r = n(e.trim().replace(/^[=v]+/, ""), t);
		return r ? r.version : null;
	};
})), xr = /* @__PURE__ */ L(((e, t) => {
	var n = Q();
	t.exports = (e, t, r, i, a) => {
		typeof r == "string" && (a = i, i = r, r = void 0);
		try {
			return new n(e instanceof n ? e.version : e, r).inc(t, i, a).version;
		} catch {
			return null;
		}
	};
})), Sr = /* @__PURE__ */ L(((e, t) => {
	var n = vr();
	t.exports = (e, t) => {
		let r = n(e, null, !0), i = n(t, null, !0), a = r.compare(i);
		if (a === 0) return null;
		let o = a > 0, s = o ? r : i, c = o ? i : r, l = !!s.prerelease.length;
		if (c.prerelease.length && !l) {
			if (!c.patch && !c.minor) return "major";
			if (c.compareMain(s) === 0) return c.minor && !c.patch ? "minor" : "patch";
		}
		let u = l ? "pre" : "";
		return r.major === i.major ? r.minor === i.minor ? r.patch === i.patch ? "prerelease" : u + "patch" : u + "minor" : u + "major";
	};
})), Cr = /* @__PURE__ */ L(((e, t) => {
	var n = Q();
	t.exports = (e, t) => new n(e, t).major;
})), wr = /* @__PURE__ */ L(((e, t) => {
	var n = Q();
	t.exports = (e, t) => new n(e, t).minor;
})), Tr = /* @__PURE__ */ L(((e, t) => {
	var n = Q();
	t.exports = (e, t) => new n(e, t).patch;
})), Er = /* @__PURE__ */ L(((e, t) => {
	var n = vr();
	t.exports = (e, t) => {
		let r = n(e, t);
		return r && r.prerelease.length ? r.prerelease : null;
	};
})), Dr = /* @__PURE__ */ L(((e, t) => {
	var n = Q();
	t.exports = (e, t, r) => new n(e, r).compare(new n(t, r));
})), Or = /* @__PURE__ */ L(((e, t) => {
	var n = Dr();
	t.exports = (e, t, r) => n(t, e, r);
})), kr = /* @__PURE__ */ L(((e, t) => {
	var n = Dr();
	t.exports = (e, t) => n(e, t, !0);
})), Ar = /* @__PURE__ */ L(((e, t) => {
	var n = Q();
	t.exports = (e, t, r) => {
		let i = new n(e, r), a = new n(t, r);
		return i.compare(a) || i.compareBuild(a);
	};
})), jr = /* @__PURE__ */ L(((e, t) => {
	var n = Ar();
	t.exports = (e, t) => e.sort((e, r) => n(e, r, t));
})), Mr = /* @__PURE__ */ L(((e, t) => {
	var n = Ar();
	t.exports = (e, t) => e.sort((e, r) => n(r, e, t));
})), Nr = /* @__PURE__ */ L(((e, t) => {
	var n = Dr();
	t.exports = (e, t, r) => n(e, t, r) > 0;
})), Pr = /* @__PURE__ */ L(((e, t) => {
	var n = Dr();
	t.exports = (e, t, r) => n(e, t, r) < 0;
})), Fr = /* @__PURE__ */ L(((e, t) => {
	var n = Dr();
	t.exports = (e, t, r) => n(e, t, r) === 0;
})), Ir = /* @__PURE__ */ L(((e, t) => {
	var n = Dr();
	t.exports = (e, t, r) => n(e, t, r) !== 0;
})), Lr = /* @__PURE__ */ L(((e, t) => {
	var n = Dr();
	t.exports = (e, t, r) => n(e, t, r) >= 0;
})), Rr = /* @__PURE__ */ L(((e, t) => {
	var n = Dr();
	t.exports = (e, t, r) => n(e, t, r) <= 0;
})), zr = /* @__PURE__ */ L(((e, t) => {
	var n = Fr(), r = Ir(), i = Nr(), a = Lr(), o = Pr(), s = Rr();
	t.exports = (e, t, c, l) => {
		switch (t) {
			case "===": return typeof e == "object" && (e = e.version), typeof c == "object" && (c = c.version), e === c;
			case "!==": return typeof e == "object" && (e = e.version), typeof c == "object" && (c = c.version), e !== c;
			case "":
			case "=":
			case "==": return n(e, c, l);
			case "!=": return r(e, c, l);
			case ">": return i(e, c, l);
			case ">=": return a(e, c, l);
			case "<": return o(e, c, l);
			case "<=": return s(e, c, l);
			default: throw TypeError(`Invalid operator: ${t}`);
		}
	};
})), Br = /* @__PURE__ */ L(((e, t) => {
	var n = Q(), r = vr(), { safeRe: i, t: a } = hr();
	t.exports = (e, t) => {
		if (e instanceof n) return e;
		if (typeof e == "number" && (e = String(e)), typeof e != "string") return null;
		t ||= {};
		let o = null;
		if (!t.rtl) o = e.match(t.includePrerelease ? i[a.COERCEFULL] : i[a.COERCE]);
		else {
			let n = t.includePrerelease ? i[a.COERCERTLFULL] : i[a.COERCERTL], r;
			for (; (r = n.exec(e)) && (!o || o.index + o[0].length !== e.length);) (!o || r.index + r[0].length !== o.index + o[0].length) && (o = r), n.lastIndex = r.index + r[1].length + r[2].length;
			n.lastIndex = -1;
		}
		if (o === null) return null;
		let s = o[2];
		return r(`${s}.${o[3] || "0"}.${o[4] || "0"}${t.includePrerelease && o[5] ? `-${o[5]}` : ""}${t.includePrerelease && o[6] ? `+${o[6]}` : ""}`, t);
	};
})), Vr = /* @__PURE__ */ L(((e, t) => {
	t.exports = class {
		constructor() {
			this.max = 1e3, this.map = /* @__PURE__ */ new Map();
		}
		get(e) {
			let t = this.map.get(e);
			if (t !== void 0) return this.map.delete(e), this.map.set(e, t), t;
		}
		delete(e) {
			return this.map.delete(e);
		}
		set(e, t) {
			if (!this.delete(e) && t !== void 0) {
				if (this.map.size >= this.max) {
					let e = this.map.keys().next().value;
					this.delete(e);
				}
				this.map.set(e, t);
			}
			return this;
		}
	};
})), Hr = /* @__PURE__ */ L(((e, t) => {
	var n = /\s+/g;
	t.exports = class e {
		constructor(t, r) {
			if (r = i(r), t instanceof e) return t.loose === !!r.loose && t.includePrerelease === !!r.includePrerelease ? t : new e(t.raw, r);
			if (t instanceof a) return this.raw = t.value, this.set = [[t]], this.formatted = void 0, this;
			if (this.options = r, this.loose = !!r.loose, this.includePrerelease = !!r.includePrerelease, this.raw = t.trim().replace(n, " "), this.set = this.raw.split("||").map((e) => this.parseRange(e.trim())).filter((e) => e.length), !this.set.length) throw TypeError(`Invalid SemVer Range: ${this.raw}`);
			if (this.set.length > 1) {
				let e = this.set[0];
				if (this.set = this.set.filter((e) => !h(e[0])), this.set.length === 0) this.set = [e];
				else if (this.set.length > 1) {
					for (let e of this.set) if (e.length === 1 && g(e[0])) {
						this.set = [e];
						break;
					}
				}
			}
			this.formatted = void 0;
		}
		get range() {
			if (this.formatted === void 0) {
				this.formatted = "";
				for (let e = 0; e < this.set.length; e++) {
					e > 0 && (this.formatted += "||");
					let t = this.set[e];
					for (let e = 0; e < t.length; e++) e > 0 && (this.formatted += " "), this.formatted += t[e].toString().trim();
				}
			}
			return this.formatted;
		}
		format() {
			return this.range;
		}
		toString() {
			return this.range;
		}
		parseRange(e) {
			let t = ((this.options.includePrerelease && p) | (this.options.loose && m)) + ":" + e, n = r.get(t);
			if (n) return n;
			let i = this.options.loose, s = i ? c[l.HYPHENRANGELOOSE] : c[l.HYPHENRANGE];
			e = e.replace(s, O(this.options.includePrerelease)), o("hyphen replace", e), e = e.replace(c[l.COMPARATORTRIM], u), o("comparator trim", e), e = e.replace(c[l.TILDETRIM], d), o("tilde trim", e), e = e.replace(c[l.CARETTRIM], f), o("caret trim", e);
			let g = e.split(" ").map((e) => v(e, this.options)).join(" ").split(/\s+/).map((e) => D(e, this.options));
			i && (g = g.filter((e) => (o("loose invalid filter", e, this.options), !!e.match(c[l.COMPARATORLOOSE])))), o("range list", g);
			let _ = /* @__PURE__ */ new Map(), y = g.map((e) => new a(e, this.options));
			for (let e of y) {
				if (h(e)) return [e];
				_.set(e.value, e);
			}
			_.size > 1 && _.has("") && _.delete("");
			let b = [..._.values()];
			return r.set(t, b), b;
		}
		intersects(t, n) {
			if (!(t instanceof e)) throw TypeError("a Range is required");
			return this.set.some((e) => _(e, n) && t.set.some((t) => _(t, n) && e.every((e) => t.every((t) => e.intersects(t, n)))));
		}
		test(e) {
			if (!e) return !1;
			if (typeof e == "string") try {
				e = new s(e, this.options);
			} catch {
				return !1;
			}
			for (let t = 0; t < this.set.length; t++) if (k(this.set[t], e, this.options)) return !0;
			return !1;
		}
	};
	var r = new (Vr())(), i = gr(), a = Ur(), o = mr(), s = Q(), { safeRe: c, t: l, comparatorTrimReplace: u, tildeTrimReplace: d, caretTrimReplace: f } = hr(), { FLAG_INCLUDE_PRERELEASE: p, FLAG_LOOSE: m } = pr(), h = (e) => e.value === "<0.0.0-0", g = (e) => e.value === "", _ = (e, t) => {
		let n = !0, r = e.slice(), i = r.pop();
		for (; n && r.length;) n = r.every((e) => i.intersects(e, t)), i = r.pop();
		return n;
	}, v = (e, t) => (e = e.replace(c[l.BUILD], ""), o("comp", e, t), e = S(e, t), o("caret", e), e = b(e, t), o("tildes", e), e = w(e, t), o("xrange", e), e = E(e, t), o("stars", e), e), y = (e) => !e || e.toLowerCase() === "x" || e === "*", b = (e, t) => e.trim().split(/\s+/).map((e) => x(e, t)).join(" "), x = (e, t) => {
		let n = t.loose ? c[l.TILDELOOSE] : c[l.TILDE];
		return e.replace(n, (t, n, r, i, a) => {
			o("tilde", e, t, n, r, i, a);
			let s;
			return y(n) ? s = "" : y(r) ? s = `>=${n}.0.0 <${+n + 1}.0.0-0` : y(i) ? s = `>=${n}.${r}.0 <${n}.${+r + 1}.0-0` : a ? (o("replaceTilde pr", a), s = `>=${n}.${r}.${i}-${a} <${n}.${+r + 1}.0-0`) : s = `>=${n}.${r}.${i} <${n}.${+r + 1}.0-0`, o("tilde return", s), s;
		});
	}, S = (e, t) => e.trim().split(/\s+/).map((e) => C(e, t)).join(" "), C = (e, t) => {
		o("caret", e, t);
		let n = t.loose ? c[l.CARETLOOSE] : c[l.CARET], r = t.includePrerelease ? "-0" : "";
		return e.replace(n, (t, n, i, a, s) => {
			o("caret", e, t, n, i, a, s);
			let c;
			return y(n) ? c = "" : y(i) ? c = `>=${n}.0.0${r} <${+n + 1}.0.0-0` : y(a) ? c = n === "0" ? `>=${n}.${i}.0${r} <${n}.${+i + 1}.0-0` : `>=${n}.${i}.0${r} <${+n + 1}.0.0-0` : s ? (o("replaceCaret pr", s), c = n === "0" ? i === "0" ? `>=${n}.${i}.${a}-${s} <${n}.${i}.${+a + 1}-0` : `>=${n}.${i}.${a}-${s} <${n}.${+i + 1}.0-0` : `>=${n}.${i}.${a}-${s} <${+n + 1}.0.0-0`) : (o("no pr"), c = n === "0" ? i === "0" ? `>=${n}.${i}.${a}${r} <${n}.${i}.${+a + 1}-0` : `>=${n}.${i}.${a}${r} <${n}.${+i + 1}.0-0` : `>=${n}.${i}.${a} <${+n + 1}.0.0-0`), o("caret return", c), c;
		});
	}, w = (e, t) => (o("replaceXRanges", e, t), e.split(/\s+/).map((e) => T(e, t)).join(" ")), T = (e, t) => {
		e = e.trim();
		let n = t.loose ? c[l.XRANGELOOSE] : c[l.XRANGE];
		return e.replace(n, (n, r, i, a, s, c) => {
			o("xRange", e, n, r, i, a, s, c);
			let l = y(i), u = l || y(a), d = u || y(s), f = d;
			return r === "=" && f && (r = ""), c = t.includePrerelease ? "-0" : "", l ? n = r === ">" || r === "<" ? "<0.0.0-0" : "*" : r && f ? (u && (a = 0), s = 0, r === ">" ? (r = ">=", u ? (i = +i + 1, a = 0, s = 0) : (a = +a + 1, s = 0)) : r === "<=" && (r = "<", u ? i = +i + 1 : a = +a + 1), r === "<" && (c = "-0"), n = `${r + i}.${a}.${s}${c}`) : u ? n = `>=${i}.0.0${c} <${+i + 1}.0.0-0` : d && (n = `>=${i}.${a}.0${c} <${i}.${+a + 1}.0-0`), o("xRange return", n), n;
		});
	}, E = (e, t) => (o("replaceStars", e, t), e.trim().replace(c[l.STAR], "")), D = (e, t) => (o("replaceGTE0", e, t), e.trim().replace(c[t.includePrerelease ? l.GTE0PRE : l.GTE0], "")), O = (e) => (t, n, r, i, a, o, s, c, l, u, d, f) => (n = y(r) ? "" : y(i) ? `>=${r}.0.0${e ? "-0" : ""}` : y(a) ? `>=${r}.${i}.0${e ? "-0" : ""}` : o ? `>=${n}` : `>=${n}${e ? "-0" : ""}`, c = y(l) ? "" : y(u) ? `<${+l + 1}.0.0-0` : y(d) ? `<${l}.${+u + 1}.0-0` : f ? `<=${l}.${u}.${d}-${f}` : e ? `<${l}.${u}.${+d + 1}-0` : `<=${c}`, `${n} ${c}`.trim()), k = (e, t, n) => {
		for (let n = 0; n < e.length; n++) if (!e[n].test(t)) return !1;
		if (t.prerelease.length && !n.includePrerelease) {
			for (let n = 0; n < e.length; n++) if (o(e[n].semver), e[n].semver !== a.ANY && e[n].semver.prerelease.length > 0) {
				let r = e[n].semver;
				if (r.major === t.major && r.minor === t.minor && r.patch === t.patch) return !0;
			}
			return !1;
		}
		return !0;
	};
})), Ur = /* @__PURE__ */ L(((e, t) => {
	var n = Symbol("SemVer ANY");
	t.exports = class e {
		static get ANY() {
			return n;
		}
		constructor(t, i) {
			if (i = r(i), t instanceof e) {
				if (t.loose === !!i.loose) return t;
				t = t.value;
			}
			t = t.trim().split(/\s+/).join(" "), s("comparator", t, i), this.options = i, this.loose = !!i.loose, this.parse(t), this.value = this.semver === n ? "" : this.operator + this.semver.version, s("comp", this);
		}
		parse(e) {
			let t = this.options.loose ? i[a.COMPARATORLOOSE] : i[a.COMPARATOR], r = e.match(t);
			if (!r) throw TypeError(`Invalid comparator: ${e}`);
			this.operator = r[1] === void 0 ? "" : r[1], this.operator === "=" && (this.operator = ""), this.semver = r[2] ? new c(r[2], this.options.loose) : n;
		}
		toString() {
			return this.value;
		}
		test(e) {
			if (s("Comparator.test", e, this.options.loose), this.semver === n || e === n) return !0;
			if (typeof e == "string") try {
				e = new c(e, this.options);
			} catch {
				return !1;
			}
			return o(e, this.operator, this.semver, this.options);
		}
		intersects(t, n) {
			if (!(t instanceof e)) throw TypeError("a Comparator is required");
			return this.operator === "" ? this.value === "" || new l(t.value, n).test(this.value) : t.operator === "" ? t.value === "" || new l(this.value, n).test(t.semver) : (n = r(n), n.includePrerelease && (this.value === "<0.0.0-0" || t.value === "<0.0.0-0") || !n.includePrerelease && (this.value.startsWith("<0.0.0") || t.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && t.operator.startsWith(">") || this.operator.startsWith("<") && t.operator.startsWith("<") || this.semver.version === t.semver.version && this.operator.includes("=") && t.operator.includes("=") || o(this.semver, "<", t.semver, n) && this.operator.startsWith(">") && t.operator.startsWith("<") || o(this.semver, ">", t.semver, n) && this.operator.startsWith("<") && t.operator.startsWith(">")));
		}
	};
	var r = gr(), { safeRe: i, t: a } = hr(), o = zr(), s = mr(), c = Q(), l = Hr();
})), Wr = /* @__PURE__ */ L(((e, t) => {
	var n = Hr();
	t.exports = (e, t, r) => {
		try {
			t = new n(t, r);
		} catch {
			return !1;
		}
		return t.test(e);
	};
})), Gr = /* @__PURE__ */ L(((e, t) => {
	var n = Hr();
	t.exports = (e, t) => new n(e, t).set.map((e) => e.map((e) => e.value).join(" ").trim().split(" "));
})), Kr = /* @__PURE__ */ L(((e, t) => {
	var n = Q(), r = Hr();
	t.exports = (e, t, i) => {
		let a = null, o = null, s = null;
		try {
			s = new r(t, i);
		} catch {
			return null;
		}
		return e.forEach((e) => {
			s.test(e) && (!a || o.compare(e) === -1) && (a = e, o = new n(a, i));
		}), a;
	};
})), qr = /* @__PURE__ */ L(((e, t) => {
	var n = Q(), r = Hr();
	t.exports = (e, t, i) => {
		let a = null, o = null, s = null;
		try {
			s = new r(t, i);
		} catch {
			return null;
		}
		return e.forEach((e) => {
			s.test(e) && (!a || o.compare(e) === 1) && (a = e, o = new n(a, i));
		}), a;
	};
})), Jr = /* @__PURE__ */ L(((e, t) => {
	var n = Q(), r = Hr(), i = Nr();
	t.exports = (e, t) => {
		e = new r(e, t);
		let a = new n("0.0.0");
		if (e.test(a) || (a = new n("0.0.0-0"), e.test(a))) return a;
		a = null;
		for (let t = 0; t < e.set.length; ++t) {
			let r = e.set[t], o = null;
			r.forEach((e) => {
				let t = new n(e.semver.version);
				switch (e.operator) {
					case ">": t.prerelease.length === 0 ? t.patch++ : t.prerelease.push(0), t.raw = t.format();
					case "":
					case ">=":
						(!o || i(t, o)) && (o = t);
						break;
					case "<":
					case "<=": break;
					/* istanbul ignore next */
					default: throw Error(`Unexpected operation: ${e.operator}`);
				}
			}), o && (!a || i(a, o)) && (a = o);
		}
		return a && e.test(a) ? a : null;
	};
})), Yr = /* @__PURE__ */ L(((e, t) => {
	var n = Hr();
	t.exports = (e, t) => {
		try {
			return new n(e, t).range || "*";
		} catch {
			return null;
		}
	};
})), Xr = /* @__PURE__ */ L(((e, t) => {
	var n = Q(), r = Ur(), { ANY: i } = r, a = Hr(), o = Wr(), s = Nr(), c = Pr(), l = Rr(), u = Lr();
	t.exports = (e, t, d, f) => {
		e = new n(e, f), t = new a(t, f);
		let p, m, h, g, _;
		switch (d) {
			case ">":
				p = s, m = l, h = c, g = ">", _ = ">=";
				break;
			case "<":
				p = c, m = u, h = s, g = "<", _ = "<=";
				break;
			default: throw TypeError("Must provide a hilo val of \"<\" or \">\"");
		}
		if (o(e, t, f)) return !1;
		for (let n = 0; n < t.set.length; ++n) {
			let a = t.set[n], o = null, s = null;
			if (a.forEach((e) => {
				e.semver === i && (e = new r(">=0.0.0")), o ||= e, s ||= e, p(e.semver, o.semver, f) ? o = e : h(e.semver, s.semver, f) && (s = e);
			}), o.operator === g || o.operator === _ || (!s.operator || s.operator === g) && m(e, s.semver) || s.operator === _ && h(e, s.semver)) return !1;
		}
		return !0;
	};
})), Zr = /* @__PURE__ */ L(((e, t) => {
	var n = Xr();
	t.exports = (e, t, r) => n(e, t, ">", r);
})), Qr = /* @__PURE__ */ L(((e, t) => {
	var n = Xr();
	t.exports = (e, t, r) => n(e, t, "<", r);
})), $r = /* @__PURE__ */ L(((e, t) => {
	var n = Hr();
	t.exports = (e, t, r) => (e = new n(e, r), t = new n(t, r), e.intersects(t, r));
})), ei = /* @__PURE__ */ L(((e, t) => {
	var n = Wr(), r = Dr();
	t.exports = (e, t, i) => {
		let a = [], o = null, s = null, c = e.sort((e, t) => r(e, t, i));
		for (let e of c) n(e, t, i) ? (s = e, o ||= e) : (s && a.push([o, s]), s = null, o = null);
		o && a.push([o, null]);
		let l = [];
		for (let [e, t] of a) e === t ? l.push(e) : !t && e === c[0] ? l.push("*") : t ? e === c[0] ? l.push(`<=${t}`) : l.push(`${e} - ${t}`) : l.push(`>=${e}`);
		let u = l.join(" || "), d = typeof t.raw == "string" ? t.raw : String(t);
		return u.length < d.length ? u : t;
	};
})), ti = /* @__PURE__ */ L(((e, t) => {
	var n = Hr(), r = Ur(), { ANY: i } = r, a = Wr(), o = Dr(), s = (e, t, r = {}) => {
		if (e === t) return !0;
		e = new n(e, r), t = new n(t, r);
		let i = !1;
		OUTER: for (let n of e.set) {
			for (let e of t.set) {
				let t = u(n, e, r);
				if (i ||= t !== null, t) continue OUTER;
			}
			if (i) return !1;
		}
		return !0;
	}, c = [new r(">=0.0.0-0")], l = [new r(">=0.0.0")], u = (e, t, n) => {
		if (e === t) return !0;
		if (e.length === 1 && e[0].semver === i) {
			if (t.length === 1 && t[0].semver === i) return !0;
			e = n.includePrerelease ? c : l;
		}
		if (t.length === 1 && t[0].semver === i) {
			if (n.includePrerelease) return !0;
			t = l;
		}
		let r = /* @__PURE__ */ new Set(), s, u;
		for (let t of e) t.operator === ">" || t.operator === ">=" ? s = d(s, t, n) : t.operator === "<" || t.operator === "<=" ? u = f(u, t, n) : r.add(t.semver);
		if (r.size > 1) return null;
		let p;
		if (s && u && (p = o(s.semver, u.semver, n), p > 0 || p === 0 && (s.operator !== ">=" || u.operator !== "<="))) return null;
		for (let e of r) {
			if (s && !a(e, String(s), n) || u && !a(e, String(u), n)) return null;
			for (let r of t) if (!a(e, String(r), n)) return !1;
			return !0;
		}
		let m, h, g, _, v = u && !n.includePrerelease && u.semver.prerelease.length ? u.semver : !1, y = s && !n.includePrerelease && s.semver.prerelease.length ? s.semver : !1;
		v && v.prerelease.length === 1 && u.operator === "<" && v.prerelease[0] === 0 && (v = !1);
		for (let e of t) {
			if (_ = _ || e.operator === ">" || e.operator === ">=", g = g || e.operator === "<" || e.operator === "<=", s) {
				if (y && e.semver.prerelease && e.semver.prerelease.length && e.semver.major === y.major && e.semver.minor === y.minor && e.semver.patch === y.patch && (y = !1), e.operator === ">" || e.operator === ">=") {
					if (m = d(s, e, n), m === e && m !== s) return !1;
				} else if (s.operator === ">=" && !a(s.semver, String(e), n)) return !1;
			}
			if (u) {
				if (v && e.semver.prerelease && e.semver.prerelease.length && e.semver.major === v.major && e.semver.minor === v.minor && e.semver.patch === v.patch && (v = !1), e.operator === "<" || e.operator === "<=") {
					if (h = f(u, e, n), h === e && h !== u) return !1;
				} else if (u.operator === "<=" && !a(u.semver, String(e), n)) return !1;
			}
			if (!e.operator && (u || s) && p !== 0) return !1;
		}
		return !(s && g && !u && p !== 0 || u && _ && !s && p !== 0 || y || v);
	}, d = (e, t, n) => {
		if (!e) return t;
		let r = o(e.semver, t.semver, n);
		return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
	}, f = (e, t, n) => {
		if (!e) return t;
		let r = o(e.semver, t.semver, n);
		return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
	};
	t.exports = s;
})), ni = /* @__PURE__ */ L(((e, t) => {
	var n = hr(), r = pr(), i = Q(), a = _r();
	t.exports = {
		parse: vr(),
		valid: yr(),
		clean: br(),
		inc: xr(),
		diff: Sr(),
		major: Cr(),
		minor: wr(),
		patch: Tr(),
		prerelease: Er(),
		compare: Dr(),
		rcompare: Or(),
		compareLoose: kr(),
		compareBuild: Ar(),
		sort: jr(),
		rsort: Mr(),
		gt: Nr(),
		lt: Pr(),
		eq: Fr(),
		neq: Ir(),
		gte: Lr(),
		lte: Rr(),
		cmp: zr(),
		coerce: Br(),
		Comparator: Ur(),
		Range: Hr(),
		satisfies: Wr(),
		toComparators: Gr(),
		maxSatisfying: Kr(),
		minSatisfying: qr(),
		minVersion: Jr(),
		validRange: Yr(),
		outside: Xr(),
		gtr: Zr(),
		ltr: Qr(),
		intersects: $r(),
		simplifyRange: ei(),
		subset: ti(),
		SemVer: i,
		re: n.re,
		src: n.src,
		tokens: n.t,
		SEMVER_SPEC_VERSION: r.SEMVER_SPEC_VERSION,
		RELEASE_TYPES: r.RELEASE_TYPES,
		compareIdentifiers: a.compareIdentifiers,
		rcompareIdentifiers: a.rcompareIdentifiers
	};
})), ri = /* @__PURE__ */ L(((e, t) => {
	var n = "__lodash_hash_undefined__", r = 9007199254740991, i = "[object Arguments]", a = "[object Array]", o = "[object Boolean]", s = "[object Date]", c = "[object Error]", l = "[object Function]", u = "[object Map]", d = "[object Number]", f = "[object Object]", p = "[object Promise]", m = "[object RegExp]", h = "[object Set]", g = "[object String]", _ = "[object WeakMap]", v = "[object ArrayBuffer]", y = "[object DataView]", b = "[object Float32Array]", x = "[object Float64Array]", S = "[object Int8Array]", C = "[object Int16Array]", w = "[object Int32Array]", T = "[object Uint8Array]", E = "[object Uint8ClampedArray]", D = "[object Uint16Array]", O = "[object Uint32Array]", k = /[\\^$.*+?()[\]{}|]/g, A = /^\[object .+?Constructor\]$/, ee = /^(?:0|[1-9]\d*)$/, j = {};
	j[b] = j[x] = j[S] = j[C] = j[w] = j[T] = j[E] = j[D] = j[O] = !0, j[i] = j[a] = j[v] = j[o] = j[y] = j[s] = j[c] = j[l] = j[u] = j[d] = j[f] = j[m] = j[h] = j[g] = j[_] = !1;
	var M = typeof global == "object" && global && global.Object === Object && global, N = typeof self == "object" && self && self.Object === Object && self, P = M || N || Function("return this")(), F = typeof e == "object" && e && !e.nodeType && e, I = F && typeof t == "object" && t && !t.nodeType && t, te = I && I.exports === F, ne = te && M.process, L = function() {
		try {
			return ne && ne.binding && ne.binding("util");
		} catch {}
	}(), R = L && L.isTypedArray;
	function z(e, t) {
		for (var n = -1, r = e == null ? 0 : e.length, i = 0, a = []; ++n < r;) {
			var o = e[n];
			t(o, n, e) && (a[i++] = o);
		}
		return a;
	}
	function B(e, t) {
		for (var n = -1, r = t.length, i = e.length; ++n < r;) e[i + n] = t[n];
		return e;
	}
	function V(e, t) {
		for (var n = -1, r = e == null ? 0 : e.length; ++n < r;) if (t(e[n], n, e)) return !0;
		return !1;
	}
	function H(e, t) {
		for (var n = -1, r = Array(e); ++n < e;) r[n] = t(n);
		return r;
	}
	function re(e) {
		return function(t) {
			return e(t);
		};
	}
	function U(e, t) {
		return e.has(t);
	}
	function W(e, t) {
		return e?.[t];
	}
	function ie(e) {
		var t = -1, n = Array(e.size);
		return e.forEach(function(e, r) {
			n[++t] = [r, e];
		}), n;
	}
	function ae(e, t) {
		return function(n) {
			return e(t(n));
		};
	}
	function oe(e) {
		var t = -1, n = Array(e.size);
		return e.forEach(function(e) {
			n[++t] = e;
		}), n;
	}
	var se = Array.prototype, ce = Function.prototype, le = Object.prototype, ue = P["__core-js_shared__"], de = ce.toString, G = le.hasOwnProperty, fe = function() {
		var e = /[^.]+$/.exec(ue && ue.keys && ue.keys.IE_PROTO || "");
		return e ? "Symbol(src)_1." + e : "";
	}(), pe = le.toString, me = RegExp("^" + de.call(G).replace(k, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"), he = te ? P.Buffer : void 0, ge = P.Symbol, _e = P.Uint8Array, ve = le.propertyIsEnumerable, ye = se.splice, be = ge ? ge.toStringTag : void 0, xe = Object.getOwnPropertySymbols, K = he ? he.isBuffer : void 0, Se = ae(Object.keys, Object), Ce = Ct(P, "DataView"), we = Ct(P, "Map"), Te = Ct(P, "Promise"), Ee = Ct(P, "Set"), De = Ct(P, "WeakMap"), Oe = Ct(Object, "create"), ke = Mt(Ce), Ae = Mt(we), je = Mt(Te), Me = Mt(Ee), Ne = Mt(De), Pe = ge ? ge.prototype : void 0, Fe = Pe ? Pe.valueOf : void 0;
	function Ie(e) {
		var t = -1, n = e == null ? 0 : e.length;
		for (this.clear(); ++t < n;) {
			var r = e[t];
			this.set(r[0], r[1]);
		}
	}
	function Le() {
		this.__data__ = Oe ? Oe(null) : {}, this.size = 0;
	}
	function Re(e) {
		var t = this.has(e) && delete this.__data__[e];
		return this.size -= +!!t, t;
	}
	function ze(e) {
		var t = this.__data__;
		if (Oe) {
			var r = t[e];
			return r === n ? void 0 : r;
		}
		return G.call(t, e) ? t[e] : void 0;
	}
	function Be(e) {
		var t = this.__data__;
		return Oe ? t[e] !== void 0 : G.call(t, e);
	}
	function Ve(e, t) {
		var r = this.__data__;
		return this.size += +!this.has(e), r[e] = Oe && t === void 0 ? n : t, this;
	}
	Ie.prototype.clear = Le, Ie.prototype.delete = Re, Ie.prototype.get = ze, Ie.prototype.has = Be, Ie.prototype.set = Ve;
	function He(e) {
		var t = -1, n = e == null ? 0 : e.length;
		for (this.clear(); ++t < n;) {
			var r = e[t];
			this.set(r[0], r[1]);
		}
	}
	function q() {
		this.__data__ = [], this.size = 0;
	}
	function Ue(e) {
		var t = this.__data__, n = lt(t, e);
		return n < 0 ? !1 : (n == t.length - 1 ? t.pop() : ye.call(t, n, 1), --this.size, !0);
	}
	function We(e) {
		var t = this.__data__, n = lt(t, e);
		return n < 0 ? void 0 : t[n][1];
	}
	function Ge(e) {
		return lt(this.__data__, e) > -1;
	}
	function Ke(e, t) {
		var n = this.__data__, r = lt(n, e);
		return r < 0 ? (++this.size, n.push([e, t])) : n[r][1] = t, this;
	}
	He.prototype.clear = q, He.prototype.delete = Ue, He.prototype.get = We, He.prototype.has = Ge, He.prototype.set = Ke;
	function qe(e) {
		var t = -1, n = e == null ? 0 : e.length;
		for (this.clear(); ++t < n;) {
			var r = e[t];
			this.set(r[0], r[1]);
		}
	}
	function Je() {
		this.size = 0, this.__data__ = {
			hash: new Ie(),
			map: new (we || He)(),
			string: new Ie()
		};
	}
	function Ye(e) {
		var t = St(this, e).delete(e);
		return this.size -= +!!t, t;
	}
	function Xe(e) {
		return St(this, e).get(e);
	}
	function Ze(e) {
		return St(this, e).has(e);
	}
	function Qe(e, t) {
		var n = St(this, e), r = n.size;
		return n.set(e, t), this.size += n.size == r ? 0 : 1, this;
	}
	qe.prototype.clear = Je, qe.prototype.delete = Ye, qe.prototype.get = Xe, qe.prototype.has = Ze, qe.prototype.set = Qe;
	function $e(e) {
		var t = -1, n = e == null ? 0 : e.length;
		for (this.__data__ = new qe(); ++t < n;) this.add(e[t]);
	}
	function et(e) {
		return this.__data__.set(e, n), this;
	}
	function tt(e) {
		return this.__data__.has(e);
	}
	$e.prototype.add = $e.prototype.push = et, $e.prototype.has = tt;
	function nt(e) {
		var t = this.__data__ = new He(e);
		this.size = t.size;
	}
	function rt() {
		this.__data__ = new He(), this.size = 0;
	}
	function it(e) {
		var t = this.__data__, n = t.delete(e);
		return this.size = t.size, n;
	}
	function at(e) {
		return this.__data__.get(e);
	}
	function ot(e) {
		return this.__data__.has(e);
	}
	function st(e, t) {
		var n = this.__data__;
		if (n instanceof He) {
			var r = n.__data__;
			if (!we || r.length < 199) return r.push([e, t]), this.size = ++n.size, this;
			n = this.__data__ = new qe(r);
		}
		return n.set(e, t), this.size = n.size, this;
	}
	nt.prototype.clear = rt, nt.prototype.delete = it, nt.prototype.get = at, nt.prototype.has = ot, nt.prototype.set = st;
	function ct(e, t) {
		var n = Ft(e), r = !n && Pt(e), i = !n && !r && Lt(e), a = !n && !r && !i && J(e), o = n || r || i || a, s = o ? H(e.length, String) : [], c = s.length;
		for (var l in e) (t || G.call(e, l)) && !(o && (l == "length" || i && (l == "offset" || l == "parent") || a && (l == "buffer" || l == "byteLength" || l == "byteOffset") || Dt(l, c))) && s.push(l);
		return s;
	}
	function lt(e, t) {
		for (var n = e.length; n--;) if (Nt(e[n][0], t)) return n;
		return -1;
	}
	function ut(e, t, n) {
		var r = t(e);
		return Ft(e) ? r : B(r, n(e));
	}
	function dt(e) {
		return e == null ? e === void 0 ? "[object Undefined]" : "[object Null]" : be && be in Object(e) ? wt(e) : jt(e);
	}
	function ft(e) {
		return Ht(e) && dt(e) == i;
	}
	function pt(e, t, n, r, i) {
		return e === t ? !0 : e == null || t == null || !Ht(e) && !Ht(t) ? e !== e && t !== t : mt(e, t, n, r, pt, i);
	}
	function mt(e, t, n, r, o, s) {
		var c = Ft(e), l = Ft(t), u = c ? a : Et(e), d = l ? a : Et(t);
		u = u == i ? f : u, d = d == i ? f : d;
		var p = u == f, m = d == f, h = u == d;
		if (h && Lt(e)) {
			if (!Lt(t)) return !1;
			c = !0, p = !1;
		}
		if (h && !p) return s ||= new nt(), c || J(e) ? vt(e, t, n, r, o, s) : yt(e, t, u, n, r, o, s);
		if (!(n & 1)) {
			var g = p && G.call(e, "__wrapped__"), _ = m && G.call(t, "__wrapped__");
			if (g || _) {
				var v = g ? e.value() : e, y = _ ? t.value() : t;
				return s ||= new nt(), o(v, y, n, r, s);
			}
		}
		return h ? (s ||= new nt(), bt(e, t, n, r, o, s)) : !1;
	}
	function ht(e) {
		return !Vt(e) || kt(e) ? !1 : (zt(e) ? me : A).test(Mt(e));
	}
	function gt(e) {
		return Ht(e) && Bt(e.length) && !!j[dt(e)];
	}
	function _t(e) {
		if (!At(e)) return Se(e);
		var t = [];
		for (var n in Object(e)) G.call(e, n) && n != "constructor" && t.push(n);
		return t;
	}
	function vt(e, t, n, r, i, a) {
		var o = n & 1, s = e.length, c = t.length;
		if (s != c && !(o && c > s)) return !1;
		var l = a.get(e);
		if (l && a.get(t)) return l == t;
		var u = -1, d = !0, f = n & 2 ? new $e() : void 0;
		for (a.set(e, t), a.set(t, e); ++u < s;) {
			var p = e[u], m = t[u];
			if (r) var h = o ? r(m, p, u, t, e, a) : r(p, m, u, e, t, a);
			if (h !== void 0) {
				if (h) continue;
				d = !1;
				break;
			}
			if (f) {
				if (!V(t, function(e, t) {
					if (!U(f, t) && (p === e || i(p, e, n, r, a))) return f.push(t);
				})) {
					d = !1;
					break;
				}
			} else if (!(p === m || i(p, m, n, r, a))) {
				d = !1;
				break;
			}
		}
		return a.delete(e), a.delete(t), d;
	}
	function yt(e, t, n, r, i, a, l) {
		switch (n) {
			case y:
				if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) return !1;
				e = e.buffer, t = t.buffer;
			case v: return !(e.byteLength != t.byteLength || !a(new _e(e), new _e(t)));
			case o:
			case s:
			case d: return Nt(+e, +t);
			case c: return e.name == t.name && e.message == t.message;
			case m:
			case g: return e == t + "";
			case u: var f = ie;
			case h:
				var p = r & 1;
				if (f ||= oe, e.size != t.size && !p) return !1;
				var _ = l.get(e);
				if (_) return _ == t;
				r |= 2, l.set(e, t);
				var b = vt(f(e), f(t), r, i, a, l);
				return l.delete(e), b;
			case "[object Symbol]": if (Fe) return Fe.call(e) == Fe.call(t);
		}
		return !1;
	}
	function bt(e, t, n, r, i, a) {
		var o = n & 1, s = xt(e), c = s.length;
		if (c != xt(t).length && !o) return !1;
		for (var l = c; l--;) {
			var u = s[l];
			if (!(o ? u in t : G.call(t, u))) return !1;
		}
		var d = a.get(e);
		if (d && a.get(t)) return d == t;
		var f = !0;
		a.set(e, t), a.set(t, e);
		for (var p = o; ++l < c;) {
			u = s[l];
			var m = e[u], h = t[u];
			if (r) var g = o ? r(h, m, u, t, e, a) : r(m, h, u, e, t, a);
			if (!(g === void 0 ? m === h || i(m, h, n, r, a) : g)) {
				f = !1;
				break;
			}
			p ||= u == "constructor";
		}
		if (f && !p) {
			var _ = e.constructor, v = t.constructor;
			_ != v && "constructor" in e && "constructor" in t && !(typeof _ == "function" && _ instanceof _ && typeof v == "function" && v instanceof v) && (f = !1);
		}
		return a.delete(e), a.delete(t), f;
	}
	function xt(e) {
		return ut(e, Ut, Tt);
	}
	function St(e, t) {
		var n = e.__data__;
		return Ot(t) ? n[typeof t == "string" ? "string" : "hash"] : n.map;
	}
	function Ct(e, t) {
		var n = W(e, t);
		return ht(n) ? n : void 0;
	}
	function wt(e) {
		var t = G.call(e, be), n = e[be];
		try {
			e[be] = void 0;
			var r = !0;
		} catch {}
		var i = pe.call(e);
		return r && (t ? e[be] = n : delete e[be]), i;
	}
	var Tt = xe ? function(e) {
		return e == null ? [] : (e = Object(e), z(xe(e), function(t) {
			return ve.call(e, t);
		}));
	} : Wt, Et = dt;
	(Ce && Et(new Ce(/* @__PURE__ */ new ArrayBuffer(1))) != y || we && Et(new we()) != u || Te && Et(Te.resolve()) != p || Ee && Et(new Ee()) != h || De && Et(new De()) != _) && (Et = function(e) {
		var t = dt(e), n = t == f ? e.constructor : void 0, r = n ? Mt(n) : "";
		if (r) switch (r) {
			case ke: return y;
			case Ae: return u;
			case je: return p;
			case Me: return h;
			case Ne: return _;
		}
		return t;
	});
	function Dt(e, t) {
		return t ??= r, !!t && (typeof e == "number" || ee.test(e)) && e > -1 && e % 1 == 0 && e < t;
	}
	function Ot(e) {
		var t = typeof e;
		return t == "string" || t == "number" || t == "symbol" || t == "boolean" ? e !== "__proto__" : e === null;
	}
	function kt(e) {
		return !!fe && fe in e;
	}
	function At(e) {
		var t = e && e.constructor;
		return e === (typeof t == "function" && t.prototype || le);
	}
	function jt(e) {
		return pe.call(e);
	}
	function Mt(e) {
		if (e != null) {
			try {
				return de.call(e);
			} catch {}
			try {
				return e + "";
			} catch {}
		}
		return "";
	}
	function Nt(e, t) {
		return e === t || e !== e && t !== t;
	}
	var Pt = ft(function() {
		return arguments;
	}()) ? ft : function(e) {
		return Ht(e) && G.call(e, "callee") && !ve.call(e, "callee");
	}, Ft = Array.isArray;
	function It(e) {
		return e != null && Bt(e.length) && !zt(e);
	}
	var Lt = K || Gt;
	function Rt(e, t) {
		return pt(e, t);
	}
	function zt(e) {
		if (!Vt(e)) return !1;
		var t = dt(e);
		return t == l || t == "[object GeneratorFunction]" || t == "[object AsyncFunction]" || t == "[object Proxy]";
	}
	function Bt(e) {
		return typeof e == "number" && e > -1 && e % 1 == 0 && e <= r;
	}
	function Vt(e) {
		var t = typeof e;
		return e != null && (t == "object" || t == "function");
	}
	function Ht(e) {
		return typeof e == "object" && !!e;
	}
	var J = R ? re(R) : gt;
	function Ut(e) {
		return It(e) ? ct(e) : _t(e);
	}
	function Wt() {
		return [];
	}
	function Gt() {
		return !1;
	}
	t.exports = Rt;
})), ii = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.DownloadedUpdateHelper = void 0, e.createTempUpdateFile = s;
	var t = R("crypto"), n = R("fs"), r = ri(), i = Sn(), a = R("path");
	e.DownloadedUpdateHelper = class {
		constructor(e) {
			this.cacheDir = e, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
		}
		get downloadedFileInfo() {
			return this._downloadedFileInfo;
		}
		get file() {
			return this._file;
		}
		get packageFile() {
			return this._packageFile;
		}
		get cacheDirForPendingUpdate() {
			return a.join(this.cacheDir, "pending");
		}
		async validateDownloadedPath(e, t, n, a) {
			if (this.versionInfo != null && this.file === e && this.fileInfo != null) return r(this.versionInfo, t) && r(this.fileInfo.info, n.info) && await (0, i.pathExists)(e) ? e : null;
			let o = await this.getValidCachedUpdateFile(n, a);
			return o === null ? null : (a.info(`Update has already been downloaded to ${e}).`), this._file = o, o);
		}
		async setDownloadedFile(e, t, n, r, a, o) {
			this._file = e, this._packageFile = t, this.versionInfo = n, this.fileInfo = r, this._downloadedFileInfo = {
				fileName: a,
				sha512: r.info.sha512,
				isAdminRightsRequired: r.info.isAdminRightsRequired === !0
			}, o && await (0, i.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
		}
		async clear() {
			this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
		}
		async cleanCacheDirForPendingUpdate() {
			try {
				await (0, i.emptyDir)(this.cacheDirForPendingUpdate);
			} catch {}
		}
		async getValidCachedUpdateFile(e, t) {
			let n = this.getUpdateInfoFile();
			if (!await (0, i.pathExists)(n)) return null;
			let r;
			try {
				r = await (0, i.readJson)(n);
			} catch (e) {
				let n = "No cached update info available";
				return e.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), n += ` (error on read: ${e.message})`), t.info(n), null;
			}
			if (r?.fileName === null) return t.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
			if (e.info.sha512 !== r.sha512) return t.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${r.sha512}, expected: ${e.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
			let s = a.join(this.cacheDirForPendingUpdate, r.fileName);
			if (!await (0, i.pathExists)(s)) return t.info("Cached update file doesn't exist"), null;
			let c = await o(s);
			return e.info.sha512 === c ? (this._downloadedFileInfo = r, s) : (t.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${e.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null);
		}
		getUpdateInfoFile() {
			return a.join(this.cacheDirForPendingUpdate, "update-info.json");
		}
	};
	function o(e, r = "sha512", i = "base64", a) {
		return new Promise((o, s) => {
			let c = (0, t.createHash)(r);
			c.on("error", s).setEncoding(i), (0, n.createReadStream)(e, {
				...a,
				highWaterMark: 1048576
			}).on("error", s).on("end", () => {
				c.end(), o(c.read());
			}).pipe(c, { end: !1 });
		});
	}
	async function s(e, t, n) {
		let r = 0, o = a.join(t, e);
		for (let s = 0; s < 3; s++) try {
			return await (0, i.unlink)(o), o;
		} catch (i) {
			if (i.code === "ENOENT") return o;
			n.warn(`Error on remove temp update file: ${i}`), o = a.join(t, `${r++}-${e}`);
		}
		return o;
	}
})), ai = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.getAppCacheDir = r;
	var t = R("path"), n = R("os");
	function r() {
		let e = (0, n.homedir)(), r;
		return r = process.platform === "win32" ? process.env.LOCALAPPDATA || t.join(e, "AppData", "Local") : process.platform === "darwin" ? t.join(e, "Library", "Caches") : process.env.XDG_CACHE_HOME || t.join(e, ".cache"), r;
	}
})), oi = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronAppAdapter = void 0;
	var t = R("path"), n = ai();
	e.ElectronAppAdapter = class {
		constructor(e = R("electron").app) {
			this.app = e;
		}
		whenReady() {
			return this.app.whenReady();
		}
		get version() {
			return this.app.getVersion();
		}
		get name() {
			return this.app.getName();
		}
		get isPackaged() {
			return this.app.isPackaged === !0;
		}
		get appUpdateConfigPath() {
			return this.isPackaged ? t.join(process.resourcesPath, "app-update.yml") : t.join(this.app.getAppPath(), "dev-app-update.yml");
		}
		get userDataPath() {
			return this.app.getPath("userData");
		}
		get baseCachePath() {
			return (0, n.getAppCacheDir)();
		}
		quit() {
			this.app.quit();
		}
		relaunch() {
			this.app.relaunch();
		}
		onQuit(e) {
			this.app.once("quit", (t, n) => e(n));
		}
	};
})), si = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = n;
	var t = X();
	e.NET_SESSION_NAME = "electron-updater";
	function n() {
		return R("electron").session.fromPartition(e.NET_SESSION_NAME, { cache: !1 });
	}
	e.ElectronHttpExecutor = class extends t.HttpExecutor {
		constructor(e) {
			super(), this.proxyLoginCallback = e, this.cachedSession = null;
		}
		async download(e, n, r) {
			return await r.cancellationToken.createPromise((i, a, o) => {
				let s = {
					headers: r.headers || void 0,
					redirect: "manual"
				};
				(0, t.configureRequestUrl)(e, s), (0, t.configureRequestOptions)(s), this.doDownload(s, {
					destination: n,
					options: r,
					onCancel: o,
					callback: (e) => {
						e == null ? i(n) : a(e);
					},
					responseHandler: null
				}, 0);
			});
		}
		createRequest(e, t) {
			e.headers && e.headers.Host && (e.host = e.headers.Host, delete e.headers.Host), this.cachedSession ??= n();
			let r = R("electron").net.request({
				...e,
				session: this.cachedSession
			});
			return r.on("response", t), this.proxyLoginCallback != null && r.on("login", this.proxyLoginCallback), r;
		}
		addRedirectHandlers(e, n, r, i, a) {
			e.on("redirect", (o, s, c) => {
				e.abort(), i > this.maxRedirects ? r(this.createMaxRedirectError()) : a(t.HttpExecutor.prepareRedirectUrlOptions(c, n));
			});
		}
	};
})), ci = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.newBaseUrl = n, e.newUrlFromBase = r, e.getChannelFilename = i;
	var t = R("url");
	function n(e) {
		let n = new t.URL(e);
		return n.pathname.endsWith("/") || (n.pathname += "/"), n;
	}
	function r(e, n, r = !1) {
		let i = new t.URL(e, n), a = n.search;
		return a != null && a.length !== 0 ? i.search = a : r && (i.search = `noCache=${Date.now().toString(32)}`), i;
	}
	function i(e) {
		return `${e}.yml`;
	}
})), li = /* @__PURE__ */ L(((e, t) => {
	var n = /[\\^$.*+?()[\]{}|]/g, r = RegExp(n.source), i = typeof global == "object" && global && global.Object === Object && global, a = typeof self == "object" && self && self.Object === Object && self, o = i || a || Function("return this")(), s = Object.prototype.toString, c = o.Symbol, l = c ? c.prototype : void 0, u = l ? l.toString : void 0;
	function d(e) {
		if (typeof e == "string") return e;
		if (p(e)) return u ? u.call(e) : "";
		var t = e + "";
		return t == "0" && 1 / e == -Infinity ? "-0" : t;
	}
	function f(e) {
		return !!e && typeof e == "object";
	}
	function p(e) {
		return typeof e == "symbol" || f(e) && s.call(e) == "[object Symbol]";
	}
	function m(e) {
		return e == null ? "" : d(e);
	}
	function h(e) {
		return e = m(e), e && r.test(e) ? e.replace(n, "\\$&") : e;
	}
	t.exports = h;
})), ui = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.Provider = void 0, e.findFile = o, e.parseUpdateInfo = s, e.getFileList = c, e.resolveFiles = l;
	var t = X(), n = dr(), r = R("url"), i = ci(), a = li();
	e.Provider = class {
		constructor(e) {
			this.runtimeOptions = e, this.requestHeaders = null, this.executor = e.executor;
		}
		getBlockMapFiles(e, t, n, o = null) {
			let s = (0, i.newUrlFromBase)(`${e.pathname}.blockmap`, e);
			return [(0, i.newUrlFromBase)(`${e.pathname.replace(new RegExp(a(n), "g"), t)}.blockmap`, o ? new r.URL(o) : e), s];
		}
		get isUseMultipleRangeRequest() {
			return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
		}
		getChannelFilePrefix() {
			if (this.runtimeOptions.platform === "linux") {
				let e = process.env.TEST_UPDATER_ARCH || process.arch;
				return "-linux" + (e === "x64" ? "" : `-${e}`);
			}
			return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
		}
		getDefaultChannelName() {
			return this.getCustomChannelName("latest");
		}
		getCustomChannelName(e) {
			return `${e}${this.getChannelFilePrefix()}`;
		}
		get fileExtraDownloadHeaders() {
			return null;
		}
		setRequestHeaders(e) {
			this.requestHeaders = e;
		}
		httpRequest(e, t, n) {
			return this.executor.request(this.createRequestOptions(e, t), n);
		}
		createRequestOptions(e, n) {
			let r = {};
			return this.requestHeaders == null ? n != null && (r.headers = n) : r.headers = n == null ? this.requestHeaders : {
				...this.requestHeaders,
				...n
			}, (0, t.configureRequestUrl)(e, r), r;
		}
	};
	function o(e, n, r) {
		if (e.length === 0) throw (0, t.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
		let i = e.filter((e) => e.url.pathname.toLowerCase().endsWith(`.${n.toLowerCase()}`));
		return (i.find((e) => [e.url.pathname, e.info.url].some((e) => e.includes(process.arch))) ?? i.shift()) || (r == null ? e[0] : e.find((e) => !r.some((t) => e.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`))));
	}
	function s(e, r, i) {
		if (e == null) throw (0, t.newError)(`Cannot parse update info from ${r} in the latest release artifacts (${i}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
		let a;
		try {
			a = (0, n.load)(e);
		} catch (n) {
			throw (0, t.newError)(`Cannot parse update info from ${r} in the latest release artifacts (${i}): ${n.stack || n.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
		}
		return a;
	}
	function c(e) {
		let n = e.files;
		if (n != null && n.length > 0) return n;
		if (e.path != null) return [{
			url: e.path,
			sha2: e.sha2,
			sha512: e.sha512
		}];
		throw (0, t.newError)(`No files provided: ${(0, t.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
	}
	function l(e, n, r = (e) => e) {
		let a = c(e).map((e) => {
			if (e.sha2 == null && e.sha512 == null) throw (0, t.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, t.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_CHECKSUM");
			return {
				url: (0, i.newUrlFromBase)(r(e.url), n),
				info: e
			};
		}), o = e.packages, s = o == null ? null : o[process.arch] || o.ia32;
		return s != null && (a[0].packageInfo = {
			...s,
			path: (0, i.newUrlFromBase)(r(s.path), n).href
		}), a;
	}
})), di = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.GenericProvider = void 0;
	var t = X(), n = ci(), r = ui();
	e.GenericProvider = class extends r.Provider {
		constructor(e, t, r) {
			super(r), this.configuration = e, this.updater = t, this.baseUrl = (0, n.newBaseUrl)(this.configuration.url);
		}
		get channel() {
			let e = this.updater.channel || this.configuration.channel;
			return e == null ? this.getDefaultChannelName() : this.getCustomChannelName(e);
		}
		async getLatestVersion() {
			let e = (0, n.getChannelFilename)(this.channel), i = (0, n.newUrlFromBase)(e, this.baseUrl, this.updater.isAddNoCacheQuery);
			for (let n = 0;; n++) try {
				return (0, r.parseUpdateInfo)(await this.httpRequest(i), e, i);
			} catch (r) {
				if (r instanceof t.HttpError && r.statusCode === 404) throw (0, t.newError)(`Cannot find channel "${e}" update info: ${r.stack || r.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
				if (r.code === "ECONNREFUSED" && n < 3) {
					await new Promise((e, t) => {
						try {
							setTimeout(e, 1e3 * n);
						} catch (e) {
							t(e);
						}
					});
					continue;
				}
				throw r;
			}
		}
		resolveFiles(e) {
			return (0, r.resolveFiles)(e, this.baseUrl);
		}
	};
})), fi = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.BitbucketProvider = void 0;
	var t = X(), n = ci(), r = ui();
	e.BitbucketProvider = class extends r.Provider {
		constructor(e, t, r) {
			super({
				...r,
				isUseMultipleRangeRequest: !1
			}), this.configuration = e, this.updater = t;
			let { owner: i, slug: a } = e;
			this.baseUrl = (0, n.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${a}/downloads`);
		}
		get channel() {
			return this.updater.channel || this.configuration.channel || "latest";
		}
		async getLatestVersion() {
			let e = new t.CancellationToken(), i = (0, n.getChannelFilename)(this.getCustomChannelName(this.channel)), a = (0, n.newUrlFromBase)(i, this.baseUrl, this.updater.isAddNoCacheQuery);
			try {
				let t = await this.httpRequest(a, void 0, e);
				return (0, r.parseUpdateInfo)(t, i, a);
			} catch (e) {
				throw (0, t.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
		}
		resolveFiles(e) {
			return (0, r.resolveFiles)(e, this.baseUrl);
		}
		toString() {
			let { owner: e, slug: t } = this.configuration;
			return `Bitbucket (owner: ${e}, slug: ${t}, channel: ${this.channel})`;
		}
	};
})), pi = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.GitHubProvider = e.BaseGitHubProvider = void 0, e.computeReleaseNotes = l;
	var t = X(), n = ni(), r = R("url"), i = ci(), a = ui(), o = /\/tag\/(v?[^/]+)$/, s = class extends a.Provider {
		constructor(e, n, r) {
			super({
				...r,
				isUseMultipleRangeRequest: !1
			}), this.options = e, this.baseUrl = (0, i.newBaseUrl)((0, t.githubUrl)(e, n));
			let a = n === "github.com" ? "api.github.com" : n;
			this.baseApiUrl = (0, i.newBaseUrl)((0, t.githubUrl)(e, a));
		}
		computeGithubBasePath(e) {
			let t = this.options.host;
			return t && !["github.com", "api.github.com"].includes(t) ? `/api/v3${e}` : e;
		}
	};
	e.BaseGitHubProvider = s, e.GitHubProvider = class extends s {
		constructor(e, t, n) {
			super(e, "github.com", n), this.options = e, this.updater = t;
		}
		get channel() {
			let e = this.updater.channel || this.options.channel;
			return e == null ? this.getDefaultChannelName() : this.getCustomChannelName(e);
		}
		async getLatestVersion() {
			let e = new t.CancellationToken(), r = await this.httpRequest((0, i.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), { accept: "application/xml, application/atom+xml, text/xml, */*" }, e), s = (0, t.parseXml)(r), c = s.element("entry", !1, "No published versions on GitHub"), u = null;
			try {
				if (this.updater.allowPrerelease) {
					let e = this.updater?.channel || n.prerelease(this.updater.currentVersion)?.[0] || null;
					if (e === null) u = o.exec(c.element("link").attribute("href"))[1];
					else for (let t of s.getElements("entry")) {
						let r = o.exec(t.element("link").attribute("href"));
						if (r === null) continue;
						let i = r[1];
						if (!n.valid(i)) continue;
						let a = n.prerelease(i)?.[0] || null, s = !e || ["alpha", "beta"].includes(e), l = a !== null && !["alpha", "beta"].includes(String(a));
						if (s && !l && (e !== "beta" || a !== "alpha")) {
							u = i, c = t;
							break;
						}
						if (a && a === e) {
							u = i, c = t;
							break;
						}
					}
				} else {
					u = await this.getLatestTagName(e);
					for (let e of s.getElements("entry")) {
						let t = o.exec(e.element("link").attribute("href"));
						if (t != null && t[1] === u) {
							c = e;
							break;
						}
					}
				}
			} catch (e) {
				throw (0, t.newError)(`Cannot parse releases feed: ${e.stack || e.message},\nXML:\n${r}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
			}
			if (u == null) throw (0, t.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
			let d, f = "", p = "", m = async (n) => {
				f = (0, i.getChannelFilename)(n), p = (0, i.newUrlFromBase)(this.getBaseDownloadPath(String(u), f), this.baseUrl);
				let r = this.createRequestOptions(p);
				try {
					return await this.executor.request(r, e);
				} catch (e) {
					throw e instanceof t.HttpError && e.statusCode === 404 ? (0, t.newError)(`Cannot find ${f} in the latest release artifacts (${p}): ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : e;
				}
			};
			try {
				let e = this.channel;
				this.updater.allowPrerelease && n.prerelease(u)?.[0] && (e = this.getCustomChannelName(String(n.prerelease(u)?.[0]))), d = await m(e);
			} catch (e) {
				if (this.updater.allowPrerelease) d = await m(this.getDefaultChannelName());
				else throw e;
			}
			let h = (0, a.parseUpdateInfo)(d, f, p);
			return h.releaseName ??= c.elementValueOrEmpty("title"), h.releaseNotes ??= l(this.updater.currentVersion, this.updater.fullChangelog, s, c), {
				tag: u,
				...h
			};
		}
		async getLatestTagName(e) {
			let n = this.options, a = n.host == null || n.host === "github.com" ? (0, i.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new r.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
			try {
				let t = await this.httpRequest(a, { Accept: "application/json" }, e);
				return t == null ? null : JSON.parse(t).tag_name;
			} catch (e) {
				throw (0, t.newError)(`Unable to find latest version on GitHub (${a}), please ensure a production release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
		}
		get basePath() {
			return `/${this.options.owner}/${this.options.repo}/releases`;
		}
		resolveFiles(e) {
			return (0, a.resolveFiles)(e, this.baseUrl, (t) => this.getBaseDownloadPath(e.tag, t.replace(/ /g, "-")));
		}
		getBaseDownloadPath(e, t) {
			return `${this.basePath}/download/${e}/${t}`;
		}
	};
	function c(e) {
		let t = e.elementValueOrEmpty("content");
		return t === "No content." ? "" : t;
	}
	function l(e, t, r, i) {
		if (!t) return c(i);
		let a = /\/tag\/v?([^/]+)$/, o;
		try {
			o = a.exec(i.element("link").attribute("href"))[1], o = n.valid(o) ? o : void 0;
		} catch {}
		if (o == null) return null;
		let s = [];
		for (let t of r.getElements("entry")) {
			let r;
			try {
				let e = a.exec(t.element("link").attribute("href"));
				if (!e) continue;
				r = e[1];
			} catch {
				continue;
			}
			if (!n.valid(r)) continue;
			let i = n.gt(r, e.raw), l = n.lte(r, o);
			i && l && s.push({
				version: r,
				note: c(t)
			});
		}
		return s.sort((e, t) => n.rcompare(e.version, t.version));
	}
})), mi = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.GitLabProvider = void 0;
	var t = X(), n = R("url"), r = li(), i = ci(), a = ui();
	e.GitLabProvider = class extends a.Provider {
		normalizeFilename(e) {
			return e.replace(/ |_/g, "-");
		}
		constructor(e, t, n) {
			super({
				...n,
				isUseMultipleRangeRequest: !1
			}), this.options = e, this.updater = t, this.cachedLatestVersion = null;
			let r = e.host || "gitlab.com";
			this.baseApiUrl = (0, i.newBaseUrl)(`https://${r}/api/v4`);
		}
		createRequestOptions(e, t) {
			let n = super.createRequestOptions(e, t);
			return n.redirect = "manual", n;
		}
		get channel() {
			let e = this.updater.channel || this.options.channel;
			return e == null ? this.getDefaultChannelName() : this.getCustomChannelName(e);
		}
		async getLatestVersion() {
			let e = new t.CancellationToken(), r = (0, i.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl), o = {
				Accept: "application/json",
				...this.setAuthHeaderForToken(this.options.token || null)
			}, s;
			try {
				s = await this.httpRequest(r, o, e);
			} catch (e) {
				throw (0, t.newError)(`Unable to find latest release on GitLab (${r}): ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
			if (!s) throw (0, t.newError)("No published releases on GitLab", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
			let c;
			try {
				c = JSON.parse(s);
			} catch (e) {
				throw (0, t.newError)(`Unable to parse latest release response from GitLab (${r}): response was not valid JSON: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
			if (c.upcoming_release) throw (0, t.newError)("Latest GitLab release is scheduled but not yet published", "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			let l = c.tag_name, u = null, d = "", f = null, p = async (r) => {
				d = (0, i.getChannelFilename)(r);
				let a = c.assets.links.find((e) => e.name === d);
				if (!a) throw (0, t.newError)(`Cannot find ${d} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
				f = new n.URL(a.direct_asset_url);
				let o = this.setAuthHeaderForToken(this.options.token || null), s = Object.keys(o).length ? o : void 0;
				try {
					let n = await this.httpRequest(f, s, e);
					if (!n) throw (0, t.newError)(`Empty response from ${f}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
					return n;
				} catch (e) {
					throw e instanceof t.HttpError && e.statusCode === 404 ? (0, t.newError)(`Cannot find ${d} in the latest release artifacts (${f}): ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : e;
				}
			};
			try {
				u = await p(this.channel);
			} catch (e) {
				if (this.channel !== this.getDefaultChannelName()) u = await p(this.getDefaultChannelName());
				else throw e;
			}
			if (!u) throw (0, t.newError)(`Unable to parse channel data from ${d}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
			let m = (0, a.parseUpdateInfo)(u, d, f);
			m.releaseName ??= c.name, m.releaseNotes ??= c.description || null;
			let h = {
				tag: l,
				assets: this.convertAssetsToMap(c.assets),
				...m
			};
			return this.cachedLatestVersion = h, h;
		}
		convertAssetsToMap(e) {
			let t = /* @__PURE__ */ new Map();
			for (let n of e.links) t.set(this.normalizeFilename(n.name), n.direct_asset_url);
			return t;
		}
		findBlockMapInAssets(e, t) {
			let r = [`${t}.blockmap`, `${this.normalizeFilename(t)}.blockmap`];
			for (let t of r) {
				let r = e.get(t);
				if (r) return new n.URL(r);
			}
			return null;
		}
		async fetchReleaseInfoByVersion(e) {
			let n = new t.CancellationToken(), r = [`v${e}`, e];
			for (let e of r) {
				let r = (0, i.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(e)}`, this.baseApiUrl);
				try {
					let e = {
						Accept: "application/json",
						...this.setAuthHeaderForToken(this.options.token || null)
					}, t = await this.httpRequest(r, e, n);
					if (t) return JSON.parse(t);
				} catch (n) {
					if (n instanceof t.HttpError && n.statusCode === 404) continue;
					throw (0, t.newError)(`Unable to find release ${e} on GitLab (${r}): ${n.stack || n.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
				}
			}
			throw (0, t.newError)(`Unable to find release with version ${e} (tried: ${r.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
		}
		setAuthHeaderForToken(e) {
			let t = {};
			return e != null && (e.startsWith("Bearer") ? t.authorization = e : t["PRIVATE-TOKEN"] = e), t;
		}
		async getVersionInfoForBlockMap(e) {
			if (this.cachedLatestVersion && this.cachedLatestVersion.version === e) return this.cachedLatestVersion.assets;
			let t = await this.fetchReleaseInfoByVersion(e);
			return t && t.assets ? this.convertAssetsToMap(t.assets) : null;
		}
		async findBlockMapUrlsFromAssets(e, t, n) {
			let i = null, a = null, o = await this.getVersionInfoForBlockMap(t);
			o && (i = this.findBlockMapInAssets(o, n));
			let s = await this.getVersionInfoForBlockMap(e);
			if (s) {
				let i = n.replace(new RegExp(r(t), "g"), e);
				a = this.findBlockMapInAssets(s, i);
			}
			return [a, i];
		}
		async getBlockMapFiles(e, n, r, i = null) {
			if (this.options.uploadTarget === "project_upload") {
				let i = e.pathname.split("/").pop() || "", [a, o] = await this.findBlockMapUrlsFromAssets(n, r, i);
				if (!o) throw (0, t.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
				if (!a) throw (0, t.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
				return [a, o];
			}
			return super.getBlockMapFiles(e, n, r, i);
		}
		resolveFiles(e) {
			return (0, a.getFileList)(e).map((r) => {
				let i = [r.url, this.normalizeFilename(r.url)].find((t) => e.assets.has(t)), a = i ? e.assets.get(i) : void 0;
				if (!a) throw (0, t.newError)(`Cannot find asset "${r.url}" in GitLab release assets. Available assets: ${Array.from(e.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
				return {
					url: new n.URL(a),
					info: r
				};
			});
		}
		toString() {
			return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
		}
	};
})), hi = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.KeygenProvider = void 0;
	var t = X(), n = ci(), r = ui();
	e.KeygenProvider = class extends r.Provider {
		constructor(e, t, r) {
			super({
				...r,
				isUseMultipleRangeRequest: !1
			}), this.configuration = e, this.updater = t, this.defaultHostname = "api.keygen.sh";
			let i = this.configuration.host || this.defaultHostname;
			this.baseUrl = (0, n.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
		}
		get channel() {
			return this.updater.channel || this.configuration.channel || "stable";
		}
		async getLatestVersion() {
			let e = new t.CancellationToken(), i = (0, n.getChannelFilename)(this.getCustomChannelName(this.channel)), a = (0, n.newUrlFromBase)(i, this.baseUrl, this.updater.isAddNoCacheQuery);
			try {
				let t = await this.httpRequest(a, {
					Accept: "application/vnd.api+json",
					"Keygen-Version": "1.1"
				}, e);
				return (0, r.parseUpdateInfo)(t, i, a);
			} catch (e) {
				throw (0, t.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
		}
		resolveFiles(e) {
			return (0, r.resolveFiles)(e, this.baseUrl);
		}
		toString() {
			let { account: e, product: t, platform: n } = this.configuration;
			return `Keygen (account: ${e}, product: ${t}, platform: ${n}, channel: ${this.channel})`;
		}
	};
})), gi = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.PrivateGitHubProvider = void 0;
	var t = X(), n = dr(), r = R("path"), i = R("url"), a = ci(), o = pi(), s = ui();
	e.PrivateGitHubProvider = class extends o.BaseGitHubProvider {
		constructor(e, t, n, r) {
			super(e, "api.github.com", r), this.updater = t, this.token = n;
		}
		createRequestOptions(e, t) {
			let n = super.createRequestOptions(e, t);
			return n.redirect = "manual", n;
		}
		async getLatestVersion() {
			let e = new t.CancellationToken(), r = (0, a.getChannelFilename)(this.getDefaultChannelName()), o = await this.getLatestVersionInfo(e), s = o.assets.find((e) => e.name === r);
			if (s == null) throw (0, t.newError)(`Cannot find ${r} in the release ${o.html_url || o.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
			let c = new i.URL(s.url), l;
			try {
				l = (0, n.load)(await this.httpRequest(c, this.configureHeaders("application/octet-stream"), e));
			} catch (e) {
				throw e instanceof t.HttpError && e.statusCode === 404 ? (0, t.newError)(`Cannot find ${r} in the latest release artifacts (${c}): ${e.stack || e.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : e;
			}
			return l.assets = o.assets, l;
		}
		get fileExtraDownloadHeaders() {
			return this.configureHeaders("application/octet-stream");
		}
		configureHeaders(e) {
			return {
				accept: e,
				authorization: `token ${this.token}`
			};
		}
		async getLatestVersionInfo(e) {
			let n = this.updater.allowPrerelease, r = this.basePath;
			n || (r = `${r}/latest`);
			let i = (0, a.newUrlFromBase)(r, this.baseUrl);
			try {
				let t = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), e));
				if (n) {
					let e = t.filter((e) => !e.draft);
					return e.find((e) => e.prerelease) || e[0];
				}
				return t;
			} catch (e) {
				throw (0, t.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${e.stack || e.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
			}
		}
		get basePath() {
			return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
		}
		resolveFiles(e) {
			return (0, s.getFileList)(e).map((n) => {
				let a = r.posix.basename(n.url).replace(/ /g, "-"), o = e.assets.find((e) => e != null && e.name === a);
				if (o == null) throw (0, t.newError)(`Cannot find asset "${a}" in: ${JSON.stringify(e.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
				return {
					url: new i.URL(o.url),
					info: n
				};
			});
		}
	};
})), _i = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.isUrlProbablySupportMultiRangeRequests = c, e.createClient = l;
	var t = X(), n = fi(), r = di(), i = pi(), a = mi(), o = hi(), s = gi();
	function c(e) {
		return !e.includes("s3.amazonaws.com");
	}
	function l(e, l, u) {
		if (typeof e == "string") throw (0, t.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
		let d = e.provider;
		switch (d) {
			case "github": {
				let t = e, n = (t.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || t.token;
				return n == null ? new i.GitHubProvider(t, l, u) : new s.PrivateGitHubProvider(t, l, n, u);
			}
			case "bitbucket": return new n.BitbucketProvider(e, l, u);
			case "gitlab": return new a.GitLabProvider(e, l, u);
			case "keygen": return new o.KeygenProvider(e, l, u);
			case "s3":
			case "spaces": return new r.GenericProvider({
				provider: "generic",
				url: (0, t.getS3LikeProviderBaseUrl)(e),
				channel: e.channel || null
			}, l, {
				...u,
				isUseMultipleRangeRequest: !1
			});
			case "generic": {
				let t = e;
				return new r.GenericProvider(t, l, {
					...u,
					isUseMultipleRangeRequest: t.useMultipleRangeRequest !== !1 && c(t.url)
				});
			}
			case "custom": {
				let n = e, r = n.updateProvider;
				if (!r) throw (0, t.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
				return new r(n, l, u);
			}
			default: throw (0, t.newError)(`Unsupported provider: ${d}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
		}
	}
})), vi = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.OperationKind = void 0, e.computeOperations = n;
	var t;
	(function(e) {
		e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
	})(t || (e.OperationKind = t = {}));
	function n(e, n, r) {
		let s = o(e.files), c = o(n.files), l = null, u = n.files[0], d = [], f = u.name, p = s.get(f);
		if (p == null) throw Error(`no file ${f} in old blockmap`);
		let m = c.get(f), h = 0, { checksumToOffset: g, checksumToOldSize: _ } = a(s.get(f), p.offset, r), v = u.offset;
		for (let e = 0; e < m.checksums.length; v += m.sizes[e], e++) {
			let n = m.sizes[e], a = m.checksums[e], o = g.get(a);
			o != null && _.get(a) !== n && (r.warn(`Checksum ("${a}") matches, but size differs (old: ${_.get(a)}, new: ${n})`), o = void 0), o === void 0 ? (h++, l != null && l.kind === t.DOWNLOAD && l.end === v ? l.end += n : (l = {
				kind: t.DOWNLOAD,
				start: v,
				end: v + n
			}, i(l, d, a, e))) : l != null && l.kind === t.COPY && l.end === o ? l.end += n : (l = {
				kind: t.COPY,
				start: o,
				end: o + n
			}, i(l, d, a, e));
		}
		return h > 0 && r.info(`File${u.name === "file" ? "" : " " + u.name} has ${h} changed blocks`), d;
	}
	var r = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
	function i(e, n, i, a) {
		if (r && n.length !== 0) {
			let r = n[n.length - 1];
			if (r.kind === e.kind && e.start < r.end && e.start > r.start) {
				let n = [
					r.start,
					r.end,
					e.start,
					e.end
				].reduce((e, t) => e < t ? e : t);
				throw Error(`operation (block index: ${a}, checksum: ${i}, kind: ${t[e.kind]}) overlaps previous operation (checksum: ${i}):\nabs: ${r.start} until ${r.end} and ${e.start} until ${e.end}\nrel: ${r.start - n} until ${r.end - n} and ${e.start - n} until ${e.end - n}`);
			}
		}
		n.push(e);
	}
	function a(e, t, n) {
		let r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map(), a = t;
		for (let t = 0; t < e.checksums.length; t++) {
			let o = e.checksums[t], s = e.sizes[t], c = i.get(o);
			if (c === void 0) r.set(o, a), i.set(o, s);
			else if (n.debug != null) {
				let e = c === s ? "(same size)" : `(size: ${c}, this size: ${s})`;
				n.debug(`${o} duplicated in blockmap ${e}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
			}
			a += s;
		}
		return {
			checksumToOffset: r,
			checksumToOldSize: i
		};
	}
	function o(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e) t.set(n.name, n);
		return t;
	}
})), yi = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.DataSplitter = void 0, e.copyData = s;
	var t = X(), n = R("fs"), r = R("stream"), i = vi(), a = Buffer.from("\r\n\r\n"), o;
	(function(e) {
		e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
	})(o ||= {});
	function s(e, t, r, i, a) {
		let o = (0, n.createReadStream)("", {
			fd: r,
			autoClose: !1,
			start: e.start,
			end: e.end - 1
		});
		o.on("error", i), o.once("end", a), o.pipe(t, { end: !1 });
	}
	e.DataSplitter = class extends r.Writable {
		constructor(e, t, n, r, i, a, s, c) {
			super(), this.out = e, this.options = t, this.partIndexToTaskIndex = n, this.partIndexToLength = i, this.finishHandler = a, this.grandTotalBytes = s, this.onProgress = c, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = o.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = r.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
		}
		get isFinished() {
			return this.partIndex === this.partIndexToLength.length;
		}
		_write(e, t, n) {
			if (this.isFinished) {
				console.error(`Trailing ignored data: ${e.length} bytes`);
				return;
			}
			this.handleData(e).then(() => {
				if (this.onProgress) {
					let e = Date.now();
					(e >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (e - this.start) / 1e3 && (this.nextUpdate = e + 1e3, this.onProgress({
						total: this.grandTotalBytes,
						delta: this.delta,
						transferred: this.transferred,
						percent: this.transferred / this.grandTotalBytes * 100,
						bytesPerSecond: Math.round(this.transferred / ((e - this.start) / 1e3))
					}), this.delta = 0);
				}
				n();
			}).catch(n);
		}
		async handleData(e) {
			let n = 0;
			if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0) throw (0, t.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
			if (this.ignoreByteCount > 0) {
				let t = Math.min(this.ignoreByteCount, e.length);
				this.ignoreByteCount -= t, n = t;
			} else if (this.remainingPartDataCount > 0) {
				let t = Math.min(this.remainingPartDataCount, e.length);
				this.remainingPartDataCount -= t, await this.processPartData(e, 0, t), n = t;
			}
			if (n !== e.length) {
				if (this.readState === o.HEADER) {
					let t = this.searchHeaderListEnd(e, n);
					if (t === -1) return;
					n = t, this.readState = o.BODY, this.headerListBuffer = null;
				}
				for (;;) {
					if (this.readState === o.BODY) this.readState = o.INIT;
					else {
						this.partIndex++;
						let r = this.partIndexToTaskIndex.get(this.partIndex);
						if (r == null) {
							if (this.isFinished) r = this.options.end;
							else throw (0, t.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
						}
						let i = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
						if (i < r) await this.copyExistingData(i, r);
						else if (i > r) throw (0, t.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
						if (this.isFinished) {
							this.onPartEnd(), this.finishHandler();
							return;
						}
						if (n = this.searchHeaderListEnd(e, n), n === -1) {
							this.readState = o.HEADER;
							return;
						}
					}
					let r = this.partIndexToLength[this.partIndex], i = n + r, a = Math.min(i, e.length);
					if (await this.processPartStarted(e, n, a), this.remainingPartDataCount = r - (a - n), this.remainingPartDataCount > 0) return;
					if (n = i + this.boundaryLength, n >= e.length) {
						this.ignoreByteCount = this.boundaryLength - (e.length - i);
						return;
					}
				}
			}
		}
		copyExistingData(e, t) {
			return new Promise((n, r) => {
				let a = () => {
					if (e === t) {
						n();
						return;
					}
					let o = this.options.tasks[e];
					if (o.kind !== i.OperationKind.COPY) {
						r(/* @__PURE__ */ Error("Task kind must be COPY"));
						return;
					}
					s(o, this.out, this.options.oldFileFd, r, () => {
						e++, a();
					});
				};
				a();
			});
		}
		searchHeaderListEnd(e, t) {
			let n = e.indexOf(a, t);
			if (n !== -1) return n + a.length;
			let r = t === 0 ? e : e.slice(t);
			return this.headerListBuffer = this.headerListBuffer == null ? r : Buffer.concat([this.headerListBuffer, r]), -1;
		}
		onPartEnd() {
			let e = this.partIndexToLength[this.partIndex - 1];
			if (this.actualPartLength !== e) throw (0, t.newError)(`Expected length: ${e} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
			this.actualPartLength = 0;
		}
		processPartStarted(e, t, n) {
			return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(e, t, n);
		}
		processPartData(e, t, n) {
			this.actualPartLength += n - t, this.transferred += n - t, this.delta += n - t;
			let r = this.out;
			return r.write(t === 0 && e.length === n ? e : e.slice(t, n)) ? Promise.resolve() : new Promise((e, t) => {
				r.on("error", t), r.once("drain", () => {
					r.removeListener("error", t), e();
				});
			});
		}
	};
})), bi = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.executeTasksUsingMultipleRangeRequests = i, e.checkIsRangesSupported = o;
	var t = X(), n = yi(), r = vi();
	function i(e, t, n, r, i) {
		let o = (s) => {
			if (s >= t.length) {
				e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
				return;
			}
			let c = s + 1e3;
			a(e, {
				tasks: t,
				start: s,
				end: Math.min(t.length, c),
				oldFileFd: r
			}, n, () => o(c), i);
		};
		return o;
	}
	function a(e, i, a, s, c) {
		let l = "bytes=", u = 0, d = 0, f = /* @__PURE__ */ new Map(), p = [];
		for (let e = i.start; e < i.end; e++) {
			let t = i.tasks[e];
			t.kind === r.OperationKind.DOWNLOAD && (l += `${t.start}-${t.end - 1}, `, f.set(u, e), u++, p.push(t.end - t.start), d += t.end - t.start);
		}
		if (u <= 1) {
			let t = (l) => {
				if (l >= i.end) {
					s();
					return;
				}
				let u = i.tasks[l++];
				if (u.kind === r.OperationKind.COPY) (0, n.copyData)(u, a, i.oldFileFd, c, () => t(l));
				else {
					let n = e.createRequestOptions();
					n.headers.Range = `bytes=${u.start}-${u.end - 1}`;
					let r = e.httpExecutor.createRequest(n, (e) => {
						e.on("error", c), o(e, c) && (e.pipe(a, { end: !1 }), e.once("end", () => t(l)));
					});
					e.httpExecutor.addErrorAndTimeoutHandlers(r, c), r.end();
				}
			};
			t(i.start);
			return;
		}
		let m = e.createRequestOptions();
		m.headers.Range = l.substring(0, l.length - 2);
		let h = e.httpExecutor.createRequest(m, (r) => {
			if (!o(r, c)) return;
			let l = (0, t.safeGetHeader)(r, "content-type"), u = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(l);
			if (u == null) {
				c(/* @__PURE__ */ Error(`Content-Type "multipart/byteranges" is expected, but got "${l}"`));
				return;
			}
			let m = new n.DataSplitter(a, i, f, u[1] || u[2], p, s, d, e.options.onProgress);
			m.on("error", c), r.pipe(m), r.on("end", () => {
				setTimeout(() => {
					h.abort(), c(/* @__PURE__ */ Error("Response ends without calling any handlers"));
				}, 1e4);
			});
		});
		e.httpExecutor.addErrorAndTimeoutHandlers(h, c), h.end();
	}
	function o(e, n) {
		if (e.statusCode >= 400) return n((0, t.createHttpError)(e)), !1;
		if (e.statusCode !== 206) {
			let r = (0, t.safeGetHeader)(e, "accept-ranges");
			if (r == null || r === "none") return n(/* @__PURE__ */ Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
		}
		return !0;
	}
})), xi = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.ProgressDifferentialDownloadCallbackTransform = void 0;
	var t = R("stream"), n;
	(function(e) {
		e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
	})(n ||= {}), e.ProgressDifferentialDownloadCallbackTransform = class extends t.Transform {
		constructor(e, t, r) {
			super(), this.progressDifferentialDownloadInfo = e, this.cancellationToken = t, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = n.COPY, this.nextUpdate = this.start + 1e3;
		}
		_transform(e, t, r) {
			if (this.cancellationToken.cancelled) {
				r(/* @__PURE__ */ Error("cancelled"), null);
				return;
			}
			if (this.operationType == n.COPY) {
				r(null, e);
				return;
			}
			this.transferred += e.length, this.delta += e.length;
			let i = Date.now();
			i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
				total: this.progressDifferentialDownloadInfo.grandTotal,
				delta: this.delta,
				transferred: this.transferred,
				percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
				bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
			}), this.delta = 0), r(null, e);
		}
		beginFileCopy() {
			this.operationType = n.COPY;
		}
		beginRangeDownload() {
			this.operationType = n.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
		}
		endRangeDownload() {
			this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
				total: this.progressDifferentialDownloadInfo.grandTotal,
				delta: this.delta,
				transferred: this.transferred,
				percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
				bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
			});
		}
		_flush(e) {
			if (this.cancellationToken.cancelled) {
				e(/* @__PURE__ */ Error("cancelled"));
				return;
			}
			this.onProgress({
				total: this.progressDifferentialDownloadInfo.grandTotal,
				delta: this.delta,
				transferred: this.transferred,
				percent: 100,
				bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
			}), this.delta = 0, this.transferred = 0, e(null);
		}
	};
})), Si = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.DifferentialDownloader = void 0;
	var t = X(), n = Sn(), r = R("fs"), i = yi(), a = R("url"), o = vi(), s = bi(), c = xi();
	e.DifferentialDownloader = class {
		constructor(e, t, n) {
			this.blockAwareFileInfo = e, this.httpExecutor = t, this.options = n, this.fileMetadataBuffer = null, this.logger = n.logger;
		}
		createRequestOptions() {
			let e = { headers: {
				...this.options.requestHeaders,
				accept: "*/*"
			} };
			return (0, t.configureRequestUrl)(this.options.newUrl, e), (0, t.configureRequestOptions)(e), e;
		}
		doDownload(e, t) {
			if (e.version !== t.version) throw Error(`version is different (${e.version} - ${t.version}), full download is required`);
			let n = this.logger, r = (0, o.computeOperations)(e, t, n);
			n.debug != null && n.debug(JSON.stringify(r, null, 2));
			let i = 0, a = 0;
			for (let e of r) {
				let t = e.end - e.start;
				e.kind === o.OperationKind.DOWNLOAD ? i += t : a += t;
			}
			let s = this.blockAwareFileInfo.size;
			if (i + a + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== s) throw Error(`Internal error, size mismatch: downloadSize: ${i}, copySize: ${a}, newSize: ${s}`);
			return n.info(`Full: ${l(s)}, To download: ${l(i)} (${Math.round(i / (s / 100))}%)`), this.downloadFile(r);
		}
		downloadFile(e) {
			let t = [], r = () => Promise.all(t.map((e) => (0, n.close)(e.descriptor).catch((t) => {
				this.logger.error(`cannot close file "${e.path}": ${t}`);
			})));
			return this.doDownloadFile(e, t).then(r).catch((e) => r().catch((t) => {
				try {
					this.logger.error(`cannot close files: ${t}`);
				} catch (e) {
					try {
						console.error(e);
					} catch {}
				}
				throw e;
			}).then(() => {
				throw e;
			}));
		}
		async doDownloadFile(e, l) {
			let d = await (0, n.open)(this.options.oldFile, "r");
			l.push({
				descriptor: d,
				path: this.options.oldFile
			});
			let f = await (0, n.open)(this.options.newFile, "w");
			l.push({
				descriptor: f,
				path: this.options.newFile
			});
			let p = (0, r.createWriteStream)(this.options.newFile, { fd: f });
			await new Promise((n, r) => {
				let f = [], m;
				if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
					let t = [], n = 0;
					for (let r of e) r.kind === o.OperationKind.DOWNLOAD && (t.push(r.end - r.start), n += r.end - r.start);
					let r = {
						expectedByteCounts: t,
						grandTotal: n
					};
					m = new c.ProgressDifferentialDownloadCallbackTransform(r, this.options.cancellationToken, this.options.onProgress), f.push(m);
				}
				let h = new t.DigestTransform(this.blockAwareFileInfo.sha512);
				h.isValidateOnEnd = !1, f.push(h), p.on("finish", () => {
					p.close(() => {
						l.splice(1, 1);
						try {
							h.validate();
						} catch (e) {
							r(e);
							return;
						}
						n(void 0);
					});
				}), f.push(p);
				let g = null;
				for (let e of f) e.on("error", r), g = g == null ? e : g.pipe(e);
				let _ = f[0], v;
				if (this.options.isUseMultipleRangeRequest) {
					v = (0, s.executeTasksUsingMultipleRangeRequests)(this, e, _, d, r), v(0);
					return;
				}
				let y = 0, b = null;
				this.logger.info(`Differential download: ${this.options.newUrl}`);
				let x = this.createRequestOptions();
				x.redirect = "manual", v = (n) => {
					var s, c;
					if (n >= e.length) {
						this.fileMetadataBuffer != null && _.write(this.fileMetadataBuffer), _.end();
						return;
					}
					let l = e[n++];
					if (l.kind === o.OperationKind.COPY) {
						m && m.beginFileCopy(), (0, i.copyData)(l, _, d, r, () => v(n));
						return;
					}
					let f = `bytes=${l.start}-${l.end - 1}`;
					x.headers.range = f, (c = (s = this.logger)?.debug) == null || c.call(s, `download range: ${f}`), m && m.beginRangeDownload();
					let p = this.httpExecutor.createRequest(x, (e) => {
						e.on("error", r), e.on("aborted", () => {
							r(/* @__PURE__ */ Error("response has been aborted by the server"));
						}), e.statusCode >= 400 && r((0, t.createHttpError)(e)), e.pipe(_, { end: !1 }), e.once("end", () => {
							m && m.endRangeDownload(), ++y === 100 ? (y = 0, setTimeout(() => v(n), 1e3)) : v(n);
						});
					});
					p.on("redirect", (e, n, r) => {
						this.logger.info(`Redirect to ${u(r)}`), b = r, (0, t.configureRequestUrl)(new a.URL(b), x), p.followRedirect();
					}), this.httpExecutor.addErrorAndTimeoutHandlers(p, r), p.end();
				}, v(0);
			});
		}
		async readRemoteBytes(e, t) {
			let n = Buffer.allocUnsafe(t + 1 - e), r = this.createRequestOptions();
			r.headers.range = `bytes=${e}-${t}`;
			let i = 0;
			if (await this.request(r, (e) => {
				e.copy(n, i), i += e.length;
			}), i !== n.length) throw Error(`Received data length ${i} is not equal to expected ${n.length}`);
			return n;
		}
		request(e, t) {
			return new Promise((n, r) => {
				let i = this.httpExecutor.createRequest(e, (e) => {
					(0, s.checkIsRangesSupported)(e, r) && (e.on("error", r), e.on("aborted", () => {
						r(/* @__PURE__ */ Error("response has been aborted by the server"));
					}), e.on("data", t), e.on("end", () => n()));
				});
				this.httpExecutor.addErrorAndTimeoutHandlers(i, r), i.end();
			});
		}
	};
	function l(e, t = " KB") {
		return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
	}
	function u(e) {
		let t = e.indexOf("?");
		return t < 0 ? e : e.substring(0, t);
	}
})), Ci = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.GenericDifferentialDownloader = void 0;
	var t = Si();
	e.GenericDifferentialDownloader = class extends t.DifferentialDownloader {
		download(e, t) {
			return this.doDownload(e, t);
		}
	};
})), wi = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = n;
	var t = X();
	Object.defineProperty(e, "CancellationToken", {
		enumerable: !0,
		get: function() {
			return t.CancellationToken;
		}
	}), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded", e.UpdaterSignal = class {
		constructor(e) {
			this.emitter = e;
		}
		login(e) {
			n(this.emitter, "login", e);
		}
		progress(t) {
			n(this.emitter, e.DOWNLOAD_PROGRESS, t);
		}
		updateDownloaded(t) {
			n(this.emitter, e.UPDATE_DOWNLOADED, t);
		}
		updateCancelled(e) {
			n(this.emitter, "update-cancelled", e);
		}
	};
	function n(e, t, n) {
		e.on(t, n);
	}
})), Ti = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.NoOpLogger = e.AppUpdater = void 0;
	var t = X(), n = R("crypto"), r = R("os"), i = R("events"), a = Sn(), o = dr(), s = fr(), c = R("path"), l = ni(), u = ii(), d = oi(), f = si(), p = di(), m = _i(), h = R("zlib"), g = Ci(), _ = wi();
	e.AppUpdater = class e extends i.EventEmitter {
		get channel() {
			return this._channel;
		}
		set channel(e) {
			if (this._channel != null) {
				if (typeof e != "string") throw (0, t.newError)(`Channel must be a string, but got: ${e}`, "ERR_UPDATER_INVALID_CHANNEL");
				if (e.length === 0) throw (0, t.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
			}
			this._channel = e, this.allowDowngrade = !0;
		}
		addAuthHeader(e) {
			this.requestHeaders = Object.assign({}, this.requestHeaders, { authorization: e });
		}
		get netSession() {
			return (0, f.getNetSession)();
		}
		get logger() {
			return this._logger;
		}
		set logger(e) {
			this._logger = e ?? new y();
		}
		set updateConfigPath(e) {
			this.clientPromise = null, this._appUpdateConfigPath = e, this.configOnDisk = new s.Lazy(() => this.loadUpdateConfig());
		}
		get isUpdateSupported() {
			return this._isUpdateSupported;
		}
		set isUpdateSupported(e) {
			e && (this._isUpdateSupported = e);
		}
		get isUserWithinRollout() {
			return this._isUserWithinRollout;
		}
		set isUserWithinRollout(e) {
			e && (this._isUserWithinRollout = e);
		}
		constructor(e, n) {
			super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new _.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (e) => this.checkIfUpdateSupported(e), this._isUserWithinRollout = (e) => this.isStagingMatch(e), this.clientPromise = null, this.stagingUserIdPromise = new s.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new s.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (e) => {
				this._logger.error(`Error: ${e.stack || e.message}`);
			}), n == null ? (this.app = new d.ElectronAppAdapter(), this.httpExecutor = new f.ElectronHttpExecutor((e, t) => this.emit("login", e, t))) : (this.app = n, this.httpExecutor = null);
			let r = this.app.version, i = (0, l.parse)(r);
			if (i == null) throw (0, t.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
			this.currentVersion = i, this.allowPrerelease = v(i), e != null && (this.setFeedURL(e), typeof e != "string" && e.requestHeaders && (this.requestHeaders = e.requestHeaders));
		}
		getFeedURL() {
			return "Deprecated. Do not use it.";
		}
		setFeedURL(e) {
			let t = this.createProviderRuntimeOptions(), n;
			n = typeof e == "string" ? new p.GenericProvider({
				provider: "generic",
				url: e
			}, this, {
				...t,
				isUseMultipleRangeRequest: (0, m.isUrlProbablySupportMultiRangeRequests)(e)
			}) : (0, m.createClient)(e, this, t), this.clientPromise = Promise.resolve(n);
		}
		checkForUpdates() {
			if (!this.isUpdaterActive()) return Promise.resolve(null);
			let e = this.checkForUpdatesPromise;
			if (e != null) return this._logger.info("Checking for update (already in progress)"), e;
			let t = () => this.checkForUpdatesPromise = null;
			return this._logger.info("Checking for update"), e = this.doCheckForUpdates().then((e) => (t(), e)).catch((e) => {
				throw t(), this.emit("error", e, `Cannot check for updates: ${(e.stack || e).toString()}`), e;
			}), this.checkForUpdatesPromise = e, e;
		}
		isUpdaterActive() {
			return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
		}
		checkForUpdatesAndNotify(t) {
			return this.checkForUpdates().then((n) => n?.downloadPromise ? (n.downloadPromise.then(() => {
				let r = e.formatDownloadNotification(n.updateInfo.version, this.app.name, t);
				new (R("electron")).Notification(r).show();
			}), n) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), n));
		}
		static formatDownloadNotification(e, t, n) {
			return n ??= {
				title: "A new update is ready to install",
				body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
			}, n = {
				title: n.title.replace("{appName}", t).replace("{version}", e),
				body: n.body.replace("{appName}", t).replace("{version}", e)
			}, n;
		}
		async isStagingMatch(e) {
			let n = e.stagingPercentage, r = n;
			if (r == null) return !0;
			if (r = parseInt(r, 10), isNaN(r)) return this._logger.warn(`Staging percentage is NaN: ${n}`), !0;
			r /= 100;
			let i = await this.stagingUserIdPromise.value, a = t.UUID.parse(i).readUInt32BE(12) / 4294967295;
			return this._logger.info(`Staging percentage: ${r}, percentage: ${a}, user id: ${i}`), a < r;
		}
		computeFinalHeaders(e) {
			return this.requestHeaders != null && Object.assign(e, this.requestHeaders), e;
		}
		async isUpdateAvailable(e) {
			let n = (0, l.parse)(e.version);
			if (n == null) throw (0, t.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${e.version}"`, "ERR_UPDATER_INVALID_VERSION");
			let r = this.currentVersion;
			if ((0, l.eq)(n, r) || !await Promise.resolve(this.isUpdateSupported(e)) || !await Promise.resolve(this.isUserWithinRollout(e))) return !1;
			let i = (0, l.gt)(n, r), a = (0, l.lt)(n, r);
			return i ? !0 : this.allowDowngrade && a;
		}
		checkIfUpdateSupported(e) {
			let t = e?.minimumSystemVersion, n = (0, r.release)();
			if (t) try {
				if ((0, l.lt)(n, t)) return this._logger.info(`Current OS version ${n} is less than the minimum OS version required ${t} for version ${n}`), !1;
			} catch (e) {
				this._logger.warn(`Failed to compare current OS version(${n}) with minimum OS version(${t}): ${(e.message || e).toString()}`);
			}
			return !0;
		}
		async getUpdateInfoAndProvider() {
			await this.app.whenReady(), this.clientPromise ??= this.configOnDisk.value.then((e) => (0, m.createClient)(e, this, this.createProviderRuntimeOptions()));
			let e = await this.clientPromise, t = await this.stagingUserIdPromise.value;
			return e.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": t })), {
				info: await e.getLatestVersion(),
				provider: e
			};
		}
		createProviderRuntimeOptions() {
			return {
				isUseMultipleRangeRequest: !0,
				platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
				executor: this.httpExecutor
			};
		}
		async doCheckForUpdates() {
			this.emit("checking-for-update");
			let e = await this.getUpdateInfoAndProvider(), n = e.info;
			if (!await this.isUpdateAvailable(n)) return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${n.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", n), {
				isUpdateAvailable: !1,
				versionInfo: n,
				updateInfo: n
			};
			this.updateInfoAndProvider = e, this.onUpdateAvailable(n);
			let r = new t.CancellationToken();
			return {
				isUpdateAvailable: !0,
				versionInfo: n,
				updateInfo: n,
				cancellationToken: r,
				downloadPromise: this.autoDownload ? this.downloadUpdate(r) : null
			};
		}
		onUpdateAvailable(e) {
			this._logger.info(`Found version ${e.version} (url: ${(0, t.asArray)(e.files).map((e) => e.url).join(", ")})`), this.emit("update-available", e);
		}
		downloadUpdate(e = new t.CancellationToken()) {
			let n = this.updateInfoAndProvider;
			if (n == null) {
				let e = /* @__PURE__ */ Error("Please check update first");
				return this.dispatchError(e), Promise.reject(e);
			}
			if (this.downloadPromise != null) return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
			this._logger.info(`Downloading update from ${(0, t.asArray)(n.info.files).map((e) => e.url).join(", ")}`);
			let r = (e) => {
				if (!(e instanceof t.CancellationError)) try {
					this.dispatchError(e);
				} catch (e) {
					this._logger.warn(`Cannot dispatch error event: ${e.stack || e}`);
				}
				return e;
			};
			return this.downloadPromise = this.doDownloadUpdate({
				updateInfoAndProvider: n,
				requestHeaders: this.computeRequestHeaders(n.provider),
				cancellationToken: e,
				disableWebInstaller: this.disableWebInstaller,
				disableDifferentialDownload: this.disableDifferentialDownload
			}).catch((e) => {
				throw r(e);
			}).finally(() => {
				this.downloadPromise = null;
			}), this.downloadPromise;
		}
		dispatchError(e) {
			this.emit("error", e, (e.stack || e).toString());
		}
		dispatchUpdateDownloaded(e) {
			this.emit(_.UPDATE_DOWNLOADED, e);
		}
		async loadUpdateConfig() {
			return this._appUpdateConfigPath ??= this.app.appUpdateConfigPath, (0, o.load)(await (0, a.readFile)(this._appUpdateConfigPath, "utf-8"));
		}
		computeRequestHeaders(e) {
			let t = e.fileExtraDownloadHeaders;
			if (t != null) {
				let e = this.requestHeaders;
				return e == null ? t : {
					...t,
					...e
				};
			}
			return this.computeFinalHeaders({ accept: "*/*" });
		}
		async getOrCreateStagingUserId() {
			let e = c.join(this.app.userDataPath, ".updaterId");
			try {
				let n = await (0, a.readFile)(e, "utf-8");
				if (t.UUID.check(n)) return n;
				this._logger.warn(`Staging user id file exists, but content was invalid: ${n}`);
			} catch (e) {
				e.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${e}`);
			}
			let r = t.UUID.v5((0, n.randomBytes)(4096), t.UUID.OID);
			this._logger.info(`Generated new staging user ID: ${r}`);
			try {
				await (0, a.outputFile)(e, r);
			} catch (e) {
				this._logger.warn(`Couldn't write out staging user ID: ${e}`);
			}
			return r;
		}
		get isAddNoCacheQuery() {
			let e = this.requestHeaders;
			if (e == null) return !0;
			for (let t of Object.keys(e)) {
				let e = t.toLowerCase();
				if (e === "authorization" || e === "private-token") return !1;
			}
			return !0;
		}
		async getOrCreateDownloadHelper() {
			let e = this.downloadedUpdateHelper;
			if (e == null) {
				let t = (await this.configOnDisk.value).updaterCacheDirName, n = this._logger;
				t ?? n.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
				let r = c.join(this.app.baseCachePath, t || this.app.name);
				n.debug != null && n.debug(`updater cache dir: ${r}`), e = new u.DownloadedUpdateHelper(r), this.downloadedUpdateHelper = e;
			}
			return e;
		}
		async executeDownload(e) {
			let n = e.fileInfo, r = {
				headers: e.downloadUpdateOptions.requestHeaders,
				cancellationToken: e.downloadUpdateOptions.cancellationToken,
				sha2: n.info.sha2,
				sha512: n.info.sha512
			};
			this.listenerCount(_.DOWNLOAD_PROGRESS) > 0 && (r.onProgress = (e) => this.emit(_.DOWNLOAD_PROGRESS, e));
			let i = e.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, s = n.packageInfo;
			function l() {
				let t = decodeURIComponent(e.fileInfo.url.pathname);
				return t.toLowerCase().endsWith(`.${e.fileExtension.toLowerCase()}`) ? c.basename(t) : c.basename(e.fileInfo.info.url);
			}
			let d = await this.getOrCreateDownloadHelper(), f = d.cacheDirForPendingUpdate;
			await (0, a.mkdir)(f, { recursive: !0 });
			let p = l(), m = c.join(f, p), h = s == null ? null : c.join(f, `package-${o}${c.extname(s.path) || ".7z"}`), g = async (t) => {
				await d.setDownloadedFile(m, h, i, n, p, t), await e.done({
					...i,
					downloadedFile: m
				});
				let r = c.join(f, "current.blockmap");
				return await (0, a.pathExists)(r) && await (0, a.copyFile)(r, c.join(d.cacheDir, "current.blockmap")), h == null ? [m] : [m, h];
			}, v = this._logger, y = await d.validateDownloadedPath(m, i, n, v);
			if (y != null) return m = y, await g(!1);
			let b = async () => (await d.clear().catch(() => {}), await (0, a.unlink)(m).catch(() => {})), x = await (0, u.createTempUpdateFile)(`temp-${p}`, f, v);
			try {
				await e.task(x, r, h, b), await (0, t.retry)(() => (0, a.rename)(x, m), {
					retries: 60,
					interval: 500,
					shouldRetry: (e) => e instanceof Error && /^EBUSY:/.test(e.message) ? !0 : (v.warn(`Cannot rename temp file to final file: ${e.message || e.stack}`), !1)
				});
			} catch (e) {
				throw await b(), e instanceof t.CancellationError && (v.info("cancelled"), this.emit("update-cancelled", i)), e;
			}
			return v.info(`New version ${o} has been downloaded to ${m}`), await g(!0);
		}
		async differentialDownloadInstaller(e, t, n, r, i) {
			try {
				if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload) return !0;
				let r = t.updateInfoAndProvider.provider, o = await r.getBlockMapFiles(e.url, this.app.version, t.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
				this._logger.info(`Download block maps (old: "${o[0]}", new: ${o[1]})`);
				let s = async (e) => {
					let n = await this.httpExecutor.downloadToBuffer(e, {
						headers: t.requestHeaders,
						cancellationToken: t.cancellationToken
					});
					if (n == null || n.length === 0) throw Error(`Blockmap "${e.href}" is empty`);
					try {
						return JSON.parse((0, h.gunzipSync)(n).toString());
					} catch (t) {
						throw Error(`Cannot parse blockmap "${e.href}", error: ${t}`);
					}
				}, l = {
					newUrl: e.url,
					oldFile: c.join(this.downloadedUpdateHelper.cacheDir, i),
					logger: this._logger,
					newFile: n,
					isUseMultipleRangeRequest: r.isUseMultipleRangeRequest,
					requestHeaders: t.requestHeaders,
					cancellationToken: t.cancellationToken
				};
				this.listenerCount(_.DOWNLOAD_PROGRESS) > 0 && (l.onProgress = (e) => this.emit(_.DOWNLOAD_PROGRESS, e));
				let u = async (e, t) => {
					let n = c.join(t, "current.blockmap");
					await (0, a.outputFile)(n, (0, h.gzipSync)(JSON.stringify(e)));
				}, d = async (e) => {
					let t = c.join(e, "current.blockmap");
					try {
						if (await (0, a.pathExists)(t)) return JSON.parse((0, h.gunzipSync)(await (0, a.readFile)(t)).toString());
					} catch (e) {
						this._logger.warn(`Cannot parse blockmap "${t}", error: ${e}`);
					}
					return null;
				}, f = await s(o[1]);
				await u(f, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
				let p = await d(this.downloadedUpdateHelper.cacheDir);
				return p ??= await s(o[0]), await new g.GenericDifferentialDownloader(e.info, this.httpExecutor, l).download(p, f), !1;
			} catch (e) {
				if (this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`), this._testOnlyOptions != null) throw e;
				return !0;
			}
		}
	};
	function v(e) {
		let t = (0, l.prerelease)(e);
		return t != null && t.length > 0;
	}
	var y = class {
		info(e) {}
		warn(e) {}
		error(e) {}
	};
	e.NoOpLogger = y;
})), Ei = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.BaseUpdater = void 0;
	var t = R("child_process"), n = R("path"), r = Ti();
	e.BaseUpdater = class extends r.AppUpdater {
		constructor(e, t) {
			super(e, t), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
		}
		quitAndInstall(e = !1, t = !1) {
			this._logger.info("Install on explicit quitAndInstall"), this.install(e, e ? t : this.autoRunAppAfterInstall) ? setImmediate(() => {
				R("electron").autoUpdater.emit("before-quit-for-update"), this.app.quit();
			}) : this.quitAndInstallCalled = !1;
		}
		executeDownload(e) {
			return super.executeDownload({
				...e,
				done: (e) => (this.dispatchUpdateDownloaded(e), this.addQuitHandler(), Promise.resolve())
			});
		}
		get installerPath() {
			return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
		}
		install(e = !1, t = !1) {
			if (this.quitAndInstallCalled) return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
			let n = this.downloadedUpdateHelper, r = this.installerPath, i = n == null ? null : n.downloadedFileInfo;
			if (r == null || i == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			this.quitAndInstallCalled = !0;
			try {
				return this._logger.info(`Install: isSilent: ${e}, isForceRunAfter: ${t}`), this.doInstall({
					isSilent: e,
					isForceRunAfter: t,
					isAdminRightsRequired: i.isAdminRightsRequired
				});
			} catch (e) {
				return this.dispatchError(e), !1;
			}
		}
		addQuitHandler() {
			this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((e) => {
				if (this.quitAndInstallCalled) {
					this._logger.info("Update installer has already been triggered. Quitting application.");
					return;
				}
				if (!this.autoInstallOnAppQuit) {
					this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
					return;
				}
				if (e !== 0) {
					this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${e}`);
					return;
				}
				this._logger.info("Auto install update on quit"), this.install(!0, !1);
			}));
		}
		sanitizeEnvPath(e) {
			return e.split(n.delimiter).filter((e) => n.isAbsolute(e)).join(n.delimiter);
		}
		spawnSyncLog(e, n = [], r = {}) {
			this._logger.info(`Executing: ${e} with args: ${n}`);
			let i = {
				...process.env,
				...r
			}, { error: a, status: o, stdout: s, stderr: c } = (0, t.spawnSync)(e, n, {
				env: {
					...i,
					PATH: this.sanitizeEnvPath(i.PATH ?? "")
				},
				encoding: "utf-8",
				shell: !0
			});
			if (a != null) throw this._logger.error(c), a;
			if (o != null && o !== 0) throw this._logger.error(c), Error(`Command ${e} exited with code ${o}`);
			return s.trim();
		}
		async spawnLog(e, n = [], r = void 0, i = "ignore") {
			return this._logger.info(`Executing: ${e} with args: ${n}`), new Promise((a, o) => {
				try {
					let s = {
						stdio: i,
						env: r,
						detached: !0
					}, c = (0, t.spawn)(e, n, s);
					c.on("error", (e) => {
						o(e);
					}), c.unref(), c.pid !== void 0 && a(!0);
				} catch (e) {
					o(e);
				}
			});
		}
	};
})), Di = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
	var t = Sn(), n = Si(), r = R("zlib");
	e.FileWithEmbeddedBlockMapDifferentialDownloader = class extends n.DifferentialDownloader {
		async download() {
			let e = this.blockAwareFileInfo, t = e.size, n = t - (e.blockMapSize + 4);
			this.fileMetadataBuffer = await this.readRemoteBytes(n, t - 1);
			let r = i(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
			await this.doDownload(await a(this.options.oldFile), r);
		}
	};
	function i(e) {
		return JSON.parse((0, r.inflateRawSync)(e).toString());
	}
	async function a(e) {
		let n = await (0, t.open)(e, "r");
		try {
			let e = (await (0, t.fstat)(n)).size, r = Buffer.allocUnsafe(4);
			await (0, t.read)(n, r, 0, r.length, e - r.length);
			let a = Buffer.allocUnsafe(r.readUInt32BE(0));
			return await (0, t.read)(n, a, 0, a.length, e - r.length - a.length), await (0, t.close)(n), i(a);
		} catch (e) {
			throw await (0, t.close)(n), e;
		}
	}
})), Oi = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.AppImageUpdater = void 0;
	var t = X(), n = R("child_process"), r = Sn(), i = R("fs"), a = R("path"), o = Ei(), s = Di(), c = ui(), l = wi();
	e.AppImageUpdater = class extends o.BaseUpdater {
		constructor(e, t) {
			super(e, t);
		}
		isUpdaterActive() {
			return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
		}
		doDownloadUpdate(e) {
			let n = e.updateInfoAndProvider.provider, i = (0, c.findFile)(n.resolveFiles(e.updateInfoAndProvider.info), "AppImage", [
				"rpm",
				"deb",
				"pacman"
			]);
			return this.executeDownload({
				fileExtension: "AppImage",
				fileInfo: i,
				downloadUpdateOptions: e,
				task: async (a, o) => {
					let s = process.env.APPIMAGE;
					if (s == null) throw (0, t.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
					(e.disableDifferentialDownload || await this.downloadDifferential(i, s, a, n, e)) && await this.httpExecutor.download(i.url, a, o), await (0, r.chmod)(a, 493);
				}
			});
		}
		async downloadDifferential(e, t, n, r, i) {
			try {
				let a = {
					newUrl: e.url,
					oldFile: t,
					logger: this._logger,
					newFile: n,
					isUseMultipleRangeRequest: r.isUseMultipleRangeRequest,
					requestHeaders: i.requestHeaders,
					cancellationToken: i.cancellationToken
				};
				return this.listenerCount(l.DOWNLOAD_PROGRESS) > 0 && (a.onProgress = (e) => this.emit(l.DOWNLOAD_PROGRESS, e)), await new s.FileWithEmbeddedBlockMapDifferentialDownloader(e.info, this.httpExecutor, a).download(), !1;
			} catch (e) {
				return this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`), process.platform === "linux";
			}
		}
		doInstall(e) {
			let r = process.env.APPIMAGE;
			if (r == null) throw (0, t.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
			if (!a.isAbsolute(r) || r.includes("\0")) throw (0, t.newError)(`APPIMAGE env is not a valid absolute path: "${r}"`, "ERR_UPDATER_OLD_FILE_NOT_FOUND");
			(0, i.unlinkSync)(r);
			let o, s = a.basename(r), c = this.installerPath;
			if (c == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			o = a.basename(c) === s || !/\d+\.\d+\.\d+/.test(s) ? r : a.join(a.dirname(r), a.basename(c)), (0, n.execFileSync)("mv", [
				"-f",
				c,
				o
			]), o !== r && this.emit("appimage-filename-updated", o);
			let l = {
				...process.env,
				APPIMAGE_SILENT_INSTALL: "true"
			};
			return e.isForceRunAfter ? this.spawnLog(o, [], l) : (l.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, n.execFileSync)(o, [], { env: l })), !0;
		}
	};
})), ki = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.LinuxUpdater = void 0;
	var t = Ei(), n = /^[a-zA-Z0-9_-]+$/;
	e.LinuxUpdater = class extends t.BaseUpdater {
		constructor(e, t) {
			super(e, t);
		}
		isRunningAsRoot() {
			return process.getuid?.call(process) === 0;
		}
		get installerPath() {
			let e = super.installerPath;
			return e == null ? null : e.replace(/\\/g, "\\\\").replace(/([`$!" ;|&()<>])/g, "\\$1").replace(/[\n\r]/g, "");
		}
		runCommandWithSudoIfNeeded(e) {
			if (this.isRunningAsRoot()) return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(e[0], e.slice(1));
			let { name: t } = this.app, n = `"${t.replace(/["`$\\!\n\r;|&<>(){}*?[\]#~]/g, "")} would like to update"`, r = this.sudoWithArgs(n);
			this._logger.info(`Running as non-root user, using sudo to install: ${r}`);
			let i = "\"";
			return (/pkexec/i.test(r[0]) || r[0] === "sudo") && (i = ""), this.spawnSyncLog(r[0], [
				...r.length > 1 ? r.slice(1) : [],
				`${i}/bin/bash`,
				"-c",
				`'${e.join(" ")}'${i}`
			]);
		}
		sudoWithArgs(e) {
			let t = this.determineSudoCommand(), n = [t];
			return /kdesudo/i.test(t) ? (n.push("--comment", e), n.push("-c")) : /gksudo/i.test(t) ? n.push("--message", e) : /pkexec/i.test(t) && n.push("--disable-internal-agent"), n;
		}
		hasCommand(e) {
			try {
				return this.spawnSyncLog("command", ["-v", e]), !0;
			} catch {
				return !1;
			}
		}
		determineSudoCommand() {
			for (let e of [
				"gksudo",
				"kdesudo",
				"pkexec",
				"beesu"
			]) if (this.hasCommand(e)) return e;
			return "sudo";
		}
		detectPackageManager(e) {
			let t = e, r = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER?.trim();
			r && (n.test(r) ? t = [r] : this._logger.warn(`ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER "${r}" contains unsafe characters. Ignoring override.`));
			for (let e of t) if (this.hasCommand(e)) return e;
			let i = r ? `ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER override "${r}", ` : "", a = e[0];
			return this._logger.warn(`No package manager found in the list: ${i}${e.join(", ")}. Utilizing default: ${a}`), a;
		}
	};
})), Ai = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.DebUpdater = void 0;
	var t = ui(), n = wi(), r = ki();
	e.DebUpdater = class e extends r.LinuxUpdater {
		constructor(e, t) {
			super(e, t);
		}
		doDownloadUpdate(e) {
			let r = e.updateInfoAndProvider.provider, i = (0, t.findFile)(r.resolveFiles(e.updateInfoAndProvider.info), "deb", [
				"AppImage",
				"rpm",
				"pacman"
			]);
			return this.executeDownload({
				fileExtension: "deb",
				fileInfo: i,
				downloadUpdateOptions: e,
				task: async (e, t) => {
					this.listenerCount(n.DOWNLOAD_PROGRESS) > 0 && (t.onProgress = (e) => this.emit(n.DOWNLOAD_PROGRESS, e)), await this.httpExecutor.download(i.url, e, t);
				}
			});
		}
		doInstall(t) {
			let n = this.installerPath;
			if (n == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			if (!this.hasCommand("dpkg") && !this.hasCommand("apt")) return this.dispatchError(/* @__PURE__ */ Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
			let r = this.detectPackageManager(["dpkg", "apt"]);
			try {
				e.installWithCommandRunner(r, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
			} catch (e) {
				return this.dispatchError(e), !1;
			}
			return t.isForceRunAfter && this.app.relaunch(), !0;
		}
		static installWithCommandRunner(e, t, n, r) {
			if (e === "dpkg") try {
				n([
					"dpkg",
					"-i",
					t
				]);
			} catch (e) {
				r.warn(e.message ?? e), r.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), n([
					"apt-get",
					"install",
					"-f",
					"-y"
				]);
			}
			else if (e === "apt") r.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), n([
				"apt",
				"install",
				"-y",
				"--allow-unauthenticated",
				"--allow-downgrades",
				"--allow-change-held-packages",
				t
			]);
			else throw Error(`Package manager ${e} not supported`);
		}
	};
})), ji = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.PacmanUpdater = void 0;
	var t = wi(), n = ui(), r = ki();
	e.PacmanUpdater = class e extends r.LinuxUpdater {
		constructor(e, t) {
			super(e, t);
		}
		doDownloadUpdate(e) {
			let r = e.updateInfoAndProvider.provider, i = (0, n.findFile)(r.resolveFiles(e.updateInfoAndProvider.info), "pacman", [
				"AppImage",
				"deb",
				"rpm"
			]);
			return this.executeDownload({
				fileExtension: "pacman",
				fileInfo: i,
				downloadUpdateOptions: e,
				task: async (e, n) => {
					this.listenerCount(t.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (e) => this.emit(t.DOWNLOAD_PROGRESS, e)), await this.httpExecutor.download(i.url, e, n);
				}
			});
		}
		doInstall(t) {
			let n = this.installerPath;
			if (n == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			try {
				e.installWithCommandRunner(n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
			} catch (e) {
				return this.dispatchError(e), !1;
			}
			return t.isForceRunAfter && this.app.relaunch(), !0;
		}
		static installWithCommandRunner(e, t, n) {
			try {
				t([
					"pacman",
					"-U",
					"--noconfirm",
					e
				]);
			} catch (r) {
				n.warn(r.message ?? r), n.warn("pacman installation failed, attempting to update package database and retry");
				try {
					t([
						"pacman",
						"-Sy",
						"--noconfirm"
					]), t([
						"pacman",
						"-U",
						"--noconfirm",
						e
					]);
				} catch (e) {
					throw n.error("Retry after pacman -Sy failed"), e;
				}
			}
		}
	};
})), Mi = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.RpmUpdater = void 0;
	var t = wi(), n = ui(), r = ki();
	e.RpmUpdater = class e extends r.LinuxUpdater {
		constructor(e, t) {
			super(e, t);
		}
		doDownloadUpdate(e) {
			let r = e.updateInfoAndProvider.provider, i = (0, n.findFile)(r.resolveFiles(e.updateInfoAndProvider.info), "rpm", [
				"AppImage",
				"deb",
				"pacman"
			]);
			return this.executeDownload({
				fileExtension: "rpm",
				fileInfo: i,
				downloadUpdateOptions: e,
				task: async (e, n) => {
					this.listenerCount(t.DOWNLOAD_PROGRESS) > 0 && (n.onProgress = (e) => this.emit(t.DOWNLOAD_PROGRESS, e)), await this.httpExecutor.download(i.url, e, n);
				}
			});
		}
		doInstall(t) {
			let n = this.installerPath;
			if (n == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			let r = this.detectPackageManager([
				"zypper",
				"dnf",
				"yum",
				"rpm"
			]);
			try {
				e.installWithCommandRunner(r, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
			} catch (e) {
				return this.dispatchError(e), !1;
			}
			return t.isForceRunAfter && this.app.relaunch(), !0;
		}
		static installWithCommandRunner(e, t, n, r) {
			if (e === "zypper") return n([
				"zypper",
				"--non-interactive",
				"--no-refresh",
				"install",
				"--allow-unsigned-rpm",
				"-f",
				t
			]);
			if (e === "dnf") return n([
				"dnf",
				"install",
				"--nogpgcheck",
				"-y",
				t
			]);
			if (e === "yum") return n([
				"yum",
				"install",
				"--nogpgcheck",
				"-y",
				t
			]);
			if (e === "rpm") return r.warn("Installing with rpm only (no dependency resolution)."), n([
				"rpm",
				"-Uvh",
				"--replacepkgs",
				"--replacefiles",
				"--nodeps",
				t
			]);
			throw Error(`Package manager ${e} not supported`);
		}
	};
})), Ni = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.MacUpdater = void 0;
	var t = X(), n = Sn(), r = R("fs"), i = R("path"), a = R("http"), o = Ti(), s = ui(), c = R("child_process"), l = R("crypto");
	e.MacUpdater = class e extends o.AppUpdater {
		constructor(e, t) {
			super(e, t), this.nativeUpdater = R("electron").autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (e) => {
				this._logger.warn(e), this.emit("error", e);
			}), this.nativeUpdater.on("update-downloaded", () => {
				this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
			});
		}
		static filterFilesForArch(e, t) {
			let n = (e) => e.url.pathname.includes("arm64") || e.info.url?.includes("arm64");
			return t && e.some(n) ? e.filter((e) => t === n(e)) : e.filter((e) => !n(e));
		}
		debug(e) {
			this._logger.debug != null && this._logger.debug(e);
		}
		closeServerIfExists() {
			this.server && (this.debug("Closing proxy server"), this.server.close((e) => {
				e && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
			}));
		}
		async doDownloadUpdate(r) {
			let a = r.updateInfoAndProvider.provider.resolveFiles(r.updateInfoAndProvider.info), o = this._logger, l = "sysctl.proc_translated", u = !1;
			try {
				this.debug("Checking for macOS Rosetta environment"), u = (0, c.execFileSync)("sysctl", [l], { encoding: "utf8" }).includes(`${l}: 1`), o.info(`Checked for macOS Rosetta environment (isRosetta=${u})`);
			} catch (e) {
				o.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${e}`);
			}
			let d = !1;
			try {
				this.debug("Checking for arm64 in uname");
				let e = (0, c.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
				o.info(`Checked 'uname -a': arm64=${e}`), d ||= e;
			} catch (e) {
				o.warn(`uname shell command to check for arm64 failed: ${e}`);
			}
			d = d || process.arch === "arm64" || u, a = e.filterFilesForArch(a, d);
			let f = (0, s.findFile)(a, "zip", ["pkg", "dmg"]);
			if (f == null) throw (0, t.newError)(`ZIP file not provided: ${(0, t.safeStringifyJson)(a)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
			let p = r.updateInfoAndProvider.provider, m = "update.zip";
			return this.executeDownload({
				fileExtension: "zip",
				fileInfo: f,
				downloadUpdateOptions: r,
				task: async (e, t) => {
					let a = i.join(this.downloadedUpdateHelper.cacheDir, m), s = () => (0, n.pathExistsSync)(a) ? !r.disableDifferentialDownload : (o.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1), c = !0;
					s() && (c = await this.differentialDownloadInstaller(f, r, e, p, m)), c && await this.httpExecutor.download(f.url, e, t);
				},
				done: async (e) => {
					if (!r.disableDifferentialDownload) try {
						let t = i.join(this.downloadedUpdateHelper.cacheDir, m);
						await (0, n.copyFile)(e.downloadedFile, t);
					} catch (e) {
						this._logger.warn(`Unable to copy file for caching for future differential downloads: ${e.message}`);
					}
					return this.updateDownloaded(f, e);
				}
			});
		}
		async updateDownloaded(e, t) {
			let i = t.downloadedFile, o = e.info.size ?? (await (0, n.stat)(i)).size, s = this._logger, c = `fileToProxy=${e.url.href}`;
			this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${c})`), this.server = (0, a.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${c})`), this.server.on("close", () => {
				s.info(`Proxy server for native Squirrel.Mac is closed (${c})`);
			});
			let u = (e) => {
				let t = e.address();
				return typeof t == "string" ? t : `http://127.0.0.1:${t?.port}`;
			};
			return await new Promise((e, n) => {
				let a = (0, l.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), d = Buffer.from(`autoupdater:${a}`, "ascii"), f = `/${(0, l.randomBytes)(64).toString("hex")}.zip`;
				this.server.on("request", (t, c) => {
					let l = t.url;
					if (s.info(`${l} requested`), l === "/") {
						if (!t.headers.authorization || t.headers.authorization.indexOf("Basic ") === -1) {
							c.statusCode = 401, c.statusMessage = "Invalid Authentication Credentials", c.end(), s.warn("No authenthication info");
							return;
						}
						let e = t.headers.authorization.split(" ")[1], [n, r] = Buffer.from(e, "base64").toString("ascii").split(":");
						if (n !== "autoupdater" || r !== a) {
							c.statusCode = 401, c.statusMessage = "Invalid Authentication Credentials", c.end(), s.warn("Invalid authenthication credentials");
							return;
						}
						let i = Buffer.from(`{ "url": "${u(this.server)}${f}" }`);
						c.writeHead(200, {
							"Content-Type": "application/json",
							"Content-Length": i.length
						}), c.end(i);
						return;
					}
					if (!l.startsWith(f)) {
						s.warn(`${l} requested, but not supported`), c.writeHead(404), c.end();
						return;
					}
					s.info(`${f} requested by Squirrel.Mac, pipe ${i}`);
					let d = !1;
					c.on("finish", () => {
						d || (this.nativeUpdater.removeListener("error", n), e([]));
					});
					let p = (0, r.createReadStream)(i);
					p.on("error", (e) => {
						try {
							c.end();
						} catch (e) {
							s.warn(`cannot end response: ${e}`);
						}
						d = !0, this.nativeUpdater.removeListener("error", n), n(/* @__PURE__ */ Error(`Cannot pipe "${i}": ${e}`));
					}), c.writeHead(200, {
						"Content-Type": "application/zip",
						"Content-Length": o
					}), p.pipe(c);
				}), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${c})`), this.server.listen(0, "127.0.0.1", () => {
					this.debug(`Proxy server for native Squirrel.Mac is listening (address=${u(this.server)}, ${c})`), this.nativeUpdater.setFeedURL({
						url: u(this.server),
						headers: {
							"Cache-Control": "no-cache",
							Authorization: `Basic ${d.toString("base64")}`
						}
					}), this.dispatchUpdateDownloaded(t), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", n), this.nativeUpdater.checkForUpdates()) : e([]);
				});
			});
		}
		handleUpdateDownloaded() {
			this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
		}
		quitAndInstall() {
			this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
		}
	};
})), Pi = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.verifySignature = o;
	var t = X(), n = R("child_process"), r = R("os"), i = R("path");
	function a(e, t) {
		return [
			"set \"PSModulePath=\" & chcp 65001 >NUL & powershell.exe",
			[
				"-NoProfile",
				"-NonInteractive",
				"-InputFormat",
				"None",
				"-Command",
				e
			],
			{
				shell: !0,
				timeout: t
			}
		];
	}
	function o(e, r, o) {
		return new Promise((l, u) => {
			let d = r.replace(/'/g, "''");
			o.info(`Verifying signature ${d}`), (0, n.execFile)(...a(`"Get-AuthenticodeSignature -LiteralPath '${d}' | ConvertTo-Json -Compress"`, 2e4), (n, a, d) => {
				try {
					if (n != null || d) {
						c(o, n, d, u), l(null);
						return;
					}
					let f = s(a);
					if (f.Status === 0) {
						try {
							let e = i.normalize(f.Path), t = i.normalize(r);
							if (o.info(`LiteralPath: ${e}. Update Path: ${t}`), e !== t) {
								c(o, /* @__PURE__ */ Error(`LiteralPath of ${e} is different than ${t}`), d, u), l(null);
								return;
							}
						} catch (e) {
							o.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${e.message ?? e.stack}`);
						}
						let n = (0, t.parseDn)(f.SignerCertificate.Subject), a = !1;
						for (let r of e) {
							let e = (0, t.parseDn)(r);
							if (e.size ? a = Array.from(e.keys()).every((t) => e.get(t) === n.get(t)) : r === n.get("CN") && (o.warn(`Signature validated using only CN ${r}. Please add your full Distinguished Name (DN) to publisherNames configuration`), a = !0), a) {
								l(null);
								return;
							}
						}
					}
					let p = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(f, (e, t) => e === "RawData" ? void 0 : t, 2);
					o.warn(`Sign verification failed, installer signed with incorrect certificate: ${p}`), l(p);
				} catch (e) {
					c(o, e, null, u), l(null);
					return;
				}
			});
		});
	}
	function s(e) {
		let t = JSON.parse(e);
		delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
		let n = t.SignerCertificate;
		return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
	}
	function c(e, t, r, i) {
		if (l()) {
			e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || r}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
			return;
		}
		try {
			(0, n.execFileSync)(...a("ConvertTo-Json test", 1e4));
		} catch (t) {
			e.warn(`Cannot execute ConvertTo-Json: ${t.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
			return;
		}
		t != null && i(t), r && i(/* @__PURE__ */ Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${r}. Failing signature validation due to unknown stderr.`));
	}
	function l() {
		let e = r.release();
		return e.startsWith("6.") && !e.startsWith("6.3");
	}
})), Fi = /* @__PURE__ */ L(((e) => {
	Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = void 0;
	var t = X(), n = R("path"), r = Ei(), i = Di(), a = wi(), o = ui(), s = Sn(), c = Pi(), l = R("url");
	e.NsisUpdater = class extends r.BaseUpdater {
		constructor(e, t) {
			super(e, t), this._verifyUpdateCodeSignature = (e, t) => (0, c.verifySignature)(e, t, this._logger);
		}
		get verifyUpdateCodeSignature() {
			return this._verifyUpdateCodeSignature;
		}
		set verifyUpdateCodeSignature(e) {
			e && (this._verifyUpdateCodeSignature = e);
		}
		doDownloadUpdate(e) {
			let n = e.updateInfoAndProvider.provider, r = (0, o.findFile)(n.resolveFiles(e.updateInfoAndProvider.info), "exe");
			return this.executeDownload({
				fileExtension: "exe",
				downloadUpdateOptions: e,
				fileInfo: r,
				task: async (i, a, o, c) => {
					let u = r.packageInfo, d = u != null && o != null;
					if (d && e.disableWebInstaller) throw (0, t.newError)(`Unable to download new version ${e.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
					!d && !e.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (d || e.disableDifferentialDownload || await this.differentialDownloadInstaller(r, e, i, n, t.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, a);
					let f = await this.verifySignature(i);
					if (f != null) throw await c(), (0, t.newError)(`New version ${e.updateInfoAndProvider.info.version} is not signed by the application owner: ${f}`, "ERR_UPDATER_INVALID_SIGNATURE");
					if (d && await this.differentialDownloadWebPackage(e, u, o, n)) try {
						await this.httpExecutor.download(new l.URL(u.path), o, {
							headers: e.requestHeaders,
							cancellationToken: e.cancellationToken,
							sha512: u.sha512
						});
					} catch (e) {
						try {
							await (0, s.unlink)(o);
						} catch {}
						throw e;
					}
				}
			});
		}
		async verifySignature(e) {
			let t;
			try {
				if (t = (await this.configOnDisk.value).publisherName, t == null) return null;
			} catch (e) {
				if (e.code === "ENOENT") return null;
				throw e;
			}
			return await this._verifyUpdateCodeSignature(Array.isArray(t) ? t : [t], e);
		}
		doInstall(e) {
			let t = this.installerPath;
			if (t == null) return this.dispatchError(/* @__PURE__ */ Error("No update filepath provided, can't quit and install")), !1;
			let r = ["--updated"];
			e.isSilent && r.push("/S"), e.isForceRunAfter && r.push("--force-run"), this.installDirectory && r.push(`/D=${this.installDirectory}`);
			let i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
			i != null && r.push(`--package-file=${i}`);
			let a = () => {
				this.spawnLog(n.join(process.resourcesPath, "elevate.exe"), [t].concat(r)).catch((e) => this.dispatchError(e));
			};
			return e.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), a(), !0) : (this.spawnLog(t, r).catch((e) => {
				let n = e.code;
				this._logger.info(`Cannot run installer: error code: ${n}, error message: "${e.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), n === "UNKNOWN" || n === "EACCES" ? a() : n === "ENOENT" ? R("electron").shell.openPath(t).catch((e) => this.dispatchError(e)) : this.dispatchError(e);
			}), !0);
		}
		async differentialDownloadWebPackage(e, r, o, s) {
			if (r.blockMapSize == null) return !0;
			try {
				let c = {
					newUrl: new l.URL(r.path),
					oldFile: n.join(this.downloadedUpdateHelper.cacheDir, t.CURRENT_APP_PACKAGE_FILE_NAME),
					logger: this._logger,
					newFile: o,
					requestHeaders: this.requestHeaders,
					isUseMultipleRangeRequest: s.isUseMultipleRangeRequest,
					cancellationToken: e.cancellationToken
				};
				this.listenerCount(a.DOWNLOAD_PROGRESS) > 0 && (c.onProgress = (e) => this.emit(a.DOWNLOAD_PROGRESS, e)), await new i.FileWithEmbeddedBlockMapDifferentialDownloader(r, this.httpExecutor, c).download();
			} catch (e) {
				return this._logger.error(`Cannot download differentially, fallback to full download: ${e.stack || e}`), process.platform === "win32";
			}
			return !1;
		}
	};
})), Ii = (/* @__PURE__ */ L(((e) => {
	var t = e && e.__createBinding || (Object.create ? (function(e, t, n, r) {
		r === void 0 && (r = n);
		var i = Object.getOwnPropertyDescriptor(t, n);
		(!i || ("get" in i ? !t.__esModule : i.writable || i.configurable)) && (i = {
			enumerable: !0,
			get: function() {
				return t[n];
			}
		}), Object.defineProperty(e, r, i);
	}) : (function(e, t, n, r) {
		r === void 0 && (r = n), e[r] = t[n];
	})), n = e && e.__exportStar || function(e, n) {
		for (var r in e) r !== "default" && !Object.prototype.hasOwnProperty.call(n, r) && t(n, e, r);
	};
	Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
	var r = Sn(), i = R("path"), a = Ei();
	Object.defineProperty(e, "BaseUpdater", {
		enumerable: !0,
		get: function() {
			return a.BaseUpdater;
		}
	});
	var o = Ti();
	Object.defineProperty(e, "AppUpdater", {
		enumerable: !0,
		get: function() {
			return o.AppUpdater;
		}
	}), Object.defineProperty(e, "NoOpLogger", {
		enumerable: !0,
		get: function() {
			return o.NoOpLogger;
		}
	});
	var s = ui();
	Object.defineProperty(e, "Provider", {
		enumerable: !0,
		get: function() {
			return s.Provider;
		}
	});
	var c = Oi();
	Object.defineProperty(e, "AppImageUpdater", {
		enumerable: !0,
		get: function() {
			return c.AppImageUpdater;
		}
	});
	var l = Ai();
	Object.defineProperty(e, "DebUpdater", {
		enumerable: !0,
		get: function() {
			return l.DebUpdater;
		}
	});
	var u = ji();
	Object.defineProperty(e, "PacmanUpdater", {
		enumerable: !0,
		get: function() {
			return u.PacmanUpdater;
		}
	});
	var d = Mi();
	Object.defineProperty(e, "RpmUpdater", {
		enumerable: !0,
		get: function() {
			return d.RpmUpdater;
		}
	});
	var f = Ni();
	Object.defineProperty(e, "MacUpdater", {
		enumerable: !0,
		get: function() {
			return f.MacUpdater;
		}
	});
	var p = Fi();
	Object.defineProperty(e, "NsisUpdater", {
		enumerable: !0,
		get: function() {
			return p.NsisUpdater;
		}
	}), n(wi(), e);
	var m;
	function h() {
		if (process.platform === "win32") m = new (Fi()).NsisUpdater();
		else if (process.platform === "darwin") m = new (Ni()).MacUpdater();
		else {
			m = new (Oi()).AppImageUpdater();
			try {
				let e = i.join(process.resourcesPath, "package-type");
				if (!(0, r.existsSync)(e)) return m;
				switch ((0, r.readFileSync)(e).toString().trim()) {
					case "deb":
						m = new (Ai()).DebUpdater();
						break;
					case "rpm":
						m = new (Mi()).RpmUpdater();
						break;
					case "pacman": m = new (ji()).PacmanUpdater();
				}
			} catch (e) {
				console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", e.message);
			}
		}
		return m;
	}
	Object.defineProperty(e, "autoUpdater", {
		enumerable: !0,
		get: () => m || h()
	});
})))(), Li = p.dirname(d(import.meta.url)), Ri = null, zi = null, Bi = null;
function Vi(e) {
	let r = re(e);
	return n.buildFromTemplate([
		{
			label: r.openPanel,
			click: () => {
				zi && (zi.show(), zi.focus());
			}
		},
		{
			label: r.docs,
			click: () => {
				if (Bi) {
					Bi.isMinimized() && Bi.restore(), Bi.show(), Bi.focus();
					return;
				}
				Bi = new t({
					width: 1100,
					height: 800,
					title: "Sentinel Forge - Documentation",
					autoHideMenuBar: !0,
					webPreferences: {
						nodeIntegration: !1,
						contextIsolation: !0,
						sandbox: !0
					}
				}), Bi.on("closed", () => {
					Bi = null;
				}), Bi.webContents.setWindowOpenHandler((e) => (u.openExternal(e.url), { action: "deny" })), process.env.VITE_DEV_SERVER_URL ? Bi.loadURL(`${process.env.VITE_DEV_SERVER_URL}help.html?lang=${e}`) : Bi.loadFile(p.join(Li, "../dist/help.html"), { search: `lang=${e}` });
			}
		},
		{ type: "separator" },
		{
			label: r.checkUpdates,
			click: () => {
				Ii.autoUpdater.checkForUpdatesAndNotify().catch((e) => {
					W.warn(`Manual update check failed: ${e.message}`);
				});
			}
		},
		{ type: "separator" },
		{
			label: r.closeEngine,
			click: () => {
				a.quit();
			}
		}
	]);
}
function Hi(e, t, n = "en") {
	zi = e, Ri && Ri.destroy(), Ri = new i(t);
	let r = re(n);
	Ri.setToolTip(r.tooltip), Ri.setContextMenu(Vi(n)), Ri.on("click", () => {
		zi && (zi.isVisible() ? zi.hide() : (zi.show(), zi.focus()));
	});
}
function Ui(e) {
	if (!Ri) return;
	let t = re(e);
	Ri.setToolTip(t.tooltip), Ri.setContextMenu(Vi(e));
}
//#endregion
//#region electron/updater.ts
function Wi(e) {
	Ii.autoUpdater.logger = W, Ii.autoUpdater.autoDownload = !0, Ii.autoUpdater.autoInstallOnAppQuit = !0, Ii.autoUpdater.on("error", (t) => {
		W.error("Auto-updater critical error:", t), e.webContents.send("update-status", {
			status: "error",
			error: t.message
		});
	}), Ii.autoUpdater.checkForUpdatesAndNotify().catch((e) => {
		W.error("Failed to initially check for updates:", e);
	}), Ii.autoUpdater.on("update-available", (t) => {
		W.info(`New version available: ${t.version}`), e.webContents.send("update-status", {
			status: "available",
			version: t.version
		});
	}), Ii.autoUpdater.on("download-progress", (t) => {
		let n = Math.round(t.percent);
		W.debug(`Downloading update: ${n}%`), e.webContents.send("update-progress", {
			percent: n,
			bytesPerSecond: t.bytesPerSecond,
			transferred: t.transferred,
			total: t.total
		});
	}), Ii.autoUpdater.on("update-downloaded", (t) => {
		W.info(`Update downloaded and ready to install: ${t.version}`), e.webContents.send("update-status", {
			status: "downloaded",
			version: t.version
		});
	}), Ii.autoUpdater.on("update-not-available", () => {
		W.info("No updates available. App is up to date."), e.webContents.send("update-status", {
			status: "up-to-date",
			version: a.getVersion()
		});
	}), s.on("restart-to-update", () => {
		W.info("User requested restart to install the update."), Ii.autoUpdater.quitAndInstall(!1, !0);
	});
}
//#endregion
//#region electron/main.ts
a.name = "Sentinel Forge";
var Gi = p.dirname(d(import.meta.url));
process.env.APP_ROOT = p.join(Gi, "..");
var Ki = process.env.VITE_DEV_SERVER_URL, qi = p.join(process.env.APP_ROOT, "dist-electron"), Ji = p.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = Ki ? p.join(process.env.APP_ROOT, "public") : Ji;
var $ = null, Yi = !1, Xi = "en";
if (!a.requestSingleInstanceLock()) a.quit();
else {
	if (a.on("second-instance", () => {
		$ && ($.isMinimized() && $.restore(), $.isVisible() || $.show(), $.focus(), W.info("Prevented duplicate instance. Restoring active window."));
	}), process.platform === "win32") {
		let e = a.isPackaged ? "com.sentinelforge.app" : "com.sentinelforge.dev.app";
		a.setAppUserModelId(e);
	}
	function e() {
		W.info("Building Sentinel Forge main window..."), Ki || l.defaultSession.webRequest.onHeadersReceived((e, t) => {
			t({ responseHeaders: {
				...e.responseHeaders,
				"Content-Security-Policy": ["default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none';"]
			} });
		}), l.defaultSession.setPermissionRequestHandler((e, t, n) => {
			W.warn(`Blocked frontend attempt to access hardware permission: ${t}`), n(!1);
		});
		let e = process.platform === "win32" ? "ico" : "png", n = a.isPackaged ? p.join(process.resourcesPath, "public", `sentinel.${e}`) : p.join(process.env.APP_ROOT, "public", `sentinel.${e}`), r = c.createFromPath(n);
		$ = new t({
			width: 1200,
			height: 800,
			icon: r,
			backgroundColor: "#020617",
			show: !1,
			autoHideMenuBar: !0,
			frame: !1,
			titleBarStyle: "hidden",
			webPreferences: {
				preload: p.join(Gi, "preload.cjs"),
				contextIsolation: !0,
				nodeIntegration: !1,
				sandbox: !0
			}
		}), $.once("ready-to-show", () => {
			$?.show(), process.platform === "win32" && $?.setIcon(r), W.info("Interface rendered successfully.");
		}), $.on("close", (e) => {
			if (!Yi) return e.preventDefault(), $?.hide(), W.info("Window minimized to system tray."), !1;
		}), $.webContents.setWindowOpenHandler((e) => e.url.includes("help.html") ? {
			action: "allow",
			overrideBrowserWindowOptions: {
				autoHideMenuBar: !0,
				width: 1100,
				height: 800,
				title: "Sentinel Forge - Documentation",
				webPreferences: {
					nodeIntegration: !1,
					contextIsolation: !0
				}
			}
		} : (W.warn(`External URL opening attempt intercepted: ${e.url}`), u.openExternal(e.url), { action: "deny" })), $.webContents.on("render-process-gone", (e, t) => {
			W.error("The rendering process (Frontend) crashed!", t.reason);
		}), Ki ? $.loadURL(Ki) : $.loadFile(p.join(Ji, "index.html")), Hi($, n, Xi), Ht($), a.isPackaged && Wi($);
	}
	s.on("change-language", (e, t) => {
		Xi = t, Ui(t), W.info(`Engine language changed to: ${t}`);
	}), a.on("before-quit", () => {
		W.info("Shutdown process started (before-quit)."), Yi = !0;
	}), a.on("window-all-closed", () => {
		process.platform !== "darwin" && (W.info("All windows closed. Terminating application."), a.quit(), $ = null);
	}), a.whenReady().then(() => {
		W.init(), e(), a.on("activate", () => {
			t.getAllWindows().length === 0 ? (W.info("Reactivating application (activate)."), e()) : $?.show();
		});
	});
}
//#endregion
export { qi as MAIN_DIST, Ji as RENDERER_DIST, Ki as VITE_DEV_SERVER_URL };
