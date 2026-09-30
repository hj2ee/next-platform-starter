import Link from 'next/link';
import { Card } from 'components/card';
import { Alert } from 'components/alert';
import { SubmitButton } from 'components/submit-button';
import { signupAction } from 'lib/auth-actions';

export const metadata = { title: '가입하기' };

export default async function SignupPage({ searchParams }) {
    const { error } = (await searchParams) || {};

    return (
        <div className="max-w-md py-12 mx-auto">
            <h1 className="mb-2 text-2xl">커넥트 가입하기</h1>
            <p className="mb-8 text-neutral-300">
                오늘의 문제에 답하려면 먼저 계정을 만들어주세요. 아이디는 나중에 답변 작성자로 표시됩니다.
            </p>
            {error && (
                <Alert type="error" className="mb-6">
                    {error}
                </Alert>
            )}
            <Card>
                <form action={signupAction} className="flex flex-col gap-4">
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-bold">아이디</span>
                        <input name="username" className="input" placeholder="영문·숫자 3~20자" required />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-bold">비밀번호</span>
                        <input name="password" type="password" className="input" placeholder="4자 이상" required />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-bold">닉네임</span>
                        <input name="nickname" className="input" placeholder="다른 선생님들에게 보일 이름" required />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="text-sm font-bold">주로 지도하는 대상 (선택)</span>
                        <select name="ageGroup" className="input" defaultValue="">
                            <option value="">선택 안 함</option>
                            <option value="영유아">영유아</option>
                            <option value="유소년">유소년</option>
                            <option value="청소년">청소년</option>
                            <option value="성인">성인</option>
                            <option value="특수">특수체육</option>
                        </select>
                    </label>
                    <SubmitButton text="가입하고 시작하기" />
                </form>
            </Card>
            <p className="mt-6 text-sm text-neutral-300">
                이미 계정이 있으신가요?{' '}
                <Link href="/login" className="text-white">
                    로그인
                </Link>
            </p>
        </div>
    );
}
