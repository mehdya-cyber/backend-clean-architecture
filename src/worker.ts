import "reflect-metadata";
import { logger } from "./core/config/logger";
import { startItemsBulkUploadWorker } from "./infrastructure/workers/bulk-upload.worker";

startItemsBulkUploadWorker();

logger.info("Worker started");
