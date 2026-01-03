'use client';

import { useState, useEffect, useCallback, useSyncExternalStore } from 'react';

const DAILY_REJECT_LIMIT = 10;
const STORAGE_KEY = 'mediinside_reject_count';
const DATE_KEY = 'mediinside_reject_date';

// 오늘 날짜 (YYYY-MM-DD)
const getTodayDate = () => new Date().toISOString().split('T')[0];

// localStorage에서 동기적으로 카운트 가져오기
const getStoredCount = (): number => {
  if (typeof window === 'undefined') return 0;

  const storedDate = localStorage.getItem(DATE_KEY);
  const today = getTodayDate();

  // 날짜가 바뀌면 카운트 리셋
  if (storedDate !== today) {
    localStorage.setItem(STORAGE_KEY, '0');
    localStorage.setItem(DATE_KEY, today);
    return 0;
  }

  const storedCount = localStorage.getItem(STORAGE_KEY);
  return storedCount ? parseInt(storedCount, 10) : 0;
};

// useSyncExternalStore를 위한 subscribe 함수
const subscribe = (callback: () => void) => {
  window.addEventListener('storage', callback);
  // 커스텀 이벤트로 같은 탭 내 동기화
  window.addEventListener('rejectCountChange', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('rejectCountChange', callback);
  };
};

// 서버 사이드 렌더링용 스냅샷
const getServerSnapshot = () => 0;

export function useGlobalRejectCount() {
  // useSyncExternalStore로 localStorage와 동기화
  const dailyRejectCount = useSyncExternalStore(
    subscribe,
    getStoredCount,
    getServerSnapshot
  );

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // 상태 변경 후 리렌더링 트리거
  const triggerUpdate = useCallback(() => {
    window.dispatchEvent(new CustomEvent('rejectCountChange'));
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
      triggerUpdate();
      return true;
    }

    const currentCount = parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);

    if (currentCount >= DAILY_REJECT_LIMIT) {
      return false; // 한도 초과
    }

    const newCount = currentCount + 1;
    localStorage.setItem(STORAGE_KEY, newCount.toString());
    triggerUpdate();
    return true;
  }, [triggerUpdate]);

  // 거절 카운트 리셋 (모의면접 완료 후 등)
  const resetRejectCount = useCallback(() => {
    if (typeof window === 'undefined') return;

    localStorage.setItem(STORAGE_KEY, '0');
    triggerUpdate();
  }, [triggerUpdate]);

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
