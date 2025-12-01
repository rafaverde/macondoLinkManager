import { prisma } from "../../lib/prisma";
import { ClicksRepository, CreateClickDTO } from "../clicks-repository";

export class PrismaClicksRepository implements ClicksRepository {
  async create({ linkId, ipAddress, userAgent }: CreateClickDTO) {
    const click = await prisma.click.create({
      data: {
        linkId,
        ipAddress,
        userAgent,
      },
    });

    return click;
  }
}
