'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Bot,
  Send,
  Sparkles,
  Settings,
  CheckCircle,
  Plus,
  Trash2,
  GripVertical,
  Edit2,
  MessageCircle,
  Target,
  Users,
  Briefcase,
  Heart,
  Brain,
} from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
}

const questionCategories = [
  { id: 'experience', label: '경력/경험', icon: Briefcase, color: 'bg-info' },
  { id: 'skill', label: '직무 역량', icon: Target, color: 'bg-brand-mint' },
  { id: 'culture', label: '조직문화 적합', icon: Heart, color: 'bg-error' },
  { id: 'personality', label: '성향/태도', icon: Brain, color: 'bg-warning' },
  { id: 'situation', label: '상황 대처', icon: Users, color: 'bg-expert-navy' },
];

const defaultQuestions = [
  {
    id: 'q1',
    category: 'experience',
    question: '이전 직장에서 가장 도전적이었던 업무는 무엇이었나요?',
    evaluationPoints: ['문제해결 능력', '성장 의지'],
  },
  {
    id: 'q2',
    category: 'skill',
    question: '레이저 시술 보조 경험이 있으시다면, 어떤 장비를 다뤄보셨나요?',
    evaluationPoints: ['전문성', '경험 수준'],
  },
  {
    id: 'q3',
    category: 'culture',
    question: '팀에서 갈등이 생겼을 때 어떻게 해결하시나요?',
    evaluationPoints: ['협업 능력', '커뮤니케이션'],
  },
  {
    id: 'q4',
    category: 'personality',
    question: '업무에서 가장 중요하게 생각하는 가치는 무엇인가요?',
    evaluationPoints: ['가치관', '동기'],
  },
  {
    id: 'q5',
    category: 'situation',
    question: '환자가 불만을 표시할 때 어떻게 대응하시겠어요?',
    evaluationPoints: ['고객 응대', '스트레스 관리'],
  },
];

const aiSuggestions = [
  '피부과 특화 질문을 추가해볼까요? 예: "레이저 시술 후 환자 케어 경험을 알려주세요"',
  '지원자의 성장 의지를 확인하는 질문도 좋아요. 예: "1년 후 어떤 모습이 되고 싶으신가요?"',
  '우리 병원 가치와 맞는지 확인하는 질문을 넣어볼까요?',
];

export default function CalibrationPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'list' | 'chat'>('list');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content:
        '표준 질문 목록을 확인하셨군요! 추가로 필요한 질문이 있으시면 말씀해주세요.\n\n예: "경력 검증 질문 추가해줘", "우리 병원 문화에 맞는 질문 추천해줘" 등',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [questions, setQuestions] = useState(defaultQuestions);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content:
          inputValue.includes('경력') || inputValue.includes('경험')
            ? '경력과 경험을 평가하는 질문을 추천드릴게요:\n\n1. "이전 직장에서 담당했던 주요 업무를 설명해주세요"\n2. "가장 성장했다고 느끼는 경험은 무엇인가요?"\n3. "어려운 상황에서 어떻게 극복하셨나요?"\n\n이 중에서 추가하고 싶은 질문이 있으신가요?'
            : inputValue.includes('성격') || inputValue.includes('성향')
            ? '성격과 성향을 파악하는 질문들이에요:\n\n1. "스트레스를 받을 때 어떻게 해소하시나요?"\n2. "동료와 의견이 다를 때 어떻게 대처하시나요?"\n3. "업무 스타일을 한 문장으로 표현한다면?"\n\n어떤 질문을 추가할까요?'
            : '좋은 의견이에요! 그 부분을 평가할 수 있는 질문을 몇 가지 생각해봤어요.\n\n1. "해당 상황에서 어떻게 대처하셨나요?"\n2. "그 경험에서 배운 점은 무엇인가요?"\n\n다른 평가 항목도 추가해볼까요?',
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const addQuestion = () => {
    const newQuestion = {
      id: `q${Date.now()}`,
      category: selectedCategory || 'experience',
      question: '새 질문을 입력하세요',
      evaluationPoints: ['평가 포인트'],
    };
    setQuestions((prev) => [...prev, newQuestion]);
  };

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border-light bg-white">
        <div className="flex items-center gap-3 mb-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-expert-navy">면접 질문 설정</h1>
            <p className="text-sm text-text-secondary">표준 질문을 확인하고 AI로 추가해요</p>
          </div>
        </div>

        {/* 모드 전환 */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode('list')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === 'list'
                ? 'bg-expert-navy text-white'
                : 'bg-bg-secondary text-text-secondary'
            }`}
          >
            <Settings className="w-4 h-4 inline mr-1" />
            표준 질문 ({questions.length})
          </button>
          <button
            onClick={() => setMode('chat')}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
              mode === 'chat'
                ? 'bg-expert-navy text-white'
                : 'bg-bg-secondary text-text-secondary'
            }`}
          >
            <MessageCircle className="w-4 h-4 inline mr-1" />
            AI 질문 추가
          </button>
        </div>
      </div>

      {mode === 'chat' ? (
        <>
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
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
                      ? 'bg-expert-navy text-white rounded-br-sm'
                      : 'bg-bg-secondary text-text-primary rounded-bl-sm'
                  }`}
                >
                  <div className="text-sm whitespace-pre-line">{message.content}</div>
                </div>
              </motion.div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* 추천 질문 칩 */}
          <div className="px-4 py-2 border-t border-border-light bg-white">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {['경력 중심으로', '성격 파악', '조직문화 적합', '직무 역량'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setInputValue(chip + ' 질문을 추천해주세요');
                    handleSend();
                  }}
                  className="flex-shrink-0 px-3 py-1.5 bg-bg-secondary rounded-full text-xs text-text-secondary"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="px-4 py-4 border-t border-border-light bg-white">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="어떤 점을 평가하고 싶으세요?"
                className="flex-1 px-4 py-3 bg-bg-secondary rounded-xl text-sm placeholder:text-text-tertiary"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="w-12 h-12 bg-expert-navy rounded-xl flex items-center justify-center disabled:opacity-50"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Question List */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {/* 카테고리 필터 */}
            <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  !selectedCategory
                    ? 'bg-expert-navy text-white'
                    : 'bg-bg-secondary text-text-secondary'
                }`}
              >
                전체
              </button>
              {questionCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-expert-navy text-white'
                      : 'bg-bg-secondary text-text-secondary'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* 질문 목록 */}
            <div className="space-y-3">
              {questions
                .filter((q) => !selectedCategory || q.category === selectedCategory)
                .map((q, index) => {
                  const category = questionCategories.find((c) => c.id === q.category);
                  return (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white rounded-2xl p-4 border border-border-light"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center gap-1 text-text-tertiary">
                          <GripVertical className="w-4 h-4" />
                          <span className="text-xs font-medium">{index + 1}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {category && (
                              <span
                                className={`text-xs ${category.color} text-white px-2 py-0.5 rounded`}
                              >
                                {category.label}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-text-primary mb-2">{q.question}</p>
                          <div className="flex flex-wrap gap-1">
                            {q.evaluationPoints.map((point) => (
                              <span
                                key={point}
                                className="text-xs bg-bg-secondary text-text-tertiary px-2 py-0.5 rounded"
                              >
                                {point}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <button className="p-2 hover:bg-bg-secondary rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4 text-text-tertiary" />
                          </button>
                          <button
                            onClick={() => deleteQuestion(q.id)}
                            className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-text-tertiary" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>

            {/* 질문 추가 */}
            <button
              onClick={addQuestion}
              className="w-full mt-4 py-4 border-2 border-dashed border-border-light rounded-2xl text-text-tertiary text-sm flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              질문 추가하기
            </button>
          </div>

          {/* AI 추천 */}
          <div className="px-4 py-4 border-t border-border-light bg-white">
            <div className="bg-expert-navy/5 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-expert-navy" />
                <span className="text-sm font-medium text-expert-navy">AI 추천</span>
              </div>
              <p className="text-xs text-text-secondary">
                {aiSuggestions[0]}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Bottom Action (질문 목록 모드) */}
      {mode === 'list' && (
        <div className="px-4 py-4 border-t border-border-light bg-white">
          <Link href="/employer/ai-interview/pipeline">
            <button className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {questions.length}개 질문으로 면접 시작
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
