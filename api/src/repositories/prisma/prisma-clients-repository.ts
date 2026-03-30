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

  async findTopClients() {
    const topClients = await prisma.$queryRaw<Array<{ name: string; _count: number }>>`
      SELECT
        c.name,
        COUNT(*)::int AS _count
      FROM clicks cl
      INNER JOIN links l ON l.id = cl.link_id
      INNER JOIN clients c ON c.id = l.client_id
      WHERE cl."isBot" = false
      GROUP BY c.id, c.name
      ORDER BY _count DESC
      LIMIT 5
    `;

    return topClients;
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
