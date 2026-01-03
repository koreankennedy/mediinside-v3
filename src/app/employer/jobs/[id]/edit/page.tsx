'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Sparkles,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Building2,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Target,
  Lightbulb,
  RefreshCw,
  Eye,
  BarChart3,
  Zap,
  ArrowRight,
  X,
  Plus,
  Minus,
  Calendar,
  Award,
  Heart,
} from 'lucide-react';

// 채용 공고 데이터
const jobData = {
  id: 1,
  title: '피부과 간호사',
  department: '피부과',
  position: '일반 간호사',
  status: 'active',
  createdAt: '2024-12-01',
  views: 234,
  applications: 12,
  matchedCandidates: 8,
  conditions: {
    salary: { min: 380, max: 450, negotiable: true },
    experience: { min: 3, preferred: 5 },
    workType: '정규직',
    workHours: '주 5일 (09:00-18:00)',
    location: '강남구 청담동',
    benefits: ['4대보험', '인센티브', '식비지원', '교육지원'],
  },
  description: `청담리더스피부과에서 피부과 전문 간호사를 모십니다.

저희 병원은 피부과 시술 전문 병원으로, 레이저 시술 및 피부 관리에 특화되어 있습니다.

[담당 업무]
- 레이저 시술 보조 및 환자 케어
- 피부 상담 및 시술 전후 관리
- 진료 예약 및 고객 응대

[우대사항]
- 피부과 경력 3년 이상
- 레이저 시술 보조 경험자
- 친절하고 서비스 마인드가 있는 분`,
  requirements: ['간호사 면허 소지자', '피부과 경력 3년 이상', '레이저 시술 경험'],
};

// AI 분석 결과
const aiAnalysis = {
  overallScore: 72,
  marketComparison: {
    salary: { status: 'below', message: '시장 평균보다 10% 낮음', suggestion: '+10% 인상 시 지원율 35% 상승 예상' },
    benefits: { status: 'average', message: '경쟁력 있는 복리후생', suggestion: '야간수당 추가 시 차별화 가능' },
    requirements: { status: 'high', message: '요구 경력이 다소 높음', suggestion: '2년 이상으로 낮추면 후보 풀 2배 확대' },
  },
  suggestions: [
    {
      id: 1,
      type: 'salary',
      title: '급여 범위 조정',
      description: '현재 380-450만원 → 420-500만원으로 조정 권장',
      impact: '+35%',
      impactLabel: '지원율 상승',
      priority: 'high',
      applied: false,
    },
    {
      id: 2,
      type: 'experience',
      title: '경력 요건 완화',
      description: '3년 이상 → 2년 이상으로 완화 권장',
      impact: '+120%',
      impactLabel: '후보 풀 확대',
      priority: 'high',
      applied: false,
    },
    {
      id: 3,
      type: 'benefits',
      title: '복리후생 추가',
      description: '야간수당, 휴일수당 명시 추가 권장',
      impact: '+15%',
      impactLabel: '관심도 상승',
      priority: 'medium',
      applied: false,
    },
    {
      id: 4,
      type: 'description',
      title: 'JD 상세화',
      description: '성장 기회, 팀 문화 등 추가 설명 권장',
      impact: '+20%',
      impactLabel: '완독률 상승',
      priority: 'medium',
      applied: false,
    },
  ],
  competitorAnalysis: [
    { hospital: 'A피부과', salary: '420-480만', benefits: 5, applications: 28 },
    { hospital: 'B피부과', salary: '400-460만', benefits: 4, applications: 22 },
    { hospital: 'C성형외과', salary: '450-520만', benefits: 6, applications: 35 },
  ],
};

// 수정 가능한 필드 섹션
const editSections = [
  { id: 'basic', label: '기본 정보', icon: Briefcase },
  { id: 'conditions', label: '근무 조건', icon: Clock },
  { id: 'salary', label: '급여 정보', icon: DollarSign },
  { id: 'requirements', label: '자격 요건', icon: Award },
  { id: 'description', label: '상세 내용', icon: Building2 },
  { id: 'benefits', label: '복리후생', icon: Heart },
];

// 지원자/조회자/매칭후보 상세 데이터
const viewersData = [
  { id: 1, name: '김미진', type: '간호사', time: '3분 13초', matchScore: 95 },
  { id: 2, name: '이은정', type: '간호사', time: '2분 1초', matchScore: 92 },
  { id: 3, name: '박수진', type: '간호사', time: '2분 54초', matchScore: 89 },
  { id: 4, name: '정혜원', type: '간호사', time: '3분 24초', matchScore: 90 },
  { id: 5, name: '최지영', type: '간호사', time: '1분 20초', matchScore: 88 },
];

const applicantsData = [
  { id: 1, name: '김민지', type: '간호사', experience: '3년', matchScore: 94, status: '서류심사' },
  { id: 2, name: '이서연', type: '간호사', experience: '5년', matchScore: 91, status: '면접예정' },
  { id: 3, name: '박지현', type: '간호사', experience: '4년', matchScore: 88, status: '서류심사' },
];

const matchedData = [
  { id: 1, name: '김민지', type: '간호사', experience: '3년', matchScore: 94, insight: 'AI 매칭 최적화 후보' },
  { id: 2, name: '이서연', type: '간호사', experience: '5년', matchScore: 91, insight: '경력 우수' },
  { id: 3, name: '박지현', type: '간호사', experience: '4년', matchScore: 88, insight: '즉시 출근 가능' },
  { id: 4, name: '정민지', type: '간호사', experience: '2년', matchScore: 86, insight: '성장 잠재력' },
];

export default function JobEditPage() {
  const router = useRouter();
  const params = useParams();
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');
  const [showAIPanel, setShowAIPanel] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [appliedSuggestions, setAppliedSuggestions] = useState<number[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 상세 모달 상태
  const [activeStatModal, setActiveStatModal] = useState<'views' | 'applicants' | 'matched' | null>(null);

  // 수정 가능한 데이터
  const [formData, setFormData] = useState({
    title: jobData.title,
    department: jobData.department,
    position: jobData.position,
    salaryMin: jobData.conditions.salary.min,
    salaryMax: jobData.conditions.salary.max,
    salaryNegotiable: jobData.conditions.salary.negotiable,
    experienceMin: jobData.conditions.experience.min,
    experiencePreferred: jobData.conditions.experience.preferred,
    workType: jobData.conditions.workType,
    workHours: jobData.conditions.workHours,
    location: jobData.conditions.location,
    benefits: [...jobData.conditions.benefits],
    description: jobData.description,
    requirements: [...jobData.requirements],
  });

  const [newBenefit, setNewBenefit] = useState('');
  const [newRequirement, setNewRequirement] = useState('');

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const applySuggestion = (suggestionId: number) => {
    const suggestion = aiAnalysis.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    if (suggestion.type === 'salary') {
      setFormData(prev => ({ ...prev, salaryMin: 420, salaryMax: 500 }));
    } else if (suggestion.type === 'experience') {
      setFormData(prev => ({ ...prev, experienceMin: 2 }));
    } else if (suggestion.type === 'benefits') {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, '야간수당', '휴일수당'],
      }));
    }

    setAppliedSuggestions(prev => [...prev, suggestionId]);
  };

  const revertSuggestion = (suggestionId: number) => {
    const suggestion = aiAnalysis.suggestions.find(s => s.id === suggestionId);
    if (!suggestion) return;

    if (suggestion.type === 'salary') {
      setFormData(prev => ({
        ...prev,
        salaryMin: jobData.conditions.salary.min,
        salaryMax: jobData.conditions.salary.max,
      }));
    } else if (suggestion.type === 'experience') {
      setFormData(prev => ({
        ...prev,
        experienceMin: jobData.conditions.experience.min,
      }));
    } else if (suggestion.type === 'benefits') {
      setFormData(prev => ({
        ...prev,
        benefits: jobData.conditions.benefits,
      }));
    }

    setAppliedSuggestions(prev => prev.filter(id => id !== suggestionId));
  };

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()],
      }));
      setNewBenefit('');
    }
  };

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const addRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        requirements: [...prev.requirements, newRequirement.trim()],
      }));
      setNewRequirement('');
    }
  };

  const removeRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // 저장 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    router.push('/employer/jobs');
  };

  const reanalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  const calculateNewScore = () => {
    let score = aiAnalysis.overallScore;
    if (appliedSuggestions.includes(1)) score += 12;
    if (appliedSuggestions.includes(2)) score += 8;
    if (appliedSuggestions.includes(3)) score += 5;
    if (appliedSuggestions.includes(4)) score += 3;
    return Math.min(score, 100);
  };

  return (
    <div className="min-h-screen bg-bg-secondary pb-32">
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
              <h1 className="text-lg font-bold text-expert-navy">공고 수정</h1>
              <p className="text-xs text-text-secondary">마지막 수정: 2024.12.15</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPreview(true)}
              className="px-3 py-2 rounded-lg bg-bg-secondary text-sm font-medium text-text-primary flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              미리보기
            </button>
            <button
              onClick={() => setShowAIPanel(!showAIPanel)}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 ${
                showAIPanel ? 'bg-brand-mint text-white' : 'bg-bg-secondary text-text-primary'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              AI 제안
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content - AI패널 표시시 축소 */}
        <div className={`px-4 py-4 space-y-4 ${showAIPanel ? 'w-[45%] pr-2' : 'flex-1'}`}>
          {/* 공고 현황 카드 - 클릭 가능한 통계 */}
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                  진행중
                </span>
                <span className="text-sm text-text-secondary">
                  등록일: {jobData.createdAt}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <button
                onClick={() => setActiveStatModal('views')}
                className="text-center p-3 rounded-xl hover:bg-expert-navy/5 transition-colors cursor-pointer"
              >
                <div className="text-2xl font-bold text-expert-navy">{jobData.views}</div>
                <div className="text-xs text-text-secondary">조회수</div>
              </button>
              <button
                onClick={() => setActiveStatModal('applicants')}
                className="text-center p-3 rounded-xl hover:bg-brand-mint/10 transition-colors cursor-pointer"
              >
                <div className="text-2xl font-bold text-brand-mint">{jobData.applications}</div>
                <div className="text-xs text-text-secondary">지원자</div>
              </button>
              <button
                onClick={() => setActiveStatModal('matched')}
                className="text-center p-3 rounded-xl hover:bg-match-gold/10 transition-colors cursor-pointer"
              >
                <div className="text-2xl font-bold text-match-gold">{jobData.matchedCandidates}</div>
                <div className="text-xs text-text-secondary">매칭 후보</div>
              </button>
            </div>
          </div>

          {/* 편집 섹션들 */}
          {editSections.map((section) => (
            <motion.div
              key={section.id}
              className="bg-white rounded-2xl border border-border-light overflow-hidden"
            >
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full px-4 py-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-brand-mint/10 rounded-xl flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-brand-mint" />
                  </div>
                  <span className="font-medium text-text-primary">{section.label}</span>
                </div>
                {expandedSection === section.id ? (
                  <ChevronUp className="w-5 h-5 text-text-tertiary" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-text-tertiary" />
                )}
              </button>

              <AnimatePresence>
                {expandedSection === section.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-border-light"
                  >
                    <div className="p-4 space-y-4">
                      {section.id === 'basic' && (
                        <>
                          <div>
                            <label className="text-sm text-text-secondary mb-1 block">공고 제목</label>
                            <input
                              type="text"
                              value={formData.title}
                              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-sm text-text-secondary mb-1 block">분과</label>
                              <select
                                value={formData.department}
                                onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                              >
                                <option value="피부과">피부과</option>
                                <option value="성형외과">성형외과</option>
                                <option value="안과">안과</option>
                                <option value="치과">치과</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm text-text-secondary mb-1 block">포지션</label>
                              <select
                                value={formData.position}
                                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                              >
                                <option value="일반 간호사">일반 간호사</option>
                                <option value="수간호사">수간호사</option>
                                <option value="전문 간호사">전문 간호사</option>
                              </select>
                            </div>
                          </div>
                        </>
                      )}

                      {section.id === 'conditions' && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-sm text-text-secondary mb-1 block">근무 형태</label>
                              <select
                                value={formData.workType}
                                onChange={(e) => setFormData(prev => ({ ...prev, workType: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                              >
                                <option value="정규직">정규직</option>
                                <option value="계약직">계약직</option>
                                <option value="파트타임">파트타임</option>
                              </select>
                            </div>
                            <div>
                              <label className="text-sm text-text-secondary mb-1 block">근무 시간</label>
                              <input
                                type="text"
                                value={formData.workHours}
                                onChange={(e) => setFormData(prev => ({ ...prev, workHours: e.target.value }))}
                                className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="text-sm text-text-secondary mb-1 block">근무 위치</label>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-5 h-5 text-text-tertiary" />
                              <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                className="flex-1 px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                              />
                            </div>
                          </div>
                        </>
                      )}

                      {section.id === 'salary' && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-sm text-text-secondary mb-1 block">최소 연봉 (만원)</label>
                              <input
                                type="number"
                                value={formData.salaryMin}
                                onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: parseInt(e.target.value) }))}
                                className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-text-secondary mb-1 block">최대 연봉 (만원)</label>
                              <input
                                type="number"
                                value={formData.salaryMax}
                                onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: parseInt(e.target.value) }))}
                                className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                              />
                            </div>
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.salaryNegotiable}
                              onChange={(e) => setFormData(prev => ({ ...prev, salaryNegotiable: e.target.checked }))}
                              className="w-5 h-5 rounded border-border-light text-brand-mint focus:ring-brand-mint"
                            />
                            <span className="text-sm text-text-primary">연봉 협의 가능</span>
                          </label>
                          {appliedSuggestions.includes(1) && (
                            <div className="p-3 bg-success/10 rounded-xl border border-success/20">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-success">
                                  <CheckCircle2 className="w-4 h-4" />
                                  AI 제안이 적용되었습니다
                                </div>
                                <button
                                  onClick={() => revertSuggestion(1)}
                                  className="text-xs text-text-secondary hover:text-error"
                                >
                                  되돌리기
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {section.id === 'requirements' && (
                        <>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-sm text-text-secondary mb-1 block">최소 경력 (년)</label>
                              <input
                                type="number"
                                value={formData.experienceMin}
                                onChange={(e) => setFormData(prev => ({ ...prev, experienceMin: parseInt(e.target.value) }))}
                                className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="text-sm text-text-secondary mb-1 block">우대 경력 (년)</label>
                              <input
                                type="number"
                                value={formData.experiencePreferred}
                                onChange={(e) => setFormData(prev => ({ ...prev, experiencePreferred: parseInt(e.target.value) }))}
                                className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-sm text-text-secondary mb-2 block">자격 요건</label>
                            <div className="space-y-2">
                              {formData.requirements.map((req, index) => (
                                <div key={index} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={req}
                                    onChange={(e) => {
                                      const newReqs = [...formData.requirements];
                                      newReqs[index] = e.target.value;
                                      setFormData(prev => ({ ...prev, requirements: newReqs }));
                                    }}
                                    className="flex-1 px-4 py-2 rounded-lg border border-border-light focus:border-brand-mint focus:outline-none text-sm"
                                  />
                                  <button
                                    onClick={() => removeRequirement(index)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-error/10 text-error"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={newRequirement}
                                  onChange={(e) => setNewRequirement(e.target.value)}
                                  placeholder="새 요건 추가"
                                  className="flex-1 px-4 py-2 rounded-lg border border-border-light focus:border-brand-mint focus:outline-none text-sm"
                                  onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                                />
                                <button
                                  onClick={addRequirement}
                                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-mint/10 text-brand-mint"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>

                          {appliedSuggestions.includes(2) && (
                            <div className="p-3 bg-success/10 rounded-xl border border-success/20">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-success">
                                  <CheckCircle2 className="w-4 h-4" />
                                  경력 요건이 완화되었습니다
                                </div>
                                <button
                                  onClick={() => revertSuggestion(2)}
                                  className="text-xs text-text-secondary hover:text-error"
                                >
                                  되돌리기
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      {section.id === 'description' && (
                        <div>
                          <label className="text-sm text-text-secondary mb-1 block">상세 내용</label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            rows={10}
                            className="w-full px-4 py-3 rounded-xl border border-border-light focus:border-brand-mint focus:outline-none resize-none"
                          />
                          <div className="flex justify-end mt-2">
                            <button className="px-4 py-2 bg-brand-mint/10 rounded-lg text-sm font-medium text-brand-mint flex items-center gap-2">
                              <Sparkles className="w-4 h-4" />
                              AI로 개선하기
                            </button>
                          </div>
                        </div>
                      )}

                      {section.id === 'benefits' && (
                        <div>
                          <label className="text-sm text-text-secondary mb-2 block">복리후생</label>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {formData.benefits.map((benefit, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-1 px-3 py-1.5 bg-brand-mint/10 rounded-full"
                              >
                                <span className="text-sm text-brand-mint">{benefit}</span>
                                <button
                                  onClick={() => removeBenefit(index)}
                                  className="w-4 h-4 flex items-center justify-center text-brand-mint hover:text-error"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newBenefit}
                              onChange={(e) => setNewBenefit(e.target.value)}
                              placeholder="새 복리후생 추가"
                              className="flex-1 px-4 py-2 rounded-lg border border-border-light focus:border-brand-mint focus:outline-none text-sm"
                              onKeyPress={(e) => e.key === 'Enter' && addBenefit()}
                            />
                            <button
                              onClick={addBenefit}
                              className="px-4 py-2 bg-brand-mint text-white rounded-lg text-sm font-medium"
                            >
                              추가
                            </button>
                          </div>

                          {appliedSuggestions.includes(3) && (
                            <div className="mt-3 p-3 bg-success/10 rounded-xl border border-success/20">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-success">
                                  <CheckCircle2 className="w-4 h-4" />
                                  야간수당, 휴일수당이 추가되었습니다
                                </div>
                                <button
                                  onClick={() => revertSuggestion(3)}
                                  className="text-xs text-text-secondary hover:text-error"
                                >
                                  되돌리기
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* AI Panel - 확대된 영역 (55%) */}
        <AnimatePresence>
          {showAIPanel && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: '55%', opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="bg-white border-l border-border-light overflow-hidden"
            >
              <div className="p-4 space-y-4 h-full overflow-y-auto">
                {/* AI 점수 */}
                <div className="bg-gradient-to-br from-expert-navy to-expert-navy/80 rounded-2xl p-4 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      <span className="font-semibold">공고 경쟁력</span>
                    </div>
                    <button
                      onClick={reanalyze}
                      disabled={isAnalyzing}
                      className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20"
                    >
                      <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                    </button>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold">{calculateNewScore()}</span>
                    <span className="text-white/70 mb-1">/ 100점</span>
                    {appliedSuggestions.length > 0 && (
                      <span className="text-xs text-success mb-1 ml-auto">
                        +{calculateNewScore() - aiAnalysis.overallScore}점 개선
                      </span>
                    )}
                  </div>
                  <div className="mt-3 h-2 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: `${aiAnalysis.overallScore}%` }}
                      animate={{ width: `${calculateNewScore()}%` }}
                      className="h-full bg-gradient-to-r from-brand-mint to-success rounded-full"
                    />
                  </div>
                </div>

                {/* 시장 비교 */}
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-brand-mint" />
                    시장 비교 분석
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(aiAnalysis.marketComparison).map(([key, value]) => (
                      <div key={key} className="p-3 bg-bg-secondary rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-text-primary capitalize">
                            {key === 'salary' ? '급여' : key === 'benefits' ? '복리후생' : '자격요건'}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            value.status === 'below' ? 'bg-warning/10 text-warning' :
                            value.status === 'high' ? 'bg-error/10 text-error' :
                            'bg-success/10 text-success'
                          }`}>
                            {value.message}
                          </span>
                        </div>
                        <p className="text-xs text-text-secondary">{value.suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI 제안 목록 */}
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-match-gold" />
                    AI 개선 제안
                  </h3>
                  <div className="space-y-3">
                    {aiAnalysis.suggestions.map((suggestion) => {
                      const isApplied = appliedSuggestions.includes(suggestion.id);
                      return (
                        <motion.div
                          key={suggestion.id}
                          className={`p-3 rounded-xl border ${
                            isApplied
                              ? 'bg-success/5 border-success/30'
                              : 'bg-white border-border-light'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {isApplied ? (
                                <CheckCircle2 className="w-4 h-4 text-success" />
                              ) : (
                                <div className={`w-2 h-2 rounded-full ${
                                  suggestion.priority === 'high' ? 'bg-error' : 'bg-warning'
                                }`} />
                              )}
                              <span className="text-sm font-medium text-text-primary">
                                {suggestion.title}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-brand-mint">{suggestion.impact}</span>
                              <div className="text-[10px] text-text-tertiary">{suggestion.impactLabel}</div>
                            </div>
                          </div>
                          <p className="text-xs text-text-secondary mb-2">{suggestion.description}</p>
                          {!isApplied ? (
                            <button
                              onClick={() => applySuggestion(suggestion.id)}
                              className="w-full py-2 bg-brand-mint/10 text-brand-mint text-xs font-medium rounded-lg hover:bg-brand-mint/20 transition-colors flex items-center justify-center gap-1"
                            >
                              <Zap className="w-3 h-3" />
                              적용하기
                            </button>
                          ) : (
                            <button
                              onClick={() => revertSuggestion(suggestion.id)}
                              className="w-full py-2 bg-bg-secondary text-text-secondary text-xs font-medium rounded-lg hover:bg-bg-tertiary transition-colors"
                            >
                              되돌리기
                            </button>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* 경쟁 병원 분석 */}
                <div>
                  <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Target className="w-4 h-4 text-expert-navy" />
                    경쟁 병원 현황
                  </h3>
                  <div className="space-y-2">
                    {aiAnalysis.competitorAnalysis.map((competitor, index) => (
                      <div key={index} className="p-3 bg-bg-secondary rounded-xl">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-text-primary">{competitor.hospital}</span>
                          <span className="text-xs text-text-secondary">{competitor.applications}명 지원</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-text-secondary">
                          <span>연봉: {competitor.salary}</span>
                          <span>복리후생: {competitor.benefits}개</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light px-4 py-4 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 py-3.5 border border-border-light rounded-xl font-medium text-text-primary"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-[2] py-3.5 bg-brand-mint text-white rounded-xl font-medium flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                변경사항 저장
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white border-b border-border-light px-4 py-4 flex items-center justify-between">
                <h2 className="font-bold text-text-primary">공고 미리보기</h2>
                <button
                  onClick={() => setShowPreview(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-secondary"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-expert-navy mb-2">{formData.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <span>{formData.department}</span>
                    <span>·</span>
                    <span>{formData.position}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="w-4 h-4 text-brand-mint" />
                    <span>연봉 {formData.salaryMin}~{formData.salaryMax}만원</span>
                    {formData.salaryNegotiable && (
                      <span className="text-xs text-text-tertiary">(협의가능)</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-brand-mint" />
                    <span>{formData.workType} · {formData.workHours}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-brand-mint" />
                    <span>{formData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Award className="w-4 h-4 text-brand-mint" />
                    <span>경력 {formData.experienceMin}년 이상</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {formData.benefits.map((benefit, index) => (
                    <span key={index} className="px-3 py-1 bg-brand-mint/10 text-brand-mint text-sm rounded-full">
                      {benefit}
                    </span>
                  ))}
                </div>

                <div className="pt-4 border-t border-border-light">
                  <h4 className="font-semibold text-text-primary mb-2">상세 내용</h4>
                  <p className="text-sm text-text-secondary whitespace-pre-line">{formData.description}</p>
                </div>

                <div className="pt-4 border-t border-border-light">
                  <h4 className="font-semibold text-text-primary mb-2">자격 요건</h4>
                  <ul className="space-y-1">
                    {formData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                        <CheckCircle2 className="w-4 h-4 text-brand-mint mt-0.5" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 통계 상세 모달 */}
      <AnimatePresence>
        {activeStatModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setActiveStatModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden"
            >
              <div className="sticky top-0 bg-white border-b border-border-light px-4 py-4 flex items-center justify-between">
                <h2 className="font-bold text-text-primary">
                  {activeStatModal === 'views' && '프로필 열람 상세'}
                  {activeStatModal === 'applicants' && '지원자 상세'}
                  {activeStatModal === 'matched' && '매칭 후보 상세'}
                </h2>
                <button
                  onClick={() => setActiveStatModal(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-bg-secondary"
                >
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                {/* 조회수 상세 */}
                {activeStatModal === 'views' && viewersData.map((viewer) => (
                  <Link
                    key={viewer.id}
                    href={`/employer/candidates/viewer-${viewer.id}`}
                    className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-expert-navy/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-expert-navy" />
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">{viewer.name}</div>
                        <div className="text-xs text-text-secondary">{viewer.type} · 열람 {viewer.time}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-brand-mint">{viewer.matchScore}%</div>
                      <div className="text-xs text-text-tertiary">매칭</div>
                    </div>
                  </Link>
                ))}

                {/* 지원자 상세 */}
                {activeStatModal === 'applicants' && applicantsData.map((applicant) => (
                  <Link
                    key={applicant.id}
                    href={`/employer/candidates/applicant-${applicant.id}`}
                    className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-mint/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-brand-mint" />
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">{applicant.name}</div>
                        <div className="text-xs text-text-secondary">{applicant.type} · {applicant.experience}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-brand-mint">{applicant.matchScore}%</div>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-info/10 text-info">{applicant.status}</span>
                    </div>
                  </Link>
                ))}

                {/* 매칭 후보 상세 */}
                {activeStatModal === 'matched' && matchedData.map((matched) => (
                  <Link
                    key={matched.id}
                    href={`/employer/candidates/matched-${matched.id}`}
                    className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl hover:bg-bg-tertiary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-match-gold/10 rounded-full flex items-center justify-center">
                        <Users className="w-5 h-5 text-match-gold" />
                      </div>
                      <div>
                        <div className="font-medium text-text-primary">{matched.name}</div>
                        <div className="text-xs text-text-secondary">{matched.type} · {matched.experience}</div>
                        <div className="text-xs text-brand-mint mt-0.5">{matched.insight}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-match-gold">{matched.matchScore}%</div>
                      <div className="text-xs text-text-tertiary">매칭</div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="border-t border-border-light p-4">
                <button
                  onClick={() => setActiveStatModal(null)}
                  className="w-full py-3 bg-expert-navy text-white rounded-xl font-medium"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
