import "reflect-metadata";
import { startItemsBulkUploadWorker } from "./infrastructure/workers/bulk-upload.worker";
import { logger } from "./infrastructure/logging/logger";

startItemsBulkUploadWorker();

logger.info("Worker started");
