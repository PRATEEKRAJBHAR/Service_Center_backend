const nodemailer = require("nodemailer");

const sendResetPasswordMail = async (toEmail, subject, message) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_USER,
      to: toEmail,
      subject: subject,
      html: message,
    });

    console.log("Reset password email sent");
  } catch (error) {
    console.log("Mail Error:", error);
  }
};

module.exports = sendResetPasswordMail;