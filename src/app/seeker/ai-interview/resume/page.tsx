'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  CheckCircle,
  Upload,
  Sparkles,
  Edit2,
  Download,
  Eye,
  Star,
  AlertCircle,
  ChevronRight,
  X,
  User,
  Briefcase,
  GraduationCap,
  Award,
} from 'lucide-react';

const resumeSections = [
  { id: 'basic', label: '기본 정보', completed: true, score: 100 },
  { id: 'career', label: '경력 사항', completed: true, score: 95 },
  { id: 'skills', label: '보유 술기', completed: true, score: 100 },
  { id: 'education', label: '학력/자격', completed: true, score: 100 },
];

const aiSuggestions = [
  '경력 기술에서 담당 업무를 더 상세히 작성해보세요',
  '보유 술기 항목에 숙련도를 추가하면 병원에서 참고하기 좋아요',
  '최근 이수한 교육/연수 내역을 추가하면 더 좋아요',
];

// 이력서 미리보기 데이터
const resumePreviewData = {
  name: '김지원',
  position: '치과위생사',
  experience: '3년 2개월',
  phone: '010-1234-5678',
  email: 'jiwon@email.com',
  careers: [
    { company: '강남스마일치과', position: '치과위생사', period: '2022.03 ~ 현재', duties: '스케일링, 레진 충전 보조, 환자 상담' },
    { company: '서초밝은치과', position: '치과위생사', period: '2021.01 ~ 2022.02', duties: '임플란트 보조, X-ray 촬영' },
  ],
  skills: ['스케일링', '레진 충전 보조', '임플란트 보조', 'X-ray 촬영', '환자 상담'],
  education: '서울보건대학교 치위생과 졸업 (2020)',
  certifications: ['치과위생사 면허', '심폐소생술(CPR) 자격증'],
};

// 섹션별 상세 데이터
const sectionDetails: Record<string, { title: string; items: { label: string; value: string; editable?: boolean }[] }> = {
  basic: {
    title: '기본 정보',
    items: [
      { label: '이름', value: '김지원' },
      { label: '연락처', value: '010-1234-5678' },
      { label: '이메일', value: 'jiwon@email.com' },
      { label: '생년월일', value: '1995.03.15' },
    ],
  },
  career: {
    title: '경력 사항',
    items: [
      { label: '현 직장', value: '강남스마일치과 (2022.03 ~ 현재)' },
      { label: '이전 직장', value: '서초밝은치과 (2021.01 ~ 2022.02)' },
      { label: '총 경력', value: '3년 2개월' },
      { label: '주요 업무', value: '스케일링, 레진 충전 보조, 임플란트 보조', editable: true },
    ],
  },
  skills: {
    title: '보유 술기',
    items: [
      { label: '스케일링', value: '상급' },
      { label: '레진 충전 보조', value: '상급' },
      { label: '임플란트 보조', value: '중급' },
      { label: 'X-ray 촬영', value: '상급' },
    ],
  },
  education: {
    title: '학력/자격',
    items: [
      { label: '최종학력', value: '서울보건대학교 치위생과 (2020 졸업)' },
      { label: '자격증', value: '치과위생사 면허, CPR 자격증' },
    ],
  },
};

export default function ResumePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [showSectionModal, setShowSectionModal] = useState(false);

  const totalScore = Math.round(
    resumeSections.reduce((sum, s) => sum + s.score, 0) / resumeSections.length
  );
  const allCompleted = resumeSections.every((s) => s.completed);

  const openSectionDetail = (sectionId: string) => {
    setSelectedSection(sectionId);
    setShowSectionModal(true);
  };

  const incompleteSection = resumeSections.find(s => !s.completed);

  const handleFileUpload = () => {
    // 파일 업로드 시뮬레이션
    setShowUploadSuccess(true);
    setTimeout(() => setShowUploadSuccess(false), 2000);
  };

  const handleDownloadPDF = () => {
    // PDF 다운로드 시뮬레이션
    alert('PDF가 다운로드됩니다.');
  };

  return (
    <div className="min-h-screen bg-bg-secondary pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-border-light">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-expert-navy">이력서 제출</h1>
            <p className="text-sm text-text-secondary">AI가 맞춤형 이력서를 완성해요</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* 완성도 */}
        <div
          onClick={() => incompleteSection && openSectionDetail(incompleteSection.id)}
          className={`bg-gradient-to-r from-info to-info/80 rounded-2xl p-5 text-white ${incompleteSection ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-white/70 mb-1">이력서 완성도</div>
              <div className="text-4xl font-bold">{totalScore}%</div>
            </div>
            {allCompleted ? (
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
            ) : (
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
            )}
          </div>
          <div className="progress-bar bg-white/20">
            <div className="progress-fill bg-white" style={{ width: `${totalScore}%` }} />
          </div>
          {incompleteSection && (
            <div className="mt-3 flex items-center gap-2 bg-white/20 rounded-lg px-3 py-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">미완성: {incompleteSection.label} - 탭하여 작성하기</span>
            </div>
          )}
        </div>

        {/* 섹션별 현황 */}
        <section>
          <h2 className="text-section-title mb-3">이력서 항목</h2>
          <div className="space-y-3">
            {resumeSections.map((section, index) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-2xl p-4 border border-border-light"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        section.completed ? 'bg-success/10' : 'bg-warning/10'
                      }`}
                    >
                      {section.completed ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <Edit2 className="w-5 h-5 text-warning" />
                      )}
                    </div>
                    <div>
                      <span className="font-medium text-text-primary">{section.label}</span>
                      <div className="text-xs text-text-tertiary">완성도 {section.score}%</div>
                    </div>
                  </div>
                  <button
                    onClick={() => openSectionDetail(section.id)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      section.completed
                        ? 'bg-brand-mint/10 text-brand-mint hover:bg-brand-mint/20'
                        : 'bg-warning text-white hover:bg-warning/90'
                    }`}
                  >
                    {section.completed ? '확인' : '작성'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* AI 추천 */}
        <section>
          <h2 className="text-section-title mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-mint" />
            AI 개선 추천
          </h2>
          <div className="space-y-3">
            {aiSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="bg-brand-mint/10 border border-brand-mint/20 rounded-xl p-4 flex items-start gap-3"
              >
                <Star className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
                <p className="text-sm text-text-secondary">{suggestion}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 액션 버튼 */}
        <div className="space-y-3">
          <button
            onClick={() => setShowPreview(true)}
            className="w-full bg-info text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <Eye className="w-5 h-5" />
            이력서 미리보기
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleFileUpload}
              className="py-3 border border-border-light rounded-xl text-text-primary font-medium flex items-center justify-center gap-2 bg-white"
            >
              <Upload className="w-4 h-4" />
              {showUploadSuccess ? '업로드 완료!' : '파일 첨부'}
            </button>
            <button
              onClick={handleDownloadPDF}
              className="py-3 border border-border-light rounded-xl text-text-primary font-medium flex items-center justify-center gap-2 bg-white"
            >
              <Download className="w-4 h-4" />
              PDF 저장
            </button>
          </div>
        </div>

        {/* 다음 단계 */}
        {allCompleted && (
          <Link href="/seeker/ai-interview/verification">
            <div className="bg-success/10 border border-success/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-success">이력서 완성!</div>
                <div className="text-sm text-text-secondary">다음 단계로 진행하세요</div>
              </div>
              <ChevronRight className="w-5 h-5 text-success" />
            </div>
          </Link>
        )}
      </div>

      {/* 이력서 미리보기 모달 */}
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
              className="absolute inset-x-0 bottom-0 top-10 bg-white rounded-t-3xl overflow-hidden"
            >
              {/* 모달 헤더 */}
              <div className="sticky top-0 z-10 bg-white border-b border-border-light px-4 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-expert-navy">이력서 미리보기</h2>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-secondary"
                  >
                    <X className="w-5 h-5 text-text-primary" />
                  </button>
                </div>
              </div>

              {/* 이력서 내용 */}
              <div className="overflow-y-auto h-full pb-32 px-4 py-6">
                {/* 기본 정보 */}
                <div className="bg-gradient-to-r from-expert-navy to-expert-navy/80 rounded-2xl p-5 text-white mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{resumePreviewData.name}</h3>
                      <p className="text-white/80">{resumePreviewData.position}</p>
                      <p className="text-sm text-white/60">경력 {resumePreviewData.experience}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-2 gap-2 text-sm">
                    <div className="text-white/70">{resumePreviewData.phone}</div>
                    <div className="text-white/70">{resumePreviewData.email}</div>
                  </div>
                </div>

                {/* 경력 사항 */}
                <div className="bg-white rounded-2xl p-4 border border-border-light mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Briefcase className="w-5 h-5 text-expert-navy" />
                    <h3 className="font-semibold text-text-primary">경력 사항</h3>
                  </div>
                  <div className="space-y-4">
                    {resumePreviewData.careers.map((career, index) => (
                      <div key={index} className="border-l-2 border-brand-mint pl-4">
                        <div className="font-medium text-text-primary">{career.company}</div>
                        <div className="text-sm text-text-secondary">{career.position}</div>
                        <div className="text-xs text-text-tertiary">{career.period}</div>
                        <div className="text-sm text-text-secondary mt-1">{career.duties}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 보유 술기 */}
                <div className="bg-white rounded-2xl p-4 border border-border-light mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="w-5 h-5 text-brand-mint" />
                    <h3 className="font-semibold text-text-primary">보유 술기</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resumePreviewData.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 bg-brand-mint/10 text-brand-mint rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 학력 & 자격증 */}
                <div className="bg-white rounded-2xl p-4 border border-border-light mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="w-5 h-5 text-info" />
                    <h3 className="font-semibold text-text-primary">학력 & 자격증</h3>
                  </div>
                  <div className="mb-3">
                    <div className="text-sm text-text-primary">{resumePreviewData.education}</div>
                  </div>
                  <div className="space-y-2">
                    {resumePreviewData.certifications.map((cert) => (
                      <div key={cert} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm text-text-primary">{cert}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-border-light px-4 py-4">
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowPreview(false);
                      router.push('/seeker/profile/edit');
                    }}
                    className="flex-1 py-3 border border-border-light rounded-xl font-medium text-text-primary"
                  >
                    수정하기
                  </button>
                  <button
                    onClick={() => {
                      setShowPreview(false);
                      router.push('/seeker/ai-interview/verification');
                    }}
                    className="flex-1 py-3 bg-brand-mint text-white rounded-xl font-semibold"
                  >
                    제출하기
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 섹션 상세 모달 */}
      <AnimatePresence>
        {showSectionModal && selectedSection && sectionDetails[selectedSection] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
            onClick={() => setShowSectionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl w-full max-w-sm max-h-[70vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white px-4 py-4 border-b border-border-light rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-text-primary">
                    {sectionDetails[selectedSection].title}
                  </h3>
                  <button onClick={() => setShowSectionModal(false)} className="p-1">
                    <X className="w-5 h-5 text-text-tertiary" />
                  </button>
                </div>
              </div>

              <div className="px-4 py-6 space-y-4">
                {sectionDetails[selectedSection].items.map((item, index) => (
                  <div key={index} className="bg-bg-secondary rounded-xl p-4">
                    <div className="text-xs text-text-tertiary mb-1">{item.label}</div>
                    <div className="flex items-center justify-between">
                      <span className="text-text-primary">{item.value}</span>
                      {item.editable && (
                        <button className="text-sm text-brand-mint font-medium px-3 py-1 bg-brand-mint/10 rounded-lg">
                          수정
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-border-light px-4 py-4 rounded-b-2xl">
                <button
                  onClick={() => setShowSectionModal(false)}
                  className="w-full py-3 bg-brand-mint text-white rounded-xl font-semibold"
                >
                  확인
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
