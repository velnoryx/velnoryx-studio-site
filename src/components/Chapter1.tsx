import { motion } from 'framer-motion';
import { BookOpen, Flower, Hash, Orbit, Compass } from 'lucide-react';
import ExhibitButton from './ExhibitButton';

interface AncientItem {
  title: string;
  period: string;
  description: string;
  icon: React.ReactNode;
  illustration: React.ReactNode;
}

const items: AncientItem[] = [
  {
    title: 'Indus Valley Civilization',
    period: 'c. 3300 – 1300 BCE',
    description: 'One of the world\'s oldest urban civilizations, legendary for its grid-planned cities, advanced drainage systems, brick architecture, and maritime trade routes.',
    icon: <Compass className="w-6 h-6 text-saffron" />,
    illustration: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 stroke-saffron fill-none" strokeWidth="1.5">
        <rect x="10" y="10" width="20" height="20" rx="2" />
        <rect x="40" y="10" width="50" height="20" rx="2" />
        <rect x="10" y="40" width="40" height="50" rx="2" />
        <rect x="60" y="40" width="30" height="30" rx="2" />
        <line x1="35" y1="10" x2="35" y2="90" strokeDasharray="3 3" />
        <line x1="10" y1="35" x2="90" y2="35" strokeDasharray="3 3" />
      </svg>
    )
  },
  {
    title: 'The Vedic Age & Philosophy',
    period: 'c. 1500 – 500 BCE',
    description: 'The formulation of the Vedas, Upanishads, and epic literatures. The birth of deep metaphysical inquiries, cosmic order (Rita), and eternal spiritual concepts.',
    icon: <Flower className="w-6 h-6 text-gold-400" />,
    illustration: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 stroke-gold-400 fill-none" strokeWidth="1.5">
        <circle cx="50" cy="50" r="35" />
        <circle cx="50" cy="50" r="25" strokeDasharray="2 2" />
        <path d="M 50 15 L 50 85 M 15 50 L 85 50 M 25 25 L 75 75 M 25 75 L 75 25" />
        <circle cx="50" cy="50" r="5" className="fill-gold-400" />
      </svg>
    )
  },
  {
    title: 'Nalanda University',
    period: 'c. 427 – 1197 CE',
    description: 'The world\'s first residential international university. It housed over 9 million books and attracted scholars from China, Korea, Tibet, Persia, and Greece.',
    icon: <BookOpen className="w-6 h-6 text-ashoka" />,
    illustration: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 stroke-ashoka fill-none" strokeWidth="1.5">
        <path d="M 10 80 L 50 60 L 90 80 V 30 L 50 10 L 10 30 Z" />
        <path d="M 50 10 V 60" />
        <path d="M 20 40 Q 50 30, 80 40" />
        <path d="M 20 55 Q 50 45, 80 55" />
      </svg>
    )
  },
  {
    title: 'Ayurveda & Wellness',
    period: 'c. 1000 BCE – Present',
    description: 'A complete system of natural medicine based on balancing the bodily energies (Doshas). Emphasizes preventative healthcare, diet, and herbal treatments.',
    icon: <Flower className="w-6 h-6 text-saffron" />,
    illustration: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 stroke-saffron fill-none" strokeWidth="1.5">
        <path d="M 50 90 C 50 90, 15 60, 15 40 C 15 20, 50 10, 50 10 C 50 10, 85 20, 85 40 C 85 60, 50 90, 50 90 Z" />
        <path d="M 50 10 V 90" />
        <path d="M 50 35 Q 25 35, 20 40 M 50 55 Q 75 55, 80 60 M 50 70 Q 30 70, 25 75" />
      </svg>
    )
  },
  {
    title: 'Yoga: Union of Being',
    period: 'c. 2000 BCE – Present',
    description: 'Codified by Patanjali, Yoga is a holistic science uniting body, breath, mind, and soul, now celebrated globally for physical harmony and mental clarity.',
    icon: <Orbit className="w-6 h-6 text-gold-400" />,
    illustration: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 stroke-gold-400 fill-none" strokeWidth="1.5">
        <circle cx="50" cy="20" r="8" />
        <path d="M 50 28 L 50 55 L 30 75 L 15 75 M 50 55 L 70 75 L 85 75" />
        <path d="M 50 38 Q 30 38, 25 50 M 50 38 Q 70 38, 75 50" />
        <circle cx="50" cy="38" r="15" strokeDasharray="3 3" />
      </svg>
    )
  },
  {
    title: 'Mathematics & The Zero',
    period: 'c. 5th Century CE',
    description: 'The revolutionary invention of Zero (Shunya) and the decimal system by Aryabhata and Brahmagupta, which formed the absolute bedrock of modern computing and physics.',
    icon: <Hash className="w-6 h-6 text-ashoka" />,
    illustration: (
      <svg viewBox="0 0 100 100" className="w-20 h-20 stroke-ashoka fill-none" strokeWidth="1.5">
        <ellipse cx="50" cy="50" rx="20" ry="35" strokeWidth="3" className="stroke-gold-400 text-glow-gold" />
        <path d="M 15 20 H 25 M 20 15 V 25" />
        <path d="M 75 20 H 85" />
        <path d="M 15 75 H 25 M 15 80 H 25" />
        <path d="M 75 75 L 83 83 M 83 75 L 75 83" />
      </svg>
    )
  }
];

interface Chapter1Props {
  onOpenExhibit?: () => void;
}

export default function Chapter1({ onOpenExhibit }: Chapter1Props) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  } as const;

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  } as const;

  return (
    <div className="py-24 max-w-6xl mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-xs tracking-widest font-display text-saffron uppercase font-bold px-3 py-1 glassmorphism rounded-full">
            Chapter I
          </span>
          <h2 className="font-serif text-4xl md:text-5xl text-gold-200 mt-4 mb-6 tracking-wide text-glow-gold">
            Cradle of Civilization
          </h2>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed font-sans">
            Deep in the soil of the Indian subcontinent, humanity took some of its first steps in philosophy, urban planning, science, and spiritual enlightenment.
          </p>
        </motion.div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="glassmorphism-card rounded-2xl p-8 flex flex-col justify-between min-h-[380px]"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl">
                  {item.icon}
                </div>
                <span className="text-[10px] tracking-widest font-display font-semibold uppercase text-gold-400">
                  {item.period}
                </span>
              </div>

              <h3 className="font-serif text-xl font-bold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-xs text-gray-400 leading-relaxed font-sans">
                {item.description}
              </p>
            </div>

            <div className="flex justify-center items-center mt-6 pt-6 border-t border-white/5 h-24">
              {item.illustration}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Discovery Exhibit Button */}
      {onOpenExhibit && (
        <div className="flex justify-center mt-12">
          <ExhibitButton onClick={onOpenExhibit} />
        </div>
      )}
    </div>
  );
}
