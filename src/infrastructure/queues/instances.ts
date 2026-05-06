import { BullMQQueueService } from "./bull-mq/bullMQ-queue-service";

export const ItemsBulkUploadQueue = new BullMQQueueService("items-bulk-upload");
