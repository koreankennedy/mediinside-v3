'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Users,
  Star,
  Sparkles,
  MapPin,
  DollarSign,
  Clock,
  Briefcase,
  Award,
  CheckCircle,
  AlertCircle,
  MessageCircle,
  Phone,
  Send,
  Heart,
  Share2,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Calendar,
  Building2,
  GraduationCap,
  FileText,
  ThumbsUp,
  ThumbsDown,
  Target,
  Zap,
  Video,
  Brain,
  MessageSquare,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

// 후보자 상세 데이터 맵 (URL ID에 따라 다른 데이터 표시)
const candidateDataMap: Record<string, { name: string; age: number; licenseType: string; experience: string; matchScore: number; location: string }> = {
  // 프로필 열람 후보자 (45명)
  'pv-1': { name: '김미진', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 95, location: '강남구 거주' },
  'pv-2': { name: '이은정', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 92, location: '서초구 거주' },
  'pv-3': { name: '박수진', age: 30, licenseType: '간호사', experience: '5년차', matchScore: 89, location: '송파구 거주' },
  'pv-4': { name: '정혜원', age: 26, licenseType: '간호사', experience: '2년차', matchScore: 90, location: '강남구 거주' },
  'pv-5': { name: '최지영', age: 32, licenseType: '간호사', experience: '6년차', matchScore: 88, location: '용산구 거주' },
  'pv-6': { name: '강민경', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 92, location: '마포구 거주' },
  'pv-7': { name: '윤서연', age: 28, licenseType: '간호사', experience: '3년차', matchScore: 89, location: '성동구 거주' },
  'pv-8': { name: '서지은', age: 30, licenseType: '간호사', experience: '5년차', matchScore: 87, location: '강동구 거주' },
  'pv-9': { name: '홍수민', age: 25, licenseType: '간호조무사', experience: '2년차', matchScore: 85, location: '영등포구 거주' },
  'pv-10': { name: '장미라', age: 27, licenseType: '간호조무사', experience: '3년차', matchScore: 84, location: '구로구 거주' },
  'pv-11': { name: '오세린', age: 28, licenseType: '간호사', experience: '4년차', matchScore: 91, location: '강남구 거주' },
  'pv-12': { name: '신예진', age: 26, licenseType: '간호사', experience: '2년차', matchScore: 86, location: '서초구 거주' },
  'pv-13': { name: '류현아', age: 25, licenseType: '간호조무사', experience: '2년차', matchScore: 83, location: '송파구 거주' },
  'pv-14': { name: '문지현', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 88, location: '강남구 거주' },
  'pv-15': { name: '배소희', age: 28, licenseType: '간호사', experience: '3년차', matchScore: 90, location: '용산구 거주' },
  'pv-16': { name: '손유진', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 87, location: '마포구 거주' },
  'pv-17': { name: '안수빈', age: 24, licenseType: '간호조무사', experience: '1년차', matchScore: 82, location: '성동구 거주' },
  'pv-18': { name: '유지아', age: 30, licenseType: '간호사', experience: '5년차', matchScore: 89, location: '강동구 거주' },
  'pv-19': { name: '임다희', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 85, location: '영등포구 거주' },
  'pv-20': { name: '장서윤', age: 31, licenseType: '간호사', experience: '6년차', matchScore: 91, location: '구로구 거주' },
  'pv-21': { name: '전미나', age: 25, licenseType: '간호조무사', experience: '2년차', matchScore: 80, location: '강남구 거주' },
  'pv-22': { name: '정수아', age: 28, licenseType: '간호사', experience: '4년차', matchScore: 88, location: '서초구 거주' },
  'pv-23': { name: '조은서', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 86, location: '송파구 거주' },
  'pv-24': { name: '차민지', age: 26, licenseType: '간호사', experience: '2년차', matchScore: 84, location: '강남구 거주' },
  'pv-25': { name: '최예은', age: 24, licenseType: '간호조무사', experience: '1년차', matchScore: 81, location: '용산구 거주' },
  'pv-26': { name: '한소연', age: 30, licenseType: '간호사', experience: '5년차', matchScore: 90, location: '마포구 거주' },
  'pv-27': { name: '황지수', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 87, location: '성동구 거주' },
  'pv-28': { name: '고유나', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 85, location: '강동구 거주' },
  'pv-29': { name: '권민서', age: 24, licenseType: '간호조무사', experience: '1년차', matchScore: 79, location: '영등포구 거주' },
  'pv-30': { name: '김나연', age: 31, licenseType: '간호사', experience: '6년차', matchScore: 92, location: '구로구 거주' },
  'pv-31': { name: '김다은', age: 28, licenseType: '간호사', experience: '4년차', matchScore: 88, location: '강남구 거주' },
  'pv-32': { name: '김보람', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 86, location: '서초구 거주' },
  'pv-33': { name: '김서현', age: 25, licenseType: '간호조무사', experience: '2년차', matchScore: 83, location: '송파구 거주' },
  'pv-34': { name: '김아름', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 89, location: '강남구 거주' },
  'pv-35': { name: '김연수', age: 26, licenseType: '간호사', experience: '2년차', matchScore: 84, location: '용산구 거주' },
  'pv-36': { name: '김은비', age: 28, licenseType: '간호사', experience: '4년차', matchScore: 87, location: '마포구 거주' },
  'pv-37': { name: '김주희', age: 24, licenseType: '간호조무사', experience: '1년차', matchScore: 80, location: '성동구 거주' },
  'pv-38': { name: '김지현', age: 30, licenseType: '간호사', experience: '5년차', matchScore: 91, location: '강동구 거주' },
  'pv-39': { name: '김하늘', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 85, location: '영등포구 거주' },
  'pv-40': { name: '김현정', age: 28, licenseType: '간호사', experience: '4년차', matchScore: 88, location: '구로구 거주' },
  'pv-41': { name: '김희선', age: 25, licenseType: '간호조무사', experience: '2년차', matchScore: 82, location: '강남구 거주' },
  'pv-42': { name: '나민주', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 86, location: '서초구 거주' },
  'pv-43': { name: '남지원', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 89, location: '송파구 거주' },
  'pv-44': { name: '노현아', age: 26, licenseType: '간호사', experience: '2년차', matchScore: 84, location: '강남구 거주' },
  'pv-45': { name: '도유진', age: 24, licenseType: '간호조무사', experience: '1년차', matchScore: 81, location: '용산구 거주' },
  // 인터뷰 제안 후보자 (12명)
  'ip-1': { name: '김미진', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 95, location: '강남구 거주' },
  'ip-2': { name: '이은정', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 92, location: '서초구 거주' },
  'ip-3': { name: '박수진', age: 30, licenseType: '간호사', experience: '5년차', matchScore: 89, location: '송파구 거주' },
  'ip-4': { name: '정혜원', age: 26, licenseType: '간호사', experience: '2년차', matchScore: 90, location: '강남구 거주' },
  'ip-5': { name: '최지영', age: 32, licenseType: '간호사', experience: '6년차', matchScore: 88, location: '용산구 거주' },
  'ip-6': { name: '강민경', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 92, location: '마포구 거주' },
  'ip-7': { name: '윤서연', age: 28, licenseType: '간호사', experience: '3년차', matchScore: 89, location: '성동구 거주' },
  'ip-8': { name: '서지은', age: 30, licenseType: '간호사', experience: '5년차', matchScore: 87, location: '강동구 거주' },
  'ip-9': { name: '오세린', age: 28, licenseType: '간호사', experience: '4년차', matchScore: 91, location: '영등포구 거주' },
  'ip-10': { name: '신예진', age: 26, licenseType: '간호조무사', experience: '2년차', matchScore: 86, location: '구로구 거주' },
  'ip-11': { name: '류현아', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 88, location: '강남구 거주' },
  'ip-12': { name: '문지현', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 87, location: '서초구 거주' },
  // AI 인터뷰 완료 후보자
  'aic-1': { name: '정민지', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 89, location: '송파구 거주' },
  'aic-2': { name: '강은비', age: 25, licenseType: '간호조무사', experience: '2년차', matchScore: 85, location: '강동구 거주' },
  'aic-3': { name: '임수정', age: 30, licenseType: '간호사', experience: '5년차', matchScore: 92, location: '강남구 거주' },
  'aic-4': { name: '한지원', age: 26, licenseType: '간호사', experience: '2년차', matchScore: 78, location: '서초구 거주' },
  'aic-5': { name: '박예진', age: 28, licenseType: '간호사', experience: '4년차', matchScore: 88, location: '용산구 거주' },
  'aic-6': { name: '조민서', age: 24, licenseType: '간호조무사', experience: '1년차', matchScore: 82, location: '마포구 거주' },
  'aic-7': { name: '김나영', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 91, location: '성동구 거주' },
  'aic-8': { name: '이하나', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 86, location: '강동구 거주' },
  // 대면면접 진행 후보자
  'fic-1': { name: '최수민', age: 28, licenseType: '간호사', experience: '4년차', matchScore: 90, location: '영등포구 거주' },
  'fic-2': { name: '김서현', age: 31, licenseType: '간호사', experience: '6년차', matchScore: 93, location: '구로구 거주' },
  'fic-3': { name: '박수진', age: 30, licenseType: '간호사', experience: '5년차', matchScore: 89, location: '강남구 거주' },
  // 오퍼 발송 후보자
  'os-1': { name: '이수현', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 93, location: '강남구 거주' },
  'os-2': { name: '박지민', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 88, location: '서초구 거주' },
  'os-3': { name: '김하은', age: 26, licenseType: '간호사', experience: '2년차', matchScore: 85, location: '송파구 거주' },
  'os-4': { name: '정유진', age: 30, licenseType: '간호사', experience: '5년차', matchScore: 91, location: '용산구 거주' },
  'os-5': { name: '최민서', age: 28, licenseType: '간호사', experience: '4년차', matchScore: 87, location: '마포구 거주' },
  // 합격자
  'h-1': { name: '이서연', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 94, location: '강남구 거주' },
  'h-2': { name: '김민지', age: 28, licenseType: '간호사', experience: '4년차', matchScore: 92, location: '서초구 거주' },
  // 퍼널 후보자
  'neg-1': { name: '김서현', age: 31, licenseType: '간호사', experience: '7년차', matchScore: 95, location: '강남구 거주' },
  'face-1': { name: '최수민', age: 28, licenseType: '간호사', experience: '4년차', matchScore: 90, location: '서초구 거주' },
  'ai-1': { name: '정민지', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 88, location: '송파구 거주' },
  'ai-2': { name: '강은비', age: 25, licenseType: '간호조무사', experience: '2년차', matchScore: 85, location: '강동구 거주' },
  'new-1': { name: '김하은', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 94, location: '강남구 거주' },
  'new-2': { name: '이지민', age: 29, licenseType: '간호사', experience: '5년차', matchScore: 91, location: '서초구 거주' },
  'new-3': { name: '박소연', age: 25, licenseType: '간호조무사', experience: '2년차', matchScore: 88, location: '송파구 거주' },
  // 기존 ID 지원 (숫자 ID)
  '1': { name: '김미진', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 95, location: '강남구 거주' },
  '2': { name: '이은정', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 92, location: '서초구 거주' },
  '3': { name: '박수진', age: 30, licenseType: '간호사', experience: '5년차', matchScore: 89, location: '송파구 거주' },
  // 공고수정 - 프로필 열람자 (viewer)
  'viewer-1': { name: '김미진', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 95, location: '강남구 거주' },
  'viewer-2': { name: '이은정', age: 27, licenseType: '간호사', experience: '3년차', matchScore: 92, location: '서초구 거주' },
  'viewer-3': { name: '박수진', age: 30, licenseType: '간호사', experience: '5년차', matchScore: 89, location: '송파구 거주' },
  'viewer-4': { name: '정혜원', age: 26, licenseType: '간호사', experience: '2년차', matchScore: 90, location: '강남구 거주' },
  'viewer-5': { name: '최지영', age: 32, licenseType: '간호사', experience: '6년차', matchScore: 88, location: '용산구 거주' },
  // 공고수정 - 지원자 (applicant)
  'applicant-1': { name: '김민지', age: 28, licenseType: '간호사', experience: '3년차', matchScore: 94, location: '강남구 거주' },
  'applicant-2': { name: '이서연', age: 30, licenseType: '간호사', experience: '5년차', matchScore: 91, location: '서초구 거주' },
  'applicant-3': { name: '박지현', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 88, location: '송파구 거주' },
  // 공고수정 - 매칭 후보 (matched)
  'matched-1': { name: '김민지', age: 28, licenseType: '간호사', experience: '3년차', matchScore: 94, location: '강남구 거주' },
  'matched-2': { name: '이서연', age: 30, licenseType: '간호사', experience: '5년차', matchScore: 91, location: '서초구 거주' },
  'matched-3': { name: '박지현', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 88, location: '송파구 거주' },
  'matched-4': { name: '정민지', age: 26, licenseType: '간호사', experience: '2년차', matchScore: 86, location: '강남구 거주' },
  // 지원자관리 칸반 (app)
  'app-1': { name: '김민지', age: 27, licenseType: '치과위생사', experience: '3년차', matchScore: 92, location: '강남구 거주' },
  'app-2': { name: '이서연', age: 29, licenseType: '치과위생사', experience: '5년차', matchScore: 88, location: '서초구 거주' },
  'app-3': { name: '박지현', age: 26, licenseType: '간호사', experience: '2년차', matchScore: 85, location: '송파구 거주' },
  'app-4': { name: '최수아', age: 28, licenseType: '치과위생사', experience: '4년차', matchScore: 90, location: '강남구 거주' },
  'app-5': { name: '정유진', age: 27, licenseType: '치과위생사', experience: '3년차', matchScore: 82, location: '용산구 거주' },
  'app-6': { name: '한소희', age: 30, licenseType: '간호사', experience: '6년차', matchScore: 95, location: '마포구 거주' },
  'app-7': { name: '강예린', age: 28, licenseType: '치과위생사', experience: '4년차', matchScore: 91, location: '성동구 거주' },
};

// 기본 후보자 데이터 (ID에 해당하는 데이터가 없을 때)
const defaultCandidateBase = { name: '김미진', age: 29, licenseType: '간호사', experience: '4년차', matchScore: 95, location: '강남구 거주' };

// 후보자 상세 데이터
const candidateData = {
  id: 1,
  name: '김미진',
  age: 29,
  licenseType: '간호사',
  experience: '4년차',
  fitType: 'achiever',
  fitTypeLabel: '하이엔드 성과자',
  matchScore: 95,
  location: '강남구 거주',
  phone: '010-****-5678',
  email: 'han****@email.com',
  profileImage: null,
  summary: '피부과 경력 3년차 간호사입니다. 레이저 시술 보조와 환자 상담에 강점이 있습니다.',

  // 경력
  careers: [
    {
      hospital: '강남 OO피부과',
      position: '간호사',
      period: '2021.03 ~ 현재',
      isCurrent: true,
      description: '레이저 시술 보조, 환자 상담 및 케어',
    },
    {
      hospital: '서초 XX의원',
      position: '간호사',
      period: '2019.03 ~ 2021.02',
      isCurrent: false,
      description: '일반 진료 보조, 환자 관리',
    },
  ],

  // 보유 술기
  skills: [
    { name: '레이저 시술 보조', level: 'expert' as const },
    { name: '피부 관리', level: 'advanced' as const },
    { name: '환자 상담', level: 'advanced' as const },
    { name: '필러/보톡스 보조', level: 'intermediate' as const },
  ],

  // 희망 조건
  preferences: {
    salary: { min: 400, max: 480, unit: '만원' },
    workType: '정규직',
    workHours: '주 5일 (9-6시)',
    regions: ['강남/서초', '송파/강동'],
  },

  // 피어리뷰 (동료/상급자 평가)
  peerReviews: [
    {
      id: 1,
      reviewer: '前 원장',
      relation: '원장',
      rating: 4.8,
      comment: '3년간 함께 일했는데 환자 관리가 꼼꼼하고, 시술 보조 실력이 뛰어납니다. 신입 교육도 잘 해주어서 팀 분위기에 좋은 영향을 줬어요. 이직 후에도 추천드립니다.',
      verified: true,
      reviewType: 'director',
    },
    {
      id: 2,
      reviewer: '前 수간호사',
      relation: '직속 상급자',
      rating: 4.5,
      comment: '책임감이 강하고 환자 응대가 친절합니다. 새로운 기술 습득에 적극적이에요. 야근이 있을 때도 묵묵히 일하는 모습이 인상적이었습니다.',
      verified: true,
      reviewType: 'supervisor',
    },
    {
      id: 3,
      reviewer: '동료 간호사',
      relation: '동료',
      rating: 4.8,
      comment: '협업을 잘하고 팀워크가 좋아요. 바쁜 시간에도 침착하게 대응합니다. 점심 때 같이 먹으면 분위기 메이커예요!',
      verified: true,
      reviewType: 'colleague',
    },
    {
      id: 4,
      reviewer: '후임 간호사',
      relation: '후임',
      rating: 5.0,
      comment: '신입 때 정말 많이 배웠어요. 어려운 케이스도 차근차근 설명해주시고, 실수해도 격려해주셔서 빨리 적응할 수 있었습니다.',
      verified: true,
      reviewType: 'junior',
    },
  ],

  // 강점 태그
  strengths: ['성과 지향적', '꼼꼼함', '환자 친화적', '빠른 학습'],

  // 관심 표시 여부
  isInterested: false,

  // AI 면접 리포트 데이터 (확장된 버전)
  aiInterview: {
    completedAt: '2024.01.15 14:32',
    duration: '18분 24초',
    totalScore: 87,
    grade: 'A',
    percentile: 92, // 상위 8%

    // 종합 점수 카테고리
    scores: {
      communication: { score: 92, label: '의사소통 능력', description: '환자 응대 시나리오에서 명확하고 친절한 답변', grade: 'A+' },
      expertise: { score: 85, label: '전문성', description: '피부과 시술 관련 지식 보유, 일부 최신 기술 학습 필요', grade: 'A' },
      problemSolving: { score: 88, label: '문제해결력', description: '응급 상황 대처 능력 우수', grade: 'A' },
      teamwork: { score: 90, label: '협업 능력', description: '팀 협력 상황에서 적극적인 자세', grade: 'A+' },
      motivation: { score: 80, label: '동기 및 열정', description: '이직 사유가 명확하고 성장 의지 있음', grade: 'B+' },
    },

    // 상세 역량 분석
    competencyAnalysis: {
      clinicalSkills: {
        score: 86,
        label: '임상 역량',
        details: [
          { item: '시술 보조 능력', score: 90, comment: '레이저 시술 보조 경험 풍부' },
          { item: '환자 상태 파악', score: 88, comment: '증상 확인 및 보고 체계적' },
          { item: '의료 지식', score: 82, comment: '기본 의료 지식 탄탄, 최신 트렌드 학습 필요' },
          { item: '안전 관리', score: 85, comment: '위생 및 안전 수칙 준수' },
        ],
      },
      softSkills: {
        score: 91,
        label: '소프트 스킬',
        details: [
          { item: '환자 응대', score: 95, comment: 'VIP 환자 응대에 적합한 친절함' },
          { item: '갈등 해결', score: 88, comment: '원만한 대화를 통한 해결 능력' },
          { item: '스트레스 관리', score: 85, comment: '바쁜 상황에서도 침착함 유지' },
          { item: '적응력', score: 90, comment: '새로운 환경에 빠르게 적응' },
        ],
      },
      leadership: {
        score: 78,
        label: '리더십',
        details: [
          { item: '후배 교육', score: 82, comment: '신입 교육 경험 있음' },
          { item: '업무 주도성', score: 75, comment: '지시받은 업무 수행에 충실' },
          { item: '의사결정', score: 72, comment: '독립적 판단보다 상급자 의견 존중' },
          { item: '책임감', score: 85, comment: '맡은 업무에 대한 책임감 높음' },
        ],
      },
    },

    // 성격/성향 분석
    personalityAnalysis: {
      fitType: 'high_end_achiever',
      fitTypeLabel: '하이엔드 성과자',
      traits: [
        { name: '성과 지향성', level: 85, description: '목표 달성에 대한 강한 동기' },
        { name: '완벽주의', level: 78, description: '업무 품질에 대한 높은 기준' },
        { name: '외향성', level: 72, description: '적당한 사교성, 환자 응대에 긍정적' },
        { name: '안정 추구', level: 65, description: '새로운 도전보다 안정적 환경 선호' },
        { name: '공감 능력', level: 88, description: '타인의 감정을 잘 이해하고 배려' },
      ],
      workStyle: {
        preferredIntensity: 'middle',
        intensityLabel: '보통',
        preferredProducts: ['bonus', 'vacation'],
        description: '적당한 업무량과 워라밸을 중시하며, 장기 근속 보상과 휴가 보장에 관심이 높습니다.',
      },
    },

    // 스트레스 대응력 분석
    stressAnalysis: {
      overallScore: 82,
      scenarios: [
        { situation: '바쁜 진료 시간', response: '침착하게 우선순위 정리', score: 85 },
        { situation: '까다로운 환자', response: '공감하며 차분하게 응대', score: 88 },
        { situation: '갑작스러운 변경', response: '일시적 당황 후 빠른 적응', score: 78 },
        { situation: '업무 실수', response: '즉시 보고 및 해결책 모색', score: 80 },
      ],
    },

    // 성장 잠재력
    growthPotential: {
      score: 85,
      strengths: ['학습 의지 높음', '피드백 수용적', '자기 개발에 투자'],
      areas: ['리더십 역량', '최신 장비 활용', '독립적 판단력'],
      recommendation: '6개월 이내 팀 리드 역할 가능, 1년 후 수간호사 후보 추천',
    },

    // 문화 적합도
    cultureFit: {
      score: 88,
      matchingFactors: [
        { factor: '팀워크 중시', match: 92 },
        { factor: '환자 중심 가치', match: 95 },
        { factor: '성장 지향 문화', match: 85 },
        { factor: '성과 보상 체계', match: 82 },
      ],
    },

    // 대화 요약 (더 많은 항목)
    conversationSummary: [
      {
        topic: '자기소개',
        question: '본인을 간단히 소개해주세요.',
        answer: '피부과에서 3년간 근무하며 레이저 시술 보조와 환자 상담을 담당했습니다. 특히 환자분들과의 소통을 중요하게 생각합니다.',
        evaluation: '경력과 강점을 명확히 어필',
        score: 90,
      },
      {
        topic: '이직 사유',
        question: '현재 직장에서 이직을 고려하시는 이유가 무엇인가요?',
        answer: '현 직장에서 많이 배웠지만, 더 큰 규모의 병원에서 다양한 시술을 경험하고 성장하고 싶습니다.',
        evaluation: '긍정적인 이직 동기, 성장 지향적',
        score: 85,
      },
      {
        topic: '문제 해결',
        question: '환자가 시술 후 부작용을 호소할 때 어떻게 대처하시겠습니까?',
        answer: '우선 환자의 상태를 확인하고 원장님께 즉시 보고 드립니다. 이후 환자분을 안심시키며 필요한 조치를 빠르게 진행합니다.',
        evaluation: '체계적인 대처 프로세스 이해',
        score: 88,
      },
      {
        topic: '팀워크',
        question: '동료와 갈등이 있었던 경험과 해결 방법을 말씀해주세요.',
        answer: '업무 분담 문제로 갈등이 있었는데, 점심시간에 대화를 나누며 서로의 입장을 이해했고, 이후 역할을 명확히 정해 해결했습니다.',
        evaluation: '갈등 해결에 적극적인 자세',
        score: 90,
      },
      {
        topic: '고객 서비스',
        question: 'VIP 환자가 불만을 표시하면 어떻게 대응하시겠습니까?',
        answer: '우선 환자분의 말씀을 끝까지 경청하고, 불편하신 부분에 대해 진심으로 사과드립니다. 그리고 즉시 해결 가능한 부분은 바로 처리하고, 시간이 필요한 부분은 정확한 해결 방안과 일정을 안내드립니다.',
        evaluation: '고객 중심적 태도, 체계적인 문제해결',
        score: 92,
      },
      {
        topic: '업무 스타일',
        question: '업무 중 예상치 못한 상황이 발생했을 때 어떻게 대처하시나요?',
        answer: '당황하지 않고 현재 상황을 빠르게 파악합니다. 혼자 해결 가능한 문제인지, 상급자의 도움이 필요한지 판단한 후 적절히 대응합니다.',
        evaluation: '상황 판단력과 침착함 우수',
        score: 85,
      },
      {
        topic: '성장 목표',
        question: '5년 후 본인의 커리어 목표는 무엇인가요?',
        answer: '5년 후에는 피부과 분야의 전문성을 인정받아 팀을 이끌 수 있는 선임 간호사가 되고 싶습니다. 후배들을 잘 이끌고 병원 발전에 기여하고 싶어요.',
        evaluation: '명확한 성장 목표와 조직 기여 의지',
        score: 82,
      },
      {
        topic: '강점과 약점',
        question: '본인의 강점과 개선이 필요한 점을 말씀해주세요.',
        answer: '강점은 환자분들과의 소통입니다. 환자분들이 편하게 말씀하실 수 있는 분위기를 만드는 것을 잘합니다. 개선점은 새로운 장비 적응에 시간이 걸리는 편이라, 미리 공부를 많이 하려고 합니다.',
        evaluation: '자기 객관화 능력 있음, 개선 의지 표명',
        score: 80,
      },
    ],

    // AI 종합 인사이트
    aiInsights: [
      '환자 응대에 강점이 있어 VIP 고객 담당에 적합',
      '협업 능력이 뛰어나 팀 분위기에 긍정적 영향 예상',
      '성장 욕구가 높아 교육 투자 시 빠른 발전 기대',
      '스트레스 상황에서 침착함을 유지하는 능력 우수',
      '장기 근속 가능성이 높은 안정적 성향',
    ],
    concerns: [
      '최신 레이저 장비 사용 경험이 부족할 수 있음 → 입사 후 교육 필요',
      '독립적 판단보다 지시에 따르는 경향 → 리더십 역할 시 코칭 필요',
    ],

    // 채용 추천 종합
    hiringRecommendation: {
      recommend: true,
      confidence: 92,
      summary: '전반적으로 우수한 후보자입니다. 환자 응대 능력과 협업 역량이 뛰어나며, 팀 분위기에 긍정적 영향을 줄 것으로 예상됩니다.',
      suggestedRole: '시술 보조 및 환자 상담 담당',
      expectedAdaptation: '2-3주',
      matchingProducts: ['bonus', 'vacation'],
    },
  },

  // 선호 업무강도 및 채용상품
  preferredIntensity: 'middle' as const,
  preferredProducts: ['bonus', 'vacation'],
};

// 우리 병원 조건
const hospitalConditions = {
  salary: { min: 380, max: 450 },
  workType: '정규직',
  workHours: '주 5일 (9-6시)',
  location: '강남구 청담동',
  benefits: ['인센티브 제도', '교육 지원', '연차 자유 사용'],
};

// 기존 직원 유형 분포
const teamFitData = {
  totalEmployees: 8,
  typeDistribution: [
    { type: '하이엔드 성과자', count: 3, percent: 37 },
    { type: '안정 지향 전문가', count: 2, percent: 25 },
    { type: '성장 추구자', count: 2, percent: 25 },
    { type: '밸런스 조율자', count: 1, percent: 13 },
  ],
  similarColleague: {
    name: '김OO 간호사',
    type: '하이엔드 성과자',
    experience: '5년차',
    joinedYear: 2020,
  },
};

// 스킬 레벨 타입
type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

const skillLevelColors: Record<SkillLevel, string> = {
  beginner: 'bg-bg-secondary text-text-tertiary',
  intermediate: 'bg-info/10 text-info',
  advanced: 'bg-brand-mint/10 text-brand-mint',
  expert: 'bg-expert-navy/10 text-expert-navy',
};

const skillLevelLabels: Record<SkillLevel, string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
  expert: '전문가',
};

export default function CandidateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const candidateId = params.id as string;

  // URL에서 탭 쿼리 파라미터 읽기
  const tabParam = searchParams.get('tab');
  const initialTab = (tabParam === 'ai-report' || tabParam === 'compare' || tabParam === 'review')
    ? tabParam as 'ai-report' | 'compare' | 'review'
    : 'profile';

  // URL ID에 따라 후보자 기본 정보 조회
  const candidateBase = candidateDataMap[candidateId] || defaultCandidateBase;

  // 실제 표시할 데이터 (candidateData에 동적 데이터 오버라이드)
  const displayCandidate = {
    ...candidateData,
    name: candidateBase.name,
    age: candidateBase.age,
    licenseType: candidateBase.licenseType,
    experience: candidateBase.experience,
    matchScore: candidateBase.matchScore,
    location: candidateBase.location,
  };

  const [activeTab, setActiveTab] = useState<'profile' | 'compare' | 'review' | 'ai-report'>(initialTab);

  // URL 변경 시 탭 업데이트
  useEffect(() => {
    if (tabParam === 'ai-report' || tabParam === 'compare' || tabParam === 'review') {
      setActiveTab(tabParam);
    }
  }, [tabParam]);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [isInterested, setIsInterested] = useState(displayCandidate.isInterested);
  const [showProposal, setShowProposal] = useState(false);

  // 조건 비교 함수
  const compareCondition = (candidateValue: number, hospitalMin: number, hospitalMax: number) => {
    if (candidateValue <= hospitalMax && candidateValue >= hospitalMin) {
      return 'match';
    } else if (candidateValue > hospitalMax) {
      return 'above';
    } else {
      return 'below';
    }
  };

  const salaryCompare = compareCondition(
    displayCandidate.preferences.salary.min,
    hospitalConditions.salary.min,
    hospitalConditions.salary.max
  );

  return (
    <div className="min-h-screen bg-bg-secondary pb-32">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-border-light">
        <div className="px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
          >
            <ArrowLeft className="w-5 h-5 text-text-primary" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInterested(!isInterested)}
              className={`p-2 rounded-xl ${isInterested ? 'bg-error/10' : 'bg-bg-secondary'}`}
            >
              <Heart className={`w-5 h-5 ${isInterested ? 'text-error fill-error' : 'text-text-tertiary'}`} />
            </button>
            <button className="p-2 rounded-xl bg-bg-secondary">
              <Share2 className="w-5 h-5 text-text-tertiary" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'profile'
                ? 'bg-expert-navy text-white'
                : 'bg-bg-secondary text-text-secondary'
            }`}
          >
            프로필
          </button>
          <button
            onClick={() => setActiveTab('ai-report')}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'ai-report'
                ? 'bg-expert-navy text-white'
                : 'bg-bg-secondary text-text-secondary'
            }`}
          >
            AI면접
          </button>
          <button
            onClick={() => setActiveTab('compare')}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'compare'
                ? 'bg-expert-navy text-white'
                : 'bg-bg-secondary text-text-secondary'
            }`}
          >
            조건비교
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium ${
              activeTab === 'review'
                ? 'bg-expert-navy text-white'
                : 'bg-bg-secondary text-text-secondary'
            }`}
          >
            피어리뷰
          </button>
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="px-4 py-4 space-y-4">
          {/* 기본 정보 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 border border-border-light"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 bg-expert-navy/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-expert-navy" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-xl font-bold text-text-primary">{displayCandidate.name}</h1>
                  <span className="text-xs bg-brand-mint/10 text-brand-mint px-2 py-0.5 rounded">
                    {displayCandidate.fitTypeLabel}
                  </span>
                </div>
                <div className="text-sm text-text-secondary">
                  {displayCandidate.licenseType} · {displayCandidate.experience}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <MapPin className="w-3 h-3 text-text-tertiary" />
                  <span className="text-xs text-text-tertiary">{displayCandidate.location}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-brand-mint">{displayCandidate.matchScore}%</div>
                <div className="text-xs text-text-tertiary">매칭</div>
              </div>
            </div>

            <p className="text-sm text-text-secondary mb-4">{displayCandidate.summary}</p>

            <div className="flex flex-wrap gap-2">
              {displayCandidate.strengths.map((strength, i) => (
                <span
                  key={i}
                  className="text-xs bg-success/10 text-success px-2 py-1 rounded"
                >
                  {strength}
                </span>
              ))}
            </div>
          </motion.div>

          {/* 경력 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-expert-navy" />
              경력
            </h2>
            <div className="space-y-3">
              {displayCandidate.careers.map((career, index) => (
                <div key={index} className="relative pl-4 border-l-2 border-border-light">
                  <div className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full ${
                    career.isCurrent ? 'bg-brand-mint' : 'bg-bg-tertiary'
                  }`} />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-text-primary text-sm">{career.hospital}</span>
                    {career.isCurrent && (
                      <span className="text-xs bg-brand-mint/10 text-brand-mint px-1.5 py-0.5 rounded">재직중</span>
                    )}
                  </div>
                  <div className="text-xs text-text-secondary">{career.position} · {career.period}</div>
                  <div className="text-xs text-text-tertiary mt-1">{career.description}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 보유 술기 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Award className="w-5 h-5 text-match-gold" />
              보유 술기
            </h2>
            <div className="space-y-2">
              {displayCandidate.skills.map((skill, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-text-primary">{skill.name}</span>
                  <span className={`text-xs px-2 py-1 rounded ${skillLevelColors[skill.level]}`}>
                    {skillLevelLabels[skill.level]}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 희망 조건 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-mint" />
              희망 조건
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-text-tertiary" />
                  <span className="text-sm text-text-secondary">희망 연봉</span>
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {displayCandidate.preferences.salary.min}~{displayCandidate.preferences.salary.max}만원
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-text-tertiary" />
                  <span className="text-sm text-text-secondary">근무 형태</span>
                </div>
                <span className="text-sm font-medium text-text-primary">{displayCandidate.preferences.workType}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-text-tertiary" />
                  <span className="text-sm text-text-secondary">근무 시간</span>
                </div>
                <span className="text-sm font-medium text-text-primary">{displayCandidate.preferences.workHours}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-text-tertiary" />
                  <span className="text-sm text-text-secondary">희망 지역</span>
                </div>
                <span className="text-sm font-medium text-text-primary">
                  {displayCandidate.preferences.regions.join(', ')}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* AI Interview Report Tab - 확장된 버전 */}
      {activeTab === 'ai-report' && (
        <div className="px-4 py-4 space-y-4">
          {/* AI면접 점수 요약 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-expert-navy to-expert-navy/80 rounded-2xl p-5 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-white/70">AI 면접 종합 점수</div>
                <div className="flex items-baseline gap-2">
                  <div className="text-4xl font-bold">{displayCandidate.aiInterview.totalScore}점</div>
                  <span className="text-xl font-bold text-match-gold">{displayCandidate.aiInterview.grade}</span>
                </div>
                <div className="text-sm text-white/60 mt-1">상위 {100 - candidateData.aiInterview.percentile}%</div>
              </div>
              <div className="w-20 h-20 relative">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="40" cy="40" r="36" stroke="rgba(255,255,255,0.2)" strokeWidth="8" fill="none" />
                  <circle cx="40" cy="40" r="36" stroke="#00D09E" strokeWidth="8" fill="none" strokeDasharray={`${(candidateData.aiInterview.totalScore / 100) * 226} 226`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {displayCandidate.aiInterview.duration}
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {displayCandidate.aiInterview.completedAt}
              </div>
            </div>
          </motion.div>

          {/* 채용 추천 종합 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={`rounded-2xl p-4 border ${displayCandidate.aiInterview.hiringRecommendation.recommend ? 'bg-success/5 border-success/20' : 'bg-warning/5 border-warning/20'}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${displayCandidate.aiInterview.hiringRecommendation.recommend ? 'bg-success/10' : 'bg-warning/10'}`}>
                {displayCandidate.aiInterview.hiringRecommendation.recommend ? (
                  <ThumbsUp className="w-6 h-6 text-success" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-warning" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`font-bold ${displayCandidate.aiInterview.hiringRecommendation.recommend ? 'text-success' : 'text-warning'}`}>
                    {displayCandidate.aiInterview.hiringRecommendation.recommend ? '채용 추천' : '보류 권장'}
                  </span>
                  <span className="text-xs bg-white px-2 py-0.5 rounded-full text-text-secondary">
                    신뢰도 {displayCandidate.aiInterview.hiringRecommendation.confidence}%
                  </span>
                </div>
                <p className="text-sm text-text-secondary">{displayCandidate.aiInterview.hiringRecommendation.summary}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-xs bg-white px-2 py-1 rounded text-text-secondary">
                    추천 역할: {displayCandidate.aiInterview.hiringRecommendation.suggestedRole}
                  </span>
                  <span className="text-xs bg-white px-2 py-1 rounded text-text-secondary">
                    예상 적응기간: {displayCandidate.aiInterview.hiringRecommendation.expectedAdaptation}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 지원자 선호 조건 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-brand-mint" />
              지원자 업무 선호도
            </h2>
            <div className="bg-bg-secondary rounded-xl p-3 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-text-primary">희망 업무강도</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  candidateData.aiInterview.personalityAnalysis.workStyle.preferredIntensity === 'low' ? 'bg-success/10 text-success' :
                  candidateData.aiInterview.personalityAnalysis.workStyle.preferredIntensity === 'middle' ? 'bg-warning/10 text-warning' :
                  'bg-error/10 text-error'
                }`}>
                  {displayCandidate.aiInterview.personalityAnalysis.workStyle.intensityLabel}
                </span>
              </div>
              <p className="text-xs text-text-secondary">{displayCandidate.aiInterview.personalityAnalysis.workStyle.description}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-text-primary block mb-2">선호 채용상품</span>
              <div className="flex gap-2">
                {displayCandidate.aiInterview.personalityAnalysis.workStyle.preferredProducts.map((product) => {
                  const productMap: Record<string, { label: string; color: string; icon: string }> = {
                    share: { label: '매출 셰어', color: '#FF2D55', icon: '💰' },
                    bonus: { label: '근속 보너스', color: '#AF52DE', icon: '🎁' },
                    vacation: { label: '휴가 자유', color: '#5AC8FA', icon: '🏖️' },
                    allowance: { label: '수당 보장', color: '#FF9500', icon: '💵' },
                  };
                  const info = productMap[product];
                  return (
                    <span key={product} className="text-xs px-2 py-1 rounded-full text-white" style={{ backgroundColor: info?.color }}>
                      {info?.icon} {info?.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* 항목별 점수 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-expert-navy" />
              핵심 역량 점수
            </h2>
            <div className="space-y-4">
              {Object.entries(candidateData.aiInterview.scores).map(([key, item]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-text-primary">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                        item.grade.includes('A') ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'
                      }`}>{item.grade}</span>
                      <span className={`text-sm font-bold ${
                        item.score >= 90 ? 'text-success' : item.score >= 80 ? 'text-brand-mint' : 'text-warning'
                      }`}>
                        {item.score}점
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-bg-secondary rounded-full overflow-hidden mb-1">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className={`h-full rounded-full ${
                        item.score >= 90 ? 'bg-success' : item.score >= 80 ? 'bg-brand-mint' : 'bg-warning'
                      }`}
                    />
                  </div>
                  <p className="text-xs text-text-tertiary">{item.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 상세 역량 분석 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-match-gold" />
              상세 역량 분석
            </h2>
            {Object.entries(candidateData.aiInterview.competencyAnalysis).map(([key, category]) => (
              <div key={key} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">{category.label}</span>
                  <span className="text-sm font-bold text-brand-mint">{category.score}점</span>
                </div>
                <div className="bg-bg-secondary rounded-xl p-3 space-y-2">
                  {category.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex-1">
                        <span className="text-xs text-text-secondary">{detail.item}</span>
                        <div className="h-1.5 bg-white rounded-full overflow-hidden mt-1">
                          <div className={`h-full rounded-full ${detail.score >= 90 ? 'bg-success' : detail.score >= 80 ? 'bg-brand-mint' : 'bg-warning'}`} style={{ width: `${detail.score}%` }} />
                        </div>
                      </div>
                      <span className="text-xs font-medium text-text-primary ml-3 w-8 text-right">{detail.score}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>

          {/* 성격/성향 분석 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Brain className="w-5 h-5 text-info" />
              성격/성향 분석
            </h2>
            <div className="bg-info/5 rounded-xl p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium text-info">{displayCandidate.aiInterview.personalityAnalysis.fitTypeLabel}</span>
              </div>
            </div>
            <div className="space-y-3">
              {displayCandidate.aiInterview.personalityAnalysis.traits.map((trait, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-secondary">{trait.name}</span>
                    <span className="text-xs font-medium text-text-primary">{trait.level}%</span>
                  </div>
                  <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-info rounded-full" style={{ width: `${trait.level}%` }} />
                  </div>
                  <p className="text-[10px] text-text-tertiary mt-0.5">{trait.description}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 스트레스 대응력 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-warning" />
              스트레스 대응력
              <span className="text-sm font-bold text-brand-mint ml-auto">{displayCandidate.aiInterview.stressAnalysis.overallScore}점</span>
            </h2>
            <div className="space-y-2">
              {displayCandidate.aiInterview.stressAnalysis.scenarios.map((scenario, idx) => (
                <div key={idx} className="bg-bg-secondary rounded-lg p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-text-primary">{scenario.situation}</span>
                    <span className={`text-xs font-bold ${scenario.score >= 85 ? 'text-success' : scenario.score >= 75 ? 'text-brand-mint' : 'text-warning'}`}>{scenario.score}점</span>
                  </div>
                  <p className="text-[10px] text-text-secondary">{scenario.response}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 성장 잠재력 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              성장 잠재력
              <span className="text-sm font-bold text-success ml-auto">{displayCandidate.aiInterview.growthPotential.score}점</span>
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div className="bg-success/5 rounded-xl p-3">
                <div className="text-xs text-text-tertiary mb-2">강점</div>
                {displayCandidate.aiInterview.growthPotential.strengths.map((s, i) => (
                  <div key={i} className="flex items-center gap-1 text-xs text-success mb-1">
                    <CheckCircle className="w-3 h-3" />{s}
                  </div>
                ))}
              </div>
              <div className="bg-warning/5 rounded-xl p-3">
                <div className="text-xs text-text-tertiary mb-2">개발 영역</div>
                {displayCandidate.aiInterview.growthPotential.areas.map((a, i) => (
                  <div key={i} className="flex items-center gap-1 text-xs text-warning mb-1">
                    <AlertCircle className="w-3 h-3" />{a}
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-brand-mint/5 rounded-lg p-3">
              <div className="flex items-center gap-1 text-xs text-brand-mint">
                <Sparkles className="w-3 h-3" />
                <span className="font-medium">AI 추천</span>
              </div>
              <p className="text-xs text-text-secondary mt-1">{displayCandidate.aiInterview.growthPotential.recommendation}</p>
            </div>
          </motion.div>

          {/* 문화 적합도 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <h2 className="font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-expert-navy" />
              조직 문화 적합도
              <span className="text-sm font-bold text-brand-mint ml-auto">{displayCandidate.aiInterview.cultureFit.score}%</span>
            </h2>
            <div className="space-y-2">
              {displayCandidate.aiInterview.cultureFit.matchingFactors.map((factor, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-secondary">{factor.factor}</span>
                    <span className="text-xs font-medium text-text-primary">{factor.match}%</span>
                  </div>
                  <div className="h-1.5 bg-bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-expert-navy rounded-full" style={{ width: `${factor.match}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI 인사이트 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-brand-mint/5 border border-brand-mint/20 rounded-2xl p-4"
          >
            <h2 className="font-semibold text-brand-mint mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              AI 종합 인사이트
            </h2>
            <div className="space-y-2">
              {displayCandidate.aiInterview.aiInsights.map((insight, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-brand-mint flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-text-secondary">{insight}</span>
                </div>
              ))}
            </div>
            {displayCandidate.aiInterview.concerns.length > 0 && (
              <div className="mt-3 pt-3 border-t border-brand-mint/20">
                <div className="text-xs text-text-tertiary mb-2">유의 사항</div>
                {displayCandidate.aiInterview.concerns.map((concern, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-text-secondary">{concern}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {/* 면접 대화 요약 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-info" />
              면접 대화 기록 ({displayCandidate.aiInterview.conversationSummary.length}개 문항)
            </h2>
            <div className="space-y-4">
              {displayCandidate.aiInterview.conversationSummary.map((conv, index) => (
                <div key={index} className="border-l-2 border-info/30 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-info/10 text-info px-2 py-0.5 rounded font-medium">
                      {conv.topic}
                    </span>
                    <span className={`text-xs font-bold ${conv.score >= 90 ? 'text-success' : conv.score >= 80 ? 'text-brand-mint' : 'text-warning'}`}>
                      {conv.score}점
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="text-xs text-text-tertiary mb-1">질문</div>
                    <p className="text-sm text-text-secondary">{conv.question}</p>
                  </div>
                  <div className="mb-2">
                    <div className="text-xs text-text-tertiary mb-1">답변</div>
                    <p className="text-sm text-text-primary bg-bg-secondary rounded-lg p-3">
                      &ldquo;{conv.answer}&rdquo;
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Brain className="w-3 h-3 text-brand-mint" />
                    <span className="text-xs text-brand-mint">{conv.evaluation}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}

      {/* Compare Tab */}
      {activeTab === 'compare' && (
        <div className="px-4 py-4 space-y-4">
          {/* 매칭 점수 요약 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-brand-mint to-brand-mint-dark rounded-2xl p-5 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-sm text-white/70">종합 매칭 점수</div>
                <div className="text-4xl font-bold">{displayCandidate.matchScore}%</div>
              </div>
              <div className="w-20 h-20 relative">
                <svg className="w-full h-full -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="#fff"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(candidateData.matchScore / 100) * 226} 226`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
            <div className="text-sm text-white/90">
              우리 병원 조건과 <strong>매우 잘 맞는</strong> 후보자예요!
            </div>
          </motion.div>

          {/* 조건별 비교 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <h2 className="font-semibold text-text-primary mb-4">조건 비교</h2>
            <div className="space-y-4">
              {/* 연봉 */}
              <div className="p-3 bg-bg-secondary rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">연봉</span>
                  {salaryCompare === 'match' ? (
                    <span className="text-xs text-success flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> 일치
                    </span>
                  ) : salaryCompare === 'above' ? (
                    <span className="text-xs text-warning flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> 조정 필요
                    </span>
                  ) : (
                    <span className="text-xs text-success flex items-center gap-1">
                      <TrendingDown className="w-3 h-3" /> 유리
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-text-tertiary">후보자 희망: </span>
                    <span className="font-medium text-text-primary">
                      {displayCandidate.preferences.salary.min}~{displayCandidate.preferences.salary.max}만원
                    </span>
                  </div>
                  <div>
                    <span className="text-text-tertiary">우리 병원: </span>
                    <span className="font-medium text-expert-navy">
                      {hospitalConditions.salary.min}~{hospitalConditions.salary.max}만원
                    </span>
                  </div>
                </div>
              </div>

              {/* 근무 형태 */}
              <div className="p-3 bg-bg-secondary rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">근무 형태</span>
                  <span className="text-xs text-success flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> 일치
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-text-tertiary">후보자 희망: </span>
                    <span className="font-medium text-text-primary">{displayCandidate.preferences.workType}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary">우리 병원: </span>
                    <span className="font-medium text-expert-navy">{hospitalConditions.workType}</span>
                  </div>
                </div>
              </div>

              {/* 근무 시간 */}
              <div className="p-3 bg-bg-secondary rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">근무 시간</span>
                  <span className="text-xs text-success flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> 일치
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-text-tertiary">후보자 희망: </span>
                    <span className="font-medium text-text-primary">{displayCandidate.preferences.workHours}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary">우리 병원: </span>
                    <span className="font-medium text-expert-navy">{hospitalConditions.workHours}</span>
                  </div>
                </div>
              </div>

              {/* 위치 */}
              <div className="p-3 bg-bg-secondary rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-text-primary">위치</span>
                  <span className="text-xs text-success flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> 선호 지역 내
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="text-text-tertiary">후보자 희망: </span>
                    <span className="font-medium text-text-primary">{displayCandidate.preferences.regions.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-text-tertiary">우리 병원: </span>
                    <span className="font-medium text-expert-navy">{hospitalConditions.location}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 팀 적합도 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <h2 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-expert-navy" />
              팀 적합도 분석
            </h2>

            <div className="mb-4">
              <div className="text-xs text-text-secondary mb-2">우리 팀 유형 분포</div>
              <div className="space-y-2">
                {teamFitData.typeDistribution.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className={`font-medium ${
                        item.type === candidateData.fitTypeLabel ? 'text-brand-mint' : 'text-text-secondary'
                      }`}>
                        {item.type}
                        {item.type === candidateData.fitTypeLabel && (
                          <span className="ml-1 text-brand-mint">← 후보자</span>
                        )}
                      </span>
                      <span className="text-text-tertiary">{item.count}명 ({item.percent}%)</span>
                    </div>
                    <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          item.type === candidateData.fitTypeLabel ? 'bg-brand-mint' : 'bg-expert-navy/30'
                        }`}
                        style={{ width: `${item.percent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 비슷한 동료 */}
            <div className="bg-brand-mint/5 border border-brand-mint/20 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-brand-mint" />
                <span className="text-sm font-medium text-brand-mint">비슷한 성향의 동료</span>
              </div>
              <p className="text-xs text-text-secondary">
                <strong>{teamFitData.similarColleague.name}</strong> ({teamFitData.similarColleague.experience})
                님과 같은 &apos;{teamFitData.similarColleague.type}&apos; 유형이에요.
                {teamFitData.similarColleague.joinedYear}년 입사 후 현재까지 좋은 성과를 내고 있어요.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Review Tab */}
      {activeTab === 'review' && (
        <div className="px-4 py-4 space-y-4">
          {/* 피어리뷰 요약 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 border border-border-light"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-text-primary">피어리뷰</h2>
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 text-match-gold fill-match-gold" />
                <span className="text-lg font-bold text-text-primary">4.8</span>
                <span className="text-xs text-text-tertiary">/ 5.0</span>
              </div>
            </div>
            {/* 리뷰 유형별 요약 */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <div className="bg-expert-navy/5 rounded-lg p-2 text-center">
                <div className="text-xs text-text-tertiary mb-1">원장</div>
                <div className="text-sm font-bold text-expert-navy">1</div>
              </div>
              <div className="bg-brand-mint/5 rounded-lg p-2 text-center">
                <div className="text-xs text-text-tertiary mb-1">상급자</div>
                <div className="text-sm font-bold text-brand-mint">1</div>
              </div>
              <div className="bg-info/5 rounded-lg p-2 text-center">
                <div className="text-xs text-text-tertiary mb-1">동료</div>
                <div className="text-sm font-bold text-info">1</div>
              </div>
              <div className="bg-warning/5 rounded-lg p-2 text-center">
                <div className="text-xs text-text-tertiary mb-1">후임</div>
                <div className="text-sm font-bold text-warning">1</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-text-secondary">
              <span>{displayCandidate.peerReviews.length}개의 리뷰</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-success">
                <CheckCircle className="w-3 h-3" />
                전원 인증 완료
              </span>
            </div>
          </motion.div>

          {/* 리뷰 목록 */}
          <div className="space-y-3">
            {displayCandidate.peerReviews.map((review, index) => {
              const reviewTypeConfig: Record<string, { bg: string; text: string; label: string }> = {
                director: { bg: 'bg-expert-navy/10', text: 'text-expert-navy', label: '원장 리뷰' },
                supervisor: { bg: 'bg-brand-mint/10', text: 'text-brand-mint', label: '상급자 리뷰' },
                colleague: { bg: 'bg-info/10', text: 'text-info', label: '동료 리뷰' },
                junior: { bg: 'bg-warning/10', text: 'text-warning', label: '후임 리뷰' },
              };
              const config = reviewTypeConfig[(review as {reviewType?: string}).reviewType || 'colleague'];

              return (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-2xl p-4 border border-border-light ${
                    (review as {reviewType?: string}).reviewType === 'director' ? 'ring-2 ring-expert-navy/20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs ${config.bg} ${config.text} px-2 py-0.5 rounded font-medium`}>
                          {config.label}
                        </span>
                        <span className="font-medium text-text-primary">{review.reviewer}</span>
                        {review.verified && (
                          <span className="text-xs bg-success/10 text-success px-1.5 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            인증됨
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-text-secondary mt-1">{review.relation}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-match-gold fill-match-gold" />
                      <span className="font-bold text-text-primary">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  {(review as {reviewType?: string}).reviewType === 'director' && (
                    <div className="mt-3 pt-3 border-t border-border-light">
                      <div className="flex items-center gap-2 text-xs text-expert-navy">
                        <Sparkles className="w-3 h-3" />
                        <span>원장이 직접 작성한 추천 리뷰입니다</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* 리뷰 신뢰도 안내 */}
          <div className="bg-info/10 border border-info/20 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-info flex-shrink-0 mt-0.5" />
              <div className="text-xs text-text-secondary">
                피어리뷰는 실제 함께 근무한 동료와 상급자의 인증된 평가입니다.
                재직 여부가 확인된 리뷰만 게재됩니다.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Bar - 탭별 동적 CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border-light px-4 py-4 z-20">
        {activeTab === 'profile' && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowContactInfo(true)}
              className="flex-1 py-3 border border-expert-navy text-expert-navy rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              연락처 확인
            </button>
            <button
              onClick={() => setShowProposal(true)}
              className="flex-1 py-3 bg-expert-navy text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              채용 제안하기
            </button>
          </div>
        )}
        {activeTab === 'ai-report' && (
          <div className="flex gap-3">
            <button
              onClick={() => alert('AI 리포트가 공유되었습니다.')}
              className="flex-1 py-3 border border-info text-info rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              리포트 공유
            </button>
            <button
              onClick={() => alert('대면면접 일정 조율 요청을 보냈습니다.')}
              className="flex-1 py-3 bg-expert-navy text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              대면면접 일정잡기
            </button>
          </div>
        )}
        {activeTab === 'compare' && (
          <div className="flex gap-3">
            <button
              onClick={() => alert('관심 후보자로 저장되었습니다.')}
              className="flex-1 py-3 border border-warning text-warning rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Heart className="w-5 h-5" />
              관심 표시
            </button>
            <button
              onClick={() => setShowProposal(true)}
              className="flex-1 py-3 bg-expert-navy text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              채용 제안하기
            </button>
          </div>
        )}
        {activeTab === 'review' && (
          <div className="flex gap-3">
            <button
              onClick={() => setShowContactInfo(true)}
              className="flex-1 py-3 border border-text-tertiary text-text-secondary rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              추가 리뷰 요청
            </button>
            <button
              onClick={() => setShowProposal(true)}
              className="flex-1 py-3 bg-expert-navy text-white rounded-xl font-medium flex items-center justify-center gap-2"
            >
              <Send className="w-5 h-5" />
              채용 제안하기
            </button>
          </div>
        )}
      </div>

      {/* 연락처 모달 */}
      <AnimatePresence>
        {showContactInfo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowContactInfo(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-2xl p-6"
            >
              <h3 className="text-lg font-bold text-text-primary mb-4">연락처 정보</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-text-tertiary" />
                    <span className="text-sm text-text-secondary">전화번호</span>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{displayCandidate.phone}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-bg-secondary rounded-xl">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 text-text-tertiary" />
                    <span className="text-sm text-text-secondary">이메일</span>
                  </div>
                  <span className="text-sm font-medium text-text-primary">{displayCandidate.email}</span>
                </div>
              </div>
              <p className="text-xs text-text-tertiary mt-4">
                * 채용 제안을 먼저 하시면 상세 연락처가 공개됩니다.
              </p>
              <button
                onClick={() => setShowContactInfo(false)}
                className="w-full mt-4 py-3 bg-expert-navy text-white rounded-xl font-medium"
              >
                확인
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 채용 제안 모달 */}
      <AnimatePresence>
        {showProposal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end"
            onClick={() => setShowProposal(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white rounded-t-2xl p-6"
            >
              <h3 className="text-lg font-bold text-text-primary mb-4">채용 제안하기</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-text-secondary block mb-1">제안할 포지션</label>
                  <select className="w-full px-3 py-3 bg-bg-secondary rounded-xl text-sm">
                    <option>피부과 간호사 (380~450만)</option>
                    <option>성형외과 간호사 (400~500만)</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-text-secondary block mb-1">제안 메시지</label>
                  <textarea
                    placeholder="후보자에게 전할 메시지를 입력하세요..."
                    rows={3}
                    className="w-full px-3 py-3 bg-bg-secondary rounded-xl text-sm resize-none"
                    defaultValue={`안녕하세요, ${displayCandidate.name}님. 저희 병원에서 ${displayCandidate.name}님의 프로필을 보고 연락드립니다.`}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setShowProposal(false)}
                  className="flex-1 py-3 border border-border-light text-text-secondary rounded-xl font-medium"
                >
                  취소
                </button>
                <button
                  onClick={() => {
                    setShowProposal(false);
                    alert('채용 제안이 발송되었습니다!');
                  }}
                  className="flex-1 py-3 bg-expert-navy text-white rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  제안 보내기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
