import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function sendOrderEmail({ to, subject, text }: { to: string; subject: string; text: string }) {
  if (!resend || !process.env.EMAIL_FROM) {
    console.warn(`[email not sent] Configure RESEND_API_KEY and EMAIL_FROM. ${subject} -> ${to}`);
    return;
  }
  const { error } = await resend.emails.send({ from: process.env.EMAIL_FROM, to, subject, text });
  if (error) throw new Error(`Order email delivery failed: ${error.message}`);
}
