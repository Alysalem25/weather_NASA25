// 'use client';

// import { motion } from 'framer-motion';
// import { Card } from '@/components/ui/card';
// import { 
//   Thermometer, 
//   Droplets, 
//   Wind, 
//   Eye, 
//   Gauge,
//   MapPin,
//   RefreshCw
// } from 'lucide-react';
// import { CurrentWeather, LocationData } from '@/lib/weather-service';

// interface CurrentWeatherCardProps {
//   weather: CurrentWeather;
//   location: LocationData;
//   loading?: boolean;
//   onRefresh?: () => void;
// }

// export default function CurrentWeatherCard({ 
//   weather, 
//   location, 
//   loading = false, 
//   onRefresh 
// }: CurrentWeatherCardProps) {
//   const getWeatherIcon = (icon: string) => {
//     return `https://openweathermap.org/img/wn/${icon}@2x.png`;
//   };

//   const getWindDirection = (degrees: number) => {
//     const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
//     return directions[Math.round(degrees / 22.5) % 16];
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.6 }}
//     >
//       <Card className="glass-card p-6">
//         <div className="flex justify-between items-start mb-4">
//           <div>
//             <h2 className="text-2xl font-bold text-white mb-2">Current Weather</h2>
//             <div className="flex items-center space-x-2 text-slate-300">
//               <MapPin className="w-4 h-4" />
//               <span>{location.city}, {location.country}</span>
//             </div>
//           </div>
//           {onRefresh && (
//             <button
//               onClick={onRefresh}
//               disabled={loading}
//               className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
//             >
//               <RefreshCw className={`w-5 h-5 text-white ${loading ? 'animate-spin' : ''}`} />
//             </button>
//           )}
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Main Weather Info */}
//           <div className="text-center">
//             <div className="flex items-center justify-center mb-4">
//               <img
//                 src={getWeatherIcon(weather.icon)}
//                 alt={weather.description}
//                 className="w-20 h-20"
//               />
//             </div>
//             <div className="text-6xl font-bold text-white mb-2">
//               {weather.temperature}°
//             </div>
//             <div className="text-xl text-slate-300 mb-1 capitalize">
//               {weather.description}
//             </div>
//             <div className="text-sm text-slate-400">
//               Feels like {weather.feelsLike}°
//             </div>
//           </div>

//           {/* Weather Details */}
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="flex items-center space-x-3">
//                 <Droplets className="w-5 h-5 text-cyan-400" />
//                 <div>
//                   <div className="text-sm text-slate-400">Humidity</div>
//                   <div className="text-lg font-semibold text-white">{weather.humidity}%</div>
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-3">
//                 <Wind className="w-5 h-5 text-blue-400" />
//                 <div>
//                   <div className="text-sm text-slate-400">Wind</div>
//                   <div className="text-lg font-semibold text-white">
//                     {weather.windSpeed} m/s {getWindDirection(weather.windDirection)}
//                   </div>
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-3">
//                 <Gauge className="w-5 h-5 text-green-400" />
//                 <div>
//                   <div className="text-sm text-slate-400">Pressure</div>
//                   <div className="text-lg font-semibold text-white">{weather.pressure} hPa</div>
//                 </div>
//               </div>
              
//               <div className="flex items-center space-x-3">
//                 <Eye className="w-5 h-5 text-purple-400" />
//                 <div>
//                   <div className="text-sm text-slate-400">Visibility</div>
//                   <div className="text-lg font-semibold text-white">{weather.visibility} km</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </Card>
//     </motion.div>
//   );
// }
"use client";

import { useState } from "react";

interface Weather {
  city: string;
  country: string;
  main: string;
  description: string;
  temperature: number;
  humidity: number;
  wind: number;
  alerts: string[];
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<Weather | null>(null);
  const [useRealData, setUseRealData] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    setLoading(true);
    try {
      // Get user location
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;

        const apiEndpoint = useRealData
          ? "/api/real-weather"
          : "/api/current-weather";

        const res = await fetch(apiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: latitude, lng: longitude }),
        });

        const data = await res.json();
        setWeather(data.weather);
      });
    } catch (error) {
      console.error("Error fetching weather:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md bg-white">
      <h2 className="text-xl font-bold mb-2">🌍 Weather Dashboard</h2>

      <div className="flex gap-2 mb-4">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => {
            setUseRealData(false);
            fetchWeather();
          }}
        >
          Mock Data
        </button>

        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => {
            setUseRealData(true);
            fetchWeather();
          }}
        >
          Real Data
        </button>
      </div>

      {loading && <p>Loading...</p>}

      {weather && (
        <div>
          <h3 className="text-lg font-semibold">
            {weather.city}, {weather.country}
          </h3>
          <p>{weather.main} - {weather.description}</p>
          <p>🌡 Temp: {weather.temperature} °C</p>
          <p>💧 Humidity: {weather.humidity}%</p>
          <p>🌬 Wind: {weather.wind} m/s</p>

          {weather.alerts.length > 0 && (
            <div className="mt-2 p-2 bg-yellow-100 border-l-4 border-yellow-500">
              <strong>⚠ Alerts:</strong>
              <ul>
                {weather.alerts.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
