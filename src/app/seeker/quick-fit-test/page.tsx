'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Clock,
  TrendingUp,
  Target,
  Heart,
  Shield,
  Building2,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { mockQuickFitQuestions, mockRecommendedDepartments, mockRecommendedHospitals } from '@/lib/mock/data';

type FitType = 'high_end_achiever' | 'practical_expert' | 'self_actualizer' | 'trust_centered_expert';

const fitTypeInfo: Record<FitType, { label: string; description: string; icon: React.ComponentType<{ className?: string }>; color: string }> = {
  high_end_achiever: {
    label: '하이엔드 성과자',
    description: '성과 보상과 성장 기회를 중시해요. 인센티브가 강한 대형 병원과 잘 맞아요.',
    icon: TrendingUp,
    color: 'text-match-gold',
  },
  practical_expert: {
    label: '실리적 전문가',
    description: '급여와 워라밸을 중시해요. 조건이 좋고 안정적인 병원과 잘 맞아요.',
    icon: Target,
    color: 'text-info',
  },
  self_actualizer: {
    label: '자아실현가',
    description: '의미 있는 일과 성장을 중시해요. 교육/연구가 활발한 병원과 잘 맞아요.',
    icon: Heart,
    color: 'text-error',
  },
  trust_centered_expert: {
    label: '신뢰 중심 전문가',
    description: '좋은 동료와 안정성을 중시해요. 가족적 분위기의 병원과 잘 맞아요.',
    icon: Shield,
    color: 'text-success',
  },
};

export default function QuickFitTestPage() {
  const router = useRouter();
  const [stage, setStage] = useState<'intro' | 'test' | 'result'>('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { xWeight: number; yWeight: number }>>({});
  const [xScore, setXScore] = useState(0);
  const [yScore, setYScore] = useState(0);
  const [fitType, setFitType] = useState<FitType>('high_end_achiever');

  const questions = mockQuickFitQuestions;
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // 유형 결정
  const determineFitType = (x: number, y: number): FitType => {
    if (x >= 0 && y >= 0) return 'high_end_achiever';
    if (x >= 0 && y < 0) return 'practical_expert';
    if (x < 0 && y >= 0) return 'self_actualizer';
    return 'trust_centered_expert';
  };

  const handleAnswer = (option: { xWeight: number; yWeight: number }) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: option };
    setAnswers(newAnswers);

    // 점수 계산
    let x = 0;
    let y = 0;
    Object.values(newAnswers).forEach((ans) => {
      x += ans.xWeight;
      y += ans.yWeight;
    });
    setXScore(x);
    setYScore(y);

    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => setCurrentQuestion((prev) => prev + 1), 200);
    } else {
      // 완료
      const type = determineFitType(x, y);
      setFitType(type);
      setTimeout(() => setStage('result'), 300);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  // ============================================
  // 인트로 화면
  // ============================================
  if (stage === 'intro') {
    return (
      <div className="px-4 py-6 flex flex-col min-h-[calc(100vh-8rem)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 flex flex-col items-center justify-center text-center"
        >
          <div className="w-20 h-20 bg-brand-mint/10 rounded-full flex items-center justify-center mb-6">
            <Clock className="w-10 h-10 text-brand-mint" />
          </div>

          <h1 className="text-2xl font-bold text-expert-navy mb-3">
            1분 간단 진단
          </h1>

          <p className="text-text-secondary mb-6 max-w-xs">
            <strong className="text-brand-mint">5개 질문</strong>에 답하면
            <br />
            바로 맞춤 병원을 추천해 드려요!
          </p>

          {/* 특징 */}
          <div className="w-full max-w-sm space-y-3 mb-8">
            <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-border-light">
              <div className="w-8 h-8 bg-brand-mint/10 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-mint" />
              </div>
              <span className="text-sm text-text-primary">딱 5개 질문, 1분이면 끝!</span>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-border-light">
              <div className="w-8 h-8 bg-brand-mint/10 rounded-full flex items-center justify-center">
                <Building2 className="w-4 h-4 text-brand-mint" />
              </div>
              <span className="text-sm text-text-primary">바로 추천 병원 확인 가능</span>
            </div>
            <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-border-light">
              <div className="w-8 h-8 bg-brand-mint/10 rounded-full flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-brand-mint" />
              </div>
              <span className="text-sm text-text-primary">내 성향에 맞는 분과 추천</span>
            </div>
          </div>
        </motion.div>

        <div className="space-y-3">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            onClick={() => setStage('test')}
            className="btn-primary w-full"
          >
            간단 진단 시작
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.button>

          <Link href="/seeker/fit-test">
            <button className="w-full text-sm text-text-secondary py-2">
              더 정확한 25문항 진단 받기
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ============================================
  // 테스트 화면
  // ============================================
  if (stage === 'test') {
    const question = questions[currentQuestion];

    return (
      <div className="px-4 py-6 flex flex-col min-h-[calc(100vh-8rem)]">
        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <button onClick={handleBack} disabled={currentQuestion === 0} className="p-2 -ml-2 disabled:opacity-30">
              <ArrowLeft className="w-5 h-5 text-text-secondary" />
            </button>
            <span className="text-sm text-text-secondary">
              {currentQuestion + 1} / {totalQuestions}
            </span>
            <div className="w-9" />
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="flex-1 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="text-center mb-8"
            >
              <h2 className="text-xl font-bold text-expert-navy leading-relaxed">
                {question.text}
              </h2>
            </motion.div>
          </AnimatePresence>

          {/* Answer Options - 큰 버튼 형태 */}
          <div className="space-y-3">
            {question.options.map((option, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswer(option)}
                className="w-full py-4 px-5 rounded-2xl border-2 border-border-light bg-white text-left font-medium transition-all hover:border-brand-mint hover:bg-brand-mint/5 active:bg-brand-mint active:text-white active:border-brand-mint"
              >
                {option.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // 결과 화면
  // ============================================
  const resultInfo = fitTypeInfo[fitType];
  const ResultIcon = resultInfo.icon;
  const departments = mockRecommendedDepartments[fitType];
  const hospitals = fitType === 'high_end_achiever' ? mockRecommendedHospitals.high_end_achiever : null;

  return (
    <div className="px-4 py-6">
      {/* 결과 헤더 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-6"
      >
        <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-brand-mint/10`}>
          <ResultIcon className={`w-10 h-10 ${resultInfo.color}`} />
        </div>

        <div className="text-sm text-text-secondary mb-2">회원님의 유형은</div>
        <h1 className="text-2xl font-bold text-expert-navy mb-3">
          {resultInfo.label}
        </h1>
        <p className="text-text-secondary max-w-xs mx-auto">
          {resultInfo.description}
        </p>
      </motion.div>

      {/* 추천 분과 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-5 border border-border-light mb-4"
      >
        <h3 className="text-card-title mb-4">추천 분과</h3>
        <div className="space-y-3">
          {departments.map((dept, i) => (
            <div key={dept.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  i === 0 ? 'bg-brand-mint text-white' : 'bg-bg-secondary text-text-secondary'
                }`}>
                  {i + 1}
                </div>
                <div>
                  <div className="font-medium text-text-primary">{dept.name}</div>
                  <div className="text-xs text-text-tertiary">평균 연봉 {dept.avgSalary}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-brand-mint">{dept.percentage}%</div>
                <div className="text-xs text-text-tertiary">만족도</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* 추천 병원 (하이엔드 성과자 기준) */}
      {hospitals && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5 border border-border-light mb-4"
        >
          <h3 className="text-card-title mb-4">추천 병원</h3>

          {/* 피부과 */}
          <div className="mb-4">
            <div className="text-sm text-text-secondary mb-2">피부과</div>
            <div className="space-y-2">
              {hospitals.피부과.slice(0, 2).map((hospital) => (
                <div key={hospital.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                  <div>
                    <div className="font-medium text-text-primary">{hospital.name}</div>
                    <div className="text-xs text-text-tertiary">{hospital.location} · {hospital.salary}</div>
                  </div>
                  <div className="text-lg font-bold text-brand-mint">{hospital.matchScore}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* 성형외과 */}
          <div>
            <div className="text-sm text-text-secondary mb-2">성형외과</div>
            <div className="space-y-2">
              {hospitals.성형외과.slice(0, 2).map((hospital) => (
                <div key={hospital.id} className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                  <div>
                    <div className="font-medium text-text-primary">{hospital.name}</div>
                    <div className="text-xs text-text-tertiary">{hospital.location} · {hospital.salary}</div>
                  </div>
                  <div className="text-lg font-bold text-brand-mint">{hospital.matchScore}%</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* 넛지 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="nudge-box mb-6"
      >
        <Sparkles className="w-4 h-4 text-brand-mint inline mr-2" />
        같은 유형 선배 <strong>89%</strong>가 {departments[0].name}에서 만족하며 일하고 있어요!
      </motion.div>

      {/* 액션 버튼 */}
      <div className="space-y-3">
        <button
          onClick={() => router.push('/seeker/matching-center')}
          className="btn-primary w-full"
        >
          <Building2 className="w-5 h-5 mr-2" />
          매칭 센터에서 더 많은 병원 보기
        </button>

        <Link href="/seeker/fit-test">
          <button className="btn-outline w-full">
            더 정확한 25문항 정밀 진단 받기
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </Link>
      </div>
    </div>
  );
}
