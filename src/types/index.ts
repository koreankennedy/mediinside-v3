// ============================================
// MediInside Type Definitions
// ============================================

// User Types
export type UserRole = 'seeker' | 'employer' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

// Seeker Types
export type FitType =
  | 'high_end_achiever'      // 하이엔드 성과자
  | 'practical_expert'       // 실리적 전문가
  | 'self_actualizer'        // 자아실현가
  | 'trust_centered_expert'; // 신뢰 중심 전문가

export type LicenseType =
  | 'dental_hygienist'  // 치과위생사
  | 'nurse'             // 간호사
  | 'nurse_aide'        // 간호조무사
  | 'radiologist'       // 방사선사
  | 'physical_therapist' // 물리치료사
  | 'other';

export type WorkType = 'full_time' | 'part_time' | 'substitute';

export interface SeekerProfile {
  id: string;
  userId: string;
  name: string;
  phone: string;
  licenseType: LicenseType;
  licenseNumber?: string;
  region: string;
  preferredWorkType: WorkType;
  fitType?: FitType;
  fitXScore?: number;  // -100 to 100 (내적 ↔ 외적)
  fitYScore?: number;  // -100 to 100 (안정 ↔ 성장)
  skills: string[];
  experience: Experience[];
  desiredSalary?: SalaryRange;
  profileCompleteness: number;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  id: string;
  hospitalName: string;
  department: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description?: string;
}

export interface SalaryRange {
  min: number;
  max: number;
}

// Employer Types
export interface EmployerProfile {
  id: string;
  userId: string;
  hospitalName: string;
  department: string;
  location: string;
  address: string;
  description?: string;
  employeeCount?: number;
  foundedYear?: number;
  benefits: string[];
  photos: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface JobProject {
  id: string;
  employerId: string;
  title: string;
  licenseType: LicenseType;
  department: string;
  workType: WorkType;
  salaryRange: SalaryRange;
  requirements: JobRequirements;
  preferences: JobPreferences;
  description?: string;
  benefits: string[];
  isAiScoutEnabled: boolean;
  dailyScoutLimit: number;
  status: 'draft' | 'active' | 'paused' | 'closed';
  deadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobRequirements {
  minExperienceYears: number;
  requiredSkills: string[];
  requiredCertifications: string[];
  locationRadius: number; // km
}

export interface JobPreferences {
  preferredSkills: string[];
  preferredFitTypes: FitType[];
  preferredExperienceYears?: number;
}

// Matching Types
export type MatchStatus =
  | 'proposed'      // AI/구인처가 제안
  | 'viewed'        // 구직자가 확인
  | 'interested'    // 구직자가 관심 표시
  | 'negotiating'   // 조건 협상 중
  | 'interview'     // 면접 예정
  | 'final'         // 최종 협상
  | 'accepted'      // 수락
  | 'rejected'      // 거절
  | 'expired';      // 만료

export type ProposedBy = 'ai' | 'employer';

export interface Match {
  id: string;
  seekerId: string;
  projectId: string;
  matchScore: number;  // 0-100
  scoreBreakdown: MatchScoreBreakdown;
  status: MatchStatus;
  proposedBy: ProposedBy;
  proposedAt: Date;
  message?: string;
  counterOffer?: CounterOffer;
  createdAt: Date;
  updatedAt: Date;
}

export interface MatchScoreBreakdown {
  experience: number;    // 경력 일치도
  skills: number;        // 술기 일치도
  fitType: number;       // 성향 일치도
  location: number;      // 지역 일치도
}

export interface CounterOffer {
  desiredSalary?: number;
  desiredWorkHours?: string;
  additionalRequests?: string;
  submittedAt: Date;
}

// Labor Intensity Types
export type IntensityTier = 1 | 2 | 3;

export interface LaborIntensity {
  hospitalId: string;
  tier: IntensityTier;
  score: number;  // 1-10
  dailyPatients?: number;
  staffCount?: number;
  overtimeFrequency?: 'rare' | 'sometimes' | 'frequent';
  source: 'estimated' | 'reported' | 'verified';
  lastUpdated: Date;
}

// Conversation Types
export type ConversationMode = 'chat' | 'voice';

export interface Conversation {
  id: string;
  matchId: string;
  mode: ConversationMode;
  messages: Message[];
  extractedSkills: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Fit Test Types
export interface FitTestQuestion {
  id: number;
  text: string;
  xWeight: number;  // X축 영향도 (-1 to 1)
  yWeight: number;  // Y축 영향도 (-1 to 1)
}

export interface FitTestAnswer {
  questionId: number;
  value: 1 | 2 | 3 | 4;  // 매우 아니다 ~ 매우 그렇다
}

export interface FitTestResult {
  xScore: number;
  yScore: number;
  fitType: FitType;
  recommendedDepartments: RecommendedDepartment[];
}

export interface RecommendedDepartment {
  name: string;
  matchPercentage: number;
  seniorRetentionRate: number;
}

// Market Data Types
export interface MarketData {
  region: string;
  department: string;
  averageHourlySalary: number;
  weeklyChangeRate: number;
  demandLevel: 'low' | 'medium' | 'high';
  lastUpdated: Date;
}

// Notification Types
export type NotificationType =
  | 'new_offer'
  | 'offer_viewed'
  | 'counter_offer'
  | 'interview_scheduled'
  | 'offer_accepted'
  | 'offer_rejected'
  | 'profile_incomplete';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
