import React from 'react';
import { Sidebar, NavigationItem } from '@/components/layout/Sidebar';
import { ShieldCheck, FileCheck2, TrendingUp, Cpu } from 'lucide-react';

const financierNavItems: NavigationItem[] = [
  { id: "underwriting", name: "Underwriting", iconName: "ShieldCheck", href: "/financier" },
  { id: "portfolio", name: "Portfolio", iconName: "TrendingUp", href: "/financier/portfolio" },
  { id: "disbursements", name: "Disbursements", iconName: "FileCheck2", href: "/financier/disbursements" },
];

export default function FinancierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        navigationItems={financierNavItems} 
        title="AgroFinance" 
        subtitle="Underwriting Portal"
        logoText="Af"
      />
      <div className="flex-1 w-full transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
