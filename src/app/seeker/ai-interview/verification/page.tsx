'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  ArrowLeft,
  Shield,
  CheckCircle,
  Clock,
  Building2,
  Award,
  FileText,
  Phone,
  AlertCircle,
  ChevronRight,
  Sparkles,
  Star,
  Upload,
  X,
  File,
  Edit2,
  Plus,
} from 'lucide-react';

const verificationItems = [
  {
    id: 'license',
    label: '면허/자격증',
    description: '간호사 면허',
    status: 'verified',
    verifiedAt: '2024-12-28',
    badge: '검증완료',
    completeness: 100,
  },
  {
    id: 'career1',
    label: '경력 1',
    description: '청담리더스피부과 (2023-현재)',
    status: 'verified',
    verifiedAt: '2024-12-28',
    badge: '검증완료',
    completeness: 100,
  },
  {
    id: 'career2',
    label: '경력 2',
    description: '강남뷰티의원 (2020-2023)',
    status: 'pending',
    verifiedAt: null,
    badge: '검증필요',
    completeness: 60,
    missingItems: ['재직증명서', '경력기술서'],
  },
  {
    id: 'education',
    label: '학력',
    description: '서울대학교 간호학과',
    status: 'pending',
    verifiedAt: null,
    badge: '검증필요',
    completeness: 40,
    missingItems: ['졸업증명서', '성적증명서'],
  },
  {
    id: 'skills',
    label: '보유 술기',
    description: '레이저 시술, 보톡스 보조 등 4개',
    status: 'verified',
    verifiedAt: '2024-12-29',
    badge: '검증완료',
    completeness: 95,
    missingItems: ['추가 술기 입력 권장'],
  },
];

const verificationBenefits = [
  { icon: Shield, text: '신뢰도 100% 배지 획득' },
  { icon: Star, text: '검색 결과 상위 노출' },
  { icon: Building2, text: '병원 선호도 35% 증가' },
];

export default function VerificationPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationType, setVerificationType] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const verifiedCount = verificationItems.filter((i) => i.status === 'verified').length;
  const totalCount = verificationItems.length;
  const isFullyVerified = verifiedCount === totalCount;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setUploadedFiles(prev => [...prev, ...Array.from(files)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitVerification = () => {
    if (!verificationType || uploadedFiles.length === 0) {
      alert('검증 유형을 선택하고 서류를 첨부해주세요.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowVerificationModal(false);
      setVerificationType('');
      setUploadedFiles([]);
      alert('추가 검증 요청이 접수되었습니다.\n검증 완료까지 1~3 영업일이 소요됩니다.');
    }, 1500);
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
            <h1 className="text-lg font-bold text-expert-navy">경력 검증</h1>
            <p className="text-sm text-text-secondary">경력과 자격을 검증받으세요</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* 검증 현황 */}
        <div
          className={`rounded-2xl p-5 text-white ${
            isFullyVerified
              ? 'bg-gradient-to-r from-success to-success/80'
              : 'bg-gradient-to-r from-warning to-warning/80'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-white/70 mb-1">검증 완료</div>
              <div className="text-4xl font-bold">
                {verifiedCount}/{totalCount}
              </div>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              {isFullyVerified ? (
                <Shield className="w-7 h-7 text-white" />
              ) : (
                <Clock className="w-7 h-7 text-white" />
              )}
            </div>
          </div>
          {isFullyVerified && (
            <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2">
              <CheckCircle className="w-5 h-5 text-white" />
              <span className="text-sm font-medium">모든 경력이 검증되었습니다!</span>
            </div>
          )}
        </div>

        {/* 검증 혜택 */}
        {isFullyVerified && (
          <div className="bg-success/10 border border-success/20 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-success" />
              <span className="font-semibold text-success">검증 완료 혜택</span>
            </div>
            <div className="space-y-2">
              {verificationBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 text-sm text-text-secondary">
                  <benefit.icon className="w-4 h-4 text-success" />
                  <span>{benefit.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 검증 항목 */}
        <section>
          <h2 className="text-section-title mb-3">검증 항목</h2>
          <div className="space-y-3">
            {verificationItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-4 border ${
                  item.status === 'pending' ? 'border-warning/50' : 'border-border-light'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.status === 'verified' ? 'bg-success/10' : 'bg-warning/10'
                      }`}
                    >
                      {item.status === 'verified' ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-warning" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">{item.label}</div>
                      <div className="text-sm text-text-secondary">{item.description}</div>
                      {item.verifiedAt && (
                        <div className="text-xs text-success mt-1">{item.verifiedAt} 검증</div>
                      )}
                    </div>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      item.status === 'verified'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>

                {/* 완성도 바 */}
                <div className="mt-3 mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-text-tertiary">완성도</span>
                    <span className={item.completeness === 100 ? 'text-success' : 'text-warning'}>
                      {item.completeness}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.completeness === 100 ? 'bg-success' : 'bg-warning'
                      }`}
                      style={{ width: `${item.completeness}%` }}
                    />
                  </div>
                </div>

                {/* 부족한 항목 및 수정 버튼 */}
                {item.missingItems && item.missingItems.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-border-light">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-text-tertiary mb-1">
                          {item.status === 'pending' ? '필요한 서류' : '추가 권장'}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.missingItems.map((missing, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-2 py-0.5 rounded ${
                                item.status === 'pending'
                                  ? 'bg-warning/10 text-warning'
                                  : 'bg-brand-mint/10 text-brand-mint'
                              }`}
                            >
                              {missing}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (item.status === 'pending') {
                            setVerificationType(item.id === 'education' ? 'education' : 'career');
                            setShowVerificationModal(true);
                          } else {
                            // 술기인 경우 프로필 술기 탭으로 이동
                            if (item.id === 'skills') {
                              router.push('/seeker/profile?section=skills');
                            } else {
                              router.push('/seeker/profile?section=experience');
                            }
                          }
                        }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          item.status === 'pending'
                            ? 'bg-warning text-white hover:bg-warning/90'
                            : 'bg-brand-mint/10 text-brand-mint hover:bg-brand-mint/20'
                        }`}
                      >
                        {item.status === 'pending' ? (
                          <>
                            <Plus className="w-3 h-3" />
                            검증하기
                          </>
                        ) : (
                          <>
                            <Edit2 className="w-3 h-3" />
                            수정
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* 추가 검증 요청 */}
        <div className="bg-white rounded-2xl p-4 border border-border-light">
          <div className="flex items-center gap-3 mb-3">
            <Award className="w-5 h-5 text-expert-navy" />
            <span className="font-medium text-text-primary">추가 검증 항목</span>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            추가 자격증이나 교육 이수 내역을 검증받으면 프로필 신뢰도가 더 높아져요.
          </p>
          <button
            onClick={() => setShowVerificationModal(true)}
            className="w-full py-3 bg-brand-mint/10 text-brand-mint border border-brand-mint/30 rounded-xl text-sm font-medium hover:bg-brand-mint/20 transition-colors"
          >
            + 추가 검증 요청
          </button>
        </div>

        {/* 다음 단계 */}
        <div className="space-y-3">
          {isFullyVerified ? (
            <Link href="/seeker/ai-interview/practice">
              <button className="w-full py-4 bg-brand-mint text-white rounded-xl font-semibold flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                모의면접 시작하기
              </button>
            </Link>
          ) : (
            <button className="w-full py-4 bg-gray-200 text-text-tertiary rounded-xl font-semibold cursor-not-allowed">
              검증 완료 후 모의면접 가능
            </button>
          )}
          <Link href="/seeker/ai-interview/practice">
            <div className="bg-brand-mint/10 border border-brand-mint/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-brand-mint">경력 검증 완료!</div>
                <div className="text-sm text-text-secondary">모의면접을 시작해보세요</div>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-mint" />
            </div>
          </Link>
        </div>
      </div>

      {/* 추가 검증 요청 모달 */}
      <AnimatePresence>
        {showVerificationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
            onClick={() => setShowVerificationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-white rounded-2xl overflow-hidden"
            >
              {/* 모달 헤더 */}
              <div className="px-4 py-4 border-b border-border-light">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-text-primary">추가 검증 요청</h3>
                  <button
                    onClick={() => setShowVerificationModal(false)}
                    className="p-1 hover:bg-bg-secondary rounded-full"
                  >
                    <X className="w-5 h-5 text-text-tertiary" />
                  </button>
                </div>
              </div>

              {/* 모달 콘텐츠 */}
              <div className="px-4 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
                {/* 검증 유형 선택 */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">
                    검증 유형 선택
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'certificate', label: '자격증/면허' },
                      { value: 'education', label: '학력/교육 이수' },
                      { value: 'career', label: '경력/재직 증명' },
                      { value: 'training', label: '연수/교육 수료' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setVerificationType(option.value)}
                        className={`w-full p-3 rounded-xl border text-left transition-colors ${
                          verificationType === option.value
                            ? 'border-brand-mint bg-brand-mint/5 text-brand-mint'
                            : 'border-border-light text-text-primary hover:border-brand-mint/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 서류 첨부 */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">
                    서류 첨부
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf,.jpg,.jpeg,.png"
                    multiple
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-4 border-2 border-dashed border-border-light rounded-xl flex flex-col items-center gap-2 hover:border-brand-mint/50 transition-colors"
                  >
                    <Upload className="w-6 h-6 text-text-tertiary" />
                    <span className="text-sm text-text-secondary">
                      클릭하여 파일 첨부
                    </span>
                    <span className="text-xs text-text-tertiary">
                      PDF, JPG, PNG (최대 10MB)
                    </span>
                  </button>

                  {/* 첨부된 파일 목록 */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {uploadedFiles.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl"
                        >
                          <div className="flex items-center gap-2">
                            <File className="w-4 h-4 text-brand-mint" />
                            <span className="text-sm text-text-primary truncate max-w-[180px]">
                              {file.name}
                            </span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="p-1 hover:bg-white rounded-full"
                          >
                            <X className="w-4 h-4 text-text-tertiary" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 안내 메시지 */}
                <div className="bg-info/10 rounded-xl p-3">
                  <p className="text-xs text-info leading-relaxed">
                    검증 완료까지 1~3 영업일이 소요됩니다.
                    서류가 불명확한 경우 추가 요청이 있을 수 있습니다.
                  </p>
                </div>
              </div>

              {/* 하단 버튼 */}
              <div className="px-4 py-4 border-t border-border-light">
                <button
                  onClick={handleSubmitVerification}
                  disabled={!verificationType || uploadedFiles.length === 0 || isSubmitting}
                  className="w-full py-3 bg-brand-mint text-white rounded-xl font-semibold disabled:bg-gray-200 disabled:text-text-tertiary transition-colors"
                >
                  {isSubmitting ? '제출 중...' : '검증 요청하기'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
