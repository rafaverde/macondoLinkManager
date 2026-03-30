import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { PrismaCampaignsRepository } from "../repositories/prisma/prisma-campaign-repository";
import { PrismaClicksRepository } from "../repositories/prisma/prisma-clicks-repository";
import { PrismaClientsRepository } from "../repositories/prisma/prisma-clients-repository";
import { PrismaLinksRepository } from "../repositories/prisma/prisma-links-repository";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users-repository";
import { CampaignsListRepository } from "../repositories/read-models/campaigns-list-repository";
import { ClientsListRepository } from "../repositories/read-models/client-list-repository";
import { DashboardService } from "../domains/analytics/application/dashboard-service";
import { LinksService } from "../domains/links/application/links-service";
import { AuthService } from "../services/auth-service";
import { CampaignsListService } from "../services/campaings-list-service";
import { CampaignsService } from "../services/campaigns-service";
import { ClientsListService } from "../services/clients-list-service";
import { ClientsService } from "../services/clients-service";

export interface AppServices {
  authService: AuthService;
  clientsService: ClientsService;
  clientsListService: ClientsListService;
  campaignsService: CampaignsService;
  campaignsListService: CampaignsListService;
  linksService: LinksService;
  dashboardService: DashboardService;
}

function buildAppServices(): AppServices {
  const usersRepository = new PrismaUsersRepository();
  const clientsRepository = new PrismaClientsRepository();
  const campaignsRepository = new PrismaCampaignsRepository();
  const linksRepository = new PrismaLinksRepository();
  const clicksRepository = new PrismaClicksRepository();
  const clientsListRepository = new ClientsListRepository();
  const campaignsListRepository = new CampaignsListRepository();

  return {
    authService: new AuthService(usersRepository),
    clientsService: new ClientsService(clientsRepository),
    clientsListService: new ClientsListService(clientsListRepository),
    campaignsService: new CampaignsService(
      campaignsRepository,
      clientsRepository,
    ),
    campaignsListService: new CampaignsListService(campaignsListRepository),
    linksService: new LinksService(
      linksRepository,
      clientsRepository,
      campaignsRepository,
      clicksRepository,
    ),
    dashboardService: new DashboardService(
      clicksRepository,
      linksRepository,
      clientsRepository,
      campaignsRepository,
    ),
  };
}

export const appServicesPlugin = fp(async (app: FastifyInstance) => {
  app.decorate("services", buildAppServices());
});
