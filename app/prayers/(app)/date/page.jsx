import Link from 'next/link';
import { listPrayersAction } from '../../actions';
import { PrayerCard } from '../../components/prayer-card';
import { groupByDate, formatDateLabel } from '../../constants';

export const metadata = { title: '날짜별 | 기도제목 노트' };

export default async function DatePage({ searchParams }) {
    const params = await searchParams;
    const prayers = await listPrayersAction();
    const groups = groupByDate(prayers);
    const selectedDate = params?.date;
    const visibleGroups = selectedDate ? groups.filter(([date]) => date === selectedDate) : groups;

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="mb-1">날짜별 기도제목</h1>
                <p className="text-sm text-neutral-400">언제, 어떤 기도를 했는지 날짜별로 확인해 보세요.</p>
            </div>

            <div className="flex flex-wrap gap-2">
                <Link
                    href="/prayers/date"
                    className={
                        'px-3 py-1.5 text-xs rounded-full no-underline ' +
                        (!selectedDate
                            ? 'bg-primary text-primary-content font-bold'
                            : 'bg-white/5 text-neutral-300 hover:bg-white/10')
                    }
                >
                    전체
                </Link>
                {groups.map(([date, items]) => (
                    <Link
                        key={date}
                        href={`/prayers/date?date=${date}`}
                        className={
                            'px-3 py-1.5 text-xs rounded-full no-underline ' +
                            (selectedDate === date
                                ? 'bg-primary text-primary-content font-bold'
                                : 'bg-white/5 text-neutral-300 hover:bg-white/10')
                        }
                    >
                        {date} ({items.length})
                    </Link>
                ))}
            </div>

            {!visibleGroups.length && (
                <p className="py-16 text-center text-neutral-500">해당 날짜에 기록된 기도제목이 없습니다.</p>
            )}

            <div className="flex flex-col gap-8">
                {visibleGroups.map(([date, items]) => (
                    <section key={date}>
                        <h3 className="mb-3 text-neutral-300">{formatDateLabel(date)}</h3>
                        <div className="flex flex-col gap-3">
                            {items.map((prayer) => (
                                <PrayerCard key={prayer.id} prayer={prayer} />
                            ))}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
