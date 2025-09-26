'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { WeatherData } from '@/app/dashboard/page';

interface WeatherIconsProps {
  data: WeatherData;
}

export default function WeatherIcons({ data }: WeatherIconsProps) {
  const conditions = [
    { name: 'Very Hot', value: data.hot, icon: '☀️', color: 'text-orange-400' },
    { name: 'Very Cold', value: data.cold, icon: '❄️', color: 'text-blue-400' },
    { name: 'Very Windy', value: data.windy, icon: '💨', color: 'text-gray-400' },
    { name: 'Very Wet', value: data.wet, icon: '🌧️', color: 'text-blue-300' },
    { name: 'Uncomfortable', value: data.uncomfortable, icon: '😓', color: 'text-yellow-400' },
  ];

  return (
    <Card className="glass-card p-6">
      <h3 className="text-xl font-semibold mb-6 text-white">Condition Probabilities</h3>
      <div className="space-y-4">
        {conditions.map((condition, index) => (
          <motion.div
            key={condition.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{condition.icon}</span>
              <span className="text-white font-medium">{condition.name}</span>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${condition.color}`}>
                {condition.value}%
              </div>
              <div className="w-16 bg-white/10 rounded-full h-2 mt-1">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${condition.value}%` }}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}