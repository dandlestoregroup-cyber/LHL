import React from 'react';
import { ArrowLeft, BadgeCheck, CalendarDays, Check, Clock3, MapPin, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi, momentLabels } from '../lib/display';
import { DemoRecordMark, EmptyState, StatusPill } from '../components/ui';
import type { MomentKey } from '../types';

const isoDay = (offset: number) => {
  const value = new Date();
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
};

export function PropertyView({ slug, navigate }: { slug: string; navigate: (path: string) => void }) {
  const { lang, dataset, createEnquiry } = useOperating();
  const home = dataset.properties.find((item) => item.slug === slug && item.supplyStage === 'live' && item.publiclyVisible);
  const [submitted, setSubmitted] = React.useState(false);
  const [error, setError] = React.useState('');
  const [form, setForm] = React.useState({ guestName: '', guestPhoneMasked: '', checkIn: isoDay(7), checkOut: isoDay(10), adults: 2, children: 0, requestedMoment: 'slow_morning' as MomentKey });

  if (!home) {
    return <div className="page-shell py-16"><EmptyState title="This home is not public in the active mode" titleAr="هذا البيت غير منشور في الوضع الحالي" description="Switch modes or return to the public collection. Hidden, Joining, paused, and declined properties never leak through a direct URL." descriptionAr="غيّر الوضع أو ارجع للمجموعة العامة. العقارات المخفية أو قيد الانضمام أو المتوقفة أو المرفوضة لا تظهر عبر الرابط المباشر." actionLabel="Back to homes" actionLabelAr="العودة للبيوت" onAction={() => navigate('/')} /></div>;
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!form.guestName.trim() || !form.guestPhoneMasked.trim()) {
      setError(bi(lang, 'Name and phone are required.', 'الاسم ورقم الهاتف مطلوبان.'));
      return;
    }
    try {
      createEnquiry({ ...form, propertyId: home.id });
      setSubmitted(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create enquiry.');
    }
  };

  return (
    <div className="page-shell py-10 md:py-14">
      <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-ink-600 hover:text-terracotta-700"><ArrowLeft size={15} className="rtl:rotate-180" />{bi(lang, 'Back to homes', 'العودة للبيوت')}</button>
      <div className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_.5fr]">
        <div className="aspect-[16/9] overflow-hidden rounded-[1.75rem] bg-clay-100"><img src={home.heroImage} alt={lang === 'ar' ? home.nameAr : home.name} className="h-full w-full object-cover" /></div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          {home.galleryImages.slice(0, 2).map((image) => <div key={image} className="aspect-[4/3] overflow-hidden rounded-[1.4rem] bg-clay-100 lg:aspect-auto"><img src={image} alt="" className="h-full w-full object-cover" /></div>)}
        </div>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_420px]">
        <div>
          <div className="flex flex-wrap items-center gap-2"><StatusPill tone="good"><BadgeCheck size={12} />{bi(lang, 'Verified Little Hut home', 'بيت ليتل هت موثق')}</StatusPill><DemoRecordMark /></div>
          <h1 className="mt-5 font-serif text-5xl tracking-tight text-ink-950 md:text-6xl">{lang === 'ar' ? home.nameAr : home.name}</h1>
          <p className="mt-3 flex items-center gap-2 text-sm text-ink-500"><MapPin size={15} className="text-terracotta-700" />{lang === 'ar' ? home.locationAr : home.location}</p>
          <p className="mt-7 max-w-3xl text-base leading-8 text-ink-600">{lang === 'ar' ? home.summaryAr : home.summary}</p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="fact-card"><Users size={17} /><strong>{home.maxGuests}</strong><span>{bi(lang, 'max guests', 'ضيف كحد أقصى')}</span></div>
            <div className="fact-card"><Sparkles size={17} /><strong>{home.provenMoments.length}</strong><span>{bi(lang, 'proven Moments', 'لحظات موثقة')}</span></div>
            <div className="fact-card"><ShieldCheck size={17} /><strong>{home.communityApprovalRequired ? bi(lang, 'Required', 'مطلوبة') : bi(lang, 'Not required', 'غير مطلوبة')}</strong><span>{bi(lang, 'community approval', 'موافقة الكمبوند')}</span></div>
          </div>

          <div className="mt-12">
            <span className="eyebrow">{bi(lang, 'Independently proven', 'موثقة بشكل مستقل')}</span>
            <h2 className="section-title mt-3">{bi(lang, 'Moments this home can honestly promise', 'اللحظات التي يستطيع هذا البيت أن يعد بها بصدق')}</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {home.provenMoments.map((moment) => <div key={moment.key} className="rounded-2xl border border-clay-200 bg-white p-5"><Sparkles size={17} className="text-terracotta-700" /><h3 className="mt-4 font-serif text-2xl text-ink-950">{lang === 'ar' ? moment.titleAr : moment.title}</h3><p className="mt-2 text-xs leading-6 text-ink-600">{lang === 'ar' ? moment.summaryAr : moment.summary}</p><span className="mt-4 block text-[9px] font-bold uppercase tracking-[.15em] text-ink-400">{bi(lang, 'Evidence', 'الدليل')}: {moment.evidenceId}</span></div>)}
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-40 lg:self-start">
          <div className="rounded-[1.6rem] border border-clay-200 bg-white p-6 shadow-[0_22px_70px_rgba(80,50,35,.09)] md:p-7">
            <span className="eyebrow">{bi(lang, 'One enquiry record', 'سجل طلب واحد')}</span>
            <h2 className="mt-3 font-serif text-3xl text-ink-950">{bi(lang, 'Request to stay', 'اطلب الإقامة')}</h2>
            <p className="mt-2 text-xs leading-6 text-ink-500">{bi(lang, 'No public rate. The operator qualifies dates, then quotes within the owner mandate.', 'لا يوجد سعر عام. يتحقق المشغل من التواريخ ثم يرسل سعراً داخل تفويض المالك.')}</p>
            {submitted ? (
              <div className="py-10 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-800"><Check /></div><h3 className="mt-5 font-serif text-2xl text-ink-950">{bi(lang, 'Enquiry created', 'تم إنشاء الطلب')}</h3><p className="mt-2 text-xs leading-6 text-ink-600">{bi(lang, 'The same record is now visible in the operator and booking pipeline surfaces.', 'أصبح نفس السجل ظاهراً الآن في واجهة المشغل ومسار الحجز.')}</p><button onClick={() => navigate('/pipeline')} className="button-primary mt-5">{bi(lang, 'View booking spine', 'عرض مسار الحجز')}</button></div>
            ) : (
              <form onSubmit={submit} className="mt-6 space-y-4">
                {error && <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</p>}
                <label className="field-label">{bi(lang, 'Guest name', 'اسم الضيف')}<input value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} className="field-input" placeholder={bi(lang, 'Full name', 'الاسم بالكامل')} /></label>
                <label className="field-label">{bi(lang, 'Phone', 'رقم الهاتف')}<input value={form.guestPhoneMasked} onChange={(e) => setForm({ ...form, guestPhoneMasked: e.target.value })} className="field-input" placeholder="+20…" /></label>
                <div className="grid grid-cols-2 gap-3"><label className="field-label">{bi(lang, 'Check-in', 'الوصول')}<input type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} className="field-input" /></label><label className="field-label">{bi(lang, 'Check-out', 'المغادرة')}<input type="date" value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} className="field-input" /></label></div>
                <div className="grid grid-cols-2 gap-3"><label className="field-label">{bi(lang, 'Adults', 'البالغون')}<input type="number" min={1} max={home.maxGuests} value={form.adults} onChange={(e) => setForm({ ...form, adults: Number(e.target.value) })} className="field-input" /></label><label className="field-label">{bi(lang, 'Children', 'الأطفال')}<input type="number" min={0} max={home.maxGuests} value={form.children} onChange={(e) => setForm({ ...form, children: Number(e.target.value) })} className="field-input" /></label></div>
                <label className="field-label">{bi(lang, 'Moment focus', 'اللحظة المفضلة')}<select value={form.requestedMoment} onChange={(e) => setForm({ ...form, requestedMoment: e.target.value as MomentKey })} className="field-input">{home.provenMoments.map((moment) => <option key={moment.key} value={moment.key}>{momentLabels[moment.key][lang]}</option>)}</select></label>
                <div className="flex gap-2 rounded-xl bg-ivory-100 p-3 text-[10px] leading-5 text-ink-600"><Clock3 size={15} className="mt-0.5 shrink-0 text-terracotta-700" />{home.communityApprovalRequired ? bi(lang, 'Community approval is required and prevents instant confirmation.', 'موافقة الكمبوند مطلوبة وتمنع التأكيد الفوري.') : bi(lang, 'The operator verifies the calendar before any hold.', 'يتحقق المشغل من التقويم قبل أي حجز مؤقت.')}</div>
                <button className="button-primary w-full justify-center"><CalendarDays size={15} />{bi(lang, 'Create stay enquiry', 'إنشاء طلب إقامة')}</button>
              </form>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
