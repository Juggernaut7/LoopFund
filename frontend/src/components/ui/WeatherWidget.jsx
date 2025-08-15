import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Cloud, CloudRain, CloudSnow, Wind, Thermometer } from 'lucide-react';

const WeatherWidget = () => {
  const [weather, setWeather] = useState({
    temperature: 72,
    condition: 'sunny',
    location: 'New York, NY',
    humidity: 65,
    windSpeed: 8
  });

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

  const getWeatherGradient = (condition) => {
    switch (condition) {
      case 'sunny':
        return 'from-yellow-400 to-orange-500';
      case 'cloudy':
        return 'from-gray-400 to-gray-600';
      case 'rainy':
        return 'from-blue-400 to-blue-600';
      case 'snowy':
        return 'from-blue-200 to-blue-400';
      case 'windy':
        return 'from-gray-300 to-gray-500';
      default:
        return 'from-blue-400 to-purple-500';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 text-white relative overflow-hidden"
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
      </div>
    </motion.div>
  );
};

export default WeatherWidget; 