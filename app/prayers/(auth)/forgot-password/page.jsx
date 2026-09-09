import Link from 'next/link';
import { Card } from 'components/card';
import { ForgotPasswordForm } from '../../components/forgot-password-form';

export const metadata = { title: '비밀번호 찾기 | 기도제목 노트' };

export default function ForgotPasswordPage() {
    return (
        <div>
            <h1 className="mb-1 text-center">비밀번호 찾기</h1>
            <p className="mb-6 text-sm text-center text-neutral-400">가입 때 등록한 질문에 답하고 새 비밀번호를 설정하세요</p>
            <Card>
                <ForgotPasswordForm />
            </Card>
            <div className="mt-4 text-xs text-center">
                <Link href="/prayers/login" className="text-neutral-400">
                    로그인으로 돌아가기
                </Link>
            </div>
        </div>
    );
}
