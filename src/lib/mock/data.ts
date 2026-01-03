// ============================================
// MediInside Mock Data (목업용)
// ============================================

import type {
  SeekerProfile,
  EmployerProfile,
  JobProject,
  Match,
  MarketData,
  LaborIntensity,
  FitTestQuestion,
} from '@/types';

// Mock Seeker Profile - 하이엔드 성과자 유형으로 변경
export const mockSeekerProfile: SeekerProfile = {
  id: 'seeker-1',
  userId: 'user-1',
  name: '김민지',
  phone: '010-1234-5678',
  licenseType: 'nurse',
  licenseNumber: 'RN-2020-12345',
  region: '서울',
  preferredWorkType: 'full_time',
  fitType: 'high_end_achiever', // 하이엔드 성과자
  fitXScore: 35, // 외적 보상 중시
  fitYScore: 30, // 성장 중시
  skills: ['피부 레이저', '필러 시술 보조', '보톡스 보조', '상담', 'IV 라인'],
  experience: [
    {
      id: 'exp-1',
      hospitalName: '강남뷰티피부과',
      department: '피부과',
      position: '간호사',
      startDate: new Date('2020-03-01'),
      endDate: new Date('2023-02-28'),
      isCurrent: false,
      description: '레이저 시술 및 피부 관리 담당',
    },
    {
      id: 'exp-2',
      hospitalName: '청담에스테틱',
      department: '피부과',
      position: '간호사',
      startDate: new Date('2023-03-01'),
      isCurrent: true,
      description: '프리미엄 시술 전담 간호사',
    },
  ],
  desiredSalary: { min: 3500, max: 4500 },
  profileCompleteness: 85,
  isPublic: true,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-12-20'),
};

// Mock Hospital/Employer Profiles - 피부과/성형외과 중심
export const mockHospitals: EmployerProfile[] = [
  {
    id: 'hospital-1',
    userId: 'employer-1',
    hospitalName: '청담리더스피부과',
    department: '피부과',
    location: '서울 강남구',
    address: '서울 강남구 청담동 123',
    description: '프리미엄 안티에이징 전문 피부과입니다.',
    employeeCount: 25,
    foundedYear: 2012,
    benefits: ['4대보험', '퇴직금', '인센티브', '성과급', '학회비 지원', '해외연수'],
    photos: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    id: 'hospital-2',
    userId: 'employer-2',
    hospitalName: '압구정미래성형외과',
    department: '성형외과',
    location: '서울 강남구',
    address: '서울 강남구 압구정로 456',
    description: '자연스러운 아름다움을 추구하는 성형외과입니다.',
    employeeCount: 35,
    foundedYear: 2008,
    benefits: ['4대보험', '퇴직금', '인센티브', '점심 제공', '명절 보너스', '성과급'],
    photos: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-11-15'),
  },
  {
    id: 'hospital-3',
    userId: 'employer-3',
    hospitalName: '신사동베스트피부과',
    department: '피부과',
    location: '서울 강남구',
    address: '서울 강남구 신사동 789',
    description: '최신 레이저 장비를 갖춘 전문 피부과입니다.',
    employeeCount: 18,
    foundedYear: 2015,
    benefits: ['4대보험', '퇴직금', '인센티브', '교통비 지원', '자기계발비'],
    photos: [],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    id: 'hospital-4',
    userId: 'employer-4',
    hospitalName: '강남아이디성형외과',
    department: '성형외과',
    location: '서울 강남구',
    address: '서울 강남구 논현동 321',
    description: '눈·코 전문 성형외과입니다.',
    employeeCount: 40,
    foundedYear: 2010,
    benefits: ['4대보험', '퇴직금', '높은 인센티브', '점심 제공', '연차 보장'],
    photos: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-05'),
  },
  {
    id: 'hospital-5',
    userId: 'employer-5',
    hospitalName: '도곡에이치피부과',
    department: '피부과',
    location: '서울 강남구',
    address: '서울 강남구 도곡동 654',
    description: '피부 토탈 케어 전문 클리닉입니다.',
    employeeCount: 12,
    foundedYear: 2018,
    benefits: ['4대보험', '퇴직금', '인센티브', '유연근무'],
    photos: [],
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-11-20'),
  },
];

// Mock Job Projects - 피부과/성형외과
export const mockJobProjects: JobProject[] = [
  {
    id: 'project-1',
    employerId: 'employer-1',
    title: '피부과 경력 간호사 모집',
    licenseType: 'nurse',
    department: '피부과',
    workType: 'full_time',
    salaryRange: { min: 3800, max: 4500 },
    requirements: {
      minExperienceYears: 2,
      requiredSkills: ['피부 레이저', '필러 시술 보조'],
      requiredCertifications: [],
      locationRadius: 10,
    },
    preferences: {
      preferredSkills: ['보톡스 보조', '상담'],
      preferredFitTypes: ['high_end_achiever', 'practical_expert'],
    },
    description: '성장 의지가 강하고 성과 지향적인 분을 찾습니다.',
    benefits: ['4대보험', '인센티브', '성과급', '학회비 지원'],
    isAiScoutEnabled: true,
    dailyScoutLimit: 10,
    status: 'active',
    deadline: new Date('2025-01-31'),
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-20'),
  },
  {
    id: 'project-2',
    employerId: 'employer-2',
    title: '성형외과 수술실 간호사',
    licenseType: 'nurse',
    department: '성형외과',
    workType: 'full_time',
    salaryRange: { min: 4000, max: 5000 },
    requirements: {
      minExperienceYears: 3,
      requiredSkills: ['수술 보조', 'IV 라인'],
      requiredCertifications: [],
      locationRadius: 15,
    },
    preferences: {
      preferredSkills: ['회복실 관리'],
      preferredFitTypes: ['high_end_achiever'],
    },
    description: '수술 경험이 풍부한 간호사님을 모십니다.',
    benefits: ['4대보험', '높은 인센티브', '성과급', '점심 제공'],
    isAiScoutEnabled: true,
    dailyScoutLimit: 5,
    status: 'active',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    id: 'project-3',
    employerId: 'employer-3',
    title: '피부과 레이저실 담당',
    licenseType: 'nurse',
    department: '피부과',
    workType: 'full_time',
    salaryRange: { min: 3500, max: 4200 },
    requirements: {
      minExperienceYears: 1,
      requiredSkills: ['피부 레이저'],
      requiredCertifications: [],
      locationRadius: 10,
    },
    preferences: {
      preferredSkills: ['상담', '피부 관리'],
      preferredFitTypes: ['high_end_achiever', 'self_actualizer'],
    },
    description: '레이저 시술에 관심 있는 분을 찾습니다.',
    benefits: ['4대보험', '인센티브', '교통비 지원'],
    isAiScoutEnabled: true,
    dailyScoutLimit: 8,
    status: 'active',
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-18'),
  },
];

// Mock Matches (오퍼) - 피부과/성형외과 매칭
export const mockMatches: Match[] = [
  {
    id: 'match-1',
    seekerId: 'seeker-1',
    projectId: 'project-1',
    matchScore: 94,
    scoreBreakdown: {
      experience: 95,
      skills: 92,
      fitType: 98,
      location: 90,
    },
    status: 'proposed',
    proposedBy: 'employer',
    proposedAt: new Date('2024-12-28'),
    message: '김민지님의 프로필을 보고 연락드립니다. 저희 피부과와 정말 잘 맞을 것 같아요!',
    createdAt: new Date('2024-12-28'),
    updatedAt: new Date('2024-12-28'),
  },
  {
    id: 'match-2',
    seekerId: 'seeker-1',
    projectId: 'project-2',
    matchScore: 89,
    scoreBreakdown: {
      experience: 88,
      skills: 85,
      fitType: 95,
      location: 88,
    },
    status: 'proposed',
    proposedBy: 'ai',
    proposedAt: new Date('2024-12-27'),
    createdAt: new Date('2024-12-27'),
    updatedAt: new Date('2024-12-27'),
  },
  {
    id: 'match-3',
    seekerId: 'seeker-1',
    projectId: 'project-3',
    matchScore: 86,
    scoreBreakdown: {
      experience: 90,
      skills: 88,
      fitType: 82,
      location: 85,
    },
    status: 'negotiating',
    proposedBy: 'ai',
    proposedAt: new Date('2024-12-25'),
    counterOffer: {
      desiredSalary: 4000,
      desiredWorkHours: '9:00-18:00',
      additionalRequests: '인센티브 구조 확인 요청',
      submittedAt: new Date('2024-12-26'),
    },
    createdAt: new Date('2024-12-25'),
    updatedAt: new Date('2024-12-26'),
  },
];

// Mock Market Data - 채용 활동 기반으로 변경
export const mockMarketData: MarketData[] = [
  {
    region: '서울',
    department: '피부과',
    averageHourlySalary: 25000,
    weeklyChangeRate: 8.5,
    demandLevel: 'high',
    lastUpdated: new Date('2024-12-30'),
  },
  {
    region: '서울',
    department: '성형외과',
    averageHourlySalary: 28000,
    weeklyChangeRate: 12.3,
    demandLevel: 'high',
    lastUpdated: new Date('2024-12-30'),
  },
  {
    region: '경기',
    department: '피부과',
    averageHourlySalary: 22000,
    weeklyChangeRate: 5.1,
    demandLevel: 'medium',
    lastUpdated: new Date('2024-12-30'),
  },
];

// 채용 활동 데이터 (실시간 시장 지표용)
export const mockRecruitmentActivity = {
  today: {
    newJobPostings: 47,
    profileUpdates: 128,
    matchesCreated: 312,
    offersAccepted: 118, // 매칭성사의 약 38%
  },
  thisWeek: {
    newJobPostings: 312,
    profileUpdates: 892,
    matchesCreated: 2156,
    offersAccepted: 823, // 매칭성사의 약 38%
  },
  trending: {
    hotDepartments: ['피부과', '성형외과', '정형외과'],
    hotRegions: ['서울 강남', '서울 서초', '경기 분당'],
    avgResponseTime: '2.3시간',
  },
  recentActivity: [
    { type: 'hired', message: '피부과 3년차 김○○님 채용 확정!', time: '방금 전' },
    { type: 'hired', message: '성형외과 5년차 이○○님 계약 체결!', time: '2분 전' },
    { type: 'ai_interview', message: '치과 4년차 박○○님 AI면접 진행중', time: '3분 전' },
    { type: 'negotiating', message: '피부과 2년차 최○○님 조건 협의중', time: '5분 전' },
    { type: 'hired', message: '가정의학과 신입 정○○님 입사 확정!', time: '8분 전' },
    { type: 'ai_interview', message: '이비인후과 3년차 한○○님 AI면접 완료', time: '10분 전' },
    { type: 'hired', message: '성형외과 6년차 강○○님 채용 성사!', time: '12분 전' },
    { type: 'negotiating', message: '피부과 4년차 오○○님 최종 협의중', time: '15분 전' },
    { type: 'hired', message: '치과위생사 2년차 윤○○님 입사 결정!', time: '18분 전' },
    { type: 'ai_interview', message: '피부과 1년차 장○○님 AI면접 시작', time: '20분 전' },
  ],
};

// Mock Labor Intensity - 피부과/성형외과
export const mockLaborIntensity: Record<string, LaborIntensity> = {
  'hospital-1': {
    hospitalId: 'hospital-1',
    tier: 3,
    score: 5,
    dailyPatients: 45,
    staffCount: 25,
    overtimeFrequency: 'sometimes',
    source: 'verified',
    lastUpdated: new Date('2024-12-20'),
  },
  'hospital-2': {
    hospitalId: 'hospital-2',
    tier: 3,
    score: 6,
    dailyPatients: 30,
    staffCount: 35,
    overtimeFrequency: 'sometimes',
    source: 'verified',
    lastUpdated: new Date('2024-12-15'),
  },
  'hospital-3': {
    hospitalId: 'hospital-3',
    tier: 2,
    score: 4,
    dailyPatients: 35,
    staffCount: 18,
    overtimeFrequency: 'rare',
    source: 'reported',
    lastUpdated: new Date('2024-12-10'),
  },
  'hospital-4': {
    hospitalId: 'hospital-4',
    tier: 3,
    score: 7,
    dailyPatients: 25,
    staffCount: 40,
    overtimeFrequency: 'frequent',
    source: 'verified',
    lastUpdated: new Date('2024-12-08'),
  },
  'hospital-5': {
    hospitalId: 'hospital-5',
    tier: 2,
    score: 3,
    dailyPatients: 20,
    staffCount: 12,
    overtimeFrequency: 'rare',
    source: 'reported',
    lastUpdated: new Date('2024-11-25'),
  },
};

// Fit Test Questions (25문항)
export const mockFitTestQuestions: FitTestQuestion[] = [
  { id: 1, text: '높은 연봉이 직장 선택의 가장 중요한 기준이다.', xWeight: 1, yWeight: 0 },
  { id: 2, text: '안정적인 근무 환경이 성과급보다 중요하다.', xWeight: -0.5, yWeight: -1 },
  { id: 3, text: '새로운 기술을 배우고 성장하는 것이 중요하다.', xWeight: 0, yWeight: 1 },
  { id: 4, text: '동료들과의 관계가 좋은 직장을 선호한다.', xWeight: -1, yWeight: 0 },
  { id: 5, text: '워라밸이 보장되는 직장을 원한다.', xWeight: -0.5, yWeight: -0.5 },
  { id: 6, text: '성과에 따른 인센티브가 동기부여가 된다.', xWeight: 1, yWeight: 0.5 },
  { id: 7, text: '의미 있는 일을 하는 것이 급여보다 중요하다.', xWeight: -1, yWeight: 0.5 },
  { id: 8, text: '장기 근속이 가능한 안정적인 직장을 원한다.', xWeight: 0, yWeight: -1 },
  { id: 9, text: '리더십을 발휘할 수 있는 기회가 중요하다.', xWeight: 0.5, yWeight: 1 },
  { id: 10, text: '복리후생이 좋은 직장을 선호한다.', xWeight: 0.5, yWeight: -0.5 },
  { id: 11, text: '자기계발을 지원해주는 회사가 좋다.', xWeight: 0, yWeight: 1 },
  { id: 12, text: '야근이 적은 직장을 선호한다.', xWeight: -0.5, yWeight: -0.5 },
  { id: 13, text: '회사의 비전과 성장 가능성이 중요하다.', xWeight: 0.5, yWeight: 1 },
  { id: 14, text: '직장 동료가 친구처럼 느껴지면 좋겠다.', xWeight: -1, yWeight: -0.5 },
  { id: 15, text: '연봉 협상에 적극적인 편이다.', xWeight: 1, yWeight: 0 },
  { id: 16, text: '새로운 도전보다는 익숙한 환경이 편하다.', xWeight: 0, yWeight: -1 },
  { id: 17, text: '승진 기회가 많은 직장을 원한다.', xWeight: 0.5, yWeight: 1 },
  { id: 18, text: '출퇴근 시간이 짧은 것이 중요하다.', xWeight: 0, yWeight: -0.5 },
  { id: 19, text: '성과보다 과정을 인정받고 싶다.', xWeight: -0.5, yWeight: 0 },
  { id: 20, text: '전문성을 인정받는 것이 중요하다.', xWeight: 0, yWeight: 0.5 },
  { id: 21, text: '급여가 조금 낮아도 좋은 팀이면 괜찮다.', xWeight: -1, yWeight: 0 },
  { id: 22, text: '체계적인 교육 시스템이 있는 곳이 좋다.', xWeight: 0, yWeight: 1 },
  { id: 23, text: '보너스가 확실한 직장을 선호한다.', xWeight: 1, yWeight: 0 },
  { id: 24, text: '직장에서 가족 같은 분위기를 원한다.', xWeight: -1, yWeight: -0.5 },
  { id: 25, text: '커리어 목표를 위해 도전적인 업무를 원한다.', xWeight: 0.5, yWeight: 1 },
];

// 간단 진단용 질문 (5문항)
export const mockQuickFitQuestions = [
  {
    id: 1,
    text: '지금 가장 중요하게 생각하는 것은?',
    options: [
      { label: '높은 연봉', xWeight: 1, yWeight: 0.5 },
      { label: '워라밸', xWeight: -0.5, yWeight: -0.5 },
      { label: '성장 기회', xWeight: 0, yWeight: 1 },
      { label: '좋은 동료', xWeight: -1, yWeight: -0.5 },
    ],
  },
  {
    id: 2,
    text: '이상적인 직장 분위기는?',
    options: [
      { label: '성과 중심의 경쟁적 환경', xWeight: 1, yWeight: 0.5 },
      { label: '체계적이고 안정적인 환경', xWeight: 0, yWeight: -1 },
      { label: '자유롭고 도전적인 환경', xWeight: 0.5, yWeight: 1 },
      { label: '가족 같은 따뜻한 환경', xWeight: -1, yWeight: -0.5 },
    ],
  },
  {
    id: 3,
    text: '야근이 있지만 인센티브가 좋다면?',
    options: [
      { label: '당연히 한다', xWeight: 1, yWeight: 0 },
      { label: '상황에 따라', xWeight: 0.5, yWeight: 0 },
      { label: '최소화하고 싶다', xWeight: -0.5, yWeight: -0.5 },
      { label: '워라밸이 더 중요', xWeight: -1, yWeight: -1 },
    ],
  },
  {
    id: 4,
    text: '3년 후 나의 모습은?',
    options: [
      { label: '연봉 최상위권', xWeight: 1, yWeight: 0 },
      { label: '안정적인 직장', xWeight: -0.5, yWeight: -1 },
      { label: '전문가로 성장', xWeight: 0, yWeight: 1 },
      { label: '좋은 팀의 일원', xWeight: -1, yWeight: 0 },
    ],
  },
  {
    id: 5,
    text: '가장 피하고 싶은 직장은?',
    options: [
      { label: '연봉이 낮은 곳', xWeight: 1, yWeight: 0 },
      { label: '불안정한 곳', xWeight: -0.5, yWeight: -1 },
      { label: '성장 없는 곳', xWeight: 0, yWeight: 1 },
      { label: '분위기 나쁜 곳', xWeight: -1, yWeight: 0 },
    ],
  },
];

// 추천 분과 데이터 - 하이엔드 성과자 기준
export const mockRecommendedDepartments = {
  high_end_achiever: [
    { name: '피부과', percentage: 89, retention: '2.8년', avgSalary: '380~450만', growth: '+15%' },
    { name: '성형외과', percentage: 85, retention: '2.5년', avgSalary: '400~500만', growth: '+12%' },
    { name: '정형외과', percentage: 73, retention: '2.3년', avgSalary: '350~420만', growth: '+8%' },
  ],
  practical_expert: [
    { name: '피부과', percentage: 82, retention: '3.1년', avgSalary: '350~400만', growth: '+10%' },
    { name: '내과', percentage: 78, retention: '3.5년', avgSalary: '320~380만', growth: '+5%' },
    { name: '정형외과', percentage: 75, retention: '2.8년', avgSalary: '340~400만', growth: '+7%' },
  ],
  self_actualizer: [
    { name: '성형외과', percentage: 80, retention: '2.2년', avgSalary: '380~480만', growth: '+14%' },
    { name: '피부과', percentage: 76, retention: '2.4년', avgSalary: '360~420만', growth: '+11%' },
    { name: '재활의학과', percentage: 72, retention: '3.0년', avgSalary: '330~390만', growth: '+6%' },
  ],
  trust_centered_expert: [
    { name: '내과', percentage: 85, retention: '4.2년', avgSalary: '320~370만', growth: '+4%' },
    { name: '가정의학과', percentage: 80, retention: '4.5년', avgSalary: '310~360만', growth: '+3%' },
    { name: '피부과', percentage: 68, retention: '3.2년', avgSalary: '340~400만', growth: '+8%' },
  ],
};

// 추천 병원 리스트 (진단 결과 기반)
export const mockRecommendedHospitals = {
  high_end_achiever: {
    피부과: [
      { id: 'hospital-1', name: '청담리더스피부과', matchScore: 94, salary: '400~450만', location: '서울 강남', hasColleague: true },
      { id: 'hospital-3', name: '신사동베스트피부과', matchScore: 88, salary: '380~420만', location: '서울 강남', hasColleague: false },
      { id: 'hospital-5', name: '도곡에이치피부과', matchScore: 82, salary: '360~400만', location: '서울 강남', hasColleague: false },
    ],
    성형외과: [
      { id: 'hospital-2', name: '압구정미래성형외과', matchScore: 91, salary: '420~500만', location: '서울 강남', hasColleague: true },
      { id: 'hospital-4', name: '강남아이디성형외과', matchScore: 87, salary: '400~480만', location: '서울 강남', hasColleague: false },
    ],
  },
  practical_expert: {
    피부과: [
      { id: 'hospital-6', name: '논현밸런스피부과', matchScore: 92, salary: '370~400만', location: '서울 강남', hasColleague: true },
      { id: 'hospital-7', name: '역삼안정피부과', matchScore: 86, salary: '350~390만', location: '서울 강남', hasColleague: false },
    ],
    내과: [
      { id: 'hospital-8', name: '강남튼튼내과', matchScore: 89, salary: '340~380만', location: '서울 강남', hasColleague: true },
      { id: 'hospital-9', name: '서초워라밸내과', matchScore: 85, salary: '330~370만', location: '서울 서초', hasColleague: false },
    ],
  },
  self_actualizer: {
    성형외과: [
      { id: 'hospital-10', name: '청담성장성형외과', matchScore: 90, salary: '390~450만', location: '서울 강남', hasColleague: false },
      { id: 'hospital-11', name: '압구정비전성형외과', matchScore: 86, salary: '380~440만', location: '서울 강남', hasColleague: true },
    ],
    피부과: [
      { id: 'hospital-12', name: '신사동아카데미피부과', matchScore: 88, salary: '370~420만', location: '서울 강남', hasColleague: false },
    ],
  },
  trust_centered_expert: {
    내과: [
      { id: 'hospital-13', name: '강남가족내과', matchScore: 93, salary: '330~360만', location: '서울 강남', hasColleague: true },
      { id: 'hospital-14', name: '서초화목내과', matchScore: 88, salary: '320~350만', location: '서울 서초', hasColleague: true },
    ],
    가정의학과: [
      { id: 'hospital-15', name: '역삼우리가정의원', matchScore: 90, salary: '310~350만', location: '서울 강남', hasColleague: false },
    ],
  },
};

// 비슷한 성향 선배들 데이터
export const mockSimilarPeers = {
  high_end_achiever: {
    totalCount: 1247,
    avgTenure: '2.6년',
    avgSalaryIncrease: '+18%',
    topDepartments: ['피부과', '성형외과', '정형외과'],
    testimonials: [
      { id: 1, text: '피부과로 이직 후 연봉이 30% 올랐어요!', department: '피부과', tenure: '2년차' },
      { id: 2, text: '성과급이 확실해서 동기부여가 잘 돼요.', department: '성형외과', tenure: '3년차' },
    ],
  },
  practical_expert: {
    totalCount: 2156,
    avgTenure: '3.2년',
    avgSalaryIncrease: '+12%',
    topDepartments: ['피부과', '내과', '정형외과'],
    testimonials: [
      { id: 1, text: '워라밸이 좋아서 오래 다니고 있어요.', department: '피부과', tenure: '4년차' },
      { id: 2, text: '급여가 안정적이라 만족해요.', department: '내과', tenure: '3년차' },
    ],
  },
  self_actualizer: {
    totalCount: 891,
    avgTenure: '2.4년',
    avgSalaryIncrease: '+15%',
    topDepartments: ['성형외과', '피부과', '재활의학과'],
    testimonials: [
      { id: 1, text: '배울 게 많아서 성장하는 느낌이에요.', department: '성형외과', tenure: '2년차' },
      { id: 2, text: '학회 지원이 좋아요.', department: '피부과', tenure: '3년차' },
    ],
  },
  trust_centered_expert: {
    totalCount: 1834,
    avgTenure: '4.1년',
    avgSalaryIncrease: '+8%',
    topDepartments: ['내과', '가정의학과', '피부과'],
    testimonials: [
      { id: 1, text: '동료들이 정말 좋아서 오래 다녀요.', department: '내과', tenure: '5년차' },
      { id: 2, text: '가족 같은 분위기가 최고예요.', department: '가정의학과', tenure: '4년차' },
    ],
  },
};

// AI 컨시어지 질문 & 답변 셋
export const mockConciergeQA = {
  hospitals: {
    'hospital-1': {
      name: '청담리더스피부과',
      questions: {
        '야근이 자주 있나요?': '청담리더스피부과는 평균 월 3~4회 정도 야근이 있어요. 주로 저녁 시술 예약이 많을 때 발생하고, 야근 수당은 1.5배로 지급됩니다. 재직자 평가에 따르면 "야근은 있지만 보상이 확실해서 괜찮다"는 의견이 많았어요.',
        '인센티브 구조가 어떻게 되나요?': '기본급 외에 시술 건당 인센티브가 있어요. 레이저 시술 1건당 2만원, 필러/보톡스 보조 시 건당 1.5만원 정도입니다. 월 평균 인센티브는 80~150만원 수준이에요.',
        '팀 분위기는 어떤가요?': '성과 중심이지만 경쟁보다는 협력적인 분위기예요. 원장님이 성과를 인정해주시는 편이라 동기부여가 잘 된다는 평가가 많아요. 회원님 같은 "하이엔드 성과자" 유형에게 잘 맞을 거예요!',
        '교육은 어떻게 진행되나요?': '신규 입사자는 2주간 집중 교육을 받아요. 이후에도 월 1회 최신 시술 교육이 있고, 외부 학회 참석비도 지원해줍니다.',
        '점심시간은 어떻게 되나요?': '점심시간은 12:30~14:00 (1시간 30분)이에요. 병원 근처에 맛집이 많고, 가끔 원장님이 팀 점심을 사주시기도 해요.',
      },
    },
    'hospital-2': {
      name: '압구정미래성형외과',
      questions: {
        '야근이 자주 있나요?': '수술 스케줄에 따라 다르지만, 평균 주 2~3회 정도 야근이 있어요. 수술이 길어지면 늦어질 수 있지만, 야근 수당과 식대가 별도로 지급됩니다.',
        '인센티브 구조가 어떻게 되나요?': '수술실 간호사의 경우 수술 건당 인센티브가 있어요. 코 수술 1건당 5만원, 눈 수술 건당 3만원 정도이고, 월 평균 100~200만원의 인센티브를 받을 수 있어요.',
        '팀 분위기는 어떤가요?': '수술 팀워크가 중요해서 협력적인 분위기예요. 긴장감 있는 환경이지만 성취감이 큰 편이라고 해요.',
        '수술 보조 경험이 없어도 되나요?': '경력 3년 이상이면 수술실 경험이 없어도 지원 가능해요. 3개월간 체계적인 수술실 교육을 제공합니다.',
      },
    },
  },
  suggestedQuestions: [
    { category: '급여/복리후생', questions: ['인센티브 구조가 어떻게 되나요?', '성과급은 어떻게 책정되나요?', '복리후생에는 뭐가 있나요?'] },
    { category: '근무환경', questions: ['야근이 자주 있나요?', '점심시간은 어떻게 되나요?', '휴가 사용이 자유로운가요?'] },
    { category: '팀/문화', questions: ['팀 분위기는 어떤가요?', '신입 교육은 어떻게 진행되나요?', '인수인계 기간은 얼마나 되나요?'] },
    { category: '성장/커리어', questions: ['승진 체계가 있나요?', '학회 참석을 지원해주나요?', '전문성을 키울 수 있는 환경인가요?'] },
  ],
};

// Helper: 병원 정보와 매칭 정보 조합
export function getMatchWithHospital(match: Match) {
  const project = mockJobProjects.find((p) => p.id === match.projectId);
  const hospital = mockHospitals.find((h) => h.userId === project?.employerId);
  const intensity = hospital ? mockLaborIntensity[hospital.id] : null;

  return {
    ...match,
    project,
    hospital,
    intensity,
  };
}

// Helper: 잠재 매칭 병원 수 계산
export function getPotentialMatchCount(region: string, licenseType: string): number {
  const baseCounts: Record<string, number> = {
    '서울': 58,
    '경기': 42,
    '부산': 25,
    '대구': 18,
    '인천': 28,
  };
  return baseCounts[region] || Math.floor(Math.random() * 20) + 15;
}

// ============================================
// Employer (구인처) 전용 Mock Data
// ============================================

// 구인처용 병원 프로필 상세
export const mockEmployerProfile = {
  id: 'hospital-1',
  hospitalName: '청담리더스피부과',
  department: '피부과',
  location: '서울 강남구 청담동',
  address: '서울 강남구 청담동 123-45 리더스빌딩 3층',
  phone: '02-1234-5678',
  email: 'hr@cheongdam-leaders.com',
  website: 'www.cheongdam-leaders.com',
  description: '청담동 대표 프리미엄 피부과로, 최신 레이저 장비와 체계적인 시스템을 갖추고 있습니다. 직원 성장을 중시하며 워라밸과 성과 보상의 균형을 추구합니다.',
  foundedYear: 2012,
  employeeCount: 25,
  doctorCount: 3,
  nurseCount: 8,
  staffCount: 14,
  workHours: '09:00 ~ 18:00',
  workDays: '주 5일 (토요일 격주)',
  benefits: ['4대보험', '퇴직금', '인센티브', '성과급', '학회비 지원', '해외연수', '점심 제공', '주차 지원'],
  culture: ['체계적 교육', '수평적 문화', '성과 인정', '워크샵', '팀 회식'],
  equipment: ['최신 레이저 장비', 'LDM', '울쎄라', '인모드', '피부분석기'],
  photos: [],
  rating: 4.5,
  reviewCount: 23,
  profileCompleteness: 90,
  isVerified: true,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-12-20'),
};

// 구인처 채용 현황
export const mockEmployerRecruitmentStatus = {
  activeJobs: 2, // 진행 중인 채용
  totalCandidates: 47, // 전체 후보자 수
  newCandidates: 12, // 새 후보자 (이번 주)
  proposedCandidates: 5, // 제안한 후보자
  interestedCandidates: 8, // 관심 표시한 후보자
  negotiatingCandidates: 2, // 협상 중
  interviewScheduled: 1, // 면접 예정
  avgMatchScore: 87, // 평균 매칭 점수
  avgResponseTime: '1.5일', // 평균 응답 시간
};

// 구인처용 후보자 목록
export const mockCandidates = [
  {
    id: 'candidate-1',
    name: '김민지',
    licenseType: '간호사',
    experience: '3년',
    currentHospital: '강남뷰티의원',
    region: '서울 강남구',
    matchScore: 94,
    fitType: 'high_end_achiever',
    fitTypeLabel: '하이엔드 성과자',
    skills: ['레이저 시술 보조', '보톡스 보조', '필러 보조', '환자 상담'],
    desiredSalary: '400~450만원',
    preferredIntensity: 'high' as const,
    preferredProducts: ['share', 'allowance'],
    status: 'proposed', // proposed, interested, negotiating, interview, hired
    proposedAt: '2일 전',
    isNew: true,
    hasColleagueFit: true,
    profilePhoto: null,
  },
  {
    id: 'candidate-2',
    name: '이서연',
    licenseType: '간호사',
    experience: '5년',
    currentHospital: '논현피부과',
    region: '서울 강남구',
    matchScore: 91,
    fitType: 'practical_expert',
    fitTypeLabel: '실리적 전문가',
    skills: ['레이저 시술', 'IPL', '피부관리', '환자 응대'],
    desiredSalary: '420~480만원',
    preferredIntensity: 'middle' as const,
    preferredProducts: ['allowance', 'bonus'],
    status: 'interested',
    proposedAt: null,
    isNew: true,
    hasColleagueFit: false,
    profilePhoto: null,
  },
  {
    id: 'candidate-3',
    name: '박지현',
    licenseType: '간호사',
    experience: '2년',
    currentHospital: '청담에스테틱',
    region: '서울 강남구',
    matchScore: 88,
    fitType: 'self_actualizer',
    fitTypeLabel: '자아실현가',
    skills: ['피부관리', '상담', '예약관리', 'LDM'],
    desiredSalary: '350~400만원',
    preferredIntensity: 'low' as const,
    preferredProducts: ['vacation', 'bonus'],
    status: 'negotiating',
    proposedAt: '5일 전',
    isNew: false,
    hasColleagueFit: true,
    profilePhoto: null,
  },
  {
    id: 'candidate-4',
    name: '최수민',
    licenseType: '간호사',
    experience: '4년',
    currentHospital: '압구정스킨케어',
    region: '서울 강남구',
    matchScore: 85,
    fitType: 'trust_centered_expert',
    fitTypeLabel: '신뢰 중심 전문가',
    skills: ['환자상담', '시술보조', '의무기록', '재고관리'],
    desiredSalary: '380~420만원',
    preferredIntensity: 'low' as const,
    preferredProducts: ['bonus', 'vacation'],
    status: 'interview',
    proposedAt: '1주일 전',
    isNew: false,
    hasColleagueFit: false,
    profilePhoto: null,
  },
  {
    id: 'candidate-5',
    name: '정유진',
    licenseType: '간호조무사',
    experience: '1년',
    currentHospital: '신사동피부과',
    region: '서울 강남구',
    matchScore: 82,
    fitType: 'high_end_achiever',
    fitTypeLabel: '하이엔드 성과자',
    skills: ['환자응대', '예약관리', '간단한 시술보조'],
    desiredSalary: '280~320만원',
    preferredIntensity: 'high' as const,
    preferredProducts: ['share', 'allowance'],
    status: 'new',
    proposedAt: null,
    isNew: true,
    hasColleagueFit: false,
    profilePhoto: null,
  },
  {
    id: 'candidate-6',
    name: '한소희',
    licenseType: '간호사',
    experience: '4년',
    currentHospital: '역삼더피부과',
    region: '서울 강남구',
    matchScore: 90,
    fitType: 'practical_expert',
    fitTypeLabel: '실리적 전문가',
    skills: ['레이저 시술', '울쎄라', '인모드', '환자 상담'],
    desiredSalary: '430~480만원',
    preferredIntensity: 'middle' as const,
    preferredProducts: ['allowance', 'share'],
    status: 'new',
    proposedAt: null,
    isNew: true,
    hasColleagueFit: true,
    profilePhoto: null,
  },
  {
    id: 'candidate-7',
    name: '오민서',
    licenseType: '간호사',
    experience: '2년',
    currentHospital: '삼성동피부과',
    region: '서울 강남구',
    matchScore: 87,
    fitType: 'self_actualizer',
    fitTypeLabel: '자아실현가',
    skills: ['피부관리', 'LDM', '상담', '시술보조'],
    desiredSalary: '360~400만원',
    preferredIntensity: 'low' as const,
    preferredProducts: ['vacation', 'bonus'],
    status: 'proposed',
    proposedAt: '3일 전',
    isNew: false,
    hasColleagueFit: false,
    profilePhoto: null,
  },
  {
    id: 'candidate-8',
    name: '김나연',
    licenseType: '간호사',
    experience: '6년',
    currentHospital: '도곡동라인의원',
    region: '서울 강남구',
    matchScore: 93,
    fitType: 'high_end_achiever',
    fitTypeLabel: '하이엔드 성과자',
    skills: ['수술보조', '마취보조', '환자관리', '의무기록'],
    desiredSalary: '480~550만원',
    preferredIntensity: 'high' as const,
    preferredProducts: ['share', 'bonus'],
    status: 'interested',
    proposedAt: null,
    isNew: false,
    hasColleagueFit: true,
    profilePhoto: null,
  },
  {
    id: 'candidate-9',
    name: '윤서아',
    licenseType: '간호조무사',
    experience: '3년',
    currentHospital: '선릉역피부과',
    region: '서울 강남구',
    matchScore: 84,
    fitType: 'trust_centered_expert',
    fitTypeLabel: '신뢰 중심 전문가',
    skills: ['예약관리', '환자응대', '피부관리', '재고관리'],
    desiredSalary: '320~360만원',
    preferredIntensity: 'low' as const,
    preferredProducts: ['bonus', 'vacation'],
    status: 'new',
    proposedAt: null,
    isNew: true,
    hasColleagueFit: false,
    profilePhoto: null,
  },
  {
    id: 'candidate-10',
    name: '장하은',
    licenseType: '간호사',
    experience: '5년',
    currentHospital: '대치동피부과',
    region: '서울 강남구',
    matchScore: 89,
    fitType: 'practical_expert',
    fitTypeLabel: '실리적 전문가',
    skills: ['레이저 시술', 'IPL', '보톡스 보조', '필러 보조'],
    desiredSalary: '420~470만원',
    preferredIntensity: 'middle' as const,
    preferredProducts: ['allowance', 'bonus'],
    status: 'proposed',
    proposedAt: '4일 전',
    isNew: false,
    hasColleagueFit: true,
    profilePhoto: null,
  },
];

// 구인처 활동 피드
export const mockEmployerActivity = {
  today: {
    newCandidates: 3,
    profileViews: 15,
    proposalsSent: 2,
    responses: 1,
  },
  recentActivity: [
    { type: 'new_candidate', message: '새 후보자 김민지님이 프로필을 열람했어요', time: '방금 전' },
    { type: 'response', message: '이서연님이 제안에 관심을 표시했어요', time: '1시간 전' },
    { type: 'match', message: '박지현님과 매칭이 성사되었어요', time: '3시간 전' },
    { type: 'interview', message: '최수민님과 내일 면접이 예정되어 있어요', time: '5시간 전' },
    { type: 'new_candidate', message: '정유진님이 관심 병원으로 등록했어요', time: '어제' },
  ],
  weeklyStats: {
    candidatesViewed: 28,
    proposalsSent: 8,
    responses: 5,
    interviews: 2,
    hires: 0,
  },
};

// 채용 공고
export const mockJobPostings = [
  {
    id: 'job-1',
    title: '피부과 경력 간호사',
    department: '피부과',
    position: '간호사',
    experienceRequired: '2년 이상',
    salaryRange: '400~450만원',
    workType: '정규직',
    workHours: '09:00~18:00',
    benefits: ['4대보험', '인센티브', '점심제공', '학회비'],
    requirements: ['레이저 시술 경험', '피부과 경력 2년 이상'],
    status: 'active',
    applicants: 12,
    views: 156,
    createdAt: new Date('2024-12-01'),
    deadline: new Date('2025-01-15'),
  },
  {
    id: 'job-2',
    title: '피부과 신입/경력 간호사',
    department: '피부과',
    position: '간호사',
    experienceRequired: '신입 가능',
    salaryRange: '320~380만원',
    workType: '정규직',
    workHours: '09:00~18:00',
    benefits: ['4대보험', '교육 지원', '점심제공'],
    requirements: ['간호사 면허', '성실하고 배우려는 자세'],
    status: 'active',
    applicants: 35,
    views: 289,
    createdAt: new Date('2024-12-10'),
    deadline: new Date('2025-01-31'),
  },
];

// 구인처 AI 컨시어지 QA
export const mockEmployerConciergeQA = {
  suggestedQuestions: [
    {
      category: '채용/면접',
      questions: [
        '면접 때 어떤 질문을 해야 할까요?',
        '좋은 후보자를 판단하는 기준은?',
        '경력직 채용 시 확인해야 할 사항은?',
        '면접 일정을 어떻게 조율하면 좋을까요?',
      ],
    },
    {
      category: '급여/조건',
      questions: [
        '적정 급여 수준은 어떻게 되나요?',
        '인센티브 구조는 어떻게 설계하나요?',
        '경쟁 병원 대비 우리 조건은 어떤가요?',
        '복리후생으로 뭘 추가하면 좋을까요?',
      ],
    },
    {
      category: '인재 관리',
      questions: [
        '신입 교육은 어떻게 진행하나요?',
        '직원 이탈을 줄이는 방법은?',
        '팀 분위기를 좋게 만드는 방법은?',
        '성과 평가는 어떻게 하나요?',
      ],
    },
    {
      category: '시장 동향',
      questions: [
        '요즘 구직자들이 중요하게 생각하는 건?',
        '피부과 채용 시장 동향은?',
        '경쟁 병원들은 어떻게 채용하나요?',
        '우리 병원 경쟁력은 어떤가요?',
      ],
    },
  ],
  candidateQuestions: {
    'candidate-1': {
      name: '김민지',
      questions: {
        '이 후보자 성향은 어때요?': '김민지님은 "하이엔드 성과자" 유형으로, 성과 보상과 성장 기회를 매우 중시합니다. 인센티브 제도와 교육 기회를 강조하시면 관심을 끌 수 있어요. 비슷한 유형의 동료가 있다면 언급해주세요!',
        '급여 협상 포인트는?': '희망 급여는 400~450만원입니다. 현재 시장 평균보다 약간 높은 수준이에요. 인센티브 구조를 잘 설명하시고, 성과에 따른 추가 보상 가능성을 어필하세요.',
        '면접 때 어떤 걸 물어볼까요?': '성과 중심 성향이니 구체적인 목표와 달성 경험을 물어보세요. "가장 보람있었던 성과", "스트레스 상황에서 대처법" 등을 추천드려요.',
      },
    },
    'candidate-2': {
      name: '이서연',
      questions: {
        '이 후보자 성향은 어때요?': '이서연님은 "실리적 전문가" 유형입니다. 급여와 워라밸 균형을 중시해요. 안정적인 근무환경과 합리적 보상을 강조하시면 좋아요.',
        '급여 협상 포인트는?': '희망 급여가 420~480만원으로 경력 대비 적정 수준입니다. 5년차로 숙련도가 높으니 즉시 전력이 될 수 있어요.',
        '면접 때 어떤 걸 물어볼까요?': '효율성과 체계를 중시하는 분이에요. 업무 프로세스 개선 경험, 팀워크 관련 질문을 추천드려요.',
      },
    },
  },
};

// ============================================
// AI 인터뷰 결과 데이터 (구인처 AI 인터뷰 대시보드용)
// ============================================

export const mockAIInterviewResults = [
  // 완료된 인터뷰 22건
  { id: 'int-completed-1', name: '이지은', experience: '6년', status: 'completed', aiScore: 95, matchRate: 95, interviewDuration: 43, recommendation: 'highly_recommended', strengths: ['리더십', '문제해결능력', '팀워크'], concerns: ['야근 부담'], viewCount: 4, completedAt: '2024-12-29' },
  { id: 'int-completed-2', name: '송혜교', experience: '9년', status: 'completed', aiScore: 95, matchRate: 99, interviewDuration: 42, recommendation: 'highly_recommended', strengths: ['리더십', '문제해결능력', '팀워크'], concerns: ['야근 부담'], viewCount: 2, completedAt: '2024-12-28' },
  { id: 'int-completed-3', name: '한가인', experience: '2년', status: 'completed', aiScore: 94, matchRate: 92, interviewDuration: 47, recommendation: 'recommended', strengths: ['리더십', '문제해결능력', '팀워크'], concerns: ['야근 부담'], viewCount: 3, completedAt: '2024-12-27' },
  { id: 'int-completed-4', name: '김태희', experience: '5년', status: 'completed', aiScore: 94, matchRate: 94, interviewDuration: 44, recommendation: 'recommended', strengths: ['리더십', '문제해결능력', '팀워크'], concerns: ['야근 부담'], viewCount: 3, completedAt: '2024-12-26' },
  { id: 'int-completed-5', name: '박신혜', experience: '8년', status: 'completed', aiScore: 94, matchRate: 94, interviewDuration: 39, recommendation: 'recommended', strengths: ['리더십', '문제해결능력', '팀워크'], concerns: ['야근 부담'], viewCount: 3, completedAt: '2024-12-25' },
  { id: 'int-completed-6', name: '최예진', experience: '4년', status: 'completed', aiScore: 93, matchRate: 91, interviewDuration: 48, recommendation: 'recommended', strengths: ['리더십', '문제해결능력', '팀워크'], concerns: ['야근 부담'], viewCount: 3, completedAt: '2024-12-24' },
  { id: 'int-completed-7', name: '정소영', experience: '9년', status: 'completed', aiScore: 93, matchRate: 97, interviewDuration: 43, recommendation: 'normal', strengths: ['리더십', '문제해결능력', '팀워크'], concerns: ['야근 부담'], viewCount: 3, completedAt: '2024-12-23' },
  { id: 'int-completed-8', name: '강미선', experience: '8년', status: 'completed', aiScore: 93, matchRate: 88, interviewDuration: 37, recommendation: 'normal', strengths: ['리더십', '문제해결능력', '팀워크'], concerns: ['야근 부담'], viewCount: 3, completedAt: '2024-12-22' },
  { id: 'int-completed-9', name: '이서연', experience: '4년', status: 'completed', aiScore: 92, matchRate: 86, interviewDuration: 39, recommendation: 'normal', strengths: ['리더십', '문제해결능력', '팀워크'], concerns: ['야근 부담'], viewCount: 2, completedAt: '2024-12-21' },
  { id: 'int-completed-10', name: '김하늘', experience: '10년', status: 'completed', aiScore: 92, matchRate: 87, interviewDuration: 45, recommendation: 'normal', strengths: ['리더십', '문제해결능력', '팀워크'], concerns: ['야근 부담'], viewCount: 2, completedAt: '2024-12-20' },
  { id: 'int-completed-11', name: '박지호', experience: '3년', status: 'completed', aiScore: 92, matchRate: 84, interviewDuration: 38, recommendation: 'normal', strengths: ['전문성', '성실함'], concerns: ['야근 부담'], viewCount: 4, completedAt: '2024-12-19' },
  { id: 'int-completed-12', name: '유진', experience: '2년', status: 'completed', aiScore: 91, matchRate: 91, interviewDuration: 35, recommendation: 'normal', strengths: ['전문성', '성실함'], concerns: ['야근 부담'], viewCount: 5, completedAt: '2024-12-18' },
  { id: 'int-completed-13', name: '친희지', experience: '2년', status: 'completed', aiScore: 91, matchRate: 86, interviewDuration: 40, recommendation: 'hold', strengths: ['전문성', '성실함'], concerns: ['야근 부담'], viewCount: 5, completedAt: '2024-12-17' },
  { id: 'int-completed-14', name: '김수정', experience: '3년', status: 'completed', aiScore: 91, matchRate: 88, interviewDuration: 47, recommendation: 'hold', strengths: ['전문성', '성실함'], concerns: ['야근 부담'], viewCount: 4, completedAt: '2024-12-16' },
  { id: 'int-completed-15', name: '이민정', experience: '1년', status: 'completed', aiScore: 90, matchRate: 80, interviewDuration: 38, recommendation: 'hold', strengths: ['전문성', '성실함'], concerns: ['야근 부담'], viewCount: 2, completedAt: '2024-12-15' },
  { id: 'int-completed-16', name: '박영희', experience: '3년', status: 'completed', aiScore: 90, matchRate: 85, interviewDuration: 43, recommendation: 'hold', strengths: ['전문성', '성실함'], concerns: ['경력 부족'], viewCount: 5, completedAt: '2024-12-14' },
  { id: 'int-completed-17', name: '최지우', experience: '8년', status: 'completed', aiScore: 90, matchRate: 83, interviewDuration: 37, recommendation: 'hold', strengths: ['전문성', '성실함'], concerns: ['경력 부족'], viewCount: 1, completedAt: '2024-12-13' },
  { id: 'int-completed-18', name: '황지연', experience: '4년', status: 'completed', aiScore: 89, matchRate: 79, interviewDuration: 45, recommendation: 'hold', strengths: ['전문성', '성실함'], concerns: ['경력 부족'], viewCount: 2, completedAt: '2024-12-12' },
  { id: 'int-completed-19', name: '김나연', experience: '2년', status: 'completed', aiScore: 89, matchRate: 83, interviewDuration: 43, recommendation: 'drop', strengths: ['전문성', '성실함'], concerns: ['경력 부족'], viewCount: 2, completedAt: '2024-12-11' },
  { id: 'int-completed-20', name: '서예빈', experience: '7년', status: 'completed', aiScore: 89, matchRate: 77, interviewDuration: 46, recommendation: 'drop', strengths: ['전문성', '성실함'], concerns: ['경력 부족'], viewCount: 1, completedAt: '2024-12-10' },
  { id: 'int-completed-21', name: '장미라', experience: '4년', status: 'completed', aiScore: 88, matchRate: 74, interviewDuration: 44, recommendation: 'drop', strengths: ['전문성', '성실함'], concerns: ['경력 부족'], viewCount: 4, completedAt: '2024-12-09' },
  { id: 'int-completed-22', name: '윤소희', experience: '1년', status: 'completed', aiScore: 88, matchRate: 79, interviewDuration: 46, recommendation: 'drop', strengths: ['전문성', '성실함'], concerns: ['경력 부족'], viewCount: 5, completedAt: '2024-12-08' },
  // 진행중 3건
  { id: 'int-progress-1', name: '김지운', experience: '3년', status: 'in_progress', scheduledAt: '2024-12-27' },
  { id: 'int-progress-2', name: '박성훈', experience: '4년', status: 'in_progress', scheduledAt: '2024-12-26' },
  { id: 'int-progress-3', name: '이현우', experience: '5년', status: 'in_progress', scheduledAt: '2024-12-25' },
  // 예정 3건
  { id: 'int-scheduled-1', name: '최준호', experience: '2년', status: 'scheduled', scheduledAt: '2025-01-01' },
  { id: 'int-scheduled-2', name: '강동원', experience: '3년', status: 'scheduled', scheduledAt: '2025-01-02' },
  { id: 'int-scheduled-3', name: '윤서준', experience: '4년', status: 'scheduled', scheduledAt: '2025-01-03' },
];

// 추천 등급 라벨
export const recommendationLabels: Record<string, { label: string; color: string; bgColor: string }> = {
  highly_recommended: { label: '적극 추천', color: 'text-success', bgColor: 'bg-success/10' },
  recommended: { label: '추천', color: 'text-info', bgColor: 'bg-info/10' },
  normal: { label: '보통', color: 'text-warning', bgColor: 'bg-warning/10' },
  hold: { label: '보류', color: 'text-text-tertiary', bgColor: 'bg-bg-tertiary' },
  drop: { label: '드랍', color: 'text-error', bgColor: 'bg-error/10' },
};

// AI 인터뷰 현황 통계
export const mockAIInterviewStats = {
  totalInterviews: 28,
  totalChange: '+12%',
  avgScore: 85.5,
  conversionRate: 68,
  responseRate: 82,
  completed: 22,
  inProgress: 3,
  scheduled: 3,
};

// ============================================
// 채용상품 설정 데이터 (구인처 매칭센터용)
// ============================================

export const mockHiringProductSettings = {
  salaryRange: { min: 3600, max: 4800 },
  workType: '정규직' as const,
  workHours: { start: '09:00', end: '18:00' },
  weekendWork: false,
  flexibleWork: true,
  hasOnCall: true,
  hasNightShift: false,
  onCallAvg: 4,
  nightShiftAvg: 2,
  compensationType: ['base', 'incentive'] as string[],
  benefits: ['퇴직금', '연차'],
  hiringProducts: {
    share: { enabled: true, value: 1 },
    bonus: { enabled: true, value: 12 },
    vacation: { enabled: false, value: 15 },
    allowance: { enabled: false, value: 150 },
  },
  predictedApplicants: 28,
  predictedAcceptRate: 68,
};

// 채용상품 타입 정보
export const hiringProductTypes = {
  share: { label: '매출 셰어', icon: '💰', color: '#FF2D55', target: '고수익 추구형' },
  bonus: { label: '근속 보너스', icon: '🎁', color: '#AF52DE', target: '안정 추구형' },
  vacation: { label: '휴가 자유', icon: '🏖️', color: '#5AC8FA', target: '워라밸형' },
  allowance: { label: '수당 보장', icon: '💵', color: '#FF9500', target: '실속형' },
};

// ============================================
// 구직자 매칭센터용 병원 데이터 (확장)
// ============================================

export const mockSeekerMatchingHospitals = [
  {
    id: 'hospital-1',
    name: '청담리더스피부과',
    department: '피부과',
    location: '서울 강남구 청담동',
    matchScore: 97,
    salaryRange: '400~450만',
    intensity: 'low' as const,
    intensityLabel: '업무 여유',
    verified: true,
    verifiedType: 'hospital' as const,
    benefits: ['4대보험', '점심 제공', '주차 지원', '인센티브', '학회비'],
    hiringProducts: ['채용상품', '근속 보너스', '휴가 자유'],
    hasColleague: true,
    colleagueMessage: '아는 동료가 이미 근무 중',
    isDirectOffer: true,
    status: 'new' as const,
    statusMessage: null,
    interviewRequested: false,
  },
  {
    id: 'hospital-2',
    name: '압구정미래성형외과',
    department: '성형외과',
    location: '서울 강남구 압구정동',
    matchScore: 98,
    salaryRange: '420~500만',
    intensity: 'middle' as const,
    intensityLabel: '업무 보통',
    verified: true,
    verifiedType: 'facility' as const,
    benefits: ['4대보험', '야근수당', '명절보너스', '성과급'],
    hiringProducts: ['채용상품', '매출 셰어', '수당 보장'],
    hasColleague: false,
    colleagueMessage: null,
    isDirectOffer: false,
    status: 'new' as const,
    statusMessage: null,
    interviewRequested: false,
  },
  {
    id: 'hospital-3',
    name: '신사동베스트피부과',
    department: '피부과',
    location: '서울 강남구 신사동',
    matchScore: 88,
    salaryRange: '380~420만',
    intensity: 'low' as const,
    intensityLabel: '업무 여유',
    verified: true,
    verifiedType: 'hospital' as const,
    benefits: ['4대보험', '교통비', '성과급', '휴가'],
    hiringProducts: ['채용상품', '휴가 자유'],
    hasColleague: false,
    colleagueMessage: null,
    isDirectOffer: false,
    status: 'interview_requested' as const,
    statusMessage: null,
    interviewRequested: true,
  },
  {
    id: 'hospital-4',
    name: '논현뷰티성형외과',
    department: '성형외과',
    location: '서울 강남구 논현동',
    matchScore: 82,
    salaryRange: '350~400만',
    intensity: 'high' as const,
    intensityLabel: '업무 바쁨',
    verified: false,
    verifiedType: 'public_data' as const,
    benefits: ['4대보험', '점심 제공'],
    hiringProducts: [],
    hasColleague: false,
    colleagueMessage: null,
    isDirectOffer: false,
    status: 'in_progress' as const,
    statusMessage: '면접 일정 조율 중',
    interviewRequested: true,
  },
  {
    id: 'hospital-5',
    name: '역삼에이스피부과',
    department: '피부과',
    location: '서울 강남구 역삼동',
    matchScore: 89,
    salaryRange: '380~430만',
    intensity: 'low' as const,
    intensityLabel: '업무 여유',
    verified: true,
    verifiedType: 'facility' as const,
    benefits: ['4대보험', '점심 제공', '교통비 지원', '인센티브'],
    hiringProducts: ['채용상품', '근속 보너스'],
    hasColleague: true,
    colleagueMessage: '아는 동료가 이미 근무 중',
    isDirectOffer: false,
    status: 'new' as const,
    statusMessage: null,
    interviewRequested: false,
  },
  {
    id: 'hospital-6',
    name: '삼성동라인성형외과',
    department: '성형외과',
    location: '서울 강남구 삼성동',
    matchScore: 94,
    salaryRange: '450~520만',
    intensity: 'middle' as const,
    intensityLabel: '업무 보통',
    verified: true,
    verifiedType: 'hospital' as const,
    benefits: ['4대보험', '인센티브', '성과급', '학회비', '해외연수'],
    hiringProducts: ['채용상품', '매출 셰어', '근속 보너스'],
    hasColleague: false,
    colleagueMessage: null,
    isDirectOffer: false,
    status: 'new' as const,
    statusMessage: null,
    interviewRequested: false,
  },
  {
    id: 'hospital-7',
    name: '선릉역더마클리닉',
    department: '피부과',
    location: '서울 강남구 선릉역',
    matchScore: 84,
    salaryRange: '370~410만',
    intensity: 'low' as const,
    intensityLabel: '업무 여유',
    verified: true,
    verifiedType: 'facility' as const,
    benefits: ['4대보험', '점심 제공', '주 5일'],
    hiringProducts: ['채용상품', '휴가 자유'],
    hasColleague: false,
    colleagueMessage: null,
    isDirectOffer: false,
    status: 'interview_requested' as const,
    statusMessage: null,
    interviewRequested: true,
  },
  {
    id: 'hospital-8',
    name: '도곡동프리미엄피부과',
    department: '피부과',
    location: '서울 강남구 도곡동',
    matchScore: 98,
    salaryRange: '400~460만',
    intensity: 'middle' as const,
    intensityLabel: '업무 보통',
    verified: true,
    verifiedType: 'hospital' as const,
    benefits: ['4대보험', '성과급', '교육비', '인센티브', '휴가'],
    hiringProducts: ['채용상품', '근속 보너스', '수당 보장'],
    hasColleague: true,
    colleagueMessage: '아는 동료가 이미 근무 중',
    isDirectOffer: false,
    status: 'new' as const,
    statusMessage: null,
    interviewRequested: false,
  },
  {
    id: 'hospital-9',
    name: '대치동엘리트성형외과',
    department: '성형외과',
    location: '서울 강남구 대치동',
    matchScore: 88,
    salaryRange: '380~440만',
    intensity: 'middle' as const,
    intensityLabel: '업무 보통',
    verified: true,
    verifiedType: 'facility' as const,
    benefits: ['4대보험', '야근수당', '식대', '교통비'],
    hiringProducts: ['채용상품', '수당 보장'],
    hasColleague: false,
    colleagueMessage: null,
    isDirectOffer: false,
    status: 'new' as const,
    statusMessage: null,
    interviewRequested: false,
  },
  {
    id: 'hospital-10',
    name: '잠실롯데피부과',
    department: '피부과',
    location: '서울 송파구 잠실동',
    matchScore: 80,
    salaryRange: '360~400만',
    intensity: 'low' as const,
    intensityLabel: '업무 여유',
    verified: true,
    verifiedType: 'facility' as const,
    benefits: ['4대보험', '점심 제공', '교통비', '휴가'],
    hiringProducts: [],
    hasColleague: false,
    colleagueMessage: null,
    isDirectOffer: false,
    status: 'interview_requested' as const,
    statusMessage: null,
    interviewRequested: true,
  },
];

// 구직자 매칭센터 탭 정보
export const seekerMatchingTabs = [
  { id: 'all', label: '전체', count: 10 },
  { id: 'in_progress', label: '🔥진행 중', count: 1 },
  { id: 'direct_offer', label: '원장님 오퍼', count: 1 },
  { id: 'interview_requested', label: '인터뷰 요청', count: 3 },
];

// 검증 타입 라벨
export const verifiedTypeLabels: Record<string, { label: string; icon: string }> = {
  hospital: { label: '병원 인증', icon: '✓' },
  facility: { label: '시설정보 포함', icon: '🏥' },
  public_data: { label: '공공데이터 추정', icon: '📊' },
};

// ============================================
// 구인처 매칭센터 - 신규 매칭 리스트용 후보자 데이터 (확장)
// ============================================

export const mockNewMatchingCandidates = [
  {
    id: 'new-candidate-1',
    name: '임소정',
    licenseType: '간호사',
    experience: '3년',
    matchScore: 94,
    fitType: 'high_end_achiever',
    fitTypeLabel: '하이엔드 성과자',
    skills: ['레이저 시술 보조', '보톡스 보조', '필러 보조'],
    preferredIntensity: 'high' as const,
    preferredProducts: ['share', 'allowance'],
    hasColleagueFit: true,
    status: 'new' as const,
    profileImage: null,
  },
  {
    id: 'new-candidate-2',
    name: '노유진',
    licenseType: '간호사',
    experience: '5년',
    matchScore: 91,
    fitType: 'practical_expert',
    fitTypeLabel: '실리적 전문가',
    skills: ['레이저 시술', 'IPL', '피부관리'],
    preferredIntensity: 'middle' as const,
    preferredProducts: ['allowance', 'bonus'],
    hasColleagueFit: false,
    status: 'new' as const,
    profileImage: null,
  },
  {
    id: 'new-candidate-3',
    name: '조은비',
    licenseType: '간호조무사',
    experience: '2년',
    matchScore: 88,
    fitType: 'self_actualizer',
    fitTypeLabel: '자아실현가',
    skills: ['환자 응대', '예약관리', '간단한 시술보조'],
    preferredIntensity: 'low' as const,
    preferredProducts: ['vacation', 'bonus'],
    hasColleagueFit: true,
    status: 'new' as const,
    profileImage: null,
  },
  {
    id: 'new-candidate-4',
    name: '백서윤',
    licenseType: '간호사',
    experience: '4년',
    matchScore: 86,
    fitType: 'trust_centered_expert',
    fitTypeLabel: '신뢰 중심 전문가',
    skills: ['환자상담', '시술보조', '의무기록'],
    preferredIntensity: 'low' as const,
    preferredProducts: ['bonus', 'vacation'],
    hasColleagueFit: false,
    status: 'new' as const,
    profileImage: null,
  },
  {
    id: 'new-candidate-5',
    name: '양지원',
    licenseType: '간호사',
    experience: '4년',
    matchScore: 90,
    fitType: 'practical_expert',
    fitTypeLabel: '실리적 전문가',
    skills: ['레이저 시술', '울쎄라', '인모드'],
    preferredIntensity: 'middle' as const,
    preferredProducts: ['allowance', 'share'],
    hasColleagueFit: true,
    status: 'new' as const,
    profileImage: null,
  },
  {
    id: 'new-candidate-6',
    name: '송민지',
    licenseType: '간호조무사',
    experience: '3년',
    matchScore: 84,
    fitType: 'trust_centered_expert',
    fitTypeLabel: '신뢰 중심 전문가',
    skills: ['예약관리', '환자응대', '피부관리'],
    preferredIntensity: 'low' as const,
    preferredProducts: ['bonus', 'vacation'],
    hasColleagueFit: false,
    status: 'new' as const,
    profileImage: null,
  },
];

// 구인처 매칭센터 상태 필터 탭
export const employerMatchingStatusTabs = [
  { id: 'all', label: '전체', count: 19 },
  { id: 'negotiating', label: '협상중', count: 0 },
  { id: 'interview_scheduled', label: '대면면접 예정', count: 0 },
  { id: 'ai_interview', label: 'AI인터뷰', count: 0 },
  { id: 'new', label: '신규', count: 19 },
];
