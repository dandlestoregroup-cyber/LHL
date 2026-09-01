import React from 'react';
import { ArrowRight, BadgeCheck, BedDouble, CalendarCheck2, MapPin, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi, money } from '../lib/display';
import { DemoRecordMark, EmptyState, Metric, StatusPill } from '../components/ui';

export function PublicHomesView({ navigate }: { navigate: (path: string) => void }) {
  const { lang, mode, dataset, publicHomes } = useOperating();
  const completed = dataset.enquiries.filter((item) => item.stage === 'completed').length;
  const received = dataset.enquiries.reduce((sum, item) => sum + (item.payment?.receivedAt ? item.payment.amountEgp : 0), 0);
  const activeStays = dataset.enquiries.filter((item) => ['hold', 'payment_pending', 'payment_received', 'community_approval_pending', 'community_approved', 'confirmed'].includes(item.stage)).length;

  return (
    <div>
      <section className="hero-wash border-b border-clay-200">
        <div className="page-shell grid gap-10 py-16 md:py-24 lg:grid-cols-[1.08fr_.92fr] lg:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusPill tone={mode === 'demo' ? 'demo' : 'good'}>{mode === 'demo' ? bi(lang, 'Mature operating demo', 'عرض تشغيل ناضج') : bi(lang, 'Live collection', 'المجموعة الفعلية')}</StatusPill>
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-ink-500">{bi(lang, 'Field proof before promise', 'التوثيق الميداني قبل الوعد')}</span>
            </div>
            <h1 className="mt-7 max-w-4xl font-serif text-5xl leading-[.98] tracking-[-0.045em] text-ink-950 sm:text-6xl lg:text-7xl">
              {bi(lang, 'Homes chosen for how life feels inside them.', 'بيوت نختارها على أساس إحساس الحياة بداخلها.')}
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-ink-600">
              {mode === 'demo'
                ? bi(lang, 'See Little Hut as a mature operation: proven homes, a working supply network, independent assessments, active enquiries, holds, payments, and community approvals — all clearly synthetic.', 'شاهد ليتل هت كمنظومة ناضجة: بيوت موثقة، شبكة توريد، تقييمات مستقلة، طلبات نشطة، حجوزات مؤقتة، مدفوعات وموافقات كمبوند — وكلها بيانات تجريبية واضحة.')
                : bi(lang, 'Only independently verified, owner-approved homes will appear here. Live contains no placeholders and makes no claims before evidence exists.', 'لن يظهر هنا إلا البيوت التي تم توثيقها بشكل مستقل ووافق عليها مالكها. لا يحتوي الوضع الفعلي على بيانات افتراضية ولا يعرض ادعاءات قبل وجود الدليل.')}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => document.getElementById('homes')?.scrollIntoView({ behavior: 'smooth' })} className="button-primary">{bi(lang, 'Explore homes', 'استكشف البيوت')}<ArrowRight size={15} className="rtl:rotate-180" /></button>
              <button onClick={() => navigate('/joining')} className="button-secondary">{bi(lang, 'See how homes join', 'شاهد كيف تنضم البيوت')}</button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Metric label="Verified homes" labelAr="بيوت موثقة" value={publicHomes.length} detail="Public and currently bookable" detailAr="منشورة ومتاحة للطلب حالياً" tone="terracotta" />
            <Metric label="Active journeys" labelAr="رحلات حجز نشطة" value={activeStays} detail="Hold through confirmed" detailAr="من الحجز المؤقت حتى التأكيد" />
            <Metric label="Completed stays" labelAr="إقامات مكتملة" value={completed} detail="Recorded outcomes" detailAr="نتائج مسجلة" />
            <Metric label="Payments recorded" labelAr="مدفوعات مسجلة" value={money(received, lang)} detail={mode === 'demo' ? 'Synthetic operating value' : 'Verified Live value'} detailAr={mode === 'demo' ? 'قيمة تشغيلية تجريبية' : 'قيمة فعلية موثقة'} tone="ink" />
          </div>
        </div>
      </section>

      <section id="homes" className="page-shell py-16 md:py-20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="eyebrow">{bi(lang, 'The public collection', 'المجموعة العامة')}</span>
            <h2 className="section-title mt-3">{bi(lang, 'Proven homes, not inventory.', 'بيوت موثقة وليست مجرد مخزون.')}</h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-ink-600">{bi(lang, 'Rates stay private. The public promise is limited to independently proven Moments and current operating status.', 'تظل الأسعار خاصة. الوعد العام يقتصر على اللحظات المثبتة بشكل مستقل وحالة التشغيل الحالية.')}</p>
        </div>

        {publicHomes.length === 0 ? (
          <div className="mt-10"><EmptyState icon="data" title="No verified Live homes yet" titleAr="لا توجد بيوت فعلية موثقة حتى الآن" description="This is intentional. A home appears only after independent assessment, explicit owner approval, rate floor, payout readiness, calendar authority, and activation are complete." descriptionAr="هذا مقصود. لا يظهر أي بيت إلا بعد اكتمال التقييم المستقل، وموافقة المالك الصريحة، والحد الأدنى للسعر، وجاهزية التحويل، وسلطة التقويم والتفعيل." actionLabel="Open Joining Little Hut" actionLabelAr="افتح مسار الانضمام" onAction={() => navigate('/joining')} /></div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-3">
            {publicHomes.map((home) => (
              <article key={home.id} className="property-card group">
                <button onClick={() => navigate(`/homes/${home.slug}`)} className="block w-full text-start">
                  <div className="relative aspect-[4/3] overflow-hidden bg-clay-100">
                    <img src={home.heroImage} alt={lang === 'ar' ? home.nameAr : home.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]" />
                    <div className="absolute inset-x-0 top-0 flex items-start justify-between p-4">
                      <StatusPill tone="good"><BadgeCheck size={12} />{bi(lang, 'Verified home', 'بيت موثق')}</StatusPill>
                      <span className="rounded-full bg-ink-950/80 px-3 py-1 text-[9px] font-bold uppercase tracking-[.14em] text-white backdrop-blur">{bi(lang, 'Request to stay', 'طلب إقامة')}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <DemoRecordMark />
                    <div className="mt-3 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-3xl leading-tight text-ink-950">{lang === 'ar' ? home.nameAr : home.name}</h3>
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-500"><MapPin size={13} className="text-terracotta-700" />{lang === 'ar' ? home.locationAr : home.location}</p>
                      </div>
                      <ArrowRight size={19} className="mt-1 text-terracotta-700 transition group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                    </div>
                    <p className="mt-5 text-sm leading-6 text-ink-600">{lang === 'ar' ? home.summaryAr : home.summary}</p>
                    <div className="mt-6 flex flex-wrap gap-2 border-t border-clay-200 pt-4 text-[10px] font-semibold text-ink-600">
                      <span className="inline-flex items-center gap-1"><BedDouble size={13} />{home.bedroomCount} {bi(lang, 'bedrooms', 'غرف')}</span>
                      <span className="inline-flex items-center gap-1"><Users size={13} />{home.maxGuests} {bi(lang, 'guests', 'ضيوف')}</span>
                      <span className="inline-flex items-center gap-1"><Sparkles size={13} />{home.provenMoments.length} {bi(lang, 'proven Moments', 'لحظات موثقة')}</span>
                    </div>
                  </div>
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="border-y border-clay-200 bg-white">
        <div className="page-shell grid gap-8 py-12 md:grid-cols-3">
          {[
            [ShieldCheck, 'Independent proof', 'توثيق مستقل', 'Assessors own evidence. Scouts and operators cannot prove a Moment.', 'المقيّم المستقل يمتلك الدليل. لا يحق للكشاف أو المشغل إثبات اللحظة.'],
            [CalendarCheck2, 'One booking record', 'سجل حجز واحد', 'The same Enquiry carries qualification, quote, hold, payment, approval, and outcome.', 'نفس الطلب يحمل التأهيل والسعر والحجز المؤقت والدفع والموافقة والنتيجة.'],
            [Users, 'Reserved authority', 'صلاحيات محددة', 'Owner, operator, assessor, scout, and community authority each control a different gate.', 'كل من المالك والمشغل والمقيّم والكشاف وجهة الكمبوند يمتلك بوابة مختلفة.'],
          ].map(([Icon, title, titleAr, body, bodyAr]) => {
            const C = Icon as typeof ShieldCheck;
            return <div key={title as string} className="flex gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-700"><C size={18} /></div><div><h3 className="font-semibold text-ink-900">{bi(lang, title as string, titleAr as string)}</h3><p className="mt-2 text-xs leading-6 text-ink-600">{bi(lang, body as string, bodyAr as string)}</p></div></div>;
          })}
        </div>
      </section>
    </div>
  );
}
