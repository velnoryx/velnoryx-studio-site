import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Calendar, Disc, Music, Apple, Shirt, Palette } from 'lucide-react';
import ExhibitButton from '../common/ExhibitButton';

interface CultureAspect {
  id: string;
  name: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  colorClass: string; // Tailwind background gradient for active card
  glowClass: string; // Glowing text shadow class
  bgGradient: string; // The background gradient for the section
  stats: string;
}

const aspects: CultureAspect[] = [
  {
    id: 'lang',
    name: 'Languages',
    icon: <Languages className="w-5 h-5" />,
    title: 'A Tapestry of Voices',
    description: 'India has no single national language. It is home to 22 constitutionally recognized languages and over 19,500 dialects, with Sanskrit standing as one of the world\'s oldest classical languages.',
    colorClass: 'from-orange-500/20 to-amber-500/20 border-orange-500/30',
    glowClass: 'text-glow-saffron',
    bgGradient: 'from-orange-950/40 via-gray-950 to-gray-950',
    stats: '19,500+ Dialects Spoken'
  },
  {
    id: 'fest',
    name: 'Festivals',
    icon: <Calendar className="w-5 h-5" />,
    title: 'A Celebration of Seasons',
    description: 'Life in India is a continuous celebration. From the lights of Diwali and the colors of Holi, to Eid, Christmas, Durga Puja, and Gurpurab, festivals unite communities in joy and spiritual alignment.',
    colorClass: 'from-red-500/20 to-pink-500/20 border-red-500/30',
    glowClass: 'text-glow-saffron',
    bgGradient: 'from-red-950/30 via-gray-950 to-gray-950',
    stats: 'Hundreds of Celebrations Yearly'
  },
  {
    id: 'dance',
    name: 'Dance',
    icon: <Disc className="w-5 h-5" />,
    title: 'The Poetry of Motion',
    description: 'Storytelling through movement. India features 8 classical dance forms—including Bharatanatyam, Kathak, Kathakali, and Odissi—alongside hundreds of high-energy folk dances like Bhangra and Garba.',
    colorClass: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30',
    glowClass: 'text-glow-gold',
    bgGradient: 'from-yellow-950/20 via-gray-950 to-gray-950',
    stats: '8 Classical Dance Forms'
  },
  {
    id: 'music',
    name: 'Music',
    icon: <Music className="w-5 h-5" />,
    title: 'Resonance of the Soul',
    description: 'Dating back to the Vedic hymns, Indian classical music splits into Hindustani (North) and Carnatic (South), defined by complex Ragas (melodic frameworks) and Talas (rhythmic cycles).',
    colorClass: 'from-purple-500/20 to-indigo-500/20 border-purple-500/30',
    glowClass: 'text-glow-gold',
    bgGradient: 'from-purple-950/30 via-gray-950 to-gray-950',
    stats: 'Thousands of Classical Ragas'
  },
  {
    id: 'food',
    name: 'Food',
    icon: <Apple className="w-5 h-5" />,
    title: 'Symphony of Flavors',
    description: 'Indian cuisine is a culinary science. It uses spices not just for taste, but for preservation and Ayurvedic health. Each state offers completely distinct ingredients, cooking styles, and flavors.',
    colorClass: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    glowClass: 'text-glow-green',
    bgGradient: 'from-emerald-950/30 via-gray-950 to-gray-950',
    stats: '6 Ayurvedic Tastes (Shad Rasa)'
  },
  {
    id: 'clothing',
    name: 'Clothing',
    icon: <Shirt className="w-5 h-5" />,
    title: 'Draped in Heritage',
    description: 'From the timeless elegance of the Saree and the royal Sherwani, to colorful regional turbans and hand-woven Khadi, garments represent regional history, climate, and master craftsmanship.',
    colorClass: 'from-sky-500/20 to-blue-500/20 border-sky-500/30',
    glowClass: 'text-glow',
    bgGradient: 'from-blue-950/30 via-gray-950 to-gray-950',
    stats: '100+ Unique Weaving Clusters'
  },
  {
    id: 'art',
    name: 'Art & Craft',
    icon: <Palette className="w-5 h-5" />,
    title: 'Expressions on Canvas & Stone',
    description: 'A legacy of visual excellence, ranging from the tribal geometry of Madhubani and Warli paintings, to royal Mughal miniatures, Tanjore gold-foil paintings, and monumental temple sculptures.',
    colorClass: 'from-rose-500/20 to-orange-500/20 border-rose-500/30',
    glowClass: 'text-glow-gold',
    bgGradient: 'from-rose-950/20 via-gray-950 to-gray-950',
    stats: '5,000 Years of Artistic Legacy'
  }
];

interface Chapter2Props {
  onOpenExhibit?: () => void;
}

export default function Chapter2({ onOpenExhibit }: Chapter2Props) {
  const [selectedId, setSelectedId] = useState<string>('lang');
  const activeAspect = aspects.find(a => a.id === selectedId) || aspects[0];

  return (
    <div 
      className={`py-24 px-6 relative transition-all duration-1000 bg-gradient-to-b ${activeAspect.bgGradient}`}
    >
      {/* Light Overlay Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left Column - Introductory Text & Buttons */}
        <div className="lg:col-span-5">
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs tracking-widest font-display text-gold-400 uppercase font-bold px-3 py-1 glassmorphism rounded-full"
          >
            Chapter II
          </motion.span>
          <motion.h2 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-white mt-4 mb-6 tracking-wide"
          >
            A Cosmos of <br />
            <span className="text-gold-300 font-bold">Cultural Diversity</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-sm text-gray-400 leading-relaxed font-sans mb-8"
          >
            India is not just a country; it is a subcontinent of cultures. Each state possesses its own languages, art forms, cuisines, and historic roots, woven together into a unified democratic fabric.
          </motion.p>

          {/* Vertical Menu Buttons */}
          <div className="flex flex-col gap-3">
            {aspects.map((aspect) => (
              <button
                key={aspect.id}
                onClick={() => setSelectedId(aspect.id)}
                className={`flex items-center justify-between p-4 rounded-xl text-left transition-all duration-300 font-display text-sm ${
                  selectedId === aspect.id
                    ? 'bg-white/10 text-white font-bold border-l-4 border-l-gold-500 pl-5 shadow-lg'
                    : 'bg-white/2 hover:bg-white/5 text-gray-400 hover:text-white pl-4'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={selectedId === aspect.id ? 'text-gold-400' : 'text-gray-500'}>
                    {aspect.icon}
                  </span>
                  <span>{aspect.name}</span>
                </div>
                <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                  {aspect.stats.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column - Premium Animated Detail Card */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeAspect.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.95 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`glassmorphism rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden bg-gradient-to-br ${activeAspect.colorClass}`}
            >
              {/* Card Watermark Icon */}
              <div className="absolute -right-12 -bottom-12 opacity-5 text-white transform scale-[3.5]">
                {activeAspect.icon}
              </div>

              <div className="relative z-10 flex flex-col justify-between h-full min-h-[300px]">
                <div>
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-[10px] tracking-widest uppercase font-display font-semibold px-3 py-1 bg-white/5 border border-white/10 rounded-full text-gold-400">
                      {activeAspect.name}
                    </span>
                    <span className="text-xs font-mono font-medium text-gray-400">
                      {activeAspect.stats}
                    </span>
                  </div>
                  
                  <h3 className={`font-serif text-3xl font-bold text-white mb-6 ${activeAspect.glowClass}`}>
                    {activeAspect.title}
                  </h3>
                  
                  <p className="text-sm text-gray-300 leading-relaxed font-sans">
                    {activeAspect.description}
                  </p>
                </div>

                <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                  <span className="font-display font-semibold tracking-wider text-saffron uppercase">Vibrant India</span>
                  <span className="font-display font-semibold tracking-wider text-ashoka uppercase">Unity in Diversity</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Discovery Exhibit Button */}
      {onOpenExhibit && (
        <div className="flex justify-center mt-12">
          <ExhibitButton onClick={onOpenExhibit} />
        </div>
      )}
    </div>
  );
}
