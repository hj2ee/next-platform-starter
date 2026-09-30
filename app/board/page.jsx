import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentTeacher } from 'lib/current-user';
import { listAnswersForDate } from 'lib/store';
import { getQuestionsForDate, todayDateString } from 'lib/questions';
import { GuidebookNav } from 'components/guidebook-nav';
import { LikeButton } from 'components/like-button';

export const metadata = { title: '이 문제 게시판' };

export default async function BoardPage() {
    const teacher = await getCurrentTeacher();
    if (!teacher) redirect('/login');

    const date = todayDateString();
    const questions = getQuestionsForDate(date);
    const answers = await listAnswersForDate(date);

    return (
        <div className="py-8">
            <GuidebookNav teacher={teacher} active="board" />
            <h1 className="mb-2 text-2xl">오늘의 답변 게시판</h1>
            <p className="mb-8 text-neutral-300">내가 답한 문제만 다른 선생님들 답이 보여요.</p>
            <div className="flex flex-col gap-8">
                {questions.map((q) => {
                    const areaAnswers = answers.filter((a) => a.area === q.area);
                    const mine = areaAnswers.find((a) => a.username === teacher.username);
                    return (
                        <div key={q.id}>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span
                                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                                    style={{ backgroundColor: q.color, color: '#fff' }}
                                >
                                    {q.areaLabel}
                                </span>
                                {q.tag && <span className="px-2 py-0.5 text-xs rounded-full bg-white/10">{q.tag}</span>}
                                <span className="text-xs text-neutral-300">답변 {areaAnswers.length}개</span>
                            </div>
                            <p className="mb-4 text-lg">{q.text}</p>
                            {!mine ? (
                                <p className="p-4 text-sm border rounded-sm text-neutral-300 border-white/10">
                                    이 문제는 아직 답변 전이에요.{' '}
                                    <Link href="/today" className="text-white">
                                        오늘의 문제에서 먼저 적어보세요
                                    </Link>{' '}
                                    — 그래야 여기서 다른 선생님들 답이 보여요.
                                </p>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {areaAnswers.map((a) => (
                                        <div key={a.username} className="p-4 border rounded-sm bg-white/5 border-white/10">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold">
                                                    {a.nickname}
                                                    {a.username === teacher.username ? ' (나)' : ''}
                                                </span>
                                                <LikeButton
                                                    date={date}
                                                    area={q.area}
                                                    author={a.username}
                                                    likedByMe={(a.likes || []).includes(teacher.username)}
                                                    count={(a.likes || []).length}
                                                />
                                            </div>
                                            <p className="whitespace-pre-wrap text-neutral-100">{a.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
