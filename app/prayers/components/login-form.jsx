'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { loginAction } from '../actions';

export function LoginForm() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isPending, startTransition] = useTransition();

    function submit(e) {
        e.preventDefault();
        setError('');
        startTransition(async () => {
            const res = await loginAction({ username, password });
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
                placeholder="아이디"
                autoComplete="username"
                className="input"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                autoComplete="current-password"
                className="input"
            />
            {error && <p className="text-sm text-rose-400">{error}</p>}
            <button type="submit" disabled={isPending} className="btn">
                {isPending ? '로그인 중...' : '로그인'}
            </button>
        </form>
    );
}
