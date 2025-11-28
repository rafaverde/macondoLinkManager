import { Client } from "@prisma/client";
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
}
