"use client";
import { useState, useEffect, useRef } from "react";
import { AlertOctagon, Users, PackageCheck, Search, Filter, ExternalLink, Play, CalendarClock, ChevronDown, Terminal, Activity, CheckCircle2, AlertCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface LiveEvent {
  id: string;
  type: string;
  target: string;
  status: React.ReactNode;
  action: React.ReactNode;
  timestamp: string;
}

interface ApiLog {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: string;
  response: string;
}

export default function AdminDashboard() {
  const [totalOnboarded, setTotalOnboarded] = useState(0);
  const [deliveriesVerified, setDeliveriesVerified] = useState(0);
  const [fraudBlocked, setFraudBlocked] = useState(0);
  
  const [isAssigning, setIsAssigning] = useState(false);
  const [expandedSchedule, setExpandedSchedule] = useState<string | null>(null);
  const [onboardedFarmers, setOnboardedFarmers] = useState<any[]>([]);
  const [farmerOrders, setFarmerOrders] = useState<Record<string, any>>({});
  
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);
  const [apiLogs, setApiLogs] = useState<ApiLog[]>([]);
  const [tenantId, setTenantId] = useState<string>('');
  
  const consoleRef = useRef<HTMLDivElement>(null);

  // Auto-scroll console
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [apiLogs]);

  const addApiLog = (method: string, endpoint: string, status: string, response: string) => {
    setApiLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(7),
      timestamp: new Date().toLocaleTimeString(),
      method,
      endpoint,
      status,
      response
    }].slice(-50)); // Keep last 50 logs
  };

  useEffect(() => {
    // Generate or retrieve Tenant ID for multi-tenancy
    let currentTenant = localStorage.getItem('agro_tenant_id');
    if (!currentTenant) {
       currentTenant = 'tenant_' + Math.random().toString(36).substring(2, 10);
       localStorage.setItem('agro_tenant_id', currentTenant);
    }
    setTenantId(currentTenant);

    // ── INITIAL FETCH: Load existing data so the dashboard is never empty ──────
    const loadExistingData = async () => {
      // Fetch existing farmers for this tenant
      const { data: existingFarmers } = await supabase
        .from('farmers')
        .select('*')
        .eq('tenant_id', currentTenant!)
        .order('created_at', { ascending: false });

      if (existingFarmers && existingFarmers.length > 0) {
        setOnboardedFarmers(existingFarmers);
        setTotalOnboarded(existingFarmers.length);
        const fraudCount = existingFarmers.filter((f: any) => f.kyc_status !== 'VERIFIED').length;
        setFraudBlocked(fraudCount);

        // Build live events from existing farmers
        const events: LiveEvent[] = existingFarmers.slice(0, 5).map((f: any) => ({
          id: `EVT-${f.id?.substring(0, 6)}`,
          type: 'Farmer Onboard',
          target: `FRM-${f.id?.substring(0, 6).toUpperCase()} (${f.full_name})`,
          status: f.kyc_status === 'VERIFIED'
            ? <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold">NaC: VERIFIED</span>
            : <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold">NaC: FAILED</span>,
          action: f.kyc_status === 'VERIFIED'
            ? <span className="text-green-600 font-semibold">Schedule Created</span>
            : <span className="text-red-600 font-semibold">Rejected</span>,
          timestamp: f.created_at,
        }));
        setLiveEvents(events);
      }

      // Fetch existing api_logs for this tenant (last 30)
      const { data: existingLogs } = await supabase
        .from('api_logs')
        .select('*')
        .eq('tenant_id', currentTenant!)
        .order('created_at', { ascending: true })
        .limit(30);

      if (existingLogs && existingLogs.length > 0) {
        const formatted = existingLogs.map((l: any) => ({
          id: l.id,
          timestamp: new Date(l.created_at).toLocaleTimeString(),
          method: l.method,
          endpoint: l.endpoint,
          status: l.status_code,
          response: l.response_body,
        }));
        setApiLogs(formatted);
      }

      // Fetch delivered orders count
      const { count: deliveredCount } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'DELIVERED')
        .eq('tenant_id', currentTenant!);
      if (deliveredCount) setDeliveriesVerified(deliveredCount);
    };

    loadExistingData();

    // ── REALTIME: Listen to new Nokia NaC API logs ───────────────────────────
    const apiLogChannel = supabase
      .channel('schema-db-api-logs')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'api_logs', filter: `tenant_id=eq.${currentTenant}` },
        (payload) => {
          addApiLog(payload.new.method, payload.new.endpoint, payload.new.status_code, payload.new.response_body);
        }
      )
      .subscribe();

    // ── REALTIME: Listen to new farmers ─────────────────────────────────────
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'farmers', filter: `tenant_id=eq.${currentTenant}` },
        (payload) => {
          setTotalOnboarded(prev => prev + 1);
          
          const newFarmer = payload.new;
          const isVerified = newFarmer.kyc_status === 'VERIFIED';
          
          // Add farmer to schedule list
          setOnboardedFarmers(prev => [newFarmer, ...prev]);
          
          const newEvent: LiveEvent = {
            id: `EVT-${Math.floor(Math.random() * 10000)}`,
            type: "Farmer Onboard (Live)",
            target: `FRM-${newFarmer.id?.toString().substring(0,6).toUpperCase() || 'NEW'} (${newFarmer.full_name})`,
            status: isVerified ? (
               <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold animate-pulse">NaC: VERIFIED</span>
            ) : (
               <span className="bg-red-100 text-red-700 px-2 py-1 rounded-md text-xs font-bold animate-pulse">NaC: FAILED</span>
            ),
            action: isVerified ? (
              <span className="text-green-600 font-semibold">Agentic AI: Schedule Created</span>
            ) : (
              <span className="text-red-600 font-semibold">ID Rejected</span>
            ),
            timestamp: new Date().toISOString()
          };

          if (!isVerified) setFraudBlocked(prev => prev + 1);

          setLiveEvents(prev => [newEvent, ...prev].slice(0, 10));
        }
      )
      .subscribe();

    // ── REALTIME: Listen to order delivery completion ─────────────────────────
    const orderChannel = supabase
      .channel('schema-db-order-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders', filter: `tenant_id=eq.${currentTenant}` },
        (payload) => {
          const newOrder = payload.new;
          if (newOrder.status === 'DELIVERED') {
            setDeliveriesVerified(prev => prev + 1);

            const newEvent: LiveEvent = {
              id: `EVT-${Math.floor(Math.random() * 10000)}`,
              type: "Delivery Verified (Live)",
              target: `ORD-${newOrder.id?.toString().substring(0,6).toUpperCase() || 'LIVE'}`,
              status: (
                 <>
                   <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold animate-pulse">LOC: MATCH</span>
                   <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs font-bold ml-2 animate-pulse">SIM: SECURE</span>
                 </>
              ),
              action: <span className="text-green-600 font-semibold">Payment Triggered</span>,
              timestamp: new Date().toISOString()
            };

            setLiveEvents(prev => [newEvent, ...prev].slice(0, 10));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(apiLogChannel);
      supabase.removeChannel(channel);
      supabase.removeChannel(orderChannel);
    };
  }, []);

  const handleInitiateDistribution = async () => {
    setIsAssigning(true);

    try {
      // Fetch latest PENDING order from Supabase
      const { data: latestOrder } = await supabase
        .from('orders')
        .select('*')
        .eq('status', 'PENDING')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!latestOrder) {
        alert("No pending orders found. Please ensure a farmer has been onboarded completely.");
        setIsAssigning(false);
        return;
      }

      const res = await fetch('/api/assign-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: latestOrder.id,
          tenantId: tenantId,
          farmerPhone: '+99999991001',
          distributorPhone: '+99999991002',
          lat: 12.002, // Kano coordinates
          lng: 8.591
        })
      });
      const data = await res.json();
      
      if (data.success) {
        const newEvent: LiveEvent = {
          id: `EVT-${Math.floor(Math.random() * 10000)}`,
          type: "Distribution Assigned",
          target: `ORD-${latestOrder.id.substring(0,4)} -> Dist. A. Kano`,
          status: <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-md text-xs font-bold animate-pulse">GEOFENCE ACTIVE</span>,
          action: <span className="text-blue-600 font-semibold">SMS Sent to Farmer</span>,
          timestamp: new Date().toISOString()
        };
        setLiveEvents(prev => [newEvent, ...prev].slice(0, 10));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAssigning(false);
    }
  };

  const launchSimulator = (url: string, windowName: string) => {
    window.open(`${url}?tenantId=${tenantId}`, windowName, 'width=400,height=800,left=200,top=100');
  };

  return (
    <main className="p-6 md:p-10 max-w-7xl mx-auto w-full">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
           <div>
             <h1 className="text-3xl font-bold text-slate-800 mb-2">Scheme Control Room</h1>
             <p className="text-slate-500">Master dashboard for outgrower operations and live demo coordination.</p>
           </div>
        </header>

        {/* Demo Instructions Panel */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 mb-10">
          <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Play className="w-5 h-5 text-blue-600" />
            Live Demo Guide
          </h2>
          <p className="text-sm text-slate-600 mb-6">
            This Control Room allows Outgrower Scheme Managers to experience how AgroAgents streamlines fraud-proof operations using Nokia Network-as-Code. Follow these steps to train your staff or run a live simulation:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col h-full">
              <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold mb-3 shrink-0">1</span>
              <h3 className="font-bold text-slate-700 mb-2">Onboard a Farmer</h3>
              <p className="text-xs text-slate-500 mb-4 flex-grow">Launch the Field Agent Sim and Farmer Sim side-by-side to witness real-time KYC validation via USSD.</p>
              <div className="flex flex-col gap-2 mt-auto">
                 <button onClick={() => launchSimulator('/agent', 'AgentWindow')} className="w-full bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50">
                   Launch Field Agent Sim <ExternalLink className="w-3.5 h-3.5" />
                 </button>
                 <button onClick={() => launchSimulator('/farmer', 'FarmerWindow')} className="w-full bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50">
                   Launch Farmer Sim <ExternalLink className="w-3.5 h-3.5" />
                 </button>
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col h-full">
              <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold mb-3 shrink-0">2</span>
              <h3 className="font-bold text-slate-700 mb-2">Review AI Schedule</h3>
              <p className="text-xs text-slate-500 mb-4 flex-grow">Expand the farmer's row below to see the Maize Planting Schedule generated by our Agentic AI.</p>
              <div className="w-full py-2 text-center text-xs text-slate-400 border border-dashed border-slate-300 rounded-lg mt-auto">
                 Action required below ↓
              </div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col h-full">
              <span className="w-8 h-8 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold mb-3 shrink-0">3</span>
              <h3 className="font-bold text-slate-700 mb-2">Verify Distribution</h3>
              <p className="text-xs text-slate-500 mb-4 flex-grow">Initiate the Seed Distribution below, then launch the Distributor Sim to trigger the Geofence check.</p>
              <div className="mt-auto">
                <button onClick={() => launchSimulator('/distributor', 'DistributorWindow')} className="w-full bg-white border border-slate-200 text-slate-700 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-50">
                  Launch Distributor Sim <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Top KPIs & NaC Console Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-10">
          
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <p className="text-slate-500 font-medium mb-1">Total Onboarded</p>
                <p className="text-4xl font-extrabold text-slate-800 transition-all">{totalOnboarded.toLocaleString()}</p>
              </div>
              <div className="bg-blue-50 w-12 h-12 flex items-center justify-center rounded-2xl mt-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <p className="text-slate-500 font-medium mb-1">Deliveries Verified</p>
                <p className="text-4xl font-extrabold text-green-600">{deliveriesVerified.toLocaleString()}</p>
              </div>
              <div className="bg-green-50 w-12 h-12 flex items-center justify-center rounded-2xl mt-4">
                <PackageCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-100 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
              <div>
                <p className="text-slate-500 font-medium mb-1">Fraud Blocked</p>
                <p className="text-4xl font-extrabold text-red-600">{fraudBlocked.toLocaleString()}</p>
              </div>
              <div className="bg-red-50 w-12 h-12 flex items-center justify-center rounded-2xl mt-4">
                <AlertOctagon className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          {/* Nokia NaC API Call Console */}
          <div className="lg:col-span-4 bg-slate-900 rounded-3xl shadow-xl border border-slate-800 flex flex-col overflow-hidden h-[200px] lg:h-auto">
            <div className="bg-slate-950 p-3 border-b border-slate-800 flex items-center gap-2">
               <Terminal className="w-4 h-4 text-green-400" />
               <span className="text-xs font-mono font-semibold text-slate-300">Nokia Network-as-Code API Console</span>
               <Activity className="w-3 h-3 text-green-500 ml-auto animate-pulse" />
            </div>
            <div ref={consoleRef} className="flex-1 p-4 font-mono text-[10px] sm:text-xs overflow-y-auto space-y-3">
               {apiLogs.length === 0 ? (
                 <p className="text-slate-600 italic">Awaiting network events...</p>
               ) : (
                 apiLogs.map(log => (
                   <div key={log.id} className="animate-in fade-in duration-300">
                     <div className="flex gap-2 text-slate-400 mb-1">
                        <span className="text-blue-400">[{log.timestamp}]</span>
                        <span className={log.method === 'POST' ? 'text-amber-400' : 'text-purple-400'}>{log.method}</span>
                        <span className="truncate">{log.endpoint}</span>
                     </div>
                     <div className="flex gap-2 text-slate-300 pl-4 border-l border-slate-800 ml-1">
                        <span className={log.status.includes('200') || log.status.includes('201') ? 'text-green-400' : 'text-red-400'}>{log.status}</span>
                        <span className="text-slate-500">{log.response}</span>
                     </div>
                   </div>
                 ))
               )}
            </div>
          </div>

        </div>

        {/* Agentic AI Schedules Table */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden mb-10">
           <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
             <div className="flex items-center space-x-3">
               <CalendarClock className="w-6 h-6 text-slate-700" />
               <h2 className="text-xl font-bold text-slate-800">Maize Planting Schedules (Northern Nigeria)</h2>
             </div>
           </div>
           <div className="p-0">
             {onboardedFarmers.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                   Onboard a farmer via the Field Agent Sim to generate their AI planting schedule.
                </div>
             ) : (
                onboardedFarmers.map((farmer) => {
                  const farmerId = farmer.id;
                  const seedKg = Math.round((farmer.plot_size_ha || 2.4) * 25);
                  const fertKg = Math.round((farmer.plot_size_ha || 2.4) * 100);
                  const tractorHrs = Math.round((farmer.plot_size_ha || 2.4) * 1.5 * 10) / 10;
                  const isExpanded = expandedSchedule === farmerId;
                  return (
                    <div key={farmerId} className="border-b border-slate-100 last:border-0">
                      <div
                        className="p-6 flex justify-between items-center hover:bg-slate-50 cursor-pointer transition-colors"
                        onClick={() => setExpandedSchedule(isExpanded ? null : farmerId)}
                      >
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                             <h3 className="font-bold text-slate-800">{farmer.full_name}</h3>
                             <span className="font-mono text-[10px] text-slate-400">FRM-{farmerId?.substring(0,8).toUpperCase()}</span>
                             {farmer.kyc_status === 'VERIFIED' ? (
                               <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">NaC VERIFIED</span>
                             ) : (
                               <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] font-bold">FAILED</span>
                             )}
                          </div>
                          <p className="text-sm text-slate-500 mt-1">2.4 Hectares • Kano Region • May 2026</p>
                        </div>
                        <div className="flex items-center gap-4">
                          {farmer.kyc_status === 'VERIFIED' && (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold animate-pulse">Seed Required</span>
                          )}
                          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="bg-slate-50 p-6 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white p-5 rounded-2xl border border-slate-200">
                              <h4 className="font-bold text-slate-700 text-sm mb-4 border-b pb-2">Agentic AI Input Calculation (2.4 ha)</h4>
                              <ul className="space-y-3 text-sm text-slate-600">
                                <li className="flex justify-between items-center">
                                  <span>Tractor Plowing</span>
                                  <strong className="text-slate-800 bg-slate-100 px-2 py-1 rounded">{tractorHrs} Hours</strong>
                                </li>
                                <li className="flex justify-between items-center">
                                  <span>Maize Seed (Hybrid)</span>
                                  <strong className="text-slate-800 bg-slate-100 px-2 py-1 rounded">{seedKg} kg</strong>
                                </li>
                                <li className="flex justify-between items-center">
                                  <span>NPK Fertilizer</span>
                                  <strong className="text-slate-800 bg-slate-100 px-2 py-1 rounded">{fertKg} kg</strong>
                                </li>
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-bold text-slate-700 text-sm mb-4">May 2026 Timeline</h4>
                              <div className="space-y-4">
                                 <div className="flex gap-3 items-start opacity-50">
                                   <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                   <div>
                                     <h5 className="text-sm font-bold text-slate-700">Land Clearing &amp; Prep</h5>
                                     <p className="text-xs text-slate-500">Late April/Early May</p>
                                   </div>
                                   <span className="ml-auto text-[10px] font-bold bg-slate-200 text-slate-500 px-2 py-1 rounded">NOT STARTED</span>
                                 </div>
                                 <div className="flex gap-3 items-start opacity-50">
                                   <CheckCircle2 className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                                   <div>
                                     <h5 className="text-sm font-bold text-slate-700">Harrowing &amp; Ridging</h5>
                                     <p className="text-xs text-slate-500">Mid May</p>
                                   </div>
                                   <span className="ml-auto text-[10px] font-bold bg-slate-200 text-slate-500 px-2 py-1 rounded">NOT STARTED</span>
                                 </div>
                                 <div className="flex gap-3 items-start bg-red-50 -mx-3 p-3 rounded-xl border border-red-100">
                                   <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                   <div className="w-full">
                                     <h5 className="text-sm font-bold text-red-900">Seed Planting</h5>
                                     <p className="text-xs text-red-700 mb-3">Late May - Rains have commenced. Inputs required immediately.</p>
                                     <button
                                       onClick={handleInitiateDistribution}
                                       disabled={isAssigning}
                                       className="w-full bg-red-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-red-700 disabled:opacity-50 transition-colors"
                                     >
                                       {isAssigning ? "Triggering Nokia NaC Geofence..." : `Initiate Seed Distribution for ${farmer.full_name}`}
                                     </button>
                                   </div>
                                 </div>
                                 <div className="flex gap-3 items-start opacity-50">
                                   <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0 mt-0.5" />
                                   <div>
                                     <h5 className="text-sm font-bold text-slate-700">Fertilizing (NPK)</h5>
                                     <p className="text-xs text-slate-500">June</p>
                                   </div>
                                   <span className="ml-auto text-[10px] font-bold bg-slate-200 text-slate-500 px-2 py-1 rounded">NOT STARTED</span>
                                 </div>
                              </div>
                            </div>
                        </div>
                      )}
                    </div>
                  );
                })
             )}
           </div>
        </section>

        {/* Live Event Stream Table */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
           <div className="p-6 border-b flex justify-between items-center bg-slate-50/50">
             <div className="flex items-center space-x-3">
               <h2 className="text-xl font-bold text-slate-800">Live Verification Stream</h2>
               <span className="flex h-3 w-3 relative">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
               </span>
             </div>
             <div className="flex space-x-2">
               <button className="p-2 border rounded-xl hover:bg-slate-50"><Search className="w-5 h-5 text-slate-500"/></button>
               <button className="p-2 border rounded-xl hover:bg-slate-50"><Filter className="w-5 h-5 text-slate-500"/></button>
             </div>
           </div>
           <div className="overflow-x-auto min-h-[200px]">
             {liveEvents.length === 0 ? (
               <div className="p-12 text-center text-slate-500 flex flex-col items-center">
                 <Activity className="w-8 h-8 mb-3 text-slate-300" />
                 Waiting for live events...
               </div>
             ) : (
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50 text-slate-500 text-sm">
                     <th className="p-4 font-semibold">Event ID</th>
                     <th className="p-4 font-semibold">Type</th>
                     <th className="p-4 font-semibold">Target</th>
                     <th className="p-4 font-semibold">NaC Status</th>
                     <th className="p-4 font-semibold">Action Taken</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 text-sm">
                   {liveEvents.map((event) => (
                     <tr key={event.id} className="hover:bg-slate-50 transition-colors animate-in fade-in slide-in-from-top-2 duration-300">
                       <td className="p-4 font-mono text-xs text-slate-500">{event.id}</td>
                       <td className="p-4 font-semibold text-slate-700">{event.type}</td>
                       <td className="p-4">{event.target}</td>
                       <td className="p-4">{event.status}</td>
                       <td className="p-4">{event.action}</td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             )}
           </div>
        </section>
      </main>
  );
}
