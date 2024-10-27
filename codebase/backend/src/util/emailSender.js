import nodemailer from "nodemailer";
import { CLIENT, EMAIL, EMAIL_PASSWORD } from "../config/secret.js";
import { PORT, HOST } from "../config/secret.js";
const sendEmail = async (user_email, purchasedOrderId, supplayerId) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user_email,
      subject: "text",
      text: `${CLIENT}/supplierResponce/${purchasedOrderId}/${supplayerId}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
    console.log(
      `${CLIENT}/supplierResponce/${purchasedOrderId}/${supplayerId}`
    );
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
const sendEmail2 = async (user_email, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: user_email,
      subject: "text",
      text: message,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
export { sendEmail, sendEmail2 };
