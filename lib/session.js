import crypto from 'node:crypto';

const SECRET = process.env.SESSION_SECRET || 'connect-guidebook-dev-secret-change-me';

function sign(value) {
    return crypto.createHmac('sha256', SECRET).update(value).digest('hex');
}

export function createSessionValue(payload) {
    const base = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
    return `${base}.${sign(base)}`;
}

export function readSessionValue(token) {
    if (!token) return null;
    const [base, sig] = token.split('.');
    if (!base || !sig || sign(base) !== sig) return null;
    try {
        const payload = JSON.parse(Buffer.from(base, 'base64url').toString('utf8'));
        if (payload.exp && Date.now() > payload.exp) return null;
        return payload;
    } catch {
        return null;
    }
}
