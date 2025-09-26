import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { location, date, activity } = await request.json();

    // Validate required fields
    if (!location || !date || !activity) {
      return NextResponse.json(
        { error: 'Missing required fields: location, date, or activity' },
        { status: 400 }
      );
    }

    // Validate location structure
    if (!location.lat || !location.lng) {
      return NextResponse.json(
        { error: 'Invalid location: missing latitude or longitude' },
        { status: 400 }
      );
    }

    // Mock NASA weather data generation
    // In a real application, this would call NASA APIs
    const baseWeatherData = {
      hiking: { hot: 45, cold: 25, windy: 35, wet: 40, uncomfortable: 30 },
      fishing: { hot: 30, cold: 20, windy: 50, wet: 60, uncomfortable: 25 },
      beach: { hot: 70, cold: 10, windy: 40, wet: 20, uncomfortable: 65 },
      picnic: { hot: 40, cold: 30, windy: 25, wet: 35, uncomfortable: 35 },
      sports: { hot: 55, cold: 20, windy: 45, wet: 30, uncomfortable: 50 },
    };

    const baseData = baseWeatherData[activity as keyof typeof baseWeatherData] || baseWeatherData.hiking;

    // Add some randomness to simulate real data
    const weatherData = {
      hot: Math.max(0, Math.min(100, baseData.hot + (Math.random() - 0.5) * 30)),
      cold: Math.max(0, Math.min(100, baseData.cold + (Math.random() - 0.5) * 30)),
      windy: Math.max(0, Math.min(100, baseData.windy + (Math.random() - 0.5) * 30)),
      wet: Math.max(0, Math.min(100, baseData.wet + (Math.random() - 0.5) * 30)),
      uncomfortable: Math.max(0, Math.min(100, baseData.uncomfortable + (Math.random() - 0.5) * 30)),
      location,
      date: new Date(date),
      activity,
    };

    // Round values to integers
    Object.keys(weatherData).forEach(key => {
      if (typeof weatherData[key as keyof typeof weatherData] === 'number') {
        (weatherData as any)[key] = Math.round(weatherData[key as keyof typeof weatherData] as number);
      }
    });

    console.log('Generated weather data:', weatherData);
    return NextResponse.json(weatherData);
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate weather data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}