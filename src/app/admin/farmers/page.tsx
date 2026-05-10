"use client";
import { useState, useEffect } from "react";
import { Users, Search, Plus, UserPlus, Filter, MapPin, ShieldCheck, AlertTriangle, Wifi } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FarmersDBPage() {
  const [farmers, setFarmers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tenantId, setTenantId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const tid = localStorage.getItem('agro_tenant_id') || 'demo_tenant';
    setTenantId(tid);

    // Fetch farmers for this tenant only
    const fetchFarmers = async () => {
      const { data, error } = await supabase
        .from('farmers')
        .select('*')
        .eq('tenant_id', tid)
        .order('created_at', { ascending: false });

      if (!error && data) setFarmers(data);
      setIsLoading(false);
    };

    fetchFarmers();

    // Listen to new farmers for this tenant in real-time
    const channel = supabase
      .channel('farmers-page-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'farmers', filter: `tenant_id=eq.${tid}` },
        (payload) => {
          setFarmers(prev => [payload.new, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filteredFarmers = farmers.filter(f =>
    f.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.phone_number?.includes(searchTerm)
  );

  const handleAddFarmer = () => {
    window.open(`/agent?tenantId=${tenantId}`, 'AgentWindow', 'width=420,height=820,left=200,top=80');
  };

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
         <div>
           <h1 className="text-3xl font-bold text-slate-800 mb-2">Farmers Database (Demo)</h1>
           <p className="text-slate-500 flex items-center gap-2">
             <Wifi className="w-4 h-4 text-blue-500" />
             Live feed of farmers onboarded via Nokia Network-as-Code verification.
             {tenantId && <span className="text-xs font-mono bg-slate-100 px-2 py-0.5 rounded">{tenantId}</span>}
           </p>
         </div>
         <div className="flex space-x-3">
           <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-50 flex items-center gap-2">
             <Filter className="w-4 h-4" /> Filter
           </button>
           <button
             onClick={handleAddFarmer}
             className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-slate-800 flex items-center gap-2"
           >
             <Plus className="w-4 h-4" /> Add Farmer
           </button>
         </div>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : filteredFarmers.length === 0 && !searchTerm ? (
        <div className="bg-white border border-slate-200 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <UserPlus className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Farmers Yet</h2>
          <p className="text-slate-500 max-w-md mb-8">
            Click <strong>"Add Farmer"</strong> to launch the Field Agent app, onboard a farmer with Nokia NaC number verification, and watch them appear here in real-time.
          </p>
          <button
            onClick={handleAddFarmer}
            className="bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-800 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" /> Launch Field Agent & Onboard
          </button>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
             <div className="relative w-72">
               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                 <Search className="h-4 w-4 text-slate-400" />
               </div>
               <input
                 type="text"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-slate-500 focus:border-slate-500"
                 placeholder="Search by name or phone..."
               />
             </div>
             <div className="text-sm text-slate-500 font-medium">
                Total: {filteredFarmers.length} Farmer{filteredFarmers.length !== 1 ? 's' : ''}
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-slate-500 text-sm border-b border-slate-100">
                  <th className="p-4 font-semibold">Farmer ID</th>
                  <th className="p-4 font-semibold">Full Name</th>
                  <th className="p-4 font-semibold">NaC Number</th>
                  <th className="p-4 font-semibold">Registered</th>
                  <th className="p-4 font-semibold">Trust Score</th>
                  <th className="p-4 font-semibold">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredFarmers.map((farmer, idx) => (
                  <tr key={farmer.id || idx} className="hover:bg-slate-50 transition-colors animate-in fade-in slide-in-from-top-2 duration-300">
                    <td className="p-4 font-mono text-xs font-semibold text-slate-600">
                       FRM-{farmer.id?.toString().substring(0,8).toUpperCase()}
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xs font-bold">
                           {farmer.full_name?.charAt(0) || 'F'}
                        </div>
                        {farmer.full_name}
                      </div>
                    </td>
                    <td className="p-4 text-slate-600 font-mono text-xs">{farmer.phone_number}</td>
                    <td className="p-4 text-slate-500 text-xs">
                      {farmer.created_at ? new Date(farmer.created_at).toLocaleString() : '—'}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${farmer.trust_score || 0}%` }} />
                        </div>
                        <span className="text-xs text-slate-600 font-semibold">{farmer.trust_score || 0}%</span>
                      </div>
                    </td>
                    <td className="p-4">
                      {farmer.kyc_status === 'VERIFIED' ? (
                        <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-xs font-bold w-fit">
                          <ShieldCheck className="w-3 h-3" /> VERIFIED
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2.5 py-1 rounded-md text-xs font-bold w-fit">
                          <AlertTriangle className="w-3 h-3" /> FAILED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
