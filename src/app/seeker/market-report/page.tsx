'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  MapPin,
  Building2,
  DollarSign,
  Users,
  Calendar,
  Sparkles,
  ChevronRight,
  Star,
  Award,
  Target,
  Briefcase,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

// 사용자 유형 정보
const userType = {
  type: 'achiever',
  typeName: '하이엔드 성과자',
  typeIcon: '🏆',
  description: '성과와 보상이 명확한 환경에서 뛰어난 성과를 내는 유형',
};

// 시장 트렌드 데이터
const marketTrends = {
  salaryTrend: {
    current: 420,
    previous: 385,
    change: '+9.1%',
    trend: 'up',
  },
  demandTrend: {
    current: 156,
    previous: 132,
    change: '+18.2%',
    trend: 'up',
  },
  competitionTrend: {
    current: 2.3,
    previous: 2.8,
    change: '-17.9%',
    trend: 'down',
    description: '경쟁이 낮아지고 있어요',
  },
};

// 지역별 채용 현황
const regionalData = [
  { region: '강남/서초', jobs: 45, avgSalary: 450, trend: 'up' },
  { region: '송파/강동', jobs: 28, avgSalary: 420, trend: 'up' },
  { region: '강서/영등포', jobs: 22, avgSalary: 380, trend: 'stable' },
  { region: '성북/동대문', jobs: 15, avgSalary: 360, trend: 'down' },
];

// 분과별 수요
const departmentDemand = [
  { name: '피부과', demand: 85, growth: '+12%' },
  { name: '성형외과', demand: 72, growth: '+8%' },
  { name: '안과', demand: 45, growth: '+5%' },
  { name: '치과', demand: 38, growth: '+3%' },
];

// 유형별 매칭 통계
const typeMatchStats = {
  topHospitals: [
    { name: '인센티브 제도 병원', matchRate: 92 },
    { name: '성과급 체계 병원', matchRate: 88 },
    { name: '경력 성장 기회', matchRate: 85 },
  ],
  avgMatchScore: 87,
  successRate: 78,
  avgDaysToMatch: 12,
};

// 추천 행동
const recommendedActions = [
  {
    title: '프로필 100% 완성하기',
    description: '완성도가 높을수록 노출수 2배 증가',
    impact: '+200%',
    href: '/seeker/profile/edit',
  },
  {
    title: '희망 조건 상세 설정',
    description: '정확한 조건 매칭으로 적합도 향상',
    impact: '+35%',
    href: '/seeker/profile/edit',
  },
  {
    title: '강남 지역 공고 확인',
    description: '회원님 유형에 가장 적합한 지역',
    impact: '최적',
    href: '/seeker/matching-center',
  },
];

export default function MarketReportPage() {
  const router = useRouter();
  const [selectedRegion, setSelectedRegion] = useState('강남/서초');

  return (
    <div className="min-h-screen bg-bg-secondary pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border-light px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-expert-navy">나를 위한 시장 리포트</h1>
            <p className="text-xs text-text-secondary">2024년 12월 기준</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-6">
        {/* 사용자 유형 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-brand-mint to-brand-mint-dark rounded-2xl p-5 text-white"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">{userType.typeIcon}</span>
            <div>
              <div className="text-sm text-white/70">나의 커리어 유형</div>
              <div className="text-xl font-bold">{userType.typeName}</div>
            </div>
          </div>
          <p className="text-sm text-white/90 mb-4">{userType.description}</p>
          <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/20">
            <div className="text-center">
              <div className="text-2xl font-bold">{typeMatchStats.avgMatchScore}%</div>
              <div className="text-xs text-white/70">평균 매칭률</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{typeMatchStats.successRate}%</div>
              <div className="text-xs text-white/70">채용 성공률</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{typeMatchStats.avgDaysToMatch}일</div>
              <div className="text-xs text-white/70">평균 매칭기간</div>
            </div>
          </div>
        </motion.div>

        {/* 시장 트렌드 */}
        <section>
          <h2 className="text-section-title mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-expert-navy" />
            시장 트렌드
          </h2>
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-4 border border-border-light"
            >
              <div className="flex items-center gap-1 mb-1">
                <DollarSign className="w-4 h-4 text-match-gold" />
                <span className="text-xs text-text-secondary">평균 연봉</span>
              </div>
              <div className="text-xl font-bold text-text-primary">{marketTrends.salaryTrend.current}만</div>
              <div className="flex items-center gap-1 text-xs text-success">
                <TrendingUp className="w-3 h-3" />
                {marketTrends.salaryTrend.change}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl p-4 border border-border-light"
            >
              <div className="flex items-center gap-1 mb-1">
                <Briefcase className="w-4 h-4 text-brand-mint" />
                <span className="text-xs text-text-secondary">채용 수요</span>
              </div>
              <div className="text-xl font-bold text-text-primary">{marketTrends.demandTrend.current}건</div>
              <div className="flex items-center gap-1 text-xs text-success">
                <TrendingUp className="w-3 h-3" />
                {marketTrends.demandTrend.change}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-4 border border-border-light"
            >
              <div className="flex items-center gap-1 mb-1">
                <Users className="w-4 h-4 text-info" />
                <span className="text-xs text-text-secondary">경쟁률</span>
              </div>
              <div className="text-xl font-bold text-text-primary">{marketTrends.competitionTrend.current}:1</div>
              <div className="flex items-center gap-1 text-xs text-success">
                <TrendingDown className="w-3 h-3" />
                {marketTrends.competitionTrend.change}
              </div>
            </motion.div>
          </div>
          <div className="mt-3 bg-success/10 rounded-xl p-3 border border-success/20">
            <div className="flex items-center gap-2 text-sm text-success">
              <Sparkles className="w-4 h-4" />
              <span>지금이 이직하기 좋은 시기예요! 수요는 높고 경쟁은 낮아졌어요.</span>
            </div>
          </div>
        </section>

        {/* 지역별 채용 현황 */}
        <section>
          <h2 className="text-section-title mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-mint" />
            지역별 채용 현황
          </h2>
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <div className="space-y-3">
              {regionalData.map((region, index) => (
                <motion.div
                  key={region.region}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setSelectedRegion(region.region)}
                  className={`p-3 rounded-xl cursor-pointer transition-all ${
                    selectedRegion === region.region
                      ? 'bg-brand-mint/10 border border-brand-mint'
                      : 'bg-bg-secondary hover:bg-bg-tertiary'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        region.trend === 'up' ? 'bg-success' :
                        region.trend === 'down' ? 'bg-error' : 'bg-warning'
                      }`} />
                      <span className="font-medium text-text-primary">{region.region}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-brand-mint">{region.jobs}건</div>
                      <div className="text-xs text-text-secondary">평균 {region.avgSalary}만</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border-light">
              <p className="text-xs text-text-secondary">
                <Star className="w-3 h-3 text-match-gold inline mr-1" />
                회원님 유형에 가장 적합한 지역: <strong className="text-brand-mint">강남/서초</strong>
              </p>
            </div>
          </div>
        </section>

        {/* 분과별 수요 */}
        <section>
          <h2 className="text-section-title mb-3 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-expert-navy" />
            분과별 채용 수요
          </h2>
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <div className="space-y-4">
              {departmentDemand.map((dept, index) => (
                <div key={dept.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-text-primary">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-success">{dept.growth}</span>
                      <span className="text-sm font-bold text-expert-navy">{dept.demand}건</span>
                    </div>
                  </div>
                  <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${dept.demand}%` }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      className="h-full bg-gradient-to-r from-brand-mint to-expert-navy rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 유형별 추천 병원 */}
        <section>
          <h2 className="text-section-title mb-3 flex items-center gap-2">
            <Target className="w-5 h-5 text-match-gold" />
            {userType.typeName}에게 맞는 병원
          </h2>
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <div className="space-y-3">
              {typeMatchStats.topHospitals.map((hospital, index) => (
                <div key={hospital.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-match-gold/10 rounded-lg flex items-center justify-center">
                      <Award className="w-4 h-4 text-match-gold" />
                    </div>
                    <span className="text-sm text-text-primary">{hospital.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-brand-mint">{hospital.matchRate}%</span>
                    <span className="text-xs text-text-tertiary">매칭</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 추천 행동 */}
        <section>
          <h2 className="text-section-title mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-mint" />
            지금 해보면 좋은 것
          </h2>
          <div className="space-y-3">
            {recommendedActions.map((action, index) => (
              <Link key={action.title} href={action.href}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl p-4 border border-border-light hover:border-brand-mint hover:shadow-card transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-text-primary">{action.title}</div>
                      <div className="text-sm text-text-secondary">{action.description}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-brand-mint">{action.impact}</span>
                      <ChevronRight className="w-4 h-4 text-text-tertiary" />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>

        {/* 매칭센터 CTA */}
        <div className="bg-expert-navy/5 rounded-2xl p-4 border border-expert-navy/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-expert-navy rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-semibold text-expert-navy">지금 바로 매칭 시작하기</div>
              <div className="text-sm text-text-secondary">
                회원님에게 맞는 {marketTrends.demandTrend.current}개의 공고가 기다리고 있어요
              </div>
            </div>
          </div>
          <Link href="/seeker/matching-center">
            <button className="w-full bg-expert-navy text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">
              매칭센터 바로가기
              <ChevronRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
