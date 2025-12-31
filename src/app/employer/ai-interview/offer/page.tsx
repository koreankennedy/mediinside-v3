'use client';

import { useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Send,
  CheckCircle,
  DollarSign,
  Calendar,
  Clock,
  MapPin,
  Briefcase,
  Gift,
  FileText,
  Sparkles,
  AlertCircle,
  Users,
  Star,
  Edit2,
  Copy,
  Mail,
  MessageCircle,
  PenTool,
  Shield,
  Download,
} from 'lucide-react';

// 오퍼 대상자 정보 (실제로는 API에서 가져옴)
const mockOfferCandidate = {
  id: 'app-6',
  name: '한소희',
  position: '간호사',
  experience: '6년차',
  matchScore: 95,
  aiScore: 92,
  email: 'sohee.han@email.com',
  phone: '010-1234-5678',
  currentSalary: '3,800만원',
  desiredSalary: '4,200만원',
  currentHospital: '강남세브란스병원',
};

// 기본 오퍼 조건
const defaultOfferConditions = {
  salary: '4,200',
  salaryType: 'annual',
  bonus: '기본급의 100%',
  position: '간호사 (정규직)',
  department: '피부과',
  startDate: '2024년 3월',
  workHours: '주 5일 (09:00 - 18:00)',
  probation: '3개월',
  benefits: [
    '4대보험',
    '퇴직금',
    '학회비 지원',
    '인센티브',
    '점심 식대',
    '경조사비',
  ],
};

function OfferContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const candidateId = searchParams.get('id');

  const [step, setStep] = useState(1);
  const [offerConditions, setOfferConditions] = useState(defaultOfferConditions);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [sendMethod, setSendMethod] = useState<'app' | 'email' | 'both'>('both');
  const [showContractFlow, setShowContractFlow] = useState(false);
  const [contractStep, setContractStep] = useState(1);
  const [contractSigned, setContractSigned] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  // 전자계약 완료 화면
  if (contractSigned) {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 bg-success rounded-full flex items-center justify-center mb-6"
        >
          <PenTool className="w-10 h-10 text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-expert-navy mb-2"
        >
          계약이 완료되었습니다!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-text-secondary text-center mb-8"
        >
          {mockOfferCandidate.name}님과의 근로계약이 체결되었어요.
          <br />
          {offerConditions.startDate} 입사를 축하합니다! 🎉
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full space-y-3"
        >
          <button className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            계약서 다운로드
          </button>
          <Link href="/employer/home">
            <button className="w-full border border-border-light text-text-primary py-4 rounded-xl font-medium">
              홈으로 가기
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  // 전자계약 플로우
  if (showContractFlow) {
    return (
      <div className="min-h-screen bg-bg-secondary pb-32">
        {/* Header */}
        <div className="bg-white px-4 py-4 border-b border-border-light sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowContractFlow(false)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
            >
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-bold text-expert-navy">전자계약</h1>
              <p className="text-sm text-text-secondary">
                {mockOfferCandidate.name}님과의 근로계약
              </p>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mt-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    contractStep >= s
                      ? 'bg-success text-white'
                      : 'bg-bg-secondary text-text-tertiary'
                  }`}
                >
                  {contractStep > s ? <CheckCircle className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 rounded ${
                      contractStep > s ? 'bg-success' : 'bg-bg-secondary'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex mt-2">
            <div className="flex-1 text-center text-xs text-text-tertiary">계약서 작성</div>
            <div className="flex-1 text-center text-xs text-text-tertiary">서명 요청</div>
            <div className="flex-1 text-center text-xs text-text-tertiary">계약 완료</div>
          </div>
        </div>

        <div className="px-4 py-6">
          {/* Step 1: 계약서 작성 */}
          {contractStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-success/10 border border-success/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-success" />
                  <span className="font-semibold text-success">오퍼 수락 완료</span>
                </div>
                <p className="text-sm text-text-secondary">
                  {mockOfferCandidate.name}님이 오퍼를 수락했습니다. 이제 근로계약서를 작성해주세요.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-border-light">
                <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-expert-navy" />
                  근로계약서 정보
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-border-light">
                    <span className="text-text-secondary text-sm">계약 유형</span>
                    <span className="font-medium">정규직 근로계약</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border-light">
                    <span className="text-text-secondary text-sm">근로자</span>
                    <span className="font-medium">{mockOfferCandidate.name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border-light">
                    <span className="text-text-secondary text-sm">직위</span>
                    <span className="font-medium">{offerConditions.position}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border-light">
                    <span className="text-text-secondary text-sm">연봉</span>
                    <span className="font-medium">{offerConditions.salary}만원</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border-light">
                    <span className="text-text-secondary text-sm">근무시간</span>
                    <span className="font-medium">{offerConditions.workHours}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border-light">
                    <span className="text-text-secondary text-sm">입사일</span>
                    <span className="font-medium">{offerConditions.startDate}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-text-secondary text-sm">수습기간</span>
                    <span className="font-medium">{offerConditions.probation}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-border-light">
                <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-expert-navy" />
                  법적 고지사항
                </h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3">
                    <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded" />
                    <span className="text-sm text-text-secondary">
                      근로기준법에 따른 표준근로계약서 양식을 사용합니다
                    </span>
                  </label>
                  <label className="flex items-start gap-3">
                    <input type="checkbox" defaultChecked className="mt-1 w-5 h-5 rounded" />
                    <span className="text-sm text-text-secondary">
                      전자서명법에 따른 공인전자서명을 사용합니다
                    </span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: 서명 요청 */}
          {contractStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 border border-border-light text-center">
                <div className="w-16 h-16 bg-expert-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PenTool className="w-8 h-8 text-expert-navy" />
                </div>
                <h3 className="font-bold text-text-primary text-lg mb-2">전자서명 진행</h3>
                <p className="text-sm text-text-secondary mb-4">
                  병원 대표자 서명을 완료한 후<br />
                  {mockOfferCandidate.name}님에게 서명 요청이 전송됩니다.
                </p>

                <div className="bg-bg-secondary rounded-xl p-4 mb-4">
                  <div className="text-sm text-text-tertiary mb-2">서명 영역</div>
                  <div className="h-24 border-2 border-dashed border-border-light rounded-lg flex items-center justify-center bg-white">
                    <span className="text-text-tertiary text-sm">터치하여 서명</span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
                  <Shield className="w-4 h-4" />
                  암호화된 전자서명으로 법적 효력을 갖습니다
                </div>
              </div>

              <div className="bg-brand-mint/10 border border-brand-mint/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-brand-mint" />
                  <span className="font-semibold text-brand-mint">서명 후 진행</span>
                </div>
                <ul className="text-sm text-text-secondary space-y-1">
                  <li>1. 병원 대표자 서명 완료</li>
                  <li>2. {mockOfferCandidate.name}님에게 카카오톡/이메일 발송</li>
                  <li>3. 근로자 서명 완료 시 계약 체결</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Step 3: 서명 대기 */}
          {contractStep === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-2xl p-6 border border-border-light text-center">
                <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-warning" />
                </div>
                <h3 className="font-bold text-text-primary text-lg mb-2">서명 대기 중</h3>
                <p className="text-sm text-text-secondary mb-4">
                  {mockOfferCandidate.name}님에게 서명 요청을 발송했습니다.
                  <br />
                  서명이 완료되면 알려드릴게요.
                </p>

                <div className="bg-bg-secondary rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">병원 서명</span>
                    <span className="text-success font-medium flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> 완료
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">근로자 서명</span>
                    <span className="text-warning font-medium flex items-center gap-1">
                      <Clock className="w-4 h-4" /> 대기 중
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 border border-border-light">
                <h4 className="font-medium text-text-primary mb-3">발송 내역</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-text-secondary">
                    <Mail className="w-4 h-4" />
                    {mockOfferCandidate.email}로 발송됨
                  </div>
                  <div className="flex items-center gap-2 text-text-secondary">
                    <MessageCircle className="w-4 h-4" />
                    카카오톡으로 발송됨
                  </div>
                </div>
              </div>

              <button
                onClick={() => setContractSigned(true)}
                className="w-full py-3 text-brand-mint font-medium"
              >
                (데모) 서명 완료 시뮬레이션
              </button>
            </motion.div>
          )}
        </div>

        {/* Bottom Action */}
        <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-border-light">
          {contractStep < 3 ? (
            <button
              onClick={() => setContractStep(contractStep + 1)}
              className="w-full bg-success text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
              {contractStep === 1 ? (
                '계약서 미리보기'
              ) : (
                <>
                  <PenTool className="w-5 h-5" />
                  서명하고 요청 보내기
                </>
              )}
            </button>
          ) : (
            <button
              onClick={() => setContractSigned(true)}
              className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold"
            >
              확인
            </button>
          )}
        </div>
      </div>
    );
  }

  // 완료 화면
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="w-20 h-20 bg-success rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-expert-navy mb-2"
        >
          오퍼가 발송되었습니다!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-text-secondary text-center mb-4"
        >
          {mockOfferCandidate.name}님에게 오퍼가 전달되었어요.
          <br />
          응답이 오면 알려드릴게요.
        </motion.p>

        {/* 오퍼 수락 시뮬레이션 (데모용) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="w-full bg-success/10 border border-success/20 rounded-2xl p-4 mb-6"
        >
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <span className="font-semibold text-success">오퍼 수락됨 (데모)</span>
          </div>
          <p className="text-sm text-text-secondary mb-3">
            후보자가 오퍼를 수락했습니다. 전자계약을 진행해주세요.
          </p>
          <button
            onClick={() => setShowContractFlow(true)}
            className="w-full bg-success text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <PenTool className="w-5 h-5" />
            전자계약 시작하기
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full space-y-3"
        >
          <Link href="/employer/ai-interview/pipeline">
            <button className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold">
              지원자 관리로 돌아가기
            </button>
          </Link>
          <Link href="/employer/home">
            <button className="w-full border border-border-light text-text-primary py-4 rounded-xl font-medium">
              홈으로 가기
            </button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-secondary pb-32">
      {/* Header */}
      <div className="bg-white px-4 py-4 border-b border-border-light sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-expert-navy">오퍼 발송</h1>
            <p className="text-sm text-text-secondary">
              {mockOfferCandidate.name}님에게 채용 제안
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center mt-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex-1 flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= s
                    ? 'bg-expert-navy text-white'
                    : 'bg-bg-secondary text-text-tertiary'
                }`}
              >
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded ${
                    step > s ? 'bg-expert-navy' : 'bg-bg-secondary'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <div className="flex-1 text-center text-xs text-text-tertiary">조건 설정</div>
          <div className="flex-1 text-center text-xs text-text-tertiary">미리보기</div>
          <div className="flex-1 text-center text-xs text-text-tertiary">발송</div>
        </div>
      </div>

      <div className="px-4 py-6">
        {/* Step 1: 조건 설정 */}
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* 후보자 정보 */}
            <div className="bg-white rounded-2xl p-4 border border-border-light">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-expert-navy/10 rounded-full flex items-center justify-center">
                  <Users className="w-7 h-7 text-expert-navy" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-expert-navy text-lg">
                      {mockOfferCandidate.name}
                    </span>
                    <span className="text-xs bg-match-gold/10 text-match-gold px-2 py-0.5 rounded">
                      TOP
                    </span>
                  </div>
                  <div className="text-sm text-text-secondary">
                    {mockOfferCandidate.position} · {mockOfferCandidate.experience}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-mint">
                    {mockOfferCandidate.matchScore}%
                  </div>
                  <div className="text-xs text-text-tertiary">매칭</div>
                </div>
              </div>
            </div>

            {/* AI 추천 */}
            <div className="bg-brand-mint/10 border border-brand-mint/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-brand-mint" />
                <span className="font-semibold text-brand-mint">AI 추천 조건</span>
              </div>
              <p className="text-sm text-text-secondary">
                시장 데이터와 후보자 희망조건을 분석한 결과, 연봉{' '}
                <strong className="text-expert-navy">4,200만원</strong> 제안 시 수락 확률이
                가장 높아요. (예상 수락률: 87%)
              </p>
            </div>

            {/* 급여 조건 */}
            <div className="bg-white rounded-2xl p-4 border border-border-light">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-expert-navy" />
                급여 조건
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text-secondary mb-1 block">연봉 (만원)</label>
                  <input
                    type="text"
                    value={offerConditions.salary}
                    onChange={(e) =>
                      setOfferConditions({ ...offerConditions, salary: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-1 block">성과급</label>
                  <input
                    type="text"
                    value={offerConditions.bonus}
                    onChange={(e) =>
                      setOfferConditions({ ...offerConditions, bonus: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary"
                  />
                </div>
              </div>
            </div>

            {/* 근무 조건 */}
            <div className="bg-white rounded-2xl p-4 border border-border-light">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-expert-navy" />
                근무 조건
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-text-secondary mb-1 block">직급/포지션</label>
                  <input
                    type="text"
                    value={offerConditions.position}
                    onChange={(e) =>
                      setOfferConditions({ ...offerConditions, position: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-1 block">소속 부서</label>
                  <input
                    type="text"
                    value={offerConditions.department}
                    onChange={(e) =>
                      setOfferConditions({ ...offerConditions, department: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm text-text-secondary mb-1 block">입사 예정일</label>
                    <input
                      type="text"
                      value={offerConditions.startDate}
                      onChange={(e) =>
                        setOfferConditions({ ...offerConditions, startDate: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-text-secondary mb-1 block">수습 기간</label>
                    <input
                      type="text"
                      value={offerConditions.probation}
                      onChange={(e) =>
                        setOfferConditions({ ...offerConditions, probation: e.target.value })
                      }
                      className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-text-secondary mb-1 block">근무 시간</label>
                  <input
                    type="text"
                    value={offerConditions.workHours}
                    onChange={(e) =>
                      setOfferConditions({ ...offerConditions, workHours: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-bg-secondary rounded-xl text-text-primary"
                  />
                </div>
              </div>
            </div>

            {/* 복리후생 */}
            <div className="bg-white rounded-2xl p-4 border border-border-light">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Gift className="w-5 h-5 text-expert-navy" />
                복리후생
              </h3>
              <div className="flex flex-wrap gap-2">
                {offerConditions.benefits.map((benefit) => (
                  <span
                    key={benefit}
                    className="px-3 py-1.5 bg-bg-secondary text-text-secondary rounded-full text-sm"
                  >
                    {benefit}
                  </span>
                ))}
                <button className="px-3 py-1.5 border border-dashed border-border-light text-text-tertiary rounded-full text-sm">
                  + 추가
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: 미리보기 */}
        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 border border-border-light">
              <div className="text-center mb-6">
                <div className="text-sm text-text-tertiary mb-2">채용 오퍼 레터</div>
                <h2 className="text-xl font-bold text-expert-navy">
                  {mockOfferCandidate.name}님께 드리는 제안
                </h2>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-bg-secondary rounded-xl">
                  <div className="text-sm text-text-tertiary mb-1">연봉</div>
                  <div className="text-2xl font-bold text-expert-navy">
                    {offerConditions.salary}만원
                  </div>
                  <div className="text-sm text-text-secondary">
                    + 성과급 {offerConditions.bonus}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-bg-secondary rounded-xl">
                    <div className="text-xs text-text-tertiary mb-1">포지션</div>
                    <div className="font-medium text-text-primary">
                      {offerConditions.position}
                    </div>
                  </div>
                  <div className="p-3 bg-bg-secondary rounded-xl">
                    <div className="text-xs text-text-tertiary mb-1">소속</div>
                    <div className="font-medium text-text-primary">
                      {offerConditions.department}
                    </div>
                  </div>
                  <div className="p-3 bg-bg-secondary rounded-xl">
                    <div className="text-xs text-text-tertiary mb-1">입사일</div>
                    <div className="font-medium text-text-primary">
                      {offerConditions.startDate}
                    </div>
                  </div>
                  <div className="p-3 bg-bg-secondary rounded-xl">
                    <div className="text-xs text-text-tertiary mb-1">수습기간</div>
                    <div className="font-medium text-text-primary">
                      {offerConditions.probation}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-bg-secondary rounded-xl">
                  <div className="text-sm text-text-tertiary mb-2">근무시간</div>
                  <div className="font-medium text-text-primary">
                    {offerConditions.workHours}
                  </div>
                </div>

                <div className="p-4 bg-bg-secondary rounded-xl">
                  <div className="text-sm text-text-tertiary mb-2">복리후생</div>
                  <div className="flex flex-wrap gap-2">
                    {offerConditions.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="px-2 py-1 bg-white text-text-secondary rounded text-sm"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border-light text-center">
                <p className="text-sm text-text-secondary">
                  응답 기한: 발송일로부터 7일 이내
                </p>
              </div>
            </div>

            <button
              onClick={() => setStep(1)}
              className="w-full py-3 text-expert-navy font-medium flex items-center justify-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              조건 수정하기
            </button>
          </motion.div>
        )}

        {/* Step 3: 발송 */}
        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {/* 발송 방법 선택 */}
            <div className="bg-white rounded-2xl p-4 border border-border-light">
              <h3 className="font-semibold text-text-primary mb-4">발송 방법</h3>
              <div className="space-y-3">
                <button
                  onClick={() => setSendMethod('app')}
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                    sendMethod === 'app'
                      ? 'border-expert-navy bg-expert-navy/5'
                      : 'border-border-light'
                  }`}
                >
                  <MessageCircle
                    className={`w-5 h-5 ${
                      sendMethod === 'app' ? 'text-expert-navy' : 'text-text-tertiary'
                    }`}
                  />
                  <div className="text-left flex-1">
                    <div className="font-medium text-text-primary">앱 알림만</div>
                    <div className="text-xs text-text-secondary">MediInside 앱으로 전송</div>
                  </div>
                  {sendMethod === 'app' && <CheckCircle className="w-5 h-5 text-expert-navy" />}
                </button>

                <button
                  onClick={() => setSendMethod('email')}
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                    sendMethod === 'email'
                      ? 'border-expert-navy bg-expert-navy/5'
                      : 'border-border-light'
                  }`}
                >
                  <Mail
                    className={`w-5 h-5 ${
                      sendMethod === 'email' ? 'text-expert-navy' : 'text-text-tertiary'
                    }`}
                  />
                  <div className="text-left flex-1">
                    <div className="font-medium text-text-primary">이메일만</div>
                    <div className="text-xs text-text-secondary">
                      {mockOfferCandidate.email}
                    </div>
                  </div>
                  {sendMethod === 'email' && (
                    <CheckCircle className="w-5 h-5 text-expert-navy" />
                  )}
                </button>

                <button
                  onClick={() => setSendMethod('both')}
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-3 transition-all ${
                    sendMethod === 'both'
                      ? 'border-expert-navy bg-expert-navy/5'
                      : 'border-border-light'
                  }`}
                >
                  <Send
                    className={`w-5 h-5 ${
                      sendMethod === 'both' ? 'text-expert-navy' : 'text-text-tertiary'
                    }`}
                  />
                  <div className="text-left flex-1">
                    <div className="font-medium text-text-primary">앱 + 이메일 (추천)</div>
                    <div className="text-xs text-text-secondary">가장 빠른 응답률</div>
                  </div>
                  {sendMethod === 'both' && <CheckCircle className="w-5 h-5 text-expert-navy" />}
                </button>
              </div>
            </div>

            {/* 응답 기한 */}
            <div className="bg-white rounded-2xl p-4 border border-border-light">
              <h3 className="font-semibold text-text-primary mb-3">응답 기한</h3>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-text-tertiary" />
                <span className="text-text-primary">발송일로부터 7일</span>
              </div>
            </div>

            {/* 주의사항 */}
            <div className="bg-warning/10 border border-warning/20 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-text-primary mb-1">발송 전 확인하세요</div>
                  <ul className="text-sm text-text-secondary space-y-1">
                    <li>• 오퍼 조건은 발송 후 수정이 어려워요</li>
                    <li>• 후보자가 수락하면 채용이 확정돼요</li>
                    <li>• 7일 내 응답이 없으면 자동 만료돼요</li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-white border-t border-border-light">
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold"
          >
            다음
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-success text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                발송 중...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                오퍼 발송하기
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

export default function OfferPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-secondary flex items-center justify-center">
          로딩 중...
        </div>
      }
    >
      <OfferContent />
    </Suspense>
  );
}
