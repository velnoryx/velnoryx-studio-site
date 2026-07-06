import { motion } from 'framer-motion';
import { Camera, MapPin } from 'lucide-react';
import ExhibitButton from './ExhibitButton';

interface WonderItem {
  title: string;
  location: string;
  description: string;
  image: string;
}

const wonders: WonderItem[] = [
  {
    title: 'The Taj Mahal',
    location: 'Agra, Uttar Pradesh',
    description: 'An architectural masterpiece of white marble, built by Emperor Shah Jahan as an eternal tribute to love. Recognized as one of the Seven Wonders of the World.',
    image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'The Pink City',
    location: 'Jaipur, Rajasthan',
    description: 'A land of royal heritage, featuring pink sandstone palaces, towering forts, and Hawa Mahal, reflecting the architectural brilliance of Rajput rulers.',
    image: 'https://images.unsplash.com/photo-1603262110263-fb0112e7cc33?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'The Backwaters',
    location: 'Alappuzha, Kerala',
    description: 'A serene labyrinth of canopy-covered canals, lakes, and rivers. Travelers glide on houseboats through lush emerald groves in "God\'s Own Country".',
    image: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'The Land of High Passes',
    location: 'Leh Ladakh',
    description: 'A high-altitude desert wonderland of dramatic barren mountains, deep blue lakes like Pangong Tso, and ancient, cliff-clinging Buddhist monasteries.',
    image: '/assets/leh_ladakh.jpg'
  },
  {
    title: 'The Eternal Himalayas',
    location: 'Northern Borders',
    description: 'The highest mountain range on Earth, standing as a protective shield and serving as the spiritual birthplace of ancient sages, yoga, and holy rivers.',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'Golden Shores of Goa',
    location: 'Goa Coastline',
    description: 'A tropical paradise known for its sunset-drenched coastlines, historic Portuguese-era churches, vibrant culture, and relaxed, coastal "Sussegad" lifestyle.',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80'
  },
  {
    title: 'The Sacred Ghats',
    location: 'Varanasi, Uttar Pradesh',
    description: 'One of the world\'s oldest continuously inhabited cities. Pilgrims gather on stone ghats by the Ganges River for spiritual fire ceremonies (Ganga Aarti).',
    image: '/assets/varanasi.jpg'
  },
  {
    title: 'Tropical Archipelago',
    location: 'Andaman & Nicobar Islands',
    description: 'Pristine islands in the Bay of Bengal, famous for white sand beaches, thick tropical rainforests, coral reefs, and turquoise water.',
    image: 'https://images.unsplash.com/photo-1590523277543-a94d2e4eb00b?auto=format&fit=crop&w=800&q=80'
  }
];

interface Chapter3Props {
  onOpenExhibit?: () => void;
}

export default function Chapter3({ onOpenExhibit }: Chapter3Props) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  } as const;

  const cardVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] // Custom premium ease-out
      }
    }
  } as const;

  return (
    <div className="py-24 max-w-7xl mx-auto px-6 md:px-12">
      {/* Chapter Title */}
      <div className="max-w-3xl mx-auto text-center mb-20">
        <motion.span 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs tracking-widest font-display text-gold-400 uppercase font-bold px-3 py-1 glassmorphism rounded-full"
        >
          Chapter III
        </motion.span>
        <motion.h2 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-serif text-4xl md:text-5xl text-gold-200 mt-4 mb-6 tracking-wide text-glow-gold"
        >
          Wonders of the Land
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm md:text-base text-gray-400 leading-relaxed font-sans"
        >
          From the soaring altitudes of the Himalayas to the tropical lagoons of Andaman, explore a landscape of spectacular contrasts and timeless structural wonders.
        </motion.p>
      </div>

      {/* Wonders Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {wonders.map((wonder, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            className="group relative h-[420px] rounded-2xl overflow-hidden glassmorphism border border-white/5 cursor-pointer shadow-xl"
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/30 to-transparent z-10 transition-all duration-500 group-hover:from-gray-950/90 group-hover:via-gray-950/60" />
              <img 
                src={wonder.image} 
                alt={wonder.title}
                className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </div>

            {/* Accent Border Lines on Hover */}
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-saffron via-white to-ashoka opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20" />

            {/* Content Layout */}
            <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
              <div className="flex items-center justify-between">
                <div className="glassmorphism p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <Camera className="w-4 h-4 text-gold-300" />
                </div>
                <div className="flex items-center gap-1 glassmorphism px-2 py-0.5 rounded-md">
                  <MapPin className="w-3 h-3 text-saffron" />
                  <span className="text-[9px] tracking-wide text-white uppercase font-display font-medium">
                    {wonder.location.split(',')[0]}
                  </span>
                </div>
              </div>

              {/* Text Information */}
              <div className="transform translate-y-16 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                <h3 className="font-serif text-lg font-bold text-white mb-1 group-hover:text-gold-300 transition-colors duration-300">
                  {wonder.title}
                </h3>
                <span className="text-[10px] text-gray-400 font-display block mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {wonder.location}
                </span>
                
                {/* Description - Fades in on hover */}
                <p className="text-[11px] text-gray-300 leading-relaxed font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75 line-clamp-3">
                  {wonder.description}
                </p>
              </div>
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
