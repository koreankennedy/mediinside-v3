'use client';

import { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  User,
  Briefcase,
  Award,
  Target,
  Settings,
  ChevronRight,
  Plus,
  Edit2,
  MapPin,
  Phone,
  Mail,
  Shield,
  Eye,
  EyeOff,
  Sparkles,
  TrendingUp,
  X,
  Check,
  Search,
  Star,
  MessageCircle,
  Lock,
  Unlock,
  Building2,
  Clock,
  AlertCircle,
  Share2,
  Users,
  Crown,
  UserCheck,
  Send,
  Info,
} from 'lucide-react';

// 추천 술기 목록 (피부과/성형외과 기반)
const suggestedSkills = {
  피부과: [
    '레이저 시술 보조',
    '피부 분석',
    '스킨케어 상담',
    'IPL 시술',
    '보톡스 보조',
    '필러 보조',
    '리프팅 시술 보조',
    'LDM 시술',
    '울쎄라 시술',
    '피부 관리',
  ],
  성형외과: [
    '수술 보조',
    '수술 준비',
    '회복실 관리',
    '마취 보조',
    '상처 드레싱',
    '봉합사 제거',
    '환자 상담',
    '수술 후 관리',
    '수술 기구 소독',
    '의무 기록',
  ],
  공통: [
    '환자 응대',
    '예약 관리',
    '의료 기록',
    '주사 투여',
    '채혈',
    '활력 징후 측정',
    '약물 관리',
    '의료 기기 관리',
  ],
};

// Mock profile data - 피부과/성형외과 기반으로 변경
const mockProfile = {
  name: '김민지',
  phone: '010-1234-5678',
  email: 'minji.kim@email.com',
  licenseType: '간호사',
  licenseNumber: 'RN-2020-12345',
  region: '서울 강남구',
  workType: '정규직',
  fitType: '하이엔드 성과자',
  fitScore: { x: 35, y: 30 },
  profileCompleteness: 85,
  isPublic: true,
  profileVisibility: 'all' as 'all' | 'interested' | 'hidden', // S8: 3가지 공개 옵션
  jobStatus: 'active' as 'active' | 'passive' | 'notLooking', // S9: 3가지 이직 상태
  skills: ['레이저 시술 보조', '보톡스 보조', '환자 상담', '피부 관리'],
  experience: [
    {
      id: 1,
      hospital: '청담리더스피부과',
      position: '간호사',
      period: '2023.03 - 현재',
      isCurrent: true,
      verified: true, // 경력검증 완료
      verifiedDate: '2024.01.15',
    },
    {
      id: 2,
      hospital: '강남뷰티의원',
      position: '간호사',
      period: '2020.03 - 2023.02',
      isCurrent: false,
      verified: false, // 경력검증 미완료
      verifiedDate: null,
    },
  ],
  desiredSalary: { min: 400, max: 450 },
};

// 내 리뷰 (다른 사람이 나에 대해 작성한 리뷰)
const mockMyReviews = [
  {
    id: 1,
    author: '청담리더스피부과 원장',
    authorType: 'director',
    rating: 4.8,
    content: '2년간 함께 일하면서 정말 믿음직했습니다. 환자 응대가 친절하고, 레이저 시술 보조 실력이 뛰어나요. 적극 추천합니다.',
    date: '2024.01.15',
    isVisible: true,
  },
  {
    id: 2,
    author: '청담리더스피부과 수간호사',
    authorType: 'supervisor',
    rating: 4.5,
    content: '책임감이 강하고 새로운 걸 배우려는 의지가 강해요. 후임 교육도 잘 해줍니다.',
    date: '2024.01.10',
    isVisible: true,
  },
  {
    id: 3,
    author: '강남뷰티의원 동료',
    authorType: 'colleague',
    rating: 4.2,
    content: '팀워크가 좋고 협업을 잘해요. 다만 가끔 꼼꼼하게 챙기지 못하는 부분이 있었어요.',
    date: '2023.02.20',
    isVisible: false, // 마스킹된 리뷰
  },
  {
    id: 4,
    author: '강남뷰티의원 원장',
    authorType: 'director',
    rating: 3.8,
    content: '성실하게 근무했지만, 성형외과 특성상 바쁜 시간대에 조금 버거워하는 모습이 있었습니다.',
    date: '2023.02.15',
    isVisible: false, // 마스킹된 리뷰
  },
];

const sections = [
  { id: 'basic', label: '기본 정보', icon: User },
  { id: 'experience', label: '경력검증', icon: Briefcase },
  { id: 'skills', label: '술기 업데이트', icon: Award },
  { id: 'reviews', label: '내 리뷰', icon: MessageCircle },
  { id: 'workExperience', label: '재직경험 공유', icon: Share2 },
  { id: 'fitType', label: '커리어 진단', icon: Target },
  { id: 'preferences', label: '희망 조건', icon: Settings },
];

// 재직경험 공유 - 작성한 리뷰 목록
const myWrittenReviews = [
  {
    id: 1,
    hospitalName: '강남뷰티의원',
    reviewType: 'director' as const,
    rating: 4.5,
    content: '환자 케어에 관심이 많으시고, 직원 복지도 신경 써주셔서 좋았습니다. 다만 바쁜 시즌에는 야근이 잦았어요.',
    date: '2024.01.10',
    isAnonymous: true,
  },
  {
    id: 2,
    hospitalName: '강남뷰티의원',
    reviewType: 'supervisor' as const,
    rating: 4.2,
    content: '업무 분배를 공정하게 해주시고, 신입 교육도 체계적으로 진행해주셨어요.',
    date: '2024.01.08',
    isAnonymous: true,
  },
];

// 리뷰 작성 대상 병원 (경력에서 가져옴)
const reviewableHospitals = [
  { id: 1, name: '청담리더스피부과', period: '2023.03 - 현재', isCurrent: true },
  { id: 2, name: '강남뷰티의원', period: '2020.03 - 2023.02', isCurrent: false },
];

function ProfileContent() {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState('basic');
  const [isPublic, setIsPublic] = useState(mockProfile.isPublic);
  const [profileVisibility, setProfileVisibility] = useState<'all' | 'interested' | 'hidden'>(mockProfile.profileVisibility);
  const [jobStatus, setJobStatus] = useState<'active' | 'passive' | 'notLooking'>(mockProfile.jobStatus);

  // URL 쿼리 파라미터로 섹션 자동 이동
  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    }
  }, [searchParams]);

  // 과거/재직 병원 숨김 설정
  const [hideFromPastEmployers, setHideFromPastEmployers] = useState(true);
  const [hideFromCurrentEmployer, setHideFromCurrentEmployer] = useState(true);

  // 술기 편집 상태
  const [skills, setSkills] = useState<string[]>(mockProfile.skills);
  const [isEditingSkills, setIsEditingSkills] = useState(false);
  const [skillSearchQuery, setSkillSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'피부과' | '성형외과' | '공통'>('피부과');
  const [customSkill, setCustomSkill] = useState('');

  // 리뷰 마스킹 상태
  const [reviewVisibility, setReviewVisibility] = useState<Record<number, boolean>>(
    mockMyReviews.reduce((acc, review) => ({ ...acc, [review.id]: review.isVisible }), {})
  );
  const [showMaskingModal, setShowMaskingModal] = useState(false);
  const [selectedReviewForMasking, setSelectedReviewForMasking] = useState<typeof mockMyReviews[0] | null>(null);
  const [maskingReason, setMaskingReason] = useState('');

  // 재직경험 공유 상태
  const [showWriteReviewModal, setShowWriteReviewModal] = useState(false);
  const [selectedHospitalForReview, setSelectedHospitalForReview] = useState<typeof reviewableHospitals[0] | null>(null);
  const [reviewTargetType, setReviewTargetType] = useState<'director' | 'supervisor' | 'colleague'>('director');
  const [newReviewRating, setNewReviewRating] = useState(0);
  const [newReviewContent, setNewReviewContent] = useState('');
  const [isAnonymousReview, setIsAnonymousReview] = useState(true);
  // 동료 리뷰 타입: 전체 평가 vs 개인별 평가
  const [colleagueReviewType, setColleagueReviewType] = useState<'overall' | 'individual'>('overall');
  const [colleagueName, setColleagueName] = useState('');

  const toggleReviewVisibility = (id: number) => {
    setReviewVisibility((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openMaskingModal = (review: typeof mockMyReviews[0]) => {
    setSelectedReviewForMasking(review);
    setMaskingReason('');
    setShowMaskingModal(true);
  };

  const submitMaskingRequest = () => {
    if (selectedReviewForMasking) {
      alert(`마스킹 요청이 접수되었습니다.\n\n리뷰: "${selectedReviewForMasking.content.slice(0, 30)}..."\n사유: ${maskingReason || '사유 미입력'}\n\n검토 후 3일 내 처리됩니다.`);
      setShowMaskingModal(false);
    }
  };

  const visibleReviewsCount = Object.values(reviewVisibility).filter(Boolean).length;
  const averageRating = (
    mockMyReviews
      .filter((r) => reviewVisibility[r.id])
      .reduce((sum, r) => sum + r.rating, 0) / visibleReviewsCount || 0
  ).toFixed(1);

  const addSkill = (skill: string) => {
    if (!skills.includes(skill)) {
      setSkills((prev) => [...prev, skill]);
    }
  };

  const removeSkill = (skill: string) => {
    setSkills((prev) => prev.filter((s) => s !== skill));
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !skills.includes(customSkill.trim())) {
      setSkills((prev) => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  // 필터된 추천 술기
  const filteredSuggestions = suggestedSkills[selectedCategory].filter(
    (skill) =>
      !skills.includes(skill) &&
      (skillSearchQuery === '' || skill.toLowerCase().includes(skillSearchQuery.toLowerCase()))
  );

  const completenessItems = [
    { label: '기본 정보', completed: true },
    { label: '경력 사항', completed: true },
    { label: '보유 술기', completed: true },
    { label: '매칭 핏 진단', completed: true },
    { label: '희망 조건', completed: true },
    { label: '자격증 등록', completed: false },
  ];

  return (
    <div className="px-4 py-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl p-5 border border-border-light mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-brand-mint/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-brand-mint" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-expert-navy">{mockProfile.name}</h1>
            <p className="text-text-secondary">{mockProfile.licenseType}</p>
          </div>
        </div>

        {/* Profile Completeness */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-text-secondary">프로필 완성도</span>
            <span className="text-lg font-bold text-brand-mint">{mockProfile.profileCompleteness}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-fill"
              initial={{ width: 0 }}
              animate={{ width: `${mockProfile.profileCompleteness}%` }}
            />
          </div>
        </div>

        {/* Incomple Items */}
        <div className="nudge-box">
          <Sparkles className="w-4 h-4 text-brand-mint inline mr-2" />
          <strong>자격증</strong>만 등록하면 100%! 오퍼가 <strong>2배</strong> 늘어나요.
        </div>
      </div>

      {/* 이직 상태 (S9) */}
      <div className="bg-white rounded-2xl p-4 border border-border-light mb-4">
        <h3 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-mint" />
          이직 상태
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'active' as const, label: '적극 구직 중', color: 'brand-mint' },
            { id: 'passive' as const, label: '오퍼 고려 중', color: 'warning' },
            { id: 'notLooking' as const, label: '이직 안 함', color: 'text-tertiary' },
          ].map((status) => (
            <button
              key={status.id}
              onClick={() => setJobStatus(status.id)}
              className={`p-3 rounded-xl text-sm font-medium transition-all ${
                jobStatus === status.id
                  ? status.id === 'active'
                    ? 'bg-brand-mint text-white'
                    : status.id === 'passive'
                    ? 'bg-warning text-white'
                    : 'bg-text-tertiary text-white'
                  : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-text-tertiary mt-2">
          {jobStatus === 'active' && '병원에서 적극적으로 연락할 거예요'}
          {jobStatus === 'passive' && '좋은 조건일 때만 연락해요'}
          {jobStatus === 'notLooking' && '오퍼를 받지 않아요'}
        </p>
      </div>

      {/* 프로필 공개 */}
      <div className="bg-white rounded-2xl p-4 border border-border-light mb-6">
        {/* 메인 공개 토글 */}
        <div className="flex items-center justify-between pb-3 border-b border-border-light">
          <div className="flex items-center gap-3">
            {isPublic ? (
              <Eye className="w-5 h-5 text-brand-mint" />
            ) : (
              <EyeOff className="w-5 h-5 text-text-tertiary" />
            )}
            <div>
              <div className="font-medium text-text-primary">프로필 공개</div>
              <div className="text-xs text-text-secondary">
                {isPublic ? '병원에서 내 프로필을 볼 수 있어요' : '내 프로필이 숨겨져 있어요'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsPublic(!isPublic)}
            className={`w-12 h-7 rounded-full transition-colors ${
              isPublic ? 'bg-brand-mint' : 'bg-bg-tertiary'
            }`}
          >
            <motion.div
              className="w-5 h-5 bg-white rounded-full shadow-sm"
              animate={{ x: isPublic ? 24 : 4 }}
            />
          </button>
        </div>

        {/* 세부 공개 설정 */}
        {isPublic && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="pt-3 space-y-3"
          >
            <div className="text-xs text-text-tertiary mb-2">공개 제외 병원</div>

            {/* 현재 재직 중인 병원 숨김 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-text-tertiary" />
                <div>
                  <div className="text-sm text-text-primary">현재 재직중인 병원에 숨기기</div>
                  <div className="text-xs text-text-tertiary">{mockProfile.experience[0]?.hospital || '강남스마일치과'}</div>
                </div>
              </div>
              <button
                onClick={() => setHideFromCurrentEmployer(!hideFromCurrentEmployer)}
                className={`w-10 h-6 rounded-full transition-colors ${
                  hideFromCurrentEmployer ? 'bg-brand-mint' : 'bg-bg-tertiary'
                }`}
              >
                <motion.div
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: hideFromCurrentEmployer ? 20 : 3 }}
                />
              </button>
            </div>

            {/* 과거 근무 병원 숨김 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-text-tertiary" />
                <div>
                  <div className="text-sm text-text-primary">과거 근무 병원에 숨기기</div>
                  <div className="text-xs text-text-tertiary">이전 직장 {mockProfile.experience.length - 1}곳</div>
                </div>
              </div>
              <button
                onClick={() => setHideFromPastEmployers(!hideFromPastEmployers)}
                className={`w-10 h-6 rounded-full transition-colors ${
                  hideFromPastEmployers ? 'bg-brand-mint' : 'bg-bg-tertiary'
                }`}
              >
                <motion.div
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: hideFromPastEmployers ? 20 : 3 }}
                />
              </button>
            </div>

            <div className="text-xs text-text-tertiary bg-bg-secondary rounded-lg p-2">
              💡 숨김 설정된 병원에서는 내 프로필을 검색하거나 볼 수 없어요
            </div>
          </motion.div>
        )}
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeSection === section.id
                  ? 'bg-brand-mint text-white'
                  : 'bg-white text-text-secondary border border-border-light'
              }`}
            >
              <Icon className="w-4 h-4" />
              {section.label}
            </button>
          );
        })}
      </div>

      {/* Section Content */}
      <div className="space-y-4">
        {/* Basic Info */}
        {activeSection === 'basic' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 border border-border-light"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-section-title">기본 정보</h2>
              <button className="p-2 hover:bg-bg-secondary rounded-lg transition-colors">
                <Edit2 className="w-4 h-4 text-text-tertiary" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-text-tertiary" />
                <div>
                  <div className="text-xs text-text-tertiary">연락처</div>
                  <div className="text-text-primary">{mockProfile.phone}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-text-tertiary" />
                <div>
                  <div className="text-xs text-text-tertiary">이메일</div>
                  <div className="text-text-primary">{mockProfile.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-text-tertiary" />
                <div>
                  <div className="text-xs text-text-tertiary">면허</div>
                  <div className="text-text-primary">
                    {mockProfile.licenseType} ({mockProfile.licenseNumber})
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-text-tertiary" />
                <div>
                  <div className="text-xs text-text-tertiary">희망 지역</div>
                  <div className="text-text-primary">{mockProfile.region}</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Experience - 경력검증 */}
        {activeSection === 'experience' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl p-5 border border-border-light">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-section-title">경력검증</h2>
                <Link href="/seeker/ai-interview/verification">
                  <button className="flex items-center gap-1 text-sm text-brand-mint font-medium bg-brand-mint/10 px-3 py-1.5 rounded-lg hover:bg-brand-mint/20 transition-colors">
                    <Plus className="w-4 h-4" />
                    추가
                  </button>
                </Link>
              </div>

              <div className="space-y-4">
                {mockProfile.experience.map((exp, index) => (
                  <div
                    key={exp.id}
                    className={`relative pl-6 ${
                      index < mockProfile.experience.length - 1
                        ? 'pb-4 border-l-2 border-border-light'
                        : ''
                    }`}
                  >
                    <div
                      className={`absolute left-0 top-0 w-3 h-3 rounded-full -translate-x-[7px] ${
                        exp.verified ? 'bg-success' : exp.isCurrent ? 'bg-brand-mint' : 'bg-border-light'
                      }`}
                    />
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-text-primary">{exp.hospital}</span>
                          {exp.verified ? (
                            <span className="flex items-center gap-1 text-xs bg-success/10 text-success px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" />
                              검증완료
                            </span>
                          ) : (
                            <Link href="/seeker/ai-interview/verification">
                              <button className="text-xs bg-warning/10 text-warning px-2 py-0.5 rounded-full hover:bg-warning/20 transition-colors font-medium">
                                검증요청
                              </button>
                            </Link>
                          )}
                        </div>
                        <div className="text-sm text-text-secondary">{exp.position}</div>
                        <div className="text-xs text-text-tertiary mt-1">{exp.period}</div>
                        {exp.verified && exp.verifiedDate && (
                          <div className="text-xs text-success mt-1">검증일: {exp.verifiedDate}</div>
                        )}
                      </div>
                      {exp.isCurrent && (
                        <span className="badge-success">현재</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 경력검증 안내 */}
            <div className="bg-brand-mint/5 rounded-2xl p-4 border border-brand-mint/20">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-brand-mint flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-brand-mint mb-1">경력검증이란?</h3>
                  <p className="text-xs text-text-secondary">
                    이전 직장에서 경력을 확인받으면 <strong>신뢰도 배지</strong>가 표시돼요.
                    검증된 경력은 병원에서 <strong>3배 더</strong> 신뢰해요!
                  </p>
                  <button className="mt-2 text-xs text-brand-mint font-medium flex items-center gap-1">
                    검증 방법 알아보기 <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Skills */}
        {activeSection === 'skills' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* 현재 보유 술기 */}
            <div className="bg-white rounded-2xl p-5 border border-border-light">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-section-title">보유 술기 ({skills.length}개)</h2>
                <button
                  onClick={() => setIsEditingSkills(!isEditingSkills)}
                  className={`flex items-center gap-1 text-sm font-medium ${
                    isEditingSkills ? 'text-success' : 'text-brand-mint'
                  }`}
                >
                  {isEditingSkills ? (
                    <>
                      <Check className="w-4 h-4" />
                      완료
                    </>
                  ) : (
                    <>
                      <Edit2 className="w-4 h-4" />
                      편집
                    </>
                  )}
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {skills.map((skill) => (
                  <motion.span
                    key={skill}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-1 ${
                      isEditingSkills
                        ? 'bg-brand-mint text-white'
                        : 'bg-brand-mint/10 text-brand-mint'
                    }`}
                  >
                    {skill}
                    {isEditingSkills && (
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:bg-white/20 rounded-full p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </motion.span>
                ))}
                {skills.length === 0 && (
                  <span className="text-text-tertiary text-sm">등록된 술기가 없어요</span>
                )}
              </div>

              {skills.length < 5 && (
                <div className="nudge-box">
                  <Sparkles className="w-4 h-4 text-brand-mint inline mr-1" />
                  술기 <strong>{5 - skills.length}개만 더</strong> 등록하면 매칭 정확도가 확 올라가요!
                </div>
              )}
              {skills.length >= 5 && (
                <div className="nudge-box bg-success/10 border-success/20">
                  <Check className="w-4 h-4 text-success inline mr-1" />
                  술기가 충분해요! 더 추가하면 더 정확한 매칭이 가능해요.
                </div>
              )}
            </div>

            {/* 술기 추가 패널 */}
            <AnimatePresence>
              {isEditingSkills && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-white rounded-2xl p-5 border border-border-light overflow-hidden"
                >
                  <h3 className="font-semibold text-text-primary mb-3">술기 추가하기</h3>

                  {/* 검색 */}
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input
                      type="text"
                      value={skillSearchQuery}
                      onChange={(e) => setSkillSearchQuery(e.target.value)}
                      placeholder="술기 검색..."
                      className="w-full pl-10 pr-4 py-2.5 bg-bg-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-mint/20"
                    />
                  </div>

                  {/* 카테고리 탭 */}
                  <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
                    {(['피부과', '성형외과', '공통'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                          selectedCategory === cat
                            ? 'bg-brand-mint text-white'
                            : 'bg-bg-secondary text-text-secondary'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* 추천 술기 */}
                  <div className="mb-4">
                    <div className="text-xs text-text-tertiary mb-2">추천 술기</div>
                    <div className="flex flex-wrap gap-2">
                      {filteredSuggestions.slice(0, 8).map((skill) => (
                        <button
                          key={skill}
                          onClick={() => addSkill(skill)}
                          className="px-3 py-1.5 bg-bg-secondary text-text-primary rounded-full text-sm hover:bg-brand-mint/10 hover:text-brand-mint transition-all flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          {skill}
                        </button>
                      ))}
                      {filteredSuggestions.length === 0 && (
                        <span className="text-text-tertiary text-sm">모든 술기를 추가했어요!</span>
                      )}
                    </div>
                  </div>

                  {/* 직접 입력 */}
                  <div>
                    <div className="text-xs text-text-tertiary mb-2">직접 입력</div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customSkill}
                        onChange={(e) => setCustomSkill(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
                        placeholder="다른 술기 입력..."
                        className="flex-1 px-4 py-2.5 bg-bg-secondary rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-mint/20"
                      />
                      <button
                        onClick={addCustomSkill}
                        disabled={!customSkill.trim()}
                        className="px-4 py-2.5 bg-brand-mint text-white rounded-xl text-sm font-medium disabled:opacity-50"
                      >
                        추가
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 술기 팁 */}
            <div className="bg-bg-secondary rounded-2xl p-4">
              <h3 className="text-sm font-medium text-text-primary mb-2">💡 술기 등록 팁</h3>
              <ul className="text-xs text-text-secondary space-y-1">
                <li>• 실제로 할 수 있는 술기만 등록하세요</li>
                <li>• 구체적으로 적을수록 매칭 정확도가 올라가요</li>
                <li>• 병원에서 배운 특수 술기도 등록해보세요</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Reviews - 내 리뷰 */}
        {activeSection === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* 리뷰 요약 */}
            <div className="bg-white rounded-2xl p-5 border border-border-light">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-section-title">내 리뷰</h2>
                <div className="flex items-center gap-2 text-sm text-text-secondary">
                  <Eye className="w-4 h-4" />
                  <span>공개 {visibleReviewsCount}/{mockMyReviews.length}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center mb-1">
                    <Star className="w-5 h-5 text-warning fill-warning" />
                    <span className="text-2xl font-bold text-expert-navy">{averageRating}</span>
                  </div>
                  <div className="text-xs text-text-tertiary">공개 리뷰 평균</div>
                </div>
                <div className="flex-1 h-px bg-border-light" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-mint">{visibleReviewsCount}</div>
                  <div className="text-xs text-text-tertiary">공개 리뷰</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-text-tertiary">{mockMyReviews.length - visibleReviewsCount}</div>
                  <div className="text-xs text-text-tertiary">비공개 리뷰</div>
                </div>
              </div>

              <div className="bg-brand-mint/5 border border-brand-mint/20 rounded-xl p-3">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-text-secondary">
                    <strong className="text-brand-mint">리뷰 마스킹 기능</strong>으로 원하지 않는 리뷰를 비공개 처리할 수 있어요.
                    비공개 리뷰는 병원에서 볼 수 없습니다.
                  </div>
                </div>
              </div>
            </div>

            {/* 리뷰 목록 */}
            <div className="space-y-3">
              {mockMyReviews.map((review) => {
                const isVisible = reviewVisibility[review.id];
                const authorTypeLabel = {
                  director: '원장',
                  supervisor: '수간호사',
                  colleague: '동료',
                  junior: '후임',
                }[review.authorType] || '기타';

                return (
                  <motion.div
                    key={review.id}
                    layout
                    className={`bg-white rounded-2xl p-4 border transition-all ${
                      isVisible ? 'border-border-light' : 'border-text-tertiary/30 bg-bg-secondary/50'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                          review.authorType === 'director'
                            ? 'bg-expert-navy/10 text-expert-navy'
                            : review.authorType === 'supervisor'
                            ? 'bg-brand-mint/10 text-brand-mint'
                            : 'bg-bg-tertiary text-text-secondary'
                        }`}>
                          {authorTypeLabel}
                        </span>
                        <span className="text-sm font-medium text-text-primary">{review.author}</span>
                      </div>
                      <button
                        onClick={() => toggleReviewVisibility(review.id)}
                        className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-all ${
                          isVisible
                            ? 'bg-brand-mint/10 text-brand-mint hover:bg-brand-mint/20'
                            : 'bg-text-tertiary/10 text-text-tertiary hover:bg-text-tertiary/20'
                        }`}
                      >
                        {isVisible ? (
                          <>
                            <Unlock className="w-3 h-3" />
                            공개
                          </>
                        ) : (
                          <>
                            <Lock className="w-3 h-3" />
                            비공개
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.floor(review.rating)
                              ? 'text-warning fill-warning'
                              : star - 0.5 <= review.rating
                              ? 'text-warning fill-warning/50'
                              : 'text-border-light'
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm font-medium text-text-primary">{review.rating}</span>
                    </div>

                    <div className={`relative ${!isVisible ? 'select-none' : ''}`}>
                      <p className={`text-sm text-text-secondary leading-relaxed ${
                        !isVisible ? 'blur-sm' : ''
                      }`}>
                        {review.content}
                      </p>
                      {!isVisible && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-white/80 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs text-text-tertiary">
                            <EyeOff className="w-3 h-3" />
                            비공개 처리된 리뷰
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-border-light/50 flex items-center justify-between">
                      <span className="text-xs text-text-tertiary">{review.date}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openMaskingModal(review);
                        }}
                        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-warning/10 text-warning hover:bg-warning/20 transition-colors font-medium"
                      >
                        <AlertCircle className="w-3 h-3" />
                        마스킹 요청
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* 리뷰 관리 팁 */}
            <div className="bg-bg-secondary rounded-2xl p-4">
              <h3 className="text-sm font-medium text-text-primary mb-2">💡 리뷰 관리 팁</h3>
              <ul className="text-xs text-text-secondary space-y-1">
                <li>• 좋은 리뷰를 공개하면 오퍼 확률이 <strong>3배</strong> 올라가요</li>
                <li>• 원장/수간호사 리뷰가 가장 영향력이 높아요</li>
                <li>• 비공개 리뷰도 평균 평점에는 영향을 주지 않아요</li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* 재직경험 공유 */}
        {activeSection === 'workExperience' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* 안내 헤더 */}
            <div className="bg-gradient-to-br from-success/10 to-brand-mint/5 rounded-2xl p-5 border border-success/20">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Share2 className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h2 className="font-bold text-text-primary mb-1">재직경험 공유하기</h2>
                  <p className="text-sm text-text-secondary">
                    이전 직장의 병원장, 실장, 동료에 대한 리뷰를 남겨주세요.
                    다른 구직자들에게 큰 도움이 됩니다!
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center gap-1 text-xs text-success">
                      <Check className="w-3 h-3" />
                      <span>익명 보장</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-success">
                      <Check className="w-3 h-3" />
                      <span>거절 횟수 초기화</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 리뷰 작성 가능한 병원 */}
            <div className="bg-white rounded-2xl p-5 border border-border-light">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-mint" />
                리뷰 작성 가능한 병원
              </h3>
              <div className="space-y-3">
                {reviewableHospitals.map((hospital) => (
                  <div
                    key={hospital.id}
                    className="flex items-center justify-between p-4 bg-bg-secondary rounded-xl"
                  >
                    <div>
                      <div className="font-medium text-text-primary flex items-center gap-2">
                        {hospital.name}
                        {hospital.isCurrent && (
                          <span className="text-xs bg-brand-mint/10 text-brand-mint px-2 py-0.5 rounded-full">
                            현재 재직
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-text-tertiary mt-0.5">{hospital.period}</div>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedHospitalForReview(hospital);
                        setShowWriteReviewModal(true);
                        setNewReviewRating(0);
                        setNewReviewContent('');
                      }}
                      className="px-4 py-2 bg-brand-mint text-white rounded-xl text-sm font-medium hover:bg-brand-mint-dark transition-colors"
                    >
                      리뷰 작성
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 리뷰 유형별 작성 가이드 */}
            <div className="bg-white rounded-2xl p-5 border border-border-light">
              <h3 className="font-semibold text-text-primary mb-4">리뷰 유형 안내</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-expert-navy/5 rounded-xl">
                  <div className="w-10 h-10 bg-expert-navy/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Crown className="w-5 h-5 text-expert-navy" />
                  </div>
                  <div>
                    <div className="font-medium text-expert-navy">병원장 리뷰</div>
                    <p className="text-xs text-text-secondary mt-0.5">
                      원장님의 경영 스타일, 직원 케어, 의료 철학 등
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-brand-mint/5 rounded-xl">
                  <div className="w-10 h-10 bg-brand-mint/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserCheck className="w-5 h-5 text-brand-mint" />
                  </div>
                  <div>
                    <div className="font-medium text-brand-mint">실장/팀장 리뷰</div>
                    <p className="text-xs text-text-secondary mt-0.5">
                      팀 분위기, 업무 분배, 교육 체계, 소통 방식 등
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-info/5 rounded-xl">
                  <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <div className="font-medium text-info">동료 리뷰</div>
                    <p className="text-xs text-text-secondary mt-0.5">
                      팀워크, 협업 분위기, 근무 환경, 워라밸 등
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 내가 작성한 리뷰 */}
            {myWrittenReviews.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-border-light">
                <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-text-tertiary" />
                  내가 작성한 리뷰 ({myWrittenReviews.length})
                </h3>
                <div className="space-y-3">
                  {myWrittenReviews.map((review) => {
                    const typeInfo = {
                      director: { label: '병원장', color: 'bg-expert-navy/10 text-expert-navy', icon: Crown },
                      supervisor: { label: '실장/팀장', color: 'bg-brand-mint/10 text-brand-mint', icon: UserCheck },
                      colleague: { label: '동료', color: 'bg-info/10 text-info', icon: Users },
                    }[review.reviewType];
                    const TypeIcon = typeInfo.icon;

                    return (
                      <div key={review.id} className="p-4 bg-bg-secondary rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <div className="font-medium text-text-primary">{review.hospitalName}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs px-2 py-0.5 rounded-full ${typeInfo.color} flex items-center gap-1`}>
                                <TypeIcon className="w-3 h-3" />
                                {typeInfo.label}
                              </span>
                              {review.isAnonymous && (
                                <span className="text-xs text-text-tertiary">익명</span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-warning fill-warning" />
                            <span className="font-medium text-text-primary">{review.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-text-secondary">{review.content}</p>
                        <div className="text-xs text-text-tertiary mt-2">{review.date}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 리뷰 작성 혜택 */}
            <div className="bg-success/5 border border-success/20 rounded-2xl p-4">
              <h3 className="text-sm font-medium text-success mb-2 flex items-center gap-1">
                <Sparkles className="w-4 h-4" />
                리뷰 작성 혜택
              </h3>
              <ul className="text-xs text-text-secondary space-y-1">
                <li>• 리뷰 1개 작성 시 <strong className="text-success">거절 횟수 초기화</strong></li>
                <li>• 3개 이상 작성 시 <strong className="text-success">프로필 우선 노출</strong></li>
                <li>• 양질의 리뷰 작성 시 <strong className="text-success">포인트 지급</strong></li>
              </ul>
            </div>
          </motion.div>
        )}

        {/* Fit Type - 커리어 진단 */}
        {activeSection === 'fitType' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {/* 진단 결과 헤더 */}
            <div className="bg-gradient-to-br from-brand-mint/10 to-expert-navy/5 rounded-2xl p-5 border border-brand-mint/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-section-title">AI 커리어 진단 결과</h2>
                <Link href="/seeker/fit-test" className="text-sm text-brand-mint font-medium">
                  다시 진단
                </Link>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-brand-mint/20 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-10 h-10 text-brand-mint" />
                </div>
                <div className="flex-1">
                  <div className="text-xl font-bold text-expert-navy">{mockProfile.fitType}</div>
                  <p className="text-sm text-text-secondary mt-1">
                    성과 보상과 성장 기회를 중시해요
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs bg-brand-mint/20 text-brand-mint px-2 py-1 rounded-full">
                      상위 12%
                    </span>
                    <span className="text-xs text-text-tertiary">2024.12.30 진단</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 성향 매트릭스 */}
            <div className="bg-white rounded-2xl p-5 border border-border-light">
              <h3 className="font-semibold text-text-primary mb-4">성향 분석</h3>
              <div className="flex gap-4">
                {/* Matrix */}
                <div className="w-32 h-32 relative flex-shrink-0">
                  <div className="absolute inset-0 border border-border-light rounded-lg bg-bg-secondary" />
                  <div className="absolute top-1/2 left-0 right-0 border-t border-border-light" />
                  <div className="absolute left-1/2 top-0 bottom-0 border-l border-border-light" />
                  <motion.div
                    className="absolute w-4 h-4 bg-brand-mint rounded-full border-2 border-white shadow-lg"
                    style={{
                      left: `${50 + (mockProfile.fitScore.x / 100) * 40}%`,
                      top: `${50 - (mockProfile.fitScore.y / 100) * 40}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                  <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] text-text-tertiary">성장</div>
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-text-tertiary">안정</div>
                  <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] text-text-tertiary">관계</div>
                  <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] text-text-tertiary">성과</div>
                </div>
                {/* 설명 */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">성과 지향</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                        <div className="h-full bg-brand-mint rounded-full" style={{ width: '85%' }} />
                      </div>
                      <span className="text-xs font-medium text-brand-mint">85%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">성장 지향</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                        <div className="h-full bg-info rounded-full" style={{ width: '78%' }} />
                      </div>
                      <span className="text-xs font-medium text-info">78%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">안정 지향</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                        <div className="h-full bg-success rounded-full" style={{ width: '45%' }} />
                      </div>
                      <span className="text-xs font-medium text-success">45%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">관계 지향</span>
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                        <div className="h-full bg-warning rounded-full" style={{ width: '62%' }} />
                      </div>
                      <span className="text-xs font-medium text-warning">62%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 추천 분과 */}
            <div className="bg-white rounded-2xl p-5 border border-border-light">
              <h3 className="font-semibold text-text-primary mb-4">추천 분과</h3>
              <div className="space-y-3">
                {[
                  { name: '피부과', avgSalary: '420만', percentage: 94, rank: 1 },
                  { name: '성형외과', avgSalary: '450만', percentage: 89, rank: 2 },
                  { name: '안과', avgSalary: '380만', percentage: 82, rank: 3 },
                ].map((dept) => (
                  <div key={dept.name} className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        dept.rank === 1 ? 'bg-brand-mint text-white' : 'bg-white text-text-secondary border border-border-light'
                      }`}>
                        {dept.rank}
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">{dept.name}</div>
                        <div className="text-xs text-text-tertiary">평균 연봉 {dept.avgSalary}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-brand-mint">{dept.percentage}%</div>
                      <div className="text-xs text-text-tertiary">적합도</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI 인사이트 */}
            <div className="bg-expert-navy/5 rounded-2xl p-5 border border-expert-navy/10">
              <h3 className="font-semibold text-expert-navy mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                AI 커리어 인사이트
              </h3>
              <div className="space-y-3">
                <div className="bg-white rounded-xl p-3">
                  <div className="text-sm font-medium text-text-primary mb-1">강점</div>
                  <p className="text-sm text-text-secondary">
                    성과 중심적 사고와 빠른 학습 능력이 돋보입니다. 인센티브 구조가 있는 환경에서 높은 성과를 낼 가능성이 높아요.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <div className="text-sm font-medium text-text-primary mb-1">발전 포인트</div>
                  <p className="text-sm text-text-secondary">
                    팀워크보다 개인 성과에 집중하는 경향이 있어요. 협업이 중요한 환경에서는 의식적인 노력이 필요할 수 있습니다.
                  </p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <div className="text-sm font-medium text-text-primary mb-1">추천 커리어 경로</div>
                  <p className="text-sm text-text-secondary">
                    1~2년 후 수간호사 또는 팀 리더 포지션으로 성장하는 것이 적합해 보여요. 피부과/성형외과 분야에서 전문성을 쌓는 것을 추천드립니다.
                  </p>
                </div>
              </div>
            </div>

            {/* 이력서 보기/수정 (S10) */}
            <div className="bg-white rounded-2xl p-5 border border-border-light">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-section-title flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-expert-navy" />
                  내 이력서
                </h2>
                <Link href="/seeker/profile/edit" className="text-sm text-brand-mint font-medium">
                  수정하기
                </Link>
              </div>

              <div className="space-y-3">
                <Link href="/seeker/ai-interview/resume">
                  <button className="w-full py-3 bg-brand-mint/10 text-brand-mint rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-brand-mint/20 transition-colors">
                    <Eye className="w-5 h-5" />
                    이력서 미리보기
                  </button>
                </Link>
                <Link href="/seeker/profile/edit">
                  <button className="w-full py-3 border border-border-light text-text-primary rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-bg-secondary transition-colors">
                    <Edit2 className="w-5 h-5" />
                    이력서 수정하기
                  </button>
                </Link>
              </div>

              <div className="mt-4 pt-4 border-t border-border-light">
                <div className="nudge-box">
                  <Sparkles className="w-4 h-4 text-brand-mint inline mr-1" />
                  이력서를 완성하면 AI가 <strong>맞춤 피드백</strong>을 드려요!
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Preferences */}
        {activeSection === 'preferences' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 border border-border-light"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-section-title">희망 조건</h2>
              <button className="p-2 hover:bg-bg-secondary rounded-lg transition-colors">
                <Edit2 className="w-4 h-4 text-text-tertiary" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="text-sm text-text-secondary mb-2">희망 연봉</div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-expert-navy">
                    {mockProfile.desiredSalary.min}~{mockProfile.desiredSalary.max}만원
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-text-secondary mb-2">근무 형태</div>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-brand-mint text-white rounded-full text-sm font-medium">
                    {mockProfile.workType}
                  </span>
                </div>
              </div>

              <div>
                <div className="text-sm text-text-secondary mb-2">우선순위</div>
                <div className="space-y-2">
                  {['급여', '워라밸', '성장', '안정'].map((priority, i) => (
                    <div key={priority} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-brand-mint/10 text-brand-mint text-xs font-bold flex items-center justify-center">
                        {i + 1}
                      </span>
                      <span className="text-text-primary">{priority}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-border-light">
              <p className="text-xs text-text-tertiary">
                💡 원하는 조건을 정확히 설정하면 <strong>딱 맞는 오퍼</strong>만 와요.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* 마스킹 요청 모달 */}
      <AnimatePresence>
        {showMaskingModal && selectedReviewForMasking && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
            onClick={() => setShowMaskingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-sm p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-text-primary">리뷰 마스킹 요청</h3>
                <button onClick={() => setShowMaskingModal(false)} className="p-1">
                  <X className="w-5 h-5 text-text-tertiary" />
                </button>
              </div>

              <div className="bg-bg-secondary rounded-xl p-3 mb-4">
                <div className="text-xs text-text-tertiary mb-1">{selectedReviewForMasking.author}님의 리뷰</div>
                <p className="text-sm text-text-secondary line-clamp-3">{selectedReviewForMasking.content}</p>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-text-primary mb-2">마스킹 요청 사유</label>
                <select
                  value={maskingReason}
                  onChange={(e) => setMaskingReason(e.target.value)}
                  className="w-full p-3 border border-border-light rounded-xl text-sm focus:outline-none focus:border-brand-mint"
                >
                  <option value="">사유를 선택해주세요</option>
                  <option value="사실과 다른 내용">사실과 다른 내용이 포함됨</option>
                  <option value="개인정보 노출">개인정보가 노출됨</option>
                  <option value="악의적 비방">악의적 비방 또는 욕설</option>
                  <option value="퇴사 시 갈등">퇴사 시 갈등으로 인한 부당한 평가</option>
                  <option value="기타">기타</option>
                </select>
              </div>

              <div className="text-xs text-text-tertiary mb-4 bg-warning/5 p-3 rounded-xl">
                <AlertCircle className="w-4 h-4 text-warning inline mr-1" />
                마스킹 요청은 검토 후 <strong>3일 내</strong> 처리됩니다. 정당한 사유가 있는 경우에만 승인됩니다.
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowMaskingModal(false)}
                  className="flex-1 py-3 border border-border-light rounded-xl text-text-secondary font-medium"
                >
                  취소
                </button>
                <button
                  onClick={submitMaskingRequest}
                  disabled={!maskingReason}
                  className="flex-1 py-3 bg-warning text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  요청하기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 리뷰 작성 모달 */}
      <AnimatePresence>
        {showWriteReviewModal && selectedHospitalForReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50"
            onClick={() => setShowWriteReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-sm max-h-[85vh] overflow-y-auto"
            >
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-text-primary">재직경험 공유</h3>
                  <button onClick={() => setShowWriteReviewModal(false)} className="p-1">
                    <X className="w-5 h-5 text-text-tertiary" />
                  </button>
                </div>

                {/* 병원 정보 */}
                <div className="bg-bg-secondary rounded-xl p-3 mb-4">
                  <div className="font-medium text-text-primary">{selectedHospitalForReview.name}</div>
                  <div className="text-xs text-text-tertiary">{selectedHospitalForReview.period}</div>
                </div>

                {/* 리뷰 대상 선택 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-primary mb-2">리뷰 대상</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'director' as const, label: '병원장', icon: Crown, color: 'expert-navy' },
                      { id: 'supervisor' as const, label: '실장/팀장', icon: UserCheck, color: 'brand-mint' },
                      { id: 'colleague' as const, label: '동료', icon: Users, color: 'info' },
                    ].map((type) => {
                      const TypeIcon = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setReviewTargetType(type.id)}
                          className={`p-3 rounded-xl border text-center transition-all ${
                            reviewTargetType === type.id
                              ? `border-${type.color} bg-${type.color}/10`
                              : 'border-border-light hover:border-brand-mint/50'
                          }`}
                        >
                          <TypeIcon className={`w-5 h-5 mx-auto mb-1 ${
                            reviewTargetType === type.id ? `text-${type.color}` : 'text-text-tertiary'
                          }`} />
                          <div className={`text-xs font-medium ${
                            reviewTargetType === type.id ? `text-${type.color}` : 'text-text-secondary'
                          }`}>
                            {type.label}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 동료 리뷰 타입 선택 - 동료 선택 시에만 표시 */}
                {reviewTargetType === 'colleague' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-text-primary mb-2">리뷰 유형</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          setColleagueReviewType('overall');
                          setColleagueName('');
                        }}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          colleagueReviewType === 'overall'
                            ? 'border-info bg-info/10'
                            : 'border-border-light hover:border-info/50'
                        }`}
                      >
                        <Users className={`w-5 h-5 mx-auto mb-1 ${
                          colleagueReviewType === 'overall' ? 'text-info' : 'text-text-tertiary'
                        }`} />
                        <div className={`text-xs font-medium ${
                          colleagueReviewType === 'overall' ? 'text-info' : 'text-text-secondary'
                        }`}>
                          전체 동료 평가
                        </div>
                        <div className="text-[10px] text-text-tertiary mt-0.5">공개 노출</div>
                      </button>
                      <button
                        onClick={() => setColleagueReviewType('individual')}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          colleagueReviewType === 'individual'
                            ? 'border-warning bg-warning/10'
                            : 'border-border-light hover:border-warning/50'
                        }`}
                      >
                        <User className={`w-5 h-5 mx-auto mb-1 ${
                          colleagueReviewType === 'individual' ? 'text-warning' : 'text-text-tertiary'
                        }`} />
                        <div className={`text-xs font-medium ${
                          colleagueReviewType === 'individual' ? 'text-warning' : 'text-text-secondary'
                        }`}>
                          개인별 평가
                        </div>
                        <div className="text-[10px] text-text-tertiary mt-0.5">구인처만 열람</div>
                      </button>
                    </div>

                    {/* 개인별 평가 시 이름 입력 */}
                    {colleagueReviewType === 'individual' && (
                      <div className="mt-3">
                        <input
                          type="text"
                          value={colleagueName}
                          onChange={(e) => setColleagueName(e.target.value)}
                          placeholder="동료 이름 (필수)"
                          className="w-full p-3 border border-border-light rounded-xl text-sm focus:outline-none focus:border-warning"
                        />
                        <p className="text-xs text-text-tertiary mt-1">
                          * 개인별 평가는 구인처(병원)에서만 열람 가능합니다
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* 별점 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-primary mb-2">평점</label>
                  <div className="flex items-center gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReviewRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= newReviewRating
                              ? 'text-warning fill-warning'
                              : 'text-border-light hover:text-warning/50'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {newReviewRating > 0 && (
                    <div className="text-center text-sm text-text-secondary mt-1">
                      {newReviewRating === 5 ? '매우 좋음' :
                       newReviewRating === 4 ? '좋음' :
                       newReviewRating === 3 ? '보통' :
                       newReviewRating === 2 ? '별로' : '매우 별로'}
                    </div>
                  )}
                </div>

                {/* 리뷰 내용 */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-primary mb-2">리뷰 내용</label>
                  <textarea
                    value={newReviewContent}
                    onChange={(e) => setNewReviewContent(e.target.value)}
                    placeholder={
                      reviewTargetType === 'director'
                        ? '원장님의 경영 스타일, 직원 케어, 의료 철학 등에 대해 작성해주세요.'
                        : reviewTargetType === 'supervisor'
                        ? '팀 분위기, 업무 분배, 교육 체계, 소통 방식 등에 대해 작성해주세요.'
                        : '팀워크, 협업 분위기, 근무 환경, 워라밸 등에 대해 작성해주세요.'
                    }
                    className="w-full p-3 border border-border-light rounded-xl text-sm resize-none h-32 focus:outline-none focus:border-brand-mint"
                  />
                  <div className="text-xs text-text-tertiary text-right mt-1">
                    {newReviewContent.length}/500
                  </div>
                </div>

                {/* 익명 설정 */}
                <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl mb-4">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-success" />
                    <span className="text-sm text-text-primary">익명으로 작성</span>
                  </div>
                  <button
                    onClick={() => setIsAnonymousReview(!isAnonymousReview)}
                    className={`w-10 h-6 rounded-full transition-colors ${
                      isAnonymousReview ? 'bg-success' : 'bg-bg-tertiary'
                    }`}
                  >
                    <motion.div
                      className="w-4 h-4 bg-white rounded-full shadow-sm"
                      animate={{ x: isAnonymousReview ? 20 : 3 }}
                    />
                  </button>
                </div>

                {/* 안내 */}
                <div className="text-xs text-text-tertiary bg-info/5 p-3 rounded-xl mb-4">
                  <Info className="w-4 h-4 text-info inline mr-1" />
                  작성된 리뷰는 검토 후 공개됩니다. 비방, 욕설, 허위 사실은 삭제될 수 있습니다.
                </div>

                {/* 버튼 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowWriteReviewModal(false)}
                    className="flex-1 py-3 border border-border-light rounded-xl text-text-secondary font-medium"
                  >
                    취소
                  </button>
                  <button
                    onClick={() => {
                      if (newReviewRating === 0) {
                        alert('평점을 선택해주세요.');
                        return;
                      }
                      if (newReviewContent.length < 20) {
                        alert('리뷰 내용을 20자 이상 작성해주세요.');
                        return;
                      }
                      alert(`리뷰가 제출되었습니다!\n\n병원: ${selectedHospitalForReview.name}\n대상: ${
                        reviewTargetType === 'director' ? '병원장' :
                        reviewTargetType === 'supervisor' ? '실장/팀장' : '동료'
                      }\n평점: ${newReviewRating}점\n\n검토 후 24시간 내 공개됩니다.`);
                      setShowWriteReviewModal(false);
                    }}
                    disabled={newReviewRating === 0 || newReviewContent.length < 20}
                    className="flex-1 py-3 bg-brand-mint text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                  >
                    <Send className="w-4 h-4" />
                    제출하기
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin w-8 h-8 border-2 border-brand-mint border-t-transparent rounded-full" /></div>}>
      <ProfileContent />
    </Suspense>
  );
}
