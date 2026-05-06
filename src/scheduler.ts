import "reflect-metadata";
import { cleanupBulkUploadCronJob } from "./infrastructure/cron/cleanup-bulk-upload.cron";
import { logger } from "./core/config/logger";

logger.info("Scheduler started");
cleanupBulkUploadCronJob();
