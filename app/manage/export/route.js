import { getCurrentTeacher } from 'lib/current-user';
import { listAnswers } from 'lib/store';

function escapeCsv(value) {
    const str = (value ?? '').toString();
    if (/[",\n]/.test(str)) return `"${str.replace(/"/g, '""')}"`;
    return str;
}

export async function GET() {
    const teacher = await getCurrentTeacher();
    if (!teacher?.isAdmin) {
        return new Response('Forbidden', { status: 403 });
    }

    const answers = await listAnswers();
    const rows = [
        ['날짜', '영역', '질문', '아이디', '닉네임', '답변', '좋아요 수'],
        ...answers.map((a) => [a.date, a.areaLabel, a.questionText, a.username, a.nickname, a.content, (a.likes || []).length])
    ];
    // Leading BOM so Excel/Notion 가져오기 read the Korean text as UTF-8 correctly.
    const csv = '﻿' + rows.map((row) => row.map(escapeCsv).join(',')).join('\n');

    return new Response(csv, {
        headers: {
            'Content-Type': 'text/csv; charset=utf-8',
            'Content-Disposition': 'attachment; filename="connect-guidebook-answers.csv"'
        }
    });
}
