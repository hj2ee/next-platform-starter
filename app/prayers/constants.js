export const DEFAULT_CATEGORIES = ['가족', '개인', '관계'];

const CATEGORY_PALETTE = [
    { badge: 'bg-teal-400/15 text-teal-300 ring-1 ring-teal-400/30', bar: 'bg-teal-400' },
    { badge: 'bg-indigo-400/15 text-indigo-300 ring-1 ring-indigo-400/30', bar: 'bg-indigo-400' },
    { badge: 'bg-rose-400/15 text-rose-300 ring-1 ring-rose-400/30', bar: 'bg-rose-400' },
    { badge: 'bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/30', bar: 'bg-amber-400' },
    { badge: 'bg-sky-400/15 text-sky-300 ring-1 ring-sky-400/30', bar: 'bg-sky-400' },
    { badge: 'bg-fuchsia-400/15 text-fuchsia-300 ring-1 ring-fuchsia-400/30', bar: 'bg-fuchsia-400' },
    { badge: 'bg-lime-400/15 text-lime-300 ring-1 ring-lime-400/30', bar: 'bg-lime-400' },
    { badge: 'bg-orange-400/15 text-orange-300 ring-1 ring-orange-400/30', bar: 'bg-orange-400' }
];

function hashString(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
        hash = (hash << 5) - hash + value.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

export function categoryStyle(category) {
    const index = hashString(category || '') % CATEGORY_PALETTE.length;
    return CATEGORY_PALETTE[index];
}

export function dateKey(isoString) {
    return isoString.slice(0, 10);
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export function formatDateLabel(key) {
    const d = new Date(`${key}T00:00:00`);
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`;
}

export function formatDateCompact(key) {
    const d = new Date(`${key}T00:00:00`);
    return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`;
}

export function formatDateTime(iso) {
    const d = new Date(iso);
    const hours24 = d.getHours();
    const period = hours24 < 12 ? '오전' : '오후';
    const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${period} ${hours12}:${minutes}`;
}

export function groupByDate(prayers) {
    const groups = new Map();
    for (const prayer of prayers) {
        const key = dateKey(prayer.createdAt);
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key).push(prayer);
    }
    return Array.from(groups.entries()).sort((a, b) => (a[0] < b[0] ? 1 : -1));
}
