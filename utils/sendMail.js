const nodemailer = require("nodemailer");

const sendServiceMail = async (toEmail, pdfPath) => {
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

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: toEmail,
      subject: "Service Report / Invoice",
      html: `
        <h2>Service Completed</h2>
        <p>Please find attached your Service Report / Invoice PDF.</p>
        <p>Thank you for choosing our service.</p>
      `,
      attachments: [
        {
          filename: "Service_Invoice.pdf",
          path: pdfPath,
        },
      ],
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.log("Mail Error:", error);
  }
};

module.exports = sendServiceMail;