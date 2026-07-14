import React from 'react';
import { motion } from 'motion/react';
import { WeatherData } from '../types';
import { generateIntelligence } from '../utils/weatherHelpers';
import { 
  Sparkles, 
  Check, 
  X, 
  HelpCircle,
  Umbrella, 
  GlassWater, 
  Sun, 
  Wind, 
  Shirt, 
  Activity,
  Trees,
  Footprints,
  Bike
} from 'lucide-react';

interface IntelligenceSectionProps {
  weather: WeatherData;
}

export default function IntelligenceSection({ weather }: IntelligenceSectionProps) {
  const intel = generateIntelligence(weather);
  const current = weather.current;
  const temp = current.temperature_2m;
  const code = current.weather_code;
  const wind = current.wind_speed_10m;

  // Let's calculate precise suitability for standard activities
  const getActivitySuitability = () => {
    const isWet = intel.umbrellaNeeded || [71, 73, 75, 77, 85, 86].includes(code);
    
    // 1. Picnic / Outdoor Dining
    let picnic: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Good';
    if (isWet || temp < 14 || temp > 32 || wind > 25 || code >= 95) picnic = 'Poor';
    else if (temp < 18 || temp > 28 || wind > 18 || code === 3) picnic = 'Fair';
    else if (temp >= 19 && temp <= 26 && code <= 1 && wind < 12) picnic = 'Excellent';

    // 2. Jogging / Running
    let jogging: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Good';
    if (isWet || temp < 3 || temp > 33 || wind > 30) jogging = 'Poor';
    else if (temp < 8 || temp > 26 || wind > 20) jogging = 'Fair';
    else if (temp >= 10 && temp <= 18 && code <= 2 && wind < 15) jogging = 'Excellent';

    // 3. Cycling / Biking
    let cycling: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Good';
    if (isWet || temp < 5 || temp > 34 || wind > 28) cycling = 'Poor';
    else if (temp < 10 || temp > 28 || wind > 18) cycling = 'Fair';
    else if (temp >= 14 && temp <= 22 && code <= 1 && wind < 12) cycling = 'Excellent';

    // 4. Hiking / Nature Walks
    let hiking: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Good';
    if (code >= 95 || temp < 2 || temp > 35 || (isWet && temp < 8)) hiking = 'Poor';
    else if (isWet || temp < 7 || temp > 29 || wind > 22) hiking = 'Fair';
    else if (temp >= 12 && temp <= 21 && code <= 2 && wind < 15) hiking = 'Excellent';

    return [
      { name: 'Picnic & Dining', suitability: picnic, icon: Trees },
      { name: 'Running & Cardio', suitability: jogging, icon: Activity },
      { name: 'Cycling / Commute', suitability: cycling, icon: Bike },
      { name: 'Hiking & Trails', suitability: hiking, icon: Footprints }
    ];
  };

  const activities = getActivitySuitability();

  // Suitability Badge Colors
  const getSuitabilityColor = (level: 'Excellent' | 'Good' | 'Fair' | 'Poor') => {
    switch (level) {
      case 'Excellent':
        return 'text-emerald-400 bg-emerald-500/15 border border-emerald-500/25';
      case 'Good':
        return 'text-cyan-400 bg-cyan-500/15 border border-cyan-500/25';
      case 'Fair':
        return 'text-amber-400 bg-amber-500/15 border border-amber-500/25';
      case 'Poor':
        return 'text-rose-400 bg-rose-500/15 border border-rose-500/25';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="space-y-6"
      id="weather-intelligence-section"
    >
      <div className="flex items-center gap-2">
        <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl text-white">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">
            Weather Intelligence & Planner
          </h3>
          <p className="text-xs text-slate-400">
            Smart recommendations and activity indexes tailored to today's forecast.
          </p>
        </div>
      </div>

      {/* Main Alert Card / Callout */}
      <div className="p-5 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />
        <div className="flex items-start gap-4">
          <span className="text-2xl mt-0.5">💡</span>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-cyan-400">Daily Outlook</h4>
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {intel.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Planning Recommendations list */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Daily Action Checklist
          </h4>

          <div className="grid grid-cols-1 gap-3">
            {/* Recommendation: Umbrella */}
            <div className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all backdrop-blur-md ${
              intel.umbrellaNeeded 
                ? 'bg-cyan-500/5 border-cyan-500/30' 
                : 'bg-white/5 border-white/10'
            }`}>
              <div className={`p-2.5 rounded-lg shrink-0 ${
                intel.umbrellaNeeded 
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25' 
                  : 'bg-white/5 text-slate-400 border border-white/5'
              }`}>
                <Umbrella className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-bold text-white">Precipitation Advice</h5>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    intel.umbrellaNeeded 
                      ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300' 
                      : 'bg-white/5 border-white/5 text-slate-400'
                  }`}>
                    {intel.umbrellaNeeded ? 'Rain Gear Required' : 'No Rain Gear'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  {intel.umbrellaNeeded 
                    ? 'Carry an umbrella, wear a rain jacket, or plan your commutes around showers.' 
                    : 'Clear skies or light drizzle. No heavy rain expected.'}
                </p>
              </div>
            </div>

            {/* Recommendation: Hydration Risk */}
            <div className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all backdrop-blur-md ${
              intel.hydrationRisk === 'High' 
                ? 'bg-rose-500/5 border-rose-500/30' 
                : intel.hydrationRisk === 'Medium'
                ? 'bg-amber-500/5 border-amber-500/30'
                : 'bg-white/5 border-white/10'
            }`}>
              <div className={`p-2.5 rounded-lg shrink-0 ${
                intel.hydrationRisk === 'High' 
                  ? 'bg-rose-500 text-white' 
                  : intel.hydrationRisk === 'Medium'
                  ? 'bg-amber-500 text-white'
                  : 'bg-white/5 text-slate-400 border border-white/5'
              }`}>
                <GlassWater className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-bold text-white">Hydration Warning</h5>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    intel.hydrationRisk === 'High' 
                      ? 'bg-rose-500/15 border-rose-500/25 text-rose-300' 
                      : intel.hydrationRisk === 'Medium'
                      ? 'bg-amber-500/15 border-amber-500/25 text-amber-300'
                      : 'bg-white/5 border-white/5 text-slate-400'
                  }`}>
                    {intel.hydrationRisk} Risk
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  {intel.hydrationRisk === 'High' 
                    ? 'Heat-dome conditions! Drink at least 3-4 liters of water today. Avoid active outdoor workouts during midday.'
                    : intel.hydrationRisk === 'Medium'
                    ? 'Warm climate. Keep a water bottle handy and sip regularly, especially if walking outside.'
                    : 'Mild temps. Standard fluid intake is fully sufficient.'}
                </p>
              </div>
            </div>

            {/* Recommendation: UV Protection */}
            <div className={`p-4 rounded-xl border flex items-start gap-3.5 transition-all backdrop-blur-md ${
              intel.uvProtectionNeeded 
                ? 'bg-amber-500/5 border-amber-500/30' 
                : 'bg-white/5 border-white/10'
            }`}>
              <div className={`p-2.5 rounded-lg shrink-0 ${
                intel.uvProtectionNeeded 
                  ? 'bg-amber-500 text-white' 
                  : 'bg-white/5 text-slate-400 border border-white/5'
              }`}>
                <Sun className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-bold text-white">Sun & UV Index</h5>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                    intel.uvProtectionNeeded 
                      ? 'bg-amber-500/15 border-amber-500/25 text-amber-300' 
                      : 'bg-white/5 border-white/5 text-slate-400'
                  }`}>
                    {intel.uvProtectionNeeded ? 'SPF Recommended' : 'Low Exposure'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-normal">
                  {intel.uvProtectionNeeded 
                    ? 'UV index is active. Apply sunscreen (SPF 30+), wear sunglasses, and protect your head/face.'
                    : 'Minimal risk of sun damage. Perfect for skin health.'}
                </p>
              </div>
            </div>

            {/* Recommendation: Apparel Suggestions */}
            <div className="p-4 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl flex items-start gap-3.5">
              <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-lg shrink-0">
                <Shirt className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-white">What to Wear</h5>
                <p className="text-xs text-slate-400 leading-normal">
                  {intel.clothingSuggestion}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right Column: Outdoor Activities Index */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Outdoor Activity Suitability
          </h4>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 divide-y divide-white/5 shadow-lg">
            {activities.map((act, idx) => {
              const ActIcon = act.icon;
              return (
                <div key={idx} className="flex items-center justify-between py-3.5 first:pt-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-300 shrink-0">
                      <ActIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">{act.name}</p>
                      <p className="text-[10px] text-slate-400">Outdoor viability</p>
                    </div>
                  </div>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${getSuitabilityColor(act.suitability)}`}>
                    {act.suitability}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Wind Caution banner if wind warning exists */}
          {intel.windWarning && (
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center gap-3 text-amber-300 backdrop-blur-md"
            >
              <Wind className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
              <div className="text-xs">
                <span className="font-bold">Wind Alert:</span> Speeds are high. Ensure loose garden or balcony items are secured. Cycling or hiking could face strong head-winds.
              </div>
            </motion.div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
