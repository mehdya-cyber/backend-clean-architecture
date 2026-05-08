import {
  TEmailJobData,
  TEmailJobType,
} from "../../../../application/jobs/email.jobs";

export interface IEmailHandler<T extends TEmailJobType> {
  type: T;

  handle(job: Extract<TEmailJobData, { type: T }>): Promise<void>;
}
