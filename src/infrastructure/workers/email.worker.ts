import { TEmailJobData } from "../../application/jobs/email.jobs";
import { IEmailService } from "../../application/ports/email-service.port";
import { container } from "../../core/container/container";
import { CONTAINER_TYPES } from "../../core/container/container.types";
import { logger } from "../logging/logger";
import { GenericWorker } from "./worker";
import { EmailHandlerRegistry } from "../services/email/email-handler.registry";
import { WelcomeEmailHandler } from "../services/email/handlers/welcome-email.handler";
import { PasswordResetEmailHandler } from "../services/email/handlers/password-reset-email.handler";

export const startEmailWorker = () => {
  const emailService = container.get<IEmailService>(
    CONTAINER_TYPES.EmailService,
  );

  const registery = new EmailHandlerRegistry();

  registery.register(new WelcomeEmailHandler(emailService));
  registery.register(new PasswordResetEmailHandler(emailService));

  const worker = new GenericWorker<TEmailJobData>(
    "email-processing",
    async (job) => {
      const data = job.data;

      logger.info(
        { jobId: job.id, type: data.type, to: data.to },
        "Processing email job",
      );

      await registery.handle(data);
    },
    {
      concurrency: 5,
    },
  );

  return worker;
};
