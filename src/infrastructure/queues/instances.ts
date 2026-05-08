import { TItemBulkUploadJobData } from "../../application/commands/item/item.command";
import { TEmailJobData } from "../../application/jobs/email.jobs";
import { BullMQQueueService } from "./bull-mq/bullMQ-queue-service";

export const itemsBulkUploadQueue =
  new BullMQQueueService<TItemBulkUploadJobData>("items-bulk-upload");

export const emailQueue = new BullMQQueueService<TEmailJobData>(
  "email-processing",
);
