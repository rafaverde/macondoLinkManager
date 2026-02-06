export function parseBrowserName(ua?: string | null): string {
  if (!ua) return "Desconhecido";

  const agent = ua.toLowerCase();

  if (agent.includes("edg")) return "Edge";

  if (agent.includes("chrome") && agent.includes("mobile")) {
    return "Chrome Mobile";
  }

  if (agent.includes("chrome")) return "Chrome";

  if (agent.includes("firefox")) return "Firefox";

  if (agent.includes("safari") && agent.includes("mobile")) {
    return "Safari iOS";
  }

  if (agent.includes("safari")) return "Safari";

  return "Outros";
}
