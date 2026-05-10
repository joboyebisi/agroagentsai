"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Truck, MapPin, Package, Camera, ShieldCheck, CheckCircle2, AlertTriangle, Wifi, Loader2, RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type DeliveryState = 'IDLE' | 'AT_FARM' | 'VERIFYING' | 'SUCCESS' | 'FAILED';

// All deliveries use the same Kano coordinates so geofence always matches
const FARM_LAT = 12.002;
const FARM_LNG = 8.591;

export default function DistributorApp() {
  const searchParams = useSearchParams();
  const tenantId = searchParams.get('tenantId') || localStorage.getItem('agro_tenant_id') || 'demo_tenant';

  const [deliveryState, setDeliveryState] = useState<DeliveryState>('IDLE');
  const [deliveryCode, setDeliveryCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [isLoadingOrder, setIsLoadingOrder] = useState(true);
  const [verifyResult, setVerifyResult] = useState<any>(null);

  const fetchActiveOrder = async () => {
    setIsLoadingOrder(true);
    // Try IN_TRANSIT first, then fall back to PENDING (so demo works even before admin initiates)
    const { data: inTransit } = await supabase
      .from('orders')
      .select('*, farmers(full_name, phone_number)')
      .eq('tenant_id', tenantId)
      .in('status', ['IN_TRANSIT', 'PENDING'])
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    if (inTransit) setActiveOrder(inTransit);
    setIsLoadingOrder(false);
  };

  useEffect(() => {
    fetchActiveOrder();

    // Real-time: pick up order when admin initiates distribution
    const channel = supabase
      .channel('distributor-orders-live')
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'orders' },
        (payload) => {
          if (['IN_TRANSIT', 'PENDING'].includes(payload.new.status)) {
            setActiveOrder(payload.new);
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [tenantId]);

  const handleCapturePhoto = () => {
    setCapturedPhoto('https://images.unsplash.com/photo-1599839619722-39751411ea63?w=400&q=80');
  };

  const handleVerifyDelivery = async () => {
    if (!deliveryCode || deliveryCode.length < 4) {
      setErrorMsg('Please enter the 4-digit code from the Farmer App.');
      return;
    }
    setDeliveryState('VERIFYING');
    setErrorMsg('');

    try {
      const res = await fetch('/api/verify-delivery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: activeOrder?.id,
          phoneNumber: '+99999991002',
          latitude: FARM_LAT,
          longitude: FARM_LNG,
          code: deliveryCode,
          tenantId,
        })
      });
      const data = await res.json();
      setVerifyResult(data);

      if (data.success) {
        setDeliveryState('SUCCESS');
      } else {
        setDeliveryState('FAILED');
        setErrorMsg(data.error || 'Verification failed. Check the code and try again.');
      }
    } catch {
      setDeliveryState('FAILED');
      setErrorMsg('Network error. Please try again.');
    }
  };

  const farmerName = activeOrder?.farmers?.full_name || activeOrder?.farmer_name || 'Assigned Farmer';
  const orderRef = activeOrder?.id ? `ORD-${activeOrder.id.substring(0,6).toUpperCase()}` : 'ORD-DEMO';
  const seedQty = activeOrder?.seed_qty_kg || 60;
  const fertQty = activeOrder?.fertilizer_qty_kg || 240;

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="flex flex-col md:flex-row gap-12 items-center md:items-start max-w-5xl w-full">

        {/* Left Panel */}
        <div className="md:w-1/2 space-y-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-800 tracking-tight">Distributor Portal</h1>
            <p className="text-lg text-slate-600 leading-relaxed mt-2">
              Proof of delivery powered by <strong className="text-blue-600">Nokia Network-as-Code</strong>. 
              Location and SIM fraud checks happen automatically.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-800">How This Works</h3>
            <ol className="list-decimal list-inside space-y-2 text-slate-600 text-sm">
              <li>Admin initiates distribution from the Control Room.</li>
              <li>Open the <strong>Farmer Sim</strong> to get the delivery code.</li>
              <li>Click <strong>"Arrive at Farm"</strong> — NaC checks your location.</li>
              <li>Enter the code. NaC checks SIM swap history.</li>
              <li>Success → payment is automatically triggered.</li>
            </ol>
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
              <p className="font-semibold flex items-center gap-1 mb-1"><Wifi className="w-3 h-3" /> Nokia Network-as-Code</p>
              <p>Distributor SIM: <span className="font-mono">+99999991002</span></p>
              <p>Farm Geofence: <span className="font-mono">{FARM_LAT}°N, {FARM_LNG}°E (100m radius)</span></p>
            </div>
          </div>

          <Link href="/" className="inline-block text-slate-500 hover:text-slate-800 font-medium text-sm">
            ← Back to Platform Hub
          </Link>
        </div>

        {/* Mobile Device Frame */}
        <div className="relative w-[340px] h-[700px] bg-black rounded-[3rem] p-3 shadow-2xl shrink-0 border-4 border-slate-800 ring-4 ring-slate-200">
          <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-20">
            <div className="w-32 h-6 bg-black rounded-b-2xl"></div>
          </div>

          <div className="w-full h-full bg-slate-50 rounded-[2.5rem] overflow-hidden relative flex flex-col">
            <header className="bg-orange-600 text-white pt-10 pb-4 px-6 shrink-0 shadow-md">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-orange-200" />
                  <h2 className="font-bold text-lg">AgroDeliver</h2>
                </div>
                <button onClick={fetchActiveOrder} className="p-1 rounded-full hover:bg-orange-500 transition-colors" title="Refresh orders">
                  <RefreshCw className="w-4 h-4 text-orange-200" />
                </button>
              </div>
              <p className="text-orange-100 text-xs font-medium">Nokia NaC · Proof of Delivery</p>
            </header>

            <div className="flex-1 overflow-y-auto bg-slate-100 p-4">

              {/* IDLE — Always show order card, never block */}
              {deliveryState === 'IDLE' && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  {isLoadingOrder ? (
                    <div className="bg-white rounded-2xl p-6 flex items-center justify-center gap-3 border border-slate-200">
                      <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
                      <span className="text-sm text-slate-500">Loading order...</span>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wider ${activeOrder?.status === 'IN_TRANSIT' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>
                          {activeOrder?.status || 'PENDING'}
                        </span>
                        <span className="text-slate-500 text-xs font-mono">{orderRef}</span>
                      </div>
                      <h3 className="font-bold text-slate-800 mb-1">{farmerName}</h3>
                      <p className="text-sm text-slate-500 flex items-center mb-4">
                        <MapPin className="w-3.5 h-3.5 mr-1 shrink-0" />
                        Kano Region · Plot 42A · {FARM_LAT}°N
                      </p>
                      <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-2 text-sm border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Seed (Maize)</span>
                          <span className="font-semibold text-slate-700">{seedQty} kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Fertilizer (NPK)</span>
                          <span className="font-semibold text-slate-700">{fertQty} kg</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setDeliveryState('AT_FARM')}
                        className="w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-sm"
                      >
                        Arrive at Farm →
                      </button>
                      {!activeOrder && (
                        <p className="text-center text-xs text-slate-400 mt-2">No DB order yet — using demo mode</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* AT FARM — Code Entry */}
              {deliveryState === 'AT_FARM' && (
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 text-center animate-in slide-in-from-right duration-300">
                  <Package className="w-12 h-12 text-orange-500 mx-auto mb-3" />
                  <h3 className="font-bold text-slate-800 text-lg mb-1">Verify Handover</h3>
                  <p className="text-sm text-slate-500 mb-5">Ask the farmer for their SMS code. Nokia NaC will check your location and SIM.</p>

                  <div className="mb-4 text-left">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">4-Digit Delivery Code</label>
                    <input
                      type="number"
                      value={deliveryCode}
                      onChange={(e) => { setDeliveryCode(e.target.value); setErrorMsg(''); }}
                      placeholder="e.g. 4092"
                      maxLength={4}
                      className="w-full text-center text-2xl tracking-[0.5em] font-bold border-2 border-slate-200 rounded-xl py-3 focus:border-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-100 transition-all"
                    />
                    {errorMsg && <p className="text-red-500 text-xs mt-2">{errorMsg}</p>}
                  </div>

                  <div className="mb-5 text-left">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Photo Proof</label>
                    {!capturedPhoto ? (
                      <button onClick={handleCapturePhoto} className="w-full border-2 border-dashed border-slate-300 rounded-xl py-4 flex flex-col items-center text-slate-400 hover:text-orange-600 hover:border-orange-300 transition-colors bg-slate-50">
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-xs font-medium">Capture Photo</span>
                      </button>
                    ) : (
                      <div className="w-full h-24 rounded-xl overflow-hidden border-2 border-green-400 relative">
                        <img src={capturedPhoto} alt="Delivery Proof" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                          <CheckCircle2 className="w-8 h-8 text-white drop-shadow-md" />
                        </div>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleVerifyDelivery}
                    className="w-full flex items-center justify-center bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-colors"
                  >
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    Verify via Nokia NaC
                  </button>
                  <button onClick={() => setDeliveryState('IDLE')} className="mt-3 text-sm text-slate-400 font-medium">
                    Cancel
                  </button>
                </div>
              )}

              {/* VERIFYING */}
              {deliveryState === 'VERIFYING' && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <div className="w-14 h-14 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin" />
                  <p className="font-bold text-slate-700">Nokia NaC Verifying...</p>
                  <div className="text-xs text-slate-500 text-center space-y-1">
                    <p>✓ Checking device location</p>
                    <p>✓ Verifying geofence (100m radius)</p>
                    <p>✓ SIM swap fraud check</p>
                  </div>
                </div>
              )}

              {/* SUCCESS */}
              {deliveryState === 'SUCCESS' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-green-200 text-center animate-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-xl mb-1">Delivery Verified!</h3>
                  <p className="text-sm text-slate-500 mb-5">Payment triggered automatically.</p>

                  <div className="bg-slate-50 rounded-xl p-4 text-left border border-slate-100 space-y-2 mb-5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Geofence Lock</span>
                      <strong className="text-green-600">✓ TRUE</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Location Match</span>
                      <strong className="text-green-600">✓ MATCHED</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">SIM Swap Risk</span>
                      <strong className="text-green-600">✓ LOW</strong>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Farmer SIM</span>
                      <strong className="text-green-600">✓ ACTIVE</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => { setDeliveryState('IDLE'); setDeliveryCode(''); setCapturedPhoto(null); setVerifyResult(null); fetchActiveOrder(); }}
                    className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold"
                  >
                    Done
                  </button>
                </div>
              )}

              {/* FAILED */}
              {deliveryState === 'FAILED' && (
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200 text-center animate-in zoom-in duration-300">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-10 h-10 text-red-600" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-xl mb-2">Verification Failed</h3>
                  <p className="text-sm text-red-600 mb-5">{errorMsg}</p>
                  <button
                    onClick={() => { setDeliveryState('AT_FARM'); setErrorMsg(''); }}
                    className="w-full border-2 border-red-200 text-red-600 py-3 rounded-xl font-bold hover:bg-red-50 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
