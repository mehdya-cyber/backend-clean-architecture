import { Job, Worker } from "bullmq";
import { redisConnection } from "../redis/redis-connection";
import { logger } from "../logging/logger";

export class GenericWorker<T> {
  private worker: Worker;

  constructor(
    queueName: string,
    processor: (job: Job<T>) => Promise<void>,
    options?: {
      concurrency?: number;
    },
  ) {
    this.worker = new Worker<T>(
      queueName,
      async (job) => {
        logger.info({ jobId: job.id }, "Processing job");
        await processor(job);
      },
      {
        connection: redisConnection,
        concurrency: options?.concurrency,
      },
    );
    this.worker.on("completed", (job) => {
      logger.info(
        {
          jobId: job.id,
        },
        `Worker job completed for ${queueName}`,
      );
    });

    this.worker.on("failed", (job, err) => {
      logger.error(
        {
          jobId: job?.id,
          err,
        },
        `Worker job failed for ${queueName}`,
      );
    });
  }
  async close() {
    await this.worker.close();
  }
}
