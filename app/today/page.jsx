import { redirect } from 'next/navigation';
import { getCurrentTeacher } from 'lib/current-user';
import { getAnswer } from 'lib/store';
import { getQuestionsForDate, todayDateString } from 'lib/questions';
import { GuidebookNav } from 'components/guidebook-nav';
import { Alert } from 'components/alert';
import { AnswerForm } from 'components/answer-form';

export const metadata = { title: '오늘의 문제' };

export default async function TodayPage({ searchParams }) {
    const teacher = await getCurrentTeacher();
    if (!teacher) redirect('/login');

    const { error } = (await searchParams) || {};
    const date = todayDateString();
    const questions = getQuestionsForDate(date);

    const answered = await Promise.all(
        questions.map((q) => getAnswer({ date, area: q.area, username: teacher.username }))
    );
    const doneCount = answered.filter(Boolean).length;

    return (
        <div className="py-8">
            <GuidebookNav teacher={teacher} active="today" />
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <h1 className="text-2xl">오늘의 문제</h1>
                <span className="text-sm text-neutral-300">
                    {date} · {doneCount}/{questions.length} 완료
                </span>
            </div>
            <p className="mb-8 text-neutral-300">
                정답은 하나가 아니에요. 내가 그 상황이라면 실제로 어떻게 할지 적어주세요. 제출한 문제부터 다른
                선생님들 답을 바로 볼 수 있어요.
            </p>
            {error && (
                <Alert type="error" className="mb-6">
                    {error}
                </Alert>
            )}
            <div className="flex flex-col gap-6">
                {questions.map((q, i) => {
                    const existing = answered[i];
                    return (
                        <div key={q.id} className="p-6 border rounded-sm bg-white/5 border-white/10">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span
                                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                                    style={{ backgroundColor: q.color, color: '#fff' }}
                                >
                                    {q.areaLabel}
                                </span>
                                {q.tag && <span className="px-2 py-0.5 text-xs rounded-full bg-white/10">{q.tag}</span>}
                                {existing && <span className="text-xs text-primary">제출 완료</span>}
                            </div>
                            <p className="mb-4 text-lg">{q.text}</p>
                            <AnswerForm date={date} question={q} initialContent={existing?.content} done={!!existing} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
