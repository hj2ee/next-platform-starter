'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { updatePrayerAnswerAction, incrementPrayerCountAction, deletePrayerAction } from '../actions';
import { categoryStyle, formatDateTime } from '../constants';

export function PrayerCard({ prayer }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [editingAnswer, setEditingAnswer] = useState(false);
    const [draft, setDraft] = useState(prayer.answerContent || '');
    const [answered, setAnswered] = useState(prayer.answered);
    const [answerContent, setAnswerContent] = useState(prayer.answerContent || '');
    const [prayerCount, setPrayerCount] = useState(prayer.prayerCount || 0);
    const style = categoryStyle(prayer.category);

    function toggleAnswered(next) {
        setAnswered(next);
        if (next) {
            setEditingAnswer(true);
        } else {
            setAnswerContent('');
            setEditingAnswer(false);
        }
        startTransition(async () => {
            await updatePrayerAnswerAction(prayer.id, { answered: next, answerContent: next ? draft : '' });
            if (!next) {
                router.refresh();
            }
        });
    }

    function saveAnswer() {
        startTransition(async () => {
            await updatePrayerAnswerAction(prayer.id, { answered: true, answerContent: draft });
            setAnswerContent(draft);
            setEditingAnswer(false);
            router.refresh();
        });
    }

    function tapPray() {
        setPrayerCount((c) => c + 1);
        startTransition(async () => {
            await incrementPrayerCountAction(prayer.id);
            router.refresh();
        });
    }

    function remove() {
        if (!confirm('이 기도제목을 삭제할까요?')) return;
        startTransition(async () => {
            await deletePrayerAction(prayer.id);
            router.refresh();
        });
    }

    function startEditing() {
        setDraft(answerContent || '');
        setEditingAnswer(true);
    }

    return (
        <div className="p-4 rounded-lg bg-white/5 ring-1 ring-white/10">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${style.badge}`}>{prayer.category}</span>
                    <span className="text-xs text-neutral-400">{formatDateTime(prayer.createdAt)}</span>
                </div>
                <button onClick={remove} disabled={isPending} className="text-xs text-neutral-500 hover:text-rose-400">
                    삭제
                </button>
            </div>

            <p className="mb-3 whitespace-pre-wrap">{prayer.content}</p>

            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={tapPray}
                    disabled={isPending}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-primary/15 text-primary ring-1 ring-primary/30 hover:bg-primary/25 transition"
                >
                    🙏 기도했어요 <span className="font-bold">{prayerCount}</span>
                </button>

                <label className="inline-flex items-center gap-1.5 text-xs cursor-pointer">
                    <input
                        type="checkbox"
                        checked={answered}
                        disabled={isPending}
                        onChange={(e) => toggleAnswered(e.target.checked)}
                        className="w-4 h-4 accent-primary"
                    />
                    응답 받음
                </label>

                {answered && !editingAnswer && (
                    <button onClick={startEditing} className="text-xs underline text-neutral-400">
                        {answerContent ? '응답 내용 수정' : '응답 내용 적기'}
                    </button>
                )}
            </div>

            {answered && editingAnswer && (
                <div className="flex flex-col gap-2 p-3 mt-3 rounded-md bg-neutral-900 ring-1 ring-neutral-700">
                    <textarea
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder="어떻게 응답받으셨는지 적어보세요"
                        rows={3}
                        className="input"
                    />
                    <div className="flex gap-3">
                        <button
                            onClick={saveAnswer}
                            disabled={isPending}
                            className="btn"
                            style={{ '--btn-py': '0.5rem', '--btn-font-size': '0.75rem' }}
                        >
                            저장
                        </button>
                        <button onClick={() => setEditingAnswer(false)} className="text-xs text-neutral-400">
                            취소
                        </button>
                    </div>
                </div>
            )}

            {!editingAnswer && answered && answerContent && (
                <p className="p-3 mt-3 text-sm rounded-md bg-neutral-900/60 text-neutral-300 whitespace-pre-wrap">
                    💬 {answerContent}
                </p>
            )}
        </div>
    );
}
