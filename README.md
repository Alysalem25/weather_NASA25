# 🌤️ NASA Weather Planner - Advanced Weather Intelligence Platform

<div align="center">

![NASA Weather Planner](https://img.shields.io/badge/NASA-Weather%20Planner-blue?style=for-the-badge&logo=nasa)
![Next.js](https://img.shields.io/badge/Next.js-13.5.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.3-38B2AC?style=for-the-badge&logo=tailwind-css)

**Harness the power of NASA Earth observation data to make informed decisions about your outdoor adventures. Know before you go.**

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [✨ Request Feature](#)

</div>

---

## 🌟 Overview

NASA Weather Planner is a cutting-edge web application that combines real-time weather data, NASA Earth observation insights, and intelligent activity planning to help users make informed decisions about outdoor activities. The platform features an interactive map, real-time weather monitoring, severe weather alerts, and personalized recommendations based on location, weather conditions, and activity preferences.

### 🎯 Key Features

- **🌍 Real-Time Weather Monitoring**: Live weather data with automatic location detection
- **🚨 Intelligent Weather Alerts**: AI-powered detection of dangerous weather conditions
- **🗺️ Interactive Mapping**: Advanced Leaflet-based map with location search and selection
- **📊 Weather Analytics**: Historical data analysis and trend visualization
- **🎯 Activity Planning**: Tailored recommendations for hiking, fishing, beach, picnic, and sports
- **📱 Responsive Design**: Mobile-first approach with beautiful animations
- **🎨 Dynamic Backgrounds**: Weather-responsive animated backgrounds
- **📤 Data Export**: CSV export and social sharing capabilities

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser with geolocation support

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/nasa-weather-planner.git
cd nasa-weather-planner
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Set up environment variables**
```bash
# Create .env.local file
cp env.example .env.local

# Add your OpenWeatherMap API key
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

4. **Run the development server**
```bash
npm run dev
# or
yarn dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🌐 API Integration

### OpenWeatherMap Integration

The application integrates with OpenWeatherMap API for real-time weather data:

- **Current Weather**: Temperature, humidity, pressure, wind speed, visibility
- **Weather Alerts**: Official meteorological warnings and advisories
- **Location Services**: Reverse geocoding and location-based weather
- **Fallback System**: Mock data when API is unavailable

### NASA Data Integration

- **Earth Observation Data**: Satellite imagery and atmospheric data
- **Historical Analysis**: Long-term weather pattern analysis
- **Climate Insights**: Regional climate characteristics and trends

---

## 🏗️ Architecture

### Frontend Stack

- **Framework**: Next.js 13 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **Animations**: Framer Motion
- **Maps**: Leaflet with OpenStreetMap
- **Charts**: Recharts for data visualization
- **State Management**: React hooks and context

### Backend Services

- **API Routes**: Next.js API routes for serverless functions
- **Weather Service**: Centralized weather data management
- **Location Services**: Geolocation and reverse geocoding
- **Alert System**: Real-time weather alert processing

### Data Flow

```
User Location → Weather Service → OpenWeatherMap API → Weather Data Processing → Alert Detection → UI Components → User Interface
```

---

## 🎨 User Interface

### Home Page Features

- **Auto Location Detection**: Automatically detects user location on page load
- **Current Weather Card**: Displays real-time weather conditions
- **Weather Alerts**: Prominent display of severe weather warnings
- **Animated Background**: Weather-responsive particle animations
- **Activity Quick Access**: Direct links to weather dashboard

### Weather Dashboard

- **Interactive Map**: Click-to-select location functionality
- **Location Search**: Text-based location search with suggestions
- **Date Picker**: Calendar interface for date selection
- **Activity Filter**: Dropdown for activity type selection
- **Weather Results**: Comprehensive weather analysis and recommendations

### Responsive Design

- **Mobile-First**: Optimized for mobile devices
- **Touch-Friendly**: Gesture support for map interaction
- **Adaptive Layout**: Responsive grid system
- **Accessibility**: WCAG 2.1 compliant

---

## 🚨 Weather Alert System

### Automatic Detection

The system automatically detects and alerts users to dangerous weather conditions:

#### Severe Weather Alerts
- **🌪️ Tornado Warnings**: Automatic detection of tornado conditions
- **💨 High Wind Alerts**: Winds exceeding 25 m/s trigger severe alerts
- **🌧️ Heavy Rain Warnings**: High humidity + rain conditions
- **🌡️ Extreme Temperature**: Temperatures > 40°C or < -20°C

#### Alert Severity Levels
- **🟢 Minor**: General weather advisories
- **🟡 Moderate**: Weather conditions requiring attention
- **🟠 Severe**: Dangerous weather conditions
- **🔴 Extreme**: Life-threatening weather conditions

### Alert Features
- **Real-Time Notifications**: Instant alerts via toast notifications
- **Visual Indicators**: Color-coded alert cards
- **Dismissible Alerts**: User can dismiss non-critical alerts
- **Persistent Warnings**: Critical alerts remain visible

---

## 📊 Weather Data & Analytics

### Current Weather Metrics

- **Temperature**: Current temperature and "feels like" temperature
- **Humidity**: Relative humidity percentage
- **Pressure**: Atmospheric pressure in hPa
- **Wind**: Speed and direction with compass bearing
- **Visibility**: Visibility range in kilometers
- **UV Index**: Ultraviolet radiation index (when available)

### Historical Analysis

- **Trend Visualization**: Charts showing weather patterns over time
- **Seasonal Data**: Historical averages and extremes
- **Activity Suitability**: Historical data for activity planning
- **Climate Insights**: Regional climate characteristics

---

## 🎯 Activity Planning

### Supported Activities

1. **🥾 Hiking**
   - Trail condition analysis
   - Temperature and precipitation considerations
   - Wind and visibility factors

2. **🎣 Fishing**
   - Wind speed and direction analysis
   - Water temperature considerations
   - Barometric pressure effects

3. **🏖️ Beach**
   - UV index and sun exposure
   - Wind conditions for water activities
   - Temperature comfort levels

4. **🧺 Picnic**
   - General weather comfort
   - Precipitation probability
   - Wind and temperature factors

5. **⚽ Sports**
   - Field condition analysis
   - Temperature and humidity considerations
   - Wind impact on performance

### Recommendation Engine

The system provides intelligent recommendations based on:
- **Weather Conditions**: Current and forecasted weather
- **Activity Requirements**: Specific needs for each activity type
- **Safety Considerations**: Risk assessment and safety warnings
- **Comfort Factors**: Temperature, humidity, and wind comfort

---

## 🛠️ Development

### Project Structure

```
nasa-weather-planner/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Weather dashboard page
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── results/           # Weather results components
│   ├── ui/                # Reusable UI components
│   └── weather/           # Weather-specific components
├── lib/                   # Utility libraries
│   ├── weather-service.ts # Weather API service
│   └── utils.ts           # General utilities
├── hooks/                 # Custom React hooks
└── public/                # Static assets
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Environment Variables

```bash
# Required
NEXT_PUBLIC_OPENWEATHER_API_KEY=your_openweathermap_api_key

# Optional
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   - Link your GitHub repository to Vercel
   - Configure build settings

2. **Set Environment Variables**
   - Add `NEXT_PUBLIC_OPENWEATHER_API_KEY` in Vercel dashboard
   - Configure other environment variables as needed

3. **Deploy**
   - Automatic deployment on git push
   - Custom domain configuration available

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- **Netlify**: Static site generation
- **AWS Amplify**: Full-stack deployment
- **Railway**: Container-based deployment
- **Docker**: Containerized deployment

---

## 🔒 Security & Privacy

### Data Protection
- **No Data Storage**: User location and preferences are not stored
- **API Security**: Secure API key management
- **HTTPS Only**: All communications encrypted
- **Privacy First**: Minimal data collection

### Location Privacy
- **Local Processing**: Location data processed locally
- **No Tracking**: No user tracking or analytics
- **Permission-Based**: Location access requires explicit permission
- **Temporary Use**: Location data used only for weather requests

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Code Style

- **TypeScript**: Strict type checking enabled
- **ESLint**: Configured with Next.js rules
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **NASA**: For Earth observation data and inspiration
- **OpenWeatherMap**: For weather data API
- **OpenStreetMap**: For mapping services
- **Vercel**: For hosting and deployment
- **Next.js Team**: For the amazing framework
- **Tailwind CSS**: For the utility-first CSS framework
- **Framer Motion**: For smooth animations

---

## 📞 Support

- **Documentation**: [Full Documentation](https://docs.nasa-weather-planner.com)
- **Issues**: [GitHub Issues](https://github.com/yourusername/nasa-weather-planner/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/nasa-weather-planner/discussions)
- **Email**: support@nasa-weather-planner.com

---

<div align="center">

**Made with ❤️ for the NASA Space Apps Challenge 2025**

[⬆ Back to Top](#-nasa-weather-planner---advanced-weather-intelligence-platform)

</div>
