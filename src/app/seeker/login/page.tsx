'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { User, Lock, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SeekerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 목업이므로 아무 입력이나 로그인 허용
    setTimeout(() => {
      localStorage.setItem('seeker_logged_in', 'true');
      router.push('/seeker/home');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-mint/10 to-white flex flex-col">
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
          <p className="text-text-secondary">구직자를 위한 스마트 매칭</p>
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
            <div className="w-16 h-16 bg-brand-mint/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-brand-mint" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">구직자 로그인</h2>
            <p className="text-sm text-text-secondary mt-1">
              나에게 맞는 병원을 찾아보세요
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-text-secondary block mb-2">
                이메일
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일을 입력하세요"
                  className="w-full pl-12 pr-4 py-3 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-mint/50"
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
                  className="w-full pl-12 pr-4 py-3 bg-bg-secondary rounded-xl text-text-primary placeholder:text-text-tertiary focus:outline-none focus:ring-2 focus:ring-brand-mint/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-mint text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-brand-mint-dark transition-colors disabled:opacity-70"
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
              <button className="text-brand-mint font-medium">회원가입</button>
            </p>
          </div>

          {/* 데모 안내 */}
          <div className="mt-6 bg-brand-mint/5 border border-brand-mint/20 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-text-secondary">
                  <strong className="text-brand-mint">데모 모드</strong>: 아무 값이나 입력해도 로그인됩니다.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 구인처 로그인 링크 */}
        <div className="text-center mt-6">
          <Link href="/employer/login">
            <span className="text-sm text-text-tertiary">
              병원/의원이신가요?{' '}
              <span className="text-expert-navy font-medium">구인처 로그인</span>
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
