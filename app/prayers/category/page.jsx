import { Suspense } from 'react';
import { listPrayersAction, listCategoriesAction, isOwnerAction } from '../actions';
import { CategoryFilter } from '../components/category-filter';
import { AddCategoryForm } from '../components/add-category-form';
import { PrayerCard } from '../components/prayer-card';
import { categoryStyle } from '../constants';

export const metadata = { title: '카테고리별 | 기도제목 노트' };

export default async function CategoryPage({ searchParams }) {
    const params = await searchParams;
    const [prayers, categories, isOwner] = await Promise.all([
        listPrayersAction(),
        listCategoriesAction(),
        isOwnerAction()
    ]);

    const selected = (params?.category || '').split(',').filter(Boolean);
    const activeCategories = selected.length ? categories.filter((c) => selected.includes(c)) : categories;

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="mb-1">카테고리별 기도제목</h1>
                <p className="text-sm text-neutral-400">체크한 영역의 기도제목만 모아볼 수 있어요.</p>
            </div>

            <Suspense>
                <CategoryFilter categories={categories} />
            </Suspense>

            {isOwner && <AddCategoryForm />}

            <div className="flex flex-col gap-8">
                {activeCategories.map((category) => {
                    const items = prayers
                        .filter((p) => p.category === category)
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    if (!items.length) return null;
                    const style = categoryStyle(category);
                    const answered = items.filter((p) => p.answered).length;

                    return (
                        <section key={category}>
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`px-2 py-0.5 text-sm rounded-full ${style.badge}`}>{category}</span>
                                <span className="text-xs text-neutral-400">
                                    {items.length}개 · 응답 {answered}개
                                </span>
                            </div>
                            <div className="flex flex-col gap-3">
                                {items.map((prayer) => (
                                    <PrayerCard key={prayer.id} prayer={prayer} isOwner={isOwner} />
                                ))}
                            </div>
                        </section>
                    );
                })}
                {activeCategories.every((c) => !prayers.some((p) => p.category === c)) && (
                    <p className="py-16 text-center text-neutral-500">해당 카테고리에 등록된 기도제목이 없습니다.</p>
                )}
            </div>
        </div>
    );
}
