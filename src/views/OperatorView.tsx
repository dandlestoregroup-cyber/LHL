import React from 'react';
import { AlertTriangle, ArrowRight, CalendarClock, CheckCircle2, CircleDollarSign, Clock3, CreditCard, ShieldCheck, UserRoundCheck } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi, dateLabel, enquiryLabels, label, money } from '../lib/display';
import { calendarEffect } from '../lib/lh-core';
import { DemoRecordMark, EmptyState, Metric, PageHeader, StatusPill } from '../components/ui';

const nextAction = (stage: string, requiresApproval: boolean, lang: 'en' | 'ar') => {
  const copy: Record<string, [string, string]> = {
    received: ['Qualify enquiry', 'تأهيل الطلب'], qualified: ['Check availability', 'فحص الإتاحة'], availability_checked: ['Issue in-floor quote', 'إصدار سعر داخل الحد'],
    quoted: ['Place 2-hour hold', 'حجز مؤقت لساعتين'], hold: ['Request payment', 'طلب الدفع'], payment_pending: ['Record payment', 'تسجيل الدفع'],
    payment_received: requiresApproval ? ['Submit for community approval', 'الإرسال لموافقة الكمبوند'] : ['Confirm stay', 'تأكيد الإقامة'], community_approved: ['Confirm stay', 'تأكيد الإقامة'], confirmed: ['Complete stay', 'إكمال الإقامة'],
  };
  const value = copy[stage];
  return value ? bi(lang, value[0], value[1]) : null;
};

export function OperatorView({ navigate }: { navigate: (path: string) => void }) {
  const { lang, mode, dataset, executeNextEnquiryAction, recordCommunityApproval, getPartnerName } = useOperating();
  const active = dataset.enquiries.filter((item) => !['completed', 'declined', 'expired', 'cancelled'].includes(item.stage));
  const holds = active.filter((item) => calendarEffect(item).blocksCalendar).length;
  const approvalQueue = active.filter((item) => item.stage === 'community_approval_pending').length;
  const payments = dataset.enquiries.reduce((sum, item) => sum + (item.payment?.receivedAt ? item.payment.amountEgp : 0), 0);

  return (
    <div>
      <PageHeader eyebrow="Operator execution" eyebrowAr="تنفيذ المشغل" title="One queue from enquiry to completed stay." titleAr="قائمة واحدة من الطلب حتى اكتمال الإقامة." description="Operators verify, quote above the owner floor, place expiring holds, record payment evidence, submit community cases, and confirm only when every gate is satisfied." descriptionAr="يتحقق المشغل ويصدر سعراً أعلى من حد المالك ويضع حجوزات مؤقتة منتهية ويسجل دليل الدفع ويرسل حالات الكمبوند ولا يؤكد إلا بعد اكتمال كل البوابات." action={<button onClick={() => navigate('/pipeline')} className="button-primary">{bi(lang, 'Open full pipeline', 'افتح المسار الكامل')}<ArrowRight size={15} className="rtl:rotate-180" /></button>} />
      <section className="page-shell py-10">
        <div className="grid gap-3 md:grid-cols-4"><Metric label="Active enquiries" labelAr="طلبات نشطة" value={active.length} /><Metric label="Calendar blocks" labelAr="حجوزات تحجب التقويم" value={holds} detail="Active holds + confirmed" detailAr="الحجوزات المؤقتة النشطة + المؤكدة" tone="terracotta" /><Metric label="Approval queue" labelAr="قائمة الموافقات" value={approvalQueue} /><Metric label="Payments recorded" labelAr="مدفوعات مسجلة" value={money(payments, lang)} tone="ink" /></div>

        {dataset.enquiries.length === 0 ? <div className="mt-10"><EmptyState title="No Live booking enquiries yet" titleAr="لا توجد طلبات حجز فعلية بعد" description="The operator queue is ready. It will populate from a real public home enquiry; Demo enquiries cannot appear here while Live is active." descriptionAr="قائمة المشغل جاهزة. ستظهر السجلات من طلب حقيقي على بيت منشور؛ ولا يمكن للطلبات التجريبية الظهور هنا أثناء الوضع الفعلي." actionLabel="View public homes" actionLabelAr="عرض البيوت العامة" onAction={() => navigate('/')} /></div> : (
          <div className="mt-10 space-y-4">
            {active.map((enquiry) => {
              const home = dataset.properties.find((item) => item.id === enquiry.propertyId);
              if (!home) return null;
              const action = nextAction(enquiry.stage, home.communityApprovalRequired, lang);
              const calendar = calendarEffect(enquiry);
              return <article key={enquiry.id} className="rounded-[1.5rem] border border-clay-200 bg-white p-6">
                <div className="grid gap-6 lg:grid-cols-[1.25fr_.8fr_.8fr_auto] lg:items-center">
                  <div><div className="flex flex-wrap items-center gap-2"><StatusPill tone={enquiry.stage.includes('approval') ? 'warn' : enquiry.stage === 'confirmed' ? 'good' : 'neutral'}>{label(enquiryLabels, enquiry.stage, lang)}</StatusPill><DemoRecordMark /></div><h2 className="mt-3 font-serif text-2xl text-ink-950">{enquiry.guestName} · {lang === 'ar' ? home.nameAr : home.name}</h2><p className="mt-2 text-xs text-ink-500">{enquiry.checkIn} → {enquiry.checkOut} · {enquiry.adults + enquiry.children} {bi(lang, 'guests', 'ضيوف')}</p></div>
                  <div className="space-y-2 text-xs text-ink-600"><span className="flex items-center gap-2"><CircleDollarSign size={14} className="text-terracotta-700" />{enquiry.quote ? money(enquiry.quote.totalEgp, lang) : bi(lang, 'Not quoted', 'لم يتم التسعير')}</span><span className="flex items-center gap-2"><CalendarClock size={14} className="text-terracotta-700" />{calendar.blocksCalendar ? bi(lang, 'Calendar blocked', 'التقويم محجوز') : bi(lang, 'No calendar block', 'لا يوجد حجب للتقويم')}</span></div>
                  <div className="space-y-2 text-xs text-ink-600"><span className="flex items-center gap-2"><UserRoundCheck size={14} className="text-terracotta-700" />{getPartnerName(home.operatorPartnerId)}</span><span className="flex items-center gap-2"><ShieldCheck size={14} className="text-terracotta-700" />{home.communityApprovalRequired ? bi(lang, 'Community gate applies', 'بوابة الكمبوند مطلوبة') : bi(lang, 'No community gate', 'لا توجد بوابة كمبوند')}</span></div>
                  <div className="lg:text-end">
                    {enquiry.stage === 'community_approval_pending' ? mode === 'demo' ? <button onClick={() => recordCommunityApproval(enquiry.id)} className="button-secondary whitespace-nowrap"><CheckCircle2 size={14} />{bi(lang, 'Record issued approval', 'تسجيل موافقة صادرة')}</button> : <StatusPill tone="warn">{bi(lang, 'Await external evidence', 'بانتظار دليل خارجي')}</StatusPill> : action ? <button onClick={() => executeNextEnquiryAction(enquiry.id)} className="button-primary whitespace-nowrap">{action}<ArrowRight size={14} className="rtl:rotate-180" /></button> : <StatusPill>{bi(lang, 'No action', 'لا إجراء')}</StatusPill>}
                  </div>
                </div>
                {enquiry.hold?.expiresAt && <div className={`mt-5 flex items-center gap-2 rounded-xl p-3 text-[10px] ${calendar.blocksCalendar ? 'bg-terracotta-50 text-terracotta-900' : 'bg-clay-100 text-ink-500'}`}><Clock3 size={14} />{bi(lang, 'Hold expires', 'ينتهي الحجز المؤقت')}: {new Date(enquiry.hold.expiresAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-GB')}</div>}
                {enquiry.stage === 'community_approval_pending' && <div className="mt-4 flex gap-2 rounded-xl bg-amber-50 p-3 text-[10px] leading-5 text-amber-900"><AlertTriangle size={14} className="mt-0.5 shrink-0" />{bi(lang, 'The button records an approval already issued by the named authority; it does not let the operator issue one.', 'الزر يسجل موافقة صدرت بالفعل من الجهة المحددة؛ ولا يمنح المشغل صلاحية إصدارها.')}</div>}
              </article>;
            })}
          </div>
        )}
      </section>
    </div>
  );
}
