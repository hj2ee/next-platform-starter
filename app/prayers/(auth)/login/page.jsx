import Link from 'next/link';
import { Card } from 'components/card';
import { LoginForm } from '../../components/login-form';

export const metadata = { title: '로그인 | 기도제목 노트' };

export default function LoginPage() {
    return (
        <div>
            <h1 className="mb-1 text-center">기도제목 노트</h1>
            <p className="mb-6 text-sm text-center text-neutral-400">나만의 기도 노트에 로그인하세요</p>
            <Card>
                <LoginForm />
            </Card>
            <div className="flex items-center justify-between mt-4 text-xs">
                <Link href="/prayers/forgot-password" className="text-neutral-400">
                    비밀번호를 잊으셨나요?
                </Link>
                <Link href="/prayers/signup" className="text-neutral-400">
                    계정 만들기
                </Link>
            </div>
        </div>
    );
}
