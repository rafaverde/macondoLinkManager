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
  findMany(): Promise<Client[]>; // Busca todos os clientes
  findByName(name: string): Promise<Client | null>; // Busca cliente pelo nome
  findById(id: string): Promise<Client | null>; // Busca cliente pelo id
  findTopClients(userId?: string): Promise<ClientsWithClicks[]>; // Pega os clientes com mais cliques
}
