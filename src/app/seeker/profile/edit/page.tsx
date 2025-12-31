'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  User,
  Briefcase,
  GraduationCap,
  Award,
  FileText,
  MapPin,
  DollarSign,
  Clock,
  Building2,
  Plus,
  Edit2,
  Trash2,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  Save,
  Camera,
  X,
  Sparkles,
  Shield,
  EyeOff,
} from 'lucide-react';

// 프로필 섹션 정의
type ProfileSection = 'basic' | 'career' | 'education' | 'skills' | 'preferences' | 'introduction' | 'privacy';

interface CareerItem {
  id: string;
  hospital: string;
  department: string;
  position: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

interface EducationItem {
  id: string;
  school: string;
  major: string;
  degree: string;
  graduationYear: string;
}

interface SkillItem {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

// 초기 데이터
const initialProfile = {
  basic: {
    name: '김메디',
    email: 'medi.kim@email.com',
    phone: '010-1234-5678',
    birthYear: '1995',
    gender: '여성',
    profileImage: null as string | null,
  },
  career: [
    {
      id: 'c1',
      hospital: '강남 OO피부과',
      department: '피부과',
      position: '간호사',
      startDate: '2021-03',
      endDate: '',
      isCurrent: true,
      description: '레이저 시술 보조, 환자 상담 및 케어',
    },
    {
      id: 'c2',
      hospital: '서초 XX의원',
      department: '피부과',
      position: '간호사',
      startDate: '2019-03',
      endDate: '2021-02',
      isCurrent: false,
      description: '일반 진료 보조, 환자 관리',
    },
  ] as CareerItem[],
  education: [
    {
      id: 'e1',
      school: '서울간호대학교',
      major: '간호학과',
      degree: '학사',
      graduationYear: '2019',
    },
  ] as EducationItem[],
  skills: [
    { id: 's1', name: '레이저 시술 보조', level: 'advanced' },
    { id: 's2', name: '피부 관리', level: 'expert' },
    { id: 's3', name: '환자 상담', level: 'advanced' },
    { id: 's4', name: '필러/보톡스 보조', level: 'intermediate' },
  ] as SkillItem[],
  preferences: {
    regions: ['강남/서초', '송파/강동'],
    departments: ['피부과', '성형외과'],
    salaryMin: 400,
    salaryMax: 500,
    workType: '정규직',
    workHours: '주 5일 (9-6시)',
  },
  introduction: '',
  privacy: {
    excludedHospitals: ['강남 OO피부과'],
    isPublic: true,
  },
};

// 기술 레벨 라벨
const skillLevels = {
  beginner: { label: '초급', color: 'bg-bg-secondary text-text-secondary' },
  intermediate: { label: '중급', color: 'bg-info/10 text-info' },
  advanced: { label: '고급', color: 'bg-brand-mint/10 text-brand-mint' },
  expert: { label: '전문가', color: 'bg-expert-navy/10 text-expert-navy' },
};

export default function ProfileEditPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<ProfileSection>('basic');
  const [profile, setProfile] = useState(initialProfile);
  const [expandedSection, setExpandedSection] = useState<ProfileSection | null>('basic');
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // 섹션 정의
  const sections: { id: ProfileSection; label: string; icon: typeof User; completed: boolean }[] = [
    { id: 'basic', label: '기본 정보', icon: User, completed: true },
    { id: 'career', label: '경력 사항', icon: Briefcase, completed: true },
    { id: 'education', label: '학력', icon: GraduationCap, completed: true },
    { id: 'skills', label: '보유 술기', icon: Award, completed: true },
    { id: 'preferences', label: '희망 근무조건', icon: MapPin, completed: false },
    { id: 'introduction', label: '자기소개서', icon: FileText, completed: false },
    { id: 'privacy', label: '공개 설정', icon: Shield, completed: true },
  ];

  const completedCount = sections.filter(s => s.completed).length;
  const completionPercent = Math.round((completedCount / sections.length) * 100);

  const handleSave = async () => {
    setIsSaving(true);
    // 저장 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const toggleSection = (section: ProfileSection) => {
    setExpandedSection(expandedSection === section ? null : section);
    setActiveSection(section);
  };

  // 경력 추가
  const addCareer = () => {
    const newCareer: CareerItem = {
      id: `c${Date.now()}`,
      hospital: '',
      department: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
    };
    setProfile(prev => ({
      ...prev,
      career: [...prev.career, newCareer],
    }));
  };

  // 경력 삭제
  const deleteCareer = (id: string) => {
    setProfile(prev => ({
      ...prev,
      career: prev.career.filter(c => c.id !== id),
    }));
  };

  // 스킬 추가
  const addSkill = () => {
    const newSkill: SkillItem = {
      id: `s${Date.now()}`,
      name: '',
      level: 'beginner',
    };
    setProfile(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill],
    }));
  };

  // 스킬 삭제
  const deleteSkill = (id: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id),
    }));
  };

  // 노출 제외 병원 추가
  const addExcludedHospital = () => {
    const hospitalName = prompt('제외할 병원 이름을 입력하세요');
    if (hospitalName) {
      setProfile(prev => ({
        ...prev,
        privacy: {
          ...prev.privacy,
          excludedHospitals: [...prev.privacy.excludedHospitals, hospitalName],
        },
      }));
    }
  };

  // 노출 제외 병원 삭제
  const removeExcludedHospital = (hospital: string) => {
    setProfile(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        excludedHospitals: prev.privacy.excludedHospitals.filter(h => h !== hospital),
      },
    }));
  };

  return (
    <div className="min-h-screen bg-bg-secondary pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-border-light px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
            >
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-expert-navy">프로필 수정</h1>
              <p className="text-xs text-text-secondary">완성도 {completionPercent}%</p>
            </div>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-brand-mint text-white rounded-xl text-sm font-medium flex items-center gap-1 disabled:opacity-50"
          >
            {isSaving ? (
              <span className="animate-spin">⏳</span>
            ) : (
              <Save className="w-4 h-4" />
            )}
            저장
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              className="h-full bg-brand-mint rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-4 right-4 z-30 bg-success text-white py-3 px-4 rounded-xl flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            <span>저장되었습니다!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-4 py-4 space-y-3">
        {/* 기본 정보 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border-light overflow-hidden"
        >
          <button
            onClick={() => toggleSection('basic')}
            className="w-full px-4 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-mint/10 rounded-xl flex items-center justify-center">
                <User className="w-5 h-5 text-brand-mint" />
              </div>
              <div className="text-left">
                <div className="font-medium text-text-primary">기본 정보</div>
                <div className="text-xs text-text-secondary">이름, 연락처, 프로필 사진</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform ${expandedSection === 'basic' ? 'rotate-180' : ''}`} />
            </div>
          </button>
          <AnimatePresence>
            {expandedSection === 'basic' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4 border-t border-border-light pt-4">
                  {/* 프로필 이미지 */}
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center relative">
                      <User className="w-8 h-8 text-text-tertiary" />
                      <button className="absolute bottom-0 right-0 w-8 h-8 bg-brand-mint rounded-full flex items-center justify-center">
                        <Camera className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-text-primary">프로필 사진</div>
                      <div className="text-xs text-text-secondary">JPG, PNG (최대 5MB)</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-text-secondary block mb-1">이름</label>
                      <input
                        type="text"
                        value={profile.basic.name}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          basic: { ...prev.basic, name: e.target.value },
                        }))}
                        className="w-full px-3 py-2 bg-bg-secondary rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-text-secondary block mb-1">성별</label>
                      <select
                        value={profile.basic.gender}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          basic: { ...prev.basic, gender: e.target.value },
                        }))}
                        className="w-full px-3 py-2 bg-bg-secondary rounded-lg text-sm"
                      >
                        <option>여성</option>
                        <option>남성</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-text-secondary block mb-1">이메일</label>
                    <input
                      type="email"
                      value={profile.basic.email}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        basic: { ...prev.basic, email: e.target.value },
                      }))}
                      className="w-full px-3 py-2 bg-bg-secondary rounded-lg text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-text-secondary block mb-1">연락처</label>
                    <input
                      type="tel"
                      value={profile.basic.phone}
                      onChange={(e) => setProfile(prev => ({
                        ...prev,
                        basic: { ...prev.basic, phone: e.target.value },
                      }))}
                      className="w-full px-3 py-2 bg-bg-secondary rounded-lg text-sm"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 경력 사항 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border-light overflow-hidden"
        >
          <button
            onClick={() => toggleSection('career')}
            className="w-full px-4 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-expert-navy/10 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-expert-navy" />
              </div>
              <div className="text-left">
                <div className="font-medium text-text-primary">경력 사항</div>
                <div className="text-xs text-text-secondary">{profile.career.length}개 등록됨</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform ${expandedSection === 'career' ? 'rotate-180' : ''}`} />
            </div>
          </button>
          <AnimatePresence>
            {expandedSection === 'career' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3 border-t border-border-light pt-4">
                  {profile.career.map((career, index) => (
                    <div key={career.id} className="p-3 bg-bg-secondary rounded-xl">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {career.isCurrent && (
                            <span className="text-xs bg-brand-mint text-white px-2 py-0.5 rounded">재직중</span>
                          )}
                        </div>
                        <button
                          onClick={() => deleteCareer(career.id)}
                          className="p-1 hover:bg-bg-tertiary rounded"
                        >
                          <Trash2 className="w-4 h-4 text-text-tertiary" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={career.hospital}
                        onChange={(e) => {
                          const updated = [...profile.career];
                          updated[index].hospital = e.target.value;
                          setProfile(prev => ({ ...prev, career: updated }));
                        }}
                        placeholder="병원명"
                        className="w-full px-3 py-2 bg-white rounded-lg text-sm mb-2"
                      />
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="text"
                          value={career.department}
                          onChange={(e) => {
                            const updated = [...profile.career];
                            updated[index].department = e.target.value;
                            setProfile(prev => ({ ...prev, career: updated }));
                          }}
                          placeholder="부서/진료과"
                          className="w-full px-3 py-2 bg-white rounded-lg text-sm"
                        />
                        <input
                          type="text"
                          value={career.position}
                          onChange={(e) => {
                            const updated = [...profile.career];
                            updated[index].position = e.target.value;
                            setProfile(prev => ({ ...prev, career: updated }));
                          }}
                          placeholder="직위"
                          className="w-full px-3 py-2 bg-white rounded-lg text-sm"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <input
                          type="month"
                          value={career.startDate}
                          onChange={(e) => {
                            const updated = [...profile.career];
                            updated[index].startDate = e.target.value;
                            setProfile(prev => ({ ...prev, career: updated }));
                          }}
                          className="w-full px-3 py-2 bg-white rounded-lg text-sm"
                        />
                        <input
                          type="month"
                          value={career.endDate}
                          onChange={(e) => {
                            const updated = [...profile.career];
                            updated[index].endDate = e.target.value;
                            setProfile(prev => ({ ...prev, career: updated }));
                          }}
                          disabled={career.isCurrent}
                          placeholder="퇴사일"
                          className="w-full px-3 py-2 bg-white rounded-lg text-sm disabled:opacity-50"
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                        <input
                          type="checkbox"
                          checked={career.isCurrent}
                          onChange={(e) => {
                            const updated = [...profile.career];
                            updated[index].isCurrent = e.target.checked;
                            if (e.target.checked) updated[index].endDate = '';
                            setProfile(prev => ({ ...prev, career: updated }));
                          }}
                          className="rounded"
                        />
                        현재 재직중
                      </label>
                      <textarea
                        value={career.description}
                        onChange={(e) => {
                          const updated = [...profile.career];
                          updated[index].description = e.target.value;
                          setProfile(prev => ({ ...prev, career: updated }));
                        }}
                        placeholder="담당 업무 설명"
                        rows={2}
                        className="w-full px-3 py-2 bg-white rounded-lg text-sm resize-none"
                      />
                    </div>
                  ))}
                  <button
                    onClick={addCareer}
                    className="w-full py-3 border-2 border-dashed border-border-light rounded-xl text-text-tertiary text-sm flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    경력 추가
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 보유 술기 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-border-light overflow-hidden"
        >
          <button
            onClick={() => toggleSection('skills')}
            className="w-full px-4 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-match-gold/10 rounded-xl flex items-center justify-center">
                <Award className="w-5 h-5 text-match-gold" />
              </div>
              <div className="text-left">
                <div className="font-medium text-text-primary">보유 술기</div>
                <div className="text-xs text-text-secondary">{profile.skills.length}개 등록됨</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform ${expandedSection === 'skills' ? 'rotate-180' : ''}`} />
            </div>
          </button>
          <AnimatePresence>
            {expandedSection === 'skills' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3 border-t border-border-light pt-4">
                  {profile.skills.map((skill, index) => (
                    <div key={skill.id} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={skill.name}
                        onChange={(e) => {
                          const updated = [...profile.skills];
                          updated[index].name = e.target.value;
                          setProfile(prev => ({ ...prev, skills: updated }));
                        }}
                        placeholder="술기명"
                        className="flex-1 px-3 py-2 bg-bg-secondary rounded-lg text-sm"
                      />
                      <select
                        value={skill.level}
                        onChange={(e) => {
                          const updated = [...profile.skills];
                          updated[index].level = e.target.value as SkillItem['level'];
                          setProfile(prev => ({ ...prev, skills: updated }));
                        }}
                        className={`px-3 py-2 rounded-lg text-sm ${skillLevels[skill.level].color}`}
                      >
                        <option value="beginner">초급</option>
                        <option value="intermediate">중급</option>
                        <option value="advanced">고급</option>
                        <option value="expert">전문가</option>
                      </select>
                      <button
                        onClick={() => deleteSkill(skill.id)}
                        className="p-2 hover:bg-bg-secondary rounded"
                      >
                        <X className="w-4 h-4 text-text-tertiary" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addSkill}
                    className="w-full py-3 border-2 border-dashed border-border-light rounded-xl text-text-tertiary text-sm flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    술기 추가
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 희망 근무조건 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-border-light overflow-hidden"
        >
          <button
            onClick={() => toggleSection('preferences')}
            className="w-full px-4 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-info/10 rounded-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-info" />
              </div>
              <div className="text-left">
                <div className="font-medium text-text-primary">희망 근무조건</div>
                <div className="text-xs text-text-secondary">지역, 급여, 근무 형태</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform ${expandedSection === 'preferences' ? 'rotate-180' : ''}`} />
            </div>
          </button>
          <AnimatePresence>
            {expandedSection === 'preferences' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4 border-t border-border-light pt-4">
                  <div>
                    <label className="text-xs text-text-secondary block mb-2">희망 지역 (복수 선택 가능)</label>
                    <div className="flex flex-wrap gap-2">
                      {['강남/서초', '송파/강동', '강서/영등포', '성북/동대문', '마포/용산'].map(region => (
                        <button
                          key={region}
                          onClick={() => {
                            const current = profile.preferences.regions;
                            const updated = current.includes(region)
                              ? current.filter(r => r !== region)
                              : [...current, region];
                            setProfile(prev => ({
                              ...prev,
                              preferences: { ...prev.preferences, regions: updated },
                            }));
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            profile.preferences.regions.includes(region)
                              ? 'bg-brand-mint text-white'
                              : 'bg-bg-secondary text-text-secondary'
                          }`}
                        >
                          {region}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-text-secondary block mb-2">희망 진료과</label>
                    <div className="flex flex-wrap gap-2">
                      {['피부과', '성형외과', '안과', '치과', '산부인과', '내과'].map(dept => (
                        <button
                          key={dept}
                          onClick={() => {
                            const current = profile.preferences.departments;
                            const updated = current.includes(dept)
                              ? current.filter(d => d !== dept)
                              : [...current, dept];
                            setProfile(prev => ({
                              ...prev,
                              preferences: { ...prev.preferences, departments: updated },
                            }));
                          }}
                          className={`px-3 py-1.5 rounded-lg text-sm ${
                            profile.preferences.departments.includes(dept)
                              ? 'bg-expert-navy text-white'
                              : 'bg-bg-secondary text-text-secondary'
                          }`}
                        >
                          {dept}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-text-secondary block mb-2">희망 연봉</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={profile.preferences.salaryMin}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, salaryMin: Number(e.target.value) },
                        }))}
                        className="flex-1 px-3 py-2 bg-bg-secondary rounded-lg text-sm"
                        placeholder="최소"
                      />
                      <span className="text-text-tertiary">~</span>
                      <input
                        type="number"
                        value={profile.preferences.salaryMax}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, salaryMax: Number(e.target.value) },
                        }))}
                        className="flex-1 px-3 py-2 bg-bg-secondary rounded-lg text-sm"
                        placeholder="최대"
                      />
                      <span className="text-sm text-text-secondary">만원</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-text-secondary block mb-1">근무 형태</label>
                      <select
                        value={profile.preferences.workType}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, workType: e.target.value },
                        }))}
                        className="w-full px-3 py-2 bg-bg-secondary rounded-lg text-sm"
                      >
                        <option>정규직</option>
                        <option>계약직</option>
                        <option>파트타임</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-text-secondary block mb-1">근무 시간</label>
                      <select
                        value={profile.preferences.workHours}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          preferences: { ...prev.preferences, workHours: e.target.value },
                        }))}
                        className="w-full px-3 py-2 bg-bg-secondary rounded-lg text-sm"
                      >
                        <option>주 5일 (9-6시)</option>
                        <option>주 5일 (10-7시)</option>
                        <option>주 4.5일</option>
                        <option>협의</option>
                      </select>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 자기소개서 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-border-light overflow-hidden"
        >
          <button
            onClick={() => toggleSection('introduction')}
            className="w-full px-4 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-success" />
              </div>
              <div className="text-left">
                <div className="font-medium text-text-primary">자기소개서</div>
                <div className="text-xs text-text-secondary">자유롭게 작성</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform ${expandedSection === 'introduction' ? 'rotate-180' : ''}`} />
            </div>
          </button>
          <AnimatePresence>
            {expandedSection === 'introduction' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3 border-t border-border-light pt-4">
                  <textarea
                    value={profile.introduction}
                    onChange={(e) => setProfile(prev => ({ ...prev, introduction: e.target.value }))}
                    placeholder="자신을 자유롭게 소개해주세요. 경력, 강점, 가치관 등을 포함하면 좋아요."
                    rows={6}
                    className="w-full px-3 py-3 bg-bg-secondary rounded-xl text-sm resize-none"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-text-tertiary">{profile.introduction.length}/500자</span>
                    <button className="text-brand-mint flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI로 작성하기
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* 공개 설정 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl border border-border-light overflow-hidden"
        >
          <button
            onClick={() => toggleSection('privacy')}
            className="w-full px-4 py-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-error/10 rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-error" />
              </div>
              <div className="text-left">
                <div className="font-medium text-text-primary">공개 설정</div>
                <div className="text-xs text-text-secondary">프로필 노출 제외 병원 설정</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-success" />
              <ChevronDown className={`w-5 h-5 text-text-tertiary transition-transform ${expandedSection === 'privacy' ? 'rotate-180' : ''}`} />
            </div>
          </button>
          <AnimatePresence>
            {expandedSection === 'privacy' && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-4 border-t border-border-light pt-4">
                  <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                    <div>
                      <div className="text-sm font-medium text-text-primary">프로필 공개</div>
                      <div className="text-xs text-text-secondary">채용 담당자에게 프로필 노출</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={profile.privacy.isPublic}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, isPublic: e.target.checked },
                        }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-mint"></div>
                    </label>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <EyeOff className="w-4 h-4 text-text-secondary" />
                        <span className="text-sm font-medium text-text-primary">노출 제외 병원</span>
                      </div>
                      <span className="text-xs text-text-tertiary">{profile.privacy.excludedHospitals.length}곳</span>
                    </div>
                    <p className="text-xs text-text-secondary mb-3">
                      재직중인 병원이나 노출을 원하지 않는 병원을 추가하세요.
                      해당 병원에는 프로필이 노출되지 않습니다.
                    </p>
                    <div className="space-y-2 mb-3">
                      {profile.privacy.excludedHospitals.map(hospital => (
                        <div key={hospital} className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4 text-text-tertiary" />
                            <span className="text-sm text-text-primary">{hospital}</span>
                          </div>
                          <button
                            onClick={() => removeExcludedHospital(hospital)}
                            className="p-1 hover:bg-bg-tertiary rounded"
                          >
                            <X className="w-4 h-4 text-text-tertiary" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addExcludedHospital}
                      className="w-full py-3 border-2 border-dashed border-border-light rounded-xl text-text-tertiary text-sm flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      병원 추가
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
