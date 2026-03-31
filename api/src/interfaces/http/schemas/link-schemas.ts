import { z } from "zod";

export const linkSchema = z.object({
  id: z.uuid(),
  originalUrl: z.url(),
  shortCode: z.string(),
  name: z.string(),
  userId: z.uuid(),
  clientId: z.uuid(),
  campaignId: z.uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  rawClicks: z.number().int().nonnegative(),
  validClicks: z.number().int().nonnegative(),
  client: z.object({ name: z.string() }).optional(),
  campaign: z.object({ name: z.string() }).nullable().optional(),
  tags: z.array(z.object({ id: z.uuid(), name: z.string() })).optional(),
});

export const linkMetricsSchema = z.object({
  summary: z.object({
    totalClicks: z.number().int().nonnegative(),
    clicksToday: z.number().int().nonnegative(),
    last7DaysClicks: z.number().int().nonnegative(),
  }),
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
});
