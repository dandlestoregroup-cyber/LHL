import React from 'react';
import { ArrowRight, CheckCircle2, CircleDashed, LockKeyhole, MapPin, PauseCircle, ShieldCheck, XCircle } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi, label, momentLabels, partnerRoleLabels, supplyLabels } from '../lib/display';
import {
  activateServerLiveProperty,
  assignLiveCommunityAuthority,
  assignLiveOperator,
  assignLiveOwner,
  scheduleLiveAssessment,
  submitLiveAssessment,
  submitLiveOwnerDecision,
  type AssessmentFindingInput,
} from '../lib/live-api';
import { DemoRecordMark, EmptyState, PageHeader, StatusPill } from '../components/ui';
import type { Assessment, MomentKey, OperatingDataset, OwnerDecision, Partner, Property, SupplyStage } from '../types';

const stages: SupplyStage[] = ['sourced', 'owner_engaged', 'assessment_scheduled', 'decision_pending', 'activation_ready', 'live', 'paused', 'declined'];
const trustKeys = ['truth', 'readiness', 'privacy', 'comfort', 'arrival', 'moment'] as const;
const shieldKeys = ['fire', 'water', 'access', 'electrical', 'child', 'emergency'] as const;
const momentKeys: MomentKey[] = ['slow_morning', 'long_table', 'afternoon_drift', 'night_swim', 'fire_conversation', 'silent_reading'];

const gateLabels: Record<string, [string, string]> = {
  truth: ['Truth', 'الصدق'], readiness: ['Readiness', 'الجاهزية'], privacy: ['Privacy', 'الخصوصية'], comfort: ['Comfort', 'الراحة'], arrival: ['Arrival', 'الوصول'], moment: ['Moment integrity', 'سلامة اللحظة'],
  fire: ['Fire', 'الحريق'], water: ['Water', 'المياه'], access: ['Access', 'الدخول'], electrical: ['Electrical', 'الكهرباء'], child: ['Child safety', 'سلامة الأطفال'], emergency: ['Emergency', 'الطوارئ'],
};

const tomorrow = () => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
};

const emptyFindings = (keys: readonly string[]): Record<string, AssessmentFindingInput> =>
  Object.fromEntries(keys.map((key) => [key, { status: 'passed' as const, evidenceReference: '' }]));

export function JoiningView({ navigate }: { navigate: (path: string) => void }) {
  const { lang, mode, auth, dataset, refreshLiveDataset } = useOperating();

  return (
    <div>
      <PageHeader eyebrow="Supply operating model" eyebrowAr="نموذج تشغيل المعروض" title="Joining Little Hut is a gated journey." titleAr="الانضمام لليتل هت رحلة ذات بوابات واضحة." description="A sourced home is not a public home. Evidence, independent assessment, explicit owner choice, commercial mandate, and activation each have a named owner." descriptionAr="العقار المرشح ليس بيتاً منشوراً. كل من الدليل والتقييم المستقل وقرار المالك والتفويض التجاري والتفعيل له مسؤول محدد." action={<button onClick={() => navigate('/scout')} className="button-primary">{bi(lang, 'Open Scout sourcing', 'افتح توريد الكشاف')}<ArrowRight size={15} className="rtl:rotate-180" /></button>} />

      <section className="page-shell py-10">
        <div className="supply-track">
          {stages.slice(0, 6).map((stage, index) => <div key={stage} className="supply-step"><span>{index + 1}</span><strong>{label(supplyLabels, stage, lang)}</strong><small>{dataset.properties.filter((item) => item.supplyStage === stage).length}</small></div>)}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[10px] text-ink-500"><StatusPill tone="warn"><PauseCircle size={12} />{label(supplyLabels, 'paused', lang)}: {dataset.properties.filter((item) => item.supplyStage === 'paused').length}</StatusPill><StatusPill tone="bad"><XCircle size={12} />{label(supplyLabels, 'declined', lang)}: {dataset.properties.filter((item) => item.supplyStage === 'declined').length}</StatusPill></div>
      </section>

      <section className="page-shell pb-16">
        {dataset.properties.length === 0 ? <EmptyState title="No supply records in Live" titleAr="لا توجد سجلات معروض فعلية" description="The supply workspace is ready. Create a real lead from Scout sourcing; it will begin at Sourced and remain non-public until every gate is complete." descriptionAr="مساحة المعروض جاهزة. أنشئ ترشيحاً حقيقياً من واجهة الكشاف؛ سيبدأ كعقار مرشح ويظل غير منشور حتى تكتمل كل البوابات." actionLabel="Source first home" actionLabelAr="أضف أول بيت مرشح" onAction={() => navigate('/scout')} /> : (
          <div className="grid gap-5 xl:grid-cols-2">
            {dataset.properties.map((home) => {
              const assessment = dataset.assessments.find((item) => item.propertyId === home.id);
              const decision = dataset.ownerDecisions.find((item) => item.propertyId === home.id);
              return <article key={home.id} className="rounded-[1.5rem] border border-clay-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4"><StatusPill tone={home.supplyStage === 'live' ? 'good' : home.supplyStage === 'declined' ? 'bad' : home.supplyStage === 'paused' ? 'warn' : 'neutral'}>{label(supplyLabels, home.supplyStage, lang)}</StatusPill><DemoRecordMark /></div>
                <h2 className="mt-5 font-serif text-2xl text-ink-950">{lang === 'ar' ? home.nameAr : home.name}</h2>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-500"><MapPin size={13} className="text-terracotta-700" />{lang === 'ar' ? home.locationAr : home.location}</p>
                <p className="mt-4 text-xs leading-6 text-ink-600">{lang === 'ar' ? home.summaryAr : home.summary}</p>
                <div className="mt-6 grid gap-2 text-xs sm:grid-cols-2">
                  <GateRow done={Boolean(home.ownerPartnerId)} label={bi(lang, 'Named owner engaged', 'تم التواصل مع مالك محدد')} />
                  <GateRow done={Boolean(assessment && assessment.result !== 'scheduled')} label={bi(lang, 'Independent assessment complete', 'اكتمل التقييم المستقل')} />
                  <GateRow done={decision?.decision === 'go'} label={bi(lang, 'Owner go decision', 'قرار المالك بالاستمرار')} />
                  <GateRow done={Boolean(home.nightlyFloorEgp && home.payoutReady)} label={bi(lang, 'Floor and payout ready', 'الحد الأدنى والتحويل جاهزان')} />
                  <GateRow done={Boolean(home.operatorPartnerId)} label={bi(lang, 'Named operator assigned', 'تم تعيين مشغل محدد')} />
                  <GateRow done={home.activationChecklistComplete} label={bi(lang, 'Activation complete', 'اكتمل التفعيل')} />
                </div>
                {!home.publiclyVisible && <div className="mt-5 flex items-center gap-2 rounded-xl bg-ivory-100 p-3 text-[10px] font-semibold text-ink-600"><LockKeyhole size={14} />{bi(lang, 'Not a public booking claim', 'ليس ادعاء حجز عاماً')}</div>}
                {mode === 'live' && <SupplyActions home={home} assessment={assessment} decision={decision} dataset={dataset} currentPartner={auth.partner} lang={lang} refresh={refreshLiveDataset} />}
              </article>;
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function SupplyActions({ home, assessment, decision, dataset, currentPartner, lang, refresh }: { home: Property; assessment?: Assessment; decision?: OwnerDecision; dataset: OperatingDataset; currentPartner: Partner | null; lang: 'en' | 'ar'; refresh: () => Promise<void> }) {
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [ownerId, setOwnerId] = React.useState('');
  const [consentReference, setConsentReference] = React.useState('');
  const [assessorId, setAssessorId] = React.useState('');
  const [scheduledFor, setScheduledFor] = React.useState(tomorrow());
  const [operatorId, setOperatorId] = React.useState('');
  const [authorityId, setAuthorityId] = React.useState('');
  const [trust, setTrust] = React.useState<Record<string, AssessmentFindingInput>>(() => emptyFindings(trustKeys));
  const [shield, setShield] = React.useState<Record<string, AssessmentFindingInput>>(() => emptyFindings(shieldKeys));
  const [moments, setMoments] = React.useState<Record<string, { selected: boolean; evidenceReference: string }>>(() => Object.fromEntries(momentKeys.map((key) => [key, { selected: false, evidenceReference: '' }])));
  const [recommendation, setRecommendation] = React.useState('');
  const [recommendationAr, setRecommendationAr] = React.useState('');
  const [ownerDecision, setOwnerDecision] = React.useState<OwnerDecision['decision']>('go');
  const [floor, setFloor] = React.useState('');
  const [payoutReady, setPayoutReady] = React.useState(false);
  const [communityRequired, setCommunityRequired] = React.useState(false);
  const [ownerNote, setOwnerNote] = React.useState('');
  const [ownerNoteAr, setOwnerNoteAr] = React.useState('');
  const [activation, setActivation] = React.useState({ calendarAuthority: 'little_hut' as 'little_hut' | 'external', bookingMode: 'request' as 'request' | 'instant', maxGuests: '4', bedroomCount: '2', heroImage: '', galleryImages: '', checklist: false });

  const owners = dataset.partners.filter((partner) => partner.role === 'owner' && partner.status === 'active');
  const assessors = dataset.partners.filter((partner) => partner.role === 'assessor' && partner.status === 'active');
  const operators = dataset.partners.filter((partner) => partner.role === 'operator' && partner.status === 'active');
  const authorities = dataset.partners.filter((partner) => partner.role === 'community_authority' && partner.status === 'active');

  const run = async (fn: () => Promise<unknown>, message: string) => {
    setBusy(true); setError(''); setSuccess('');
    try { await fn(); await refresh(); setSuccess(message); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'operation_failed'); }
    finally { setBusy(false); }
  };

  const isAdmin = Boolean(currentPartner?.platformAdmin);
  const isAssignedAssessor = currentPartner?.role === 'assessor' && home.assessorPartnerId === currentPartner.id;
  const isAssignedOwner = currentPartner?.role === 'owner' && home.ownerPartnerId === currentPartner.id;
  const isAssignedOperator = currentPartner?.role === 'operator' && home.operatorPartnerId === currentPartner.id;
  const reassessmentAvailable = home.supplyStage === 'paused' && assessment && ['failed', 'conditions'].includes(assessment.result) && !decision;

  if (!isAdmin && !isAssignedAssessor && !isAssignedOwner && !isAssignedOperator) return null;

  return <div className="mt-6 space-y-4 border-t border-clay-200 pt-5">
    {error && <p className="rounded-xl bg-red-50 p-3 text-xs text-red-700">{error}</p>}
    {success && <p className="rounded-xl bg-sage-50 p-3 text-xs text-sage-900">{success}</p>}

    {isAdmin && home.supplyStage === 'sourced' && <ActionPanel title={bi(lang, 'Coordinate owner engagement', 'تنسيق التواصل مع المالك')}>
      <select className="field-input" value={ownerId} onChange={(event) => setOwnerId(event.target.value)}><option value="">{bi(lang, 'Select active Owner', 'اختر مالكاً نشطاً')}</option>{owners.map((partner) => <option key={partner.id} value={partner.id}>{partner.name}</option>)}</select>
      <input className="field-input" value={consentReference} onChange={(event) => setConsentReference(event.target.value)} placeholder={bi(lang, 'Owner consent evidence reference', 'مرجع دليل موافقة المالك')} />
      <button disabled={busy || !ownerId || !consentReference.trim()} onClick={() => void run(() => assignLiveOwner(home.id, ownerId, consentReference), bi(lang, 'Owner engagement recorded.', 'تم تسجيل التواصل مع المالك.'))} className="button-primary">{bi(lang, 'Record owner engagement', 'تسجيل التواصل')}</button>
    </ActionPanel>}

    {isAdmin && (home.supplyStage === 'owner_engaged' || reassessmentAvailable) && <ActionPanel title={reassessmentAvailable ? bi(lang, 'Schedule independent reassessment', 'جدولة إعادة تقييم مستقلة') : bi(lang, 'Schedule independent assessment', 'جدولة تقييم مستقل')}>
      <select className="field-input" value={assessorId} onChange={(event) => setAssessorId(event.target.value)}><option value="">{bi(lang, 'Select active Assessor', 'اختر مقيّماً نشطاً')}</option>{assessors.map((partner) => <option key={partner.id} value={partner.id}>{partner.name}</option>)}</select>
      <input type="date" className="field-input" value={scheduledFor} onChange={(event) => setScheduledFor(event.target.value)} />
      <button disabled={busy || !assessorId || !scheduledFor} onClick={() => void run(() => scheduleLiveAssessment(home.id, assessorId, scheduledFor), bi(lang, 'Assessment scheduled.', 'تمت جدولة التقييم.'))} className="button-primary">{bi(lang, 'Schedule assessment', 'جدولة التقييم')}</button>
    </ActionPanel>}

    {isAdmin && !home.operatorPartnerId && !['sourced', 'declined', 'live'].includes(home.supplyStage) && <ActionPanel title={bi(lang, 'Assign booking operator', 'تعيين مشغل الحجوزات')}>
      <select className="field-input" value={operatorId} onChange={(event) => setOperatorId(event.target.value)}><option value="">{bi(lang, 'Select active Operator', 'اختر مشغلاً نشطاً')}</option>{operators.map((partner) => <option key={partner.id} value={partner.id}>{partner.name}</option>)}</select>
      <button disabled={busy || !operatorId} onClick={() => void run(() => assignLiveOperator(home.id, operatorId), bi(lang, 'Operator assigned.', 'تم تعيين المشغل.'))} className="button-secondary">{bi(lang, 'Assign operator', 'تعيين المشغل')}</button>
    </ActionPanel>}

    {isAdmin && !home.communityAuthorityPartnerId && !['sourced', 'declined', 'live'].includes(home.supplyStage) && authorities.length > 0 && <ActionPanel title={bi(lang, 'Optional community authority', 'جهة موافقة المجتمع اختيارية')}>
      <select className="field-input" value={authorityId} onChange={(event) => setAuthorityId(event.target.value)}><option value="">{bi(lang, 'Select Community Authority', 'اختر جهة الموافقة')}</option>{authorities.map((partner) => <option key={partner.id} value={partner.id}>{partner.name}</option>)}</select>
      <button disabled={busy || !authorityId} onClick={() => void run(() => assignLiveCommunityAuthority(home.id, authorityId), bi(lang, 'Community authority assigned.', 'تم تعيين جهة الموافقة.'))} className="button-secondary">{bi(lang, 'Assign authority', 'تعيين الجهة')}</button>
    </ActionPanel>}

    {isAssignedAssessor && home.supplyStage === 'assessment_scheduled' && <ActionPanel title={bi(lang, 'Submit independent physical assessment', 'تقديم التقييم الميداني المستقل')}>
      <p className="text-[10px] leading-5 text-ink-500">{bi(lang, 'Every TRUST/SHIELD finding requires an evidence reference. The server derives Pass/Conditions/Fail; you do not choose the result.', 'كل نتيجة في TRUST/SHIELD تتطلب مرجع دليل. الخادم يستنتج ناجح/شروط/فشل؛ لا تختار النتيجة بنفسك.')}</p>
      <GateEditor title="TRUST" keys={trustKeys} values={trust} onChange={setTrust} lang={lang} />
      <GateEditor title="SHIELD" keys={shieldKeys} values={shield} onChange={setShield} lang={lang} />
      <div className="rounded-xl border border-clay-200 p-4"><strong className="text-xs text-ink-900">{bi(lang, 'Proven Moments', 'اللحظات الموثقة')}</strong><div className="mt-3 space-y-2">{momentKeys.map((key) => <div key={key} className="grid gap-2 sm:grid-cols-[auto_1fr]"><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={moments[key].selected} onChange={(event) => setMoments((current) => ({ ...current, [key]: { ...current[key], selected: event.target.checked } }))} />{label(momentLabels, key, lang)}</label>{moments[key].selected && <input className="field-input" value={moments[key].evidenceReference} onChange={(event) => setMoments((current) => ({ ...current, [key]: { ...current[key], evidenceReference: event.target.value } }))} placeholder={bi(lang, 'Evidence reference', 'مرجع الدليل')} />}</div>)}</div></div>
      <textarea className="field-input min-h-24" value={recommendation} onChange={(event) => setRecommendation(event.target.value)} placeholder={bi(lang, 'Assessment recommendation', 'توصية التقييم')} />
      <textarea className="field-input min-h-20" value={recommendationAr} onChange={(event) => setRecommendationAr(event.target.value)} placeholder={bi(lang, 'Arabic recommendation (optional)', 'التوصية بالعربية (اختياري)')} />
      <button disabled={busy || !recommendation.trim()} onClick={() => void run(() => submitLiveAssessment(home.id, { independenceConfirmed: true, trustGates: trust, shieldGates: shield, provenMoments: momentKeys.filter((key) => moments[key].selected).map((key) => ({ key, evidenceReference: moments[key].evidenceReference })), recommendation, recommendationAr }), bi(lang, 'Independent assessment recorded.', 'تم تسجيل التقييم المستقل.'))} className="button-primary"><ShieldCheck size={14} />{bi(lang, 'Submit assessment evidence', 'تقديم أدلة التقييم')}</button>
    </ActionPanel>}

    {isAssignedOwner && home.supplyStage === 'decision_pending' && !decision && <ActionPanel title={bi(lang, 'Owner reserved decision', 'قرار محفوظ للمالك')}>
      <select className="field-input" value={ownerDecision} onChange={(event) => setOwnerDecision(event.target.value as OwnerDecision['decision'])}><option value="go">{bi(lang, 'Go', 'استمرار')}</option><option value="defer">{bi(lang, 'Defer', 'تأجيل')}</option><option value="decline">{bi(lang, 'Decline', 'عدم الاستمرار')}</option></select>
      {ownerDecision === 'go' && <><input type="number" min={1} className="field-input" value={floor} onChange={(event) => setFloor(event.target.value)} placeholder={bi(lang, 'Minimum nightly accommodation EGP', 'الحد الأدنى الليلي للإقامة بالجنيه')} /><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={payoutReady} onChange={(event) => setPayoutReady(event.target.checked)} />{bi(lang, 'Payout destination is ready', 'وجهة التحويل جاهزة')}</label><label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={communityRequired} onChange={(event) => setCommunityRequired(event.target.checked)} />{bi(lang, 'Community approval required for guests', 'موافقة المجتمع مطلوبة للضيوف')}</label>{communityRequired && !home.communityAuthorityPartnerId && <p className="text-[10px] text-amber-800">{bi(lang, 'A platform admin must assign the named community authority before Go can be recorded.', 'يجب أن يعيّن مسؤول المنصة جهة الموافقة المحددة قبل تسجيل الاستمرار.')}</p>}</>}
      <textarea className="field-input min-h-20" value={ownerNote} onChange={(event) => setOwnerNote(event.target.value)} placeholder={bi(lang, 'Owner note (optional)', 'ملاحظة المالك (اختياري)')} />
      <textarea className="field-input min-h-20" value={ownerNoteAr} onChange={(event) => setOwnerNoteAr(event.target.value)} placeholder={bi(lang, 'Arabic note (optional)', 'الملاحظة بالعربية (اختياري)')} />
      <button disabled={busy || (ownerDecision === 'go' && (!floor || !payoutReady || (communityRequired && !home.communityAuthorityPartnerId)))} onClick={() => void run(() => submitLiveOwnerDecision(home.id, { decision: ownerDecision, nightlyFloorEgp: ownerDecision === 'go' ? Number(floor) : undefined, payoutReady: ownerDecision === 'go' ? payoutReady : undefined, communityApprovalRequired: ownerDecision === 'go' ? communityRequired : undefined, note: ownerNote, noteAr: ownerNoteAr }), bi(lang, 'Owner decision recorded.', 'تم تسجيل قرار المالك.'))} className="button-primary">{bi(lang, 'Record owner decision', 'تسجيل قرار المالك')}</button>
    </ActionPanel>}

    {isAssignedOperator && home.supplyStage === 'activation_ready' && <ActionPanel title={bi(lang, 'Complete activation and request system seal', 'إكمال التفعيل وطلب ختم النظام')}>
      <div className="grid gap-2 sm:grid-cols-2"><select className="field-input" value={activation.calendarAuthority} onChange={(event) => setActivation({ ...activation, calendarAuthority: event.target.value as 'little_hut' | 'external' })}><option value="little_hut">{bi(lang, 'Little Hut calendar authority', 'ليتل هت مسؤولة عن التقويم')}</option><option value="external">{bi(lang, 'External calendar authority', 'جهة خارجية مسؤولة عن التقويم')}</option></select><select className="field-input" value={activation.bookingMode} onChange={(event) => setActivation({ ...activation, bookingMode: event.target.value as 'request' | 'instant' })}><option value="request">{bi(lang, 'Request mode', 'وضع الطلب')}</option><option value="instant">{bi(lang, 'Instant mode', 'وضع فوري')}</option></select><input type="number" min={1} max={20} className="field-input" value={activation.maxGuests} onChange={(event) => setActivation({ ...activation, maxGuests: event.target.value })} placeholder={bi(lang, 'Max guests', 'الحد الأقصى للضيوف')} /><input type="number" min={0} max={20} className="field-input" value={activation.bedroomCount} onChange={(event) => setActivation({ ...activation, bedroomCount: event.target.value })} placeholder={bi(lang, 'Bedrooms', 'غرف النوم')} /></div>
      <input type="url" className="field-input" value={activation.heroImage} onChange={(event) => setActivation({ ...activation, heroImage: event.target.value })} placeholder="https://…" />
      <textarea className="field-input min-h-20" value={activation.galleryImages} onChange={(event) => setActivation({ ...activation, galleryImages: event.target.value })} placeholder={bi(lang, 'Gallery HTTPS URLs — one per line (optional)', 'روابط صور HTTPS — رابط بكل سطر (اختياري)')} />
      <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={activation.checklist} onChange={(event) => setActivation({ ...activation, checklist: event.target.checked })} />{bi(lang, 'Activation checklist complete', 'اكتملت قائمة التفعيل')}</label>
      {(activation.calendarAuthority === 'external' || home.communityApprovalRequired) && activation.bookingMode === 'instant' && <p className="text-[10px] text-amber-800">{bi(lang, 'The server will force Request mode because instant confirmation is not permitted.', 'سيحوّل الخادم الوضع إلى طلب لأن التأكيد الفوري غير مسموح.')}</p>}
      <button disabled={busy || !activation.checklist || !activation.heroImage.trim()} onClick={() => void run(() => activateServerLiveProperty(home.id, { activationChecklistComplete: true, calendarAuthority: activation.calendarAuthority, bookingMode: activation.bookingMode, maxGuests: Number(activation.maxGuests), bedroomCount: Number(activation.bedroomCount), heroImage: activation.heroImage, galleryImages: activation.galleryImages.split('\n').map((item) => item.trim()).filter(Boolean) }), bi(lang, 'All gates passed. The system issued the Live seal.', 'اكتملت كل البوابات وأصدر النظام الختم الفعلي.'))} className="button-primary"><CheckCircle2 size={14} />{bi(lang, 'Complete activation', 'إكمال التفعيل')}</button>
    </ActionPanel>}
  </div>;
}

function GateEditor({ title, keys, values, onChange, lang }: { title: string; keys: readonly string[]; values: Record<string, AssessmentFindingInput>; onChange: React.Dispatch<React.SetStateAction<Record<string, AssessmentFindingInput>>>; lang: 'en' | 'ar' }) {
  return <div className="rounded-xl border border-clay-200 p-4"><strong className="text-xs text-ink-900">{title}</strong><div className="mt-3 space-y-2">{keys.map((key) => <div key={key} className="grid gap-2 sm:grid-cols-[130px_110px_1fr] sm:items-center"><span className="text-xs text-ink-600">{bi(lang, gateLabels[key][0], gateLabels[key][1])}</span><select className="field-input" value={values[key].status} onChange={(event) => onChange((current) => ({ ...current, [key]: { ...current[key], status: event.target.value as 'passed' | 'failed' } }))}><option value="passed">{bi(lang, 'Pass', 'ناجح')}</option><option value="failed">{bi(lang, 'Fail', 'فشل')}</option></select><input className="field-input" value={values[key].evidenceReference} onChange={(event) => onChange((current) => ({ ...current, [key]: { ...current[key], evidenceReference: event.target.value } }))} placeholder={bi(lang, 'Evidence reference', 'مرجع الدليل')} /></div>)}</div></div>;
}

function ActionPanel({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="space-y-3 rounded-xl border border-clay-200 bg-ivory-50 p-4"><div className="flex items-center gap-2 text-xs font-bold text-ink-900"><CircleDashed size={14} className="text-terracotta-700" />{title}</div>{children}</div>;
}

function GateRow({ done, label }: { done: boolean; label: string }) {
  return <div className="flex items-center gap-2">{done ? <CheckCircle2 size={15} className="text-sage-700" /> : <CircleDashed size={15} className="text-clay-400" />}<span className={done ? 'text-ink-800' : 'text-ink-400'}>{label}</span></div>;
}
