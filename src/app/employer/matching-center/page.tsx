'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Send,
  Heart,
  MessageCircle,
  Calendar,
  CheckCircle,
  Clock,
  ChevronRight,
  Sparkles,
  Phone,
  X,
  Mail,
  MapPin,
  Briefcase,
  DollarSign,
  TrendingUp,
  Target,
  Shield,
  Star,
  XCircle,
  Lock,
  FileText,
  UserPlus,
  Share2,
  Check,
  Copy,
  Building2,
  Settings,
  ListFilter,
  SlidersHorizontal,
  ChevronDown,
  ChevronLeft,
  Gift,
  Plane,
  Coins,
  PieChart,
  Zap,
  Eye,
  AlertCircle,
  Brain,
  AlertTriangle,
} from 'lucide-react';
import {
  mockCandidates,
  mockHiringProductSettings,
  mockNewMatchingCandidates,
  employerMatchingStatusTabs,
  mockJobPostings
} from '@/lib/mock/data';
import { useGlobalRejectCount } from '@/lib/hooks/useGlobalRejectCount';

// 새로운 3탭 구조
const mainTabs = [
  { id: 'product-settings', label: '채용상품 설정', icon: Settings },
  { id: 'new-matching', label: '신규 매칭 리스트', icon: Sparkles },
  { id: 'all-matching', label: '전체 매칭 리스트', icon: Users },
];

// 상태 필터 (신규 매칭 리스트용) - 신규 15명만 표시
const statusFilters = [
  { id: 'all', label: '전체', count: 15 },
  { id: 'new', label: '신규', count: 15 },
];

// 채용상품 설정 하위 탭
const productSettingSubTabs = [
  { id: 'existing', label: '기존 채용상품 설정' },
  { id: 'new', label: '신규상품 설정' },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  new: { label: '신규', color: 'text-brand-mint', bgColor: 'bg-brand-mint/10' },
  proposed: { label: '제안완료', color: 'text-info', bgColor: 'bg-info/10' },
  interested: { label: '관심표시', color: 'text-error', bgColor: 'bg-error/10' },
  negotiating: { label: '협상중', color: 'text-warning', bgColor: 'bg-warning/10' },
  interview: { label: '면접예정', color: 'text-success', bgColor: 'bg-success/10' },
  'ai-interview': { label: 'AI인터뷰', color: 'text-info', bgColor: 'bg-info/10' },
};

// 업무강도 정보
const intensityInfo: Record<string, { label: string; color: string; bgColor: string }> = {
  low: { label: '여유', color: 'text-success', bgColor: 'bg-success/10' },
  middle: { label: '보통', color: 'text-warning', bgColor: 'bg-warning/10' },
  high: { label: '바쁨', color: 'text-error', bgColor: 'bg-error/10' },
};

// 채용상품 정보
const productInfo: Record<string, { label: string; color: string; icon: string; description: string }> = {
  share: { label: '매출 셰어', color: '#FF2D55', icon: '💰', description: '매출의 일정 비율을 인센티브로' },
  bonus: { label: '근속 보너스', color: '#AF52DE', icon: '🎁', description: '장기 근속 시 특별 보너스' },
  vacation: { label: '휴가 자유', color: '#5AC8FA', icon: '🏖️', description: '자유로운 휴가 사용' },
  allowance: { label: '수당 보장', color: '#FF9500', icon: '💵', description: '야간/주말 수당 보장' },
};

// 보상형태 옵션
const compensationOptions = [
  { id: 'base', label: '기본급', description: '안정적인 월급제' },
  { id: 'incentive', label: '인센티브', description: '성과 기반 보상' },
  { id: 'share', label: '매출 셰어', description: '매출 일정 비율' },
  { id: 'bonus', label: '성과급', description: '분기/연간 보너스' },
];

// 근무시간 옵션
const workHourOptions = [
  '09:00 - 18:00',
  '09:30 - 18:30',
  '10:00 - 19:00',
  '10:00 - 20:00',
  '자율 출퇴근',
];

function MatchingCenterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTab = searchParams.get('tab') || 'product-settings';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [sortOption, setSortOption] = useState('match');
  const [selectedCandidate, setSelectedCandidate] = useState<typeof mockNewMatchingCandidates[0] | null>(null);

  // 채용상품 설정 상태
  const [salaryMin, setSalaryMin] = useState(mockHiringProductSettings.salaryRange.min);
  const [salaryMax, setSalaryMax] = useState(mockHiringProductSettings.salaryRange.max);
  const [workType, setWorkType] = useState(mockHiringProductSettings.workType);
  const [workHours, setWorkHours] = useState(`${mockHiringProductSettings.workHours.start} - ${mockHiringProductSettings.workHours.end}`);
  const [hasOnCall, setHasOnCall] = useState(mockHiringProductSettings.hasOnCall);
  const [hasNightShift, setHasNightShift] = useState(mockHiringProductSettings.hasNightShift);
  const [compensation, setCompensation] = useState<string[]>(mockHiringProductSettings.compensationType);

  // 채용상품 토글 상태
  const [productShare, setProductShare] = useState(mockHiringProductSettings.hiringProducts.share.enabled);
  const [productBonus, setProductBonus] = useState(mockHiringProductSettings.hiringProducts.bonus.enabled);
  const [productVacation, setProductVacation] = useState(mockHiringProductSettings.hiringProducts.vacation.enabled);
  const [productAllowance, setProductAllowance] = useState(mockHiringProductSettings.hiringProducts.allowance.enabled);

  // 채용상품 상세 값
  const [sharePercent, setSharePercent] = useState(mockHiringProductSettings.hiringProducts.share.value);
  const [bonusMonths, setBonusMonths] = useState(mockHiringProductSettings.hiringProducts.bonus.value);
  const [vacationDays, setVacationDays] = useState(mockHiringProductSettings.hiringProducts.vacation.value);
  const [allowancePercent, setAllowancePercent] = useState(mockHiringProductSettings.hiringProducts.allowance.value);

  // 거절 관련 상태 - 글로벌 훅 사용
  const {
    dailyRejectCount,
    remainingRejects,
    canReject,
    incrementRejectCount,
    resetRejectCount,
    DAILY_REJECT_LIMIT
  } = useGlobalRejectCount();
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectCandidate, setRejectCandidate] = useState<typeof mockNewMatchingCandidates[0] | null>(null);
  const [droppedCandidates, setDroppedCandidates] = useState<string[]>([]);
  const [selectedRejectReasons, setSelectedRejectReasons] = useState<string[]>([]);
  const [rejectReason, setRejectReason] = useState('');
  const [showViralLoopModal, setShowViralLoopModal] = useState(false);

  // 바이럴루프 CTA 상세 모달 상태
  const [showProfileCTA, setShowProfileCTA] = useState(false);
  const [showReferralCTA, setShowReferralCTA] = useState(false);
  const [showEmployeeCTA, setShowEmployeeCTA] = useState(false);
  const [showWorkExperienceCTA, setShowWorkExperienceCTA] = useState(false);
  const [referralPhone, setReferralPhone] = useState('');
  const [referralName, setReferralName] = useState('');

  // 바이럴루프 CTA 핸들러
  const handleResetLimit = (type: 'profile' | 'referral' | 'employee' | 'workExperience') => {
    setShowViralLoopModal(false);
    if (type === 'profile') {
      setShowProfileCTA(true);
    } else if (type === 'referral') {
      setShowReferralCTA(true);
    } else if (type === 'employee') {
      setShowEmployeeCTA(true);
    } else if (type === 'workExperience') {
      setShowWorkExperienceCTA(true);
    }
  };

  // CTA 완료 후 거절 횟수 초기화
  const completeReset = () => {
    resetRejectCount();
    setShowProfileCTA(false);
    setShowReferralCTA(false);
    setShowEmployeeCTA(false);
    setShowWorkExperienceCTA(false);
    setReferralPhone('');
    setReferralName('');
  };

  // AI 매칭 모달 상태
  const [showAIMatchingModal, setShowAIMatchingModal] = useState(false);
  const [aiMatchingProgress, setAIMatchingProgress] = useState(0);
  const [aiMatchingProfiles, setAIMatchingProfiles] = useState<string[]>([]);

  // 전체매칭리스트 탭 필터
  const [allMatchingFilter, setAllMatchingFilter] = useState('all');

  // 오퍼수정 모달 상태
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerCandidate, setOfferCandidate] = useState<typeof mockNewMatchingCandidates[0] | null>(null);
  const [offerSalary, setOfferSalary] = useState(4200);
  const [offerBonus, setOfferBonus] = useState('');
  const [offerMessage, setOfferMessage] = useState('');

  // 채용상품 저장 스플래시 상태
  const [showSaveSplash, setShowSaveSplash] = useState(false);
  const [savedJobIndex, setSavedJobIndex] = useState<number | null>(null);

  // 신규 채용공고 2개 상태 관리
  const [newJobs, setNewJobs] = useState([
    { id: 1, title: '신규공고 1', isExpanded: true },
    { id: 2, title: '신규공고 2', isExpanded: false },
  ]);

  // 필터 및 조건설정 모달 상태
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showConditionModal, setShowConditionModal] = useState(false);

  // 필터 값
  const [filterExperience, setFilterExperience] = useState<string[]>([]);
  const [filterMatchScore, setFilterMatchScore] = useState<number>(0);
  const [filterLicenseType, setFilterLicenseType] = useState<string[]>([]);

  // 조건설정 값
  const [conditionSalaryMin, setConditionSalaryMin] = useState<number>(0);
  const [conditionSalaryMax, setConditionSalaryMax] = useState<number>(10000);
  const [conditionWorkType, setConditionWorkType] = useState<string[]>([]);
  const [conditionLocation, setConditionLocation] = useState<string[]>([]);

  // 저장 처리
  const handleSaveJob = (jobIndex: number) => {
    setSavedJobIndex(jobIndex);
    setShowSaveSplash(true);
    setTimeout(() => {
      setShowSaveSplash(false);
      setSavedJobIndex(null);
    }, 2000);
  };

  // URL 파라미터 변경 시 탭 업데이트
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && mainTabs.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const toggleCompensation = (id: string) => {
    setCompensation(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  // 필터링된 후보자 (신규 매칭 리스트용 - 신규 15명만)
  const filteredCandidates = mockNewMatchingCandidates.filter(c => {
    if (droppedCandidates.includes(c.id)) return false;
    // 신규 매칭 리스트는 status가 'new'인 후보자만 표시
    return c.status === 'new';
  });

  // 정렬
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortOption === 'match') return b.matchScore - a.matchScore;
    if (sortOption === 'experience') return parseInt(b.experience) - parseInt(a.experience);
    return 0;
  });

  // 거절 처리 - 글로벌 훅 사용
  const handleReject = (candidate: typeof mockNewMatchingCandidates[0]) => {
    if (!canReject) {
      setShowViralLoopModal(true);
      return;
    }
    setRejectCandidate(candidate);
    setShowRejectModal(true);
  };

  const confirmReject = () => {
    if (rejectCandidate) {
      setDroppedCandidates(prev => [...prev, rejectCandidate.id]);
      incrementRejectCount(); // 글로벌 카운트 증가
    }
    setShowRejectModal(false);
    setRejectCandidate(null);
  };

  // AI 인터뷰 요청
  const handleAIInterviewRequest = (candidate: typeof mockNewMatchingCandidates[0]) => {
    alert(`${candidate.name}님에게 AI 인터뷰를 요청했습니다.`);
  };

  // AI 매칭용 카드 데이터
  const aiMatchingCardData = [
    { initial: '김', name: '김**', job: '간호사', exp: '4년', tags: ['성실함', '응답왕'], salary: 3500, desc: '환자 케어에 최선을 다합니다.' },
    { initial: '이', name: '이**', job: '간호조무사', exp: '2년', tags: ['장기 근무', '출석왕'], salary: 3200, desc: '꼼꼼한 업무 처리가 강점입니다.' },
    { initial: '최', name: '최**', job: '약사', exp: '7년', tags: ['장기 근무', '응답왕', '출석왕'], salary: 3800, desc: '정확한 복약 지도를 제공합니다.' },
    { initial: '박', name: '박**', job: '간호사', exp: '5년', tags: ['전문성', '친절함'], salary: 3600, desc: '피부과 전문 경력 보유.' },
    { initial: '정', name: '정**', job: '간호사', exp: '3년', tags: ['빠른 응답', '성실함'], salary: 3400, desc: '성형외과 경험 풍부합니다.' },
    { initial: '윤', name: '윤**', job: '간호조무사', exp: '6년', tags: ['장기 근무', '전문성'], salary: 3700, desc: '내과 전문 베테랑입니다.' },
    { initial: '강', name: '강**', job: '간호사', exp: '4년', tags: ['출석왕', '친절함'], salary: 3550, desc: '소아과 경력 보유자입니다.' },
    { initial: '한', name: '한**', job: '약사', exp: '8년', tags: ['전문성', '응답왕'], salary: 4000, desc: '병원약국 근무 경험 풍부.' },
  ];

  // 현재 표시할 카드 인덱스
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  // AI 매칭 시작
  const startAIMatching = () => {
    setShowAIMatchingModal(true);
    setAIMatchingProgress(0);
    setCurrentCardIndex(0);

    // 0.8초마다 카드 롤링
    const cardInterval = setInterval(() => {
      setCurrentCardIndex(prev => {
        if (prev >= aiMatchingCardData.length - 1) {
          return 0;
        }
        return prev + 1;
      });
    }, 800);

    // 진행률 업데이트 (더 천천히)
    const progressInterval = setInterval(() => {
      setAIMatchingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(cardInterval);
          // 1.5초 후 자동 닫기 및 신규매칭 리스트로 이동
          setTimeout(() => {
            setShowAIMatchingModal(false);
            setActiveTab('new-matching');
          }, 1500);
          return 100;
        }
        return prev + 10; // 10%씩 증가 (10초 동안)
      });
    }, 1000);
  };

  // 전체매칭리스트용 탭 데이터 (신규 15 + 진행중 8 = 23)
  const allMatchingTabs = [
    { id: 'all', label: '전체', count: 23 },
    { id: 'negotiating', label: '협상중', count: 2 },
    { id: 'interview_scheduled', label: '대면면접 예정', count: 2 },
    { id: 'ai_interview', label: 'AI인터뷰', count: 4 },
    { id: 'new', label: '신규', count: 15 },
  ];

  // 채용상품 설정 하위 탭 상태
  const [productSubTab, setProductSubTab] = useState('existing');

  return (
    <div className="px-4 py-6 pb-32">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-dashboard-title">매칭 센터</h1>
        <p className="text-sm text-text-secondary mt-1">
          채용 조건을 설정하고 매칭된 후보자를 관리하세요
        </p>
      </div>

      {/* Main Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-expert-navy text-white'
                  : 'bg-white text-text-secondary border border-border-light'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {/* 채용상품 설정 탭 */}
        {activeTab === 'product-settings' && (
          <motion.div
            key="product-settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* 하위 탭: 기존 채용상품 설정 / 신규상품 설정 */}
            <div className="flex gap-2 border-b border-border-light pb-3">
              {productSettingSubTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setProductSubTab(tab.id)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    productSubTab === tab.id
                      ? 'bg-expert-navy text-white'
                      : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* 기존 채용상품 설정 */}
            {productSubTab === 'existing' && (
              <motion.div
                key="existing-product"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                {/* 헤더 + 우측 공고 필터 */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-text-secondary">
                    등록된 공고 <strong className="text-text-primary">2건</strong>
                  </div>
                  <div className="relative">
                    <select className="px-3 py-1.5 pr-8 border border-border-light rounded-lg text-sm bg-white text-text-primary appearance-none">
                      <option value="all">전체</option>
                      <option value="active">활성</option>
                      <option value="pending">마감 임박</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                  </div>
                </div>

                {/* 채용공고 목록 - mockJobPostings 데이터 연동 */}
                {mockJobPostings.map((job) => {
                  const isActive = job.status === 'active';
                  const isPending = job.status === 'pending';
                  const productLabels: Record<string, { label: string; color: string }> = {
                    revenueShare: { label: '💰 매출 셰어', color: '#FF2D55' },
                    loyaltyBonus: { label: '🎁 근속 보너스', color: '#AF52DE' },
                    signingBonus: { label: '💵 사이닝 보너스', color: '#FF9500' },
                    allowance: { label: '💵 수당 보장', color: '#5856D6' },
                  };

                  return (
                    <Link key={job.id} href={`/employer/jobs/${job.id.split('-')[1]}/edit`} className="block">
                      <div className="bg-white rounded-2xl border border-border-light p-4 hover:shadow-card transition-all cursor-pointer">
                        <div className="flex items-center gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isActive ? 'bg-success/20' : 'bg-warning/20'}`}>
                            {isActive ? (
                              <CheckCircle className="w-5 h-5 text-success" />
                            ) : (
                              <Clock className="w-5 h-5 text-warning" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-text-primary">{job.title}</div>
                            <div className="text-xs text-text-secondary mt-0.5">{job.salaryRange} · {job.workType}</div>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${isActive ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                            {isActive ? '활성' : 'D-7'}
                          </span>
                        </div>

                        {/* AI 분석 요약 */}
                        <div className="bg-gradient-to-r from-brand-mint/5 to-info/5 rounded-xl p-3 mb-3 border border-brand-mint/10">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Brain className="w-3.5 h-3.5 text-brand-mint" />
                            <span className="text-xs font-medium text-brand-mint">AI 분석 요약</span>
                          </div>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div>
                              <div className="text-lg font-bold text-expert-navy">{job.views}</div>
                              <div className="text-[10px] text-text-tertiary">조회수</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-brand-mint">{job.applicants}</div>
                              <div className="text-[10px] text-text-tertiary">지원자</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-info">{job.aiRecommended}</div>
                              <div className="text-[10px] text-text-tertiary">AI 추천</div>
                            </div>
                          </div>
                        </div>

                        {/* AI 인사이트 */}
                        <div className={`rounded-lg p-2.5 mb-3 ${isPending ? 'bg-error/5' : 'bg-warning/5'}`}>
                          <div className="flex items-start gap-2">
                            {isPending ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-error flex-shrink-0 mt-0.5" />
                            ) : (
                              <Sparkles className="w-3.5 h-3.5 text-warning flex-shrink-0 mt-0.5" />
                            )}
                            <p className="text-xs text-text-secondary leading-relaxed" dangerouslySetInnerHTML={{
                              __html: job.insight.replace(/(지원율 \d+% 증가|마감 \d+일 전!)/g, '<strong class="text-warning">$1</strong>')
                            }} />
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-text-tertiary">근무시간</span>
                            <span className="text-text-primary">{job.workHours}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-text-tertiary">채용상품</span>
                            <div className="flex gap-1 flex-wrap justify-end">
                              {job.hiringProducts.map((productKey) => {
                                const product = productLabels[productKey];
                                return product ? (
                                  <span key={productKey} className="px-1.5 py-0.5 text-xs rounded text-white" style={{ backgroundColor: product.color }}>
                                    {product.label}
                                  </span>
                                ) : null;
                              })}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-4 pt-3 border-t border-border-light">
                          <div className="flex-1 py-2.5 text-sm bg-expert-navy text-white rounded-lg font-medium text-center flex items-center justify-center gap-1">
                            <Eye className="w-4 h-4" />
                            상세 보기
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}

                {/* 새 채용공고 추가 안내 */}
                <div className="bg-bg-secondary rounded-2xl p-6 text-center border-2 border-dashed border-border-light">
                  <UserPlus className="w-10 h-10 text-text-tertiary mx-auto mb-3" />
                  <p className="text-sm text-text-secondary mb-3">
                    새로운 채용 조건으로 후보자를 찾고 싶으시다면
                  </p>
                  <button
                    onClick={() => setProductSubTab('new')}
                    className="px-6 py-2.5 bg-expert-navy text-white rounded-lg text-sm font-medium"
                  >
                    신규상품 설정하기
                  </button>
                </div>
              </motion.div>
            )}

            {/* 신규상품 설정 */}
            {productSubTab === 'new' && (
              <motion.div
                key="new-product"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                {/* 신규상품 설정 헤더 */}
                <div className="bg-gradient-to-r from-brand-mint/10 to-info/10 rounded-2xl p-4 border border-brand-mint/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-brand-mint" />
                    <h2 className="text-lg font-bold text-text-primary">신규상품 설정</h2>
                  </div>
                  <p className="text-sm text-text-secondary">
                    새로운 채용 조건을 설정하고 AI 매칭을 시작하세요
                  </p>
                </div>

            {/* 근로조건 설정 */}
            <div className="bg-white rounded-2xl border border-border-light p-4">
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-expert-navy" />
                근로조건 설정
              </h2>

              {/* 연봉 범위 */}
              <div className="mb-5">
                <label className="text-sm font-medium text-text-primary mb-2 block">
                  연봉 범위 (만원)
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={salaryMin}
                      onChange={(e) => setSalaryMin(Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-border-light rounded-lg text-center font-medium"
                      step={100}
                    />
                  </div>
                  <span className="text-text-tertiary">~</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      value={salaryMax}
                      onChange={(e) => setSalaryMax(Number(e.target.value))}
                      className="w-full px-3 py-2.5 border border-border-light rounded-lg text-center font-medium"
                      step={100}
                    />
                  </div>
                </div>
              </div>

              {/* 근무 형태 */}
              <div className="mb-5">
                <label className="text-sm font-medium text-text-primary mb-2 block">
                  근무 형태
                </label>
                <div className="flex gap-2">
                  {['정규직', '파트타임', '알바'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setWorkType(type as typeof workType)}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        workType === type
                          ? 'bg-expert-navy text-white'
                          : 'bg-bg-secondary text-text-secondary'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 근무 시간 */}
              <div className="mb-5">
                <label className="text-sm font-medium text-text-primary mb-2 block">
                  근무 시간
                </label>
                <div className="relative">
                  <select
                    value={workHours}
                    onChange={(e) => setWorkHours(e.target.value)}
                    className="w-full px-3 py-2.5 border border-border-light rounded-lg appearance-none bg-white font-medium"
                  >
                    {workHourOptions.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary pointer-events-none" />
                </div>
              </div>

              {/* 대기/당직 설정 */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasOnCall}
                    onChange={(e) => setHasOnCall(e.target.checked)}
                    className="w-5 h-5 rounded border-border-light accent-expert-navy"
                  />
                  <span className="text-sm text-text-primary">대기 있음</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasNightShift}
                    onChange={(e) => setHasNightShift(e.target.checked)}
                    className="w-5 h-5 rounded border-border-light accent-expert-navy"
                  />
                  <span className="text-sm text-text-primary">당직 있음</span>
                </label>
              </div>
            </div>

            {/* 채용상품 4종 */}
            <div className="bg-white rounded-2xl border border-border-light p-4">
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-error" />
                채용상품 설정
              </h2>
              <p className="text-sm text-text-secondary mb-4">
                활성화된 채용상품은 구직자에게 매력적인 조건으로 노출됩니다
              </p>

              <div className="space-y-4">
                {/* 매출 셰어 */}
                <div className={`p-4 rounded-xl border-2 transition-all ${productShare ? 'border-[#FF2D55] bg-[#FF2D55]/5' : 'border-border-light bg-bg-secondary'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💰</span>
                      <span className="font-medium text-text-primary">매출 셰어</span>
                    </div>
                    <button
                      onClick={() => setProductShare(!productShare)}
                      className={`w-12 h-6 rounded-full transition-all ${productShare ? 'bg-[#FF2D55]' : 'bg-bg-tertiary'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all ${productShare ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  {productShare && (
                    <div className="mt-3">
                      <label className="text-xs text-text-secondary">매출 대비 비율 (%)</label>
                      <input
                        type="number"
                        value={sharePercent}
                        onChange={(e) => setSharePercent(Number(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border border-border-light rounded-lg text-sm"
                        min={1}
                        max={50}
                      />
                    </div>
                  )}
                </div>

                {/* 근속 보너스 */}
                <div className={`p-4 rounded-xl border-2 transition-all ${productBonus ? 'border-[#AF52DE] bg-[#AF52DE]/5' : 'border-border-light bg-bg-secondary'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🎁</span>
                      <span className="font-medium text-text-primary">근속 보너스</span>
                    </div>
                    <button
                      onClick={() => setProductBonus(!productBonus)}
                      className={`w-12 h-6 rounded-full transition-all ${productBonus ? 'bg-[#AF52DE]' : 'bg-bg-tertiary'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all ${productBonus ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  {productBonus && (
                    <div className="mt-3">
                      <label className="text-xs text-text-secondary">근속 기간 (개월)</label>
                      <input
                        type="number"
                        value={bonusMonths}
                        onChange={(e) => setBonusMonths(Number(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border border-border-light rounded-lg text-sm"
                        min={6}
                        max={60}
                      />
                    </div>
                  )}
                </div>

                {/* 휴가 자유 */}
                <div className={`p-4 rounded-xl border-2 transition-all ${productVacation ? 'border-[#5AC8FA] bg-[#5AC8FA]/5' : 'border-border-light bg-bg-secondary'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">🏖️</span>
                      <span className="font-medium text-text-primary">휴가 자유</span>
                    </div>
                    <button
                      onClick={() => setProductVacation(!productVacation)}
                      className={`w-12 h-6 rounded-full transition-all ${productVacation ? 'bg-[#5AC8FA]' : 'bg-bg-tertiary'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all ${productVacation ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  {productVacation && (
                    <div className="mt-3">
                      <label className="text-xs text-text-secondary">연차 일수</label>
                      <input
                        type="number"
                        value={vacationDays}
                        onChange={(e) => setVacationDays(Number(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border border-border-light rounded-lg text-sm"
                        min={15}
                        max={30}
                      />
                    </div>
                  )}
                </div>

                {/* 수당 보장 */}
                <div className={`p-4 rounded-xl border-2 transition-all ${productAllowance ? 'border-[#FF9500] bg-[#FF9500]/5' : 'border-border-light bg-bg-secondary'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">💵</span>
                      <span className="font-medium text-text-primary">수당 보장</span>
                    </div>
                    <button
                      onClick={() => setProductAllowance(!productAllowance)}
                      className={`w-12 h-6 rounded-full transition-all ${productAllowance ? 'bg-[#FF9500]' : 'bg-bg-tertiary'}`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-all ${productAllowance ? 'translate-x-6' : 'translate-x-0.5'}`} />
                    </button>
                  </div>
                  {productAllowance && (
                    <div className="mt-3">
                      <label className="text-xs text-text-secondary">야간/주말 수당 비율 (%)</label>
                      <input
                        type="number"
                        value={allowancePercent}
                        onChange={(e) => setAllowancePercent(Number(e.target.value))}
                        className="w-full mt-1 px-3 py-2 border border-border-light rounded-lg text-sm"
                        min={100}
                        max={300}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 효과 예측 카드 */}
            <div className="bg-gradient-to-r from-expert-navy to-expert-navy/80 rounded-2xl p-4 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-brand-mint" />
                <h3 className="font-bold">예상 효과</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-brand-mint">+47%</div>
                  <div className="text-xs text-white/70 mt-1">지원률 증가</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-brand-mint">2.3배</div>
                  <div className="text-xs text-white/70 mt-1">관심 표시 증가</div>
                </div>
              </div>
              <p className="text-xs text-white/60 mt-3">
                * 활성화된 채용상품 기준 예상치입니다
              </p>
            </div>

            {/* 설정 저장 + 신규매칭 받기 버튼 - 나란히 배치 */}
            <div className="flex gap-3">
              <button
                onClick={() => handleSaveJob(1)}
                className="flex-1 py-4 bg-white border-2 border-expert-navy text-expert-navy rounded-xl font-medium text-base hover:bg-expert-navy/5 transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                설정 저장
              </button>
              <button
                onClick={startAIMatching}
                className="flex-1 py-4 bg-gradient-to-r from-brand-mint to-info text-white rounded-xl font-bold text-base hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                신규매칭 받기
              </button>
            </div>

            {/* 신규공고 추가 버튼 - 활성화 스타일 */}
            <button
              onClick={() => {
                alert('신규 채용공고 작성 페이지로 이동합니다.');
                // 실제 구현 시 라우팅 추가
              }}
              className="w-full py-4 bg-expert-navy text-white rounded-xl font-medium hover:bg-expert-navy/90 transition-colors flex items-center justify-center gap-2 shadow-lg"
            >
              <UserPlus className="w-5 h-5" />
              신규공고 추가하기
            </button>

            {/* 하단 여백 - CTA 버튼 짤림 방지 */}
            <div className="h-8" />
              </motion.div>
            )}
          </motion.div>
        )}

        {/* 신규 매칭 리스트 탭 */}
        {activeTab === 'new-matching' && (
          <motion.div
            key="new-matching"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* 상태 필터 */}
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
              {statusFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setStatusFilter(filter.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-all ${
                    statusFilter === filter.id
                      ? 'bg-expert-navy text-white'
                      : 'bg-bg-secondary text-text-secondary'
                  }`}
                >
                  {filter.label}
                  <span className={`ml-1 ${statusFilter === filter.id ? 'text-white/70' : 'text-text-tertiary'}`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            {/* 필터 & 정렬 버튼 */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setShowFilterModal(true)}
                className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-sm transition-colors ${
                  (filterExperience.length > 0 || filterMatchScore > 0 || filterLicenseType.length > 0)
                    ? 'bg-expert-navy text-white border-expert-navy'
                    : 'bg-white border-border-light text-text-secondary hover:bg-bg-secondary'
                }`}
              >
                <ListFilter className="w-4 h-4" />
                필터
                {(filterExperience.length > 0 || filterMatchScore > 0 || filterLicenseType.length > 0) && (
                  <span className="w-5 h-5 bg-white text-expert-navy text-xs font-bold rounded-full flex items-center justify-center">
                    {filterExperience.length + (filterMatchScore > 0 ? 1 : 0) + filterLicenseType.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setShowConditionModal(true)}
                className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-sm transition-colors ${
                  (conditionSalaryMin > 0 || conditionWorkType.length > 0 || conditionLocation.length > 0)
                    ? 'bg-brand-mint text-white border-brand-mint'
                    : 'bg-white border-border-light text-text-secondary hover:bg-bg-secondary'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                조건설정
                {(conditionSalaryMin > 0 || conditionWorkType.length > 0 || conditionLocation.length > 0) && (
                  <span className="w-5 h-5 bg-white text-brand-mint text-xs font-bold rounded-full flex items-center justify-center">
                    {(conditionSalaryMin > 0 ? 1 : 0) + conditionWorkType.length + conditionLocation.length}
                  </span>
                )}
              </button>
              <div className="relative ml-auto">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-white border border-border-light rounded-lg text-sm text-text-secondary"
                >
                  {sortOption === 'match' ? '매칭률순' : '경력순'}
                  <ChevronDown className="w-4 h-4" />
                </button>
                {showSortDropdown && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-border-light rounded-lg shadow-lg z-10 overflow-hidden">
                    <button
                      onClick={() => { setSortOption('match'); setShowSortDropdown(false); }}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-bg-secondary ${sortOption === 'match' ? 'text-expert-navy font-medium' : 'text-text-primary'}`}
                    >
                      매칭률순
                    </button>
                    <button
                      onClick={() => { setSortOption('experience'); setShowSortDropdown(false); }}
                      className={`w-full px-4 py-2 text-sm text-left hover:bg-bg-secondary ${sortOption === 'experience' ? 'text-expert-navy font-medium' : 'text-text-primary'}`}
                    >
                      경력순
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 거절 잔여 횟수 알림 */}
            {remainingRejects <= 5 && (
              <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-xl mb-4">
                <AlertCircle className="w-4 h-4 text-warning" />
                <span className="text-sm text-warning">
                  오늘 거절 가능 횟수: <strong>{remainingRejects}회</strong> 남음
                </span>
              </div>
            )}

            {/* 후보자 리스트 */}
            <div className="space-y-4">
              {sortedCandidates.map((candidate, index) => {
                const status = statusConfig[candidate.status] || statusConfig.new;

                return (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => router.push(`/employer/candidates/${candidate.id}`)}
                    className={`bg-white rounded-2xl p-4 border-2 cursor-pointer hover:shadow-card transition-all ${
                      status.label === '협상중'
                        ? 'border-warning ring-2 ring-warning/20 shadow-lg shadow-warning/10'
                        : status.label === '신규'
                          ? 'border-brand-mint'
                          : 'border-border-light'
                    }`}
                  >
                    {/* 상태 배지 - 그라데이션 스타일 */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        status.label === '협상중'
                          ? 'bg-gradient-to-r from-warning to-orange-400 text-white shadow-sm'
                          : status.label === '신규'
                            ? 'bg-gradient-to-r from-brand-mint to-info text-white shadow-sm'
                            : `${status.bgColor} ${status.color}`
                      }`}>
                        {status.label === '협상중' && <Clock className="w-3 h-3 mr-1" />}
                        {status.label === '신규' && <Sparkles className="w-3 h-3 mr-1" />}
                        {status.label}
                      </span>
                      {'viewCount' in candidate && (candidate as {viewCount?: number}).viewCount && (candidate as {viewCount?: number}).viewCount! >= 3 && (
                        <span className="flex items-center gap-1 text-xs font-medium text-error bg-error/10 px-2 py-1 rounded-full">
                          🔥 {(candidate as {viewCount?: number}).viewCount}회 열람
                        </span>
                      )}
                      {'isVerified' in candidate && (candidate as {isVerified?: boolean}).isVerified && (
                        <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full">
                          <CheckCircle className="w-3 h-3" />
                          경력 인증
                        </span>
                      )}
                    </div>

                    {/* 후보자 정보 */}
                    <div className="flex items-start gap-3 mb-3">
                      {/* 프로필 이미지 */}
                      <div className="w-14 h-14 bg-expert-navy/10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        {candidate.profileImage ? (
                          <img src={candidate.profileImage} alt={candidate.name} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-7 h-7 text-expert-navy" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text-primary text-lg">{candidate.name}</h3>
                        <div className="text-sm text-text-secondary">
                          {'specialty' in candidate ? (candidate as {specialty?: string}).specialty : candidate.licenseType} · {candidate.experience}
                        </div>
                        {'currentHospital' in candidate && (
                          <div className="flex items-center gap-1 text-xs text-text-tertiary mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {(candidate as {currentHospital?: string}).currentHospital}
                          </div>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold text-brand-mint">{candidate.matchScore}%</div>
                        <div className="text-xs text-text-tertiary">매칭</div>
                      </div>
                    </div>

                    {/* 태그들 */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {/* 희망 업무강도 */}
                      {candidate.preferredIntensity && (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${intensityInfo[candidate.preferredIntensity]?.bgColor} ${intensityInfo[candidate.preferredIntensity]?.color}`}>
                          희망 {intensityInfo[candidate.preferredIntensity]?.label}
                        </span>
                      )}
                      {/* 선호 채용상품 */}
                      {candidate.preferredProducts?.slice(0, 2).map((productType) => {
                        const product = productInfo[productType];
                        if (!product) return null;
                        return (
                          <span
                            key={productType}
                            className="text-xs px-2.5 py-1 rounded-full text-white font-semibold"
                            style={{ backgroundColor: product.color }}
                          >
                            {product.icon} {product.label}
                          </span>
                        );
                      })}
                    </div>

                    {/* AI 인사이트 */}
                    {'aiInsight' in candidate && (candidate as {aiInsight?: string}).aiInsight && (
                      <div className="bg-brand-mint/10 rounded-xl p-3 mb-3 border border-brand-mint/20">
                        <div className="flex items-start gap-2">
                          <Sparkles className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-text-primary">{(candidate as {aiInsight?: string}).aiInsight}</p>
                        </div>
                      </div>
                    )}

                    {/* CTA 버튼 */}
                    <div className="flex gap-2 pt-3 border-t border-border-light">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAIInterviewRequest(candidate);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-2.5 text-sm bg-brand-mint/10 text-brand-mint rounded-lg font-medium hover:bg-brand-mint/20 transition-colors"
                      >
                        <Sparkles className="w-4 h-4" />
                        AI인터뷰 요청
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(candidate);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 py-2.5 text-sm bg-bg-secondary text-text-secondary rounded-lg font-medium hover:bg-error/10 hover:text-error transition-colors"
                      >
                        <X className="w-4 h-4" />
                        거절
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {sortedCandidates.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                <div className="text-text-secondary">해당 조건의 후보자가 없어요</div>
              </div>
            )}
          </motion.div>
        )}

        {/* 전체 매칭 리스트 탭 */}
        {activeTab === 'all-matching' && (
          <motion.div
            key="all-matching"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {/* 상태별 탭 - 협상중 강조 */}
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
              {allMatchingTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setAllMatchingFilter(tab.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm transition-all ${
                    allMatchingFilter === tab.id
                      ? tab.id === 'negotiating'
                        ? 'bg-warning text-white'
                        : 'bg-expert-navy text-white'
                      : tab.id === 'negotiating'
                        ? 'bg-warning/10 text-warning border border-warning/20'
                        : 'bg-bg-secondary text-text-secondary'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-1 ${allMatchingFilter === tab.id ? 'text-white/70' : 'text-text-tertiary'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* 전체 후보자 리스트 (mockNewMatchingCandidates 23명) */}
            <div className="space-y-4">
              {mockNewMatchingCandidates
                .filter(c => {
                  if (droppedCandidates.includes(c.id)) return false;
                  if (allMatchingFilter === 'all') return true;
                  return c.status === allMatchingFilter;
                })
                // 노출 순서: 협상중 > 대면면접 예정 > AI인터뷰 > 신규
                .sort((a, b) => {
                  const order: Record<string, number> = {
                    'negotiating': 1,
                    'interview_scheduled': 2,
                    'ai_interview': 3,
                    'new': 4,
                  };
                  return (order[a.status] || 99) - (order[b.status] || 99);
                })
                .map((candidate, index) => {
                const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
                  new: { label: '신규', color: 'text-brand-mint', bgColor: 'bg-brand-mint/10' },
                  negotiating: { label: '협상중', color: 'text-warning', bgColor: 'bg-warning/10' },
                  interview_scheduled: { label: '대면면접 예정', color: 'text-success', bgColor: 'bg-success/10' },
                  ai_interview: { label: 'AI인터뷰', color: 'text-info', bgColor: 'bg-info/10' },
                };
                const status = statusMap[candidate.status] || statusMap.new;
                const isNegotiating = candidate.status === 'negotiating';

                return (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => router.push(`/employer/candidates/${candidate.id}`)}
                    className={`rounded-2xl p-4 border-2 cursor-pointer hover:shadow-card transition-all ${
                      isNegotiating
                        ? 'bg-white border-warning ring-2 ring-warning/20 shadow-lg shadow-warning/10'
                        : candidate.status === 'interview_scheduled'
                          ? 'bg-white border-success ring-2 ring-success/20'
                          : candidate.status === 'ai_interview'
                            ? 'bg-white border-info'
                            : 'bg-white border-border-light'
                    }`}
                  >
                    {/* 상태 배지 - 그라데이션 스타일 */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        isNegotiating
                          ? 'bg-gradient-to-r from-warning to-orange-400 text-white shadow-sm'
                          : candidate.status === 'interview_scheduled'
                            ? 'bg-gradient-to-r from-success to-emerald-400 text-white shadow-sm'
                            : candidate.status === 'ai_interview'
                              ? 'bg-gradient-to-r from-info to-blue-400 text-white shadow-sm'
                              : 'bg-gradient-to-r from-brand-mint to-info text-white shadow-sm'
                      }`}>
                        {isNegotiating && <Clock className="w-3 h-3 mr-1" />}
                        {candidate.status === 'interview_scheduled' && <Calendar className="w-3 h-3 mr-1" />}
                        {candidate.status === 'ai_interview' && <Sparkles className="w-3 h-3 mr-1" />}
                        {candidate.status === 'new' && <Sparkles className="w-3 h-3 mr-1" />}
                        {status.label}
                      </span>
                      {candidate.statusDetail && (
                        <span className="text-xs font-medium text-text-secondary">{candidate.statusDetail}</span>
                      )}
                    </div>

                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-14 h-14 bg-expert-navy/10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                        {candidate.profileImage ? (
                          <img src={candidate.profileImage} alt={candidate.name} className="w-full h-full object-cover" />
                        ) : (
                          <Users className="w-7 h-7 text-expert-navy" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-text-primary text-lg">{candidate.name}</h3>
                        <div className="text-sm text-text-secondary">
                          {candidate.licenseType} · {candidate.experience}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-2xl font-bold text-brand-mint">{candidate.matchScore}%</div>
                        <div className="text-xs text-text-tertiary">매칭</div>
                      </div>
                    </div>

                    {/* 태그 */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {candidate.preferredIntensity && (
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${intensityInfo[candidate.preferredIntensity]?.bgColor} ${intensityInfo[candidate.preferredIntensity]?.color}`}>
                          희망 {intensityInfo[candidate.preferredIntensity]?.label}
                        </span>
                      )}
                      {candidate.preferredProducts?.slice(0, 2).map((productType) => {
                        const product = productInfo[productType];
                        if (!product) return null;
                        return (
                          <span
                            key={productType}
                            className="text-xs px-2.5 py-1 rounded-full text-white font-semibold"
                            style={{ backgroundColor: product.color }}
                          >
                            {product.icon} {product.label}
                          </span>
                        );
                      })}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-border-light">
                      {candidate.status === 'new' && (
                        <>
                          <button className="flex-1 flex items-center justify-center gap-1 py-2.5 text-sm bg-brand-mint/10 text-brand-mint rounded-lg font-medium hover:bg-brand-mint/20 transition-colors">
                            <Sparkles className="w-4 h-4" />
                            AI인터뷰 요청
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(candidate);
                            }}
                            className="flex-1 flex items-center justify-center gap-1 py-2.5 text-sm bg-bg-secondary text-text-secondary rounded-lg font-medium hover:bg-error/10 hover:text-error transition-colors"
                          >
                            <X className="w-4 h-4" />
                            거절
                          </button>
                        </>
                      )}
                      {candidate.status === 'ai_interview' && (
                        <>
                          <Link href={`/employer/ai-interview/report/${candidate.id}`} className="flex-1">
                            <button className="w-full flex items-center justify-center gap-1 py-2.5 text-sm bg-info/10 text-info rounded-lg font-medium hover:bg-info/20 transition-colors">
                              <FileText className="w-4 h-4" />
                              리포트
                            </button>
                          </Link>
                          <button className="flex-1 flex items-center justify-center gap-1 py-2.5 text-sm bg-success/10 text-success rounded-lg font-medium hover:bg-success/20 transition-colors">
                            <Calendar className="w-4 h-4" />
                            면접
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(candidate);
                            }}
                            className="flex-1 flex items-center justify-center gap-1 py-2.5 text-sm bg-bg-secondary text-text-secondary rounded-lg font-medium hover:bg-error/10 hover:text-error transition-colors"
                          >
                            <X className="w-4 h-4" />
                            거절
                          </button>
                        </>
                      )}
                      {candidate.status === 'negotiating' && (
                        <>
                          <Link href={`/employer/ai-interview/report/${candidate.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                            <button className="w-full flex items-center justify-center gap-1 py-2.5 text-sm bg-brand-mint text-white rounded-lg font-medium hover:bg-brand-mint/90 transition-colors">
                              <FileText className="w-4 h-4" />
                              AI리포트
                            </button>
                          </Link>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOfferCandidate(candidate);
                              setShowOfferModal(true);
                            }}
                            className="flex-1 flex items-center justify-center gap-1 py-2.5 text-sm bg-match-gold text-white rounded-lg font-medium hover:bg-match-gold/90 transition-colors"
                          >
                            <Send className="w-4 h-4" />
                            오퍼발송
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(candidate);
                            }}
                            className="flex-1 flex items-center justify-center gap-1 py-2.5 text-sm bg-bg-secondary text-text-secondary rounded-lg font-medium hover:bg-error/10 hover:text-error transition-colors"
                          >
                            <X className="w-4 h-4" />
                            거절
                          </button>
                        </>
                      )}
                      {candidate.status === 'interview_scheduled' && (
                        <>
                          <Link href={`/employer/ai-interview/copilot?id=${candidate.id}`} className="flex-1">
                            <button className="w-full flex items-center justify-center gap-1 py-2.5 text-sm bg-expert-navy/10 text-expert-navy rounded-lg font-medium hover:bg-expert-navy/20 transition-colors">
                              <Sparkles className="w-4 h-4" />
                              코파일럿
                            </button>
                          </Link>
                          <div className="flex-1 flex items-center justify-center gap-1 py-2.5 text-sm text-success bg-success/10 rounded-lg font-medium">
                            <Calendar className="w-4 h-4" />
                            일정
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReject(candidate);
                            }}
                            className="flex-1 flex items-center justify-center gap-1 py-2.5 text-sm bg-bg-secondary text-text-secondary rounded-lg font-medium hover:bg-error/10 hover:text-error transition-colors"
                          >
                            <X className="w-4 h-4" />
                            거절
                          </button>
                        </>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 거절 확인 모달 */}
      <AnimatePresence>
        {showRejectModal && rejectCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-2xl p-6"
            >
              <div className="text-center mb-4">
                <div className="w-14 h-14 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <X className="w-7 h-7 text-error" />
                </div>
                <h3 className="text-lg font-bold">{rejectCandidate.name}</h3>
                <p className="text-sm text-text-secondary">이 후보자를 거절하시겠어요?</p>
                <p className="text-xs text-text-tertiary mt-1">남은 거절 횟수: {remainingRejects}회</p>
              </div>

              {/* 거절 사유 버튼 선택 */}
              <div className="mb-4">
                <p className="text-sm font-medium text-text-primary mb-2">거절 사유 선택</p>
                <div className="flex flex-wrap gap-2">
                  {['경력 부족', '전문 분야 불일치', '급여 조건', '근무 시간', '기타'].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => {
                        if (selectedRejectReasons.includes(reason)) {
                          setSelectedRejectReasons(prev => prev.filter(r => r !== reason));
                        } else {
                          setSelectedRejectReasons(prev => [...prev, reason]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        selectedRejectReasons.includes(reason)
                          ? 'bg-error text-white'
                          : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>

              {/* 직접 입력 (선택) */}
              <div className="mb-4">
                <p className="text-sm font-medium text-text-primary mb-2">추가 의견 (선택)</p>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="거절 사유를 입력해주세요"
                  className="w-full p-3 border border-border-light rounded-xl text-sm resize-none h-16"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedRejectReasons([]);
                    setRejectReason('');
                  }}
                  className="flex-1 py-3 rounded-xl border border-border-light text-text-secondary font-medium"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    confirmReject();
                    setSelectedRejectReasons([]);
                    setRejectReason('');
                  }}
                  className="flex-1 py-3 rounded-xl bg-error text-white font-medium"
                >
                  거절하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 오퍼수정 모달 */}
      <AnimatePresence>
        {showOfferModal && offerCandidate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowOfferModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-2xl p-6"
            >
              <div className="text-center mb-4">
                <div className="w-14 h-14 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <DollarSign className="w-7 h-7 text-warning" />
                </div>
                <h3 className="text-lg font-bold">{offerCandidate.name}님 오퍼 수정</h3>
                <p className="text-sm text-text-secondary">제안 조건을 수정하세요</p>
              </div>

              {/* 연봉 수정 */}
              <div className="mb-4">
                <p className="text-sm font-medium text-text-primary mb-2">연봉 (만원)</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOfferSalary(prev => Math.max(3000, prev - 100))}
                    className="w-10 h-10 rounded-lg bg-bg-secondary text-text-secondary flex items-center justify-center hover:bg-bg-tertiary"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={offerSalary}
                    onChange={(e) => setOfferSalary(Number(e.target.value))}
                    className="flex-1 text-center py-2 border border-border-light rounded-lg font-bold text-lg"
                  />
                  <button
                    onClick={() => setOfferSalary(prev => prev + 100)}
                    className="w-10 h-10 rounded-lg bg-bg-secondary text-text-secondary flex items-center justify-center hover:bg-bg-tertiary"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* 추가 보상 */}
              <div className="mb-4">
                <p className="text-sm font-medium text-text-primary mb-2">추가 보상</p>
                <div className="flex flex-wrap gap-2">
                  {['사이닝 보너스', '스톡옵션', '성과급', '휴가 추가'].map((bonus) => (
                    <button
                      key={bonus}
                      onClick={() => setOfferBonus(offerBonus === bonus ? '' : bonus)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                        offerBonus === bonus
                          ? 'bg-warning text-white'
                          : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                      }`}
                    >
                      {bonus}
                    </button>
                  ))}
                </div>
              </div>

              {/* 메시지 */}
              <div className="mb-4">
                <p className="text-sm font-medium text-text-primary mb-2">메시지 (선택)</p>
                <textarea
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="후보자에게 전달할 메시지를 입력해주세요"
                  className="w-full p-3 border border-border-light rounded-xl text-sm resize-none h-16"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowOfferModal(false);
                    setOfferBonus('');
                    setOfferMessage('');
                  }}
                  className="flex-1 py-3 rounded-xl border border-border-light text-text-secondary font-medium"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    alert(`${offerCandidate.name}님에게 ${offerSalary}만원 오퍼를 수정했습니다.`);
                    setShowOfferModal(false);
                    setOfferBonus('');
                    setOfferMessage('');
                  }}
                  className="flex-1 py-3 rounded-xl bg-warning text-white font-medium"
                >
                  오퍼 수정
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI 매칭 - 전체 화면 (민트색 테마) */}
      <AnimatePresence>
        {showAIMatchingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden"
            style={{
              background: 'linear-gradient(180deg, #0a2f2f 0%, #0d3d3d 50%, #0f4a4a 100%)'
            }}
          >
            {/* 배경 파티클 효과 - 민트색 */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(25)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: `linear-gradient(135deg, #00D4AA ${Math.random() * 50}%, #00B894 100%)`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -40, 0],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 2,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* 상단 로고 / 타이틀 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 rounded-full flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #00D4AA 0%, #00B894 100%)' }}
                >
                  <Brain className="w-6 h-6 text-white" />
                </motion.div>
                <span className="text-2xl font-bold text-white">AI 매칭 분석</span>
              </div>
              <p className="text-sm text-white/70">최적의 후보자를 분석하고 있습니다</p>
            </motion.div>

            {/* 가로 캐러셀 프로필 카드 영역 */}
            <div className="w-full flex items-center justify-center gap-3 px-4 mb-8 overflow-hidden">
              {/* 5개 카드 표시: 2개 왼쪽 블러 + 1개 중앙 + 2개 오른쪽 블러 */}
              {[-2, -1, 0, 1, 2].map((offset) => {
                const cardIdx = (currentCardIndex + offset + aiMatchingCardData.length) % aiMatchingCardData.length;
                const cardData = aiMatchingCardData[cardIdx];
                const isCenter = offset === 0;
                const cardOpacity = isCenter ? 1 : Math.abs(offset) === 1 ? 0.5 : 0.35;
                const scale = isCenter ? 1 : Math.abs(offset) === 1 ? 0.8 : 0.65;
                const blurAmount = isCenter ? 0 : Math.abs(offset) === 1 ? 2 : 4;

                return (
                  <motion.div
                    key={`card-${cardIdx}-${offset}`}
                    animate={{
                      scale: scale,
                      rotateY: offset * 12,
                    }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                      zIndex: isCenter ? 10 : 5 - Math.abs(offset),
                      filter: `blur(${blurAmount}px)`,
                      opacity: cardOpacity,
                      transformStyle: 'preserve-3d',
                    }}
                    className={`flex-shrink-0 rounded-2xl p-4 relative ${
                      isCenter
                        ? 'w-[200px] shadow-2xl bg-white'
                        : 'w-[160px] shadow-lg bg-white'
                    }`}
                  >
                    {/* 매칭 점수 배지 - 중앙 카드만, 더 크고 눈에 띄게 */}
                    {isCenter && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute -top-4 -right-4 w-16 h-16 rounded-full flex items-center justify-center shadow-xl"
                        style={{
                          background: 'linear-gradient(135deg, #00D4AA 0%, #00B894 100%)',
                          boxShadow: '0 0 20px rgba(0, 212, 170, 0.5)'
                        }}
                      >
                        <div className="text-center">
                          <div className="text-white text-lg font-bold">92%</div>
                          <div className="text-white/80 text-[9px]">매칭률</div>
                        </div>
                      </motion.div>
                    )}

                    {/* 이니셜 원형 아바타 */}
                    <div
                      className={`${isCenter ? 'w-16 h-16' : 'w-12 h-12'} rounded-full mx-auto mb-2 flex items-center justify-center`}
                      style={{
                        background: isCenter
                          ? 'linear-gradient(135deg, #E0FFF7 0%, #B8F5E8 100%)'
                          : '#F0F0F0'
                      }}
                    >
                      <span className={`${isCenter ? 'text-xl' : 'text-lg'} font-bold`} style={{ color: isCenter ? '#00B894' : '#AAA' }}>
                        {cardData.initial}
                      </span>
                    </div>

                    {/* 직업 + 경력 - 통합 표시 */}
                    <div className="text-center mb-2">
                      <p className={`${isCenter ? 'text-sm' : 'text-xs'} font-semibold`} style={{ color: isCenter ? '#00B894' : '#999' }}>
                        {cardData.job}
                      </p>
                      <p className={`${isCenter ? 'text-xs' : 'text-[10px]'} text-text-tertiary`}>
                        경력 {cardData.exp}
                      </p>
                    </div>

                    {/* 태그들 - 중앙 카드만, 민트색 */}
                    {isCenter && (
                      <div className="flex flex-wrap justify-center gap-1 mb-2">
                        {cardData.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] rounded-full bg-brand-mint/10 text-brand-mint border border-brand-mint/30"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* 희망 급여 - 중앙만 */}
                    {isCenter && (
                      <div className="text-center">
                        <span className="text-xs text-text-secondary">희망 </span>
                        <span className="text-sm font-bold text-expert-navy">{cardData.salary.toLocaleString()}만</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* 프로그레스 바 - 민트색 */}
            <div className="w-72 mb-6">
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #00D4AA 0%, #00B894 100%)' }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${aiMatchingProgress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
              <div className="flex justify-between mt-2 text-sm text-white/70">
                <span>{Math.floor(aiMatchingProgress * 1.5)}명 분석 완료</span>
                <span>{aiMatchingProgress}%</span>
              </div>
            </div>

            {/* 하단 텍스트 */}
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-center"
            >
              <p className="text-base font-medium text-white">
                {aiMatchingProgress < 100 ? 'AI가 최적의 후보자를 선별하고 있습니다' : '매칭 완료!'}
              </p>
            </motion.div>

            {/* 완료 시 버튼 */}
            {aiMatchingProgress >= 100 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <motion.button
                  onClick={() => {
                    setShowAIMatchingModal(false);
                    setActiveTab('new-matching');
                  }}
                  className="px-8 py-4 text-white rounded-xl font-bold text-lg shadow-lg"
                  style={{
                    background: 'linear-gradient(135deg, #00D4AA 0%, #00B894 100%)',
                    boxShadow: '0 0 30px rgba(0, 212, 170, 0.4)'
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  15명 매칭 결과 보기
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 저장 성공 스플래쉬 */}
      <AnimatePresence>
        {showSaveSplash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="bg-white rounded-2xl p-8 text-center shadow-2xl"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-12 h-12 text-success" />
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl font-bold text-text-primary mb-2"
              >
                설정이 저장되었습니다!
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-sm text-text-secondary"
              >
                채용상품 설정이 성공적으로 저장되었습니다
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 필터 모달 */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
            onClick={() => setShowFilterModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[80vh] overflow-hidden"
            >
              <div className="px-4 py-4 border-b border-border-light flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">필터</h3>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-secondary"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              <div className="p-4 space-y-6 overflow-y-auto max-h-[60vh]">
                {/* 경력 필터 */}
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-3">경력</h4>
                  <div className="flex flex-wrap gap-2">
                    {['1년 미만', '1-2년', '3-5년', '5-7년', '7년 이상'].map((exp) => (
                      <button
                        key={exp}
                        onClick={() => setFilterExperience(prev =>
                          prev.includes(exp) ? prev.filter(e => e !== exp) : [...prev, exp]
                        )}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          filterExperience.includes(exp)
                            ? 'bg-expert-navy text-white'
                            : 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary'
                        }`}
                      >
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 매칭률 필터 */}
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-3">
                    최소 매칭률: <span className="text-brand-mint">{filterMatchScore}%</span> 이상
                  </h4>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={filterMatchScore}
                    onChange={(e) => setFilterMatchScore(Number(e.target.value))}
                    className="w-full h-2 bg-bg-secondary rounded-lg appearance-none cursor-pointer accent-brand-mint"
                  />
                  <div className="flex justify-between text-xs text-text-tertiary mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* 자격증 필터 */}
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-3">자격증</h4>
                  <div className="flex flex-wrap gap-2">
                    {['간호사', '간호조무사', '의료기사'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterLicenseType(prev =>
                          prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                        )}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          filterLicenseType.includes(type)
                            ? 'bg-expert-navy text-white'
                            : 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-4 py-4 border-t border-border-light flex gap-3">
                <button
                  onClick={() => {
                    setFilterExperience([]);
                    setFilterMatchScore(0);
                    setFilterLicenseType([]);
                  }}
                  className="flex-1 py-3 border border-border-light rounded-xl text-text-secondary font-medium"
                >
                  초기화
                </button>
                <button
                  onClick={() => setShowFilterModal(false)}
                  className="flex-[2] py-3 bg-expert-navy text-white rounded-xl font-medium"
                >
                  적용하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 조건설정 모달 */}
      <AnimatePresence>
        {showConditionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center"
            onClick={() => setShowConditionModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[80vh] overflow-hidden"
            >
              <div className="px-4 py-4 border-b border-border-light flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-primary">조건설정</h3>
                <button
                  onClick={() => setShowConditionModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-secondary"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              <div className="p-4 space-y-6 overflow-y-auto max-h-[60vh]">
                {/* 희망 연봉 */}
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-3">
                    희망 연봉 범위: <span className="text-brand-mint">{conditionSalaryMin}만원</span> 이상
                  </h4>
                  <input
                    type="range"
                    min={0}
                    max={10000}
                    step={100}
                    value={conditionSalaryMin}
                    onChange={(e) => setConditionSalaryMin(Number(e.target.value))}
                    className="w-full h-2 bg-bg-secondary rounded-lg appearance-none cursor-pointer accent-brand-mint"
                  />
                  <div className="flex justify-between text-xs text-text-tertiary mt-1">
                    <span>무관</span>
                    <span>5,000만</span>
                    <span>10,000만</span>
                  </div>
                </div>

                {/* 근무 형태 */}
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-3">근무 형태</h4>
                  <div className="flex flex-wrap gap-2">
                    {['정규직', '계약직', '파트타임', '알바'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setConditionWorkType(prev =>
                          prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
                        )}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          conditionWorkType.includes(type)
                            ? 'bg-brand-mint text-white'
                            : 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 선호 지역 */}
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-3">선호 지역</h4>
                  <div className="flex flex-wrap gap-2">
                    {['강남구', '서초구', '송파구', '용산구', '마포구', '성동구', '강동구', '영등포구', '구로구'].map((loc) => (
                      <button
                        key={loc}
                        onClick={() => setConditionLocation(prev =>
                          prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
                        )}
                        className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                          conditionLocation.includes(loc)
                            ? 'bg-brand-mint text-white'
                            : 'bg-bg-secondary text-text-primary hover:bg-bg-tertiary'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-4 py-4 border-t border-border-light flex gap-3">
                <button
                  onClick={() => {
                    setConditionSalaryMin(0);
                    setConditionSalaryMax(10000);
                    setConditionWorkType([]);
                    setConditionLocation([]);
                  }}
                  className="flex-1 py-3 border border-border-light rounded-xl text-text-secondary font-medium"
                >
                  초기화
                </button>
                <button
                  onClick={() => setShowConditionModal(false)}
                  className="flex-[2] py-3 bg-brand-mint text-white rounded-xl font-medium"
                >
                  적용하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 거절 횟수 소진 - 바이럴 루프 모달 */}
      <AnimatePresence>
        {showViralLoopModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-2xl p-6"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-warning" />
                </div>
                <h3 className="text-lg font-bold mb-2">오늘 거절 횟수를 모두 사용했어요</h3>
                <p className="text-sm text-text-secondary">
                  아래 활동을 하면 거절 횟수가 초기화돼요!
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <button
                  onClick={() => handleResetLimit('profile')}
                  className="w-full p-4 border border-border-light rounded-xl text-left hover:border-brand-mint transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-mint/10 rounded-full flex items-center justify-center">
                      <FileText className="w-5 h-5 text-brand-mint" />
                    </div>
                    <div>
                      <div className="font-semibold">병원 프로필 완성하기</div>
                      <div className="text-xs text-text-secondary">프로필을 완성하면 거절 횟수 초기화</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleResetLimit('employee')}
                  className="w-full p-4 border border-border-light rounded-xl text-left hover:border-brand-mint transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-info" />
                    </div>
                    <div>
                      <div className="font-semibold">동료 원장님 초대하기</div>
                      <div className="text-xs text-text-secondary">동료를 초대하고 함께 혜택을 받으세요</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleResetLimit('referral')}
                  className="w-full p-4 border border-border-light rounded-xl text-left hover:border-brand-mint transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                      <UserPlus className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold">구직자 추천하기</div>
                      <div className="text-xs text-text-secondary">구직자를 추천하고 혜택을 받으세요</div>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => handleResetLimit('workExperience')}
                  className="w-full p-4 border border-border-light rounded-xl text-left hover:border-brand-mint transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-warning/10 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 text-warning" />
                    </div>
                    <div>
                      <div className="font-semibold">재직경험 공유하기</div>
                      <div className="text-xs text-text-secondary">재직했던 곳에 대한 리뷰를 남겨주세요</div>
                    </div>
                  </div>
                </button>
              </div>

              <button
                onClick={() => setShowViralLoopModal(false)}
                className="w-full py-3 text-text-secondary text-sm"
              >
                다음에 할게요
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 병원 프로필 완성하기 CTA 모달 */}
      <AnimatePresence>
        {showProfileCTA && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-2xl p-6"
            >
              <h3 className="text-lg font-bold mb-4 text-center">병원 프로필 완성하기</h3>
              <p className="text-sm text-text-secondary text-center mb-6">
                프로필을 완성하면<br />더 많은 구직자에게 노출돼요!
              </p>
              <div className="space-y-3">
                <Link href="/employer/profile/setup">
                  <button
                    onClick={completeReset}
                    className="btn-primary w-full"
                  >
                    프로필 완성하러 가기
                  </button>
                </Link>
                <button
                  onClick={() => setShowProfileCTA(false)}
                  className="w-full py-3 text-text-secondary text-sm"
                >
                  취소
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 동료 원장님 초대하기 CTA 모달 */}
      <AnimatePresence>
        {showEmployeeCTA && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-2xl p-6"
            >
              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-7 h-7 text-info" />
                </div>
                <h3 className="text-lg font-bold">동료 원장님 초대하기</h3>
                <p className="text-sm text-text-secondary mt-1">
                  동료 원장님을 초대하고 함께 혜택을 받으세요!
                </p>
              </div>

              {/* 초대 링크 복사 */}
              <div className="bg-bg-secondary rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">내 초대 링크</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://mediinside.com/invite/EMPLOYER123');
                      completeReset();
                    }}
                    className="text-xs text-brand-mint font-medium flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    복사
                  </button>
                </div>
                <div className="text-xs text-text-tertiary truncate">
                  https://mediinside.com/invite/EMPLOYER123
                </div>
              </div>

              {/* 혜택 안내 */}
              <div className="bg-success/5 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-success mb-2">초대 성공 시 혜택</p>
                <ul className="text-xs text-text-secondary space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-success" />
                    거절 횟수 10회 초기화
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-success" />
                    프리미엄 기능 1주일 무료
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setShowEmployeeCTA(false)}
                className="w-full py-3 text-text-secondary text-sm"
              >
                취소
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 구직자 추천하기 CTA 모달 */}
      <AnimatePresence>
        {showReferralCTA && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-2xl p-6"
            >
              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <UserPlus className="w-7 h-7 text-success" />
                </div>
                <h3 className="text-lg font-bold">구직자 추천하기</h3>
                <p className="text-sm text-text-secondary mt-1">
                  구직자를 추천하고 혜택을 받으세요!
                </p>
              </div>

              {/* 추천 링크 복사 */}
              <div className="bg-bg-secondary rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">추천 링크</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://mediinside.com/seeker/signup?ref=EMPLOYER123');
                      completeReset();
                    }}
                    className="text-xs text-brand-mint font-medium flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    복사
                  </button>
                </div>
                <div className="text-xs text-text-tertiary truncate">
                  https://mediinside.com/seeker/signup?ref=EMPLOYER123
                </div>
              </div>

              {/* 혜택 안내 */}
              <div className="bg-success/5 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-success mb-2">추천 성공 시 혜택</p>
                <ul className="text-xs text-text-secondary space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-success" />
                    거절 횟수 10회 초기화
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-success" />
                    추천 구직자 매칭 우선 노출
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setShowReferralCTA(false)}
                className="w-full py-3 text-text-secondary text-sm"
              >
                취소
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 재직경험 공유하기 CTA 모달 */}
      <AnimatePresence>
        {showWorkExperienceCTA && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-white rounded-2xl p-6"
            >
              <div className="text-center mb-5">
                <div className="w-14 h-14 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="w-7 h-7 text-warning" />
                </div>
                <h3 className="text-lg font-bold">재직경험 공유하기</h3>
                <p className="text-sm text-text-secondary mt-1">
                  재직했던 곳에 대한 리뷰를 남겨주세요!
                </p>
              </div>

              {/* 혜택 안내 */}
              <div className="bg-warning/5 rounded-xl p-4 mb-4">
                <p className="text-sm font-medium text-warning mb-2">리뷰 작성 시 혜택</p>
                <ul className="text-xs text-text-secondary space-y-1">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    거절 횟수 10회 초기화
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    프로필 신뢰도 배지 획득
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-success" />
                    매칭 우선순위 상승
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <Link
                  href="/employer/profile?section=workExperience"
                  onClick={completeReset}
                  className="btn-primary w-full block text-center"
                >
                  리뷰 작성하러 가기
                </Link>
                <button
                  onClick={() => setShowWorkExperienceCTA(false)}
                  className="w-full py-3 text-text-secondary text-sm"
                >
                  취소
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EmployerMatchingCenterPage() {
  return (
    <Suspense fallback={
      <div className="px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-bg-secondary rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-bg-secondary rounded w-2/3 mb-6"></div>
          <div className="flex gap-2 mb-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-10 bg-bg-secondary rounded-full w-32"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-bg-secondary rounded-2xl"></div>
            ))}
          </div>
        </div>
      </div>
    }>
      <MatchingCenterContent />
    </Suspense>
  );
}
