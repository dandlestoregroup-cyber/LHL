import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequests } from '../context/RequestContext';
import { CanonicalMomentId } from '../types';
import { ArrowLeft, ArrowRight, Sun, ShieldCheck, Clock, CheckCircle2, Waves, Coffee, Users, Moon, BookOpen } from 'lucide-react';

interface MomentViewProps {
  navigate: (path: string) => void;
}

export const MomentView: React.FC<MomentViewProps> = ({ navigate }) => {
  const { lang, t, isRTL } = useAuth();
  const { properties } = useRequests();

  const [activeMomentId, setActiveMomentId] = useState<CanonicalMomentId>('slow_morning');

  const momentDetails: Record<CanonicalMomentId, {
    titleEn: string;
    titleAr: string;
    subtitleEn: string;
    subtitleAr: string;
    descEn: string;
    descAr: string;
    image: string;
    criteriaEn: { title: string; desc: string }[];
    criteriaAr: { title: string; desc: string }[];
  }> = {
    slow_morning: {
      titleEn: 'Slow Morning',
      titleAr: 'صباح هادئ',
      subtitleEn: 'Sunlight filtering through linen, the scent of fresh coffee, and no reason to rush.',
      subtitleAr: 'ضوء الشمس يتسلل عبر الكتان النقي، عبق القهوة الطازجة، وبلا أي سبب للعجلة.',
      descEn: 'A certified Little Hut moment. Perched where light hits terraces at golden elevation, qualifying dawn stillness before the day stirs.',
      descAr: 'لحظة معتمدة من ليتل هت. منازل تشرق فيها الشمس بزوايا ذهبية خاصة، تمنحك سكينة الفجر قبل أن يبدأ صخب اليوم.',
      image: 'https://images.unsplash.com/photo-1512918766671-ad6568148a1b?auto=format&fit=crop&q=80&w=1200',
      criteriaEn: [
        { title: 'Dawn Light Orientation', desc: 'East-facing terraces unobstructed by compound density.' },
        { title: 'Acoustic Sanctuary <28dB', desc: 'Zero mechanical or road ambient noise during sunrise.' },
        { title: 'Linen & Shading', desc: 'Unbleached natural textiles softening early morning glare.' },
        { title: 'Terrace Walk-Out', desc: 'Seamless transition from master suite to outdoor air.' }
      ],
      criteriaAr: [
        { title: 'توجيه ضوء الفجر', desc: 'شرفات شرقية تستقبل ضوء الفجر الصافي دون حواجب معمارية.' },
        { title: 'عزل صوتي يقل عن ٢٨ ديسيبل', desc: 'انعدام الضوضاء الميكانيكية أو الطرق وقت الشروق.' },
        { title: 'أقمشة الكتان والظلال', desc: 'منسوجات طبيعية تكسر وهج الصباح بنعومة.' },
        { title: 'خروج مباشر للشرفة', desc: 'انتقال سلس وفوري من غرفة النوم إلى نسيم الصباح.' }
      ]
    },
    late_breakfast: {
      titleEn: 'Late Breakfast',
      titleAr: 'إفطار متأخر',
      subtitleEn: 'Shaded dining tables, coastal cross-breeze, and unhurried midday nourishment.',
      subtitleAr: 'طاولات طعام مظللة، نسيم بحري منعش، وتناول طعام هادئ يمتد حتى الظهيرة.',
      descEn: 'Generous outdoor expanses protected from midday heat by natural pergola greenery, designed for 3-hour noon conversations.',
      descAr: 'مساحات طعام خارجية واسعة محمية من حرارة الظهيرة بالعرائش الخضراء، مخصصة لولائم تمتد لساعات.',
      image: 'https://images.unsplash.com/photo-1533779283484-84e1b8b80980?auto=format&fit=crop&q=80&w=1200',
      criteriaEn: [
        { title: 'Cross-Ventilation', desc: 'Breeze flow between courtyard and shaded garden.' },
        { title: 'Deep Pergola Shading', desc: 'Continuous protective shade past 2:00 PM.' },
        { title: 'Open Kitchen Access', desc: 'Direct catering flow without disrupting the gathering.' },
        { title: 'Generous Hearth Seating', desc: 'Comfortable chairs engineered for extended sitting.' }
      ],
      criteriaAr: [
        { title: 'تهوية طبيعية متقاطعة', desc: 'تدفق مستمر للنسيم بين الفناء والحديقة المظللة.' },
        { title: 'تظليل عميق بالعرائش', desc: 'ظل دائم حتى ما بعد الثانية ظهراً.' },
        { title: 'اتصال مباشر بالمطبخ', desc: 'حركة سلسة لإعداد الطعام دون مقاطعة الجلسة.' },
        { title: 'مقاعد مريحة ممتدة', desc: 'كراسٍ مصممة هندسياً للجلوس المريح لساعات.' }
      ]
    },
    barefoot_afternoon: {
      titleEn: 'Barefoot Afternoon',
      titleAr: 'ظهيرة حافية القدمين',
      subtitleEn: 'Immediate threshold walk-out onto fine cool sand or smooth stone with instant lagoon swimming.',
      subtitleAr: 'خروج فوري من الباب إلى رمال الشاطئ الناعمة أو الأحجار الملساء والنزول المباشر للماء.',
      descEn: 'Zero asphalt barrier. The residence opens directly to pristine swimmable water steps from your patio threshold.',
      descAr: 'بلا أي حواجز خرسانية أو طرق. يفتح المسكن مباشرة على شاطئ لاجون رملي يبعد خطوات عن عتبتك.',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200',
      criteriaEn: [
        { title: 'Direct Beachfront/Lagoon', desc: 'No road crossing or communal corridor to reach water.' },
        { title: 'Thermal Stone Comfort', desc: 'Patios that remain barefoot-walkable under midday sun.' },
        { title: 'Outdoor Rinse Shower', desc: 'Private outdoor brass shower with fresh water.' },
        { title: 'Private Sunbeds', desc: 'Dedicated uncrowded shoreline frontage.' }
      ],
      criteriaAr: [
        { title: 'واجهة لاجون / شاطئ مباشرة', desc: 'عدم وجود أي طرق أو ممرات عامة تفصلك عن الماء.' },
        { title: 'أرضيات معالجة حرارياً', desc: 'تراسات تسمح بالمشي حافياً دون سخونة.' },
        { title: 'دش خارجي خاص', desc: 'دش نحاسي للمياه العذبة على الشاطئ الخاص.' },
        { title: 'أسرة استرخاء خاصة', desc: 'شاطئ خاص غير مزدحم مخصص للفيلا.' }
      ]
    },
    family_play: {
      titleEn: 'Family Play',
      titleAr: 'مرح عائلي',
      subtitleEn: 'Enclosed lawns, safe shallow water shelves, and shaded play spaces with clear parental lines of sight.',
      subtitleAr: 'مسطحات خضراء مسورة، شواطئ ضحلة آمنة، ومساحات لعب تحت أنظار الوالدين.',
      descEn: 'Architecturally safe grounds where children explore freely while adults rest in peaceful proximity.',
      descAr: 'مساحات مصممة بأمان فائق تتيح للأطفال المرح بحرية بينما يستريح الكبار براحة وطمأنينة.',
      image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&q=80&w=1200',
      criteriaEn: [
        { title: '360° Sightlines', desc: 'Continuous visual clarity from terrace to play lawn.' },
        { title: 'Gradual Shallow Water', desc: 'Safe zero-drop water entrance for young swimmers.' },
        { title: 'Gated Perimeter', desc: 'Secure boundaries avoiding accidental wandering.' },
        { title: 'Acoustic Buffering', desc: 'Bedrooms isolated from living and play spaces.' }
      ],
      criteriaAr: [
        { title: 'رؤية بصرية شاملة ٣٦٠°', desc: 'وضوح بصري مستمر من التراس إلى مساحة اللعب.' },
        { title: 'مياه ضحلة متدرجة', desc: 'دخول آمن للماء بدون انحدار مفاجئ للأطفال.' },
        { title: 'محيط آمن ومسور', desc: 'حماية كاملة تمنع خروج الأطفال الصغار.' },
        { title: 'عزل صوتي لغرف النوم', desc: 'فصل غرف النوم الهادئة عن مناطق المرح واللعب.' }
      ]
    },
    the_long_sit: {
      titleEn: 'The Long Sit',
      titleAr: 'جلسة التأمل الطويلة',
      subtitleEn: 'Recessed conversation pits, deep writing daybeds, sunset stillness, and total acoustic sanctuary.',
      subtitleAr: 'مجالس غائرة، أرائك كتابة عميقة، سكينة وقت الغروب، وهدوء صوتي مطلق.',
      descEn: 'A room or terrace designed for hours of uninterrupted focus, deep reading, or meaningful dialogue.',
      descAr: 'مساحة معمارية مكرسة لساعات من التركيز والتأمل والقراءة المعمقة أو الحوارات الهادفة.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=1200',
      criteriaEn: [
        { title: 'Ergonomic Daybed Depth', desc: 'Minimum 100cm daybed depth with high-density foam.' },
        { title: 'Sunset Horizon View', desc: 'Calibrated orientation for evening golden hour.' },
        { title: 'Acoustic Isolation', desc: 'No neighboring HVAC or pool equipment noise.' },
        { title: 'Warm Task Lighting', desc: '2700K warm non-glare illumination for evening reading.' }
      ],
      criteriaAr: [
        { title: 'أرائك وثيرة عميقة', desc: 'عمق لا يقل عن ١٠٠ سم مع حشوات إسفنجية داعمة.' },
        { title: 'إطلالة أفق الغروب', desc: 'توجيه مدروس لساعات الغروب الذهبية.' },
        { title: 'سكينة صوتية تامة', desc: 'انعدام صوت مضخات المسابح أو التكييفات المجاورة.' },
        { title: 'إضاءة قراءة دافئة', desc: 'إضاءة ٢٧٠٠ كلفن مريحة للعين للقراءة المسائية.' }
      ]
    },
    under_stars: {
      titleEn: 'Under Stars',
      titleAr: 'تحت النجوم',
      subtitleEn: 'Dark sky sanctuaries with zero light pollution, rooftop clearings, and courtyard fire hearths.',
      subtitleAr: 'ملاذات سماء مظلمة خالية من التلوث الضوئي، منصات رووف فسيحة، ومواقد نار مفتوحة.',
      descEn: 'Located away from urban light bleed, qualifying clear celestial views and peaceful evening fires.',
      descAr: 'مواقع معزولة عن التلوث الضوئي تمنحك رؤية ساحرة للنجوم والمجرات وأمسيات دافئة حول النار.',
      image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=1200',
      criteriaEn: [
        { title: 'Bortle Scale Class <4', desc: 'Certified dark sky baseline with visible Milky Way.' },
        { title: 'Rooftop Stargazing Deck', desc: 'Flat teak platform with low-profile safety railings.' },
        { title: 'Open Fire Hearth', desc: 'Dedicated wood/charcoal brazier with wind shielding.' },
        { title: 'Zero Spill Lighting', desc: 'All exterior fixtures fully shielded downwards.' }
      ],
      criteriaAr: [
        { title: 'مقياس بورتل أقل من ٤', desc: 'سماء مظلمة معتمدة تسمح برؤية مجرة درب التبانة.' },
        { title: 'منصة رووف لرؤية النجوم', desc: 'أرضيات خشبية واسعة مع حواجز أمان منخفضة.' },
        { title: 'موقد نار مفتوح', desc: 'موقد حطب مخصص مع مصدات رياح ذكية.' },
        { title: 'إضاءة موجهة للأسفل', desc: 'انعدام أي إضاءة خارجية مشتتة نحو السماء.' }
      ]
    }
  };

  const activeMoment = momentDetails[activeMomentId];

  const matchingProperties = properties.filter(p => {
    if (!p.canonicalMoments) return false;
    if (Array.isArray(p.canonicalMoments)) {
      const match = p.canonicalMoments.find(m => m.momentId === activeMomentId);
      return match?.state === 'enabled' || match?.state === 'possible';
    }
    const state = (p.canonicalMoments as Record<string, string>)[activeMomentId];
    return state === 'enabled' || state === 'possible';
  });

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-[0.2em] text-[#0D2340] hover:text-[#B74C2B] transition-colors"
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          <span>{lang === 'ar' ? 'العودة للمجموعة' : 'Back to Collection'}</span>
        </button>
      </div>

      {/* 6 Moments Switcher Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-[#E9DED1]">
          {(['slow_morning', 'late_breakfast', 'barefoot_afternoon', 'family_play', 'the_long_sit', 'under_stars'] as CanonicalMomentId[]).map((mId) => {
            const isSelected = activeMomentId === mId;
            const item = momentDetails[mId];
            return (
              <button
                key={mId}
                onClick={() => setActiveMomentId(mId)}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xs whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-[#0D2340] text-white border-[#0D2340] shadow-xs'
                    : 'bg-white text-[#6D7480] border-[#E9DED1] hover:text-[#0D2340]'
                }`}
              >
                {lang === 'ar' ? item.titleAr : item.titleEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* Moment Hero Deep-Dive */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#C8A15A]/15 text-[#0D2340] border border-[#C8A15A]/30 text-[10px] uppercase font-bold tracking-widest rounded-xs">
              <Sun className="w-3.5 h-3.5 text-[#C8A15A]" />
              <span>{lang === 'ar' ? 'معيار لحظة معتمد' : 'Canonical Moment Protocol'}</span>
            </div>

            <h1 className="font-serif-editorial text-4xl md:text-6xl text-[#0D2340] leading-tight">
              {lang === 'ar' ? activeMoment.titleAr : activeMoment.titleEn}
            </h1>

            <p className="text-xl md:text-2xl font-serif-editorial italic text-[#B74C2B] leading-relaxed">
              "{lang === 'ar' ? activeMoment.subtitleAr : activeMoment.subtitleEn}"
            </p>

            <p className="text-sm md:text-base text-[#6D7480] leading-relaxed">
              {lang === 'ar' ? activeMoment.descAr : activeMoment.descEn}
            </p>

            {/* Evidence Ceiling Note */}
            <div className="p-6 bg-white border-l-4 border-[#0F5859] rounded-xs shadow-xs">
              <div className="flex items-center gap-2 text-[#0F5859] font-bold text-xs uppercase tracking-wider mb-2">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'ar' ? 'قاعدة سقف الإثبات (Evidence Ceiling)' : 'Evidence Ceiling Principle'}</span>
              </div>
              <p className="text-xs text-[#0D2340] leading-relaxed">
                {lang === 'ar'
                  ? 'بموجب محرك المعايير: لا يمكن لأي نص أو وصف تسويقي إثبات لحظة. التدقيق الميداني الفعلي والقياسات الصوتية والضوئية هي وحدها التي تمنح الاعتماد.'
                  : 'Under Little Hut standards: A listing or copy claim cannot prove a moment. Only on-site physical audit and acoustic/light measurements validate qualification.'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden shadow-md border border-[#E9DED1]">
              <img
                src={activeMoment.image}
                alt={activeMoment.titleEn}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0D2340] p-6 text-white">
                <span className="text-[10px] uppercase tracking-widest text-[#E7D6BF] block mb-1">
                  {lang === 'ar' ? 'التوثيق الميداني المعتمد' : 'Proven Field Verification'}
                </span>
                <p className="font-serif-editorial text-base italic">
                  {lang === 'ar' ? 'تم الفحص الميداني وفق المعايير الستة' : '100% Audited on Site'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Qualification Criteria Grid */}
      <section className="bg-white border-y border-[#E9DED1] py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <h2 className="font-serif-editorial text-3xl text-[#0D2340] mb-8 text-center">
            {lang === 'ar' ? `معايير التأهيل للحظة (${activeMoment.titleAr})` : `The 4 Qualification Criteria for ${activeMoment.titleEn}`}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(lang === 'ar' ? activeMoment.criteriaAr : activeMoment.criteriaEn).map((crit, idx) => (
              <div key={idx} className="p-6 bg-[#FAF7F2] border border-[#E9DED1] rounded-xs space-y-2">
                <span className="text-[10px] font-mono text-[#B74C2B] font-bold">0{idx + 1}</span>
                <h3 className="font-serif-editorial text-lg text-[#0D2340] font-bold">
                  {crit.title}
                </h3>
                <p className="text-xs text-[#6D7480] leading-relaxed">
                  {crit.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Homes Qualifying for This Moment */}
      <section className="py-16 max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-serif-editorial text-2xl md:text-3xl text-[#0D2340]">
              {lang === 'ar' ? `المنازل المعتمدة للحظة (${activeMoment.titleAr})` : `Residences Qualifying for ${activeMoment.titleEn}`}
            </h2>
            <p className="text-xs text-[#6D7480] mt-1">
              {matchingProperties.length} {lang === 'ar' ? 'منازل موثقة' : 'Homes'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchingProperties.map((prop) => (
            <div
              key={prop.id}
              onClick={() => navigate(`/homes/${prop.slug}`)}
              className="bg-white border border-[#E9DED1] p-5 rounded-sm hover:border-[#B74C2B] transition-all cursor-pointer group shadow-xs"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-xs mb-4">
                <img
                  src={prop.heroImage}
                  alt={prop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#B74C2B] block mb-1">
                {lang === 'ar' ? prop.locationAr : prop.location}
              </span>
              <h3 className="font-serif-editorial text-xl text-[#0D2340] group-hover:text-[#B74C2B] transition-colors font-bold mb-2">
                {lang === 'ar' ? prop.nameAr : prop.name}
              </h3>
              <p className="text-xs text-[#6D7480] line-clamp-2 italic mb-4">
                "{lang === 'ar' ? prop.taglineAr : prop.tagline}"
              </p>
              <div className="pt-3 border-t border-[#FAF7F2] flex items-center justify-between text-xs font-bold uppercase text-[#0D2340] group-hover:text-[#B74C2B]">
                <span>{lang === 'ar' ? 'استكشف المنزل' : 'Explore Residence'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
