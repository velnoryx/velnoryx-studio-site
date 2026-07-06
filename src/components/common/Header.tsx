import { useEffect, useState } from 'react';
import { Compass, Menu, X } from 'lucide-react';

interface HeaderProps {
  activeSection: number;
  sections: string[];
  scrollToSection: (index: number) => void;
}

export default function Header({ activeSection, sections, scrollToSection }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update URL hash on scroll (part of prompt #4)
  useEffect(() => {
    if (sections[activeSection]) {
      const hash = sections[activeSection].toLowerCase().replace(/\s+/g, '-');
      if (window.history.replaceState) {
        window.history.replaceState(null, '', `#${hash}`);
      }
    }
  }, [activeSection, sections]);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-4 glassmorphism border-b border-white/10' 
          : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo / Brand */}
        <div 
          className="flex items-center gap-4 cursor-pointer group transition-all duration-500 hover:scale-[1.02]" 
          onClick={() => scrollToSection(0)}
        >
          <div className="relative">
            <Compass className="w-8 h-8 text-gold-400 group-hover:rotate-[360deg] transition-transform duration-[1500ms] group-hover:drop-shadow-[0_0_10px_rgba(212,163,71,0.8)]" />
            <div className="absolute inset-0 bg-gold-400 rounded-full blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
          </div>
          <span className="font-serif tracking-widest text-xl font-bold bg-gradient-to-r from-saffron via-gold-200 to-ashoka bg-[length:200%_auto] bg-clip-text text-transparent group-hover:animate-shimmer transition-all duration-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            INDIA ON THE WORLD STAGE
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {sections.map((section, index) => (
            <button
              key={section}
              onClick={() => scrollToSection(index)}
              className={`group text-xs uppercase tracking-wider font-display font-medium transition-all duration-300 relative py-2 ${
                activeSection === index 
                  ? 'text-gold-400 font-bold drop-shadow-[0_0_8px_rgba(212,163,71,0.5)]' 
                  : 'text-gray-400 hover:text-gold-200 hover:drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]'
              }`}
            >
              {section}
              <span 
                className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-saffron to-ashoka rounded-full transition-transform duration-300 ease-out origin-left ${
                  activeSection === index ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} 
              />
            </button>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="lg:hidden text-white hover:text-gold-400 transition-colors p-2 glassmorphism-light rounded-full"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Scroll Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/5">
        <div 
          className="h-full bg-gradient-to-r from-saffron via-gold-400 to-ashoka transition-all duration-300 ease-out shadow-[0_0_10px_rgba(212,163,71,0.5)]"
          style={{ width: `${((activeSection) / (sections.length - 1)) * 100}%` }}
        />
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 glassmorphism border-b border-white/10 lg:hidden transition-all duration-300 py-6 px-6 flex flex-col gap-2 shadow-2xl">
          {sections.map((section, index) => (
            <button
              key={section}
              onClick={() => {
                scrollToSection(index);
                setMobileMenuOpen(false);
              }}
              className={`text-left text-sm uppercase tracking-widest font-display py-3 px-4 rounded-lg transition-all duration-300 ${
                activeSection === index 
                  ? 'bg-white/5 text-gold-400 font-bold border-l-2 border-l-gold-400 shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]' 
                  : 'text-gray-400 hover:bg-white/5 hover:text-white hover:border-l-2 hover:border-l-white/20'
              }`}
            >
              {section}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
