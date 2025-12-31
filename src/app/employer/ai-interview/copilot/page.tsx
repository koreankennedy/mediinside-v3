'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Video,
  VideoOff,
  MessageCircle,
  Clock,
  ChevronRight,
  Star,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  SkipForward,
  FileText,
  Send,
  Bot,
  Target,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';

const suggestedQuestions = [
  {
    id: 'sq1',
    category: '경험',
    question: '이전 직장에서 가장 도전적이었던 프로젝트에 대해 말씀해주세요.',
    followUp: '그 경험에서 가장 어려웠던 점은 무엇이었나요?',
  },
  {
    id: 'sq2',
    category: '역량',
    question: '환자 응대 시 가장 중요하게 생각하는 점은 무엇인가요?',
    followUp: '실제로 그렇게 대응했던 사례를 들어주실 수 있나요?',
  },
  {
    id: 'sq3',
    category: '상황대처',
    question: '급한 상황에서 여러 업무가 겹칠 때 어떻게 우선순위를 정하시나요?',
    followUp: '그런 상황이 실제로 있었다면 어떻게 해결하셨나요?',
  },
  {
    id: 'sq4',
    category: '성장',
    question: '1년 후, 3년 후 어떤 모습이 되어 있고 싶으신가요?',
    followUp: '그 목표를 위해 지금 어떤 노력을 하고 계신가요?',
  },
  {
    id: 'sq5',
    category: '문화적합',
    question: '이상적인 직장 분위기는 어떤 모습인가요?',
    followUp: '우리 병원에 대해 궁금한 점이 있으신가요?',
  },
];

const realTimeInsights = [
  { type: 'positive', message: '구체적인 사례를 들어 설명하고 있어요' },
  { type: 'positive', message: '적극적인 자세와 열정이 느껴져요' },
  { type: 'neutral', message: '경력 검증 결과와 일치하는 답변이에요' },
  { type: 'tip', message: '추가 질문: "그때 구체적으로 어떻게 대응하셨나요?"' },
];

function CopilotContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicantId = searchParams.get('id');

  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [notes, setNotes] = useState<{ questionId: string; rating: number; note: string }[]>([]);
  const [showInsight, setShowInsight] = useState<typeof realTimeInsights[0] | null>(null);
  const [currentNote, setCurrentNote] = useState('');

  // 타이머
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 랜덤 인사이트 표시
  useEffect(() => {
    const interval = setInterval(() => {
      const randomInsight = realTimeInsights[Math.floor(Math.random() * realTimeInsights.length)];
      setShowInsight(randomInsight);
      setTimeout(() => setShowInsight(null), 4000);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQuestion = suggestedQuestions[currentQuestionIndex];

  const saveNote = (rating: number) => {
    setNotes((prev) => [
      ...prev,
      {
        questionId: currentQuestion.id,
        rating,
        note: currentNote,
      },
    ]);
    setCurrentNote('');
    if (currentQuestionIndex < suggestedQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < suggestedQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-expert-navy flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/10"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <div className="text-center">
          <div className="text-white font-semibold">면접 코파일럿</div>
          <div className="text-white/60 text-sm">한소희님 2차 면접</div>
        </div>
        <div className="flex items-center gap-2 bg-error/20 px-3 py-1.5 rounded-full">
          <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
          <span className="text-white text-sm font-medium">{formatTime(elapsedTime)}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-bg-secondary rounded-t-3xl overflow-hidden flex flex-col">
        {/* 현재 질문 */}
        <div className="p-4">
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs bg-expert-navy text-white px-2 py-0.5 rounded">
                {currentQuestion.category}
              </span>
              <span className="text-xs text-text-tertiary">
                {currentQuestionIndex + 1}/{suggestedQuestions.length}
              </span>
            </div>
            <p className="text-text-primary font-medium mb-3">{currentQuestion.question}</p>
            <div className="bg-bg-secondary rounded-xl p-3">
              <div className="flex items-center gap-2 text-xs text-text-secondary mb-1">
                <Sparkles className="w-3 h-3 text-brand-mint" />
                추천 후속 질문
              </div>
              <p className="text-sm text-text-primary">{currentQuestion.followUp}</p>
            </div>
          </div>
        </div>

        {/* AI 실시간 인사이트 */}
        <AnimatePresence>
          {showInsight && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4"
            >
              <div
                className={`rounded-xl p-3 flex items-center gap-3 ${
                  showInsight.type === 'positive'
                    ? 'bg-success/10 border border-success/20'
                    : showInsight.type === 'tip'
                    ? 'bg-warning/10 border border-warning/20'
                    : 'bg-info/10 border border-info/20'
                }`}
              >
                <Bot
                  className={`w-5 h-5 ${
                    showInsight.type === 'positive'
                      ? 'text-success'
                      : showInsight.type === 'tip'
                      ? 'text-warning'
                      : 'text-info'
                  }`}
                />
                <span className="text-sm text-text-primary">{showInsight.message}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 메모 입력 */}
        <div className="flex-1 p-4">
          <div className="bg-white rounded-2xl p-4 border border-border-light h-full flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-text-primary">면접 메모</span>
              <span className="text-xs text-text-tertiary">음성으로도 입력 가능</span>
            </div>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="지원자의 답변에 대한 메모를 입력하세요..."
              className="flex-1 w-full bg-bg-secondary rounded-xl p-3 text-sm resize-none placeholder:text-text-tertiary"
            />
          </div>
        </div>

        {/* 질문 네비게이션 */}
        <div className="px-4 pb-2">
          <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-2">
            {suggestedQuestions.map((q, idx) => {
              const hasNote = notes.find((n) => n.questionId === q.id);
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-sm font-medium transition-all ${
                    idx === currentQuestionIndex
                      ? 'bg-expert-navy text-white'
                      : hasNote
                      ? 'bg-success/20 text-success'
                      : 'bg-bg-secondary text-text-tertiary'
                  }`}
                >
                  {hasNote ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* 평가 버튼 */}
        <div className="p-4 border-t border-border-light bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-text-secondary">이 질문에 대한 답변 평가</span>
            <button
              onClick={nextQuestion}
              className="text-sm text-expert-navy flex items-center gap-1"
            >
              다음 질문 <SkipForward className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => saveNote(1)}
              className="flex-1 py-3 bg-error/10 text-error rounded-xl flex items-center justify-center gap-2"
            >
              <ThumbsDown className="w-5 h-5" />
              부족
            </button>
            <button
              onClick={() => saveNote(2)}
              className="flex-1 py-3 bg-warning/10 text-warning rounded-xl flex items-center justify-center gap-2"
            >
              <Target className="w-5 h-5" />
              보통
            </button>
            <button
              onClick={() => saveNote(3)}
              className="flex-1 py-3 bg-success/10 text-success rounded-xl flex items-center justify-center gap-2"
            >
              <ThumbsUp className="w-5 h-5" />
              우수
            </button>
          </div>
        </div>

        {/* 면접 종료 버튼 */}
        <div className="p-4 pt-0 space-y-3">
          <Link href="/employer/ai-interview/pipeline">
            <button className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
              <FileText className="w-5 h-5" />
              면접 종료 및 리포트 작성
            </button>
          </Link>
          <Link href={`/employer/ai-interview/offer?id=${applicantId || 'app-6'}`}>
            <button className="w-full bg-success text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
              <Send className="w-5 h-5" />
              바로 오퍼 발송하기
            </button>
          </Link>
        </div>
      </div>

      {/* 음성 녹음 FAB */}
      <button
        onClick={() => setIsRecording(!isRecording)}
        className={`fixed bottom-32 right-4 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isRecording ? 'bg-error animate-pulse' : 'bg-expert-navy'
        }`}
      >
        {isRecording ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
}

export default function CopilotPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-secondary flex items-center justify-center">로딩 중...</div>}>
      <CopilotContent />
    </Suspense>
  );
}
