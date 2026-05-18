import nodemailer from 'nodemailer';
import { envConfig } from '@/config/env.config';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: envConfig.mailEmail,
    pass: envConfig.mailPass,
  },
});

const sendEmail = async (toEmail: string, emailSubject: string, bodyText: string) => {
  const info = await transporter.sendMail({
    from: envConfig.mailEmail, // sender address
    to: toEmail, // list of receivers
    subject: emailSubject, // Subject line
    text: bodyText, // plain text body
    html: bodyText, // html body
  });

  console.log('Message sent: %s', info.messageId);
};

export default sendEmail;
