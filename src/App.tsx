import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CloudSun, 
  MapPin, 
  RefreshCw, 
  Compass, 
  AlertTriangle,
  Loader2,
  ChevronLeft,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { Location, WeatherData } from './types';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import WeatherStats from './components/WeatherStats';
import ForecastSection from './components/ForecastSection';
import IntelligenceSection from './components/IntelligenceSection';

const DEFAULT_LOCATION: Location = {
  id: 5128581,
  name: 'New York',
  latitude: 40.71427,
  longitude: -74.00597,
  country: 'United States',
  admin1: 'New York'
};

export default function App() {
  const [selectedLocation, setSelectedLocation] = useState<Location>(DEFAULT_LOCATION);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isFahrenheit, setIsFahrenheit] = useState<boolean>(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isLocating, setIsLocating] = useState<boolean>(false);

  // Fetch weather data when selectedLocation changes
  const fetchWeather = async (loc: Location) => {
    setLoading(true);
    setError(null);
    setSelectedDayIndex(0); // Reset to today on location change
    
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,uv_index_max,precipitation_sum,wind_speed_10m_max&timezone=auto`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to retrieve forecast data from Open-Meteo.');
      }
      
      const data: WeatherData = await response.json();
      setWeatherData(data);
    } catch (err: any) {
      console.error(err);
      setError('Could not fetch the weather forecast. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(selectedLocation);
  }, [selectedLocation]);

  // Attempt to auto-locate user on mount
  useEffect(() => {
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          try {
            // Reverse geocode via free geocoding API if possible, otherwise call with coords
            const response = await fetch(
              `https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(2)},${lon.toFixed(2)}&count=1&language=en&format=json`
            );
            
            let detectedLoc: Location = {
              id: Date.now(),
              name: 'Detected Location',
              latitude: lat,
              longitude: lon,
              country: 'Local Coordinates'
            };

            if (response.ok) {
              const data = await response.json();
              if (data.results && data.results.length > 0) {
                detectedLoc = data.results[0];
              }
            }
            
            setSelectedLocation(detectedLoc);
          } catch (e) {
            // Fallback to coordinates location
            setSelectedLocation({
              id: Date.now(),
              name: 'Detected Location',
              latitude: lat,
              longitude: lon,
              country: 'Local Area'
            });
          } finally {
            setIsLocating(false);
          }
        },
        (err) => {
          console.warn('Geolocation denied or failed. Falling back to default New York.', err);
          setIsLocating(false);
          // Don't change selectedLocation, keep New York
        },
        { timeout: 8000 }
      );
    }
  }, []);

  const handleRefresh = () => {
    fetchWeather(selectedLocation);
  };

  // Construct specific day weather payload for sub-components when a forecast day is selected
  const getActiveWeatherForView = (): WeatherData | null => {
    if (!weatherData) return null;
    if (selectedDayIndex === 0) return weatherData;

    // Simulate current state based on daily forecast indices
    const idx = selectedDayIndex;
    const daily = weatherData.daily;

    return {
      ...weatherData,
      current: {
        time: daily.time[idx] + 'T12:00',
        temperature_2m: daily.temperature_2m_max[idx],
        relative_humidity_2m: 65, // reasonable average
        apparent_temperature: daily.apparent_temperature_max[idx],
        is_day: 1,
        precipitation: daily.precipitation_sum?.[idx] ?? 0,
        rain: daily.precipitation_sum?.[idx] ?? 0,
        showers: 0,
        snowfall: 0,
        weather_code: daily.weather_code[idx],
        wind_speed_10m: daily.wind_speed_10m_max[idx],
      }
    };
  };

  const activeWeather = getActiveWeatherForView();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-hidden transition-colors duration-300">
      
      {/* Decorative ambient blurry spots from the Frosted Glass theme */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] w-[30%] h-[30%] bg-indigo-600/5 rounded-full blur-[80px]" />
      </div>

      {/* Primary Container with high relative z-index */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header App Bar */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6" id="app-header">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white rounded-2xl shadow-lg shadow-cyan-500/10">
              <CloudSun className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Weather Intelligence <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold border border-cyan-500/20">v1.1</span>
              </h1>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
                Forecast-driven Smart Planning Platform
              </p>
            </div>
          </div>

          {/* Unit Toggle and Refresh button */}
          <div className="flex items-center gap-3" id="header-action-controls">
            {/* Locating Spinner indicator */}
            {isLocating && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full animate-pulse">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Locating...</span>
              </div>
            )}

            <button
              id="refresh-weather-btn"
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-slate-200 rounded-xl shadow-lg transition-all duration-200 disabled:opacity-50"
              title="Refresh weather data"
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
            </button>

            <div className="bg-white/5 border border-white/10 p-1 rounded-xl flex shadow-lg backdrop-blur-md" id="temp-unit-toggle">
              <button
                type="button"
                onClick={() => setIsFahrenheit(false)}
                className={`text-xs font-bold px-3 py-2 rounded-lg transition-all ${
                  !isFahrenheit 
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °C
              </button>
              <button
                type="button"
                onClick={() => setIsFahrenheit(true)}
                className={`text-xs font-bold px-3 py-2 rounded-lg transition-all ${
                  isFahrenheit 
                    ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                °F
              </button>
            </div>
          </div>
        </header>

        {/* Search Bar Section */}
        <section id="search-section">
          <SearchBar 
            onLocationSelect={setSelectedLocation} 
            selectedLocation={selectedLocation} 
          />
        </section>

        {/* Main Content Area */}
        <main className="space-y-8" id="main-weather-content">
          <AnimatePresence mode="wait">
            
            {loading && !weatherData && (
              <motion.div
                key="loading-skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-20 space-y-4"
                id="loading-spinner-container"
              >
                <Loader2 className="w-12 h-12 text-cyan-400 animate-spin" />
                <p className="text-sm font-semibold text-slate-400">
                  Retrieving atmospheric models and weather intelligence...
                </p>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-6 bg-rose-500/5 border border-rose-500/20 rounded-2xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left text-rose-300 backdrop-blur-md"
                id="error-state-container"
              >
                <AlertTriangle className="w-10 h-10 text-rose-500 shrink-0" />
                <div className="space-y-1">
                  <h3 className="font-bold text-rose-400">Connection Interrupted</h3>
                  <p className="text-sm text-rose-300">{error}</p>
                </div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="mt-2 sm:mt-0 sm:ml-auto px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold shadow-md shadow-rose-500/10 transition-all"
                >
                  Retry Search
                </button>
              </motion.div>
            )}

            {weatherData && activeWeather && !loading && (
              <motion.div
                key="weather-dashboard-active"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Visual indicator when inspecting a forecast day */}
                {selectedDayIndex > 0 && (
                  <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-xl flex items-center justify-between text-amber-300 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-xs font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span>Viewing weather projection for {new Date(weatherData.daily.time[selectedDayIndex] + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedDayIndex(0)}
                      className="text-xs font-bold text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <ChevronLeft className="w-4.5 h-4.5" /> Return to Today
                    </button>
                  </div>
                )}

                {/* Primary Card View */}
                <WeatherCard 
                  location={selectedLocation} 
                  weather={activeWeather} 
                  isFahrenheit={isFahrenheit} 
                />

                {/* Detailed Bento Stats Row */}
                <WeatherStats 
                  weather={activeWeather} 
                  isFahrenheit={isFahrenheit} 
                />

                {/* Weather Intelligence section */}
                <IntelligenceSection weather={activeWeather} />

                {/* 7-day Forecast list/grid */}
                <ForecastSection 
                  weather={weatherData} 
                  isFahrenheit={isFahrenheit} 
                  selectedDayIndex={selectedDayIndex}
                  onDaySelect={setSelectedDayIndex}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Footer */}
        <footer className="border-t border-white/10 pt-8 pb-12 text-center space-y-3" id="app-footer">
          <p className="text-xs text-slate-400 font-medium">
            Weather data provided open-source by <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">Open-Meteo</a>. Geocoding by <a href="https://open-meteo.com/en/docs/geocoding-api" target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">Geocoding API</a>.
          </p>
          <div className="flex justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-1"><Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Fully Static & Production-Ready</span>
            <span className="flex items-center gap-1"><Info className="w-3.5 h-3.5 text-indigo-400" /> Structured for Cloudflare Pages</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
