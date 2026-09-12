import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getCalendarClient } from './_google.js';

const SLOT_MINUTES = 60;
const DAY_START_HOUR = 9;
const DAY_END_HOUR = 21;
const DAYS_AHEAD = 7;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const calendar = getCalendarClient();
  const now = new Date();
  const timeMax = new Date(now.getTime() + DAYS_AHEAD * 24 * 60 * 60 * 1000);

  const freebusy = await calendar.freebusy.query({
    requestBody: {
      timeMin: now.toISOString(),
      timeMax: timeMax.toISOString(),
      items: [{ id: process.env.CALENDAR_ID || 'primary' }],
    },
  });

  const busy = freebusy.data.calendars?.[process.env.CALENDAR_ID || 'primary']?.busy ?? [];
  const slots: string[] = [];

  for (let d = 0; d < DAYS_AHEAD; d++) {
    const day = new Date(now);
    day.setDate(day.getDate() + d);
    for (let h = DAY_START_HOUR; h < DAY_END_HOUR; h++) {
      const slotStart = new Date(day);
      slotStart.setHours(h, 0, 0, 0);
      const slotEnd = new Date(slotStart.getTime() + SLOT_MINUTES * 60 * 1000);
      if (slotStart < now) continue;

      const overlaps = busy.some((b) => {
        const busyStart = new Date(b.start!);
        const busyEnd = new Date(b.end!);
        return slotStart < busyEnd && slotEnd > busyStart;
      });
      if (!overlaps) slots.push(slotStart.toISOString());
    }
  }

  res.status(200).json({ slots: slots.slice(0, 12) });
}