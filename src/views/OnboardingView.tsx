import React from 'react';
import { ArrowRight, BadgeCheck, ClipboardCheck, Compass, Home, KeyRound, Phone, ShieldCheck } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi } from '../lib/display';

const steps = [
  {
    icon: Compass,
    number: '01',
    title: 'Nominate the residence',
    titleAr: 'رشّح العقار',
    body: 'A Scout records the home, location, source, first-contact evidence, and owner consent. Nothing becomes a public claim at this stage.',
    bodyAr: 'يسجل الكشاف البيت والموقع والمصدر ودليل التواصل الأول وموافقة المالك. لا يتحول أي شيء هنا إلى ادعاء عام.',
  },
  {
    icon: ClipboardCheck,
    number: '02',
    title: 'Independent evidence visit',
    titleAr: 'زيارة توثيق مستقلة',
    body: 'A named independent assessor tests TRUST, SHIELD, and the six Little Hut Moments. Only evidenced Moments can later be promised to guests.',
    bodyAr: 'يختبر مقيّم مستقل محدد بوابات الثقة والحماية ولحظات ليتل هت الست. لا يتم وعد الضيوف إلا باللحظات المثبتة بالدليل.',
  },
  {
    icon: KeyRound,
    number: '03',
    title: 'Owner mandate',
    titleAr: 'تفويض المالك',
    body: 'The owner alone chooses go, defer, or decline and sets the accommodation floor and payout readiness. Operators cannot invent this mandate.',
    bodyAr: 'المالك وحده يقرر الاستمرار أو التأجيل أو الرفض ويحدد حد الإقامة وجاهزية التحويل. لا يستطيع المشغل اختلاق هذا التفويض.',
  },
  {
    icon: BadgeCheck,
    number: '04',
    title: 'Activation and Little Hut seal',
    titleAr: 'التفعيل وختم ليتل هت',
    body: 'Only after evidence, owner approval, operator assignment, calendar authority, activation, and readiness can a home become public and bookable.',
    bodyAr: 'لا يصبح البيت منشوراً وقابلاً للحجز إلا بعد الدليل وموافقة المالك وتعيين المشغل وسلطة التقويم والتفعيل والجاهزية.',
  },
] as const;

export function OnboardingView({ navigate }: { navigate: (path: string) => void }) {
  const { lang, mode, auth } = useOperating();
  const canOpenSourcing = mode === 'demo' || auth.partner?.role === 'scout' || Boolean(auth.partner?.platformAdmin);

  return (
    <div className="bg-[#FAF5EE] text-[#2A201C]">
      <section className="border-b border-[#EBDDD1] bg-[radial-gradient(circle_at_top_right,rgba(184,78,54,.12),transparent_34%),linear-gradient(180deg,#FAF5EE_0%,#F7EDE2_100%)]">
        <div className="page-shell grid gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.24em] text-[#B84E36]">{bi(lang, 'Joining Little Hut', 'الانضمام إلى ليتل هت')}</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl leading-[.98] tracking-[-.045em] md:text-7xl">{bi(lang, 'A residence joins by evidence, not by upload.', 'العقار ينضم بالدليل، لا بمجرد رفع إعلان.')}</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-[#6D5A50]">{bi(lang, 'Little Hut is intentionally slower at the front door. We verify what the home can honestly promise, keep the owner’s commercial mandate explicit, and only then let an operator make it bookable.', 'ليتل هت تتعمد التمهل عند البداية. نوثق ما يستطيع البيت أن يعد به بصدق، ونحفظ التفويض التجاري للمالك بشكل صريح، ثم فقط يسمح للمشغل بجعله قابلاً للحجز.')}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button onClick={() => navigate('/joining')} className="button-primary">{bi(lang, 'See the qualification journey', 'شاهد رحلة التأهيل')}<ArrowRight size={15} className="rtl:rotate-180" /></button>
              {canOpenSourcing ? <button onClick={() => navigate('/scout')} className="button-secondary">{bi(lang, 'Open sourcing intake', 'افتح إدخال التوريد')}</button> : <a href="tel:01270228656" className="button-secondary"><Phone size={15} />{bi(lang, 'Speak to Little Hut', 'تواصل مع ليتل هت')}</a>}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#E2CDBD] bg-white/75 p-7 shadow-[0_28px_80px_rgba(80,52,39,.10)]">
            <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FAF0EB] text-[#B84E36]"><ShieldCheck size={21} /></div><div><strong className="font-serif text-2xl">{bi(lang, 'Truth before inventory', 'الحقيقة قبل المخزون')}</strong><p className="mt-1 text-xs text-[#7D6A60]">{bi(lang, 'No self-published Live homes.', 'لا توجد بيوت فعلية تنشر نفسها بنفسها.')}</p></div></div>
            <div className="mt-6 space-y-3 text-xs leading-6 text-[#6D5A50]">
              <p>{bi(lang, '• Scouts may nominate, but cannot certify.', '• الكشاف يستطيع الترشيح، لكنه لا يستطيع الاعتماد.')}</p>
              <p>{bi(lang, '• Assessors may prove Moments, but cannot set owner economics.', '• المقيّم يستطيع إثبات اللحظات، لكنه لا يحدد اقتصاديات المالك.')}</p>
              <p>{bi(lang, '• Owners set the mandate, but cannot issue their own independent proof.', '• المالك يحدد التفويض، لكنه لا يصدر لنفسه دليلاً مستقلاً.')}</p>
              <p>{bi(lang, '• Operators execute bookings, but cannot bypass the gates.', '• المشغل ينفذ الحجوزات، لكنه لا يستطيع تجاوز البوابات.')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-16 md:py-20">
        <div className="max-w-3xl"><span className="text-[10px] font-black uppercase tracking-[.22em] text-[#C8A15A]">{bi(lang, 'The four-part path', 'المسار من أربع مراحل')}</span><h2 className="mt-3 font-serif text-4xl tracking-tight md:text-5xl">{bi(lang, 'From a possible home to a defensible promise.', 'من بيت محتمل إلى وعد يمكن الدفاع عنه.')}</h2></div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {steps.map(({ icon: Icon, number, title, titleAr, body, bodyAr }) => <article key={number} className="rounded-[1.6rem] border border-[#E5D5C9] bg-[#FFFDFC] p-6 shadow-[0_14px_45px_rgba(80,52,39,.06)]"><div className="flex items-center justify-between"><div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FAF0EB] text-[#B84E36]"><Icon size={19} /></div><span className="font-mono text-xs font-bold tracking-[.16em] text-[#C8A15A]">{number}</span></div><h3 className="mt-5 font-serif text-2xl">{bi(lang, title, titleAr)}</h3><p className="mt-3 text-sm leading-7 text-[#6D5A50]">{bi(lang, body, bodyAr)}</p></article>)}
        </div>
      </section>

      <section className="border-y border-[#EBDDD1] bg-white/60">
        <div className="page-shell grid gap-8 py-12 md:grid-cols-3">
          <div><Home size={20} className="text-[#B84E36]" /><h3 className="mt-4 font-serif text-2xl">{bi(lang, 'No listing inflation', 'لا تضخيم للإعلان')}</h3><p className="mt-2 text-xs leading-6 text-[#6D5A50]">{bi(lang, 'Public copy is limited to what the current evidence supports.', 'النص العام يقتصر على ما يدعمه الدليل الحالي.')}</p></div>
          <div><ShieldCheck size={20} className="text-[#B84E36]" /><h3 className="mt-4 font-serif text-2xl">{bi(lang, 'Reserved authority', 'صلاحيات محفوظة')}</h3><p className="mt-2 text-xs leading-6 text-[#6D5A50]">{bi(lang, 'Each role owns a different gate; screen access never grants business authority.', 'كل دور يمتلك بوابة مختلفة؛ فتح الشاشة لا يمنح صلاحية تشغيلية.')}</p></div>
          <div><BadgeCheck size={20} className="text-[#B84E36]" /><h3 className="mt-4 font-serif text-2xl">{bi(lang, 'Seal means current truth', 'الختم يعني حقيقة حالية')}</h3><p className="mt-2 text-xs leading-6 text-[#6D5A50]">{bi(lang, 'A home is public only while the required evidence and operating conditions remain valid.', 'يظل البيت منشوراً فقط ما دامت الأدلة وشروط التشغيل المطلوبة صالحة.')}</p></div>
        </div>
      </section>
    </div>
  );
}