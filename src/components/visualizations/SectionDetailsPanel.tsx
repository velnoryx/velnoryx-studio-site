import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Smartphone, Rocket, Calendar, Landmark, Award, BookOpen, Compass, HeartHandshake, Eye, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { sectionsData as fallbackSections } from '../../data/fallbackData';

// Map string icon names to Lucide icon components
const iconMap: Record<string, React.ComponentType<any>> = {
  Globe,
  Smartphone,
  Rocket,
  Calendar,
  Landmark,
  Award,
  BookOpen,
  Compass,
  HeartHandshake,
  Eye,
  Sparkles
};

interface SectionDetailsPanelProps {
  sectionId: string | null;
  onClose: () => void;
}

interface SectionData {
  id: string;
  title: string;
  introduction: string[];
  importance: string;
  historicalContext: string;
  indiasContribution: string;
  interestingFacts: string[];
  keyAchievements: Array<{ title: string; description: string; icon: string }>;
  timeline: Array<{ date: string; event: string; description: string }>;
  gallery: string[];
  learnMore: Array<{ label: string; url: string }>;
}

export default function SectionDetailsPanel({ sectionId, onClose }: SectionDetailsPanelProps) {
  const [data, setData] = useState<SectionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!sectionId) return;

    const fetchSectionDetails = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await fetch(`http://localhost:5000/api/section/${sectionId}`);
        if (!res.ok) throw new Error('Failed to load section');
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.warn('Backend offline, using fallback local data:', err);
        // Fallback to local data
        const local = fallbackSections.find(s => s.id === sectionId);
        if (local) {
          setData(local as any);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSectionDetails();
  }, [sectionId]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <AnimatePresence>
      {sectionId && (
        <>
          {/* Backdrop Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gray-950/80 backdrop-blur-sm z-40 cursor-pointer"
          />

          {/* Sliding Exhibit Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full md:w-[650px] bg-gray-900 border-l border-white/10 z-50 overflow-y-auto overscroll-contain shadow-2xl flex flex-col"
            data-lenis-prevent
          >
            {/* Header Toolbar */}
            <div className="sticky top-0 bg-gray-900/90 backdrop-blur-md border-b border-white/5 p-6 flex justify-between items-center z-10">
              <div>
                <span className="text-[10px] tracking-widest font-display text-gold-400 uppercase font-bold">
                  Digital Museum Exhibit
                </span>
                <h3 className="font-serif text-2xl text-white mt-1">
                  {loading ? 'Opening Exhibit...' : data?.title || 'Exhibit Details'}
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="p-2 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loading && (
              <div className="flex-1 flex flex-col justify-center items-center gap-4 text-gray-400 p-12">
                <div className="w-8 h-8 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs tracking-widest font-mono">Retrieving Artifacts...</span>
              </div>
            )}

            {error && !loading && (
              <div className="flex-1 flex flex-col justify-center items-center gap-4 text-red-400 p-12 text-center">
                <span className="text-sm font-bold">Exhibit is currently unavailable</span>
                <span className="text-xs text-gray-500">Please check your network connection or try again later.</span>
              </div>
            )}

            {!loading && data && (
              <div className="p-6 md:p-8 space-y-10 flex-1">
                {/* Introduction Paragraphs */}
                <div className="space-y-4">
                  {data.introduction.map((para, i) => (
                    <p key={i} className="text-sm md:text-base text-gray-300 leading-relaxed font-sans">
                      {para}
                    </p>
                  ))}
                </div>

                {/* Importance Alert Box */}
                <div className="p-5 rounded-2xl bg-gold-500/5 border border-gold-500/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gold-400" />
                  <h4 className="text-xs font-display font-bold uppercase text-gold-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Why This Matters
                  </h4>
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {data.importance}
                  </p>
                </div>

                {/* Historical Context & Global Impact Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="glassmorphism p-5 rounded-2xl border border-white/5">
                    <h4 className="text-xs font-display font-bold uppercase text-saffron mb-3 flex items-center gap-1.5">
                      <Landmark className="w-4 h-4" /> Historical Context
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      {data.historicalContext}
                    </p>
                  </div>
                  <div className="glassmorphism p-5 rounded-2xl border border-white/5">
                    <h4 className="text-xs font-display font-bold uppercase text-ashoka mb-3 flex items-center gap-1.5">
                      <Globe className="w-4 h-4" /> Global Impact
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed font-sans">
                      {data.indiasContribution}
                    </p>
                  </div>
                </div>

                {/* Achievements Cards */}
                {data.keyAchievements && data.keyAchievements.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-display text-white font-bold mb-4">
                      Key Highlights & Achievements
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {data.keyAchievements.map((item, idx) => {
                        const IconComponent = iconMap[item.icon] || Award;
                        return (
                          <div key={idx} className="p-5 rounded-xl border border-white/5 bg-white/2 hover:border-gold-500/20 transition-all">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-white/5 rounded-lg text-gold-400">
                                <IconComponent className="w-4 h-4" />
                              </div>
                              <h5 className="font-serif font-bold text-white text-sm">
                                {item.title}
                              </h5>
                            </div>
                            <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                              {item.description}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Historical Timeline */}
                {data.timeline && data.timeline.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-display text-white font-bold mb-6">
                      Historical Milestones
                    </h4>
                    <div className="space-y-6 relative border-l border-white/10 pl-5 ml-2.5">
                      {data.timeline.map((mile, idx) => (
                        <div key={idx} className="relative">
                          {/* Bullet marker */}
                          <div className="absolute -left-[26px] top-1 w-2.5 h-2.5 rounded-full bg-gold-400 ring-4 ring-gray-900 border border-white" />
                          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 mb-1">
                            <span className="text-xs font-mono font-bold text-saffron uppercase">
                              {mile.date}
                            </span>
                            <h5 className="font-serif font-bold text-white text-sm">
                              {mile.event}
                            </h5>
                          </div>
                          <p className="text-xs text-gray-400 leading-relaxed font-sans">
                            {mile.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exhibit Photo Gallery */}
                {data.gallery && data.gallery.length > 0 && (
                  <div>
                    <h4 className="text-xs uppercase tracking-widest font-display text-white font-bold mb-4">
                      Exhibit Gallery
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      {data.gallery.map((img, i) => (
                        <div key={i} className="h-32 md:h-40 rounded-xl overflow-hidden border border-white/5 hover:border-gold-500/30 transition-all relative group">
                          <img 
                            src={img} 
                            alt={`Gallery image ${i + 1}`}
                            className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-700 ease-out"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Did You Know? Bullet Facts */}
                {data.interestingFacts && data.interestingFacts.length > 0 && (
                  <div className="p-6 rounded-2xl bg-white/2 border border-white/5">
                    <h4 className="text-xs uppercase tracking-widest font-display text-white font-bold mb-4 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-gold-400" /> Interesting Facts
                    </h4>
                    <ul className="space-y-3.5 pl-1">
                      {data.interestingFacts.map((fact, i) => (
                        <li key={i} className="text-xs text-gray-400 leading-relaxed font-sans flex items-start gap-2.5">
                          <span className="text-gold-400 shrink-0 mt-0.5"><ArrowRight className="w-3.5 h-3.5" /></span>
                          <span>{fact}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* References / Learn More */}
                {data.learnMore && data.learnMore.length > 0 && (
                  <div className="pt-4 pb-8 border-t border-white/5">
                    <h4 className="text-[10px] uppercase tracking-widest font-display text-gray-500 font-bold mb-3">
                      References & Educational Resources
                    </h4>
                    <div className="flex flex-col gap-2">
                      {data.learnMore.map((link, i) => (
                        <a 
                          key={i}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3.5 rounded-xl bg-white/1 hover:bg-white/5 border border-white/5 hover:border-gold-500/20 text-xs text-gray-300 hover:text-gold-300 font-medium transition-all group"
                        >
                          <span className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-ashoka" /> {link.label}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-gold-400 transform group-hover:translate-x-0.5 transition-all" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
