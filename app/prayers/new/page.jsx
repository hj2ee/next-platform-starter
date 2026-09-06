import { Card } from 'components/card';
import { isOwnerAction, listCategoriesAction } from '../actions';
import { NewPrayerForm } from '../components/new-prayer-form';

export const metadata = { title: '새 기도제목 | 기도제목 노트' };

export default async function NewPrayerPage() {
    const [isOwner, categories] = await Promise.all([isOwnerAction(), listCategoriesAction()]);

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="mb-6">새 기도제목</h1>
            {isOwner ? (
                <Card>
                    <NewPrayerForm categories={categories} authorType="owner" redirectTo="/prayers" />
                </Card>
            ) : (
                <Card>
                    <p className="text-neutral-600">
                        본인만 이 화면에서 기도제목을 작성할 수 있어요. 오른쪽 위 &ldquo;본인 인증&rdquo; 버튼으로 PIN을
                        입력해 주세요.
                    </p>
                </Card>
            )}
        </div>
    );
}
