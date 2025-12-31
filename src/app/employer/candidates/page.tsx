'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Search,
  SlidersHorizontal,
  Users,
  Star,
  Sparkles,
  Heart,
  MessageCircle,
  Send,
  X,
  ChevronDown,
  MapPin,
  Briefcase,
  DollarSign,
  TrendingUp,
  Target,
  Shield,
  Clock,
  Award,
  Phone,
} from 'lucide-react';
import { mockCandidates } from '@/lib/mock/data';

const fitTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  high_end_achiever: TrendingUp,
  practical_expert: Target,
  self_actualizer: Star,
  trust_centered_expert: Shield,
};

const fitTypeColors: Record<string, string> = {
  high_end_achiever: 'text-match-gold',
  practical_expert: 'text-info',
  self_actualizer: 'text-error',
  trust_centered_expert: 'text-success',
};

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<typeof mockCandidates[0] | null>(null);
  const [likedCandidates, setLikedCandidates] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'matchScore' | 'experience' | 'recent'>('matchScore');

  // 필터링 및 정렬
  const filteredCandidates = mockCandidates
    .filter((c) => {
      if (!searchQuery) return true;
      return (
        c.name.includes(searchQuery) ||
        c.skills.some((s) => s.includes(searchQuery)) ||
        c.licenseType.includes(searchQuery)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'matchScore') return b.matchScore - a.matchScore;
      if (sortBy === 'experience') return parseInt(b.experience) - parseInt(a.experience);
      return 0;
    });

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedCandidates((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-dashboard-title">인재 탐색</h1>
        <p className="text-sm text-text-secondary mt-1">
          우리 병원과 잘 맞는 인재를 찾아보세요
        </p>
      </div>

      {/* 검색 */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="이름, 술기, 면허 검색..."
          className="w-full pl-12 pr-12 py-3 bg-white rounded-xl border border-border-light focus:outline-none focus:border-expert-navy text-sm"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-colors ${
            showFilters ? 'bg-expert-navy text-white' : 'text-text-tertiary hover:bg-bg-secondary'
          }`}
        >
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* 필터 패널 */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-2xl p-4 border border-border-light mb-4 overflow-hidden"
          >
            <div className="space-y-4">
              <div>
                <label className="text-label block mb-2">정렬</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: 'matchScore', label: '매칭점수순' },
                    { value: 'experience', label: '경력순' },
                    { value: 'recent', label: '최신순' },
                  ].map((sort) => (
                    <button
                      key={sort.value}
                      onClick={() => setSortBy(sort.value as typeof sortBy)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                        sortBy === sort.value
                          ? 'bg-expert-navy text-white'
                          : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                      }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-label block mb-2">면허 종류</label>
                <div className="flex gap-2">
                  {['전체', '간호사', '간호조무사'].map((license) => (
                    <button
                      key={license}
                      className="px-3 py-1.5 text-sm bg-bg-secondary rounded-lg text-text-secondary hover:bg-bg-tertiary"
                    >
                      {license}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-label block mb-2">성향 유형</label>
                <div className="flex gap-2 flex-wrap">
                  {['하이엔드', '실리적', '자아실현', '신뢰중심'].map((type) => (
                    <button
                      key={type}
                      className="px-3 py-1.5 text-sm bg-bg-secondary rounded-lg text-text-secondary hover:bg-bg-tertiary"
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 결과 수 */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-text-secondary">
          총 <strong className="text-expert-navy">{filteredCandidates.length}명</strong>의 후보자
        </span>
        <span className="text-xs text-text-tertiary">
          평균 매칭 87%
        </span>
      </div>

      {/* 후보자 리스트 */}
      <div className="space-y-4">
        {filteredCandidates.map((candidate, index) => {
          const FitIcon = fitTypeIcons[candidate.fitType] || Star;
          const fitColor = fitTypeColors[candidate.fitType] || 'text-brand-mint';

          return (
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedCandidate(candidate)}
              className={`bg-white rounded-2xl p-4 border-2 cursor-pointer transition-all hover:shadow-card ${
                candidate.isNew ? 'border-brand-mint' : 'border-border-light'
              }`}
            >
              {/* 배지 */}
              <div className="flex gap-2 mb-3">
                {candidate.isNew && (
                  <span className="badge-success">NEW</span>
                )}
                {candidate.hasColleagueFit && (
                  <span className="badge-base bg-brand-mint/10 text-brand-mint">
                    <Sparkles className="w-3 h-3 mr-1" />
                    성향 FIT
                  </span>
                )}
              </div>

              {/* 기본 정보 */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-expert-navy/10 rounded-full flex items-center justify-center">
                    <Users className="w-7 h-7 text-expert-navy" />
                  </div>
                  <div>
                    <div className="font-semibold text-text-primary text-lg">
                      {candidate.name}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {candidate.licenseType} · {candidate.experience}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-text-tertiary mt-1">
                      <MapPin className="w-3 h-3" />
                      {candidate.region}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-brand-mint">
                    {candidate.matchScore}%
                  </div>
                  <div className="text-xs text-text-tertiary">매칭</div>
                </div>
              </div>

              {/* 성향 */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg bg-bg-secondary ${fitColor}`}>
                  <FitIcon className="w-3 h-3" />
                  <span className="text-xs font-medium">{candidate.fitTypeLabel}</span>
                </div>
                <span className="text-xs text-text-tertiary">
                  희망 {candidate.desiredSalary}
                </span>
              </div>

              {/* 술기 */}
              <div className="flex flex-wrap gap-1 mb-3">
                {candidate.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs bg-bg-secondary text-text-secondary px-2 py-1 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* 액션 버튼 */}
              <div className="flex gap-2 pt-3 border-t border-border-light">
                <button
                  onClick={(e) => handleLike(candidate.id, e)}
                  className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm rounded-lg transition-colors ${
                    likedCandidates.includes(candidate.id)
                      ? 'bg-error/10 text-error'
                      : 'text-text-secondary hover:bg-bg-secondary'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedCandidates.includes(candidate.id) ? 'fill-error' : ''}`} />
                  관심
                </button>
                <Link href={`/employer/concierge?candidate=${candidate.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                  <button className="w-full flex items-center justify-center gap-1 py-2 text-sm text-text-secondary hover:bg-bg-secondary rounded-lg transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    질문하기
                  </button>
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    alert(`${candidate.name}님에게 제안을 보냈습니다!`);
                  }}
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-expert-navy text-white rounded-lg hover:bg-expert-navy/90 transition-colors"
                >
                  <Send className="w-4 h-4" />
                  제안
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* 후보자 상세 바텀시트 */}
      <AnimatePresence>
        {selectedCandidate && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCandidate(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 pb-8">
                <div className="w-12 h-1.5 bg-bg-tertiary rounded-full mx-auto mb-4" />

                {/* 헤더 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-expert-navy/10 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-expert-navy" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-expert-navy">
                        {selectedCandidate.name}
                      </div>
                      <div className="text-sm text-text-secondary">
                        {selectedCandidate.licenseType} · {selectedCandidate.experience}
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-mint">
                      {selectedCandidate.matchScore}%
                    </div>
                    <div className="text-xs text-text-tertiary">매칭 점수</div>
                  </div>
                </div>

                {/* 성향 분석 */}
                <div className="bg-brand-mint/5 rounded-xl p-4 mb-4 border border-brand-mint/20">
                  <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-brand-mint" />
                    성향 분석
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-lg font-bold ${fitTypeColors[selectedCandidate.fitType]}`}>
                      {selectedCandidate.fitTypeLabel}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {selectedCandidate.fitType === 'high_end_achiever' &&
                      '성과와 보상을 중시하는 유형입니다. 인센티브 제도와 성장 기회를 강조하면 좋아요.'}
                    {selectedCandidate.fitType === 'practical_expert' &&
                      '급여와 워라밸을 중시하는 유형입니다. 안정적인 근무환경을 강조하면 좋아요.'}
                    {selectedCandidate.fitType === 'self_actualizer' &&
                      '성장과 자기계발을 중시하는 유형입니다. 교육 기회와 커리어 발전을 강조하면 좋아요.'}
                    {selectedCandidate.fitType === 'trust_centered_expert' &&
                      '동료와의 관계를 중시하는 유형입니다. 팀 분위기와 협력 문화를 강조하면 좋아요.'}
                  </p>
                  {selectedCandidate.hasColleagueFit && (
                    <div className="mt-2 text-xs text-brand-mint">
                      현재 우리 병원에 비슷한 성향의 직원이 있어요!
                    </div>
                  )}
                </div>

                {/* 매칭 상세 */}
                <div className="bg-bg-secondary rounded-xl p-4 mb-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">매칭 점수 상세</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: '경력 적합도', score: 92 },
                      { label: '술기 일치', score: 88 },
                      { label: '성향 일치', score: 95 },
                      { label: '급여 조건', score: 85 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{item.label}</span>
                        <span className="text-sm font-semibold text-expert-navy">{item.score}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 상세 정보 */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">상세 정보</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Briefcase className="w-4 h-4" />
                        <span className="text-sm">현 직장</span>
                      </div>
                      <span className="font-medium text-text-primary">{selectedCandidate.currentHospital}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">경력</span>
                      </div>
                      <span className="font-medium text-text-primary">{selectedCandidate.experience}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">희망 급여</span>
                      </div>
                      <span className="font-medium text-text-primary">{selectedCandidate.desiredSalary}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">희망 지역</span>
                      </div>
                      <span className="font-medium text-text-primary">{selectedCandidate.region}</span>
                    </div>
                  </div>
                </div>

                {/* 보유 술기 */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">보유 술기</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-brand-mint/10 text-brand-mint rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="space-y-3 mt-6">
                  <button
                    onClick={() => {
                      alert(`${selectedCandidate.name}님에게 채용 제안을 보냈습니다!`);
                      setSelectedCandidate(null);
                    }}
                    className="btn-primary w-full bg-expert-navy hover:bg-expert-navy/90"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    채용 제안 보내기
                  </button>
                  <Link href={`/employer/concierge?candidate=${selectedCandidate.id}`}>
                    <button className="btn-outline w-full">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      AI에게 이 후보자 질문하기
                    </button>
                  </Link>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setLikedCandidates((prev) =>
                          prev.includes(selectedCandidate.id)
                            ? prev
                            : [...prev, selectedCandidate.id]
                        );
                        setSelectedCandidate(null);
                      }}
                      className="flex-1 py-2.5 rounded-xl border border-border-light text-text-secondary hover:border-error hover:text-error font-medium transition-all flex items-center justify-center gap-1"
                    >
                      <Heart className={`w-4 h-4 ${likedCandidates.includes(selectedCandidate.id) ? 'fill-error text-error' : ''}`} />
                      관심 등록
                    </button>
                    <button
                      onClick={() => setSelectedCandidate(null)}
                      className="flex-1 py-2.5 rounded-xl border border-border-light text-text-secondary hover:bg-bg-secondary font-medium transition-all"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
