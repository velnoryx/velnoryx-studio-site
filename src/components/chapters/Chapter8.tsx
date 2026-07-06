import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Eye, Image as ImageIcon, ArrowRight, Loader2 } from 'lucide-react';
import { timelineEvents as fallbackTimeline } from '../../data/fallbackData';
import ExhibitButton from '../common/ExhibitButton';

interface TimelineEvent {
  id: number;
  title: string;
  date: string;
  category: string;
  tagline: string;
  mainImage: string;
  description: string;
  gallery: string[];
}

interface Chapter8Props {
  onOpenExhibit?: () => void;
}

export default function Chapter8({ onOpenExhibit }: Chapter8Props) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/timeline');
        if (!res.ok) throw new Error('API offline');
        const json = await res.json();
        setEvents(json);
      } catch (err) {
        console.warn('API error, using local timeline events fallback:', err);
        setEvents(fallbackTimeline);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeline();
  }, []);

  return (
    <div className="py-24 px-6 relative bg-gray-950 overflow-hidden">
      
      {/* Chapter header */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <motion.span 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-xs tracking-widest font-display text-saffron uppercase font-bold px-3 py-1 glassmorphism rounded-full"
        >
          Chapter VIII
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-4xl md:text-5xl text-gold-200 mt-4 mb-4 tracking-wide text-glow-gold"
        >
          Historical Events Timeline
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm text-gray-400 leading-relaxed font-sans"
        >
          Swipe or scroll horizontally to track the landmark cultural, sovereign, and diplomatic events that define India\'s yearly calendar and global impact.
        </motion.p>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col justify-center items-center gap-4 text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin text-gold-400" />
          <span className="text-xs tracking-widest font-mono">Retrieving Historical Timeline...</span>
        </div>
      ) : (
        /* Horizontal Scroll Timeline */
        <div className="max-w-7xl mx-auto overflow-x-auto flex gap-6 pb-8 snap-x snap-mandatory scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gold-500">
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-shrink-0 w-[280px] md:w-[350px] snap-center glassmorphism rounded-2xl overflow-hidden border border-white/5 shadow-lg group cursor-pointer flex flex-col justify-between"
              onClick={() => setSelectedEvent(event)}
            >
              <div>
                {/* Event Image */}
                <div className="h-44 overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent z-10" />
                  <img 
                    src={event.mainImage} 
                    alt={event.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 glassmorphism px-2.5 py-0.5 rounded text-[9px] uppercase tracking-wider text-gold-400 font-bold z-20 border border-white/10">
                    {event.category}
                  </span>
                </div>

                {/* Event Text */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-3.5 h-3.5 text-saffron" />
                    <span className="text-[10px] text-gray-400 font-mono font-medium">{event.date}</span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white group-hover:text-gold-300 transition-colors mb-1.5">
                    {event.title}
                  </h3>
                  <p className="text-[11px] text-gray-400 leading-snug font-sans line-clamp-3">
                    {event.description}
                  </p>
                </div>
              </div>

              {/* Read More button */}
              <div className="p-6 pt-0 border-t border-white/5 mt-4 flex items-center justify-between text-xs text-gold-400 font-display font-semibold">
                <span className="flex items-center gap-1.5"><Eye className="w-3.5 h-3.5" /> Expand Details</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Discovery Exhibit Button */}
      {onOpenExhibit && (
        <div className="flex justify-center mt-12">
          <ExhibitButton onClick={onOpenExhibit} />
        </div>
      )}

      {/* Expanded Modal / Lightbox */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="glassmorphism max-w-3xl w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Cover Image */}
              <div className="h-56 relative">
                <img 
                  src={selectedEvent.mainImage} 
                  alt={selectedEvent.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />
                <button 
                  className="absolute top-4 right-4 p-2 bg-gray-950/50 hover:bg-gray-950 border border-white/10 rounded-full text-white transition-colors cursor-pointer"
                  onClick={() => setSelectedEvent(null)}
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-4 left-6">
                  <span className="text-[10px] tracking-widest uppercase text-saffron font-bold font-display px-2 py-0.5 bg-white/10 rounded">
                    {selectedEvent.category}
                  </span>
                  <h3 className="font-serif text-2xl md:text-3xl font-extrabold text-white mt-1.5 text-glow">
                    {selectedEvent.title}
                  </h3>
                </div>
              </div>

              {/* Modal Details Panel */}
              <div 
                className="p-6 md:p-8 overflow-y-auto overscroll-contain max-h-[50vh]"
                data-lenis-prevent
              >
                <div className="flex items-center gap-2 mb-4 text-xs font-mono text-gold-400">
                  <Calendar className="w-4 h-4" />
                  <span>Held: {selectedEvent.date}</span>
                  <span className="mx-2 text-gray-700">|</span>
                  <span className="italic text-gray-300 font-sans">{selectedEvent.tagline}</span>
                </div>
                
                <p className="text-xs md:text-sm text-gray-300 leading-relaxed font-sans mb-8">
                  {selectedEvent.description}
                </p>

                {/* Event Photo Gallery */}
                <div>
                  <h4 className="text-xs uppercase tracking-widest font-display text-white font-bold mb-4 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-ashoka" /> Event Gallery
                  </h4>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedEvent.gallery.map((img, i) => (
                      <div key={i} className="h-20 md:h-28 rounded-lg overflow-hidden border border-white/5 hover:border-gold-500/35 transition-colors">
                        <img 
                          src={img} 
                          alt="Gallery item" 
                          className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
