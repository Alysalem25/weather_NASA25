# NASA Weather App - Setup Instructions

## 🚀 Quick Start

### 1. Get OpenWeatherMap API Key
1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Copy the API key

### 2. Set Up Environment Variables
1. Create a `.env.local` file in the project root
2. Add your API key:
```bash
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_actual_api_key_here
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Development Server
```bash
npm run dev
```

### 5. Open Your Browser
Go to `http://localhost:3000`

## ✨ Features Added

### 🧭 Navigation Bar
- Responsive navbar with mobile menu
- Links to Home and Weather Dashboard
- Beautiful glass-morphism design

### 🌤️ Real Weather Data
- **Current Location Detection**: Automatically gets your location
- **Real Weather API**: Uses OpenWeatherMap for accurate data
- **Weather Alerts**: Automatic detection of dangerous conditions:
  - Tornado warnings
  - High wind alerts
  - Heavy rain warnings
  - Extreme temperature alerts

### 🚨 Weather Alerts System
- **Severity Levels**: Minor, Moderate, Severe, Extreme
- **Visual Alerts**: Color-coded alert cards
- **Toast Notifications**: Pop-up alerts for dangerous conditions
- **Dismissible Alerts**: Users can dismiss alerts

### 📱 Home Page Features
- **Auto Location**: Automatically detects your location on page load
- **Current Weather Card**: Shows temperature, humidity, wind, pressure, visibility
- **Weather Icons**: Real weather icons from OpenWeatherMap
- **Refresh Button**: Manual refresh of weather data
- **Permission Handling**: Graceful handling of location permission denial

## 🔧 Technical Implementation

### Weather Service (`lib/weather-service.ts`)
- Singleton pattern for API management
- Real-time weather data fetching
- Dangerous condition detection
- Location reverse geocoding

### API Routes
- `/api/current-weather`: Fetches current weather and alerts
- `/api/weather`: Original weather planning API
- `/api/export`: Data export functionality

### Components
- `WeatherAlert`: Alert display component
- `CurrentWeatherCard`: Weather information display
- `Navbar`: Navigation component

## 🌍 Supported Weather Alerts

### Automatic Detection
- **Tornado Conditions**: Detects tornado-related weather
- **High Winds**: Winds > 25 m/s trigger severe alerts
- **Heavy Rain**: High humidity + rain conditions
- **Extreme Temperatures**: > 40°C or < -20°C

### OpenWeatherMap Alerts
- Official weather alerts from meteorological services
- Real-time severe weather warnings
- Storm alerts and advisories

## 🎨 UI/UX Features

### Responsive Design
- Mobile-first approach
- Collapsible mobile menu
- Touch-friendly interface

### Animations
- Smooth page transitions
- Alert animations
- Loading states
- Hover effects

### Accessibility
- Keyboard navigation
- Screen reader support
- High contrast alerts
- Clear visual hierarchy

## 🔒 Security & Privacy

### Location Privacy
- Location data is not stored
- Only used for weather requests
- User can deny location access

### API Security
- API keys are environment variables
- No sensitive data in client code
- Rate limiting handled by OpenWeatherMap

## 🚀 Deployment

### Environment Variables
Make sure to set your OpenWeatherMap API key in production:
```bash
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_production_api_key
```

### Build Commands
```bash
npm run build
npm start
```

## 📊 API Limits

### OpenWeatherMap Free Tier
- 1,000 calls per day
- 60 calls per minute
- Current weather data
- 5-day forecast
- Weather alerts

### Recommended Usage
- Cache weather data for 10-15 minutes
- Implement error handling for rate limits
- Consider upgrading for higher limits

## 🐛 Troubleshooting

### Common Issues

1. **Location not working**
   - Check browser location permissions
   - Ensure HTTPS in production
   - Test in different browsers

2. **Weather data not loading**
   - Verify API key is correct
   - Check network connection
   - Look at browser console for errors

3. **Alerts not showing**
   - Check if location has active weather alerts
   - Verify API key has alerts access
   - Test with known severe weather locations

### Debug Mode
Enable debug logging by opening browser console to see detailed error messages.

## 📈 Future Enhancements

### Planned Features
- Push notifications for severe weather
- Weather history and trends
- Multiple location support
- Offline weather data
- Weather radar integration
- Custom alert preferences

### API Upgrades
- Weather radar data
- Air quality information
- UV index data
- Historical weather data
- Extended forecasts

---

**Note**: This app requires an internet connection and location access to function properly. The weather data is provided by OpenWeatherMap and is subject to their terms of service.
