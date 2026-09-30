import { redirect } from 'next/navigation';
import { getCurrentTeacher } from 'lib/current-user';
import { listAnswers, listTeachers } from 'lib/store';
import { AREAS } from 'lib/questions';
import { GuidebookNav } from 'components/guidebook-nav';

export const metadata = { title: '운영자 대시보드' };

export default async function ManagePage({ searchParams }) {
    const teacher = await getCurrentTeacher();
    if (!teacher) redirect('/login');
    if (!teacher.isAdmin) redirect('/today');

    const { author = '', area = '' } = (await searchParams) || {};
    const [answers, teachers] = await Promise.all([listAnswers(), listTeachers()]);

    const filtered = answers.filter((a) => (!author || a.username === author) && (!area || a.area === area));
    const ranking = [...teachers].sort(
        (a, b) => (b.totalAnswers || 0) - (a.totalAnswers || 0) || (b.streak || 0) - (a.streak || 0)
    );

    return (
        <div className="py-8">
            <GuidebookNav teacher={teacher} active="manage" />
            <h1 className="mb-2 text-2xl">운영자 대시보드</h1>
            <p className="mb-8 text-neutral-300">
                누적 답변 {answers.length}개 · 참여 선생님 {teachers.length}명
            </p>

            <h2 className="mb-3 text-xl">참여 랭킹 (참여 횟수·스트릭 기준)</h2>
            <div className="mb-10 overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                    <thead>
                        <tr className="text-left border-b border-white/20">
                            <th className="py-2 pr-4">순위</th>
                            <th className="py-2 pr-4">닉네임</th>
                            <th className="py-2 pr-4">총 답변</th>
                            <th className="py-2 pr-4">연속 참여</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ranking.map((t, i) => (
                            <tr key={t.username} className="border-b border-white/10">
                                <td className="py-2 pr-4">{i + 1}</td>
                                <td className="py-2 pr-4">
                                    {t.nickname}
                                    {t.isAdmin ? ' (운영자)' : ''}
                                </td>
                                <td className="py-2 pr-4">{t.totalAnswers || 0}</td>
                                <td className="py-2 pr-4">{t.streak || 0}일</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <h2 className="mb-3 text-xl">답변 모아보기</h2>
            <form className="flex flex-wrap items-center gap-3 mb-6" method="get">
                <select name="author" defaultValue={author} className="input">
                    <option value="">전체 선생님</option>
                    {teachers.map((t) => (
                        <option key={t.username} value={t.username}>
                            {t.nickname}
                        </option>
                    ))}
                </select>
                <select name="area" defaultValue={area} className="input">
                    <option value="">전체 영역</option>
                    {AREAS.map((a) => (
                        <option key={a.id} value={a.id}>
                            {a.label}
                        </option>
                    ))}
                </select>
                <button type="submit" className="btn">
                    필터 적용
                </button>
                <a href="/manage/export" className="btn">
                    CSV로 내보내기
                </a>
            </form>

            <div className="flex flex-col gap-3">
                {filtered.map((a) => (
                    <div key={`${a.date}-${a.area}-${a.username}`} className="p-4 border rounded-sm bg-white/5 border-white/10">
                        <div className="flex flex-wrap items-center gap-2 mb-2 text-xs text-neutral-300">
                            <span>{a.date}</span>
                            <span className="px-2 py-0.5 rounded-full bg-white/10">{a.areaLabel}</span>
                            <span className="font-bold text-white">{a.nickname}</span>
                            <span>좋아요 {(a.likes || []).length}</span>
                        </div>
                        <p className="mb-1 font-bold">{a.questionText}</p>
                        <p className="whitespace-pre-wrap text-neutral-100">{a.content}</p>
                    </div>
                ))}
                {filtered.length === 0 && <p className="text-neutral-300">조건에 맞는 답변이 없어요.</p>}
            </div>
        </div>
    );
}
