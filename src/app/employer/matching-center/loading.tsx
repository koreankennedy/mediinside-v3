'use client';

import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

export default function MatchingCenterLoading() {
  return (
    <div className="px-4 py-6">
      {/* Header Skeleton */}
      <div className="mb-4">
        <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-100 rounded mt-2 animate-pulse" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide pb-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex-shrink-0 w-20 h-9 bg-gray-100 rounded-full animate-pulse"
          />
        ))}
      </div>

      {/* Stats Card Skeleton */}
      <div className="bg-expert-navy/5 rounded-2xl p-4 mb-4 border border-expert-navy/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
            <div className="h-6 w-48 bg-gray-300 rounded mt-2 animate-pulse" />
          </div>
          <div className="w-12 h-12 bg-expert-navy/10 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-expert-navy/30" />
          </div>
        </div>
      </div>

      {/* Candidate Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white rounded-2xl p-4 border border-border-light"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="h-6 w-16 bg-gray-100 rounded animate-pulse" />
              <div className="h-4 w-12 bg-gray-100 rounded animate-pulse" />
            </div>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
                <div>
                  <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-gray-100 rounded mt-1 animate-pulse" />
                </div>
              </div>
              <div className="text-right">
                <div className="h-7 w-12 bg-brand-mint/20 rounded animate-pulse" />
              </div>
            </div>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3].map((j) => (
                <div
                  key={j}
                  className="h-6 w-16 bg-gray-100 rounded animate-pulse"
                />
              ))}
            </div>
            <div className="flex gap-2 pt-3 border-t border-border-light">
              <div className="flex-1 h-10 bg-gray-100 rounded-lg animate-pulse" />
              <div className="flex-1 h-10 bg-gray-100 rounded-lg animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
