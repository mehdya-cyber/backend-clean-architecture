import { TWelcomeEmailJobData } from "../../../../application/jobs/email.jobs";
import { IEmailService } from "../../../../application/ports/email-service.port";
import { EmailTemplates } from "../email-templates";
import { IEmailHandler } from "./email-handler.interface";

export class WelcomeEmailHandler implements IEmailHandler<"WELCOME_EMAIL"> {
  type = "WELCOME_EMAIL" as const;

  constructor(private readonly emailService: IEmailService) {}

  async handle(job: TWelcomeEmailJobData) {
    const template = EmailTemplates.welcome(job.payload);
    await this.emailService.send(
      job.to,
      template.subject,
      template.html,
      template.text,
    );
  }
}
