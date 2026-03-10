import { FastifyRequest } from "fastify";
import { isIP } from "node:net";
import { isPrivateIp } from "./geoip";

function normalizeIp(raw: string): string | undefined {
  const value = raw.trim().replace(/^for=/i, "").replace(/^"|"$/g, "");
  if (!value) return undefined;

  const withoutBrackets =
    value.startsWith("[") && value.endsWith("]")
      ? value.slice(1, -1)
      : value;

  const ipv4PortMatch = withoutBrackets.match(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/);
  if (ipv4PortMatch) return ipv4PortMatch[1];

  if (withoutBrackets.toLowerCase().startsWith("::ffff:")) {
    return withoutBrackets.slice(7);
  }

  return withoutBrackets;
}

function extractFirstPublicIp(value: string | undefined): string | undefined {
  if (!value) return undefined;

  const candidates = value.split(",").map((part) => normalizeIp(part));
  for (const candidate of candidates) {
    if (candidate && isIP(candidate) !== 0 && !isPrivateIp(candidate)) {
      return candidate;
    }
  }

  return undefined;
}

export function getPublicClientIp(request: FastifyRequest): string | undefined {
  const cfConnectingIp =
    typeof request.headers["cf-connecting-ip"] === "string"
      ? normalizeIp(request.headers["cf-connecting-ip"])
      : undefined;
  if (cfConnectingIp && isIP(cfConnectingIp) !== 0 && !isPrivateIp(cfConnectingIp)) {
    return cfConnectingIp;
  }

  const trueClientIp =
    typeof request.headers["true-client-ip"] === "string"
      ? normalizeIp(request.headers["true-client-ip"])
      : undefined;
  if (trueClientIp && isIP(trueClientIp) !== 0 && !isPrivateIp(trueClientIp)) {
    return trueClientIp;
  }

  const xClientIp =
    typeof request.headers["x-client-ip"] === "string"
      ? normalizeIp(request.headers["x-client-ip"])
      : undefined;
  if (xClientIp && isIP(xClientIp) !== 0 && !isPrivateIp(xClientIp)) {
    return xClientIp;
  }

  const xForwardedFor = request.headers["x-forwarded-for"];
  if (typeof xForwardedFor === "string") {
    const ip = extractFirstPublicIp(xForwardedFor);
    if (ip) {
      return ip;
    }
  }

  const xVercelForwardedFor = request.headers["x-vercel-forwarded-for"];
  if (typeof xVercelForwardedFor === "string") {
    const ip = extractFirstPublicIp(xVercelForwardedFor);
    if (ip) {
      return ip;
    }
  }

  const xRealIp = request.headers["x-real-ip"];
  if (typeof xRealIp === "string") {
    const ip = normalizeIp(xRealIp);
    if (ip && isIP(ip) !== 0 && !isPrivateIp(ip)) {
      return ip;
    }
  }

  if (Array.isArray(request.ips) && request.ips.length > 0) {
    for (const rawIp of request.ips) {
      const ip = normalizeIp(rawIp);
      if (ip && isIP(ip) !== 0 && !isPrivateIp(ip)) {
        return ip;
      }
    }
  }

  const requestIp = normalizeIp(request.ip);
  if (requestIp && isIP(requestIp) !== 0 && !isPrivateIp(requestIp)) {
    return requestIp;
  }

  return undefined;
}
