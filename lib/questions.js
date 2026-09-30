export const AREAS = [
    { id: 'guide', label: '지도법 실무', color: '#2F6F8F' },
    { id: 'ops', label: '운영 실무', color: '#9C6B0B' },
    { id: 'comm', label: '소통 실무', color: '#3F7D5C' },
    { id: 'crisis', label: '위기관리', color: '#C24A17' }
];

const BANK = {
    guide: [
        { tag: '영유아', text: '낯가림이 심해서 수업 내내 부모 품에서 안 떨어지려는 아이, 어떻게 적응시키나?' },
        { tag: '영유아', text: '수업 중 화장실 실수를 한 아이, 반 전체 앞에서 어떻게 처리하나?' },
        { tag: '유소년', text: '승부욕이 너무 강해서 지면 울고 화내는 아이, 어떻게 다루나?' },
        { tag: '유소년', text: '친구를 은근히 따돌리거나 괴롭히는 걸 목격했다, 어떻게 개입하나?' },
        { tag: '청소년', text: '사춘기 특유의 무기력함으로 아예 참여를 안 하려는 아이, 어떻게 끌어들이나?' },
        { tag: '청소년', text: '강사를 은근히 무시하거나 반항하는 아이, 권위를 어떻게 세우나?' },
        { tag: '성인', text: '오랜만에 운동하는 성인이 첫날부터 무리해서 다칠 뻔했다, 어떻게 제지하나?' },
        { tag: '성인', text: '직장인반, 야근으로 자주 빠지는 회원의 동기부여를 어떻게 유지하나?' },
        { tag: '특수', text: '감각이 예민해서 특정 소리·촉감에 갑자기 패닉하는 아이, 어떻게 진정시키나?' },
        { tag: '특수', text: '다른 일반 학생들과 통합 수업할 때 특수 아동을 어떻게 자연스럽게 포함시키나?' }
    ],
    ops: [
        { text: '거래처(센터)가 계약과 다른 조건을 갑자기 요구한다. 어떻게 대응할까?' },
        { text: '여러 거래처 스케줄이 겹쳤을 때 나만의 조율 기준은?' },
        { text: '3.3% 사업소득과 4대보험 중 뭘 기준으로 선택하나?' },
        { text: '용역계약서에 반드시 넣어야 한다고 생각하는 조항은?' },
        { text: '급여가 약속한 날짜보다 늦게 들어왔다. 어떻게 이야기를 꺼낼까?' },
        { text: '갑자기 폐업·휴업하는 센터를 만났을 때 제일 먼저 확인하는 건?' },
        { text: '세금 신고할 때 강사들이 가장 많이 놓치는 부분은?' }
    ],
    comm: [
        { text: '학부모가 근거 없이 컴플레인을 걸어올 때, 첫 마디를 어떻게 시작하나?' },
        { text: '아이의 문제행동을 학부모에게 전할 때 나만의 화법은?' },
        { text: '수업 중 다친 아이의 학부모에게 첫 전화, 어떻게 시작하나?' },
        { text: '자신 없는 주제로 상담 요청이 왔을 때 어떻게 답하나?' },
        { text: '사고·컴플레인 이후 후속 조치, 언제 어떤 방식으로 하나?' },
        { text: '학부모가 다른 강사와 비교하며 불만을 제기할 때 어떻게 반응하나?' },
        { text: '신뢰를 잃었던 학부모와의 관계를 회복해본 경험, 그 시작은 뭐였나?' }
    ],
    crisis: [
        { text: '수업 중 아이가 코피가 났다. 순서대로 뭘 하나?' },
        { text: '갑자기 아이가 안 보인다(미아 상황). 첫 30초에 뭘 하나?' },
        { text: '폭우·폭염 등 날씨로 휴강을 결정하는 나만의 기준은?' },
        { text: '아이가 크게 다쳐 응급처치가 필요하다. 순서를 말해본다면?' },
        { text: '시설·기구 결함을 발견했다. 바로 뭘 하나?' },
        { text: '사고 발생 후 보고서(기록)는 언제, 어떻게 작성하나?' },
        { text: '낯선 사람이 수업 중인 아이에게 접근했다. 어떻게 대응하나?' }
    ]
};

const ANCHOR = Date.UTC(2026, 0, 1); // arbitrary fixed anchor so the rotation is stable over time

export function todayDateString(date = new Date()) {
    // Asia/Seoul day boundary, since the crew and the morning KakaoTalk nudge are KST
    return new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
}

function dayIndex(dateStr) {
    const d = Date.parse(`${dateStr}T00:00:00Z`);
    return Math.floor((d - ANCHOR) / 86400000);
}

export function getQuestionsForDate(dateStr) {
    const idx = dayIndex(dateStr);
    return AREAS.map((area) => {
        const list = BANK[area.id];
        const qIndex = ((idx % list.length) + list.length) % list.length;
        const q = list[qIndex];
        return {
            id: `${area.id}-${qIndex}`,
            area: area.id,
            areaLabel: area.label,
            color: area.color,
            tag: q.tag || null,
            text: q.text
        };
    });
}

export const MIN_ANSWER_LENGTH = 20;
