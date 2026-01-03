'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowLeft,
  Share2,
  Download,
  Clock,
  Star,
  Users,
  ThumbsUp,
  ThumbsDown,
  CheckCircle,
  XCircle,
  MessageCircle,
  TrendingUp,
  Calendar,
  Send,
} from 'lucide-react';

// AI 인터뷰 리포트 목업 데이터
const aiReportData: Record<string, {
  name: string;
  position: string;
  experience: string;
  matchScore: number;
  interviewDuration: string;
  totalScore: number;
  recommendation: string;
  recommendationColor: string;
  summary: string;
  categoryScores: { name: string; score: number; color: string }[];
  strengths: string[];
  concerns: string[];
  keyQA: { question: string; answer: string; insight: string }[];
}> = {
  'aic-1': {
    name: '정민지',
    position: '간호사',
    experience: '경력 3년',
    matchScore: 88,
    interviewDuration: '32분',
    totalScore: 89,
    recommendation: '적극 추천',
    recommendationColor: 'text-brand-mint',
    summary: '정민지 후보자는 3년간의 간호사 경력을 보유하고 있으며, 특히 레이저 시술, IPL 분야에서 전문성을 갖추고 있습니다. 논현피부과에서의 경험을 바탕으로 환자 케어와 팀워크에 뛰어난 능력을 보입니다.',
    categoryScores: [
      { name: '경력 적합도', score: 85, color: 'bg-brand-mint' },
      { name: '전문 기술', score: 90, color: 'bg-brand-mint' },
      { name: '입사 의지', score: 88, color: 'bg-brand-mint' },
      { name: '조직 적합도', score: 92, color: 'bg-brand-mint' },
      { name: '의사소통', score: 85, color: 'bg-brand-mint' },
    ],
    strengths: [
      '풍부한 레이저 시술 경험',
      '팀워크와 협업 능력이 우수함',
      '학습 의지가 강하고 성장 잠재력이 높음',
    ],
    concerns: [
      '야근에 대한 부담감 표현',
      '급여 협상 여지가 필요할 수 있음',
    ],
    keyQA: [
      {
        question: '이전 직장에서 가장 성취감을 느꼈던 경험은?',
        answer: '논현피부과에서 레이저 시술 분야의 어려운 케이스를 성공적으로 해결한 경험이 있습니다. 환자분의 만족도가 높았고, 동료들로부터도 인정받았습니다.',
        insight: '환자 케어에 대한 책임감과 전문성이 높음',
      },
      {
        question: '우리 병원에서 기대하는 것은?',
        answer: '최신 장비와 체계적인 시스템을 갖춘 곳에서 전문성을 더욱 발전시키고 싶습니다. 특히 간호사로서의 커리어를 지속적으로 발전시키고 싶습니다.',
        insight: '명확한 커리어 목표와 성장 의지',
      },
      {
        question: '야근이나 주말 근무에 대한 생각은?',
        answer: '필요한 경우 가능하지만, 워라밸도 중요하게 생각합니다. 적절한 보상이 있다면 긍정적으로 검토하겠습니다.',
        insight: '업무 강도에 대한 현실적인 기대치',
      },
    ],
  },
  'aic-2': {
    name: '강은비',
    position: '간호조무사',
    experience: '경력 2년',
    matchScore: 85,
    interviewDuration: '28분',
    totalScore: 85,
    recommendation: '추천',
    recommendationColor: 'text-info',
    summary: '강은비 후보자는 2년간의 간호조무사 경력을 가지고 있으며, 성실하고 책임감 있는 자세를 보여주었습니다. 기본적인 시술 보조 업무에 능숙하며, 환자 응대 능력이 우수합니다.',
    categoryScores: [
      { name: '경력 적합도', score: 80, color: 'bg-info' },
      { name: '전문 기술', score: 82, color: 'bg-info' },
      { name: '입사 의지', score: 90, color: 'bg-brand-mint' },
      { name: '조직 적합도', score: 88, color: 'bg-brand-mint' },
      { name: '의사소통', score: 85, color: 'bg-brand-mint' },
    ],
    strengths: [
      '환자 응대 능력이 뛰어남',
      '성실하고 책임감 있는 업무 태도',
      '빠른 학습 능력',
    ],
    concerns: [
      '경력이 다소 짧음',
      '복잡한 시술 보조 경험 부족',
    ],
    keyQA: [
      {
        question: '간호조무사로서 가장 중요하게 생각하는 것은?',
        answer: '환자분들이 편안함을 느끼실 수 있도록 세심하게 케어하는 것이 가장 중요하다고 생각합니다.',
        insight: '환자 중심적 사고방식',
      },
      {
        question: '새로운 시술이나 장비를 배울 때 어떻게 접근하나요?',
        answer: '먼저 매뉴얼을 꼼꼼히 읽고, 선배님들께 질문하면서 실습을 통해 익히려고 합니다.',
        insight: '체계적인 학습 태도',
      },
      {
        question: '팀원과 갈등이 생겼을 때 어떻게 해결하나요?',
        answer: '직접 대화를 통해 서로의 입장을 이해하려고 노력합니다. 감정적으로 대응하기보다 해결책을 찾는 것이 중요하다고 생각합니다.',
        insight: '성숙한 갈등 해결 능력',
      },
    ],
  },
};

// 기본 데이터 (ID가 없을 경우)
const defaultReport = {
  name: '정혜원',
  position: '간호사',
  experience: '경력 4년',
  matchScore: 90,
  interviewDuration: '39분',
  totalScore: 98,
  recommendation: '적극 추천',
  recommendationColor: 'text-brand-mint',
  summary: '정혜원 후보자는 4년간의 간호사 경력을 보유하고 있으며, 특히 레이저 시술, IPL 분야에서 전문성을 갖추고 있습니다. 논현피부과에서의 경험을 바탕으로 환자 케어와 팀워크에 뛰어난 능력을 보입니다.',
  categoryScores: [
    { name: '경력 적합도', score: 85, color: 'bg-brand-mint' },
    { name: '전문 기술', score: 90, color: 'bg-brand-mint' },
    { name: '입사 의지', score: 88, color: 'bg-brand-mint' },
    { name: '조직 적합도', score: 92, color: 'bg-brand-mint' },
    { name: '의사소통', score: 85, color: 'bg-brand-mint' },
  ],
  strengths: [
    '풍부한 레이저 시술 경험',
    '팀워크와 협업 능력이 우수함',
    '학습 의지가 강하고 성장 잠재력이 높음',
  ],
  concerns: [
    '야근에 대한 부담감 표현',
    '급여 협상 여지가 필요할 수 있음',
  ],
  keyQA: [
    {
      question: '이전 직장에서 가장 성취감을 느꼈던 경험은?',
      answer: '논현피부과에서 레이저 시술 분야의 어려운 케이스를 성공적으로 해결한 경험이 있습니다. 환자분의 만족도가 높았고, 동료들로부터도 인정받았습니다.',
      insight: '환자 케어에 대한 책임감과 전문성이 높음',
    },
    {
      question: '우리 병원에서 기대하는 것은?',
      answer: '최신 장비와 체계적인 시스템을 갖춘 곳에서 전문성을 더욱 발전시키고 싶습니다. 특히 간호사로서의 커리어를 지속적으로 발전시키고 싶습니다.',
      insight: '명확한 커리어 목표와 성장 의지',
    },
    {
      question: '야근이나 주말 근무에 대한 생각은?',
      answer: '필요한 경우 가능하지만, 워라밸도 중요하게 생각합니다. 적절한 보상이 있다면 긍정적으로 검토하겠습니다.',
      insight: '업무 강도에 대한 현실적인 기대치',
    },
  ],
};

export default function AIInterviewReportPage() {
  const router = useRouter();
  const params = useParams();
  const reportId = params.id as string;

  const report = aiReportData[reportId] || defaultReport;
  const [helpfulVote, setHelpfulVote] = useState<'helpful' | 'not-helpful' | null>(null);

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* 헤더 */}
      <div className="sticky top-0 z-20 bg-white border-b border-border-light">
        <div className="flex items-center justify-between px-4 py-3">
          <button onClick={() => router.back()} className="p-1">
            <ArrowLeft className="w-6 h-6 text-text-primary" />
          </button>
          <h1 className="font-bold text-text-primary">AI 인터뷰 리포트</h1>
          <div className="flex items-center gap-2">
            <button className="p-2 text-text-tertiary hover:text-text-primary">
              <Share2 className="w-5 h-5" />
            </button>
            <button className="p-2 text-text-tertiary hover:text-text-primary">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* 후보자 요약 카드 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-border-light p-5"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-expert-navy/10 rounded-full flex items-center justify-center">
              <Users className="w-7 h-7 text-expert-navy" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-text-primary">{report.name}</h2>
              <p className="text-sm text-text-secondary">{report.position} · {report.experience}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-mint">{report.matchScore}%</div>
              <div className="text-xs text-text-tertiary">매칭률</div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 py-4 border-y border-border-light">
            <div className="text-center">
              <Clock className="w-5 h-5 text-text-tertiary mx-auto mb-1" />
              <div className="text-xs text-text-tertiary">인터뷰 시간</div>
              <div className="font-bold text-text-primary">{report.interviewDuration}</div>
            </div>
            <div className="text-center">
              <Star className="w-5 h-5 text-warning mx-auto mb-1" />
              <div className="text-xs text-text-tertiary">종합 점수</div>
              <div className="font-bold text-text-primary">{report.totalScore}점</div>
            </div>
            <div className="text-center">
              <Users className="w-5 h-5 text-brand-mint mx-auto mb-1" />
              <div className="text-xs text-text-tertiary">추천도</div>
              <div className={`font-bold ${report.recommendationColor}`}>{report.recommendation}</div>
            </div>
          </div>

          {/* 평가 피드백 */}
          <div className="mt-4">
            <p className="text-sm text-text-secondary mb-3">AI 인터뷰 평가가 도움이 되었나요?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setHelpfulVote('helpful')}
                className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  helpfulVote === 'helpful'
                    ? 'bg-success/10 border-success text-success'
                    : 'border-border-light text-text-secondary hover:bg-bg-secondary'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                도움됨
              </button>
              <button
                onClick={() => setHelpfulVote('not-helpful')}
                className={`flex-1 py-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                  helpfulVote === 'not-helpful'
                    ? 'bg-error/10 border-error text-error'
                    : 'border-border-light text-text-secondary hover:bg-bg-secondary'
                }`}
              >
                <ThumbsDown className="w-4 h-4" />
                아쉬움
              </button>
            </div>
          </div>
        </motion.div>

        {/* AI 종합 평가 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-border-light p-5"
        >
          <h3 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-expert-navy" />
            AI 종합 평가
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {report.summary}
          </p>
        </motion.div>

        {/* 항목별 평가 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-border-light p-5"
        >
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <Star className="w-5 h-5 text-warning" />
            항목별 평가
          </h3>
          <div className="space-y-4">
            {report.categoryScores.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-text-primary">{category.name}</span>
                  <span className="text-sm font-bold text-text-primary">{category.score}점</span>
                </div>
                <div className="h-2 bg-bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${category.score}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                    className={`h-full ${category.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 핵심 인사이트 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-border-light p-5"
        >
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-info" />
            핵심 인사이트
          </h3>

          {/* 주요 강점 */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <ThumbsUp className="w-4 h-4 text-success" />
              <span className="font-medium text-success">주요 강점</span>
            </div>
            <ul className="space-y-2">
              {report.strengths.map((strength, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                  <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>

          {/* 고려사항 */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ThumbsDown className="w-4 h-4 text-warning" />
              <span className="font-medium text-warning">고려사항</span>
            </div>
            <ul className="space-y-2">
              {report.concerns.map((concern, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                  <XCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                  {concern}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* 주요 질문과 답변 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl border border-border-light p-5"
        >
          <h3 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-expert-navy" />
            주요 질문과 답변
          </h3>
          <div className="space-y-4">
            {report.keyQA.map((qa, index) => (
              <div key={index} className="border-b border-border-light pb-4 last:border-0 last:pb-0">
                <div className="font-medium text-text-primary text-sm mb-2">
                  Q. {qa.question}
                </div>
                <div className="bg-bg-secondary rounded-xl p-3 mb-2">
                  <p className="text-sm text-text-secondary">{qa.answer}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-brand-mint">
                  <TrendingUp className="w-3 h-3" />
                  {qa.insight}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* 다음 단계 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-expert-navy rounded-2xl p-5 text-white"
        >
          <h3 className="font-bold mb-3">다음 단계</h3>
          <div className="space-y-3">
            <Link href={`/employer/candidates/${reportId}`}>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center gap-2 transition-colors">
                <Calendar className="w-5 h-5" />
                대면 면접 일정 잡기
              </button>
            </Link>
            <button
              onClick={() => alert('오퍼 발송 기능은 준비 중입니다.')}
              className="w-full py-3 bg-brand-mint hover:bg-brand-mint/90 text-expert-navy font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Send className="w-5 h-5" />
              오퍼 발송하기
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
