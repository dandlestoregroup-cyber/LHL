import React from 'react';
import { ArrowLeft, ArrowRight, Coffee, Moon, ShieldCheck, Sparkles, Sun, Users, Waves } from 'lucide-react';
import { useOperating } from '../context/OperatingContext';
import { bi } from '../lib/display';
import type { MomentKey } from '../types';

const canonicalMoments: Array<{
  key: MomentKey;
  slug: string;
  icon: typeof Sun;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  description: string;
  descriptionAr: string;
  criteria: Array<[string, string, string, string]>;
}> = [
  {
    key: 'slow_morning', slug: 'slow-morning', icon: Sun,
    title: 'Slow Morning', titleAr: 'صباح هادئ',
    subtitle: 'Sunlight through linen, fresh coffee, and no reason to rush.',
    subtitleAr: 'ضوء الصباح عبر الكتان، قهوة طازجة، ولا سبب للعجلة.',
    description: 'The residence must prove dawn stillness, comfortable morning light, and a direct relationship with outdoor air.',
    descriptionAr: 'يجب أن يثبت البيت هدوء الفجر، وضوء الصباح المريح، واتصالاً مباشراً بالهواء الطلق.',
    criteria: [
      ['Dawn orientation', 'Useful early light without harsh glare.', 'توجيه الفجر', 'ضوء صباح مفيد بلا وهج مزعج.'],
      ['Acoustic stillness', 'No dominant mechanical or traffic noise.', 'هدوء صوتي', 'لا توجد ضوضاء ميكانيكية أو مرورية مسيطرة.'],
      ['Outdoor threshold', 'A natural step from living space to terrace or garden.', 'اتصال بالخارج', 'انتقال طبيعي من المعيشة إلى التراس أو الحديقة.'],
    ],
  },
  {
    key: 'long_table', slug: 'late-breakfast', icon: Coffee,
    title: 'Late Breakfast', titleAr: 'إفطار متأخر',
    subtitle: 'Shade, breeze, food, and conversation that can comfortably run into midday.',
    subtitleAr: 'ظل ونسيم وطعام وحديث يمكن أن يمتد براحة حتى الظهيرة.',
    description: 'The old internal key remains stable for production compatibility; the canonical guest promise is Late Breakfast.',
    descriptionAr: 'يبقى المفتاح الداخلي القديم ثابتاً لتوافق الإنتاج؛ أما الوعد المعروض للضيف فهو إفطار متأخر.',
    criteria: [
      ['Protected shade', 'Dining remains usable through the hotter part of the day.', 'ظل محمي', 'تظل منطقة الطعام قابلة للاستخدام خلال ساعات الحر.'],
      ['Cross-breeze', 'Natural airflow supports a long outdoor meal.', 'نسيم متقاطع', 'تدفق هواء طبيعي يدعم جلسة طعام طويلة.'],
      ['Easy service flow', 'Kitchen and table work together without disrupting the gathering.', 'خدمة سلسة', 'المطبخ والطاولة يعملان معاً دون إزعاج الجلسة.'],
    ],
  },
  {
    key: 'afternoon_drift', slug: 'barefoot-afternoon', icon: Waves,
    title: 'Barefoot Afternoon', titleAr: 'ظهيرة حافية القدمين',
    subtitle: 'A low-friction path from the residence to water, garden, or cool outdoor ground.',
    subtitleAr: 'طريق بلا تعقيد من البيت إلى الماء أو الحديقة أو أرض خارجية مريحة.',
    description: 'The promise is about physical ease: no unnecessary barriers between indoor comfort and the afternoon outside.',
    descriptionAr: 'الوعد هنا هو سهولة الحركة: لا حواجز غير ضرورية بين راحة الداخل ومتعة الظهيرة بالخارج.',
    criteria: [
      ['Direct outdoor access', 'No awkward route through parking or service corridors.', 'وصول مباشر للخارج', 'لا مسار مزعج عبر الجراج أو ممرات الخدمة.'],
      ['Barefoot comfort', 'Primary outdoor surfaces are pleasant and usable.', 'راحة المشي حافياً', 'الأسطح الخارجية الأساسية مريحة وقابلة للاستخدام.'],
      ['Water or garden proximity', 'The outdoor experience starts within immediate reach.', 'قرب الماء أو الحديقة', 'تبدأ التجربة الخارجية على مسافة قريبة جداً.'],
    ],
  },
  {
    key: 'night_swim', slug: 'family-play', icon: Users,
    title: 'Family Play', titleAr: 'مرح عائلي',
    subtitle: 'Safe movement, visible play zones, and enough separation for adults and children to relax together.',
    subtitleAr: 'حركة آمنة، ومساحات لعب واضحة، وفصل كافٍ ليستمتع الكبار والصغار معاً.',
    description: 'The guest-facing canon prioritizes family ease and supervision rather than treating a pool feature as the promise itself.',
    descriptionAr: 'التجربة المعتمدة تركز على راحة العائلة وسهولة الإشراف بدلاً من اعتبار وجود المسبح هو الوعد بحد ذاته.',
    criteria: [
      ['Clear sightlines', 'Adults can supervise key play areas naturally.', 'رؤية واضحة', 'يمكن للكبار متابعة مناطق اللعب الرئيسية بسهولة.'],
      ['Safe boundaries', 'Hazards and exits are controlled appropriately.', 'حدود آمنة', 'المخاطر والمخارج مضبوطة بالشكل المناسب.'],
      ['Rest + play balance', 'Children can play without consuming the entire adult experience.', 'توازن بين اللعب والراحة', 'يلعب الأطفال دون أن تختفي مساحة راحة الكبار.'],
    ],
  },
  {
    key: 'fire_conversation', slug: 'the-long-sit', icon: Sparkles,
    title: 'The Long Sit', titleAr: 'الجلسة الطويلة',
    subtitle: 'The kind of place where one conversation, book, or sunset can hold you for hours.',
    subtitleAr: 'مكان يمكن أن يحتفظ بك لساعات مع حديث واحد أو كتاب أو غروب.',
    description: 'Comfort, orientation, stillness, and lighting must make extended sitting genuinely desirable rather than merely possible.',
    descriptionAr: 'يجب أن تجعل الراحة والاتجاه والهدوء والإضاءة الجلوس الطويل مرغوباً فعلاً لا ممكناً فقط.',
    criteria: [
      ['Deep comfort', 'Seating supports long, relaxed occupation.', 'راحة عميقة', 'المقاعد تدعم جلسة طويلة ومريحة.'],
      ['View or focal point', 'The space rewards staying rather than passing through.', 'إطلالة أو نقطة تركيز', 'المكان يكافئ البقاء بدلاً من المرور فقط.'],
      ['Evening usability', 'Lighting and acoustics remain comfortable after sunset.', 'قابلية الاستخدام مساءً', 'تظل الإضاءة والصوتيات مريحة بعد الغروب.'],
    ],
  },
  {
    key: 'silent_reading', slug: 'under-stars', icon: Moon,
    title: 'Under Stars', titleAr: 'تحت النجوم',
    subtitle: 'Darkness, open sky, and quiet enough for the night itself to become the activity.',
    subtitleAr: 'سماء مفتوحة وظلام وهدوء يجعل الليل نفسه هو التجربة.',
    description: 'The canonical promise is an evening atmosphere with low visual noise and a credible relationship to the sky.',
    descriptionAr: 'الوعد المعتمد هو أجواء مسائية منخفضة التشويش البصري ولها علاقة حقيقية بالسماء.',
    criteria: [
      ['Low light spill', 'Exterior lighting does not overwhelm the night.', 'تلوث ضوئي منخفض', 'الإضاءة الخارجية لا تطغى على الليل.'],
      ['Open-sky position', 'A terrace, roof, garden, or beach supports sky viewing.', 'موقع مفتوح للسماء', 'تراس أو رووف أو حديقة أو شاطئ يسمح برؤية السماء.'],
      ['Night-time stillness', 'The space remains calm enough for quiet evening use.', 'هدوء ليلي', 'يبقى المكان هادئاً بما يكفي للاستخدام المسائي الهادئ.'],
    ],
  },
];

const bySlug = new Map(canonicalMoments.map((moment) => [moment.slug, moment]));

export function MomentView({ slug, navigate }: { slug: string; navigate: (path: string) => void }) {
  const { lang, publicHomes } = useOperating();
  const active = bySlug.get(slug) || canonicalMoments[0];
  const Icon = active.icon;
  const matchingHomes = publicHomes.filter((home) => home.provenMoments.some((moment) => moment.key === active.key));

  return (
    <div className="bg-[#FAF5EE] text-[#2A201C]">
      <section className="border-b border-[#EBDDD1] bg-[radial-gradient(circle_at_top_left,rgba(200,161,90,.14),transparent_30%),linear-gradient(180deg,#FAF5EE_0%,#F6E8DC_100%)]">
        <div className="page-shell py-12 md:py-20">
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#6D5A50] hover:text-[#B84E36]"><ArrowLeft size={15} className="rtl:rotate-180" />{bi(lang, 'Back to collection', 'العودة للمجموعة')}</button>
          <div className="mt-10 grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-end">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#E2CDBD] bg-white/75 text-[#B84E36]"><Icon size={24} /></div>
              <p className="mt-6 text-[10px] font-black uppercase tracking-[.24em] text-[#C8A15A]">{bi(lang, 'Little Hut Signature Moment', 'لحظة مميزة من ليتل هت')}</p>
              <h1 className="mt-3 font-serif text-5xl leading-none tracking-tight md:text-7xl">{bi(lang, active.title, active.titleAr)}</h1>
              <p className="mt-6 max-w-2xl font-serif text-2xl leading-9 text-[#6D5A50]">{bi(lang, active.subtitle, active.subtitleAr)}</p>
            </div>
            <div className="rounded-[1.75rem] border border-[#E2CDBD] bg-white/70 p-7 shadow-[0_24px_70px_rgba(80,52,39,.08)]">
              <div className="flex items-start gap-3"><ShieldCheck className="mt-1 shrink-0 text-[#B84E36]" size={19} /><p className="text-sm leading-7 text-[#6D5A50]">{bi(lang, active.description, active.descriptionAr)}</p></div>
              <div className="mt-6 grid gap-3">
                {active.criteria.map(([title, desc, titleAr, descAr]) => <div key={title} className="rounded-2xl border border-[#EBDDD1] bg-[#FFFDFC] p-4"><strong className="text-sm text-[#2A201C]">{bi(lang, title, titleAr)}</strong><p className="mt-1 text-xs leading-6 text-[#7D6A60]">{bi(lang, desc, descAr)}</p></div>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-12 md:py-16">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {canonicalMoments.map((moment) => <button key={moment.slug} onClick={() => navigate(`/moments/${moment.slug}`)} className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${moment.slug === active.slug ? 'border-[#B84E36] bg-[#B84E36] text-white' : 'border-[#E2CDBD] bg-white text-[#6D5A50] hover:border-[#B84E36]'}`}>{bi(lang, moment.title, moment.titleAr)}</button>)}
        </div>

        <div className="mt-12 flex items-end justify-between gap-4">
          <div><p className="text-[10px] font-black uppercase tracking-[.22em] text-[#B84E36]">{bi(lang, 'Homes that proved it', 'بيوت أثبتت هذه اللحظة')}</p><h2 className="mt-3 font-serif text-4xl tracking-tight">{matchingHomes.length ? bi(lang, 'Evidence before promise.', 'الدليل قبل الوعد.') : bi(lang, 'No public home has proved this Moment yet.', 'لا يوجد بيت منشور أثبت هذه اللحظة بعد.')}</h2></div>
        </div>

        {matchingHomes.length > 0 && <div className="mt-8 grid gap-6 lg:grid-cols-3">{matchingHomes.map((home) => <button key={home.id} onClick={() => navigate(`/homes/${home.slug}`)} className="group overflow-hidden rounded-[1.6rem] border border-[#E5D5C9] bg-white text-start shadow-sm"><div className="aspect-[4/3] overflow-hidden bg-[#EBDDD1]"><img src={home.heroImage} alt={lang === 'ar' ? home.nameAr : home.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" /></div><div className="p-5"><h3 className="font-serif text-2xl">{lang === 'ar' ? home.nameAr : home.name}</h3><p className="mt-2 text-xs leading-6 text-[#7D6A60]">{lang === 'ar' ? home.locationAr : home.location}</p><span className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#B84E36]">{bi(lang, 'Open residence', 'افتح العقار')}<ArrowRight size={13} className="rtl:rotate-180" /></span></div></button>)}</div>}
      </section>
    </div>
  );
}
