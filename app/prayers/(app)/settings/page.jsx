import { Card } from 'components/card';
import { currentUserAction } from '../../actions';
import { ChangePasswordForm } from '../../components/change-password-form';

export const metadata = { title: '설정 | 기도제목 노트' };

export default async function SettingsPage() {
    const user = await currentUserAction();

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="mb-1">개인 설정</h1>
            <p className="mb-6 text-sm text-neutral-400">아이디: {user.username}</p>
            <Card title="비밀번호 변경">
                <ChangePasswordForm />
            </Card>
        </div>
    );
}
