/**
 * Little Hut Vacations - Gmail API Integration Client
 * Provides RFC 822 MIME message construction, Base64URL encoding,
 * inbox listing, and sending operations via the Google Workspace Gmail API.
 */

function encodeBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export interface EmailParams {
  to: string;
  from?: string;
  subject: string;
  bodyHtml: string;
  replyTo?: string;
}

export function buildRawEmail({ to, from, subject, bodyHtml, replyTo }: EmailParams): string {
  // Encode subject in UTF-8 base64 per RFC 2047
  const subjectEncoded = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const lines = [
    `To: ${to}`,
    ...(from ? [`From: ${from}`] : []),
    ...(replyTo ? [`Reply-To: ${replyTo}`] : []),
    `Subject: ${subjectEncoded}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    bodyHtml
  ];
  return encodeBase64Url(lines.join('\r\n'));
}

export async function sendGmailMessage(accessToken: string, rawBase64Url: string) {
  const url = 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send';
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: rawBase64Url }),
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => null);
    throw new Error(
      errorJson?.error?.message || `Failed to send Gmail message (${response.status} ${response.statusText})`
    );
  }

  return response.json();
}

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  to?: string;
  date?: string;
}

export async function listGmailMessages(
  accessToken: string,
  maxResults = 10,
  query = ''
): Promise<{ messages?: { id: string; threadId: string }[]; resultSizeEstimate?: number }> {
  let url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${maxResults}`;
  if (query) {
    url += `&q=${encodeURIComponent(query)}`;
  }
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => null);
    throw new Error(errorJson?.error?.message || `Failed to list messages (${response.status})`);
  }

  return response.json();
}

export async function getGmailMessageMetadata(
  accessToken: string,
  messageId: string
): Promise<GmailMessageSummary> {
  const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=metadata&metadataHeaders=Subject&metadataHeaders=From&metadataHeaders=To&metadataHeaders=Date`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch message details for ${messageId}`);
  }

  const data = await response.json();
  const headers = data.payload?.headers || [];
  const getHeader = (name: string) => headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';

  return {
    id: data.id,
    threadId: data.threadId,
    snippet: data.snippet,
    subject: getHeader('Subject'),
    from: getHeader('From'),
    to: getHeader('To'),
    date: getHeader('Date'),
  };
}
