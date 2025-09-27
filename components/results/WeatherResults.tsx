'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { WeatherData } from '@/app/dashboard/page';
import WeatherChart from './WeatherChart';
import WeatherIcons from './WeatherIcons';
import TrendsGraph from './TrendsGraph';
import ShareableCard from './ShareableCard';
import ddata from "@/data/all_hurricanes.json";

interface WeatherResultsProps {
  data: WeatherData;
}

export default function WeatherResults({ data }: WeatherResultsProps) {
  // Normalize potentially undefined or mismatched shapes from API
  const normalizedDate = data?.date ? new Date(data.date as unknown as string) : null;
  const hasCoords =
    typeof data?.location?.lat === 'number' &&
    typeof data?.location?.lng === 'number';
  const locationLabel =
    data?.location?.address ??
    (hasCoords
      ? `${data.location.lat.toFixed(4)}, ${data.location.lng.toFixed(4)}`
      : 'Unknown location');
  const activityLabel = data?.activity
    ? data.activity.charAt(0).toUpperCase() + data.activity.slice(1)
    : 'Activity';

  const getRecommendation = () => {
    const conditions = [
      { name: 'Temperature', value: data.temp, threshold: 60, icon: '🌧️' },
      { name: 'Feels Like', value: data.feelsLike, threshold: 70, icon: '💨' },
      { name: 'Wind Speed', value: data.windSpeed, threshold: 80, icon: '☀️' },
      { name: 'Humidity', value: data.humidity, threshold: 70, icon: '❄️' },
      // { name: 'discomfort', value: data.uncomfortable, threshold: 65, icon: '😓' },
    ];

    const highRiskConditions = conditions.filter((c) => c.value > c.threshold);

    if (highRiskConditions.length === 0) {
      return '🌟 Perfect conditions for your outdoor activity! Enjoy your adventure!';
    }

    const primary = highRiskConditions.reduce((prev, current) =>
      prev.value > current.value ? prev : current
    );

    const recommendations = {
      rain: 'Better pack an umbrella and waterproof gear!',
      wind: 'Expect strong winds - secure loose items and dress appropriately!',
      heat: 'Stay hydrated and seek shade regularly!',
      cold: 'Bundle up with warm layers and protect exposed skin!',
      discomfort: 'High humidity and heat - take frequent breaks and stay cool!',
    };

    return `${primary.icon} There's a ${
      primary.value
    }% chance of ${
      primary.name === 'discomfort' ? 'uncomfortable conditions' : primary.name
    } on your chosen day. ${
      recommendations[primary.name as keyof typeof recommendations]
    }`;
  };

  // ✅ Fixed haversine formula
  function haversineDistance(
    data: { lat1: number; lon1: number },
    ddata: { lat2: number; lon2: number }
  ) {
    const R = 6371; // km
    const dLat = ((ddata.lat2 - data.lat1) * Math.PI) / 180;
    const dLon = ((ddata.lon2 - data.lon1) * Math.PI) / 180;
    const lat1Rad = (data.lat1 * Math.PI) / 180;
    const lat2Rad = (ddata.lat2 * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in km
  }

  const getDangerousEvent = () => {
    if (!hasCoords) return null;

    for (const record of ddata as any[]) {
      // skip header row
      if (record.Category === 'Category') continue;

      const lat = parseFloat(record.Lat);
      const lon = parseFloat(record.Lon);

      if (isNaN(lat) || isNaN(lon)) continue;

      const dist = haversineDistance(
        { lat1: data.location.lat, lon1: data.location.lng },
        { lat2: lat, lon2: lon }
      );

      // If within 100km danger zone
      if (dist <= 1000) {
        return {
          type: record.Category,
          description: `⚠️ ${record.Category} detected nearby! Pressure: ${record.Pressure} hPa`,
          date: record.Date,
          id: record.ID,
          distance: dist.toFixed(1),
        };
      }
    }
    return null;
  };

  const dangerEvent = getDangerousEvent();

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4 glow-text">
            Weather Forecast Summary
          </h2>
          <p className="text-lg text-slate-200 leading-relaxed">
            {getRecommendation()}
          </p>
          <div className="mt-4 text-sm text-slate-400">
            📍 {locationLabel} • 📅{' '}
            {normalizedDate ? normalizedDate.toDateString() : 'Unknown date'} • 🎯{' '}
            {activityLabel}
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weather Icons */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <WeatherIcons data={data} />
        </motion.div>

        {/* Weather Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <WeatherChart data={data} />
        </motion.div>
      </div>

      {/* Historical Trends */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <TrendsGraph data={data} />
      </motion.div>

      {/* Shareable Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <ShareableCard data={data} />
      </motion.div>

      {/* Dangerous Weather Event Alert */}
      {dangerEvent && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Card className="p-6 bg-red-900/80 border-red-500 text-white shadow-lg">
            <h2 className="text-xl font-bold mb-2">🚨 Dangerous Weather Alert</h2>
            <p>{dangerEvent.description}</p>
            <div className="mt-2 text-sm">
              Event ID: {dangerEvent.id} • Date: {dangerEvent.date} • Distance:{' '}
              {dangerEvent.distance} km
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
