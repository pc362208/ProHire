import { Resend } from 'resend';

export async function sendAppEmail(input: { to: string; subject: string; text: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM || 'ProHire <no-reply@example.com>';

  if (!apiKey) {
    console.log('\n[mail scaffold:fallback-log]');
    console.log(`To: ${input.to}`);
    console.log(`Subject: ${input.subject}`);
    console.log(input.text);
    return { mode: 'log' as const };
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    text: input.text,
  });

  return { mode: 'resend' as const };
}
