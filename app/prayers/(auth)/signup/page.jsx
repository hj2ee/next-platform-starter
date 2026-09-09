import Link from 'next/link';
import { Card } from 'components/card';
import { SignupForm } from '../../components/signup-form';

export const metadata = { title: '계정 만들기 | 기도제목 노트' };

export default function SignupPage() {
    return (
        <div>
            <h1 className="mb-1 text-center">계정 만들기</h1>
            <p className="mb-6 text-sm text-center text-neutral-400">나만의 기도 노트를 시작해보세요</p>
            <Card>
                <SignupForm />
            </Card>
            <div className="mt-4 text-xs text-center">
                <Link href="/prayers/login" className="text-neutral-400">
                    이미 계정이 있으신가요? 로그인
                </Link>
            </div>
        </div>
    );
}
