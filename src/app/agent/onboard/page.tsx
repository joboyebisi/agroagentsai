"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Map, Camera, ScanFace, CheckCircle2, Loader2, AlertCircle, Wifi } from "lucide-react";

export default function OnboardFarmerPage() {
  return <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>}><OnboardFarmer /></Suspense>;
}

function OnboardFarmer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tenantId = searchParams.get('tenantId') || 'demo_tenant';
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locationCaptured, setLocationCaptured] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "Farouq Yusuf",
    phoneNumber: "+99999991001",
  });
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  const handleCapturePhoto = () => {
    // Mock photo capture
    setCapturedPhoto('https://images.unsplash.com/photo-1599839619722-39751411ea63?w=800&q=80');
  };
  
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const captureLocation = () => {
    setLoading(true);
    setTimeout(() => {
      setLocationCaptured(true);
      setLoading(false);
    }, 1500);
  };

  const handleVerify = async () => {
    setLoading(true);
    
    try {
      // Calling our Next.js API route that wraps the CAMARA services
      const res = await fetch('/api/verify-onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: formData.phoneNumber,
          fullName: formData.fullName,
          latitude: 12.002,
          longitude: 8.591,
          radius: 1000,
          plotSizeHectares: 2.4,
          tenantId: tenantId,
        })
      });
      
      const data = await res.json();
      setVerificationResult(data);
      setStep(3); // Result step
    } catch (e) {
      console.error(e);
      setVerificationResult({ success: false, error: "Network Error" });
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
        <h1 className="text-xl font-bold text-slate-800 ml-2">Onboard Farmer</h1>
      </header>

      <main className="flex-1 max-w-md w-full mx-auto p-6 flex flex-col space-y-6">
        {/* Progress Tracker */}
        <div className="flex items-center justify-between px-2 mb-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className={`h-2 flex-1 rounded-full mx-1 ${step >= i ? 'bg-green-500' : 'bg-slate-200'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Farmer Details</h2>
              <p className="text-slate-500 text-sm">Enter the farmer's verified phone number. Nokia Network-as-Code will verify number ownership via the telecom network.</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-slate-800 font-medium"
                  placeholder="e.g. Aminu Kano"
                />
              </div>
              
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-slate-700">Mobile Phone Number</label>
                <input 
                  type="tel" 
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-slate-800 font-medium"
                  placeholder="+234..."
                />
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                   <Wifi className="w-3 h-3" /> Nokia NaC test numbers: <span className="font-mono text-green-600">+99999991001</span> (pass) · <span className="font-mono text-red-500">+99999991000</span> (fail)
                </p>
              </div>
            </div>

            <button 
              onClick={() => setStep(2)}
              disabled={!formData.fullName || formData.phoneNumber.length < 8}
              className="w-full py-4 mt-8 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-200 disabled:opacity-50 disabled:shadow-none hover:bg-green-700 active:scale-[0.98] transition-all"
            >
              Next: Capture Geofence
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Farm Geofence</h2>
              <p className="text-slate-500 text-sm">Walk the perimeter of the farm or capture the center coordinates.</p>
            </div>

            <div 
              className={`relative h-64 rounded-3xl overflow-hidden border-2 transition-colors flex items-center justify-center ${locationCaptured ? 'border-green-500 bg-green-50' : 'border-dashed border-slate-300 bg-slate-100'}`}
            >
              {locationCaptured ? (
                <div className="text-center space-y-2">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="font-bold text-green-800">Coordinates Captured</p>
                  <p className="text-xs text-green-600 font-mono">12.0021° N, 8.5912° E • Area: 2.4 ha</p>
                </div>
              ) : (
                <button 
                  onClick={captureLocation}
                  disabled={loading}
                  className="flex flex-col items-center justify-center space-y-3 text-slate-500 hover:text-green-600 transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-10 h-10 animate-spin text-green-600" />
                  ) : (
                    <>
                      <div className="bg-white p-4 rounded-full shadow-sm">
                        <Map className="w-8 h-8" />
                      </div>
                      <span className="font-semibold">Tap to Capture Location</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
               {!capturedPhoto ? (
                 <button onClick={handleCapturePhoto} className="flex items-center justify-center space-x-2 p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 active:scale-95 transition-all">
                   <Camera className="w-5 h-5 text-slate-400" />
                   <span>Photo ID</span>
                 </button>
               ) : (
                 <div className="h-16 rounded-2xl overflow-hidden border-2 border-green-500 relative bg-white">
                    <img src={capturedPhoto} alt="Farmer" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                       <CheckCircle2 className="w-6 h-6 text-white drop-shadow-md" />
                    </div>
                 </div>
               )}
               <button className="flex items-center justify-center space-x-2 p-4 bg-white border border-slate-200 rounded-2xl text-slate-700 font-medium hover:bg-slate-50 active:scale-95 transition-all">
                 <ScanFace className="w-5 h-5 text-slate-400" />
                 <span>Selfie</span>
               </button>
            </div>

            <button 
              onClick={handleVerify}
              disabled={!locationCaptured || loading}
              className="w-full py-4 mt-8 bg-slate-900 text-white rounded-2xl font-bold shadow-lg shadow-slate-300 disabled:opacity-50 disabled:shadow-none hover:bg-slate-800 active:scale-[0.98] transition-all flex justify-center items-center"
            >
              {loading ? (
                 <>
                   <Loader2 className="w-5 h-5 animate-spin mr-2" />
                   Verifying via Nokia NaC...
                 </>
              ) : (
                "Verify & Create ID"
              )}
            </button>
          </div>
        )}

        {step === 3 && verificationResult && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500 text-center py-8">
            {(verificationResult.success && verificationResult.location?.status === 'TRUE') ? (
               <>
                 <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-green-50">
                    <CheckCircle2 className="w-12 h-12 text-green-600" />
                 </div>
                 <h2 className="text-3xl font-bold text-slate-800 mb-2">Network Verified!</h2>
                 <p className="text-slate-500">
                   Identity and location successfully verified via Nokia Network-as-Code APIs.
                 </p>
                 
                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 mt-8 space-y-4 text-left">
                    <h3 className="font-bold text-slate-800 border-b pb-2">Digital Farm Certificate</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-400 mb-1">Farmer</p>
                        <p className="font-semibold text-slate-700">{formData.fullName}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">KYC Match</p>
                        <p className="font-semibold text-green-600">98% Match</p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Location</p>
                        <p className="font-semibold text-green-600">Verified at Farm</p>
                      </div>
                      <div>
                        <p className="text-slate-400 mb-1">Trust Score</p>
                        <p className="font-semibold text-blue-600">A+ (Premium)</p>
                      </div>
                    </div>
                 </div>
               </>
            ) : (
               <>
                 <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6 ring-8 ring-red-50">
                    <AlertCircle className="w-12 h-12 text-red-600" />
                 </div>
                 <h2 className="text-3xl font-bold text-slate-800 mb-2">Verification Failed</h2>
                 <p className="text-slate-500 mb-8">
                   We could not verify the farmer's identity or location with the network provider.
                 </p>

                 <div className="bg-white p-6 rounded-3xl shadow-sm border border-red-100 space-y-3 text-left">
                    <p className="text-sm font-semibold text-slate-700">Diagnostics:</p>
                    <p className="text-sm text-slate-600">• KYC Status: <span className="font-mono text-red-500">{verificationResult.kyc?.status || 'UNKNOWN'}</span></p>
                    <p className="text-sm text-slate-600">• Location Status: <span className="font-mono text-red-500">{verificationResult.location?.status || 'UNKNOWN'}</span></p>
                 </div>
                 
                 <button 
                  onClick={() => setStep(1)}
                  className="w-full py-4 mt-8 bg-slate-200 text-slate-800 rounded-2xl font-bold hover:bg-slate-300 transition-all"
                >
                  Try Again
                </button>
               </>
            )}

            <button 
              onClick={() => router.push('/agent')}
              className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-200 hover:bg-green-700 active:scale-[0.98] transition-all"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
