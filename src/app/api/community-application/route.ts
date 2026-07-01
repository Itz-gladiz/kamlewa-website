import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, phone, message, community } = await req.json();

    await resend.emails.send({
      from: 'KAMLEWA Technologies <noreply@kamlewa.org>',
      to: email,
      subject: `Application Received – ${community} Community`,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
        <body style="margin:0;padding:0;background-color:#0a0a0a;font-family:Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

                  <!-- Header -->
                  <tr>
                    <td style="background-color:#1b1b1b;padding:36px 40px;border-bottom:3px solid #facc15;">
                      <p style="margin:0;font-size:22px;font-weight:bold;color:#facc15;letter-spacing:1px;">KAMLEWA</p>
                      <p style="margin:4px 0 0;font-size:12px;color:#9ca3af;text-transform:uppercase;letter-spacing:2px;">Technologies</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="background-color:#1b1b1b;padding:40px;">
                      <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#facc15;text-transform:uppercase;letter-spacing:2px;">Community Application</p>
                      <h1 style="margin:0 0 24px;font-size:28px;font-weight:bold;color:#ffffff;line-height:1.3;">
                        Thanks for joining, ${name}!
                      </h1>
                      <p style="margin:0 0 24px;font-size:15px;color:#d1d5db;line-height:1.7;">
                        We've received your application to join the <strong style="color:#facc15;">${community}</strong> community. Our team will review it and reach out to you shortly with next steps.
                      </p>

                      <!-- Summary Card -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;border:1px solid #2d2d2d;margin-bottom:24px;">
                        <tr>
                          <td style="padding:20px 24px;border-bottom:1px solid #2d2d2d;">
                            <p style="margin:0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Application Summary</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:20px 24px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding:6px 0;font-size:13px;color:#6b7280;width:120px;">Community</td>
                                <td style="padding:6px 0;font-size:13px;color:#facc15;font-weight:700;">${community}</td>
                              </tr>
                              <tr>
                                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Name</td>
                                <td style="padding:6px 0;font-size:13px;color:#f9fafb;font-weight:600;">${name}</td>
                              </tr>
                              <tr>
                                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Email</td>
                                <td style="padding:6px 0;font-size:13px;color:#f9fafb;font-weight:600;">${email}</td>
                              </tr>
                              ${phone ? `
                              <tr>
                                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Phone</td>
                                <td style="padding:6px 0;font-size:13px;color:#f9fafb;font-weight:600;">${phone}</td>
                              </tr>` : ''}
                              ${message ? `
                              <tr>
                                <td style="padding:6px 0;font-size:13px;color:#6b7280;vertical-align:top;">Message</td>
                                <td style="padding:6px 0;font-size:13px;color:#f9fafb;">${message}</td>
                              </tr>` : ''}
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Office Info -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#1f1f1f;border:1px solid #2d2d2d;margin-bottom:28px;">
                        <tr>
                          <td style="padding:16px 20px;">
                            <p style="margin:0;font-size:13px;color:#facc15;font-weight:600;">📍 Need more information?</p>
                            <p style="margin:6px 0 0;font-size:13px;color:#d1d5db;line-height:1.6;">You're welcome to visit us in person at our office:</p>
                            <p style="margin:6px 0 0;font-size:13px;color:#ffffff;font-weight:600;">Douala, Bonaberi — Derrière Immeuble Kottobass</p>
                          </td>
                        </tr>
                      </table>

                      <!-- CTA -->
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color:#facc15;padding:14px 32px;">
                            <a href="https://www.kamlewa.org/en/community" style="color:#000000;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">
                              Visit Our Community →
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#0a0a0a;padding:28px 40px;border-top:1px solid #2d2d2d;">
                      <p style="margin:0 0 6px;font-size:12px;color:#4b5563;">KAMLEWA Technologies · Cyber Safety &amp; Digital Inclusion</p>
                      <p style="margin:0;font-size:12px;color:#374151;">
                        <a href="https://www.kamlewa.org" style="color:#facc15;text-decoration:none;">kamlewa.org</a>
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Community application email error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}