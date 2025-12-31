'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  MessageCircle,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Send,
  Bot,
  User,
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Star,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Clock,
  Target,
  ChevronRight,
  FileText,
} from 'lucide-react';

// 모의면접 세션 목록
const practiceSessions = [
  {
    id: 1,
    title: '자기소개 연습',
    duration: '5분',
    status: 'completed',
    score: 82,
    feedback: '명확한 전달력이 좋아요',
    completedAt: '12/28',
  },
  {
    id: 2,
    title: '경력 기반 질문',
    duration: '10분',
    status: 'completed',
    score: 75,
    feedback: '구체적 사례 추가 필요',
    completedAt: '12/29',
  },
  {
    id: 3,
    title: '상황 대처 질문',
    duration: '8분',
    status: 'completed',
    score: 78,
    feedback: '논리적인 답변 구조',
    completedAt: '12/30',
  },
  {
    id: 4,
    title: '직무 역량 질문',
    duration: '10분',
    status: 'available',
    description: '술기와 전문성 관련 질문',
  },
  {
    id: 5,
    title: '종합 모의면접',
    duration: '15분',
    status: 'locked',
    description: '모든 유형 종합 연습',
    unlockCondition: '4개 세션 완료 후',
  },
];

// 면접 질문 예시
const mockQuestions = [
  {
    id: 1,
    question: '간단한 자기소개를 부탁드립니다.',
    category: '자기소개',
    tips: ['1-2분 내로 간결하게', '경력 하이라이트 포함', '지원 동기 언급'],
  },
  {
    id: 2,
    question: '가장 도전적이었던 업무 경험을 말씀해주세요.',
    category: '경력',
    tips: ['STAR 기법 활용', '구체적 수치 포함', '배운 점 강조'],
  },
  {
    id: 3,
    question: '환자가 불만을 제기할 때 어떻게 대응하시나요?',
    category: '상황대처',
    tips: ['공감 먼저', '해결 과정 설명', '결과 공유'],
  },
];

export default function PracticePage() {
  const router = useRouter();
  const [mode, setMode] = useState<'list' | 'practice'>('list');
  const [selectedSession, setSelectedSession] = useState<typeof practiceSessions[0] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [practiceCompleted, setPracticeCompleted] = useState(false);
  const [messages, setMessages] = useState<Array<{ type: 'ai' | 'user'; content: string }>>([]);

  const completedCount = practiceSessions.filter((s) => s.status === 'completed').length;
  const averageScore = Math.round(
    practiceSessions
      .filter((s) => s.status === 'completed' && s.score)
      .reduce((sum, s) => sum + (s.score || 0), 0) / completedCount || 0
  );

  // 녹음 타이머
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording) {
      timer = setInterval(() => setRecordTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startPractice = (session: typeof practiceSessions[0]) => {
    if (session.status === 'locked') return;
    setSelectedSession(session);
    setMode('practice');
    setCurrentQuestionIndex(0);
    setMessages([
      {
        type: 'ai',
        content: `안녕하세요! ${session.title}를 시작할게요.\n\n준비가 되시면 "시작"이라고 말씀해주시거나, 녹음 버튼을 눌러주세요.`,
      },
    ]);
  };

  const submitAnswer = () => {
    setIsRecording(false);
    setMessages((prev) => [
      ...prev,
      { type: 'user', content: `[답변 녹음 완료 - ${formatTime(recordTime)}]` },
    ]);
    setRecordTime(0);

    // AI 피드백 시뮬레이션
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          content:
            '좋은 답변이에요! 몇 가지 피드백을 드릴게요:\n\n✅ 명확한 문장 구조가 좋았어요\n⚡ 구체적인 수치나 사례를 추가하면 더 좋겠어요\n💡 마무리 멘트를 추가해보세요\n\n다음 질문으로 넘어갈까요?',
        },
      ]);
      setShowFeedback(true);
    }, 1500);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < mockQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowFeedback(false);
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          content: mockQuestions[currentQuestionIndex + 1].question,
        },
      ]);
    } else {
      // 세션 완료
      setPracticeCompleted(true);
      setShowFeedback(false);
      setMessages((prev) => [
        ...prev,
        {
          type: 'ai',
          content:
            '수고하셨습니다! 이번 세션을 완료했어요.\n\n📊 종합 점수: 80점\n⭐ 강점: 명확한 전달력\n📈 개선점: 구체적 사례 추가\n\n연습을 많이 할수록 실전에서 자신감이 생겨요!',
        },
      ]);
    }
  };

  // 연습 모드
  if (mode === 'practice' && selectedSession) {
    const currentQuestion = mockQuestions[currentQuestionIndex];

    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col">
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-border-light">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMode('list')}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
            >
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </button>
            <div className="text-center">
              <div className="font-semibold text-expert-navy">{selectedSession.title}</div>
              <div className="text-xs text-text-tertiary">
                {currentQuestionIndex + 1}/{mockQuestions.length}
              </div>
            </div>
            <div className="w-10" />
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-expert-navy rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-brand-mint text-white rounded-br-sm'
                    : 'bg-white border border-border-light rounded-bl-sm'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tips */}
        {!showFeedback && currentQuestion && (
          <div className="px-4 py-2 bg-warning/10 border-t border-warning/20">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-warning">답변 팁</span>
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {currentQuestion.tips.map((tip, index) => (
                <span
                  key={index}
                  className="flex-shrink-0 text-xs bg-white px-2 py-1 rounded text-text-secondary"
                >
                  {tip}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recording Controls */}
        <div className="px-4 py-4 bg-white border-t border-border-light">
          {practiceCompleted ? (
            <div className="space-y-3">
              <button
                onClick={() => router.push('/seeker/ai-interview/interview')}
                className="w-full py-4 bg-brand-mint text-white rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                AI 인터뷰 시작하기
              </button>
              <button
                onClick={() => {
                  setPracticeCompleted(false);
                  setMode('list');
                }}
                className="w-full py-3 border border-border-light rounded-xl font-medium text-text-primary"
              >
                다른 세션 연습하기
              </button>
            </div>
          ) : isRecording ? (
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center gap-3">
                <div className="w-3 h-3 bg-error rounded-full animate-pulse" />
                <span className="text-error font-medium">{formatTime(recordTime)}</span>
                <span className="text-sm text-text-tertiary">녹음 중...</span>
              </div>
              <button
                onClick={submitAnswer}
                className="px-6 py-3 bg-brand-mint text-white rounded-xl font-medium"
              >
                완료
              </button>
            </div>
          ) : showFeedback ? (
            <button
              onClick={nextQuestion}
              className="w-full py-4 bg-expert-navy text-white rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              {currentQuestionIndex < mockQuestions.length - 1 ? (
                <>
                  다음 질문 <ChevronRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" /> 연습 완료
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setIsRecording(true)}
              className="w-full py-4 bg-brand-mint text-white rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              <Mic className="w-5 h-5" />
              답변 녹음 시작
            </button>
          )}
        </div>
      </div>
    );
  }

  // 세션 리스트 모드
  return (
    <div className="min-h-screen bg-bg-secondary pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-border-light">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-expert-navy">모의면접 연습</h1>
            <p className="text-sm text-text-secondary">AI와 함께 면접을 연습해보세요</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* 진행 현황 */}
        <div className="bg-gradient-to-r from-warning to-warning/80 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-white/70 mb-1">연습 진행률</div>
              <div className="text-3xl font-bold">
                {completedCount}/{practiceSessions.length}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-white/70 mb-1">평균 점수</div>
              <div className="text-3xl font-bold">{averageScore}점</div>
            </div>
          </div>
          <div className="progress-bar bg-white/20">
            <div
              className="progress-fill bg-white"
              style={{ width: `${(completedCount / practiceSessions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* 세션 목록 */}
        <section>
          <h2 className="text-section-title mb-3">연습 세션</h2>
          <div className="space-y-3">
            {practiceSessions.map((session, index) => {
              const isLocked = session.status === 'locked';
              const isCompleted = session.status === 'completed';

              return (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => startPractice(session)}
                  className={`bg-white rounded-2xl p-4 border cursor-pointer transition-all ${
                    isLocked
                      ? 'border-border-light opacity-60'
                      : isCompleted
                      ? 'border-success/30 hover:shadow-card'
                      : 'border-warning hover:shadow-card'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isCompleted
                            ? 'bg-success/10'
                            : isLocked
                            ? 'bg-bg-tertiary'
                            : 'bg-warning/10'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-success" />
                        ) : isLocked ? (
                          <Clock className="w-6 h-6 text-text-tertiary" />
                        ) : (
                          <Play className="w-6 h-6 text-warning" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">{session.title}</div>
                        <div className="text-sm text-text-tertiary">
                          {isCompleted ? session.feedback : session.description || session.duration}
                        </div>
                        {isCompleted && session.completedAt && (
                          <div className="text-xs text-success">{session.completedAt} 완료</div>
                        )}
                        {isLocked && (
                          <div className="text-xs text-text-tertiary">
                            {session.unlockCondition}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {isCompleted && session.score && (
                        <div className="text-xl font-bold text-success">{session.score}점</div>
                      )}
                      {!isLocked && !isCompleted && (
                        <ChevronRight className="w-5 h-5 text-text-tertiary" />
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 피드백 리포트 */}
        <section>
          <h2 className="text-section-title mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-info" />
            피드백 리포트
          </h2>
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <div className="space-y-4">
              <div className="p-3 bg-success/10 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-4 h-4 text-success" />
                  <span className="text-sm font-medium text-success">강점</span>
                </div>
                <p className="text-sm text-text-primary">
                  명확하고 논리적인 답변 구조, 자신감 있는 목소리 톤
                </p>
              </div>
              <div className="p-3 bg-warning/10 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-warning" />
                  <span className="text-sm font-medium text-warning">개선 포인트</span>
                </div>
                <p className="text-sm text-text-primary">
                  구체적인 수치와 사례 추가, 답변 시간 조절 (현재 평균 2분 30초)
                </p>
              </div>
              <div className="p-3 bg-info/10 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-4 h-4 text-info" />
                  <span className="text-sm font-medium text-info">AI 코칭 팁</span>
                </div>
                <p className="text-sm text-text-primary">
                  STAR 기법 (Situation-Task-Action-Result)을 활용해 경험을 구조화해보세요
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 다음 단계 안내 */}
        {completedCount >= 4 && (
          <Link href="/seeker/ai-interview/interview">
            <div className="bg-brand-mint/10 border border-brand-mint/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-brand-mint">모의면접 완료!</div>
                <div className="text-sm text-text-secondary">실제 AI 면접에 도전해보세요</div>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-mint" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
