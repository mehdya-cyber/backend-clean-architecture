export interface IQueueService {
  add<T>(
    name: string,
    data: { jobId: string; batchId: string; data: T },
  ): Promise<void>;
}
