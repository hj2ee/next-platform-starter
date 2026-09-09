'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { signupAction } from '../actions';

export function SignupForm() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    function submit(e) {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError('비밀번호가 서로 일치하지 않습니다.');
            return;
        }
        startTransition(async () => {
            const res = await signupAction({ username, password, question, answer });
            if (res.success) {
                router.push('/prayers');
                router.refresh();
            } else {
                setError(res.error);
            }
        });
    }

    return (
        <form onSubmit={submit} className="flex flex-col gap-3">
            <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디 (영문 소문자/숫자, 3~20자)"
                autoComplete="username"
                className="input"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호 (4자 이상)"
                autoComplete="new-password"
                className="input"
            />
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="비밀번호 확인"
                autoComplete="new-password"
                className="input"
            />
            <hr className="my-1 border-neutral-700" />
            <p className="text-xs text-neutral-400">비밀번호를 잊었을 때 본인 확인용으로 쓰일 질문과 답이에요.</p>
            <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="나만의 질문 (예: 어릴 적 별명은?)"
                className="input"
            />
            <input value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="답" className="input" />

            {error && <p className="text-sm text-rose-400">{error}</p>}

            <button type="submit" disabled={isPending} className="btn">
                {isPending ? '가입 중...' : '계정 만들기'}
            </button>
        </form>
    );
}
