'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  Sparkles,
  Settings,
  Users,
  Video,
  Send,
  CheckCircle,
  ChevronRight,
  Play,
  Clock,
  ArrowRight,
  Briefcase,
  Target,
  MessageSquare,
  BarChart3,
  Zap,
  Award,
  Eye,
  Calendar,
  TrendingUp,
  Percent,
  X,
  Star,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import {
  mockAIInterviewResults,
  mockAIInterviewStats,
  recommendationLabels,
} from '@/lib/mock/data';

// 10단계 워크플로우 정의
const workflowSteps = [
  {
    step: 1,
    id: 'job-posting',
    title: '공고 등록',
    subtitle: 'AI가 JD를 자동 생성해요',
    icon: FileText,
    color: 'bg-info',
    description: '진료과목, 직무, 경력 등을 입력하면 AI가 매력적인 채용공고를 작성해드려요.',
    forEmployer: true,
    status: 'available',
  },
  {
    step: 2,
    id: 'branding',
    title: '브랜딩 생성',
    subtitle: 'AI가 채용 콘텐츠를 제작해요',
    icon: Sparkles,
    color: 'bg-brand-mint',
    description: '병원의 매력을 담은 채용 브랜딩 콘텐츠를 자동으로 생성해요.',
    forEmployer: true,
    status: 'available',
  },
  {
    step: 3,
    id: 'calibration',
    title: '평가 설정',
    subtitle: '맞춤형 면접 질문을 캘리브레이션해요',
    icon: Settings,
    color: 'bg-warning',
    description: 'AI와 대화하며 우리 병원에 맞는 면접 질문과 평가 기준을 설정해요.',
    forEmployer: true,
    status: 'available',
  },
  {
    step: 4,
    id: 'resume',
    title: '이력서 제출',
    subtitle: '구직자가 이력서를 업로드해요',
    icon: FileText,
    color: 'bg-text-tertiary',
    description: '구직자가 이력서를 업로드하면 AI가 자동으로 파싱해요.',
    forEmployer: false,
    status: 'seeker',
  },
  {
    step: 5,
    id: 'verification',
    title: '경력 검증',
    subtitle: '4대보험 연동으로 실시간 검증해요',
    icon: CheckCircle,
    color: 'bg-text-tertiary',
    description: '구직자의 경력을 4대보험 데이터로 자동 검증해요.',
    forEmployer: false,
    status: 'seeker',
  },
  {
    step: 6,
    id: 'ai-interview',
    title: 'AI 면접',
    subtitle: '구직자가 AI 화상 면접을 진행해요',
    icon: Video,
    color: 'bg-text-tertiary',
    description: '설정된 질문으로 AI가 화상 면접을 진행해요.',
    forEmployer: false,
    status: 'seeker',
  },
  {
    step: 7,
    id: 'concierge',
    title: 'AI 컨시어지',
    subtitle: '면접 후 케어를 받아요',
    icon: MessageSquare,
    color: 'bg-text-tertiary',
    description: '면접 후 구직자가 회사 정보를 확인하고 질문할 수 있어요.',
    forEmployer: false,
    status: 'seeker',
  },
  {
    step: 8,
    id: 'pipeline',
    title: '지원자 관리',
    subtitle: '칸반 보드로 파이프라인을 관리해요',
    icon: Users,
    color: 'bg-expert-navy',
    description: 'AI 면접 결과를 바탕으로 지원자를 단계별로 관리해요.',
    forEmployer: true,
    status: 'available',
  },
  {
    step: 9,
    id: 'copilot',
    title: '2차 면접 코파일럿',
    subtitle: '대면 면접을 AI가 보조해요',
    icon: Target,
    color: 'bg-success',
    description: '실시간으로 질문을 추천하고 평가를 기록해요.',
    forEmployer: true,
    status: 'available',
  },
  {
    step: 10,
    id: 'offer',
    title: '오퍼 발송',
    subtitle: '합격 통보와 온보딩을 진행해요',
    icon: Send,
    color: 'bg-match-gold',
    description: '합격자에게 오퍼를 발송하고 온보딩을 시작해요.',
    forEmployer: true,
    status: 'available',
  },
];

// 상태 필터
const statusFilters = [
  { id: 'all', label: '전체', count: mockAIInterviewResults.length },
  { id: 'completed', label: '완료', count: mockAIInterviewResults.filter(r => r.status === 'completed').length },
  { id: 'in_progress', label: '진행중', count: mockAIInterviewResults.filter(r => r.status === 'in_progress').length },
  { id: 'scheduled', label: '예정', count: mockAIInterviewResults.filter(r => r.status === 'scheduled').length },
];

export default function AIInterviewPage() {
  const router = useRouter();
  const [selectedStep, setSelectedStep] = useState<typeof workflowSteps[0] | null>(null);
  const [viewMode, setViewMode] = useState<'dashboard' | 'workflow'>('dashboard');
  const [statusFilter, setStatusFilter] = useState('all');

  // 면접/거절 모달 상태
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<typeof mockAIInterviewResults[0] | null>(null);
  const [selectedRejectReasons, setSelectedRejectReasons] = useState<string[]>([]);

  const handleInterview = (candidate: typeof mockAIInterviewResults[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCandidate(candidate);
    setShowInterviewModal(true);
  };

  const handleReject = (candidate: typeof mockAIInterviewResults[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCandidate(candidate);
    setSelectedRejectReasons([]);
    setShowRejectModal(true);
  };

  const confirmInterview = () => {
    if (selectedCandidate) {
      alert(`${selectedCandidate.name}님과의 대면면접이 예약되었습니다.`);
      setShowInterviewModal(false);
      setSelectedCandidate(null);
    }
  };

  const confirmReject = () => {
    if (selectedCandidate) {
      alert(`${selectedCandidate.name}님을 거절했습니다.`);
      setShowRejectModal(false);
      setSelectedCandidate(null);
      setSelectedRejectReasons([]);
    }
  };

  const employerSteps = workflowSteps.filter((s) => s.forEmployer);

  // 필터링된 인터뷰 결과
  const filteredResults = mockAIInterviewResults.filter(result => {
    if (statusFilter === 'all') return true;
    return result.status === statusFilter;
  });

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-dashboard-title">AI 인터뷰</h1>
        <p className="text-sm text-text-secondary mt-1">
          AI가 채용의 처음부터 끝까지 함께합니다
        </p>
      </div>

      {/* 빠른 시작 */}
      <div className="bg-gradient-to-r from-expert-navy to-expert-navy/80 rounded-2xl p-5 mb-6 text-white">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-sm text-white/70 mb-1">새로운 채용 시작하기</div>
            <div className="text-lg font-bold mb-2">AI와 함께 채용공고 만들기</div>
            <p className="text-sm text-white/80 mb-4">
              진료과목과 직무만 입력하면<br />
              AI가 매력적인 JD를 작성해드려요
            </p>
            <Link href="/employer/ai-interview/job-posting">
              <button className="bg-white text-expert-navy px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2">
                <Play className="w-4 h-4" />
                채용 시작하기
              </button>
            </Link>
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center">
            <Zap className="w-8 h-8 text-match-gold" />
          </div>
        </div>
      </div>

      {/* 탭 전환 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setViewMode('dashboard')}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
            viewMode === 'dashboard'
              ? 'bg-expert-navy text-white'
              : 'bg-white text-text-secondary border border-border-light'
          }`}
        >
          대시보드
        </button>
        <button
          onClick={() => setViewMode('workflow')}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
            viewMode === 'workflow'
              ? 'bg-expert-navy text-white'
              : 'bg-white text-text-secondary border border-border-light'
          }`}
        >
          워크플로우
        </button>
      </div>

      {/* 대시보드 뷰 */}
      {viewMode === 'dashboard' && (
        <div className="space-y-4">
          {/* 인터뷰 현황 카드 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl p-4 border border-border-light">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-expert-navy/10 rounded-lg flex items-center justify-center">
                  <Video className="w-4 h-4 text-expert-navy" />
                </div>
              </div>
              <div className="text-2xl font-bold text-expert-navy">{mockAIInterviewStats.totalInterviews}</div>
              <div className="text-xs text-text-tertiary">총 인터뷰</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-border-light">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-brand-mint/10 rounded-lg flex items-center justify-center">
                  <Star className="w-4 h-4 text-brand-mint" />
                </div>
              </div>
              <div className="text-2xl font-bold text-brand-mint">{mockAIInterviewStats.avgScore}점</div>
              <div className="text-xs text-text-tertiary">평균 점수</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-border-light">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
              </div>
              <div className="text-2xl font-bold text-success">{mockAIInterviewStats.conversionRate}%</div>
              <div className="text-xs text-text-tertiary">전환율</div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-border-light">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-info/10 rounded-lg flex items-center justify-center">
                  <Percent className="w-4 h-4 text-info" />
                </div>
              </div>
              <div className="text-2xl font-bold text-info">{mockAIInterviewStats.responseRate}%</div>
              <div className="text-xs text-text-tertiary">응답률</div>
            </div>
          </div>

          {/* 상태 필터 */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
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

          {/* 인터뷰 결과 리스트 */}
          <div className="space-y-3">
            {filteredResults.map((result, index) => {
              const recommendation = result.recommendation ? recommendationLabels[result.recommendation] : null;

              return (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => router.push(`/employer/candidates/${result.id}`)}
                  className="bg-white rounded-2xl p-4 border border-border-light cursor-pointer hover:shadow-card transition-all"
                >
                  {/* 상단: 상태 & 열람 횟수 */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      result.status === 'completed' ? 'bg-success/10 text-success' :
                      result.status === 'in_progress' ? 'bg-warning/10 text-warning' :
                      'bg-info/10 text-info'
                    }`}>
                      {result.status === 'completed' ? '완료' :
                       result.status === 'in_progress' ? '진행중' : '예정'}
                    </span>
                    {result.viewCount && result.viewCount >= 3 && (
                      <span className="flex items-center gap-1 text-xs text-error">
                        <Eye className="w-3 h-3" />
                        {result.viewCount}회 열람
                      </span>
                    )}
                  </div>

                  {/* 후보자 정보 */}
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-expert-navy/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-expert-navy" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-text-primary">{result.name}</div>
                      <div className="text-sm text-text-secondary">
                        {'specialty' in result ? `${result.specialty} · ` : ''}{result.experience}
                      </div>
                      {result.completedAt && (
                        <div className="text-xs text-text-tertiary mt-0.5">
                          {result.completedAt} 완료
                        </div>
                      )}
                    </div>
                    {/* 추천 등급 */}
                    {result.status === 'completed' && recommendation && (
                      <div className={`px-2.5 py-1 rounded-lg text-xs font-medium ${recommendation.bgColor} ${recommendation.color}`}>
                        {recommendation.label}
                      </div>
                    )}
                  </div>

                  {/* 점수 정보 (완료된 경우만) */}
                  {result.status === 'completed' && (
                    <>
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Star className="w-4 h-4 text-brand-mint" />
                          <span className="text-sm font-medium text-text-primary">AI 평가 {result.aiScore}점</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Target className="w-4 h-4 text-info" />
                          <span className="text-sm text-text-secondary">매칭률 {result.matchRate}%</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-text-tertiary" />
                          <span className="text-sm text-text-tertiary">{result.interviewDuration}분</span>
                        </div>
                      </div>

                      {/* 강점 & 고려사항 */}
                      <div className="space-y-2 mb-3">
                        {result.strengths && result.strengths.length > 0 && (
                          <div className="flex items-start gap-2">
                            <ThumbsUp className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                            <div className="flex flex-wrap gap-1">
                              {result.strengths.map((strength) => (
                                <span key={strength} className="text-xs bg-success/10 text-success px-2 py-0.5 rounded">
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {result.concerns && result.concerns.length > 0 && (
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                            <div className="flex flex-wrap gap-1">
                              {result.concerns.map((concern) => (
                                <span key={concern} className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded">
                                  {concern}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* CTA 버튼 */}
                      <div className="flex gap-2 pt-3 border-t border-border-light">
                        <Link href={`/employer/ai-interview/report/${result.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                          <button className="w-full flex items-center justify-center gap-1 py-2.5 text-xs bg-info text-white rounded-lg font-medium min-h-[40px]">
                            <FileText className="w-3 h-3" />
                            AI리포트
                          </button>
                        </Link>
                        <button
                          onClick={(e) => handleInterview(result, e)}
                          className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs bg-success text-white rounded-lg font-medium min-h-[40px]"
                        >
                          <Calendar className="w-3 h-3" />
                          면접
                        </button>
                        <button
                          onClick={(e) => handleReject(result, e)}
                          className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs bg-error/10 text-error rounded-lg font-medium min-h-[40px]"
                        >
                          <X className="w-3 h-3" />
                          거절
                        </button>
                      </div>
                    </>
                  )}

                  {/* 진행중인 경우 */}
                  {result.status === 'in_progress' && (
                    <div className="flex gap-2 pt-3 border-t border-border-light">
                      <div className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-warning bg-warning/10 rounded-lg font-medium">
                        <Clock className="w-4 h-4" />
                        면접 진행 중...
                      </div>
                    </div>
                  )}

                  {/* 예정인 경우 */}
                  {result.status === 'scheduled' && result.scheduledAt && (
                    <div className="flex gap-2 pt-3 border-t border-border-light">
                      <div className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm text-info bg-info/10 rounded-lg font-medium">
                        <Calendar className="w-4 h-4" />
                        {result.scheduledAt} 예정
                      </div>
                      <button className="flex items-center justify-center px-3 py-2.5 text-sm bg-bg-secondary text-text-secondary rounded-lg hover:bg-error/10 hover:text-error transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {filteredResults.length === 0 && (
            <div className="text-center py-12">
              <Video className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
              <div className="text-text-secondary">해당 상태의 인터뷰가 없어요</div>
            </div>
          )}
        </div>
      )}

      {/* 워크플로우 뷰 */}
      {viewMode === 'workflow' && (
        <div className="space-y-4">
          {/* 10단계 워크플로우 */}
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h2 className="text-card-title mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-expert-navy" />
              10단계 AI 채용 워크플로우
            </h2>

            <div className="space-y-2">
              {workflowSteps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => step.forEmployer && setSelectedStep(step)}
                  className={`relative flex items-center gap-3 p-3 rounded-xl transition-all ${
                    step.forEmployer
                      ? 'bg-bg-secondary cursor-pointer hover:bg-expert-navy/5'
                      : 'bg-bg-secondary/50 opacity-60'
                  }`}
                >
                  {/* 단계 번호 */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${step.color}`}
                  >
                    {step.step}
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary">{step.title}</span>
                      {!step.forEmployer && (
                        <span className="text-xs bg-bg-tertiary text-text-tertiary px-2 py-0.5 rounded">
                          구직자
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-text-secondary truncate">{step.subtitle}</div>
                  </div>

                  {/* 아이콘 */}
                  {step.forEmployer && (
                    <ChevronRight className="w-5 h-5 text-text-tertiary" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          {/* 구인처 전용 단계 바로가기 */}
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h2 className="text-card-title mb-4">구인처 핵심 기능</h2>
            <div className="grid grid-cols-2 gap-3">
              {employerSteps.map((step) => (
                <Link key={step.id} href={`/employer/ai-interview/${step.id}`}>
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    className="bg-bg-secondary rounded-xl p-4 hover:shadow-sm transition-all"
                  >
                    <div className={`w-10 h-10 ${step.color} rounded-xl flex items-center justify-center mb-3`}>
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="font-medium text-text-primary text-sm">{step.title}</div>
                    <div className="text-xs text-text-tertiary mt-1">{step.subtitle}</div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 단계 상세 바텀시트 */}
      <AnimatePresence>
        {selectedStep && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedStep(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[60vh] overflow-y-auto"
            >
              <div className="p-4 pb-8">
                <div className="w-12 h-1.5 bg-bg-tertiary rounded-full mx-auto mb-4" />

                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-14 h-14 ${selectedStep.color} rounded-2xl flex items-center justify-center`}>
                    <selectedStep.icon className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-text-tertiary">Step {selectedStep.step}</div>
                    <h3 className="text-xl font-bold text-expert-navy">{selectedStep.title}</h3>
                    <div className="text-sm text-text-secondary">{selectedStep.subtitle}</div>
                  </div>
                </div>

                <p className="text-text-secondary mb-6">{selectedStep.description}</p>

                <Link href={`/employer/ai-interview/${selectedStep.id}`}>
                  <button
                    onClick={() => setSelectedStep(null)}
                    className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    시작하기
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 면접 예약 모달 */}
      <AnimatePresence>
        {showInterviewModal && selectedCandidate && (
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
                  <Calendar className="w-7 h-7 text-success" />
                </div>
                <h3 className="text-lg font-bold">{selectedCandidate.name}</h3>
                <p className="text-sm text-text-secondary">대면 면접을 예약하시겠어요?</p>
              </div>

              <div className="bg-bg-secondary rounded-xl p-4 mb-4">
                <div className="text-sm text-text-secondary mb-2">AI 인터뷰 결과</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-text-primary">AI 평가 점수</span>
                  <span className="text-lg font-bold text-brand-mint">{selectedCandidate.aiScore || 85}점</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-sm font-medium text-text-primary">매칭률</span>
                  <span className="text-lg font-bold text-info">{selectedCandidate.matchRate || 90}%</span>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={confirmInterview}
                  className="btn-primary w-full"
                >
                  면접 예약하기
                </button>
                <button
                  onClick={() => {
                    setShowInterviewModal(false);
                    setSelectedCandidate(null);
                  }}
                  className="w-full py-3 text-text-secondary text-sm"
                >
                  취소
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 거절 모달 */}
      <AnimatePresence>
        {showRejectModal && selectedCandidate && (
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
                <div className="w-14 h-14 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <X className="w-7 h-7 text-error" />
                </div>
                <h3 className="text-lg font-bold">{selectedCandidate.name}</h3>
                <p className="text-sm text-text-secondary">이 후보자를 거절하시겠어요?</p>
              </div>

              {/* 거절 사유 선택 */}
              <div className="mb-4">
                <p className="text-sm font-medium text-text-primary mb-2">거절 사유 선택</p>
                <div className="flex flex-wrap gap-2">
                  {['적합도 부족', '경력 미달', '급여 조건', '출근 가능일', '기타'].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => {
                        if (selectedRejectReasons.includes(reason)) {
                          setSelectedRejectReasons(prev => prev.filter(r => r !== reason));
                        } else {
                          setSelectedRejectReasons(prev => [...prev, reason]);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
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

              <div className="space-y-3">
                <button
                  onClick={confirmReject}
                  disabled={selectedRejectReasons.length === 0}
                  className="w-full py-3 bg-error text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  거절하기
                </button>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setSelectedCandidate(null);
                    setSelectedRejectReasons([]);
                  }}
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
