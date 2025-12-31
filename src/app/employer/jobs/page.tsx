'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Search,
  Filter,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Users,
  Eye,
  Edit2,
  MoreVertical,
  Pause,
  Play,
  Trash2,
  Copy,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';
import Link from 'next/link';

// 채용 공고 목록 데이터
const jobPostings = [
  {
    id: 1,
    title: '피부과 간호사',
    department: '피부과',
    position: '일반 간호사',
    status: 'active',
    salary: { min: 380, max: 450 },
    location: '강남구 청담동',
    workType: '정규직',
    createdAt: '2024-12-01',
    expiresAt: '2025-01-01',
    views: 234,
    applications: 12,
    matchedCandidates: 8,
    competitiveness: 72,
    aiSuggestions: 2,
  },
  {
    id: 2,
    title: '성형외과 수술실 간호사',
    department: '성형외과',
    position: '전문 간호사',
    status: 'active',
    salary: { min: 450, max: 550 },
    location: '강남구 신사동',
    workType: '정규직',
    createdAt: '2024-12-10',
    expiresAt: '2025-01-10',
    views: 156,
    applications: 8,
    matchedCandidates: 5,
    competitiveness: 85,
    aiSuggestions: 0,
  },
  {
    id: 3,
    title: '피부과 파트타임 간호사',
    department: '피부과',
    position: '일반 간호사',
    status: 'paused',
    salary: { min: 280, max: 320 },
    location: '강남구 청담동',
    workType: '파트타임',
    createdAt: '2024-11-15',
    expiresAt: '2024-12-15',
    views: 89,
    applications: 3,
    matchedCandidates: 2,
    competitiveness: 58,
    aiSuggestions: 3,
  },
  {
    id: 4,
    title: '안과 간호사 (경력)',
    department: '안과',
    position: '일반 간호사',
    status: 'closed',
    salary: { min: 400, max: 480 },
    location: '송파구 잠실동',
    workType: '정규직',
    createdAt: '2024-10-01',
    expiresAt: '2024-11-01',
    views: 312,
    applications: 18,
    matchedCandidates: 0,
    competitiveness: 78,
    aiSuggestions: 0,
    closedReason: 'hired',
  },
];

const statusLabels: Record<string, { label: string; color: string; bgColor: string }> = {
  active: { label: '진행중', color: 'text-success', bgColor: 'bg-success/10' },
  paused: { label: '일시중지', color: 'text-warning', bgColor: 'bg-warning/10' },
  closed: { label: '마감', color: 'text-text-tertiary', bgColor: 'bg-bg-secondary' },
};

const filterOptions = [
  { id: 'all', label: '전체' },
  { id: 'active', label: '진행중' },
  { id: 'paused', label: '일시중지' },
  { id: 'closed', label: '마감' },
];

export default function JobsListPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showMenu, setShowMenu] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState('latest');

  const filteredJobs = jobPostings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'all' || job.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const sortedJobs = [...filteredJobs].sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortBy === 'applications') {
      return b.applications - a.applications;
    } else if (sortBy === 'views') {
      return b.views - a.views;
    }
    return 0;
  });

  const stats = {
    total: jobPostings.length,
    active: jobPostings.filter(j => j.status === 'active').length,
    totalApplications: jobPostings.reduce((sum, j) => sum + j.applications, 0),
    totalMatched: jobPostings.reduce((sum, j) => sum + j.matchedCandidates, 0),
  };

  return (
    <div className="min-h-screen bg-bg-secondary pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border-light px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-bg-secondary"
            >
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-expert-navy">채용 공고 관리</h1>
              <p className="text-xs text-text-secondary">총 {stats.total}개 공고</p>
            </div>
          </div>
          <Link href="/employer/jobs/new">
            <button className="px-4 py-2 bg-brand-mint text-white rounded-xl font-medium flex items-center gap-2">
              <Plus className="w-4 h-4" />
              새 공고
            </button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-tertiary" />
          <input
            type="text"
            placeholder="공고명, 분과로 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-bg-secondary border-none focus:ring-2 focus:ring-brand-mint/30 focus:outline-none"
          />
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white rounded-xl p-3 border border-border-light text-center">
            <div className="text-xl font-bold text-expert-navy">{stats.active}</div>
            <div className="text-xs text-text-secondary">진행중</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-border-light text-center">
            <div className="text-xl font-bold text-brand-mint">{stats.totalApplications}</div>
            <div className="text-xs text-text-secondary">총 지원자</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-border-light text-center">
            <div className="text-xl font-bold text-match-gold">{stats.totalMatched}</div>
            <div className="text-xs text-text-secondary">매칭 후보</div>
          </div>
          <div className="bg-white rounded-xl p-3 border border-border-light text-center">
            <div className="text-xl font-bold text-info">{jobPostings.reduce((sum, j) => sum + j.views, 0)}</div>
            <div className="text-xs text-text-secondary">총 조회수</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {filterOptions.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-expert-navy text-white'
                    : 'bg-white text-text-secondary border border-border-light'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white border border-border-light text-sm text-text-secondary"
          >
            <option value="latest">최신순</option>
            <option value="applications">지원자순</option>
            <option value="views">조회수순</option>
          </select>
        </div>

        {/* Job List */}
        <div className="space-y-3">
          {sortedJobs.map((job) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-border-light overflow-hidden"
            >
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 ${statusLabels[job.status].bgColor} ${statusLabels[job.status].color} text-xs font-medium rounded-full`}>
                        {statusLabels[job.status].label}
                      </span>
                      {job.aiSuggestions > 0 && (
                        <span className="px-2 py-0.5 bg-brand-mint/10 text-brand-mint text-xs font-medium rounded-full flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          AI 제안 {job.aiSuggestions}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-text-primary">{job.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-text-secondary mt-1">
                      <span>{job.department}</span>
                      <span>·</span>
                      <span>{job.workType}</span>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowMenu(showMenu === job.id ? null : job.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bg-secondary"
                    >
                      <MoreVertical className="w-5 h-5 text-text-tertiary" />
                    </button>
                    <AnimatePresence>
                      {showMenu === job.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-border-light overflow-hidden z-10 w-40"
                        >
                          <Link href={`/employer/jobs/${job.id}/edit`}>
                            <button className="w-full px-4 py-3 text-left text-sm text-text-primary hover:bg-bg-secondary flex items-center gap-2">
                              <Edit2 className="w-4 h-4" />
                              수정하기
                            </button>
                          </Link>
                          <button className="w-full px-4 py-3 text-left text-sm text-text-primary hover:bg-bg-secondary flex items-center gap-2">
                            <Copy className="w-4 h-4" />
                            복사하기
                          </button>
                          {job.status === 'active' ? (
                            <button className="w-full px-4 py-3 text-left text-sm text-warning hover:bg-bg-secondary flex items-center gap-2">
                              <Pause className="w-4 h-4" />
                              일시중지
                            </button>
                          ) : job.status === 'paused' ? (
                            <button className="w-full px-4 py-3 text-left text-sm text-success hover:bg-bg-secondary flex items-center gap-2">
                              <Play className="w-4 h-4" />
                              재개하기
                            </button>
                          ) : null}
                          <button className="w-full px-4 py-3 text-left text-sm text-error hover:bg-bg-secondary flex items-center gap-2 border-t border-border-light">
                            <Trash2 className="w-4 h-4" />
                            삭제하기
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-text-secondary mb-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    {job.salary.min}~{job.salary.max}만
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location.split(' ')[0]}
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 pt-3 border-t border-border-light">
                  <div className="text-center">
                    <div className="text-lg font-bold text-expert-navy">{job.views}</div>
                    <div className="text-xs text-text-tertiary">조회</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-brand-mint">{job.applications}</div>
                    <div className="text-xs text-text-tertiary">지원</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-match-gold">{job.matchedCandidates}</div>
                    <div className="text-xs text-text-tertiary">매칭</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${
                      job.competitiveness >= 80 ? 'text-success' :
                      job.competitiveness >= 60 ? 'text-warning' : 'text-error'
                    }`}>{job.competitiveness}</div>
                    <div className="text-xs text-text-tertiary">경쟁력</div>
                  </div>
                </div>
              </div>

              {job.aiSuggestions > 0 && job.status === 'active' && (
                <Link href={`/employer/jobs/${job.id}/edit`}>
                  <div className="px-4 py-3 bg-brand-mint/5 border-t border-brand-mint/10 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-brand-mint">
                      <Sparkles className="w-4 h-4" />
                      AI가 {job.aiSuggestions}개의 개선점을 발견했어요
                    </div>
                    <ChevronDown className="w-4 h-4 text-brand-mint rotate-[-90deg]" />
                  </div>
                </Link>
              )}

              {job.status === 'closed' && job.closedReason === 'hired' && (
                <div className="px-4 py-3 bg-success/5 border-t border-success/10 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-success" />
                  <span className="text-sm text-success">채용 완료</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {sortedJobs.length === 0 && (
          <div className="bg-white rounded-2xl p-8 text-center border border-border-light">
            <Briefcase className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
            <p className="text-text-secondary mb-4">
              {searchQuery ? '검색 결과가 없습니다' : '등록된 공고가 없습니다'}
            </p>
            <Link href="/employer/jobs/new">
              <button className="px-6 py-3 bg-brand-mint text-white rounded-xl font-medium">
                새 공고 등록하기
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <Link href="/employer/jobs/new">
        <button className="fixed bottom-24 right-4 w-14 h-14 bg-brand-mint text-white rounded-full shadow-lg flex items-center justify-center">
          <Plus className="w-6 h-6" />
        </button>
      </Link>
    </div>
  );
}
