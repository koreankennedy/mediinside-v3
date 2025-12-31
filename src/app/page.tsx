'use client';

import { motion } from 'framer-motion';
import { User, Building2, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-bg-secondary flex flex-col">
      {/* Header */}
      <div className="pt-20 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold mb-3">
            <span className="text-brand-mint">Medi</span>
            <span className="text-expert-navy">Inside</span>
          </h1>
          <p className="text-text-secondary">의료 인재와 병원을 연결하는 스마트 매칭</p>
        </motion.div>
      </div>

      {/* Service Selection */}
      <div className="flex-1 px-6 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto space-y-4"
        >
          {/* 구직자 서비스 */}
          <Link href="/seeker/login">
            <div className="bg-white rounded-3xl shadow-card p-6 border-2 border-transparent hover:border-brand-mint transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-brand-mint/10 rounded-full flex items-center justify-center group-hover:bg-brand-mint/20 transition-colors">
                  <User className="w-8 h-8 text-brand-mint" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-text-primary mb-1">구직자</h2>
                  <p className="text-sm text-text-secondary">
                    AI 매칭으로 나에게 맞는 병원 찾기
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-brand-mint opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="mt-4 pt-4 border-t border-border-light">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-brand-mint/10 text-brand-mint text-xs rounded-full">
                    AI 성향 진단
                  </span>
                  <span className="px-3 py-1 bg-brand-mint/10 text-brand-mint text-xs rounded-full">
                    맞춤 병원 추천
                  </span>
                  <span className="px-3 py-1 bg-brand-mint/10 text-brand-mint text-xs rounded-full">
                    AI 면접 연습
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* 구인처 서비스 */}
          <Link href="/employer/login">
            <div className="bg-white rounded-3xl shadow-card p-6 border-2 border-transparent hover:border-expert-navy transition-colors cursor-pointer group">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-expert-navy/10 rounded-full flex items-center justify-center group-hover:bg-expert-navy/20 transition-colors">
                  <Building2 className="w-8 h-8 text-expert-navy" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-text-primary mb-1">병원 / 의원</h2>
                  <p className="text-sm text-text-secondary">
                    우수 인재를 AI로 빠르게 채용
                  </p>
                </div>
                <ArrowRight className="w-6 h-6 text-expert-navy opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="mt-4 pt-4 border-t border-border-light">
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-expert-navy/10 text-expert-navy text-xs rounded-full">
                    AI 인재 매칭
                  </span>
                  <span className="px-3 py-1 bg-expert-navy/10 text-expert-navy text-xs rounded-full">
                    AI 면접 대행
                  </span>
                  <span className="px-3 py-1 bg-expert-navy/10 text-expert-navy text-xs rounded-full">
                    브랜딩 콘텐츠
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* 데모 안내 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="max-w-md mx-auto mt-8"
        >
          <div className="bg-gradient-to-r from-brand-mint/5 to-expert-navy/5 border border-border-light rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-text-secondary">
                  <strong className="text-text-primary">데모 모드</strong>: 아무 값이나 입력해도 로그인됩니다.
                  <br />
                  두 서비스를 자유롭게 체험해 보세요!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center text-xs text-text-tertiary">
        © 2024 MediInside. All rights reserved.
      </div>
    </div>
  );
}
