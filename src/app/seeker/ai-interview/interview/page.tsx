'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Bot,
  Clock,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Play,
  Pause,
  ChevronRight,
  Star,
  Target,
  Trophy,
  Send,
} from 'lucide-react';

// AI 면접 질문 (실제로는 병원별로 다름)
const interviewQuestions = [
  {
    id: 1,
    question: '간단한 자기소개를 부탁드립니다.',
    timeLimit: 120,
    category: '자기소개',
  },
  {
    id: 2,
    question:
      '이전 직장에서 가장 어려웠던 환자 응대 경험과 어떻게 해결했는지 말씀해주세요.',
    timeLimit: 180,
    category: '경험',
  },
  {
    id: 3,
    question: '우리 병원에 지원하게 된 동기는 무엇인가요?',
    timeLimit: 120,
    category: '지원동기',
  },
  {
    id: 4,
    question: '5년 후 자신의 모습을 어떻게 그리고 계신가요?',
    timeLimit: 120,
    category: '비전',
  },
  {
    id: 5,
    question: '마지막으로 하고 싶은 말씀이 있으시면 자유롭게 해주세요.',
    timeLimit: 90,
    category: '마무리',
  },
];

export default function InterviewPage() {
  const router = useRouter();
  const [stage, setStage] = useState<'type-select' | 'intro' | 'ready' | 'interview' | 'complete'>('type-select');
  const [interviewType, setInterviewType] = useState<'video' | 'chat' | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{type: 'ai' | 'user', content: string}[]>([]);

  const currentQuestion = interviewQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / interviewQuestions.length) * 100;

  // 타이머
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRecording && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
        setTotalTime((prev) => prev + 1);
      }, 1000);
    } else if (isRecording && timeLeft === 0) {
      // 시간 초과 시 자동 제출
      submitAnswer();
    }
    return () => clearInterval(timer);
  }, [isRecording, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startInterview = () => {
    setStage('ready');
  };

  const beginQuestion = () => {
    setStage('interview');
    setTimeLeft(currentQuestion.timeLimit);
    setIsRecording(true);
  };

  const submitAnswer = () => {
    setIsRecording(false);
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: true }));

    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex((prev) => prev + 1);
        setStage('ready');
      }, 1000);
    } else {
      setStage('complete');
    }
  };

  // 면접 유형 선택 함수
  const selectInterviewType = (type: 'video' | 'chat') => {
    setInterviewType(type);
    setStage('intro');
  };

  // 대화형 면접 답변 제출
  const submitChatAnswer = () => {
    if (!chatInput.trim()) return;

    setChatMessages(prev => [...prev, { type: 'user', content: chatInput }]);
    setChatInput('');
    setAnswers(prev => ({ ...prev, [currentQuestionIndex]: true }));
    setTotalTime(prev => prev + 30); // 대화형은 시간 추정

    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(prev => prev + 1);
        setChatMessages(prev => [...prev, {
          type: 'ai',
          content: interviewQuestions[currentQuestionIndex + 1].question
        }]);
      }, 1000);
    } else {
      setTimeout(() => setStage('complete'), 1000);
    }
  };

  // 면접 유형 선택 화면
  if (stage === 'type-select') {
    return (
      <div className="min-h-screen bg-bg-secondary pb-24">
        <div className="bg-white px-4 py-4 border-b border-border-light">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
            >
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-expert-navy">AI 면접</h1>
              <p className="text-sm text-text-secondary">면접 유형을 선택하세요</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-expert-navy mb-2">
              면접 유형을 선택해주세요
            </h2>
            <p className="text-text-secondary text-sm">
              편한 방식으로 면접을 진행할 수 있어요
            </p>
          </div>

          <div className="space-y-4">
            {/* 화상 면접 */}
            <button
              onClick={() => selectInterviewType('video')}
              className="w-full bg-white rounded-2xl p-5 border-2 border-border-light hover:border-brand-mint transition-colors text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-brand-mint/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Video className="w-7 h-7 text-brand-mint" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-text-primary mb-1">화상 면접</h3>
                  <p className="text-sm text-text-secondary mb-3">
                    카메라와 마이크를 사용해 실제 면접처럼 진행해요
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-brand-mint/10 text-brand-mint px-2 py-1 rounded-full">
                      실전 연습
                    </span>
                    <span className="text-xs bg-brand-mint/10 text-brand-mint px-2 py-1 rounded-full">
                      표정/태도 분석
                    </span>
                  </div>
                </div>
              </div>
            </button>

            {/* 대화형 면접 */}
            <button
              onClick={() => selectInterviewType('chat')}
              className="w-full bg-white rounded-2xl p-5 border-2 border-border-light hover:border-info transition-colors text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-info/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Bot className="w-7 h-7 text-info" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-text-primary mb-1">대화형 면접</h3>
                  <p className="text-sm text-text-secondary mb-3">
                    채팅으로 편하게 답변을 작성해요
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-info/10 text-info px-2 py-1 rounded-full">
                      부담 없음
                    </span>
                    <span className="text-xs bg-info/10 text-info px-2 py-1 rounded-full">
                      답변 수정 가능
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* 안내 */}
          <div className="bg-brand-mint/5 border border-brand-mint/20 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
              <p className="text-xs text-text-secondary">
                <strong className="text-brand-mint">Tip</strong>: 화상 면접은 실제 면접과 유사하여 더 정확한 피드백을 받을 수 있어요.
                대화형은 편하게 연습하고 싶을 때 추천해요.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 인트로 화면
  if (stage === 'intro') {
    return (
      <div className="min-h-screen bg-bg-secondary pb-24">
        <div className="bg-white px-4 py-4 border-b border-border-light">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
            >
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-expert-navy">AI 면접</h1>
              <p className="text-sm text-text-secondary">실제 면접을 진행합니다</p>
            </div>
          </div>
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* 면접 안내 */}
          <div className="bg-brand-mint/10 border border-brand-mint/20 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${interviewType === 'video' ? 'bg-brand-mint' : 'bg-info'}`}>
                {interviewType === 'video' ? (
                  <Video className="w-6 h-6 text-white" />
                ) : (
                  <Bot className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h2 className="font-bold text-expert-navy">
                  {interviewType === 'video' ? 'AI 영상 면접' : 'AI 대화형 면접'}
                </h2>
                <p className="text-sm text-text-secondary">강남 프리미엄 피부과</p>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-3 text-sm">
                <Clock className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-primary">예상 소요시간: 약 15분</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Target className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-primary">총 {interviewQuestions.length}개 질문</span>
              </div>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              면접 전 확인사항
            </h3>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>조용하고 밝은 환경에서 진행해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>카메라와 마이크가 정상 작동하는지 확인해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>질문당 제한 시간이 있으니 참고해주세요</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                <span>한 번 제출한 답변은 수정할 수 없어요</span>
              </li>
            </ul>
          </div>

          {/* 장비 테스트 - 화상 면접일 때만 */}
          {interviewType === 'video' && (
            <div className="bg-white rounded-2xl p-4 border border-border-light">
              <h3 className="font-semibold text-text-primary mb-3">장비 테스트</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setIsCameraOn(!isCameraOn)}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 ${
                    isCameraOn ? 'bg-success/10 border border-success/20' : 'bg-error/10 border border-error/20'
                  }`}
                >
                  {isCameraOn ? (
                    <Video className="w-6 h-6 text-success" />
                  ) : (
                    <VideoOff className="w-6 h-6 text-error" />
                  )}
                  <span className={`text-sm font-medium ${isCameraOn ? 'text-success' : 'text-error'}`}>
                    {isCameraOn ? '카메라 정상' : '카메라 꺼짐'}
                  </span>
                </button>
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`p-4 rounded-xl flex flex-col items-center gap-2 ${
                    isMicOn ? 'bg-success/10 border border-success/20' : 'bg-error/10 border border-error/20'
                  }`}
                >
                  {isMicOn ? (
                    <Mic className="w-6 h-6 text-success" />
                  ) : (
                    <MicOff className="w-6 h-6 text-error" />
                  )}
                  <span className={`text-sm font-medium ${isMicOn ? 'text-success' : 'text-error'}`}>
                    {isMicOn ? '마이크 정상' : '마이크 꺼짐'}
                  </span>
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              if (interviewType === 'chat') {
                setChatMessages([{ type: 'ai', content: currentQuestion.question }]);
                setStage('interview');
              } else {
                startInterview();
              }
            }}
            disabled={interviewType === 'video' && (!isCameraOn || !isMicOn)}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50 ${
              interviewType === 'video' ? 'bg-brand-mint text-white' : 'bg-info text-white'
            }`}
          >
            <Play className="w-5 h-5" />
            면접 시작하기
          </button>
        </div>
      </div>
    );
  }

  // 완료 화면
  if (stage === 'complete') {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 bg-success rounded-full flex items-center justify-center mb-6"
        >
          <Trophy className="w-10 h-10 text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-expert-navy mb-2"
        >
          면접이 완료되었습니다!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-text-secondary text-center mb-2"
        >
          총 소요시간: {formatTime(totalTime)}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-text-tertiary text-center mb-8"
        >
          AI가 답변을 분석하고 있어요. <br />
          결과는 1-2일 내에 알려드릴게요.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="w-full space-y-3"
        >
          <Link href="/seeker/ai-interview/lounge">
            <button className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold">
              AI 컨시어지 가기
            </button>
          </Link>
          <Link href="/seeker/ai-interview">
            <button className="w-full border border-border-light text-text-primary py-4 rounded-xl font-medium">
              AI 인터뷰 홈으로
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // 대화형 면접 진행 화면
  if (interviewType === 'chat' && stage === 'interview') {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col">
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-border-light">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-expert-navy">AI 대화형 면접</h1>
                <p className="text-xs text-text-secondary">
                  질문 {currentQuestionIndex + 1}/{interviewQuestions.length}
                </p>
              </div>
            </div>
            <span className="text-xs bg-info/10 text-info px-2 py-1 rounded-full">
              {currentQuestion.category}
            </span>
          </div>
          {/* Progress */}
          <div className="mt-3">
            <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-info"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatMessages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.type === 'ai' && (
                <div className="w-8 h-8 bg-info rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.type === 'user'
                    ? 'bg-info text-white rounded-br-sm'
                    : 'bg-white border border-border-light rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white px-4 py-4 border-t border-border-light">
          <div className="flex items-end gap-2">
            <textarea
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  submitChatAnswer();
                }
              }}
              placeholder="답변을 입력하세요..."
              className="flex-1 px-4 py-3 bg-bg-secondary rounded-xl text-sm placeholder:text-text-tertiary resize-none max-h-32"
              rows={2}
            />
            <button
              onClick={submitChatAnswer}
              disabled={!chatInput.trim()}
              className="w-12 h-12 bg-info rounded-xl flex items-center justify-center disabled:opacity-50"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 화상 면접 진행 화면
  return (
    <div className="min-h-screen bg-expert-navy flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 flex items-center justify-between">
        <div className="text-white">
          <div className="text-sm text-white/70">질문 {currentQuestionIndex + 1}/{interviewQuestions.length}</div>
          <div className="font-semibold">{currentQuestion.category}</div>
        </div>
        {isRecording && (
          <div className="flex items-center gap-2 bg-error/20 px-3 py-1.5 rounded-full">
            <div className="w-2 h-2 bg-error rounded-full animate-pulse" />
            <span className="text-white text-sm font-medium">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="px-4 mb-4">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-brand-mint"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-bg-secondary rounded-t-3xl overflow-hidden flex flex-col">
        {stage === 'ready' ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4">
            <div className="w-16 h-16 bg-expert-navy/10 rounded-full flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-expert-navy" />
            </div>
            <h2 className="text-xl font-bold text-expert-navy text-center mb-4">
              {currentQuestion.question}
            </h2>
            <p className="text-text-secondary text-center mb-2">
              제한 시간: {formatTime(currentQuestion.timeLimit)}
            </p>
            <p className="text-sm text-text-tertiary text-center mb-8">
              준비되시면 아래 버튼을 눌러주세요
            </p>
            <button
              onClick={beginQuestion}
              className="px-8 py-4 bg-brand-mint text-white rounded-xl font-semibold flex items-center gap-2"
            >
              <Mic className="w-5 h-5" />
              답변 시작
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* 질문 표시 */}
            <div className="p-4">
              <div className="bg-white rounded-2xl p-4 border border-border-light">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-5 h-5 text-expert-navy" />
                  <span className="text-sm font-medium text-expert-navy">AI 면접관</span>
                </div>
                <p className="text-text-primary">{currentQuestion.question}</p>
              </div>
            </div>

            {/* 녹화 중 표시 */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-brand-mint/10 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                  <Video className="w-12 h-12 text-brand-mint" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-error rounded-full animate-pulse" />
                </div>
                <p className="text-text-secondary">녹화 중입니다</p>
                <p className="text-sm text-text-tertiary">남은 시간: {formatTime(timeLeft)}</p>
              </div>
            </div>

            {/* 제출 버튼 */}
            <div className="p-4">
              <button
                onClick={submitAnswer}
                className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                답변 제출
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
