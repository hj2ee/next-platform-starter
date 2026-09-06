'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { categoryStyle } from '../constants';

export function CategoryFilter({ categories }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const selected = new Set((searchParams.get('category') || '').split(',').filter(Boolean));

    function toggle(category) {
        const next = new Set(selected);
        if (next.has(category)) {
            next.delete(category);
        } else {
            next.add(category);
        }
        const params = new URLSearchParams(searchParams.toString());
        if (next.size) {
            params.set('category', Array.from(next).join(','));
        } else {
            params.delete('category');
        }
        const query = params.toString();
        router.push(query ? `${pathname}?${query}` : pathname);
    }

    if (!categories?.length) return null;

    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
                const style = categoryStyle(category);
                const active = selected.has(category);
                return (
                    <label
                        key={category}
                        className={
                            'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full cursor-pointer transition select-none ' +
                            (active ? style.badge : 'bg-white/5 text-neutral-400 ring-1 ring-white/10 hover:bg-white/10')
                        }
                    >
                        <input type="checkbox" checked={active} onChange={() => toggle(category)} className="hidden" />
                        {active ? '✓ ' : ''}
                        {category}
                    </label>
                );
            })}
        </div>
    );
}
