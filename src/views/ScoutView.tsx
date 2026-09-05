import React from 'react';
import { ArrowRight, CheckCircle2, Compass, MapPin, Plus, ShieldAlert } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi, label, supplyLabels } from '../lib/display';
import { recordLiveOwnerConsent } from '../lib/live-api';
import { DemoRecordMark, EmptyState, Metric, PageHeader, StatusPill } from '../components/ui';

export function ScoutView() {
  const { lang, mode, auth, dataset, createScoutLead, refreshLiveDataset } = useOperating();
  const scouts = dataset.partners.filter((item) => item.role === 'scout');
  const canSource = mode === 'demo' ? scouts.length > 0 : auth.partner?.role === 'scout';
  const [open, setOpen] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState('');
  const [consentDrafts, setConsentDrafts] = React.useState<Record<string, string>>({});
  const [form, setForm] = React.useState({ name: '', nameAr: '', location: '', locationAr: '' });
  const sourced = dataset.properties.filter((item) => ['sourced', 'owner_engaged', 'assessment_scheduled'].includes(item.supplyStage));

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.location.trim()) return;
    setBusy(true); setError('');
    try {
      await createScoutLead(form.name, form.nameAr, form.location, form.locationAr);
      setForm({ name: '', nameAr: '', location: '', locationAr: '' });
      setSaved(true); setOpen(false);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to save sourced lead.');
    } finally { setBusy(false); }
  };

  const recordConsent = async (propertyId: string) => {
    const reference = consentDrafts[propertyId]?.trim();
    if (!reference) return;
    setBusy(true); setError('');
    try {
      await recordLiveOwnerConsent(propertyId, reference);
      await refreshLiveDataset();
      setConsentDrafts((current) => ({ ...current, [propertyId]: '' }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to record owner consent evidence.');
    } finally { setBusy(false); }
  };

  return (
    <div>
      <PageHeader eyebrow="Scout sourcing" eyebrowAr="توريد الكشاف" title="Find the home. Do not certify it." titleAr="اكتشف البيت، لكن لا تمنحه الاعتماد." description="Scouts own sourcing, first contact, consent, and listing-level evidence. Every claim stays nominated until an independent assessor visits." descriptionAr="يمتلك الكشاف مسؤولية الترشيح والتواصل الأول والموافقة وأدلة الإعلان. يظل كل ادعاء مجرد ترشيح حتى زيارة مقيّم مستقل." action={<button disabled={!canSource} onClick={() => { setOpen(true); setSaved(false); }} className="button-primary"><Plus size={15} />{canSource ? bi(lang, 'Source a property', 'أضف عقاراً مرشحاً') : bi(lang, 'Scout authority required', 'يلزم صلاحية كشاف')}</button>} />
      <section className="page-shell py-10">
        {saved && <div className="mb-6 rounded-2xl border border-sage-200 bg-sage-50 p-4 text-sm text-sage-900">{mode === 'live' ? bi(lang, 'Live lead stored on the server.', 'تم حفظ الترشيح الفعلي على الخادم.') : bi(lang, 'Demo lead saved inside the synthetic dataset.', 'تم حفظ الترشيح داخل البيانات التجريبية.')}</div>}
        {error && <div className="mb-6 rounded-2xl bg-red-50 p-4 text-xs text-red-700">{error}</div>}
        {open && <form onSubmit={submit} className="mb-8 rounded-[1.5rem] border border-terracotta-200 bg-white p-6 shadow-xl"><div className="flex items-center gap-2 text-terracotta-700"><Compass size={18} /><strong>{bi(lang, 'New sourcing lead', 'ترشيح جديد')}</strong></div><p className="mt-2 text-xs text-ink-500">{bi(lang, 'No Moment, availability, or quality claim is created here.', 'لا يتم هنا إنشاء أي ادعاء عن اللحظات أو الإتاحة أو الجودة.')}</p><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="field-label">{bi(lang, 'English name', 'الاسم بالإنجليزية')}<input className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label className="field-label">{bi(lang, 'Arabic name', 'الاسم بالعربية')}<input className="field-input" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} /></label><label className="field-label">{bi(lang, 'Location in English', 'الموقع بالإنجليزية')}<input className="field-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label><label className="field-label">{bi(lang, 'Location in Arabic', 'الموقع بالعربية')}<input className="field-input" value={form.locationAr} onChange={(e) => setForm({ ...form, locationAr: e.target.value })} /></label></div><div className="mt-5 flex gap-3"><button disabled={busy} className="button-primary">{busy ? bi(lang, 'Saving…', 'جارٍ الحفظ…') : bi(lang, 'Save sourced lead', 'حفظ العقار المرشح')}</button><button type="button" onClick={() => setOpen(false)} className="button-secondary">{bi(lang, 'Cancel', 'إلغاء')}</button></div></form>}

        <div className="grid gap-3 md:grid-cols-3">
          <Metric label="Active scouts" labelAr="كشافون نشطون" value={scouts.length} detail="Partner records with sourcing authority" detailAr="سجلات شركاء بصلاحية التوريد" />
          <Metric label="Early-stage supply" labelAr="معروض في المراحل الأولى" value={sourced.length} detail="Sourced through assessment scheduled" detailAr="من الترشيح حتى جدولة التقييم" tone="terracotta" />
          <Metric label="Public claims created" labelAr="ادعاءات عامة تم إنشاؤها" value="0" detail="Scout authority ceiling" detailAr="حد صلاحية الكشاف" tone="ink" />
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-clay-200 bg-white">
          <div className="flex items-center justify-between border-b border-clay-200 p-5"><div><h2 className="font-serif text-2xl text-ink-950">{bi(lang, 'Sourcing desk', 'مكتب التوريد')}</h2><p className="mt-1 text-xs text-ink-500">{bi(lang, 'Latest early-stage supply', 'أحدث المعروض في المراحل الأولى')}</p></div><DemoRecordMark /></div>
          {sourced.length === 0 ? <div className="p-6"><EmptyState title="No sourced properties yet" titleAr="لا توجد عقارات مرشحة بعد" description="Use Source a property to create the first truth-only lead in this mode." descriptionAr="استخدم إضافة عقار مرشح لإنشاء أول ترشيح حقيقي في هذا الوضع." /></div> : <div className="divide-y divide-clay-200">{sourced.map((home) => {
            const isSourceScout = mode === 'live' && auth.partner?.role === 'scout' && auth.partner.id === home.scoutPartnerId;
            return <div key={home.id} className="p-5"><div className="grid gap-4 md:grid-cols-[1.4fr_.8fr_.8fr_auto] md:items-center"><div><strong className="text-sm text-ink-900">{lang === 'ar' ? home.nameAr : home.name}</strong><p className="mt-1 flex items-center gap-1 text-[10px] text-ink-500"><MapPin size={11} />{lang === 'ar' ? home.locationAr : home.location}</p></div><span className="text-xs text-ink-600">{dataset.partners.find((partner) => partner.id === home.scoutPartnerId)?.[lang === 'ar' ? 'nameAr' : 'name'] || (isSourceScout ? auth.partner?.name : bi(lang, 'Assigned Scout', 'الكشاف المعين'))}</span><StatusPill>{label(supplyLabels, home.supplyStage, lang)}</StatusPill><span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.12em] text-terracotta-700">{bi(lang, 'Evidence record', 'سجل الدليل')}<ArrowRight size={13} className="rtl:rotate-180" /></span></div>
              {isSourceScout && home.supplyStage === 'sourced' && <div className="mt-4 rounded-xl border border-clay-200 bg-ivory-50 p-4">{home.ownerConsentReference ? <div className="flex items-center gap-2 text-xs text-sage-900"><CheckCircle2 size={15} />{bi(lang, 'Owner consent evidence recorded. Platform admin can now bind the verified Owner Partner.', 'تم تسجيل دليل موافقة المالك. يمكن لمسؤول المنصة الآن ربط سجل المالك الموثق.')}</div> : <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end"><label className="field-label">{bi(lang, 'Owner consent evidence reference', 'مرجع دليل موافقة المالك')}<input className="field-input" value={consentDrafts[home.id] || ''} onChange={(event) => setConsentDrafts((current) => ({ ...current, [home.id]: event.target.value }))} placeholder={bi(lang, 'Consent document / call / signed reference', 'مرجع مستند / مكالمة / موافقة موقعة')} /></label><button disabled={busy || !consentDrafts[home.id]?.trim()} onClick={() => void recordConsent(home.id)} className="button-primary">{bi(lang, 'Record consent', 'تسجيل الموافقة')}</button></div>}</div>}
            </div>;
          })}</div>}
        </div>
        <div className="mt-6 flex gap-3 rounded-2xl border border-clay-200 bg-ivory-100 p-5 text-xs leading-6 text-ink-600"><ShieldAlert size={19} className="mt-0.5 shrink-0 text-terracotta-700" /><p><strong className="text-ink-900">{bi(lang, 'Evidence ceiling:', 'حد الدليل:')}</strong> {bi(lang, 'listing copy, owner statements, and scout observations can open an assessment — they cannot prove a Little Hut Moment.', 'نص الإعلان وأقوال المالك وملاحظات الكشاف يمكنها فتح تقييم، لكنها لا تثبت لحظة من لحظات ليتل هت.')}</p></div>
      </section>
    </div>
  );
}
