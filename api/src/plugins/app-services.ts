import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";
import { DashboardService } from "../domains/analytics/application/dashboard-service";
import { LinksService } from "../domains/links/application/links-service";
import { AuthService } from "../services/auth-service";
import { CampaignsListService } from "../services/campaings-list-service";
import { CampaignsService } from "../services/campaigns-service";
import { ClientsListService } from "../services/clients-list-service";
import { ClientsService } from "../services/clients-service";
import { FastifyPluginAsync } from "fastify";

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
  const { PrismaUsersRepository } = require("../repositories/prisma/prisma-users-repository");
  const { PrismaClientsRepository } = require("../repositories/prisma/prisma-clients-repository");
  const { PrismaCampaignsRepository } = require("../repositories/prisma/prisma-campaign-repository");
  const { PrismaLinksRepository } = require("../repositories/prisma/prisma-links-repository");
  const { PrismaClicksRepository } = require("../repositories/prisma/prisma-clicks-repository");
  const { ClientsListRepository } = require("../repositories/read-models/client-list-repository");
  const { CampaignsListRepository } = require("../repositories/read-models/campaigns-list-repository");

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

interface AppServicesPluginOptions {
  services?: AppServices;
}

const appServicesPluginCallback: FastifyPluginAsync<AppServicesPluginOptions> =
  async (app: FastifyInstance, options) => {
    app.decorate("services", options.services ?? buildAppServices());
  };

export const appServicesPlugin = fp(appServicesPluginCallback);
