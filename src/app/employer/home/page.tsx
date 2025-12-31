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
} from 'lucide-react';
import {
  mockEmployerRecruitmentStatus,
  mockCandidates,
  mockEmployerActivity,
  mockJobPostings,
  mockEmployerProfile,
} from '@/lib/mock/data';

// 상세 후보자 정보
const detailedCandidates = {
  new: [
    { id: 1, name: '한소희', position: '간호사', experience: '3년', matchScore: 94, addedTime: '2시간 전', urgent: true },
    { id: 2, name: '김유정', position: '간호사', experience: '5년', matchScore: 91, addedTime: '5시간 전', urgent: false },
    { id: 3, name: '박민영', position: '간호조무사', experience: '2년', matchScore: 88, addedTime: '1일 전', urgent: false },
  ],
  proposed: [
    { id: 4, name: '이지은', position: '간호사', experience: '4년', matchScore: 92, sentTime: '3일 전', status: '열람 완료', canRemind: true },
    { id: 5, name: '송혜교', position: '간호사', experience: '6년', matchScore: 89, sentTime: '5일 전', status: '미열람', canRemind: true },
  ],
  negotiating: [
    { id: 6, name: '전지현', position: '간호사', experience: '7년', matchScore: 95, issue: '급여 조정 요청', lastMessage: '400만원 이상 희망', needsAction: true },
  ],
  interview: [
    { id: 7, name: '신민아', position: '간호사', experience: '4년', matchScore: 90, date: '내일 오후 2시', location: '병원 면접실', hasReminder: true },
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
  const [expandedStatus, setExpandedStatus] = useState<string | null>(null);
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const status = mockEmployerRecruitmentStatus;
  const activity = mockEmployerActivity;
  const topCandidates = mockCandidates.slice(0, 3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivityIndex((prev) =>
        (prev + 1) % activity.recentActivity.length
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [activity.recentActivity.length]);

  const toggleStatus = (statusKey: string) => {
    setExpandedStatus(expandedStatus === statusKey ? null : statusKey);
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

      {/* 긴급 액션 필요 알림 */}
      {(detailedCandidates.new.some(c => c.urgent) || detailedCandidates.negotiating.some(c => c.needsAction)) && (
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
            {detailedCandidates.new.filter(c => c.urgent).map(c => (
              <div key={c.id} className="flex items-center justify-between">
                <span className="text-sm text-text-primary">
                  새 후보자 <strong>{c.name}</strong>님 ({c.matchScore}% 매칭) - {c.addedTime}
                </span>
                <Link href={`/employer/candidates/${c.id}`}>
                  <button className="text-xs bg-error text-white px-3 py-1 rounded-lg">
                    지금 확인
                  </button>
                </Link>
              </div>
            ))}
            {detailedCandidates.negotiating.filter(c => c.needsAction).map(c => (
              <div key={c.id} className="flex items-center justify-between">
                <span className="text-sm text-text-primary">
                  <strong>{c.name}</strong>님 협상 회신 필요 - {c.issue}
                </span>
                <Link href={`/employer/matching-center?tab=negotiating`}>
                  <button className="text-xs bg-warning text-white px-3 py-1 rounded-lg">
                    조건 확인
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* 채용 현황 요약 - 확장 가능 */}
      <section className="mb-6">
        <h2 className="text-section-title mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-expert-navy" />
          채용 현황
        </h2>
        <div className="space-y-3">
          {/* 새 후보자 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-border-light overflow-hidden"
          >
            <button
              onClick={() => toggleStatus('new')}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-mint/10 rounded-xl flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-brand-mint" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-text-primary">새 후보자</div>
                  <div className="text-xs text-text-secondary">이번 주 신규</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-brand-mint">{detailedCandidates.new.length}</span>
                <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform ${expandedStatus === 'new' ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <AnimatePresence>
              {expandedStatus === 'new' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-border-light pt-3">
                    {detailedCandidates.new.map(candidate => (
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
                          <Link href="/employer/matching-center" className="flex-1">
                            <button className="w-full py-2 text-xs bg-expert-navy text-white rounded-lg flex items-center justify-center gap-1">
                              <Send className="w-3 h-3" />
                              제안하기
                            </button>
                          </Link>
                          <Link href={`/employer/candidates/${candidate.id}`} className="flex-1">
                            <button className="w-full py-2 text-xs border border-border-light text-text-secondary rounded-lg">
                              프로필 상세
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                    <Link href="/employer/ai-interview/pipeline">
                      <button className="w-full py-2 text-sm text-expert-navy font-medium flex items-center justify-center gap-1">
                        전체 후보자 관리하기 <ArrowRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 제안 완료 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-border-light overflow-hidden"
          >
            <button
              onClick={() => toggleStatus('proposed')}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
                  <Send className="w-5 h-5 text-info" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-text-primary">제안 완료</div>
                  <div className="text-xs text-text-secondary">응답 대기 중</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-info">{detailedCandidates.proposed.length}</span>
                <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform ${expandedStatus === 'proposed' ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <AnimatePresence>
              {expandedStatus === 'proposed' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-border-light pt-3">
                    {detailedCandidates.proposed.map(candidate => (
                      <div key={candidate.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-expert-navy/10 rounded-full flex items-center justify-center">
                            <Users className="w-4 h-4 text-expert-navy" />
                          </div>
                          <div>
                            <div className="font-medium text-text-primary text-sm">{candidate.name}</div>
                            <div className="text-xs text-text-secondary">{candidate.status} · {candidate.sentTime}</div>
                          </div>
                        </div>
                        {candidate.canRemind && (
                          <button className="text-xs bg-info/10 text-info px-3 py-1.5 rounded-lg">
                            리마인드
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 협상 중 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl border border-border-light overflow-hidden"
          >
            <button
              onClick={() => toggleStatus('negotiating')}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-warning/10 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-warning" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-text-primary">협상 중</div>
                  <div className="text-xs text-text-secondary">조율 진행 중</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-warning">{detailedCandidates.negotiating.length}</span>
                <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform ${expandedStatus === 'negotiating' ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <AnimatePresence>
              {expandedStatus === 'negotiating' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-border-light pt-3">
                    {detailedCandidates.negotiating.map(candidate => (
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
                        <div className="text-xs text-text-tertiary bg-white p-2 rounded-lg">
                          &ldquo;{candidate.lastMessage}&rdquo;
                        </div>
                        <div className="flex gap-2 mt-3">
                          <Link href="/employer/matching-center?tab=negotiating" className="flex-1">
                            <button className="w-full py-2 text-xs bg-expert-navy text-white rounded-lg">
                              조건 확인
                            </button>
                          </Link>
                          <Link href="/employer/matching-center?tab=negotiating&action=schedule" className="flex-1">
                            <button className="w-full py-2 text-xs bg-success text-white rounded-lg flex items-center justify-center gap-1">
                              <Calendar className="w-3 h-3" />
                              일정 잡기
                            </button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* 면접 예정 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-border-light overflow-hidden"
          >
            <button
              onClick={() => toggleStatus('interview')}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-success" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-text-primary">면접 예정</div>
                  <div className="text-xs text-success">내일 1건</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-success">{detailedCandidates.interview.length}</span>
                <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform ${expandedStatus === 'interview' ? 'rotate-180' : ''}`} />
              </div>
            </button>
            <AnimatePresence>
              {expandedStatus === 'interview' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 space-y-2 border-t border-border-light pt-3">
                    {detailedCandidates.interview.map(candidate => (
                      <div key={candidate.id} className="p-3 bg-success/5 border border-success/20 rounded-xl">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-text-primary text-sm">{candidate.name}</span>
                            <span className="text-sm font-bold text-brand-mint">{candidate.matchScore}%</span>
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
                          <Link href="/employer/ai-interview/copilot" className="flex-1">
                            <button className="w-full py-2 text-xs bg-expert-navy text-white rounded-lg flex items-center justify-center gap-1">
                              <Video className="w-3 h-3" />
                              면접 코파일럿
                            </button>
                          </Link>
                          <button className="flex-1 py-2 text-xs border border-border-light text-text-secondary rounded-lg">
                            일정 변경
                          </button>
                        </div>
                      </div>
                    ))}
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

      {/* 진행 중인 채용 - 확장 가능 */}
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

                      {/* 액션 버튼 */}
                      <div className="flex gap-2">
                        <Link href={`/employer/jobs/${job.id}/edit`} className="flex-1">
                          <button className="w-full py-2.5 text-sm bg-expert-navy text-white rounded-xl flex items-center justify-center gap-1">
                            <Edit2 className="w-4 h-4" />
                            공고 수정
                          </button>
                        </Link>
                        <Link href="/employer/ai-interview/pipeline" className="flex-1">
                          <button className="w-full py-2.5 text-sm border border-expert-navy text-expert-navy rounded-xl flex items-center justify-center gap-1">
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
          <Link href="/employer/matching-center" className="text-sm text-expert-navy flex items-center">
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

        <Link href="/employer/matching-center">
          <button className="btn-primary w-full mt-4">
            <Users className="w-5 h-5 mr-2" />
            더 많은 후보자 보기
          </button>
        </Link>
      </section>

      {/* 이번 주 활동 */}
      <section className="mb-6">
        <h2 className="text-section-title mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-brand-mint" />
          이번 주 활동
        </h2>

        <div className="bg-white rounded-2xl p-4 border border-border-light">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <div className="text-xl font-bold text-expert-navy">
                {activity.weeklyStats.candidatesViewed}
              </div>
              <div className="text-xs text-text-tertiary">프로필 열람</div>
            </div>
            <div>
              <div className="text-xl font-bold text-expert-navy">
                {activity.weeklyStats.proposalsSent}
              </div>
              <div className="text-xs text-text-tertiary">제안 발송</div>
            </div>
            <div>
              <div className="text-xl font-bold text-brand-mint">
                {activity.weeklyStats.responses}
              </div>
              <div className="text-xs text-text-tertiary">응답 수</div>
            </div>
            <div>
              <div className="text-xl font-bold text-success">
                {activity.weeklyStats.interviews}
              </div>
              <div className="text-xs text-text-tertiary">면접 진행</div>
            </div>
          </div>
        </div>
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
          <Link href="/employer/profile">
            <div className="text-sm text-expert-navy flex items-center">
              <span>프로필 100% 완성하고 더 많은 후보자 만나기</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
