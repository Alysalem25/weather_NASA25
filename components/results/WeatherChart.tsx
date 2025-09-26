'use client';

import { Card } from '@/components/ui/card';
import { WeatherData } from '@/app/dashboard/page';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

interface WeatherChartProps {
  data: WeatherData;
}

export default function WeatherChart({ data }: WeatherChartProps) {
  console.log('WeatherChart data:', data);
  const chartData = [
    { subject: 'Temperature', A: data.temp, fullMark: 100 },
    { subject: 'Feels Like', A: data.feelsLike, fullMark: 100 },
    { subject: 'Wind Speed', A: data.windSpeed, fullMark: 100 },
    { subject: 'Humidity', A: data.humidity, fullMark: 100 },
    { subject: 'Uncomfortable', A: data.feelsLike, fullMark: 100 },
  ];

  return (
    <Card className="glass-card p-6">
      <h3 className="text-xl font-semibold mb-4 text-white">Weather Conditions Radar</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid stroke="#ffffff20" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fontSize: 12, fill: '#e2e8f0' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10, fill: '#94a3b8' }}
            />
            <Radar
              name="Probability"
              dataKey="A"
              stroke="#00d9ff"
              fill="#00d9ff"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}