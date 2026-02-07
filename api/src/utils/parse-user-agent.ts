export function parseBrowserName(ua?: string | null): string {
  if (!ua) return "Desconhecido";

  const agent = ua.toLowerCase();

  // =========================
  // Browsers baseados em Chromium (ordem importa)
  // =========================

  if (agent.includes("edg/")) return "Edge";

  if (agent.includes("opr/") || agent.includes("opera")) {
    return agent.includes("mobile") ? "Opera Mobile" : "Opera";
  }

  if (agent.includes("vivaldi")) return "Vivaldi";

  if (agent.includes("brave")) return "Brave";

  if (agent.includes("chrome")) {
    return agent.includes("mobile") ? "Chrome Mobile" : "Chrome";
  }

  // =========================
  // Firefox
  // =========================

  if (agent.includes("firefox")) {
    return agent.includes("mobile") ? "Firefox Mobile" : "Firefox";
  }

  // =========================
  // Safari (precisa vir depois de Chrome)
  // =========================

  if (agent.includes("safari")) {
    if (agent.includes("mobile")) return "Safari iOS";
    return "Safari";
  }

  // =========================
  // Apple WebViews / In-App
  // =========================

  if (agent.includes("applewebkit") && agent.includes("mobile")) {
    return "WebView iOS";
  }

  // =========================
  // Android WebView
  // =========================

  if (agent.includes("wv") || agent.includes("android")) {
    return "WebView Android";
  }

  // =========================
  // Legacy / específicos
  // =========================

  if (agent.includes("msie") || agent.includes("trident")) {
    return "Internet Explorer";
  }

  // =========================
  // Fallback
  // =========================

  return "Outros";
}
