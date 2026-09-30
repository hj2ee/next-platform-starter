'use client';

import { useFormStatus } from 'react-dom';
import { toggleLikeAction } from 'lib/answer-actions';

function Btn({ likedByMe, count }) {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className={[
                'px-2 py-1 text-xs rounded-full border',
                likedByMe ? 'bg-primary text-primary-content border-primary' : 'border-white/20 hover:bg-white/10'
            ].join(' ')}
        >
            👍 {count}
        </button>
    );
}

export function LikeButton({ date, area, author, likedByMe, count }) {
    return (
        <form action={toggleLikeAction}>
            <input type="hidden" name="date" value={date} />
            <input type="hidden" name="area" value={area} />
            <input type="hidden" name="author" value={author} />
            <Btn likedByMe={likedByMe} count={count} />
        </form>
    );
}
