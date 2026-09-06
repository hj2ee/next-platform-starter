'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addCategoryAction } from '../actions';

export function AddCategoryForm() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    function submit(e) {
        e.preventDefault();
        setError('');
        startTransition(async () => {
            const res = await addCategoryAction(name);
            if (res.success) {
                setName('');
                router.refresh();
            } else {
                setError(res.error);
            }
        });
    }

    return (
        <form onSubmit={submit} className="flex flex-wrap items-center gap-2">
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="새 카테고리 이름"
                className="input"
                style={{ maxWidth: '12rem' }}
            />
            <button type="submit" disabled={isPending} className="btn" style={{ '--btn-py': '0.625rem', '--btn-font-size': '0.8rem' }}>
                추가
            </button>
            {error && <p className="text-xs text-rose-400">{error}</p>}
        </form>
    );
}
