import React from 'react';
import { ArrowRight, CheckCircle2, CircleDashed, LockKeyhole, MapPin, PauseCircle, XCircle } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi, label, supplyLabels } from '../lib/display';
import { DemoRecordMark, EmptyState, PageHeader, StatusPill } from '../components/ui';
import type { SupplyStage } from '../types';

const stages: SupplyStage[] = ['sourced', 'owner_engaged', 'assessment_scheduled', 'decision_pending', 'activation_ready', 'live', 'paused', 'declined'];

export function JoiningView({ navigate }: { navigate: (path: string) => void }) {
  const { lang, dataset } = useOperating();
  const activeSupply = dataset.properties.filter((item) => !['live', 'paused', 'declined'].includes(item.supplyStage));

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
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {dataset.properties.map((home) => {
              const assessment = dataset.assessments.find((item) => item.propertyId === home.id);
              const decision = dataset.ownerDecisions.find((item) => item.propertyId === home.id);
              return <article key={home.id} className="rounded-[1.5rem] border border-clay-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4"><StatusPill tone={home.supplyStage === 'live' ? 'good' : home.supplyStage === 'declined' ? 'bad' : home.supplyStage === 'paused' ? 'warn' : 'neutral'}>{label(supplyLabels, home.supplyStage, lang)}</StatusPill><DemoRecordMark /></div>
                <h2 className="mt-5 font-serif text-2xl text-ink-950">{lang === 'ar' ? home.nameAr : home.name}</h2>
                <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-500"><MapPin size={13} className="text-terracotta-700" />{lang === 'ar' ? home.locationAr : home.location}</p>
                <p className="mt-4 text-xs leading-6 text-ink-600">{lang === 'ar' ? home.summaryAr : home.summary}</p>
                <div className="mt-6 space-y-3 border-t border-clay-200 pt-5 text-xs">
                  <GateRow done={Boolean(home.ownerPartnerId)} label={bi(lang, 'Named owner engaged', 'تم التواصل مع مالك محدد')} />
                  <GateRow done={Boolean(assessment && assessment.result !== 'scheduled')} label={bi(lang, 'Independent assessment complete', 'اكتمل التقييم المستقل')} />
                  <GateRow done={decision?.decision === 'go'} label={bi(lang, 'Owner go decision', 'قرار المالك بالاستمرار')} />
                  <GateRow done={Boolean(home.nightlyFloorEgp && home.payoutReady)} label={bi(lang, 'Floor and payout ready', 'الحد الأدنى والتحويل جاهزان')} />
                  <GateRow done={home.activationChecklistComplete} label={bi(lang, 'Activation complete', 'اكتمل التفعيل')} />
                </div>
                {!home.publiclyVisible && <div className="mt-5 flex items-center gap-2 rounded-xl bg-ivory-100 p-3 text-[10px] font-semibold text-ink-600"><LockKeyhole size={14} />{bi(lang, 'Not a public booking claim', 'ليس ادعاء حجز عاماً')}</div>}
              </article>;
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function GateRow({ done, label }: { done: boolean; label: string }) {
  return <div className="flex items-center gap-2">{done ? <CheckCircle2 size={15} className="text-sage-700" /> : <CircleDashed size={15} className="text-clay-400" />}<span className={done ? 'text-ink-800' : 'text-ink-400'}>{label}</span></div>;
}
