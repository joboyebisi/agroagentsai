"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { UserPlus, MapPin, CheckCircle2, ChevronRight, Leaf, Wifi, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FieldAgentPage() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}><FieldAgentDashboard /></Suspense>;
}

function FieldAgentDashboard() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get('tenantId') || localStorage.getItem('agro_tenant_id') || 'demo_tenant';

  const [farmers, setFarmers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch real farmers for this tenant
    const fetchFarmers = async () => {
      const { data, error } = await supabase
        .from('farmers')
        .select('*')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error && data) setFarmers(data);
      setIsLoading(false);
    };

    fetchFarmers();

    // Live updates
    const channel = supabase
      .channel('agent-dashboard-farmers')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'farmers', filter: `tenant_id=eq.${tenantId}` },
        (payload) => { setFarmers(prev => [payload.new, ...prev].slice(0, 5)); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [tenantId]);

  const verified = farmers.filter(f => f.kyc_status === 'VERIFIED').length;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-green-700 text-white p-6 rounded-b-3xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Leaf className="w-6 h-6 text-green-200" />
            <span className="font-bold text-lg tracking-wide">AgroAgents / Field Agent</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
            <Wifi className="w-3.5 h-3.5 text-green-200" />
            <span className="text-xs text-green-100 font-mono">NaC Online</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold mb-1">Field Agent Portal</h1>
        <p className="text-green-100 opacity-90 text-sm font-mono">{tenantId}</p>
      </header>

      <main className="max-w-md mx-auto px-6 mt-8 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-slate-500 text-sm font-medium mb-1">Onboarded</p>
            <p className="text-3xl font-extrabold text-slate-800">{isLoading ? '—' : farmers.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-slate-500 text-sm font-medium mb-1">NaC Verified</p>
            <p className="text-3xl font-extrabold text-green-600">{isLoading ? '—' : verified}</p>
          </div>
        </div>

        {/* Primary CTA */}
        <Link href={`/agent/onboard?tenantId=${tenantId}`} className="block">
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-6 rounded-3xl text-white shadow-lg shadow-green-200 hover:shadow-xl transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-between cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Onboard Farmer</h2>
                <p className="text-green-50 text-sm">Capture number & farm geofence via Nokia NaC</p>
              </div>
            </div>
            <ChevronRight className="w-6 h-6 text-green-100" />
          </div>
        </Link>

        {/* Recent Onboardings — live from DB */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-800">Recent Onboardings</h3>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
            </div>
          ) : farmers.length === 0 ? (
            <div className="bg-white border border-dashed border-slate-200 rounded-2xl p-8 text-center">
              <UserPlus className="w-8 h-8 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No farmers onboarded yet.</p>
              <p className="text-slate-400 text-xs mt-1">Tap the button above to get started.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {farmers.map((farmer, idx) => (
                <div key={farmer.id || idx} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-green-700">{farmer.full_name?.charAt(0) || 'F'}</span>
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">{farmer.full_name}</p>
                      <div className="flex items-center text-xs text-slate-500 space-x-2 mt-0.5">
                        <span className="font-mono">{farmer.phone_number}</span>
                        <span>·</span>
                        <span className="font-mono text-slate-400">FRM-{farmer.id?.substring(0,6).toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                  {farmer.kyc_status === 'VERIFIED' ? (
                    <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
