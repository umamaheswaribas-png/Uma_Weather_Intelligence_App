import React from 'react';
import { motion } from 'motion/react';
import { WeatherData } from '../types';
import { getWeatherCodeDetails, formatDayOfWeek, formatMonthAndDay } from '../utils/weatherHelpers';
import { Calendar, Thermometer, CloudRain, ChevronRight } from 'lucide-react';

interface ForecastSectionProps {
  weather: WeatherData;
  isFahrenheit: boolean;
  selectedDayIndex: number;
  onDaySelect: (index: number) => void;
}

export default function ForecastSection({ 
  weather, 
  isFahrenheit, 
  selectedDayIndex, 
  onDaySelect 
}: ForecastSectionProps) {
  const daily = weather.daily;

  // Conversion helpers
  const toF = (c: number) => (c * 9/5) + 32;

  // Return list of days in the 7-day forecast
  const forecastDays = daily.time.map((time, idx) => {
    const code = daily.weather_code[idx];
    const maxC = daily.temperature_2m_max[idx];
    const minC = daily.temperature_2m_min[idx];
    const precip = daily.precipitation_sum?.[idx] ?? 0;
    const details = getWeatherCodeDetails(code, true);

    const displayMax = isFahrenheit ? `${Math.round(toF(maxC))}°` : `${Math.round(maxC)}°`;
    const displayMin = isFahrenheit ? `${Math.round(toF(minC))}°` : `${Math.round(minC)}°`;

    return {
      index: idx,
      time,
      code,
      precip,
      details,
      displayMax,
      displayMin,
      isToday: idx === 0
    };
  });

  return (
    <div className="space-y-4 animate-fade-in" id="forecast-section-container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white">
            7-Day Weather Forecast
          </h3>
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Select a day to view detailed intelligence & stats
        </p>
      </div>

      {/* Grid container for 7 days */}
      <div 
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3" 
        id="forecast-days-grid"
      >
        {forecastDays.map((day) => {
          const isSelected = selectedDayIndex === day.index;
          const WeatherIcon = day.details.icon;

          return (
            <motion.button
              key={day.time}
              type="button"
              onClick={() => onDaySelect(day.index)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`p-4 rounded-2xl flex flex-col items-center justify-between text-center transition-all duration-300 border backdrop-blur-md ${
                isSelected 
                  ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-500/30' 
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10 text-slate-300'
              }`}
            >
              {/* Date Header */}
              <div className="space-y-0.5">
                <p className={`text-xs font-bold uppercase tracking-wider ${
                  isSelected ? 'text-white' : 'text-slate-400'
                }`}>
                  {day.isToday ? 'Today' : formatDayOfWeek(day.time)}
                </p>
                <p className={`text-[10px] font-medium ${
                  isSelected ? 'text-white/85' : 'text-slate-400'
                }`}>
                  {formatMonthAndDay(day.time)}
                </p>
              </div>

              {/* Weather Icon */}
              <div className={`p-2.5 rounded-full my-3 border ${
                isSelected 
                  ? 'bg-white/20 border-white/10 text-white' 
                  : 'bg-white/5 border-white/5 text-cyan-400'
              }`}>
                <WeatherIcon className="w-6 h-6 shrink-0" />
              </div>

              {/* Label */}
              <p className={`text-[10px] font-bold truncate max-w-full mb-2 ${
                isSelected ? 'text-white' : 'text-slate-200'
              }`}>
                {day.details.label}
              </p>

              {/* Temperature block */}
              <div className="space-y-1 w-full pt-2 border-t border-dotted border-current/25">
                <div className="flex items-center justify-center gap-1.5 text-xs">
                  <span className={`font-bold ${isSelected ? 'text-white' : 'text-slate-100'}`}>
                    {day.displayMax}
                  </span>
                  <span className={`text-[10px] ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                    {day.displayMin}
                  </span>
                </div>

                {/* Rain Probability / Sum */}
                {day.precip > 0 && (
                  <div className="flex items-center justify-center gap-0.5 text-[9px] font-medium">
                    <CloudRain className="w-2.5 h-2.5 text-cyan-400" />
                    <span>{day.precip.toFixed(1)}m</span>
                  </div>
                )}
              </div>

            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
