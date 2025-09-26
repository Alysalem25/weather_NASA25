'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CurrentWeatherCard from '@/components/weather/CurrentWeatherCard';
import WeatherAlert from '@/components/weather/WeatherAlert';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { RealWeatherData } from '@/lib/real-weather-service';
import { WeatherAlert as WeatherAlertType } from '@/lib/weather-service';
import { toast } from 'sonner';
import { ArrowLeft, RefreshCw, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function WeatherDemo() {
  const [currentWeather, setCurrentWeather] = useState<RealWeatherData | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number; city: string; country: string } | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlertType[]>([]);
  const [loading, setLoading] = useState(false);

  const demoLocations = [
    { name: 'New York', lat: 40.7128, lng: -74.0060 },
    { name: 'London', lat: 51.5074, lng: -0.1278 },
    { name: 'Tokyo', lat: 35.6762, lng: 139.6503 },
    { name: 'Sydney', lat: -33.8688, lng: 151.2093 },
    { name: 'Dubai', lat: 25.2048, lng: 55.2708 },
    { name: 'Moscow', lat: 55.7558, lng: 37.6176 },
  ];

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          await fetchRealWeather(latitude, longitude);
        } catch (error) {
          console.error('Error getting location:', error);
          toast.error('Failed to get your location');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        toast.error('Location access denied. Please enable location services.');
        setLoading(false);
      }
    );
  };

  const fetchRealWeather = async (lat: number, lng: number) => {
    try {
      const response = await fetch('/api/real-weather', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      setCurrentWeather(data.weather);
      setLocation({
        lat,
        lng,
        city: data.weather.city,
        country: data.weather.country,
      });
      setAlerts(data.weather.alerts);

      // Show alerts as toasts
      data.weather.alerts.forEach((alert: WeatherAlertType) => {
        if (alert.severity === 'extreme' || alert.severity === 'severe') {
          toast.error(`${alert.event}: ${alert.description}`, {
            duration: 10000,
          });
        } else if (alert.severity === 'moderate') {
          toast.warning(`${alert.event}: ${alert.description}`, {
            duration: 8000,
          });
        }
      });

      toast.success('Real weather data loaded successfully!');
    } catch (error) {
      console.error('Error fetching real weather:', error);
      toast.error('Failed to fetch real weather data');
    }
  };

  const selectDemoLocation = (location: typeof demoLocations[0]) => {
    setLoading(true);
    fetchRealWeather(location.lat, location.lng);
    setLoading(false);
  };

  useEffect(() => {
    // Auto-load New York weather on component mount
    selectDemoLocation(demoLocations[0]);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated weather background */}
      <AnimatedBackground 
        weatherCondition={currentWeather?.main}
        temperature={currentWeather?.temperature}
      />

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="border-white/20 hover:bg-white/10">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-3xl font-bold glow-text">Real Weather Demo</h1>
          </div>
          
          <Button
            onClick={getCurrentLocation}
            disabled={loading}
            className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
          >
            <MapPin className="w-4 h-4 mr-2" />
            {loading ? 'Getting Location...' : 'My Location'}
          </Button>
        </motion.div>

        {/* Weather Alerts */}
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 space-y-4"
          >
            {alerts.map((alert, index) => (
              <WeatherAlert
                key={index}
                alert={alert}
                onDismiss={() => setAlerts(prev => prev.filter((_, i) => i !== index))}
              />
            ))}
          </motion.div>
        )}

        {/* Demo Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="glass-card p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Demo Locations</h2>
            <p className="text-slate-300 mb-6">
              Click on any city below to see real weather data from around the world:
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {demoLocations.map((location) => (
                <Button
                  key={location.name}
                  onClick={() => selectDemoLocation(location)}
                  disabled={loading}
                  variant="outline"
                  className="bg-white/5 hover:bg-white/10 border-white/20 text-white h-auto p-4 flex flex-col items-center gap-2"
                >
                  <MapPin className="w-5 h-5" />
                  <span className="text-sm font-medium">{location.name}</span>
                </Button>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Current Weather Section */}
        {currentWeather && location && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <CurrentWeatherCard
              weather={currentWeather}
              location={location}
              loading={loading}
              onRefresh={() => fetchRealWeather(location.lat, location.lng)}
            />
          </motion.div>
        )}

        {/* Real Data Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <Card className="glass-card p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">Real Weather Data</h2>
            <p className="text-slate-300 mb-6 leading-relaxed">
              This demo uses real weather data from OpenWeatherMap API. The data includes:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Current Conditions</h3>
                <ul className="text-slate-300 space-y-1">
                  <li>• Real-time temperature</li>
                  <li>• Actual humidity levels</li>
                  <li>• Live wind data</li>
                  <li>• Current visibility</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Weather Alerts</h3>
                <ul className="text-slate-300 space-y-1">
                  <li>• Heat warnings</li>
                  <li>• Cold alerts</li>
                  <li>• Wind advisories</li>
                  <li>• Storm warnings</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-2">Location Data</h3>
                <ul className="text-slate-300 space-y-1">
                  <li>• Accurate city names</li>
                  <li>• Country information</li>
                  <li>• GPS coordinates</li>
                  <li>• Time zone data</li>
                </ul>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
