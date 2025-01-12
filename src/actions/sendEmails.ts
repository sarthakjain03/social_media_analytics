import nodemailer from "nodemailer";
import getHtmlTemplateForEmail from "@/emailHtmlTemplates/emailTemplates";

type SendEmailProps = {
  email: string;
  otp?: number;
  forgotPasswordUrl?: string;
  type: 'OTP' | 'RESET' | 'REGISTRATION' | "PASSWORD_CHANGED"
}

const subjects = {
  OTP: "OTP Verification",
  RESET: "Reset your Analyzr Password",
  REGISTRATION: "Registration Successfull",
  PASSWORD_CHANGED: "Password Reset Successfull"
}

export default async function sendEmail({ email, otp, forgotPasswordUrl, type } : SendEmailProps) {
  try {
    const transport = nodemailer.createTransport({
      host: process.env.NODEMAILER_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_FOR_SENDING,
        pass: process.env.NODEMAILER_GMAIL_PASSWORD,
      },
    });

    const sentMail = await transport.sendMail({
      from: process.env.EMAIL_FOR_SENDING,
      to: email,
      subject: subjects[type],
      html: getHtmlTemplateForEmail({ type, otp, forgotPasswordUrl }),
    });

  } catch (error) {
    console.error("Error while sending OTP", error);
    return Response.json(
      {
        status: false,
        message:
          "Error occurred while sending verification OTP to the email address",
      },
      { status: 500 }
    );
  }
};

