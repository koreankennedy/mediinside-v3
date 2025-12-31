'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Sparkles,
  Target,
  TrendingUp,
  Users,
  FileText,
  Image,
  Video,
  MessageSquare,
  ChevronRight,
  Play,
  CheckCircle,
  Star,
  Award,
  Heart,
  Shield,
  Zap,
  BarChart3,
  Eye,
  Share2,
  Bot,
  ArrowRight,
  Edit3,
  Copy,
  Clock,
  X,
  Plus,
} from 'lucide-react';

// 병원 브랜딩 진단 항목
const brandingDiagnostics = [
  {
    id: 'identity',
    label: '병원 아이덴티티',
    score: 75,
    maxScore: 100,
    status: 'good',
    items: ['미션/비전', '핵심 가치', '차별화 포인트'],
  },
  {
    id: 'culture',
    label: '조직 문화',
    score: 60,
    maxScore: 100,
    status: 'warning',
    items: ['근무 환경', '팀 분위기', '성장 기회'],
  },
  {
    id: 'benefits',
    label: '복리후생',
    score: 85,
    maxScore: 100,
    status: 'excellent',
    items: ['급여 경쟁력', '워라밸', '부가 혜택'],
  },
  {
    id: 'content',
    label: '채용 콘텐츠',
    score: 40,
    maxScore: 100,
    status: 'poor',
    items: ['채용 공고', 'SNS 콘텐츠', '직원 인터뷰'],
  },
];

// 브랜딩 콘텐츠 타입
const contentTypes = [
  { id: 'card-news', label: '카드뉴스', icon: Image, count: 3 },
  { id: 'video', label: '영상 스크립트', icon: Video, count: 1 },
  { id: 'interview', label: '직원 인터뷰', icon: MessageSquare, count: 2 },
  { id: 'job-posting', label: '채용 공고', icon: FileText, count: 4 },
];

// 사전 작성된 콘텐츠 템플릿
const prewrittenContents = [
  {
    id: 'template-1',
    type: 'card-news',
    title: '우리 병원이 특별한 이유',
    preview: '강남스마일치과는 환자와 직원 모두가 행복한 병원을 지향합니다...',
    status: 'ready',
    thumbnail: 'culture',
  },
  {
    id: 'template-2',
    type: 'interview',
    title: '3년차 김OO 위생사 인터뷰',
    preview: '"워라밸이 정말 좋아요. 정시 퇴근은 기본이고..."',
    status: 'ready',
    thumbnail: 'interview',
  },
  {
    id: 'template-3',
    type: 'job-posting',
    title: '치과위생사 채용 공고',
    preview: '함께 성장할 치과위생사를 찾습니다. 경력 3년 이상...',
    status: 'draft',
    thumbnail: 'job',
  },
  {
    id: 'template-4',
    type: 'video',
    title: '병원 소개 영상 스크립트',
    preview: '"안녕하세요, 강남스마일치과입니다. 저희 병원은..."',
    status: 'ready',
    thumbnail: 'video',
  },
];

// 브랜딩 인사이트
const brandingInsights = [
  {
    type: 'opportunity',
    message: '조직문화 콘텐츠를 추가하면 지원율이 25% 높아질 수 있어요',
    action: '콘텐츠 만들기',
    href: '/employer/ai-interview/branding',
  },
  {
    type: 'benchmark',
    message: '강남 지역 동종 병원 대비 복리후생 경쟁력이 높아요!',
    action: '상세 보기',
    href: '#',
  },
  {
    type: 'tip',
    message: '직원 인터뷰 콘텐츠가 있는 병원은 신뢰도가 35% 높아요',
    action: '인터뷰 만들기',
    href: '/employer/ai-interview/branding',
  },
];

// 내 콘텐츠 상세 데이터
const myContentsData: Record<string, Array<{id: string; title: string; createdAt: string; status: string}>> = {
  'card-news': [
    { id: 'my-1', title: '우리 병원 소개 카드뉴스', createdAt: '2024.01.10', status: 'published' },
    { id: 'my-2', title: '신규 채용 안내', createdAt: '2024.01.08', status: 'draft' },
    { id: 'my-3', title: '직원 복지 소개', createdAt: '2024.01.05', status: 'published' },
  ],
  'video': [
    { id: 'my-4', title: '병원 소개 영상 스크립트', createdAt: '2024.01.12', status: 'published' },
  ],
  'interview': [
    { id: 'my-5', title: '3년차 김OO 위생사 인터뷰', createdAt: '2024.01.11', status: 'published' },
    { id: 'my-6', title: '신입 박OO 간호사 인터뷰', createdAt: '2024.01.03', status: 'draft' },
  ],
  'job-posting': [
    { id: 'my-7', title: '치과위생사 채용 공고', createdAt: '2024.01.15', status: 'published' },
    { id: 'my-8', title: '간호사 채용 공고', createdAt: '2024.01.14', status: 'published' },
    { id: 'my-9', title: '코디네이터 채용 공고', createdAt: '2024.01.10', status: 'draft' },
    { id: 'my-10', title: '리셉션 채용 공고', createdAt: '2024.01.08', status: 'published' },
  ],
};

export default function BrandingCenterPage() {
  const [showDiagnosisDetail, setShowDiagnosisDetail] = useState<string | null>(null);
  const [showContentPreview, setShowContentPreview] = useState<typeof prewrittenContents[0] | null>(null);
  const [showMyContentList, setShowMyContentList] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<{title: string; preview: string} | null>(null);

  const totalScore = Math.round(
    brandingDiagnostics.reduce((sum, d) => sum + d.score, 0) / brandingDiagnostics.length
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'text-success';
      case 'good':
        return 'text-brand-mint';
      case 'warning':
        return 'text-warning';
      case 'poor':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'excellent':
        return 'bg-success';
      case 'good':
        return 'bg-brand-mint';
      case 'warning':
        return 'bg-warning';
      case 'poor':
        return 'bg-error';
      default:
        return 'bg-text-tertiary';
    }
  };

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-dashboard-title">브랜딩 센터</h1>
        <p className="text-sm text-text-secondary mt-1">
          우리 병원의 채용 브랜드를 강화하세요
        </p>
      </div>

      {/* 빠른 시작 - 처음 사용자용 */}
      <div className="bg-brand-mint/5 border border-brand-mint/20 rounded-2xl p-4 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 bg-brand-mint rounded-xl flex items-center justify-center flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-text-primary">빠르게 시작하기</div>
            <p className="text-sm text-text-secondary mt-1">
              어디서부터 시작해야 할지 모르겠다면?
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/employer/branding/diagnosis">
            <button className="w-full py-3 bg-brand-mint text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
              <Target className="w-4 h-4" />
              진단부터 시작
            </button>
          </Link>
          <Link href="/employer/ai-interview/branding">
            <button className="w-full py-3 bg-expert-navy text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4" />
              바로 콘텐츠 생성
            </button>
          </Link>
        </div>
      </div>

      {/* 브랜딩 종합 점수 */}
      <div className="bg-gradient-to-r from-expert-navy to-expert-navy/80 rounded-2xl p-5 mb-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-sm text-white/70 mb-1">채용 브랜딩 점수</div>
            <div className="text-4xl font-bold">{totalScore}점</div>
            <div className="text-sm text-white/80 mt-1">상위 25% 병원</div>
          </div>
          <div className="w-20 h-20 relative">
            <svg className="w-full h-full -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="#00C7BE"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(totalScore / 100) * 226} 226`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Award className="w-8 h-8 text-match-gold" />
            </div>
          </div>
        </div>
        <Link href="/employer/branding/diagnosis">
          <button className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
            <Target className="w-5 h-5" />
            브랜딩 진단 시작하기
          </button>
        </Link>
      </div>

      {/* 브랜딩 진단 상세 */}
      <section className="mb-6">
        <h2 className="text-section-title mb-3 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-expert-navy" />
          브랜딩 진단 현황
        </h2>
        <div className="space-y-3">
          {brandingDiagnostics.map((diagnostic) => (
            <motion.div
              key={diagnostic.id}
              onClick={() =>
                setShowDiagnosisDetail(
                  showDiagnosisDetail === diagnostic.id ? null : diagnostic.id
                )
              }
              className="bg-white rounded-2xl p-4 border border-border-light cursor-pointer hover:shadow-card transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-text-primary">{diagnostic.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${getStatusColor(diagnostic.status)}`}>
                    {diagnostic.score}점
                  </span>
                  <ChevronRight
                    className={`w-4 h-4 text-text-tertiary transition-transform ${
                      showDiagnosisDetail === diagnostic.id ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className={`progress-fill ${getStatusBg(diagnostic.status)}`}
                  style={{ width: `${diagnostic.score}%` }}
                />
              </div>

              <AnimatePresence>
                {showDiagnosisDetail === diagnostic.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 mt-3 border-t border-border-light">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {diagnostic.items.map((item) => (
                          <span
                            key={item}
                            className="text-xs bg-bg-secondary text-text-secondary px-2 py-1 rounded"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                      {diagnostic.status === 'poor' && (
                        <Link href="/employer/ai-interview/branding">
                          <button className="w-full py-2 bg-expert-navy text-white rounded-lg text-sm font-medium">
                            AI로 콘텐츠 생성하기
                          </button>
                        </Link>
                      )}
                      {diagnostic.status === 'warning' && (
                        <div className="text-xs text-warning flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          조금만 보완하면 우수 등급이 될 수 있어요!
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI 인사이트 */}
      <section className="mb-6">
        <h2 className="text-section-title mb-3 flex items-center gap-2">
          <Bot className="w-5 h-5 text-brand-mint" />
          AI 브랜딩 인사이트
        </h2>
        <div className="space-y-3">
          {brandingInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 border border-border-light"
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    insight.type === 'opportunity'
                      ? 'bg-brand-mint/10'
                      : insight.type === 'benchmark'
                      ? 'bg-success/10'
                      : 'bg-warning/10'
                  }`}
                >
                  {insight.type === 'opportunity' ? (
                    <TrendingUp className="w-4 h-4 text-brand-mint" />
                  ) : insight.type === 'benchmark' ? (
                    <Award className="w-4 h-4 text-success" />
                  ) : (
                    <Sparkles className="w-4 h-4 text-warning" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-text-primary mb-2">{insight.message}</p>
                  <Link href={insight.href}>
                    <span className="text-xs text-expert-navy font-medium flex items-center gap-1">
                      {insight.action} <ArrowRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 내 콘텐츠 라이브러리 */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-section-title flex items-center gap-2">
            <FileText className="w-5 h-5 text-expert-navy" />
            내 콘텐츠
          </h2>
          <Link href="/employer/ai-interview/branding" className="text-sm text-expert-navy flex items-center gap-1">
            <Plus className="w-4 h-4" />
            새로 만들기
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {contentTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setShowMyContentList(type.id)}
              className="bg-white rounded-2xl p-4 border border-border-light text-left hover:shadow-card transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <type.icon className="w-5 h-5 text-expert-navy" />
                <span className="text-xs bg-bg-secondary text-text-tertiary px-2 py-0.5 rounded">
                  {type.count}개
                </span>
              </div>
              <div className="font-medium text-text-primary text-sm">{type.label}</div>
              <div className="text-xs text-text-tertiary mt-1">클릭하여 보기</div>
            </button>
          ))}
        </div>
      </section>

      {/* AI가 사전 작성한 콘텐츠 */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-section-title flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-mint" />
            AI 사전 작성 콘텐츠
          </h2>
          <span className="text-xs text-brand-mint bg-brand-mint/10 px-2 py-1 rounded-full">
            {prewrittenContents.filter(c => c.status === 'ready').length}개 준비됨
          </span>
        </div>
        <p className="text-sm text-text-secondary mb-3">
          병원 정보를 기반으로 AI가 미리 작성한 콘텐츠예요
        </p>
        <div className="space-y-3">
          {prewrittenContents.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl p-4 border border-border-light"
            >
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  content.status === 'ready' ? 'bg-brand-mint/10' : 'bg-warning/10'
                }`}>
                  {content.type === 'card-news' && <Image className={`w-6 h-6 ${content.status === 'ready' ? 'text-brand-mint' : 'text-warning'}`} />}
                  {content.type === 'interview' && <MessageSquare className={`w-6 h-6 ${content.status === 'ready' ? 'text-brand-mint' : 'text-warning'}`} />}
                  {content.type === 'job-posting' && <FileText className={`w-6 h-6 ${content.status === 'ready' ? 'text-brand-mint' : 'text-warning'}`} />}
                  {content.type === 'video' && <Video className={`w-6 h-6 ${content.status === 'ready' ? 'text-brand-mint' : 'text-warning'}`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium text-text-primary truncate">{content.title}</h3>
                    {content.status === 'ready' ? (
                      <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded-full flex-shrink-0">
                        완성
                      </span>
                    ) : (
                      <span className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full flex-shrink-0 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        초안
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-text-secondary line-clamp-2">{content.preview}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-border-light">
                <button
                  onClick={() => setShowContentPreview(content)}
                  className="flex-1 py-2 text-sm text-text-primary border border-border-light rounded-lg flex items-center justify-center gap-1 hover:bg-bg-secondary transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  미리보기
                </button>
                <button
                  onClick={() => setEditingContent({ title: content.title, preview: content.preview })}
                  className="flex-1 py-2 text-sm text-expert-navy bg-expert-navy/5 rounded-lg flex items-center justify-center gap-1 hover:bg-expert-navy/10 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  수정하기
                </button>
                {content.status === 'ready' && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(content.preview);
                      alert('콘텐츠가 클립보드에 복사되었습니다!');
                    }}
                    className="py-2 px-3 text-sm text-brand-mint bg-brand-mint/5 rounded-lg flex items-center justify-center gap-1 hover:bg-brand-mint/10 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <Link href="/employer/ai-interview/branding">
          <button className="w-full mt-3 py-3 border border-expert-navy text-expert-navy rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-expert-navy/5 transition-colors">
            <Sparkles className="w-5 h-5" />
            새 콘텐츠 생성하기
          </button>
        </Link>
      </section>

      {/* 채용 브랜딩 효과 */}
      <section className="mb-6">
        <h2 className="text-section-title mb-3 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-success" />
          브랜딩 효과
        </h2>
        <div className="bg-white rounded-2xl p-4 border border-border-light">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-expert-navy">+45%</div>
              <div className="text-xs text-text-tertiary">지원자 증가</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-brand-mint">+32%</div>
              <div className="text-xs text-text-tertiary">프로필 조회</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-success">-2.3일</div>
              <div className="text-xs text-text-tertiary">채용 기간</div>
            </div>
          </div>
        </div>
      </section>

      {/* 브랜딩 시작 CTA */}
      <div className="bg-expert-navy/5 rounded-2xl p-4 border border-expert-navy/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-expert-navy rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="font-semibold text-expert-navy">AI 채용 브랜딩 시작하기</div>
            <div className="text-sm text-text-secondary">
              5분 만에 매력적인 채용 콘텐츠를 만들어보세요
            </div>
          </div>
        </div>
        <Link href="/employer/ai-interview/branding">
          <button className="w-full bg-expert-navy text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
            <Play className="w-5 h-5" />
            콘텐츠 생성하기
          </button>
        </Link>
      </div>

      {/* 콘텐츠 미리보기 모달 */}
      <AnimatePresence>
        {showContentPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowContentPreview(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-border-light px-4 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-expert-navy">{showContentPreview.title}</h3>
                <button
                  onClick={() => setShowContentPreview(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary"
                >
                  <X className="w-5 h-5 text-text-primary" />
                </button>
              </div>
              <div className="p-6">
                <div className="bg-bg-secondary rounded-2xl p-6 mb-6">
                  <p className="text-text-primary whitespace-pre-line leading-relaxed">
                    {showContentPreview.preview}
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setEditingContent({ title: showContentPreview.title, preview: showContentPreview.preview });
                      setShowContentPreview(null);
                    }}
                    className="flex-1 py-3 bg-expert-navy text-white rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <Edit3 className="w-5 h-5" />
                    수정하기
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(showContentPreview.preview);
                      alert('콘텐츠가 클립보드에 복사되었습니다!');
                    }}
                    className="flex-1 py-3 border border-border-light rounded-xl font-medium text-text-primary flex items-center justify-center gap-2"
                  >
                    <Copy className="w-5 h-5" />
                    복사하기
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 콘텐츠 수정 모달 */}
      <AnimatePresence>
        {editingContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setEditingContent(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-border-light px-4 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-expert-navy">콘텐츠 수정</h3>
                <button
                  onClick={() => setEditingContent(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary"
                >
                  <X className="w-5 h-5 text-text-primary" />
                </button>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <label className="text-sm font-medium text-text-primary block mb-2">제목</label>
                  <input
                    type="text"
                    value={editingContent.title}
                    onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
                    className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary"
                  />
                </div>
                <div className="mb-6">
                  <label className="text-sm font-medium text-text-primary block mb-2">내용</label>
                  <textarea
                    value={editingContent.preview}
                    onChange={(e) => setEditingContent({ ...editingContent, preview: e.target.value })}
                    rows={10}
                    className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary resize-none"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setEditingContent(null)}
                    className="flex-1 py-3 border border-border-light rounded-xl font-medium text-text-primary"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      alert('콘텐츠가 저장되었습니다!');
                      setEditingContent(null);
                    }}
                    className="flex-1 py-3 bg-expert-navy text-white rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    저장하기
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 내 콘텐츠 리스트 모달 */}
      <AnimatePresence>
        {showMyContentList && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowMyContentList(null)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-3xl max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-border-light px-4 py-4 flex items-center justify-between">
                <h3 className="text-lg font-bold text-expert-navy">
                  {contentTypes.find(t => t.id === showMyContentList)?.label} 목록
                </h3>
                <button
                  onClick={() => setShowMyContentList(null)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary"
                >
                  <X className="w-5 h-5 text-text-primary" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {myContentsData[showMyContentList]?.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-border-light"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-text-primary">{item.title}</h4>
                        <div className="text-xs text-text-tertiary mt-1">{item.createdAt}</div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'published'
                          ? 'bg-success/10 text-success'
                          : 'bg-warning/10 text-warning'
                      }`}>
                        {item.status === 'published' ? '게시됨' : '임시저장'}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button className="flex-1 py-2 text-sm text-text-primary border border-border-light rounded-lg flex items-center justify-center gap-1">
                        <Eye className="w-4 h-4" />
                        보기
                      </button>
                      <button className="flex-1 py-2 text-sm text-expert-navy bg-expert-navy/5 rounded-lg flex items-center justify-center gap-1">
                        <Edit3 className="w-4 h-4" />
                        수정
                      </button>
                    </div>
                  </div>
                ))}
                {(!myContentsData[showMyContentList] || myContentsData[showMyContentList].length === 0) && (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
                    <div className="text-text-secondary">아직 작성한 콘텐츠가 없어요</div>
                    <Link href="/employer/ai-interview/branding">
                      <button className="mt-4 px-6 py-2 bg-expert-navy text-white rounded-xl text-sm font-medium">
                        새 콘텐츠 만들기
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
