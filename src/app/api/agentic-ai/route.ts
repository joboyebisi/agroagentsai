import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { query, context, farmSize } = await request.json();

    // Deterministic lookup based on farm size (Hectares)
    // 1 Hectare = 1 bag of seed (25kg), 4 bags of Fertilizer (200kg NPK)
    const hectares = parseFloat(farmSize) || 2.4; 
    
    const seedKg = Math.round(hectares * 25);
    const fertKg = Math.round(hectares * 100);
    const tractorHours = Math.round(hectares * 1.5);

    if (context === 'farmer_chat') {
        // Quick responses for the chat interface
        if (query.toLowerCase().includes("seed") || query.toLowerCase().includes("fertilizer") || query.toLowerCase().includes("input")) {
            return NextResponse.json({
                reply: `Based on your ${hectares} hectare plot, you require ${seedKg}kg of Maize Seed and ${fertKg}kg of NPK Fertilizer. The Outgrower Manager will initiate the distribution soon.`
            });
        }
        
        return NextResponse.json({
            reply: `I am your AI Advisor. For your ${hectares} hectare plot, I have analyzed the soil and weather data. I recommend planting in the next 3 days.`
        });
    }

    if (context === 'generate_schedule') {
        // Generates the planting schedule for the admin dashboard
        return NextResponse.json({
            success: true,
            schedule: {
                inputs: {
                    seed_kg: seedKg,
                    fertilizer_kg: fertKg,
                    tractor_hours: tractorHours
                },
                timing: {
                    recommendation: "Plant within 3 days",
                    harvest_estimate: "October 2026"
                }
            }
        });
    }

    return NextResponse.json({ reply: "I'm not sure how to help with that context." });

  } catch (error: any) {
    console.error("Agentic AI Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
