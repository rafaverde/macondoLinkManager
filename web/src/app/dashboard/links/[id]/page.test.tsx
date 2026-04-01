import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import LinkDetailsPage from "./page";

vi.mock("next/navigation", () => ({
  useParams: () => ({ id: "link-1" }),
}));

vi.mock("next/link", () => ({
  default: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock("@/contexts/breadcrumb-context", () => ({
  useBreadcrumb: () => ({ setItems: vi.fn() }),
}));

vi.mock("@/features/links/hooks/use-link", () => ({
  useLink: () => ({
    data: {
      id: "link-1",
      name: "WhatsApp Geral",
      originalUrl: "https://example.com",
      shortCode: "abc123",
      userId: "user-1",
      clientId: "client-1",
      campaignId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      rawClicks: 192,
      validClicks: 0,
      client: { name: "Cliente" },
      campaign: null,
      tags: [],
    },
    isLoading: false,
    isError: false,
  }),
}));

vi.mock("@/features/links/hooks/use-link-metrics", () => ({
  useLinkMetrics: () => ({
    data: {
      summary: {
        totalClicks: 0,
        clicksToday: 0,
        last7DaysClicks: 0,
      },
      clicksByDate: [],
      topBrowsers: [],
      topCountries: [],
      topCities: [],
    },
    isLoading: false,
  }),
}));

vi.mock("@/components/link-card", () => ({
  default: () => React.createElement("div", null, "LinkCard"),
}));

vi.mock("@/components/link-card-skeleton", () => ({
  default: () => React.createElement("div", null, "Skeleton"),
}));

vi.mock("@/components/charts/clicks-area-chart", () => ({
  ClicksAreaChart: () => React.createElement("div", null, "ClicksAreaChart"),
}));

vi.mock("@/components/charts/top-5-pie-chart", () => ({
  Top5PieChart: () => React.createElement("div", null, "Top5PieChart"),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({ children }: { children: React.ReactNode }) => (
    React.createElement("button", { type: "button" }, children)
  ),
}));

vi.mock("@/components/card-numbers", () => ({
  default: ({
    title,
    value,
  }: {
    title: string;
    value: number | undefined;
  }) => (
    React.createElement(
      "div",
      null,
      React.createElement("span", null, title),
      React.createElement("span", null, value ?? "-"),
    )
  ),
}));

describe("LinkDetailsPage", () => {
  it("usa o summary filtrado das métricas para o total de cliques", () => {
    render(React.createElement(LinkDetailsPage));

    expect(screen.getByText("Total de cliques")).toBeInTheDocument();
    expect(screen.getAllByText("0").length).toBeGreaterThan(0);
    expect(screen.queryByText("192")).not.toBeInTheDocument();
  });
});
