import { cookies } from 'next/headers';
import { readSessionValue } from 'lib/session';
import { getTeacher } from 'lib/store';

export const SESSION_COOKIE = 'cg_session';

export async function getCurrentTeacher() {
    const jar = await cookies();
    const payload = readSessionValue(jar.get(SESSION_COOKIE)?.value);
    if (!payload?.username) return null;
    return getTeacher(payload.username);
}
