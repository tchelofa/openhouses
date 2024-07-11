import nodemailer from 'nodemailer'

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
export default async function sendEmail(fromName:string, from: string, to: string, subject:string , text:string, html: string) {
  // send mail with defined transport object
  const _from = `'"${fromName} " <${from}>'`
  const _subject = `${subject}`
  const _text = `${text}`
  const _html = `${html}`


  const info = await transporter.sendMail({
    from: _from, // sender address
    to: to, // list of receivers
    subject: _subject, // Subject line
    text: _text, // plain text body
    html: _html, // html body
  });

  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}

