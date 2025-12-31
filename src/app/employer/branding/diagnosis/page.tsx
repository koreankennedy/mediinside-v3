'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Sparkles,
  Target,
  Award,
  TrendingUp,
  AlertCircle,
  Bot,
  Building2,
  Users,
  Heart,
  DollarSign,
  Clock,
  Star,
  FileText,
  BarChart3,
} from 'lucide-react';

// 진단 질문 데이터
const diagnosisQuestions = [
  {
    id: 1,
    category: 'identity',
    categoryLabel: '병원 아이덴티티',
    question: '우리 병원만의 차별화된 강점이 있나요?',
    options: [
      { label: '명확하게 정의되어 있고 직원들도 알고 있다', score: 100 },
      { label: '어느 정도 정의되어 있다', score: 70 },
      { label: '아직 명확하지 않다', score: 40 },
      { label: '생각해본 적 없다', score: 10 },
    ],
  },
  {
    id: 2,
    category: 'identity',
    categoryLabel: '병원 아이덴티티',
    question: '병원의 미션과 비전이 정립되어 있나요?',
    options: [
      { label: '미션/비전이 있고, 채용 공고에도 활용한다', score: 100 },
      { label: '미션/비전은 있지만 활용하지 않는다', score: 60 },
      { label: '아직 정립되지 않았다', score: 20 },
    ],
  },
  {
    id: 3,
    category: 'culture',
    categoryLabel: '조직 문화',
    question: '팀 분위기를 어떻게 표현할 수 있나요?',
    options: [
      { label: '화목하고 서로 돕는 분위기', score: 100 },
      { label: '업무 중심으로 효율적', score: 70 },
      { label: '각자 맡은 일을 하는 편', score: 40 },
      { label: '개선이 필요하다', score: 10 },
    ],
  },
  {
    id: 4,
    category: 'culture',
    categoryLabel: '조직 문화',
    question: '직원들의 성장을 위해 어떤 지원을 하나요?',
    options: [
      { label: '교육 지원, 세미나, 자격증 취득 지원 등 다양하게', score: 100 },
      { label: '필요시 교육 지원을 한다', score: 70 },
      { label: '특별한 지원은 없다', score: 30 },
    ],
  },
  {
    id: 5,
    category: 'benefits',
    categoryLabel: '복리후생',
    question: '급여 수준은 어떤가요?',
    options: [
      { label: '동종 업계 평균보다 높다', score: 100 },
      { label: '업계 평균 수준이다', score: 70 },
      { label: '평균보다 낮지만 다른 혜택으로 보완', score: 50 },
      { label: '평균보다 낮은 편이다', score: 20 },
    ],
  },
  {
    id: 6,
    category: 'benefits',
    categoryLabel: '복리후생',
    question: '워라밸(Work-Life Balance)은 어떤가요?',
    options: [
      { label: '정시 퇴근이 기본, 연차 사용 자유로움', score: 100 },
      { label: '대체로 정시 퇴근, 연차 사용 가능', score: 75 },
      { label: '야근이 가끔 있지만 합리적', score: 50 },
      { label: '야근이 잦은 편이다', score: 20 },
    ],
  },
  {
    id: 7,
    category: 'content',
    categoryLabel: '채용 콘텐츠',
    question: '채용 공고는 어떻게 작성하고 있나요?',
    options: [
      { label: '병원 소개, 업무 내용, 복리후생을 상세히 작성', score: 100 },
      { label: '기본적인 정보 위주로 작성', score: 60 },
      { label: '최소한의 정보만 작성', score: 30 },
    ],
  },
  {
    id: 8,
    category: 'content',
    categoryLabel: '채용 콘텐츠',
    question: '채용 관련 SNS나 콘텐츠를 운영하고 있나요?',
    options: [
      { label: '정기적으로 병원 소식, 직원 이야기를 공유', score: 100 },
      { label: '가끔 게시물을 올린다', score: 60 },
      { label: '거의 운영하지 않는다', score: 20 },
    ],
  },
];

// 카테고리별 아이콘
const categoryIcons: Record<string, typeof Building2> = {
  identity: Building2,
  culture: Users,
  benefits: Heart,
  content: FileText,
};

export default function BrandingDiagnosisPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResult, setShowResult] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const currentQuestion = diagnosisQuestions[currentStep];
  const totalQuestions = diagnosisQuestions.length;
  const progress = ((currentStep + 1) / totalQuestions) * 100;

  const handleAnswer = (score: number) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: score }));

    if (currentStep < totalQuestions - 1) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    } else {
      setIsAnalyzing(true);
      setTimeout(() => {
        setIsAnalyzing(false);
        setShowResult(true);
      }, 2000);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 카테고리별 점수 계산
  const calculateCategoryScores = () => {
    const categories: Record<string, { total: number; count: number }> = {};

    diagnosisQuestions.forEach((q) => {
      if (!categories[q.category]) {
        categories[q.category] = { total: 0, count: 0 };
      }
      if (answers[q.id] !== undefined) {
        categories[q.category].total += answers[q.id];
        categories[q.category].count += 1;
      }
    });

    return Object.entries(categories).map(([key, value]) => ({
      category: key,
      label: diagnosisQuestions.find((q) => q.category === key)?.categoryLabel || key,
      score: Math.round(value.total / value.count),
    }));
  };

  const categoryScores = calculateCategoryScores();
  const totalScore = Math.round(
    categoryScores.reduce((sum, c) => sum + c.score, 0) / categoryScores.length
  );

  const getScoreLevel = (score: number) => {
    if (score >= 80) return { label: '우수', color: 'text-success', bgColor: 'bg-success' };
    if (score >= 60) return { label: '양호', color: 'text-brand-mint', bgColor: 'bg-brand-mint' };
    if (score >= 40) return { label: '보통', color: 'text-warning', bgColor: 'bg-warning' };
    return { label: '개선필요', color: 'text-error', bgColor: 'bg-error' };
  };

  // 분석 중 화면
  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 bg-expert-navy rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Bot className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-xl font-bold text-expert-navy mb-2">AI가 분석 중이에요</h2>
          <p className="text-text-secondary">병원 브랜딩 현황을 진단하고 있습니다...</p>
        </div>
      </div>
    );
  }

  // 결과 화면
  if (showResult) {
    const level = getScoreLevel(totalScore);

    return (
      <div className="min-h-screen bg-bg-secondary pb-24">
        {/* Header */}
        <div className="bg-expert-navy text-white px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => router.back()}>
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold">브랜딩 진단 결과</h1>
          </div>
          <div className="bg-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-white/70 text-sm mb-1">종합 브랜딩 점수</div>
                <div className="text-5xl font-bold">{totalScore}점</div>
                <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${level.bgColor}`}>
                  {level.label}
                </div>
              </div>
              <div className="w-24 h-24 relative">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="10"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#00C7BE"
                    strokeWidth="10"
                    fill="none"
                    strokeDasharray={`${(totalScore / 100) * 251} 251`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="w-10 h-10 text-match-gold" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* 카테고리별 점수 */}
          <section>
            <h2 className="text-section-title mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-expert-navy" />
              영역별 진단 결과
            </h2>
            <div className="space-y-3">
              {categoryScores.map((cat) => {
                const catLevel = getScoreLevel(cat.score);
                const Icon = categoryIcons[cat.category] || Building2;

                return (
                  <motion.div
                    key={cat.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-2xl p-4 border border-border-light"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-expert-navy/10 rounded-xl flex items-center justify-center">
                          <Icon className="w-5 h-5 text-expert-navy" />
                        </div>
                        <span className="font-medium text-text-primary">{cat.label}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${catLevel.color}`}>{cat.score}점</span>
                        <span className={`text-xs px-2 py-0.5 rounded ${catLevel.bgColor} text-white`}>
                          {catLevel.label}
                        </span>
                      </div>
                    </div>
                    <div className="progress-bar">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${cat.score}%` }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className={`progress-fill ${catLevel.bgColor}`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>

          {/* AI 분석 및 추천 */}
          <section>
            <h2 className="text-section-title mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-mint" />
              AI 개선 추천
            </h2>
            <div className="space-y-3">
              {categoryScores
                .filter((c) => c.score < 70)
                .map((cat, index) => (
                  <motion.div
                    key={cat.category}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-warning/10 border border-warning/20 rounded-2xl p-4"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="font-medium text-text-primary mb-1">
                          {cat.label} 영역 개선 필요
                        </div>
                        <p className="text-sm text-text-secondary mb-3">
                          {cat.category === 'identity' &&
                            '병원의 차별화된 강점과 미션/비전을 명확히 정의해보세요. 지원자에게 우리 병원만의 매력을 전달할 수 있어요.'}
                          {cat.category === 'culture' &&
                            '조직 문화와 성장 기회를 강조해보세요. 요즘 구직자들은 급여 못지않게 성장 가능성을 중요하게 생각해요.'}
                          {cat.category === 'benefits' &&
                            '복리후생 정보를 더 상세하게 공개해보세요. 워라밸과 실질적인 혜택이 지원 결정에 큰 영향을 미쳐요.'}
                          {cat.category === 'content' &&
                            '채용 콘텐츠를 강화해보세요. AI가 매력적인 채용 공고와 직원 인터뷰 콘텐츠를 만들어드려요.'}
                        </p>
                        <Link href="/employer/ai-interview/branding">
                          <button className="text-sm text-warning font-medium flex items-center gap-1">
                            AI로 개선하기 <ArrowRight className="w-4 h-4" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}

              {categoryScores.filter((c) => c.score >= 70).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-success/10 border border-success/20 rounded-2xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-text-primary mb-1">잘하고 있어요!</div>
                      <p className="text-sm text-text-secondary">
                        {categoryScores
                          .filter((c) => c.score >= 70)
                          .map((c) => c.label)
                          .join(', ')}{' '}
                        영역이 우수해요. 이 강점을 채용 콘텐츠에 적극 활용해보세요.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {/* 비교 벤치마크 */}
          <section>
            <h2 className="text-section-title mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-info" />
              시장 비교
            </h2>
            <div className="bg-white rounded-2xl p-4 border border-border-light">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">우리 병원</span>
                  <span className="font-bold text-expert-navy">{totalScore}점</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">동종 업계 평균</span>
                  <span className="font-bold text-text-tertiary">62점</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">상위 10% 병원</span>
                  <span className="font-bold text-success">85점</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border-light">
                <p className="text-sm text-text-secondary">
                  {totalScore >= 62 ? (
                    <>
                      <span className="text-success font-medium">평균 이상!</span> 상위{' '}
                      {Math.max(10, Math.round(100 - totalScore))}%에 해당해요.
                    </>
                  ) : (
                    <>
                      평균까지 <span className="text-warning font-medium">{62 - totalScore}점</span>이
                      필요해요.
                    </>
                  )}
                </p>
              </div>
            </div>
          </section>

          {/* CTA 버튼 */}
          <div className="space-y-3">
            <Link href="/employer/ai-interview/branding">
              <button className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI로 브랜딩 콘텐츠 만들기
              </button>
            </Link>
            <Link href="/employer/branding">
              <button className="w-full border border-border-light text-text-primary py-4 rounded-xl font-medium">
                브랜딩 센터로 돌아가기
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 질문 화면
  const Icon = categoryIcons[currentQuestion.category] || Building2;

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col">
      {/* Header */}
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={currentStep > 0 ? goBack : () => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-white border border-border-light"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div className="text-center">
            <div className="text-sm font-medium text-expert-navy">브랜딩 진단</div>
            <div className="text-xs text-text-tertiary">
              {currentStep + 1} / {totalQuestions}
            </div>
          </div>
          <div className="w-10" />
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <motion.div
            className="progress-fill bg-expert-navy"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-expert-navy/10 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-expert-navy" />
              </div>
              <span className="text-sm text-expert-navy font-medium">
                {currentQuestion.categoryLabel}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-xl font-bold text-text-primary mb-6">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const isSelected = answers[currentQuestion.id] === option.score;

                return (
                  <motion.button
                    key={index}
                    onClick={() => handleAnswer(option.score)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                      isSelected
                        ? 'border-expert-navy bg-expert-navy/5'
                        : 'border-border-light bg-white hover:border-expert-navy/30'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-medium ${
                          isSelected ? 'text-expert-navy' : 'text-text-primary'
                        }`}
                      >
                        {option.label}
                      </span>
                      {isSelected && <CheckCircle className="w-5 h-5 text-expert-navy" />}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 bg-white border-t border-border-light">
        <p className="text-xs text-text-tertiary text-center">
          솔직하게 답변해주세요. 정확한 진단 결과를 받을 수 있어요.
        </p>
      </div>
    </div>
  );
}
