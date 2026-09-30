import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentTeacher } from 'lib/current-user';
import { listAnswers } from 'lib/store';
import { GuidebookNav } from 'components/guidebook-nav';

export const metadata = { title: '내 답변' };

export default async function MePage() {
    const teacher = await getCurrentTeacher();
    if (!teacher) redirect('/login');

    const answers = (await listAnswers()).filter((a) => a.username === teacher.username);

    return (
        <div className="py-8">
            <GuidebookNav teacher={teacher} active="me" />
            <h1 className="mb-2 text-2xl">내 답변</h1>
            <div className="flex flex-wrap gap-6 mb-8 text-sm text-neutral-300">
                <span>
                    총 답변 <b className="text-white">{teacher.totalAnswers || 0}개</b>
                </span>
                <span>
                    연속 참여 <b className="text-white">{teacher.streak || 0}일</b>
                </span>
            </div>
            {answers.length === 0 ? (
                <p className="text-neutral-300">
                    아직 작성한 답변이 없어요.{' '}
                    <Link href="/today" className="text-white">
                        오늘의 문제
                    </Link>
                    부터 시작해보세요.
                </p>
            ) : (
                <div className="flex flex-col gap-4">
                    {answers.map((a) => (
                        <div key={`${a.date}-${a.area}`} className="p-4 border rounded-sm bg-white/5 border-white/10">
                            <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-neutral-300">
                                <span>{a.date}</span>
                                <span className="px-2 py-0.5 rounded-full bg-white/10">{a.areaLabel}</span>
                                <span>좋아요 {(a.likes || []).length}</span>
                            </div>
                            <p className="mb-1 font-bold">{a.questionText}</p>
                            <p className="whitespace-pre-wrap text-neutral-100">{a.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
