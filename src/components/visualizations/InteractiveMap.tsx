import { useEffect, useState } from 'react';
import { MapPin, Compass, Landmark, Utensils, CalendarDays, Sparkles, Loader2 } from 'lucide-react';
import { INDIA_STATES_PATHS, STATE_NAMES, STATE_TO_REGION } from '../../data/indiaMapData';
import { mapRegionsData as fallbackRegions } from '../../data/fallbackData';

interface RegionData {
  id: string;
  name: string;
  culture: string;
  attractions: string[];
  festivals: string[];
  cuisine: string[];
  fact: string;
  image: string;
}

export default function InteractiveMap() {
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<RegionData | null>(null);
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [hoveredStateName, setHoveredStateName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/map');
        if (!res.ok) throw new Error('API offline');
        const json = await res.json();
        setRegions(json);
        setSelectedRegion(json[0] || null);
      } catch (err) {
        console.warn('API error, using local map regions fallback:', err);
        setRegions(fallbackRegions);
        setSelectedRegion(fallbackRegions[0] || null);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  // Map region ID to colors (saffron, green, gold, rose, purple, teal)
  const getRegionColor = (regionId: string, opacity: number) => {
    switch (regionId) {
      case 'north': return `rgba(255, 153, 51, ${opacity})`; // Saffron
      case 'south': return `rgba(0, 128, 0, ${opacity})`; // Green
      case 'west': return `rgba(212, 163, 71, ${opacity})`; // Gold
      case 'east': return `rgba(244, 63, 94, ${opacity})`; // Rose
      case 'central': return `rgba(168, 85, 247, ${opacity})`; // Purple
      case 'northeast': return `rgba(20, 184, 166, ${opacity})`; // Teal
      default: return `rgba(255, 255, 255, ${opacity})`;
    }
  };

  const getRegionName = (regionId: string) => {
    switch (regionId) {
      case 'north': return 'Northern Frontier';
      case 'south': return 'Southern Peninsula';
      case 'west': return 'Western Sands';
      case 'east': return 'Eastern Delta';
      case 'central': return 'Central Heartland';
      case 'northeast': return 'Northeastern Hills';
      default: return '';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
      {/* Map Column (Left) */}
      <div className="lg:col-span-6 flex justify-center items-center relative glassmorphism rounded-2xl p-6 h-[420px] md:h-[520px]">
        {/* Glow behind map */}
        <div className="absolute w-72 h-72 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />
        
        {loading ? (
          <div className="flex flex-col justify-center items-center gap-4 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
            <span className="text-xs tracking-widest font-mono">Loading Political Map Data...</span>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col justify-between relative">
            <svg 
              viewBox="-110 -60 610 690" 
              className="w-full h-full max-h-[440px] relative z-10"
            >
              {/* Geographically accurate paths for all 37 subdivisions */}
              {Object.entries(INDIA_STATES_PATHS).map(([code, pathD]) => {
                const regionId = STATE_TO_REGION[code];
                const isSelected = selectedRegion?.id === regionId;
                const isHovered = hoveredRegion === regionId;
                
                const fillVal = isSelected 
                  ? getRegionColor(regionId, 0.2) 
                  : isHovered 
                    ? getRegionColor(regionId, 0.1) 
                    : 'rgba(255, 255, 255, 0.03)';
                    
                const strokeVal = isSelected 
                  ? getRegionColor(regionId, 0.7) 
                  : isHovered 
                    ? getRegionColor(regionId, 0.4) 
                    : 'rgba(255, 255, 255, 0.15)';
                
                return (
                  <path
                    key={code}
                    d={pathD}
                    fill={fillVal}
                    stroke={strokeVal}
                    strokeWidth={isSelected ? 1.6 : isHovered ? 1.0 : 0.6}
                    className="transition-all duration-300 cursor-pointer hover:opacity-90"
                    onClick={() => {
                      const matched = regions.find(r => r.id === regionId);
                      if (matched) setSelectedRegion(matched);
                    }}
                    onMouseEnter={() => {
                      setHoveredRegion(regionId);
                      setHoveredStateName(STATE_NAMES[code] || null);
                    }}
                    onMouseLeave={() => {
                      setHoveredRegion(null);
                      setHoveredStateName(null);
                    }}
                  />
                );
              })}
            </svg>

            {/* Custom SVG Tooltip Overlay */}
            {hoveredRegion && hoveredStateName && (
              <div className="absolute top-2 left-2 bg-gray-950/90 border border-white/10 px-3 py-1.5 rounded-lg backdrop-blur-md text-[10px] pointer-events-none z-20">
                <p className="font-bold text-white">{hoveredStateName}</p>
                <p className="font-mono text-gold-400 font-medium tracking-wide uppercase mt-0.5">{getRegionName(hoveredRegion)}</p>
              </div>
            )}
          </div>
        )}

        {/* Dynamic Help Text */}
        <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-gray-500 pointer-events-none">
          <span className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} /> 
            Hover & Click states to discover culture
          </span>
          <span className="font-mono text-[10px]">India Vector Map</span>
        </div>
      </div>

      {/* Info Card Panel (Right) */}
      <div className="lg:col-span-6 flex flex-col h-[520px]">
        {selectedRegion && (
          <div className="flex-1 glassmorphism rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-white/10 transition-all duration-500 transform hover:scale-[1.01]">
            {/* Cover image of region */}
            <div className="h-48 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent z-10" />
              <img 
                src={selectedRegion.image} 
                alt={selectedRegion.name}
                className="w-full h-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-700"
              />
              {/* Saffron & Green Accent Lines */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-saffron via-white to-ashoka z-20" />
              <div className="absolute top-4 left-4 glassmorphism px-3 py-1 rounded-full flex items-center gap-1.5 z-20">
                <MapPin className="w-3.5 h-3.5 text-saffron" />
                <span className="text-[10px] tracking-widest uppercase font-display font-semibold text-white">Region Highlight</span>
              </div>
            </div>

            {/* Details Content */}
            <div 
              className="p-6 md:p-8 flex-1 flex flex-col justify-between overflow-y-auto overscroll-contain"
              data-lenis-prevent
            >
              <div>
                <h3 className="font-serif text-2xl text-gold-300 font-bold mb-2 tracking-wide text-glow-gold">
                  {selectedRegion.name}
                </h3>
                
                {/* Culture Description */}
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans mb-6">
                  {selectedRegion.culture}
                </p>

                {/* Grid of Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Attractions */}
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-display text-saffron font-bold mb-2.5 flex items-center gap-1.5">
                      <Landmark className="w-3.5 h-3.5" /> Iconic Wonders
                    </h4>
                    <ul className="text-[11px] text-gray-400 space-y-1.5 list-disc pl-3">
                      {selectedRegion.attractions.map((attraction, i) => (
                        <li key={i}>{attraction}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Festivals */}
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-display text-gold-400 font-bold mb-2.5 flex items-center gap-1.5">
                      <CalendarDays className="w-3.5 h-3.5" /> Major Festivals
                    </h4>
                    <ul className="text-[11px] text-gray-400 space-y-1.5 list-disc pl-3">
                      {selectedRegion.festivals.map((fest, i) => (
                        <li key={i}>{fest}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Cuisine */}
                  <div className="md:col-span-2">
                    <h4 className="text-xs uppercase tracking-widest font-display text-ashoka font-bold mb-2.5 flex items-center gap-1.5">
                      <Utensils className="w-3.5 h-3.5" /> Gastronomic Cuisine
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedRegion.cuisine.map((item, i) => (
                        <span 
                          key={i} 
                          className="text-[10px] bg-white/5 border border-white/10 hover:border-gold-500/30 px-2.5 py-1 rounded-full text-gray-300 font-medium transition-all duration-300 cursor-default"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Fact Callout */}
              <div className="mt-6 pt-4 border-t border-white/5 flex gap-3 items-start">
                <Sparkles className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <p className="text-[11px] italic text-gray-400 leading-snug font-sans">
                  <strong>Did you know?</strong> {selectedRegion.fact}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
