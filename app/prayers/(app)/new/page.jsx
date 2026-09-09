import { Card } from 'components/card';
import { listCategoriesAction } from '../../actions';
import { NewPrayerForm } from '../../components/new-prayer-form';

export const metadata = { title: '새 기도제목 | 기도제목 노트' };

export default async function NewPrayerPage() {
    const categories = await listCategoriesAction();

    return (
        <div className="max-w-lg mx-auto">
            <h1 className="mb-6">새 기도제목</h1>
            <Card>
                <NewPrayerForm categories={categories} redirectTo="/prayers" />
            </Card>
        </div>
    );
}
