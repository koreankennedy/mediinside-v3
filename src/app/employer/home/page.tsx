'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Users,
  Bell,
  ChevronRight,
  Sparkles,
  TrendingUp,
  MessageCircle,
  Calendar,
  Star,
  Eye,
  Send,
  UserPlus,
  Briefcase,
  Target,
  ArrowRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  FileText,
  Edit2,
  X,
  ChevronDown,
  Video,
  Building2,
  Zap,
  Mail,
  BellRing,
  DollarSign,
  Award,
  XCircle,
} from 'lucide-react';
import {
  mockEmployerRecruitmentStatus,
  mockCandidates,
  mockEmployerActivity,
  mockJobPostings,
  mockEmployerProfile,
} from '@/lib/mock/data';

const DAILY_REJECT_LIMIT = 10;

// 채용 활동 현황 데이터 (6개 지표)
const recruitmentActivityStats = {
  profileViewed: {
    count: 45,
    label: '프로필 열람',
    color: 'text-expert-navy',
    details: [
      { id: 'pv-1', name: '김미진', position: '간호사', matchScore: 95, time: '1시간 전', viewDuration: '3분 13초' },
      { id: 'pv-2', name: '이은정', position: '간호사', matchScore: 92, time: '1시간 전', viewDuration: '2분 1초' },
      { id: 'pv-3', name: '박수진', position: '간호사', matchScore: 89, time: '1시간 전', viewDuration: '2분 54초' },
      { id: 'pv-4', name: '정혜원', position: '간호사', matchScore: 90, time: '1시간 전', viewDuration: '3분 24초' },
      { id: 'pv-5', name: '최지영', position: '간호사', matchScore: 88, time: '1시간 전', viewDuration: '1분 20초' },
      { id: 'pv-6', name: '강민경', position: '간호사', matchScore: 92, time: '2시간 전', viewDuration: '1분 27초' },
      { id: 'pv-7', name: '윤서연', position: '간호사', matchScore: 89, time: '2시간 전', viewDuration: '1분 31초' },
      { id: 'pv-8', name: '서지은', position: '간호사', matchScore: 87, time: '2시간 전', viewDuration: '1분 34초' },
      { id: 'pv-9', name: '홍수민', position: '간호사', matchScore: 85, time: '2시간 전', viewDuration: '2분 52초' },
      { id: 'pv-10', name: '장미라', position: '간호사', matchScore: 84, time: '2시간 전', viewDuration: '2분 57초' },
    ],
  },
  interviewProposed: {
    count: 12,
    label: '인터뷰 제안',
    color: 'text-info',
    details: [
      { id: 'ip-1', name: '김미진', position: '간호사', type: 'AI 채팅', status: '수락', statusColor: 'text-success', time: '1일 전' },
      { id: 'ip-2', name: '이은정', position: '간호사', type: '화상면접', status: '대기중', statusColor: 'text-warning', time: '1일 전' },
      { id: 'ip-3', name: '박수진', position: '간호사', type: '화상면접', status: '거절', statusColor: 'text-error', time: '1일 전' },
      { id: 'ip-4', name: '정혜원', position: '간호사', type: 'AI 채팅', status: '수락', statusColor: 'text-success', time: '1일 전' },
      { id: 'ip-5', name: '최지영', position: '간호사', type: '화상면접', status: '대기중', statusColor: 'text-warning', time: '2일 전' },
      { id: 'ip-6', name: '강민경', position: '간호사', type: '화상면접', status: '거절', statusColor: 'text-error', time: '2일 전' },
      { id: 'ip-7', name: '윤서연', position: '간호사', type: 'AI 채팅', status: '수락', statusColor: 'text-success', time: '2일 전' },
      { id: 'ip-8', name: '서지은', position: '간호사', type: '화상면접', status: '대기중', statusColor: 'text-warning', time: '2일 전' },
    ],
  },
  aiInterviewCompleted: {
    count: 8,
    label: 'AI인터뷰 수행',
    color: 'text-brand-mint',
    details: [
      { id: 'aic-1', name: '정민지', position: '간호사', score: 89, status: '완료', time: '어제' },
      { id: 'aic-2', name: '강은비', position: '간호조무사', score: 85, status: '완료', time: '2일 전' },
      { id: 'aic-3', name: '임수정', position: '간호사', score: 92, status: '완료', time: '2일 전' },
      { id: 'aic-4', name: '한지원', position: '간호사', score: 78, status: '완료', time: '3일 전' },
      { id: 'aic-5', name: '박예진', position: '간호사', score: 88, status: '완료', time: '3일 전' },
      { id: 'aic-6', name: '조민서', position: '간호조무사', score: 82, status: '진행중', time: '오늘' },
      { id: 'aic-7', name: '김나영', position: '간호사', score: 91, status: '완료', time: '4일 전' },
      { id: 'aic-8', name: '이하나', position: '간호사', score: 86, status: '완료', time: '5일 전' },
    ],
  },
  faceInterviewCompleted: {
    count: 3,
    label: '대면면접 진행',
    color: 'text-brand-mint',
    details: [
      { id: 'fic-1', name: '최수민', position: '간호사', date: '내일 오후 2시', location: '병원 면접실', time: '예정' },
      { id: 'fic-2', name: '김서현', position: '간호사', date: '어제 오전 10시', location: '병원 면접실', time: '완료' },
      { id: 'fic-3', name: '박수진', position: '간호사', date: '3일 전', location: '병원 면접실', time: '완료' },
    ],
  },
  offerSent: {
    count: 2,
    label: '오퍼 발송',
    color: 'text-warning',
    details: [
      { id: 'os-1', name: '김서현', position: '간호사', salary: '4,200만원', status: '협상중', time: '1일 전' },
      { id: 'os-2', name: '이은정', position: '간호사', salary: '4,000만원', status: '응답대기', time: '2일 전' },
    ],
  },
  hired: {
    count: 1,
    label: '합격자',
    color: 'text-success',
    details: [
      { id: 'h-1', name: '박수진', position: '간호사', salary: '4,100만원', startDate: '2025.02.01', time: '확정' },
    ],
  },
};

// 퍼널 단계별 후보자 데이터 (순서: 협상 중 > 대면면접 > AI면접 > 신규)
const funnelCandidates = {
  negotiating: [
    { id: 'neg-1', name: '김서현', position: '간호사', experience: '7년', matchScore: 95, issue: '급여 조정 요청', lastMessage: '연봉 4,200만원 이상 희망합니다.', proposedSalary: '4,000만원', needsAction: true },
  ],
  faceInterview: [
    { id: 'face-1', name: '최수민', position: '간호사', experience: '4년', matchScore: 90, date: '내일 오후 2시', location: '병원 면접실', aiScore: 92, hasReminder: true },
  ],
  aiInterview: [
    { id: 'ai-1', name: '정민지', position: '간호사', experience: '3년', matchScore: 88, aiScore: 89, completedAt: '어제', status: '완료' },
    { id: 'ai-2', name: '강은비', position: '간호조무사', experience: '2년', matchScore: 85, status: '진행중', startedAt: '오늘 오전' },
  ],
  new: [
    { id: 'new-1', name: '김하은', position: '간호사', experience: '3년', matchScore: 94, addedTime: '2시간 전', urgent: true, aiInterviewReady: true },
    { id: 'new-2', name: '이지민', position: '간호사', experience: '5년', matchScore: 91, addedTime: '5시간 전', urgent: false, aiInterviewReady: true },
    { id: 'new-3', name: '박소연', position: '간호조무사', experience: '2년', matchScore: 88, addedTime: '1일 전', urgent: false, aiInterviewReady: false },
  ],
};

// 진행 중인 채용 상세
const jobPostingsDetail = [
  {
    id: 1,
    title: '피부과 간호사',
    salaryRange: '380~450만',
    workType: '정규직',
    views: 245,
    applicants: 12,
    matches: 8,
    status: 'active',
    daysLeft: 14,
    suggestions: ['급여 범위를 +10% 높이면 지원율 25% 증가 예상', '근무시간 조건 명시 시 관심도 상승'],
  },
  {
    id: 2,
    title: '성형외과 간호사',
    salaryRange: '400~500만',
    workType: '정규직',
    views: 156,
    applicants: 8,
    matches: 5,
    status: 'active',
    daysLeft: 7,
    suggestions: ['마감 임박 - 후보자 제안 추천', '유사 포지션 평균 대비 경쟁력 있음'],
  },
];

// 채용상품효과 데이터 (개별 CTA 포함)
const hiringProductEffects = [
  { id: 'share', name: '매출 셰어', emoji: '💰', rate: 78, color: '#FF2D55' },
  { id: 'bonus', name: '근속 보너스', emoji: '🎁', rate: 65, color: '#AF52DE' },
  { id: 'allowance', name: '수당 보장', emoji: '💵', rate: 58, color: '#FF9500' },
];

// 후보자 상세 데이터 매핑 (상세보기용)
const candidateDetailMap: Record<string, { name: string; position: string; experience: string; matchScore: number }> = {
  'pv-1': { name: '김미진', position: '간호사', experience: '4년', matchScore: 95 },
  'pv-2': { name: '이은정', position: '간호사', experience: '3년', matchScore: 92 },
  'pv-3': { name: '박수진', position: '간호사', experience: '5년', matchScore: 89 },
  'pv-4': { name: '정혜원', position: '간호사', experience: '2년', matchScore: 90 },
  'pv-5': { name: '최지영', position: '간호사', experience: '6년', matchScore: 88 },
  'pv-6': { name: '강민경', position: '간호사', experience: '4년', matchScore: 92 },
  'pv-7': { name: '윤서연', position: '간호사', experience: '3년', matchScore: 89 },
  'pv-8': { name: '서지은', position: '간호사', experience: '5년', matchScore: 87 },
  'pv-9': { name: '홍수민', position: '간호조무사', experience: '2년', matchScore: 85 },
  'pv-10': { name: '장미라', position: '간호조무사', experience: '3년', matchScore: 84 },
  'ip-1': { name: '김미진', position: '간호사', experience: '4년', matchScore: 95 },
  'ip-2': { name: '이은정', position: '간호사', experience: '3년', matchScore: 92 },
  'ip-3': { name: '박수진', position: '간호사', experience: '5년', matchScore: 89 },
  'ip-4': { name: '정혜원', position: '간호사', experience: '2년', matchScore: 90 },
  'ip-5': { name: '최지영', position: '간호사', experience: '6년', matchScore: 88 },
  'ip-6': { name: '강민경', position: '간호사', experience: '4년', matchScore: 92 },
  'ip-7': { name: '윤서연', position: '간호사', experience: '3년', matchScore: 89 },
  'ip-8': { name: '서지은', position: '간호사', experience: '5년', matchScore: 87 },
  'neg-1': { name: '김서현', position: '간호사', experience: '7년', matchScore: 95 },
  'face-1': { name: '최수민', position: '간호사', experience: '4년', matchScore: 90 },
  'ai-1': { name: '정민지', position: '간호사', experience: '3년', matchScore: 88 },
  'ai-2': { name: '강은비', position: '간호조무사', experience: '2년', matchScore: 85 },
  'new-1': { name: '김하은', position: '간호사', experience: '3년', matchScore: 94 },
  'new-2': { name: '이지민', position: '간호사', experience: '5년', matchScore: 91 },
  'new-3': { name: '박소연', position: '간호조무사', experience: '2년', matchScore: 88 },
};

export default function EmployerHomePage() {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [expandedFunnel, setExpandedFunnel] = useState<string | null>(null);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const status = mockEmployerRecruitmentStatus;
  const activity = mockEmployerActivity;
  const topCandidates = mockCandidates.slice(0, 3);

  // 모달 상태
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerTarget, setOfferTarget] = useState<{ id: string; name: string; position: string; experience: string; matchScore: number; proposedSalary?: string; lastMessage?: string } | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactTarget, setContactTarget] = useState<{ name: string } | null>(null);
  const [showActivityDetailModal, setShowActivityDetailModal] = useState(false);
  const [activityDetailType, setActivityDetailType] = useState<'profileViewed' | 'interviewProposed' | 'aiInterview' | 'faceInterview' | 'offerSent' | 'hired' | null>(null);

  // 거절 모달 상태
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<{ id: string; name: string } | null>(null);
  const [dailyRejectCount, setDailyRejectCount] = useState(0);
  const remainingRejects = DAILY_REJECT_LIMIT - dailyRejectCount;

  // 거절된 후보자 ID 목록 (리스트에서 제거용)
  const [rejectedCandidates, setRejectedCandidates] = useState<string[]>([]);

  // 일정조율 모달 상태
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState<{ name: string; currentDate: string } | null>(null);

  // AI 인터뷰 요청 모달
  const [showAIInterviewModal, setShowAIInterviewModal] = useState(false);
  const [aiInterviewTarget, setAIInterviewTarget] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivityIndex((prev) =>
        (prev + 1) % activity.recentActivity.length
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [activity.recentActivity.length]);

  const toggleFunnel = (key: string) => {
    setExpandedFunnel(expandedFunnel === key ? null : key);
  };

  // 오퍼 보내기 모달 열기
  const openOfferModal = (candidate: { id: string; name: string; position: string; experience: string; matchScore: number; proposedSalary?: string; lastMessage?: string }) => {
    setOfferTarget(candidate);
    setShowOfferModal(true);
  };

  // 연락하기 모달 열기
  const openContactModal = (name: string) => {
    setContactTarget({ name });
    setShowContactModal(true);
  };

  // 활동 상세 모달 열기
  const openActivityDetail = (type: 'profileViewed' | 'interviewProposed' | 'aiInterview' | 'faceInterview' | 'offerSent' | 'hired') => {
    setActivityDetailType(type);
    setShowActivityDetailModal(true);
  };

  // 거절하기 모달 열기
  const openRejectModal = (id: string, name: string) => {
    if (dailyRejectCount >= DAILY_REJECT_LIMIT) {
      alert('오늘의 거절 한도(10회)에 도달했습니다. 내일 다시 시도해주세요.');
      return;
    }
    setRejectTarget({ id, name });
    setShowRejectModal(true);
  };

  // 거절 확정
  const confirmReject = () => {
    if (rejectTarget) {
      setDailyRejectCount(prev => prev + 1);
      setRejectedCandidates(prev => [...prev, rejectTarget.id]);
    }
    setShowRejectModal(false);
    setRejectTarget(null);
  };

  // 일정조율 모달 열기
  const openScheduleModal = (name: string, currentDate: string) => {
    setScheduleTarget({ name, currentDate });
    setShowScheduleModal(true);
  };

  // AI인터뷰 요청 모달 열기
  const openAIInterviewModal = (id: string, name: string) => {
    setAIInterviewTarget({ id, name });
    setShowAIInterviewModal(true);
  };

  // 오퍼 조건 수정 상태
  const [isEditingOffer, setIsEditingOffer] = useState(false);
  const [editedSalary, setEditedSalary] = useState('4,000만원');
  const [editedWorkType, setEditedWorkType] = useState('정규직 (풀타임)');
  const [editedWorkHours, setEditedWorkHours] = useState('09:00 ~ 18:00');

  // 고정 CTA 버튼 스타일
  const ctaBtnPrimary = "flex-1 py-2.5 text-xs bg-expert-navy text-white rounded-lg flex items-center justify-center gap-1 min-h-[40px]";
  const ctaBtnSecondary = "flex-1 py-2.5 text-xs bg-info/10 text-info rounded-lg flex items-center justify-center gap-1 min-h-[40px]";
  const ctaBtnDanger = "flex-1 py-2.5 text-xs bg-error/10 text-error rounded-lg flex items-center justify-center gap-1 min-h-[40px]";
  const ctaBtnSuccess = "flex-1 py-2.5 text-xs bg-success/10 text-success rounded-lg flex items-center justify-center gap-1 min-h-[40px]";

  // 거절된 후보자 필터링된 퍼널 데이터
  const filteredFunnel = {
    negotiating: funnelCandidates.negotiating.filter(c => !rejectedCandidates.includes(c.id)),
    faceInterview: funnelCandidates.faceInterview.filter(c => !rejectedCandidates.includes(c.id)),
    aiInterview: funnelCandidates.aiInterview.filter(c => !rejectedCandidates.includes(c.id)),
    new: funnelCandidates.new.filter(c => !rejectedCandidates.includes(c.id)),
  };

  return (
    <div className="px-4 py-6 pb-24">
      {/* 인사말 */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-expert-navy">
          안녕하세요, {mockEmployerProfile.hospitalName}님
        </h1>
        <p className="text-text-secondary text-sm mt-1">
          오늘도 좋은 인재를 찾아보세요!
        </p>
      </div>

      {/* 실시간 알림 피드 */}
      <div className="bg-expert-navy rounded-xl px-4 py-3 text-white text-sm flex items-center gap-2 mb-6">
        <Bell className="w-4 h-4 text-match-gold animate-pulse" />
        <AnimatePresence mode="wait">
          <motion.span
            key={currentActivityIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1"
          >
            {activity.recentActivity[currentActivityIndex].message}
            <span className="text-white/60 ml-2">
              {activity.recentActivity[currentActivityIndex].time}
            </span>
          </motion.span>
        </AnimatePresence>
      </div>

      {/* 긴급 확인 필요 알림 */}
      {(filteredFunnel.new.some(c => c.urgent) || filteredFunnel.negotiating.some(c => c.needsAction)) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error/10 border border-error/20 rounded-xl p-4 mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-error" />
            <span className="font-medium text-error">긴급 확인 필요</span>
          </div>
          <div className="space-y-2">
            {/* AI면접 완료 후보자 - 오퍼 단계 */}
            {filteredFunnel.aiInterview.filter(c => c.status === '완료').map(c => (
              <div key={c.id} className="flex items-center justify-between">
                <span className="text-sm text-text-primary">
                  <strong>{c.name}</strong>님 AI면접 완료 (점수 {c.aiScore}점) - 오퍼 발송 필요
                </span>
                <button
                  onClick={() => openOfferModal({ id: c.id, name: c.name, position: c.position, experience: c.experience, matchScore: c.matchScore, proposedSalary: '4,000만원' })}
                  className="text-xs bg-error text-white px-3 py-1 rounded-lg"
                >
                  지금 확인
                </button>
              </div>
            ))}
            {/* 협상 중 회신 필요 */}
            {filteredFunnel.negotiating.filter(c => c.needsAction).map(c => (
              <div key={c.id} className="flex items-center justify-between">
                <span className="text-sm text-text-primary">
                  <strong>{c.name}</strong>님 협상 회신 필요 - {c.issue}
                </span>
                <button
                  onClick={() => openOfferModal({ id: c.id, name: c.name, position: c.position, experience: c.experience, matchScore: c.matchScore, proposedSalary: c.proposedSalary, lastMessage: c.lastMessage })}
                  className="text-xs bg-warning text-white px-3 py-1 rounded-lg"
                >
                  오퍼 수정
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 채용 활동 현황 - 통합 섹션 */}
      <section className="mb-6">
        <h2 className="text-section-title mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-expert-navy" />
          채용 활동 현황
        </h2>

        {/* 6개 지표 */}
        <div className="bg-white rounded-2xl border border-border-light p-4 mb-4">
          <div className="grid grid-cols-3 gap-4">
            <button
              onClick={() => openActivityDetail('profileViewed')}
              className="text-center hover:bg-bg-secondary rounded-xl p-2 transition-colors"
            >
              <div className="text-2xl font-bold text-expert-navy">{recruitmentActivityStats.profileViewed.count}</div>
              <div className="text-xs text-text-tertiary">프로필 열람</div>
            </button>
            <button
              onClick={() => openActivityDetail('interviewProposed')}
              className="text-center hover:bg-bg-secondary rounded-xl p-2 transition-colors"
            >
              <div className="text-2xl font-bold text-info">{recruitmentActivityStats.interviewProposed.count}</div>
              <div className="text-xs text-text-tertiary">인터뷰 제안</div>
            </button>
            <button
              onClick={() => openActivityDetail('aiInterview')}
              className="text-center hover:bg-bg-secondary rounded-xl p-2 transition-colors"
            >
              <div className="text-2xl font-bold text-brand-mint">{recruitmentActivityStats.aiInterviewCompleted.count}</div>
              <div className="text-xs text-text-tertiary">AI인터뷰 수행</div>
            </button>
            <button
              onClick={() => openActivityDetail('faceInterview')}
              className="text-center hover:bg-bg-secondary rounded-xl p-2 transition-colors"
            >
              <div className="text-2xl font-bold text-brand-mint">{recruitmentActivityStats.faceInterviewCompleted.count}</div>
              <div className="text-xs text-text-tertiary">대면면접 진행</div>
            </button>
            <button
              onClick={() => openActivityDetail('offerSent')}
              className="text-center hover:bg-bg-secondary rounded-xl p-2 transition-colors"
            >
              <div className="text-2xl font-bold text-warning">{recruitmentActivityStats.offerSent.count}</div>
              <div className="text-xs text-text-tertiary">오퍼 발송</div>
            </button>
            <button
              onClick={() => openActivityDetail('hired')}
              className="text-center hover:bg-bg-secondary rounded-xl p-2 transition-colors"
            >
              <div className="text-2xl font-bold text-success">{recruitmentActivityStats.hired.count}</div>
              <div className="text-xs text-text-tertiary">합격자</div>
            </button>
          </div>
        </div>

        {/* 퍼널 단계별 카드 - 순서: 협상 중 > 대면면접 > AI면접 > 신규 */}
        <div className="space-y-3">
          {/* 협상 중 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-border-light overflow-hidden"
          >
            <button
              onClick={() => toggleFunnel('negotiating')}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-warning" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-text-primary">협상 중</div>
                  <div className="text-xs text-text-secondary">오퍼 조율 진행</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-warning">{filteredFunnel.negotiating.length}</span>
                <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform ${expandedFunnel === 'negotiating' ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <AnimatePresence>
              {expandedFunnel === 'negotiating' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-border-light pt-3">
                    {filteredFunnel.negotiating.map(candidate => (
                      <div key={candidate.id} className="p-3 bg-bg-secondary rounded-xl">
                        <Link href={`/employer/candidates/${candidate.id}`}>
                          <div className="flex items-center justify-between mb-2 hover:bg-bg-tertiary rounded-lg p-1 -m-1 transition-colors">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-text-primary text-sm">{candidate.name}</span>
                              <span className="text-sm font-bold text-brand-mint">{candidate.matchScore}%</span>
                            </div>
                            {candidate.needsAction && (
                              <span className="text-xs bg-warning text-white px-2 py-0.5 rounded">회신 필요</span>
                            )}
                          </div>
                        </Link>
                        <div className="text-xs text-text-secondary mb-2">{candidate.issue}</div>
                        <div className="text-xs text-text-tertiary bg-white p-2 rounded-lg mb-3">
                          &ldquo;{candidate.lastMessage}&rdquo;
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openOfferModal({ id: candidate.id, name: candidate.name, position: candidate.position, experience: candidate.experience, matchScore: candidate.matchScore, proposedSalary: candidate.proposedSalary, lastMessage: candidate.lastMessage })}
                            className={ctaBtnPrimary}
                          >
                            <Edit2 className="w-3 h-3" />
                            오퍼 수정하기
                          </button>
                          <button
                            onClick={() => openRejectModal(candidate.id, candidate.name)}
                            className={ctaBtnDanger}
                          >
                            <XCircle className="w-3 h-3" />
                            거절하기
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 대면 면접 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-border-light overflow-hidden"
          >
            <button
              onClick={() => toggleFunnel('faceInterview')}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-success" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-text-primary">대면 면접</div>
                  <div className="text-xs text-success">내일 1건</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-success">{filteredFunnel.faceInterview.length}</span>
                <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform ${expandedFunnel === 'faceInterview' ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <AnimatePresence>
              {expandedFunnel === 'faceInterview' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-border-light pt-3">
                    {filteredFunnel.faceInterview.map(candidate => (
                      <div key={candidate.id} className="p-3 bg-success/5 border border-success/20 rounded-xl">
                        <Link href={`/employer/candidates/${candidate.id}`}>
                          <div className="flex items-center justify-between mb-2 hover:bg-success/10 rounded-lg p-1 -m-1 transition-colors">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-text-primary text-sm">{candidate.name}</span>
                              <span className="text-sm font-bold text-brand-mint">{candidate.matchScore}%</span>
                              <span className="text-xs bg-brand-mint/10 text-brand-mint px-2 py-0.5 rounded">AI {candidate.aiScore}점</span>
                            </div>
                          </div>
                        </Link>
                        <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {candidate.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {candidate.location}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/employer/candidates/${candidate.id}?tab=ai-report`} className="flex-1">
                            <button className={ctaBtnPrimary + " w-full"}>
                              <FileText className="w-3 h-3" />
                              AI리포트 보기
                            </button>
                          </Link>
                          <button
                            onClick={() => openScheduleModal(candidate.name, candidate.date)}
                            className={ctaBtnSecondary}
                          >
                            <Calendar className="w-3 h-3" />
                            일정 조율
                          </button>
                          <button
                            onClick={() => openRejectModal(candidate.id, candidate.name)}
                            className={ctaBtnDanger}
                          >
                            <XCircle className="w-3 h-3" />
                            거절
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* AI 인터뷰 의뢰 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-border-light overflow-hidden"
          >
            <button
              onClick={() => toggleFunnel('aiInterview')}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
                  <Video className="w-5 h-5 text-info" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-text-primary">AI인터뷰 의뢰</div>
                  <div className="text-xs text-text-secondary">진행 대기중</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-info">{filteredFunnel.aiInterview.length}</span>
                <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform ${expandedFunnel === 'aiInterview' ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <AnimatePresence>
              {expandedFunnel === 'aiInterview' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-border-light pt-3">
                    {filteredFunnel.aiInterview.map(candidate => (
                      <div key={candidate.id} className="p-3 bg-bg-secondary rounded-xl">
                        <Link href={`/employer/candidates/${candidate.id}`}>
                          <div className="flex items-center justify-between mb-2 hover:bg-bg-tertiary rounded-lg p-1 -m-1 transition-colors">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-text-primary text-sm">{candidate.name}</span>
                              <span className="text-sm font-bold text-brand-mint">{candidate.matchScore}%</span>
                              {candidate.status === '완료' && (
                                <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded">AI {candidate.aiScore}점</span>
                              )}
                              {candidate.status === '진행중' && (
                                <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded">진행중</span>
                              )}
                            </div>
                          </div>
                        </Link>
                        <div className="text-xs text-text-tertiary mb-3">
                          {candidate.status === '완료' ? `${candidate.completedAt} 완료` : `${candidate.startedAt} 시작`}
                        </div>
                        <div className="flex gap-2">
                          {candidate.status === '완료' ? (
                            <>
                              <Link href={`/employer/candidates/${candidate.id}?tab=ai-report`} className="flex-1">
                                <button className={ctaBtnPrimary + " w-full"}>
                                  <FileText className="w-3 h-3" />
                                  AI리포트
                                </button>
                              </Link>
                              <button
                                onClick={() => openScheduleModal(candidate.name, '미정')}
                                className={ctaBtnSuccess}
                              >
                                <Calendar className="w-3 h-3" />
                                대면일정 잡기
                              </button>
                              <button
                                onClick={() => openRejectModal(candidate.id, candidate.name)}
                                className={ctaBtnDanger}
                              >
                                <XCircle className="w-3 h-3" />
                                거절
                              </button>
                            </>
                          ) : (
                            <div className="flex-1 py-2.5 text-xs text-center text-warning bg-warning/10 rounded-lg flex items-center justify-center gap-1 min-h-[40px]">
                              <Clock className="w-3 h-3" />
                              면접 진행 중...
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 신규 후보자 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-border-light overflow-hidden"
          >
            <button
              onClick={() => toggleFunnel('new')}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-mint/10 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-brand-mint" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-text-primary">신규 후보자</div>
                  <div className="text-xs text-text-secondary">이번 주 신규</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-brand-mint">{filteredFunnel.new.length}</span>
                <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform ${expandedFunnel === 'new' ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <AnimatePresence>
              {expandedFunnel === 'new' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-border-light pt-3">
                    {filteredFunnel.new.map(candidate => (
                      <div key={candidate.id} className="p-3 bg-bg-secondary rounded-xl">
                        <Link href={`/employer/candidates/${candidate.id}`}>
                          <div className="flex items-center justify-between hover:bg-bg-tertiary transition-colors rounded-lg p-2 -m-2 mb-0">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-expert-navy/10 rounded-full flex items-center justify-center">
                                <Users className="w-4 h-4 text-expert-navy" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-text-primary text-sm">{candidate.name}</span>
                                  {candidate.urgent && <span className="text-xs bg-error text-white px-1.5 py-0.5 rounded">HOT</span>}
                                </div>
                                <div className="text-xs text-text-secondary">{candidate.position} · {candidate.experience}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-bold text-brand-mint">{candidate.matchScore}%</span>
                              <ChevronRight className="w-4 h-4 text-text-tertiary" />
                            </div>
                          </div>
                        </Link>
                        <div className="flex gap-2 mt-3 pt-3 border-t border-border-light">
                          <button
                            onClick={() => openAIInterviewModal(candidate.id, candidate.name)}
                            className={ctaBtnPrimary}
                          >
                            <Video className="w-3 h-3" />
                            AI인터뷰 요청
                          </button>
                          <button
                            onClick={() => openRejectModal(candidate.id, candidate.name)}
                            className={ctaBtnDanger}
                          >
                            <XCircle className="w-3 h-3" />
                            거절하기
                          </button>
                        </div>
                      </div>
                    ))}
                    <Link href="/employer/matching-center?tab=new-matching">
                      <button className="w-full py-2 text-sm text-expert-navy font-medium flex items-center justify-center gap-1">
                        전체 후보자 관리하기 <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* 넛지 */}
        <div className="nudge-box mt-3">
          <Sparkles className="w-4 h-4 text-brand-mint inline mr-2" />
          현재 <strong>{status.interestedCandidates}명</strong>의 후보자가 우리 병원에 관심을 보이고 있어요!
        </div>
      </section>

      {/* 보상 경쟁력 지표 */}
      <section className="mb-6">
        <h2 className="text-section-title mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-expert-navy" />
          보상 경쟁력
        </h2>
        <div className="bg-white rounded-2xl border border-border-light p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-text-secondary">업무강도 대비 급여 경쟁력</div>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-brand-mint">상위 25%</span>
                <span className="text-sm text-success flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +5%
                </span>
              </div>
            </div>
            <div className="w-16 h-16 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#E5E7EB"
                  strokeWidth="6"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke="#00C48C"
                  strokeWidth="6"
                  strokeDasharray={`${75 * 1.76} 176`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-brand-mint">75</span>
              </div>
            </div>
          </div>

          {/* 상세 지표 */}
          <div className="grid grid-cols-3 gap-3 py-3 border-t border-border-light">
            <div className="text-center">
              <div className="text-lg font-bold text-text-primary">Middle</div>
              <div className="text-xs text-text-tertiary">업무강도</div>
            </div>
            <div className="text-center border-x border-border-light">
              <div className="text-lg font-bold text-text-primary">420만</div>
              <div className="text-xs text-text-tertiary">평균 급여</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-success">+30만</div>
              <div className="text-xs text-text-tertiary">시장 대비</div>
            </div>
          </div>

          {/* 넛지 - 채용상품 설정으로 이동 */}
          <div className="bg-brand-mint/5 rounded-xl p-3 mt-3 border border-brand-mint/10">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-brand-mint mt-0.5" />
              <div className="text-sm text-text-primary">
                <strong>채용상품 추가</strong>로 수락률을 더 높여보세요!
                <Link href="/employer/matching-center?tab=product-settings" className="text-brand-mint ml-1">
                  설정하기 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 채용상품 효과 - 개별 CTA 포함 */}
      <section className="mb-6">
        <h2 className="text-section-title mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-expert-navy" />
          채용상품 효과
        </h2>
        <div className="bg-white rounded-2xl border border-border-light p-4">
          <div className="space-y-4">
            {hiringProductEffects.map((product) => (
              <div key={product.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">{product.emoji} {product.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-brand-mint">수락률 {product.rate}%</span>
                    <Link href={`/employer/matching-center?tab=product-settings&product=${product.id}`}>
                      <button className="text-xs text-white px-2 py-1 rounded-lg" style={{ backgroundColor: product.color }}>
                        설정
                      </button>
                    </Link>
                  </div>
                </div>
                <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${product.rate}%`, backgroundColor: product.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* 통계 요약 */}
          <div className="bg-success/5 rounded-xl p-3 mt-4 border border-success/10">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <div className="text-sm text-text-primary">
                채용상품 적용 시 <strong className="text-success">평균 수락률 2.3배</strong> 증가
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 진행 중인 채용 */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-section-title flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-expert-navy" />
            진행 중인 채용
          </h2>
          <Link href="/employer/ai-interview/job-posting" className="text-sm text-expert-navy flex items-center">
            새 공고 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {jobPostingsDetail.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-border-light overflow-hidden"
            >
              <button
                onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
                className="w-full p-4 text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-text-primary">{job.title}</div>
                    <div className="text-sm text-text-secondary">
                      {job.salaryRange} · {job.workType}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                      D-{job.daysLeft}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-text-tertiary transition-transform ${expandedJob === job.id ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-text-tertiary">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    조회 {job.views}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    지원 {job.applicants}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-match-gold" />
                    매칭 {job.matches}
                  </div>
                </div>
              </button>

              <AnimatePresence>
                {expandedJob === job.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 space-y-3 border-t border-border-light pt-3">
                      {/* AI 제안 */}
                      <div className="bg-brand-mint/5 border border-brand-mint/20 rounded-xl p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-brand-mint" />
                          <span className="text-sm font-medium text-brand-mint">AI 추천</span>
                        </div>
                        <ul className="space-y-1">
                          {job.suggestions.map((suggestion, i) => (
                            <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                              <Zap className="w-3 h-3 text-brand-mint flex-shrink-0 mt-0.5" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* 액션 버튼 - UI 개선 */}
                      <div className="flex gap-2">
                        <Link href={`/employer/jobs/${job.id}/edit`} className="flex-1">
                          <button className={ctaBtnPrimary + " w-full py-3"}>
                            <Edit2 className="w-4 h-4" />
                            공고 수정
                          </button>
                        </Link>
                        <Link href="/employer/ai-interview/pipeline" className="flex-1">
                          <button className="w-full py-3 text-sm border border-expert-navy text-expert-navy rounded-xl flex items-center justify-center gap-1 min-h-[44px]">
                            <Users className="w-4 h-4" />
                            지원자 관리
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 추천 후보자 */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-section-title flex items-center gap-2">
            <Star className="w-5 h-5 text-match-gold" />
            추천 후보자
          </h2>
          <Link href="/employer/matching-center?tab=new-matching" className="text-sm text-expert-navy flex items-center">
            전체보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {topCandidates.slice(0, 2).map((candidate, index) => (
            <Link key={candidate.id} href={`/employer/candidates/${candidate.id}`}>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white rounded-2xl p-4 border-2 hover:shadow-card transition-all ${
                  index === 0 ? 'border-match-gold' : 'border-border-light'
                }`}
              >
                {index === 0 && (
                  <div className="badge-active mb-2">BEST MATCH</div>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-expert-navy/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-expert-navy" />
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary">
                        {candidate.name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {candidate.licenseType} · {candidate.experience}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-brand-mint">
                      {candidate.matchScore}%
                    </div>
                    <div className="text-xs text-text-tertiary">매칭</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {candidate.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="text-xs bg-bg-secondary text-text-secondary px-2 py-0.5 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        {/* 더 많은 후보자 보기 - 신규 매칭 리스트로 랜딩 */}
        <Link href="/employer/matching-center?tab=new-matching">
          <button className="btn-primary w-full mt-4">
            <Users className="w-5 h-5 mr-2" />
            더 많은 후보자 보기
          </button>
        </Link>
      </section>

      {/* 병원 프로필 완성도 */}
      <section>
        <div className="bg-white rounded-2xl p-4 border border-border-light">
          <div className="flex items-center justify-between mb-3">
            <span className="text-card-title">병원 프로필 완성도</span>
            <span className="text-lg font-bold text-expert-navy">
              {mockEmployerProfile.profileCompleteness}%
            </span>
          </div>
          <div className="progress-bar mb-3">
            <div
              className="progress-fill bg-expert-navy"
              style={{ width: `${mockEmployerProfile.profileCompleteness}%` }}
            />
          </div>
          <Link href="/employer/profile?showCompletion=true">
            <div className="text-sm text-expert-navy flex items-center">
              <span>프로필 100% 완성하고 더 많은 후보자 만나기</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>
      </section>

      {/* 오퍼 발송 모달 */}
      <AnimatePresence>
        {showOfferModal && offerTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOfferModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-5 z-50 max-w-md mx-auto max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary">오퍼 조건 확인</h3>
                <button onClick={() => setShowOfferModal(false)}>
                  <X className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              <div className="space-y-4">
                {/* 후보자 정보 */}
                <div className="bg-bg-secondary rounded-xl p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-expert-navy/10 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-expert-navy" />
                    </div>
                    <div>
                      <div className="font-semibold text-text-primary">{offerTarget.name}</div>
                      <div className="text-sm text-text-secondary">{offerTarget.position} · {offerTarget.experience}</div>
                    </div>
                    <div className="ml-auto text-right">
                      <div className="text-xl font-bold text-brand-mint">{offerTarget.matchScore}%</div>
                      <div className="text-xs text-text-tertiary">매칭</div>
                    </div>
                  </div>
                </div>

                {/* 오퍼 조건 - 수정 모드와 뷰 모드 */}
                {!isEditingOffer ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                      <span className="text-sm text-text-secondary">제안 연봉</span>
                      <span className="font-medium text-text-primary">{editedSalary}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                      <span className="text-sm text-text-secondary">근무 형태</span>
                      <span className="font-medium text-text-primary">{editedWorkType}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                      <span className="text-sm text-text-secondary">근무 시간</span>
                      <span className="font-medium text-text-primary">{editedWorkHours}</span>
                    </div>
                    <div className="p-3 bg-bg-secondary rounded-xl">
                      <span className="text-sm text-text-secondary block mb-2">채용상품</span>
                      <div className="flex gap-2 flex-wrap">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-[#FF2D55]">💰 매출 셰어 1%</span>
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-[#AF52DE]">🎁 근속 보너스</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-3 bg-bg-secondary rounded-xl">
                      <label className="text-sm text-text-secondary block mb-2">제안 연봉</label>
                      <select
                        value={editedSalary}
                        onChange={(e) => setEditedSalary(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-border-light text-sm"
                      >
                        <option value="3,600만원">3,600만원</option>
                        <option value="3,800만원">3,800만원</option>
                        <option value="4,000만원">4,000만원</option>
                        <option value="4,200만원">4,200만원</option>
                        <option value="4,400만원">4,400만원</option>
                        <option value="4,600만원">4,600만원</option>
                        <option value="4,800만원">4,800만원</option>
                        <option value="5,000만원">5,000만원</option>
                      </select>
                    </div>
                    <div className="p-3 bg-bg-secondary rounded-xl">
                      <label className="text-sm text-text-secondary block mb-2">근무 형태</label>
                      <select
                        value={editedWorkType}
                        onChange={(e) => setEditedWorkType(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-border-light text-sm"
                      >
                        <option value="정규직 (풀타임)">정규직 (풀타임)</option>
                        <option value="정규직 (파트타임)">정규직 (파트타임)</option>
                        <option value="계약직">계약직</option>
                      </select>
                    </div>
                    <div className="p-3 bg-bg-secondary rounded-xl">
                      <label className="text-sm text-text-secondary block mb-2">근무 시간</label>
                      <select
                        value={editedWorkHours}
                        onChange={(e) => setEditedWorkHours(e.target.value)}
                        className="w-full px-3 py-2 bg-white rounded-lg border border-border-light text-sm"
                      >
                        <option value="09:00 ~ 18:00">09:00 ~ 18:00</option>
                        <option value="10:00 ~ 19:00">10:00 ~ 19:00</option>
                        <option value="11:00 ~ 20:00">11:00 ~ 20:00</option>
                        <option value="09:00 ~ 17:00">09:00 ~ 17:00 (단축)</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 후보자 요청사항 (협상 중인 경우) */}
                {offerTarget.lastMessage && (
                  <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="w-4 h-4 text-warning" />
                      <span className="text-sm font-medium text-warning">후보자 요청사항</span>
                    </div>
                    <p className="text-sm text-text-primary">&ldquo;{offerTarget.lastMessage}&rdquo;</p>
                  </div>
                )}

                {/* 버튼 */}
                <div className="flex gap-3 pt-2">
                  {!isEditingOffer ? (
                    <button
                      onClick={() => setIsEditingOffer(true)}
                      className="flex-1 py-3 text-sm border border-info text-info rounded-xl flex items-center justify-center gap-1"
                    >
                      <Edit2 className="w-4 h-4" />
                      조건 수정
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditingOffer(false)}
                      className="flex-1 py-3 text-sm bg-success/10 text-success rounded-xl flex items-center justify-center gap-1"
                    >
                      <CheckCircle className="w-4 h-4" />
                      수정 완료
                    </button>
                  )}
                  <button
                    onClick={() => {
                      alert(`${offerTarget.name}님에게 오퍼를 발송했습니다!\n제안 연봉: ${editedSalary}`);
                      setShowOfferModal(false);
                      setIsEditingOffer(false);
                    }}
                    className="flex-1 py-3 text-sm bg-expert-navy text-white rounded-xl flex items-center justify-center gap-1"
                  >
                    <Send className="w-4 h-4" />
                    오퍼 보내기
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 연락하기 모달 */}
      <AnimatePresence>
        {showContactModal && contactTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContactModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-5 z-50 max-w-sm mx-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary">{contactTarget.name}님에게 연락하기</h3>
                <button onClick={() => setShowContactModal(false)}>
                  <X className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              <div className="space-y-3">
                <button className="w-full p-4 bg-bg-secondary rounded-xl flex items-center gap-3 hover:bg-bg-tertiary transition-colors">
                  <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-success" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-text-primary">전화하기</div>
                    <div className="text-xs text-text-secondary">직접 통화로 빠르게 연락</div>
                  </div>
                </button>
                <button className="w-full p-4 bg-bg-secondary rounded-xl flex items-center gap-3 hover:bg-bg-tertiary transition-colors">
                  <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-info" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-text-primary">이메일 보내기</div>
                    <div className="text-xs text-text-secondary">상세한 내용 전달</div>
                  </div>
                </button>
                <button className="w-full p-4 bg-bg-secondary rounded-xl flex items-center gap-3 hover:bg-bg-tertiary transition-colors">
                  <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                    <BellRing className="w-5 h-5 text-warning" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-text-primary">알림 보내기</div>
                    <div className="text-xs text-text-secondary">앱 푸시 알림으로 리마인드</div>
                  </div>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 거절하기 모달 */}
      <AnimatePresence>
        {showRejectModal && rejectTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRejectModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-5 z-50 max-w-sm mx-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary">후보자 거절</h3>
                <button onClick={() => setShowRejectModal(false)}>
                  <X className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              <div className="mb-4">
                <div className="bg-error/10 border border-error/20 rounded-xl p-4 mb-4">
                  <p className="text-sm text-text-primary">
                    <strong>{rejectTarget.name}</strong>님을 거절하시겠습니까?
                  </p>
                  <p className="text-xs text-text-secondary mt-1">
                    거절 시 해당 후보자가 리스트에서 제외됩니다.
                  </p>
                </div>

                <div className="bg-bg-secondary rounded-xl p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">오늘 남은 거절 횟수</span>
                    <span className={`text-sm font-bold ${remainingRejects <= 3 ? 'text-error' : 'text-text-primary'}`}>
                      {remainingRejects}회 / {DAILY_REJECT_LIMIT}회
                    </span>
                  </div>
                  {remainingRejects <= 3 && (
                    <p className="text-xs text-error mt-1">거절 횟수가 얼마 남지 않았습니다.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-3 text-sm border border-border-light text-text-secondary rounded-xl"
                >
                  취소
                </button>
                <button
                  onClick={confirmReject}
                  className="flex-1 py-3 text-sm bg-error text-white rounded-xl flex items-center justify-center gap-1"
                >
                  <XCircle className="w-4 h-4" />
                  거절하기
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 일정조율 모달 */}
      <AnimatePresence>
        {showScheduleModal && scheduleTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowScheduleModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-5 z-50 max-w-sm mx-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary">면접 일정 조율</h3>
                <button onClick={() => setShowScheduleModal(false)}>
                  <X className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-bg-secondary rounded-xl p-4">
                  <div className="text-sm text-text-secondary mb-1">후보자</div>
                  <div className="font-medium text-text-primary">{scheduleTarget.name}</div>
                </div>

                <div className="bg-bg-secondary rounded-xl p-4">
                  <div className="text-sm text-text-secondary mb-1">현재 일정</div>
                  <div className="font-medium text-text-primary">{scheduleTarget.currentDate}</div>
                </div>

                <div>
                  <label className="text-sm text-text-secondary mb-2 block">새 일정 선택</label>
                  <input
                    type="datetime-local"
                    className="w-full px-3 py-3 bg-bg-secondary rounded-xl text-sm"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="flex-1 py-3 text-sm border border-border-light text-text-secondary rounded-xl"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      alert(`${scheduleTarget.name}님에게 일정 조율 요청을 보냈습니다.`);
                      setShowScheduleModal(false);
                    }}
                    className="flex-1 py-3 text-sm bg-expert-navy text-white rounded-xl flex items-center justify-center gap-1"
                  >
                    <Calendar className="w-4 h-4" />
                    일정 요청
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI 인터뷰 요청 모달 */}
      <AnimatePresence>
        {showAIInterviewModal && aiInterviewTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAIInterviewModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-5 z-50 max-w-sm mx-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary">AI 인터뷰 요청</h3>
                <button onClick={() => setShowAIInterviewModal(false)}>
                  <X className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-info/10 border border-info/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Video className="w-5 h-5 text-info" />
                    <span className="font-medium text-info">AI 인터뷰</span>
                  </div>
                  <p className="text-sm text-text-primary">
                    <strong>{aiInterviewTarget.name}</strong>님에게 AI 인터뷰를 요청하시겠습니까?
                  </p>
                  <p className="text-xs text-text-secondary mt-2">
                    AI가 후보자의 역량, 성향, 문화 적합도를 분석해 드립니다.
                  </p>
                </div>

                <div className="bg-bg-secondary rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span>예상 소요시간: 15-20분</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span>결과 리포트 즉시 제공</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    <CheckCircle className="w-3 h-3 text-success" />
                    <span>채용 추천 및 적합도 분석</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAIInterviewModal(false)}
                    className="flex-1 py-3 text-sm border border-border-light text-text-secondary rounded-xl"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      alert(`${aiInterviewTarget.name}님에게 AI 인터뷰 요청을 보냈습니다.`);
                      setShowAIInterviewModal(false);
                    }}
                    className="flex-1 py-3 text-sm bg-info text-white rounded-xl flex items-center justify-center gap-1"
                  >
                    <Video className="w-4 h-4" />
                    요청하기
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 활동 상세 모달 (6개 타입 모두 지원) */}
      <AnimatePresence>
        {showActivityDetailModal && activityDetailType && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowActivityDetailModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-5 z-50 max-w-md mx-auto max-h-[70vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary">
                  {activityDetailType === 'profileViewed' && '프로필 열람 상세'}
                  {activityDetailType === 'interviewProposed' && '인터뷰 제안 상세'}
                  {activityDetailType === 'aiInterview' && 'AI인터뷰 수행 상세'}
                  {activityDetailType === 'faceInterview' && '대면면접 진행 상세'}
                  {activityDetailType === 'offerSent' && '오퍼 발송 상세'}
                  {activityDetailType === 'hired' && '합격자 상세'}
                </h3>
                <button onClick={() => setShowActivityDetailModal(false)}>
                  <X className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              <div className="space-y-2">
                {/* 프로필 열람 */}
                {activityDetailType === 'profileViewed' && recruitmentActivityStats.profileViewed.details.map((item, index) => (
                  <Link key={item.id} href={`/employer/candidates/${item.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`p-3 rounded-xl flex items-center justify-between hover:bg-bg-tertiary transition-colors ${
                        index === 5 ? 'bg-brand-mint/5 border border-brand-mint/20' : 'bg-bg-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-text-primary">{item.name}</div>
                        <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                          item.matchScore >= 90 ? 'bg-brand-mint/10 text-brand-mint' : 'bg-info/10 text-info'
                        }`}>{item.matchScore}%</span>
                        <span className="text-xs text-text-tertiary">{item.position}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-text-primary">{item.viewDuration}</div>
                      </div>
                    </motion.div>
                  </Link>
                ))}

                {/* 인터뷰 제안 */}
                {activityDetailType === 'interviewProposed' && recruitmentActivityStats.interviewProposed.details.map((item, index) => (
                  <Link key={item.id} href={`/employer/candidates/${item.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="p-3 bg-bg-secondary rounded-xl flex items-center justify-between hover:bg-bg-tertiary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-text-primary">{item.name}</div>
                        <span className="text-xs text-text-tertiary">{item.position} · {item.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${item.statusColor}`}>{item.status}</span>
                        <span className="text-xs text-text-tertiary">{item.time}</span>
                      </div>
                    </motion.div>
                  </Link>
                ))}

                {/* AI인터뷰 수행 */}
                {activityDetailType === 'aiInterview' && recruitmentActivityStats.aiInterviewCompleted.details.map((item, index) => (
                  <Link key={item.id} href={`/employer/ai-interview/report/${item.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`p-3 rounded-xl flex items-center justify-between hover:bg-bg-tertiary transition-colors ${
                        item.status === '진행중' ? 'bg-warning/5 border border-warning/20' : 'bg-bg-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-text-primary">{item.name}</div>
                        <span className="text-xs text-text-tertiary">{item.position}</span>
                        {item.status === '완료' && (
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-brand-mint/10 text-brand-mint">
                            {item.score}점
                          </span>
                        )}
                        {item.status === '진행중' && (
                          <span className="text-xs font-bold px-1.5 py-0.5 rounded bg-warning/10 text-warning">
                            진행중
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-text-tertiary">{item.time}</div>
                    </motion.div>
                  </Link>
                ))}

                {/* 대면면접 진행 */}
                {activityDetailType === 'faceInterview' && recruitmentActivityStats.faceInterviewCompleted.details.map((item, index) => (
                  <Link key={item.id} href={`/employer/candidates/${item.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`p-3 rounded-xl flex items-center justify-between hover:bg-bg-tertiary transition-colors ${
                        item.time === '예정' ? 'bg-success/5 border border-success/20' : 'bg-bg-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-text-primary">{item.name}</div>
                        <span className="text-xs text-text-tertiary">{item.position}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-text-primary">{item.date}</div>
                        <div className={`text-xs ${item.time === '예정' ? 'text-success' : 'text-text-tertiary'}`}>
                          {item.time === '예정' ? '예정' : '완료'}
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}

                {/* 오퍼 발송 */}
                {activityDetailType === 'offerSent' && recruitmentActivityStats.offerSent.details.map((item, index) => (
                  <Link key={item.id} href={`/employer/candidates/${item.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className={`p-3 rounded-xl flex items-center justify-between hover:bg-bg-tertiary transition-colors ${
                        item.status === '협상중' ? 'bg-warning/5 border border-warning/20' : 'bg-bg-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="font-medium text-text-primary">{item.name}</div>
                        <span className="text-xs text-text-tertiary">{item.position}</span>
                        <span className="text-xs font-medium text-expert-navy">{item.salary}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium px-1.5 py-0.5 rounded ${
                          item.status === '협상중' ? 'bg-warning/10 text-warning' : 'bg-info/10 text-info'
                        }`}>{item.status}</span>
                        <span className="text-xs text-text-tertiary">{item.time}</span>
                      </div>
                    </motion.div>
                  </Link>
                ))}

                {/* 합격자 */}
                {activityDetailType === 'hired' && recruitmentActivityStats.hired.details.map((item, index) => (
                  <Link key={item.id} href={`/employer/candidates/${item.id}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="p-3 rounded-xl bg-success/5 border border-success/20 hover:bg-success/10 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-4 h-4 text-success" />
                          </div>
                          <div>
                            <div className="font-medium text-text-primary">{item.name}</div>
                            <div className="text-xs text-text-tertiary">{item.position}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-success">{item.salary}</div>
                          <div className="text-xs text-text-tertiary">입사일: {item.startDate}</div>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
