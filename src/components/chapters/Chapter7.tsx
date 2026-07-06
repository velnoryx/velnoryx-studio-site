import { useEffect, useRef, useState } from 'react';
import { motion, useInView, animate } from 'framer-motion';
import { TrendingUp, Landmark, DollarSign, Award, Loader2 } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { economyData as fallbackEconomy } from '../../data/fallbackData';
import ExhibitButton from '../common/ExhibitButton';

// Animated Count-Up Component
function CountUpNumber({ value, suffix = '', decimals = 0 }: { value: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  useEffect(() => {
    if (!inView) return;
    
    const node = ref.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration: 2.2,
      ease: [0.16, 1, 0.3, 1], // Premium ease-out
      onUpdate(current) {
        node.textContent = current.toFixed(decimals) + suffix;
      }
    });

    return () => controls.stop();
  }, [value, suffix, decimals, inView]);

  return <span ref={ref} className="font-display font-extrabold text-white text-3xl md:text-4xl tracking-tight">0</span>;
}

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/90 border border-white/10 p-3.5 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-[10px] uppercase tracking-wider font-mono text-gray-500 font-bold mb-1.5">{label}</p>
        {payload.map((item: any, i: number) => (
          <p key={i} className="text-xs font-semibold" style={{ color: item.color || '#d4a347' }}>
            {item.name}: {item.value}{item.unit || ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface Chapter7Props {
  onOpenExhibit?: () => void;
}

export default function Chapter7({ onOpenExhibit }: Chapter7Props) {
  const [economy, setEconomy] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEconomy = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/economy');
        if (!res.ok) throw new Error('API offline');
        const json = await res.json();
        setEconomy(json);
      } catch (err) {
        console.warn('API error, using local economy data fallback:', err);
        setEconomy(fallbackEconomy);
      } finally {
        setLoading(false);
      }
    };

    fetchEconomy();
  }, []);

  return (
    <div className="py-24 px-6 max-w-6xl mx-auto">
      {/* Chapter header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs tracking-widest font-display text-saffron uppercase font-bold px-3 py-1 glassmorphism rounded-full"
        >
          Chapter VII
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-4xl md:text-5xl text-gold-200 mt-4 mb-6 tracking-wide text-glow-gold"
        >
          Economy & Innovation
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm md:text-base text-gray-400 leading-relaxed font-sans"
        >
          Propelled by digital efficiency and manufacturing capacity, India is the fastest-growing major economy, steering the global financial landscape.
        </motion.p>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col justify-center items-center gap-4 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
          <span className="text-xs tracking-widest font-mono">Retrieving Financial Indicators...</span>
        </div>
      ) : (
        /* Grid Dashboard */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: GDP Growth */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="glassmorphism rounded-2xl p-6 md:p-8 border border-white/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-display uppercase tracking-widest text-gray-400 font-semibold">GDP Growth Rate</span>
                <TrendingUp className="w-5 h-5 text-saffron" />
              </div>
              <div className="mb-6">
                <CountUpNumber value={economy.gdpGrowth.rate} suffix="%" decimals={1} />
                <p className="text-xs text-gray-500 font-display mt-1">{economy.gdpGrowth.description}</p>
              </div>
            </div>
            
            {/* Recharts GDP Line Chart */}
            <div className="h-36 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={economy.gdpGrowth.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.05)', strokeWidth: 1 }} />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    name="GDP Growth"
                    unit="%"
                    stroke="#ff9933" 
                    strokeWidth={2.5}
                    dot={{ fill: '#ff9933', r: 3 }}
                    activeDot={{ r: 5, stroke: '#ffffff', strokeWidth: 1 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Card 2: Startups & Unicorns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="glassmorphism rounded-2xl p-6 md:p-8 border border-white/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-display uppercase tracking-widest text-gray-400 font-semibold">Startup Unicorns</span>
                <Award className="w-5 h-5 text-gold-400" />
              </div>
              <div className="mb-6">
                <CountUpNumber value={economy.unicorns.count} />
                <p className="text-xs text-gray-500 font-display mt-1">{economy.unicorns.description}</p>
              </div>
            </div>
            
            {/* Recharts Startup Unicorn Bar Chart */}
            <div className="h-36 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={economy.unicorns.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="value" 
                    name="Unicorns count"
                    fill="rgba(212, 163, 71, 0.4)" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  />
                  <Bar 
                    dataKey="secondaryValue" 
                    name="Funding ($B)"
                    fill="#d4a347" 
                    radius={[4, 4, 0, 0]}
                    maxBarSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Card 3: Digital Payments (UPI Volume) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="glassmorphism rounded-2xl p-6 md:p-8 border border-white/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-display uppercase tracking-widest text-gray-400 font-semibold">Monthly UPI Volume</span>
                <Landmark className="w-5 h-5 text-ashoka" />
              </div>
              <div className="mb-6">
                <CountUpNumber value={economy.upiVolume.volume} suffix=" Billion" decimals={1} />
                <p className="text-xs text-gray-500 font-display mt-1">{economy.upiVolume.description}</p>
              </div>
            </div>
            
            {/* Recharts UPI Area Chart */}
            <div className="h-36 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={economy.upiVolume.chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorUpi" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#008000" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#008000" stopOpacity={0.01}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="label" stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    name="Transactions"
                    unit="B"
                    stroke="#008000" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorUpi)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Card 4: Exports & Manufacturing */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="glassmorphism rounded-2xl p-6 md:p-8 border border-white/5 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-display uppercase tracking-widest text-gray-400 font-semibold">Annual Exports</span>
                <DollarSign className="w-5 h-5 text-saffron" />
              </div>
              <div className="mb-6">
                <CountUpNumber value={economy.exports.total} suffix=" Billion" />
                <p className="text-xs text-gray-500 font-display mt-1">{economy.exports.description}</p>
              </div>
            </div>
            {/* Dual visual bars */}
            <div className="h-36 w-full mt-2 flex flex-col justify-center gap-4">
              {economy.exports.categories.map((cat: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                    <span>{cat.name}</span>
                    <span className="text-white font-semibold">${cat.value}B ({cat.percentage}%)</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full ${i === 0 ? 'bg-saffron' : 'bg-ashoka'}`} 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${cat.percentage}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

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
