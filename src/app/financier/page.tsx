import Link from "next/link";
import { ShieldCheck, ChevronLeft, MapPin, FileCheck2, TrendingUp, Cpu } from "lucide-react";

export default function FinancierDashboard() {
  return (
      <main className="p-6 md:p-10 max-w-5xl mx-auto w-full">
        <header className="flex justify-between items-end mb-8">
           <div>
             <h1 className="text-3xl font-bold text-slate-800 mb-2">Credit Underwriting</h1>
             <p className="text-slate-500">Review Network-Verified Digital Farm Certificates.</p>
           </div>
        </header>

        {/* Digital Farm Certificate UI */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Cert Header */}
          <div className="bg-gradient-to-r from-purple-800 to-indigo-800 p-8 text-white flex justify-between items-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <ShieldCheck className="w-48 h-48" />
             </div>
             <div className="relative z-10">
               <p className="text-purple-200 font-semibold mb-1 uppercase tracking-widest text-sm">Official Document</p>
               <h2 className="text-4xl font-extrabold mb-2">Digital Farm Certificate</h2>
               <p className="text-purple-100 flex items-center space-x-2">
                 <span>ID: DFC-882190-26</span>
                 <span>•</span>
                 <span>Issued: May 9, 2026</span>
               </p>
             </div>
             <div className="relative z-10 bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 text-center">
               <p className="text-xs uppercase tracking-wider text-purple-100 mb-1">Trust Score</p>
               <p className="text-4xl font-black text-white">99<span className="text-lg">/100</span></p>
             </div>
          </div>

          {/* Cert Body */}
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Col */}
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Farmer Identity</h3>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Name</span>
                    <span className="font-bold text-slate-800">Aminu Kano</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Network KYC Match</span>
                    <span className="font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-md text-xs">98% MATCH</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Phone Status</span>
                    <span className="font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-md text-xs">NO SIM SWAP DETECTED</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Farm Details</h3>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Coordinates</span>
                    <span className="font-mono text-sm text-slate-800">12.002°N, 8.591°E</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Verified Area</span>
                    <span className="font-bold text-slate-800">2.4 Hectares</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Location Proof</span>
                    <span className="flex items-center text-green-600 bg-green-100 px-2 py-0.5 rounded-md text-xs font-bold">
                      <MapPin className="w-3 h-3 mr-1" />
                      PHYSICALLY VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col */}
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center space-x-2">
                  <Cpu className="w-4 h-4" />
                  <span>Agentic AI Analysis</span>
                </h3>
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-indigo-800/70">Crop History</span>
                    <span className="font-bold text-indigo-900">Maize, Legumes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-800/70">Est. Yield (Precision inputs)</span>
                    <span className="font-bold text-indigo-900">12.5 Tons</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-indigo-800/70">Risk Forecast</span>
                    <span className="font-bold text-green-700">VERY LOW</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                 <button className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-purple-200 hover:bg-purple-700 active:scale-[0.98] transition-all flex justify-center items-center space-x-2">
                   <FileCheck2 className="w-5 h-5" />
                   <span>Approve Seasonal Credit (₦450,000)</span>
                 </button>
              </div>
            </div>

          </div>
        </div>
      </main>
  );
}
