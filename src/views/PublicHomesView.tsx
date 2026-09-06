import React from 'react';
import { ArrowRight, BadgeCheck, MapPin, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi } from '../lib/display';
import { signatureMoments } from '../data/signature-moments';
import { DemoRecordMark, EmptyState, StatusPill } from '../components/ui';

export function PublicHomesView({ navigate }: { navigate: (path: string) => void }) {
  const { lang, mode, publicHomes } = useOperating();
  const leadMoment = signatureMoments[0];

  return (
    <div className="bg-[#FAF5EE] text-[#2A201C]">
      <section className="border-b border-[#EBDDD1] bg-[radial-gradient(circle_at_top_right,rgba(184,78,54,.13),transparent_34%),linear-gradient(180deg,#FAF5EE_0%,#F7EDE2_100%)]">
        <div className="page-shell grid gap-12 py-14 md:py-20 lg:grid-cols-[1.02fr_.98fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone={mode === 'demo' ? 'demo' : 'good'}>{mode === 'demo' ? bi(lang, 'Demonstration collection', 'مجموعة تجريبية') : bi(lang, 'Verified live collection', 'مجموعة فعلية موثقة')}</StatusPill>
              <span className="text-[10px] font-bold uppercase tracking-[.2em] text-[#B84E36]">{bi(lang, 'Mediterranean & Red Sea', 'البحر المتوسط والبحر الأحمر')}</span>
            </div>
            <p className="mt-7 text-sm font-semibold uppercase tracking-[.18em] text-[#C8A15A]">{bi(lang, 'A quiet collection of coastal homes', 'مجموعة هادئة من البيوت الساحلية')}</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[.96] tracking-[-.045em] text-[#2A201C] sm:text-6xl lg:text-7xl">{bi(lang, 'Quiet stays. Loud memories.', 'إقامات هادئة. ذكريات لا تُنسى.')}</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#6D5A50]">{bi(lang, 'We do not sell square meters. Little Hut qualifies how a home actually feels: morning light, family ease, long meals, stillness, and the moments worth travelling for.', 'نحن لا نبيع أمتاراً مربعة. ليتل هت توثق إحساس البيت فعلاً: ضوء الصباح، راحة العائلة، الوجبات الطويلة، الهدوء، واللحظات التي تستحق السفر من أجلها.')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => document.getElementById('moments')?.scrollIntoView({ behavior: 'smooth' })} className="button-primary">{bi(lang, 'Explore the Moments', 'استكشف اللحظات')}<ArrowRight size={15} className="rtl:rotate-180" /></button>
              <button onClick={() => navigate('/list-property')} className="button-secondary">{bi(lang, 'List & qualify a residence', 'أدرج ووثّق عقارك')}</button>
            </div>
          </div>

          <button onClick={() => navigate(`/moments/${leadMoment.slug}`)} className="group overflow-hidden rounded-[2rem] border border-[#E2CDBD] bg-[#FFFDFC] text-start shadow-[0_30px_80px_rgba(80,52,39,.10)] transition hover:-translate-y-1 hover:shadow-[0_34px_90px_rgba(80,52,39,.15)]">
            <div className="aspect-[2/1] overflow-hidden bg-[#EBDDD1]">
              <img src={leadMoment.image} alt={bi(lang, leadMoment.imageAlt, leadMoment.imageAltAr)} style={{ objectPosition: leadMoment.imagePosition }} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
            </div>
            <div className="p-6 md:p-7">
              <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[.2em] text-[#B84E36]"><span>{leadMoment.sequence}</span><span>{bi(lang, 'Signature Moment', 'لحظة مميزة')}</span></div>
              <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">{bi(lang, leadMoment.headline, leadMoment.headlineAr)}</h2>
              <p className="mt-3 text-sm leading-7 text-[#6D5A50]">{bi(lang, leadMoment.subtitle, leadMoment.subtitleAr)}</p>
            </div>
          </button>
        </div>
      </section>

      <section id="moments" className="page-shell py-16 md:py-20">
        <div className="max-w-3xl">
          <p className="text-[10px] font-black uppercase tracking-[.24em] text-[#B84E36]">{bi(lang, 'Little Hut Moments', 'لحظات ليتل هت')}</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight md:text-5xl">{bi(lang, 'See the feeling before you choose the home.', 'شاهد الإحساس قبل أن تختار البيت.')}</h2>
          <p className="mt-5 text-sm leading-7 text-[#6D5A50]">{bi(lang, 'A Moment is presented visually first. The words sit underneath the image; the image is mood, while residence-specific evidence decides whether a home may claim it.', 'تُعرض اللحظة بصرياً أولاً. الكلمات تأتي أسفل الصورة؛ الصورة تعبّر عن الإحساس، بينما دليل كل عقار هو الذي يحدد إن كان يحق له تقديم هذه اللحظة.')}</p>
        </div>

        <div className="mt-10 grid gap-x-7 gap-y-12 md:grid-cols-2">
          {signatureMoments.map((moment) => (
            <button key={moment.slug} onClick={() => navigate(`/moments/${moment.slug}`)} className="group text-start">
              <div className="aspect-[2/1] overflow-hidden rounded-[1.65rem] bg-[#EBDDD1] shadow-[0_16px_45px_rgba(80,52,39,.08)]">
                <img src={moment.image} alt={bi(lang, moment.imageAlt, moment.imageAltAr)} style={{ objectPosition: moment.imagePosition }} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
              </div>
              <div className="pt-5">
                <div className="flex items-start gap-4">
                  <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#B84E36] font-serif text-lg text-white">{moment.sequence}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[10px] font-black uppercase tracking-[.2em] text-[#B84E36]">{bi(lang, moment.title, moment.titleAr)}</p>
                      <ArrowRight size={17} className="shrink-0 text-[#B84E36] transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </div>
                    <h3 className="mt-2 font-serif text-3xl leading-tight text-[#2A201C]">{bi(lang, moment.headline, moment.headlineAr)}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#6D5A50]">{bi(lang, moment.subtitle, moment.subtitleAr)}</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section id="homes" className="border-t border-[#EBDDD1] bg-[#FFFDFC]">
        <div className="page-shell py-16 md:py-20">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div><span className="text-[10px] font-black uppercase tracking-[.22em] text-[#B84E36]">{bi(lang, 'The collection', 'المجموعة')}</span><h2 className="mt-3 font-serif text-4xl tracking-tight text-[#2A201C] md:text-5xl">{bi(lang, 'Book the feeling, not just the stay.', 'احجز الإحساس، وليس فقط الإقامة.')}</h2></div>
            <p className="max-w-md text-sm leading-7 text-[#6D5A50]">{bi(lang, 'Every public home must be independently assessed, owner-approved, operationally ready, sealed, and currently visible.', 'كل بيت منشور يجب أن يكون مُقيّماً بشكل مستقل، معتمداً من المالك، جاهزاً للتشغيل، حاصلاً على الختم، ومتاحاً للنشر حالياً.')}</p>
          </div>

          {publicHomes.length === 0 ? (
            <div className="mt-10"><EmptyState icon="data" title="No verified Live homes yet" titleAr="لا توجد بيوت فعلية موثقة حتى الآن" description="Live remains intentionally empty until a property completes every evidence and authority gate." descriptionAr="يبقى الوضع الفعلي فارغاً عمداً حتى يكمل العقار جميع بوابات الدليل والصلاحية." actionLabel="See how residences join" actionLabelAr="شاهد كيف تنضم العقارات" onAction={() => navigate('/list-property')} /></div>
          ) : (
            <div className="mt-10 grid gap-7 lg:grid-cols-3">
              {publicHomes.map((home) => (
                <article key={home.id} className="group overflow-hidden rounded-[1.75rem] border border-[#E5D5C9] bg-[#FFFDFC] shadow-[0_18px_55px_rgba(80,52,39,.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(80,52,39,.14)]">
                  <button onClick={() => navigate(`/homes/${home.slug}`)} className="block w-full text-start">
                    <div className="relative aspect-[4/3] overflow-hidden bg-[#EBDDD1]">
                      <img src={home.heroImage} alt={lang === 'ar' ? home.nameAr : home.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
                      <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4"><StatusPill tone="good"><BadgeCheck size={12} />{bi(lang, 'Little Hut verified', 'موثق من ليتل هت')}</StatusPill><span className="rounded-full bg-[#2A201C]/85 px-3 py-1 text-[9px] font-bold uppercase tracking-[.14em] text-white backdrop-blur">{bi(lang, 'Request to stay', 'طلب إقامة')}</span></div>
                    </div>
                    <div className="p-6">
                      <DemoRecordMark />
                      <div className="mt-3 flex items-start justify-between gap-4"><div><h3 className="font-serif text-3xl leading-tight text-[#2A201C]">{lang === 'ar' ? home.nameAr : home.name}</h3><p className="mt-2 flex items-center gap-1.5 text-xs text-[#7D6A60]"><MapPin size={13} className="text-[#B84E36]" />{lang === 'ar' ? home.locationAr : home.location}</p></div><ArrowRight size={19} className="mt-1 text-[#B84E36] transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" /></div>
                      <p className="mt-5 text-sm leading-6 text-[#6D5A50]">{lang === 'ar' ? home.summaryAr : home.summary}</p>
                      <div className="mt-6 flex flex-wrap gap-2 border-t border-[#EBDDD1] pt-4 text-[10px] font-semibold text-[#6D5A50]"><span className="inline-flex items-center gap-1"><Users size={13} />{home.maxGuests} {bi(lang, 'guests', 'ضيوف')}</span><span className="inline-flex items-center gap-1"><Sparkles size={13} />{home.provenMoments.length} {bi(lang, 'proven Moments', 'لحظات موثقة')}</span><span className="inline-flex items-center gap-1"><ShieldCheck size={13} />{bi(lang, 'Seal active', 'الختم فعال')}</span></div>
                    </div>
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
