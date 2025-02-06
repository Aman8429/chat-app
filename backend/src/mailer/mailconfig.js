
import dotenv from "dotenv"
import nodemailer from 'nodemailer'
dotenv.config();
// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Function to send emails
export const sendEmail = async (to, subject, text, html) => {
  try {
    await transporter.sendMail({
      from: `"Baatein!" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};


