"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, MapPin, Camera, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

export default function ProofOfDeliveryPage() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-amber-600" /></div>}><ProofOfDelivery /></Suspense>;
}

function ProofOfDelivery() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('id') || 'ORD-9912';
  const farmerName = searchParams.get('farmer') || 'Aminu Kano';

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [photoCaptured, setPhotoCaptured] = useState(false);
  const [simSwapRisk, setSimSwapRisk] = useState<any>(null);

  const capturePhoto = () => {
    setLoading(true);
    setTimeout(() => {
      setPhotoCaptured(true);
      setLoading(false);
    }, 1000);
  };

  const handleVerifyDelivery = async () => {
    setLoading(true);
    
    try {
      // Calling our Next.js API route that wraps the CAMARA services
      const res = await fetch('/api/verify-delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: "+99999991001", // Test number for SIM Swap / Location
          latitude: 12.002, 
          longitude: 8.591,
          orderId
        })
      });
      
      const data = await res.json();
      setSimSwapRisk(data);
      setStep(3);
    } catch (e) {
      console.error(e);
      setSimSwapRisk({ success: false });
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-white px-4 py-4 flex items-center shadow-sm sticky top-0 z-10">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-slate-100 transition-colors">
          <ChevronLeft className="w-6 h-6 text-slate-700" />
        </button>
        <h1 className="text-xl font-bold text-slate-800 ml-2">Proof of Delivery</h1>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-6 flex flex-col space-y-6">
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl mb-2">
           <p className="text-xs font-bold text-amber-600 mb-1">{orderId}</p>
           <p className="text-lg font-bold text-amber-900">{farmerName}</p>
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Capture Photo</h2>
              <p className="text-slate-500 text-sm">Take a photo of the farmer receiving the inputs at the farm location.</p>
            </div>

            <div 
              className={`relative h-64 rounded-3xl overflow-hidden border-2 transition-colors flex items-center justify-center ${photoCaptured ? 'border-amber-500 bg-amber-50' : 'border-dashed border-slate-300 bg-slate-100'}`}
            >
              {photoCaptured ? (
                <div className="text-center space-y-2">
                  <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-8 h-8 text-amber-600" />
                  </div>
                  <p className="font-bold text-amber-800">Photo Secured</p>
                </div>
              ) : (
                <button 
                  onClick={capturePhoto}
                  disabled={loading}
                  className="flex flex-col items-center justify-center space-y-3 text-slate-500 hover:text-amber-600 transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-10 h-10 animate-spin text-amber-600" />
                  ) : (
                    <>
                      <div className="bg-white p-4 rounded-full shadow-sm">
                        <Camera className="w-8 h-8" />
                      </div>
                      <span className="font-semibold">Tap to Open Camera</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!photoCaptured}
              className="w-full py-4 mt-8 bg-amber-600 text-white rounded-2xl font-bold shadow-lg shadow-amber-200 disabled:opacity-50 disabled:shadow-none hover:bg-amber-700 transition-all"
            >
              Next: Network Verification
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Network Verification</h2>
              <p className="text-slate-500 text-sm">We need to verify the delivery location and check the farmer's SIM status to prevent fraud.</p>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
               <div className="flex items-center space-x-3 text-slate-700">
                 <MapPin className="w-5 h-5 text-blue-500" />
                 <span className="font-medium">Verify Geofence Location</span>
               </div>
               <div className="flex items-center space-x-3 text-slate-700">
                 <AlertTriangle className="w-5 h-5 text-purple-500" />
                 <span className="font-medium">Perform SIM Swap Check</span>
               </div>
            </div>

            <button 
              onClick={handleVerifyDelivery}
              disabled={loading}
              className="w-full py-4 mt-8 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-300 hover:bg-slate-800 transition-all flex justify-center items-center"
            >
              {loading ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin mr-2" />
                   Verifying with CAMARA...
                 </>
              ) : (
                "Run Security Checks"
              )}
            </button>
          </div>
        )}

        {step === 3 && simSwapRisk && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-center py-8">
            {simSwapRisk.location?.status === 'TRUE' && simSwapRisk.simSwap?.swapped === false ? (
               <>
                 <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                 </div>
                 <h2 className="text-3xl font-bold text-slate-800 mb-2">Delivery Verified!</h2>
                 <p className="text-slate-500 mb-6">
                   Location matches farm perimeter and no SIM swap risk detected. Payout has been triggered.
                 </p>
                 
                 <div className="bg-green-50 border border-green-200 p-6 rounded-3xl text-left">
                    <p className="text-sm text-green-800 mb-1">Instant Payout Status</p>
                    <p className="text-2xl font-black text-green-700">₦ 15,000</p>
                    <p className="text-xs text-green-600 mt-2 font-mono">Credited to Wallet</p>
                 </div>
               </>
            ) : (
               <>
                 <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-red-50">
                    <AlertTriangle className="w-12 h-12 text-red-600" />
                 </div>
                 <h2 className="text-3xl font-bold text-slate-800 mb-2">Verification Failed</h2>
                 <p className="text-slate-500 mb-8">
                   Security checks failed. Payout blocked.
                 </p>

                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-100 space-y-3 text-left">
                    <p className="text-sm font-semibold text-slate-700">Diagnostics:</p>
                    <p className="text-sm text-slate-600">• Location: <span className="font-mono text-red-500">{simSwapRisk.location?.status || 'UNKNOWN'}</span></p>
                    <p className="text-sm text-slate-600">• SIM Swap: <span className="font-mono text-red-500">{simSwapRisk.simSwap?.swapped ? 'HIGH RISK DETECTED' : 'CLEARED'}</span></p>
                 </div>
               </>
            )}

            <button 
              onClick={() => router.push('/distributor')}
              className="w-full py-4 bg-amber-600 text-white rounded-2xl font-bold shadow-lg shadow-amber-200 hover:bg-amber-700 transition-all"
            >
              Back to Deliveries
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
