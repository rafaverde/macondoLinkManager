import { ClientsRepository } from "../repositories/clients-repository";
import { ClientAlreadyExistsError } from "./errors/client-already-exists-error";
import { ClientNotFoundError } from "./errors/client-not-found-error";

export class ClientsService {
  constructor(private clientsRepository: ClientsRepository) {}

  // Serviço para listar
  async listClients() {
    const clients = await this.clientsRepository.findMany();
    return clients;
  }

  // Serviço para criar
  async createClient(name: string) {
    // Regra de negócio
    const clientWithSameName = await this.clientsRepository.findByName(name);
    if (clientWithSameName) {
      throw new ClientAlreadyExistsError();
    }

    const client = await this.clientsRepository.create({ name });
    return client;
  }

  // Serviço para listar um cliente
  async getClientById(userId: string, clientId: string) {
    const client = this.clientsRepository.findById(clientId);

    if (!client) {
      throw new ClientNotFoundError();
    }

    return client;
  }
}
