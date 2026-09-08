import React, { useState } from 'react';
import { useMomentsImagery } from '../utils/momentsStorage';
import { useAuth } from '../context/AuthContext';
import { MomentsUploadStudioModal } from './MomentsUploadStudioModal';
import { ArrowRight, Camera, Sparkles } from 'lucide-react';

interface CanonicalMomentsGridProps {
  navigate?: (path: string) => void;
  lang?: 'en' | 'ar';
}

export const CanonicalMomentsGrid: React.FC<CanonicalMomentsGridProps> = ({
  navigate,
  lang = 'en'
}) => {
  const { user } = useAuth();
  const isAdmin = Boolean(user && (user.role === 'admin' || user.role === 'operator'));
  const { cards, customMap, hasAnyCustom } = useMomentsImagery();
  const [isStudioOpen, setIsStudioOpen] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | undefined>(undefined);
  const isRTL = lang === 'ar';

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#EBDDD1]">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#C8A15A]">
          {isRTL ? 'المعايير المعمارية' : 'The Experiential Standard'}
        </span>
        <h2 className="font-serif-editorial text-3xl md:text-5xl text-[#2A201C] mt-4 mb-4 leading-tight">
          {isRTL ? '٦ لحظات ليتل هت' : '6 Canonical Little Hut Moments'}
        </h2>
        <p className="text-sm text-[#5C4B40] font-medium leading-relaxed max-w-lg mx-auto">
          {isRTL 
            ? 'مساحات مصممة لاحتضان أثمن اللحظات الإنسانية. من دفء الصباح الباكر إلى سكون النجوم.' 
            : 'Spaces architected to hold the most precious human experiences. From the warmth of slow mornings to the profound silence of starlit nights.'}
        </p>

        {/* Upload & Customize Direct CTA Button (Admin Only) */}
        {isAdmin && (
          <div className="mt-6 flex items-center justify-center">
            <button
              onClick={() => {
                setSelectedCardId('card-01');
                setIsStudioOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FAF0EB] hover:bg-[#B84E36] text-[#B84E36] hover:text-white border border-[#B84E36]/30 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer group"
            >
              <Camera className="w-4 h-4 text-[#B84E36] group-hover:text-white transition-colors" />
              <span>{isRTL ? 'رفع وتخصيص صور اللحظات' : 'Upload / Customize Moments Photos'}</span>
              {hasAnyCustom && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* The Curated 6-Moment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {cards.map((card) => {
          const slug = card.matchedMomentId.replace('_', '-');
          const isCustom = Boolean(customMap[card.id] || customMap[card.matchedMomentId]);
          
          return (
            <div 
              key={card.id} 
              onClick={() => navigate && navigate(`/moments/${slug}`)}
              className="group cursor-pointer flex flex-col relative"
            >
              {/* Image Container with precise aspect ratio and atmospheric overlay */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#F4EDE5] mb-5 shadow-sm group-hover:shadow-lg transition-all duration-500">
                <img
                  src={card.image}
                  alt={isRTL ? card.headlineAr : `${card.headline1} ${card.headline3}`}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Subtle warm tint overlay */}
                <div className="absolute inset-0 bg-[#B84E36]/5 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Top Badges: Number & Quick Upload Trigger */}
                <div className="absolute top-4 inset-x-4 flex items-center justify-between z-10">
                  <div className="w-8 h-8 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center border border-[#EBDDD1] shadow-sm">
                    <span className="font-mono text-xs font-bold text-[#B84E36]">{card.number}</span>
                  </div>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCardId(card.id);
                        setIsStudioOpen(true);
                      }}
                      className="p-1.5 px-2.5 rounded-lg bg-white/95 hover:bg-white text-[#2A201C] hover:text-[#B84E36] backdrop-blur-sm border border-[#EBDDD1] shadow-sm flex items-center gap-1.5 text-[10px] font-bold transition-all cursor-pointer"
                      title={isRTL ? 'تغيير صورة هذه اللحظة' : 'Upload custom photo for this moment'}
                    >
                      <Camera className="w-3.5 h-3.5 text-[#B84E36]" />
                      <span>{isCustom ? (isRTL ? 'تعديل' : 'Customized') : (isRTL ? 'رفع' : 'Upload')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Editorial Typography Section */}
              <div className={`px-2 flex flex-col grow ${isRTL ? 'text-right' : 'text-left'}`}>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#C8A15A] font-bold block mb-2">
                  {isRTL ? card.categoryAr : card.categoryEn}
                </span>
                
                {isRTL ? (
                  <h3 className="font-arabic-editorial text-2xl font-bold text-[#2A201C] mb-2 group-hover:text-[#B84E36] transition-colors" dir="rtl">
                    {card.headlineAr}
                  </h3>
                ) : (
                  <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#2A201C] mb-2 group-hover:text-[#B84E36] transition-colors">
                    {card.headline1}{' '}
                    <span className="font-brand-script text-3xl font-normal text-[#B84E36] italic lowercase mr-1">
                      {card.headlineScript}
                    </span>
                    {card.headline3}
                  </h3>
                )}
                
                <p className="text-sm text-[#7E6C60] leading-relaxed italic mt-1 flex-grow">
                  "{isRTL ? card.taglineAr : card.taglineEn}"
                </p>

                <div className="mt-5 pt-4 border-t border-[#EBDDD1] flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-[#2A201C] group-hover:text-[#B84E36] transition-colors">
                  <span>{isRTL ? 'استكشف اللحظة' : 'Explore Moment'}</span>
                  <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Studio Modal - ADMIN ONLY */}
      {isAdmin && (
        <MomentsUploadStudioModal
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
          lang={lang}
          initialCardId={selectedCardId}
        />
      )}
    </section>
  );
};
