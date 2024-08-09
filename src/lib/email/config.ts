import nodemailer from 'nodemailer'
import prisma from '../prismaConfig';

const transporter = nodemailer.createTransport({
  host: "smtp.hostinger.com",
  port: 465,
  secure: true, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: "marcelo@openhouses.ie",
    pass: "Ro100252@",

  },
  tls: {
    // Set to true if the server supports STARTTLS
    rejectUnauthorized: false // Add this line if the server uses a self-signed certificate
  }
});

// async..await is not allowed in global scope, must use a wrapper
export default async function sendEmail(fromName: string, from: string, to: string, subject: string, text: string, html: string) {
  // send mail with defined transport object
  const _from = `'"${fromName} " <${from}>'`
  const _subject = `${subject}`
  const _text = `${text}`
  const _html = `${html}`


  try {
    const info = await transporter.sendMail({
      from: _from, // sender address
      to: to, // list of receivers
      subject: _subject, // Subject line
      text: _text, // plain text body
      html: _html, // html body
    });

    // Criando objeto de log
    const dataLog: any = {
      userEmailTo: to, // Este é o campo correto a ser utilizado para referenciar o email do usuário
      email: to,       // Preencha o campo email com o endereço de email
      subject: subject,
      accepted: info.accepted ? info.accepted.join(", ") : null,
      rejected: info.rejected ? info.rejected.join(", ") : null,
      envelope: info.envelope ? JSON.stringify(info.envelope) : null,
      messageId: info.messageId || null,
      pending: info.pending ? info.pending.join(", ") : null,
      response: info.response || null,
    };

    const log = await prisma.logEmails.create({
      data: dataLog
    });

    console.log("Log de envio de email: ", dataLog);
    console.log("prisma return: ", log);

  } catch (error) {
    console.error("Erro ao enviar email:", error);
    throw error;
  }

}

