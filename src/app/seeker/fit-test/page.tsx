'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Share2,
  Download,
  Target,
  TrendingUp,
  Heart,
  Shield,
  Building2,
  Users,
  MessageCircle,
  Star,
  Award,
  ChevronRight,
  FileText,
  Upload,
  Bot,
  Send,
  CheckCircle,
  Loader2,
  ClipboardList,
  Zap,
  Copy,
  X,
  Link as LinkIcon,
  MessageSquare,
  Gift,
} from 'lucide-react';
import Link from 'next/link';
import { mockFitTestQuestions, mockRecommendedDepartments, mockRecommendedHospitals, mockSimilarPeers } from '@/lib/mock/data';

type FitType = 'high_end_achiever' | 'practical_expert' | 'self_actualizer' | 'trust_centered_expert';
type DiagnosisMode = 'test' | 'resume-ai' | 'ai-chat';

// 채용상품 정보
const hiringProducts = {
  'HP-SHARE': {
    code: 'HP-SHARE',
    label: '매출 셰어',
    description: '매출의 1% 인센티브',
    color: '#FF2D55',
    targetType: 'high_end_achiever',
  },
  'HP-BONUS': {
    code: 'HP-BONUS',
    label: '근속 보너스',
    description: '1년 200만, 3년 500만',
    color: '#AF52DE',
    targetType: 'trust_centered_expert',
  },
  'HP-VACATION': {
    code: 'HP-VACATION',
    label: '휴가 자유',
    description: '연차 자유사용 보장',
    color: '#5AC8FA',
    targetType: 'self_actualizer',
  },
  'HP-ALLOWANCE': {
    code: 'HP-ALLOWANCE',
    label: '수당 보장',
    description: '야근/주말 150%',
    color: '#FF9500',
    targetType: 'practical_expert',
  },
};

// 성향별 추천 채용상품 매핑
const fitTypeToProducts: Record<FitType, string[]> = {
  high_end_achiever: ['HP-SHARE', 'HP-ALLOWANCE', 'HP-BONUS'],
  practical_expert: ['HP-ALLOWANCE', 'HP-BONUS', 'HP-SHARE'],
  self_actualizer: ['HP-VACATION', 'HP-BONUS', 'HP-SHARE'],
  trust_centered_expert: ['HP-BONUS', 'HP-VACATION', 'HP-ALLOWANCE'],
};

const fitTypeInfo: Record<FitType, {
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  traits: string[];
  workStyle: {
    summary: string;
    strengths: string[];
    environment: string;
    motivation: string;
  };
}> = {
  high_end_achiever: {
    label: '하이엔드 성과자',
    description: '성과 보상과 성장 기회를 중시해요. 인센티브가 강한 대형 병원과 잘 맞아요.',
    icon: TrendingUp,
    color: 'text-match-gold',
    traits: ['목표 지향적', '성과 중심', '도전적', '승부욕 강함'],
    workStyle: {
      summary: '당신은 도전적인 환경에서 최고의 성과를 내는 타입이에요.',
      strengths: ['빠른 의사결정', '성과 창출 능력', '목표 달성 의지', '경쟁 상황에서의 집중력'],
      environment: '성과에 따른 보상이 명확하고, 성장 기회가 많은 대형 병원',
      motivation: '인센티브, 승진 기회, 전문성 인정',
    },
  },
  practical_expert: {
    label: '실리적 전문가',
    description: '급여와 워라밸을 중시해요. 조건이 좋고 안정적인 병원과 잘 맞아요.',
    icon: Target,
    color: 'text-info',
    traits: ['실용적', '균형 중시', '효율적', '체계적'],
    workStyle: {
      summary: '당신은 안정적인 환경에서 효율적으로 능력을 발휘하는 타입이에요.',
      strengths: ['효율적 업무 처리', '시간 관리 능력', '체계적인 접근', '꼼꼼한 업무 수행'],
      environment: '근무 조건이 명확하고, 체계가 잘 잡힌 병원',
      motivation: '정당한 보상, 예측 가능한 일정, 업무-생활 균형',
    },
  },
  self_actualizer: {
    label: '자아실현가',
    description: '의미 있는 일과 성장을 중시해요. 교육/연구가 활발한 병원과 잘 맞아요.',
    icon: Heart,
    color: 'text-error',
    traits: ['성장 지향', '학습 열정', '창의적', '자기주도적'],
    workStyle: {
      summary: '당신은 자율적인 환경에서 창의성을 발휘하며 성장하는 타입이에요.',
      strengths: ['자기주도적 학습', '창의적 문제해결', '새로운 시도', '지속적 성장 의지'],
      environment: '교육과 성장 기회가 많고, 자율성이 보장되는 병원',
      motivation: '학습 기회, 의미 있는 업무, 전문성 개발',
    },
  },
  trust_centered_expert: {
    label: '신뢰 중심 전문가',
    description: '좋은 동료와 안정성을 중시해요. 가족적 분위기의 병원과 잘 맞아요.',
    icon: Shield,
    color: 'text-success',
    traits: ['협력적', '신뢰 중시', '안정 추구', '관계 지향'],
    workStyle: {
      summary: '당신은 신뢰할 수 있는 팀과 함께할 때 최고의 역량을 발휘하는 타입이에요.',
      strengths: ['팀워크', '신뢰 구축 능력', '안정적인 업무 수행', '동료 지원'],
      environment: '가족적인 분위기에서 오래 근속하는 직원이 많은 병원',
      motivation: '좋은 동료, 안정적인 고용, 소속감',
    },
  },
};

// 진단 모드 옵션
const diagnosisModes = [
  {
    id: 'test' as DiagnosisMode,
    icon: ClipboardList,
    title: '25문항 정밀 진단',
    subtitle: '가장 정확한 분석',
    description: '성향 테스트 + 희망조건 입력으로 정확한 매칭',
    time: '약 10분',
    recommended: true,
  },
  {
    id: 'resume-ai' as DiagnosisMode,
    icon: FileText,
    title: '이력서 + AI 대화',
    subtitle: '이력서 기반 빠른 분석',
    description: '이력서 업로드 후 AI와 대화하며 성향 파악',
    time: '약 5분',
    recommended: false,
  },
  {
    id: 'ai-chat' as DiagnosisMode,
    icon: Bot,
    title: 'AI와 자유롭게 대화',
    subtitle: '편하게 대화하기',
    description: 'AI와 자연스러운 대화로 맞춤 병원 추천',
    time: '약 3분',
    recommended: false,
  },
];

// 근로조건 옵션들
const workConditionOptions = {
  salaryRange: [
    { value: '300-350', label: '300~350만원' },
    { value: '350-400', label: '350~400만원' },
    { value: '400-450', label: '400~450만원' },
    { value: '450-500', label: '450~500만원' },
    { value: '500+', label: '500만원 이상' },
  ],
  workType: [
    { value: 'full-time', label: '정규직 (풀타임)' },
    { value: 'part-time', label: '파트타임' },
    { value: 'contract', label: '계약직' },
    { value: 'flexible', label: '유연근무제' },
  ],
  workHours: [
    { value: 'standard', label: '주 5일 (09:00~18:00)' },
    { value: 'half-saturday', label: '주 5.5일 (토요일 반일)' },
    { value: 'no-overtime', label: '야근 없는 곳' },
    { value: 'flexible-hours', label: '자율 출퇴근' },
  ],
  compensationType: [
    { value: 'base-high', label: '고정급 높은 곳' },
    { value: 'incentive', label: '인센티브가 큰 곳' },
    { value: 'balanced', label: '기본급 + 인센티브 밸런스' },
    { value: 'welfare', label: '복리후생이 좋은 곳' },
  ],
  priorities: [
    { value: 'salary', label: '급여가 최우선' },
    { value: 'balance', label: '워라밸이 최우선' },
    { value: 'growth', label: '성장/커리어가 최우선' },
    { value: 'stability', label: '안정성이 최우선' },
    { value: 'culture', label: '좋은 동료/문화가 최우선' },
  ],
};

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
}

// 파싱된 이력서 데이터 (mock)
const parsedResumeData = {
  name: '김지원',
  position: '치과위생사',
  experience: '3년 2개월',
  currentHospital: '강남스마일치과',
  skills: ['스케일링', '레진 충전 보조', '임플란트 보조', 'X-ray 촬영'],
  certifications: ['치과위생사 면허', '심폐소생술(CPR) 자격증'],
  education: '서울보건대학교 치위생과',
  summary: '피부과 및 치과에서 3년 이상의 경력을 보유한 치과위생사입니다. 환자 상담과 시술 보조에 강점이 있으며, 꼼꼼하고 친절한 응대로 환자 만족도가 높습니다.',
};

export default function FitTestPage() {
  const router = useRouter();
  const [stage, setStage] = useState<'menu' | 'test' | 'conditions' | 'resume' | 'resume-parsed' | 'ai-chat' | 'result'>('menu');
  const [selectedMode, setSelectedMode] = useState<DiagnosisMode | null>(null);

  // 테스트 모드 상태
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [xScore, setXScore] = useState(0);
  const [yScore, setYScore] = useState(0);
  const [fitType, setFitType] = useState<FitType>('high_end_achiever');
  const [resultTab, setResultTab] = useState<'overview' | 'departments' | 'hospitals' | 'peers'>('overview');

  // 근로조건 상태
  const [workConditions, setWorkConditions] = useState({
    salaryRange: '',
    workType: '',
    workHours: '',
    compensationType: '',
    priorities: '',
  });
  const [conditionStep, setConditionStep] = useState(0);

  // 이력서 모드 상태
  const [resumeUploaded, setResumeUploaded] = useState(false);
  const [resumeAnalyzing, setResumeAnalyzing] = useState(false);
  const [resumeAnalyzed, setResumeAnalyzed] = useState(false);

  // AI 채팅 상태
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 공유하기 모달 상태
  const [showShareModal, setShowShareModal] = useState(false);

  // 빠른 클릭 방지
  const [isProcessing, setIsProcessing] = useState(false);

  const questions = mockFitTestQuestions;
  const totalQuestions = questions.length;
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;

  // 점수 계산
  useEffect(() => {
    let x = 0;
    let y = 0;

    Object.entries(answers).forEach(([qId, value]) => {
      const question = questions.find((q) => q.id === parseInt(qId));
      if (question) {
        const score = (value - 2.5) * 2;
        x += question.xWeight * score;
        y += question.yWeight * score;
      }
    });

    setXScore(x);
    setYScore(y);
  }, [answers, questions]);

  // 유형 결정
  const determineFitType = (): FitType => {
    if (xScore >= 0 && yScore >= 0) return 'high_end_achiever';
    if (xScore >= 0 && yScore < 0) return 'practical_expert';
    if (xScore < 0 && yScore >= 0) return 'self_actualizer';
    return 'trust_centered_expert';
  };

  const handleAnswer = (value: number) => {
    // 빠른 클릭 방지
    if (isProcessing) return;
    setIsProcessing(true);

    const newAnswers = { ...answers, [questions[currentQuestion].id]: value };
    setAnswers(newAnswers);

    if (currentQuestion < totalQuestions - 1) {
      setTimeout(() => {
        setCurrentQuestion((prev) => prev + 1);
        setIsProcessing(false);
      }, 300);
    } else {
      // 마지막 답변 포함하여 점수 계산
      let x = 0;
      let y = 0;
      Object.entries(newAnswers).forEach(([qId, val]) => {
        const question = questions.find((q) => q.id === parseInt(qId));
        if (question) {
          const score = ((val as number) - 2.5) * 2;
          x += question.xWeight * score;
          y += question.yWeight * score;
        }
      });

      // 유형 결정
      let type: FitType;
      if (x >= 0 && y >= 0) type = 'high_end_achiever';
      else if (x >= 0 && y < 0) type = 'practical_expert';
      else if (x < 0 && y >= 0) type = 'self_actualizer';
      else type = 'trust_centered_expert';

      setXScore(x);
      setYScore(y);
      setFitType(type);

      // 안전하게 상태 전환
      setTimeout(() => {
        setStage('conditions');
        setIsProcessing(false);
      }, 300);
    }
  };

  // 근로조건 설정 단계
  const conditionSteps = [
    { key: 'salaryRange', title: '희망 급여 범위', subtitle: '세전 월급 기준으로 선택해주세요' },
    { key: 'workType', title: '희망 근로 형태', subtitle: '어떤 형태로 일하고 싶으세요?' },
    { key: 'workHours', title: '희망 근무 시간', subtitle: '선호하는 근무 시간대를 선택해주세요' },
    { key: 'compensationType', title: '선호하는 보상 유형', subtitle: '어떤 보상 구조를 원하세요?' },
    { key: 'priorities', title: '가장 중요한 가치', subtitle: '직장 선택 시 가장 중요한 것은?' },
  ];

  const handleConditionSelect = (key: string, value: string) => {
    // 빠른 클릭 방지
    if (isProcessing) return;
    setIsProcessing(true);

    setWorkConditions((prev) => ({ ...prev, [key]: value }));

    if (conditionStep < conditionSteps.length - 1) {
      setTimeout(() => {
        setConditionStep((prev) => prev + 1);
        setIsProcessing(false);
      }, 200);
    } else {
      setTimeout(() => {
        setStage('result');
        setIsProcessing(false);
      }, 300);
    }
  };

  const handleConditionBack = () => {
    if (conditionStep > 0) {
      setConditionStep((prev) => prev - 1);
    } else {
      setStage('test');
      setCurrentQuestion(totalQuestions - 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  // 이력서 분석
  const handleResumeUpload = () => {
    setResumeUploaded(true);
    setResumeAnalyzing(true);

    setTimeout(() => {
      setResumeAnalyzing(false);
      setResumeAnalyzed(true);
      // 파싱 결과 화면으로 이동 (AI 채팅 전에)
      setStage('resume-parsed');
    }, 2000);
  };

  // 이력서 파싱 결과 확인 후 AI 대화 시작
  const startAIChatAfterResume = () => {
    setMessages([
      {
        id: '1',
        type: 'ai',
        content: `${parsedResumeData.name}님, 이력서를 확인했어요!\n\n${parsedResumeData.experience} 경력의 ${parsedResumeData.position}이시네요. ${parsedResumeData.currentHospital}에서 근무 중이시고요.\n\n몇 가지 질문을 드릴게요. 현재 직장에서 가장 만족스러운 점은 무엇인가요?`,
      },
    ]);
    setStage('ai-chat');
  };

  // AI 채팅 메시지 전송
  const handleSendMessage = (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageText,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const aiResponses: Record<string, string> = {
        '급여': '급여를 중시하시는군요! 인센티브가 좋은 곳과 고정급이 높은 곳 중 어떤 걸 선호하세요?',
        '워라밸': '워라밸을 중요하게 생각하시네요. 주 5일 근무가 가능한 곳을 찾아드릴게요. 야근은 어느 정도까지 괜찮으세요?',
        '성장': '성장과 커리어를 중시하시네요! 교육이나 학회 지원이 활발한 병원을 추천드릴게요.',
        'default': '좋은 답변 감사해요! 그럼 다음 질문이에요. 이직을 고려하시는 가장 큰 이유가 뭔가요?',
      };

      let response = aiResponses.default;
      Object.keys(aiResponses).forEach((key) => {
        if (messageText.includes(key)) {
          response = aiResponses[key];
        }
      });

      // 메시지가 3개 이상이면 결과 제안
      if (messages.length >= 4) {
        response = '대화를 통해 성향을 파악했어요!\n\n당신은 **실리적 전문가** 유형이에요. 급여와 워라밸의 균형을 중시하는 실용적인 분이시네요.\n\n이 유형에 맞는 병원을 추천해드릴까요?';
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // 스크롤 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 모드 선택 시작
  const startDiagnosis = (mode: DiagnosisMode) => {
    setSelectedMode(mode);
    if (mode === 'test') {
      setStage('test');
    } else if (mode === 'resume-ai') {
      setStage('resume');
    } else {
      setStage('ai-chat');
      setMessages([
        {
          id: '1',
          type: 'ai',
          content: '안녕하세요! AI 커리어 어드바이저예요.\n\n편하게 대화하면서 당신에게 맞는 병원을 찾아드릴게요. 먼저, 현재 어떤 일을 하고 계신가요? (또는 어떤 분야에서 일하고 싶으세요?)',
        },
      ]);
    }
  };

  // ============================================
  // 메뉴 화면 (진단 모드 선택)
  // ============================================
  if (stage === 'menu') {
    return (
      <div className="px-4 py-6">
        <div className="mb-6">
          <h1 className="text-dashboard-title">매칭 핏 정밀진단</h1>
          <p className="text-sm text-text-secondary mt-1">
            나에게 맞는 방법으로 진단해보세요
          </p>
        </div>

        {/* 2x2 매트릭스 미리보기 */}
        <div className="bg-expert-navy/5 rounded-2xl p-4 mb-6 border border-expert-navy/10">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 relative flex-shrink-0">
              <div className="absolute inset-0 border-2 border-expert-navy/30 rounded-lg" />
              <div className="absolute top-1/2 left-0 right-0 border-t border-expert-navy/30" />
              <div className="absolute left-1/2 top-0 bottom-0 border-l border-expert-navy/30" />
              <div className="absolute top-1 right-1 w-2 h-2 bg-match-gold rounded-full" />
              <div className="absolute top-1 left-1 w-2 h-2 bg-error rounded-full" />
              <div className="absolute bottom-1 right-1 w-2 h-2 bg-info rounded-full" />
              <div className="absolute bottom-1 left-1 w-2 h-2 bg-success rounded-full" />
            </div>
            <div>
              <div className="font-semibold text-expert-navy">4가지 매칭핏 유형</div>
              <div className="text-sm text-text-secondary">
                선배들의 실제 데이터로 만든 정확한 진단
              </div>
            </div>
          </div>
        </div>

        {/* 진단 모드 선택 */}
        <div className="space-y-3">
          {diagnosisModes.map((mode, index) => (
            <motion.button
              key={mode.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => startDiagnosis(mode.id)}
              className={`w-full text-left bg-white rounded-2xl p-4 border-2 transition-all ${
                mode.recommended ? 'border-brand-mint' : 'border-border-light'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  mode.recommended ? 'bg-brand-mint' : 'bg-bg-secondary'
                }`}>
                  <mode.icon className={`w-6 h-6 ${mode.recommended ? 'text-white' : 'text-expert-navy'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text-primary">{mode.title}</span>
                    {mode.recommended && (
                      <span className="text-xs bg-brand-mint/10 text-brand-mint px-2 py-0.5 rounded-full">
                        추천
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-text-secondary mt-0.5">{mode.description}</div>
                  <div className="text-xs text-text-tertiary mt-2 flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {mode.time}
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-tertiary" />
              </div>
            </motion.button>
          ))}
        </div>

        {/* 이미 진단받은 경우 */}
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              // 이전 진단 결과가 있다고 가정하고 결과 화면으로 이동
              setFitType('practical_expert'); // 기본 결과 유형 설정
              setStage('result');
            }}
            className="text-sm text-text-tertiary"
          >
            이미 진단을 받으셨나요? <span className="text-brand-mint underline">결과 보기</span>
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // 이력서 업로드 + AI 대화 모드
  // ============================================
  if (stage === 'resume') {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)]">
        {/* Header */}
        <div className="px-4 py-4 border-b border-border-light bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStage('menu')}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
            >
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-expert-navy">이력서 + AI 대화</h1>
              <p className="text-sm text-text-secondary">이력서를 기반으로 성향을 파악해요</p>
            </div>
          </div>
        </div>

        {!resumeAnalyzed && (
          <div className="flex-1 flex flex-col items-center justify-center p-4">
            {!resumeUploaded ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-brand-mint/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Upload className="w-10 h-10 text-brand-mint" />
                </div>
                <h2 className="text-xl font-bold text-expert-navy mb-2">이력서를 업로드해주세요</h2>
                <p className="text-text-secondary mb-8">
                  PDF, Word, 이미지 파일 모두 가능해요
                </p>
                <button
                  onClick={handleResumeUpload}
                  className="btn-primary"
                >
                  <FileText className="w-5 h-5 mr-2" />
                  이력서 업로드
                </button>
                <button className="block w-full mt-3 text-sm text-text-tertiary">
                  사람인/잡코리아에서 불러오기
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center"
              >
                <Loader2 className="w-12 h-12 text-brand-mint animate-spin mx-auto mb-4" />
                <div className="text-lg font-semibold text-expert-navy">이력서 분석 중...</div>
                <div className="text-sm text-text-secondary mt-2">경력과 스킬을 파악하고 있어요</div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    );
  }

  // ============================================
  // 이력서 파싱 결과 화면 (AI 대화 전)
  // ============================================
  if (stage === 'resume-parsed') {
    return (
      <div className="flex flex-col min-h-[calc(100vh-140px)]">
        {/* Header */}
        <div className="px-4 py-4 border-b border-border-light bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setStage('resume');
                setResumeUploaded(false);
                setResumeAnalyzed(false);
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
            >
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-expert-navy">이력서 분석 완료</h1>
              <p className="text-sm text-text-secondary">파싱된 정보를 확인해주세요</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-4 overflow-y-auto">
          {/* 기본 정보 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 border border-border-light mb-4"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-brand-mint/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-expert-navy">{parsedResumeData.name}</h2>
                <p className="text-sm text-text-secondary">{parsedResumeData.position}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg-secondary rounded-xl p-3">
                <div className="text-xs text-text-tertiary">총 경력</div>
                <div className="font-semibold text-text-primary">{parsedResumeData.experience}</div>
              </div>
              <div className="bg-bg-secondary rounded-xl p-3">
                <div className="text-xs text-text-tertiary">현 직장</div>
                <div className="font-semibold text-text-primary">{parsedResumeData.currentHospital}</div>
              </div>
            </div>
          </motion.div>

          {/* 보유 스킬 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 border border-border-light mb-4"
          >
            <h3 className="text-card-title mb-3">보유 스킬</h3>
            <div className="flex flex-wrap gap-2">
              {parsedResumeData.skills.map((skill) => (
                <span key={skill} className="px-3 py-1.5 bg-brand-mint/10 text-brand-mint rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* 자격증 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 border border-border-light mb-4"
          >
            <h3 className="text-card-title mb-3">자격증</h3>
            <div className="space-y-2">
              {parsedResumeData.certifications.map((cert) => (
                <div key={cert} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  <span className="text-sm text-text-primary">{cert}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 학력 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 border border-border-light mb-4"
          >
            <h3 className="text-card-title mb-3">학력</h3>
            <p className="text-sm text-text-primary">{parsedResumeData.education}</p>
          </motion.div>

          {/* AI 요약 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-brand-mint/5 border border-brand-mint/20 rounded-2xl p-4 mb-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-brand-mint" />
              <span className="text-sm font-medium text-brand-mint">AI 요약</span>
            </div>
            <p className="text-sm text-text-primary leading-relaxed">{parsedResumeData.summary}</p>
          </motion.div>
        </div>

        {/* 하단 CTA */}
        <div className="px-4 py-4 border-t border-border-light bg-white">
          <button
            onClick={startAIChatAfterResume}
            className="w-full bg-brand-mint text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Bot className="w-5 h-5" />
            AI와 대화 시작하기
          </button>
          <p className="text-xs text-text-tertiary text-center mt-2">
            AI가 몇 가지 질문을 통해 맞춤 병원을 추천해드려요
          </p>
        </div>
      </div>
    );
  }

  // ============================================
  // AI 자유 대화 모드 (이력서 기반 또는 독립 대화)
  // ============================================
  if (stage === 'ai-chat') {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)]">
        {/* Header */}
        <div className="px-4 py-4 border-b border-border-light bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setStage('menu')}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
            >
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-mint rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-expert-navy">AI 커리어 어드바이저</h1>
                <p className="text-sm text-text-secondary">편하게 대화해주세요</p>
              </div>
            </div>
          </div>
        </div>

        {/* 채팅 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'ai' && (
                <div className="w-8 h-8 bg-brand-mint rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-brand-mint text-white rounded-br-sm'
                    : 'bg-bg-secondary text-text-primary rounded-bl-sm'
                }`}
              >
                <div className="text-sm whitespace-pre-line">{message.content}</div>
              </div>
            </motion.div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-brand-mint rounded-full flex items-center justify-center mr-2">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-bg-secondary rounded-2xl px-4 py-3 rounded-bl-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <span className="w-2 h-2 bg-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 빠른 응답 */}
        <div className="px-4 py-2 border-t border-border-light">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {messages.length <= 1 ? (
              ['피부과에서 일해요', '치과위생사예요', '병원 간호사예요'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  className="flex-shrink-0 px-3 py-1.5 bg-bg-secondary rounded-full text-xs text-text-secondary"
                >
                  {chip}
                </button>
              ))
            ) : messages.length >= 5 ? (
              <button
                onClick={() => {
                  setFitType('practical_expert');
                  setStage('result');
                }}
                className="w-full bg-brand-mint text-white py-2.5 rounded-xl font-semibold text-sm"
              >
                맞춤 병원 추천받기
              </button>
            ) : (
              ['급여가 중요해요', '워라밸 중시해요', '성장하고 싶어요', '좋은 동료가 중요해요'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => handleSendMessage(chip)}
                  className="flex-shrink-0 px-3 py-1.5 bg-bg-secondary rounded-full text-xs text-text-secondary"
                >
                  {chip}
                </button>
              ))
            )}
          </div>
        </div>

        {/* 입력 */}
        <div className="px-4 py-4 border-t border-border-light bg-white">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-4 py-3 bg-bg-secondary rounded-xl text-sm placeholder:text-text-tertiary"
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputValue.trim()}
              className="w-12 h-12 bg-brand-mint rounded-xl flex items-center justify-center disabled:opacity-50"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // 테스트 화면 (기존 25문항)
  // ============================================
  if (stage === 'test') {
    const currentQ = questions[currentQuestion];

    return (
      <div className="px-4 py-6 flex flex-col min-h-[calc(100vh-8rem)]">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => currentQuestion === 0 ? setStage('menu') : handleBack()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <span className="text-sm text-text-secondary">
            {currentQuestion + 1} / {totalQuestions}
          </span>
          <div className="w-10" />
        </div>

        {/* 진행바 */}
        <div className="progress-bar mb-8">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* 질문 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1"
          >
            <h2 className="text-xl font-bold text-expert-navy mb-2">
              {currentQ.text}
            </h2>
            <p className="text-sm text-text-secondary mb-8">
              아래에서 본인의 생각과 가장 가까운 것을 선택하세요.
            </p>

            {/* 5점 척도 */}
            <div className="space-y-3">
              {[
                { value: 1, label: '전혀 아니다' },
                { value: 2, label: '' },
                { value: 3, label: '보통이다' },
                { value: 4, label: '' },
                { value: 5, label: '매우 그렇다' },
              ].map((option) => (
                <motion.button
                  key={option.value}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAnswer(option.value)}
                  className={`w-full p-4 rounded-2xl text-left transition-all border-2 ${
                    answers[currentQ.id] === option.value
                      ? 'border-brand-mint bg-brand-mint/5'
                      : 'border-border-light bg-white hover:border-brand-mint/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQ.id] === option.value
                          ? 'border-brand-mint bg-brand-mint'
                          : 'border-border-light'
                      }`}
                    >
                      {answers[currentQ.id] === option.value && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span
                      className={
                        answers[currentQ.id] === option.value
                          ? 'text-brand-mint font-medium'
                          : 'text-text-primary'
                      }
                    >
                      {option.label || `${option.value}점`}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ============================================
  // 근로조건 설정 화면
  // ============================================
  if (stage === 'conditions') {
    const currentStep = conditionSteps[conditionStep] || conditionSteps[0];
    const options = workConditionOptions[currentStep?.key as keyof typeof workConditionOptions] || [];

    if (!currentStep || !options.length) {
      setStage('result');
      return null;
    }

    return (
      <div className="px-4 py-6 flex flex-col min-h-[calc(100vh-8rem)]">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleConditionBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <span className="text-sm text-text-secondary">
            희망조건 {conditionStep + 1} / {conditionSteps.length}
          </span>
          <div className="w-10" />
        </div>

        {/* 진행바 */}
        <div className="progress-bar mb-8">
          <motion.div
            className="progress-fill bg-success"
            animate={{ width: `${((conditionStep + 1) / conditionSteps.length) * 100}%` }}
          />
        </div>

        {/* 질문 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={conditionStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1"
          >
            <h2 className="text-xl font-bold text-expert-navy mb-2">
              {currentStep.title}
            </h2>
            <p className="text-sm text-text-secondary mb-8">
              {currentStep.subtitle}
            </p>

            <div className="space-y-3">
              {options.map((option) => (
                <motion.button
                  key={option.value}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConditionSelect(currentStep.key, option.value)}
                  className={`w-full p-4 rounded-2xl text-left transition-all border-2 ${
                    workConditions[currentStep.key as keyof typeof workConditions] === option.value
                      ? 'border-success bg-success/5'
                      : 'border-border-light bg-white hover:border-success/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        workConditions[currentStep.key as keyof typeof workConditions] === option.value
                          ? 'border-success bg-success'
                          : 'border-border-light'
                      }`}
                    >
                      {workConditions[currentStep.key as keyof typeof workConditions] === option.value && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-text-primary">{option.label}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // ============================================
  // 결과 화면
  // ============================================
  const fitInfo = fitTypeInfo[fitType] || fitTypeInfo.high_end_achiever;
  const FitIcon = fitInfo?.icon || Target;

  return (
    <div className="px-4 py-6 pb-24">
      {/* 결과 헤더 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="w-20 h-20 bg-brand-mint/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <FitIcon className={`w-10 h-10 ${fitInfo.color}`} />
        </div>
        <div className="text-sm text-text-secondary mb-1">당신의 매칭핏 유형은</div>
        <h1 className={`text-2xl font-bold ${fitInfo.color}`}>{fitInfo.label}</h1>
        <p className="text-sm text-text-secondary mt-2 max-w-xs mx-auto">
          {fitInfo.description}
        </p>
      </motion.div>

      {/* 탭 */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
        {[
          { id: 'overview', label: '개요' },
          { id: 'departments', label: '추천 진료과' },
          { id: 'hospitals', label: '추천 병원' },
          { id: 'peers', label: '비슷한 선배' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setResultTab(tab.id as 'overview' | 'departments' | 'hospitals' | 'peers')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              resultTab === tab.id
                ? 'bg-brand-mint text-white'
                : 'bg-white text-text-secondary border border-border-light'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <AnimatePresence mode="wait">
        {resultTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* 특성 */}
            <div className="bg-white rounded-2xl p-4 border border-border-light">
              <h3 className="text-card-title mb-3">나의 특성</h3>
              <div className="flex flex-wrap gap-2">
                {fitInfo.traits.map((trait) => (
                  <span
                    key={trait}
                    className="px-3 py-1.5 bg-brand-mint/10 text-brand-mint rounded-full text-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* 업무 스타일 분석 */}
            {fitInfo?.workStyle && (
              <div className="bg-white rounded-2xl p-4 border border-border-light">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-brand-mint" />
                  <h3 className="text-card-title">업무 스타일 분석</h3>
                </div>

                {/* 요약 */}
                <p className="text-sm text-text-primary bg-brand-mint/5 rounded-xl p-3 mb-4">
                  {fitInfo.workStyle.summary}
                </p>

                {/* 강점 */}
                <div className="mb-4">
                  <div className="text-xs text-text-tertiary mb-2">나의 강점</div>
                  <div className="flex flex-wrap gap-2">
                    {fitInfo.workStyle.strengths.map((strength) => (
                      <span
                        key={strength}
                        className="px-3 py-1.5 bg-success/10 text-success rounded-full text-sm"
                      >
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 적합한 환경 & 동기부여 */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="bg-bg-secondary rounded-xl p-3">
                    <div className="text-xs text-text-tertiary mb-1">적합한 근무 환경</div>
                    <div className="text-sm text-text-primary">{fitInfo.workStyle.environment}</div>
                  </div>
                  <div className="bg-bg-secondary rounded-xl p-3">
                    <div className="text-xs text-text-tertiary mb-1">동기부여 요소</div>
                    <div className="text-sm text-text-primary">{fitInfo.workStyle.motivation}</div>
                  </div>
                </div>
              </div>
            )}

            {/* 추천 채용상품 */}
            <div className="bg-white rounded-2xl p-4 border border-border-light">
              <div className="flex items-center gap-2 mb-3">
                <Gift className="w-5 h-5 text-brand-mint" />
                <h3 className="text-card-title">추천 채용상품</h3>
              </div>
              <p className="text-xs text-text-secondary mb-4">
                당신의 성향에 맞는 채용상품이 있는 병원을 우선 추천해드려요
              </p>

              <div className="space-y-3">
                {(fitTypeToProducts[fitType] || []).map((productCode, index) => {
                  const product = hiringProducts[productCode as keyof typeof hiringProducts];
                  if (!product) return null;
                  const isTop = index === 0;
                  return (
                    <div
                      key={productCode}
                      className={`rounded-xl p-3 border-2 transition-all ${
                        isTop
                          ? 'border-brand-mint bg-brand-mint/5'
                          : 'border-border-light bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: `${product.color}20` }}
                        >
                          <span className="text-lg">
                            {productCode === 'HP-SHARE' && '💰'}
                            {productCode === 'HP-BONUS' && '🎁'}
                            {productCode === 'HP-VACATION' && '🏖️'}
                            {productCode === 'HP-ALLOWANCE' && '💵'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className="text-sm font-semibold"
                              style={{ color: product.color }}
                            >
                              {product.label}
                            </span>
                            {isTop && (
                              <span className="text-xs bg-brand-mint text-white px-2 py-0.5 rounded-full">
                                Best Match
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-text-secondary mt-0.5">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2x2 매트릭스 */}
            <div className="bg-white rounded-2xl p-4 border border-border-light">
              <h3 className="text-card-title mb-3">매칭핏 포지션</h3>
              <div className="w-full aspect-square max-w-[280px] mx-auto relative">
                <div className="absolute inset-0 border-2 border-border-light rounded-2xl" />
                <div className="absolute top-1/2 left-0 right-0 border-t border-border-light" />
                <div className="absolute left-1/2 top-0 bottom-0 border-l border-border-light" />

                <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-text-tertiary">성장</div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs text-text-tertiary">안정</div>
                <div className="absolute top-1/2 -left-6 -translate-y-1/2 text-xs text-text-tertiary">내적</div>
                <div className="absolute top-1/2 -right-6 -translate-y-1/2 text-xs text-text-tertiary">외적</div>

                {/* 내 위치 */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="absolute w-8 h-8 bg-brand-mint rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    left: `${50 + xScore * 2}%`,
                    top: `${50 - yScore * 2}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <Star className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </div>

            {/* 희망 조건 요약 */}
            {workConditions.salaryRange && (
              <div className="bg-white rounded-2xl p-4 border border-border-light">
                <h3 className="text-card-title mb-3">설정한 희망 조건</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">희망 급여</span>
                    <span className="text-text-primary">{workConditionOptions.salaryRange.find(o => o.value === workConditions.salaryRange)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">근무 형태</span>
                    <span className="text-text-primary">{workConditionOptions.workType.find(o => o.value === workConditions.workType)?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">최우선 가치</span>
                    <span className="text-text-primary">{workConditionOptions.priorities.find(o => o.value === workConditions.priorities)?.label}</span>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {resultTab === 'departments' && (
          <motion.div
            key="departments"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {mockRecommendedDepartments[fitType]?.map((dept, index) => (
              <div
                key={dept.name}
                className="bg-white rounded-2xl p-4 border border-border-light"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-text-primary">{dept.name}</span>
                  <span className="text-brand-mint font-bold">{dept.percentage}% 매칭</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-text-secondary">
                  <span>평균연봉: {dept.avgSalary}</span>
                  <span>평균근속: {dept.retention}</span>
                  <span className="text-success">{dept.growth}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {resultTab === 'hospitals' && (
          <motion.div
            key="hospitals"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {Object.entries((mockRecommendedHospitals as Record<string, Record<string, Array<{ id: string; name: string; matchScore: number; salary: string; location: string; hasColleague: boolean }>>>)[fitType] || mockRecommendedHospitals.high_end_achiever || {}).flatMap(([dept, hospitals]) =>
              hospitals.map((hospital) => (
                <div
                  key={hospital.id}
                  className="bg-white rounded-2xl p-4 border border-border-light"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-semibold text-text-primary">{hospital.name}</div>
                      <div className="text-sm text-text-secondary">{hospital.location}</div>
                    </div>
                    <span className="text-brand-mint font-bold">{hospital.matchScore}%</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-bg-secondary text-text-tertiary px-2 py-0.5 rounded">
                      {dept}
                    </span>
                    <span className="text-xs bg-bg-secondary text-text-tertiary px-2 py-0.5 rounded">
                      {hospital.salary}
                    </span>
                    {hospital.hasColleague && (
                      <span className="text-xs bg-brand-mint/10 text-brand-mint px-2 py-0.5 rounded">
                        동료 근무중
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </motion.div>
        )}

        {resultTab === 'peers' && (
          <motion.div
            key="peers"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {/* 통계 정보 */}
            {(() => {
              const peersData = (mockSimilarPeers as Record<string, { totalCount: number; avgTenure: string; avgSalaryIncrease: string; topDepartments: string[]; testimonials: Array<{ id: number; text: string; department: string; tenure: string }> }>)[fitType] || mockSimilarPeers.high_end_achiever;
              return peersData ? (
                <div className="bg-brand-mint/5 rounded-2xl p-4 border border-brand-mint/20 mb-4">
                  <div className="text-sm text-text-secondary mb-2">나와 같은 유형의 선배들</div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-brand-mint">{peersData.totalCount}명</div>
                      <div className="text-xs text-text-tertiary">총 인원</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-expert-navy">{peersData.avgTenure}</div>
                      <div className="text-xs text-text-tertiary">평균 근속</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl font-bold text-success">{peersData.avgSalaryIncrease}</div>
                      <div className="text-xs text-text-tertiary">연봉 상승</div>
                    </div>
                  </div>
                </div>
              ) : null;
            })()}
            {((mockSimilarPeers as Record<string, { testimonials: Array<{ id: number; text: string; department: string; tenure: string }> }>)[fitType] || mockSimilarPeers.high_end_achiever)?.testimonials.map((peer) => (
              <div
                key={peer.id}
                className="bg-white rounded-2xl p-4 border border-border-light"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-brand-mint/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-brand-mint" />
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary">{peer.department}</div>
                    <div className="text-sm text-text-secondary">
                      {peer.tenure}
                    </div>
                  </div>
                </div>
                <p className="text-sm text-text-secondary bg-bg-secondary rounded-xl p-3">
                  &ldquo;{peer.text}&rdquo;
                </p>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 하단 CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-4 bg-gradient-to-t from-bg-secondary via-bg-secondary to-transparent pt-6">
        <div className="flex gap-3">
          <button
            onClick={() => setShowShareModal(true)}
            className="flex-1 btn-outline py-3"
          >
            <Share2 className="w-5 h-5 mr-2" />
            공유하기
          </button>
          <Link href="/seeker/matching-center" className="flex-1">
            <button className="w-full btn-primary py-3">
              매칭 시작하기
            </button>
          </Link>
        </div>
      </div>

      {/* 공유하기 모달 */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-end justify-center z-50"
            onClick={() => setShowShareModal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-3xl w-full max-w-lg p-6"
            >
              {/* 모달 헤더 */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-expert-navy">AI 진단 결과 공유하기</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-secondary"
                >
                  <X className="w-4 h-4 text-text-tertiary" />
                </button>
              </div>

              {/* 공유 카드 미리보기 */}
              <div className="bg-gradient-to-br from-brand-mint/10 to-expert-navy/10 rounded-2xl p-4 mb-6 border border-brand-mint/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-brand-mint rounded-full flex items-center justify-center">
                    <FitIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-text-secondary">나의 매칭핏 유형</div>
                    <div className={`font-bold ${fitInfo.color}`}>{fitInfo.label}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {fitInfo.traits.slice(0, 3).map((trait) => (
                    <span
                      key={trait}
                      className="px-2 py-1 bg-white/80 text-text-secondary rounded-full text-xs"
                    >
                      {trait}
                    </span>
                  ))}
                </div>
              </div>

              {/* 공유 옵션 */}
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`나의 매칭핏 유형은 "${fitInfo.label}"이에요! 🎯\n${fitInfo.description}\n\n나도 진단받기 👉 https://mediinside.com/seeker/fit-test`);
                    alert('결과가 클립보드에 복사되었습니다!');
                    setShowShareModal(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-colors"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Copy className="w-5 h-5 text-expert-navy" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-text-primary">결과 복사하기</div>
                    <div className="text-sm text-text-secondary">텍스트로 복사해서 공유</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://mediinside.com/seeker/fit-test');
                    alert('링크가 클립보드에 복사되었습니다!');
                    setShowShareModal(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-colors"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <LinkIcon className="w-5 h-5 text-brand-mint" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-text-primary">진단 링크 공유</div>
                    <div className="text-sm text-text-secondary">친구도 진단받을 수 있도록 링크 공유</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    alert('카카오톡 공유 기능이 준비 중입니다.');
                    setShowShareModal(false);
                  }}
                  className="w-full flex items-center gap-4 p-4 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-colors"
                >
                  <div className="w-10 h-10 bg-[#FEE500] rounded-full flex items-center justify-center shadow-sm">
                    <MessageSquare className="w-5 h-5 text-[#3C1E1E]" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-text-primary">카카오톡 공유</div>
                    <div className="text-sm text-text-secondary">카카오톡으로 결과 공유하기</div>
                  </div>
                </button>
              </div>

              {/* 친구 초대 보너스 */}
              <div className="bg-brand-mint/5 border border-brand-mint/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-mint/10 rounded-full flex items-center justify-center">
                    <Gift className="w-5 h-5 text-brand-mint" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-brand-mint">친구 초대 보너스</div>
                    <div className="text-sm text-text-secondary">
                      친구가 진단을 완료하면 매칭 우선권을 드려요!
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
