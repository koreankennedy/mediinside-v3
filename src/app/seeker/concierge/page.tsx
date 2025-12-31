'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Mic,
  MicOff,
  Send,
  ChevronDown,
  Sparkles,
  Building2,
  ArrowRight,
  Volume2,
  Check,
  HandCoins,
  HelpCircle,
  DollarSign,
  Clock,
  Users,
  TrendingUp,
  Bot,
  Heart,
  Phone,
  FileText,
  Target,
  BarChart3,
  Play,
  Pause,
  SkipForward,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Award,
  Briefcase,
  MapPin,
  Star,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Lightbulb,
  Brain,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { mockConciergeQA, mockHospitals } from '@/lib/mock/data';

type MessageRole = 'user' | 'assistant';

interface Message {
  id: number;
  role: MessageRole;
  content: string;
  timestamp: Date;
  extractedSkills?: string[];
}

interface InterviewQuestion {
  id: string;
  category: string;
  question: string;
  tips: string[];
  sampleAnswer?: string;
}

// 병원 목록
const hospitals = [
  { id: 'hospital-1', name: '청담리더스피부과', matchScore: 94, department: '피부과' },
  { id: 'hospital-2', name: '압구정미래성형외과', matchScore: 91, department: '성형외과' },
  { id: 'hospital-3', name: '신사동베스트피부과', matchScore: 88, department: '피부과' },
];

// 질문 카테고리
const questionCategories = [
  {
    id: 'salary',
    label: '급여/복리후생',
    icon: DollarSign,
    color: 'text-match-gold',
    bgColor: 'bg-match-gold/10',
  },
  {
    id: 'work',
    label: '근무환경',
    icon: Clock,
    color: 'text-info',
    bgColor: 'bg-info/10',
  },
  {
    id: 'team',
    label: '팀/문화',
    icon: Users,
    color: 'text-success',
    bgColor: 'bg-success/10',
  },
  {
    id: 'growth',
    label: '성장/커리어',
    icon: TrendingUp,
    color: 'text-brand-mint',
    bgColor: 'bg-brand-mint/10',
  },
];

// 모의인터뷰 질문
const interviewQuestions: InterviewQuestion[] = [
  {
    id: 'int-1',
    category: '자기소개',
    question: '간단한 자기소개와 함께 지원 동기를 말씀해주세요.',
    tips: ['1분 내외로 간결하게', '지원 병원과 연결되는 경험 강조', '긍정적인 마무리'],
    sampleAnswer: '안녕하세요, 저는 피부과 경력 3년차 간호사 OOO입니다. 저는 레이저 시술 보조와 환자 상담에 강점이 있으며, 특히 귀원의 환자 중심 철학에 깊이 공감하여 지원하게 되었습니다.',
  },
  {
    id: 'int-2',
    category: '경험',
    question: '이전 직장에서 가장 성취감을 느꼈던 경험은 무엇인가요?',
    tips: ['구체적인 상황 설명', '본인의 역할과 기여 강조', '결과와 배운 점 언급'],
  },
  {
    id: 'int-3',
    category: '역량',
    question: '환자가 시술 결과에 불만을 표시할 때 어떻게 대응하시겠어요?',
    tips: ['공감 먼저', '해결책 제시', '팀과의 협업 언급'],
    sampleAnswer: '먼저 환자분의 불만에 충분히 공감하고 경청하겠습니다. 그 후 담당 의료진과 상의하여 재시술이나 대안을 제시하고, 환자분이 안심할 수 있도록 꾸준히 소통하겠습니다.',
  },
  {
    id: 'int-4',
    category: '상황대처',
    question: '동시에 여러 환자를 케어해야 하는 상황에서 어떻게 우선순위를 정하시나요?',
    tips: ['응급도 기준 설명', '효율적인 시간 관리', '팀워크 활용'],
  },
  {
    id: 'int-5',
    category: '포부',
    question: '입사 후 1년, 3년 후 어떤 모습이 되어 있고 싶으신가요?',
    tips: ['현실적인 목표', '병원 발전과 연계', '자기계발 의지'],
  },
];

// 탭 정의 - 병원 Q&A에 집중, 모의인터뷰/진단은 AI면접 워크플로우로 분리
const tabs = [
  { id: 'qa', label: '병원 Q&A', icon: MessageCircle, description: '병원에 대해 물어보기' },
  { id: 'recommend', label: '맞춤 추천', icon: Target, description: '나에게 맞는 병원' },
];

// 진단 결과 데이터 (실제로는 fit-test 결과에서 가져옴)
const diagnosisResult = {
  type: 'achiever',
  typeName: '하이엔드 성과자',
  typeIcon: '🏆',
  description: '성과와 보상이 명확한 환경에서 뛰어난 성과를 내는 유형',
  scores: {
    stability: 35,
    growth: 85,
    culture: 60,
    compensation: 90,
  },
  strengths: ['목표 지향적', '자기 주도적', '성과 창출 능력'],
  recommendations: [
    '인센티브 제도가 명확한 병원',
    '성장 기회가 많은 환경',
    '실력을 인정받을 수 있는 조직',
  ],
};

// 추천 병원 데이터
const recommendedHospitals = [
  {
    id: 'rec-1',
    name: '청담리더스피부과',
    matchScore: 94,
    matchReasons: ['인센티브 제도 우수', '경력 성장 기회'],
    location: '강남구 청담동',
    salary: '380~450만원',
    department: '피부과',
    isNew: true,
  },
  {
    id: 'rec-2',
    name: '압구정미래성형외과',
    matchScore: 91,
    matchReasons: ['성과 보상 명확', '팀 분위기 좋음'],
    location: '강남구 압구정동',
    salary: '400~480만원',
    department: '성형외과',
    isNew: false,
  },
  {
    id: 'rec-3',
    name: '신사동베스트피부과',
    matchScore: 88,
    matchReasons: ['워라밸 우수', '교육 지원'],
    location: '강남구 신사동',
    salary: '350~420만원',
    department: '피부과',
    isNew: true,
  },
];

type TabType = 'qa' | 'recommend';

export default function ConciergePage() {
  const [activeTab, setActiveTab] = useState<TabType>('qa');
  const [selectedHospital, setSelectedHospital] = useState(hospitals[0]);
  const [showHospitalSelect, setShowHospitalSelect] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: `안녕하세요! ${hospitals[0].name}에 대해 궁금한 점을 물어보세요.\n\n아래 카테고리를 선택하시면 자주 묻는 질문을 보여드릴게요.`,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState<string[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 모의인터뷰 상태
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecordingInterview, setIsRecordingInterview] = useState(false);
  const [interviewAnswers, setInterviewAnswers] = useState<{ questionId: string; answer: string; rating?: number }[]>([]);
  const [showTips, setShowTips] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [interviewFeedback, setInterviewFeedback] = useState<string | null>(null);
  const [interviewMode, setInterviewMode] = useState<'practice' | 'realtime'>('practice');

  const currentHospitalQA = mockConciergeQA.hospitals[selectedHospital.id as keyof typeof mockConciergeQA.hospitals];
  const suggestedQuestions = mockConciergeQA.suggestedQuestions;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        role: 'assistant',
        content: `안녕하세요! ${selectedHospital.name}에 대해 궁금한 점을 물어보세요.\n\n아래 카테고리를 선택하시면 자주 묻는 질문을 보여드릴게요.`,
        timestamp: new Date(),
      },
    ]);
    setSelectedCategory(null);
    setExtractedSkills([]);
  }, [selectedHospital]);

  const handleSend = (text?: string) => {
    const content = text || inputValue.trim();
    if (!content) return;

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setSelectedCategory(null);
    setQuestionCount((prev) => prev + 1);

    setTimeout(() => {
      let response = '';
      let newSkills: string[] = [];

      if (currentHospitalQA?.questions) {
        const matchedQuestion = Object.keys(currentHospitalQA.questions).find(
          (q) => content.includes(q.replace('?', '')) || q.includes(content)
        );
        if (matchedQuestion) {
          response = currentHospitalQA.questions[matchedQuestion as keyof typeof currentHospitalQA.questions];
        }
      }

      if (!response) {
        if (content.includes('야근') || content.includes('퇴근')) {
          response = `${selectedHospital.name}의 야근 정보예요. 재직자 제보에 따르면 평균 월 2~4회 정도의 야근이 있고, 야근 수당은 확실히 지급된다고 해요.`;
        } else if (content.includes('급여') || content.includes('연봉')) {
          response = `${selectedHospital.name}의 급여 정보예요. 경력에 따라 380~450만원 수준이고, 여기에 인센티브가 추가돼요.`;
        } else if (content.includes('분위기') || content.includes('팀')) {
          response = `${selectedHospital.name}은 성과 중심이면서도 협력적인 분위기예요. 원장님이 직원들을 인정해주시는 편이라 동기부여가 잘 된다는 평가가 많아요.`;
        } else {
          response = `좋은 질문이에요! ${selectedHospital.name}에 대한 해당 정보는 더 확인이 필요해요. 다른 궁금한 점이 있으시면 편하게 물어보세요!`;
        }
      }

      if (content.includes('레이저') || content.includes('시술')) {
        newSkills = ['피부 레이저'];
        setExtractedSkills((prev) => [...new Set([...prev, ...newSkills])]);
      }

      const aiMessage: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        extractedSkills: newSkills.length > 0 ? newSkills : undefined,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1200);
  };

  const getCategoryQuestions = (categoryId: string) => {
    const category = suggestedQuestions.find((c) => c.category.includes(categoryId === 'salary' ? '급여' : categoryId === 'work' ? '근무' : categoryId === 'team' ? '팀' : '성장'));
    return category?.questions || [];
  };

  // 모의인터뷰 함수들
  const startInterview = () => {
    setInterviewStarted(true);
    setCurrentQuestionIndex(0);
    setInterviewAnswers([]);
    setInterviewFeedback(null);
  };

  const handleInterviewAnswer = (answer: string) => {
    const currentQuestion = interviewQuestions[currentQuestionIndex];
    setInterviewAnswers((prev) => [
      ...prev,
      { questionId: currentQuestion.id, answer },
    ]);

    // AI 피드백 시뮬레이션
    setTimeout(() => {
      const feedbacks = [
        '구체적인 사례를 잘 들어주셨어요! 결과를 수치로 표현하면 더 좋아요.',
        '좋은 답변이에요! 지원 병원의 특성과 연결지으면 더 인상적이에요.',
        '경험을 잘 설명해주셨네요. 배운 점을 한 문장으로 정리하면 완벽해요!',
        '열정이 느껴지는 답변이에요! 구체적인 행동 계획을 추가해보세요.',
      ];
      setInterviewFeedback(feedbacks[Math.floor(Math.random() * feedbacks.length)]);
    }, 1000);
  };

  const nextQuestion = () => {
    setInterviewFeedback(null);
    setShowTips(false);
    setShowSampleAnswer(false);
    if (currentQuestionIndex < interviewQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const finishInterview = () => {
    setInterviewStarted(false);
    setCurrentQuestionIndex(0);
  };

  const currentInterviewQuestion = interviewQuestions[currentQuestionIndex];

  // Q&A 탭 렌더링
  const renderQATab = () => (
    <div className="flex flex-col h-full">
      {/* Hospital Context Header */}
      <div className="px-4 py-3 bg-white border-b border-border-light">
        <button
          onClick={() => setShowHospitalSelect(!showHospitalSelect)}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-brand-mint/10 rounded-full flex items-center justify-center">
              <Building2 className="w-5 h-5 text-brand-mint" />
            </div>
            <div className="text-left">
              <div className="font-medium text-text-primary">{selectedHospital.name}</div>
              <div className="text-xs text-text-secondary">
                {selectedHospital.department} · {selectedHospital.matchScore}% 매칭
              </div>
            </div>
          </div>
          <ChevronDown
            className={`w-5 h-5 text-text-tertiary transition-transform ${
              showHospitalSelect ? 'rotate-180' : ''
            }`}
          />
        </button>

        <AnimatePresence>
          {showHospitalSelect && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 space-y-2 overflow-hidden"
            >
              {hospitals.map((hospital) => (
                <button
                  key={hospital.id}
                  onClick={() => {
                    setSelectedHospital(hospital);
                    setShowHospitalSelect(false);
                  }}
                  className={`w-full p-3 rounded-xl text-left transition-colors ${
                    selectedHospital.id === hospital.id
                      ? 'bg-brand-mint/10 border border-brand-mint'
                      : 'bg-bg-secondary hover:bg-bg-tertiary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium">{hospital.name}</span>
                      <span className="text-xs text-text-secondary ml-2">{hospital.department}</span>
                    </div>
                    <span className="text-sm text-brand-mint">{hospital.matchScore}%</span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.role === 'assistant' && (
              <div className="w-8 h-8 bg-brand-mint/10 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <Bot className="w-4 h-4 text-brand-mint" />
              </div>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-brand-mint text-white rounded-br-md'
                  : 'bg-white border border-border-light rounded-bl-md'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-line">{message.content}</p>
            </div>
          </motion.div>
        ))}

        {/* Question Categories */}
        {messages.length <= 2 && !selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <div className="text-xs text-text-tertiary text-center">무엇이 궁금하세요?</div>
            <div className="grid grid-cols-2 gap-2">
              {questionCategories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className="p-4 rounded-xl border border-border-light bg-white hover:border-brand-mint transition-all text-left"
                  >
                    <div className={`w-8 h-8 ${cat.bgColor} rounded-lg flex items-center justify-center mb-2`}>
                      <Icon className={`w-4 h-4 ${cat.color}`} />
                    </div>
                    <div className="text-sm font-medium text-text-primary">{cat.label}</div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Category Questions */}
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="text-xs text-text-tertiary">추천 질문</div>
              <button onClick={() => setSelectedCategory(null)} className="text-xs text-brand-mint">
                다른 카테고리 보기
              </button>
            </div>
            <div className="space-y-2">
              {getCategoryQuestions(selectedCategory).map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="w-full text-left px-4 py-3 bg-white border border-border-light rounded-xl text-sm text-text-primary hover:border-brand-mint transition-all"
                >
                  <HelpCircle className="w-4 h-4 text-brand-mint inline mr-2" />
                  {q}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="w-8 h-8 bg-brand-mint/10 rounded-full flex items-center justify-center mr-2">
              <Bot className="w-4 h-4 text-brand-mint" />
            </div>
            <div className="bg-white border border-border-light rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 bg-white border-t border-border-light">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="궁금한 점을 물어보세요..."
            className="flex-1 px-4 py-3 bg-bg-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-mint/20"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim()}
            className="p-3 bg-brand-mint text-white rounded-xl disabled:opacity-50 transition-opacity"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // 모의인터뷰 탭 렌더링
  const renderInterviewTab = () => (
    <div className="flex flex-col h-full">
      {!interviewStarted ? (
        // 인터뷰 시작 화면
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-brand-mint/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Mic className="w-8 h-8 text-brand-mint" />
            </div>
            <h2 className="text-xl font-bold text-expert-navy mb-2">AI 모의인터뷰</h2>
            <p className="text-sm text-text-secondary">
              실제 면접처럼 연습하고 AI 피드백을 받아보세요
            </p>
          </div>

          {/* 인터뷰 모드 선택 */}
          <div className="space-y-3 mb-6">
            <h3 className="text-sm font-medium text-text-primary">인터뷰 모드 선택</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setInterviewMode('practice')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  interviewMode === 'practice'
                    ? 'border-brand-mint bg-brand-mint/5'
                    : 'border-border-light bg-white'
                }`}
              >
                <Brain className={`w-6 h-6 mb-2 ${interviewMode === 'practice' ? 'text-brand-mint' : 'text-text-tertiary'}`} />
                <div className="font-medium text-text-primary text-sm">연습 모드</div>
                <div className="text-xs text-text-secondary mt-1">
                  질문별로 천천히 연습
                </div>
              </button>
              <button
                onClick={() => setInterviewMode('realtime')}
                className={`p-4 rounded-xl border text-left transition-all ${
                  interviewMode === 'realtime'
                    ? 'border-brand-mint bg-brand-mint/5'
                    : 'border-border-light bg-white'
                }`}
              >
                <Zap className={`w-6 h-6 mb-2 ${interviewMode === 'realtime' ? 'text-brand-mint' : 'text-text-tertiary'}`} />
                <div className="font-medium text-text-primary text-sm">실전 모드</div>
                <div className="text-xs text-text-secondary mt-1">
                  시간 제한으로 실전 연습
                </div>
              </button>
            </div>
          </div>

          {/* 준비된 질문 목록 */}
          <div className="bg-white rounded-2xl p-4 border border-border-light mb-6">
            <h3 className="text-sm font-medium text-text-primary mb-3">
              준비된 질문 ({interviewQuestions.length}개)
            </h3>
            <div className="space-y-2">
              {interviewQuestions.map((q, index) => (
                <div key={q.id} className="flex items-center gap-3 py-2">
                  <div className="w-6 h-6 bg-bg-secondary rounded-full flex items-center justify-center text-xs text-text-tertiary">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-brand-mint mr-2">{q.category}</span>
                    <span className="text-sm text-text-primary">{q.question.slice(0, 30)}...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 시작 버튼 */}
          <button
            onClick={startInterview}
            className="w-full bg-brand-mint text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            모의인터뷰 시작하기
          </button>
        </div>
      ) : (
        // 인터뷰 진행 화면
        <div className="flex-1 flex flex-col">
          {/* Progress Header */}
          <div className="px-4 py-3 bg-white border-b border-border-light">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-primary">
                질문 {currentQuestionIndex + 1} / {interviewQuestions.length}
              </span>
              <button
                onClick={finishInterview}
                className="text-sm text-text-secondary"
              >
                종료
              </button>
            </div>
            <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / interviewQuestions.length) * 100}%` }}
                className="h-full bg-brand-mint rounded-full"
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="flex-1 px-4 py-4 overflow-y-auto">
            <motion.div
              key={currentInterviewQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-5 border border-border-light mb-4"
            >
              <span className="text-xs bg-brand-mint/10 text-brand-mint px-2 py-1 rounded">
                {currentInterviewQuestion.category}
              </span>
              <h3 className="text-lg font-semibold text-expert-navy mt-3 mb-4">
                {currentInterviewQuestion.question}
              </h3>

              {/* Tips */}
              <button
                onClick={() => setShowTips(!showTips)}
                className="flex items-center gap-2 text-sm text-brand-mint"
              >
                <Lightbulb className="w-4 h-4" />
                답변 팁 보기
                <ChevronRight className={`w-4 h-4 transition-transform ${showTips ? 'rotate-90' : ''}`} />
              </button>
              <AnimatePresence>
                {showTips && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <ul className="mt-3 space-y-1">
                      {currentInterviewQuestion.tips.map((tip, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                          <Check className="w-3 h-3 text-success flex-shrink-0" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sample Answer */}
              {currentInterviewQuestion.sampleAnswer && (
                <>
                  <button
                    onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                    className="flex items-center gap-2 text-sm text-expert-navy mt-3"
                  >
                    <FileText className="w-4 h-4" />
                    모범 답안 보기
                    <ChevronRight className={`w-4 h-4 transition-transform ${showSampleAnswer ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {showSampleAnswer && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-3 p-3 bg-expert-navy/5 rounded-xl">
                          <p className="text-sm text-text-primary leading-relaxed">
                            {currentInterviewQuestion.sampleAnswer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>

            {/* AI Feedback */}
            <AnimatePresence>
              {interviewFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-success/10 border border-success/20 rounded-xl p-4 mb-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-success" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-success mb-1">AI 피드백</div>
                      <p className="text-sm text-text-primary">{interviewFeedback}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Answer Recording */}
            <div className="bg-white rounded-2xl p-4 border border-border-light">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-text-primary">답변 녹음</span>
                {isRecordingInterview && (
                  <span className="flex items-center gap-1 text-xs text-error">
                    <span className="w-2 h-2 bg-error rounded-full animate-pulse" />
                    녹음 중
                  </span>
                )}
              </div>
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => {
                    if (isRecordingInterview) {
                      setIsRecordingInterview(false);
                      handleInterviewAnswer('녹음된 답변 (시뮬레이션)');
                    } else {
                      setIsRecordingInterview(true);
                    }
                  }}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isRecordingInterview
                      ? 'bg-error animate-pulse'
                      : 'bg-brand-mint'
                  }`}
                >
                  {isRecordingInterview ? (
                    <Pause className="w-8 h-8 text-white" />
                  ) : (
                    <Mic className="w-8 h-8 text-white" />
                  )}
                </button>
              </div>
              <p className="text-xs text-text-tertiary text-center mt-3">
                {isRecordingInterview ? '버튼을 눌러 녹음을 종료하세요' : '버튼을 눌러 답변을 녹음하세요'}
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="px-4 py-4 bg-white border-t border-border-light">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setInterviewFeedback(null);
                  if (currentQuestionIndex > 0) {
                    setCurrentQuestionIndex((prev) => prev - 1);
                  }
                }}
                disabled={currentQuestionIndex === 0}
                className="flex-1 py-3 border border-border-light rounded-xl text-text-secondary disabled:opacity-50"
              >
                이전 질문
              </button>
              {currentQuestionIndex < interviewQuestions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="flex-1 py-3 bg-brand-mint text-white rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  다음 질문
                  <SkipForward className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={finishInterview}
                  className="flex-1 py-3 bg-expert-navy text-white rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  인터뷰 완료
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // 진단분석 탭 렌더링
  const renderAnalysisTab = () => (
    <div className="flex-1 px-4 py-4 overflow-y-auto">
      {/* Type Card */}
      <div className="bg-gradient-to-br from-brand-mint to-brand-mint-dark rounded-2xl p-5 text-white mb-4">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{diagnosisResult.typeIcon}</span>
          <div>
            <div className="text-sm text-white/70">나의 커리어 유형</div>
            <div className="text-xl font-bold">{diagnosisResult.typeName}</div>
          </div>
        </div>
        <p className="text-sm text-white/90">{diagnosisResult.description}</p>
      </div>

      {/* Score Chart */}
      <div className="bg-white rounded-2xl p-4 border border-border-light mb-4">
        <h3 className="font-medium text-text-primary mb-4">가치관 분석</h3>
        <div className="space-y-3">
          {Object.entries(diagnosisResult.scores).map(([key, value]) => {
            const labels: Record<string, string> = {
              stability: '안정성',
              growth: '성장',
              culture: '문화',
              compensation: '보상',
            };
            return (
              <div key={key}>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-text-secondary">{labels[key]}</span>
                  <span className="font-medium text-text-primary">{value}%</span>
                </div>
                <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="h-full bg-brand-mint rounded-full"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strengths */}
      <div className="bg-white rounded-2xl p-4 border border-border-light mb-4">
        <h3 className="font-medium text-text-primary mb-3">나의 강점</h3>
        <div className="flex flex-wrap gap-2">
          {diagnosisResult.strengths.map((strength, index) => (
            <span
              key={index}
              className="px-3 py-1.5 bg-success/10 text-success text-sm rounded-full"
            >
              {strength}
            </span>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl p-4 border border-border-light">
        <h3 className="font-medium text-text-primary mb-3">이런 환경이 맞아요</h3>
        <ul className="space-y-2">
          {diagnosisResult.recommendations.map((rec, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-text-primary">
              <CheckCircle className="w-4 h-4 text-brand-mint flex-shrink-0" />
              {rec}
            </li>
          ))}
        </ul>
      </div>

      {/* Re-diagnosis CTA */}
      <Link href="/seeker/fit-test">
        <button className="w-full mt-4 py-3 border border-brand-mint text-brand-mint rounded-xl font-medium flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4" />
          진단 다시하기
        </button>
      </Link>
    </div>
  );

  // 추천 탭 렌더링
  const renderRecommendTab = () => (
    <div className="flex-1 px-4 py-4 overflow-y-auto">
      {/* Recommendation Summary */}
      <div className="bg-expert-navy/5 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-expert-navy" />
          <span className="text-sm font-medium text-expert-navy">AI 맞춤 추천</span>
        </div>
        <p className="text-sm text-text-secondary">
          회원님의 &apos;{diagnosisResult.typeName}&apos; 유형에 맞는 병원을 추천해드려요.
          성과와 보상이 명확한 환경을 우선적으로 선별했어요.
        </p>
      </div>

      {/* Recommended Hospitals */}
      <div className="space-y-3">
        {recommendedHospitals.map((hospital, index) => (
          <motion.div
            key={hospital.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {hospital.isNew && (
                  <span className="text-xs bg-error text-white px-2 py-0.5 rounded">NEW</span>
                )}
                <span className="text-xs bg-bg-secondary text-text-tertiary px-2 py-0.5 rounded">
                  {hospital.department}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-match-gold fill-match-gold" />
                <span className="text-sm font-bold text-match-gold">{hospital.matchScore}%</span>
              </div>
            </div>

            <h3 className="font-semibold text-text-primary mb-2">{hospital.name}</h3>

            <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {hospital.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3 h-3" />
                {hospital.salary}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mb-3">
              {hospital.matchReasons.map((reason, i) => (
                <span
                  key={i}
                  className="text-xs bg-brand-mint/10 text-brand-mint px-2 py-1 rounded"
                >
                  {reason}
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <Link href="/seeker/matching-center" className="flex-1">
                <button className="w-full py-2.5 border border-border-light rounded-xl text-sm text-text-secondary">
                  상세정보
                </button>
              </Link>
              <button className="flex-1 py-2.5 bg-brand-mint text-white rounded-xl text-sm font-medium">
                관심 등록
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* More Button */}
      <Link href="/seeker/matching-center">
        <button className="w-full mt-4 py-3 border border-brand-mint text-brand-mint rounded-xl font-medium">
          더 많은 병원 보기
        </button>
      </Link>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      {/* Tab Navigation */}
      <div className="px-4 py-3 bg-white border-b border-border-light">
        <div className="flex gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                  activeTab === tab.id
                    ? 'bg-brand-mint text-white'
                    : 'bg-bg-secondary text-text-secondary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
        {/* AI면접 바로가기 */}
        <Link href="/seeker/ai-interview" className="block mt-3">
          <div className="flex items-center justify-between p-3 bg-expert-navy/5 rounded-xl border border-expert-navy/10">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-expert-navy" />
              <div>
                <span className="text-sm font-medium text-expert-navy">AI면접 준비하기</span>
                <p className="text-xs text-text-tertiary">모의면접, 피드백, 실전연습</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-expert-navy" />
          </div>
        </Link>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden bg-bg-secondary">
        {activeTab === 'qa' && renderQATab()}
        {activeTab === 'recommend' && renderRecommendTab()}
      </div>
    </div>
  );
}
