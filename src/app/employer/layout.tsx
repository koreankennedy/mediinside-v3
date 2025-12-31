import { EmployerLayout } from '@/components/layout/EmployerLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <EmployerLayout>{children}</EmployerLayout>;
}
