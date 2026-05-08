import {
  TEmailJobData,
  TEmailJobType,
} from "../../../application/jobs/email.jobs";
import { IEmailHandler } from "./handlers/email-handler.interface";

type EmailHandlerMap = {
  [K in TEmailJobType]: IEmailHandler<K>;
};

export class EmailHandlerRegistry {
  private handlers: Partial<EmailHandlerMap> = {};

  register = <TType extends TEmailJobType>(
    handler: IEmailHandler<TType>,
  ): void => {
    this.handlers[handler.type] = handler as EmailHandlerMap[TType];
  };

  get = <TType extends TEmailJobType>(type: TType): IEmailHandler<TType> => {
    const handler = this.handlers[type];

    if (!handler) {
      throw new Error(`No handler found for email type: ${type}`);
    }
    return handler as IEmailHandler<TType>;
  };

  handle = async (job: TEmailJobData): Promise<void> => {
    const handler = this.get(job.type);

    await handler.handle(
      job as Extract<TEmailJobData, { type: typeof job.type }>,
    );
  };
}
