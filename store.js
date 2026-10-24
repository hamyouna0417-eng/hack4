// 상태 관리, 로컬 스토리지 영속화, 사용자 인증(로그인/회원가입), 과목별 오답 격파율(%) 계산 및 에빙하우스 망각곡선 스케줄러 로직

window.META_KILLER_STORE = (function () {
  const STORAGE_KEYS = {
    PROBLEMS: "meta_killer_problems_clean_v3",
    CUSTOM_FOLDERS: "meta_killer_custom_folders_clean_v3",
    SETTINGS: "meta_killer_settings_v3",
    USERS: "meta_killer_users_v3",
    CURRENT_USER: "meta_killer_current_user_v3",
    SCHEDULES: "meta_killer_schedules_clean_v3"
  };

  // 기존 레거시 캐시 키(더미 데이터 포함 키) 정리
  try {
    const legacyKeys = [
      "meta_killer_problems_v1",
      "meta_killer_problems_v2",
      "meta_killer_custom_folders_v1",
      "meta_killer_users_v2",
      "meta_killer_current_user_v2"
    ];
    legacyKeys.forEach((k) => localStorage.removeItem(k));
  } catch (e) {
    // 무시
  }

  // 기본 사용자 계정 (체험 및 신규 계정 등록 가능)
  const INITIAL_USERS = [
    {
      id: "user_me",
      username: "user",
      password: "123",
      name: "내 계정",
      role: "student",
      grade: "수험생",
      avatar: "👨‍🎓",
      badge: "오답 격파 도전자",
      bio: "직접 등록한 킬러 오답을 정복해 나갑니다.",
      createdAt: "2026-10-24"
    }
  ];

  function loadUsers() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USERS);
      if (raw === null) {
        saveUsers(INITIAL_USERS);
        return INITIAL_USERS;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  }

  function saveUsers(users) {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (e) {
      console.warn("사용자 목록 저장 실패:", e);
    }
  }

  function loadCurrentUser() {
    try {
      const users = loadUsers();
      const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (raw === null) {
        if (users.length > 0) {
          const defaultUser = users[0];
          saveCurrentUser(defaultUser);
          return defaultUser;
        }
        return null;
      }
      if (raw === "LOGGED_OUT") {
        return null;
      }
      const parsed = JSON.parse(raw);
      if (parsed && users.some((u) => u.id === parsed.id)) {
        return parsed;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  function saveCurrentUser(user) {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
      } else {
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, "LOGGED_OUT");
      }
    } catch (e) {
      console.warn("현재 사용자 저장 실패:", e);
    }
  }

  function login(username, password) {
    const users = loadUsers();
    const user = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase()
    );
    if (!user) {
      return { success: false, message: "존재하지 않는 아이디입니다." };
    }
    if (user.password !== password) {
      return { success: false, message: "비밀번호가 일치하지 않습니다." };
    }
    saveCurrentUser(user);
    return { success: true, user };
  }

  function signup(userData) {
    const users = loadUsers();
    const exists = users.some(
      (u) => u.username.toLowerCase() === userData.username.trim().toLowerCase()
    );
    if (exists) {
      return { success: false, message: "이미 사용 중인 아이디입니다." };
    }
    const newUser = {
      id: "user_" + Date.now(),
      username: userData.username.trim(),
      password: userData.password,
      name: userData.name.trim() || userData.username.trim(),
      role: userData.role || "student",
      grade: userData.grade || "고등학생",
      avatar: userData.avatar || "👨‍🎓",
      badge: userData.badge || "새로운 도전자",
      bio: userData.bio || "오늘도 오답을 정복해 나갑니다!",
      createdAt: new Date().toISOString().slice(0, 10)
    };
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    saveCurrentUser(newUser);
    return { success: true, user: newUser };
  }

  function logout() {
    saveCurrentUser(null);
    return { success: true };
  }

  function deleteAccount(userId, deleteUserProblems = false) {
    if (!userId) {
      return { success: false, message: "삭제할 계정이 지정되지 않았습니다." };
    }
    const users = loadUsers();
    const targetUser = users.find((u) => u.id === userId);
    if (!targetUser) {
      return { success: false, message: "존재하지 않는 계정입니다." };
    }
    const updatedUsers = users.filter((u) => u.id !== userId);
    saveUsers(updatedUsers);

    const current = loadCurrentUser();
    let nextCurrentUser = current;
    if (current && current.id === userId) {
      nextCurrentUser = null;
      saveCurrentUser(null);
    }

    let updatedProblems = loadProblems();
    if (deleteUserProblems) {
      updatedProblems = updatedProblems.filter((p) => p.authorId !== userId);
      saveProblems(updatedProblems);
    }

    return {
      success: true,
      deletedUser: targetUser,
      users: updatedUsers,
      currentUser: nextCurrentUser,
      problems: updatedProblems
    };
  }

  // 초기 탑재 문제 데이터: 예시 없이 깨끗한 0문제에서 시작 (사용자가 직접 등록한 문제만 표시)
  function getInitialProblems() {
    return [];
  }

  function getInitialCustomFolders() {
    return [];
  }

  // 더미/샘플 문제 ID 목록 (과거 버전의 잔여 mock 데이터 필터링용)
  const MOCK_PROBLEM_IDS = [
    "prob-math-101",
    "prob-science-201",
    "prob-korean-301",
    "prob-english-401",
    "prob-social-501",
    "prob-etc-601"
  ];

  function loadProblems() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // 기존 mock 예시 문제 완전히 걸러내기
        return parsed
          .filter(
            (p) =>
              p &&
              p.id &&
              !MOCK_PROBLEM_IDS.includes(p.id) &&
              !p.id.startsWith("prob-mock")
          )
          .map((p) => ({
            ...p,
            authorId: p.authorId || "user_me",
            authorName: p.authorName || "내 계정",
            authorGrade: p.authorGrade || "수험생",
            authorAvatar: p.authorAvatar || "👨‍🎓",
            likesCount: p.likesCount || 0,
            likedUsers: p.likedUsers || [],
            bookmarkUsers: p.bookmarkUsers || []
          }));
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  function saveProblems(problems) {
    try {
      // mock 문제 필터링 후 저장
      const cleanList = (problems || []).filter(
        (p) =>
          p &&
          p.id &&
          !MOCK_PROBLEM_IDS.includes(p.id) &&
          !p.id.startsWith("prob-mock")
      );
      localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(cleanList));
    } catch (e) {
      console.warn("로컬 스토리지 저장 실패:", e);
    }
  }

  function loadCustomFolders() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_FOLDERS);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveCustomFolders(folders) {
    try {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_FOLDERS, JSON.stringify(folders));
    } catch (e) {
      console.warn("커스텀 폴더 저장 실패:", e);
    }
  }

  function loadSettings() {
    const defaultSettings = {
      darkMode: true, // 야간 자율학습/독서실 기본 다크모드
      eyeCareFilter: false,
      geminiApiKey: ""
    };
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!raw) return defaultSettings;
      return { ...defaultSettings, ...JSON.parse(raw) };
    } catch (e) {
      return defaultSettings;
    }
  }

  function saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn("설정 저장 실패:", e);
    }
  }

  // 달력 일정(Schedule) 로드 및 저장 (기본값: 깨끗한 빈 배열)
  function loadSchedules() {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveSchedules(schedules) {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules || []));
    } catch (e) {
      console.warn("달력 일정 저장 실패:", e);
    }
  }

  function resetAllData() {
    // 모든 키 삭제
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    saveUsers(INITIAL_USERS);
    saveCurrentUser(INITIAL_USERS[0]);
    saveProblems([]);
    saveCustomFolders([]);
    saveSchedules([]);
    return {
      problems: [],
      customFolders: [],
      schedules: [],
      users: INITIAL_USERS,
      currentUser: INITIAL_USERS[0]
    };
  }

  // 좋아요 토글
  function toggleProblemLike(problemId, userId) {
    const problems = loadProblems();
    let updated = problems.map((p) => {
      if (p.id !== problemId) return p;
      const likedUsers = p.likedUsers || [];
      const isLiked = likedUsers.includes(userId);
      const newLikedUsers = isLiked
        ? likedUsers.filter((id) => id !== userId)
        : [...likedUsers, userId];
      const newCount = Math.max(0, (p.likesCount || 0) + (isLiked ? -1 : 1));
      return {
        ...p,
        likedUsers: newLikedUsers,
        likesCount: newCount
      };
    });
    saveProblems(updated);
    return updated;
  }

  // 북마크 토글
  function toggleProblemBookmark(problemId, userId) {
    const problems = loadProblems();
    let updated = problems.map((p) => {
      if (p.id !== problemId) return p;
      const bookmarkUsers = p.bookmarkUsers || [];
      const isBookmarked = bookmarkUsers.includes(userId);
      const newBookmarkUsers = isBookmarked
        ? bookmarkUsers.filter((id) => id !== userId)
        : [...bookmarkUsers, userId];
      return {
        ...p,
        bookmarkUsers: newBookmarkUsers
      };
    });
    saveProblems(updated);
    return updated;
  }

  // 개별 문항의 체화도 점수(0 ~ 100) 산출
  function calculateProblemMasteryScore(problem) {
    if (!problem) return 0;
    const stageWeights = {
      "D+1": 20,
      "D+3": 55,
      "D+7": 80,
      "MASTERED": 100
    };
    const baseScore = stageWeights[problem.ebbinghausStage] ?? 20;
    const variants = problem.variants || [];
    if (variants.length === 0) return baseScore;

    const correctCount = variants.filter((v) => v.solvedStatus === "correct").length;
    const variantRatio = Math.round((correctCount / variants.length) * 100);

    if (problem.ebbinghausStage === "MASTERED") return 100;
    return Math.min(95, Math.round(baseScore * 0.65 + variantRatio * 0.35));
  }

  // 대시보드 상단용: 6대 과목 카테고리별 오답 격파율(%) 및 통계 계산
  function computeDashboardStats(problems) {
    const categories = window.META_KILLER_DATA.SUBJECT_CATEGORIES;
    const tagMap = {};
    window.META_KILLER_DATA.METACOGNITION_TAGS.forEach((t) => {
      tagMap[t.id] = t.label;
    });

    const safeProblems = Array.isArray(problems) ? problems : [];

    const subjectStats = categories.map((cat) => {
      const catProblems = safeProblems.filter((p) => p.categoryId === cat.id);
      const totalProblems = catProblems.length;
      const masteredProblems = catProblems.filter((p) => p.ebbinghausStage === "MASTERED").length;
      const dueCount = catProblems.filter((p) => p.dueToday && p.ebbinghausStage !== "MASTERED").length;

      let totalVariants = 0;
      let solvedVariants = 0;
      const tagFreq = {};

      catProblems.forEach((p) => {
        const vars = p.variants || [];
        totalVariants += vars.length;
        solvedVariants += vars.filter((v) => v.solvedStatus === "correct").length;
        (p.errorTags || []).forEach((tagId) => {
          tagFreq[tagId] = (tagFreq[tagId] || 0) + 1;
        });
      });

      let topErrorTag = null;
      let maxCount = 0;
      Object.keys(tagFreq).forEach((tagId) => {
        if (tagFreq[tagId] > maxCount) {
          maxCount = tagFreq[tagId];
          topErrorTag = tagMap[tagId] || tagId;
        }
      });

      const conquestRate =
        totalProblems === 0
          ? 0
          : Math.round(
              catProblems.reduce((acc, p) => acc + calculateProblemMasteryScore(p), 0) /
                totalProblems
            );

      return {
        ...cat,
        totalProblems,
        masteredProblems,
        dueCount,
        totalVariants,
        solvedVariants,
        conquestRate,
        topErrorTag
      };
    });

    const totalProblemsCount = safeProblems.length;
    const totalMasteredCount = safeProblems.filter((p) => p.ebbinghausStage === "MASTERED").length;
    const totalDueCount = safeProblems.filter((p) => p.dueToday && p.ebbinghausStage !== "MASTERED").length;
    const overallConquestRate =
      totalProblemsCount === 0
        ? 0
        : Math.round(
            safeProblems.reduce((acc, p) => acc + calculateProblemMasteryScore(p), 0) /
              totalProblemsCount
          );

    return {
      subjectStats,
      totalProblemsCount,
      totalMasteredCount,
      totalDueCount,
      overallConquestRate
    };
  }

  // 오늘 다시 풀어야 할 변형 문제 대기열 추출 (D+1 -> D+3 -> D+7 우선순위 정렬)
  function getTodayReviewQueue(problems) {
    const priorityOrder = { "D+1": 1, "D+3": 2, "D+7": 3, "MASTERED": 4 };
    const safeProblems = Array.isArray(problems) ? problems : [];
    return safeProblems
      .filter((p) => p.dueToday && p.ebbinghausStage !== "MASTERED")
      .sort((a, b) => (priorityOrder[a.ebbinghausStage] || 9) - (priorityOrder[b.ebbinghausStage] || 9));
  }

  // Step 4 블라인드 재도전 제출 후 에빙하우스 복습 단계 업데이트
  function evaluateBlindRetry(problem, variantId, userSelectedAnswer) {
    const updatedProblem = JSON.parse(JSON.stringify(problem));
    const targetVariant = (updatedProblem.variants || []).find((v) => v.id === variantId);

    if (!targetVariant) {
      return { updatedProblem, isCorrect: false, previousStage: problem.ebbinghausStage, nextStage: problem.ebbinghausStage };
    }

    const normalize = (str) => String(str || "").trim().replace(/\s+/g, " ");
    const isCorrect = normalize(userSelectedAnswer) === normalize(targetVariant.answer);

    targetVariant.attempts = (targetVariant.attempts || 0) + 1;
    targetVariant.userLastAnswer = userSelectedAnswer;
    targetVariant.solvedStatus = isCorrect ? "correct" : "wrong";

    const previousStage = updatedProblem.ebbinghausStage || "D+1";
    let nextStage = previousStage;

    if (isCorrect) {
      if (previousStage === "D+1") nextStage = "D+3";
      else if (previousStage === "D+3") nextStage = "D+7";
      else if (previousStage === "D+7") nextStage = "MASTERED";
      else nextStage = "MASTERED";

      updatedProblem.ebbinghausStage = nextStage;
      updatedProblem.dueToday = false; // 오늘 복습 완료 처리
      updatedProblem.reviewCount = (updatedProblem.reviewCount || 0) + 1;
      if (nextStage === "MASTERED") {
        updatedProblem.masteredCount = (updatedProblem.masteredCount || 0) + 1;
      }
    } else {
      // 오답 시 에빙하우스 망각곡선 원리에 따라 D+1 집중 복습 단계로 리셋 및 대기열 유지
      nextStage = "D+1";
      updatedProblem.ebbinghausStage = "D+1";
      updatedProblem.dueToday = true;
      updatedProblem.reviewCount = (updatedProblem.reviewCount || 0) + 1;
    }

    updatedProblem.lastReviewedAt = new Date().toISOString().slice(0, 10);

    return {
      updatedProblem,
      isCorrect,
      previousStage,
      nextStage
    };
  }

  // 에빙하우스 복습 알림 시뮬레이터 (D+1, D+3, D+7 경과 시 오늘의 복습 대기열 활성화)
  function triggerReviewSimulation(problems, targetStage) {
    const safeProblems = Array.isArray(problems) ? problems : [];
    return safeProblems.map((p) => {
      if (p.ebbinghausStage === "MASTERED") return p;
      if (targetStage === "ALL" || p.ebbinghausStage === targetStage) {
        return { ...p, dueToday: true };
      }
      return p;
    });
  }

  return {
    INITIAL_USERS,
    loadUsers,
    saveUsers,
    loadCurrentUser,
    saveCurrentUser,
    login,
    signup,
    logout,
    deleteAccount,
    toggleProblemLike,
    toggleProblemBookmark,
    loadProblems,
    saveProblems,
    loadCustomFolders,
    saveCustomFolders,
    loadSchedules,
    saveSchedules,
    loadSettings,
    saveSettings,
    resetAllData,
    calculateProblemMasteryScore,
    computeDashboardStats,
    getTodayReviewQueue,
    evaluateBlindRetry,
    triggerReviewSimulation
  };
})();
