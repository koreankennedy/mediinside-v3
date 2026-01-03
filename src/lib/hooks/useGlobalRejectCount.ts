'use client';

import { useState, useEffect, useCallback } from 'react';

const DAILY_REJECT_LIMIT = 10;
const STORAGE_KEY = 'mediinside_reject_count';
const DATE_KEY = 'mediinside_reject_date';

interface RejectCountData {
  count: number;
  date: string;
}

export function useGlobalRejectCount() {
  const [dailyRejectCount, setDailyRejectCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // 오늘 날짜 (YYYY-MM-DD)
  const getTodayDate = () => new Date().toISOString().split('T')[0];

  // localStorage에서 데이터 로드
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedCount = localStorage.getItem(STORAGE_KEY);
    const storedDate = localStorage.getItem(DATE_KEY);
    const today = getTodayDate();

    // 날짜가 바뀌면 카운트 리셋
    if (storedDate !== today) {
      localStorage.setItem(STORAGE_KEY, '0');
      localStorage.setItem(DATE_KEY, today);
      setDailyRejectCount(0);
    } else if (storedCount) {
      setDailyRejectCount(parseInt(storedCount, 10));
    }

    setIsLoaded(true);

    // 다른 탭에서 변경된 경우 동기화
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setDailyRejectCount(parseInt(e.newValue, 10));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // 거절 카운트 증가
  const incrementRejectCount = useCallback(() => {
    if (typeof window === 'undefined') return false;

    const today = getTodayDate();
    const storedDate = localStorage.getItem(DATE_KEY);

    // 날짜가 바뀌었으면 리셋
    if (storedDate !== today) {
      localStorage.setItem(STORAGE_KEY, '1');
      localStorage.setItem(DATE_KEY, today);
      setDailyRejectCount(1);
      return true;
    }

    const currentCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);

    if (currentCount >= DAILY_REJECT_LIMIT) {
      return false; // 한도 초과
    }

    const newCount = currentCount + 1;
    localStorage.setItem(STORAGE_KEY, newCount.toString());
    setDailyRejectCount(newCount);
    return true;
  }, []);

  // 거절 카운트 리셋 (모의면접 완료 후 등)
  const resetRejectCount = useCallback(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem(STORAGE_KEY, '0');
    setDailyRejectCount(0);
  }, []);

  const remainingRejects = DAILY_REJECT_LIMIT - dailyRejectCount;
  const canReject = dailyRejectCount < DAILY_REJECT_LIMIT;

  return {
    dailyRejectCount,
    remainingRejects,
    canReject,
    incrementRejectCount,
    resetRejectCount,
    DAILY_REJECT_LIMIT,
    isLoaded,
  };
}
