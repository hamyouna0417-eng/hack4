// LaTeX(KaTeX) 수식 파서 및 샘플 기출 다이어그램(SVG Data URL) 생성 유틸리티

window.META_KILLER_MATH = (function () {
  // 텍스트 내의 $$...$$, \[...\], $...$, \(...\) 수식을 파싱하여 KaTeX HTML로 변환
  function renderMathInText(rawText) {
    if (rawText === null || rawText === undefined) return "";
    const text = String(rawText);

    // HTML 이스케이프 헬퍼 (수식 외 일반 텍스트 안전 처리)
    function escapeHtml(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;")
        .replace(/\n/g, "<br/>");
    }

    // 블록 수식($$...$$ 또는 \[...\]) 및 인라인 수식($...$ 또는 \(...\)) 정규식 토큰화
    const tokenRegex = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\]|\$[^\$\n]+?\$|\\\([\s\S]+?\\\))/g;
    const parts = text.split(tokenRegex);

    return parts
      .map((part) => {
        if (!part) return "";

        const isDisplayDollar = part.startsWith("$$") && part.endsWith("$$") && part.length > 4;
        const isDisplayBracket = part.startsWith("\\[") && part.endsWith("\\]") && part.length > 4;
        const isInlineDollar = part.startsWith("$") && part.endsWith("$") && !isDisplayDollar && part.length > 2;
        const isInlineParen = part.startsWith("\\(") && part.endsWith("\\)") && part.length > 4;

        if (isDisplayDollar || isDisplayBracket || isInlineDollar || isInlineParen) {
          const displayMode = isDisplayDollar || isDisplayBracket;
          const mathExpr = isDisplayDollar
            ? part.slice(2, -2)
            : isDisplayBracket
            ? part.slice(2, -2)
            : isInlineDollar
            ? part.slice(1, -1)
            : part.slice(2, -2);

          if (window.katex && typeof window.katex.renderToString === "function") {
            try {
              return window.katex.renderToString(mathExpr.trim(), {
                displayMode: displayMode,
                throwOnError: false,
                strict: false
              });
            } catch (e) {
              return `<code class="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-xs">${escapeHtml(part)}</code>`;
            }
          } else {
            return `<code class="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">${escapeHtml(mathExpr)}</code>`;
          }
        }

        return escapeHtml(part);
      })
      .join("");
  }

  // Step 1 오답 등록 시 테스트용으로 바로 첨부할 수 있는 고해상도 SVG 기출 그래프 프리셋
  const SAMPLE_DIAGRAMS = [
    {
      id: "cubic-ratio",
      label: "수학: 삼차함수 1:2 비율관계 & 절댓값 그래프",
      dataUrl:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 260" width="520" height="260">
          <rect width="520" height="260" rx="14" fill="#0f172a"/>
          <g stroke="#1e293b" stroke-width="1">
            <line x1="0" y1="65" x2="520" y2="65"/>
            <line x1="0" y1="130" x2="520" y2="130"/>
            <line x1="0" y1="195" x2="520" y2="195"/>
            <line x1="130" y1="0" x2="130" y2="260"/>
            <line x1="260" y1="0" x2="260" y2="260"/>
            <line x1="390" y1="0" x2="390" y2="260"/>
          </g>
          <!-- 직선 y = f(1) -->
          <line x1="40" y1="185" x2="480" y2="185" stroke="#64748b" stroke-width="2" stroke-dasharray="6,4"/>
          <text x="435" y="176" fill="#94a3b8" font-family="sans-serif" font-size="13">y = f(1)</text>
          <!-- 원래 삼차함수 y = f(x) 점선 -->
          <path d="M 85 240 C 145 40, 225 40, 285 140 C 325 205, 375 205, 435 55" fill="none" stroke="#6366f1" stroke-width="2.5" stroke-dasharray="4,4" opacity="0.6"/>
          <!-- 절댓값 함수 g(x) = |f(x) - f(1)| 실선 -->
          <path d="M 85 130 L 112 185 C 165 45, 235 55, 285 140 C 325 185, 360 185, 360 185 C 390 185, 415 120, 435 55" fill="none" stroke="#38bdf8" stroke-width="3.5"/>
          <!-- 미분불가능 첨점 x = -1 -->
          <circle cx="112" cy="185" r="5.5" fill="#f43f5e"/>
          <text x="80" y="212" fill="#f43f5e" font-family="sans-serif" font-weight="bold" font-size="13">x = -1 (첨점)</text>
          <!-- 접점 x = 1 -->
          <circle cx="355" cy="185" r="5.5" fill="#10b981"/>
          <text x="325" y="212" fill="#10b981" font-family="sans-serif" font-weight="bold" font-size="13">x = 1 (접점·중근)</text>
          <text x="24" y="34" fill="#e2e8f0" font-family="sans-serif" font-weight="bold" font-size="14">g(x) = |f(x) - f(1)| 개형 및 1 : 2 비율 관계</text>
        </svg>`)
    },
    {
      id: "chem-stoichiometry",
      label: "과학(화학): 기체 양적 관계 당량점 변곡 그래프",
      dataUrl:
        "data:image/svg+xml;utf8," +
        encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 260" width="520" height="260">
          <rect width="520" height="260" rx="14" fill="#0f172a"/>
          <!-- 축 -->
          <line x1="70" y1="215" x2="470" y2="215" stroke="#94a3b8" stroke-width="2"/>
          <line x1="70" y1="215" x2="70" y2="35" stroke="#94a3b8" stroke-width="2"/>
          <!-- 그래프 선 -->
          <polyline points="70,165 260,115 430,55" fill="none" stroke="#06b6d4" stroke-width="3.5"/>
          <!-- 당량점 표시 -->
          <line x1="260" y1="115" x2="260" y2="215" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5,5"/>
          <line x1="70" y1="115" x2="260" y2="115" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="5,5"/>
          <circle cx="70" cy="165" r="5" fill="#e2e8f0"/>
          <circle cx="165" cy="140" r="5" fill="#38bdf8"/>
          <circle cx="260" cy="115" r="6" fill="#f59e0b"/>
          <circle cx="395" cy="67" r="5" fill="#38bdf8"/>
          <text x="220" y="98" fill="#fbbf24" font-family="sans-serif" font-weight="bold" font-size="13">완결점(당량점: A 모두 소모)</text>
          <text x="242" y="236" fill="#fbbf24" font-family="sans-serif" font-size="12">4 mol</text>
          <text x="150" y="236" fill="#cbd5e1" font-family="sans-serif" font-size="12">2 mol</text>
          <text x="380" y="236" fill="#cbd5e1" font-family="sans-serif" font-size="12">6 mol</text>
          <text x="360" y="252" fill="#94a3b8" font-family="sans-serif" font-size="12">넣어준 B의 양(mol)</text>
          <text x="18" y="120" fill="#fbbf24" font-family="sans-serif" font-size="12">6 mol</text>
          <text x="18" y="170" fill="#cbd5e1" font-family="sans-serif" font-size="12">4 mol</text>
          <text x="85" y="34" fill="#e2e8f0" font-family="sans-serif" font-weight="bold" font-size="14">전체 기체의 양(mol) vs 넣어준 B의 몰수</text>
        </svg>`)
    }
  ];

  return {
    renderMathInText,
    SAMPLE_DIAGRAMS
  };
})();
