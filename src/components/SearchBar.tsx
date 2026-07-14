import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Location } from '../types';

interface SearchBarProps {
  onLocationSelect: (location: Location) => void;
  selectedLocation: Location | null;
}

const POPULAR_CITIES = [
  { id: 5128581, name: 'New York', latitude: 40.71427, longitude: -74.00597, country: 'United States', admin1: 'New York' },
  { id: 2643743, name: 'London', latitude: 51.50853, longitude: -0.12574, country: 'United Kingdom', admin1: 'England' },
  { id: 1850147, name: 'Tokyo', latitude: 35.6895, longitude: 139.69171, country: 'Japan', admin1: 'Tokyo' },
  { id: 2988507, name: 'Paris', latitude: 48.85341, longitude: 2.3488, country: 'France', admin1: 'Île-de-France' },
  { id: 2147714, name: 'Sydney', latitude: -33.86785, longitude: 151.20732, country: 'Australia', admin1: 'New South Wales' },
  { id: 1275339, name: 'Mumbai', latitude: 19.07283, longitude: 72.88261, country: 'India', admin1: 'Maharashtra' }
];

export default function SearchBar({ onLocationSelect, selectedLocation }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch cities with debouncing
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setError(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            query
          )}&count=8&language=en&format=json`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setResults(data.results);
        } else {
          setResults([]);
          setError('No locations found matching your search.');
        }
      } catch (err) {
        console.error(err);
        setError('Unable to search locations. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (loc: Location) => {
    onLocationSelect(loc);
    setQuery('');
    setResults([]);
    setShowDropdown(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setError(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4" id="weather-search-container">
      <div className="relative" ref={dropdownRef}>
        <div className="relative flex items-center bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl shadow-sm focus-within:shadow-md focus-within:ring-2 focus-within:ring-cyan-500/30 focus-within:border-cyan-500 transition-all duration-300">
          <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
          
          <input
            id="city-search-input"
            type="text"
            className="w-full py-4 pl-12 pr-12 text-slate-100 placeholder-slate-400 bg-transparent rounded-2xl outline-none text-base font-medium"
            placeholder="Search for a city (e.g., Toronto, Paris, Singapore...)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
          />

          {loading && (
            <Loader2 className="absolute right-12 w-5 h-5 text-cyan-400 animate-spin" />
          )}

          {query && (
            <button
              id="clear-search-button"
              type="button"
              onClick={clearSearch}
              className="absolute right-4 p-1 hover:bg-white/10 rounded-full text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        <AnimatePresence>
          {showDropdown && (query.trim().length >= 2 || results.length > 0 || error) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 w-full mt-2 bg-slate-950/95 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto"
              id="search-dropdown"
            >
              {error && (
                <div className="p-4 text-center text-sm text-slate-400" id="search-error-msg">
                  {error}
                </div>
              )}

              {!error && results.length === 0 && query.trim().length >= 2 && !loading && (
                <div className="p-4 text-center text-sm text-slate-400">
                  No locations found
                </div>
              )}

              {results.length > 0 && (
                <ul className="divide-y divide-white/5" id="search-results-list">
                  {results.map((loc) => (
                    <li key={loc.id}>
                      <button
                        type="button"
                        onClick={() => handleSelect(loc)}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                      >
                        <MapPin className="w-5 h-5 text-slate-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-200 truncate">
                            {loc.name}
                          </p>
                          <p className="text-xs text-slate-400 truncate">
                            {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-400 font-mono">
                            {loc.latitude.toFixed(2)}°, {loc.longitude.toFixed(2)}°
                          </span>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Popular Cities Pills */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 px-1" id="popular-cities-pills">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5" /> Popular Cities:
        </span>
        <div className="flex flex-wrap gap-2">
          {POPULAR_CITIES.map((city) => (
            <button
              key={city.id}
              type="button"
              onClick={() => onLocationSelect(city)}
              className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all duration-200 ${
                selectedLocation?.name === city.name
                  ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25 ring-2 ring-cyan-500/20'
                  : 'bg-white/5 text-slate-300 border border-white/10 backdrop-blur-md hover:bg-white/10 hover:border-white/20'
              }`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
