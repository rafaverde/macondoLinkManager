import { ClientsListRepository } from "../repositories/read-models/client-list-repository";
import { ClientsListFilters } from "../repositories/read-models/types/list-pagination";
import { ClientListItem } from "../repositories/read-models/types/client-list-item";
import { PaginatedResult } from "../types/pagination";

export class ClientsListService {
  constructor(private clientsListRepositry: ClientsListRepository) {}

  async execute(filters: ClientsListFilters): Promise<PaginatedResult<ClientListItem>> {
    return this.clientsListRepositry.list(filters);
  }
}
