'use client';

import { useState, useTransition } from 'react';
import { updateTitleAction } from '../actions';

export function EditableTitle({ initialTitle }) {
    const [title, setTitle] = useState(initialTitle);
    const [, startTransition] = useTransition();

    function handleBlur(e) {
        const val = e.target.textContent.replace(/\s+/g, ' ').trim() || '기도제목 노트';
        e.target.textContent = val;
        if (val !== title) {
            setTitle(val);
            startTransition(async () => {
                await updateTitleAction(val);
            });
        }
    }

    return (
        <h1
            contentEditable
            suppressContentEditableWarning
            spellCheck={false}
            onBlur={handleBlur}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.currentTarget.blur();
                }
            }}
            className="outline-none cursor-text border-b border-dashed border-transparent hover:border-neutral-600 focus:border-primary"
        >
            {title}
        </h1>
    );
}
