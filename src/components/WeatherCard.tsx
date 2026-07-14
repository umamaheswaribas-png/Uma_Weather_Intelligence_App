import React from 'react';
import { motion } from 'motion/react';
import { Location, WeatherData } from '../types';
import { getWeatherCodeDetails, formatMonthAndDay } from '../utils/weatherHelpers';
import { 
  Thermometer, 
  Wind, 
  Droplets, 
  CloudRain, 
  MapPin,
  Calendar,
  Sun
} from 'lucide-react';

interface WeatherCardProps {
  location: Location;
  weather: WeatherData;
  isFahrenheit: boolean;
}

export default function WeatherCard({ location, weather, isFahrenheit }: WeatherCardProps) {
  const current = weather.current;
  const isDay = current.is_day === 1;
  const details = getWeatherCodeDetails(current.weather_code, isDay);
  const WeatherIcon = details.icon;

  const tempC = current.temperature_2m;
  const tempF = (tempC * 9/5) + 32;
  const apparentC = current.apparent_temperature;
  const apparentF = (apparentC * 9/5) + 32;

  const displayTemp = isFahrenheit 
    ? `${Math.round(tempF)}°F` 
    : `${Math.round(tempC)}°C`;

  const displayApparent = isFahrenheit 
    ? `${Math.round(apparentF)}°F` 
    : `${Math.round(apparentC)}°C`;

  // Dynamic visual layout colors based on weather code details
  const gradientClass = isDay 
    ? 'from-sky-400 via-sky-500 to-indigo-600'
    : 'from-slate-800 via-indigo-950 to-slate-950';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative overflow-hidden rounded-3xl text-white shadow-2xl bg-white/5 border border-white/10 backdrop-blur-2xl"
      id="primary-weather-card"
    >
      {/* Decorative ambient glowing spot from the template */}
      <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-cyan-400/10 blur-[60px] rounded-full pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left column: Location & Temperature details */}
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-white/10 backdrop-blur-md rounded-lg border border-white/10">
              <MapPin className="w-5 h-5 text-cyan-400" />
            </span>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white" id="location-name">
                {location.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 font-medium" id="location-subtitle">
                {[location.admin1, location.country].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-6xl sm:text-7xl font-extrabold tracking-tighter text-white" id="current-temperature">
              {displayTemp}
            </span>
            <div className="space-y-0.5">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Feels Like</p>
              <p className="text-sm sm:text-base font-bold text-cyan-400" id="feels-like-temp">{displayApparent}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs sm:text-sm text-slate-200" id="current-date-info">
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Today, {formatMonthAndDay(current.time.substring(0, 10))}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/5 border border-white/5 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span>Live Weather</span>
            </div>
          </div>
        </div>

        {/* Right column: Weather illustration & summary */}
        <div className="flex flex-col sm:flex-row md:flex-col items-center sm:justify-between md:justify-center text-center sm:text-left md:text-center p-4 sm:p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl md:min-w-64 gap-4">
          <motion.div
            animate={{ 
              y: [0, -4, 0],
              rotate: current.weather_code === 0 ? [0, 360] : 0
            }}
            transition={{ 
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              rotate: { repeat: Infinity, duration: 30, ease: "linear" }
            }}
            className="p-3 bg-white/10 rounded-full border border-white/15"
            id="weather-icon-wrapper"
          >
            <WeatherIcon className="w-16 h-16 sm:w-20 sm:h-20 text-cyan-400 drop-shadow-[0_4px_6px_rgba(0,0,0,0.15)]" />
          </motion.div>
          
          <div className="space-y-1 text-center sm:text-left md:text-center">
            <p className="text-lg sm:text-xl font-bold tracking-tight text-white" id="weather-code-label">
              {details.label}
            </p>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              {details.description}
            </p>
          </div>
        </div>
      </div>

      {/* Footer details row */}
      <div className="bg-white/[0.02] border-t border-white/10 px-6 py-4 grid grid-cols-3 gap-2 text-center" id="current-stats-grid">
        <div className="flex flex-col items-center justify-center p-1 border-r border-white/10">
          <Droplets className="w-4 h-4 text-slate-400 mb-1" />
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Humidity</span>
          <span className="text-sm sm:text-base font-bold text-slate-200 mt-0.5" id="current-humidity">
            {current.relative_humidity_2m}%
          </span>
        </div>
        <div className="flex flex-col items-center justify-center p-1 border-r border-white/10">
          <Wind className="w-4 h-4 text-slate-400 mb-1" />
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Wind Speed</span>
          <span className="text-sm sm:text-base font-bold text-slate-200 mt-0.5" id="current-wind-speed">
            {Math.round(current.wind_speed_10m)} km/h
          </span>
        </div>
        <div className="flex flex-col items-center justify-center p-1">
          <CloudRain className="w-4 h-4 text-slate-400 mb-1" />
          <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Precipitation</span>
          <span className="text-sm sm:text-base font-bold text-slate-200 mt-0.5" id="current-precipitation">
            {current.precipitation || 0} mm
          </span>
        </div>
      </div>
    </motion.div>
  );
}
