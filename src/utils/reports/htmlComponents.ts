import { getRiskColor, getRiskLabel } from "../riskScore";
import { LOGO_BASE64 } from "../assets";
import i18n from "../../i18n";

export function generateDonutChart(score: number, size: number = 120): string {
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const color = getRiskColor(score);
  const letter = getRiskLabel(score);
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return `
    <div style="position: relative; width: ${size}px; height: ${size}px; display: inline-block;">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="#e2e8f0" stroke-width="12" />
        <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="none" stroke="${color}" stroke-width="12" stroke-dasharray="${circumference}" stroke-dashoffset="${strokeDashoffset}" stroke-linecap="round" transform="rotate(-90 ${size / 2} ${size / 2})" style="transition: stroke-dashoffset 1s ease-in-out;" />
      </svg>
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">
        <span style="font-size: 28px; font-weight: 900; color: ${color}; line-height: 1;">${letter}</span>
        <span style="font-size: 10px; font-weight: 700; color: #64748b; margin-top: 2px;">SCORE ${score}</span>
      </div>
    </div>
  `;
}

export function generateMiniBar(
  count: number,
  max: number,
  color: string,
): string {
  const width = max > 0 ? Math.min((count / max) * 100, 100) : 0;
  return `<div style="width: 100%; background-color: #f1f5f9; height: 6px; border-radius: 3px; margin-top: 4px; overflow: hidden;"><div style="width: ${width}%; background-color: ${color}; height: 100%; border-radius: 3px;"></div></div>`;
}

export function generateStatsContainer(
  score: number,
  sast: number,
  crit: number,
  high: number,
  mod: number,
  low: number,
  info: number,
  out: number,
): string {
  const sastClass = sast > 0 ? "sast-card-danger" : "sast-card-safe";
  const sastLabelColor = sast > 0 ? "color: white;" : "color: #475569;";
  const sastValueColor = sast > 0 ? "color: white;" : "color: #94a3b8;";

  return `
    <div class="dashboard-top">
        <div class="score-container">
            <h3 style="margin:0 0 15px 0; font-size:12px; color:#475569; text-transform:uppercase; letter-spacing:1px;">${i18n.t("dashboard.overview.riskScore")}</h3>
            ${generateDonutChart(score)}
        </div>
        <div class="stats-container">
            <div class="card ${sastClass}">
              <span style="${sastLabelColor}">${i18n.t("dashboard.overview.sastCard")}</span>
              <span style="font-size:24px; ${sastValueColor}">${sast}</span>
            </div>
            <div class="card critical">${i18n.t("dashboard.overview.levels.critical")}<br><span style="font-size:24px; margin-top:5px; display:block;">${crit}</span></div>
            <div class="card high">${i18n.t("dashboard.overview.levels.high")}<br><span style="font-size:24px; margin-top:5px; display:block;">${high}</span></div>
            <div class="card moderate">${i18n.t("dashboard.overview.levels.moderate")}<br><span style="font-size:24px; margin-top:5px; display:block;">${mod}</span></div>
            <div class="card low">${i18n.t("dashboard.overview.levels.low")}<br><span style="font-size:24px; margin-top:5px; display:block;">${low}</span></div>
            <div class="card info">${i18n.t("dashboard.overview.levels.info")}<br><span style="font-size:24px; margin-top:5px; display:block;">${info}</span></div>
            <div class="card outdated">${i18n.t("dashboard.overview.levels.outdated")}<br><span style="font-size:24px; margin-top:5px; display:block;">${out}</span></div>
        </div>
    </div>
  `;
}

export function generateRiskLegend(): string {
  return `
    <div style="page-break-inside: avoid; margin-top: 40px; padding: 20px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; font-family: 'Segoe UI', system-ui, sans-serif;">
        <h3 style="margin: 0 0 15px 0; font-size: 13px; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px;">${i18n.t("dashboard.methodology.title")}</h3>
        <div style="display: flex; gap: 30px;">
            <div style="flex: 1;">
                <p style="margin: 0 0 10px 0; font-size: 11px; color: #475569; line-height: 1.5;">${i18n.t("dashboard.methodology.description").replace("Risk Score", "<strong>Risk Score</strong>")}</p>
                <ul style="list-style: none; padding: 12px; margin: 0; background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 6px; font-size: 11px; color: #475569; line-height: 1.8;">
                    <li><strong style="color: #ef4444;">${i18n.t("dashboard.methodology.rules.sast")}</strong> ${i18n.t("dashboard.methodology.rules.sastVal")}</li>
                    <li><strong style="color: #be123c;">${i18n.t("dashboard.methodology.rules.critical")}</strong> ${i18n.t("dashboard.methodology.rules.criticalVal")}</li>
                    <li><strong style="color: #f59e0b;">${i18n.t("dashboard.methodology.rules.high")}</strong> ${i18n.t("dashboard.methodology.rules.highVal")}</li>
                    <li><strong style="color: #7c3aed;">${i18n.t("dashboard.methodology.rules.moderate")}</strong> ${i18n.t("dashboard.methodology.rules.moderateVal")}</li>
                    <li><strong style="color: #0284c7;">${i18n.t("dashboard.methodology.rules.low")}</strong> ${i18n.t("dashboard.methodology.rules.lowVal")}</li>
                    <li><strong style="color: #d97706;">${i18n.t("dashboard.methodology.rules.outdated")}</strong> ${i18n.t("dashboard.methodology.rules.outdatedVal")}</li>
                </ul>
            </div>
            <div style="flex: 1;">
                <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 0;">
                    <tbody>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong style="color: #10b981; font-size: 12px;">${i18n.t("dashboard.methodology.grades.a")}</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #475569; text-align: right;">${i18n.t("dashboard.methodology.grades.aDesc")}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong style="color: #f59e0b; font-size: 12px;">${i18n.t("dashboard.methodology.grades.b")}</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #475569; text-align: right;">${i18n.t("dashboard.methodology.grades.bDesc")}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong style="color: #ea580c; font-size: 12px;">${i18n.t("dashboard.methodology.grades.c")}</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #475569; text-align: right;">${i18n.t("dashboard.methodology.grades.cDesc")}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;"><strong style="color: #be123c; font-size: 12px;">${i18n.t("dashboard.methodology.grades.d")}</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; color: #475569; text-align: right;">${i18n.t("dashboard.methodology.grades.dDesc")}</td></tr>
                        <tr><td style="padding: 8px 0; border-bottom: none;"><strong style="color: #881337; font-size: 12px; white-space: nowrap;">${i18n.t("dashboard.methodology.grades.f")}</strong></td><td style="padding: 8px 0; border-bottom: none; color: #475569; text-align: right;">${i18n.t("dashboard.methodology.grades.fDesc")}</td></tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  `;
}

export function wrapHtmlLayout(
  title: string,
  subtitle: string,
  headerDetails: string,
  content: string,
): string {
  return `
    <!DOCTYPE html>
    <html lang="${i18n.language}">
    <head>
        <meta charset="UTF-8">
        <title>${title} - ${subtitle}</title>
        <style>
            @media print { body { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } @page { margin: 1.5cm; } }
            body { font-family: 'Segoe UI', system-ui, sans-serif; color: #1e293b; margin: 0; padding: 40px; background: #ffffff; position: relative; }
            body::after { content: ''; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 60%; height: 60%; background-image: url('${LOGO_BASE64}'); background-repeat: no-repeat; background-position: center; background-size: contain; opacity: 0.03; filter: grayscale(100%); z-index: -1; pointer-events: none; }
            .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 20px; margin-bottom: 30px; }
            .logo-area { display: flex; align-items: center; gap: 15px; } .logo { width: 52px; height: 52px; }
            .dashboard-top { display: flex; gap: 30px; margin-bottom: 40px; }
            .score-container { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-width: 200px; }
            .stats-container { flex: 1; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; align-content: start; }
            .card { padding: 15px; border-radius: 8px; text-align: center; color: white; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
            .sast-card-danger { background-color: #ef4444 !important; grid-column: span 3; display: flex; justify-content: space-between; align-items: center; text-align: left; padding: 15px 25px; border: 1px solid #ef4444;}
            .sast-card-safe { background-color: #f8fafc !important; grid-column: span 3; display: flex; justify-content: space-between; align-items: center; text-align: left; padding: 15px 25px; border: 1px solid #e2e8f0;}
            .critical { background-color: #be123c !important; } .high { background-color: #f59e0b !important; } .moderate { background-color: #7c3aed !important; } .low { background-color: #0284c7 !important; } .info { background-color: #64748b !important; } .outdated { background-color: #d97706 !important; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; table-layout: fixed; }
            th { background: #f8fafc; text-align: left; padding: 12px; border-bottom: 2px solid #cbd5e1; font-size: 10px; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
            td { padding: 12px; border-bottom: 1px solid #f1f5f9; font-size: 11px; word-wrap: break-word; vertical-align: top; }
            .sev-tag { font-weight: 900; padding: 4px 6px; border-radius: 4px; font-size: 9px; white-space: nowrap; display: inline-block; text-align: center;}
            .footer { margin-top: 20px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div class="logo-area">
                <img src="${LOGO_BASE64}" class="logo" />
                <div>
                    <h1 style="margin:0; font-size:22px; color:#0f172a; font-weight:900; letter-spacing:-0.5px;">${title}</h1>
                    <div style="font-size:12px; color:#64748b; font-weight:600; text-transform:uppercase; letter-spacing:1px;">${subtitle}</div>
                </div>
            </div>
            <div style="text-align:right; font-size:11px; color:#475569; line-height: 1.6;">${headerDetails}</div>
        </div>
        ${content}
        ${generateRiskLegend()}
        <div class="footer">${i18n.t("reports.footer", { title: title, year: new Date().getFullYear() })}</div>
    </body>
    </html>
  `;
}
