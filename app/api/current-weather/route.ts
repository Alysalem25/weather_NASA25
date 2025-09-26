// import { NextRequest, NextResponse } from 'next/server';
// import { weatherService } from '@/lib/weather-service';

// // Force dynamic rendering
// export const dynamic = 'force-dynamic';

// export async function POST(request: NextRequest) {
//   try {
//     const { lat, lng } = await request.json();

//     if (!lat || !lng) {
//       return NextResponse.json(
//         { error: 'Latitude and longitude are required' },
//         { status: 400 }
//       );
//     }

//     // Get current weather
//     const weather = await weatherService.getCurrentWeather(lat, lng);
    
//     // Get location data
//     const location = await weatherService.getLocationFromCoords(lat, lng);
    
//     // Check for dangerous conditions
//     const dangerousAlerts = weatherService.checkDangerousConditions(weather);
    
//     // Combine all alerts
//     const allAlerts = [...weather.alerts, ...dangerousAlerts];

//     return NextResponse.json({
//       weather,
//       location,
//       alerts: allAlerts,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error) {
//     console.error('Current weather API error:', error);
//     return NextResponse.json(
//       { 
//         error: 'Failed to fetch current weather', 
//         details: error instanceof Error ? error.message : 'Unknown error' 
//       },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { lat, lng } = await req.json();

  // Mock data (safe for testing)
  const weather = {
    city: "Mock City",
    country: "MC",
    main: "Clear",
    description: "clear sky",
    temperature: 25,
    humidity: 40,
    wind: 3.5,
    alerts: ["No alerts"]
  };

  return NextResponse.json({ weather });
}
