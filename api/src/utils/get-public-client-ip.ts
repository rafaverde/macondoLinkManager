import { FastifyRequest } from "fastify";
import { isPrivateIp } from "./geoip";

export function getPublicClientIp(request: FastifyRequest): string | undefined {
  const xForwardedFor = request.headers["x-forwarded-for"];

  if (typeof xForwardedFor === "string") {
    const ips = xForwardedFor.split(",").map((ip) => ip.trim());
    for (const ip of ips) {
      if (!isPrivateIp(ip)) {
        return ip;
      }
    }
  }

  const xRealIp = request.headers["x-real-ip"];
  if (typeof xRealIp === "string" && !isPrivateIp(xRealIp)) {
    return xRealIp;
  }

  if (request.ip && !isPrivateIp(request.ip)) {
    return request.ip;
  }

  return undefined;
}
