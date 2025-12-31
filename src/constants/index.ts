// ============================================
// MediInside Constants
// ============================================

// Fit Types
export const FIT_TYPE_LABELS = {
  high_end_achiever: '하이엔드 성과자',
  practical_expert: '실리적 전문가',
  self_actualizer: '자아실현가',
  trust_centered_expert: '신뢰 중심 전문가',
} as const;

export const FIT_TYPE_DESCRIPTIONS = {
  high_end_achiever: '성과 보상과 성장 기회를 중시하는 타입입니다. 인센티브가 강한 대형 병원과 잘 맞습니다.',
  practical_expert: '급여와 워라밸을 중시하는 타입입니다. 조건이 좋고 안정적인 병원과 잘 맞습니다.',
  self_actualizer: '의미 있는 일과 성장을 중시하는 타입입니다. 교육/연구가 활발한 병원과 잘 맞습니다.',
  trust_centered_expert: '좋은 동료와 안정성을 중시하는 타입입니다. 가족적 분위기의 병원과 잘 맞습니다.',
} as const;

// License Types
export const LICENSE_TYPE_LABELS = {
  dental_hygienist: '치과위생사',
  nurse: '간호사',
  nurse_aide: '간호조무사',
  radiologist: '방사선사',
  physical_therapist: '물리치료사',
  other: '기타',
} as const;

// Work Types
export const WORK_TYPE_LABELS = {
  full_time: '정규직',
  part_time: '파트타임',
  substitute: '대진',
} as const;

// Match Status
export const MATCH_STATUS_LABELS = {
  proposed: '제안받음',
  viewed: '확인됨',
  interested: '관심 표시',
  negotiating: '조건 협상 중',
  interview: '면접 예정',
  final: '최종 협상',
  accepted: '수락',
  rejected: '거절',
  expired: '만료',
} as const;

// Intensity Tier
export const INTENSITY_TIER_LABELS = {
  1: 'Tier 1 (AI 추정)',
  2: 'Tier 2 (유저 제보)',
  3: 'Tier 3 (검증 완료)',
} as const;

export const INTENSITY_TIER_COLORS = {
  1: 'gray',
  2: 'blue',
  3: 'green',
} as const;

// Regions
export const REGIONS = [
  '서울',
  '경기',
  '인천',
  '부산',
  '대구',
  '광주',
  '대전',
  '울산',
  '세종',
  '강원',
  '충북',
  '충남',
  '전북',
  '전남',
  '경북',
  '경남',
  '제주',
] as const;

// Departments (Medical)
export const DEPARTMENTS = [
  '치과',
  '정형외과',
  '내과',
  '외과',
  '산부인과',
  '소아과',
  '피부과',
  '안과',
  '이비인후과',
  '비뇨기과',
  '신경외과',
  '성형외과',
  '재활의학과',
  '영상의학과',
  '마취통증의학과',
  '기타',
] as const;

// Common Skills
export const COMMON_SKILLS = {
  dental_hygienist: [
    '스케일링',
    '치면세마',
    '치아미백',
    '임플란트 보조',
    '교정 보조',
    'X-ray 촬영',
    '인상채득',
    '치주치료 보조',
    '보철 보조',
    '소아 치료 보조',
  ],
  nurse: [
    'IV 투여',
    '채혈',
    '투약',
    '수술 보조',
    '응급처치',
    'EKG',
    '상처 드레싱',
    '환자 모니터링',
    '수액 관리',
    '카테터 관리',
  ],
  nurse_aide: [
    '환자 보조',
    '활력징후 측정',
    '위생 관리',
    '식사 보조',
    '이동 보조',
    '침상 정리',
    '의료기기 소독',
  ],
} as const;

// Benefits
export const COMMON_BENEFITS = [
  '4대보험',
  '퇴직금',
  '연차',
  '월차',
  '점심 제공',
  '간식 제공',
  '교통비 지원',
  '주차 지원',
  '학회비 지원',
  '자기계발비 지원',
  '경조사비',
  '명절 보너스',
  '성과급',
  '야근 수당',
  '휴일 수당',
  '건강검진',
] as const;

// Nudge Messages
export const NUDGE_MESSAGES = {
  // Seeker Home - Hook Mode
  marketBriefing: (region: string, percentage: number) =>
    `지금 ${region} 지역 치과는 평소보다 시급이 ${percentage}% 높게 형성되어 있어요.`,
  potentialMatch: (count: number) =>
    `님을 기다리는 병원이 근처에 ${count}곳이나 있어요!`,
  laborIntensityMap: '일은 편하고 급여는 높은 \'꿀매물\'만 골라 드릴까요?',
  blurOffer: '딱 1분이면 숨겨진 조건을 모두 확인할 수 있어요.',
  quickOnboarding: '10초만 투자하면 맞춤 정보를 바로 볼 수 있어요.',

  // Seeker Home - Dashboard Mode
  waitingOffers: (count: number) =>
    `님, 현재 ${count}곳의 병원이 당신의 결정을 기다리고 있어요.`,
  personalizedReport: (fitType: string, department: string) =>
    `님 같은 '${fitType}'는 ${department}에서 만족도가 가장 높았어요.`,
  activityFeed: (count: number) =>
    `지금 이 순간에도 ${count}명의 전문가가 새로운 기회를 찾고 있어요.`,
  recommendedOffer: (percentage: number) =>
    `이 병원은 님 성향과 ${percentage}% 일치해요!`,
  profileCompleteness: '프로필을 100%로 채우면 오퍼가 2배 늘어나요.',

  // Fit Test
  fitTestIntro: '선배들의 실제 데이터로 만든 진단이에요. 1분이면 끝나요.',
  fitTestProgress: (remaining: number) =>
    `거의 다 왔어요! ${remaining}문항만 더!`,
  fitTestResult: (fitType: string) =>
    `님은 '${fitType}'예요!`,
  fitTestDepartment: (department: string, percentage: number) =>
    `같은 유형 선배 ${percentage}%가 ${department}에서 2년 이상 근속했어요.`,

  // Matching Center
  activeOffer: '원장님이 직접 님을 선택했어요!',
  tierVerified: '실제 재직자 제보로 검증됐어요.',
  skillsNeeded: (count: number) =>
    `술기 ${count}개만 추가하면 상세 조건을 볼 수 있어요.`,
  colleagueWorking: '아는 동료가 이미 근무 중인 곳이에요.',

  // Concierge
  modeSelection: '타이핑이 귀찮으면 음성으로 편하게!',
  coffeeChat: '면접 전 궁금한 거 뭐든지 물어보세요.',
  skillExtracted: (count: number) =>
    `전문 술기 ${count}개를 발견했어요!`,
  counterOffer: 'AI가 정중하게 전달해드릴게요.',
  interviewPrep: '이것만 준비하세요. 합격률 2배!',

  // Employer
  aiActivity: (reviewed: number, chatting: number) =>
    `원장님이 쉬는 동안 AI가 ${reviewed}명을 검토하고 ${chatting}명과 대화 중이에요.`,
  funnelImprovement: '제안 수락률이 낮아요. AI 추천 메시지로 바꿔볼까요?',
  weeklyReport: (hours: number) =>
    `이번 주 AI가 ${hours}시간 분량의 일을 대신 했어요.`,
  directProposal: '직접 제안하면 수락률이 2배!',
  aiFiltered: (count: number) =>
    `기준에 맞지 않는 ${count}명을 AI가 대신 거절했어요.`,
  verifiedCandidate: (years: number) =>
    `전 직장에서 ${years}년 이상 근무한 검증된 인재예요.`,
  counterOfferReceived: (item: string) =>
    `후보자가 ${item}을 요청했어요. 어떻게 하실래요?`,
  interviewQuestion: '이 후보자에게 이 질문을 해보세요.',
  hiringComplete: (days: number) =>
    `채용 완료! 평균보다 ${days}일 빠르게 찾았어요.`,
} as const;

// Routes
export const ROUTES = {
  // Public
  home: '/',
  login: '/login',
  signup: '/signup',

  // Seeker
  seekerHome: '/seeker/home',
  seekerFitTest: '/seeker/fit-test',
  seekerMatchingCenter: '/seeker/matching-center',
  seekerConcierge: '/seeker/concierge',
  seekerProfile: '/seeker/profile',

  // Employer
  employerHome: '/employer/home',
  employerProjectSetup: '/employer/project/setup',
  employerScout: '/employer/scout',
  employerReview: '/employer/review',
  employerDecision: '/employer/decision',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    signup: '/api/auth/signup',
    logout: '/api/auth/logout',
    session: '/api/auth/session',
  },
  seeker: {
    profile: '/api/seeker/profile',
    fitTest: '/api/seeker/fit-test',
    matches: '/api/seeker/matches',
    conversations: '/api/seeker/conversations',
  },
  employer: {
    profile: '/api/employer/profile',
    projects: '/api/employer/projects',
    candidates: '/api/employer/candidates',
    decisions: '/api/employer/decisions',
  },
  market: {
    data: '/api/market/data',
    intensity: '/api/market/intensity',
  },
} as const;
