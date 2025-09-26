# 🔑 API Setup Guide

## OpenWeatherMap API Key Setup

### Step 1: Get Your Free API Key

1. **Visit OpenWeatherMap**
   - Go to [https://openweathermap.org/api](https://openweathermap.org/api)
   - Click "Sign Up" to create a free account

2. **Verify Your Email**
   - Check your email for verification link
   - Click the verification link to activate your account

3. **Get Your API Key**
   - Log in to your OpenWeatherMap account
   - Go to "My API Keys" in your dashboard
   - Copy your API key (it looks like: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`)

### Step 2: Configure Your Environment

1. **Create Environment File**
   ```bash
   # In your project root directory
   touch .env.local
   ```

2. **Add Your API Key**
   ```bash
   # Add this line to .env.local
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

3. **Restart Your Development Server**
   ```bash
   # Stop the current server (Ctrl+C)
   npm run dev
   ```

### Step 3: Test Your Setup

1. **Open the Application**
   - Go to [http://localhost:3000](http://localhost:3000)
   - Allow location access when prompted

2. **Check the Console**
   - Open browser developer tools (F12)
   - Look for "Weather data updated successfully!" message
   - If you see "using mock data", your API key is not configured correctly

### Step 4: Verify Real Data

With a valid API key, you should see:
- ✅ Real weather data from OpenWeatherMap
- ✅ Actual weather icons
- ✅ Real location names
- ✅ Accurate temperature and conditions

Without a valid API key, you'll see:
- ⚠️ Mock weather data (still functional)
- ⚠️ Console warning about API key
- ⚠️ Simulated weather conditions

## API Limits & Usage

### Free Tier Limits
- **1,000 calls per day**
- **60 calls per minute**
- **Current weather data**
- **5-day forecast**
- **Weather alerts**

### Recommended Usage
- The app makes 1-2 API calls per weather request
- With 1,000 daily calls, you can make 500-1,000 weather requests per day
- Perfect for development and personal use

### Upgrading (Optional)
- **Pro Plan**: $40/month for 1,000,000 calls/day
- **Business Plan**: $200/month for 5,000,000 calls/day
- **Enterprise Plan**: Custom pricing for unlimited calls

## Troubleshooting

### Common Issues

1. **401 Unauthorized Error**
   - Check if your API key is correct
   - Ensure there are no extra spaces in the .env.local file
   - Verify the API key is active in your OpenWeatherMap dashboard

2. **403 Forbidden Error**
   - Your API key might be blocked
   - Check if you've exceeded the rate limit
   - Verify your account is verified

3. **No Weather Data**
   - Check browser console for errors
   - Ensure .env.local file is in the project root
   - Restart the development server after adding the API key

4. **Location Not Working**
   - Ensure you're using HTTPS in production
   - Check browser location permissions
   - Try refreshing the page

### Debug Mode

Enable detailed logging by opening browser console:
```javascript
// Check if API key is loaded
console.log(process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY);

// Check weather service status
// Look for "OpenWeatherMap API key not configured" warning
```

## Alternative APIs

If you prefer other weather APIs:

### WeatherAPI
- **URL**: [https://www.weatherapi.com/](https://www.weatherapi.com/)
- **Free Tier**: 1,000,000 calls/month
- **Setup**: Similar to OpenWeatherMap

### AccuWeather
- **URL**: [https://developer.accuweather.com/](https://developer.accuweather.com/)
- **Free Tier**: 50 calls/day
- **Setup**: More complex but very accurate

### Weather.gov (US Only)
- **URL**: [https://www.weather.gov/documentation/services-web-api](https://www.weather.gov/documentation/services-web-api)
- **Free Tier**: Unlimited
- **Limitation**: US locations only

## Security Notes

- **Never commit .env.local to version control**
- **Use environment variables in production**
- **Rotate your API keys regularly**
- **Monitor your API usage**

---

**Need Help?** Check the [main README](README.md) or open an issue on GitHub.
