import { afterEach, describe, expect, it, vi } from "vitest";
import type { AppServices } from "../src/plugins/app-services";

function createServicesMock(): AppServices {
  return {
    authService: {
      authenticateWithGoogle: vi.fn(),
    } as unknown as AppServices["authService"],
    clientsService: {
      createClient: vi.fn(),
      getClientById: vi.fn(),
      deleteClient: vi.fn(),
      updateClient: vi.fn(),
    } as unknown as AppServices["clientsService"],
    clientsListService: {
      execute: vi.fn(),
    } as unknown as AppServices["clientsListService"],
    campaignsService: {
      createCampaign: vi.fn(),
      getCampaignById: vi.fn(),
      deleteCampaign: vi.fn(),
      updateCampaign: vi.fn(),
    } as unknown as AppServices["campaignsService"],
    campaignsListService: {
      execute: vi.fn(),
    } as unknown as AppServices["campaignsListService"],
    linksService: {
      createLink: vi.fn(),
      listLinks: vi.fn(),
      getLink: vi.fn(),
      updateLink: vi.fn(),
      deleteLink: vi.fn(),
      getLinkMetrics: vi.fn(),
      getLinkByShortCode: vi.fn(),
      trackClick: vi.fn(),
    } as unknown as AppServices["linksService"],
    dashboardService: {
      getTopClients: vi.fn(),
      getOverview: vi.fn(),
      getClientOverview: vi.fn(),
      getCampaignOverview: vi.fn(),
    } as unknown as AppServices["dashboardService"],
  };
}

async function createAuthenticatedApp(services = createServicesMock()) {
  const { buildApp } = await import("../src/app");
  const app = await buildApp({
    services,
    healthcheck: async () => true,
    logger: false,
  });

  await app.ready();

  const token = app.jwt.sign({
    sub: "d1a8f0ef-d7c3-42c1-a9ef-b3f4dcb2d394",
    name: "Test User",
    email: "test@macondo.com",
    avatarUrl: null,
  });

  return { app, services, cookie: `macondo.token=${token}` };
}

afterEach(() => {
  vi.clearAllMocks();
});

describe("API smoke tests", () => {
  it("bloqueia rota protegida sem cookie", async () => {
    const { buildApp } = await import("../src/app");
    const app = await buildApp({
      services: createServicesMock(),
      healthcheck: async () => true,
      logger: false,
    });

    await app.ready();

    const response = await app.inject({
      method: "GET",
      url: "/dashboard/overview",
    });

    expect(response.statusCode).toBe(401);

    await app.close();
  });

  it("retorna overview autenticado", async () => {
    const { app, services, cookie } = await createAuthenticatedApp();

    vi.mocked(services.dashboardService.getOverview).mockResolvedValue({
      summary: {
        totalClicks: 12,
        activeLinks: 3,
        last7DaysClicks: 4,
        period: "30d",
      },
      charts: {
        clicksByDate: [],
        topBrowsers: [],
        topCountries: [],
        topCities: [],
      },
      meta: {
        hasData: true,
      },
    });

    const response = await app.inject({
      method: "GET",
      url: "/dashboard/overview",
      headers: {
        cookie,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      summary: {
        totalClicks: 12,
        last7DaysClicks: 4,
      },
    });

    await app.close();
  });

  it("expõe métricas do link com summary filtrado", async () => {
    const { app, services, cookie } = await createAuthenticatedApp();

    vi.mocked(services.linksService.getLinkMetrics).mockResolvedValue({
      summary: {
        totalClicks: 0,
        clicksToday: 0,
        last7DaysClicks: 0,
      },
      clicksByDate: [],
      topBrowsers: [],
      topCountries: [],
      topCities: [],
    });

    const response = await app.inject({
      method: "GET",
      url: "/links/5bbf8e7d-5dad-4eb0-8858-5ab0fb9e2f2a/metrics",
      headers: {
        cookie,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      summary: {
        totalClicks: 0,
        clicksToday: 0,
        last7DaysClicks: 0,
      },
    });

    await app.close();
  });

  it("executa CRUD principal de links com auth", async () => {
    const { app, services, cookie } = await createAuthenticatedApp();

    vi.mocked(services.linksService.createLink).mockResolvedValue({
      id: "5bbf8e7d-5dad-4eb0-8858-5ab0fb9e2f2a",
      name: "Link Teste",
      originalUrl: "https://example.com",
      shortCode: "abc123",
      userId: "d1a8f0ef-d7c3-42c1-a9ef-b3f4dcb2d394",
      clientId: "e885d117-fb84-49c6-ac1d-f4dcc03804a3",
      campaignId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      client: { id: "e885d117-fb84-49c6-ac1d-f4dcc03804a3", name: "Cliente" },
      campaign: null,
      rawClicks: 5,
      validClicks: 0,
      tags: [],
    });
    vi.mocked(services.linksService.updateLink).mockResolvedValue({
      id: "5bbf8e7d-5dad-4eb0-8858-5ab0fb9e2f2a",
      name: "Link Atualizado",
      originalUrl: "https://example.com/updated",
      shortCode: "abc123",
      userId: "d1a8f0ef-d7c3-42c1-a9ef-b3f4dcb2d394",
      clientId: "e885d117-fb84-49c6-ac1d-f4dcc03804a3",
      campaignId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      client: { id: "e885d117-fb84-49c6-ac1d-f4dcc03804a3", name: "Cliente" },
      campaign: null,
      rawClicks: 10,
      validClicks: 2,
      tags: [],
    });
    vi.mocked(services.linksService.deleteLink).mockResolvedValue(undefined);

    const createResponse = await app.inject({
      method: "POST",
      url: "/links",
      headers: {
        cookie,
      },
      payload: {
        name: "Link Teste",
        originalUrl: "https://example.com",
        clientId: "e885d117-fb84-49c6-ac1d-f4dcc03804a3",
        campaignId: null,
        tags: [],
      },
    });

    const updateResponse = await app.inject({
      method: "PUT",
      url: "/links/5bbf8e7d-5dad-4eb0-8858-5ab0fb9e2f2a",
      headers: {
        cookie,
      },
      payload: {
        name: "Link Atualizado",
        originalUrl: "https://example.com/updated",
        clientId: "e885d117-fb84-49c6-ac1d-f4dcc03804a3",
        campaignId: null,
        tags: [],
      },
    });

    const deleteResponse = await app.inject({
      method: "DELETE",
      url: "/links/5bbf8e7d-5dad-4eb0-8858-5ab0fb9e2f2a",
      headers: {
        cookie,
      },
    });

    expect(createResponse.statusCode).toBe(201);
    expect(updateResponse.statusCode).toBe(200);
    expect(deleteResponse.statusCode).toBe(204);

    await app.close();
  });
});
