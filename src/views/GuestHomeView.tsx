import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { publicCardFacts } from '../lib/lh-core';
import { Compass, Sparkles, ArrowRight, ShieldCheck, Sun, BookOpen, Coffee, Waves } from 'lucide-react';

interface GuestHomeViewProps {
  navigate: (path: string) => void;
}

export const GuestHomeView: React.FC<GuestHomeViewProps> = ({ navigate }) => {
  const { lang, t, isRTL } = useAuth();
  const { properties } = useRequests();
  const [selectedFilter, setSelectedFilter] = React.useState<string>('all');

  const seawardProp = properties.find(p => p.id === 'azha_aquila_standalone') || properties.find(p => p.id === 'seaward_library') || properties[0];
  const seawardFacts = publicCardFacts(seawardProp);

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
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* 1. Cinematic Hero Section */}
      <section className="relative h-[82vh] min-h-[580px] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=2200"
          alt="Mediterranean Coastal Villa"
          className="absolute inset-0 w-full h-full object-cover brightness-[0.62] contrast-[1.05]"
        />
        
        {/* Subtle Warm Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D2340]/80 via-transparent to-[#0D2340]/40"></div>

        <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E7D6BF] text-xs font-semibold tracking-[0.25em] uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A15A]" />
            <span>{t.hero.eyebrow}</span>
          </div>

          <h1 className="font-serif-editorial text-5xl sm:text-6xl md:text-7xl lg:text-8xl italic font-normal tracking-tight leading-[1.1]">
            {t.hero.title}
          </h1>

          <p className="text-base sm:text-lg md:text-xl font-light text-[#FAF7F2]/90 max-w-2xl mx-auto leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              id="cta-discover-stays"
              onClick={() => navigate('/homes/seaward-library')}
              className="w-full sm:w-auto px-8 py-4 bg-[#B74C2B] hover:bg-[#B74C2B]/90 text-white text-xs uppercase font-bold tracking-[0.2em] transition-all shadow-md hover:shadow-lg"
            >
              {t.hero.ctaExplore}
            </button>

            <button
              id="cta-slow-morning"
              onClick={() => navigate('/moments/slow-morning')}
              className="w-full sm:w-auto px-8 py-4 bg-white/15 hover:bg-white/25 backdrop-blur-md border border-white/30 text-white text-xs uppercase font-bold tracking-[0.2em] transition-all"
            >
              {t.hero.ctaMoment}
            </button>
          </div>
        </div>

        {/* Hero Bottom Stats Bar */}
        <div className="absolute bottom-0 inset-x-0 bg-[#0D2340]/80 backdrop-blur-md border-t border-white/10 py-4 px-6 hidden sm:block">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-xs tracking-wider uppercase text-[#E7D6BF]">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C8A15A]" />
              {t.hero.stats.verifiedHomes}
            </span>
            <span className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-[#C8A15A]" />
              {t.hero.stats.moments}
            </span>
            <span className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#C8A15A]" />
              {t.hero.stats.seal}
            </span>
          </div>
        </div>
      </section>

      {/* 2. Proprietary Signature Moments — Orbit Treatment */}
      <section className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#B74C2B]">
            {t.moments.orbitTitle}
          </span>
          <h2 className="font-serif-editorial text-4xl md:text-5xl text-[#0D2340] mt-3 mb-4">
            {t.moments.slowMorningTitle}
          </h2>
          <p className="text-[#6D7480] text-base md:text-lg leading-relaxed">
            {t.moments.orbitSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Circular Orbit Composition */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-[300px] h-[300px] sm:w-[360px] sm:h-[360px]">
              {/* Concentric Golden Orbit Rings */}
              <div className="absolute inset-0 rounded-full border border-[#E7D6BF] orbit-ring"></div>
              <div className="absolute inset-4 rounded-full border border-dashed border-[#C8A15A]/40"></div>
              
              {/* Primary Orbit Image */}
              <div className="absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full overflow-hidden top-4 left-4 z-20 shadow-2xl border-4 border-white transition-transform hover:scale-105 duration-500">
                <img
                  src="https://images.unsplash.com/photo-1512918766671-ad6568148a1b?auto=format&fit=crop&q=80&w=800"
                  alt="Dawn Terrace"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Satellite Orbit Image 1 */}
              <div className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden bottom-2 right-2 z-30 shadow-xl border-4 border-white transition-transform hover:scale-110 duration-500">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=500"
                  alt="Linen and Morning Coffee"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Satellite Orbit Image 2 */}
              <div className="absolute w-20 h-20 rounded-full overflow-hidden top-0 right-8 z-10 shadow-md border-2 border-white opacity-80">
                <img
                  src="https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=400"
                  alt="Ocean Horizon"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Editorial Description */}
          <div className="lg:col-span-6 space-y-6 text-left" dir={isRTL ? 'rtl' : 'ltr'}>
            <div className="inline-block px-3 py-1 bg-[#FAF7F2] border border-[#C8A15A] text-[#0D2340] text-[11px] font-bold uppercase tracking-widest">
              {lang === 'ar' ? 'معتمد ميدانياً بوقت الفجر' : 'On-Site Dawn Certified'}
            </div>

            <h3 className="font-serif-editorial text-3xl md:text-4xl text-[#0D2340] leading-snug">
              {t.moments.slowMorningSubtitle}
            </h3>

            <p className="text-[#6D7480] text-base leading-relaxed">
              {t.moments.slowMorningDesc}
            </p>

            <div className="pt-2">
              <button
                id="btn-explore-slow-morning"
                onClick={() => navigate('/moments/slow-morning')}
                className="inline-flex items-center gap-3 text-xs uppercase tracking-[0.2em] font-bold text-[#B74C2B] border-b-2 border-[#B74C2B] pb-1 hover:text-[#0D2340] hover:border-[#0D2340] transition-colors"
              >
                <span>{t.moments.exploreMoment}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Verified Property */}
      <section className="py-20 bg-white border-y border-[#E9DED1]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#C8A15A]">
                {seawardFacts.badge}
              </span>
              <h2 className="font-serif-editorial text-3xl md:text-4xl text-[#0D2340] mt-2">
                {lang === 'ar' ? seawardProp.nameAr : seawardProp.name}
              </h2>
              <p className="text-sm text-[#6D7480] mt-1">
                {lang === 'ar' ? seawardProp.locationAr : seawardProp.location}
              </p>
            </div>

            <button
              onClick={() => navigate(`/homes/${seawardProp.slug}`)}
              className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-widest text-[#0D2340] hover:text-[#B74C2B] transition-colors"
            >
              <span>{lang === 'ar' ? 'عرض تفاصيل المنزل الموثق' : 'View Verified Home Details'}</span>
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="aspect-[16/10] overflow-hidden rounded-sm border border-[#E9DED1] group cursor-pointer" onClick={() => navigate(`/homes/${seawardProp.slug}`)}>
                <img
                  src={seawardProp.heroImage}
                  alt={seawardProp.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <p className="text-base text-[#0D2340] leading-relaxed font-light italic">
                "{lang === 'ar' ? seawardProp.taglineAr : seawardProp.tagline}"
              </p>

              <div className="space-y-4 pt-2">
                <div className="p-4 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#B74C2B] block mb-1">
                    {lang === 'ar' ? 'اللحظات الموثقة' : 'Proven Moments'}
                  </span>
                  <p className="text-sm font-serif-editorial text-[#0D2340]">
                    {lang === 'ar' ? 'الصباح الهادئ • القراءة الصامتة' : 'The Slow Morning • The Silent Reading'}
                  </p>
                </div>

                <div className="p-4 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#0F5859] block mb-1">
                    {lang === 'ar' ? 'ضمان الختم' : 'Seal Assurance'}
                  </span>
                  <p className="text-xs text-[#6D7480]">
                    {lang === 'ar' ? 'اجتياز كامل لبوابات TRUST الست ودرع الأمان SHIELD دون انحراف.' : 'Zero drift recorded. 100% adherence to Little Hut verification standard.'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  id="btn-request-seaward-home"
                  onClick={() => navigate(`/homes/${seawardProp.slug}`)}
                  className="w-full py-4 bg-[#0D2340] hover:bg-[#0D2340]/90 text-white text-xs uppercase font-bold tracking-[0.2em] transition-all"
                >
                  {t.property.requestStayTitle}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Complete Verified Properties Collection */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#B74C2B] block mb-2">
              {lang === 'ar' ? 'مجموعة الملاذات الموثقة' : 'The Verified Collection'}
            </span>
            <h2 className="font-serif-editorial text-3xl md:text-4xl text-[#0D2340]">
              {lang === 'ar' ? 'منازل ساحلية وهادئة مجازة ميدانياً' : 'Curated Architectural Sanctuaries'}
            </h2>
            <p className="text-[#6D7480] text-sm md:text-base mt-2 max-w-2xl leading-relaxed">
              {lang === 'ar'
                ? 'كل عقار في هذه المجموعة اجتاز بوابات التدقيق الميداني ويوثق لحظات إنسانية ومعمارية فريدة.'
                : 'Each residence has undergone physical acoustic, privacy, and architectural audit with proven moments.'}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#E9DED1] text-xs font-bold text-[#0D2340] uppercase tracking-wider rounded-xs self-start md:self-auto">
            <ShieldCheck className="w-4 h-4 text-[#0F5859]" />
            <span>{lang === 'ar' ? `${properties.filter(p => p.lifecycle === 'live').length} منازل معتمدة بالختم` : `${properties.filter(p => p.lifecycle === 'live').length} Seal-Certified Residences`}</span>
          </div>
        </div>

        {/* Destination Filter Tabs */}
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
                  ? 'bg-[#0D2340] text-[#FAF7F2] border-[#0D2340] shadow-xs'
                  : 'bg-white text-[#6D7480] border-[#E9DED1] hover:text-[#0D2340] hover:border-[#B74C2B]'
              }`}
            >
              {lang === 'ar' ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties
            .map((property) => {
              const facts = publicCardFacts(property);
              return (
                <div
                  key={property.id}
                  onClick={() => navigate(`/homes/${property.slug}`)}
                  className="bg-white border border-[#E9DED1] hover:border-[#B74C2B] transition-all duration-300 group cursor-pointer flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative aspect-[16/11] overflow-hidden bg-[#FAF7F2]">
                      <img
                        src={property.heroImage}
                        alt={property.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute top-3 inset-x-3 flex items-center justify-between pointer-events-none">
                        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-xs backdrop-blur-md ${
                          facts.isVerified
                            ? 'bg-[#0D2340]/85 text-[#E7D6BF] border border-white/20'
                            : 'bg-amber-900/80 text-white'
                        }`}>
                          {facts.isVerified
                            ? (lang === 'ar' ? 'موثق بالختم' : 'Seal Certified')
                            : (lang === 'ar' ? 'قيد الانضمام' : 'Joining')}
                        </span>
                        <span className="px-2.5 py-1 text-[10px] font-semibold tracking-wider bg-white/90 text-[#0D2340] rounded-xs backdrop-blur-md">
                          {lang === 'ar' ? `سعة ${property.maxCapacity} ضيوف` : `Cap: ${property.maxCapacity} guests`}
                        </span>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-6">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#B74C2B] block mb-1">
                        {lang === 'ar' ? property.locationAr : property.location}
                      </span>
                      <h3 className="font-serif-editorial text-2xl text-[#0D2340] group-hover:text-[#B74C2B] transition-colors leading-tight mb-2">
                        {lang === 'ar' ? property.nameAr : property.name}
                      </h3>
                      <p className="text-xs text-[#6D7480] line-clamp-2 leading-relaxed italic mb-4">
                        "{lang === 'ar' ? property.taglineAr : property.tagline}"
                      </p>

                      {/* Proven Moments Pill List */}
                      {property.provenMoments && property.provenMoments.length > 0 && (
                        <div className="pt-3 border-t border-[#FAF7F2] flex flex-wrap gap-1.5">
                          {property.provenMoments.map(m => (
                            <span
                              key={m.id}
                              className="px-2 py-0.5 bg-[#FAF7F2] border border-[#E9DED1] text-[10px] text-[#0D2340] rounded-xs"
                            >
                              {lang === 'ar' ? m.titleAr : m.title}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="px-6 py-4 bg-[#FAF7F2]/60 border-t border-[#E9DED1] flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#0D2340] group-hover:text-[#B74C2B] transition-colors">
                    <span>{lang === 'ar' ? 'طلب إقامة موثقة' : 'Request Verified Stay'}</span>
                    <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* 5. Six Signature Moments Grid */}
      <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.3em] font-bold text-[#C8A15A]">
            {lang === 'ar' ? 'المعايير المعمارية' : 'The Architectural Standard'}
          </span>
          <h2 className="font-serif-editorial text-3xl md:text-4xl text-[#0D2340] mt-2">
            {t.moments.otherMomentsTitle}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {t.moments.momentsList.map((m) => (
            <div
              key={m.id}
              onClick={() => navigate('/moments/slow-morning')}
              className="p-8 bg-white border border-[#E9DED1] hover:border-[#B74C2B] transition-all cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#B74C2B] block mb-3">
                  {m.id.replace('_', ' ')}
                </span>
                <h3 className="font-serif-editorial text-2xl text-[#0D2340] group-hover:text-[#B74C2B] transition-colors mb-3">
                  {m.title}
                </h3>
                <p className="text-xs text-[#6D7480] leading-relaxed">
                  {m.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#FAF7F2] flex items-center justify-between text-[11px] text-[#B74C2B] font-bold uppercase tracking-wider">
                <span>{lang === 'ar' ? 'استكشف المعيار' : 'Explore Standard'}</span>
                <ArrowRight className={`w-3.5 h-3.5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Real Property Onboarding Callout */}
        <div className="mt-16 p-8 md:p-12 bg-[#0D2340] text-white rounded-sm border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8A15A]/20 text-[#C8A15A] border border-[#C8A15A]/30 text-[10px] uppercase font-bold tracking-widest rounded-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'لأصحاب الفيلات والشاليهات' : 'For Residence Owners'}</span>
            </div>
            <h3 className="font-serif-editorial text-2xl md:text-3xl text-white">
              {lang === 'ar' ? 'تمتلك فيلا أو شاليه في أزها أو الساحل؟' : 'Own a Villa or Chalet in Azha or Egypt?'}
            </h3>
            <p className="text-xs text-[#FAF7F2]/70 leading-relaxed">
              {lang === 'ar'
                ? 'سجّل بيانات عقارك الحقيقي ومواصفات الشاطئ واللاجون لتحصل على ختم الجودة والتدقيق الميداني والإدارة التشغيلية الفورية.'
                : 'Submit your authentic property specs, private lagoon beach access, and calendar authority to qualify for the Little Hut Seal and verified guest bookings.'}
            </p>
          </div>

          <button
            onClick={() => navigate('/list-property')}
            className="px-8 py-3.5 bg-[#B74C2B] hover:bg-[#C8A15A] hover:text-[#0D2340] text-white text-xs font-bold uppercase tracking-widest transition-all rounded-xs shadow-md whitespace-nowrap flex items-center gap-2 cursor-pointer"
          >
            <span>{lang === 'ar' ? 'أدرج وثّق عقارك الآن' : 'List & Qualify Property'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
