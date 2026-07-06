import { ArrowRight, BookOpen } from 'lucide-react';

interface ExhibitButtonProps {
  onClick: () => void;
  label?: string;
}

export default function ExhibitButton({ onClick, label = 'Explore Digital Exhibit' }: ExhibitButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="inline-flex items-center gap-2.5 px-6 py-3.5 mt-8 bg-gradient-to-r from-saffron to-gold-500 hover:from-gold-400 hover:to-saffron text-gray-950 hover:text-black font-display font-bold text-xs uppercase tracking-widest rounded-full transition-all duration-300 transform hover:scale-[1.02] shadow-[0_4px_20px_rgba(212,163,71,0.25)] hover:shadow-[0_4px_25px_rgba(212,163,71,0.4)] cursor-pointer group z-20"
    >
      <BookOpen className="w-4 h-4 shrink-0 transition-transform group-hover:rotate-12" />
      <span>{label}</span>
      <ArrowRight className="w-4 h-4 shrink-0 transform group-hover:translate-x-1 transition-transform" />
    </button>
  );
}
