import crypto from 'node:crypto';

export interface StoredDocument<T> {
  data: T;
  updateTime: string;
}

interface AccessToken {
  value: string;
  expiresAt: number;
}

let cachedToken: AccessToken | null = null;

const env = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing server configuration: ${name}`);
  return value;
};

const base64url = (value: string | Buffer): string =>
  Buffer.from(value).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

async function serviceAccountToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt - 60 > now) return cachedToken.value;

  const clientEmail = env('FIREBASE_SERVICE_ACCOUNT_EMAIL');
  const privateKey = env('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n');
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const payload = base64url(JSON.stringify({
    iss: clientEmail,
    sub: clientEmail,
    aud: 'https://oauth2.googleapis.com/token',
    scope: 'https://www.googleapis.com/auth/datastore',
    iat: now,
    exp: now + 3600,
  }));
  const unsigned = `${header}.${payload}`;
  const signature = crypto.sign('RSA-SHA256', Buffer.from(unsigned), privateKey);
  const assertion = `${unsigned}.${base64url(signature)}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
    signal: AbortSignal.timeout(8000),
  });
  if (!response.ok) throw new Error(`Firestore service authentication failed: ${response.status}`);
  const result = await response.json() as { access_token?: string; expires_in?: number };
  if (!result.access_token) throw new Error('Firestore service authentication returned no access token.');
  cachedToken = { value: result.access_token, expiresAt: now + (result.expires_in || 3600) };
  return cachedToken.value;
}

type FirestoreValue = Record<string, unknown>;

function encodeValue(value: unknown): FirestoreValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === 'string') return { stringValue: value };
  if (typeof value === 'boolean') return { booleanValue: value };
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw new Error('Firestore refuses non-finite numbers.');
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
  if (typeof value === 'object') return { mapValue: { fields: encodeFields(value as Record<string, unknown>) } };
  throw new Error(`Unsupported Firestore value type: ${typeof value}`);
}

function encodeFields(value: Record<string, unknown>): Record<string, FirestoreValue> {
  return Object.fromEntries(
    Object.entries(value)
      .filter(([, fieldValue]) => fieldValue !== undefined)
      .map(([key, fieldValue]) => [key, encodeValue(fieldValue)]),
  );
}

function decodeValue(value: FirestoreValue): unknown {
  if ('nullValue' in value) return null;
  if ('stringValue' in value) return value.stringValue;
  if ('booleanValue' in value) return value.booleanValue;
  if ('integerValue' in value) return Number(value.integerValue);
  if ('doubleValue' in value) return Number(value.doubleValue);
  if ('timestampValue' in value) return value.timestampValue;
  if ('arrayValue' in value) {
    const arrayValue = value.arrayValue as { values?: FirestoreValue[] };
    return (arrayValue.values || []).map(decodeValue);
  }
  if ('mapValue' in value) {
    const mapValue = value.mapValue as { fields?: Record<string, FirestoreValue> };
    return decodeFields(mapValue.fields || {});
  }
  throw new Error('Unsupported Firestore response value.');
}

function decodeFields(fields: Record<string, FirestoreValue>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, decodeValue(value)]));
}

interface FirestoreDocumentResponse {
  name: string;
  fields?: Record<string, FirestoreValue>;
  updateTime?: string;
}

const documentBase = (): string => {
  const projectId = env('FIREBASE_PROJECT_ID');
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(projectId)}/databases/(default)/documents`;
};

async function firestoreFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = await serviceAccountToken();
  return fetch(url, {
    ...init,
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      ...(init.headers || {}),
    },
    signal: init.signal || AbortSignal.timeout(8000),
  });
}

export async function getDocument<T>(collection: string, id: string): Promise<StoredDocument<T> | null> {
  const url = `${documentBase()}/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`;
  const response = await firestoreFetch(url);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Firestore read failed: ${response.status}`);
  const document = await response.json() as FirestoreDocumentResponse;
  return { data: decodeFields(document.fields || {}) as T, updateTime: document.updateTime || '' };
}

export async function listDocuments<T>(collection: string): Promise<Array<StoredDocument<T>>> {
  const documents: Array<StoredDocument<T>> = [];
  let pageToken = '';
  do {
    const url = new URL(`${documentBase()}/${encodeURIComponent(collection)}`);
    url.searchParams.set('pageSize', '200');
    if (pageToken) url.searchParams.set('pageToken', pageToken);
    const response = await firestoreFetch(url.toString());
    if (!response.ok) throw new Error(`Firestore list failed: ${response.status}`);
    const result = await response.json() as { documents?: FirestoreDocumentResponse[]; nextPageToken?: string };
    documents.push(...(result.documents || []).map((document) => ({
      data: decodeFields(document.fields || {}) as T,
      updateTime: document.updateTime || '',
    })));
    pageToken = result.nextPageToken || '';
  } while (pageToken);
  return documents;
}

export async function createDocument<T extends Record<string, unknown>>(collection: string, id: string, data: T): Promise<StoredDocument<T>> {
  const url = new URL(`${documentBase()}/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`);
  url.searchParams.set('currentDocument.exists', 'false');
  const response = await firestoreFetch(url.toString(), {
    method: 'PATCH',
    body: JSON.stringify({ fields: encodeFields(data) }),
  });
  if (response.status === 409 || response.status === 412) throw new Error('record_already_exists');
  if (!response.ok) throw new Error(`Firestore create failed: ${response.status}`);
  const document = await response.json() as FirestoreDocumentResponse;
  return { data: decodeFields(document.fields || {}) as T, updateTime: document.updateTime || '' };
}

export async function replaceDocument<T extends Record<string, unknown>>(
  collection: string,
  id: string,
  data: T,
  expectedUpdateTime?: string,
): Promise<StoredDocument<T>> {
  const url = new URL(`${documentBase()}/${encodeURIComponent(collection)}/${encodeURIComponent(id)}`);
  if (expectedUpdateTime) url.searchParams.set('currentDocument.updateTime', expectedUpdateTime);
  const response = await firestoreFetch(url.toString(), {
    method: 'PATCH',
    body: JSON.stringify({ fields: encodeFields(data) }),
  });
  if (response.status === 409 || response.status === 412) throw new Error('record_changed_concurrently');
  if (!response.ok) throw new Error(`Firestore update failed: ${response.status}`);
  const document = await response.json() as FirestoreDocumentResponse;
  return { data: decodeFields(document.fields || {}) as T, updateTime: document.updateTime || '' };
}
