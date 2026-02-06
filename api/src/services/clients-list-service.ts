import { ClientsListRepository } from "../repositories/read-models/client-list-repository";
import { ClientListItem } from "../repositories/read-models/types/client-list-item";

export class ClientsListService {
  constructor(private clientsListRepositry: ClientsListRepository) {}

  async execute(): Promise<ClientListItem[]> {
    return this.clientsListRepositry.list();
  }
}
