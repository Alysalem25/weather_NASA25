'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import AnimatedBackground from '@/components/ui/AnimatedBackground';

const weatherConditions = [
  { name: 'Clear Sky', condition: 'clear', temperature: 25 },
  { name: 'Rainy', condition: 'rain', temperature: 15 },
  { name: 'Snowy', condition: 'snow', temperature: -5 },
  { name: 'Misty', condition: 'mist', temperature: 10 },
  { name: 'Cloudy', condition: 'clouds', temperature: 18 },
  { name: 'Hot', condition: 'clear', temperature: 38 },
  { name: 'Cold', condition: 'clear', temperature: -15 },
];

export default function WeatherBackgroundDemo() {
  const [selectedWeather, setSelectedWeather] = useState(weatherConditions[0]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground 
        weatherCondition={selectedWeather.condition}
        temperature={selectedWeather.temperature}
      />

      <div className="relative z-10 p-8">
        <Card className="glass-card p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Weather Background Demo</h2>
          <p className="text-slate-300 mb-6">
            Click the buttons below to see how the background changes based on weather conditions and temperature.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {weatherConditions.map((weather) => (
              <Button
                key={weather.name}
                onClick={() => setSelectedWeather(weather)}
                variant={selectedWeather.name === weather.name ? "default" : "outline"}
                className={`transition-all duration-300 ${
                  selectedWeather.name === weather.name 
                    ? 'bg-cyan-500 hover:bg-cyan-600' 
                    : 'bg-white/10 hover:bg-white/20 border-white/20'
                }`}
              >
                {weather.name}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Current Weather Simulation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-lg font-medium text-cyan-400 mb-2">Condition</h4>
              <p className="text-white capitalize">{selectedWeather.condition}</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-cyan-400 mb-2">Temperature</h4>
              <p className="text-white">{selectedWeather.temperature}°C</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-cyan-400 mb-2">Background</h4>
              <p className="text-white">
                {selectedWeather.condition === 'clear' && selectedWeather.temperature > 30 && 'Hot & Sunny'}
                {selectedWeather.condition === 'clear' && selectedWeather.temperature < 0 && 'Cold & Clear'}
                {selectedWeather.condition === 'clear' && selectedWeather.temperature >= 0 && selectedWeather.temperature <= 30 && 'Clear Sky'}
                {selectedWeather.condition === 'rain' && 'Rainy Weather'}
                {selectedWeather.condition === 'snow' && 'Snowy Weather'}
                {selectedWeather.condition === 'mist' && 'Misty Weather'}
                {selectedWeather.condition === 'clouds' && 'Cloudy Weather'}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
