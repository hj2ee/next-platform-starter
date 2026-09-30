'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitAnswerAction } from 'lib/answer-actions';
import { MIN_ANSWER_LENGTH } from 'lib/questions';

function SubmitBtn({ done }) {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className="btn" disabled={pending}>
            {pending ? '저장 중...' : done ? '다시 저장하기' : '제출하기'}
        </button>
    );
}

export function AnswerForm({ date, question, initialContent, done }) {
    const [content, setContent] = useState(initialContent || '');
    const trimmedLength = content.trim().length;
    const remaining = Math.max(0, MIN_ANSWER_LENGTH - trimmedLength);

    return (
        <form action={submitAnswerAction} className="flex flex-col gap-3">
            <input type="hidden" name="date" value={date} />
            <input type="hidden" name="area" value={question.area} />
            <input type="hidden" name="areaLabel" value={question.areaLabel} />
            <input type="hidden" name="questionId" value={question.id} />
            <input type="hidden" name="questionText" value={question.text} />
            <textarea
                name="content"
                className="input min-h-32"
                placeholder="어떤 상황이었고, 실제로 어떻게 했는지 적어주세요. 정답은 하나가 아니에요."
                value={content}
                onChange={(event) => setContent(event.target.value)}
                required
            />
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className={remaining > 0 ? 'text-rose-300' : 'text-primary'}>
                    {remaining > 0 ? `${remaining}자 더 적어주세요` : `${trimmedLength}자 · 제출 가능`}
                </span>
                <SubmitBtn done={done} />
            </div>
        </form>
    );
}
