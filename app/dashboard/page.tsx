'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import InteractiveMap from '@/components/dashboard/InteractiveMap';
import DatePicker from '@/components/dashboard/DatePicker';
import ActivityFilter from '@/components/dashboard/ActivityFilter';
import LocationSearch from '@/components/dashboard/LocationSearch';
import WeatherResults from '@/components/results/WeatherResults';
import { toast } from 'sonner';

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface WeatherData {
  hot: number;
  cold: number;
  windy: number;
  wet: number;
  uncomfortable: number;
  location: Location;
  date: Date;
  activity: string;
}

export default function Dashboard() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedActivity, setSelectedActivity] = useState<string>('hiking');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    if (!selectedLocation) {
      toast.error('Please select a location on the map');
      return;
    }

    setLoading(true);
    
    try {
      console.log('Generating weather report with data:', {
        location: selectedLocation,
        date: selectedDate,
        activity: selectedActivity,
      });

      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          location: selectedLocation,
          date: selectedDate,
          activity: selectedActivity,
        }),
      });

      console.log('Weather API response status:', response.status);
      console.log('Weather API response headers:', Object.fromEntries(response.headers.entries()));

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const textResponse = await response.text();
        console.error('Non-JSON response received:', textResponse);
        throw new Error(`Expected JSON response but got: ${contentType}`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Weather API error response:', errorData);
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Weather API response data:', data);
      
      // Validate the response data
      if (!data || typeof data.hot !== 'number') {
        throw new Error('Invalid weather data received');
      }
      
      setWeatherData(data);
      toast.success('Weather report generated successfully!');
    } catch (error) {
      console.error('Weather report generation failed:', error);
      toast.error(`Failed to generate weather report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    if (!weatherData) {
      toast.error('Generate a report first');
      return;
    }

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weatherData),
      });

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weather-report-${weatherData.date.toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const shareReport = () => {
    if (!weatherData) {
      toast.error('Generate a report first');
      return;
    }

    const shareData = {
      title: 'My Weather Report - NASA Space Apps',
      text: `Check out this weather forecast for ${selectedActivity} on ${selectedDate.toDateString()}!`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
      toast.success('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="container mx-auto max-w-7xl">
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
                Back
              </Button>
            </Link>
            <h1 className="text-3xl font-bold glow-text">Weather Dashboard</h1>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportData}
              disabled={!weatherData}
              className="border-white/20 hover:bg-white/10"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={shareReport}
              disabled={!weatherData}
              className="border-white/20 hover:bg-white/10"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-1 space-y-6"
          >
            {/* Location Selection */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Select Location</h2>
              <LocationSearch onLocationSelect={setSelectedLocation} />
              {selectedLocation && (
                <div className="mt-4 p-3 bg-white/5 rounded-lg">
                  <p className="text-sm text-slate-300">
                    📍 {selectedLocation.address || `${selectedLocation.lat.toFixed(4)}, ${selectedLocation.lng.toFixed(4)}`}
                  </p>
                </div>
              )}
            </Card>

            {/* Date Selection */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Select Date</h2>
              <DatePicker date={selectedDate} onDateChange={setSelectedDate} />
            </Card>

            {/* Activity Filter */}
            <Card className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-4 text-white">Activity Type</h2>
              <ActivityFilter activity={selectedActivity} onActivityChange={setSelectedActivity} />
            </Card>

            {/* Generate Button */}
            <Button
              onClick={generateReport}
              disabled={loading || !selectedLocation}
              className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-lg py-6"
            >
              {loading ? 'Generating...' : 'Generate Weather Report'}
            </Button>
          </motion.div>

          {/* Map and Results */}
          <div className="xl:col-span-2 space-y-8">
            {/* Interactive Map */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="glass-card p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Interactive Map</h2>
                <div className="h-96">
                  <InteractiveMap
                    selectedLocation={selectedLocation}
                    onLocationSelect={setSelectedLocation}
                  />
                </div>
              </Card>
            </motion.div>

            {/* Weather Results */}
            {weatherData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <WeatherResults data={weatherData} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}