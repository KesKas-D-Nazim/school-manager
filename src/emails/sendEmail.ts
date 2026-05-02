
import { Resend } from "resend";
import { EmailVerificationTemplate } from "./email-verification.js";
import React, { createElement } from "react";

export const sendVerificationEmail = async (
    to: string,
    verificationUrl: string,
    name = "there",
) => {

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to,
    subject: "Verify your email",
    react: createElement(EmailVerificationTemplate, {
    name,
    verificationUrl,
    appName: "edoManage",
    expiresInMinutes: 15,
    }),
  });

    console.log(`Sending verification email to ${to} and data:`, data);
    if (error) {
        console.error(`Error sending verification email to ${to}:`, error);
    }
}