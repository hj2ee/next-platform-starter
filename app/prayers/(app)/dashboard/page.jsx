import { listPrayersAction, listCategoriesAction } from '../../actions';
import { categoryStyle, formatDateTime } from '../../constants';

export const metadata = { title: '대시보드 | 기도제목 노트' };

export default async function DashboardPage() {
    const [prayers, categories] = await Promise.all([listPrayersAction(), listCategoriesAction()]);

    const total = prayers.length;
    const answered = prayers.filter((p) => p.answered);
    const answeredCount = answered.length;
    const answerRate = total ? Math.round((answeredCount / total) * 100) : 0;
    const totalPrayerTaps = prayers.reduce((sum, p) => sum + (p.prayerCount || 0), 0);

    const byCategory = categories
        .map((category) => ({ category, count: prayers.filter((p) => p.category === category).length }))
        .filter((c) => c.count > 0)
        .sort((a, b) => b.count - a.count);
    const maxCount = Math.max(1, ...byCategory.map((c) => c.count));

    const recentAnswered = [...answered]
        .sort((a, b) => new Date(b.answeredAt) - new Date(a.answeredAt))
        .slice(0, 8);

    const needsPrayer = prayers
        .filter((p) => !p.answered)
        .slice()
        .sort((a, b) => {
            const diff = (a.prayerCount || 0) - (b.prayerCount || 0);
            if (diff !== 0) return diff;
            return new Date(a.createdAt) - new Date(b.createdAt);
        })
        .slice(0, 6);

    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="mb-1">대시보드</h1>
                <p className="text-sm text-neutral-400">한눈에 보는 기도 기록과 응답 현황</p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatTile label="전체 기도제목" value={total} />
                <StatTile label="응답받음" value={answeredCount} />
                <StatTile label="응답률" value={`${answerRate}%`} />
                <StatTile label="기도 누적 횟수" value={totalPrayerTaps} />
            </div>

            <section>
                <h3 className="mb-4">카테고리별 분포</h3>
                {!byCategory.length && <p className="text-sm text-neutral-500">아직 데이터가 없습니다.</p>}
                <div className="flex flex-col gap-3">
                    {byCategory.map(({ category, count }) => {
                        const style = categoryStyle(category);
                        const width = Math.max(6, Math.round((count / maxCount) * 100));
                        return (
                            <div key={category} className="flex items-center gap-3">
                                <span className="text-sm text-neutral-300 shrink-0 w-20 truncate">{category}</span>
                                <div className="flex-1 h-3 overflow-hidden rounded-full bg-white/5">
                                    <div className={`h-full rounded-full ${style.bar}`} style={{ width: `${width}%` }} />
                                </div>
                                <span className="w-8 text-sm text-right text-neutral-400 shrink-0">{count}</span>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section>
                <h3 className="mb-4">최근 응답받은 기도제목</h3>
                {!recentAnswered.length && (
                    <p className="text-sm text-neutral-500">아직 응답으로 기록된 기도제목이 없습니다.</p>
                )}
                <div className="flex flex-col gap-3">
                    {recentAnswered.map((prayer) => {
                        const style = categoryStyle(prayer.category);
                        return (
                            <div key={prayer.id} className="p-4 rounded-lg bg-white/5 ring-1 ring-white/10">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${style.badge}`}>{prayer.category}</span>
                                    <span className="text-xs text-neutral-400">
                                        {prayer.answeredAt ? formatDateTime(prayer.answeredAt) : ''}
                                    </span>
                                </div>
                                <p className="mb-2 text-sm text-neutral-300 whitespace-pre-wrap">{prayer.content}</p>
                                {prayer.answerContent && (
                                    <p className="text-sm whitespace-pre-wrap text-primary">💬 {prayer.answerContent}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            <section>
                <h3 className="mb-4">기도가 더 필요한 기도제목</h3>
                {!needsPrayer.length && (
                    <p className="text-sm text-neutral-500">아직 응답을 기다리는 기도제목이 없어요.</p>
                )}
                <div className="flex flex-col gap-3">
                    {needsPrayer.map((prayer) => {
                        const style = categoryStyle(prayer.category);
                        return (
                            <div key={prayer.id} className="p-4 rounded-lg bg-white/5 ring-1 ring-white/10">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <span className={`px-2 py-0.5 text-xs rounded-full ${style.badge}`}>{prayer.category}</span>
                                    <span className="text-xs text-neutral-400">{formatDateTime(prayer.createdAt)}</span>
                                </div>
                                <p className="mb-2 text-sm text-neutral-300 whitespace-pre-wrap">{prayer.content}</p>
                                <p className="text-xs font-bold text-amber-400">
                                    🙏 기도했어요 {prayer.prayerCount || 0}회
                                </p>
                            </div>
                        );
                    })}
                </div>
            </section>
        </div>
    );
}

function StatTile({ label, value }) {
    return (
        <div className="p-4 text-center rounded-lg bg-white/5 ring-1 ring-white/10">
            <div className="text-2xl font-bold">{value}</div>
            <div className="mt-1 text-xs text-neutral-400">{label}</div>
        </div>
    );
}
