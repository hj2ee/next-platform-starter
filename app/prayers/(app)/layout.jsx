import { redirect } from 'next/navigation';
import { currentUserAction } from '../actions';
import { PrayerNav } from '../components/prayer-nav';
import { UserMenu } from '../components/user-menu';

export const metadata = {
    title: '기도제목 노트'
};

export default async function AppLayout({ children }) {
    const user = await currentUserAction();
    if (!user) redirect('/prayers/login');

    return (
        <div className="flex flex-col gap-6 pb-16">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <PrayerNav />
                <UserMenu username={user.username} />
            </div>
            {children}
            <div className="pt-5 mt-4 border-t border-dashed border-white/10">
                <p className="text-sm italic text-neutral-400">
                    &ldquo;쉬지 말고 기도하라&rdquo;{' '}
                    <span className="text-xs not-italic text-neutral-600">— 데살로니가전서 5:17</span>
                </p>
                <p className="mt-2 text-xs leading-relaxed text-neutral-600">
                    이 기도제목 사이트는 본인만 사용 가능하며, 타인은 열람할 수 없습니다.
                </p>
            </div>
        </div>
    );
}
