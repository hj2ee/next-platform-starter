'use server';

import { getStore } from '@netlify/blobs';
import { cookies } from 'next/headers';
import { randomUUID, createHmac, timingSafeEqual } from 'node:crypto';
import { DEFAULT_CATEGORIES } from './constants';

const COOKIE_NAME = 'prayer_owner_auth';
const OWNER_PIN = process.env.PRAYER_PIN || '2427';
const AUTH_SECRET = process.env.PRAYER_AUTH_SECRET || 'prayer-notes-local-dev-secret';

function prayerStore() {
    return getStore({ name: 'prayer-notes', consistency: 'strong' });
}

function categoryStore() {
    return getStore({ name: 'prayer-categories', consistency: 'strong' });
}

function ownerToken() {
    return createHmac('sha256', AUTH_SECRET).update(OWNER_PIN).digest('hex');
}

async function requireOwner() {
    const cookieStore = await cookies();
    const value = cookieStore.get(COOKIE_NAME)?.value;
    if (!value) return false;
    const expected = ownerToken();
    const a = Buffer.from(value);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
}

export async function isOwnerAction() {
    return requireOwner();
}

export async function unlockOwnerAction(pin) {
    if (pin !== OWNER_PIN) {
        return { success: false, error: 'PIN이 올바르지 않습니다.' };
    }
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, ownerToken(), {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.CONTEXT !== 'dev',
        path: '/',
        maxAge: 60 * 60 * 24 * 365
    });
    return { success: true };
}

export async function lockOwnerAction() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}

export async function listCategoriesAction() {
    const custom = (await categoryStore().get('list', { type: 'json' })) || [];
    return Array.from(new Set([...DEFAULT_CATEGORIES, ...custom]));
}

async function ensureCategory(name) {
    const trimmed = name.trim();
    if (!trimmed || DEFAULT_CATEGORIES.includes(trimmed)) return;
    const custom = (await categoryStore().get('list', { type: 'json' })) || [];
    if (!custom.includes(trimmed)) {
        await categoryStore().setJSON('list', [...custom, trimmed]);
    }
}

export async function addCategoryAction(name) {
    if (!(await requireOwner())) {
        return { success: false, error: '권한이 없습니다.' };
    }
    const trimmed = (name || '').trim();
    if (!trimmed) return { success: false, error: '카테고리 이름을 입력해 주세요.' };
    await ensureCategory(trimmed);
    return { success: true, categories: await listCategoriesAction() };
}

export async function listPrayersAction() {
    const { blobs } = await prayerStore().list();
    const items = await Promise.all(blobs.map(({ key }) => prayerStore().get(key, { type: 'json' })));
    return items.filter(Boolean).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createPrayerAction(input) {
    const content = (input?.content || '').trim();
    const category = (input?.category || '개인').trim() || '개인';
    const authorType = input?.authorType === 'visitor' ? 'visitor' : 'owner';

    if (!content) {
        return { success: false, error: '기도제목 내용을 입력해 주세요.' };
    }

    if (authorType === 'owner' && !(await requireOwner())) {
        return { success: false, error: '권한이 없습니다. PIN을 먼저 입력해 주세요.' };
    }

    if (authorType === 'owner') {
        await ensureCategory(category);
    }

    const record = {
        id: randomUUID(),
        category,
        content,
        authorType,
        authorName: authorType === 'visitor' ? (input?.authorName || '').trim() || '방문자' : '나',
        createdAt: new Date().toISOString(),
        answered: false,
        answerContent: '',
        answeredAt: null,
        prayerCount: 0
    };

    await prayerStore().setJSON(record.id, record);
    return { success: true, prayer: record };
}

export async function updatePrayerAnswerAction(id, { answered, answerContent }) {
    if (!(await requireOwner())) {
        return { success: false, error: '권한이 없습니다.' };
    }
    const existing = await prayerStore().get(id, { type: 'json' });
    if (!existing) return { success: false, error: '기도제목을 찾을 수 없습니다.' };

    const updated = {
        ...existing,
        answered: !!answered,
        answerContent: answered ? (answerContent || '').trim() : '',
        answeredAt: answered ? existing.answeredAt || new Date().toISOString() : null
    };
    await prayerStore().setJSON(id, updated);
    return { success: true, prayer: updated };
}

export async function incrementPrayerCountAction(id) {
    const existing = await prayerStore().get(id, { type: 'json' });
    if (!existing) return { success: false, error: '기도제목을 찾을 수 없습니다.' };
    const updated = { ...existing, prayerCount: (existing.prayerCount || 0) + 1 };
    await prayerStore().setJSON(id, updated);
    return { success: true, prayer: updated };
}

export async function deletePrayerAction(id) {
    if (!(await requireOwner())) {
        return { success: false, error: '권한이 없습니다.' };
    }
    await prayerStore().delete(id);
    return { success: true };
}
