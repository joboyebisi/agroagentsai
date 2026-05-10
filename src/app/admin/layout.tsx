import React from 'react';
import { Sidebar, NavigationItem } from '@/components/layout/Sidebar';
import { Home, AlertOctagon, Users, Settings } from 'lucide-react';

const adminNavItems: NavigationItem[] = [
  { id: "overview", name: "Scheme Overview", iconName: "Home", href: "/admin" },
  { id: "fraud", name: "Fraud Detection", iconName: "AlertOctagon", href: "/admin/fraud", badge: "0" },
  { id: "farmers", name: "Farmers DB (Demo)", iconName: "Users", href: "/admin/farmers" },
  { id: "settings", name: "Settings", iconName: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        navigationItems={adminNavItems} 
        title="AgroAdmin" 
        subtitle="Outgrower Scheme"
        logoText="Aa"
      />
      <div className="flex-1 w-full transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
