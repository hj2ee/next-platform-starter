import { redirect } from 'next/navigation';
import { currentUserAction } from '../actions';

export const metadata = {
    title: '기도제목 노트'
};

export default async function AuthLayout({ children }) {
    const user = await currentUserAction();
    if (user) redirect('/prayers');

    return <div className="max-w-sm py-12 mx-auto">{children}</div>;
}
