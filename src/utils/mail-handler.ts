import * as nodemailer from "nodemailer";
import config from "../config";
export const sendEmail = async (
  email: string,
  title: string,
  content: string
) => {
  const transporter = await nodemailer.createTransport({
    service: "gmail",
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "maiphuonglambh.2002@gmail.com",
      pass: config.googlePass,
    },
  });

  const mailOptions = {
    from: "test.2002@gmail.com",
    to: email,
    subject: "Invoices due",
    text: title,
    html: `<h1 style="color: blue">${title}</h1>
    ${content}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
