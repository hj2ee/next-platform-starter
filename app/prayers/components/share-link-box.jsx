'use client';

import { useEffect, useState } from 'react';

export function ShareLinkBox() {
    const [url, setUrl] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setUrl(`${window.location.origin}/prayers/share`);
    }, []);

    async function copy() {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    }

    if (!url) return null;

    return (
        <div className="flex flex-wrap items-center gap-3 p-3 text-sm rounded-lg bg-white/5 ring-1 ring-white/10">
            <span className="text-neutral-400">공유 링크</span>
            <code className="flex-1 min-w-0 px-2 py-1 overflow-x-auto text-xs rounded bg-neutral-900 text-neutral-200 whitespace-nowrap">
                {url}
            </code>
            <button
                onClick={copy}
                className="px-3 py-1.5 text-xs rounded-full no-underline bg-primary/15 text-primary ring-1 ring-primary/30 hover:bg-primary/25 transition"
            >
                {copied ? '복사됨!' : '링크 복사'}
            </button>
        </div>
    );
}
