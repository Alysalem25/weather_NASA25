// Weather service using OpenWeatherMap API
// You'll need to get a free API key from https://openweathermap.org/api

export interface CurrentWeather {
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

// OpenWeatherMap API configuration
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || 'your-api-key-here';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
  private static instance: WeatherService;
  private apiKey: string;

  constructor() {
    this.apiKey = API_KEY;
  }

  static getInstance(): WeatherService {
    if (!WeatherService.instance) {
      WeatherService.instance = new WeatherService();
    }
    return WeatherService.instance;
  }

  async getCurrentWeather(lat: number, lng: number): Promise<CurrentWeather> {
    // Always use mock data for now to ensure the app works
    // This can be changed to use real API when proper key is configured
    console.log('Using mock weather data for demonstration');
    return this.getMockWeatherData(lat, lng);
    
    // Uncomment below to use real API when key is available
    /*
    try {
      // Check if API key is available
      if (!this.apiKey || this.apiKey === 'your-api-key-here') {
        console.warn('OpenWeatherMap API key not configured, using mock data');
        return this.getMockWeatherData(lat, lng);
      }

      const response = await fetch(
        `${BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.warn('Invalid API key, using mock data');
          return this.getMockWeatherData(lat, lng);
        }
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Get weather alerts (if available)
      const alerts = await this.getWeatherAlerts(lat, lng);

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
        alerts: alerts,
      };
    } catch (error) {
      console.error('Error fetching current weather:', error);
      // Return mock data as fallback
      return this.getMockWeatherData(lat, lng);
    }
    */
  }

  private getMockWeatherData(lat: number, lng: number): CurrentWeather {
    // Generate mock weather data based on location and time
    const now = new Date();
    const hour = now.getHours();
    const isDay = hour >= 6 && hour < 18;
    
    // Simulate different weather based on location
    const isTropical = lat > -30 && lat < 30;
    const isCold = lat > 60 || lat < -60;
    const isDesert = (lat > 20 && lat < 30) || (lat > -30 && lat < -20);
    
    let baseTemp = 20;
    if (isTropical) baseTemp = 28;
    if (isCold) baseTemp = 5;
    if (isDesert) baseTemp = 32;
    
    // Add some randomness but keep it realistic
    const tempVariation = (Math.random() - 0.5) * 8;
    const temperature = Math.round(baseTemp + tempVariation);
    
    // Generate weather conditions with realistic probabilities
    const conditions = this.getWeatherConditionsForLocation(lat, lng, isDay);
    const main = conditions[Math.floor(Math.random() * conditions.length)];
    
    // Generate alerts based on conditions
    const alerts: WeatherAlert[] = this.generateWeatherAlerts(main, temperature, lat, lng);

    return {
      temperature,
      feelsLike: Math.round(temperature + (Math.random() - 0.5) * 3),
      humidity: this.getHumidityForCondition(main, isTropical),
      pressure: Math.round(1000 + (Math.random() - 0.5) * 30),
      windSpeed: this.getWindSpeedForCondition(main),
      windDirection: Math.round(Math.random() * 360),
      visibility: this.getVisibilityForCondition(main),
      uvIndex: isDay ? Math.round(Math.random() * 11) : 0,
      description: this.getWeatherDescription(main),
      main,
      icon: this.getWeatherIcon(main, isDay),
      alerts,
    };
  }

  private getWeatherConditionsForLocation(lat: number, lng: number, isDay: boolean): string[] {
    // More realistic weather conditions based on location and time
    const conditions = [];
    
    // Always include clear weather
    conditions.push('clear');
    
    // Add clouds (common)
    if (Math.random() > 0.3) {
      conditions.push('clouds');
    }
    
    // Add rain based on location (more likely in certain regions)
    if (lat > 40 && lat < 60) { // Temperate regions
      conditions.push('rain');
    }
    
    // Add snow in cold regions
    if (lat > 50 || lat < -50) {
      conditions.push('snow');
    }
    
    // Add mist in certain conditions
    if (Math.random() > 0.7) {
      conditions.push('mist');
    }
    
    return conditions;
  }

  private getHumidityForCondition(main: string, isTropical: boolean): number {
    const baseHumidity = isTropical ? 70 : 50;
    
    switch (main) {
      case 'rain':
        return Math.round(baseHumidity + Math.random() * 25);
      case 'mist':
        return Math.round(baseHumidity + Math.random() * 30);
      case 'clear':
        return Math.round(baseHumidity - Math.random() * 20);
      default:
        return Math.round(baseHumidity + (Math.random() - 0.5) * 20);
    }
  }

  private getWindSpeedForCondition(main: string): number {
    switch (main) {
      case 'rain':
        return Math.round(5 + Math.random() * 10);
      case 'clear':
        return Math.round(2 + Math.random() * 8);
      case 'clouds':
        return Math.round(3 + Math.random() * 12);
      default:
        return Math.round(1 + Math.random() * 15);
    }
  }

  private getVisibilityForCondition(main: string): number {
    switch (main) {
      case 'mist':
        return Math.round(1 + Math.random() * 5);
      case 'rain':
        return Math.round(5 + Math.random() * 10);
      case 'snow':
        return Math.round(3 + Math.random() * 8);
      default:
        return Math.round(8 + Math.random() * 12);
    }
  }

  private generateWeatherAlerts(main: string, temperature: number, lat: number, lng: number): WeatherAlert[] {
    const alerts: WeatherAlert[] = [];
    
    // Heat warning
    if (temperature > 35) {
      alerts.push({
        event: 'Heat Warning',
        description: 'Extreme heat conditions. Stay hydrated and avoid prolonged sun exposure.',
        severity: 'severe',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      });
    }
    
    // Cold warning
    if (temperature < -10) {
      alerts.push({
        event: 'Cold Warning',
        description: 'Extreme cold conditions. Dress warmly and avoid prolonged exposure.',
        severity: 'severe',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      });
    }
    
    // Rain warning
    if (main === 'rain' && Math.random() > 0.6) {
      alerts.push({
        event: 'Heavy Rain Warning',
        description: 'Heavy rainfall detected. Risk of flooding in low-lying areas.',
        severity: 'moderate',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      });
    }
    
    // Wind warning
    if (Math.random() > 0.8) {
      alerts.push({
        event: 'High Wind Warning',
        description: 'Strong winds detected. Secure loose objects and avoid outdoor activities.',
        severity: 'moderate',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      });
    }

    return alerts;
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

  private getWeatherIcon(main: string, isDay: boolean): string {
    const icons = {
      clear: isDay ? '01d' : '01n',
      clouds: isDay ? '02d' : '02n',
      rain: '10d',
      snow: '13d',
      mist: '50d',
    };
    return icons[main as keyof typeof icons] || '01d';
  }

  async getWeatherAlerts(lat: number, lng: number): Promise<WeatherAlert[]> {
    try {
      // Using OpenWeatherMap One Call API for alerts
      const response = await fetch(
        `${BASE_URL}/onecall?lat=${lat}&lon=${lng}&appid=${this.apiKey}&exclude=minutely,hourly,daily`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();
      
      if (!data.alerts) {
        return [];
      }

      return data.alerts.map((alert: any) => ({
        event: alert.event,
        description: alert.description,
        severity: this.mapSeverity(alert.tags?.[0] || 'minor'),
        start: new Date(alert.start * 1000).toISOString(),
        end: new Date(alert.end * 1000).toISOString(),
      }));
    } catch (error) {
      console.error('Error fetching weather alerts:', error);
      return [];
    }
  }

  async getLocationFromCoords(lat: number, lng: number): Promise<LocationData> {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lng}&limit=1&appid=${this.apiKey}`
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
      throw error;
    }
  }

  private mapSeverity(tag: string): 'minor' | 'moderate' | 'severe' | 'extreme' {
    const severityMap: { [key: string]: 'minor' | 'moderate' | 'severe' | 'extreme' } = {
      'Minor': 'minor',
      'Moderate': 'moderate',
      'Severe': 'severe',
      'Extreme': 'extreme',
    };
    
    return severityMap[tag] || 'minor';
  }

  // Check for dangerous weather conditions
  checkDangerousConditions(weather: CurrentWeather): WeatherAlert[] {
    const dangerousAlerts: WeatherAlert[] = [];

    // Check for tornado conditions
    if (weather.main.toLowerCase().includes('tornado') || 
        weather.description.toLowerCase().includes('tornado')) {
      dangerousAlerts.push({
        event: 'Tornado Warning',
        description: 'Tornado conditions detected. Seek immediate shelter.',
        severity: 'extreme',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
      });
    }

    // Check for severe storms
    if (weather.windSpeed > 25) { // > 25 m/s is severe
      dangerousAlerts.push({
        event: 'High Wind Warning',
        description: `Dangerous wind speeds detected: ${weather.windSpeed} m/s`,
        severity: 'severe',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      });
    }

    // Check for heavy rain
    if (weather.main.toLowerCase().includes('rain') && weather.humidity > 90) {
      dangerousAlerts.push({
        event: 'Heavy Rain Warning',
        description: 'Heavy rainfall with high humidity detected. Risk of flooding.',
        severity: 'moderate',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      });
    }

    // Check for extreme temperatures
    if (weather.temperature > 40 || weather.temperature < -20) {
      dangerousAlerts.push({
        event: 'Extreme Temperature Warning',
        description: `Extreme temperature: ${weather.temperature}°C`,
        severity: 'severe',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 3600000).toISOString(),
      });
    }

    return dangerousAlerts;
  }
}

export const weatherService = WeatherService.getInstance();
