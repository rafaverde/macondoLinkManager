type BotDetectionResult = {
  isBot: boolean;
  reason?: string;
};

const KNOWN_BOT_SIGNATURES = [
  // =========================
  // Search engines
  // =========================
  { match: "googlebot", reason: "GOOGLEBOT" },
  { match: "bingbot", reason: "BINGBOT" },
  { match: "duckduckbot", reason: "DUCKDUCKGO_BOT" },
  { match: "yandexbot", reason: "YANDEXBOT" },
  { match: "baiduspider", reason: "BAIDU_BOT" },
  { match: "slurp", reason: "YAHOO_BOT" },

  // =========================
  // Social / link previews
  // =========================
  { match: "facebookexternalhit", reason: "FACEBOOK_PREVIEW" },
  { match: "facebot", reason: "FACEBOOK_BOT" },
  { match: "whatsapp", reason: "WHATSAPP_PREVIEW" },
  { match: "telegrambot", reason: "TELEGRAM_PREVIEW" },
  { match: "twitterbot", reason: "TWITTERBOT" },
  { match: "linkedinbot", reason: "LINKEDINBOT" },
  { match: "slackbot", reason: "SLACK_PREVIEW" },
  { match: "discordbot", reason: "DISCORD_PREVIEW" },
  { match: "skypeuripreview", reason: "SKYPE_PREVIEW" },

  // =========================
  // Apple / platform
  // =========================
  { match: "applebot", reason: "APPLEBOT" },

  // =========================
  // SEO / monitoring / scraping
  // =========================
  { match: "ahrefs", reason: "AHREFS" },
  { match: "semrush", reason: "SEMRUSH" },
  { match: "mj12bot", reason: "MAJESTIC" },
  { match: "dotbot", reason: "DOTBOT" },
  { match: "screaming frog", reason: "SCREAMING_FROG" },
  { match: "sitebulb", reason: "SITEBULB" },
  { match: "seobility", reason: "SEOBILITY" },

  // =========================
  // Headless / automation
  // =========================
  { match: "puppeteer", reason: "HEADLESS_CHROME" },
  { match: "playwright", reason: "HEADLESS_BROWSER" },
  { match: "phantomjs", reason: "PHANTOMJS" },
  { match: "headlesschrome", reason: "HEADLESS_CHROME" },
];

const GENERIC_HTTP_CLIENTS = [
  "curl",
  "wget",
  "httpclient",
  "postman",
  "insomnia",
  "python-requests",
  "axios",
  "go-http-client",
  "java/",
  "okhttp",
];

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
