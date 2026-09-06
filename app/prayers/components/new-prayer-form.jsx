'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createPrayerAction } from '../actions';

export function NewPrayerForm({ categories, authorType, redirectTo }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [category, setCategory] = useState(categories[0] || '개인');
    const [customCategory, setCustomCategory] = useState('');
    const [content, setContent] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    function submit(e) {
        e.preventDefault();
        setError('');
        setSuccess(false);
        const finalCategory = category === '__custom__' ? customCategory.trim() : category;

        if (category === '__custom__' && !finalCategory) {
            setError('새 카테고리 이름을 입력해 주세요.');
            return;
        }

        startTransition(async () => {
            const res = await createPrayerAction({
                category: finalCategory,
                content,
                authorType,
                authorName
            });
            if (res.success) {
                setContent('');
                setCustomCategory('');
                setCategory(finalCategory);
                setSuccess(true);
                router.refresh();
                if (redirectTo) {
                    router.push(redirectTo);
                }
            } else {
                setError(res.error);
            }
        });
    }

    return (
        <form onSubmit={submit} className="flex flex-col gap-3">
            {authorType === 'visitor' && (
                <input
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="이름 또는 별칭 (선택)"
                    className="input"
                />
            )}

            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input">
                {categories.map((c) => (
                    <option key={c} value={c}>
                        {c}
                    </option>
                ))}
                {authorType === 'owner' && <option value="__custom__">+ 새 카테고리 추가</option>}
            </select>

            {authorType === 'owner' && category === '__custom__' && (
                <input
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="새 카테고리 이름"
                    className="input"
                />
            )}

            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="기도제목을 적어주세요"
                rows={4}
                required
                className="input"
            />

            {error && <p className="text-sm text-rose-400">{error}</p>}
            {success && <p className="text-sm text-primary">기도제목이 등록되었습니다.</p>}

            <button type="submit" disabled={isPending} className="btn">
                {isPending ? '등록 중...' : '기도제목 등록'}
            </button>
        </form>
    );
}
