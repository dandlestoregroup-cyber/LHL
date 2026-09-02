import type { EnquiryStage, Language, MomentKey, PartnerRole, SupplyStage } from '../types';

export const bi = (lang: Language, en: string, ar: string) => lang === 'ar' ? ar : en;

export const money = (value: number, lang: Language) => new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-EG', {
  style: 'currency', currency: 'EGP', maximumFractionDigits: 0,
}).format(value);

export const dateLabel = (value: string, lang: Language) => new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', {
  day: 'numeric', month: 'short', year: 'numeric',
}).format(new Date(value));

export const supplyLabels: Record<SupplyStage, { en: string; ar: string }> = {
  sourced: { en: 'Sourced', ar: 'تم الترشيح' },
  owner_engaged: { en: 'Owner engaged', ar: 'تواصل مع المالك' },
  assessment_scheduled: { en: 'Assessment scheduled', ar: 'التقييم مجدول' },
  decision_pending: { en: 'Decision pending', ar: 'قرار المالك معلق' },
  activation_ready: { en: 'Activation ready', ar: 'جاهز للتفعيل' },
  live: { en: 'Live', ar: 'متاح فعلياً' },
  paused: { en: 'Paused', ar: 'متوقف' },
  declined: { en: 'Declined', ar: 'غير مستمر' },
};

export const enquiryLabels: Record<EnquiryStage, { en: string; ar: string }> = {
  received: { en: 'Received', ar: 'تم الاستلام' }, qualified: { en: 'Qualified', ar: 'مؤهل' }, availability_checked: { en: 'Availability checked', ar: 'تم فحص الإتاحة' },
  quoted: { en: 'Quoted', ar: 'تم التسعير' }, hold: { en: 'Hold', ar: 'حجز مؤقت' }, payment_pending: { en: 'Payment pending', ar: 'بانتظار الدفع' },
  payment_received: { en: 'Payment received', ar: 'تم استلام الدفع' }, community_approval_pending: { en: 'Approval pending', ar: 'بانتظار موافقة الكمبوند' },
  community_approved: { en: 'Community approved', ar: 'موافقة الكمبوند صادرة' }, confirmed: { en: 'Confirmed', ar: 'مؤكد' }, completed: { en: 'Completed', ar: 'مكتمل' },
  declined: { en: 'Declined', ar: 'مرفوض' }, expired: { en: 'Expired', ar: 'منتهي' }, cancelled: { en: 'Cancelled', ar: 'ملغي' },
};

export const partnerRoleLabels: Record<PartnerRole, { en: string; ar: string }> = {
  owner: { en: 'Owner', ar: 'مالك' }, scout: { en: 'Scout', ar: 'كشاف' }, operator: { en: 'Operator', ar: 'مشغل' },
  assessor: { en: 'Independent assessor', ar: 'مقيّم مستقل' }, community_authority: { en: 'Community authority', ar: 'جهة اعتماد الكمبوند' },
};

export const momentLabels: Record<MomentKey, { en: string; ar: string }> = {
  slow_morning: { en: 'Slow Morning', ar: 'الصباح الهادئ' }, long_table: { en: 'Long Table', ar: 'المائدة الممتدة' },
  afternoon_drift: { en: 'Afternoon Drift', ar: 'سكون الظهيرة' }, night_swim: { en: 'Night Swim', ar: 'السباحة الليلية' },
  fire_conversation: { en: 'Fire Conversation', ar: 'حوار حول النار' }, silent_reading: { en: 'Silent Reading', ar: 'القراءة الصامتة' },
};

export const label = <T extends string>(map: Record<T, { en: string; ar: string }>, key: T, lang: Language) => map[key][lang];
