'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
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
} from 'lucide-react';

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

// Mock 진행중인 채용
const activeRecruitments = [
  {
    id: 'rec-1',
    title: '피부과 전문 간호사',
    step: 3,
    applicants: 12,
    newApplicants: 3,
    createdAt: '2024-12-20',
  },
  {
    id: 'rec-2',
    title: '치과위생사 (경력 3년 이상)',
    step: 8,
    applicants: 8,
    newApplicants: 0,
    createdAt: '2024-12-15',
  },
];

export default function AIInterviewPage() {
  const [selectedStep, setSelectedStep] = useState<typeof workflowSteps[0] | null>(null);
  const [viewMode, setViewMode] = useState<'workflow' | 'active'>('workflow');

  const employerSteps = workflowSteps.filter((s) => s.forEmployer);

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
          onClick={() => setViewMode('workflow')}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
            viewMode === 'workflow'
              ? 'bg-expert-navy text-white'
              : 'bg-white text-text-secondary border border-border-light'
          }`}
        >
          워크플로우
        </button>
        <button
          onClick={() => setViewMode('active')}
          className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
            viewMode === 'active'
              ? 'bg-expert-navy text-white'
              : 'bg-white text-text-secondary border border-border-light'
          }`}
        >
          진행중인 채용 ({activeRecruitments.length})
        </button>
      </div>

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

      {/* 진행중인 채용 뷰 */}
      {viewMode === 'active' && (
        <div className="space-y-4">
          {activeRecruitments.map((recruitment) => {
            const currentStep = workflowSteps.find((s) => s.step === recruitment.step);

            return (
              <motion.div
                key={recruitment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 border border-border-light"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-text-primary">{recruitment.title}</h3>
                    <div className="text-xs text-text-tertiary mt-1">
                      {recruitment.createdAt} 등록
                    </div>
                  </div>
                  {recruitment.newApplicants > 0 && (
                    <span className="badge-error">
                      +{recruitment.newApplicants} 신규
                    </span>
                  )}
                </div>

                {/* 진행 상태 */}
                <div className="bg-bg-secondary rounded-xl p-3 mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">현재 단계</span>
                    <span className={`text-sm font-medium ${currentStep?.color.replace('bg-', 'text-')}`}>
                      Step {recruitment.step}: {currentStep?.title}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill bg-expert-navy"
                      style={{ width: `${(recruitment.step / 10) * 100}%` }}
                    />
                  </div>
                </div>

                {/* 통계 */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <Users className="w-4 h-4" />
                    지원자 {recruitment.applicants}명
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2">
                  <Link href={`/employer/ai-interview/pipeline?id=${recruitment.id}`} className="flex-1">
                    <button className="w-full py-2.5 bg-expert-navy text-white rounded-xl text-sm font-medium">
                      지원자 관리
                    </button>
                  </Link>
                  <Link href={`/employer/ai-interview/${currentStep?.id}?id=${recruitment.id}`}>
                    <button className="px-4 py-2.5 border border-expert-navy text-expert-navy rounded-xl text-sm font-medium">
                      계속하기
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}

          {activeRecruitments.length === 0 && (
            <div className="text-center py-12">
              <Briefcase className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
              <div className="text-text-secondary mb-4">진행중인 채용이 없어요</div>
              <Link href="/employer/ai-interview/job-posting">
                <button className="btn-primary">
                  <Play className="w-5 h-5 mr-2" />
                  새 채용 시작하기
                </button>
              </Link>
            </div>
          )}
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
    </div>
  );
}
