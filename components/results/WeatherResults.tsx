'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { WeatherData } from '@/app/dashboard/page';
import WeatherChart from './WeatherChart';
import WeatherIcons from './WeatherIcons';
import TrendsGraph from './TrendsGraph';
import ShareableCard from './ShareableCard';

interface WeatherResultsProps {
  data: WeatherData;
}

export default function WeatherResults({ data }: WeatherResultsProps) {
  // Normalize potentially undefined or mismatched shapes from API
  const normalizedDate = data?.date ? new Date(data.date as unknown as string) : null;
  const hasCoords = typeof data?.location?.lat === 'number' && typeof data?.location?.lng === 'number';
  const locationLabel = data?.location?.address ?? (hasCoords ? `${data.location.lat.toFixed(4)}, ${data.location.lng.toFixed(4)}` : 'Unknown location');
  const activityLabel = data?.activity ? (data.activity.charAt(0).toUpperCase() + data.activity.slice(1)) : 'Activity';

  const getRecommendation = () => {
    const conditions = [
      { name: 'rain', value: data.wet, threshold: 60, icon: '🌧️' },
      { name: 'wind', value: data.windy, threshold: 70, icon: '💨' },
      { name: 'heat', value: data.hot, threshold: 80, icon: '☀️' },
      { name: 'cold', value: data.cold, threshold: 70, icon: '❄️' },
      { name: 'discomfort', value: data.uncomfortable, threshold: 65, icon: '😓' },
    ];

    const highRiskConditions = conditions.filter(c => c.value > c.threshold);
    
    if (highRiskConditions.length === 0) {
      return "🌟 Perfect conditions for your outdoor activity! Enjoy your adventure!";
    }

    const primary = highRiskConditions.reduce((prev, current) => 
      prev.value > current.value ? prev : current
    );

    const recommendations = {
      rain: "Better pack an umbrella and waterproof gear!",
      wind: "Expect strong winds - secure loose items and dress appropriately!",
      heat: "Stay hydrated and seek shade regularly!",
      cold: "Bundle up with warm layers and protect exposed skin!",
      discomfort: "High humidity and heat - take frequent breaks and stay cool!",
    };

    return `${primary.icon} There's a ${primary.value}% chance of ${primary.name === 'discomfort' ? 'uncomfortable conditions' : primary.name} on your chosen day. ${recommendations[primary.name as keyof typeof recommendations]}`;
  };

  return (
    <div className="space-y-8">
      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-4 glow-text">Weather Forecast Summary</h2>
          <p className="text-lg text-slate-200 leading-relaxed">
            {getRecommendation()}
          </p>
          <div className="mt-4 text-sm text-slate-400">
            📍 {locationLabel} • 
            📅 {normalizedDate ? normalizedDate.toDateString() : 'Unknown date'} • 
            🎯 {activityLabel}
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
    </div>
  );
}