import { getUpdateType } from "../../components/common/SemVerBadge";
import i18n from "../../i18n";

const severityOrder: Record<string, number> = {
  critical: 5,
  high: 4,
  moderate: 3,
  low: 2,
  info: 1,
};

export function generateSastRows(sastList?: any[]): string {
  if (!sastList || sastList.length === 0) return "";
  return sastList
    .map(
      (s: any) => `<tr>
        <td><span class="sev-tag" style="color:#ef4444; border: 1px solid #ef444433; background-color:#ef44440A;">${i18n.t("reports.sastTag")}</span></td>
        <td><div style="font-weight:700; color:#0f172a; font-size:12px;">${s.type}</div></td>
        <td><div style="color:#334155; font-size:11px; line-height:1.4;"><strong>${s.file}</strong><br><span style="font-size:10px; color:#64748b;">${i18n.t("reports.line")} ${s.line}</span></div></td>
        <td><div style="color:#ef4444; font-size:11px; font-family: monospace; font-weight:bold; background:#fef2f2; border: 1px solid #fecaca; padding:6px 8px; border-radius:4px; word-break: break-all;">${s.match}</div></td>
    </tr>`,
    )
    .join("");
}

export function generateVulnerabilityRows(rawVulnList: any[]): string {
  if (!rawVulnList || rawVulnList.length === 0) return "";
  const sortedVulns = rawVulnList.sort(
    (a, b) =>
      (severityOrder[b.severity] || 0) - (severityOrder[a.severity] || 0),
  );

  return sortedVulns
    .map((v: any) => {
      const sevColor =
        v.severity === "critical"
          ? "#be123c"
          : v.severity === "high"
            ? "#f59e0b"
            : v.severity === "moderate"
              ? "#7c3aed"
              : v.severity === "low"
                ? "#0284c7"
                : "#64748b";

      const displayTitle =
        v.title ||
        v.via?.find((x: any) => typeof x === "object" && x.title)?.title ||
        i18n.t("reports.unspecifiedVuln");
      const displayUrl =
        v.url || v.via?.find((x: any) => typeof x === "object" && x.url)?.url;

      let mitigation = `<span style='color:#be123c; font-weight:600;'>${i18n.t("reports.noPatch")}</span>`;

      if (v.patchedIn)
        mitigation = `<span style='color:#059669; font-weight:600;'>${i18n.t("reports.updateTo")} ${v.patchedIn}</span>`;
      else if (v.fixAvailable)
        mitigation =
          typeof v.fixAvailable === "object"
            ? `${i18n.t("reports.updateTo")} v${v.fixAvailable.version}`
            : `<span style='color:#059669;'>${i18n.t("reports.availableViaAuditFix")}</span>`;

      const urlHtml = displayUrl
        ? `<div style="margin-top:4px;"><a href="${displayUrl}" target="_blank" style="color:#0284c7; font-size: 10px; font-weight:600; text-decoration:none;">${i18n.t("reports.officialAdvisory")}</a></div>`
        : "";
      const vectorEffects = v.effects?.[0] || i18n.t("reports.multiple");
      const vectorHtml = v.isDirect
        ? i18n.t("reports.directDependency")
        : `${i18n.t("reports.transitive")} <span style="color:#94a3b8; font-size:9px;">${i18n.t("reports.via")} ${vectorEffects}</span>`;

      const blameHtml = v.introducedBy
        ? `<div style="margin-top:6px; font-size:9px; color:#0f172a; background:#f1f5f9; border:1px solid #e2e8f0; padding:4px 6px; border-radius:4px; display:inline-block;">${i18n.t("reports.introducedBy")} <strong>${v.introducedBy}</strong></div>`
        : "";
      const sourcesHtml =
        v.sources && v.sources.length > 0
          ? v.sources
              .map(
                (s: string) =>
                  `<span style="display:inline-block; padding:2px 6px; border-radius:4px; font-size:8px; font-weight:800; text-transform:uppercase; margin-top:4px; margin-right:4px; ${
                    s === "OSV.dev"
                      ? "background-color:#eef2ff; color:#4f46e5; border:1px solid #c7d2fe;"
                      : "background-color:#f8fafc; color:#475569; border:1px solid #e2e8f0;"
                  }">${s}</span>`,
              )
              .join("")
          : `<span style="display:inline-block; padding:2px 6px; border-radius:4px; font-size:8px; font-weight:800; text-transform:uppercase; margin-top:4px; background-color:#f8fafc; color:#475569; border:1px solid #e2e8f0;">NPM / YARN</span>`;

      return `<tr>
        <td><span class="sev-tag" style="color:${sevColor}; border: 1px solid ${sevColor}33; background-color:${sevColor}0A;">${v.severity.toUpperCase()}</span></td>
        <td>
          <div style="font-weight:700; color:#0f172a; font-size:12px;">${v.name}</div>
          <div>${sourcesHtml}</div>
          <div style="font-size:10px; color:#64748b; margin-top:4px;">${vectorHtml}</div>
          ${blameHtml}
        </td>
        <td><div style="color:#334155; font-size:11px; line-height:1.4;"><strong>${displayTitle}</strong></div>${urlHtml}</td>
        <td style="color:#475569; font-size:11px;">${mitigation}</td>
    </tr>`;
    })
    .join("");
}

export function generateOutdatedRows(
  outdatedObj?: Record<
    string,
    { current: string; wanted: string; latest: string }
  >,
): string {
  if (!outdatedObj) return "";
  const list = Object.entries(outdatedObj);
  if (list.length === 0) return "";

  return list
    .map(([pkg, info]) => {
      const updateType = getUpdateType(info.current, info.latest);
      let tagHtml = "";
      if (updateType === "MAJOR")
        tagHtml = `<span style="font-size:8px; font-weight:bold; color:#f43f5e; border:1px solid #f43f5e; padding:1px 4px; border-radius:3px; margin-left:6px;">${i18n.t("semver.major")}</span>`;
      if (updateType === "MINOR")
        tagHtml = `<span style="font-size:8px; font-weight:bold; color:#f59e0b; border:1px solid #f59e0b; padding:1px 4px; border-radius:3px; margin-left:6px;">${i18n.t("semver.minor")}</span>`;
      if (updateType === "PATCH")
        tagHtml = `<span style="font-size:8px; font-weight:bold; color:#94a3b8; border:1px solid #94a3b8; padding:1px 4px; border-radius:3px; margin-left:6px;">${i18n.t("semver.patch")}</span>`;

      return `<tr>
        <td style="font-family: monospace; font-weight: 700; color: #0f172a; font-size: 11px;">${pkg}</td>
        <td style="font-family: monospace; font-size: 11px; color: #64748b;">${info.current}</td>
        <td style="font-family: monospace; font-size: 11px; color: #d97706; font-weight: 700;">${info.wanted}</td>
        <td style="font-family: monospace; font-size: 11px; color: #e11d48; font-weight: 700;">${info.latest} ${tagHtml}</td>
    </tr>`;
    })
    .join("");
}
