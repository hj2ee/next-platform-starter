import { PrayerNav } from './components/prayer-nav';
import { OwnerBadge } from './components/owner-badge';
import { isOwnerAction } from './actions';

export const metadata = {
    title: '기도제목 노트'
};

export default async function PrayersLayout({ children }) {
    const isOwner = await isOwnerAction();

    return (
        <div className="flex flex-col gap-6 pb-16">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <PrayerNav />
                <OwnerBadge isOwner={isOwner} />
            </div>
            {children}
        </div>
    );
}
