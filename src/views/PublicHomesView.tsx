import React from 'react';
import { ArrowRight, BadgeCheck, Coffee, MapPin, Moon, ShieldCheck, Sparkles, Sun, Users, Waves } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi } from '../lib/display';
import { DemoRecordMark, EmptyState, StatusPill } from '../components/ui';

const moments = [
  [Sun, 'Slow Morning', 'صباح هادئ'],
  [Coffee, 'Late Breakfast', 'إفطار متأخر'],
  [Waves, 'Barefoot Afternoon', 'ظهيرة حافية القدمين'],
  [Users, 'Family Play', 'مرح عائلي'],
  [Sparkles, 'The Long Sit', 'الجلسة الطويلة'],
  [Moon, 'Under Stars', 'تحت النجوم'],
] as const;

export function PublicHomesView({ navigate }: { navigate: (path: string) => void }) {
  const { lang, mode, publicHomes } = useOperating();

  return (
    <div className="bg-[#FAF5EE] text-[#2A201C]">
      <section className="border-b border-[#EBDDD1] bg-[radial-gradient(circle_at_top_right,rgba(184,78,54,.13),transparent_34%),linear-gradient(180deg,#FAF5EE_0%,#F7EDE2_100%)]">
        <div className="page-shell grid gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone={mode === 'demo' ? 'demo' : 'good'}>{mode === 'demo' ? bi(lang, 'Demonstration collection', 'مجموعة تجريبية') : bi(lang, 'Verified live collection', 'مجموعة فعلية موثقة')}</StatusPill>
              <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#B84E36]">{bi(lang, 'Mediterranean & Red Sea', 'البحر المتوسط والبحر الأحمر')}</span>
            </div>
            <p className="mt-7 text-sm font-semibold uppercase tracking-[.18em] text-[#C8A15A]">{bi(lang, 'A quiet collection of coastal homes', 'مجموعة هادئة من البيوت الساحلية')}</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[.96] tracking-[-.045em] text-[#2A201C] sm:text-6xl lg:text-7xl">
              {bi(lang, 'Quiet stays. Loud memories.', 'إقامات هادئة. ذكريات لا تُنسى.')}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#6D5A50]">
              {bi(lang, 'We do not sell square meters. Little Hut qualifies how a home actually feels: morning light, family ease, long dinners, stillness, and the moments worth travelling for.', 'نحن لا نبيع أمتاراً مربعة. ليتل هت توثق إحساس البيت فعلاً: ضوء الصباح، راحة العائلة، العشاء الطويل، الهدوء، واللحظات التي تستحق السفر من أجلها.')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => document.getElementById('homes')?.scrollIntoView({ behavior: 'smooth' })} className="button-primary">{bi(lang, 'Explore verified homes', 'استكشف البيوت الموثقة')}<ArrowRight size={15} className="rtl:rotate-180" /></button>
              <button onClick={() => navigate('/joining')} className="button-secondary">{bi(lang, 'List & qualify a residence', 'أدرج ووثّق عقارك')}</button>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E2CDBD] bg-white/65 p-6 shadow-[0_30px_80px_rgba(80,52,39,.10)] backdrop-blur">
            <div className="flex items-center gap-2 text-[#B84E36]"><Sparkles size={16} /><span className="text-[10px] font-black uppercase tracking-[.2em]">{bi(lang, 'The six signature moments', 'اللحظات الست المميزة')}</span></div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {moments.map(([Icon, label, labelAr]) => (
                <div key={label} className="flex items-center gap-3 rounded-2xl border border-[#EBDDD1] bg-[#FFFDFC] p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#FAF0EB] text-[#B84E36]"><Icon size={18} /></div>
                  <span className="font-serif text-lg text-[#2A201C]">{bi(lang, label, labelAr)}</span>
                </div>
              ))}
            </div>
            <p className="mt-5 text-xs leading-6 text-[#7D6A60]">{bi(lang, 'A home earns its public promise only from evidence actually recorded for that residence.', 'لا يحصل البيت على وعده العام إلا من دليل موثق فعلاً لهذا العقار.')}</p>
          </div>
        </div>
      </section>

      <section id="homes" className="page-shell py-16 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[.22em] text-[#B84E36]">{bi(lang, 'The collection', 'المجموعة')}</span>
            <h2 className="mt-3 font-serif text-4xl tracking-tight text-[#2A201C] md:text-5xl">{bi(lang, 'Book the feeling, not just the stay.', 'احجز الإحساس، وليس فقط الإقامة.')}</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-[#6D5A50]">{bi(lang, 'Every public home must be independently assessed, owner-approved, operationally ready, sealed, and currently visible.', 'كل بيت منشور يجب أن يكون مُقيّماً بشكل مستقل، معتمداً من المالك، جاهزاً للتشغيل، حاصلاً على الختم، ومتاحاً للنشر حالياً.')}</p>
        </div>

        {publicHomes.length === 0 ? (
          <div className="mt-10"><EmptyState icon="data" title="No verified Live homes yet" titleAr="لا توجد بيوت فعلية موثقة حتى الآن" description="Live remains intentionally empty until a property completes every evidence and authority gate." descriptionAr="يبقى الوضع الفعلي فارغاً عمداً حتى يكمل العقار جميع بوابات الدليل والصلاحية." actionLabel="Open Joining Little Hut" actionLabelAr="افتح مسار الانضمام" onAction={() => navigate('/joining')} /></div>
        ) : (
          <div className="mt-10 grid gap-7 lg:grid-cols-3">
            {publicHomes.map((home) => (
              <article key={home.id} className="group overflow-hidden rounded-[1.75rem] border border-[#E5D5C9] bg-[#FFFDFC] shadow-[0_18px_55px_rgba(80,52,39,.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(80,52,39,.14)]">
                <button onClick={() => navigate(`/homes/${home.slug}`)} className="block w-full text-start">
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#EBDDD1]">
                    <img src={home.heroImage} alt={lang === 'ar' ? home.nameAr : home.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                      <StatusPill tone="good"><BadgeCheck size={12} />{bi(lang, 'Little Hut verified', 'موثق من ليتل هت')}</StatusPill>
                      <span className="rounded-full bg-[#2A201C]/85 px-3 py-1 text-[9px] font-bold uppercase tracking-[.14em] text-white backdrop-blur">{bi(lang, 'Request to stay', 'طلب إقامة')}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <DemoRecordMark />
                    <div className="mt-3 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-3xl leading-tight text-[#2A201C]">{lang === 'ar' ? home.nameAr : home.name}</h3>
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-[#7D6A60]"><MapPin size={13} className="text-[#B84E36]" />{lang === 'ar' ? home.locationAr : home.location}</p>
                      </div>
                      <ArrowRight size={19} className="mt-1 text-[#B84E36] transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </div>
                    <p className="mt-5 text-sm leading-6 text-[#6D5A50]">{lang === 'ar' ? home.summaryAr : home.summary}</p>
                    <div className="mt-6 flex flex-wrap gap-2 border-t border-[#EBDDD1] pt-4 text-[10px] font-semibold text-[#6D5A50]">
                      <span className="inline-flex items-center gap-1"><Users size={13} />{home.maxGuests} {bi(lang, 'guests', 'ضيوف')}</span>
                      <span className="inline-flex items-center gap-1"><Sparkles size={13} />{home.provenMoments.length} {bi(lang, 'proven Moments', 'لحظات موثقة')}</span>
                      <span className="inline-flex items-center gap-1"><ShieldCheck size={13} />{bi(lang, 'Seal active', 'الختم فعال')}</span>
                    </div>
                  </div>
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
