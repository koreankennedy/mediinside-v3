import type { IntensityTier } from '@/types';

type BadgeVariant = 'default' | 'tier1' | 'tier2' | 'tier3' | 'active' | 'success' | 'warning' | 'error';

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-gray-100 text-gray-700',
  tier1: 'bg-gray-100 text-gray-600',
  tier2: 'bg-blue-100 text-blue-600',
  tier3: 'bg-green-100 text-green-600',
  active: 'bg-match-gold/10 text-match-gold',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
};

export function Badge({ variant = 'default', className = '', children }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-1 rounded text-xs font-bold uppercase tracking-wider
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

// Tier Badge
interface TierBadgeProps {
  tier: IntensityTier;
  showLabel?: boolean;
  className?: string;
}

const tierLabels: Record<IntensityTier, string> = {
  1: 'AI 추정',
  2: '유저 제보',
  3: '검증 완료',
};

export function TierBadge({ tier, showLabel = true, className = '' }: TierBadgeProps) {
  const variant = `tier${tier}` as BadgeVariant;

  return (
    <Badge variant={variant} className={className}>
      Tier {tier}
      {showLabel && ` · ${tierLabels[tier]}`}
    </Badge>
  );
}

// Match Score Badge
interface MatchScoreBadgeProps {
  score: number;
  className?: string;
}

export function MatchScoreBadge({ score, className = '' }: MatchScoreBadgeProps) {
  const getVariant = (): BadgeVariant => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'default';
  };

  return (
    <Badge variant={getVariant()} className={className}>
      {score}% 일치
    </Badge>
  );
}
