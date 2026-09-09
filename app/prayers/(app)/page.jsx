import Link from 'next/link';
import { Suspense } from 'react';
import { listPrayersAction, listCategoriesAction, currentUserAction } from '../actions';
import { CategoryFilter } from '../components/category-filter';
import { PrayerCard } from '../components/prayer-card';
import { EditableTitle } from '../components/editable-title';
import { groupByDate, formatDateLabel, formatDateCompact, dateKey } from '../constants';

export const metadata = { title: '기도제목 노트' };

export default async function PrayersHomePage({ searchParams }) {
    const params = await searchParams;
    const [prayers, categories, user] = await Promise.all([
        listPrayersAction(),
        listCategoriesAction(),
        currentUserAction()
    ]);

    const selected = (params?.category || '').split(',').filter(Boolean);
    const filtered = selected.length ? prayers.filter((p) => selected.includes(p.category)) : prayers;
    const groups = groupByDate(filtered);
    const answeredCount = prayers.filter((p) => p.answered).length;

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <EditableTitle initialTitle={user.title} />
                    <p className="mt-1 text-sm text-neutral-400">
                        총 {prayers.length}개의 기도제목 · 응답 {answeredCount}개
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xs italic text-neutral-500">
                        오늘 · {formatDateCompact(dateKey(new Date().toISOString()))}
                    </p>
                    <p className="text-xs italic text-neutral-600">시작일 · {formatDateCompact(dateKey(user.startedAt))}</p>
                </div>
            </div>

            <Link href="/prayers/new" className="btn self-start">
                + 새 기도제목
            </Link>

            <Suspense>
                <CategoryFilter categories={categories} />
            </Suspense>

            {!groups.length && <p className="py-16 text-center text-neutral-500">아직 등록된 기도제목이 없습니다.</p>}

            <div className="flex flex-col gap-8">
                {groups.map(([date, items]) => (
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
