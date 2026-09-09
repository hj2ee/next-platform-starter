'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const TABS = [
    { href: '/prayers', label: '홈' },
    { href: '/prayers/category', label: '카테고리별' },
    { href: '/prayers/date', label: '날짜별' },
    { href: '/prayers/dashboard', label: '대시보드' }
];

export function PrayerNav() {
    const pathname = usePathname();

    return (
        <nav className="flex flex-wrap gap-2">
            {TABS.map((tab) => {
                const active = tab.href === '/prayers' ? pathname === '/prayers' : pathname.startsWith(tab.href);
                return (
                    <Link
                        key={tab.href}
                        href={tab.href}
                        className={
                            'px-3 py-1.5 text-sm rounded-full no-underline transition ' +
                            (active
                                ? 'bg-primary text-primary-content font-bold'
                                : 'bg-white/5 text-neutral-300 hover:bg-white/10')
                        }
                    >
                        {tab.label}
                    </Link>
                );
            })}
        </nav>
    );
}
