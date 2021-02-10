const nodemailer = require('nodemailer');

async function send(to, subject, content) {
  const transporter = nodemailer.createTransport({
    host: 'gmail',
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  return transporter.sendMail(
    {
      from: process.env.EMAIL_USERNAME,
      to,
      subject,
      text: content,
    },
    function (error, response) {
      if (error) console.log(error);
    }
  );
}

module.exports = send;
