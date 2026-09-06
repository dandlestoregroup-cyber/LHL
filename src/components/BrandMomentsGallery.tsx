import React, { useState, useEffect, useCallback } from 'react';
import { BrandVisualCard } from '../data/brandIdentityCards';
import { BrandVisualCardView } from './BrandVisualCardView';
import { MomentsUploadStudioModal } from './MomentsUploadStudioModal';
import { useMomentsImagery } from '../utils/momentsStorage';
import { useAuth } from '../context/AuthContext';
import { Sparkles, X, ArrowRight, Eye, ChevronLeft, ChevronRight, LayoutGrid, Layers, MapPin, Camera, Upload } from 'lucide-react';

interface BrandMomentsGalleryProps {
  navigate?: (path: string) => void;
  lang?: 'en' | 'ar';
}

export const BrandMomentsGallery: React.FC<BrandMomentsGalleryProps> = ({
  navigate,
  lang = 'en'
}) => {
  const { user } = useAuth();
  const isAdmin = Boolean(user && user.role !== 'guest');
  const { cards: allCards, hasAnyCustom } = useMomentsImagery();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [activeModalCard, setActiveModalCard] = useState<BrandVisualCard | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'spotlight'>('spotlight');
  const [carouselIndex, setCarouselIndex] = useState<number>(0);
  const [isStudioOpen, setIsStudioOpen] = useState<boolean>(false);
  const [studioInitialCardId, setStudioInitialCardId] = useState<string | undefined>(undefined);

  const isRTL = lang === 'ar';

  const filterOptions = [
    { id: 'all', labelEn: 'All 6 Brand Moments', labelAr: 'جميع اللحظات الـ ٦' },
    { id: 'sokhna', labelEn: 'Ain Sokhna & Red Sea', labelAr: 'العين السخنة والبحر الأحمر' },
    { id: 'morning', labelEn: 'Slow Mornings & Rest', labelAr: 'صباح هادئ وسكينة' },
    { id: 'family', labelEn: 'Family & Children', labelAr: 'العائلة ومغامرات الصغار' },
    { id: 'evening', labelEn: 'Sunset & Under Stars', labelAr: 'الغروب وسكينة النجوم' },
  ];

  const filteredCards = allCards.filter((card) => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'sokhna') {
      return card.location?.includes('AIN SOKHNA') || card.location?.includes('Ain Sokhna') || card.headlineScript.includes('Red Sea');
    }
    if (selectedFilter === 'morning') {
      return card.matchedMomentId === 'slow_morning' || card.id === 'card-08';
    }
    if (selectedFilter === 'family') {
      return card.matchedMomentId === 'family_play' || card.id === 'card-07' || card.id === 'card-16';
    }
    if (selectedFilter === 'evening') {
      return card.matchedMomentId === 'under_stars' || card.matchedMomentId === 'the_long_sit';
    }
    return true;
  });

  const activeCarouselCard = filteredCards[carouselIndex] || filteredCards[0];

  const handlePrev = useCallback(() => {
    setCarouselIndex((prev) => (prev > 0 ? prev - 1 : filteredCards.length - 1));
  }, [filteredCards.length]);

  const handleNext = useCallback(() => {
    setCarouselIndex((prev) => (prev < filteredCards.length - 1 ? prev + 1 : 0));
  }, [filteredCards.length]);

  // Keyboard navigation for carousel & modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalCard) {
        if (e.key === 'Escape') setActiveModalCard(null);
        return;
      }
      if (viewMode === 'spotlight') {
        if (e.key === 'ArrowLeft') {
          isRTL ? handleNext() : handlePrev();
        } else if (e.key === 'ArrowRight') {
          isRTL ? handlePrev() : handleNext();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalCard, viewMode, isRTL, handleNext, handlePrev]);

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Section Editorial Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-[#FAF0EB] text-[#B84E36] border border-[#EBDDD1] text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.25em] rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'إحنا مش بنبيع Real Estate — إحنا بنبيع تجربة' : 'We don\'t sell real estate — We sell a feeling'}</span>
        </div>

        <h2 className="font-serif-editorial text-2xl sm:text-4xl md:text-5xl font-bold text-[#2A201C] tracking-tight">
          {lang === 'ar' ? 'شعور يبدأ في الخيال، ويعيش في الذاكرة' : 'A feeling that begins in the mind, and lingers forever.'}
        </h2>

        <p className={`${isRTL ? 'font-arabic-editorial text-xl sm:text-2xl font-bold' : 'font-brand-script text-2xl sm:text-3xl'} text-[#B84E36] mt-2`}>
          {lang === 'ar' ? 'المكان مش هو المنتج.. المكان هو اللي بيخلّي التجربة دي ممكنة' : 'The house is not the product — it is simply what makes the moment possible.'}
        </p>

        <div className="flex items-center justify-center gap-2 my-3 text-[#B84E36]">
          <div className="w-8 h-[1px] bg-[#B84E36]/40" />
          <Sparkles className="w-3.5 h-3.5 text-[#C8A15A]" />
          <div className="w-8 h-[1px] bg-[#B84E36]/40" />
        </div>

        <p className="text-xs sm:text-sm text-[#5C4B40] max-w-2xl mx-auto leading-relaxed font-medium">
          {lang === 'ar'
            ? 'كل صورة وكل كلمة تزرع إحساساً في خيالك: صباح ماشي على مهله، فطار اتأخر لأن محدش مستعجل، لعبة بدأت مع الأولاد والأب اندمج فيها، قعدة بلكونة طولت، وليلة هادية تحت النجوم خلت كل حاجة تقيلة تبان أخف.'
            : 'Every frame and phrase plants a quiet mood: an unhurried morning, breakfast that ran late because no one rushed, a game where dad got more invested than the kids, a sunset balcony sit, and a starry night that lifts every weight.'}
        </p>
      </div>

      {/* Control Bar: Filter Tabs & View Mode Switcher + Upload Studio Action */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {filterOptions.map((f) => {
            const isActive = selectedFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => {
                  setSelectedFilter(f.id);
                  setCarouselIndex(0);
                }}
                className={`px-3 py-1.5 text-xs font-semibold tracking-wider rounded-full transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#B84E36] text-white shadow-xs'
                    : 'bg-white text-[#2A201C] hover:bg-[#FAF0EB] border border-[#EBDDD1]'
                }`}
              >
                {lang === 'ar' ? f.labelAr : f.labelEn}
              </button>
            );
          })}
        </div>

        {/* Actions: Upload Studio Button (Admin Only) & View Mode Switcher */}
        <div className="flex items-center gap-3">
          {/* Direct Upload Studio Trigger Button - ADMIN ONLY */}
          {isAdmin && (
            <button
              onClick={() => {
                setStudioInitialCardId(activeCarouselCard?.id || 'card-01');
                setIsStudioOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FAF0EB] hover:bg-[#B84E36] text-[#B84E36] hover:text-white border border-[#B84E36]/30 text-xs font-bold rounded-lg transition-all shadow-2xs cursor-pointer"
              title={lang === 'ar' ? 'رفع وتخصيص صور اللحظات (خاص بالإدارة)' : 'Upload & Customize Moments Photos (Admin Only)'}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'رفع وتخصيص الصور' : 'Upload / Customize Photos'}</span>
              {hasAnyCustom && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white" />
              )}
            </button>
          )}

          {/* View Mode Switcher (Spotlight / Carousel vs Grid) */}
          <div className="inline-flex items-center rounded-lg bg-white border border-[#EBDDD1] p-1 shadow-2xs">
            <button
              onClick={() => setViewMode('spotlight')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'spotlight'
                  ? 'bg-[#2A201C] text-white shadow-xs'
                  : 'text-[#7E6C60] hover:text-[#2A201C]'
              }`}
              title="Full Spotlight View"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'عرض مخصص' : 'Spotlight'}</span>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#2A201C] text-white shadow-xs'
                  : 'text-[#7E6C60] hover:text-[#2A201C]'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'شبكة' : 'Grid'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Spotlight / Story Carousel View (Clean full-card view without edge clipping) */}
      {viewMode === 'spotlight' && activeCarouselCard && (
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <div className="relative w-full flex items-center justify-center">
            {/* Prev Button */}
            <button
              onClick={handlePrev}
              className="absolute -left-3 sm:-left-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#2A201C] border border-[#EBDDD1] shadow-md flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
              aria-label="Previous card"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Main Featured Card */}
            <div className="w-full">
              <BrandVisualCardView
                card={activeCarouselCard}
                isRTL={isRTL}
                onSelect={(c) => setActiveModalCard(c)}
                onUploadClick={isAdmin ? (c) => {
                  setStudioInitialCardId(c.id);
                  setIsStudioOpen(true);
                } : undefined}
              />
            </div>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute -right-3 sm:-right-12 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#2A201C] border border-[#EBDDD1] shadow-md flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
              aria-label="Next card"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Under Card Info Bar */}
          <div className="mt-4 flex items-center justify-between w-full px-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-[#B84E36] bg-[#FAF0EB] px-2 py-0.5 rounded-sm border border-[#EBDDD1]">
                {carouselIndex + 1} / {filteredCards.length}
              </span>
              <span className="font-serif-editorial text-[#7E6C60] italic">
                {lang === 'ar' ? activeCarouselCard.categoryAr : activeCarouselCard.categoryEn}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {isAdmin && (
                <button
                  onClick={() => {
                    setStudioInitialCardId(activeCarouselCard.id);
                    setIsStudioOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-[#7E6C60] hover:text-[#B84E36] font-bold tracking-wider uppercase text-[11px] cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تغيير الصورة' : 'Upload Photo'}</span>
                </button>
              )}

              <button
                onClick={() => setActiveModalCard(activeCarouselCard)}
                className="inline-flex items-center gap-1.5 text-[#B84E36] hover:text-[#973A24] font-bold tracking-wider uppercase text-[11px] cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'عرض التفاصيل' : 'Inspect Card'}</span>
              </button>
            </div>
          </div>

          {/* Dots Indicator & Filmstrip Navigator */}
          <div className="flex flex-col items-center gap-4 mt-6 w-full">
            {/* Dots */}
            <div className="flex items-center justify-center gap-1.5">
              {filteredCards.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    carouselIndex === idx
                      ? 'w-7 bg-[#B84E36]'
                      : 'w-2 bg-[#EBDDD1] hover:bg-[#DECBB9]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Curated Mini Thumbnail Filmstrip */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto max-w-full py-2 px-1 scrollbar-none">
              {filteredCards.map((c, idx) => (
                <button
                  key={c.id}
                  onClick={() => setCarouselIndex(idx)}
                  className={`relative shrink-0 w-11 h-14 rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
                    carouselIndex === idx
                      ? 'border-[#B84E36] shadow-md scale-110 ring-2 ring-[#B84E36]/20'
                      : 'border-[#EBDDD1] opacity-60 hover:opacity-95 hover:border-[#DECBB9]'
                  }`}
                  title={c.headline1}
                >
                  <img
                    src={c.image}
                    alt={c.headline1}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20" />
                  <span className="absolute bottom-0.5 right-1 font-mono text-[9px] font-bold text-white drop-shadow-xs">
                    {c.number}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCards.map((card) => (
            <div key={card.id} className="flex flex-col items-center">
              <BrandVisualCardView
                card={card}
                isRTL={isRTL}
                onSelect={(c) => setActiveModalCard(c)}
                onUploadClick={isAdmin ? (c) => {
                  setStudioInitialCardId(c.id);
                  setIsStudioOpen(true);
                } : undefined}
              />
              {/* Quick action beneath card */}
              <div className="mt-3 flex items-center justify-between w-full max-w-[500px] px-2 text-xs">
                <span className="font-serif-editorial text-[#7E6C60] italic">
                  {lang === 'ar' ? card.categoryAr : card.categoryEn}
                </span>
                <div className="flex items-center gap-3">
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setStudioInitialCardId(card.id);
                        setIsStudioOpen(true);
                      }}
                      className="inline-flex items-center gap-1 text-[#7E6C60] hover:text-[#B84E36] font-bold tracking-wider uppercase text-[11px] cursor-pointer"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'تغيير' : 'Upload'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => setActiveModalCard(card)}
                    className="inline-flex items-center gap-1 text-[#B84E36] hover:text-[#973A24] font-bold tracking-wider uppercase text-[11px] cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'عرض التفاصيل' : 'Inspect Card'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lightbox / Modal for Detail Inspection */}
      {activeModalCard && (
        <div 
          onClick={() => setActiveModalCard(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative bg-[#FAF5EE] rounded-2xl max-w-4xl w-full border border-[#EBDDD1] p-5 sm:p-8 shadow-2xl my-auto cursor-default"
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalCard(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-[#FAF0EB] text-[#2A201C] border border-[#EBDDD1] transition-colors shadow-sm cursor-pointer z-20"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
              {/* Card visual render */}
              <div className="lg:col-span-7 flex justify-center">
                <BrandVisualCardView 
                  card={activeModalCard} 
                  isRTL={isRTL}
                  onUploadClick={isAdmin ? (c) => {
                    setStudioInitialCardId(c.id);
                    setIsStudioOpen(true);
                  } : undefined}
                />
              </div>

              {/* Card Story & Actions */}
              <div className={`lg:col-span-5 space-y-4 sm:space-y-5 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#B84E36] font-bold">
                      {lang === 'ar' ? `لحظة ليتل هت رقم ${activeModalCard.number}` : `LITTLE HUT MOMENT ${activeModalCard.number}`}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#FAF0EB] text-[#B84E36] border border-[#EBDDD1] font-medium flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      {lang === 'ar' ? (activeModalCard.locationAr || 'العين السخنة') : (activeModalCard.location || 'Ain Sokhna')}
                    </span>
                  </div>

                  {lang === 'ar' ? (
                    <h3 className="font-arabic-editorial text-2xl sm:text-3xl font-bold text-[#2A201C] mt-2" dir="rtl">
                      {activeModalCard.headlineAr || activeModalCard.taglineAr}
                    </h3>
                  ) : (
                    <>
                      <h3 className="font-serif-editorial text-2xl sm:text-3xl font-bold text-[#2A201C]">
                        {activeModalCard.headline1}
                      </h3>
                      <div className="font-brand-script text-2xl text-[#B84E36]">
                        {activeModalCard.headlineScript} {activeModalCard.headline3}
                      </div>
                    </>
                  )}
                </div>

                {/* Single Language Feeling Tagline */}
                <div className="p-4 bg-white rounded-xl border border-[#EBDDD1]">
                  {lang === 'ar' ? (
                    <p className="font-arabic-editorial text-lg text-[#B84E36] font-bold" dir="rtl">
                      "{activeModalCard.taglineAr}"
                    </p>
                  ) : (
                    <p className="font-brand-script text-xl text-[#B84E36]">
                      "{activeModalCard.taglineEn}"
                    </p>
                  )}
                </div>

                {/* Sokhna Sanctuary Setting */}
                <div className="space-y-1 text-xs text-[#7E6C60]">
                  <span className="uppercase tracking-wider font-semibold block text-[#2A201C]">
                    {lang === 'ar' ? 'أجواء التجربة في العين السخنة:' : 'Sokhna Retreat Atmosphere:'}
                  </span>
                  <p>
                    {lang === 'ar'
                      ? 'مساحة خاصة مجهزة للاسترخاء التام، الهواء الساحلي العليل، وخصوصية متكاملة تليق بعائلتك.'
                      : 'Authentic private coastal space designed for calm mornings, barefoot relaxation, and unhurried coastal family hours.'}
                  </p>
                </div>

                {/* CTAs */}
                <div className="pt-3 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setActiveModalCard(null);
                      if (navigate) navigate('/homes/seaward-library');
                    }}
                    className="flex-1 py-3 px-4 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-colors text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{lang === 'ar' ? 'احجز هذا الإحساس' : 'Book this Feeling'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setStudioInitialCardId(activeModalCard.id);
                        setIsStudioOpen(true);
                      }}
                      className="py-3 px-4 bg-white hover:bg-[#FAF0EB] text-[#2A201C] hover:text-[#B84E36] border border-[#EBDDD1] text-xs font-bold uppercase tracking-wider rounded-md transition-colors cursor-pointer text-center flex items-center justify-center gap-1.5"
                    >
                      <Camera className="w-4 h-4 text-[#B84E36]" />
                      <span>{lang === 'ar' ? 'تغيير الصورة' : 'Change Photo'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Moments Upload Studio Modal - ADMIN ONLY */}
      {isAdmin && (
        <MomentsUploadStudioModal
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
          lang={lang}
          initialCardId={studioInitialCardId}
        />
      )}
    </section>
  );
};
