import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, phone, eventTitle, eventDate, eventLocation, eventTime } = await req.json();

    await resend.emails.send({
      from: 'KAMLEWA Technologies <noreply@kamlewa.org>',
      to: email,
      subject: `Registration Confirmed – ${eventTitle}`,
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
                      <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#facc15;text-transform:uppercase;letter-spacing:2px;">Event Registration</p>
                      <h1 style="margin:0 0 24px;font-size:28px;font-weight:bold;color:#ffffff;line-height:1.3;">
                        You're registered, ${name}!
                      </h1>
                      <p style="margin:0 0 24px;font-size:15px;color:#d1d5db;line-height:1.7;">
                        Your registration for <strong style="color:#ffffff;">${eventTitle}</strong> has been received and confirmed. We look forward to seeing you there!
                      </p>

                      <!-- Event Details Card -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0a0a0a;border:1px solid #2d2d2d;margin-bottom:28px;">
                        <tr>
                          <td style="padding:16px 24px;border-bottom:1px solid #2d2d2d;">
                            <p style="margin:0;font-size:11px;color:#6b7280;text-transform:uppercase;letter-spacing:1px;">Event Details</p>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding:20px 24px;">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="padding:6px 0;font-size:13px;color:#6b7280;width:120px;">Event</td>
                                <td style="padding:6px 0;font-size:13px;color:#f9fafb;font-weight:600;">${eventTitle}</td>
                              </tr>
                              ${eventDate ? `
                              <tr>
                                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Date</td>
                                <td style="padding:6px 0;font-size:13px;color:#f9fafb;font-weight:600;">${eventDate}</td>
                              </tr>` : ''}
                              ${eventTime ? `
                              <tr>
                                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Time</td>
                                <td style="padding:6px 0;font-size:13px;color:#f9fafb;font-weight:600;">${eventTime}</td>
                              </tr>` : ''}
                              ${eventLocation ? `
                              <tr>
                                <td style="padding:6px 0;font-size:13px;color:#6b7280;">Location</td>
                                <td style="padding:6px 0;font-size:13px;color:#f9fafb;font-weight:600;">${eventLocation}</td>
                              </tr>` : ''}
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
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Note -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#facc1510;border:1px solid #facc1530;margin-bottom:16px;">
                        <tr>
                          <td style="padding:16px 20px;">
                            <p style="margin:0;font-size:13px;color:#facc15;font-weight:600;">📌 What's next?</p>
                            <p style="margin:6px 0 0;font-size:13px;color:#d1d5db;line-height:1.6;">We will send you a reminder closer to the event date with any additional details you need to know. Keep an eye on your inbox!</p>
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

                      <p style="margin:0 0 32px;font-size:14px;color:#9ca3af;line-height:1.7;">
                        In the meantime, explore our other events and programs at
                        <a href="https://www.kamlewa.org" style="color:#facc15;text-decoration:none;">kamlewa.org</a>.
                      </p>

                      <!-- CTA -->
                      <table cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="background-color:#facc15;padding:14px 32px;">
                            <a href="https://www.kamlewa.org/en/events-impact" style="color:#000000;font-size:14px;font-weight:700;text-decoration:none;letter-spacing:0.5px;">
                              View All Events →
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
    console.error('Event registration email error:', error);
    return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 });
  }
}