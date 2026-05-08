import { TPasswordResetEmailJobData } from "../../../../application/jobs/email.jobs";
import { IEmailService } from "../../../../application/ports/email-service.port";
import { EmailTemplates } from "../email-templates";
import { IEmailHandler } from "./email-handler.interface";

export class PasswordResetEmailHandler implements IEmailHandler<"PASSWORD_RESET_EMAIL"> {
  type = "PASSWORD_RESET_EMAIL" as const;

  constructor(private readonly emailService: IEmailService) {}

  async handle(job: TPasswordResetEmailJobData) {
    const template = EmailTemplates.passwordReset(job.payload);
    await this.emailService.send(
      job.to,
      template.subject,
      template.html,
      template.text,
    );
  }
}
