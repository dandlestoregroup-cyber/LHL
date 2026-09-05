import React from 'react';
import { BrandVisualCard } from '../data/brandIdentityCards';
import { MapPin, ArrowUpRight } from 'lucide-react';

interface BrandVisualCardViewProps {
  card: BrandVisualCard;
  isRTL?: boolean;
  onSelect?: (card: BrandVisualCard) => void;
  className?: string;
}

export const BrandVisualCardView: React.FC<BrandVisualCardViewProps> = ({
  card,
  isRTL = false,
  onSelect,
  className = ''
}) => {
  return (
    <div
      onClick={() => onSelect && onSelect(card)}
      className={`relative w-full max-w-[480px] mx-auto rounded-2xl overflow-hidden bg-white shadow-[0_10px_35px_rgba(42,32,28,0.1)] border border-[#EBDDD1] select-none group transition-all duration-300 ${
        onSelect ? 'cursor-pointer hover:shadow-[0_20px_50px_rgba(184,78,54,0.18)] hover:-translate-y-1 hover:border-[#D9C4B5]' : ''
      } ${className}`}
    >
      {/* 1. Photography Container: 100% Clear, Sunlit & Vibrant (Zero Muddy Dark Overlays) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F4EDE5]">
        <img
          src={card.image}
          alt={card.headline1}
          className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Top Badges: Crisp White Frosted with Dark Typography for Flawless Contrast */}
        <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between pointer-events-none">
          {/* Card Number Pill */}
          <span className="px-2.5 py-1 rounded-md bg-white/95 backdrop-blur-md border border-[#EBDDD1] text-[#2A201C] font-mono text-xs font-bold tracking-wider shadow-sm">
            {card.number}
          </span>

          {/* Sokhna Tag */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#EBDDD1] text-[#B84E36] text-[11px] font-bold tracking-wider uppercase shadow-sm">
            <MapPin className="w-3 h-3 text-[#B84E36]" />
            <span>{isRTL ? (card.locationAr || 'العين السخنة') : (card.location || 'Ain Sokhna')}</span>
          </span>
        </div>
      </div>

      {/* 2. Editorial Plaque: High-Contrast Crisp Typography (Deep Espresso on Warm Porcelain) */}
      <div className="p-5 sm:p-6 bg-[#FAF6F0] border-t border-[#EBDDD1]/80">
        <div className="flex items-start justify-between gap-4">
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            {/* Category / Setting Tag */}
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#B84E36] font-bold block mb-1.5">
              {isRTL ? card.categoryAr : card.categoryEn}
            </span>

            {isRTL ? (
              /* Arabic Typography */
              <div dir="rtl">
                <h3 className="font-arabic-editorial text-2xl font-bold text-[#2A201C] leading-snug">
                  {card.headlineAr || card.taglineAr}
                </h3>
                <p className="font-arabic-editorial text-base text-[#7E6C60] font-medium mt-1">
                  "{card.taglineAr}"
                </p>
              </div>
            ) : (
              /* English Typography */
              <div>
                <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold text-[#2A201C] leading-tight">
                  {card.headline1}{' '}
                  <span className="font-brand-script text-2xl sm:text-3xl text-[#B84E36] font-normal italic inline-block mx-0.5">
                    {card.headlineScript}
                  </span>{' '}
                  {card.headline3}
                </h3>
                <p className="font-brand-script text-xl text-[#7E6C60] mt-1.5">
                  "{card.taglineEn}"
                </p>
              </div>
            )}
          </div>

          {/* Tactile Circular Explore Button */}
          <div className="shrink-0 w-9 h-9 rounded-full bg-white border border-[#EBDDD1] text-[#2A201C] flex items-center justify-center group-hover:bg-[#B84E36] group-hover:text-white group-hover:border-[#B84E36] transition-all duration-300 shadow-xs mt-1">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

