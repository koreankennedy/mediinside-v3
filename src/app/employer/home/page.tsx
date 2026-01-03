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
} from 'lucide-react';
import {
  mockEmployerRecruitmentStatus,
  mockCandidates,
  mockEmployerActivity,
  mockJobPostings,
  mockEmployerProfile,
} from '@/lib/mock/data';

// 채용 활동 현황 데이터 (6개 지표)
const recruitmentActivityStats = {
  profileViewed: {
    count: 45,
    label: '프로필 열람',
    color: 'text-expert-navy',
    details: [
      { id: 1, name: '김미진', position: '간호사', matchScore: 95, time: '1시간 전', viewDuration: '3분 13초' },
      { id: 2, name: '이은정', position: '간호사', matchScore: 92, time: '1시간 전', viewDuration: '2분 1초' },
      { id: 3, name: '박수진', position: '간호사', matchScore: 89, time: '1시간 전', viewDuration: '2분 54초' },
      { id: 4, name: '정혜원', position: '간호사', matchScore: 90, time: '1시간 전', viewDuration: '3분 24초' },
      { id: 5, name: '최지영', position: '간호사', matchScore: 88, time: '1시간 전', viewDuration: '1분 20초' },
      { id: 6, name: '강민경', position: '간호사', matchScore: 92, time: '2시간 전', viewDuration: '1분 27초' },
      { id: 7, name: '윤서연', position: '간호사', matchScore: 89, time: '2시간 전', viewDuration: '1분 31초' },
      { id: 8, name: '서지은', position: '간호사', matchScore: 87, time: '2시간 전', viewDuration: '1분 34초' },
      { id: 9, name: '홍수민', position: '간호사', matchScore: 85, time: '2시간 전', viewDuration: '2분 52초' },
      { id: 10, name: '장미라', position: '간호사', matchScore: 84, time: '2시간 전', viewDuration: '2분 57초' },
    ],
  },
  interviewProposed: {
    count: 12,
    label: '인터뷰 제안',
    color: 'text-info',
    details: [
      { id: 1, name: '김미진', position: '간호사', type: 'AI 채팅', status: '수락', statusColor: 'text-success', time: '1일 전' },
      { id: 2, name: '이은정', position: '간호사', type: '화상면접', status: '대기중', statusColor: 'text-warning', time: '1일 전' },
      { id: 3, name: '박수진', position: '간호사', type: '화상면접', status: '거절', statusColor: 'text-error', time: '1일 전' },
      { id: 4, name: '정혜원', position: '간호사', type: 'AI 채팅', status: '수락', statusColor: 'text-success', time: '1일 전' },
      { id: 5, name: '최지영', position: '간호사', type: '화상면접', status: '대기중', statusColor: 'text-warning', time: '2일 전' },
      { id: 6, name: '강민경', position: '간호사', type: '화상면접', status: '거절', statusColor: 'text-error', time: '2일 전' },
      { id: 7, name: '윤서연', position: '간호사', type: 'AI 채팅', status: '수락', statusColor: 'text-success', time: '2일 전' },
      { id: 8, name: '서지은', position: '간호사', type: '화상면접', status: '대기중', statusColor: 'text-warning', time: '2일 전' },
    ],
  },
  aiInterviewCompleted: {
    count: 8,
    label: 'AI인터뷰 수행',
    color: 'text-brand-mint',
  },
  faceInterviewCompleted: {
    count: 3,
    label: '대면면접 진행',
    color: 'text-brand-mint',
  },
  offerSent: {
    count: 2,
    label: '오퍼 발송',
    color: 'text-warning',
  },
  hired: {
    count: 1,
    label: '합격자',
    color: 'text-success',
  },
};

// 퍼널 단계별 후보자 데이터 (순서: 협상 중 > 제안완료 > 대면면접 > AI면접 > 신규)
const funnelCandidates = {
  negotiating: [
    { id: 6, name: '김서현', position: '간호사', experience: '7년', matchScore: 95, issue: '급여 조정 요청', lastMessage: '연봉 4,200만원 이상 희망합니다.', proposedSalary: '4,000만원', needsAction: true },
  ],
  proposed: [
    { id: 4, name: '이수연', position: '간호사', experience: '4년', matchScore: 92, sentTime: '3일 전', status: '열람 완료', canRemind: true },
    { id: 5, name: '박지영', position: '간호사', experience: '6년', matchScore: 89, sentTime: '5일 전', status: '미열람', canRemind: true },
  ],
  faceInterview: [
    { id: 7, name: '최수민', position: '간호사', experience: '4년', matchScore: 90, date: '내일 오후 2시', location: '병원 면접실', aiScore: 92, hasReminder: true },
  ],
  aiInterview: [
    { id: 8, name: '정민지', position: '간호사', experience: '3년', matchScore: 88, aiScore: 89, completedAt: '어제', status: '완료' },
    { id: 9, name: '강은비', position: '간호조무사', experience: '2년', matchScore: 85, status: '진행중', startedAt: '오늘 오전' },
  ],
  new: [
    { id: 1, name: '김하은', position: '간호사', experience: '3년', matchScore: 94, addedTime: '2시간 전', urgent: true, aiInterviewReady: true },
    { id: 2, name: '이지민', position: '간호사', experience: '5년', matchScore: 91, addedTime: '5시간 전', urgent: false, aiInterviewReady: true },
    { id: 3, name: '박소연', position: '간호조무사', experience: '2년', matchScore: 88, addedTime: '1일 전', urgent: false, aiInterviewReady: false },
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

export default function EmployerHomePage() {
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [expandedFunnel, setExpandedFunnel] = useState<string | null>(null);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const status = mockEmployerRecruitmentStatus;
  const activity = mockEmployerActivity;
  const topCandidates = mockCandidates.slice(0, 3);

  // 모달 상태
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerTarget, setOfferTarget] = useState<typeof funnelCandidates.negotiating[0] | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactTarget, setContactTarget] = useState<typeof funnelCandidates.proposed[0] | null>(null);
  const [showActivityDetailModal, setShowActivityDetailModal] = useState(false);
  const [activityDetailType, setActivityDetailType] = useState<'profileViewed' | 'interviewProposed' | null>(null);

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
  const openOfferModal = (candidate: typeof funnelCandidates.negotiating[0]) => {
    setOfferTarget(candidate);
    setShowOfferModal(true);
  };

  // 연락하기 모달 열기
  const openContactModal = (candidate: typeof funnelCandidates.proposed[0]) => {
    setContactTarget(candidate);
    setShowContactModal(true);
  };

  // 활동 상세 모달 열기
  const openActivityDetail = (type: 'profileViewed' | 'interviewProposed') => {
    setActivityDetailType(type);
    setShowActivityDetailModal(true);
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
      {(funnelCandidates.new.some(c => c.urgent) || funnelCandidates.negotiating.some(c => c.needsAction)) && (
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
            {funnelCandidates.aiInterview.filter(c => c.status === '완료').map(c => (
              <div key={c.id} className="flex items-center justify-between">
                <span className="text-sm text-text-primary">
                  <strong>{c.name}</strong>님 AI면접 완료 (점수 {c.aiScore}점) - 오퍼 발송 필요
                </span>
                <button
                  onClick={() => openOfferModal({ ...c, issue: '', lastMessage: '', proposedSalary: '4,000만원', needsAction: true } as typeof funnelCandidates.negotiating[0])}
                  className="text-xs bg-error text-white px-3 py-1 rounded-lg"
                >
                  지금 확인
                </button>
              </div>
            ))}
            {/* 협상 중 회신 필요 */}
            {funnelCandidates.negotiating.filter(c => c.needsAction).map(c => (
              <div key={c.id} className="flex items-center justify-between">
                <span className="text-sm text-text-primary">
                  <strong>{c.name}</strong>님 협상 회신 필요 - {c.issue}
                </span>
                <button
                  onClick={() => openOfferModal(c)}
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
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-mint">{recruitmentActivityStats.aiInterviewCompleted.count}</div>
              <div className="text-xs text-text-tertiary">AI인터뷰 수행</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-brand-mint">{recruitmentActivityStats.faceInterviewCompleted.count}</div>
              <div className="text-xs text-text-tertiary">대면면접 진행</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">{recruitmentActivityStats.offerSent.count}</div>
              <div className="text-xs text-text-tertiary">오퍼 발송</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">{recruitmentActivityStats.hired.count}</div>
              <div className="text-xs text-text-tertiary">합격자</div>
            </div>
          </div>
        </div>

        {/* 퍼널 단계별 카드 - 순서: 협상 중 > 제안완료 > 대면면접 > AI면접 > 신규 */}
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
                <span className="text-2xl font-bold text-warning">{funnelCandidates.negotiating.length}</span>
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
                    {funnelCandidates.negotiating.map(candidate => (
                      <div key={candidate.id} className="p-3 bg-bg-secondary rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text-primary text-sm">{candidate.name}</span>
                            <span className="text-sm font-bold text-brand-mint">{candidate.matchScore}%</span>
                          </div>
                          {candidate.needsAction && (
                            <span className="text-xs bg-warning text-white px-2 py-0.5 rounded">회신 필요</span>
                          )}
                        </div>
                        <div className="text-xs text-text-secondary mb-2">{candidate.issue}</div>
                        <div className="text-xs text-text-tertiary bg-white p-2 rounded-lg mb-3">
                          &ldquo;{candidate.lastMessage}&rdquo;
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => openOfferModal(candidate)}
                            className="flex-1 py-2 text-xs bg-expert-navy text-white rounded-lg flex items-center justify-center gap-1"
                          >
                            <Edit2 className="w-3 h-3" />
                            오퍼 수정하기
                          </button>
                          <button className="flex-1 py-2 text-xs bg-error/10 text-error rounded-lg">
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
                <span className="text-2xl font-bold text-success">{funnelCandidates.faceInterview.length}</span>
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
                    {funnelCandidates.faceInterview.map(candidate => (
                      <div key={candidate.id} className="p-3 bg-success/5 border border-success/20 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text-primary text-sm">{candidate.name}</span>
                            <span className="text-sm font-bold text-brand-mint">{candidate.matchScore}%</span>
                            <span className="text-xs bg-brand-mint/10 text-brand-mint px-2 py-0.5 rounded">AI {candidate.aiScore}점</span>
                          </div>
                        </div>
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
                          <Link href={`/employer/ai-interview/report/${candidate.id}`} className="flex-1">
                            <button className="w-full py-2 text-xs bg-expert-navy text-white rounded-lg flex items-center justify-center gap-1">
                              <FileText className="w-3 h-3" />
                              AI리포트 보기
                            </button>
                          </Link>
                          <button className="flex-1 py-2 text-xs bg-info/10 text-info rounded-lg flex items-center justify-center gap-1">
                            <Calendar className="w-3 h-3" />
                            일정 조율
                          </button>
                          <button className="py-2 px-3 text-xs bg-error/10 text-error rounded-lg">
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
                <span className="text-2xl font-bold text-info">{funnelCandidates.aiInterview.length}</span>
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
                    {funnelCandidates.aiInterview.map(candidate => (
                      <div key={candidate.id} className="p-3 bg-bg-secondary rounded-xl">
                        <div className="flex items-center justify-between mb-2">
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
                        <div className="text-xs text-text-tertiary mb-3">
                          {candidate.status === '완료' ? `${candidate.completedAt} 완료` : `${candidate.startedAt} 시작`}
                        </div>
                        <div className="flex gap-2">
                          {candidate.status === '완료' ? (
                            <>
                              <Link href={`/employer/ai-interview/report/${candidate.id}`} className="flex-1">
                                <button className="w-full py-2 text-xs bg-expert-navy text-white rounded-lg flex items-center justify-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  AI리포트
                                </button>
                              </Link>
                              <button className="flex-1 py-2 text-xs bg-success/10 text-success rounded-lg flex items-center justify-center gap-1">
                                <Calendar className="w-3 h-3" />
                                대면일정 잡기
                              </button>
                              <button className="py-2 px-3 text-xs bg-error/10 text-error rounded-lg">
                                거절
                              </button>
                            </>
                          ) : (
                            <div className="flex-1 py-2 text-xs text-center text-warning bg-warning/10 rounded-lg flex items-center justify-center gap-1">
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
                <span className="text-2xl font-bold text-brand-mint">{funnelCandidates.new.length}</span>
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
                    {funnelCandidates.new.map(candidate => (
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
                          <button className="flex-1 py-2 text-xs bg-expert-navy text-white rounded-lg flex items-center justify-center gap-1">
                            <Video className="w-3 h-3" />
                            AI인터뷰 요청
                          </button>
                          <button className="flex-1 py-2 text-xs bg-error/10 text-error rounded-lg">
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

      {/* 채용상품 효과 */}
      <section className="mb-6">
        <h2 className="text-section-title mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-expert-navy" />
          채용상품 효과
        </h2>
        <div className="bg-white rounded-2xl border border-border-light p-4">
          <div className="space-y-4">
            {/* 상품별 수락률 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">💰 매출 셰어</span>
                <span className="text-sm font-bold text-brand-mint">수락률 78%</span>
              </div>
              <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-[#FF2D55] rounded-full" style={{ width: '78%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">🎁 근속 보너스</span>
                <span className="text-sm font-bold text-brand-mint">수락률 65%</span>
              </div>
              <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-[#AF52DE] rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-text-primary">💵 수당 보장</span>
                <span className="text-sm font-bold text-brand-mint">수락률 58%</span>
              </div>
              <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                <div className="h-full bg-[#FF9500] rounded-full" style={{ width: '58%' }} />
              </div>
            </div>
          </div>

          {/* 통계 요약 + CTA */}
          <div className="bg-success/5 rounded-xl p-3 mt-4 border border-success/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-success" />
                <div className="text-sm text-text-primary">
                  채용상품 적용 시 <strong className="text-success">평균 수락률 2.3배</strong> 증가
                </div>
              </div>
              <Link href="/employer/matching-center?tab=product-settings">
                <button className="text-xs bg-success text-white px-3 py-1.5 rounded-lg">
                  설정하기
                </button>
              </Link>
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
                          <button className="w-full py-3 text-sm bg-expert-navy text-white rounded-xl flex items-center justify-center gap-1">
                            <Edit2 className="w-4 h-4" />
                            공고 수정
                          </button>
                        </Link>
                        <Link href="/employer/ai-interview/pipeline" className="flex-1">
                          <button className="w-full py-3 text-sm border border-expert-navy text-expert-navy rounded-xl flex items-center justify-center gap-1">
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-4 right-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-5 z-50 max-w-md mx-auto max-h-[80vh] overflow-y-auto"
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

                {/* 오퍼 조건 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                    <span className="text-sm text-text-secondary">제안 연봉</span>
                    <span className="font-medium text-text-primary">{offerTarget.proposedSalary || '4,000만원'}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                    <span className="text-sm text-text-secondary">근무 형태</span>
                    <span className="font-medium text-text-primary">정규직 (풀타임)</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                    <span className="text-sm text-text-secondary">근무 시간</span>
                    <span className="font-medium text-text-primary">09:00 ~ 18:00</span>
                  </div>
                  <div className="p-3 bg-bg-secondary rounded-xl">
                    <span className="text-sm text-text-secondary block mb-2">채용상품</span>
                    <div className="flex gap-2 flex-wrap">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-[#FF2D55]">💰 매출 셰어 1%</span>
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold text-white bg-[#AF52DE]">🎁 근속 보너스</span>
                    </div>
                  </div>
                </div>

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
                  <button
                    onClick={() => setShowOfferModal(false)}
                    className="flex-1 py-3 text-sm border border-border-light text-text-secondary rounded-xl"
                  >
                    조건 수정
                  </button>
                  <button
                    onClick={() => {
                      alert(`${offerTarget.name}님에게 오퍼를 발송했습니다!`);
                      setShowOfferModal(false);
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-4 right-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-5 z-50 max-w-sm mx-auto"
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

      {/* 활동 상세 모달 (프로필 열람 / 인터뷰 제안) */}
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
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed left-4 right-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl p-5 z-50 max-w-md mx-auto max-h-[70vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary">
                  {activityDetailType === 'profileViewed' ? '프로필 열람 상세' : '인터뷰 제안 상세'}
                </h3>
                <button onClick={() => setShowActivityDetailModal(false)}>
                  <X className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              <div className="space-y-2">
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
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
