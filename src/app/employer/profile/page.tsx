'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
} from 'lucide-react';
import Link from 'next/link';
import { mockEmployerProfile } from '@/lib/mock/data';

const profileSections = [
  { id: 'basic', label: '기본 정보', icon: Building2 },
  { id: 'intro', label: '병원 소개', icon: FileText },
  { id: 'culture', label: '조직 문화', icon: Heart },
  { id: 'benefits', label: '복리후생', icon: Award },
  { id: 'team', label: '팀 소개', icon: Users },
  { id: 'gallery', label: '병원 갤러리', icon: Image },
  { id: 'naver-reviews', label: '네이버 리뷰', icon: ExternalLink },
  { id: 'staff-reviews', label: '직원 리뷰', icon: MessageCircle },
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

export default function EmployerProfilePage() {
  const [activeSection, setActiveSection] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(mockEmployerProfile);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCultureKeywords, setSelectedCultureKeywords] = useState<string[]>([
    '수평적 조직문화',
    '성장 지향',
    '환자 중심',
  ]);
  const [selectedBenefits, setSelectedBenefits] = useState<Record<string, string[]>>({
    salary: ['경쟁력 있는 급여', '성과급 지급'],
    worklife: ['주 5일 근무', '정시 퇴근'],
    growth: ['학회 지원', '자격증 취득 지원'],
    welfare: ['중식 제공', '건강검진'],
  });

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

      {/* AI 자동적재 배너 */}
      <Link href="/employer/profile/setup">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-brand-mint to-brand-mint-dark rounded-2xl p-4 mb-4 text-white"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold">AI 자동적재로 프로필 완성하기</div>
                <div className="text-sm text-white/80">웹에서 병원 정보를 자동으로 수집해요</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5" />
          </div>
        </motion.div>
      </Link>

      {/* 프로필 완성도 */}
      <div className="bg-expert-navy/5 rounded-2xl p-4 mb-6 border border-expert-navy/10">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">프로필 완성도</span>
          <span className="text-lg font-bold text-expert-navy">
            {profile.profileCompleteness}%
          </span>
        </div>
        <div className="progress-bar mb-2">
          <div
            className="progress-fill bg-expert-navy"
            style={{ width: `${profile.profileCompleteness}%` }}
          />
        </div>
        <div className="text-xs text-text-tertiary">
          프로필을 100% 완성하면 후보자에게 더 매력적으로 보여요!
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

      {/* Staff Reviews Section */}
      {activeSection === 'staff-reviews' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
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
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-card-title">직원 리뷰</h3>
              {isEditing && (
                <button className="text-sm text-expert-navy flex items-center gap-1">
                  <Plus className="w-4 h-4" />
                  리뷰 요청
                </button>
              )}
            </div>
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

          {/* 리뷰 관리 안내 */}
          <div className="bg-brand-mint/10 border border-brand-mint/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <MessageCircle className="w-5 h-5 text-brand-mint flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-text-primary mb-1">
                  직원 리뷰로 신뢰도를 높이세요
                </div>
                <p className="text-xs text-text-secondary">
                  솔직한 직원 리뷰가 있으면 구직자들이 병원을 더 신뢰해요.
                  현직/전직 직원에게 리뷰를 요청해보세요.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 프로필 미리보기 CTA */}
      <div className="fixed bottom-20 left-0 right-0 px-4">
        <button
          onClick={() => setShowPreview(true)}
          className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg"
        >
          <Eye className="w-5 h-5" />
          후보자에게 보이는 프로필 미리보기
        </button>
      </div>

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

                {/* 근무 환경 */}
                <div className="bg-white rounded-2xl p-4 border border-border-light">
                  <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-info" />
                    근무 환경
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
