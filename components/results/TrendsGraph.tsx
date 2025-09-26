'use client';

import { Card } from '@/components/ui/card';
import { WeatherData } from '@/app/dashboard/page';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

interface TrendsGraphProps {
  data: WeatherData;
}

export default function TrendsGraph({ data }: TrendsGraphProps) {
  // Generate mock historical data for demonstration
  const generateHistoricalData = () => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 20 }, (_, i) => currentYear - 19 + i);
    
    return years.map(year => ({
      year,
      Temperature: Math.max(0, Math.min(100, data.temp + (Math.random() - 0.5) * 40)),
      Feels_Like: Math.max(0, Math.min(100, data.feelsLike + (Math.random() - 0.5) * 40)),
      Humidity: Math.max(0, Math.min(100, data.humidity + (Math.random() - 0.5) * 40)),
      Wind_Speed: Math.max(0, Math.min(100, data.windSpeed + (Math.random() - 0.5) * 40)),
    }));
  };

  const historicalData = generateHistoricalData();

  return (
    <Card className="glass-card p-6">
      <h3 className="text-xl font-semibold mb-6 text-white">20-Year Historical Trends</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12, fill: '#e2e8f0' }}
              stroke="#ffffff20"
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#e2e8f0' }}
              stroke="#ffffff20"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                color: 'white',
              }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="Temperature" 
              stroke="#f97316" 
              strokeWidth={2}
              name="Temperature %"
            />
            <Line 
              type="monotone" 
              dataKey="Feels_Like" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Feels Like %"
            />
            <Line 
              type="monotone" 
              dataKey="Wind_Speed" 
              stroke="#06b6d4" 
              strokeWidth={2}
              name="Wind Speed %"
            />
            <Line 
              type="monotone" 
              dataKey="Humidity" 
              stroke="#8b5cf6" 
              strokeWidth={2}
              name="Humidity %"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}