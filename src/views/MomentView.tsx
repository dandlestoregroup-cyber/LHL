import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, ShieldCheck, Camera } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { useAuth } from '../context/AuthContext';
import { bi } from '../lib/display';
import { useSignatureMomentsWithCustom } from '../utils/momentsStorage';
import { MomentsUploadStudioModal } from '../components/MomentsUploadStudioModal';

export function MomentView({ slug, navigate }: { slug: string; navigate: (path: string) => void }) {
  const { lang, publicHomes } = useOperating();
  const { user } = useAuth();
  const { moments } = useSignatureMomentsWithCustom();
  const [isStudioOpen, setIsStudioOpen] = useState(false);

  const active = moments.find((m) => m.slug === slug) || moments[0];
  const matchingHomes = publicHomes.filter((home) => home.provenMoments.some((moment) => moment.key === active.key));
  const isAdmin = Boolean(user && (user.role === 'admin' || user.role === 'operator'));

  return (
    <div className="bg-[#FAF5EE] text-[#2A201C]">
      <section className="border-b border-[#EBDDD1] bg-[linear-gradient(180deg,#FAF5EE_0%,#F7EDE2_100%)]">
        <div className="page-shell py-10 md:py-16">
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#6D5A50] transition hover:text-[#B84E36]"><ArrowLeft size={15} className="rtl:rotate-180" />{bi(lang, 'Back to Moments', 'العودة للحظات')}</button>

          <figure className="relative mt-8 overflow-hidden rounded-[2rem] bg-[#EBDDD1] shadow-[0_28px_80px_rgba(80,52,39,.12)] group">
            <div className="aspect-[2/1] overflow-hidden">
              <img src={active.image} alt={bi(lang, active.imageAlt, active.imageAltAr)} style={{ objectPosition: active.imagePosition }} className="h-full w-full object-cover" />
            </div>

            {isAdmin && (
              <div className="absolute top-4 end-4 z-10">
                <button
                  onClick={() => setIsStudioOpen(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/90 hover:bg-white text-[#2A201C] text-xs font-bold shadow-lg backdrop-blur-md transition-all border border-[#EBDDD1] cursor-pointer"
                >
                  <Camera size={14} className="text-[#B84E36]" />
                  <span>{lang === 'ar' ? 'تخصيص / حذف صورة اللحظة' : 'Manage / Remove Photo'}</span>
                </button>
              </div>
            )}
          </figure>

          <div className="mt-7 grid gap-9 lg:grid-cols-[1.05fr_.95fr] lg:items-start">
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#B84E36] font-serif text-xl text-white">{active.sequence}</span>
                <p className="text-[10px] font-black uppercase tracking-[.22em] text-[#B84E36]">{bi(lang, 'Little Hut Signature Moment', 'لحظة مميزة من ليتل هت')}</p>
              </div>
              <p className="mt-6 text-sm font-bold uppercase tracking-[.18em] text-[#C8A15A]">{bi(lang, active.title, active.titleAr)}</p>
              <h1 className="mt-3 max-w-3xl font-serif text-5xl leading-[1.02] tracking-[-.035em] md:text-6xl">{bi(lang, active.headline, active.headlineAr)}</h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[#6D5A50]">{bi(lang, active.subtitle, active.subtitleAr)}</p>
              <p className="mt-5 text-[10px] font-semibold uppercase tracking-[.16em] text-[#8A766B]">{bi(lang, 'Editorial mood image · residence claims require property-specific evidence', 'صورة تعبيرية · أي ادعاء للعقار يحتاج دليلاً خاصاً به')}</p>
            </div>

            <div className="rounded-[1.75rem] border border-[#E2CDBD] bg-white/75 p-6 shadow-[0_20px_60px_rgba(80,52,39,.07)] md:p-7">
              <div className="flex items-start gap-3"><ShieldCheck className="mt-1 shrink-0 text-[#B84E36]" size={19} /><p className="text-sm leading-7 text-[#6D5A50]">{bi(lang, active.description, active.descriptionAr)}</p></div>
              <div className="mt-6 grid gap-3">
                {active.criteria.map(([title, desc, titleAr, descAr]) => (
                  <div key={title} className="rounded-2xl border border-[#EBDDD1] bg-[#FFFDFC] p-4">
                    <strong className="text-sm text-[#2A201C]">{bi(lang, title, titleAr)}</strong>
                    <p className="mt-1 text-xs leading-6 text-[#7D6A60]">{bi(lang, desc, descAr)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-14 md:py-18">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.22em] text-[#B84E36]">{bi(lang, 'Continue through the Moments', 'تابع بقية اللحظات')}</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight">{bi(lang, 'A visual collection, not a menu.', 'مجموعة بصرية، وليست قائمة.')}</h2>
          </div>
        </div>

        <div className="mt-8 grid gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {moments.filter((moment) => moment.slug !== active.slug).map((moment) => (
            <button key={moment.slug} onClick={() => navigate(`/moments/${moment.slug}`)} className="group text-start">
              <div className="aspect-[2/1] overflow-hidden rounded-[1.35rem] bg-[#EBDDD1]">
                <img src={moment.image} alt={bi(lang, moment.imageAlt, moment.imageAltAr)} style={{ objectPosition: moment.imagePosition }} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
              </div>
              <div className="pt-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-[#B84E36]">{moment.sequence} · {bi(lang, moment.title, moment.titleAr)}</p>
                  <ArrowRight size={15} className="text-[#B84E36] transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                </div>
                <p className="mt-2 font-serif text-2xl leading-tight">{bi(lang, moment.headline, moment.headlineAr)}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="border-t border-[#EBDDD1] bg-[#FFFDFC]">
        <div className="page-shell py-14 md:py-18">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.22em] text-[#B84E36]">{bi(lang, 'Homes that proved it', 'بيوت أثبتت هذه اللحظة')}</p>
            <h2 className="mt-3 font-serif text-4xl tracking-tight">{matchingHomes.length ? bi(lang, 'The picture inspires. Evidence earns the promise.', 'الصورة تلهم. والدليل هو ما يمنح الوعد.') : bi(lang, 'No public home has proved this Moment yet.', 'لا يوجد بيت منشور أثبت هذه اللحظة بعد.')}</h2>
          </div>

          {matchingHomes.length > 0 && (
            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {matchingHomes.map((home) => (
                <button key={home.id} onClick={() => navigate(`/homes/${home.slug}`)} className="group overflow-hidden rounded-[1.6rem] border border-[#E5D5C9] bg-white text-start shadow-sm">
                  <div className="aspect-[4/3] overflow-hidden bg-[#EBDDD1]"><img src={home.heroImage} alt={lang === 'ar' ? home.nameAr : home.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" /></div>
                  <div className="p-5">
                    <p className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[.16em] text-[#B84E36]"><BadgeCheck size={13} />{bi(lang, 'Moment proven', 'اللحظة موثقة')}</p>
                    <h3 className="mt-2 font-serif text-2xl">{lang === 'ar' ? home.nameAr : home.name}</h3>
                    <p className="mt-2 text-xs leading-6 text-[#7D6A60]">{lang === 'ar' ? home.locationAr : home.location}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {isAdmin && isStudioOpen && (
        <MomentsUploadStudioModal
          isOpen={isStudioOpen}
          onClose={() => setIsStudioOpen(false)}
          lang={lang}
          initialCardId={`card-${active.sequence}`}
        />
      )}
    </div>
  );
}
