import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Thermometer, Sparkles } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temperature: null,
    condition: 'sunny',
    location: 'Loading...',
    humidity: null,
    windSpeed: null
  });
  const [isLoading, setIsLoading] = useState(true);

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'sunny':
        return <Sun size={24} className="text-loopfund-gold-500" />;
      case 'cloudy':
        return <Cloud size={24} className="text-loopfund-neutral-500" />;
      case 'rainy':
        return <CloudRain size={24} className="text-loopfund-electric-500" />;
      case 'snowy':
        return <CloudSnow size={24} className="text-loopfund-lavender-500" />;
      case 'windy':
        return <Wind size={24} className="text-loopfund-neutral-400" />;
      default:
        return <Sun size={24} className="text-loopfund-gold-500" />;
    }
  };

  // Fetch real weather data
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setIsLoading(true);
        
        // Get user's location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            
            // Use a free weather API (you'll need to get an API key)
            // For now, we'll use a mock API call
            try {
              // Replace with actual weather API call
              // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=YOUR_API_KEY&units=imperial`);
              // const data = await response.json();
              
              // Mock data for now - replace with real API call
              setWeather({
                temperature: Math.floor(Math.random() * 30) + 50, // 50-80°F
                condition: ['sunny', 'cloudy', 'rainy'][Math.floor(Math.random() * 3)],
                location: 'Your Location',
                humidity: Math.floor(Math.random() * 40) + 40, // 40-80%
                windSpeed: Math.floor(Math.random() * 15) + 5 // 5-20 mph
              });
            } catch (error) {
              console.error('Weather API error:', error);
              // Fallback to default location
              setWeather({
                temperature: 72,
                condition: 'sunny',
                location: 'Default Location',
                humidity: 65,
                windSpeed: 8
              });
            }
          }, () => {
            // Geolocation failed, use default
            setWeather({
              temperature: 72,
              condition: 'sunny',
              location: 'Default Location',
              humidity: 65,
              windSpeed: 8
            });
          });
        } else {
          // Geolocation not supported
          setWeather({
            temperature: 72,
            condition: 'sunny',
            location: 'Default Location',
            humidity: 65,
            windSpeed: 8
          });
        }
      } catch (error) {
        console.error('Weather fetch error:', error);
        setWeather({
          temperature: 72,
          condition: 'sunny',
          location: 'Default Location',
          humidity: 65,
          windSpeed: 8
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeather();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-gradient-to-br from-loopfund-electric-500 via-loopfund-lavender-500 to-loopfund-electric-600 rounded-2xl p-6 text-white relative overflow-hidden"
    >
      {/* Revolutionary Background Elements */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12 animate-float" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10 animate-float-delayed" />
      <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white/5 rounded-full -translate-x-8 -translate-y-8 animate-float-slow" />
      
      {/* Revolutionary Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='20' cy='20' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-body text-body-sm font-medium text-white/90">Weather</h3>
            <p className="font-body text-body-xs text-white/70">{weather.location}</p>
          </div>
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            {getWeatherIcon(weather.condition)}
          </motion.div>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full"
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <Thermometer size={18} className="text-white/80" />
                </motion.div>
                <span className="font-display text-h4 text-white">{weather.temperature}°F</span>
              </div>
              <div className="text-right">
                <p className="font-body text-body-xs text-white/80">Humidity: {weather.humidity}%</p>
                <p className="font-body text-body-xs text-white/80">Wind: {weather.windSpeed} mph</p>
              </div>
            </div>
            
            <motion.div 
              className="mt-4 pt-4 border-t border-white/20"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <p className="font-body text-body-xs text-white/80 flex items-center">
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="mr-2"
                >
                  ☀️
                </motion.span>
                Perfect weather for saving!
              </p>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default WeatherWidget;