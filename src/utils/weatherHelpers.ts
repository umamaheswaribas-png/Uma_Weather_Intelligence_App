import { 
  Sun, 
  CloudSun, 
  Cloud, 
  CloudRain, 
  CloudSnow, 
  CloudDrizzle, 
  CloudLightning, 
  CloudFog, 
  Wind,
  LucideIcon
} from 'lucide-react';
import { WeatherData, WeatherIntelligence } from '../types';

export interface WeatherCodeDetails {
  label: string;
  icon: LucideIcon;
  bgColor: string; // Tailwind class
  textColor: string; // Tailwind class
  borderColor: string; // Tailwind class
  accentColor: string; // Hex or tailwind
  description: string;
}

export function getWeatherCodeDetails(code: number, isDay: boolean = true): WeatherCodeDetails {
  // WMO weather interpretation codes
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        icon: Sun,
        bgColor: isDay ? 'bg-amber-50/80 dark:bg-amber-950/20' : 'bg-slate-900/80',
        textColor: isDay ? 'text-amber-700 dark:text-amber-400' : 'text-indigo-300',
        borderColor: isDay ? 'border-amber-200/60 dark:border-amber-900/40' : 'border-indigo-900/40',
        accentColor: '#f59e0b',
        description: isDay ? 'Perfect sunny skies' : 'Starlit, clear night'
      };
    case 1:
    case 2:
      return {
        label: 'Partly Cloudy',
        icon: CloudSun,
        bgColor: 'bg-sky-50/80 dark:bg-sky-950/20',
        textColor: 'text-sky-700 dark:text-sky-400',
        borderColor: 'border-sky-200/60 dark:border-sky-900/40',
        accentColor: '#0ea5e9',
        description: 'A mix of sun and passing clouds'
      };
    case 3:
      return {
        label: 'Overcast',
        icon: Cloud,
        bgColor: 'bg-slate-50/80 dark:bg-slate-900/30',
        textColor: 'text-slate-600 dark:text-slate-400',
        borderColor: 'border-slate-200/60 dark:border-slate-800/40',
        accentColor: '#64748b',
        description: 'Thick cloud cover blocking the sun'
      };
    case 45:
    case 48:
      return {
        label: 'Foggy',
        icon: CloudFog,
        bgColor: 'bg-zinc-100/80 dark:bg-zinc-900/30',
        textColor: 'text-zinc-600 dark:text-zinc-400',
        borderColor: 'border-zinc-200/60 dark:border-zinc-800/40',
        accentColor: '#71717a',
        description: 'Reduced visibility due to fog or mist'
      };
    case 51:
    case 53:
    case 55:
      return {
        label: 'Drizzle',
        icon: CloudDrizzle,
        bgColor: 'bg-teal-50/80 dark:bg-teal-950/20',
        textColor: 'text-teal-700 dark:text-teal-400',
        borderColor: 'border-teal-200/60 dark:border-teal-900/40',
        accentColor: '#14b8a6',
        description: 'Light, steady drizzle falling'
      };
    case 56:
    case 57:
      return {
        label: 'Freezing Drizzle',
        icon: CloudSnow,
        bgColor: 'bg-cyan-50/80 dark:bg-cyan-950/20',
        textColor: 'text-cyan-700 dark:text-cyan-400',
        borderColor: 'border-cyan-200/60 dark:border-cyan-900/40',
        accentColor: '#06b6d4',
        description: 'Ice-cold drizzle freezing on impact'
      };
    case 61:
    case 63:
    case 65:
      return {
        label: 'Rain',
        icon: CloudRain,
        bgColor: 'bg-blue-50/80 dark:bg-blue-950/20',
        textColor: 'text-blue-700 dark:text-blue-400',
        borderColor: 'border-blue-200/60 dark:border-blue-900/40',
        accentColor: '#3b82f6',
        description: 'Continuous rainfall; carry an umbrella'
      };
    case 66:
    case 67:
      return {
        label: 'Freezing Rain',
        icon: CloudSnow,
        bgColor: 'bg-indigo-50/80 dark:bg-indigo-950/20',
        textColor: 'text-indigo-700 dark:text-indigo-400',
        borderColor: 'border-indigo-200/60 dark:border-indigo-900/40',
        accentColor: '#6366f1',
        description: 'Rain turning to ice upon contact'
      };
    case 71:
    case 73:
    case 75:
    case 77:
      return {
        label: 'Snowing',
        icon: CloudSnow,
        bgColor: 'bg-violet-50/80 dark:bg-violet-950/20',
        textColor: 'text-violet-700 dark:text-violet-400',
        borderColor: 'border-violet-200/60 dark:border-violet-900/40',
        accentColor: '#8b5cf6',
        description: 'Snow accumulation expected'
      };
    case 80:
    case 81:
    case 82:
      return {
        label: 'Rain Showers',
        icon: CloudRain,
        bgColor: 'bg-blue-50/80 dark:bg-blue-950/20',
        textColor: 'text-blue-700 dark:text-blue-400',
        borderColor: 'border-blue-200/60 dark:border-blue-900/40',
        accentColor: '#3b82f6',
        description: 'Sudden heavy downpours'
      };
    case 85:
    case 86:
      return {
        label: 'Snow Showers',
        icon: CloudSnow,
        bgColor: 'bg-violet-50/80 dark:bg-violet-950/20',
        textColor: 'text-violet-700 dark:text-violet-400',
        borderColor: 'border-violet-200/60 dark:border-violet-900/40',
        accentColor: '#8b5cf6',
        description: 'Passing snow flurries'
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        icon: CloudLightning,
        bgColor: 'bg-red-50/80 dark:bg-red-950/20',
        textColor: 'text-red-700 dark:text-red-400',
        borderColor: 'border-red-200/60 dark:border-red-900/40',
        accentColor: '#ef4444',
        description: 'Thunder, lightning, and strong winds'
      };
    default:
      return {
        label: 'Unknown Weather',
        icon: Cloud,
        bgColor: 'bg-slate-50/80 dark:bg-slate-900/20',
        textColor: 'text-slate-700 dark:text-slate-400',
        borderColor: 'border-slate-200/60 dark:border-slate-900/40',
        accentColor: '#64748b',
        description: 'Uncommon weather event detected'
      };
  }
}

export function generateIntelligence(weather: WeatherData): WeatherIntelligence {
  const current = weather.current;
  const daily = weather.daily;
  
  const temp = current.temperature_2m;
  const code = current.weather_code;
  const precipitation = current.precipitation;
  const wind = current.wind_speed_10m;
  const maxUV = daily.uv_index_max?.[0] ?? 0;
  
  // Rain/umbrella checks
  const rainCodes = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99];
  const umbrellaNeeded = rainCodes.includes(code) || precipitation > 0.1;
  
  // Hydration checks
  let hydrationRisk: 'Low' | 'Medium' | 'High' = 'Low';
  if (temp >= 30 || current.apparent_temperature >= 32) {
    hydrationRisk = 'High';
  } else if (temp >= 23 || current.apparent_temperature >= 25) {
    hydrationRisk = 'Medium';
  }
  
  // UV check
  const uvProtectionNeeded = maxUV >= 3.0;
  
  // Wind Warning
  const windWarning = wind > 28 || (daily.wind_speed_10m_max?.[0] ?? 0) > 35;
  
  // Outdoor Suitability
  let outdoorSuitability: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Good';
  const isWet = umbrellaNeeded || [71, 73, 75, 77, 85, 86].includes(code);
  const isExtremelyHot = temp > 35;
  const isExtremelyCold = temp < 4;
  const isExtremelyWindy = wind > 35;
  
  if (isWet || isExtremelyHot || isExtremelyCold || isExtremelyWindy || code >= 95) {
    outdoorSuitability = 'Poor';
  } else if (temp < 10 || temp > 28 || wind > 22 || code === 3) {
    outdoorSuitability = 'Fair';
  } else if (temp >= 18 && temp <= 25 && code <= 1 && wind < 15) {
    outdoorSuitability = 'Excellent';
  } else {
    outdoorSuitability = 'Good';
  }
  
  // Clothing suggestion
  let clothingSuggestion = '';
  if (temp < 6) {
    clothingSuggestion = 'Bundle up heavily! Wear a thick thermal coat, hat, gloves, and scarf to retain body heat.';
  } else if (temp < 13) {
    clothingSuggestion = 'Chilly weather. A warm jacket or medium coat paired with layers is highly recommended.';
  } else if (temp < 18) {
    clothingSuggestion = 'Cool but comfortable. A sweater, light jacket, or cozy cardigan would be ideal.';
  } else if (temp < 25) {
    clothingSuggestion = 'Perfect mild weather! Light clothing, like long sleeves or a breathable t-shirt, is great.';
  } else if (temp < 32) {
    clothingSuggestion = 'Warm. Opt for light, loose-fitting, breathable shirts and shorts.';
  } else {
    clothingSuggestion = 'Very hot! Dress in extremely light, sweat-wicking materials. Wear a sunhat and sunglasses.';
  }
  
  if (umbrellaNeeded) {
    clothingSuggestion += ' Keep a waterproof outer shell or carry a windproof umbrella.';
  } else if ([71, 73, 75, 77, 85, 86].includes(code)) {
    clothingSuggestion += ' Ensure your footwear has insulated, slip-resistant soles.';
  }
  
  // Summary builder
  let summary = '';
  if (umbrellaNeeded) {
    summary = `Expect rain today. It is advisable to carry an umbrella and keep outdoor activities to a minimum.`;
  } else if (code >= 95) {
    summary = `Thunderstorms are active in your area. Secure loose items and remain indoors for safety.`;
  } else if (temp > 32) {
    summary = `Scorching conditions. Limit direct sun exposure during peak hours and hydrate heavily.`;
  } else if (temp < 5) {
    summary = `Freezing cold outside. Dress in multiple layers and protect your skin against cold winds.`;
  } else if (outdoorSuitability === 'Excellent') {
    summary = `Spectacular weather! Ideal conditions for running, cycling, picnics, or any outdoor endeavors.`;
  } else if (outdoorSuitability === 'Good') {
    summary = `Generally pleasant weather. Very suitable for casual strolls or routine outdoor tasks.`;
  } else {
    summary = `Mildly overcast or breezy conditions. Suitable for brief outdoor activities but have layers handy.`;
  }
  
  return {
    umbrellaNeeded,
    hydrationRisk,
    outdoorSuitability,
    uvProtectionNeeded,
    clothingSuggestion,
    windWarning,
    summary
  };
}

export function formatDayOfWeek(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00'); // Prevent timezone shift
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatMonthAndDay(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
