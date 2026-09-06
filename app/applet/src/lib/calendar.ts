export const fetchCalendarEvents = async (accessToken: string) => {
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${new Date().toISOString()}&singleEvents=true&orderBy=startTime`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  if (!response.ok) {
    throw new Error('Failed to fetch calendar events');
  }
  return response.json();
};

export const blockCalendarNights = async (accessToken: string, propertyName: string, startDate: string, endDate: string) => {
  const event = {
    summary: `Blocked: ${propertyName}`,
    description: `Blocked via Little Hut Vacations app for ${propertyName}`,
    start: { date: startDate },
    end: { date: endDate },
    transparency: 'opaque',
  };

  const response = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error('Failed to create block in Google Calendar');
  }
  return response.json();
};
