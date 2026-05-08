import {
  IQueueService,
  TQueueJobOptions,
} from "../../../application/ports/queue-service.port";
import { JobsOptions, Queue } from "bullmq";
import { redisConnection } from "../../redis/redis-connection";
import { injectable } from "inversify";
import { randomUUID } from "node:crypto";

@injectable()
export class BullMQQueueService<
  T,
  TJobName extends string = string,
> implements IQueueService<T, TJobName> {
  private queue: Queue;

  constructor(queueName: string) {
    this.queue = new Queue(queueName, {
      connection: redisConnection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: {
          age: 24 * 60 * 60,
        },
        removeOnFail: {
          age: 7 * 24 * 60 * 60,
        },
      },
    });
  }

  async add(name: string, data: T, options?: TQueueJobOptions): Promise<void> {
    const bullOptions: JobsOptions = {
      jobId: options?.jobId ?? randomUUID(),
      priority: options?.priority ?? 1,
      delay: options?.delay,
    };

    await this.queue.add(name, data, bullOptions);
  }
}
