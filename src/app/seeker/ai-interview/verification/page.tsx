'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
} from 'lucide-react';

const verificationItems = [
  {
    id: 'license',
    label: '면허/자격증',
    description: '간호사 면허',
    status: 'verified',
    verifiedAt: '2024-12-28',
    badge: '검증완료',
  },
  {
    id: 'career1',
    label: '경력 1',
    description: '강남세브란스병원 (2020-2023)',
    status: 'verified',
    verifiedAt: '2024-12-28',
    badge: '검증완료',
  },
  {
    id: 'career2',
    label: '경력 2',
    description: '서울아산병원 (2018-2020)',
    status: 'verified',
    verifiedAt: '2024-12-29',
    badge: '검증완료',
  },
  {
    id: 'education',
    label: '학력',
    description: '서울대학교 간호학과',
    status: 'verified',
    verifiedAt: '2024-12-29',
    badge: '검증완료',
  },
];

const verificationBenefits = [
  { icon: Shield, text: '신뢰도 100% 배지 획득' },
  { icon: Star, text: '검색 결과 상위 노출' },
  { icon: Building2, text: '병원 선호도 35% 증가' },
];

export default function VerificationPage() {
  const router = useRouter();

  const verifiedCount = verificationItems.filter((i) => i.status === 'verified').length;
  const totalCount = verificationItems.length;
  const isFullyVerified = verifiedCount === totalCount;

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
                className="bg-white rounded-2xl p-4 border border-border-light"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        item.status === 'verified' ? 'bg-success/10' : 'bg-bg-secondary'
                      }`}
                    >
                      {item.status === 'verified' ? (
                        <CheckCircle className="w-5 h-5 text-success" />
                      ) : (
                        <Clock className="w-5 h-5 text-text-tertiary" />
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
                        : 'bg-bg-secondary text-text-tertiary'
                    }`}
                  >
                    {item.badge}
                  </span>
                </div>
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
          <button className="w-full py-3 border border-dashed border-border-light rounded-xl text-text-tertiary text-sm">
            + 추가 검증 요청
          </button>
        </div>

        {/* 다음 단계 */}
        {isFullyVerified && (
          <Link href="/seeker/ai-interview/practice">
            <div className="bg-brand-mint/10 border border-brand-mint/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-brand-mint">경력 검증 완료!</div>
                <div className="text-sm text-text-secondary">모의면접을 시작해보세요</div>
              </div>
              <ChevronRight className="w-5 h-5 text-brand-mint" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
