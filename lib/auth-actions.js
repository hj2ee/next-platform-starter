'use server';

import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getTeacher, saveTeacher, listTeachers } from 'lib/store';
import { hashPassword, verifyPassword } from 'lib/password';
import { createSessionValue } from 'lib/session';
import { SESSION_COOKIE } from 'lib/current-user';

const SESSION_MAX_AGE = 60 * 60 * 24 * 90; // 90 days, this is a small trusted-crew tool

async function startSession(username) {
    const token = createSessionValue({ username, exp: Date.now() + SESSION_MAX_AGE * 1000 });
    (await cookies()).set(SESSION_COOKIE, token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: SESSION_MAX_AGE
    });
}

export async function signupAction(formData) {
    const username = (formData.get('username') || '').toString().trim().toLowerCase();
    const password = (formData.get('password') || '').toString();
    const nickname = (formData.get('nickname') || '').toString().trim();
    const ageGroup = (formData.get('ageGroup') || '').toString();

    const fail = (message) => redirect(`/signup?error=${encodeURIComponent(message)}`);

    if (!username || !password || !nickname) fail('아이디, 비밀번호, 닉네임을 모두 입력해주세요.');
    if (!/^[a-z0-9_]{3,20}$/.test(username)) fail('아이디는 영문 소문자·숫자·밑줄 3~20자로 입력해주세요.');
    if (password.length < 4) fail('비밀번호는 4자 이상으로 입력해주세요.');

    if (await getTeacher(username)) fail('이미 사용 중인 아이디예요.');

    const teachers = await listTeachers();
    const isAdmin = teachers.length === 0;

    await saveTeacher(username, {
        username,
        passwordHash: hashPassword(password),
        nickname,
        ageGroup,
        isAdmin,
        createdAt: new Date().toISOString(),
        streak: 0,
        lastActiveDate: null,
        totalAnswers: 0
    });

    await startSession(username);
    redirect('/today');
}

export async function loginAction(formData) {
    const username = (formData.get('username') || '').toString().trim().toLowerCase();
    const password = (formData.get('password') || '').toString();

    const fail = () => redirect(`/login?error=${encodeURIComponent('아이디 또는 비밀번호가 올바르지 않아요.')}`);

    if (!username || !password) fail();

    const teacher = await getTeacher(username);
    if (!teacher || !verifyPassword(password, teacher.passwordHash)) fail();

    await startSession(username);
    redirect('/today');
}

export async function logoutAction() {
    (await cookies()).delete(SESSION_COOKIE);
    redirect('/login');
}
