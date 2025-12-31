'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Sparkles,
  Image,
  FileText,
  Video,
  MessageSquare,
  Share2,
  Download,
  Copy,
  RefreshCw,
  Loader2,
  CheckCircle,
  Edit2,
  Bot,
} from 'lucide-react';
import Link from 'next/link';

const contentTypes = [
  {
    id: 'card-news',
    label: '카드뉴스',
    icon: Image,
    description: 'SNS용 이미지 콘텐츠',
    color: 'bg-info',
    prewritten: '우리 병원의 특별한 점을 소개합니다!\n\n🏥 강남 프리미엄 피부과\n\n✨ 주 5일 정시 퇴근\n✨ 학회비 전액 지원\n✨ 성과급 + 인센티브\n✨ 따뜻한 팀 분위기\n\n함께 성장할 분을 찾습니다!',
  },
  {
    id: 'job-posting',
    label: '채용 포스터',
    icon: FileText,
    description: '공고용 디자인 포스터',
    color: 'bg-brand-mint',
    prewritten: '[강남 프리미엄 피부과]\n치과위생사 모집\n\n✨ 채용 조건\n• 경력: 3년 이상\n• 근무: 정규직 / 주 5일\n• 급여: 400~450만원\n\n🎁 복리후생\n• 4대보험 / 퇴직금\n• 학회비 지원\n• 성과급 / 인센티브\n• 정시 퇴근 보장',
  },
  {
    id: 'video-script',
    label: '영상 스크립트',
    icon: Video,
    description: '쇼츠/릴스용 대본',
    color: 'bg-error',
    prewritten: '[0-5초] 병원 외관/로고\n"안녕하세요, 강남 프리미엄 피부과입니다"\n\n[5-12초] 진료실 모습\n"저희와 함께할 치과위생사를 찾고 있어요"\n\n[12-20초] 직원 인터뷰\n"워라밸이 좋고 성장할 수 있는 환경이에요"\n\n[20-27초] 복리후생 텍스트\n"주5일, 정시퇴근, 학회비 지원"\n\n[27-30초] CTA\n"지금 MediInside에서 지원하세요!"',
  },
  {
    id: 'interview',
    label: '인터뷰 콘텐츠',
    icon: MessageSquare,
    description: '직원 인터뷰 템플릿',
    color: 'bg-warning',
    prewritten: '💬 직원 인터뷰 질문\n\nQ1. 우리 병원에 입사하게 된 계기가 무엇인가요?\nQ2. 가장 보람찼던 순간은 언제였나요?\nQ3. 우리 병원만의 장점이 있다면?\nQ4. 예비 지원자분들에게 한마디 해주세요\nQ5. 앞으로의 목표가 있으신가요?',
  },
];

const mockGeneratedContent = {
  'card-news': {
    title: '우리 병원에서 함께할 분을 찾습니다',
    slides: [
      {
        headline: '강남 프리미엄 피부과에서\n치과위생사를 모집합니다',
        subtext: '경력 3년 이상 / 정규직',
      },
      {
        headline: '이런 분을 찾고 있어요',
        subtext: '• 레이저 시술 경험자\n• 환자 응대에 친절하신 분\n• 성장을 원하는 분',
      },
      {
        headline: '우리 병원의 특별함',
        subtext: '• 주 5일 정시퇴근\n• 학회비 전액 지원\n• 성과급 + 인센티브',
      },
      {
        headline: '지금 바로 지원하세요!',
        subtext: 'MediInside에서 간편 지원\n문의: 02-1234-5678',
      },
    ],
  },
  'job-posting': {
    title: '채용 포스터가 생성되었습니다',
    content: `[강남 프리미엄 피부과]
치과위생사 모집

✨ 채용 조건
• 경력: 3년 이상
• 근무: 정규직 / 주 5일
• 급여: 400~450만원

🎁 복리후생
• 4대보험 / 퇴직금
• 학회비 지원
• 성과급 / 인센티브
• 정시 퇴근 보장

📍 근무지: 서울 강남구

지원 문의: MediInside 앱 또는
02-1234-5678`,
  },
  'video-script': {
    title: '30초 숏폼 영상 스크립트',
    scenes: [
      { time: '0-5초', content: '[병원 외관 / 로고] "안녕하세요, 강남 프리미엄 피부과입니다"' },
      { time: '5-12초', content: '[진료실 모습] "저희와 함께할 치과위생사를 찾고 있어요"' },
      { time: '12-20초', content: '[직원 인터뷰] "워라밸이 좋고 성장할 수 있는 환경이에요"' },
      { time: '20-27초', content: '[복리후생 텍스트] "주5일, 정시퇴근, 학회비 지원"' },
      { time: '27-30초', content: '[CTA] "지금 MediInside에서 지원하세요!"' },
    ],
  },
  interview: {
    title: '직원 인터뷰 질문 템플릿',
    questions: [
      '우리 병원에 입사하게 된 계기가 무엇인가요?',
      '가장 보람찼던 순간은 언제였나요?',
      '우리 병원만의 장점이 있다면?',
      '예비 지원자분들에게 한마디 해주세요',
      '앞으로의 목표가 있으신가요?',
    ],
  },
};

export default function BrandingPage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    title: string;
    slides?: { headline: string; subtext: string }[];
    content?: string;
    scenes?: { time: string; content: string }[];
    questions?: string[];
  } | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [editablePrewritten, setEditablePrewritten] = useState<string>('');
  const [showPrewrittenEditor, setShowPrewrittenEditor] = useState(false);

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    const selectedTypeData = contentTypes.find(t => t.id === typeId);
    if (selectedTypeData?.prewritten) {
      setEditablePrewritten(selectedTypeData.prewritten);
      setShowPrewrittenEditor(true);
    }
  };

  const handleGenerate = () => {
    if (!selectedType) return;
    setIsGenerating(true);

    setTimeout(() => {
      setGeneratedContent(mockGeneratedContent[selectedType as keyof typeof mockGeneratedContent]);
      setIsGenerating(false);
    }, 2000);
  };

  const renderContent = () => {
    if (!generatedContent) return null;

    if (selectedType === 'card-news' && generatedContent.slides) {
      const slides = generatedContent.slides;
      return (
        <div className="space-y-4">
          <div className="bg-expert-navy rounded-2xl aspect-square flex flex-col items-center justify-center p-6 text-white relative overflow-hidden">
            <div className="absolute top-4 right-4 text-sm text-white/60">
              {currentSlide + 1}/{slides.length}
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold whitespace-pre-line mb-4">
                {slides[currentSlide].headline}
              </h3>
              <p className="text-sm text-white/80 whitespace-pre-line">
                {slides[currentSlide].subtext}
              </p>
            </div>
          </div>
          <div className="flex justify-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentSlide ? 'bg-expert-navy w-6' : 'bg-bg-tertiary'
                }`}
              />
            ))}
          </div>
        </div>
      );
    }

    if (selectedType === 'job-posting' && generatedContent.content) {
      return (
        <div className="bg-white rounded-2xl border border-border-light p-4">
          <div className="bg-bg-secondary rounded-xl p-4 whitespace-pre-line text-sm">
            {generatedContent.content}
          </div>
        </div>
      );
    }

    if (selectedType === 'video-script' && generatedContent.scenes) {
      return (
        <div className="space-y-3">
          {generatedContent.scenes.map((scene, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-border-light p-4">
              <div className="text-xs text-expert-navy font-medium mb-1">{scene.time}</div>
              <div className="text-sm text-text-primary">{scene.content}</div>
            </div>
          ))}
        </div>
      );
    }

    if (selectedType === 'interview' && generatedContent.questions) {
      return (
        <div className="space-y-3">
          {generatedContent.questions.map((q, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-border-light p-4 flex gap-3">
              <div className="w-6 h-6 bg-expert-navy rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {idx + 1}
              </div>
              <div className="text-sm text-text-primary">{q}</div>
            </div>
          ))}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="px-4 py-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
        >
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-expert-navy">브랜딩 콘텐츠 생성</h1>
          <p className="text-sm text-text-secondary">AI가 채용 콘텐츠를 만들어드려요</p>
        </div>
      </div>

      {!generatedContent ? (
        <>
          {/* 콘텐츠 타입 선택 */}
          <div className="mb-6">
            <h2 className="text-card-title mb-3">어떤 콘텐츠를 만들까요?</h2>
            <div className="grid grid-cols-2 gap-3">
              {contentTypes.map((type) => (
                <motion.button
                  key={type.id}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTypeSelect(type.id)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all relative ${
                    selectedType === type.id
                      ? 'border-expert-navy bg-expert-navy/5'
                      : 'border-border-light bg-white'
                  }`}
                >
                  <div className={`w-10 h-10 ${type.color} rounded-xl flex items-center justify-center mb-3`}>
                    <type.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-medium text-text-primary">{type.label}</div>
                  <div className="text-xs text-text-tertiary mt-1">{type.description}</div>
                  {selectedType === type.id && (
                    <CheckCircle className="w-5 h-5 text-expert-navy absolute top-3 right-3" />
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* AI 사전 작성 콘텐츠 & 수정 */}
          {selectedType && showPrewrittenEditor && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 mb-6"
            >
              {/* AI 사전 작성 콘텐츠 안내 */}
              <div className="bg-brand-mint/5 border border-brand-mint/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Bot className="w-5 h-5 text-brand-mint" />
                  <span className="font-medium text-brand-mint">AI가 미리 작성한 콘텐츠</span>
                </div>
                <p className="text-sm text-text-secondary">
                  병원 정보를 기반으로 AI가 작성한 초안이에요. 자유롭게 수정 후 생성하세요!
                </p>
              </div>

              {/* 수정 가능한 콘텐츠 */}
              <div className="bg-white rounded-2xl p-4 border border-border-light">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-card-title flex items-center gap-2">
                    <Edit2 className="w-4 h-4" />
                    콘텐츠 수정하기
                  </h3>
                  <button
                    onClick={() => {
                      const selectedTypeData = contentTypes.find(t => t.id === selectedType);
                      if (selectedTypeData?.prewritten) {
                        setEditablePrewritten(selectedTypeData.prewritten);
                      }
                    }}
                    className="text-xs text-text-tertiary flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    원본으로
                  </button>
                </div>
                <textarea
                  value={editablePrewritten}
                  onChange={(e) => setEditablePrewritten(e.target.value)}
                  className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary resize-none"
                  rows={8}
                />
              </div>

              {/* 추가 요청사항 */}
              <div className="bg-white rounded-2xl p-4 border border-border-light">
                <h3 className="text-card-title mb-3">추가 요청사항 (선택)</h3>
                <textarea
                  placeholder="예: 젊은 분위기 강조, 성장 기회 부각, 워라밸 중심으로..."
                  className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-tertiary resize-none"
                  rows={2}
                />
              </div>
            </motion.div>
          )}

          {/* 넛지 */}
          <div className="nudge-box mb-6">
            <Sparkles className="w-4 h-4 text-brand-mint inline mr-2" />
            채용 브랜딩 콘텐츠가 있는 공고는 지원율이 <strong>35% 더 높아요!</strong>
          </div>
        </>
      ) : (
        <>
          {/* 생성 결과 */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-card-title">{generatedContent.title}</h2>
              <button
                onClick={() => {
                  setGeneratedContent(null);
                  setCurrentSlide(0);
                }}
                className="text-sm text-text-secondary flex items-center gap-1"
              >
                <RefreshCw className="w-4 h-4" />
                다시 생성
              </button>
            </div>
            {renderContent()}
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2 mb-6">
            <button className="flex-1 py-3 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary flex items-center justify-center gap-2">
              <Copy className="w-4 h-4" />
              복사
            </button>
            <button className="flex-1 py-3 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              저장
            </button>
            <button className="flex-1 py-3 bg-bg-secondary rounded-xl text-sm font-medium text-text-primary flex items-center justify-center gap-2">
              <Share2 className="w-4 h-4" />
              공유
            </button>
          </div>

          {/* 다른 콘텐츠 만들기 */}
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-3">다른 콘텐츠도 만들어보세요</h3>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
              {contentTypes
                .filter((t) => t.id !== selectedType)
                .map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type.id);
                      setGeneratedContent(null);
                      setCurrentSlide(0);
                    }}
                    className="flex-shrink-0 px-4 py-2 bg-bg-secondary rounded-xl text-sm text-text-secondary flex items-center gap-2"
                  >
                    <type.icon className="w-4 h-4" />
                    {type.label}
                  </button>
                ))}
            </div>
          </div>
        </>
      )}

      {/* Bottom Action */}
      <div className="fixed bottom-20 left-0 right-0 px-4 bg-gradient-to-t from-bg-secondary via-bg-secondary to-transparent pt-6">
        {!generatedContent ? (
          <button
            onClick={handleGenerate}
            disabled={!selectedType || isGenerating}
            className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI가 콘텐츠를 만들고 있어요...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                콘텐츠 생성하기
              </>
            )}
          </button>
        ) : (
          <Link href="/employer/ai-interview/calibration">
            <button className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
              다음: 면접 질문 설정하기
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
