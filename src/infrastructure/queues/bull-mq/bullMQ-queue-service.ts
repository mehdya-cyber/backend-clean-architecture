import { IQueueService } from "../../../application/ports/queue-service.port";
import { Queue } from "bullmq";
import { redisConnection } from "../../redis/redis-connection";
import { injectable } from "inversify";

@injectable()
export class BullMQQueueService implements IQueueService {
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

  async add<T>(name: string, data: { jobId: string; data: T }): Promise<void> {
    await this.queue.add(
      name,
      {
        ...data.data,
      },
      {
        jobId: data.jobId,
        priority: 1,
      },
    );
  }
}
