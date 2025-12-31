'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  FileText,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  Edit2,
  Copy,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';

const departments = ['피부과', '치과', '성형외과', '정형외과', '내과', '안과', '기타'];
const positions = ['간호사', '치과위생사', '의료기사', '간호조무사', '코디네이터', '기타'];
const experienceLevels = ['신입', '1~2년', '3~5년', '5~10년', '10년 이상', '무관'];
const workTypes = ['정규직', '계약직', '파트타임', '인턴'];
const salaryRanges = [
  '협의 후 결정',
  '250~300만원',
  '300~350만원',
  '350~400만원',
  '400~450만원',
  '450~500만원',
  '500만원 이상',
];

export default function JobPostingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedJD, setGeneratedJD] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    department: '',
    position: '',
    experience: '',
    workType: '',
    salaryRange: '',
    location: '서울 강남구',
    benefits: [] as string[],
    requirements: '',
    additionalInfo: '',
  });

  const benefits = [
    '4대보험',
    '퇴직금',
    '인센티브',
    '성과급',
    '학회비 지원',
    '점심 제공',
    '교통비 지원',
    '주차 지원',
    '연차 자유사용',
    '육아휴직',
  ];

  const toggleBenefit = (benefit: string) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter((b) => b !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  const generateJD = () => {
    setIsGenerating(true);
    // AI JD 생성 시뮬레이션
    setTimeout(() => {
      const jd = `[${formData.department}] ${formData.position} 모집 (${formData.experience})

안녕하세요, 강남에 위치한 프리미엄 ${formData.department} 전문 의원입니다.

저희 병원은 최신 장비와 체계적인 시스템을 갖추고 있으며,
직원들의 성장과 워라밸을 최우선으로 생각합니다.

📋 모집 내용
• 직무: ${formData.position}
• 경력: ${formData.experience}
• 근무형태: ${formData.workType}
• 급여: ${formData.salaryRange}
• 근무지: ${formData.location}

✨ 이런 분을 찾습니다
• ${formData.department} 관련 경험이 있으신 분
• 환자 응대에 친절하고 성실하신 분
• 팀워크를 중시하고 함께 성장하고 싶으신 분
${formData.requirements ? `• ${formData.requirements}` : ''}

🎁 복리후생
${formData.benefits.map((b) => `• ${b}`).join('\n')}

${formData.additionalInfo ? `\n📌 추가 안내\n${formData.additionalInfo}` : ''}

함께 성장할 인재를 기다립니다!`;

      setGeneratedJD(jd);
      setIsGenerating(false);
      setStep(3);
    }, 2000);
  };

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <label className="text-sm font-medium text-text-primary block mb-2">
          진료 과목 *
        </label>
        <div className="flex flex-wrap gap-2">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setFormData((prev) => ({ ...prev, department: dept }))}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                formData.department === dept
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
        <label className="text-sm font-medium text-text-primary block mb-2">
          모집 직무 *
        </label>
        <div className="flex flex-wrap gap-2">
          {positions.map((pos) => (
            <button
              key={pos}
              onClick={() => setFormData((prev) => ({ ...prev, position: pos }))}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                formData.position === pos
                  ? 'bg-expert-navy text-white'
                  : 'bg-bg-secondary text-text-secondary'
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-text-primary block mb-2">
          경력 요건 *
        </label>
        <div className="flex flex-wrap gap-2">
          {experienceLevels.map((exp) => (
            <button
              key={exp}
              onClick={() => setFormData((prev) => ({ ...prev, experience: exp }))}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                formData.experience === exp
                  ? 'bg-expert-navy text-white'
                  : 'bg-bg-secondary text-text-secondary'
              }`}
            >
              {exp}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-text-primary block mb-2">
          근무 형태 *
        </label>
        <div className="flex flex-wrap gap-2">
          {workTypes.map((type) => (
            <button
              key={type}
              onClick={() => setFormData((prev) => ({ ...prev, workType: type }))}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                formData.workType === type
                  ? 'bg-expert-navy text-white'
                  : 'bg-bg-secondary text-text-secondary'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <label className="text-sm font-medium text-text-primary block mb-2">
          급여 범위 *
        </label>
        <div className="flex flex-wrap gap-2">
          {salaryRanges.map((range) => (
            <button
              key={range}
              onClick={() => setFormData((prev) => ({ ...prev, salaryRange: range }))}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                formData.salaryRange === range
                  ? 'bg-expert-navy text-white'
                  : 'bg-bg-secondary text-text-secondary'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-text-primary block mb-2">
          복리후생 (복수 선택)
        </label>
        <div className="flex flex-wrap gap-2">
          {benefits.map((benefit) => (
            <button
              key={benefit}
              onClick={() => toggleBenefit(benefit)}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                formData.benefits.includes(benefit)
                  ? 'bg-brand-mint text-white'
                  : 'bg-bg-secondary text-text-secondary'
              }`}
            >
              {formData.benefits.includes(benefit) && (
                <CheckCircle className="w-3 h-3 inline mr-1" />
              )}
              {benefit}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-text-primary block mb-2">
          필수 요건 (선택)
        </label>
        <textarea
          value={formData.requirements}
          onChange={(e) => setFormData((prev) => ({ ...prev, requirements: e.target.value }))}
          placeholder="예: 피부 레이저 시술 경험 필수"
          className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-tertiary resize-none"
          rows={2}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-text-primary block mb-2">
          추가 안내사항 (선택)
        </label>
        <textarea
          value={formData.additionalInfo}
          onChange={(e) => setFormData((prev) => ({ ...prev, additionalInfo: e.target.value }))}
          placeholder="예: 면접 후 바로 채용 결정, 입사일 협의 가능"
          className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-tertiary resize-none"
          rows={2}
        />
      </div>
    </motion.div>
  );

  const renderStep3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-4"
    >
      <div className="bg-brand-mint/10 rounded-xl p-4 flex items-center gap-3">
        <Sparkles className="w-6 h-6 text-brand-mint" />
        <div>
          <div className="font-medium text-brand-mint">AI가 채용공고를 작성했어요!</div>
          <div className="text-sm text-text-secondary">
            내용을 검토하고 수정할 수 있어요
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-border-light p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-text-primary">생성된 채용공고</span>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-bg-secondary rounded-lg transition-colors">
              <Edit2 className="w-4 h-4 text-text-tertiary" />
            </button>
            <button className="p-2 hover:bg-bg-secondary rounded-lg transition-colors">
              <Copy className="w-4 h-4 text-text-tertiary" />
            </button>
            <button
              onClick={() => {
                setGeneratedJD(null);
                setStep(2);
              }}
              className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-text-tertiary" />
            </button>
          </div>
        </div>
        <div className="bg-bg-secondary rounded-xl p-4 text-sm text-text-primary whitespace-pre-line max-h-[400px] overflow-y-auto">
          {generatedJD}
        </div>
      </div>

      <div className="nudge-box">
        <Sparkles className="w-4 h-4 text-brand-mint inline mr-2" />
        다음 단계에서 <strong>채용 브랜딩 콘텐츠</strong>를 만들어보세요!
      </div>
    </motion.div>
  );

  const canProceed = () => {
    if (step === 1) {
      return formData.department && formData.position && formData.experience && formData.workType;
    }
    if (step === 2) {
      return formData.salaryRange;
    }
    return true;
  };

  return (
    <div className="px-4 py-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
        >
          <ArrowLeft className="w-5 h-5 text-text-primary" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-expert-navy">채용공고 등록</h1>
          <p className="text-sm text-text-secondary">Step {step}/3</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-2 mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 h-1.5 rounded-full transition-all ${
              s <= step ? 'bg-expert-navy' : 'bg-bg-tertiary'
            }`}
          />
        ))}
      </div>

      {/* Step Title */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-primary">
          {step === 1 && '기본 정보 입력'}
          {step === 2 && '조건 및 복리후생'}
          {step === 3 && 'AI 채용공고 확인'}
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          {step === 1 && '어떤 인재를 찾고 계신가요?'}
          {step === 2 && '제공하는 조건을 알려주세요'}
          {step === 3 && 'AI가 작성한 채용공고를 확인해주세요'}
        </p>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </AnimatePresence>

      {/* Bottom Actions */}
      <div className="fixed bottom-20 left-0 right-0 px-4 bg-gradient-to-t from-bg-secondary via-bg-secondary to-transparent pt-6">
        {step < 3 ? (
          <button
            onClick={() => {
              if (step === 2) {
                generateJD();
              } else {
                setStep(step + 1);
              }
            }}
            disabled={!canProceed() || isGenerating}
            className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                AI가 채용공고를 작성중...
              </>
            ) : step === 2 ? (
              <>
                <Sparkles className="w-5 h-5" />
                AI로 채용공고 생성하기
              </>
            ) : (
              <>
                다음
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        ) : (
          <div className="space-y-3">
            <Link href="/employer/ai-interview/branding">
              <button className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                브랜딩 콘텐츠 만들기
              </button>
            </Link>
            <Link href="/employer/ai-interview/calibration">
              <button className="w-full bg-white text-expert-navy py-4 rounded-xl font-semibold border border-expert-navy flex items-center justify-center gap-2">
                면접 질문 설정하기
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
