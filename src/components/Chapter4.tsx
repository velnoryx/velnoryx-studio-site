import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Zap, Cpu, Sparkles, Building, Rocket, Loader2 } from 'lucide-react';
import { statsData as fallbackStats } from '../data/fallbackData';
import ExhibitButton from './ExhibitButton';

const iconMap: Record<string, React.ReactNode> = {
  Smartphone: <Smartphone className="w-6 h-6 text-saffron" />,
  Rocket: <Rocket className="w-6 h-6 text-gold-400" />,
  Zap: <Zap className="w-6 h-6 text-ashoka" />,
  Sparkles: <Sparkles className="w-6 h-6 text-saffron" />,
  Cpu: <Cpu className="w-6 h-6 text-gold-400" />,
  Building: <Building className="w-6 h-6 text-ashoka" />
};

interface Chapter4Props {
  onOpenExhibit?: () => void;
}

export default function Chapter4({ onOpenExhibit }: Chapter4Props) {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/stats');
        if (!res.ok) throw new Error('API offline');
        const json = await res.json();
        setStats(json);
      } catch (err) {
        console.warn('API error, using local fallback statistics:', err);
        setStats(fallbackStats);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1
      }
    }
  } as const;

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 12
      }
    }
  } as const;

  return (
    <div className="py-24 max-w-6xl mx-auto px-6 relative overflow-hidden">
      {/* Abstract background elements */}
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-saffron/5 blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 rounded-full bg-ashoka/5 blur-3xl" />

      {/* Chapter header */}
      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs tracking-widest font-display text-ashoka uppercase font-bold px-3 py-1 glassmorphism rounded-full"
        >
          Chapter IV
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-4xl md:text-5xl text-gold-200 mt-4 mb-6 tracking-wide text-glow-gold"
        >
          Modern Digital India
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm md:text-base text-gray-400 leading-relaxed font-sans"
        >
          Watch an ancient land leapfrog centuries of development in a single generation. India has built a digital public infrastructure that powers the fastest-growing major economy.
        </motion.p>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col justify-center items-center gap-4 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
          <span className="text-xs tracking-widest font-mono">Retrieving Live Indicators...</span>
        </div>
      ) : (
        /* Stats Grid */
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10"
        >
          {stats.map((item, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className={`glassmorphism rounded-2xl p-8 border flex flex-col justify-between transition-all duration-300 ${item.color} group cursor-default`}
            >
              <div>
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] uppercase tracking-widest font-display font-bold text-gray-500 group-hover:text-white transition-colors">
                    {item.title}
                  </span>
                  <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl group-hover:bg-white/10 transition-colors">
                    {iconMap[item.icon] || <Sparkles className="w-6 h-6 text-gold-400" />}
                  </div>
                </div>

                {/* Big Stat Count */}
                <h3 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight mb-2 group-hover:scale-105 transform origin-left transition-transform duration-300">
                  {item.stat}
                </h3>
                <p className="text-xs uppercase tracking-wide font-display text-gold-400 font-semibold mb-4">
                  {item.metric}
                </p>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-400 leading-relaxed font-sans mt-2">
                {item.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
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
