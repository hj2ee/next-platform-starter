import Link from 'next/link';
import { Card } from 'components/card';
import { Alert } from 'components/alert';
import { SubmitButton } from 'components/submit-button';
import { loginAction } from 'lib/auth-actions';

export const metadata = { title: '로그인' };

export default async function LoginPage({ searchParams }) {
    const { error } = (await searchParams) || {};

    return (
        <div className="max-w-md py-12 mx-auto">
            <h1 className="mb-2 text-2xl">커넥트 로그인</h1>
            <p className="mb-8 text-neutral-300">오늘의 문제를 풀러 가볼까요?</p>
            {error && (
                <Alert type="error" className="mb-6">
                    {error}
                </Alert>
            )}
            <Card>
                <form action={loginAction} className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-bold">아이디</span>
                        <input name="username" className="input" required />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-bold">비밀번호</span>
                        <input name="password" type="password" className="input" required />
                    </label>
                    <SubmitButton text="로그인" />
                </form>
            </Card>
            <p className="mt-6 text-sm text-neutral-300">
                아직 계정이 없으신가요?{' '}
                <Link href="/signup" className="text-white">
                    가입하기
                </Link>
            </p>
        </div>
    );
}
