import { sendEmail } from "./mailconfig.js";
import { VERIFICATION_EMAIL_TEMPLATE,PASSWORD_RESET_REQUEST_TEMPLATE,PASSWORD_RESET_SUCCESS_TEMPLATE } from "./emailTemplate.js";


export const sendVerificationEmail = (userEmail, verificationToken) => {
  const subject = "Verify Your Email";
  const html = VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationToken);
  sendEmail(userEmail, subject, "Verify your email using the link", html);
};

export const sendWelcomeEmail = (userEmail, userName) => {
    const subject = "Welcome to Our App!";
    const html = `<p>Hello ${userName}, welcome to our app! We're glad to have you.</p>`;
    sendEmail(userEmail, subject, "Welcome to Baatein!", html);
  };

export  const sendForgotPasswordEmail = (userEmail, resetLink) => {
    const subject = "Reset Your Password";
    const html =PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}",resetLink);
    sendEmail(userEmail, subject, "Reset your password using the link", html);
  };

export  const sendResetSuccessEmail = (userEmail) => {
    const subject = "Password reset successfull";
    const html =PASSWORD_RESET_SUCCESS_TEMPLATE;
    sendEmail(userEmail, subject, "Reset your password using the link", html);
  };

  
  
