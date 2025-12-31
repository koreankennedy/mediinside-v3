'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Building2, Lock, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function EmployerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 목업이므로 아무 입력이나 로그인 허용
    setTimeout(() => {
      localStorage.setItem('employer_logged_in', 'true');
      router.push('/employer/home');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-expert-navy/5 to-white flex flex-col">
      {/* Header */}
      <div className="pt-16 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-brand-mint">Medi</span>
            <span className="text-expert-navy">Inside</span>
          </h1>
          <p className="text-text-secondary">의료기관을 위한 스마트 채용</p>
        </motion.div>
      </div>

      {/* Login Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex-1 px-6"
      >
        <div className="bg-white rounded-3xl shadow-card p-6 max-w-md mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-expert-navy/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-expert-navy" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">구인처 로그인</h2>
            <p className="text-sm text-text-secondary mt-1">
              우수한 인재를 만나보세요
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-2">
                이메일
              </label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="병원 이메일을 입력하세요"
                  className="w-full pl-12 pr-4 py-3 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-expert-navy/50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-text-secondary block mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="비밀번호를 입력하세요"
                  className="w-full pl-12 pr-4 py-3 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-expert-navy/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-expert-navy text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-expert-navy/90 transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  로그인
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-tertiary">
              계정이 없으신가요?{' '}
              <button className="text-expert-navy font-medium">병원 등록하기</button>
            </p>
          </div>

          {/* 데모 안내 */}
          <div className="mt-6 bg-expert-navy/5 border border-expert-navy/10 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-expert-navy flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-text-secondary">
                  <strong className="text-expert-navy">데모 모드</strong>: 아무 값이나 입력해도 로그인됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 구직자 로그인 링크 */}
        <div className="text-center mt-6">
          <Link href="/seeker/login">
            <span className="text-sm text-text-tertiary">
              구직자이신가요?{' '}
              <span className="text-brand-mint font-medium">구직자 로그인</span>
            </span>
          </Link>
        </div>
      </motion.div>

      {/* Footer */}
      <div className="py-6 text-center text-xs text-text-tertiary">
        © 2024 MediInside. All rights reserved.
      </div>
    </div>
  );
}
