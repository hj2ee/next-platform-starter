'use client';

export default function PrayersError({ error, reset }) {
    const isBlobsError = error?.name === 'MissingBlobsEnvironmentError' || /blob/i.test(error?.message || '');

    return (
        <div className="max-w-lg py-16 mx-auto text-center">
            <h1 className="mb-4">문제가 발생했어요</h1>
            {isBlobsError ? (
                <p className="text-neutral-400">
                    데이터 저장소(Netlify Blobs)에 연결할 수 없어요. 로컬에서 테스트하려면 <code>netlify dev</code>로
                    실행해 주세요. Netlify에 배포된 사이트에서는 자동으로 동작합니다.
                </p>
            ) : (
                <p className="text-neutral-400">{error?.message || '알 수 없는 오류가 발생했습니다.'}</p>
            )}
            <button onClick={reset} className="mt-6 btn">
                다시 시도
            </button>
        </div>
    );
}
