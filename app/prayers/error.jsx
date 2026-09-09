'use client';

import Link from 'next/link';

export default function PrayersError({ error, reset }) {
    const needsLogin = /로그인이 필요/.test(error?.message || '');

    return (
        <div className="max-w-lg py-16 mx-auto text-center">
            <h1 className="mb-4">문제가 발생했어요</h1>
            {needsLogin ? (
                <p className="text-neutral-400">로그인이 만료되었어요. 다시 로그인해 주세요.</p>
            ) : (
                <p className="text-neutral-400">{error?.message || '알 수 없는 오류가 발생했습니다.'}</p>
            )}
            <div className="flex justify-center gap-3 mt-6">
                {needsLogin ? (
                    <Link href="/prayers/login" className="btn">
                        로그인하러 가기
                    </Link>
                ) : (
                    <button onClick={reset} className="btn">
                        다시 시도
                    </button>
                )}
            </div>
        </div>
    );
}
