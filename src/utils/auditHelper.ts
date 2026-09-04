import type { ScanSummary } from "../types";

export const extractAuditSummary = (data: any): ScanSummary => {
  const metaVulns = data?.metadata?.vulnerabilities || {};
  const vulnList = Object.values(data?.vulnerabilities || {});
  const outdatedCount = data?.outdated ? Object.keys(data.outdated).length : 0;

  let total = metaVulns.total || 0;
  let critical = metaVulns.critical || 0;
  let high = metaVulns.high || 0;
  let moderate = metaVulns.moderate || 0;
  let low = metaVulns.low || 0;
  let info = metaVulns.info || 0;

  if (total === 0 && vulnList.length > 0) {
    total = vulnList.length;
    critical = vulnList.filter((v: any) => v.severity === "critical").length;
    high = vulnList.filter((v: any) => v.severity === "high").length;
    moderate = vulnList.filter((v: any) => v.severity === "moderate").length;
    low = vulnList.filter((v: any) => v.severity === "low").length;
    info = vulnList.filter((v: any) => v.severity === "info").length;
  }

  return {
    timestamp: new Date().toISOString(),
    total,
    critical,
    high,
    moderate,
    low,
    info,
    outdated: outdatedCount,
    fullReport: data,
  };
};
