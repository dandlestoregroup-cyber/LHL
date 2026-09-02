import React from 'react';
import { ArrowRight, Compass, MapPin, Plus, ShieldAlert } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi, label, supplyLabels } from '../lib/display';
import { DemoRecordMark, EmptyState, Metric, PageHeader, StatusPill } from '../components/ui';

export function ScoutView() {
  const { lang, dataset, createScoutLead } = useOperating();
  const scouts = dataset.partners.filter((item) => item.role === 'scout');
  const [open, setOpen] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [form, setForm] = React.useState({ name: '', nameAr: '', location: '', locationAr: '' });
  const sourced = dataset.properties.filter((item) => ['sourced', 'owner_engaged', 'assessment_scheduled'].includes(item.supplyStage));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.location.trim()) return;
    createScoutLead(form.name, form.nameAr, form.location, form.locationAr);
    setForm({ name: '', nameAr: '', location: '', locationAr: '' });
    setSaved(true);
    setOpen(false);
  };

  return (
    <div>
      <PageHeader eyebrow="Scout sourcing" eyebrowAr="توريد الكشاف" title="Find the home. Do not certify it." titleAr="اكتشف البيت، لكن لا تمنحه الاعتماد." description="Scouts own sourcing, first contact, consent, and listing-level evidence. Every claim stays nominated until an independent assessor visits." descriptionAr="يمتلك الكشاف مسؤولية الترشيح والتواصل الأول والموافقة وأدلة الإعلان. يظل كل ادعاء مجرد ترشيح حتى زيارة مقيّم مستقل." action={<button disabled={scouts.length === 0} onClick={() => { setOpen(true); setSaved(false); }} className="button-primary"><Plus size={15} />{scouts.length === 0 ? bi(lang, 'Scout partner required', 'يلزم كشاف شريك') : bi(lang, 'Source a property', 'أضف عقاراً مرشحاً')}</button>} />
      <section className="page-shell py-10">
        {saved && <div className="mb-6 rounded-2xl border border-sage-200 bg-sage-50 p-4 text-sm text-sage-900">{bi(lang, 'Lead saved inside the active dataset only.', 'تم حفظ الترشيح داخل مجموعة البيانات الحالية فقط.')}</div>}
        {open && <form onSubmit={submit} className="mb-8 rounded-[1.5rem] border border-terracotta-200 bg-white p-6 shadow-xl"><div className="flex items-center gap-2 text-terracotta-700"><Compass size={18} /><strong>{bi(lang, 'New sourcing lead', 'ترشيح جديد')}</strong></div><p className="mt-2 text-xs text-ink-500">{bi(lang, 'No Moment, availability, or quality claim is created here.', 'لا يتم هنا إنشاء أي ادعاء عن اللحظات أو الإتاحة أو الجودة.')}</p><div className="mt-5 grid gap-4 md:grid-cols-2"><label className="field-label">{bi(lang, 'English name', 'الاسم بالإنجليزية')}<input className="field-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></label><label className="field-label">{bi(lang, 'Arabic name', 'الاسم بالعربية')}<input className="field-input" value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })} /></label><label className="field-label">{bi(lang, 'Location in English', 'الموقع بالإنجليزية')}<input className="field-input" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></label><label className="field-label">{bi(lang, 'Location in Arabic', 'الموقع بالعربية')}<input className="field-input" value={form.locationAr} onChange={(e) => setForm({ ...form, locationAr: e.target.value })} /></label></div><div className="mt-5 flex gap-3"><button className="button-primary">{bi(lang, 'Save sourced lead', 'حفظ العقار المرشح')}</button><button type="button" onClick={() => setOpen(false)} className="button-secondary">{bi(lang, 'Cancel', 'إلغاء')}</button></div></form>}

        <div className="grid gap-3 md:grid-cols-3">
          <Metric label="Active scouts" labelAr="كشافون نشطون" value={scouts.length} detail="Partner records with sourcing authority" detailAr="سجلات شركاء بصلاحية التوريد" />
          <Metric label="Early-stage supply" labelAr="معروض في المراحل الأولى" value={sourced.length} detail="Sourced through assessment scheduled" detailAr="من الترشيح حتى جدولة التقييم" tone="terracotta" />
          <Metric label="Public claims created" labelAr="ادعاءات عامة تم إنشاؤها" value="0" detail="Scout authority ceiling" detailAr="حد صلاحية الكشاف" tone="ink" />
        </div>

        <div className="mt-10 overflow-hidden rounded-[1.5rem] border border-clay-200 bg-white">
          <div className="flex items-center justify-between border-b border-clay-200 p-5"><div><h2 className="font-serif text-2xl text-ink-950">{bi(lang, 'Sourcing desk', 'مكتب التوريد')}</h2><p className="mt-1 text-xs text-ink-500">{bi(lang, 'Latest early-stage supply', 'أحدث المعروض في المراحل الأولى')}</p></div><DemoRecordMark /></div>
          {sourced.length === 0 ? <div className="p-6"><EmptyState title="No sourced properties yet" titleAr="لا توجد عقارات مرشحة بعد" description="Use Source a property to create the first truth-only lead in this mode." descriptionAr="استخدم إضافة عقار مرشح لإنشاء أول ترشيح حقيقي في هذا الوضع." /></div> : <div className="divide-y divide-clay-200">{sourced.map((home) => <div key={home.id} className="grid gap-4 p-5 md:grid-cols-[1.4fr_.8fr_.8fr_auto] md:items-center"><div><strong className="text-sm text-ink-900">{lang === 'ar' ? home.nameAr : home.name}</strong><p className="mt-1 flex items-center gap-1 text-[10px] text-ink-500"><MapPin size={11} />{lang === 'ar' ? home.locationAr : home.location}</p></div><span className="text-xs text-ink-600">{dataset.partners.find((partner) => partner.id === home.scoutPartnerId)?.[lang === 'ar' ? 'nameAr' : 'name'] || bi(lang, 'Unassigned scout', 'كشاف غير مسند')}</span><StatusPill>{label(supplyLabels, home.supplyStage, lang)}</StatusPill><button className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[.12em] text-terracotta-700">{bi(lang, 'Evidence record', 'سجل الدليل')}<ArrowRight size={13} className="rtl:rotate-180" /></button></div>)}</div>}
        </div>
        <div className="mt-6 flex gap-3 rounded-2xl border border-clay-200 bg-ivory-100 p-5 text-xs leading-6 text-ink-600"><ShieldAlert size={19} className="mt-0.5 shrink-0 text-terracotta-700" /><p><strong className="text-ink-900">{bi(lang, 'Evidence ceiling:', 'حد الدليل:')}</strong> {bi(lang, 'listing copy, owner statements, and scout observations can open an assessment — they cannot prove a Little Hut Moment.', 'نص الإعلان وأقوال المالك وملاحظات الكشاف يمكنها فتح تقييم، لكنها لا تثبت لحظة من لحظات ليتل هت.')}</p></div>
      </section>
    </div>
  );
}
