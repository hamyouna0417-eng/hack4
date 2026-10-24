// 2022 개정 교육과정 기반 과목 카테고리, 메타인지 태그, 에빙하우스 스케줄러 및 출제 위원 변형 엔진 데이터

window.META_KILLER_DATA = {
  // 1. 과목 카테고리 구조 (2022 개정 교육과정 반영) & 과목별 엄격한 변형 출제 원칙(Strict Rules)
  SUBJECT_CATEGORIES: [
    {
      id: "korean",
      name: "국어 영역",
      shortName: "국어",
      icon: "BookOpen",
      color: "rose",
      accentHex: "#f43f5e",
      bgBadge: "bg-rose-500/15 text-rose-400 border-rose-500/30",
      description: "2022 개정 공통국어 및 선택(화법과 언어, 독서와 작문, 문학)",
      strictRule: "지문의 핵심 제재는 유지하되, <보기>의 적용 사례를 바꾸거나 선지의 정오(긍정/부정, 인과관계 역전, 주체 바꿔치기)를 변형하여 문해력을 검증",
      subSubjects: [
        "공통국어",
        "화법과 언어",
        "독서와 작문",
        "문학"
      ],
      trapTemplates: [
        "지문의 선후 관계(원인↔결과)를 정반대로 서술하여 선지 낚시 설계",
        "특정 학자/입장에만 해당하는 조건을 전체 입장의 공통점인 것처럼 주체 바꿔치기",
        "<보기> 적용 사례의 예외 단서 하나를 슬쩍 바꾸어 정반대 결론 유도"
      ]
    },
    {
      id: "math",
      name: "수학 영역",
      shortName: "수학",
      icon: "Sigma",
      color: "indigo",
      accentHex: "#6366f1",
      bgBadge: "bg-indigo-500/15 text-indigo-400 border-indigo-500/30",
      description: "2022 개정 공통수학, 대수, 미적분Ⅰ·Ⅱ, 확률과 통계, 기하",
      strictRule: "문제 해결에 쓰이는 핵심 정리와 논리 구조는 동일하게 유지하되, 함수의 계수, 정의역의 범위, 구해야 하는 최종 값, 또는 주어진 조건의 부호를 변경하여 단순 암기 차단 (LaTeX 수식 적용)",
      subSubjects: [
        "공통수학",
        "대수",
        "미적분Ⅰ·Ⅱ",
        "확률과 통계",
        "기하"
      ],
      trapTemplates: [
        "최고차항의 계수 부호나 정의역 경계(x ≥ 0 등) 등호 조건을 숨겨 케이스 분류 유도",
        "절댓값 함수 |f(x) - k|의 미분가능성에서 중근/삼중근 위치를 착각하게 설계",
        "구하는 최종 값이 a가 아니라 f(a) 또는 10p+q 형태인데 마지막 대입에서 실수 유도"
      ]
    },
    {
      id: "english",
      name: "영어 영역",
      shortName: "영어",
      icon: "Languages",
      color: "amber",
      accentHex: "#f59e0b",
      bgBadge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      description: "2022 개정 공통영어, 영어Ⅰ·Ⅱ, 영어 독해와 작문",
      strictRule: "원문 지문의 맥락을 기반으로 빈칸 추론의 위치를 핵심 어구로 이동하거나, 어법 포인트 변형, 또는 문장 삽입/순서 배열 형태로 문제 유형을 비틀어 출제",
      subSubjects: [
        "공통영어",
        "영어Ⅰ·Ⅱ",
        "영어 독해와 작문"
      ],
      trapTemplates: [
        "빈칸 직전 문장에 이중 부정(not without, hardly any)을 배치해 글의 방향 착각 유도",
        "빈칸 위치를 반대절로 이동시키거나 문장 삽입/순서 배열 지시어(this/such) 연결 고리 함정 설계",
        "지문 핵심 어휘를 그대로 쓰되 논리적 인과 관계만 반대로 뒤집은 매력적 오답 선지"
      ]
    },
    {
      id: "social",
      name: "사회 영역",
      shortName: "사회",
      icon: "Globe",
      color: "emerald",
      accentHex: "#10b981",
      bgBadge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      description: "통합사회1·2, 일반/진로 선택(윤리, 지리, 역사, 일반사회 계열)",
      strictRule: "핵심 개념과 자료(표, 그래프 조건)의 수치를 변형하고, ㄱ·ㄴ·ㄷ 합답형 선지에서 학생이 낚이기 쉬운 예외 조건이나 비례/반비례·비판 주체 관계를 반대로 출제",
      subSubjects: [
        "통합사회1·2",
        "일반/진로 선택 (윤리 계열)",
        "일반/진로 선택 (지리 계열)",
        "일반/진로 선택 (역사 계열)",
        "일반/진로 선택 (일반사회 계열)"
      ],
      trapTemplates: [
        "ㄱ·ㄴ·ㄷ 합답형 선지에서 '갑이 을에게 제기할 비판'과 '을이 갑에게 제기할 비판' 주체 뒤바꾸기",
        "표·통계 자료에서 '비율(%)'과 '절댓값(크기)'의 비례/반비례 관계를 혼동하도록 선지 구성",
        "예외 조건이 성립하는 구간을 ㄱ·ㄴ·ㄷ 선지 중 하나에 숨겨 2개 조합 선지 함정 설계"
      ]
    },
    {
      id: "science",
      name: "과학 영역",
      shortName: "과학",
      icon: "Atom",
      color: "cyan",
      accentHex: "#06b6d4",
      bgBadge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
      description: "통합과학1·2, 일반/진로 선택(물리학, 화학, 생명과학, 지구과학 계열)",
      strictRule: "핵심 개념과 자료(표, 그래프 조건)의 수치를 변형하고, ㄱ·ㄴ·ㄷ 합답형 선지에서 학생이 낚이기 쉬운 예외 조건(한계 반응물 전환 등)이나 비례/반비례 관계를 반대로 질문",
      subSubjects: [
        "통합과학1·2",
        "일반/진로 선택 (물리학 계열)",
        "일반/진로 선택 (화학 계열)",
        "일반/진로 선택 (생명과학 계열)",
        "일반/진로 선택 (지구과학 계열)"
      ],
      trapTemplates: [
        "화학 반응 양적 관계에서 한계 반응물이 바뀌는 변곡점 구간을 숨기고 ㄱ·ㄴ·ㄷ 합답형으로 질문",
        "밀도·부피·몰수 간의 비례/반비례 관계를 역전시켜 ㄷ 선지에서 오답 유도",
        "유전 가계도/역학 그래프에서 수치 조건을 바꾸어 예외 케이스 판별 요구"
      ]
    },
    {
      id: "etc",
      name: "기타 영역 (확장·커스텀)",
      shortName: "기타/커스텀",
      icon: "FolderPlus",
      color: "purple",
      accentHex: "#a855f7",
      bgBadge: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      description: "한국사, 정보, 제2외국어/한문 및 사용자 직접 생성·편집 커스텀 폴더",
      strictRule: "입력된 사용자 지정 과목의 특성에 맞춰 핵심 키워드 빈칸 추론, 서술형 조건 변형, 또는 개념 판별 퀴즈로 재구성",
      subSubjects: [
        "한국사",
        "정보",
        "제2외국어/한문"
      ],
      trapTemplates: [
        "비슷한 시기 법령/사건의 선후 관계를 1~2년 차이로 배치하여 시대 순 판별 함정 설계",
        "알고리즘/점화식 추적에서 초기값(base case) 또는 종료 조건을 비틀어 결과값 변형",
        "서술형 핵심 키워드 조건 중 필수 포함 조건을 제시하여 개념 정확도 검증"
      ]
    }
  ],

  // 기본 커스텀 과목 폴더 (초기 예시 없음, 사용자가 직접 추가/편집/삭제 가능)
  INITIAL_CUSTOM_FOLDERS: [],

  // 2. 오답 원인 분석 & 메타인지 5대 태그
  METACOGNITION_TAGS: [
    {
      id: "concept_lack",
      label: "개념 부재",
      shortDesc: "핵심 정의·공식·원리를 정확히 숙지하지 못함",
      color: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      activeColor: "bg-rose-600 text-white border-rose-400 ring-2 ring-rose-500/40",
      coachAdvice: "변형 문제를 풀기 전 교과서 정의와 필요충분조건을 먼저 백지에 인출해보세요."
    },
    {
      id: "condition_miss",
      label: "조건 누락",
      shortDesc: "단서 조건(정의역, 양수/정수, 단 ~는 제외)을 놓침",
      color: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      activeColor: "bg-amber-600 text-white border-amber-400 ring-2 ring-amber-500/40",
      coachAdvice: "문제의 모든 단서 조건에 번호(①, ②, ③)를 매기고 풀이 마지막에 미사용 조건이 있는지 점검하세요."
    },
    {
      id: "choice_trap",
      label: "선지 낚시",
      shortDesc: "출제자가 파놓은 매력적인 오답 선지/말장난에 걸림",
      color: "bg-purple-500/20 text-purple-300 border-purple-500/40",
      activeColor: "bg-purple-600 text-white border-purple-400 ring-2 ring-purple-500/40",
      coachAdvice: "선지의 주어·술어 호응과 인과 방향(A→B vs B→A)을 끊어 읽는 습관이 필요합니다."
    },
    {
      id: "calc_mistake",
      label: "계산 실수",
      shortDesc: "식 전개, 부호, 이항, 마지막 구하는 값 대입 실수",
      color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
      activeColor: "bg-cyan-600 text-white border-cyan-400 ring-2 ring-cyan-500/40",
      coachAdvice: "암산을 줄이고 줄바꿈 정렬을 유지하며, 마지막에 구하는 대상(예: 10p+q)에 밑줄을 그으세요."
    },
    {
      id: "time_shortage",
      label: "시간 부족",
      shortDesc: "접근법이 돌아가거나 당황하여 제한 시간 내 못 풂",
      color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      activeColor: "bg-emerald-600 text-white border-emerald-400 ring-2 ring-emerald-500/40",
      coachAdvice: "대수적 계산에 매몰되기 전에 그래프의 대칭성·비율 관계 등 기하적 성질을 먼저 관찰하세요."
    }
  ],

  // 3. 변형 난이도 조절 옵션 3단계
  DIFFICULTY_OPTIONS: [
    {
      id: "similar",
      label: "유사 난이도",
      badge: "쌍둥이 표준 변형",
      desc: "원본 문제의 핵심 출제 논리는 100% 유지하되, 함수식·수치·조건·선지 구성을 바꾼 실전 쌍둥이 문제",
      color: "border-indigo-500/50 bg-indigo-500/10 text-indigo-300",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
    },
    {
      id: "killer",
      label: "조건 심화(킬러화)",
      badge: "고난도 킬러 변형",
      desc: "원본 논리에 절댓값·매개변수·숨은 경계 조건·복합 추론을 결합해 수능 22번/30번급 변별력으로 강화",
      color: "border-rose-500/50 bg-rose-500/10 text-rose-300",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40"
    },
    {
      id: "basic",
      label: "개념 확인용 기초 변형",
      badge: "핵심 원리 체화",
      desc: "복잡한 계산과 부수적 함정을 덜어내고, 학생이 틀린 핵심 원리만 정확히 짚어보는 징검다리 변형",
      color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-300",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
    }
  ],

  // 4. 에빙하우스 망각곡선 복습 단계 정의
  EBBINGHAUS_STAGES: {
    "D+1": {
      code: "D+1",
      label: "D+1 복습 대기",
      fullLabel: "D+1 (24시간 주기 1차 재도전)",
      daysAfter: 1,
      nextStage: "D+3",
      badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/50",
      dotClass: "bg-rose-500",
      description: "오답 등록 직후 급격한 망각(약 70% 손실)을 방어하기 위한 1일차 필수 블라인드 재도전"
    },
    "D+3": {
      code: "D+3",
      label: "D+3 복습 대기",
      fullLabel: "D+3 (3일 주기 단기 기억 강화)",
      daysAfter: 3,
      nextStage: "D+7",
      badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/50",
      dotClass: "bg-amber-500",
      description: "풀이법을 외워서 푼 것이 아닌지 검증하고 출제 논리를 응고화하는 3일차 복습"
    },
    "D+7": {
      code: "D+7",
      label: "D+7 최종 검증",
      fullLabel: "D+7 (7일 주기 장기 기억 전환)",
      daysAfter: 7,
      nextStage: "MASTERED",
      badgeClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/50",
      dotClass: "bg-indigo-400",
      description: "일주일 경과 후에도 함정에 빠지지 않고 킬러 논리를 즉각 인출하는지 확인하는 최종 관문"
    },
    "MASTERED": {
      code: "MASTERED",
      label: "완전 체화 완료",
      fullLabel: "마스터 (D+1·D+3·D+7 완전 격파)",
      daysAfter: 0,
      nextStage: "MASTERED",
      badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/50",
      dotClass: "bg-emerald-400",
      description: "에빙하우스 3단계 복습 주기를 모두 통과하여 완벽히 내 것으로 체화한 문항"
    }
  },

  // 5. 수식 퀵 입력 스니펫 (LaTeX 도우미)
  LATEX_SNIPPETS: [
    { label: "인라인 수식 $...$", insert: "$f(x) = x^3 - 3x$" },
    { label: "블록 수식 $$...$$", insert: "\n$$\\int_{0}^{2} f(x)\\,dx = 0$$\n" },
    { label: "분수 \\frac", insert: "$\\frac{a}{b}$" },
    { label: "극한 \\lim", insert: "$\\lim_{x \\to a} \\frac{f(x)-f(a)}{x-a}$" },
    { label: "정적분 \\int", insert: "$\\int_{a}^{b} f(t)\\,dt$" },
    { label: "시그마 \\sum", insert: "$\\sum_{k=1}^{n} a_k$" },
    { label: "절댓값 |x|", insert: "$|f(x) - k|$" },
    { label: "구간 조건함수", insert: "$$g(x) = \\begin{cases} f(x) & (x < a) \\\\ -f(x)+2k & (x \\ge a) \\end{cases}$$" },
    { label: "벡터/기하", insert: "$|\\vec{OP} - \\vec{OA}| = r$" },
    { label: "조건부확률", insert: "$P(B|A) = \\frac{P(A \\cap B)}{P(A)}$" },
    { label: "화학반응식", insert: "$a\\text{A}(g) + b\\text{B}(g) \\rightarrow c\\text{C}(g)$" }
  ],

  // 6. 초기 오답 문제 데이터 (예시 없음: 사용자가 직접 등록한 문제만 표시)
  INITIAL_PROBLEMS: []
};
