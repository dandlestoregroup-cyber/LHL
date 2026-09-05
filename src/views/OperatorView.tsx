import React from 'react';
import { AlertTriangle, ArrowRight, CalendarClock, CheckCircle2, CircleDollarSign, Clock3, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi, enquiryLabels, label, money } from '../lib/display';
import { calendarEffect } from '../lib/lh-core';
import { DemoRecordMark, EmptyState, Metric, PageHeader, StatusPill } from '../components/ui';
import { StayAssurancePanel } from '../components/StayAssurancePanel';
import type { AdvanceLiveInput } from '../lib/live-api';

const nextAction = (stage: string, requiresApproval: boolean, lang: 'en' | 'ar') => {
  const copy: Record<string, [string, string]> = {
    received: ['Qualify enquiry', 'تأهيل الطلب'], qualified: ['Check availability', 'فحص الإتاحة'], availability_checked: ['Issue in-floor quote', 'إصدار سعر داخل الحد'],
    quoted: ['Place 2-hour hold', 'حجز مؤقت لساعتين'], hold: ['Request payment', 'طلب الدفع'], payment_pending: ['Record payment', 'تسجيل الدفع'],
    payment_received: requiresApproval ? ['Submit for community approval', 'الإرسال لموافقة الكمبوند'] : ['Confirm stay', 'تأكيد الإقامة'], community_approved: ['Confirm stay', 'تأكيد الإقامة'], confirmed: ['Complete stay', 'إكمال الإقامة'],
  };
  const value = copy[stage];
  return value ? bi(lang, value[0], value[1]) : null;
};

type ActionDraft = { nightlyRate?: string; paymentReference?: string; paymentAmount?: string; approvalEvidence?: string };

export function OperatorView({ navigate }: { navigate: (path: string) => void }) {
  const { lang, mode, auth, dataset, executeNextEnquiryAction, recordCommunityApproval, getPartnerName } = useOperating();
  const canOperate = mode === 'demo' || auth.partner?.role === 'operator';
  const [drafts, setDrafts] = React.useState<Record<string, ActionDraft>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [busyId, setBusyId] = React.useState('');
  const active = dataset.enquiries.filter((item) => !['completed', 'declined', 'expired', 'cancelled'].includes(item.stage));
  const holds = active.filter((item) => calendarEffect(item).blocksCalendar).length;
  const approvalQueue = active.filter((item) => item.stage === 'community_approval_pending').length;
  const payments = dataset.enquiries.reduce((sum, item) => sum + (item.payment?.receivedAt ? item.payment.amountEgp : 0), 0);

  const updateDraft = (id: string, patch: ActionDraft) => setDrafts((current) => ({ ...current, [id]: { ...(current[id] || {}), ...patch } }));

  const runAction = async (enquiryId: string, stage: string) => {
    if (!canOperate) return;
    const draft = drafts[enquiryId] || {};
    const input: AdvanceLiveInput = {};
    if (mode === 'live' && stage === 'availability_checked') {
      const value = Number(draft.nightlyRate);
      if (!Number.isFinite(value) || value <= 0) { setErrors((current) => ({ ...current, [enquiryId]: bi(lang, 'Enter the real nightly accommodation quote.', 'أدخل سعر الإقامة الليلي الحقيقي.') })); return; }
      input.nightlyRateEgp = value;
    }
    if (mode === 'live' && stage === 'payment_pending') {
      const amount = Number(draft.paymentAmount);
      if (!draft.paymentReference?.trim() || !Number.isFinite(amount) || amount <= 0) { setErrors((current) => ({ ...current, [enquiryId]: bi(lang, 'Payment reference and exact received amount are required.', 'مرجع الدفع والمبلغ المستلم فعلياً مطلوبان.') })); return; }
      input.paymentReference = draft.paymentReference.trim();
      input.paymentAmountEgp = amount;
    }
    setBusyId(enquiryId); setErrors((current) => ({ ...current, [enquiryId]: '' }));
    try { await executeNextEnquiryAction(enquiryId, input); }
    catch (error) { setErrors((current) => ({ ...current, [enquiryId]: error instanceof Error ? error.message : 'Unable to advance enquiry.' })); }
    finally { setBusyId(''); }
  };

  const captureApproval = async (enquiryId: string) => {
    if (!canOperate) return;
    const evidence = drafts[enquiryId]?.approvalEvidence;
    setBusyId(enquiryId); setErrors((current) => ({ ...current, [enquiryId]: '' }));
    try { await recordCommunityApproval(enquiryId, evidence); }
    catch (error) { setErrors((current) => ({ ...current, [enquiryId]: error instanceof Error ? error.message : 'Unable to record approval evidence.' })); }
    finally { setBusyId(''); }
  };

  return (
    <div>
      <PageHeader eyebrow="Operator execution" eyebrowAr="تنفيذ المشغل" title="One queue from enquiry to completed stay." titleAr="قائمة واحدة من الطلب حتى اكتمال الإقامة." description="Operators verify, quote above the owner floor, place expiring holds, record payment evidence, submit community cases, and close stays only after readiness and pre-stay assurance are evidenced." descriptionAr="يتحقق المشغل ويصدر سعراً أعلى من حد المالك ويضع حجوزات مؤقتة منتهية ويسجل دليل الدفع ويرسل حالات الكمبوند ولا يغلق الإقامة إلا بعد توثيق الجاهزية وما قبل الإقامة." action={<button onClick={() => navigate('/pipeline')} className="button-primary">{bi(lang, 'Open full pipeline', 'افتح المسار الكامل')}<ArrowRight size={15} className="rtl:rotate-180" /></button>} />
      <section className="page-shell py-10">
        {mode === 'live' && !canOperate && <div className="mb-6 rounded-xl bg-amber-50 p-4 text-xs text-amber-900">{bi(lang, 'Inspection only. Your Live Partner role is not Operator, so execution controls are disabled.', 'عرض فقط. صلاحية الشريك الفعلية ليست مشغلاً، لذلك أدوات التنفيذ معطلة.')}</div>}
        <div className="grid gap-3 md:grid-cols-4"><Metric label="Active enquiries" labelAr="طلبات نشطة" value={active.length} /><Metric label="Calendar blocks" labelAr="حجوزات تحجب التقويم" value={holds} detail="Active holds + confirmed" detailAr="الحجوزات المؤقتة النشطة + المؤكدة" tone="terracotta" /><Metric label="Approval queue" labelAr="قائمة الموافقات" value={approvalQueue} /><Metric label="Payments recorded" labelAr="مدفوعات مسجلة" value={money(payments, lang)} tone="ink" /></div>

        <StayAssurancePanel />

        {dataset.enquiries.length === 0 ? <div className="mt-10"><EmptyState title="No Live booking enquiries yet" titleAr="لا توجد طلبات حجز فعلية بعد" description="The operator queue is ready. It will populate from a real public home enquiry; Demo enquiries cannot appear here while Live is active." descriptionAr="قائمة المشغل جاهزة. ستظهر السجلات من طلب حقيقي على بيت منشور؛ ولا يمكن للطلبات التجريبية الظهور هنا أثناء الوضع الفعلي." actionLabel="View public homes" actionLabelAr="عرض البيوت العامة" onAction={() => navigate('/')} /></div> : (
          <div className="mt-10 space-y-4">
            {active.map((enquiry) => {
              const home = dataset.properties.find((item) => item.id === enquiry.propertyId);
              if (!home) return null;
              const action = nextAction(enquiry.stage, home.communityApprovalRequired, lang);
              const calendar = calendarEffect(enquiry);
              const draft = drafts[enquiry.id] || {};
              const busy = busyId === enquiry.id;
              const completionReady = mode !== 'live' || enquiry.stage !== 'confirmed' || Boolean(
                home.inventoryBaseline?.items.length &&
                enquiry.readinessCheck?.status === 'ready' &&
                enquiry.proofStay?.preStay &&
                enquiry.readinessCheck.baselineCapturedAt === home.inventoryBaseline.capturedAt &&
                enquiry.proofStay.preStay.baselineCapturedAt === home.inventoryBaseline.capturedAt
              );
              return <article key={enquiry.id} className="rounded-[1.5rem] border border-clay-200 bg-white p-6">
                <div className="grid gap-6 lg:grid-cols-[1.25fr_.8fr_.8fr_auto] lg:items-center">
                  <div><div className="flex flex-wrap items-center gap-2"><StatusPill tone={enquiry.stage.includes('approval') ? 'warn' : enquiry.stage === 'confirmed' ? 'good' : 'neutral'}>{label(enquiryLabels, enquiry.stage, lang)}</StatusPill><DemoRecordMark /></div><h2 className="mt-3 font-serif text-2xl text-ink-950">{enquiry.guestName} · {lang === 'ar' ? home.nameAr : home.name}</h2><p className="mt-2 text-xs text-ink-500">{enquiry.checkIn} → {enquiry.checkOut} · {enquiry.adults + enquiry.children} {bi(lang, 'guests', 'ضيوف')}</p></div>
                  <div className="space-y-2 text-xs text-ink-600"><span className="flex items-center gap-2"><CircleDollarSign size={14} className="text-terracotta-700" />{enquiry.quote ? money(enquiry.quote.totalEgp, lang) : bi(lang, 'Not quoted', 'لم يتم التسعير')}</span><span className="flex items-center gap-2"><CalendarClock size={14} className="text-terracotta-700" />{calendar.blocksCalendar ? bi(lang, 'Calendar blocked', 'التقويم محجوز') : bi(lang, 'No calendar block', 'لا يوجد حجب للتقويم')}</span></div>
                  <div className="space-y-2 text-xs text-ink-600"><span className="flex items-center gap-2"><UserRoundCheck size={14} className="text-terracotta-700" />{getPartnerName(home.operatorPartnerId)}</span><span className="flex items-center gap-2"><ShieldCheck size={14} className="text-terracotta-700" />{home.communityApprovalRequired ? bi(lang, 'Community gate applies', 'بوابة الكمبوند مطلوبة') : bi(lang, 'No community gate', 'لا توجد بوابة كمبوند')}</span></div>
                  <div className="min-w-[250px] lg:text-end">
                    {enquiry.stage === 'community_approval_pending' ? mode === 'demo' ? <button disabled={!canOperate || busy} onClick={() => void captureApproval(enquiry.id)} className="button-secondary whitespace-nowrap"><CheckCircle2 size={14} />{bi(lang, 'Record issued approval', 'تسجيل موافقة صادرة')}</button> : canOperate ? <div className="space-y-2"><input aria-label={bi(lang, 'External approval evidence reference', 'مرجع دليل الموافقة الخارجية')} value={draft.approvalEvidence || ''} onChange={(event) => updateDraft(enquiry.id, { approvalEvidence: event.target.value })} className="field-input" placeholder={bi(lang, 'Issued approval reference', 'مرجع الموافقة الصادرة')} /><button disabled={busy || !draft.approvalEvidence?.trim()} onClick={() => void captureApproval(enquiry.id)} className="button-secondary w-full justify-center whitespace-nowrap disabled:opacity-40"><CheckCircle2 size={14} />{bi(lang, 'Record external approval', 'تسجيل الموافقة الخارجية')}</button></div> : <StatusPill tone="warn">{bi(lang, 'Operator required', 'يلزم المشغل')}</StatusPill>
                    : mode === 'live' && enquiry.stage === 'availability_checked' && canOperate ? <div className="space-y-2"><input type="number" min={1} className="field-input" value={draft.nightlyRate || ''} onChange={(event) => updateDraft(enquiry.id, { nightlyRate: event.target.value })} placeholder={bi(lang, 'Nightly accommodation EGP', 'سعر الإقامة الليلي بالجنيه')} /><button disabled={busy} onClick={() => void runAction(enquiry.id, enquiry.stage)} className="button-primary w-full justify-center">{action}</button></div>
                    : mode === 'live' && enquiry.stage === 'payment_pending' && canOperate ? <div className="space-y-2"><input className="field-input" value={draft.paymentReference || ''} onChange={(event) => updateDraft(enquiry.id, { paymentReference: event.target.value })} placeholder={bi(lang, 'External payment reference', 'مرجع الدفع الخارجي')} /><input type="number" min={1} className="field-input" value={draft.paymentAmount || ''} onChange={(event) => updateDraft(enquiry.id, { paymentAmount: event.target.value })} placeholder={bi(lang, 'Amount received EGP', 'المبلغ المستلم بالجنيه')} /><button disabled={busy} onClick={() => void runAction(enquiry.id, enquiry.stage)} className="button-primary w-full justify-center">{action}</button></div>
                    : action ? <button disabled={!canOperate || busy || !completionReady} onClick={() => void runAction(enquiry.id, enquiry.stage)} className="button-primary whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-40">{action}<ArrowRight size={14} className="rtl:rotate-180" /></button> : <StatusPill>{bi(lang, 'No action', 'لا إجراء')}</StatusPill>}
                  </div>
                </div>
                {!completionReady && enquiry.stage === 'confirmed' && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-900">{bi(lang, 'Complete the current inventory baseline, readiness check, and pre-stay ProofStay above before closing this stay.', 'أكمل خط أساس المحتويات الحالي وفحص الجاهزية وإثبات ما قبل الإقامة أعلاه قبل إغلاق الإقامة.')}</p>}
                {errors[enquiry.id] && <p className="mt-4 rounded-xl bg-red-50 p-3 text-xs text-red-700">{errors[enquiry.id]}</p>}
                {enquiry.hold?.expiresAt && <div className={`mt-5 flex items-center gap-2 rounded-xl p-3 text-[10px] ${calendar.blocksCalendar ? 'bg-terracotta-50 text-terracotta-900' : 'bg-clay-100 text-ink-500'}`}><Clock3 size={14} />{bi(lang, 'Hold expires', 'ينتهي الحجز المؤقت')}: {new Date(enquiry.hold.expiresAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB')}</div>}
                {enquiry.stage === 'community_approval_pending' && <div className="mt-4 flex gap-2 rounded-xl bg-amber-50 p-3 text-[10px] leading-5 text-amber-900"><AlertTriangle size={14} className="mt-0.5 shrink-0" />{bi(lang, 'This records an approval already issued by the named authority; it does not let the operator issue one. Live requires the external evidence reference.', 'هذا يسجل موافقة صدرت بالفعل من الجهة المحددة ولا يمنح المشغل صلاحية إصدارها. الوضع الفعلي يتطلب مرجع الدليل الخارجي.')}</div>}
              </article>;
            })}
          </div>
        )}
      </section>
    </div>
  );
}