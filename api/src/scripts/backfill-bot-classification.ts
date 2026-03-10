import { subDays } from "date-fns";
import { prisma } from "../lib/prisma";
import { detectBot, isDatacenterOrganization } from "../utils/detect-bot";
import { resolveAsnInfo } from "../utils/asn";

type CliArgs = {
  days: number;
  batchSize: number;
  dryRun: boolean;
  aggressiveDatacenter: boolean;
};

function parseArgs(argv: string[]): CliArgs {
  const defaults: CliArgs = {
    days: 90,
    batchSize: 500,
    dryRun: false,
    aggressiveDatacenter: false,
  };

  const parsed = { ...defaults };

  for (const arg of argv) {
    if (arg === "--dry-run") {
      parsed.dryRun = true;
      continue;
    }

    if (arg === "--aggressive-datacenter") {
      parsed.aggressiveDatacenter = true;
      continue;
    }

    if (arg.startsWith("--days=")) {
      const value = Number(arg.split("=")[1]);
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error("Valor inválido para --days. Use inteiro positivo.");
      }
      parsed.days = Math.floor(value);
      continue;
    }

    if (arg.startsWith("--batch-size=")) {
      const value = Number(arg.split("=")[1]);
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error(
          "Valor inválido para --batch-size. Use inteiro positivo.",
        );
      }
      parsed.batchSize = Math.floor(value);
      continue;
    }
  }

  return parsed;
}

type ClickBatchItem = {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  isBot: boolean;
  botReason: string | null;
};

async function run() {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL não definida. Configure as variáveis de ambiente antes do backfill.",
    );
  }

  const args = parseArgs(process.argv.slice(2));
  const startDate = subDays(new Date(), args.days);

  const where = {
    timestamp: {
      gte: startDate,
    },
  };

  const total = await prisma.click.count({ where });

  console.log(
    `[backfill-bot] Iniciando backfill (${args.dryRun ? "dry-run" : "apply"})`,
  );
  console.log(`[backfill-bot] Janela: últimos ${args.days} dia(s)`);
  console.log(`[backfill-bot] Batch: ${args.batchSize}`);
  console.log(
    `[backfill-bot] Estratégia agressiva de datacenter: ${args.aggressiveDatacenter ? "ON" : "OFF"}`,
  );
  console.log(`[backfill-bot] Cliques elegíveis: ${total}`);

  let cursorId: string | undefined;
  let processed = 0;
  let changed = 0;
  let becameBot = 0;
  let becameHuman = 0;

  const asnOrgCache = new Map<string, string | null>();

  while (true) {
    const batch: ClickBatchItem[] = await prisma.click.findMany({
      where,
      ...(cursorId ? { cursor: { id: cursorId }, skip: 1 } : {}),
      orderBy: { id: "asc" },
      take: args.batchSize,
      select: {
        id: true,
        ipAddress: true,
        userAgent: true,
        isBot: true,
        botReason: true,
      },
    });

    if (batch.length === 0) {
      break;
    }

    const updates: Array<{ id: string; isBot: boolean; botReason: string | null }> =
      [];

    for (const click of batch) {
      const ip = click.ipAddress?.trim();
      let asnOrg: string | null = null;

      if (ip) {
        if (asnOrgCache.has(ip)) {
          asnOrg = asnOrgCache.get(ip) ?? null;
        } else {
          const asnInfo = await resolveAsnInfo(ip);
          asnOrg = asnInfo.organization ?? null;
          asnOrgCache.set(ip, asnOrg);
        }
      }

      const detected = detectBot(click.userAgent, undefined, {
        asnOrg,
      });

      let nextIsBot = detected.isBot;
      let nextReason = detected.reason ?? null;

      if (
        !nextIsBot &&
        args.aggressiveDatacenter &&
        isDatacenterOrganization(asnOrg)
      ) {
        nextIsBot = true;
        nextReason = "DATACENTER_ASN_BACKFILL_AGGRESSIVE";
      }

      const currentReason = click.botReason ?? null;
      if (click.isBot !== nextIsBot || currentReason !== nextReason) {
        changed += 1;
        if (!click.isBot && nextIsBot) becameBot += 1;
        if (click.isBot && !nextIsBot) becameHuman += 1;

        updates.push({
          id: click.id,
          isBot: nextIsBot,
          botReason: nextReason,
        });
      }
    }

    if (!args.dryRun && updates.length > 0) {
      for (let i = 0; i < updates.length; i += 100) {
        const chunk = updates.slice(i, i + 100);
        await prisma.$transaction(
          chunk.map((update) =>
            prisma.click.update({
              where: { id: update.id },
              data: {
                isBot: update.isBot,
                botReason: update.botReason,
              },
            }),
          ),
        );
      }
    }

    processed += batch.length;
    cursorId = batch[batch.length - 1].id;

    console.log(
      `[backfill-bot] Processados: ${processed}/${total} | Alterados: ${changed}`,
    );
  }

  console.log("[backfill-bot] Finalizado");
  console.log(`[backfill-bot] Processados: ${processed}`);
  console.log(`[backfill-bot] Alterados: ${changed}`);
  console.log(`[backfill-bot] Viraram bot: ${becameBot}`);
  console.log(`[backfill-bot] Viraram humano: ${becameHuman}`);
}

run()
  .catch((error) => {
    console.error("[backfill-bot] Erro:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
