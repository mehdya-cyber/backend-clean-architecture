import { Worker } from "bullmq";
import { redisConnection } from "../redis/redis-connection";
import { logger } from "../logging/logger";

export class GenericWorker<T> {
  private worker: Worker;

  constructor(
    queueName: string,
    processor: (job: { data: T }) => Promise<void>,
  ) {
    this.worker = new Worker(
      queueName,
      async (job) => {
        logger.info({ jobId: job.id }, "Processing job");
        await processor(job);
      },
      {
        connection: redisConnection,
        concurrency: 3,
      },
    );
    this.worker.on("completed", (job) => {
      logger.info(
        {
          jobId: job.id,
          bulkUploadId: job.data.bulkUploadId,
        },
        "Item bulk upload job completed",
      );
    });

    this.worker.on("failed", (job, err) => {
      logger.error(
        {
          jobId: job?.id,
          bulkUploadId: job?.data?.bulkUploadId,
          err,
        },
        "Item bulk upload job failed",
      );
    });
  }
  async close() {
    await this.worker.close();
  }
}
