import React from 'react';
import { CheckCircle2, ClipboardCheck, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi } from '../lib/display';
import {
  captureLiveProofStay,
  recordLiveInventoryBaseline,
  recordLiveStayReadiness,
  type InventoryBaselineItemInput,
  type ProofStayObservationInput,
  type ReadinessCheckItemInput,
} from '../lib/live-api';
import type { Enquiry, Property, ReadinessCheckKey } from '../types';
import { StatusPill } from './ui';

const readinessKeys: ReadonlyArray<ReadinessCheckKey> = ['access', 'cleanliness', 'utilities', 'sleeping', 'safety', 'moment_setup'];
const readinessLabels: Record<ReadinessCheckKey, [string, string]> = {
  access: ['Access ready', 'الدخول جاهز'],
  cleanliness: ['Cleanliness ready', 'النظافة جاهزة'],
  utilities: ['Utilities working', 'المرافق تعمل'],
  sleeping: ['Sleeping setup ready', 'تجهيز النوم جاهز'],
  safety: ['Safety check passed', 'فحص السلامة ناجح'],
  moment_setup: ['Moment setup ready', 'تجهيز اللحظة جاهز'],
};

const blankBaselineItem = (index: number): InventoryBaselineItemInput => ({
  key: `item_${index + 1}`,
  label: '',
  labelAr: '',
  expectedQuantity: 1,
  evidenceReference: '',
});

export function StayAssurancePanel() {
  const { lang, mode, auth, dataset, refreshLiveDataset } = useOperating();
  const [baselineDrafts, setBaselineDrafts] = React.useState<Record<string, InventoryBaselineItemInput[]>>({});
  const [readinessDrafts, setReadinessDrafts] = React.useState<Record<string, ReadinessCheckItemInput[]>>({});
  const [snapshotDrafts, setSnapshotDrafts] = React.useState<Record<string, ProofStayObservationInput[]>>({});
  const [busy, setBusy] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  if (mode !== 'live' || auth.partner?.role !== 'operator') return null;

  const properties = dataset.properties.filter((property) => property.operatorPartnerId === auth.partner?.id && property.supplyStage === 'live' && property.sealIssued);
  const enquiries = dataset.enquiries.filter((enquiry) => properties.some((property) => property.id === enquiry.propertyId) && ['confirmed', 'completed'].includes(enquiry.stage));

  const fail = (key: string, error: unknown) => setErrors((current) => ({ ...current, [key]: error instanceof Error ? error.message : 'operation_failed' }));
  const run = async (key: string, action: () => Promise<unknown>) => {
    setBusy(key); setErrors((current) => ({ ...current, [key]: '' }));
    try { await action(); await refreshLiveDataset(); }
    catch (error) { fail(key, error); }
    finally { setBusy(''); }
  };

  const baselineFor = (property: Property) => baselineDrafts[property.id] || property.inventoryBaseline?.items.map((item) => ({ ...item })) || [blankBaselineItem(0), blankBaselineItem(1)];
  const readinessFor = (enquiry: Enquiry) => readinessDrafts[enquiry.id] || readinessKeys.map((key) => ({ key, status: 'passed' as const, evidenceReference: '' }));
  const snapshotFor = (enquiry: Enquiry, property: Property) => snapshotDrafts[enquiry.id] || property.inventoryBaseline?.items.map((item) => ({ key: item.key, observedQuantity: item.expectedQuantity, condition: 'good' as const, evidenceReference: '' })) || [];

  return (
    <section className="mt-10 rounded-[1.75rem] border border-clay-200 bg-ivory-50 p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-terracotta-700">{bi(lang, 'Stay assurance', 'ضمان الإقامة')}</p><h2 className="mt-2 font-serif text-3xl text-ink-950">{bi(lang, 'Baseline → readiness → ProofStay', 'خط أساس ← جاهزية ← إثبات الإقامة')}</h2><p className="mt-2 max-w-3xl text-xs leading-6 text-ink-600">{bi(lang, 'Operational evidence only. It protects the stay record without changing the independent assessment, owner terms, community authority, or Little Hut seal.', 'دليل تشغيلي فقط. يحمي سجل الإقامة دون تغيير التقييم المستقل أو شروط المالك أو جهة اعتماد الكمبوند أو ختم ليتل هت.')}</p></div>
        <StatusPill tone="neutral"><ShieldCheck size={12} />{properties.length} {bi(lang, 'assigned Live homes', 'بيوت فعلية مسندة')}</StatusPill>
      </div>

      <div className="mt-7 space-y-5">
        {properties.map((property) => {
          const draft = baselineFor(property);
          const key = `baseline:${property.id}`;
          const locked = enquiries.some((enquiry) => enquiry.propertyId === property.id && enquiry.stage === 'confirmed' && enquiry.proofStay?.preStay);
          return <article key={property.id} className="rounded-2xl border border-clay-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><strong className="text-sm text-ink-900">{lang === 'ar' ? property.nameAr : property.name}</strong><p className="mt-1 text-[10px] text-ink-500">{property.inventoryBaseline ? `${bi(lang, 'Baseline captured', 'تم تسجيل خط الأساس')}: ${new Date(property.inventoryBaseline.capturedAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB')}` : bi(lang, 'No inventory baseline yet', 'لا يوجد خط أساس للمحتويات بعد')}</p></div>{property.inventoryBaseline && <StatusPill tone="good"><CheckCircle2 size={12} />{property.inventoryBaseline.items.length} {bi(lang, 'items', 'عناصر')}</StatusPill>}</div>
            {!locked && <div className="mt-4 space-y-3">{draft.map((item, index) => <div key={`${property.id}-${index}`} className="grid gap-2 md:grid-cols-[.7fr_1fr_1fr_.55fr_1.2fr_auto]">
              <input className="field-input" value={item.key} onChange={(event) => setBaselineDrafts((current) => ({ ...current, [property.id]: draft.map((value, i) => i === index ? { ...value, key: event.target.value } : value) }))} placeholder="key" />
              <input className="field-input" value={item.label} onChange={(event) => setBaselineDrafts((current) => ({ ...current, [property.id]: draft.map((value, i) => i === index ? { ...value, label: event.target.value } : value) }))} placeholder={bi(lang, 'Item', 'العنصر')} />
              <input className="field-input" value={item.labelAr} onChange={(event) => setBaselineDrafts((current) => ({ ...current, [property.id]: draft.map((value, i) => i === index ? { ...value, labelAr: event.target.value } : value) }))} placeholder={bi(lang, 'Arabic label', 'الاسم بالعربية')} />
              <input type="number" min={1} max={100} className="field-input" value={item.expectedQuantity} onChange={(event) => setBaselineDrafts((current) => ({ ...current, [property.id]: draft.map((value, i) => i === index ? { ...value, expectedQuantity: Number(event.target.value) } : value) }))} />
              <input className="field-input" value={item.evidenceReference} onChange={(event) => setBaselineDrafts((current) => ({ ...current, [property.id]: draft.map((value, i) => i === index ? { ...value, evidenceReference: event.target.value } : value) }))} placeholder={bi(lang, 'Evidence reference', 'مرجع الدليل')} />
              <button type="button" disabled={draft.length <= 1} onClick={() => setBaselineDrafts((current) => ({ ...current, [property.id]: draft.filter((_, i) => i !== index) }))} className="button-secondary px-3"><Trash2 size={14} /></button>
            </div>)}
              <div className="flex flex-wrap gap-2"><button type="button" onClick={() => setBaselineDrafts((current) => ({ ...current, [property.id]: [...draft, blankBaselineItem(draft.length)] }))} className="button-secondary"><Plus size={14} />{bi(lang, 'Add item', 'أضف عنصر')}</button><button disabled={busy === key || draft.some((item) => !item.key.trim() || !item.label.trim() || !item.evidenceReference.trim() || item.expectedQuantity < 1)} onClick={() => void run(key, () => recordLiveInventoryBaseline(property.id, draft))} className="button-primary"><ClipboardCheck size={14} />{property.inventoryBaseline ? bi(lang, 'Replace baseline', 'تحديث خط الأساس') : bi(lang, 'Record baseline', 'تسجيل خط الأساس')}</button></div>
            </div>}
            {locked && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">{bi(lang, 'Baseline locked while a confirmed stay already has a pre-stay snapshot.', 'خط الأساس مقفل لأن هناك إقامة مؤكدة تم تسجيل لقطة ما قبل الإقامة لها.')}</p>}
            {errors[key] && <p className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700">{errors[key]}</p>}
          </article>;
        })}
      </div>

      <div className="mt-8 space-y-5">
        {enquiries.map((enquiry) => {
          const property = properties.find((item) => item.id === enquiry.propertyId);
          if (!property) return null;
          const readiness = readinessFor(enquiry);
          const snapshot = snapshotFor(enquiry, property);
          const readinessKey = `readiness:${enquiry.id}`;
          const snapshotKey = `snapshot:${enquiry.id}`;
          const phase = enquiry.stage === 'completed' ? 'post_stay' : 'pre_stay';
          const snapshotExists = phase === 'pre_stay' ? enquiry.proofStay?.preStay : enquiry.proofStay?.postStay;
          return <article key={enquiry.id} className="rounded-2xl border border-clay-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3"><div><strong className="text-sm text-ink-900">{enquiry.guestName} · {lang === 'ar' ? property.nameAr : property.name}</strong><p className="mt-1 text-[10px] text-ink-500">{enquiry.checkIn} → {enquiry.checkOut} · {bi(lang, enquiry.stage === 'confirmed' ? 'Confirmed stay' : 'Completed stay', enquiry.stage === 'confirmed' ? 'إقامة مؤكدة' : 'إقامة مكتملة')}</p></div>{enquiry.proofStay?.result && <StatusPill tone={enquiry.proofStay.result.status === 'verified_unchanged' ? 'good' : 'warn'}>{enquiry.proofStay.result.status === 'verified_unchanged' ? bi(lang, 'ProofStay verified', 'إثبات الإقامة مطابق') : bi(lang, 'Attention required', 'يلزم مراجعة')}</StatusPill>}</div>

            {enquiry.stage === 'confirmed' && !enquiry.readinessCheck && <div className="mt-5"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-ink-500">{bi(lang, '1 · Readiness evidence', '١ · دليل الجاهزية')}</p><div className="mt-3 grid gap-3 lg:grid-cols-2">{readiness.map((item, index) => <div key={item.key} className="grid gap-2 rounded-xl bg-ivory-50 p-3 sm:grid-cols-[.8fr_1fr] sm:items-center"><div><strong className="block text-xs text-ink-800">{bi(lang, readinessLabels[item.key][0], readinessLabels[item.key][1])}</strong><select className="field-input mt-2" value={item.status} onChange={(event) => setReadinessDrafts((current) => ({ ...current, [enquiry.id]: readiness.map((value, i) => i === index ? { ...value, status: event.target.value as 'passed' | 'failed' } : value) }))}><option value="passed">{bi(lang, 'Passed', 'ناجح')}</option><option value="failed">{bi(lang, 'Failed', 'غير ناجح')}</option></select></div><input className="field-input" value={item.evidenceReference} onChange={(event) => setReadinessDrafts((current) => ({ ...current, [enquiry.id]: readiness.map((value, i) => i === index ? { ...value, evidenceReference: event.target.value } : value) }))} placeholder={bi(lang, 'Evidence reference', 'مرجع الدليل')} /></div>)}</div><button disabled={busy === readinessKey || !property.inventoryBaseline || readiness.some((item) => !item.evidenceReference.trim())} onClick={() => void run(readinessKey, () => recordLiveStayReadiness(enquiry.id, { items: readiness }))} className="button-primary mt-3">{bi(lang, 'Record readiness', 'تسجيل الجاهزية')}</button>{errors[readinessKey] && <p className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700">{errors[readinessKey]}</p>}</div>}

            {enquiry.readinessCheck && <div className="mt-5 flex flex-wrap items-center gap-2"><StatusPill tone={enquiry.readinessCheck.status === 'ready' ? 'good' : 'bad'}>{bi(lang, 'Readiness', 'الجاهزية')}: {enquiry.readinessCheck.status === 'ready' ? bi(lang, 'Ready', 'جاهز') : bi(lang, 'Blocked', 'متوقف')}</StatusPill>{enquiry.proofStay?.preStay && <StatusPill tone="good">{bi(lang, 'Pre-stay captured', 'تم تسجيل ما قبل الإقامة')}</StatusPill>}{enquiry.proofStay?.postStay && <StatusPill tone="good">{bi(lang, 'Post-stay captured', 'تم تسجيل ما بعد الإقامة')}</StatusPill>}</div>}

            {!snapshotExists && property.inventoryBaseline && ((phase === 'pre_stay' && enquiry.readinessCheck?.status === 'ready') || phase === 'post_stay') && <div className="mt-5"><p className="text-[10px] font-bold uppercase tracking-[.14em] text-ink-500">{phase === 'pre_stay' ? bi(lang, '2 · Pre-stay ProofStay', '٢ · إثبات ما قبل الإقامة') : bi(lang, 'Post-stay ProofStay', 'إثبات ما بعد الإقامة')}</p><div className="mt-3 space-y-2">{snapshot.map((item, index) => {
              const baselineItem = property.inventoryBaseline?.items.find((value) => value.key === item.key);
              return <div key={item.key} className="grid gap-2 rounded-xl bg-ivory-50 p-3 md:grid-cols-[1fr_.45fr_.7fr_1.2fr] md:items-center"><strong className="text-xs text-ink-800">{lang === 'ar' ? baselineItem?.labelAr : baselineItem?.label}</strong><input type="number" min={0} max={100} className="field-input" value={item.observedQuantity} onChange={(event) => setSnapshotDrafts((current) => ({ ...current, [enquiry.id]: snapshot.map((value, i) => i === index ? { ...value, observedQuantity: Number(event.target.value) } : value) }))} /><select className="field-input" value={item.condition} onChange={(event) => setSnapshotDrafts((current) => ({ ...current, [enquiry.id]: snapshot.map((value, i) => i === index ? { ...value, condition: event.target.value as ProofStayObservationInput['condition'] } : value) }))}><option value="good">{bi(lang, 'Good', 'جيد')}</option><option value="attention">{bi(lang, 'Attention', 'يلزم مراجعة')}</option><option value="missing">{bi(lang, 'Missing', 'مفقود')}</option></select><input className="field-input" value={item.evidenceReference} onChange={(event) => setSnapshotDrafts((current) => ({ ...current, [enquiry.id]: snapshot.map((value, i) => i === index ? { ...value, evidenceReference: event.target.value } : value) }))} placeholder={bi(lang, 'Photo / evidence reference', 'مرجع الصورة / الدليل')} /></div>;
            })}</div><button disabled={busy === snapshotKey || snapshot.length === 0 || snapshot.some((item) => !item.evidenceReference.trim())} onClick={() => void run(snapshotKey, () => captureLiveProofStay(enquiry.id, phase, snapshot))} className="button-primary mt-3">{phase === 'pre_stay' ? bi(lang, 'Capture pre-stay', 'تسجيل ما قبل الإقامة') : bi(lang, 'Capture post-stay', 'تسجيل ما بعد الإقامة')}</button>{errors[snapshotKey] && <p className="mt-3 rounded-xl bg-red-50 p-3 text-xs text-red-700">{errors[snapshotKey]}</p>}</div>}

            {enquiry.proofStay?.result?.changedKeys.length ? <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">{bi(lang, 'Changed inventory keys', 'عناصر تغيرت')}: {enquiry.proofStay.result.changedKeys.join(', ')}</p> : null}
          </article>;
        })}
      </div>
    </section>
  );
}
