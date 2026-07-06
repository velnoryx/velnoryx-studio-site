import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { ChevronDown, Mouse, ArrowRight } from 'lucide-react';

interface IntroProps {
  onExplore?: () => void;
  onScrollToChapter1?: () => void;
}

// ─── Floating scroll cue (no bouncing loop — avoids conflicting RAF) ──────────
const ScrollCue = ({ onClick }: { onClick?: () => void }) => (
  <motion.button
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 1, delay: 2.6, ease: 'easeOut' }}
    onClick={onClick}
    aria-label="Scroll to explore"
    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 cursor-pointer pointer-events-auto focus:outline-none"
  >
    {/* Subtle breathing ring */}
    <motion.div
      animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      className="w-10 h-10 rounded-full border border-gold-400/40 flex items-center justify-center"
    >
      <Mouse className="w-4 h-4 text-gold-400" />
    </motion.div>
    <motion.div
      animate={{ y: [0, 5, 0], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
    >
      <ChevronDown className="w-4 h-4 text-gold-400/60" />
    </motion.div>
  </motion.button>
);

const ScrollToContinueCue = ({ onClick }: { onClick?: () => void }) => (
  <motion.button
    onClick={onClick}
    aria-label="Scroll to continue"
    className="flex flex-col items-center gap-1 cursor-pointer pointer-events-auto focus:outline-none"
  >
    <span className="text-[10px] uppercase tracking-widest text-gold-400/70 font-display font-bold">
      Scroll to Begin Chapter I
    </span>
    <motion.div
      animate={{ y: [0, 5, 0], opacity: [0.4, 0.8, 0.4] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <ChevronDown className="w-4 h-4 text-gold-400/70" />
    </motion.div>
  </motion.button>
);

const stats = [
  { value: '5000+', label: 'Years of Civilization' },
  { value: '1.4B+', label: 'Population' },
  { value: '43',    label: 'UNESCO Heritage Sites' },
  { value: '4th',   label: 'Largest Economy' },
];

export default function Intro({ onExplore, onScrollToChapter1 }: IntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // If loader is not present, reveal immediately
    if (!document.getElementById('velnoryx-loader')) {
      setIsLoaded(true);
      return;
    }

    const handleFinished = () => {
      setIsLoaded(true);
    };

    document.addEventListener('loaderFinished', handleFinished);

    // Safety timeout in case loader is stuck or event missed
    const safetyTimeout = setTimeout(() => {
      setIsLoaded(true);
    }, 8500);

    return () => {
      document.removeEventListener('loaderFinished', handleFinished);
      clearTimeout(safetyTimeout);
    };
  }, []);

  // ── Scroll progress scoped to this container ──────────────────────────────
  // [start start → end start] = 0 when top of container hits viewport top,
  //                              1 when bottom of container hits viewport top.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Smooth the raw scroll progress so micro-jitter disappears at the CSS layer.
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 90, damping: 25, mass: 0.5 });

  // ── Hero text: fades out and drifts up in the first 45% of the intro track ──
  const heroOpacity  = useTransform(smoothProgress, [0, 0.35, 0.55], [1, 0.6, 0]);
  const heroY        = useTransform(smoothProgress, [0, 0.55], [0, -60]);

  // ── "A civilization…" second screen: fades IN as hero fades OUT ───────────
  const civOpacity   = useTransform(smoothProgress, [0.4, 0.5, 0.8, 0.95], [0, 1, 1, 0]);
  const civY         = useTransform(smoothProgress, [0.4, 0.5], [40, 0]);
  const civScale     = useTransform(smoothProgress, [0.4, 0.5], [0.97, 1]);

  // ── Scroll cue fades away as soon as user scrolls a tiny bit ─────────────
  const cueOpacity   = useTransform(scrollYProgress, [0, 0.05], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full z-20">
      {/* ── First Screen: 5000 Years ────────────────────────────────────────── */}
      <section
        className="h-[100dvh] w-full flex flex-col justify-center items-center px-4 sm:px-6 relative pt-20 z-10 pointer-events-none sticky top-0"
      >
        {/* Hero content — driven purely by scroll */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          className="max-w-xl md:max-w-4xl flex flex-col items-center text-center pointer-events-auto will-change-transform mt-4 md:mt-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={isLoaded ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-wide text-white text-glow mb-4 leading-tight"
          >
            For over 5,000 years...
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={isLoaded ? { opacity: 0.8, scaleX: 1 } : {}}
            transition={{ duration: 0.9, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="w-16 md:w-24 h-[2px] bg-gradient-to-r from-saffron via-gold-400 to-ashoka rounded-full my-4 md:my-6 origin-left"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 1.2 }}
            className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-2xl leading-relaxed font-sans mb-6 md:mb-10"
          >
            From the world's oldest civilizations to cutting-edge space exploration, discover how
            India has shaped history, inspired cultures, and continues to influence the global future
            through innovation, diversity, and resilience.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 mb-8 md:mb-16"
          >
            <button
              onClick={onExplore}
              className="group relative px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-700 rounded-full font-display font-medium text-white overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(212,163,71,0.5)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore the Journey <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-full" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isLoaded ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-4xl mx-auto"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 2 + idx * 0.12 }}
                className="glassmorphism-card p-5 rounded-2xl flex flex-col items-center justify-center border border-white/5 bg-gray-900/30 backdrop-blur-md"
              >
                <h3 className="font-serif text-3xl md:text-4xl text-gold-400 mb-1 font-bold">{stat.value}</h3>
                <p className="text-xs md:text-sm text-gray-400 font-sans uppercase tracking-wider text-center">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div style={{ opacity: cueOpacity }} className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
          <ScrollCue onClick={onExplore} />
        </motion.div>
      </section>

      {/* ── Scroll track spacer — 100vh below the sticky first screen ────────
           The "A civilization…" screen slides up from this region. */}
      <div className="relative" style={{ height: '100vh' }}>
        {/* Second screen peeks in as a parallax overlay */}
        <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center text-center px-6 pointer-events-none z-10">
          {/* Background dark overlay and blur that fades in with scroll */}
          <motion.div 
            style={{ opacity: civOpacity }}
            className="absolute inset-0 bg-gray-950/65 backdrop-blur-[6px] pointer-events-none z-0"
          />

          <motion.div
            style={{ opacity: civOpacity, y: civY, scale: civScale }}
            className="max-w-4xl mx-auto flex flex-col items-center will-change-transform z-10"
          >
            <motion.h2
              className="font-serif text-4xl md:text-6xl font-bold tracking-wide text-white text-glow-gold leading-tight"
            >
              A civilization that continues <br />
              to inspire the world.
            </motion.h2>
            <motion.div
              className="w-16 h-[2px] bg-gradient-to-r from-saffron to-ashoka rounded-full my-6"
            />
            <motion.p
              className="text-xs md:text-sm text-gray-200 max-w-xl leading-relaxed font-sans"
            >
              From the Indus banks to the heights of orbit, experience India's voice, vision, and growth on the global stage.
            </motion.p>
          </motion.div>

          {/* Scroll cue for Chapter I */}
          <motion.div
            style={{ opacity: civOpacity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto z-20"
          >
            <ScrollToContinueCue onClick={onScrollToChapter1} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
