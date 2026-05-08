export type TQueueJobOptions = {
  jobId?: string;
  delay?: number;
  attempts?: number;
  priority?: number;
};

export interface IQueueService<T, TJobName extends string = string> {
  add(name: TJobName, jobData: T, options?: TQueueJobOptions): Promise<void>;
}
