'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  Globe,
  Camera,
  Edit2,
  Plus,
  Check,
  X,
  Star,
  Users,
  Clock,
  DollarSign,
  Heart,
  Award,
  Briefcase,
  Coffee,
  Car,
  Home,
  GraduationCap,
  Shield,
  Sparkles,
  ChevronRight,
  Image,
  FileText,
  TrendingUp,
  Zap,
  RefreshCw,
  Eye,
  ArrowLeft,
  CheckCircle,
  ExternalLink,
  MessageCircle,
  Lock,
  PenLine,
} from 'lucide-react';
import Link from 'next/link';
import { mockEmployerProfile } from '@/lib/mock/data';

const profileSections = [
  { id: 'basic', label: '기본 정보', icon: Building2 },
  { id: 'intro', label: '병원 소개', icon: FileText },
  { id: 'work-env', label: '업무환경', icon: Briefcase },
  { id: 'culture', label: '조직 문화', icon: Heart },
  { id: 'benefits', label: '복리후생', icon: Award },
  { id: 'team', label: '팀 소개', icon: Users },
  { id: 'gallery', label: '병원 갤러리', icon: Image },
  { id: 'naver-reviews', label: '네이버 리뷰', icon: ExternalLink },
  { id: 'work-experience', label: '재직경험 공유', icon: MessageCircle },
];

const benefitCategories = [
  {
    id: 'salary',
    label: '급여/보상',
    icon: DollarSign,
    items: ['경쟁력 있는 급여', '성과급 지급', '연차수당', '명절 상여금'],
  },
  {
    id: 'worklife',
    label: '워라밸',
    icon: Clock,
    items: ['주 5일 근무', '정시 퇴근', '연차 자유 사용', '육아휴직'],
  },
  {
    id: 'growth',
    label: '성장/교육',
    icon: GraduationCap,
    items: ['학회 지원', '자격증 취득 지원', '내부 교육 프로그램', '해외 연수'],
  },
  {
    id: 'welfare',
    label: '복지',
    icon: Coffee,
    items: ['중식 제공', '주차 지원', '건강검진', '경조사 지원'],
  },
];

const cultureKeywords = [
  '수평적 조직문화',
  '자율 출퇴근',
  '워라밸 중시',
  '성장 지향',
  '팀워크 중심',
  '환자 중심',
  '최신 장비',
  '교육 중시',
];

function ProfileContent() {
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get('section');
  const showCompletionParam = searchParams.get('showCompletion');
  const [activeSection, setActiveSection] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockEmployerProfile);
  const [showPreview, setShowPreview] = useState(false);
  const [showCompletionGuide, setShowCompletionGuide] = useState(false);
  const [selectedCultureKeywords, setSelectedCultureKeywords] = useState<string[]>([
    '수평적 조직문화',
    '성장 지향',
    '환자 중심',
  ]);

  // 재직경험 공유 섹션 상태
  const [workExpSubTab, setWorkExpSubTab] = useState<'staff' | 'director'>('staff');
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
  const [reviewPassword, setReviewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [reviewContent, setReviewContent] = useState({
    type: '원장' as '원장' | '직원',
    workType: '현직' as '현직' | '전직',
    position: '',
    hospitalName: '',  // 원장 재직경험용
    period: '',        // 근무 기간
    rating: 4,
    pros: '',
    cons: '',
  });
  const [savedReviews, setSavedReviews] = useState<Array<{
    id: string;
    type: '원장' | '직원';
    workType: '현직' | '전직';
    position: string;
    hospitalName?: string;
    period?: string;
    rating: number;
    pros: string;
    cons: string;
    date: string;
    passwordHash: string;
  }>>([]);

  // URL 쿼리 파라미터로 섹션 이동
  useEffect(() => {
    if (sectionParam && profileSections.some(s => s.id === sectionParam)) {
      setActiveSection(sectionParam);
      // 편집 모드 자동 활성화
      setIsEditing(true);
    }
  }, [sectionParam]);

  // showCompletion 파라미터로 완성도 가이드 모달 표시
  useEffect(() => {
    if (showCompletionParam === 'true') {
      setShowCompletionGuide(true);
    }
  }, [showCompletionParam]);

  // 업무환경 섹션 진입 시 자동 편집 모드 활성화
  useEffect(() => {
    if (activeSection === 'work-env') {
      setIsEditing(true);
    }
  }, [activeSection]);
  const [selectedBenefits, setSelectedBenefits] = useState<Record<string, string[]>>({
    salary: ['경쟁력 있는 급여', '성과급 지급'],
    worklife: ['주 5일 근무', '정시 퇴근'],
    growth: ['학회 지원', '자격증 취득 지원'],
    welfare: ['중식 제공', '건강검진'],
  });

  // 업무환경 4단계 상태
  const [workEnvStep, setWorkEnvStep] = useState(1);
  const [workEnvironment, setWorkEnvironment] = useState({
    // 1단계: 시설 규모
    chairs: 8,
    beds: 4,
    dailyPatients: 50,
    // 2단계: 근무 조건
    workDays: 5,
    workHours: 9,
    breakTime: 60,
    overtimeFreq: 'rare' as 'none' | 'rare' | 'sometimes' | 'often',
    // 3단계: 인력 배치
    doctors: 3,
    nurses: 5,
    staff: 4,
    patientPerNurse: 10,
    // 4단계: 보유 장비
    equipment: ['최신 레이저 장비', 'LDM', '울쎄라'] as string[],
  });

  // 장비 목록 옵션 (진료과별)
  const equipmentCategories: Record<string, string[]> = {
    '피부과': ['최신 레이저 장비', 'LDM', '울쎄라', '인모드', '피부분석기', 'IPL', '프락셀', '슈링크', '올리지오', 'CO2 레이저', '포텐자', '리쥬란 주입기', 'HIFU', '써마지', '클라리티'],
    '성형외과': ['수술현미경', '내시경', '지방흡입기', '레이저', '초음파', 'RF장비', '마취모니터', '봉합세트', '수술조명', '멸균기'],
    '치과': ['파노라마', 'CT', '임플란트장비', 'CAD/CAM', '레이저', '스케일러', '치과현미경', '근관장측정기', '광중합기', '석션장비'],
    '가정의학과': ['초음파', '심전도', 'X-ray', '혈액분석기', '내시경', '골밀도측정기', '폐기능검사기', '혈압계', '체성분분석기', '당화혈색소측정기'],
    '이비인후과': ['내시경(비/후두)', '청력검사기', '알레르기검사기', '비강통기도검사기', '수술현미경', '레이저치료기', 'CT촬영기', '중이검사기', '음성분석기', '비점막수축기'],
    '안과': ['세극등현미경', '안압계', '검안경', '시야검사기', 'OCT', '각막지형도', '자동굴절검사기', '안저카메라', '레이저', 'A/B스캔'],
    '정형외과': ['X-ray', 'C-arm', '초음파', '체외충격파', '도수치료대', '관절경', '골절고정기', '재활장비', '견인장치', 'MRI'],
    '내과': ['심전도', '초음파', '내시경', '혈액분석기', 'X-ray', '폐기능검사기', '동맥경화측정기', '혈압계', 'EKG모니터', '인바디'],
    '산부인과': ['초음파', '태아감시장치', '자궁경', '콜포스코프', '유방촬영기', '골밀도측정기', 'HPV검사기', '분만대', '신생아보육기', '레이저'],
    '소아과': ['체성분분석기', '청력검사기', '시력검사기', '네뷸라이저', '산소포화도계', '황달측정기', '혈액분석기', '초음파', '성장판검사기', 'X-ray'],
    '재활의학과': ['체외충격파', '초음파', '전기자극치료기', '도수치료대', '운동치료기구', '보행분석기', '근전도', '레이저', '온열치료기', '견인장치'],
    '정신건강의학과': ['뇌파측정기', '심리검사도구', '바이오피드백', '광치료기', 'rTMS', '수면다원검사기'],
    '기타': [],
  };

  const departmentList = Object.keys(equipmentCategories);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('피부과');

  // 커스텀 장비 입력
  const [customEquipment, setCustomEquipment] = useState('');

  // 업무강도 자동 계산
  const calculateIntensity = () => {
    let score = 0;
    // 환자 수 대비 간호인력
    const patientRatio = workEnvironment.dailyPatients / (workEnvironment.nurses || 1);
    if (patientRatio > 15) score += 3;
    else if (patientRatio > 10) score += 2;
    else score += 1;
    // 근무시간
    if (workEnvironment.workHours > 9) score += 2;
    else if (workEnvironment.workHours > 8) score += 1;
    // 야근빈도
    if (workEnvironment.overtimeFreq === 'often') score += 2;
    else if (workEnvironment.overtimeFreq === 'sometimes') score += 1;
    // 체어/베드 대비 인력
    const chairRatio = (workEnvironment.chairs + workEnvironment.beds) / (workEnvironment.nurses || 1);
    if (chairRatio > 3) score += 2;
    else if (chairRatio > 2) score += 1;

    if (score >= 6) return { level: 'high', label: '바쁨', color: 'text-error', bgColor: 'bg-error/10', description: '빠른 업무 속도, 높은 집중력 필요' };
    if (score >= 3) return { level: 'middle', label: '보통', color: 'text-warning', bgColor: 'bg-warning/10', description: '적정 업무량, 균형잡힌 환경' };
    return { level: 'low', label: '여유', color: 'text-success', bgColor: 'bg-success/10', description: '안정적인 업무 페이스' };
  };

  const intensity = calculateIntensity();

  const toggleCultureKeyword = (keyword: string) => {
    setSelectedCultureKeywords((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]
    );
  };

  const toggleBenefit = (categoryId: string, item: string) => {
    setSelectedBenefits((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId]?.includes(item)
        ? prev[categoryId].filter((i) => i !== item)
        : [...(prev[categoryId] || []), item],
    }));
  };

  return (
    <div className="px-4 py-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-dashboard-title">병원 프로필</h1>
          <p className="text-sm text-text-secondary mt-1">
            매력적인 프로필로 좋은 인재를 만나세요
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isEditing
              ? 'bg-success text-white'
              : 'bg-expert-navy text-white'
          }`}
        >
          {isEditing ? (
            <>
              <Check className="w-4 h-4 inline mr-1" />
              저장
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 inline mr-1" />
              편집
            </>
          )}
        </button>
      </div>

      {/* 프로필 완성도 - 상단 CTA */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-expert-navy/5 rounded-2xl p-4 mb-4 border border-expert-navy/10"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-expert-navy" />
            <span className="font-medium text-text-primary">프로필 완성도</span>
          </div>
          <span className="text-lg font-bold text-expert-navy">
            {profile.profileCompleteness}%
          </span>
        </div>
        <div className="progress-bar mb-3">
          <div
            className="progress-fill bg-expert-navy"
            style={{ width: `${profile.profileCompleteness}%` }}
          />
        </div>
        <button
          onClick={() => setShowCompletionGuide(true)}
          className="w-full py-2.5 bg-expert-navy text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2"
        >
          <FileText className="w-4 h-4" />
          미완성 항목 확인하고 완성하기
        </button>
      </motion.div>

      {/* AI 자동적재 - 하단 보조 CTA */}
      <div className="bg-brand-mint/5 rounded-2xl p-4 mb-6 border border-brand-mint/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-mint/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-brand-mint" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-text-primary">AI가 자동으로 정보를 채워줬어요</div>
            <div className="text-xs text-text-tertiary mt-0.5">웹에서 수집한 정보 기반 · 수정 가능</div>
          </div>
          <Link href="/employer/profile/setup">
            <button className="px-3 py-1.5 text-xs bg-brand-mint text-white rounded-lg font-medium">
              수정
            </button>
          </Link>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        {profileSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeSection === section.id
                ? 'bg-expert-navy text-white'
                : 'bg-white text-text-secondary border border-border-light'
            }`}
          >
            <section.icon className="w-4 h-4" />
            {section.label}
          </button>
        ))}
      </div>

      {/* Basic Info Section */}
      {activeSection === 'basic' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* 로고/대표이미지 */}
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-3">병원 대표 이미지</h3>
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 bg-bg-secondary rounded-xl flex items-center justify-center border-2 border-dashed border-border-light">
                <Building2 className="w-10 h-10 text-text-tertiary" />
              </div>
              {isEditing && (
                <button className="px-4 py-2 text-sm text-expert-navy border border-expert-navy rounded-lg">
                  <Camera className="w-4 h-4 inline mr-1" />
                  이미지 변경
                </button>
              )}
            </div>
          </div>

          {/* 기본 정보 */}
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-4">기본 정보</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-text-secondary block mb-1">병원명</label>
                <input
                  type="text"
                  value={profile.hospitalName}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary disabled:opacity-70"
                />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">병원 유형</label>
                <input
                  type="text"
                  value={profile.department}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary disabled:opacity-70"
                />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">규모</label>
                <input
                  type="text"
                  value={`${profile.employeeCount}명`}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary disabled:opacity-70"
                />
              </div>
              <div>
                <label className="text-sm text-text-secondary block mb-1">설립연도</label>
                <input
                  type="text"
                  value={profile.foundedYear}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary disabled:opacity-70"
                />
              </div>
            </div>
          </div>

          {/* 연락처 */}
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-4">연락처</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-text-tertiary" />
                <input
                  type="text"
                  value={profile.location}
                  disabled={!isEditing}
                  className="flex-1 px-4 py-3 bg-bg-secondary rounded-xl text-text-primary disabled:opacity-70"
                />
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-text-tertiary" />
                <input
                  type="text"
                  value="02-1234-5678"
                  disabled={!isEditing}
                  className="flex-1 px-4 py-3 bg-bg-secondary rounded-xl text-text-primary disabled:opacity-70"
                />
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-text-tertiary" />
                <input
                  type="text"
                  value="hr@gangnam-dental.com"
                  disabled={!isEditing}
                  className="flex-1 px-4 py-3 bg-bg-secondary rounded-xl text-text-primary disabled:opacity-70"
                />
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-text-tertiary" />
                <input
                  type="text"
                  value="www.gangnam-dental.com"
                  disabled={!isEditing}
                  className="flex-1 px-4 py-3 bg-bg-secondary rounded-xl text-text-primary disabled:opacity-70"
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Hospital Introduction Section */}
      {activeSection === 'intro' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-3">병원 소개</h3>
            <textarea
              rows={6}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary disabled:opacity-70 resize-none"
              defaultValue="강남에 위치한 20년 전통의 치과입니다. 최신 장비와 전문 의료진이 환자분들의 구강 건강을 책임집니다. 직원들의 성장과 워라밸을 중시하며, 수평적인 조직문화를 지향합니다."
            />
          </div>

          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-3">핵심 가치</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-xl">
                <div className="w-10 h-10 bg-expert-navy/10 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-expert-navy" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value="환자 중심"
                    disabled={!isEditing}
                    className="font-medium text-text-primary bg-transparent w-full disabled:opacity-70"
                  />
                  <input
                    type="text"
                    value="환자의 건강과 만족을 최우선으로 생각합니다"
                    disabled={!isEditing}
                    className="text-sm text-text-secondary bg-transparent w-full disabled:opacity-70"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-xl">
                <div className="w-10 h-10 bg-expert-navy/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-expert-navy" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value="지속적 성장"
                    disabled={!isEditing}
                    className="font-medium text-text-primary bg-transparent w-full disabled:opacity-70"
                  />
                  <input
                    type="text"
                    value="직원과 병원이 함께 성장하는 문화를 만듭니다"
                    disabled={!isEditing}
                    className="text-sm text-text-secondary bg-transparent w-full disabled:opacity-70"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-bg-secondary rounded-xl">
                <div className="w-10 h-10 bg-expert-navy/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-expert-navy" />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value="신뢰와 전문성"
                    disabled={!isEditing}
                    className="font-medium text-text-primary bg-transparent w-full disabled:opacity-70"
                  />
                  <input
                    type="text"
                    value="전문적인 의료 서비스로 신뢰를 쌓아갑니다"
                    disabled={!isEditing}
                    className="text-sm text-text-secondary bg-transparent w-full disabled:opacity-70"
                  />
                </div>
              </div>
              {isEditing && (
                <button className="w-full py-3 border-2 border-dashed border-border-light rounded-xl text-text-tertiary text-sm">
                  <Plus className="w-4 h-4 inline mr-1" />
                  핵심 가치 추가
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Work Environment Section - 3단계 업무환경 */}
      {activeSection === 'work-env' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* 업무강도 자동 추정 결과 */}
          <div className={`rounded-2xl p-4 border ${intensity.bgColor} border-${intensity.level === 'high' ? 'error' : intensity.level === 'middle' ? 'warning' : 'success'}/20`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className={`w-5 h-5 ${intensity.color}`} />
                <span className="font-semibold text-text-primary">추정 업무강도</span>
              </div>
              <span className={`text-lg font-bold ${intensity.color}`}>{intensity.label}</span>
            </div>
            <p className="text-sm text-text-secondary">{intensity.description}</p>
            <div className="mt-3 pt-3 border-t border-border-light">
              <p className="text-xs text-text-tertiary">
                * 입력하신 시설 규모, 근무 조건, 인력 배치를 바탕으로 자동 추정됩니다.
              </p>
            </div>
          </div>

          {/* 4단계 스텝 인디케이터 */}
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <div className="flex items-center justify-between mb-4 gap-1">
              {[
                { step: 1, label: '시설', icon: '🏥' },
                { step: 2, label: '근무', icon: '⏰' },
                { step: 3, label: '인력', icon: '👥' },
                { step: 4, label: '장비', icon: '🔬' },
              ].map(({ step, label, icon }) => (
                <button
                  key={step}
                  onClick={() => setWorkEnvStep(step)}
                  className={`flex-1 flex flex-col items-center py-2 rounded-xl transition-all ${
                    workEnvStep === step
                      ? 'bg-expert-navy/10'
                      : 'hover:bg-bg-secondary'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                    workEnvStep >= step ? 'bg-expert-navy text-white' : 'bg-bg-secondary text-text-tertiary'
                  }`}>
                    {workEnvStep > step ? <Check className="w-4 h-4" /> : step}
                  </div>
                  <span className={`text-xs ${workEnvStep >= step ? 'text-expert-navy font-medium' : 'text-text-tertiary'}`}>
                    {label}
                  </span>
                </button>
              ))}
            </div>

            {/* 1단계: 시설 규모 */}
            {workEnvStep === 1 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-1">시설 규모</h4>
                  <p className="text-xs text-text-tertiary mb-3">병원의 시설 규모를 입력해주세요</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💺</span>
                        <span className="text-sm font-medium text-text-primary">체어 수</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, chairs: Math.max(0, workEnvironment.chairs - 1)})}
                          className="w-7 h-7 rounded-full bg-white border border-border-light flex items-center justify-center text-text-secondary"
                          disabled={!isEditing}
                        >-</button>
                        <span className="w-10 text-center font-semibold text-expert-navy">{workEnvironment.chairs}</span>
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, chairs: workEnvironment.chairs + 1})}
                          className="w-7 h-7 rounded-full bg-expert-navy text-white flex items-center justify-center"
                          disabled={!isEditing}
                        >+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🛏️</span>
                        <span className="text-sm font-medium text-text-primary">베드 수</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, beds: Math.max(0, workEnvironment.beds - 1)})}
                          className="w-7 h-7 rounded-full bg-white border border-border-light flex items-center justify-center text-text-secondary"
                          disabled={!isEditing}
                        >-</button>
                        <span className="w-10 text-center font-semibold text-expert-navy">{workEnvironment.beds}</span>
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, beds: workEnvironment.beds + 1})}
                          className="w-7 h-7 rounded-full bg-expert-navy text-white flex items-center justify-center"
                          disabled={!isEditing}
                        >+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👤</span>
                        <span className="text-sm font-medium text-text-primary">일 평균 환자 수</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, dailyPatients: Math.max(0, workEnvironment.dailyPatients - 5)})}
                          className="w-7 h-7 rounded-full bg-white border border-border-light flex items-center justify-center text-text-secondary"
                          disabled={!isEditing}
                        >-</button>
                        <span className="w-10 text-center font-semibold text-expert-navy">{workEnvironment.dailyPatients}</span>
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, dailyPatients: workEnvironment.dailyPatients + 5})}
                          className="w-7 h-7 rounded-full bg-expert-navy text-white flex items-center justify-center"
                          disabled={!isEditing}
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setWorkEnvStep(2)}
                  className="w-full py-2.5 bg-expert-navy text-white rounded-xl text-sm font-medium"
                >
                  다음 →
                </button>
              </div>
            )}

            {/* 2단계: 근무 조건 */}
            {workEnvStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-1">근무 조건</h4>
                  <p className="text-xs text-text-tertiary mb-3">근무 시간 및 조건을 입력해주세요</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <span className="text-sm font-medium text-text-primary">주 근무일</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, workDays: Math.max(1, workEnvironment.workDays - 1)})}
                          className="w-7 h-7 rounded-full bg-white border border-border-light flex items-center justify-center text-text-secondary"
                          disabled={!isEditing}
                        >-</button>
                        <span className="w-10 text-center font-semibold text-expert-navy">{workEnvironment.workDays}일</span>
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, workDays: Math.min(7, workEnvironment.workDays + 1)})}
                          className="w-7 h-7 rounded-full bg-expert-navy text-white flex items-center justify-center"
                          disabled={!isEditing}
                        >+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⏰</span>
                        <span className="text-sm font-medium text-text-primary">일 근무시간</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, workHours: Math.max(4, workEnvironment.workHours - 1)})}
                          className="w-7 h-7 rounded-full bg-white border border-border-light flex items-center justify-center text-text-secondary"
                          disabled={!isEditing}
                        >-</button>
                        <span className="w-10 text-center font-semibold text-expert-navy">{workEnvironment.workHours}h</span>
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, workHours: Math.min(12, workEnvironment.workHours + 1)})}
                          className="w-7 h-7 rounded-full bg-expert-navy text-white flex items-center justify-center"
                          disabled={!isEditing}
                        >+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">☕</span>
                        <span className="text-sm font-medium text-text-primary">휴게시간</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, breakTime: Math.max(30, workEnvironment.breakTime - 15)})}
                          className="w-7 h-7 rounded-full bg-white border border-border-light flex items-center justify-center text-text-secondary"
                          disabled={!isEditing}
                        >-</button>
                        <span className="w-12 text-center font-semibold text-expert-navy">{workEnvironment.breakTime}분</span>
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, breakTime: Math.min(120, workEnvironment.breakTime + 15)})}
                          className="w-7 h-7 rounded-full bg-expert-navy text-white flex items-center justify-center"
                          disabled={!isEditing}
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-text-primary block mb-2">야근 빈도</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'none', label: '없음', emoji: '😊' },
                      { value: 'rare', label: '거의없음', emoji: '😌' },
                      { value: 'sometimes', label: '가끔', emoji: '😐' },
                      { value: 'often', label: '자주', emoji: '😓' },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => isEditing && setWorkEnvironment({...workEnvironment, overtimeFreq: opt.value as typeof workEnvironment.overtimeFreq})}
                        className={`py-2.5 rounded-xl text-xs font-medium transition-all flex flex-col items-center gap-0.5 ${
                          workEnvironment.overtimeFreq === opt.value
                            ? 'bg-expert-navy text-white'
                            : 'bg-bg-secondary text-text-secondary hover:bg-bg-secondary/80'
                        } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <span className="text-base">{opt.emoji}</span>
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setWorkEnvStep(1)}
                    className="px-4 py-2.5 border border-border-light text-text-secondary rounded-xl text-sm"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setWorkEnvStep(3)}
                    className="flex-1 py-2.5 bg-expert-navy text-white rounded-xl text-sm font-medium"
                  >
                    다음 →
                  </button>
                </div>
              </div>
            )}

            {/* 3단계: 인력 배치 */}
            {workEnvStep === 3 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-1">인력 배치</h4>
                  <p className="text-xs text-text-tertiary mb-3">의료진 및 직원 수를 입력해주세요</p>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👨‍⚕️</span>
                        <span className="text-sm font-medium text-text-primary">의사 수</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, doctors: Math.max(1, workEnvironment.doctors - 1)})}
                          className="w-7 h-7 rounded-full bg-white border border-border-light flex items-center justify-center text-text-secondary"
                          disabled={!isEditing}
                        >-</button>
                        <span className="w-10 text-center font-semibold text-expert-navy">{workEnvironment.doctors}명</span>
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, doctors: workEnvironment.doctors + 1})}
                          className="w-7 h-7 rounded-full bg-expert-navy text-white flex items-center justify-center"
                          disabled={!isEditing}
                        >+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">👩‍⚕️</span>
                        <span className="text-sm font-medium text-text-primary">간호인력</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, nurses: Math.max(1, workEnvironment.nurses - 1)})}
                          className="w-7 h-7 rounded-full bg-white border border-border-light flex items-center justify-center text-text-secondary"
                          disabled={!isEditing}
                        >-</button>
                        <span className="w-10 text-center font-semibold text-expert-navy">{workEnvironment.nurses}명</span>
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, nurses: workEnvironment.nurses + 1})}
                          className="w-7 h-7 rounded-full bg-expert-navy text-white flex items-center justify-center"
                          disabled={!isEditing}
                        >+</button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🧑‍💼</span>
                        <span className="text-sm font-medium text-text-primary">기타직원</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, staff: Math.max(0, workEnvironment.staff - 1)})}
                          className="w-7 h-7 rounded-full bg-white border border-border-light flex items-center justify-center text-text-secondary"
                          disabled={!isEditing}
                        >-</button>
                        <span className="w-10 text-center font-semibold text-expert-navy">{workEnvironment.staff}명</span>
                        <button
                          onClick={() => isEditing && setWorkEnvironment({...workEnvironment, staff: workEnvironment.staff + 1})}
                          className="w-7 h-7 rounded-full bg-expert-navy text-white flex items-center justify-center"
                          disabled={!isEditing}
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 인력 배치 분석 */}
                <div className="bg-brand-mint/5 rounded-xl p-3 border border-brand-mint/10">
                  <div className="text-xs font-medium text-brand-mint mb-2">💡 업무강도 분석</div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-text-tertiary">간호인력 1인당 환자</span>
                      <span className={`font-semibold ${
                        workEnvironment.dailyPatients / (workEnvironment.nurses || 1) > 12 ? 'text-error' : 'text-success'
                      }`}>
                        {(workEnvironment.dailyPatients / (workEnvironment.nurses || 1)).toFixed(1)}명
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-tertiary">간호인력 1인당 베드</span>
                      <span className={`font-semibold ${
                        (workEnvironment.chairs + workEnvironment.beds) / (workEnvironment.nurses || 1) > 2.5 ? 'text-warning' : 'text-success'
                      }`}>
                        {((workEnvironment.chairs + workEnvironment.beds) / (workEnvironment.nurses || 1)).toFixed(1)}개
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setWorkEnvStep(2)}
                    className="px-4 py-2.5 border border-border-light text-text-secondary rounded-xl text-sm"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setWorkEnvStep(4)}
                    className="flex-1 py-2.5 bg-expert-navy text-white rounded-xl text-sm font-medium"
                  >
                    다음 →
                  </button>
                </div>
              </div>
            )}

            {/* 4단계: 보유 장비 */}
            {workEnvStep === 4 && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-1">보유 장비</h4>
                  <p className="text-xs text-text-tertiary mb-3">진료과를 선택하면 대표 장비가 표시됩니다</p>

                  {/* 진료과 선택 */}
                  <div className="mb-4">
                    <label className="text-xs font-medium text-text-secondary mb-2 block">진료과 선택</label>
                    <div className="flex flex-wrap gap-1.5">
                      {departmentList.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => setSelectedDepartment(dept)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                            selectedDepartment === dept
                              ? 'bg-expert-navy text-white'
                              : 'bg-bg-secondary text-text-secondary hover:bg-bg-secondary/80'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 선택된 분과의 장비 목록 */}
                  {selectedDepartment && selectedDepartment !== '기타' && (
                    <div className="mb-4">
                      <label className="text-xs font-medium text-text-secondary mb-2 block">{selectedDepartment} 대표 장비</label>
                      <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                        {equipmentCategories[selectedDepartment]?.map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              if (!isEditing) return;
                              const current = workEnvironment.equipment;
                              if (current.includes(item)) {
                                setWorkEnvironment({...workEnvironment, equipment: current.filter(e => e !== item)});
                              } else {
                                setWorkEnvironment({...workEnvironment, equipment: [...current, item]});
                              }
                            }}
                            className={`px-2.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                              workEnvironment.equipment.includes(item)
                                ? 'bg-expert-navy text-white'
                                : 'bg-bg-secondary text-text-secondary hover:bg-bg-secondary/80'
                            } ${!isEditing ? 'cursor-default opacity-70' : 'cursor-pointer'}`}
                          >
                            {workEnvironment.equipment.includes(item) && <Check className="w-3 h-3 inline mr-1" />}
                            {item}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 직접 입력 */}
                  <div>
                    <label className="text-xs font-medium text-text-secondary mb-2 block">장비 직접 입력</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customEquipment}
                        onChange={(e) => setCustomEquipment(e.target.value)}
                        placeholder="장비명을 입력하세요"
                        disabled={!isEditing}
                        className="flex-1 px-3 py-2 bg-bg-secondary rounded-xl text-sm disabled:opacity-70"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && customEquipment.trim() && isEditing) {
                            if (!workEnvironment.equipment.includes(customEquipment.trim())) {
                              setWorkEnvironment({...workEnvironment, equipment: [...workEnvironment.equipment, customEquipment.trim()]});
                            }
                            setCustomEquipment('');
                          }
                        }}
                      />
                      <button
                        onClick={() => {
                          if (!isEditing || !customEquipment.trim()) return;
                          if (!workEnvironment.equipment.includes(customEquipment.trim())) {
                            setWorkEnvironment({...workEnvironment, equipment: [...workEnvironment.equipment, customEquipment.trim()]});
                          }
                          setCustomEquipment('');
                        }}
                        disabled={!isEditing || !customEquipment.trim()}
                        className="px-4 py-2 bg-expert-navy text-white rounded-xl text-sm font-medium disabled:opacity-50"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 선택된 장비 요약 */}
                {workEnvironment.equipment.length > 0 && (
                  <div className="bg-expert-navy/5 rounded-xl p-3 border border-expert-navy/10">
                    <div className="text-xs font-medium text-expert-navy mb-2">🔬 선택된 장비 ({workEnvironment.equipment.length}개)</div>
                    <div className="flex flex-wrap gap-1.5">
                      {workEnvironment.equipment.map((item) => (
                        <span
                          key={item}
                          className="px-2 py-1 bg-expert-navy/10 text-expert-navy rounded-full text-xs flex items-center gap-1"
                        >
                          {item}
                          {isEditing && (
                            <button
                              onClick={() => setWorkEnvironment({...workEnvironment, equipment: workEnvironment.equipment.filter(e => e !== item)})}
                              className="hover:text-error"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => setWorkEnvStep(3)}
                    className="px-4 py-2.5 border border-border-light text-text-secondary rounded-xl text-sm"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => {
                      // 저장 완료 후 다음 미완성 섹션으로 이동
                      setActiveSection('gallery');
                      setIsEditing(true);
                    }}
                    className="flex-1 py-2.5 bg-success text-white rounded-xl text-sm font-medium"
                  >
                    ✓ 저장 완료
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 플랫폼 인증 배지 */}
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-brand-mint" />
              업무환경 인증 배지
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">정시퇴근 병원</div>
                    <div className="text-xs text-text-tertiary">야근빈도 '거의없음' 이하</div>
                  </div>
                </div>
                {workEnvironment.overtimeFreq === 'none' || workEnvironment.overtimeFreq === 'rare' ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <X className="w-5 h-5 text-text-tertiary" />
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-brand-mint/5 border border-brand-mint/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-mint/10 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-brand-mint" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">적정인력 병원</div>
                    <div className="text-xs text-text-tertiary">간호인력 1인당 환자 12명 이하</div>
                  </div>
                </div>
                {workEnvironment.dailyPatients / (workEnvironment.nurses || 1) <= 12 ? (
                  <CheckCircle className="w-5 h-5 text-brand-mint" />
                ) : (
                  <X className="w-5 h-5 text-text-tertiary" />
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-info/5 border border-info/20 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">워라밸 우수 병원</div>
                    <div className="text-xs text-text-tertiary">주5일, 일 9시간 이하 근무</div>
                  </div>
                </div>
                {workEnvironment.workDays <= 5 && workEnvironment.workHours <= 9 ? (
                  <CheckCircle className="w-5 h-5 text-info" />
                ) : (
                  <X className="w-5 h-5 text-text-tertiary" />
                )}
              </div>
            </div>
            <p className="text-xs text-text-tertiary mt-3">
              * 배지는 입력하신 정보를 바탕으로 자동 부여되며, 구직자에게 노출됩니다.
            </p>
          </div>
        </motion.div>
      )}

      {/* Culture Section */}
      {activeSection === 'culture' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-3">조직문화 키워드</h3>
            <p className="text-sm text-text-secondary mb-4">
              우리 병원을 대표하는 키워드를 선택해주세요
            </p>
            <div className="flex flex-wrap gap-2">
              {cultureKeywords.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => isEditing && toggleCultureKeyword(keyword)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    selectedCultureKeywords.includes(keyword)
                      ? 'bg-expert-navy text-white'
                      : 'bg-bg-secondary text-text-secondary'
                  } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                >
                  {selectedCultureKeywords.includes(keyword) && (
                    <Check className="w-3 h-3 inline mr-1" />
                  )}
                  {keyword}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-3">근무 환경</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border-light">
                <span className="text-text-secondary text-sm">근무 형태</span>
                <span className="font-medium">주 5일 근무</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border-light">
                <span className="text-text-secondary text-sm">근무 시간</span>
                <span className="font-medium">09:00 - 18:00</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border-light">
                <span className="text-text-secondary text-sm">점심 시간</span>
                <span className="font-medium">12:00 - 13:00 (1시간)</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-text-secondary text-sm">야근 빈도</span>
                <span className="font-medium text-success">거의 없음</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-3">팀 분위기</h3>
            <textarea
              rows={4}
              disabled={!isEditing}
              className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary disabled:opacity-70 resize-none"
              defaultValue="저희 팀은 서로를 존중하고 배려하는 분위기입니다. 선후배 간의 수직적인 관계보다는 동료로서 서로 도움을 주고받습니다. 정기적인 팀 미팅을 통해 의견을 나누고, 월 1회 팀 회식으로 친목을 다집니다."
            />
          </div>
        </motion.div>
      )}

      {/* Benefits Section */}
      {activeSection === 'benefits' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {benefitCategories.map((category) => (
            <div key={category.id} className="bg-white rounded-2xl p-4 border border-border-light">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-expert-navy/10 rounded-full flex items-center justify-center">
                  <category.icon className="w-4 h-4 text-expert-navy" />
                </div>
                <h3 className="text-card-title">{category.label}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {category.items.map((item) => (
                  <button
                    key={item}
                    onClick={() => isEditing && toggleBenefit(category.id, item)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      selectedBenefits[category.id]?.includes(item)
                        ? 'bg-brand-mint/10 text-brand-mint'
                        : 'bg-bg-secondary text-text-tertiary'
                    } ${!isEditing ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {selectedBenefits[category.id]?.includes(item) && (
                      <Check className="w-3 h-3 inline mr-1" />
                    )}
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {isEditing && (
            <button className="w-full py-4 border-2 border-dashed border-border-light rounded-2xl text-text-tertiary text-sm">
              <Plus className="w-4 h-4 inline mr-1" />
              맞춤 복리후생 항목 추가
            </button>
          )}
        </motion.div>
      )}

      {/* Team Section */}
      {activeSection === 'team' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-3">팀 구성</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-bg-secondary rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-expert-navy">12명</div>
                <div className="text-xs text-text-tertiary">전체 인원</div>
              </div>
              <div className="bg-bg-secondary rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-expert-navy">5명</div>
                <div className="text-xs text-text-tertiary">치과위생사</div>
              </div>
              <div className="bg-bg-secondary rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-expert-navy">3명</div>
                <div className="text-xs text-text-tertiary">치과의사</div>
              </div>
              <div className="bg-bg-secondary rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-expert-navy">4명</div>
                <div className="text-xs text-text-tertiary">기타 직원</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-3">연령대 분포</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">20대</span>
                  <span className="font-medium">40%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill bg-brand-mint" style={{ width: '40%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">30대</span>
                  <span className="font-medium">35%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill bg-expert-navy" style={{ width: '35%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-text-secondary">40대 이상</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill bg-info" style={{ width: '25%' }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-3">평균 근속연수</h3>
            <div className="text-center py-4">
              <div className="text-4xl font-bold text-expert-navy mb-1">3.5년</div>
              <div className="text-sm text-text-secondary">업계 평균 대비 높은 편이에요</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-card-title">팀원 인터뷰</h3>
              {isEditing && (
                <button className="text-sm text-expert-navy">
                  <Plus className="w-4 h-4 inline" /> 추가
                </button>
              )}
            </div>
            <div className="space-y-3">
              <div className="bg-bg-secondary rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-expert-navy/20 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-expert-navy" />
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">김OO</div>
                    <div className="text-xs text-text-tertiary">치과위생사 · 3년차</div>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">
                  &ldquo;워라밸이 좋고, 동료들이 친절해서 출근이 즐거워요.
                  학회 지원도 적극적이라 성장하기 좋은 환경입니다.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Gallery Section */}
      {activeSection === 'gallery' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-3">병원 사진</h3>
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-bg-secondary rounded-xl flex items-center justify-center border-2 border-dashed border-border-light"
                >
                  <Image className="w-8 h-8 text-text-tertiary" />
                </div>
              ))}
              {isEditing && (
                <button className="aspect-square bg-expert-navy/5 rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-expert-navy/30">
                  <Plus className="w-6 h-6 text-expert-navy mb-1" />
                  <span className="text-xs text-expert-navy">사진 추가</span>
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-3">시설 안내</h3>
            <div className="space-y-2">
              {['진료실', '대기실', '상담실', '직원 휴게실', '주차장'].map((facility) => (
                <div
                  key={facility}
                  className="flex items-center justify-between py-2 border-b border-border-light last:border-0"
                >
                  <span className="text-text-secondary">{facility}</span>
                  <Check className="w-4 h-4 text-success" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Naver Reviews Section */}
      {activeSection === 'naver-reviews' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* 네이버 리뷰 요약 */}
          <div className="bg-gradient-to-r from-success to-success/80 rounded-2xl p-5 text-white">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-white/70 mb-1">네이버 플레이스 평점</div>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-match-gold fill-match-gold" />
                  <span className="text-4xl font-bold">4.7</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">128</div>
                <div className="text-sm text-white/70">리뷰 수</div>
              </div>
            </div>
            <button className="w-full bg-white/20 hover:bg-white/30 text-white py-2 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors">
              <ExternalLink className="w-4 h-4" />
              네이버에서 보기
            </button>
          </div>

          {/* 리뷰 키워드 */}
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-3">자주 언급되는 키워드</h3>
            <div className="flex flex-wrap gap-2">
              {['친절해요', '깔끔해요', '설명이 자세해요', '대기시간 짧아요', '실력 좋아요', '가격 합리적'].map((keyword) => (
                <span
                  key={keyword}
                  className="px-3 py-1.5 bg-success/10 text-success rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* 네이버 리뷰 목록 */}
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <h3 className="text-card-title mb-3">최근 리뷰</h3>
            <div className="space-y-4">
              {[
                { rating: 5, content: '친절하고 꼼꼼한 진료 감사합니다. 설명도 자세히 해주셔서 좋았어요.', date: '2024.01.10' },
                { rating: 5, content: '대기 시간 없이 빠른 진료가 좋았어요. 다음에도 방문하겠습니다.', date: '2024.01.08' },
                { rating: 4, content: '직원분들이 친절하시고 시설이 깨끗해요.', date: '2024.01.05' },
                { rating: 5, content: '원장님 실력이 좋으세요. 통증 없이 잘 치료받았습니다.', date: '2024.01.03' },
              ].map((review, index) => (
                <div key={index} className="pb-4 border-b border-border-light last:border-0 last:pb-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-match-gold fill-match-gold" />
                      ))}
                      {Array.from({ length: 5 - review.rating }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 text-text-tertiary" />
                      ))}
                    </div>
                    <span className="text-xs text-text-tertiary">{review.date}</span>
                  </div>
                  <p className="text-sm text-text-primary">{review.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 리뷰 관리 안내 */}
          <div className="bg-info/10 border border-info/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-text-primary mb-1">
                  네이버 리뷰는 자동으로 수집돼요
                </div>
                <p className="text-xs text-text-secondary">
                  네이버 플레이스에 등록된 리뷰가 자동으로 표시됩니다.
                  좋은 리뷰가 많으면 구직자에게 더 매력적으로 보여요!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Work Experience Section (재직경험 공유) */}
      {activeSection === 'work-experience' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* 서브탭 */}
          <div className="flex gap-2 p-1 bg-bg-secondary rounded-xl">
            <button
              onClick={() => setWorkExpSubTab('staff')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                workExpSubTab === 'staff'
                  ? 'bg-white text-expert-navy shadow-sm'
                  : 'text-text-secondary'
              }`}
            >
              직원 리뷰
            </button>
            <button
              onClick={() => setWorkExpSubTab('director')}
              className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                workExpSubTab === 'director'
                  ? 'bg-white text-expert-navy shadow-sm'
                  : 'text-text-secondary'
              }`}
            >
              원장 재직경험
            </button>
          </div>

          {/* 리뷰 작성 버튼 */}
          <button
            onClick={() => {
              setReviewContent({
                ...reviewContent,
                type: workExpSubTab === 'staff' ? '직원' : '원장',
              });
              setShowWriteReviewModal(true);
            }}
            className="w-full bg-expert-navy text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <PenLine className="w-4 h-4" />
            {workExpSubTab === 'staff' ? '직원 리뷰 작성하기' : '재직경험 공유하기'}
          </button>

          {workExpSubTab === 'staff' && (
            <>
              {/* 직원 리뷰 요약 */}
              <div className="bg-gradient-to-r from-brand-mint to-brand-mint-dark rounded-2xl p-5 text-white">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm text-white/70 mb-1">직원 평균 평점</div>
                    <div className="flex items-center gap-2">
                      <Star className="w-6 h-6 text-match-gold fill-match-gold" />
                      <span className="text-4xl font-bold">4.3</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-sm text-white/70">리뷰 수</div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white/10 rounded-lg py-2">
                    <div className="text-sm font-bold">4.5</div>
                    <div className="text-xs text-white/70">워라밸</div>
                  </div>
                  <div className="bg-white/10 rounded-lg py-2">
                    <div className="text-sm font-bold">4.2</div>
                    <div className="text-xs text-white/70">급여</div>
                  </div>
                  <div className="bg-white/10 rounded-lg py-2">
                    <div className="text-sm font-bold">4.4</div>
                    <div className="text-xs text-white/70">분위기</div>
                  </div>
                </div>
              </div>

              {/* 평가 항목별 상세 */}
              <div className="bg-white rounded-2xl p-4 border border-border-light">
                <h3 className="text-card-title mb-4">평가 항목별 점수</h3>
                <div className="space-y-3">
                  {[
                    { label: '워라밸', score: 4.5 },
                    { label: '급여/복지', score: 4.2 },
                    { label: '조직문화', score: 4.4 },
                    { label: '성장기회', score: 4.0 },
                    { label: '경영진', score: 4.1 },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-text-secondary">{item.label}</span>
                        <span className="text-sm font-medium text-text-primary">{item.score}</span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill bg-brand-mint"
                          style={{ width: `${(item.score / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 직원 리뷰 목록 */}
              <div className="bg-white rounded-2xl p-4 border border-border-light">
                <h3 className="text-card-title mb-3">직원 리뷰</h3>
                <div className="space-y-4">
                  {[
                    {
                      type: '현직',
                      position: '치과위생사',
                      rating: 4.5,
                      pros: '워라밸이 정말 좋고, 원장님이 친절하세요. 교육 기회도 많이 주십니다.',
                      cons: '때때로 바쁜 시기가 있어요.',
                      date: '2024.01.12',
                    },
                    {
                      type: '현직',
                      position: '코디네이터',
                      rating: 4.2,
                      pros: '팀 분위기가 좋고 동료들이 서로 도와줘요. 정시퇴근 보장됩니다.',
                      cons: '주차 공간이 부족해요.',
                      date: '2024.01.05',
                    },
                    {
                      type: '전직',
                      position: '치과위생사',
                      rating: 4.0,
                      pros: '교육 시스템이 체계적이에요. 성장할 수 있는 환경입니다.',
                      cons: '연봉 인상폭이 아쉬웠어요.',
                      date: '2023.12.20',
                    },
                  ].map((review, index) => (
                    <div key={index} className="pb-4 border-b border-border-light last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            review.type === '현직' ? 'bg-success/10 text-success' : 'bg-bg-secondary text-text-tertiary'
                          }`}>
                            {review.type}
                          </span>
                          <span className="text-sm text-text-primary">{review.position}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-match-gold fill-match-gold" />
                          <span className="text-xs font-medium">{review.rating}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-success/5 rounded-lg p-2">
                          <div className="text-xs text-success mb-1 font-medium">장점</div>
                          <p className="text-sm text-text-primary">{review.pros}</p>
                        </div>
                        <div className="bg-error/5 rounded-lg p-2">
                          <div className="text-xs text-error mb-1 font-medium">단점</div>
                          <p className="text-sm text-text-primary">{review.cons}</p>
                        </div>
                      </div>
                      <div className="text-xs text-text-tertiary mt-2">{review.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {workExpSubTab === 'director' && (
            <>
              {/* 원장 재직경험 안내 */}
              <div className="bg-expert-navy/5 border border-expert-navy/10 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-5 h-5 text-expert-navy flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm font-medium text-text-primary mb-1">
                      원장님의 봉직의 경험을 공유하세요
                    </div>
                    <p className="text-xs text-text-secondary">
                      과거 봉직의로 근무했던 경험을 공유하면 구직자들이 원장님을 더 신뢰해요.
                      솔직한 경험 공유가 좋은 인재 영입에 도움이 됩니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 원장 재직경험 목록 */}
              <div className="bg-white rounded-2xl p-4 border border-border-light">
                <h3 className="text-card-title mb-3">재직경험 목록</h3>
                <div className="space-y-4">
                  {[
                    {
                      hospitalName: '서울미소치과',
                      period: '2018.03 - 2021.02',
                      position: '봉직의',
                      rating: 4.5,
                      pros: '체계적인 진료 시스템과 환자 관리가 잘 되어 있었습니다. 선배 원장님께 많이 배웠어요.',
                      cons: '주차 공간이 협소했습니다.',
                      date: '2024.01.15',
                    },
                    {
                      hospitalName: '행복한치과의원',
                      period: '2015.05 - 2018.02',
                      position: '봉직의',
                      rating: 4.2,
                      pros: '워라밸이 좋고 급여도 만족스러웠습니다. 직원분들도 친절했어요.',
                      cons: '장비가 조금 오래되었었습니다.',
                      date: '2024.01.10',
                    },
                  ].map((exp, index) => (
                    <div key={index} className="pb-4 border-b border-border-light last:border-0 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="text-sm font-medium text-text-primary">{exp.hospitalName}</div>
                          <div className="text-xs text-text-tertiary">{exp.period} · {exp.position}</div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-match-gold fill-match-gold" />
                          <span className="text-xs font-medium">{exp.rating}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="bg-success/5 rounded-lg p-2">
                          <div className="text-xs text-success mb-1 font-medium">좋았던 점</div>
                          <p className="text-sm text-text-primary">{exp.pros}</p>
                        </div>
                        <div className="bg-error/5 rounded-lg p-2">
                          <div className="text-xs text-error mb-1 font-medium">아쉬웠던 점</div>
                          <p className="text-sm text-text-primary">{exp.cons}</p>
                        </div>
                      </div>
                      <div className="text-xs text-text-tertiary mt-2">{exp.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* 리뷰 관리 안내 */}
          <div className="bg-brand-mint/10 border border-brand-mint/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-brand-mint flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-text-primary mb-1">
                  작성한 리뷰는 비밀번호로 보호돼요
                </div>
                <p className="text-xs text-text-secondary">
                  채용 계정을 공유하더라도 작성자 본인만 리뷰를 수정하거나 삭제할 수 있어요.
                  리뷰 작성 시 비밀번호를 설정해주세요.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 리뷰 작성 모달 */}
      <AnimatePresence>
        {showWriteReviewModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWriteReviewModal(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-x-4 top-10 z-50 bg-white rounded-2xl max-w-md mx-auto overflow-hidden max-h-[calc(100vh-5rem)] overflow-y-auto shadow-xl"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-text-primary">
                    {reviewContent.type === '직원' ? '직원 리뷰 작성' : '재직경험 공유'}
                  </h2>
                  <button
                    onClick={() => setShowWriteReviewModal(false)}
                    className="p-1 hover:bg-bg-secondary rounded-full"
                  >
                    <X className="w-5 h-5 text-text-tertiary" />
                  </button>
                </div>

                <div className="space-y-4">
                  {/* 근무 유형 */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">근무 유형</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setReviewContent({ ...reviewContent, workType: '현직' })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                          reviewContent.workType === '현직'
                            ? 'border-expert-navy bg-expert-navy/5 text-expert-navy'
                            : 'border-border-light text-text-secondary'
                        }`}
                      >
                        현직
                      </button>
                      <button
                        onClick={() => setReviewContent({ ...reviewContent, workType: '전직' })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${
                          reviewContent.workType === '전직'
                            ? 'border-expert-navy bg-expert-navy/5 text-expert-navy'
                            : 'border-border-light text-text-secondary'
                        }`}
                      >
                        전직
                      </button>
                    </div>
                  </div>

                  {/* 원장 재직경험인 경우 병원명 */}
                  {reviewContent.type === '원장' && (
                    <div>
                      <label className="text-sm font-medium text-text-primary mb-2 block">근무했던 병원명</label>
                      <input
                        type="text"
                        placeholder="예: 서울미소치과"
                        value={reviewContent.hospitalName}
                        onChange={(e) => setReviewContent({ ...reviewContent, hospitalName: e.target.value })}
                        className="w-full px-4 py-3 border border-border-light rounded-xl text-sm focus:outline-none focus:border-expert-navy"
                      />
                    </div>
                  )}

                  {/* 직책/직무 */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      {reviewContent.type === '직원' ? '직책/직무' : '직책'}
                    </label>
                    <input
                      type="text"
                      placeholder={reviewContent.type === '직원' ? '예: 치과위생사' : '예: 봉직의'}
                      value={reviewContent.position}
                      onChange={(e) => setReviewContent({ ...reviewContent, position: e.target.value })}
                      className="w-full px-4 py-3 border border-border-light rounded-xl text-sm focus:outline-none focus:border-expert-navy"
                    />
                  </div>

                  {/* 근무 기간 */}
                  {reviewContent.type === '원장' && (
                    <div>
                      <label className="text-sm font-medium text-text-primary mb-2 block">근무 기간</label>
                      <input
                        type="text"
                        placeholder="예: 2018.03 - 2021.02"
                        value={reviewContent.period}
                        onChange={(e) => setReviewContent({ ...reviewContent, period: e.target.value })}
                        className="w-full px-4 py-3 border border-border-light rounded-xl text-sm focus:outline-none focus:border-expert-navy"
                      />
                    </div>
                  )}

                  {/* 평점 */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">평점</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => setReviewContent({ ...reviewContent, rating })}
                          className="p-2"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              rating <= reviewContent.rating
                                ? 'text-match-gold fill-match-gold'
                                : 'text-border-light'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 장점 */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      {reviewContent.type === '직원' ? '장점' : '좋았던 점'}
                    </label>
                    <textarea
                      placeholder="좋았던 점을 작성해주세요"
                      value={reviewContent.pros}
                      onChange={(e) => setReviewContent({ ...reviewContent, pros: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-border-light rounded-xl text-sm focus:outline-none focus:border-expert-navy resize-none"
                    />
                  </div>

                  {/* 단점 */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">
                      {reviewContent.type === '직원' ? '단점' : '아쉬웠던 점'}
                    </label>
                    <textarea
                      placeholder="아쉬웠던 점을 작성해주세요"
                      value={reviewContent.cons}
                      onChange={(e) => setReviewContent({ ...reviewContent, cons: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-border-light rounded-xl text-sm focus:outline-none focus:border-expert-navy resize-none"
                    />
                  </div>

                  {/* 비밀번호 설정 */}
                  <div className="bg-warning/5 border border-warning/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Lock className="w-4 h-4 text-warning" />
                      <span className="text-sm font-medium text-text-primary">리뷰 비밀번호 설정</span>
                    </div>
                    <p className="text-xs text-text-secondary mb-3">
                      작성한 리뷰를 수정하거나 삭제할 때 필요합니다. 잊어버리지 않도록 주의하세요.
                    </p>
                    <div className="space-y-2">
                      <input
                        type="password"
                        placeholder="비밀번호 (4자리 이상)"
                        value={reviewPassword}
                        onChange={(e) => setReviewPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-border-light rounded-xl text-sm focus:outline-none focus:border-expert-navy"
                      />
                      <input
                        type="password"
                        placeholder="비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3 border border-border-light rounded-xl text-sm focus:outline-none focus:border-expert-navy"
                      />
                      {reviewPassword && confirmPassword && reviewPassword !== confirmPassword && (
                        <p className="text-xs text-error">비밀번호가 일치하지 않습니다</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* 저장 버튼 */}
                <button
                  onClick={() => {
                    if (reviewPassword.length >= 4 && reviewPassword === confirmPassword) {
                      // 리뷰 저장 로직 (실제로는 API 호출)
                      const newReview = {
                        id: Date.now().toString(),
                        ...reviewContent,
                        date: new Date().toISOString().split('T')[0].replace(/-/g, '.'),
                        passwordHash: reviewPassword, // 실제로는 해시 처리
                      };
                      setSavedReviews([...savedReviews, newReview]);
                      setShowWriteReviewModal(false);
                      setReviewPassword('');
                      setConfirmPassword('');
                      setReviewContent({
                        type: '원장',
                        workType: '현직',
                        position: '',
                        hospitalName: '',
                        period: '',
                        rating: 4,
                        pros: '',
                        cons: '',
                      });
                    }
                  }}
                  disabled={
                    reviewPassword.length < 4 ||
                    reviewPassword !== confirmPassword ||
                    !reviewContent.position ||
                    !reviewContent.pros
                  }
                  className="w-full mt-6 bg-expert-navy text-white py-4 rounded-xl font-semibold disabled:bg-bg-secondary disabled:text-text-tertiary"
                >
                  리뷰 저장하기
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 프로필 미리보기 CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <button
          onClick={() => setShowPreview(true)}
          className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
        >
          <Eye className="w-5 h-5" />
          프로필 미리보기
        </button>
      </div>

      {/* 프로필 완성도 가이드 모달 */}
      <AnimatePresence>
        {showCompletionGuide && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCompletionGuide(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed inset-x-4 top-20 z-50 bg-white rounded-2xl max-w-md mx-auto overflow-hidden max-h-[calc(100vh-6rem)] overflow-y-auto shadow-xl"
            >
              <div className="p-5">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-expert-navy/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-expert-navy" />
                  </div>
                  <h2 className="text-lg font-bold text-text-primary mb-1">프로필 완성도 높이기</h2>
                  <p className="text-sm text-text-secondary">
                    아래 항목을 완성하면 더 많은 인재를 만나요
                  </p>
                </div>

                {/* 프로필 완성도 진행바 */}
                <div className="bg-expert-navy/5 rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">현재 프로필 완성도</span>
                    <span className="text-lg font-bold text-expert-navy">{profile.profileCompleteness}%</span>
                  </div>
                  <div className="h-2 bg-white rounded-full overflow-hidden">
                    <div className="h-full bg-expert-navy rounded-full" style={{ width: `${profile.profileCompleteness}%` }} />
                  </div>
                </div>

                {/* 단계별 완성 가이드 */}
                <div className="space-y-2 mb-5">
                  <div className="text-sm font-medium text-text-primary mb-2">미완성 항목</div>

                  {/* 업무환경 - 미완성 */}
                  <button
                    onClick={() => { setShowCompletionGuide(false); setActiveSection('work-env'); setIsEditing(true); }}
                    className="w-full flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-xl hover:bg-warning/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-warning" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-text-primary">업무환경 입력</div>
                        <div className="text-xs text-text-tertiary">시설, 근무조건, 인력배치</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-warning font-medium">+15%</span>
                      <ChevronRight className="w-4 h-4 text-text-tertiary" />
                    </div>
                  </button>

                  {/* 갤러리 - 미완성 */}
                  <button
                    onClick={() => { setShowCompletionGuide(false); setActiveSection('gallery'); setIsEditing(true); }}
                    className="w-full flex items-center justify-between p-3 bg-info/5 border border-info/20 rounded-xl hover:bg-info/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-info/10 rounded-full flex items-center justify-center">
                        <Image className="w-4 h-4 text-info" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-text-primary">병원 사진 등록</div>
                        <div className="text-xs text-text-tertiary">시설 사진 3장 이상</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-info font-medium">+8%</span>
                      <ChevronRight className="w-4 h-4 text-text-tertiary" />
                    </div>
                  </button>

                  {/* 팀소개 - 미완성 */}
                  <button
                    onClick={() => { setShowCompletionGuide(false); setActiveSection('team'); setIsEditing(true); }}
                    className="w-full flex items-center justify-between p-3 bg-brand-mint/5 border border-brand-mint/20 rounded-xl hover:bg-brand-mint/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-mint/10 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-brand-mint" />
                      </div>
                      <div className="text-left">
                        <div className="text-sm font-medium text-text-primary">팀 소개 추가</div>
                        <div className="text-xs text-text-tertiary">팀원 인터뷰, 분위기</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-brand-mint font-medium">+5%</span>
                      <ChevronRight className="w-4 h-4 text-text-tertiary" />
                    </div>
                  </button>

                  <div className="text-sm font-medium text-text-primary mt-3 mb-2">완성된 항목</div>

                  {/* 기본정보 - 완성됨 */}
                  <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-xl opacity-70">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">기본 정보</div>
                        <div className="text-xs text-text-tertiary">병원명, 주소, 연락처</div>
                      </div>
                    </div>
                    <span className="text-xs text-success font-medium">완료</span>
                  </div>

                  {/* 병원소개 - 완성됨 */}
                  <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-xl opacity-70">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">병원 소개</div>
                        <div className="text-xs text-text-tertiary">핵심가치, 비전</div>
                      </div>
                    </div>
                    <span className="text-xs text-success font-medium">완료</span>
                  </div>

                  {/* 복리후생 - 완성됨 */}
                  <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-xl opacity-70">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">복리후생</div>
                        <div className="text-xs text-text-tertiary">급여, 워라밸, 복지</div>
                      </div>
                    </div>
                    <span className="text-xs text-success font-medium">완료</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => setShowCompletionGuide(false)}
                    className="w-full py-3 bg-expert-navy text-white rounded-xl font-semibold"
                  >
                    확인
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 프로필 미리보기 모달 */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50"
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="absolute inset-0 bg-bg-secondary overflow-auto"
            >
              {/* 미리보기 헤더 */}
              <div className="sticky top-0 z-10 bg-white border-b border-border-light px-4 py-3">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="flex items-center gap-2 text-text-secondary"
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>돌아가기</span>
                  </button>
                  <div className="flex items-center gap-2 text-sm text-brand-mint">
                    <Eye className="w-4 h-4" />
                    <span>구직자 시점 미리보기</span>
                  </div>
                </div>
              </div>

              {/* 미리보기 콘텐츠 */}
              <div className="px-4 py-6 space-y-4">
                {/* 병원 헤더 */}
                <div className="bg-white rounded-2xl p-5 border border-border-light">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-16 h-16 bg-brand-mint/10 rounded-xl flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-brand-mint" />
                    </div>
                    <div className="flex-1">
                      <h1 className="text-xl font-bold text-text-primary">{profile.hospitalName}</h1>
                      <p className="text-sm text-text-secondary">{profile.department}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <MapPin className="w-3 h-3 text-text-tertiary" />
                        <span className="text-xs text-text-tertiary">{profile.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-bg-secondary rounded-lg p-2 text-center">
                      <div className="text-sm font-bold text-expert-navy">{profile.employeeCount}명</div>
                      <div className="text-xs text-text-tertiary">직원 수</div>
                    </div>
                    <div className="bg-bg-secondary rounded-lg p-2 text-center">
                      <div className="text-sm font-bold text-expert-navy">{profile.foundedYear}</div>
                      <div className="text-xs text-text-tertiary">설립연도</div>
                    </div>
                    <div className="bg-bg-secondary rounded-lg p-2 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 text-match-gold fill-match-gold" />
                        <span className="text-sm font-bold text-expert-navy">4.5</span>
                      </div>
                      <div className="text-xs text-text-tertiary">평점</div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {selectedCultureKeywords.map((keyword) => (
                      <span
                        key={keyword}
                        className="px-3 py-1 bg-brand-mint/10 text-brand-mint rounded-full text-xs font-medium"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 병원 소개 */}
                <div className="bg-white rounded-2xl p-4 border border-border-light">
                  <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-expert-navy" />
                    병원 소개
                  </h2>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    강남에 위치한 20년 전통의 치과입니다. 최신 장비와 전문 의료진이 환자분들의 구강 건강을 책임집니다.
                    직원들의 성장과 워라밸을 중시하며, 수평적인 조직문화를 지향합니다.
                  </p>
                </div>

                {/* 업무환경 (근무 환경) - 순서 변경: 기본정보 → 병원소개 → 업무환경 */}
                <div className="bg-white rounded-2xl p-4 border border-border-light">
                  <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-info" />
                    업무환경
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-bg-secondary rounded-lg p-3">
                      <div className="text-xs text-text-tertiary mb-1">근무 형태</div>
                      <div className="text-sm font-medium text-text-primary">주 5일 근무</div>
                    </div>
                    <div className="bg-bg-secondary rounded-lg p-3">
                      <div className="text-xs text-text-tertiary mb-1">근무 시간</div>
                      <div className="text-sm font-medium text-text-primary">09:00 - 18:00</div>
                    </div>
                    <div className="bg-bg-secondary rounded-lg p-3">
                      <div className="text-xs text-text-tertiary mb-1">점심 시간</div>
                      <div className="text-sm font-medium text-text-primary">1시간</div>
                    </div>
                    <div className="bg-bg-secondary rounded-lg p-3">
                      <div className="text-xs text-text-tertiary mb-1">야근 빈도</div>
                      <div className="text-sm font-medium text-success">거의 없음</div>
                    </div>
                  </div>
                </div>

                {/* 복리후생 */}
                <div className="bg-white rounded-2xl p-4 border border-border-light">
                  <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-match-gold" />
                    복리후생
                  </h2>
                  <div className="space-y-3">
                    {Object.entries(selectedBenefits).map(([categoryId, items]) => {
                      const category = benefitCategories.find((c) => c.id === categoryId);
                      if (!category || items.length === 0) return null;
                      return (
                        <div key={categoryId}>
                          <div className="flex items-center gap-2 mb-2">
                            <category.icon className="w-4 h-4 text-text-tertiary" />
                            <span className="text-sm font-medium text-text-primary">{category.label}</span>
                          </div>
                          <div className="flex flex-wrap gap-2 pl-6">
                            {items.map((item) => (
                              <span
                                key={item}
                                className="text-xs bg-success/10 text-success px-2 py-1 rounded flex items-center gap-1"
                              >
                                <CheckCircle className="w-3 h-3" />
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 팀 구성 */}
                <div className="bg-white rounded-2xl p-4 border border-border-light">
                  <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-mint" />
                    팀 구성
                  </h2>
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-expert-navy">12명</div>
                      <div className="text-xs text-text-tertiary">전체</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-expert-navy">5명</div>
                      <div className="text-xs text-text-tertiary">위생사</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-expert-navy">3명</div>
                      <div className="text-xs text-text-tertiary">의사</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-expert-navy">3.5년</div>
                      <div className="text-xs text-text-tertiary">평균 근속</div>
                    </div>
                  </div>

                  {/* 팀원 인터뷰 */}
                  <div className="bg-brand-mint/5 border border-brand-mint/20 rounded-xl p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-brand-mint/20 rounded-full flex items-center justify-center">
                        <Users className="w-4 h-4 text-brand-mint" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-text-primary">김OO</div>
                        <div className="text-xs text-text-tertiary">치과위생사 · 3년차</div>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary">
                      &ldquo;워라밸이 좋고, 동료들이 친절해서 출근이 즐거워요.&rdquo;
                    </p>
                  </div>
                </div>

                {/* 재직자 리뷰 */}
                <div className="bg-white rounded-2xl p-4 border border-border-light">
                  <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-brand-mint" />
                    재직자 리뷰
                  </h2>
                  <div className="space-y-3">
                    <div className="bg-bg-secondary rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-text-tertiary">현직 치과위생사</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-match-gold fill-match-gold" />
                          <span className="text-xs font-medium">4.5</span>
                        </div>
                      </div>
                      <p className="text-sm text-text-primary">&ldquo;원장님이 친절하시고 워라밸이 정말 좋아요&rdquo;</p>
                    </div>
                    <div className="bg-bg-secondary rounded-xl p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-text-tertiary">전직 치과위생사</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-match-gold fill-match-gold" />
                          <span className="text-xs font-medium">4.2</span>
                        </div>
                      </div>
                      <p className="text-sm text-text-primary">&ldquo;교육 시스템이 체계적이에요&rdquo;</p>
                    </div>
                  </div>
                </div>

                {/* 네이버 리뷰 */}
                <div className="bg-white rounded-2xl p-4 border border-border-light">
                  <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <ExternalLink className="w-5 h-5 text-success" />
                    네이버 리뷰
                  </h2>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-match-gold fill-match-gold" />
                      <span className="text-lg font-bold text-text-primary">4.7</span>
                    </div>
                    <span className="text-sm text-text-secondary">리뷰 128개</span>
                  </div>
                  <div className="space-y-2">
                    <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                      <p className="text-sm text-text-primary">&ldquo;친절하고 꼼꼼한 진료 감사합니다&rdquo;</p>
                      <span className="text-xs text-text-tertiary mt-1 block">환자 리뷰</span>
                    </div>
                    <div className="bg-success/5 border border-success/20 rounded-lg p-3">
                      <p className="text-sm text-text-primary">&ldquo;대기 시간 없이 빠른 진료가 좋았어요&rdquo;</p>
                      <span className="text-xs text-text-tertiary mt-1 block">환자 리뷰</span>
                    </div>
                  </div>
                </div>

                {/* 병원 갤러리 */}
                <div className="bg-white rounded-2xl p-4 border border-border-light">
                  <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Image className="w-5 h-5 text-warning" />
                    병원 사진
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="aspect-square bg-bg-secondary rounded-lg flex items-center justify-center"
                      >
                        <Image className="w-6 h-6 text-text-tertiary" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 안내 문구 */}
                <div className="bg-info/10 border border-info/20 rounded-xl p-4">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-text-primary mb-1">
                        이렇게 구직자에게 보여요!
                      </div>
                      <p className="text-xs text-text-secondary">
                        프로필을 더 풍성하게 채우면 더 많은 인재에게 노출되고,
                        지원률도 높아져요.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="sticky bottom-0 bg-white border-t border-border-light px-4 py-4">
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold"
                >
                  프로필 수정하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function EmployerProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <ProfileContent />
    </Suspense>
  );
}
