import { motion } from 'framer-motion';
import { Compass, CalendarDays, Plane } from 'lucide-react';

interface OutroProps {
  scrollToSection: (index: number) => void;
}

export default function Outro({ scrollToSection }: OutroProps) {
  return (
    <section className="h-screen w-full flex flex-col justify-center items-center text-center px-6 relative bg-transparent z-20">
      
      {/* Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-gold-500/5 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Saffron White Green Accent Line */}
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: 120 }}
          viewport={{ once: false }}
          transition={{ duration: 1.2 }}
          className="h-[3px] bg-gradient-to-r from-saffron via-white to-ashoka rounded-full mb-8"
        />

        {/* Primary Slogans */}
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
          className="font-serif text-3xl md:text-5xl font-bold tracking-wide text-white leading-tight mb-4"
        >
          One Nation. Thousands of Traditions. <br />
          <span className="text-glow-gold text-gold-300 font-extrabold">Endless Possibilities.</span>
        </motion.h2>

        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="font-serif text-4xl md:text-6xl font-black text-transparent bg-gradient-to-r from-saffron via-white to-ashoka bg-clip-text tracking-widest text-glow mb-12 uppercase"
        >
          India Inspires the World
        </motion.h1>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full max-w-lg"
        >
          {/* Action 1: Re-Explore */}
          <button
            onClick={() => scrollToSection(1)} // Scroll to Chapter 1
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-display font-bold text-xs uppercase tracking-widest bg-white text-gray-950 hover:bg-gold-200 transition-colors flex items-center justify-center gap-2 group shadow-xl"
          >
            <Compass className="w-4 h-4 text-gray-950 group-hover:rotate-45 transition-transform duration-500" />
            Explore History
          </button>

          {/* Action 2: Events */}
          <button
            onClick={() => scrollToSection(8)} // Scroll to Events Timeline
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-display font-bold text-xs uppercase tracking-widest glassmorphism hover:bg-white/10 text-white transition-colors flex items-center justify-center gap-2 border border-white/10"
          >
            <CalendarDays className="w-4 h-4 text-saffron" />
            Upcoming Events
          </button>

          {/* Action 3: Visit India */}
          <a
            href="https://www.incredibleindia.org"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full font-display font-bold text-xs uppercase tracking-widest glassmorphism hover:bg-white/10 text-white transition-colors flex items-center justify-center gap-2 border border-white/10"
          >
            <Plane className="w-4 h-4 text-ashoka" />
            Visit India
          </a>
        </motion.div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-[9px] uppercase tracking-widest font-mono text-gray-600 flex items-center gap-2">
        <span>© 2026 India on the World Stage • Designed with Pride</span>
        <span>•</span>
        <a href="#admin" className="hover:text-gold-400 underline transition-colors cursor-pointer">CMS Admin Dashboard</a>
      </div>
    </section>
  );
}
