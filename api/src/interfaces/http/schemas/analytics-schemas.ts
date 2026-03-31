import { z } from "zod";

export const topClientsSchema = z.array(
  z.object({
    name: z.string(),
    clicks: z.number(),
  }),
);

export const analyticsOverviewSchema = z.object({
  summary: z.object({
    totalClicks: z.number(),
    activeLinks: z.number(),
    last7DaysClicks: z.number(),
    period: z.string(),
  }),
  charts: z.object({
    clicksByDate: z.array(
      z.object({
        date: z.string(),
        count: z.number(),
      }),
    ),
    topBrowsers: z.array(
      z.object({
        browser: z.string(),
        count: z.number(),
      }),
    ),
    topCountries: z.array(
      z.object({
        country: z.string().nullable(),
        count: z.number(),
      }),
    ),
    topCities: z.array(
      z.object({
        city: z.string().nullable(),
        count: z.number(),
      }),
    ),
  }),
  meta: z.object({
    hasData: z.boolean(),
  }),
});
