'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logoutAction } from '../actions';

export function UserMenu({ username }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    function logout() {
        startTransition(async () => {
            await logoutAction();
            router.push('/prayers/login');
            router.refresh();
        });
    }

    return (
        <div className="flex items-center gap-2">
            <span className="hidden text-xs text-neutral-500 sm:inline">{username}</span>
            <Link
                href="/prayers/settings"
                className="px-3 py-1.5 text-xs rounded-full no-underline bg-white/5 text-neutral-300 hover:bg-white/10 transition"
            >
                설정
            </Link>
            <button
                onClick={logout}
                disabled={isPending}
                className="px-3 py-1.5 text-xs rounded-full bg-white/5 text-neutral-300 hover:bg-white/10 transition"
            >
                로그아웃
            </button>
        </div>
    );
}
