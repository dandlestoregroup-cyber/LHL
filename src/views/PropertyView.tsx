import React from 'react';
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarDays, Check, Clock3, MapPin, ShieldCheck, Sparkles, Users } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi, momentLabels } from '../lib/display';
import { DemoRecordMark, EmptyState, StatusPill } from '../components/ui';
import type { MomentKey } from '../types';

const momentSlugs: Record<MomentKey, string> = {
  slow_morning: 'slow-morning',
  long_table: 'late-breakfast',
  afternoon_drift: 'barefoot-afternoon',
  night_swim: 'family-play',
  fire_conversation: 'the-long-sit',
  silent_reading: 'under-stars',
};

const isoDay = (offset: number) => {
  const value = new Date();
  value.setUTCDate(value.getUTCDate() + offset);
  return value.toISOString().slice(0, 10);
};

export function PropertyView({ slug, navigate }: { slug: string; navigate: (path: string) => void }) {
  const { lang, dataset, createEnquiry } = useOperating();
  const home = dataset.properties.find((item) => item.slug === slug && item.supplyStage === 'live' && item.publiclyVisible && item.sealIssued);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState('');
  const [form, setForm] = React.useState({ guestName: '', guestPhoneMasked: '', checkIn: isoDay(7), checkOut: isoDay(10), adults: 2, children: 0, requestedMoment: 'slow_morning' as MomentKey });

  if (!home) {
    return <div className="page-shell py-16"><EmptyState title="This home is not public in the active mode" titleAr="هذا البيت غير منشور في الوضع الحالي" description="Switch modes or return to the public collection. Hidden, Joining, paused, and declined properties never leak through a direct URL." descriptionAr="غيّر الوضع أو ارجع للمجموعة العامة. العقارات المخفية أو قيد الانضمام أو المتوقفة أو المرفوضة لا تظهر عبر الرابط المباشر." actionLabel="Back to homes" actionLabelAr="العودة للبيوت" onAction={() => navigate('/')} /></div>;
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!form.guestName.trim() || !form.guestPhoneMasked.trim()) {
      setError(bi(lang, 'Name and phone are required.', 'الاسم ورقم الهاتف مطلوبان.'));
      return;
    }
    setSubmitting(true);
    try {
      await createEnquiry({ ...form, propertyId: home.id });
      setSubmitted(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create enquiry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#FAF5EE] text-[#2A201C]">
      <div className="page-shell py-10 md:py-14">
        <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#6D5A50] hover:text-[#B84E36]"><ArrowLeft size={15} className="rtl:rotate-180" />{bi(lang, 'Back to collection', 'العودة للمجموعة')}</button>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_.5fr]">
          <div className="aspect-[16/9] overflow-hidden rounded-[1.9rem] bg-[#EBDDD1] shadow-[0_24px_70px_rgba(80,52,39,.10)]"><img src={home.heroImage} alt={lang === 'ar' ? home.nameAr : home.name} className="h-full w-full object-cover" /></div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            {home.galleryImages.slice(0, 2).map((image) => <div key={image} className="aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-[#EBDDD1] lg:aspect-auto"><img src={image} alt="" className="h-full w-full object-cover" /></div>)}
          </div>
        </div>

        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_420px]">
          <div>
            <div className="flex flex-wrap items-center gap-2"><StatusPill tone="good"><BadgeCheck size={12} />{bi(lang, 'Verified Little Hut residence', 'عقار موثق من ليتل هت')}</StatusPill><DemoRecordMark /></div>
            <p className="mt-5 text-[10px] font-black uppercase tracking-[.22em] text-[#C8A15A]">{bi(lang, 'Book the feeling, not just the stay', 'احجز الإحساس، وليس فقط الإقامة')}</p>
            <h1 className="mt-3 font-serif text-5xl tracking-tight text-[#2A201C] md:text-6xl">{lang === 'ar' ? home.nameAr : home.name}</h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-[#7D6A60]"><MapPin size={15} className="text-[#B84E36]" />{lang === 'ar' ? home.locationAr : home.location}</p>
            <p className="mt-7 max-w-3xl text-base leading-8 text-[#6D5A50]">{lang === 'ar' ? home.summaryAr : home.summary}</p>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="fact-card"><Users size={17} /><strong>{home.maxGuests}</strong><span>{bi(lang, 'max guests', 'ضيف كحد أقصى')}</span></div>
              <div className="fact-card"><Sparkles size={17} /><strong>{home.provenMoments.length}</strong><span>{bi(lang, 'proven Moments', 'لحظات موثقة')}</span></div>
              <div className="fact-card"><ShieldCheck size={17} /><strong>{home.communityApprovalRequired ? bi(lang, 'Required', 'مطلوبة') : bi(lang, 'Not required', 'غير مطلوبة')}</strong><span>{bi(lang, 'community approval', 'موافقة الكمبوند')}</span></div>
            </div>

            <div className="mt-12">
              <span className="text-[10px] font-black uppercase tracking-[.22em] text-[#B84E36]">{bi(lang, 'Independently proven', 'موثقة بشكل مستقل')}</span>
              <h2 className="mt-3 font-serif text-4xl tracking-tight text-[#2A201C]">{bi(lang, 'Moments this home can honestly promise', 'اللحظات التي يستطيع هذا البيت أن يعد بها بصدق')}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#6D5A50]">{bi(lang, 'Each Moment below comes from recorded residence evidence. Open it to see the canonical guest promise and qualification criteria.', 'كل لحظة أدناه ناتجة عن دليل مسجل للعقار. افتحها لرؤية الوعد المعتمد للضيف ومعايير التأهيل.')}</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {home.provenMoments.map((moment) => <button key={moment.key} onClick={() => navigate(`/moments/${momentSlugs[moment.key]}`)} className="group rounded-2xl border border-[#E5D5C9] bg-[#FFFDFC] p-5 text-start transition hover:-translate-y-0.5 hover:border-[#B84E36]/45 hover:shadow-md"><div className="flex items-start justify-between gap-3"><Sparkles size={17} className="text-[#B84E36]" /><ArrowRight size={15} className="text-[#B84E36] opacity-40 transition group-hover:translate-x-1 group-hover:opacity-100 rtl:rotate-180 rtl:group-hover:-translate-x-1" /></div><h3 className="mt-4 font-serif text-2xl text-[#2A201C]">{momentLabels[moment.key][lang]}</h3><p className="mt-2 text-xs leading-6 text-[#6D5A50]">{lang === 'ar' ? moment.summaryAr : moment.summary}</p><span className="mt-4 block text-[9px] font-bold uppercase tracking-[.15em] text-[#9C887D]">{bi(lang, 'Evidence', 'الدليل')}: {moment.evidenceId}</span></button>)}
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-40 lg:self-start">
            <div className="rounded-[1.7rem] border border-[#E2CDBD] bg-[#FFFDFC] p-6 shadow-[0_22px_70px_rgba(80,50,35,.10)] md:p-7">
              <span className="text-[10px] font-black uppercase tracking-[.2em] text-[#B84E36]">{bi(lang, 'One verified enquiry record', 'سجل طلب موثق واحد')}</span>
              <h2 className="mt-3 font-serif text-3xl text-[#2A201C]">{bi(lang, 'Request an invitation to stay', 'اطلب دعوة للإقامة')}</h2>
              <p className="mt-2 text-xs leading-6 text-[#7D6A60]">{bi(lang, 'Availability and the tailored accommodation quote are handled by the assigned Operator. No public rate is invented or exposed here.', 'يتولى المشغل المعين التحقق من الإتاحة وإصدار سعر الإقامة المناسب. لا يتم اختلاق أو عرض سعر عام هنا.')}</p>
              {submitted ? (
                <div className="py-10 text-center"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage-100 text-sage-800"><Check /></div><h3 className="mt-5 font-serif text-2xl text-[#2A201C]">{bi(lang, 'Request sent to the Operator desk', 'تم إرسال الطلب إلى مكتب المشغل')}</h3><p className="mt-2 text-xs leading-6 text-[#6D5A50]">{bi(lang, 'The same enquiry record now carries the journey through qualification, quote, hold, payment, approval, and stay outcome.', 'يحمل نفس سجل الطلب الآن الرحلة عبر التأهيل والسعر والحجز المؤقت والدفع والموافقة ونتيجة الإقامة.')}</p></div>
              ) : (
                <form onSubmit={submit} className="mt-6 space-y-4">
                  {error && <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</p>}
                  <label className="field-label">{bi(lang, 'Guest name', 'اسم الضيف')}<input value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} className="field-input" placeholder={bi(lang, 'Full name', 'الاسم بالكامل')} /></label>
                  <label className="field-label">{bi(lang, 'Phone', 'رقم الهاتف')}<input value={form.guestPhoneMasked} onChange={(e) => setForm({ ...form, guestPhoneMasked: e.target.value })} className="field-input" placeholder="+20…" /></label>
                  <div className="grid grid-cols-2 gap-3"><label className="field-label">{bi(lang, 'Check-in', 'الوصول')}<input type="date" value={form.checkIn} onChange={(e) => setForm({ ...form, checkIn: e.target.value })} className="field-input" /></label><label className="field-label">{bi(lang, 'Check-out', 'المغادرة')}<input type="date" min={form.checkIn || undefined} value={form.checkOut} onChange={(e) => setForm({ ...form, checkOut: e.target.value })} className="field-input" /></label></div>
                  <div className="grid grid-cols-2 gap-3"><label className="field-label">{bi(lang, 'Adults', 'البالغون')}<input type="number" min={1} max={home.maxGuests} value={form.adults} onChange={(e) => setForm({ ...form, adults: Number(e.target.value) })} className="field-input" /></label><label className="field-label">{bi(lang, 'Children', 'الأطفال')}<input type="number" min={0} max={home.maxGuests} value={form.children} onChange={(e) => setForm({ ...form, children: Number(e.target.value) })} className="field-input" /></label></div>
                  <label className="field-label">{bi(lang, 'Moment focus', 'اللحظة المفضلة')}<select value={form.requestedMoment} onChange={(e) => setForm({ ...form, requestedMoment: e.target.value as MomentKey })} className="field-input">{home.provenMoments.map((moment) => <option key={moment.key} value={moment.key}>{momentLabels[moment.key][lang]}</option>)}</select></label>
                  <div className="flex gap-2 rounded-xl bg-[#FAF0EB] p-3 text-[10px] leading-5 text-[#6D5A50]"><Clock3 size={15} className="mt-0.5 shrink-0 text-[#B84E36]" />{home.communityApprovalRequired ? bi(lang, 'Community approval is required and prevents instant confirmation.', 'موافقة الكمبوند مطلوبة وتمنع التأكيد الفوري.') : bi(lang, 'The operator verifies calendar authority and availability before any hold.', 'يتحقق المشغل من سلطة التقويم والإتاحة قبل أي حجز مؤقت.')}</div>
                  <button disabled={submitting} className="button-primary w-full justify-center disabled:opacity-50"><CalendarDays size={15} />{submitting ? bi(lang, 'Sending…', 'جارٍ الإرسال…') : bi(lang, 'Send stay request', 'إرسال طلب الإقامة')}</button>
                </form>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}