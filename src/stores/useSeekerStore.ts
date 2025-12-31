import { create } from 'zustand';
import type {
  SeekerProfile,
  FitTestResult,
  Match,
  MarketData,
} from '@/types';

interface SeekerState {
  // Profile
  profile: SeekerProfile | null;
  profileCompleteness: number;

  // Fit Test
  fitTestResult: FitTestResult | null;
  isFitTestCompleted: boolean;

  // Matches
  matches: Match[];
  activeMatches: Match[];
  totalMatchCount: number;

  // Market Data
  marketData: MarketData[];
  potentialMatchCount: number;

  // UI State
  isFirstVisit: boolean;
  selectedHospitalId: string | null;

  // Actions
  setProfile: (profile: SeekerProfile | null) => void;
  setFitTestResult: (result: FitTestResult) => void;
  setMatches: (matches: Match[]) => void;
  setMarketData: (data: MarketData[]) => void;
  setPotentialMatchCount: (count: number) => void;
  setFirstVisit: (isFirst: boolean) => void;
  setSelectedHospital: (hospitalId: string | null) => void;
  updateProfileCompleteness: () => void;
}

export const useSeekerStore = create<SeekerState>((set, get) => ({
  // Initial State
  profile: null,
  profileCompleteness: 0,
  fitTestResult: null,
  isFitTestCompleted: false,
  matches: [],
  activeMatches: [],
  totalMatchCount: 0,
  marketData: [],
  potentialMatchCount: 0,
  isFirstVisit: true,
  selectedHospitalId: null,

  // Actions
  setProfile: (profile) => {
    set({ profile });
    get().updateProfileCompleteness();
  },

  setFitTestResult: (result) =>
    set({
      fitTestResult: result,
      isFitTestCompleted: true,
    }),

  setMatches: (matches) =>
    set({
      matches,
      activeMatches: matches.filter(
        (m) => m.proposedBy === 'employer' && m.status === 'proposed'
      ),
      totalMatchCount: matches.length,
    }),

  setMarketData: (data) => set({ marketData: data }),

  setPotentialMatchCount: (count) => set({ potentialMatchCount: count }),

  setFirstVisit: (isFirst) => set({ isFirstVisit: isFirst }),

  setSelectedHospital: (hospitalId) => set({ selectedHospitalId: hospitalId }),

  updateProfileCompleteness: () => {
    const profile = get().profile;
    if (!profile) {
      set({ profileCompleteness: 0 });
      return;
    }

    let completed = 0;
    const total = 8;

    if (profile.name) completed++;
    if (profile.phone) completed++;
    if (profile.licenseType) completed++;
    if (profile.region) completed++;
    if (profile.fitType) completed++;
    if (profile.skills.length > 0) completed++;
    if (profile.experience.length > 0) completed++;
    if (profile.desiredSalary) completed++;

    set({ profileCompleteness: Math.round((completed / total) * 100) });
  },
}));

// Helper hooks
export const useProfile = () => useSeekerStore((state) => state.profile);
export const useFitTestResult = () => useSeekerStore((state) => state.fitTestResult);
export const useMatches = () => useSeekerStore((state) => state.matches);
export const useActiveMatches = () => useSeekerStore((state) => state.activeMatches);
export const useIsFirstVisit = () => useSeekerStore((state) => state.isFirstVisit);
