import "reflect-metadata";
import { cleanupBulkUploadCronJob } from "./infrastructure/cron/cleanup-bulk-upload.cron";
import { logger } from "./infrastructure/logging/logger";

logger.info("Scheduler started");
cleanupBulkUploadCronJob();
