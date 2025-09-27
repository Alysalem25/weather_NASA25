'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { WeatherData } from '@/app/dashboard/page';
import { toast } from 'sonner';

interface ShareableCardProps {
  data: WeatherData;
}

export default function ShareableCard({ data }: ShareableCardProps) {
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const normalizedDate = data?.date ? new Date(data.date as unknown as string) : null;

  const hasCoords =
    typeof data?.location?.lat === 'number' && typeof data?.location?.lng === 'number';
  const locationLabel =
    data?.location?.address ??
    (hasCoords
      ? `${data.location.lat.toFixed(2)}, ${data.location.lng.toFixed(2)}`
      : 'Selected Location');
  const activityLabel = data?.activity
    ? data.activity.charAt(0).toUpperCase() + data.activity.slice(1)
    : 'your activity';

  // ✅ Suitability logic
  const getActivitySuitability = (activity: string, temp: number, wind: number): boolean => {
    switch (activity.toLowerCase()) {
      case 'walking':
        return temp > 10 && temp < 35 && wind < 30;
      case 'picnic':
        return temp > 15 && temp < 30;
      case 'fishing':
        return temp > 5;
      case 'ice skating':
        return temp <= 0;
      case 'party':
        return wind < 2;
      case 'swimming':
        return temp > 20 && temp < 35 && wind < 20;
      case 'cycling':
        return temp > 10 && temp < 30 && wind < 25;
      case 'hiking':
        return temp > 5 && temp < 30 && wind < 30;
      case 'beach day':
      case 'beach':
        return temp > 25 && temp < 35 && wind < 20;
      case 'barbecue':
        return temp > 15 && temp < 35;
      default:
        return false;
    }
  };

  // ✅ Fetch forecast from OpenWeather
  useEffect(() => {
    if (!hasCoords) return;

    const fetchForecast = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${data.location.lat}&lon=${data.location.lng}&appid=691ff23b4f028e2cb9de59020dcd0520&units=metric`
        );
        const json = await res.json();

        if (json?.list) {
          const normalized: WeatherData[] = json.list.map((item: any) => ({
            temp: item.main.temp,
            feelsLike: item.main.feels_like,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
            date: new Date(item.dt * 1000),
            location: data.location,
            activity: data.activity,
          }));
          setForecast(normalized);
        }
      } catch (err) {
        console.error('Error fetching forecast:', err);
      }
    };

    fetchForecast();
  }, [data.location, data.activity, hasCoords]);

  // ✅ Filter suitable days
  const available_data = forecast.filter((day) =>
    getActivitySuitability(day.activity, day.temp, day.windSpeed)
  );

  // ✅ Generate social card
  const generateSocialCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#1e1b4b');
    gradient.addColorStop(1, '#312e81');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('NASA Weather Report', 400, 80);
    ctx.font = '24px Arial';
    ctx.fillText(locationLabel, 400, 120);
    ctx.fillText(normalizedDate ? normalizedDate.toDateString() : 'Unknown date', 400, 150);

    const conditions = [
      { name: 'Temperature', value: data.temp, y: 220 },
      { name: 'Feels Like', value: data.feelsLike, y: 270 },
      { name: 'Wind Speed', value: data.windSpeed, y: 320 },
      { name: 'Humidity', value: data.humidity, y: 370 },
    ];
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    conditions.forEach((c) => {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`${c.name}:`, 200, c.y);
      ctx.fillStyle = '#00d9ff';
      ctx.fillText(`${c.value}`, 350, c.y);
    });

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nasa-weather-report-${
          normalizedDate ? normalizedDate.toISOString().split('T')[0] : 'unknown-date'
        }.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Social card downloaded!');
      }
    });
  };

  const shareText = () => {
    const text = `Check out my NASA weather forecast! 🌟\n📍 ${locationLabel}\n📅 ${
      normalizedDate ? normalizedDate.toDateString() : 'Unknown date'
    }\n🎯 Perfect for ${activityLabel}`;

    if (navigator.share) {
      navigator.share({ title: 'NASA Weather Report', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Text copied to clipboard!');
    }
  };

  return (
    <Card className="glass-card p-6">
      <h3 className="text-xl font-semibold mb-4 text-white">Share Your Report</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={generateSocialCard}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Social Card
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            onClick={shareText}
            variant="outline"
            className="w-full border-white/20 hover:bg-white/10"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Text
          </Button>
        </motion.div>
      </div>

      {/* Preview */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <h4 className="font-semibold text-white mb-2">Preview:</h4>
        <p className="text-sm text-slate-300">
          Check out my NASA weather forecast! 🌟
          <br />📍 {locationLabel}
          <br />📅 {normalizedDate ? normalizedDate.toDateString() : 'Unknown date'}
          <br />
          🎯{' '}
          {getActivitySuitability(data.activity, data.temp, data.windSpeed)
            ? `Suitable for ${activityLabel}`
            : `Not suitable for ${activityLabel}`}
        </p>
      </div>

      {/* Available Days */}
      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <h4 className="font-semibold text-white mb-2">Available Days (Next 10):</h4>
        {available_data.length > 0 ? (
          <ul className="text-sm text-slate-300 space-y-1">
            {available_data.slice(0, 10).map((day, i) => (
              <li key={i}>
                📅 {day.date.toDateString()} → Temp: {day.temp}°C | Wind: {day.windSpeed} m/s
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-slate-400">No suitable days in the next 10 days</p>
        )}
      </div>
    </Card>
  );
}
