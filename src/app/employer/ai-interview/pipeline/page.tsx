'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Filter,
  Search,
  MoreVertical,
  Star,
  Video,
  FileText,
  MessageCircle,
  Calendar,
  Phone,
  Mail,
  Award,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Play,
} from 'lucide-react';
import Link from 'next/link';

const pipelineStages = [
  { id: 'new', label: '신규 지원', color: 'bg-info', count: 5 },
  { id: 'screening', label: 'AI면접 진행', color: 'bg-warning', count: 3 },
  { id: 'interview', label: '2차면접 예정', color: 'bg-brand-mint', count: 2 },
  { id: 'offer', label: '오퍼 발송', color: 'bg-success', count: 1 },
  { id: 'rejected', label: '불합격', color: 'bg-text-tertiary', count: 2 },
];

const mockApplicants = [
  {
    id: 'app-1',
    name: '김민지',
    position: '치과위생사',
    experience: '3년차',
    stage: 'new',
    appliedAt: '2시간 전',
    matchScore: 92,
    resumeVerified: true,
    isTop: true,
  },
  {
    id: 'app-2',
    name: '이서연',
    position: '치과위생사',
    experience: '5년차',
    stage: 'new',
    appliedAt: '5시간 전',
    matchScore: 88,
    resumeVerified: true,
    isTop: false,
  },
  {
    id: 'app-3',
    name: '박지현',
    position: '간호사',
    experience: '2년차',
    stage: 'new',
    appliedAt: '1일 전',
    matchScore: 85,
    resumeVerified: false,
    isTop: false,
  },
  {
    id: 'app-4',
    name: '최수아',
    position: '치과위생사',
    experience: '4년차',
    stage: 'screening',
    appliedAt: '2일 전',
    matchScore: 90,
    aiScore: 85,
    resumeVerified: true,
    isTop: true,
  },
  {
    id: 'app-5',
    name: '정유진',
    position: '치과위생사',
    experience: '3년차',
    stage: 'screening',
    appliedAt: '3일 전',
    matchScore: 82,
    aiScore: 78,
    resumeVerified: true,
    isTop: false,
  },
  {
    id: 'app-6',
    name: '한소희',
    position: '간호사',
    experience: '6년차',
    stage: 'interview',
    appliedAt: '5일 전',
    matchScore: 95,
    aiScore: 92,
    interviewDate: '내일 14:00',
    resumeVerified: true,
    isTop: true,
  },
  {
    id: 'app-7',
    name: '강예린',
    position: '치과위생사',
    experience: '4년차',
    stage: 'offer',
    appliedAt: '1주 전',
    matchScore: 91,
    aiScore: 88,
    offerStatus: '검토중',
    resumeVerified: true,
    isTop: true,
  },
];

export default function PipelinePage() {
  const router = useRouter();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('list');

  // 지원자 클릭 시 바로 상세페이지로 이동
  const handleApplicantClick = (applicant: (typeof mockApplicants)[0]) => {
    // 단계에 따라 적절한 페이지로 이동
    if (applicant.stage === 'screening' && applicant.aiScore) {
      router.push(`/employer/candidates/${applicant.id}?tab=ai-report`);
    } else if (applicant.stage === 'interview') {
      router.push(`/employer/ai-interview/copilot?id=${applicant.id}`);
    } else if (applicant.stage === 'offer') {
      router.push(`/employer/ai-interview/offer?id=${applicant.id}`);
    } else {
      router.push(`/employer/candidates/${applicant.id}`);
    }
  };

  const filteredApplicants = selectedStage
    ? mockApplicants.filter((a) => a.stage === selectedStage)
    : mockApplicants;

  const getStageApplicants = (stageId: string) =>
    mockApplicants.filter((a) => a.stage === stageId);

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
        >
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold text-expert-navy">지원자 관리</h1>
          <p className="text-sm text-text-secondary">
            총 {mockApplicants.length}명의 지원자
          </p>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary">
          <Filter className="w-5 h-5 text-text-primary" />
        </button>
      </div>

      {/* 검색 */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
        <input
          type="text"
          placeholder="이름, 포지션으로 검색"
          className="w-full pl-12 pr-4 py-3 bg-white border border-border-light rounded-xl text-sm"
        />
      </div>

      {/* 파이프라인 단계 */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
        <button
          onClick={() => setSelectedStage(null)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            !selectedStage
              ? 'bg-expert-navy text-white'
              : 'bg-white text-text-secondary border border-border-light'
          }`}
        >
          전체 ({mockApplicants.length})
        </button>
        {pipelineStages.slice(0, 4).map((stage) => (
          <button
            key={stage.id}
            onClick={() => setSelectedStage(stage.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedStage === stage.id
                ? 'bg-expert-navy text-white'
                : 'bg-white text-text-secondary border border-border-light'
            }`}
          >
            {stage.label} ({getStageApplicants(stage.id).length})
          </button>
        ))}
      </div>

      {/* 요약 카드 */}
      <div className="bg-expert-navy/5 rounded-2xl p-4 mb-4 border border-expert-navy/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-text-secondary">AI 추천 TOP 지원자</div>
            <div className="text-lg font-bold text-expert-navy mt-1">
              {mockApplicants.filter((a) => a.isTop).length}명
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-tertiary">응답률</span>
            <span className="text-lg font-bold text-brand-mint">78%</span>
          </div>
        </div>
      </div>

      {/* 지원자 리스트 */}
      <div className="space-y-3">
        {filteredApplicants.map((applicant, index) => {
          const stage = pipelineStages.find((s) => s.id === applicant.stage);

          return (
            <motion.div
              key={applicant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleApplicantClick(applicant)}
              className="bg-white rounded-2xl p-4 border border-border-light cursor-pointer hover:shadow-card transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-expert-navy/10 rounded-full flex items-center justify-center relative">
                    <Users className="w-6 h-6 text-expert-navy" />
                    {applicant.isTop && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-match-gold rounded-full flex items-center justify-center">
                        <Star className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-text-primary">{applicant.name}</span>
                      {applicant.resumeVerified && (
                        <CheckCircle className="w-4 h-4 text-success" />
                      )}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {applicant.position} · {applicant.experience}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-brand-mint">{applicant.matchScore}%</div>
                  <div className="text-xs text-text-tertiary">매칭</div>
                </div>
              </div>

              {/* 상태 및 점수 */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${stage?.color} text-white px-2 py-0.5 rounded`}>
                    {stage?.label}
                  </span>
                  <span className="text-xs text-text-tertiary">{applicant.appliedAt}</span>
                </div>
                {applicant.aiScore && (
                  <div className="flex items-center gap-1 text-xs text-text-secondary">
                    <Video className="w-3 h-3" />
                    AI면접 {applicant.aiScore}점
                  </div>
                )}
                {applicant.interviewDate && (
                  <div className="flex items-center gap-1 text-xs text-success">
                    <Calendar className="w-3 h-3" />
                    {applicant.interviewDate}
                  </div>
                )}
              </div>

              {/* 빠른 액션 */}
              {applicant.stage === 'new' && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-border-light">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('AI 면접 초대를 보냈습니다!');
                    }}
                    className="flex-1 py-2 bg-expert-navy text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1"
                  >
                    <Video className="w-4 h-4" />
                    AI면접 초대
                  </button>
                  <Link
                    href={`/employer/candidates/${applicant.id}`}
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="w-full py-2 border border-border-light rounded-lg text-sm text-text-secondary">
                      이력서
                    </button>
                  </Link>
                </div>
              )}
              {applicant.stage === 'screening' && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-border-light">
                  <Link
                    href={`/employer/candidates/${applicant.id}?tab=ai-report`}
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="w-full py-2 bg-expert-navy text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                      <FileText className="w-4 h-4" />
                      AI면접 리포트
                    </button>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      alert('2차 면접을 예약합니다!');
                    }}
                    className="flex-1 py-2 border border-expert-navy text-expert-navy rounded-lg text-sm font-medium"
                  >
                    2차면접 예약
                  </button>
                </div>
              )}
              {applicant.stage === 'interview' && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-border-light">
                  <Link
                    href={`/employer/ai-interview/copilot?id=${applicant.id}`}
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="w-full py-2 bg-success text-white rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                      <Play className="w-4 h-4" />
                      면접 코파일럿
                    </button>
                  </Link>
                  <Link
                    href={`/employer/ai-interview/offer?id=${applicant.id}`}
                    className="flex-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="w-full py-2 border border-success text-success rounded-lg text-sm font-medium">
                      오퍼 발송
                    </button>
                  </Link>
                </div>
              )}
              {applicant.stage === 'offer' && (
                <div className="mt-3 pt-3 border-t border-border-light">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-text-secondary">오퍼 상태</span>
                    <span className="font-medium text-warning">{applicant.offerStatus}</span>
                  </div>
                  <Link
                    href={`/employer/ai-interview/offer?id=${applicant.id}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="w-full py-2 bg-success/10 text-success rounded-lg text-sm font-medium">
                      오퍼 상세 보기
                    </button>
                  </Link>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filteredApplicants.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
          <div className="text-text-secondary">해당 단계의 지원자가 없어요</div>
        </div>
      )}

      {/* AI 인사이트 */}
      <div className="fixed bottom-20 left-4 right-4">
        <div className="bg-white rounded-2xl p-4 border border-border-light shadow-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-expert-navy rounded-xl flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-medium text-expert-navy mb-1">AI 인사이트</div>
              <p className="text-xs text-text-secondary">
                김민지님은 매칭률 92%로 가장 적합한 후보예요.
                <br />
                빠른 AI면접 초대를 권장드려요!
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
