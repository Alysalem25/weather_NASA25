'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Share2 } from 'lucide-react';
import { WeatherData } from '@/app/dashboard/page';
import { toast } from 'sonner';

interface ShareableCardProps {
  data: WeatherData;
}

export default function ShareableCard({ data }: ShareableCardProps) {
  // Normalize and guard against missing fields
  const normalizedDate = data?.date ? new Date(data.date as unknown as string) : null;
  const hasCoords = typeof data?.location?.lat === 'number' && typeof data?.location?.lng === 'number';
  const locationLabel = data?.location?.address ?? (hasCoords ? `${data.location.lat.toFixed(2)}, ${data.location.lng.toFixed(2)}` : 'Selected Location');
  const activityLabel = data?.activity ? (data.activity.charAt(0).toUpperCase() + data.activity.slice(1)) : 'your activity';

  const generateSocialCard = () => {
    // Create a canvas element to generate the shareable image
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, 800, 600);
    gradient.addColorStop(0, '#1e1b4b');
    gradient.addColorStop(1, '#312e81');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 600);

    // Add title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('NASA Weather Report', 400, 80);

    // Add location and date
    ctx.font = '24px Arial';
    ctx.fillText(locationLabel, 400, 120);
    ctx.fillText(normalizedDate ? normalizedDate.toDateString() : 'Unknown date', 400, 150);

    // Add weather data
    const conditions = [
      { name: 'Hot', value: data.hot, y: 220 },
      { name: 'Cold', value: data.cold, y: 270 },
      { name: 'Windy', value: data.windy, y: 320 },
      { name: 'Wet', value: data.wet, y: 370 },
      { name: 'Uncomfortable', value: data.uncomfortable, y: 420 },
    ];

    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    
    conditions.forEach(condition => {
      ctx.fillStyle = '#e2e8f0';
      ctx.fillText(`${condition.name}:`, 200, condition.y);
      ctx.fillStyle = '#00d9ff';
      ctx.fillText(`${condition.value}%`, 350, condition.y);
    });

    // Convert to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `nasa-weather-report-${normalizedDate ? normalizedDate.toISOString().split('T')[0] : 'unknown-date'}.png`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success('Social card downloaded!');
      }
    });
  };

  const shareText = () => {
    const text = `Check out my NASA weather forecast! 🌟\n📍 ${locationLabel}\n📅 ${normalizedDate ? normalizedDate.toDateString() : 'Unknown date'}\n🎯 Perfect for ${activityLabel}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'NASA Weather Report',
        text,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Text copied to clipboard!');
    }
  };

  return (
    <Card className="glass-card p-6">
      <h3 className="text-xl font-semibold mb-4 text-white">Share Your Report</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={generateSocialCard}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Social Card
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={shareText}
            variant="outline"
            className="w-full border-white/20 hover:bg-white/10"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Text
          </Button>
        </motion.div>
      </div>
      
      <div className="mt-6 p-4 bg-white/5 rounded-lg">
        <h4 className="font-semibold text-white mb-2">Preview:</h4>
        <p className="text-sm text-slate-300">
          Check out my NASA weather forecast! 🌟<br />
          📍 {locationLabel}<br />
          📅 {normalizedDate ? normalizedDate.toDateString() : 'Unknown date'}<br />
          🎯 Perfect for {activityLabel}
        </p>
      </div>
    </Card>
  );
}