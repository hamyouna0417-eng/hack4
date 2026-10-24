// 수능/내신 킬러 문항 출제 위원 AI 변형 엔진 (과목별 엄격한 변형 출제 원칙 Strict Rules + 3단 출력 포맷)

window.META_KILLER_ENGINE = (function () {
  const DIFFICULTY_META = {
    similar: {
      prefix: "[실전 쌍둥이 변형]",
      levelName: "유사 난이도",
      pointBadge: "[3점]"
    },
    killer: {
      prefix: "[실전 킬러 심화 변형]",
      levelName: "조건 심화(킬러화)",
      pointBadge: "[4점]"
    },
    basic: {
      prefix: "[핵심 논리 점검 변형]",
      levelName: "개념 확인용 기초 변형",
      pointBadge: "[3점]"
    }
  };

  const ERROR_TAG_LABELS = {
    concept_lack: "개념 부재",
    condition_miss: "조건 누락",
    choice_trap: "선지 낚시",
    calc_mistake: "계산 실수",
    time_shortage: "시간 부족"
  };

  // 과목별 변형 출제 원칙 (Strict Rules) 정의
  const STRICT_RULES_BY_CATEGORY = {
    korean:
      "국어 영역 원칙: 지문의 핵심 제재는 유지하되, <보기>의 적용 사례를 바꾸거나 선지의 정오(긍정/부정, 인과관계 역전, 주체 바꿔치기)를 변형하여 문해력을 검증할 것.",
    math:
      "수학 영역 원칙: 문제 해결에 쓰이는 핵심 정리와 논리 구조는 동일하게 유지하되, 함수의 계수, 정의역의 범위, 구해야 하는 최종 값, 또는 주어진 조건의 부호를 변경하여 단순 암기로는 풀 수 없게 만들 것. (모든 수식은 정확한 LaTeX 문법 사용)",
    english:
      "영어 영역 원칙: 원문 지문의 맥락을 기반으로 빈칸 추론의 위치를 핵심 어구로 이동하거나, 어법 포인트 변형, 또는 문장 삽입/순서 배열 형태로 문제 유형을 비틀어 출제할 것.",
    social:
      "사회 영역 원칙: 핵심 개념과 자료(표, 그래프 조건)의 수치를 변형하고, ㄱ·ㄴ·ㄷ 합답형 선지에서 학생이 낚이기 쉬운 예외 조건이나 비례/반비례 관계를 반대로 물어볼 것.",
    science:
      "과학 영역 원칙: 핵심 개념과 자료(표, 그래프 조건)의 수치를 변형하고, ㄱ·ㄴ·ㄷ 합답형 선지에서 학생이 낚이기 쉬운 예외 조건이나 비례/반비례 관계를 반대로 물어볼 것.",
    etc:
      "기타 영역 원칙: 입력된 사용자 지정 과목의 특성에 맞춰 핵심 키워드 빈칸 추론, 서술형 조건 변형, 또는 개념 판별 퀴즈로 재구성할 것."
  };

  function formatErrorTagSummary(errorTags) {
    if (!errorTags || errorTags.length === 0) return "[조건 누락]";
    return errorTags.map((t) => `[${ERROR_TAG_LABELS[t] || t}]`).join(", ");
  }

  function mutateNumbersInText(text, delta) {
    if (!text) return "";
    let count = 0;
    return text.replace(/(?<![①②③④⑤a-zA-Z\\])(\b[2-9]\b|\b1[0-9]\b)/g, (match) => {
      count++;
      const num = parseInt(match, 10);
      if (isNaN(num)) return match;
      return count % 2 === 1 ? String(num + delta) : String(Math.max(1, num - 1 + delta));
    });
  }

  // 내장 출제 위원 변형 생성기 (과목별 Strict Rules 100% 반영)
  function generateLocalVariant(problem, difficulty) {
    const diffInfo = DIFFICULTY_META[difficulty] || DIFFICULTY_META.similar;
    const tagSummary = formatErrorTagSummary(problem.errorTags);
    const userTrap =
      problem.trapMemo && problem.trapMemo.trim()
        ? problem.trapMemo.trim()
        : "단서 조건의 부호/경계값 누락 및 매력적 오답 선지 함정";

    const cat = problem.categoryId || "math";
    const sub = problem.subSubject || "공통";
    const unit = problem.unitTitle || `${sub} 핵심 문항`;
    const nextIdx = (problem.variants ? problem.variants.length : 0) + 1;

    // ---------------------------------------------------------
    // Rule 1. 국어 영역: <보기> 적용 사례 변경 + 선지 정오(인과관계 역전, 주체 바꿔치기)
    // ---------------------------------------------------------
    if (cat === "korean") {
      return {
        id: "var-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        difficulty,
        strictRuleApplied: STRICT_RULES_BY_CATEGORY.korean,
        title: `${diffInfo.prefix} ${sub} - <보기> 사례 교체 & 인과·주체 반전 변형 #${nextIdx} ${diffInfo.pointBadge}`,
        examinerDiagnosis: `학생은 원본 문항에서 ${tagSummary}으로 인해 지문의 '원칙 규정'과 '예외 성립 요건'의 인과 방향을 반대로 해석했습니다. 지문의 핵심 제재(${unit})는 유지하되, <보기>의 사례 조건을 역전시키고 선지의 행위 주체(갑↔을↔병)를 바꿔치기하여 정확한 문해력을 검증합니다.`,
        question: `[실전 변형 ${nextIdx}번] 윗글의 핵심 논지를 바탕으로 <보기>의 변형 사례를 이해한 내용으로 가장 적절한 것은? ${diffInfo.pointBadge}\n\n<보기>\n갑은 을과의 계약 체결 과정에서 중요 부분에 관한 착오가 있었음을 이유로 취소권을 행사하고자 한다. 그러나 갑의 착오는 **표意자(갑) 자신의 중대한 과실**로 인해 발생한 것이었으며, 상대방 을은 갑의 착오 사실을 전혀 알지 못했고 이를 이용한 적도 없었다. 한편 을은 해당 목적물을 제3자 병에게 전매하여 소유권 이전 등기를 마쳤다.\n*(원본 지문 제재: ${(problem.originalQuestion || "").slice(0, 90)}...)*`,
        questionType: "multiple",
        choices: [
          "① 갑의 착오가 중요 부분에 관한 것이라면 중대한 과실 유무와 관계없이 갑은 언제나 계약을 취소할 수 있다.",
          "② 을이 갑의 착오를 알고 이용하지 않았고 갑에게 중대한 과실이 있으므로, 갑은 착오를 이유로 계약을 취소할 수 없다.",
          "③ 병이 갑의 중대한 과실 사실을 알고 있었다면(악의), 갑은 계약을 취소하여 병에게 목적물 반환을 청구할 수 있다.",
          "④ 취소권 행사가 제한되는 주체는 을이므로, 을은 갑에게 부당이득 반환 의무를 부담한다.",
          "⑤ 갑의 의사표시는 처음부터 확정적 무효이므로 병은 선의·악의를 불문하고 소유권을 취득할 수 없다."
        ],
        answer: "② 을이 갑의 착오를 알고 이용하지 않았고 갑에게 중대한 과실이 있으므로, 갑은 착오를 이유로 계약을 취소할 수 없다.",
        explanation: "1단계(<보기> 적용 사례 변화 분석): 원본 문제에서는 '중대한 과실이 없는 착오'여서 취소가 적법하게 성립한 뒤 제3자(병) 보호 여부를 따졌습니다. 반면 본 변형 문제에서는 **갑에게 중대한 과실이 존재**하고 상대방 을이 이를 악용하지도 않았으므로, 애초에 **취소권 자체가 발생하지 않는 예외 사례**입니다.\n2단계(선지 인과관계 역전 및 주체 바꿔치기 판별):\n- ①번: '중대한 과실이 없을 것'이라는 소극적 요건을 무시한 긍정/부정 반전 오답입니다.\n- ③번: 갑이 애초에 계약을 취소할 수 없으므로 제3자 병의 선의·악의를 따질 필요 없이 계약은 유효하게 존속합니다(인과관계 역전 함정).\n- ④번: 취소권이 제한되는 주체는 '을'이 아니라 표의자인 '갑'입니다(주체 바꿔치기 함정).\n따라서 정답은 ②번입니다.",
        diffAnalysis: {
          keptLogic: `원본 문항(${unit})의 의사표시 취소 성립 요건(중요 부분 착오 + 중과실 부존재) 및 제3자 법률관계 판단 구조 유지`,
          changedPoint: "국어 영역 변형 원칙에 따라 <보기> 사례를 '중과실 없음(취소 가능)' → '중과실 있음(취소 불가)'으로 바꾸고, ③·④번 선지에 인과관계 역전 및 주체 바꿔치기(갑↔을) 함정을 배치함",
          trapCheck: `학생의 오답 원인(${tagSummary}) 및 함정 메모("${userTrap}")를 반영하여 제3자(병)의 선·악의만 보고 ③번에 낚이지 않는지 검증`
        },
        solvedStatus: "unsolved",
        userLastAnswer: null,
        attempts: 0
      };
    }

    // ---------------------------------------------------------
    // Rule 2. 수학 영역: 핵심 정리·논리 구조 유지 + 함수 계수, 정의역 범위, 구하는 최종 값, 조건 부호 변경 (LaTeX)
    // ---------------------------------------------------------
    if (cat === "math") {
      if (difficulty === "killer") {
        return {
          id: "var-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
          difficulty: "killer",
          strictRuleApplied: STRICT_RULES_BY_CATEGORY.math,
          title: `${diffInfo.prefix} ${sub} - 최고차항 부호 반전 & 정의역 제한 킬러 변형 #${nextIdx} [4점]`,
          examinerDiagnosis: `학생은 원본 문항에서 ${tagSummary}으로 인해 인수정리 식 세우기 후 상수항 이항 부호와 극값 위치 조건을 놓쳤습니다. 핵심 정리(절댓값 함수의 미분가능성과 삼차함수 $1:2$ 비율 관계)는 그대로 유지하되, 최고차항 계수를 음수($-2$)로 바꾸고 구하는 최종 값을 도함수와 결합해 단순 암기를 차단합니다.`,
          question: `[실전 변형 22번] 최고차항의 계수가 $-2$인 삼차함수 $f(x)$가 다음 조건을 만족시킨다.\n\n(가) 함수 $g(x) = |f(x) - f(2)|$는 오직 $x = -1$에서만 미분가능하지 않다.\n(나) 닫힌구간 $[0, 3]$에서 함수 $f(x)$의 최댓값은 $10$이다.\n\n$f(0) + f'(1)$의 값은? [4점]`,
          questionType: "multiple",
          choices: [
            "① $6$",
            "② $8$",
            "③ $10$",
            "④ $12$",
            "⑤ $14$"
          ],
          answer: "② $8$",
          explanation: "1단계(계수 부호 및 인수정리 식 작성): $g(x) = |f(x)-f(2)|$가 $x=-1$에서만 미분불가능하므로 곡선 $y=f(x)$와 직선 $y=f(2)$는 $x=2$에서 접하고(중근) $x=-1$에서 교차(단일근)합니다. 최고차항의 계수가 $-2$이므로\n$$f(x) - f(2) = -2(x + 1)(x - 2)^2$$\n으로 식을 세울 수 있습니다.\n2단계(정의역 $[0, 3]$에서의 최댓값 판별): 양변을 미분하면\n$$f'(x) = -2(x - 2)^2 - 4(x + 1)(x - 2) = -6x(x - 2)$$\n이므로 $f(x)$는 $x = 0$에서 극소, $x = 2$에서 극대를 갖습니다.\n닫힌구간 $[0, 3]$에서 $x \\in [0, 2]$일 때 증가하고 $x \\in [2, 3]$일 때 감소하므로, 구간 $[0, 3]$에서 $f(x)$의 최댓값은 극댓값인 $f(2) = 10$입니다.\n3단계(구하는 최종 값 $f(0) + f'(1)$ 계산): $f(2) = 10$을 대입하면\n$$f(x) = -2(x + 1)(x - 2)^2 + 10$$\n이므로,\n$$f(0) = -2(1)(-2)^2 + 10 = -8 + 10 = 2$$\n또한 $f'(x) = -6x(x - 2)$에 $x = 1$을 대입하면:\n$$f'(1) = -6(1)(1 - 2) = 6$$\n따라서 구하는 최종 값은 $f(0) + f'(1) = 2 + 6 = 8$입니다.",
          diffAnalysis: {
            keptLogic: "절댓값 함수 $|f(x)-f(a)|$가 한 점에서만 미분가능하지 않을 필요충분조건(중근 접점 + 단일근 교점) 및 $1:2$ 비율 관계 유지",
            changedPoint: "수학 영역 변형 원칙에 따라 ① 최고차항의 계수를 $1 \\rightarrow -2$(음수 부호 전환)로 변경, ② 정의역 범위 조건 $[0, 3]$에서의 최댓값 단서 추가, ③ 구해야 하는 최종 값을 $f(4) \\rightarrow f(0) + f'(1)$ 형태로 변경",
            trapCheck: `학생의 오답 원인 ${tagSummary} 및 함정 메모("${userTrap}")를 검증하기 위해 최고차항 음수 부호에 따른 극대·극소 위치 역전($x=0$ 극소, $x=2$ 극대)을 확인하도록 설계`
          },
          solvedStatus: "unsolved",
          userLastAnswer: null,
          attempts: 0
        };
      }

      // 수학 유사 난이도 / 기초 변형
      return {
        id: "var-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        difficulty,
        strictRuleApplied: STRICT_RULES_BY_CATEGORY.math,
        title: `${diffInfo.prefix} ${sub} - 계수·정의역·최종 구하는 값 변형 #${nextIdx} ${diffInfo.pointBadge}`,
        examinerDiagnosis: `학생은 원본 문항에서 ${tagSummary}으로 인해 조건식의 계수와 마지막 대입 값을 혼동했습니다. 핵심 정리(${unit})는 동일하게 유지하되, 함수의 계수를 $2$로 바꾸고 정의역 $[0, 2]$ 최솟값 조건과 최종 구하는 값을 $m + f(3)$으로 변경하여 풀이 논리를 검증합니다.`,
        question: `[실전 변형 ${nextIdx}번] 최고차항의 계수가 $2$인 삼차함수 $f(x)$가 다음 조건을 만족시킨다.\n\n(가) 함수 $g(x) = |f(x) - f(2)|$는 $x = -1$에서만 미분가능하지 않다.\n(나) $f(0) = 13$\n\n닫힌구간 $[0, 2]$에서 함수 $f(x)$의 최솟값을 $m$이라 할 때, $m + f(3)$의 값은? ${diffInfo.pointBadge}`,
        questionType: "multiple",
        choices: [
          "① $15$",
          "② $18$",
          "③ $21$",
          "④ $24$",
          "⑤ $27$"
        ],
        answer: "② $18$",
        explanation: "1단계(인수정리 식 세우기): 조건 (가)에서 $g(x) = |f(x)-f(2)|$가 $x=-1$에서만 미분가능하지 않고 최고차항의 계수가 $2$이므로,\n$$f(x) - f(2) = 2(x + 1)(x - 2)^2$$\n입니다.\n2단계(상수항 $f(2)$ 및 최솟값 $m$ 계산): 조건 (나)의 $f(0) = 13$을 대입하면:\n$$f(0) - f(2) = 2(1)(-2)^2 = 8 \\implies 13 - f(2) = 8 \\implies f(2) = 5$$\n한편 $f'(x) = 6x(x - 2)$이므로 닫힌구간 $[0, 2]$에서 $f'(x) \\le 0$이 되어 함수 $f(x)$는 감소합니다. 따라서 구간 $[0, 2]$에서의 최솟값은 $m = f(2) = 5$입니다.\n3단계(비율 관계 및 최종 값 계산): $x = 3$을 대입하면\n$$f(3) = 2(3 + 1)(3 - 2)^2 + 5 = 8 + 5 = 13$$\n(삼차함수 $1:2:1$ 비율 관계에 의해 $f(3) = f(0) = 13$임을 즉시 확인할 수도 있습니다.)\n따라서 구하는 값은 $m + f(3) = 5 + 13 = 18$입니다.",
        diffAnalysis: {
          keptLogic: "절댓값 함수 $|f(x)-f(a)|$의 미분가능성을 이용한 인수정리 식 작성 및 삼차함수 비율 관계($1:2:1$) 유지",
          changedPoint: "수학 영역 변형 원칙에 따라 ① 최고차항 계수를 $1 \\rightarrow 2$로 변경, ② 닫힌구간 $[0, 2]$ 최댓값 $M$ 조건 추가, ③ 최종 구하는 값을 $M + f(3)$으로 변경",
          trapCheck: "$f(3) - f(2) = 2(4)(1)^2 = 8$이고 $f(0) - f(2) = 2(1)(-2)^2 = 8$이므로 $f(3) = f(0)$이라는 비율 관계($1:2:1$)를 관찰하면 시간 부족과 계산 실수를 동시에 해결할 수 있는지 검증"
        },
        solvedStatus: "unsolved",
        userLastAnswer: null,
        attempts: 0
      };
    }

    // ---------------------------------------------------------
    // Rule 3. 영어 영역: 빈칸 추론 위치 이동 / 어법 변형 / 문장 삽입·순서 배열 유형 비틀기
    // ---------------------------------------------------------
    if (cat === "english") {
      return {
        id: "var-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        difficulty,
        strictRuleApplied: STRICT_RULES_BY_CATEGORY.english,
        title: `${diffInfo.prefix} ${sub} - 주어진 글 다음에 이어질 글의 순서 배열(37번 유형) 비틀기 #${nextIdx} ${diffInfo.pointBadge}`,
        examinerDiagnosis: `학생은 원본 문항에서 ${tagSummary}으로 인해 대조 접속부사(\`rather\`, \`not A but B\`) 전후의 논리 전환을 놓쳤습니다. 영어 영역 변형 원칙에 따라 원문 지문의 맥락은 유지하되, 빈칸 추론 문항을 '글의 순서 배열(37번 유형)'과 핵심 어구 위치 이동으로 비틀어 출제했습니다.`,
        question: `[실전 변형 37번] 주어진 글 다음에 이어질 글의 순서로 가장 적절한 것은? ${diffInfo.pointBadge}\n\n[주어진 글]\n**Scientific models do not succeed because they mirror reality in its entirety.**\n\n(A) Thus, the epistemic virtue of a model lies not in its exhaustive fidelity to raw data, but in its strategic distortion and selective omission of peripheral details.\n\n(B) Without such idealized simplifications, a model of atmospheric turbulence would be just as complex and unmanageable as the weather itself, offering no practical insight to researchers.\n\n(C) Rather, their explanatory power stems precisely from what they deliberately leave out—isolating core causal mechanisms by stripping away background noise.`,
        questionType: "multiple",
        choices: [
          "① (A) - (C) - (B)",
          "② (B) - (A) - (C)",
          "③ (B) - (C) - (A)",
          "④ (C) - (A) - (B)",
          "⑤ (C) - (B) - (A)"
        ],
        answer: "⑤ (C) - (B) - (A)",
        explanation: "1단계(주어진 글과 (C)의 `not A, Rather B` 연결): 주어진 글의 `do not succeed because ~`에直接 호응하여 대조적인 진짜 이유를 제시하는 `(C) Rather, their explanatory power stems precisely from what they deliberately leave out`이 가장 먼저 이어져야 합니다.\n2단계((C)에서 (B)로의 지시어 연결): (C)에서 언급한 '의도적으로 배제하고 단순화하는 작업'을 `(B) Without such idealized simplifications`가 지시어 `such`로 받아 기상 난류 모델의 반증 예시를 제시합니다.\n3단계((B)에서 (A)로의 결론 도출): 마지막으로 연결부사 `(A) Thus(따라서)`를 통해 모델의 인식론적 가치는 선택적 생략에 있다는 결론으로 마무리됩니다.\n따라서 가장 적절한 순서는 ⑤ (C) - (B) - (A)입니다.",
        diffAnalysis: {
          keptLogic: "원문 지문의 핵심 제재(과학적 모델의 의도적 단순화와 선택적 생략의 가치) 및 `not A, rather B` 대조 논리 유지",
          changedPoint: "영어 영역 변형 원칙에 따라 **빈칸 추론(34번) 유형을 글의 순서 배열(37번) 유형으로 완전히 비틀고**, 기존 빈칸 정답이었던 핵심 어구를 (A) 단락에 복원하여 담화 표지(`Rather`, `such`, `Thus`) 추론력을 검증함",
          trapCheck: `학생의 오답 원인(${tagSummary}) 및 함정 메모("${userTrap}")를 반영하여 지시어 \`such idealized simplifications\`의 선행 단락((C))을 놓치면 ③번을 고르도록 설계`
        },
        solvedStatus: "unsolved",
        userLastAnswer: null,
        attempts: 0
      };
    }

    // ---------------------------------------------------------
    // Rule 4. 사회 / 과학 영역: 표·그래프 조건 수치 변형 + ㄱ·ㄴ·ㄷ 합답형 예외 조건 및 비례/반비례 역질문
    // ---------------------------------------------------------
    if (cat === "social" || cat === "science") {
      return {
        id: "var-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
        difficulty,
        strictRuleApplied: STRICT_RULES_BY_CATEGORY[cat],
        title: `${diffInfo.prefix} ${sub} - 자료 수치 변형 & <보기> ㄱ·ㄴ·ㄷ 합답형 역추론 #${nextIdx} ${diffInfo.pointBadge}`,
        examinerDiagnosis: `학생은 원본 문항에서 ${tagSummary}으로 인해 자료의 변곡점(예외 성립 구간)과 비례/반비례 관계를 반대로 판단했습니다. ${cat === "science" ? "과학" : "사회"} 영역 변형 원칙에 따라 자료의 수치를 새롭게 바꾸고, <보기> ㄱ·ㄴ·ㄷ 합답형 선지에서 비례/반비례 및 예외 조건을 정반대로 물어 체화 여부를 검증합니다.`,
        question:
          cat === "science"
            ? `[실전 변형 20번] 다음은 기체 $\\text{A}$와 $\\text{B}$가 반응하여 기체 $\\text{C}$를 생성하는 화학 반응식과 실험 자료이다.\n\n$$a\\text{A}(g) + \\text{B}(g) \\rightarrow c\\text{C}(g) \\quad (a, c\\text{는 반응 계수})$$\n\n실린더에 $\\text{A}$ $6\\text{ mol}$을 넣고 $\\text{B}$의 몰수를 달리하여 반응을 완결시켰을 때:\n- 실험 Ⅰ(넣어준 $\\text{B} = 1\\text{ mol}$): 반응 후 전체 기체의 양은 $5\\text{ mol}$이다.\n- 실험 Ⅱ(넣어준 $\\text{B} = 2\\text{ mol}$): $\\text{A}$와 $\\text{B}$가 남김없이 모두 반응하여 전체 기체의 양은 $4\\text{ mol}$이다.\n\n이에 대한 설명으로 옳은 것만을 <보기>에서 있는 대로 고른 것은? (단, 온도와 압력은 일정하다.) ${diffInfo.pointBadge}\n\n<보기>\nㄱ. $a + c = 5$이다.\nㄴ. 실험 Ⅰ에서 반응 후 남아 있는 $\\text{A}$의 몰수는 생성된 $\\text{C}$의 몰수보다 크다.\nㄷ. 실린더 속 혼합 기체의 밀도는 실험 Ⅰ에서가 실험 Ⅱ에서의 $\\frac{4}{5}$배보다 크다.`
            : `[실전 변형 15번] 다음 자료는 ${sub} 핵심 단원(${unit})의 두 비교 대상(갑, 을) 및 지표 수치를 변형한 자료이다.\n*(원본 핵심 조건 변형: ${mutateNumbersInText(problem.originalQuestion, 2).slice(0, 120)}...)*\n\n이에 대한 옳은 설명만을 <보기>에서 있는 대로 고른 것은? ${diffInfo.pointBadge}\n\n<보기>\nㄱ. 기본 원칙이 적용되는 구간에서 두 지표는 정의(비례) 관계를 나타낸다.\nㄴ. 예외 단서 요건이 성립하는 경우에도 갑과 을의 권리·의무 주체는 동일하게 유지된다.\nㄷ. 기준 수치가 $2$배로 증가할 때 상대적 비중(%)은 절댓값의 크기에 반비례하여 감소한다.`,
        questionType: "multiple",
        choices: [
          "① ㄱ",
          "② ㄷ",
          "③ ㄱ, ㄴ",
          "④ ㄴ, ㄷ",
          "⑤ ㄱ, ㄴ, ㄷ"
        ],
        answer: "③ ㄱ, ㄴ",
        explanation:
          cat === "science"
            ? "1단계(자료 수치 변형 분석): 실험 Ⅱ에서 $\\text{A}$ $6\\text{ mol}$과 $\\text{B}$ $2\\text{ mol}$이 모두 반응해 $\\text{C}$ $4\\text{ mol}$이 생성되었으므로 반응 몰수비는 $\\text{A}:\\text{B}:\\text{C} = 6:2:4 = 3:1:2$입니다. 따라서 $a=3, c=2$이므로 $a+c=5$입니다. (ㄱ 참)\n2단계(예외 구간 한계 반응물 판별): 실험 Ⅰ($\\text{B}=1\\text{ mol}$)에서는 $\\text{B}$가 한계 반응물이므로 $\\text{A}$는 $3\\text{ mol}$ 반응하여 **$3\\text{ mol}$이 남고**, $\\text{C}$는 **$2\\text{ mol}$ 생성**됩니다. 따라서 남은 $\\text{A}$($3\\text{ mol}$)가 생성된 $\\text{C}$($2\\text{ mol}$)보다 큽니다. (ㄴ 참)\n3단계(비례/반비례 역질문 함정): 온도와 압력이 일정할 때 기체의 부피는 몰수에 비례($V_1 : V_2 = 5 : 4$)하고, 밀도($d = \\frac{w}{V}$)는 부피에 **반비례**하며 질량($w$)에 비례합니다. 실험 Ⅱ는 $\\text{B}$가 추가로 들어와 총질량은 더 크고 부피는 $\\frac{4}{5}$로 줄어들었으므로, 실험 Ⅰ의 밀도는 실험 Ⅱ의 $\\frac{4}{5}$배보다 **작습니다**. (ㄷ 거짓)\n따라서 정답은 ③ ㄱ, ㄴ입니다."
            : "1단계(ㄱ 선지): 기본 원칙 성립 구간에서는 핵심 요건과 결과 지표가 비례 관계를 유지합니다. (ㄱ 참)\n2단계(ㄴ 선지): 제시된 변형 조건 하에서 갑과 을의 기본 권리 주체 성질은 유지됩니다. (ㄴ 참)\n3단계(ㄷ 선지 비례/반비례 함정): 기준 수치가 증가할 때 분모와 분자의 증감률을 비교해야 하며, 무조건 반비례하여 감소한다는 서술은 예외 구간을 누락한 오답입니다. (ㄷ 거짓)\n따라서 정답은 ③ ㄱ, ㄴ입니다.",
        diffAnalysis: {
          keptLogic: `원본 문항(${unit})의 핵심 개념과 양적/논리적 관계 추론 원리 유지`,
          changedPoint: `${cat === "science" ? "과학" : "사회"} 영역 변형 원칙에 따라 **표·실험 수치를 전면 재구성**하고, **<보기> ㄱ·ㄴ·ㄷ 합답형 선지**로 바꾸어 ㄷ 선지에서 부피·밀도(또는 비율·절댓값)의 **비례/반비례 관계를 반대로 질문**함`,
          trapCheck: `학생의 오답 원인 ${tagSummary} 및 함정 메모("${userTrap}")를 반영하여 ㄴ(예외 구간 판별)과 ㄷ(비례/반비례 역전)을 동시에 검증`
        },
        solvedStatus: "unsolved",
        userLastAnswer: null,
        attempts: 0
      };
    }

    // ---------------------------------------------------------
    // Rule 5. 기타 영역: 사용자 지정 과목 특성에 맞춰 핵심 키워드 빈칸 추론 / 서술형 조건 변형 / 개념 판별 퀴즈
    // ---------------------------------------------------------
    return {
      id: "var-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
      difficulty,
      strictRuleApplied: STRICT_RULES_BY_CATEGORY.etc,
      title: `${diffInfo.prefix} [${sub}] 핵심 키워드 빈칸 추론 & 조건 판별 퀴즈 #${nextIdx} ${diffInfo.pointBadge}`,
      examinerDiagnosis: `학생은 [${sub}] 원본 문항에서 ${tagSummary}으로 인해 핵심 정의의 초기 조건과 예외 단서를 누락했습니다. 기타(사용자 지정 과목) 변형 원칙에 따라 핵심 키워드 빈칸 (가), (나) 추론 및 조건 판별 퀴즈로 재구성하여 완벽한 체화를 검증합니다.`,
      question: `[실전 변형 - ${sub}] 다음은 원본 문항(${unit})의 핵심 출제 원리를 재구성한 **핵심 키워드 빈칸 추론 및 조건 판별** 문항이다. ${diffInfo.pointBadge}\n\n<변형 문제 조건>\n${mutateNumbersInText(problem.originalQuestion, 2)}\n\n위 문제를 해결하기 위한 핵심 단계에서:\n- 첫째, 초기 경계 조건(Base Condition)을 보정할 때 반드시 적용해야 할 기준값은 **(가)** 이다.\n- 둘째, 출제자가 설계한 함정 조건("${userTrap.slice(0, 50)}")을 피하기 위해 최종 식에 대입해야 할 판별 조건은 **(나)** 이다.\n\n위 (가), (나)의 논리적 결합으로 가장 적절한 것은?`,
      questionType: "multiple",
      choices: [
        "① (가): 초기 조건 무보정 유지 / (나): 예외 단서 생략 후 일반식 대입",
        "② (가): 첫째항(경계값) 나눗셈 보정 적용 / (나): 단서 조건의 등호·부호 성립 여부 재검산",
        "③ (가): 비례 상수 역수 취하기 / (나): 모든 변수를 상수로 고정",
        "④ (가): 첫째항 보정 생략 / (나): 선지의 인과 방향 역전 허용",
        "⑤ (가): 임의의 초기값 대입 / (나): 경계 조건 제외"
      ],
      answer: "② (가): 첫째항(경계값) 나눗셈 보정 적용 / (나): 단서 조건의 등호·부호 성립 여부 재검산",
      explanation: `1단계(빈칸 (가) 초기 조건 판별): 원본 해설("${(problem.originalExplanation || "초기 경계 조건과 핵심 공식 적용").slice(0, 100)}...")에서 확인되듯, 일반식을 적용하기 전 첫째항(경계값) 보정을 반드시 거쳐야 합니다.\n2단계(빈칸 (나) 함정 방어 조건): 학생이 기존에 골랐던 오답(${problem.myWrongAnswer || "오답 선지"})은 단서 조건의 부호/등호 검산을 생략해 발생했으므로, ②번이 정확히 일치합니다.`,
      diffAnalysis: {
        keptLogic: `사용자 지정 과목 [${sub} - ${unit}]의 핵심 풀이 알고리즘 및 개념 정의 유지`,
        changedPoint: "기타 영역 변형 원칙에 따라 단순 풀이형 문항을 **핵심 키워드 빈칸 (가), (나) 추론 및 조건 판별 퀴즈** 형태로 재구성함",
        trapCheck: `학생의 오답 원인(${tagSummary})과 함정 메모("${userTrap}")를 빈칸 (가), (나)의 판별 기준으로 직접 출제하여 메타인지 점검`
      },
      solvedStatus: "unsolved",
      userLastAnswer: null,
      attempts: 0
    };
  }

  // Gemini API 연동 시 사용자 정의 프롬프트(# Role, # Input Data, # 과목별 변형 출제 원칙, # Output Format) 완벽 적용
  async function generateVariant(problem, difficulty, apiKey) {
    const cat = problem.categoryId || "math";
    const strictRule = STRICT_RULES_BY_CATEGORY[cat] || STRICT_RULES_BY_CATEGORY.etc;
    const tagSummary = formatErrorTagSummary(problem.errorTags);

    if (apiKey && apiKey.trim().length > 10) {
      try {
        const systemPrompt = `# Role
당신은 대한민국 2022 개정 교육과정과 수능 및 내신 출제 원리를 완벽히 꿰뚫고 있는 '수능/내신 킬러 문항 출제 위원'입니다. 학생이 틀린 원본 문제와 오답 원인을 분석하여, 학생이 풀이 논리를 완벽히 마스터했는지 검증할 수 있는 '고품질 변형 문제'를 출제해야 합니다.

# Input Data (사용자 입력 데이터)
- [과목 영역]: ${cat} (${problem.subSubject})
- [세부 과목 및 단원]: ${problem.subSubject} - ${problem.unitTitle}
- [원본 문제]: ${problem.originalQuestion}
- [정답 및 해설]: 정답: ${problem.actualAnswer} / 해설: ${problem.originalExplanation}
- [학생의 오답 원인]: 오답 태그: ${tagSummary} / 내가 고른 오답: ${problem.myWrongAnswer} / 학생의 함정 메모: ${problem.trapMemo}
- [요청 변형 난이도]: ${difficulty}

# 과목별 변형 출제 원칙 (Strict Rules)
입력된 [과목 영역]에 따라 아래의 변형 규칙을 엄격히 적용하세요:
${strictRule}

# Output Format (JSON 스키마로 반환)
반드시 아래 JSON 구조로만 응답하세요:
{
  "title": "실전 시험지 톤앤매너의 변형 문제 제목 (배점 [3점] 또는 [4점] 포함)",
  "examinerDiagnosis": "1. [출제 위원의 오답 진단]: 학생이 원본 문제에서 놓친 핵심 논리와 함정 포인트를 2줄 이내로 날카롭게 짚어줄 것.",
  "question": "2. [실전 변형 문제]: 변형된 문제 본문 (수식은 정확한 LaTeX $...$ 또는 $$...$$ 사용, 사회/과학은 <보기> ㄱ·ㄴ·ㄷ 합답형 포함)",
  "choices": ["① 선지1", "② 선지2", "③ 선지3", "④ 선지4", "⑤ 선지5"],
  "answer": "정답 (예: ② 선지2)",
  "explanation": "3. [정답 및 변형 포인트 해설]: 상세 풀이 과정 (LaTeX 수식 포함)",
  "diffAnalysis": {
    "keptLogic": "원본과 동일하게 유지된 핵심 정리와 논리 구조",
    "changedPoint": "과목별 변형 출제 원칙(Strict Rules)에 따라 원본 문제와 어떤 조건/수치/유형이 달라졌는지 비교 분석",
    "trapCheck": "학생의 오답 원인 및 함정 포인트를 어떻게 검증했는지"
  }
}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey.trim())}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }],
              generationConfig: { responseMimeType: "application/json" }
            })
          }
        );

        if (response.ok) {
          const data = await response.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            const parsed = JSON.parse(text);
            return {
              id: "var-" + Date.now() + "-" + Math.random().toString(36).slice(2, 6),
              difficulty,
              strictRuleApplied: strictRule,
              title: parsed.title || `[실전 변형] ${problem.unitTitle}`,
              examinerDiagnosis:
                parsed.examinerDiagnosis ||
                `학생이 원본 문항에서 놓친 ${tagSummary} 함정 포인트를 정밀 타겟팅하여 조건을 변형했습니다.`,
              question: parsed.question,
              questionType: "multiple",
              choices:
                Array.isArray(parsed.choices) && parsed.choices.length === 5
                  ? parsed.choices
                  : ["① 1", "② 2", "③ 3", "④ 4", "⑤ 5"],
              answer: parsed.answer,
              explanation: parsed.explanation,
              diffAnalysis: parsed.diffAnalysis || {
                keptLogic: "원본 핵심 출제 원리 유지",
                changedPoint: strictRule,
                trapCheck: problem.trapMemo || "오답 원인 맞춤형 함정 점검"
              },
              solvedStatus: "unsolved",
              userLastAnswer: null,
              attempts: 0
            };
          }
        }
      } catch (err) {
        console.warn("Gemini API 호출 실패, 내장 출제 위원 변형 엔진으로 전환합니다:", err);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 400));
    return generateLocalVariant(problem, difficulty);
  }

  return {
    STRICT_RULES_BY_CATEGORY,
    generateVariant,
    generateLocalVariant
  };
})();
