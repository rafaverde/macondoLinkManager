// prisma/scripts/backfill-bot-clicks.ts
import { prisma } from "../../lib/prisma";
import { detectBot } from "../../utils/detect-bot";

const BATCH_SIZE = 500;

async function backfillBotClicks() {
  let processed = 0;

  while (true) {
    const clicks = await prisma.click.findMany({
      where: {
        botReason: null,
      },
      select: {
        id: true,
        userAgent: true,
      },
      take: BATCH_SIZE,
    });

    if (clicks.length === 0) {
      break;
    }

    for (const click of clicks) {
      const { isBot, reason } = detectBot(click.userAgent);

      await prisma.click.update({
        where: { id: click.id },
        data: {
          isBot,
          botReason: reason ?? "HUMAN_CONFIRMED",
        },
      });

      processed++;
    }

    console.log(`Processed ${processed} clicks...`);
  }

  console.log(`Backfill completed. Total processed: ${processed}`);
}

backfillBotClicks()
  .catch((error) => {
    console.error("Backfill failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
