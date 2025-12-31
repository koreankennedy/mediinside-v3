'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  MapPin,
  Building2,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Clock,
  Users,
  Lock,
  FileText,
  Briefcase,
  Bell,
  Zap,
  Eye,
  Heart,
  Calendar,
  Star,
  BarChart3,
  Edit3,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Phone,
  Send,
  Share2,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { mockRecruitmentActivity } from '@/lib/mock/data';

// Mock data for offers (피부과/성형외과 기반)
const mockOffers = [
  { id: 1, hospital: '청담리더스피부과', salary: '400~450만', matchScore: 94, department: '피부과' },
  { id: 2, hospital: '압구정미래성형외과', salary: '420~500만', matchScore: 91, department: '성형외과' },
  { id: 3, hospital: '신사동베스트피부과', salary: '380~420만', matchScore: 88, department: '피부과' },
];

// 관심 병원 목록
const interestedHospitals = [
  {
    id: 1,
    name: '청담리더스피부과',
    department: '피부과',
    matchScore: 94,
    isRecruiting: true,
    lastActivity: '채용공고 업데이트',
    lastActivityTime: '2시간 전',
  },
  {
    id: 2,
    name: '압구정미래성형외과',
    department: '성형외과',
    matchScore: 91,
    isRecruiting: true,
    lastActivity: '새 공고 등록',
    lastActivityTime: '1일 전',
  },
  {
    id: 3,
    name: '강남센트럴피부과',
    department: '피부과',
    matchScore: 85,
    isRecruiting: false,
    lastActivity: '채용 마감',
    lastActivityTime: '3일 전',
  },
];

// 채용 현황 상세 데이터
const recruitmentStatus = {
  proposed: [
    { hospital: '청담리더스피부과', date: '2일 전', status: '검토 대기', urgent: true },
    { hospital: '압구정미래성형외과', date: '5일 전', status: '검토 대기', urgent: false },
  ],
  negotiating: [
    { hospital: '신사동베스트피부과', date: '진행중', status: '급여 협상 중', nextStep: '조건 회신 필요' },
  ],
  interview: [],
};

// 프로필 완성도 항목
const profileCompletionItems = [
  { label: '기본 정보', completed: true },
  { label: '경력 사항', completed: true },
  { label: '보유 술기', completed: true },
  { label: '희망 근무조건', completed: false },
  { label: '자기소개서', completed: false },
];

export default function SeekerHomePage() {
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedLicense, setSelectedLicense] = useState('');
  const [potentialCount, setPotentialCount] = useState(0);
  const [showPotential, setShowPotential] = useState(false);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentActivityIndex((prev) =>
        (prev + 1) % mockRecruitmentActivity.recentActivity.length
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleOnboardingComplete = () => {
    if (selectedRegion && selectedLicense) {
      setPotentialCount(0);
      setShowPotential(true);
      const target = selectedRegion === '서울' ? 58 : selectedRegion === '경기' ? 42 : 25;
      let current = 0;
      const interval = setInterval(() => {
        current += 1;
        setPotentialCount(current);
        if (current >= target) clearInterval(interval);
      }, 25);
    }
  };

  return (
    <div className="px-4 py-6">
      {/* 모드 토글 (개발용) */}
      <div className="mb-4 flex items-center justify-end">
        <button
          onClick={() => setIsFirstVisit(!isFirstVisit)}
          className="text-xs text-text-tertiary bg-bg-tertiary px-3 py-1 rounded-full"
        >
          {isFirstVisit ? '→ 재방문 모드로 전환' : '→ 최초방문 모드로 전환'}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {isFirstVisit ? (
          <FirstVisitMode
            key="first-visit"
            selectedRegion={selectedRegion}
            setSelectedRegion={setSelectedRegion}
            selectedLicense={selectedLicense}
            setSelectedLicense={setSelectedLicense}
            potentialCount={potentialCount}
            showPotential={showPotential}
            onOnboardingComplete={handleOnboardingComplete}
            currentActivityIndex={currentActivityIndex}
          />
        ) : (
          <DashboardMode key="dashboard" currentActivityIndex={currentActivityIndex} />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// 최초 방문 모드 (Hook Mode)
// ============================================
function FirstVisitMode({
  selectedRegion,
  setSelectedRegion,
  selectedLicense,
  setSelectedLicense,
  potentialCount,
  showPotential,
  onOnboardingComplete,
  currentActivityIndex,
}: {
  selectedRegion: string;
  setSelectedRegion: (v: string) => void;
  selectedLicense: string;
  setSelectedLicense: (v: string) => void;
  potentialCount: number;
  showPotential: boolean;
  onOnboardingComplete: () => void;
  currentActivityIndex: number;
}) {
  const activity = mockRecruitmentActivity;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* S1-H1: 실시간 채용 활동 지표 */}
      <section>
        <h2 className="text-section-title mb-3 flex items-center gap-2">
          <Zap className="w-5 h-5 text-brand-mint" />
          실시간 채용 현황
        </h2>

        {/* 실시간 활동 피드 */}
        <div className="bg-expert-navy rounded-xl px-4 py-3 text-white text-sm flex items-center gap-2 mb-3">
          <Bell className="w-4 h-4 text-match-gold animate-pulse" />
          <AnimatePresence mode="wait">
            <motion.span
              key={currentActivityIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {activity.recentActivity[currentActivityIndex].message}
              <span className="text-white/60 ml-2">{activity.recentActivity[currentActivityIndex].time}</span>
            </motion.span>
          </AnimatePresence>
        </div>

        {/* 오늘의 채용 활동 카드 */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-brand-mint" />
              <span className="text-xs text-text-secondary">오늘 새 공고</span>
            </div>
            <div className="text-2xl font-bold text-expert-navy">
              {activity.today.newJobPostings}건
            </div>
            <div className="text-xs text-success mt-1">
              +12% vs 어제
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-info" />
              <span className="text-xs text-text-secondary">프로필 업데이트</span>
            </div>
            <div className="text-2xl font-bold text-expert-navy">
              {activity.today.profileUpdates}명
            </div>
            <div className="text-xs text-text-tertiary mt-1">
              지금 활발히 구직 중
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-match-gold" />
              <span className="text-xs text-text-secondary">오늘 매칭 성사</span>
            </div>
            <div className="text-2xl font-bold text-expert-navy">
              {activity.today.matchesCreated}건
            </div>
            <div className="text-xs text-text-tertiary mt-1">
              평균 응답 {activity.trending.avgResponseTime}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-4 h-4 text-success" />
              <span className="text-xs text-text-secondary">오퍼 수락</span>
            </div>
            <div className="text-2xl font-bold text-expert-navy">
              {activity.today.offersAccepted}건
            </div>
            <div className="text-xs text-text-tertiary mt-1">
              오늘 채용 확정
            </div>
          </motion.div>
        </div>

        {/* 인기 분과 */}
        <div className="nudge-box mt-3">
          <TrendingUp className="w-4 h-4 text-brand-mint inline mr-2" />
          지금 <strong>{activity.trending.hotDepartments.join(', ')}</strong>에서 채용이 가장 활발해요!
        </div>
      </section>

      {/* S1-H5: 간편 온보딩 입력 */}
      <section className="bg-white rounded-2xl p-5 border border-border-light">
        <h3 className="text-card-title mb-4">10초만 투자하면 맞춤 정보를 볼 수 있어요</h3>

        <div className="space-y-4">
          <div>
            <label className="text-label block mb-2">면허 종류</label>
            <input
              type="text"
              value={selectedLicense}
              onChange={(e) => setSelectedLicense(e.target.value)}
              placeholder="예: 간호사, 치과위생사, 방사선사, 임상병리사..."
              className="w-full px-4 py-3 rounded-xl border border-border-light bg-white text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-mint focus:ring-1 focus:ring-brand-mint transition-all"
            />
            <p className="text-xs text-text-tertiary mt-1.5">보유하신 면허를 입력해주세요</p>
          </div>

          <div>
            <label className="text-label block mb-2">희망 지역</label>
            <div className="flex gap-2 flex-wrap">
              {['서울', '경기', '부산', '대구', '인천'].map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedRegion === region
                      ? 'bg-brand-mint text-white'
                      : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={onOnboardingComplete}
            disabled={!selectedRegion || !selectedLicense}
            className="btn-primary w-full disabled:opacity-50"
          >
            맞춤 정보 확인하기
          </button>
        </div>
      </section>

      {/* S1-H2: 잠재 매칭 프리뷰 */}
      {showPotential && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-brand-mint to-brand-mint-light rounded-2xl p-6 text-white"
        >
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5" />
            <span className="font-medium">잠재 매칭 프리뷰</span>
          </div>
          <div className="text-4xl font-bold mb-1">
            {potentialCount}곳
          </div>
          <p className="text-white/90">
            {selectedRegion}에서 {selectedLicense}를 기다리는 병원이에요!
          </p>
        </motion.section>
      )}

      {/* S1-H3: 노동 강도 맵 (간소화 버전) */}
      {showPotential && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-section-title mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-mint" />
            노동 강도 맵
          </h2>
          <div className="bg-white rounded-2xl p-4 border border-border-light">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="text-center p-3 bg-intensity-safe/10 rounded-xl">
                <div className="text-2xl font-bold text-intensity-safe">18</div>
                <div className="text-xs text-text-secondary">여유</div>
              </div>
              <div className="text-center p-3 bg-warning/10 rounded-xl">
                <div className="text-2xl font-bold text-warning">12</div>
                <div className="text-xs text-text-secondary">보통</div>
              </div>
              <div className="text-center p-3 bg-intensity-high/10 rounded-xl">
                <div className="text-2xl font-bold text-intensity-high">5</div>
                <div className="text-xs text-text-secondary">바쁨</div>
              </div>
            </div>
            <div className="nudge-box-highlight">
              일은 편하고 급여는 높은 <strong>&apos;꿀매물&apos;</strong>만 골라 드릴까요?
            </div>
          </div>
        </motion.section>
      )}

      {/* S1-H4: 블러 오퍼 티저 */}
      <section>
        <h2 className="text-section-title mb-3">지금 받을 수 있는 오퍼</h2>
        <div className="space-y-3">
          {mockOffers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-white rounded-2xl p-4 border border-border-light overflow-hidden"
            >
              {/* Blur overlay */}
              <div className="absolute inset-0 backdrop-blur-md bg-white/70 z-10 flex flex-col items-center justify-center">
                <Lock className="w-6 h-6 text-text-tertiary mb-2" />
                <span className="text-sm text-text-secondary">간단 진단 후 확인 가능</span>
              </div>

              {/* Blurred content */}
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-text-primary">{offer.hospital}</div>
                  <div className="text-sm text-text-secondary">{offer.department} · {offer.salary}</div>
                </div>
                <div className="badge-success">{offer.matchScore}% 일치</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 1분 간단 진단 버튼 */}
        <Link href="/seeker/quick-fit-test">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full mt-4"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            딱 1분! 간단 진단하고 오퍼 확인하기
          </motion.button>
        </Link>

        {/* 25문항 정밀 진단 링크 */}
        <Link href="/seeker/fit-test">
          <button className="w-full mt-2 text-sm text-brand-mint py-2 flex items-center justify-center">
            더 정확한 25문항 정밀 진단 받기
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </Link>
      </section>
    </motion.div>
  );
}

// ============================================
// 재방문 모드 (Dashboard Mode) - 확장된 버전
// ============================================
function DashboardMode({ currentActivityIndex }: { currentActivityIndex: number }) {
  const activity = mockRecruitmentActivity;
  const [showAllInterested, setShowAllInterested] = useState(false);
  const completedCount = profileCompletionItems.filter(item => item.completed).length;
  const completionPercent = Math.round((completedCount / profileCompletionItems.length) * 100);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* 실시간 활동 피드 */}
      <div className="bg-expert-navy rounded-xl px-4 py-3 text-white text-sm flex items-center gap-2">
        <Bell className="w-4 h-4 text-match-gold animate-pulse" />
        <AnimatePresence mode="wait">
          <motion.span
            key={currentActivityIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {activity.recentActivity[currentActivityIndex].message}
            <span className="text-white/60 ml-2">{activity.recentActivity[currentActivityIndex].time}</span>
          </motion.span>
        </AnimatePresence>
      </div>

      {/* 프로필 노출수 + 관심표시 카드 */}
      <section className="bg-gradient-to-r from-brand-mint to-brand-mint-dark rounded-2xl p-5 text-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            <span className="font-medium">오늘의 프로필 활동</span>
          </div>
          <span className="text-xs text-white/70">최근 7일</span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-3xl font-bold">127</div>
            <div className="text-sm text-white/80">프로필 노출</div>
          </div>
          <div>
            <div className="text-3xl font-bold">23</div>
            <div className="text-sm text-white/80">상세 조회</div>
          </div>
          <div>
            <div className="text-3xl font-bold">5</div>
            <div className="text-sm text-white/80">관심 표시</div>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-white/20">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>지난주 대비 노출수 <strong>+18%</strong> 증가</span>
          </div>
        </div>
      </section>

      {/* 내 채용 현황 - 확장된 버전 */}
      <section>
        <h2 className="text-section-title mb-3">내 채용 현황</h2>
        <div className="grid grid-cols-3 gap-3 mb-3">
          <Link href="/seeker/matching-center?tab=proposed">
            <div className="bg-white rounded-2xl p-4 border border-border-light hover:border-brand-mint transition-colors">
              <div className="text-3xl font-bold text-brand-mint">{recruitmentStatus.proposed.length}</div>
              <div className="text-sm text-text-secondary">제안받음</div>
            </div>
          </Link>
          <Link href="/seeker/matching-center?tab=negotiating">
            <div className="bg-white rounded-2xl p-4 border border-border-light hover:border-brand-mint transition-colors">
              <div className="text-3xl font-bold text-warning">{recruitmentStatus.negotiating.length}</div>
              <div className="text-sm text-text-secondary">협상 중</div>
            </div>
          </Link>
          <Link href="/seeker/matching-center?tab=interview">
            <div className="bg-white rounded-2xl p-4 border border-border-light hover:border-brand-mint transition-colors">
              <div className="text-3xl font-bold text-info">{recruitmentStatus.interview.length}</div>
              <div className="text-sm text-text-secondary">면접 예정</div>
            </div>
          </Link>
        </div>

        {/* 긴급 액션 필요 항목 */}
        {recruitmentStatus.proposed.some(p => p.urgent) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-error/10 border border-error/20 rounded-xl p-4 mb-3"
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-error" />
              <span className="text-sm font-medium text-error">응답 필요!</span>
            </div>
            {recruitmentStatus.proposed.filter(p => p.urgent).map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-text-primary">{item.hospital}</div>
                  <div className="text-xs text-text-secondary">{item.date} · {item.status}</div>
                </div>
                <Link href="/seeker/matching-center">
                  <button className="text-xs bg-error text-white px-3 py-1.5 rounded-lg">
                    지금 확인
                  </button>
                </Link>
              </div>
            ))}
          </motion.div>
        )}

        {/* 협상 중 항목 */}
        {recruitmentStatus.negotiating.length > 0 && (
          <div className="bg-warning/10 border border-warning/20 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="w-4 h-4 text-warning" />
              <span className="text-sm font-medium text-warning">협상 진행 중</span>
            </div>
            {recruitmentStatus.negotiating.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-text-primary">{item.hospital}</div>
                  <div className="text-xs text-text-secondary">{item.nextStep}</div>
                </div>
                <Link href="/seeker/matching-center">
                  <button className="text-xs bg-warning text-white px-3 py-1.5 rounded-lg">
                    조건 회신
                  </button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 관심 병원 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-section-title flex items-center gap-2">
            <Heart className="w-5 h-5 text-error" />
            관심 병원
          </h2>
          <button
            onClick={() => setShowAllInterested(!showAllInterested)}
            className="text-sm text-brand-mint flex items-center"
          >
            {showAllInterested ? '접기' : '전체보기'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {(showAllInterested ? interestedHospitals : interestedHospitals.slice(0, 2)).map((hospital, index) => (
            <motion.div
              key={hospital.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-xl p-4 border border-border-light"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    hospital.isRecruiting ? 'bg-success/10' : 'bg-bg-secondary'
                  }`}>
                    <Building2 className={`w-5 h-5 ${hospital.isRecruiting ? 'text-success' : 'text-text-tertiary'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-text-primary">{hospital.name}</span>
                      {hospital.isRecruiting && (
                        <span className="text-xs bg-success/10 text-success px-2 py-0.5 rounded">채용중</span>
                      )}
                    </div>
                    <div className="text-xs text-text-secondary">
                      {hospital.lastActivity} · {hospital.lastActivityTime}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-brand-mint">{hospital.matchScore}%</div>
                  <div className="text-xs text-text-tertiary">매칭</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 추천 오퍼 하이라이트 - 수평 스크롤 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-section-title">추천 병원</h2>
          <Link href="/seeker/matching-center" className="text-sm text-brand-mint flex items-center">
            전체보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
          <div className="flex gap-3" style={{ width: 'max-content' }}>
            {mockOffers.map((offer, i) => (
              <motion.div
                key={offer.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`w-[280px] flex-shrink-0 bg-white rounded-2xl p-4 border-2 ${
                  i === 0 ? 'border-match-gold' : 'border-border-light'
                } hover:shadow-card transition-all`}
              >
                {i === 0 && (
                  <div className="badge-active mb-2">원장님이 직접 선택</div>
                )}
                <Link href="/seeker/matching-center">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-text-primary">{offer.hospital}</div>
                      <div className="text-sm text-text-secondary">{offer.department}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-brand-mint">{offer.matchScore}%</div>
                      <div className="text-xs text-text-tertiary">매칭</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
                    <Briefcase className="w-4 h-4" />
                    <span>{offer.salary}</span>
                  </div>
                </Link>
                <div className="flex items-center gap-2 pt-3 border-t border-border-light">
                  <Link href="/seeker/matching-center" className="flex-1">
                    <button className="w-full py-2 bg-brand-mint/10 text-brand-mint rounded-lg text-sm font-medium flex items-center justify-center gap-1">
                      <ExternalLink className="w-3.5 h-3.5" />
                      상세보기
                    </button>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({
                          title: `${offer.hospital} 채용 정보`,
                          text: `${offer.hospital}에서 ${offer.department} 채용 중! 연봉 ${offer.salary}`,
                          url: window.location.href,
                        });
                      } else {
                        navigator.clipboard.writeText(
                          `${offer.hospital} 채용정보: ${offer.department}, ${offer.salary}`
                        );
                        alert('링크가 복사되었습니다!');
                      }
                    }}
                    className="p-2 bg-bg-secondary text-text-secondary rounded-lg hover:bg-bg-tertiary transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 나를 위한 시장 리포트 - CTA 활성화 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-section-title">나를 위한 시장 리포트</h2>
          <Link href="/seeker/market-report" className="text-sm text-brand-mint flex items-center">
            상세보기 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <Link href="/seeker/market-report">
          <div className="bg-white rounded-2xl p-4 border border-border-light hover:border-brand-mint hover:shadow-card transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-brand-mint/20 to-expert-navy/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-expert-navy" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-text-primary">하이엔드 성과자</div>
                <div className="text-sm text-text-secondary">회원님의 유형</div>
              </div>
              <ChevronRight className="w-5 h-5 text-text-tertiary" />
            </div>
            <div className="bg-bg-secondary rounded-xl p-3">
              <p className="text-sm text-text-primary">
                회원님 같은 <strong>&apos;하이엔드 성과자&apos;</strong>는 <strong>피부과, 성형외과</strong>에서
                만족도가 가장 높았어요.
              </p>
              <div className="flex items-center gap-2 mt-2 text-xs text-brand-mint">
                <TrendingUp className="w-3 h-3" />
                지금 강남 지역 채용이 활발해요!
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* 오늘의 채용 시장 */}
      <section>
        <h2 className="text-section-title mb-3">오늘의 채용 시장</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-3 border border-border-light">
            <div className="text-xs text-text-secondary mb-1">새 채용공고</div>
            <div className="text-xl font-bold text-expert-navy">{activity.today.newJobPostings}건</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-border-light">
            <div className="text-xs text-text-secondary mb-1">오늘 매칭</div>
            <div className="text-xl font-bold text-expert-navy">{activity.today.matchesCreated}건</div>
          </div>
        </div>
      </section>

      {/* 프로필 완성도 - CTA 활성화 */}
      <section>
        <div className="bg-white rounded-2xl p-4 border border-border-light">
          <div className="flex items-center justify-between mb-3">
            <span className="text-card-title">프로필 완성도</span>
            <span className="text-lg font-bold text-brand-mint">{completionPercent}%</span>
          </div>
          <div className="progress-bar mb-3">
            <div className="progress-fill" style={{ width: `${completionPercent}%` }} />
          </div>

          {/* 미완성 항목 표시 */}
          <div className="space-y-2 mb-4">
            {profileCompletionItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                {item.completed ? (
                  <CheckCircle className="w-4 h-4 text-success" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-warning" />
                )}
                <span className={item.completed ? 'text-text-secondary' : 'text-text-primary'}>
                  {item.label}
                </span>
                {!item.completed && (
                  <span className="text-xs text-warning ml-auto">미완성</span>
                )}
              </div>
            ))}
          </div>

          <Link href="/seeker/profile/edit">
            <button className="w-full flex items-center justify-center gap-2 bg-brand-mint text-white py-3 rounded-xl font-medium">
              <Edit3 className="w-4 h-4" />
              프로필 100% 완성하고 오퍼 2배 받기
            </button>
          </Link>
        </div>
      </section>

      {/* 빠른 액션 버튼들 */}
      <section className="grid grid-cols-2 gap-3">
        <Link href="/seeker/fit-test">
          <button className="w-full p-4 bg-white rounded-xl border border-border-light hover:border-brand-mint transition-all text-left">
            <Sparkles className="w-5 h-5 text-brand-mint mb-2" />
            <div className="text-sm font-medium text-text-primary">정밀 진단</div>
            <div className="text-xs text-text-secondary">커리어 유형 재검사</div>
          </button>
        </Link>
        <Link href="/seeker/concierge">
          <button className="w-full p-4 bg-white rounded-xl border border-border-light hover:border-brand-mint transition-all text-left">
            <MessageCircle className="w-5 h-5 text-expert-navy mb-2" />
            <div className="text-sm font-medium text-text-primary">AI 컨시어지</div>
            <div className="text-xs text-text-secondary">병원 궁금증 해결</div>
          </button>
        </Link>
      </section>
    </motion.div>
  );
}
