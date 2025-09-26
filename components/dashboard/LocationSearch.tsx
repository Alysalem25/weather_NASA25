'use client';

import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Location } from '@/app/dashboard/page';

interface LocationSearchProps {
  onLocationSelect: (location: Location) => void;
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const searchLocation = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5`
      );
      const results = await response.json();
      setSuggestions(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectLocation = (result: any) => {
    const location: Location = {
      lat: parseFloat(result.lat),
      lng: parseFloat(result.lon),
      address: result.display_name,
    };
    onLocationSelect(location);
    setSuggestions([]);
    setQuery(result.display_name);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search for a city or location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
          className="bg-white/5 border-white/20 text-white placeholder-slate-400"
        />
        <Button
          onClick={searchLocation}
          disabled={loading}
          size="sm"
          className="bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400"
        >
          <Search className="w-4 h-4" />
        </Button>
      </div>

      {suggestions.length > 0 && (
        <div className="bg-white/5 border border-white/20 rounded-lg p-2 space-y-1">
          {suggestions.map((result, index) => (
            <button
              key={index}
              onClick={() => selectLocation(result)}
              className="w-full text-left p-3 hover:bg-white/10 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span className="text-sm text-white truncate">
                  {result.display_name}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}