import Link from 'next/link';
import { logoutAction } from 'lib/auth-actions';

export function GuidebookNav({ teacher, active }) {
    const items = [
        { href: '/today', label: '오늘의 문제', key: 'today' },
        { href: '/board', label: '이 문제 게시판', key: 'board' },
        { href: '/me', label: '내 답변', key: 'me' }
    ];
    if (teacher?.isAdmin) items.push({ href: '/manage', label: '운영자', key: 'manage' });

    return (
        <div className="flex flex-wrap items-center gap-4 pb-6 mb-8 border-b border-white/20">
            <span className="font-bold">커넥트 실전 가이드북</span>
            <ul className="flex flex-wrap gap-x-1 gap-y-1">
                {items.map((item) => (
                    <li key={item.key}>
                        <Link
                            href={item.href}
                            className={[
                                'inline-flex px-3 py-2 rounded-sm no-underline',
                                active === item.key ? 'bg-primary text-primary-content font-bold' : 'hover:bg-white/10'
                            ].join(' ')}
                        >
                            {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
            <div className="flex items-center gap-3 ml-auto text-sm">
                {teacher && (
                    <>
                        <span>{teacher.nickname}님 · 연속 {teacher.streak || 0}일 · 총 {teacher.totalAnswers || 0}개</span>
                        <form action={logoutAction}>
                            <button type="submit" className="underline hover:opacity-80">
                                로그아웃
                            </button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}
