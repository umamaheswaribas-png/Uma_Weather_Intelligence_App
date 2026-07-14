import React from 'react';
import { motion } from 'motion/react';
import { WeatherData } from '../types';
import { 
  Sun, 
  Wind, 
  Compass, 
  Droplets, 
  Thermometer, 
  AlertCircle 
} from 'lucide-react';

interface WeatherStatsProps {
  weather: WeatherData;
  isFahrenheit: boolean;
}

export default function WeatherStats({ weather, isFahrenheit }: WeatherStatsProps) {
  const daily = weather.daily;
  
  const uvIndex = daily.uv_index_max?.[0] ?? 0;
  const windMax = daily.wind_speed_10m_max?.[0] ?? 0;
  const precipSum = daily.precipitation_sum?.[0] ?? 0;
  const tempMaxC = daily.temperature_2m_max?.[0] ?? 0;
  const tempMinC = daily.temperature_2m_min?.[0] ?? 0;
  
  const apparentMaxC = daily.apparent_temperature_max?.[0] ?? 0;
  const apparentMinC = daily.apparent_temperature_min?.[0] ?? 0;

  // Conversion helpers
  const toF = (c: number) => (c * 9/5) + 32;

  const displayMax = isFahrenheit ? `${Math.round(toF(tempMaxC))}°F` : `${Math.round(tempMaxC)}°C`;
  const displayMin = isFahrenheit ? `${Math.round(toF(tempMinC))}°F` : `${Math.round(tempMinC)}°C`;
  
  const displayAppMax = isFahrenheit ? `${Math.round(toF(apparentMaxC))}°F` : `${Math.round(apparentMaxC)}°C`;
  const displayAppMin = isFahrenheit ? `${Math.round(toF(apparentMinC))}°F` : `${Math.round(apparentMinC)}°C`;

  // UV category details
  const getUvCategory = (uv: number) => {
    if (uv < 3) return { label: 'Low', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' };
    if (uv < 6) return { label: 'Moderate', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' };
    if (uv < 8) return { label: 'High', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' };
    return { label: 'Very High', color: 'text-red-400 bg-red-500/10 border-red-500/20' };
  };

  const uvCat = getUvCategory(uvIndex);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="weather-stats-bento">
      
      {/* Stat 1: Max/Min Temperature Range */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-2xl shadow-lg hover:bg-white/10 transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Temperature Range</span>
          <span className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            <Thermometer className="w-5 h-5" />
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{displayMax}</span>
            <span className="text-sm text-slate-400 font-medium">/ {displayMin}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Expected high and low values for today.
          </p>
        </div>
      </motion.div>

      {/* Stat 2: Apparent Temp Range */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-2xl shadow-lg hover:bg-white/10 transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">RealFeel Range</span>
          <span className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Thermometer className="w-5 h-5" />
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{displayAppMax}</span>
            <span className="text-sm text-slate-400 font-medium">/ {displayAppMin}</span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            How temperature actually feels outside.
          </p>
        </div>
      </motion.div>

      {/* Stat 3: UV Index */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-2xl shadow-lg hover:bg-white/10 transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">UV Radiation</span>
          <span className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Sun className="w-5 h-5" />
          </span>
        </div>
        <div>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-white">{uvIndex.toFixed(1)}</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${uvCat.color}`}>
              {uvCat.label}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Peak ultraviolet strength for today.
          </p>
        </div>
      </motion.div>

      {/* Stat 4: Precipitation & Max Wind */}
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-white/5 border border-white/10 backdrop-blur-md p-5 rounded-2xl shadow-lg hover:bg-white/10 transition-all flex flex-col justify-between"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wind & Rain</span>
          <span className="p-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
            <Wind className="w-5 h-5" />
          </span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 font-medium">Max Wind:</span>
            <span className="font-bold text-slate-200">{Math.round(windMax)} km/h</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 font-medium">Precip. Sum:</span>
            <span className="font-bold text-slate-200">{precipSum.toFixed(1)} mm</span>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-white/5">
            Total accumulation & max gusts expected.
          </p>
        </div>
      </motion.div>

    </div>
  );
}
