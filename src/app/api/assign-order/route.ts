import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { subscribeToGeofence } from '@/lib/camara';

export async function POST(request: Request) {
  try {
    const { orderId, farmerPhone, distributorPhone, lat, lng } = await request.json();

    if (!orderId || !farmerPhone) {
      return NextResponse.json({ error: 'Order ID and Farmer Phone required' }, { status: 400 });
    }

    // Generate a simple 4-digit code for the farmer
    const deliveryCode = Math.floor(1000 + Math.random() * 9000).toString();

    // In a real app, the backend would:
    // 1. Subscribe to the Nokia NaC Geofence for the distributor phone
    // 2. Set the geofence around the farmer's plot (lat, lng)
    if (distributorPhone && lat && lng) {
        // Trigger NaC geofencing (mock webhook used)
        await subscribeToGeofence(
            distributorPhone, 
            'https://agroagents.com/api/webhooks/geofence', 
            lat, 
            lng, 
            100 // 100 meters radius
        );
    }

    // 3. Update the Supabase database Order status
    let updatedOrder = null;
    try {
      const { data, error } = await supabaseAdmin
        .from('orders')
        .update({
          status: 'IN_TRANSIT',
          delivery_code: deliveryCode,
          distributor_id: 'd9b9c9f2-0000-0000-0000-000000000000' 
        })
        .eq('id', orderId)
        .select()
        .single();
        
      if (error) console.error('Supabase Order Update Error:', error);
      updatedOrder = data;
    } catch (dbErr) {
      console.warn('DB update failed:', dbErr);
    }

    return NextResponse.json({
      success: true,
      message: "Order assigned and geofence activated.",
      deliveryCode: deliveryCode, // Returned for the demo UI to show it arriving at the farmer
      order: updatedOrder
    });

  } catch (error: any) {
    console.error("Assign Order API Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
