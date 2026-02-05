type BotDetectionResult = {
  isBot: boolean;
  reason?: String;
};

const KNOWN_BOT_SIGNATURES = [
  { match: "googlebot", reason: "GOOGLEBOT" },
  { match: "bingbot", reason: "BINGBOT" },
  { match: "facebookexternalhit", reason: "FACEBOOK_PREVIEW" },
  { match: "whatsapp", reason: "WHATSAPP_PREVIEW" },
  { match: "slackbot", reason: "SLACK_PREVIEW" },
  { match: "twitterbot", reason: "TWITTERBOT" },
  { match: "linkedinbot", reason: "LINKEDINBOT" },
  { match: "discordbot", reason: "DISCORD_PREVIEW" },
  { match: "telegrambot", reason: "TELEGRAM_PREVIEW" },
  { match: "applebot", reason: "APPLEBOT" },
  { match: "ahrefs", reason: "AHREFS" },
  { match: "semrush", reason: "SEMRUSH" },
];

const GENERIC_HTTP_CLIENTS = ["curl", "wget", "httpclient", "postman"];

export function detectBot(userAgent?: string | null): BotDetectionResult {
  if (!userAgent || userAgent.trim() === "")
    return { isBot: true, reason: "EMPTY_USER_AGENT" };

  const ua = userAgent.toLowerCase();

  for (const signature of KNOWN_BOT_SIGNATURES) {
    if (ua.includes(signature.match))
      return { isBot: true, reason: signature.reason };
  }

  for (const client of GENERIC_HTTP_CLIENTS) {
    if (ua.includes(client))
      return { isBot: true, reason: "GENERIC_HTTP_CLIENT" };
  }

  return { isBot: false };
}
