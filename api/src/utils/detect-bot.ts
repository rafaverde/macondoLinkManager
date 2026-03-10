type BotDetectionResult = {
  isBot: boolean;
  reason?: string;
  score?: number;
  signals?: string[];
};

type BotDetectionContext = {
  burst?: {
    isBurst: boolean;
    count: number;
    threshold: number;
    windowMs: number;
  } | null;
  asnOrg?: string | null;
};

const STRONG_BOT_SIGNATURES = [
  // =========================
  // Search engines
  // =========================
  { pattern: /googlebot/i, reason: "GOOGLEBOT" },
  { pattern: /bingbot/i, reason: "BINGBOT" },
  { pattern: /duckduckbot/i, reason: "DUCKDUCKGO_BOT" },
  { pattern: /yandexbot/i, reason: "YANDEXBOT" },
  { pattern: /baiduspider/i, reason: "BAIDU_BOT" },
  { pattern: /\bslurp\b/i, reason: "YAHOO_BOT" },
  { pattern: /adsbot-google/i, reason: "ADSBOT_GOOGLE" },
  { pattern: /mediapartners-google/i, reason: "MEDIAPARTNERS_GOOGLE" },
  { pattern: /bytespider/i, reason: "BYTESPIDER" },
  { pattern: /petalbot/i, reason: "PETALBOT" },
  { pattern: /sogou/i, reason: "SOGOU_BOT" },
  { pattern: /exabot/i, reason: "EXABOT" },
  { pattern: /seznambot/i, reason: "SEZNAM_BOT" },

  // =========================
  // Social / link previews
  // =========================
  { pattern: /facebookexternalhit/i, reason: "FACEBOOK_PREVIEW" },
  { pattern: /facebot/i, reason: "FACEBOOK_BOT" },
  { pattern: /telegrambot/i, reason: "TELEGRAM_PREVIEW" },
  { pattern: /twitterbot/i, reason: "TWITTERBOT" },
  { pattern: /linkedinbot/i, reason: "LINKEDINBOT" },
  { pattern: /slackbot/i, reason: "SLACK_PREVIEW" },
  { pattern: /discordbot/i, reason: "DISCORD_PREVIEW" },
  { pattern: /skypeuripreview/i, reason: "SKYPE_PREVIEW" },

  // =========================
  // Apple / platform
  // =========================
  { pattern: /applebot/i, reason: "APPLEBOT" },

  // =========================
  // SEO / monitoring / scraping
  // =========================
  { pattern: /ahrefs/i, reason: "AHREFS" },
  { pattern: /semrush/i, reason: "SEMRUSH" },
  { pattern: /mj12bot/i, reason: "MAJESTIC" },
  { pattern: /dotbot/i, reason: "DOTBOT" },
  { pattern: /blexbot/i, reason: "BLEXBOT" },
  { pattern: /screaming frog/i, reason: "SCREAMING_FROG" },
  { pattern: /sitebulb/i, reason: "SITEBULB" },
  { pattern: /seobility/i, reason: "SEOBILITY" },
  { pattern: /censys/i, reason: "CENSYS" },
  { pattern: /zgrab/i, reason: "ZGRAB" },
  { pattern: /masscan/i, reason: "MASSCAN" },

  // =========================
  // Headless / automation
  // =========================
  { pattern: /puppeteer/i, reason: "HEADLESS_CHROME" },
  { pattern: /playwright/i, reason: "HEADLESS_BROWSER" },
  { pattern: /phantomjs/i, reason: "PHANTOMJS" },
  { pattern: /headlesschrome/i, reason: "HEADLESS_CHROME" },
];

const GENERIC_HTTP_CLIENT_PATTERNS = [
  /curl\//i,
  /wget\//i,
  /httpclient/i,
  /postman/i,
  /insomnia/i,
  /python-requests/i,
  /\baxios\b/i,
  /go-http-client/i,
  /java\//i,
  /okhttp/i,
  /libwww-perl/i,
  /scrapy/i,
  /aiohttp/i,
  /node-fetch/i,
  /undici/i,
  /got\//i,
];

const BOT_SCORE_THRESHOLD = 4;
const DATACENTER_ORG_PATTERNS = [
  /amazon/i,
  /\baws\b/i,
  /google/i,
  /microsoft/i,
  /azure/i,
  /digitalocean/i,
  /ovh/i,
  /hetzner/i,
  /linode/i,
  /oracle/i,
  /tencent/i,
  /alibaba/i,
  /vultr/i,
  /choopa/i,
  /leaseweb/i,
  /netcup/i,
  /contabo/i,
  /stackpath/i,
  /fastly/i,
  /akamai/i,
  /cloudflare/i,
];

export function isDatacenterOrganization(org?: string | null): boolean {
  if (!org) return false;
  return DATACENTER_ORG_PATTERNS.some((pattern) => pattern.test(org));
}

function normalizeHeaderValue(
  value: string | string[] | undefined,
): string | undefined {
  if (!value) return undefined;
  if (Array.isArray(value)) return value[0];
  return value;
}

function isBrowserLikeUa(ua: string) {
  return (
    ua.includes("mozilla/5.0") ||
    ua.includes("chrome/") ||
    ua.includes("firefox/") ||
    ua.includes("safari/") ||
    ua.includes("edg/")
  );
}

export function detectBot(
  userAgent?: string | null,
  headers?: Record<string, string | string[] | undefined>,
  context?: BotDetectionContext,
): BotDetectionResult {
  if (!userAgent || userAgent.trim() === "")
    return {
      isBot: true,
      reason: "EMPTY_USER_AGENT",
      score: 10,
      signals: ["EMPTY_USER_AGENT"],
    };

  const ua = userAgent.toLowerCase();

  for (const signature of STRONG_BOT_SIGNATURES) {
    if (signature.pattern.test(ua)) {
      return {
        isBot: true,
        reason: signature.reason,
        score: 10,
        signals: [signature.reason],
      };
    }
  }

  for (const client of GENERIC_HTTP_CLIENT_PATTERNS) {
    if (client.test(ua)) {
      return {
        isBot: true,
        reason: "GENERIC_HTTP_CLIENT",
        score: 8,
        signals: ["GENERIC_HTTP_CLIENT"],
      };
    }
  }

  const signals: string[] = [];
  let score = 0;
  const hasHeaderSnapshot = !!headers && Object.keys(headers).length > 0;

  if (ua.length < 12) {
    signals.push("SHORT_USER_AGENT");
    score += 1;
  }

  let acceptLanguage: string | undefined;
  let secChUa: string | undefined;
  let secFetchSite: string | undefined;
  let secFetchMode: string | undefined;
  let secFetchDest: string | undefined;
  let secFetchUser: string | undefined;

  if (hasHeaderSnapshot) {
    acceptLanguage = normalizeHeaderValue(headers?.["accept-language"]);
    secChUa = normalizeHeaderValue(headers?.["sec-ch-ua"]);
    secFetchSite = normalizeHeaderValue(headers?.["sec-fetch-site"]);
    secFetchMode = normalizeHeaderValue(headers?.["sec-fetch-mode"]);
    secFetchDest = normalizeHeaderValue(headers?.["sec-fetch-dest"]);
    secFetchUser = normalizeHeaderValue(headers?.["sec-fetch-user"]);

    if (!acceptLanguage) {
      signals.push("NO_ACCEPT_LANGUAGE");
      score += 1;
    }

    if (!secChUa && (ua.includes("chrome") || ua.includes("edg"))) {
      signals.push("NO_SEC_CH_UA");
      score += 1;
    }

    if (!secFetchSite) {
      signals.push("NO_SEC_FETCH_SITE");
      score += 1;
    }

    const purpose =
      normalizeHeaderValue(headers?.purpose) ??
      normalizeHeaderValue(headers?.["x-purpose"]) ??
      normalizeHeaderValue(headers?.["sec-purpose"]);
    if (purpose && /(prefetch|preview|prerender)/i.test(purpose)) {
      return {
        isBot: true,
        reason: "PREFETCH_PREVIEW_HEADER",
        score: 8,
        signals: ["PREFETCH_PREVIEW_HEADER"],
      };
    }

    const browserLikeUa = isBrowserLikeUa(ua);
    const hasAnySecFetch = !!(secFetchSite || secFetchMode || secFetchDest);

    if (browserLikeUa && !hasAnySecFetch) {
      signals.push("NO_SEC_FETCH_FAMILY");
      score += 2;
    }

    if (
      browserLikeUa &&
      !acceptLanguage &&
      !secFetchSite &&
      !secFetchMode &&
      !secFetchDest
    ) {
      signals.push("BROWSER_UA_HEADER_MISMATCH");
      score += 2;
    }

    if (
      browserLikeUa &&
      secFetchDest &&
      secFetchDest !== "document" &&
      !secFetchUser
    ) {
      signals.push("NON_DOCUMENT_FETCH");
      score += 1;
    }
  }

  const burst = context?.burst;
  if (burst?.isBurst) {
    signals.push("BURST_CLICK");
    score += 3;
  }

  const asnOrg = context?.asnOrg;
  if (isDatacenterOrganization(asnOrg)) {
    signals.push("DATACENTER_ASN");
    score += 2;

    if (
      isBrowserLikeUa(ua) &&
      hasHeaderSnapshot &&
      (!acceptLanguage || !secFetchSite)
    ) {
      signals.push("DATACENTER_BROWSER_MISMATCH");
      score += 2;
    }
  }

  if (ua.includes("whatsapp")) {
    const hasPreviewToken =
      ua.includes("preview") || ua.includes("urlpreview");
    if (hasPreviewToken) {
      return {
        isBot: true,
        reason: "WHATSAPP_PREVIEW",
        score: 6,
        signals: ["WHATSAPP_PREVIEW"],
      };
    }

    signals.push("WHATSAPP_AMBIGUOUS");
    score += 2;
  }

  const isBot = score >= BOT_SCORE_THRESHOLD;
  return {
    isBot,
    reason: signals.length > 0 ? signals.join("|") : undefined,
    score,
    signals,
  };
}
