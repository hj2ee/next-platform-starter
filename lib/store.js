import { getStore } from '@netlify/blobs';

function teachersStore() {
    return getStore({ name: 'guidebook-teachers', consistency: 'strong' });
}

function answersStore() {
    return getStore({ name: 'guidebook-answers', consistency: 'strong' });
}

export async function getTeacher(username) {
    if (!username) return null;
    return teachersStore().get(username, { type: 'json' });
}

export async function saveTeacher(username, data) {
    await teachersStore().setJSON(username, data);
}

export async function listTeachers() {
    const { blobs } = await teachersStore().list();
    const teachers = await Promise.all(blobs.map(({ key }) => teachersStore().get(key, { type: 'json' })));
    return teachers.filter(Boolean).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

function answerKey({ date, area, username }) {
    return `${date}__${area}__${username}`;
}

export async function getAnswer({ date, area, username }) {
    return answersStore().get(answerKey({ date, area, username }), { type: 'json' });
}

export async function saveAnswer(entry) {
    await answersStore().setJSON(answerKey(entry), entry);
}

export async function listAnswers() {
    const { blobs } = await answersStore().list();
    const answers = await Promise.all(blobs.map(({ key }) => answersStore().get(key, { type: 'json' })));
    return answers.filter(Boolean).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listAnswersForDate(date) {
    const answers = await listAnswers();
    return answers.filter((a) => a.date === date);
}
