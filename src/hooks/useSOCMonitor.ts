import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { Project } from "../types";

export function useSOCMonitor(projects: Project[], scanInterval: number) {
  const { t } = useTranslation();
  const isMonitoring = useRef(false);

  useEffect(() => {
    const { api } = window;
    if (!api || projects.length === 0) return;

    api.onSilentAuditResult((result: any) => {
      if (result.success && result.data && result.data.metadata) {
        const metaVulns = result.data.metadata.vulnerabilities;
        const totalVulns = Object.values(metaVulns).reduce<number>(
          (acc, curr) => acc + Number(curr),
          0,
        );

        if (totalVulns > 0) {
          const project = projects.find((p) => p.path === result.projectPath);
          const projectName = project
            ? project.name
            : t("socMonitor.unknownProject");

          api.showNotification(
            t("socMonitor.alertTitle"),
            t("socMonitor.alertBody", {
              count: totalVulns,
              project: projectName,
            }),
          );
        }
      }
    });

    const interval = setInterval(() => {
      if (isMonitoring.current) return;
      isMonitoring.current = true;

      projects.forEach((proj) => {
        api.runSilentAudit(proj.path, proj.defaultManager || "yarn");
      });

      setTimeout(() => {
        isMonitoring.current = false;
      }, 10000);
    }, scanInterval);

    return () => {
      clearInterval(interval);
      api.removeSilentAuditListeners?.();
    };
  }, [projects, scanInterval, t]);
}
