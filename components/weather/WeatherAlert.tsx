'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, X, Wind, Droplets, Thermometer, Eye } from 'lucide-react';
import { WeatherAlert as WeatherAlertType } from '@/lib/weather-service';

interface WeatherAlertProps {
  alert: WeatherAlertType;
  onDismiss?: () => void;
}

export default function WeatherAlert({ alert, onDismiss }: WeatherAlertProps) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'extreme':
        return 'bg-red-900/50 border-red-500 text-red-100';
      case 'severe':
        return 'bg-orange-900/50 border-orange-500 text-orange-100';
      case 'moderate':
        return 'bg-yellow-900/50 border-yellow-500 text-yellow-100';
      default:
        return 'bg-blue-900/50 border-blue-500 text-blue-100';
    }
  };

  const getSeverityIcon = (event: string) => {
    if (event.toLowerCase().includes('wind')) return Wind;
    if (event.toLowerCase().includes('rain')) return Droplets;
    if (event.toLowerCase().includes('temperature')) return Thermometer;
    if (event.toLowerCase().includes('visibility')) return Eye;
    return AlertTriangle;
  };

  const Icon = getSeverityIcon(alert.event);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`relative p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)} backdrop-blur-sm`}
    >
      <div className="flex items-start space-x-3">
        <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold mb-1">
            {alert.event}
          </h3>
          <p className="text-sm opacity-90 leading-relaxed">
            {alert.description}
          </p>
          <div className="mt-2 text-xs opacity-75">
            <span className="capitalize">{alert.severity}</span> • 
            Until {new Date(alert.end).toLocaleTimeString()}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
