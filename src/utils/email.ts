/**
 * Email template utilities for event registration confirmations
 */

export interface EventRegistrationEmailData {
  participantName: string;
  participantEmail: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  eventDescription: string;
  startTime?: string; // ISO format for calendar
  endTime?: string; // ISO format for calendar
  shareLink?: string;
}

/**
 * Generate HTML email template for event registration confirmation
 */
export function generateEventRegistrationEmail(data: EventRegistrationEmailData): string {
  const { participantName, eventTitle, eventDate, eventTime, eventLocation, eventDescription, startTime, endTime, shareLink } = data;

  // Generate calendar links
  const calendarLinks = startTime && endTime ? `
    <div style="margin: 20px 0; padding: 15px; background-color: #f9f9f9; border-radius: 5px;">
      <p style="margin: 0 0 10px 0; font-weight: bold; color: #333;">Add to Calendar:</p>
      <div style="display: flex; flex-direction: column; gap: 8px;">
        <a href="${getGoogleCalendarUrl({ title: eventTitle, description: eventDescription, location: eventLocation, startTime, endTime })}" 
           style="display: inline-block; padding: 8px 16px; background-color: #4285f4; color: white; text-decoration: none; border-radius: 4px; text-align: center;">
          Google Calendar
        </a>
        <a href="${getOutlookCalendarUrl({ title: eventTitle, description: eventDescription, location: eventLocation, startTime, endTime })}" 
           style="display: inline-block; padding: 8px 16px; background-color: #0078d4; color: white; text-decoration: none; border-radius: 4px; text-align: center;">
          Outlook Calendar
        </a>
      </div>
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Event Registration Confirmation</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #f4f4f4; padding: 20px; border-radius: 5px; margin-bottom: 20px;">
        <h1 style="color: #fbbf24; margin: 0;">KAMLEWA Technologies</h1>
      </div>
      
      <div style="background-color: white; padding: 30px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-top: 0;">Event Registration Confirmation</h2>
        
        <p>Dear ${participantName},</p>
        
        <p>Thank you for registering for our event! We're excited to have you join us.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Event Details</h3>
          <p style="margin: 5px 0;"><strong>Event:</strong> ${eventTitle}</p>
          <p style="margin: 5px 0;"><strong>Date:</strong> ${eventDate}</p>
          ${eventTime ? `<p style="margin: 5px 0;"><strong>Time:</strong> ${eventTime}</p>` : ''}
          <p style="margin: 5px 0;"><strong>Location:</strong> ${eventLocation}</p>
        </div>
        
        <p>${eventDescription}</p>
        
        ${calendarLinks}
        
        ${shareLink ? `
          <div style="margin: 20px 0; padding: 15px; background-color: #fffbf0; border-left: 4px solid #fbbf24; border-radius: 4px;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Share this event:</p>
            <p style="margin: 0; word-break: break-all; color: #666;">${shareLink}</p>
          </div>
        ` : ''}
        
        <p>We look forward to seeing you at the event!</p>
        
        <p style="margin-top: 30px;">
          Best regards,<br>
          <strong>The KAMLEWA Technologies Team</strong>
        </p>
      </div>
      
      <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
        <p>This is an automated email. Please do not reply to this message.</p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Generate plain text email template for event registration confirmation
 */
export function generateEventRegistrationEmailText(data: EventRegistrationEmailData): string {
  const { participantName, eventTitle, eventDate, eventTime, eventLocation, eventDescription, shareLink } = data;

  return `
KAMLEWA Technologies
Event Registration Confirmation

Dear ${participantName},

Thank you for registering for our event! We're excited to have you join us.

Event Details:
- Event: ${eventTitle}
- Date: ${eventDate}
${eventTime ? `- Time: ${eventTime}` : ''}
- Location: ${eventLocation}

${eventDescription}

${shareLink ? `Share this event: ${shareLink}` : ''}

We look forward to seeing you at the event!

Best regards,
The KAMLEWA Technologies Team

---
This is an automated email. Please do not reply to this message.
  `.trim();
}

// Helper functions for calendar URLs (imported from calendar.ts)
function getGoogleCalendarUrl(event: { title: string; description: string; location: string; startTime: string; endTime: string }): string {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatDate(event.startTime)}/${formatDate(event.endTime)}`,
    details: event.description,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function getOutlookCalendarUrl(event: { title: string; description: string; location: string; startTime: string; endTime: string }): string {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString();
  };

  const params = new URLSearchParams({
    subject: event.title,
    startdt: formatDate(event.startTime),
    enddt: formatDate(event.endTime),
    body: event.description,
    location: event.location,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

