// import { NextRequest, NextResponse } from 'next/server';
// import { realWeatherService } from '@/lib/real-weather-service';

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

//     // Get real weather data
//     const weatherData = await realWeatherService.getCurrentWeather(lat, lng);
    
//     return NextResponse.json({
//       weather: weatherData,
//       success: true,
//       timestamp: new Date().toISOString(),
//     });
//   } catch (error) {
//     console.error('Real weather API error:', error);
//     return NextResponse.json(
//       { 
//         error: 'Failed to fetch real weather data', 
//         details: error instanceof Error ? error.message : 'Unknown error',
//         success: false
//       },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from 'next/server';

const API_KEY = 'https://api.openweathermap.org/data/2.5/weather?lat=30.0444&lon=31.2357&appid=d0b2520309fe7de742ddff10efeb2242'

export async function POST(req: Request) {
  try {
    const { lat, lng } = await req.json();

    if (!lat || !lng) {
      return NextResponse.json({ error: 'Latitude and longitude required' }, { status: 400 });
    }

    // OpenWeatherMap Current Weather API
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${API_KEY}`
    );

    if (!res.ok) {
      throw new Error(`Failed to fetch weather: ${res.statusText}`);
    }

    const data = await res.json();

    const weather = {
      city: data.name,
      country: data.sys.country,
      main: data.weather[0].main,
      description: data.weather[0].description,
      temperature: data.main.temp,
      humidity: data.main.humidity,
      wind: data.wind.speed,
      alerts: [] // Add real alerts if you extend with One Call API
    };

    return NextResponse.json({ weather });
  } catch (error: any) {
    console.error('Weather API error:', error.message);
    return NextResponse.json({ error: 'Failed to fetch real weather data' }, { status: 500 });
  }
}
