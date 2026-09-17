import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, FileSpreadsheet, Gauge, Settings2, ShieldCheck, Upload, Users } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi } from '../lib/display';
import {
  fetchOperatorWorkspaceBundle,
  importOperatorPortfolio,
  previewOperatorPortfolio,
  saveOperatorWorkspace,
} from '../lib/operator-api';
import {
  parsePortfolioCsv,
  type OperatorPortfolioCandidate,
  type OperatorWorkspace,
  type OperatorWorkspaceInput,
  type PortfolioPreview,
  type PortfolioSourceRow,
} from '../lib/operator-workspace';

const blankWorkspace = (): OperatorWorkspaceInput => ({
  organisationName: '',
  country: '',
  currency: '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
  operatingModel: 'fully_managed',
  bookingModel: 'request',
  calendarModel: 'external',
  assignmentMode: 'manual',
  housekeepingModel: 'mixed',
  maintenanceModel: 'mixed',
  pricingMandate: 'owner_approval_required',
  communityApprovalDefault: false,
  notificationChannels: ['email'],
  targets: {},
});

const selectClass = 'w-full rounded-xl border border-[#E2D4C8] bg-white px-3 py-3 text-sm text-[#2A201C] outline-none focus:border-[#B84E36]';
const inputClass = selectClass;

export function OperatorSetupView({ navigate }: { navigate: (path: string) => void }) {
  const { lang, mode, auth } = useOperating();
  const [workspace, setWorkspace] = useState<OperatorWorkspace | null>(null);
  const [form, setForm] = useState<OperatorWorkspaceInput>(blankWorkspace);
  const [candidates, setCandidates] = useState<OperatorPortfolioCandidate[]>([]);
  const [rows, setRows] = useState<PortfolioSourceRow[]>([]);
  const [sourceName, setSourceName] = useState('');
  const [preview, setPreview] = useState<PortfolioPreview | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const canOperate = mode === 'live' && auth.authenticated && auth.partner?.role === 'operator';

  useEffect(() => {
    if (!canOperate) return;
    let active = true;
    setBusy(true);
    void fetchOperatorWorkspaceBundle()
      .then((bundle) => {
        if (!active) return;
        setWorkspace(bundle.workspace);
        setCandidates(bundle.candidates);
        if (bundle.workspace) {
          const { id: _id, dataMode: _mode, synthetic: _synthetic, operatorPartnerId: _operator, version: _version, createdAt: _created, updatedAt: _updated, ...editable } = bundle.workspace;
          setForm(editable);
          setSaved(true);
        }
      })
      .catch((nextError) => { if (active) setError(nextError instanceof Error ? nextError.message : 'operator_workspace_unavailable'); })
      .finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [canOperate]);

  const completion = useMemo(() => {
    const configured = Boolean(workspace);
    const imported = candidates.length > 0;
    return { configured, imported, percent: configured ? (imported ? 100 : 55) : 15 };
  }, [workspace, candidates.length]);

  const update = <K extends keyof OperatorWorkspaceInput>(key: K, value: OperatorWorkspaceInput[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setSaved(false);
  };

  const save = async () => {
    setBusy(true); setError('');
    try {
      const next = await saveOperatorWorkspace(form);
      setWorkspace(next);
      setSaved(true);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'operator_workspace_save_failed');
    } finally { setBusy(false); }
  };

  const readFile = async (file: File | undefined) => {
    if (!file) return;
    setError(''); setPreview(null);
    try {
      const text = await file.text();
      const parsed = parsePortfolioCsv(text);
      setRows(parsed);
      setSourceName(file.name);
      if (!workspace) throw new Error('Save your operating setup before previewing the portfolio.');
      setBusy(true);
      setPreview(await previewOperatorPortfolio(parsed));
    } catch (nextError) {
      setRows([]);
      setError(nextError instanceof Error ? nextError.message : 'portfolio_file_invalid');
    } finally { setBusy(false); }
  };

  const commitImport = async () => {
    if (!rows.length) return;
    setBusy(true); setError('');
    try {
      const result = await importOperatorPortfolio(rows, sourceName || 'portfolio.csv');
      setPreview(result.preview);
      const bundle = await fetchOperatorWorkspaceBundle();
      setCandidates(bundle.candidates);
      setRows([]);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : 'portfolio_import_failed');
    } finally { setBusy(false); }
  };

  if (!canOperate) {
    return (
      <div className="page-shell py-16">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-[#E2D4C8] bg-white p-8 text-center shadow-sm">
          <ShieldCheck className="mx-auto text-[#B84E36]" size={34} />
          <h1 className="mt-5 font-serif text-4xl">{bi(lang, 'Operator setup is a Live workspace.', 'إعداد المشغّل مساحة تشغيل فعلية.')}</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#6D5A50]">{bi(lang, 'Switch to Live and sign in with an Operator account. Portfolio data never falls back to browser storage or Demo.', 'حوّل إلى الوضع الفعلي وسجّل الدخول بحساب مشغّل. بيانات المحفظة لا تُحفظ في المتصفح ولا تختلط بالعرض التجريبي.')}</p>
          <button onClick={() => navigate('/live-access')} className="button-primary mt-7">{bi(lang, 'Open Live access', 'افتح الدخول الفعلي')}<ArrowRight size={15} /></button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF5EE] text-[#2A201C]">
      <section className="border-b border-[#E8D9CC] bg-[radial-gradient(circle_at_top_right,rgba(184,78,54,.12),transparent_32%),linear-gradient(180deg,#FFFDFC,#F8EFE7)]">
        <div className="page-shell py-12 md:py-16">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-[10px] font-black uppercase tracking-[.24em] text-[#B84E36]">{bi(lang, 'Home Moments Operator OS', 'نظام تشغيل Home Moments')}</p>
              <h1 className="mt-3 font-serif text-5xl leading-[.98] tracking-[-.04em] md:text-6xl">{bi(lang, 'Configure once. Upload the portfolio. Work the right next action.', 'اضبط التشغيل مرة واحدة. ارفع المحفظة. ثم نفّذ الخطوة الصحيحة التالية.')}</h1>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-[#6D5A50]">{bi(lang, 'The workflow adapts to how your company works, while evidence, owner authority, independent assessment, booking truth and the Little Hut seal remain non-negotiable.', 'يتكيف سير العمل مع طريقة شركتك، بينما يظل الدليل وصلاحية المالك والتقييم المستقل وحقيقة الحجز وختم ليتل هت قواعد لا يمكن تجاوزها.')}</p>
            </div>
            <div className="min-w-[260px] rounded-2xl border border-[#E3D1C2] bg-white p-5">
              <div className="flex items-center justify-between text-xs"><span className="font-bold">{bi(lang, 'Setup readiness', 'جاهزية الإعداد')}</span><span>{completion.percent}%</span></div>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#F1E5DB]"><div className="h-full bg-[#B84E36] transition-all" style={{ width: `${completion.percent}%` }} /></div>
              <p className="mt-3 text-[11px] leading-5 text-[#7B685E]">{completion.imported ? bi(lang, 'Portfolio intake is active. Open the Operator desk to work the factory.', 'إدخال المحفظة فعّال. افتح مكتب المشغّل للعمل على أولويات المصنع.') : bi(lang, 'Next: save the operating model, then upload the real portfolio.', 'التالي: احفظ نموذج التشغيل ثم ارفع المحفظة الفعلية.')}</p>
            </div>
          </div>
        </div>
      </section>

      <main className="page-shell space-y-8 py-10 md:py-14">
        {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</div> : null}

        <section className="rounded-[2rem] border border-[#E3D3C6] bg-white p-6 shadow-[0_18px_55px_rgba(77,50,37,.06)] md:p-8">
          <div className="flex items-start gap-4"><div className="rounded-full bg-[#FAF0EB] p-3 text-[#B84E36]"><Settings2 size={20} /></div><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#B84E36]">01 · {bi(lang, 'Operating model', 'نموذج التشغيل')}</p><h2 className="mt-1 font-serif text-3xl">{bi(lang, 'Tell Home Moments how work gets done.', 'عرّف Home Moments كيف يتم العمل.')}</h2><p className="mt-2 text-xs leading-6 text-[#78665C]">{bi(lang, 'These are workflow settings, not permission shortcuts. Role authority is still enforced by the server.', 'هذه إعدادات لسير العمل وليست اختصاراً للصلاحيات. صلاحيات الأدوار يفرضها الخادم دائماً.')}</p></div></div>

          <div className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <label className="text-xs font-bold">{bi(lang, 'Operator company', 'شركة التشغيل')}<input className={`${inputClass} mt-2`} value={form.organisationName} onChange={(e) => update('organisationName', e.target.value)} placeholder="Company / trading name" /></label>
            <label className="text-xs font-bold">{bi(lang, 'Country', 'الدولة')}<input className={`${inputClass} mt-2`} value={form.country} onChange={(e) => update('country', e.target.value)} placeholder="Egypt" /></label>
            <label className="text-xs font-bold">{bi(lang, 'Currency', 'العملة')}<input className={`${inputClass} mt-2`} value={form.currency} onChange={(e) => update('currency', e.target.value.toUpperCase())} placeholder="EGP" maxLength={3} /></label>
            <label className="text-xs font-bold">{bi(lang, 'Timezone', 'المنطقة الزمنية')}<input className={`${inputClass} mt-2`} value={form.timezone} onChange={(e) => update('timezone', e.target.value)} /></label>
            <label className="text-xs font-bold">{bi(lang, 'Operating model', 'نموذج الإدارة')}<select className={`${selectClass} mt-2`} value={form.operatingModel} onChange={(e) => update('operatingModel', e.target.value as OperatorWorkspaceInput['operatingModel'])}><option value="fully_managed">Fully managed</option><option value="supported">Supported</option><option value="owner_operated">Owner operated</option></select></label>
            <label className="text-xs font-bold">{bi(lang, 'Booking model', 'نموذج الحجز')}<select className={`${selectClass} mt-2`} value={form.bookingModel} onChange={(e) => update('bookingModel', e.target.value as OperatorWorkspaceInput['bookingModel'])}><option value="request">Request</option><option value="instant">Instant when gates allow</option><option value="both">Both</option></select></label>
            <label className="text-xs font-bold">{bi(lang, 'Calendar authority', 'سلطة التقويم')}<select className={`${selectClass} mt-2`} value={form.calendarModel} onChange={(e) => update('calendarModel', e.target.value as OperatorWorkspaceInput['calendarModel'])}><option value="little_hut">Little Hut held</option><option value="external">External PMS/channel</option><option value="mixed">Mixed by property</option></select></label>
            <label className="text-xs font-bold">{bi(lang, 'Work assignment', 'توزيع العمل')}<select className={`${selectClass} mt-2`} value={form.assignmentMode} onChange={(e) => update('assignmentMode', e.target.value as OperatorWorkspaceInput['assignmentMode'])}><option value="manual">Manual</option><option value="fixed_property_owner">Fixed property owner</option><option value="region_pool">Region pool</option><option value="skill_based">Skill based</option><option value="shift_based">Shift based</option><option value="round_robin">Round robin</option></select></label>
            <label className="text-xs font-bold">{bi(lang, 'Pricing mandate', 'تفويض التسعير')}<select className={`${selectClass} mt-2`} value={form.pricingMandate} onChange={(e) => update('pricingMandate', e.target.value as OperatorWorkspaceInput['pricingMandate'])}><option value="owner_approval_required">Owner approval required</option><option value="owner_floor_only">Owner floor only</option><option value="operator_within_mandate">Operator within mandate</option></select></label>
            <label className="text-xs font-bold">{bi(lang, 'Housekeeping', 'التجهيز والنظافة')}<select className={`${selectClass} mt-2`} value={form.housekeepingModel} onChange={(e) => update('housekeepingModel', e.target.value as OperatorWorkspaceInput['housekeepingModel'])}><option value="in_house">In-house</option><option value="vendor">Vendor</option><option value="mixed">Mixed</option></select></label>
            <label className="text-xs font-bold">{bi(lang, 'Maintenance', 'الصيانة')}<select className={`${selectClass} mt-2`} value={form.maintenanceModel} onChange={(e) => update('maintenanceModel', e.target.value as OperatorWorkspaceInput['maintenanceModel'])}><option value="in_house">In-house</option><option value="vendor">Vendor</option><option value="mixed">Mixed</option></select></label>
            <label className="flex items-center gap-3 rounded-xl border border-[#E8DCD2] px-4 py-3 text-xs font-bold"><input type="checkbox" checked={form.communityApprovalDefault} onChange={(e) => update('communityApprovalDefault', e.target.checked)} />{bi(lang, 'External/community approval commonly applies', 'عادةً يلزم اعتماد خارجي أو من إدارة المجتمع')}</label>
          </div>

          <div className="mt-7 border-t border-[#EFE4DB] pt-6">
            <div className="flex items-center gap-3"><Gauge size={18} className="text-[#B84E36]" /><div><h3 className="font-serif text-xl">{bi(lang, 'Targets — optional, never invented', 'الأهداف — اختيارية ولا يتم اختلاقها')}</h3><p className="text-[11px] text-[#7B685E]">{bi(lang, 'Set only targets your operation actually owns. Blank stays blank.', 'ضع فقط الأهداف التي تعتمدها شركتك فعلياً. الحقول الفارغة تظل فارغة.')}</p></div></div>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <label className="text-xs font-bold">{bi(lang, 'Monthly secured booking value', 'قيمة الحجوزات المؤكدة شهرياً')}<input type="number" min="1" className={`${inputClass} mt-2`} value={form.targets?.monthlyGrossBookingValueEgp ?? ''} onChange={(e) => setForm((current) => ({ ...current, targets: { ...current.targets, monthlyGrossBookingValueEgp: e.target.value ? Number(e.target.value) : undefined } }))} /></label>
              <label className="text-xs font-bold">{bi(lang, 'Live homes target', 'هدف البيوت الفعلية')}<input type="number" min="1" className={`${inputClass} mt-2`} value={form.targets?.liveHomes ?? ''} onChange={(e) => setForm((current) => ({ ...current, targets: { ...current.targets, liveHomes: e.target.value ? Number(e.target.value) : undefined } }))} /></label>
              <label className="text-xs font-bold">{bi(lang, 'Enquiry response target (min)', 'هدف الرد على الاستفسار بالدقائق')}<input type="number" min="1" className={`${inputClass} mt-2`} value={form.targets?.enquiryResponseMinutes ?? ''} onChange={(e) => setForm((current) => ({ ...current, targets: { ...current.targets, enquiryResponseMinutes: e.target.value ? Number(e.target.value) : undefined } }))} /></label>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3"><button disabled={busy || saved} onClick={save} className="button-primary disabled:opacity-50">{saved ? <CheckCircle2 size={15} /> : <Settings2 size={15} />}{saved ? bi(lang, 'Operating model saved', 'تم حفظ نموذج التشغيل') : bi(lang, 'Save operating model', 'احفظ نموذج التشغيل')}</button>{workspace ? <span className="text-[11px] text-[#7B685E]">v{workspace.version} · {bi(lang, 'versioned and auditable', 'نسخة مؤرخة وقابلة للتدقيق')}</span> : null}</div>
        </section>

        <section className="rounded-[2rem] border border-[#E3D3C6] bg-white p-6 shadow-[0_18px_55px_rgba(77,50,37,.06)] md:p-8">
          <div className="flex items-start gap-4"><div className="rounded-full bg-[#FAF0EB] p-3 text-[#B84E36]"><FileSpreadsheet size={20} /></div><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-[#B84E36]">02 · {bi(lang, 'Portfolio intake', 'إدخال المحفظة')}</p><h2 className="mt-1 font-serif text-3xl">{bi(lang, 'Upload the truth you have. The system will show what is still missing.', 'ارفع المعلومات الموجودة لديك. وسيظهر النظام ما ينقص بوضوح.')}</h2><p className="mt-2 text-xs leading-6 text-[#78665C]">{bi(lang, 'CSV is accepted now. Imported fields are reported provenance only; duplicate homes are never overwritten and Moment claims are never auto-certified.', 'يتم قبول CSV الآن. كل البيانات المستوردة تظل بيانات مُبلّغاً عنها فقط؛ لا يتم استبدال بيت مكرر ولا اعتماد أي Moment تلقائياً.')}</p></div></div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[.8fr_1.2fr]">
            <label className={`flex min-h-[190px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center ${workspace ? 'border-[#D7B7A5] bg-[#FFF9F5]' : 'border-[#E7DDD5] bg-[#F7F4F1] opacity-60'}`}>
              <Upload size={28} className="text-[#B84E36]" />
              <strong className="mt-3 font-serif text-xl">{bi(lang, 'Choose portfolio CSV', 'اختر ملف CSV للمحفظة')}</strong>
              <span className="mt-2 max-w-sm text-[11px] leading-5 text-[#7B685E]">external_property_id, property_name, country, region, location_label, owner_reference</span>
              <input type="file" accept=".csv,text/csv" className="hidden" disabled={!workspace || busy} onChange={(e) => void readFile(e.target.files?.[0])} />
            </label>

            <div className="rounded-2xl border border-[#ECE0D7] bg-[#FFFDFC] p-5">
              <div className="flex items-center justify-between"><strong className="font-serif text-xl">{sourceName || bi(lang, 'Import preview', 'معاينة الاستيراد')}</strong>{preview ? <span className="text-[10px] font-black uppercase tracking-[.15em] text-[#B84E36]">{preview.totalRows} rows</span> : null}</div>
              {preview ? <><div className="mt-5 grid grid-cols-3 gap-3"><div className="rounded-xl bg-emerald-50 p-3"><strong className="text-xl text-emerald-800">{preview.acceptedRows}</strong><p className="mt-1 text-[10px] text-emerald-800">Ready</p></div><div className="rounded-xl bg-amber-50 p-3"><strong className="text-xl text-amber-800">{preview.reviewRows}</strong><p className="mt-1 text-[10px] text-amber-800">Review</p></div><div className="rounded-xl bg-red-50 p-3"><strong className="text-xl text-red-800">{preview.rejectedRows}</strong><p className="mt-1 text-[10px] text-red-800">Blocked</p></div></div><div className="mt-4 max-h-56 space-y-2 overflow-auto">{preview.rows.slice(0, 20).map((row) => <div key={row.rowNumber} className="rounded-lg border border-[#EEE3DA] bg-white px-3 py-2 text-[11px]"><div className="flex items-center justify-between gap-3"><strong>{row.propertyName || `Row ${row.rowNumber}`}</strong><span className={row.status === 'accepted' ? 'text-emerald-700' : row.status === 'needs_review' ? 'text-amber-700' : 'text-red-700'}>{row.status.replace('_', ' ')}</span></div>{row.issues[0] ? <p className="mt-1 text-red-700">{row.issues[0]}</p> : <p className="mt-1 text-[#79685F]">{row.nextAction}</p>}</div>)}</div><button disabled={busy || preview.acceptedRows === 0 || rows.length === 0} onClick={commitImport} className="button-primary mt-5 disabled:opacity-50">{bi(lang, 'Import safe candidates', 'استورد المرشحين الآمنين')}<ArrowRight size={15} /></button></> : <div className="mt-8 text-center text-xs leading-6 text-[#7B685E]">{workspace ? bi(lang, 'Choose a CSV to see accepted, review and blocked rows before anything is written.', 'اختر CSV لتشاهد الصفوف المقبولة والمراجعة والموقوفة قبل حفظ أي شيء.') : bi(lang, 'Save step 01 first.', 'احفظ الخطوة ٠١ أولاً.')}</div>}
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[#E3D3C6] bg-[#2A201C] p-6 text-white md:p-8">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"><div className="max-w-2xl"><div className="flex items-center gap-3 text-[#F0C77E]"><Users size={20} /><span className="text-[10px] font-black uppercase tracking-[.2em]">03 · {bi(lang, 'Factory ready', 'جاهزية المصنع')}</span></div><h2 className="mt-3 font-serif text-3xl">{bi(lang, 'Every imported home receives one legitimate next action.', 'كل بيت مستورد يحصل على خطوة تالية واحدة ومشروعة.')}</h2><p className="mt-3 text-xs leading-6 text-white/65">{bi(lang, 'Candidates go to sourcing/consent, then independent evidence, Owner mandate and activation. The operator cannot shortcut certification; the system removes ambiguity instead.', 'ينتقل المرشح إلى التوريد والموافقة ثم الدليل المستقل وتفويض المالك والتفعيل. المشغّل لا يستطيع اختصار الاعتماد؛ النظام يزيل الغموض بدلاً من ذلك.')}</p></div><div className="min-w-[260px] rounded-2xl border border-white/10 bg-white/5 p-5"><div className="flex items-center justify-between"><span className="text-xs text-white/70">{bi(lang, 'Portfolio candidates', 'مرشحو المحفظة')}</span><strong className="text-3xl">{candidates.length}</strong></div><div className="mt-4 text-[11px] text-white/60">{candidates.length ? candidates.slice(0, 3).map((candidate) => <div key={candidate.id} className="border-t border-white/10 py-2"><strong className="text-white">{candidate.propertyName}</strong><p>{candidate.nextAction}</p></div>) : <p>{bi(lang, 'Upload the first portfolio to start the supply factory.', 'ارفع أول محفظة لبدء مصنع التوريد.')}</p>}</div><button onClick={() => navigate('/operator')} className="mt-5 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.12em] text-[#F0C77E]">{bi(lang, 'Open operator factory', 'افتح مصنع التشغيل')}<ArrowRight size={14} /></button></div></div>
        </section>
      </main>
    </div>
  );
}
