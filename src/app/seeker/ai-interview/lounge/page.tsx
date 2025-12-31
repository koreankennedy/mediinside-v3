'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Send,
  Bot,
  User,
  Sparkles,
  MessageCircle,
  FileText,
  Target,
  TrendingUp,
  Star,
  Coffee,
  Heart,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Lightbulb,
} from 'lucide-react';

interface Message {
  id: string;
  type: 'ai' | 'user' | 'system';
  content: string;
  timestamp: Date;
}

// 추천 질문 칩
const suggestedQuestions = [
  '면접 결과는 언제 나오나요?',
  '자기소개 잘하는 방법 알려주세요',
  '연봉 협상 팁이 있나요?',
  '이직 시 주의할 점은?',
];

// AI 코치 초기 메시지
const initialMessages: Message[] = [
  {
    id: '1',
    type: 'ai',
    content:
      '안녕하세요! 저는 AI 커리어 코치예요. 면접 준비, 이직 고민, 커리어 조언 등 무엇이든 물어보세요.\n\n어떤 도움이 필요하세요?',
    timestamp: new Date(),
  },
];

// 자주 묻는 주제
const coachingTopics = [
  {
    id: 'interview',
    icon: MessageCircle,
    label: '면접 준비',
    description: '면접 질문, 답변 팁',
    color: 'bg-brand-mint',
  },
  {
    id: 'resume',
    icon: FileText,
    label: '이력서 작성',
    description: '이력서 피드백, 개선',
    color: 'bg-info',
  },
  {
    id: 'career',
    icon: TrendingUp,
    label: '커리어 조언',
    description: '이직, 성장 방향',
    color: 'bg-warning',
  },
  {
    id: 'salary',
    icon: Briefcase,
    label: '연봉 협상',
    description: '연봉 가이드, 협상 팁',
    color: 'bg-success',
  },
];

// AI 응답 시뮬레이션
const getAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('면접') && lowerMessage.includes('결과')) {
    return '면접 결과는 보통 AI 면접 완료 후 1-2일 내에 1차 결과가 나와요. 병원에서 검토 후 2차 면접 여부를 알려드릴 거예요.\n\n결과가 나오면 앱으로 알림을 보내드릴게요!';
  }

  if (lowerMessage.includes('자기소개')) {
    return '좋은 자기소개를 위한 팁을 드릴게요!\n\n1. **구조화하기**: 현재-과거-미래 순서로 구성\n2. **1-2분 내외**: 간결하게 핵심만\n3. **지원 동기 연결**: 왜 이 병원인지\n4. **강점 어필**: 본인만의 차별점\n\n예시를 보여드릴까요?';
  }

  if (lowerMessage.includes('연봉') || lowerMessage.includes('협상')) {
    return '연봉 협상 팁을 알려드릴게요!\n\n1. **시장 조사**: MediInside 시장 리포트에서 평균 연봉 확인\n2. **본인 가치 정리**: 경력, 술기, 성과 등\n3. **희망 범위 제시**: 최소-최대 범위를 준비\n4. **타이밍**: 오퍼 받은 직후가 협상 적기\n\n구체적인 연봉 범위가 궁금하시면 시장 리포트를 확인해보세요!';
  }

  if (lowerMessage.includes('이직')) {
    return '이직을 고려하고 계시군요! 몇 가지 체크포인트를 드릴게요:\n\n✅ **이직 사유 정리**: 명확한 이유가 있어야 면접에서도 자신있게 답변 가능\n✅ **최소 경력**: 1년 미만 이직은 부정적 인상을 줄 수 있어요\n✅ **퇴사 전 구직**: 가능하면 재직 중에 이직처를 구하는 게 유리해요\n✅ **레퍼런스 확보**: 전 직장 동료/상사의 추천을 받아두세요\n\n더 구체적인 상황을 알려주시면 맞춤 조언을 드릴 수 있어요!';
  }

  return '좋은 질문이에요! 말씀해주신 부분에 대해 함께 이야기해볼까요?\n\n궁금한 점을 더 구체적으로 알려주시면, 더 정확한 답변을 드릴 수 있어요.';
};

export default function LoungePage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (customMessage?: string) => {
    const messageText = customMessage || inputValue;
    if (!messageText.trim()) return;

    // 사용자 메시지 추가
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
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(messageText),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleTopicClick = (topic: typeof coachingTopics[0]) => {
    const topicQuestions: Record<string, string> = {
      interview: '면접 준비 방법을 알려주세요',
      resume: '이력서 작성 팁을 알려주세요',
      career: '커리어 발전 방향에 대해 조언해주세요',
      salary: '연봉 협상 방법을 알려주세요',
    };
    handleSend(topicQuestions[topic.id]);
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-border-light">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-expert-navy rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-expert-navy">AI 커리어 코치</h1>
              <p className="text-sm text-text-secondary">AI 컨시어지</p>
            </div>
          </div>
        </div>
      </div>

      {/* 코칭 주제 (메시지가 적을 때만 표시) */}
      {messages.length <= 2 && (
        <div className="px-4 py-4 border-b border-border-light bg-white">
          <div className="text-sm font-medium text-text-secondary mb-3">무엇을 도와드릴까요?</div>
          <div className="grid grid-cols-2 gap-2">
            {coachingTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleTopicClick(topic)}
                className="p-3 bg-bg-secondary rounded-xl text-left hover:bg-bg-tertiary transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-6 h-6 ${topic.color} rounded-lg flex items-center justify-center`}>
                    <topic.icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-text-primary">{topic.label}</span>
                </div>
                <p className="text-xs text-text-tertiary">{topic.description}</p>
              </button>
            ))}
          </div>
        </div>
      )}

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
                  ? 'bg-brand-mint text-white rounded-br-sm'
                  : 'bg-white border border-border-light rounded-bl-sm'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.content}</p>
            </div>
          </motion.div>
        ))}

        {/* 타이핑 인디케이터 */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-expert-navy rounded-full flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-white border border-border-light rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" />
                <div
                  className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                />
                <div
                  className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* 추천 질문 칩 */}
      <div className="px-4 py-2 border-t border-border-light bg-white">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {suggestedQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSend(question)}
              className="flex-shrink-0 px-3 py-1.5 bg-bg-secondary rounded-full text-xs text-text-secondary hover:bg-bg-tertiary transition-colors"
            >
              {question}
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
            placeholder="무엇이든 물어보세요..."
            className="flex-1 px-4 py-3 bg-bg-secondary rounded-xl text-sm placeholder:text-text-tertiary"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isTyping}
            className="w-12 h-12 bg-expert-navy rounded-xl flex items-center justify-center disabled:opacity-50"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
