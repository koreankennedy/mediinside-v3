'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
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
} from 'lucide-react';
import { mockCandidates } from '@/lib/mock/data';

const DAILY_REJECT_LIMIT = 10;

const tabs = [
  { id: 'all', label: '전체', count: 10 },
  { id: 'new', label: '신규', count: 5 },
  { id: 'proposed', label: '제안완료', count: 3 },
  { id: 'interested', label: '관심표시', count: 2 },
  { id: 'negotiating', label: '협상중', count: 1 },
  { id: 'interview', label: '면접예정', count: 1 },
];

const statusConfig: Record<string, { label: string; color: string; bgColor: string }> = {
  new: { label: '신규', color: 'text-brand-mint', bgColor: 'bg-brand-mint/10' },
  proposed: { label: '제안완료', color: 'text-info', bgColor: 'bg-info/10' },
  interested: { label: '관심표시', color: 'text-error', bgColor: 'bg-error/10' },
  negotiating: { label: '협상중', color: 'text-warning', bgColor: 'bg-warning/10' },
  interview: { label: '면접예정', color: 'text-success', bgColor: 'bg-success/10' },
};

const fitTypeColors: Record<string, string> = {
  high_end_achiever: 'text-match-gold',
  practical_expert: 'text-info',
  self_actualizer: 'text-error',
  trust_centered_expert: 'text-success',
};

// 업무강도 정보
const intensityInfo: Record<string, { label: string; color: string; bgColor: string }> = {
  low: { label: '여유', color: 'text-success', bgColor: 'bg-success/10' },
  middle: { label: '보통', color: 'text-warning', bgColor: 'bg-warning/10' },
  high: { label: '바쁨', color: 'text-error', bgColor: 'bg-error/10' },
};

// 채용상품 정보
const productInfo: Record<string, { label: string; color: string; icon: string }> = {
  share: { label: '매출 셰어', color: '#FF2D55', icon: '💰' },
  bonus: { label: '근속 보너스', color: '#AF52DE', icon: '🎁' },
  vacation: { label: '휴가 자유', color: '#5AC8FA', icon: '🏖️' },
  allowance: { label: '수당 보장', color: '#FF9500', icon: '💵' },
};

function MatchingCenterContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedCandidate, setSelectedCandidate] = useState<typeof mockCandidates[0] | null>(null);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);
  const [negotiationCandidate, setNegotiationCandidate] = useState<typeof mockCandidates[0] | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleCandidate, setScheduleCandidate] = useState<typeof mockCandidates[0] | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('hospital');
  const [interviewNote, setInterviewNote] = useState<string>('');
  const [showStartNegotiationModal, setShowStartNegotiationModal] = useState(false);
  const [startNegotiationCandidate, setStartNegotiationCandidate] = useState<typeof mockCandidates[0] | null>(null);
  const [proposedSalary, setProposedSalary] = useState('380');
  const [workType, setWorkType] = useState('정규직');
  const [workDays, setWorkDays] = useState('주 5일');
  const [additionalBenefits, setAdditionalBenefits] = useState<string[]>([]);
  const [showDropModal, setShowDropModal] = useState(false);
  const [dropCandidate, setDropCandidate] = useState<typeof mockCandidates[0] | null>(null);
  const [dropReason, setDropReason] = useState('');
  const [dailyRejectCount, setDailyRejectCount] = useState(3); // 시뮬레이션: 이미 3회 거절
  const [isRejectLimited, setIsRejectLimited] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [droppedCandidates, setDroppedCandidates] = useState<string[]>([]); // 거절한 후보자 ID 목록
  const remainingRejects = DAILY_REJECT_LIMIT - dailyRejectCount;

  // URL 파라미터 변경 시 탭 업데이트
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && tabs.some(t => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const filteredCandidates = mockCandidates.filter((c) => {
    // 거절된 후보자는 제외
    if (droppedCandidates.includes(c.id)) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'new') return c.status === 'new' || c.isNew;
    return c.status === activeTab;
  });

  // 협상 모달 열기
  const openNegotiation = (candidate: typeof mockCandidates[0]) => {
    setNegotiationCandidate(candidate);
    setShowNegotiationModal(true);
  };

  // 조율 시작 모달 열기
  const openStartNegotiation = (candidate: typeof mockCandidates[0]) => {
    setStartNegotiationCandidate(candidate);
    setProposedSalary('380');
    setWorkType('정규직');
    setWorkDays('주 5일');
    setAdditionalBenefits([]);
    setShowStartNegotiationModal(true);
  };

  // 조율 시작 확정
  const confirmStartNegotiation = () => {
    if (!startNegotiationCandidate) return;
    alert(`${startNegotiationCandidate.name}님에게 조건을 제안했습니다!\n\n제안 급여: ${proposedSalary}만원\n근무 형태: ${workType}\n근무일: ${workDays}`);
    setShowStartNegotiationModal(false);
    updateStatus(startNegotiationCandidate.id, 'negotiating');
  };

  const toggleBenefit = (benefit: string) => {
    setAdditionalBenefits(prev =>
      prev.includes(benefit) ? prev.filter(b => b !== benefit) : [...prev, benefit]
    );
  };

  // 드랍 모달 열기
  const openDropModal = (candidate: typeof mockCandidates[0]) => {
    // 거절 횟수가 10회 이상이면 거절 불가
    if (dailyRejectCount >= DAILY_REJECT_LIMIT || isRejectLimited) {
      setIsRejectLimited(true);
      setShowResetModal(true);
      return;
    }
    setDropCandidate(candidate);
    setDropReason('');
    setShowDropModal(true);
  };

  // 거절 확정
  const confirmDrop = () => {
    if (!dropCandidate) return;
    // 거절 횟수가 10회 이상이면 거절 불가
    if (dailyRejectCount >= DAILY_REJECT_LIMIT) {
      setIsRejectLimited(true);
      setShowResetModal(true);
      setShowDropModal(false);
      return;
    }
    // 거절한 후보자 목록에 추가
    setDroppedCandidates(prev => [...prev, dropCandidate.id]);
    const newCount = dailyRejectCount + 1;
    setDailyRejectCount(newCount);
    setShowDropModal(false);
    setSelectedCandidate(null);

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

  // 거절 횟수 초기화
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

  // 일정잡기 모달 열기
  const openSchedule = (candidate: typeof mockCandidates[0]) => {
    setScheduleCandidate(candidate);
    setSelectedDate('');
    setSelectedTime('');
    setSelectedLocation('hospital');
    setInterviewNote('');
    setShowScheduleModal(true);
  };

  // 면접 일정 확정
  const confirmSchedule = () => {
    if (!selectedDate || !selectedTime) {
      alert('날짜와 시간을 선택해주세요.');
      return;
    }
    alert(`면접이 예약되었습니다!\n\n후보자: ${scheduleCandidate?.name}\n일시: ${selectedDate} ${selectedTime}\n장소: ${selectedLocation === 'hospital' ? '병원 내 회의실' : selectedLocation === 'video' ? '화상 면접' : '외부 장소'}`);
    setShowScheduleModal(false);
    updateStatus(scheduleCandidate?.id || '', 'interview');
  };

  // 날짜 옵션 생성 (오늘부터 2주)
  const dateOptions = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayName = dayNames[date.getDay()];
    return {
      value: `${month}월 ${day}일`,
      label: `${month}월 ${day}일 (${dayName})`,
      isWeekend: date.getDay() === 0 || date.getDay() === 6,
    };
  });

  // 시간 옵션 생성
  const timeOptions = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  const updateStatus = (id: string, newStatus: string) => {
    // 실제로는 API 호출
    alert(`${id} 상태가 ${newStatus}로 변경되었습니다.`);
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-dashboard-title">매칭 센터</h1>
        <p className="text-sm text-text-secondary mt-1">
          후보자와의 채용 진행 현황을 관리하세요
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-expert-navy text-white'
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

      {/* 요약 카드 */}
      <div className="bg-expert-navy/5 rounded-2xl p-4 mb-4 border border-expert-navy/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-text-secondary">이번 주 채용 활동</div>
            <div className="text-lg font-bold text-expert-navy mt-1">
              제안 8건 · 응답 5건 · 면접 2건
            </div>
          </div>
          <div className="w-12 h-12 bg-expert-navy/10 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-expert-navy" />
          </div>
        </div>
      </div>

      {/* 후보자 리스트 */}
      <div className="space-y-4">
        {filteredCandidates.map((candidate, index) => {
          const status = statusConfig[candidate.status] || statusConfig.new;

          return (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedCandidate(candidate)}
              className="bg-white rounded-2xl p-4 border border-border-light cursor-pointer hover:shadow-card transition-all"
            >
              {/* 상태 및 시간 */}
              <div className="flex items-center justify-between mb-3">
                <span className={`badge-base ${status.bgColor} ${status.color}`}>
                  {status.label}
                </span>
                {candidate.proposedAt && (
                  <span className="text-xs text-text-tertiary">{candidate.proposedAt}</span>
                )}
              </div>

              {/* 후보자 정보 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-expert-navy/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-expert-navy" />
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">{candidate.name}</div>
                    <div className="text-sm text-text-secondary">
                      {candidate.licenseType} · {candidate.experience}
                    </div>
                    <div className="text-xs text-text-tertiary mt-0.5">
                      {candidate.fitTypeLabel}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-brand-mint">{candidate.matchScore}%</div>
                  <div className="text-xs text-text-tertiary">매칭</div>
                </div>
              </div>

              {/* 술기 */}
              <div className="flex flex-wrap gap-1 mb-3">
                {candidate.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-bg-secondary text-text-secondary px-2 py-0.5 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* 희망 업무강도 & 선호 채용상품 */}
              <div className="flex items-center gap-2 flex-wrap mb-3">
                {/* 희망 업무강도 */}
                {candidate.preferredIntensity && (
                  <span className={`text-xs px-2 py-1 rounded-full ${intensityInfo[candidate.preferredIntensity]?.bgColor} ${intensityInfo[candidate.preferredIntensity]?.color}`}>
                    희망 {intensityInfo[candidate.preferredIntensity]?.label}
                  </span>
                )}
                {/* 선호 채용상품 */}
                {candidate.preferredProducts?.slice(0, 2).map((productType: string) => {
                  const product = productInfo[productType];
                  if (!product) return null;
                  return (
                    <span
                      key={productType}
                      className="text-xs px-2 py-1 rounded-full text-white"
                      style={{ backgroundColor: product.color }}
                    >
                      {product.icon} {product.label}
                    </span>
                  );
                })}
              </div>

              {/* 성향 FIT */}
              {candidate.hasColleagueFit && (
                <div className="nudge-box text-xs mb-3">
                  <Sparkles className="w-3 h-3 text-brand-mint inline mr-1" />
                  비슷한 성향의 기존 직원과 <strong>잘 맞아요</strong>
                </div>
              )}

              {/* 빠른 액션 */}
              <div className="flex gap-2 pt-3 border-t border-border-light">
                {candidate.status === 'new' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(candidate.id, 'proposed');
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-expert-navy text-white rounded-lg font-medium"
                    >
                      <Send className="w-4 h-4" />
                      제안하기
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-error/10 text-error rounded-lg font-medium hover:bg-error/20 transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                      관심
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDropModal(candidate);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-bg-secondary text-text-secondary rounded-lg font-medium hover:bg-error/10 hover:text-error transition-colors"
                    >
                      <X className="w-4 h-4" />
                      거절
                    </button>
                  </>
                )}
                {candidate.status === 'proposed' && (
                  <>
                    <div className="flex-1 text-center text-sm text-info bg-info/10 py-2 rounded-lg font-medium">
                      <Clock className="w-4 h-4 inline mr-1" />
                      응답 대기 중...
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDropModal(candidate);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-bg-secondary text-text-secondary rounded-lg font-medium hover:bg-error/10 hover:text-error transition-colors"
                    >
                      <X className="w-4 h-4" />
                      거절
                    </button>
                  </>
                )}
                {candidate.status === 'interested' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openStartNegotiation(candidate);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-expert-navy text-white rounded-lg font-medium"
                    >
                      <MessageCircle className="w-4 h-4" />
                      조율 시작
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDropModal(candidate);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-bg-secondary text-text-secondary rounded-lg font-medium hover:bg-error/10 hover:text-error transition-colors"
                    >
                      <X className="w-4 h-4" />
                      거절
                    </button>
                  </>
                )}
                {candidate.status === 'negotiating' && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openNegotiation(candidate);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-warning text-white rounded-lg font-medium"
                    >
                      <DollarSign className="w-4 h-4" />
                      협상 상세
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openSchedule(candidate);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-success text-white rounded-lg font-medium"
                    >
                      <Calendar className="w-4 h-4" />
                      면접 잡기
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDropModal(candidate);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-bg-secondary text-text-secondary rounded-lg font-medium hover:bg-error/10 hover:text-error transition-colors"
                    >
                      <X className="w-4 h-4" />
                      거절
                    </button>
                  </>
                )}
                {candidate.status === 'interview' && (
                  <>
                    <Link href={`/employer/ai-interview/copilot?id=${candidate.id}`} className="flex-1">
                      <button className="w-full flex items-center justify-center gap-1 py-2 text-sm bg-expert-navy text-white rounded-lg font-medium">
                        <Sparkles className="w-4 h-4" />
                        면접 코파일럿
                      </button>
                    </Link>
                    <div className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-success bg-success/10 rounded-lg font-medium">
                      <Calendar className="w-4 h-4" />
                      내일 14:00
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDropModal(candidate);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-bg-secondary text-text-secondary rounded-lg font-medium hover:bg-error/10 hover:text-error transition-colors"
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

      {filteredCandidates.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
          <div className="text-text-secondary">해당 상태의 후보자가 없어요</div>
          <Link href="/employer/candidates">
            <button className="btn-primary mt-4">
              인재 탐색하기
            </button>
          </Link>
        </div>
      )}

      {/* 후보자 상세 바텀시트 */}
      <AnimatePresence>
        {selectedCandidate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 pb-8">
                <div className="w-12 h-1.5 bg-bg-tertiary rounded-full mx-auto mb-4" />

                {/* 헤더 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-expert-navy/10 rounded-full flex items-center justify-center">
                      <Users className="w-7 h-7 text-expert-navy" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-expert-navy">
                        {selectedCandidate.name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {selectedCandidate.licenseType} · {selectedCandidate.experience}
                      </div>
                      <div className={`text-xs mt-0.5 ${fitTypeColors[selectedCandidate.fitType]}`}>
                        {selectedCandidate.fitTypeLabel}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-mint">
                      {selectedCandidate.matchScore}%
                    </div>
                    <div className="text-xs text-text-tertiary">매칭</div>
                  </div>
                </div>

                {/* 현재 상태 */}
                <div className="bg-bg-secondary rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">현재 상태</span>
                    <span className={`font-semibold ${statusConfig[selectedCandidate.status]?.color || 'text-brand-mint'}`}>
                      {statusConfig[selectedCandidate.status]?.label || '신규'}
                    </span>
                  </div>
                </div>

                {/* 1. 희망조건 (희망 채용상품, 희망 업무강도 포함) */}
                <div className="bg-white rounded-2xl border border-border-light p-4 mb-4">
                  <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-info" />
                    희망조건
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <span className="text-text-secondary text-sm">희망 급여</span>
                      <span className="font-semibold text-text-primary">{selectedCandidate.desiredSalary}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <span className="text-text-secondary text-sm">선호 근무형태</span>
                      <span className="font-medium text-text-primary">정규직</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <span className="text-text-secondary text-sm">입사 가능일</span>
                      <span className="font-medium text-text-primary">협의 가능</span>
                    </div>
                    {/* 희망 업무강도 */}
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <span className="text-text-secondary text-sm">희망 업무강도</span>
                      {selectedCandidate.preferredIntensity ? (
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${intensityInfo[selectedCandidate.preferredIntensity]?.bgColor} ${intensityInfo[selectedCandidate.preferredIntensity]?.color}`}>
                          {intensityInfo[selectedCandidate.preferredIntensity]?.label}
                        </span>
                      ) : (
                        <span className="text-text-tertiary text-sm">무관</span>
                      )}
                    </div>
                    {/* 희망 채용상품 */}
                    <div className="pt-2">
                      <span className="text-text-secondary text-sm block mb-2">희망 채용상품</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedCandidate.preferredProducts?.map((productType: string) => {
                          const product = productInfo[productType];
                          if (!product) return null;
                          return (
                            <span
                              key={productType}
                              className="text-xs px-3 py-1.5 rounded-full text-white font-medium"
                              style={{ backgroundColor: product.color }}
                            >
                              {product.icon} {product.label}
                            </span>
                          );
                        }) || <span className="text-text-tertiary text-sm">선호 없음</span>}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. 경력 */}
                <div className="bg-white rounded-2xl border border-border-light p-4 mb-4">
                  <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-expert-navy" />
                    경력
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <span className="text-text-secondary text-sm">총 경력</span>
                      <span className="font-semibold text-text-primary">{selectedCandidate.experience}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <span className="text-text-secondary text-sm">현 직장</span>
                      <span className="font-medium text-text-primary">{selectedCandidate.currentHospital}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <span className="text-text-secondary text-sm">면허 종류</span>
                      <span className="font-medium text-text-primary">{selectedCandidate.licenseType}</span>
                    </div>
                    {/* 주요 경력 */}
                    <div className="pt-2">
                      <span className="text-text-secondary text-sm block mb-2">주요 경력</span>
                      <div className="space-y-2">
                        <div className="bg-bg-secondary rounded-lg p-3">
                          <div className="text-sm font-medium text-text-primary">{selectedCandidate.currentHospital}</div>
                          <div className="text-xs text-text-tertiary">2021.03 ~ 현재 · 3년 10개월</div>
                        </div>
                        <div className="bg-bg-secondary rounded-lg p-3">
                          <div className="text-sm font-medium text-text-primary">연세플러스치과</div>
                          <div className="text-xs text-text-tertiary">2018.01 ~ 2021.02 · 3년 2개월</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. 보유 술기 */}
                <div className="bg-white rounded-2xl border border-border-light p-4 mb-4">
                  <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4 text-brand-mint" />
                    보유 술기
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-brand-mint/10 text-brand-mint rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 4. 동료 리뷰 */}
                <div className="bg-white rounded-2xl border border-border-light p-4 mb-4">
                  <h3 className="text-sm font-bold text-text-primary mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4 text-match-gold" />
                    동료 리뷰
                  </h3>
                  {selectedCandidate.hasColleagueFit ? (
                    <div className="space-y-3">
                      <div className="bg-match-gold/5 rounded-xl p-3 border border-match-gold/20">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-match-gold/20 rounded-full flex items-center justify-center">
                            <span className="text-xs">👨‍⚕️</span>
                          </div>
                          <span className="text-xs text-text-secondary">함께 근무한 동료</span>
                          <div className="ml-auto flex items-center gap-1">
                            <Star className="w-3 h-3 text-match-gold fill-match-gold" />
                            <span className="text-xs font-semibold text-match-gold">4.8</span>
                          </div>
                        </div>
                        <p className="text-sm text-text-primary">
                          &ldquo;환자 응대가 친절하고 꼼꼼해요. 시술 보조도 능숙하게 잘 합니다.&rdquo;
                        </p>
                      </div>
                      <div className="bg-bg-secondary rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-bg-tertiary rounded-full flex items-center justify-center">
                            <span className="text-xs">👩‍⚕️</span>
                          </div>
                          <span className="text-xs text-text-secondary">이전 직장 동료</span>
                          <div className="ml-auto flex items-center gap-1">
                            <Star className="w-3 h-3 text-match-gold fill-match-gold" />
                            <span className="text-xs font-semibold text-match-gold">4.5</span>
                          </div>
                        </div>
                        <p className="text-sm text-text-primary">
                          &ldquo;책임감이 강하고 배우려는 자세가 좋아요. 팀워크도 좋습니다.&rdquo;
                        </p>
                      </div>
                      <div className="nudge-box text-xs">
                        <Sparkles className="w-3 h-3 text-brand-mint inline mr-1" />
                        비슷한 성향의 기존 직원과 <strong>잘 맞아요</strong>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-text-tertiary text-sm">
                      아직 등록된 동료 리뷰가 없어요
                    </div>
                  )}
                </div>

                {/* 채용 단계별 액션 */}
                <div className="space-y-3">
                  {selectedCandidate.status === 'new' && (
                    <button
                      onClick={() => {
                        alert('채용 제안을 보냈습니다!');
                        setSelectedCandidate(null);
                      }}
                      className="btn-primary w-full bg-expert-navy"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      채용 제안 보내기
                    </button>
                  )}
                  {selectedCandidate.status === 'interested' && (
                    <button
                      onClick={() => {
                        setSelectedCandidate(null);
                        openStartNegotiation(selectedCandidate);
                      }}
                      className="btn-primary w-full bg-expert-navy"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      조율 시작하기
                    </button>
                  )}
                  {selectedCandidate.status === 'negotiating' && (
                    <button
                      onClick={() => {
                        setSelectedCandidate(null);
                        openSchedule(selectedCandidate);
                      }}
                      className="btn-primary w-full bg-success"
                    >
                      <Calendar className="w-5 h-5 mr-2" />
                      면접 일정 잡기
                    </button>
                  )}
                  {selectedCandidate.status === 'interview' && (
                    <>
                      <div className="bg-success/10 rounded-xl p-4 mb-4">
                        <div className="flex items-center gap-3 mb-3">
                          <Calendar className="w-6 h-6 text-success" />
                          <div>
                            <div className="font-semibold text-success">내일 14:00 면접 예정</div>
                            <div className="text-sm text-text-secondary">병원 3층 회의실</div>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-text-secondary">면접 유형</span>
                            <span className="font-medium">2차 대면 면접</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-text-secondary">면접관</span>
                            <span className="font-medium">원장님, 수간호사</span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/employer/ai-interview/copilot?id=${selectedCandidate.id}`}>
                        <button className="btn-primary w-full bg-expert-navy mb-3">
                          <Sparkles className="w-5 h-5 mr-2" />
                          면접 코파일럿으로 준비하기
                        </button>
                      </Link>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="py-3 border border-border-light text-text-primary rounded-xl font-medium text-sm">
                          일정 변경
                        </button>
                        <Link href={`/employer/ai-interview/offer?id=${selectedCandidate.id}`}>
                          <button className="w-full py-3 bg-success/10 text-success rounded-xl font-medium text-sm">
                            오퍼 발송 준비
                          </button>
                        </Link>
                      </div>
                    </>
                  )}

                  <Link href={`/employer/concierge?candidate=${selectedCandidate.id}`}>
                    <button className="btn-outline w-full">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      AI에게 이 후보자 질문하기
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 협상 상세 모달 */}
      <AnimatePresence>
        {showNegotiationModal && negotiationCandidate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowNegotiationModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-border-light px-4 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-bold">협상 상세</h2>
                <button onClick={() => setShowNegotiationModal(false)}>
                  <X className="w-6 h-6 text-text-tertiary" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* 후보자 정보 */}
                <div className="bg-bg-secondary rounded-2xl p-4">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-14 h-14 bg-expert-navy/10 rounded-full flex items-center justify-center">
                      <Users className="w-7 h-7 text-expert-navy" />
                    </div>
                    <div>
                      <div className="font-bold text-text-primary text-lg">{negotiationCandidate.name}</div>
                      <div className="text-sm text-text-secondary">
                        {negotiationCandidate.licenseType} · {negotiationCandidate.experience}
                      </div>
                    </div>
                    <span className="ml-auto text-xl font-bold text-brand-mint">{negotiationCandidate.matchScore}%</span>
                  </div>
                </div>

                {/* 협상 이력 */}
                <div className="bg-white rounded-2xl p-4 border border-border-light">
                  <h3 className="font-semibold text-text-primary mb-4">협상 진행 상황</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-brand-mint rounded-full mt-2" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-primary">병원 제안</div>
                        <div className="text-sm text-text-secondary">연봉 380~420만원, 주5일 근무</div>
                        <div className="text-xs text-text-tertiary mt-1">2일 전</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-warning rounded-full mt-2" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-text-primary">후보자 응답</div>
                        <div className="text-sm text-warning font-medium">급여 조정 요청</div>
                        <div className="text-sm text-text-secondary">&ldquo;400만원 이상 희망합니다&rdquo;</div>
                        <div className="text-xs text-text-tertiary mt-1">1일 전</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 조건 비교 */}
                <div className="bg-white rounded-2xl p-4 border border-border-light">
                  <h3 className="font-semibold text-text-primary mb-4">조건 비교</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-warning/5 rounded-xl border border-warning/20">
                      <div>
                        <div className="text-sm font-medium text-text-primary">급여</div>
                        <div className="text-xs text-text-secondary">조정 필요</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-warning font-medium">후보자: 400만+</div>
                        <div className="text-xs text-text-tertiary">병원: 380~420만</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-success/5 rounded-xl border border-success/20">
                      <div>
                        <div className="text-sm font-medium text-text-primary">근무형태</div>
                        <div className="text-xs text-text-secondary">일치</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-success font-medium">정규직</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-success/5 rounded-xl border border-success/20">
                      <div>
                        <div className="text-sm font-medium text-text-primary">근무시간</div>
                        <div className="text-xs text-text-secondary">일치</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-success font-medium">주 5일 (9-6시)</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI 추천 */}
                <div className="bg-brand-mint/5 rounded-2xl p-4 border border-brand-mint/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-brand-mint" />
                    <span className="font-semibold text-brand-mint">AI 협상 가이드</span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    시장 평균 대비 후보자의 경력(7년)을 고려하면 400만원 제안은 합리적입니다.
                    인센티브 조건을 추가하여 총 보상을 높이는 방안을 추천합니다.
                  </p>
                </div>

                {/* 액션 버튼 */}
                <div className="space-y-3 pt-2">
                  <button className="w-full py-3.5 bg-expert-navy text-white rounded-xl font-medium flex items-center justify-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    수정 조건 제안하기
                  </button>
                  <button
                    onClick={() => {
                      setShowNegotiationModal(false);
                      openSchedule(negotiationCandidate);
                    }}
                    className="w-full py-3.5 bg-success text-white rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    조건 협의 완료, 면접 일정 잡기
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href={`/employer/concierge?candidate=${negotiationCandidate.id}`}>
                      <button className="w-full py-3 border border-border-light text-text-primary rounded-xl font-medium flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        메시지 보내기
                      </button>
                    </Link>
                    <Link href={`/employer/candidates/${negotiationCandidate.id}`}>
                      <button className="w-full py-3 border border-border-light text-text-primary rounded-xl font-medium flex items-center justify-center gap-2">
                        <Users className="w-4 h-4" />
                        프로필 보기
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 조율 시작 모달 */}
      <AnimatePresence>
        {showStartNegotiationModal && startNegotiationCandidate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowStartNegotiationModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-border-light px-4 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-bold">조율 시작</h2>
                <button onClick={() => setShowStartNegotiationModal(false)}>
                  <X className="w-6 h-6 text-text-tertiary" />
                </button>
              </div>

              <div className="p-4 space-y-5">
                {/* 후보자 정보 */}
                <div className="bg-brand-mint/5 border border-brand-mint/20 rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-brand-mint/10 rounded-full flex items-center justify-center">
                      <Users className="w-7 h-7 text-brand-mint" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-text-primary text-lg">{startNegotiationCandidate.name}</div>
                      <div className="text-sm text-text-secondary">
                        {startNegotiationCandidate.licenseType} · {startNegotiationCandidate.experience}
                      </div>
                      <div className="text-xs text-brand-mint mt-1">관심 표시 완료</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-brand-mint">{startNegotiationCandidate.matchScore}%</div>
                      <div className="text-xs text-text-tertiary">매칭</div>
                    </div>
                  </div>
                </div>

                {/* 후보자 희망 조건 */}
                <div className="bg-bg-secondary rounded-2xl p-4">
                  <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Target className="w-5 h-5 text-info" />
                    후보자 희망 조건
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-text-secondary">희망 급여</span>
                      <span className="font-medium text-text-primary">{startNegotiationCandidate.desiredSalary}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-text-secondary">선호 근무형태</span>
                      <span className="font-medium text-text-primary">정규직</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-text-secondary">입사 가능일</span>
                      <span className="font-medium text-text-primary">협의 가능</span>
                    </div>
                  </div>
                </div>

                {/* 제안 급여 */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-warning" />
                    제안 급여
                  </h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={proposedSalary}
                      onChange={(e) => setProposedSalary(e.target.value)}
                      className="flex-1 p-3 border border-border-light rounded-xl text-lg font-semibold text-center"
                      placeholder="380"
                    />
                    <span className="text-text-secondary font-medium">만원/월</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {['350', '380', '400', '420', '450'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setProposedSalary(val)}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          proposedSalary === val
                            ? 'bg-warning text-white'
                            : 'bg-bg-secondary text-text-secondary'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 근무 형태 */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-expert-navy" />
                    근무 형태
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['정규직', '계약직', '파트타임'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setWorkType(type)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          workType === type
                            ? 'bg-expert-navy text-white'
                            : 'bg-white border border-border-light text-text-primary'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 근무일 */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-success" />
                    근무일
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['주 5일', '주 4.5일', '주 4일'].map((days) => (
                      <button
                        key={days}
                        onClick={() => setWorkDays(days)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          workDays === days
                            ? 'bg-success text-white'
                            : 'bg-white border border-border-light text-text-primary'
                        }`}
                      >
                        {days}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 추가 혜택 */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Star className="w-5 h-5 text-match-gold" />
                    추가 혜택 선택
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {['인센티브', '성과급', '학회비 지원', '자격증 취득 지원', '점심 제공', '주차 지원'].map((benefit) => (
                      <button
                        key={benefit}
                        onClick={() => toggleBenefit(benefit)}
                        className={`px-3 py-2 rounded-full text-sm font-medium transition-all ${
                          additionalBenefits.includes(benefit)
                            ? 'bg-match-gold/10 text-match-gold border border-match-gold/30'
                            : 'bg-bg-secondary text-text-secondary'
                        }`}
                      >
                        {additionalBenefits.includes(benefit) && <CheckCircle className="w-3 h-3 inline mr-1" />}
                        {benefit}
                      </button>
                    ))}
                  </div>
                </div>

                {/* AI 추천 */}
                <div className="bg-brand-mint/5 rounded-2xl p-4 border border-brand-mint/20">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-brand-mint" />
                    <span className="font-semibold text-brand-mint">AI 추천</span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    후보자의 경력({startNegotiationCandidate.experience})과 희망 급여({startNegotiationCandidate.desiredSalary})를 고려할 때,
                    <strong className="text-brand-mint"> 400만원 + 인센티브</strong> 조건이 수락률이 높습니다.
                  </p>
                </div>

                {/* 제안 요약 */}
                <div className="bg-expert-navy/5 rounded-2xl p-4 border border-expert-navy/10">
                  <h4 className="text-sm font-medium text-expert-navy mb-3">제안 조건 요약</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">제안 급여</span>
                      <span className="font-semibold text-expert-navy">{proposedSalary}만원/월</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">근무 형태</span>
                      <span className="font-medium text-text-primary">{workType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">근무일</span>
                      <span className="font-medium text-text-primary">{workDays}</span>
                    </div>
                    {additionalBenefits.length > 0 && (
                      <div className="flex justify-between">
                        <span className="text-text-secondary">추가 혜택</span>
                        <span className="font-medium text-match-gold">{additionalBenefits.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="space-y-3 pt-2 pb-4">
                  <button
                    onClick={confirmStartNegotiation}
                    className="w-full py-4 bg-expert-navy text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    조건 제안하기
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <Link href={`/employer/concierge?candidate=${startNegotiationCandidate.id}`}>
                      <button className="w-full py-3 border border-border-light text-text-primary rounded-xl font-medium flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        먼저 대화하기
                      </button>
                    </Link>
                    <Link href={`/employer/candidates/${startNegotiationCandidate.id}`}>
                      <button className="w-full py-3 border border-border-light text-text-primary rounded-xl font-medium flex items-center justify-center gap-2">
                        <Users className="w-4 h-4" />
                        프로필 보기
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 일정잡기 모달 */}
      <AnimatePresence>
        {showScheduleModal && scheduleCandidate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowScheduleModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-border-light px-4 py-4 flex items-center justify-between z-10">
                <h2 className="text-lg font-bold">면접 일정 잡기</h2>
                <button onClick={() => setShowScheduleModal(false)}>
                  <X className="w-6 h-6 text-text-tertiary" />
                </button>
              </div>

              <div className="p-4 space-y-5">
                {/* 후보자 정보 */}
                <div className="bg-success/5 border border-success/20 rounded-2xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center">
                      <Users className="w-7 h-7 text-success" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-text-primary text-lg">{scheduleCandidate.name}</div>
                      <div className="text-sm text-text-secondary">
                        {scheduleCandidate.licenseType} · {scheduleCandidate.experience}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-brand-mint">{scheduleCandidate.matchScore}%</div>
                      <div className="text-xs text-text-tertiary">매칭</div>
                    </div>
                  </div>
                </div>

                {/* 날짜 선택 */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-success" />
                    날짜 선택
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {dateOptions.slice(0, 9).map((date) => (
                      <button
                        key={date.value}
                        onClick={() => setSelectedDate(date.value)}
                        className={`p-3 rounded-xl text-sm font-medium transition-all ${
                          selectedDate === date.value
                            ? 'bg-success text-white'
                            : date.isWeekend
                            ? 'bg-bg-secondary text-text-tertiary'
                            : 'bg-white border border-border-light text-text-primary hover:border-success'
                        }`}
                      >
                        {date.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 시간 선택 */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-success" />
                    시간 선택
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {timeOptions.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-2.5 rounded-xl text-sm font-medium transition-all ${
                          selectedTime === time
                            ? 'bg-success text-white'
                            : 'bg-white border border-border-light text-text-primary hover:border-success'
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 면접 장소 */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-success" />
                    면접 장소
                  </h3>
                  <div className="space-y-2">
                    {[
                      { id: 'hospital', label: '병원 내 회의실', desc: '병원 3층 회의실' },
                      { id: 'video', label: '화상 면접', desc: 'Zoom 링크 자동 발송' },
                      { id: 'external', label: '외부 장소', desc: '장소 직접 입력' },
                    ].map((loc) => (
                      <button
                        key={loc.id}
                        onClick={() => setSelectedLocation(loc.id)}
                        className={`w-full p-4 rounded-xl text-left transition-all ${
                          selectedLocation === loc.id
                            ? 'bg-success/10 border-2 border-success'
                            : 'bg-white border border-border-light hover:border-success'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-text-primary">{loc.label}</div>
                            <div className="text-xs text-text-secondary mt-0.5">{loc.desc}</div>
                          </div>
                          {selectedLocation === loc.id && (
                            <CheckCircle className="w-5 h-5 text-success" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 메모 */}
                <div>
                  <h3 className="font-semibold text-text-primary mb-3">면접 메모 (선택)</h3>
                  <textarea
                    value={interviewNote}
                    onChange={(e) => setInterviewNote(e.target.value)}
                    placeholder="면접 시 확인할 사항이나 메모를 입력하세요"
                    className="w-full p-4 border border-border-light rounded-xl text-sm resize-none h-24 placeholder:text-text-tertiary"
                  />
                </div>

                {/* 선택 요약 */}
                {selectedDate && selectedTime && (
                  <div className="bg-expert-navy/5 rounded-2xl p-4 border border-expert-navy/10">
                    <h4 className="text-sm font-medium text-expert-navy mb-2">선택한 일정</h4>
                    <div className="text-lg font-bold text-expert-navy">
                      {selectedDate} {selectedTime}
                    </div>
                    <div className="text-sm text-text-secondary mt-1">
                      {selectedLocation === 'hospital' ? '병원 내 회의실' : selectedLocation === 'video' ? '화상 면접' : '외부 장소'}
                    </div>
                  </div>
                )}

                {/* 액션 버튼 */}
                <div className="space-y-3 pt-2 pb-4">
                  <button
                    onClick={confirmSchedule}
                    disabled={!selectedDate || !selectedTime}
                    className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                      selectedDate && selectedTime
                        ? 'bg-success text-white'
                        : 'bg-bg-tertiary text-text-tertiary cursor-not-allowed'
                    }`}
                  >
                    <Calendar className="w-5 h-5" />
                    면접 일정 확정하기
                  </button>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="w-full py-3 border border-border-light text-text-secondary rounded-xl font-medium"
                  >
                    취소
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 드랍 모달 */}
      <AnimatePresence>
        {showDropModal && dropCandidate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowDropModal(false)}
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
                  후보자를 거절하시겠어요?
                </h2>
                <p className="text-sm text-text-secondary text-center mb-4">
                  <strong className="text-text-primary">{dropCandidate.name}</strong>님을 채용 프로세스에서 제외합니다.
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
                    onClick={() => setShowDropModal(false)}
                    className="flex-1 py-3 border border-border-light text-text-primary rounded-xl font-medium"
                  >
                    취소
                  </button>
                  <button
                    onClick={confirmDrop}
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
                  <Link href="/employer/profile?showCompletion=true">
                    <button
                      onClick={() => handleResetLimit('profile')}
                      className="w-full p-4 bg-expert-navy/10 border border-expert-navy/20 rounded-xl flex items-center gap-4 hover:bg-expert-navy/20 transition-colors"
                    >
                      <div className="w-12 h-12 bg-expert-navy rounded-xl flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left flex-1">
                        <div className="font-semibold text-text-primary">프로필 완성도 올리기</div>
                        <div className="text-xs text-text-secondary">미완성 항목 입력하고 초기화!</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-expert-navy" />
                    </button>
                  </Link>

                  <button
                    onClick={() => handleResetLimit('referral')}
                    className="w-full p-4 bg-brand-mint/5 border border-brand-mint/10 rounded-xl flex items-center gap-4 hover:bg-brand-mint/10 transition-colors"
                  >
                    <div className="w-12 h-12 bg-brand-mint rounded-xl flex items-center justify-center">
                      <UserPlus className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-text-primary">구직자 소개하기</div>
                      <div className="text-xs text-text-secondary">주변 구직자를 소개해주세요!</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-brand-mint" />
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
                      <div className="text-xs text-text-secondary">주변 동료나 병원을 소개해주세요!</div>
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

        {/* 구직자 소개하기 CTA 모달 */}
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
                  <div className="w-16 h-16 bg-brand-mint/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="w-8 h-8 text-brand-mint" />
                  </div>
                  <h2 className="text-lg font-bold text-text-primary mb-1">구직자 소개하기</h2>
                  <p className="text-sm text-text-secondary">
                    주변에 이직을 고민하는 분을 소개해주세요!<br />
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
                      className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-mint/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-text-secondary block mb-2">연락처</label>
                    <input
                      type="tel"
                      value={referralPhone}
                      onChange={(e) => setReferralPhone(e.target.value)}
                      placeholder="예: 010-1234-5678"
                      className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-mint/50"
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
                    className="w-full py-3 bg-brand-mint text-white rounded-xl font-semibold"
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

        {/* 직원/병원 소개하기 CTA 모달 */}
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
                  <h2 className="text-lg font-bold text-text-primary mb-1">직원/병원 소개하기</h2>
                  <p className="text-sm text-text-secondary">
                    주변 동료나 병원을 소개해주세요!<br />
                    소개해주시면 거절 횟수가 초기화됩니다.
                  </p>
                </div>

                <div className="space-y-4 mb-5">
                  <div>
                    <label className="text-sm font-medium text-text-secondary block mb-2">소개할 분/병원 이름</label>
                    <input
                      type="text"
                      value={referralName}
                      onChange={(e) => setReferralName(e.target.value)}
                      placeholder="예: 청담스마일치과 / 김원장"
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
                        alert('이름과 연락처를 모두 입력해주세요.');
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

        {/* 병원 프로필 완성 CTA 모달 - 단계별 완성 가이드 */}
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
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 bg-white rounded-2xl max-w-md mx-auto overflow-hidden max-h-[80vh] overflow-y-auto"
            >
              <div className="p-5">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-expert-navy/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FileText className="w-8 h-8 text-expert-navy" />
                  </div>
                  <h2 className="text-lg font-bold text-text-primary mb-1">프로필 완성도 높이기</h2>
                  <p className="text-sm text-text-secondary">
                    아래 항목을 완성하면 거절 횟수가 초기화돼요
                  </p>
                </div>

                {/* 프로필 완성도 진행바 */}
                <div className="bg-expert-navy/5 rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">현재 프로필 완성도</span>
                    <span className="text-lg font-bold text-expert-navy">72%</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-expert-navy rounded-full" style={{ width: '72%' }} />
                  </div>
                  <p className="text-xs text-text-tertiary mt-2">100% 달성 시 거절 횟수가 초기화됩니다</p>
                </div>

                {/* 단계별 완성 가이드 */}
                <div className="space-y-2 mb-5">
                  <div className="text-sm font-medium text-text-primary mb-2">미완성 항목</div>

                  {/* 업무환경 - 미완성 */}
                  <Link href="/employer/profile?section=work-env" onClick={() => { setShowProfileCTA(false); completeReset(); }}>
                    <div className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-xl cursor-pointer hover:bg-warning/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                          <Briefcase className="w-4 h-4 text-warning" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text-primary">업무환경 입력</div>
                          <div className="text-xs text-text-tertiary">시설, 근무조건, 인력배치</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-warning font-medium">+15%</span>
                        <ChevronRight className="w-4 h-4 text-text-tertiary" />
                      </div>
                    </div>
                  </Link>

                  {/* 갤러리 - 미완성 */}
                  <Link href="/employer/profile?section=gallery" onClick={() => { setShowProfileCTA(false); completeReset(); }}>
                    <div className="flex items-center justify-between p-3 bg-info/5 border border-info/20 rounded-xl cursor-pointer hover:bg-info/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-info/10 rounded-full flex items-center justify-center">
                          <FileText className="w-4 h-4 text-info" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text-primary">병원 사진 등록</div>
                          <div className="text-xs text-text-tertiary">시설 사진 3장 이상</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-info font-medium">+8%</span>
                        <ChevronRight className="w-4 h-4 text-text-tertiary" />
                      </div>
                    </div>
                  </Link>

                  {/* 팀소개 - 미완성 */}
                  <Link href="/employer/profile?section=team" onClick={() => { setShowProfileCTA(false); completeReset(); }}>
                    <div className="flex items-center justify-between p-3 bg-brand-mint/5 border border-brand-mint/20 rounded-xl cursor-pointer hover:bg-brand-mint/10 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-mint/10 rounded-full flex items-center justify-center">
                          <Users className="w-4 h-4 text-brand-mint" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text-primary">팀 소개 추가</div>
                          <div className="text-xs text-text-tertiary">팀원 인터뷰, 분위기</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-brand-mint font-medium">+5%</span>
                        <ChevronRight className="w-4 h-4 text-text-tertiary" />
                      </div>
                    </div>
                  </Link>

                  <div className="text-sm font-medium text-text-primary mt-3 mb-2">완성된 항목</div>

                  {/* 기본정보 - 완성됨 */}
                  <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-xl opacity-70">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">기본 정보</div>
                        <div className="text-xs text-text-tertiary">병원명, 주소, 연락처</div>
                      </div>
                    </div>
                    <span className="text-xs text-success font-medium">완료</span>
                  </div>

                  {/* 병원소개 - 완성됨 */}
                  <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-xl opacity-70">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">병원 소개</div>
                        <div className="text-xs text-text-tertiary">핵심가치, 비전</div>
                      </div>
                    </div>
                    <span className="text-xs text-success font-medium">완료</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Link href="/employer/profile">
                    <button
                      onClick={() => { setShowProfileCTA(false); completeReset(); }}
                      className="w-full py-3 bg-expert-navy text-white rounded-xl font-semibold flex items-center justify-center gap-2"
                    >
                      <FileText className="w-4 h-4" />
                      전체 프로필 수정하기
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

export default function EmployerMatchingCenterPage() {
  return (
    <Suspense fallback={<MatchingCenterSkeleton />}>
      <MatchingCenterContent />
    </Suspense>
  );
}

function MatchingCenterSkeleton() {
  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-dashboard-title">매칭 센터</h1>
        <p className="text-sm text-text-secondary mt-1">후보자와의 채용 진행 현황을 관리하세요</p>
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
        {['전체', '신규', '제안완료', '관심표시', '협상중', '면접예정'].map((label, i) => (
          <div
            key={i}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium ${
              i === 0 ? 'bg-expert-navy text-white' : 'bg-white text-text-secondary border border-border-light'
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      {/* Stats Card */}
      <div className="bg-expert-navy/5 rounded-2xl p-4 mb-4 border border-expert-navy/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-text-secondary">이번 주 채용 활동</div>
            <div className="h-6 w-48 bg-gray-200 rounded mt-2 animate-pulse" />
          </div>
          <div className="w-12 h-12 bg-expert-navy/10 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-expert-navy/50" />
          </div>
        </div>
      </div>

      {/* Candidate Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-4 border border-border-light"
            style={{ opacity: 1 - i * 0.2 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-6 w-16 bg-brand-mint/20 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-expert-navy/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-expert-navy/30" />
                </div>
                <div>
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-100 rounded mt-1 animate-pulse" />
                </div>
              </div>
              <div className="text-right">
                <div className="h-7 w-12 bg-brand-mint/20 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-6 w-16 bg-gray-100 rounded animate-pulse" />
              ))}
            </div>
            <div className="flex gap-2 pt-3 border-t border-border-light">
              <div className="flex-1 h-10 bg-expert-navy/10 rounded-lg animate-pulse" />
              <div className="flex-1 h-10 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
