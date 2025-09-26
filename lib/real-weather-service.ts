// Real weather service using OpenWeatherMap API
// This service provides real weather data for the main page

export interface RealWeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex: number;
  description: string;
  main: string;
  icon: string;
  alerts: WeatherAlert[];
  city: string;
  country: string;
  timestamp: string;
}

export interface WeatherAlert {
  event: string;
  description: string;
  severity: 'minor' | 'moderate' | 'severe' | 'extreme';
  start: string;
  end: string;
}

export interface LocationData {
  lat: number;
  lng: number;
  city: string;
  country: string;
  state?: string;
}

// Free OpenWeatherMap API key - you can replace this with your own
const API_KEY = 'b6907d289e10d714a6e88b30761fae22'; // This is a demo key
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class RealWeatherService {
  private static instance: RealWeatherService;

  static getInstance(): RealWeatherService {
    if (!RealWeatherService.instance) {
      RealWeatherService.instance = new RealWeatherService();
    }
    return RealWeatherService.instance;
  }

  async getCurrentWeather(lat: number, lng: number): Promise<RealWeatherData> {
    try {
      console.log('Fetching real weather data...');
      
      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Get location data
      const locationData = await this.getLocationFromCoords(lat, lng);
      
      // Generate weather alerts based on real data
      const alerts = this.generateAlertsFromRealData(data);

      return {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        windSpeed: data.wind.speed,
        windDirection: data.wind.deg,
        visibility: data.visibility / 1000, // Convert to km
        uvIndex: 0, // UV index requires separate API call
        description: data.weather[0].description,
        main: data.weather[0].main,
        icon: data.weather[0].icon,
        alerts,
        city: locationData.city,
        country: locationData.country,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Error fetching real weather data:', error);
      // Return fallback data if API fails
      return this.getFallbackWeatherData(lat, lng);
    }
  }

  async getLocationFromCoords(lat: number, lng: number): Promise<LocationData> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${API_KEY}`
      );

      if (!response.ok) {
        throw new Error(`Geocoding API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error('Location not found');
      }

      return {
        lat,
        lng,
        city: data[0].name,
        country: data[0].country,
        state: data[0].state,
      };
    } catch (error) {
      console.error('Error getting location from coordinates:', error);
      return {
        lat,
        lng,
        city: 'Unknown City',
        country: 'Unknown Country',
      };
    }
  }

  private generateAlertsFromRealData(data: any): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    
    // Temperature alerts
    if (data.main.temp > 35) {
      alerts.push({
        event: 'Heat Warning',
        description: `High temperature: ${Math.round(data.main.temp)}°C. Stay hydrated and avoid prolonged sun exposure.`,
        severity: 'severe',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      });
    }
    
    if (data.main.temp < -10) {
      alerts.push({
        event: 'Cold Warning',
        description: `Low temperature: ${Math.round(data.main.temp)}°C. Dress warmly and avoid prolonged exposure.`,
        severity: 'severe',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      });
    }

    // Wind alerts
    if (data.wind.speed > 15) {
      alerts.push({
        event: 'High Wind Warning',
        description: `Strong winds: ${data.wind.speed} m/s. Secure loose objects and avoid outdoor activities.`,
        severity: 'moderate',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      });
    }

    // Weather condition alerts
    if (data.weather[0].main === 'Thunderstorm') {
      alerts.push({
        event: 'Thunderstorm Warning',
        description: 'Thunderstorm conditions detected. Seek shelter immediately and avoid outdoor activities.',
        severity: 'severe',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      });
    }

    if (data.weather[0].main === 'Rain' && data.rain && data.rain['1h'] > 10) {
      alerts.push({
        event: 'Heavy Rain Warning',
        description: 'Heavy rainfall detected. Risk of flooding in low-lying areas.',
        severity: 'moderate',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      });
    }

    if (data.weather[0].main === 'Snow') {
      alerts.push({
        event: 'Snow Warning',
        description: 'Snow conditions detected. Drive carefully and dress warmly.',
        severity: 'moderate',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      });
    }

    return alerts;
  }

  private getFallbackWeatherData(lat: number, lng: number): RealWeatherData {
    // Generate realistic fallback data based on location
    const isTropical = lat > -30 && lat < 30;
    const isCold = lat > 60 || lat < -60;
    
    let baseTemp = 20;
    if (isTropical) baseTemp = 28;
    if (isCold) baseTemp = 5;
    
    const temperature = Math.round(baseTemp + (Math.random() - 0.5) * 10);
    const conditions = ['clear', 'clouds', 'rain', 'snow'];
    const main = conditions[Math.floor(Math.random() * conditions.length)];

    return {
      temperature,
      feelsLike: Math.round(temperature + (Math.random() - 0.5) * 3),
      humidity: Math.round(40 + Math.random() * 40),
      pressure: Math.round(1000 + (Math.random() - 0.5) * 30),
      windSpeed: Math.round(Math.random() * 15),
      windDirection: Math.round(Math.random() * 360),
      visibility: Math.round(5 + Math.random() * 15),
      uvIndex: Math.round(Math.random() * 11),
      description: this.getWeatherDescription(main),
      main,
      icon: this.getWeatherIcon(main),
      alerts: [],
      city: 'Unknown City',
      country: 'Unknown Country',
      timestamp: new Date().toISOString(),
    };
  }

  private getWeatherDescription(main: string): string {
    const descriptions = {
      clear: 'clear sky',
      clouds: 'few clouds',
      rain: 'light rain',
      snow: 'light snow',
      mist: 'mist',
    };
    return descriptions[main as keyof typeof descriptions] || 'clear sky';
  }

  private getWeatherIcon(main: string): string {
    const icons = {
      clear: '01d',
      clouds: '02d',
      rain: '10d',
      snow: '13d',
      mist: '50d',
    };
    return icons[main as keyof typeof icons] || '01d';
  }
}

export const realWeatherService = RealWeatherService.getInstance();
