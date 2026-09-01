import React from 'react';
import { BadgeCheck, CalendarClock, CheckCircle2, CircleDashed, FileCheck2, ShieldCheck, UserRoundCheck, XCircle } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi, dateLabel, label, momentLabels } from '../lib/display';
import { DemoRecordMark, EmptyState, Metric, PageHeader, StatusPill } from '../components/ui';

export function AssessmentView() {
  const { lang, dataset, getPartnerName } = useOperating();
  const passed = dataset.assessments.filter((item) => item.result === 'passed').length;
  const scheduled = dataset.assessments.filter((item) => item.result === 'scheduled').length;

  return (
    <div>
      <PageHeader eyebrow="Independent assessment" eyebrowAr="التقييم المستقل" title="Evidence has its own authority." titleAr="للدليل سلطة مستقلة." description="The assessor proves or rejects Moments and owns TRUST/SHIELD findings. No owner, scout, or operator can edit this result or grant themselves a seal." descriptionAr="يثبت المقيّم اللحظات أو يرفضها ويمتلك نتائج بوابات الثقة والحماية. لا يحق للمالك أو الكشاف أو المشغل تعديل النتيجة أو منح ختم لأنفسهم." />
      <section className="page-shell py-10">
        <div className="grid gap-3 md:grid-cols-3"><Metric label="Independent assessors" labelAr="مقيّمون مستقلون" value={dataset.partners.filter((item) => item.role === 'assessor').length} /><Metric label="Passed assessments" labelAr="تقييمات ناجحة" value={passed} tone="terracotta" /><Metric label="Visits scheduled" labelAr="زيارات مجدولة" value={scheduled} tone="ink" /></div>
        {dataset.assessments.length === 0 ? <div className="mt-10"><EmptyState title="No Live assessments yet" titleAr="لا توجد تقييمات فعلية بعد" description="Assessment records appear only when a named independent assessor is assigned to a real property. No scores or proven Moments are prefilled." descriptionAr="لا تظهر سجلات التقييم إلا بعد إسناد عقار حقيقي إلى مقيّم مستقل محدد. لا يتم ملء أي درجات أو لحظات موثقة مسبقاً." /></div> : (
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            {dataset.assessments.map((assessment) => {
              const home = dataset.properties.find((item) => item.id === assessment.propertyId);
              const passedGates = [...assessment.trustGates, ...assessment.shieldGates].filter((gate) => gate.status === 'passed').length;
              const totalGates = assessment.trustGates.length + assessment.shieldGates.length;
              return <article key={assessment.id} className="rounded-[1.5rem] border border-clay-200 bg-white p-6">
                <div className="flex items-start justify-between gap-4"><div><StatusPill tone={assessment.result === 'passed' ? 'good' : assessment.result === 'scheduled' ? 'neutral' : 'warn'}>{assessment.result === 'passed' ? <BadgeCheck size={12} /> : assessment.result === 'scheduled' ? <CalendarClock size={12} /> : <XCircle size={12} />}{assessment.result === 'passed' ? bi(lang, 'Passed', 'ناجح') : assessment.result === 'scheduled' ? bi(lang, 'Scheduled', 'مجدول') : bi(lang, 'Conditions', 'شروط مانعة')}</StatusPill><h2 className="mt-4 font-serif text-3xl text-ink-950">{home ? (lang === 'ar' ? home.nameAr : home.name) : bi(lang, 'Unknown property', 'عقار غير معروف')}</h2></div><DemoRecordMark /></div>
                <div className="mt-5 flex items-center gap-3 rounded-xl bg-ivory-100 p-4"><UserRoundCheck size={20} className="text-terracotta-700" /><div><span className="block text-[9px] font-bold uppercase tracking-[.16em] text-ink-400">{bi(lang, 'Independent assessor', 'المقيّم المستقل')}</span><strong className="mt-1 block text-sm text-ink-900">{getPartnerName(assessment.assessorPartnerId)}</strong></div></div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-center"><div className="mini-fact"><ShieldCheck size={15} /><span>TRUST</span><strong>{assessment.trustGates.filter((gate) => gate.status === 'passed').length}/6</strong></div><div className="mini-fact"><FileCheck2 size={15} /><span>SHIELD</span><strong>{assessment.shieldGates.filter((gate) => gate.status === 'passed').length}/6</strong></div><div className="mini-fact"><CheckCircle2 size={15} /><span>{bi(lang, 'Evidence', 'الأدلة')}</span><strong>{assessment.evidenceCount}</strong></div></div>
                <div className="mt-5"><div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[.13em] text-ink-500"><span>{bi(lang, 'Gate completion', 'اكتمال البوابات')}</span><span>{passedGates}/{totalGates}</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-clay-100"><div className="h-full bg-terracotta-600" style={{ width: `${totalGates ? (passedGates / totalGates) * 100 : 0}%` }} /></div></div>
                <div className="mt-5 border-t border-clay-200 pt-5"><span className="text-[10px] font-bold uppercase tracking-[.14em] text-ink-400">{bi(lang, 'Proven Moments', 'اللحظات الموثقة')}</span><div className="mt-3 flex flex-wrap gap-2">{assessment.provenMomentKeys.length ? assessment.provenMomentKeys.map((moment) => <span key={moment}><StatusPill tone="good">{label(momentLabels, moment, lang)}</StatusPill></span>) : <span className="inline-flex items-center gap-1 text-xs text-ink-400"><CircleDashed size={14} />{bi(lang, 'None until site evidence', 'لا يوجد حتى توثيق الزيارة')}</span>}</div></div>
                <p className="mt-5 text-xs leading-6 text-ink-600">{lang === 'ar' ? assessment.recommendationAr : assessment.recommendation}</p>
                <p className="mt-3 text-[9px] font-bold uppercase tracking-[.13em] text-ink-400">{assessment.completedAt ? `${bi(lang, 'Completed', 'اكتمل')}: ${dateLabel(assessment.completedAt, lang)}` : assessment.scheduledFor ? `${bi(lang, 'Visit', 'الزيارة')}: ${dateLabel(assessment.scheduledFor, lang)}` : ''}</p>
              </article>;
            })}
          </div>
        )}
      </section>
    </div>
  );
}
