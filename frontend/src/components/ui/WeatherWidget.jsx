import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Thermometer } from 'lucide-react';

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
        return <Sun size={24} className="text-yellow-500" />;
      case 'cloudy':
        return <Cloud size={24} className="text-gray-500" />;
      case 'rainy':
        return <CloudRain size={24} className="text-blue-500" />;
      case 'snowy':
        return <CloudSnow size={24} className="text-blue-300" />;
      case 'windy':
        return <Wind size={24} className="text-gray-400" />;
      default:
        return <Sun size={24} className="text-yellow-500" />;
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
      className="bg-blue-600 rounded-xl p-4 text-white relative overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-medium text-blue-100">Weather</h3>
            <p className="text-xs text-blue-200">{weather.location}</p>
          </div>
          {getWeatherIcon(weather.condition)}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Thermometer size={16} className="text-blue-200" />
                <span className="text-2xl font-bold">{weather.temperature}°F</span>
              </div>
              <div className="text-right">
                <p className="text-xs text-blue-200">Humidity: {weather.humidity}%</p>
                <p className="text-xs text-blue-200">Wind: {weather.windSpeed} mph</p>
              </div>
            </div>
            
            <div className="mt-3 pt-3 border-t border-white/20">
              <p className="text-xs text-blue-200">
                Perfect weather for saving! ☀️
              </p>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default WeatherWidget; 