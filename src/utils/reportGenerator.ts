import type { Project } from "../types";
import type { AuditPayload } from "../components/ThreatDashboard/ThreatDashboard";
import i18n from "../i18n";
import { calculateRiskScore } from "./riskScore";
import {
  generateSastRows,
  generateVulnerabilityRows,
  generateOutdatedRows,
} from "./reports/tableGenerators";
import {
  wrapHtmlLayout,
  generateStatsContainer,
  generateMiniBar,
} from "./reports/htmlComponents";

export function generateHtmlReport(
  data: AuditPayload,
  projectName?: string,
  workspaceName?: string,
): string {
  const date = new Date().toLocaleString(
    i18n.language === "en" ? "en-US" : "pt-BR",
  );
  const finalProjectName = projectName || i18n.t("reports.unknownRepo");
  const finalWorkspaceName =
    workspaceName || i18n.t("reports.defaultWorkspace");
  const rawVulnList = Object.values(data?.vulnerabilities || {});
  const outdatedCount = Object.keys(data?.outdated || {}).length;
  const sastList = data?.sast || [];
  const sastCount = sastList.length;

  let crit = data?.metadata?.vulnerabilities?.critical || 0;
  let high = data?.metadata?.vulnerabilities?.high || 0;
  let mod = data?.metadata?.vulnerabilities?.moderate || 0;
  let low = data?.metadata?.vulnerabilities?.low || 0;
  let info = data?.metadata?.vulnerabilities?.info || 0;

  if (crit + high + mod + low + info === 0 && rawVulnList.length > 0) {
    crit = rawVulnList.filter((v: any) => v.severity === "critical").length;
    high = rawVulnList.filter((v: any) => v.severity === "high").length;
    mod = rawVulnList.filter((v: any) => v.severity === "moderate").length;
    low = rawVulnList.filter((v: any) => v.severity === "low").length;
    info = rawVulnList.filter((v: any) => v.severity === "info").length;
  }

  const riskScore = calculateRiskScore(
    crit,
    high,
    mod,
    low,
    outdatedCount,
    sastCount,
  );
  const sastHtml = generateSastRows(sastList);
  const rowsHtml = generateVulnerabilityRows(rawVulnList);
  const outdatedHtml = generateOutdatedRows(data?.outdated);

  const headerDetails = `<strong>${i18n.t("reports.workspaceLabel")}:</strong> ${finalWorkspaceName}<br><strong>${i18n.t("reports.repositoryLabel")}:</strong> <span style="color:#0f172a; font-weight:700;">${finalProjectName}</span><br><strong>${i18n.t("reports.scanDateLabel")}:</strong> ${date}`;

  const content = `
    ${generateStatsContainer(riskScore, sastCount, crit, high, mod, low, info, outdatedCount)}
    
    ${!rowsHtml && !outdatedHtml && !sastHtml ? `<div style="padding: 30px; background-color: #f0fdf4; border: 2px solid #bbf7d0; border-radius: 8px; text-align: center; margin-bottom: 30px;"><h2 style="color: #16a34a; margin: 0; font-size: 18px; text-transform:uppercase;">${i18n.t("reports.cleanSystemTitle")}</h2><p style="color: #15803d; font-size: 12px; margin-top: 8px; font-weight:600;">${i18n.t("reports.cleanSystemDesc")}</p></div>` : ""}
    ${sastHtml ? `<h2 style="font-size:14px; text-transform:uppercase; border-left:4px solid #ef4444; padding-left:10px; letter-spacing:0.5px; color:#ef4444;">${i18n.t("reports.sastTitle")}</h2><table style="margin-bottom: 40px;"><thead><tr><th style="width: 14%">${i18n.t("reports.sastHeaders.alert")}</th><th style="width: 26%">${i18n.t("reports.sastHeaders.type")}</th><th style="width: 30%">${i18n.t("reports.sastHeaders.location")}</th><th style="width: 30%">${i18n.t("reports.sastHeaders.value")}</th></tr></thead><tbody>${sastHtml}</tbody></table>` : ""}
    ${rowsHtml ? `<h2 style="font-size:14px; text-transform:uppercase; border-left:4px solid #be123c; padding-left:10px; letter-spacing:0.5px;">${i18n.t("reports.cveTitle")}</h2><table><thead><tr><th style="width: 14%">${i18n.t("reports.cveHeaders.severity")}</th><th style="width: 26%">${i18n.t("reports.cveHeaders.packageVector")}</th><th style="width: 38%">${i18n.t("reports.cveHeaders.vulnRef")}</th><th style="width: 22%">${i18n.t("reports.cveHeaders.mitigation")}</th></tr></thead><tbody>${rowsHtml}</tbody></table>` : ""}
    ${outdatedHtml ? `${rowsHtml ? '<div style="margin-top: 40px;"></div>' : ""}<h2 style="font-size:14px; text-transform:uppercase; border-left:4px solid #d97706; padding-left:10px; letter-spacing:0.5px;">${i18n.t("reports.outdatedTitle")}</h2><table><thead><tr><th style="width: 40%">${i18n.t("reports.outdatedHeaders.package")}</th><th style="width: 20%">${i18n.t("reports.outdatedHeaders.current")}</th><th style="width: 20%">${i18n.t("reports.outdatedHeaders.wanted")}</th><th style="width: 20%">${i18n.t("reports.outdatedHeaders.latest")}</th></tr></thead><tbody>${outdatedHtml}</tbody></table>` : ""}
  `;

  return wrapHtmlLayout(
    "Sentinel Forge",
    i18n.t("reports.tacticalReportTitle"),
    headerDetails,
    content,
  );
}

export function generateWorkspaceHtmlReport(
  workspaceName: string,
  projects: Project[],
): string {
  const date = new Date().toLocaleString(
    i18n.language === "en" ? "en-US" : "pt-BR",
  );

  let totalCritical = 0,
    totalHigh = 0,
    totalModerate = 0,
    totalLow = 0,
    totalInfo = 0,
    totalOutdated = 0,
    totalSast = 0;
  let maxVulns = 0,
    maxOutdated = 0;

  const projectStats = projects.map((p) => {
    const latestScan = p.scanHistory?.[0];
    const outdatedCount = latestScan?.fullReport?.outdated
      ? Object.keys(latestScan.fullReport.outdated).length
      : 0;
    const sastCount = latestScan?.fullReport?.sast?.length || 0;
    const crit = latestScan?.critical || 0;
    const high = latestScan?.high || 0;
    const mod = latestScan?.moderate || 0;
    const low = latestScan?.low || 0;
    const infoVal = latestScan?.info || 0;
    const totalVulns = crit + high + mod + low + infoVal;

    if (totalVulns > maxVulns) maxVulns = totalVulns;
    if (outdatedCount > maxOutdated) maxOutdated = outdatedCount;

    totalCritical += crit;
    totalHigh += high;
    totalModerate += mod;
    totalLow += low;
    totalInfo += infoVal;
    totalOutdated += outdatedCount;
    totalSast += sastCount;

    return {
      name: p.name,
      latestScan,
      outdatedCount,
      crit,
      high,
      mod,
      low,
      info: infoVal,
      sastCount,
    };
  });

  const globalRiskScore = calculateRiskScore(
    totalCritical,
    totalHigh,
    totalModerate,
    totalLow,
    totalOutdated,
    totalSast,
  );

  const projectRows = projectStats
    .map((p) => {
      if (!p.latestScan)
        return `<tr><td style="font-weight:700; color:#0f172a;">${p.name}</td><td colspan="7" style="text-align:center; color:#94a3b8; font-style:italic;">${i18n.t("reports.noTelemetry")}</td></tr>`;

      return `<tr>
      <td style="font-weight:700; color:#0f172a;">${p.name}</td>
      <td><span style="font-weight:900; color:${p.sastCount > 0 ? "#ef4444" : "#94a3b8"};">${p.sastCount}</span></td>
      <td><span style="font-weight:900; color:${p.crit > 0 ? "#be123c" : "#94a3b8"};">${p.crit}</span>${generateMiniBar(p.crit, maxVulns, "#be123c")}</td>
      <td><span style="font-weight:900; color:${p.high > 0 ? "#f59e0b" : "#94a3b8"};">${p.high}</span>${generateMiniBar(p.high, maxVulns, "#f59e0b")}</td>
      <td><span style="font-weight:900; color:${p.mod > 0 ? "#7c3aed" : "#94a3b8"};">${p.mod}</span>${generateMiniBar(p.mod, maxVulns, "#7c3aed")}</td>
      <td><span style="font-weight:900; color:${p.low > 0 ? "#0284c7" : "#94a3b8"};">${p.low}</span>${generateMiniBar(p.low, maxVulns, "#0284c7")}</td>
      <td><span style="font-weight:900; color:${p.info > 0 ? "#64748b" : "#94a3b8"};">${p.info}</span>${generateMiniBar(p.info, maxVulns, "#64748b")}</td>
      <td><span style="font-weight:900; color:${p.outdatedCount > 0 ? "#d97706" : "#94a3b8"};">${p.outdatedCount}</span>${generateMiniBar(p.outdatedCount, maxOutdated, "#d97706")}</td>
    </tr>`;
    })
    .join("");

  let detailedSections = "";
  projects.forEach((p) => {
    const ls = p.scanHistory?.[0];
    if (ls && ls.fullReport) {
      const sastHtml = generateSastRows(ls.fullReport.sast || []);
      const vulnHtml = generateVulnerabilityRows(
        Object.values(ls.fullReport.vulnerabilities || {}),
      );
      const outHtml = generateOutdatedRows(ls.fullReport.outdated);

      if (vulnHtml || outHtml || sastHtml) {
        detailedSections += `<div style="page-break-inside: avoid; margin-top: 50px;"><h3 style="font-size:14px; color:#0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; text-transform:uppercase; letter-spacing:0.5px;">${i18n.t("reports.target")} <span style="color:#0284c7;">${p.name}</span></h3>`;
        if (sastHtml)
          detailedSections += `<h4 style="font-size:12px; color:#ef4444; margin-bottom: 10px; text-transform:uppercase;">${i18n.t("reports.sastTitle")}</h4><table style="margin-bottom:20px;"><thead><tr><th style="width: 14%">${i18n.t("reports.sastHeaders.alert")}</th><th style="width: 26%">${i18n.t("reports.sastHeaders.type")}</th><th style="width: 30%">${i18n.t("reports.sastHeaders.location")}</th><th style="width: 30%">${i18n.t("reports.sastHeaders.value")}</th></tr></thead><tbody>${sastHtml}</tbody></table>`;
        if (vulnHtml)
          detailedSections += `<h4 style="font-size:12px; color:#be123c; margin-bottom: 10px; text-transform:uppercase;">${i18n.t("reports.cveTitle")}</h4><table><thead><tr><th style="width: 14%">${i18n.t("reports.cveHeaders.severity")}</th><th style="width: 26%">${i18n.t("reports.cveHeaders.packageVector")}</th><th style="width: 38%">${i18n.t("reports.cveHeaders.vulnRef")}</th><th style="width: 22%">${i18n.t("reports.cveHeaders.mitigation")}</th></tr></thead><tbody>${vulnHtml}</tbody></table>`;
        if (outHtml)
          detailedSections += `<h4 style="font-size:12px; color:#d97706; ${vulnHtml ? "margin-top: 25px;" : ""} margin-bottom: 10px; text-transform:uppercase;">${i18n.t("reports.outdatedTitle")}</h4><table><thead><tr><th style="width: 40%">${i18n.t("reports.outdatedHeaders.package")}</th><th style="width: 20%">${i18n.t("reports.outdatedHeaders.current")}</th><th style="width: 20%">${i18n.t("reports.outdatedHeaders.wanted")}</th><th style="width: 20%">${i18n.t("reports.outdatedHeaders.latest")}</th></tr></thead><tbody>${outHtml}</tbody></table>`;
        detailedSections += `</div>`;
      }
    }
  });

  const headerDetails = `<strong>${i18n.t("reports.workspaceLabel")}:</strong> <span style="color:#0f172a; font-weight:700;">${workspaceName}</span><br><strong>${i18n.t("reports.issueDateLabel")}:</strong> ${date}`;

  const content = `
    ${generateStatsContainer(globalRiskScore, totalSast, totalCritical, totalHigh, totalModerate, totalLow, totalInfo, totalOutdated)}
    <h2 style="font-size:14px; text-transform:uppercase; border-left:4px solid #0f172a; padding-left:10px; letter-spacing:0.5px;">${i18n.t("reports.telemetryStatusTitle")}</h2>
    <table>
        <thead><tr><th style="width: 18%;">${i18n.t("reports.telemetryHeaders.repository")}</th><th style="width: 12%;">${i18n.t("reports.telemetryHeaders.sast")}</th><th style="width: 11%;">${i18n.t("reports.telemetryHeaders.critical")}</th><th style="width: 11%;">${i18n.t("reports.telemetryHeaders.high")}</th><th style="width: 11%;">${i18n.t("reports.telemetryHeaders.moderate")}</th><th style="width: 11%;">${i18n.t("reports.telemetryHeaders.low")}</th><th style="width: 11%;">${i18n.t("reports.telemetryHeaders.info")}</th><th style="width: 15%;">${i18n.t("reports.telemetryHeaders.outdated")}</th></tr></thead>
        <tbody>${projectRows}</tbody>
    </table>
    ${detailedSections ? `<div style="page-break-before: always;"></div><h2 style="font-size:16px; text-transform:uppercase; border-left:4px solid #0f172a; padding-left:10px; margin-top: 30px; margin-bottom: 10px; letter-spacing:1px;">${i18n.t("reports.telemetryXrayTitle")}</h2>${detailedSections}` : ""}
  `;

  return wrapHtmlLayout(
    "Sentinel Forge",
    i18n.t("reports.consolidatedReportTitle"),
    headerDetails,
    content,
  );
}
