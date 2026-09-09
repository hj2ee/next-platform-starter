'use server';

import { randomUUID } from 'node:crypto';
import { kvGet, kvSet } from './store';
import {
    hashSecret,
    verifySecret,
    getUser,
    createSession,
    destroySession,
    getCurrentUsername,
    normalizeUsername
} from './auth';
import { DEFAULT_CATEGORIES } from './constants';

async function requireUsername() {
    const username = await getCurrentUsername();
    if (!username) throw new Error('로그인이 필요합니다.');
    return username;
}

export async function currentUserAction() {
    const username = await getCurrentUsername();
    if (!username) return null;
    const user = await getUser(username);
    return user ? { username: user.username, title: user.title, startedAt: user.startedAt } : null;
}

export async function signupAction(input) {
    const username = normalizeUsername(input?.username);
    const password = input?.password || '';
    const question = (input?.question || '').trim();
    const answer = (input?.answer || '').trim();

    if (!/^[a-z0-9_]{3,20}$/.test(username)) {
        return { success: false, error: '아이디는 영문 소문자/숫자/밑줄로 3~20자 입력해 주세요.' };
    }
    if (password.length < 4) {
        return { success: false, error: '비밀번호는 4자 이상 입력해 주세요.' };
    }
    if (!question || !answer) {
        return { success: false, error: '비밀번호 찾기용 질문과 답을 입력해 주세요.' };
    }
    if (await getUser(username)) {
        return { success: false, error: '이미 사용 중인 아이디예요.' };
    }

    const now = new Date().toISOString();
    const user = {
        username,
        passwordHash: await hashSecret(password),
        securityQuestion: question,
        securityAnswerHash: await hashSecret(answer.toLowerCase()),
        title: '기도제목 노트',
        startedAt: now,
        createdAt: now
    };
    await kvSet('user:' + username, user);
    await kvSet('categories:' + username, DEFAULT_CATEGORIES.slice());
    await kvSet('prayers:' + username, []);
    await createSession(username);
    return { success: true };
}

export async function loginAction(input) {
    const username = normalizeUsername(input?.username);
    const password = input?.password || '';
    const user = await getUser(username);
    if (!user || !(await verifySecret(password, user.passwordHash))) {
        return { success: false, error: '아이디 또는 비밀번호가 올바르지 않습니다.' };
    }
    await createSession(username);
    return { success: true };
}

export async function logoutAction() {
    await destroySession();
}

export async function changePasswordAction(input) {
    const username = await requireUsername();
    const user = await getUser(username);
    if (!user || !(await verifySecret(input?.currentPassword || '', user.passwordHash))) {
        return { success: false, error: '현재 비밀번호가 올바르지 않습니다.' };
    }
    if ((input?.newPassword || '').length < 4) {
        return { success: false, error: '새 비밀번호는 4자 이상 입력해 주세요.' };
    }
    user.passwordHash = await hashSecret(input.newPassword);
    await kvSet('user:' + username, user);
    return { success: true };
}

export async function getSecurityQuestionAction(username) {
    const user = await getUser(username);
    if (!user) return { success: false, error: '존재하지 않는 아이디예요.' };
    return { success: true, question: user.securityQuestion };
}

export async function resetPasswordAction(input) {
    const username = normalizeUsername(input?.username);
    const user = await getUser(username);
    if (!user) return { success: false, error: '존재하지 않는 아이디예요.' };
    const ok = await verifySecret((input?.answer || '').trim().toLowerCase(), user.securityAnswerHash);
    if (!ok) return { success: false, error: '답이 올바르지 않습니다.' };
    if ((input?.newPassword || '').length < 4) {
        return { success: false, error: '새 비밀번호는 4자 이상 입력해 주세요.' };
    }
    user.passwordHash = await hashSecret(input.newPassword);
    await kvSet('user:' + username, user);
    return { success: true };
}

export async function updateTitleAction(title) {
    const username = await requireUsername();
    const user = await getUser(username);
    user.title = (title || '').trim() || '기도제목 노트';
    await kvSet('user:' + username, user);
    return { success: true, title: user.title };
}

export async function listCategoriesAction() {
    const username = await requireUsername();
    return (await kvGet('categories:' + username)) || DEFAULT_CATEGORIES.slice();
}

export async function addCategoryAction(name) {
    const username = await requireUsername();
    const trimmed = (name || '').trim();
    if (!trimmed) return { success: false, error: '카테고리 이름을 입력해 주세요.' };
    const categories = (await kvGet('categories:' + username)) || DEFAULT_CATEGORIES.slice();
    if (!categories.includes(trimmed)) {
        categories.push(trimmed);
        await kvSet('categories:' + username, categories);
    }
    return { success: true, categories };
}

export async function listPrayersAction() {
    const username = await requireUsername();
    const prayers = (await kvGet('prayers:' + username)) || [];
    return prayers.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function createPrayerAction(input) {
    const username = await requireUsername();
    const content = (input?.content || '').trim();
    if (!content) return { success: false, error: '기도제목 내용을 입력해 주세요.' };
    const category = (input?.category || '개인').trim() || '개인';

    const categories = (await kvGet('categories:' + username)) || DEFAULT_CATEGORIES.slice();
    if (!categories.includes(category)) {
        categories.push(category);
        await kvSet('categories:' + username, categories);
    }

    const record = {
        id: randomUUID(),
        category,
        content,
        createdAt: new Date().toISOString(),
        answered: false,
        answerContent: '',
        answeredAt: null,
        prayerCount: 0
    };
    const prayers = (await kvGet('prayers:' + username)) || [];
    prayers.push(record);
    await kvSet('prayers:' + username, prayers);
    return { success: true, prayer: record };
}

export async function updatePrayerAnswerAction(id, { answered, answerContent }) {
    const username = await requireUsername();
    const prayers = (await kvGet('prayers:' + username)) || [];
    const idx = prayers.findIndex((p) => p.id === id);
    if (idx < 0) return { success: false, error: '기도제목을 찾을 수 없습니다.' };
    const existing = prayers[idx];
    const updated = {
        ...existing,
        answered: !!answered,
        answerContent: answered ? (answerContent || '').trim() : '',
        answeredAt: answered ? existing.answeredAt || new Date().toISOString() : null
    };
    prayers[idx] = updated;
    await kvSet('prayers:' + username, prayers);
    return { success: true, prayer: updated };
}

export async function incrementPrayerCountAction(id) {
    const username = await requireUsername();
    const prayers = (await kvGet('prayers:' + username)) || [];
    const idx = prayers.findIndex((p) => p.id === id);
    if (idx < 0) return { success: false, error: '기도제목을 찾을 수 없습니다.' };
    prayers[idx] = { ...prayers[idx], prayerCount: (prayers[idx].prayerCount || 0) + 1 };
    await kvSet('prayers:' + username, prayers);
    return { success: true, prayer: prayers[idx] };
}

export async function deletePrayerAction(id) {
    const username = await requireUsername();
    const prayers = (await kvGet('prayers:' + username)) || [];
    await kvSet(
        'prayers:' + username,
        prayers.filter((p) => p.id !== id)
    );
    return { success: true };
}
