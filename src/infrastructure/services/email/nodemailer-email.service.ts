import { injectable } from "inversify";
import { IEmailService } from "../../../application/ports/email-service.port";
import nodemailer from "nodemailer";
import { env } from "../../../core/config/env";
import { logger } from "../../logging/logger";

const hasAuth = env.SMTP_USER && env.SMTP_PASSWORD;

@injectable()
export class NodemailerEmailService implements IEmailService {
  private transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    secure: Number(env.SMTP_PORT) === 465,
    auth: hasAuth
      ? {
          user: env.SMTP_USER,
          pass: env.SMTP_PASSWORD,
        }
      : undefined,
  });

  send = async (
    to: string,
    subject: string,
    html: string,
    text?: string,
  ): Promise<void> => {
    await this.transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
    });

    logger.info({ to, subject }, "Email Sent");
  };
}
