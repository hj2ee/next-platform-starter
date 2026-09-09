'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { getSecurityQuestionAction, resetPasswordAction } from '../actions';

export function ForgotPasswordForm() {
    const [step, setStep] = useState('username');
    const [username, setUsername] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    function submitUsername(e) {
        e.preventDefault();
        setError('');
        startTransition(async () => {
            const res = await getSecurityQuestionAction(username);
            if (res.success) {
                setQuestion(res.question);
                setStep('answer');
            } else {
                setError(res.error);
            }
        });
    }

    function submitAnswer(e) {
        e.preventDefault();
        setError('');
        if (newPassword !== confirmPassword) {
            setError('비밀번호가 서로 일치하지 않습니다.');
            return;
        }
        startTransition(async () => {
            const res = await resetPasswordAction({ username, answer, newPassword });
            if (res.success) {
                setStep('done');
            } else {
                setError(res.error);
            }
        });
    }

    if (step === 'done') {
        return (
            <div className="flex flex-col gap-3 text-center">
                <p className="text-primary">비밀번호가 변경되었습니다.</p>
                <Link href="/prayers/login" className="btn">
                    로그인하러 가기
                </Link>
            </div>
        );
    }

    if (step === 'answer') {
        return (
            <form onSubmit={submitAnswer} className="flex flex-col gap-3">
                <p className="text-sm text-neutral-300">{question}</p>
                <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="답" className="input" />
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="새 비밀번호 (4자 이상)"
                    className="input"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="새 비밀번호 확인"
                    className="input"
                />
                {error && <p className="text-sm text-rose-400">{error}</p>}
                <button type="submit" disabled={isPending} className="btn">
                    {isPending ? '확인 중...' : '비밀번호 재설정'}
                </button>
            </form>
        );
    }

    return (
        <form onSubmit={submitUsername} className="flex flex-col gap-3">
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디"
                autoComplete="username"
                className="input"
            />
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button type="submit" disabled={isPending} className="btn">
                {isPending ? '확인 중...' : '다음'}
            </button>
        </form>
    );
}
