import { CampaignsRepository } from "../repositories/campaigns-repository";
import { ClientsRepository } from "../repositories/clients-repository";
import { CampaignAlreadyExistsError } from "./errors/campaign-already-exists-error";
import { LinkNotFoundError } from "./errors/link-not-found-error";

interface CreateCampaignRequest {
  name: string;
  clientId: string;
}

export class CampaignsService {
  // O serviço de campanha precisa de ambos os repositórios
  constructor(
    private campaignsRepository: CampaignsRepository,
    private clientsRepository: ClientsRepository
  ) {}

  // Serviço para listar
  async listCampaigns(clientId?: string) {
    const campaigns = await this.campaignsRepository.findMany();
    return campaigns;
  }

  // Serviço para criar
  async createCampaign({ name, clientId }: CreateCampaignRequest) {
    // Regra de negócio 1: O cliente deve existir
    const client = await this.clientsRepository.findById(clientId);
    if (!client) {
      throw new LinkNotFoundError();
    }

    // Regra de negócio 2: A camapnha não pode ser duplicada para o cliente
    const existingCampaign =
      await this.campaignsRepository.findByNameAndClientId(name, clientId);

    if (existingCampaign) {
      throw new CampaignAlreadyExistsError();
    }

    const campaign = await this.campaignsRepository.create({ name, clientId });
    return campaign;
  }
}
