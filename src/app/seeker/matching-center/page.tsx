'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Heart,
  MessageCircle,
  X,
  MapPin,
  Clock,
  Users,
  Award,
  SlidersHorizontal,
  Sparkles,
  Settings2,
  Check,
  Star,
  Briefcase,
  GraduationCap,
  Calendar,
  DollarSign,
  Building2,
  ChevronRight,
  Phone,
  CheckCircle,
  AlertCircle,
  Info,
  Send,
  Video,
  Lock,
  Gift,
  UserPlus,
  FileText,
  Share2,
  Monitor,
  Armchair,
  Stethoscope,
  Database,
  Copy,
} from 'lucide-react';

const DAILY_REJECT_LIMIT = 10;

// 업무강도 레벨 타입
type IntensityLevel = 'low' | 'middle' | 'high';

// FitType (사용자 성향 유형)
type FitType = 'high_end_achiever' | 'practical_expert' | 'self_actualizer' | 'trust_centered_expert';

// 성향별 추천 채용상품 매핑 (순서대로 우선순위)
const fitTypeToProductTypes: Record<FitType, string[]> = {
  high_end_achiever: ['share', 'allowance', 'bonus'],
  practical_expert: ['allowance', 'bonus', 'share'],
  self_actualizer: ['vacation', 'bonus', 'share'],
  trust_centered_expert: ['bonus', 'vacation', 'allowance'],
};

// 성향-상품 적합도 점수 계산 (0 ~ 10점 추가)
const calculateFitBoost = (userFitType: FitType, products: HiringProduct[]): number => {
  if (!products || products.length === 0) return 0;
  const preferredProducts = fitTypeToProductTypes[userFitType];
  let boost = 0;
  products.forEach((product) => {
    const rank = preferredProducts.indexOf(product.type);
    if (rank === 0) boost += 5; // 1순위 상품: +5점
    else if (rank === 1) boost += 3; // 2순위 상품: +3점
    else if (rank === 2) boost += 2; // 3순위 상품: +2점
  });
  return Math.min(boost, 10); // 최대 10점까지
};

// 채용상품 타입
type HiringProduct = {
  type: 'share' | 'bonus' | 'vacation' | 'allowance';
  label: string;
  description: string;
  color: string;
};

// Mock data - 피부과/성형외과 기반으로 변경
const mockOffers = [
  {
    id: 1,
    hospital: '청담리더스피부과',
    location: '서울 강남구 청담동',
    salary: '400~450만',
    salaryType: 'monthly',
    matchScore: 94,
    isActive: true,
    proposedBy: 'employer',
    tier: 3 as const,
    intensityLevel: 'low' as IntensityLevel,
    benefits: ['4대보험', '점심 제공', '주차 지원', '성과급', '교육비 지원'],
    hasColleague: true,
    status: 'proposed',
    proposedAt: '2일 전',
    // 채용상품
    hiringProducts: [
      { type: 'bonus', label: '근속 보너스', description: '1년 근속 시 200만원 지급', color: '#AF52DE' },
      { type: 'vacation', label: '휴가 자유', description: '연차 자유 사용 보장', color: '#5AC8FA' },
    ] as HiringProduct[],
    // 시설 정보
    facilityInfo: {
      chairs: 8,
      beds: 4,
      equipment: [
        '울쎄라 (DeepSEE)',
        '인모드 FX/Forma',
        '슈링크 유니버스',
        'LDM MED',
        '피코슈어 755nm',
        'CO2 프락셔널 레이저',
        '엔디야그 레이저',
        'VISIA 피부분석기',
      ],
      staffCount: { doctors: 3, nurses: 8, other: 5 },
    },
    // 슈퍼프로필 (상세정보)
    superProfile: {
      description: '청담동 대표 피부과로, 레이저 시술 및 피부 관리 전문. 최신 장비와 체계적인 교육 시스템 보유.',
      workHours: '09:00 ~ 18:00 (주 5일)',
      overtime: '월 평균 2~3회 (야근수당 별도)',
      team: { doctors: 3, nurses: 8, staff: 5 },
      culture: ['체계적 교육', '수평적 문화', '워크샵', '생일 파티'],
      equipment: ['최신 레이저 장비', 'LDM', '울쎄라', '인모드'],
      career: '1~3년차 선호 (신입 가능)',
      rating: 4.5,
      reviews: 23,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '2년차', rating: 4.5, content: '교육 시스템이 잘 되어있어서 신입도 적응하기 좋아요. 원장님이 친절하고 분위기가 좋습니다.', verified: true },
        { id: 2, role: '퇴사자', tenure: '1년 근무', rating: 4.0, content: '워라밸이 좋고 급여도 괜찮아요. 다만 바쁜 시즌에는 조금 힘들어요.', verified: true },
      ],
      infoSources: { official: 60, userReport: 30, verified: 10 },
      // 데이터 출처 상세
      dataSourceDetail: {
        publicData: ['건강보험심사평가원 요양기관 현황', '의료인력 정보'],
        facilityData: ['체어/베드 수', '보유 장비 현황', '의료진 규모'],
        certifiedBy: '병원 직접 인증',
      },
    },
  },
  {
    id: 2,
    hospital: '압구정미래성형외과',
    location: '서울 강남구 압구정동',
    salary: '420~500만',
    salaryType: 'monthly',
    matchScore: 91,
    isActive: false,
    proposedBy: 'ai',
    tier: 2 as const,
    intensityLevel: 'middle' as IntensityLevel,
    benefits: ['4대보험', '야근수당', '명절보너스', '인센티브'],
    hasColleague: false,
    status: 'proposed',
    proposedAt: '3일 전',
    hiringProducts: [
      { type: 'share', label: '매출 셰어', description: '매출의 1% 인센티브', color: '#FF2D55' },
      { type: 'allowance', label: '수당 보장', description: '야근수당 150% 지급', color: '#FF9500' },
    ] as HiringProduct[],
    facilityInfo: {
      chairs: 0,
      beds: 12,
      equipment: [
        '수술실 3개 (무영등, 전동수술대)',
        'Drager 마취기',
        'GE 환자모니터링 시스템',
        '전기소작기 (Bovie)',
        '회복실 12베드',
        '응급카트 + 제세동기',
        '마취심도모니터 (BIS)',
        '수술현미경',
      ],
      staffCount: { doctors: 5, nurses: 12, other: 8 },
    },
    superProfile: {
      description: '코, 눈 성형 전문 클리닉. 높은 수술 건수로 다양한 케이스 경험 가능.',
      workHours: '09:00 ~ 19:00 (주 5.5일)',
      overtime: '월 평균 4~5회',
      team: { doctors: 5, nurses: 12, staff: 8 },
      culture: ['성과 중심', '빠른 성장', '자기개발 지원'],
      equipment: ['수술실 3개', '최신 모니터링 장비'],
      career: '경력 2년 이상',
      rating: 4.2,
      reviews: 18,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '3년차', rating: 4.0, content: '바쁘지만 실력이 많이 늘어요. 성과급이 꽤 괜찮습니다.', verified: true },
      ],
      infoSources: { official: 40, userReport: 50, verified: 10 },
      dataSourceDetail: {
        publicData: ['건강보험심사평가원 요양기관 현황', '의료인력 정보'],
        facilityData: ['베드 수', '수술실 현황', '의료진 규모'],
        certifiedBy: null,
      },
    },
  },
  {
    id: 3,
    hospital: '신사동베스트피부과',
    location: '서울 강남구 신사동',
    salary: '380~420만',
    salaryType: 'monthly',
    matchScore: 88,
    isActive: false,
    proposedBy: 'ai',
    tier: 3 as const,
    intensityLevel: 'low' as IntensityLevel,
    benefits: ['4대보험', '교통비', '성과급', '연차 보장'],
    hasColleague: false,
    status: 'interested',
    proposedAt: '5일 전',
    hiringProducts: [
      { type: 'vacation', label: '휴가 자유', description: '연차 자유 사용 보장', color: '#5AC8FA' },
    ] as HiringProduct[],
    facilityInfo: {
      chairs: 5,
      beds: 2,
      equipment: [
        '젠틀맥스 프로',
        'IPL (루메니스 M22)',
        '아쿠아필',
        'Mark-Vu 피부분석기',
        '리쥬란 시술 세트',
        'LED 테라피 장비',
      ],
      staffCount: { doctors: 2, nurses: 5, other: 3 },
    },
    superProfile: {
      description: '여유로운 분위기의 피부과. 워라밸을 중시하며 안정적인 근무 환경 제공.',
      workHours: '10:00 ~ 18:30 (주 5일)',
      overtime: '거의 없음',
      team: { doctors: 2, nurses: 5, staff: 3 },
      culture: ['워라밸 보장', '가족적 분위기', '자율 휴가'],
      equipment: ['레이저 장비', '피부 분석기'],
      career: '신입 환영',
      rating: 4.7,
      reviews: 31,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '4년차', rating: 5.0, content: '최고의 워라밸! 야근이 거의 없고 분위기가 정말 좋아요. 오래 다닐 수 있는 곳입니다.', verified: true },
        { id: 2, role: '현직 간호사', tenure: '1년차', rating: 4.5, content: '신입인데 선배들이 잘 가르쳐주세요. 편하게 질문할 수 있는 분위기예요.', verified: true },
        { id: 3, role: '퇴사자', tenure: '2년 근무', rating: 4.5, content: '좋은 곳이었는데 개인 사정으로 퇴사했어요. 급여도 적당하고 복지가 좋습니다.', verified: true },
      ],
      infoSources: { official: 50, userReport: 20, verified: 30 },
      dataSourceDetail: {
        publicData: ['건강보험심사평가원 요양기관 현황', '의료인력 정보'],
        facilityData: ['체어/베드 수', '보유 장비 현황', '의료진 규모'],
        certifiedBy: '병원 직접 인증',
      },
    },
  },
  {
    id: 4,
    hospital: '논현뷰티성형외과',
    location: '서울 강남구 논현동',
    salary: '350~400만',
    salaryType: 'monthly',
    matchScore: 82,
    isActive: false,
    proposedBy: 'ai',
    tier: 1 as const,
    intensityLevel: 'high' as IntensityLevel,
    benefits: ['4대보험', '점심 제공'],
    hasColleague: false,
    status: 'negotiating',
    proposedAt: '1주일 전',
    hiringProducts: [] as HiringProduct[],
    facilityInfo: {
      chairs: 0,
      beds: 8,
      equipment: [
        '수술실 2개 (기본 장비)',
        '마취기 (구형)',
        '환자모니터',
        '회복실 8베드',
        '기본 수술도구 세트',
      ],
      staffCount: { doctors: 4, nurses: 10, other: 6 },
    },
    superProfile: {
      description: '다양한 성형 시술 제공. 바쁘지만 많은 경험을 쌓을 수 있는 환경.',
      workHours: '09:00 ~ 20:00 (주 6일)',
      overtime: '상시',
      team: { doctors: 4, nurses: 10, staff: 6 },
      culture: ['열정적', '빠른 학습'],
      equipment: ['수술실 2개'],
      career: '경력 무관',
      rating: 3.8,
      reviews: 12,
      employeeReviews: [
        { id: 1, role: '퇴사자', tenure: '6개월 근무', rating: 3.0, content: '배울 건 많은데 체력적으로 힘들어요. 젊을 때 경험 삼아 다닐만 합니다.', verified: true },
      ],
      infoSources: { official: 20, userReport: 70, verified: 10 },
      dataSourceDetail: {
        publicData: ['건강보험심사평가원 요양기관 현황'],
        facilityData: [],
        certifiedBy: null,
      },
    },
  },
  {
    id: 5,
    hospital: '역삼에이스피부과',
    location: '서울 강남구 역삼동',
    salary: '380~430만',
    salaryType: 'monthly',
    matchScore: 86,
    isActive: false,
    proposedBy: 'ai',
    tier: 2 as const,
    intensityLevel: 'low' as IntensityLevel,
    benefits: ['4대보험', '점심 제공', '교통비 지원', '연차 보장'],
    hasColleague: true,
    status: 'proposed',
    proposedAt: '3일 전',
    hiringProducts: [
      { type: 'bonus', label: '근속 보너스', description: '1년 근속 시 150만원', color: '#AF52DE' },
    ] as HiringProduct[],
    facilityInfo: {
      chairs: 6,
      beds: 2,
      equipment: [
        '클라리티 II 레이저',
        'IPL (루메카)',
        'LDM MED',
        '써마지 FLX',
        'VISIA 피부분석기',
        '아쿠아필 플러스',
        '스킨보톡스 시술 세트',
      ],
      staffCount: { doctors: 2, nurses: 6, other: 4 },
    },
    superProfile: {
      description: '역삼역 인근 피부과. 직장인 환자가 많아 저녁 시간대 바쁨.',
      workHours: '10:00 ~ 19:00 (주 5일)',
      overtime: '월 2~3회',
      team: { doctors: 2, nurses: 6, staff: 4 },
      culture: ['체계적', '안정적', '교육 지원'],
      equipment: ['레이저 장비', '피부 분석기', 'IPL'],
      career: '1~3년차 선호',
      rating: 4.3,
      reviews: 19,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '2년차', rating: 4.5, content: '안정적이고 체계적인 곳이에요. 야근도 적고 분위기 좋습니다.', verified: true },
      ],
      infoSources: { official: 55, userReport: 35, verified: 10 },
      dataSourceDetail: {
        publicData: ['건강보험심사평가원 요양기관 현황', '의료인력 정보'],
        facilityData: ['체어/베드 수', '보유 장비 현황'],
        certifiedBy: null,
      },
    },
  },
  {
    id: 6,
    hospital: '삼성동라인성형외과',
    location: '서울 강남구 삼성동',
    salary: '450~520만',
    salaryType: 'monthly',
    matchScore: 89,
    isActive: false,
    proposedBy: 'employer',
    tier: 3 as const,
    intensityLevel: 'middle' as IntensityLevel,
    benefits: ['4대보험', '인센티브', '성과급', '학회비 지원', '명절보너스'],
    hasColleague: false,
    status: 'proposed',
    proposedAt: '1일 전',
    hiringProducts: [
      { type: 'share', label: '매출 셰어', description: '매출의 1% 인센티브', color: '#FF2D55' },
      { type: 'bonus', label: '근속 보너스', description: '3년 근속 시 500만원', color: '#AF52DE' },
    ] as HiringProduct[],
    facilityInfo: {
      chairs: 0,
      beds: 15,
      equipment: [
        '수술실 4개 (최신 무영등, Maquet 수술대)',
        'Drager Perseus 마취기',
        'Philips IntelliVue 모니터링',
        '전기소작기 (Force FX)',
        '회복실 15베드 (개인 모니터링)',
        '응급카트 + 제세동기',
        '수술현미경 (Zeiss)',
        '마취심도모니터 (BIS/Entropy)',
        '3D 시뮬레이션 장비',
      ],
      staffCount: { doctors: 4, nurses: 10, other: 7 },
    },
    superProfile: {
      description: '눈코입 전문 성형외과. 고급 시설과 높은 수술 건수로 경험 축적 가능.',
      workHours: '09:00 ~ 18:30 (주 5.5일)',
      overtime: '월 4~5회',
      team: { doctors: 4, nurses: 10, staff: 7 },
      culture: ['성과 중심', '전문성 개발', '협력적'],
      equipment: ['수술실 4개', '최신 마취 장비', '회복실'],
      career: '경력 3년 이상 우대',
      rating: 4.4,
      reviews: 27,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '4년차', rating: 4.5, content: '급여가 높고 인센티브도 좋아요. 배울 것도 많고요.', verified: true },
      ],
      infoSources: { official: 45, userReport: 40, verified: 15 },
      dataSourceDetail: {
        publicData: ['건강보험심사평가원 요양기관 현황', '의료인력 정보'],
        facilityData: ['베드 수', '수술실 현황', '의료진 규모'],
        certifiedBy: '병원 직접 인증',
      },
    },
  },
  {
    id: 7,
    hospital: '선릉역더마클리닉',
    location: '서울 강남구 선릉역',
    salary: '370~410만',
    salaryType: 'monthly',
    matchScore: 84,
    isActive: false,
    proposedBy: 'ai',
    tier: 2 as const,
    intensityLevel: 'low' as IntensityLevel,
    benefits: ['4대보험', '점심 제공', '주 5일'],
    hasColleague: false,
    status: 'interested',
    proposedAt: '4일 전',
    hiringProducts: [
      { type: 'vacation', label: '휴가 자유', description: '연차 자유 사용', color: '#5AC8FA' },
    ] as HiringProduct[],
    facilityInfo: {
      chairs: 4,
      beds: 2,
      equipment: [
        '젠틀야그 레이저',
        'LDM DUAL',
        '아쿠아필',
        'LED 치료기',
        '마이크로니들링 장비',
        '피부확대경',
      ],
      staffCount: { doctors: 2, nurses: 4, other: 3 },
    },
    superProfile: {
      description: '피부관리 중심의 클리닉. 여유로운 분위기에서 일할 수 있음.',
      workHours: '09:30 ~ 18:00 (주 5일)',
      overtime: '거의 없음',
      team: { doctors: 2, nurses: 4, staff: 3 },
      culture: ['워라밸', '가족적', '자율적'],
      equipment: ['레이저', 'LDM', '피부관리 장비'],
      career: '신입~3년차',
      rating: 4.6,
      reviews: 15,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '1년차', rating: 4.5, content: '워라밸 최고! 야근 없고 편하게 다닐 수 있어요.', verified: true },
      ],
      infoSources: { official: 50, userReport: 30, verified: 20 },
      dataSourceDetail: {
        publicData: ['건강보험심사평가원 요양기관 현황'],
        facilityData: ['체어/베드 수', '보유 장비 현황'],
        certifiedBy: null,
      },
    },
  },
  {
    id: 8,
    hospital: '도곡동프리미엄피부과',
    location: '서울 강남구 도곡동',
    salary: '400~460만',
    salaryType: 'monthly',
    matchScore: 90,
    isActive: false,
    proposedBy: 'employer',
    tier: 3 as const,
    intensityLevel: 'middle' as IntensityLevel,
    benefits: ['4대보험', '성과급', '교육비', '건강검진', '경조사비'],
    hasColleague: true,
    status: 'proposed',
    proposedAt: '2일 전',
    hiringProducts: [
      { type: 'bonus', label: '근속 보너스', description: '1년 200만, 3년 500만', color: '#AF52DE' },
      { type: 'allowance', label: '수당 보장', description: '야근수당 150%', color: '#FF9500' },
    ] as HiringProduct[],
    facilityInfo: {
      chairs: 10,
      beds: 4,
      equipment: [
        '울쎄라 (DeepSEE)',
        '인모드 (FX/Forma/Evoke)',
        '슈링크 유니버스',
        '올리지오',
        '피코슈어 Pro',
        '클라리티 II',
        'CO2 프락셔널 (UltraPulse)',
        '써마지 FLX',
        'VISIA Gen 7 피부분석기',
        '쥬베룩 시술 세트',
      ],
      staffCount: { doctors: 3, nurses: 7, other: 5 },
    },
    superProfile: {
      description: '프리미엄 피부과로 VIP 고객 다수. 고급 서비스 경험 가능.',
      workHours: '09:00 ~ 18:00 (주 5일)',
      overtime: '월 3~4회',
      team: { doctors: 3, nurses: 7, staff: 5 },
      culture: ['프로페셔널', '고객 중심', '체계적'],
      equipment: ['최신 레이저', '울쎄라', '인모드', '슈링크'],
      career: '2년 이상 우대',
      rating: 4.5,
      reviews: 22,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '3년차', rating: 4.5, content: '시설도 좋고 환자분들도 좋아요. 급여도 만족스럽습니다.', verified: true },
      ],
      infoSources: { official: 60, userReport: 25, verified: 15 },
      dataSourceDetail: {
        publicData: ['건강보험심사평가원 요양기관 현황', '의료인력 정보'],
        facilityData: ['체어/베드 수', '보유 장비 현황', '의료진 규모'],
        certifiedBy: '병원 직접 인증',
      },
    },
  },
  {
    id: 9,
    hospital: '대치동엘리트성형외과',
    location: '서울 강남구 대치동',
    salary: '380~440만',
    salaryType: 'monthly',
    matchScore: 83,
    isActive: false,
    proposedBy: 'ai',
    tier: 2 as const,
    intensityLevel: 'middle' as IntensityLevel,
    benefits: ['4대보험', '야근수당', '식대', '교통비'],
    hasColleague: false,
    status: 'proposed',
    proposedAt: '5일 전',
    hiringProducts: [
      { type: 'allowance', label: '수당 보장', description: '야근/주말 150%', color: '#FF9500' },
    ] as HiringProduct[],
    facilityInfo: {
      chairs: 0,
      beds: 10,
      equipment: [
        '수술실 2개 (LED 무영등)',
        'GE 마취기',
        'Philips 환자모니터',
        '전기소작기',
        '회복실 10베드',
        '응급카트',
        '상담실 3D 시뮬레이션',
      ],
      staffCount: { doctors: 3, nurses: 8, other: 5 },
    },
    superProfile: {
      description: '쌍꺼풀, 코성형 전문. 중견 성형외과로 안정적인 운영.',
      workHours: '09:00 ~ 18:30 (주 5일)',
      overtime: '월 3~4회',
      team: { doctors: 3, nurses: 8, staff: 5 },
      culture: ['안정적', '경험 중심', '협력적'],
      equipment: ['수술실 2개', '회복실', '상담실'],
      career: '1~4년차',
      rating: 4.1,
      reviews: 16,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '2년차', rating: 4.0, content: '배울 것이 많고 선배들이 친절해요. 급여도 괜찮은 편입니다.', verified: true },
      ],
      infoSources: { official: 40, userReport: 45, verified: 15 },
      dataSourceDetail: {
        publicData: ['건강보험심사평가원 요양기관 현황'],
        facilityData: ['베드 수', '수술실 현황'],
        certifiedBy: null,
      },
    },
  },
  {
    id: 10,
    hospital: '잠실롯데피부과',
    location: '서울 송파구 잠실동',
    salary: '360~400만',
    salaryType: 'monthly',
    matchScore: 80,
    isActive: false,
    proposedBy: 'ai',
    tier: 2 as const,
    intensityLevel: 'low' as IntensityLevel,
    benefits: ['4대보험', '점심 제공', '교통비', '연차 보장'],
    hasColleague: false,
    status: 'interested',
    proposedAt: '6일 전',
    hiringProducts: [] as HiringProduct[],
    facilityInfo: {
      chairs: 5,
      beds: 2,
      equipment: [
        '엔디야그 레이저',
        'IPL (M22)',
        'CO2 레이저',
        'LDM',
        'Mark-Vu 피부분석기',
        '아쿠아필',
        '리쥬란/쥬베룩 시술 세트',
      ],
      staffCount: { doctors: 2, nurses: 5, other: 4 },
    },
    superProfile: {
      description: '잠실 롯데타워 인근 피부과. 접근성이 좋고 환자 수 꾸준함.',
      workHours: '10:00 ~ 19:00 (주 5일)',
      overtime: '월 2~3회',
      team: { doctors: 2, nurses: 5, staff: 4 },
      culture: ['친근한', '안정적', '성장 지원'],
      equipment: ['레이저 장비', 'IPL', '피부 분석기'],
      career: '신입 환영',
      rating: 4.2,
      reviews: 14,
      employeeReviews: [
        { id: 1, role: '현직 간호사', tenure: '1년차', rating: 4.0, content: '신입도 잘 가르쳐주고 분위기가 좋아요.', verified: true },
      ],
      infoSources: { official: 45, userReport: 40, verified: 15 },
      dataSourceDetail: {
        publicData: ['건강보험심사평가원 요양기관 현황'],
        facilityData: ['체어/베드 수', '보유 장비 현황'],
        certifiedBy: null,
      },
    },
  },
];

// 현재 조건 설정 (정밀진단에서 설정한 값)
const currentConditions = {
  salaryRange: '400~450만원',
  workType: '정규직 (풀타임)',
  workHours: '주 5일 (09:00~18:00)',
  compensationType: '기본급 + 인센티브 밸런스',
  priorities: '급여가 최우선',
};

const tabs = [
  { id: 'all', label: '전체', count: 10 },
  { id: 'active', label: 'Active', count: 1 },
  { id: 'interested', label: '관심', count: 3 },
  { id: 'progress', label: '진행 중', count: 1 },
];

const tierInfo = {
  1: { label: '공공데이터 추정', color: 'bg-gray-100 text-gray-600', icon: Database },
  2: { label: '시설정보 포함', color: 'bg-blue-100 text-blue-600', icon: Info },
  3: { label: '병원 인증', color: 'bg-green-100 text-green-600', icon: CheckCircle },
};

// 업무강도 레벨 정보
const intensityInfo = {
  low: { label: '여유', color: 'bg-intensity-safe', textColor: 'text-intensity-safe', bgLight: 'bg-intensity-safe/10' },
  middle: { label: '보통', color: 'bg-warning', textColor: 'text-warning', bgLight: 'bg-warning/10' },
  high: { label: '바쁨', color: 'bg-intensity-high', textColor: 'text-intensity-high', bgLight: 'bg-intensity-high/10' },
};

export default function MatchingCenterPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [showConditions, setShowConditions] = useState(false);
  const [showConditionEdit, setShowConditionEdit] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<typeof mockOffers[0] | null>(null);
  const [likedOffers, setLikedOffers] = useState<number[]>([]);
  const [rejectedOffers, setRejectedOffers] = useState<number[]>([]);

  // 필터 상태
  const [sortBy, setSortBy] = useState<string>('매칭점수순');
  const [intensityFilter, setIntensityFilter] = useState<string[]>([]);

  // 조건 수정 상태
  const [editConditions, setEditConditions] = useState({
    salaryRange: currentConditions.salaryRange,
    workType: currentConditions.workType,
    workHours: currentConditions.workHours,
    priorities: currentConditions.priorities,
  });
  const [savedConditions, setSavedConditions] = useState(currentConditions);
  const [showInterviewRequest, setShowInterviewRequest] = useState(false);
  const [interviewRequestHospital, setInterviewRequestHospital] = useState<typeof mockOffers[0] | null>(null);
  const [preferredContactTime, setPreferredContactTime] = useState<string>('');
  const [interviewType, setInterviewType] = useState<string>('video');
  const [requestMessage, setRequestMessage] = useState<string>('');

  // 사용자 성향 유형 (Fit Test 결과에서 가져옴 - 시뮬레이션)
  const [userFitType] = useState<FitType>('practical_expert');

  // 성향-상품 적합도를 반영한 매칭 점수 계산
  const getEnhancedMatchScore = (offer: typeof mockOffers[0]) => {
    const baseScore = offer.matchScore;
    const fitBoost = calculateFitBoost(userFitType, offer.hiringProducts);
    return {
      baseScore,
      fitBoost,
      totalScore: Math.min(baseScore + fitBoost, 100), // 최대 100%
    };
  };

  // 거절 횟수 제한 관련 상태
  const [dailyRejectCount, setDailyRejectCount] = useState(3); // 시뮬레이션: 이미 3회 거절
  const [isRejectLimited, setIsRejectLimited] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<typeof mockOffers[0] | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const remainingRejects = DAILY_REJECT_LIMIT - dailyRejectCount;

  // 데이터 출처 상세 팝업
  const [showDataSourcePopup, setShowDataSourcePopup] = useState(false);
  const [dataSourceTarget, setDataSourceTarget] = useState<typeof mockOffers[0] | null>(null);

  const handleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const offer = mockOffers.find(o => o.id === id);
    if (!likedOffers.includes(id) && offer) {
      setLikedOffers((prev) => [...prev, id]);
      setInterviewRequestHospital(offer);
      setShowInterviewRequest(true);
    } else {
      setLikedOffers((prev) => prev.filter((i) => i !== id));
    }
  };

  const handleSubmitInterviewRequest = () => {
    if (!interviewRequestHospital) return;
    alert(`${interviewRequestHospital.hospital}에 인터뷰 요청을 보냈습니다!\n\n면접 유형: ${interviewType === 'video' ? '화상 면접' : interviewType === 'phone' ? '전화 면접' : '대면 면접'}\n선호 시간: ${preferredContactTime || '상관없음'}`);
    setShowInterviewRequest(false);
    setPreferredContactTime('');
    setInterviewType('video');
    setRequestMessage('');
  };

  // 거절 모달 열기
  const openRejectModal = (offer: typeof mockOffers[0], e: React.MouseEvent) => {
    e.stopPropagation();
    // 거절 횟수가 10회 이상이면 거절 불가
    if (dailyRejectCount >= DAILY_REJECT_LIMIT || isRejectLimited) {
      setIsRejectLimited(true);
      setShowResetModal(true);
      return;
    }
    setRejectTarget(offer);
    setRejectReason('');
    setShowRejectModal(true);
  };

  // 거절 확정
  const confirmReject = () => {
    if (!rejectTarget) return;
    // 거절 횟수가 10회 이상이면 거절 불가
    if (dailyRejectCount >= DAILY_REJECT_LIMIT) {
      setIsRejectLimited(true);
      setShowResetModal(true);
      setShowRejectModal(false);
      return;
    }
    setRejectedOffers((prev) => [...prev, rejectTarget.id]);
    const newCount = dailyRejectCount + 1;
    setDailyRejectCount(newCount);
    setShowRejectModal(false);

    if (newCount >= DAILY_REJECT_LIMIT) {
      setIsRejectLimited(true);
      setTimeout(() => setShowResetModal(true), 300);
    }
  };

  // CTA 모달 상태
  const [showProfileCTA, setShowProfileCTA] = useState(false);
  const [showReferralCTA, setShowReferralCTA] = useState(false);
  const [showEmployeeCTA, setShowEmployeeCTA] = useState(false);
  const [referralPhone, setReferralPhone] = useState('');
  const [referralName, setReferralName] = useState('');

  const handleResetLimit = (option: string) => {
    setShowResetModal(false);
    if (option === 'profile') {
      setShowProfileCTA(true);
    } else if (option === 'referral') {
      setShowReferralCTA(true);
    } else if (option === 'employee') {
      setShowEmployeeCTA(true);
    }
  };

  // CTA 완료 후 거절 횟수 초기화
  const completeReset = () => {
    setDailyRejectCount(0);
    setIsRejectLimited(false);
    setShowProfileCTA(false);
    setShowReferralCTA(false);
    setShowEmployeeCTA(false);
    setReferralPhone('');
    setReferralName('');
  };

  // 필터 + 정렬 적용된 리스트
  const filteredOffers = mockOffers
    .filter((offer) => {
      if (rejectedOffers.includes(offer.id)) return false;
      // 탭 필터
      if (activeTab === 'active' && !offer.isActive) return false;
      if (activeTab === 'interested' && !likedOffers.includes(offer.id)) return false;
      if (activeTab === 'progress' && offer.status !== 'negotiating') return false;
      // 업무강도 필터
      if (intensityFilter.length > 0 && !intensityFilter.includes(offer.intensityLevel)) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === '매칭점수순') return getEnhancedMatchScore(b).totalScore - getEnhancedMatchScore(a).totalScore;
      if (sortBy === '급여순') {
        const getSalary = (s: string) => parseInt(s.replace(/[^0-9]/g, '')) || 0;
        return getSalary(b.salary) - getSalary(a.salary);
      }
      if (sortBy === '최신순') return b.id - a.id;
      return 0;
    });

  // 업무강도 필터 토글
  const toggleIntensityFilter = (level: string) => {
    setIntensityFilter(prev =>
      prev.includes(level) ? prev.filter(l => l !== level) : [...prev, level]
    );
  };

  // 조건 저장
  const saveConditions = () => {
    setSavedConditions({ ...editConditions, compensationType: currentConditions.compensationType });
    setShowConditionEdit(false);
  };

  return (
    <div className="px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-dashboard-title">매칭 센터</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setShowConditions(!showConditions)}
            className="flex items-center gap-1 text-sm text-brand-mint bg-brand-mint/10 px-3 py-2 rounded-lg border border-brand-mint/30"
          >
            <Settings2 className="w-4 h-4" />
            조건변경
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 text-sm text-text-secondary bg-white px-3 py-2 rounded-lg border border-border-light"
          >
            <SlidersHorizontal className="w-4 h-4" />
            필터
          </button>
        </div>
      </div>

      {/* 거절 횟수 표시 */}
      <div className={`mb-4 p-3 rounded-xl flex items-center justify-between ${
        isRejectLimited ? 'bg-error/10 border border-error/20' : remainingRejects <= 3 ? 'bg-warning/10 border border-warning/20' : 'bg-bg-secondary'
      }`}>
        <div className="flex items-center gap-2">
          {isRejectLimited ? (
            <Lock className="w-4 h-4 text-error" />
          ) : (
            <X className="w-4 h-4 text-text-tertiary" />
          )}
          <span className={`text-sm ${isRejectLimited ? 'text-error font-medium' : 'text-text-secondary'}`}>
            {isRejectLimited
              ? '오늘 거절 횟수를 모두 사용했어요'
              : `오늘 남은 거절 횟수: ${remainingRejects}회`}
          </span>
        </div>
        {isRejectLimited && (
          <button
            onClick={() => setShowResetModal(true)}
            className="text-xs text-brand-mint font-medium flex items-center gap-1"
          >
            <Gift className="w-3 h-3" />
            초기화하기
          </button>
        )}
      </div>

      {/* 현재 조건 요약 */}
      <AnimatePresence>
        {showConditions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-white rounded-2xl p-4 border border-border-light mb-4 overflow-hidden"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-text-primary">내 희망 조건</h3>
              <button
                onClick={() => setShowConditionEdit(true)}
                className="text-xs text-brand-mint flex items-center"
              >
                조건 수정하기
                <ChevronRight className="w-3 h-3 ml-0.5" />
              </button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary">희망 급여:</span>
                <span className="font-medium text-text-primary">{savedConditions.salaryRange}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Briefcase className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary">근무 형태:</span>
                <span className="font-medium text-text-primary">{savedConditions.workType}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary">근무 시간:</span>
                <span className="font-medium text-text-primary">{savedConditions.workHours}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Star className="w-4 h-4 text-text-tertiary" />
                <span className="text-text-secondary">우선순위:</span>
                <span className="font-medium text-brand-mint">{savedConditions.priorities}</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border-light">
              <div className="nudge-box text-xs">
                <Sparkles className="w-3 h-3 text-brand-mint inline mr-1" />
                현재 조건에 맞는 병원 <strong>{filteredOffers.length}곳</strong>을 찾았어요!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 조건 수정 모달 */}
      <AnimatePresence>
        {showConditionEdit && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConditionEdit(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[80vh] overflow-y-auto"
            >
              <div className="p-4 pb-8">
                <div className="w-12 h-1.5 bg-bg-tertiary rounded-full mx-auto mb-4" />
                <h3 className="text-lg font-bold text-expert-navy mb-4">희망 조건 수정</h3>

                <div className="space-y-4">
                  {/* 희망 급여 */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">희망 급여</label>
                    <div className="flex gap-2 flex-wrap">
                      {['300~350만원', '350~400만원', '400~450만원', '450~500만원', '500만원 이상'].map((range) => (
                        <button
                          key={range}
                          onClick={() => setEditConditions({ ...editConditions, salaryRange: range })}
                          className={`px-3 py-2 text-sm rounded-lg transition-all ${
                            editConditions.salaryRange === range
                              ? 'bg-brand-mint text-white'
                              : 'bg-bg-secondary text-text-secondary'
                          }`}
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 근무 형태 */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">근무 형태</label>
                    <div className="flex gap-2 flex-wrap">
                      {['정규직 (풀타임)', '파트타임', '계약직', '유연근무제'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setEditConditions({ ...editConditions, workType: type })}
                          className={`px-3 py-2 text-sm rounded-lg transition-all ${
                            editConditions.workType === type
                              ? 'bg-brand-mint text-white'
                              : 'bg-bg-secondary text-text-secondary'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 근무 시간 */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">근무 시간</label>
                    <div className="flex gap-2 flex-wrap">
                      {['주 5일 (09:00~18:00)', '주 5.5일 (토요일 반일)', '야근 없는 곳', '자율 출퇴근'].map((hours) => (
                        <button
                          key={hours}
                          onClick={() => setEditConditions({ ...editConditions, workHours: hours })}
                          className={`px-3 py-2 text-sm rounded-lg transition-all ${
                            editConditions.workHours === hours
                              ? 'bg-brand-mint text-white'
                              : 'bg-bg-secondary text-text-secondary'
                          }`}
                        >
                          {hours}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 우선순위 */}
                  <div>
                    <label className="text-sm font-medium text-text-primary mb-2 block">가장 중요한 가치</label>
                    <div className="flex gap-2 flex-wrap">
                      {['급여가 최우선', '워라밸이 최우선', '성장/커리어가 최우선', '안정성이 최우선', '좋은 동료/문화가 최우선'].map((priority) => (
                        <button
                          key={priority}
                          onClick={() => setEditConditions({ ...editConditions, priorities: priority })}
                          className={`px-3 py-2 text-sm rounded-lg transition-all ${
                            editConditions.priorities === priority
                              ? 'bg-brand-mint text-white'
                              : 'bg-bg-secondary text-text-secondary'
                          }`}
                        >
                          {priority}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setShowConditionEdit(false)}
                    className="flex-1 py-3 text-text-secondary border border-border-light rounded-xl"
                  >
                    취소
                  </button>
                  <button
                    onClick={saveConditions}
                    className="flex-1 py-3 bg-brand-mint text-white rounded-xl font-semibold"
                  >
                    저장하기
                  </button>
                </div>

                <Link href="/seeker/fit-test" className="block mt-3">
                  <button className="w-full py-2 text-sm text-text-tertiary">
                    정밀진단 다시 받기 →
                  </button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-brand-mint text-white'
                : 'bg-white text-text-secondary border border-border-light'
            }`}
          >
            {tab.label}
            <span className={`ml-1 ${activeTab === tab.id ? 'text-white/80' : 'text-text-tertiary'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter Panel */}
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
                  {['매칭점수순', '급여순', '거리순', '최신순'].map((sort) => (
                    <button
                      key={sort}
                      onClick={() => setSortBy(sort)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                        sortBy === sort
                          ? 'bg-brand-mint text-white'
                          : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                      }`}
                    >
                      {sort}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-label block mb-2">업무강도</label>
                <div className="flex gap-2">
                  {[
                    { key: 'low', label: '여유', color: 'bg-intensity-safe text-white' },
                    { key: 'middle', label: '보통', color: 'bg-warning text-white' },
                    { key: 'high', label: '바쁨', color: 'bg-intensity-high text-white' },
                  ].map((level) => (
                    <button
                      key={level.key}
                      onClick={() => toggleIntensityFilter(level.key)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-all ${
                        intensityFilter.includes(level.key)
                          ? level.color
                          : 'bg-bg-secondary text-text-secondary hover:bg-bg-tertiary'
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setIntensityFilter([]);
                    setSortBy('매칭점수순');
                  }}
                  className="flex-1 py-2 text-sm text-text-secondary border border-border-light rounded-lg"
                >
                  초기화
                </button>
                <button
                  onClick={() => setShowFilters(false)}
                  className="flex-1 py-2 text-sm bg-brand-mint text-white rounded-lg font-medium"
                >
                  적용 ({filteredOffers.length}개)
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offers List */}
      <div className="space-y-4">
        {filteredOffers.map((offer, index) => (
          <motion.div
            key={offer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedOffer(offer)}
            className={`bg-white rounded-2xl p-4 border-2 cursor-pointer transition-all hover:shadow-card ${
              offer.isActive ? 'border-match-gold' : 'border-border-light'
            }`}
          >
            {/* Active Badge */}
            {offer.isActive && (
              <div className="flex items-center gap-2 mb-3">
                <span className="badge-active">
                  <Award className="w-3 h-3 mr-1" />
                  원장님이 직접 선택
                </span>
              </div>
            )}

            {/* Hospital Info */}
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-semibold text-text-primary text-lg">{offer.hospital}</h3>
                <div className="flex items-center gap-1 text-sm text-text-secondary mt-1">
                  <MapPin className="w-4 h-4" />
                  {offer.location}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-brand-mint">{getEnhancedMatchScore(offer).totalScore}%</div>
                <div className="text-xs text-text-tertiary">매칭</div>
              </div>
            </div>

            {/* Salary & Tier & Intensity */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="text-lg font-medium text-expert-navy">{offer.salary}</span>
              {/* 업무강도 레벨 */}
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${intensityInfo[offer.intensityLevel].bgLight} ${intensityInfo[offer.intensityLevel].textColor}`}>
                업무 {intensityInfo[offer.intensityLevel].label}
              </span>
              {/* 데이터 출처 배지 (클릭 가능) */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setDataSourceTarget(offer);
                  setShowDataSourcePopup(true);
                }}
                className={`badge-base ${tierInfo[offer.tier].color} flex items-center gap-1 hover:opacity-80 transition-opacity cursor-pointer`}
              >
                {(() => {
                  const TierIcon = tierInfo[offer.tier].icon;
                  return <TierIcon className="w-3 h-3" />;
                })()}
                {tierInfo[offer.tier].label}
              </button>
            </div>

            {/* 채용상품 배지 */}
            {offer.hiringProducts && offer.hiringProducts.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mb-3">
                <span className="text-xs text-text-tertiary font-medium">채용상품</span>
                {offer.hiringProducts.map((product, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                    style={{ backgroundColor: product.color }}
                  >
                    {product.label}
                  </span>
                ))}
              </div>
            )}

            {/* Benefits */}
            <div className="flex gap-2 flex-wrap mb-3">
              {offer.benefits.slice(0, 3).map((benefit) => (
                <span
                  key={benefit}
                  className="text-xs bg-bg-secondary text-text-secondary px-2 py-1 rounded"
                >
                  {benefit}
                </span>
              ))}
              {offer.benefits.length > 3 && (
                <span className="text-xs text-text-tertiary">+{offer.benefits.length - 3}</span>
              )}
            </div>

            {/* Colleague Badge */}
            {offer.hasColleague && (
              <div className="nudge-box text-xs mb-3">
                <Users className="w-4 h-4 inline mr-1 text-brand-mint" />
                아는 <strong>동료가 이미 근무 중</strong>인 곳이에요.
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-3 border-t border-border-light">
              <button
                onClick={(e) => handleLike(offer.id, e)}
                className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm rounded-lg font-medium transition-colors ${
                  likedOffers.includes(offer.id)
                    ? 'bg-error/10 text-error'
                    : 'bg-error/10 text-error hover:bg-error/20'
                }`}
              >
                <Heart className={`w-4 h-4 ${likedOffers.includes(offer.id) ? 'fill-error' : ''}`} />
                {likedOffers.includes(offer.id) ? '관심 등록됨' : '관심'}
              </button>
              <Link href={`/seeker/concierge?hospital=${offer.id}`} className="flex-1" onClick={(e) => e.stopPropagation()}>
                <button className="w-full flex items-center justify-center gap-1 py-2 text-sm bg-brand-mint/10 text-brand-mint rounded-lg font-medium hover:bg-brand-mint/20 transition-colors">
                  <MessageCircle className="w-4 h-4" />
                  질문하기
                </button>
              </Link>
              <button
                onClick={(e) => openRejectModal(offer, e)}
                className="flex-1 flex items-center justify-center gap-1 py-2 text-sm bg-bg-secondary text-text-secondary rounded-lg font-medium hover:bg-error/10 hover:text-error transition-colors"
              >
                <X className="w-4 h-4" />
                거절
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Sheet - Offer Detail (슈퍼프로필) */}
      <AnimatePresence>
        {selectedOffer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOffer(null)}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 pb-8">
                {/* Handle */}
                <div className="w-12 h-1.5 bg-bg-tertiary rounded-full mx-auto mb-4" />

                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-xl font-bold text-expert-navy">{selectedOffer.hospital}</h2>
                      {selectedOffer.tier === 3 && (
                        <span className="bg-success/10 text-success text-xs px-2 py-0.5 rounded-full font-medium">
                          검증완료
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-text-secondary">
                      <MapPin className="w-4 h-4" />
                      {selectedOffer.location}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-brand-mint">{getEnhancedMatchScore(selectedOffer).totalScore}%</div>
                    <div className="text-xs text-text-tertiary">매칭 점수</div>
                  </div>
                </div>

                {/* 병원 평점 */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-match-gold fill-match-gold" />
                    <span className="font-semibold">{selectedOffer.superProfile.rating}</span>
                  </div>
                  <span className="text-text-tertiary">·</span>
                  <span className="text-sm text-text-secondary">리뷰 {selectedOffer.superProfile.reviews}개</span>
                </div>

                {/* 병원 소개 */}
                <div className="bg-bg-secondary rounded-xl p-4 mb-4">
                  <p className="text-sm text-text-primary leading-relaxed">
                    {selectedOffer.superProfile.description}
                  </p>
                </div>

                {/* 매칭 점수 상세 */}
                <div className="bg-brand-mint/5 rounded-xl p-4 mb-4 border border-brand-mint/20">
                  <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-brand-mint" />
                    매칭 점수 상세
                  </h3>
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {[
                      { label: '경력 일치', score: 95 },
                      { label: '술기 일치', score: 90 },
                      { label: '성향 일치', score: 98 },
                      { label: '급여 조건', score: 92 },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between">
                        <span className="text-sm text-text-secondary">{item.label}</span>
                        <span className="text-sm font-semibold text-brand-mint">{item.score}%</span>
                      </div>
                    ))}
                  </div>

                  {/* 채용상품 일치도 */}
                  {(() => {
                    const score = getEnhancedMatchScore(selectedOffer);
                    if (score.fitBoost === 0) return null;

                    const preferredProducts = fitTypeToProductTypes[userFitType];
                    const matchedProducts = selectedOffer.hiringProducts?.filter(
                      (product) => preferredProducts.includes(product.type)
                    ) || [];

                    return (
                      <div className="pt-3 border-t border-brand-mint/20">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-1.5">
                            <Gift className="w-4 h-4 text-success" />
                            <span className="text-sm font-medium text-text-primary">채용상품 일치도</span>
                          </div>
                          <span className="text-sm font-bold text-success">+{score.fitBoost}점</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {matchedProducts.map((product, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded-full text-white font-medium"
                              style={{ backgroundColor: product.color }}
                            >
                              {product.label}
                            </span>
                          ))}
                        </div>
                        <p className="text-xs text-text-tertiary mt-2">
                          회원님의 성향과 맞는 채용상품이 있어요
                        </p>
                      </div>
                    );
                  })()}
                </div>

                {/* 채용상품 */}
                {selectedOffer.hiringProducts && selectedOffer.hiringProducts.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <Gift className="w-4 h-4 text-brand-mint" />
                      채용 상품
                    </h3>
                    <div className="space-y-3">
                      {selectedOffer.hiringProducts.map((product, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-3 p-3 rounded-xl border-2"
                          style={{ borderColor: product.color, backgroundColor: `${product.color}10` }}
                        >
                          <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: product.color }}
                          >
                            <Award className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-text-primary">{product.label}</div>
                            <div className="text-sm text-text-secondary">{product.description}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 근무 조건 */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-expert-navy" />
                    근무 조건
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">급여</span>
                      </div>
                      <span className="font-semibold text-expert-navy">{selectedOffer.salary}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">근무 시간</span>
                      </div>
                      <span className="font-medium text-text-primary">{selectedOffer.superProfile.workHours}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">야근/초과근무</span>
                      </div>
                      <span className="font-medium text-text-primary">{selectedOffer.superProfile.overtime}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-border-light">
                      <div className="flex items-center gap-2 text-text-secondary">
                        <GraduationCap className="w-4 h-4" />
                        <span className="text-sm">경력 요건</span>
                      </div>
                      <span className="font-medium text-text-primary">{selectedOffer.superProfile.career}</span>
                    </div>
                  </div>
                </div>

                {/* 업무환경 (업무강도 + 시설정보 + 보유장비) */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-info" />
                    업무 환경
                  </h3>
                  <div className="bg-bg-secondary rounded-xl p-4">
                    {/* 업무강도 */}
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-border-light">
                      <span className="text-sm text-text-secondary">업무 강도</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-bold text-white ${intensityInfo[selectedOffer.intensityLevel].color}`}>
                        {intensityInfo[selectedOffer.intensityLevel].label}
                      </span>
                    </div>
                    {/* 시설정보 */}
                    {selectedOffer.facilityInfo && (
                      <>
                        <div className="grid grid-cols-2 gap-3 mb-4 pb-3 border-b border-border-light">
                          {selectedOffer.facilityInfo.chairs > 0 && (
                            <div className="flex items-center gap-2">
                              <Armchair className="w-4 h-4 text-info" />
                              <span className="text-sm text-text-primary">체어 {selectedOffer.facilityInfo.chairs}개</span>
                            </div>
                          )}
                          {selectedOffer.facilityInfo.beds > 0 && (
                            <div className="flex items-center gap-2">
                              <Monitor className="w-4 h-4 text-info" />
                              <span className="text-sm text-text-primary">베드 {selectedOffer.facilityInfo.beds}개</span>
                            </div>
                          )}
                          <div className="flex items-center gap-2">
                            <Stethoscope className="w-4 h-4 text-info" />
                            <span className="text-sm text-text-primary">의사 {selectedOffer.facilityInfo.staffCount.doctors}명</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-info" />
                            <span className="text-sm text-text-primary">간호 {selectedOffer.facilityInfo.staffCount.nurses}명</span>
                          </div>
                        </div>
                        {/* 보유 장비 */}
                        <div>
                          <div className="text-xs text-text-tertiary mb-2 font-medium">보유 장비</div>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedOffer.facilityInfo.equipment.map((item, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-white text-text-secondary rounded-lg text-xs border border-border-light"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* 직원 리뷰 */}
                {selectedOffer.superProfile.employeeReviews && selectedOffer.superProfile.employeeReviews.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-brand-mint" />
                      직원 리뷰
                      <span className="text-xs bg-brand-mint/10 text-brand-mint px-2 py-0.5 rounded-full">
                        {selectedOffer.superProfile.employeeReviews.length}개
                      </span>
                    </h3>
                    <div className="space-y-3">
                      {selectedOffer.superProfile.employeeReviews.map((review: {id: number; role: string; tenure: string; rating: number; content: string; verified: boolean}) => (
                        <div key={review.id} className="bg-white border border-border-light rounded-xl p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                review.role.includes('현직') ? 'bg-success/10 text-success' : 'bg-bg-secondary text-text-secondary'
                              }`}>
                                {review.role}
                              </span>
                              <span className="text-xs text-text-tertiary">{review.tenure}</span>
                              {review.verified && (
                                <CheckCircle className="w-3 h-3 text-success" />
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-match-gold fill-match-gold" />
                              <span className="text-xs font-bold">{review.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-text-secondary leading-relaxed">&ldquo;{review.content}&rdquo;</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 팀 구성 */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">팀 구성</h3>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-bg-secondary rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-expert-navy">{selectedOffer.superProfile.team.doctors}</div>
                      <div className="text-xs text-text-tertiary">의사</div>
                    </div>
                    <div className="flex-1 bg-bg-secondary rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-brand-mint">{selectedOffer.superProfile.team.nurses}</div>
                      <div className="text-xs text-text-tertiary">간호인력</div>
                    </div>
                    <div className="flex-1 bg-bg-secondary rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-info">{selectedOffer.superProfile.team.staff}</div>
                      <div className="text-xs text-text-tertiary">기타 직원</div>
                    </div>
                  </div>
                </div>

                {/* 병원 문화 */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">병원 문화</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOffer.superProfile.culture.map((item) => (
                      <span
                        key={item}
                        className="px-3 py-1.5 bg-brand-mint/10 text-brand-mint rounded-full text-sm font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 복리후생 */}
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-text-primary mb-3">복리후생</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedOffer.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="px-3 py-1.5 bg-success/10 text-success rounded-full text-sm flex items-center gap-1"
                      >
                        <Check className="w-3 h-3" />
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 정보 출처 */}
                {selectedOffer.superProfile.infoSources && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-info" />
                      정보 출처
                    </h3>
                    <div className="bg-bg-secondary rounded-xl p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary">공식 정보 (병원 등록)</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                            <div className="h-full bg-expert-navy rounded-full" style={{ width: `${selectedOffer.superProfile.infoSources.official}%` }} />
                          </div>
                          <span className="text-xs font-medium text-expert-navy">{selectedOffer.superProfile.infoSources.official}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary flex items-center gap-1">
                          <AlertCircle className="w-3 h-3 text-warning" />
                          유저 제보
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                            <div className="h-full bg-warning rounded-full" style={{ width: `${selectedOffer.superProfile.infoSources.userReport}%` }} />
                          </div>
                          <span className="text-xs font-medium text-warning">{selectedOffer.superProfile.infoSources.userReport}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-text-secondary flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-success" />
                          검증됨
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-bg-tertiary rounded-full overflow-hidden">
                            <div className="h-full bg-success rounded-full" style={{ width: `${selectedOffer.superProfile.infoSources.verified}%` }} />
                          </div>
                          <span className="text-xs font-medium text-success">{selectedOffer.superProfile.infoSources.verified}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 동료 정보 */}
                {selectedOffer.hasColleague && (
                  <div className="nudge-box-highlight mb-4">
                    <Users className="w-4 h-4 inline mr-1 text-brand-mint" />
                    비슷한 성향의 <strong>동료가 이미 근무 중</strong>이에요. 적응이 더 쉬울 거예요!
                  </div>
                )}

                {/* 검증 상태 */}
                {selectedOffer.tier === 3 && (
                  <div className="nudge-box mb-4">
                    <Award className="w-4 h-4 inline mr-1 text-brand-mint" />
                    이 정보는 <strong>실제 재직자 제보</strong>로 검증됐어요.
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3 mt-6">
                  <button
                    onClick={() => {
                      setLikedOffers((prev) =>
                        prev.includes(selectedOffer.id)
                          ? prev
                          : [...prev, selectedOffer.id]
                      );
                      alert('관심 병원으로 등록되었습니다. 곧 연락드릴게요!');
                    }}
                    className="btn-primary w-full"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    이 병원과 연결 요청하기
                  </button>
                  <Link href={`/seeker/concierge?hospital=${selectedOffer.id}`}>
                    <button className="btn-outline w-full">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      AI 컨시어지에게 더 물어보기
                    </button>
                  </Link>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setLikedOffers((prev) =>
                          prev.includes(selectedOffer.id)
                            ? prev
                            : [...prev, selectedOffer.id]
                        );
                        setSelectedOffer(null);
                      }}
                      className={`flex-1 py-2.5 rounded-xl border font-medium transition-all ${
                        likedOffers.includes(selectedOffer.id)
                          ? 'border-brand-mint bg-brand-mint/10 text-brand-mint'
                          : 'border-border-light text-text-secondary hover:border-brand-mint hover:text-brand-mint'
                      }`}
                    >
                      <Heart className={`w-4 h-4 inline mr-1 ${likedOffers.includes(selectedOffer.id) ? 'fill-brand-mint' : ''}`} />
                      {likedOffers.includes(selectedOffer.id) ? '관심 등록됨' : '관심 등록'}
                    </button>
                    <button
                      onClick={(e) => openRejectModal(selectedOffer, e)}
                      disabled={isRejectLimited}
                      className="flex-1 py-2.5 rounded-xl border border-border-light text-text-secondary font-medium disabled:opacity-50"
                    >
                      <X className="w-4 h-4 inline mr-1" />
                      거절하기
                    </button>
                  </div>
                </div>
              </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 거절 모달 (센터 모달) */}
        <AnimatePresence>
          {showRejectModal && rejectTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm bg-white rounded-2xl p-6"
              >
                <div className="text-center mb-4">
                  <div className="w-14 h-14 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <X className="w-7 h-7 text-error" />
                  </div>
                  <h3 className="text-lg font-bold">{rejectTarget.hospital}</h3>
                  <p className="text-sm text-text-secondary">이 병원의 제안을 거절하시겠어요?</p>
                </div>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="거절 사유를 입력해주세요 (선택)"
                  className="w-full p-3 border border-border-light rounded-xl text-sm resize-none h-20 mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowRejectModal(false)}
                    className="flex-1 py-3 rounded-xl border border-border-light text-text-secondary font-medium"
                  >
                    취소
                  </button>
                  <button
                    onClick={confirmReject}
                    className="flex-1 py-3 rounded-xl bg-error text-white font-medium"
                  >
                    거절하기
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 거절 횟수 초기화 모달 */}
        <AnimatePresence>
          {showResetModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm bg-white rounded-2xl p-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-warning" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">오늘 거절 횟수를 모두 사용했어요</h3>
                  <p className="text-sm text-text-secondary">
                    아래 활동을 하면 거절 횟수가 초기화돼요!
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => handleResetLimit('profile')}
                    className="w-full p-4 border border-border-light rounded-xl text-left hover:border-brand-mint transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-brand-mint/10 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-brand-mint" />
                      </div>
                      <div>
                        <div className="font-semibold">프로필 업데이트</div>
                        <div className="text-xs text-text-secondary">이력서를 최신 상태로 유지하세요</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleResetLimit('referral')}
                    className="w-full p-4 border border-border-light rounded-xl text-left hover:border-brand-mint transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-info/10 rounded-full flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-info" />
                      </div>
                      <div>
                        <div className="font-semibold">친구 초대하기</div>
                        <div className="text-xs text-text-secondary">동료를 초대하고 함께 혜택을 받으세요</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleResetLimit('employee')}
                    className="w-full p-4 border border-border-light rounded-xl text-left hover:border-brand-mint transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                        <Share2 className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <div className="font-semibold">재직 경험 공유</div>
                        <div className="text-xs text-text-secondary">다녔던 병원의 정보를 공유해주세요</div>
                      </div>
                    </div>
                  </button>
                </div>

                <button
                  onClick={() => setShowResetModal(false)}
                  className="w-full py-3 text-text-secondary text-sm"
                >
                  다음에 할게요
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 프로필 업데이트 CTA 모달 */}
        <AnimatePresence>
          {showProfileCTA && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm bg-white rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold mb-4 text-center">프로필 업데이트</h3>
                <p className="text-sm text-text-secondary text-center mb-6">
                  프로필을 최신 상태로 유지하면<br />더 정확한 매칭을 받을 수 있어요!
                </p>
                <div className="space-y-3">
                  <Link href="/seeker/profile/edit">
                    <button
                      onClick={completeReset}
                      className="btn-primary w-full"
                    >
                      프로필 수정하러 가기
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowProfileCTA(false)}
                    className="w-full py-3 text-text-secondary text-sm"
                  >
                    취소
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 친구 초대 CTA 모달 */}
        <AnimatePresence>
          {showReferralCTA && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm bg-white rounded-2xl p-6"
              >
                <div className="text-center mb-5">
                  <div className="w-14 h-14 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <UserPlus className="w-7 h-7 text-info" />
                  </div>
                  <h3 className="text-lg font-bold">친구 초대하기</h3>
                  <p className="text-sm text-text-secondary mt-1">
                    동료를 초대하고 함께 혜택을 받으세요!
                  </p>
                </div>

                {/* 초대 링크 복사 */}
                <div className="bg-bg-secondary rounded-xl p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text-primary">내 초대 링크</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('https://mediinside.com/invite/USER123');
                        completeReset();
                      }}
                      className="text-xs text-brand-mint font-medium flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      복사하기
                    </button>
                  </div>
                  <div className="text-xs text-text-tertiary truncate">
                    https://mediinside.com/invite/USER123
                  </div>
                </div>

                {/* 또는 직접 입력 */}
                <div className="relative mb-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-light" />
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-2 text-text-tertiary">또는 직접 입력</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    value={referralName}
                    onChange={(e) => setReferralName(e.target.value)}
                    placeholder="친구 이름"
                    className="w-full p-3 border border-border-light rounded-xl text-sm"
                  />
                  <input
                    type="tel"
                    value={referralPhone}
                    onChange={(e) => setReferralPhone(e.target.value)}
                    placeholder="친구 연락처"
                    className="w-full p-3 border border-border-light rounded-xl text-sm"
                  />
                </div>
                <div className="space-y-3">
                  <button
                    onClick={completeReset}
                    disabled={!referralName || !referralPhone}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    초대장 보내기
                  </button>
                  <button
                    onClick={() => setShowReferralCTA(false)}
                    className="w-full py-3 text-text-secondary text-sm"
                  >
                    취소
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 재직 경험 공유 CTA 모달 */}
        <AnimatePresence>
          {showEmployeeCTA && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm bg-white rounded-2xl p-6"
              >
                <h3 className="text-lg font-bold mb-4 text-center">재직 경험 공유</h3>
                <p className="text-sm text-text-secondary text-center mb-6">
                  다녔던 병원의 경험을 공유해주시면<br />다른 분들께 큰 도움이 됩니다!
                </p>
                <div className="space-y-3">
                  <Link href="/seeker/concierge?action=share_experience">
                    <button
                      onClick={completeReset}
                      className="btn-primary w-full"
                    >
                      AI 컨시어지와 대화하기
                    </button>
                  </Link>
                  <button
                    onClick={() => setShowEmployeeCTA(false)}
                    className="w-full py-3 text-text-secondary text-sm"
                  >
                    취소
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 데이터 출처 상세 팝업 */}
        <AnimatePresence>
          {showDataSourcePopup && dataSourceTarget && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
              onClick={() => setShowDataSourcePopup(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm bg-white rounded-2xl p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">데이터 출처</h3>
                  <button
                    onClick={() => setShowDataSourcePopup(false)}
                    className="p-1 hover:bg-bg-secondary rounded-full"
                  >
                    <X className="w-5 h-5 text-text-tertiary" />
                  </button>
                </div>

                <div className="mb-4">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${tierInfo[dataSourceTarget.tier].color}`}>
                    {(() => {
                      const TierIcon = tierInfo[dataSourceTarget.tier].icon;
                      return <TierIcon className="w-4 h-4" />;
                    })()}
                    {tierInfo[dataSourceTarget.tier].label}
                  </div>
                </div>

                {dataSourceTarget.superProfile.dataSourceDetail && (
                  <div className="space-y-4">
                    {/* 공공데이터 */}
                    {dataSourceTarget.superProfile.dataSourceDetail.publicData.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Database className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-text-primary">공공데이터</span>
                        </div>
                        <div className="pl-6 space-y-1">
                          {dataSourceTarget.superProfile.dataSourceDetail.publicData.map((item: string, idx: number) => (
                            <div key={idx} className="text-sm text-text-secondary">• {item}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 시설정보 */}
                    {dataSourceTarget.superProfile.dataSourceDetail.facilityData.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-text-primary">시설 정보</span>
                        </div>
                        <div className="pl-6 space-y-1">
                          {dataSourceTarget.superProfile.dataSourceDetail.facilityData.map((item: string, idx: number) => (
                            <div key={idx} className="text-sm text-text-secondary">• {item}</div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 병원 인증 */}
                    {dataSourceTarget.superProfile.dataSourceDetail.certifiedBy && (
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm font-medium text-text-primary">인증 정보</span>
                        </div>
                        <div className="pl-6">
                          <div className="text-sm text-text-secondary">• {dataSourceTarget.superProfile.dataSourceDetail.certifiedBy}</div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-6 p-3 bg-bg-secondary rounded-xl">
                  <p className="text-xs text-text-tertiary leading-relaxed">
                    💡 Tier가 높을수록 더 많은 정보가 검증되어 신뢰도가 높아요.
                    병원이 직접 인증한 정보는 가장 정확합니다.
                  </p>
                </div>

                <button
                  onClick={() => setShowDataSourcePopup(false)}
                  className="w-full mt-4 py-3 bg-brand-mint text-white rounded-xl font-medium"
                >
                  확인
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}
