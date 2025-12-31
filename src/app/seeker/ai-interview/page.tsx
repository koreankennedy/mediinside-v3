'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  FileText,
  Shield,
  Video,
  MessageCircle,
  Users,
  CheckCircle,
  Lock,
  ChevronRight,
  Sparkles,
  Star,
  Trophy,
  Target,
  TrendingUp,
} from 'lucide-react';

// AI 인터뷰 워크플로우 단계
const workflowSteps = [
  {
    id: 1,
    key: 'resume',
    title: '이력서 제출',
    description: 'AI가 맞춤형 이력서를 작성해드려요',
    icon: FileText,
    color: 'bg-info',
    status: 'completed',
    href: '/seeker/ai-interview/resume',
    completedAt: '12/28 완료',
    result: '이력서 완성도 95%',
  },
  {
    id: 2,
    key: 'verification',
    title: '경력 검증',
    description: '경력과 자격을 검증받으세요',
    icon: Shield,
    color: 'bg-success',
    status: 'completed',
    href: '/seeker/ai-interview/verification',
    completedAt: '12/29 완료',
    result: '검증 완료 - 신뢰도 100%',
  },
  {
    id: 3,
    key: 'practice',
    title: '모의면접 연습',
    description: 'AI와 함께 면접을 연습해보세요',
    icon: MessageCircle,
    color: 'bg-warning',
    status: 'completed',
    href: '/seeker/ai-interview/practice',
    completedAt: '12/30 완료',
    result: '5/5 세션 완료 - 평균 82점',
  },
  {
    id: 4,
    key: 'interview',
    title: 'AI 면접',
    description: '실제 AI 면접을 진행해요',
    icon: Video,
    color: 'bg-brand-mint',
    status: 'completed',
    href: '/seeker/ai-interview/interview',
    completedAt: '12/31 완료',
    result: 'AI 면접 완료 - 종합 87점',
  },
  {
    id: 5,
    key: 'concierge',
    title: 'AI 컨시어지',
    description: 'AI 커리어 코치와 대화하세요',
    icon: Users,
    color: 'bg-expert-navy',
    status: 'completed',
    href: '/seeker/ai-interview/lounge',
    completedAt: '이용 가능',
    result: '커리어 상담 3회 완료',
  },
];

// 내 면접 현황
const myInterviewStatus = {
  practiceScore: 87,
  practiceCount: 5,
  feedbackCount: 5,
  topStrength: '명확한 답변 전달력',
  improvementArea: '구체적 사례 제시',
  aiInterviewScore: 87,
  aiInterviewFeedback: '전반적으로 우수한 면접 태도를 보여주셨습니다.',
};

export default function SeekerAIInterviewPage() {
  const completedSteps = workflowSteps.filter((s) => s.status === 'completed').length;
  const progress = (completedSteps / workflowSteps.length) * 100;

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-dashboard-title">AI 인터뷰</h1>
        <p className="text-sm text-text-secondary mt-1">
          단계별로 면접을 준비하고 진행하세요
        </p>
      </div>

      {/* 진행 현황 */}
      <div className="bg-gradient-to-r from-brand-mint to-brand-mint/80 rounded-2xl p-5 mb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-white/70 mb-1">면접 준비 진행률</div>
            <div className="text-3xl font-bold">{Math.round(progress)}%</div>
            <div className="text-sm text-white/80 mt-1">
              {completedSteps}/{workflowSteps.length} 단계 완료
            </div>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
        </div>
        <div className="progress-bar bg-white/20">
          <div
            className="progress-fill bg-white"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 현재 진행 중인 단계 강조 */}
      {workflowSteps.find((s) => s.status === 'in_progress') && (
        <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5 text-warning" />
            <span className="font-semibold text-warning">지금 진행 중</span>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            모의면접을 완료하면 실제 AI 면접에 참여할 수 있어요. 연습을 통해 면접
            역량을 키워보세요!
          </p>
          <Link href="/seeker/ai-interview/practice">
            <button className="w-full py-3 bg-warning text-white rounded-xl font-medium flex items-center justify-center gap-2">
              <MessageCircle className="w-5 h-5" />
              모의면접 이어하기
            </button>
          </Link>
        </div>
      )}

      {/* 워크플로우 단계 */}
      <section className="mb-6">
        <h2 className="text-section-title mb-3">면접 단계</h2>
        <div className="space-y-3">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            const isLocked = step.status === 'locked';
            const isCompleted = step.status === 'completed';
            const isInProgress = step.status === 'in_progress';

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={isLocked ? '#' : step.href}>
                  <div
                    className={`bg-white rounded-2xl p-4 border transition-all ${
                      isLocked
                        ? 'border-border-light opacity-60'
                        : isInProgress
                        ? 'border-warning shadow-card'
                        : 'border-border-light hover:shadow-card'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isLocked ? 'bg-bg-tertiary' : step.color
                        }`}
                      >
                        {isLocked ? (
                          <Lock className="w-6 h-6 text-text-tertiary" />
                        ) : (
                          <Icon className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-semibold ${
                              isLocked ? 'text-text-tertiary' : 'text-text-primary'
                            }`}
                          >
                            {step.title}
                          </span>
                          {isCompleted && (
                            <CheckCircle className="w-4 h-4 text-success" />
                          )}
                          {isInProgress && (
                            <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded">
                              진행중
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-sm ${
                            isLocked ? 'text-text-tertiary' : 'text-text-secondary'
                          }`}
                        >
                          {step.description}
                        </p>
                        {isCompleted && step.completedAt && (
                          <p className="text-xs text-success mt-1">{step.completedAt}</p>
                        )}
                        {isCompleted && step.result && (
                          <p className="text-xs text-brand-mint mt-1">{step.result}</p>
                        )}
                      </div>
                      {!isLocked && <ChevronRight className="w-5 h-5 text-text-tertiary" />}
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 내 면접 역량 */}
      <section className="mb-6">
        <h2 className="text-section-title mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-brand-mint" />
          내 면접 역량
        </h2>
        <div className="bg-white rounded-2xl p-4 border border-border-light">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-text-secondary">모의면접 평균 점수</div>
              <div className="text-2xl font-bold text-brand-mint">
                {myInterviewStatus.practiceScore}점
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-text-secondary">연습 횟수</div>
              <div className="text-lg font-bold text-expert-navy">
                {myInterviewStatus.practiceCount}회
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-success/10 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Star className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">강점</span>
              </div>
              <p className="text-sm text-text-primary">{myInterviewStatus.topStrength}</p>
            </div>
            <div className="p-3 bg-warning/10 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-warning">개선 포인트</span>
              </div>
              <p className="text-sm text-text-primary">{myInterviewStatus.improvementArea}</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI 코치 넛지 */}
      <div className="bg-expert-navy/5 rounded-2xl p-4 border border-expert-navy/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-expert-navy rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-expert-navy">AI 커리어 코치</div>
            <div className="text-sm text-text-secondary">
              면접 준비에 관해 무엇이든 물어보세요
            </div>
          </div>
        </div>
        <Link href="/seeker/ai-interview/lounge">
          <button className="w-full bg-expert-navy text-white py-3 rounded-xl font-medium">
            AI 코치와 대화하기
          </button>
        </Link>
      </div>
    </div>
  );
}
