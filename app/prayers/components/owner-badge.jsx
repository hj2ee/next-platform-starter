'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { unlockOwnerAction, lockOwnerAction } from '../actions';

export function OwnerBadge({ isOwner }) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    function submit(e) {
        e.preventDefault();
        setError('');
        startTransition(async () => {
            const res = await unlockOwnerAction(pin);
            if (res.success) {
                setOpen(false);
                setPin('');
                router.refresh();
            } else {
                setError(res.error);
            }
        });
    }

    function logout() {
        startTransition(async () => {
            await lockOwnerAction();
            router.refresh();
        });
    }

    if (isOwner) {
        return (
            <button
                onClick={logout}
                disabled={isPending}
                className="px-3 py-1.5 text-xs rounded-full no-underline bg-primary/15 text-primary ring-1 ring-primary/30 hover:bg-primary/25 transition"
            >
                🔓 본인 모드 · 잠그기
            </button>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className="px-3 py-1.5 text-xs rounded-full no-underline bg-white/5 text-neutral-300 ring-1 ring-white/10 hover:bg-white/10 transition"
            >
                🔒 본인 인증
            </button>
            {open && (
                <form
                    onSubmit={submit}
                    className="absolute right-0 z-10 flex flex-col w-56 gap-2 p-3 mt-2 rounded-lg shadow-xl bg-neutral-900 ring-1 ring-neutral-700"
                >
                    <label className="text-xs text-neutral-400">PIN 입력</label>
                    <input
                        type="password"
                        inputMode="numeric"
                        autoFocus
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        className="input"
                    />
                    {error && <p className="text-xs text-rose-400">{error}</p>}
                    <button type="submit" disabled={isPending} className="btn" style={{ '--btn-py': '0.5rem', '--btn-font-size': '0.75rem' }}>
                        {isPending ? '확인 중...' : '잠금 해제'}
                    </button>
                </form>
            )}
        </div>
    );
}
