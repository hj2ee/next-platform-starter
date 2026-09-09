import { cookies } from 'next/headers';
import { randomBytes, randomUUID, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { kvGet, kvSet, kvDel } from './store';

const scryptAsync = promisify(scrypt);
const SESSION_COOKIE = 'prayer_session';
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 365;

export async function hashSecret(secret) {
    const salt = randomBytes(16).toString('hex');
    const derived = await scryptAsync(secret, salt, 64);
    return salt + ':' + derived.toString('hex');
}

export async function verifySecret(secret, stored) {
    if (!stored || stored.indexOf(':') < 0) return false;
    const [salt, hashHex] = stored.split(':');
    const derived = await scryptAsync(secret, salt, 64);
    const storedBuf = Buffer.from(hashHex, 'hex');
    if (storedBuf.length !== derived.length) return false;
    return timingSafeEqual(storedBuf, derived);
}

export function normalizeUsername(username) {
    return (username || '').trim().toLowerCase();
}

export async function getUser(username) {
    return kvGet('user:' + normalizeUsername(username));
}

export async function createSession(username) {
    const token = randomUUID() + randomUUID();
    await kvSet('session:' + token, username, { ex: SESSION_TTL_SECONDS });
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: SESSION_TTL_SECONDS
    });
}

export async function destroySession() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (token) await kvDel('session:' + token);
    cookieStore.delete(SESSION_COOKIE);
}

export async function getCurrentUsername() {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const username = await kvGet('session:' + token);
    return username || null;
}
