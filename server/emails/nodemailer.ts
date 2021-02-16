import Mail from 'nodemailer/lib/mailer';
import nodemailer from 'nodemailer';

import { logger } from '../utils/logger';

/**
 * Returns the nodemailer object to send emails by smtp.
 */
export function getNodeMailer(): Promise<Mail | null> {
  const smtpUser: string | null = process.env.NODEMAILER_USER || null;
  const smtpPass: string | null = process.env.NODEMAILER_PASS || null;
  const smtpPort: number = parseInt(process.env.NODEMAILER_PORT || '', 10) || 587;

  return new Promise((resolve) => {
    if (smtpUser !== null && smtpPass !== null) {
      resolve(
        nodemailer.createTransport({
          host: process.env.NODEMAILER_HOST || 'smtp.ethereal.email',
          port: smtpPort,
          secure: smtpPort === 465, // true for 465, false for other ports
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        }),
      );
    } else {
      nodemailer.createTestAccount((err, account) => {
        if (err !== null) {
          logger.error('Error while creating ethereal fake smtp account.');
          logger.error(JSON.stringify(err));
          resolve(null);
          return;
        }
        // create reusable transporter object using the default SMTP transport
        logger.info(`SMTP user: ${account.user}`);
        logger.info(`SMTP pass: ${account.pass}`);

        resolve(
          nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: account.user, // generated ethereal user
              pass: account.pass, // generated ethereal password
            },
          }),
        );
      });
    }
  });
}
