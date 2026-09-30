'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getCurrentTeacher } from 'lib/current-user';
import { getAnswer, saveAnswer, saveTeacher } from 'lib/store';
import { todayDateString, MIN_ANSWER_LENGTH } from 'lib/questions';

export async function submitAnswerAction(formData) {
    const teacher = await getCurrentTeacher();
    if (!teacher) redirect('/login');

    const date = (formData.get('date') || '').toString();
    const area = (formData.get('area') || '').toString();
    const areaLabel = (formData.get('areaLabel') || '').toString();
    const questionId = (formData.get('questionId') || '').toString();
    const questionText = (formData.get('questionText') || '').toString();
    const content = (formData.get('content') || '').toString().trim();

    if (!date || !area || !questionId) redirect('/today');
    if (content.length < MIN_ANSWER_LENGTH) {
        redirect(`/today?error=${encodeURIComponent(`조금 더 자세히 적어주세요 (최소 ${MIN_ANSWER_LENGTH}자).`)}`);
    }

    const existing = await getAnswer({ date, area, username: teacher.username });

    await saveAnswer({
        date,
        area,
        areaLabel,
        questionId,
        questionText,
        username: teacher.username,
        nickname: teacher.nickname,
        content,
        likes: existing?.likes || [],
        createdAt: existing?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
    });

    if (!existing) {
        const today = todayDateString();
        const yesterday = todayDateString(new Date(Date.now() - 86400000));
        const { streak = 0, lastActiveDate, totalAnswers = 0 } = teacher;
        const nextStreak = lastActiveDate === today ? streak : lastActiveDate === yesterday ? streak + 1 : 1;

        await saveTeacher(teacher.username, {
            ...teacher,
            streak: nextStreak,
            lastActiveDate: today,
            totalAnswers: totalAnswers + 1
        });
    }

    revalidatePath('/today');
    revalidatePath('/board');
    revalidatePath('/me');
    revalidatePath('/manage');
    redirect('/today');
}

export async function toggleLikeAction(formData) {
    const teacher = await getCurrentTeacher();
    if (!teacher) redirect('/login');

    const date = (formData.get('date') || '').toString();
    const area = (formData.get('area') || '').toString();
    const authorUsername = (formData.get('author') || '').toString();
    if (!date || !area || !authorUsername) redirect('/board');

    const answer = await getAnswer({ date, area, username: authorUsername });
    if (!answer) redirect('/board');

    const likes = new Set(answer.likes || []);
    if (likes.has(teacher.username)) {
        likes.delete(teacher.username);
    } else {
        likes.add(teacher.username);
    }
    await saveAnswer({ ...answer, likes: Array.from(likes) });

    revalidatePath('/board');
    redirect('/board');
}
