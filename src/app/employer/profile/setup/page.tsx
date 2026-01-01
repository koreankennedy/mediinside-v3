'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Globe,
  FileText,
  Camera,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  Phone,
  Mail,
  Clock,
  Users,
  Award,
  Heart,
  Star,
  Upload,
  Link as LinkIcon,
  Search,
  RefreshCw,
  Eye,
  Edit2,
  Plus,
  X,
  Image as ImageIcon,
  Video,
  Instagram,
  Zap,
  Target,
  ChevronRight,
  Check,
} from 'lucide-react';

// 단계 정의
const steps = [
  { id: 1, title: '기본 정보', description: '사업자 정보 입력', icon: FileText },
  { id: 2, title: 'AI 자동적재', description: '웹 정보 자동 수집', icon: Sparkles },
  { id: 3, title: '정보 확인', description: '수집 정보 검토', icon: Eye },
  { id: 4, title: '시설 정보', description: '장비/인력 정보 입력', icon: Building2 },
  { id: 5, title: '채용상품', description: '채용 혜택 설정', icon: Award },
  { id: 6, title: '브랜딩', description: '병원 이미지 설정', icon: Camera },
  { id: 7, title: '완료', description: '프로필 공개 설정', icon: CheckCircle2 },
];

// 채용상품 정보
const hiringProductOptions = [
  {
    code: 'HP-SHARE',
    label: '매출 셰어',
    description: '성과에 따른 인센티브',
    color: '#FF2D55',
    icon: '💰',
    targetType: '고수익 추구형',
    defaultValue: '매출의 1%',
  },
  {
    code: 'HP-BONUS',
    label: '근속 보너스',
    description: '장기 근속 시 보너스 지급',
    color: '#AF52DE',
    icon: '🎁',
    targetType: '안정 추구형',
    defaultValue: '1년 200만원',
  },
  {
    code: 'HP-VACATION',
    label: '휴가 자유',
    description: '연차 자유사용 보장',
    color: '#5AC8FA',
    icon: '🏖️',
    targetType: '워라밸형',
    defaultValue: '연차 15일 보장',
  },
  {
    code: 'HP-ALLOWANCE',
    label: '수당 보장',
    description: '야근/주말 수당 지급',
    color: '#FF9500',
    icon: '💵',
    targetType: '실속형',
    defaultValue: '야근 150%',
  },
];

// AI 수집 가능한 소스
const aiSources = [
  { id: 'website', name: '병원 웹사이트', icon: Globe, status: 'pending' },
  { id: 'naver', name: '네이버 플레이스', icon: MapPin, status: 'pending' },
  { id: 'kakao', name: '카카오맵', icon: MapPin, status: 'pending' },
  { id: 'instagram', name: '인스타그램', icon: Instagram, status: 'pending' },
  { id: 'review', name: '온라인 리뷰', icon: Star, status: 'pending' },
];

// 수집된 정보 예시
const collectedData = {
  basic: {
    name: '청담리더스피부과',
    address: '서울특별시 강남구 청담동 123-45 리더스빌딩 5층',
    phone: '02-1234-5678',
    email: 'contact@leadersderma.co.kr',
    hours: '평일 10:00-19:00, 토요일 10:00-15:00',
    website: 'https://www.leadersderma.co.kr',
  },
  details: {
    established: '2015년',
    employees: '15명',
    specialties: ['피부과', '레이저 시술', '피부 미용'],
    certifications: ['보건복지부 인증 의료기관', '대한피부과학회 정회원'],
  },
  culture: {
    values: ['전문성', '고객 중심', '팀워크'],
    benefits: ['4대보험', '인센티브', '교육지원', '식비지원', '연차보장'],
    atmosphere: '젊고 활기찬 분위기의 직원들과 함께하는 성장형 조직입니다.',
  },
  media: {
    logo: '/images/hospital-logo.png',
    photos: ['/images/clinic-1.jpg', '/images/clinic-2.jpg', '/images/clinic-3.jpg'],
    videos: [],
  },
  reviews: {
    avgRating: 4.6,
    totalReviews: 234,
    highlights: ['친절한 상담', '깔끔한 시설', '실력 있는 의료진'],
  },
};

export default function ProfileSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [sources, setSources] = useState(aiSources);
  const [showPreview, setShowPreview] = useState(false);

  // 기본 정보 입력 (목업 데이터 사전 입력)
  const [businessInfo, setBusinessInfo] = useState({
    businessNumber: '123-45-67890',
    hospitalName: '청담리더스피부과',
    website: 'https://www.leadersderma.co.kr',
    instagram: '@leadersderma_official',
  });

  // 수집된 데이터 상태
  const [profileData, setProfileData] = useState({
    ...collectedData.basic,
    ...collectedData.details,
    culture: collectedData.culture,
    media: collectedData.media,
    reviews: collectedData.reviews,
  });

  // 편집 모드
  const [editingField, setEditingField] = useState<string | null>(null);

  // 시설 정보 상태 (목업 데이터 사전 입력)
  const [facilityInfo, setFacilityInfo] = useState({
    chairs: '8',
    beds: '4',
    equipment: ['울쎄라', '인모드', '피코슈어', '레이저토닝', '아큐펄스', '슈링크'],
    doctors: '3',
    nurses: '5',
    staff: '7',
  });
  const [newEquipment, setNewEquipment] = useState('');
  const [facilityInfoCompleted, setFacilityInfoCompleted] = useState(true);

  // 채용상품 상태 (목업 데이터 사전 입력)
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({
    'HP-SHARE': true,
    'HP-BONUS': true,
    'HP-VACATION': false,
    'HP-ALLOWANCE': true,
  });
  const [productDetails, setProductDetails] = useState<Record<string, string>>({
    'HP-SHARE': '매출의 1%',
    'HP-BONUS': '1년 200만원, 3년 500만원',
    'HP-ALLOWANCE': '야근 150%, 주말 200%',
  });

  // 채용상품 토글
  const toggleProduct = (code: string) => {
    setSelectedProducts(prev => ({ ...prev, [code]: !prev[code] }));
    if (!productDetails[code]) {
      const product = hiringProductOptions.find(p => p.code === code);
      if (product) {
        setProductDetails(prev => ({ ...prev, [code]: product.defaultValue }));
      }
    }
  };

  // 장비 추가
  const addEquipment = () => {
    if (newEquipment.trim()) {
      setFacilityInfo(prev => ({
        ...prev,
        equipment: [...prev.equipment, newEquipment.trim()]
      }));
      setNewEquipment('');
    }
  };

  // 장비 삭제
  const removeEquipment = (index: number) => {
    setFacilityInfo(prev => ({
      ...prev,
      equipment: prev.equipment.filter((_, i) => i !== index)
    }));
  };

  // AI 자동적재 시뮬레이션
  const startAICollection = async () => {
    setIsLoading(true);
    setAiProgress(0);

    for (let i = 0; i < sources.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSources((prev) =>
        prev.map((source, index) =>
          index === i ? { ...source, status: 'completed' } : source
        )
      );
      setAiProgress(((i + 1) / sources.length) * 100);
    }

    setIsLoading(false);
    setTimeout(() => setCurrentStep(3), 500);
  };

  const nextStep = () => {
    if (currentStep === 2 && !isLoading) {
      startAICollection();
    } else if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    router.push('/employer/profile');
  };

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border-light px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
            >
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-expert-navy">병원 프로필 설정</h1>
              <p className="text-xs text-text-secondary">
                {steps[currentStep - 1].description}
              </p>
            </div>
          </div>
          <span className="text-sm text-text-secondary">
            {currentStep} / {steps.length}
          </span>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                  currentStep === step.id
                    ? 'bg-brand-mint text-white'
                    : currentStep > step.id
                    ? 'bg-success/10 text-success'
                    : 'bg-bg-secondary text-text-tertiary'
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
                <span className="text-xs font-medium whitespace-nowrap">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-6 h-0.5 mx-1 ${
                  currentStep > step.id ? 'bg-success' : 'bg-border-light'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: 기본 정보 입력 */}
          {currentStep === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-5 border border-border-light">
                <h2 className="text-lg font-semibold text-text-primary mb-4">사업자 정보 입력</h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-text-secondary mb-1 block">사업자등록번호</label>
                    <input
                      type="text"
                      placeholder="000-00-00000"
                      value={businessInfo.businessNumber}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, businessNumber: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary mb-1 block">병원명</label>
                    <input
                      type="text"
                      placeholder="병원 이름을 입력하세요"
                      value={businessInfo.hospitalName}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, hospitalName: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-border-light">
                <h2 className="text-lg font-semibold text-text-primary mb-4">온라인 정보 (선택)</h2>
                <p className="text-sm text-text-secondary mb-4">
                  입력하시면 AI가 더 정확한 정보를 수집할 수 있어요
                </p>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-text-secondary mb-1 flex items-center gap-1">
                      <Globe className="w-4 h-4" />
                      웹사이트 URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://www.example.com"
                      value={businessInfo.website}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, website: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary mb-1 flex items-center gap-1">
                      <Instagram className="w-4 h-4" />
                      인스타그램 계정
                    </label>
                    <input
                      type="text"
                      placeholder="@instagram_id"
                      value={businessInfo.instagram}
                      onChange={(e) => setBusinessInfo(prev => ({ ...prev, instagram: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-brand-mint/5 rounded-2xl p-4 border border-brand-mint/10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-brand-mint/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-brand-mint" />
                  </div>
                  <div>
                    <div className="font-medium text-expert-navy mb-1">AI가 자동으로 정보를 수집해요</div>
                    <p className="text-sm text-text-secondary">
                      입력하신 정보를 바탕으로 네이버, 카카오, 인스타그램 등에서 병원 정보를 자동으로 수집합니다.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: AI 자동적재 */}
          {currentStep === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-gradient-to-br from-expert-navy to-expert-navy/80 rounded-2xl p-6 text-white text-center">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : (
                    <Sparkles className="w-8 h-8" />
                  )}
                </div>
                <h2 className="text-xl font-bold mb-2">
                  {isLoading ? 'AI가 정보를 수집하고 있어요' : 'AI 자동적재 시작'}
                </h2>
                <p className="text-white/70 text-sm">
                  {isLoading
                    ? '잠시만 기다려주세요. 약 30초 정도 소요됩니다.'
                    : '버튼을 누르면 온라인에서 병원 정보를 자동으로 수집합니다.'}
                </p>
                {isLoading && (
                  <div className="mt-4">
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${aiProgress}%` }}
                        className="h-full bg-brand-mint rounded-full"
                      />
                    </div>
                    <div className="text-sm text-white/70 mt-2">{Math.round(aiProgress)}% 완료</div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl p-5 border border-border-light">
                <h3 className="font-semibold text-text-primary mb-4">수집 소스</h3>
                <div className="space-y-3">
                  {sources.map((source) => (
                    <div
                      key={source.id}
                      className={`flex items-center justify-between p-3 rounded-xl ${
                        source.status === 'completed'
                          ? 'bg-success/5 border border-success/20'
                          : source.status === 'loading'
                          ? 'bg-brand-mint/5 border border-brand-mint/20'
                          : 'bg-bg-secondary'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <source.icon className={`w-5 h-5 ${
                          source.status === 'completed' ? 'text-success' :
                          source.status === 'loading' ? 'text-brand-mint' : 'text-text-tertiary'
                        }`} />
                        <span className="text-sm font-medium text-text-primary">{source.name}</span>
                      </div>
                      {source.status === 'completed' ? (
                        <CheckCircle2 className="w-5 h-5 text-success" />
                      ) : source.status === 'loading' ? (
                        <Loader2 className="w-5 h-5 text-brand-mint animate-spin" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-text-tertiary" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {!isLoading && (
                <button
                  onClick={startAICollection}
                  className="w-full py-4 bg-brand-mint text-white rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  AI 자동적재 시작하기
                </button>
              )}
            </motion.div>
          )}

          {/* Step 3: 정보 확인 */}
          {currentStep === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-success/10 rounded-xl p-4 border border-success/20">
                <div className="flex items-center gap-2 text-success">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">5개 소스에서 정보를 성공적으로 수집했어요!</span>
                </div>
              </div>

              {/* 기본 정보 */}
              <div className="bg-white rounded-2xl p-5 border border-border-light">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text-primary">기본 정보</h3>
                  <button className="text-sm text-brand-mint flex items-center gap-1">
                    <Edit2 className="w-4 h-4" />
                    수정
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-text-tertiary mt-0.5" />
                    <div>
                      <div className="text-sm text-text-secondary">병원명</div>
                      <div className="font-medium text-text-primary">{profileData.name}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-text-tertiary mt-0.5" />
                    <div>
                      <div className="text-sm text-text-secondary">주소</div>
                      <div className="font-medium text-text-primary">{profileData.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-text-tertiary mt-0.5" />
                    <div>
                      <div className="text-sm text-text-secondary">전화번호</div>
                      <div className="font-medium text-text-primary">{profileData.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-text-tertiary mt-0.5" />
                    <div>
                      <div className="text-sm text-text-secondary">운영시간</div>
                      <div className="font-medium text-text-primary">{profileData.hours}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 병원 상세 */}
              <div className="bg-white rounded-2xl p-5 border border-border-light">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text-primary">병원 상세</h3>
                  <button className="text-sm text-brand-mint flex items-center gap-1">
                    <Edit2 className="w-4 h-4" />
                    수정
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">설립연도</span>
                    <span className="font-medium text-text-primary">{profileData.established}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">직원 수</span>
                    <span className="font-medium text-text-primary">{profileData.employees}</span>
                  </div>
                  <div>
                    <span className="text-sm text-text-secondary block mb-2">진료 분야</span>
                    <div className="flex flex-wrap gap-2">
                      {profileData.specialties.map((specialty, index) => (
                        <span key={index} className="px-3 py-1 bg-brand-mint/10 text-brand-mint text-sm rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-text-secondary block mb-2">인증/자격</span>
                    <div className="space-y-1">
                      {profileData.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-text-primary">
                          <Award className="w-4 h-4 text-match-gold" />
                          {cert}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 조직 문화 */}
              <div className="bg-white rounded-2xl p-5 border border-border-light">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text-primary">조직 문화</h3>
                  <button className="text-sm text-brand-mint flex items-center gap-1">
                    <Edit2 className="w-4 h-4" />
                    수정
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-text-secondary block mb-2">핵심 가치</span>
                    <div className="flex flex-wrap gap-2">
                      {profileData.culture.values.map((value, index) => (
                        <span key={index} className="px-3 py-1 bg-expert-navy/10 text-expert-navy text-sm rounded-full">
                          {value}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-text-secondary block mb-2">복리후생</span>
                    <div className="flex flex-wrap gap-2">
                      {profileData.culture.benefits.map((benefit, index) => (
                        <span key={index} className="px-3 py-1 bg-success/10 text-success text-sm rounded-full">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-sm text-text-secondary block mb-2">분위기</span>
                    <p className="text-sm text-text-primary">{profileData.culture.atmosphere}</p>
                  </div>
                </div>
              </div>

              {/* 리뷰 정보 */}
              <div className="bg-white rounded-2xl p-5 border border-border-light">
                <h3 className="font-semibold text-text-primary mb-4">온라인 평판</h3>
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-match-gold fill-match-gold" />
                    <span className="text-xl font-bold text-text-primary">{profileData.reviews.avgRating}</span>
                  </div>
                  <span className="text-sm text-text-secondary">
                    {profileData.reviews.totalReviews}개의 리뷰
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {profileData.reviews.highlights.map((highlight, index) => (
                    <span key={index} className="px-3 py-1 bg-match-gold/10 text-match-gold text-sm rounded-full">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: 시설 정보 입력 */}
          {currentStep === 4 && (
            <motion.div
              key="step4-facility"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-brand-mint/5 rounded-xl p-4 border border-brand-mint/20">
                <div className="flex items-center gap-2 text-brand-mint">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-medium">시설 정보 입력 시 "병원 인증" 배지가 부여됩니다</span>
                </div>
              </div>

              {/* 체어/베드 */}
              <div className="bg-white rounded-2xl p-5 border border-border-light">
                <h3 className="font-semibold text-text-primary mb-4">진료 시설</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-text-secondary mb-1 block">체어 수</label>
                    <input
                      type="number"
                      placeholder="예: 8"
                      value={facilityInfo.chairs}
                      onChange={(e) => setFacilityInfo(prev => ({ ...prev, chairs: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary mb-1 block">베드 수</label>
                    <input
                      type="number"
                      placeholder="예: 4"
                      value={facilityInfo.beds}
                      onChange={(e) => setFacilityInfo(prev => ({ ...prev, beds: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 장비 현황 */}
              <div className="bg-white rounded-2xl p-5 border border-border-light">
                <h3 className="font-semibold text-text-primary mb-4">보유 장비</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="장비명 입력 (예: 울쎄라)"
                    value={newEquipment}
                    onChange={(e) => setNewEquipment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addEquipment()}
                    className="flex-1 px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                  />
                  <button
                    onClick={addEquipment}
                    className="px-4 py-3 bg-brand-mint text-white rounded-xl"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                {facilityInfo.equipment.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {facilityInfo.equipment.map((eq, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-brand-mint/10 text-brand-mint rounded-full text-sm flex items-center gap-2"
                      >
                        {eq}
                        <button onClick={() => removeEquipment(index)}>
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <p className="text-xs text-text-tertiary mt-3">
                  레이저, 초음파, 수술 장비 등 보유 장비를 입력하세요
                </p>
              </div>

              {/* 인력 규모 */}
              <div className="bg-white rounded-2xl p-5 border border-border-light">
                <h3 className="font-semibold text-text-primary mb-4">인력 규모</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-text-secondary flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      의사
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={facilityInfo.doctors}
                      onChange={(e) => setFacilityInfo(prev => ({ ...prev, doctors: e.target.value }))}
                      className="w-20 px-3 py-2 rounded-lg border border-border-light text-center focus:border-brand-mint focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-text-secondary flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      간호사/간호조무사
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={facilityInfo.nurses}
                      onChange={(e) => setFacilityInfo(prev => ({ ...prev, nurses: e.target.value }))}
                      className="w-20 px-3 py-2 rounded-lg border border-border-light text-center focus:border-brand-mint focus:outline-none"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm text-text-secondary flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      기타 직원
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={facilityInfo.staff}
                      onChange={(e) => setFacilityInfo(prev => ({ ...prev, staff: e.target.value }))}
                      className="w-20 px-3 py-2 rounded-lg border border-border-light text-center focus:border-brand-mint focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 인증 배지 미리보기 */}
              {(facilityInfo.chairs || facilityInfo.beds || facilityInfo.equipment.length > 0) && (
                <div className="bg-success/5 rounded-2xl p-4 border border-success/20">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <div className="font-semibold text-success">병원 인증 배지 획득!</div>
                      <p className="text-sm text-text-secondary">구직자에게 신뢰도 높은 정보로 표시됩니다</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 5: 채용상품 빌더 */}
          {currentStep === 5 && (
            <motion.div
              key="step5-products"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div className="bg-gradient-to-br from-expert-navy to-expert-navy/80 rounded-2xl p-5 text-white">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-8 h-8" />
                  <div>
                    <h2 className="text-lg font-bold">채용상품 빌더</h2>
                    <p className="text-white/70 text-sm">구직자 성향에 맞는 혜택을 설정하세요</p>
                  </div>
                </div>
                <p className="text-sm text-white/70">
                  채용상품을 추가하면 관련 성향의 구직자에게 매칭 점수가 높아지고, 수락률이 2배 이상 증가합니다.
                </p>
              </div>

              {/* 상품 선택 */}
              <div className="space-y-3">
                {hiringProductOptions.map((product) => (
                  <div
                    key={product.code}
                    className={`bg-white rounded-2xl p-4 border-2 transition-all ${
                      selectedProducts[product.code]
                        ? 'border-brand-mint'
                        : 'border-border-light'
                    }`}
                  >
                    <div
                      className="flex items-center gap-4 cursor-pointer"
                      onClick={() => toggleProduct(product.code)}
                    >
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${product.color}20` }}
                      >
                        {product.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-text-primary">{product.label}</span>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full text-white"
                            style={{ backgroundColor: product.color }}
                          >
                            {product.targetType}
                          </span>
                        </div>
                        <p className="text-sm text-text-secondary">{product.description}</p>
                      </div>
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                          selectedProducts[product.code]
                            ? 'border-brand-mint bg-brand-mint'
                            : 'border-border-light'
                        }`}
                      >
                        {selectedProducts[product.code] && (
                          <Check className="w-4 h-4 text-white" />
                        )}
                      </div>
                    </div>

                    {/* 상세 설정 */}
                    {selectedProducts[product.code] && (
                      <div className="mt-4 pt-4 border-t border-border-light">
                        <label className="text-sm text-text-secondary mb-2 block">상품 조건 설정</label>
                        <input
                          type="text"
                          value={productDetails[product.code] || product.defaultValue}
                          onChange={(e) => setProductDetails(prev => ({
                            ...prev,
                            [product.code]: e.target.value
                          }))}
                          className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                          placeholder={product.defaultValue}
                        />
                        <p className="text-xs text-text-tertiary mt-2">
                          예: {product.code === 'HP-SHARE' && '매출의 1%, 월 최대 50만원'}
                          {product.code === 'HP-BONUS' && '1년 200만원, 3년 500만원, 5년 1000만원'}
                          {product.code === 'HP-VACATION' && '연차 15일 + 리프레시 휴가 5일'}
                          {product.code === 'HP-ALLOWANCE' && '야근 150%, 주말 200%, 공휴일 250%'}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* 선택 요약 */}
              {Object.values(selectedProducts).some(v => v) && (
                <div className="bg-brand-mint/5 rounded-2xl p-4 border border-brand-mint/20">
                  <h3 className="font-semibold text-text-primary mb-3">선택한 채용상품</h3>
                  <div className="flex flex-wrap gap-2">
                    {hiringProductOptions
                      .filter(p => selectedProducts[p.code])
                      .map(product => (
                        <span
                          key={product.code}
                          className="px-3 py-1.5 rounded-full text-white text-sm font-medium"
                          style={{ backgroundColor: product.color }}
                        >
                          {product.icon} {product.label}
                        </span>
                      ))}
                  </div>
                </div>
              )}

              {/* 에스크로 안내 */}
              <div className="bg-warning/5 rounded-2xl p-4 border border-warning/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-text-primary mb-1">보증금 안내</div>
                    <p className="text-sm text-text-secondary">
                      채용상품은 구직자에게 약속하는 조건입니다. 채용 확정 시 해당 조건을 이행해야 하며,
                      추후 에스크로 시스템을 통해 보증금이 예치됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 6: 브랜딩 */}
          {currentStep === 6 && (
            <motion.div
              key="step6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              {/* 로고 */}
              <div className="bg-white rounded-2xl p-5 border border-border-light">
                <h3 className="font-semibold text-text-primary mb-4">병원 로고</h3>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-brand-mint/10 rounded-2xl flex items-center justify-center border-2 border-dashed border-brand-mint/30">
                    <Building2 className="w-8 h-8 text-brand-mint" />
                  </div>
                  <div className="flex-1">
                    <button className="px-4 py-2 bg-brand-mint/10 text-brand-mint rounded-lg text-sm font-medium flex items-center gap-2">
                      <Upload className="w-4 h-4" />
                      로고 업로드
                    </button>
                    <p className="text-xs text-text-tertiary mt-2">
                      권장: 500x500px, PNG 또는 JPG
                    </p>
                  </div>
                </div>
              </div>

              {/* 병원 사진 */}
              <div className="bg-white rounded-2xl p-5 border border-border-light">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-text-primary">병원 사진</h3>
                  <span className="text-xs text-text-secondary">최대 10장</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="aspect-square bg-bg-secondary rounded-xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-mint/20 to-expert-navy/20" />
                      <ImageIcon className="w-6 h-6 text-text-tertiary" />
                    </div>
                  ))}
                  <button className="aspect-square bg-bg-secondary rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-border-light hover:border-brand-mint transition-colors">
                    <Plus className="w-6 h-6 text-text-tertiary" />
                    <span className="text-xs text-text-tertiary mt-1">추가</span>
                  </button>
                </div>
                <p className="text-xs text-text-tertiary mt-3">
                  원내 시설, 진료실, 대기실 등의 사진을 추가하세요
                </p>
              </div>

              {/* 대표 영상 */}
              <div className="bg-white rounded-2xl p-5 border border-border-light">
                <h3 className="font-semibold text-text-primary mb-4">소개 영상 (선택)</h3>
                <button className="w-full py-8 bg-bg-secondary rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-border-light hover:border-brand-mint transition-colors">
                  <Video className="w-8 h-8 text-text-tertiary mb-2" />
                  <span className="text-sm text-text-secondary">영상 업로드 또는 YouTube 링크</span>
                </button>
              </div>

              {/* AI 브랜딩 제안 */}
              <div className="bg-gradient-to-br from-brand-mint/10 to-expert-navy/5 rounded-2xl p-5 border border-brand-mint/20">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-5 h-5 text-brand-mint" />
                  <span className="font-semibold text-text-primary">AI 브랜딩 제안</span>
                </div>
                <p className="text-sm text-text-secondary mb-4">
                  수집된 정보를 바탕으로 병원의 강점을 돋보이게 할 수 있는 브랜딩을 제안해드려요
                </p>
                <button className="w-full py-3 bg-white rounded-xl text-brand-mint font-medium flex items-center justify-center gap-2 border border-brand-mint/20">
                  <Sparkles className="w-4 h-4" />
                  AI 브랜딩 콘텐츠 생성하기
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 7: 완료 */}
          {currentStep === 7 && (
            <motion.div
              key="step7"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 border border-border-light text-center">
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <h2 className="text-xl font-bold text-text-primary mb-2">프로필 설정 완료!</h2>
                <p className="text-text-secondary">
                  병원 프로필이 성공적으로 설정되었습니다.<br />
                  구직자들에게 병원을 어필해보세요.
                </p>
              </div>

              {/* 공개 설정 */}
              <div className="bg-white rounded-2xl p-5 border border-border-light">
                <h3 className="font-semibold text-text-primary mb-4">프로필 공개 설정</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl cursor-pointer">
                    <div>
                      <div className="font-medium text-text-primary">전체 공개</div>
                      <div className="text-xs text-text-secondary">모든 구직자에게 프로필이 노출됩니다</div>
                    </div>
                    <input type="radio" name="visibility" defaultChecked className="w-5 h-5 text-brand-mint" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl cursor-pointer">
                    <div>
                      <div className="font-medium text-text-primary">매칭 구직자만</div>
                      <div className="text-xs text-text-secondary">매칭된 구직자에게만 노출됩니다</div>
                    </div>
                    <input type="radio" name="visibility" className="w-5 h-5 text-brand-mint" />
                  </label>
                  <label className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl cursor-pointer">
                    <div>
                      <div className="font-medium text-text-primary">비공개</div>
                      <div className="text-xs text-text-secondary">프로필을 공개하지 않습니다</div>
                    </div>
                    <input type="radio" name="visibility" className="w-5 h-5 text-brand-mint" />
                  </label>
                </div>
              </div>

              {/* 다음 단계 안내 */}
              <div className="bg-expert-navy/5 rounded-2xl p-5 border border-expert-navy/10">
                <h3 className="font-semibold text-expert-navy mb-3">다음 단계</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-8 h-8 bg-brand-mint/10 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-brand-mint" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-text-primary">채용 공고 등록하기</div>
                      <div className="text-xs text-text-secondary">AI가 JD 작성을 도와드려요</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-tertiary" />
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-xl">
                    <div className="w-8 h-8 bg-match-gold/10 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-match-gold" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-text-primary">매칭 후보자 확인하기</div>
                      <div className="text-xs text-text-secondary">병원에 맞는 인재를 찾아보세요</div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-tertiary" />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light px-4 py-4">
        <div className="flex items-center gap-3">
          {currentStep > 1 && currentStep < 7 && (
            <button
              onClick={prevStep}
              className="flex-1 py-3.5 border border-border-light rounded-xl font-medium text-text-primary"
            >
              이전
            </button>
          )}
          {currentStep < 7 ? (
            <button
              onClick={nextStep}
              disabled={isLoading}
              className={`${currentStep > 1 ? 'flex-[2]' : 'flex-1'} py-3.5 bg-brand-mint text-white rounded-xl font-medium flex items-center justify-center gap-2`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  수집 중...
                </>
              ) : currentStep === 2 ? (
                <>
                  <Sparkles className="w-5 h-5" />
                  AI 자동적재 시작
                </>
              ) : (
                <>
                  다음
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleComplete}
              className="flex-1 py-3.5 bg-brand-mint text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              완료하고 프로필 보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
