// utils/normalizeWeather.ts
export function normalizeWeather(apiData: any) {
  const temp = apiData.main.temp;        // °C
  const humidity = apiData.main.humidity; // %
  const wind = apiData.wind.speed;       // m/s
  const weather = apiData.weather[0]?.main || "Clear";

  return {
    hot: Math.min(100, Math.max(0, (temp / 40) * 100)), 
    cold: Math.min(100, Math.max(0, ((15 - temp) / 15) * 100)), 
    wet: weather.toLowerCase().includes("rain") ? humidity : humidity * 0.3,
    windy: Math.min(100, (wind / 15) * 100), 
    uncomfortable: Math.min(100, (humidity + temp) / 2), 
    date: new Date().toISOString(),
    location: {
      lat: apiData.coord.lat,
      lng: apiData.coord.lon,
      address: apiData.name,
    },
    activity: "outdoor event",
  };
}
