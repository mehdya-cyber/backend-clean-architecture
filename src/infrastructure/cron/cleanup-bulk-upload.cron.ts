import cron from "node-cron";
import { logger } from "../logging/logger";
import { prisma } from "../db/prisma/prisma";

export const cleanupBulkUploadCronJob = () => {
  cron.schedule("0 2 * * *", async () => {
    logger.info("Bulk upload cleanup cron started");

    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - 7);

      const result = await prisma.bulkUpload.deleteMany({
        where: {
          createdAt: {
            lt: cutoff,
          },
          status: {
            in: ["COMPLETED", "FAILED"],
          },
        },
      });

      logger.info(
        {
          deletedCount: result.count,
        },
        "Bulk upload cleanup cron completed",
      );
    } catch (err) {
      logger.error(
        {
          err,
        },
        "Bulk upload cleanup cron failed",
      );
    }
  });
};
