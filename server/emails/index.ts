import nodemailer from 'nodemailer';
import type Mail from 'nodemailer/lib/mailer';
import path from 'path';

import { logger } from '../utils/logger';
import { getNodeMailer } from './nodemailer';
import { renderFile } from './renderFile';

const frontUrl = process.env.HOST_URL || 'http://localhost:5000';
const domain = process.env.HOST_DOMAIN || '1v.parlemonde.org';

let transporter: Mail | null = null;
getNodeMailer()
  .then((t) => {
    transporter = t;
  })
  .catch();

export enum Email {
  INVALID_VILLAGE,
  COMMENT_NOTIFICATION,
  // Ces notitications seront implémentées dans une prochaine itération
  // REACTION_NOTIFICATION,
  // PUBLICATION_FROM_SCHOOL,
  // PUBLICATION_FROM_ADMIN,
  // CREATION_ACCOUNT_FAMILY,
  // OPENING_VILLAGE_STEP,
  INVALID_COUNTRY,
  CONFIRMATION_EMAIL,
  RESET_PASSWORD_EMAIL,
}
interface EmailMapping {
  [Email.INVALID_VILLAGE]: { userName: string; userEmail: string };
  [Email.INVALID_COUNTRY]: { userName: string; userEmail: string };
  [Email.CONFIRMATION_EMAIL]: { url: string; firstname: string; email: string; verificationHash: string };
  [Email.RESET_PASSWORD_EMAIL]: { url: string; email: string; verificationHash: string };
  [Email.COMMENT_NOTIFICATION]: { userWhoComment: string; activityType: string; url: string };
}
type EmailOptions<E extends Email> = EmailMapping[E];

type emailData = {
  // filename?: string; // todo add when using html
  filenameHtml?: string | undefined;
  filenameText: string;
  subject: string;
  args: { [key: string]: string };
};

function getTemplateData<E extends Email>(email: E, receiverEmail: string, options: EmailOptions<E>): emailData | undefined {
  if (email === Email.INVALID_VILLAGE) {
    return {
      filenameText: 'invalid_village.txt',
      subject: "Une classe 1Village n'est pas dans son village !",
      args: {
        ...options,
      },
    };
  }
  if (email === Email.INVALID_COUNTRY) {
    return {
      filenameText: 'invalid_country.txt',
      subject: "Une classe 1Village n'est pas dans son pays !",
      args: {
        ...options,
      },
    };
  }

  if (email === Email.CONFIRMATION_EMAIL) {
    return {
      filenameText: 'confirmation_email.html',
      subject: 'Email de confirmation de votre compte 1Village',
      args: {
        ...options,
      },
    };
  }

  if (email === Email.RESET_PASSWORD_EMAIL) {
    return {
      filenameText: 'reset-password-email.html',
      subject: 'Mot de passe oublié - 1Village',
      args: {
        ...options,
      },
    };
  }
  if (email === Email.COMMENT_NOTIFICATION) {
    return {
      filenameHtml: 'comment_notification.html',
      filenameText: 'comment_notification.txt',
      subject: 'Du nouveau sur 1Village ! 🦜',
      args: {
        ...options,
      },
    };
  }
  return undefined;
}

export async function sendMail<E extends Email>(email: E, receiverEmail: string, options: EmailOptions<E>): Promise<void> {
  if (transporter === null) {
    logger.error('Could not send mail, transporter is null!');
    return;
  }
  if (!receiverEmail) {
    logger.error('Could not send mail, receiver is null or undefined!');
    return;
  }

  // Get email template data
  const templateData = getTemplateData<E>(email, receiverEmail, options);
  if (templateData === undefined) {
    logger.info(`Template ${email} not found!`);
    return undefined;
  }

  // Compile text and html
  const renderOptions = {
    ...templateData.args,
    frontUrl,
    receiverEmail,
    plmoEmail: `contact@${domain}`,
  };

  try {
    if (!templateData.filenameHtml || !templateData.filenameText || !templateData.subject) {
      throw new Error('Template data is missing required fields.');
    }

    const html = await renderFile(path.join(__dirname, 'templates', templateData.filenameHtml), renderOptions);
    const text = await renderFile(path.join(__dirname, 'templates', templateData.filenameText), renderOptions);
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"1Village - Par Le Monde" <ne-pas-repondre@${domain}>`, // sender address
      to: receiverEmail, // receiver address
      subject: templateData.subject, // Subject line
      text, // plain text body
      html, // html body
    });

    logger.info(`Message sent: ${info.messageId}`);
    if (nodemailer.getTestMessageUrl(info)) {
      logger.info(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`); // Preview only available when sending through an Ethereal account
    }
  } catch (e) {
    logger.error(e);
  }
}
