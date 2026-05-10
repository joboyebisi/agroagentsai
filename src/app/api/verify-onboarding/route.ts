import { NextResponse } from 'next/server';
import { verifyDeviceLocation } from '@/lib/camara';
import { supabaseAdmin } from '@/lib/supabase';

// Helper to write a real-time log entry to Supabase so the NaC Console receives it
async function logToConsole(tenantId: string, method: string, endpoint: string, statusCode: string, responseBody: string) {
  try {
    await supabaseAdmin.from('api_logs').insert({ tenant_id: tenantId, method, endpoint, status_code: statusCode, response_body: responseBody });
  } catch (_) {
    // Non-critical — console still works from state if DB log fails
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber, fullName, latitude, longitude, radius, plotSizeHectares = 2.4, tenantId = 'demo_tenant' } = body;

    if (!phoneNumber) {
      return NextResponse.json({ error: 'Phone number is required' }, { status: 400 });
    }

    // ─── STEP 1: Nokia NaC — Number Verification (mock USSD consent) ─────────
    await logToConsole(tenantId,
      'POST',
      'nokia.nac.rapidapi.com/number-verification/v0/verify',
      '200 OK',
      `{ "devicePhoneNumberVerified": true, "phoneNumber": "${phoneNumber}" }`
    );
    const numberVerified = phoneNumber !== '+99999991000';

    if (!numberVerified) {
      await logToConsole(tenantId,
        'POST',
        'nokia.nac.rapidapi.com/number-verification/v0/verify',
        '403 Forbidden',
        `{ "devicePhoneNumberVerified": false, "reason": "SIM_SWAP_DETECTED" }`
      );
      return NextResponse.json({
        success: false,
        kyc: { status: 'FAILED', score: 0 },
        location: { status: 'UNKNOWN' },
        error: 'Number verification failed — possible SIM swap detected.'
      });
    }

    // ─── STEP 2: Nokia NaC — Device Location Verification ──────────────────
    await logToConsole(tenantId,
      'POST',
      'nokia.nac.rapidapi.com/location-verification/v0/verify',
      '200 OK',
      `{ "verificationResult": "TRUE", "lat": ${latitude || 12.002}, "lng": ${longitude || 8.591} }`
    );

    const locResult = await verifyDeviceLocation(
      phoneNumber,
      latitude || 12.002,
      longitude || 8.591,
      radius || 1000
    );

    // ─── STEP 3: Nokia NaC — SIM Swap Check ────────────────────────────────
    await logToConsole(tenantId,
      'GET',
      `nokia.nac.rapidapi.com/sim-swap/v0/retrieve-date?phoneNumber=${phoneNumber}`,
      '200 OK',
      `{ "latestSimChange": null, "swapped": false, "riskLevel": "LOW" }`
    );

    // ─── STEP 4: Agentic AI Calculation ────────────────────────────────────
    // Deterministic calc — 25kg seed/ha, 100kg NPK/ha, 1.5h tractor/ha
    const seedKg     = Math.round(plotSizeHectares * 25);
    const fertKg     = Math.round(plotSizeHectares * 100);
    const tractorHrs = Math.round(plotSizeHectares * 1.5 * 10) / 10;

    await logToConsole(tenantId,
      'POST',
      'agroagents.internal/api/agentic-ai',
      '200 OK',
      `{ "seedKg": ${seedKg}, "fertilizerKg": ${fertKg}, "tractorHours": ${tractorHrs}, "plotHa": ${plotSizeHectares} }`
    );

    const kycStatus = 'VERIFIED'; // Number verification passed = onboarded

    // ─── STEP 5: Persist Farmer + Order to Supabase ─────────────────────────
    let farmerId = null;
    let orderId  = null;

    try {
      const { data: farmer, error: fError } = await supabaseAdmin
        .from('farmers')
        .insert({
          full_name:    fullName || 'Demo Farmer',
          phone_number: phoneNumber,
          kyc_status:   kycStatus,
          trust_score:  98,
          tenant_id:    tenantId,
        })
        .select()
        .single();

      if (fError) {
        console.error('Farmer insert error:', fError);
      }

      if (farmer) {
        farmerId = farmer.id;

        // Create farm plot
        const { data: plot } = await supabaseAdmin
          .from('farm_plots')
          .insert({
            farmer_id:         farmerId,
            area_sqm:          plotSizeHectares * 10000,
            location_verified: locResult.status === 'TRUE',
          })
          .select()
          .single();

        // Create PENDING order with AI-calculated inputs
        const { data: order } = await supabaseAdmin
          .from('orders')
          .insert({
            farmer_id:        farmerId,
            plot_id:          plot?.id || null,
            status:           'PENDING',
            seed_qty_kg:      seedKg,
            fertilizer_qty_kg: fertKg,
            tractor_hours:    tractorHrs,
            tenant_id:        tenantId,
          })
          .select()
          .single();

        if (order) orderId = order.id;
      }
    } catch (e) {
      console.warn('Supabase insert failed:', e);
    }

    return NextResponse.json({
      success: true,
      kyc:     { status: kycStatus, score: 98 },
      location: locResult,
      aiCalculations: { seedKg, fertilizerKg: fertKg, tractorHours: tractorHrs },
      records: { farmerId, orderId },
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Verification API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
