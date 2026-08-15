import { Resend } from "resend";
import "dotenv/config";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (toEmail, pin) => {
  const { error } = await resend.emails.send({
    from: "WPZ <onboarding@resend.dev>", // fine for dev/testing, no domain setup needed
    to: toEmail,
    subject: "Email Verification",
    text: `Your verification pin is ${pin}. It would expire in 15 minutes.`,
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
};