import { Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import { ClientsRepository, CreateClientDTO } from "../clients-repository";

export class PrismaClientsRepository implements ClientsRepository {
  async create(data: CreateClientDTO) {
    const client = await prisma.client.create({ data });
    return client;
  }

  async findMany() {
    const clients = await prisma.client.findMany();
    return clients;
  }

  async findByName(name: string) {
    const client = await prisma.client.findUnique({
      where: { name },
    });

    return client;
  }

  async findById(id: string) {
    const client = await prisma.client.findUnique({
      where: { id },
    });

    return client;
  }

  async findTopClients(userId: string) {
    const clients = await prisma.client.findMany({
      where: {
        links: {
          some: { userId }, // Filtra clientes que têm links desse user
        },
      },
      include: {
        links: {
          where: { userId },
          select: {
            _count: {
              select: { clicks: true }, // Traz a contagem de cliques de cada links
            },
          },
        },
      },
    });

    // Processamento em memória: Soma os cliques de todos os lnks do cliente
    const clientsWithTotal = clients.map((client) => {
      const totalClicks = client.links.reduce(
        (acc, link) => acc + link._count.clicks,
        0,
      );
      return {
        name: client.name,
        _count: totalClicks,
      };
    });

    // Ordena decrescente e pga o Top 5
    return clientsWithTotal.sort((a, b) => b._count - a._count).slice(0, 5);
  }

  // Deleta clientes
  async delete(id: string): Promise<void> {
    await prisma.client.delete({
      where: { id },
    });
  }

  // Atualiza clientes
  async update(id: string, data: Prisma.ClientUpdateInput) {
    const client = await prisma.client.update({
      where: {
        id,
      },
      data,
    });

    return client;
  }
}
