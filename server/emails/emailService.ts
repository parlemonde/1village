import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendEmailNotifications(to: string, from: string, subject: string, text: string) {
  const mailOptions = {
    from,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('==================================================================');
    console.log('Email envoyé avec succès');
  } catch (error) {
    console.log('==================================================================');
    console.error("Erreur lors de l'envoi de l'email:", error);
  }
}
