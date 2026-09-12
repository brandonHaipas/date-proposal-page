import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCalendarClient } from './_google';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const { slotIso, guestName, guestEmail } = req.body;
  if (!slotIso || !guestEmail) {
    return res.status(400).json({ error: 'Missing slotIso or guestEmail' });
  }

  const calendar = getCalendarClient();
  const start = new Date(slotIso);
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const event = await calendar.events.insert({
    calendarId: process.env.CALENDAR_ID || 'primary',
    sendUpdates: 'all',
    requestBody: {
      summary: `Date with ${guestName || 'you'} 🌙`,
      start: { dateTime: start.toISOString() },
      end: { dateTime: end.toISOString() },
      attendees: [{ email: guestEmail }],
    },
  });

  res.status(200).json({ eventId: event.data.id });
}