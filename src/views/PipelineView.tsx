import React from 'react';
import { CalendarClock, CircleDollarSign, CreditCard, ShieldCheck, Sparkles, UserRoundCheck } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi, enquiryLabels, label, money } from '../lib/display';
import { BOOKING_SPINE } from '../lib/lh-core';
import { DemoRecordMark, EmptyState, PageHeader, StatusPill } from '../components/ui';
import type { EnquiryStage } from '../types';

const groups: Array<{ key: string; title: string; titleAr: string; stages: EnquiryStage[] }> = [
  { key: 'new', title: 'New & qualified', titleAr: 'جديد ومؤهل', stages: ['received', 'qualified', 'availability_checked'] },
  { key: 'commercial', title: 'Quote', titleAr: 'التسعير', stages: ['quoted'] },
  { key: 'hold', title: 'Hold & payment', titleAr: 'الحجز والدفع', stages: ['hold', 'payment_pending', 'payment_received'] },
  { key: 'approval', title: 'Community approval', titleAr: 'موافقة الكمبوند', stages: ['community_approval_pending', 'community_approved'] },
  { key: 'stay', title: 'Confirmed & complete', titleAr: 'مؤكد ومكتمل', stages: ['confirmed', 'completed'] },
  { key: 'closed', title: 'Closed', titleAr: 'مغلق', stages: ['declined', 'expired', 'cancelled'] },
];

export function PipelineView() {
  const { lang, dataset } = useOperating();
  return (
    <div>
      <PageHeader eyebrow="Booking spine" eyebrowAr="مسار الحجز" title="One Enquiry. Every commercial gate." titleAr="طلب واحد وكل البوابات التجارية." description="Cards move through one canonical record. Enquiries and quotes do not block availability; only an active expiring hold or a confirmed stay does." descriptionAr="تتحرك البطاقات داخل سجل موحد. الطلبات والأسعار لا تحجب الإتاحة؛ وحده الحجز المؤقت النشط أو الإقامة المؤكدة يحجب التقويم." />
      <section className="page-shell py-8">
        <div className="booking-spine-bar">{BOOKING_SPINE.map((stage: EnquiryStage, index: number) => <React.Fragment key={stage}><span>{label(enquiryLabels, stage, lang)}</span>{index < BOOKING_SPINE.length - 1 && <i />}</React.Fragment>)}</div>
      </section>
      <section className="page-shell pb-16">
        {dataset.enquiries.length === 0 ? <EmptyState title="No Live enquiries in the booking spine" titleAr="لا توجد طلبات فعلية في مسار الحجز" description="This is a polished empty operating state, not seeded activity. A verified public enquiry will create the first record." descriptionAr="هذه حالة تشغيل فارغة مصممة وليست نشاطاً افتراضياً. أول طلب حقيقي على بيت موثق سينشئ أول سجل." /> : (
          <div className="pipeline-grid">
            {groups.map((group) => {
              const records = dataset.enquiries.filter((item) => group.stages.includes(item.stage));
              return <section key={group.key} className="pipeline-column"><div className="flex items-center justify-between border-b border-clay-200 p-4"><h2 className="text-xs font-bold uppercase tracking-[.13em] text-ink-700">{bi(lang, group.title, group.titleAr)}</h2><span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-clay-100 px-2 text-[10px] font-bold text-ink-600">{records.length}</span></div><div className="space-y-3 p-3">{records.map((enquiry) => {
                const home = dataset.properties.find((item) => item.id === enquiry.propertyId);
                const approvalLabel = enquiry.communityApproval?.status === 'approved' ? bi(lang, 'Approved', 'موافق عليه') : enquiry.communityApproval?.status === 'pending' ? bi(lang, 'Pending', 'معلق') : enquiry.communityApproval?.status === 'declined' ? bi(lang, 'Declined', 'مرفوض') : bi(lang, 'Not submitted', 'لم يُرسل');
                return <article key={enquiry.id} className="rounded-2xl border border-clay-200 bg-white p-4 shadow-sm"><div className="flex items-center justify-between gap-2"><StatusPill tone={enquiry.stage.includes('approval') ? 'warn' : enquiry.stage === 'confirmed' || enquiry.stage === 'completed' ? 'good' : ['declined', 'expired', 'cancelled'].includes(enquiry.stage) ? 'bad' : 'neutral'}>{label(enquiryLabels, enquiry.stage, lang)}</StatusPill><DemoRecordMark /></div><h3 className="mt-4 font-semibold text-ink-900">{enquiry.guestName}</h3><p className="mt-1 text-[11px] text-ink-500">{home ? (lang === 'ar' ? home.nameAr : home.name) : '—'}</p><div className="mt-4 space-y-2 border-t border-clay-100 pt-3 text-[10px] text-ink-500"><span className="flex items-center gap-1.5"><CalendarClock size={12} />{enquiry.checkIn} → {enquiry.checkOut}</span><span className="flex items-center gap-1.5"><CircleDollarSign size={12} />{enquiry.quote ? money(enquiry.quote.totalEgp, lang) : bi(lang, 'Awaiting quote', 'بانتظار التسعير')}</span>{enquiry.payment?.receivedAt && <span className="flex items-center gap-1.5 text-sage-800"><CreditCard size={12} />{bi(lang, 'Payment recorded', 'الدفع مسجل')}</span>}{enquiry.communityApproval?.required && <span className="flex items-center gap-1.5"><ShieldCheck size={12} />{bi(lang, 'Community', 'الكمبوند')}: {approvalLabel}</span>}</div></article>;
              })}{records.length === 0 && <p className="py-8 text-center text-[10px] text-ink-400">{bi(lang, 'No records', 'لا توجد سجلات')}</p>}</div></section>;
            })}
          </div>
        )}
      </section>
    </div>
  );
}
