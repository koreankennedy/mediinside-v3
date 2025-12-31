'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Sparkles, Users, Video, Building2 } from 'lucide-react';

interface EmployerLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/employer/home', icon: Home, label: '홈' },
  { href: '/employer/matching-center', icon: Users, label: '매칭센터' },
  { href: '/employer/ai-interview', icon: Video, label: 'AI인터뷰' },
  { href: '/employer/branding', icon: Sparkles, label: '브랜딩' },
  { href: '/employer/profile', icon: Building2, label: '병원정보' },
];

export function EmployerLayout({ children }: EmployerLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-bg-secondary">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-expert-navy safe-area-top">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/employer/home" className="font-bold text-lg">
            <span className="text-brand-mint">Medi</span>
            <span className="text-white">Inside</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded-full">
              구인처
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-14 pb-20 min-h-screen">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border-light safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-expert-navy' : 'text-text-tertiary'
                }`}
              >
                <Icon className="w-5 h-5 mb-1" strokeWidth={isActive ? 2.5 : 2} />
                <span className={`text-xs ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
