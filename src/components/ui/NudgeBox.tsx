'use client';

import { motion } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';

interface NudgeBoxProps {
  message: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'highlight' | 'subtle';
  className?: string;
}

const variantClasses = {
  default: 'bg-brand-mint/10 border-brand-mint/20',
  highlight: 'bg-match-gold/10 border-match-gold/30',
  subtle: 'bg-bg-secondary border-border-light',
};

export function NudgeBox({
  message,
  icon,
  action,
  variant = 'default',
  className = '',
}: NudgeBoxProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        border rounded-xl p-4
        ${variantClasses[variant]}
        ${className}
      `}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {icon || <Sparkles className="w-5 h-5 text-brand-mint" />}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-expert-navy font-medium leading-relaxed">
            {message}
          </p>
          {action && (
            <button
              onClick={action.onClick}
              className="mt-2 inline-flex items-center text-sm font-semibold text-brand-mint hover:text-brand-mint-dark transition-colors"
            >
              {action.label}
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Inline nudge (smaller, for inline use)
interface InlineNudgeProps {
  message: string;
  className?: string;
}

export function InlineNudge({ message, className = '' }: InlineNudgeProps) {
  return (
    <span className={`text-sm font-semibold text-brand-mint ${className}`}>
      {message}
    </span>
  );
}
