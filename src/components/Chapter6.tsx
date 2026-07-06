import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, HeartHandshake, Eye, Loader2 } from 'lucide-react';
import { globalData as fallbackGlobal } from '../data/fallbackData';
import ExhibitButton from './ExhibitButton';

interface Route {
  name: string;
  x: number;
  y: number;
  label: string;
}

const routes: Route[] = [
  { name: 'USA', x: 90, y: 100, label: 'United States' },
  { name: 'Canada', x: 80, y: 70, label: 'Canada' },
  { name: 'Europe', x: 270, y: 90, label: 'Europe (EU)' },
  { name: 'Middle East', x: 330, y: 135, label: 'Middle East' },
  { name: 'Africa', x: 300, y: 195, label: 'Africa' },
  { name: 'Southeast Asia', x: 425, y: 175, label: 'ASEAN' },
  { name: 'Australia', x: 485, y: 235, label: 'Australia' },
  { name: 'Japan', x: 475, y: 105, label: 'Japan' },
  { name: 'South Korea', x: 450, y: 112, label: 'South Korea' }
];

interface Chapter6Props {
  onOpenExhibit?: () => void;
}

export default function Chapter6({ onOpenExhibit }: Chapter6Props) {
  const [global, setGlobal] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredRoute, setHoveredRoute] = useState<Route | null>(null);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  // India coordinates
  const hubX = 380;
  const hubY = 155;

  useEffect(() => {
    const fetchGlobalData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/global');
        if (!res.ok) throw new Error('API offline');
        const json = await res.json();
        setGlobal(json);
      } catch (err) {
        console.warn('API error, using local global data fallback:', err);
        setGlobal(fallbackGlobal);
      } finally {
        setLoading(false);
      }
    };

    fetchGlobalData();
  }, []);

  // Sequentially animate routes automatically in the background
  useEffect(() => {
    if (!global) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % global.aspects.length;
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [global]);

  return (
    <div className="py-24 px-6 max-w-6xl mx-auto relative overflow-hidden">
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-ashoka/5 blur-3xl pointer-events-none" />

      {loading ? (
        <div className="h-96 flex flex-col justify-center items-center gap-4 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
          <span className="text-xs tracking-widest font-mono">Loading Global Connectivity Matrix...</span>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Column - World Map Visualization */}
          <div className="lg:col-span-6 flex flex-col justify-center items-center relative glassmorphism rounded-3xl p-6 h-[400px]">
            <h4 className="absolute top-4 left-6 text-[10px] uppercase tracking-widest font-mono text-gray-400 flex items-center gap-1.5 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-saffron animate-pulse" /> Global Connectivity Matrix
            </h4>

            {/* SVG Map Canvas */}
            <svg viewBox="0 0 600 300" className="w-full h-full max-h-[320px] drop-shadow-[0_0_15px_rgba(212,163,71,0.1)]">
              {/* Premium dark-theme continent clusters using high-tech dot grids */}
              
              {/* North America Grid */}
              <g opacity="0.15" fill="#f9fafb">
                <circle cx="60" cy="80" r="2.5" /><circle cx="80" cy="80" r="2.5" /><circle cx="100" cy="80" r="2.5" /><circle cx="120" cy="80" r="2.5" />
                <circle cx="50" cy="100" r="2.5" /><circle cx="70" cy="100" r="2.5" /><circle cx="90" cy="100" r="2.5" /><circle cx="110" cy="100" r="2.5" /><circle cx="130" cy="100" r="2.5" />
                <circle cx="80" cy="120" r="2.5" /><circle cx="100" cy="120" r="2.5" /><circle cx="120" cy="120" r="2.5" />
              </g>

              {/* South America Grid */}
              <g opacity="0.1" fill="#f9fafb">
                <circle cx="130" cy="180" r="2.5" /><circle cx="150" cy="180" r="2.5" />
                <circle cx="140" cy="200" r="2.5" /><circle cx="160" cy="200" r="2.5" /><circle cx="180" cy="200" r="2.5" />
                <circle cx="150" cy="220" r="2.5" /><circle cx="170" cy="220" r="2.5" />
                <circle cx="160" cy="240" r="2.5" />
              </g>

              {/* Europe Grid */}
              <g opacity="0.15" fill="#f9fafb">
                <circle cx="240" cy="70" r="2.5" /><circle cx="260" cy="70" r="2.5" /><circle cx="280" cy="70" r="2.5" />
                <circle cx="250" cy="90" r="2.5" /><circle cx="270" cy="90" r="2.5" /><circle cx="290" cy="90" r="2.5" /><circle cx="310" cy="90" r="2.5" />
                <circle cx="260" cy="110" r="2.5" /><circle cx="280" cy="110" r="2.5" />
              </g>

              {/* Africa Grid */}
              <g opacity="0.12" fill="#f9fafb">
                <circle cx="270" cy="160" r="2.5" /><circle cx="290" cy="160" r="2.5" /><circle cx="310" cy="160" r="2.5" />
                <circle cx="280" cy="180" r="2.5" /><circle cx="300" cy="180" r="2.5" /><circle cx="320" cy="180" r="2.5" /><circle cx="340" cy="180" r="2.5" />
                <circle cx="290" cy="200" r="2.5" /><circle cx="310" cy="200" r="2.5" /><circle cx="330" cy="200" r="2.5" />
                <circle cx="300" cy="220" r="2.5" /><circle cx="320" cy="220" r="2.5" />
              </g>

              {/* Asia Grid */}
              <g opacity="0.18" fill="#f9fafb">
                <circle cx="360" cy="90" r="2.5" /><circle cx="380" cy="90" r="2.5" /><circle cx="400" cy="90" r="2.5" /><circle cx="420" cy="90" r="2.5" /><circle cx="440" cy="90" r="2.5" />
                <circle cx="350" cy="110" r="2.5" /><circle cx="370" cy="110" r="2.5" /><circle cx="390" cy="110" r="2.5" /><circle cx="410" cy="110" r="2.5" /><circle cx="430" cy="110" r="2.5" /><circle cx="450" cy="110" r="2.5" />
                <circle cx="360" cy="130" r="2.5" /><circle cx="400" cy="130" r="2.5" /><circle cx="420" cy="130" r="2.5" /><circle cx="440" cy="130" r="2.5" />
                <circle cx="390" cy="150" r="2.5" /><circle cx="410" cy="150" r="2.5" /><circle cx="430" cy="150" r="2.5" />
                <circle cx="420" cy="170" r="2.5" /><circle cx="440" cy="170" r="2.5" />
              </g>

              {/* Australia Grid */}
              <g opacity="0.12" fill="#f9fafb">
                <circle cx="470" cy="210" r="2.5" /><circle cx="490" cy="210" r="2.5" /><circle cx="510" cy="210" r="2.5" />
                <circle cx="480" cy="230" r="2.5" /><circle cx="500" cy="230" r="2.5" /><circle cx="520" cy="230" r="2.5" />
                <circle cx="490" cy="250" r="2.5" /><circle cx="510" cy="250" r="2.5" />
              </g>

              {/* India highlighted shape overlay */}
              <path 
                d="M 370 148 L 385 142 L 392 153 L 388 165 L 378 168 L 374 158 Z" 
                fill="rgba(255, 153, 51, 0.12)" 
                stroke="rgba(255, 153, 51, 0.3)" 
                strokeWidth="1"
              />

              {/* India Hub Indicator (Pulse & Ring) */}
              <circle cx={hubX} cy={hubY} r="14" fill="rgba(255, 153, 51, 0.15)" />
              <circle cx={hubX} cy={hubY} r="7" fill="rgba(0, 128, 0, 0.25)" className="animate-ping" style={{ animationDuration: '3.5s' }} />
              <circle cx={hubX} cy={hubY} r="4.5" fill="#ff9933" />
              <text x={hubX} y={hubY + 20} textAnchor="middle" fill="#ff9933" fontSize={8} fontWeight="bold" fontFamily="Outfit">INDIA</text>

              {/* Connection Arches */}
              {routes.map((route) => {
                const isHovered = hoveredRoute?.name === route.name;
                const isSystemActive = activeIdx !== null && global.aspects[activeIdx] && (
                  (global.aspects[activeIdx].title.includes('USA') && route.name === 'USA') ||
                  (global.aspects[activeIdx].title.includes('G20') && route.name === 'Middle East') ||
                  (global.aspects[activeIdx].title.includes('Climate') && route.name === 'Europe') ||
                  (global.aspects[activeIdx].title.includes('Peacekeeping') && route.name === 'Africa') ||
                  (global.aspects[activeIdx].title.includes('Alliances') && (route.name === 'Japan' || route.name === 'South Korea'))
                );
                
                const active = isHovered || isSystemActive;
                
                // Draw beautiful quadratic bezier curves pulling upward
                const midX = (hubX + route.x) / 2;
                const midY = (hubY + route.y) / 2 - 35; 
                const pathD = `M ${hubX} ${hubY} Q ${midX} ${midY}, ${route.x} ${route.y}`;

                return (
                  <g key={route.name} className="cursor-pointer" onMouseEnter={() => setHoveredRoute(route)} onMouseLeave={() => setHoveredRoute(null)}>
                    {/* Path background thin line */}
                    <path 
                      d={pathD} 
                      fill="none" 
                      stroke="rgba(255,255,255,0.03)" 
                      strokeWidth="1" 
                    />

                    {/* Glowing Connection Line */}
                    <path 
                      d={pathD} 
                      fill="none" 
                      stroke={active ? '#ff9933' : '#d4a347'} 
                      strokeWidth={active ? 2.5 : 1} 
                      strokeDasharray={active ? '5 5' : '3 6'}
                      className="transition-all duration-500"
                      style={{
                        strokeDashoffset: active ? -60 : 60,
                        animation: 'dash 2s linear infinite',
                        opacity: active ? 1 : 0.25
                      }}
                    />

                    {/* Destination Node */}
                    <circle 
                      cx={route.x} 
                      cy={route.y} 
                      r={active ? 5 : 3} 
                      fill={active ? '#ff9933' : '#ffffff'} 
                      className="transition-all duration-300"
                      opacity={active ? 1 : 0.6}
                    />

                    {/* Label (Fades in on hover) */}
                    {active && (
                      <g>
                        <rect 
                          x={route.x - 35} 
                          y={route.y - 18} 
                          width="70" 
                          height="12" 
                          rx="3" 
                          fill="rgba(3, 7, 18, 0.9)" 
                          stroke="rgba(212, 163, 71, 0.2)"
                          strokeWidth="0.5"
                        />
                        <text
                          x={route.x}
                          y={route.y - 10}
                          textAnchor="middle"
                          fill="#f9fafb"
                          fontSize="7"
                          fontWeight="bold"
                          fontFamily="Outfit"
                        >
                          {route.name}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Keyframes style tag for dashed line animation */}
            <style>{`
              @keyframes dash {
                to {
                  stroke-dashoffset: 0;
                }
              }
            `}</style>
            
            <div className="absolute bottom-4 text-center text-[10px] text-gray-500 font-sans">
              Interact with the routes to check diplomatic and tech linkages
            </div>
          </div>

          {/* Right Column - Leadership Cards */}
          <div className="lg:col-span-6">
            <div className="mb-8">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="text-xs tracking-widest font-display text-gold-400 uppercase font-bold px-3 py-1 glassmorphism rounded-full"
              >
                Chapter VI
              </motion.span>
              <motion.h2 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="font-serif text-4xl md:text-5xl text-gold-200 mt-4 mb-4 tracking-wide text-glow-gold"
              >
                Global Leadership
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-xs md:text-sm text-gray-400 leading-relaxed font-sans"
              >
                Moving away from neutrality to active engagement, India acts as a bridge between competing world powers, leading international climate frameworks and global humanitarian logistics.
              </motion.p>
            </div>

            {/* Interactive list */}
            <div className="flex flex-col gap-4">
              {global.aspects.map((aspect: any, idx: number) => {
                const isItemActive = activeIdx === idx;
                
                let IconComponent = Globe;
                if (aspect.icon === 'Users') IconComponent = Users;
                if (aspect.icon === 'HeartHandshake') IconComponent = HeartHandshake;
                if (aspect.icon === 'Eye') IconComponent = Eye;

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => {
                      setActiveIdx(idx);
                      // Trigger route hover
                      const targetRoute = routes.find(r => aspect.title.includes(r.name) || (aspect.city.includes('Paris') && r.name === 'Europe') || (aspect.city.includes('Nairobi') && r.name === 'Africa') || (aspect.title.includes('G20') && r.name === 'Middle East') || (aspect.title.includes('Alliances') && r.name === 'Japan'));
                      if (targetRoute) setHoveredRoute(targetRoute);
                    }}
                    onMouseLeave={() => setHoveredRoute(null)}
                    className={`p-4 rounded-2xl border transition-all duration-500 flex gap-4 items-start cursor-pointer ${
                      isItemActive 
                        ? 'bg-white/5 border-gold-400/40 translate-x-2' 
                        : 'bg-white/1 border-white/5'
                    }`}
                  >
                    <div className={`p-2.5 rounded-xl transition-colors ${
                      isItemActive ? 'bg-gold-500 text-gray-950 shadow-[0_0_12px_rgba(212,163,71,0.5)]' : 'bg-white/5 text-gold-400'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <h3 className={`text-sm font-serif font-bold transition-colors ${isItemActive ? 'text-gold-300' : 'text-white'}`}>
                          {aspect.title}
                        </h3>
                        <span className="text-[8px] uppercase tracking-widest font-mono text-gray-500 font-bold">
                          {aspect.city}
                        </span>
                      </div>
                      <h4 className="text-[9px] tracking-widest uppercase font-display text-saffron font-bold mb-1.5">
                        {aspect.subtitle}
                      </h4>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                        {aspect.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Discovery Exhibit Button */}
      {onOpenExhibit && (
        <div className="flex justify-center mt-12">
          <ExhibitButton onClick={onOpenExhibit} />
        </div>
      )}
    </div>
  );
}
