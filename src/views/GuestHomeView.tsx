import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useOperating } from '../context/OperatingContext';
import { publicCardFacts } from '../lib/lh-core';
import { Compass, Sparkles, ArrowRight, ShieldCheck, Sun, BookOpen, Coffee, Waves, Building2, Plus, Info } from 'lucide-react';
import { BrandMomentsGallery } from '../components/BrandMomentsGallery';
import { CanonicalMomentsGrid } from '../components/CanonicalMomentsGrid';

interface GuestHomeViewProps {
  navigate: (path: string) => void;
}

export const GuestHomeView: React.FC<GuestHomeViewProps> = ({ navigate }) => {
  const { lang, t, isRTL } = useAuth();
  const { mode, setMode, dataset: { properties } } = useOperating();
  const [selectedFilter, setSelectedFilter] = useState<string>('all');

  const seawardProp = properties.find(p => p.id === 'azha_aquila_standalone') || properties.find(p => p.id === 'seaward_library') || properties[0];
  const seawardFacts = seawardProp ? publicCardFacts(seawardProp) : null;

  const filteredProperties = properties.filter(p => {
    const facts = publicCardFacts(p);
    if (!facts.visible) return false;
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'azha') {
      return (
        p.id.toLowerCase().includes('azha') ||
        p.location.toLowerCase().includes('azha') ||
        p.name.toLowerCase().includes('azha')
      );
    }
    if (selectedFilter === 'sokhna_redsea') {
      return (
        p.location.toLowerCase().includes('sokhna') ||
        p.location.toLowerCase().includes('red sea') ||
        p.location.toLowerCase().includes('gouna') ||
        p.location.toLowerCase().includes('marsa alam') ||
        p.location.toLowerCase().includes('soma')
      );
    }
    if (selectedFilter === 'north_coast') {
      return (
        p.location.toLowerCase().includes('north coast') ||
        p.location.toLowerCase().includes('alexandria') ||
        p.location.toLowerCase().includes('ras el hekma') ||
        p.location.toLowerCase().includes('sidi heneish') ||
        p.location.toLowerCase().includes('almaza')
      );
    }
    if (selectedFilter === 'sinai_nile') {
      return (
        p.location.toLowerCase().includes('sinai') ||
        p.location.toLowerCase().includes('dahab') ||
        p.location.toLowerCase().includes('aswan') ||
        p.location.toLowerCase().includes('cairo') ||
        p.location.toLowerCase().includes('sudr')
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF5EE]">
      {/* 1. Cinematic Hero Section with Little Hut Vacations Brand Identity */}
      <section className="relative h-[85vh] min-h-[580px] flex items-center justify-center overflow-hidden">
        <img
          src={"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=2000"}
          alt="Little Hut Vacations Coastal Villa"
          className="absolute inset-0 w-full h-full object-cover"
        />
        
        {/* Subtle, Warm Cinematic Scrim for Perfect Contrast without Muddying the Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1F1714]/90 via-[#1F1714]/40 to-black/25 pointer-events-none"></div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto space-y-5">
          {/* Eyebrow badge with arch logo */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-semibold tracking-[0.25em] uppercase shadow-sm">
            <div />
            <span className="font-semibold">{lang === 'ar' ? 'ليتل هت للإجازات • العين السخنة وسواحل مصر' : 'LITTLE HUT VACATIONS • AIN SOKHNA & COASTS'}</span>
          </div>

          {/* Signature 3-tier Headline Lockup with High-Contrast Typography */}
          {lang === 'ar' ? (
            <div className="space-y-1">
              <h1 className="font-arabic-editorial text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                صباح هادئ.
              </h1>
              <div className="font-arabic-editorial text-3xl sm:text-5xl md:text-6xl text-[#F9DDD3] font-medium my-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                بلا عجلة.
              </div>
              <h2 className="font-arabic-editorial text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                نحن فقط.
              </h2>
            </div>
          ) : (
            <div className="space-y-1">
              <h1 className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                Slow mornings.
              </h1>
              <div className="font-brand-script text-4xl sm:text-5xl md:text-6xl text-[#F9DDD3] italic font-normal my-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                No rush.
              </div>
              <h2 className="font-serif-editorial text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.7)]">
                Just us.
              </h2>
            </div>
          )}

          <div className="flex justify-center my-2">
            <div />
          </div>

          <p className={`${isRTL ? 'font-arabic-editorial text-2xl sm:text-3xl' : 'font-brand-script text-3xl sm:text-4xl'} text-[#F9DDD3] font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`}>
            {lang === 'ar' ? 'احجز الإحساس، وليس فقط الإقامة' : 'Book the feeling, not just the stay.'}
          </p>

          <p className="text-xs sm:text-sm font-medium text-white/95 max-w-xl mx-auto leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            {lang === 'ar'
              ? 'مجموعة هادئة من المنازل الساحلية الموثقة لنور الفجر، والموائد المتأنية، وسكينة البحر الأحمر.'
              : 'A quiet collection of verified coastal homes vetted for dawn stillness, unhurried dinners, and genuine sanctuary.'}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {seawardProp && (
              <button
                id="cta-discover-stays"
                onClick={() => navigate(`/homes/${seawardProp.slug}`)}
                className="w-full sm:w-auto px-8 py-4 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs uppercase font-bold tracking-[0.2em] transition-all shadow-lg hover:shadow-xl rounded-sm cursor-pointer"
              >
                {t.hero.ctaExplore}
              </button>
            )}

            <button
              id="cta-slow-morning"
              onClick={() => navigate('/moments/slow-morning')}
              className="w-full sm:w-auto px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/40 text-white text-xs uppercase font-bold tracking-[0.2em] transition-all shadow-md rounded-sm cursor-pointer"
            >
              {t.hero.ctaMoment}
            </button>
          </div>
        </div>

        {/* Hero Bottom Stats Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-[#2A201C]/90 backdrop-blur-md border-t border-white/15 py-3.5 px-6 hidden sm:block">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-xs tracking-wider uppercase text-white/95">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F5C767]" />
              {t.hero.stats.verifiedHomes}
            </span>
            <span className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#F5C767]" />
              {t.hero.stats.moments}
            </span>
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#F5C767]" />
              {t.hero.stats.seal}
            </span>
          </div>
        </div>
      </section>

      {/* Mode Switcher Callout Banner (if in Live Mode with no inventory) */}
      {mode === 'live' && properties.length === 0 && (
        <section className="bg-[#FAF0EB] border-b border-[#EBDDD1] py-4 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
            <div className="flex items-center gap-2.5 text-[#B84E36]">
              <Info className="w-4 h-4 shrink-0" />
              <span className="font-medium">
                {lang === 'ar' 
                  ? 'أنت حالياً في وضع التشغيل الفعلي (Live). لا توجد عقارات وهمية مسبقة.' 
                  : 'You are currently in Live Mode. Zero fictional demo records exist here.'}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMode('demo')}
                className="px-3 py-1 bg-[#2A201C] text-white font-bold rounded-xs tracking-wider uppercase text-[11px] hover:bg-black transition-colors cursor-pointer"
              >
                {lang === 'ar' ? 'عرض النموذج التجريبي المكتمل' : 'Explore Complete Demo Mode'}
              </button>
              <button
                onClick={() => navigate('/list-property')}
                className="px-3 py-1 bg-[#B84E36] text-white font-bold rounded-xs tracking-wider uppercase text-[11px] hover:bg-[#973A24] transition-colors cursor-pointer"
              >
                {lang === 'ar' ? '+ إضافة أول عقار حقيقي' : '+ Onboard Real Property'}
              </button>
            </div>
          </div>
        </section>
      )}

      {/* 2. Authentic Brand Visual Moments Showcase (12 Little Hut Vacations Cards) */}
      <BrandMomentsGallery navigate={navigate} lang={lang} />

      {/* 3. Featured Verified Property (if available) */}
      {seawardProp && seawardFacts && (
        <section className="py-20 bg-white border-y border-[#EBDDD1]">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#C8A15A]">
                    {seawardFacts.badge}
                  </span>
                  {mode === 'demo' && (
                    <span className="px-2 py-0.5 bg-[#FAF0EB] text-[#B84E36] border border-[#EBDDD1] text-[10px] font-mono font-bold uppercase rounded-xs">
                      DEMO RECORD
                    </span>
                  )}
                </div>
                <h2 className="font-serif-editorial text-3xl md:text-4xl text-[#2A201C]">
                  {lang === 'ar' ? seawardProp.nameAr : seawardProp.name}
                </h2>
                <p className="text-sm text-[#7E6C60] mt-1">
                  {lang === 'ar' ? seawardProp.locationAr : seawardProp.location}
                </p>
              </div>

              <button
                onClick={() => navigate(`/homes/${seawardProp.slug}`)}
                className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#2A201C] hover:text-[#B84E36] transition-colors cursor-pointer"
              >
                <span>{lang === 'ar' ? 'عرض تفاصيل المنزل الموثق' : 'View Verified Home Details'}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="aspect-[16/10] overflow-hidden rounded-sm border border-[#EBDDD1] group cursor-pointer" onClick={() => navigate(`/homes/${seawardProp.slug}`)}>
                  <img
                    src={seawardProp.heroImage}
                    alt={seawardProp.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <p className="text-base text-[#2A201C] leading-relaxed font-light italic">
                  "{lang === 'ar' ? seawardProp.taglineAr : seawardProp.tagline}"
                </p>

                <div className="space-y-4 pt-2">
                  <div className="p-4 bg-[#FAF5EE] border border-[#EBDDD1] rounded-xs">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#B84E36] block mb-1">
                      {lang === 'ar' ? 'اللحظات الموثقة' : 'Proven Moments'}
                    </span>
                    <p className="text-sm font-serif-editorial text-[#2A201C]">
                      {lang === 'ar' ? 'الصباح الهادئ • القراءة الصامتة • ظهيرة حافية القدمين' : 'Slow Morning • The Long Sit • Barefoot Afternoon'}
                    </p>
                  </div>

                  <div className="p-4 bg-[#FAF5EE] border border-[#EBDDD1] rounded-xs">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#B84E36] block mb-1">
                      {lang === 'ar' ? 'ضمان الختم' : 'Seal Assurance'}
                    </span>
                    <p className="text-xs text-[#7E6C60]">
                      {lang === 'ar' ? 'اجتياز كامل لبوابات TRUST الست ودرع الأمان SHIELD دون انحراف.' : 'Zero drift recorded. 100% adherence to Little Hut verification standard.'}
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    id="btn-request-seaward-home"
                    onClick={() => navigate(`/homes/${seawardProp.slug}`)}
                    className="w-full py-4 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs uppercase font-bold tracking-[0.2em] transition-all cursor-pointer rounded-sm"
                  >
                    {t.property.requestStayTitle}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. Complete Verified Properties Collection */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#B84E36] block mb-2">
              {lang === 'ar' ? 'مجموعة الملاذات الموثقة' : 'The Verified Collection'}
            </span>
            <h2 className="font-serif-editorial text-3xl md:text-4xl text-[#2A201C]">
              {lang === 'ar' ? 'منازل ساحلية وهادئة مجازة ميدانياً' : 'Curated Architectural Sanctuaries'}
            </h2>
            <p className="text-[#5C4B40] text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              {lang === 'ar'
                ? 'كل عقار في هذه المجموعة يمر عبر مراحل التدقيق الميداني ويوثق لحظات إنسانية ومعمارية فريدة.'
                : 'Each residence has undergone physical acoustic, privacy, and architectural audit with proven moments.'}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#EBDDD1] text-xs font-bold text-[#2A201C] uppercase tracking-wider rounded-xs self-start md:self-auto shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#6E7C62]" />
            <span>
              {lang === 'ar' 
                ? `${properties.filter(p => p.lifecycle === 'live').length} منازل معتمدة بالختم` 
                : `${properties.filter(p => p.lifecycle === 'live').length} Seal-Certified Residences`}
            </span>
          </div>
        </div>

        {/* Destination Filter Tabs */}
        {properties.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5 mb-12 pb-2">
            {[
              { id: 'all', labelEn: 'All Sanctuaries', labelAr: 'جميع الملاذات' },
              { id: 'azha', labelEn: '✨ Azha (Ain Sokhna & North)', labelAr: '✨ أزها (السخنة والساحل)' },
              { id: 'sokhna_redsea', labelEn: 'Ain Sokhna & Red Sea', labelAr: 'العين السخنة والبحر الأحمر' },
              { id: 'north_coast', labelEn: 'North Coast & Alex', labelAr: 'الساحل الشمالي والإسكندرية' },
              { id: 'sinai_nile', labelEn: 'Sinai & Nile Valley', labelAr: 'سيناء ووادي النيل' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all rounded-xs cursor-pointer border ${
                  selectedFilter === tab.id
                    ? 'bg-[#2A201C] text-[#FAF5EE] border-[#2A201C] shadow-xs'
                    : 'bg-white text-[#5C4B40] border-[#EBDDD1] hover:text-[#2A201C] hover:border-[#B84E36]'
                }`}
              >
                {lang === 'ar' ? tab.labelAr : tab.labelEn}
              </button>
            ))}
          </div>
        )}

        {/* Empty State when in Live Mode with zero records */}
        {filteredProperties.length === 0 ? (
          <div className="p-16 bg-white border border-[#EBDDD1] rounded-sm text-center my-8 shadow-xs">
            <Building2 className="w-12 h-12 text-[#7E6C60]/40 mx-auto mb-4" />
            <h3 className="font-serif-editorial text-2xl text-[#2A201C] mb-2">
              {t.emptyStates.noHomesLive}
            </h3>
            <p className="text-sm text-[#5C4B40] max-w-md mx-auto mb-6 leading-relaxed">
              {t.emptyStates.noPropertiesSubtitle}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigate('/list-property')}
                className="px-6 py-3 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold uppercase tracking-wider rounded-xs transition-colors shadow-xs"
              >
                {t.emptyStates.onboardCTA}
              </button>
              <button
                onClick={() => setMode('demo')}
                className="px-6 py-3 bg-[#2A201C] hover:bg-black text-[#FAF5EE] text-xs font-bold uppercase tracking-wider rounded-xs transition-colors"
              >
                {lang === 'ar' ? 'عرض الوضع التجريبي المكتمل' : 'Switch to Demo Mode'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => {
              const facts = publicCardFacts(property);
              const isJoining = property.publicState === 'joining' || property.lifecycle === 'shortlisted';
              
              return (
                <div
                  key={property.id}
                  onClick={() => navigate(`/homes/${property.slug}`)}
                  className="bg-white border border-[#EBDDD1] hover:border-[#B84E36] transition-all duration-300 group cursor-pointer flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative aspect-[16/11] overflow-hidden bg-[#FAF5EE]">
                      <img
                        src={property.heroImage}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs backdrop-blur-md ${
                          isJoining
                            ? 'bg-amber-900/90 text-amber-50 border border-amber-300/40 shadow-xs'
                            : 'bg-[#2A201C]/90 text-[#FAF5EE] border border-white/25 shadow-xs'
                        }`}>
                          {isJoining
                            ? (lang === 'ar' ? 'ينضم إلى ليتل هت' : 'Joining Little Hut')
                            : (lang === 'ar' ? 'موثق بالختم' : 'Seal Certified')}
                        </span>
                        
                        {mode === 'demo' && (
                          <span className="px-2 py-0.5 bg-[#B84E36] text-white text-[9px] font-mono font-bold uppercase rounded-xs shadow-xs">
                            DEMO
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#B84E36] font-bold block mb-1">
                        {lang === 'ar' ? property.locationAr : property.location}
                      </span>
                      <h3 className="font-serif-editorial text-2xl text-[#2A201C] group-hover:text-[#B84E36] transition-colors leading-tight mb-2">
                        {lang === 'ar' ? property.nameAr : property.name}
                      </h3>
                      <p className="text-xs text-[#5C4B40] line-clamp-2 leading-relaxed italic mb-4">
                        "{lang === 'ar' ? property.taglineAr : property.tagline}"
                      </p>

                      {/* Canonical Moment states if available */}
                      {property.canonicalMoments && (
                        <div className="pt-3 border-t border-[#FAF5EE] flex flex-wrap gap-1.5">
                          {Array.isArray(property.canonicalMoments)
                            ? property.canonicalMoments
                                .filter(m => m.state === 'enabled')
                                .slice(0, 3)
                                .map(m => (
                                  <span
                                    key={m.momentId}
                                    className="px-2 py-0.5 bg-[#FAF5EE] border border-[#EBDDD1] text-[10px] text-[#2A201C] rounded-xs capitalize font-semibold"
                                  >
                                    {lang === 'ar' ? m.nameAr || m.name : m.name}
                                  </span>
                                ))
                            : Object.entries(property.canonicalMoments as Record<string, string>)
                                .filter(([_, state]) => state === 'enabled')
                                .slice(0, 3)
                                .map(([mId]) => (
                                  <span
                                    key={mId}
                                    className="px-2 py-0.5 bg-[#FAF5EE] border border-[#EBDDD1] text-[10px] text-[#2A201C] rounded-xs capitalize font-semibold"
                                  >
                                    {mId.replace('_', ' ')}
                                  </span>
                                ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="px-6 py-4 bg-[#FAF5EE]/70 border-t border-[#EBDDD1] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#2A201C] group-hover:text-[#B84E36] transition-colors">
                    <span>
                      {isJoining
                        ? (lang === 'ar' ? 'عرض تفاصيل الانضمام' : 'View Joining Details')
                        : (lang === 'ar' ? 'طلب إقامة موثقة' : 'Request Verified Stay')}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. The 6 Canonical Moments Grid */}
      <CanonicalMomentsGrid navigate={navigate} lang={lang} />

      <section className="px-6 md:px-12 max-w-7xl mx-auto pb-24">
        {/* Real Property Onboarding Callout */}
        <div className="mt-16 p-8 md:p-12 bg-[#2A201C] text-white rounded-sm border border-[#3E312B] flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
          <div className="space-y-3 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8A15A]/25 text-[#F5C767] border border-[#C8A15A]/40 text-[10px] uppercase font-bold tracking-widest rounded-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'لأصحاب الفيلات والشاليهات' : 'For Residence Owners'}</span>
            </div>
            <h3 className="font-serif-editorial text-2xl md:text-3xl text-white">
              {lang === 'ar' ? 'تمتلك فيلا أو شاليه في أزها أو الساحل؟' : 'Own a Villa or Chalet in Azha or Egypt?'}
            </h3>
            <p className="text-xs text-[#DECBB9] leading-relaxed">
              {lang === 'ar'
                ? 'سجّل بيانات عقارك الحقيقي ومواصفات الشاطئ واللاجون لتحصل على ختم الجودة والتدقيق الميداني والإدارة التشغيلية الفورية.'
                : 'Submit your authentic property specs, private lagoon beach access, and calendar authority to qualify for the Little Hut Seal and verified guest bookings.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/list-property')}
            className="px-8 py-3.5 bg-[#B84E36] hover:bg-[#973A24] text-white text-xs font-bold uppercase tracking-widest transition-all rounded-xs shadow-md whitespace-nowrap flex items-center gap-2 cursor-pointer"
          >
            <span>{lang === 'ar' ? 'أدرج وثّق عقارك الآن' : 'List & Qualify Property'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
