import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Rocket, Moon, Sun, Orbit, Globe2 } from 'lucide-react';
import ExhibitButton from './ExhibitButton';

interface SpaceMilestone {
  title: string;
  mission: string;
  date: string;
  description: string;
  icon: React.ReactNode;
}

const milestones: SpaceMilestone[] = [
  {
    title: 'Chandrayaan-3',
    mission: 'Lunar South Pole Landing',
    date: 'August 2023',
    description: 'India became the first nation to successfully soft-land a spacecraft near the uncharted lunar South Pole, confirming the presence of water ice.',
    icon: <Moon className="w-5 h-5 text-sky-300" />
  },
  {
    title: 'Mangalyaan (MOM)',
    mission: 'Mars Orbiter Mission',
    date: 'September 2014',
    description: 'India achieved orbit around Mars on its very first attempt, doing so at a fraction of the cost of other space agencies, cementing its engineering efficiency.',
    icon: <Globe2 className="w-5 h-5 text-orange-400" />
  },
  {
    title: 'Aditya-L1',
    mission: 'Solar Observatory',
    date: 'September 2023',
    description: 'India\'s first space-based observatory placed in a halo orbit around the Sun-Earth L1 Lagrange point to study solar winds and corona dynamics.',
    icon: <Sun className="w-5 h-5 text-yellow-400" />
  },
  {
    title: 'Gaganyaan',
    mission: 'Human Spaceflight',
    date: 'Upcoming',
    description: 'An ambitious project designed to demonstrate human spaceflight capability, sending a 3-member crew into a 400 km low earth orbit for a 3-day mission.',
    icon: <Orbit className="w-5 h-5 text-emerald-400" />
  }
];

interface Chapter5Props {
  onOpenExhibit?: () => void;
}

export default function Chapter5({ onOpenExhibit }: Chapter5Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track scroll inside this specific chapter to drive the rocket launch
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  });

  // Animate rocket upward based on scroll
  const rocketY = useTransform(scrollYProgress, [0.1, 0.9], [300, -300]);
  const rocketScale = useTransform(scrollYProgress, [0.1, 0.4, 0.9], [0.8, 1, 0.6]);
  const flameOpacity = useTransform(scrollYProgress, [0.15, 0.85], [1, 0]);

  return (
    <div 
      ref={containerRef}
      className="py-24 px-6 relative bg-gray-950 overflow-hidden min-h-[90vh]"
    >
      {/* Stars Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-10 left-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '3s' }} />
      <div className="absolute top-48 right-1/4 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-24 left-1/3 w-1.5 h-1.5 bg-gold-400 rounded-full animate-pulse" />
      <div className="absolute bottom-40 right-1/3 w-1 h-1 bg-white rounded-full animate-ping" style={{ animationDuration: '5s' }} />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column - Rocket Launch Simulator */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center relative min-h-[450px] glassmorphism rounded-3xl p-6 border border-white/5 bg-gradient-to-b from-gray-950/20 to-sky-950/10">
          
          {/* Orbital path illustration in background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <svg viewBox="0 0 200 200" className="w-64 h-64 stroke-white fill-none" strokeWidth="0.5">
              <circle cx="100" cy="100" r="80" />
              <ellipse cx="100" cy="100" rx="95" ry="40" strokeDasharray="3 3" />
              <circle cx="100" cy="100" r="15" className="fill-blue-500" />
            </svg>
          </div>

          {/* Rocket Container */}
          <motion.div 
            style={{ y: rocketY, scale: rocketScale }}
            className="relative flex flex-col items-center justify-center z-20"
          >
            {/* Rocket Icon */}
            <div className="relative text-white z-10 filter drop-shadow-[0_0_15px_rgba(212,163,71,0.5)]">
              <Rocket className="w-16 h-16 transform -rotate-45" />
            </div>

            {/* Fire flame trail */}
            <motion.div 
              style={{ opacity: flameOpacity }}
              className="absolute top-[80%] w-4 h-24 bg-gradient-to-b from-saffron via-orange-600 to-transparent rounded-full blur-[2px] animate-pulse" 
            />
          </motion.div>

          {/* Earth Grid Indicator */}
          <div className="absolute bottom-6 flex flex-col items-center gap-1 opacity-40">
            <span className="text-[9px] uppercase tracking-widest font-mono text-gray-500">Satish Dhawan Space Centre</span>
            <span className="text-[8px] font-mono text-saffron">Sriharikota, India</span>
          </div>
        </div>

        {/* Right Column - Milestones List */}
        <div className="lg:col-span-8">
          <div className="mb-12">
            <motion.span 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs tracking-widest font-display text-saffron uppercase font-bold px-3 py-1 glassmorphism rounded-full"
            >
              Chapter V
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl md:text-5xl text-gold-200 mt-4 mb-6 tracking-wide text-glow-gold"
            >
              Space Exploration & Science
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-sm text-gray-400 leading-relaxed font-sans"
            >
              From transporting rocket parts on bicycles in 1963, to landing on the lunar South Pole, the Indian Space Research Organisation (ISRO) has emerged as a powerhouse of cost-efficient space technology.
            </motion.p>
          </div>

          {/* Milestone Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {milestones.map((milestone, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="glassmorphism-card rounded-2xl p-6 border border-white/5 flex gap-4 items-start"
              >
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  {milestone.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="font-serif text-base font-bold text-white">
                      {milestone.title}
                    </h3>
                    <span className="text-[8px] uppercase tracking-wider bg-white/10 text-gold-400 px-1.5 py-0.5 rounded font-mono font-bold">
                      {milestone.date}
                    </span>
                  </div>
                  <h4 className="text-[10px] uppercase font-display tracking-widest text-saffron font-bold mb-2">
                    {milestone.mission}
                  </h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                    {milestone.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Discovery Exhibit Button */}
          {onOpenExhibit && (
            <div className="flex justify-start mt-8">
              <ExhibitButton onClick={onOpenExhibit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
