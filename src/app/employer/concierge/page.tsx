'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  Send,
  Users,
  Sparkles,
  ChevronRight,
  MessageCircle,
  DollarSign,
  TrendingUp,
  Calendar,
  UserCheck,
  Briefcase,
  ArrowRight,
  Clock,
} from 'lucide-react';
import Link from 'next/link';
import { mockEmployerConciergeQA, mockCandidates } from '@/lib/mock/data';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const quickActions = [
  {
    icon: Users,
    label: '추천 후보자 보기',
    href: '/employer/candidates',
    description: '우리 병원에 맞는 인재를 찾아보세요',
  },
  {
    icon: Calendar,
    label: '면접 일정 확인',
    href: '/employer/matching-center?tab=interview',
    description: '예정된 면접 일정을 확인하세요',
  },
  {
    icon: DollarSign,
    label: '시장 급여 분석',
    href: '#',
    description: '경쟁력 있는 급여를 책정하세요',
  },
];

const mockResponses: Record<string, string> = {
  '면접 때 어떤 질문을 해야 할까요?':
    '치과위생사 면접에서는 이런 질문들을 추천드려요:\n\n1. **경험 관련**: "가장 까다로웠던 환자 케이스와 해결 방법"\n2. **술기 관련**: "스케일링/필러 시술 보조 경험"\n3. **성향 파악**: "스트레스 상황에서의 대처법"\n4. **동기 확인**: "우리 병원에 지원한 이유"\n\n후보자의 성향 유형에 맞춰 질문을 조절하시면 더 효과적이에요!',
  '적정 급여 수준은 어떻게 되나요?':
    '현재 강남 지역 치과위생사 시장 현황이에요:\n\n📊 **경력별 평균 급여**\n• 신입~1년차: 280~320만원\n• 2~3년차: 320~380만원\n• 4~5년차: 380~450만원\n• 6년 이상: 450만원~\n\n💡 **우리 병원 경쟁력**\n현재 제시하신 조건은 시장 평균 대비 약간 높은 수준이에요. 인센티브와 복리후생까지 포함하면 충분히 경쟁력 있습니다!',
  '좋은 후보자를 판단하는 기준은?':
    '좋은 후보자 판단 기준을 알려드릴게요:\n\n✅ **필수 체크**\n• 보유 술기가 병원 니즈와 맞는지\n• 경력이 검증 가능한지\n• 이직 사유가 합리적인지\n\n⭐ **플러스 요소**\n• 성향 FIT이 기존 팀과 맞는지\n• 성장 의지가 있는지\n• 커뮤니케이션이 원활한지\n\n저희 AI가 매칭율을 계산해드리니 참고해주세요!',
  '요즘 구직자들이 중요하게 생각하는 건?':
    '최근 구직 트렌드를 분석해봤어요:\n\n🔥 **가장 중요하게 보는 것**\n1. 급여 수준 (25%)\n2. 워라밸/근무시간 (22%)\n3. 성장 기회/교육 (18%)\n4. 조직 문화 (17%)\n5. 위치/출퇴근 (10%)\n\n💡 **최근 변화**\n• "성장 기회" 중요도가 전년 대비 5% 상승\n• MZ세대는 "조직문화"를 더 중시\n• 인센티브보다 기본급 선호 경향',
  default:
    '좋은 질문이에요! 이 부분에 대해 자세히 분석해드릴게요.\n\n저희 메디인사이드는 치과/피부과/성형외과 전문 채용 플랫폼으로, 시장 데이터를 기반으로 맞춤 조언을 드립니다.\n\n더 구체적인 상황을 알려주시면 더 정확한 답변을 드릴 수 있어요!',
};

function EmployerConciergeContent() {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get('candidate');
  const selectedCandidate = candidateId
    ? mockCandidates.find((c) => c.id === candidateId)
    : null;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: selectedCandidate
        ? `안녕하세요! ${selectedCandidate.name}님에 대해 궁금하신 점을 물어보세요. 성향 분석, 급여 협상 포인트, 면접 팁 등을 알려드릴 수 있어요!`
        : '안녕하세요! 메디인사이드 AI 채용 컨시어지입니다. 채용 관련 질문이나 후보자 분석이 필요하시면 편하게 물어보세요!',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // AI 응답 시뮬레이션
    setTimeout(() => {
      let response = mockResponses.default;

      // 후보자별 질문 체크
      if (selectedCandidate) {
        const candidateQA =
          mockEmployerConciergeQA.candidateQuestions[
            selectedCandidate.id as keyof typeof mockEmployerConciergeQA.candidateQuestions
          ];
        if (candidateQA) {
          const matchedQuestion = Object.keys(candidateQA.questions).find((q) =>
            messageText.includes(q.replace('?', ''))
          );
          if (matchedQuestion) {
            response = candidateQA.questions[matchedQuestion as keyof typeof candidateQA.questions];
          }
        }
      }

      // 일반 질문 체크
      Object.keys(mockResponses).forEach((key) => {
        if (messageText.includes(key.replace('?', '').slice(0, 10))) {
          response = mockResponses[key];
        }
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getSuggestedQuestions = () => {
    if (selectedCandidate) {
      const candidateQA =
        mockEmployerConciergeQA.candidateQuestions[
          selectedCandidate.id as keyof typeof mockEmployerConciergeQA.candidateQuestions
        ];
      if (candidateQA) {
        return Object.keys(candidateQA.questions);
      }
    }
    return selectedCategory
      ? mockEmployerConciergeQA.suggestedQuestions.find((c) => c.category === selectedCategory)
          ?.questions || []
      : [];
  };

  const questionCount = messages.filter((m) => m.type === 'user').length;

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="px-4 py-4 border-b border-border-light bg-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-expert-navy rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-expert-navy">AI 채용 컨시어지</h1>
            <p className="text-sm text-text-secondary">
              {selectedCandidate
                ? `${selectedCandidate.name}님에 대해 질문해보세요`
                : '채용에 관한 모든 것을 물어보세요'}
            </p>
          </div>
        </div>

        {/* 선택된 후보자 표시 */}
        {selectedCandidate && (
          <div className="mt-3 bg-expert-navy/5 rounded-xl p-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-expert-navy/10 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-expert-navy" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-expert-navy">{selectedCandidate.name}</div>
              <div className="text-xs text-text-secondary">
                {selectedCandidate.licenseType} · {selectedCandidate.experience} ·{' '}
                {selectedCandidate.matchScore}% 매칭
              </div>
            </div>
            <Link href="/employer/concierge">
              <button className="text-xs text-text-tertiary">다른 질문 하기</button>
            </Link>
          </div>
        )}
      </div>

      {/* Messages */}
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
              <div
                className={`text-xs mt-1 ${
                  message.type === 'user' ? 'text-white/60' : 'text-text-tertiary'
                }`}
              >
                {message.timestamp.toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="w-8 h-8 bg-expert-navy rounded-full flex items-center justify-center mr-2">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-bg-secondary rounded-2xl px-4 py-3 rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" />
                <span
                  className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <span
                  className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* 카테고리 선택 (첫 메시지 이후, 후보자 미선택 시) */}
        {messages.length === 1 && !selectedCandidate && !selectedCategory && (
          <div className="space-y-3">
            <div className="text-sm text-text-secondary text-center">
              어떤 분야가 궁금하세요?
            </div>
            <div className="grid grid-cols-2 gap-2">
              {mockEmployerConciergeQA.suggestedQuestions.map((category) => (
                <button
                  key={category.category}
                  onClick={() => setSelectedCategory(category.category)}
                  className="bg-white border border-border-light rounded-xl p-3 text-left hover:border-expert-navy transition-colors"
                >
                  <div className="font-medium text-text-primary text-sm">
                    {category.category}
                  </div>
                  <div className="text-xs text-text-tertiary mt-1">
                    {category.questions.length}개의 추천 질문
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 추천 질문 (카테고리 선택 후 또는 후보자 선택 시) */}
        {(selectedCategory || selectedCandidate) && getSuggestedQuestions().length > 0 && (
          <div className="space-y-2">
            <div className="text-xs text-text-tertiary">추천 질문</div>
            {getSuggestedQuestions().map((question) => (
              <button
                key={question}
                onClick={() => handleSend(question)}
                className="w-full text-left bg-white border border-border-light rounded-xl px-4 py-3 text-sm text-text-primary hover:border-expert-navy transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        )}

        {/* 다음 액션 CTA (2개 이상 질문 시) */}
        {questionCount >= 2 && !isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-expert-navy/5 rounded-xl p-4 border border-expert-navy/10"
          >
            <div className="text-sm font-medium text-expert-navy mb-3">
              <Sparkles className="w-4 h-4 inline mr-1" />
              다음 단계를 추천드려요
            </div>
            <div className="space-y-2">
              {quickActions.map((action) => (
                <Link key={action.label} href={action.href}>
                  <div className="flex items-center justify-between bg-white rounded-lg p-3 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-expert-navy/10 rounded-full flex items-center justify-center">
                        <action.icon className="w-4 h-4 text-expert-navy" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">
                          {action.label}
                        </div>
                        <div className="text-xs text-text-tertiary">{action.description}</div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-text-tertiary" />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-border-light bg-white">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="채용 관련 질문을 입력하세요..."
            className="flex-1 px-4 py-3 bg-bg-secondary rounded-xl text-sm placeholder:text-text-tertiary"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="w-12 h-12 bg-expert-navy rounded-xl flex items-center justify-center disabled:opacity-50"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* 빠른 카테고리 변경 */}
        {selectedCategory && (
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
            {mockEmployerConciergeQA.suggestedQuestions.map((category) => (
              <button
                key={category.category}
                onClick={() => setSelectedCategory(category.category)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedCategory === category.category
                    ? 'bg-expert-navy text-white'
                    : 'bg-bg-secondary text-text-secondary'
                }`}
              >
                {category.category}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function EmployerConciergePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-secondary flex items-center justify-center">로딩 중...</div>}>
      <EmployerConciergeContent />
    </Suspense>
  );
}
