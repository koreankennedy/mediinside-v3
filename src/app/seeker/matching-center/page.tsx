'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  X,
  MapPin,
  Clock,
  Users,
  Award,
  SlidersHorizontal,
  Sparkles,
  Settings2,
  Check,
  Star,
  Briefcase,
  GraduationCap,
  Calendar,
  DollarSign,
  Building2,
  ChevronRight,
  Phone,
  CheckCircle,
  AlertCircle,
  Info,
  Send,
  Video,
  Lock,
  Gift,
  UserPlus,
  FileText,
  Share2,
} from 'lucide-react';

const DAILY_REJECT_LIMIT = 10;

// Mock data - 피부과/성형외과 기반으로 변경
const mockOffers = [
  {
    id: 1,
    hospital: '청담리더스피부과',
    location: '서울 강남구 청담동',
    salary: '400~450만',
    salaryType: 'monthly',
    matchScore: 94,
    isActive: true,
    proposedBy: 'employer',
    tier: 3 as const,
    intensityScore: 4,
    benefits: ['4대보험', '점심 제공', '주차 지원', '성과급', '교육비 지원'],
    hasColleague: true,
    status: 'proposed',
    proposedAt: '2일 전',
    // 슈퍼프로필 (상세정보)
    superProfile: {
      description: '청담동 대표 피부과로, 레이저 시술 및 피부 관리 전문. 최신 장비와 체계적인 교육 시스템 보유.',
      workHours: '09:00 ~ 18:00 (주 5일)',
      overtime: '월 평균 2~3회 (야근수당 별도)',
      team: { doctors: 3, nurses: 8, staff: 5 },
      culture: ['체계적 교육', '수평적 문화', '워크샵', '생일 파티'],
      equipment: ['최신 레이저 장비', 'LDM', '울쎄라', '인모드'],
      career: '1~3년차 선호 (신입 가능)',
      rating: 4.5,
      reviews: 23,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '2년차', rating: 4.5, content: '교육 시스템이 잘 되어있어서 신입도 적응하기 좋아요. 원장님이 친절하고 분위기가 좋습니다.', verified: true },
        { id: 2, role: '퇴사자', tenure: '1년 근무', rating: 4.0, content: '워라밸이 좋고 급여도 괜찮아요. 다만 바쁜 시즌에는 조금 힘들어요.', verified: true },
      ],
      infoSources: { official: 60, userReport: 30, verified: 10 },
    },
  },
  {
    id: 2,
    hospital: '압구정미래성형외과',
    location: '서울 강남구 압구정동',
    salary: '420~500만',
    salaryType: 'monthly',
    matchScore: 91,
    isActive: false,
    proposedBy: 'ai',
    tier: 2 as const,
    intensityScore: 6,
    benefits: ['4대보험', '야근수당', '명절보너스', '인센티브'],
    hasColleague: false,
    status: 'proposed',
    proposedAt: '3일 전',
    superProfile: {
      description: '코, 눈 성형 전문 클리닉. 높은 수술 건수로 다양한 케이스 경험 가능.',
      workHours: '09:00 ~ 19:00 (주 5.5일)',
      overtime: '월 평균 4~5회',
      team: { doctors: 5, nurses: 12, staff: 8 },
      culture: ['성과 중심', '빠른 성장', '자기개발 지원'],
      equipment: ['수술실 3개', '최신 모니터링 장비'],
      career: '경력 2년 이상',
      rating: 4.2,
      reviews: 18,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '3년차', rating: 4.0, content: '바쁘지만 실력이 많이 늘어요. 성과급이 꽤 괜찮습니다.', verified: true },
      ],
      infoSources: { official: 40, userReport: 50, verified: 10 },
    },
  },
  {
    id: 3,
    hospital: '신사동베스트피부과',
    location: '서울 강남구 신사동',
    salary: '380~420만',
    salaryType: 'monthly',
    matchScore: 88,
    isActive: false,
    proposedBy: 'ai',
    tier: 3 as const,
    intensityScore: 3,
    benefits: ['4대보험', '교통비', '성과급', '연차 보장'],
    hasColleague: false,
    status: 'interested',
    proposedAt: '5일 전',
    superProfile: {
      description: '여유로운 분위기의 피부과. 워라밸을 중시하며 안정적인 근무 환경 제공.',
      workHours: '10:00 ~ 18:30 (주 5일)',
      overtime: '거의 없음',
      team: { doctors: 2, nurses: 5, staff: 3 },
      culture: ['워라밸 보장', '가족적 분위기', '자율 휴가'],
      equipment: ['레이저 장비', '피부 분석기'],
      career: '신입 환영',
      rating: 4.7,
      reviews: 31,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '4년차', rating: 5.0, content: '최고의 워라밸! 야근이 거의 없고 분위기가 정말 좋아요. 오래 다닐 수 있는 곳입니다.', verified: true },
        { id: 2, role: '현직 간호사', tenure: '1년차', rating: 4.5, content: '신입인데 선배들이 잘 가르쳐주세요. 편하게 질문할 수 있는 분위기예요.', verified: true },
        { id: 3, role: '퇴사자', tenure: '2년 근무', rating: 4.5, content: '좋은 곳이었는데 개인 사정으로 퇴사했어요. 급여도 적당하고 복지가 좋습니다.', verified: true },
      ],
      infoSources: { official: 50, userReport: 20, verified: 30 },
    },
  },
  {
    id: 4,
    hospital: '논현뷰티성형외과',
    location: '서울 강남구 논현동',
    salary: '350~400만',
    salaryType: 'monthly',
    matchScore: 82,
    isActive: false,
    proposedBy: 'ai',
    tier: 1 as const,
    intensityScore: 7,
    benefits: ['4대보험', '점심 제공'],
    hasColleague: false,
    status: 'negotiating',
    proposedAt: '1주일 전',
    superProfile: {
      description: '다양한 성형 시술 제공. 바쁘지만 많은 경험을 쌓을 수 있는 환경.',
      workHours: '09:00 ~ 20:00 (주 6일)',
      overtime: '상시',
      team: { doctors: 4, nurses: 10, staff: 6 },
      culture: ['열정적', '빠른 학습'],
      equipment: ['수술실 2개'],
      career: '경력 무관',
      rating: 3.8,
      reviews: 12,
      employeeReviews: [
        { id: 1, role: '퇴사자', tenure: '6개월 근무', rating: 3.0, content: '배울 건 많은데 체력적으로 힘들어요. 젊을 때 경험 삼아 다닐만 합니다.', verified: true },
      ],
      infoSources: { official: 20, userReport: 70, verified: 10 },
    },
  },
  {
    id: 5,
    hospital: '역삼에이스피부과',
    location: '서울 강남구 역삼동',
    salary: '380~430만',
    salaryType: 'monthly',
    matchScore: 86,
    isActive: false,
    proposedBy: 'ai',
    tier: 2 as const,
    intensityScore: 4,
    benefits: ['4대보험', '점심 제공', '교통비 지원', '연차 보장'],
    hasColleague: true,
    status: 'proposed',
    proposedAt: '3일 전',
    superProfile: {
      description: '역삼역 인근 피부과. 직장인 환자가 많아 저녁 시간대 바쁨.',
      workHours: '10:00 ~ 19:00 (주 5일)',
      overtime: '월 2~3회',
      team: { doctors: 2, nurses: 6, staff: 4 },
      culture: ['체계적', '안정적', '교육 지원'],
      equipment: ['레이저 장비', '피부 분석기', 'IPL'],
      career: '1~3년차 선호',
      rating: 4.3,
      reviews: 19,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '2년차', rating: 4.5, content: '안정적이고 체계적인 곳이에요. 야근도 적고 분위기 좋습니다.', verified: true },
      ],
      infoSources: { official: 55, userReport: 35, verified: 10 },
    },
  },
  {
    id: 6,
    hospital: '삼성동라인성형외과',
    location: '서울 강남구 삼성동',
    salary: '450~520만',
    salaryType: 'monthly',
    matchScore: 89,
    isActive: false,
    proposedBy: 'employer',
    tier: 3 as const,
    intensityScore: 6,
    benefits: ['4대보험', '인센티브', '성과급', '학회비 지원', '명절보너스'],
    hasColleague: false,
    status: 'proposed',
    proposedAt: '1일 전',
    superProfile: {
      description: '눈코입 전문 성형외과. 고급 시설과 높은 수술 건수로 경험 축적 가능.',
      workHours: '09:00 ~ 18:30 (주 5.5일)',
      overtime: '월 4~5회',
      team: { doctors: 4, nurses: 10, staff: 7 },
      culture: ['성과 중심', '전문성 개발', '협력적'],
      equipment: ['수술실 4개', '최신 마취 장비', '회복실'],
      career: '경력 3년 이상 우대',
      rating: 4.4,
      reviews: 27,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '4년차', rating: 4.5, content: '급여가 높고 인센티브도 좋아요. 배울 것도 많고요.', verified: true },
      ],
      infoSources: { official: 45, userReport: 40, verified: 15 },
    },
  },
  {
    id: 7,
    hospital: '선릉역더마클리닉',
    location: '서울 강남구 선릉역',
    salary: '370~410만',
    salaryType: 'monthly',
    matchScore: 84,
    isActive: false,
    proposedBy: 'ai',
    tier: 2 as const,
    intensityScore: 3,
    benefits: ['4대보험', '점심 제공', '주 5일'],
    hasColleague: false,
    status: 'interested',
    proposedAt: '4일 전',
    superProfile: {
      description: '피부관리 중심의 클리닉. 여유로운 분위기에서 일할 수 있음.',
      workHours: '09:30 ~ 18:00 (주 5일)',
      overtime: '거의 없음',
      team: { doctors: 2, nurses: 4, staff: 3 },
      culture: ['워라밸', '가족적', '자율적'],
      equipment: ['레이저', 'LDM', '피부관리 장비'],
      career: '신입~3년차',
      rating: 4.6,
      reviews: 15,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '1년차', rating: 4.5, content: '워라밸 최고! 야근 없고 편하게 다닐 수 있어요.', verified: true },
      ],
      infoSources: { official: 50, userReport: 30, verified: 20 },
    },
  },
  {
    id: 8,
    hospital: '도곡동프리미엄피부과',
    location: '서울 강남구 도곡동',
    salary: '400~460만',
    salaryType: 'monthly',
    matchScore: 90,
    isActive: false,
    proposedBy: 'employer',
    tier: 3 as const,
    intensityScore: 5,
    benefits: ['4대보험', '성과급', '교육비', '건강검진', '경조사비'],
    hasColleague: true,
    status: 'proposed',
    proposedAt: '2일 전',
    superProfile: {
      description: '프리미엄 피부과로 VIP 고객 다수. 고급 서비스 경험 가능.',
      workHours: '09:00 ~ 18:00 (주 5일)',
      overtime: '월 3~4회',
      team: { doctors: 3, nurses: 7, staff: 5 },
      culture: ['프로페셔널', '고객 중심', '체계적'],
      equipment: ['최신 레이저', '울쎄라', '인모드', '슈링크'],
      career: '2년 이상 우대',
      rating: 4.5,
      reviews: 22,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '3년차', rating: 4.5, content: '시설도 좋고 환자분들도 좋아요. 급여도 만족스럽습니다.', verified: true },
      ],
      infoSources: { official: 60, userReport: 25, verified: 15 },
    },
  },
  {
    id: 9,
    hospital: '대치동엘리트성형외과',
    location: '서울 강남구 대치동',
    salary: '380~440만',
    salaryType: 'monthly',
    matchScore: 83,
    isActive: false,
    proposedBy: 'ai',
    tier: 2 as const,
    intensityScore: 5,
    benefits: ['4대보험', '야근수당', '식대', '교통비'],
    hasColleague: false,
    status: 'proposed',
    proposedAt: '5일 전',
    superProfile: {
      description: '쌍꺼풀, 코성형 전문. 중견 성형외과로 안정적인 운영.',
      workHours: '09:00 ~ 18:30 (주 5일)',
      overtime: '월 3~4회',
      team: { doctors: 3, nurses: 8, staff: 5 },
      culture: ['안정적', '경험 중심', '협력적'],
      equipment: ['수술실 2개', '회복실', '상담실'],
      career: '1~4년차',
      rating: 4.1,
      reviews: 16,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '2년차', rating: 4.0, content: '배울 것이 많고 선배들이 친절해요. 급여도 괜찮은 편입니다.', verified: true },
      ],
      infoSources: { official: 40, userReport: 45, verified: 15 },
    },
  },
  {
    id: 10,
    hospital: '잠실롯데피부과',
    location: '서울 송파구 잠실동',
    salary: '360~400만',
    salaryType: 'monthly',
    matchScore: 80,
    isActive: false,
    proposedBy: 'ai',
    tier: 2 as const,
    intensityScore: 4,
    benefits: ['4대보험', '점심 제공', '교통비', '연차 보장'],
    hasColleague: false,
    status: 'interested',
    proposedAt: '6일 전',
    superProfile: {
      description: '잠실 롯데타워 인근 피부과. 접근성이 좋고 환자 수 꾸준함.',
      workHours: '10:00 ~ 19:00 (주 5일)',
      overtime: '월 2~3회',
      team: { doctors: 2, nurses: 5, staff: 4 },
      culture: ['친근한', '안정적', '성장 지원'],
      equipment: ['레이저 장비', 'IPL', '피부 분석기'],
      career: '신입 환영',
      rating: 4.2,
      reviews: 14,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '1년차', rating: 4.0, content: '신입도 잘 가르쳐주고 분위기가 좋아요.', verified: true },
      ],
      infoSources: { official: 45, userReport: 40, verified: 15 },
    },
  },
];

// 현재 조건 설정 (정밀진단에서 설정한 값)
const currentConditions = {
  salaryRange: '400~450만원',
  workType: '정규직 (풀타임)',
  workHours: '주 5일 (09:00~18:00)',
  compensationType: '기본급 + 인센티브 밸런스',
  priorities: '급여가 최우선',
};

const tabs = [
  { id: 'all', label: '전체', count: 10 },
  { id: 'active', label: 'Active', count: 1 },
  { id: 'interested', label: '관심', count: 3 },
  { id: 'progress', label: '진행 중', count: 1 },
];

const tierInfo = {
  1: { label: 'AI 추정', color: 'bg-gray-100 text-gray-600' },
  2: { label: '유저 제보', color: 'bg-blue-100 text-blue-600' },
  3: { label: '검증 완료', color: 'bg-green-100 text-green-600' },
};

export default function MatchingCenterPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showConditions, setShowConditions] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<typeof mockOffers[0] | null>(null);
  const [likedOffers, setLikedOffers] = useState<number[]>([]);
  const [rejectedOffers, setRejectedOffers] = useState<number[]>([]);
  const [showInterviewRequest, setShowInterviewRequest] = useState(false);
  const [interviewRequestHospital, setInterviewRequestHospital] = useState<typeof mockOffers[0] | null>(null);
  const [preferredContactTime, setPreferredContactTime] = useState<string>('');
  const [interviewType, setInterviewType] = useState<string>('video');
  const [requestMessage, setRequestMessage] = useState<string>('');

  // 거절 횟수 제한 관련 상태
  const [dailyRejectCount, setDailyRejectCount] = useState(3); // 시뮬레이션: 이미 3회 거절
  const [isRejectLimited, setIsRejectLimited] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<typeof mockOffers[0] | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const remainingRejects = DAILY_REJECT_LIMIT - dailyRejectCount;

  const handleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const offer = mockOffers.find(o => o.id === id);
    if (!likedOffers.includes(id) && offer) {
      setLikedOffers((prev) => [...prev, id]);
      setInterviewRequestHospital(offer);
      setShowInterviewRequest(true);
    } else {
      setLikedOffers((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleSubmitInterviewRequest = () => {
    if (!interviewRequestHospital) return;
    alert(`${interviewRequestHospital.hospital}에 인터뷰 요청을 보냈습니다!\n\n면접 유형: ${interviewType === 'video' ? '화상 면접' : interviewType === 'phone' ? '전화 면접' : '대면 면접'}\n선호 시간: ${preferredContactTime || '상관없음'}`);
    setShowInterviewRequest(false);
    setPreferredContactTime('');
    setInterviewType('video');
    setRequestMessage('');
  };

  // 거절 모달 열기
  const openRejectModal = (offer: typeof mockOffers[0], e: React.MouseEvent) => {
    e.stopPropagation();
    // 거절 횟수가 10회 이상이면 거절 불가
    if (dailyRejectCount >= DAILY_REJECT_LIMIT || isRejectLimited) {
      setIsRejectLimited(true);
      setShowResetModal(true);
      return;
    }
    setRejectTarget(offer);
    setRejectReason('');
    setShowRejectModal(true);
  };

  // 거절 확정
  const confirmReject = () => {
    if (!rejectTarget) return;
    // 거절 횟수가 10회 이상이면 거절 불가
    if (dailyRejectCount >= DAILY_REJECT_LIMIT) {
      setIsRejectLimited(true);
      setShowResetModal(true);
      setShowRejectModal(false);
      return;
    }
    setRejectedOffers((prev) => [...prev, rejectTarget.id]);
    const newCount = dailyRejectCount + 1;
    setDailyRejectCount(newCount);
    setShowRejectModal(false);

    if (newCount >= DAILY_REJECT_LIMIT) {
      setIsRejectLimited(true);
      setTimeout(() => setShowResetModal(true), 300);
    }
  };

  // CTA 모달 상태
  const [showProfileCTA, setShowProfileCTA] = useState(false);
  const [showReferralCTA, setShowReferralCTA] = useState(false);
  const [showEmployeeCTA, setShowEmployeeCTA] = useState(false);
  const [referralPhone, setReferralPhone] = useState('');
  const [referralName, setReferralName] = useState('');

  const handleResetLimit = (option: string) => {
    setShowResetModal(false);
    if (option === 'profile') {
      setShowProfileCTA(true);
    } else if (option === 'referral') {
      setShowReferralCTA(true);
    } else if (option === 'employee') {
      setShowEmployeeCTA(true);
    }
  };

  // CTA 완료 후 거절 횟수 초기화
  const completeReset = () => {
    setDailyRejectCount(0);
    setIsRejectLimited(false);
    setShowProfileCTA(false);
    setShowReferralCTA(false);
    setShowEmployeeCTA(false);
    setReferralPhone('');
    setReferralName('');
  };

  const filteredOffers = mockOffers.filter((offer) => {
    if (rejectedOffers.includes(offer.id)) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return offer.isActive;
    if (activeTab === 'interested') return likedOffers.includes(offer.id);
    if (activeTab === 'progress') return offer.status === 'negotiating';
    return true;
  });

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-dashboard-title">매칭 센터</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowConditions(!showConditions)}
            className="flex items-center gap-1 text-sm text-brand-mint bg-brand-mint/10 px-3 py-2 rounded-lg border border-brand-mint/30"
          >
            <Settings2 className="w-4 h-4" />
            조건변경
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 text-sm text-text-secondary bg-white px-3 py-2 rounded-lg border border-border-light"
          >
            <SlidersHorizontal className="w-4 h-4" />
            필터
          </button>
        </div>
      </div>

      {/* 거절 횟수 표시 */}
      <div className={`mb-4 p-3 rounded-xl flex items-center justify-between ${
        isRejectLimited ? 'bg-error/10 border border-error/20' : remainingRejects <= 3 ? 'bg-warning/10 border border-warning/20' : 'bg-bg-secondary'
      }`}>
        <div className="flex items-center gap-2">
          {isRejectLimited ? (
            <Lock className="w-4 h-4 text-error" />
          ) : (
            <X className="w-4 h-4 text-text-tertiary" />
          )}
          <span className={`text-sm ${isRejectLimited ? 'text-error font-medium' : 'text-text-secondary'}`}>
            {isRejectLimited
              ? '오늘 거절 횟수를 모두 사용했어요'
              : `오늘 남은 거절 횟수: ${remainingRejects}회`}
          </span>
        </div>
        {isRejectLimited && (
          <button
            onClick={() => setShowResetModal(true)}
            className="text-xs text-brand-mint font-medium flex items-center gap-1"
          >
            <Gift className="w-3 h-3" />
            초기화하기
          </button>
        )}
      </div>

      {/* 현재 조건 요약 */}
      <AnimatePresence>
        {showConditions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-2xl p-4 border border-border-light mb-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-text-primary">내 희망 조건</h3>
              <Link href="/seeker/fit-test">
                <button className="text-xs text-brand-mint flex items-center">
                  조건 수정하기
                  <ChevronRight className="w-3 h-3 ml-0.5" />
                </button>
              </Link>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary">희망 급여:</span>
                <span className="font-medium text-text-primary">{currentConditions.salaryRange}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary">근무 형태:</span>
                <span className="font-medium text-text-primary">{currentConditions.workType}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary">근무 시간:</span>
                <span className="font-medium text-text-primary">{currentConditions.workHours}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary">우선순위:</span>
                <span className="font-medium text-brand-mint">{currentConditions.priorities}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border-light">
              <div className="nudge-box text-xs">
                <Sparkles className="w-3 h-3 text-brand-mint inline mr-1" />
                현재 조건에 맞는 병원 <strong>4곳</strong>을 찾았어요!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-brand-mint text-white'
                : 'bg-white text-text-secondary border border-border-light'
            }`}
          >
            {tab.label}
            <span className={`ml-1 ${activeTab === tab.id ? 'text-white/80' : 'text-text-tertiary'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-2xl p-4 border border-border-light mb-4 overflow-hidden"
          >
            <div className="space-y-4">
              <div>
                <label className="text-label block mb-2">정렬</label>
                <div className="flex gap-2 flex-wrap">
                  {['매칭점수순', '급여순', '거리순', '최신순'].map((sort) => (
                    <button
                      key={sort}
                      className="px-3 py-1.5 text-sm bg-bg-secondary rounded-lg text-text-secondary hover:bg-bg-tertiary"
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-label block mb-2">노동강도</label>
                <div className="flex gap-2">
                  {['여유', '보통', '바쁨'].map((level) => (
                    <button
                      key={level}
                      className="px-3 py-1.5 text-sm bg-bg-secondary rounded-lg text-text-secondary hover:bg-bg-tertiary"
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
              <button className="btn-primary w-full btn-sm">
                추천 필터 적용
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedOffer(offer)}
            className={`bg-white rounded-2xl p-4 border-2 cursor-pointer transition-all hover:shadow-card ${
              offer.isActive ? 'border-match-gold' : 'border-border-light'
            }`}
          >
            {/* Active Badge */}
            {offer.isActive && (
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-active">
                  <Award className="w-3 h-3 mr-1" />
                  원장님이 직접 선택
                </span>
              </div>
            )}

            {/* Hospital Info */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-text-primary text-lg">{offer.hospital}</h3>
                <div className="flex items-center gap-1 text-sm text-text-secondary mt-1">
                  <MapPin className="w-4 h-4" />
                  {offer.location}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-brand-mint">{offer.matchScore}%</div>
                <div className="text-xs text-text-tertiary">일치</div>
              </div>
            </div>

            {/* Salary & Tier */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg font-medium text-expert-navy">{offer.salary}</span>
              <span className={`badge-base ${tierInfo[offer.tier].color}`}>
                Tier {offer.tier} · {tierInfo[offer.tier].label}
              </span>
            </div>

            {/* Intensity Bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
                <span>노동강도</span>
                <span>{offer.intensityScore}/10</span>
              </div>
              <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    offer.intensityScore <= 4
                      ? 'bg-intensity-safe'
                      : offer.intensityScore <= 7
                      ? 'bg-warning'
                      : 'bg-intensity-high'
                  }`}
                  style={{ width: `${offer.intensityScore * 10}%` }}
                />
              </div>
            </div>

            {/* Benefits */}
            <div className="flex gap-2 flex-wrap mb-3">
              {offer.benefits.slice(0, 3).map((benefit) => (
                <span
                  key={benefit}
                  className="text-xs bg-bg-secondary text-text-secondary px-2 py-1 rounded"
                >
                  {benefit}
                </span>
              ))}
              {offer.benefits.length > 3 && (
                <span className="text-xs text-text-tertiary">+{offer.benefits.length - 3}</span>
              )}
            </div>

            {/* Colleague Badge */}
            {offer.hasColleague && (
              <div className="nudge-box text-xs mb-3">
                <Users className="w-4 h-4 inline mr-1 text-brand-mint" />
                아는 <strong>동료가 이미 근무 중</strong>인 곳이에요.
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t border-border-light">
              <button
                onClick={(e) => handleLike(offer.id, e)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm rounded-lg font-medium transition-colors ${
                  likedOffers.includes(offer.id)
                    ? 'bg-error/10 text-error'
                    : 'bg-error/10 text-error hover:bg-error/20'
                }`}
              >
                <Heart className={`w-4 h-4 ${likedOffers.includes(offer.id) ? 'fill-error' : ''}`} />
                {likedOffers.includes(offer.id) ? '관심 등록됨' : '관심'}
              </button>
              <Link href={`/seeker/concierge?hospital=${offer.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                <button className="w-full flex items-center justify-center gap-1 py-2 text-sm bg-brand-mint/10 text-brand-mint rounded-lg font-medium hover:bg-brand-mint/20 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  질문하기
                </button>
              </Link>
              <button
                onClick={(e) => openRejectModal(offer, e)}
                className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-bg-secondary text-text-secondary rounded-lg font-medium hover:bg-error/10 hover:text-error transition-colors"
              >
                <X className="w-4 h-4" />
                거절
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Sheet - Offer Detail (슈퍼프로필) */}
      <AnimatePresence>
        {selectedOffer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOffer(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 pb-8">
                {/* Handle */}
                <div className="w-12 h-1.5 bg-bg-tertiary rounded-full mx-auto mb-4" />

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-expert-navy">{selectedOffer.hospital}</h2>
                      {selectedOffer.tier === 3 && (
                        <span className="bg-success/10 text-success text-xs px-2 py-0.5 rounded-full font-medium">
                          검증완료
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-text-secondary">
                      <MapPin className="w-4 h-4" />
                      {selectedOffer.location}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-mint">{selectedOffer.matchScore}%</div>
                    <div className="text-xs text-text-tertiary">매칭 점수</div>
                  </div>
                </div>

                {/* 병원 평점 */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-match-gold fill-match-gold" />
                    <span className="font-semibold">{selectedOffer.superProfile.rating}</span>
                  </div>
                  <span className="text-text-tertiary">·</span>
                  <span className="text-sm text-text-secondary">리뷰 {selectedOffer.superProfile.reviews}개</span>
                </div>

                {/* 병원 소개 */}
                <div className="bg-bg-secondary rounded-xl p-4 mb-4">
                  <p className="text-sm text-text-primary leading-relaxed">
                    {selectedOffer.superProfile.description}
                  </p>
                </div>

                {/* 매칭 점수 상세 */}
                <div className="bg-brand-mint/5 rounded-xl p-4 mb-4 border border-brand-mint/20">
                  <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-brand-mint" />
                    매칭 점수 상세
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: '경력 일치', score: 95 },
                      { label: '술기 일치', score: 90 },
                      { label: '성향 일치', score: 98 },
                      { label: '급여 조건', score: 92 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{item.label}</span>
                        <span className="text-sm font-semibold text-brand-mint">{item.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 근무 조건 */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">근무 조건</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">급여</span>
                      </div>
                      <span className="font-semibold text-expert-navy">{selectedOffer.salary}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">근무 시간</span>
                      </div>
                      <span className="font-medium text-text-primary">{selectedOffer.superProfile.workHours}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">야근/초과근무</span>
                      </div>
                      <span className="font-medium text-text-primary">{selectedOffer.superProfile.overtime}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-sm">경력 요건</span>
                      </div>
                      <span className="font-medium text-text-primary">{selectedOffer.superProfile.career}</span>
                    </div>
                  </div>
                </div>

                {/* 팀 구성 */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">팀 구성</h3>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-bg-secondary rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-expert-navy">{selectedOffer.superProfile.team.doctors}</div>
                      <div className="text-xs text-text-tertiary">의사</div>
                    </div>
                    <div className="flex-1 bg-bg-secondary rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-brand-mint">{selectedOffer.superProfile.team.nurses}</div>
                      <div className="text-xs text-text-tertiary">간호인력</div>
                    </div>
                    <div className="flex-1 bg-bg-secondary rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-info">{selectedOffer.superProfile.team.staff}</div>
                      <div className="text-xs text-text-tertiary">기타 직원</div>
                    </div>
                  </div>
                </div>

                {/* 병원 문화 */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">병원 문화</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOffer.superProfile.culture.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-brand-mint/10 text-brand-mint rounded-full text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 보유 장비 */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">보유 장비</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOffer.superProfile.equipment.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-bg-secondary text-text-secondary rounded-full text-sm"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 복리후생 */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">복리후생</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOffer.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="px-3 py-1.5 bg-success/10 text-success rounded-full text-sm flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 정보 제공자 (S4: 정보티어별 제공자 표시) */}
                {selectedOffer.superProfile.infoSources && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-info" />
                      정보 출처
                    </h3>
                    <div className="bg-bg-secondary rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">공식 정보 (병원 등록)</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                            <div className="h-full bg-expert-navy rounded-full" style={{ width: `${selectedOffer.superProfile.infoSources.official}%` }} />
                          </div>
                          <span className="text-xs font-medium text-expert-navy">{selectedOffer.superProfile.infoSources.official}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-warning" />
                          유저 제보
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                            <div className="h-full bg-warning rounded-full" style={{ width: `${selectedOffer.superProfile.infoSources.userReport}%` }} />
                          </div>
                          <span className="text-xs font-medium text-warning">{selectedOffer.superProfile.infoSources.userReport}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-success" />
                          검증됨
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                            <div className="h-full bg-success rounded-full" style={{ width: `${selectedOffer.superProfile.infoSources.verified}%` }} />
                          </div>
                          <span className="text-xs font-medium text-success">{selectedOffer.superProfile.infoSources.verified}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 직원 리뷰 (S4: 직원 리뷰 추가) */}
                {selectedOffer.superProfile.employeeReviews && selectedOffer.superProfile.employeeReviews.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-mint" />
                      직원 리뷰
                      <span className="text-xs bg-brand-mint/10 text-brand-mint px-2 py-0.5 rounded-full">
                        {selectedOffer.superProfile.employeeReviews.length}개
                      </span>
                    </h3>
                    <div className="space-y-3">
                      {selectedOffer.superProfile.employeeReviews.map((review: {id: number; role: string; tenure: string; rating: number; content: string; verified: boolean}) => (
                        <div key={review.id} className="bg-white border border-border-light rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                review.role.includes('현직') ? 'bg-success/10 text-success' : 'bg-bg-secondary text-text-secondary'
                              }`}>
                                {review.role}
                              </span>
                              <span className="text-xs text-text-tertiary">{review.tenure}</span>
                              {review.verified && (
                                <CheckCircle className="w-3 h-3 text-success" />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-match-gold fill-match-gold" />
                              <span className="text-xs font-bold">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed">&ldquo;{review.content}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 동료 정보 */}
                {selectedOffer.hasColleague && (
                  <div className="nudge-box-highlight mb-4">
                    <Users className="w-4 h-4 inline mr-1 text-brand-mint" />
                    비슷한 성향의 <strong>동료가 이미 근무 중</strong>이에요. 적응이 더 쉬울 거예요!
                  </div>
                )}

                {/* 검증 상태 */}
                {selectedOffer.tier === 3 && (
                  <div className="nudge-box mb-4">
                    <Award className="w-4 h-4 inline mr-1 text-brand-mint" />
                    이 정보는 <strong>실제 재직자 제보</strong>로 검증됐어요.
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 mt-6">
                  <button
                    onClick={() => {
                      setLikedOffers((prev) =>
                        prev.includes(selectedOffer.id)
                          ? prev
                          : [...prev, selectedOffer.id]
                      );
                      alert('관심 병원으로 등록되었습니다. 곧 연락드릴게요!');
                    }}
                    className="btn-primary w-full"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    이 병원과 연결 요청하기
                  </button>
                  <Link href={`/seeker/concierge?hospital=${selectedOffer.id}`}>
                    <button className="btn-outline w-full">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      AI 컨시어지에게 더 물어보기
                    </button>
                  </Link>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setLikedOffers((prev) =>
                          prev.includes(selectedOffer.id)
                            ? prev
                            : [...prev, selectedOffer.id]
                        );
                        setSelectedOffer(null);
                      }}
                      className={`flex-1 py-2.5 rounded-xl border font-medium transition-all ${
                        likedOffers.includes(selectedOffer.id)
                          ? 'border-brand-mint bg-brand-mint/10 text-brand-mint'
                          : 'border-border-light text-text-secondary hover:border-brand-mint hover:text-brand-mint'
                      }`}
                    >
                      <Heart className={`w-4 h-4 inline mr-1 ${likedOffers.includes(selectedOffer.id) ? 'fill-brand-mint' : ''}`} />
                      {likedOffers.includes(selectedOffer.id) ? '관심 등록됨' : '관심 등록'}
                    </button>
                    <button
                      onClick={() => {
                        setRejectedOffers((prev) => [...prev, selectedOffer.id]);
                        setSelectedOffer(null);
                      }}
                      className="flex-1 py-2.5 rounded-xl border border-border-light text-text-secondary hover:border-error hover:text-error hover:bg-error/5 font-medium transition-all"
                    >
                      <X className="w-4 h-4 inline mr-1" />
                      관심 없음
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 인터뷰 요청 모달 */}
      <AnimatePresence>
        {showInterviewRequest && interviewRequestHospital && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowInterviewRequest(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-border-light px-4 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-bold">인터뷰 요청</h2>
                <button onClick={() => setShowInterviewRequest(false)}>
                  <X className="w-6 h-6 text-text-tertiary" />
                </button>
              </div>

              <div className="p-4 space-y-5">
                {/* 병원 정보 요약 */}
                <div className="bg-success/5 border border-success/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <span className="font-semibold text-success">관심 등록 완료!</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-brand-mint/10 rounded-xl flex items-center justify-center">
                      <Building2 className="w-7 h-7 text-brand-mint" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-text-primary text-lg">{interviewRequestHospital.hospital}</div>
                      <div className="text-sm text-text-secondary">{interviewRequestHospital.location}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-brand-mint">{interviewRequestHospital.matchScore}%</div>
                      <div className="text-xs text-text-tertiary">매칭</div>
                    </div>
                  </div>
                </div>

                {/* 인터뷰 요청 옵션 */}
                <div className="bg-brand-mint/5 border border-brand-mint/20 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-brand-mint" />
                    <span className="font-semibold text-brand-mint">인터뷰 요청하기</span>
                  </div>
                  <p className="text-sm text-text-secondary mb-4">
                    바로 인터뷰를 요청하시면 병원에서 더 빠르게 연락드려요!
                  </p>

                  {/* 면접 유형 선택 */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <Video className="w-4 h-4 text-info" />
                      선호 면접 유형
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'video', label: '화상 면접', icon: Video },
                        { id: 'phone', label: '전화 면접', icon: Phone },
                        { id: 'inperson', label: '대면 면접', icon: Building2 },
                      ].map((type) => (
                        <button
                          key={type.id}
                          onClick={() => setInterviewType(type.id)}
                          className={`p-3 rounded-xl text-sm font-medium flex flex-col items-center gap-2 transition-all ${
                            interviewType === type.id
                              ? 'bg-brand-mint text-white'
                              : 'bg-white border border-border-light text-text-primary hover:border-brand-mint'
                          }`}
                        >
                          <type.icon className="w-5 h-5" />
                          {type.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 선호 연락 시간 */}
                  <div className="mb-4">
                    <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-warning" />
                      선호 연락 시간
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {['오전 (09~12시)', '오후 (12~18시)', '저녁 (18~21시)', '상관없음'].map((time) => (
                        <button
                          key={time}
                          onClick={() => setPreferredContactTime(time)}
                          className={`p-3 rounded-xl text-sm font-medium transition-all ${
                            preferredContactTime === time
                              ? 'bg-warning text-white'
                              : 'bg-white border border-border-light text-text-primary hover:border-warning'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 추가 메시지 */}
                  <div>
                    <h3 className="font-semibold text-text-primary mb-2">추가 메시지 (선택)</h3>
                    <textarea
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      placeholder="병원에 전달할 메시지가 있다면 입력해주세요"
                      className="w-full p-3 border border-border-light rounded-xl text-sm resize-none h-20 placeholder:text-text-tertiary"
                    />
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="space-y-3 pt-2 pb-4">
                  <button
                    onClick={handleSubmitInterviewRequest}
                    className="w-full py-4 bg-brand-mint text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    인터뷰 요청 보내기
                  </button>
                  <button
                    onClick={() => setShowInterviewRequest(false)}
                    className="w-full py-3 border border-border-light text-text-secondary rounded-xl font-medium"
                  >
                    나중에 요청하기
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 거절 확인 모달 */}
      <AnimatePresence>
        {showRejectModal && rejectTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setShowRejectModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl max-w-md mx-auto"
            >
              <div className="p-6">
                <div className="w-14 h-14 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <X className="w-7 h-7 text-error" />
                </div>

                <h2 className="text-lg font-bold text-center text-text-primary mb-2">
                  이 병원을 거절하시겠어요?
                </h2>
                <p className="text-sm text-text-secondary text-center mb-4">
                  <strong className="text-text-primary">{rejectTarget.hospital}</strong>을(를) 매칭 리스트에서 제외합니다.
                </p>

                {/* 남은 거절 횟수 */}
                <div className="bg-bg-secondary rounded-xl p-3 mb-5 text-center">
                  <span className="text-sm text-text-secondary">
                    오늘 남은 거절 횟수: <strong className="text-error">{remainingRejects}회</strong> / {DAILY_REJECT_LIMIT}회
                  </span>
                </div>

                {/* 버튼 */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 py-3 border border-border-light text-text-primary rounded-xl font-medium"
                  >
                    취소
                  </button>
                  <button
                    onClick={confirmReject}
                    className="flex-1 py-3 bg-error text-white rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    거절하기
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 거절 횟수 초기화 모달 */}
      <AnimatePresence>
        {showResetModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResetModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl max-w-md mx-auto overflow-hidden"
            >
              <div className="p-5">
                <div className="text-center mb-5">
                  <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Lock className="w-8 h-8 text-error" />
                  </div>
                  <h2 className="text-lg font-bold text-text-primary mb-1">오늘 거절 횟수 소진</h2>
                  <p className="text-sm text-text-secondary">
                    하루 {DAILY_REJECT_LIMIT}회까지 거절할 수 있어요.<br />
                    아래 방법으로 바로 초기화할 수 있어요!
                  </p>
                </div>

                <div className="space-y-3 mb-5">
                  <Link href="/seeker/profile">
                    <button
                      onClick={() => handleResetLimit('profile')}
                      className="w-full p-4 bg-brand-mint/10 border border-brand-mint/20 rounded-xl flex items-center gap-4 hover:bg-brand-mint/20 transition-colors"
                    >
                      <div className="w-12 h-12 bg-brand-mint rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-text-primary">프로필 완성도 올리기</div>
                        <div className="text-xs text-text-secondary">자격증, 경력 등을 추가하면 초기화!</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-brand-mint" />
                    </button>
                  </Link>

                  <button
                    onClick={() => handleResetLimit('referral')}
                    className="w-full p-4 bg-expert-navy/5 border border-expert-navy/10 rounded-xl flex items-center gap-4 hover:bg-expert-navy/10 transition-colors"
                  >
                    <div className="w-12 h-12 bg-expert-navy rounded-xl flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-text-primary">원장님/구인처 소개하기</div>
                      <div className="text-xs text-text-secondary">주변에 채용 중인 곳을 소개해주세요!</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-expert-navy" />
                  </button>

                  <button
                    onClick={() => handleResetLimit('employee')}
                    className="w-full p-4 bg-success/5 border border-success/10 rounded-xl flex items-center gap-4 hover:bg-success/10 transition-colors"
                  >
                    <div className="w-12 h-12 bg-success rounded-xl flex items-center justify-center">
                      <Share2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-text-primary">직원 소개하기</div>
                      <div className="text-xs text-text-secondary">주변 동료나 친구를 소개해주세요!</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-success" />
                  </button>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setShowResetModal(false)}
                    className="text-sm text-text-tertiary"
                  >
                    내일 다시 이용할게요
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* 원장님/구인처 소개하기 CTA 모달 */}
        {showReferralCTA && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowReferralCTA(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl max-w-md mx-auto overflow-hidden"
            >
              <div className="p-5">
                <div className="text-center mb-5">
                  <div className="w-16 h-16 bg-expert-navy/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="w-8 h-8 text-expert-navy" />
                  </div>
                  <h2 className="text-lg font-bold text-text-primary mb-1">원장님/구인처 소개하기</h2>
                  <p className="text-sm text-text-secondary">
                    채용 중인 병원을 소개해주세요!<br />
                    소개해주시면 거절 횟수가 초기화됩니다.
                  </p>
                </div>

                <div className="space-y-4 mb-5">
                  <div>
                    <label className="text-sm font-medium text-text-secondary block mb-2">병원명 또는 원장님 성함</label>
                    <input
                      type="text"
                      value={referralName}
                      onChange={(e) => setReferralName(e.target.value)}
                      placeholder="예: 청담스마일치과 / 김원장님"
                      className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-expert-navy/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary block mb-2">연락처</label>
                    <input
                      type="tel"
                      value={referralPhone}
                      onChange={(e) => setReferralPhone(e.target.value)}
                      placeholder="예: 010-1234-5678"
                      className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-expert-navy/50"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (referralName && referralPhone) {
                        alert(`${referralName}님께 MediInside 구인처 초대 링크를 발송했습니다!`);
                        completeReset();
                      } else {
                        alert('병원명/성함과 연락처를 모두 입력해주세요.');
                      }
                    }}
                    className="w-full py-3 bg-expert-navy text-white rounded-xl font-semibold"
                  >
                    초대 링크 보내기
                  </button>
                  <button
                    onClick={() => setShowReferralCTA(false)}
                    className="w-full py-3 text-text-tertiary text-sm"
                  >
                    취소
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* 직원 소개하기 CTA 모달 */}
        {showEmployeeCTA && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEmployeeCTA(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl max-w-md mx-auto overflow-hidden"
            >
              <div className="p-5">
                <div className="text-center mb-5">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Share2 className="w-8 h-8 text-success" />
                  </div>
                  <h2 className="text-lg font-bold text-text-primary mb-1">직원 소개하기</h2>
                  <p className="text-sm text-text-secondary">
                    이직을 고민하는 동료를 소개해주세요!<br />
                    소개해주시면 거절 횟수가 초기화됩니다.
                  </p>
                </div>

                <div className="space-y-4 mb-5">
                  <div>
                    <label className="text-sm font-medium text-text-secondary block mb-2">소개할 분 성함</label>
                    <input
                      type="text"
                      value={referralName}
                      onChange={(e) => setReferralName(e.target.value)}
                      placeholder="예: 김민지"
                      className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-success/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary block mb-2">연락처</label>
                    <input
                      type="tel"
                      value={referralPhone}
                      onChange={(e) => setReferralPhone(e.target.value)}
                      placeholder="예: 010-1234-5678"
                      className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-success/50"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => {
                      if (referralName && referralPhone) {
                        alert(`${referralName}님께 MediInside 초대 링크를 발송했습니다!`);
                        completeReset();
                      } else {
                        alert('성함과 연락처를 모두 입력해주세요.');
                      }
                    }}
                    className="w-full py-3 bg-success text-white rounded-xl font-semibold"
                  >
                    초대 링크 보내기
                  </button>
                  <button
                    onClick={() => setShowEmployeeCTA(false)}
                    className="w-full py-3 text-text-tertiary text-sm"
                  >
                    취소
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}

        {/* 프로필 완성 CTA 모달 */}
        {showProfileCTA && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProfileCTA(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl max-w-md mx-auto overflow-hidden"
            >
              <div className="p-5">
                <div className="text-center mb-5">
                  <div className="w-16 h-16 bg-brand-mint/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8 text-brand-mint" />
                  </div>
                  <h2 className="text-lg font-bold text-text-primary mb-1">프로필 완성하기</h2>
                  <p className="text-sm text-text-secondary">
                    프로필 정보를 더 추가해주세요!<br />
                    완성도가 높을수록 더 좋은 매칭을 받을 수 있어요.
                  </p>
                </div>

                <div className="bg-bg-secondary rounded-xl p-4 mb-5">
                  <div className="text-sm font-medium text-text-primary mb-3">추가하면 좋은 정보</div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Gift className="w-4 h-4 text-brand-mint" />
                      <span>자격증 및 면허증 등록</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Gift className="w-4 h-4 text-brand-mint" />
                      <span>경력 상세 정보</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Gift className="w-4 h-4 text-brand-mint" />
                      <span>보유 술기 업데이트</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Gift className="w-4 h-4 text-brand-mint" />
                      <span>희망 조건 설정</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/seeker/profile">
                    <button
                      onClick={() => completeReset()}
                      className="w-full py-3 bg-brand-mint text-white rounded-xl font-semibold"
                    >
                      프로필 수정하러 가기
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowProfileCTA(false)}
                    className="w-full py-3 text-text-tertiary text-sm"
                  >
                    나중에 할게요
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
