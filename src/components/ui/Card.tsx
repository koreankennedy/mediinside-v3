'use client';

import { motion } from 'framer-motion';

type CardVariant = 'default' | 'matching' | 'active' | 'blur';

interface CardProps {
  variant?: CardVariant;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  animate?: boolean;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white border border-border-light',
  matching: 'bg-white border border-border-light hover:border-brand-mint hover:shadow-md',
  active: 'bg-gradient-to-r from-amber-50 to-white border-2 border-match-gold',
  blur: 'backdrop-blur-sm bg-white/60 border border-gray-200',
};

export function Card({
  variant = 'default',
  className = '',
  children,
  onClick,
  animate = true,
}: CardProps) {
  const Component = animate ? motion.div : 'div';

  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.3 },
        whileHover: onClick ? { scale: 1.01 } : undefined,
        whileTap: onClick ? { scale: 0.99 } : undefined,
      }
    : {};

  return (
    <Component
      className={`
        rounded-2xl p-5 transition-all duration-200
        ${variantClasses[variant]}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `}
      onClick={onClick}
      {...animationProps}
    >
      {children}
    </Component>
  );
}

// Sub-components
export function CardHeader({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h3 className={`text-lg font-semibold text-text-primary ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={`text-sm text-text-secondary mt-1 ${className}`}>{children}</p>
  );
}

export function CardContent({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={className}>{children}</div>;
}

export function CardFooter({
  className = '',
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={`mt-4 pt-4 border-t border-border-light ${className}`}>{children}</div>;
}
