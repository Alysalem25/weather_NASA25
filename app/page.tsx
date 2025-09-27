'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Satellite, MapPin, Calendar, Activity, Navigation, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import CurrentWeatherCard from '@/components/weather/CurrentWeatherCard';
import WeatherAlert from '@/components/weather/WeatherAlert';
import AnimatedBackground from '@/components/ui/AnimatedBackground';
import { CurrentWeather, LocationData, WeatherAlert as WeatherAlertType } from '@/lib/weather-service';
import { RealWeatherData } from '@/lib/real-weather-service';
import { toast } from 'sonner';
import { format } from 'node:path';

export default function Home() {
  const [currentWeather, setCurrentWeather] = useState<RealWeatherData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [alerts, setAlerts] = useState<WeatherAlertType[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [useRealData, setUseRealData] = useState(true);

  const [datam, setDatam] = useState(null); // store API response here
  const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
    fetch(
      "https://api.openweathermap.org/data/2.5/forecast?q=Cairo&appid=691ff23b4f028e2cb9de59020dcd0520&units=metric"
    )
      .then((response) => response.json())
      .then((json) => {
        setDatam(json); // save JSON into state
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);
  const features = [
    {
      icon: <Satellite className="w-8 h-8" />,
      title: "NASA Data Integration",
      description: "Real-time weather data from NASA's Earth observation satellites"
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      title: "Interactive Mapping",
      description: "Drop pins anywhere on Earth and get localized weather insights"
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Historical Analysis",
      description: "20+ years of weather patterns to predict future conditions"
    },
    {
      icon: <Activity className="w-8 h-8" />,
      title: "Activity Planning",
      description: "Tailored recommendations for hiking, fishing, sports, and more"
    }
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
          await fetchCurrentWeather(latitude, longitude);
          setLocationPermission('granted');
        } catch (error) {
          console.error('Error getting location:', error);
          toast.error('Failed to get your location');
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationPermission('denied');
        toast.error('Location access denied. Please enable location services.');
        setLoading(false);
      }
    );
  };

  const fetchCurrentWeather = async (lat: number, lng: number) => {
    try {
      const apiEndpoint = useRealData ? '/api/real-weather' : '/api/current-weather';
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat, lng }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (useRealData) {
        // Real weather data structure
        setCurrentWeather(data.weather);
        setLocation({
          lat,
          lng,
          city: data.weather.city,
          country: data.weather.country,
        });
        setAlerts(data.weather.alerts);
      } else {
        // Mock weather data structure
        setCurrentWeather(data.weather);
        setLocation(data.location);
        setAlerts(data.alerts);
      }

      // Show alerts as toasts
      const alertsToShow = useRealData ? data.weather.alerts : data.alerts;
      alertsToShow.forEach((alert: WeatherAlertType) => {
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

      toast.success(`${useRealData ? 'Real' : 'Mock'} weather data updated successfully!`);
    } catch (error) {
      console.error('Error fetching weather:', error);
      toast.error('Failed to fetch weather data');
    }
  };

  const dismissAlert = (index: number) => {
    setAlerts(prev => prev.filter((_, i) => i !== index));
  };

 useEffect(() => {
    fetch(
      "https://api.openweathermap.org/data/2.5/forecast?q=Cairo&appid=691ff23b4f028e2cb9de59020dcd0520&units=metric"
    )
      .then((response) => response.json())
      .then((json) => {
        setDatam(json); // save JSON into state
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      });
  }, []);
  useEffect(() => {
    // Try to get location on component mount
    getCurrentLocation();
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated weather background */}
      <AnimatedBackground
        weatherCondition={currentWeather?.main}
        temperature={currentWeather?.temperature}
      />

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Weather Alerts */}
        <AnimatePresence>
          {alerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-8 space-y-4"
            >
              {alerts.map((alert, index) => (
                <WeatherAlert
                  key={index}
                  alert={alert}
                  onDismiss={() => dismissAlert(index)}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Data Source Toggle */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="glass-card p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Weather Data Source</h3>
                <p className="text-sm text-slate-300">
                  {useRealData ? 'Using real weather data from OpenWeatherMap' : 'Using simulated weather data'}
                </p>
              </div>
              <Button
                onClick={() => setUseRealData(!useRealData)}
                variant="outline"
                className="bg-white/10 hover:bg-white/20 border-white/20"
              >
                {useRealData ? 'Switch to Mock Data' : 'Switch to Real Data'}
              </Button>
            </div>
          </Card>
        </motion.div> */}

        {/* Current Weather Section */}
        {/* {currentWeather && location && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <CurrentWeatherCard
              weather={currentWeather}
              location={location}
              loading={loading}
              onRefresh={getCurrentLocation}
            />
          </motion.div>
        )} */}

        {/* Location Permission Prompt */}
        {locationPermission === 'denied' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="glass-card p-6 border-yellow-500/30 bg-yellow-900/20">
              <div className="flex items-center space-x-4">
                <AlertTriangle className="w-8 h-8 text-yellow-400" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-yellow-100 mb-2">
                    Location Access Required
                  </h3>
                  <p className="text-yellow-200 mb-4">
                    To get your current weather and alerts, please enable location access in your browser.
                  </p>
                  <Button
                    onClick={getCurrentLocation}
                    disabled={loading}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {loading ? 'Getting Location...' : 'Enable Location'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
        {/* Hero Section */}
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-8 leading-tight">
              Plan Your
              <br />
              <span className="glow-text">Perfect Day</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Harness the power of NASA Earth observation data to make informed decisions 
              about your outdoor adventures. Know before you go.
            </p>
          </motion.div>
{/* 
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-2xl shadow-purple-500/25"
              >
                Start Planning
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div> */}
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
            >
              <Card className="glass-card p-8 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 group">
                <div className="text-cyan-400 mb-6 group-hover:text-purple-400 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center"
        >
          <div className="glass-card p-12 max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-6 glow-text">
              Ready to Explore?
            </h2>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Join thousands of adventurers who trust NASA data to plan their perfect outdoor experiences. 
              From hiking trails to beach days, we've got you covered.
            </p>
            {/* <a href="/dashboard">
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:border-cyan-400/50 transition-all duration-300"
              >
                Get Started Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </a> */}
          </div>
        </motion.div>
      </div>



    </div>
  );
}