'use client';

import { useState, useTransition } from 'react';
import { changePasswordAction } from '../actions';

export function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [isPending, startTransition] = useTransition();

    function submit(e) {
        e.preventDefault();
        setError('');
        setSuccess(false);
        if (newPassword !== confirmPassword) {
            setError('새 비밀번호가 서로 일치하지 않습니다.');
            return;
        }
        startTransition(async () => {
            const res = await changePasswordAction({ currentPassword, newPassword });
            if (res.success) {
                setSuccess(true);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError(res.error);
            }
        });
    }

    return (
        <form onSubmit={submit} className="flex flex-col gap-3">
            <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="현재 비밀번호"
                autoComplete="current-password"
                className="input"
            />
            <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="새 비밀번호 (4자 이상)"
                autoComplete="new-password"
                className="input"
            />
            <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="새 비밀번호 확인"
                autoComplete="new-password"
                className="input"
            />
            {error && <p className="text-sm text-rose-400">{error}</p>}
            {success && <p className="text-sm text-primary">비밀번호가 변경되었습니다.</p>}
            <button type="submit" disabled={isPending} className="btn">
                {isPending ? '변경 중...' : '비밀번호 변경'}
            </button>
        </form>
    );
}
