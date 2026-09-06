import { Card } from 'components/card';
import { listCategoriesAction } from '../actions';
import { NewPrayerForm } from '../components/new-prayer-form';

export const metadata = { title: '기도제목 나누기 | 기도제목 노트' };

export default async function SharePrayerPage() {
    const categories = await listCategoriesAction();

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="mb-2">기도제목 나누기</h1>
            <p className="mb-6 text-sm text-neutral-400">
                이 링크로 오신 분은 누구나 본인의 기도제목을 남길 수 있어요. 함께 기도해요 🙏
            </p>
            <Card>
                <NewPrayerForm categories={categories} authorType="visitor" />
            </Card>
        </div>
    );
}
