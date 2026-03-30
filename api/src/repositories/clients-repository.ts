import { Client, Prisma } from "@prisma/client";

// DTO (Data Transfer Object) para criar um Cliente
export type CreateClientDTO = Prisma.ClientCreateInput;

// Interface para estatísticas de clique
export interface ClientsWithClicks {
  name: string;
  _count: number;
}

// Interface que define as obrigações de um repositório de cliente
export interface ClientsRepository {
  create(data: CreateClientDTO): Promise<Client>; // Cria um novo cliente
  findByName(name: string): Promise<Client | null>; // Busca cliente pelo nome
  findById(id: string): Promise<Client | null>; // Busca cliente pelo id
  findTopClients(): Promise<ClientsWithClicks[]>; // Pega os clientes com mais cliques da organização
  delete(id: string): Promise<void>; // Deleta cliente pelo id
  update(id: string, data: Prisma.ClientUpdateInput): Promise<Client>; // Atualiza dados do cliente
}
