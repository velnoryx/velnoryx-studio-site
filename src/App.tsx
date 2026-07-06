import { useEffect, useState, useRef } from 'react';
import Lenis from 'lenis';
import Header from './components/common/Header';
import GlobeScene from './components/visualizations/Globe';
import Intro from './components/chapters/Intro';
import Chapter1 from './components/chapters/Chapter1';
import Chapter2 from './components/chapters/Chapter2';
import Chapter3 from './components/chapters/Chapter3';
import Chapter4 from './components/chapters/Chapter4';
import Chapter5 from './components/chapters/Chapter5';
import Chapter6 from './components/chapters/Chapter6';
import Chapter7 from './components/chapters/Chapter7';
import Chapter8 from './components/chapters/Chapter8';
import InteractiveMap from './components/visualizations/InteractiveMap';
import Outro from './components/chapters/Outro';
import CustomCursor from './components/common/CustomCursor';
import SectionDetailsPanel from './components/visualizations/SectionDetailsPanel';
import AdminPanel from './components/admin/AdminPanel';
import ExhibitButton from './components/common/ExhibitButton';

const sections = [
  'Intro',
  'Ancient India',
  'Cultural Diversity',
  'Wonders',
  'Modern India',
  'Space & Science',
  'Global Role',
  'Economy',
  'Timeline',
  'Interactive Map',
  'Outro'
];

const sectionHashes = [
  'intro',
  'ancient-india',
  'cultural-diversity',
  'wonders',
  'modern-india',
  'space-science',
  'global-role',
  'economy',
  'timeline',
  'interactive-map',
  'outro'
];

export default function App() {
  // scrollProgressRef is read directly by Globe's useFrame every RAF tick —
  // no React state, no scheduling lag, no interpolation layer.
  const scrollProgressRef = useRef(0);
  const [activeSection, setActiveSection] = useState(0);
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const lenisRef = useRef<Lenis | null>(null);
  const isScrollingTo = useRef(false);

  // Check URL pathname or hash for Admin Panel
  useEffect(() => {
    const checkAdmin = () => {
      const isRouteAdmin = window.location.pathname === '/admin' || window.location.hash === '#admin';
      setIsAdmin(isRouteAdmin);
    };
    window.addEventListener('hashchange', checkAdmin);
    checkAdmin();
    return () => window.removeEventListener('hashchange', checkAdmin);
  }, []);

  // Handle Watermark transition to credits text on the final section (Outro)
  useEffect(() => {
    const wm = document.getElementById('velnoryx-watermark');
    if (wm) {
      if (activeSection === sections.length - 1) {
        wm.classList.add('text-mode');
      } else {
        wm.classList.remove('text-mode');
      }
    }
  }, [activeSection]);

  // Initialize Lenis smooth scrolling
  useEffect(() => {
    if (isAdmin) return;

    const lenis = new Lenis({
      // Gentle duration — feels native but eliminates scroll jank
      duration: 1.0,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Initial load scroll preservation based on URL hash
    const initialHash = window.location.hash.replace('#', '');
    const index = sectionHashes.indexOf(initialHash);
    if (index !== -1) {
      setTimeout(() => {
        scrollToSection(index);
      }, 0);
    }

    return () => {
      lenis.destroy();
    };
  }, [isAdmin]);

  // Track page scroll and active sections
  useEffect(() => {
    if (isAdmin) return;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = totalHeight > 0 ? window.scrollY / totalHeight : 0;
      // Write directly to ref — no setState, no re-render, no scheduling lag.
      // Globe.tsx reads this ref inside useFrame every animation frame.
      scrollProgressRef.current = progress;

      // Section detection
      const scrollPos = window.scrollY + window.innerHeight / 3;
      const sectionElements = document.querySelectorAll('section[data-section]');
      
      sectionElements.forEach((el, index) => {
        const top = (el as HTMLElement).offsetTop;
        const height = (el as HTMLElement).offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          setActiveSection(index);
          
          // Sync URL hash with current active section (avoiding rewriting hash when manually scrolling to section)
          if (!isScrollingTo.current) {
            const currentHash = '#' + sectionHashes[index];
            if (window.location.hash !== currentHash && index !== 0) {
              window.history.replaceState(null, '', currentHash);
            } else if (index === 0 && window.location.hash !== '') {
              window.history.replaceState(null, '', window.location.pathname);
            }
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isAdmin]);

  // Handle browser back and forward button clicks
  useEffect(() => {
    if (isAdmin) return;

    const handleHashNavigation = () => {
      const hash = window.location.hash.replace('#', '');
      const index = sectionHashes.indexOf(hash);
      if (index !== -1 && index !== activeSection) {
        scrollToSection(index);
      } else if (hash === '' && activeSection !== 0) {
        scrollToSection(0);
      }
    };

    window.addEventListener('hashchange', handleHashNavigation);
    return () => window.removeEventListener('hashchange', handleHashNavigation);
  }, [activeSection, isAdmin]);

  const scrollToSection = (index: number) => {
    const elements = document.querySelectorAll('section[data-section]');
    if (elements[index] && lenisRef.current) {
      isScrollingTo.current = true;
      
      // Update hash immediately
      const hash = index === 0 ? '' : '#' + sectionHashes[index];
      window.history.pushState(null, '', hash || window.location.pathname);

      lenisRef.current.scrollTo(elements[index] as HTMLElement, {
        duration: 0,
        easing: (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
        onComplete: () => {
          setTimeout(() => {
            isScrollingTo.current = false;
          }, 0);
        }
      });
    }
  };

  const handleExplore = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(window.innerHeight, {
        duration: 1.8,
        easing: (t: number) => 1 - Math.pow(1 - t, 3),
      });
    } else {
      window.scrollTo({
        top: window.innerHeight,
        behavior: 'smooth',
      });
    }
  };

  // If Admin panel route is active, render CMS directly
  if (isAdmin) {
    return <AdminPanel onBack={() => {
      setIsAdmin(false);
      window.location.hash = '';
      window.history.pushState(null, '', '/');
    }} />;
  }

  return (
    <div className="relative min-h-screen bg-gray-950 text-gray-50 font-sans selection:bg-orange-500 selection:text-white">
      {/* Custom Golden Cursor Trailing Dot */}
      <CustomCursor />

      {/* Premium Glass Header Navigation */}
      <Header 
        activeSection={activeSection} 
        sections={sections} 
        scrollToSection={scrollToSection} 
      />

      {/* Sticky 3D Globe Canvas Container */}
      {/* Opacity and scale are now managed inside Globe.tsx via scroll-driven
          animation — no abrupt state-based jumps here. The Outro section
          re-shows the globe, so we keep a subtle ambient presence at 8% for
          non-hero sections via the Globe's own opacity fade logic. */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GlobeScene scrollProgressRef={scrollProgressRef} />
      </div>

      {/* Main Narrative Content Sections */}
      <main className="relative z-10 w-full overflow-hidden">
        
        {/* Intro Section (200vh track for earth zooming) */}
        <section data-section="0" className="relative min-h-[200vh]">
          <Intro 
            onExplore={handleExplore} 
            onScrollToChapter1={() => scrollToSection(1)} 
          />
        </section>

        {/* Chapter 1: Ancient India */}
        <section data-section="1" className="relative border-t border-white/5 bg-gray-950/40 backdrop-blur-sm">
          <Chapter1 onOpenExhibit={() => setOpenSectionId('ancient-india')} />
        </section>

        {/* Chapter 2: Cultural Diversity */}
        <section data-section="2" className="relative border-t border-white/5">
          <Chapter2 onOpenExhibit={() => setOpenSectionId('cultural-diversity')} />
        </section>

        {/* Chapter 3: Wonders */}
        <section data-section="3" className="relative border-t border-white/5 bg-gray-950/40 backdrop-blur-sm">
          <Chapter3 onOpenExhibit={() => setOpenSectionId('wonders')} />
        </section>

        {/* Chapter 4: Modern India */}
        <section data-section="4" className="relative border-t border-white/5 bg-gray-950 bg-grid-pattern">
          <Chapter4 onOpenExhibit={() => setOpenSectionId('modern-india')} />
        </section>

        {/* Chapter 5: Space & Science */}
        <section data-section="5" className="relative border-t border-white/5">
          <Chapter5 onOpenExhibit={() => setOpenSectionId('space-science')} />
        </section>

        {/* Chapter 6: Global Role */}
        <section data-section="6" className="relative border-t border-white/5 bg-gray-950/40 backdrop-blur-sm">
          <Chapter6 onOpenExhibit={() => setOpenSectionId('global-role')} />
        </section>

        {/* Chapter 7: Economy */}
        <section data-section="7" className="relative border-t border-white/5 bg-gray-950 bg-grid-pattern">
          <Chapter7 onOpenExhibit={() => setOpenSectionId('economy')} />
        </section>

        {/* Chapter 8: Timeline */}
        <section data-section="8" className="relative border-t border-white/5">
          <Chapter8 onOpenExhibit={() => setOpenSectionId('timeline')} />
        </section>

        {/* Chapter 9: Interactive Map */}
        <section data-section="9" className="relative border-t border-white/5 py-24 bg-gray-950/50 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs tracking-widest font-display text-ashoka uppercase font-bold px-3 py-1 glassmorphism rounded-full">
                Chapter IX
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-gold-200 mt-4 mb-6 tracking-wide text-glow-gold">
                Interactive Cultural Map
              </h2>
              <p className="text-sm md:text-base text-gray-400 leading-relaxed font-sans">
                Explore the distinct local customs, cuisine, festivals, and landmarks that span the six major cultural zones of the Indian subcontinent.
              </p>
            </div>
            <InteractiveMap />
            <div className="flex justify-center mt-12">
              <ExhibitButton onClick={() => setOpenSectionId('interactive-map')} />
            </div>
          </div>
        </section>

        {/* Outro / Final Scene */}
        <section data-section="10" className="relative border-t border-white/5 h-screen flex items-center justify-center bg-transparent">
          <Outro scrollToSection={scrollToSection} />
        </section>

      </main>

      {/* Slide-out exhibit drawers */}
      <SectionDetailsPanel 
        sectionId={openSectionId} 
        onClose={() => setOpenSectionId(null)} 
      />
    </div>
  );
}
