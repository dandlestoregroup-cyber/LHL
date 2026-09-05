import crypto from 'node:crypto';
import type { Request, Response } from 'express';

export interface LiveSession {
  uid: string;
  email: string;
  issuedAt: number;
  expiresAt: number;
}

const COOKIE_NAME = 'lhl_live_session';
const SESSION_TTL_SECONDS = 7 * 24 * 60 * 60;

const env = (name: string): string => {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing server configuration: ${name}`);
  return value;
};

const base64url = (value: string | Buffer): string =>
  Buffer.from(value).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

const decodeBase64url = (value: string): Buffer => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, 'base64');
};

const sign = (payload: string): string =>
  base64url(crypto.createHmac('sha256', env('LHL_SESSION_SECRET')).update(payload).digest());

const safeEqual = (left: string, right: string): boolean => {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

const parseCookies = (header: string | undefined): Record<string, string> => {
  if (!header) return {};
  return Object.fromEntries(header.split(';').map((item) => {
    const index = item.indexOf('=');
    if (index === -1) return [item.trim(), ''];
    return [item.slice(0, index).trim(), decodeURIComponent(item.slice(index + 1).trim())];
  }));
};

export function readSession(req: Request): LiveSession | null {
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!token) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature || !safeEqual(sign(encoded), signature)) return null;
  try {
    const session = JSON.parse(decodeBase64url(encoded).toString('utf8')) as LiveSession;
    if (!session.uid || !session.email || session.expiresAt <= Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

export function setSession(res: Response, uid: string, email: string): LiveSession {
  const issuedAt = Math.floor(Date.now() / 1000);
  const session: LiveSession = { uid, email: email.toLowerCase(), issuedAt, expiresAt: issuedAt + SESSION_TTL_SECONDS };
  const encoded = base64url(JSON.stringify(session));
  const token = `${encoded}.${sign(encoded)}`;
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('set-cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SECONDS}${secure}`);
  return session;
}

export function clearSession(res: Response): void {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('set-cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`);
}

interface FirebasePasswordResponse {
  localId?: string;
  email?: string;
  error?: { message?: string };
}

export async function authenticatePassword(email: string, password: string, create = false): Promise<{ uid: string; email: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(normalizedEmail) || password.length < 8 || password.length > 256) {
    throw new Error('invalid_credentials');
  }
  const endpoint = create ? 'accounts:signUp' : 'accounts:signInWithPassword';
  const apiKey = env('FIREBASE_API_KEY');
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/${endpoint}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: normalizedEmail, password, returnSecureToken: true }),
    signal: AbortSignal.timeout(8000),
  });
  const result = await response.json() as FirebasePasswordResponse;
  if (!response.ok || !result.localId || !result.email) {
    const code = result.error?.message || 'authentication_failed';
    throw new Error(code.toLowerCase());
  }
  return { uid: result.localId, email: result.email.toLowerCase() };
}

export function isBootstrapIdentity(session: LiveSession): boolean {
  const email = process.env.LHL_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  return Boolean(email && session.email === email);
}
