import "reflect-metadata";
import { startItemsBulkUploadWorker } from "./infrastructure/workers/bulk-upload.worker";
import { logger } from "./infrastructure/logging/logger";
import { startEmailWorker } from "./infrastructure/workers/email.worker";

startItemsBulkUploadWorker();
startEmailWorker();

logger.info("Worker started");
